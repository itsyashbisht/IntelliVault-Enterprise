import { db } from "@/lib/db-config";
import { documents, workspaceMembers } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

/*
1. Auth check -> userId.
2. Get workspaceId + documentId from param + valdiate them.
3. Check the requester is either OWNER/EDITOR of that workspace.
4. Verify document belongs to this workspace — prevent cross-tenant deletion
5. Delete document row → cascade deletes chunks automatically
6. Final response
7. handle error with try & catch.
*/

export async function DELETE(
  _: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string; documentId: string }>;
  }
) {
  try {
    // Authentication.
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

    // Validation.
    const { workspaceId, documentId } = await params;
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
    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Document id required.",
        },
        {
          status: 400,
        }
      );
    }

    //Membership check
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId),
        inArray(workspaceMembers.role, ["owner", "editor"])
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

    const documentExists = await db.query.documents.findFirst({
      where: and(
        eq(documents.id, documentId),
        eq(documents.workspaceId, workspaceId)
      ),
    });

    if (!documentExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Document does not found in this workspace.",
        },
        {
          status: 404,
        }
      );
    }

    // Delete row
    const [deletedDoc] = await db
      .delete(documents)
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.workspaceId, workspaceId)
        )
      )
      .returning();

    if (!deletedDoc) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete the document. Please try again!",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("[POST /api/[workspaceId]/documents/[documentId] ]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
