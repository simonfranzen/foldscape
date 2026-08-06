"use client";

import { useMemo, useState } from "react";

// Inline Cantor-diagonal demo. Shows N fake reals in [0,1] as decimal
// expansions, highlights the diagonal digit on each row, and assembles a
// "constructed real" beneath where every digit differs from the diagonal
// (via safeFlip, which also avoids 0 and 9). The list can be randomised; the
// slider chooses how many rows to display.

interface Props {
  caption: string;
  rowsLabel: string;
  randomiseLabel: string;
  constructedLabel: string;
  hint: string;
  ruleLabel: string;
  rowLabel: string;
  diagonalLabel: string;
}

const MAX_ROWS = 10;
const MIN_ROWS = 4;
const DIGITS_BUFFER = 12; // generate plenty so widths align

// Swap a diagonal digit for a different one that is never 0 or 9. Section 03
// of the story warns that landing on 0 or 9 reopens the 0.999… = 1.000…
// aliasing, so the demo must honour that rule too (a plain (d+1) mod 10 would
// map 8→9 and 9→0). Mirrors the explorer's plusOne strategy.
function safeFlip(d: number): number {
  let next = (d + 1) % 10;
  for (let i = 0; i < 10; i++) {
    if (next !== d && next !== 0 && next !== 9) return next;
    next = (next + 1) % 10;
  }
  return 1;
}

function makeDigits(seed: number): number[][] {
  // Deterministic pseudo-random — a tiny LCG so the layout stays stable
  // between rerenders but a "randomise" button can advance it.
  let s = seed | 0;
  const next = () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) % 10;
  };
  const grid: number[][] = [];
  for (let i = 0; i < MAX_ROWS; i++) {
    const row: number[] = [];
    for (let j = 0; j < DIGITS_BUFFER; j++) row.push(next());
    grid.push(row);
  }
  return grid;
}

export function CantorDiagonalDemo({
  caption,
  rowsLabel,
  randomiseLabel,
  constructedLabel,
  hint,
  ruleLabel,
  rowLabel,
  diagonalLabel,
}: Props) {
  const [seed, setSeed] = useState<number>(20240131);
  const [rows, setRows] = useState<number>(6);

  const grid = useMemo(() => makeDigits(seed), [seed]);

  const visibleRows = grid.slice(0, rows);
  const diagonalDigits = visibleRows.map((row, i) => row[i]!);
  const constructed = diagonalDigits.map(safeFlip);
  // Number of digit columns to render: enough to hold the diagonal and a
  // couple after it, but keep things compact.
  const cols = Math.min(rows + 2, DIGITS_BUFFER);

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
        <button
          onClick={() => setSeed((s) => (s * 16807 + 1) | 0)}
          className="rounded-full border border-signal-rose/60 bg-signal-rose/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/20"
        >
          ↻ {randomiseLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate font-mono text-sm" style={{ borderSpacing: 0 }}>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={`r-${i}`} className="border-b border-ink-700/30">
                <td className="w-14 whitespace-nowrap py-1.5 pr-3 text-right text-ink-400">
                  {rowLabel}
                  <sub>{i + 1}</sub>
                </td>
                <td className="py-1.5 pr-2 text-ink-300">0.</td>
                {Array.from({ length: cols }).map((_, j) => {
                  const digit = row[j]!;
                  const isDiag = i === j;
                  return (
                    <td
                      key={`r-${i}-c-${j}`}
                      className={`w-7 px-1 py-1.5 text-center ${
                        isDiag
                          ? "rounded bg-signal-amber/15 font-semibold text-signal-amber"
                          : "text-ink-200"
                      }`}
                    >
                      {digit}
                    </td>
                  );
                })}
                <td className="py-1.5 pl-2 text-ink-500">…</td>
              </tr>
            ))}

            {/* Constructed real — built from the diagonal */}
            <tr>
              <td
                colSpan={cols + 3}
                className="pb-1 pt-4 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose"
              >
                {constructedLabel}
              </td>
            </tr>
            <tr>
              <td className="w-14 whitespace-nowrap py-2 pr-3 text-right font-semibold text-signal-rose">
                s
              </td>
              <td className="py-2 pr-2 text-signal-rose">0.</td>
              {Array.from({ length: cols }).map((_, j) => {
                const inDiagonal = j < rows;
                const digit = inDiagonal ? constructed[j]! : null;
                return (
                  <td
                    key={`s-c-${j}`}
                    className={`w-7 px-1 py-2 text-center ${
                      inDiagonal
                        ? "rounded bg-signal-rose/10 font-semibold text-signal-rose"
                        : "text-ink-500"
                    }`}
                  >
                    {digit !== null ? digit : "·"}
                  </td>
                );
              })}
              <td className="py-2 pl-2 text-signal-rose">…</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="hairline rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-200">
        {/* Invariant guaranteed by safeFlip: sₙ differs from the diagonal digit
            and never lands on 0 or 9, so no 0.999… = 1.000… aliasing. */}
        <span className="text-signal-rose">{ruleLabel}</span> s<sub>n</sub> ≠ d<sub>n,n</sub>, s
        <sub>n</sub> ∉ {"{0, 9}"}
      </div>

      <div className="flex items-center gap-4">
        <label
          htmlFor="cantor-demo-rows"
          className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
        >
          {rowsLabel}
        </label>
        <input
          id="cantor-demo-rows"
          type="range"
          min={MIN_ROWS}
          max={MAX_ROWS}
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value, 10))}
          className="flex-1 accent-signal-rose"
          aria-label={rowsLabel}
        />
        <span className="w-8 text-right font-mono text-sm text-signal-rose">{rows}</span>
      </div>

      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest2">
        <span className="inline-block h-3 w-3 rounded bg-signal-amber/40" />
        <span className="text-ink-300">{diagonalLabel}</span>
      </div>

      <p className="text-xs leading-relaxed text-ink-300">{hint}</p>
    </div>
  );
}
