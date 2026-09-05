import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Code2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTasks, useProject } from "@/hooks/useProject";
import { ProjectTabs } from "@/components/ProjectTabs";
import { NextActions } from "@/components/NextActions";
import { progressFromTasks } from "@/lib/health";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/projects/$id/tasks")({
  head: () => ({
    meta: [
      { title: "Task Workspace — ProjectMentor AI" },
      { name: "description", content: "Kanban board where progress, health and AI advice update as you work." },
      { property: "og:title", content: "Task Workspace — ProjectMentor AI" },
      { property: "og:description", content: "Kanban board where progress, health and AI advice update as you work." },
    ],
  }),
  component: Tasks,
});

const COLUMNS = [
  { key: "todo", label: "TO DO" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "completed", label: "COMPLETED" },
];

function Tasks() {
  const { id } = Route.useParams();
  const { data: tasks = [] } = useTasks(id);
  const { data: project } = useProject(id);
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [due, setDue] = useState("");

  const refresh = () => qc.invalidateQueries();

  const addTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("tasks").insert({
      user_id: userData.user!.id,
      project_id: id,
      title: title.trim(),
      priority,
      due_date: due || null,
      status: "todo",
      order_index: tasks.length,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setTitle("");
    setDue("");
    refresh();
  };

  const move = async (taskId: string, status: string) => {
    await supabase.from("tasks").update({ status }).eq("id", taskId);
    refresh();
    if (status === "completed") toast.success("Task completed — progress and health updated.");
  };

  const remove = async (taskId: string) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    refresh();
  };

  const rename = async (taskId: string, next: string) => {
    if (!next.trim()) return;
    await supabase.from("tasks").update({ title: next.trim() }).eq("id", taskId);
    refresh();
  };

  const progress = progressFromTasks(tasks);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Task Workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {project?.title} · {tasks.filter((t) => t.status === "completed").length} of {tasks.length}{" "}
          tasks completed
        </p>
        <Progress value={progress} className="mt-3 max-w-md" />
      </header>

      <ProjectTabs id={id} />

      <form onSubmit={addTask} className="surface-card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-[240px] flex-1 space-y-2">
          <Label htmlFor="task-title">New task</Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Create crop image upload API"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="task-priority" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["High", "Medium", "Low"].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due">Due date</Label>
          <Input id="task-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <Button type="submit" className="gap-2">
          <Plus className="size-4" aria-hidden /> Add task
        </Button>
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col, colIndex) => {
          const items = tasks.filter((t) => t.status === col.key);
          return (
            <section key={col.key} className="surface-card p-4">
              <h2 className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {col.label}
                <span className="font-mono">{items.length}</span>
              </h2>
              <ul className="space-y-3">
                {items.map((t) => (
                  <li key={t.id} className="rounded-lg border border-border bg-surface-2 p-3">
                    <input
                      className="w-full bg-transparent text-sm font-medium focus:outline-none"
                      defaultValue={t.title}
                      aria-label={`Task title: ${t.title}`}
                      onBlur={(e) => {
                        if (e.target.value !== t.title) rename(t.id, e.target.value);
                      }}
                    />
                    {t.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                      <Badge variant="outline">{t.priority}</Badge>
                      {t.effort && <Badge variant="secondary">{t.effort}</Badge>}
                      {t.due_date && <Badge variant="outline">Due {t.due_date}</Badge>}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      {colIndex > 0 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move left"
                          onClick={() => move(t.id, COLUMNS[colIndex - 1]!.key)}
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                      )}
                      {colIndex < COLUMNS.length - 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move right"
                          onClick={() => move(t.id, COLUMNS[colIndex + 1]!.key)}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      )}
                      <Button asChild size="sm" variant="secondary" className="gap-1">
                        <Link
                          to={"/projects/$id/code" as never}
                          params={{ id } as never}
                          search={{ task: t.title } as never}
                        >
                          <Code2 className="size-3.5" aria-hidden /> Build With AI
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete task ${t.title}`}
                        onClick={() => remove(t.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))}
                {!items.length && (
                  <li className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Nothing here yet
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>

      <NextActions projectId={id} />
    </div>
  );
}
