import TopNav from "@/components/top-nav";
import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <main>{children}</main>
    </>
  );
}
