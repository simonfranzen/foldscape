"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { MobiusStripHero } from "@/components/signature/MobiusStripHero";

const ACCENT = "text-signal-amber";

// Per-locale strings for the gluing-identification diagram. Kept inline so
// the translations live with the diagram they label.
type RichStory = {
  diagramPretitle: string;
  diagramTitle: string;
  svgAria: string;
  identifyRule: string;
  caption: string;
  paragraph: string;
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: {
    diagramPretitle: "Diagram · the gluing identification",
    diagramTitle: "A rectangle with two arrows pointing the opposite way.",
    svgAria:
      "Flat rectangle with the two short edges identified with opposite orientation, producing a Möbius strip",
    identifyRule: "identify (0, y) ∼ (1, 1 − y)",
    caption:
      "the two short edges are glued with opposite orientation — that single flip is the whole story",
    paragraph:
      "A Möbius strip is the quotient of the unit square [0, 1] × [0, 1] under the relation (0, y) ∼ (1, 1 − y): glue the two short sides together after flipping one. The two long sides remain free, but they meet up at the join — what looked like two boundary curves is in fact a single edge. The same diagram for the Klein bottle would add a second identification, gluing the long sides as well (this time with the same orientation), removing every boundary at once.",
  },
  de: {
    diagramPretitle: "Diagramm · Identifikation der Klebung",
    diagramTitle: "Ein Rechteck mit zwei Pfeilen, die in entgegengesetzte Richtungen zeigen.",
    svgAria:
      "Flaches Rechteck, dessen beide kurze Seiten mit entgegengesetzter Orientierung identifiziert werden — daraus entsteht ein Möbius-Band",
    identifyRule: "identifiziere (0, y) ∼ (1, 1 − y)",
    caption:
      "die beiden kurzen Seiten werden mit entgegengesetzter Orientierung verklebt — diese einzige Umkehrung ist die ganze Geschichte",
    paragraph:
      "Ein Möbius-Band ist der Quotient des Einheitsquadrats [0, 1] × [0, 1] unter der Relation (0, y) ∼ (1, 1 − y): die beiden kurzen Seiten werden nach einer Umkehrung verklebt. Die langen Seiten bleiben frei, treffen sich aber an der Naht — was wie zwei Randkurven aussah, ist in Wahrheit eine einzige Kante. Dasselbe Diagramm für die Klein-Flasche würde eine zweite Identifikation hinzufügen, die auch die langen Seiten verklebt (diesmal mit gleicher Orientierung), und damit jeden Rand entfernen.",
  },
  es: {
    diagramPretitle: "Diagrama · la identificación del pegado",
    diagramTitle: "Un rectángulo con dos flechas que apuntan en sentido opuesto.",
    svgAria:
      "Rectángulo plano cuyos dos lados cortos se identifican con orientación opuesta, produciendo una banda de Möbius",
    identifyRule: "identificar (0, y) ∼ (1, 1 − y)",
    caption:
      "los dos lados cortos se pegan con orientación opuesta — ese único giro es toda la historia",
    paragraph:
      "Una banda de Möbius es el cociente del cuadrado unidad [0, 1] × [0, 1] bajo la relación (0, y) ∼ (1, 1 − y): se pegan los dos lados cortos después de invertir uno. Los dos lados largos quedan libres, pero se encuentran en la junta — lo que parecían dos curvas frontera es en realidad un único borde. El mismo diagrama para la botella de Klein añadiría una segunda identificación pegando también los lados largos (esta vez con la misma orientación), eliminando toda frontera de golpe.",
  },
  fr: {
    diagramPretitle: "Diagramme · l'identification du collage",
    diagramTitle: "Un rectangle avec deux flèches pointant en sens opposés.",
    svgAria:
      "Rectangle plat dont les deux côtés courts sont identifiés avec orientation opposée, produisant un ruban de Möbius",
    identifyRule: "identifier (0, y) ∼ (1, 1 − y)",
    caption:
      "les deux côtés courts sont collés avec orientation opposée — ce seul retournement, c'est toute l'histoire",
    paragraph:
      "Un ruban de Möbius est le quotient du carré unité [0, 1] × [0, 1] par la relation (0, y) ∼ (1, 1 − y) : on colle les deux côtés courts après en avoir retourné un. Les deux côtés longs restent libres, mais se rejoignent à la jointure — ce qui ressemblait à deux courbes frontières est en fait une seule arête. Le même diagramme pour la bouteille de Klein ajouterait une seconde identification, collant aussi les côtés longs (cette fois avec la même orientation), supprimant toute frontière d'un coup.",
  },
  it: {
    diagramPretitle: "Diagramma · l'identificazione dell'incollaggio",
    diagramTitle: "Un rettangolo con due frecce che puntano in versi opposti.",
    svgAria:
      "Rettangolo piatto i cui due lati corti vengono identificati con orientamento opposto, producendo un nastro di Möbius",
    identifyRule: "identifica (0, y) ∼ (1, 1 − y)",
    caption:
      "i due lati corti vengono incollati con orientamento opposto — quell'unico ribaltamento è tutta la storia",
    paragraph:
      "Un nastro di Möbius è il quoziente del quadrato unitario [0, 1] × [0, 1] sotto la relazione (0, y) ∼ (1, 1 − y): i due lati corti vengono incollati dopo aver ribaltato uno. I due lati lunghi restano liberi, ma si incontrano alla giuntura — quelle che sembravano due curve di bordo sono in realtà un unico spigolo. Lo stesso diagramma per la bottiglia di Klein aggiungerebbe una seconda identificazione, incollando anche i lati lunghi (questa volta con lo stesso orientamento), eliminando ogni bordo in un colpo solo.",
  },
  pt: {
    diagramPretitle: "Diagrama · a identificação da colagem",
    diagramTitle: "Um retângulo com duas setas a apontar em sentidos opostos.",
    svgAria:
      "Retângulo plano cujos dois lados curtos são identificados com orientação oposta, produzindo uma faixa de Möbius",
    identifyRule: "identificar (0, y) ∼ (1, 1 − y)",
    caption:
      "os dois lados curtos são colados com orientação oposta — esse único virar é a história inteira",
    paragraph:
      "Uma faixa de Möbius é o quociente do quadrado unitário [0, 1] × [0, 1] pela relação (0, y) ∼ (1, 1 − y): cola-se os dois lados curtos depois de inverter um. Os dois lados longos ficam livres, mas encontram-se na junção — o que parecia duas curvas de fronteira é, de facto, uma única aresta. O mesmo diagrama para a garrafa de Klein acrescentaria uma segunda identificação, colando também os lados longos (desta vez com a mesma orientação), removendo toda a fronteira de uma só vez.",
  },
  sv: {
    diagramPretitle: "Diagram · sammanlimningens identifiering",
    diagramTitle: "En rektangel med två pilar som pekar åt motsatt håll.",
    svgAria:
      "Plan rektangel där de två korta sidorna identifieras med motsatt orientering, vilket ger ett Möbius-band",
    identifyRule: "identifiera (0, y) ∼ (1, 1 − y)",
    caption:
      "de två korta sidorna limmas ihop med motsatt orientering — den enda vändningen är hela poängen",
    paragraph:
      "Ett Möbius-band är kvoten av enhetskvadraten [0, 1] × [0, 1] under relationen (0, y) ∼ (1, 1 − y): de två korta sidorna limmas ihop efter att en vänts. De två långa sidorna förblir fria, men möts vid skarven — det som såg ut som två randkurvor är i själva verket en enda kant. Samma diagram för Kleinflaskan skulle lägga till en andra identifiering som även limmar samman de långa sidorna (denna gång med samma orientering), och därmed ta bort all rand på en gång.",
  },
  no: {
    diagramPretitle: "Diagram · sammenlimingens identifikasjon",
    diagramTitle: "Et rektangel med to piler som peker motsatt vei.",
    svgAria:
      "Flatt rektangel der de to korte sidene identifiseres med motsatt orientering, slik at det blir et Möbius-bånd",
    identifyRule: "identifiser (0, y) ∼ (1, 1 − y)",
    caption:
      "de to korte sidene limes sammen med motsatt orientering — den ene snuingen er hele poenget",
    paragraph:
      "Et Möbius-bånd er kvotienten av enhetskvadratet [0, 1] × [0, 1] under relasjonen (0, y) ∼ (1, 1 − y): de to korte sidene limes sammen etter at den ene er snudd. De to lange sidene forblir frie, men møtes ved skjøten — det som så ut som to randkurver er i virkeligheten én eneste kant. Det samme diagrammet for Kleinflasken ville lagt til en ny identifikasjon som også limer sammen de lange sidene (denne gangen med samme orientering), og fjerner dermed all rand på én gang.",
  },
};

