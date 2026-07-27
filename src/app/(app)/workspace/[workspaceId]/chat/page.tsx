import { db } from "@/lib/db-config";
import { chatSessions } from "@/schema";
import { eq } from "drizzle-orm";
import ChatWrapper from "./chat-wrapper";

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

  return <ChatWrapper sessions={sessions} workspaceId={workspaceId} />;
}
