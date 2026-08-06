"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { parse, reduceTrace, PRESETS } from "@/lib/iota/reduce";
import { Info } from "@/components/Info";
import type { Locale } from "@/lib/i18n/types";

const INITIAL_MAX_STEPS = 40;
const STEP_LIMIT_MIN = 5;
const STEP_LIMIT_MAX = 200;

// The sidebar topic copy is localized via the atlas bundle; the reducer's own
// chrome (headings, tooltip, status) lives here per the repo's RICH_EXPLORER
// convention so every locale gets a fully translated tool, not English islands.
type ReducerChrome = {
  normalForm: string;
  ranOut: string;
  expression: string;
  info: string;
  trace: string;
  stepSingular: string;
  stepPlural: string;
  rulesHeading: string;
  rulesNote: string;
  examples: string;
  stepLimit: string;
  diverge: string;
};

const RICH_EXPLORER: Record<Locale, ReducerChrome> = {
  en: {
    normalForm: "normal form",
    ranOut: "ran out of steps",
    expression: "Expression",
    info: "Atoms: S, K, I, ι (or lowercase i). Whitespace separates terms; juxtaposition is left-associative application. Parentheses group.",
    trace: "Reduction trace",
    stepSingular: "step",
    stepPlural: "steps",
    rulesHeading: "Reduction rules",
    rulesNote:
      "Leftmost-outermost reduction. The first applicable rule at the topmost position fires per step.",
    examples: "Examples",
    stepLimit: "Step limit",
    diverge: "Some expressions diverge, so the trace stops at this many steps.",
  },
  de: {
    normalForm: "Normalform",
    ranOut: "keine Schritte mehr",
    expression: "Ausdruck",
    info: "Atome: S, K, I, ι (oder kleines i). Leerzeichen trennen Terme; Juxtaposition ist linksassoziative Anwendung. Klammern gruppieren.",
    trace: "Reduktionsspur",
    stepSingular: "Schritt",
    stepPlural: "Schritte",
    rulesHeading: "Reduktionsregeln",
    rulesNote:
      "Linksaußen-Reduktion. Pro Schritt feuert die erste anwendbare Regel an der obersten Position.",
    examples: "Beispiele",
    stepLimit: "Schrittlimit",
    diverge: "Manche Ausdrücke divergieren, daher stoppt die Spur nach so vielen Schritten.",
  },
  es: {
    normalForm: "forma normal",
    ranOut: "sin más pasos",
    expression: "Expresión",
    info: "Átomos: S, K, I, ι (o i minúscula). Los espacios separan términos; la yuxtaposición es aplicación asociativa por la izquierda. Los paréntesis agrupan.",
    trace: "Traza de reducción",
    stepSingular: "paso",
    stepPlural: "pasos",
    rulesHeading: "Reglas de reducción",
    rulesNote:
      "Reducción más-a-la-izquierda. En cada paso dispara la primera regla aplicable en la posición más alta.",
    examples: "Ejemplos",
    stepLimit: "Límite de pasos",
    diverge: "Algunas expresiones divergen, así que la traza se detiene en este número de pasos.",
  },
  fr: {
    normalForm: "forme normale",
    ranOut: "plus d'étapes",
    expression: "Expression",
    info: "Atomes : S, K, I, ι (ou i minuscule). Les espaces séparent les termes ; la juxtaposition est une application associative à gauche. Les parenthèses regroupent.",
    trace: "Trace de réduction",
    stepSingular: "étape",
    stepPlural: "étapes",
    rulesHeading: "Règles de réduction",
    rulesNote:
      "Réduction la-plus-à-gauche. À chaque étape, la première règle applicable à la position la plus haute se déclenche.",
    examples: "Exemples",
    stepLimit: "Limite d'étapes",
    diverge: "Certaines expressions divergent, donc la trace s'arrête à ce nombre d'étapes.",
  },
  it: {
    normalForm: "forma normale",
    ranOut: "passi esauriti",
    expression: "Espressione",
    info: "Atomi: S, K, I, ι (o i minuscola). Gli spazi separano i termini; la giustapposizione è applicazione associativa a sinistra. Le parentesi raggruppano.",
    trace: "Traccia di riduzione",
    stepSingular: "passo",
    stepPlural: "passi",
    rulesHeading: "Regole di riduzione",
    rulesNote:
      "Riduzione più-a-sinistra. A ogni passo scatta la prima regola applicabile nella posizione più alta.",
    examples: "Esempi",
    stepLimit: "Limite di passi",
    diverge: "Alcune espressioni divergono, quindi la traccia si ferma a questo numero di passi.",
  },
  pt: {
    normalForm: "forma normal",
    ranOut: "sem mais passos",
    expression: "Expressão",
    info: "Átomos: S, K, I, ι (ou i minúsculo). Os espaços separam termos; a justaposição é aplicação associativa à esquerda. Os parênteses agrupam.",
    trace: "Traço de redução",
    stepSingular: "passo",
    stepPlural: "passos",
    rulesHeading: "Regras de redução",
    rulesNote:
      "Redução mais-à-esquerda. Em cada passo dispara a primeira regra aplicável na posição mais alta.",
    examples: "Exemplos",
    stepLimit: "Limite de passos",
    diverge: "Algumas expressões divergem, por isso o traço para neste número de passos.",
  },
  sv: {
    normalForm: "normalform",
    ranOut: "slut på steg",
    expression: "Uttryck",
    info: "Atomer: S, K, I, ι (eller litet i). Mellanslag separerar termer; juxtaposition är vänsterassociativ applikation. Parenteser grupperar.",
    trace: "Reduktionsspår",
    stepSingular: "steg",
    stepPlural: "steg",
    rulesHeading: "Reduktionsregler",
    rulesNote:
      "Vänstermest-yttersta reduktion. Vid varje steg avfyras den första tillämpliga regeln på den översta positionen.",
    examples: "Exempel",
    stepLimit: "Steggräns",
    diverge: "Vissa uttryck divergerar, så spåret stannar vid så här många steg.",
  },
  no: {
    normalForm: "normalform",
    ranOut: "tom for steg",
    expression: "Uttrykk",
    info: "Atomer: S, K, I, ι (eller liten i). Mellomrom skiller termer; juxtaposisjon er venstreassosiativ anvendelse. Parenteser grupperer.",
    trace: "Reduksjonsspor",
    stepSingular: "steg",
    stepPlural: "steg",
    rulesHeading: "Reduksjonsregler",
    rulesNote:
      "Venstre-ytterste reduksjon. Ved hvert steg fyres den første anvendbare regelen på den øverste posisjonen.",
    examples: "Eksempler",
    stepLimit: "Steggrense",
    diverge: "Noen uttrykk divergerer, så sporet stopper ved så mange steg.",
  },
};

