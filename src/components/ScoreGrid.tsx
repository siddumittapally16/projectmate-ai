import { Progress } from "@/components/ui/progress";
import type { Scores } from "@/lib/health";

const LABELS: Record<string, string> = {
  skill_match: "Skill Match",
  feasibility: "Feasibility",
  innovation: "Innovation",
  career_relevance: "Career Relevance",
  time_feasibility: "Time Feasibility",
  complexity: "Complexity",
  technical_quality: "Technical Quality",
  progress: "Progress",
  overall: "Overall Score",
};

export function ScoreGrid({ scores }: { scores: Scores | Record<string, number> }) {
  const entries = Object.entries(scores).filter(([, v]) => typeof v === "number");
  if (!entries.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{LABELS[key] ?? key}</span>
            <span className="font-mono font-medium">{value}</span>
          </div>
          <Progress value={value as number} className="mt-1.5" />
        </div>
      ))}
    </div>
  );
}
