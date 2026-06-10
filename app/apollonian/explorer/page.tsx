"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// ---------- Geometry types ----------

interface Circle {
  x: number; // centre x in unit coordinates (outer disc has radius 1, centred at 0,0)
  y: number;
  r: number; // geometric radius, always positive
  k: number; // signed curvature: +1/r for ordinary circles, −1/r for the enclosing one
}

interface Preset {
  label: string;
  seeds: [number, number, number, number]; // (k1, k2, k3, k4) with k1 the outer (negative)
}

// All listed packings are integer Apollonian. The first entry is the enclosing
// (negative-curvature) circle; the other three are the original mutually
// tangent triple; the fourth seed circle is derived geometrically.
const PRESETS: Preset[] = [
  { label: "(−1, 2, 2, 3)", seeds: [-1, 2, 2, 3] },
  { label: "(−2, 3, 6, 7)", seeds: [-2, 3, 6, 7] },
  { label: "(−3, 5, 8, 8)", seeds: [-3, 5, 8, 8] },
  { label: "(−4, 8, 9, 9)", seeds: [-4, 8, 9, 9] },
  { label: "(−6, 11, 14, 15)", seeds: [-6, 11, 14, 15] },
];

// ---------- Seed-circle placement ----------
//
// Given four mutually tangent signed curvatures (k1, k2, k3, k4) with k1 the
// outer (negative) circle, we place the four circles in the unit-square plane
// using these geometric facts:
//
//   • The outer circle has radius R = 1/|k1| and centre at (0, 0).
//   • If two interior circles touch the outer one and each other along a
//     diameter, they are co-linear with the centre. We can place the larger
//     interior circles symmetrically along the x-axis.
//   • The remaining circles are positioned by the Descartes / complex form
//     reflection law, derived from solving for the centre of the small circle
//     given the curvatures and centres of three mutually tangent circles.
//
// For robustness we use the Lagarias–Mallows–Wilks "complex Descartes" form:
//   k4·z4 = k1·z1 + k2·z2 + k3·z3 ± 2·√(k1 k2 z1 z2 + k2 k3 z2 z3 + k3 k1 z3 z1)
// where z = x + iy. We unfold complex arithmetic into (x, y) pairs.

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

// Solve for the two candidate fourth circles given three known ones.
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

  // z-form numerator: k1 z1 + k2 z2 + k3 z3
  const linear = cAdd(cAdd(cScale(z1, k1), cScale(z2, k2)), cScale(z3, k3));
  // discriminant inside sqrt for z: k1 k2 z1 z2 + k2 k3 z2 z3 + k3 k1 z3 z1
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

// Place a seed quadruple in normalised (unit-disc) coordinates.
//
// Convention: seeds[0] is the outer circle (negative curvature). We centre
// the outer circle at (0, 0). For the other three we place the largest
// interior circle on the x-axis to the left so that its centre lies on a
// diameter of the outer circle, then place the next interior circle on the
// x-axis to the right (also tangent to the outer one and to circle 2), then
// solve for circle 4 via Descartes.
function placeSeed(seeds: [number, number, number, number]): Circle[] {
  const [k0, k1, k2, k3] = seeds;
  const r0 = 1 / Math.abs(k0);
  const r1 = 1 / k1;
  const r2 = 1 / k2;
  const r3 = 1 / k3;

  // Outer circle, signed curvature k0 < 0.
  const c0: Circle = { x: 0, y: 0, r: r0, k: k0 };

  // Place circle 1 internally tangent to outer, centre on negative x-axis.
  const c1: Circle = { x: -(r0 - r1), y: 0, r: r1, k: k1 };

  // Place circle 2 internally tangent to outer AND externally tangent to circle 1.
  // Centre on positive side, possibly off-axis. Distance from origin = r0 − r2,
  // distance from c1 = r1 + r2. Solve for (x, y).
  const d_o2 = r0 - r2;
  const d_12 = r1 + r2;
  // Place c1 at (a, 0) with a = -(r0 − r1). Then |c2 − c1|² = (x − a)² + y² = d_12².
  // And x² + y² = d_o2². Subtract: −2 a x + a² = d_12² − d_o2², so x = (a² − d_12² + d_o2²) / (2 a).
  const a = c1.x;
  const x2 = (a * a - d_12 * d_12 + d_o2 * d_o2) / (2 * a);
  const y2sq = Math.max(0, d_o2 * d_o2 - x2 * x2);
  const c2: Circle = { x: x2, y: Math.sqrt(y2sq), r: r2, k: k2 };

  // Place circle 3 via complex Descartes. We know k3, choose the placement
  // that puts it on the opposite side of the (c1, c2) chord from c0's
  // negative-curvature "side", which here just means: choose the y that
  // matches our target curvature k3 (one of the two roots, by curvature).
  const z0: CNum = { re: c0.x, im: c0.y };
  const z1: CNum = { re: c1.x, im: c1.y };
  const z2: CNum = { re: c2.x, im: c2.y };
  const cand = descartesFourthZ(c0.k, c1.k, c2.k, z0, z1, z2);
  // pick the candidate whose curvature matches k3 within numerical tolerance
  let z3pick: CNum;
  if (Math.abs(cand.kPlus - k3) <= Math.abs(cand.kMinus - k3)) {
    z3pick = cand.zPlus;
  } else {
    z3pick = cand.zMinus;
  }
  // If c2 was placed with +y, place c3 on the −y side so we see both. We flip
  // its imaginary part to keep the seed visually balanced when the chosen
  // root coincides with the +y side.
  if (Math.sign(z3pick.im || 1) === Math.sign(z2.im || 1) && Math.abs(z3pick.im) > 1e-9) {
    z3pick = { re: z3pick.re, im: -z3pick.im };
  }
  const c3: Circle = { x: z3pick.re, y: z3pick.im, r: r3, k: k3 };

  return [c0, c1, c2, c3];
}

