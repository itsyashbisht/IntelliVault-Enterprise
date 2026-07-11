"use client";

import Wordmark from "@/components/workspace-home/wordmark";
import { useAuth } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(1,1,2,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #23252a" : "1px solid transparent",
      }}
    >
      <Link href="/" className="flex items-center">
        <Wordmark size="md" />
      </Link>

      <nav className="hidden md:flex items-center gap-0.5 ml-8">
        {["Features", "How it works", "Pricing"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            className="px-3 py-1.5 text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors rounded-[6px] hover:bg-[#0f1011]"
          >
            {item}{" "}
          </a>
        ))}{" "}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        {isLoaded &&
          (!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors bg-[#0f1011] !text-[#f7f8f8] border border-[#23252a] hover:bg-[#141516]"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors bg-[#5e6ad2] !text-white hover:bg-[#828fff]"
              >
                Get started
                <ChevronRight size={12} />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors bg-[#5e6ad2] text-white! hover:bg-[#828fff]"
              >
                Dashboard
                <ChevronRight size={12} />
              </Link>

              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="inline-flex items-center px-3 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors bg-[#0f1011] text-[#f7f8f8] border border-[#23252a] hover:bg-[#141516] cursor-pointer"
              >
                Sign out
              </button>
            </>
          ))}{" "}
      </div>
    </header>
  );
}
