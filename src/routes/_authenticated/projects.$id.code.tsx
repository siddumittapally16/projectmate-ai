/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2, Code2 } from "lucide-react";
import { codeAssist } from "@/lib/ai.functions";
import { ProjectTabs } from "@/components/ProjectTabs";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "generate" | "debug" | "explain" | "improve" | "tests" | "security" | "structure";

const MODES: { key: Mode; label: string }[] = [
  { key: "generate", label: "Generate code" },
  { key: "debug", label: "Debug my code" },
  { key: "explain", label: "Explain code" },
  { key: "improve", label: "Improve code" },
  { key: "tests", label: "Write tests" },
  { key: "security", label: "Security check" },
  { key: "structure", label: "Project structure" },
];

export const Route = createFileRoute("/_authenticated/projects/$id/code")({
  validateSearch: (s: Record<string, unknown>) => ({ task: (s["task"] as string) ?? "" }),
  head: () => ({
    meta: [
      { title: "AI Code Builder — ProjectMentor AI" },
      { name: "description", content: "Generate, debug, explain and harden code for your own project." },
      { property: "og:title", content: "AI Code Builder — ProjectMentor AI" },
      { property: "og:description", content: "Generate, debug, explain and harden code for your own project." },
    ],
  }),
  component: CodeBuilder,
});

function CodeBuilder() {
  const { id } = Route.useParams();
  const { task } = Route.useSearch();
  const run = useServerFn(codeAssist);
  const [mode, setMode] = useState<Mode>("generate");
  const [request, setRequest] = useState(task);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState("Python");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (task) setRequest(task);
  }, [task]);

  const needsCode = ["debug", "explain", "improve", "tests", "security"].includes(mode);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (needsCode && !code.trim()) {
      setError("Paste the code you want the AI to work on.");
      return;
    }
    if (!needsCode && mode !== "structure" && !request.trim()) {
      setError("Describe what you want to build.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await run({
        data: { projectId: id, mode, request, code, errorMessage, language, level },
      });
      setResult(res);
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">AI Code Builder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every answer is written for this project's stack and your skill level.
        </p>
      </header>

      <ProjectTabs id={id} />

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <Button
            key={m.key}
            size="sm"
            variant={mode === m.key ? "default" : "outline"}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <form onSubmit={submit} className="surface-card space-y-4 p-6">
        {mode !== "structure" && (
          <div className="space-y-2">
            <Label htmlFor="request">What do you need?</Label>
            <Textarea
              id="request"
              rows={3}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="e.g. Build the image upload API for crop disease photos"
            />
          </div>
        )}
        {needsCode && (
          <div className="space-y-2">
            <Label htmlFor="code">Your code</Label>
            <Textarea
              id="code"
              rows={10}
              className="font-mono text-xs"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here"
            />
          </div>
        )}
        {mode === "debug" && (
          <div className="space-y-2">
            <Label htmlFor="err">Error message (optional)</Label>
            <Input id="err" value={errorMessage} onChange={(e) => setErrorMessage(e.target.value)} />
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label htmlFor="lang">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="lang" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Python", "JavaScript", "TypeScript", "Java", "C++", "Dart", "Go", "SQL"].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {mode === "explain" && (
            <div className="space-y-2">
              <Label htmlFor="level">Explanation level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="level" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Beginner", "Intermediate", "Advanced"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Code2 className="size-4" aria-hidden />
          )}
          {loading ? "Working…" : "Ask the AI"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="surface-card space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">{result.title ?? "AI result"}</h2>
            <Badge variant="outline">AI-generated — review and test before using</Badge>
          </div>

          {["problem", "why_it_happened", "how_to_fix", "what_it_does", "data_flow", "before_summary", "how_it_works", "where_to_put_it", "how_to_test", "how_to_run", "notes", "advisory"]
            .filter((k) => typeof result[k] === "string" && result[k])
            .map((k) => (
              <div key={k}>
                <h3 className="text-sm font-semibold capitalize">{k.replace(/_/g, " ")}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{result[k]}</p>
              </div>
            ))}

          {["walkthrough", "variables", "functions", "dependencies", "possible_issues", "what_changed", "why"]
            .filter((k) => Array.isArray(result[k]) && result[k].length)
            .map((k) => (
              <div key={k}>
                <h3 className="text-sm font-semibold capitalize">{k.replace(/_/g, " ")}</h3>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {result[k].map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            ))}

          {Array.isArray(result.findings) && (
            <div className="space-y-3">
              {result.findings.map((f: any, i: number) => (
                <div key={i} className="rounded-lg border border-border bg-surface-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{f.issue}</h3>
                    <Badge variant={f.severity === "High" ? "destructive" : "outline"}>
                      {f.severity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.detail}</p>
                  <p className="mt-1 text-sm">
                    <span className="font-medium">Fix: </span>
                    {f.fix}
                  </p>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(result.steps) &&
            result.steps.map((s: any, i: number) => (
              <div key={i} className="space-y-2">
                <h3 className="text-sm font-semibold">{s.step}</h3>
                {s.explanation && (
                  <p className="text-sm text-muted-foreground">{s.explanation}</p>
                )}
                {s.file_path && (
                  <p className="font-mono text-xs text-muted-foreground">{s.file_path}</p>
                )}
                <CodeBlock code={s.code} language={language} />
                {s.next_action && (
                  <p className="text-sm">
                    <span className="font-medium">Next: </span>
                    {s.next_action}
                  </p>
                )}
              </div>
            ))}

          {result.tree && <CodeBlock code={result.tree} language="text" />}
          {Array.isArray(result.folders) && (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {result.folders.map((f: any, i: number) => (
                <li key={i}>
                  <span className="font-mono text-foreground">{f.path}</span> — {f.purpose}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
