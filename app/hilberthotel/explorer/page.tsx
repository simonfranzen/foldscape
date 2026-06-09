"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Scenario = "one" | "k" | "infinite" | "buses";

interface Guest {
  id: string;
  // Origin description: "g" for original guest, "n" for single new, "bus k pass m" etc.
  origin: "existing" | "new" | "bus";
  bus?: number; // 1..N (for bus origin); also reused as prime index in display
  index: number; // existing guest's room or bus passenger index
  room: number; // 1-based current room (0 = not yet checked in / lobby)
  color: string;
}

const VISIBLE_ROOMS = 64; // rooms 1..VISIBLE_ROOMS rendered as a grid
const ROOMS_PER_ROW = 8;
const OFF_SCREEN_ROOMS = 6; // "…" tail

// First 8 odd primes used as bus bases (k-th odd prime for bus k).
const BUS_PRIMES = [3, 5, 7, 11, 13, 17, 19, 23];

// One hue per bus. Deliberately excludes cyan (= NEW_GUEST_COLOR) so bus 1
// can never be mistaken for a new guest, and starts on rose to match bus 1 in
// the story-page widget (HilbertHotelInline). The first four show in the
// legend; the rest only ever appear as the higher buses' dots.
const BUS_COLORS = [
  "#ff7ab6", // rose       — bus 1
  "#b794f4", // violet     — bus 2
  "#86efac", // green      — bus 3
  "#ffd166", // amber      — bus 4
  "#fca5a5", // light rose — bus 5
  "#fcd34d", // yellow     — bus 6
  "#a5b4fc", // indigo     — bus 7
  "#fb923c", // orange     — bus 8
];

const EXISTING_COLOR = "#cdd6f4"; // soft white for original guests
const NEW_GUEST_COLOR = "#7df3ff"; // cyan — same accent as the page

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// Build the initial list of existing guests filling rooms 1..VISIBLE_ROOMS.
function makeExistingGuests(): Guest[] {
  const out: Guest[] = [];
  for (let n = 1; n <= VISIBLE_ROOMS; n++) {
    out.push({
      id: `g-${n}`,
      origin: "existing",
      index: n,
      room: n,
      color: EXISTING_COLOR,
    });
  }
  return out;
}

