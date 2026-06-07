"use client";

import { useEffect, useRef, useState } from "react";

// Signature artefact for the Quine page. A typographic Möbius-strip: a ribbon
// of source code that loops back on itself through a soft figure-of-eight,
// with the inner edge being the printed output of the outer edge — so the
// program literally rolls onto its own listing. Honours
// `prefers-reduced-motion`: when set, the ribbon renders static.

const SOURCE =
  " s = 's=%r;print(s%%s)';print(s%s)   ·   p ↦ print(p)   ·   λf.(λx.f(xx))(λx.f(xx))   · ";

export function QuineSignatureHero() {
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
      // Two glyphs / second drift along the loop — slow enough to read.
      setT((s) => s + dt * 0.05);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const W = 800;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;

  // Outer ribbon: a smooth ellipse with a single horizontal half-twist drawn
  // as a self-crossing at the centre. Two Bézier loops that mirror each
  // other across the vertical axis create the ribbon's pinch.
  const outerPath = (() => {
    const a = 260; // half-width
    const b = 92; // half-height
    const k = 0.55; // bezier handle factor
    // Path: top-left → top-right (via upper arc) → bottom-left (cross) → bottom-right → close.
    return [
      `M ${cx - a} ${cy}`,
      `C ${cx - a} ${cy - b * k * 2}, ${cx - a * k} ${cy - b}, ${cx} ${cy - b}`,
      `C ${cx + a * k} ${cy - b}, ${cx + a} ${cy - b * k * 2}, ${cx + a} ${cy}`,
      `C ${cx + a} ${cy + b * k * 2}, ${cx + a * k} ${cy + b}, ${cx} ${cy + b}`,
      `C ${cx - a * k} ${cy + b}, ${cx - a} ${cy + b * k * 2}, ${cx - a} ${cy}`,
      "Z",
    ].join(" ");
  })();

  // Inner ribbon — same loop, slightly inset — gives the surface depth.
  const innerPath = (() => {
    const a = 230;
    const b = 70;
    const k = 0.55;
    return [
      `M ${cx - a} ${cy}`,
      `C ${cx - a} ${cy - b * k * 2}, ${cx - a * k} ${cy - b}, ${cx} ${cy - b}`,
      `C ${cx + a * k} ${cy - b}, ${cx + a} ${cy - b * k * 2}, ${cx + a} ${cy}`,
      `C ${cx + a} ${cy + b * k * 2}, ${cx + a * k} ${cy + b}, ${cx} ${cy + b}`,
      `C ${cx - a * k} ${cy + b}, ${cx - a} ${cy + b * k * 2}, ${cx - a} ${cy}`,
      "Z",
    ].join(" ");
  })();

  const outerOffset = ((t * 100) % 100).toFixed(2);
  // The "inner" track is the printed output — runs the opposite direction so
  // visually you see the source on one side and its echo on the other.
  const innerOffset = ((100 - ((t * 100) % 100)) % 100).toFixed(2);

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="A ribbon of source code that prints its own listing as its underside."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden="true">
        <defs>
          <path id="quine-outer" d={outerPath} fill="none" />
          <path id="quine-inner" d={innerPath} fill="none" />
          <linearGradient id="quine-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7df3ff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7df3ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7df3ff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Ghost outline of the ribbon */}
        <use href="#quine-outer" stroke="rgba(125,243,255,0.18)" strokeWidth="1.6" />
        <use href="#quine-inner" stroke="rgba(125,243,255,0.10)" strokeWidth="1.2" />
        <use href="#quine-outer" stroke="url(#quine-stroke)" strokeWidth="0.6" opacity="0.6" />
        {/* The source laid along the outer ribbon */}
        <text fontFamily="var(--font-mono)" fontSize="13" fill="#eaecf3">
          <textPath
            href="#quine-outer"
            startOffset={`${outerOffset}%`}
            method="align"
            spacing="auto"
          >
            {SOURCE.repeat(2)}
          </textPath>
        </text>
        {/* The output laid along the inner ribbon, drifting the other way */}
        <text fontFamily="var(--font-mono)" fontSize="12" fill="#7df3ff" opacity="0.7">
          <textPath
            href="#quine-inner"
            startOffset={`${innerOffset}%`}
            method="align"
            spacing="auto"
          >
            {SOURCE.repeat(2)}
          </textPath>
        </text>
        {/* Central marker: the printer feeding itself */}
        <g transform={`translate(${cx} ${cy})`}>
          <circle r="22" fill="rgba(5,6,10,0.85)" stroke="#7df3ff" strokeOpacity="0.7" />
          <text
            textAnchor="middle"
            dy="8"
            fontFamily="var(--font-serif)"
            fontStyle="italic"
            fontSize="22"
            fill="#7df3ff"
          >
            ↻
          </text>
        </g>
        <g transform={`translate(${cx + 60} ${cy - 36})`}>
          <text
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="#a8abbd"
            opacity="0.78"
          >
            print(p) = p
          </text>
        </g>
      </svg>
    </figure>
  );
}
