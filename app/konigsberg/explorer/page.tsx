"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// --------------------------------------------------------------------------
// Königsberg Bridges Explorer
//
// Interactive bridge-walking. Four land masses (vertices) sit on a Canvas
// 2D map; bridges (edges) link them. The user picks a starting land mass
// and then clicks bridges to cross them. A bridge can be crossed iff:
//   (a) it is currently active (not removed),
//   (b) it is incident to the current land mass,
//   (c) it has not yet been visited.
// Visited bridges turn amber and grey out; the walk is shown as an amber
// path. If no legal move remains, we declare "Stuck!" and explain why.
//
// The sidebar:
//   - Start picker
//   - Toggle bridges (7 original + 3 hypothetical extras)
//   - Live degree counter for each vertex
//   - Eulerian indicator (path / circuit / neither)
//   - Reset walk
//   - Auto-solve: Hierholzer animation when the current graph is Eulerian
//
// All maths is recomputed in real time as bridges are toggled. No external
// state — pure React.
// --------------------------------------------------------------------------

type VertexId = "A" | "B" | "C" | "D";

interface VertexDef {
  id: VertexId;
  // Canvas coords (logical, in 800x500 space — we map to actual pixels).
  x: number;
  y: number;
  label: string;
  // Rough shape: rectangle (banks) or rounded blob (islands)
  shape: "bank-top" | "bank-bottom" | "island";
}

interface BridgeDef {
  id: string;
  a: VertexId;
  b: VertexId;
  // Two control points for the curved bridge path in canvas coords.
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  // Whether part of the original seven (just for labelling).
  original: boolean;
}

const VERTICES: VertexDef[] = [
  { id: "A", x: 400, y: 70, label: "A — north bank", shape: "bank-top" },
  { id: "B", x: 270, y: 250, label: "B — Kneiphof", shape: "island" },
  { id: "C", x: 530, y: 250, label: "C — Lomse", shape: "island" },
  { id: "D", x: 400, y: 430, label: "D — south bank", shape: "bank-bottom" },
];

// The seven historical bridges, with the canonical multiplicities (A-B: 2,
// A-C: 2, A-D: 1, B-D: 1, C-D: 1). Plus a B-C bridge (the "Honey Bridge")
// and a couple of hypothetical extras the user can toggle on.
const BRIDGES: BridgeDef[] = [
  // A-B: 2 bridges
  { id: "AB1", a: "A", b: "B", cx1: 320, cy1: 110, cx2: 240, cy2: 190, original: true },
  { id: "AB2", a: "A", b: "B", cx1: 380, cy1: 150, cx2: 310, cy2: 200, original: true },
  // A-C: 2 bridges
  { id: "AC1", a: "A", b: "C", cx1: 480, cy1: 110, cx2: 560, cy2: 190, original: true },
  { id: "AC2", a: "A", b: "C", cx1: 420, cy1: 150, cx2: 490, cy2: 200, original: true },
  // A-D: 1 bridge (the long one, drawn around the right side)
  { id: "AD", a: "A", b: "D", cx1: 720, cy1: 130, cx2: 720, cy2: 370, original: true },
  // B-D: 1 bridge
  { id: "BD", a: "B", b: "D", cx1: 240, cy1: 310, cx2: 320, cy2: 390, original: true },
  // C-D: 1 bridge
  { id: "CD", a: "C", b: "D", cx1: 560, cy1: 310, cx2: 480, cy2: 390, original: true },
  // Extras (off by default)
  { id: "BC", a: "B", b: "C", cx1: 350, cy1: 250, cx2: 450, cy2: 250, original: false },
  { id: "AD2", a: "A", b: "D", cx1: 80, cy1: 130, cx2: 80, cy2: 370, original: false },
  { id: "BC2", a: "B", b: "C", cx1: 350, cy1: 290, cx2: 450, cy2: 290, original: false },
];

const ORIGINAL_IDS = BRIDGES.filter((b) => b.original).map((b) => b.id);

