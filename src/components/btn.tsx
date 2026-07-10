import React from "react";
import { cn } from "@/lib/utils";

export default function Btn({
  children,
  variant = "primary",
  size = "sm",
  className = "",
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center gap-1.5 font-medium rounded-[8px] transition-colors cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-[13px]", md: "px-4 py-2 text-[14px]" };
  const variants = {
    primary: "bg-[#5e6ad2] text-white hover:bg-[#828fff] active:bg-[#5e69d1]",
    secondary:
      "bg-[#0f1011] text-[#f7f8f8] border border-[#23252a] hover:bg-[#141516]",
    ghost:
      "bg-transparent text-[#8a8f98] hover:bg-[#0f1011] hover:text-[#f7f8f8]",
    destructive:
      "bg-[#ef444415] text-[#ef4444] border border-[#ef444430] hover:bg-[#ef444425]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
}
