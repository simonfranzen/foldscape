"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Small inline Galton board: balls cascade through a triangle of pegs,
// filling a histogram below. Two sliders — rows N and spawn rate. Tuned
// to live inside a story page (≈300×400) without dominating the layout.

interface Ball {
  x: number; // signed half-step offset from centre column
  y: number; // row index (0..rows)
  done: boolean;
  bin: number;
}

interface Props {
  caption?: string;
  rowsLabel?: string;
  spawnLabel?: string;
  ballsLabel?: (n: number) => string;
  hint?: string;
}

export function GaltonInlineSim({
  caption,
  rowsLabel = "Rows N",
  spawnLabel = "Spawn / frame",
  ballsLabel = (n) => `${n.toLocaleString()} balls`,
  hint,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [rows, setRows] = useState(14);
  // Default + max trimmed: spawn=4 with rows=22 was ~250 balls/s on screen
  // simultaneously, which choked weaker laptops. 1 by default lets you watch
  // individual paths; 6 is the new fast end.
  const [spawnRate, setSpawnRate] = useState(1);
  const [resetTick, setResetTick] = useState(0);
  const [landed, setLanded] = useState(0);

  const paramsRef = useRef({ spawnRate });
  paramsRef.current = { spawnRate };

  const histRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    histRef.current = new Array(rows + 1).fill(0);
    setLanded(0);
    let balls: Ball[] = [];
    let landedLocal = 0;
    let lastReport = 0;
    // Sub-frame-rate fall: at 60fps a one-row-per-frame ball clears N=22 rows in
    // ~0.37s — too fast to follow a single path. Stepping every 4th frame slows
    // each ball to 25% speed without touching spawn rate or visual style.
    // Do NOT "optimise" this gate away; the integer grid renders identically.
    const STEP_EVERY = 4;
    let frame = 0;

    const draw = () => {
      const cfg = paramsRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const margin = 18 * dpr;
      const histH = 110 * dpr;
      const pegAreaH = H - histH - margin * 2;
      const pegAreaW = W - margin * 2;
      const dx = Math.min(pegAreaW / (rows + 2), pegAreaH / (rows + 2));
      const cx = W / 2;
      const top = margin;
      const histTop = H - histH - margin;

      // background
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      // pegs — cyan
      ctx.fillStyle = "rgba(125, 243, 255, 0.5)";
      for (let r = 0; r < rows; r++) {
        const y = top + (r + 1) * dx;
        for (let i = 0; i <= r; i++) {
          const x = cx + (i - r / 2) * dx;
          ctx.beginPath();
          ctx.arc(x, y, 1.6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // bin guide lines
      ctx.strokeStyle = "rgba(232, 234, 242, 0.08)";
      ctx.lineWidth = 1;
      const binW = dx;
      const binsStart = cx - ((rows + 1) / 2) * binW;
      for (let i = 0; i <= rows + 1; i++) {
        const x = binsStart + i * binW;
        ctx.beginPath();
        ctx.moveTo(x, histTop);
        ctx.lineTo(x, histTop + histH);
        ctx.stroke();
      }

      // spawn + step balls — physics gated to every 4th frame (see STEP_EVERY)
      frame++;
      if (frame % STEP_EVERY === 0) {
        for (let i = 0; i < cfg.spawnRate; i++) {
          balls.push({ x: 0, y: 0, done: false, bin: 0 });
        }
        for (const b of balls) {
          if (b.done) continue;
          if (b.y < rows) {
            const goRight = Math.random() < 0.5;
            b.y++;
            b.x += goRight ? 0.5 : -0.5;
            if (b.y === rows) {
              b.done = true;
              let bin = Math.round(b.x + rows / 2);
              if (bin < 0) bin = 0;
              else if (bin > rows) bin = rows;
              b.bin = bin;
              histRef.current[bin]++;
              landedLocal++;
            }
          }
        }
      }

      // draw active balls — amber
      ctx.fillStyle = "rgba(255, 209, 102, 0.9)";
      for (const b of balls) {
        if (b.done) continue;
        const bx = cx + b.x * dx;
        const by = top + b.y * dx;
        ctx.beginPath();
        ctx.arc(bx, by, 2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      balls = balls.filter((b) => !b.done);

      // histogram — cyan bars
      const max = Math.max(1, ...histRef.current);
      for (let i = 0; i <= rows; i++) {
        const x = binsStart + i * binW;
        const h = (histRef.current[i] / max) * histH * 0.92;
        ctx.fillStyle = "rgba(125, 243, 255, 0.75)";
        ctx.fillRect(x + binW * 0.1, histTop + histH - h, binW * 0.8, h);
      }

      // counter label
      ctx.fillStyle = "rgba(232, 234, 242, 0.45)";
      ctx.font = `${9 * dpr}px ui-monospace, monospace`;
      ctx.fillText(
        `${histRef.current.reduce((a, c) => a + c, 0).toLocaleString()}`,
        8 * dpr,
        histTop - 6 * dpr,
      );

      if (landedLocal - lastReport > 40) {
        setLanded(landedLocal);
        lastReport = landedLocal;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rows, resetTick, dpr]);

  return (
    <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {caption}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="hairline mx-auto block h-[400px] w-full max-w-[320px] rounded-md border bg-ink-950/80"
      />
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {ballsLabel(landed)}
        </div>
        <button
          onClick={() => setResetTick((t) => t + 1)}
          className="hairline rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
        >
          ⟳
        </button>
      </div>
      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {rowsLabel}
            </div>
            <div className="font-mono text-[10px] text-signal-cyan">{rows}</div>
          </div>
          <input
            type="range"
            min={4}
            max={28}
            step={1}
            value={rows}
            onChange={(e) => {
              setRows(parseInt(e.target.value));
              setResetTick((t) => t + 1);
            }}
            className="w-full accent-signal-cyan"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {spawnLabel}
            </div>
            <div className="font-mono text-[10px] text-signal-cyan">{spawnRate}</div>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={spawnRate}
            onChange={(e) => setSpawnRate(parseInt(e.target.value))}
            className="w-full accent-signal-cyan"
          />
        </div>
      </div>
      {hint && <p className="text-[11px] leading-relaxed text-ink-400">{hint}</p>}
    </div>
  );
}
