"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline Penrose tiling renderer for the story page. Uses Robinson-triangle
// deflation of the "sun" seed to produce the P3 (thin + thick rhombus) tiling.
// We render the half-rhombus triangles directly (hiding the internal
// symmetry-axis seam) and expose only the deflation depth as a control.
//
// The maths follows the classic Robinson-triangle formulation:
//   type 0 (apex 36°): half of a THIN  rhombus (angles 36/144)
//   type 1 (apex 108°): half of a THICK rhombus (angles 72/108)
// Deflation subdivides every triangle by the golden ratio φ. Thick rhombi
// outnumber thin ones by φ, so the thick/thin count ratio converges to φ.

const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

interface C {
  re: number;
  im: number;
}
interface Tri {
  t: 0 | 1;
  a: C;
  b: C;
  c: C;
}

const cAdd = (x: C, y: C): C => ({ re: x.re + y.re, im: x.im + y.im });
const cSub = (x: C, y: C): C => ({ re: x.re - y.re, im: x.im - y.im });
const cScale = (x: C, k: number): C => ({ re: x.re * k, im: x.im * k });
const cFromPolar = (r: number, t: number): C => ({ re: r * Math.cos(t), im: r * Math.sin(t) });

// "Sun" seed: 10 kite-half-triangles around the origin, arranged so they
// form a regular decagon with perfect five-fold symmetry.
function seedSun(): Tri[] {
  const tris: Tri[] = [];
  const o: C = { re: 0, im: 0 };
  for (let i = 0; i < 10; i++) {
    const baseAngle = ((2 * i - 1) * Math.PI) / 10;
    const tipAngle = ((2 * i + 1) * Math.PI) / 10;
    let b = cFromPolar(1, baseAngle);
    let c = cFromPolar(1, tipAngle);
    if (i % 2 === 0) {
      const tmp = b;
      b = c;
      c = tmp;
    }
    tris.push({ t: 0, a: o, b, c });
  }
  return tris;
}

// Deflation: each step replaces each triangle with 2 or 3 smaller ones,
// shrinking lengths by 1/φ.
function deflate(tris: Tri[]): Tri[] {
  const out: Tri[] = [];
  for (const tr of tris) {
    if (tr.t === 0) {
      // type-0 half-kite → type-0 + type-1
      const P = cAdd(tr.a, cScale(cSub(tr.b, tr.a), INV_PHI));
      out.push({ t: 0, a: tr.c, b: P, c: tr.b });
      out.push({ t: 1, a: P, b: tr.c, c: tr.a });
    } else {
      // type-1 half-dart → two type-1 + one type-0
      const Q = cAdd(tr.b, cScale(cSub(tr.a, tr.b), INV_PHI));
      const R = cAdd(tr.b, cScale(cSub(tr.c, tr.b), INV_PHI));
      out.push({ t: 1, a: R, b: tr.c, c: tr.a });
      out.push({ t: 1, a: Q, b: R, c: tr.b });
      out.push({ t: 0, a: R, b: Q, c: tr.a });
    }
  }
  return out;
}

function buildTiling(depth: number): Tri[] {
  let tris = seedSun();
  for (let i = 0; i < depth; i++) tris = deflate(tris);
  return tris;
}

interface Props {
  caption: string;
  depthLabel: string;
  tilesLabel: (n: number) => string;
  thickLabel: string;
  thinLabel: string;
  hint: string;
}

export function PenroseTiling({
  caption,
  depthLabel,
  tilesLabel,
  thickLabel,
  thinLabel,
  hint,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [depth, setDepth] = useState(4);
  const dpr = useDpr();

  const tris = useMemo(() => buildTiling(depth), [depth]);

  const counts = useMemo(() => {
    let thin = 0; // type 0 → thin rhombus (36/144)
    let thick = 0; // type 1 → thick rhombus (72/108)
    for (const tr of tris) {
      if (tr.t === 0) thin++;
      else thick++;
    }
    // Two half-rhombi = one full rhombus. Render gives back rounded full counts.
    return { thick: Math.round(thick / 2), thin: Math.round(thin / 2) };
  }, [tris]);

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

      const margin = 16;
      const fit = Math.min(W, H) - margin * 2;
      const scale = (fit / 2) * 0.95;
      const cx = W / 2;
      const cy = H / 2;
      const px = (p: C) => cx + p.re * scale;
      const py = (p: C) => cy - p.im * scale;

      // Fill the half-rhombi (they tile cleanly even before pairing).
      // type 0 = thin-rhombus halves (amber), type 1 = thick-rhombus halves (violet).
      const THIN_FILL = "rgba(255, 209, 102, 0.32)";
      const THIN_STROKE = "rgba(255, 209, 102, 0.90)";
      const THICK_FILL = "rgba(179, 136, 255, 0.36)";
      const THICK_STROKE = "rgba(179, 136, 255, 0.95)";

      // Pass 1: fills
      for (const tr of tris) {
        ctx.beginPath();
        ctx.moveTo(px(tr.a), py(tr.a));
        ctx.lineTo(px(tr.b), py(tr.b));
        ctx.lineTo(px(tr.c), py(tr.c));
        ctx.closePath();
        ctx.fillStyle = tr.t === 0 ? THIN_FILL : THICK_FILL;
        ctx.fill();
      }

      // Pass 2: outlines (only the two rhombus sides of each half, so the
      // internal symmetry-axis seams aren't drawn: that gives the visual
      // look of full rhombi without a separate pairing pass).
      ctx.lineWidth = Math.max(0.5, Math.min(1.4, 1.6 - depth * 0.15));
      for (const tr of tris) {
        ctx.strokeStyle = tr.t === 0 ? THIN_STROKE : THICK_STROKE;
        ctx.beginPath();
        ctx.moveTo(px(tr.a), py(tr.a));
        ctx.lineTo(px(tr.b), py(tr.b));
        ctx.moveTo(px(tr.a), py(tr.a));
        ctx.lineTo(px(tr.c), py(tr.c));
        ctx.stroke();
      }

      // Subtle vignette
      const grad = ctx.createRadialGradient(cx, cy, fit * 0.4, cx, cy, fit * 0.95);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(6,7,13,0.7)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tris, depth, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border bg-ink-950">
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            role="img"
            aria-label={`${caption}, ${tilesLabel(tris.length)}`}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {depthLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-lg text-signal-amber">{depth}</span>
              <span className="text-ink-400">{tilesLabel(tris.length)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
              aria-label={depthLabel}
            />
          </div>

          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-signal-violet">▰ {thickLabel}</span>
              <span className="text-ink-200">{counts.thick}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-signal-amber">▰ {thinLabel}</span>
              <span className="text-ink-200">{counts.thin}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-ink-700/40 pt-2">
              <span className="text-ink-400">thick / thin</span>
              <span className="text-signal-amber">
                {counts.thin > 0 ? (counts.thick / counts.thin).toFixed(4) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-ink-500">
              <span>φ ≈</span>
              <span>1.6180</span>
            </div>
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-ink-400">{hint}</p>
        </div>
      </div>
    </div>
  );
}
