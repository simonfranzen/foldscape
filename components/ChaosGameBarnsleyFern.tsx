"use client";

import { useEffect, useRef, useState } from "react";

// Inline Barnsley fern renderer. Tall canvas (~280×360) so the fern fits
// upright. Buttons: Play / Pause / Reset / Fast-forward 100k dots.

// Each entry: [a, b, c, d, e, f]  →  x' = a*x + b*y + e,  y' = c*x + d*y + f
const FERN_MAPS: Array<[number, number, number, number, number, number]> = [
  [0.0, 0.0, 0.0, 0.16, 0.0, 0.0],
  [0.85, 0.04, -0.04, 0.85, 0.0, 1.6],
  [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
  [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
];

// Cumulative probabilities: 0.01, 0.85, 0.07, 0.07
const FERN_CUM = [0.01, 0.86, 0.93, 1.0];

function pickMap(): number {
  const r = Math.random();
  for (let i = 0; i < FERN_CUM.length; i++) {
    if (r < FERN_CUM[i]) return i;
  }
  return FERN_CUM.length - 1;
}

interface Props {
  caption: string;
  playLabel: string;
  pauseLabel: string;
  resetLabel: string;
  fastForwardLabel: string;
  pointsLabel: (n: number) => string;
}

export function ChaosGameBarnsleyFern({
  caption,
  playLabel,
  pauseLabel,
  resetLabel,
  fastForwardLabel,
  pointsLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [points, setPoints] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const countRef = useRef(0);

  // Reset on tick
  useEffect(() => {
    countRef.current = 0;
    posRef.current = { x: 0, y: 0 };
    setPoints(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }, [resetTick]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [resetTick]);

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const SPEED = 8000;

    const tick = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const margin = 8;
      const sx = (W - 2 * margin) / 6;
      const sy = (H - 2 * margin) / 10;
      const scale = Math.min(sx, sy);
      const ox = W / 2;
      const oy = H - margin;

      ctx.fillStyle = "rgba(125, 243, 255, 0.55)";
      let { x, y } = posRef.current;
      for (let i = 0; i < SPEED; i++) {
        const m = pickMap();
        const map = FERN_MAPS[m];
        const nx = map[0] * x + map[1] * y + map[4];
        const ny = map[2] * x + map[3] * y + map[5];
        x = nx;
        y = ny;
        const px = ox + x * scale;
        const py = oy - y * scale;
        ctx.fillRect(px, py, 1, 1);
      }
      posRef.current = { x, y };
      countRef.current += SPEED;
      setPoints(countRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, resetTick]);

  const fastForward = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const margin = 8;
    const sx = (W - 2 * margin) / 6;
    const sy = (H - 2 * margin) / 10;
    const scale = Math.min(sx, sy);
    const ox = W / 2;
    const oy = H - margin;
    ctx.fillStyle = "rgba(125, 243, 255, 0.55)";
    let { x, y } = posRef.current;
    const N = 100000;
    for (let i = 0; i < N; i++) {
      const m = pickMap();
      const map = FERN_MAPS[m];
      const nx = map[0] * x + map[1] * y + map[4];
      const ny = map[2] * x + map[3] * y + map[5];
      x = nx;
      y = ny;
      const px = ox + x * scale;
      const py = oy - y * scale;
      ctx.fillRect(px, py, 1, 1);
    }
    posRef.current = { x, y };
    countRef.current += N;
    setPoints(countRef.current);
  };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-6">
          <canvas
            ref={canvasRef}
            className="hairline block rounded-md border bg-ink-950"
            style={{ width: 280, height: 360, maxWidth: "100%" }}
          />
        </div>
        <div className="space-y-3 md:col-span-6">
          <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-200">
            <div className="text-signal-amber">f₁ · p = 0.01 · stem</div>
            <div className="text-signal-cyan">f₂ · p = 0.85 · main spiral</div>
            <div className="text-signal-violet">f₃ · p = 0.07 · left leaflet</div>
            <div className="text-signal-rose">f₄ · p = 0.07 · right leaflet</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="rounded-full border border-signal-amber/60 bg-signal-amber/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20"
            >
              {playing ? pauseLabel : playLabel}
            </button>
            <button
              type="button"
              onClick={fastForward}
              className="rounded-full border border-signal-cyan/60 bg-signal-cyan/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20"
            >
              {fastForwardLabel}
            </button>
            <button
              type="button"
              onClick={() => setResetTick((t) => t + 1)}
              className="rounded-full border border-signal-rose/60 bg-signal-rose/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/20"
            >
              {resetLabel}
            </button>
          </div>
          <div className="hairline border-t pt-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
            {pointsLabel(points)}
          </div>
        </div>
      </div>
    </div>
  );
}
