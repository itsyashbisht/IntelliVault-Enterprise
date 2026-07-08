"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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

// ── IntelliVault Logo ─────────────────────────────────────────────────────────
// A geometric "IV" monogram — two vertical bars with a connecting
// diagonal bridge. Reads as both a vault door and the roman numeral IV.
// No gradients, no glow, no generic AI sparkle.
function IntelliVaultLogo({ size = 24 }: { size?: number }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left bar — I */}
      <rect x="3" y="4" width="3.5" height="16" rx="1" fill="#5e6ad2" />
      {/* Right bar — V outer stroke */}
      <path
        d="M13 4 L17.5 16 L22 4"
        stroke="#5e6ad2"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Bridge — connecting I to V, acts as vault lock bar */}
      <rect
        x="3"
        y="10.25"
        width="9"
        height="2"
        rx="1"
        fill="#5e6ad2"
        opacity="0.5"
      />
    </svg>
  );
}

// ── Wordmark ──────────────────────────────────────────────────────────────────
function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "text-[13px]", md: "text-[15px]", lg: "text-[20px]" };
  const logoSize = { sm: 16, md: 20, lg: 28 };
  return (
    <div className="flex items-center gap-2">
      <IntelliVaultLogo size={logoSize[size]} />
      <span
        className={`${sizeMap[size]} font-semibold text-[#f7f8f8] tracking-[-0.3px]`}
      >
        IntelliVault
      </span>
    </div>
  );
}

// ── Top Navigation ─────────────────────────────────────────────────────────────
function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(1,1,2,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #23252a" : "1px solid transparent",
      }}
    >
      <Link href="/" className="flex items-center">
        <Wordmark size="md" />
      </Link>

      <nav className="hidden md:flex items-center gap-0.5 ml-8">
        {["Features", "How it works", "Pricing"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            className="px-3 py-1.5 text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors rounded-[6px] hover:bg-[#0f1011]"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/sign-in"
          className="px-3 py-1.5 text-[13px] font-medium text-[#d0d6e0] hover:text-[#f7f8f8] transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white text-[13px] font-medium transition-colors"
        >
          Get started
          <ChevronRight size={12} />
        </Link>
      </div>
    </header>
  );
}

