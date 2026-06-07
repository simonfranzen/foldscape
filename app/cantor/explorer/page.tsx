"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const ACCENT = "text-signal-violet";
const N = 16; // 16 rows × 16 digit columns

type NumberSource = "decimal" | "binary" | "custom";
type FlipStrategy = "swap56" | "plusOne";

// Deterministic pseudo-random digit generator so re-renders during edits stay
// stable; reseeds when the user clicks "regenerate" or changes source.
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function buildRandomTable(
  rows: number,
  cols: number,
  source: NumberSource,
  seed: number,
): number[][] {
  const rng = makeRng(seed);
  const out: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      if (source === "binary") row.push(rng() < 0.5 ? 0 : 1);
      else row.push(Math.floor(rng() * 10));
    }
    out.push(row);
  }
  return out;
}

function parseCustomTable(
  text: string,
  rows: number,
  cols: number,
  source: NumberSource,
): number[][] {
  // Each non-empty line is interpreted as a decimal number in [0,1].
  // We take the digits after the decimal point. Missing digits are padded
  // with zeros. Extra lines beyond `rows` are ignored; missing lines are
  // padded with random rows.
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const rng = makeRng(0xc0ffee);
  const out: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = new Array(cols).fill(0);
    const line = lines[i];
    if (line) {
      // Extract digits after the decimal point (or just digits if no dot).
      let digitStr = "";
      const dot = line.indexOf(".");
      if (dot >= 0) {
        for (let k = dot + 1; k < line.length && digitStr.length < cols; k++) {
          const c = line.charCodeAt(k);
          if (c >= 48 && c <= 57) digitStr += line[k];
        }
      } else {
        for (let k = 0; k < line.length && digitStr.length < cols; k++) {
          const c = line.charCodeAt(k);
          if (c >= 48 && c <= 57) digitStr += line[k];
        }
      }
      for (let j = 0; j < cols; j++) {
        if (j < digitStr.length) {
          const d = digitStr.charCodeAt(j) - 48;
          row[j] = source === "binary" ? (d > 0 ? 1 : 0) : d;
        } else {
          row[j] = 0;
        }
      }
    } else {
      for (let j = 0; j < cols; j++) {
        row[j] = source === "binary" ? (rng() < 0.5 ? 0 : 1) : Math.floor(rng() * 10);
      }
    }
    out.push(row);
  }
  return out;
}

function flipDigit(d: number, strategy: FlipStrategy, source: NumberSource): number {
  if (source === "binary") return d === 0 ? 1 : 0;
  if (strategy === "swap56") {
    if (d === 5) return 6;
    if (d === 6) return 5;
    // For anything else, still produce something ≠ d that isn't 0 or 9.
    return d === 5 ? 6 : 5;
  }
  // +1 mod 10, skipping 0 and 9 (and equal-to-d)
  let next = (d + 1) % 10;
  for (let safety = 0; safety < 10; safety++) {
    if (next !== d && next !== 0 && next !== 9) return next;
    next = (next + 1) % 10;
  }
  return d === 0 ? 1 : 0;
}

