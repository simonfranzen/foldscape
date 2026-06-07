"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tile {
  id: number;
  N: number;
  E: number;
  S: number;
  W: number;
}

type TileSetKey = "A" | "B" | "C";

interface TileSetDef {
  key: TileSetKey;
  name: string;
  description: string;
  tiles: Tile[];
}

// Choice point in the backtracking search.
interface Choice {
  row: number;
  col: number;
  // Indices into `tiles` we have NOT yet tried at this cell, in randomised order.
  remaining: number[];
  // The tile we have currently placed here (so we can clear it when popping).
  placed: number;
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const COLOURS = ["#7df3ff", "#b388ff", "#ffd166", "#ff7ab6"] as const;
const COLOUR_NAMES = ["cyan", "violet", "amber", "rose"] as const;

// ─── Tile sets ───────────────────────────────────────────────────────────────

// Set A: simplest periodic 2-colour set. Five tiles, all checks work out.
const SET_A_TILES: Tile[] = [
  { id: 0, N: 0, E: 0, S: 0, W: 0 },
  { id: 1, N: 1, E: 1, S: 1, W: 1 },
  { id: 2, N: 0, E: 1, S: 0, W: 1 },
  { id: 3, N: 1, E: 0, S: 1, W: 0 },
  { id: 4, N: 0, E: 1, S: 1, W: 0 },
];

// Set B: a 13-tile, 4-colour set designed in the spirit of the Kari–Culik 1996
// aperiodic record. The matching constraints are tight enough that random
// search frequently needs to backtrack; the search makes the difficulty visible
// without claiming this exact list is provably aperiodic.
const SET_B_TILES: Tile[] = [
  { id: 0, N: 0, E: 1, S: 0, W: 2 },
  { id: 1, N: 0, E: 2, S: 1, W: 1 },
  { id: 2, N: 1, E: 1, S: 2, W: 2 },
  { id: 3, N: 1, E: 3, S: 0, W: 1 },
  { id: 4, N: 2, E: 2, S: 1, W: 3 },
  { id: 5, N: 2, E: 0, S: 3, W: 1 },
  { id: 6, N: 3, E: 1, S: 2, W: 0 },
  { id: 7, N: 0, E: 3, S: 2, W: 1 },
  { id: 8, N: 1, E: 0, S: 3, W: 2 },
  { id: 9, N: 2, E: 3, S: 0, W: 0 },
  { id: 10, N: 3, E: 2, S: 1, W: 2 },
  { id: 11, N: 3, E: 0, S: 0, W: 3 },
  { id: 12, N: 1, E: 2, S: 3, W: 3 },
];

// Set C: every 2-colour tile. 16 tiles. Guaranteed to tile, periodically.
function buildSetC(): Tile[] {
  const out: Tile[] = [];
  let id = 0;
  for (let n = 0; n < 2; n++)
    for (let e = 0; e < 2; e++)
      for (let s = 0; s < 2; s++)
        for (let w = 0; w < 2; w++) {
          out.push({ id: id++, N: n, E: e, S: s, W: w });
        }
  return out;
}

const SETS: Record<TileSetKey, TileSetDef> = {
  A: {
    key: "A",
    name: "Set A · periodic, 5 tiles",
    description: "Two colours, five tiles — every placement easy, tiling is periodic.",
    tiles: SET_A_TILES,
  },
  B: {
    key: "B",
    name: "Set B · aperiodic-style, 13 tiles",
    description:
      "Four colours, 13 tiles in the spirit of the Kari–Culik 1996 set. Backtracks visibly.",
    tiles: SET_B_TILES,
  },
  C: {
    key: "C",
    name: "Set C · all 2-colour tiles, 16",
    description: "Every combination of two colours on each edge. Always tiles, periodically.",
    tiles: buildSetC(),
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function WangExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.wang;

  const [setKey, setSetKey] = useState<TileSetKey>("A");
  const [gridSize, setGridSize] = useState<number>(16);
  const [speed, setSpeed] = useState<number>(60); // placements per second
  const [restartTick, setRestartTick] = useState<number>(0);

  const [placedCount, setPlacedCount] = useState<number>(0);
  const [backtracks, setBacktracks] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);
  const [stuck, setStuck] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Stateful refs for the animation loop.
  const gridRef = useRef<(Tile | null)[][]>([]);
  const stackRef = useRef<Choice[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const cellSizeRef = useRef<number>(0);

  const activeSet = SETS[setKey];

  // Helper: build initial empty grid.
  const blankGrid = useCallback((n: number): (Tile | null)[][] => {
    const g: (Tile | null)[][] = [];
    for (let r = 0; r < n; r++) {
      const row: (Tile | null)[] = [];
      for (let c = 0; c < n; c++) row.push(null);
      g.push(row);
    }
    return g;
  }, []);

  // Helper: shuffle in place (Fisher–Yates).
  const shuffle = useCallback(<T,>(arr: T[]): T[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }, []);

  // Find compatible tile indices at (row, col) given current grid.
  const compatibleTileIndices = useCallback(
    (grid: (Tile | null)[][], row: number, col: number, tiles: Tile[]): number[] => {
      const above = row > 0 ? grid[row - 1][col] : null;
      const left = col > 0 ? grid[row][col - 1] : null;
      const out: number[] = [];
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        if (above && t.N !== above.S) continue;
        if (left && t.W !== left.E) continue;
        out.push(i);
      }
      return out;
    },
    [],
  );

  // Draw the current grid state onto the canvas.
  const draw = useCallback(
    (cursorRow: number, cursorCol: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const n = gridSize;
      const cellSize = Math.floor(Math.min(W, H) / n);
      cellSizeRef.current = cellSize;
      const totalSize = cellSize * n;
      const offX = Math.floor((W - totalSize) / 2);
      const offY = Math.floor((H - totalSize) / 2);

      // Faint grid backdrop.
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(offX, offY, totalSize, totalSize);

      const grid = gridRef.current;
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const tile = grid[r] ? grid[r][c] : null;
          const x = offX + c * cellSize;
          const y = offY + r * cellSize;
          if (!tile) {
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
            continue;
          }
          drawTileOnCanvas(ctx, x, y, cellSize, tile);
        }
      }

      // Highlight cursor cell.
      if (cursorRow >= 0 && cursorRow < n && cursorCol >= 0 && cursorCol < n && cellSize > 4) {
        const x = offX + cursorCol * cellSize;
        const y = offY + cursorRow * cellSize;
        ctx.strokeStyle = "rgba(179, 136, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      }
    },
    [gridSize],
  );

