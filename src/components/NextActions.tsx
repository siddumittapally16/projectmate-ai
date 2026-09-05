/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Flame, Loader2, Code2, RefreshCw } from "lucide-react";
import { nextActions } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Action = {
  task: string;
  priority: string;
  reason: string;
  estimated_effort: string;
  expected_outcome: string;
  dependencies?: string[];
};

export function NextActions({ projectId }: { projectId: string }) {
  const run = useServerFn(nextActions);
  const [actions, setActions] = useState<Action[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await run({ data: { projectId } });
      setActions(res.actions ?? []);
    } catch (e) {
      setError(
        (e as Error).message || "AI service is temporarily unavailable. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="surface-card glow-ring p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Flame className="size-5 text-warning" aria-hidden /> What Should I Do Next?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The AI reads your live project state and returns three prioritized actions.
          </p>
        </div>
        <Button onClick={go} disabled={loading} size="lg" className="gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : actions ? (
            <RefreshCw className="size-4" aria-hidden />
          ) : (
            <Flame className="size-4" aria-hidden />
          )}
          {actions ? "Re-analyze" : "Show my next 3 actions"}
        </Button>
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}{" "}
          <button className="underline" onClick={go}>
            Retry
          </button>
        </div>
      )}

      {actions && (
        <ol className="mt-5 space-y-3">
          {actions.map((a, i) => (
            <li key={i} className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{i + 1}.</span>
                <h3 className="font-semibold">{a.task}</h3>
                <Badge
                  variant={a.priority?.toUpperCase() === "HIGH" ? "destructive" : "secondary"}
                >
                  {a.priority}
                </Badge>
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Reason</dt>
                  <dd>{a.reason}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Expected outcome</dt>
                  <dd>{a.expected_outcome}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Estimated effort</dt>
                  <dd>{a.estimated_effort}</dd>
                </div>
                {!!a.dependencies?.length && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Dependencies</dt>
                    <dd>{a.dependencies.join(", ")}</dd>
                  </div>
                )}
              </dl>
              <Button asChild size="sm" variant="secondary" className="mt-3 gap-2">
                <Link
                  to={"/projects/$id/code" as never}
                  params={{ id: projectId } as never}
                  search={{ task: a.task } as never}
                >
                  <Code2 className="size-4" aria-hidden /> Build This With AI
                </Link>
              </Button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
