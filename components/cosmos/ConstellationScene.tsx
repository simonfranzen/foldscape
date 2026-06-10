"use client";

// One sticky-pinned constellation scene per category. As the user scrolls
// through the scene's section, an inner sticky child holds the SVG fixed in
// place; per-element progress drives:
//   - the sky-tint CSS custom property (Variant: rgba paint over the global
//     starfield, sliding in via the parent CosmosScene),
//   - the constellation reveal (hub stars fade in first, satellites next,
//     edges draw via stroke-dashoffset).
// The scene-local progress is exposed up to the orchestrator via onProgress
// so it can mix the category accent into the global sky.

import { useEffect, useMemo, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useScrollProgress } from "@/lib/cosmos/hooks";
import {
  CATEGORY_COLOR,
  SCENE_LAYOUTS,
  SCENE_VB_H,
  SCENE_VB_W,
  edgePath,
} from "@/lib/cosmos/layout";
import { COSMOS } from "@/lib/i18n/cosmos";
import { TOPIC_EDGES } from "@/lib/topicEdges";
import type { TopicCategory } from "@/lib/topics";
import { TopicStar } from "@/components/cosmos/TopicStar";
import { Specimen } from "@/components/cosmos/Specimen";

interface Props {
  category: TopicCategory;
  index: number;
  onProgress: (category: TopicCategory, progress: number) => void;
}

