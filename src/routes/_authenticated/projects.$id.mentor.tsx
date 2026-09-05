import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { mentorChat } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { ProjectTabs } from "@/components/ProjectTabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SUGGESTIONS = [
  "How do I start my first task?",
  "Explain the architecture of my project",
  "Am I on track for my deadline?",
  "What should I demo to my evaluators?",
];

export const Route = createFileRoute("/_authenticated/projects/$id/mentor")({
  head: () => ({
    meta: [
      { title: "AI Mentor — ProjectMentor AI" },
      { name: "description", content: "Chat with a mentor that already knows your project and progress." },
      { property: "og:title", content: "AI Mentor — ProjectMentor AI" },
      { property: "og:description", content: "Chat with a mentor that already knows your project and progress." },
    ],
  }),
  component: Mentor,
});

function Mentor() {
  const { id } = Route.useParams();
  const ask = useServerFn(mentorChat);
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("project_id", id)
        .order("created_at");
      if (e) throw e;
      return data;
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);
    setError("");
    try {
      await ask({ data: { projectId: id, message: text.trim() } });
      await qc.invalidateQueries({ queryKey: ["chat", id] });
    } catch (e) {
      setError((e as Error).message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">AI Mentor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask anything — it already knows your project, stack, tasks and progress.
        </p>
      </header>

      <ProjectTabs id={id} />

      <div className="surface-card flex h-[60vh] flex-col p-4">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {!messages.length && (
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border bg-surface-2 p-3 text-left text-sm hover:border-primary/50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface-2"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Mentor is thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <form
          className="mt-4 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Textarea
            rows={2}
            value={input}
            aria-label="Message the AI mentor"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask your mentor…"
          />
          <Button type="submit" disabled={loading} className="gap-2">
            <Send className="size-4" aria-hidden /> Send
          </Button>
        </form>
      </div>
    </div>
  );
}
