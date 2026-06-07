"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Panel = "spiral" | "ratios" | "sunflower";

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_STR = "1.618033988749";
// Golden angle in radians ≈ 2.39996
const GOLDEN_ANGLE_RAD = Math.PI * (3 - Math.sqrt(5));
const GOLDEN_ANGLE_DEG = 360 / (PHI * PHI); // ≈ 137.507764...

// Precompute Fibonacci numbers up to a safe length.
const FIB: number[] = (() => {
  const out: number[] = [0, 1];
  for (let i = 2; i < 31; i++) out.push(out[i - 1] + out[i - 2]);
  return out;
})();

export default function PhiExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.phi;

  const [panel, setPanel] = useState<Panel>("spiral");

  // Spiral controls
  const [spiralDepth, setSpiralDepth] = useState(10);

  // Ratios controls
  const [ratiosN, setRatiosN] = useState(12);

  // Sunflower controls
  const [angleDeg, setAngleDeg] = useState(GOLDEN_ANGLE_DEG);
  const [seedCount, setSeedCount] = useState(800);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {(
                [
                  { key: "spiral", label: "Spiral" },
                  { key: "ratios", label: "Ratios" },
                  { key: "sunflower", label: "Sunflower" },
                ] as ReadonlyArray<{ key: Panel; label: string }>
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPanel(t.key)}
                  className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    panel === t.key
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-300 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              φ = (1 + √5) / 2 ≈ {PHI_STR}
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            {panel === "spiral" && <SpiralPanel depth={spiralDepth} />}
            {panel === "ratios" && <RatiosPanel n={ratiosN} />}
            {panel === "sunflower" && <SunflowerPanel angleDeg={angleDeg} count={seedCount} />}
          </div>

          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
            {panel === "spiral" &&
              `Fibonacci squares · depth ${spiralDepth} · golden rectangle ratio ${(
                FIB[spiralDepth + 1] / FIB[spiralDepth]
              ).toFixed(8)}`}
            {panel === "ratios" && `Ratios Fₙ₊₁/Fₙ for n = 1 … ${ratiosN} · target φ ≈ ${PHI_STR}`}
            {panel === "sunflower" &&
              `Vogel phyllotaxis · α = ${angleDeg.toFixed(4)}° · ${seedCount} seeds`}
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
              Panel
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: "spiral", label: "Spiral" },
                  { key: "ratios", label: "Ratios" },
                  { key: "sunflower", label: "Sunflower" },
                ] as ReadonlyArray<{ key: Panel; label: string }>
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPanel(t.key)}
                  className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    panel === t.key
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-300 hover:border-signal-amber/40 hover:text-ink-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {panel === "spiral" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Depth · squares to show
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-amber">{spiralDepth}</span>
                <span className="text-xs text-ink-400">side {FIB[spiralDepth]}</span>
              </div>
              <input
                type="range"
                value={spiralDepth}
                min={3}
                max={14}
                step={1}
                onChange={(e) => setSpiralDepth(parseInt(e.target.value))}
                className="w-full accent-signal-amber"
              />
              <p className="text-[11px] leading-relaxed text-ink-400">
                Each square's side is the next Fibonacci number; a quarter-circle inside each
                connects into the golden spiral. The outer rectangle's aspect ratio approaches φ.
              </p>
            </div>
          )}

          {panel === "ratios" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                n — terms
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-amber">{ratiosN}</span>
                <span className="text-xs text-ink-400">
                  F{ratiosN + 1}/F{ratiosN} = {(FIB[ratiosN + 1] / FIB[ratiosN]).toFixed(10)}
                </span>
              </div>
              <input
                type="range"
                value={ratiosN}
                min={2}
                max={20}
                step={1}
                onChange={(e) => setRatiosN(parseInt(e.target.value))}
                className="w-full accent-signal-amber"
              />
              <p className="text-[11px] leading-relaxed text-ink-400">
                Each ratio sits above or below φ alternately and the gap shrinks by a factor of ψ² ≈
                0.382 each step.
              </p>
            </div>
          )}

          {panel === "sunflower" && (
            <>
              <div className="hairline space-y-3 border-b p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Divergence angle α
                </div>
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-signal-amber">{angleDeg.toFixed(4)}°</span>
                  <span className="text-xs text-ink-400">
                    Δ = {(angleDeg - GOLDEN_ANGLE_DEG).toFixed(4)}°
                  </span>
                </div>
                <input
                  type="range"
                  value={angleDeg}
                  min={137.4}
                  max={137.6}
                  step={0.0005}
                  onChange={(e) => setAngleDeg(parseFloat(e.target.value))}
                  className="w-full accent-signal-amber"
                />
                <button
                  onClick={() => setAngleDeg(GOLDEN_ANGLE_DEG)}
                  className="w-full rounded-md border border-signal-amber/40 bg-signal-amber/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20"
                >
                  Snap to φ angle (360°/φ²)
                </button>
                <p className="text-[11px] leading-relaxed text-ink-400">
                  At the golden angle (137.5078°) seeds pack without gaps or preferred direction.
                  Nudge by even a hundredth of a degree and clear spiral arms appear.
                </p>
              </div>

              <div className="hairline space-y-3 border-b p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Seed count
                </div>
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-signal-amber">{seedCount}</span>
                </div>
                <input
                  type="range"
                  value={seedCount}
                  min={50}
                  max={2000}
                  step={10}
                  onChange={(e) => setSeedCount(parseInt(e.target.value))}
                  className="w-full accent-signal-amber"
                />
              </div>
            </>
          )}

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              The constant
            </div>
            <div className="hairline rounded-md border bg-ink-950/60 p-3 text-center font-mono text-base text-signal-amber">
              φ = {PHI_STR}
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-ink-400">
              <div className="hairline rounded border px-2 py-1">1/φ = 0.618033988749</div>
              <div className="hairline rounded border px-2 py-1">φ² = 2.618033988749</div>
              <div className="hairline rounded border px-2 py-1">ψ = −0.618033988749</div>
              <div className="hairline rounded border px-2 py-1">360°/φ² = 137.5078°</div>
            </div>
          </div>

          <div className="p-5">
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

