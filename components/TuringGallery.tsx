"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Four-cell static-living gallery showing the four canonical Gray-Scott
// regimes side by side. Each cell runs its own miniature simulation on a
// tiny grid so the patterns are alive but cheap to render. The user can
// hover/click to highlight a cell and read its description.

interface Regime {
  id: string;
  label: string;
  F: number;
  k: number;
  body: string;
}

const W = 64;
const H = 64;
const SIZE = W * H;
const STEPS_PER_FRAME = 25;

function buildLUT(
  stops: [[number, number, number], [number, number, number], [number, number, number]],
): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 3);
  const [bg, mid, hi] = stops;
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r: number, g: number, b: number;
    if (t < 0.5) {
      const u = t / 0.5;
      r = bg[0] + (mid[0] - bg[0]) * u;
      g = bg[1] + (mid[1] - bg[1]) * u;
      b = bg[2] + (mid[2] - bg[2]) * u;
    } else {
      const u = (t - 0.5) / 0.5;
      r = mid[0] + (hi[0] - mid[0]) * u;
      g = mid[1] + (hi[1] - mid[1]) * u;
      b = mid[2] + (hi[2] - mid[2]) * u;
    }
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }
  return lut;
}

const COLOR_STOPS: Array<
  [[number, number, number], [number, number, number], [number, number, number]]
> = [
  // amber
  [
    [6, 7, 13],
    [110, 55, 12],
    [255, 209, 102],
  ],
  // cyan
  [
    [6, 7, 13],
    [11, 64, 92],
    [125, 243, 255],
  ],
  // violet
  [
    [10, 6, 20],
    [60, 30, 110],
    [179, 136, 255],
  ],
  // rose
  [
    [14, 6, 12],
    [120, 30, 70],
    [255, 122, 182],
  ],
];

function seed(a: Float32Array, b: Float32Array): void {
  // Soft seeds (a≈0.5, b≈0.25 with a little noise) keep the explicit
  // Euler step stable. Hard 0/1 transitions inject Laplacians of size
  // ~4 and blow the integration up to NaN within a few iterations.
  a.fill(1);
  b.fill(0);
  for (let p = 0; p < 6; p++) {
    const cx = Math.floor(Math.random() * W);
    const cy = Math.floor(Math.random() * H);
    const r = 2 + Math.floor(Math.random() * 3);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const x = (cx + dx + W) % W;
        const y = (cy + dy + H) % H;
        const i = y * W + x;
        a[i] = 0.5 + (Math.random() - 0.5) * 0.1;
        b[i] = 0.25 + (Math.random() - 0.5) * 0.1;
      }
    }
  }
}

