import { FileText } from "lucide-react";

export default function CitationChip({ source }: { source: string }) {
  const display = source.length > 32 ? `${source.slice(0, 29)}...` : source;

  return (
    <div
      title={source}
      className="
        inline-flex max-w-[220px]
        items-center gap-1.5
        rounded-md
        border border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
        px-2 py-1.5
        text-[11px]
        text-[var(--color-ink-tertiary)]
        transition-colors duration-150
        hover:border-[var(--color-hairline-strong)]
        hover:bg-[var(--color-surface-2)]
        hover:text-[var(--color-ink-subtle)]
      "
    >
      <FileText size={11} className="shrink-0" />

      <span className="truncate">{display}</span>
    </div>
  );
}
