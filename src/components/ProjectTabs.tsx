import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const TABS = [
  { seg: "", label: "Overview" },
  { seg: "features", label: "Features" },
  { seg: "roadmap", label: "Roadmap" },
  { seg: "tasks", label: "Tasks" },
  { seg: "code", label: "AI Code Builder" },
  { seg: "mentor", label: "AI Mentor" },
  { seg: "health", label: "Health" },
];

export function ProjectTabs({ id }: { id: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-2" aria-label="Project sections">
      {TABS.map((t) => {
        const to = `/projects/${id}${t.seg ? `/${t.seg}` : ""}`;
        const active = pathname.replace(/\/$/, "") === to;
        return (
          <Link
            key={t.label}
            to={to as never}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
