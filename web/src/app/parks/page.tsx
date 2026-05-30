import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageTransition, StaggerList, StaggerItem } from "@/components/motion";
import { api } from "@/lib/api";
import { getParkMeta, parkImage, PARKS } from "@/lib/parks";

export const dynamic = "force-dynamic";

export default async function ParksPage() {
  let parks;
  let liveError: string | null = null;
  try {
    const rows = await api.getParks();
    parks = rows.map((r) => ({
      id: r.PARK_ID,
      name: r.PARK_NAME,
      address: r.ADDRESS,
      state: r.STATE,
      zipcode: r.ZIPCODE,
      meta: getParkMeta(r.PARK_ID),
    }));
  } catch (err) {
    liveError = err instanceof Error ? err.message : "Could not reach the API";
    // Fallback to static seed data so the page never looks broken.
    parks = PARKS.map((p) => ({
      id: p.id,
      name: p.name,
      address: p.city,
      state: p.state,
      zipcode: "",
      meta: p,
    }));
  }

  return (
    <PageTransition>
    <PageShell
      eyebrow="Maryland · Virginia"
      title="Explore the"
      accent="parks"
      intro="Five parks, live from the reservation database. Pick one to view facilities, check campsite and tour availability, and book your trip."
    >
      {liveError && (
        <p className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          Live data unavailable ({liveError}). Showing seed data — start the API on
          port 4000 to load real records.
        </p>
      )}

      <StaggerList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {parks.map((park) => (
          <StaggerItem key={park.id}>
          <Link
            key={park.id}
            href={`/parks/${park.id}`}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card"
          >
            <div className="relative h-52 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={parkImage(park.id)}
                alt={park.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              <span className="absolute top-4 left-4 rounded-full bg-background/70 backdrop-blur px-3 py-1 text-xs text-foreground/80">
                Park #{park.id} · {park.state}
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl tracking-tight">{park.name}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground/60">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {park.address}
                {park.zipcode ? `, ${park.zipcode}` : ""}
              </p>
              {park.meta && (
                <p className="mt-3 text-sm text-foreground/55 line-clamp-2">
                  {park.meta.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                View park & facilities
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
          </StaggerItem>
        ))}
      </StaggerList>
    </PageShell>
    </PageTransition>
  );
}
