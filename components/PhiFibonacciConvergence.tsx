"use client";

import { useMemo, useState } from "react";

// Fibonacci ratio convergence table + a small golden-spiral SVG. The user
// drags an N slider; we show every consecutive ratio F(n+1)/F(n) up to N,
// the decimal expansion, and the signed distance to phi. The spiral on the
// right is the canonical nested-Fibonacci-squares quarter-circle spiral.

interface Props {
  caption: string;
  nLabel: string;
  ratioHeader: string;
  diffHeader: string;
  hint: string;
  spiralCaption: string;
}

const PHI = (1 + Math.sqrt(5)) / 2;

function fib(n: number): number {
  if (n < 2) return n;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

// Build the canonical Fibonacci-squares golden spiral. Returns square boxes
// (for the grid render) and a single chained SVG path string for the inscribed
// quarter-arc spiral. The arcs are chained endpoint-to-endpoint so the path
// is one continuous in-spiralling curve (no extra `M` between arcs).
//
// Construction (SVG Y-down):
//   - Squares sized F_1, F_2, ..., F_n = 1, 1, 2, 3, 5, ...
//   - The first square sits at (0, 0); subsequent squares cycle through the
//     placement directions LEFT, UP, RIGHT, DOWN (relative to the current
//     bounding rectangle), each new square spanning the full side it attaches
//     to so the union remains a rectangle of golden-ratio-approaching aspect.
//   - The arc centre inside each square is the corner adjacent to BOTH the
//     edge shared with the previous square AND the edge shared with the next
//     square; that choice keeps the chain tangent-continuous at every join.
//     For placement L the centre falls on TR; U -> BR; R -> BL; D -> TL.
//   - With this convention the SVG sweep flag is always 1 (CW on screen).
function buildFibonacciSpiral(n: number) {
  type Sq = { x: number; y: number; s: number };
  type Arc = { cx: number; cy: number; sx: number; sy: number; ex: number; ey: number; r: number };

  const sizes: number[] = [];
  for (let i = 1; i <= n; i++) sizes.push(fib(i));

  const squares: Sq[] = [{ x: 0, y: 0, s: sizes[0]! }];
  const dirs = ["L", "U", "R", "D"] as const;
  let bx = 0;
  let by = 0;
  let bw = sizes[0]!;
  let bh = sizes[0]!;
  for (let i = 1; i < n; i++) {
    const s = sizes[i]!;
    const d = dirs[(i - 1) % 4]!;
    let nx = 0;
    let ny = 0;
    if (d === "L") {
      nx = bx - s;
      ny = by;
    } else if (d === "U") {
      nx = bx;
      ny = by - s;
    } else if (d === "R") {
      nx = bx + bw;
      ny = by;
    } else {
      nx = bx;
      ny = by + bh;
    }
    squares.push({ x: nx, y: ny, s });
    const mnx = Math.min(bx, nx);
    const mny = Math.min(by, ny);
    const mxx = Math.max(bx + bw, nx + s);
    const mxy = Math.max(by + bh, ny + s);
    bx = mnx;
    by = mny;
    bw = mxx - mnx;
    bh = mxy - mny;
  }

  // Direction-based arc centre for i >= 1. dir L -> TR, U -> BR, R -> BL, D -> TL.
  const centres: Array<[number, number]> = new Array(n);
  for (let i = 1; i < n; i++) {
    const sq = squares[i]!;
    const d = dirs[(i - 1) % 4]!;
    if (d === "L") centres[i] = [sq.x + sq.s, sq.y];
    else if (d === "U") centres[i] = [sq.x + sq.s, sq.y + sq.s];
    else if (d === "R") centres[i] = [sq.x, sq.y + sq.s];
    else centres[i] = [sq.x, sq.y];
  }

  // For square 0 we pick the corner of sq0 on the shared edge with sq1 that is
  // NOT the connecting endpoint. For the unit-unit case (sq0 and sq1 both 1x1)
  // this collapses to the same point as centres[1] - the classical half-circle.
  const sq0 = squares[0]!;
  const corners0: Array<[number, number]> = [
    [sq0.x, sq0.y],
    [sq0.x + sq0.s, sq0.y],
    [sq0.x + sq0.s, sq0.y + sq0.s],
    [sq0.x, sq0.y + sq0.s],
  ];
  if (n >= 2) {
    const sq1 = squares[1]!;
    const isCornerOfSq1 = (p: [number, number]) =>
      (p[0] === sq1.x || p[0] === sq1.x + sq1.s) && (p[1] === sq1.y || p[1] === sq1.y + sq1.s);
    // arc[1] endpoints = the two sq1 corners adjacent to centres[1]
    const adjOfCentre1 = adjCorners(sq1, centres[1]!);
    // Connecting endpoint is the one that is also a corner of sq0.
    const isCornerOfSq0 = (p: [number, number]) =>
      (p[0] === sq0.x || p[0] === sq0.x + sq0.s) && (p[1] === sq0.y || p[1] === sq0.y + sq0.s);
    const connecting =
      isCornerOfSq0(adjOfCentre1[0]) ? adjOfCentre1[0] : adjOfCentre1[1];
    const sharedSq0Corners = corners0.filter(isCornerOfSq1);
    centres[0] =
      sharedSq0Corners.find((p) => p[0] !== connecting[0] || p[1] !== connecting[1]) ??
      sharedSq0Corners[0] ??
      [sq0.x, sq0.y];
  } else {
    centres[0] = [sq0.x, sq0.y];
  }

  // Build arcs with adjacent-corner endpoints, then orient them so that
  // arc[i].end === arc[i+1].start.
  const arcs: Arc[] = squares.map((sq, i) => {
    const c = centres[i]!;
    const [p, q] = adjCorners(sq, c);
    return { cx: c[0], cy: c[1], sx: p[0], sy: p[1], ex: q[0], ey: q[1], r: sq.s };
  });
  for (let i = 0; i < n - 1; i++) {
    const cur = arcs[i]!;
    const nxt = arcs[i + 1]!;
    const eq = (ax: number, ay: number, bx2: number, by2: number) => ax === bx2 && ay === by2;
    const sharedIsCurEnd =
      eq(cur.ex, cur.ey, nxt.sx, nxt.sy) || eq(cur.ex, cur.ey, nxt.ex, nxt.ey);
    if (!sharedIsCurEnd) {
      const ts = cur.sx;
      const tt = cur.sy;
      cur.sx = cur.ex;
      cur.sy = cur.ey;
      cur.ex = ts;
      cur.ey = tt;
    }
    if (!eq(nxt.sx, nxt.sy, cur.ex, cur.ey)) {
      const ts = nxt.sx;
      const tt = nxt.sy;
      nxt.sx = nxt.ex;
      nxt.sy = nxt.ey;
      nxt.ex = ts;
      nxt.ey = tt;
    }
  }

  // Single SVG path: one `M`, then a chain of `A` commands - no `M` between
  // arcs, no straight `L` segments. Sweep flag = 1 (clockwise on screen).
  let d = "";
  if (arcs.length > 0) {
    const a0 = arcs[0]!;
    d = `M ${a0.sx} ${a0.sy} `;
    for (const a of arcs) d += `A ${a.r} ${a.r} 0 0 1 ${a.ex} ${a.ey} `;
  }

  const pad = Math.max(2, (bw + bh) * 0.03);
  const vb = `${bx - pad} ${by - pad} ${bw + 2 * pad} ${bh + 2 * pad}`;
  return { squares, d, vb };
}

// Given a square and one of its four corners, return the two corners adjacent
// to it via the square's edges (i.e. the two arc endpoints when the corner is
// the centre of the inscribed quarter arc).
function adjCorners(
  sq: { x: number; y: number; s: number },
  c: [number, number],
): [[number, number], [number, number]] {
  const x0 = sq.x;
  const y0 = sq.y;
  const x1 = sq.x + sq.s;
  const y1 = sq.y + sq.s;
  const [cx, cy] = c;
  if (cx === x0 && cy === y0) return [[x1, y0], [x0, y1]];
  if (cx === x1 && cy === y0) return [[x0, y0], [x1, y1]];
  if (cx === x1 && cy === y1) return [[x1, y0], [x0, y1]];
  if (cx === x0 && cy === y1) return [[x0, y0], [x1, y1]];
  return [[x0, y0], [x1, y1]];
}

export function PhiFibonacciConvergence({
  caption,
  nLabel,
  ratioHeader,
  diffHeader,
  hint,
  spiralCaption,
}: Props) {
  const [N, setN] = useState<number>(12);

  const rows = useMemo(() => {
    const out: Array<{ n: number; fn: number; ratio: number | null }> = [];
    let prev = 1;
    let curr = 1;
    // n starts at 1; F1 = 1, F2 = 1, F3 = 2, ...
    out.push({ n: 1, fn: 1, ratio: null });
    for (let n = 2; n <= N + 1; n++) {
      const ratio = prev === 0 ? null : curr / prev;
      out.push({ n, fn: curr, ratio });
      const next = prev + curr;
      prev = curr;
      curr = next;
    }
    return out;
  }, [N]);

  // Golden spiral built from N quarter-arcs at sizes F1, F2, ..., F(N).
  const spiralN = Math.min(8, Math.max(3, Math.floor(N / 2)));
  const spiral = useMemo(() => buildFibonacciSpiral(spiralN), [spiralN]);

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor="phi-fib-n"
            className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
          >
            {nLabel}
          </label>
          <span className="font-mono text-sm text-signal-amber">N = {N}</span>
        </div>
        <input
          id="phi-fib-n"
          type="range"
          min={3}
          max={15}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="w-full accent-signal-amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="overflow-x-auto lg:col-span-3">
          <table className="w-full font-mono text-sm">
            <thead className="hairline border-b text-ink-300">
              <tr>
                <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">n</th>
                <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">Fₙ</th>
                <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                  {ratioHeader}
                </th>
                <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                  {diffHeader}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, N).map(({ n, fn, ratio }) => {
                const diff = ratio === null ? null : ratio - PHI;
                return (
                  <tr key={n} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-1.5 text-ink-300">{n}</td>
                    <td className="px-2 py-1.5 text-right text-signal-amber">{fn}</td>
                    <td className="px-2 py-1.5 text-right text-ink-100">
                      {ratio === null ? "—" : ratio.toFixed(8)}
                    </td>
                    <td
                      className={`px-2 py-1.5 text-right ${
                        diff === null
                          ? "text-ink-500"
                          : Math.abs(diff) < 1e-5
                            ? "text-signal-amber"
                            : diff > 0
                              ? "text-signal-cyan"
                              : "text-signal-rose"
                      }`}
                    >
                      {diff === null ? "—" : (diff >= 0 ? "+" : "") + diff.toExponential(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="hairline mt-3 border-t pt-3 font-mono text-[11px] leading-relaxed text-ink-300">
            φ = <span className="text-signal-amber">{PHI.toFixed(10)}</span>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <div className="hairline rounded-xl border bg-ink-950/60 p-3">
            <svg
              viewBox={spiral.vb}
              className="h-auto w-full"
              role="img"
              aria-label="Golden spiral built from nested Fibonacci squares"
            >
              {spiral.squares.map((sq, i) => (
                <rect
                  key={i}
                  x={sq.x}
                  y={sq.y}
                  width={sq.s}
                  height={sq.s}
                  fill="none"
                  stroke="rgba(125,243,255,0.35)"
                  strokeWidth={Math.max(0.05, sq.s * 0.012)}
                />
              ))}
              <path
                d={spiral.d}
                fill="none"
                stroke="#ffd166"
                strokeWidth={Math.max(0.08, spiralN * 0.05)}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-center font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
            {spiralCaption}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-ink-300">{hint}</p>
    </div>
  );
}
