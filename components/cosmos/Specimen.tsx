"use client";

// Per-scene "level art": a category-specific drawing behind the
// constellation. v5 builds itself with the scene's scroll progress
// (0..1 across the section) instead of looping CSS keyframes — strokes
// draw via stroke-dashoffset, elements fade in time-staggered windows
// (user feedback: "die visual effect linien im hintergrund könnten sich
// aber noch besser aufbauen mit langsamenen speed, etwas zeitversetzt /
// oder nach scroll position").
//
// Each piece exposes one or two progress windows it cares about and
// computes its own opacity / dashoffset locally — no global animation
// timing, no rAF, just SVG attributes driven by the parent's progress.

import type { TopicCategory } from "@/lib/topics";
import { CATEGORY_COLOR } from "@/lib/cosmos/layout";
import { palette } from "@/lib/visual/palette";

interface Props {
  category: TopicCategory;
  // 0 = scene just entering viewport, 1 = scene leaving. The build-up
  // happens in the 0..0.55 window so the art is fully drawn while the
  // user is reading the cluster, then breathes there.
  progress: number;
}

// Window helper — returns 0..1 over a progress sub-range, clamped.
function window01(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

// Dash-offset helper — converts a 0..1 reveal value to a stroke-dashoffset
// for a path of approximate length `len`. dashoffset goes from len → 0.
function dashoffset(reveal: number, len: number): number {
  return len * (1 - reveal);
}

export function Specimen({ category, progress }: Props) {
  // Specimen art is rendered with a soft category-colour drop-shadow so
  // the strokes read as a glowing neon line rather than a flat tracing.
  // The glow intensifies with scroll progress so the "ignition" of the
  // level art is visible — by the time the user is in the middle of the
  // scene the bloom is at full strength. Reduced-motion users still get
  // the static drawing; the filter is a CSS value, not an animation.
  const color = CATEGORY_COLOR[category];
  const glow = 0.4 + 0.6 * Math.max(0, Math.min(1, (progress - 0.15) / 0.35));
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 600"
      className="cosmos-specimen pointer-events-none absolute inset-0 z-[1] h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      style={{
        filter: `drop-shadow(0 0 ${8 + glow * 6}px ${color}) drop-shadow(0 0 ${
          2 + glow * 4
        }px ${color})`,
      }}
    >
      {category === "paradox" && <ParadoxSpecimen progress={progress} />}
      {category === "logic" && <LogicSpecimen progress={progress} />}
      {category === "computation" && <ComputationSpecimen progress={progress} />}
      {category === "chaos" && <ChaosSpecimen progress={progress} />}
      {category === "geometry" && <GeometrySpecimen progress={progress} />}
      {category === "analysis" && <AnalysisSpecimen progress={progress} />}
    </svg>
  );
}

// ── PARADOX — concentric rings draw outward, then ℵ fades in.
function ParadoxSpecimen({ progress }: { progress: number }) {
  const ring1 = window01(progress, 0.05, 0.25);
  const ring2 = window01(progress, 0.1, 0.3);
  const ring3 = window01(progress, 0.15, 0.35);
  const ring4 = window01(progress, 0.2, 0.4);
  const aleph = window01(progress, 0.35, 0.55);
  return (
    <g>
      <g stroke={palette.signal.rose} fill="none">
        <circle cx={500} cy={300} r={260} strokeWidth={0.8} strokeOpacity={0.18 * ring1} />
        <circle
          cx={500}
          cy={300}
          r={210}
          strokeWidth={0.7}
          strokeOpacity={0.18 * ring2}
          strokeDasharray="2 5"
        />
        <circle cx={500} cy={300} r={160} strokeWidth={0.6} strokeOpacity={0.18 * ring3} />
        <circle
          cx={500}
          cy={300}
          r={110}
          strokeWidth={0.5}
          strokeOpacity={0.18 * ring4}
          strokeDasharray="2 5"
        />
      </g>
      <text
        x={500}
        y={340}
        fill={palette.signal.rose}
        fillOpacity={0.22 * aleph}
        stroke="none"
        fontSize={140}
        textAnchor="middle"
        className="math-italic"
      >
        ℵ
      </text>
    </g>
  );
}

