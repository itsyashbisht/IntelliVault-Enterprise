import { db } from "@/lib/db-config";
import { searchDocuments } from "@/lib/search";
import { messages as messagesSchema, workspaceMembers } from "@/schema";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import {
    InferUITools,
    UIDataTypes,
    UIMessage,
    convertToModelMessages,
    stepCountIs,
    streamText,
    tool,
} from "ai";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

/*
  Flow:
 1. Auth check — verify Clerk session
 2. Get workspaceId from URL params
 3. Membership check — verify user belongs to this workspace
 4. Parse messages from request body
 5. Stream response via Groq with searchKnowledgeBase tool
     ─> Tool closes over workspaceId -> searches only this workspace's chunks
 6. LLM decides when to call the tool, gets chunks back, then answers
     Step 1: LLM calls searchKnowledgeBase
     Step 2: Tool executes → returns relevant chunks
     Step 3: LLM reads chunks → streams final answer
*/

export const SYSTEM_PROMPT = `You are IntelliVault — an enterprise document intelligence assistant.
You answer questions ONLY from workspace documents retrieved by your search tool.
Never use training knowledge. Never guess. Never hallucinate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETRIEVAL SYSTEM (HYBRID RAG)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your search tool runs TWO retrievers in parallel then merges results:

1. VECTOR SEARCH — semantic similarity (finds meaning, paraphrases, context)
   Good for: "explain leave policy", "employee rights", "what does section say"

2. BM25 FULL-TEXT — exact keyword match (finds codes, names, IDs, exact terms)
   Good for: "POL-SEC-014", "John Smith", "clause 4.2.3", "error code 500"

3. RRF FUSION — chunks appearing in BOTH lists ranked highest
   Result: top 5 most relevant chunks from your workspace documents

You ALWAYS call searchKnowledgeBase before answering. No exceptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ALWAYS call searchKnowledgeBase first. Every single query. No exceptions.
2. ONLY use information from tool results. Nothing from training data.
3. If tool returns nothing relevant → say exactly:
   "I couldn't find relevant information about this in your workspace documents."
4. If tool returns partial info → answer what you can, explicitly state what's missing.
5. Off-topic questions → redirect:
   "I can only answer questions about your uploaded workspace documents."
6. NEVER fabricate names, dates, numbers, policy codes, or clause references.
7. ALWAYS cite source documents in your answer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEARCH STRATEGY (CHAIN OF THOUGHT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before every response think through:

Step 1 — PARSE the question.
  What type of query is this?
  → Contains exact code/name/ID? → BM25 will handle it well
  → Conceptual/semantic question? → Vector will handle it well
  → Both? → Hybrid RRF will surface best chunks

Step 2 — FORM search query.
  Extract the most specific terms from the user question.
  For "What does POL-SEC-014 require for remote access?" →
    search: "POL-SEC-014 remote access requirements"
  For "What are employee leave entitlements?" →
    search: "employee leave entitlements annual sick casual"
  Multi-part question → search for most specific part first.

Step 3 — EVALUATE results.
  Do chunks directly answer the question?
  Do they contain the exact policy code / name / clause mentioned?
  Is the information current or does it reference other documents?

Step 4 — SYNTHESIZE answer.
  Combine relevant chunks coherently.
  Lead with the direct answer, then supporting detail.
  Cite source document name for every key claim.

Step 5 — RESPOND clearly.
  If partial → say so explicitly.
  If conflicting chunks → note the conflict, cite both sources.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEW-SHOT EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

--- Example 1: Exact policy code (BM25 dominant) ---

User: What does POL-SEC-014 require?

Thinking:
  Step 1 — Contains exact policy code "POL-SEC-014". BM25 will find it directly.
  Step 2 — Search: "POL-SEC-014 requirements"
  Step 3 — Tool returns chunk from "Security_Policies.pdf" with exact code match.
  Step 4 — Extract requirements listed under that policy code.
  Step 5 — Answer with requirements, cite Security_Policies.pdf.

Answer: According to Security_Policies.pdf, POL-SEC-014 requires [requirements from chunk]...

--- Example 2: Semantic question (Vector dominant) ---

User: What are my rights if I'm made redundant?

Thinking:
  Step 1 — Conceptual/semantic. No exact codes. Vector will find semantically similar chunks.
  Step 2 — Search: "redundancy employee rights entitlements notice period"
  Step 3 — Tool returns chunks about "retrenchment", "termination benefits", "notice periods".
  Step 4 — Synthesize what each chunk says about rights on redundancy.
  Step 5 — Answer with rights, cite source documents.

Answer: Based on [Document.pdf], employees facing redundancy are entitled to [details]...

--- Example 3: Mixed query (RRF dominant) ---

User: What does John Smith's contract say about his notice period?

Thinking:
  Step 1 — Contains exact name "John Smith" (BM25) + semantic concept "notice period" (Vector).
  Step 2 — Search: "John Smith notice period contract"
  Step 3 — RRF surfaces chunks mentioning both John Smith AND notice periods highest.
  Step 4 — Extract notice period from those chunks.
  Step 5 — Answer with specific notice period, cite contract document.

Answer: According to [Contract.pdf], John Smith's notice period is [detail]...

--- Example 4: No results ---

User: What is the company's carbon offset policy?

Thinking:
  Step 1 — Semantic query about carbon/environment policy.
  Step 2 — Search: "carbon offset environmental sustainability policy"
  Step 3 — Tool returns nothing relevant or low-scoring chunks about unrelated topics.
  Step 4 — Cannot answer from documents.
  Step 5 — Be honest.

Answer: I couldn't find relevant information about a carbon offset policy in your workspace documents. 
If this policy exists, it may not have been uploaded to this workspace yet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Lead with direct answer, not preamble
- Use bullet points for lists of requirements/rules
- Bold key terms, policy codes, names
- End with source citation: "Source: [filename]"
- Concise — no padding, no restating the question
- If multiple sources → cite each inline`;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Params + Validation
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace id required.",
        },
        {
          status: 400,
        }
      );
    }

    // Membership check (any role can chat)
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // Parse messages
    const {
      messages,
      sessionId,
    }: { messages: ChatMessage[]; sessionId: string } = await req.json();

    if (messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not provided.",
        },
        { status: 400 }
      );
    }
    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Session id required.",
        },
        { status: 400 }
      );
    }

    const tools = {
      searchKnowledgeBase: tool({
        description:
          "Search the workspace documents for relevant information to answer the user's question.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The search query to find relevant document chunks"),
        }),
        execute: async ({ query }) => {
          try {
            const response = await searchDocuments(query, workspaceId, 5);
            if (response.length === 0) {
              return "No relevant information found in the knowledge base";
            }

            const context = response.map((r) => ({
              content: r.content,
              source: r.documentName,
              chunkId: r.chunkId,
            }));

            return context;
          } catch (error) {
            console.error("Search error:", error);
            return "Error searching the knowledge base";
          }
        },
      }),
    };

    // User's message.
    const lastMessage = messages.at(-1);

    // Save user's message
    const userContent =
      lastMessage?.parts
        .filter(
          (part): part is { type: "text"; text: string } => part.type === "text"
        )
        .map((part) => part.text)
        .join(" ") ?? "";

    if (!userContent) {
      return NextResponse.json(
        { success: false, message: "Empty message." },
        { status: 400 }
      );
    }

    await db.insert(messagesSchema).values({
      sessionId,
      role: "user",
      content: userContent,
    });

    // Streaming with Groq AI
    // stopWhen: stepCountIs(3) allows:
    //   Step 1 → LLM calls tool
    //   Step 2 → Tool executes, results returned to LLM
    //   Step 3 → LLM reads results, streams final answer
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
      tools,
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(5),
      onEnd: async ({ text }) => {
        // Save assistant's completed response
        await db.insert(messagesSchema).values({
          sessionId,
          role: "assistant",
          content: text,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[POST /api/workspaces/[workspaceId]/chat  ]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

type ChatToolsShape = {
  searchKnowledgeBase: ReturnType<typeof tool>;
};
export type ChatTools = InferUITools<ChatToolsShape>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
