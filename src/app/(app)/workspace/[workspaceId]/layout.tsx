import { db } from "@/lib/db-config";
import { workspaces } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import MobileTopSidebar from "../mobile-top-sidebar";
import Sidebar from "./sidebar";

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
    <div className="flex h-dvh min-h-0 flex-col bg-[var(--color-canvas)] md:flex-row">
      <MobileTopSidebar
        workspaceId={workspaceId}
        workspaceName={workspace.name}
      />
      <Sidebar workspaceId={workspaceId} workspaceName={workspace.name} />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[var(--color-canvas)]">
        {children}
      </main>
    </div>
  );
}

