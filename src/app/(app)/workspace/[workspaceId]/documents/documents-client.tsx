"use client";

import { useRouter } from "next/navigation";
import UploadDropzone from "@/components/documents/upload-dropzone";

export default function DocumentsClient({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const router = useRouter();
  return (
    <UploadDropzone
      workspaceId={workspaceId}
      onSuccess={() => router.refresh()}
    />
  );
}
