"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { allNavLinks, getNavHref, isNavActive } from "../nav";

interface SidebarProps {
  workspaceId: string;
  workspaceName: string;
}

export default function Sidebar({ workspaceId, workspaceName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="
        sticky top-0
        hidden h-dvh w-[240px] shrink-0 flex-col
        overflow-hidden
        border-r border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
        md:flex
        z-20
      "
    >
      <div
        className="
          flex h-14 shrink-0 items-center justify-between gap-3
          border-b border-[var(--color-hairline)]
          px-3
        "
      >
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] text-[var(--color-ink-tertiary)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
          aria-label="Back to dashboard"
        >
          <ChevronLeft size={14} strokeWidth={1.7} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[var(--color-surface-2)]">
          <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline-strong)] bg-[var(--color-surface-3)]">
            <span className="text-[11px] font-semibold leading-none text-[var(--color-primary)]">
              {workspaceName?.[0]?.toUpperCase() ?? "W"}
            </span>
          </div>

          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.1px] text-[var(--color-ink)]">
            {workspaceName}
          </span>
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col px-2 py-3">
        <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-tertiary)]">
          Workspace
        </p>

        <div className="flex flex-col gap-[2px]">
          {allNavLinks.map((nav) => {
            const href = getNavHref(nav.href, workspaceId);
            const Icon = nav.icon;
            const active = isNavActive(pathname, href, nav.exact);

            return (
              <Link
                key={nav.label}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] no-underline transition-colors duration-100",
                  active
                    ? "bg-[var(--color-surface-3)] font-medium text-[var(--color-ink)]"
                    : "font-normal text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink-muted)]"
                )}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2 : 1.5}
                  className={cn(
                    "shrink-0 transition-colors duration-100",
                    active
                      ? "text-[var(--color-ink-muted)]"
                      : "text-[var(--color-ink-tertiary)]"
                  )}
                />

                <span className="truncate">{nav.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-[var(--color-hairline)] p-2">
        <UserButton
          showName
          appearance={{
            elements: {
              avatarBox: "w-[26px] h-[26px] shrink-0 rounded-full",
              userButtonBox: "flex-row gap-2.5 w-full min-w-0",
              userButtonTrigger:
                "flex min-w-0 w-full items-center gap-2.5 rounded-md px-3 py-[7px] hover:bg-[var(--color-surface-2)] transition-colors duration-150",
              userButtonOuterIdentifier:
                "min-w-0 flex-1 truncate text-left text-[13px] font-medium text-[var(--color-ink-muted)]",
            },
          }}
        />
      </div>
    </aside>
  );
}
