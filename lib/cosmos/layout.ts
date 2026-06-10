// Per-category cluster layout. v5 ditched the hash-seeded ring positions
// of v4 in favour of *hand-curated* coordinates so each constellation
// reads as a recognisable shape — lemniscate, glider, butterfly,
// pentagram, sine wave, single bright star. The shapes carry the
// category's meaning (paradox = ∞, computation = Conway glider, etc.).
//
// SSR-safe: positions are integer coords so Node and V8 produce
// bit-identical transform strings (sin/cos can differ by 1 ulp).

import { TOPICS, type Topic, type TopicCategory, type TopicId } from "@/lib/topics";
import { isHub } from "@/lib/topicHubs";
import { palette } from "@/lib/visual/palette";

export interface ClusterFrame {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

// Per-scene viewBox: each constellation scene gets its own 1000×600 sky so
// the cluster fills it.
export const SCENE_VB_W = 1000;
export const SCENE_VB_H = 600;

// User feedback (v4): geometry + analysis both used the same amber, chaos
// + paradox both rose. v5 keeps the four "signal" hues anchored to one
// category each and adds coral + teal so every category owns one hue.
export const CATEGORY_COLOR: Record<TopicCategory, string> = {
  logic: palette.signal.violet,
  computation: palette.signal.cyan,
  chaos: palette.signal.coral,
  geometry: palette.signal.amber,
  analysis: palette.signal.teal,
  paradox: palette.signal.rose,
};

export const CATEGORY_RGB: Record<TopicCategory, string> = {
  logic: "179 136 255",
  computation: "125 243 255",
  chaos: "255 138 92",
  geometry: "255 209 102",
  analysis: "123 224 192",
  paradox: "255 122 182",
};

// Order in which scenes appear during the scroll. Picked so the user
// travels from foundations (paradox, logic) through machine-like
// clusters (computation, chaos) into the visual ones (geometry,
// analysis) — a gentle drift from abstract toward concrete.
export const SCENE_ORDER: TopicCategory[] = [
  "paradox",
  "logic",
  "computation",
  "chaos",
  "geometry",
  "analysis",
];

// Stable FNV-1a hash. Still exported because the Specimen uses it for
// jitter on its decorative paths; the constellation itself no longer
// relies on it.
export function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

export interface LaidOutTopic {
  topic: Topic;
  x: number;
  y: number;
  isHub: boolean;
}

interface CuratedEntry {
  x: number;
  y: number;
  isHub?: boolean;
}

// ── Hand-curated constellation shapes ────────────────────────────────
// All coordinates are in scene-local SVG units (SCENE_VB_W × SCENE_VB_H).
// The cluster centre sits around (500, 372); the title hovers above ~y=180.
// Hubs are listed in topicHubs.ts; the `isHub: true` here is a redundant
// note (validated at module load — see below) so future readers can see
// the shape clearly without cross-referencing.
const CURATED: Record<TopicCategory, Record<string, CuratedEntry>> = {
  // PARADOX — lemniscate ∞. The two loops of the figure-eight are
  // centred on godel and banach; cantor sits at the crossing point
  // (where the two diagonal arguments collide). The other two trace
  // the outer curves.
  paradox: {
    godel: { x: 320, y: 372, isHub: true },
    cantor: { x: 500, y: 372 },
    banach: { x: 680, y: 372, isHub: true },
    hilberthotel: { x: 410, y: 285 },
    gabrielshorn: { x: 590, y: 459 },
  },

  // LOGIC — NAND, the universal gate, with SAT (the canonical
  // NP-complete consequence) sitting to its right. Two stars holding
  // hands across a horizontal axis.
  logic: {
    nand: { x: 380, y: 372, isHub: true },
    sat: { x: 620, y: 372 },
  },

  // COMPUTATION — Conway's glider pentomino. Five lit cells form the
  // famous "spaceship":
  //     . ⬛ .
  //     . . ⬛
  //     ⬛ ⬛ ⬛
  // Four satellites trail along the glider's flight path (upper-left
  // to lower-right): the path of state the glider came from.
  computation: {
    life: { x: 500, y: 230, isHub: true }, // top cell
    iota: { x: 600, y: 330 }, // middle-right cell
    rule110: { x: 400, y: 430 }, // bottom-left cell
    wang: { x: 500, y: 430 }, // bottom-middle cell
    halting: { x: 600, y: 430, isHub: true }, // bottom-right cell
    pvsnp: { x: 320, y: 290 }, // trail 1
    rsa: { x: 240, y: 380 }, // trail 2
    boids: { x: 180, y: 480 }, // trail 3
    langton: { x: 740, y: 250 }, // leading cell
  },

  // CHAOS — Lorenz butterfly: two ellipsoidal wings sharing an axis.
  // Mandelbrot anchors the left wing; lorenz the right. The other
  // eight topics sit at the four corners of each wing (upper-far,
  // upper-inner, lower-inner, lower-far) so the silhouette reads as
  // two ovals.
  chaos: {
    mandelbrot: { x: 320, y: 372, isHub: true },
    lorenz: { x: 680, y: 372, isHub: true },
    logistic: { x: 200, y: 290 }, // upper-left far
    collatz: { x: 200, y: 454 }, // lower-left far
    doublependulum: { x: 420, y: 290 }, // upper-left inner
    bzr: { x: 420, y: 454 }, // lower-left inner
    dla: { x: 580, y: 290 }, // upper-right inner
    magpendulum: { x: 580, y: 454 }, // lower-right inner
    aizawa: { x: 800, y: 290 }, // upper-right far
    diffusion: { x: 800, y: 454 }, // lower-right far
  },

  // GEOMETRY — pentagram (5-pointed star) plus the inner pentagon
  // formed by the star's intersections. Penrose tops the star;
  // sierpinski sits at the lower-left arm. The inner pentagon vertices
  // hold the more abstract geometry topics (phi, etc.).
  geometry: {
    penrose: { x: 500, y: 192, isHub: true }, // outer top
    apollonian: { x: 671, y: 316 }, // outer right
    chaosgame: { x: 606, y: 532 }, // outer bottom-right
    sierpinski: { x: 394, y: 532, isHub: true }, // outer bottom-left
    mobius: { x: 329, y: 316 }, // outer left
    phi: { x: 550, y: 308 }, // inner upper-right
    lsystem: { x: 575, y: 398 }, // inner right
    cardioid: { x: 500, y: 442 }, // inner bottom
    eulerchar: { x: 425, y: 398 }, // inner left
    pascalmod: { x: 450, y: 308 }, // inner upper-left
  },

  // ANALYSIS — sine wave across the sky. fourier sits at the first
  // crest (the wave's natural anchor); riemann holds the centre, near
  // the "critical line" his hypothesis is about. The other ten
  // points trace two full cycles from edge to edge.
  analysis: {
    euler: { x: 80, y: 372 },
    fourier: { x: 160, y: 470, isHub: true },
    turingpattern: { x: 240, y: 430 },
    buffon: { x: 320, y: 340 },
    sternbrocot: { x: 400, y: 290 },
    ulam: { x: 480, y: 315 },
    riemann: { x: 560, y: 380, isHub: true },
    galton: { x: 640, y: 460 },
    konigsberg: { x: 720, y: 410 },
    fourcolor: { x: 790, y: 330 },
    smallworld: { x: 860, y: 290 },
    backprop: { x: 920, y: 372 },
  },
};

// Validate at module load: every topic in TOPICS has a curated entry
// in its category, and every curated id references a real topic. Same
// pattern as topicHubs.ts — catches drift the moment we add or rename a
// topic instead of letting a star vanish silently.
(function validateCurated() {
  const seenIds = new Set<string>();
  for (const t of TOPICS) {
    const entry = CURATED[t.category][t.id];
    if (!entry) {
      throw new Error(
        `lib/cosmos/layout: no curated position for topic ${t.id} (${t.category})`,
      );
    }
    seenIds.add(t.id);
  }
  for (const cat of SCENE_ORDER) {
    for (const id of Object.keys(CURATED[cat])) {
      if (!seenIds.has(id)) {
        throw new Error(
          `lib/cosmos/layout: curated entry ${id} in ${cat} is not a real topic`,
        );
      }
    }
  }
})();

// Layout for one category in the local SCENE_VB_W × SCENE_VB_H sky.
// Reads from CURATED; falls back to topicHubs.isHub() when the curated
// entry doesn't explicitly mark hub status.
export function layoutScene(category: TopicCategory): LaidOutTopic[] {
  const map = CURATED[category];
  return TOPICS.filter((t) => t.category === category).map((t) => {
    const entry = map[t.id]!;
    return {
      topic: t,
      x: entry.x,
      y: entry.y,
      isHub: entry.isHub ?? isHub(t.id),
    };
  });
}

// Pre-computed at module load — six clusters × ~8 topics each is tiny
// work, and avoiding a per-render layout pass means scrolling stays buttery.
export const SCENE_LAYOUTS: Record<TopicCategory, LaidOutTopic[]> = {
  logic: layoutScene("logic"),
  computation: layoutScene("computation"),
  chaos: layoutScene("chaos"),
  geometry: layoutScene("geometry"),
  analysis: layoutScene("analysis"),
  paradox: layoutScene("paradox"),
};

// Quick lookup: where (in scene-local coords) does a given topic sit?
export const SCENE_POSITION: Map<TopicId, { x: number; y: number }> = (() => {
  const m = new Map<TopicId, { x: number; y: number }>();
  for (const cat of SCENE_ORDER) {
    for (const l of SCENE_LAYOUTS[cat]) {
      m.set(l.topic.id, { x: l.x, y: l.y });
    }
  }
  return m;
})();

// Quadratic Bezier with perpendicular bend — gives intersecting edges
// visible curvature so the eye can disentangle them. Used by the
// constellation scene renderer.
function snap(n: number): number {
  return Math.round(n * 1000) / 1000;
}
export function edgePath(
  A: { x: number; y: number },
  B: { x: number; y: number },
  seed: string,
  intensity = 0.05,
): string {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const side = hash(seed) > 0.5 ? 1 : -1;
  const bend = intensity * len * side;
  const mx = (A.x + B.x) / 2 + px * bend;
  const my = (A.y + B.y) / 2 + py * bend;
  return `M ${snap(A.x)} ${snap(A.y)} Q ${snap(mx)} ${snap(my)} ${snap(B.x)} ${snap(B.y)}`;
}
