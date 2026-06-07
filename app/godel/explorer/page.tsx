"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Formula } from "@/components/Formula";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// ---------------------------------------------------------------------------
// Gödel Explorer — a four-step walk through Gödel numbering and the
// construction of the self-referential sentence G. The sidebar mirrors the
// app/logistic/explorer layout: a topic header from a.topics.godel, a small
// set of controls, and a back link. The main view animates between four
// steps; each step is a self-contained panel.
//
// All visible prose lives in the inline EXPLORER: Record<Locale, RichExplorer>
// dict below — same pattern used by app/banach/explorer/page.tsx.
// ---------------------------------------------------------------------------

const ACCENT = "text-signal-violet";

// Compact alphabet for the demo. Real Gödel numberings vary across sources;
// this one is illustrative — consistent enough to give honest numbers, small
// enough that a browser BigInt can hold the results of "0=0" and friends.
// `meaningKey` is used to look up the per-locale label in RichExplorer.
type MeaningKey =
  | "not"
  | "or"
  | "forall"
  | "exists"
  | "equals"
  | "zero"
  | "successor"
  | "plus"
  | "open"
  | "close";

interface Symbol {
  glyph: string;
  meaningKey: MeaningKey;
  code: number;
}

const ALPHABET: Symbol[] = [
  { glyph: "¬", meaningKey: "not", code: 1 },
  { glyph: "∨", meaningKey: "or", code: 2 },
  { glyph: "∀", meaningKey: "forall", code: 3 },
  { glyph: "∃", meaningKey: "exists", code: 4 },
  { glyph: "=", meaningKey: "equals", code: 5 },
  { glyph: "0", meaningKey: "zero", code: 6 },
  { glyph: "S", meaningKey: "successor", code: 7 },
  { glyph: "+", meaningKey: "plus", code: 8 },
  { glyph: "(", meaningKey: "open", code: 9 },
  { glyph: ")", meaningKey: "close", code: 10 },
];

// The first ten primes — enough for the longest formula on offer.
const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];

// Small set of formulae the user can encode. Each carries:
// - id: stable key
// - labelKey: which per-locale label to use (the formula string itself is
//   ASCII and locale-independent; only the parenthetical hint translates)
// - tokens: ordered glyph list (we look each glyph up in ALPHABET)
type FormulaLabelKey = "0eq0" | "0eq1" | "neg0eq0" | "forall";

interface FormulaChoice {
  id: string;
  labelKey: FormulaLabelKey;
  expr: string; // language-independent expression e.g. "0 = 0"
  tokens: string[];
}

