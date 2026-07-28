import { scoreColor } from "@/components/eval/score-bar";
import { formatDistanceToNow } from "date-fns";
import { BarChart2 } from "lucide-react";
import Link from "next/link";

export interface SessionScore {
  sessionId: string;
  title: string | null;
  createdAt: Date;
  messageCount: number;
  avgContextRelevance: number;
  avgFaithfulness: number;
  avgAnswerRelevance: number;
}

function ScoreCell({ score }: { score: number }) {
  return (
    <span
      className="text-[13px] font-medium tabular-nums"
      style={{ color: scoreColor(score) }}
    >
      {score.toFixed(2)}
    </span>
  );
}

interface SessionTableProps {
  sessions: SessionScore[];
  workspaceId: string;
}

export default function SessionTable({
  sessions,
  workspaceId,
}: SessionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-hairline)]">
      <div
        className="
        grid min-w-[680px] grid-cols-[minmax(180px,2fr)_minmax(90px,1fr)_110px_110px_110px_80px]
        px-4 py-2.5
        border-b border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
      "
      >
        {["Session", "Created", "Context", "Faithful", "Answer", "Msgs"].map(
          (col) => (
            <span
              key={col}
              className="text-xs font-medium text-[var(--color-ink-tertiary)] tracking-[0.04em] uppercase"
            >
              {col}
            </span>
          )
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex min-w-[680px] flex-col items-center justify-center gap-3 bg-[var(--color-canvas)] py-16">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-hairline)] flex items-center justify-center">
            <BarChart2 size={18} className="text-[var(--color-ink-tertiary)]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-[var(--color-ink-muted)]">
              No evaluated sessions yet
            </p>
            <p className="text-xs text-[var(--color-ink-tertiary)]">
              Scores appear here after chat responses are evaluated
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-hairline)] bg-[var(--color-canvas)]">
          {sessions.map((session) => (
            <Link
              key={session.sessionId}
              href={`/workspace/${workspaceId}/chat/${session.sessionId}`}
              className="grid min-w-[680px] grid-cols-[minmax(180px,2fr)_minmax(90px,1fr)_110px_110px_110px_80px] items-center px-4 py-3 hover:bg-[#141516] transition-colors"
            >
              <span className="text-[13px] text-[#d0d6e0] truncate pr-4">
                {session.title ?? "Untitled session"}
              </span>
              <span className="text-[12px] text-[#62666d]">
                {formatDistanceToNow(new Date(session.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <ScoreCell score={session.avgContextRelevance} />
              <ScoreCell score={session.avgFaithfulness} />
              <ScoreCell score={session.avgAnswerRelevance} />
              <span className="text-[13px] text-[#8a8f98] tabular-nums">
                {session.messageCount}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
