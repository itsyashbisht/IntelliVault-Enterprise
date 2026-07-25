import { cn } from "@/lib/utils";
import React from "react";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode | string;
  variant?:
    | "default"
    | "processing"
    | "ready"
    | "failed"
    | "editor"
    | "owner"
    | "admin"
    | "viewer";
}) {
  const styles = {
    default: "bg-[#141516] text-[#d0d6e0]",
    processing: "bg-[#5e6ad220] text-[#828fff]",
    ready: "bg-[#27a64420] text-[#27a644]",
    failed: "bg-[#ef444420] text-[#ef4444]",
    owner: "bg-[#5e6ad215] text-[#828fff]",
    admin: "bg-[#23252a] text-[#d0d6e0]",
    viewer: "bg-[#18191a] text-[#8a8f98]",
    editor: "bg-[#06b6d420] text-[#22d3ee]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide",
        styles[variant]
      )}
    >
      {variant === "processing" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#828fff] animate-pulse" />
      )}
      {variant === "ready" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
      )}
      {variant === "failed" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
      )}
      {children}
    </span>
  );
}
