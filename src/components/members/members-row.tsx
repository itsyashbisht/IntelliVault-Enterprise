import { MembersWithUsers } from "@/app/(app)/workspace/[workspaceId]/members/members-client";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

interface MemberRowProps {
  member: MembersWithUsers;
}

export default function MembersRow({ member }: MemberRowProps) {
  const { id, user, joinedAt, role } = member;

  return (
    <div
      className="
      grid min-w-[680px] grid-cols-[80px_minmax(120px,1fr)_minmax(160px,1.2fr)_minmax(110px,1fr)_80px_40px]
      items-center px-4 py-2.5
      hover:bg-[var(--color-surface-1)]
      transition-colors duration-100
      group
    "
    >
      {/* Member ID */}
      <span className="min-w-0">
        <span
          className="
          shrink-0 text-[9px] font-mono font-medium
          text-[var(--color-ink-tertiary)]
          px-1 py-0.5 rounded
          bg-[var(--color-surface-2)]
          border border-[var(--color-hairline)]
          tracking-wide
          inline-block
        "
        >
          {id.toUpperCase().trim().slice(0, 6)}
        </span>
      </span>

      {/* Member Name */}
      <span
        className="
          text-xs text-[var(--color-ink-muted)]
          truncate
          group-hover:text-[var(--color-ink)]
          transition-colors duration-100
        "
      >
        {user.fullName}
      </span>

      {/* Email */}
      <span className="text-xs text-[var(--color-ink-tertiary)] font-mono tabular-nums truncate">
        {user.email}
      </span>

      {/* Joined */}
      <span className="text-xs text-[var(--color-ink-tertiary)] truncate">
        {formatDistanceToNow(new Date(joinedAt), { addSuffix: true })}
      </span>

      {/* Role */}
      <span className="text-xs text-[var(--color-ink-tertiary)] font-mono tabular-nums truncate">
        {role}
      </span>

      {/* Delete action — only visible on hover */}
      <span className="flex items-center justify-center">
        <button
          type="button"
          className="
          opacity-0 group-hover:opacity-100
          transition-opacity duration-100
          p-1 rounded-md
          text-[var(--color-ink-tertiary)]
          hover:text-[var(--color-error)]
          hover:bg-[var(--color-error)]/10
        "
        >
          <Trash2 size={14} />
        </button>
      </span>
    </div>
  );
}
