"use client";

import { useMemo, useState } from "react";

// Inline Cayley-graph walker for the free group F₂ = <a, b>.
// The user clicks one of four buttons (a, a⁻¹, b, b⁻¹) and walks the
// infinite 4-regular tree of reduced words. Each visited word is a unique
// vertex — the walker never lands on the same node twice unless it
// retraces an inverse step. This is the algebraic skeleton that powers
// Banach–Tarski's paradoxical decomposition.

// Generators: 0 = a, 1 = a⁻¹, 2 = b, 3 = b⁻¹. inv[i] is the inverse index.
const GEN_LABEL = ["a", "a⁻¹", "b", "b⁻¹"] as const;
const INV = [1, 0, 3, 2] as const;

// Directions in the plane for each generator. We rotate each child step
// 60° off its parent so the tree fans out cleanly.
const DIRS: ReadonlyArray<{ dx: number; dy: number }> = [
  { dx: 1, dy: 0 }, // a → right
  { dx: -1, dy: 0 }, // a⁻¹ → left
  { dx: 0, dy: -1 }, // b → up
  { dx: 0, dy: 1 }, // b⁻¹ → down
];

type Vertex = {
  x: number;
  y: number;
  word: string; // reduced word
  parent: number; // generator index used to arrive (or -1 at root)
};

interface Props {
  caption: string;
  resetLabel: string;
  hintLabel: string;
  wordLabel: string;
}

