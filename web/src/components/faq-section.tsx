"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { FAQS } from "@/lib/faqs";

export function FAQSection() {
  return (
    <section id="faq" className="py-24">
      <div className="container grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
            Questions, answered
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">
            Frequently <span className="italic text-primary">asked</span>
          </h2>
          <p className="mt-5 text-foreground/60 max-w-md">
            Everything you need to know before you book. Still stuck? Our park
            ranger AI is one click away.
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Accordion.Item
                value={`item-${i}`}
                className="group rounded-2xl border border-border/60 bg-card/60 overflow-hidden data-[state=open]:border-primary/60 transition-colors"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between gap-6 p-6 text-left">
                    <span className="font-display text-xl md:text-2xl tracking-tight">
                      {f.q}
                    </span>
                    <span className="h-9 w-9 shrink-0 rounded-full border border-border flex items-center justify-center transition-transform group-data-[state=open]:rotate-45 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:border-primary">
                      <Plus className="h-4 w-4" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="px-6 pb-6 -mt-2 text-foreground/70 max-w-2xl">
                    {f.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
