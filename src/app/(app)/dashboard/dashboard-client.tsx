import WorkspaceCard from "@/components/dashboard/workspace-card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";

export type WorkspaceData = {
  id: string;
  name: string;
  slug: string;
  role: string;
  createdAt: Date;
  docCount: Number;
  memberCount: Number;
};

interface DashboardProps {
  workspaces: WorkspaceData[];
}

export default function DashboardClient({ workspaces }: DashboardProps) {
  return (
    <main className="pt-14 max-w-[1280px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#f7f8f8] tracking-[-0.6px]">
            Workspaces
          </h1>
          <p className="text-[14px] text-[#8a8f98] mt-0.5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <WorkspaceCard workspace={ws} key={ws.id} />
          ))}

          {/* Create new card */}
          <button className="border border-dashed border-[#23252a] rounded-[12px] p-5 flex flex-col items-center justify-center text-center hover:border-[#34343a] hover:bg-[#0f1011] transition-all gap-2 min-h-[180px] group">
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
        </div>
      )}
    </main>
  );
}