  // The single search step. Returns true while still working.
  const step = useCallback((): boolean => {
    const grid = gridRef.current;
    const stack = stackRef.current;
    const n = gridSize;
    const tiles = activeSet.tiles;

    // Find next empty cell (row-major).
    let row = 0;
    let col = 0;
    if (stack.length > 0) {
      const top = stack[stack.length - 1];
      // Move to the cell after top.
      col = top.col + 1;
      row = top.row;
      if (col >= n) {
        col = 0;
        row += 1;
      }
    }

    if (row >= n) {
      // Done.
      return false;
    }

    const candidates = shuffle(compatibleTileIndices(grid, row, col, tiles));

    if (candidates.length === 0) {
      // Backtrack: pop the top of the stack and try its next remaining choice.
      setBacktracks((b) => b + 1);
      let backtracked = false;
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        grid[top.row][top.col] = null;
        if (top.remaining.length > 0) {
          const nextIdx = top.remaining.shift()!;
          const nextTile = tiles[nextIdx];
          grid[top.row][top.col] = nextTile;
          top.placed = nextIdx;
          backtracked = true;
          break;
        }
        stack.pop();
      }
      if (!backtracked && stack.length === 0) {
        // Whole search exhausted; nothing can be placed.
        return false;
      }
      return true;
    }

    const firstIdx = candidates[0];
    const remaining = candidates.slice(1);
    const tile = tiles[firstIdx];
    grid[row][col] = tile;
    stack.push({ row, col, remaining, placed: firstIdx });
    return true;
  }, [activeSet, gridSize, compatibleTileIndices, shuffle]);

  // Reset state when set / size / restart changes.
  useEffect(() => {
    gridRef.current = blankGrid(gridSize);
    stackRef.current = [];
    setPlacedCount(0);
    setBacktracks(0);
    setDone(false);
    setStuck(false);
    lastStepTimeRef.current = 0;
    draw(0, 0);
  }, [setKey, gridSize, restartTick, blankGrid, draw]);

  // RAF loop.
  useEffect(() => {
    let cancelled = false;
    const loop = (t: number) => {
      if (cancelled) return;
      const interval = 1000 / Math.max(1, speed);
      const stepsThisFrame = Math.max(1, Math.floor((t - lastStepTimeRef.current) / interval));
      if (lastStepTimeRef.current === 0) lastStepTimeRef.current = t;
      if (t - lastStepTimeRef.current >= interval && !done && !stuck) {
        let working = true;
        for (let i = 0; i < stepsThisFrame && working; i++) {
          working = step();
        }
        lastStepTimeRef.current = t;
        const stack = stackRef.current;
        setPlacedCount(stack.length);
        if (!working) {
          // Either finished or stuck.
          const n = gridSize;
          const finished = stack.length === n * n;
          if (finished) setDone(true);
          else setStuck(true);
        }
        // Determine cursor (next empty cell) for highlighting.
        let cr = 0;
        let cc = 0;
        if (stack.length > 0) {
          const top = stack[stack.length - 1];
          cc = top.col + 1;
          cr = top.row;
          if (cc >= gridSize) {
            cc = 0;
            cr += 1;
          }
        }
        draw(cr, cc);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [step, speed, draw, gridSize, done, stuck]);

  // Re-render when the canvas resizes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw(0, 0));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const totalCells = gridSize * gridSize;
  const progressPct = Math.min(100, (placedCount / totalCells) * 100);

  const paletteEntries = useMemo(
    () => COLOURS.map((hex, i) => ({ hex, name: COLOUR_NAMES[i] })),
    [],
  );

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Tiling search · {activeSet.name}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              ↑ ↓ ← → match
            </div>
          </div>
          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950">
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat
              label="Placed"
              value={`${placedCount} / ${totalCells}`}
              accent="text-signal-violet"
            />
            <Stat label="Backtracks" value={String(backtracks)} accent="text-signal-rose" />
            <Stat
              label="Progress"
              value={`${progressPct.toFixed(1)}%`}
              accent="text-signal-amber"
            />
            <Stat
              label="Status"
              value={done ? "complete" : stuck ? "no tiling found" : "searching"}
              accent={done ? "text-signal-cyan" : stuck ? "text-signal-rose" : "text-ink-200"}
            />
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Tile set
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["A", "B", "C"] as TileSetKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSetKey(k)}
                  className={`rounded-md border px-3 py-2 text-center transition-colors ${
                    setKey === k
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">Set {k}</div>
                  <div className="mt-0.5 font-mono text-[9px] text-ink-400">
                    {SETS[k].tiles.length} tiles
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-ink-300">{activeSet.description}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Grid size
              </div>
              <div className="font-mono text-xs text-signal-amber">
                {gridSize} × {gridSize}
              </div>
            </div>
            <input
              type="range"
              value={gridSize}
              min={4}
              max={24}
              step={1}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Speed
              </div>
              <div className="font-mono text-xs text-signal-amber">{speed} / s</div>
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={400}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="hairline border-b p-5">
            <button
              onClick={() => setRestartTick((n) => n + 1)}
              className="w-full rounded-md border border-signal-violet/60 bg-signal-violet/10 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
            >
              Restart
            </button>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Show the tile palette
            </div>
            <div className="grid grid-cols-4 gap-2">
              {activeSet.tiles.map((t) => (
                <div key={t.id} className="flex flex-col items-center gap-1">
                  <TilePreview tile={t} size={56} />
                  <div className="font-mono text-[9px] text-ink-400">#{t.id}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Edge colours
            </div>
            <div className="grid grid-cols-2 gap-2">
              {paletteEntries.map((p, i) => (
                <div key={p.hex} className="flex items-center gap-2">
                  <span
                    className="hairline inline-block h-4 w-4 rounded-sm border"
                    style={{ background: p.hex }}
                  />
                  <span className="font-mono text-[10px] text-ink-300">
                    {i}: {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/wang"
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function drawTileOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  tile: Tile,
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  // North
  ctx.fillStyle = COLOURS[tile.N];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.closePath();
  ctx.fill();
  // East
  ctx.fillStyle = COLOURS[tile.E];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
  // South
  ctx.fillStyle = COLOURS[tile.S];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  // West
  ctx.fillStyle = COLOURS[tile.W];
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  if (size > 6) {
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
  }
}

function TilePreview({ tile, size = 60 }: { tile: Tile; size?: number }) {
  const s = size;
  const c = s / 2;
  const tri = (a: [number, number], b: [number, number]) =>
    `M${c} ${c} L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block">
      <path d={tri([0, 0], [s, 0])} fill={COLOURS[tile.N]} />
      <path d={tri([s, 0], [s, s])} fill={COLOURS[tile.E]} />
      <path d={tri([s, s], [0, s])} fill={COLOURS[tile.S]} />
      <path d={tri([0, s], [0, 0])} fill={COLOURS[tile.W]} />
      <rect x={0.5} y={0.5} width={s - 1} height={s - 1} fill="none" stroke="rgba(0,0,0,0.35)" />
    </svg>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass hairline rounded-md border px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">{label}</div>
      <div className={`font-mono text-sm ${accent}`}>{value}</div>
    </div>
  );
}