export default function MobiusStoryPage() {
  const { s, locale } = useI18n();
  const page = s.pages.mobius;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/mobius/explorer"
      accent="text-signal-amber"
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="χ = 0,  one side,  one edge"
      formulaLatex={"\\chi = 0, \\quad \\text{one side}, \\quad \\text{one edge}"}
      finalLabel="Take it apart."
      signature={<MobiusStripHero />}
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Identification diagram: flat strip with the half-twist gluing arrows */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.diagramPretitle}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {story.diagramTitle}
          </h2>
          <div className="flex justify-center">
            <svg
              viewBox="0 0 640 280"
              role="img"
              aria-label={story.svgAria}
              className="h-auto w-full max-w-2xl"
            >
              {/* The flat rectangle */}
              <rect
                x="80"
                y="80"
                width="480"
                height="120"
                fill="rgba(167,139,250,0.08)"
                stroke="rgba(167,139,250,0.7)"
                strokeWidth="1.5"
              />

              {/* Top edge (free boundary) */}
              <line
                x1="80"
                y1="80"
                x2="560"
                y2="80"
                stroke="rgba(207,210,220,0.55)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              {/* Bottom edge (free boundary) */}
              <line
                x1="80"
                y1="200"
                x2="560"
                y2="200"
                stroke="rgba(207,210,220,0.55)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Left short edge with arrow pointing UP */}
              <line x1="80" y1="200" x2="80" y2="80" stroke="#a78bfa" strokeWidth="2.5" />
              <polygon points="80,76 74,90 86,90" fill="#a78bfa" />
              <text
                x="58"
                y="145"
                fill="#a78bfa"
                fontFamily="ui-monospace, monospace"
                fontSize="13"
              >
                ↑
              </text>

              {/* Right short edge with arrow pointing DOWN (opposite) */}
              <line x1="560" y1="80" x2="560" y2="200" stroke="#a78bfa" strokeWidth="2.5" />
              <polygon points="560,204 554,190 566,190" fill="#a78bfa" />
              <text
                x="572"
                y="145"
                fill="#a78bfa"
                fontFamily="ui-monospace, monospace"
                fontSize="13"
              >
                ↓
              </text>

              {/* Coordinates */}
              <text
                x="80"
                y="225"
                fill="#cfd2dc"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                textAnchor="middle"
              >
                (0, y)
              </text>
              <text
                x="560"
                y="225"
                fill="#cfd2dc"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                textAnchor="middle"
              >
                (1, 1−y)
              </text>
              <text
                x="80"
                y="70"
                fill="#8a90a4"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
              >
                0
              </text>
              <text
                x="560"
                y="70"
                fill="#8a90a4"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
              >
                1
              </text>

              {/* Identification rule */}
              <text
                x="320"
                y="40"
                fill="#a78bfa"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                textAnchor="middle"
              >
                {story.identifyRule}
              </text>

              {/* A traced loop showing the path */}
              <path
                d="M 110 140 Q 320 100 550 140"
                fill="none"
                stroke="rgba(255,209,102,0.85)"
                strokeWidth="1.4"
                strokeDasharray="2 4"
              />
              <text
                x="320"
                y="265"
                fill="#8a90a4"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                textAnchor="middle"
              >
                {story.caption}
              </text>
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-ink-300">{story.paragraph}</p>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
