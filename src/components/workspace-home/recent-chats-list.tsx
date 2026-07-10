import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { db } from "@/lib/db-config";
import { Message, messages } from "@/schema";
import { and, desc, eq } from "drizzle-orm";

export type ChatSession = {
  id: string;
  workspaceId: string;
  userId: string;
  title: string | null;
  createdAt: Date;
};

interface RecentChatsListProps {
  chats: ChatSession[];
  recentMessages: Message[];
  workspaceId: string;
}

export default function RecentChatsList({
  chats,
  workspaceId,
}: RecentChatsListProps) {
  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] overflow-hidden">
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#23252a]">
        <span className="text-[13px] font-semibold text-[#f7f8f8] tracking-[-0.2px]">
          Recent chats
        </span>
        <Link
          href={`/workspace/${workspaceId}/chat`}
          className="text-[12px] text-[#5e6ad2] hover:text-[#828fff] transition-colors"
        >
          View chats
        </Link>
      </header>

      {chats.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center px-6">
          <MessageSquare size={20} className="text-[#62666d] mb-2" />
          <p className="text-[13px] text-[#8a8f98]">No conversations yet</p>
          <button className="text-[12px] text-[#5e6ad2] hover:text-[#828fff] mt-2 transition-colors">
            Start chatting →
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#23252a]">
          {chats.map(async (chat: ChatSession) => {
            const msgs = await db.query.messages.findMany({
              where: and(eq(messages.sessionId, chat.id)),
              orderBy: desc(messages.createdAt),
            });

            const firstMessage = msgs[0]?.content.slice(0, 75) + "...";

            return (
              <Link
                href={`/workspace/${workspaceId}/chat/${chat.id}`}
                key={chat.id}
                className="w-full flex items-start gap-3 px-5 py-3 hover:bg-[#141516] transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#5e6ad2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare size={11} className="text-[#5e6ad2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#d0d6e0] truncate">
                    {chat.title}
                  </p>
                  <p className="text-[11px] text-[#62666d] truncate mt-0.5">
                    {firstMessage ? `${firstMessage}` : "Tap to view"}
                  </p>
                </div>
                <span className="text-[11px] text-[#62666d] flex-shrink-0 mt-0.5">
                  {formatDistanceToNow(new Date(chat.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
