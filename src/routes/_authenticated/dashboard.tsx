import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Brain, Code2, Activity, ListChecks, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useActiveProject } from "@/components/AppShell";
import { NextActions } from "@/components/NextActions";
import { computeHealth, healthLabel } from "@/lib/health";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ProjectMentor AI" },
      { name: "description", content: "Your project progress, health and next actions in one place." },
      { property: "og:title", content: "Dashboard — ProjectMentor AI" },
      { property: "og:description", content: "Your project progress, health and next actions in one place." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      return data;
    },
  });
  const { data: project, isLoading: projectLoading } = useActiveProject();
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", project?.id],
    enabled: !!project?.id,
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*").eq("project_id", project!.id);
      return data ?? [];
    },
  });

  const health = computeHealth((project?.evaluation as never) ?? null, tasks);
  const completed = tasks.filter((t) => t.status === "completed").length;
  const weeks = profile?.available_weeks ?? 0;
  const created = project?.created_at ? new Date(project.created_at) : null;
  const daysRemaining = created
    ? Math.max(
        0,
        Math.round(weeks * 7 - (Date.now() - created.getTime()) / 86_400_000),
      )
    : weeks * 7;

  if (profileLoading || projectLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (profile && !profile.onboarded) {
    return (
      <div className="surface-card mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Finish your profile first</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The AI needs your skills, interests and constraints before it can personalize anything.
        </p>
        <Button asChild className="mt-6">
          <Link to="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    );
  }

  const cards = [
    { to: "/generate", label: "Generate Projects", icon: Sparkles, desc: "5 ideas built around you" },
    ...(project
      ? [
          { to: `/projects/${project.id}/mentor`, label: "AI Project Mentor", icon: Brain, desc: "Ask anything about your build" },
          { to: `/projects/${project.id}/code`, label: "AI Code Builder", icon: Code2, desc: "Generate, debug and explain code" },
          { to: `/projects/${project.id}/tasks`, label: "Task Workspace", icon: ListChecks, desc: "Kanban board and progress" },
          { to: `/projects/${project.id}/health`, label: "Project Health", icon: Activity, desc: "Score, components and risks" },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">
          {greeting()}, {profile?.full_name || "student"} 👋
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {project ? "Here's where your project stands right now." : "Let's find the right project for you."}
        </p>
      </header>

      {project ? (
        <>
          <section className="surface-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Your Project</p>
                <h2 className="mt-1 text-xl font-semibold">{project.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current phase: {project.current_phase}
                </p>
              </div>
              <Button asChild variant="secondary" className="gap-2">
                <Link to={"/projects/$id" as never} params={{ id: project.id } as never}>
                  Open project <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Progress</p>
                <p className="mt-1 text-2xl font-semibold">{health.progress}%</p>
                <Progress value={health.progress} className="mt-2" />
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Project health</p>
                <p className="mt-1 text-2xl font-semibold">
                  {health.score}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {healthLabel(health.score)}
                  </span>
                </p>
                <Progress value={health.score} className="mt-2" />
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Tasks</p>
                <p className="mt-1 text-2xl font-semibold">
                  {completed}/{tasks.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tasks.length - completed} remaining
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Days remaining</p>
                <p className="mt-1 text-2xl font-semibold">{daysRemaining}</p>
                <p className="text-xs text-muted-foreground">based on {weeks} available weeks</p>
              </div>
            </div>
          </section>

          <NextActions projectId={project.id} />
        </>
      ) : (
        <section className="surface-card p-8 text-center">
          <h2 className="text-xl font-semibold">No active project yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate personalized ideas and pick the one that fits you.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link to="/generate">
              <Sparkles className="size-4" aria-hidden /> Generate My Projects
            </Link>
          </Button>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to as never}
              className="surface-card group p-6 transition-colors hover:border-primary/50"
            >
              <Icon className="size-6 text-primary" aria-hidden />
              <h3 className="mt-4 font-semibold">{c.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
