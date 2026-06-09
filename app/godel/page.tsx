"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { Formula } from "@/components/Formula";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { GodelLoopHero } from "@/components/signature/GodelLoopHero";

// Long-form story page for Gödel's Incompleteness Theorems.
// Canonical hero + section copy lives in lib/i18n/stories.ts (s.pages.godel)
// so it stays in step with the multi-locale story bundle. The two inline
// figure panels (symbol-table + self-reference loop) carry their own
// per-locale strings via the RichFigures dict below.

const ACCENT = "text-signal-rose";

// A handful of symbols from the formal language, each with a Gödel number.
// Real Gödel numberings vary across sources; this table is illustrative and
// follows the textbook convention of small numbers for logical connectives
// and successive numbers for the equality/arithmetic constants.
// `meaningKey` is used to look up the per-locale translation in RichFigures.
type MeaningKey =
  | "not"
  | "or"
  | "forall"
  | "exists"
  | "equals"
  | "zero"
  | "successor"
  | "plus"
  | "times"
  | "open";

const GODEL_SYMBOL_TABLE: Array<{ symbol: string; meaningKey: MeaningKey; code: number }> = [
  { symbol: "¬", meaningKey: "not", code: 1 },
  { symbol: "∨", meaningKey: "or", code: 2 },
  { symbol: "∀", meaningKey: "forall", code: 3 },
  { symbol: "∃", meaningKey: "exists", code: 4 },
  { symbol: "=", meaningKey: "equals", code: 5 },
  { symbol: "0", meaningKey: "zero", code: 6 },
  { symbol: "S", meaningKey: "successor", code: 7 },
  { symbol: "+", meaningKey: "plus", code: 8 },
  { symbol: "·", meaningKey: "times", code: 9 },
  { symbol: "(", meaningKey: "open", code: 10 },
];

// --------------------------------------------------------------------------
// Per-locale strings for the two inline figure panels. Kept inline so the
// multi-locale prose lives with the page that owns it, rather than fattening
// the shared stories bundle (s.pages.godel already carries hero + sections).
// --------------------------------------------------------------------------

type RichFigures = {
  // figure 1 — symbol-code table
  numberingBadge: string;
  numberingIntro: string; // body up to the 2^s1·3^s2·5^s3·… formula
  numberingOutro: string; // tail after the formula (closing the sentence)
  thSymbol: string;
  thMeaning: string;
  thGodel: string;
  meanings: Record<MeaningKey, string>;
  // caption line under the table
  exampleHead: string; // "Example: the tiny formula"
  exampleMid: string; // "(symbols 0, =, 0 → codes 6, 5, 6) becomes the Gödel number"
  // figure 2 — self-reference loop
  loopBadge: string;
  loopIntro: string;
  loopSentence: string; // "sentence"
  loopSentenceCaption: string; // "«I am not provable in S»"
  loopArithEquiv: string; // "arithmetic equivalence"
  loopGoedelNumber: string; // "Gödel number"
  loopGoedelCaption: string; // "the natural number that encodes G itself"
  branchProvableHead: string; // "if G is provable"
  branchProvableBody: string;
  branchUnprovableHead: string; // "if G is not provable"
  branchUnprovableBody: string;
};

