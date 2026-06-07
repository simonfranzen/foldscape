"use client";

import { useEffect, useRef, useState } from "react";

// Signature artefact for the Backprop page. A loss landscape rendered as
// nested contour rings, with a tiny walker descending the gradient toward
// the basin's minimum. The walker leaves a faint trail behind it — each
// step is one application of `w ← w − η∇w L`. Honours
// `prefers-reduced-motion`: when set, the walker renders frozen near the
// edge with no trail animation.

export function BackpropSignatureHero() {
  const [reduced, setReduced] = useState(false);
  const [t, setT] = useState(0);
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
      // One full descent every ~9s — slow enough to feel deliberate.
      setT((s) => (s + dt * 0.11) % 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const W = 800;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2 + 14;

  // A tilted elliptical bowl. The descent path is a logarithmic spiral
  // into the centre — visually exactly what gradient descent with momentum
  // looks like on an anisotropic quadratic loss.
  const RINGS = 7;
  const RX = 280;
  const RY = 100;

  // Walker position along the spiral. r shrinks from 1 to 0 as t advances.
  const phase = reduced ? 0.08 : t;
  const r = 1 - Math.pow(phase, 1.4);
  const theta = phase * Math.PI * 5;
  const wx = cx + r * RX * Math.cos(theta);
  const wy = cy + r * RY * Math.sin(theta);

  // Trail: sample 28 prior points on the same spiral.
  const trail: Array<{ x: number; y: number; a: number }> = [];
  if (!reduced) {
    for (let i = 1; i <= 28; i++) {
      const back = Math.max(0, phase - i * 0.012);
      const rb = 1 - Math.pow(back, 1.4);
      const tb = back * Math.PI * 5;
      trail.push({
        x: cx + rb * RX * Math.cos(tb),
        y: cy + rb * RY * Math.sin(tb),
        a: 1 - i / 32,
      });
    }
  }

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="A loss landscape with a tiny walker descending the gradient toward the basin's minimum."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="bp-basin" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#ffd166" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#ffd166" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bp-axis" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(138,144,164,0)" />
            <stop offset="50%" stopColor="rgba(138,144,164,0.45)" />
            <stop offset="100%" stopColor="rgba(138,144,164,0)" />
          </linearGradient>
        </defs>

        {/* Soft basin glow */}
        <ellipse cx={cx} cy={cy} rx={RX + 30} ry={RY + 30} fill="url(#bp-basin)" />

        {/* Concentric contour rings — equal increments of loss */}
        {Array.from({ length: RINGS }).map((_, i) => {
          const k = (i + 1) / RINGS;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={RX * k}
              ry={RY * k}
              fill="none"
              stroke="rgba(255, 209, 102, 0.32)"
              strokeWidth={i === RINGS - 1 ? 1.2 : 0.7}
              strokeDasharray={i === 0 ? "" : "2 4"}
            />
          );
        })}

        {/* Horizontal weight axis label */}
        <line x1={40} y1={cy + RY + 32} x2={W - 40} y2={cy + RY + 32} stroke="url(#bp-axis)" />
        <text
          x={W - 48}
          y={cy + RY + 26}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#8a90a4"
        >
          weight space
        </text>
        <text
          x={48}
          y={28}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#8a90a4"
        >
          loss L(w)
        </text>

        {/* Trail of past steps */}
        {trail.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.2 - i * 0.05} fill="#ffd166" opacity={p.a * 0.55} />
        ))}

        {/* The gradient arrow at the walker — points toward the next step */}
        {(() => {
          const next = Math.min(1, phase + 0.012);
          const rN = 1 - Math.pow(next, 1.4);
          const tN = next * Math.PI * 5;
          const nx = cx + rN * RX * Math.cos(tN);
          const ny = cy + rN * RY * Math.sin(tN);
          const dx = nx - wx;
          const dy = ny - wy;
          const len = Math.hypot(dx, dy) || 1;
          const ax = wx + (dx / len) * 18;
          const ay = wy + (dy / len) * 18;
          // arrowhead
          const headL = 6;
          const angle = Math.atan2(dy, dx);
          const h1x = ax - Math.cos(angle - 0.5) * headL;
          const h1y = ay - Math.sin(angle - 0.5) * headL;
          const h2x = ax - Math.cos(angle + 0.5) * headL;
          const h2y = ay - Math.sin(angle + 0.5) * headL;
          return (
            <g>
              <line x1={wx} y1={wy} x2={ax} y2={ay} stroke="#ffd166" strokeWidth="1.4" />
              <line x1={ax} y1={ay} x2={h1x} y2={h1y} stroke="#ffd166" strokeWidth="1.4" />
              <line x1={ax} y1={ay} x2={h2x} y2={h2y} stroke="#ffd166" strokeWidth="1.4" />
            </g>
          );
        })()}

        {/* The walker itself */}
        <circle cx={wx} cy={wy} r="6" fill="rgba(5,6,10,0.95)" stroke="#ffd166" strokeWidth="1.6" />
        <circle cx={wx} cy={wy} r="2" fill="#ffd166" />

        {/* Minimum marker at the centre */}
        <g transform={`translate(${cx} ${cy})`}>
          <circle r="14" fill="rgba(5,6,10,0.85)" stroke="rgba(255,209,102,0.65)" />
          <text
            textAnchor="middle"
            dy="5"
            fontFamily="var(--font-serif)"
            fontStyle="italic"
            fontSize="15"
            fill="#ffd166"
          >
            w*
          </text>
        </g>

        {/* Update rule, in mono, top-right */}
        <text
          x={W - 24}
          y={48}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="13"
          fill="#ffd166"
          opacity="0.85"
        >
          w ← w − η ∇w L
        </text>
        <text
          x={W - 24}
          y={66}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#a8abbd"
          opacity="0.65"
        >
          one step downhill
        </text>
      </svg>
    </figure>
  );
}
