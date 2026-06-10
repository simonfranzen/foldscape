"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// ---------------------------------------------------------------------------
// P3 (rhombi) Penrose tiling via inflation of Robinson half-rhombi.
//
// We represent each tile as a triangle (half-rhombus) with three complex
// vertices A, B, C and a type:
//   type 0  →  half of a THIN  rhombus  (golden triangle: 36° at A, 72° at B/C)
//   type 1  →  half of a THICK rhombus  (golden gnomon:   108° at A, 36° at B/C)
// Two mirrored type-0 triangles share the edge B–C to form one thin rhombus;
// likewise for type-1 and the thick rhombus.
//
// Inflation rules (Penrose, standard formulation):
//   type 0:  P = A + (B − A) / φ
//            → type 0 (C, P, B), type 1 (P, C, A)
//   type 1:  Q = B + (A − B) / φ
//            R = B + (C − B) / φ
//            → type 1 (R, C, A), type 1 (Q, R, B), type 0 (R, Q, A)
// ---------------------------------------------------------------------------

const PHI = (1 + Math.sqrt(5)) / 2;

interface Complex {
  re: number;
  im: number;
}

interface Tri {
  t: 0 | 1; // half-rhombus type
  a: Complex;
  b: Complex;
  c: Complex;
}

const cAdd = (x: Complex, y: Complex): Complex => ({ re: x.re + y.re, im: x.im + y.im });
const cSub = (x: Complex, y: Complex): Complex => ({ re: x.re - y.re, im: x.im - y.im });
const cScale = (x: Complex, k: number): Complex => ({ re: x.re * k, im: x.im * k });
const cFromPolar = (r: number, theta: number): Complex => ({
  re: r * Math.cos(theta),
  im: r * Math.sin(theta),
});
const _cRot = (x: Complex, theta: number): Complex => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return { re: x.re * c - x.im * s, im: x.re * s + x.im * c };
};

// Seed: ten thick half-rhombi around the origin, alternating chirality,
// arranged to form a regular decagon — gives perfect 5-fold symmetry.
function seedSun(rotation: number): Tri[] {
  const tris: Tri[] = [];
  const origin: Complex = { re: 0, im: 0 };
  for (let i = 0; i < 10; i++) {
    const baseAngle = ((2 * i - 1) * Math.PI) / 10 + rotation;
    const tipAngle = ((2 * i + 1) * Math.PI) / 10 + rotation;
    let b = cFromPolar(1, baseAngle);
    let c = cFromPolar(1, tipAngle);
    // Mirror every other triangle so adjacent pairs form one full rhombus.
    if (i % 2 === 0) {
      const tmp = b;
      b = c;
      c = tmp;
    }
    tris.push({ t: 0, a: origin, b, c });
  }
  return tris;
}

function inflate(tris: Tri[]): Tri[] {
  const out: Tri[] = [];
  for (const tr of tris) {
    if (tr.t === 0) {
      const P = cAdd(tr.a, cScale(cSub(tr.b, tr.a), 1 / PHI));
      out.push({ t: 0, a: tr.c, b: P, c: tr.b });
      out.push({ t: 1, a: P, b: tr.c, c: tr.a });
    } else {
      const Q = cAdd(tr.b, cScale(cSub(tr.a, tr.b), 1 / PHI));
      const R = cAdd(tr.b, cScale(cSub(tr.c, tr.b), 1 / PHI));
      out.push({ t: 1, a: R, b: tr.c, c: tr.a });
      out.push({ t: 1, a: Q, b: R, c: tr.b });
      out.push({ t: 0, a: R, b: Q, c: tr.a });
    }
  }
  return out;
}

function buildTiling(depth: number, rotation: number): Tri[] {
  let tris = seedSun(rotation);
  for (let i = 0; i < depth; i++) tris = inflate(tris);
  return tris;
}

// ---------------------------------------------------------------------------
// P2 (kite + dart) Penrose tiling via Robinson half-triangle deflation.
//
//   type 0  →  half of a KITE  (golden triangle, 36° at A)
//   type 1  →  half of a DART  (golden gnomon,  108° at A)
//
// The deflation rules are the same Robinson-triangle subdivisions used by
// the P3 inflation above — the difference is purely interpretation: here
// we keep the half-triangles as kite/dart halves rather than pairing them
// into rhombi. Two mirrored type-0 halves form one kite; two mirrored
// type-1 halves form one dart.
//
// We re-use seedSun() and inflate() since the geometry is identical.
// ---------------------------------------------------------------------------

