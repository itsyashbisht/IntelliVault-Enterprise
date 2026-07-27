import { db } from "@/lib/db-config";
import { eq } from "drizzle-orm";
import { workspaceMembers } from "@/schema";
import { clerkClient } from "@clerk/nextjs/server";
import MembersClient from "./members-client";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
  });

  // Fetch user data on the server
  const client = await clerkClient();
  const membersWithUsers = await Promise.all(
    members.map(async (member) => {
      const user = await client.users.getUser(member.userId);
      return {
        ...member,
        user: {
          fullName: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
      };
    })
  );

  return (
    <div className="flex flex-col px-8 py-8 gap-8 max-w-full w-full">
      {/* Page header */}
      <MembersClient workspaceId={workspaceId} members={membersWithUsers} />
    </div>
  );
}

