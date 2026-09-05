export type Scores = {
  skill_match?: number;
  feasibility?: number;
  innovation?: number;
  career_relevance?: number;
  time_feasibility?: number;
  complexity?: number;
  overall?: number;
};

export type Evaluation = {
  scores?: Scores;
  why_it_fits?: string;
  strengths?: string[];
  risks?: string[];
  improvements?: string[];
};

export const WEIGHTS = {
  skill_match: 0.2,
  feasibility: 0.15,
  innovation: 0.15,
  career_relevance: 0.15,
  technical_quality: 0.1,
  progress: 0.15,
  time_feasibility: 0.1,
};

export function progressFromTasks(tasks: { status: string }[]) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
}

export function computeHealth(evaluation: Evaluation | null, tasks: { status: string }[]) {
  const s = evaluation?.scores ?? {};
  const progress = progressFromTasks(tasks);
  const technicalQuality = Math.max(0, 100 - (s.complexity ?? 50));
  const components = {
    skill_match: s.skill_match ?? 60,
    feasibility: s.feasibility ?? 60,
    innovation: s.innovation ?? 60,
    career_relevance: s.career_relevance ?? 60,
    technical_quality: technicalQuality,
    progress,
    time_feasibility: s.time_feasibility ?? 60,
  };
  const score = Math.round(
    Object.entries(WEIGHTS).reduce(
      (sum, [key, weight]) => sum + weight * (components[key as keyof typeof components] ?? 0),
      0,
    ),
  );
  return { score: Math.min(100, Math.max(0, score)), components, progress };
}

export function healthLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Healthy";
  if (score >= 40) return "At risk";
  return "Critical";
}
