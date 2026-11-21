// Toy machines behind the halting explorer. Kept outside the page file so
// the step counts quoted in the UI and the guide can be pinned by unit tests
// (a Next page module may only export the page itself).
//
// Two instruction sets share one state shape and one step budget:
//
//   1. A Brainfuck-style tape machine (32 cells, 8-bit values):
//        +  increment the cell under the pointer (wrap mod 256)
//        -  decrement the cell under the pointer (wrap mod 256)
//        >  move pointer right (wrap around tape)
//        <  move pointer left  (wrap around tape)
//        [  if cell == 0, jump past matching ]
//        ]  if cell != 0, jump back past matching [
//      Anything else is ignored (comments are allowed).
//
//   2. A small register machine with unbounded integer registers and
//      numbered lines. It exists because the tape machine cannot honestly
//      run the number-theoretic presets: the Collatz orbit of 27 peaks at
//      9232, far beyond an 8-bit cell, and a Goldbach check needs a
//      primality test. Each line is one machine step.

export const TAPE_SIZE = 32;

export type HaltStatus = "running" | "halted" | "cap";

export type Registers = Record<string, number>;

export interface VMState {
  tape: Uint8Array;
  pointer: number;
  regs: Registers;
  pc: number;
  step: number;
  status: HaltStatus;
}

// Returned by a register-machine line to stop the program.
export const HALT = -1;

export interface RegLine {
  // Shown verbatim in the listing. Must say exactly what `exec` does: the
  // listing is the only description of the program the visitor gets.
  text: string;
  // Mutates the (already copied) registers. Returns the next line, HALT, or
  // nothing to fall through to the following line.
  exec: (r: Registers, input: number) => number | void;
}

export interface ProgramInput {
  min: number;
  max: number;
  initial: number;
}

export type ProgramDef =
  | { id: string; kind: "tape"; code: string }
  | { id: string; kind: "registers"; registers: string[]; lines: RegLine[]; input?: ProgramInput };

// Build a jump table once per program so [/] are O(1).
export function buildJumpTable(code: string): Map<number, number> {
  const stack: number[] = [];
  const map = new Map<number, number>();
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "[") stack.push(i);
    else if (code[i] === "]") {
      const open = stack.pop();
      if (open === undefined) continue; // unbalanced, treated as nop
      map.set(open, i);
      map.set(i, open);
    }
  }
  return map;
}

export function freshState(program: ProgramDef): VMState {
  const regs: Registers = {};
  if (program.kind === "registers") for (const name of program.registers) regs[name] = 0;
  return {
    tape: new Uint8Array(TAPE_SIZE),
    pointer: 0,
    regs,
    pc: 0,
    step: 0,
    status: "running",
  };
}

export function stepVM(
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
  // Copy the tape before touching it. stepVM runs inside setState updaters,
  // and React StrictMode invokes those twice in dev; mutating the previous
  // state's Uint8Array in place would apply every +/- twice. A per-call copy
  // (32 bytes) keeps the updater pure.
  const tape = state.tape.slice();
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
  const status: HaltStatus = pc >= code.length ? "halted" : "running";
  return { ...state, tape, pointer, pc, step: state.step + 1, status };
}

export function stepRegisters(
  state: VMState,
  lines: RegLine[],
  input: number,
  stepCap: number,
): VMState {
  if (state.status !== "running") return state;
  if (state.step >= stepCap) return { ...state, status: "cap" };
  if (state.pc >= lines.length) return { ...state, status: "halted" };
  // Same purity argument as the tape copy in stepVM.
  const regs = { ...state.regs };
  const result = lines[state.pc].exec(regs, input);
  const step = state.step + 1;
  // On HALT the program counter stays on the halting line, so the listing
  // can show where the program stopped.
  if (result === HALT) return { ...state, regs, step, status: "halted" };
  const pc = typeof result === "number" ? result : state.pc + 1;
  return { ...state, regs, pc, step, status: pc >= lines.length ? "halted" : "running" };
}

export function stepProgram(
  state: VMState,
  program: ProgramDef,
  jumps: Map<number, number>,
  input: number,
  stepCap: number,
): VMState {
  return program.kind === "tape"
    ? stepVM(state, program.code, jumps, stepCap)
    : stepRegisters(state, program.lines, input, stepCap);
}

