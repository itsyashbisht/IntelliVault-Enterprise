"use client";

import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex max-h-screen h-full w-full bg-[var(--color-canvas)] overflow-hidden">
      {/* Children will render with sidebar + content in proper flex layout */}
      {children}
    </div>
  );
}
