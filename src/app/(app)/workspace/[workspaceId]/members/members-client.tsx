"use client";
import InviteMembersModal from "@/components/members/invite-members-modal";
import MembersTable from "@/components/members/members-table";
import { Button } from "@/components/ui/button";
import { LucideUsers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type MembersWithUsers = {
  user: {
    fullName: string | null;
    email: string | undefined;
  };
  id: string;
  joinedAt: Date;
  role: "editor" | "owner" | "viewer";
  userId: string;
  workspaceId: string;
};

interface MembersClientProps {
  workspaceId: string;
  members: MembersWithUsers[];
}

export default function MembersClient(props: MembersClientProps) {
  const { workspaceId, members } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="flex gap-1 justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold tracking-[-0.021em] text-[var(--color-ink)]">
            Members
          </h1>
          <p className="text-[15px] text-[var(--color-ink-subtle)] mt-1">
            {members.length} members in this workspace.
          </p>
        </div>

        <div>
          <Button onClick={() => setOpen(true)}>
            <LucideUsers />
            Invite members
          </Button>
          <InviteMembersModal
            open={open}
            onClose={() => setOpen(false)}
            workspaceId={workspaceId}
            onSuccess={() => {
              router.refresh();
            }}
          />
        </div>
      </header>

      {/* Members list */}
      <MembersTable members={members} />
    </>
  );
}
