"use client";
import IntelliVaultLogo from "@/components/logo";
import {
  MockupReveal,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/marketing/reveal";
import Wordmark from "@/components/workspace-home/wordmark";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  MessageSquare,
  Search,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

// ── Fake Product UI Screenshot ────────────────────────────────────────────────
function ProductMockup() {
  return (
    <div className="relative bg-[#0f1011] border border-[#23252a] rounded-[12px] sm:rounded-[16px] p-1 sm:p-1.5 shadow-2xl">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Browser chrome */}
      <div className="bg-[#141516] rounded-[8px] sm:rounded-[12px] overflow-hidden">
        <div className="h-8 sm:h-9 bg-[#0f1011] border-b border-[#23252a] flex items-center px-3 sm:px-4 gap-2">
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ef4444]/50" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#eab308]/50" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#22c55e]/50" />
          </div>
          {/* URL bar — hidden on smallest screens */}
          <div className="hidden xs:flex flex-1 mx-2 sm:mx-4 h-5 bg-[#18191a] rounded-[4px] border border-[#23252a] items-center px-2 sm:px-2.5 gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#27a644] shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-[#62666d] font-mono truncate">
              app.intellivault.io/w/acme-corp/chat
            </span>
          </div>
        </div>

        {/* App shell — single column on mobile, three-column on md+ */}
        <div className="flex flex-col md:flex-row md:h-[340px]">
          {/* ── Sidebar — full-width horizontal strip on mobile ── */}
          <div
            className="
            flex flex-row md:flex-col
            w-full md:w-44 shrink-0
            border-b md:border-b-0 md:border-r border-[#23252a]
            bg-[#0f1011]
          "
          >
            {/* Workspace name */}
            <div
              className="
              flex items-center gap-2 px-3
              h-9 md:h-10
              border-r md:border-r-0 md:border-b border-[#23252a]
              shrink-0
            "
            >
              <div className="w-4 h-4 rounded-[3px] bg-[#5e6ad2]/20 border border-[#5e6ad2]/30 flex items-center justify-center shrink-0">
                <span className="text-[8px] font-bold text-[#5e6ad2]">A</span>
              </div>
              <span className="text-[11px] font-medium text-[#d0d6e0] truncate hidden sm:block">
                Acme Corp
              </span>
            </div>

            {/* Nav — horizontal on mobile, vertical on md */}
            <nav className="flex flex-row md:flex-col gap-0.5 p-1.5 md:p-2 overflow-x-auto md:overflow-x-visible">
              {[
                { label: "Home", active: false },
                { label: "Documents", active: false },
                { label: "Chat", active: true },
                { label: "Members", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`
                    px-2 py-1 rounded-[5px] text-[10px] whitespace-nowrap shrink-0
                    ${
                      item.active
                        ? "bg-[#18191a] text-[#f7f8f8] font-medium"
                        : "text-[#8a8f98]"
                    }
                  `}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          {/* ── History panel — hidden on mobile, visible on md ── */}
          <div
            className="
            hidden md:flex
            w-36 shrink-0 flex-col
            border-r border-[#23252a]
            bg-[#0f1011]
          "
          >
            <div className="p-2 border-b border-[#23252a]">
              <div className="flex items-center gap-1 px-1.5 py-1 rounded-[4px] text-[9px] text-[#8a8f98]">
                + New chat
              </div>
            </div>
            <div className="p-2">
              <p className="text-[8px] uppercase tracking-widest text-[#62666d] px-1 mb-1.5">
                History
              </p>
              {["Q3 revenue drivers", "Leave policy", "Onboarding docs"].map(
                (s, i) => (
                  <div
                    key={s}
                    className={`px-1.5 py-1.5 rounded-[4px] mb-0.5 ${i === 0 ? "bg-[#23252a]" : ""}`}
                  >
                    <p
                      className={`text-[9px] truncate ${i === 0 ? "text-[#f7f8f8]" : "text-[#8a8f98]"}`}
                    >
                      {s}
                    </p>
                    <p className="text-[8px] text-[#62666d]">
                      {["2h ago", "Yesterday", "3d ago"][i]}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── Chat area — always visible ── */}
          <div className="flex flex-1 min-w-0 flex-col bg-[#141516]">
            <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#5e6ad2] rounded-[8px] rounded-br-[3px] px-3 py-2 text-[10px] sm:text-[10px] text-white max-w-[75%] sm:max-w-[60%]">
                  What were the key revenue drivers in Q3?
                </div>
              </div>

              {/* Assistant message */}
              <div className="flex gap-2 max-w-[90%] sm:max-w-[85%]">
                <div className="w-5 h-5 rounded-[4px] bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <IntelliVaultLogo size={10} />
                </div>
                <div className="min-w-0">
                  <div className="bg-[#18191a] border border-[#23252a] rounded-[8px] rounded-bl-[3px] px-3 py-2">
                    <p className="text-[10px] text-[#d0d6e0] leading-relaxed">
                      Based on the Q3 Financial Report, three primary revenue
                      drivers stood out: enterprise subscriptions grew 34% YoY,
                      professional services added $4.1M, and API usage surged
                      89%.
                    </p>
                  </div>
                  {/* Citation chips */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0f1011] border border-[#23252a] rounded-[4px]">
                      <FileText size={7} className="text-[#62666d] shrink-0" />
                      <span className="text-[8px] text-[#62666d] whitespace-nowrap">
                        Q3 Financial Report.pdf · p.8
                      </span>
                    </div>
                    {/* Second chip hidden on very small screens */}
                    <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-[#0f1011] border border-[#23252a] rounded-[4px]">
                      <FileText size={7} className="text-[#62666d] shrink-0" />
                      <span className="text-[8px] text-[#62666d] whitespace-nowrap">
                        Q3 Financial Report.pdf · p.14
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="border-t border-[#23252a] p-2 sm:p-3 flex gap-2">
              <div className="flex-1 bg-[#0f1011] border border-[#23252a] rounded-[6px] h-7 sm:h-8 flex items-center px-2 sm:px-3">
                <span className="text-[9px] text-[#62666d] truncate">
                  Ask anything about your documents...
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#5e6ad2] rounded-[6px] flex items-center justify-center shrink-0">
                <ArrowRight size={10} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: FileText,
    title: "Instant ingestion",
    desc: "Upload PDFs, Word docs, or Markdown. Automatic chunking, embedding, and vector indexing in seconds.",
  },
  {
    icon: Search,
    title: "Hybrid search",
    desc: "Vector similarity fused with BM25 keyword search — finds meanings and exact terms, not just one or the other.",
  },
  {
    icon: MessageSquare,
    title: "RAG-powered chat",
    desc: "Ask in plain language. Answers are grounded strictly in your documents, with cited sources.",
  },
  {
    icon: Users,
    title: "Team workspaces",
    desc: "Invite collaborators with owner, editor, or viewer roles. Each workspace is fully isolated.",
  },
  {
    icon: Zap,
    title: "Streaming responses",
    desc: "Token-by-token streaming via the Vercel AI SDK. Answers start appearing the moment they're generated.",
  },
  {
    icon: Shield,
    title: "Access control",
    desc: "Role-based permissions enforced at the API layer. Your documents never leave your workspace.",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload your documents",
    desc: "Drag and drop PDFs, Word docs, or Markdown files into your workspace. IntelliVault parses, chunks, and embeds them automatically.",
  },
  {
    step: "02",
    title: "Ask in plain language",
    desc: "Type any question. The RAG pipeline embeds your query, retrieves the most relevant chunks, and sends them as grounded context.",
  },
  {
    step: "03",
    title: "Get cited answers",
    desc: "Responses are grounded strictly in your documents. Every answer shows which source files were used — no hallucinations.",
  },
];

const plans = [
  {
    name: "Free",
    tagline: "Everything you need to get started.",
    price: "0",
    cta: "Start for free",
    href: "/sign-up",
    featured: false,
    includesLabel: "Includes",
    features: [
      "2 workspaces",
      "3 documents per workspace",
      "50 messages per month",
      "Hybrid search & citations",
      "Team invites (viewer)",
    ],
  },
  {
    name: "Pro",
    tagline: "For individuals shipping serious RAG workflows.",
    price: "19",
    cta: "Get Pro",
    href: "/sign-up",
    featured: true,
    includesLabel: "Everything in Free, plus",
    features: [
      "10 workspaces",
      "50 documents per workspace",
      "1,200 messages per month",
      "Priority embedding queue",
      "Stripe billing portal",
    ],
  },
  {
    name: "Team",
    tagline: "For teams that need scale and control.",
    price: "49",
    cta: "Get Team",
    href: "/sign-up",
    featured: false,
    includesLabel: "Everything in Pro, plus",
    features: [
      "250 workspaces",
      "1,500 documents per workspace",
      "10,000 messages per month",
      "Owner / editor / viewer roles",
      "Priority support",
    ],
  },
];

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8]">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 max-w-[1280px] mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#23252a] bg-[#0f1011] text-[11px] font-medium text-[#8a8f98] tracking-[0.4px] uppercase mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27a644] animate-pulse" />
            Enterprise document intelligence
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1
            className="text-[36px] sm:text-[56px] md:text-[72px] lg:text-[80px] font-semibold text-[#f7f8f8] leading-[1.05] mb-5 sm:mb-6 max-w-4xl mx-auto"
            style={{ letterSpacing: "-2px" }}
          >
            Your documents, <br className="hidden sm:block" />
            <span className="text-[#5e6ad2]">finally searchable</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="text-[15px] sm:text-[18px] text-[#8a8f98] leading-[1.6] max-w-lg mx-auto mb-8 sm:mb-10 px-2">
            Upload any document. Ask any question. Get precise, cited answers —
            powered by retrieval-augmented generation and team workspaces.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4 min-h-[40px]">
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white! text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] hover:-translate-y-px"
                  >
                    Go to dashboard
                    <ChevronRight size={14} />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#0f1011] hover:bg-[#141516] border border-[#23252a] hover:border-[#34343a] text-[#d0d6e0] text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] hover:-translate-y-px"
                  >
                    See how it works
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white! text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] hover:-translate-y-px"
                  >
                    Start for free
                    <ChevronRight size={14} />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#0f1011] hover:bg-[#141516] border border-[#23252a] hover:border-[#34343a] text-[#d0d6e0] text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] hover:-translate-y-px"
                  >
                    Sign in
                  </Link>
                </>
              ))}
          </div>
          <p className="text-[11px] sm:text-[12px] text-[#62666d]">
            {isLoaded && isSignedIn
              ? "Pick up where you left off in your workspaces"
              : "No credit card required · Free workspace forever"}
          </p>
        </Reveal>
      </section>

      {/* ── Product screenshot ──────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-[1280px] mx-auto mb-16 sm:mb-24">
        <MockupReveal>
          <ProductMockup />
        </MockupReveal>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="px-4 sm:px-6 max-w-[1280px] mx-auto mb-16 sm:mb-24"
      >
        <Reveal className="text-center mb-10 sm:mb-12">
          <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#5e6ad2] mb-3">
            How it works
          </p>
          <h2
            className="text-[28px] sm:text-[36px] md:text-[40px] font-semibold text-[#f7f8f8] leading-[1.15] max-w-xl mx-auto"
            style={{ letterSpacing: "-1px" }}
          >
            From upload to answer in seconds
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {steps.map(({ step, title, desc }) => (
            <StaggerItem key={step}>
              <div className="relative h-full bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 sm:p-6 hover:bg-[#141516] hover:border-[#34343a] transition-colors duration-200 overflow-hidden">
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                <p className="text-[11px] font-mono text-[#5e6ad2] mb-4 tracking-widest">
                  {step}
                </p>
                <h3
                  className="text-[15px] sm:text-[16px] font-semibold text-[#f7f8f8] mb-2"
                  style={{ letterSpacing: "-0.3px" }}
                >
                  {title}
                </h3>
                <p className="text-[13px] text-[#8a8f98] leading-relaxed">
                  {desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Features grid ───────────────────────────────────── */}
      <section
        id="features"
        className="px-4 sm:px-6 max-w-[1280px] mx-auto mb-16 sm:mb-24"
      >
        <Reveal className="text-center mb-10 sm:mb-12">
          <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#5e6ad2] mb-3">
            Capabilities
          </p>
          <h2
            className="text-[28px] sm:text-[36px] md:text-[40px] font-semibold text-[#f7f8f8] leading-[1.15]"
            style={{ letterSpacing: "-1px" }}
          >
            Everything your team needs
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <div className="h-full bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 sm:p-6 hover:bg-[#141516] hover:border-[#34343a] hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="w-8 h-8 rounded-[8px] bg-[#23252a] flex items-center justify-center mb-4 group-hover:bg-[#5e6ad2]/10 transition-colors duration-200">
                  <Icon
                    size={15}
                    className="text-[#8a8f98] group-hover:text-[#5e6ad2] transition-colors duration-200"
                  />
                </div>
                <h3
                  className="text-[14px] font-semibold text-[#f7f8f8] mb-1.5"
                  style={{ letterSpacing: "-0.2px" }}
                >
                  {title}
                </h3>
                <p className="text-[13px] text-[#8a8f98] leading-relaxed">
                  {desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Tech stack strip ────────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-[1280px] mx-auto mb-16 sm:mb-24">
        <Reveal>
          <div className="relative border border-[#23252a] rounded-[12px] p-6 sm:p-8 bg-[#0f1011] overflow-hidden">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#62666d] text-center mb-5 sm:mb-6">
              Built on
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                "Next.js 16",
                "Neon pgvector",
                "GPT-4o-mini",
                "Gemini Embeddings",
                "Drizzle ORM",
                "Vercel AI SDK",
                "Clerk Auth",
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-[12px] sm:text-[13px] font-mono text-[#62666d] hover:text-[#8a8f98] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="mb-16 sm:mb-24">
        <Reveal className="text-center mb-10 sm:mb-12 px-4 sm:px-6 max-w-[1280px] mx-auto">
          <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#5e6ad2] mb-3">
            Pricing
          </p>
          <h2
            className="text-[28px] sm:text-[36px] md:text-[40px] font-semibold text-[#f7f8f8] leading-[1.15] max-w-2xl mx-auto"
            style={{ letterSpacing: "-1px" }}
          >
            Plans that scale with your knowledge base
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] text-[#8a8f98] leading-[1.5] max-w-lg mx-auto">
            Start free. Upgrade when your team needs more workspaces, documents,
            and monthly messages.
          </p>
        </Reveal>

        {/* Mobile: snap carousel · md+: 3-up grid */}
        <div className="md:px-4 lg:px-6 md:max-w-[1280px] md:mx-auto">
          <Stagger
            className="
              flex md:grid md:grid-cols-3
              gap-3 sm:gap-4
              overflow-x-auto md:overflow-visible
              snap-x snap-mandatory
              scroll-smooth
              px-4 sm:px-6 md:px-0
              pb-3
              [scrollbar-width:none] [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {plans.map((plan) => (
              <StaggerItem
                key={plan.name}
                className="w-[min(82vw,300px)] sm:w-[min(70vw,320px)] md:w-auto shrink-0 snap-center md:snap-align-none"
              >
                <div
                  className={`relative h-full flex flex-col rounded-[12px] border p-6 sm:p-7 transition-colors duration-200 overflow-hidden ${
                    plan.featured
                      ? "bg-[#141516] border-[#34343a] hover:border-[#5e6ad2]/40"
                      : "bg-[#0f1011] border-[#23252a] hover:bg-[#141516] hover:border-[#34343a]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                  {plan.featured && (
                    <span className="absolute top-5 right-5 inline-flex items-center px-2 py-0.5 rounded-full bg-[#23252a] text-[11px] font-medium text-[#d0d6e0]">
                      Popular
                    </span>
                  )}

                  <p className="text-[13px] font-medium text-[#5e6ad2] mb-1.5">
                    {plan.name}
                  </p>
                  <p className="text-[13px] text-[#8a8f98] leading-relaxed mb-6 min-h-[40px]">
                    {plan.tagline}
                  </p>

                  <div className="flex items-end gap-2 mb-6">
                    <span
                      className="text-[40px] sm:text-[44px] font-semibold text-[#f7f8f8] leading-none"
                      style={{ letterSpacing: "-1.2px" }}
                    >
                      ${plan.price}
                    </span>
                    <span className="text-[13px] text-[#8a8f98] pb-1.5">
                      USD / month
                    </span>
                  </div>

                  <Link
                    href={isLoaded && isSignedIn ? "/dashboard" : plan.href}
                    className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[8px] text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] mb-7 ${
                      plan.featured
                        ? "bg-[#5e6ad2] hover:bg-[#828fff] text-white! hover:-translate-y-px"
                        : "bg-[#0f1011] hover:bg-[#18191a] border border-[#23252a] hover:border-[#34343a] text-[#d0d6e0]"
                    }`}
                  >
                    {isLoaded && isSignedIn ? "Go to dashboard" : plan.cta}
                  </Link>

                  <p className="text-[12px] font-medium text-[#f7f8f8] mb-3">
                    {plan.includesLabel}
                  </p>
                  <ul className="flex flex-col gap-2.5 mt-auto">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[13px] text-[#8a8f98]"
                      >
                        <span className="text-[#62666d] shrink-0 mt-px select-none">
                          +
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-[1280px] mx-auto pb-16 sm:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[12px] border border-[#23252a] bg-[#0f1011] p-8 sm:p-12 text-center">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center justify-center mb-5 sm:mb-6">
              <Wordmark size="lg" />
            </div>
            <h2
              className="text-[22px] sm:text-[28px] font-semibold text-[#f7f8f8] mb-3 max-w-md mx-auto"
              style={{ letterSpacing: "-0.6px" }}
            >
              {isLoaded && isSignedIn
                ? "Continue unlocking your documents"
                : "Ready to unlock your documents?"}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#8a8f98] mb-7 sm:mb-8 max-w-sm mx-auto">
              {isLoaded && isSignedIn
                ? "Jump back into your workspaces, upload more files, and keep asking questions."
                : "Create a workspace, upload your files, and start getting answers in under two minutes."}
            </p>
            {isLoaded &&
              (isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white! text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] hover:-translate-y-px"
                >
                  Open dashboard
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white! text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[40px] hover:-translate-y-px"
                >
                  Create your workspace
                  <ArrowRight size={14} />
                </Link>
              ))}
          </div>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[#23252a] px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
          <Wordmark size="sm" />
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#features"
              className="text-[12px] text-[#62666d] hover:text-[#8a8f98] transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-[12px] text-[#62666d] hover:text-[#8a8f98] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-[12px] text-[#62666d] hover:text-[#8a8f98] transition-colors"
            >
              Docs
            </a>
          </div>
          <p className="text-[11px] sm:text-[12px] text-[#62666d]">
            © 2026 IntelliVault. Built by Yash Bisht.
          </p>
        </div>
      </footer>
    </div>
  );
}
