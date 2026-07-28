<div align="center">

# IntelliVault

### Enterprise document intelligence for teams

Upload documents. Ask questions. Get precise, cited answers — grounded in your organization's knowledge, isolated by workspace, and secured with role-based access.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E699?logo=postgresql&logoColor=white)](https://neon.tech)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![OpenAI](https://img.shields.io/badge/LLM-GPT--4o--mini-412991?logo=openai&logoColor=white)](https://openai.com)
[![Cohere](https://img.shields.io/badge/Rerank-Cohere-39594D?logoColor=white)](https://cohere.com)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-v6-black?logo=vercel)](https://sdk.vercel.ai)

<br />

[Getting Started](#getting-started) · [Architecture](#architecture) · [Tech Stack](#tech-stack) · [API](#api-routes)

</div>

---

## Overview

IntelliVault is a workspace-scoped RAG platform for teams that need document Q&A with real product constraints: multi-tenancy, access control, citations, and evaluation — not a single-user PDF chatbot.

| Challenge                            | How IntelliVault solves it                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| Cross-tenant data risk               | **Workspaces** isolate documents, chats, and members                           |
| Uncontrolled access                  | **RBAC** — Owner / Editor / Viewer, enforced on every API route                |
| Missed exact terms or weak semantics | **Hybrid retrieval** — vector + BM25, fused with RRF, then Cohere rerank       |
| Hallucinated answers                 | **Grounded generation** with source citations on every response                |
| Lost conversations                   | **Persistent sessions** — saved, auto-titled, and resumable                    |
| No quality signal                    | **LLM-as-judge eval** — relevance, faithfulness, and answer quality dashboards |

---

## Demo

> Demo video coming soon.

<!--
Replace with your recording when ready:

<a href="YOUR_DEMO_LINK">
  <img src="YOUR_THUMBNAIL_URL" alt="IntelliVault product demo" width="720" />
</a>
-->

**Try the flow:** sign up → create a workspace → upload a PDF → ask a question → inspect citations and eval scores.

---

## Product Features

### Workspaces & collaboration

- Isolated workspaces for documents, chats, members, and activity
- Invite collaborators by email (works with or without an existing account)
- Owner / Editor / Viewer roles enforced at the API layer
- Audit log for workspace actions

### Document intelligence

- Multi-format ingestion: PDF, DOCX, TXT, Markdown
- Automatic parse → chunk → embed → index pipeline
- Contextual chunking (document name + section heading) for better retrieval
- Status tracking: processing → ready / failed

### Chat & retrieval

- Streaming RAG chat powered by Vercel AI SDK
- Query rewriting for conversational follow-ups
- Hybrid search: pgvector + Postgres BM25
- Reciprocal Rank Fusion + Cohere reranking for precision
- Source citations on assistant responses
- Session history with LLM-generated titles

### Quality & operations

- Per-response LLM-as-judge scores (context relevance, faithfulness, answer relevance)
- Workspace eval dashboard for owners and editors
- Toast feedback for key user actions
- Responsive workspace UI (mobile drawer nav, full-width chat)

---

## Architecture

IntelliVault has two paths: **ingestion** (write) and **retrieval** (read). Both are workspace-scoped end to end.

```mermaid
flowchart LR
    subgraph Ingest ["Ingestion"]
        A([Upload]) --> B[Extract and chunk]
        B --> C[Embed and index]
    end

    C --> D[(Knowledge base<br/>pgvector + tsvector)]

    subgraph Retrieve ["Retrieval"]
        E([Question]) --> F[Hybrid search + rerank]
        F --> G[LLM synthesis]
        G --> H([Cited streamed answer])
    end

    D -. workspace-scoped chunks .-> F
```

### Ingestion pipeline

```mermaid
flowchart TD
    A([Upload PDF / DOCX / TXT / MD]) --> B[Text extraction]
    B --> C[Chunking · 1000 chars · 200 overlap]
    C --> C2[Contextual enrichment]
    C2 --> D[Gemini embedding · 768 dims]
    C --> E[Postgres tsvector]
    D --> F[(chunks · pgvector HNSW)]
    E --> F
    F --> G([Document ready])
```

### Retrieval pipeline

```mermaid
flowchart TD
    A([User question]) --> QR[Query rewrite]
    QR --> B[LLM agent · search tool]
    B --> C[searchKnowledgeBase]

    C --> D[Vector search · top 20]
    C --> E[BM25 full-text · top 20]

    D --> F[RRF fusion · top 20]
    E --> F
    F --> RR[Cohere rerank · top K]
    RR --> G[Grounded LLM synthesis]
    G --> H([Streamed answer + citations])
    H --> EV[LLM-as-judge eval]
    EV --> I[(Session history + scores)]
```

| Stage             | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| **Vector search** | Meaning and paraphrases (`leave policy` ≈ `vacation rules`) |
| **BM25**          | Exact tokens, IDs, policy codes, names                      |
| **RRF**           | Fuse ranked lists so agreement rises to the top             |
| **Cohere rerank** | Cross-encode query vs candidates for final precision        |

---

## User Flow

1. **Sign in** with Clerk
2. **Create or join** a workspace from the dashboard
3. **Upload documents** — indexing runs automatically
4. **Chat** — ask questions, follow up, resume sessions
5. **Collaborate** — invite members, manage roles, review eval scores

```mermaid
flowchart LR
    A([Sign in]) --> B[Dashboard]
    B --> C{Workspace}
    C -->|create| D[Owner workspace]
    C -->|invite| E[Accept invite]
    D --> F[Workspace home]
    E --> F
    F --> G[Upload docs]
    F --> H[RAG chat]
    G --> H
    H --> I[(Session history)]
```

---

## Data Model

```mermaid
erDiagram
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    WORKSPACES ||--o{ WORKSPACE_INVITES : has
    WORKSPACES ||--o{ DOCUMENTS : has
    WORKSPACES ||--o{ CHAT_SESSIONS : has
    WORKSPACES ||--o{ ACTIVITY_LOGS : has
    DOCUMENTS ||--o{ CHUNKS : contains
    CHAT_SESSIONS ||--o{ MESSAGES : contains

    WORKSPACE_MEMBERS {
        enum role "owner editor viewer"
        string userId
    }
    DOCUMENTS {
        enum status "processing ready failed"
    }
    CHUNKS {
        vector embedding "768 dims"
        tsvector fts
    }
    MESSAGES {
        enum role "user assistant"
        jsonb sourceChunkIds
    }
```

Deleting a workspace cascade-deletes its children.

---

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| App        | Next.js 16 (App Router), TypeScript 5                   |
| Auth       | Clerk                                                   |
| Database   | Neon PostgreSQL + pgvector                              |
| ORM        | Drizzle                                                 |
| Embeddings | Google Gemini `gemini-embedding-001` (768 dims)         |
| LLM        | OpenAI `gpt-4o-mini` via Vercel AI SDK                  |
| Rerank     | Cohere `rerank-v3.5`                                    |
| Search     | pgvector cosine + Postgres `tsvector` / `ts_rank` + RRF |
| Parsing    | unpdf, mammoth                                          |
| Chunking   | LangChain `RecursiveCharacterTextSplitter`              |
| Email      | Resend + React Email                                    |
| UI         | Tailwind CSS v4, Sonner                                 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Neon project with the `vector` extension
- Clerk application
- OpenAI API key
- Google AI Studio API key (embeddings)
- Cohere API key (reranking)
- Resend API key (invites)

### 1. Clone and install

```bash
git clone https://github.com/itsyashbisht/IntelliVault-Enterprise.git
cd IntelliVault-Enterprise
npm install
```

### 2. Configure environment

Create `.env.local`:

```env
# Database
NEON_DATABASE_URL=postgresql://...

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
COHERE_API_KEY=...

# Email / app URL
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Prepare the database

Run once in the Neon SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE workspace_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE invite_status   AS ENUM ('pending', 'accepted', 'expired');
CREATE TYPE document_status AS ENUM ('processing', 'ready', 'failed');
CREATE TYPE message_role    AS ENUM ('user', 'assistant');
```

Push the schema:

```bash
npx drizzle-kit push
```

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create a workspace, upload a document, and ask a question.

---

## API Routes

| Route                                    | Methods                | Access         |
| ---------------------------------------- | ---------------------- | -------------- |
| `/api/workspaces`                        | `GET` `POST`           | Authenticated  |
| `/api/workspaces/[id]`                   | `GET` `PATCH` `DELETE` | Member / Owner |
| `/api/workspaces/[id]/members`           | `GET` `PATCH` `DELETE` | Member / Owner |
| `/api/workspaces/[id]/invites`           | `GET` `POST` `DELETE`  | Owner / Editor |
| `/api/workspaces/[id]/documents`         | `GET` `POST`           | Member         |
| `/api/workspaces/[id]/documents/[docId]` | `DELETE`               | Owner / Editor |
| `/api/workspaces/[id]/chat`              | `POST`                 | Member         |
| `/api/workspaces/[id]/chat/sessions`     | `GET` `POST`           | Member         |
| `/api/workspaces/[id]/eval`              | `GET`                  | Owner / Editor |
| `/api/invites/[token]`                   | `POST`                 | Authenticated  |

---

## Project Structure

```text
src/
├── app/
│   ├── (marketing)/           # Landing, sign-in, sign-up
│   ├── (app)/
│   │   ├── dashboard/         # Workspace switcher
│   │   └── workspace/[id]/
│   │       ├── documents/     # Upload + library
│   │       ├── chat/          # RAG chat + history
│   │       ├── eval/          # Quality dashboard
│   │       ├── members/       # Roles + invites
│   │       └── settings/      # Rename + danger zone
│   └── api/                   # REST handlers
├── components/                # UI by domain
├── schema/                    # Drizzle models
├── lib/
│   ├── search.ts              # Vector + BM25 + RRF
│   ├── rerank.ts              # Cohere reranker
│   ├── rewrite-query.ts       # Conversational rewrite
│   ├── evals.ts               # LLM-as-judge
│   ├── embedding.ts           # Gemini embeddings
│   ├── chunking.ts            # Split + contextualize
│   └── parsers/               # PDF / DOCX / TXT / MD
└── emails/                    # React Email templates
```

---

## Roadmap

**Shipped**

- [x] Hybrid search (pgvector + BM25 + RRF)
- [x] Cohere reranking on fused candidates
- [x] Query rewriting for follow-ups
- [x] Contextual chunking
- [x] Multi-format ingestion
- [x] LLM-as-judge evaluation dashboard
- [x] Mobile-responsive workspace chrome

**Next**

- [ ] Agentic multi-step retrieval for complex questions
- [ ] Document-level permissions within a workspace
- [ ] Exportable eval reports
- [ ] Production observability (latency, retrieval hit rate)

---

## License

Private project. All rights reserved.

---

<div align="center">

Built by [Yash Bisht](https://github.com/itsyashbisht)

Next.js · Neon · pgvector · Clerk · OpenAI · Gemini · Cohere · Vercel AI SDK

</div>
