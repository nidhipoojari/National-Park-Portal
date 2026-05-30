import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReservationPanel } from "@/components/reservation-panel";
import {
  api,
  facilityTypeLabel,
  FACILITY_TYPE,
  type FacilityRow,
} from "@/lib/api";
import { getParkMeta, parkImage } from "@/lib/parks";
import { formatUSD } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ParkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  let detail;
  try {
    detail = await api.getPark(id);
  } catch {
    notFound();
  }
  if (!detail?.park) notFound();

  const { park, facilities } = detail;
  const meta = getParkMeta(park.PARK_ID);

  const byType = (t: number) =>
    facilities.filter((f) => f.FACILITY_TYPE === t);
  const campsites = byType(FACILITY_TYPE.CAMPSITE);
  const tours = byType(FACILITY_TYPE.TOUR);

  return (
    <>
      <SiteHeader />
      <main className="pt-16 pb-24 min-h-screen">
        {/* Hero */}
        <section className="relative h-[42vh] min-h-[320px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={parkImage(park.PARK_ID)}
            alt={park.PARK_NAME}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
          <div className="container relative h-full flex flex-col justify-end pb-10">
            <Link
              href="/parks"
              className="mb-4 inline-flex w-fit items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All parks
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Park #{park.PARK_ID} · {park.STATE}
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-6xl tracking-tight">
              {park.PARK_NAME}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-foreground/70">
              <MapPin className="h-4 w-4 text-accent" />
              {park.ADDRESS}, {park.STATE} {park.ZIPCODE}
            </p>
          </div>
        </section>

        <div className="container mt-12 grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
          {/* Facilities */}
          <div>
            {meta && (
              <p className="mb-6 text-foreground/65 leading-relaxed">
                {meta.description}
              </p>
            )}
            <h2 className="font-display text-2xl mb-4">Facilities</h2>
            {facilities.length === 0 ? (
              <p className="text-sm text-foreground/50">
                No facilities recorded for this park.
              </p>
            ) : (
              <div className="space-y-3">
                {facilities.map((f) => (
                  <FacilityCard key={f.FACILITY_ID} f={f} />
                ))}
              </div>
            )}
          </div>

          {/* Reservation */}
          <div>
            <h2 className="font-display text-2xl mb-4">Book your visit</h2>
            <ReservationPanel
              parkName={park.PARK_NAME}
              campsites={campsites}
              tours={tours}
            />
            <p className="mt-4 text-xs text-foreground/45">
              Need a visitor ID?{" "}
              <Link href="/join" className="text-primary hover:underline">
                Register here
              </Link>
              . Manage or cancel bookings on{" "}
              <Link href="/transactions" className="text-primary hover:underline">
                My trips
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function FacilityCard({ f }: { f: FacilityRow }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-5 py-4">
      <div>
        <p className="font-medium">{f.FACILITY_NAME}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/45 mt-0.5">
          {facilityTypeLabel(f.FACILITY_TYPE)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-lg">{formatUSD(f.DAILY_PRICE)}</p>
        {f.CHILD_PRICE > 0 && (
          <p className="text-xs text-foreground/50">
            child {formatUSD(f.CHILD_PRICE)}
          </p>
        )}
      </div>
    </div>
  );
}
