"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronLeft,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  workspaceId: string;
  workspaceName: string;
}

export default function Sidebar({ workspaceId, workspaceName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
        sticky top-0
        flex h-dvh w-[240px] shrink-0 flex-col
        overflow-hidden
        border-r border-[var(--color-hairline)]
        bg-[var(--color-surface-1)]
      "
    >
      {/* Workspace header */}
      <div
        className="
          flex h-14 shrink-0
          items-center
          border-b border-[var(--color-hairline)]
          px-3
        "
      >
        <button
          type="button"
          className="
            group flex min-w-0 flex-1
            cursor-pointer items-center gap-2.5
            rounded-md px-2 py-1.5
            text-left
            transition-colors duration-150
            hover:bg-[var(--color-surface-2)]
          "
        >
          <button type="button" onClick={() => router.push("/dashboard")}>
            <ChevronLeft
              size={14}
              strokeWidth={1.7}
              className="
              shrink-0
              text-[var(--color-ink-tertiary)]
              transition-colors
              group-hover:text-[var(--color-ink-subtle)]
              "
            />
          </button>
          <div
            className="
              flex h-[24px] w-[24px] shrink-0
              items-center justify-center
              rounded-md
              border border-[var(--color-hairline-strong)]
              bg-[var(--color-surface-3)]
            "
          >
            <span
              className="
                text-[11px] font-semibold leading-none
                text-[var(--color-primary)]
              "
            >
              {workspaceName?.[0]?.toUpperCase() ?? "W"}
            </span>
          </div>

          <span
            className="
              min-w-0 flex-1 truncate
              text-[14px] font-semibold
              tracking-[-0.1px]
              text-[var(--color-ink)]
            "
          >
            {workspaceName}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex min-h-0 flex-1 flex-col px-2 py-3">
        <p
          className="
            mb-1.5 px-3
            text-[10px] font-medium
            uppercase tracking-[0.08em]
            text-[var(--color-ink-tertiary)]
          "
        >
          Workspace
        </p>

        <div className="flex flex-col gap-[2px]">
          {navLinks.map((nav) => {
            const Icon = nav.icon;
            const active = isActive(nav.href, nav.exact);

            return (
              <Link
                key={nav.label}
                href={nav.href}
                className={cn(
                  `
                    flex items-center gap-2.5
                    rounded-md
                    px-3 py-2
                    text-[14px]
                    no-underline
                    transition-colors duration-100
                  `,
                  active
                    ? `
                      bg-[var(--color-surface-3)]
                      font-medium
                      text-[var(--color-ink)]
                    `
                    : `
                      font-normal
                      text-[var(--color-ink-subtle)]
                      hover:bg-[var(--color-surface-2)]
                      hover:text-[var(--color-ink-muted)]
                    `
                )}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2 : 1.5}
                  className={cn(
                    "shrink-0 transition-colors duration-100",
                    active
                      ? "text-[var(--color-ink-muted)]"
                      : `
                        text-[var(--color-ink-tertiary)]
                        group-hover:text-[var(--color-ink-subtle)]
                      `
                  )}
                />

                <span className="truncate">{nav.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div
        className="
          shrink-0
          border-t border-[var(--color-hairline)]
          p-2
        "
      >
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
