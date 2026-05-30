import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/40 mt-12">
      <div className="container py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-display text-background font-bold">N</span>
            </div>
            <span className="font-display text-xl">
              NPS<span className="text-primary">.</span>portal
            </span>
          </div>
          <p className="mt-4 max-w-sm text-foreground/60">
            One reservation system for five mid-Atlantic parks. Built for IS 620
            Advanced Database — Spring 2026, Group 1.
          </p>
        </div>

        <FooterColumn
          title="Explore"
          items={["Booking", "Events", "Shop", "Ranger AI"]}
        />
        <FooterColumn
          title="Support"
          items={["Help center", "Cancellation", "Contact", "Accessibility"]}
        />
      </div>

      <div className="border-t border-border/40">
        <div className="container py-6 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-foreground/40">
          <p>© {new Date().getFullYear()} National Park Service Portal · Academic project.</p>
          <p className="font-display tracking-wide">Reserve your wild.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4">
        {title}
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}>
            <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              {i}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
