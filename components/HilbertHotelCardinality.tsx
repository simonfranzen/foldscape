"use client";

import { useMemo, useState } from "react";

// Cardinality comparator: shows the bijections ℕ ↔ 2ℕ (n ↔ 2n) and
// ℕ ↔ ℕ×ℕ (Cantor pairing), versus the failure of any bijection ℕ → ℝ
// (Cantor's diagonal). Slider controls how many pairs are drawn.

type Mode = "doubles" | "pairs" | "reals";

interface Props {
  caption: string;
  modeDoublesLabel: string;
  modePairsLabel: string;
  modeRealsLabel: string;
  sliderLabel: string;
  hintLabel: string;
  countableLabel: string;
  uncountableLabel: string;
  bijectionLabel: string;
  noBijectionLabel: string;
}

// Cantor pairing function π(a, b) = ½ (a+b)(a+b+1) + b, for a, b ≥ 0.
// We expose its inverse so we can list the pairs (a, b) for n = 0, 1, 2, …
function unpair(n: number): [number, number] {
  // w = ⌊(√(8n+1) − 1)/2⌋
  const w = Math.floor((Math.sqrt(8 * n + 1) - 1) / 2);
  const t = (w * (w + 1)) / 2;
  const b = n - t;
  const a = w - b;
  return [a, b];
}

export function HilbertHotelCardinality({
  caption,
  modeDoublesLabel,
  modePairsLabel,
  modeRealsLabel,
  sliderLabel,
  hintLabel,
  countableLabel,
  uncountableLabel,
  bijectionLabel,
  noBijectionLabel,
}: Props) {
  const [mode, setMode] = useState<Mode>("doubles");
  const [count, setCount] = useState(8);

  const rows = useMemo(() => {
    const out: Array<{ left: string; right: string; key: string }> = [];
    if (mode === "doubles") {
      for (let n = 1; n <= count; n++) {
        out.push({ left: String(n), right: String(2 * n), key: `d-${n}` });
      }
    } else if (mode === "pairs") {
      for (let n = 0; n < count; n++) {
        const [a, b] = unpair(n);
        out.push({ left: String(n + 1), right: `(${a}, ${b})`, key: `p-${n}` });
      }
    } else {
      // Reals: show a fake enumeration plus a generated diagonal-disagreeing real
      const digits: string[] = [];
      for (let n = 0; n < count; n++) {
        // deterministic pseudo-decimal for display: 0.d1d2d3...
        const seed = (n + 1) * 0.123456789;
        const frac = (Math.sin(seed) * 10000 + 1) % 1;
        // toFixed(12) > the reals-mode slider max (10) so every row always has
        // a real digit at its own diagonal position; toFixed(8) truncated rows
        // 9+ and the diagonal fell back to a phantom "0".
        const s = frac.toFixed(12).slice(2, 2 + Math.max(count, 8));
        digits.push(s);
        out.push({
          left: String(n + 1),
          right: `0.${s}`,
          key: `r-${n}`,
        });
      }
    }
    return out;
  }, [mode, count]);

  // For the reals mode, compute the "diagonal" real that differs from
  // every row at its own diagonal digit — Cantor's construction.
  const diagonal = useMemo(() => {
    if (mode !== "reals") return null;
    const len = Math.max(count, 8);
    const digits: string[] = [];
    for (let n = 0; n < count; n++) {
      const seed = (n + 1) * 0.123456789;
      const frac = (Math.sin(seed) * 10000 + 1) % 1;
      const s = frac.toFixed(12).slice(2, 2 + len);
      const d = s[n] ?? "0";
      // flip digit: anything ≠ d, and stay in {1..8} to avoid 0/9 edge cases
      const next = String(((parseInt(d, 10) + 5) % 8) + 1);
      digits.push(next);
    }
    return digits.join("");
  }, [mode, count]);

  const isCountable = mode !== "reals";

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
        <div
          className={`font-mono text-[10px] uppercase tracking-widest2 ${
            isCountable ? "text-signal-cyan" : "text-signal-amber"
          }`}
        >
          {isCountable ? `|ℕ| = ${countableLabel}` : `|ℝ| > |ℕ| · ${uncountableLabel}`}
        </div>
      </div>

      {/* Mode picker */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("doubles")}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            mode === "doubles"
              ? "border-signal-cyan/70 bg-signal-cyan/15 text-signal-cyan"
              : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
          }`}
        >
          {modeDoublesLabel}
        </button>
        <button
          type="button"
          onClick={() => setMode("pairs")}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            mode === "pairs"
              ? "border-signal-cyan/70 bg-signal-cyan/15 text-signal-cyan"
              : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
          }`}
        >
          {modePairsLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("reals");
            // Reals mode caps the slider at 10; carry an over-large count down so
            // the readout, thumb and rendered rows stay in sync.
            setCount((c) => Math.min(c, 10));
          }}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            mode === "reals"
              ? "border-signal-amber/70 bg-signal-amber/15 text-signal-amber"
              : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
          }`}
        >
          {modeRealsLabel}
        </button>
      </div>

      {/* Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          <span>{sliderLabel}</span>
          <span className="text-signal-cyan">{count}</span>
        </div>
        <input
          type="range"
          aria-label={sliderLabel}
          value={count}
          min={3}
          max={mode === "reals" ? 10 : 16}
          step={1}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="w-full accent-signal-cyan"
        />
      </div>

      {/* Bijection table */}
      <div className="hairline overflow-x-auto rounded-lg border bg-ink-950/60 p-3">
        <table className="w-full font-mono text-[11px]">
          <thead className="hairline border-b text-ink-400">
            <tr>
              <th className="px-2 py-1 text-left text-[9px] uppercase tracking-widest">ℕ</th>
              <th className="px-2 py-1 text-center text-[9px] uppercase tracking-widest">
                {isCountable ? bijectionLabel : noBijectionLabel}
              </th>
              <th className="px-2 py-1 text-left text-[9px] uppercase tracking-widest">
                {mode === "doubles" ? "2ℕ" : mode === "pairs" ? "ℕ × ℕ" : "ℝ"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.key} className="border-b border-ink-700/30 last:border-0">
                <td className="w-12 px-2 py-1 text-signal-cyan">{r.left}</td>
                <td className="px-2 py-1 text-center text-ink-500">↔</td>
                <td className={`px-2 py-1 ${mode === "reals" ? "text-ink-200" : "text-ink-100"}`}>
                  {mode === "reals" ? (
                    <span>
                      0.
                      {(r.right.slice(2) ?? "").split("").map((ch, j) => (
                        <span key={j} className={j === i ? "font-bold text-signal-rose" : ""}>
                          {ch}
                        </span>
                      ))}
                    </span>
                  ) : (
                    r.right
                  )}
                </td>
              </tr>
            ))}
            {mode === "reals" && diagonal && (
              <tr className="border-t-2 border-signal-rose/60">
                <td className="px-2 py-1 text-signal-rose">?</td>
                <td className="px-2 py-1 text-center text-signal-rose">≠</td>
                <td className="px-2 py-1 text-signal-rose">0.{diagonal}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="hairline border-t pt-3 text-[11px] leading-relaxed text-ink-300">{hintLabel}</p>
    </div>
  );
}
