// Tailwind class fragments per topic category. Extracted from app/page.tsx so
// the related-topics preview cards on story pages can share the same accent
// vocabulary as the landing-list view — every category keeps one consistent
// visual identity across the site.

import type { TopicCategory } from "./topics";

// Foreground accent + a soft border tint, used on the small badge/swatch.
export const CATEGORY_ACCENT: Record<TopicCategory, string> = {
  logic: "text-signal-violet border-signal-violet/40",
  computation: "text-signal-cyan border-signal-cyan/40",
  chaos: "text-signal-rose border-signal-rose/40",
  geometry: "text-signal-amber border-signal-amber/40",
  analysis: "text-signal-amber border-signal-amber/40",
  paradox: "text-signal-rose border-signal-rose/40",
};

// Subtle background gradient — same palette as the landing list-card.
export const CATEGORY_BG: Record<TopicCategory, string> = {
  logic: "from-signal-violet/15 via-transparent to-transparent",
  computation: "from-signal-cyan/15 via-transparent to-transparent",
  chaos: "from-signal-rose/15 via-transparent to-transparent",
  geometry: "from-signal-amber/15 via-transparent to-transparent",
  analysis: "from-signal-amber/12 via-transparent to-transparent",
  paradox: "from-signal-rose/12 via-transparent to-transparent",
};

// Hover-border accent: the related-topic card tightens its outline to the
// neighbour's own category colour on hover/focus, so the user gets a tiny
// preview of "what kind of room is on the other side of this link".
export const CATEGORY_HOVER_BORDER: Record<TopicCategory, string> = {
  logic: "hover:border-signal-violet/60 focus-visible:border-signal-violet/60",
  computation: "hover:border-signal-cyan/60 focus-visible:border-signal-cyan/60",
  chaos: "hover:border-signal-rose/60 focus-visible:border-signal-rose/60",
  geometry: "hover:border-signal-amber/60 focus-visible:border-signal-amber/60",
  analysis: "hover:border-signal-amber/60 focus-visible:border-signal-amber/60",
  paradox: "hover:border-signal-rose/60 focus-visible:border-signal-rose/60",
};

// Solid swatch colour (a tiny dot in the card corner). Stays consistent across
// the six categories without needing a gradient or border tint.
export const CATEGORY_SWATCH: Record<TopicCategory, string> = {
  logic: "bg-signal-violet",
  computation: "bg-signal-cyan",
  chaos: "bg-signal-rose",
  geometry: "bg-signal-amber",
  analysis: "bg-signal-amber",
  paradox: "bg-signal-rose",
};
