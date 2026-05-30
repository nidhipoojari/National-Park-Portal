import type { ClassNames } from "react-day-picker";

// Centralized react-day-picker v10 class map (UI-enum keys).
// Selection state classes target the inner day_button via the [&>button] variant,
// since v10 renders each day cell as <td.day><button.day_button/></td>.
export const dayPickerClassNames: Partial<ClassNames> = {
  months: "relative",
  month: "w-full",
  month_caption: "flex justify-center items-center h-10",
  caption_label: "font-display text-lg",
  nav: "absolute inset-x-0 top-0 flex justify-between items-center h-10 px-1",
  button_previous:
    "h-8 w-8 rounded-full hover:bg-primary/20 inline-flex items-center justify-center",
  button_next:
    "h-8 w-8 rounded-full hover:bg-primary/20 inline-flex items-center justify-center",
  chevron: "h-4 w-4 fill-foreground/70",
  month_grid: "w-full border-collapse mt-1",
  weekdays: "",
  weekday:
    "text-[10px] uppercase tracking-widest text-foreground/40 font-normal pb-2",
  week: "",
  day: "p-0.5 text-center",
  day_button:
    "h-9 w-9 rounded-full text-sm hover:bg-primary/20 transition-colors inline-flex items-center justify-center",
  selected:
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
  range_start:
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:rounded-l-full",
  range_end:
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:rounded-r-full",
  range_middle:
    "[&>button]:bg-primary/20 [&>button]:text-foreground [&>button]:rounded-none",
  today: "[&>button]:ring-1 [&>button]:ring-accent",
  outside: "[&>button]:text-foreground/30",
  disabled: "[&>button]:opacity-40",
};
