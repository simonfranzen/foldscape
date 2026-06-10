"use client";

import { useEffect, useRef, useState } from "react";
import { palette } from "@/lib/visual/palette";

// Signature artefact for the SAT page. A small 3-SAT formula whose variable
// assignment cycles like a brute-force search; each clause lights green the
// moment the current assignment satisfies it. When every clause is green the
// formula flashes SAT — a satisfying assignment found. Reduced motion: a
// static satisfying snapshot, no animation.

type Lit = { v: number; neg: boolean };

const VARS = ["x", "y", "z", "w"];

// A deliberately small, satisfiable 3-SAT instance. Satisfaction is evaluated
// live against the cycling assignment — nothing is precomputed, so the colours
// are always honest.
const CLAUSES: Lit[][] = [
  [
    { v: 0, neg: false },
    { v: 1, neg: true },
    { v: 2, neg: false },
  ],
  [
    { v: 0, neg: true },
    { v: 2, neg: false },
    { v: 3, neg: false },
  ],
  [
    { v: 1, neg: false },
    { v: 2, neg: true },
    { v: 3, neg: true },
  ],
  [
    { v: 0, neg: true },
    { v: 1, neg: true },
    { v: 3, neg: false },
  ],
  [
    { v: 0, neg: false },
    { v: 1, neg: false },
    { v: 2, neg: true },
  ],
];

const litSat = (l: Lit, a: boolean[]) => (l.neg ? !a[l.v] : a[l.v]);
const clauseSat = (c: Lit[], a: boolean[]) => c.some((l) => litSat(l, a));
const allSat = (a: boolean[]) => CLAUSES.every((c) => clauseSat(c, a));
const litText = (l: Lit) => (l.neg ? "¬" : "") + VARS[l.v];
const bits = (n: number) => [0, 1, 2, 3].map((i) => Boolean((n >> i) & 1));

// First satisfying assignment, for the reduced-motion still.
function findSat(): boolean[] {
  for (let n = 0; n < 16; n++) {
    const a = bits(n);
    if (allSat(a)) return a;
  }
  return [true, true, true, true];
}

const GREEN = palette.signal.teal;
const VIOLET = palette.signal.violet;
const DIM = "rgba(138,144,164,0.5)";

export function SatClauseHero() {
  const [reduced, setReduced] = useState(false);
  const [n, setN] = useState(0);
  const holdRef = useRef(0);
  const lastTickRef = useRef(0);

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
    const tick = (now: number) => {
      if (now - lastTickRef.current > 680) {
        lastTickRef.current = now;
        setN((v) => {
          // Hold one extra beat when the current assignment satisfies all
          // clauses, so the "found it" moment is legible.
          if (allSat(bits(v)) && holdRef.current === 0) {
            holdRef.current = 1;
            return v;
          }
          holdRef.current = 0;
          return (v + 1) % 16;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const assignment = reduced ? findSat() : bits(n);
  const solved = allSat(assignment);

  const W = 820;
  const H = 240;

  // Variable assignment chips
  const chipW = 64;
  const chipGap = 18;
  const chipsTotal = VARS.length * chipW + (VARS.length - 1) * chipGap;
  const chipStartX = (W - chipsTotal) / 2;
  const chipY = 30;

  // Clause boxes
  const cW = 148;
  const cGap = 14;
  const cTotal = CLAUSES.length * cW + (CLAUSES.length - 1) * cGap;
  const cStartX = (W - cTotal) / 2;
  const cY = 108;
  const cH = 60;

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="A Boolean formula in conjunctive normal form whose variable assignment is searched until every clause is satisfied."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        {/* Variable assignment row */}
        {VARS.map((name, i) => {
          const x = chipStartX + i * (chipW + chipGap);
          const val = assignment[i];
          return (
            <g key={name} transform={`translate(${x} ${chipY})`}>
              <rect
                width={chipW}
                height={34}
                rx="8"
                fill={val ? "rgba(125,243,255,0.14)" : "rgba(15,18,28,0.85)"}
                stroke={val ? "rgba(125,243,255,0.55)" : "rgba(138,144,164,0.28)"}
                strokeWidth="1"
              />
              <text
                x={chipW / 2}
                y={22}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="14"
                fill={val ? palette.signal.cyan : "rgba(234,236,243,0.6)"}
              >
                {name}={val ? "T" : "F"}
              </text>
            </g>
          );
        })}

        {/* The conjunction symbol between the assignment and the clauses */}
        <text
          x={W / 2}
          y={84}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="3"
          fill="rgba(234,236,243,0.4)"
        >
          {solved ? "ALL CLAUSES TRUE" : "EVALUATE EACH CLAUSE"}
        </text>

        {/* Clause boxes */}
        {CLAUSES.map((clause, j) => {
          const x = cStartX + j * (cW + cGap);
          const sat = clauseSat(clause, assignment);
          return (
            <g key={j} transform={`translate(${x} ${cY})`}>
              <rect
                width={cW}
                height={cH}
                rx="10"
                fill={sat ? "rgba(166,225,161,0.12)" : "rgba(15,18,28,0.7)"}
                stroke={sat ? "rgba(166,225,161,0.65)" : "rgba(138,144,164,0.26)"}
                strokeWidth={sat ? "1.4" : "1"}
              />
              <text
                x={cW / 2}
                y={cH / 2 + 5}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="15"
              >
                <tspan fill={DIM}>(</tspan>
                {clause.map((l, k) => (
                  <tspan key={k}>
                    <tspan fill={litSat(l, assignment) ? GREEN : DIM}>{litText(l)}</tspan>
                    {k < clause.length - 1 && <tspan fill={DIM}> ∨ </tspan>}
                  </tspan>
                ))}
                <tspan fill={DIM}>)</tspan>
              </text>
            </g>
          );
        })}

        {/* Verdict caption */}
        <text
          x={W / 2}
          y={H - 26}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="3.4"
          fill={solved ? VIOLET : "rgba(234,236,243,0.45)"}
        >
          {solved ? "⊨  SATISFIABLE — assignment found" : "searching assignments…  2⁴ = 16 to try"}
        </text>
        {solved && (
          <circle cx={W / 2 - 132} cy={H - 30} r="3.5" fill={VIOLET}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </figure>
  );
}