// ---------- Recursive gap filling ----------
//
// For four mutually tangent circles A, B, C, D one of the two Descartes
// solutions for the fourth curvature given A, B, C is D itself. The other
// solution E is the new circle inscribed in the curved-triangular gap between
// A, B, C on the side away from D. By the linearity of the Descartes form
// (subtract the two solutions):
//
//   kE = 2(kA + kB + kC) − kD
//   kE · zE = 2(kA zA + kB zB + kC zC) − kD · zD
//
// After inserting E, three new curved-triangular gaps appear, each bounded
// by (A, B, E), (B, C, E) and (A, C, E) — with the "old" circle being C, A,
// B respectively. We recurse on each.

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
  // the "opposite" circle whose reflection through (a,b,c) gives the new
  // inscribed circle for this gap
  opp: Circle;
  depth: number;
}

function growGasket(seed: Circle[], maxDepth: number): Circle[] {
  if (seed.length !== 4) return seed.slice();
  const [c0, c1, c2, c3] = seed;
  const out: Circle[] = [c0, c1, c2, c3];

  const stack: Gap[] = [
    { a: c1, b: c2, c: c3, opp: c0, depth: 0 },
    { a: c0, b: c2, c: c3, opp: c1, depth: 0 },
    { a: c0, b: c1, c: c3, opp: c2, depth: 0 },
    { a: c0, b: c1, c: c2, opp: c3, depth: 0 },
  ];

  let inserted = 0;
  const HARD_LIMIT = 60000;

  while (stack.length > 0 && inserted < HARD_LIMIT) {
    const g = stack.pop()!;
    if (g.depth > maxDepth) continue;
    const e = reflectThrough(g.a, g.b, g.c, g.opp);
    if (!Number.isFinite(e.x) || !Number.isFinite(e.y) || !Number.isFinite(e.r)) continue;
    if (e.r < 1e-5) continue;
    out.push(e);
    inserted++;
    if (g.depth >= maxDepth) continue;
    // After inserting e, three new gaps bounded by (a,b,e), (b,c,e), (a,c,e),
    // with the previously-removed-corner circle as the "opposite" reference.
    stack.push({ a: g.a, b: g.b, c: e, opp: g.c, depth: g.depth + 1 });
    stack.push({ a: g.b, b: g.c, c: e, opp: g.a, depth: g.depth + 1 });
    stack.push({ a: g.a, b: g.c, c: e, opp: g.b, depth: g.depth + 1 });
  }

  return out;
}

// ---------- Component ----------

