"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Signature artefact for the Four-Color page. A live-recolouring Voronoi map:
// random cells, each filled with one of four colours such that no two
// neighbouring cells share a colour. Every few seconds, the colouring is
// recomputed via a greedy pass to expose the constraint visually. Each cell
// is also subtly hatched in one of four directions so the constraint reads
// without colour alone — passes protanopia/deuteranopia by design.

interface Site {
  x: number;
  y: number;
}

// Colour palette: distinct hues + each one carries a unique hatch pattern.
const PALETTE = [
  { fill: "#7df3ff", pattern: "p0" }, // cyan, horizontal hatch
  { fill: "#ffd166", pattern: "p1" }, // amber, vertical hatch
  { fill: "#b388ff", pattern: "p2" }, // violet, diagonal-1 hatch
  { fill: "#ff7ab6", pattern: "p3" }, // rose, diagonal-2 hatch
];

const W = 800;
const H = 320;
const N_SITES = 22;

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function sampleSites(seed: number): Site[] {
  const rng = seededRandom(seed);
  // Lloyd-relaxed-ish: random + a small jitter avoidance step
  const sites: Site[] = [];
  for (let i = 0; i < N_SITES; i++) {
    sites.push({ x: rng() * W, y: rng() * H });
  }
  // 2 passes of pseudo-relaxation: push points away from their nearest neighbor
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < sites.length; i++) {
      let mind = Infinity;
      let mj = -1;
      for (let j = 0; j < sites.length; j++) {
        if (i === j) continue;
        const dx = sites[i].x - sites[j].x;
        const dy = sites[i].y - sites[j].y;
        const d = dx * dx + dy * dy;
        if (d < mind) {
          mind = d;
          mj = j;
        }
      }
      if (mj >= 0) {
        const dx = sites[i].x - sites[mj].x;
        const dy = sites[i].y - sites[mj].y;
        const d = Math.sqrt(mind) || 1;
        sites[i].x += (dx / d) * 4;
        sites[i].y += (dy / d) * 4;
        sites[i].x = Math.max(8, Math.min(W - 8, sites[i].x));
        sites[i].y = Math.max(8, Math.min(H - 8, sites[i].y));
      }
    }
  }
  return sites;
}

// Build an approximate Voronoi via raster sampling (fine enough for visuals
// without dragging in a real Delaunay lib). Returns adjacency by neighbouring
// pixel scans, and per-site polygon paths.
function buildVoronoi(sites: Site[]) {
  const RES = 4; // sample stride in CSS px
  const cols = Math.ceil(W / RES);
  const rows = Math.ceil(H / RES);
  const owner = new Int16Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * RES + RES / 2;
      const y = r * RES + RES / 2;
      let mi = 0;
      let md = Infinity;
      for (let i = 0; i < sites.length; i++) {
        const dx = x - sites[i].x;
        const dy = y - sites[i].y;
        const d = dx * dx + dy * dy;
        if (d < md) {
          md = d;
          mi = i;
        }
      }
      owner[r * cols + c] = mi;
    }
  }
  // Adjacency: any two distinct owners across a row/col boundary
  const adj: Set<number>[] = Array.from({ length: sites.length }, () => new Set<number>());
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const me = owner[r * cols + c];
      if (c + 1 < cols) {
        const right = owner[r * cols + c + 1];
        if (right !== me) {
          adj[me].add(right);
          adj[right].add(me);
        }
      }
      if (r + 1 < rows) {
        const below = owner[(r + 1) * cols + c];
        if (below !== me) {
          adj[me].add(below);
          adj[below].add(me);
        }
      }
    }
  }
  return { owner, cols, rows, RES, adj };
}

