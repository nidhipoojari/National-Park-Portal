"use client";
import { useState } from "react";
import { Loader2, Car, Search, SlidersHorizontal } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OutputPanel } from "@/components/output-panel";
import { api, type ProcOutput } from "@/lib/api";
import { PARKS } from "@/lib/parks";

const inputCls =
  "w-full rounded-xl bg-background/60 border border-border/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60";

export default function ParkingPage() {
  const [parkName, setParkName] = useState(PARKS[0]?.name ?? "");
  const [lots, setLots] = useState<ProcOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [facilityId, setFacilityId] = useState("");
  const [spotsTaken, setSpotsTaken] = useState("");
  const [update, setUpdate] = useState<ProcOutput | null>(null);

  async function listLots() {
    setBusy(true);
    setError(null);
    setLots(null);
    try {
      setLots(await api.getParkingLots(parkName));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setBusy(false);
    }
  }

  async function applyUpdate() {
    if (!facilityId || spotsTaken === "") {
      setError("Enter a parking facility ID and spots taken.");
      return;
    }
    setBusy(true);
    setError(null);
    setUpdate(null);
    try {
      setUpdate(
        await api.updateParkingStatus(Number(facilityId), Number(spotsTaken))
      );
      await listLots();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      eyebrow="Live availability"
      title="Parking"
      accent="status"
      intro="Check real-time parking lot availability for any park, and update occupancy as spots fill up."
    >
      {error && (
        <p className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* View lots */}
        <div className="rounded-3xl bg-card border border-border/60 p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" /> Parking lots
          </h2>
          <div className="flex gap-2">
            <select
              value={parkName}
              onChange={(e) => setParkName(e.target.value)}
              className={inputCls}
            >
              {PARKS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={listLots}
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
          {lots && <OutputPanel lines={lots.output} className="mt-4" title="Lots" />}
        </div>

        {/* Update status */}
        <div className="rounded-3xl bg-card border border-border/60 p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-accent" /> Update occupancy
          </h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                Parking facility ID
              </span>
              <input
                type="number"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className={inputCls}
                placeholder="e.g. 4"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                Spots taken
              </span>
              <input
                type="number"
                min={0}
                value={spotsTaken}
                onChange={(e) => setSpotsTaken(e.target.value)}
                className={inputCls}
                placeholder="e.g. 25"
              />
            </label>
            <button
              onClick={applyUpdate}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-accent-foreground font-medium hover:translate-y-[-2px] transition-transform disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Update status
            </button>
          </div>
          {update && (
            <OutputPanel lines={update.output} className="mt-4" title="Update result" />
          )}
        </div>
      </div>
    </PageShell>
  );
}
