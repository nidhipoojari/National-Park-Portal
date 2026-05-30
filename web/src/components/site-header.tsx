"use client";
import Link from "next/link";
import { LayoutDashboard, LogOut, Menu, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const leftNav = [
  { label: "Parks", href: "/parks" },
  { label: "Parking", href: "/parking" },
  { label: "Stats", href: "/stats" },
  { label: "Concierge", href: "/ai/concierge" },
  { label: "Events", href: "/#events" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60"
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-display text-background font-bold">N</span>
            </div>
            <span className="font-display text-lg tracking-tight">
              NPS<span className="text-primary">.</span>portal
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {leftNav.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink href="/admin">Admin</NavLink>
            )}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:border-primary/60 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                {user.name?.split(" ")[0] ?? "Dashboard"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:border-primary/60 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:border-primary/60 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                My trips
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:translate-y-[-1px] transition-transform"
              >
                <User className="h-4 w-4" />
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-full border border-border/70 p-2"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-border/60 transition-[max-height]",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container py-4 flex flex-col gap-3">
          {leftNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-foreground/80 hover:text-foreground"
            >
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground/80 hover:text-foreground"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="py-2 text-left text-sm text-foreground/80 hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/transactions"
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground/80 hover:text-foreground"
              >
                My trips
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground/80 hover:text-foreground"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-foreground/80 hover:text-foreground transition-colors py-1 group"
    >
      {children}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
