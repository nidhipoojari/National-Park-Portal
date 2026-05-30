"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, UserPlus } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { OutputPanel } from "@/components/output-panel";
import { api, type ProcOutput } from "@/lib/api";

const inputCls =
  "mt-1 w-full rounded-xl bg-background/60 border border-border/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60";

export default function JoinPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    state: "",
    zipcode: "",
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProcOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await api.addVisitor({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim() || undefined,
        state: form.state.trim() || undefined,
        zipcode: form.zipcode.trim() || undefined,
      });
      setResult(out);
      // Auto sign-in with the email just registered, then go to dashboard.
      const res = await signIn("credentials", {
        email: form.email.trim(),
        redirect: false,
      });
      if (!res?.error) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      eyebrow="Become a member"
      title="Join the"
      accent="portal"
      intro="Register as a visitor to reserve campsites and tours. You'll get a visitor ID to use at checkout."
    >
      <div className="max-w-xl">
        <form
          onSubmit={submit}
          className="rounded-3xl bg-card border border-border/60 p-7 md:p-8 space-y-4"
        >
          <div className="flex items-center gap-2 text-foreground/70">
            <UserPlus className="h-5 w-5 text-primary" />
            <span className="text-sm uppercase tracking-[0.25em]">
              Visitor details
            </span>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
              Full name *
            </span>
            <input
              value={form.name}
              onChange={set("name")}
              className={inputCls}
              placeholder="Jane Ranger"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
              Email *
            </span>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              className={inputCls}
              placeholder="jane@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
              Address
            </span>
            <input
              value={form.address}
              onChange={set("address")}
              className={inputCls}
              placeholder="123 Trailhead Rd"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                State
              </span>
              <input
                value={form.state}
                onChange={set("state")}
                className={inputCls}
                placeholder="MD"
                maxLength={2}
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                Zip code
              </span>
              <input
                value={form.zipcode}
                onChange={set("zipcode")}
                className={inputCls}
                placeholder="21043"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground font-medium hover:translate-y-[-2px] transition-transform disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create my visitor profile
            <ArrowRight className="h-4 w-4" />
          </button>

          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          {result && (
            <OutputPanel lines={result.output} title="Registration result" />
          )}
        </form>
        <p className="mt-4 text-xs text-foreground/45">
          Google sign-in is coming in a later phase — for now this creates a record
          directly via the <code>add_visitor</code> procedure.
        </p>
      </div>
    </PageShell>
  );
}
