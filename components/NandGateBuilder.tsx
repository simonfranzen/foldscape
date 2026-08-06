"use client";

import { useState } from "react";
import { palette } from "@/lib/visual/palette";

// Small SVG canvas showing how to wire 1–4 NAND gates into NOT / AND / OR /
// XOR. The user picks a target gate; the diagram morphs (CSS transitions on
// SVG attributes) to show the equivalent NAND circuit.

type Target = "NOT" | "AND" | "OR" | "XOR";

interface Props {
  caption: string;
  labels: {
    not: string;
    and: string;
    or: string;
    xor: string;
    countOne: string;
    countN: (n: number) => string;
    description: Record<Target, string>;
    // Accessible name for the whole circuit SVG (localized per gate + count).
    circuit: (target: string, n: number) => string;
  };
}

const W = 360;
const H = 240;

// Palette tokens are hex; derive rgba fills locally so tints stay on the
// ink/signal scale instead of drifting to hand-picked literals.
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Each layout is just a list of NAND gate positions + a list of wires.
type Gate = { id: string; x: number; y: number };
type Wire = { from: { x: number; y: number }; to: { x: number; y: number } };

type Layout = {
  inputs: Array<{ id: "a" | "b"; x: number; y: number }>;
  gates: Gate[];
  wires: Wire[];
  output: { x: number; y: number };
  count: number;
};

// ------- gate symbol (NAND) --------------------------------------------------
// A NAND is drawn as an AND shape with a small bubble on its output.
function NandSymbol({ x, y, accent }: { x: number; y: number; accent: string }) {
  // The gate is drawn around (x, y), 44 wide × 30 tall, with output at right.
  const left = x - 22;
  const right = x + 22;
  const top = y - 15;
  const bottom = y + 15;
  // AND shape: flat back, semicircle front.
  const d =
    `M ${left} ${top} ` +
    `L ${x} ${top} ` +
    `A 15 15 0 0 1 ${x} ${bottom} ` +
    `L ${left} ${bottom} ` +
    `Z`;
  return (
    <g style={{ transition: "transform 480ms ease" }} transform={`translate(0,0)`}>
      <path d={d} fill={withAlpha(palette.signal.violet, 0.1)} stroke={accent} strokeWidth={1.4} />
      {/* bubble */}
      <circle cx={right - 4} cy={y} r={3} fill="none" stroke={accent} strokeWidth={1.4} />
    </g>
  );
}

// Build layouts ---------------------------------------------------------------
function layoutFor(target: Target): Layout {
  const inA = { id: "a" as const, x: 28, y: 80 };
  const inB = { id: "b" as const, x: 28, y: 160 };

  if (target === "NOT") {
    // 1 NAND: both inputs tied to a.
    const g = { id: "g1", x: 200, y: 120 };
    return {
      inputs: [inA],
      gates: [g],
      wires: [
        { from: inA, to: { x: g.x - 22, y: g.y - 8 } },
        { from: inA, to: { x: g.x - 22, y: g.y + 8 } },
      ],
      output: { x: g.x + 22, y: g.y },
      count: 1,
    };
  }

  if (target === "AND") {
    // 2 NANDs: g1 = a NAND b, g2 = g1 NAND g1 (= NOT g1 = AND)
    const g1 = { id: "g1", x: 160, y: 120 };
    const g2 = { id: "g2", x: 280, y: 120 };
    return {
      inputs: [inA, inB],
      gates: [g1, g2],
      wires: [
        { from: inA, to: { x: g1.x - 22, y: g1.y - 8 } },
        { from: inB, to: { x: g1.x - 22, y: g1.y + 8 } },
        { from: { x: g1.x + 22, y: g1.y }, to: { x: g2.x - 22, y: g2.y - 8 } },
        { from: { x: g1.x + 22, y: g1.y }, to: { x: g2.x - 22, y: g2.y + 8 } },
      ],
      output: { x: g2.x + 22, y: g2.y },
      count: 2,
    };
  }

  if (target === "OR") {
    // 3 NANDs: g1 = NOT a, g2 = NOT b, g3 = g1 NAND g2 = OR
    const g1 = { id: "g1", x: 160, y: 70 };
    const g2 = { id: "g2", x: 160, y: 170 };
    const g3 = { id: "g3", x: 290, y: 120 };
    return {
      inputs: [inA, inB],
      gates: [g1, g2, g3],
      wires: [
        { from: inA, to: { x: g1.x - 22, y: g1.y - 8 } },
        { from: inA, to: { x: g1.x - 22, y: g1.y + 8 } },
        { from: inB, to: { x: g2.x - 22, y: g2.y - 8 } },
        { from: inB, to: { x: g2.x - 22, y: g2.y + 8 } },
        { from: { x: g1.x + 22, y: g1.y }, to: { x: g3.x - 22, y: g3.y - 8 } },
        { from: { x: g2.x + 22, y: g2.y }, to: { x: g3.x - 22, y: g3.y + 8 } },
      ],
      output: { x: g3.x + 22, y: g3.y },
      count: 3,
    };
  }

  // XOR — 4 NANDs.
  // t  = a NAND b
  // g2 = a NAND t
  // g3 = b NAND t
  // out = g2 NAND g3
  const g1 = { id: "g1", x: 130, y: 120 };
  const g2 = { id: "g2", x: 220, y: 65 };
  const g3 = { id: "g3", x: 220, y: 175 };
  const g4 = { id: "g4", x: 310, y: 120 };
  return {
    inputs: [inA, inB],
    gates: [g1, g2, g3, g4],
    wires: [
      // a → g1, g2 top
      { from: inA, to: { x: g1.x - 22, y: g1.y - 8 } },
      { from: inA, to: { x: g2.x - 22, y: g2.y - 8 } },
      // b → g1, g3 bottom
      { from: inB, to: { x: g1.x - 22, y: g1.y + 8 } },
      { from: inB, to: { x: g3.x - 22, y: g3.y + 8 } },
      // g1 → g2 bottom, g3 top
      { from: { x: g1.x + 22, y: g1.y }, to: { x: g2.x - 22, y: g2.y + 8 } },
      { from: { x: g1.x + 22, y: g1.y }, to: { x: g3.x - 22, y: g3.y - 8 } },
      // g2, g3 → g4
      { from: { x: g2.x + 22, y: g2.y }, to: { x: g4.x - 22, y: g4.y - 8 } },
      { from: { x: g3.x + 22, y: g3.y }, to: { x: g4.x - 22, y: g4.y + 8 } },
    ],
    output: { x: g4.x + 22, y: g4.y },
    count: 4,
  };
}

