"use client";

import { useEffect, useRef, useState } from "react";
import { palette } from "@/lib/visual/palette";

// Signature artefact for the Halting page. A living Turing-machine tape:
// cells stream right, a head reads + writes glyphs as it passes. Once in a
// while it visibly stalls (the "does it halt?" punctuation), then resumes.
// Reduced motion: shows a static snapshot of the tape.

const SYMS = ["0", "1", "□", "1", "0", "0", "1", "□", "1"];

interface Cell {
  sym: string;
  highlighted: boolean;
}

const CELLS = 21;
const TICK_INTERVAL_MS = 520;
const HALT_DISPLAY_MS = 1100;
const HALT_PROBABILITY = 1 / 14;
const SHIFT_PROBABILITY = 0.35;
const HEAD_MOVE_PROBABILITY = 0.5; // on non-halt, non-shift ticks: drift the head a cell

export function HaltingTapeHero() {
  const [reduced, setReduced] = useState(false);
  const [tape, setTape] = useState<Cell[]>(() =>
    Array.from({ length: CELLS }, (_, i) => ({
      sym: SYMS[i % SYMS.length],
      highlighted: false,
    })),
  );
  const [headIdx, setHeadIdx] = useState(Math.floor(CELLS / 2));
  // Mirror the head index so the rAF tick can read it without re-subscribing
  // the effect on every move.
  const headRef = useRef(headIdx);
  headRef.current = headIdx;
  const [halted, setHalted] = useState(false);
  const lastTickRef = useRef(0);
  // Track the pending "resume after halt" timeout so we can clear it on unmount.
  const haltTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = (now: number) => {
      if (now - lastTickRef.current > TICK_INTERVAL_MS) {
        lastTickRef.current = now;
        // 1 in 14 ticks: visible pause, the "does it halt?" beat
        if (Math.random() < HALT_PROBABILITY) {
          setHalted(true);
          haltTimeoutRef.current = window.setTimeout(() => setHalted(false), HALT_DISPLAY_MS);
        } else if (Math.random() < SHIFT_PROBABILITY) {
          // shift the tape one to the left occasionally
          setTape((t) => {
            const next = t.map((c) => ({ ...c, highlighted: false }));
            next.shift();
            next.push({ sym: pick(), highlighted: false });
            return next;
          });
        } else {
          // Otherwise the head travels and writes: drift it a cell (so it
          // visibly moves, matching the "MOVE" caption) then rewrite the cell
          // it now sits over. Compute the target from headRef so the rewritten
          // cell and the head marker land on the same index this frame.
          const moved = Math.random() < HEAD_MOVE_PROBABILITY;
          const dir = Math.random() < 0.5 ? -1 : 1;
          const nextHead = moved
            ? Math.min(CELLS - 1, Math.max(0, headRef.current + dir))
            : headRef.current;
          if (moved) setHeadIdx(nextHead);
          setTape((t) => {
            const next = t.map((c) => ({ ...c, highlighted: false }));
            next[nextHead] = { sym: pick(), highlighted: true };
            return next;
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (haltTimeoutRef.current !== null) window.clearTimeout(haltTimeoutRef.current);
    };
  }, [reduced]);

  const W = 800;
  const H = 220;
  const cellW = W / CELLS;
  const cellH = 64;
  const tapeY = (H - cellH) / 2;

  return (
    <figure
      className="hairline glass relative overflow-hidden rounded-2xl border"
      aria-label="A Turing-machine tape with a moving head: the symbols change as the head writes."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="ht-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.ink[950]} stopOpacity="1" />
            <stop offset="8%" stopColor={palette.ink[950]} stopOpacity="0" />
            <stop offset="92%" stopColor={palette.ink[950]} stopOpacity="0" />
            <stop offset="100%" stopColor={palette.ink[950]} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Tape cells */}
        <g>
          {tape.map((c, i) => {
            const x = i * cellW;
            return (
              <g key={i} transform={`translate(${x} ${tapeY})`}>
                <rect
                  width={cellW - 2}
                  height={cellH}
                  rx="3"
                  fill={c.highlighted ? "rgba(125,243,255,0.18)" : "rgba(15,18,28,0.85)"}
                  stroke="rgba(138,144,164,0.28)"
                  strokeWidth="1"
                />
                <text
                  x={(cellW - 2) / 2}
                  y={cellH / 2 + 8}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="22"
                  fill={c.highlighted ? palette.signal.cyan : palette.ink[100]}
                  opacity={c.sym === "□" ? 0.45 : 0.95}
                >
                  {c.sym}
                </text>
              </g>
            );
          })}
        </g>

        {/* Soft fade on the edges so cells appear to scroll out of view */}
        <rect width={W} height={H} fill="url(#ht-fade)" pointerEvents="none" />

        {/* Read/write head */}
        <g transform={`translate(${headIdx * cellW + cellW / 2} ${tapeY - 10})`}>
          <polygon
            points="-9,-14 9,-14 0,0"
            fill={halted ? palette.signal.rose : palette.signal.cyan}
            opacity="0.9"
          />
          <text
            y={-22}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="2.4"
            fill={halted ? palette.signal.rose : palette.signal.cyan}
            opacity="0.85"
          >
            {halted ? "HALT?" : "HEAD"}
          </text>
        </g>

        {/* Caption */}
        <text
          x={W / 2}
          y={H - 12}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="3.2"
          fill="rgba(234,236,243,0.45)"
        >
          {halted ? "DOES IT EVER STOP?" : "STEP · WRITE · MOVE"}
        </text>
      </svg>
    </figure>
  );
}

function pick(): string {
  return SYMS[Math.floor(Math.random() * SYMS.length)];
}
