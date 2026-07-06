import { ChatUI } from "@/app/(app)/workspace/[workspaceId]/chat/chat-ui";
import ChatHistorySidebar from "@/components/chat/chat-history-sidebar";
import { db } from "@/lib/db-config";
import { chatSessions } from "@/schema";
import { eq } from "drizzle-orm";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const sessions = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.workspaceId, workspaceId));

  return (
    <div className="flex h-full w-full bg-[var(--color-canvas)]">
      {/* ── Chat history sidebar ────────────────── */}
      <ChatHistorySidebar workspaceId={workspaceId} sessions={sessions} />

      {/* ── Chat content area ────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ChatUI workspaceId={workspaceId} sessionId={null} />
      </div>
    </div>
  );
}
