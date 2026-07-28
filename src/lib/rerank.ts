import { CohereClient } from "cohere-ai";
import { SearchResult } from "./search";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function rerankChunks(
  query: string,
  chunks: SearchResult[],
  topK: number = 5
): Promise<SearchResult[]> {
  if (chunks.length === 0) return [];

  // Cohere takes array of strings — use content only
  const documents = chunks.map((c) => c.content);

  const response = await cohere.v2.rerank({
    model: "rerank-v3.5",
    query,
    documents,
    topN: topK,
  });
  console.log(response.results)

  // response.results gives -> index + relevanceScore
  // Map back to original chunks using index
  return response.results.map((r) => chunks[r.index]);
}
