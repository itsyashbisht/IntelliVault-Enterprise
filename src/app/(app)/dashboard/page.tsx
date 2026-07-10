import { auth } from "@clerk/nextjs/server";
import { documents, workspaceMembers, workspaces } from "@/schema";
import { count, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db-config";
import DashboardClient from "@/app/(app)/dashboard/dashboard-client";

export default async function WorkspacesDashboard() {
  const { userId } = await auth();

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
    .where(eq(workspaceMembers.userId, userId));

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
    docCounts.map((d) => [d.workspaceId, Number(d.count)]),
  );
  const memberCountMap = Object.fromEntries(
    memberCounts.map((m) => [m.workspaceId, Number(m.count)]),
  );

  // Merge everything together
  const workspaceData = memberships.map((m) => ({
    id: m.workspaceId,
    name: m.workspaceName,
    slug: m.workspaceSlug,
    role: m.role,
    createdAt: m.workspaceCreatedAt,
    docCount: docCountMap[m.workspaceId] ?? 0,
    memberCount: memberCountMap[m.workspaceId] ?? 0,
  }));

  return <DashboardClient workspaces={workspaceData} />;
}
