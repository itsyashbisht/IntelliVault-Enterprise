"use client";
import { Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export type Session = {
  id: string;
  workspaceId: string;
  userId: string;
  title: string | null;
  createdAt: Date;
};

interface ChatHistorySidebarProps {
  sessions: Session[];
  workspaceId: string;
}

export default function ChatHistorySidebar({
  sessions,
  workspaceId,
}: ChatHistorySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Derive active session from URL — source of truth
  const activeSessionId = pathname.split("/").at(-1);

  const handleNewChat = () => {
    router.push(`/workspace/${workspaceId}/chat`);
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/workspace/${workspaceId}/chat/${sessionId}`);
  };

  return (
    <div
      className="
      w-[200px] shrink-0 flex flex-col
      border-r border-[var(--color-hairline)]
      bg-[var(--color-surface-1)]
      h-full
    "
    >
      {/* ── New chat button ────────────────── */}
      <div className="p-2 border-b border-[var(--color-hairline)] shrink-0">
        <button
          onClick={handleNewChat}
          className="
            w-full flex items-center gap-2
            px-2.5 py-2 rounded-md
            text-[13px] font-medium
            text-[var(--color-ink-subtle)]
            hover:bg-[var(--color-surface-2)]
            hover:text-[var(--color-ink-muted)]
            transition-colors duration-100
          "
        >
          <Plus size={13} strokeWidth={2} />
          New chat
        </button>
      </div>

      {/* ── Session list ───────────────────── */}
      <div className="flex-1 overflow-y-auto p-2">
        <p
          className="
          text-[10px] font-medium uppercase tracking-widest
          text-[var(--color-ink-tertiary)]
          px-2 py-2
        "
        >
          History
        </p>

        {sessions.length === 0 ? (
          <p className="text-[12px] text-[var(--color-ink-tertiary)] px-2 py-1.5">
            No conversations yet.
          </p>
        ) : (
          sessions.map((session) => {
            const isActive = activeSessionId === session.id;

            return (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={cn(
                  `w-full text-left px-2.5 py-2 rounded-md mb-0.5
                   transition-colors duration-100`,
                  isActive
                    ? "bg-[var(--color-surface-3)] text-[var(--color-ink)]"
                    : "text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink-muted)]",
                )}
              >
                <p className="text-[13px] font-medium truncate leading-snug">
                  {session.title ?? "Untitled"}
                </p>
                <p className="text-[11px] text-[var(--color-ink-tertiary)] mt-0.5 truncate">
                  {formatDistanceToNow(new Date(session.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
