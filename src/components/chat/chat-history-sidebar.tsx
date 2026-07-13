"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Plus } from "lucide-react";
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

  const activeSessionId = pathname.split("/").at(-1);

  const handleNewChat = () => {
    router.push(`/workspace/${workspaceId}/chat`);
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/workspace/${workspaceId}/chat/${sessionId}`);
  };

  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-[var(--color-hairline)] bg-[var(--color-surface-1)]">
      <div className="flex h-14 shrink-0 items-center border-b border-[var(--color-hairline)] px-3">
        <button
          type="button"
          onClick={handleNewChat}
          className="
            flex h-8 w-full cursor-pointer
            items-center gap-2 rounded-md
            border border-[var(--color-hairline)]
            bg-[var(--color-surface-2)]
            px-2.5
            text-[12px] font-medium
            text-[var(--color-ink-muted)]
            transition-colors duration-150
            hover:border-[var(--color-hairline-strong)]
            hover:bg-[var(--color-surface-3)]
            hover:text-[var(--color-ink)]
          "
        >
          <Plus size={14} strokeWidth={1.8} />

          <span>New chat</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-3 pb-2 pt-4">
          <p className="px-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-tertiary)]">
            Conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-10 text-center">
              <div className="mb-3 flex size-8 items-center justify-center rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)]">
                <MessageSquare
                  size={14}
                  className="text-[var(--color-ink-tertiary)]"
                />
              </div>

              <p className="text-[12px] text-[var(--color-ink-subtle)]">
                No conversations yet
              </p>

              <p className="mt-1 text-[11px] leading-4 text-[var(--color-ink-tertiary)]">
                Your chat history will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {sessions.map((session) => {
                const isActive = activeSessionId === session.id;

                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleSessionClick(session.id)}
                    className={cn(
                      `
                        group w-full cursor-pointer
                        rounded-md px-2.5 py-2
                        text-left
                        transition-colors duration-100
                      `,
                      isActive
                        ? `
                          bg-[var(--color-surface-3)]
                          text-[var(--color-ink)]
                        `
                        : `
                          text-[var(--color-ink-subtle)]
                          hover:bg-[var(--color-surface-2)]
                          hover:text-[var(--color-ink-muted)]
                        `
                    )}
                  >
                    <p className="truncate text-[12px] font-medium leading-5">
                      {session.title ?? "Untitled conversation"}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-[var(--color-ink-tertiary)]">
                      {formatDistanceToNow(new Date(session.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
