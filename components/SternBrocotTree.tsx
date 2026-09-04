"use client";

import { useMemo, useState } from "react";
import { palette } from "@/lib/visual/palette";

interface Props {
  caption: string;
  depthLabel: string;
  targetLabel: string;
  pathLabel: string;
  presets: Array<{ id: string; label: string; value: number }>;
}

interface Node {
  num: number;
  den: number;
  level: number;
  side: "L" | "R" | null;
  x: number; // 0..1 horizontal
}

// Walk the Stern-Brocot tree toward `target`, returning the sequence of
// mediants visited up to `depth` steps. Each step records L/R direction.
function walkPath(
  target: number,
  depth: number,
): Array<{ num: number; den: number; side: "L" | "R" | null }> {
  let lo_n = 0,
    lo_d = 1;
  let hi_n = 1,
    hi_d = 0;
  const out: Array<{ num: number; den: number; side: "L" | "R" | null }> = [
    { num: 1, den: 1, side: null },
  ];
  let med_n = 1,
    med_d = 1;
  for (let i = 0; i < depth; i++) {
    const val = med_n / med_d;
    if (Math.abs(val - target) < 1e-15) break;
    if (target < val) {
      hi_n = med_n;
      hi_d = med_d;
      out[out.length - 1]!.side = "L";
    } else {
      lo_n = med_n;
      lo_d = med_d;
      out[out.length - 1]!.side = "R";
    }
    med_n = lo_n + hi_n;
    med_d = lo_d + hi_d;
    if (!Number.isFinite(med_n) || !Number.isFinite(med_d) || med_d > 1e12) break;
    out.push({ num: med_n, den: med_d, side: null });
  }
  return out;
}

// Build the first `maxLevel` levels of the Stern–Brocot tree (one-sided,
// positive rationals). Returns nodes laid out horizontally by inorder index.
function buildTree(maxLevel: number): { nodes: Node[]; edges: Array<[number, number]> } {
  type Build = {
    num: number;
    den: number;
    level: number;
    idx: number;
    parent: number;
    side: "L" | "R" | null;
  };
  const items: Build[] = [];
  const edges: Array<[number, number]> = [];

  function recurse(
    lo_n: number,
    lo_d: number,
    hi_n: number,
    hi_d: number,
    level: number,
    parent: number,
    side: "L" | "R" | null,
  ): number {
    const med_n = lo_n + hi_n;
    const med_d = lo_d + hi_d;
    const myIdx = items.length;
    items.push({ num: med_n, den: med_d, level, idx: 0, parent, side });
    if (parent >= 0) edges.push([parent, myIdx]);
    if (level < maxLevel) {
      recurse(lo_n, lo_d, med_n, med_d, level + 1, myIdx, "L");
      recurse(med_n, med_d, hi_n, hi_d, level + 1, myIdx, "R");
    }
    return myIdx;
  }
  recurse(0, 1, 1, 0, 0, -1, null);

  // Inorder assignment of x positions per level.
  // Simple approach: sort all nodes by numerical value to give them x in [0,1].
  const sorted = [...items].sort((a, b) => a.num / a.den - b.num / b.den);
  sorted.forEach((it, i) => {
    it.idx = i;
  });
  const W = sorted.length;
  const nodes: Node[] = items.map((it) => ({
    num: it.num,
    den: it.den,
    level: it.level,
    side: it.side,
    x: W > 1 ? it.idx / (W - 1) : 0.5,
  }));
  return { nodes, edges };
}

export function SternBrocotTree({ caption, depthLabel, targetLabel, pathLabel, presets }: Props) {
  const [depth, setDepth] = useState(4);
  const [presetId, setPresetId] = useState(presets[0]?.id ?? "none");

  const preset = presets.find((p) => p.id === presetId) ?? null;
  const target = preset?.value;

  const { nodes, edges } = useMemo(() => buildTree(depth), [depth]);

  // Highlighted path nodes — set of "num/den" strings reached when walking
  // toward `target`, capped at depth+1 visited mediants (so it sits inside
  // the rendered tree).
  const path = useMemo(() => {
    if (target == null || !Number.isFinite(target) || target <= 0) return [];
    return walkPath(target, depth);
  }, [target, depth]);
  const pathKeys = useMemo(() => new Set(path.map((p) => `${p.num}/${p.den}`)), [path]);

  const W = 360;
  const H = 300;
  const padX = 16;
  const padTop = 22;
  const padBottom = 22;
  const innerW = W - 2 * padX;
  const rowH = depth >= 1 ? (H - padTop - padBottom) / depth : 0;

  // Project a tree node to canvas coords.
  const pos = (n: Node) => {
    const px = padX + n.x * innerW;
    const py = padTop + n.level * rowH;
    return { px, py };
  };

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {caption}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={caption}>
          <rect width={W} height={H} fill={palette.canvas.bg} rx={10} />
          {edges.map(([a, b], i) => {
            const A = pos(nodes[a]!);
            const B = pos(nodes[b]!);
            const aKey = `${nodes[a]!.num}/${nodes[a]!.den}`;
            const bKey = `${nodes[b]!.num}/${nodes[b]!.den}`;
            const onPath = pathKeys.has(aKey) && pathKeys.has(bKey);
            return (
              <line
                key={i}
                x1={A.px}
                y1={A.py}
                x2={B.px}
                y2={B.py}
                stroke={onPath ? palette.signal.amber : "rgba(125,243,255,0.25)"}
                strokeWidth={onPath ? 1.4 : 0.7}
              />
            );
          })}
          {nodes.map((n, i) => {
            const { px, py } = pos(n);
            const key = `${n.num}/${n.den}`;
            const onPath = pathKeys.has(key);
            // Font scales down with depth so deeper labels stay readable.
            const fs = Math.max(7, 11 - n.level * 0.8);
            return (
              <g key={i}>
                <circle
                  cx={px}
                  cy={py}
                  r={onPath ? 3.6 : 2.4}
                  fill={onPath ? palette.signal.amber : palette.signal.cyan}
                />
                <text
                  x={px}
                  y={py - 5}
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize={fs}
                  fill={onPath ? palette.signal.amber : "#e8eaf2"}
                >
                  {n.num}/{n.den}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {depthLabel}
              </div>
              <div className="font-mono text-[10px] text-signal-cyan">{depth}</div>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={depth}
              aria-label={depthLabel}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {targetLabel}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  className={`hairline rounded-md border px-2 py-1 text-left font-mono text-[11px] transition-colors ${
                    presetId === p.id
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "text-ink-200 hover:border-signal-cyan/40 hover:text-signal-cyan"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {path.length > 0 && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {pathLabel}
              </div>
              <div className="break-all font-mono text-[11px] leading-relaxed text-signal-amber">
                {path.map((p) => p.side ?? "·").join("")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