// Runs until the program halts or the budget is spent. Used by the tests and
// by the reduced-motion path, which shows the verdict without the playback.
export function runProgram(
  program: ProgramDef,
  input: number,
  stepCap: number,
  from: VMState = freshState(program),
): VMState {
  const jumps = program.kind === "tape" ? buildJumpTable(program.code) : new Map<number, number>();
  let s = from;
  while (s.status === "running") s = stepProgram(s, program, jumps, input, stepCap);
  return s;
}

// Trial division. A built-in of the register machine: spelling it out line
// by line would bury the Goldbach loop under bookkeeping.
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

// Programs ----------------------------------------------------------------

// Increment forever: cell 0 is set to 1 to enter the loop, then we just keep
// incrementing cell 1 inside an unconditional loop on cell 0. Never halts.
const INCREMENT_FOREVER = "+[>+<]";

// Count to 100: cell 0 = 100, then decrement until zero. 100 increments, one
// loop entry, two steps per pass: halts after 301 steps.
const COUNT_TO_100 = "+".repeat(100) + "[-]";

// Collatz loop shared by both presets; they differ only in line 0. k counts
// the Collatz steps so the famous 111 for n = 27 is visible next to the
// larger machine-step count (four lines per Collatz step).
const collatzLines = (first: RegLine): RegLine[] => [
  first,
  { text: "if n = 1: halt", exec: (r) => (r.n === 1 ? HALT : undefined) },
  {
    text: "n ← n / 2 if n is even, else 3n + 1",
    exec: (r) => {
      r.n = r.n % 2 === 0 ? r.n / 2 : 3 * r.n + 1;
    },
  },
  {
    text: "k ← k + 1",
    exec: (r) => {
      r.k += 1;
    },
  },
  { text: "goto 1", exec: () => 1 },
];

// Halts exactly when it meets an even n ≥ 4 that is not a sum of two primes,
// that is, iff Goldbach's conjecture is false. It is enough to try p ≤ n − p.
const GOLDBACH_LINES: RegLine[] = [
  {
    text: "n ← 4",
    exec: (r) => {
      r.n = 4;
    },
  },
  {
    text: "p ← 2",
    exec: (r) => {
      r.p = 2;
    },
  },
  { text: "if p > n − p: halt", exec: (r) => (r.p > r.n - r.p ? HALT : undefined) },
  {
    text: "if prime(p) and prime(n − p): goto 6",
    exec: (r) => (isPrime(r.p) && isPrime(r.n - r.p) ? 6 : undefined),
  },
  {
    text: "p ← p + 1",
    exec: (r) => {
      r.p += 1;
    },
  },
  { text: "goto 2", exec: () => 2 },
  {
    text: "n ← n + 2",
    exec: (r) => {
      r.n += 2;
    },
  },
  { text: "goto 1", exec: () => 1 },
];

// Turing's D needs halts(D, D), which cannot be programmed. The honest
// substitute: the visitor supplies the answer a claimed decider would give
// (input h), and D does the opposite. Both settings refute the claim, which
// is the whole proof; nothing here pretends to compute halts.
const DIAGONAL_LINES: RegLine[] = [
  {
    text: "h ← input",
    exec: (r, input) => {
      r.h = input;
    },
  },
  { text: "if h = 1: goto 1", exec: (r) => (r.h === 1 ? 1 : undefined) },
  { text: "halt", exec: () => HALT },
];

// Fixed order. The per-locale `programs` arrays in the explorer page are
// index-matched to this list, so both stay in lockstep.
export const PROGRAM_DEFS: ProgramDef[] = [
  { id: "increment-forever", kind: "tape", code: INCREMENT_FOREVER },
  { id: "count-to-100", kind: "tape", code: COUNT_TO_100 },
  { id: "goldbach", kind: "registers", registers: ["n", "p"], lines: GOLDBACH_LINES },
  {
    id: "collatz-27",
    kind: "registers",
    registers: ["n", "k"],
    lines: collatzLines({
      text: "n ← 27",
      exec: (r) => {
        r.n = 27;
      },
    }),
  },
  {
    id: "collatz-input",
    kind: "registers",
    registers: ["n", "k"],
    lines: collatzLines({
      text: "n ← input",
      exec: (r, input) => {
        r.n = input;
      },
    }),
    // Below a million every orbit stays far inside the exact integer range
    // of a double (the peak is under 6 * 10^10).
    input: { min: 1, max: 999_999, initial: 97 },
  },
  {
    id: "diagonal-d",
    kind: "registers",
    registers: ["h"],
    lines: DIAGONAL_LINES,
    input: { min: 0, max: 1, initial: 1 },
  },
];
