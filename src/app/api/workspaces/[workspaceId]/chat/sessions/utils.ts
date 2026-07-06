import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function generateTitle(firstMessage: string): Promise<string> {
  try {
    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a short 4-6 word title for a chat session based on this first message. 
      Return ONLY the title, no quotes, no punctuation at the end.
      Message: "${firstMessage}"`,
      maxOutputTokens: 30,
    });
    return result.text.trim();
  } catch {
    // fallback to smart truncation
    return firstMessage
      .replace(
        /^(can you|please|help me|what is|what are|how to|explain)\s/i,
        "",
      )
      .slice(0, 40)
      .trim();
  }
}
