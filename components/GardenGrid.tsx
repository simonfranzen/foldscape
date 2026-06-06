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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(({ preset, fragSrc, palette }) => (
        <div
          key={preset.id}
          className="group relative aspect-square rounded-xl overflow-hidden border hairline bg-ink-950"
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
            className="absolute inset-0 w-full h-full block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-3 right-3 bottom-3 flex items-end justify-between gap-2 pointer-events-none">
            <div>
              <div className="math-italic text-lg text-ink-100 leading-none">{preset.title}</div>
              <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mt-1">
                depth {preset.depth}
              </div>
            </div>
            <div className="font-mono text-[9px] tracking-widest2 text-signal-violet uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              {preset.id}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