const FIGURES: Record<Locale, RichFigures> = {
  en: {
    numberingBadge: "Gödel numbering · a sample of symbol codes",
    numberingIntro: "Each symbol of the formal language gets its own natural number. A full formula s₁s₂s₃… is then encoded as the single integer ",
    numberingOutro: " — unique because every integer has a unique prime factorisation.",
    thSymbol: "symbol",
    thMeaning: "meaning",
    thGodel: "Gödel #",
    meanings: {
      not: "not",
      or: "or",
      forall: "for all",
      exists: "there exists",
      equals: "equals",
      zero: "zero",
      successor: "successor",
      plus: "plus",
      times: "times",
      open: "open",
    },
    exampleHead: "Example: the tiny formula",
    exampleMid: "(symbols 0, =, 0 → codes 6, 5, 6) becomes the Gödel number",
    loopBadge: "The self-reference loop",
    loopIntro:
      "G's content and G's Gödel number are wired together. G asserts that the formula numbered ⌜G⌝ has no proof — and the formula numbered ⌜G⌝ is G itself. The loop closes on the diagonal.",
    loopSentence: "sentence",
    loopSentenceCaption: "«I am not provable in S»",
    loopArithEquiv: "arithmetic equivalence",
    loopGoedelNumber: "Gödel number",
    loopGoedelCaption: "the natural number that encodes G itself",
    branchProvableHead: "if G is provable",
    branchProvableBody:
      "S proves a sentence that says «I have no proof» — the system is inconsistent.",
    branchUnprovableHead: "if G is not provable",
    branchUnprovableBody:
      "Then what G claims is exactly true — true, yet unprovable in S.",
  },
  de: {
    numberingBadge: "Gödel-Nummerierung · eine Auswahl von Symbol-Codes",
    numberingIntro:
      "Jedes Symbol der formalen Sprache bekommt seine eigene natürliche Zahl. Eine vollständige Formel s₁s₂s₃… wird dann als die einzelne Zahl ",
    numberingOutro:
      " kodiert — eindeutig, weil jede ganze Zahl eine eindeutige Primfaktorzerlegung hat.",
    thSymbol: "Symbol",
    thMeaning: "Bedeutung",
    thGodel: "Gödel-Nr.",
    meanings: {
      not: "nicht",
      or: "oder",
      forall: "für alle",
      exists: "es existiert",
      equals: "gleich",
      zero: "null",
      successor: "Nachfolger",
      plus: "plus",
      times: "mal",
      open: "auf",
    },
    exampleHead: "Beispiel: die winzige Formel",
    exampleMid: "(Symbole 0, =, 0 → Codes 6, 5, 6) wird zur Gödel-Zahl",
    loopBadge: "Die Selbstbezugsschleife",
    loopIntro:
      "Inhalt und Gödel-Zahl von G sind miteinander verdrahtet. G behauptet, dass die Formel mit der Nummer ⌜G⌝ keinen Beweis hat — und die Formel mit der Nummer ⌜G⌝ ist G selbst. Die Schleife schließt sich auf der Diagonale.",
    loopSentence: "Satz",
    loopSentenceCaption: "«Ich bin in S nicht beweisbar»",
    loopArithEquiv: "arithmetische Äquivalenz",
    loopGoedelNumber: "Gödel-Zahl",
    loopGoedelCaption: "die natürliche Zahl, die G selbst kodiert",
    branchProvableHead: "wenn G beweisbar ist",
    branchProvableBody:
      "S beweist einen Satz, der sagt «Ich habe keinen Beweis» — das System ist inkonsistent.",
    branchUnprovableHead: "wenn G nicht beweisbar ist",
    branchUnprovableBody:
      "Dann ist genau das, was G behauptet, wahr — wahr, aber in S unbeweisbar.",
  },
  es: {
    numberingBadge: "Numeración de Gödel · una muestra de códigos de símbolos",
    numberingIntro:
      "Cada símbolo del lenguaje formal recibe su propio número natural. Una fórmula completa s₁s₂s₃… se codifica entonces como el único entero ",
    numberingOutro:
      " — único porque todo entero tiene una factorización en primos única.",
    thSymbol: "símbolo",
    thMeaning: "significado",
    thGodel: "Nº Gödel",
    meanings: {
      not: "no",
      or: "o",
      forall: "para todo",
      exists: "existe",
      equals: "igual",
      zero: "cero",
      successor: "sucesor",
      plus: "más",
      times: "por",
      open: "abrir",
    },
    exampleHead: "Ejemplo: la pequeña fórmula",
    exampleMid: "(símbolos 0, =, 0 → códigos 6, 5, 6) se convierte en el número de Gödel",
    loopBadge: "El bucle de autorreferencia",
    loopIntro:
      "El contenido de G y el número de Gödel de G están conectados. G afirma que la fórmula con número ⌜G⌝ no tiene demostración — y la fórmula con número ⌜G⌝ es G misma. El bucle se cierra en la diagonal.",
    loopSentence: "sentencia",
    loopSentenceCaption: "«No soy demostrable en S»",
    loopArithEquiv: "equivalencia aritmética",
    loopGoedelNumber: "número de Gödel",
    loopGoedelCaption: "el número natural que codifica a G misma",
    branchProvableHead: "si G es demostrable",
    branchProvableBody:
      "S demuestra una sentencia que dice «no tengo demostración» — el sistema es inconsistente.",
    branchUnprovableHead: "si G no es demostrable",
    branchUnprovableBody:
      "Entonces lo que G afirma es exactamente verdadero — verdadero, pero indemostrable en S.",
  },
  fr: {
    numberingBadge: "Numérotation de Gödel · un échantillon de codes de symboles",
    numberingIntro:
      "Chaque symbole du langage formel reçoit son propre nombre entier. Une formule complète s₁s₂s₃… est alors codée par l'unique entier ",
    numberingOutro:
      " — unique parce que tout entier admet une factorisation en nombres premiers unique.",
    thSymbol: "symbole",
    thMeaning: "signification",
    thGodel: "n° Gödel",
    meanings: {
      not: "non",
      or: "ou",
      forall: "pour tout",
      exists: "il existe",
      equals: "égal",
      zero: "zéro",
      successor: "successeur",
      plus: "plus",
      times: "fois",
      open: "ouvrir",
    },
    exampleHead: "Exemple : la minuscule formule",
    exampleMid: "(symboles 0, =, 0 → codes 6, 5, 6) devient le nombre de Gödel",
    loopBadge: "La boucle d'autoréférence",
    loopIntro:
      "Le contenu de G et le nombre de Gödel de G sont câblés ensemble. G affirme que la formule numérotée ⌜G⌝ n'a pas de preuve — et la formule numérotée ⌜G⌝ est G elle-même. La boucle se referme sur la diagonale.",
    loopSentence: "énoncé",
    loopSentenceCaption: "«Je ne suis pas prouvable dans S»",
    loopArithEquiv: "équivalence arithmétique",
    loopGoedelNumber: "nombre de Gödel",
    loopGoedelCaption: "le nombre entier qui code G elle-même",
    branchProvableHead: "si G est prouvable",
    branchProvableBody:
      "S prouve un énoncé qui dit «je n'ai pas de preuve» — le système est inconsistant.",
    branchUnprovableHead: "si G n'est pas prouvable",
    branchUnprovableBody:
      "Alors ce que G affirme est exactement vrai — vrai, mais non prouvable dans S.",
  },
  it: {
    numberingBadge: "Numerazione di Gödel · un campione di codici di simboli",
    numberingIntro:
      "Ogni simbolo del linguaggio formale riceve il proprio numero naturale. Una formula completa s₁s₂s₃… viene poi codificata come l'unico intero ",
    numberingOutro:
      " — unico perché ogni intero ha una fattorizzazione in primi unica.",
    thSymbol: "simbolo",
    thMeaning: "significato",
    thGodel: "n. Gödel",
    meanings: {
      not: "non",
      or: "o",
      forall: "per ogni",
      exists: "esiste",
      equals: "uguale",
      zero: "zero",
      successor: "successore",
      plus: "più",
      times: "per",
      open: "apri",
    },
    exampleHead: "Esempio: la minuscola formula",
    exampleMid: "(simboli 0, =, 0 → codici 6, 5, 6) diventa il numero di Gödel",
    loopBadge: "Il ciclo di autoreferenza",
    loopIntro:
      "Il contenuto di G e il numero di Gödel di G sono cablati insieme. G afferma che la formula numerata ⌜G⌝ non ha dimostrazione — e la formula numerata ⌜G⌝ è G stessa. Il ciclo si chiude sulla diagonale.",
    loopSentence: "enunciato",
    loopSentenceCaption: "«Non sono dimostrabile in S»",
    loopArithEquiv: "equivalenza aritmetica",
    loopGoedelNumber: "numero di Gödel",
    loopGoedelCaption: "il numero naturale che codifica G stessa",
    branchProvableHead: "se G è dimostrabile",
    branchProvableBody:
      "S dimostra un enunciato che dice «non ho dimostrazione» — il sistema è inconsistente.",
    branchUnprovableHead: "se G non è dimostrabile",
    branchUnprovableBody:
      "Allora ciò che G afferma è esattamente vero — vero, ma indimostrabile in S.",
  },
  pt: {
    numberingBadge: "Numeração de Gödel · uma amostra de códigos de símbolos",
    numberingIntro:
      "Cada símbolo da linguagem formal recebe o seu próprio número natural. Uma fórmula completa s₁s₂s₃… é então codificada como o único inteiro ",
    numberingOutro:
      " — único porque todo inteiro tem uma fatoração em primos única.",
    thSymbol: "símbolo",
    thMeaning: "significado",
    thGodel: "nº Gödel",
    meanings: {
      not: "não",
      or: "ou",
      forall: "para todo",
      exists: "existe",
      equals: "igual",
      zero: "zero",
      successor: "sucessor",
      plus: "mais",
      times: "vezes",
      open: "abrir",
    },
    exampleHead: "Exemplo: a pequena fórmula",
    exampleMid: "(símbolos 0, =, 0 → códigos 6, 5, 6) torna-se o número de Gödel",
    loopBadge: "O ciclo de autorreferência",
    loopIntro:
      "O conteúdo de G e o número de Gödel de G estão interligados. G afirma que a fórmula numerada ⌜G⌝ não tem prova — e a fórmula numerada ⌜G⌝ é a própria G. O ciclo fecha-se na diagonal.",
    loopSentence: "frase",
    loopSentenceCaption: "«Não sou demonstrável em S»",
    loopArithEquiv: "equivalência aritmética",
    loopGoedelNumber: "número de Gödel",
    loopGoedelCaption: "o número natural que codifica a própria G",
    branchProvableHead: "se G for demonstrável",
    branchProvableBody:
      "S demonstra uma frase que diz «não tenho prova» — o sistema é inconsistente.",
    branchUnprovableHead: "se G não for demonstrável",
    branchUnprovableBody:
      "Então o que G afirma é exatamente verdadeiro — verdadeiro, mas indemonstrável em S.",
  },
  sv: {
    numberingBadge: "Gödelnumrering · ett urval av symbolkoder",
    numberingIntro:
      "Varje symbol i det formella språket får sitt eget naturliga tal. En fullständig formel s₁s₂s₃… kodas sedan som det enda heltalet ",
    numberingOutro:
      " — unikt eftersom varje heltal har en unik primtalsfaktorisering.",
    thSymbol: "symbol",
    thMeaning: "betydelse",
    thGodel: "Gödel-nr",
    meanings: {
      not: "icke",
      or: "eller",
      forall: "för alla",
      exists: "det finns",
      equals: "lika med",
      zero: "noll",
      successor: "efterföljare",
      plus: "plus",
      times: "gånger",
      open: "öppen",
    },
    exampleHead: "Exempel: den lilla formeln",
    exampleMid: "(symboler 0, =, 0 → koder 6, 5, 6) blir Gödel-talet",
    loopBadge: "Självreferensens slinga",
    loopIntro:
      "Innehållet i G och Gödel-talet för G är sammankopplade. G påstår att formeln med nummer ⌜G⌝ saknar bevis — och formeln med nummer ⌜G⌝ är G självt. Slingan sluts på diagonalen.",
    loopSentence: "sats",
    loopSentenceCaption: "«Jag är inte bevisbar i S»",
    loopArithEquiv: "aritmetisk ekvivalens",
    loopGoedelNumber: "Gödel-tal",
    loopGoedelCaption: "det naturliga tal som kodar G självt",
    branchProvableHead: "om G är bevisbar",
    branchProvableBody:
      "S bevisar en sats som säger «jag har inget bevis» — systemet är inkonsistent.",
    branchUnprovableHead: "om G inte är bevisbar",
    branchUnprovableBody:
      "Då är det som G påstår precis sant — sant, men obevisbart i S.",
  },
  no: {
    numberingBadge: "Gödelnummerering · et utvalg av symbolkoder",
    numberingIntro:
      "Hvert symbol i det formelle språket får sitt eget naturlige tall. En fullstendig formel s₁s₂s₃… kodes så som det ene heltallet ",
    numberingOutro:
      " — unikt fordi hvert heltall har en unik primtallsfaktorisering.",
    thSymbol: "symbol",
    thMeaning: "betydning",
    thGodel: "Gödel-nr",
    meanings: {
      not: "ikke",
      or: "eller",
      forall: "for alle",
      exists: "det finnes",
      equals: "lik",
      zero: "null",
      successor: "etterfølger",
      plus: "pluss",
      times: "ganger",
      open: "åpen",
    },
    exampleHead: "Eksempel: den lille formelen",
    exampleMid: "(symboler 0, =, 0 → koder 6, 5, 6) blir Gödel-tallet",
    loopBadge: "Selvreferansens løkke",
    loopIntro:
      "Innholdet i G og Gödel-tallet til G er koblet sammen. G hevder at formelen med nummer ⌜G⌝ ikke har noe bevis — og formelen med nummer ⌜G⌝ er G selv. Løkken lukker seg på diagonalen.",
    loopSentence: "setning",
    loopSentenceCaption: "«Jeg er ikke bevisbar i S»",
    loopArithEquiv: "aritmetisk ekvivalens",
    loopGoedelNumber: "Gödel-tall",
    loopGoedelCaption: "det naturlige tallet som koder G selv",
    branchProvableHead: "hvis G er bevisbar",
    branchProvableBody:
      "S beviser en setning som sier «jeg har ikke noe bevis» — systemet er inkonsistent.",
    branchUnprovableHead: "hvis G ikke er bevisbar",
    branchUnprovableBody:
      "Da er det G hevder akkurat sant — sant, men ubevisbart i S.",
  },
};

