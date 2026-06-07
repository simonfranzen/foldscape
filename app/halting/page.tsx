"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { Formula } from "@/components/Formula";
import { HaltingTapeHero } from "@/components/signature/HaltingTapeHero";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// Per-locale strings for the inline diagonal-program diagram. Kept inline so
// the multi-locale prose lives with the page that owns it, rather than
// fattening the shared stories bundle (s.pages.halting already carries hero
// + sections). The KaTeX formulae H(D, D) = ⊤ / ⊥ stay as math notation in
// the JSX and are not translated.
// --------------------------------------------------------------------------

type RichDiagram = {
  pretitle: string;
  heading: string;
  branchTrueLabel: string;
  branchTrueArrow: string;
  branchTrueContradiction: string;
  branchFalseLabel: string;
  branchFalseArrow: string;
  branchFalseContradiction: string;
  conclusionLabel: string;
  conclusionBody: string;
};

const DIAGRAM: Record<Locale, RichDiagram> = {
  en: {
    pretitle: "Diagram · the diagonal program D",
    heading: "Whatever H says about D on D, D does the opposite.",
    branchTrueLabel: "Branch ⊤",
    branchTrueArrow: "D loops forever on D",
    branchTrueContradiction: "But H said D halts. Contradiction.",
    branchFalseLabel: "Branch ⊥",
    branchFalseArrow: "D halts immediately on D",
    branchFalseContradiction: "But H said D loops. Contradiction.",
    conclusionLabel: "Conclusion",
    conclusionBody:
      "Both branches of the assumed halts oracle H break the definition of D. No total computable H can exist. The halting problem is undecidable.",
  },
  de: {
    pretitle: "Diagramm · das Diagonal-Programm D",
    heading: "Was immer H über D auf D sagt, D tut das Gegenteil.",
    branchTrueLabel: "Zweig ⊤",
    branchTrueArrow: "D läuft auf D in eine Endlosschleife",
    branchTrueContradiction: "Aber H sagte, D hält. Widerspruch.",
    branchFalseLabel: "Zweig ⊥",
    branchFalseArrow: "D hält sofort auf D",
    branchFalseContradiction: "Aber H sagte, D läuft endlos. Widerspruch.",
    conclusionLabel: "Schlussfolgerung",
    conclusionBody:
      "Beide Zweige des angenommenen Halte-Orakels H sprengen die Definition von D. Kein totales berechenbares H kann existieren. Das Halteproblem ist unentscheidbar.",
  },
  es: {
    pretitle: "Diagrama · el programa diagonal D",
    heading: "Diga lo que diga H sobre D aplicado a D, D hace lo contrario.",
    branchTrueLabel: "Rama ⊤",
    branchTrueArrow: "D bucla para siempre con D",
    branchTrueContradiction: "Pero H dijo que D se detiene. Contradicción.",
    branchFalseLabel: "Rama ⊥",
    branchFalseArrow: "D se detiene inmediatamente con D",
    branchFalseContradiction: "Pero H dijo que D bucla. Contradicción.",
    conclusionLabel: "Conclusión",
    conclusionBody:
      "Ambas ramas del supuesto oráculo de parada H rompen la definición de D. No puede existir ningún H total computable. El problema de la parada es indecidible.",
  },
  fr: {
    pretitle: "Diagramme · le programme diagonal D",
    heading: "Quoi que H dise de D sur D, D fait l'inverse.",
    branchTrueLabel: "Branche ⊤",
    branchTrueArrow: "D boucle indéfiniment sur D",
    branchTrueContradiction: "Mais H disait que D s'arrête. Contradiction.",
    branchFalseLabel: "Branche ⊥",
    branchFalseArrow: "D s'arrête immédiatement sur D",
    branchFalseContradiction: "Mais H disait que D boucle. Contradiction.",
    conclusionLabel: "Conclusion",
    conclusionBody:
      "Les deux branches de l'oracle d'arrêt supposé H brisent la définition de D. Aucun H total calculable ne peut exister. Le problème de l'arrêt est indécidable.",
  },
  it: {
    pretitle: "Diagramma · il programma diagonale D",
    heading: "Qualunque cosa H dica di D su D, D fa il contrario.",
    branchTrueLabel: "Ramo ⊤",
    branchTrueArrow: "D entra in un ciclo infinito su D",
    branchTrueContradiction: "Ma H diceva che D si ferma. Contraddizione.",
    branchFalseLabel: "Ramo ⊥",
    branchFalseArrow: "D si ferma immediatamente su D",
    branchFalseContradiction: "Ma H diceva che D entra in ciclo. Contraddizione.",
    conclusionLabel: "Conclusione",
    conclusionBody:
      "Entrambi i rami del presunto oracolo di arresto H rompono la definizione di D. Nessun H totale calcolabile può esistere. Il problema della terminazione è indecidibile.",
  },
  pt: {
    pretitle: "Diagrama · o programa diagonal D",
    heading: "Diga o que H disser sobre D em D, D faz o contrário.",
    branchTrueLabel: "Ramo ⊤",
    branchTrueArrow: "D entra em loop infinito em D",
    branchTrueContradiction: "Mas H disse que D para. Contradição.",
    branchFalseLabel: "Ramo ⊥",
    branchFalseArrow: "D para imediatamente em D",
    branchFalseContradiction: "Mas H disse que D entra em loop. Contradição.",
    conclusionLabel: "Conclusão",
    conclusionBody:
      "Ambos os ramos do suposto oráculo de paragem H quebram a definição de D. Não pode existir nenhum H total computável. O problema da paragem é indecidível.",
  },
  sv: {
    pretitle: "Diagram · det diagonala programmet D",
    heading: "Vad H än säger om D på D, gör D motsatsen.",
    branchTrueLabel: "Gren ⊤",
    branchTrueArrow: "D loopar i evighet på D",
    branchTrueContradiction: "Men H sa att D stannar. Motsägelse.",
    branchFalseLabel: "Gren ⊥",
    branchFalseArrow: "D stannar omedelbart på D",
    branchFalseContradiction: "Men H sa att D loopar. Motsägelse.",
    conclusionLabel: "Slutsats",
    conclusionBody:
      "Båda grenarna av det antagna stopporaklet H bryter mot definitionen av D. Inget totalt beräkningsbart H kan existera. Stoppproblemet är oavgörbart.",
  },
  no: {
    pretitle: "Diagram · det diagonale programmet D",
    heading: "Hva enn H sier om D på D, gjør D det motsatte.",
    branchTrueLabel: "Gren ⊤",
    branchTrueArrow: "D går i evig løkke på D",
    branchTrueContradiction: "Men H sa at D stopper. Motsigelse.",
    branchFalseLabel: "Gren ⊥",
    branchFalseArrow: "D stopper umiddelbart på D",
    branchFalseContradiction: "Men H sa at D går i løkke. Motsigelse.",
    conclusionLabel: "Konklusjon",
    conclusionBody:
      "Begge grenene av det antatte stopporakelet H bryter definisjonen av D. Ingen total beregnbar H kan eksistere. Stoppproblemet er uavgjørbart.",
  },
};

