import IntelliVaultLogo from "@/components/logo";

export default function Wordmark({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = { sm: "text-[13px]", md: "text-[15px]", lg: "text-[20px]" };
  const logoSize = { sm: 16, md: 20, lg: 28 };
  return (
    <div className="flex items-center gap-2">
      <IntelliVaultLogo size={logoSize[size]} />
      <span
        className={`${sizeMap[size]} font-semibold text-[#f7f8f8] tracking-[-0.3px]`}
      >
        IntelliVault
      </span>
    </div>
  );
}
