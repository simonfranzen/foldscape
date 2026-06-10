"use client";

import { useMemo, useState } from "react";

// Inline interactive for the SAT story page. A fixed little 3-variable formula
// in conjunctive normal form; the reader toggles each variable true/false and
// watches the clauses turn green. The verdict line reports satisfaction live.
// Four of the eight assignments satisfy it — findable by hand, the whole point
// of "easy to verify".

type Lit = { v: number; neg: boolean };

const VARS = ["a", "b", "c"];

const CLAUSES: Lit[][] = [
  [
    { v: 0, neg: false },
    { v: 1, neg: false },
    { v: 2, neg: true },
  ],
  [
    { v: 0, neg: true },
    { v: 1, neg: true },
    { v: 2, neg: false },
  ],
  [
    { v: 0, neg: false },
    { v: 1, neg: true },
    { v: 2, neg: false },
  ],
  [
    { v: 0, neg: true },
    { v: 1, neg: false },
    { v: 2, neg: true },
  ],
];

const litSat = (l: Lit, a: boolean[]) => (l.neg ? !a[l.v] : a[l.v]);
const clauseSat = (c: Lit[], a: boolean[]) => c.some((l) => litSat(l, a));
const litText = (l: Lit) => (l.neg ? "¬" : "") + VARS[l.v];

// Start on an unsatisfying assignment (a=F, b=F, c=T makes clause 1 false), so
// there is something to fix.
const START: boolean[] = [false, false, true];

interface Props {
  caption: string;
  hint: string;
  satisfiedLabel: string;
  unsatisfiedLabel: string;
  resetLabel: string;
}

export function SatClauseToggle({
  caption,
  hint,
  satisfiedLabel,
  unsatisfiedLabel,
  resetLabel,
}: Props) {
  const [assign, setAssign] = useState<boolean[]>(START);

  const clauseStates = useMemo(() => CLAUSES.map((c) => clauseSat(c, assign)), [assign]);
  const solved = clauseStates.every(Boolean);

  const toggle = (i: number) => setAssign((a) => a.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
          {caption}
        </div>
        <div
          className={`font-mono text-[10px] uppercase tracking-widest2 ${
            solved ? "text-signal-violet" : "text-ink-400"
          }`}
        >
          {clauseStates.filter(Boolean).length} / {CLAUSES.length} ✓
        </div>
      </div>

      {/* Variable toggles */}
      <div className="flex flex-wrap gap-2">
        {VARS.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={assign[i]}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm transition-colors ${
              assign[i]
                ? "border-signal-cyan/70 bg-signal-cyan/15 text-signal-cyan"
                : "hairline text-ink-300 hover:border-ink-300/50"
            }`}
          >
            <span className="text-base">{name}</span>
            <span className="opacity-70">=</span>
            <span className="font-bold">{assign[i] ? "T" : "F"}</span>
          </button>
        ))}
      </div>

      {/* Clauses (the conjunction) */}
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {CLAUSES.map((clause, j) => (
          <span key={j} className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
                clauseStates[j]
                  ? "border-signal-teal/60 bg-signal-teal/10"
                  : "border-signal-rose/40 bg-signal-rose/5"
              }`}
            >
              <span className="text-ink-500">(</span>
              {clause.map((l, k) => (
                <span key={k}>
                  <span className={litSat(l, assign) ? "text-signal-teal" : "text-ink-400"}>
                    {litText(l)}
                  </span>
                  {k < clause.length - 1 && <span className="text-ink-600"> ∨ </span>}
                </span>
              ))}
              <span className="text-ink-500">)</span>
            </span>
            {j < CLAUSES.length - 1 && <span className="font-mono text-ink-600">∧</span>}
          </span>
        ))}
      </div>

      {/* Verdict */}
      <div
        className={`rounded-md border px-4 py-3 text-sm leading-relaxed transition-colors ${
          solved
            ? "border-signal-violet/50 bg-signal-violet/10 text-ink-100"
            : "hairline text-ink-300"
        }`}
      >
        {solved ? satisfiedLabel : unsatisfiedLabel}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="max-w-xl text-[11px] leading-relaxed text-ink-400">{hint}</p>
        <button
          type="button"
          onClick={() => setAssign(START)}
          className="hairline shrink-0 rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
        >
          ↺ {resetLabel}
        </button>
      </div>
    </div>
  );
}