export default function HilbertHotelExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.hilberthotel;

  const [scenario, setScenario] = useState<Scenario>("one");
  const [k, setK] = useState(3);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6); // steps per second
  const [guests, setGuests] = useState<Guest[]>(() => makeExistingGuests());
  const [queue, setQueue] = useState<Guest[]>([]); // guests not yet placed
  const [highlightRooms, setHighlightRooms] = useState<Record<number, string>>({});

  // Reset whenever scenario or k changes
  useEffect(() => {
    resetScenario(scenario, k);
     
  }, [scenario, k]);

  function resetScenario(sc: Scenario, kk: number) {
    setPlaying(false);
    setStep(0);
    setHighlightRooms({});
    const existing = makeExistingGuests();
    setGuests(existing);

    if (sc === "one") {
      setQueue([
        {
          id: `new-${uid()}`,
          origin: "new",
          index: 1,
          room: 0,
          color: NEW_GUEST_COLOR,
        },
      ]);
    } else if (sc === "k") {
      const q: Guest[] = [];
      for (let i = 1; i <= kk; i++) {
        q.push({
          id: `new-${i}-${uid()}`,
          origin: "new",
          index: i,
          room: 0,
          color: NEW_GUEST_COLOR,
        });
      }
      setQueue(q);
    } else if (sc === "infinite") {
      // Queue the new guests that will occupy odd rooms 1..VISIBLE_ROOMS.
      const q: Guest[] = [];
      const oddCount = Math.ceil(VISIBLE_ROOMS / 2);
      for (let i = 1; i <= oddCount; i++) {
        q.push({
          id: `new-${i}-${uid()}`,
          origin: "new",
          index: i,
          room: 0,
          color: NEW_GUEST_COLOR,
        });
      }
      setQueue(q);
    } else if (sc === "buses") {
      // Bus passengers: one row per bus, several passengers each.
      const q: Guest[] = [];
      for (let b = 0; b < BUS_PRIMES.length; b++) {
        const prime = BUS_PRIMES[b];
        let m = 1;
        // Add as many passengers as fit into VISIBLE_ROOMS via prime^m.
        while (Math.pow(prime, m) <= VISIBLE_ROOMS) {
          q.push({
            id: `bus-${b + 1}-${m}-${uid()}`,
            origin: "bus",
            bus: b + 1,
            index: m,
            room: 0,
            color: BUS_COLORS[b % BUS_COLORS.length],
          });
          m++;
        }
      }
      setQueue(q);
    }
  }

  // Compute total steps in current scenario
  const totalSteps = useMemo(() => {
    if (scenario === "one") return VISIBLE_ROOMS + 1; // shift then place 1
    if (scenario === "k") return VISIBLE_ROOMS + k; // shift then place k
    if (scenario === "infinite") return VISIBLE_ROOMS + Math.ceil(VISIBLE_ROOMS / 2);
    if (scenario === "buses") {
      // existing relocation steps + total queued bus passengers
      const passengers = BUS_PRIMES.reduce((acc, p) => {
        let m = 1;
        let c = 0;
        while (Math.pow(p, m) <= VISIBLE_ROOMS) {
          m++;
          c++;
        }
        return acc + c;
      }, 0);
      return VISIBLE_ROOMS + passengers;
    }
    return 0;
  }, [scenario, k]);

  // Advance one step. Each setter is called once at the top level — no
  // setState calls nested inside another setState's updater — so React 18
  // strict-mode dev double-invocations don't append the same guest twice.
  function advance() {
    if (step >= totalSteps) return;
    const s = step + 1;
    applyStep(s);
    setStep(s);
  }

  function applyStep(s: number) {
    if (scenario === "one") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: fromRoom + 1 } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [fromRoom + 1]: "shift" });
      } else {
        const first = queue[0];
        if (!first) return;
        setGuests((gs) => [...gs, { ...first, room: 1 }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ 1: "new" });
      }
    } else if (scenario === "k") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: fromRoom + k } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [fromRoom + k]: "shift" });
      } else {
        const placeIdx = s - VISIBLE_ROOMS; // 1..k
        const first = queue[0];
        if (!first) return;
        setGuests((gs) => [...gs, { ...first, room: placeIdx }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ [placeIdx]: "new" });
      }
    } else if (scenario === "infinite") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        const toRoom = 2 * fromRoom;
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: toRoom } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [toRoom]: "shift" });
      } else {
        const placeIdx = s - VISIBLE_ROOMS; // 1..oddCount
        const targetRoom = 2 * placeIdx - 1;
        const first = queue[0];
        if (!first) return;
        setGuests((gs) => [...gs, { ...first, room: targetRoom }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ [targetRoom]: "new" });
      }
    } else if (scenario === "buses") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        const toRoom = Math.pow(2, fromRoom);
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: toRoom } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [toRoom]: "shift" });
      } else {
        const first = queue[0];
        if (!first || first.origin !== "bus" || first.bus === undefined) return;
        const prime = BUS_PRIMES[first.bus - 1];
        const target = Math.pow(prime, first.index);
        setGuests((gs) => [...gs, { ...first, room: target }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ [target]: "bus" });
      }
    }
  }

  // Play loop
  useEffect(() => {
    if (!playing) return;
    if (step >= totalSteps) {
      setPlaying(false);
      return;
    }
    const interval = setInterval(
      () => {
        advance();
      },
      1000 / Math.max(1, speed),
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, step, totalSteps]);

  // Build a map from room number → guests currently in that room
  const roomToGuests = useMemo(() => {
    const map: Record<number, Guest[]> = {};
    for (const g of guests) {
      if (g.room <= 0) continue;
      if (!map[g.room]) map[g.room] = [];
      map[g.room].push(g);
    }
    return map;
  }, [guests]);

  // How many guests are off-screen (room > VISIBLE_ROOMS)?
  const offScreenGuests = useMemo(
    () => guests.filter((g) => g.room > VISIBLE_ROOMS).length,
    [guests],
  );

  const scenarioLabels: Record<Scenario, string> = {
    one: "1 new guest",
    k: "k new guests",
    infinite: "ℵ₀ new guests",
    buses: "ℵ₀ buses × ℵ₀ guests",
  };

  const scenarioFormula: Record<Scenario, string> = {
    one: "n → n + 1",
    k: `n → n + ${k}`,
    infinite: "n → 2n  ·  odd rooms ← new",
    buses: "guest n → 2ⁿ  ·  bus k passenger m → pₖᵐ",
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Main view */}
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Hilbert Hotel · rooms 1…{VISIBLE_ROOMS} (continues ad infinitum)
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {scenarioFormula[scenario]}
            </div>
          </div>

          {/* The room grid */}
          <div className="hairline flex-1 overflow-auto rounded-2xl border bg-ink-950 p-4">
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${ROOMS_PER_ROW}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: VISIBLE_ROOMS }, (_, i) => i + 1).map((roomNum) => {
                const occupants = roomToGuests[roomNum] ?? [];
                const highlight = highlightRooms[roomNum];
                const borderClass =
                  highlight === "new"
                    ? "border-signal-cyan/80 bg-signal-cyan/10"
                    : highlight === "shift"
                      ? "border-signal-amber/60 bg-signal-amber/5"
                      : highlight === "bus"
                        ? "border-signal-rose/60 bg-signal-rose/5"
                        : occupants.length > 0
                          ? "hairline bg-ink-900/40"
                          : "border-ink-700/30 bg-ink-950";
                return (
                  <div
                    key={roomNum}
                    className={`relative rounded-md border ${borderClass} flex aspect-square flex-col items-center justify-between p-1.5 transition-colors`}
                  >
                    <div className="font-mono text-[9px] text-ink-400">{roomNum}</div>
                    <div className="flex flex-1 flex-wrap items-center justify-center gap-0.5">
                      {occupants.slice(0, 4).map((g) => (
                        <div
                          key={g.id}
                          className="rounded-full"
                          style={{
                            backgroundColor: g.color,
                            width: occupants.length > 1 ? 6 : 10,
                            height: occupants.length > 1 ? 6 : 10,
                            boxShadow: `0 0 6px ${g.color}80`,
                          }}
                          title={
                            g.origin === "existing"
                              ? `Existing guest (was in ${g.index})`
                              : g.origin === "bus"
                                ? `Bus ${g.bus} · passenger ${g.index}`
                                : `New guest #${g.index}`
                          }
                        />
                      ))}
                      {occupants.length > 4 && (
                        <span className="font-mono text-[8px] text-ink-300">
                          +{occupants.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Off-screen indicator cells */}
              {Array.from({ length: OFF_SCREEN_ROOMS }, (_, i) => i).map((i) => (
                <div
                  key={`off-${i}`}
                  className="flex aspect-square items-center justify-center rounded-md border border-dashed border-ink-700/40 font-mono text-xs text-ink-500"
                >
                  …
                </div>
              ))}
            </div>
          </div>

          {/* Lobby / queue strip */}
          <div className="glass hairline flex flex-wrap items-center gap-3 rounded-md border px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Lobby queue ({queue.length})
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {queue.slice(0, 40).map((g) => (
                <div
                  key={g.id}
                  className="rounded-full"
                  style={{
                    backgroundColor: g.color,
                    width: 8,
                    height: 8,
                    boxShadow: `0 0 4px ${g.color}80`,
                  }}
                  title={
                    g.origin === "bus"
                      ? `Bus ${g.bus} · passenger ${g.index} → room ${
                          g.bus ? Math.pow(BUS_PRIMES[g.bus - 1], g.index) : "?"
                        }`
                      : `New guest #${g.index}`
                  }
                />
              ))}
              {queue.length > 40 && (
                <span className="font-mono text-[10px] text-ink-400">
                  +{queue.length - 40} more · ℵ₀
                </span>
              )}
              {queue.length === 0 && (
                <span className="font-mono text-[10px] text-ink-500">— all checked in —</span>
              )}
            </div>
            {offScreenGuests > 0 && (
              <div className="font-mono text-[10px] text-ink-400">
                {offScreenGuests} guest{offScreenGuests === 1 ? "" : "s"} in rooms beyond #
                {VISIBLE_ROOMS}
              </div>
            )}
          </div>

          {/* Step progress */}
          <div className="glass hairline flex items-center justify-between gap-3 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            <span>
              Step {step} / {totalSteps}
            </span>
            <div className="mx-3 h-1 flex-1 overflow-hidden rounded bg-ink-800">
              <div
                className="h-full bg-signal-cyan"
                style={{ width: `${totalSteps > 0 ? (step / totalSteps) * 100 : 0}%` }}
              />
            </div>
            <span className="text-signal-cyan">{scenarioLabels[scenario]}</span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Scenario picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Scenario
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  { id: "one", label: "1 new guest", desc: "shift n → n + 1, room 1 opens" },
                  { id: "k", label: "k new guests", desc: "shift n → n + k, rooms 1…k open" },
                  { id: "infinite", label: "ℵ₀ new guests", desc: "n → 2n, every odd room opens" },
                  {
                    id: "buses",
                    label: "ℵ₀ buses, ℵ₀ guests",
                    desc: "guest n → 2ⁿ, bus k passenger m → pₖᵐ",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setScenario(opt.id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    scenario === opt.id
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{opt.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* k slider — only visible for k scenario */}
          {scenario === "k" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                k — new guests
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-cyan">{k}</span>
              </div>
              <input
                type="range"
                value={k}
                min={1}
                max={10}
                step={1}
                onChange={(e) => setK(parseInt(e.target.value))}
                className="w-full accent-signal-cyan"
              />
            </div>
          )}

          {/* Controls */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Controls
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setPlaying(false);
                  advance();
                }}
                disabled={step >= totalSteps}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40 disabled:hover:border-ink-700 disabled:hover:text-ink-200"
              >
                Step
              </button>
              <button
                onClick={() => setPlaying(true)}
                disabled={step >= totalSteps || playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40"
              >
                Play
              </button>
              <button
                onClick={() => setPlaying(false)}
                disabled={!playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40"
              >
                Pause
              </button>
              <button
                onClick={() => resetScenario(scenario, k)}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-rose/50 hover:text-signal-rose"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Speed
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">{speed} steps/s</span>
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={40}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          {/* Legend */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Legend
            </div>
            <div className="space-y-2 font-mono text-[10px] text-ink-200">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full"
                  style={{ background: EXISTING_COLOR, width: 10, height: 10 }}
                />
                Existing guest
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full"
                  style={{ background: NEW_GUEST_COLOR, width: 10, height: 10 }}
                />
                New guest (one / k / ℵ₀)
              </div>
              {scenario === "buses" &&
                BUS_PRIMES.slice(0, 4).map((p, i) => (
                  <div key={p} className="flex items-center gap-2">
                    <span
                      className="inline-block rounded-full"
                      style={{ background: BUS_COLORS[i], width: 10, height: 10 }}
                    />
                    Bus {i + 1} · prime {p} (rooms {p}, {p * p}, {p * p * p}, …)
                  </div>
                ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/hilberthotel"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              ← Story
            </Link>
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
