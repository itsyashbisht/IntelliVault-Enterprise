"use client";
import { FolderPlus, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateWorkspaceModalProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  open,
  onSuccess,
  onClose,
}: CreateWorkspaceModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, isLoading]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setInputValue("");
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleCreate = async () => {
    if (!inputValue || inputValue.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputValue.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Failed to create workspace.");
      }

      toast.success("Workspace created!.");
      onSuccess(); // caller handles redirect
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to create the workspace. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={handleClose}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-[440px]
          bg-[var(--color-surface-1)]
          border border-[var(--color-hairline)]
          rounded-[16px] overflow-hidden
          shadow-2xl animate-fade-in
        "
      >
        {/* Header */}
        <div
          className="
          flex items-start justify-between
          px-6 py-5
          border-b border-[var(--color-hairline)]
        "
        >
          <div className="flex items-start gap-3">
            <div
              className="
              w-8 h-8 rounded-lg shrink-0
              bg-[var(--color-error)]/10
              border border-[var(--color-error)]/20
              flex items-center justify-center mt-0.5
            "
            >
              <FolderPlus size={15} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-[-0.2px]">
                Create workspace
              </h4>
              <p className="text-[13px] text-[var(--color-ink-subtle)]">
                Create a new workspace for your documents and team.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isLoading}
            className="
              w-7 h-7 rounded-md flex items-center justify-center shrink-0
              text-[var(--color-ink-tertiary)]
              hover:text-[var(--color-ink-muted)]
              hover:bg-[var(--color-surface-2)]
              transition-colors duration-100
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[var(--color-ink-muted)]">
              Workspace name
            </label>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              placeholder="Acme Inc."
              disabled={isLoading}
              className="text-[12px] font-small"
            />

            {error && (
              <p className="text-[12px] text-[var(--color-error)]">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="
                px-4 py-2 rounded-[8px] text-[13px] font-medium
                text-[var(--color-ink-subtle)]
                hover:text-[var(--color-ink-muted)]
                hover:bg-[var(--color-surface-2)]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors duration-100
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={isLoading}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-[8px]
                text-[13px] font-medium text-white
                bg-[var(--color-primary)]
                hover:bg-[var(--color-primary)]/90
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors duration-100
                min-w-[120px] justify-center
              "
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create workspace"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
