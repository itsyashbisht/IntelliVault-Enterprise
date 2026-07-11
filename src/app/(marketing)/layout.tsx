import TopNav from "@/components/top-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[var(--color-canvas)]">
      <TopNav />
      <div className="pt-14">{children}</div>
    </div>
  )
}