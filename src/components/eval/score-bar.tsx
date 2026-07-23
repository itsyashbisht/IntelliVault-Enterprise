/*
  Score → color mapping (shared across all eval components):
  >= 0.8 → green  (good)
  >= 0.6 → yellow (needs attention)
  <  0.6 → red    (failing)
*/
export function scoreColor(score: number) {
  if (score >= 0.8) return "#27a644";
  if (score >= 0.6) return "#ffb224";
  return "#e54d2e";
}

interface ScoreBarProps {
  label: string;
  score: number; // 0–1
}

export default function ScoreBar({ label, score }: ScoreBarProps) {
  const color = scoreColor(score);
  const percent = Math.round(score * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-[#62666d] font-medium">
          {label}
        </span>
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color }}
        >
          {score.toFixed(2)}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#18191a] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
}
