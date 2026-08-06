"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Inline Game-of-Life sandbox tuned for the story page. Small enough to feel
// snappy, big enough to host a Gosper gun.

const COLS = 40;
const ROWS = 28;

type Cells = ReadonlyArray<readonly [number, number]>;

const GLIDER: Cells = [
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];

const BLINKER: Cells = [
  [0, 0],
  [1, 0],
  [2, 0],
];

// Gosper's glider gun — 36×9. Fits in the 40×28 grid.
const GOSPER_GUN: Cells = [
  [24, 0],
  [22, 1],
  [24, 1],
  [12, 2],
  [13, 2],
  [20, 2],
  [21, 2],
  [34, 2],
  [35, 2],
  [11, 3],
  [15, 3],
  [20, 3],
  [21, 3],
  [34, 3],
  [35, 3],
  [0, 4],
  [1, 4],
  [10, 4],
  [16, 4],
  [20, 4],
  [21, 4],
  [0, 5],
  [1, 5],
  [10, 5],
  [14, 5],
  [16, 5],
  [17, 5],
  [22, 5],
  [24, 5],
  [10, 6],
  [16, 6],
  [24, 6],
  [11, 7],
  [15, 7],
  [12, 8],
  [13, 8],
];

const PULSAR: Cells = [
  [2, 0],
  [3, 0],
  [4, 0],
  [8, 0],
  [9, 0],
  [10, 0],
  [0, 2],
  [5, 2],
  [7, 2],
  [12, 2],
  [0, 3],
  [5, 3],
  [7, 3],
  [12, 3],
  [0, 4],
  [5, 4],
  [7, 4],
  [12, 4],
  [2, 5],
  [3, 5],
  [4, 5],
  [8, 5],
  [9, 5],
  [10, 5],
  [2, 7],
  [3, 7],
  [4, 7],
  [8, 7],
  [9, 7],
  [10, 7],
  [0, 8],
  [5, 8],
  [7, 8],
  [12, 8],
  [0, 9],
  [5, 9],
  [7, 9],
  [12, 9],
  [0, 10],
  [5, 10],
  [7, 10],
  [12, 10],
  [2, 12],
  [3, 12],
  [4, 12],
  [8, 12],
  [9, 12],
  [10, 12],
];

function makeGrid() {
  return new Uint8Array(COLS * ROWS);
}