export default function CantorExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.cantor;

  const [source, setSource] = useState<NumberSource>("decimal");
  const [strategy, setStrategy] = useState<FlipStrategy>("swap56");
  const [customText, setCustomText] = useState<string>(
    [
      "0.31415926535897932",
      "0.27182818284590452",
      "0.14142135623730950",
      "0.16180339887498949",
      "0.69314718055994530",
      "0.57721566490153286",
      "0.91596559417721901",
      "0.20787957635076190",
      "0.66016181584686957",
      "0.26149721284764278",
      "0.28016949902386913",
      "0.30366300289873265",
      "0.35323637185499598",
      "0.41245403364312509",
      "0.48390077303618877",
      "0.56714329040978387",
    ].join("\n"),
  );
  const [seed, setSeed] = useState(1);

  const [step, setStep] = useState(0); // 0..N
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700); // ms per step
  const [revealed, setRevealed] = useState(false);
  const [highlightRow, setHighlightRow] = useState<number>(-1);

  const table = useMemo<number[][]>(() => {
    if (source === "custom") return parseCustomTable(customText, N, N, "decimal");
    return buildRandomTable(N, N, source, seed);
  }, [source, customText, seed]);

  // Compute s digit by digit up to `step`.
  const sDigits = useMemo<number[]>(() => {
    const out: number[] = [];
    for (let i = 0; i < step; i++) {
      const d = table[i]?.[i] ?? 0;
      out.push(flipDigit(d, strategy, source));
    }
    return out;
  }, [step, table, strategy, source]);

  // Play loop
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= N) {
          setPlaying(false);
          setRevealed(true);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const reset = useCallback(() => {
    setStep(0);
    setPlaying(false);
    setRevealed(false);
    setHighlightRow(-1);
  }, []);

  const stepOnce = useCallback(() => {
    setStep((s) => {
      if (s >= N) {
        setRevealed(true);
        return s;
      }
      if (s + 1 >= N) setRevealed(true);
      return s + 1;
    });
  }, []);

  const regenerate = useCallback(() => {
    setSeed((x) => (x * 16807) % 2147483647 || 1);
    reset();
  }, [reset]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* MAIN: diagonal table */}
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Cantor diagonal · {N} rows × {N} digits
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
            >
              s = 0.{sDigits.join("") || "…"}
            </div>
          </div>

          <div className="hairline flex-1 overflow-auto rounded-2xl border bg-ink-950 p-4">
            <table className="border-separate border-spacing-y-0.5 font-mono text-sm">
              <thead>
                <tr className="text-ink-400">
                  <th className="px-2 py-1 text-left text-[10px] uppercase tracking-widest">n</th>
                  <th className="px-2 py-1 text-left text-[10px] uppercase tracking-widest">rₙ</th>
                  {Array.from({ length: N }).map((_, j) => (
                    <th
                      key={j}
                      className="w-7 px-1 py-1 text-center text-[10px] uppercase tracking-widest"
                    >
                      {j + 1}
                    </th>
                  ))}
                  <th className="px-2 py-1 text-left text-[10px] uppercase tracking-widest">
                    vs s
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => {
                  const isPast = i < step;
                  const isCurrent = i === step - 1; // most recently flipped diagonal cell
                  const isPlanned = i === step; // next cell on deck (only visible mid-run)
                  const rowDim = i >= step ? "text-ink-300" : "text-ink-100";
                  return (
                    <tr
                      key={i}
                      className={`${rowDim} ${highlightRow === i ? "bg-signal-violet/10" : ""}`}
                      onMouseEnter={() => revealed && setHighlightRow(i)}
                      onMouseLeave={() => revealed && setHighlightRow(-1)}
                    >
                      <td className="px-2 py-0.5 text-[10px] text-ink-500">{i + 1}</td>
                      <td className="px-2 py-0.5 text-[10px] text-ink-400">0.</td>
                      {row.map((d, j) => {
                        const onDiagonal = i === j;
                        let cls = "text-center px-1 py-0.5 w-7 transition-colors";
                        if (onDiagonal && isCurrent) {
                          cls += " bg-signal-amber/30 text-signal-amber rounded";
                        } else if (onDiagonal && isPast) {
                          cls += " bg-signal-amber/10 text-signal-amber rounded";
                        } else if (onDiagonal && isPlanned) {
                          cls +=
                            " bg-signal-amber/5 text-signal-amber/70 rounded ring-1 ring-signal-amber/40";
                        } else if (revealed && highlightRow === i && i === j) {
                          cls += " bg-signal-violet/30 text-signal-violet rounded";
                        }
                        return (
                          <td key={j} className={cls}>
                            {d}
                          </td>
                        );
                      })}
                      <td className="px-2 py-0.5 text-[10px] text-ink-400">
                        {isPast ? (
                          <span className={ACCENT}>
                            sₙ={sDigits[i]} ≠ {row[i]}
                          </span>
                        ) : isPlanned ? (
                          <span className="text-signal-amber/70">
                            flip d{i + 1},{i + 1}
                          </span>
                        ) : (
                          <span className="text-ink-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Construction strip */}
          <div className="glass hairline space-y-3 rounded-2xl border p-5">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Building s · digit {step} / {N}
            </div>
            <div className="break-all font-mono text-xl text-ink-100">
              <span className="text-ink-400">s = 0.</span>
              {sDigits.map((d, i) => (
                <span
                  key={i}
                  className={`${i === step - 1 ? "text-signal-amber" : "text-signal-violet"} ${i === step - 1 ? "animate-pulse" : ""}`}
                >
                  {d}
                </span>
              ))}
              {step < N && <span className="text-ink-600">…</span>}
            </div>
            {step > 0 && step <= N && (
              <p className="text-xs leading-relaxed text-ink-300">
                s differs from r<sub>{step}</sub> in column {step}:
                <span className="text-signal-amber">
                  {" "}
                  d{step},{step} = {table[step - 1]?.[step - 1]}
                </span>
                <span className="text-ink-400"> → flipped to </span>
                <span className={ACCENT}>
                  s{step} = {sDigits[step - 1]}
                </span>
                .
              </p>
            )}
            {revealed && (
              <div className="rounded-md border border-signal-violet/40 bg-signal-violet/10 p-3 text-xs leading-relaxed text-ink-100">
                <div className={`mb-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  The contradiction
                </div>
                s = 0.<span className={ACCENT}>{sDigits.join("")}</span> differs from every row of
                the listing in at least one digit — therefore it is not on the list. But s ∈ [0, 1]
                is a real number. Hover any row to see where s disagrees with it. The listing was
                incomplete: |ℝ| {">"} |ℕ|.
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Transport */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Transport
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={stepOnce}
                disabled={step >= N}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet disabled:cursor-not-allowed disabled:opacity-30"
              >
                Step
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                disabled={step >= N && !playing}
                className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                  playing
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                } disabled:cursor-not-allowed disabled:opacity-30`}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={reset}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
              >
                Reset
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                <span>Speed</span>
                <span>{speed} ms</span>
              </div>
              <input
                type="range"
                value={1500 - speed}
                min={0}
                max={1400}
                step={50}
                onChange={(e) => setSpeed(1500 - parseInt(e.target.value))}
                className="w-full accent-signal-violet"
              />
            </div>
          </div>

          {/* Number source */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Number source
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "decimal" as const, label: "Decimal" },
                { id: "binary" as const, label: "Binary" },
                { id: "custom" as const, label: "Custom" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSource(opt.id);
                    reset();
                  }}
                  className={`rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                    source === opt.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {source !== "custom" ? (
              <button
                onClick={regenerate}
                className="hairline w-full rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
              >
                ↻ Re-shuffle the listing
              </button>
            ) : (
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                  One decimal per line · digits after the dot are used
                </div>
                <textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    reset();
                  }}
                  rows={8}
                  spellCheck={false}
                  className="hairline w-full rounded-md border bg-ink-950 p-2 font-mono text-[11px] text-ink-100 focus:border-signal-violet/50 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Strategy */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Digit-change rule
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "swap56" as const, label: "Swap 5 ↔ 6", hint: "safe; never 0 or 9" },
                {
                  id: "plusOne" as const,
                  label: "+1 mod 10",
                  hint: "skip 0, 9 to avoid 0.999… ambiguity",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setStrategy(opt.id);
                    reset();
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    strategy === opt.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-signal-violet"
                  }`}
                >
                  <div className="font-mono text-xs">{opt.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{opt.hint}</div>
                </button>
              ))}
            </div>
            {source === "binary" && (
              <p className="font-mono text-[10px] leading-relaxed text-ink-400">
                Binary mode ignores the rule above — digits flip 0 ↔ 1 automatically.
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="hairline space-y-2 border-b p-5 font-mono text-[10px] text-ink-300">
            <div className="mb-2 uppercase tracking-widest2 text-ink-400">Legend</div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-signal-amber/30" />
              diagonal cell · used this step
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-signal-amber/40 bg-signal-amber/10" />
              diagonal cell · already used
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded bg-signal-violet/30 ${ACCENT}`} />
              digit of s (built below the table)
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/cantor"
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