// ----------------------------------------------------------------------------
// Spiral panel — nested Fibonacci squares + quarter-arc spiral
// ----------------------------------------------------------------------------

function SpiralPanel({ depth }: { depth: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      // Squares' sides are F_1, F_2, ..., F_depth (always ≥ 1)
      const sides: number[] = [];
      for (let i = 1; i <= depth; i++) sides.push(FIB[i]);

      // Lay out squares by attaching new square on the side of the bounding
      // rectangle in CCW order: right, top, left, bottom, repeating.
      type Rect = { x: number; y: number; w: number; h: number };
      const rects: Rect[] = [];
      // first square
      const first: Rect = { x: 0, y: 0, w: sides[0], h: sides[0] };
      rects.push(first);
      let bx = first.x;
      let by = first.y;
      let bw = first.w;
      let bh = first.h;
      // sides direction: 0=right, 1=top, 2=left, 3=bottom
      for (let i = 1; i < sides.length; i++) {
        const s = sides[i];
        const dir = (i - 1) % 4;
        let r: Rect;
        if (dir === 0) {
          r = { x: bx + bw, y: by, w: s, h: bh };
        } else if (dir === 1) {
          r = { x: bx, y: by - s, w: bw, h: s };
        } else if (dir === 2) {
          r = { x: bx - s, y: by, w: s, h: bh };
        } else {
          r = { x: bx, y: by + bh, w: bw, h: s };
        }
        rects.push(r);
        const nx = Math.min(bx, r.x);
        const ny = Math.min(by, r.y);
        const nw = Math.max(bx + bw, r.x + r.w) - nx;
        const nh = Math.max(by + bh, r.y + r.h) - ny;
        bx = nx;
        by = ny;
        bw = nw;
        bh = nh;
      }

      // Compute bounding box and a transform to fit the canvas.
      const pad = 30;
      const scale = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);
      const ox = (W - bw * scale) / 2 - bx * scale;
      const oy = (H - bh * scale) / 2 - by * scale;

      const tx = (x: number) => ox + x * scale;
      const ty = (y: number) => oy + y * scale;

      // Outer golden rectangle
      ctx.strokeStyle = "rgba(255, 209, 102, 0.35)";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(tx(bx), ty(by), bw * scale, bh * scale);

      // Squares
      ctx.font = "11px ui-monospace, monospace";
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        const alpha = 0.18 + (i / rects.length) * 0.35;
        ctx.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
        ctx.fillStyle = `rgba(255, 209, 102, ${0.04 + (i / rects.length) * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(tx(r.x), ty(r.y), r.w * scale, r.h * scale);
        ctx.fill();
        ctx.stroke();
        if (r.w * scale > 28 && r.h * scale > 18) {
          ctx.fillStyle = "rgba(255, 232, 170, 0.85)";
          ctx.fillText(String(sides[i]), tx(r.x) + 6, ty(r.y) + 14);
        }
      }

      // Quarter-circle spiral. For each square the arc spans 90° around a
      // corner that points away from the bounding rectangle's center.
      ctx.strokeStyle = "rgba(255, 122, 182, 0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        const dir = (i - 1) % 4; // dir of attachment for i≥1
        // For i=0 use dir as if "right" (start of spiral).
        let cx = r.x;
        let cy = r.y;
        let startAngle = 0;
        if (i === 0) {
          // first square: arc from top-right corner sweeping inward toward bottom-left
          cx = r.x;
          cy = r.y + r.h;
          startAngle = -Math.PI / 2;
        } else if (dir === 0) {
          // square attached to the right: center at bottom-left of square
          cx = r.x;
          cy = r.y + r.h;
          startAngle = -Math.PI / 2;
        } else if (dir === 1) {
          // square attached to the top: center at bottom-right
          cx = r.x + r.w;
          cy = r.y + r.h;
          startAngle = Math.PI;
        } else if (dir === 2) {
          // square attached to the left: center at top-right
          cx = r.x + r.w;
          cy = r.y;
          startAngle = Math.PI / 2;
        } else {
          // square attached to the bottom: center at top-left
          cx = r.x;
          cy = r.y;
          startAngle = 0;
        }
        const radius = Math.min(r.w, r.h) * scale;
        ctx.arc(tx(cx), ty(cy), radius, startAngle, startAngle + Math.PI / 2);
      }
      ctx.stroke();
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [depth]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}

// ----------------------------------------------------------------------------
// Ratios panel — line chart of F_{n+1}/F_n approaching φ
// ----------------------------------------------------------------------------

function RatiosPanel({ n }: { n: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ratios = useMemo(() => {
    const out: number[] = [];
    for (let i = 1; i <= n; i++) out.push(FIB[i + 1] / FIB[i]);
    return out;
  }, [n]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const padL = 60;
      const padR = 20;
      const padT = 30;
      const padB = 40;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;

      // y range: 1.0 .. 2.5
      const yMin = 1.0;
      const yMax = 2.5;
      const xOf = (i: number) =>
        padL + (ratios.length <= 1 ? innerW / 2 : (i / (ratios.length - 1)) * innerW);
      const yOf = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

      // Grid + y labels
      ctx.strokeStyle = "rgba(138,144,164,0.1)";
      ctx.lineWidth = 1;
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = "rgba(180,188,210,0.6)";
      for (let i = 0; i <= 6; i++) {
        const v = yMin + (i / 6) * (yMax - yMin);
        const y = yOf(v);
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
        ctx.fillText(v.toFixed(2), 8, y + 3);
      }

      // φ line
      ctx.strokeStyle = "rgba(125, 243, 255, 0.7)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, yOf(PHI));
      ctx.lineTo(W - padR, yOf(PHI));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#7df3ff";
      ctx.fillText(`φ ≈ ${PHI_STR}`, W - padR - 130, yOf(PHI) - 6);

      // Line of ratios
      ctx.strokeStyle = "rgba(255, 209, 102, 0.85)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < ratios.length; i++) {
        const px = xOf(i);
        const py = yOf(ratios[i]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points + last-point highlight
      for (let i = 0; i < ratios.length; i++) {
        const px = xOf(i);
        const py = yOf(ratios[i]);
        const isLast = i === ratios.length - 1;
        ctx.fillStyle = isLast ? "#ffd166" : "rgba(255, 209, 102, 0.6)";
        ctx.beginPath();
        ctx.arc(px, py, isLast ? 4 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // x-axis labels (sparse)
      ctx.fillStyle = "rgba(180,188,210,0.6)";
      const step = Math.max(1, Math.ceil(ratios.length / 10));
      for (let i = 0; i < ratios.length; i += step) {
        const px = xOf(i);
        ctx.fillText(String(i + 1), px - 6, H - 18);
      }
      ctx.fillStyle = "rgba(180,188,210,0.8)";
      ctx.fillText("n", padL + innerW / 2, H - 4);

      // Last value annotation
      if (ratios.length > 0) {
        const last = ratios[ratios.length - 1];
        const lx = xOf(ratios.length - 1);
        const ly = yOf(last);
        ctx.fillStyle = "#ffd166";
        ctx.fillText(
          `F${ratios.length + 1}/F${ratios.length} = ${last.toFixed(10)}`,
          lx - 200,
          ly - 10,
        );
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [ratios]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}

// ----------------------------------------------------------------------------
// Sunflower panel — Vogel phyllotaxis
// ----------------------------------------------------------------------------

function SunflowerPanel({ angleDeg, count }: { angleDeg: number; count: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) / 2 - 20;
      const c = R / Math.sqrt(count);
      const alpha = (angleDeg * Math.PI) / 180;

      // Subtle disc backdrop
      ctx.strokeStyle = "rgba(138,144,164,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      const isGolden = Math.abs(angleDeg - GOLDEN_ANGLE_DEG) < 0.0005;

      for (let n = 1; n <= count; n++) {
        const r = c * Math.sqrt(n);
        const theta = n * alpha;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const t = n / count;
        // Amber-pink gradient outward
        const red = 255;
        const green = Math.round(209 - 60 * t);
        const blue = Math.round(102 + 80 * t);
        ctx.fillStyle = `rgba(${red},${green},${blue},0.85)`;
        const size = Math.max(1.2, c * 0.45);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Status badge top-left
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillStyle = isGolden ? "#ffd166" : "rgba(180,188,210,0.8)";
      ctx.fillText(
        isGolden
          ? `α = golden angle (137.5078°) — no spiral arms`
          : `α = ${angleDeg.toFixed(4)}° (Δ ${(angleDeg - GOLDEN_ANGLE_DEG).toFixed(4)}°) — spiral arms appear`,
        14,
        20,
      );

      // Reference: also annotate golden angle in radians
      ctx.fillStyle = "rgba(180,188,210,0.6)";
      ctx.fillText(`golden angle = π(3 − √5) ≈ ${GOLDEN_ANGLE_RAD.toFixed(6)} rad`, 14, H - 12);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [angleDeg, count]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
