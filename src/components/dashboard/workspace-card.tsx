import { WorkspaceData } from "@/app/(app)/dashboard/dashboard-client";
import Badge from "@/components/badge";
import { FileText, Users } from "lucide-react";
import Link from "next/link";

interface Props {
  workspace: WorkspaceData;
}

export default function WorkspaceCard({ workspace }: Props) {
  return (
    <Link
      href={`/workspace/${workspace.id}`}
      key={workspace.id}
      className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5 text-left hover:bg-[#141516] hover:border-[#34343a] transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-[8px] bg-[#5e6ad2]/15 flex items-center justify-center">
          <span className="text-[14px] font-bold text-[#5e6ad2]">
            {workspace.name[0]}
          </span>
        </div>
        <Badge variant={workspace.role}>{workspace.role}</Badge>
      </div>

      <h3 className="text-[15px] font-semibold text-[#f7f8f8] tracking-[-0.3px] mb-0.5">
        {workspace.name}
      </h3>
      <p className="text-[12px] text-[#62666d] mb-4 font-mono">
        {workspace.slug}
      </p>

      {/*<Divider className="mb-4" />*/}

      <div className="flex items-center gap-4 text-[12px] text-[#8a8f98]">
        <span className="flex items-center gap-1.5">
          <FileText size={12} className="text-[#62666d]" />
          {workspace.docCount} docs
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} className="text-[#62666d]" />
          {workspace.memberCount} members
        </span>
      </div>
    </Link>
  );
}
