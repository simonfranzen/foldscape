"use client";

import { useMemo } from "react";
import { EmlCanvas } from "./EmlCanvas";
import { buildFragmentShader } from "@/lib/gl/shader";
import { parse } from "@/lib/eml/parse";
import { PRESETS } from "@/lib/eml/presets";

const PALETTES_FOR_GRID = [0, 1, 2, 3, 4, 0, 1, 2];

// A grid of every preset, each rendered with its own palette. The garden as
// catalog: "look what one operator can produce."
export function GardenGrid() {
  const items = useMemo(
    () =>
      PRESETS.map((p, i) => ({
        preset: p,
        fragSrc: buildFragmentShader(parse(p.src)),
        palette: PALETTES_FOR_GRID[i % PALETTES_FOR_GRID.length],
      })),
    [],
  );

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map(({ preset, fragSrc, palette }) => (
        <div
          key={preset.id}
          className="hairline group relative aspect-square overflow-hidden rounded-xl border bg-ink-950"
        >
          <EmlCanvas
            fragSrc={fragSrc}
            state={{
              center: preset.view?.[0] !== undefined ? [preset.view[0], preset.view[1]] : [0, 0],
              scale: preset.view?.[2] ?? 2.4,
              param: preset.p ?? [0.3, 0.3],
              contours: 0.65,
              gridStrength: 0,
              palette,
              exposure: 1.1,
            }}
            className="absolute inset-0 block h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div>
              <div className="math-italic text-lg leading-none text-ink-100">{preset.title}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                depth {preset.depth}
              </div>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest2 text-signal-violet opacity-0 transition-opacity group-hover:opacity-100">
              {preset.id}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
