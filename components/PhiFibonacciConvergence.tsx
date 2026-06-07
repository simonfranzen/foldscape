"use client";

import { useMemo, useState } from "react";

// Fibonacci ratio convergence table + a small golden-spiral SVG. The user
// drags an N slider; we show every consecutive ratio F(n+1)/F(n) up to N,
// the decimal expansion, and the signed distance to φ. The spiral on the
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

  // Golden spiral built from N quarter-arcs at sizes F1, F2, …, F(N).
  const spiralN = Math.min(8, Math.max(3, Math.floor(N / 2)));
  const spiralPath = useMemo(() => {
    const sizes: number[] = [];
    for (let i = 1; i <= spiralN; i++) sizes.push(fib(i));
    // Lay squares in a clockwise spiral: right, up, left, down repeating.
    // Track each square's centre + corner pivot for the quarter-arc.
    // Start with the first 1×1 square at origin.
    const squares: Array<{ x: number; y: number; s: number; dir: number }> = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < sizes.length; i++) {
      const s = sizes[i]!;
      // direction sequence: 0=right, 1=up, 2=left, 3=down (in svg-y-down: flip up/down)
      const dir = i % 4;
      if (i === 0) {
        squares.push({ x, y, s, dir });
      } else {
        const prev = squares[i - 1]!;
        if (dir === 0) {
          // place to the right of previous, aligned to its bottom
          x = prev.x + prev.s;
          y = prev.y + prev.s - s;
        } else if (dir === 1) {
          // place above previous, aligned to its right edge
          x = prev.x + prev.s - s;
          y = prev.y - s;
        } else if (dir === 2) {
          // place to the left, aligned to its top
          x = prev.x - s;
          y = prev.y;
        } else {
          // place below, aligned to its left edge
          x = prev.x;
          y = prev.y + prev.s;
        }
        squares.push({ x, y, s, dir });
      }
    }
    // Compute bounding box for viewBox.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const sq of squares) {
      minX = Math.min(minX, sq.x);
      minY = Math.min(minY, sq.y);
      maxX = Math.max(maxX, sq.x + sq.s);
      maxY = Math.max(maxY, sq.y + sq.s);
    }
    const pad = Math.max(2, (maxX - minX) * 0.06);
    const vb = `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`;

    // Arc commands: each square has a quarter-arc from one corner to another.
    // dir 0 (right): arc from bottom-left to top-right around top-left corner
    // dir 1 (up): arc from bottom-right to top-left around top-right corner
    // dir 2 (left): arc from top-right to bottom-left around bottom-right corner
    // dir 3 (down): arc from top-left to bottom-right around bottom-left corner
    let d = "";
    for (let i = 0; i < squares.length; i++) {
      const sq = squares[i]!;
      let p0: [number, number];
      let p1: [number, number];
      let sweep = 1;
      if (sq.dir === 0) {
        p0 = [sq.x, sq.y + sq.s];
        p1 = [sq.x + sq.s, sq.y];
      } else if (sq.dir === 1) {
        p0 = [sq.x + sq.s, sq.y + sq.s];
        p1 = [sq.x, sq.y];
      } else if (sq.dir === 2) {
        p0 = [sq.x + sq.s, sq.y];
        p1 = [sq.x, sq.y + sq.s];
      } else {
        p0 = [sq.x, sq.y];
        p1 = [sq.x + sq.s, sq.y + sq.s];
      }
      if (i === 0) d += `M ${p0[0]} ${p0[1]} `;
      else d += `M ${p0[0]} ${p0[1]} `;
      d += `A ${sq.s} ${sq.s} 0 0 ${sweep} ${p1[0]} ${p1[1]} `;
    }
    return { vb, d, squares };
  }, [spiralN]);

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
              viewBox={spiralPath.vb}
              className="h-auto w-full"
              role="img"
              aria-label="Golden spiral built from nested Fibonacci squares"
            >
              {spiralPath.squares.map((sq, i) => (
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
                d={spiralPath.d}
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
