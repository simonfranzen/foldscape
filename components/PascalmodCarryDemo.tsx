"use client";

import { useMemo, useState } from "react";

// PascalmodCarryDemo — a tiny visual that demonstrates Kummer's theorem:
// C(n, k) mod p ≠ 0  ⇔  no carries occur when k + (n−k) is added in base p.
//
// The user picks n, k and a prime p; the component renders the base-p digits
// of k and (n − k) stacked, highlights every column where a carry happens,
// and reports the resulting C(n, k) mod p.

interface Props {
  caption?: string;
  nLabel: string;
  kLabel: string;
  pLabel: string;
  resultLabel: string;
  carryLabel: string;
  noCarryLabel: string;
  hint: string;
}

const PRIMES = [2, 3, 5, 7, 11, 13];

function toBaseDigits(value: number, base: number): number[] {
  if (value === 0) return [0];
  const out: number[] = [];
  let v = value;
  while (v > 0) {
    out.push(v % base);
    v = Math.floor(v / base);
  }
  return out;
}

// Compute base-p addition of a + b digit by digit and return which columns
// carry. Indexed from least-significant digit.
function carryColumns(a: number, b: number, base: number) {
  const da = toBaseDigits(a, base);
  const db = toBaseDigits(b, base);
  const width = Math.max(da.length, db.length) + 2;
  const A = Array.from({ length: width }, (_, i) => da[i] ?? 0);
  const B = Array.from({ length: width }, (_, i) => db[i] ?? 0);
  const sum: number[] = [];
  const carries: boolean[] = [];
  let c = 0;
  for (let i = 0; i < width; i++) {
    const s = (A[i] ?? 0) + (B[i] ?? 0) + c;
    sum.push(s % base);
    carries.push(s >= base);
    c = s >= base ? 1 : 0;
  }
  // Trim leading zeros
  let last = width - 1;
  while (last > 0 && sum[last] === 0 && !carries[last]) last--;
  return {
    A: A.slice(0, last + 1),
    B: B.slice(0, last + 1),
    sum: sum.slice(0, last + 1),
    carries: carries.slice(0, last + 1),
  };
}

// Binomial coefficient mod small prime via Lucas' theorem to avoid overflow.
function binomMod(n: number, k: number, p: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  let nn = n;
  let kk = k;
  while (nn > 0 || kk > 0) {
    const ni = nn % p;
    const ki = kk % p;
    if (ki > ni) return 0;
    // C(ni, ki) mod p — ni < p, so direct factorial is safe.
    let num = 1;
    let den = 1;
    for (let i = 0; i < ki; i++) {
      num = (num * (ni - i)) % p;
      den = (den * (i + 1)) % p;
    }
    // modular inverse of den mod p (p prime, Fermat)
    let inv = 1;
    let base = den % p;
    let exp = p - 2;
    while (exp > 0) {
      if (exp & 1) inv = (inv * base) % p;
      base = (base * base) % p;
      exp = Math.floor(exp / 2);
    }
    result = (result * num * inv) % p;
    nn = Math.floor(nn / p);
    kk = Math.floor(kk / p);
  }
  return result;
}

export function PascalmodCarryDemo({
  caption,
  nLabel,
  kLabel,
  pLabel,
  resultLabel,
  carryLabel,
  noCarryLabel,
  hint,
}: Props) {
  const [n, setN] = useState(13);
  const [k, setK] = useState(5);
  const [p, setP] = useState(3);

  const safeN = Math.max(0, Math.min(n, 999));
  const safeK = Math.max(0, Math.min(k, safeN));
  const b = safeN - safeK;
  const { A, B, sum, carries } = useMemo(() => carryColumns(safeK, b, p), [safeK, b, p]);
  const totalCarries = carries.filter(Boolean).length;
  const value = binomMod(safeN, safeK, p);

  // Render most-significant digit on the left.
  const columns = A.map((_, i) => i).reverse();

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      {caption && (
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
          {caption}
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <label className="space-y-1">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {nLabel}
          </div>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value) || 0)}
            min={0}
            max={999}
            className="hairline w-full rounded-md border bg-ink-950/60 px-2 py-1.5 font-mono text-sm text-ink-100 focus:border-signal-amber/60 focus:outline-none"
          />
        </label>
        <label className="space-y-1">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {kLabel}
          </div>
          <input
            type="number"
            value={k}
            onChange={(e) => setK(parseInt(e.target.value) || 0)}
            min={0}
            max={safeN}
            className="hairline w-full rounded-md border bg-ink-950/60 px-2 py-1.5 font-mono text-sm text-ink-100 focus:border-signal-amber/60 focus:outline-none"
          />
        </label>
        <div className="space-y-1">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {pLabel}
          </div>
          <div className="grid grid-cols-6 gap-1">
            {PRIMES.map((pp) => (
              <button
                key={pp}
                onClick={() => setP(pp)}
                className={`rounded-md border py-1 font-mono text-[10px] transition-colors ${
                  p === pp
                    ? "border-signal-amber/60 bg-signal-amber/10 text-signal-amber"
                    : "hairline text-ink-200 hover:border-signal-amber/40 hover:text-signal-amber"
                }`}
                aria-pressed={p === pp}
              >
                {pp}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hairline space-y-2 overflow-x-auto rounded-xl border bg-ink-950/60 p-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
          {safeK} + {b} = {safeN} (base {p})
        </div>
        <div className="inline-flex flex-col gap-1 font-mono text-sm">
          {/* k row */}
          <div className="flex items-center gap-1.5">
            <span className="w-6 text-right text-xs text-ink-400">k</span>
            {columns.map((i) => {
              const carried = carries[i];
              return (
                <span
                  key={`a-${i}`}
                  className={`flex h-8 w-8 items-center justify-center rounded border ${
                    carried
                      ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-100"
                  }`}
                >
                  {A[i]}
                </span>
              );
            })}
          </div>
          {/* n-k row */}
          <div className="flex items-center gap-1.5">
            <span className="w-6 text-right text-xs text-ink-400">n−k</span>
            {columns.map((i) => {
              const carried = carries[i];
              return (
                <span
                  key={`b-${i}`}
                  className={`flex h-8 w-8 items-center justify-center rounded border ${
                    carried
                      ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                      : "hairline text-ink-100"
                  }`}
                >
                  {B[i]}
                </span>
              );
            })}
          </div>
          {/* sum */}
          <div className="hairline mt-1 flex items-center gap-1.5 border-t pt-2">
            <span className="w-6 text-right text-xs text-ink-400">n</span>
            {columns.map((i) => (
              <span
                key={`s-${i}`}
                className="hairline flex h-8 w-8 items-center justify-center rounded border text-ink-200"
              >
                {sum[i]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {totalCarries > 0 ? carryLabel : noCarryLabel}
          </div>
          <div
            className={`font-mono text-2xl ${
              totalCarries > 0 ? "text-signal-amber" : "text-ink-100"
            }`}
          >
            {totalCarries}
          </div>
        </div>
        <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {resultLabel}
          </div>
          <div
            className={`font-mono text-2xl ${value === 0 ? "text-ink-400" : "text-signal-amber"}`}
          >
            C({safeN},{safeK}) mod {p} = {value}
          </div>
        </div>
      </div>
      <p className="font-mono text-[10px] leading-relaxed text-ink-400">{hint}</p>
    </div>
  );
}
