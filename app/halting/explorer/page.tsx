"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// --------------------------------------------------------------------------
// Toy-program halting simulator. The user picks one of six canned programs;
// the VM runs it step-by-step on a small tape. After N steps either the
// program has halted (we know — "halted at step k") or we cap it and report
// "still running after N steps — we cannot say if it ever halts." That cap
// is the point: any finite analyser eventually gives up, illustrating why
// the halting problem is undecidable.
//
// We use a tiny Brainfuck-style instruction set:
//   +  increment the cell under the pointer (wrap mod 256)
//   -  decrement the cell under the pointer (wrap mod 256)
//   >  move pointer right (wrap around tape)
//   <  move pointer left  (wrap around tape)
//   [  if cell == 0, jump past matching ]
//   ]  if cell != 0, jump back past matching [
// Anything else is ignored — comments are allowed.
//
// This is enough to write loops that obviously halt (count down a cell),
// loops that obviously don't (+++ in [ … ]), and a self-referential "do the
// opposite of what H says about me" toy that we wire up by hand below.
// --------------------------------------------------------------------------

const TAPE_SIZE = 32;
const MAX_STEPS_HARD_CAP = 100_000;

type HaltStatus = "running" | "halted" | "cap";

interface VMState {
  tape: Uint8Array;
  pointer: number;
  pc: number;
  step: number;
  status: HaltStatus;
}

interface Program {
  id: string;
  label: string;
  description: string;
  truth: string; // what we actually know about its halting behaviour
  code: string;
}

// Build a jump table once per program so [/] are O(1).
function buildJumpTable(code: string): Map<number, number> {
  const stack: number[] = [];
  const map = new Map<number, number>();
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "[") stack.push(i);
    else if (code[i] === "]") {
      const open = stack.pop();
      if (open === undefined) continue; // unbalanced — treated as nop
      map.set(open, i);
      map.set(i, open);
    }
  }
  return map;
}

function freshState(): VMState {
  return {
    tape: new Uint8Array(TAPE_SIZE),
    pointer: 0,
    pc: 0,
    step: 0,
    status: "running",
  };
}

function stepVM(
  state: VMState,
  code: string,
  jumps: Map<number, number>,
  stepCap: number,
): VMState {
  if (state.status !== "running") return state;
  if (state.step >= stepCap) {
    return { ...state, status: "cap" };
  }
  if (state.pc >= code.length) {
    return { ...state, status: "halted" };
  }
  const instr = code[state.pc];
  const tape = state.tape;
  let pointer = state.pointer;
  let pc = state.pc;
  switch (instr) {
    case "+":
      tape[pointer] = (tape[pointer] + 1) & 0xff;
      pc++;
      break;
    case "-":
      tape[pointer] = (tape[pointer] - 1) & 0xff;
      pc++;
      break;
    case ">":
      pointer = (pointer + 1) % TAPE_SIZE;
      pc++;
      break;
    case "<":
      pointer = (pointer - 1 + TAPE_SIZE) % TAPE_SIZE;
      pc++;
      break;
    case "[": {
      if (tape[pointer] === 0) {
        const j = jumps.get(pc);
        pc = j !== undefined ? j + 1 : pc + 1;
      } else {
        pc++;
      }
      break;
    }
    case "]": {
      if (tape[pointer] !== 0) {
        const j = jumps.get(pc);
        pc = j !== undefined ? j + 1 : pc + 1;
      } else {
        pc++;
      }
      break;
    }
    default:
      pc++;
      break;
  }
  const nextStep = state.step + 1;
  let status: HaltStatus = "running";
  if (pc >= code.length) status = "halted";
  return {
    tape,
    pointer,
    pc,
    step: nextStep,
    status,
  };
}

// Programs ----------------------------------------------------------------

// Increment forever: cell 0 is set to 1 to enter the loop, then we just keep
// incrementing cell 1 inside an unconditional loop on cell 0. Never halts.
const INCREMENT_FOREVER = "+[>+<]";

// Count to 100: cell 0 = 100, then decrement until zero. 100 iterations × a
// few inner steps. Halts.
const COUNT_TO_100 = "+".repeat(100) + "[-]";

// Collatz on 27 written in a "we cheat and just unroll" style would be
// huge — instead we model the abstract Collatz dynamics in the renderer
// rather than the BF source. To keep the simulator honest, we provide a
// straight BF program that simply counts down from 111 (the number of
// real Collatz steps from 27 to 1) and halts. The description in the
// sidebar tells the truth: Collatz on 27 takes 111 steps.
const COLLATZ_27 = "+".repeat(111) + "[-]";

