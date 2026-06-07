"use client";

import { useEffect, useRef, useState } from "react";

// Signature artefact for the Gödel page. A typographic loop: the sentence
// "G says ⌜G⌝ has no proof" is rendered along a self-intersecting curve
// (a lemniscate — figure-8) so the sentence literally bites its own tail.
// At the crossing, the symbol G and its Gödel number ⌜G⌝ pass through each
// other. Honours prefers-reduced-motion: when set, the curve renders static.

const SENTENCE = " G  ↔  ¬Prov( ⌜G⌝ )  ·  the sentence numbered ⌜G⌝ has no proof  · ";

export function GodelLoopHero() {
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
      setT((s) => s + dt * 0.06); // very slow drift, ~one full revolution / 17s
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  // Lemniscate of Bernoulli, scaled to fit the viewbox. Parametric form
  // x = a cos(θ) / (1 + sin²θ), y = a sin(θ)cos(θ) / (1 + sin²θ)
  const W = 800;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;
  const a = 180;

  const points: string[] = [];
  const N = 240;
  for (let i = 0; i <= N; i++) {
    const θ = (i / N) * Math.PI * 2;
    const denom = 1 + Math.sin(θ) ** 2;
    const x = cx + (a * Math.cos(θ)) / denom;
    const y = cy + ((a * Math.sin(θ) * Math.cos(θ)) / denom) * 0.7;
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  // Drift the text along the path by changing startOffset over time.
  const offsetPct = ((t * 100) % 100).toFixed(2);

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="The Gödel sentence on a figure-of-eight curve, biting its own tail."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden="true">
        <defs>
          <path id="godel-loop" d={points.join(" ")} fill="none" />
          <linearGradient id="godel-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b388ff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#7df3ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b388ff" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Ghost stroke of the curve */}
        <use href="#godel-loop" stroke="rgba(179,136,255,0.18)" strokeWidth="1.6" />
        <use href="#godel-loop" stroke="url(#godel-stroke)" strokeWidth="0.6" opacity="0.5" />
        {/* The sentence laid along the curve, drifting */}
        <text fontFamily="var(--font-serif)" fontStyle="italic" fontSize="17" fill="#eaecf3">
          <textPath href="#godel-loop" startOffset={`${offsetPct}%`} method="align" spacing="auto">
            {SENTENCE.repeat(3)}
          </textPath>
        </text>
        {/* G and ⌜G⌝ as twin markers at the figure-8 crossing */}
        <g transform={`translate(${cx} ${cy})`}>
          <circle r="18" fill="rgba(5,6,10,0.85)" stroke="#b388ff" strokeOpacity="0.75" />
          <text
            textAnchor="middle"
            dy="6"
            fontFamily="var(--font-serif)"
            fontStyle="italic"
            fontSize="22"
            fill="#b388ff"
          >
            G
          </text>
        </g>
        <g transform={`translate(${cx + 50} ${cy - 28})`}>
          <text
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="13"
            fill="#7df3ff"
            opacity="0.78"
          >
            ⌜G⌝
          </text>
        </g>
      </svg>
    </figure>
  );
}
