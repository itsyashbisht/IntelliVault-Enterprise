"use client";

import Wordmark from "@/components/workspace-home/wordmark";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardNav() {
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 bg-[rgba(1,1,2,0.92)] backdrop-blur-[12px] border-b border-[#23252a]">
      <Link href="/" className="flex items-center">
        <Wordmark size="md" />
      </Link>

      <button
        onClick={() => signOut({ redirectUrl: "/" })}
        className="ml-auto inline-flex items-center px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors bg-[#0f1011] text-[#f7f8f8] border border-[#23252a] hover:bg-[#141516] cursor-pointer"
      >
        Sign out
      </button>
    </header>
  );
}