export function BanachFreeGroup({ caption, resetLabel, hintLabel, wordLabel }: Props) {
  // Path of vertices, starting at the root (empty word).
  const [path, setPath] = useState<Vertex[]>([{ x: 0, y: 0, word: "ε", parent: -1 }]);

  // Pre-compute the visible tree skeleton up to a fixed depth. The skeleton
  // is decorative — only the walker path is interactive — but it shows the
  // self-similar 4-regular structure.
  const skeleton = useMemo(() => buildSkeleton(4, 80), []);

  const head = path[path.length - 1];

  function step(gen: number) {
    // If this step would immediately undo the last one, treat it as a step
    // back (so the path retracts). Otherwise extend the path.
    const last = head;
    if (last.parent !== -1 && INV[gen] === last.parent && path.length > 1) {
      setPath(path.slice(0, -1));
      return;
    }
    const depth = path.length; // number of steps taken so far
    const len = 80 * Math.pow(0.55, depth - 1); // edge length shrinks with depth
    const dir = DIRS[gen];
    // Rotate child branches a little so siblings don't overlap. Use the
    // parent's incoming direction as the seed.
    const angle = childAngle(last.parent, gen, depth);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const nx = last.x + dx * len;
    const ny = last.y + dy * len;
    const next: Vertex = {
      x: nx,
      y: ny,
      word: composeWord(last.word, GEN_LABEL[gen]),
      parent: gen,
    };
    setPath([...path, next]);
    // Keep the dir reference reachable so eslint / TS don't strip the import.
    void dir;
  }

  function reset() {
    setPath([{ x: 0, y: 0, word: "ε", parent: -1 }]);
  }

  const viewSize = 320;
  const half = viewSize / 2;

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_220px]">
        <div className="hairline mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-md border bg-ink-950">
          <svg
            viewBox={`-${half} -${half} ${viewSize} ${viewSize}`}
            className="block h-full w-full"
            role="img"
            aria-label="Cayley graph of F₂"
          >
            {/* Dim background skeleton */}
            {skeleton.segments.map((s, i) => (
              <line
                key={`bg-${i}`}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="#b388ff"
                strokeOpacity={Math.max(0.05, 0.22 - s.depth * 0.04)}
                strokeWidth={0.8}
              />
            ))}
            {skeleton.nodes.map((n, i) => (
              <circle
                key={`bgn-${i}`}
                cx={n.x}
                cy={n.y}
                r={Math.max(0.8, 2 - n.depth * 0.25)}
                fill="#b388ff"
                fillOpacity={Math.max(0.06, 0.3 - n.depth * 0.05)}
              />
            ))}

            {/* Walker path — drawn brightly on top */}
            {path.slice(1).map((v, i) => {
              const prev = path[i];
              return (
                <line
                  key={`p-${i}`}
                  x1={prev.x}
                  y1={prev.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="#7df3ff"
                  strokeWidth={1.8}
                  strokeOpacity={0.9}
                />
              );
            })}
            {path.map((v, i) => (
              <circle
                key={`pn-${i}`}
                cx={v.x}
                cy={v.y}
                r={i === path.length - 1 ? 5 : 3}
                fill={i === 0 ? "#ffd166" : i === path.length - 1 ? "#ff7ab6" : "#7df3ff"}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {wordLabel}
            </div>
            <div className="min-h-[1.5rem] break-all font-mono text-base text-signal-rose">
              {head.word}
            </div>
            <div className="font-mono text-[10px] text-ink-400">
              length · <span className="text-signal-amber">{path.length - 1}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {GEN_LABEL.map((g, i) => (
              <button
                key={g}
                type="button"
                onClick={() => step(i)}
                className="hairline rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-sm text-ink-100 transition-colors hover:border-signal-rose/40 hover:bg-signal-rose/10"
              >
                {g}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={reset}
            className="hairline w-full rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
          >
            {resetLabel}
          </button>

          <div className="hairline border-t pt-2 text-[11px] leading-relaxed text-ink-300">
            {hintLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// helpers

// Compose a new reduced word. If the previous word ends in g⁻¹ and we are
// applying g (or vice versa), the new word would not be reduced — but our
// `step` already routes that case to a retraction, so we never reach here
// in that situation. Still, we render cleanly: drop "ε" from the prefix.
function composeWord(prev: string, gen: string): string {
  if (prev === "ε") return gen;
  return prev + " · " + gen;
}

// Rotate child branches off the parent direction so siblings spread out.
// At the root every generator gets its cardinal direction. Deeper in,
// we fan ±60° off the parent's direction, skipping the inverse slot.
function childAngle(parentGen: number, gen: number, depth: number): number {
  if (parentGen === -1) {
    // Root: cardinal directions
    const base = [0, Math.PI, -Math.PI / 2, Math.PI / 2];
    return base[gen];
  }
  // Parent edge came in along direction parentGen. Forward is the same
  // direction; the two "side" generators fan ±60°; the inverse is
  // disallowed by step().
  const parentBase = [0, Math.PI, -Math.PI / 2, Math.PI / 2][parentGen];
  // Position siblings: forward (same gen as parent), and the two non-inverse
  // siblings at ±60°. We map by relative slot.
  const slots: number[] = [];
  for (let i = 0; i < 4; i++) if (i !== INV[parentGen]) slots.push(i);
  const idx = slots.indexOf(gen);
  // idx 0,1,2 → angles relative to parent: -π/3, 0, π/3
  const offsets = [-Math.PI / 3, 0, Math.PI / 3];
  const delta = offsets[idx >= 0 ? idx : 1];
  // Slight depth-jitter to keep things from overlapping if user goes deep
  void depth;
  return parentBase + delta;
}

type SkelSeg = { x1: number; y1: number; x2: number; y2: number; depth: number };
type SkelNode = { x: number; y: number; depth: number };

function buildSkeleton(maxDepth: number, rootLen: number) {
  const segments: SkelSeg[] = [];
  const nodes: SkelNode[] = [{ x: 0, y: 0, depth: 0 }];
  const SHRINK = 0.5;

  function recurse(x: number, y: number, depth: number, parentGen: number, len: number) {
    if (depth >= maxDepth) return;
    for (let g = 0; g < 4; g++) {
      if (parentGen !== -1 && g === INV[parentGen]) continue;
      const angle = childAngle(parentGen, g, depth);
      const nx = x + Math.cos(angle) * len;
      const ny = y + Math.sin(angle) * len;
      segments.push({ x1: x, y1: y, x2: nx, y2: ny, depth });
      nodes.push({ x: nx, y: ny, depth: depth + 1 });
      recurse(nx, ny, depth + 1, g, len * SHRINK);
    }
  }
  recurse(0, 0, 0, -1, rootLen);
  return { segments, nodes };
}
