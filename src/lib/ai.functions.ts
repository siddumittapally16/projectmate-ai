/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callAIJson, callAI } from "./ai.server";
import { getProfile, getProjectBundle, profileSummary, projectSummary } from "./context.server";

const BASE_RULES =
  "You are ProjectMentor AI, an expert final-year project mentor. Be concrete, realistic and personalised to the student. Never invent fake statistics. Always answer with valid JSON only when asked for JSON.";

/* ---------------- 1. PROJECT IDEAS + EVALUATION ---------------- */
export const generateIdeas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    const profile = await getProfile(supabase, userId);

    const result = await callAIJson<{ ideas: any[] }>({
      system: BASE_RULES,
      user: `Generate EXACTLY 5 final-year project ideas tailored to this student.

STUDENT PROFILE
${profileSummary(profile)}

Return JSON:
{"ideas":[{"title":"","problem_statement":"","solution":"","domain":"","difficulty":"Beginner|Intermediate|Advanced","duration":"e.g. 8 weeks","technologies":["..."],"expected_impact":"","evaluation":{"scores":{"skill_match":0-100,"feasibility":0-100,"innovation":0-100,"career_relevance":0-100,"time_feasibility":0-100,"complexity":0-100,"overall":0-100},"why_it_fits":"","strengths":["..."],"risks":["..."],"improvements":["..."]}}]}

Scores must genuinely reflect THIS student's skills, time, team size, budget and hardware. Vary them; do not give every project the same score.`,
    });

    const ideas = (result.ideas ?? []).slice(0, 5);
    if (!ideas.length) throw new Error("AI service is temporarily unavailable. Please try again.");

    await supabase.from("project_ideas").insert(
      ideas.map((idea) => ({ user_id: userId, payload: idea })),
    );
    return { ideas };
  });