export default function GodelStoryPage() {
  const { s, locale } = useI18n();
  const page = s.pages.godel;
  const [sec0, sec1, sec2, sec3] = page.sections;
  const f = FIGURES[locale];

  return (
    <StoryPageShell
      page={page}
      ctaHref="/godel/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="G ⇔ ¬Prov(⌜G⌝)"
      formulaLatex={"G \\;\\Leftrightarrow\\; \\neg\\,\\mathrm{Prov}(\\ulcorner G \\urcorner)"}
      finalLabel={s.storyLabels.stepIntoIt}
      signature={<GodelLoopHero />}
    >
      <section className="mx-auto max-w-3xl space-y-10">
        {/* Section 1 — Hilbert's dream */}
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />

        {/* Section 2 — Gödel numbering, with a visual table of symbol codes */}
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />

        <Reveal>
          <div className="hairline glass space-y-5 rounded-2xl border p-6 md:p-8">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {f.numberingBadge}
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-200">
              {f.numberingIntro}2<sup>s₁</sup>·3<sup>s₂</sup>·5<sup>s₃</sup>·…{f.numberingOutro}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="hairline border-b text-left text-ink-400">
                    <th className="py-2 pr-4">{f.thSymbol}</th>
                    <th className="py-2 pr-4">{f.thMeaning}</th>
                    <th className="py-2 pr-4 text-right">{f.thGodel}</th>
                  </tr>
                </thead>
                <tbody>
                  {GODEL_SYMBOL_TABLE.map((row) => (
                    <tr
                      key={row.symbol}
                      className="hairline border-b transition-colors last:border-b-0 hover:bg-signal-rose/5"
                    >
                      <td className={`py-2 pr-4 text-lg ${ACCENT}`}>{row.symbol}</td>
                      <td className="py-2 pr-4 text-ink-200">{f.meanings[row.meaningKey]}</td>
                      <td className="py-2 pr-4 text-right text-ink-100">{row.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="hairline border-t pt-2">
              <p className="text-xs leading-relaxed text-ink-300">
                {f.exampleHead} <span className="font-mono text-ink-100">0 = 0</span>{" "}
                {f.exampleMid}
                <span className={`font-mono ${ACCENT} ml-2`}>
                  2<sup>6</sup>·3<sup>5</sup>·5<sup>6</sup> = 64 · 243 · 15625 = 243 000 000.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Section 3 — The diagonal trick, with a self-reference loop diagram */}
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />

        <Reveal>
          <div className="hairline glass space-y-6 rounded-2xl border p-6 md:p-8">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {f.loopBadge}
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-200">{f.loopIntro}</p>
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <div className="hairline space-y-2 rounded-lg border bg-ink-950/60 p-5">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {f.loopSentence}
                </div>
                <div className="math-italic text-2xl text-ink-100">G</div>
                <div className="text-xs leading-relaxed text-ink-300">{f.loopSentenceCaption}</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className={`font-mono text-3xl ${ACCENT}`}>↔</div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {f.loopArithEquiv}
                </div>
                <div className={ACCENT}>
                  <Formula
                    expression={"\\neg\\,\\exists x\\;\\mathrm{Prov}(x,\\ulcorner G \\urcorner)"}
                    size="md"
                  />
                </div>
              </div>
              <div className="hairline space-y-2 rounded-lg border bg-ink-950/60 p-5">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {f.loopGoedelNumber}
                </div>
                <div className="math-italic text-2xl text-ink-100">⌜G⌝</div>
                <div className="text-xs leading-relaxed text-ink-300">{f.loopGoedelCaption}</div>
              </div>
            </div>
            <div className="hairline grid grid-cols-1 gap-3 border-t pt-3 text-xs md:grid-cols-2">
              <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-3">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {f.branchProvableHead}
                </div>
                <div className="leading-relaxed text-ink-200">{f.branchProvableBody}</div>
              </div>
              <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-3">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {f.branchUnprovableHead}
                </div>
                <div className="leading-relaxed text-ink-200">{f.branchUnprovableBody}</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Section 4 — Where it spread */}
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>
    </StoryPageShell>
  );
}
