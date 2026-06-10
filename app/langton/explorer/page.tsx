"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Preset rule strings — each character r=right l=left over a colour.
// Classic Langton's ant is "RL". Some famous others below produce highways,
// spirals or filled hexagons.
interface RulePreset {
  id: string;
  label: string;
  rule: string;
  note: string;
}

const PRESETS: RulePreset[] = [
  { id: "RL", label: "Classic", rule: "RL", note: "highway ≈ step 10 000" },
  { id: "RLR", label: "Triangle", rule: "RLR", note: "growing chaotic" },
  { id: "LLRR", label: "Symmetric", rule: "LLRR", note: "perfect symmetry forever" },
  { id: "LRRRRRLLR", label: "Filled square", rule: "LRRRRRLLR", note: "fills a region" },
  { id: "RRLLLRLLLRRR", label: "Spiral", rule: "RRLLLRLLLRRR", note: "tight spiral arms" },
];

const COLOR_PALETTE = [
  palette.canvas.bg,    // 0 = empty (background)
  palette.signal.violet,
  palette.signal.cyan,
  palette.signal.amber,
  palette.signal.rose,
  "#a0e89a", // soft green
  "#c4c6d0", // grey
  "#ff9a55", // orange
  "#9a8cff", // pale violet
  "#7afdd6", // mint
  "#ffe28a", // sand
  "#ff6b9b", // hot rose
  "#8ddfff", // sky
];

export default function LangtonExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.langton;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  const [ruleId, setRuleId] = useState("RL");
  const [stepsPerFrame, setStepsPerFrame] = useState(800);
  const [cell, setCell] = useState(4);
  const [running, setRunning] = useState(true);
  const [stepCount, setStepCount] = useState(0);
  const [resetTick, setResetTick] = useState(0);

  const paramsRef = useRef({ stepsPerFrame, running });
  paramsRef.current = { stepsPerFrame, running };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const cellPx = cell * dpr;
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rule = ruleId;
    const nColors = rule.length;

    let gridW = Math.max(40, Math.floor(canvas.width / cellPx));
    let gridH = Math.max(40, Math.floor(canvas.height / cellPx));
    let grid = new Uint8Array(gridW * gridH);
    let ax = Math.floor(gridW / 2);
    let ay = Math.floor(gridH / 2);
    let dir = 0; // 0=N 1=E 2=S 3=W
    let total = 0;

    const reseed = () => {
      gridW = Math.max(40, Math.floor(canvas.width / cellPx));
      gridH = Math.max(40, Math.floor(canvas.height / cellPx));
      grid = new Uint8Array(gridW * gridH);
      ax = Math.floor(gridW / 2);
      ay = Math.floor(gridH / 2);
      dir = 0;
      total = 0;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    reseed();

    const drawCell = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * cellPx, y * cellPx, cellPx, cellPx);
    };

    const stepOnce = () => {
      // wrap to torus
      const idx = ay * gridW + ax;
      const c = grid[idx];
      const turn = rule[c]; // 'R' or 'L'
      if (turn === "R") dir = (dir + 1) & 3;
      else dir = (dir + 3) & 3;
      const next = (c + 1) % nColors;
      grid[idx] = next;
      drawCell(ax, ay, COLOR_PALETTE[next % COLOR_PALETTE.length]);
      // move
      if (dir === 0) ay = (ay - 1 + gridH) % gridH;
      else if (dir === 1) ax = (ax + 1) % gridW;
      else if (dir === 2) ay = (ay + 1) % gridH;
      else ax = (ax - 1 + gridW) % gridW;
      total++;
    };

    let lastReport = 0;
    const drawHead = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(ax * cellPx, ay * cellPx, cellPx, cellPx);
    };

    const loop = () => {
      const p = paramsRef.current;
      if (p.running) {
        // re-paint where the head was last frame so the trail is clean
        const idx = ay * gridW + ax;
        drawCell(ax, ay, COLOR_PALETTE[grid[idx] % COLOR_PALETTE.length]);
        for (let i = 0; i < p.stepsPerFrame; i++) stepOnce();
        drawHead();
      } else {
        drawHead();
      }
      if (total - lastReport > 30) {
        setStepCount(total);
        lastReport = total;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [ruleId, cell, resetTick, dpr]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              rule = {ruleId} · {ruleId.length} colours
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              step {stepCount.toLocaleString()}
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Rule
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setRuleId(p.id);
                    setResetTick((t) => t + 1);
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    ruleId === p.id
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span>{p.label}</span>
                    <span className="opacity-60">{p.rule}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <SliderRow
              label="Steps / frame"
              value={stepsPerFrame}
              min={1}
              max={5000}
              step={1}
              display={stepsPerFrame.toLocaleString()}
              onChange={setStepsPerFrame}
            />
            <SliderRow
              label="Cell size (px)"
              value={cell}
              min={2}
              max={10}
              step={1}
              display={`${cell}px`}
              onChange={(v) => {
                setCell(v);
                setResetTick((t) => t + 1);
              }}
            />
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`w-full rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                running
                  ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                  : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
              }`}
            >
              {running ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => setResetTick((t) => t + 1)}
              className="hairline hover:text-ink-50 w-full rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50"
            >
              ⟳ Reset
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
        <div className="font-mono text-[10px] text-ink-400">{display}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-signal-cyan"
      />
    </div>
  );
}