function MiniCell({
  regime,
  active,
  onActivate,
  colorIdx,
}: {
  regime: Regime;
  active: boolean;
  onActivate: () => void;
  colorIdx: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lut = useMemo(() => buildLUT(COLOR_STOPS[colorIdx]), [colorIdx]);
  const aRef = useRef(new Float32Array(SIZE));
  const bRef = useRef(new Float32Array(SIZE));
  const aNextRef = useRef(new Float32Array(SIZE));
  const bNextRef = useRef(new Float32Array(SIZE));

  useEffect(() => {
    seed(aRef.current, bRef.current);
    aNextRef.current.set(aRef.current);
    bNextRef.current.set(bRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(W, H);
    const data = image.data;
    // Pearson 1993 canonical constants: Da=0.16, Db=0.08 (Laplace amplifier
    // 4·Da·dt = 0.64 ≪ CFL = 1). The previous 1.0/0.5/1.0 was unstable —
    // hard-clamp masked the explosion but no real pattern emerged.
    const Da = 0.16;
    const Db = 0.08;
    const dt = 1.0;
    const F = regime.F;
    const k = regime.k;

    let raf = 0;
    const step = (): void => {
      const aCur = aRef.current;
      const bCur = bRef.current;
      let aNext = aNextRef.current;
      let bNext = bNextRef.current;
      for (let s = 0; s < STEPS_PER_FRAME; s++) {
        for (let y = 0; y < H; y++) {
          const yUp = y === 0 ? H - 1 : y - 1;
          const yDn = y === H - 1 ? 0 : y + 1;
          const row = y * W;
          const rowU = yUp * W;
          const rowD = yDn * W;
          for (let x = 0; x < W; x++) {
            const xL = x === 0 ? W - 1 : x - 1;
            const xR = x === W - 1 ? 0 : x + 1;
            const i = row + x;
            const aC = aCur[i];
            const bC = bCur[i];
            const lapA = aCur[row + xL] + aCur[row + xR] + aCur[rowU + x] + aCur[rowD + x] - 4 * aC;
            const lapB = bCur[row + xL] + bCur[row + xR] + bCur[rowU + x] + bCur[rowD + x] - 4 * bC;
            const abb = aC * bC * bC;
            let aN = aC + dt * (Da * lapA - abb + F * (1 - aC));
            let bN = bC + dt * (Db * lapB + abb - (F + k) * bC);
            if (aN < 0) aN = 0;
            else if (aN > 1) aN = 1;
            if (bN < 0) bN = 0;
            else if (bN > 1) bN = 1;
            aNext[i] = aN;
            bNext[i] = bN;
          }
        }
        const tmpA = aRef.current;
        const tmpB = bRef.current;
        aRef.current = aNext;
        bRef.current = bNext;
        aNextRef.current = tmpA;
        bNextRef.current = tmpB;
        aNext = aNextRef.current;
        bNext = bNextRef.current;
      }
      const b = bRef.current;
      for (let i = 0; i < SIZE; i++) {
        let v = b[i] * 3.5;
        if (v < 0) v = 0;
        else if (v > 1) v = 1;
        const idx = (v * 255) | 0;
        const o = i * 4;
        const l = idx * 3;
        data[o] = lut[l];
        data[o + 1] = lut[l + 1];
        data[o + 2] = lut[l + 2];
        data[o + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [lut, regime.F, regime.k]);

  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`space-y-3 rounded-2xl border p-3 text-left transition-colors ${
        active
          ? "border-signal-amber/60 bg-signal-amber/10"
          : "hairline bg-ink-950/40 hover:border-signal-amber/40"
      }`}
    >
      <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ imageRendering: "pixelated", aspectRatio: "1 / 1" }}
        />
      </div>
      <div className="space-y-1">
        <div
          className={`font-mono text-[10px] uppercase tracking-widest2 ${
            active ? "text-signal-amber" : "text-ink-300"
          }`}
        >
          {regime.label}
        </div>
        <div className="font-mono text-[9px] leading-snug text-ink-400">
          F = {regime.F.toFixed(4)} · k = {regime.k.toFixed(4)}
        </div>
      </div>
    </button>
  );
}

interface Props {
  caption: string;
  regimes: Array<{ id: string; label: string; F: number; k: number; body: string }>;
  hint: string;
}

export function TuringGallery({ caption, regimes, hint }: Props) {
  const [activeId, setActiveId] = useState(regimes[0]?.id ?? "");
  const active = regimes.find((r) => r.id === activeId) ?? regimes[0];

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {regimes.map((r, i) => (
          <MiniCell
            key={r.id}
            regime={r}
            active={r.id === activeId}
            onActivate={() => setActiveId(r.id)}
            colorIdx={i % COLOR_STOPS.length}
          />
        ))}
      </div>
      {active && (
        <div className="hairline space-y-1 rounded-xl border bg-ink-950/60 p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
            {active.label}
          </div>
          <p className="text-sm leading-relaxed text-ink-200">{active.body}</p>
        </div>
      )}
      <p className="text-xs leading-relaxed text-ink-400">{hint}</p>
    </div>
  );
}
