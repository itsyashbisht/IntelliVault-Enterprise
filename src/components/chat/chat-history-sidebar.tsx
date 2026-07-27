"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
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
  desktopExpanded: boolean;
  mobileOpen: boolean;
  onDesktopToggle: () => void;
  onMobileOpenChange: (open: boolean) => void;
}

export default function ChatHistorySidebar({
  sessions,
  workspaceId,
  desktopExpanded,
  mobileOpen,
  onDesktopToggle,
  onMobileOpenChange,
}: ChatHistorySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeSessionId = pathname.split("/").at(-1);

  const handleNewChat = () => {
    router.push(`/workspace/${workspaceId}/chat`);
    onMobileOpenChange(false);
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/workspace/${workspaceId}/chat/${sessionId}`);
    onMobileOpenChange(false);
  };

  const historyList =
    sessions.length === 0 ? (
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
                "group w-full cursor-pointer rounded-md px-2.5 py-2 text-left transition-colors duration-100",
                isActive
                  ? "bg-[var(--color-surface-3)] text-[var(--color-ink)]"
                  : "text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink-muted)]"
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
    );

  const expandedPanel = (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--color-hairline)] px-3">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] px-2.5 text-[12px] font-medium text-[var(--color-ink-muted)] transition-colors duration-150 hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
        >
          <Plus size={14} strokeWidth={1.8} />
          <span className="truncate">New chat</span>
        </button>
        <button
          type="button"
          onClick={onDesktopToggle}
          className="hidden size-8 shrink-0 items-center justify-center rounded-md text-[var(--color-ink-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] md:inline-flex"
          aria-label="Collapse chat history"
        >
          <PanelLeftClose size={16} strokeWidth={1.7} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-3 pb-2 pt-4">
          <p className="px-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-tertiary)]">
            Conversations
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">{historyList}</div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => onMobileOpenChange(true)}
        className="absolute left-3 top-3 z-30 inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-1)] text-[var(--color-ink-muted)] shadow-sm transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] md:hidden"
        aria-label="Open chat history"
      >
        <PanelLeftOpen size={16} strokeWidth={1.7} />
      </button>

      <aside
        className={cn(
          "hidden h-dvh shrink-0 overflow-hidden border-r border-[var(--color-hairline)] bg-[var(--color-surface-1)] transition-[width] duration-200 ease-out md:flex md:flex-col",
          desktopExpanded ? "w-72" : "w-12"
        )}
      >
        {desktopExpanded ? (
          expandedPanel
        ) : (
          <div className="flex h-full flex-col items-center gap-2 py-3">
            <button
              type="button"
              onClick={onDesktopToggle}
              className="inline-flex size-8 items-center justify-center rounded-md text-[var(--color-ink-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              aria-label="Expand chat history"
            >
              <PanelLeftOpen size={16} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex size-8 items-center justify-center rounded-md text-[var(--color-ink-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              aria-label="New chat"
            >
              <Plus size={16} strokeWidth={1.8} />
            </button>
          </div>
        )}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/45 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => onMobileOpenChange(false)}
          aria-label="Close chat history"
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(320px,calc(100vw-48px))] flex-col border-r border-[var(--color-hairline)] bg-[var(--color-surface-1)] shadow-2xl transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--color-hairline)] px-3">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] px-2.5 text-[12px] font-medium text-[var(--color-ink-muted)] transition-colors duration-150 hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
            >
              <Plus size={14} strokeWidth={1.8} />
              <span className="truncate">New chat</span>
            </button>
            <button
              type="button"
              onClick={() => onMobileOpenChange(false)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--color-ink-tertiary)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              aria-label="Close chat history"
            >
              <PanelLeftClose size={16} strokeWidth={1.7} />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 px-3 pb-2 pt-4">
              <p className="px-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-tertiary)]">
                Conversations
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {historyList}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
