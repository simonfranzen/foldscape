// Map generation, adjacency and the colouring search for the four-colour
// explorer, kept free of React and the DOM so they can be unit-tested.

export type PresetId = "voronoi30" | "voronoi60" | "count48" | "count16" | "count54" | "stress";

export interface Preset {
  id: PresetId;
  n: number;
  relax: number;
}

// Every preset is a random Voronoi map. The three "count" presets borrow
// nothing but a familiar number of regions (contiguous US states, German
// states, UN member states in Africa); the repo has no real border data, so
// their labels must not name a country or continent as if it were drawn.
export const PRESETS: Preset[] = [
  { id: "voronoi30", n: 30, relax: 2 },
  { id: "voronoi60", n: 60, relax: 2 },
  { id: "count48", n: 48, relax: 3 },
  { id: "count16", n: 16, relax: 4 },
  { id: "count54", n: 54, relax: 3 },
  { id: "stress", n: 12, relax: 0 },
];

export interface MapData {
  width: number;
  height: number;
  n: number;
  seeds: Array<{ x: number; y: number }>;
  // Per-pixel cell index, length = width * height
  labels: Int16Array;
  // adjacency[i] = sorted list of cell indices adjacent to i
  adjacency: number[][];
  edges: number;
  maxDegree: number;
}

export interface ColouringStep {
  cell: number;
  colour: number; // -1 = uncolour (backtrack), 0..3 = assign
}

// Deterministic PRNG so a given seed reproduces the same map.
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickSeedsRandom(n: number, w: number, h: number, rand: () => number) {
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: rand() * w, y: rand() * h });
  }
  return pts;
}

// For the "stress test" preset: place N seeds in a tight cluster of small
// regions surrounded by a few large outer regions, so the adjacency graph
// is genuinely dense and the backtracker has to work.
export function pickSeedsStress(n: number, w: number, h: number, rand: () => number) {
  const pts: Array<{ x: number; y: number }> = [];
  const cx = w / 2;
  const cy = h / 2;
  // 6 inner cells very close together (will share many borders)
  for (let i = 0; i < Math.min(6, n); i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * 40, y: cy + Math.sin(a) * 40 });
  }
  // Surrounding cells
  for (let i = pts.length; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.min(w, h) * (0.32 + rand() * 0.18);
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

// Assign every pixel to its nearest seed.
export function rasteriseVoronoi(
  seeds: Array<{ x: number; y: number }>,
  w: number,
  h: number,
  stride: number,
): Int16Array {
  const labels = new Int16Array(w * h);
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < seeds.length; i++) {
        const dx = x - seeds[i].x;
        const dy = y - seeds[i].y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      // Fill the stride block to keep the per-pixel pass below cheap.
      for (let yy = y; yy < Math.min(y + stride, h); yy++) {
        for (let xx = x; xx < Math.min(x + stride, w); xx++) {
          labels[yy * w + xx] = best;
        }
      }
    }
  }
  return labels;
}

// One Lloyd-relaxation step: move each seed to the centroid of its cell.
export function relaxSeeds(
  seeds: Array<{ x: number; y: number }>,
  labels: Int16Array,
  w: number,
  h: number,
) {
  const n = seeds.length;
  const sx = new Float64Array(n);
  const sy = new Float64Array(n);
  const ct = new Uint32Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = labels[y * w + x];
      sx[i] += x;
      sy[i] += y;
      ct[i]++;
    }
  }
  const next: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < n; i++) {
    if (ct[i] === 0) {
      next.push(seeds[i]);
    } else {
      next.push({ x: sx[i] / ct[i], y: sy[i] / ct[i] });
    }
  }
  return next;
}

// Two regions count as neighbours only if they share a stretch of border, not
// a single corner. On a pixel grid a point where several cells meet shows up
// as one or two stray pixel pairs between cells that are not really side by
// side (the six wedges of the stress test all meet in the centre pixel), and
// the four colour theorem does not apply to corner contact at all: it would
// let any number of regions be mutually adjacent.
export const MIN_SHARED_BORDER = 3;