// Goldbach search: we don't actually compute Goldbach inside the VM (the
// number of primes you'd need to test makes it impossible in a few
// thousand steps). We instead model the *shape*: an outer loop that
// increments a counter forever, with a guard that would halt if the
// conjecture ever failed. Concretely we just loop forever — because as
// far as anyone has checked (up to 4 × 10^18), Goldbach holds. The
// status the user sees is identical to what real life gives us: still
// running, we don't know.
const GOLDBACH_SEARCH = "+[>+<]";

// Collatz on input: a generic search you'd never finish — same shape.
const COLLATZ_GENERIC = "+[>+<]";

// Self-referential diagonal. The trick in Turing's proof is that D(P)
// computes halts(P, P) and does the opposite. We can't write halts inside
// the VM (it doesn't exist!) so the program below simulates the *shape*:
// it sets cell 0 to a non-zero "halts says ⊤" value, enters a loop, and
// then never leaves. The point in the UI is to read the description and
// see why no inner content could ever make D consistent.
const DIAGONAL_D = "+[>+<]";

const PROGRAMS: Program[] = [
  {
    id: "increment-forever",
    label: "Increment forever",
    description:
      "+[>+<]  — cell 0 is set to 1, then the loop runs forever, ticking cell 1 up on every pass.",
    truth: "Trivially never halts.",
    code: INCREMENT_FOREVER,
  },
  {
    id: "count-to-100",
    label: "Count to 100",
    description: "Set cell 0 to 100, then [-] decrements it until zero and exits the loop.",
    truth: "Halts after exactly 201 instruction steps.",
    code: COUNT_TO_100,
  },
  {
    id: "goldbach",
    label: "Goldbach search",
    description:
      "For n = 4, 6, 8, … : halt if n is not the sum of two primes. As far as we have searched (up to 4·10¹⁸), Goldbach holds — so this loop keeps running.",
    truth: "Halts iff Goldbach's conjecture is false. Unknown.",
    code: GOLDBACH_SEARCH,
  },
  {
    id: "collatz-27",
    label: "Collatz on 27",
    description:
      "Iterate n ↦ n/2 (even) or 3n+1 (odd), starting at 27. It really does come back to 1.",
    truth: "Halts after 111 real Collatz steps.",
    code: COLLATZ_27,
  },
  {
    id: "collatz-input",
    label: "Collatz on input",
    description:
      "Same map, arbitrary starting n. The orbit of every n ≤ 2⁶⁸ has been checked by computer and always reaches 1 — but no proof in general.",
    truth: "Unknown in general. Open since 1937.",
    code: COLLATZ_GENERIC,
  },
  {
    id: "diagonal-d",
    label: "Self-referential D",
    description:
      "Turing's diagonal: D(P) computes halts(P, P) and does the opposite. Feed D to itself and either answer of halts(D, D) contradicts the definition.",
    truth: "Cannot exist consistently. The proof of undecidability.",
    code: DIAGONAL_D,
  },
];

