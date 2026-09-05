import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Map, ListChecks } from "lucide-react";
import { generateRoadmap } from "@/lib/ai.functions";
import { usePhases, useTasks } from "@/hooks/useProject";
import { ProjectTabs } from "@/components/ProjectTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/projects/$id/roadmap")({
  head: () => ({
    meta: [
      { title: "Project Roadmap — ProjectMentor AI" },
      { name: "description", content: "A phase-by-phase roadmap sized to your team and timeline." },
      { property: "og:title", content: "Project Roadmap — ProjectMentor AI" },
      { property: "og:description", content: "A phase-by-phase roadmap sized to your team and timeline." },
    ],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { id } = Route.useParams();
  const { data: phases = [] } = usePhases(id);
  const { data: tasks = [] } = useTasks(id);
  const run = useServerFn(generateRoadmap);
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    setLoading(true);
    setError("");
    try {
      await run({ data: { projectId: id } });
      await qc.invalidateQueries();
      toast.success("Roadmap generated.");
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">AI Roadmap</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Phases and tasks generated from your project, features and available time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={go} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Map className="size-4" aria-hidden />
            )}
            {phases.length ? "Regenerate roadmap" : "Generate roadmap"}
          </Button>
          {!!tasks.length && (
            <Button asChild variant="secondary" className="gap-2">
              <Link to={"/projects/$id/tasks" as never} params={{ id } as never}>
                <ListChecks className="size-4" aria-hidden /> Open tasks
              </Link>
            </Button>
          )}
        </div>
      </header>

      <ProjectTabs id={id} />

      {error && (
        <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}{" "}
          <button className="underline" onClick={go}>
            Retry
          </button>
        </div>
      )}
      {loading && (
        <p className="text-sm text-muted-foreground">Planning your phases and tasks…</p>
      )}

      <ol className="space-y-4">
        {phases.map((phase, i) => {
          const phaseTasks = tasks.filter((t) => t.phase_id === phase.id);
          const done = phaseTasks.filter((t) => t.status === "completed").length;
          const pct = phaseTasks.length ? Math.round((done / phaseTasks.length) * 100) : 0;
          return (
            <li key={phase.id} className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 text-lg font-semibold">
                  <span className="grid size-7 place-items-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                    {i + 1}
                  </span>
                  {phase.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {done}/{phaseTasks.length} tasks
                </span>
              </div>
              <Progress value={pct} className="mt-3" />
              {phase.description && (
                <p className="mt-3 text-sm text-muted-foreground">{phase.description}</p>
              )}
              <ul className="mt-4 space-y-2">
                {phaseTasks.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-lg border border-border bg-surface-2 p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={t.status === "completed" ? "line-through opacity-70" : ""}
                      >
                        {t.title}
                      </span>
                      <Badge variant="outline">{t.priority}</Badge>
                      {t.effort && <Badge variant="secondary">{t.effort}</Badge>}
                      <Badge variant={t.status === "completed" ? "default" : "outline"}>
                        {t.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {t.description && (
                      <p className="mt-1 text-muted-foreground">{t.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      {!phases.length && !loading && (
        <p className="text-sm text-muted-foreground">
          No roadmap yet. Generate one after accepting your features.
        </p>
      )}
    </div>
  );
}
