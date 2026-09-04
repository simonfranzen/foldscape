"use client";

// Single clickable star inside a constellation scene. Hubs are *always*
// labelled (the "twelve named stars every math-curious person knows"
// principle — user feedback). Satellites reveal their label on hover/focus.
//
// SVG-native <a href> (not next/link) — next/link wrapping a <g> inside
// SVG ended up swallowing pointer events in some browsers, so neither
// hover nor click registered. SVG <a> is rock-solid for hit testing.
//
// The click handler saves the atlas scroll position for back-navigation
// and then hands off to the router. Next.js' experimental viewTransition
// flag (next.config.mjs) gives us a clean browser-native crossfade for
// free. An earlier version of this file ran a 620 ms zoom-warp animation
// on top of that — the user found it competing with the crossfade and
// asked to remove it.

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Topic, TopicCategory } from "@/lib/topics";
import { CATEGORY_COLOR } from "@/lib/cosmos/layout";
import { palette } from "@/lib/visual/palette";

interface Props {
  topic: Topic;
  x: number;
  y: number;
  isHub: boolean;
  title: string;
  tagline: string;
  category: TopicCategory;
}

export function TopicStar({ topic, x, y, isHub, title, tagline, category }: Props) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const color = CATEGORY_COLOR[category];
  // Bigger, brighter stars — the v2 felt like distant lights; v3 makes
  // each hub feel like a real "planet" you can land on. Satellites
  // doubled in size so they're visible without crowding hubs.
  const r = isHub ? 9 : 4.5;
  const haloR = isHub ? 28 : 14;
  const showLabel = isHub || hover;

  // SVG <a> renders as SVGAElement at runtime but React's JSX defaults
  // to HTMLAnchorElement here. React.MouseEvent<Element> covers both
  // without TypeScript complaining about transform/getBBox membership.
  const onClick = (e: React.MouseEvent<Element>) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    e.preventDefault();
    // Save where we left the atlas so that back-navigation lands the user
    // at the same star they jumped from, not at the top of the page.
    try {
      sessionStorage.setItem("foldscape.atlas.scrollY", String(window.scrollY));
    } catch {
      // Storage may be unavailable (private mode); ignore.
    }
    router.push(topic.href);
  };

  return (
    <a
      href={topic.href}
      onClick={onClick}
      aria-label={`${title} — ${tagline}`}
      className="cosmos-star outline-none"
      style={{ cursor: "pointer" }}
    >
      <g
        transform={`translate(${x} ${y})`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        tabIndex={0}
      >
        {/* Generous hit-area first so the cursor doesn't have to be on the
            tiny circle to register a hover. Drawn under the visible star. */}
        <circle r={Math.max(haloR + 4, 18)} fill="rgba(0,0,0,0.001)" />
        {/* Halos — hubs breathe slowly (see .cosmos-halo-breathe); the
            per-star negative delay desynchronises neighbours. */}
        <g
          className={isHub ? "cosmos-halo-breathe" : undefined}
          style={isHub ? { animationDelay: `-${((x + y) % 7).toFixed(2)}s` } : undefined}
        >
          {/* Outer halo */}
          <circle
            r={haloR * 1.6}
            fill={color}
            opacity={hover ? 0.16 : isHub ? 0.05 : 0.02}
            style={{ transition: "opacity 220ms ease" }}
          />
          {/* Inner halo */}
          <circle
            r={haloR}
            fill={color}
            opacity={hover ? 0.4 : isHub ? 0.18 : 0.08}
            style={{ transition: "opacity 220ms ease" }}
          />
        </g>
        {/* Bright bloom ring for hubs */}
        {isHub && (
          <circle r={r * 1.5} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={0.6} />
        )}
        {/* The star itself */}
        <circle r={r} fill="#fff" />
        {isHub && <circle r={r * 0.55} fill={color} opacity={0.85} />}
        {/* Label */}
        {showLabel && (
          <g
            opacity={hover || isHub ? 1 : 0}
            style={{ transition: "opacity 200ms ease" }}
            aria-hidden="true"
          >
            <text
              x={r + 10}
              y={isHub ? 5 : 4}
              fill={hover ? "#ffffff" : "#dde2f0"}
              stroke={palette.ink[950]}
              strokeWidth={3.5}
              paintOrder="stroke fill"
              className="cosmos-star-label"
              fontSize={isHub ? 18 : 13}
              fontWeight={isHub ? 500 : 400}
              opacity={hover ? 1 : isHub ? 0.92 : 1}
              style={{ pointerEvents: "none" }}
            >
              {title}
            </text>
          </g>
        )}
      </g>
    </a>
  );
}