export default function HaltingStoryPage() {
  const { s, u, locale } = useI18n();
  const page = s.pages.halting;
  const [sec0, sec1, sec2, sec3] = page.sections;
  const d = DIAGRAM[locale];

  return (
    <StoryPageShell
      page={page}
      ctaHref="/halting/explorer"
      accent="text-signal-cyan"
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="halts(P, x) ∈ {⊤, ⊥}"
      formulaLatex={"\\mathrm{halts}(P, x) \\in \\{\\top, \\bot\\}"}
      finalLabel="Try it."
      signature={<HaltingTapeHero />}
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {d.pretitle}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {d.heading}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="hairline space-y-3 rounded-md border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                {d.branchTrueLabel}
              </div>
              <div className="text-sm leading-relaxed text-ink-100">
                <Formula expression="H(D, D) = \top" /> &nbsp;⇒&nbsp; {d.branchTrueArrow}
              </div>
              <div className="text-sm leading-relaxed text-ink-300">
                {d.branchTrueContradiction}
              </div>
            </div>
            <div className="hairline space-y-3 rounded-md border bg-ink-950/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                {d.branchFalseLabel}
              </div>
              <div className="text-sm leading-relaxed text-ink-100">
                <Formula expression="H(D, D) = \bot" /> &nbsp;⇒&nbsp; {d.branchFalseArrow}
              </div>
              <div className="text-sm leading-relaxed text-ink-300">
                {d.branchFalseContradiction}
              </div>
            </div>
          </div>
          <div className="space-y-2 rounded-md border border-signal-cyan/30 bg-signal-cyan/5 p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {d.conclusionLabel}
            </div>
            <p className="text-sm leading-relaxed text-ink-100">{d.conclusionBody}</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto mb-12 mt-8 max-w-3xl text-center">
          <Link
            href="/"
            className="hairline inline-block rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
          >
            {u.back}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
