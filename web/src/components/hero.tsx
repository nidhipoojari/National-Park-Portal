"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const SLIDES = [
  {
    title: "Wildlife at dawn",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Riverside campsites",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Blue Ridge overlooks",
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=80",
  },
  {
    title: "Forest trails",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80",
  },
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4200, stopOnInteraction: false })]
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative pt-28 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-primary/20 blur-[140px]" />
      </div>

      <div className="container">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground/60"
        >
          <span className="h-px w-10 bg-foreground/40" />
          <span>Maryland · Virginia · 5 Parks</span>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 font-display font-light leading-[0.92] tracking-tight text-balance text-[clamp(2.8rem,9vw,8.5rem)]"
        >
          <span className="block">National Park</span>
          <span className="block">
            <span className="italic text-primary">Service</span> Portal
          </span>
        </motion.h1>

        {/* Sub row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 grid md:grid-cols-[1fr_auto] gap-6 items-end"
        >
          <p className="max-w-xl text-foreground/70 text-base md:text-lg">
            Reserve campsites, guided tours, and parking across five wild
            corners of the mid-Atlantic. One portal — every reservation, every
            receipt, every adventure.
          </p>
          <a
            href="/parks"
            className="inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 text-accent-foreground font-medium hover:translate-y-[-2px] transition-transform group self-start md:self-end"
          >
            Start booking
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14"
        >
          <div ref={emblaRef} className="overflow-hidden rounded-3xl">
            <div className="flex">
              {SLIDES.map((s, i) => (
                <div
                  key={i}
                  className="relative shrink-0 grow-0 basis-full md:basis-[78%] lg:basis-[68%] pr-4"
                >
                  <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.img}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 text-sm text-foreground/90">
                      <MapPin className="h-4 w-4 text-accent" />
                      {s.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1 rounded-full transition-all ${
                  selected === i
                    ? "w-10 bg-accent"
                    : "w-4 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
