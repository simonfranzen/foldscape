"use client";

import { useMemo, useState } from "react";
import { palette } from "@/lib/visual/palette";

// Inline Descartes-formula calculator: given three signed curvatures k1, k2, k3,
// compute the two possible fourth curvatures via
//   k4 = k1 + k2 + k3 ± 2·√(k1k2 + k2k3 + k3k1)
//
// The signed convention is the usual Apollonian one: a positive k means a
// circle of radius 1/k, a negative k means the enclosing circle that contains
// the others. We render four little tangent-circle previews so the user can see
// what the seed plus each candidate solution actually looks like.

interface Props {
  caption: string;
  inputsLabel: string;
  solutionsLabel: string;
  invalidLabel: string;
  presetLabel: string;
  plusLabel: string;
  minusLabel: string;
  noteText: string;
}

type Triple = { k1: number; k2: number; k3: number };

const PRESETS: Array<{ label: string; values: Triple }> = [
  { label: "−1, 2, 2", values: { k1: -1, k2: 2, k3: 2 } },
  { label: "−2, 3, 6", values: { k1: -2, k2: 3, k3: 6 } },
  { label: "−3, 5, 8", values: { k1: -3, k2: 5, k3: 8 } },
  { label: "−6, 11, 14", values: { k1: -6, k2: 11, k3: 14 } },
  { label: "1, 1, 1", values: { k1: 1, k2: 1, k3: 1 } },
];

const TINY = 0.07;

function MiniSeed({ curvatures, highlight }: { curvatures: number[]; highlight?: number }) {
  // A schematic preview: the relative sizes are taken from |1/k|. We draw the
  // negative-curvature circle (if any) as the outer ring; positive ones inside.
  // The intent is to give a feel for the curvature relationships, not to lay
  // them out geometrically. (That happens in the Gasket renderer further down.)
  const W = 120;
  const H = 120;
  const cx = W / 2;
  const cy = H / 2;
  const circleColors = [
    "rgba(255,122,182,0.95)", // outer / rose
    "rgba(125,243,255,0.95)", // cyan
    "rgba(179,136,255,0.95)", // violet
    "rgba(255,209,102,0.95)", // amber
  ];
  const radii = curvatures.map((k, i) => {
    const r = 1 / Math.max(Math.abs(k), TINY);
    return { r, k, color: circleColors[i % circleColors.length]! };
  });
  // Normalise so the largest |1/k| maps to half the box.
  const maxR = Math.max(...radii.map((c) => c.r), 1);
  const scale = (W * 0.4) / maxR;

  // Coordinate hints. The outer (negative-k) circle is centred. Two interior
  // circles are placed left/right on a diameter. The fourth, if present, sits
  // above the centre, tangent to the two interior ones.
  const neg = radii.findIndex((c) => c.k < 0);
  const innerIdx = radii.map((_, i) => i).filter((i) => i !== neg);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden="true">
      <rect width={W} height={H} fill={palette.canvas.bg} rx={8} />
      {radii.map((c, i) => {
        const rPx = c.r * scale;
        let x = cx;
        let y = cy;
        if (i === neg) {
          // outer
        } else {
          const idx = innerIdx.indexOf(i);
          if (innerIdx.length === 3) {
            // three interior circles: left, right, top
            if (idx === 0) x = cx - rPx * 0.9;
            else if (idx === 1) x = cx + rPx * 0.9;
            else {
              x = cx;
              y = cy - rPx * 1.1;
            }
          } else if (innerIdx.length === 4) {
            // four interior circles: left, right, top, bottom (rare)
            if (idx === 0) x = cx - rPx * 0.9;
            else if (idx === 1) x = cx + rPx * 0.9;
            else if (idx === 2) {
              x = cx;
              y = cy - rPx * 1.1;
            } else {
              x = cx;
              y = cy + rPx * 1.1;
            }
          }
        }
        const isHi = highlight === i;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={Math.max(2, rPx)}
            fill="none"
            stroke={c.color}
            strokeWidth={isHi ? 2.4 : 1.4}
            opacity={isHi ? 1 : 0.85}
          />
        );
      })}
    </svg>
  );
}

export function ApollonianDescartes({
  caption,
  inputsLabel,
  solutionsLabel,
  invalidLabel,
  presetLabel,
  plusLabel,
  minusLabel,
  noteText,
}: Props) {
  const [k1, setK1] = useState(-1);
  const [k2, setK2] = useState(2);
  const [k3, setK3] = useState(2);

  const result = useMemo(() => {
    const sum = k1 + k2 + k3;
    const inner = k1 * k2 + k2 * k3 + k3 * k1;
    if (inner < 0) {
      return { valid: false as const };
    }
    const root = 2 * Math.sqrt(inner);
    return {
      valid: true as const,
      kPlus: sum + root,
      kMinus: sum - root,
      inner,
      sum,
      root,
    };
  }, [k1, k2, k3]);

  const applyPreset = (p: Triple) => {
    setK1(p.k1);
    setK2(p.k2);
    setK3(p.k3);
  };

  const fmt = (n: number) => {
    if (!Number.isFinite(n)) return "∞";
    if (Math.abs(n - Math.round(n)) < 1e-9) return `${Math.round(n)}`;
    return n.toFixed(3);
  };

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
        {/* Inputs */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {inputsLabel}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["k₁", k1, setK1],
                ["k₂", k2, setK2],
                ["k₃", k3, setK3],
              ] as const
            ).map(([label, val, setter]) => (
              <label key={label} className="block">
                <span className="font-mono text-[10px] text-signal-rose">{label}</span>
                <input
                  type="number"
                  value={val}
                  step={1}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (Number.isFinite(v)) setter(v);
                    else setter(0);
                  }}
                  className="hairline mt-1 w-full rounded-md border bg-ink-950 px-2 py-1.5 font-mono text-sm text-ink-100 focus:border-signal-rose/70 focus:outline-none"
                />
              </label>
            ))}
          </div>
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {presetLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.values)}
                  className="hairline rounded-md border px-2 py-1 font-mono text-[10px] text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seed preview */}
        <div className="hidden flex-col items-center gap-2 md:flex">
          <div className="w-[120px]">
            <MiniSeed curvatures={[k1, k2, k3]} />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
            seed triple
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {solutionsLabel}
          </div>
          {result.valid ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-md border border-signal-rose/30 bg-signal-rose/5 px-3 py-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-signal-rose">
                  {plusLabel}
                </div>
                <div className="math-italic text-xl text-ink-100">k₄ = {fmt(result.kPlus)}</div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md border border-signal-rose/30 bg-signal-rose/5 px-3 py-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-signal-rose">
                  {minusLabel}
                </div>
                <div className="math-italic text-xl text-ink-100">k₄ = {fmt(result.kMinus)}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-signal-rose/30 bg-signal-rose/5 px-3 py-3 text-sm text-signal-rose">
              {invalidLabel}
            </div>
          )}
        </div>
      </div>

      <p className="hairline border-t pt-3 text-xs leading-relaxed text-ink-400">{noteText}</p>
    </div>
  );
}
