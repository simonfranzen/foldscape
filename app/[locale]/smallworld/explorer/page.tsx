"use client";

import Link from "@/components/LocaleLink";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";
import { ExplorerGuideSection, ExplorerHelpButton } from "@/components/ExplorerGuide";
import { SMALLWORLD_GUIDE } from "@/lib/explorer-guides/smallworld";

// --------------------------------------------------------------------------
// Watts-Strogatz explorer. The user tunes N, k, p; we (a) lay the N nodes
// out on a circle and draw edges as chords, (b) compute the average path
// length L (BFS from every node) and clustering coefficient C, (c) plot the
// canonical L(p)/L₀, C(p)/C₀ curve underneath, (d) let the user click two
// nodes to highlight the shortest path between them.
// --------------------------------------------------------------------------

// Node radius scales inversely with N so dense graphs don't overlap.
const NODE_R_SCALE = 220;
const NODE_R_MIN = 2.2;
const NODE_R_MAX = 5;
// Hit-test tolerance for node click selection, in CSS pixels.
const NODE_HIT_PX = 18;

interface Graph {
  N: number;
  k: number;
  // Adjacency as Set<number> per node. Set rather than array for O(1)
  // neighbour-lookup when the path tool wants to check duplicates.
  adj: Array<Set<number>>;
}

// Seeded RNG so a graph is reproducible for a given N, k, p and seed; a press
// of Generate bumps the seed so each click really does shuffle.
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWattsStrogatz(N: number, k: number, p: number, seed: number): Graph {
  const rand = mulberry32(seed);
  const adj: Array<Set<number>> = Array.from({ length: N }, () => new Set<number>());

  // Build the ring lattice first.
  for (let i = 0; i < N; i++) {
    for (let j = 1; j <= k; j++) {
      const nb = (i + j) % N;
      adj[i]!.add(nb);
      adj[nb]!.add(i);
    }
  }

  // Watts-Strogatz rewiring: for each "forward" edge (i, (i+j)%N), with
  // probability p replace its far endpoint with a random node (no self-loops,
  // no duplicates).
  for (let j = 1; j <= k; j++) {
    for (let i = 0; i < N; i++) {
      if (rand() < p) {
        const old = (i + j) % N;
        // Pick a fresh target.
        let tries = 0;
        let t = Math.floor(rand() * N);
        while ((t === i || adj[i]!.has(t)) && tries < 50) {
          t = Math.floor(rand() * N);
          tries++;
        }
        if (t !== i && !adj[i]!.has(t)) {
          adj[i]!.delete(old);
          adj[old]!.delete(i);
          adj[i]!.add(t);
          adj[t]!.add(i);
        }
      }
    }
  }
  return { N, k, adj };
}

// BFS from a single source; returns distances (Infinity for unreachable).
function bfs(g: Graph, src: number): Int32Array {
  const dist = new Int32Array(g.N).fill(-1);
  dist[src] = 0;
  const queue: number[] = [src];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++]!;
    const du = dist[u]!;
    for (const v of g.adj[u]!) {
      if (dist[v] === -1) {
        dist[v] = du + 1;
        queue.push(v);
      }
    }
  }
  return dist;
}

// BFS shortest path between src and dst; returns the node sequence or null.
function bfsPath(g: Graph, src: number, dst: number): number[] | null {
  if (src === dst) return [src];
  const prev = new Int32Array(g.N).fill(-1);
  const seen = new Uint8Array(g.N);
  seen[src] = 1;
  const queue: number[] = [src];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++]!;
    for (const v of g.adj[u]!) {
      if (!seen[v]) {
        seen[v] = 1;
        prev[v] = u;
        if (v === dst) {
          const path: number[] = [dst];
          let cur = dst;
          while (cur !== src) {
            cur = prev[cur]!;
            path.push(cur);
          }
          path.reverse();
          return path;
        }
        queue.push(v);
      }
    }
  }
  return null;
}

// Average shortest path length, ignoring unreachable pairs. Returns Infinity
// if the graph is fully disconnected (shouldn't happen for typical N,k,p).
function averagePathLength(g: Graph): number {
  let total = 0;
  let count = 0;
  for (let i = 0; i < g.N; i++) {
    const d = bfs(g, i);
    for (let j = 0; j < g.N; j++) {
      const dj = d[j]!;
      if (j !== i && dj > 0) {
        total += dj;
        count++;
      }
    }
  }
  return count === 0 ? Infinity : total / count;
}

