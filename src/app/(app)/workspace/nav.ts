import {
  BarChart2,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact: boolean;
};

export const primaryNav: WorkspaceNavItem[] = [
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

export const secondaryNav: WorkspaceNavItem[] = [
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

export const allNavLinks = [...primaryNav, ...secondaryNav];

export function getNavHref(href: string, workspaceId: string) {
  return href.replace(":workspaceId", workspaceId);
}

export function isNavActive(pathname: string, href: string, exact = false) {
  return exact ? pathname === href : pathname.startsWith(href);
}
