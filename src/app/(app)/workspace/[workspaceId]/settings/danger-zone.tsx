"use client";

import Btn from "@/components/btn";
import DeleteWorkspaceModal from "@/components/delete-workspace-modal";
import { Workspace } from "@/schema";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DangerZoneProps {
  workspace: Workspace;
  role: string;
}

export default function DangerZone({ workspace, role }: DangerZoneProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="my-4">
      {role === "owner" && (
        <div className="bg-[#0f1011] border border-[#ef444430] rounded-[12px] p-5 sm:p-6">
          <h2 className="text-[14px] font-semibold text-[#ef4444] mb-1 tracking-[-0.2px]">
            Danger zone
          </h2>
          <p className="text-[13px] text-[#8a8f98] mb-4">
            Permanently delete this workspace and all its data. This action
            cannot be undone.
          </p>
          <Btn className="w-full sm:w-auto" variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 size={13} /> Delete workspace
          </Btn>
        </div>
      )}
      <DeleteWorkspaceModal
        open={isDeleteModalOpen}
        workspaceId={workspace.id}
        workspaceName={workspace.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          router.push("/dashboard");
        }}
      />
    </div>
  );
}

