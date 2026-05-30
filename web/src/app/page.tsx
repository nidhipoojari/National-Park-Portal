import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ParkLogosMarquee } from "@/components/park-logos-marquee";
import { FeaturedPark } from "@/components/featured-park";
import { EventsSection } from "@/components/events-section";
import { FAQSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ParkLogosMarquee />
        <FeaturedPark />
        <EventsSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}
