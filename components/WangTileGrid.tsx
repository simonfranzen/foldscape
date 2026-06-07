"use client";

import { useMemo, useState } from "react";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Cyan, violet, amber, rose — matches the Explorer.
const COLOURS = ["#7df3ff", "#b388ff", "#ffd166", "#ff7ab6"] as const;

// ─── Tiles ───────────────────────────────────────────────────────────────────
// A hand-picked palette of 8 tiles drawn from the 4-colour space. Enough
// variety that the user can usually finish a 3×3 patch, but tight enough that
// you bump into edge-mismatches and have to cycle through choices.
type Tile = [n: number, e: number, s: number, w: number];

const TILES: Tile[] = [
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 0, 1, 1],
  [1, 1, 0, 0],
  [2, 1, 2, 1],
  [1, 2, 1, 2],
  [0, 2, 3, 1],
  [3, 0, 0, 2],
];

// ─── TileSVG ─────────────────────────────────────────────────────────────────
// One square split by the two diagonals into four triangles, each painted with
// the colour of the edge it borders. The same convention the Explorer uses.

function TileSVG({ tile, size, empty }: { tile?: Tile; size: number; empty?: boolean }) {
  const s = size;
  const c = s / 2;
  if (empty || !tile) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block">
        <rect
          x={0.5}
          y={0.5}
          width={s - 1}
          height={s - 1}
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="3 3"
        />
        <text
          x={c}
          y={c + 4}
          textAnchor="middle"
          className="font-mono"
          fontSize={11}
          fill="rgba(255,255,255,0.35)"
        >
          +
        </text>
      </svg>
    );
  }
  const [n, e, sCol, w] = tile;
  const tri = (a: [number, number], b: [number, number]) =>
    `M${c} ${c} L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block">
      <path d={tri([0, 0], [s, 0])} fill={COLOURS[n]} />
      <path d={tri([s, 0], [s, s])} fill={COLOURS[e]} />
      <path d={tri([s, s], [0, s])} fill={COLOURS[sCol]} />
      <path d={tri([0, s], [0, 0])} fill={COLOURS[w]} />
      <rect
        x={0.5}
        y={0.5}
        width={s - 1}
        height={s - 1}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
      />
    </svg>
  );
}

// ─── The grid ────────────────────────────────────────────────────────────────

const ROWS = 3;
const COLS = 3;

interface Props {
  caption: string;
  hint: string;
  paletteLabel: string;
  okLabel: string;
  badLabel: string;
  clearLabel: string;
  scoreLabel: (placed: number, valid: number) => string;
}

export function WangTileGrid({
  caption,
  hint,
  paletteLabel,
  okLabel,
  badLabel,
  clearLabel,
  scoreLabel,
}: Props) {
  // grid[r][c] = index into TILES, or -1 for empty
  const [grid, setGrid] = useState<number[][]>(() =>
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => -1)),
  );

  // Cycle a cell through: empty → tile 0 → tile 1 → … → tile 7 → empty.
  function cycle(r: number, c: number) {
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      const cur = next[r][c];
      next[r][c] = cur >= TILES.length - 1 ? -1 : cur + 1;
      return next;
    });
  }

  function clearAll() {
    setGrid(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => -1)));
  }

  // For each edge between two filled cells: does it match?
  // We store the result as a boolean array of [valid?] per cell — a cell is
  // valid iff *every* edge it shares with a filled neighbour matches.
  const { cellOk, placed, validCount } = useMemo(() => {
    const ok: boolean[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => true),
    );
    let p = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] >= 0) p++;
        // East neighbour
        const here = grid[r][c];
        if (c + 1 < COLS) {
          const east = grid[r][c + 1];
          if (here >= 0 && east >= 0) {
            // east edge of `here` (index 1) must match west edge of `east` (index 3)
            if (TILES[here][1] !== TILES[east][3]) {
              ok[r][c] = false;
              ok[r][c + 1] = false;
            }
          }
        }
        // South neighbour
        if (r + 1 < ROWS) {
          const south = grid[r + 1][c];
          if (here >= 0 && south >= 0) {
            // south edge of `here` (index 2) must match north edge of `south` (index 0)
            if (TILES[here][2] !== TILES[south][0]) {
              ok[r][c] = false;
              ok[r + 1][c] = false;
            }
          }
        }
      }
    }
    let v = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) if (grid[r][c] >= 0 && ok[r][c]) v++;
    return { cellOk: ok, placed: p, validCount: v };
  }, [grid]);

  const cellSize = 86;
  const allFilled = placed === ROWS * COLS;
  const allValid = allFilled && validCount === ROWS * COLS;

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
        {/* The interactive grid */}
        <div className="flex flex-col items-center gap-4 md:col-span-7">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
            }}
          >
            {grid.flatMap((row, r) =>
              row.map((cell, c) => {
                const tile = cell >= 0 ? TILES[cell] : undefined;
                const isFilled = cell >= 0;
                const ok = cellOk[r][c];
                const ring = isFilled
                  ? ok
                    ? "ring-1 ring-signal-cyan/40"
                    : "ring-2 ring-signal-rose/70"
                  : "ring-1 ring-ink-300/15";
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => cycle(r, c)}
                    className={`relative rounded-md ${ring} transition-shadow hover:ring-signal-cyan/80`}
                    style={{ width: cellSize, height: cellSize }}
                    aria-label={`Cell ${r + 1}, ${c + 1}`}
                  >
                    <TileSVG tile={tile} size={cellSize} empty={!isFilled} />
                    {isFilled && !ok && (
                      <span className="absolute -right-1.5 -top-1.5 inline-block h-3 w-3 rounded-full bg-signal-rose shadow shadow-signal-rose/60" />
                    )}
                  </button>
                );
              }),
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={clearAll}
              className="hairline rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/60 hover:text-signal-cyan"
            >
              {clearLabel}
            </button>
            <div className="font-mono text-[11px] text-ink-300">
              {scoreLabel(placed, validCount)}
            </div>
          </div>

          <div
            className={`min-h-[1.5em] font-mono text-[11px] uppercase tracking-widest2 ${
              allValid
                ? "text-signal-cyan"
                : placed > 0 && validCount < placed
                  ? "text-signal-rose"
                  : "text-ink-400"
            }`}
          >
            {allValid ? okLabel : placed > 0 && validCount < placed ? badLabel : ""}
          </div>
        </div>

        {/* Palette key */}
        <div className="space-y-4 md:col-span-5">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {paletteLabel}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {TILES.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5" aria-hidden="true">
                  <TileSVG tile={t} size={40} />
                  <div className="font-mono text-[10px] text-ink-400">#{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="hairline border-t pt-3 text-xs leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
