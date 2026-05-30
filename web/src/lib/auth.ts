import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Server-side base URL for reaching the Express API.
const API = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "");

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

type VisitorRow = {
  VISITOR_ID: number;
  VISITOR_NAME: string;
  VISITOR_EMAIL: string;
  IS_ADMIN: number;
};

// ── Oracle helpers (used by Google OAuth flow) ───────────────────────────────

async function fetchVisitorByEmail(email: string): Promise<VisitorRow | null> {
  const res = await fetch(
    `${API}/api/visitors/by-email?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return (await res.json()) as VisitorRow;
}

async function registerVisitor(name: string, email: string): Promise<void> {
  await fetch(`${API}/api/visitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, address: "", state: "", zipcode: "" }),
    cache: "no-store",
  });
}

// ────────────────────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        if (!email) return null;

        const v = await fetchVisitorByEmail(email);
        if (!v) return null;

        const isAdmin = v.IS_ADMIN === 1 || adminEmails.includes(email);
        return {
          id: String(v.VISITOR_ID),
          name: v.VISITOR_NAME,
          email: v.VISITOR_EMAIL,
          visitorId: v.VISITOR_ID,
          role: isAdmin ? "admin" : "visitor",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider === "credentials") {
          // authorize() already put visitorId + role on the user object.
          token.visitorId = (user as { visitorId: number }).visitorId;
          token.role = (user as { role: "admin" | "visitor" }).role;
        } else if (account.provider === "google") {
          // Look up email in Oracle; auto-register if this is a first-time Google sign-in.
          const email = user.email?.trim().toLowerCase();
          if (email) {
            let v = await fetchVisitorByEmail(email);
            if (!v) {
              // First time — register automatically using their Google display name.
              const displayName = user.name ?? email.split("@")[0];
              await registerVisitor(displayName, email);
              v = await fetchVisitorByEmail(email);
            }
            if (v) {
              const isAdmin = v.IS_ADMIN === 1 || adminEmails.includes(email);
              token.visitorId = v.VISITOR_ID;
              token.role = isAdmin ? "admin" : "visitor";
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.visitorId = token.visitorId as number;
        session.user.role = token.role as "admin" | "visitor";
      }
      return session;
    },
  },
};
