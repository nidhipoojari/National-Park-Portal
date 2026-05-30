import { cn } from "@/lib/utils";

// Renders DBMS_OUTPUT lines returned by procedure-backed endpoints as a
// terminal-style panel. Blank lines (" ") become spacers.
export function OutputPanel({
  lines,
  className,
  title = "Result",
}: {
  lines: string[] | undefined | null;
  className?: string;
  title?: string;
}) {
  if (!lines || lines.length === 0) return null;
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/60 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="text-xs uppercase tracking-[0.25em] text-foreground/50">
          {title}
        </span>
      </div>
      <pre className="px-4 py-3 text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap font-mono">
        {lines.map((l) => (l.trim() === "" ? "\n" : `${l}\n`)).join("")}
      </pre>
    </div>
  );
}
