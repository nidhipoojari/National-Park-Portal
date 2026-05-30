"use client";
import { useState } from "react";
import { Loader2, BarChart3 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OutputPanel } from "@/components/output-panel";
import { api, type ProcOutput } from "@/lib/api";

const inputCls =
  "mt-1 w-full rounded-xl bg-background/60 border border-border/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60";

export default function StatsPage() {
  const [start, setStart] = useState("2026-05-01");
  const [end, setEnd] = useState("2026-05-31");
  const [report, setReport] = useState<ProcOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!start || !end) {
      setError("Pick a start and end date.");
      return;
    }
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      setReport(await api.getStats({ start, end }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Report failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      eyebrow="Analytics"
      title="Statistics"
      accent="report"
      intro="Run the park statistics report over a date range — transactions, revenue, visitors, and top reservations per park."
    >
      <div className="max-w-2xl">
        <div className="rounded-3xl bg-card border border-border/60 p-6 md:p-7">
          <div className="flex items-center gap-2 text-foreground/70 mb-5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm uppercase tracking-[0.25em]">Date range</span>
          </div>
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                Start
              </span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                End
              </span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputCls}
              />
            </label>
            <button
              onClick={run}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground font-medium hover:translate-y-[-2px] transition-transform disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Generate
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {report && (
          <OutputPanel
            lines={report.output}
            className="mt-6"
            title="Statistics report"
          />
        )}
      </div>
    </PageShell>
  );
}
