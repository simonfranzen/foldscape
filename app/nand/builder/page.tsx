"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// All gates expressed in terms of NAND.
const GATES: Record<
  string,
  {
    label: string;
    accent: string;
    formula: string;
    description: string;
    eval: (a: number, b: number) => number;
    // Wiring: each entry is an intermediate NAND with its two inputs
    // referenced symbolically (a, b, n0, n1 …). The final output is the
    // result of the last entry.
    wires: Array<{ name: string; left: string; right: string }>;
  }
> = {
  NAND: {
    label: "NAND",
    accent: "text-signal-violet",
    formula: "a ↑ b",
    description: "The primitive itself. 1 unless both inputs are 1.",
    eval: (a, b) => (a && b ? 0 : 1),
    wires: [{ name: "n0", left: "a", right: "b" }],
  },
  NOT: {
    label: "NOT a",
    accent: "text-signal-cyan",
    formula: "a ↑ a",
    description: "Both inputs of one NAND wired to the same signal.",
    eval: (a) => (a ? 0 : 1),
    wires: [{ name: "n0", left: "a", right: "a" }],
  },
  AND: {
    label: "AND",
    accent: "text-signal-amber",
    formula: "(a ↑ b) ↑ (a ↑ b)",
    description: "Two NANDs in series: NAND, then NOT the result.",
    eval: (a, b) => (a && b ? 1 : 0),
    wires: [
      { name: "n0", left: "a", right: "b" },
      { name: "n1", left: "n0", right: "n0" },
    ],
  },
  OR: {
    label: "OR",
    accent: "text-signal-rose",
    formula: "(a ↑ a) ↑ (b ↑ b)",
    description: "Invert each input, then NAND the inversions (De Morgan).",
    eval: (a, b) => (a || b ? 1 : 0),
    wires: [
      { name: "n0", left: "a", right: "a" },
      { name: "n1", left: "b", right: "b" },
      { name: "n2", left: "n0", right: "n1" },
    ],
  },
  XOR: {
    label: "XOR",
    accent: "text-signal-violet",
    formula: "(a ↑ (a ↑ b)) ↑ (b ↑ (a ↑ b))",
    description: "Four NANDs — the canonical XOR construction.",
    eval: (a, b) => (a !== b ? 1 : 0),
    wires: [
      { name: "n0", left: "a", right: "b" },
      { name: "n1", left: "a", right: "n0" },
      { name: "n2", left: "b", right: "n0" },
      { name: "n3", left: "n1", right: "n2" },
    ],
  },
};

const ORDER = ["NAND", "NOT", "AND", "OR", "XOR"];

function evalWires(
  wires: Array<{ name: string; left: string; right: string }>,
  a: number,
  b: number,
): Record<string, number> {
  const vals: Record<string, number> = { a, b };
  for (const w of wires) {
    const l = vals[w.left];
    const r = vals[w.right];
    vals[w.name] = l && r ? 0 : 1;
  }
  return vals;
}

export default function NandBuilder() {
  const { a: atlas, u } = useI18n();
  const topic = atlas.topics.nand;
  const [gate, setGate] = useState<keyof typeof GATES>("NAND");
  const [aBit, setABit] = useState(0);
  const [bBit, setBBit] = useState(0);

  const G = GATES[gate];
  const truth = [
    { a: 0, b: 0 },
    { a: 0, b: 1 },
    { a: 1, b: 0 },
    { a: 1, b: 1 },
  ].map((row) => ({ ...row, out: G.eval(row.a, row.b) }));
  const wireVals = evalWires(G.wires, aBit, bBit);
  const output = wireVals[G.wires[G.wires.length - 1].name];
  const nandCount = G.wires.length;

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col space-y-8 bg-ink-950 p-8 lg:min-h-[calc(100vh-3.5rem)] lg:p-12">
          {/* Top HUD */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              gate · <span className={G.accent}>{G.label}</span> · {nandCount} NAND
              {nandCount > 1 ? "s" : ""}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {G.formula}
            </div>
          </div>

          {/* Big output display */}
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <div className="space-y-2 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Inputs
              </div>
              <div className="flex items-center justify-center gap-6">
                <BitButton label="a" value={aBit} onChange={setABit} />
                <BitButton label="b" value={bBit} onChange={setBBit} />
              </div>
            </div>

            <div className="text-7xl text-ink-300">⇣</div>

            <div className="space-y-2 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Output
              </div>
              <div
                className={`math-italic flex h-24 w-24 items-center justify-center rounded-full border-2 text-5xl transition-colors ${
                  output
                    ? `${G.accent} bg-current/10 border-current`
                    : "border-ink-300/30 text-ink-200"
                }`}
                style={output ? { boxShadow: `0 0 40px 4px currentColor` } : undefined}
              >
                {output}
              </div>
            </div>

            {/* Intermediate wires */}
            {G.wires.length > 1 && (
              <div className="hairline w-full max-w-md space-y-2 rounded-2xl border bg-ink-950/40 p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  Internal NANDs
                </div>
                <div className="space-y-1.5">
                  {G.wires.map((w) => (
                    <div
                      key={w.name}
                      className="flex items-center justify-between font-mono text-xs"
                    >
                      <span className="text-ink-200">
                        {w.name} = {w.left} ↑ {w.right}
                      </span>
                      <span className={wireVals[w.name] ? G.accent : "text-ink-400"}>
                        {wireVals[w.name]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Choose a gate
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ORDER.map((k) => {
                const g = GATES[k];
                const active = gate === k;
                return (
                  <button
                    key={k}
                    onClick={() => setGate(k as keyof typeof GATES)}
                    className={`rounded-md border p-3 text-left transition-colors ${
                      active
                        ? "border-signal-violet/60 bg-signal-violet/10"
                        : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                    }`}
                  >
                    <div className={`text-sm ${active ? g.accent : "text-ink-100"}`}>{g.label}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                      {g.wires.length} NAND{g.wires.length > 1 ? "s" : ""}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="hairline border-t pt-2 text-xs leading-relaxed text-ink-300">
              {G.description}
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Truth table · {G.label}
            </div>
            <table className="w-full text-center font-mono">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="py-1 text-[11px]">a</th>
                  <th className="py-1 text-[11px]">b</th>
                  <th className={`py-1 text-[11px] ${G.accent}`}>out</th>
                </tr>
              </thead>
              <tbody className="text-sm text-ink-100">
                {truth.map((r, i) => {
                  const here = r.a === aBit && r.b === bBit;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-ink-700/30 last:border-0 ${here ? "bg-signal-violet/5" : ""}`}
                    >
                      <td className="py-2">{r.a}</td>
                      <td className="py-2">{r.b}</td>
                      <td className={`py-2 ${r.out ? G.accent : "text-ink-400"}`}>{r.out}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[11px] text-ink-400">The current input row is highlighted.</p>
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function BitButton({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
      <button
        onClick={() => onChange(value ? 0 : 1)}
        className={`math-italic flex h-20 w-20 items-center justify-center rounded-full border-2 text-5xl transition-colors ${
          value
            ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
            : "border-ink-300/30 bg-ink-950 text-ink-300"
        }`}
        style={value ? { boxShadow: "0 0 30px 2px rgba(255,209,102,0.5)" } : undefined}
      >
        {value}
      </button>
    </div>
  );
}