export default function ApollonianExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.apollonian;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [presetIdx, setPresetIdx] = useState(0);
  const [depth, setDepth] = useState(4);
  const [showLabels, setShowLabels] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const [colourByCurvature, setColourByCurvature] = useState(true);
  const [centerOnPacking, setCenterOnPacking] = useState(true);

  const seed = useMemo(() => placeSeed(PRESETS[presetIdx]!.seeds), [presetIdx]);
  const circles = useMemo(() => growGasket(seed, depth), [seed, depth]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // Determine viewport — we always centre on the outer disc (the seed
      // is normalised so that the outer disc has |k| = 1/|k_outer|, centred
      // at (0, 0)). When "centre on packing" is off we still keep it centred
      // because the seed is normalised; the toggle exposes the difference
      // visually by adding a wider margin when on.
      const margin = centerOnPacking ? 0.92 : 0.6;
      const scale = (Math.min(W, H) / 2) * margin;
      const cx = W / 2;
      const cy = H / 2;
      const toPx = (x: number, y: number): [number, number] => [cx + x * scale, cy - y * scale];

      // Optional: shade gaps under the circles. We approximate gaps by
      // filling the outer disc with a light wash and then "punching out" each
      // interior circle with the background colour. This isn't strict gap
      // colouring (which would need actual curved-triangle geometry) but it
      // gives the user a clear sense of which regions are still empty.
      if (showGaps) {
        const outer = circles[0];
        if (outer) {
          const [ox, oy] = toPx(outer.x, outer.y);
          ctx.fillStyle = "rgba(255, 122, 182, 0.10)";
          ctx.beginPath();
          ctx.arc(ox, oy, outer.r * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = palette.canvas.bg;
        for (let i = 1; i < circles.length; i++) {
          const c = circles[i]!;
          const [px, py] = toPx(c.x, c.y);
          ctx.beginPath();
          ctx.arc(px, py, c.r * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw circle outlines.
      // Compute curvature range for colouring (interior circles only).
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
          // Outer enclosing circle — distinctive rose.
          stroke = "rgba(255, 122, 182, 0.95)";
        } else if (colourByCurvature) {
          const t = Math.min(1, Math.log10(Math.max(1, c.k)) / maxLog);
          // hue sweeps from rose (350) through amber (40) through cyan (185)
          // through violet (270) as curvature grows.
          const hue = (350 + t * 280) % 360;
          stroke = `hsl(${hue}, 75%, 65%)`;
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = c.k < 0 ? 1.6 : Math.max(0.6, 1.4 - Math.log10(Math.max(1, c.k)) * 0.25);
        ctx.beginPath();
        ctx.arc(px, py, radiusPx, 0, Math.PI * 2);
        ctx.stroke();

        if (showLabels && radiusPx > 14) {
          ctx.fillStyle = "rgba(232, 234, 242, 0.9)";
          ctx.font = `${Math.min(13, Math.max(9, radiusPx * 0.35))}px ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const label = Number.isInteger(c.k) ? `${c.k}` : c.k.toFixed(c.k < 10 ? 2 : 1);
          ctx.fillText(label, px, py);
        }
      }

      // HUD
      ctx.fillStyle = "rgba(232, 234, 242, 0.65)";
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`${circles.length} circles`, 12, 10);
      ctx.fillText(`depth ≤ ${depth}`, 12, 26);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [circles, depth, showLabels, showGaps, colourByCurvature, centerOnPacking, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Packing · {PRESETS[presetIdx]!.label}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
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
              Preset packing
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setPresetIdx(i)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    presetIdx === i
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    integer Apollonian seed
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Recursion depth
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{depth}</span>
              <span className="text-[10px] text-ink-400">{circles.length} circles</span>
            </div>
            <input
              type="range"
              value={depth}
              min={0}
              max={8}
              step={1}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <p className="font-mono text-[10px] leading-relaxed text-ink-400">
              Each step fills every curved-triangle gap with its inscribed circle.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              View
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>Show curvature labels</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={showGaps}
                onChange={(e) => setShowGaps(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>Highlight triangle gaps</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={colourByCurvature}
                onChange={(e) => setColourByCurvature(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>Colour by curvature</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={centerOnPacking}
                onChange={(e) => setCenterOnPacking(e.target.checked)}
                className="accent-signal-amber"
              />
              <span>Centre on packing</span>
            </label>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Seed circles
            </div>
            <table className="w-full font-mono text-xs">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-1 py-1 text-left text-[10px] uppercase tracking-widest">k</th>
                  <th className="px-1 py-1 text-left text-[10px] uppercase tracking-widest">r</th>
                  <th className="px-1 py-1 text-left text-[10px] uppercase tracking-widest">
                    (x, y)
                  </th>
                </tr>
              </thead>
              <tbody>
                {seed.map((c, i) => (
                  <tr key={i} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-1 py-1 text-signal-amber">
                      {Number.isInteger(c.k) ? c.k : c.k.toFixed(2)}
                    </td>
                    <td className="px-1 py-1 text-ink-200">{c.r.toFixed(3)}</td>
                    <td className="px-1 py-1 text-ink-300">
                      ({c.x.toFixed(2)}, {c.y.toFixed(2)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => {
                setDepth(4);
                setShowLabels(false);
                setShowGaps(false);
                setColourByCurvature(true);
                setCenterOnPacking(true);
              }}
              className="hairline w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              Reset view
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
