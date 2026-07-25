import DashboardClient from "@/app/(app)/dashboard/dashboard-client";
import { db } from "@/lib/db-config";
import { documents, workspaceMembers, workspaces } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { count, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function WorkspacesDashboard() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const memberships = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
      role: workspaceMembers.role,
      workspaceName: workspaces.name,
      workspaceSlug: workspaces.slug,
      workspaceCreatedAt: workspaces.createdAt,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.id, userId!));

  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [docCounts, memberCounts] = await Promise.all([
    await db
      .select({
        workspaceId: documents.workspaceId,
        count: count(),
      })
      .from(documents)
      .where(inArray(documents.workspaceId, workspaceIds))
      .groupBy(documents.workspaceId),
    await db
      .select({
        workspaceId: workspaceMembers.workspaceId,
        count: count(),
      })
      .from(workspaceMembers)
      .where(inArray(workspaceMembers.workspaceId, workspaceIds))
      .groupBy(workspaceMembers.workspaceId),
  ]);

  // Turn arrays into lookup maps for O(1) access
  const docCountMap = Object.fromEntries(
    docCounts.map((d) => [d.workspaceId, Number(d.count)])
  );
  const memberCountMap = Object.fromEntries(
    memberCounts.map((m) => [m.workspaceId, Number(m.count)])
  );

  // Merge everything together
  const workspaceData = memberships.map((m) => ({
    id: m.workspaceId,
    name: m.workspaceName,
    slug: m.workspaceSlug,
    role: m.role,
    createdAt: m.workspaceCreatedAt,
    memberCount: memberCountMap[m.workspaceId] ?? 0,
    docCount: docCountMap[m.workspaceId] ?? 0,
  }));

  return <DashboardClient workspaces={workspaceData} />;
}
