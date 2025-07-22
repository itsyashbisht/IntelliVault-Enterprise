import mammoth from "mammoth";

/*
  DOCX Parser
  Uses mammoth to extract raw text from Word documents.
  mammoth preserves paragraph structure which helps
  heading detection downstream.
*/
export async function extractFromDOCX(file: File): Promise<string> {
  const bytes = await file.bytes();
  const buffer = Buffer.from(bytes);

  const result = await mammoth.extractRawText({ buffer });

  if (!result.value || result.value.trim().length === 0) {
    throw new Error("No text could be extracted from this Word document.");
  }

  return result.value;
}
