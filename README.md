<div align="center">

# IntelliVault

**Enterprise document intelligence — workspace-scoped RAG, streaming AI chat, and team collaboration.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-v6-black?logo=vercel)](https://sdk.vercel.ai)
[![Neon](https://img.shields.io/badge/Neon-pgvector-green?logo=postgresql)](https://neon.tech)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)](https://clerk.com)
[![Groq](https://img.shields.io/badge/LLM-Groq-orange)](https://groq.com)

Upload documents into isolated team workspaces. Ask questions. Get answers grounded in your organization's actual knowledge — with role-based access, source citations, session history, and full auditability.

[Getting Started](#getting-started) · [Architecture](#architecture) · [Tech Stack](#tech-stack) · [API Routes](#api-routes) · [Roadmap](#roadmap)

</div>

---

## Overview

Most "chat with your PDF" demos are single-user, single-document, zero access control. IntelliVault is different.

It's built around **workspaces** — isolated containers where teams upload documents, invite collaborators with specific roles, and chat with an AI that only ever retrieves from that workspace's knowledge base. Every answer is grounded in real documents, with cited sources and persistent session history.

---

## Features

| Feature | Description |
|---|---|
| **Workspace isolation** | Documents, chats, and members scoped per workspace — zero cross-tenant data access |
| **RBAC** | Owner / Editor / Viewer roles enforced at API layer on every route |
| **Document ingestion** | PDF upload → text extraction → chunking → Gemini embedding → pgvector storage |
| **Tool-calling RAG** | LLM autonomously invokes knowledge-base search when relevant, not on every message |
| **Source citations** | Every assistant response shows which documents and chunks backed it |
| **Session persistence** | Conversations saved to DB, titled by LLM, resumable from history sidebar |
| **Email invites** | Invite collaborators by email — works whether or not they have an account |
| **Streaming responses** | Token-by-token streaming via Vercel AI SDK v6 + Groq |
| **Audit logging** | Every action inside a workspace logged with actor, timestamp, and metadata |
| **Settings & danger zone** | Rename workspace, delete with type-to-confirm confirmation |

---

## Architecture

### Workspace model

```
User ──▶ WorkspaceMember (role: owner | editor | viewer) ──▶ Workspace
                                                                  │
                                               ┌──────────────────┼──────────────────┐
                                          Documents          ChatSessions         Invites
                                              │                   │
                                           Chunks            Messages
                                        (embedding)       (sourceChunkIds)
```

### Ingestion pipeline

```
PDF Upload → unpdf extraction → LangChain RecursiveCharacterTextSplitter
  → chunkSize: 1000, overlap: 200, separators: ["\n\n", "\n", " ", ""]
  → Gemini text-embedding-001 (768 dims) via embedMany()
  → bulk INSERT into chunks table with pgvector HNSW index
  → document status: processing → ready
```

### RAG query pipeline

```
User message
  → LLM (Groq LLaMA) decides to call searchKnowledgeBase tool
  → query embedded → cosine similarity search on chunks
  → filtered by workspace_id (tenant isolation)
  → threshold: similarity > 0.65, topK: 5
  → top chunks returned as tool result
  → LLM synthesizes cited answer → streams to client
  → messages persisted to DB via onFinish callback
```

### Tool-calling architecture

```
stopWhen: stepCountIs(3)
  Step 1 → LLM calls searchKnowledgeBase tool
  Step 2 → Tool executes → returns relevant chunks
  Step 3 → LLM reads chunks → streams final answer
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Auth | Clerk |
| Database | Neon — serverless PostgreSQL |
| Vector Search | pgvector — cosine similarity + HNSW index |
| ORM | Drizzle ORM |
| Embeddings | Google Gemini `text-embedding-001` (768 dims) |
| LLM | Groq `meta-llama/llama-4-scout-17b-16e-instruct` |
| AI SDK | Vercel AI SDK v6 |
| PDF Parsing | unpdf |
| Text Splitting | LangChain `RecursiveCharacterTextSplitter` |
| Email | Resend + React Email |
| Styling | Tailwind CSS v4, Linear design system |

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Neon](https://neon.tech) database with `pgvector` extension
- [Clerk](https://clerk.com) application
- [Groq](https://groq.com) API key
- [Google AI Studio](https://aistudio.google.com) API key
- [Resend](https://resend.com) API key

### 1. Clone and install

```bash
git clone https://github.com/itsyashbisht/intellivault
cd intellivault
npm install
```

### 2. Environment variables

```env
# Database
NEON_DATABASE_URL=postgresql://...

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI
GROQ_API_KEY=gsk_...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Email
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database setup

```sql
-- Run once in Neon SQL editor
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE workspace_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired');
CREATE TYPE document_status AS ENUM ('processing', 'ready', 'failed');
CREATE TYPE message_role AS ENUM ('user', 'assistant');
```

```bash
npx drizzle-kit push
```

### 4. Run

```bash
npm run dev
```

---

## Database Schema

Nine tables in dependency order:

```
workspaces
├── workspace_members    (role enum, unique constraint on workspace+user)
├── workspace_invites    (token-based, 7-day expiry, status enum)
├── documents            (status enum: processing → ready → failed)
│   └── chunks           (vector(768), HNSW index, chunk_index, page_number)
├── chat_sessions        (LLM-generated title, userId from Clerk)
│   └── messages         (role enum, content, source_chunk_ids jsonb)
└── activity_logs        (action string, metadata jsonb)
```

All workspace-child tables cascade-delete when parent workspace is removed.

---

## API Routes

| Route | Methods | Access |
|---|---|---|
| `/api/workspaces` | `POST` `GET` | Authenticated |
| `/api/workspaces/[id]` | `GET` `PATCH` `DELETE` | Member / Owner |
| `/api/workspaces/[id]/members` | `GET` `PATCH` `DELETE` | Member / Owner |
| `/api/workspaces/[id]/invites` | `POST` `GET` `DELETE` | Owner/Editor |
| `/api/workspaces/[id]/documents` | `POST` `GET` | Member |
| `/api/workspaces/[id]/documents/[docId]` | `DELETE` | Owner/Editor |
| `/api/workspaces/[id]/chat` | `POST` | Member |
| `/api/workspaces/[id]/chat/sessions` | `POST` `GET` | Member |
| `/api/invites/[token]` | `POST` | Authenticated |

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Landing, sign-in, sign-up
│   ├── (app)/
│   │   ├── dashboard/        # Workspace switcher
│   │   └── workspace/[id]/
│   │       ├── layout.tsx    # Auth guard + sidebar + membership check
│   │       ├── page.tsx      # Workspace home (stats + recent)
│   │       ├── documents/    # Upload + document list
│   │       ├── chat/         # RAG chat + session history
│   │       │   └── [sessionId]/
│   │       ├── members/      # Member management + invite modal
│   │       └── settings/     # Rename + danger zone
│   └── api/
│       ├── workspaces/[id]/
│       │   ├── documents/[docId]/
│       │   ├── chat/sessions/
│       │   ├── members/
│       │   └── invites/
│       └── invites/[token]/
├── components/
│   ├── documents/            # UploadDropzone, DocumentTable, StatusBadge
│   ├── workspace-home/       # StatsCard, RecentDocuments, RecentChats
│   └── ai-elements/          # Chat UI primitives
├── schema/                   # Drizzle table definitions + relations
├── lib/
│   ├── search.ts             # Vector similarity search
│   ├── embedding.ts          # Gemini embedding generation
│   └── chunking.ts           # LangChain text splitter
└── emails/                   # React Email templates
```

---

## Roadmap

The core product is complete. These are the RAG quality upgrades planned next:

**Hybrid search** — combine pgvector cosine similarity with PostgreSQL BM25 full-text search, merged via Reciprocal Rank Fusion. Pure vector search fails on exact terms (names, codes, IDs). Hybrid catches both.

**Query rewriting** — before embedding a follow-up question, rewrite it using conversation history into a standalone query. Fixes the "it" / "that" pronoun retrieval failure in multi-turn conversations.

**Contextual chunking** — prepend document title and section heading to each chunk before embedding. Anthropic's research shows this meaningfully improves retrieval accuracy without increasing chunk size.

**Re-ranking** — Cohere cross-encoder re-ranker on top-K retrieved chunks before passing to LLM. Better precision, fewer hallucinations.

**LLM-as-judge evaluation** — score every response on faithfulness, answer relevance, and context relevance. Display scores in a workspace analytics dashboard.

---

## License

Private project. All rights reserved.

---

<div align="center">

Built by <a href="https://github.com/itsyashbisht">Yash Bisht</a> · Next.js · pgvector · Groq · Gemini · Vercel AI SDK

</div>
