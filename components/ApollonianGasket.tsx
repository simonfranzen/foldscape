"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

function descartesFourthZ(
  k1: number,
  k2: number,
  k3: number,
  z1: CNum,
  z2: CNum,
  z3: CNum,
): { kPlus: number; kMinus: number; zPlus: CNum; zMinus: CNum } {
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
  const zNumPlus = cAdd(linear, sq);
  const zNumMinus = cSub(linear, sq);
  return {
    kPlus,
    kMinus,
    zPlus: cScale(zNumPlus, 1 / kPlus),
    zMinus: cScale(zNumMinus, 1 / kMinus),
  };
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
  let z3pick: CNum;
  if (Math.abs(cand.kPlus - k3) <= Math.abs(cand.kMinus - k3)) {
    z3pick = cand.zPlus;
  } else {
    z3pick = cand.zMinus;
  }
  if (Math.sign(z3pick.im || 1) === Math.sign(z2.im || 1) && Math.abs(z3pick.im) > 1e-9) {
    z3pick = { re: z3pick.re, im: -z3pick.im };
  }
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

  const seed = useMemo(() => placeSeed(PRESETS[presetIdx]!.seeds), [presetIdx]);
  const circles = useMemo(() => growGasket(seed, depth), [seed, depth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W < 4 || H < 4) return;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const margin = 0.92;
      const scale = (Math.min(W, H) / 2) * margin;
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

        let stroke = "rgba(232, 234, 242, 0.85)";
        if (c.k < 0) {
          stroke = "rgba(255, 122, 182, 0.95)";
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
  }, [circles]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border bg-ink-950">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {seedLabel}
            </div>
            <select
              value={presetIdx}
              onChange={(e) => setPresetIdx(parseInt(e.target.value, 10))}
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
              className="w-full accent-signal-rose"
            />
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-ink-400">{hint}</p>
        </div>
      </div>
    </div>
  );
}
