"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Golden-ratio demo for the Penrose story page.
// Renders a Fibonacci-rectangle spiral that converges into the golden spiral,
// alongside the kite/dart edge ratios. Slider sets the number of Fibonacci
// levels in the spiral.

interface Props {
  caption: string;
  levelsLabel: string;
  ratioLabel: string;
  hint: string;
}

function fibSeq(n: number): number[] {
  const out = [1, 1];
  for (let i = 2; i < n; i++) out.push(out[i - 1]! + out[i - 2]!);
  return out;
}

export function PenroseGoldenRatio({ caption, levelsLabel, ratioLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [levels, setLevels] = useState(7);
  const dpr = useDpr();

  const fib = useMemo(() => fibSeq(Math.max(2, levels)), [levels]);
  const ratio = fib[fib.length - 1]! / (fib[fib.length - 2] || 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W < 4 || H < 4) return;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Compute bounding box of the Fibonacci-tile layout (squares placed in
      // a counter-clockwise spiral starting at the smallest 1×1 pair).
      // We accumulate square placements with absolute coords, then scale.
      type Sq = { x: number; y: number; s: number; idx: number };
      const squares: Sq[] = [];
      // Layout direction: right, up, left, down (mod 4)
      // Start with two 1×1 squares side by side.
      const seq = fib.slice();
      const x = 0;
      const y = 0;
      // dir: 0=right, 1=up, 2=left, 3=down — direction the next square is placed
      let dir = 0;

      for (let i = 0; i < seq.length; i++) {
        const s = seq[i]!;
        let nx = x;
        let ny = y;
        if (i === 0) {
          // first square at origin
          nx = 0;
          ny = 0;
        } else {
          // Place this square against the rectangle built so far.
          // Using the classic Fibonacci-spiral convention.
          const prev = squares[i - 1]!;
          if (dir === 0) {
            // place to the right
            nx = prev.x + prev.s;
            ny = prev.y + prev.s - s;
          } else if (dir === 1) {
            // place on top
            nx = prev.x + prev.s - s;
            ny = prev.y - s;
          } else if (dir === 2) {
            // place to the left
            nx = prev.x - s;
            ny = prev.y;
          } else {
            // place below
            nx = prev.x;
            ny = prev.y + prev.s;
          }
        }
        squares.push({ x: nx, y: ny, s, idx: i });
        if (i > 0) dir = (dir + 1) % 4;
      }

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const sq of squares) {
        if (sq.x < minX) minX = sq.x;
        if (sq.y < minY) minY = sq.y;
        if (sq.x + sq.s > maxX) maxX = sq.x + sq.s;
        if (sq.y + sq.s > maxY) maxY = sq.y + sq.s;
      }
      const bw = maxX - minX;
      const bh = maxY - minY;
      const margin = 14;
      const scale = Math.min((W - margin * 2) / bw, (H - margin * 2) / bh);
      const ox = (W - bw * scale) / 2 - minX * scale;
      const oy = (H - bh * scale) / 2 - minY * scale;
      const toPx = (px: number, py: number) => [ox + px * scale, oy + py * scale] as const;

      // Palette: amber gradient by index.
      const N = squares.length;
      for (const sq of squares) {
        const t = sq.idx / Math.max(1, N - 1);
        const [x0, y0] = toPx(sq.x, sq.y);
        const w = sq.s * scale;
        // Fill: amber → rose tint
        const r = 255;
        const g = Math.round(209 - t * 100);
        const b = Math.round(102 + t * 100);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.10)`;
        ctx.fillRect(x0, y0, w, w);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x0, y0, w, w);
      }

      // Quarter-circle spiral inside each square. The center of the quarter
      // circle is whichever corner is opposite the "new" square's hinge.
      // For a clean Fibonacci spiral we use the corner that lies on the
      // accumulated rectangle's outer edge.
      ctx.strokeStyle = "rgba(255, 209, 102, 0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < squares.length; i++) {
        const sq = squares[i]!;
        const [sx, sy] = toPx(sq.x, sq.y);
        const w = sq.s * scale;
        // direction-of-placement when this square was added determines arc center
        // i === 0 → seed; treat like a right arc from bottom-right
        // dir at placement of squares[i] (for i>0) was (i-1) mod 4
        const d = i === 0 ? 0 : (i - 1) % 4;
        // arc center & start/end angles per direction:
        // d=0 (placed right):  center = (sx, sy),                arc from 0 to π/2
        // d=1 (placed up):     center = (sx, sy + w),            arc from -π/2 to 0
        // d=2 (placed left):   center = (sx + w, sy + w),        arc from π to 3π/2
        // d=3 (placed below):  center = (sx + w, sy),            arc from π/2 to π
        let ccx = sx,
          ccy = sy,
          a0 = 0,
          a1 = Math.PI / 2;
        if (d === 0) {
          ccx = sx;
          ccy = sy;
          a0 = 0;
          a1 = Math.PI / 2;
        } else if (d === 1) {
          ccx = sx;
          ccy = sy + w;
          a0 = -Math.PI / 2;
          a1 = 0;
        } else if (d === 2) {
          ccx = sx + w;
          ccy = sy + w;
          a0 = Math.PI;
          a1 = (3 * Math.PI) / 2;
        } else {
          ccx = sx + w;
          ccy = sy;
          a0 = Math.PI / 2;
          a1 = Math.PI;
        }
        ctx.moveTo(ccx + w * Math.cos(a0), ccy + w * Math.sin(a0));
        ctx.arc(ccx, ccy, w, a0, a1);
      }
      ctx.stroke();
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [fib, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-xl border bg-ink-950">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>

        <div className="space-y-4">
          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              φ = (1 + √5) / 2
            </div>
            <div className="math-italic text-3xl text-signal-amber">1.61803…</div>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {levelsLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-lg text-signal-amber">{levels}</span>
              <span className="text-ink-400">F = {fib[fib.length - 1]}</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={levels}
              onChange={(e) => setLevels(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px]">
            <div className="text-ink-300">{ratioLabel}</div>
            <div className="flex items-center justify-between">
              <span className="text-ink-200">
                {fib[fib.length - 1]} / {fib[fib.length - 2]}
              </span>
              <span className="text-signal-amber">{ratio.toFixed(6)}</span>
            </div>
            <div className="pt-1 text-[10px] text-ink-500">
              Δ from φ : {Math.abs(ratio - (1 + Math.sqrt(5)) / 2).toExponential(2)}
            </div>
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-ink-400">{hint}</p>
        </div>
      </div>
    </div>
  );
}
