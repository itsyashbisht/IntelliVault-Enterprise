import { extractFromPDF } from "./pdf";
import { extractFromDOCX } from "./docs";
import { extractFromText } from "./text";

// Supported MIME types
export const SUPPORTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
] as const;

export type SupportedMimeType = (typeof SUPPORTED_TYPES)[number];

export function isSupportedType(type: string): type is SupportedMimeType {
  return SUPPORTED_TYPES.includes(type as SupportedMimeType);
}

/*
  Parser router — picks the right parser based on file MIME type.
  All parsers return a plain text string.
  Throws if file type is unsupported.
*/
export async function extractTextFromFile(file: File): Promise<string> {
  if (!isSupportedType(file.type)) {
    throw new Error(
      `Unsupported file type: ${file.type}. Supported: PDF, DOCX, TXT, MD`
    );
  }

  switch (file.type) {
    case "application/pdf":
      return extractFromPDF(file);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractFromDOCX(file);

    case "text/plain":
    case "text/markdown":
      return extractFromText(file);
  }
}
