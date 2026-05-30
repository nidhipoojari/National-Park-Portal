export type Park = {
  id: number;
  name: string;
  shortName: string;
  state: "MD" | "VA";
  city: string;
  description: string;
  highlights: string[];
  entrancePrice: number;
  campsitePrice: number;
  tourPrice: number;
  parkingPrice: number;
  image: string;
};

// Seeded from PL/SQL Deliverable 4 — Group 1 (IS 620, Spring 2026)
export const PARKS: Park[] = [
  {
    id: 100,
    name: "Patapsco Valley State Park",
    shortName: "Patapsco Valley",
    state: "MD",
    city: "Ellicott City, MD",
    description:
      "32 miles of the Patapsco River cutting through rolling forests, historic mills, and the iconic Thomas Viaduct.",
    highlights: ["River tubing", "Swinging bridge", "Mountain biking"],
    entrancePrice: 30,
    campsitePrice: 45,
    tourPrice: 65,
    parkingPrice: 10,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 101,
    name: "Shenandoah National Park",
    shortName: "Shenandoah",
    state: "VA",
    city: "Luray, VA",
    description:
      "200,000 acres of Blue Ridge mountain wilderness. Wildflower meadows, waterfalls, and 105 miles of Skyline Drive.",
    highlights: ["Skyline Drive", "Old Rag summit", "Black bear sightings"],
    entrancePrice: 40,
    campsitePrice: 55,
    tourPrice: 85,
    parkingPrice: 25,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 102,
    name: "Great Falls Park",
    shortName: "Great Falls",
    state: "VA",
    city: "McLean, VA",
    description:
      "The Potomac roars over jagged cliffs into Mather Gorge — a thundering escape minutes from the capital.",
    highlights: ["Overlook trails", "Whitewater kayaking", "Civil War ruins"],
    entrancePrice: 35,
    campsitePrice: 50,
    tourPrice: 75,
    parkingPrice: 20,
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 103,
    name: "Centennial Park",
    shortName: "Centennial",
    state: "MD",
    city: "Ellicott City, MD",
    description:
      "A 50-acre lake ringed by paved trails, picnic pavilions, and one of Maryland's quietest sunrise spots.",
    highlights: ["Lakeside loop", "Paddle boats", "Family pavilions"],
    entrancePrice: 30,
    campsitePrice: 40,
    tourPrice: 65,
    parkingPrice: 10,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 104,
    name: "Patterson Park",
    shortName: "Patterson",
    state: "MD",
    city: "Baltimore, MD",
    description:
      "Baltimore's 137-acre 'best backyard' — pagoda views, ice rink, boat lake, and weekend festivals all year.",
    highlights: ["Pagoda overlook", "Boat lake", "Outdoor concerts"],
    entrancePrice: 30,
    campsitePrice: 40,
    tourPrice: 65,
    parkingPrice: 10,
    image:
      "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=1600&q=80",
  },
];

export const FEATURED_PARK = PARKS[1]; // Shenandoah

// Lookup static presentation metadata (image, description, highlights) by park id.
// Used to enrich the live API rows (which only carry name/address/state/zip).
export function getParkMeta(id: number): Park | undefined {
  return PARKS.find((p) => p.id === id);
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80";

export function parkImage(id: number): string {
  return getParkMeta(id)?.image ?? FALLBACK_IMAGE;
}
