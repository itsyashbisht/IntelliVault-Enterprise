import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
}: StatusCardProps) {
  return (
    <div
      key={label}
      className="bg-[#0f1011] border border-[#23252a] rounded-[10px] p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-widest text-[#62666d] font-medium">
          {label}
        </span>
        <Icon size={13} className="text-[#62666d]" />
      </div>
      <span className="text-[28px] font-semibold text-[#f7f8f8] tracking-[-0.5px]">
        {value}
      </span>
    </div>
  );
}
