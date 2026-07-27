import { db } from "@/lib/db-config";
import { count, desc, eq, inArray } from "drizzle-orm";
import { chatSessions, documents, messages, workspaceMembers } from "@/schema";
import { FileText, MessageSquare, Users } from "lucide-react";
import StatsCard from "@/components/stats-card";
import DocumentList from "@/components/workspace-home/document-list";
import RecentChatsList from "@/components/workspace-home/recent-chats-list";

export default async function HomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const [recentDocuments, recentChatSessions] = await Promise.all([
    db.query.documents.findMany({
      where: eq(documents.workspaceId, workspaceId),
      limit: 5,
    }),
    db.query.chatSessions.findMany({
      where: eq(chatSessions.workspaceId, workspaceId),
      limit: 5,
    }),
  ]);

  const [docCount, memberCount, sessionCount] = await Promise.all([
    db
      .select({ count: count() })
      .from(documents)
      .where(eq(documents.workspaceId, workspaceId)),
    db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId)),
    db
      .select({ count: count() })
      .from(chatSessions)
      .where(eq(chatSessions.workspaceId, workspaceId)),
  ]);

  const stats = [
    {
      label: "Documents",
      value: docCount[0].count,
      icon: FileText,
    },
    {
      label: "Members",
      value: memberCount[0].count,
      icon: Users,
    },
    {
      label: "Conversations",
      value: sessionCount[0].count,
      icon: MessageSquare,
    },
  ];

  // page.tsx
  const sessionIds = recentChatSessions.map((s) => s.id);
  const recentMessages = await db.query.messages.findMany({
    where: inArray(messages.sessionId, sessionIds),
    orderBy: desc(messages.createdAt),
  });

  return (
    <div className="flex w-full max-w-full flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold tracking-[-0.021em] text-[var(--color-ink)] sm:text-[28px]">
          IntelliVault Intelligence
        </h1>
        <p className="mt-1 text-[15px] text-[var(--color-ink-subtle)]">
          Overview of your workspace activity and recent documents.{" "}
        </p>
      </header>

      <main>
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            return (
              <StatsCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            );
          })}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DocumentList documents={recentDocuments} workspaceId={workspaceId} />
          <RecentChatsList
            chats={recentChatSessions}
            workspaceId={workspaceId}
            recentMessages={recentMessages}
          />
        </div>
      </main>
    </div>
  );
}

