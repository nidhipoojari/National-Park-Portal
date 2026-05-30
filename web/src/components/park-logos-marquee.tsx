"use client";
import { PARKS } from "@/lib/parks";

export function ParkLogosMarquee() {
  const items = [...PARKS, ...PARKS]; // duplicate for seamless loop
  return (
    <section className="py-14 border-y border-border/40 bg-card/40">
      <div className="container mb-6 flex items-end justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
          Trusted across the mid-Atlantic
        </p>
        <p className="hidden md:block text-xs text-foreground/40">
          Five parks. One reservation system.
        </p>
      </div>

      <div className="relative overflow-hidden gradient-mask-r">
        <div className="flex w-max animate-marquee-x gap-12 px-6 will-change-transform">
          {items.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="flex items-center gap-4 shrink-0"
            >
              <div className="h-12 w-12 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center font-display text-primary text-lg">
                {p.shortName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl md:text-3xl tracking-tight whitespace-nowrap">
                  {p.shortName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                  {p.state} · Park
                </span>
              </div>
              <span className="text-foreground/20 text-2xl ml-4">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
