"use client";
import React, { useRef, useState } from "react";
import { AlertCircle, Loader2, UploadCloud } from "lucide-react";
import { SUPPORTED_TYPES } from "@/lib/parsers/index";
import { toast } from "sonner";

type DropzoneState = "idle" | "dragover" | "uploading" | "error";

interface UploadDropzoneProps {
  workspaceId: string;
  onSuccess: () => void;
}

export default function UploadDropzone({
  workspaceId,
  onSuccess,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef<number>(0);
  const [state, setState] = useState<DropzoneState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleClick = () => inputRef.current?.click();

  const handleDragEnter = () => {
    dragCounter.current++;
    setState("dragover");
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) setState("idle");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file: File) => {
    // Validate size
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File exceeds 50 MB limit.");
      setErrorMessage("File exceeds 50 MB limit.");
      setState("error");
      return;
    }

    // Validate type
    const allowed = [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, Docx, TXT, or Markdown files are supported.");
      setErrorMessage("Only PDF,Docx, TXT, or Markdown files are supported.");
      setState("error");
      return;
    }

    setFileName(file.name);
    setState("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/workspaces/${workspaceId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed. Please try again.");

      onSuccess();
      setState("idle");
      setFileName("");
    } catch (err: any) {
      const msg = err.message ?? "Something went wrong.";
      toast.error(msg);
      setErrorMessage(msg);
      setState("error");
    }
  };

  // ─── Derived styles per state ──────────────────────────────
  const containerStyles = {
    idle: "border-[var(--color-hairline)] hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-1)]",
    dragover:
      "border-[var(--color-primary)] bg-[rgba(94,106,210,0.06)] scale-[1.005]",
    uploading:
      "border-[var(--color-hairline)] bg-[var(--color-surface-1)] opacity-80 pointer-events-none",
    error: "border-[var(--color-error)] bg-[rgba(229,77,46,0.05)]",
  };

  const iconStyles = {
    idle: "text-[var(--color-ink-tertiary)] group-hover:text-[var(--color-ink-subtle)]",
    dragover: "text-[var(--color-primary)]",
    uploading: "text-[var(--color-ink-subtle)]",
    error: "text-[var(--color-error)]",
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload document"
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`
        group relative flex flex-col items-center justify-center
        w-full rounded-xl border-2 border-dashed
        px-8 py-18 cursor-pointer
        transition-all duration-200 ease-out select-none
        ${containerStyles[state]}
      `}
    >
      {/* Icon */}
      <div
        className={`
        mb-4 flex items-center justify-center
        w-12 h-12 rounded-xl
        bg-[var(--color-surface-2)] border border-[var(--color-hairline)]
        transition-all duration-200
        ${state === "dragover" ? "border-[var(--color-primary)] bg-[rgba(94,106,210,0.10)] scale-110" : ""}
      `}
      >
        {state === "uploading" ? (
          <Loader2
            size={20}
            className="text-[var(--color-ink-subtle)] animate-spin"
          />
        ) : state === "error" ? (
          <AlertCircle size={20} className={iconStyles[state]} />
        ) : (
          <UploadCloud
            size={20}
            className={`transition-all duration-200 ${iconStyles[state]}`}
          />
        )}
      </div>

      {/* Text content */}
      {state === "uploading" ? (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-[var(--color-ink)]">
            Uploading
            <span className="text-[var(--color-ink-subtle)] font-normal ml-1">
              {fileName}
            </span>
          </p>
          <p className="text-xs text-[var(--color-ink-tertiary)]">
            Extracting · Chunking · Embedding
          </p>

          {/* Progress bar */}
          <div className="mt-3 w-48 h-px bg-[var(--color-hairline)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)] rounded-full animate-[progress_2s_ease-in-out_infinite]" />
          </div>
        </div>
      ) : state === "error" ? (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-[var(--color-error)]">
            Upload failed
          </p>
          <p className="text-xs text-[var(--color-ink-subtle)]">
            {errorMessage}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setState("idle");
              setErrorMessage("");
            }}
            className="mt-3 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-[var(--color-ink)]">
            {state === "dragover"
              ? "Release to upload"
              : "Drop files here or click to browse"}
          </p>
          <p className="text-xs text-[var(--color-ink-tertiary)]">
            PDF, Markdown, or plain text · Max 50 MB per file
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // reset input so same file can be re-uploaded
          e.target.value = "";
        }}
      />
    </div>
  );
}
