import { extractText as unpdfExtract } from "unpdf";

/*
  PDF Parser
  Uses unpdf to extract raw text from PDF buffer.
  Returns joined text with double newlines between pages
  so heading detection can find section breaks.
*/
export async function extractFromPDF(file: File): Promise<string> {
  // Convert File to Buffer and extract text
  const bytes = await file.bytes();
  const buffer = new Uint8Array(bytes);

  const { text } = await unpdfExtract(buffer);

  if (!text || text.length === 0) {
    throw new Error("No text could be extracted from this PDF.");
  }

  // Join pages with double newline — preserves page breaks
  // which often coincide with section boundaries
  const fullText = text.join("\n\n");

  if (fullText.trim().length === 0) {
    throw new Error("PDF appears to be empty or contains only images.");
  }

  return fullText;
}
