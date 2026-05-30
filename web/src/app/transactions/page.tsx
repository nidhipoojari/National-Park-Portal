"use client";
import { useState } from "react";
import { Loader2, Search, Ban, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OutputPanel } from "@/components/output-panel";
import { api, type ProcOutput, type TransactionRow } from "@/lib/api";
import { formatUSD } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl bg-background/60 border border-border/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60";

const STATUS_LABEL: Record<number, { label: string; cls: string }> = {
  1: { label: "Active", cls: "bg-primary/20 text-primary" },
  3: { label: "Canceled", cls: "bg-red-500/15 text-red-400" },
};

export default function TransactionsPage() {
  const [name, setName] = useState("");
  const [lookup, setLookup] = useState<ProcOutput | null>(null);
  const [rows, setRows] = useState<TransactionRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [cancelId, setCancelId] = useState("");
  const [cancelResult, setCancelResult] = useState<ProcOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function searchByName() {
    if (!name.trim()) {
      setError("Enter a visitor name.");
      return;
    }
    setBusy(true);
    setError(null);
    setLookup(null);
    try {
      setLookup(await api.getVisitorTransactions(name.trim()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setBusy(false);
    }
  }

  async function loadAll() {
    setBusy(true);
    setError(null);
    try {
      setRows(await api.getTransactions());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load transactions");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!cancelId) {
      setError("Enter a transaction ID to cancel.");
      return;
    }
    setBusy(true);
    setError(null);
    setCancelResult(null);
    try {
      setCancelResult(await api.cancelTransaction(Number(cancelId)));
      if (rows) await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancellation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      eyebrow="Manage bookings"
      title="My"
      accent="trips"
      intro="Look up your reservations by name, review all transactions, and cancel a booking."
    >
      {error && (
        <p className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lookup by name */}
        <div className="rounded-3xl bg-card border border-border/60 p-6">
          <h2 className="font-display text-xl mb-4">Find my reservations</h2>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByName()}
              placeholder="Visitor name (e.g. John Smith)"
              className={inputCls}
            />
            <button
              onClick={searchByName}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-sm text-primary-foreground disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
          {lookup && (
            <OutputPanel lines={lookup.output} className="mt-4" title="Transactions" />
          )}
        </div>

        {/* Cancel */}
        <div className="rounded-3xl bg-card border border-border/60 p-6">
          <h2 className="font-display text-xl mb-4">Cancel a booking</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={cancelId}
              onChange={(e) => setCancelId(e.target.value)}
              placeholder="Transaction ID"
              className={inputCls}
            />
            <button
              onClick={cancel}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/50 px-4 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Ban className="h-4 w-4" /> Cancel
            </button>
          </div>
          {cancelResult && (
            <OutputPanel
              lines={cancelResult.output}
              className="mt-4"
              title="Cancellation result"
            />
          )}
        </div>
      </div>

      {/* All transactions */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">All transactions</h2>
          <button
            onClick={loadAll}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm hover:border-primary/60 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {rows ? "Refresh" : "Load"}
          </button>
        </div>

        {rows && (
          <div className="overflow-x-auto rounded-3xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-background/60 text-foreground/50 text-xs uppercase tracking-wider">
                <tr>
                  <Th>ID</Th>
                  <Th>Visitor</Th>
                  <Th>Facility</Th>
                  <Th>Start</Th>
                  <Th>Days</Th>
                  <Th>Guests</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-foreground/50">
                      No transactions yet.
                    </td>
                  </tr>
                )}
                {rows.map((t) => {
                  const s = STATUS_LABEL[t.STATUS] ?? {
                    label: `#${t.STATUS}`,
                    cls: "bg-muted text-foreground/60",
                  };
                  return (
                    <tr key={t.TRANSACTION_ID} className="border-t border-border/60">
                      <Td>{t.TRANSACTION_ID}</Td>
                      <Td>{t.VISITOR_ID}</Td>
                      <Td>{t.FACILITY_ID}</Td>
                      <Td>{t.START_TIME}</Td>
                      <Td>{t.NUMBER_OF_DAYS}</Td>
                      <Td>
                        {t.NUM_ADULTS}A {t.NUM_CHILDREN}C
                      </Td>
                      <Td>{formatUSD(t.TOTAL_PRICE)}</Td>
                      <Td>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${s.cls}`}
                        >
                          {s.label}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-medium">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-foreground/80">{children}</td>;
}
