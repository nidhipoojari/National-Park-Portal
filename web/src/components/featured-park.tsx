"use client";
import { useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { motion } from "framer-motion";
import { FEATURED_PARK } from "@/lib/parks";
import { dayPickerClassNames } from "@/lib/daypicker";
import { formatUSD } from "@/lib/utils";

export function FeaturedPark() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const nights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return Math.max(0, differenceInCalendarDays(range.to, range.from));
  }, [range]);

  const subtotal = nights * FEATURED_PARK.campsitePrice;
  const entrance = FEATURED_PARK.entrancePrice * guests;
  const total = subtotal + entrance;

  return (
    <section id="booking" className="py-24">
      <div className="container">
        {/* Section eyebrow */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
              Featured this month
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">
              Reserve <span className="italic text-primary">Shenandoah</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-foreground/60">
            <MapPin className="h-4 w-4 text-accent" />
            {FEATURED_PARK.city}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-stretch">
          {/* Image card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden min-h-[520px] group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURED_PARK.image}
              alt={FEATURED_PARK.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Park #{FEATURED_PARK.id} · {FEATURED_PARK.state}
              </p>
              <h3 className="mt-3 font-display text-3xl md:text-5xl tracking-tight">
                {FEATURED_PARK.name}
              </h3>
              <p className="mt-3 max-w-md text-foreground/70">
                {FEATURED_PARK.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FEATURED_PARK.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-foreground/20 bg-background/40 backdrop-blur px-3 py-1 text-xs text-foreground/80"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl bg-card border border-border/60 p-7 md:p-8 flex flex-col"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-display text-3xl text-primary leading-none">
                  01
                </span>
                <span className="text-foreground/50">/ 03</span>
                <span className="ml-3 text-foreground/70">Pick your dates</span>
              </div>
              <div className="flex gap-1">
                <span className="h-1 w-8 rounded-full bg-primary" />
                <span className="h-1 w-4 rounded-full bg-border" />
                <span className="h-1 w-4 rounded-full bg-border" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/50">
              <CalendarDays className="h-4 w-4" /> Availability calendar
            </div>

            {/* Calendar */}
            <div className="mt-3 rounded-2xl bg-background/60 border border-border/60 p-2">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                showOutsideDays
                className="!m-0"
                classNames={dayPickerClassNames}
              />
            </div>

            {/* Per-night summary */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <Stat
                label="Campsite / night"
                value={formatUSD(FEATURED_PARK.campsitePrice)}
              />
              <Stat
                label="Entrance / guest"
                value={formatUSD(FEATURED_PARK.entrancePrice)}
              />
              <Stat label="Parking / day" value={formatUSD(FEATURED_PARK.parkingPrice)} />
            </div>

            {/* Guests */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-background/60 border border-border/60 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Users className="h-4 w-4 text-primary" /> Guests
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="h-7 w-7 rounded-full border border-border hover:bg-primary/20"
                  aria-label="Decrease guests"
                >
                  –
                </button>
                <span className="w-6 text-center font-medium">{guests}</span>
                <button
                  onClick={() => setGuests((g) => Math.min(12, g + 1))}
                  className="h-7 w-7 rounded-full border border-border hover:bg-primary/20"
                  aria-label="Increase guests"
                >
                  +
                </button>
              </div>
            </div>

            {/* Totals + next */}
            <div className="mt-5 flex items-end justify-between gap-4 pt-5 border-t border-border/60">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-foreground/40">
                  {nights > 0
                    ? `${nights} night${nights > 1 ? "s" : ""} · ${range?.from ? format(range.from, "MMM d") : ""}${
                        range?.to ? ` → ${format(range.to, "MMM d")}` : ""
                      }`
                    : "Select check-in & check-out"}
                </p>
                <p className="mt-1 font-display text-3xl">
                  {formatUSD(total || FEATURED_PARK.campsitePrice)}
                  <span className="text-sm text-foreground/50 font-sans ml-1">
                    {nights > 0 ? "total" : "/ night"}
                  </span>
                </p>
              </div>
              <a
                href={`/parks/${FEATURED_PARK.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground font-medium hover:translate-y-[-2px] transition-transform"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/60 border border-border/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        {label}
      </p>
      <p className="mt-0.5 font-display text-base">{value}</p>
    </div>
  );
}