// ── LOGIC — wires draw in, then gate body, then output dot.
function LogicSpecimen({ progress }: { progress: number }) {
  const wireA = window01(progress, 0.05, 0.2);
  const wireB = window01(progress, 0.1, 0.25);
  const body = window01(progress, 0.2, 0.4);
  const outDot = window01(progress, 0.35, 0.5);
  const outWire = window01(progress, 0.4, 0.55);
  return (
    <g stroke={palette.signal.violet} fill="none">
      <line x1={250} y1={260} x2={360} y2={260} strokeWidth={1.2} strokeOpacity={0.32 * wireA} />
      <line x1={250} y1={340} x2={360} y2={340} strokeWidth={1.2} strokeOpacity={0.32 * wireB} />
      <path
        d="M 360 230 L 360 370 Q 500 370 500 300 Q 500 230 360 230 Z"
        strokeWidth={1.6}
        strokeOpacity={0.32 * body}
        strokeDasharray="400"
        strokeDashoffset={dashoffset(body, 400)}
      />
      <circle cx={520} cy={300} r={10} strokeWidth={1.6} strokeOpacity={0.32 * outDot} />
      <line x1={530} y1={300} x2={680} y2={300} strokeWidth={1.2} strokeOpacity={0.32 * outWire} />
    </g>
  );
}

// ── COMPUTATION — lattice cells boot up cell-by-cell across the whole
// scroll-in window. Earlier we packed the stagger into 0..0.35 of
// progress, which meant the lattice was "fully on" before the cluster
// had even settled — the user couldn't actually watch cells appearing.
// v5 spreads the stagger from 0..0.6, with each cell scaling from 0
// to its final size in addition to fading in. The cells appear in a
// loose diagonal wave (seed by i+j with a small per-cell jitter so the
// front edge isn't a straight line).
function ComputationSpecimen({ progress }: { progress: number }) {
  const gliderOpacity = window01(progress, 0.5, 0.7);
  return (
    <g>
      <g>
        {Array.from({ length: 20 }).map((_, i) =>
          Array.from({ length: 12 }).map((__, j) => {
            // Sparser density (1 in 9 cells) + skip the central
            // exclusion zone where the title text and constellation
            // stars live (user feedback: "vor allem in der mitte nicht
            // da wo text und elemente sind").
            const on = (i * 7 + j * 13) % 9 === 0;
            if (!on) return null;
            const cx = 60 + i * 50 + 14;
            const cy = 60 + j * 40 + 14;
            if (cx > 200 && cx < 800 && cy > 140 && cy < 520) return null;
            // Diagonal stagger normalised to 0..1.
            const wave = (i + j) / (20 + 12);
            const jitter = (((i * 17 + j * 31) % 100) / 100 - 0.5) * 0.1;
            const start = Math.max(0, Math.min(0.55, wave * 0.5 + jitter));
            const end = start + 0.1;
            const cellReveal = window01(progress, start, end);
            const size = 28 * cellReveal;
            return (
              <rect
                key={`${i}-${j}`}
                x={cx - size / 2}
                y={cy - size / 2}
                width={size}
                height={size}
                fill={palette.signal.cyan}
                opacity={0.06 * cellReveal}
                stroke="none"
              />
            );
          }),
        )}
      </g>
      <g opacity={gliderOpacity}>
        <g transform="translate(40 380)" stroke="none">
          {[
            [0, 1],
            [1, 2],
            [2, 0],
            [2, 1],
            [2, 2],
          ].map(([row, col], i) => (
            <rect
              key={i}
              x={col * 28}
              y={row * 28}
              width={24}
              height={24}
              fill={palette.signal.cyan}
              opacity={0.7}
              rx={2}
            />
          ))}
        </g>
      </g>
    </g>
  );
}