// Logical canvas size — we'll map to device pixels in the render.
const CANVAS_W = 800;
const CANVAS_H = 500;

function curvePoint(
  b: BridgeDef,
  t: number,
  verts: Record<VertexId, VertexDef>,
): { x: number; y: number } {
  // Cubic Bezier from vert a -> b through cx1/cy1, cx2/cy2.
  const va = verts[b.a];
  const vb = verts[b.b];
  const mt = 1 - t;
  const x =
    mt * mt * mt * va.x + 3 * mt * mt * t * b.cx1 + 3 * mt * t * t * b.cx2 + t * t * t * vb.x;
  const y =
    mt * mt * mt * va.y + 3 * mt * mt * t * b.cy1 + 3 * mt * t * t * b.cy2 + t * t * t * vb.y;
  return { x, y };
}

function distSqToCurve(
  b: BridgeDef,
  px: number,
  py: number,
  verts: Record<VertexId, VertexDef>,
): number {
  let best = Infinity;
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const p = curvePoint(b, t, verts);
    const d = (p.x - px) ** 2 + (p.y - py) ** 2;
    if (d < best) best = d;
  }
  return best;
}

function computeDegrees(activeIds: Set<string>): Record<VertexId, number> {
  const deg: Record<VertexId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    deg[br.a] += 1;
    deg[br.b] += 1;
  }
  return deg;
}

