import { eq } from "drizzle-orm";
import DocumentTable from "@/components/documents/documents-table";
import { db } from "@/lib/db-config";
import { documents } from "@/schema";
import DocumentsClient from "./documents-client";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const docs = await db.query.documents.findMany({
    where: eq(documents.workspaceId, workspaceId),
    orderBy: (d, { desc }) => [desc(d.createdAt)],
  });

  return (
    <div className="flex flex-col px-8 py-8 gap-8 max-w-full w-full">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold tracking-[-0.021em] text-[var(--color-ink)]">
          Documents
        </h1>
        <p className="text-[15px] text-[var(--color-ink-subtle)] mt-1">
          Upload and manage your workspace documents.
        </p>
      </header>

      {/* Upload zone */}
      <DocumentsClient workspaceId={workspaceId} />

      {/* Document list */}
      <DocumentTable documents={docs} />
    </div>
  );
}
