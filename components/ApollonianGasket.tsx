"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

const withAlpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Inline Apollonian gasket renderer for the story page. A scaled-down sibling
// of the full explorer canvas: we share the geometry logic but limit depth and
// expose only seed + depth as controls. The maths is exactly the same as
// /apollonian/explorer — placed inline here so the story page is self-contained.

interface Preset {
  label: string;
  seeds: [number, number, number, number];
}

const PRESETS: Preset[] = [
  { label: "(−1, 2, 2, 3)", seeds: [-1, 2, 2, 3] },
  { label: "(−2, 3, 6, 7)", seeds: [-2, 3, 6, 7] },
  { label: "(−3, 5, 8, 8)", seeds: [-3, 5, 8, 8] },
  { label: "(−6, 11, 14, 15)", seeds: [-6, 11, 14, 15] },
];

interface Circle {
  x: number;
  y: number;
  r: number;
  k: number;
}

interface CNum {
  re: number;
  im: number;
}
const cAdd = (a: CNum, b: CNum): CNum => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a: CNum, b: CNum): CNum => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a: CNum, b: CNum): CNum => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cScale = (a: CNum, s: number): CNum => ({ re: a.re * s, im: a.im * s });
const cSqrt = (a: CNum): CNum => {
  const mag = Math.hypot(a.re, a.im);
  const re = Math.sqrt((mag + a.re) / 2);
  const im = Math.sign(a.im || 1) * Math.sqrt(Math.max(0, (mag - a.re) / 2));
  return { re, im };
};

// In the complex Descartes theorem the centre-equation sign (linear ± 2√disc)
// is independent of the curvature-equation sign (sumK ± 2√inner), so we return
// both curvature roots plus the raw `linear` and `sq = 2√disc` terms and let
// placeSeed pick the correct centre via a tangency test. See the explorer file.
function descartesFourthZ(
  k1: number,
  k2: number,
  k3: number,
  z1: CNum,
  z2: CNum,
  z3: CNum,
): { kPlus: number; kMinus: number; linear: CNum; sq: CNum } {
  const sumK = k1 + k2 + k3;
  const inner = k1 * k2 + k2 * k3 + k3 * k1;
  const root = 2 * Math.sqrt(Math.max(0, inner));
  const kPlus = sumK + root;
  const kMinus = sumK - root;
  const linear = cAdd(cAdd(cScale(z1, k1), cScale(z2, k2)), cScale(z3, k3));
  const disc = cAdd(
    cAdd(cScale(cMul(z1, z2), k1 * k2), cScale(cMul(z2, z3), k2 * k3)),
    cScale(cMul(z3, z1), k3 * k1),
  );
  const sq = cScale(cSqrt(disc), 2);
  return { kPlus, kMinus, linear, sq };
}

function placeSeed(seeds: [number, number, number, number]): Circle[] {
  const [k0, k1, k2, k3] = seeds;
  const r0 = 1 / Math.abs(k0);
  const r1 = 1 / k1;
  const r2 = 1 / k2;
  const r3 = 1 / k3;

  const c0: Circle = { x: 0, y: 0, r: r0, k: k0 };
  const c1: Circle = { x: -(r0 - r1), y: 0, r: r1, k: k1 };

  const d_o2 = r0 - r2;
  const d_12 = r1 + r2;
  const a = c1.x;
  const x2 = (a * a - d_12 * d_12 + d_o2 * d_o2) / (2 * a);
  const y2sq = Math.max(0, d_o2 * d_o2 - x2 * x2);
  const c2: Circle = { x: x2, y: Math.sqrt(y2sq), r: r2, k: k2 };

  const z0: CNum = { re: c0.x, im: c0.y };
  const z1: CNum = { re: c1.x, im: c1.y };
  const z2: CNum = { re: c2.x, im: c2.y };
  const cand = descartesFourthZ(c0.k, c1.k, c2.k, z0, z1, z2);
  const kMatched =
    Math.abs(cand.kPlus - k3) <= Math.abs(cand.kMinus - k3) ? cand.kPlus : cand.kMinus;
  // Both (linear ± 2√disc)/kMatched are valid centres for the matched curvature;
  // keep the one that is actually tangent to all three parent circles.
  const candidates: CNum[] = [
    cScale(cAdd(cand.linear, cand.sq), 1 / kMatched),
    cScale(cSub(cand.linear, cand.sq), 1 / kMatched),
  ];
  const parents = [c0, c1, c2];
  const tangencyResidual = (z: CNum): number =>
    parents.reduce((sum, p) => {
      const d = Math.hypot(z.re - p.x, z.im - p.y);
      const expected = p.k < 0 ? p.r - r3 : p.r + r3;
      return sum + Math.abs(d - expected);
    }, 0);
  const z3pick =
    tangencyResidual(candidates[0]!) <= tangencyResidual(candidates[1]!)
      ? candidates[0]!
      : candidates[1]!;
  const c3: Circle = { x: z3pick.re, y: z3pick.im, r: r3, k: k3 };
  return [c0, c1, c2, c3];
}