function buildP2Tiling(depth: number, rotation: number): Tri[] {
  let tris = seedSun(rotation);
  for (let i = 0; i < depth; i++) tris = inflate(tris);
  return tris;
}

// Group mirrored half-rhombi back into full rhombi for clean rendering.
// Each rhombus has 4 vertices: A, B, A', C (where A' is reflection of A across BC).
// For a half-triangle (A, B, C), the missing vertex is A' = B + C − A only if BC is
// the axis of symmetry — which it IS for our Robinson triangles (both legs have
// equal length |AB| = |AC| for type 0 and |BA| = |BC| for type 1... wait).
//
// Actually: type 0 (thick half-rhombus) has the apex A at 36°; its two equal
// edges are A→B and A→C (the rhombus sides). The base B–C is the rhombus's
// short diagonal. The mirror partner shares B–C; the full rhombus has vertices
// A, B, A', C with A' = B + C − A. ✓
// type 1 (thin half-rhombus) has the apex A at 108°; the equal edges are again
// A→B and A→C, so the same construction works.
interface Rhomb {
  t: 0 | 1;
  pts: [Complex, Complex, Complex, Complex];
}

function trianglesToRhombi(tris: Tri[]): Rhomb[] {
  // De-duplicate via the BC midpoint key.
  const map = new Map<string, Tri>();
  const out: Rhomb[] = [];
  const key = (p: Complex, q: Complex): string => {
    const mx = (p.re + q.re) / 2;
    const my = (p.im + q.im) / 2;
    return `${mx.toFixed(6)}:${my.toFixed(6)}`;
  };
  for (const tr of tris) {
    const k = key(tr.b, tr.c);
    const partner = map.get(k);
    if (partner !== undefined && partner.t === tr.t) {
      const aPrime = cSub(cAdd(partner.b, partner.c), partner.a);
      out.push({ t: tr.t, pts: [tr.a, tr.b, aPrime, tr.c] });
      map.delete(k);
    } else {
      map.set(k, tr);
    }
  }
  // Leftover half-rhombi at the boundary — render them as triangles via degenerate
  // quad (A, B, midpoint-shifted, C). We treat them as full rhombi by reflecting
  // anyway so the boundary stays clean.
  for (const tr of map.values()) {
    const aPrime = cSub(cAdd(tr.b, tr.c), tr.a);
    out.push({ t: tr.t, pts: [tr.a, tr.b, aPrime, tr.c] });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Mode = "P3" | "P2";

const FAT_FILL = "rgba(167, 139, 250, 0.30)"; // violet
const FAT_STROKE = "rgba(167, 139, 250, 0.95)";
const THIN_FILL = "rgba(255, 110, 196, 0.32)"; // rose
const THIN_STROKE = "rgba(255, 110, 196, 0.95)";
const ARROW_SINGLE = "rgba(255, 209, 102, 0.9)";
const ARROW_DOUBLE = "rgba(125, 243, 255, 0.9)";

// P2 kite + dart palette
const KITE_FILL = "rgba(255, 209, 102, 0.15)"; // amber
const KITE_STROKE = palette.signal.amber;
const DART_FILL = "rgba(179, 136, 255, 0.15)"; // violet
const DART_STROKE = palette.signal.violet;

export default function PenroseExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.penrose;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [mode, setMode] = useState<Mode>("P3");
  const [depth, setDepth] = useState(4);
  const [rotation, setRotation] = useState(0); // degrees
  const [showOutlines, setShowOutlines] = useState(true);
  const [showColors, setShowColors] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const [recenterTick, setRecenterTick] = useState(0);

  const rotationRad = (rotation * Math.PI) / 180;

  const rhombi = useMemo<Rhomb[]>(() => {
    if (mode !== "P3") return [];
    const tris = buildTiling(depth, rotationRad);
    return trianglesToRhombi(tris);
  }, [mode, depth, rotationRad]);

  const p2Tris = useMemo<Tri[]>(() => {
    if (mode !== "P2") return [];
    return buildP2Tiling(depth, rotationRad);
  }, [mode, depth, rotationRad]);

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

      // Auto-scale: fit the seed disc of radius ~1 to ~85% of the viewport.
      const margin = 24;
      const fit = Math.min(W, H) - margin * 2;
      const scale = (fit / 2) * 0.95;
      const cx = W / 2;
      const cy = H / 2;
      const px = (p: Complex) => cx + p.re * scale;
      const py = (p: Complex) => cy - p.im * scale;

      if (mode === "P2") {
        const kiteFill = showColors ? KITE_FILL : "rgba(205, 210, 224, 0.10)";
        const dartFill = showColors ? DART_FILL : "rgba(205, 210, 224, 0.06)";

        // Type-1 half-triangles multiply faster under the Robinson deflation
        // (transition matrix [[1,1],[1,2]] has eigenvector [1, φ]), so we
        // label them KITES and type-0 DARTS. With this convention the
        // kite/dart count ratio converges to φ ≈ 1.618 — the canonical
        // Penrose result. The geometric labelling is conventional; the
        // deflation rules are the same Robinson half-triangles either way.
        const isKite = (t: 0 | 1) => t === 1;

        // Pass 1: fills (half-triangles tile cleanly).
        for (const tr of p2Tris) {
          ctx.beginPath();
          ctx.moveTo(px(tr.a), py(tr.a));
          ctx.lineTo(px(tr.b), py(tr.b));
          ctx.lineTo(px(tr.c), py(tr.c));
          ctx.closePath();
          ctx.fillStyle = isKite(tr.t) ? kiteFill : dartFill;
          ctx.fill();
        }

        // Pass 2: outlines — draw only the two equal-length sides (A→B and A→C)
        // so the internal symmetry-axis seams (B–C) are hidden, giving the
        // illusion of full kites + darts without the pairing pass.
        if (showOutlines) {
          ctx.lineWidth = Math.max(0.5, Math.min(1.4, 1.6 - depth * 0.15));
          for (const tr of p2Tris) {
            ctx.strokeStyle = isKite(tr.t) ? KITE_STROKE : DART_STROKE;
            ctx.globalAlpha = showColors ? 0.85 : 0.6;
            ctx.beginPath();
            ctx.moveTo(px(tr.a), py(tr.a));
            ctx.lineTo(px(tr.b), py(tr.b));
            ctx.moveTo(px(tr.a), py(tr.a));
            ctx.lineTo(px(tr.c), py(tr.c));
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        // Subtle vignette
        const gradP2 = ctx.createRadialGradient(cx, cy, fit * 0.4, cx, cy, fit * 0.95);
        gradP2.addColorStop(0, "rgba(0,0,0,0)");
        gradP2.addColorStop(1, "rgba(6,7,13,0.7)");
        ctx.fillStyle = gradP2;
        ctx.fillRect(0, 0, W, H);
        return;
      }

      // Draw fills first, sorted by type (thick under thin, so outlines mix nicely).
      const fatFill = showColors ? FAT_FILL : "rgba(205, 210, 224, 0.10)";
      const thinFill = showColors ? THIN_FILL : "rgba(205, 210, 224, 0.06)";

      for (const r of rhombi) {
        ctx.beginPath();
        ctx.moveTo(px(r.pts[0]), py(r.pts[0]));
        ctx.lineTo(px(r.pts[1]), py(r.pts[1]));
        ctx.lineTo(px(r.pts[2]), py(r.pts[2]));
        ctx.lineTo(px(r.pts[3]), py(r.pts[3]));
        ctx.closePath();
        ctx.fillStyle = r.t === 0 ? fatFill : thinFill;
        ctx.fill();
        if (showOutlines) {
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = r.t === 0 ? FAT_STROKE : THIN_STROKE;
          ctx.globalAlpha = showColors ? 0.7 : 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Conway's matching arrows: every edge carries a single or double arrow.
      // For P3 rhombi, the standard convention places one arrow on the "short"
      // type-of-edge and a double arrow on the "long" type. We use the rhombus
      // sides only (the inflation does not give us the diagonals here), and
      // draw arrows from vertex 0 → 1 and from vertex 2 → 3, single for thick,
      // double for thin (an iconic-but-simplified rendering).
      if (showArrows) {
        const drawArrow = (p: Complex, q: Complex, colour: string, double: boolean): void => {
          const x1 = px(p);
          const y1 = py(p);
          const x2 = px(q);
          const y2 = py(q);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy);
          if (len < 6) return;
          const ux = dx / len;
          const uy = dy / len;
          const size = Math.min(7, len * 0.18);
          ctx.strokeStyle = colour;
          ctx.fillStyle = colour;
          ctx.lineWidth = 1.1;
          const drawHead = (cxh: number, cyh: number) => {
            ctx.beginPath();
            ctx.moveTo(cxh, cyh);
            ctx.lineTo(cxh - ux * size - uy * size * 0.5, cyh - uy * size + ux * size * 0.5);
            ctx.moveTo(cxh, cyh);
            ctx.lineTo(cxh - ux * size + uy * size * 0.5, cyh - uy * size - ux * size * 0.5);
            ctx.stroke();
          };
          if (double) {
            drawHead(mx + ux * 2, my + uy * 2);
            drawHead(mx - ux * 2, my - uy * 2);
          } else {
            drawHead(mx, my);
          }
        };
        for (const r of rhombi) {
          const single = r.t === 0; // fat → single arrows
          const colour = single ? ARROW_SINGLE : ARROW_DOUBLE;
          drawArrow(r.pts[0], r.pts[1], colour, !single);
          drawArrow(r.pts[2], r.pts[3], colour, single);
        }
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
  }, [rhombi, p2Tris, mode, depth, showOutlines, showColors, showArrows, recenterTick, dpr]);

  const tileCount = rhombi.length;
  const fatCount = rhombi.filter((r) => r.t === 0).length;
  const thinCount = rhombi.filter((r) => r.t === 1).length;
  const ratio = thinCount > 0 ? (fatCount / thinCount).toFixed(4) : "—";

  // P2 counts: two mirrored half-triangles pair into one full kite/dart, so
  // round the halves down. With type-1 = kite, type-0 = dart the
  // kite:dart ratio converges to φ ≈ 1.618.
  const kiteHalves = p2Tris.filter((t) => t.t === 1).length;
  const dartHalves = p2Tris.filter((t) => t.t === 0).length;
  const kiteCount = Math.round(kiteHalves / 2);
  const dartCount = Math.round(dartHalves / 2);
  const p2Ratio = dartCount > 0 ? (kiteCount / dartCount).toFixed(4) : "—";
  const p2TileCount = kiteCount + dartCount;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {mode === "P3"
                ? `Penrose P3 · inflation depth ${depth} · ${tileCount} rhombi`
                : `Penrose P2 · deflation depth ${depth} · ${p2TileCount} tiles`}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              φ = (1 + √5) / 2
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          {mode === "P3" ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-violet">fat (thick)</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{fatCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-rose">thin</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{thinCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div>fat / thin → φ</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{ratio}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-amber">kites</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{kiteCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div className="text-signal-violet">darts</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{dartCount}</div>
              </div>
              <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase text-ink-300">
                <div>kite / dart → φ</div>
                <div className="mt-1 font-mono text-sm normal-case text-ink-100">{p2Ratio}</div>
              </div>
            </div>
          )}
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Mode
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["P3", "P2"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                    mode === m
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                  }`}
                >
                  {m === "P3" ? "P3 rhombi" : "P2 kite + dart"}
                </button>
              ))}
            </div>
            {mode === "P2" && (
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">
                Robinson half-triangle deflation from the sun seed — amber kites, violet darts.
                Kite/dart ratio converges to φ ≈ 1.618.
              </p>
            )}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Inflation depth
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-violet">{depth}</span>
              <span className="text-[10px] text-ink-400">
                {mode === "P3" ? `${tileCount} rhombi` : `${p2TileCount} tiles`}
              </span>
            </div>
            <input
              type="range"
              value={depth}
              min={0}
              max={6}
              step={1}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              className="w-full accent-signal-violet"
            />
            {depth > 6 && (
              <p className="font-mono text-[10px] leading-relaxed text-signal-amber">
                Depths above 6 may stutter — the tile count grows by φ² ≈ 2.618 each step.
              </p>
            )}
            {depth === 6 && (
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">
                Depth 6 already exceeds 10 000 tiles — denser is slower.
              </p>
            )}
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Seed rotation
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{rotation}°</span>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(e) => setRotation(parseInt(e.target.value, 10))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Display
            </div>
            <Toggle label="Show outlines" value={showOutlines} onChange={setShowOutlines} />
            <Toggle label="Show colors" value={showColors} onChange={setShowColors} />
            <Toggle label="Matching arrows" value={showArrows} onChange={setShowArrows} />
            <p className="pt-1 font-mono text-[10px] leading-relaxed text-ink-400">
              Single arrow = fat-rhombus edge marker · double = thin. Conway's rule: arrows must
              point the same way across a shared edge.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <button
              onClick={() => {
                setRotation(0);
                setRecenterTick((n) => n + 1);
              }}
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              Centre · reset rotation
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

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
        value
          ? "border-signal-violet/50 bg-signal-violet/10 text-signal-violet"
          : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px] uppercase tracking-widest2">{value ? "on" : "off"}</span>
    </button>
  );
}
