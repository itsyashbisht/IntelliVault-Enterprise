import { Document } from "@/components/documents/documents-row";
import { Badge } from "lucide-react";
import StatusBadge from "@/components/documents/status-badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface DocumentListProps {
  documents: Document[];
  workspaceId: string;
}

export default function DocumentList({
  documents,
  workspaceId,
}: DocumentListProps) {
  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#23252a]">
        <span className="text-[13px] font-semibold text-[#f7f8f8] tracking-[-0.2px]">
          Recent documents
        </span>
        <Link
          href={`/workspace/${workspaceId}/documents`}
          className="text-[12px] text-[#5e6ad2] hover:text-[#828fff] transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-[#23252a]">
        {documents.map((doc) => {
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#141516] transition-colors"
            >
              <div className="w-7 h-7 rounded-[6px] bg-[#18191a] flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-[#62666d]">
                  {doc.fileType
                    .replace("application/", "")
                    .replace("text/", "")
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#d0d6e0] truncate">
                  {doc.name}
                </p>
                <p className="text-[11px] text-[#62666d]">
                  {doc.fileSize} ·{" "}
                  {formatDistanceToNow(new Date(doc.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <StatusBadge status={doc.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
