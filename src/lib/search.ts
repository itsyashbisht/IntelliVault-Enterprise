import { generateEmbedding } from "@/lib/embedding";
import { chunks, documents } from "@/schema";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "./db-config";
import { rewriteQuery } from "./rewrite-query";

/*
-> Hybrid RAG: Retrieval Pipeline.
We run TWO retrievers in parallel and fuse their results:
1. Vector search → semantic meaning     (cosine similarity on embeddings)
2. BM25 / FTS    → exact keyword match  (Postgres full-text search)

Each retriever is good at what the other is bad at:
- Vectors catch paraphrases ("car" ~ "automobile") but miss rare terms, IDs, error codes, and exact names.
- BM25 nails exact tokens but has no idea two words mean the same thing.

We merge both ranked lists with Reciprocal Rank Fusion (RRF) so a chunk that BOTH retrievers like floats to the top.
*/

// Result types
interface BaseResult {
  chunkId: string;
  content: string;
  chunkIndex: number;
  documentId: string;
  documentName: string;
}

// Vector search additionally returns a cosine similarity score (0–1).
export interface VectorResult extends BaseResult {
  similarity: number;
}

// BM25 search additionally returns a ts_rank relevance score.
export interface Bm25Result extends BaseResult {
  rank: number;
}

// Final shape returned to callers. After fusion we hand back the vector-shaped
// chunk (it carries `similarity`), so SearchResult mirrors VectorResult.
export type SearchResult = VectorResult;

// Search
export async function searchDocuments(
  history: Array<{ role: string; content: string }>,
  query: string,
  workspaceId: string,
  topK: number = 5,
  threshold: number = 0.55
): Promise<SearchResult[]> {
  // Rewrite the query.
  const rewrittenQuery = await rewriteQuery(query, history);
  // 1. Embed the user query into the same 768-dim space as the stored chunks.
  const queryEmbedding = await generateEmbedding(rewrittenQuery);

  // 2. Cosine distance → similarity. Postgres/pgvector gives us DISTANCE
  //    (0 = identical), so we flip it to SIMILARITY (1 = identical).
  const similarity = sql<number>`1 - (${cosineDistance(
    chunks.embedding,
    queryEmbedding
  )})`;

  // 3. BM25 relevance score. Defined once and reused in both SELECT and
  //    ORDER BY so the ranking and the returned value can never disagree.
  const bm25Rank = sql<number>`ts_rank(${chunks.fts}, plainto_tsquery('english', ${query}))`;

  // 4. Run both retrievers concurrently.
  const [vectorResults, bm25Results] = await Promise.all([
    // --- Vector search ---
    db
      .select({
        chunkId: chunks.id,
        content: chunks.content,
        chunkIndex: chunks.chunkIndex,
        documentId: documents.id,
        documentName: documents.name,
        similarity, // handy for debugging retrieval quality
      })
      .from(chunks)
      .innerJoin(documents, eq(documents.id, chunks.documentId))
      .where(
        and(
          eq(documents.workspaceId, workspaceId),
          gt(similarity, threshold) // drop chunks that aren't relevant enough
        )
      )
      .orderBy(desc(similarity)) // most similar first
      .limit(20),

    // --- BM25 / full-text search ---
    db
      .select({
        chunkId: chunks.id,
        content: chunks.content,
        chunkIndex: chunks.chunkIndex,
        documentId: documents.id,
        documentName: documents.name,
        rank: bm25Rank,
      })
      .from(chunks)
      .innerJoin(documents, eq(documents.id, chunks.documentId))
      .where(
        and(
          eq(documents.workspaceId, workspaceId),
          // @@ = "does this document's tsvector match the query?"
          sql`${chunks.fts} @@ plainto_tsquery('english', ${query})`
        )
      )
      .orderBy(desc(bm25Rank)) // most relevant first
      .limit(20),
  ]);

  // 5. Fuse the two ranked lists into one and return the top K.
  return mergeRRF(vectorResults, bm25Results, topK);
}

/**
 * Reciprocal Rank Fusion(RRF)
 Each chunk scores 1 / (k + rank) per list it appears in chunks found by both retrievers accumulate a higher combined score.
 */
function mergeRRF(
  vectorResults: VectorResult[],
  bm25Results: Bm25Result[],
  topK: number
) {
  // Scores decides the ranking, chunkMap holds the content you hand back.
  const scores = new Map<string, number>(); // chunkId → combined score
  const chunkMap = new Map<string, any>(); // chunkId → chunk data

  // score each vector result
  vectorResults.forEach((chunk, index) => {
    const score = 1 / (index + 60);
    scores.set(chunk.chunkId, (scores.get(chunk.chunkId) ?? 0) + score);
    chunkMap.set(chunk.chunkId, chunk);
  });

  // add BM25 scores on top
  bm25Results.forEach((chunk, index) => {
    const score = 1 / (index + 60);
    scores.set(chunk.chunkId, (scores.get(chunk.chunkId) ?? 0) + score);
    chunkMap.set(chunk.chunkId, chunk);
  });

  // Sort by fused score (highest first), take top K, resolve back to chunks.
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([chunkId]) => chunkMap.get(chunkId));
}
