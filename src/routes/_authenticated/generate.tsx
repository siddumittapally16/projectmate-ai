/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { generateIdeas } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { ScoreGrid } from "@/components/ScoreGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/generate")({
  head: () => ({
    meta: [
      { title: "Find a Project That Fits You — ProjectMentor AI" },
      { name: "description", content: "Get project ideas based on your skills, interests, career goals and constraints." },
      { property: "og:title", content: "AI Project Generator — ProjectMentor AI" },
      { property: "og:description", content: "Get project ideas based on your skills, interests, career goals and constraints." },
    ],
  }),
  component: Generate,
});

function Generate() {
  const run = useServerFn(generateIdeas);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ideas, setIdeas] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const go = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await run({});
      setIdeas(res.ideas);
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const select = async (idea: any, index: number) => {
    setSelecting(index);
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from("projects").update({ is_active: false }).eq("is_active", true);
    const { data, error: insertError } = await supabase
      .from("projects")
      .insert({
        user_id: userData.user!.id,
        title: idea.title,
        problem_statement: idea.problem_statement ?? "",
        solution: idea.solution ?? "",
        domain: idea.domain ?? "",
        difficulty: idea.difficulty ?? "",
        duration: idea.duration ?? "",
        technologies: idea.technologies ?? [],
        evaluation: idea.evaluation ?? null,
        is_active: true,
      })
      .select()
      .single();
    setSelecting(null);
    if (insertError) {
      toast.error(insertError.message);
      return;
    }
    await qc.invalidateQueries();
    toast.success("Project selected. It's now your active project.");
    navigate({ to: "/projects/$id" as never, params: { id: data.id } as never });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Find a Project That Fits YOU</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Get project ideas based on your skills, interests, career goals and constraints.
        </p>
        <Button onClick={go} disabled={loading} size="lg" className="mt-5 gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="size-4" aria-hidden />
          )}
          {ideas ? "Regenerate My Projects" : "Generate My Projects"}
        </Button>
      </header>

      {error && (
        <div role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}{" "}
          <button className="underline" onClick={go}>
            Retry
          </button>
        </div>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">
          Analyzing your profile and drafting five tailored ideas…
        </p>
      )}

      <div className="grid gap-4">
        {ideas?.map((idea, i) => (
          <article key={i} className="surface-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{idea.title}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{idea.domain}</Badge>
                  <Badge variant="outline">{idea.difficulty}</Badge>
                  <Badge variant="outline">{idea.duration}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-muted-foreground">Overall</p>
                <p className="text-3xl font-semibold text-primary">
                  {idea.evaluation?.scores?.overall ?? "—"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Problem: </span>
              {idea.problem_statement}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Solution: </span>
              {idea.solution}
            </p>

            {open === i && (
              <div className="mt-5 space-y-5 border-t border-border pt-5">
                <ScoreGrid scores={idea.evaluation?.scores ?? {}} />
                <div>
                  <h3 className="text-sm font-semibold">Why This Project Fits You</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {idea.evaluation?.why_it_fits}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Strengths", idea.evaluation?.strengths],
                    ["Risks", idea.evaluation?.risks],
                    ["Suggested improvements", idea.evaluation?.improvements],
                  ].map(([label, items]: any) => (
                    <div key={label}>
                      <h3 className="text-sm font-semibold">{label}</h3>
                      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {(items ?? []).map((s: string, k: number) => (
                          <li key={k}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Technologies</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(idea.technologies ?? []).map((t: string) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                {idea.expected_impact && (
                  <div>
                    <h3 className="text-sm font-semibold">Expected impact</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{idea.expected_impact}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(open === i ? null : i)}>
                {open === i ? "Hide details" : "View details"}
              </Button>
              <Button size="sm" className="gap-2" disabled={selecting === i} onClick={() => select(idea, i)}>
                {selecting === i ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <CheckCircle2 className="size-4" aria-hidden />
                )}
                Select This Project
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
