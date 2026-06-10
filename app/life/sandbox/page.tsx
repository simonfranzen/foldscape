"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { PATTERNS } from "@/lib/life/patterns";
import { Info } from "@/components/Info";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette as colorPalette } from "@/lib/visual/palette";

const COLS = 120;
const ROWS = 70;

type Grid = Uint8Array;

function makeGrid(): Grid {
  return new Uint8Array(COLS * ROWS);
}

function randomFill(g: Grid, density = 0.25) {
  for (let i = 0; i < g.length; i++) g[i] = Math.random() < density ? 1 : 0;
}

function step(src: Grid, dst: Grid) {
  for (let y = 0; y < ROWS; y++) {
    const yN = (y - 1 + ROWS) % ROWS;
    const yS = (y + 1) % ROWS;
    for (let x = 0; x < COLS; x++) {
      const xW = (x - 1 + COLS) % COLS;
      const xE = (x + 1) % COLS;
      const n =
        src[yN * COLS + xW] +
        src[yN * COLS + x] +
        src[yN * COLS + xE] +
        src[y * COLS + xW] +
        src[y * COLS + xE] +
        src[yS * COLS + xW] +
        src[yS * COLS + x] +
        src[yS * COLS + xE];
      const alive = src[y * COLS + x] === 1;
      dst[y * COLS + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
}

function paintPattern(
  g: Grid,
  cells: ReadonlyArray<readonly [number, number]>,
  originX: number,
  originY: number,
) {
  for (const [cx, cy] of cells) {
    const x = (originX + cx + COLS) % COLS;
    const y = (originY + cy + ROWS) % ROWS;
    g[y * COLS + x] = 1;
  }
}

export default function LifePage() {
  const { a, u } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridARef = useRef<Grid>(makeGrid());
  const gridBRef = useRef<Grid>(makeGrid());
  const cellSizeRef = useRef(1);

  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(12); // generations per second
  const [palette, setPalette] = useState<"violet" | "cyan" | "amber" | "rose">("violet");
  const [drawMode, setDrawMode] = useState<"draw" | "erase" | null>(null);

  const totalCells = COLS * ROWS;

  // Initial seed: glider gun
  useEffect(() => {
    const g = gridARef.current;
    g.fill(0);
    const gun = PATTERNS.find((p) => p.id === "gun");
    if (gun) paintPattern(g, gun.cells, 4, 4);
    setGeneration(0);
    setPopulation(countAlive(g));
    requestDraw();
  }, []);

  // Drawing loop — independent of simulation tick so the canvas is responsive
  const drawRef = useRef(() => {});
  const requestDraw = () => requestAnimationFrame(() => drawRef.current());
  useEffect(() => {
    drawRef.current = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = getDpr();
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext("2d")!;
      const cellSize = Math.min(canvas.width / COLS, canvas.height / ROWS);
      cellSizeRef.current = cellSize;
      const offX = (canvas.width - cellSize * COLS) / 2;
      const offY = (canvas.height - cellSize * ROWS) / 2;

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#070811");
      grad.addColorStop(1, colorPalette.ink[950]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(138, 144, 164, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= COLS; x += 10) {
        ctx.moveTo(offX + x * cellSize, offY);
        ctx.lineTo(offX + x * cellSize, offY + ROWS * cellSize);
      }
      for (let y = 0; y <= ROWS; y += 10) {
        ctx.moveTo(offX, offY + y * cellSize);
        ctx.lineTo(offX + COLS * cellSize, offY + y * cellSize);
      }
      ctx.stroke();

      const colorMap: Record<string, string> = {
        violet: colorPalette.signal.violet,
        cyan: colorPalette.signal.cyan,
        amber: colorPalette.signal.amber,
        rose: colorPalette.signal.rose,
      };
      const fill = colorMap[palette];
      ctx.fillStyle = fill;
      const grid = gridARef.current;
      const r = Math.max(1, cellSize * 0.42);
      ctx.beginPath();
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (grid[y * COLS + x]) {
            const cx = offX + x * cellSize + cellSize / 2;
            const cy = offY + y * cellSize + cellSize / 2;
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.shadowColor = fill;
      ctx.shadowBlur = cellSize * 1.2;
      ctx.fill();
      ctx.shadowBlur = 0;
    };
    requestDraw();
  }, [palette]);

  // Simulation loop
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      acc += (now - last) / 1000;
      last = now;
      const interval = 1 / speed;
      let steps = 0;
      while (acc >= interval && steps < 20) {
        acc -= interval;
        steps++;
        step(gridARef.current, gridBRef.current);
        const tmp = gridARef.current;
        gridARef.current = gridBRef.current;
        gridBRef.current = tmp;
        setGeneration((g) => g + 1);
      }
      if (steps > 0) {
        setPopulation(countAlive(gridARef.current));
        drawRef.current();
      }
      if (running) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed]);

  const onPointerEvent = (e: React.PointerEvent, mode: "down" | "move") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = getDpr();
    const cellSize = cellSizeRef.current;
    const offX = (canvas.width - cellSize * COLS) / 2;
    const offY = (canvas.height - cellSize * ROWS) / 2;
    const cx = ((e.clientX - rect.left) * dpr - offX) / cellSize;
    const cy = ((e.clientY - rect.top) * dpr - offY) / cellSize;
    if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return;
    const gx = Math.floor(cx);
    const gy = Math.floor(cy);
    const idx = gy * COLS + gx;
    const grid = gridARef.current;
    if (mode === "down") {
      // Toggle on click; remember the chosen state for drag
      const next = grid[idx] === 1 ? 0 : 1;
      grid[idx] = next;
      setDrawMode(next === 1 ? "draw" : "erase");
    } else {
      if (drawMode === null) return;
      grid[idx] = drawMode === "draw" ? 1 : 0;
    }
    setPopulation(countAlive(grid));
    drawRef.current();
  };

  const handleClear = () => {
    gridARef.current.fill(0);
    setGeneration(0);
    setPopulation(0);
    drawRef.current();
  };
  const handleRandom = () => {
    randomFill(gridARef.current, 0.25);
    setGeneration(0);
    setPopulation(countAlive(gridARef.current));
    drawRef.current();
  };
  const handleStep = () => {
    step(gridARef.current, gridBRef.current);
    const tmp = gridARef.current;
    gridARef.current = gridBRef.current;
    gridBRef.current = tmp;
    setGeneration((g) => g + 1);
    setPopulation(countAlive(gridARef.current));
    drawRef.current();
  };
  const handlePattern = (id: string) => {
    const pattern = PATTERNS.find((p) => p.id === id);
    if (!pattern) return;
    gridARef.current.fill(0);
    const ox = Math.floor(COLS / 2 - 6);
    const oy = Math.floor(ROWS / 2 - 4);
    paintPattern(gridARef.current, pattern.cells, ox, oy);
    setGeneration(0);
    setPopulation(countAlive(gridARef.current));
    drawRef.current();
  };

  const populationPct = useMemo(
    () => ((population / totalCells) * 100).toFixed(1),
    [population, totalCells],
  );

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Stage */}
        <div className="relative min-h-[60vh] cursor-cell select-none bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full"
            onPointerDown={(e) => onPointerEvent(e, "down")}
            onPointerMove={(e) => onPointerEvent(e, "move")}
            onPointerUp={() => setDrawMode(null)}
            onPointerCancel={() => setDrawMode(null)}
            onPointerLeave={() => setDrawMode(null)}
          />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline pointer-events-auto flex items-center gap-3 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              <span>
                {u.life.genLabel} {generation}
              </span>
              <span className="text-ink-400">·</span>
              <span>
                {u.life.popLabel} {population}
              </span>
              <span className="text-ink-400">({populationPct}%)</span>
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {u.life.ruleSummary} {COLS}×{ROWS}
            </div>
          </div>
          <div className="glass hairline pointer-events-none absolute bottom-4 left-4 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {u.life.drawHint}
          </div>
        </div>

        {/* Panel */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {a.topics.life.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">
              {a.topics.life.tagline}
            </h1>
            <p className="text-sm leading-relaxed text-ink-200">{a.topics.life.body}</p>
            <div className="hairline rounded-md border bg-ink-950/60 p-3 font-mono text-xs text-ink-100">
              {u.life.rulesBox}
            </div>
          </div>

          {/* Controls */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.controls}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className={`rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
                }`}
              >
                {running ? `❚❚ ${u.life.pause}` : `▶ ${u.life.play}`}
              </button>
              <button
                onClick={handleStep}
                disabled={running}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:text-ink-100 disabled:opacity-40"
              >
                {u.life.step}
              </button>
              <button
                onClick={handleRandom}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
              >
                ⌁ {u.life.random}
              </button>
              <button
                onClick={handleClear}
                className="hairline rounded-md border py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
              >
                ○ {u.life.clear}
              </button>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {u.life.speed}
                </span>
                <span className="font-mono text-[10px] text-signal-cyan">{speed} gen/s</span>
              </div>
              <input
                type="range"
                value={speed}
                min={1}
                max={60}
                step={1}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-signal-cyan"
              />
            </div>
          </div>

          {/* Patterns */}
          <div className="hairline border-b p-5">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.patterns}
              <Info side="bottom">{u.life.patternsInfo}</Info>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePattern(p.id)}
                  className="hairline rounded-md border px-3 py-2 text-left transition-colors hover:border-signal-cyan/40"
                >
                  <div className="text-sm text-ink-100">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color palette */}
          <div className="hairline border-b p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {u.life.cellColour}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["violet", "cyan", "amber", "rose"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setPalette(c)}
                  className={`rounded-md border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    palette === c
                      ? `border-signal-${c}/60 text-signal-${c} bg-signal-${c}/10`
                      : "hairline text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Back */}
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

function countAlive(g: Grid): number {
  let n = 0;
  for (let i = 0; i < g.length; i++) if (g[i]) n++;
  return n;
}
