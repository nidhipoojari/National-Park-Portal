"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { PageShell } from "@/components/page-shell";

const inputCls =
  "mt-1 w-full rounded-xl bg-background/60 border border-border/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60";

// Google "G" logo SVG — inline so no extra dependency.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setGoogleBusy(true);
    setError(null);
    await signIn("google", { callbackUrl });
    // redirect handled by NextAuth — no need to setBusy(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", {
      email: email.trim(),
      redirect: false,
    });
    setBusy(false);
    if (res?.error) {
      setError("No account found with that email. Try registering first.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md">
      <div className="rounded-3xl bg-card border border-border/60 p-7 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-foreground/70">
          <LogIn className="h-5 w-5 text-primary" />
          <span className="text-sm uppercase tracking-[0.25em]">Sign in</span>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleBusy || busy}
          className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-background/60 px-5 py-3 text-sm font-medium hover:border-primary/50 hover:bg-background transition-colors disabled:opacity-50"
        >
          {googleBusy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-foreground/40 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        {/* Email form */}
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@example.com"
              required
            />
          </label>

          <button
            type="submit"
            disabled={busy || googleBusy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground font-medium hover:translate-y-[-2px] transition-transform disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in with email
            <ArrowRight className="h-4 w-4" />
          </button>

          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </form>
      </div>
      <p className="mt-4 text-sm text-foreground/50">
        New here?{" "}
        <Link href="/join" className="text-primary hover:underline">
          Create an account
        </Link>
        {" "}— or just sign in with Google above (account created automatically).
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Welcome back"
      title="Sign in to the"
      accent="portal"
      intro="Sign in with Google, or use the email you registered with."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </PageShell>
  );
}

