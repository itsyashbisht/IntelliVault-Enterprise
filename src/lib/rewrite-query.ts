import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function rewriteQuery(
  query: string,
  history: Array<{ role: string; content: string }> // conversation-History.
): Promise<string> {
  // If no history or first message → no rewriting needed
  if (history.length === 0) return query;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Rewrite the user's question as a standalone search query using conversation context.Return ONLY the rewritten query. No explanation. No quotes.
    
    
    Conversation history:
    ${history.map((m) => `${m.role}: ${m.content}`).join("\n")}
    
    User's question: ${query}
    Standalone search query:`,
    maxOutputTokens: 60,
  });

  return text.trim() || query; // fallback to original if rewrite fails
}