function isConnected(activeIds: Set<string>): boolean {
  // BFS over vertices that have at least one active edge. If every such
  // vertex is reachable from any other, we call the graph connected.
  const adj: Record<VertexId, VertexId[]> = { A: [], B: [], C: [], D: [] };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    adj[br.a].push(br.b);
    adj[br.b].push(br.a);
  }
  const used: VertexId[] = (["A", "B", "C", "D"] as VertexId[]).filter((v) => adj[v].length > 0);
  if (used.length === 0) return true;
  const seen = new Set<VertexId>([used[0]]);
  const stack: VertexId[] = [used[0]];
  while (stack.length > 0) {
    const v = stack.pop()!;
    for (const n of adj[v]) {
      if (!seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return used.every((v) => seen.has(v));
}

type EulerStatus =
  | { kind: "circuit"; oddCount: 0 }
  | { kind: "path"; oddCount: 2; ends: [VertexId, VertexId] }
  | { kind: "none"; oddCount: number }
  | { kind: "disconnected" };

function classifyGraph(activeIds: Set<string>): EulerStatus {
  if (!isConnected(activeIds)) return { kind: "disconnected" };
  const deg = computeDegrees(activeIds);
  const odd: VertexId[] = (["A", "B", "C", "D"] as VertexId[]).filter((v) => deg[v] % 2 === 1);
  if (odd.length === 0) return { kind: "circuit", oddCount: 0 };
  if (odd.length === 2) return { kind: "path", oddCount: 2, ends: [odd[0], odd[1]] };
  return { kind: "none", oddCount: odd.length };
}

// Hierholzer's algorithm. Returns an ordered list of bridge ids forming an
// Eulerian path/circuit, or null if none exists.
function hierholzer(activeIds: Set<string>, status: EulerStatus): string[] | null {
  if (status.kind !== "circuit" && status.kind !== "path") return null;
  // Adjacency list of (neighbour, bridgeId).
  const adj: Record<VertexId, Array<{ to: VertexId; id: string }>> = { A: [], B: [], C: [], D: [] };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    adj[br.a].push({ to: br.b, id: br.id });
    adj[br.b].push({ to: br.a, id: br.id });
  }
  const start: VertexId =
    status.kind === "path"
      ? status.ends[0]
      : ((["A", "B", "C", "D"] as VertexId[]).find((v) => adj[v].length > 0) ?? "A");
  const used = new Set<string>();
  const stack: VertexId[] = [start];
  const trail: VertexId[] = [];
  const trailEdges: string[] = [];
  // We'll record an edge each time we backtrack from a vertex; classic
  // Hierholzer trick.
  const edgeStack: string[] = [];
  while (stack.length > 0) {
    const v = stack[stack.length - 1];
    // Find any unused edge from v.
    const next = adj[v].find((e) => !used.has(e.id));
    if (next) {
      used.add(next.id);
      stack.push(next.to);
      edgeStack.push(next.id);
    } else {
      trail.push(stack.pop()!);
      const e = edgeStack.pop();
      if (e !== undefined) trailEdges.push(e);
    }
  }
  trailEdges.reverse();
  return trailEdges;
}

export default function KonigsbergExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.konigsberg;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });

  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set(ORIGINAL_IDS));
  const [startVertex, setStartVertex] = useState<VertexId>("A");
  const [currentVertex, setCurrentVertex] = useState<VertexId>("A");
  const [walk, setWalk] = useState<string[]>([]); // ordered bridge ids
  const [stuck, setStuck] = useState<boolean>(false);
  const [auto, setAuto] = useState<{ trail: string[]; idx: number } | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const vertsById = useMemo(() => {
    const m: Record<VertexId, VertexDef> = {
      A: VERTICES[0],
      B: VERTICES[1],
      C: VERTICES[2],
      D: VERTICES[3],
    };
    return m;
  }, []);

  const degrees = useMemo(() => computeDegrees(activeIds), [activeIds]);
  const status = useMemo(() => classifyGraph(activeIds), [activeIds]);

  // Reset the walk when the active graph or the start vertex changes.
  const resetWalk = useCallback(() => {
    setWalk([]);
    setStuck(false);
    setCurrentVertex(startVertex);
    setAuto(null);
  }, [startVertex]);

  useEffect(() => {
    resetWalk();
  }, [activeIds, startVertex, resetWalk]);

  // Determine if the walker is stuck (no legal moves from current vertex
  // among unvisited active bridges).
  useEffect(() => {
    if (auto !== null) return;
    if (walk.length === 0 && !stuck) {
      // At start; check if there is at least one bridge to walk.
      const hasMove = BRIDGES.some(
        (b) => activeIds.has(b.id) && (b.a === currentVertex || b.b === currentVertex),
      );
      if (!hasMove) setStuck(true);
      return;
    }
    const visited = new Set(walk);
    const hasMove = BRIDGES.some(
      (b) =>
        activeIds.has(b.id) &&
        !visited.has(b.id) &&
        (b.a === currentVertex || b.b === currentVertex),
    );
    if (!hasMove && walk.length < [...activeIds].length) setStuck(true);
  }, [walk, currentVertex, activeIds, auto, stuck]);

  // Auto-solve animation tick
  useEffect(() => {
    if (auto === null) return;
    if (auto.idx >= auto.trail.length) return;
    const t = setTimeout(() => {
      const id = auto.trail[auto.idx];
      const br = BRIDGES.find((b) => b.id === id);
      if (!br) return;
      setWalk((w) => [...w, id]);
      setCurrentVertex((cv) => (br.a === cv ? br.b : br.a));
      setAuto((s) => (s === null ? null : { trail: s.trail, idx: s.idx + 1 }));
    }, 650);
    return () => clearTimeout(t);
  }, [auto]);

  const startAutoSolve = useCallback(() => {
    const trail = hierholzer(activeIds, status);
    if (trail === null) return;
    // Walk should start at the same vertex Hierholzer started from.
    const startV: VertexId = status.kind === "path" ? status.ends[0] : startVertex;
    setStartVertex(startV);
    setWalk([]);
    setStuck(false);
    setCurrentVertex(startV);
    setAuto({ trail, idx: 0 });
  }, [activeIds, status, startVertex]);

  const toggleBridge = useCallback((id: string) => {
    setActiveIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // --- Canvas drawing ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW === 0 || cssH === 0) return;
      const W = Math.floor(cssW * dpr);
      const H = Math.floor(cssH * dpr);
      canvas.width = W;
      canvas.height = H;
      sizeRef.current = { w: W, h: H, dpr };
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Background — schematic river and banks.
      const sx = W / CANVAS_W;
      const sy = H / CANVAS_H;
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      // River bands
      ctx.fillStyle = "rgba(125,243,255,0.04)";
      ctx.fillRect(0, 160 * sy, W, 200 * sy);
      ctx.strokeStyle = "rgba(125,243,255,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 180 * sy);
      ctx.bezierCurveTo(200 * sx, 170 * sy, 400 * sx, 190 * sy, 800 * sx, 180 * sy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 340 * sy);
      ctx.bezierCurveTo(200 * sx, 330 * sy, 400 * sx, 350 * sy, 800 * sx, 340 * sy);
      ctx.stroke();

      // Land masses
      for (const v of VERTICES) {
        const cx = v.x * sx;
        const cy = v.y * sy;
        const isCurrent = currentVertex === v.id;
        const isStart = startVertex === v.id;
        if (v.shape === "bank-top") {
          ctx.fillStyle = "rgba(138,144,164,0.16)";
          roundRect(ctx, 40 * sx, 10 * sy, 720 * sx, 120 * sy, 36 * sx);
          ctx.fill();
        } else if (v.shape === "bank-bottom") {
          ctx.fillStyle = "rgba(138,144,164,0.16)";
          roundRect(ctx, 40 * sx, 370 * sy, 720 * sx, 120 * sy, 36 * sx);
          ctx.fill();
        } else {
          // Island — rounded blob around vertex.
          ctx.fillStyle = "rgba(138,144,164,0.20)";
          ctx.beginPath();
          ctx.ellipse(cx, cy, 90 * sx, 55 * sy, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vertex disc
        ctx.beginPath();
        ctx.arc(cx, cy, 26 * Math.min(sx, sy), 0, Math.PI * 2);
        ctx.fillStyle = isCurrent
          ? "rgba(255,209,102,0.95)"
          : isStart
            ? "rgba(255,209,102,0.45)"
            : "#0b0d18";
        ctx.fill();
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 1.8 * dpr;
        ctx.stroke();

        ctx.fillStyle = isCurrent ? "#0b0d18" : "#ffd166";
        ctx.font = `${20 * Math.min(sx, sy)}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(v.id, cx, cy);

        ctx.fillStyle = "#8a90a4";
        ctx.font = `${11 * dpr}px ui-monospace, monospace`;
        ctx.fillText(v.label, cx, cy + 50 * Math.min(sx, sy));
        ctx.fillText(`deg ${degrees[v.id]}`, cx, cy + 66 * Math.min(sx, sy));
      }

      // Bridges
      const visited = new Set(walk);
      for (const br of BRIDGES) {
        const active = activeIds.has(br.id);
        const hit = visited.has(br.id);
        const isHover = hoverId === br.id;
        const va = vertsById[br.a];
        const vb = vertsById[br.b];

        ctx.beginPath();
        ctx.moveTo(va.x * sx, va.y * sy);
        ctx.bezierCurveTo(br.cx1 * sx, br.cy1 * sy, br.cx2 * sx, br.cy2 * sy, vb.x * sx, vb.y * sy);
        if (!active) {
          ctx.strokeStyle = "rgba(138,144,164,0.18)";
          ctx.setLineDash([6, 8]);
          ctx.lineWidth = 1.6 * dpr;
        } else if (hit) {
          ctx.strokeStyle = "rgba(255,209,102,0.35)";
          ctx.setLineDash([]);
          ctx.lineWidth = 2.4 * dpr;
        } else if (isHover) {
          ctx.strokeStyle = "#ffd166";
          ctx.setLineDash([]);
          ctx.lineWidth = 4 * dpr;
        } else {
          ctx.strokeStyle = "rgba(255,209,102,0.85)";
          ctx.setLineDash([]);
          ctx.lineWidth = 2.4 * dpr;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Walk overlay — small numbered markers showing the order.
      for (let i = 0; i < walk.length; i++) {
        const br = BRIDGES.find((b) => b.id === walk[i]);
        if (!br) continue;
        const m = curvePoint(br, 0.5, vertsById);
        ctx.beginPath();
        ctx.arc(m.x * sx, m.y * sy, 12 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd166";
        ctx.fill();
        ctx.fillStyle = "#0b0d18";
        ctx.font = `bold ${11 * dpr}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), m.x * sx, m.y * sy);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [activeIds, walk, currentVertex, startVertex, degrees, hoverId, vertsById]);

  // --- Canvas click handler ----------------------------------------------
  const onCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (auto !== null) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cssX = e.clientX - rect.left;
      const cssY = e.clientY - rect.top;
      const logicalX = (cssX / rect.width) * CANVAS_W;
      const logicalY = (cssY / rect.height) * CANVAS_H;

      // Find nearest active bridge curve.
      const visited = new Set(walk);
      let nearestId: string | null = null;
      let nearestD = Infinity;
      for (const br of BRIDGES) {
        if (!activeIds.has(br.id)) continue;
        if (visited.has(br.id)) continue;
        const d = distSqToCurve(br, logicalX, logicalY, vertsById);
        if (d < nearestD) {
          nearestD = d;
          nearestId = br.id;
        }
      }
      if (nearestId === null) return;
      if (nearestD > 30 * 30) return;
      const br = BRIDGES.find((b) => b.id === nearestId)!;
      if (br.a !== currentVertex && br.b !== currentVertex) return;
      const next = br.a === currentVertex ? br.b : br.a;
      setWalk((w) => [...w, br.id]);
      setCurrentVertex(next);
    },
    [auto, activeIds, walk, currentVertex, vertsById],
  );

  const onCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (auto !== null) {
        if (hoverId !== null) setHoverId(null);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cssX = e.clientX - rect.left;
      const cssY = e.clientY - rect.top;
      const logicalX = (cssX / rect.width) * CANVAS_W;
      const logicalY = (cssY / rect.height) * CANVAS_H;
      const visited = new Set(walk);
      let nearestId: string | null = null;
      let nearestD = Infinity;
      for (const br of BRIDGES) {
        if (!activeIds.has(br.id)) continue;
        if (visited.has(br.id)) continue;
        if (br.a !== currentVertex && br.b !== currentVertex) continue;
        const d = distSqToCurve(br, logicalX, logicalY, vertsById);
        if (d < nearestD) {
          nearestD = d;
          nearestId = br.id;
        }
      }
      if (nearestId !== null && nearestD < 30 * 30) {
        if (hoverId !== nearestId) setHoverId(nearestId);
      } else if (hoverId !== null) {
        setHoverId(null);
      }
    },
    [auto, activeIds, walk, currentVertex, hoverId, vertsById],
  );

  const activeBridgeCount = activeIds.size;
  const visitedCount = walk.length;
  const allCrossed = visitedCount === activeBridgeCount && activeBridgeCount > 0;

  let statusLabel = "Eulerian: no";
  let statusSub = `${status.kind === "disconnected" ? "Graph is disconnected" : `${status.kind === "none" ? status.oddCount : 0} odd-degree vertices`}`;
  if (status.kind === "circuit") {
    statusLabel = "Eulerian circuit";
    statusSub = "0 odd vertices — closed walk possible";
  } else if (status.kind === "path") {
    statusLabel = "Eulerian path";
    statusSub = `start at ${status.ends[0]}, end at ${status.ends[1]}`;
  }

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Bridge walk · currently at <span className="text-signal-amber">{currentVertex}</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {statusLabel}
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas
              ref={canvasRef}
              className="block h-full w-full cursor-pointer"
              onClick={onCanvasClick}
              onMouseMove={onCanvasMove}
              onMouseLeave={() => setHoverId(null)}
            />
          </div>

          {/* Status / legend bar */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="glass hairline rounded-md border px-3 py-3 font-mono text-[10px] tracking-widest2 text-ink-200">
              <div className="uppercase text-signal-amber">Walk</div>
              <div className="mt-1 text-ink-100">
                {visitedCount} / {activeBridgeCount} bridges crossed
              </div>
              {allCrossed && (
                <div className="mt-1 text-signal-amber">
                  Complete walk — every bridge used exactly once.
                </div>
              )}
            </div>
            <div className="glass hairline rounded-md border px-3 py-3 font-mono text-[10px] tracking-widest2 text-ink-200">
              <div className="uppercase text-signal-amber">Parity</div>
              <div className="mt-1 text-ink-100">{statusSub}</div>
            </div>
            <div className="glass hairline rounded-md border px-3 py-3 font-mono text-[10px] tracking-widest2 text-ink-200">
              <div className="uppercase text-signal-amber">Legend</div>
              <div className="mt-1 text-ink-100">
                Click an amber bridge from your current vertex. Greyed dashed bridges are inactive.
              </div>
            </div>
          </div>

          {stuck && !allCrossed && (
            <div className="glass hairline rounded-md border px-4 py-3 font-mono text-xs text-signal-amber">
              <div className="text-[10px] uppercase tracking-widest2">Stuck!</div>
              <div className="mt-1 text-ink-100">
                No unvisited bridge leaves{" "}
                <span className="text-signal-amber">{currentVertex}</span>. The walk cannot
                continue.{" "}
                {status.kind === "none"
                  ? `This graph has ${status.oddCount} odd-degree vertices — Euler proved no Eulerian path can exist.`
                  : "Try a different starting vertex or change the bridge set."}
              </div>
            </div>
          )}
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Start at
            </div>
            <div className="grid grid-cols-4 gap-2">
              {VERTICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setStartVertex(v.id)}
                  className={`rounded-md border py-2 font-mono text-sm transition-colors ${
                    startVertex === v.id
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <div className="font-mono text-[10px] text-ink-400">
              Currently at: <span className="text-signal-amber">{currentVertex}</span>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Vertex degrees
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["A", "B", "C", "D"] as VertexId[]).map((v) => {
                const odd = degrees[v] % 2 === 1;
                return (
                  <div
                    key={v}
                    className={`hairline rounded-md border py-2 text-center font-mono text-sm ${
                      odd ? "border-signal-amber/40 text-signal-amber" : "text-ink-100"
                    }`}
                  >
                    <div className="text-[10px] text-ink-400">{v}</div>
                    <div>{degrees[v]}</div>
                    <div className="text-[9px] uppercase text-ink-400">{odd ? "odd" : "even"}</div>
                  </div>
                );
              })}
            </div>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              Eulerian path ⇔ at most two vertices have odd degree (and the graph is connected).
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Bridges
            </div>
            <div className="space-y-1">
              {BRIDGES.map((br) => {
                const on = activeIds.has(br.id);
                return (
                  <button
                    key={br.id}
                    onClick={() => toggleBridge(br.id)}
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                      on
                        ? "border-signal-amber/40 bg-signal-amber/5 text-signal-amber"
                        : "hairline text-ink-400 hover:text-ink-200"
                    }`}
                  >
                    <span>
                      {br.a} — {br.b} <span className="text-ink-500">· {br.id}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest2">
                      {br.original
                        ? on
                          ? "original ✓"
                          : "original ✗"
                        : on
                          ? "extra ✓"
                          : "extra ✗"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              The seven historical bridges are on by default. Toggle them to see how the parity
              argument shifts. The Honey Bridge (BC) was built later — adding it changes everything.
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={resetWalk}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              Reset walk
            </button>
            <button
              onClick={startAutoSolve}
              disabled={status.kind !== "circuit" && status.kind !== "path"}
              className={`w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                status.kind === "circuit" || status.kind === "path"
                  ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber hover:bg-signal-amber/20"
                  : "hairline cursor-not-allowed text-ink-500"
              }`}
            >
              Auto-solve (Hierholzer)
            </button>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              Auto-solve is only available when the current graph is Eulerian. It animates
              Hierholzer's algorithm walking the bridges in order.
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/konigsberg"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              ← Story
            </Link>
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

// Small helper for rounded rectangles on the canvas (banks).
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
