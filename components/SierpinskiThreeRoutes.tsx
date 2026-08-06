"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDpr } from "@/lib/hooks/useDpr";
import { palette } from "@/lib/visual/palette";

// Three-routes comparator: classical subdivision, Pascal mod 2, Chaos Game.
// Each route gets its own little canvas/SVG at depth 5+ so the same gasket
// emerges. The Chaos Game animates ~500 dots fading in. Tabs switch the
// active view on mobile; on md+ all three render side by side.

interface Props {
  caption: string;
  tabSubdivision: string;
  tabPascal: string;
  tabChaos: string;
  legendSubdivision: string;
  legendPascal: string;
  legendChaos: string;
  footnote: string;
}

const PANE = 260;

type Point = [number, number];

// Build an rgba() string from a palette hex token so canvas colours stay in
// sync with the Tailwind signal-* classes instead of drifting via literals.
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function triangleVertices(W: number, H: number, margin = 10): [Point, Point, Point] {
  const w = W - 2 * margin;
  const triH = (w * Math.sqrt(3)) / 2;
  const top: Point = [W / 2, margin + (H - 2 * margin - triH) / 2];
  const left: Point = [margin, top[1] + triH];
  const right: Point = [W - margin, top[1] + triH];
  return [top, left, right];
}

// ---------- Subdivision (static SVG, depth 6) ----------
function SubdivisionPane() {
  const triangles = useMemo(() => {
    const [a, b, c] = triangleVertices(PANE, PANE);
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
    recurse(a, b, c, 6);
    return out;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${PANE} ${PANE}`}
      width="100%"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <rect x={0} y={0} width={PANE} height={PANE} fill={palette.canvas.bg} />
      {triangles.map((tri, i) => (
        <polygon
          key={i}
          points={tri.map((p) => `${p[0]},${p[1]}`).join(" ")}
          fill={palette.signal.amber}
          fillOpacity={0.85}
        />
      ))}
    </svg>
  );
}

// ---------- Pascal mod 2 ----------
function PascalPane() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Drive sizing + drawing from a ResizeObserver: on mobile this pane mounts
    // display:none (0×0) and only gets real layout when its tab is selected, so
    // we redraw the moment it becomes visible instead of baking in a 1px canvas.
    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W === 0 || H === 0) return;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const rows = 64;
      const margin = 8;
      const cellW = (W - 2 * margin) / rows;
      const cellH = (H - 2 * margin) / rows;
      const cell = Math.max(1, Math.min(cellW, cellH));
      const totalW = cell * rows;
      const totalH = cell * rows;
      const ox = (W - totalW) / 2;
      const oy = (H - totalH) / 2;

      ctx.fillStyle = hexToRgba(palette.signal.amber, 0.88);
      let row: number[] = [1];
      for (let r = 0; r < rows; r++) {
        const rowOffsetX = ox + ((rows - r - 1) * cell) / 2;
        for (let k = 0; k <= r; k++) {
          if (row[k] === 1) {
            ctx.fillRect(rowOffsetX + k * cell, oy + r * cell, Math.max(1, cell), Math.max(1, cell));
          }
        }
        const next: number[] = new Array(r + 2).fill(0);
        for (let k = 0; k <= r + 1; k++) {
          const left = k === 0 ? 0 : row[k - 1];
          const right = k > r ? 0 : row[k];
          next[k] = left ^ right;
        }
        row = next;
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [dpr]);

  return (
    <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
      <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />
    </div>
  );
}

// ---------- Chaos Game (animated, ~2400 dots fade in) ----------
function ChaosPane() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const dpr = useDpr();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let raf = 0;
    const reduce = prefersReducedMotion();

    // ResizeObserver drives (re)start so a mobile tab that mounts hidden (0×0)
    // draws as soon as it is shown, rather than sizing to a blank 1px canvas.
    const start = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (W === 0 || H === 0) return;
      cancelAnimationFrame(raf);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = palette.canvas.bg;
      ctx.fillRect(0, 0, W, H);

      const verts = triangleVertices(W, H, 12);
      // Burn-in so the early stray points don't sit outside the attractor
      let x = W / 2;
      let y = H / 2;
      for (let i = 0; i < 30; i++) {
        const v = verts[(Math.random() * 3) | 0];
        x = (x + v[0]) / 2;
        y = (y + v[1]) / 2;
      }

      const TOTAL = 2400;

      // Reduced motion: plot the whole attractor at once, no rAF loop.
      if (reduce) {
        ctx.fillStyle = hexToRgba(palette.signal.amber, 0.85);
        for (let i = 0; i < TOTAL; i++) {
          const v = verts[(Math.random() * 3) | 0];
          x = (x + v[0]) / 2;
          y = (y + v[1]) / 2;
          ctx.fillRect(x - 0.5, y - 0.5, 1.6, 1.6);
        }
        return;
      }

      const PER_FRAME = 18;
      let placed = 0;
      const tick = () => {
        const alpha = Math.min(0.9, 0.25 + (placed / TOTAL) * 0.6);
        ctx.fillStyle = hexToRgba(palette.signal.amber, alpha);
        for (let i = 0; i < PER_FRAME && placed < TOTAL; i++) {
          const v = verts[(Math.random() * 3) | 0];
          x = (x + v[0]) / 2;
          y = (y + v[1]) / 2;
          ctx.fillRect(x - 0.5, y - 0.5, 1.6, 1.6);
          placed++;
        }
        if (placed < TOTAL) {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    start();
    const ro = new ResizeObserver(start);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dpr]);

  return (
    <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
      <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />
    </div>
  );
}

export function SierpinskiThreeRoutes({
  caption,
  tabSubdivision,
  tabPascal,
  tabChaos,
  legendSubdivision,
  legendPascal,
  legendChaos,
  footnote,
}: Props) {
  // Mobile tab state; on md+ all three are visible side by side.
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  const tabs = [tabSubdivision, tabPascal, tabChaos];

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {caption}
      </div>

      {/* Mobile: tab switcher */}
      <div className="flex gap-2 md:hidden">
        {tabs.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(i as 0 | 1 | 2)}
            className={`hairline flex-1 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
              activeTab === i
                ? "border-signal-amber/70 bg-signal-amber/10 text-signal-amber"
                : "text-ink-300 hover:text-ink-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Panel label={tabSubdivision} legend={legendSubdivision} visible={activeTab === 0}>
          <SubdivisionPane />
        </Panel>
        <Panel label={tabPascal} legend={legendPascal} visible={activeTab === 1}>
          <PascalPane />
        </Panel>
        <Panel label={tabChaos} legend={legendChaos} visible={activeTab === 2}>
          <ChaosPane />
        </Panel>
      </div>

      <p className="text-[11px] leading-relaxed text-ink-300">{footnote}</p>
    </div>
  );
}

function Panel({
  label,
  legend,
  visible,
  children,
}: {
  label: string;
  legend: string;
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`hairline space-y-3 rounded-xl border bg-ink-950 p-3 ${
        visible ? "block" : "hidden md:block"
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
      <div className="hairline overflow-hidden rounded-md border bg-ink-950">{children}</div>
      <p className="text-[10px] leading-relaxed text-ink-400">{legend}</p>
    </div>
  );
}
