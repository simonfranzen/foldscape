"use client";

import { useMemo, useState } from "react";

// Inline iterative subdivision visualiser for the Sierpinski story page.
// Renders an SVG triangle and recursively subdivides it `depth` times,
// drawing every filled sub-triangle that survives the recursion. The slider
// controls how deep the subdivision goes (0..7).

interface Props {
  caption: string;
  depthLabel: string;
  triangleLabel: string;
  hint: string;
}

const SIZE = 360;
const HEIGHT = 340;
const MARGIN = 16;

type Point = [number, number];

function triangleVertices(): [Point, Point, Point] {
  const w = SIZE - 2 * MARGIN;
  const triH = (w * Math.sqrt(3)) / 2;
  const top: Point = [SIZE / 2, MARGIN + (HEIGHT - 2 * MARGIN - triH) / 2];
  const left: Point = [MARGIN, top[1] + triH];
  const right: Point = [SIZE - MARGIN, top[1] + triH];
  return [top, left, right];
}

function collectTriangles(depth: number): Array<[Point, Point, Point]> {
  const [a, b, c] = triangleVertices();
  const out: Array<[Point, Point, Point]> = [];
  const recurse = (p1: Point, p2: Point, p3: Point, d: number) => {
    if (d <= 0) {
      out.push([p1, p2, p3]);
      return;
    }
    const m12: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const m23: Point = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2];
    const m31: Point = [(p3[0] + p1[0]) / 2, (p3[1] + p1[1]) / 2];
    recurse(p1, m12, m31, d - 1);
    recurse(m12, p2, m23, d - 1);
    recurse(m31, m23, p3, d - 1);
  };
  recurse(a, b, c, depth);
  return out;
}

export function SierpinskiSubdivision({ caption, depthLabel, triangleLabel, hint }: Props) {
  const [depth, setDepth] = useState(4);

  const triangles = useMemo(() => collectTriangles(depth), [depth]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
            <svg
              viewBox={`0 0 ${SIZE} ${HEIGHT}`}
              width="100%"
              style={{ maxWidth: SIZE, display: "block" }}
              aria-label="Sierpinski subdivision"
            >
              <rect x={0} y={0} width={SIZE} height={HEIGHT} fill="#06070d" />
              {triangles.map((tri, i) => (
                <polygon
                  key={i}
                  points={tri.map((p) => `${p[0]},${p[1]}`).join(" ")}
                  fill="#ffd166"
                  fillOpacity={0.82}
                  stroke="#ffd166"
                  strokeOpacity={0.4}
                  strokeWidth={depth >= 6 ? 0 : 0.6}
                />
              ))}
            </svg>
          </div>
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{depthLabel}</span>
              <span className="text-signal-amber">{depth}</span>
            </div>
            <input
              type="range"
              min={0}
              max={7}
              step={1}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full accent-signal-amber"
            />
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{triangleLabel}</span>
              <span className="text-signal-amber">{triangles.length.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
