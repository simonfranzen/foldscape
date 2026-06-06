"use client";

import { useMemo } from "react";
import { EmlCanvas } from "./EmlCanvas";
import { buildFragmentShader } from "@/lib/gl/shader";
import { parse } from "@/lib/eml/parse";

// Renders `w = z` itself — the cleanest possible specimen of the coloring
// scheme. The legend points to: hue = arg(w), brightness rings = |w|.
export function DomainLegend({ palette = 0 }: { palette?: number }) {
  const fragSrc = useMemo(() => buildFragmentShader(parse("z")), []);
  return (
    <div className="relative aspect-square w-full max-w-[280px]">
      <EmlCanvas
        fragSrc={fragSrc}
        state={{
          center: [0, 0],
          scale: 2.4,
          palette,
          contours: 0.85,
          gridStrength: 0.0,
          hueShift: 0,
          exposure: 1.05,
        }}
        className="absolute inset-0 w-full h-full block rounded-full"
      />
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
        {/* axes */}
        <line x1={-95} y1={0} x2={95} y2={0} stroke="rgba(230,232,240,0.25)" strokeDasharray="2 3" />
        <line x1={0} y1={-95} x2={0} y2={95} stroke="rgba(230,232,240,0.25)" strokeDasharray="2 3" />
        <text x={88} y={-6} fill="#b8bdce" fontSize={10} fontFamily="var(--font-mono)" textAnchor="end">
          Re
        </text>
        <text x={6} y={-88} fill="#b8bdce" fontSize={10} fontFamily="var(--font-mono)">
          Im
        </text>
        {/* hue annotation */}
        <g fontFamily="var(--font-mono)" fontSize={9} fill="#e6e8f0">
          <text x={70} y={-20}>arg(w) → hue</text>
          <text x={-90} y={20}>|w| → rings</text>
        </g>
      </svg>
    </div>
  );
}
