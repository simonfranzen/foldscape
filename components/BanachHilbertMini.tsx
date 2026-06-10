"use client";

import { useState } from "react";
import { palette } from "@/lib/visual/palette";

// Mini Hilbert-hotel duplicator. We render 12 numbered rooms (truncating a
// genuinely infinite row with a "…" marker) and animate two famous moves:
// add one guest by shifting everyone +1, or double the guests by sending
// each guest n → 2n, which frees every odd-numbered room. The "more from
// the infinite" intuition is exactly what powers Banach–Tarski.

interface Props {
  caption: string;
  addOneLabel: string;
  doubleLabel: string;
  resetLabel: string;
  freeRoomsLabel: string;
  occupiedLabel: string;
  hintLabel: string;
}

const ROOMS = 12;

type Guest = { id: number; color: string };

function initialGuests(): (Guest | null)[] {
  return Array.from({ length: ROOMS }, (_, i) => ({
    id: i + 1,
    color: pickColor(i),
  }));
}

// Cycle through the four signal colours for visual variety among room guests.
const GUEST_COLORS = [
  palette.signal.cyan,
  palette.signal.violet,
  palette.signal.amber,
  palette.signal.rose,
] as const;

function pickColor(i: number): string {
  return GUEST_COLORS[i % GUEST_COLORS.length];
}

export function BanachHilbertMini({
  caption,
  addOneLabel,
  doubleLabel,
  resetLabel,
  freeRoomsLabel,
  occupiedLabel,
  hintLabel,
}: Props) {
  const [rooms, setRooms] = useState<(Guest | null)[]>(initialGuests);
  const [flash, setFlash] = useState<number[]>([]);
  const [nextId, setNextId] = useState(ROOMS + 1);

  function addOne() {
    // Shift everyone right by one. The guest in room ROOMS falls off into
    // the "…" tail (visually represented; mathematically they go to ROOM+1).
    const shifted: (Guest | null)[] = Array(ROOMS).fill(null);
    for (let i = 0; i < ROOMS - 1; i++) {
      shifted[i + 1] = rooms[i];
    }
    // New guest enters room 1
    shifted[0] = { id: nextId, color: palette.signal.rose };
    setRooms(shifted);
    setNextId(nextId + 1);
    setFlash([0]);
    window.setTimeout(() => setFlash([]), 600);
  }

  function addInfinite() {
    // Every guest in room n moves to room 2n. Visible window is 1..ROOMS, so
    // rooms 7..ROOMS hold guests originally in rooms 4..6 (n=4→8, 5→10, 6→12).
    // All odd rooms in the visible window are freed.
    const next: (Guest | null)[] = Array(ROOMS).fill(null);
    for (let i = 0; i < ROOMS; i++) {
      const guest = rooms[i];
      if (!guest) continue;
      const targetRoomNumber = (i + 1) * 2; // 1-indexed
      const targetIdx = targetRoomNumber - 1;
      if (targetIdx < ROOMS) next[targetIdx] = guest;
      // else: guest goes into the unseen tail past the visible window
    }
    setRooms(next);
    const freed: number[] = [];
    for (let i = 0; i < ROOMS; i++) if (!next[i]) freed.push(i);
    setFlash(freed);
    window.setTimeout(() => setFlash([]), 800);
  }

  function reset() {
    setRooms(initialGuests());
    setFlash([]);
    setNextId(ROOMS + 1);
  }

  const occupied = rooms.filter(Boolean).length;
  const free = ROOMS - occupied;

  return (
    <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {caption}
      </div>

      {/* Row of rooms */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-end gap-1.5">
          {rooms.map((guest, i) => {
            const isFlashing = flash.includes(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`relative h-12 w-10 rounded-md border transition-all duration-300 ${
                    isFlashing
                      ? "border-signal-amber bg-signal-amber/20"
                      : guest
                        ? "border-ink-300/30 bg-ink-900/80"
                        : "border-signal-rose/40 bg-signal-rose/5"
                  }`}
                >
                  {guest && (
                    <div
                      className="absolute inset-1 flex items-center justify-center rounded-sm font-mono text-[10px] font-bold text-ink-950 transition-all duration-300"
                      style={{ background: guest.color }}
                    >
                      {guest.id}
                    </div>
                  )}
                </div>
                <div className="font-mono text-[9px] text-ink-400">{i + 1}</div>
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-1 self-end pl-2">
            <div className="flex h-12 w-8 items-end justify-center font-mono text-lg text-ink-400">
              …
            </div>
            <div className="font-mono text-[9px] text-ink-500">∞</div>
          </div>
        </div>
      </div>

      {/* Controls + stats */}
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addOne}
            className="hairline rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-100 transition-colors hover:border-signal-rose/40 hover:bg-signal-rose/10"
          >
            {addOneLabel}
          </button>
          <button
            type="button"
            onClick={addInfinite}
            className="hairline rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-100 transition-colors hover:border-signal-rose/40 hover:bg-signal-rose/10"
          >
            {doubleLabel}
          </button>
          <button
            type="button"
            onClick={reset}
            className="hairline rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-rose/40 hover:text-signal-rose"
          >
            {resetLabel}
          </button>
        </div>
        <div className="flex gap-4 font-mono text-[11px]">
          <div className="text-ink-300">
            {occupiedLabel} · <span className="text-signal-cyan">{occupied}</span>
          </div>
          <div className="text-ink-300">
            {freeRoomsLabel} · <span className="text-signal-amber">{free}</span>
          </div>
        </div>
      </div>

      <p className="hairline border-t pt-3 text-[11px] leading-relaxed text-ink-300">{hintLabel}</p>
    </div>
  );
}
