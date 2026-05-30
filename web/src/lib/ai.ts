// Client for the Phase 5 AI microservice (FastAPI).

const AI_BASE_URL =
  process.env.NEXT_PUBLIC_AI_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type InsightsResult = {
  summary: string;
  report: string[];
  start: string;
  end: string;
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AI_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `AI request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export const ai = {
  health: () =>
    fetch(`${AI_BASE_URL}/health`, { cache: "no-store" }).then((r) => r.json()),

  concierge: (opts: {
    messages: ChatMessage[];
    visitorId?: number | null;
    visitorName?: string | null;
  }) =>
    post<{ reply: string }>("/ai/concierge", {
      messages: opts.messages,
      visitorId: opts.visitorId ?? null,
      visitorName: opts.visitorName ?? null,
    }),

  insights: (start: string, end: string) =>
    post<InsightsResult>("/ai/insights", { start, end }),
};
