import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Brain,
  Code2,
  Activity,
  Map,
  ListChecks,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProjectMentor AI — Build the right final-year project" },
      {
        name: "description",
        content:
          "Discover, evaluate, plan, build and improve your final-year project with personalized AI guidance.",
      },
      { property: "og:title", content: "ProjectMentor AI" },
      {
        property: "og:description",
        content:
          "Discover, evaluate, plan, build and improve your final-year project with personalized AI guidance.",
      },
    ],
  }),
  component: Landing,
});

const problems = [
  "Choosing a project",
  "Checking feasibility",
  "Selecting technologies",
  "Creating a roadmap",
  "Getting technical guidance",
  "Writing code",
  "Debugging",
  "Staying on schedule",
];

const steps = [
  "Create Account",
  "Tell Us About Yourself",
  "Get Personalized Ideas",
  "Choose the Right Project",
  "Get AI Roadmap",
  "Build With AI",
  "AI Mentor",
  "What Should I Do Next?",
  "Project Health",
];

const features = [
  {
    icon: Sparkles,
    title: "Personalized project ideas",
    body: "Five ideas generated from your skills, interests, goals, team and time budget — with an honest evaluation of each.",
  },
  {
    icon: Map,
    title: "AI roadmap & features",
    body: "MVP features, a justified technology stack and a phase-by-phase roadmap sized to your available weeks.",
  },
  {
    icon: ListChecks,
    title: "Real task workspace",
    body: "A kanban board where progress, health and AI advice all recalculate as you complete work.",
  },
  {
    icon: Code2,
    title: "AI Code Builder",
    body: "Generate, explain, debug, improve, test and security-check code with your project's context attached.",
  },
  {
    icon: Brain,
    title: "AI Project Mentor",
    body: "A mentor that already knows your project, stack, roadmap and progress — not a blank chatbot.",
  },
  {
    icon: Activity,
    title: "Project health & risks",
    body: "A live 0–100 health model that surfaces real risks like testing not started or a phase falling behind.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
              PM
            </span>
            <span className="font-display font-semibold">ProjectMentor AI</span>
          </div>
          <nav className="flex items-center gap-2" aria-label="Primary">
            <a
              href="#how-it-works"
              className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block"
            >
              How It Works
            </a>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center lg:py-28">
          <p className="mx-auto mb-6 w-fit rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Don't just find a project idea. Build the right project.
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Turn Your Final-Year Project Into Something You Can Be{" "}
            <span className="text-gradient">Proud Of.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            ProjectMentor AI helps you discover, plan, build and improve your final-year project
            with personalized AI guidance.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/signup">
                <Rocket className="size-4" aria-hidden /> Start Building
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="surface-card p-7">
            <h2 className="text-xl font-semibold">The Problem</h2>
            <p className="mt-2 text-sm text-muted-foreground">Students struggle with:</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {problems.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <span className="size-1.5 rounded-full bg-destructive" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-7">
            <h2 className="text-xl font-semibold">The Solution</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ProjectMentor AI combines project discovery, planning, development assistance and AI
              mentorship into one workspace. The AI reads your real project state — features, stack,
              roadmap, tasks and progress — and tells you exactly what to do next.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center text-2xl font-semibold">Everything you need, end to end</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="surface-card p-6">
                <Icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24">
        <h2 className="text-center text-2xl font-semibold">How It Works</h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="surface-card flex items-center gap-3 p-4 text-sm">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/signup">
              Start Building <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        ProjectMentor AI — an AI-powered project lifecycle mentor for final-year students.
      </footer>
    </div>
  );
}