// Clustering coefficient: average over nodes of (#triangles through v) /
// (deg(v) choose 2). Nodes with degree < 2 contribute 0.
function clusteringCoefficient(g: Graph): number {
  let sum = 0;
  let counted = 0;
  for (let i = 0; i < g.N; i++) {
    const nbrs = Array.from(g.adj[i]!);
    const d = nbrs.length;
    if (d < 2) {
      counted++;
      continue;
    }
    let triangles = 0;
    for (let a = 0; a < nbrs.length; a++) {
      for (let b = a + 1; b < nbrs.length; b++) {
        if (g.adj[nbrs[a]!]!.has(nbrs[b]!)) triangles++;
      }
    }
    const possible = (d * (d - 1)) / 2;
    sum += triangles / possible;
    counted++;
  }
  return counted === 0 ? 0 : sum / counted;
}

function maxDegree(g: Graph): number {
  let m = 0;
  for (let i = 0; i < g.N; i++) {
    if (g.adj[i]!.size > m) m = g.adj[i]!.size;
  }
  return m;
}

// L(p) / L0 and C(p) / C0 curve points. Computed over a few p values only,
// so it stays responsive while the user drags N or k.
interface CurvePoint {
  p: number;
  L: number;
  C: number;
}

function wsCurve(N: number, k: number, seed: number): CurvePoint[] {
  const ps = [0, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0];
  const out: CurvePoint[] = [];
  for (const p of ps) {
    const g = buildWattsStrogatz(N, k, p, seed + Math.round(p * 1e6));
    out.push({ p, L: averagePathLength(g), C: clusteringCoefficient(g) });
  }
  return out;
}

// ─── Localized UI strings ────────────────────────────────────────────────────
// Per repo convention the explorer carries its own RICH_EXPLORER. Only EN and
// DE are filled in; the other locales fall back to EN.

interface ExplorerStrings {
  maxDegShort: string;
  graphAria: string;
  curveLabel: string;
  curveAria: string;
  nLabel: string;
  kLabel: string;
  pLabel: string;
  generate: string;
  statistics: string;
  avgPath: string;
  clustering: string;
  maxDegree: string;
  findPath: string;
  findPathBody: string;
  source: string;
  target: string;
  pathLength: string;
  clearPath: string;
  hintIdle: string;
  // Placeholders: {a} source node, {b} target node, {n} number of hops.
  hintSource: string;
  hintPath: string;
}

const RICH_EXPLORER: { en: ExplorerStrings } & Partial<Record<Locale, ExplorerStrings>> = {
  en: {
    maxDegShort: "max degree",
    graphAria:
      "Watts-Strogatz network drawn on a circle; click two nodes to highlight a shortest path.",
    curveLabel: "L / L₀ and C / C₀ as p sweeps from 0 to 1 (logarithmic x-axis)",
    curveAria: "Normalised path length and clustering coefficient plotted against p.",
    nLabel: "N · number of nodes",
    kLabel: "k · neighbours per side (degree = 2k)",
    pLabel: "p · rewiring probability",
    generate: "Generate (new seed)",
    statistics: "Statistics",
    avgPath: "avg path length L",
    clustering: "clustering C",
    maxDegree: "max degree",
    findPath: "Find shortest path",
    findPathBody:
      "Click any two nodes in the graph. BFS finds the shortest connecting path and highlights it in amber.",
    source: "source",
    target: "target",
    pathLength: "path length",
    clearPath: "Clear path",
    hintIdle: "click any two nodes to find the shortest path",
    hintSource: "source = {a} · click target",
    hintPath: "path {a} → {b} · length {n}",
  },
  de: {
    maxDegShort: "max. Grad",
    graphAria:
      "Watts-Strogatz-Netz auf einem Kreis; klick zwei Knoten an, um einen kürzesten Pfad hervorzuheben.",
    curveLabel: "L / L₀ und C / C₀, während p von 0 bis 1 läuft (logarithmische x-Achse)",
    curveAria: "Normierte Pfadlänge und Clusterkoeffizient, aufgetragen über p.",
    nLabel: "N · Anzahl der Knoten",
    kLabel: "k · Nachbarn pro Seite (Grad = 2k)",
    pLabel: "p · Umverdrahtungswahrscheinlichkeit",
    generate: "Neu erzeugen (neuer Startwert)",
    statistics: "Statistik",
    avgPath: "mittlere Pfadlänge L",
    clustering: "Clusterkoeffizient C",
    maxDegree: "größter Grad",
    findPath: "Kürzesten Pfad finden",
    findPathBody:
      "Klick zwei beliebige Knoten im Graphen an. Eine Breitensuche findet den kürzesten verbindenden Pfad und hebt ihn bernsteinfarben hervor.",
    source: "Start",
    target: "Ziel",
    pathLength: "Pfadlänge",
    clearPath: "Pfad löschen",
    hintIdle: "klick zwei Knoten an, um den kürzesten Pfad zu finden",
    hintSource: "Start = {a} · Ziel anklicken",
    hintPath: "Pfad {a} → {b} · Länge {n}",
  },
};