export default function IotaReducer() {
  const { locale, a, u } = useI18n();
  const topic = a.topics.iota;
  const chrome = RICH_EXPLORER[locale];
  const [src, setSrc] = useState(PRESETS[1].src);
  const [maxSteps, setMaxSteps] = useState(INITIAL_MAX_STEPS);

  const result = useMemo(() => {
    try {
      const tree = parse(src);
      const trace = reduceTrace(tree, maxSteps);
      return { ok: true as const, ...trace };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [src, maxSteps]);

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col bg-ink-950 p-6 lg:min-h-[calc(100vh-3.5rem)] lg:p-10">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              SKI · Iota reducer
            </div>
            {result.ok && (
              <div
                className={`glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 ${
                  result.normal ? "text-signal-cyan" : "text-signal-amber"
                }`}
              >
                {result.normal ? `✓ ${chrome.normalForm}` : `↺ ${chrome.ranOut}`}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {chrome.expression}
              <Info side="bottom">{chrome.info}</Info>
            </div>
            <textarea
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              rows={2}
              spellCheck={false}
              aria-label={chrome.expression}
              className="hairline w-full resize-none rounded-md border bg-ink-950/80 p-3 font-mono text-base text-ink-100 outline-none focus:border-signal-cyan/60"
            />
            {!result.ok && (
              <div className="mt-2 font-mono text-xs text-signal-rose">{result.error}</div>
            )}
          </div>

          {/* Trace */}
          {result.ok && (
            <div className="flex flex-1 flex-col">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {chrome.trace} · {result.steps.length}{" "}
                {result.steps.length === 1 ? chrome.stepSingular : chrome.stepPlural}
              </div>
              <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-2">
                {result.steps.map((step, i) => {
                  const isLast = i === result.steps.length - 1;
                  return (
                    <div
                      key={i}
                      className={`rounded-md border px-4 py-2 font-mono text-sm leading-relaxed ${
                        isLast
                          ? "border-signal-cyan/60 bg-signal-cyan/5 text-ink-100"
                          : "hairline bg-ink-950/40 text-ink-200"
                      }`}
                    >
                      <span className="mr-3 text-ink-400">{i.toString().padStart(2, "0")}</span>
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {chrome.rulesHeading}
            </div>
            <div className="hairline space-y-1.5 rounded-md border bg-ink-950/60 p-3 font-mono text-xs text-ink-100">
              <div>I x → x</div>
              <div>K x y → x</div>
              <div>S x y z → x z (y z)</div>
              <div className="text-signal-cyan">ι x → x S K</div>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-400">{chrome.rulesNote}</p>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {chrome.examples}
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSrc(p.src)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    src === p.src
                      ? "border-signal-cyan/60 bg-signal-cyan/10"
                      : "hairline hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="text-sm text-ink-100">{p.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">{p.src}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {chrome.stepLimit}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] text-signal-cyan">{maxSteps}</span>
              </div>
              <input
                type="range"
                value={maxSteps}
                min={STEP_LIMIT_MIN}
                max={STEP_LIMIT_MAX}
                step={1}
                onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                aria-label={chrome.stepLimit}
                className="w-full accent-signal-cyan"
              />
            </div>
            <p className="text-[11px] text-ink-400">{chrome.diverge}</p>
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
