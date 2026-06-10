"use client";

import { useEffect, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// PascalmodViewer — compact, story-page-friendly canvas (~340×340) that
// renders Pascal's triangle modulo p, with sliders for p and the number of
// rows N. Each residue gets its own colour from a small palette.
//
// The renderer is deliberately simple: it walks the triangle row by row,
// keeping only the previous row, so memory is O(N).

interface Props {
  caption?: string;
  modulusLabel: string;
  rowsLabel: string;
  primesOnlyLabel: string;
  includeCompositesLabel: string;
  initialP?: number;
  initialN?: number;
}

const PALETTE = [
  palette.canvas.bg, // residue 0 = background
  palette.signal.amber, // 1
  palette.signal.cyan, // 2
  palette.signal.violet, // 3
  palette.signal.rose, // 4
  "#a0e89a", // 5 mint
  "#ff9a55", // 6
  "#c4c6d0", // 7
  "#8ddfff", // 8
  "#ffe28a", // 9
  "#ff6b9b", // 10
  "#7afdd6", // 11
  "#dcb6ff", // 12
  "#ffd9a3", // 13
  "#c8f5ff", // 14
  "#ffb8d9", // 15
];

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const COMPOSITES = [4, 6, 8, 9, 10, 12, 15];

export function PascalmodViewer({
  caption,
  modulusLabel,
  rowsLabel,
  primesOnlyLabel,
  includeCompositesLabel,
  initialP = 2,
  initialN = 128,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [p, setP] = useState(initialP);
  const [n, setN] = useState(initialN);
  const [includeComposites, setIncludeComposites] = useState(false);
  const dpr = useDpr();

  const moduli = includeComposites ? [...PRIMES, ...COMPOSITES].sort((a, b) => a - b) : PRIMES;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = Math.floor(canvas.clientWidth * dpr);
      const H = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;

      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const cellSize = Math.min(W / n, (H * 1.05) / n);
      const triBaseW = n * cellSize;
      const triH = n * cellSize * 0.92;
      const offsetX = (W - triBaseW) / 2;
      const offsetY = (H - triH) / 2;

      let prev = new Uint8Array(1);
      prev[0] = 1 % p;
      for (let row = 0; row < n; row++) {
        const len = row + 1;
        for (let k = 0; k < len; k++) {
          const r = prev[k];
          if (r !== 0) {
            const x = offsetX + (n - row) * (cellSize / 2) + k * cellSize;
            const y = offsetY + row * cellSize * 0.92;
            ctx.fillStyle = PALETTE[r % PALETTE.length] ?? "#ffd166";
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
        const next = new Uint8Array(len + 1);
        next[0] = 1 % p;
        next[len] = 1 % p;
        for (let k = 0; k < len - 1; k++) {
          next[k + 1] = (prev[k] + prev[k + 1]) % p;
        }
        prev = next;
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [p, n, dpr]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
          {caption}
        </div>
      )}
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-xl border bg-ink-950">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
            <div className="glass hairline rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-widest2 text-ink-200">
              C(n,k) mod {p}
            </div>
            <div className="glass hairline rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-widest2 text-signal-amber">
              {p === 2 ? "Sierpiński" : `${p}-gasket`}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {modulusLabel}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {moduli.map((m) => {
                const isPrime = PRIMES.includes(m);
                const active = p === m;
                return (
                  <button
                    key={m}
                    onClick={() => setP(m)}
                    className={`rounded-md border py-1.5 font-mono text-[11px] transition-colors ${
                      active
                        ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                        : isPrime
                          ? "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                          : "hairline text-ink-400 hover:border-signal-amber/40 hover:text-signal-amber"
                    }`}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={includeComposites}
                onChange={(e) => setIncludeComposites(e.target.checked)}
                className="accent-signal-amber"
              />
              <span className="font-mono text-[10px] text-ink-300">
                {includeComposites ? includeCompositesLabel : primesOnlyLabel}
              </span>
            </label>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {rowsLabel}
              </div>
              <div className="font-mono text-[10px] text-ink-400">{n}</div>
            </div>
            <input
              type="range"
              value={n}
              min={16}
              max={256}
              step={4}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              residues
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: Math.min(p, 12) }, (_, i) => i).map((i) => (
                <div
                  key={i}
                  className="hairline flex items-center gap-1 rounded border px-1.5 py-0.5"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="font-mono text-[9px] text-ink-300">{i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
