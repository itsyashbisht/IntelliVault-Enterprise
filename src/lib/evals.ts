import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Types
export interface EvalScores {
  contextRelevance: number; // 0-1: were retrieved chunks relevant to question?
  faithfulness: number; // 0-1: does answer only use chunk content?(LLMs faithfulness)
  answerRelevance: number; // 0-1: does answer actually address the question?
}

interface EvalInput {
  question: string;
  chunks: Array<{ content: string; source: string }>;
  answer: string;
}

const judgeModel = openai("gpt-4o-mini");

async function scoreContextRelevance(
  question: string,
  chunks: EvalInput["chunks"]
): Promise<number> {
  const chunkText = chunks
    .map((c, i) => `[${i + 1} ${c.source}: ${c.content}]`)
    .join("\n\n");

  const { text } = await generateText({
    model: judgeModel,
    prompt: `You are a RAG evaluation judge. Score how relevant the retrieved chunks are to answering the question.
 
QUESTION: ${question}
 
RETRIEVED CHUNKS:
${chunkText}
 
Score 0.0 to 1.0:
- 1.0 = chunks directly and completely address the question
- 0.7 = chunks mostly relevant, minor gaps
- 0.4 = chunks partially relevant
- 0.1 = chunks barely relevant
- 0.0 = chunks completely irrelevant
 
Respond with ONLY a JSON object, no other text:
{"score": 0.95, "reason": "one sentence reason"}`,
    maxOutputTokens: 100,
  });

  return parseScore(text);
}

async function scoreFaithfulness(
  chunks: EvalInput["chunks"],
  answer: string
): Promise<number> {
  const chunkText = chunks
    .map((c, i) => `[${i + 1} ${c.source}: ${c.content}]`)
    .join("\n\n");

  const { text } = await generateText({
    model: judgeModel,
    prompt: `You are a RAG evaluation judge. Score whether the answer is faithful to the retrieved chunks only.
 
RETRIEVED CHUNKS:
${chunkText}
 
ANSWER: ${answer}
 
Score 0.0 to 1.0:
- 1.0 = every claim in answer is supported by chunks, nothing fabricated
- 0.7 = mostly grounded, minor unsupported details
- 0.4 = some claims not supported by chunks
- 0.1 = answer mostly fabricated / ignores chunks
- 0.0 = answer is completely hallucinated
 
Respond with ONLY a JSON object, no other text:
{"score": 0.95, "reason": "one sentence reason"}`,
    maxOutputTokens: 100,
  });

  return parseScore(text);
}

async function scoreAnswerRelevance(
  question: string,
  answer: string
): Promise<number> {
  const { text } = await generateText({
    model: judgeModel,
    prompt: `You are a RAG evaluation judge. Score how well the answer addresses the question asked.
 
QUESTION: ${question}
 
ANSWER: ${answer}
 
Score 0.0 to 1.0:
- 1.0 = answer directly and completely addresses the question
- 0.7 = answer mostly addresses the question, minor gaps
- 0.4 = answer partially addresses the question
- 0.1 = answer barely addresses the question
- 0.0 = answer does not address the question at all
 
Respond with ONLY a JSON object, no other text:
{"score": 0.92, "reason": "one sentence reason"}`,
    maxOutputTokens: 100,
  });

  return parseScore(text);
}

function parseScore(text: string): number {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    const score = Number(parsed.score);
    // Clamp to 0-1 range
    return Math.min(1, Math.max(0, score));
  } catch {
    // If judge returns unexpected format, default to 0.5 (neutral)
    console.error("[eval] Failed to parse score from:", text);
    return 0.5;
  }
}

export async function evaluateRAGResponse(
  input: EvalInput
): Promise<EvalScores> {
  const { chunks, answer, question } = input;

  // Skip eval if no chunks retrieved (nothing to evaluate against)
  if (!chunks || chunks.length === 0) {
    return { contextRelevance: 0, faithfulness: 0.5, answerRelevance: 0 };
  }

  const [contextRelevance, faithfulness, answerRelevance] = await Promise.all([
    await scoreContextRelevance(question, chunks),
    await scoreFaithfulness(chunks, answer),
    await scoreAnswerRelevance(question, answer),
  ]);

  return { contextRelevance, faithfulness, answerRelevance };
}
