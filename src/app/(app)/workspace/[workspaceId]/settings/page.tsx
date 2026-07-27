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
      where: eq(workspaceMembers.userId, userId!),
    }),
  ]);

  return (
    <div className="flex w-full max-w-full flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] font-semibold tracking-[-0.021em] text-[var(--color-ink)] sm:text-[28px]">
          Settings
        </h1>
        <p className="mt-1 text-[15px] text-[var(--color-ink-subtle)]">
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

