import { generateTitle } from "@/app/api/workspaces/[workspaceId]/chat/sessions/utils";
import { db } from "@/lib/db-config";
import { chatSessions, workspaceMembers } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/*
Flow - Create session
1. Check auth + params & Validate
2. Get first message from body.
3. Check whether the requester is member of this workspace or not?
4. Generate a firstMessage based tittle for the chat session, by LLM.
5. Validate that title is not empty before creating session.
6. All set -> Create a row in session. (DB call)
7. handle errors
8. try - catch and return  final response -> sessionId & title only
*/
export async function POST(
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

    // Req-body
    const { firstMessage } = await req.json();
    if (!firstMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "First message required.",
        },
        {
          status: 400,
        }
      );
    }

    // Membership-check
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden Access, You are not a member of this workspace",
        },
        {
          status: 403,
        }
      );
    }

    // Generating Title
    const title = (await generateTitle(firstMessage)) ?? "New Chat-X";
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Error Generating Chat title.",
        },
        { status: 500 }
      );
    }

    // DB insertion
    const [session] = await db
      .insert(chatSessions)
      .values({
        title,
        workspaceId,
        userId,
      })
      .returning();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Error Creating Chat session.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { sessionId: session.id, title: session.title },
        message: "Chat session created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/workspaces/[workspaceId]/chat/sessions ]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

/*
Flow - Get chat-session
1. Check auth + params & Validate
2. Check whether the requester is member of this workspace or not?
3. DB-query -> get sessions.
4. try and catch + return final response -> Array of sessions.
*/

export async function GET(
  _: Request,
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

    // Membership-check
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden Access, You are not a member of this workspace",
        },
        {
          status: 403,
        }
      );
    }

    const recentSessions = await db
      .select()
      .from(chatSessions)
      .where(
        and(
          eq(chatSessions.workspaceId, workspaceId),
          eq(chatSessions.userId, userId)
        )
      )
      .orderBy(desc(chatSessions.createdAt))
      .limit(10);

    if (recentSessions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No sessions found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: recentSessions,
        message: "Recent sessions fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/workspaces/[workspaceId]/chat/sessions ]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
