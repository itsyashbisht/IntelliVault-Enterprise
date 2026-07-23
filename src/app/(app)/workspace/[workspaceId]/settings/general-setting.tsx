"use client";

import { Workspace } from "@/schema";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface GeneralSettingsProps {
  workspace: Workspace;
}

type SaveState = "idle" | "loading" | "success";

export default function GeneralSettings({ workspace }: GeneralSettingsProps) {
  const [workspaceName, setWorkspaceName] = useState(workspace?.name ?? "");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isDirty = workspaceName.trim() !== workspace.name;
  const isDisabled =
    !workspaceName.trim() || !isDirty || saveState === "loading";

  const handleSave = async () => {
    if (isDisabled) return;

    if (!workspaceName.trim()) {
      setError("Workspace name cannot be empty.");
      return;
    }

    setSaveState("loading");
    setError(null);

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "Failed to update workspace name.");
      }

      setSaveState("success");
      toast.success("Workspace name updated.");
      router.refresh();

      // Reset back to idle after showing success
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("idle");
      const msg = err instanceof Error
        ? err.message
        : "Failed to update workspace name. Please try again.";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div
      className="
      bg-[var(--color-surface-1)]
      border border-[var(--color-hairline)]
      rounded-[12px] overflow-hidden
    "
    >
      {/* Section header */}
      <div className="px-6 py-5 border-b border-[var(--color-hairline)]">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)] tracking-[-0.2px]">
          General
        </h2>
        <p className="text-[13px] text-[var(--color-ink-subtle)] mt-0.5">
          Update your workspace name and settings.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2 max-w-sm">
          <label
            htmlFor="workspace-name"
            className="text-[13px] font-medium text-[var(--color-ink-muted)]"
          >
            Workspace name
          </label>

          <input
            id="workspace-name"
            type="text"
            value={workspaceName}
            onChange={(e) => {
              setWorkspaceName(e.target.value);
              setError(null);
              if (saveState === "success") setSaveState("idle");
            }}
            disabled={saveState === "loading"}
            placeholder="e.g. Acme Research"
            className="
              w-full px-3 py-2.5 rounded-[8px]
              bg-[var(--color-surface-2)]
              border border-[var(--color-hairline)]
              text-[14px] text-[var(--color-ink)]
              placeholder:text-[var(--color-ink-tertiary)]
              focus:border-[var(--color-primary)]
              focus:ring-2 focus:ring-[var(--color-primary)]/20
              disabled:opacity-50 disabled:cursor-not-allowed
              outline-none transition-all duration-150
            "
          />

          {error && (
            <p className="text-[12px] text-[var(--color-error)]">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div
          className="
          flex items-center justify-between
          pt-4 border-t border-[var(--color-hairline)]
        "
        >
          <p className="text-[12px] text-[var(--color-ink-tertiary)]">
            This updates the workspace name for all members.
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={isDisabled}
            className="
              inline-flex items-center gap-2
              px-4 py-2 rounded-[8px]
              text-[13px] font-medium
              transition-colors duration-100
              min-w-[110px] justify-center
              disabled:opacity-40 disabled:cursor-not-allowed
              ${saveState === 'success'
                ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
              }
            "
            style={{
              backgroundColor:
                saveState === "success" ? "rgba(39,166,68,0.10)" : undefined,
              color:
                saveState === "success" ? "var(--color-success)" : undefined,
              border:
                saveState === "success"
                  ? "1px solid rgba(39,166,68,0.20)"
                  : undefined,
            }}
          >
            {saveState === "loading" ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving...
              </>
            ) : saveState === "success" ? (
              <>
                <Check size={13} />
                Saved
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
