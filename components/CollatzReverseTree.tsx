"use client";

import { useMemo, useState } from "react";
import { palette } from "@/lib/visual/palette";

// Inline reverse-Collatz coral tree visualiser. Starting from 1, we run the
// rule backwards: every node n has parent 2n (always) and, if (n − 1) is a
// positive multiple of 3 and the resulting m = (n − 1) / 3 is an odd integer
// strictly greater than 1, a second parent m. (The "m > 1" guard breaks the
// trivial 1 → 4 → 2 → 1 cycle so the tree stays a tree.) Drawn radially as
// a coral fan outward from 1 at the centre.

interface Props {
  caption: string;
  depthLabel: string;
  nodeLabel: string;
  hint: string;
  maxDepth?: number;
}

interface TreeNode {
  value: number;
  depth: number;
  children: TreeNode[];
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

const SIZE = 360;
const CENTER = SIZE / 2;

function buildTree(maxDepth: number): { nodes: TreeNode[]; edges: Array<[TreeNode, TreeNode]> } {
  const root: TreeNode = { value: 1, depth: 0, children: [], x: 0, y: 0 };
  const nodes: TreeNode[] = [root];
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const node = queue.shift()!;
    if (node.depth >= maxDepth) continue;

    const parents: number[] = [];
    // doubling parent: always valid
    parents.push(node.value * 2);
    // odd parent: (n - 1) / 3, must be positive integer odd and > 1
    if (node.value > 1 && (node.value - 1) % 3 === 0) {
      const m = (node.value - 1) / 3;
      if (m > 1 && m % 2 === 1) parents.push(m);
    }

    for (const p of parents) {
      const child: TreeNode = {
        value: p,
        depth: node.depth + 1,
        children: [],
        x: 0,
        y: 0,
      };
      node.children.push(child);
      nodes.push(child);
      queue.push(child);
    }
  }

  // Radial layout: leaves spread around the circle, each subtree gets a
  // wedge proportional to its leaf-count. Root sits at the centre.
  const countLeaves = (n: TreeNode): number => {
    if (n.children.length === 0) return 1;
    let sum = 0;
    for (const c of n.children) sum += countLeaves(c);
    return sum;
  };

  const _totalLeaves = countLeaves(root);
  const radiusStep = (CENTER - 18) / Math.max(1, maxDepth);

  const layout = (n: TreeNode, a0: number, a1: number) => {
    const aMid = (a0 + a1) / 2;
    const r = n.depth * radiusStep;
    n.x = CENTER + Math.cos(aMid) * r;
    n.y = CENTER + Math.sin(aMid) * r;
    let acc = a0;
    for (const c of n.children) {
      const leaves = countLeaves(c);
      const share = (leaves / countLeaves(n)) * (a1 - a0);
      layout(c, acc, acc + share);
      acc += share;
    }
  };

  // start angle at the top, sweep clockwise
  layout(root, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);

  const edges: Array<[TreeNode, TreeNode]> = [];
  const walk = (n: TreeNode) => {
    for (const c of n.children) {
      edges.push([n, c]);
      walk(c);
    }
  };
  walk(root);

  return { nodes, edges };
}

const PALETTE = [palette.signal.rose, palette.signal.amber, palette.signal.cyan, palette.signal.violet];

export function CollatzReverseTree({ caption, depthLabel, nodeLabel, hint, maxDepth = 14 }: Props) {
  const [depth, setDepth] = useState(8);

  const { nodes, edges } = useMemo(() => buildTree(depth), [depth]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="flex justify-center md:col-span-7">
          <div className="hairline overflow-hidden rounded-xl border bg-ink-950">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              width="100%"
              style={{ maxWidth: SIZE, display: "block" }}
              aria-label="Reverse Collatz coral tree"
            >
              <rect x={0} y={0} width={SIZE} height={SIZE} fill={palette.canvas.bg} />
              {edges.map(([a, b], i) => {
                const colour = PALETTE[Math.min(PALETTE.length - 1, b.depth % PALETTE.length)];
                const opacity = 0.35 + 0.5 * (1 - b.depth / Math.max(1, depth));
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={colour}
                    strokeOpacity={opacity}
                    strokeWidth={Math.max(0.5, 1.4 - b.depth * 0.06)}
                  />
                );
              })}
              {nodes.map((n, i) => {
                const colour = PALETTE[Math.min(PALETTE.length - 1, n.depth % PALETTE.length)];
                const r = n.depth === 0 ? 4.5 : Math.max(0.9, 2.4 - n.depth * 0.12);
                return (
                  <circle
                    key={i}
                    cx={n.x}
                    cy={n.y}
                    r={r}
                    fill={colour}
                    fillOpacity={n.depth === 0 ? 1 : 0.85}
                  />
                );
              })}
              <text
                x={CENTER}
                y={CENTER + 16}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize={10}
                fill="#e8eaf2"
              >
                1
              </text>
            </svg>
          </div>
        </div>
        <div className="space-y-4 md:col-span-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{depthLabel}</span>
              <span className="text-signal-rose">{depth}</span>
            </div>
            <input
              type="range"
              min={1}
              max={maxDepth}
              step={1}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full accent-signal-rose"
            />
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{nodeLabel}</span>
              <span className="text-signal-cyan">{nodes.length.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}
