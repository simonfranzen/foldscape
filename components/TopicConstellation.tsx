"use client";

// Atlas as constellation, v3.
//
// v1 was overload (every topic always labelled).
// v2 added progressive disclosure but still rendered every non-hub as a tiny
// dim dot at all times, so the canvas kept reading as cluttered fog.
// v3 commits to the constellation metaphor: real constellations have a few
// named bright stars. By default we only render those.
//
// Default sky:
//   - 12 hub topics (2 per category × 6) as large, comfortably-labelled stars.
//   - 6 category headers as clearly clickable, focusable labels.
//   - Hub-to-hub bridge + family edges, that's it. No mini dots, no echoes.
//
// Interaction:
//   - Click a category header → that category "opens": its non-hub stars fade
//     in around the cluster centre with readable labels. Other categories'
//     hubs stay visible but dim out to keep orientation.
//   - Hover a category → no expand; we show faint placeholder rings where the
//     non-hubs would appear, so users know there's something to discover.
//   - Re-click the open category (or Esc, or click outside, or the close
//     button) → collapse.
//   - Hub hover/focus → neighbour spotlight; clicking a hub navigates.
//   - Search expands every category that has a match; non-matches dim hard.
//   - filter prop (from app/page.tsx) auto-opens the matching cluster.
//
// Public API unchanged: <TopicConstellation filter={filter} />.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS, type Topic, type TopicCategory, type TopicId } from "@/lib/topics";
import { TOPIC_EDGES, TOPIC_NEIGHBORS } from "@/lib/topicEdges";
import { isHub } from "@/lib/topicHubs";

// Wider canvas than v2 so labels can breathe.
const VB_W = 1800;
const VB_H = 1000;

