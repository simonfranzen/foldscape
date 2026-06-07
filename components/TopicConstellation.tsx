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
// Bigger per-category footprints so non-hub stars have room to breathe when
// the cluster is expanded — earlier the labels crowded into each other and
// crossed edges. The two rows are also vertically staggered (top row cy
// 250/300/270, bottom 650/680/640) so hubs don't all line up on one
// horizontal axis.
const CATEGORY_FRAME: Record<TopicCategory, ClusterFrame> = {
  logic: { cx: 280, cy: 250, rx: 260, ry: 230 },
  computation: { cx: 900, cy: 300, rx: 320, ry: 230 },
  chaos: { cx: 1520, cy: 270, rx: 300, ry: 240 },
  geometry: { cx: 300, cy: 680, rx: 300, ry: 240 },
  analysis: { cx: 920, cy: 640, rx: 320, ry: 220 },
  paradox: { cx: 1500, cy: 690, rx: 280, ry: 230 },
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

// Snap coords to 3 decimal places so SSR (Node) and CSR (browser) produce
// bit-identical `transform="translate(x y)"` strings. Math.sin/cos can differ
// by 1 ulp across V8 platforms and that's enough to trip Next's hydration
// mismatch detector. 0.001 px is invisible; the snap eliminates the wobble.
function snap(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function snapLayout(items: LaidOutTopic[]): LaidOutTopic[] {
  return items.map((i) => ({ topic: i.topic, x: snap(i.x), y: snap(i.y) }));
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
  return snapLayout(out);
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

// Default "home" viewBox — the full sky.
const HOME_VB: ViewBox = [0, 0, VB_W, VB_H];

// Camera frame: extra padding (user-units, same coordinate space as the
// constellation layout) added around the bbox of an opened cluster so
// labels at the edge of the cluster aren't clipped by the viewport.
// Bigger padding = gentler zoom. 80 zoomed in too hard and crowded labels;
// 240 leaves the opened cluster occupying ~60% of the canvas with room
// around it for the other clusters to be partially visible (orientation cue).
const CAMERA_PADDING = 240;

// Ease-out cubic via the cheap polynomial t*(2-t). Smooth at t=0, decelerating
// to 0 derivative at t=1 — feels like a camera settling, not a teleport.
function easeOutCubic(t: number): number {
  return t * (2 - t);
}

type ViewBox = [number, number, number, number];

// Compute the bbox of an opened cluster's laid-out stars, expanded by
// CAMERA_PADDING on all sides. Returns the HOME viewBox when the category
// has no positioned topics (defensive — every category has hubs).
function bboxForCategory(
  cat: TopicCategory,
  laidOut: LaidOutTopic[],
): ViewBox {
  const inCat = laidOut.filter((l) => l.topic.category === cat);
  if (inCat.length === 0) return HOME_VB;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of inCat) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  // Pad horizontally to the cluster frame so the zoomed view doesn't crop
  // too tightly against star labels at the edge of the cluster.
  const f = CATEGORY_FRAME[cat];
  minX = Math.min(minX, f.cx - 150);
  maxX = Math.max(maxX, f.cx + 150);

  const x = minX - CAMERA_PADDING;
  const y = minY - CAMERA_PADDING;
  const w = maxX - minX + CAMERA_PADDING * 2;
  const h = maxY - minY + CAMERA_PADDING * 2;

  // Preserve the home aspect ratio so the SVG (which has no
  // preserveAspectRatio override → defaults to xMidYMid meet) doesn't
  // letterbox surprisingly. Expand the shorter axis to match.
  const homeAspect = VB_W / VB_H;
  const boxAspect = w / h;
  let outW = w;
  let outH = h;
  let outX = x;
  let outY = y;
  if (boxAspect > homeAspect) {
    // Wider than home — grow height.
    outH = w / homeAspect;
    outY = y - (outH - h) / 2;
  } else {
    // Taller than home — grow width.
    outW = h * homeAspect;
    outX = x - (outW - w) / 2;
  }
  return [outX, outY, outW, outH];
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
  const [viewBox, setViewBox] = useState<ViewBox>(HOME_VB);
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tweenRef = useRef<number | null>(null);

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

  // Camera tween. When openCategory changes, animate viewBox from current
  // state to the bbox of the opened cluster (or HOME if null). rAF-driven,
  // ~600ms ease-out cubic. prefers-reduced-motion snaps instantly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target: ViewBox = openCategory
      ? bboxForCategory(openCategory, laidOut)
      : HOME_VB;

    if (tweenRef.current !== null) {
      cancelAnimationFrame(tweenRef.current);
      tweenRef.current = null;
    }

    if (reduceMotion) {
      setViewBox(target);
      return;
    }

    // Capture the start frame so we always tween from where the camera is
    // right now (handles rapid category switches mid-flight).
    let start: ViewBox = HOME_VB;
    setViewBox((cur) => {
      start = cur;
      return cur;
    });

    // Skip the rAF loop if we're already at the target (within 0.5 px).
    const close =
      Math.abs(start[0] - target[0]) < 0.5 &&
      Math.abs(start[1] - target[1]) < 0.5 &&
      Math.abs(start[2] - target[2]) < 0.5 &&
      Math.abs(start[3] - target[3]) < 0.5;
    if (close) return;

    const duration = 600;
    const t0 = performance.now();
    const step = (now: number) => {
      const u = Math.min(1, (now - t0) / duration);
      const e = easeOutCubic(u);
      const next: ViewBox = [
        start[0] + (target[0] - start[0]) * e,
        start[1] + (target[1] - start[1]) * e,
        start[2] + (target[2] - start[2]) * e,
        start[3] + (target[3] - start[3]) * e,
      ];
      setViewBox(next);
      if (u < 1) {
        tweenRef.current = requestAnimationFrame(step);
      } else {
        tweenRef.current = null;
      }
    };
    tweenRef.current = requestAnimationFrame(step);
    return () => {
      if (tweenRef.current !== null) {
        cancelAnimationFrame(tweenRef.current);
        tweenRef.current = null;
      }
    };
  }, [openCategory, laidOut, reduceMotion]);

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
      </div>

      {/* DOM-layer category headers. These used to live inside the SVG and
          would clip out of view whenever the camera zoomed into a single
          cluster. Now they're plain HTML pills above the canvas — constant
          size, always visible, never clipped. */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 pb-3"
        data-atlas-keep-open="true"
        role="group"
        aria-label={a.landing.constellationCategoryHint ?? "Open the cluster"}
      >
        {CATEGORY_ORDER.map((cat) => {
          const label =
            (a.landing[
              `category${cat[0].toUpperCase()}${cat.slice(1)}` as keyof typeof a.landing
            ] as string) || cat;
          const color = CATEGORY_COLOR[cat];
          const isOpen = openCategory === cat;
          const mutedByFilter = filter !== "all" && filter !== cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory((c) => (c === cat ? null : c))}
              onFocus={() => setHoveredCategory(cat)}
              onBlur={() => setHoveredCategory((c) => (c === cat ? null : c))}
              aria-pressed={isOpen}
              aria-expanded={isOpen}
              className="hairline inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/40 hover:text-ink-100"
              style={{
                background: isOpen ? `${color}1f` : undefined,
                borderColor: isOpen ? `${color}80` : undefined,
                color: isOpen ? color : undefined,
                opacity: mutedByFilter ? 0.4 : 1,
              }}
            >
              <span
                aria-hidden="true"
                className="inline-block rounded-full"
                style={{ width: 8, height: 8, background: color }}
              />
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {/* Always-visible "back to overview" pill. Lives in the DOM layer
            (outside the SVG) so it stays the same size and screen position
            no matter how far the camera zooms. Only shown when a cluster is
            actually open — otherwise it'd be a no-op. */}
        {openCategory && (
          <button
            type="button"
            onClick={() => setOpenCategory(null)}
            className="hairline absolute right-4 top-3 z-10 rounded-full border bg-ink-950/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet backdrop-blur transition-colors hover:border-signal-violet/60 hover:text-ink-100"
            style={{ borderColor: "rgba(179, 136, 255, 0.5)" }}
            data-atlas-keep-open="true"
          >
            {a.landing.constellationCloseZoom ?? "↺ Back to atlas"}
          </button>
        )}

        <svg
          ref={svgRef}
          viewBox={`${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`}
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

        {/* Category headers used to live inside this SVG. They've moved to
            a DOM-layer row above the canvas (see the constellation wrapper)
            so they stay constant-size and constant-position no matter how
            the camera zooms into an opened cluster. What remains here is a
            faint hover-preview ellipse, driven by hoveredCategory — it
            shows where a closed cluster would expand if opened. */}
        <g aria-hidden="true">
          {hoveredCategory && openCategory !== hoveredCategory && (
            <ellipse
              cx={CATEGORY_FRAME[hoveredCategory].cx}
              cy={CATEGORY_FRAME[hoveredCategory].cy}
              rx={CATEGORY_FRAME[hoveredCategory].rx * 0.92}
              ry={CATEGORY_FRAME[hoveredCategory].ry * 0.92}
              fill="none"
              stroke={CATEGORY_COLOR[hoveredCategory]}
              strokeOpacity={0.18}
              strokeDasharray="4 8"
              strokeWidth={1}
              style={{ transition: trans("opacity") }}
            />
          )}
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
            //   - hubs are always rendered, big + labelled.
            //   - non-hubs always render as faint "ghost" dots so users can
            //     SEE that there are more topics than the 12 hubs (this hint
            //     of-more is the whole point — earlier the canvas pretended
            //     non-hubs didn't exist). They grow + reveal their label on
            //     hover/focus/spot/expand/search-match.
            const dimByFilter = filteredOut;
            const dimByOpen =
              openCategory !== null && topic.category !== openCategory && hub && !inHubSpot;
            const dimBySearch = q.length > 0 && !isSearchMatch;
            const dimBySpotlight = hubSpotlight.size > 0 && !inHubSpot && hub ? true : false;
            const dimmed = dimByFilter || dimByOpen || dimBySearch || dimBySpotlight;

            // A non-hub is "active" when its category is open, it's spotlit
            // by a hub neighbour, the user hovers it directly, or search has
            // matched it. Otherwise it stays in ghost mode.
            const nonHubActive = catExpanded || inHubSpot || isHover || isSearchMatch;

            const r = isHover ? 12 : hub ? 10 : nonHubActive ? 6.5 : 2.2;

            const showLabel = hub || nonHubActive;

            const labelSize = isHover ? 26 : hub ? 24 : 19;
            const labelOpacity = dimmed ? 0.22 : isHover ? 1 : hub ? 0.95 : 0.88;

            // Ghost non-hubs sit at ~22% opacity so they read as "more is
            // here" rather than "missing". When activated they jump to 1.
            const ghostFloor = hub ? 1 : 0.22;
            const groupOpacity = dimmed
              ? 0.32
              : nonHubActive || hub
                ? 1
                : ghostFloor;

            return (
              <g
                key={topic.id}
                transform={`translate(${x} ${y})`}
                style={{
                  color,
                  opacity: groupOpacity,
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
                    onMouseEnter={() => setHovered(topic.id)}
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
      </div>

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
