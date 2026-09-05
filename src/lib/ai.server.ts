const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const MODEL = "google/gemini-3.7-flash";

export class AIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type CallArgs = {
  system: string;
  user: string;
  json?: boolean;
  history?: { role: "user" | "assistant"; content: string }[];
};

export async function callAI({ system, user, json, history }: CallArgs): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AIError("AI service is not configured.", 401);

  const messages = [
    { role: "system", content: system },
    ...(history ?? []),
    { role: "user", content: user },
  ];

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429)
      throw new AIError("AI is rate limited right now. Please retry in a moment.", 429);
    if (res.status === 402)
      throw new AIError("AI credits are exhausted for this workspace.", 402);
    throw new AIError(
      `AI service is temporarily unavailable. Please try again. (${res.status}) ${body.slice(0, 200)}`,
      res.status,
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new AIError("AI returned an empty response. Please try again.", 502);
  return content;
}

export function parseJson<T>(raw: string): T {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-zA-Z]*\s*/, "").replace(/```\s*$/, "");
  }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first > 0 || last < text.length - 1) {
    if (first !== -1 && last !== -1) text = text.slice(first, last + 1);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AIError("AI returned an unreadable response. Please try again.", 502);
  }
}

export async function callAIJson<T>(args: Omit<CallArgs, "json">): Promise<T> {
  const raw = await callAI({ ...args, json: true });
  return parseJson<T>(raw);
}