export function ConstellationScene({ category, index, onProgress }: Props) {
  const { a, locale } = useI18n();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress(wrapRef);

  // Push progress up to the orchestrator so it can blend the sky-tint
  // across all six categories in a single pass.
  useEffect(() => {
    onProgress(category, progress);
  }, [category, progress, onProgress]);

  const layout = SCENE_LAYOUTS[category];
  const color = CATEGORY_COLOR[category];
  const cosmos = COSMOS[locale];

  // Edges that live *inside* this category — kept short list. Cross-category
  // bridges are shown only on the atlas overview, not per scene.
  const inSceneEdges = useMemo(() => {
    const idSet = new Set(layout.map((l) => l.topic.id));
    return TOPIC_EDGES.filter((e) => idSet.has(e.a) && idSet.has(e.b)).map((e) => {
      const A = layout.find((l) => l.topic.id === e.a)!;
      const B = layout.find((l) => l.topic.id === e.b)!;
      return {
        key: `${e.a}-${e.b}`,
        d: edgePath({ x: A.x, y: A.y }, { x: B.x, y: B.y }, `${e.a}-${e.b}`, 0.06),
        kind: e.kind,
      };
    });
  }, [layout]);

  // Category name lookup from atlas dict (already i18n'd in atlas.ts).
  const categoryKey = `category${category[0].toUpperCase()}${category.slice(1)}` as
    | "categoryLogic"
    | "categoryComputation"
    | "categoryChaos"
    | "categoryGeometry"
    | "categoryAnalysis"
    | "categoryParadox";
  const categoryName = (a.landing as unknown as Record<string, string>)[categoryKey] ?? category;

  // Reveal progress windows. Hubs fade in 0.05→0.25, satellites 0.20→0.45,
  // edges draw 0.30→0.70. Tuned so the cluster builds itself as the scene
  // enters and stays "completed" through the middle of the section.
  const hubReveal = Math.max(0, Math.min(1, (progress - 0.05) / 0.2));
  const satReveal = Math.max(0, Math.min(1, (progress - 0.2) / 0.25));
  const edgeReveal = Math.max(0, Math.min(1, (progress - 0.3) / 0.4));

  return (
    <section
      ref={wrapRef}
      data-cosmos-scene={category}
      data-index={index}
      id={`scene-${category}`}
      aria-labelledby={`scene-${category}-title`}
      className="cosmos-scene relative w-full"
    >
      <div
        className="cosmos-sticky sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        // CSS perspective owner: this scope's children that opt in via
        // transform: rotate*/translateZ get true 3D depth here. 1400 px
        // is enough to feel three-dimensional without distorting the SVG
        // labels into illegibility.
        style={{ perspective: "1400px" }}
      >
        {/* Scroll-driven "camera". From 0 → 1 progress we (a) zoom in
            0.82 → 1.16 at the peak, (b) tilt rotateX from +14° (looking
            slightly down at a cluster below you) through 0° (looking at
            it head-on at peak) to −14° (it slips behind you), (c) push
            translateZ from −180 → 60 → −180 px so the cluster physically
            comes forward as you pass through it. That trio is the "world
            opening up" the user kept asking for — a real fly-through
            instead of a flat fade. */}
        <div
          className="relative w-full max-w-6xl px-6"
          style={{
            transform: `
              translateZ(${(-180 + (1 - Math.abs(progress - 0.5) * 2) * 240).toFixed(2)}px)
              rotateX(${((0.5 - progress) * 28).toFixed(2)}deg)
              scale(${(0.82 + (1 - Math.abs(progress - 0.5) * 2) * 0.34).toFixed(3)})
            `,
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
            transition: "transform 80ms linear",
            willChange: "transform",
          }}
        >
          {/* Category-specific quiet motion drifting behind the stars.
              pointer-events-none on the wrapper so it never blocks the
              clickable stars sitting in the SVG above it. The specimen
              reveals its lines as the scene scrolls in — see Specimen. */}
          <div className="pointer-events-none absolute inset-0">
            <Specimen category={category} progress={progress} />
          </div>
          {/* Title block: act numeral + chapter title (the narrative arc
              I–VI), then the existing poetic tagline. The arc gives the
              six scenes a sense of *sequence* — Krise → Stabilität →
              Aufbau → Verlust → Form → Grenze — so the visitor feels
              they're moving through a story, not flipping through a
              flat menu. */}
          <div className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 px-4 text-center md:top-16 lg:top-20">
            <div
              className="flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-widest2 opacity-90"
              style={{ color }}
            >
              <span className="text-[14px] tabular-nums opacity-85">
                {cosmos.acts[category].numeral}
              </span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span>{cosmos.acts[category].title}</span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span className="opacity-60">{categoryName}</span>
            </div>
            <h2
              id={`scene-${category}-title`}
              className="math-italic mx-auto mt-3 max-w-[90vw] text-2xl leading-tight text-ink-100 md:max-w-3xl md:text-4xl lg:text-5xl"
            >
              {cosmos.taglines[category]}
            </h2>
          </div>

          <svg
            viewBox={`0 0 ${SCENE_VB_W} ${SCENE_VB_H}`}
            className="block h-auto w-full"
            role="list"
            aria-label={`${categoryName} — ${cosmos.taglines[category]}`}
          >
            {/* Edges (draw via stroke-dashoffset). aria-hidden because they
                are pure decoration; the topic stars below are the real
                navigation surface. */}
            <g
              aria-hidden="true"
              stroke={color}
              fill="none"
              strokeWidth={0.6}
              strokeOpacity={0.55 * edgeReveal}
            >
              {inSceneEdges.map((e) => (
                <path
                  key={e.key}
                  d={e.d}
                  strokeDasharray="600"
                  strokeDashoffset={600 * (1 - edgeReveal)}
                />
              ))}
            </g>

            {/* Stars */}
            {layout.map((l) => {
              const reveal = l.isHub ? hubReveal : satReveal;
              if (reveal <= 0) return null;
              const meta = a.topics[l.topic.id];
              return (
                <g
                  key={l.topic.id}
                  role="listitem"
                  opacity={reveal}
                  style={{ transition: "opacity 220ms ease" }}
                >
                  <TopicStar
                    topic={l.topic}
                    x={l.x}
                    y={l.y}
                    isHub={l.isHub}
                    title={meta.title}
                    tagline={meta.tagline}
                    category={category}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