function reflectThrough(a: Circle, b: Circle, c: Circle, d: Circle): Circle {
  const k = 2 * (a.k + b.k + c.k) - d.k;
  const numX = 2 * (a.k * a.x + b.k * b.x + c.k * c.x) - d.k * d.x;
  const numY = 2 * (a.k * a.y + b.k * b.y + c.k * c.y) - d.k * d.y;
  const r = 1 / Math.abs(k);
  return { x: numX / k, y: numY / k, r, k };
}

interface Gap {
  a: Circle;
  b: Circle;
  c: Circle;
  opp: Circle;
  depth: number;
}

function growGasket(seed: Circle[], maxDepth: number): Circle[] {
  if (seed.length !== 4) return seed.slice();
  const [c0, c1, c2, c3] = seed as [Circle, Circle, Circle, Circle];
  const out: Circle[] = [c0, c1, c2, c3];
  const stack: Gap[] = [
    { a: c1, b: c2, c: c3, opp: c0, depth: 0 },
    { a: c0, b: c2, c: c3, opp: c1, depth: 0 },
    { a: c0, b: c1, c: c3, opp: c2, depth: 0 },
    { a: c0, b: c1, c: c2, opp: c3, depth: 0 },
  ];
  let inserted = 0;
  const HARD_LIMIT = 20000;
  while (stack.length > 0 && inserted < HARD_LIMIT) {
    const g = stack.pop()!;
    if (g.depth > maxDepth) continue;
    const e = reflectThrough(g.a, g.b, g.c, g.opp);
    if (!Number.isFinite(e.x) || !Number.isFinite(e.y) || !Number.isFinite(e.r)) continue;
    if (e.r < 1e-5) continue;
    out.push(e);
    inserted++;
    if (g.depth >= maxDepth) continue;
    stack.push({ a: g.a, b: g.b, c: e, opp: g.c, depth: g.depth + 1 });
    stack.push({ a: g.b, b: g.c, c: e, opp: g.a, depth: g.depth + 1 });
    stack.push({ a: g.a, b: g.c, c: e, opp: g.b, depth: g.depth + 1 });
  }
  return out;
}

interface Props {
  caption: string;
  seedLabel: string;
  depthLabel: string;
  countLabel: (n: number) => string;
  hint: string;
}

export function ApollonianGasket({ caption, seedLabel, depthLabel, countLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [presetIdx, setPresetIdx] = useState(0);
  const [depth, setDepth] = useState(3);
  const dpr = useDpr();

  const seed = useMemo(() => placeSeed(PRESETS[presetIdx]!.seeds), [presetIdx]);
  const circles = useMemo(() => growGasket(seed, depth), [seed, depth]);

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

      const margin = 0.92;
      // Normalise by the outer-disc radius (1/|k_outer|) so every preset fills
      // the frame; without this the −6 packing would draw at a sixth scale.
      const outerR = circles[0]?.r ?? 1;
      const scale = ((Math.min(W, H) / 2) * margin) / outerR;
      const cx = W / 2;
      const cy = H / 2;
      const toPx = (x: number, y: number): [number, number] => [cx + x * scale, cy - y * scale];

      let maxLog = 0;
      for (const c of circles) {
        if (c.k > 0) {
          const v = Math.log10(c.k);
          if (v > maxLog) maxLog = v;
        }
      }
      maxLog = Math.max(maxLog, 1);

      for (const c of circles) {
        const [px, py] = toPx(c.x, c.y);
        const radiusPx = c.r * scale;
        if (radiusPx < 0.4) continue;

        let stroke = withAlpha(palette.ink[100], 0.85);
        if (c.k < 0) {
          stroke = withAlpha(palette.signal.rose, 0.95);
        } else {
          const t = Math.min(1, Math.log10(Math.max(1, c.k)) / maxLog);
          const hue = (350 + t * 280) % 360;
          stroke = `hsl(${hue}, 75%, 65%)`;
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = c.k < 0 ? 1.5 : Math.max(0.5, 1.2 - Math.log10(Math.max(1, c.k)) * 0.22);
        ctx.beginPath();
        ctx.arc(px, py, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [circles, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border bg-ink-950">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            role="img"
            aria-label={`${caption}: ${PRESETS[presetIdx]!.label}, ${countLabel(circles.length)}`}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {seedLabel}
            </div>
            <select
              value={presetIdx}
              onChange={(e) => setPresetIdx(parseInt(e.target.value, 10))}
              aria-label={seedLabel}
              className="hairline w-full rounded-md border bg-ink-950 px-2 py-2 font-mono text-xs text-ink-100 focus:border-signal-rose/70 focus:outline-none"
            >
              {PRESETS.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {depthLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-lg text-signal-rose">{depth}</span>
              <span className="text-ink-400">{countLabel(circles.length)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              aria-label={depthLabel}
              className="w-full accent-signal-rose"
            />
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-ink-400">{hint}</p>
        </div>
      </div>
    </div>
  );
}
