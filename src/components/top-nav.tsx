import { Route } from "next";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopNav({
  onNavigate,
  currentRoute,
}: {
  onNavigate: (r: Route) => void;
  currentRoute: Route;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#010102]/90 backdrop-blur-sm border-b border-[#23252a] flex items-center px-6">
      <button
        onClick={() => onNavigate("/")}
        className="flex items-center gap-2 group"
      >
        <div className="w-6 h-6 rounded-[6px] bg-[#5e6ad2] flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <span className="text-[14px] font-semibold text-[#f7f8f8] tracking-[-0.3px]">
          IntelliVault
        </span>
      </button>

      <nav className="hidden md:flex items-center gap-1 ml-8">
        {["Features", "Pricing", "Docs"].map((item) => (
          <button
            key={item}
            className="px-3 py-1.5 text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors rounded-[6px] hover:bg-[#0f1011]"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="secondary">Sign in</Button>
        <Button variant="default">Get started free</Button>
      </div>
    </header>
  );
}
