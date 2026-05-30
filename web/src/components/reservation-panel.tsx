"use client";
import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ArrowRight, CalendarDays, Loader2, Tent, Compass, Users } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { api, type FacilityRow, type ProcOutput } from "@/lib/api";
import { OutputPanel } from "@/components/output-panel";
import { dayPickerClassNames } from "@/lib/daypicker";
import { formatUSD } from "@/lib/utils";

type Tab = "campsite" | "tour";

export function ReservationPanel({
  parkName,
  campsites,
  tours,
}: {
  parkName: string;
  campsites: FacilityRow[];
  tours: FacilityRow[];
}) {
  const [tab, setTab] = useState<Tab>("campsite");

  return (
    <div className="rounded-3xl bg-card border border-border/60 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <TabButton active={tab === "campsite"} onClick={() => setTab("campsite")}>
          <Tent className="h-4 w-4" /> Campsite
        </TabButton>
        <TabButton active={tab === "tour"} onClick={() => setTab("tour")}>
          <Compass className="h-4 w-4" /> Tour
        </TabButton>
      </div>

      {tab === "campsite" ? (
        <CampsiteForm parkName={parkName} campsites={campsites} />
      ) : (
        <TourForm parkName={parkName} tours={tours} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border/70 text-foreground/70 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function VisitorIdField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
        Visitor ID
      </span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 100 — new? register on Join"
        className="mt-1 w-full rounded-xl bg-background/60 border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
      />
    </label>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl bg-background/60 border border-border/60 px-3 py-2.5 text-sm outline-none focus:border-primary/60";

function Counter({
  label,
  value,
  setValue,
  min = 0,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-background/60 border border-border/60 px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-foreground/80">
        <Users className="h-4 w-4 text-primary" /> {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          className="h-7 w-7 rounded-full border border-border hover:bg-primary/20"
        >
          –
        </button>
        <span className="w-6 text-center font-medium">{value}</span>
        <button
          type="button"
          onClick={() => setValue(value + 1)}
          className="h-7 w-7 rounded-full border border-border hover:bg-primary/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

function CampsiteForm({
  parkName,
  campsites,
}: {
  parkName: string;
  campsites: FacilityRow[];
}) {
  const [facilityId, setFacilityId] = useState(
    campsites[0]?.FACILITY_ID?.toString() ?? ""
  );
  const [visitorId, setVisitorId] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProcOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const numDays = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return Math.max(1, differenceInCalendarDays(range.to, range.from));
  }, [range]);

  const selected = campsites.find((c) => c.FACILITY_ID === Number(facilityId));

  async function checkAvailability() {
    if (!range?.from || !range?.to) {
      setError("Pick check-in and check-out dates first.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await api.getAvailableCampsites({
        parkName,
        start: format(range.from, "yyyy-MM-dd"),
        end: format(range.to, "yyyy-MM-dd"),
        people: adults + children,
      });
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function reserve() {
    if (!facilityId || !visitorId || !range?.from || numDays < 1) {
      setError("Select a campsite, visitor ID, and a valid date range.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await api.reserveCampsite({
        facilityId: Number(facilityId),
        visitorId: Number(visitorId),
        startDate: format(range.from, "yyyy-MM-dd"),
        numDays,
        adults,
        children,
      });
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reservation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-background/60 border border-border/60 p-2">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          showOutsideDays
          classNames={dayPickerClassNames}
        />
      </div>

      <div className="space-y-4">
        <Field label="Campsite">
          <select
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            className={inputCls}
          >
            {campsites.length === 0 && <option value="">No campsites</option>}
            {campsites.map((c) => (
              <option key={c.FACILITY_ID} value={c.FACILITY_ID}>
                {c.FACILITY_NAME} — {formatUSD(c.DAILY_PRICE)}/night
              </option>
            ))}
          </select>
        </Field>

        <VisitorIdField value={visitorId} onChange={setVisitorId} />

        <div className="grid grid-cols-2 gap-3">
          <Counter label="Adults" value={adults} setValue={setAdults} min={1} />
          <Counter label="Children" value={children} setValue={setChildren} />
        </div>

        <div className="flex items-center justify-between text-sm text-foreground/60">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {numDays > 0 ? `${numDays} night${numDays > 1 ? "s" : ""}` : "No dates"}
          </span>
          {selected && numDays > 0 && (
            <span className="font-display text-lg text-foreground">
              {formatUSD(selected.DAILY_PRICE * numDays)}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={checkAvailability}
            disabled={busy}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 px-4 py-3 text-sm hover:border-primary/60 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Check availability
          </button>
          <button
            onClick={reserve}
            disabled={busy}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm text-primary-foreground font-medium hover:translate-y-[-2px] transition-transform disabled:opacity-50"
          >
            Reserve
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        {result && <OutputPanel lines={result.output} />}
      </div>
    </div>
  );
}

function TourForm({ parkName, tours }: { parkName: string; tours: FacilityRow[] }) {
  const [facilityId, setFacilityId] = useState(
    tours[0]?.FACILITY_ID?.toString() ?? ""
  );
  const [visitorId, setVisitorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProcOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function listTours() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await api.getParkTours(parkName);
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function reserve() {
    if (!facilityId || !visitorId || !date) {
      setError("Select a tour, visitor ID, and a date.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await api.reserveTour({
        facilityId: Number(facilityId),
        visitorId: Number(visitorId),
        startTime: `${date} ${time}:00`,
        adults,
        children,
      });
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reservation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <Field label="Tour">
        <select
          value={facilityId}
          onChange={(e) => setFacilityId(e.target.value)}
          className={inputCls}
        >
          {tours.length === 0 && <option value="">No tours</option>}
          {tours.map((t) => (
            <option key={t.FACILITY_ID} value={t.FACILITY_ID}>
              {t.FACILITY_NAME} — {formatUSD(t.DAILY_PRICE)}
            </option>
          ))}
        </select>
      </Field>

      <VisitorIdField value={visitorId} onChange={setVisitorId} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Time">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Counter label="Adults" value={adults} setValue={setAdults} min={1} />
        <Counter label="Children" value={children} setValue={setChildren} />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={listTours}
          disabled={busy}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border/70 px-4 py-3 text-sm hover:border-primary/60 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          List park tours
        </button>
        <button
          onClick={reserve}
          disabled={busy}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm text-primary-foreground font-medium hover:translate-y-[-2px] transition-transform disabled:opacity-50"
        >
          Reserve tour
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      {result && <OutputPanel lines={result.output} />}
    </div>
  );
}
