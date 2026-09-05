import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Map,
  ListChecks,
  Code2,
  Brain,
  Activity,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function useActiveProject() {
  return useQuery({
    queryKey: ["active-project"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: project } = useActiveProject();
  const id = project?.id;

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/generate", label: "Generate", icon: Sparkles },
    { to: "/projects", label: "My Projects", icon: FolderKanban },
    ...(id
      ? [
          { to: `/projects/${id}`, label: "Project", icon: FolderKanban },
          { to: `/projects/${id}/roadmap`, label: "Roadmap", icon: Map },
          { to: `/projects/${id}/tasks`, label: "Tasks", icon: ListChecks },
          { to: `/projects/${id}/code`, label: "AI Code Builder", icon: Code2 },
          { to: `/projects/${id}/mentor`, label: "AI Mentor", icon: Brain },
          { to: `/projects/${id}/health`, label: "Project Health", icon: Activity },
        ]
      : []),
    { to: "/profile", label: "Profile", icon: User },
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" as any });
  };

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {links.map((l) => {
        const Icon = l.icon;
        const active = pathname === l.to;
        return (
          <Link
            key={l.to}
            to={l.to as any}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to={"/dashboard" as any} className="mb-6 flex items-center gap-2 px-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            PM
          </span>
          <span className="font-display text-base font-semibold">ProjectMentor</span>
        </Link>
        {nav}
        <div className="mt-auto pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={signOut}>
            <LogOut className="size-4" aria-hidden /> Logout
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </Button>
        <span className="font-display font-semibold">ProjectMentor AI</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 p-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display font-semibold">Menu</span>
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </Button>
          </div>
          {nav}
          <Button variant="ghost" className="mt-4 w-full justify-start gap-3" onClick={signOut}>
            <LogOut className="size-4" aria-hidden /> Logout
          </Button>
        </div>
      )}

      <main className="px-4 py-6 lg:ml-64 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
