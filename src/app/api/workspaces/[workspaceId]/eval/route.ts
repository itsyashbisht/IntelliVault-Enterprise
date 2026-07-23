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
import { NextResponse } from "next/server";

/* 
Flow-
1. Auth check -> userId,
2. params + validation.
3. Membership check -> if requester is owner or editor -> only then proceed.
4. Query all 3 -> Promise.all
            - aggregated score
            - session based score bread-down
            - worst sessions.
5. Return response.            

*/

export async function GET(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Params + Validation
    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace id required.",
        },
        {
          status: 400,
        }
      );
    }

    // Membership check (only owner/editor)
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
        inArray(workspaceMembers.role, ["editor", "owner"])
      ),
    });
    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const [aggregateResult, sessionBreakdown, worstSessions] =
      await Promise.all([
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

    const avgScore = aggregateResult[0];

    return NextResponse.json(
      {
        success: true,
        data: {
          aggregate: avgScore,
          sessions: sessionBreakdown,
          worstSessions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/workspaces/[id]/eval]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
