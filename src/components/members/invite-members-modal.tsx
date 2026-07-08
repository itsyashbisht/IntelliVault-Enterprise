"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2, Mail, X } from "lucide-react";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess: () => void;
}

type ModalState = "idle" | "loading" | "success" | "error";

export default function InviteMembersModal({
  open,
  onClose,
  workspaceId,
  onSuccess,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ModalState>("idle");
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
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Reset state when modal reopens
  useEffect(() => {
    if (open) {
      setEmail("");
      setState("idle");
      setError(null);
    }
  }, [open]);

  // Don't close while loading
  const handleClose = () => {
    if (state === "loading") return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;

    setState("loading");
    setError(null);

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to send invite.");
      }

      setState("success");
      onSuccess();

      // Auto-close after showing success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send invite. Please try again.",
      );
    }
  };

  // ── Don't render if closed ────────────────────────────────
  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={handleClose}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-[440px]
          bg-[var(--color-surface-1)]
          border border-[var(--color-hairline)]
          rounded-[16px]
          shadow-2xl
          overflow-hidden
          animate-fade-in
        "
      >
        {/* Header */}
        <div
          className="
          flex items-center justify-between
          px-6 py-5
          border-b border-[var(--color-hairline)]
        "
        >
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[15px] font-semibold text-[var(--color-ink)] tracking-[-0.2px]">
              Invite member
            </h4>
            <p className="text-[13px] text-[var(--color-ink-subtle)]">
              They'll receive an email with a link to join.
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={state === "loading"}
            className="
              w-7 h-7 rounded-md flex items-center justify-center
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

        {/* Body  */}
        <div className="px-6 py-6">
          {/* Success state */}
          {state === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                <CheckCircle
                  size={22}
                  className="text-[var(--color-success)]"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[14px] font-medium text-[var(--color-ink)]">
                  Invite sent
                </p>
                <p className="text-[13px] text-[var(--color-ink-subtle)]">
                  {email}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="invite-email"
                  className="text-[13px] font-medium text-[var(--color-ink-muted)]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)] pointer-events-none"
                  />
                  <input
                    id="invite-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") {
                        setState("idle");
                        setError(null);
                      }
                    }}
                    disabled={state === "loading"}
                    placeholder="colleague@company.com"
                    className="
                      w-full pl-9 pr-4 py-2.5
                      bg-[var(--color-surface-2)]
                      border border-[var(--color-hairline)]
                      rounded-[8px]
                      text-[14px] text-[var(--color-ink)]
                      placeholder:text-[var(--color-ink-tertiary)]
                      focus:border-[var(--color-primary)]
                      focus:ring-2 focus:ring-[var(--color-primary)]/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      outline-none transition-all duration-150
                    "
                  />
                </div>

                {/* Error message */}
                {state === "error" && error && (
                  <p className="text-[12px] text-[var(--color-error)]">
                    {error}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={state === "loading"}
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
                  type="submit"
                  disabled={state === "loading" || !email.trim()}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-[8px]
                    text-[13px] font-medium text-white
                    bg-[var(--color-primary)]
                    hover:bg-[var(--color-primary-hover)]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors duration-100
                    min-w-[90px] justify-center
                  "
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send invite"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
