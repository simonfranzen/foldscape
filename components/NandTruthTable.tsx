"use client";

import { useState } from "react";

// Interactive 4-row truth table.
// The user can flip a/b bits on any row to make it the "active" row, and the
// derived columns (NAND, NOT a, AND, OR, XOR) update immediately. The whole
// table stays visible — the active row is highlighted so the eye can follow
// what changed.

interface Props {
  caption: string;
  labels: {
    a: string;
    b: string;
    nand: string;
    nota: string;
    and: string;
    or: string;
    xor: string;
    hint: string;
    flip: string;
  };
}

type Row = { a: 0 | 1; b: 0 | 1 };

const ROWS: Row[] = [
  { a: 0, b: 0 },
  { a: 0, b: 1 },
  { a: 1, b: 0 },
  { a: 1, b: 1 },
];

function nand(a: 0 | 1, b: 0 | 1): 0 | 1 {
  return (a === 1 && b === 1 ? 0 : 1) as 0 | 1;
}
function notv(a: 0 | 1): 0 | 1 {
  return nand(a, a);
}
function andv(a: 0 | 1, b: 0 | 1): 0 | 1 {
  return notv(nand(a, b));
}
function orv(a: 0 | 1, b: 0 | 1): 0 | 1 {
  return nand(notv(a), notv(b));
}
function xorv(a: 0 | 1, b: 0 | 1): 0 | 1 {
  // a XOR b = NAND(NAND(a, NAND(a,b)), NAND(b, NAND(a,b)))
  const t = nand(a, b);
  return nand(nand(a, t), nand(b, t));
}

function rowIndex(a: 0 | 1, b: 0 | 1): number {
  return a * 2 + b;
}

export function NandTruthTable({ caption, labels }: Props) {
  const [active, setActive] = useState(3); // start with a=1, b=1 (the unique 0-row of NAND)

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
        {caption}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center font-mono text-sm">
          <thead className="hairline border-b text-ink-300">
            <tr>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest">{labels.a}</th>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest">{labels.b}</th>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest text-signal-violet">
                {labels.nand}
              </th>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest">{labels.nota}</th>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest">{labels.and}</th>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest">{labels.or}</th>
              <th className="px-2 py-2 text-[10px] uppercase tracking-widest">{labels.xor}</th>
            </tr>
          </thead>
          <tbody className="text-ink-100">
            {ROWS.map((row) => {
              const idx = rowIndex(row.a, row.b);
              const isActive = idx === active;
              const n = nand(row.a, row.b);
              const na = notv(row.a);
              const an = andv(row.a, row.b);
              const o = orv(row.a, row.b);
              const x = xorv(row.a, row.b);
              return (
                <tr
                  key={idx}
                  onClick={() => setActive(idx)}
                  tabIndex={0}
                  aria-selected={isActive}
                  onKeyDown={(e) => {
                    // Rows are the interactive control here, so make Enter/Space
                    // activate them like a button for keyboard users.
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(idx);
                    }
                  }}
                  className={`cursor-pointer border-b border-ink-700/30 transition-colors last:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-violet ${
                    isActive
                      ? "bg-signal-violet/10 ring-1 ring-signal-violet/40"
                      : "hover:bg-ink-900/40"
                  }`}
                >
                  <td className="px-2 py-3">
                    <Bit value={row.a} highlight={isActive} />
                  </td>
                  <td className="px-2 py-3">
                    <Bit value={row.b} highlight={isActive} />
                  </td>
                  <td className="px-2 py-3 text-base text-signal-violet">{n}</td>
                  <td className="px-2 py-3 text-ink-200">{na}</td>
                  <td className="px-2 py-3 text-ink-200">{an}</td>
                  <td className="px-2 py-3 text-ink-200">{o}</td>
                  <td className="px-2 py-3 text-ink-200">{x}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="hairline flex flex-col gap-2 border-t pt-3 font-mono text-[11px] text-ink-300 md:flex-row md:items-center md:justify-between">
        <span>{labels.flip}</span>
        <span className="text-signal-violet">{labels.hint}</span>
      </div>
    </div>
  );
}

function Bit({ value, highlight }: { value: 0 | 1; highlight: boolean }) {
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm transition-colors ${
        highlight
          ? value === 1
            ? "border-signal-violet bg-signal-violet/20 text-signal-violet"
            : "border-ink-300 bg-ink-900/60 text-ink-100"
          : value === 1
            ? "border-signal-violet/50 text-signal-violet"
            : "border-ink-700 text-ink-300"
      }`}
    >
      {value}
    </span>
  );
}
