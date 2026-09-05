/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Activity } from "lucide-react";
import { healthReport } from "@/lib/ai.functions";
import { useProject, useTasks } from "@/hooks/useProject";
import { computeHealth, healthLabel, WEIGHTS } from "@/lib/health";
import { ProjectTabs } from "@/components/ProjectTabs";
import { NextActions } from "@/components/NextActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/projects/$id/health")({
  head: () => ({
    meta: [
      { title: "Project Health — ProjectMentor AI" },
      { name: "description", content: "A live health score with real risks detected from your project data." },
      { property: "og:title", content: "Project Health — ProjectMentor AI" },
      { property: "og:description", content: "A live health score with real risks detected from your project data." },
    ],
  }),
  component: Health,
});

function Health() {
  const { id } = Route.useParams();
  const { data: project } = useProject(id);
  const { data: tasks = [] } = useTasks(id);
  const run = useServerFn(healthReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<any>(null);

  const { score, components } = computeHealth((project?.evaluation as any) ?? null, tasks);

  const analyse = async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await run({ data: { projectId: id, score } }));
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Project Health</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Recalculated from your evaluation scores and real task progress.
        </p>
      </header>

      <ProjectTabs id={id} />

      <section className="surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Overall health</p>
            <p className="text-5xl font-semibold text-primary">{score}</p>
            <Badge className="mt-2">{healthLabel(score)}</Badge>
          </div>
          <Button onClick={analyse} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Activity className="size-4" aria-hidden />
            )}
            Analyse risks with AI
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.keys(WEIGHTS).map((key) => (
            <div key={key}>
              <div className="flex justify-between text-sm">
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-mono text-muted-foreground">
                  {Math.round(components[key as keyof typeof components] ?? 0)}
                </span>
              </div>
              <Progress
                value={components[key as keyof typeof components] ?? 0}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}{" "}
          <button className="underline" onClick={analyse}>
            Retry
          </button>
        </div>
      )}

      {report && (
        <section className="surface-card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Detected risks</h2>
          {(report.risks ?? []).map((r: any, i: number) => (
            <div key={i} className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{r.title}</h3>
                <Badge variant={r.severity === "High" ? "destructive" : "outline"}>
                  {r.severity}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Mitigation: </span>
                {r.mitigation}
              </p>
            </div>
          ))}
          {report.recommendation && (
            <p className="text-sm">
              <span className="font-medium">Recommendation: </span>
              {report.recommendation}
            </p>
          )}
        </section>
      )}

      <NextActions projectId={id} />
    </div>
  );
}
