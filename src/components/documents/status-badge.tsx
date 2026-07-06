const variants: Record<string, string> = {
  ready: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  processing: "text-[var(--color-warning)] bg-[var(--color-warning)]/10",
  failed: "text-[var(--color-error)]   bg-[var(--color-error)]/10",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 text-[13px] rounded-full
        font-medium
        ${variants[status] ?? "text-[var(--color-ink-subtle)] bg-[var(--color-surface-2)]"}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </div>
  );
}
