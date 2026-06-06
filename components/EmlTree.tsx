"use client";

import { useMemo } from "react";
import type { EmlNode } from "@/lib/eml/ast";

interface NodeLayout {
  node: EmlNode;
  x: number;
  y: number;
  w: number;
  parentX?: number;
  parentY?: number;
}

// Compute a simple Reingold-Tilford-ish layout. Leaves take width 1; an eml
// node's width is the sum of its children's widths. Coordinates are in
// "slot" units; the SVG viewBox scales them.
function layout(root: EmlNode): { nodes: NodeLayout[]; width: number; height: number } {
  const nodes: NodeLayout[] = [];

  const measure = (n: EmlNode): number => {
    if (n.kind !== "eml") return 1;
    return measure(n.a) + measure(n.b);
  };

  let depth = 0;
  const visit = (n: EmlNode, x: number, y: number, parentX?: number, parentY?: number): number => {
    depth = Math.max(depth, y);
    const w = measure(n);
    nodes.push({ node: n, x: x + w / 2, y, w, parentX, parentY });
    if (n.kind === "eml") {
      const wa = measure(n.a);
      visit(n.a, x, y + 1, x + w / 2, y);
      visit(n.b, x + wa, y + 1, x + w / 2, y);
    }
    return w;
  };

  const totalW = visit(root, 0, 0);
  return { nodes, width: totalW, height: depth + 1 };
}

export function EmlTree({ root, className }: { root: EmlNode; className?: string }) {
  const { nodes, width, height } = useMemo(() => layout(root), [root]);
  const cellW = 80;
  const cellH = 64;
  const padX = 40;
  const padY = 28;
  const W = Math.max(width * cellW, cellW) + padX * 2;
  const H = height * cellH + padY * 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="emlEdge" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#b388ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7df3ff" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="emlGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b388ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b388ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* edges */}
      {nodes.map((n, i) =>
        n.parentX !== undefined && n.parentY !== undefined ? (
          <path
            key={`e${i}`}
            d={`M ${padX + n.parentX * cellW} ${padY + n.parentY * cellH + 18}
                C ${padX + n.parentX * cellW} ${padY + (n.parentY + 0.5) * cellH},
                  ${padX + n.x * cellW} ${padY + (n.y - 0.5) * cellH},
                  ${padX + n.x * cellW} ${padY + n.y * cellH - 18}`}
            stroke="url(#emlEdge)"
            strokeWidth="1.4"
            fill="none"
          />
        ) : null,
      )}
      {/* nodes */}
      {nodes.map((n, i) => {
        const cx = padX + n.x * cellW;
        const cy = padY + n.y * cellH;
        if (n.node.kind === "eml") {
          return (
            <g key={`n${i}`}>
              <circle cx={cx} cy={cy} r={28} fill="url(#emlGlow)" />
              <circle
                cx={cx}
                cy={cy}
                r={16}
                fill="#0a0c12"
                stroke="#b388ff"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="#d6c2ff"
                letterSpacing="0.08em"
              >
                eml
              </text>
            </g>
          );
        }
        const label = n.node.kind === "one" ? "1" : n.node.kind === "z" ? "z" : "p";
        const stroke = n.node.kind === "one" ? "#ffd166" : n.node.kind === "z" ? "#7df3ff" : "#ff7ab6";
        return (
          <g key={`n${i}`}>
            <circle cx={cx} cy={cy} r={13} fill="#0a0c12" stroke={stroke} strokeOpacity="0.8" strokeWidth="1.1" />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontFamily="var(--font-serif)"
              fontStyle="italic"
              fontSize="16"
              fill={stroke}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
