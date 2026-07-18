import {
  index,
  integer,
  pgTable,
  text,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { documents } from "./document";
import { customType } from "drizzle-orm/pg-core";

// Teach Drizzle about tsvector — it has no built-in type for it
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const chunks = pgTable(
  "chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 768 }),
    chunkIndex: integer("chunk_index").notNull(),
    pageNumber: integer("page_number"),
    fts: tsvector("fts"),
  },
  (table) => [
    index("chunk_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);
