import ChatWrapper from "@/app/(app)/workspace/[workspaceId]/chat/chat-wrapper";
import { db } from "@/lib/db-config";
import { chatSessions, messages } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ workspaceId: string; sessionId: string }>;
}) {
  const { userId } = await auth();
  const { workspaceId, sessionId } = await params;

  const [sessions, dbMessages] = await Promise.all([
    db.query.chatSessions.findMany({
      where: and(
        eq(chatSessions.workspaceId, workspaceId),
        eq(chatSessions.userId, userId!)
      ),
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    }),
    db.query.messages.findMany({
      where: eq(messages.sessionId, sessionId),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    }),
  ]);

  const initialMessages = dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: "text" as const, text: msg.content }],
    metadata: {},
  }));

  return (
    <ChatWrapper
      sessions={sessions}
      workspaceId={workspaceId}
      sessionId={sessionId}
      initialMessages={initialMessages}
    />
  );
}
