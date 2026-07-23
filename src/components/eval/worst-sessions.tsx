import { scoreColor } from "@/components/eval/score-bar";
import { SessionScore } from "@/components/eval/session-table";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface WorstSessionsProps {
  sessions: SessionScore[];
  workspaceId: string;
}

export default function WorstSessions({
  sessions,
  workspaceId,
}: WorstSessionsProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#23252a]">
        <AlertTriangle size={13} className="text-[#e54d2e]" />
        <span className="text-[13px] font-semibold text-[#f7f8f8] tracking-[-0.2px]">
          Lowest context relevance
        </span>
      </div>

      <div className="divide-y divide-[#23252a]">
        {sessions.map((session) => {
          const color = scoreColor(session.avgContextRelevance);
          return (
            <Link
              key={session.sessionId}
              href={`/workspace/${workspaceId}/chat/${session.sessionId}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#141516] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#d0d6e0] truncate">
                  {session.title ?? "Untitled session"}
                </p>
                <p className="text-[11px] text-[#62666d]">
                  {session.messageCount}{" "}
                  {session.messageCount === 1 ? "response" : "responses"}{" "}
                  evaluated
                </p>
              </div>
              <span
                className="text-[13px] font-semibold tabular-nums"
                style={{ color }}
              >
                {session.avgContextRelevance.toFixed(2)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
