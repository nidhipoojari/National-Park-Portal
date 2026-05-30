"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageTransition, FadeIn } from "@/components/motion";
import { ai, type ChatMessage } from "@/lib/ai";

const SUGGESTIONS = [
  "Find a campsite for 4 people at Shenandoah next weekend",
  "What tours does Great Falls Park offer?",
  "Show parking status at Patapsco Valley State Park",
  "List my reservations",
];

export default function ConciergePage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await ai.concierge({
        messages: next,
        visitorId: session?.user?.visitorId ?? null,
        visitorName: session?.user?.name ?? null,
      });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
    <PageShell
      eyebrow="AI"
      title="Park"
      accent="concierge"
      intro="Ask in plain language — I can search parks, campsites, tours and parking, and book or cancel reservations when you're signed in."
    >
      <FadeIn>
      <div className="max-w-3xl rounded-3xl border border-border/60 bg-card overflow-hidden">
        {/* messages */}
        <div ref={scrollRef} className="h-[52vh] overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="h-6 w-6" />
              </span>
              <p className="mt-4 text-foreground/60">
                Try one of these to get started:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/60 px-4 py-2 text-sm text-foreground/70 hover:border-primary/60 hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-3 text-sm"
                    : "max-w-[80%] rounded-2xl rounded-bl-sm bg-background border border-border/60 px-4 py-3 text-sm whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-background border border-border/60 px-4 py-3 text-sm text-foreground/60 inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mx-5 mb-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border/60 p-3 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the concierge…"
            className="flex-1 bg-background rounded-xl border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {!session && (
        <p className="mt-4 text-sm text-foreground/50 max-w-3xl">
          You&apos;re browsing as a guest — sign in to let the concierge book or cancel
          reservations for you.
        </p>
      )}
      </FadeIn>
    </PageShell>
    </PageTransition>
  );
}
