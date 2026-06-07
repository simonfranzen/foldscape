"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Inline Ulam-spiral demo for the story page. Smaller than the Explorer:
// a fixed-size canvas at ~340×340 with a slider for grid side and a small
// strip of quadratic-highlight presets. The renderer reuses the same
// spiral coordinate logic as the Explorer but lives standalone so the
// story page can include it without pulling in the Explorer chrome.

interface Quadratic {
  id: string;
  label: string;
  a: number;
  b: number;
  c: number;
}

interface Props {
  caption: string;
  sideLabel: string;
  highlightLabel: string;
  primesLabel: (n: number) => string;
  numbersLabel: (n: number) => string;
  hint: string;
  quadratics: Quadratic[];
}

const SIZE = 340;

// Sieve of Eratosthenes up to N. Returns Uint8Array where 1 = prime.
function buildSieve(N: number): Uint8Array {
  const s = new Uint8Array(N + 1);
  s[0] = s[1] = 1;
  for (let i = 2; i * i <= N; i++) {
    if (s[i] === 0) {
      for (let j = i * i; j <= N; j += i) s[j] = 1;
    }
  }
  for (let i = 0; i <= N; i++) s[i] = s[i] === 0 ? 1 : 0;
  return s;
}

// Spiral coordinate for n (1-indexed). Centered at (0, 0). Standard Ulam
// orientation: 1 in centre, 2 to the right, 3 up, 4 5 left, etc.
function spiralCoord(n: number): [number, number] {
  if (n === 1) return [0, 0];
  const k = Math.ceil((Math.sqrt(n) - 1) / 2);
  const sideLen = 2 * k;
  const start = (2 * k - 1) * (2 * k - 1) + 1;
  const off = n - start;
  let x = k;
  let y = -(k - 1);
  if (off < sideLen) {
    y += off;
  } else if (off < 2 * sideLen) {
    y += sideLen;
    x -= off - sideLen + 1;
  } else if (off < 3 * sideLen) {
    y = k - (off - 2 * sideLen + 1);
    x = -k;
  } else {
    y = -k;
    x = -k + (off - 3 * sideLen + 1);
  }
  return [x, y];
}

export function UlamSpiralMini({
  caption,
  sideLabel,
  highlightLabel,
  primesLabel,
  numbersLabel,
  hint,
  quadratics,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Odd grid side so 1 stays centred. 51 is a comfortable default for a
  // small inline canvas — diagonals are already very visible.
  const [side, setSide] = useState(51);
  const [quadraticId, setQuadraticId] = useState(quadratics[0]?.id ?? "none");

  const sieve = useMemo(() => buildSieve(side * side + 5), [side]);
  const quad = quadratics.find((q) => q.id === quadraticId) ?? quadratics[0];

  // Pre-compute the (x, y) cells that the highlighted quadratic carves out
  // along the spiral. Packed into a single integer for fast lookup.
  const highlightSet = useMemo(() => {
    if (!quad || (quad.a === 0 && quad.b === 0 && quad.c === 0)) return null;
    const set = new Set<number>();
    const max = side * side;
    for (let n = 0; n < 400; n++) {
      const v = quad.a * n * n + quad.b * n + quad.c;
      if (v < 1 || v > max) continue;
      const [x, y] = spiralCoord(v);
      set.add(((x + 1000) << 16) | (y + 1000));
    }
    return set;
  }, [quad, side]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = SIZE;
    const H = SIZE;
    const half = Math.floor(side / 2);
    const cell = Math.min(W, H) / side;
    const offsetX = (W - cell * side) / 2;
    const offsetY = (H - cell * side) / 2;

    ctx.fillStyle = "#06070d";
    ctx.fillRect(0, 0, W, H);

    const max = side * side;
    for (let n = 1; n <= max; n++) {
      if (sieve[n] === 0) continue;
      const [x, y] = spiralCoord(n);
      if (Math.abs(x) > half || Math.abs(y) > half) continue;
      const px = offsetX + (x + half) * cell;
      const py = offsetY + (half - y) * cell;
      const highlit = highlightSet?.has(((x + 1000) << 16) | (y + 1000));
      ctx.fillStyle = highlit ? "#ff7ab6" : "rgba(255, 209, 102, 0.85)";
      ctx.fillRect(px, py, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
    }

    // Mark the centre cell (1) with a thin cyan outline.
    const cx = offsetX + half * cell;
    const cy = offsetY + half * cell;
    ctx.strokeStyle = "rgba(125, 243, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
  }, [side, sieve, highlightSet]);

  const total = side * side;
  let primesCount = 0;
  for (let i = 0; i < sieve.length && i <= total; i++) if (sieve[i] === 1) primesCount++;

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[340px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <canvas
            ref={canvasRef}
            style={{ width: SIZE, height: SIZE }}
            className="hairline rounded-md border"
            aria-label="Ulam spiral"
          />
          <div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest2">
            <span className="text-signal-amber">{primesLabel(primesCount)}</span>
            <span className="text-ink-400">{numbersLabel(total)}</span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {sideLabel}
              </div>
              <div className="font-mono text-[10px] text-ink-400">
                {side} × {side}
              </div>
            </div>
            <input
              type="range"
              value={side}
              min={21}
              max={101}
              step={2}
              onChange={(e) => setSide(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {highlightLabel}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {quadratics.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuadraticId(q.id)}
                  className={`rounded-md border px-3 py-2 text-left font-mono text-[11px] transition-colors ${
                    quadraticId === q.id
                      ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                      : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
