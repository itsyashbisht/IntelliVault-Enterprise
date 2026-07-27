"use client";

import Wordmark from "@/components/workspace-home/wordmark";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardNav() {
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-[#23252a] bg-[rgba(1,1,2,0.92)] px-4 backdrop-blur-[12px] sm:px-6">
      <Link href="/" className="flex items-center">
        <Wordmark size="md" />
      </Link>

      <button
        onClick={() => signOut({ redirectUrl: "/" })}
        className="ml-auto inline-flex cursor-pointer items-center rounded-[8px] border border-[#23252a] bg-[#0f1011] px-3 py-1.5 text-[13px] font-medium text-[#f7f8f8] transition-colors hover:bg-[#141516]"
      >
        Sign out
      </button>
    </header>
  );
}
