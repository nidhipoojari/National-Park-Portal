import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  eyebrow,
  title,
  accent,
  intro,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  accent?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="container">
          <header className="mb-10 max-w-3xl">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">
              {title}
              {accent && <span className="italic text-primary"> {accent}</span>}
            </h1>
            {intro && (
              <p className="mt-4 text-foreground/60 text-lg leading-relaxed">
                {intro}
              </p>
            )}
          </header>
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
