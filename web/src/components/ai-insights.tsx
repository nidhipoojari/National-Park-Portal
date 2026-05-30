"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download } from "lucide-react";
import { ai } from "@/lib/ai";

function exportPdf(summary: string, start: string, end: string) {
  // Dynamically import jsPDF so it's never bundled unless used.
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    const maxW = pageW - margin * 2;
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("NPS Portal — AI Executive Summary", margin, y);
    y += 9;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Date range: ${start} → ${end}`, margin, y);
    y += 6;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 10;

    // Divider
    doc.setDrawColor(180);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    // Body
    doc.setTextColor(30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(summary, maxW) as string[];
    lines.forEach((line: string) => {
      if (y > 272) { doc.addPage(); y = 20; }
      doc.text(line, margin, y);
      y += 6;
    });

    doc.save(`nps-insights-${start}-${end}.pdf`);
  });
}

export function AiInsights() {
  const [start, setStart] = useState("2026-05-01");
  const [end, setEnd] = useState("2026-05-31");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const res = await ai.insights(start, end);
      setSummary(res.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate insights");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-7">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl">AI executive summary</h2>
      </div>
      <p className="text-sm text-foreground/55 mb-5">
        Runs <code>statistics_report</code> for a date range and asks the LLM to
        summarize trends for management.
      </p>

      <div className="flex flex-wrap items-end gap-3 mb-5">
        <label className="text-sm">
          <span className="block text-foreground/55 mb-1">Start</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="bg-background rounded-xl border border-border/60 px-3 py-2 outline-none focus:border-primary/60"
          />
        </label>
        <label className="text-sm">
          <span className="block text-foreground/55 mb-1">End</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="bg-background rounded-xl border border-border/60 px-3 py-2 outline-none focus:border-primary/60"
          />
        </label>
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate
        </button>
        {summary && (
          <button
            onClick={() => exportPdf(summary, start, end)}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-5 py-2.5 text-sm font-medium hover:border-primary/60 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {summary && (
        <div className="rounded-2xl border border-border/60 bg-background p-5 text-sm leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
}
