"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Formula } from "@/components/Formula";
import { useI18n } from "@/lib/i18n/context";

// ---------------------------------------------------------------------------
// Gödel Explorer — a four-step walk through Gödel numbering and the
// construction of the self-referential sentence G. The sidebar mirrors the
// app/logistic/explorer layout: a topic header from a.topics.godel, a small
// set of controls, and a back link. The main view animates between four
// steps; each step is a self-contained panel.
// ---------------------------------------------------------------------------

const ACCENT = "text-signal-violet";

// Compact alphabet for the demo. Real Gödel numberings vary across sources;
// this one is illustrative — consistent enough to give honest numbers, small
// enough that a browser BigInt can hold the results of "0=0" and friends.
interface Symbol {
  glyph: string;
  meaning: string;
  code: number;
}

const ALPHABET: Symbol[] = [
  { glyph: "¬", meaning: "not", code: 1 },
  { glyph: "∨", meaning: "or", code: 2 },
  { glyph: "∀", meaning: "for all", code: 3 },
  { glyph: "∃", meaning: "there exists", code: 4 },
  { glyph: "=", meaning: "equals", code: 5 },
  { glyph: "0", meaning: "zero", code: 6 },
  { glyph: "S", meaning: "successor", code: 7 },
  { glyph: "+", meaning: "plus", code: 8 },
  { glyph: "(", meaning: "open", code: 9 },
  { glyph: ")", meaning: "close", code: 10 },
];

// The first ten primes — enough for the longest formula on offer.
const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];

// Small set of formulae the user can encode. Each is just an ordered list of
// symbol glyphs — we look the glyph up in ALPHABET to find its code.
interface FormulaChoice {
  id: string;
  label: string;
  tokens: string[]; // each element matches a glyph in ALPHABET
}

const FORMULAS: FormulaChoice[] = [
  { id: "0eq0", label: "0 = 0  (true)", tokens: ["0", "=", "0"] },
  { id: "0eq1", label: "0 = S0  (false)", tokens: ["0", "=", "S", "0"] },
  { id: "neg0eq0", label: "¬(0 = 0)", tokens: ["¬", "(", "0", "=", "0", ")"] },
  { id: "forall", label: "∀x (0 = 0)", tokens: ["∀", "(", "0", "=", "0", ")"] },
];

function lookupCode(glyph: string): number {
  const found = ALPHABET.find((s) => s.glyph === glyph);
  return found ? found.code : 0;
}

// Compute the Gödel number of a token sequence as ∏ pᵢ^codeᵢ. Use BigInt
// because the values blow up quickly — even "0=S0" pushes past 10¹⁰.
function godelNumber(tokens: string[]): bigint {
  let n = 1n;
  for (let i = 0; i < tokens.length; i++) {
    const code = lookupCode(tokens[i]);
    let factor = 1n;
    for (let k = 0; k < code; k++) factor *= PRIMES[i] ?? 2n;
    n *= factor;
  }
  return n;
}

