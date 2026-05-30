import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, Car, ListChecks, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { AiInsights } from "@/components/ai-insights";
import { AdminCharts } from "@/components/admin-charts";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/dashboard");

  // Live snapshot metrics from the transactions table.
  let totalTx = 0;
  let activeTx = 0;
  let revenue = 0;
  let metricsError: string | null = null;
  let allRows: Awaited<ReturnType<typeof api.getTransactions>> = [];
  try {
    allRows = await api.getTransactions();
    totalTx = allRows.length;
    activeTx = allRows.filter((r) => r.STATUS === 1).length;
    revenue = allRows
      .filter((r) => r.STATUS === 1)
      .reduce((sum, r) => sum + (Number(r.TOTAL_PRICE) || 0), 0);
  } catch (err) {
    metricsError = err instanceof Error ? err.message : "Could not load metrics";
  }

  return (
    <PageShell
      eyebrow="Admin"
      title="Operations"
      accent="dashboard"
      intro={`Signed in as ${session.user.name}. Manage reports, parking, and reservations.`}
    >
      {metricsError && (
        <p className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          {metricsError}
        </p>
      )}

      {/* Metrics */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Metric label="Total transactions" value={totalTx.toString()} />
        <Metric label="Active reservations" value={activeTx.toString()} />
        <Metric
          label="Active revenue"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(revenue)}
        />
      </div>

      {/* Tools */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ToolCard
          href="/stats"
          icon={<BarChart3 className="h-5 w-5" />}
          title="Statistics report"
          desc="Revenue & visitor stats by date range"
        />
        <ToolCard
          href="/parking"
          icon={<Car className="h-5 w-5" />}
          title="Parking management"
          desc="View lots & update occupancy"
        />
        <ToolCard
          href="/transactions"
          icon={<ListChecks className="h-5 w-5" />}
          title="All transactions"
          desc="Browse & cancel any booking"
        />
      </div>

      {/* AI insights */}
      <div className="mt-10">
        <AiInsights />
      </div>

      {/* Recharts — revenue + booking breakdown */}
      <AdminCharts rows={allRows} />
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-foreground/45">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}

function ToolCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/60 transition-colors"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
        {icon}
      </span>
      <p className="mt-3 font-medium flex items-center gap-2">
        {title}
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </p>
      <p className="text-sm text-foreground/55">{desc}</p>
    </Link>
  );
}