// Stands in for a value that does not exist yet (no path picked, L₀ = 0).
const EMPTY = "·";

export default function SmallWorldExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.smallworld;
  const ex = RICH_EXPLORER[locale] ?? RICH_EXPLORER.en;

  const [N, setN] = useState(80);
  const [k, setK] = useState(4);
  const [p, setP] = useState(0.1);
  const [seed, setSeed] = useState(1);
  const [pathSrc, setPathSrc] = useState<number | null>(null);
  const [pathDst, setPathDst] = useState<number | null>(null);

  const dpr = useDpr();

  const graph = useMemo(() => buildWattsStrogatz(N, k, p, seed), [N, k, p, seed]);

  // Stats: memoised so they only recompute when the graph changes.
  const stats = useMemo(() => {
    const L = averagePathLength(graph);
    const C = clusteringCoefficient(graph);
    const D = maxDegree(graph);
    return { L, C, D };
  }, [graph]);

  // Reference run at p = 0 (regular lattice) for normalising the curve.
  const reference = useMemo(() => {
    const g0 = buildWattsStrogatz(N, k, 0, seed);
    return { L0: averagePathLength(g0), C0: clusteringCoefficient(g0) };
  }, [N, k, seed]);

  // Watts-Strogatz curve over p ∈ [0, 1], recomputed on N, k, seed change.
  const curve = useMemo(() => wsCurve(N, k, seed), [N, k, seed]);

  // Shortest path between the two clicked nodes.
  const highlightedPath = useMemo(() => {
    if (pathSrc === null || pathDst === null) return null;
    return bfsPath(graph, pathSrc, pathDst);
  }, [graph, pathSrc, pathDst]);

  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const curveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper: ring-layout pixel position for node i, given canvas (W,H).
  const layoutNode = useCallback(
    (i: number, W: number, H: number): { x: number; y: number } => {
      const cx = W / 2;
      const cy = H / 2;
      const radius = Math.min(W, H) * 0.42;
      const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
      return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    },
    [N],
  );

  // Click handler: hit-test against the node positions, register as src/dst.
  const handleGraphClick = useCallback(
    (ev: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = graphCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const W = rect.width;
      const H = rect.height;
      // Find nearest node within a small radius.
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < N; i++) {
        const pos = layoutNode(i, W, H);
        const dx = pos.x - x;
        const dy = pos.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist) {
          bestDist = d2;
          bestIdx = i;
        }
      }
      if (bestIdx === -1) return;
      if (bestDist > NODE_HIT_PX * NODE_HIT_PX) return;
      if (pathSrc === null) {
        setPathSrc(bestIdx);
        setPathDst(null);
      } else if (pathDst === null) {
        setPathDst(bestIdx);
      } else {
        setPathSrc(bestIdx);
        setPathDst(null);
      }
    },
    [N, layoutNode, pathSrc, pathDst],
  );

  // Render the network onto its canvas.
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W === 0 || H === 0) return;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Positions cached per render: cheap, avoids re-trig.
      const positions: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < N; i++) positions.push(layoutNode(i, W, H));

      // Edges. Local (within ring-distance k) edges in soft grey; shortcut
      // edges (longer than k) in cyan so the rewiring is visible.
      const pathEdges = new Set<string>();
      if (highlightedPath && highlightedPath.length > 1) {
        for (let i = 0; i < highlightedPath.length - 1; i++) {
          const a = highlightedPath[i]!;
          const b = highlightedPath[i + 1]!;
          const key = a < b ? `${a}-${b}` : `${b}-${a}`;
          pathEdges.add(key);
        }
      }

      ctx.lineCap = "round";
      // Pass 1: local + shortcut edges.
      for (let i = 0; i < N; i++) {
        for (const j of graph.adj[i]!) {
          if (j <= i) continue; // draw each edge once
          const key = `${i}-${j}`;
          if (pathEdges.has(key)) continue; // drawn highlighted later
          const ringDist = Math.min(Math.abs(i - j), N - Math.abs(i - j));
          const isLocal = ringDist <= k;
          const A = positions[i]!;
          const B = positions[j]!;
          ctx.beginPath();
          ctx.moveTo(A.x, A.y);
          ctx.lineTo(B.x, B.y);
          if (isLocal) {
            ctx.strokeStyle = "rgba(138,144,164,0.32)";
            ctx.lineWidth = 0.8;
          } else {
            ctx.strokeStyle = "rgba(125,243,255,0.55)";
            ctx.lineWidth = 1.0;
          }
          ctx.stroke();
        }
      }

      // Pass 2: highlighted path edges.
      if (pathEdges.size > 0) {
        ctx.strokeStyle = "rgba(255,209,102,0.95)";
        ctx.lineWidth = 2.4;
        for (const key of pathEdges) {
          const [aStr, bStr] = key.split("-");
          const ai = parseInt(aStr!, 10);
          const bi = parseInt(bStr!, 10);
          const A = positions[ai]!;
          const B = positions[bi]!;
          ctx.beginPath();
          ctx.moveTo(A.x, A.y);
          ctx.lineTo(B.x, B.y);
          ctx.stroke();
        }
      }

      // Nodes.
      const nodeR = Math.max(NODE_R_MIN, Math.min(NODE_R_MAX, NODE_R_SCALE / N));
      for (let i = 0; i < N; i++) {
        const pos = positions[i]!;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
        if (i === pathSrc || i === pathDst) {
          ctx.fillStyle = palette.signal.amber;
        } else if (highlightedPath && highlightedPath.includes(i)) {
          ctx.fillStyle = "#ffe7a8";
        } else {
          ctx.fillStyle = palette.signal.cyan;
        }
        ctx.fill();
      }

      // Center label with click instructions.
      ctx.fillStyle = "rgba(138,144,164,0.85)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.textAlign = "center";
      let hint = ex.hintIdle;
      if (pathSrc !== null && pathDst === null)
        hint = ex.hintSource.replace("{a}", String(pathSrc));
      else if (highlightedPath)
        hint = ex.hintPath
          .replace("{a}", String(pathSrc))
          .replace("{b}", String(pathDst))
          .replace("{n}", String(highlightedPath.length - 1));
      ctx.fillText(hint, W / 2, H - 8);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [graph, N, k, dpr, layoutNode, highlightedPath, pathSrc, pathDst, ex]);

  // Render the L/L0, C/C0 curve underneath.
  useEffect(() => {
    const canvas = curveCanvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W === 0 || H === 0) return;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const padX = 36;
      const padY = 14;
      const plotW = W - padX * 2;
      const plotH = H - padY * 2;
      const L0 = reference.L0 || 1;
      const C0 = reference.C0 || 1;

      // X = log10(p) mapped to [pMin, pMax]; treat p=0 as -3.5 (left edge).
      const xOf = (pp: number): number => {
        const lo = -3.5;
        const hi = 0;
        const lp = pp <= 0 ? lo : Math.max(lo, Math.log10(pp));
        return padX + ((lp - lo) / (hi - lo)) * plotW;
      };
      const yOf = (norm: number): number => padY + (1 - Math.max(0, Math.min(1, norm))) * plotH;

      // Axes.
      ctx.strokeStyle = "rgba(138,144,164,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, padY);
      ctx.lineTo(padX, padY + plotH);
      ctx.lineTo(padX + plotW, padY + plotH);
      ctx.stroke();

      // Gridlines at 0.0, 0.5, 1.0.
      ctx.strokeStyle = "rgba(138,144,164,0.12)";
      for (const v of [0.25, 0.5, 0.75, 1.0]) {
        const y = yOf(v);
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(padX + plotW, y);
        ctx.stroke();
      }

      // Axis labels.
      ctx.fillStyle = "rgba(138,144,164,0.8)";
      ctx.font = "9px ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText("1.0", padX - 4, padY + 4);
      ctx.fillText("0.0", padX - 4, padY + plotH + 4);
      ctx.textAlign = "center";
      for (const pp of [0.001, 0.01, 0.1, 1]) {
        ctx.fillText(`${pp}`, xOf(pp), padY + plotH + 12);
      }

      // C/C0 line, magenta-ish.
      ctx.strokeStyle = "rgba(255,122,182,0.9)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      curve.forEach((pt, idx) => {
        const x = xOf(pt.p);
        const y = yOf(pt.C / C0);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // L/L0 line, cyan.
      ctx.strokeStyle = "rgba(125,243,255,0.95)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      curve.forEach((pt, idx) => {
        const x = xOf(pt.p);
        const y = yOf(pt.L / L0);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Vertical marker at current p.
      const xCursor = xOf(p);
      ctx.strokeStyle = "rgba(255,209,102,0.8)";
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(xCursor, padY);
      ctx.lineTo(xCursor, padY + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend.
      ctx.font = "10px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = palette.signal.cyan;
      ctx.fillText("L(p) / L₀", padX + 6, padY + 12);
      ctx.fillStyle = palette.signal.rose;
      ctx.fillText("C(p) / C₀", padX + 6, padY + 24);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [curve, reference, p, dpr]);

  const onGenerate = () => {
    setSeed((s) => (s + 1) >>> 0);
    setPathSrc(null);
    setPathDst(null);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Watts-Strogatz · N = {N} · k = {k} · p = {p.toFixed(3)}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              L = {stats.L.toFixed(2)} · C = {stats.C.toFixed(3)} · {ex.maxDegShort} = {stats.D}
            </div>
          </div>
          <div className="hairline relative flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={graphCanvasRef}
              className="block h-full w-full cursor-crosshair"
              role="img"
              aria-label={ex.graphAria}
              onClick={handleGraphClick}
            />
            <div className="pointer-events-none absolute right-3 top-3">
              <ExplorerHelpButton guide={SMALLWORLD_GUIDE} />
            </div>
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {ex.curveLabel}
          </div>
          <div className="hairline h-44 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={curveCanvasRef}
              className="block h-full w-full"
              role="img"
              aria-label={ex.curveAria}
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.nLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-teal">{N}</span>
            </div>
            <input
              type="range"
              value={N}
              min={20}
              max={200}
              step={1}
              aria-label={ex.nLabel}
              onChange={(e) => {
                setN(parseInt(e.target.value));
                setPathSrc(null);
                setPathDst(null);
              }}
              className="w-full accent-signal-teal"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.kLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-teal">{k}</span>
            </div>
            <input
              type="range"
              value={k}
              min={2}
              max={10}
              step={1}
              aria-label={ex.kLabel}
              onChange={(e) => {
                setK(parseInt(e.target.value));
                setPathSrc(null);
                setPathDst(null);
              }}
              className="w-full accent-signal-teal"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.pLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-teal">{p.toFixed(2)}</span>
            </div>
            <input
              type="range"
              value={p}
              min={0}
              max={1}
              step={0.01}
              aria-label={ex.pLabel}
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full accent-signal-teal"
            />
            <div className="grid grid-cols-4 gap-2">
              {[0, 0.01, 0.1, 1].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setP(preset)}
                  className={`rounded-md border px-2 py-1 font-mono text-[10px] transition-colors ${
                    Math.abs(p - preset) < 0.005
                      ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                      : "hairline text-ink-300 hover:border-signal-teal/40 hover:text-ink-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={onGenerate}
              className="w-full rounded-md border border-signal-teal/60 bg-signal-teal/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/20"
            >
              {ex.generate}
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.statistics}
            </div>
            <dl className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <dt className="text-ink-300">{ex.avgPath}</dt>
                <dd className="text-signal-teal">{stats.L.toFixed(3)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-300">{ex.clustering}</dt>
                <dd className="text-signal-rose">{stats.C.toFixed(3)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-300">L / L₀</dt>
                <dd className="text-ink-100">
                  {reference.L0 ? (stats.L / reference.L0).toFixed(3) : EMPTY}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-300">C / C₀</dt>
                <dd className="text-ink-100">
                  {reference.C0 ? (stats.C / reference.C0).toFixed(3) : EMPTY}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-300">{ex.maxDegree}</dt>
                <dd className="text-ink-100">{stats.D}</dd>
              </div>
            </dl>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {ex.findPath}
            </div>
            <p className="text-xs leading-relaxed text-ink-300">{ex.findPathBody}</p>
            <dl className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <dt className="text-ink-300">{ex.source}</dt>
                <dd className="text-signal-amber">{pathSrc ?? EMPTY}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-300">{ex.target}</dt>
                <dd className="text-signal-amber">{pathDst ?? EMPTY}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-300">{ex.pathLength}</dt>
                <dd className="text-signal-amber">
                  {highlightedPath ? highlightedPath.length - 1 : EMPTY}
                </dd>
              </div>
            </dl>
            <button
              onClick={() => {
                setPathSrc(null);
                setPathDst(null);
              }}
              className="hairline w-full rounded-md border py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {ex.clearPath}
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/smallworld"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
      <ExplorerGuideSection guide={SMALLWORLD_GUIDE} storyHref="/smallworld" />
    </main>
  );
}
