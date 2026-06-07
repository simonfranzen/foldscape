"use client";

import { Reveal } from "@/components/Reveal";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-amber";

// Per-locale strings for the SVG figure block. Proper place-names (Kneiphof,
// Lomse) stay untranslated — they're historical Königsberg districts.
type FigureLabels = {
  pretitle: string;
  heading: string;
  northBank: string;
  southBank: string;
  deg: string;
  legendNote: string;
  caption: string;
};

const FIGURE: Record<Locale, FigureLabels> = {
  en: {
    pretitle: "The map, abstracted",
    heading: "Four land masses · seven bridges · four odd degrees",
    northBank: "north bank",
    southBank: "south bank",
    deg: "deg",
    legendNote: "seven bridges, four odd degrees",
    caption:
      "Drop the river, drop the streets, drop the angles. What remains is a graph. The degree of each vertex (5, 3, 3, 3) is the count of bridges touching that land mass — and the parity argument needs at most two of those numbers to be odd. Königsberg has four. The walk is impossible, and the impossibility is purely topological.",
  },
  de: {
    pretitle: "Die Karte, abstrahiert",
    heading: "Vier Landmassen · sieben Brücken · vier ungerade Grade",
    northBank: "Nordufer",
    southBank: "Südufer",
    deg: "Grad",
    legendNote: "sieben Brücken, vier ungerade Grade",
    caption:
      "Lass den Fluss weg, lass die Straßen weg, lass die Winkel weg. Was übrig bleibt, ist ein Graph. Der Grad jedes Knotens (5, 3, 3, 3) ist die Anzahl der Brücken, die diese Landmasse berühren — und das Paritätsargument verlangt, dass höchstens zwei dieser Zahlen ungerade sind. Königsberg hat vier. Der Spaziergang ist unmöglich, und die Unmöglichkeit ist rein topologisch.",
  },
  es: {
    pretitle: "El mapa, abstraído",
    heading: "Cuatro masas de tierra · siete puentes · cuatro grados impares",
    northBank: "orilla norte",
    southBank: "orilla sur",
    deg: "grado",
    legendNote: "siete puentes, cuatro grados impares",
    caption:
      "Quita el río, quita las calles, quita los ángulos. Lo que queda es un grafo. El grado de cada vértice (5, 3, 3, 3) es el número de puentes que tocan esa masa de tierra — y el argumento de paridad exige que como mucho dos de esos números sean impares. Königsberg tiene cuatro. El paseo es imposible, y la imposibilidad es puramente topológica.",
  },
  fr: {
    pretitle: "La carte, abstraite",
    heading: "Quatre masses de terre · sept ponts · quatre degrés impairs",
    northBank: "rive nord",
    southBank: "rive sud",
    deg: "deg",
    legendNote: "sept ponts, quatre degrés impairs",
    caption:
      "Retire la rivière, retire les rues, retire les angles. Ce qui reste est un graphe. Le degré de chaque sommet (5, 3, 3, 3) est le nombre de ponts qui touchent cette masse de terre — et l'argument de parité exige qu'au plus deux de ces nombres soient impairs. Königsberg en a quatre. La promenade est impossible, et l'impossibilité est purement topologique.",
  },
  it: {
    pretitle: "La mappa, astratta",
    heading: "Quattro masse di terra · sette ponti · quattro gradi dispari",
    northBank: "riva nord",
    southBank: "riva sud",
    deg: "grado",
    legendNote: "sette ponti, quattro gradi dispari",
    caption:
      "Togli il fiume, togli le strade, togli gli angoli. Ciò che resta è un grafo. Il grado di ogni vertice (5, 3, 3, 3) è il numero di ponti che toccano quella massa di terra — e l'argomento di parità richiede che al più due di quei numeri siano dispari. Königsberg ne ha quattro. La passeggiata è impossibile, e l'impossibilità è puramente topologica.",
  },
  pt: {
    pretitle: "O mapa, abstraído",
    heading: "Quatro massas de terra · sete pontes · quatro graus ímpares",
    northBank: "margem norte",
    southBank: "margem sul",
    deg: "grau",
    legendNote: "sete pontes, quatro graus ímpares",
    caption:
      "Tira o rio, tira as ruas, tira os ângulos. O que sobra é um grafo. O grau de cada vértice (5, 3, 3, 3) é o número de pontes que tocam essa massa de terra — e o argumento de paridade exige que no máximo dois desses números sejam ímpares. Königsberg tem quatro. O passeio é impossível, e a impossibilidade é puramente topológica.",
  },
  sv: {
    pretitle: "Kartan, abstraherad",
    heading: "Fyra landmassor · sju broar · fyra udda gradtal",
    northBank: "norra stranden",
    southBank: "södra stranden",
    deg: "grad",
    legendNote: "sju broar, fyra udda gradtal",
    caption:
      "Ta bort floden, ta bort gatorna, ta bort vinklarna. Det som blir kvar är en graf. Varje hörns gradtal (5, 3, 3, 3) är antalet broar som rör vid den landmassan — och paritetsargumentet kräver att högst två av talen är udda. Königsberg har fyra. Promenaden är omöjlig, och omöjligheten är rent topologisk.",
  },
  no: {
    pretitle: "Kartet, abstrahert",
    heading: "Fire landmasser · sju broer · fire odde gradtall",
    northBank: "nordbredden",
    southBank: "sørbredden",
    deg: "grad",
    legendNote: "sju broer, fire odde gradtall",
    caption:
      "Fjern elva, fjern gatene, fjern vinklene. Det som er igjen er en graf. Hvert hjørnes grad (5, 3, 3, 3) er antallet broer som berører den landmassen — og paritetsargumentet krever at høyst to av tallene er odde. Königsberg har fire. Spaserturen er umulig, og umuligheten er rent topologisk.",
  },
};

