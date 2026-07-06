import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db-config";
import { workspaces } from "@/schema";
import Sidebar from "./sidebar";
import React from "react";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workspaceId } = await params;

  const member = await db.query.workspaceMembers.findFirst({
    where: (wm, { and, eq }) =>
      and(eq(wm.workspaceId, workspaceId), eq(wm.userId, userId)),
  });

  if (!member) redirect("/dashboard");

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  if (!workspace) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh bg-[var(--color-canvas)]">
      <Sidebar workspaceId={workspaceId} workspaceName={workspace.name} />
      <main className="flex-1 min-w-0 overflow-y-auto bg-[var(--color-canvas)] ">
        {children}
      </main>
    </div>
  );
}