// ── CHAOS — both lobes of the Lorenz attractor trace themselves.
function ChaosSpecimen({ progress }: { progress: number }) {
  const lobeA = window01(progress, 0.05, 0.4);
  const lobeB = window01(progress, 0.2, 0.55);
  const eyes = window01(progress, 0.45, 0.6);
  // Approximate path lengths — measured by hand from the bezier curves.
  const lenA = 1600;
  const lenB = 1600;
  return (
    <g stroke={palette.signal.coral} fill="none">
      <path
        d="M 320 480 Q 130 380 220 220 Q 310 80 460 180 Q 580 250 510 360 Q 440 480 320 480 Z"
        strokeWidth={1.3}
        strokeOpacity={0.2 * Math.min(1, lobeA + 0.15)}
        strokeDasharray={lenA}
        strokeDashoffset={dashoffset(lobeA, lenA)}
      />
      <path
        d="M 680 480 Q 870 380 780 220 Q 690 80 540 180 Q 420 250 490 360 Q 560 480 680 480 Z"
        strokeWidth={1.3}
        strokeOpacity={0.2 * Math.min(1, lobeB + 0.15)}
        strokeDasharray={lenB}
        strokeDashoffset={dashoffset(lobeB, lenB)}
      />
      <circle
        cx={330}
        cy={280}
        r={6}
        fill={palette.signal.coral}
        opacity={0.5 * eyes}
        stroke="none"
      />
      <circle
        cx={670}
        cy={280}
        r={6}
        fill={palette.signal.coral}
        opacity={0.5 * eyes}
        stroke="none"
      />
    </g>
  );
}

// ── GEOMETRY — framing rectangle softly fades in, then the spiral arc
// draws itself stroke-by-stroke. Minimal — most of the room belongs to
// the stars (user explicitly asked to dial this one back).
function GeometrySpecimen({ progress }: { progress: number }) {
  const frame = window01(progress, 0.1, 0.3);
  const spiral = window01(progress, 0.2, 0.55);
  const spiralLen = 1100;
  return (
    <g>
      <rect
        x={300}
        y={120}
        width={400}
        height={400}
        stroke={palette.signal.amber}
        strokeOpacity={0.06 * frame}
        strokeWidth={0.8}
        fill="none"
      />
      <path
        d="M 700 120 A 400 400 0 0 0 300 520 A 248 248 0 0 0 548 272 A 152 152 0 0 0 396 120 A 94 94 0 0 0 302 214"
        stroke={palette.signal.amber}
        strokeOpacity={0.16 * Math.min(1, spiral + 0.2)}
        strokeWidth={1}
        fill="none"
        strokeDasharray={spiralLen}
        strokeDashoffset={dashoffset(spiral, spiralLen)}
      />
    </g>
  );
}

// ── ANALYSIS — three harmonic sine waves draw themselves in sequence.
function AnalysisSpecimen({ progress }: { progress: number }) {
  const make = (freq: number, amp: number, phase: number, yShift: number) => {
    let d = "M 0 " + (300 + yShift);
    for (let x = 0; x <= 1000; x += 8) {
      const y = 300 + yShift + Math.sin((x / 1000) * Math.PI * freq + phase) * amp;
      d += ` L ${x} ${y.toFixed(2)}`;
    }
    return d;
  };
  const w1 = window01(progress, 0.05, 0.3);
  const w2 = window01(progress, 0.2, 0.45);
  const w3 = window01(progress, 0.35, 0.55);
  // Approximate path length per wave (1000 wide path, mostly horizontal).
  const len = 1100;
  return (
    <g stroke={palette.signal.teal} fill="none">
      <path
        d={make(2, 110, 0, 0)}
        strokeWidth={1.4}
        strokeOpacity={0.18 * Math.min(1, w1 + 0.2)}
        strokeDasharray={len}
        strokeDashoffset={dashoffset(w1, len)}
      />
      <path
        d={make(4, 70, 1.1, -55)}
        strokeWidth={1.1}
        strokeOpacity={0.14 * Math.min(1, w2 + 0.2)}
        strokeDasharray={len}
        strokeDashoffset={dashoffset(w2, len)}
      />
      <path
        d={make(8, 40, 2.3, 65)}
        strokeWidth={0.9}
        strokeOpacity={0.1 * Math.min(1, w3 + 0.2)}
        strokeDasharray={len}
        strokeDashoffset={dashoffset(w3, len)}
      />
    </g>
  );
}