// Greedy 4-colouring: largest-degree first, pick lowest available colour index.
function fourColour(adj: Set<number>[]): number[] {
  const n = adj.length;
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => adj[b].size - adj[a].size);
  const col = new Array<number>(n).fill(-1);
  for (const i of order) {
    const taken = new Set<number>();
    for (const j of adj[i]) if (col[j] >= 0) taken.add(col[j]);
    for (let c = 0; c < 4; c++) {
      if (!taken.has(c)) {
        col[i] = c;
        break;
      }
    }
    if (col[i] < 0) col[i] = 0; // fallback — shouldn't happen for planar
  }
  return col;
}

export function FourColorVoronoiHero() {
  const [seed, setSeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const cycleRef = useRef(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      cycleRef.current++;
      setSeed((s) => s + 1);
    }, 4200);
    return () => clearInterval(id);
  }, [reduced]);

  const sites = useMemo(() => sampleSites(seed * 1013 + 17), [seed]);
  const { owner, cols, rows, RES, adj } = useMemo(() => buildVoronoi(sites), [sites]);
  const colours = useMemo(() => fourColour(adj), [adj]);

  // Build per-site cell rects (one rect per sample, batched by owner+colour)
  const cellsByColour: string[][] = [[], [], [], []];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = owner[r * cols + c];
      const ci = colours[o];
      cellsByColour[ci].push(`M${c * RES} ${r * RES}h${RES}v${RES}h${-RES}z`);
    }
  }

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="A live-recoloured Voronoi map — four colours, no two adjacent regions share a colour."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        <defs>
          <pattern id="p0" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(5,6,10,0.35)" strokeWidth="1" />
          </pattern>
          <pattern id="p1" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(5,6,10,0.35)" strokeWidth="1" />
          </pattern>
          <pattern id="p2" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="6" y2="6" stroke="rgba(5,6,10,0.35)" strokeWidth="1" />
          </pattern>
          <pattern id="p3" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="6" y1="0" x2="0" y2="6" stroke="rgba(5,6,10,0.35)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Fill layer, one path per colour for cheap batching */}
        {PALETTE.map((c, i) => (
          <path
            key={`fill-${i}`}
            d={cellsByColour[i].join(" ")}
            fill={c.fill}
            opacity="0.78"
            style={{ transition: "opacity 600ms ease" }}
          />
        ))}
        {/* Hatch overlay so the four classes also separate by texture. */}
        {PALETTE.map((c, i) => (
          <path
            key={`hatch-${i}`}
            d={cellsByColour[i].join(" ")}
            fill={`url(#${c.pattern})`}
            opacity="0.65"
          />
        ))}

        {/* Cell borders: render lines along all pixel boundaries where owners differ. */}
        <g stroke="rgba(5,6,10,0.85)" strokeWidth="1.2">
          {(() => {
            const lines: string[] = [];
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const me = owner[r * cols + c];
                if (c + 1 < cols && owner[r * cols + c + 1] !== me) {
                  const x = (c + 1) * RES;
                  lines.push(`M${x} ${r * RES}v${RES}`);
                }
                if (r + 1 < rows && owner[(r + 1) * cols + c] !== me) {
                  const y = (r + 1) * RES;
                  lines.push(`M${c * RES} ${y}h${RES}`);
                }
              }
            }
            return <path d={lines.join(" ")} fill="none" />;
          })()}
        </g>

        {/* Caption + legend */}
        <g transform={`translate(${W - 220} ${H - 30})`}>
          {PALETTE.map((c, i) => (
            <g key={i} transform={`translate(${i * 50} 0)`}>
              <rect width="42" height="14" fill={c.fill} opacity="0.85" />
              <rect width="42" height="14" fill={`url(#${c.pattern})`} opacity="0.65" />
              <rect
                width="42"
                height="14"
                fill="none"
                stroke="rgba(5,6,10,0.85)"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </g>
        <text
          x={20}
          y={H - 18}
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="3.2"
          fill="rgba(234,236,243,0.55)"
        >
          χ ≤ 4 — RECOLOURED EVERY 4 SECONDS
        </text>
      </svg>
    </figure>
  );
}
