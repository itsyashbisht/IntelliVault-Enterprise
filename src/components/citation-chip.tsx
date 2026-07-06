import { FileText } from "lucide-react";

export default function CitationChip({ source }: { source: string }) {
  // Truncate to 30 chars for display
  const display = source.length > 35 ? source.slice(0, 32) + "..." : source;

  return (
    <div
      title={source} // full name on hover
      className="
        inline-flex items-center gap-2
        px-3 py-2 rounded-md
        bg-[var(--color-surface-2)]
        border border-[var(--color-hairline)]
        text-[13px] font-400 text-[var(--color-ink-subtle)]
        hover:border-[var(--color-hairline-strong)]
        hover:text-[var(--color-ink-muted)]
        hover:bg-[var(--color-surface-3)]
        transition-all duration-150
        max-w-[240px]
      "
    >
      <FileText
        size={13}
        className="text-[var(--color-ink-tertiary)] shrink-0"
      />
      <span className="truncate">{display}</span>
    </div>
  );
}