// Each category gets a cluster centre + an expanded footprint (where its
// non-hub stars sit when the cluster is open). The bottom-row cy values used
// to be ~750, which put the bottom category headers (cy + ry + 44 → y≈994)
// flush against the viewBox edge. Bottom row is now ~620, leaving ~160 px of
// breathing room below the headers — the empty middle band between rows is
// still wide enough to read as deliberate negative space.
interface ClusterFrame {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
const CATEGORY_FRAME: Record<TopicCategory, ClusterFrame> = {
  logic: { cx: 300, cy: 290, rx: 200, ry: 180 },
  computation: { cx: 900, cy: 270, rx: 260, ry: 180 },
  chaos: { cx: 1500, cy: 300, rx: 240, ry: 200 },
  geometry: { cx: 320, cy: 650, rx: 240, ry: 180 },
  analysis: { cx: 920, cy: 660, rx: 260, ry: 160 },
  paradox: { cx: 1490, cy: 640, rx: 220, ry: 180 },
};

const CATEGORY_COLOR: Record<TopicCategory, string> = {
  logic: "#b388ff",
  computation: "#7df3ff",
  chaos: "#ff7ab6",
  geometry: "#ffd166",
  analysis: "#ffd166",
  paradox: "#ff7ab6",
};

const CATEGORY_ORDER: TopicCategory[] = [
  "logic",
  "computation",
  "chaos",
  "geometry",
  "analysis",
  "paradox",
];

// Stable hash for any per-topic jitter we need to keep deterministic.
function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

interface LaidOutTopic {
  topic: Topic;
  x: number;
  y: number;
}

// Hub placement: two hubs per category, sat to either side of the cluster
// centre on the cluster's wide axis. This gives a "binary star" feel at every
// anchor, with plenty of room between them for labels.
function layoutHubs(hubs: Topic[], frame: ClusterFrame): LaidOutTopic[] {
  const sorted = [...hubs].sort((a, b) => a.id.localeCompare(b.id));
  const out: LaidOutTopic[] = [];
  const n = sorted.length;
  if (n === 0) return out;
  if (n === 1) {
    out.push({ topic: sorted[0], x: frame.cx, y: frame.cy });
    return out;
  }
  // Two (or more) hubs: place along the long axis of the cluster frame.
  const horizontal = frame.rx >= frame.ry;
  sorted.forEach((t, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const off = (u - 0.5) * 2; // -1 .. +1
    if (horizontal) {
      out.push({
        topic: t,
        x: frame.cx + off * frame.rx * 0.55,
        y: frame.cy + (hash(t.id) - 0.5) * 18,
      });
    } else {
      out.push({
        topic: t,
        x: frame.cx + (hash(t.id) - 0.5) * 18,
        y: frame.cy + off * frame.ry * 0.55,
      });
    }
  });
  return out;
}

// Non-hub stars are arranged on a ring around the cluster centre, with the
// ring sized so labels never collide. Order is stable (sorted by id) so the
// same star always lands in the same slot. We skip the section of the ring
// that's nearest the hubs to avoid overlap.
function layoutNonHubs(nonHubs: Topic[], frame: ClusterFrame): LaidOutTopic[] {
  const sorted = [...nonHubs].sort((a, b) => a.id.localeCompare(b.id));
  const n = sorted.length;
  const out: LaidOutTopic[] = [];
  if (n === 0) return out;
  // Spread non-hubs on an arc that occupies ~80% of a circle, leaving a gap
  // along the long axis so the cluster's bright hubs aren't crowded.
  const start = Math.PI * 0.15;
  const sweep = Math.PI * 1.7;
  const horizontal = frame.rx >= frame.ry;
  sorted.forEach((t, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const a = start + u * sweep + (horizontal ? Math.PI / 2 : 0);
    const r = 0.92;
    const jit = (hash(t.id) - 0.5) * 14;
    out.push({
      topic: t,
      x: frame.cx + Math.cos(a) * frame.rx * r + jit,
      y: frame.cy + Math.sin(a) * frame.ry * r + jit,
    });
  });
  return out;
}

function layoutAll(): LaidOutTopic[] {
  const byCat: Record<TopicCategory, Topic[]> = {
    logic: [],
    computation: [],
    chaos: [],
    geometry: [],
    analysis: [],
    paradox: [],
  };
  TOPICS.forEach((t) => byCat[t.category].push(t));
  const out: LaidOutTopic[] = [];
  CATEGORY_ORDER.forEach((cat) => {
    const hubs = byCat[cat].filter((t) => isHub(t.id));
    const nonHubs = byCat[cat].filter((t) => !isHub(t.id));
    const frame = CATEGORY_FRAME[cat];
    out.push(...layoutHubs(hubs, frame));
    out.push(...layoutNonHubs(nonHubs, frame));
  });
  return out;
}

// Gentle quadratic bezier so two crossing edges stay distinguishable. We bend
// perpendicular to the chord with a stable side based on a hash.
function edgePath(
  A: { x: number; y: number },
  B: { x: number; y: number },
  sameCluster: boolean,
  seed: string,
): string {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const side = hash(seed) > 0.5 ? 1 : -1;
  const bend = (sameCluster ? 0.05 : 0.15) * len * side;
  const mx = (A.x + B.x) / 2 + px * bend;
  const my = (A.y + B.y) / 2 + py * bend;
  return `M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`;
}

interface Props {
  filter: TopicCategory | "all";
}

export function TopicConstellation({ filter }: Props) {
  const { a } = useI18n();
  const searchId = useId();
  const [hovered, setHovered] = useState<TopicId | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<TopicCategory | null>(null);
  const [openCategory, setOpenCategory] = useState<TopicCategory | null>(null);
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Auto-open the cluster that matches the page filter, so filter chips and
  // the constellation stay in sync. Switching to "all" closes any open one.
  useEffect(() => {
    if (filter === "all") {
      setOpenCategory(null);
    } else {
      setOpenCategory(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Esc closes the open cluster (when not focused in the search input).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openCategory) setOpenCategory(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCategory]);

  const trans = (props: string) => (reduceMotion ? undefined : `${props} 280ms ease`);

  const laidOut = useMemo(() => layoutAll(), []);
  const posById = useMemo(() => {
    const m = new Map<TopicId, LaidOutTopic>();
    laidOut.forEach((l) => m.set(l.topic.id, l));
    return m;
  }, [laidOut]);

  // Search: case-insensitive match across id, title, tagline, formula.
  const q = query.trim().toLowerCase();
  const searchMatches = useMemo<Set<TopicId>>(() => {
    if (!q) return new Set();
    const out = new Set<TopicId>();
    for (const t of TOPICS) {
      const meta = a.topics[t.id];
      const hay = `${t.id} ${meta.title} ${meta.tagline} ${t.formula ?? ""}`.toLowerCase();
      if (hay.includes(q)) out.add(t.id);
    }
    return out;
  }, [q, a.topics]);

  // Which categories should render their non-hub stars right now?
  //   - the explicitly opened one
  //   - any category that contains a search match
  const expandedCategories = useMemo<Set<TopicCategory>>(() => {
    const s = new Set<TopicCategory>();
    if (openCategory) s.add(openCategory);
    if (q) {
      for (const id of searchMatches) {
        const p = posById.get(id);
        if (p) s.add(p.topic.category);
      }
    }
    return s;
  }, [openCategory, q, searchMatches, posById]);

  // Hub neighbour spotlight (only kicks in when a hub is hovered).
  const hubSpotlight = useMemo<Set<TopicId>>(() => {
    if (!hovered) return new Set();
    const s = new Set<TopicId>([hovered]);
    (TOPIC_NEIGHBORS[hovered] ?? []).forEach((id) => s.add(id));
    return s;
  }, [hovered]);

  const _spotlightActive = q.length > 0 || hubSpotlight.size > 0;

  const isFilteredOut = useCallback(
    (id: TopicId) => {
      if (filter === "all") return false;
      return posById.get(id)?.topic.category !== filter;
    },
    [filter, posById],
  );

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q) return;
    const first = TOPICS.find((t) => searchMatches.has(t.id));
    if (first) router.push(first.href);
  };

  // Click-outside the SVG (but not on the search input) closes the cluster.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!openCategory) return;
    const onDocClick = (e: MouseEvent) => {
      if (!svgRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!svgRef.current.contains(e.target)) {
        // The search input lives outside the SVG; don't treat focusing it as
        // a close gesture.
        const target = e.target as HTMLElement;
        if (target.closest?.(`[data-atlas-keep-open="true"]`)) return;
        setOpenCategory(null);
      }
    };
    window.addEventListener("mousedown", onDocClick);
    return () => window.removeEventListener("mousedown", onDocClick);
  }, [openCategory]);

  const hint =
    a.landing.constellationHint ??
    "Click a category to open it. Hover a star to see its relatives.";
  const ariaLabel = a.landing.constellationAriaLabel ?? "Atlas constellation of topics";

  if (isMobile) {
    return (
      <MobileList query={query} setQuery={setQuery} filter={filter} searchMatches={searchMatches} />
    );
  }

  // Toggle/open helper used by category headers.
  const toggleCategory = (cat: TopicCategory) => {
    setOpenCategory((cur) => (cur === cat ? null : cat));
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4" data-atlas-keep-open="true">
        <form onSubmit={onSearchSubmit} className="max-w-md flex-1">
          <label htmlFor={searchId} className="sr-only">
            {a.landing.constellationSearchLabel ?? "Search the atlas"}
          </label>
          <div className="relative">
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                a.landing.constellationSearchPlaceholder ?? "Search topics, formulas, ideas…"
              }
              className="hairline w-full rounded-full border bg-ink-950/60 px-4 py-2 pr-10 font-mono text-[11px] uppercase tracking-widest2 text-ink-100 placeholder:text-ink-400 focus:border-signal-violet/60 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
              aria-describedby={`${searchId}-hint`}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest2 text-ink-400"
            >
              {q ? `${searchMatches.size}` : "⌕"}
            </div>
          </div>
        </form>
        <p
          id={`${searchId}-hint`}
          className="hidden max-w-sm text-[11px] leading-snug text-ink-400 md:block"
        >
          {hint}
        </p>
        {openCategory && (
          <button
            type="button"
            onClick={() => setOpenCategory(null)}
            className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/40 hover:text-ink-100"
            data-atlas-keep-open="true"
          >
            {a.landing.constellationClose ?? "Close"}
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block h-auto w-full select-none"
        role="group"
        aria-label={ariaLabel}
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Category headers — large clickable cues. Hovering previews the
            cluster footprint as a faint ring; clicking opens. */}
        <g>
          {CATEGORY_ORDER.map((cat) => {
            const f = CATEGORY_FRAME[cat];
            const label =
              (a.landing[
                `category${cat[0].toUpperCase()}${cat.slice(1)}` as keyof typeof a.landing
              ] as string) || cat;
            const color = CATEGORY_COLOR[cat];
            const isOpen = openCategory === cat;
            const isHoveredCat = hoveredCategory === cat;
            const dimByOtherOpen = openCategory !== null && !isOpen;
            const mutedByFilter = filter !== "all" && filter !== cat;
            const opacity = mutedByFilter
              ? 0.22
              : isOpen
                ? 1
                : isHoveredCat
                  ? 0.95
                  : dimByOtherOpen
                    ? 0.4
                    : 0.75;

            // Header above the cluster for the top row, below for the bottom.
            const above = f.cy < VB_H / 2;
            const labelY = above ? f.cy - f.ry - 36 : f.cy + f.ry + 44;
            return (
              <g
                key={cat}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory((c) => (c === cat ? null : c))}
                onFocus={() => setHoveredCategory(cat)}
                onBlur={() => setHoveredCategory((c) => (c === cat ? null : c))}
                onClick={() => toggleCategory(cat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCategory(cat);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isOpen}
                aria-expanded={isOpen}
                aria-label={`${label} — ${
                  isOpen
                    ? (a.landing.constellationClose ?? "Close")
                    : (a.landing.constellationCategoryHint ?? "Open the cluster")
                }`}
                className="cursor-pointer focus:outline-none"
                style={{ outline: "none" }}
              >
                {/* Hit + focus region. Larger than the text so keyboard focus
                    is comfortably visible. */}
                <rect
                  x={f.cx - 140}
                  y={labelY - 22}
                  width={280}
                  height={40}
                  rx={20}
                  fill={isOpen ? `${color}1f` : "transparent"}
                  stroke={isHoveredCat || isOpen ? `${color}80` : "transparent"}
                  strokeWidth={1}
                  style={{ transition: trans("fill, stroke") }}
                />
                <text
                  x={f.cx}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="16"
                  letterSpacing="4.2"
                  fill={color}
                  opacity={opacity}
                  style={{
                    textTransform: "uppercase",
                    transition: trans("opacity"),
                  }}
                >
                  {label}
                </text>
                {/* Tiny caret hint of openable state */}
                <text
                  x={f.cx + 110}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="14"
                  fill={color}
                  opacity={opacity * 0.7}
                  style={{ transition: trans("opacity") }}
                >
                  {isOpen ? "×" : "+"}
                </text>

                {/* Hover preview: faint placeholder ring where non-hubs would
                    appear. Suppressed once the cluster is open (the real
                    stars are there). */}
                {isHoveredCat && !isOpen && (
                  <ellipse
                    cx={f.cx}
                    cy={f.cy}
                    rx={f.rx * 0.92}
                    ry={f.ry * 0.92}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.18}
                    strokeDasharray="4 8"
                    strokeWidth={1}
                    style={{ transition: trans("opacity") }}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Edges. By default we render only hub-to-hub bridge + family edges,
            so the canvas reads as a deliberate sky. When a hub is spotlit or
            a category is open, the relevant edges raise to full opacity. */}
        <g aria-hidden="true" fill="none" strokeLinecap="round">
          {TOPIC_EDGES.map((e, i) => {
            const A = posById.get(e.a);
            const B = posById.get(e.b);
            if (!A || !B) return null;
            const sameCluster = A.topic.category === B.topic.category;
            const aHub = isHub(e.a);
            const bHub = isHub(e.b);
            const bothHubs = aHub && bHub;

            const inHubSpot =
              hubSpotlight.size > 0 && hubSpotlight.has(e.a) && hubSpotlight.has(e.b);
            const inCategoryOpen =
              expandedCategories.has(A.topic.category) &&
              expandedCategories.has(B.topic.category) &&
              sameCluster;

            // Default-visible edges: hub-to-hub bridge & family edges, drawn
            // softly. Echo edges and any non-hub edges stay invisible by
            // default and only appear under hover/expand.
            const defaultVisible = bothHubs && (e.kind === "bridge" || e.kind === "family");

            const visible = defaultVisible || inHubSpot || inCategoryOpen;
            if (!visible) return null;

            const highlighted = inHubSpot || inCategoryOpen;
            // Even "highlighted" edges stay clearly under the labels — earlier
            // values (0.92 / 1.8) drowned the italic serif text when a cluster
            // was open. With labels above + a dark stroke halo around them,
            // edges no longer need to fight for attention; they just need to
            // be visible.
            const stroke = highlighted
              ? "rgba(234,236,243,0.45)"
              : e.kind === "bridge"
                ? "rgba(234,236,243,0.28)"
                : "rgba(234,236,243,0.18)";
            const width = highlighted ? 1.1 : 0.85;
            const opacity = highlighted ? 0.85 : 0.55;

            return (
              <path
                key={i}
                d={edgePath(A, B, sameCluster, `${e.a}-${e.b}`)}
                stroke={stroke}
                strokeWidth={width}
                opacity={opacity}
                style={{ transition: trans("opacity") }}
              />
            );
          })}
        </g>

        {/* Stars */}
        <g>
          {laidOut.map(({ topic, x, y }) => {
            const meta = a.topics[topic.id];
            const color = CATEGORY_COLOR[topic.category];
            const hub = isHub(topic.id);
            const filteredOut = isFilteredOut(topic.id);
            const catExpanded = expandedCategories.has(topic.category);
            const isHover = hovered === topic.id;
            const inHubSpot = hubSpotlight.has(topic.id);
            const isSearchMatch = q.length > 0 && searchMatches.has(topic.id);

            // Visibility rules:
            //   - hubs are always rendered.
            //   - non-hubs render only when their category is expanded.
            //   - a hovered hub's non-hub neighbours also light up.
            const shouldRender = hub || catExpanded || inHubSpot;

            if (!shouldRender) return null;

            // Dimming layers:
            //   - filter chip dims non-matching topics.
            //   - when a cluster is open, hubs of OTHER categories dim out so
            //     attention lands on the open cluster.
            //   - search dims everything except matches.
            const dimByFilter = filteredOut;
            const dimByOpen =
              openCategory !== null && topic.category !== openCategory && hub && !inHubSpot;
            const dimBySearch = q.length > 0 && !isSearchMatch;
            const dimBySpotlight = hubSpotlight.size > 0 && !inHubSpot && hub ? true : false;
            const dimmed = dimByFilter || dimByOpen || dimBySearch || dimBySpotlight;

            // Sizes — hubs feel like bright stars; non-hubs are still real
            // stars when their cluster is open, not crumbs.
            const r = isHover ? 12 : hub ? 10 : 6.5;

            // Labels. Hubs always labelled, big. Non-hubs labelled when their
            // cluster is open (or they're spotlit/search-matched).
            const showLabel = hub || (catExpanded && !hub) || inHubSpot || isSearchMatch;

            const labelSize = isHover ? 26 : hub ? 24 : 19;
            const labelOpacity = dimmed ? 0.22 : isHover ? 1 : hub ? 0.95 : 0.88;

            const groupOpacity = dimmed ? 0.32 : 1;

            // Non-hub fade-in animation tied to category expansion.
            const enterOpacity = catExpanded || hub || inHubSpot || isSearchMatch ? 1 : 0;

            return (
              <g
                key={topic.id}
                transform={`translate(${x} ${y})`}
                style={{
                  color,
                  opacity: groupOpacity * enterOpacity,
                  transition: trans("opacity, transform"),
                }}
              >
                {(isHover || inHubSpot) && (
                  <circle
                    r={isHover ? 42 : 26}
                    fill="url(#nodeGlow)"
                    opacity={isHover ? 0.95 : 0.7}
                    aria-hidden="true"
                  />
                )}
                <Link href={topic.href} className="focus:outline-none">
                  <g
                    role="link"
                    aria-label={`${meta.title} — ${meta.tagline}`}
                    tabIndex={0}
                    onMouseEnter={() => hub && setHovered(topic.id)}
                    onMouseLeave={() => setHovered((h) => (h === topic.id ? null : h))}
                    onFocus={() => setHovered(topic.id)}
                    onBlur={() => setHovered((h) => (h === topic.id ? null : h))}
                    className="cursor-pointer"
                  >
                    {/* Hit target. Large enough to forgive precise mousing. */}
                    <rect x="-90" y="-22" width="180" height="60" fill="transparent" />
                    <circle
                      r={r}
                      fill={color}
                      filter="url(#softGlow)"
                      style={{ transition: trans("r") }}
                    />
                    {isHover && (
                      <circle r={r + 6} fill="none" stroke={color} strokeOpacity={0.55} />
                    )}
                    {showLabel && (
                      <text
                        y={r + 24}
                        textAnchor="middle"
                        fontFamily="var(--font-serif)"
                        fontStyle="italic"
                        fontSize={labelSize}
                        fill="#eaecf3"
                        opacity={labelOpacity}
                        // paint-order draws the stroke BEHIND the fill, so a
                        // wide ink-coloured stroke acts as a knockout halo:
                        // any edge passing under the label is masked by the
                        // halo before the glyph fill paints. This is what
                        // makes labels readable in the spotlight view even
                        // when bridges run through them.
                        stroke="#05060a"
                        strokeWidth={4}
                        strokeLinejoin="round"
                        style={{
                          transition: trans("opacity"),
                          paintOrder: "stroke fill",
                        }}
                      >
                        {meta.title}
                      </text>
                    )}
                    {isHover && (
                      <text
                        y={r + 44}
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize="11"
                        letterSpacing="3"
                        fill={color}
                        opacity={0.85}
                        style={{ textTransform: "uppercase" }}
                      >
                        {topic.id}
                      </text>
                    )}
                  </g>
                </Link>
              </g>
            );
          })}
        </g>
      </svg>

      <HoverPanel hoveredId={hovered} />
    </div>
  );
}

function HoverPanel({ hoveredId }: { hoveredId: TopicId | null }) {
  const { a } = useI18n();
  if (!hoveredId) return null;
  const topic = TOPICS.find((t) => t.id === hoveredId);
  if (!topic) return null;
  const meta = a.topics[topic.id];
  const color = CATEGORY_COLOR[topic.category];
  const categoryLabel =
    (a.landing[
      `category${topic.category[0].toUpperCase()}${topic.category.slice(1)}` as keyof typeof a.landing
    ] as string) || topic.category;
  return (
    <div
      className="hairline glass pointer-events-none absolute bottom-3 left-1/2 w-[90%] max-w-[28rem] -translate-x-1/2 space-y-2 rounded-2xl border p-4 text-center md:bottom-6 md:p-5"
      aria-live="polite"
    >
      <div className="font-mono text-[10px] uppercase tracking-widest2" style={{ color }}>
        {categoryLabel}
      </div>
      <div className="math-italic text-xl leading-tight text-ink-100 md:text-2xl">{meta.title}</div>
      <div className="text-sm leading-snug text-ink-200">{meta.tagline}</div>
      {topic.formula && (
        <div className="hairline inline-block rounded-md border bg-ink-950/40 px-2 py-1 font-mono text-[11px] text-ink-300">
          {topic.formula}
        </div>
      )}
    </div>
  );
}

// Mobile: full SVG would be unreadable at 46 nodes on a 360px screen, so we
// render an honest compact card list with the same search affordance. The
// outer page also has a list view; this one is scoped to the wrapper so the
// component remains a drop-in.
function MobileList({
  query,
  setQuery,
  filter,
  searchMatches,
}: {
  query: string;
  setQuery: (v: string) => void;
  filter: TopicCategory | "all";
  searchMatches: Set<TopicId>;
}) {
  const { a } = useI18n();
  const q = query.trim().toLowerCase();
  const visible = TOPICS.filter((t) => {
    if (filter !== "all" && t.category !== filter) return false;
    if (q && !searchMatches.has(t.id)) return false;
    return true;
  });
  return (
    <div className="space-y-4 p-4">
      <label className="block">
        <span className="sr-only">{a.landing.constellationSearchLabel ?? "Search the atlas"}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            a.landing.constellationSearchPlaceholder ?? "Search topics, formulas, ideas…"
          }
          className="hairline w-full rounded-full border bg-ink-950/60 px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-100 placeholder:text-ink-400 focus:border-signal-violet/60 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <ul className="grid grid-cols-1 gap-2">
        {visible.map((t) => {
          const meta = a.topics[t.id];
          const color = CATEGORY_COLOR[t.category];
          return (
            <li key={t.id}>
              <Link
                href={t.href}
                className="hairline flex items-start gap-3 rounded-xl border bg-ink-950/40 p-3 active:bg-ink-900/60"
              >
                <span
                  className="mt-1 inline-block rounded-full"
                  style={{ width: 10, height: 10, background: color }}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  <span className="math-italic block text-base leading-tight text-ink-100">
                    {meta.title}
                  </span>
                  <span className="block text-xs leading-snug text-ink-300">{meta.tagline}</span>
                </span>
              </Link>
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="py-6 text-center text-sm text-ink-400">
            {a.landing.constellationEmpty ?? "Nothing matches."}
          </li>
        )}
      </ul>
    </div>
  );
}
