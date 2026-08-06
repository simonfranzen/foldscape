"use client";

import { useMemo, useState } from "react";

interface Props {
  caption: string;
  inputLabel: string;
  presetsLabel: string;
  pathLabel: string;
  convergentsLabel: string;
  stepHead: string;
  fractionHead: string;
  decimalHead: string;
  errorHead: string;
  presets: Array<{ id: string; label: string; value: number }>;
}

interface Step {
  num: number;
  den: number;
  side: "L" | "R" | null;
}

function walk(target: number, maxDepth: number): Step[] {
  let lo_n = 0,
    lo_d = 1;
  let hi_n = 1,
    hi_d = 0;
  const out: Step[] = [{ num: 1, den: 1, side: null }];
  let med_n = 1,
    med_d = 1;
  for (let i = 0; i < maxDepth; i++) {
    const val = med_n / med_d;
    if (Math.abs(val - target) < 1e-15) break;
    if (target < val) {
      hi_n = med_n;
      hi_d = med_d;
      out[out.length - 1]!.side = "L";
    } else {
      lo_n = med_n;
      lo_d = med_d;
      out[out.length - 1]!.side = "R";
    }
    med_n = lo_n + hi_n;
    med_d = lo_d + hi_d;
    if (!Number.isFinite(med_n) || !Number.isFinite(med_d) || med_d > 1e12) break;
    out.push({ num: med_n, den: med_d, side: null });
  }
  return out;
}

export function SternBrocotWalk({
  caption,
  inputLabel,
  presetsLabel,
  pathLabel,
  convergentsLabel,
  stepHead,
  fractionHead,
  decimalHead,
  errorHead,
  presets,
}: Props) {
  const initial = presets[0]?.value ?? Math.PI;
  const [input, setInput] = useState<string>(initial.toFixed(8));

  const target = useMemo(() => parseFloat(input), [input]);
  const path = useMemo(
    () => (Number.isFinite(target) && target > 0 ? walk(target, 24) : []),
    [target],
  );

  // The convergents are the LAST node of each L/R run, the node reached just
  // before the direction flips. Each node's `side` is the move taken from it,
  // so a run ends at node i whenever side[i] differs from side[i+1]. The first
  // 1/1 only qualifies when the very first run has length 1 (then side[0] !==
  // side[1]); for a longer opening run it is a semiconvergent and is skipped.
  const convergents = useMemo(() => {
    const out: Array<{ num: number; den: number; step: number }> = [];
    if (path.length === 0) return out;
    for (let i = 0; i < path.length - 1; i++) {
      const here = path[i]!.side;
      const next = path[i + 1]!.side;
      if (here !== null && next !== null && here !== next) {
        out.push({ num: path[i]!.num, den: path[i]!.den, step: i });
      }
    }
    // The last visited node is the current best approximation reached.
    const last = path[path.length - 1]!;
    if (
      out.length === 0 ||
      out[out.length - 1]!.num !== last.num ||
      out[out.length - 1]!.den !== last.den
    ) {
      out.push({ num: last.num, den: last.den, step: path.length - 1 });
    }
    return out;
  }, [path]);

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {caption}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {inputLabel}
          </div>
          <input
            type="number"
            value={input}
            step="0.00000001"
            aria-label={inputLabel}
            onChange={(e) => setInput(e.target.value)}
            className="hairline w-full rounded-md border bg-ink-950 px-3 py-2 font-mono text-sm text-signal-cyan"
          />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {presetsLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setInput(p.value.toFixed(10))}
                className="hairline rounded-md border px-3 py-1.5 font-mono text-[11px] text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {pathLabel}
        </div>
        <div className="break-all font-mono text-sm leading-relaxed text-signal-amber">
          {path.map((p) => p.side ?? "·").join("") || "·"}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {convergentsLabel}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead className="hairline border-b text-ink-300">
              <tr>
                <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                  {stepHead}
                </th>
                <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                  {fractionHead}
                </th>
                <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                  {decimalHead}
                </th>
                <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                  {errorHead}
                </th>
              </tr>
            </thead>
            <tbody>
              {convergents.map((c, i) => {
                const v = c.num / c.den;
                const err = Math.abs(v - target);
                return (
                  <tr key={i} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-1.5 text-ink-400">{c.step}</td>
                    <td className="px-2 py-1.5 text-signal-cyan">
                      {c.num}/{c.den}
                    </td>
                    <td className="px-2 py-1.5 text-ink-200">{v.toFixed(10)}</td>
                    <td className="px-2 py-1.5 text-ink-300">{err.toExponential(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
