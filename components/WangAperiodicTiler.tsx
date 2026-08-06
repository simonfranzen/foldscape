"use client";

import { useEffect, useRef, useState } from "react";
import { palette } from "@/lib/visual/palette";
import { useDpr } from "@/lib/hooks/useDpr";

// ─── Palette ─────────────────────────────────────────────────────────────────
// Four edge colours: both demo tile sets only reference indices 0 to 3.
const COLOURS = [palette.signal.cyan, palette.signal.violet, palette.signal.amber, palette.signal.rose] as const;

// ─── Tile sets ───────────────────────────────────────────────────────────────
// Two demo sets loosely inspired by the modern aperiodic Wang records:
//   • Kari-Culik 1996, 13 tiles.
//   • Jeandel-Rao 2015, 11 tiles (the proven minimum).
// The numeric edge assignments below are illustrative, NOT the published
// tables: they are chosen only to be restrictive enough that the random search
// visibly backtracks. They are not proven aperiodic (in fact a small periodic
// block does exist), so the labels, attributions and hint copy describe them as
// being "in the spirit of" those records rather than the real sets.
type Tile = readonly [n: number, e: number, s: number, w: number];

const CULIK13: Tile[] = [
  [0, 1, 0, 2],
  [0, 2, 1, 1],
  [1, 1, 2, 2],
  [1, 3, 0, 1],
  [2, 2, 1, 3],
  [2, 0, 3, 1],
  [3, 1, 2, 0],
  [0, 3, 2, 1],
  [1, 0, 3, 2],
  [2, 3, 0, 0],
  [3, 2, 1, 2],
  [3, 0, 0, 3],
  [1, 2, 3, 3],
];

const JEANDEL_RAO11: Tile[] = [
  [0, 1, 0, 2],
  [1, 2, 1, 0],
  [0, 2, 2, 1],
  [2, 0, 1, 2],
  [1, 0, 2, 1],
  [2, 1, 0, 0],
  [0, 0, 1, 1],
  [1, 1, 0, 2],
  [2, 2, 1, 1],
  [0, 2, 2, 0],
  [1, 0, 0, 2],
];

interface SetDef {
  key: "culik" | "jeandel";
  label: string;
  tiles: Tile[];
  attrib: string;
}

const SETS: SetDef[] = [
  { key: "culik", label: "13 tiles · Culik-style", tiles: CULIK13, attrib: "in the spirit of Culik 1996" },
  {
    key: "jeandel",
    label: "11 tiles · Jeandel-Rao-style",
    tiles: JEANDEL_RAO11,
    attrib: "in the spirit of Jeandel-Rao 2015",
  },
];

// ─── Mulberry32 — small deterministic PRNG ───────────────────────────────────
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Tile a rectangular patch by random search + backtracking ───────────────

function tilePatch(tiles: Tile[], rows: number, cols: number, seed: number) {
  const rng = mulberry32(seed);
  const grid: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => -1),
  );

  // Per-cell shuffled candidate lists. Cap total work so the canvas stays
  // responsive even when the search has to thrash.
  const remaining: number[][][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => []),
  );

  function freshRemaining(_r: number, _c: number): number[] {
    const list = Array.from({ length: tiles.length }, (_, i) => i);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function fits(r: number, c: number, t: number): boolean {
    const tile = tiles[t];
    if (r > 0) {
      const above = grid[r - 1][c];
      if (above >= 0 && tiles[above][2] !== tile[0]) return false;
    }
    if (c > 0) {
      const left = grid[r][c - 1];
      if (left >= 0 && tiles[left][1] !== tile[3]) return false;
    }
    return true;
  }

  let pos = 0;
  const total = rows * cols;
  let steps = 0;
  const maxSteps = total * tiles.length * 20;

  while (pos < total && steps < maxSteps) {
    steps++;
    const r = Math.floor(pos / cols);
    const c = pos % cols;
    if (remaining[r][c].length === 0 && grid[r][c] === -1) {
      remaining[r][c] = freshRemaining(r, c);
    }
    let placed = false;
    while (remaining[r][c].length > 0) {
      const t = remaining[r][c].pop()!;
      if (fits(r, c, t)) {
        grid[r][c] = t;
        placed = true;
        break;
      }
    }
    if (placed) {
      pos++;
    } else {
      // Backtrack
      grid[r][c] = -1;
      remaining[r][c] = [];
      pos--;
      if (pos < 0) {
        // Restart with a different seed slice
        return tilePatch(tiles, rows, cols, (seed * 1103515245 + 12345) | 0);
      }
      const pr = Math.floor(pos / cols);
      const pc = pos % cols;
      grid[pr][pc] = -1;
    }
  }

  return { grid, complete: pos >= total };
}

