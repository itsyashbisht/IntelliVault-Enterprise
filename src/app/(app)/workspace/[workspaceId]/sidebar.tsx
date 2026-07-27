"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  BarChart2,
  ChevronLeft,
  FileText,
  Home,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
  workspaceId: string;
  workspaceName: string;
}

const primaryNav = [
  {
    label: "Home",
    href: `/workspace/:workspaceId`,
    icon: Home,
    exact: true,
  },
  {
    label: "Chat",
    href: `/workspace/:workspaceId/chat`,
    icon: MessageSquare,
    exact: false,
  },
  {
    label: "Documents",
    href: `/workspace/:workspaceId/documents`,
    icon: FileText,
    exact: false,
  },
  {
    label: "Members",
    href: `/workspace/:workspaceId/members`,
    icon: Users,
    exact: false,
  },
];

const secondaryNav = [
  {
    label: "Eval",
    href: `/workspace/:workspaceId/eval`,
    icon: BarChart2,
    exact: false,
  },
  {
    label: "Settings",
    href: `/workspace/:workspaceId/settings`,
    icon: Settings,
    exact: false,
  },
];

const allNavLinks = [...primaryNav, ...secondaryNav];

function getNavHref(href: string, workspaceId: string) {
  return href.replace(":workspaceId", workspaceId);
}

export default function Sidebar({ workspaceId, workspaceName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Close More sheet on outside tap
  useEffect(() => {
    if (!moreOpen) return;
    const handle = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [moreOpen]);

  // Close on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const anySecondaryActive = secondaryNav.some((nav) =>
    isActive(getNavHref(nav.href, workspaceId), nav.exact)
  );

  return (
    <>
      {/* ── Mobile: compact header ── */}
      <div className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-1)] md:hidden">
        <div className="flex h-12 items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={14} strokeWidth={1.7} />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-hairline-strong)] bg-[var(--color-surface-3)]">
              <span className="text-[10px] font-semibold leading-none text-[var(--color-primary)]">
                {workspaceName?.[0]?.toUpperCase() ?? "W"}
              </span>
            </div>
            <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
              {workspaceName}
            </p>
          </div>

          <div className="shrink-0">
            <UserButton
              appearance={{
                elements: { avatarBox: "h-7 w-7 rounded-full" },
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile: bottom nav bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t border-[var(--color-hairline)] bg-[var(--color-surface-1)] md:hidden">
        {primaryNav.map((nav) => {
          const href = getNavHref(nav.href, workspaceId);
          const Icon = nav.icon;
          const active = isActive(href, nav.exact);

          return (
            <Link
              key={nav.label}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-100",
                active
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink-muted)]"
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-[var(--color-primary)]" />
              )}
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-medium leading-none">
                {nav.label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-100",
            moreOpen || anySecondaryActive
              ? "text-[var(--color-ink)]"
              : "text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink-muted)]"
          )}
        >
          <MoreHorizontal size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </nav>

      {/* ── Mobile: More sheet ── */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/20 md:hidden" />

          {/* Sheet */}
          <div
            ref={sheetRef}
            className="fixed bottom-16 right-2 z-50 w-56 overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-1)] shadow-xl md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-tertiary)]">
                More
              </span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]"
              >
                <X size={14} strokeWidth={1.7} />
              </button>
            </div>

            <div className="flex flex-col py-1.5">
              {secondaryNav.map((nav) => {
                const href = getNavHref(nav.href, workspaceId);
                const Icon = nav.icon;
                const active = isActive(href, nav.exact);

                return (
                  <Link
                    key={nav.label}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-[14px] transition-colors duration-100",
                      active
                        ? "bg-[var(--color-surface-3)] font-medium text-[var(--color-ink)]"
                        : "font-normal text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink-muted)]"
                    )}
                  >
                    <Icon
                      size={16}
                      strokeWidth={active ? 2 : 1.5}
                      className={cn(
                        active
                          ? "text-[var(--color-ink-muted)]"
                          : "text-[var(--color-ink-tertiary)]"
                      )}
                    />
                    <span>{nav.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Desktop: sidebar (unchanged) ── */}
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
              const active = isActive(href, nav.exact);

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
    </>
  );
}
