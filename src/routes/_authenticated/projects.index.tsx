import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects/")({
  head: () => ({
    meta: [
      { title: "My Projects — ProjectMentor AI" },
      { name: "description", content: "All the final-year projects you have selected and saved." },
      { property: "og:title", content: "My Projects — ProjectMentor AI" },
      { property: "og:description", content: "All the final-year projects you have selected and saved." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const makeActive = async (id: string) => {
    await supabase.from("projects").update({ is_active: false }).neq("id", id);
    await supabase.from("projects").update({ is_active: true }).eq("id", id);
    await qc.invalidateQueries();
    toast.success("Active project updated.");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">My Projects</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your selected projects. Only one can be active at a time.
        </p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && !projects.length && (
        <div className="surface-card p-8 text-center">
          <p className="text-sm text-muted-foreground">You haven't selected a project yet.</p>
          <Button asChild className="mt-4">
            <Link to="/generate">Generate ideas</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((p) => (
          <article key={p.id} className="surface-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{p.domain}</Badge>
                  <Badge variant="outline">{p.difficulty}</Badge>
                  {p.is_active && <Badge>Active</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                {!p.is_active && (
                  <Button variant="outline" size="sm" onClick={() => makeActive(p.id)}>
                    Make active
                  </Button>
                )}
                <Button asChild size="sm">
                  <Link to={"/projects/$id" as never} params={{ id: p.id } as never}>
                    Open
                  </Link>
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.problem_statement}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
