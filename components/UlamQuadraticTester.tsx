"use client";

import { useMemo, useState } from "react";

// Inline tester for an integer quadratic ax² + bx + c. Given the three
// coefficients we evaluate the polynomial for x = 0..40, mark the prime
// hits in amber and the composites in muted ink, and show the prime rate.
// This is the same diagonal-arithmetic the Ulam spiral makes visible,
// pulled out of the picture into raw numbers.

interface Preset {
  label: string;
  a: number;
  b: number;
  c: number;
}

interface Props {
  caption: string;
  coefficientsLabel: string;
  presetsLabel: string;
  rangeLabel: string;
  primeRateLabel: (hits: number, total: number, pct: string) => string;
  formulaLabel: string;
  note: string;
  presets: Preset[];
}

const RANGE = 41; // x = 0..40 inclusive — Euler's streak length.

function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}

export function UlamQuadraticTester({
  caption,
  coefficientsLabel,
  presetsLabel,
  rangeLabel,
  primeRateLabel,
  formulaLabel,
  note,
  presets,
}: Props) {
  const [a, setA] = useState(presets[0]?.a ?? 1);
  const [b, setB] = useState(presets[0]?.b ?? -1);
  const [c, setC] = useState(presets[0]?.c ?? 41);

  const values = useMemo(() => {
    const out: Array<{ x: number; v: number; prime: boolean }> = [];
    for (let x = 0; x < RANGE; x++) {
      const v = a * x * x + b * x + c;
      out.push({ x, v, prime: isPrime(v) });
    }
    return out;
  }, [a, b, c]);

  const hits = values.filter((v) => v.prime).length;
  const pct = ((hits / RANGE) * 100).toFixed(0) + "%";

  // Pretty-printed formula like "n² − n + 41". Skip zero terms, render unit
  // coefficients without the digit, use proper minus signs.
  const formula = useMemo(() => {
    const parts: string[] = [];
    if (a !== 0) {
      if (a === 1) parts.push("n²");
      else if (a === -1) parts.push("−n²");
      else parts.push(`${a}n²`);
    }
    if (b !== 0) {
      const sign = b > 0 ? "+" : "−";
      const mag = Math.abs(b);
      const term = mag === 1 ? "n" : `${mag}n`;
      parts.push(parts.length ? `${sign} ${term}` : b < 0 ? `−${term}` : term);
    }
    if (c !== 0) {
      const sign = c > 0 ? "+" : "−";
      const mag = Math.abs(c);
      parts.push(parts.length ? `${sign} ${mag}` : c < 0 ? `−${mag}` : `${mag}`);
    }
    return parts.length ? parts.join(" ") : "0";
  }, [a, b, c]);

  return (
    <div className="hairline space-y-6 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <NumberField label="a" value={a} setValue={setA} />
        <NumberField label="b" value={b} setValue={setB} />
        <NumberField label="c" value={c} setValue={setC} />
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
        {coefficientsLabel}
      </div>

      <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-5 text-center">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
          {formulaLabel}
        </div>
        <div className="math-italic text-2xl text-ink-100 md:text-3xl">{formula}</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-widest2">
          <span className="text-ink-300">{rangeLabel}</span>
          <span className="text-signal-amber">{primeRateLabel(hits, RANGE, pct)}</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 md:grid-cols-7 lg:grid-cols-10">
          {values.map((v) => (
            <div
              key={v.x}
              className={`rounded-sm border px-1 py-1.5 text-center font-mono text-[10px] leading-tight ${
                v.prime
                  ? "border-signal-amber/60 bg-signal-amber/15 text-signal-amber"
                  : "border-ink-700/40 bg-ink-950/40 text-ink-500"
              }`}
              title={`x=${v.x}, f(x)=${v.v}, ${v.prime ? "prime" : "composite"}`}
            >
              <div className="opacity-60">{v.x}</div>
              <div>{v.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {presetsLabel}
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setA(p.a);
                setB(p.b);
                setC(p.c);
              }}
              className="hairline rounded-md border px-3 py-1.5 font-mono text-[11px] text-ink-200 transition-colors hover:border-signal-amber/40 hover:text-signal-amber"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-ink-400">{note}</p>
    </div>
  );
}

function NumberField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <label className="hairline flex items-center gap-3 rounded-md border bg-ink-950/60 px-3 py-2">
      <span className="w-4 font-mono text-sm text-signal-amber">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          setValue(Number.isFinite(n) ? n : 0);
        }}
        className="w-full flex-1 bg-transparent font-mono text-sm text-ink-100 outline-none"
      />
    </label>
  );
}
