"use client";

// Faint sky-glow: two cool, low-opacity clouds suggesting depth without
// painting the screen. The v1 of this rendered six saturated category-
// coloured clouds which read as "Christmas tree" (user feedback). This
// version is monochrome, drastically dimmer, and exists only to give the
// black a hint of shape — barely visible at peak, invisible at the edges.

import { useMouseParallax } from "@/lib/cosmos/hooks";

export function NebulaLayer() {
  const { mx, my } = useMouseParallax();
  const shift = `translate(${(mx * 4).toFixed(2)}, ${(my * 6).toFixed(2)})`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="neb-cool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8aa0c0" stopOpacity="0.07" />
          <stop offset="60%" stopColor="#8aa0c0" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#8aa0c0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="neb-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b0a0c8" stopOpacity="0.05" />
          <stop offset="55%" stopColor="#b0a0c8" stopOpacity="0.015" />
          <stop offset="100%" stopColor="#b0a0c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={shift}>
        <ellipse cx={280} cy={220} rx={420} ry={260} fill="url(#neb-cool)" />
        <ellipse cx={780} cy={420} rx={380} ry={240} fill="url(#neb-warm)" />
      </g>
    </svg>
  );
}
