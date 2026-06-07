"use client";

import { useEffect, useRef, useState } from "react";

// Signature artefact for the Diffusion page. Two horizontal tracks:
//
//   Top track:    pure noise  →  silhouette emerging       (REVERSE / sampling)
//   Bottom track: silhouette  →  noise dissolving           (FORWARD / corruption)
//
// A subtle arrow swap in the middle conveys "the model learns to walk the
// forward process backwards". Pure SVG. The noise dots are deterministic
// (seeded), so the layout is identical between client/server renders.
// Respects prefers-reduced-motion: drift animation off, static snapshot.

const W = 800;
const H = 320;

// Deterministic PRNG so the noise pattern is the same across renders.
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Dot {
  x: number;
  y: number;
  r: number;
  alpha: number;
  hue: number; // 0..1 (cyan → rose interpolation parameter)
}

// Build a track of dots that interpolate from "pure noise" on one end to a
// "structured silhouette" (a soft circle) on the other.
// `direction` = +1 means noise on left → image on right (sampling/reverse).
// `direction` = -1 means image on left → noise on right (forward corruption).
function buildTrack(
  seed: number,
  yOffset: number,
  height: number,
  direction: 1 | -1,
  phase: number,
): Dot[] {
  const rng = mulberry32(seed);
  const N = 340;
  const dots: Dot[] = [];
  for (let i = 0; i < N; i++) {
    const rx = rng();
    const ry = rng();
    const rj = rng();
    // x along the track
    const x = rx * W;
    // "structure parameter" — how close we are to the structured end.
    // direction=+1: structure builds toward the right;
    // direction=-1: structure decays toward the right.
    const s = direction === 1 ? x / W : 1 - x / W;
    // Noise weight ~ 1 - s; structure weight ~ s.
    // Structured position: tightly bound to a horizontal silhouette band
    // (a soft circle-ish blob centred on the structured side).
    const cxStruct = direction === 1 ? W * 0.78 : W * 0.22;
    const cyStruct = yOffset + height / 2;
    // Pull the dot toward the silhouette as s grows.
    const phaseShift = Math.sin(phase + i * 0.13) * 4;
    const angle = ry * Math.PI * 2;
    const rad = 22 + rj * 70 * (1 - s);
    const targetX = cxStruct + rad * Math.cos(angle) * (0.6 + 0.4 * s);
    const targetY = cyStruct + rad * Math.sin(angle) * (0.6 + 0.4 * s) * 0.7;
    const ax = x * (1 - s) + targetX * s;
    const ay = (yOffset + ry * height) * (1 - s) + targetY * s + phaseShift * (1 - s);
    // Visual weight: a hint smaller when noisy, slightly bigger when structured.
    const r = 0.7 + 1.6 * s + (1 - s) * rj * 0.9;
    const alpha = 0.18 + 0.55 * (s * 0.85 + (1 - s) * rj);
    dots.push({ x: ax, y: ay, r, alpha, hue: direction === 1 ? s : 1 - s });
  }
  return dots;
}

function dotColour(hue: number): string {
  // Interpolate cyan (125,243,255) → rose (255,122,182) along the track.
  const cyan = [125, 243, 255];
  const rose = [255, 122, 182];
  const r = Math.round(cyan[0] + (rose[0] - cyan[0]) * hue);
  const g = Math.round(cyan[1] + (rose[1] - cyan[1]) * hue);
  const b = Math.round(cyan[2] + (rose[2] - cyan[2]) * hue);
  return `rgb(${r}, ${g}, ${b})`;
}

export function DiffusionSignatureHero() {
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPhase((p) => p + dt * 0.45);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  // Two stacked tracks. Seeded so the noise feels different in each band.
  const topTrack = buildTrack(0x5f1234, 32, 110, 1, phase);
  const bottomTrack = buildTrack(0x9e7755, 178, 110, -1, -phase);

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="Two horizontal noise tracks. The top one resolves pure noise into a luminous silhouette; the bottom one dissolves a silhouette back into pure noise."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        {/* Soft horizontal guide for each track */}
        <line
          x1={20}
          y1={87}
          x2={W - 20}
          y2={87}
          stroke="rgba(234,236,243,0.05)"
          strokeWidth="1"
        />
        <line
          x1={20}
          y1={233}
          x2={W - 20}
          y2={233}
          stroke="rgba(234,236,243,0.05)"
          strokeWidth="1"
        />

        {/* Track labels */}
        <text
          x={28}
          y={26}
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="2.4"
          fill="rgba(234,236,243,0.45)"
        >
          REVERSE · p(x_{"{t-1}"} | x_t)
        </text>
        <text
          x={28}
          y={172}
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="2.4"
          fill="rgba(234,236,243,0.45)"
        >
          FORWARD · q(x_t | x_{"{t-1}"})
        </text>

        {/* Arrows showing direction of each track */}
        <g stroke="rgba(255,122,182,0.7)" strokeWidth="1.2" fill="none">
          <path d={`M ${W - 80} 87 L ${W - 30} 87 M ${W - 42} 81 L ${W - 30} 87 L ${W - 42} 93`} />
        </g>
        <g stroke="rgba(125,243,255,0.7)" strokeWidth="1.2" fill="none">
          <path d={`M 80 233 L 30 233 M 42 227 L 30 233 L 42 239`} />
        </g>

        {/* Top track — noise dissolving into a silhouette on the right */}
        {topTrack.map((d, i) => (
          <circle
            key={`t-${i}`}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={dotColour(d.hue)}
            opacity={d.alpha}
          />
        ))}

        {/* Bottom track — silhouette on the left dissolving into noise on the right */}
        {bottomTrack.map((d, i) => (
          <circle
            key={`b-${i}`}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={dotColour(d.hue)}
            opacity={d.alpha}
          />
        ))}

        {/* Caption */}
        <text
          x={W / 2}
          y={H - 14}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="3.2"
          fill="rgba(234,236,243,0.5)"
        >
          PURE NOISE · STRUCTURED IMAGE · ONE LEARNED INVERSE
        </text>
      </svg>
    </figure>
  );
}
