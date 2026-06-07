"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// Highlightable quadratics — diagonals on the spiral.
const QUADRATICS = [
  { id: "none", label: "Off", a: 0, b: 0, c: 0 },
  { id: "euler", label: "Euler · n² − n + 41", a: 1, b: -1, c: 41 },
  { id: "n2n17", label: "n² + n + 17", a: 1, b: 1, c: 17 },
  { id: "n2n11", label: "n² + n + 11", a: 1, b: 1, c: 11 },
  { id: "4n2n", label: "4n² − 2n + 41", a: 4, b: -2, c: 41 },
  { id: "n2", label: "n²", a: 1, b: 0, c: 0 },
];

function buildSieve(N: number): Uint8Array {
  const s = new Uint8Array(N + 1);
  s[0] = s[1] = 1;
  for (let i = 2; i * i <= N; i++) {
    if (s[i] === 0) {
      for (let j = i * i; j <= N; j += i) s[j] = 1;
    }
  }
  // invert: 1 = prime
  for (let i = 0; i <= N; i++) s[i] = s[i] === 0 ? 1 : 0;
  return s;
}

// Spiral coordinate for n (1-indexed). Centered at (0, 0).
function spiralCoord(n: number): [number, number] {
  // Standard Ulam orientation: 1 in centre, 2 to the right, 3 up, 4 5 left, etc.
  if (n === 1) return [0, 0];
  // ring k contains numbers (2k-1)² + 1 .. (2k+1)²
  let k = Math.ceil((Math.sqrt(n) - 1) / 2);
  const sideLen = 2 * k;
  const start = (2 * k - 1) * (2 * k - 1) + 1;
  let off = n - start;
  // segments: right (k-1 entries upward), top (sideLen left), left (sideLen down), bottom (sideLen right)
  // Actually standard: from (k, -(k-1)) we go up to (k, k); then left to (-k, k); then down to (-k, -k); then right to (k, -k).
  let x = k,
    y = -(k - 1);
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

export default function UlamExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.ulam;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [side, setSide] = useState(251); // odd grid side (251×251 = 63 001 numbers)
  const [quadraticId, setQuadraticId] = useState("euler");

  const sieve = useMemo(() => buildSieve(side * side + 5), [side]);
  const quad = QUADRATICS.find((q) => q.id === quadraticId) ?? QUADRATICS[0];

  // Pre-compute which (x, y) cells are highlighted by the chosen quadratic.
  const highlightSet = useMemo(() => {
    if (quad.a === 0 && quad.b === 0 && quad.c === 0) return null;
    const set = new Set<number>();
    const max = side * side;
    for (let n = 0; n < 600; n++) {
      const v = quad.a * n * n + quad.b * n + quad.c;
      if (v < 1 || v > max) continue;
      const [x, y] = spiralCoord(v);
      // pack x, y as single int — x in [-side/2..side/2]
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

    const draw = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      const W = canvas.width;
      const H = canvas.height;
      const half = Math.floor(side / 2);
      const cell = Math.min(W, H) / side;
      const offsetX = (W - cell * side) / 2;
      const offsetY = (H - cell * side) / 2;

      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, W, H);

      const max = side * side;
      // Compute primes' (x, y) and paint.
      for (let n = 1; n <= max; n++) {
        if (sieve[n] === 0) continue;
        const [x, y] = spiralCoord(n);
        if (Math.abs(x) > half || Math.abs(y) > half) continue;
        const px = offsetX + (x + half) * cell;
        // y axis flipped — positive y points up in our coords but down on screen
        const py = offsetY + (half - y) * cell;
        const highlit = highlightSet?.has(((x + 1000) << 16) | (y + 1000));
        ctx.fillStyle = highlit ? "#ff7ab6" : "rgba(255, 209, 102, 0.85)";
        ctx.fillRect(px, py, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
      }

      // Mark centre 1
      const cx = offsetX + half * cell;
      const cy = offsetY + half * cell;
      ctx.strokeStyle = "rgba(125, 243, 255, 0.6)";
      ctx.lineWidth = 1 * dpr;
      ctx.strokeRect(cx, cy, Math.max(1, cell - 0.4), Math.max(1, cell - 0.4));
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [side, sieve, highlightSet]);

  const total = side * side;
  let primesCount = 0;
  for (let i = 0; i < sieve.length && i <= total; i++) if (sieve[i] === 1) primesCount++;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              spiral · {side} × {side} · {total.toLocaleString()} numbers
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {primesCount.toLocaleString()} primes
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Grid side
              </div>
              <div className="font-mono text-[10px] text-ink-400">{side}</div>
            </div>
            <input
              type="range"
              value={side}
              min={51}
              max={501}
              step={2}
              onChange={(e) => setSide(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <p className="font-mono text-[10px] text-ink-400">Odd numbers keep 1 centred.</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Highlight a quadratic
            </div>
            <div className="grid grid-cols-1 gap-2">
              {QUADRATICS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuadraticId(q.id)}
                  className={`rounded-md border px-3 py-2 text-left font-mono text-xs transition-colors ${
                    quadraticId === q.id
                      ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                      : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] text-ink-400">
              Pink = the diagonal the quadratic carves out.
            </p>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
