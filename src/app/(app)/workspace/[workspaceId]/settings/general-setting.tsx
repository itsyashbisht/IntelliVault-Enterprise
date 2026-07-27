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
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update workspace name. Please try again.";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-surface-1)]">
      {/* Section header */}
      <div className="border-b border-[var(--color-hairline)] px-4 py-5 sm:px-6">
        <h2 className="text-[14px] font-semibold tracking-[-0.2px] text-[var(--color-ink)]">
          General
        </h2>
        <p className="mt-0.5 text-[13px] text-[var(--color-ink-subtle)]">
          Update your workspace name and settings.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex max-w-sm flex-col gap-2">
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
            className="w-full rounded-[8px] border border-[var(--color-hairline)] bg-[var(--color-surface-2)] px-3 py-2.5 text-[14px] text-[var(--color-ink)] outline-none transition-all duration-150 placeholder:text-[var(--color-ink-tertiary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {error && (
            <p className="text-[12px] text-[var(--color-error)]">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-[var(--color-hairline)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--color-ink-tertiary)]">
            This updates the workspace name for all members.
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={isDisabled}
            className={
              saveState === "success"
                ? "inline-flex w-full min-w-[110px] items-center justify-center gap-2 rounded-[8px] border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 px-4 py-2 text-[13px] font-medium text-[var(--color-success)] transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                : "inline-flex w-full min-w-[110px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 text-[13px] font-medium text-white transition-colors duration-100 hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            }
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
