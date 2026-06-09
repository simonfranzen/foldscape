// Hash-seeded cluster layout — extracted from the v4 TopicConstellation so the
// new cosmos can lay out the same six clusters with the same deterministic
// star positions. SSR-safe: positions snap to 3-decimal coords so Node and V8
// produce bit-identical transform strings (sin/cos can differ by 1 ulp).

import { TOPICS, type Topic, type TopicCategory, type TopicId } from "@/lib/topics";
import { isHub } from "@/lib/topicHubs";

export interface ClusterFrame {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

// Per-scene viewBox: each constellation scene gets its own 1000×600 sky so
// the cluster fills it. The numbers here are *relative to that local sky*,
// not the old global 1800×1000 atlas.
export const SCENE_VB_W = 1000;
export const SCENE_VB_H = 600;

// Each category's local frame. Centred horizontally; pushed *down* so the
// category title above has room to breathe (the v3 cluster sat dead-centre
// and the title text overlapped the topmost stars on wide screens). Wide
// ellipse so the cluster reads "horizontal" — stars distributed left↔right.
const SCENE_FRAME: ClusterFrame = {
  cx: SCENE_VB_W / 2,
  cy: SCENE_VB_H * 0.62,
  rx: 380,
  ry: 180,
};

// User feedback: geometry + analysis both used the same amber (#ffd166)
// so the two categories collapsed visually; chaos + paradox both rose.
// v4 keeps the four "signal" hues anchored to one category each and
// derives the remaining two from neighbouring shades:
//   - logic       violet (signature)
//   - paradox     rose (signature)
//   - chaos       coral — warmer, more orange than paradox's rose
//   - computation cyan (signature)
//   - analysis    teal — cooler than computation's cyan, distinct from amber
//   - geometry    amber (signature)
export const CATEGORY_COLOR: Record<TopicCategory, string> = {
  logic: "#b388ff",
  computation: "#7df3ff",
  chaos: "#ff8a5c",
  geometry: "#ffd166",
  analysis: "#7be0c0",
  paradox: "#ff7ab6",
};

export const CATEGORY_RGB: Record<TopicCategory, string> = {
  logic: "179 136 255",
  computation: "125 243 255",
  chaos: "255 138 92",
  geometry: "255 209 102",
  analysis: "123 224 192",
  paradox: "255 122 182",
};

// Order in which scenes appear during the scroll. Picked so the user travels
// from foundations (paradox, logic) through machine-like clusters
// (computation, chaos) into the visual ones (geometry, analysis) — a gentle
// drift from abstract toward concrete.
export const SCENE_ORDER: TopicCategory[] = [
  "paradox",
  "logic",
  "computation",
  "chaos",
  "geometry",
  "analysis",
];

// Stable FNV-1a hash. Same function as TopicConstellation v4 so any future
// audit can confirm the layouts match.
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

function snap(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function layoutHubs(hubs: Topic[], frame: ClusterFrame): LaidOutTopic[] {
  const sorted = [...hubs].sort((a, b) => a.id.localeCompare(b.id));
  const n = sorted.length;
  if (n === 0) return [];
  if (n === 1) {
    return [{ topic: sorted[0], x: frame.cx, y: frame.cy, isHub: true }];
  }
  const horizontal = frame.rx >= frame.ry;
  return sorted.map((t, i) => {
    const u = i / (n - 1);
    const off = (u - 0.5) * 2;
    if (horizontal) {
      return {
        topic: t,
        x: frame.cx + off * frame.rx * 0.55,
        y: frame.cy + (hash(t.id) - 0.5) * 18,
        isHub: true,
      };
    }
    return {
      topic: t,
      x: frame.cx + (hash(t.id) - 0.5) * 18,
      y: frame.cy + off * frame.ry * 0.55,
      isHub: true,
    };
  });
}

function layoutNonHubs(nonHubs: Topic[], frame: ClusterFrame): LaidOutTopic[] {
  const sorted = [...nonHubs].sort((a, b) => a.id.localeCompare(b.id));
  const n = sorted.length;
  if (n === 0) return [];
  const start = Math.PI * 0.15;
  const sweep = Math.PI * 1.7;
  const horizontal = frame.rx >= frame.ry;
  return sorted.map((t, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const a = start + u * sweep + (horizontal ? Math.PI / 2 : 0);
    const r = 0.92;
    const jit = (hash(t.id) - 0.5) * 14;
    return {
      topic: t,
      x: frame.cx + Math.cos(a) * frame.rx * r + jit,
      y: frame.cy + Math.sin(a) * frame.ry * r + jit,
      isHub: false,
    };
  });
}

// Layout for one category in a local SCENE_VB_W × SCENE_VB_H sky.
export function layoutScene(category: TopicCategory): LaidOutTopic[] {
  const inCat = TOPICS.filter((t) => t.category === category);
  const hubs = inCat.filter((t) => isHub(t.id));
  const nonHubs = inCat.filter((t) => !isHub(t.id));
  const placed = [...layoutHubs(hubs, SCENE_FRAME), ...layoutNonHubs(nonHubs, SCENE_FRAME)];
  return placed.map((p) => ({ ...p, x: snap(p.x), y: snap(p.y) }));
}

// Pre-computed at module load — six clusters × ~8 topics each is tiny work,
// and avoiding a per-render layout pass means scrolling can stay buttery.
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

// Quadratic Bezier with perpendicular bend — same edge style as the v4
// constellation so cross-scene "lines of sight" feel consistent.
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
