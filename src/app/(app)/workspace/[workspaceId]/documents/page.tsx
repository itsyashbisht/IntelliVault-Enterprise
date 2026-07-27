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
    <div className="flex w-full max-w-full flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold tracking-[-0.021em] text-[var(--color-ink)] sm:text-[28px]">
          Documents
        </h1>
        <p className="mt-1 text-[15px] text-[var(--color-ink-subtle)]">
          Upload and manage your workspace documents.
        </p>
      </header>

      {/* Upload zone */}
      <DocumentsClient workspaceId={workspaceId} />

      {/* Document list */}
      <DocumentTable workspaceId={workspaceId} documents={docs} />
    </div>
  );
}

