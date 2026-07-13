"use client";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import StatusBadge from "@/components/documents/status-badge";
import { useState } from "react";
import DeleteDocumentModal from "./delete-document-modal";
import { useRouter } from "next/navigation";

export type Document = {
  id: string;
  workspaceId: string;
  createdAt: Date;
  uploadedBy: string;
  name: string;
  fileType: string;
  fileSize: number;
  status: string;
};

interface DocumentsRowProps {
  document: Document;
  workspaceId: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentRow({
  document,
  workspaceId,
}: DocumentsRowProps) {
  const { createdAt, name, fileType, fileSize, status } = document;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div
      className="
      grid min-w-[680px] grid-cols-[minmax(220px,1fr)_88px_128px_116px_40px]
      items-center px-4 py-4
      hover:bg-[var(--color-surface-1)]
      transition-colors duration-100
      group
    "
    >
      {/* Name + filetype chip */}
      <span className="flex items-center gap-2.5 min-w-0">
        <span
          className="
          shrink-0 text-[10px] font-mono font-medium
          text-[var(--color-ink-tertiary)]
          px-1.5 py-0.5 rounded
          bg-[var(--color-surface-2)]
          border border-[var(--color-hairline)]
          tracking-wide
        "
        >
          {fileType
            .replace("application/", "")
            .replace("text/", "")
            .toUpperCase()}
        </span>
        <span
          className="
          text-sm text-[var(--color-ink-muted)]
          truncate
          group-hover:text-[var(--color-ink)]
          transition-colors duration-100
        "
        >
          {name}
        </span>
      </span>

      {/* Size */}
      <span className="text-sm text-[var(--color-ink-tertiary)] font-mono tabular-nums">
        {formatSize(fileSize)}
      </span>

      {/* Uploaded */}
      <span className="text-sm text-[var(--color-ink-tertiary)]">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </span>

      {/* Status */}
      <span>
        <StatusBadge status={status} />
      </span>

      {/* Delete action — only visible on hover */}
      <span className="flex items-center justify-center">
        <button
          type="button"
          className="
          opacity-0 group-hover:opacity-100
          transition-opacity duration-100
          p-1.5 rounded-md
          text-[var(--color-ink-tertiary)]
          hover:text-[var(--color-error)]
          hover:bg-[var(--color-error)]/10
        "
          onClick={() => setIsModalOpen(true)}
        >
          <Trash2 size={14} />
        </button>
        <DeleteDocumentModal
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
          workspaceId={workspaceId}
          documentId={document.id}
          documentTitle={document.name}
          onSuccess={() => {
            setIsModalOpen(false);
            router.refresh();
          }}
        />
      </span>
    </div>
  );
}
