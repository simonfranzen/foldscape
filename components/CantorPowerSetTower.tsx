"use client";

import { useState } from "react";
import { palette } from "@/lib/visual/palette";

// Visualisation of the power-set hierarchy. Cantor proved |𝒫(X)| > |X|
// for any set X — so iterating the power set forever gives an unending
// ladder of strictly larger infinities. We show eight rungs of the
// tower; each rung lists |X|, |𝒫(X)| and can be expanded to display a
// short note.

interface Rung {
  level: number;
  card: string; // cardinality label
  pretty: string; // pretty name
  note: string; // optional descriptive note (locale-provided through props)
}

interface Props {
  caption: string;
  hint: string;
  expandHint: string;
  rungs: Array<{ pretty: string; note: string }>; // localised rung labels (8 entries)
  ofLabel: string; // "of" or "von"
  hierarchyLabel: string;
}

// Cardinality labels are universal across locales — we use the standard
// mathematical notation, not translated copy.
const CARD_LABELS = ["ℵ₀", "2^ℵ₀", "2^(2^ℵ₀)", "2^(2^(2^ℵ₀))", "2^(2^(2^(2^ℵ₀)))", "⋯", "⋯", "⋯"];

// The set each rung actually names: rung 0 is ℕ itself, rung 1 is ℝ = 𝒫(ℕ),
// then iterated power sets. A rung at level ≥ 1 is the power set of the rung
// below it, so its expand note reads "𝒫 of <previous set>". Universal
// notation, not translated. Rung 0 is the base (ℵ₀ = |ℕ|), NOT a power set —
// Cantor's theorem is |𝒫(ℕ)| > |ℕ|, so labelling ℕ as a power set would
// contradict the very result this widget illustrates.
const SET_SYMBOLS = ["ℕ", "ℝ", "𝒫(ℝ)", "𝒫(𝒫(ℝ))", "𝒫³(ℝ)", "𝒫⁴(ℝ)", "𝒫⁵(ℝ)", "⋯"];

const COLORS = [
  palette.signal.cyan, // ℵ₀
  palette.signal.violet, // c
  palette.signal.amber,
  palette.signal.rose,
  palette.signal.cyan,
  palette.signal.violet,
  palette.signal.amber,
  palette.signal.rose,
];

export function CantorPowerSetTower({
  caption,
  hint,
  expandHint,
  rungs,
  ofLabel,
  hierarchyLabel,
}: Props) {
  const [open, setOpen] = useState<number | null>(0);

  const rungData: Rung[] = rungs.map((r, i) => ({
    level: i,
    card: CARD_LABELS[i] ?? "⋯",
    pretty: r.pretty,
    note: r.note,
  }));

  return (
    <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>

      <div className="space-y-2">
        {rungData.map((rung) => {
          const isOpen = open === rung.level;
          // Width scales with rung index — exponential intent, capped so
          // the visual stays inside the card. Bigger = "more elements".
          const widthPct = Math.min(20 + rung.level * 10, 100);
          const color = COLORS[rung.level % COLORS.length]!;
          return (
            <button
              key={rung.level}
              onClick={() => setOpen(isOpen ? null : rung.level)}
              aria-expanded={isOpen}
              className="hairline block w-full rounded-md border bg-ink-950/60 p-3 text-left transition-colors hover:border-signal-rose/40"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-10 shrink-0 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                  #{rung.level}
                </div>
                <div
                  className="h-3 shrink-0 rounded-full"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${color}55, ${color}aa)`,
                  }}
                  aria-hidden="true"
                />
                <div className="ml-auto flex shrink-0 items-baseline gap-3">
                  <span className="font-mono text-sm text-signal-rose">{rung.card}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                    {rung.pretty}
                  </span>
                </div>
              </div>
              {isOpen && (
                <div className="mt-3 border-t border-ink-700/40 pt-3 text-xs leading-relaxed text-ink-200">
                  {/* Rung 0 (ℵ₀ = |ℕ|) is the base of the tower, not a power
                      set of anything — only rungs ≥ 1 carry the "𝒫 of …" prefix. */}
                  {rung.level > 0 && (
                    <>
                      <span className="mr-1 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
                        𝒫
                      </span>
                      {ofLabel}
                      <span className="mx-1 font-mono text-ink-100">
                        {SET_SYMBOLS[rung.level - 1] ?? "⋯"}
                      </span>
                      ·{" "}
                    </>
                  )}
                  {rung.note}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="hairline rounded-md border bg-ink-950/60 p-3 text-center font-mono text-[11px] text-ink-200">
        <span className="text-signal-rose">{hierarchyLabel}</span>
        <span className="ml-2">ℵ₀ &lt; 2^ℵ₀ &lt; 2^(2^ℵ₀) &lt; ⋯</span>
      </div>

      <p className="text-xs leading-relaxed text-ink-300">{hint}</p>
      <p className="text-[10px] italic leading-relaxed text-ink-400">{expandHint}</p>
    </div>
  );
}
