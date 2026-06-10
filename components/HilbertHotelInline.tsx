"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { palette } from "@/lib/visual/palette";

// Inline Hilbert-hotel scenario picker + animated shifter, sized ~360x280.
// Renders 12 visible rooms with a "…" tail and animates the four canonical
// scenarios: one new guest (n → n+1), k new guests (n → n+k), ℵ₀ new
// guests (n → 2n, odd rooms freed), and ℵ₀ buses × ℵ₀ guests (existing
// guest n → 2ⁿ, bus k passenger m → pₖᵐ — the k-th odd prime raised to m).
// The animation is purely visual: after a short staged delay the rooms
// reflect the new mapping.

type Scenario = "one" | "k" | "infinite" | "buses";

interface Props {
  caption: string;
  oneLabel: string;
  kLabel: string;
  infiniteLabel: string;
  busesLabel: string;
  resetLabel: string;
  formulaLabel: string;
  hintLabel: string;
  newGuestLabel: string;
  existingGuestLabel: string;
  busGuestLabel: string;
  // Shown only in the buses scenario — explains why some rooms stay empty.
  gapNoteLabel: string;
}

const ROOMS = 12;
const K_SHIFT = 3;
const BUS_PRIMES = [3, 5, 7];

type GuestKind = "existing" | "new" | "bus";

interface Guest {
  id: string;
  kind: GuestKind;
  origin: number; // original room (for existing), index (for new), or prime base * power (for bus)
  bus?: number;
  passenger?: number;
  color: string;
}

const EXISTING = "#cdd6f4";
const NEW = palette.signal.cyan;
// One hue per bus so passengers from different buses stay distinguishable.
// Deliberately avoids amber (the shift pulse) and cyan (new guests) so every
// colour in the widget means exactly one thing. Bus 1 = rose keeps the hint
// copy ("rose is a bus passenger") true.
const BUS_COLORS = [palette.signal.rose, palette.signal.violet, "#a6e3a1"];

function initialRooms(): (Guest | null)[] {
  return Array.from({ length: ROOMS }, (_, i) => ({
    id: `e-${i + 1}`,
    kind: "existing",
    origin: i + 1,
    color: EXISTING,
  }));
}

const FORMULAS: Record<Scenario, string> = {
  one: "n → n + 1",
  k: `n → n + ${K_SHIFT}`,
  infinite: "n → 2n  ·  odd rooms ← new",
  buses: "guest n → 2ⁿ  ·  bus k pass. m → pₖᵐ",
};

