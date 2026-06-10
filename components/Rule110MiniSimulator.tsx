"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Tiny elementary-CA simulator. Shares the live `rule` prop with whatever
// editor is wired up in the parent (typically Rule110LookupTable). The seed
// can be the canonical single centre cell or a random row; the user can
// re-randomise with a button.

interface Props {
  rule: number;
  caption?: string;
}

type SeedKind = "single" | "random";

const COLOURS = {
  cell: palette.signal.cyan,
  bg: palette.canvas.bg,
  edge: "#11131c",
};

// Canvas grid: WIDTH cells across, drawn one row per generation.
const WIDTH = 121; // odd, so a single centre cell sits exactly at the middle
const MAX_HEIGHT = 220;

function seedRow(kind: SeedKind, seedHash: number): Uint8Array {
  const row = new Uint8Array(WIDTH);
  if (kind === "single") {
    row[Math.floor(WIDTH / 2)] = 1;
    return row;
  }
  // Deterministic PRNG seeded by seedHash so re-renders look stable.
  let s = seedHash | 0 || 1;
  for (let i = 0; i < WIDTH; i++) {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    row[i] = (s >>> 0) % 100 < 45 ? 1 : 0;
  }
  return row;
}

function step(row: Uint8Array, rule: number): Uint8Array {
  const n = row.length;
  const next = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = row[(i - 1 + n) % n];
    const c = row[i];
    const r = row[(i + 1) % n];
    const key = (l << 2) | (c << 1) | r;
    next[i] = (rule >> key) & 1;
  }
  return next;
}

export function Rule110MiniSimulator({ rule, caption }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();
  const [steps, setSteps] = useState(180);
  const [seed, setSeed] = useState<SeedKind>("single");
  const [seedHash, setSeedHash] = useState(0xc0ffee);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw < 4 || ch < 4) return;
      const W = Math.floor(cw * dpr);
      const H = Math.floor(ch * dpr);
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = COLOURS.bg;
      ctx.fillRect(0, 0, W, H);

      const rows = Math.min(steps, MAX_HEIGHT);
      const cellW = W / WIDTH;
      const cellH = H / rows;

      let row = seedRow(seed, seedHash);
      ctx.fillStyle = COLOURS.cell;
      for (let y = 0; y < rows; y++) {
        const yPx = y * cellH;
        for (let x = 0; x < WIDTH; x++) {
          if (row[x]) {
            ctx.fillRect(x * cellW, yPx, cellW + 0.6, cellH + 0.6);
          }
        }
        row = step(row, rule);
      }
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [rule, steps, seed, seedHash, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-4">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {caption}
        </div>
      )}

      <div className="hairline relative w-full overflow-hidden rounded-md border bg-ink-950">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ aspectRatio: "360 / 320", background: COLOURS.edge }}
        />
        <div className="pointer-events-none absolute right-2 top-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan/70">
          rule {rule}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-1">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            <span>steps</span>
            <span className="text-signal-cyan">{steps}</span>
          </div>
          <input
            type="range"
            min={20}
            max={MAX_HEIGHT}
            step={5}
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value, 10))}
            className="w-full accent-signal-cyan"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSeed("single")}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
              seed === "single"
                ? "border-signal-cyan bg-signal-cyan/15 text-signal-cyan"
                : "hairline text-ink-300 hover:border-signal-cyan/60 hover:text-signal-cyan"
            }`}
          >
            single
          </button>
          <button
            type="button"
            onClick={() => {
              if (seed !== "random") setSeed("random");
              setSeedHash((Math.random() * 0xffffffff) >>> 0);
            }}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
              seed === "random"
                ? "border-signal-cyan bg-signal-cyan/15 text-signal-cyan"
                : "hairline text-ink-300 hover:border-signal-cyan/60 hover:text-signal-cyan"
            }`}
          >
            random
          </button>
        </div>
      </div>
    </div>
  );
}
