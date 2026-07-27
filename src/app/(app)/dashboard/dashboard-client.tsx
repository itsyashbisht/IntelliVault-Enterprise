"use client";
import CreateWorkspaceModal from "@/components/dashboard/create-workspace-modal";
import WorkspaceCard from "@/components/dashboard/workspace-card";
import { Button } from "@/components/ui/button";
import { Role } from "@/schema/enums";
import { FolderOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type WorkspaceData = {
  id: string;
  name: string;
  slug: string;
  role: Role;
  createdAt: Date;
  docCount: number;
  memberCount: number;
};

interface DashboardProps {
  workspaces: WorkspaceData[];
}

export default function DashboardClient({ workspaces }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState<string>("");

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-6 lg:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-[#f7f8f8] sm:text-[28px]">
            Workspaces
          </h1>
          <p className="mt-0.5 text-[14px] text-[#8a8f98]">
            Manage your document collections and teams.
          </p>
        </div>
      </div>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-[12px] bg-[#0f1011] border border-[#23252a] flex items-center justify-center mb-4">
            <FolderOpen size={22} className="text-[#62666d]" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#f7f8f8] mb-2">
            No workspaces yet
          </h3>
          <p className="text-[13px] text-[#8a8f98] mb-6">
            Create your first workspace to start uploading documents.
          </p>
          <Button variant="default">
            <Plus size={13} /> Create workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard workspace={ws} key={ws.id} />
          ))}

          {/* Create new card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-[#23252a] rounded-[12px] p-5 flex flex-col items-center justify-center text-center hover:border-[#34343a] hover:bg-[#0f1011] transition-all gap-2 min-h-[180px] group"
          >
            <div className="w-8 h-8 rounded-full bg-[#18191a] flex items-center justify-center group-hover:bg-[#23252a] transition-colors">
              <Plus
                size={14}
                className="text-[#62666d] group-hover:text-[#8a8f98] transition-colors"
              />
            </div>
            <span className="text-[13px] text-[#62666d] group-hover:text-[#8a8f98] transition-colors">
              New workspace
            </span>
          </button>
          <CreateWorkspaceModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              router.refresh();
            }}
          />
        </div>
      )}
    </main>
  );
}