/* ---------------- 2. FEATURES ---------------- */
export const generateFeatures = createServerFn({ method: "POST" })
  .inputValidator((d: { projectId: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const profile = await getProfile(supabase, userId);
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const result = await callAIJson<{ mvp: any[]; advanced: any[] }>({
      system: BASE_RULES,
      user: `Propose features for this project.

STUDENT
${profileSummary(profile)}

PROJECT
${projectSummary(bundle)}

Return JSON:
{"mvp":[{"name":"","description":"","priority":"High|Medium|Low","complexity":"Low|Medium|High","effort":"e.g. 6 hours","dependencies":["..."]}],"advanced":[same shape]}
5-7 MVP features, 3-5 advanced features.`,
    });

    await supabase.from("project_features").delete().eq("project_id", data.projectId);
    const rows = [
      ...(result.mvp ?? []).map((f) => ({ ...f, tier: "mvp" })),
      ...(result.advanced ?? []).map((f) => ({ ...f, tier: "advanced" })),
    ].map((f: any) => ({
      user_id: userId,
      project_id: data.projectId,
      name: f.name,
      description: f.description ?? "",
      priority: f.priority ?? "Medium",
      complexity: f.complexity ?? "Medium",
      effort: f.effort ?? "",
      dependencies: f.dependencies ?? [],
      tier: f.tier,
      accepted: f.tier === "mvp",
    }));
    const { error } = await supabase.from("project_features").insert(rows);
    if (error) throw new Error(error.message);
    return { count: rows.length };
  });

/* ---------------- 3. TECH STACK ---------------- */
export const generateStack = createServerFn({ method: "POST" })
  .inputValidator((d: { projectId: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const profile = await getProfile(supabase, userId);
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const stack = await callAIJson<any>({
      system: BASE_RULES,
      user: `Recommend a technology stack. Prefer technologies the student already knows; avoid unnecessary tools.

STUDENT
${profileSummary(profile)}

PROJECT
${projectSummary(bundle)}

Return JSON:
{"categories":[{"category":"Frontend|Backend|Database|AI/ML|APIs|Authentication|Deployment|Testing","choice":"","why":""}],"summary":""}`,
    });

    const { error } = await supabase
      .from("projects")
      .update({ tech_stack: stack })
      .eq("id", data.projectId);
    if (error) throw new Error(error.message);
    return stack;
  });

/* ---------------- 4. ROADMAP ---------------- */
export const generateRoadmap = createServerFn({ method: "POST" })
  .inputValidator((d: { projectId: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const profile = await getProfile(supabase, userId);
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const result = await callAIJson<{ phases: any[] }>({
      system: BASE_RULES,
      user: `Create a realistic development roadmap sized to the student's available weeks and team.

STUDENT
${profileSummary(profile)}

PROJECT
${projectSummary(bundle)}

Return JSON:
{"phases":[{"name":"","description":"","tasks":[{"title":"","description":"","priority":"High|Medium|Low","effort":"e.g. 4 hours","dependencies":["..."]}]}]}
Use 5-8 phases from: Research, Requirements, Architecture, Database, Backend, AI/ML, Frontend, Integration, Testing, Deployment. Each phase 2-5 tasks.`,
    });

    await supabase.from("tasks").delete().eq("project_id", data.projectId);
    await supabase.from("roadmap_phases").delete().eq("project_id", data.projectId);

    const phases = result.phases ?? [];
    let order = 0;
    for (const phase of phases) {
      const { data: inserted, error } = await supabase
        .from("roadmap_phases")
        .insert({
          user_id: userId,
          project_id: data.projectId,
          name: phase.name,
          description: phase.description ?? "",
          order_index: order,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      const tasks = (phase.tasks ?? []).map((t: any, i: number) => ({
        user_id: userId,
        project_id: data.projectId,
        phase_id: inserted.id,
        title: t.title,
        description: t.description ?? "",
        priority: t.priority ?? "Medium",
        effort: t.effort ?? "",
        dependencies: t.dependencies ?? [],
        status: "todo",
        order_index: order * 100 + i,
      }));
      if (tasks.length) await supabase.from("tasks").insert(tasks);
      order += 1;
    }

    if (phases[0]?.name) {
      await supabase
        .from("projects")
        .update({ current_phase: phases[0].name })
        .eq("id", data.projectId);
    }
    return { phases: phases.length };
  });

/* ---------------- 5. WHAT SHOULD I DO NEXT ---------------- */
export const nextActions = createServerFn({ method: "POST" })
  .inputValidator((d: { projectId: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const result = await callAIJson<{ actions: any[] }>({
      system: BASE_RULES,
      user: `Given the CURRENT state of this project, return EXACTLY 3 prioritized next actions. Respect task dependencies and the current phase. If most tasks in a phase are done, move to the next phase.

PROJECT STATE
${projectSummary(bundle)}

Return JSON:
{"actions":[{"task":"","priority":"HIGH|MEDIUM|LOW","reason":"","estimated_effort":"","expected_outcome":"","dependencies":["..."]}]}`,
    });

    const actions = (result.actions ?? []).slice(0, 3);
    await supabase.from("ai_recommendations").insert({
      user_id: userId,
      project_id: data.projectId,
      kind: "next_actions",
      payload: { actions },
    });
    return { actions };
  });

/* ---------------- 6. PROJECT HEALTH RISKS ---------------- */
export const healthReport = createServerFn({ method: "POST" })
  .inputValidator((d: { projectId: string; score: number }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const result = await callAIJson<{ risks: any[]; recommendation: string }>({
      system: BASE_RULES,
      user: `Analyse this project's real risks. The computed health score is ${data.score}/100.

PROJECT STATE
${projectSummary(bundle)}

Return JSON:
{"risks":[{"title":"","severity":"High|Medium|Low","detail":"","mitigation":""}],"recommendation":""}
Only report risks visible in the data (e.g. phase behind schedule, testing not started, low progress, too many advanced features, dependency blockers).`,
    });

    await supabase.from("ai_recommendations").insert({
      user_id: userId,
      project_id: data.projectId,
      kind: "health",
      payload: result,
    });
    return result;
  });

/* ---------------- 7. AI MENTOR ---------------- */
export const mentorChat = createServerFn({ method: "POST" })
  .inputValidator((d: { projectId: string; message: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const profile = await getProfile(supabase, userId);
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const { data: recent } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("project_id", data.projectId)
      .order("created_at", { ascending: false })
      .limit(8);

    const history = ((recent ?? []) as any[])
      .reverse()
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

    const answer = await callAI({
      system: `${BASE_RULES}
You are this student's personal project mentor. You already know their profile and project state, so never ask them to repeat it. Give practical, step-by-step guidance in markdown-free plain text with short headings and bullet-like lines.

STUDENT
${profileSummary(profile)}

PROJECT STATE
${projectSummary(bundle)}`,
      user: data.message,
      history: history as any,
    });

    await supabase.from("chat_messages").insert([
      { user_id: userId, project_id: data.projectId, role: "user", content: data.message },
      { user_id: userId, project_id: data.projectId, role: "assistant", content: answer },
    ]);
    return { answer };
  });

/* ---------------- 8. AI CODE BUILDER ---------------- */
type CodeInput = {
  projectId: string;
  mode: "generate" | "debug" | "explain" | "improve" | "tests" | "security" | "structure";
  request?: string;
  code?: string;
  errorMessage?: string;
  language?: string;
  framework?: string;
  level?: string;
};

const MODE_PROMPT: Record<CodeInput["mode"], string> = {
  generate: `Generate the code the student asked for.
Return JSON:
{"title":"","steps":[{"step":"STEP 1 - ...","explanation":"","file_path":"","code":"","next_action":""}],"how_it_works":"","where_to_put_it":"","notes":""}
Break complex features into 2-5 steps (database, backend, frontend, wiring, testing). Simple requests may use a single step.`,
  debug: `Debug the student's code.
Return JSON:
{"title":"","problem":"","why_it_happened":"","how_to_fix":"","steps":[{"step":"Corrected code","explanation":"","file_path":"","code":"","next_action":""}],"how_to_test":""}`,
  explain: `Explain the student's code at the requested difficulty level.
Return JSON:
{"title":"","what_it_does":"","walkthrough":["..."],"variables":["..."],"functions":["..."],"data_flow":"","dependencies":["..."],"possible_issues":["..."]}`,
  improve: `Improve the student's code for quality, performance, security, readability, maintainability, error handling and testability.
Return JSON:
{"title":"","before_summary":"","steps":[{"step":"Improved version","explanation":"","file_path":"","code":"","next_action":""}],"what_changed":["..."],"why":["..."]}`,
  tests: `Write tests for what the student provided.
Return JSON:
{"title":"","steps":[{"step":"Tests","explanation":"","file_path":"","code":"","next_action":""}],"how_to_run":""}`,
  security: `Review the code for hardcoded secrets, unsafe input handling, SQL injection, auth/authorization flaws, exposed data and unsafe API usage.
Return JSON:
{"title":"","findings":[{"issue":"","severity":"High|Medium|Low","detail":"","fix":""}],"steps":[{"step":"Hardened code","explanation":"","file_path":"","code":"","next_action":""}],"advisory":"AI security review is advisory - verify manually."}`,
  structure: `Recommend a project folder structure for this student's stack.
Return JSON:
{"title":"","tree":"plain text tree","folders":[{"path":"","purpose":""}],"notes":""}`,
};

export const codeAssist = createServerFn({ method: "POST" })
  .inputValidator((d: CodeInput) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const profile = await getProfile(supabase, userId);
    const bundle = await getProjectBundle(supabase, userId, data.projectId);

    const result = await callAIJson<any>({
      system: `${BASE_RULES}
You are a code builder that knows this student's project. Never ask for passwords, API keys or credentials; always use environment variables in generated code. Label code as AI-generated and encourage review and testing.`,
      user: `STUDENT SKILLS: ${(profile["skills"] as string[])?.join(", ")} (level: ${profile["experience_level"]})

PROJECT CONTEXT
${projectSummary(bundle)}

REQUEST: ${data.request ?? "(see code below)"}
${data.language ? `LANGUAGE: ${data.language}` : ""}
${data.framework ? `FRAMEWORK: ${data.framework}` : ""}
${data.level ? `EXPLANATION LEVEL: ${data.level}` : ""}
${data.errorMessage ? `ERROR MESSAGE: ${data.errorMessage}` : ""}
${data.code ? `EXISTING CODE:\n${data.code.slice(0, 8000)}` : ""}

${MODE_PROMPT[data.mode]}`,
    });

    await supabase.from("code_sessions").insert({
      user_id: userId,
      project_id: data.projectId,
      mode: data.mode,
      prompt: data.request ?? "",
      language: data.language ?? "",
      result,
    });
    return result;
  });