// ─── Draw a tile to canvas ────────────────────────────────────────────────────
function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, tile: Tile) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const corners: Array<[number, number]> = [
    [x, y],
    [x + size, y],
    [x + size, y + size],
    [x, y + size],
  ];
  // edges: N=0, E=1, S=2, W=3 — triangle spanned by consecutive corners.
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.closePath();
    ctx.fillStyle = COLOURS[tile[i]] ?? COLOURS[0];
    ctx.fill();
  }
  // hairline grid
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  caption: string;
  randomizeLabel: string;
  setLabel: string;
  hint: string;
}

// CSS pixel size of the canvas; the backing store scales with devicePixelRatio.
const CSS_W = 360;
const CSS_H = 280;

export function WangAperiodicTiler({ caption, randomizeLabel, setLabel, hint }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [setKey, setSetKey] = useState<SetDef["key"]>("culik");
  const [seed, setSeed] = useState(0xc0ffee);
  const dpr = useDpr();

  const setDef = SETS.find((s) => s.key === setKey)!;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size the backing store to CSS size * dpr so the patch stays crisp on
    // hi-DPI displays, then draw in CSS pixels via setTransform.
    canvas.width = Math.floor(CSS_W * dpr);
    canvas.height = Math.floor(CSS_H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = CSS_W;
    const H = CSS_H;
    const tileSize = 20;
    const cols = Math.floor(W / tileSize);
    const rows = Math.floor(H / tileSize);

    // Background
    ctx.fillStyle = palette.canvas.bg;
    ctx.fillRect(0, 0, W, H);

    const { grid } = tilePatch(setDef.tiles, rows, cols, seed);
    const offsetX = Math.floor((W - cols * tileSize) / 2);
    const offsetY = Math.floor((H - rows * tileSize) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = grid[r][c];
        if (t < 0) continue;
        drawTile(ctx, offsetX + c * tileSize, offsetY + r * tileSize, tileSize, setDef.tiles[t]);
      }
    }
  }, [setDef, seed, dpr]);

  function randomize() {
    setSeed((Math.random() * 0xffffffff) | 0);
  }

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <div className="hairline overflow-hidden rounded-md border bg-ink-950">
            <canvas
              ref={canvasRef}
              width={CSS_W}
              height={CSS_H}
              style={{ width: CSS_W, height: CSS_H }}
              className="block"
              role="img"
              aria-label={caption}
            />
          </div>
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {setLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {SETS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSetKey(s.key)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                    setKey === s.key
                      ? "border-signal-cyan/70 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="pt-1 font-mono text-[10px] text-ink-400">{setDef.attrib}</div>
          </div>
          <button
            onClick={randomize}
            className="rounded-full border border-signal-cyan/60 bg-signal-cyan/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20"
          >
            ↻ {randomizeLabel}
          </button>
          <p className="hairline border-t pt-3 text-xs leading-relaxed text-ink-300">{hint}</p>
          <div className="font-mono text-[10px] text-ink-400">
            seed · {seed.toString(16).padStart(8, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
