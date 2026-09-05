import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Check, X } from "lucide-react";
import { generateFeatures } from "@/lib/ai.functions";
import { useFeatures } from "@/hooks/useProject";
import { supabase } from "@/integrations/supabase/client";
import { ProjectTabs } from "@/components/ProjectTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/projects/$id/features")({
  head: () => ({
    meta: [
      { title: "Project Features — ProjectMentor AI" },
      { name: "description", content: "AI-suggested MVP and advanced features for your project." },
      { property: "og:title", content: "Project Features — ProjectMentor AI" },
      { property: "og:description", content: "AI-suggested MVP and advanced features for your project." },
    ],
  }),
  component: Features,
});

function Features() {
  const { id } = Route.useParams();
  const { data: features = [], isLoading } = useFeatures(id);
  const run = useServerFn(generateFeatures);
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    setLoading(true);
    setError("");
    try {
      await run({ data: { projectId: id } });
      await qc.invalidateQueries({ queryKey: ["features", id] });
      toast.success("Features generated.");
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setAccepted = async (featureId: string, accepted: boolean) => {
    await supabase.from("project_features").update({ accepted }).eq("id", featureId);
    await qc.invalidateQueries({ queryKey: ["features", id] });
  };

  const groups = [
    { tier: "mvp", label: "MVP Features" },
    { tier: "advanced", label: "Advanced Features" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">AI Feature Generator</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accept the features you'll actually build — the roadmap uses them.
          </p>
        </div>
        <Button onClick={go} disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="size-4" aria-hidden />
          )}
          {features.length ? "Regenerate features" : "Generate features"}
        </Button>
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

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && !features.length && !loading && (
        <p className="text-sm text-muted-foreground">No features yet. Generate them to continue.</p>
      )}

      {groups.map((g) => {
        const items = features.filter((f) => f.tier === g.tier);
        if (!items.length) return null;
        return (
          <section key={g.tier} className="space-y-3">
            <h2 className="text-lg font-semibold">{g.label}</h2>
            <div className="grid gap-3">
              {items.map((f) => (
                <article
                  key={f.id}
                  className={`surface-card p-5 ${f.accepted ? "border-primary/40" : "opacity-80"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{f.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={f.accepted ? "default" : "outline"}
                        className="gap-1"
                        onClick={() => setAccepted(f.id, true)}
                      >
                        <Check className="size-4" aria-hidden /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant={f.accepted ? "outline" : "secondary"}
                        className="gap-1"
                        onClick={() => setAccepted(f.id, false)}
                      >
                        <X className="size-4" aria-hidden /> Reject
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">Priority: {f.priority}</Badge>
                    <Badge variant="outline">Complexity: {f.complexity}</Badge>
                    {f.effort && <Badge variant="outline">Effort: {f.effort}</Badge>}
                    {!!f.dependencies?.length && (
                      <Badge variant="outline">Depends on: {f.dependencies.join(", ")}</Badge>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
