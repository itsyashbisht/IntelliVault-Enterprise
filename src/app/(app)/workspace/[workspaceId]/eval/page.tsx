import ScoreCard from "@/components/eval/score-card";
import SessionTable from "@/components/eval/session-table";
import WorstSessions from "@/components/eval/worst-sessions";
import { db } from "@/lib/db-config";
import { chatSessions, messages, workspaceMembers } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
} from "drizzle-orm";
import { redirect } from "next/navigation";

/*
Flow-
1. Auth + membership check -> eval is owner/editor only (same rule as the API route).
2. Query all 3 -> Promise.all
            - aggregated score
            - session based score break-down
            - worst sessions.
3. Normalize -> avg() returns string | null, components want numbers.
4. Render -> ScoreCard, SessionTable, WorstSessions.
*/

// avg()/numeric come back from drizzle as string | null — coerce once here.
const toScore = (value: string | null) => Number(value ?? 0);

export default async function EvalPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workspaceId } = await params;

  // Eval scores are owner/editor only
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId),
      inArray(workspaceMembers.role, ["editor", "owner"])
    ),
  });
  if (!member) redirect(`/workspace/${workspaceId}`);

  const [aggregateResult, sessionBreakdown, worstSessions] = await Promise.all([
    db
      .select({
        avgContextRelevance: avg(messages.contextRelevance),
        avgFaithfulness: avg(messages.faithfulness),
        avgAnswerRelevance: avg(messages.answerRelevance),
      })
      .from(messages)
      .innerJoin(chatSessions, eq(chatSessions.id, messages.sessionId))
      .where(
        and(
          eq(messages.role, "assistant"),
          isNotNull(messages.contextRelevance),
          eq(chatSessions.workspaceId, workspaceId)
        )
      ),
    db
      .select({
        title: chatSessions.title,
        sessionId: chatSessions.id,
        createdAt: chatSessions.createdAt,
        messageCount: count(messages.id),

        avgContextRelevance: avg(messages.contextRelevance),
        avgFaithfulness: avg(messages.faithfulness),
        avgAnswerRelevance: avg(messages.answerRelevance),
      })
      .from(messages)
      .innerJoin(chatSessions, eq(chatSessions.id, messages.sessionId))
      .where(
        and(
          eq(chatSessions.workspaceId, workspaceId),
          eq(messages.role, "assistant"),
          isNotNull(messages.contextRelevance)
        )
      )
      .groupBy(chatSessions.id, chatSessions.title, chatSessions.createdAt)
      .orderBy(desc(chatSessions.createdAt)),

    db
      .select({
        title: chatSessions.title,
        sessionId: chatSessions.id,
        createdAt: chatSessions.createdAt,
        messageCount: count(messages.id),

        avgContextRelevance: avg(messages.contextRelevance),
        avgFaithfulness: avg(messages.faithfulness),
        avgAnswerRelevance: avg(messages.answerRelevance),
      })
      .from(messages)
      .innerJoin(chatSessions, eq(chatSessions.id, messages.sessionId))
      .where(
        and(
          eq(chatSessions.workspaceId, workspaceId),
          eq(messages.role, "assistant"),
          isNotNull(messages.contextRelevance)
        )
      )
      .groupBy(chatSessions.id, chatSessions.title, chatSessions.createdAt)
      .orderBy(asc(avg(messages.contextRelevance)))
      .limit(5),
  ]);

  const aggregate = {
    avgContextRelevance: toScore(aggregateResult[0]?.avgContextRelevance),
    avgFaithfulness: toScore(aggregateResult[0]?.avgFaithfulness),
    avgAnswerRelevance: toScore(aggregateResult[0]?.avgAnswerRelevance),
  };

  const normalizeSession = (
    session: (typeof sessionBreakdown)[number]
  ) => ({
    ...session,
    avgContextRelevance: toScore(session.avgContextRelevance),
    avgFaithfulness: toScore(session.avgFaithfulness),
    avgAnswerRelevance: toScore(session.avgAnswerRelevance),
  });

  const sessions = sessionBreakdown.map(normalizeSession);
  const worst = worstSessions.map(normalizeSession);

  return (
    <div className="flex flex-col px-8 py-8 gap-8 max-w-full w-full">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold tracking-[-0.021em] text-[var(--color-ink)]">
          Evaluation
        </h1>
        <p className="text-[15px] text-[var(--color-ink-subtle)] mt-1">
          RAG quality scores for every assistant response in this workspace.
        </p>
      </header>

      <main className="flex flex-col gap-8">
        <ScoreCard aggregate={aggregate} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
          <SessionTable sessions={sessions} workspaceId={workspaceId} />
          <WorstSessions sessions={worst} workspaceId={workspaceId} />
        </div>
      </main>
    </div>
  );
}
