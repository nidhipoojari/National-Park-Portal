export type Event = {
  id: string;
  title: string;
  park: string;
  date: string;
  tag: string;
  image: string;
};

export const EVENTS: Event[] = [
  {
    id: "e1",
    title: "Skyline Sunrise Hike",
    park: "Shenandoah National Park",
    date: "Sat, Jun 6",
    tag: "Guided",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "e2",
    title: "Patapsco River Tubing",
    park: "Patapsco Valley State Park",
    date: "Sun, Jun 14",
    tag: "Family",
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "e3",
    title: "Pagoda Jazz Night",
    park: "Patterson Park",
    date: "Fri, Jun 20",
    tag: "Concert",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "e4",
    title: "Mather Gorge Kayak Clinic",
    park: "Great Falls Park",
    date: "Sat, Jun 28",
    tag: "Workshop",
    image:
      "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1400&q=80",
  },
];
