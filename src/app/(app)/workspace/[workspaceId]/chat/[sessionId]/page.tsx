import ChatHistorySidebar from "@/components/chat/chat-history-sidebar";
import { ChatUI } from "@/app/(app)/workspace/[workspaceId]/chat/chat-ui";
import { db } from "@/lib/db-config";
import { chatSessions, messages } from "@/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ workspaceId: string; sessionId: string }>;
}) {
  const { userId } = await auth();
  const { workspaceId, sessionId } = await params;

  // Both in parallel — sidebar needs sessions, chat needs messages
  const [sessions, dbMessages] = await Promise.all([
    db.query.chatSessions.findMany({
      where: and(
        eq(chatSessions.workspaceId, workspaceId),
        eq(chatSessions.userId, userId!),
      ),
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    }),
    db.query.messages.findMany({
      where: eq(messages.sessionId, sessionId),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    }),
  ]);

  const UIMessage = dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: "text" as const, text: msg.content }],
    metadata: {},
  }));

  return (
    <div className="flex h-full w-full">
      {/* ── Chat history sidebar ────────────────── */}
      <ChatHistorySidebar sessions={sessions} workspaceId={workspaceId} />

      {/* ── Chat content area ────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ChatUI
          workspaceId={workspaceId}
          sessionId={sessionId}
          initialMessages={UIMessage}
        />
      </div>
    </div>
  );
}