function wirePath(w: Wire): string {
  // Smooth cubic Bezier from out → in, controls at half horizontal step.
  const dx = Math.max(20, (w.to.x - w.from.x) / 2);
  return `M ${w.from.x} ${w.from.y} C ${w.from.x + dx} ${w.from.y}, ${w.to.x - dx} ${w.to.y}, ${w.to.x} ${w.to.y}`;
}

export function NandGateBuilder({ caption, labels }: Props) {
  const [target, setTarget] = useState<Target>("AND");
  const layout = layoutFor(target);
  const accent = palette.signal.violet;
  const wireColor = palette.signal.cyan;
  const inputColor = palette.signal.amber;
  const outputColor = palette.signal.rose;

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
        {caption}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["NOT", "AND", "OR", "XOR"] as Target[]).map((t) => {
          const active = t === target;
          const lab =
            t === "NOT"
              ? labels.not
              : t === "AND"
                ? labels.and
                : t === "OR"
                  ? labels.or
                  : labels.xor;
          return (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
                active
                  ? "border-signal-violet bg-signal-violet/15 text-signal-violet"
                  : "border-ink-700 text-ink-300 hover:border-ink-300/50 hover:text-ink-100"
              }`}
            >
              {lab}
            </button>
          );
        })}
      </div>

      <div className="hairline overflow-hidden rounded-xl border bg-ink-950/60">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={labels.circuit(target, layout.count)}
        >
          <rect width={W} height={H} fill={palette.canvas.bg} />

          {/* faint grid */}
          <g stroke={withAlpha(palette.ink[100], 0.04)} strokeWidth={0.5}>
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={H} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 20} x2={W} y2={i * 20} />
            ))}
          </g>

          {/* input pads */}
          {layout.inputs.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={5} fill={inputColor} />
              <text
                x={p.x - 14}
                y={p.y + 4}
                fontFamily="ui-monospace, monospace"
                fontSize={12}
                fill={palette.ink[100]}
                textAnchor="end"
              >
                {p.id}
              </text>
            </g>
          ))}

          {/* wires */}
          <g fill="none" stroke={wireColor} strokeWidth={1.4} strokeOpacity={0.85}>
            {layout.wires.map((w, i) => (
              <path
                key={`w-${target}-${i}`}
                d={wirePath(w)}
                style={{ transition: "d 480ms ease" }}
              />
            ))}
          </g>

          {/* gates */}
          {layout.gates.map((g) => (
            <g key={`g-${target}-${g.id}`} style={{ transition: "transform 480ms ease" }}>
              <NandSymbol x={g.x} y={g.y} accent={accent} />
              <text
                x={g.x - 6}
                y={g.y + 4}
                fontFamily="ui-monospace, monospace"
                fontSize={9}
                fill={accent}
                textAnchor="middle"
              >
                ↑
              </text>
            </g>
          ))}

          {/* output pad */}
          <g>
            <line
              x1={layout.output.x}
              y1={layout.output.y}
              x2={layout.output.x + 30}
              y2={layout.output.y}
              stroke={wireColor}
              strokeWidth={1.4}
              strokeOpacity={0.85}
            />
            <circle cx={layout.output.x + 34} cy={layout.output.y} r={5} fill={outputColor} />
            <text
              x={layout.output.x + 44}
              y={layout.output.y + 4}
              fontFamily="ui-monospace, monospace"
              fontSize={12}
              fill={palette.ink[100]}
            >
              out
            </text>
          </g>
        </svg>
      </div>

      <div className="flex flex-col gap-2 font-mono text-[11px] text-ink-300 md:flex-row md:items-center md:justify-between">
        <span>{layout.count === 1 ? labels.countOne : labels.countN(layout.count)}</span>
        <span className="text-ink-200">{labels.description[target]}</span>
      </div>
    </div>
  );
}
