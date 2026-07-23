"use client";

import { Loader2, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DeleteDocumentModalProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
  workspaceId: string;
  documentId: string;
  documentTitle: string;
}

export default function DeleteDocumentModal({
  open,
  onSuccess,
  onClose,
  workspaceId,
  documentId,
  documentTitle,
}: DeleteDocumentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [open, onClose, isLoading]);

  useEffect(() => {
    if (open) {
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message ?? "Failed to delete document.");
      }

      onSuccess();
    } catch (err) {
      const msg = err instanceof Error
        ? err.message
        : "Failed to delete the document. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70 p-4
        backdrop-blur-[4px]
      "
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-[420px]
          overflow-hidden
          rounded-xl
          border border-[var(--color-hairline)]
          bg-[var(--color-surface-1)]
        "
      >
        {/* Header */}
        <div
          className="
            flex items-start justify-between
            border-b border-[var(--color-hairline)]
            px-5 py-4
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                mt-0.5 flex size-8 shrink-0
                items-center justify-center
                rounded-lg
                border border-[var(--color-error)]/20
                bg-[var(--color-error)]/10
              "
            >
              <TriangleAlert size={15} className="text-[var(--color-error)]" />
            </div>

            <div>
              <h4
                className="
                  text-[15px] font-semibold
                  tracking-[-0.2px]
                  text-[var(--color-ink)]
                "
              >
                Delete document
              </h4>

              <p
                className="
                  mt-1 text-[13px]
                  text-[var(--color-ink-subtle)]
                "
              >
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="
              flex size-7 shrink-0
              items-center justify-center
              rounded-md
              text-[var(--color-ink-tertiary)]
              transition-colors duration-100
              hover:bg-[var(--color-surface-2)]
              hover:text-[var(--color-ink-muted)]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-5 py-5">
          <div
            className="
              rounded-lg
              border border-[var(--color-hairline)]
              bg-[var(--color-surface-2)]
              px-4 py-3
            "
          >
            <p
              className="
                text-[13px] leading-relaxed
                text-[var(--color-ink-subtle)]
              "
            >
              Deleting{" "}
              <span className="font-medium text-[var(--color-ink)]">
                {documentTitle}
              </span>{" "}
              will permanently remove this document and its associated chunks
              from your workspace.
            </p>
          </div>

          {error && (
            <p className="text-[12px] text-[var(--color-error)]">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="
                rounded-md
                px-4 py-2
                text-[13px] font-medium
                text-[var(--color-ink-subtle)]
                transition-colors duration-100
                hover:bg-[var(--color-surface-2)]
                hover:text-[var(--color-ink-muted)]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="
                inline-flex min-w-[120px]
                items-center justify-center gap-2
                rounded-md
                bg-[var(--color-error)]
                px-4 py-2
                text-[13px] font-medium
                text-white
                transition-colors duration-100
                hover:bg-[var(--color-error)]/80
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete document"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
