"use client";

import { useRouter } from "next/navigation";
import UploadDropzone from "@/components/documents/upload-dropzone";
import { toast } from "sonner";

export default function DocumentsClient({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const router = useRouter();
  return (
    <UploadDropzone
      workspaceId={workspaceId}
      onSuccess={() => {
        router.refresh();
        toast.success("Document Uploaded successfully!");
      }}
    />
  );
}
