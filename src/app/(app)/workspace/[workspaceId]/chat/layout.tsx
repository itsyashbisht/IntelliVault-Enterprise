"use client";
import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="h-full w-full overflow-hidden bg-[var(--color-canvas)]">
      {children}
    </div>
  );
}