const FORMULAS: FormulaChoice[] = [
  { id: "0eq0", labelKey: "0eq0", expr: "0 = 0", tokens: ["0", "=", "0"] },
  { id: "0eq1", labelKey: "0eq1", expr: "0 = S0", tokens: ["0", "=", "S", "0"] },
  { id: "neg0eq0", labelKey: "neg0eq0", expr: "¬(0 = 0)", tokens: ["¬", "(", "0", "=", "0", ")"] },
  {
    id: "forall",
    labelKey: "forall",
    expr: "∀x (0 = 0)",
    tokens: ["∀", "(", "0", "=", "0", ")"],
  },
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
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// --------------------------------------------------------------------------
// Per-locale strings. Kept inline so the multi-locale prose lives next to the
// explorer it serves. Same pattern as app/banach/explorer/page.tsx.
// --------------------------------------------------------------------------

type RichExplorer = {
  stepTitles: [string, string, string, string];
  stepProgress: (n: number) => string;
  meanings: Record<MeaningKey, string>;
  formulaLabels: Record<FormulaLabelKey, string>; // e.g. "0 = 0  (true)" — the trailing tag translates
  // sidebar
  sidebarWalkLabel: string;
  sidebarStepBtn: string;
  sidebarResetBtn: string;
  sidebarTryLabel: string;
  symbolsCount: (n: number) => string;
  sidebarHilbertLabel: string;
  sidebarHilbertBody1: string; // text before the highlighted "no"
  sidebarHilbertNo: string; // "no" / "nein" / …
  sidebarHilbertBody2: string; // text after the highlighted word, e.g. "."
  // step 1
  step1Pretitle: string;
  step1Title: string;
  step1Body: string;
  step1Code: string; // "code"
  step1Footer1: string; // "Next: pick a small formula like"
  step1Footer2: string; // " or "
  step1Footer3: string; // " from the sidebar and watch its Gödel number get built."
  // step 2
  step2Pretitle: string;
  step2TitleSuffix: string; // " becomes a single number."
  step2Body1: string; // "Take the symbol codes c₁, c₂, …, cₖ and raise consecutive primes to them: "
  step2Body2: string; // " Prime factorisation is unique, so the encoding is reversible."
  step2Code: string; // "code"
  step2Prime: string; // "prime"
  step2ProductLabel: string;
  step2GoedelLabel: string;
  step2FooterAbout: string; // body in the box; we wire it as: "Every formula now has a number. Crucially, statements <about> formulas — like «x is a proof of y» — also become arithmetic predicates. The system can talk about itself."
  step2FooterPre: string;
  step2FooterAboutWord: string; // the highlighted "about"
  step2FooterPost: string;
  // step 3
  step3Pretitle: string;
  step3Title: string;
  step3BodyPre: string; // up to "P(x)"
  step3BodyP: string; // "P(x)"
  step3BodyMid: string; // " a sentence "
  step3BodyG: string; // "G"
  step3BodyTail: string; // " such that G is equivalent to P(⌜G⌝). Apply it with "
  step3PCode: string; // "P(x) := ¬∃y Prov(y, x)"
  step3BodyEnd: string; // "."
  step3SentenceLabel: string;
  step3InPlain: string; // "In plain language:"
  step3PlainQuote: string; // "«no natural number y is a proof of the formula with Gödel number ⌜G⌝»"
  step3PlainTail: string; // " — and the formula with Gödel number ⌜G⌝ is G itself."
  step3LoopSentence: string;
  step3LoopSentenceCaption: string; // "«I am not provable»"
  step3DiagLemma: string;
  step3GoedelHash: string; // "Gödel #"
  step3EncodesTo1: string; // "(the chosen formula here encodes to"
  step3EncodesTo2: string; // ")"
  step3FooterBody: string; // "G refers to itself through the Gödel number — there is no hidden magic, only arithmetic. Now ask: is G provable?"
  // step 4
  step4Pretitle: string;
  step4Title: string;
  step4BranchA: string; // "Branch A · S ⊢ G"
  step4BranchAHead: string; // "If G is provable…"
  step4BranchABodyPre: string; // "Then S proves a sentence that says «I have no proof». The proof we just produced is a counter-witness. S has proved a false statement: "
  step4BranchAHighlight: string; // "S is inconsistent"
  step4BranchABodyPost: string; // "."
  step4BranchAArrow: string; // "⇒ contradiction."
  step4BranchB: string; // "Branch B · S ⊬ G"
  step4BranchBHead: string; // "If G is not provable…"
  step4BranchBBodyPre: string; // "Then what G claims is exactly true. G is a "
  step4BranchBHighlight: string; // "true statement of arithmetic"
  step4BranchBBodyPost: string; // " that S cannot prove — the First Incompleteness Theorem."
  step4BranchBArrow: string; // "⇒ S is incomplete."
  step4SecondLabel: string;
  step4SecondBody: string;
  step4Footer: string;
};

const EXPLORER: Record<Locale, RichExplorer> = {
  en: {
    stepTitles: [
      "Step 1 · The alphabet",
      "Step 2 · Encode a formula",
      "Step 3 · Build G",
      "Step 4 · Both branches",
    ],
    stepProgress: (n) => `Step ${n} / 4`,
    meanings: {
      not: "not",
      or: "or",
      forall: "for all",
      exists: "there exists",
      equals: "equals",
      zero: "zero",
      successor: "successor",
      plus: "plus",
      open: "open",
      close: "close",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (true)",
      "0eq1": "0 = S0  (false)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Walk through the proof",
    sidebarStepBtn: "Step →",
    sidebarResetBtn: "Reset",
    sidebarTryLabel: "Try a formula",
    symbolsCount: (n) => `${n} symbols`,
    sidebarHilbertLabel: "Hilbert's question",
    sidebarHilbertBody1:
      "Can every true arithmetic statement be proved inside a single formal system? Gödel's answer, 1931: ",
    sidebarHilbertNo: "no",
    sidebarHilbertBody2: ".",
    step1Pretitle: "The alphabet of arithmetic",
    step1Title: "Give every symbol a number.",
    step1Body:
      "Pick any reasonable convention. Here are ten symbols of a simple arithmetic language, each assigned a natural number. Once symbols are numbers, sequences of symbols (i.e. formulae) are sequences of numbers — and any sequence of numbers can be packed into a single natural number.",
    step1Code: "code",
    step1Footer1: "Next: pick a small formula like ",
    step1Footer2: " or ",
    step1Footer3: " from the sidebar and watch its Gödel number get built.",
    step2Pretitle: "Encode the formula",
    step2TitleSuffix: " becomes a single number.",
    step2Body1: "Take the symbol codes c₁, c₂, …, cₖ and raise consecutive primes to them: ",
    step2Body2: " Prime factorisation is unique, so the encoding is reversible.",
    step2Code: "code",
    step2Prime: "prime",
    step2ProductLabel: "Product of prime powers",
    step2GoedelLabel: "Gödel number ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Every formula now has a number. Crucially, statements ",
    step2FooterAboutWord: "about",
    step2FooterPost:
      " formulas — like «x is a proof of y» — also become arithmetic predicates. The system can talk about itself.",
    step3Pretitle: "The diagonal construction",
    step3Title: "Build a sentence that talks about its own number.",
    step3BodyPre:
      "Gödel's diagonal lemma — a descendant of Cantor's 1891 diagonal argument — produces, for any predicate ",
    step3BodyP: "P(x)",
    step3BodyMid: ", a sentence ",
    step3BodyG: "G",
    step3BodyTail: " such that G is equivalent to P(⌜G⌝). Apply it with ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "The sentence",
    step3InPlain: "In plain language: ",
    step3PlainQuote: "«no natural number y is a proof of the formula with Gödel number ⌜G⌝»",
    step3PlainTail: " — and the formula with Gödel number ⌜G⌝ is G itself.",
    step3LoopSentence: "sentence",
    step3LoopSentenceCaption: "«I am not provable»",
    step3DiagLemma: "diagonal lemma",
    step3GoedelHash: "Gödel #",
    step3EncodesTo1: "(the chosen formula here encodes to ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G refers to itself through the Gödel number — there is no hidden magic, only arithmetic. Now ask: is G provable?",
    step4Pretitle: "Both branches lead out of Hilbert's dream",
    step4Title: "Provable, or unprovable — either way, incompleteness.",
    step4BranchA: "Branch A · S ⊢ G",
    step4BranchAHead: "If G is provable…",
    step4BranchABodyPre:
      "Then S proves a sentence that says «I have no proof». The proof we just produced is a counter-witness. S has proved a false statement: ",
    step4BranchAHighlight: "S is inconsistent",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ contradiction.",
    step4BranchB: "Branch B · S ⊬ G",
    step4BranchBHead: "If G is not provable…",
    step4BranchBBodyPre: "Then what G claims is exactly true. G is a ",
    step4BranchBHighlight: "true statement of arithmetic",
    step4BranchBBodyPost: " that S cannot prove — the First Incompleteness Theorem.",
    step4BranchBArrow: "⇒ S is incomplete.",
    step4SecondLabel: "Second Incompleteness Theorem",
    step4SecondBody:
      "Let Con(S) be the arithmetic sentence «S is consistent». If S could prove Con(S), then — by formalising the argument above inside S — S could also prove G. So no consistent S that is rich enough for arithmetic can prove its own consistency.",
    step4Footer:
      "Same diagonal trick reappears in Tarski's undefinability of truth (1933), Turing's halting problem (1936), and Church's undecidability of first-order logic (1936). Modern proof assistants — Coq, Lean, Isabelle — all operate under Gödel's bounds.",
  },
  de: {
    stepTitles: [
      "Schritt 1 · Das Alphabet",
      "Schritt 2 · Eine Formel kodieren",
      "Schritt 3 · G konstruieren",
      "Schritt 4 · Beide Zweige",
    ],
    stepProgress: (n) => `Schritt ${n} / 4`,
    meanings: {
      not: "nicht",
      or: "oder",
      forall: "für alle",
      exists: "es existiert",
      equals: "gleich",
      zero: "null",
      successor: "Nachfolger",
      plus: "plus",
      open: "auf",
      close: "zu",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (wahr)",
      "0eq1": "0 = S0  (falsch)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Durch den Beweis gehen",
    sidebarStepBtn: "Schritt →",
    sidebarResetBtn: "Zurücksetzen",
    sidebarTryLabel: "Eine Formel ausprobieren",
    symbolsCount: (n) => `${n} Symbole`,
    sidebarHilbertLabel: "Hilberts Frage",
    sidebarHilbertBody1:
      "Lässt sich jede wahre arithmetische Aussage in einem einzigen formalen System beweisen? Gödels Antwort, 1931: ",
    sidebarHilbertNo: "nein",
    sidebarHilbertBody2: ".",
    step1Pretitle: "Das Alphabet der Arithmetik",
    step1Title: "Gib jedem Symbol eine Zahl.",
    step1Body:
      "Wähle eine beliebige sinnvolle Konvention. Hier sind zehn Symbole einer einfachen Arithmetik-Sprache, jedem ist eine natürliche Zahl zugeordnet. Sobald Symbole Zahlen sind, sind Folgen von Symbolen (also Formeln) Folgen von Zahlen — und jede Zahlenfolge lässt sich zu einer einzigen natürlichen Zahl zusammenpacken.",
    step1Code: "Code",
    step1Footer1: "Als Nächstes: Wähle eine kleine Formel wie ",
    step1Footer2: " oder ",
    step1Footer3: " aus der Seitenleiste und beobachte, wie ihre Gödel-Zahl entsteht.",
    step2Pretitle: "Die Formel kodieren",
    step2TitleSuffix: " wird zu einer einzigen Zahl.",
    step2Body1:
      "Nimm die Symbol-Codes c₁, c₂, …, cₖ und potenziere die aufeinanderfolgenden Primzahlen damit: ",
    step2Body2:
      " Die Primfaktorzerlegung ist eindeutig — die Kodierung ist also umkehrbar.",
    step2Code: "Code",
    step2Prime: "Primzahl",
    step2ProductLabel: "Produkt von Primzahlpotenzen",
    step2GoedelLabel: "Gödel-Zahl ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Jede Formel hat jetzt eine Zahl. Entscheidend: auch Aussagen ",
    step2FooterAboutWord: "über",
    step2FooterPost:
      " Formeln — etwa «x ist ein Beweis von y» — werden zu arithmetischen Prädikaten. Das System kann über sich selbst sprechen.",
    step3Pretitle: "Die diagonale Konstruktion",
    step3Title: "Baue einen Satz, der über seine eigene Zahl spricht.",
    step3BodyPre:
      "Gödels Diagonal-Lemma — ein Nachfahre von Cantors Diagonal-Argument von 1891 — liefert für jedes Prädikat ",
    step3BodyP: "P(x)",
    step3BodyMid: " einen Satz ",
    step3BodyG: "G",
    step3BodyTail: ", sodass G zu P(⌜G⌝) äquivalent ist. Wende es an mit ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "Der Satz",
    step3InPlain: "Im Klartext: ",
    step3PlainQuote:
      "«keine natürliche Zahl y ist ein Beweis der Formel mit Gödel-Zahl ⌜G⌝»",
    step3PlainTail: " — und die Formel mit Gödel-Zahl ⌜G⌝ ist G selbst.",
    step3LoopSentence: "Satz",
    step3LoopSentenceCaption: "«Ich bin nicht beweisbar»",
    step3DiagLemma: "Diagonal-Lemma",
    step3GoedelHash: "Gödel-Nr.",
    step3EncodesTo1: "(die hier gewählte Formel kodiert sich zu ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G verweist über die Gödel-Zahl auf sich selbst — keine verborgene Magie, nur Arithmetik. Jetzt die Frage: Ist G beweisbar?",
    step4Pretitle: "Beide Zweige führen aus Hilberts Traum heraus",
    step4Title: "Beweisbar oder unbeweisbar — so oder so: Unvollständigkeit.",
    step4BranchA: "Zweig A · S ⊢ G",
    step4BranchAHead: "Wenn G beweisbar ist…",
    step4BranchABodyPre:
      "Dann beweist S einen Satz, der sagt «Ich habe keinen Beweis». Der eben gefundene Beweis ist ein Gegenzeuge. S hat eine falsche Aussage bewiesen: ",
    step4BranchAHighlight: "S ist inkonsistent",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ Widerspruch.",
    step4BranchB: "Zweig B · S ⊬ G",
    step4BranchBHead: "Wenn G nicht beweisbar ist…",
    step4BranchBBodyPre: "Dann ist genau das, was G behauptet, wahr. G ist eine ",
    step4BranchBHighlight: "wahre arithmetische Aussage",
    step4BranchBBodyPost:
      ", die S nicht beweisen kann — der Erste Unvollständigkeitssatz.",
    step4BranchBArrow: "⇒ S ist unvollständig.",
    step4SecondLabel: "Zweiter Unvollständigkeitssatz",
    step4SecondBody:
      "Sei Con(S) der arithmetische Satz «S ist konsistent». Könnte S Con(S) beweisen, dann — durch Formalisierung des obigen Arguments innerhalb von S — könnte S auch G beweisen. Also kann kein konsistentes S, das reich genug für die Arithmetik ist, seine eigene Konsistenz beweisen.",
    step4Footer:
      "Derselbe Diagonaltrick taucht wieder auf in Tarskis Undefinierbarkeit der Wahrheit (1933), Turings Halteproblem (1936) und Churchs Unentscheidbarkeit der Prädikatenlogik (1936). Moderne Beweisassistenten — Coq, Lean, Isabelle — arbeiten alle innerhalb von Gödels Schranken.",
  },
  es: {
    stepTitles: [
      "Paso 1 · El alfabeto",
      "Paso 2 · Codifica una fórmula",
      "Paso 3 · Construye G",
      "Paso 4 · Ambas ramas",
    ],
    stepProgress: (n) => `Paso ${n} / 4`,
    meanings: {
      not: "no",
      or: "o",
      forall: "para todo",
      exists: "existe",
      equals: "igual",
      zero: "cero",
      successor: "sucesor",
      plus: "más",
      open: "abrir",
      close: "cerrar",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (verdadera)",
      "0eq1": "0 = S0  (falsa)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Recorre la demostración",
    sidebarStepBtn: "Paso →",
    sidebarResetBtn: "Reiniciar",
    sidebarTryLabel: "Prueba una fórmula",
    symbolsCount: (n) => `${n} símbolos`,
    sidebarHilbertLabel: "La pregunta de Hilbert",
    sidebarHilbertBody1:
      "¿Puede toda afirmación aritmética verdadera demostrarse dentro de un único sistema formal? Respuesta de Gödel, 1931: ",
    sidebarHilbertNo: "no",
    sidebarHilbertBody2: ".",
    step1Pretitle: "El alfabeto de la aritmética",
    step1Title: "Dale un número a cada símbolo.",
    step1Body:
      "Elige cualquier convención razonable. Aquí tienes diez símbolos de un lenguaje aritmético simple, cada uno con un número natural asignado. Una vez que los símbolos son números, las secuencias de símbolos (las fórmulas) son secuencias de números — y toda secuencia de números puede empaquetarse en un único número natural.",
    step1Code: "código",
    step1Footer1: "A continuación: elige una pequeña fórmula como ",
    step1Footer2: " o ",
    step1Footer3:
      " en la barra lateral y observa cómo se construye su número de Gödel.",
    step2Pretitle: "Codificar la fórmula",
    step2TitleSuffix: " se convierte en un único número.",
    step2Body1:
      "Toma los códigos de los símbolos c₁, c₂, …, cₖ y eleva primos consecutivos a ellos: ",
    step2Body2:
      " La factorización en primos es única — así que la codificación es reversible.",
    step2Code: "código",
    step2Prime: "primo",
    step2ProductLabel: "Producto de potencias de primos",
    step2GoedelLabel: "Número de Gödel ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Ahora toda fórmula tiene un número. Lo crucial: las afirmaciones ",
    step2FooterAboutWord: "sobre",
    step2FooterPost:
      " fórmulas — como «x es una demostración de y» — también se vuelven predicados aritméticos. El sistema puede hablar de sí mismo.",
    step3Pretitle: "La construcción diagonal",
    step3Title: "Construye una sentencia que habla de su propio número.",
    step3BodyPre:
      "El lema diagonal de Gödel — descendiente del argumento diagonal de Cantor de 1891 — produce, para cualquier predicado ",
    step3BodyP: "P(x)",
    step3BodyMid: ", una sentencia ",
    step3BodyG: "G",
    step3BodyTail:
      " tal que G es equivalente a P(⌜G⌝). Aplícalo con ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "La sentencia",
    step3InPlain: "En lenguaje llano: ",
    step3PlainQuote:
      "«ningún número natural y es una demostración de la fórmula con número de Gödel ⌜G⌝»",
    step3PlainTail:
      " — y la fórmula con número de Gödel ⌜G⌝ es G misma.",
    step3LoopSentence: "sentencia",
    step3LoopSentenceCaption: "«No soy demostrable»",
    step3DiagLemma: "lema diagonal",
    step3GoedelHash: "Nº Gödel",
    step3EncodesTo1: "(la fórmula elegida aquí se codifica como ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G se refiere a sí misma a través del número de Gödel — no hay magia oculta, solo aritmética. Ahora pregunta: ¿es G demostrable?",
    step4Pretitle: "Ambas ramas salen del sueño de Hilbert",
    step4Title: "Demostrable o indemostrable — de un modo u otro, incompletud.",
    step4BranchA: "Rama A · S ⊢ G",
    step4BranchAHead: "Si G es demostrable…",
    step4BranchABodyPre:
      "Entonces S demuestra una sentencia que dice «no tengo demostración». La demostración que acabamos de producir es un contratestigo. S ha demostrado una afirmación falsa: ",
    step4BranchAHighlight: "S es inconsistente",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ contradicción.",
    step4BranchB: "Rama B · S ⊬ G",
    step4BranchBHead: "Si G no es demostrable…",
    step4BranchBBodyPre:
      "Entonces lo que G afirma es exactamente verdadero. G es una ",
    step4BranchBHighlight: "afirmación aritmética verdadera",
    step4BranchBBodyPost:
      " que S no puede demostrar — el Primer Teorema de Incompletud.",
    step4BranchBArrow: "⇒ S es incompleto.",
    step4SecondLabel: "Segundo Teorema de Incompletud",
    step4SecondBody:
      "Sea Con(S) la sentencia aritmética «S es consistente». Si S pudiera demostrar Con(S), entonces — formalizando el argumento anterior dentro de S — S también podría demostrar G. Así que ningún S consistente lo bastante rico para la aritmética puede demostrar su propia consistencia.",
    step4Footer:
      "El mismo truco diagonal reaparece en la indefinibilidad de la verdad de Tarski (1933), el problema de la parada de Turing (1936) y la indecidibilidad de la lógica de primer orden de Church (1936). Los modernos asistentes de demostración — Coq, Lean, Isabelle — operan todos dentro de los límites de Gödel.",
  },
  fr: {
    stepTitles: [
      "Étape 1 · L'alphabet",
      "Étape 2 · Coder une formule",
      "Étape 3 · Construire G",
      "Étape 4 · Les deux branches",
    ],
    stepProgress: (n) => `Étape ${n} / 4`,
    meanings: {
      not: "non",
      or: "ou",
      forall: "pour tout",
      exists: "il existe",
      equals: "égal",
      zero: "zéro",
      successor: "successeur",
      plus: "plus",
      open: "ouvrir",
      close: "fermer",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (vraie)",
      "0eq1": "0 = S0  (fausse)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Parcourir la preuve",
    sidebarStepBtn: "Étape →",
    sidebarResetBtn: "Réinitialiser",
    sidebarTryLabel: "Essayer une formule",
    symbolsCount: (n) => `${n} symboles`,
    sidebarHilbertLabel: "La question de Hilbert",
    sidebarHilbertBody1:
      "Toute affirmation arithmétique vraie peut-elle être prouvée dans un seul système formel ? Réponse de Gödel, 1931 : ",
    sidebarHilbertNo: "non",
    sidebarHilbertBody2: ".",
    step1Pretitle: "L'alphabet de l'arithmétique",
    step1Title: "Donne un nombre à chaque symbole.",
    step1Body:
      "Choisis une convention raisonnable. Voici dix symboles d'un langage arithmétique simple, chacun associé à un nombre entier. Une fois que les symboles sont des nombres, les suites de symboles (c'est-à-dire les formules) sont des suites de nombres — et toute suite de nombres peut être empaquetée en un seul nombre entier.",
    step1Code: "code",
    step1Footer1: "Ensuite : choisis une petite formule comme ",
    step1Footer2: " ou ",
    step1Footer3:
      " dans la barre latérale et regarde son nombre de Gödel se construire.",
    step2Pretitle: "Coder la formule",
    step2TitleSuffix: " devient un seul nombre.",
    step2Body1:
      "Prends les codes des symboles c₁, c₂, …, cₖ et élève les nombres premiers consécutifs à ces puissances : ",
    step2Body2:
      " La factorisation en nombres premiers est unique — le codage est donc réversible.",
    step2Code: "code",
    step2Prime: "premier",
    step2ProductLabel: "Produit de puissances de premiers",
    step2GoedelLabel: "Nombre de Gödel ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Chaque formule a maintenant un nombre. Crucial : les énoncés ",
    step2FooterAboutWord: "sur",
    step2FooterPost:
      " les formules — comme «x est une preuve de y» — deviennent eux aussi des prédicats arithmétiques. Le système peut parler de lui-même.",
    step3Pretitle: "La construction diagonale",
    step3Title: "Construire un énoncé qui parle de son propre nombre.",
    step3BodyPre:
      "Le lemme de diagonalisation de Gödel — descendant de l'argument diagonal de Cantor de 1891 — produit, pour tout prédicat ",
    step3BodyP: "P(x)",
    step3BodyMid: ", un énoncé ",
    step3BodyG: "G",
    step3BodyTail:
      " tel que G est équivalent à P(⌜G⌝). Applique-le avec ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "L'énoncé",
    step3InPlain: "En langage clair : ",
    step3PlainQuote:
      "«aucun nombre entier y n'est une preuve de la formule de nombre de Gödel ⌜G⌝»",
    step3PlainTail:
      " — et la formule de nombre de Gödel ⌜G⌝ est G elle-même.",
    step3LoopSentence: "énoncé",
    step3LoopSentenceCaption: "«Je ne suis pas prouvable»",
    step3DiagLemma: "lemme diagonal",
    step3GoedelHash: "n° Gödel",
    step3EncodesTo1: "(la formule choisie ici se code en ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G se réfère à elle-même via le nombre de Gödel — pas de magie cachée, juste de l'arithmétique. Maintenant la question : G est-elle prouvable ?",
    step4Pretitle: "Les deux branches sortent du rêve de Hilbert",
    step4Title: "Prouvable ou non prouvable — quoi qu'il arrive, incomplétude.",
    step4BranchA: "Branche A · S ⊢ G",
    step4BranchAHead: "Si G est prouvable…",
    step4BranchABodyPre:
      "Alors S prouve un énoncé qui dit «je n'ai pas de preuve». La preuve qu'on vient de produire est un contre-témoin. S a prouvé une affirmation fausse : ",
    step4BranchAHighlight: "S est inconsistant",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ contradiction.",
    step4BranchB: "Branche B · S ⊬ G",
    step4BranchBHead: "Si G n'est pas prouvable…",
    step4BranchBBodyPre:
      "Alors ce que G affirme est exactement vrai. G est un ",
    step4BranchBHighlight: "énoncé arithmétique vrai",
    step4BranchBBodyPost:
      " que S ne peut pas prouver — le Premier Théorème d'incomplétude.",
    step4BranchBArrow: "⇒ S est incomplet.",
    step4SecondLabel: "Second Théorème d'incomplétude",
    step4SecondBody:
      "Soit Con(S) l'énoncé arithmétique «S est consistant». Si S pouvait prouver Con(S), alors — en formalisant l'argument précédent à l'intérieur de S — S pourrait aussi prouver G. Donc aucun S consistant assez riche pour l'arithmétique ne peut prouver sa propre consistance.",
    step4Footer:
      "Le même tour diagonal réapparaît dans l'indéfinissabilité de la vérité de Tarski (1933), le problème de l'arrêt de Turing (1936) et l'indécidabilité de la logique du premier ordre de Church (1936). Les assistants de preuve modernes — Coq, Lean, Isabelle — opèrent tous dans les bornes de Gödel.",
  },
  it: {
    stepTitles: [
      "Passo 1 · L'alfabeto",
      "Passo 2 · Codifica una formula",
      "Passo 3 · Costruisci G",
      "Passo 4 · Entrambi i rami",
    ],
    stepProgress: (n) => `Passo ${n} / 4`,
    meanings: {
      not: "non",
      or: "o",
      forall: "per ogni",
      exists: "esiste",
      equals: "uguale",
      zero: "zero",
      successor: "successore",
      plus: "più",
      open: "apri",
      close: "chiudi",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (vera)",
      "0eq1": "0 = S0  (falsa)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Percorri la dimostrazione",
    sidebarStepBtn: "Passo →",
    sidebarResetBtn: "Reimposta",
    sidebarTryLabel: "Prova una formula",
    symbolsCount: (n) => `${n} simboli`,
    sidebarHilbertLabel: "La domanda di Hilbert",
    sidebarHilbertBody1:
      "Si può dimostrare ogni affermazione aritmetica vera all'interno di un singolo sistema formale? Risposta di Gödel, 1931: ",
    sidebarHilbertNo: "no",
    sidebarHilbertBody2: ".",
    step1Pretitle: "L'alfabeto dell'aritmetica",
    step1Title: "Dài un numero a ogni simbolo.",
    step1Body:
      "Scegli una convenzione qualsiasi. Ecco dieci simboli di un semplice linguaggio aritmetico, a ciascuno è assegnato un numero naturale. Una volta che i simboli sono numeri, le sequenze di simboli (cioè le formule) sono sequenze di numeri — e ogni sequenza di numeri può essere impacchettata in un unico numero naturale.",
    step1Code: "codice",
    step1Footer1: "Prossimo passo: scegli una piccola formula come ",
    step1Footer2: " o ",
    step1Footer3:
      " dalla barra laterale e guarda costruirsi il suo numero di Gödel.",
    step2Pretitle: "Codifica la formula",
    step2TitleSuffix: " diventa un singolo numero.",
    step2Body1:
      "Prendi i codici dei simboli c₁, c₂, …, cₖ ed eleva i primi consecutivi a quelle potenze: ",
    step2Body2:
      " La fattorizzazione in primi è unica — la codifica è quindi reversibile.",
    step2Code: "codice",
    step2Prime: "primo",
    step2ProductLabel: "Prodotto di potenze di primi",
    step2GoedelLabel: "Numero di Gödel ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Ora ogni formula ha un numero. Soprattutto, gli enunciati ",
    step2FooterAboutWord: "sulle",
    step2FooterPost:
      " formule — come «x è una dimostrazione di y» — diventano anch'essi predicati aritmetici. Il sistema può parlare di sé stesso.",
    step3Pretitle: "La costruzione diagonale",
    step3Title: "Costruisci un enunciato che parla del proprio numero.",
    step3BodyPre:
      "Il lemma diagonale di Gödel — discendente dell'argomento diagonale di Cantor del 1891 — produce, per ogni predicato ",
    step3BodyP: "P(x)",
    step3BodyMid: ", un enunciato ",
    step3BodyG: "G",
    step3BodyTail:
      " tale che G è equivalente a P(⌜G⌝). Applicalo con ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "L'enunciato",
    step3InPlain: "In parole semplici: ",
    step3PlainQuote:
      "«nessun numero naturale y è una dimostrazione della formula con numero di Gödel ⌜G⌝»",
    step3PlainTail:
      " — e la formula con numero di Gödel ⌜G⌝ è G stessa.",
    step3LoopSentence: "enunciato",
    step3LoopSentenceCaption: "«Non sono dimostrabile»",
    step3DiagLemma: "lemma diagonale",
    step3GoedelHash: "n. Gödel",
    step3EncodesTo1: "(la formula scelta qui si codifica come ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G si riferisce a sé stessa attraverso il numero di Gödel — niente magia nascosta, solo aritmetica. Ora la domanda: G è dimostrabile?",
    step4Pretitle: "Entrambi i rami escono dal sogno di Hilbert",
    step4Title: "Dimostrabile o indimostrabile — in entrambi i casi, incompletezza.",
    step4BranchA: "Ramo A · S ⊢ G",
    step4BranchAHead: "Se G è dimostrabile…",
    step4BranchABodyPre:
      "Allora S dimostra un enunciato che dice «non ho dimostrazione». La dimostrazione appena prodotta è un contro-testimone. S ha dimostrato un'affermazione falsa: ",
    step4BranchAHighlight: "S è inconsistente",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ contraddizione.",
    step4BranchB: "Ramo B · S ⊬ G",
    step4BranchBHead: "Se G non è dimostrabile…",
    step4BranchBBodyPre:
      "Allora ciò che G afferma è esattamente vero. G è un ",
    step4BranchBHighlight: "enunciato aritmetico vero",
    step4BranchBBodyPost:
      " che S non può dimostrare — il Primo Teorema di Incompletezza.",
    step4BranchBArrow: "⇒ S è incompleto.",
    step4SecondLabel: "Secondo Teorema di Incompletezza",
    step4SecondBody:
      "Sia Con(S) l'enunciato aritmetico «S è consistente». Se S potesse dimostrare Con(S), allora — formalizzando l'argomento precedente dentro S — S potrebbe anche dimostrare G. Quindi nessun S consistente abbastanza ricco per l'aritmetica può dimostrare la propria consistenza.",
    step4Footer:
      "Lo stesso trucco diagonale riappare nell'indefinibilità della verità di Tarski (1933), nel problema dell'arresto di Turing (1936) e nell'indecidibilità della logica del primo ordine di Church (1936). I moderni assistenti di dimostrazione — Coq, Lean, Isabelle — operano tutti entro i limiti di Gödel.",
  },
  pt: {
    stepTitles: [
      "Passo 1 · O alfabeto",
      "Passo 2 · Codificar uma fórmula",
      "Passo 3 · Construir G",
      "Passo 4 · Ambos os ramos",
    ],
    stepProgress: (n) => `Passo ${n} / 4`,
    meanings: {
      not: "não",
      or: "ou",
      forall: "para todo",
      exists: "existe",
      equals: "igual",
      zero: "zero",
      successor: "sucessor",
      plus: "mais",
      open: "abrir",
      close: "fechar",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (verdadeira)",
      "0eq1": "0 = S0  (falsa)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Percorrer a prova",
    sidebarStepBtn: "Passo →",
    sidebarResetBtn: "Reiniciar",
    sidebarTryLabel: "Experimenta uma fórmula",
    symbolsCount: (n) => `${n} símbolos`,
    sidebarHilbertLabel: "A pergunta de Hilbert",
    sidebarHilbertBody1:
      "Poderá toda afirmação aritmética verdadeira ser provada dentro de um único sistema formal? Resposta de Gödel, 1931: ",
    sidebarHilbertNo: "não",
    sidebarHilbertBody2: ".",
    step1Pretitle: "O alfabeto da aritmética",
    step1Title: "Dá um número a cada símbolo.",
    step1Body:
      "Escolhe uma convenção razoável. Aqui estão dez símbolos de uma linguagem aritmética simples, cada um com um número natural atribuído. Quando os símbolos são números, as sequências de símbolos (isto é, as fórmulas) são sequências de números — e toda sequência de números pode ser empacotada num único número natural.",
    step1Code: "código",
    step1Footer1: "A seguir: escolhe uma pequena fórmula como ",
    step1Footer2: " ou ",
    step1Footer3:
      " da barra lateral e observa o seu número de Gödel ser construído.",
    step2Pretitle: "Codificar a fórmula",
    step2TitleSuffix: " torna-se um único número.",
    step2Body1:
      "Toma os códigos dos símbolos c₁, c₂, …, cₖ e eleva primos consecutivos a essas potências: ",
    step2Body2:
      " A fatoração em primos é única — a codificação é, portanto, reversível.",
    step2Code: "código",
    step2Prime: "primo",
    step2ProductLabel: "Produto de potências de primos",
    step2GoedelLabel: "Número de Gödel ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Agora toda fórmula tem um número. O crucial: as afirmações ",
    step2FooterAboutWord: "sobre",
    step2FooterPost:
      " fórmulas — como «x é uma prova de y» — também se tornam predicados aritméticos. O sistema pode falar de si próprio.",
    step3Pretitle: "A construção diagonal",
    step3Title: "Constrói uma frase que fala do seu próprio número.",
    step3BodyPre:
      "O lema diagonal de Gödel — descendente do argumento diagonal de Cantor de 1891 — produz, para qualquer predicado ",
    step3BodyP: "P(x)",
    step3BodyMid: ", uma frase ",
    step3BodyG: "G",
    step3BodyTail:
      " tal que G é equivalente a P(⌜G⌝). Aplica-o com ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "A frase",
    step3InPlain: "Em linguagem simples: ",
    step3PlainQuote:
      "«nenhum número natural y é uma prova da fórmula com número de Gödel ⌜G⌝»",
    step3PlainTail:
      " — e a fórmula com número de Gödel ⌜G⌝ é a própria G.",
    step3LoopSentence: "frase",
    step3LoopSentenceCaption: "«Não sou demonstrável»",
    step3DiagLemma: "lema diagonal",
    step3GoedelHash: "nº Gödel",
    step3EncodesTo1: "(a fórmula escolhida aqui codifica-se em ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G refere-se a si própria através do número de Gödel — não há magia escondida, apenas aritmética. Agora a pergunta: será G demonstrável?",
    step4Pretitle: "Ambos os ramos saem do sonho de Hilbert",
    step4Title: "Demonstrável ou indemonstrável — de qualquer modo, incompletude.",
    step4BranchA: "Ramo A · S ⊢ G",
    step4BranchAHead: "Se G for demonstrável…",
    step4BranchABodyPre:
      "Então S demonstra uma frase que diz «não tenho prova». A prova que acabámos de produzir é uma contra-testemunha. S demonstrou uma afirmação falsa: ",
    step4BranchAHighlight: "S é inconsistente",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ contradição.",
    step4BranchB: "Ramo B · S ⊬ G",
    step4BranchBHead: "Se G não for demonstrável…",
    step4BranchBBodyPre:
      "Então o que G afirma é exatamente verdadeiro. G é uma ",
    step4BranchBHighlight: "afirmação aritmética verdadeira",
    step4BranchBBodyPost:
      " que S não consegue demonstrar — o Primeiro Teorema da Incompletude.",
    step4BranchBArrow: "⇒ S é incompleto.",
    step4SecondLabel: "Segundo Teorema da Incompletude",
    step4SecondBody:
      "Seja Con(S) a frase aritmética «S é consistente». Se S pudesse demonstrar Con(S), então — formalizando o argumento anterior dentro de S — S também poderia demonstrar G. Logo, nenhum S consistente suficientemente rico para a aritmética pode demonstrar a sua própria consistência.",
    step4Footer:
      "O mesmo truque diagonal reaparece na indefinibilidade da verdade de Tarski (1933), no problema da paragem de Turing (1936) e na indecidibilidade da lógica de primeira ordem de Church (1936). Os modernos assistentes de prova — Coq, Lean, Isabelle — operam todos dentro dos limites de Gödel.",
  },
  sv: {
    stepTitles: [
      "Steg 1 · Alfabetet",
      "Steg 2 · Koda en formel",
      "Steg 3 · Bygg G",
      "Steg 4 · Båda grenarna",
    ],
    stepProgress: (n) => `Steg ${n} / 4`,
    meanings: {
      not: "icke",
      or: "eller",
      forall: "för alla",
      exists: "det finns",
      equals: "lika med",
      zero: "noll",
      successor: "efterföljare",
      plus: "plus",
      open: "öppen",
      close: "sluten",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (sann)",
      "0eq1": "0 = S0  (falsk)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Gå igenom beviset",
    sidebarStepBtn: "Steg →",
    sidebarResetBtn: "Återställ",
    sidebarTryLabel: "Pröva en formel",
    symbolsCount: (n) => `${n} symboler`,
    sidebarHilbertLabel: "Hilberts fråga",
    sidebarHilbertBody1:
      "Kan varje sann aritmetisk sats bevisas inom ett enda formellt system? Gödels svar, 1931: ",
    sidebarHilbertNo: "nej",
    sidebarHilbertBody2: ".",
    step1Pretitle: "Aritmetikens alfabet",
    step1Title: "Ge varje symbol ett tal.",
    step1Body:
      "Välj vilken rimlig konvention som helst. Här är tio symboler från ett enkelt aritmetiskt språk, var och en tilldelad ett naturligt tal. När symboler är tal är följder av symboler (dvs. formler) följder av tal — och varje följd av tal kan packas till ett enda naturligt tal.",
    step1Code: "kod",
    step1Footer1: "Härnäst: välj en liten formel som ",
    step1Footer2: " eller ",
    step1Footer3:
      " från sidopanelen och se dess Gödel-tal byggas upp.",
    step2Pretitle: "Koda formeln",
    step2TitleSuffix: " blir ett enda tal.",
    step2Body1:
      "Ta symbolkoderna c₁, c₂, …, cₖ och upphöj efterföljande primtal till dem: ",
    step2Body2:
      " Primfaktoriseringen är unik — så kodningen är reversibel.",
    step2Code: "kod",
    step2Prime: "primtal",
    step2ProductLabel: "Produkt av primpotenser",
    step2GoedelLabel: "Gödel-tal ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Varje formel har nu ett tal. Avgörande: påståenden ",
    step2FooterAboutWord: "om",
    step2FooterPost:
      " formler — som «x är ett bevis av y» — blir också aritmetiska predikat. Systemet kan tala om sig självt.",
    step3Pretitle: "Den diagonala konstruktionen",
    step3Title: "Bygg en sats som talar om sitt eget tal.",
    step3BodyPre:
      "Gödels diagonallemma — en ättling till Cantors diagonalargument från 1891 — producerar, för varje predikat ",
    step3BodyP: "P(x)",
    step3BodyMid: ", en sats ",
    step3BodyG: "G",
    step3BodyTail:
      " sådan att G är ekvivalent med P(⌜G⌝). Tillämpa det med ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "Satsen",
    step3InPlain: "På vanligt språk: ",
    step3PlainQuote:
      "«inget naturligt tal y är ett bevis av formeln med Gödel-tal ⌜G⌝»",
    step3PlainTail:
      " — och formeln med Gödel-tal ⌜G⌝ är G självt.",
    step3LoopSentence: "sats",
    step3LoopSentenceCaption: "«Jag är inte bevisbar»",
    step3DiagLemma: "diagonallemma",
    step3GoedelHash: "Gödel-nr",
    step3EncodesTo1: "(den valda formeln kodas här till ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G refererar till sig själv via Gödel-talet — ingen dold magi, bara aritmetik. Nu frågan: är G bevisbar?",
    step4Pretitle: "Båda grenarna leder ut ur Hilberts dröm",
    step4Title: "Bevisbar eller obevisbar — hur som helst: ofullständighet.",
    step4BranchA: "Gren A · S ⊢ G",
    step4BranchAHead: "Om G är bevisbar…",
    step4BranchABodyPre:
      "Då bevisar S en sats som säger «jag har inget bevis». Beviset vi just producerade är ett motvittne. S har bevisat en falsk sats: ",
    step4BranchAHighlight: "S är inkonsistent",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ motsägelse.",
    step4BranchB: "Gren B · S ⊬ G",
    step4BranchBHead: "Om G inte är bevisbar…",
    step4BranchBBodyPre: "Då är det G påstår precis sant. G är en ",
    step4BranchBHighlight: "sann aritmetisk sats",
    step4BranchBBodyPost:
      " som S inte kan bevisa — det Första ofullständighetsteoremet.",
    step4BranchBArrow: "⇒ S är ofullständigt.",
    step4SecondLabel: "Andra ofullständighetsteoremet",
    step4SecondBody:
      "Låt Con(S) vara den aritmetiska satsen «S är konsistent». Om S kunde bevisa Con(S), då — genom att formalisera argumentet ovan inom S — kunde S också bevisa G. Alltså kan inget konsistent S som är rikt nog för aritmetik bevisa sin egen konsistens.",
    step4Footer:
      "Samma diagonala trick återkommer i Tarskis odefinierbarhet av sanning (1933), Turings haltproblem (1936) och Churchs oavgörbarhet hos första ordningens logik (1936). Moderna bevisassistenter — Coq, Lean, Isabelle — arbetar alla inom Gödels gränser.",
  },
  no: {
    stepTitles: [
      "Steg 1 · Alfabetet",
      "Steg 2 · Kode en formel",
      "Steg 3 · Bygg G",
      "Steg 4 · Begge grenene",
    ],
    stepProgress: (n) => `Steg ${n} / 4`,
    meanings: {
      not: "ikke",
      or: "eller",
      forall: "for alle",
      exists: "det finnes",
      equals: "lik",
      zero: "null",
      successor: "etterfølger",
      plus: "pluss",
      open: "åpen",
      close: "lukket",
    },
    formulaLabels: {
      "0eq0": "0 = 0  (sann)",
      "0eq1": "0 = S0  (falsk)",
      neg0eq0: "¬(0 = 0)",
      forall: "∀x (0 = 0)",
    },
    sidebarWalkLabel: "Gå gjennom beviset",
    sidebarStepBtn: "Steg →",
    sidebarResetBtn: "Nullstill",
    sidebarTryLabel: "Prøv en formel",
    symbolsCount: (n) => `${n} symboler`,
    sidebarHilbertLabel: "Hilberts spørsmål",
    sidebarHilbertBody1:
      "Kan hver sann aritmetisk påstand bevises innenfor ett enkelt formelt system? Gödels svar, 1931: ",
    sidebarHilbertNo: "nei",
    sidebarHilbertBody2: ".",
    step1Pretitle: "Aritmetikkens alfabet",
    step1Title: "Gi hvert symbol et tall.",
    step1Body:
      "Velg en hvilken som helst fornuftig konvensjon. Her er ti symboler i et enkelt aritmetisk språk, hvert tilordnet et naturlig tall. Når symboler er tall, er følger av symboler (dvs. formler) følger av tall — og hver tallrekke kan pakkes inn i ett enkelt naturlig tall.",
    step1Code: "kode",
    step1Footer1: "Neste: velg en liten formel som ",
    step1Footer2: " eller ",
    step1Footer3:
      " fra sidepanelet og se Gödel-tallet bli bygd opp.",
    step2Pretitle: "Kod formelen",
    step2TitleSuffix: " blir et enkelt tall.",
    step2Body1:
      "Ta symbolkodene c₁, c₂, …, cₖ og opphøy etterfølgende primtall til disse: ",
    step2Body2:
      " Primtallsfaktoriseringen er unik — så kodingen er reversibel.",
    step2Code: "kode",
    step2Prime: "primtall",
    step2ProductLabel: "Produkt av primtallpotenser",
    step2GoedelLabel: "Gödel-tall ⌜φ⌝",
    step2FooterAbout: "",
    step2FooterPre: "Hver formel har nå et tall. Avgjørende: påstander ",
    step2FooterAboutWord: "om",
    step2FooterPost:
      " formler — som «x er et bevis av y» — blir også aritmetiske predikater. Systemet kan snakke om seg selv.",
    step3Pretitle: "Den diagonale konstruksjonen",
    step3Title: "Bygg en setning som snakker om sitt eget tall.",
    step3BodyPre:
      "Gödels diagonallemma — en etterkommer av Cantors diagonalargument fra 1891 — produserer, for ethvert predikat ",
    step3BodyP: "P(x)",
    step3BodyMid: ", en setning ",
    step3BodyG: "G",
    step3BodyTail:
      " slik at G er ekvivalent med P(⌜G⌝). Bruk det med ",
    step3PCode: "P(x) := ¬∃y Prov(y, x)",
    step3BodyEnd: ".",
    step3SentenceLabel: "Setningen",
    step3InPlain: "På klart språk: ",
    step3PlainQuote:
      "«ingen naturlige tall y er et bevis av formelen med Gödel-tall ⌜G⌝»",
    step3PlainTail:
      " — og formelen med Gödel-tall ⌜G⌝ er G selv.",
    step3LoopSentence: "setning",
    step3LoopSentenceCaption: "«Jeg er ikke bevisbar»",
    step3DiagLemma: "diagonallemma",
    step3GoedelHash: "Gödel-nr",
    step3EncodesTo1: "(den valgte formelen kodes her til ",
    step3EncodesTo2: ")",
    step3FooterBody:
      "G refererer til seg selv gjennom Gödel-tallet — ingen skjult magi, bare aritmetikk. Nå spørsmålet: er G bevisbar?",
    step4Pretitle: "Begge grenene fører ut av Hilberts drøm",
    step4Title: "Bevisbar eller ubevisbar — uansett: ufullstendighet.",
    step4BranchA: "Gren A · S ⊢ G",
    step4BranchAHead: "Hvis G er bevisbar…",
    step4BranchABodyPre:
      "Da beviser S en setning som sier «jeg har ikke noe bevis». Beviset vi nettopp produserte er et motvitne. S har bevist en falsk påstand: ",
    step4BranchAHighlight: "S er inkonsistent",
    step4BranchABodyPost: ".",
    step4BranchAArrow: "⇒ motsigelse.",
    step4BranchB: "Gren B · S ⊬ G",
    step4BranchBHead: "Hvis G ikke er bevisbar…",
    step4BranchBBodyPre: "Da er det G hevder akkurat sant. G er en ",
    step4BranchBHighlight: "sann aritmetisk påstand",
    step4BranchBBodyPost:
      " som S ikke kan bevise — det Første ufullstendighetsteoremet.",
    step4BranchBArrow: "⇒ S er ufullstendig.",
    step4SecondLabel: "Andre ufullstendighetsteorem",
    step4SecondBody:
      "La Con(S) være den aritmetiske setningen «S er konsistent». Hvis S kunne bevise Con(S), så — ved å formalisere argumentet over inne i S — kunne S også bevise G. Så ingen konsistent S som er rik nok for aritmetikk kan bevise sin egen konsistens.",
    step4Footer:
      "Det samme diagonale trikset dukker opp igjen i Tarskis udefinerbarhet av sannhet (1933), Turings stoppeproblem (1936) og Churchs uavgjørbarhet for førsteordens logikk (1936). Moderne bevisassistenter — Coq, Lean, Isabelle — opererer alle innenfor Gödels grenser.",
  },
};

export default function GodelExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.godel;
  const x = EXPLORER[locale];

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
              {x.stepTitles[step - 1]}
            </div>
            <div
              className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
            >
              G ⇔ ¬Prov(⌜G⌝)
            </div>
          </div>

          <div className="hairline flex-1 overflow-hidden rounded-2xl border bg-ink-950/80 p-6 md:p-10">
            {step === 1 && <StepAlphabet x={x} />}
            {step === 2 && <StepEncode formula={currentFormula} godel={encoded} x={x} />}
            {step === 3 && <StepBuildG godel={encoded} x={x} />}
            {step === 4 && <StepBranches x={x} />}
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
              {x.sidebarWalkLabel}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className={ACCENT}>{x.stepProgress(step)}</span>
              <span className="text-ink-300">{x.stepTitles[step - 1]}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={next}
                disabled={step >= 4}
                className="rounded-md border border-signal-violet/60 bg-signal-violet/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {x.sidebarStepBtn}
              </button>
              <button
                onClick={reset}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
              >
                {x.sidebarResetBtn}
              </button>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.sidebarTryLabel}
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
                  <div className="font-mono text-xs">{x.formulaLabels[f.labelKey]}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {x.symbolsCount(f.tokens.length)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-2 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.sidebarHilbertLabel}
            </div>
            <p className="text-xs leading-relaxed text-ink-200">
              {x.sidebarHilbertBody1}
              <span className={ACCENT}>{x.sidebarHilbertNo}</span>
              {x.sidebarHilbertBody2}
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
function StepAlphabet({ x }: { x: RichExplorer }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          {x.step1Pretitle}
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          {x.step1Title}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200">{x.step1Body}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {ALPHABET.map((sym) => (
          <div key={sym.glyph} className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3">
            <div className={`text-2xl ${ACCENT}`}>{sym.glyph}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              {x.meanings[sym.meaningKey]}
            </div>
            <div className="font-mono text-xs text-ink-100">
              {x.step1Code} {sym.code}
            </div>
          </div>
        ))}
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">
          {x.step1Footer1}
          <span className="font-mono text-ink-100">0 = 0</span>
          {x.step1Footer2}
          <span className="font-mono text-ink-100">¬(0 = 0)</span>
          {x.step1Footer3}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — encode a chosen formula.
// ---------------------------------------------------------------------------
function StepEncode({
  formula,
  godel,
  x,
}: {
  formula: FormulaChoice;
  godel: bigint;
  x: RichExplorer;
}) {
  const tokensWithCodes = formula.tokens.map((t) => ({
    glyph: t,
    code: lookupCode(t),
  }));
  const primes = PRIMES.slice(0, formula.tokens.length);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          {x.step2Pretitle}
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          <span className="font-mono">{formula.expr}</span>
          {x.step2TitleSuffix}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
          {x.step2Body1}
          <span className={ACCENT}>
            2<sup>c₁</sup> · 3<sup>c₂</sup> · 5<sup>c₃</sup> · …
          </span>
          {x.step2Body2}
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
                <div className="font-mono text-xs text-ink-300">{x.step2Code}</div>
                <div className="font-mono text-ink-100">{tk.code}</div>
              </div>
              <div className="font-mono text-xs text-ink-300">
                {x.step2Prime} <span className="text-ink-100">{primes[i]?.toString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hairline space-y-2 border-t pt-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {x.step2ProductLabel}
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
            {x.step2GoedelLabel}
          </div>
          <div className={`font-mono text-lg ${ACCENT} break-all`}>{fmt(godel)}</div>
        </div>
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">
          {x.step2FooterPre}
          <span className="text-ink-100">{x.step2FooterAboutWord}</span>
          {x.step2FooterPost}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — construct the self-referential G.
// ---------------------------------------------------------------------------
function StepBuildG({ godel, x }: { godel: bigint; x: RichExplorer }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          {x.step3Pretitle}
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          {x.step3Title}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
          {x.step3BodyPre}
          <span className="font-mono">{x.step3BodyP}</span>
          {x.step3BodyMid}
          <span className="font-mono">{x.step3BodyG}</span>
          {x.step3BodyTail}
          <span className="font-mono">{x.step3PCode}</span>
          {x.step3BodyEnd}
        </p>
      </div>

      <div className="hairline space-y-5 rounded-2xl border bg-ink-950/60 p-6">
        <div className="space-y-3 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {x.step3SentenceLabel}
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
            {x.step3InPlain}
            <span className="text-ink-100">{x.step3PlainQuote}</span>
            {x.step3PlainTail}
          </p>
        </div>

        <div className="hairline grid grid-cols-1 items-center gap-3 border-t pt-4 md:grid-cols-3">
          <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {x.step3LoopSentence}
            </div>
            <div className="math-italic text-2xl text-ink-100">G</div>
            <div className="text-xs text-ink-300">{x.step3LoopSentenceCaption}</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`text-3xl ${ACCENT}`}>↔</div>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.step3DiagLemma}
            </div>
          </div>
          <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {x.step3GoedelHash}
            </div>
            <div className="math-italic text-2xl text-ink-100">⌜G⌝</div>
            <div className="text-xs text-ink-300">
              {x.step3EncodesTo1}
              <span className="font-mono text-ink-100">{fmt(godel)}</span>
              {x.step3EncodesTo2}
            </div>
          </div>
        </div>
      </div>

      <div className="hairline mt-auto rounded-md border bg-ink-950/40 p-4">
        <p className="text-xs leading-relaxed text-ink-300">{x.step3FooterBody}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — the two-branch contradiction tree.
// ---------------------------------------------------------------------------
function StepBranches({ x }: { x: RichExplorer }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-2">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          {x.step4Pretitle}
        </div>
        <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
          {x.step4Title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-signal-rose/40 bg-signal-rose/5 p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
            {x.step4BranchA}
          </div>
          <h3 className="math-italic text-xl leading-tight text-ink-100">{x.step4BranchAHead}</h3>
          <p className="text-sm leading-relaxed text-ink-200">
            {x.step4BranchABodyPre}
            <span className="text-signal-rose">{x.step4BranchAHighlight}</span>
            {x.step4BranchABodyPost}
          </p>
          <div className="font-mono text-xs text-ink-300">{x.step4BranchAArrow}</div>
        </div>

        <div className="space-y-3 rounded-2xl border border-signal-violet/40 bg-signal-violet/5 p-5">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {x.step4BranchB}
          </div>
          <h3 className="math-italic text-xl leading-tight text-ink-100">{x.step4BranchBHead}</h3>
          <p className="text-sm leading-relaxed text-ink-200">
            {x.step4BranchBBodyPre}
            <span className={ACCENT}>{x.step4BranchBHighlight}</span>
            {x.step4BranchBBodyPost}
          </p>
          <div className="font-mono text-xs text-ink-300">{x.step4BranchBArrow}</div>
        </div>
      </div>

      <div className="hairline space-y-3 rounded-2xl border bg-ink-950/60 p-5">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          {x.step4SecondLabel}
        </div>
        <p className="text-sm leading-relaxed text-ink-200">{x.step4SecondBody}</p>
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
        <p className="text-xs leading-relaxed text-ink-300">{x.step4Footer}</p>
      </div>
    </div>
  );
}
