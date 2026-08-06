"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline Barnsley fern renderer. Tall canvas (~280×360) so the fern fits
// upright. Buttons: Play / Pause / Reset / Fast-forward 100k dots.

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const FERN_FILL = hexToRgba(palette.signal.cyan, 0.55);

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

// Draw `count` fern points starting from `start`, returning the new position.
// Shared by the live loop, fast-forward, the reduced-motion static frame and
// the resize-while-paused redraw so they all agree on the mapping.
function drawFern(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  start: { x: number; y: number },
  count: number,
): { x: number; y: number } {
  const margin = 8;
  const scale = Math.min((W - 2 * margin) / 6, (H - 2 * margin) / 10);
  const ox = W / 2;
  const oy = H - margin;
  ctx.fillStyle = FERN_FILL;
  let { x, y } = start;
  for (let i = 0; i < count; i++) {
    const m = pickMap();
    const map = FERN_MAPS[m];
    const nx = map[0] * x + map[1] * y + map[4];
    const ny = map[2] * x + map[3] * y + map[5];
    x = nx;
    y = ny;
    ctx.fillRect(ox + x * scale, oy - y * scale, 1, 1);
  }
  return { x, y };
}

// A complete static fern for reduced-motion users / paused resizes.
const STATIC_BUDGET = 120_000;

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
  const dpr = useDpr();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [points, setPoints] = useState(0);
  const [resetTick, setResetTick] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const countRef = useRef(0);
  // Mirror latest play / reduced-motion state into refs so the resize handler
  // (whose effect must not re-run on those changes) can read them.
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  // Track prefers-reduced-motion live.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reset on tick
  useEffect(() => {
    countRef.current = 0;
    posRef.current = { x: 0, y: 0 };
    setPoints(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }, [resetTick]);

  // Canvas sizing. A resize reassigns canvas.width, which erases the picture,
  // so the point counter must reset too — otherwise the label keeps a stale
  // total over a blank canvas. When the loop is not running (paused, or
  // reduced-motion) we repaint a static fern so it does not vanish.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);
      countRef.current = 0;
      posRef.current = { x: 0, y: 0 };
      if (reduceRef.current || !playingRef.current) {
        posRef.current = drawFern(ctx, W, H, posRef.current, STATIC_BUDGET);
        countRef.current = STATIC_BUDGET;
      }
      setPoints(countRef.current);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [resetTick, dpr]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion: draw a complete static fern, no animation.
    if (reduceMotion) {
      posRef.current = drawFern(
        ctx,
        canvas.clientWidth,
        canvas.clientHeight,
        posRef.current,
        STATIC_BUDGET,
      );
      countRef.current += STATIC_BUDGET;
      setPoints(countRef.current);
      return;
    }

    if (!playing) return;

    let raf = 0;
    // 1500 points/frame lets the stem appear first, then the pinnae unfurl over
    // a couple of seconds, instead of the fern snapping into place instantly.
    const SPEED = 1500;

    const tick = () => {
      posRef.current = drawFern(ctx, canvas.clientWidth, canvas.clientHeight, posRef.current, SPEED);
      countRef.current += SPEED;
      setPoints(countRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, resetTick, reduceMotion]);

  const fastForward = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    posRef.current = drawFern(ctx, canvas.clientWidth, canvas.clientHeight, posRef.current, 100000);
    countRef.current += 100000;
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
            role="img"
            aria-label={caption}
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
