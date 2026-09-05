import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type DB = SupabaseClient<any, any, any>;

export async function getProfile(supabase: DB, userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Complete your onboarding profile first.");
  return data;
}

export async function getProjectBundle(supabase: DB, userId: string, projectId: string) {
  const [project, features, phases, tasks] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).eq("user_id", userId).maybeSingle(),
    supabase.from("project_features").select("*").eq("project_id", projectId),
    supabase.from("roadmap_phases").select("*").eq("project_id", projectId).order("order_index"),
    supabase.from("tasks").select("*").eq("project_id", projectId),
  ]);
  if (!project.data) throw new Error("Project not found.");
  return {
    project: project.data,
    features: features.data ?? [],
    phases: phases.data ?? [],
    tasks: tasks.data ?? [],
  };
}

export function profileSummary(p: Record<string, unknown>) {
  return [
    `Name: ${p["full_name"]}`,
    `Degree/Branch: ${p["degree"]} ${p["branch"]}, semester ${p["semester"]}`,
    `Skills: ${(p["skills"] as string[])?.join(", ") || "none listed"}`,
    `Interests: ${(p["interests"] as string[])?.join(", ") || "none listed"}`,
    `Career goal: ${p["career_goal"]}`,
    `Experience level: ${p["experience_level"]}`,
    `Team size: ${p["team_size"]}`,
    `Available weeks: ${p["available_weeks"]}, daily hours: ${p["daily_hours"]}`,
    `Budget: ${p["budget"]}`,
    `Hardware: ${p["hardware"]}`,
  ].join("\n");
}

export function projectSummary(bundle: {
  project: Record<string, any>;
  features: any[];
  phases: any[];
  tasks: any[];
}) {
  const { project, features, phases, tasks } = bundle;
  const done = tasks.filter((t) => t.status === "completed");
  const pending = tasks.filter((t) => t.status !== "completed");
  return [
    `Project: ${project["title"]}`,
    `Problem: ${project["problem_statement"]}`,
    `Solution: ${project["solution"]}`,
    `Domain: ${project["domain"]} | Difficulty: ${project["difficulty"]} | Duration: ${project["duration"]}`,
    `Technologies: ${(project["technologies"] as string[])?.join(", ")}`,
    project["tech_stack"] ? `Tech stack: ${JSON.stringify(project["tech_stack"]).slice(0, 1200)}` : "",
    `Current phase: ${project["current_phase"]}`,
    features.length
      ? `Accepted features: ${features
          .filter((f) => f.accepted)
          .map((f) => f.name)
          .join(", ") || "none accepted yet"}`
      : "No features generated yet.",
    phases.length ? `Roadmap phases: ${phases.map((p) => p.name).join(" -> ")}` : "No roadmap yet.",
    `Progress: ${tasks.length ? Math.round((done.length / tasks.length) * 100) : 0}% (${done.length}/${tasks.length} tasks completed)`,
    `Completed tasks: ${done.map((t) => t.title).join("; ") || "none"}`,
    `Pending tasks: ${pending
      .map((t) => `${t.title} [${t.status}, ${t.priority}${t.dependencies?.length ? ", depends on: " + t.dependencies.join("/") : ""}]`)
      .join("; ") || "none"}`,
    project["deadline"] ? `Deadline: ${project["deadline"]}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