export default function KonigsbergStoryPage() {
  const { locale, s } = useI18n();
  const fig = FIGURE[locale];
  const page = s.pages.konigsberg;
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/konigsberg/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="Eulerian path ⇔ ≤ 2 odd-degree vertices"
      formulaLatex={
        "\\text{Eulerian path} \\;\\Leftrightarrow\\; \\#\\{v: \\deg(v) \\text{ odd}\\} \\leq 2"
      }
      finalLabel="Try the walk."
    >
      <section className="mx-auto mt-16 max-w-5xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />

        <Reveal>
          <figure className="glass hairline space-y-5 rounded-2xl border p-8 md:p-10">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {fig.pretitle}
            </div>
            <h2 className="math-italic text-2xl leading-tight md:text-3xl">{fig.heading}</h2>
            <div className="hairline overflow-hidden rounded-xl border bg-ink-950/60">
              <svg
                viewBox="0 0 800 480"
                className="block h-auto w-full"
                role="img"
                aria-label="The Königsberg graph: four vertices A, B, C, D with seven edges showing bridge multiplicities A-B: 2, A-C: 2, A-D: 1, B-D: 1, C-D: 1."
              >
                <defs>
                  <radialGradient id="kb-vert" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffd166" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffd166" stopOpacity="0.15" />
                  </radialGradient>
                </defs>

                {/* River suggestion — two horizontal blue washes */}
                <rect x="0" y="120" width="800" height="240" fill="rgba(125,243,255,0.04)" />
                <path
                  d="M 0 200 Q 200 180 400 200 T 800 200"
                  stroke="rgba(125,243,255,0.18)"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M 0 280 Q 200 260 400 280 T 800 280"
                  stroke="rgba(125,243,255,0.18)"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* Edges — drawn as curved arcs between vertices A(150,90) B(330,260) C(490,260) D(670,90) */}
                {/* A-B: 2 bridges (two arcs) */}
                <path
                  d="M 150 90 Q 200 130 330 260"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d="M 150 90 Q 280 120 330 260"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />
                {/* A-C: 2 bridges */}
                <path
                  d="M 150 90 Q 320 180 490 260"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d="M 150 90 Q 380 230 490 260"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />
                {/* A-D: 1 bridge */}
                <path
                  d="M 150 90 Q 410 50 670 90"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />
                {/* B-D: 1 bridge */}
                <path
                  d="M 330 260 Q 510 380 670 90"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />
                {/* C-D: 1 bridge */}
                <path
                  d="M 490 260 Q 600 200 670 90"
                  stroke="#ffd166"
                  strokeWidth="2.6"
                  fill="none"
                  opacity="0.85"
                />

                {/* Vertices */}
                {[
                  { x: 150, y: 90, label: "A", deg: 5, sub: fig.northBank },
                  { x: 330, y: 260, label: "B", deg: 3, sub: "Kneiphof" },
                  { x: 490, y: 260, label: "C", deg: 3, sub: "Lomse" },
                  { x: 670, y: 90, label: "D", deg: 3, sub: fig.southBank },
                ].map((v) => (
                  <g key={v.label}>
                    <circle cx={v.x} cy={v.y} r="40" fill="url(#kb-vert)" />
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="22"
                      fill="#0b0d18"
                      stroke="#ffd166"
                      strokeWidth="1.6"
                    />
                    <text
                      x={v.x}
                      y={v.y + 6}
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="20"
                      fill="#ffd166"
                    >
                      {v.label}
                    </text>
                    <text
                      x={v.x}
                      y={v.y + 60}
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#8a90a4"
                    >
                      {fig.deg} {v.deg} · {v.sub}
                    </text>
                  </g>
                ))}

                {/* Legend */}
                <text
                  x="400"
                  y="450"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="11"
                  fill="#8a90a4"
                >
                  A-B: 2 · A-C: 2 · A-D: 1 · B-D: 1 · C-D: 1 — {fig.legendNote}
                </text>
              </svg>
            </div>
            <figcaption className="text-sm leading-relaxed text-ink-200">{fig.caption}</figcaption>
          </figure>
        </Reveal>
      </section>
    </StoryPageShell>
  );
}
