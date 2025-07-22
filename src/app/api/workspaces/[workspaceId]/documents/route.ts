import { addContext, chunkContent } from "@/lib/chunking";
import { db } from "@/lib/db-config";
import { generateEmbeddings } from "@/lib/embedding";
import { extractTextFromFile, isSupportedType } from "@/lib/parsers";
import { chunks, documents, workspaceMembers } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

/*
  Ingestion pipeline — upload → extract → chunk → embed → store.
1. Authenticate the user.
2. Validate the workspaceId.
3. Read the uploaded PDF from form-data.
4. Extract text from the PDF.
5. Validate that text was extracted successfully.
6. Split the text into chunks.
7. Generate embeddings for all chunks.
8. Start a database transaction:
   a. Insert the document metadata.
   b. Insert all document chunks.
9. Commit the transaction.
10. Mark the document as "ready".
11. Return success response.
12. If any step fails, return an appropriate error response.
*/

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
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

    // Check for requester to have upload permission.
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

    // Form-data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isSupportedType(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Supported formats: PDF, DOCX, TXT, Markdown.",
        },
        { status: 400 }
      );
    }

    // Convert File to Buffer and extract text
    const fullText = await extractTextFromFile(file);
    if (!fullText || fullText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No text found in PDF, DOCX, TXT, Markdown file.",
        },
        { status: 404 }
      );
    }

    // Creating Chunks -> then embeddings
    const textChunks: string[] = await chunkContent(fullText);
    const contextualizedChunks = addContext(textChunks, file.name);
    const embeddings = await generateEmbeddings(contextualizedChunks);

    // No need to check !result -> transactions either return the result or throw an error.
    const result = await db.transaction(async (tx) => {
      // Insert in Documents
      const [document] = await tx
        .insert(documents)
        .values({
          workspaceId,
          uploadedBy: userId,
          name: file.name,
          fileSize: file.size,
          fileType: file.type,
        })
        .returning();

      const records = textChunks.map((chunk, i) => ({
        content: chunk,
        embedding: embeddings[i],
        chunkIndex: i + 1,
        documentId: document.id,
        pageNumber: null,
      }));

      // Insert in Chunks
      await tx.insert(chunks).values(records);

      await tx
        .update(documents)
        .set({
          status: "ready",
        })
        .where(eq(documents.id, document.id));

      return document;
    });

    return NextResponse.json(
      {
        success: true,
        documentId: result.id,
        message: "Document uploaded successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/[workspaceId]/documents ]", error);
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