export function buildAdjacency(labels: Int16Array, w: number, h: number, n: number) {
  // shared[a * n + b] with a < b: number of horizontally or vertically
  // neighbouring pixel pairs that straddle the border between a and b.
  const shared = new Map<number, number>();
  const count = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? a * n + b : b * n + a;
    shared.set(key, (shared.get(key) ?? 0) + 1);
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = labels[y * w + x];
      if (x < w - 1) count(a, labels[y * w + x + 1]);
      if (y < h - 1) count(a, labels[(y + 1) * w + x]);
    }
  }
  const lists: number[][] = Array.from({ length: n }, () => []);
  let edges = 0;
  for (const [key, pairs] of shared) {
    if (pairs < MIN_SHARED_BORDER) continue;
    const a = Math.floor(key / n);
    const b = key % n;
    lists[a].push(b);
    lists[b].push(a);
    edges++;
  }
  const adjacency = lists.map((list) => list.sort((a, b) => a - b));
  let maxDegree = 0;
  for (const list of adjacency) {
    if (list.length > maxDegree) maxDegree = list.length;
  }
  return { adjacency, edges, maxDegree };
}

export function buildMap(preset: Preset, seed: number, width: number, height: number): MapData {
  const rand = mulberry32(seed);
  let seeds =
    preset.id === "stress"
      ? pickSeedsStress(preset.n, width, height, rand)
      : pickSeedsRandom(preset.n, width, height, rand);
  // Coarse rasterise for relaxation (fast), then a fine pass at the end.
  let labels = rasteriseVoronoi(seeds, width, height, 4);
  for (let r = 0; r < preset.relax; r++) {
    seeds = relaxSeeds(seeds, labels, width, height);
    labels = rasteriseVoronoi(seeds, width, height, 4);
  }
  labels = rasteriseVoronoi(seeds, width, height, 1);
  const { adjacency, edges, maxDegree } = buildAdjacency(labels, width, height, seeds.length);
  return {
    width,
    height,
    n: seeds.length,
    seeds,
    labels,
    adjacency,
    edges,
    maxDegree,
  };
}

// Backtracking 4-colourer with most-constrained-variable heuristic.
// Returns the sequence of assign/unassign steps so the UI can animate.
export function solveFourColouring(adj: number[][]): {
  steps: ColouringStep[];
  solution: number[] | null;
  backtracks: number;
} {
  const n = adj.length;
  const colours = new Int8Array(n).fill(-1);
  const steps: ColouringStep[] = [];
  let backtracks = 0;
  // Hard cap to keep the UI safe on adversarial graphs (shouldn't trigger
  // for any planar graph but we guard anyway).
  const STEP_CAP = 200000;

  function pickNext(): number {
    let best = -1;
    let bestRemaining = 5;
    let bestDegree = -1;
    for (let i = 0; i < n; i++) {
      if (colours[i] !== -1) continue;
      const used = new Set<number>();
      for (const j of adj[i]) {
        if (colours[j] !== -1) used.add(colours[j]);
      }
      const remaining = 4 - used.size;
      if (
        remaining < bestRemaining ||
        (remaining === bestRemaining && adj[i].length > bestDegree)
      ) {
        bestRemaining = remaining;
        bestDegree = adj[i].length;
        best = i;
      }
    }
    return best;
  }

  function recurse(): boolean {
    if (steps.length > STEP_CAP) return false;
    const i = pickNext();
    if (i === -1) return true;
    const used = new Set<number>();
    for (const j of adj[i]) {
      if (colours[j] !== -1) used.add(colours[j]);
    }
    for (let c = 0; c < 4; c++) {
      if (used.has(c)) continue;
      colours[i] = c;
      steps.push({ cell: i, colour: c });
      if (recurse()) return true;
      // backtrack
      colours[i] = -1;
      steps.push({ cell: i, colour: -1 });
      backtracks++;
    }
    return false;
  }

  const ok = recurse();
  return {
    steps,
    solution: ok ? Array.from(colours) : null,
    backtracks,
  };
}
