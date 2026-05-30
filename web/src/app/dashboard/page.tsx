import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tent, Compass, Car, Ban, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OutputPanel } from "@/components/output-panel";
import { authOptions } from "@/lib/auth";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const { name, visitorId, role } = session.user;

  let transactions: string[] = [];
  let loadError: string | null = null;
  try {
    const out = await api.getVisitorTransactions(name ?? "");
    transactions = out.output;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load transactions";
  }

  return (
    <PageShell
      eyebrow={`Signed in${role === "admin" ? " · Admin" : ""}`}
      title="Welcome,"
      accent={name?.split(" ")[0] ?? "explorer"}
      intro={`Visitor #${visitorId}. Here are your reservations and quick actions.`}
    >
      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <ActionCard
          href="/parks"
          icon={<Tent className="h-5 w-5" />}
          title="Reserve a campsite"
          desc="Browse parks & book a stay"
        />
        <ActionCard
          href="/parks"
          icon={<Compass className="h-5 w-5" />}
          title="Book a tour"
          desc="Guided experiences"
        />
        <ActionCard
          href="/parking"
          icon={<Car className="h-5 w-5" />}
          title="Parking status"
          desc="Check live availability"
        />
      </div>

      {/* My reservations */}
      <div className="rounded-3xl bg-card border border-border/60 p-6 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">My reservations</h2>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all"
          >
            <Ban className="h-4 w-4" /> Manage / cancel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadError ? (
          <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
            {loadError}
          </p>
        ) : transactions.length > 0 ? (
          <OutputPanel lines={transactions} title={`Transactions for ${name}`} />
        ) : (
          <p className="text-sm text-foreground/55">
            No reservations yet.{" "}
            <Link href="/parks" className="text-primary hover:underline">
              Book your first trip
            </Link>
            .
          </p>
        )}
      </div>
    </PageShell>
  );
}

function ActionCard({
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
      <p className="mt-3 font-medium">{title}</p>
      <p className="text-sm text-foreground/55">{desc}</p>
    </Link>
  );
}
