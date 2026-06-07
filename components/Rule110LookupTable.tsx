"use client";

import { useMemo } from "react";

// The 8 neighbourhood patterns, in canonical Wolfram order from 111 (bit 7)
// down to 000 (bit 0). The output bits, read in the same order, form the
// binary representation of the rule number.
const PATTERNS = ["111", "110", "101", "100", "011", "010", "001", "000"] as const;

const PRESETS: Array<{ label: string; rule: number }> = [
  { label: "Rule 30", rule: 30 },
  { label: "Rule 90", rule: 90 },
  { label: "Rule 110", rule: 110 },
  { label: "Rule 184", rule: 184 },
];

interface Props {
  rule: number;
  onRuleChange: (next: number) => void;
  caption?: string;
}

export function Rule110LookupTable({ rule, onRuleChange, caption }: Props) {
  // Decode the rule byte into the eight output bits. Bit at position k (where
  // k is the integer value of the neighbourhood pattern) gives that pattern's
  // output. PATTERNS is ordered 111 → 000, i.e. k = 7 → 0.
  const outputs = useMemo(() => {
    return PATTERNS.map((p) => {
      const k = parseInt(p, 2);
      return (rule >> k) & 1;
    });
  }, [rule]);

  const binary = outputs.join("");

  const toggle = (idx: number) => {
    const k = parseInt(PATTERNS[idx], 2);
    const mask = 1 << k;
    onRuleChange(rule ^ mask);
  };

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {caption}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {PATTERNS.map((pattern, i) => {
          const value = outputs[i];
          return (
            <button
              key={pattern}
              type="button"
              onClick={() => toggle(i)}
              className="hairline group space-y-2 rounded-md border bg-ink-950/30 p-2 text-center transition-colors hover:border-signal-cyan/60 hover:bg-signal-cyan/5"
              aria-label={`Toggle output for ${pattern}`}
            >
              <div className="flex justify-center gap-0.5">
                {pattern.split("").map((b, bi) => (
                  <div
                    key={bi}
                    className={`hairline h-4 w-4 rounded-sm border ${
                      b === "1" ? "border-signal-cyan/70 bg-signal-cyan/80" : "bg-ink-950"
                    }`}
                  />
                ))}
              </div>
              <div className="font-mono text-[10px] text-ink-400">{pattern}</div>
              <div className="flex justify-center">
                <div
                  className={`h-5 w-5 rounded-sm border ${
                    value === 1
                      ? "border-signal-cyan/70 bg-signal-cyan"
                      : "hairline bg-ink-950 group-hover:border-signal-cyan/50"
                  }`}
                />
              </div>
              <div
                className={`font-mono text-[11px] ${
                  value === 1 ? "text-signal-cyan" : "text-ink-500"
                }`}
              >
                {value}
              </div>
            </button>
          );
        })}
      </div>

      <div className="hairline flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
        <div className="text-center font-mono text-sm text-ink-100 md:text-left">
          <span className="text-signal-cyan">{binary}</span>
          <span className="mx-2 text-ink-400">₂ =</span>
          <span className="text-signal-amber">{rule}</span>
          <span className="text-ink-400">₁₀</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.rule}
              type="button"
              onClick={() => onRuleChange(p.rule)}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                rule === p.rule
                  ? "border-signal-cyan bg-signal-cyan/15 text-signal-cyan"
                  : "hairline text-ink-300 hover:border-signal-cyan/60 hover:text-signal-cyan"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
