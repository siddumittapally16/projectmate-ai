/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Layers, Wrench } from "lucide-react";
import { generateStack } from "@/lib/ai.functions";
import { useProject } from "@/hooks/useProject";
import { ProjectTabs } from "@/components/ProjectTabs";
import { ScoreGrid } from "@/components/ScoreGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/projects/$id/")({
  head: () => ({
    meta: [
      { title: "Project Overview — ProjectMentor AI" },
      { name: "description", content: "Your project's evaluation, scores and recommended technology stack." },
      { property: "og:title", content: "Project Overview — ProjectMentor AI" },
      { property: "og:description", content: "Your project's evaluation, scores and recommended technology stack." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { id } = Route.useParams();
  const { data: project, isLoading } = useProject(id);
  const runStack = useServerFn(generateStack);
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildStack = async () => {
    setLoading(true);
    setError("");
    try {
      await runStack({ data: { projectId: id } });
      await qc.invalidateQueries({ queryKey: ["project", id] });
      toast.success("Technology stack ready.");
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!project) return <p className="text-sm text-muted-foreground">Project not found.</p>;

  const evaluation = project.evaluation as any;
  const stack = project.tech_stack as any;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{project.domain}</Badge>
          <Badge variant="outline">{project.difficulty}</Badge>
          <Badge variant="outline">{project.duration}</Badge>
          {project.is_active && <Badge>Active project</Badge>}
        </div>
      </header>

      <ProjectTabs id={id} />

      <section className="surface-card p-6">
        <h2 className="text-lg font-semibold">Problem &amp; Solution</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Problem: </span>
          {project.problem_statement}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Solution: </span>
          {project.solution}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.technologies ?? []).map((t: string) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </section>

      {evaluation && (
        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">AI Project Evaluation</h2>
          <div className="mt-4">
            <ScoreGrid scores={evaluation.scores ?? {}} />
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Why This Project Fits You</h3>
              <p className="mt-1 text-sm text-muted-foreground">{evaluation.why_it_fits}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Strengths", evaluation.strengths],
                ["Risks", evaluation.risks],
                ["Improvements", evaluation.improvements],
              ].map(([label, items]: any) => (
                <div key={label}>
                  <h3 className="text-sm font-semibold">{label}</h3>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    {(items ?? []).map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Layers className="size-5 text-primary" aria-hidden /> AI Technology Stack
          </h2>
          <Button onClick={buildStack} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Wrench className="size-4" aria-hidden />
            )}
            {stack ? "Regenerate stack" : "Generate stack"}
          </Button>
        </div>
        {error && (
          <div role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}{" "}
            <button className="underline" onClick={buildStack}>
              Retry
            </button>
          </div>
        )}
        {stack?.summary && <p className="mt-3 text-sm text-muted-foreground">{stack.summary}</p>}
        {stack?.categories && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {stack.categories.map((c: any, i: number) => (
              <div key={i} className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="text-xs uppercase text-muted-foreground">{c.category}</p>
                <p className="mt-1 font-semibold">{c.choice}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Why? </span>
                  {c.why}
                </p>
              </div>
            ))}
          </div>
        )}
        {!stack && !loading && (
          <p className="mt-3 text-sm text-muted-foreground">
            No stack yet — generate one tuned to your skills and timeline.
          </p>
        )}
      </section>
    </div>
  );
}
