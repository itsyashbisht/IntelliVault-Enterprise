// sourceChunkIds: array of chunk UUIDs used to generate this response.
// Only populated on assistant messages — powers the citation UI.

import { jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { chatSessions } from "./chatSessions";
import { messageRoleEnum } from "./enums";

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  sourceChunkIds: jsonb("source_chunk_ids").$type<string[]>(),
  contextRelevance: numeric("context_relevance", { precision: 3, scale: 2 }),
  faithfulness: numeric("faithfulness", { precision: 3, scale: 2 }),
  answerRelevance: numeric("answer_relevance", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
