import { FileX } from "lucide-react";
import MembersRow from "@/components/members/members-row";
import { MembersWithUsers } from "@/app/(app)/workspace/[workspaceId]/members/members-client";


interface MembersTableProps {
  members: MembersWithUsers[];
}

export default function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-hairline)]">
      <div
        className="
        grid min-w-[680px] grid-cols-[80px_minmax(120px,1fr)_minmax(160px,1.2fr)_minmax(110px,1fr)_80px_40px]
        px-4 py-2.5
        border-b border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
      "
      >
        {["Id", "Member", "Email", "Joined", "Role", " "].map((col) => (
          <span
            key={col}
            className="text-xs font-medium text-[var(--color-ink-tertiary)] tracking-[0.04em] uppercase"
          >
            {col}
          </span>
        ))}
      </div>

      {members.length === 0 ? (
        <div className="flex min-w-[680px] flex-col items-center justify-center gap-3 bg-[var(--color-canvas)] py-16">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-hairline)] flex items-center justify-center">
            <FileX size={18} className="text-[var(--color-ink-tertiary)]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-[var(--color-ink-muted)]">
              No Members yet
            </p>
            <p className="text-xs text-[var(--color-ink-tertiary)]">
              Upload your first file above to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-hairline)] bg-[var(--color-canvas)]">
          {members.map((member) => (
            <MembersRow key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
