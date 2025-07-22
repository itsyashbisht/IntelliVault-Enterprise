/*
  Plain text + Markdown parser
  No external library needed — just read the file as text.
  For markdown, we keep syntax intact so heading detection
  can find ## headings naturally.
*/
export async function extractFromText(file: File): Promise<string> {
  const text = await file.text();

  if (!text || text.trim().length === 0) {
    throw new Error("File appears to be empty.");
  }

  return text;
}
