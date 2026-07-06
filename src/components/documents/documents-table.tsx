import { FileX } from "lucide-react";
import DocumentRow, {
  type Document,
} from "@/components/documents/documents-row";

interface DocumentTableProps {
  documents: Document[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-hairline)]">
      <div
        className="
        grid min-w-[680px] grid-cols-[minmax(220px,1fr)_88px_128px_116px_40px]
        px-4 py-3
        border-b border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
      "
      >
        {["Name", "Size", "Uploaded", "Status", ""].map((col) => (
          <span
            key={col}
            className="text-xs font-medium text-[var(--color-ink-tertiary)] tracking-[0.04em] uppercase"
          >
            {col}
          </span>
        ))}
      </div>

      {documents.length === 0 ? (
        <div className="flex min-w-[680px] flex-col items-center justify-center gap-3 bg-[var(--color-canvas)] py-16">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-hairline)] flex items-center justify-center">
            <FileX size={18} className="text-[var(--color-ink-tertiary)]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-[var(--color-ink-muted)]">
              No documents yet
            </p>
            <p className="text-xs text-[var(--color-ink-tertiary)]">
              Upload your first file above to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-hairline)] bg-[var(--color-canvas)]">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