function stepGrid(src: Uint8Array, dst: Uint8Array) {
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

function paint(g: Uint8Array, cells: Cells, originX: number, originY: number) {
  for (const [cx, cy] of cells) {
    const x = (originX + cx + COLS) % COLS;
    const y = (originY + cy + ROWS) % ROWS;
    g[y * COLS + x] = 1;
  }
}

export interface LifeMiniSandboxLabels {
  play: string;
  pause: string;
  step: string;
  clear: string;
  glider: string;
  blinker: string;
  pulsar: string;
  gun: string;
  generation: string;
  population: string;
  hint: string;
}

const DEFAULT_LABELS: LifeMiniSandboxLabels = {
  play: "Play",
  pause: "Pause",
  step: "Step",
  clear: "Clear",
  glider: "Glider",
  blinker: "Blinker",
  pulsar: "Pulsar",
  gun: "Gosper gun",
  generation: "gen",
  population: "alive",
  hint: "Click cells to toggle. Then press play.",
};

interface Props {
  labels?: Partial<LifeMiniSandboxLabels>;
}

export function LifeMiniSandbox({ labels }: Props) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aRef = useRef<Uint8Array>(makeGrid());
  const bRef = useRef<Uint8Array>(makeGrid());
  const dragValueRef = useRef<number | null>(null);
  const lastCellRef = useRef<string>("");
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);

  // Seed with a glider initially so first paint is not empty.
  useEffect(() => {
    const g = aRef.current;
    g.fill(0);
    paint(g, GLIDER, 5, 5);
    paint(g, BLINKER, 20, 8);
    setPopulation(countAlive(g));
    requestDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countAlive = (g: Uint8Array) => {
    let n = 0;
    for (let i = 0; i < g.length; i++) n += g[i];
    return n;
  };

  // Draw loop
  const drawRef = useRef(() => {});
  const requestDraw = useCallback(() => requestAnimationFrame(() => drawRef.current()), []);

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
      const offX = (canvas.width - cellSize * COLS) / 2;
      const offY = (canvas.height - cellSize * ROWS) / 2;
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // grid lines
      ctx.strokeStyle = "rgba(138,144,164,0.08)";
      ctx.lineWidth = Math.max(1, dpr * 0.5);
      ctx.beginPath();
      for (let x = 0; x <= COLS; x++) {
        ctx.moveTo(offX + x * cellSize, offY);
        ctx.lineTo(offX + x * cellSize, offY + ROWS * cellSize);
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.moveTo(offX, offY + y * cellSize);
        ctx.lineTo(offX + COLS * cellSize, offY + y * cellSize);
      }
      ctx.stroke();

      // cells
      const g = aRef.current;
      const r = cellSize * 0.38;
      ctx.fillStyle = palette.signal.cyan;
      ctx.shadowColor = palette.signal.cyan;
      ctx.shadowBlur = cellSize * 0.9;
      ctx.beginPath();
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (g[y * COLS + x]) {
            const cx = offX + x * cellSize + cellSize / 2;
            const cy = offY + y * cellSize + cellSize / 2;
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    };
  }, []);

  // simulation loop
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tickMs = 1000 / 14;
    let acc = 0;
    const loop = (now: number) => {
      acc += now - last;
      last = now;
      while (acc >= tickMs) {
        acc -= tickMs;
        stepGrid(aRef.current, bRef.current);
        const tmp = aRef.current;
        aRef.current = bRef.current;
        bRef.current = tmp;
        setGeneration((g) => g + 1);
      }
      setPopulation(countAlive(aRef.current));
      requestDraw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, requestDraw]);

  const stepOnce = () => {
    stepGrid(aRef.current, bRef.current);
    const tmp = aRef.current;
    aRef.current = bRef.current;
    bRef.current = tmp;
    setGeneration((g) => g + 1);
    setPopulation(countAlive(aRef.current));
    requestDraw();
  };

  const clear = () => {
    aRef.current.fill(0);
    setGeneration(0);
    setPopulation(0);
    requestDraw();
  };

  const preset = (cells: Cells, originX: number, originY: number) => {
    aRef.current.fill(0);
    paint(aRef.current, cells, originX, originY);
    setGeneration(0);
    setPopulation(countAlive(aRef.current));
    requestDraw();
  };

  // cell pointer handling
  const cellAt = (clientX: number, clientY: number): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    // Work in CSS pixels from the live rect: canvas.width (the backing store) is
    // only re-synced inside draw(), so a resize while paused would leave it stale
    // and map clicks to the wrong cell. rect is always current.
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const cellSize = Math.min(rect.width / COLS, rect.height / ROWS);
    const offX = (rect.width - cellSize * COLS) / 2;
    const offY = (rect.height - cellSize * ROWS) / 2;
    const x = Math.floor((px - offX) / cellSize);
    const y = Math.floor((py - offY) / cellSize);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
    return [x, y];
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const c = cellAt(e.clientX, e.clientY);
    if (!c) return;
    const [x, y] = c;
    const idx = y * COLS + x;
    const newVal = aRef.current[idx] ? 0 : 1;
    dragValueRef.current = newVal;
    aRef.current[idx] = newVal;
    lastCellRef.current = `${x},${y}`;
    setPopulation(countAlive(aRef.current));
    requestDraw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragValueRef.current === null) return;
    const c = cellAt(e.clientX, e.clientY);
    if (!c) return;
    const [x, y] = c;
    const key = `${x},${y}`;
    if (key === lastCellRef.current) return;
    lastCellRef.current = key;
    aRef.current[y * COLS + x] = dragValueRef.current;
    setPopulation(countAlive(aRef.current));
    requestDraw();
  };

  const onPointerUp = () => {
    dragValueRef.current = null;
    lastCellRef.current = "";
  };

  return (
    <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4 md:p-5">
      <div className="hairline relative aspect-[10/7] w-full touch-none select-none overflow-hidden rounded-md border bg-ink-950">
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-crosshair"
          role="img"
          aria-label={L.hint}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <div className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {L.generation} {generation} · {L.population} {population}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-signal-cyan/70 bg-signal-cyan/20 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/30"
        >
          <span aria-hidden="true">{running ? "❚❚" : "▶"}</span>
          {running ? L.pause : L.play}
        </button>
        <button
          onClick={stepOnce}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
        >
          {L.step}
        </button>
        <button
          onClick={clear}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/60 hover:text-signal-rose"
        >
          {L.clear}
        </button>
        <span className="mx-1 h-4 w-px bg-ink-300/20" />
        <button
          onClick={() => preset(GLIDER, 5, 5)}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/60 hover:text-signal-violet"
        >
          {L.glider}
        </button>
        <button
          onClick={() => preset(BLINKER, 18, 13)}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/60 hover:text-signal-amber"
        >
          {L.blinker}
        </button>
        <button
          onClick={() => preset(PULSAR, 13, 7)}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/60 hover:text-signal-cyan"
        >
          {L.pulsar}
        </button>
        <button
          onClick={() => preset(GOSPER_GUN, 2, 9)}
          className="hairline rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-rose/60 hover:text-signal-rose"
        >
          {L.gun}
        </button>
      </div>
      <p className="text-[11px] leading-relaxed text-ink-300">{L.hint}</p>
    </div>
  );
}
