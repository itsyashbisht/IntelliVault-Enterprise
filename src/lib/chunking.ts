import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, // Chunks are around 1000 char.
  chunkOverlap: 200, // Consecutive chunks will share around 200 characters on boundaries, this helps us to maintain context between consecutive chunks.
  separators: ["\n\n", "\n", " ", ""],
});

// This will return array of string (each str is a chunk)
export async function chunkContent(content: string) {
  return await textSplitter.splitText(content.trim());
}

const HEADING_PATTERNS = [
  /^#{1,4}\s+.{2,60}$/m, // ## Markdown heading
  /^\d+[\.\d]*[\.\)]\s+[A-Z].{1,60}$/m, // 1. / 4.2. Numbered heading
  /^[A-Z][A-Z\s\-\:]{4,60}$/m, // ALL CAPS HEADING
  /^.{2,60}\n[=\-]{3,}$/m, // Underline style\n========
];

function detectHeading(chunk: string): string | null {
  // Only check first 120 chars — headings appear at chunk start
  const start = chunk.slice(0, 120).trim();

  for (const pattern of HEADING_PATTERNS) {
    const match = start.match(pattern);
    if (match) {
      return match[0].split("\n")[0].trim();
    }
  }

  return null;
}

// ─── Contextual Chunking ──────────────────────────────────────────────────────
/*
  Prepends document name + nearest section heading to each chunk.
  The contextualized text is ONLY used for embedding — not stored in content.
 
  Why:
  - Embedding model sees full context → better vector placement
  - Query "leave policy entitlement" matches chunk under "4. Leave Policy" even
    if the chunk itself doesn't repeat "leave policy" explicitly
  - Raw chunk still stored in content column for clean display + LLM context
 
  Sliding window approach:
  - Scan chunks in order
  - When heading detected → update currentHeading
  - All chunks inherit last seen heading until next heading appears
*/

export function addContext(chunks: string[], documentName: string): string[] {
  let currentHeading = "General";

  return chunks.map((chunk) => {
    const detected = detectHeading(chunk);
    if (detected) {
      currentHeading = detected;
    }

    // Build context prefix
    const context = `Document: ${documentName}\nSection: ${currentHeading}\n---\n`;

    return context + chunk;
  });
}
