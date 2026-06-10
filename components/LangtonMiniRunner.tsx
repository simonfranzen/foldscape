"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// LangtonMiniRunner — a compact, story-page-friendly demo of Langton's Ant.
// Renders to a small canvas (~340×280), with Play/Pause, Step, Reset and a
// steps-per-frame slider. Shows step counter and current heading.

interface Props {
  label?: string;
  caption?: string;
  initialStepsPerFrame?: number;
}

const CELL = 5; // CSS px per cell

const ANT_COLORS = {
  bg: palette.canvas.bg,
  white: "#e8eaf2",
  // "black" cells render as violet for contrast on the violet page
  black: palette.signal.violet,
  head: palette.signal.amber,
};

const DIR_GLYPH = ["N", "E", "S", "W"];

export function LangtonMiniRunner({
  label = "Mini runner · classic RL",
  caption,
  initialStepsPerFrame = 8,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [running, setRunning] = useState(true);
  const [stepsPerFrame, setStepsPerFrame] = useState(initialStepsPerFrame);
  const [stepCount, setStepCount] = useState(0);
  const [dir, setDir] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  // Refs to expose mutable handles to the rAF loop without re-binding effects.
  const runningRef = useRef(running);
  const spfRef = useRef(stepsPerFrame);
  const singleStepRef = useRef(0);
  runningRef.current = running;
  spfRef.current = stepsPerFrame;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellPx = CELL * dpr;
    let raf = 0;

    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let gridW = Math.max(20, Math.floor(canvas.width / cellPx));
    let gridH = Math.max(20, Math.floor(canvas.height / cellPx));
    let grid = new Uint8Array(gridW * gridH);
    let ax = Math.floor(gridW / 2);
    let ay = Math.floor(gridH / 2);
    let antDir = 0; // 0=N 1=E 2=S 3=W
    let total = 0;

    const paintAll = () => {
      ctx.fillStyle = ANT_COLORS.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          if (grid[y * gridW + x] === 1) {
            ctx.fillStyle = ANT_COLORS.black;
            ctx.fillRect(x * cellPx, y * cellPx, cellPx, cellPx);
          }
        }
      }
    };

    const reseed = () => {
      gridW = Math.max(20, Math.floor(canvas.width / cellPx));
      gridH = Math.max(20, Math.floor(canvas.height / cellPx));
      grid = new Uint8Array(gridW * gridH);
      ax = Math.floor(gridW / 2);
      ay = Math.floor(gridH / 2);
      antDir = 0;
      total = 0;
      paintAll();
    };
    reseed();

    const stepOnce = () => {
      const idx = ay * gridW + ax;
      const c = grid[idx];
      // Classic Langton: white (0) → R, black (1) → L; flip; step
      if (c === 0) antDir = (antDir + 1) & 3;
      else antDir = (antDir + 3) & 3;
      const next = c === 0 ? 1 : 0;
      grid[idx] = next;
      // Paint just the cell we changed.
      if (next === 1) {
        ctx.fillStyle = ANT_COLORS.black;
        ctx.fillRect(ax * cellPx, ay * cellPx, cellPx, cellPx);
      } else {
        ctx.fillStyle = ANT_COLORS.bg;
        ctx.fillRect(ax * cellPx, ay * cellPx, cellPx, cellPx);
      }
      // Move (torus)
      if (antDir === 0) ay = (ay - 1 + gridH) % gridH;
      else if (antDir === 1) ax = (ax + 1) % gridW;
      else if (antDir === 2) ay = (ay + 1) % gridH;
      else ax = (ax - 1 + gridW) % gridW;
      total++;
    };

    const drawHead = () => {
      ctx.fillStyle = ANT_COLORS.head;
      ctx.fillRect(ax * cellPx, ay * cellPx, cellPx, cellPx);
    };

    let lastReport = 0;
    let lastDirReport = -1;

    const loop = () => {
      // Erase the previous head position by repainting the cell beneath it.
      const idx = ay * gridW + ax;
      ctx.fillStyle = grid[idx] === 1 ? ANT_COLORS.black : ANT_COLORS.bg;
      ctx.fillRect(ax * cellPx, ay * cellPx, cellPx, cellPx);

      const want = singleStepRef.current;
      if (want > 0) {
        for (let i = 0; i < want; i++) stepOnce();
        singleStepRef.current = 0;
      }
      if (runningRef.current) {
        const n = spfRef.current;
        for (let i = 0; i < n; i++) stepOnce();
      }
      drawHead();

      if (total - lastReport >= 5) {
        setStepCount(total);
        lastReport = total;
      }
      if (antDir !== lastDirReport) {
        setDir(antDir);
        lastDirReport = antDir;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [resetTick, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
          {label}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          step <span className="text-signal-violet">{stepCount.toLocaleString()}</span>
          {"  ·  "}
          dir <span className="text-signal-violet">{DIR_GLYPH[dir]}</span>
        </div>
      </div>

      <div className="hairline relative aspect-[17/14] w-full overflow-hidden rounded-md border bg-ink-950">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setRunning((v) => !v)}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            running
              ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose hover:bg-signal-rose/20"
              : "border-signal-violet/60 bg-signal-violet/10 text-signal-violet hover:bg-signal-violet/20"
          }`}
        >
          {running ? "❚❚ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => {
            singleStepRef.current += 1;
          }}
          className="hairline rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
        >
          step
        </button>
        <button
          onClick={() => {
            singleStepRef.current += 100;
          }}
          className="hairline rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
        >
          +100
        </button>
        <button
          onClick={() => setResetTick((t) => t + 1)}
          className="hairline hover:text-ink-50 rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
        >
          ⟳ reset
        </button>
        <div className="flex min-w-[140px] flex-1 items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            speed
          </span>
          <input
            type="range"
            min={1}
            max={120}
            step={1}
            value={stepsPerFrame}
            onChange={(e) => setStepsPerFrame(parseInt(e.target.value, 10))}
            className="flex-1 accent-signal-violet"
          />
          <span className="w-10 text-right font-mono text-[10px] text-ink-400">
            {stepsPerFrame}
          </span>
        </div>
      </div>

      {caption && (
        <p className="text-center font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
          {caption}
        </p>
      )}
    </div>
  );
}