// ── Fake Product UI Screenshot ────────────────────────────────────────────────
function ProductMockup() {
  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-[16px] p-1.5 shadow-2xl">
      {/* Browser chrome */}
      <div className="bg-[#141516] rounded-[12px] overflow-hidden">
        <div className="h-9 bg-[#0f1011] border-b border-[#23252a] flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/50" />
          </div>
          <div className="flex-1 mx-4 h-5 bg-[#18191a] rounded-[4px] border border-[#23252a] flex items-center px-2.5 gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
            <span className="text-[10px] text-[#62666d] font-mono">
              app.intellivault.io/w/acme-corp/chat
            </span>
          </div>
        </div>

        {/* App UI */}
        <div className="flex h-[340px]">
          {/* Sidebar */}
          <div className="w-44 bg-[#0f1011] border-r border-[#23252a] flex flex-col shrink-0">
            {/* Workspace header */}
            <div className="h-10 border-b border-[#23252a] flex items-center px-3 gap-2">
              <div className="w-4 h-4 rounded-[3px] bg-[#5e6ad2]/20 border border-[#5e6ad2]/30 flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#5e6ad2]">A</span>
              </div>
              <span className="text-[11px] font-medium text-[#d0d6e0] truncate">
                Acme Corp
              </span>
            </div>
            {/* Nav */}
            <nav className="p-2 flex flex-col gap-0.5">
              {[
                { label: "Home", active: false },
                { label: "Documents", active: false },
                { label: "Chat", active: true },
                { label: "Members", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`px-2 py-1 rounded-[5px] text-[10px] ${
                    item.active
                      ? "bg-[#18191a] text-[#f7f8f8] font-medium"
                      : "text-[#8a8f98]"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          {/* History panel */}
          <div className="w-36 border-r border-[#23252a] bg-[#0f1011] shrink-0">
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
                    className={`px-1.5 py-1.5 rounded-[4px] mb-0.5 ${
                      i === 0 ? "bg-[#23252a]" : ""
                    }`}
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
                ),
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#141516]">
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#5e6ad2] rounded-[8px] rounded-br-[3px] px-3 py-2 text-[10px] text-white max-w-[60%]">
                  What were the key revenue drivers in Q3?
                </div>
              </div>

              {/* Assistant message */}
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-5 h-5 rounded-[4px] bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <IntelliVaultLogo size={10} />
                </div>
                <div>
                  <div className="bg-[#18191a] border border-[#23252a] rounded-[8px] rounded-bl-[3px] px-3 py-2">
                    <p className="text-[10px] text-[#d0d6e0] leading-relaxed">
                      Based on the Q3 Financial Report, three primary revenue
                      drivers stood out: enterprise subscriptions grew 34% YoY,
                      professional services added $4.1M from 12 new clients, and
                      API usage surged 89% following the v2 launch.
                    </p>
                  </div>
                  {/* Citation chips */}
                  <div className="flex gap-1.5 mt-1.5">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0f1011] border border-[#23252a] rounded-[4px]">
                      <FileText size={7} className="text-[#62666d]" />
                      <span className="text-[8px] text-[#62666d]">
                        Q3 Financial Report.pdf · p.8
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0f1011] border border-[#23252a] rounded-[4px]">
                      <FileText size={7} className="text-[#62666d]" />
                      <span className="text-[8px] text-[#62666d]">
                        Q3 Financial Report.pdf · p.14
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-[#23252a] p-3 flex gap-2">
              <div className="flex-1 bg-[#0f1011] border border-[#23252a] rounded-[6px] h-8 flex items-center px-3">
                <span className="text-[9px] text-[#62666d]">
                  Ask anything about your documents...
                </span>
              </div>
              <div className="w-8 h-8 bg-[#5e6ad2] rounded-[6px] flex items-center justify-center shrink-0">
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
    title: "Semantic search",
    desc: "Hybrid vector + keyword search surfaces the most relevant passages — not just keyword matches.",
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
    desc: "Token-by-token streaming via Groq's inference infrastructure. No waiting for full responses.",
  },
  {
    icon: Shield,
    title: "Access control",
    desc: "Role-based permissions enforced at the API layer. Your documents never leave your workspace.",
  },
];

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8]">
      <TopNav />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 max-w-[1280px] mx-auto text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#23252a] bg-[#0f1011] text-[11px] font-medium text-[#8a8f98] tracking-[0.4px] uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27a644] animate-pulse" />
          Enterprise document intelligence
        </div>

        {/* Hero headline */}
        <h1
          className="text-[64px] md:text-[80px] font-semibold text-[#f7f8f8] leading-[1.05] mb-6 max-w-4xl mx-auto"
          style={{ letterSpacing: "-3px" }}
        >
          Your documents, <br />
          <span className="text-[#5e6ad2]">finally searchable</span>
        </h1>

        <p
          className="text-[18px] text-[#8a8f98] leading-[1.6] max-w-lg mx-auto mb-10"
          style={{ letterSpacing: "-0.1px" }}
        >
          Upload any document. Ask any question. Get precise, cited answers —
          powered by retrieval-augmented generation and team workspaces.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white text-[14px] font-medium transition-colors min-h-[40px]"
          >
            Start for free
            <ChevronRight size={14} />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#0f1011] hover:bg-[#141516] border border-[#23252a] hover:border-[#34343a] text-[#d0d6e0] text-[14px] font-medium transition-colors min-h-[40px]"
          >
            View demo
          </Link>
        </div>
        <p className="text-[12px] text-[#62666d]">
          No credit card required · Free workspace forever
        </p>
      </section>

      {/* ── Product screenshot ────────────────────────────────── */}
      <section className="px-6 max-w-[1280px] mx-auto mb-24">
        <ProductMockup />
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 max-w-[1280px] mx-auto mb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#5e6ad2] mb-3">
            How it works
          </p>
          <h2
            className="text-[40px] font-semibold text-[#f7f8f8] leading-[1.15] max-w-xl mx-auto"
            style={{ letterSpacing: "-1px" }}
          >
            From upload to answer in seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Upload your documents",
              desc: "Drag and drop PDFs, Word docs, or Markdown files into your workspace. IntelliVault parses, chunks, and embeds them automatically.",
            },
            {
              step: "02",
              title: "Ask in plain language",
              desc: "Type any question. The RAG pipeline embeds your query, retrieves the most relevant chunks, and sends them to the LLM as grounded context.",
            },
            {
              step: "03",
              title: "Get cited answers",
              desc: "Responses are grounded strictly in your documents. Every answer shows which source files and pages were used — no hallucinations.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 hover:bg-[#141516] hover:border-[#34343a] transition-colors"
            >
              <p className="text-[11px] font-mono text-[#5e6ad2] mb-4 tracking-widest">
                {step}
              </p>
              <h3
                className="text-[16px] font-semibold text-[#f7f8f8] mb-2"
                style={{ letterSpacing: "-0.3px" }}
              >
                {title}
              </h3>
              <p className="text-[13px] text-[#8a8f98] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────── */}
      <section id="features" className="px-6 max-w-[1280px] mx-auto mb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#5e6ad2] mb-3">
            Capabilities
          </p>
          <h2
            className="text-[40px] font-semibold text-[#f7f8f8] leading-[1.15]"
            style={{ letterSpacing: "-1px" }}
          >
            Everything your team needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 hover:bg-[#141516] hover:border-[#34343a] transition-all group"
            >
              <div className="w-8 h-8 rounded-[8px] bg-[#23252a] flex items-center justify-center mb-4 group-hover:bg-[#5e6ad2]/10 group-hover:border group-hover:border-[#5e6ad2]/20 transition-colors">
                <Icon
                  size={15}
                  className="text-[#8a8f98] group-hover:text-[#5e6ad2] transition-colors"
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
          ))}
        </div>
      </section>

      {/* ── Tech stack strip ──────────────────────────────────── */}
      <section className="px-6 max-w-[1280px] mx-auto mb-24">
        <div className="border border-[#23252a] rounded-[12px] p-8 bg-[#0f1011]">
          <p className="text-[11px] font-medium tracking-[0.4px] uppercase text-[#62666d] text-center mb-6">
            Built on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              "Next.js 16",
              "Neon pgvector",
              "Groq LLaMA",
              "Gemini Embeddings",
              "Drizzle ORM",
              "Vercel AI SDK",
              "Clerk Auth",
            ].map((tech) => (
              <span
                key={tech}
                className="text-[13px] font-mono text-[#62666d] hover:text-[#8a8f98] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="px-6 max-w-[1280px] mx-auto pb-24">
        <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <Wordmark size="lg" />
          </div>
          <h2
            className="text-[28px] font-semibold text-[#f7f8f8] mb-3 max-w-md mx-auto"
            style={{ letterSpacing: "-0.6px" }}
          >
            Ready to unlock your documents?
          </h2>
          <p className="text-[15px] text-[#8a8f98] mb-8 max-w-sm mx-auto">
            Create a workspace, upload your files, and start getting answers in
            under two minutes.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#5e6ad2] hover:bg-[#828fff] text-white text-[14px] font-medium transition-colors min-h-[40px]"
          >
            Create your workspace
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-[#23252a] px-6 py-10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <Wordmark size="sm" />
          <div className="flex items-center gap-6">
            {["Features", "Docs", "GitHub"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[12px] text-[#62666d] hover:text-[#8a8f98] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-[12px] text-[#62666d]">
            © 2025 IntelliVault. Built by Yash Bisht.
          </p>
        </div>
      </footer>
    </div>
  );
}
