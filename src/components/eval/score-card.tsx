import ScoreBar from "@/components/eval/score-bar";

export interface AggregateScores {
  avgContextRelevance: number;
  avgFaithfulness: number;
  avgAnswerRelevance: number;
}

interface ScoreCardProps {
  aggregate: AggregateScores;
}

export default function ScoreCard({ aggregate }: ScoreCardProps) {
  const scores = [
    { label: "Context relevance", score: aggregate.avgContextRelevance },
    { label: "Faithfulness", score: aggregate.avgFaithfulness },
    { label: "Answer relevance", score: aggregate.avgAnswerRelevance },
  ];

  return (
    <div className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-5">
      <span className="text-[13px] font-semibold text-[#f7f8f8] tracking-[-0.2px]">
        Workspace averages
      </span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {scores.map(({ label, score }) => (
          <ScoreBar key={label} label={label} score={score} />
        ))}
      </div>
    </div>
  );
}