export default function HaltingExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.halting;

  const [programId, setProgramId] = useState<string>(PROGRAMS[0].id);
  const program = useMemo(
    () => PROGRAMS.find((p) => p.id === programId) ?? PROGRAMS[0],
    [programId],
  );
  const jumps = useMemo(() => buildJumpTable(program.code), [program.code]);

  const [stepCap, setStepCap] = useState(2000);
  const [speed, setSpeed] = useState(40); // steps/sec slider value 1..200
  const [running, setRunning] = useState(false);

  const [state, setState] = useState<VMState>(() => freshState());
  const stateRef = useRef(state);
  stateRef.current = state;

  const reset = useCallback(() => {
    setRunning(false);
    setState(freshState());
  }, []);

  // Reset when the user changes program — fresh tape, fresh PC.
  useEffect(() => {
    reset();
  }, [program.id, reset]);

  const stepOnce = useCallback(() => {
    setState((prev) => stepVM(prev, program.code, jumps, stepCap));
  }, [program.code, jumps, stepCap]);

  // Auto-run loop. We batch multiple VM steps per animation frame so that
  // the slider's upper end (200 steps/sec on a slow tape) still feels fast.
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let acc = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const dt = now - last;
      last = now;
      acc += (dt / 1000) * speed;
      let steps = Math.floor(acc);
      acc -= steps;
      if (steps > 500) steps = 500;
      if (steps > 0) {
        setState((prev) => {
          let s = prev;
          for (let i = 0; i < steps; i++) {
            if (s.status !== "running") break;
            s = stepVM(s, program.code, jumps, stepCap);
          }
          if (s.status !== "running") {
            // Stop driving the loop once we know the answer (or hit the cap).
            setTimeout(() => setRunning(false), 0);
          }
          return s;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [running, speed, program.code, jumps, stepCap]);

  const statusLine = (() => {
    if (state.status === "halted") {
      return `halted at step ${state.step}`;
    }
    if (state.status === "cap") {
      return `still running after ${state.step} steps — we cannot say if it ever halts`;
    }
    return `running · step ${state.step} / cap ${stepCap}`;
  })();

  const statusAccent = (() => {
    switch (state.status) {
      case "halted":
        return "text-signal-amber";
      case "cap":
        return "text-signal-rose";
      default:
        return "text-signal-cyan";
    }
  })();

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              Toy VM · tape of {TAPE_SIZE} cells · 8-bit values
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              halts(P, x) ∈ {"{⊤, ⊥}"}
            </div>
          </div>

          {/* Program source */}
          <div className="hairline space-y-2 rounded-2xl border bg-ink-950 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Program · {program.label}
            </div>
            <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
              {program.code.split("").map((ch, i) => (
                <span
                  key={i}
                  className={
                    i === state.pc && state.status === "running"
                      ? "rounded bg-signal-cyan/30 px-[2px] text-signal-cyan"
                      : ""
                  }
                >
                  {ch}
                </span>
              ))}
            </pre>
            <div className="text-xs leading-relaxed text-ink-300">{program.description}</div>
            <div className="font-mono text-[11px] text-ink-400">Ground truth: {program.truth}</div>
          </div>

          {/* Tape view */}
          <div className="hairline flex-1 space-y-3 rounded-2xl border bg-ink-950 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Tape
            </div>
            <div className="md:grid-cols-16 grid grid-cols-8 gap-1">
              {Array.from(state.tape).map((cell, i) => {
                const isHead = i === state.pointer;
                return (
                  <div
                    key={i}
                    className={`rounded border py-2 text-center font-mono text-xs transition-colors ${
                      isHead
                        ? "border-signal-cyan/70 bg-signal-cyan/20 text-signal-cyan"
                        : cell === 0
                          ? "border-ink-700/40 bg-ink-900/40 text-ink-500"
                          : "border-signal-amber/40 bg-signal-amber/10 text-signal-amber"
                    }`}
                  >
                    <div className="text-[9px] text-ink-500">{i}</div>
                    <div>{cell}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-2 font-mono text-[11px] text-ink-300">
              <span>ptr = {state.pointer}</span>
              <span>pc = {state.pc}</span>
              <span className={statusAccent}>{statusLine}</span>
            </div>
          </div>
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Program
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PROGRAMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProgramId(p.id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    p.id === program.id
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] leading-snug text-ink-400">
                    {p.truth}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Controls
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={stepOnce}
                disabled={state.status !== "running"}
                className="hairline rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40 disabled:hover:border-ink-700/50 disabled:hover:text-ink-200"
              >
                Step
              </button>
              <button
                onClick={() => setRunning((r) => !r)}
                disabled={state.status !== "running"}
                className={`rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors disabled:opacity-40 ${
                  running
                    ? "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
                    : "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan hover:bg-signal-cyan/20"
                }`}
              >
                {running ? "Pause" : "Run"}
              </button>
              <button
                onClick={reset}
                className="hairline col-span-2 rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Step limit · {stepCap}
            </div>
            <input
              type="range"
              value={stepCap}
              min={10}
              max={MAX_STEPS_HARD_CAP > 10000 ? 10000 : MAX_STEPS_HARD_CAP}
              step={10}
              onChange={(e) => setStepCap(parseInt(e.target.value))}
              className="w-full accent-signal-cyan"
            />
            <p className="text-[11px] leading-relaxed text-ink-400">
              Any analyser must give up sooner or later. The cap is your analyser: when it fires,
              you cannot tell whether the program would eventually halt.
            </p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Speed · {speed} steps/sec
            </div>
            <input
              type="range"
              value={speed}
              min={1}
              max={200}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          <div className="p-5">
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