export function HilbertHotelInline({
  caption,
  oneLabel,
  kLabel,
  infiniteLabel,
  busesLabel,
  resetLabel,
  formulaLabel,
  hintLabel,
  newGuestLabel,
  existingGuestLabel,
  busGuestLabel,
  gapNoteLabel,
}: Props) {
  const [scenario, setScenario] = useState<Scenario>("one");
  const [rooms, setRooms] = useState<(Guest | null)[]>(initialRooms);
  const [highlight, setHighlight] = useState<Record<number, "shift" | "new" | "bus">>({});
  const timeoutsRef = useRef<number[]>([]);

  // Clear pending animations on unmount or scenario change
  function clearTimers() {
    for (const t of timeoutsRef.current) window.clearTimeout(t);
    timeoutsRef.current = [];
  }
  useEffect(() => () => clearTimers(), []);

  function applyScenario(sc: Scenario) {
    clearTimers();
    setScenario(sc);
    const fresh = initialRooms();
    setRooms(fresh);
    setHighlight({});

    // Stage the animation: first highlight the "shift" pattern, then place
    // the new guests / bus passengers after a short delay.
    if (sc === "one") {
      const shifted: (Guest | null)[] = Array(ROOMS).fill(null);
      for (let i = 0; i < ROOMS - 1; i++) shifted[i + 1] = fresh[i];
      const hl: Record<number, "shift" | "new" | "bus"> = {};
      for (let i = 0; i < ROOMS; i++) hl[i] = "shift";
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setRooms(shifted);
          setHighlight(hl);
        }, 200),
      );
      timeoutsRef.current.push(
        window.setTimeout(() => {
          const placed = [...shifted];
          placed[0] = { id: "n-1", kind: "new", origin: 1, color: NEW };
          setRooms(placed);
          setHighlight({ 0: "new" });
        }, 800),
      );
      timeoutsRef.current.push(window.setTimeout(() => setHighlight({}), 1500));
    } else if (sc === "k") {
      const shifted: (Guest | null)[] = Array(ROOMS).fill(null);
      for (let i = 0; i < ROOMS; i++) {
        const tgt = i + K_SHIFT;
        if (tgt < ROOMS) shifted[tgt] = fresh[i];
      }
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setRooms(shifted);
          const hl: Record<number, "shift" | "new" | "bus"> = {};
          for (let i = 0; i < ROOMS; i++) hl[i] = "shift";
          setHighlight(hl);
        }, 200),
      );
      timeoutsRef.current.push(
        window.setTimeout(() => {
          const placed = [...shifted];
          for (let i = 0; i < K_SHIFT; i++) {
            placed[i] = { id: `n-${i + 1}`, kind: "new", origin: i + 1, color: NEW };
          }
          setRooms(placed);
          const hl: Record<number, "shift" | "new" | "bus"> = {};
          for (let i = 0; i < K_SHIFT; i++) hl[i] = "new";
          setHighlight(hl);
        }, 800),
      );
      timeoutsRef.current.push(window.setTimeout(() => setHighlight({}), 1500));
    } else if (sc === "infinite") {
      // n → 2n: existing guest in room i+1 goes to 2(i+1) (1-indexed)
      const shifted: (Guest | null)[] = Array(ROOMS).fill(null);
      for (let i = 0; i < ROOMS; i++) {
        const tgt = 2 * (i + 1) - 1; // 0-indexed target
        if (tgt < ROOMS) shifted[tgt] = fresh[i];
      }
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setRooms(shifted);
          const hl: Record<number, "shift" | "new" | "bus"> = {};
          for (let i = 0; i < ROOMS; i++) if (i % 2 === 1) hl[i] = "shift";
          setHighlight(hl);
        }, 200),
      );
      timeoutsRef.current.push(
        window.setTimeout(() => {
          const placed = [...shifted];
          let cnt = 1;
          for (let i = 0; i < ROOMS; i += 2) {
            placed[i] = { id: `n-${cnt}`, kind: "new", origin: cnt, color: NEW };
            cnt++;
          }
          setRooms(placed);
          const hl: Record<number, "shift" | "new" | "bus"> = {};
          for (let i = 0; i < ROOMS; i += 2) hl[i] = "new";
          setHighlight(hl);
        }, 900),
      );
      timeoutsRef.current.push(window.setTimeout(() => setHighlight({}), 1700));
    } else if (sc === "buses") {
      // existing guest n → 2^n; bus b passenger p → primes[b]^p
      const next: (Guest | null)[] = Array(ROOMS).fill(null);
      for (let n = 1; n <= ROOMS; n++) {
        const tgt = Math.pow(2, n) - 1; // 0-indexed
        if (tgt < ROOMS) {
          next[tgt] = { id: `e-${n}`, kind: "existing", origin: n, color: EXISTING };
        }
      }
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setRooms(next);
          const hl: Record<number, "shift" | "new" | "bus"> = {};
          // every power of 2 within window
          [1, 3, 7].forEach((idx) => (hl[idx] = "shift")); // 2,4,8 (0-indexed: 1,3,7)
          setHighlight(hl);
        }, 200),
      );
      timeoutsRef.current.push(
        window.setTimeout(() => {
          const placed = [...next];
          const hl: Record<number, "shift" | "new" | "bus"> = {};
          BUS_PRIMES.forEach((prime, bi) => {
            for (let p = 1; p <= ROOMS; p++) {
              const tgt = Math.pow(prime, p) - 1;
              if (tgt < ROOMS && !placed[tgt]) {
                placed[tgt] = {
                  id: `b${bi + 1}-${p}`,
                  kind: "bus",
                  origin: prime,
                  bus: bi + 1,
                  passenger: p,
                  color: BUS_COLORS[bi % BUS_COLORS.length],
                };
                hl[tgt] = "bus";
              }
            }
          });
          setRooms(placed);
          setHighlight(hl);
        }, 900),
      );
      timeoutsRef.current.push(window.setTimeout(() => setHighlight({}), 1900));
    }
  }

  function reset() {
    clearTimers();
    setRooms(initialRooms());
    setHighlight({});
  }

  const occupied = useMemo(() => rooms.filter(Boolean).length, [rooms]);

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
          {caption}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
          {formulaLabel} · {FORMULAS[scenario]}
        </div>
      </div>

      {/* Room strip */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-end gap-1.5">
          {rooms.map((g, i) => {
            const hl = highlight[i];
            const border =
              hl === "new"
                ? "border-signal-cyan/80 bg-signal-cyan/15"
                : hl === "shift"
                  ? "border-signal-amber/60 bg-signal-amber/10"
                  : hl === "bus"
                    ? "border-signal-rose/60 bg-signal-rose/10"
                    : g
                      ? "border-ink-300/30 bg-ink-900/80"
                      : "border-ink-700/40 bg-ink-900/30"; // empty room — neutral grey, not a colour that means something
            const title = g
              ? g.kind === "existing"
                ? `${existingGuestLabel} #${g.origin}`
                : g.kind === "bus"
                  ? `${busGuestLabel} ${g.bus}·${g.passenger}`
                  : `${newGuestLabel} #${g.origin}`
              : "";
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`relative h-10 w-7 rounded-md border transition-all duration-500 ${border}`}
                  title={title}
                >
                  {g && (
                    <div
                      className="absolute inset-1 flex items-center justify-center rounded-sm font-mono text-[9px] font-bold text-ink-950"
                      style={{ background: g.color }}
                    >
                      {g.kind === "bus" ? `${g.bus}·${g.passenger}` : g.origin}
                    </div>
                  )}
                  {/* In the buses scenario, mark the deliberately-empty
                      (non-prime-power) rooms so the gaps read as intentional
                      rather than as a broken render. */}
                  {!g && scenario === "buses" && (
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-ink-600">
                      ∅
                    </div>
                  )}
                </div>
                <div className="font-mono text-[9px] text-ink-400">{i + 1}</div>
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-1 self-end pl-2">
            <div className="flex h-10 w-6 items-end justify-center font-mono text-lg text-ink-400">
              …
            </div>
            <div className="font-mono text-[9px] text-ink-500">ℵ₀</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyScenario("one")}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            scenario === "one"
              ? "border-signal-rose/70 bg-signal-rose/15 text-signal-rose"
              : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
          }`}
        >
          {oneLabel}
        </button>
        <button
          type="button"
          onClick={() => applyScenario("k")}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            scenario === "k"
              ? "border-signal-rose/70 bg-signal-rose/15 text-signal-rose"
              : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
          }`}
        >
          {kLabel}
        </button>
        <button
          type="button"
          onClick={() => applyScenario("infinite")}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            scenario === "infinite"
              ? "border-signal-rose/70 bg-signal-rose/15 text-signal-rose"
              : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
          }`}
        >
          {infiniteLabel}
        </button>
        <button
          type="button"
          onClick={() => applyScenario("buses")}
          className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
            scenario === "buses"
              ? "border-signal-rose/70 bg-signal-rose/15 text-signal-rose"
              : "hairline text-ink-200 hover:border-signal-rose/40 hover:text-signal-rose"
          }`}
        >
          {busesLabel}
        </button>
        <button
          type="button"
          onClick={reset}
          className="hairline ml-auto rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
        >
          {resetLabel}
        </button>
      </div>

      <p className="hairline border-t pt-3 text-[11px] leading-relaxed text-ink-300">{hintLabel}</p>

      {scenario === "buses" && (
        <p className="text-[11px] leading-relaxed text-ink-400">{gapNoteLabel}</p>
      )}

      {/* Legend — scenario-aware. The buses case colour-codes per bus and has
          no "new" guests; the other scenarios have new guests and no buses.
          Showing all swatches at once would always mislabel half the tiles. */}
      <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-ink-300">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: EXISTING }} />
          {existingGuestLabel}
        </span>
        {scenario === "buses" ? (
          BUS_COLORS.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
              {busGuestLabel} {i + 1}
            </span>
          ))
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: NEW }} />
            {newGuestLabel}
          </span>
        )}
        <span className="ml-auto text-ink-400">
          {occupied} / {ROOMS}
        </span>
      </div>
    </div>
  );
}
