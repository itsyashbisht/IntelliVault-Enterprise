"use client";

import { usePathname } from "next/navigation";
import {
  ChevronDown,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

interface SidebarProps {
  workspaceId: string;
  workspaceName: string;
}

export default function Sidebar({ workspaceId, workspaceName }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const navLinks = [
    {
      label: "Home",
      href: `/workspace/${workspaceId}`,
      icon: Home,
      exact: true,
    },
    {
      label: "Documents",
      href: `/workspace/${workspaceId}/documents`,
      icon: FileText,
      exact: false,
    },
    {
      label: "Chat",
      href: `/workspace/${workspaceId}/chat`,
      icon: MessageSquare,
      exact: false,
    },
    {
      label: "Members",
      href: `/workspace/${workspaceId}/members`,
      icon: Users,
      exact: false,
    },
    {
      label: "Settings",
      href: `/workspace/${workspaceId}/settings`,
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <aside
      className="
      flex flex-col w-[240px] shrink-0
      h-dvh sticky top-0
      bg-[var(--color-surface-1)]
      border-r border-[var(--color-hairline)]
      overflow-y-auto
    "
    >
      {/* ── Workspace header ───────────────── */}
      <div
        className="
        flex items-center justify-between
        px-4 h-[52px] shrink-0
        border-b border-[var(--color-hairline)]
      "
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Initial badge — fixed small size */}
          <div
            className="
            shrink-0 w-[22px] h-[22px] rounded-md
            bg-[var(--color-primary)]/20
            border border-[var(--color-primary)]/30
            flex items-center justify-center
          "
          >
            <span className="text-[11px] font-bold text-[var(--color-primary)] leading-none">
              {workspaceName?.[0]?.toUpperCase() ?? "W"}
            </span>
          </div>

          {/* Workspace name — 13px matches Linear exactly */}
          <span className="text-[14px] font-semibold text-[var(--color-ink)] truncate leading-none">
            {workspaceName}
          </span>
        </div>

        <ChevronDown
          size={13}
          className="shrink-0 text-[var(--color-ink-tertiary)]"
        />
      </div>

      {/* ── Nav links ──────────────────────── */}
      <nav className="flex flex-col gap-[2px] px-2 py-3 flex-1">
        {navLinks.map((nav) => {
          const Icon = nav.icon;
          const active = isActive(nav.href, nav.exact);

          return (
            <Link
              key={nav.label}
              href={nav.href}
              className={`
                flex items-center gap-2.5
                 rounded-md
                px-3 py-2 text-[14px] no-underline
                transition-colors duration-100
                ${
                  active
                    ? "bg-[var(--color-surface-3)] text-[var(--color-ink)] font-[500]"
                    : "text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink-muted)] font-normal"
                }
              `}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2 : 1.5}
                className={
                  active
                    ? "text-[var(--color-ink-muted)] shrink-0"
                    : "text-[var(--color-ink-tertiary)] shrink-0"
                }
              />
              {nav.label}
            </Link>
          );
        })}
      </nav>

      {/* ── User section ───────────────────── */}
      <div
        className="
        px-3 py-4
        border-t border-[var(--color-hairline)]
      "
      >
        <UserButton
          // afterSignOutUrl="/"
          showName={true}
          appearance={{
            elements: {
              avatarBox: "w-[26px] h-[26px] ml-auto rounded-full shrink-0",
              userButtonBox: "flex-row gap-2.5 w-full",
              userButtonTrigger:
                "flex items-center gap-2.5 w-full px-3 py-[7px] rounded-md hover:bg-[var(--color-surface-2)] transition-colors",
              userButtonOuterIdentifier:
                "text-[13px] font-medium text-[var(--color-ink-muted)] truncate",
            },
          }}
        />
      </div>
    </aside>
  );
}
