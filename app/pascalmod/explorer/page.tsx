"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const PALETTE = [
  "#06070d", // residue 0 = empty
  "#ffd166", // 1
  "#7df3ff", // 2
  "#b388ff", // 3
  "#ff7ab6", // 4
  "#a0e89a", // 5
  "#ff9a55", // 6
  "#c4c6d0", // 7
  "#8ddfff", // 8
  "#ffe28a", // 9
  "#ff6b9b", // 10
  "#7afdd6", // 11
];

export default function PascalmodExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.pascalmod;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [modulus, setModulus] = useState(2);
  const [rows, setRows] = useState(256);
  const [highlightCarry, _setHighlightCarry] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = () => {
      const W = canvas.clientWidth * dpr;
      const H = canvas.clientHeight * dpr;
      canvas.width = Math.floor(W);
      canvas.height = Math.floor(H);
      ctx.fillStyle = "#06070d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Triangle bounding box
      const maxRow = rows;
      const cellSize = Math.min(canvas.width / maxRow, (canvas.height * 1.05) / maxRow);
      const triBaseW = maxRow * cellSize;
      const triH = maxRow * cellSize * 0.92;
      const offsetX = (canvas.width - triBaseW) / 2;
      const offsetY = (canvas.height - triH) / 2;

      // Generate rows incrementally storing residues only
      let prev = new Uint8Array(1);
      prev[0] = 1;
      for (let n = 0; n < maxRow; n++) {
        const len = n + 1;
        for (let k = 0; k < len; k++) {
          const r = prev[k];
          if (r !== 0) {
            const x = offsetX + (maxRow - n) * (cellSize / 2) + k * cellSize;
            const y = offsetY + n * cellSize * 0.92;
            ctx.fillStyle = PALETTE[r % PALETTE.length];
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
        // build next
        const next = new Uint8Array(len + 1);
        next[0] = 1 % modulus;
        next[len] = 1 % modulus;
        for (let k = 0; k < len - 1; k++) {
          next[k + 1] = (prev[k] + prev[k + 1]) % modulus;
        }
        prev = next;
      }

      if (highlightCarry) {
        // outline cells whose value is zero (carry happened) — too many to draw; skip for >128 rows
        // (kept here as conceptual handle; real outline would need pre-pass)
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [modulus, rows, highlightCarry]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[60vh] bg-ink-950 lg:min-h-[calc(100vh-3.5rem)]">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              C(n, k) mod {modulus} · {rows} rows
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {modulus === 2 ? "Sierpiński" : `${modulus}-gasket`}
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
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Modulus p
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 5, 7, 11, 13, 17, 23].map((p) => (
                <button
                  key={p}
                  onClick={() => setModulus(p)}
                  className={`rounded-md border py-2 font-mono text-xs transition-colors ${
                    modulus === p
                      ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] text-ink-400">
              Primes give clean gaskets — Kummer's theorem.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Rows
              </div>
              <div className="font-mono text-[10px] text-ink-400">{rows}</div>
            </div>
            <input
              type="range"
              value={rows}
              min={16}
              max={512}
              step={8}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <p className="font-mono text-[10px] text-ink-400">More rows = finer fractal detail.</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Residue legend
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: modulus }, (_, i) => i).map((i) => (
                <div
                  key={i}
                  className="hairline flex items-center gap-1.5 rounded-md border px-2 py-1"
                >
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="font-mono text-[10px] text-ink-300">{i}</span>
                </div>
              ))}
            </div>
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
