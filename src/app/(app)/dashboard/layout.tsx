import DashboardNav from "@/components/dashboard/dashboard-nav";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-dvh bg-[var(--color-canvas)]">
      <DashboardNav />
      <div className="pt-14">{children}</div>
    </div>
  );
}
