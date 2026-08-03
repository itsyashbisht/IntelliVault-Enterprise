<div align="center">

<img src="https://img.shields.io/badge/IntelliVault-Enterprise-5e6ad2?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIzIiB5PSI0IiB3aWR0aD0iMy41IiBoZWlnaHQ9IjE2IiByeD0iMSIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTMgNCBMMTcuNSAxNiBMMjIgNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjxyZWN0IHg9IjMiIHk9IjEwLjI1IiB3aWR0aD0iOSIgaGVpZ2h0PSIyIiByeD0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==" alt="IntelliVault" />

# IntelliVault Enterprise

**Production-grade enterprise RAG platform — workspace-scoped document intelligence with hybrid search, streaming AI chat, LLM-as-judge evaluation, and SaaS billing.**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK_v7-000000?style=flat-square&logo=vercel&logoColor=white)](https://sdk.vercel.ai)
[![Neon](https://img.shields.io/badge/Neon_pgvector-00E699?style=flat-square&logo=postgresql&logoColor=black)](https://neon.tech)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://intellivault-phi.vercel.app)

[Live Demo](https://intellivault-phi.vercel.app) · [GitHub](https://github.com/itsyashbisht/IntelliVault-Enterprise) · [LinkedIn](https://linkedin.com/in/yashbisht)

</div>

---

## Overview

Most "chat with your PDF" demos are single-user, flat document lists, and zero access control. **IntelliVault is different.**

It's a full SaaS product built around team **workspaces** — isolated containers where organisations upload documents, invite collaborators with specific roles, and get AI answers grounded strictly in their knowledge base. Every response is cited, every quality metric is measured, and every API call is billing-aware.

| | |
|---|---|
| **Problem** | Knowledge workers waste hours searching internal documents, policies, and handbooks — with no guarantee the AI answer is accurate |
| **Solution** | A production RAG pipeline with hybrid retrieval, contextual chunking, query rewriting, re-ranking, and automated quality evaluation |
| **For** | Engineering teams, legal teams, HR departments, and any organisation that needs to make large document collections searchable and conversational |

---

## Features

### Core Features

- **Multi-tenant workspaces** — isolated document collections, chat sessions, and member management per workspace
- **Role-based access control** — Owner / Editor / Viewer roles enforced at the API layer on every route, never just the frontend
- **Document ingestion pipeline** — PDF, DOCX, TXT, and Markdown parsed, chunked, embedded, and indexed automatically
- **Streaming RAG chat** — token-by-token streaming via Vercel AI SDK v7 with tool-calling architecture
- **Source citation chips** — every assistant response shows which documents backed it
- **Session persistence** — conversations saved to DB, titled by LLM, resumable from history sidebar
- **Email invite system** — invite collaborators by email with tokenized links; works with or without an existing account
- **SaaS billing** — Stripe-powered Free / Pro / Team tiers with usage limits enforced server-side (not just UI guards)

### Advanced Features

- **Hybrid search** — pgvector cosine similarity + Postgres BM25 full-text search, fused via Reciprocal Rank Fusion (RRF)
- **Contextual chunking** — document name + detected section heading prepended before embedding; raw chunk stored for display
- **Query rewriting** — follow-up questions rewritten into standalone queries using last 6 messages of conversation history
- **Cohere re-ranking** — hybrid search returns top 20 chunks; Cohere cross-encoder re-ranks to top 5 before LLM
- **LLM-as-judge evaluation** — three parallel GPT-4o-mini calls score every response on Context Relevance, Faithfulness, and Answer Relevance
- **Eval dashboard** — per-workspace averages + per-session breakdown + lowest-scoring sessions panel
- **30-day billing cycles** — rolling 30 days from subscription date, not calendar month boundary
- **Audit logging** — every action inside a workspace logged with actor, timestamp, and metadata

### Future Improvements

- [ ] HyDE — embed a hypothetical answer instead of the raw query for better semantic matching
- [ ] Multi-document cross-referencing agent — reason across multiple documents in one response
- [ ] Chunk-level thumbs up/down feedback → future retrieval fine-tuning signal
- [ ] Scheduled email digests of workspace activity
- [ ] Real-time member presence in workspace chat

---

## Eval Results

Every assistant response is automatically scored. Current workspace averages:

| Metric | Before | After (full pipeline) | Meaning |
|---|---|---|---|
| **Context Relevance** | 0.10 | **0.88** | Right chunks retrieved |
| **Faithfulness** | 0.70 | **0.97** | No hallucination |
| **Answer Relevance** | 0.70 | **0.97** | Question directly answered |

The 8.8× improvement in Context Relevance came from contextual chunking alone — before vs after re-uploading with document name + section heading prepended.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, Server Components, Route Groups)
- **TypeScript 5** — strict mode throughout
- **Tailwind CSS v4** — Linear-inspired dark design system
- **Vercel AI SDK v7** — `useChat`, `streamText`, tool-calling, `UIMessage` types

### Backend
- **Next.js Route Handlers** — all API logic, no separate server
- **Drizzle ORM** — type-safe queries, relations, migrations
- **Zod** — request validation on every route

### Database
- **Neon** — serverless PostgreSQL with connection pooling
- **pgvector** — `vector(768)` column with HNSW index for cosine similarity
- **Postgres full-text search** — `tsvector` generated column with GIN index for BM25

### AI & Retrieval
- **OpenAI `gpt-4o-mini`** — LLM inference, query rewriting, LLM-as-judge evaluation
- **Google Gemini `gemini-embedding-001`** — 768-dim text embeddings via `embedMany()`
- **Cohere `rerank-v3.5`** — cross-encoder re-ranking on top-20 retrieved chunks

### Authentication & Billing
- **Clerk** — authentication, session management, `useUser()` / `auth()` server-side
- **Stripe** — checkout sessions, webhook-driven plan management, customer portal

### Email & Parsing
- **Resend** — transactional email for workspace invites
- **React Email** — typed email templates
- **unpdf** — PDF text extraction
- **mammoth** — DOCX text extraction
- **LangChain `RecursiveCharacterTextSplitter`** — 1000-char chunks, 200-char overlap

### Cloud & Deployment
- **Vercel** — production deployment, serverless functions, Edge runtime
- **Neon** — serverless Postgres with auto-scaling

---

## Project Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  Next.js App Router · Server Components · Vercel AI SDK useChat  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP / SSE streaming
┌──────────────────────────────▼──────────────────────────────────┐
│                      API LAYER (Next.js)                          │
│  Route Handlers · Clerk auth() · Drizzle ORM · Zod validation    │
└──────┬──────────────────┬───────────────────┬───────────────────┘
       │                  │                   │
┌──────▼──────┐  ┌────────▼───────┐  ┌───────▼────────┐
│  Neon DB    │  │  External AI   │  │    Stripe      │
│  pgvector   │  │  OpenAI        │  │  Checkout      │
│  BM25 fts   │  │  Gemini        │  │  Webhooks      │
│  Drizzle    │  │  Cohere        │  │  Portal        │
└─────────────┘  └────────────────┘  └────────────────┘
```

### Ingestion Pipeline

```
File Upload (PDF/DOCX/TXT/MD)
        │
        ▼
Text Extraction          unpdf · mammoth · raw text
        │
        ▼
Chunking                 RecursiveCharacterTextSplitter
                         1000 chars · 200 overlap
        │
        ├─────────────────────────────────────┐
        │                                     │
        ▼                                     ▼
Contextual Enrichment              Keyword Indexing
"Document: X | Section: Y          tsvector GENERATED ALWAYS
 --- [raw chunk]"                  GIN index for BM25
        │
        ▼
Gemini Embedding                   768-dim vector per chunk
        │
        ▼
chunks table              content · embedding · fts
                          HNSW index · GIN index
```

### Retrieval Pipeline (Hybrid RAG)

```
User question
      │
      ▼
Query Rewriting           GPT-4o-mini + last 6 messages
      │
      ├──────────────────────────┐
      │                          │
      ▼                          ▼
Vector Search               BM25 Search
cosineDistance()            ts_rank(fts, query)
top 20 by similarity        top 20 by keyword rank
      │                          │
      └────────────┬─────────────┘
                   │
                   ▼
Reciprocal Rank Fusion      score = Σ 1/(rank + 60)
top 20 fused results
                   │
                   ▼
Cohere Re-ranking           cross-encoder reads query + chunk
top 5 most relevant
                   │
                   ▼
LLM Synthesis               GPT-4o-mini · grounded · streamed
                   │
                   ▼
LLM-as-judge Eval           3× parallel calls → scores saved to DB
```

### Workspace Data Model

```
workspaces
├── workspace_members      role: owner | editor | viewer
├── workspace_invites      token · 7-day expiry · status enum
├── documents              status: processing | ready | failed
│   └── chunks             vector(768) HNSW + tsvector GIN
│                          contextual embedding · raw content
├── chat_sessions          LLM-generated title
│   └── messages           source_chunk_ids jsonb
│                          context_relevance · faithfulness · answer_relevance
└── activity_logs          actor · action · metadata

billing (user-level, not workspace-level)
  userId · plan · stripeCustomerId · messageCount · messageResetAt
```

---

## Folder Structure

```
intellivault-enterprise/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Public routes — landing, pricing, sign-in/up
│   │   ├── (app)/
│   │   │   ├── dashboard/         # Workspace switcher + create workspace
│   │   │   ├── billing/           # Plan management, usage meters, success page
│   │   │   └── workspace/[id]/
│   │   │       ├── layout.tsx     # Auth guard + sidebar + membership check
│   │   │       ├── documents/     # Upload dropzone + document table
│   │   │       ├── chat/          # RAG chat + session history sidebar
│   │   │       │   └── [sessionId]/
│   │   │       ├── eval/          # LLM-as-judge evaluation dashboard
│   │   │       ├── members/       # Member list + invite modal
│   │   │       └── settings/      # Rename + danger zone
│   │   └── api/
│   │       ├── workspaces/[id]/
│   │       │   ├── documents/[docId]/
│   │       │   ├── chat/sessions/
│   │       │   ├── members/
│   │       │   ├── invites/
│   │       │   └── eval/
│   │       ├── invites/[token]/
│   │       └── billing/
│   │           ├── checkout/      # Stripe checkout session
│   │           ├── portal/        # Stripe customer portal
│   │           └── webhook/       # Stripe webhook handler
│   ├── components/
│   │   ├── documents/             # UploadDropzone · DocumentTable · StatusBadge
│   │   ├── eval/                  # ScoreCard · SessionTable · WorstSessions
│   │   ├── workspace-home/        # StatsCard · RecentDocuments · RecentChats
│   │   ├── dashboard/             # WorkspaceCard · CreateWorkspaceModal
│   │   └── ai-elements/           # Chat UI primitives (Message · Response · Citation)
│   ├── schema/                    # Drizzle table definitions + enums + relations
│   ├── lib/
│   │   ├── search.ts              # Hybrid search: vector + BM25 + RRF + rewrite
│   │   ├── rerank.ts              # Cohere cross-encoder re-ranking
│   │   ├── eval.ts                # LLM-as-judge scoring (3 parallel calls)
│   │   ├── billing.ts             # getUserBilling · checkLimit · incrementCount
│   │   ├── plans.ts               # PLAN_LIMITS config
│   │   ├── stripe.ts              # Stripe singleton client
│   │   ├── embedding.ts           # Gemini embed + embedMany
│   │   ├── chunking.ts            # Splitter + detectHeading + addContext
│   │   └── parsers/               # pdf · docx · text · index router
│   └── emails/                    # React Email templates
├── migrations/                    # Drizzle SQL migrations
├── drizzle.config.ts
└── middleware.ts                  # Clerk route protection
```

---

## Installation

### Prerequisites

- Node.js 20+
- [Neon](https://neon.tech) PostgreSQL database
- [Clerk](https://clerk.com) application
- [OpenAI](https://platform.openai.com) API key
- [Google AI Studio](https://aistudio.google.com) API key
- [Cohere](https://cohere.com) API key
- [Resend](https://resend.com) API key
- [Stripe](https://stripe.com) account with two products created (Pro + Team)

### 1 · Clone & Install

```bash
git clone https://github.com/itsyashbisht/IntelliVault-Enterprise.git
cd IntelliVault-Enterprise
npm install
```

### 2 · Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### 3 · Database Setup

Run once in your Neon SQL editor:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create enums
CREATE TYPE workspace_role  AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE invite_status   AS ENUM ('pending', 'accepted', 'expired');
CREATE TYPE document_status AS ENUM ('processing', 'ready', 'failed');
CREATE TYPE message_role    AS ENUM ('user', 'assistant');
CREATE TYPE plan_type       AS ENUM ('free', 'pro', 'team');

-- Push schema
npx drizzle-kit push

-- After push — add BM25 full-text index
ALTER TABLE chunks
ADD COLUMN fts tsvector
GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

CREATE INDEX chunks_fts_idx ON chunks USING GIN(fts);

-- Add eval score columns
ALTER TABLE messages
ADD COLUMN context_relevance NUMERIC(3,2),
ADD COLUMN faithfulness      NUMERIC(3,2),
ADD COLUMN answer_relevance  NUMERIC(3,2);
```

### 4 · Stripe Setup

1. Create two products in your Stripe dashboard (Pro at $12/mo, Team at $29/mo)
2. Copy price IDs to env variables
3. Create a webhook endpoint pointing to `/api/billing/webhook`
4. Listen for: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5 · Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEON_DATABASE_URL` | Neon PostgreSQL connection string (neon-serverless) | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key (GPT-4o-mini) | ✅ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio key (Gemini embeddings) | ✅ |
| `COHERE_API_KEY` | Cohere API key (re-ranking) | ✅ |
| `RESEND_API_KEY` | Resend API key (invite emails) | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | ✅ |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan | ✅ |
| `NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID` | Stripe price ID for Team plan | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | ✅ |

---

## Usage

### For End Users

1. **Sign up** at the landing page → Clerk handles authentication
2. **Create a workspace** — give it a name; you're automatically the owner
3. **Upload documents** — PDF, DOCX, TXT, or Markdown; status updates from `processing → ready`
4. **Start chatting** — ask any question; IntelliVault searches your documents and streams a cited answer
5. **Invite teammates** — enter their email; they receive a tokenized invite link; roles assigned on acceptance
6. **View eval scores** — open the Eval tab to see retrieval quality metrics per session
7. **Upgrade plan** — visit `/billing` to upgrade from Free to Pro or Team

### For Developers

```bash
# Run dev server
npm run dev

# Push schema changes
npx drizzle-kit push

# Generate migrations (production)
npx drizzle-kit generate
npx drizzle-kit migrate

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Screenshots

### Landing Page
> *Hero section with product mockup, feature grid, and pricing CTA*

### Dashboard — Workspace Switcher
> *All workspaces with doc count, member count, and role badge*

### Documents Page
> *Upload dropzone + document table with status badges (processing / ready / failed)*

### RAG Chat Interface
> *Streaming response with source citation chips below each assistant message*

### Evaluation Dashboard
> *Workspace-average score bars + per-session breakdown + lowest-performing sessions*

### Billing Page
> *Current plan, usage meters (messages / documents / workspaces), Stripe portal link*

---

## API Overview

| Route | Methods | Access | Purpose |
|---|---|---|---|
| `/api/workspaces` | `POST` `GET` | Authenticated | Create and list workspaces |
| `/api/workspaces/[id]` | `GET` `PATCH` `DELETE` | Member / Owner | Single workspace CRUD |
| `/api/workspaces/[id]/members` | `GET` `PATCH` `DELETE` | Member / Owner | Member management |
| `/api/workspaces/[id]/invites` | `POST` `GET` `DELETE` | Owner / Editor | Email invite system |
| `/api/workspaces/[id]/documents` | `POST` `GET` | Member | Ingest and list documents |
| `/api/workspaces/[id]/documents/[docId]` | `DELETE` | Owner / Editor | Delete document + chunks |
| `/api/workspaces/[id]/chat` | `POST` | Member | Streaming RAG chat |
| `/api/workspaces/[id]/chat/sessions` | `POST` `GET` | Member | Session management |
| `/api/workspaces/[id]/eval` | `GET` | Owner / Editor | Evaluation metrics |
| `/api/invites/[token]` | `POST` | Authenticated | Accept workspace invite |
| `/api/billing/checkout` | `POST` | Authenticated | Stripe checkout session |
| `/api/billing/portal` | `GET` | Authenticated | Stripe customer portal |
| `/api/billing/webhook` | `POST` | Stripe (signed) | Handle payment events |

---

## Database Design

Nine core tables in dependency order:

```
workspaces                         Central tenant container
├── workspace_members              User ↔ workspace join (role-bearing)
├── workspace_invites              Token-based email invites
├── documents                      Document metadata (status enum)
│   └── chunks                     Text chunks + vector(768) + tsvector
├── chat_sessions                  Conversation threads per workspace
│   └── messages                   User/assistant turns + eval scores
└── activity_logs                  Immutable audit trail

billing                            User-level (not workspace-level)
  userId · plan · Stripe IDs · messageCount · messageResetAt
```

**Key design decisions:**

- `chunks.fts` is `GENERATED ALWAYS AS (to_tsvector('english', content)) STORED` — Postgres maintains it automatically
- `messages.source_chunk_ids` is `jsonb` — stores chunk UUIDs used per response for citation UI
- All workspace-child tables use `ON DELETE CASCADE` — deleting a workspace cleans everything atomically
- `billing.messageResetAt` uses 30-day rolling window, not calendar month

---

## Key Learnings

### Technical Concepts
- **Hybrid search architecture** — combining dense (vector) and sparse (BM25) retrieval with RRF fusion
- **Cross-encoder vs bi-encoder** — why re-ranking improves precision after approximate retrieval
- **Contextual embeddings** — why raw chunk content alone produces poor retrieval for domain documents
- **LLM-as-judge evaluation** — building measurable quality metrics instead of subjective testing
- **Stripe webhook reliability** — why the webhook handler is the source of truth, not the success redirect URL
- **Multi-tenant data isolation** — enforcing workspace boundaries at every DB query, not just middleware

### Challenges Faced

| Challenge | Root Cause | Solution |
|---|---|---|
| Context relevance at 0.10 | Pure vector search misses exact terms | Hybrid BM25 + vector + RRF |
| Chunks lacked context | Embedding short text without document context | Prepend doc name + section heading |
| Follow-up questions failing | Pronouns and references in short queries | Query rewriting with conversation history |
| No quality signal | Subjective manual testing | LLM-as-judge eval dashboard |
| Wrong billing reset | Calendar month vs subscription date | 30-day rolling from `messageResetAt` |

---

## Performance & Optimization

### Retrieval
- **HNSW index** on `chunks.embedding` — approximate nearest-neighbor, O(log n) lookup
- **GIN index** on `chunks.fts` — inverted index, fast full-text lookups
- **Retrieve 20, re-rank to 5** — broad recall from hybrid search, precision from Cohere
- **`Promise.all` everywhere** — parallel DB queries instead of sequential

### API Design
- **Direct DB calls in server components** — no unnecessary HTTP round-trips to own API
- **`neon-serverless`** (WebSocket driver) for transactions — not `neon-http`
- **Usage limits at 402 server-side** — not frontend-only guards
- **Webhook signature verification** — `stripe.webhooks.constructEvent` with raw body bytes

### Security
- Membership check on every workspace-scoped route — `workspace_members` lookup before any data access
- Cross-tenant document check before delete — `AND workspace_id = ?` on every document query
- Stripe webhook signed — rejects requests without valid `Stripe-Signature` header
- Clerk session on every API route — no unauthenticated access to any data

---

## Future Enhancements

| Enhancement | Impact | Complexity |
|---|---|---|
| HyDE (Hypothetical Document Embedding) | Better semantic retrieval | Medium |
| Multi-document reasoning agent | Cross-reference across docs | High |
| Chunk feedback (thumbs up/down) | Training signal for future fine-tuning | Low |
| Scheduled activity digests | Engagement + retention | Medium |
| Real-time presence in workspace | Collaboration UX | High |
| Fine-tuned embedding model | Domain-specific retrieval | High |

---

## Contributing

Contributions are welcome. Please follow this process:

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes with clear commits
git commit -m "feat: add your feature"

# Push and open a pull request
git push origin feature/your-feature-name
```

**Before submitting:**
- Run `npx tsc --noEmit` — no TypeScript errors
- Run `npm run lint` — no lint errors
- Test your feature against a real Neon database

---

## License

This project is licensed under the **MIT License**.

```
MIT License — Copyright (c) 2026 Yash Bisht
Permission is granted to use, copy, modify, and distribute this software.
```

---

## Author

<div align="center">

**Yash Bisht**
*Full-Stack AI Engineer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/yashbisht)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/itsyashbisht)
[![Portfolio](https://img.shields.io/badge/Portfolio-5e6ad2?style=flat-square&logo=vercel&logoColor=white)](https://yashbisht.dev)
[![Live Demo](https://img.shields.io/badge/Live_Demo-intellivault-00E699?style=flat-square)](https://intellivault-phi.vercel.app)

*Built in ~7 weeks from schema to deployed SaaS product.*

</div>

---

<div align="center">

**IntelliVault Enterprise** · Built with Next.js · pgvector · OpenAI · Gemini · Stripe · Vercel

*If this helped you build something, give it a ⭐*

</div>