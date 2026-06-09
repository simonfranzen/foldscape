"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface PathStep {
  num: number;
  den: number;
  side: "L" | "R" | null;
}

// Walk the Stern–Brocot tree toward `target`, returning the path.
function walk(target: number, maxDepth = 64): PathStep[] {
  // Use bigint-safe ints — keep as plain numbers within safe range here.
  let lo_n = 0,
    lo_d = 1; // 0/1
  let hi_n = 1,
    hi_d = 0; // 1/0 = +∞
  const out: PathStep[] = [{ num: 1, den: 1, side: null }];
  let med_n = 1,
    med_d = 1;
  for (let i = 0; i < maxDepth; i++) {
    const val = med_n / med_d;
    if (Math.abs(val - target) < 1e-15) break;
    if (target < val) {
      hi_n = med_n;
      hi_d = med_d;
      out[out.length - 1].side = "L";
    } else {
      lo_n = med_n;
      lo_d = med_d;
      out[out.length - 1].side = "R";
    }
    med_n = lo_n + hi_n;
    med_d = lo_d + hi_d;
    if (!Number.isFinite(med_n) || !Number.isFinite(med_d) || med_d > 1e15) break;
    out.push({ num: med_n, den: med_d, side: null });
  }
  return out;
}

// Convert path to continued fraction expansion via run-length encoding.
function pathToCF(path: PathStep[]): number[] {
  const out: number[] = [];
  let run = 0;
  let prev: "L" | "R" | null = null;
  for (const p of path) {
    if (p.side === prev) {
      run++;
    } else {
      if (prev !== null) out.push(run);
      prev = p.side;
      run = 1;
    }
    if (p.side === null) break;
  }
  if (prev !== null && run > 0) out.push(run);
  // CF convention: [a0; a1, a2, ...] — first term is the integer part.
  // Walking from 1/1, the initial run of R is (a0 - 1) since the path starts at 1/1.
  // But for clarity we'll just present the raw run-lengths.
  return out;
}

const PRESETS: Array<{ id: string; label: string; value: number }> = [
  { id: "golden", label: "φ — golden ratio", value: (1 + Math.sqrt(5)) / 2 },
  { id: "pi", label: "π", value: Math.PI },
  { id: "e", label: "e", value: Math.E },
  { id: "sqrt2", label: "√2", value: Math.SQRT2 },
  { id: "third", label: "1/3", value: 1 / 3 },
  { id: "twothirds", label: "2/3", value: 2 / 3 },
  { id: "frac227", label: "22/7", value: 22 / 7 },
];

export default function SternbrocotExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.sternbrocot;

  const [input, setInput] = useState<string>(((1 + Math.sqrt(5)) / 2).toFixed(8));
  const [depth, setDepth] = useState(20);

  const target = useMemo(() => parseFloat(input), [input]);
  const path = useMemo(
    () => (Number.isFinite(target) && target > 0 ? walk(target, depth) : []),
    [target, depth],
  );
  const cf = useMemo(() => pathToCF(path), [path]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="scrollbar-thin relative min-h-[60vh] overflow-y-auto bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="glass hairline rounded-md border px-4 py-3 font-mono text-xs text-ink-200">
              Target: <span className="text-signal-teal">{target.toFixed(12)}</span>
              <span className="mx-3 text-ink-500">·</span>
              Depth: <span className="text-signal-teal">{path.length}</span>
            </div>

            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                Path · L = smaller · R = larger
              </div>
              <div className="break-all font-mono text-sm leading-relaxed text-ink-100">
                {path.map((p) => p.side ?? "·").join("")}
              </div>
            </div>

            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                Continued fraction · run-length encoding of the path
              </div>
              <div className="font-mono text-lg text-signal-amber">
                [{cf.length > 0 ? cf.join("; ").replace(";", ";") : "…"}]
              </div>
              <div className="font-mono text-[11px] leading-relaxed text-ink-400">
                = {cf.length > 0 ? cfExpr(cf) : "…"}
              </div>
            </div>

            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                Best rational approximations · the convergents along the walk
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead className="hairline border-b text-ink-300">
                    <tr>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        step
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        fraction
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        decimal
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        error
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                        side
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {path.slice(-32).map((p, i) => {
                      const value = p.num / p.den;
                      const err = Math.abs(value - target);
                      return (
                        <tr key={i} className="border-b border-ink-700/30 last:border-0">
                          <td className="px-2 py-1.5 text-ink-400">
                            {path.length - 32 + i + 1 > 0 ? path.length - 32 + i + 1 : i + 1}
                          </td>
                          <td className="px-2 py-1.5 text-signal-teal">
                            {p.num}/{p.den}
                          </td>
                          <td className="px-2 py-1.5 text-ink-200">{value.toFixed(10)}</td>
                          <td className="px-2 py-1.5 text-ink-300">{err.toExponential(2)}</td>
                          <td className="px-2 py-1.5 text-signal-amber">{p.side ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Target
            </div>
            <input
              type="number"
              value={input}
              step="0.00000001"
              onChange={(e) => setInput(e.target.value)}
              className="hairline w-full rounded-md border bg-ink-950 px-3 py-2 font-mono text-sm text-signal-teal"
            />
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Famous numbers
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setInput(p.value.toFixed(12))}
                  className="hairline rounded-md border px-3 py-2 text-left text-ink-200 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span>{p.label}</span>
                    <span className="text-ink-400">{p.value.toFixed(6)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                Depth
              </div>
              <div className="font-mono text-[10px] text-ink-400">{depth}</div>
            </div>
            <input
              type="range"
              value={depth}
              min={4}
              max={60}
              step={1}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-signal-teal"
            />
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-teal/40 hover:text-signal-teal"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function cfExpr(cf: number[]): string {
  // Build "a0 + 1 / (a1 + 1 / (a2 + …))"
  if (cf.length === 0) return "";
  let s = cf[cf.length - 1].toString();
  for (let i = cf.length - 2; i >= 0; i--) {
    s = `${cf[i]} + 1/(${s})`;
  }
  return s;
}
