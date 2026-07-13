import { db } from "@/lib/db-config";
import { workspaceMembers, workspaces } from "@/schema";
import { eq } from "drizzle-orm";
import DangerZone from "./danger-zone";
import GeneralSettings from "./general-setting";
import { auth } from "@clerk/nextjs/server";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const { userId } = await auth();

  const [workspace, membership] = await Promise.all([
    await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    }),
    await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, userId),
    }),
  ]);

  return (
    <div className="flex flex-col px-8 py-8 gap-8 max-w-full w-full">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold tracking-[-0.021em] text-[var(--color-ink)]">
          Settings
        </h1>
        <p className="text-[15px] text-[var(--color-ink-subtle)] mt-1">
          Manage workspace preferences.
        </p>
      </header>

      <main>
        <GeneralSettings workspace={workspace!} />
        {membership?.role && <DangerZone workspace={workspace!} role={membership.role} />}
      </main>
    </div>
  );
}
