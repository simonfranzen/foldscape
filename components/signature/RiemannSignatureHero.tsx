"use client";

import { useEffect, useState } from "react";
import { palette } from "@/lib/visual/palette";

// Signature artefact for the Riemann page. A vertical critical line cuts
// through an 800×320 canvas with the first twelve non-trivial zero heights
// rendered as luminous beads strung along it, against a faint backdrop of
// the prime counting staircase π(x). The beads softly breathe — the only
// motion — and freeze entirely when `prefers-reduced-motion: reduce` is set.

// The first twelve known non-trivial zero heights (imaginary parts of
// ζ-zeros on Re(s) = 1/2). Reference: Odlyzko's tables; these are accurate
// to four decimals which is far more than the SVG needs to position them.
const ZEROS = [
  14.1347, 21.022, 25.0109, 30.4249, 32.9351, 37.5862, 40.9187, 43.3271, 48.0052, 49.7738, 52.9703,
  56.4462,
] as const;

const T_MAX = 60; // top of the visible critical line in t-units

// The prime counting function π(x) — for the backdrop staircase. Bake in
// the first ~40 primes; that gives a recognisable step shape without ever
// touching runtime arithmetic.
const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
  101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
] as const;

export function RiemannSignatureHero() {
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setPhase((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const W = 800;
  const H = 320;
  const padTop = 24;
  const padBot = 24;
  const lineX = W / 2;

  // Build the prime counting staircase backdrop. x ranges over [0, 180]
  // (just past the 40th prime) mapped across the full width; π(x) ranges
  // [0, 40] mapped across the full height (inverted so 0 sits at the
  // bottom). It is rendered with very low opacity so the critical line
  // reads first.
  const stairPath = (() => {
    const xMax = 180;
    const yMax = 40;
    const segs: string[] = [`M 0 ${H - padBot}`];
    let count = 0;
    for (let p = 1; p <= xMax; p++) {
      const isPrime = (PRIMES as readonly number[]).includes(p);
      const x = (p / xMax) * W;
      const y = H - padBot - (count / yMax) * (H - padTop - padBot);
      segs.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
      if (isPrime) {
        count++;
        const yNew = H - padBot - (count / yMax) * (H - padTop - padBot);
        segs.push(`L ${x.toFixed(2)} ${yNew.toFixed(2)}`);
      }
    }
    return segs.join(" ");
  })();

  const tToY = (t: number) => H - padBot - (t / T_MAX) * (H - padTop - padBot);

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="The critical line Re(s) = 1/2 strung with the first twelve non-trivial zeros of the Riemann zeta function, layered over the prime counting staircase."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="riemann-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.signal.amber} stopOpacity="0" />
            <stop offset="15%" stopColor={palette.signal.amber} stopOpacity="0.85" />
            <stop offset="85%" stopColor={palette.signal.amber} stopOpacity="0.85" />
            <stop offset="100%" stopColor={palette.signal.amber} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="riemann-bead" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={palette.canvas.ivory} stopOpacity="1" />
            <stop offset="40%" stopColor={palette.signal.amber} stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.signal.amber} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backdrop: faint π(x) staircase */}
        <path d={stairPath} fill="none" stroke="rgba(255,209,102,0.16)" strokeWidth="1.1" />

        {/* The critical strip — a soft vertical wash from Re=0 to Re=1.
            We render it as a slim translucent rectangle centred on lineX. */}
        <rect
          x={lineX - 90}
          y={padTop}
          width={180}
          height={H - padTop - padBot}
          fill="rgba(255,209,102,0.04)"
        />

        {/* Strip borders: Re(s) = 0 and Re(s) = 1 */}
        <line
          x1={lineX - 90}
          x2={lineX - 90}
          y1={padTop}
          y2={H - padBot}
          stroke="rgba(168,171,189,0.25)"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />
        <line
          x1={lineX + 90}
          x2={lineX + 90}
          y1={padTop}
          y2={H - padBot}
          stroke="rgba(168,171,189,0.25)"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />

        {/* The critical line itself — Re(s) = 1/2 */}
        <line
          x1={lineX}
          x2={lineX}
          y1={padTop}
          y2={H - padBot}
          stroke="url(#riemann-line)"
          strokeWidth="1.4"
        />

        {/* Zeros as breathing beads */}
        {ZEROS.map((t, i) => {
          const y = tToY(t);
          // Each bead breathes with a slightly different period so the
          // collection feels alive rather than synced.
          const breathe = reduced ? 1 : 1 + 0.15 * Math.sin(phase * 1.2 + i * 0.7);
          const r = 4.4 * breathe;
          const rOuter = 11 * breathe;
          return (
            <g key={i}>
              <circle cx={lineX} cy={y} r={rOuter} fill="url(#riemann-bead)" opacity="0.55" />
              <circle cx={lineX} cy={y} r={r} fill={palette.canvas.ivory} />
              <text
                x={lineX + 18}
                y={y + 4}
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="rgba(255,245,214,0.7)"
              >
                t = {t.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={lineX - 90 - 6}
          y={padTop - 8}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="rgba(168,171,189,0.7)"
        >
          Re = 0
        </text>
        <text
          x={lineX}
          y={padTop - 8}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="rgba(255,209,102,0.85)"
        >
          Re = ½
        </text>
        <text
          x={lineX + 90 + 6}
          y={padTop - 8}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="rgba(168,171,189,0.7)"
        >
          Re = 1
        </text>
        <text
          x={lineX + 96}
          y={H - padBot}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="rgba(168,171,189,0.55)"
        >
          t = 0
        </text>
        <text
          x={lineX + 96}
          y={padTop + 4}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="rgba(168,171,189,0.55)"
        >
          t → ∞
        </text>

        {/* Bottom-right captioning marker */}
        <text
          x={W - 16}
          y={H - 10}
          textAnchor="end"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontSize="12"
          fill="rgba(255,209,102,0.75)"
        >
          ζ(½ + it) = 0
        </text>
      </svg>
    </figure>
  );
}
