"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EVENTS } from "@/lib/events";

export function EventsSection() {
  return (
    <section id="events" className="py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
              What&apos;s on
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">
              Events you&apos;ll <span className="italic text-primary">remember</span>
            </h2>
          </div>
          <p className="max-w-md text-foreground/60">
            Sunrise hikes, jazz nights, paddle workshops — hand-curated from
            every park, every weekend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 group/cards">
          {EVENTS.map((e, i) => (
            <motion.a
              key={e.id}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative block rounded-3xl overflow-hidden aspect-[3/4] bg-card border border-border/50
                         transition-all duration-500 ease-out
                         group-hover/cards:opacity-60 hover:!opacity-100 hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={e.image}
                alt={e.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-background/10" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium">
                  {e.tag}
                </span>
              </div>

              <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/50 backdrop-blur flex items-center justify-center border border-border/60">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                  {e.date}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight">
                  {e.title}
                </h3>
                <p className="mt-1 text-xs text-foreground/60">{e.park}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
