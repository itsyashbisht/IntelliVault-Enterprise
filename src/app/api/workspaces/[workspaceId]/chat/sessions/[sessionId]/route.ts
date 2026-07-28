/*
Flow - Delete chat-session
1. Check auth + params & Validate
2. Check whether the requester is editor/admin of this workspace or not?
3. check that sessionId is valid and exists in the database for the given workspaceId
4. DB-query -> delete the session.
5. try and catch + return final response -> message.
*/

import { db } from "@/lib/db-config";
import { chatSessions, workspaceMembers } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string; sessionId: string }> }
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
        { status: 401 }
      );
    }

    // Params + Validation
    const { workspaceId, sessionId } = await params;
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

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Session id required.",
        },
        {
          status: 400,
        }
      );
    }

    const ownership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
        inArray(workspaceMembers.role, ["editor", "owner"])
      ),
    });

    if (!ownership) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden access, You are not allowed to perform this.",
        },
        {
          status: 403,
        }
      );
    }

    const sessionExists = await db.query.chatSessions.findFirst({
      where: and(
        eq(chatSessions.id, sessionId),
        eq(chatSessions.userId, userId)
      ),
    });

    if (!sessionExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found!",
        },
        {
          status: 404,
        }
      );
    }

    const [deletedSession] = await db
      .delete(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .returning();

    if (!deletedSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete the session in DB.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Session deleted successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "[DELETE /api/workspaces/[workspaceId]/chat/sessions/[sessionId] ]",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