// Pretty-print a BigInt with thin-space thousands separators so the numbers
// stay readable when they grow past a million.
function fmt(n: bigint): string {
  const s = n.toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const STEP_TITLES = [
  "Step 1 · The alphabet",
  "Step 2 · Encode a formula",
  "Step 3 · Build G",
  "Step 4 · Both branches",
] as const;

export default function GodelExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.godel;

  const [step, setStep] = useState<number>(1);
  const [formulaId, setFormulaId] = useState<string>("0eq0");

  const currentFormula = useMemo<FormulaChoice>(
    () => FORMULAS.find((f) => f.id === formulaId) ?? FORMULAS[0],
    [formulaId],
  );

  const encoded = useMemo(() => godelNumber(currentFormula.tokens), [currentFormula]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const reset = () => setStep(1);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* ---------------- Main canvas ---------------- */}
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {STEP_TITLES[step - 1]}
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
            >
              G ⇔ ¬Prov(⌜G⌝)
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950/80 p-6 md:p-10">
            {step === 1 && <StepAlphabet />}
            {step === 2 && <StepEncode formula={currentFormula} godel={encoded} />}
            {step === 3 && <StepBuildG godel={encoded} />}
            {step === 4 && <StepBranches />}
          </div>

          {/* Step indicator strip */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-signal-violet" : "bg-ink-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---------------- Sidebar ---------------- */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Walk through the proof
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className={ACCENT}>Step {step} / 4</span>
              <span className="text-ink-300">{STEP_TITLES[step - 1]}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={next}
                disabled={step >= 4}
                className="rounded-md border border-signal-violet/60 bg-signal-violet/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Step →
              </button>
              <button
                onClick={reset}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Try a formula
            </div>
            <div className="grid grid-cols-1 gap-2">
              {FORMULAS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFormulaId(f.id);
                    if (step < 2) setStep(2);
                  }}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    formulaId === f.id
                      ? "border-signal-violet/60 bg-signal-violet/10 text-signal-violet"
                      : "hairline text-ink-200 hover:border-signal-violet/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{f.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {f.tokens.length} symbols
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Hilbert's question
            </div>
            <p className="text-xs leading-relaxed text-ink-200">
              Can every true arithmetic statement be proved inside a single formal system? Gödel's
              answer, 1931: <span className={ACCENT}>no</span>.
            </p>
          </div>

          <div className="p-5">
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

// ---------------------------------------------------------------------------
// Step 1 — the alphabet. Show the symbol-to-number table.
// ---------------------------------------------------------------------------
function StepAlphabet() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          The alphabet of arithmetic
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          Give every symbol a number.
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
          Pick any reasonable convention. Here are ten symbols of a simple arithmetic language, each
          assigned a natural number. Once symbols are numbers, sequences of symbols (i.e. formulae)
          are sequences of numbers — and any sequence of numbers can be packed into a single natural
          number.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {ALPHABET.map((sym) => (
          <div key={sym.glyph} className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
            <div className={`text-2xl ${ACCENT}`}>{sym.glyph}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              {sym.meaning}
            </div>
            <div className="font-mono text-xs text-ink-100">code {sym.code}</div>
          </div>
        ))}
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">
          Next: pick a small formula like <span className="font-mono text-ink-100">0 = 0</span> or{" "}
          <span className="font-mono text-ink-100">¬(0 = 0)</span> from the sidebar and watch its
          Gödel number get built.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — encode a chosen formula.
// ---------------------------------------------------------------------------
function StepEncode({ formula, godel }: { formula: FormulaChoice; godel: bigint }) {
  const tokensWithCodes = formula.tokens.map((t) => ({
    glyph: t,
    code: lookupCode(t),
  }));
  const primes = PRIMES.slice(0, formula.tokens.length);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          Encode the formula
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          <span className="font-mono">{formula.label.split(" ")[0]}</span> becomes a single number.
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
          Take the symbol codes c₁, c₂, …, cₖ and raise consecutive primes to them:{" "}
          <span className={ACCENT}>
            2<sup>c₁</sup> · 3<sup>c₂</sup> · 5<sup>c₃</sup> · …
          </span>{" "}
          Prime factorisation is unique, so the encoding is reversible.
        </p>
      </div>

      <div className="hairline space-y-4 rounded-2xl border bg-ink-950/60 p-5">
        <div className="grid grid-cols-1 gap-2">
          {tokensWithCodes.map((tk, i) => (
            <div
              key={i}
              className="hairline flex items-center justify-between rounded-md border bg-ink-950/40 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`text-xl ${ACCENT} w-8 text-center`}>{tk.glyph}</div>
                <div className="font-mono text-xs text-ink-300">code</div>
                <div className="font-mono text-ink-100">{tk.code}</div>
              </div>
              <div className="font-mono text-xs text-ink-300">
                prime <span className="text-ink-100">{primes[i]?.toString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hairline space-y-2 border-t pt-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            Product of prime powers
          </div>
          <div className="overflow-x-auto">
            <Formula
              expression={tokensWithCodes
                .map((tk, i) => `${primes[i]?.toString() ?? "?"}^{${tk.code}}`)
                .join(" \\cdot ")}
              size="lg"
              className={ACCENT}
            />
          </div>
        </div>

        <div className="hairline space-y-1 border-t pt-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            Gödel number ⌜φ⌝
          </div>
          <div className={`font-mono text-lg ${ACCENT} break-all`}>{fmt(godel)}</div>
        </div>
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">
          Every formula now has a number. Crucially, statements{" "}
          <span className="text-ink-100">about</span> formulas — like «x is a proof of y» — also
          become arithmetic predicates. The system can talk about itself.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — construct the self-referential G.
// ---------------------------------------------------------------------------
function StepBuildG({ godel }: { godel: bigint }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          The diagonal construction
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          Build a sentence that talks about its own number.
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
          Gödel's diagonal lemma — a descendant of Cantor's 1891 diagonal argument — produces, for
          any predicate <span className="font-mono">P(x)</span>, a sentence
          <span className="ml-1 font-mono">G</span> such that G is equivalent to P(⌜G⌝). Apply it
          with <span className="font-mono">P(x) := ¬∃y Prov(y, x)</span>.
        </p>
      </div>

      <div className="hairline space-y-5 rounded-2xl border bg-ink-950/60 p-6">
        <div className="space-y-3 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            The sentence
          </div>
          <div className={ACCENT}>
            <Formula
              expression={
                "G \\;\\Leftrightarrow\\; \\neg\\,\\exists y\\;\\mathrm{Prov}(y,\\ulcorner G \\urcorner)"
              }
              size="lg"
              block
            />
          </div>
          <p className="text-sm leading-relaxed text-ink-200">
            In plain language:{" "}
            <span className="text-ink-100">
              «no natural number y is a proof of the formula with Gödel number ⌜G⌝»
            </span>{" "}
            — and the formula with Gödel number ⌜G⌝ is G itself.
          </p>
        </div>

        <div className="hairline grid grid-cols-1 items-center gap-3 border-t pt-4 md:grid-cols-3">
          <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              sentence
            </div>
            <div className="math-italic text-2xl text-ink-100">G</div>
            <div className="text-xs text-ink-300">«I am not provable»</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`text-3xl ${ACCENT}`}>↔</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              diagonal lemma
            </div>
          </div>
          <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Gödel #
            </div>
            <div className="math-italic text-2xl text-ink-100">⌜G⌝</div>
            <div className="text-xs text-ink-300">
              (the chosen formula here encodes to{" "}
              <span className="font-mono text-ink-100">{fmt(godel)}</span>)
            </div>
          </div>
        </div>
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">
          G refers to itself through the Gödel number — there is no hidden magic, only arithmetic.
          Now ask: is G provable?
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — the two-branch contradiction tree.
// ---------------------------------------------------------------------------
function StepBranches() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          Both branches lead out of Hilbert's dream
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          Provable, or unprovable — either way, incompleteness.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-signal-rose/40 bg-signal-rose/5 p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
            Branch A · S ⊢ G
          </div>
          <h3 className="math-italic text-xl leading-tight text-ink-100">If G is provable…</h3>
          <p className="text-sm leading-relaxed text-ink-200">
            Then S proves a sentence that says «I have no proof». The proof we just produced is a
            counter-witness. S has proved a false statement:{" "}
            <span className="text-signal-rose">S is inconsistent</span>.
          </p>
          <div className="font-mono text-xs text-ink-300">⇒ contradiction.</div>
        </div>

        <div className="space-y-3 rounded-2xl border border-signal-violet/40 bg-signal-violet/5 p-5">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Branch B · S ⊬ G
          </div>
          <h3 className="math-italic text-xl leading-tight text-ink-100">If G is not provable…</h3>
          <p className="text-sm leading-relaxed text-ink-200">
            Then what G claims is exactly true. G is a{" "}
            <span className={ACCENT}>true statement of arithmetic</span> that S cannot prove — the
            First Incompleteness Theorem.
          </p>
          <div className="font-mono text-xs text-ink-300">⇒ S is incomplete.</div>
        </div>
      </div>

      <div className="hairline space-y-3 rounded-2xl border bg-ink-950/60 p-5">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          Second Incompleteness Theorem
        </div>
        <p className="text-sm leading-relaxed text-ink-200">
          Let Con(S) be the arithmetic sentence «S is consistent». If S could prove Con(S), then —
          by formalising the argument above inside S — S could also prove G. So no consistent S that
          is rich enough for arithmetic can prove its own consistency.
        </p>
        <div className={ACCENT}>
          <Formula
            expression={
              "S \\vdash \\mathrm{Con}(S) \\;\\Rightarrow\\; S \\vdash G \\;\\Rightarrow\\; \\text{contradiction}"
            }
            size="md"
            block
          />
        </div>
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">
          Same diagonal trick reappears in Tarski's undefinability of truth (1933), Turing's halting
          problem (1936), and Church's undecidability of first-order logic (1936). Modern proof
          assistants — Coq, Lean, Isabelle — all operate under Gödel's bounds.
        </p>
      </div>
    </div>
  );
}
