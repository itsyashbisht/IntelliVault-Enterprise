"use client";

import ChatHistorySidebar from "@/components/chat/chat-history-sidebar";
import type { ChatSession } from "@/schema";
import type { UIMessage } from "ai";
import { useState } from "react";
import { ChatUI } from "./chat-ui";

interface ChatWrapperProps {
  workspaceId: string;
  sessions: ChatSession[];
  sessionId?: string | null;
  initialMessages?: UIMessage[];
}

export default function ChatWrapper({
  workspaceId,
  sessions,
  sessionId = null,
  initialMessages,
}: ChatWrapperProps) {
  const [desktopHistoryExpanded, setDesktopHistoryExpanded] = useState(true);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  return (
    <div className="relative flex h-dvh min-h-0 w-full overflow-hidden bg-[var(--color-canvas)]">
      <ChatHistorySidebar
        desktopExpanded={desktopHistoryExpanded}
        mobileOpen={mobileHistoryOpen}
        onDesktopToggle={() => setDesktopHistoryExpanded((open) => !open)}
        onMobileOpenChange={setMobileHistoryOpen}
        workspaceId={workspaceId}
        sessions={sessions}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatUI
          workspaceId={workspaceId}
          sessionId={sessionId}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
