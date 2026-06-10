"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { palette } from "@/lib/visual/palette";

const ACCENT = "text-signal-amber";

// Per-locale strings for the two reference panels (Platonic table + genus
// trio). Inline-pattern, in line with the rest of this project.
type RichStory = {
  refPretitle: string;
  refTitle: string;
  colSolid: string;
  colFaces: string;
  refParagraph: string;
  topoPretitle: string;
  topoTitle: string;
  topoParagraph: string;
  truncIcoLabel: string;
  truncIcoFaces: string;
  platonicNames: { tetra: string; cube: string; octa: string; dodeca: string; icosa: string };
  platonicFaces: {
    tetra: string;
    cube: string;
    octa: string;
    dodeca: string;
    icosa: string;
  };
  genusLabels: { sphere: string; torus: string; doubleTorus: string };
  genusAria: (label: string, chi: number) => string;
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: {
    refPretitle: "Reference · the five Platonic solids",
    refTitle: "Every row sums to 2.",
    colSolid: "Solid",
    colFaces: "Faces",
    refParagraph:
      "The five Platonic solids were already known to the ancient Greeks; Archimedes catalogued the thirteen semi-regular polyhedra including the truncated icosahedron — the soccer ball. Whatever the face shapes, V − E + F is always 2. Descartes noticed the pattern in a 1639 manuscript; Euler rediscovered and published it in 1750 / 1758.",
    topoPretitle: "Topology · each handle costs you two",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "The sphere has no handles: g = 0, χ = 2. A torus has one handle: g = 1, χ = 0. A double torus has two: g = 2, χ = −2. Every closed orientable surface in three dimensions lives on this ladder. Gauss-Bonnet says the same number falls out of integrating the curvature — geometry and topology, locked together.",
    truncIcoLabel: "Truncated icosahedron",
    truncIcoFaces: "12 pent. + 20 hex.",
    platonicNames: {
      tetra: "Tetrahedron",
      cube: "Cube",
      octa: "Octahedron",
      dodeca: "Dodecahedron",
      icosa: "Icosahedron",
    },
    platonicFaces: {
      tetra: "4 triangles",
      cube: "6 squares",
      octa: "8 triangles",
      dodeca: "12 pentagons",
      icosa: "20 triangles",
    },
    genusLabels: { sphere: "Sphere", torus: "Torus", doubleTorus: "Double torus" },
    genusAria: (label, chi) => `${label}, Euler characteristic ${chi}`,
  },
  de: {
    refPretitle: "Referenz · die fünf platonischen Körper",
    refTitle: "Jede Zeile ergibt 2.",
    colSolid: "Körper",
    colFaces: "Flächen",
    refParagraph:
      "Die fünf platonischen Körper waren schon den Griechen bekannt; Archimedes katalogisierte die dreizehn halbregulären Polyeder einschließlich des abgestumpften Ikosaeders — des Fußballs. Egal welche Flächenformen: V − E + F ist stets 2. Descartes bemerkte das Muster in einem Manuskript von 1639; Euler entdeckte es wieder und veröffentlichte es 1750 / 1758.",
    topoPretitle: "Topologie · jeder Henkel kostet zwei",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "Die Sphäre hat keinen Henkel: g = 0, χ = 2. Ein Torus hat einen Henkel: g = 1, χ = 0. Ein Doppeltorus hat zwei: g = 2, χ = −2. Jede geschlossene orientierbare Fläche im dreidimensionalen Raum sitzt auf dieser Leiter. Gauss-Bonnet sagt, dass dieselbe Zahl aus der Integration der Krümmung fällt — Geometrie und Topologie sind aneinander gekoppelt.",
    truncIcoLabel: "Abgestumpftes Ikosaeder",
    truncIcoFaces: "12 Fünf- + 20 Sechsecke",
    platonicNames: {
      tetra: "Tetraeder",
      cube: "Würfel",
      octa: "Oktaeder",
      dodeca: "Dodekaeder",
      icosa: "Ikosaeder",
    },
    platonicFaces: {
      tetra: "4 Dreiecke",
      cube: "6 Quadrate",
      octa: "8 Dreiecke",
      dodeca: "12 Fünfecke",
      icosa: "20 Dreiecke",
    },
    genusLabels: { sphere: "Sphäre", torus: "Torus", doubleTorus: "Doppeltorus" },
    genusAria: (label, chi) => `${label}, Euler-Charakteristik ${chi}`,
  },
  es: {
    refPretitle: "Referencia · los cinco sólidos platónicos",
    refTitle: "Cada fila suma 2.",
    colSolid: "Sólido",
    colFaces: "Caras",
    refParagraph:
      "Los cinco sólidos platónicos ya eran conocidos por los antiguos griegos; Arquímedes catalogó los trece poliedros semirregulares incluido el icosaedro truncado — el balón de fútbol. Sean cuales sean las formas de las caras, V − E + F es siempre 2. Descartes notó el patrón en un manuscrito de 1639; Euler lo redescubrió y publicó en 1750 / 1758.",
    topoPretitle: "Topología · cada asa cuesta dos",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "La esfera no tiene asas: g = 0, χ = 2. Un toro tiene una: g = 1, χ = 0. Un doble toro tiene dos: g = 2, χ = −2. Toda superficie cerrada orientable en tres dimensiones vive en esta escalera. Gauss-Bonnet dice que el mismo número sale de integrar la curvatura — geometría y topología, enlazadas.",
    truncIcoLabel: "Icosaedro truncado",
    truncIcoFaces: "12 pent. + 20 hex.",
    platonicNames: {
      tetra: "Tetraedro",
      cube: "Cubo",
      octa: "Octaedro",
      dodeca: "Dodecaedro",
      icosa: "Icosaedro",
    },
    platonicFaces: {
      tetra: "4 triángulos",
      cube: "6 cuadrados",
      octa: "8 triángulos",
      dodeca: "12 pentágonos",
      icosa: "20 triángulos",
    },
    genusLabels: { sphere: "Esfera", torus: "Toro", doubleTorus: "Doble toro" },
    genusAria: (label, chi) => `${label}, característica de Euler ${chi}`,
  },
  fr: {
    refPretitle: "Référence · les cinq solides de Platon",
    refTitle: "Chaque ligne fait 2.",
    colSolid: "Solide",
    colFaces: "Faces",
    refParagraph:
      "Les cinq solides de Platon étaient déjà connus des Grecs anciens ; Archimède a catalogué les treize polyèdres semi-réguliers, dont l'icosaèdre tronqué — le ballon de football. Quelles que soient les formes des faces, V − E + F vaut toujours 2. Descartes a remarqué le motif dans un manuscrit de 1639 ; Euler l'a redécouvert et publié en 1750 / 1758.",
    topoPretitle: "Topologie · chaque anse coûte deux",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "La sphère n'a pas d'anses : g = 0, χ = 2. Le tore en a une : g = 1, χ = 0. Le double tore en a deux : g = 2, χ = −2. Toute surface fermée orientable de l'espace tridimensionnel vit sur cette échelle. Gauss-Bonnet dit que le même nombre tombe de l'intégration de la courbure — géométrie et topologie, verrouillées ensemble.",
    truncIcoLabel: "Icosaèdre tronqué",
    truncIcoFaces: "12 pent. + 20 hex.",
    platonicNames: {
      tetra: "Tétraèdre",
      cube: "Cube",
      octa: "Octaèdre",
      dodeca: "Dodécaèdre",
      icosa: "Icosaèdre",
    },
    platonicFaces: {
      tetra: "4 triangles",
      cube: "6 carrés",
      octa: "8 triangles",
      dodeca: "12 pentagones",
      icosa: "20 triangles",
    },
    genusLabels: { sphere: "Sphère", torus: "Tore", doubleTorus: "Double tore" },
    genusAria: (label, chi) => `${label}, caractéristique d'Euler ${chi}`,
  },
  it: {
    refPretitle: "Riferimento · i cinque solidi platonici",
    refTitle: "Ogni riga somma a 2.",
    colSolid: "Solido",
    colFaces: "Facce",
    refParagraph:
      "I cinque solidi platonici erano già noti agli antichi Greci; Archimede catalogò i tredici poliedri semiregolari incluso l'icosaedro troncato — il pallone da calcio. Quali che siano le forme delle facce, V − E + F è sempre 2. Descartes notò lo schema in un manoscritto del 1639; Eulero lo riscoprì e pubblicò nel 1750 / 1758.",
    topoPretitle: "Topologia · ogni manico costa due",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "La sfera non ha manici: g = 0, χ = 2. Il toro ne ha uno: g = 1, χ = 0. Il doppio toro ne ha due: g = 2, χ = −2. Ogni superficie chiusa orientabile in tre dimensioni vive su questa scala. Gauss-Bonnet dice che lo stesso numero salta fuori integrando la curvatura — geometria e topologia, agganciate.",
    truncIcoLabel: "Icosaedro troncato",
    truncIcoFaces: "12 pent. + 20 esag.",
    platonicNames: {
      tetra: "Tetraedro",
      cube: "Cubo",
      octa: "Ottaedro",
      dodeca: "Dodecaedro",
      icosa: "Icosaedro",
    },
    platonicFaces: {
      tetra: "4 triangoli",
      cube: "6 quadrati",
      octa: "8 triangoli",
      dodeca: "12 pentagoni",
      icosa: "20 triangoli",
    },
    genusLabels: { sphere: "Sfera", torus: "Toro", doubleTorus: "Doppio toro" },
    genusAria: (label, chi) => `${label}, caratteristica di Eulero ${chi}`,
  },
  pt: {
    refPretitle: "Referência · os cinco sólidos platónicos",
    refTitle: "Cada linha soma 2.",
    colSolid: "Sólido",
    colFaces: "Faces",
    refParagraph:
      "Os cinco sólidos platónicos já eram conhecidos dos antigos gregos; Arquimedes catalogou os treze poliedros semirregulares, incluindo o icosaedro truncado — a bola de futebol. Sejam quais forem as formas das faces, V − E + F é sempre 2. Descartes notou o padrão num manuscrito de 1639; Euler redescobriu-o e publicou-o em 1750 / 1758.",
    topoPretitle: "Topologia · cada asa custa dois",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "A esfera não tem asas: g = 0, χ = 2. Um toro tem uma: g = 1, χ = 0. Um toro duplo tem duas: g = 2, χ = −2. Toda superfície fechada orientável em três dimensões vive nesta escada. Gauss-Bonnet diz que o mesmo número cai da integração da curvatura — geometria e topologia, acopladas.",
    truncIcoLabel: "Icosaedro truncado",
    truncIcoFaces: "12 pent. + 20 hex.",
    platonicNames: {
      tetra: "Tetraedro",
      cube: "Cubo",
      octa: "Octaedro",
      dodeca: "Dodecaedro",
      icosa: "Icosaedro",
    },
    platonicFaces: {
      tetra: "4 triângulos",
      cube: "6 quadrados",
      octa: "8 triângulos",
      dodeca: "12 pentágonos",
      icosa: "20 triângulos",
    },
    genusLabels: { sphere: "Esfera", torus: "Toro", doubleTorus: "Toro duplo" },
    genusAria: (label, chi) => `${label}, característica de Euler ${chi}`,
  },
  sv: {
    refPretitle: "Referens · de fem platonska kropparna",
    refTitle: "Varje rad summerar till 2.",
    colSolid: "Kropp",
    colFaces: "Sidor",
    refParagraph:
      "De fem platonska kropparna var redan kända för de gamla grekerna; Arkimedes katalogiserade de tretton halvreguljära polyedrarna, inklusive den stympade ikosaedern — fotbollen. Oavsett sidoform är V − E + F alltid 2. Descartes noterade mönstret i ett manuskript från 1639; Euler återupptäckte och publicerade det 1750 / 1758.",
    topoPretitle: "Topologi · varje handtag kostar två",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "Sfären har inga handtag: g = 0, χ = 2. En torus har ett: g = 1, χ = 0. En dubbeltorus har två: g = 2, χ = −2. Varje sluten orienterbar yta i tre dimensioner bor på denna stege. Gauss-Bonnet säger att samma tal faller ut av integralen av krökningen — geometri och topologi, sammankopplade.",
    truncIcoLabel: "Stympad ikosaeder",
    truncIcoFaces: "12 fem. + 20 hex.",
    platonicNames: {
      tetra: "Tetraeder",
      cube: "Kub",
      octa: "Oktaeder",
      dodeca: "Dodekaeder",
      icosa: "Ikosaeder",
    },
    platonicFaces: {
      tetra: "4 trianglar",
      cube: "6 kvadrater",
      octa: "8 trianglar",
      dodeca: "12 femhörningar",
      icosa: "20 trianglar",
    },
    genusLabels: { sphere: "Sfär", torus: "Torus", doubleTorus: "Dubbeltorus" },
    genusAria: (label, chi) => `${label}, Eulerkarakteristik ${chi}`,
  },
  no: {
    refPretitle: "Referanse · de fem platonske legemene",
    refTitle: "Hver rad summerer til 2.",
    colSolid: "Legeme",
    colFaces: "Flater",
    refParagraph:
      "De fem platonske legemene var allerede kjent for de gamle grekerne; Arkimedes katalogiserte de tretten halvregulære polyedrene, inkludert det avstumpede ikosaederet — fotballen. Uansett flateform er V − E + F alltid 2. Descartes la merke til mønsteret i et manuskript fra 1639; Euler gjenoppdaget og publiserte det i 1750 / 1758.",
    topoPretitle: "Topologi · hvert håndtak koster to",
    topoTitle: "χ = 2 − 2g",
    topoParagraph:
      "Kulen har ingen håndtak: g = 0, χ = 2. En torus har ett: g = 1, χ = 0. En dobbeltorus har to: g = 2, χ = −2. Hver lukket orienterbar flate i tre dimensjoner bor på denne stigen. Gauss-Bonnet sier at samme tall faller ut av å integrere krumningen — geometri og topologi, koblet sammen.",
    truncIcoLabel: "Avstumpet ikosaeder",
    truncIcoFaces: "12 fem. + 20 hex.",
    platonicNames: {
      tetra: "Tetraeder",
      cube: "Terning",
      octa: "Oktaeder",
      dodeca: "Dodekaeder",
      icosa: "Ikosaeder",
    },
    platonicFaces: {
      tetra: "4 trekanter",
      cube: "6 kvadrater",
      octa: "8 trekanter",
      dodeca: "12 femkanter",
      icosa: "20 trekanter",
    },
    genusLabels: { sphere: "Kule", torus: "Torus", doubleTorus: "Dobbeltorus" },
    genusAria: (label, chi) => `${label}, Eulerkarakteristikk ${chi}`,
  },
};

// Platonic solids reference table. Standard values; every row sums to χ = 2.
const PLATONIC: ReadonlyArray<{
  key: keyof RichStory["platonicNames"];
  V: number;
  E: number;
  F: number;
}> = [
  { key: "tetra", V: 4, E: 6, F: 4 },
  { key: "cube", V: 8, E: 12, F: 6 },
  { key: "octa", V: 6, E: 12, F: 8 },
  { key: "dodeca", V: 20, E: 30, F: 12 },
  { key: "icosa", V: 12, E: 30, F: 20 },
];

interface GenusIcon {
  key: keyof RichStory["genusLabels"];
  chi: number;
  genus: number;
  draw: React.ReactNode;
}

// Three small SVG icons: sphere (χ=2), torus (χ=0), double torus (χ=−2).
const GENUS_ICONS: ReadonlyArray<GenusIcon> = [
  {
    key: "sphere",
    chi: 2,
    genus: 0,
    draw: (
      <g>
        <ellipse
          cx="80"
          cy="60"
          rx="42"
          ry="42"
          fill="rgba(125,243,255,0.10)"
          stroke={palette.signal.cyan}
          strokeWidth="1.6"
        />
        <ellipse
          cx="80"
          cy="60"
          rx="42"
          ry="14"
          fill="none"
          stroke="rgba(125,243,255,0.45)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <ellipse
          cx="80"
          cy="60"
          rx="14"
          ry="42"
          fill="none"
          stroke="rgba(125,243,255,0.45)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </g>
    ),
  },
  {
    key: "torus",
    chi: 0,
    genus: 1,
    draw: (
      <g>
        <ellipse
          cx="80"
          cy="60"
          rx="50"
          ry="30"
          fill="rgba(125,243,255,0.10)"
          stroke={palette.signal.cyan}
          strokeWidth="1.6"
        />
        <path d="M 50 60 Q 80 80 110 60" fill="none" stroke={palette.signal.cyan} strokeWidth="1.4" />
        <path
          d="M 56 56 Q 80 44 104 56"
          fill="none"
          stroke="rgba(125,243,255,0.55)"
          strokeWidth="1.2"
        />
      </g>
    ),
  },
  {
    key: "doubleTorus",
    chi: -2,
    genus: 2,
    draw: (
      <g>
        <ellipse
          cx="55"
          cy="60"
          rx="32"
          ry="22"
          fill="rgba(125,243,255,0.10)"
          stroke={palette.signal.cyan}
          strokeWidth="1.6"
        />
        <ellipse
          cx="105"
          cy="60"
          rx="32"
          ry="22"
          fill="rgba(125,243,255,0.10)"
          stroke={palette.signal.cyan}
          strokeWidth="1.6"
        />
        <path d="M 38 60 Q 55 73 72 60" fill="none" stroke={palette.signal.cyan} strokeWidth="1.3" />
        <path d="M 88 60 Q 105 73 122 60" fill="none" stroke={palette.signal.cyan} strokeWidth="1.3" />
        <path
          d="M 42 57 Q 55 49 68 57"
          fill="none"
          stroke="rgba(125,243,255,0.55)"
          strokeWidth="1.1"
        />
        <path
          d="M 92 57 Q 105 49 118 57"
          fill="none"
          stroke="rgba(125,243,255,0.55)"
          strokeWidth="1.1"
        />
      </g>
    ),
  },
];

export default function EulerCharStoryPage() {
  const { s, locale } = useI18n();
  const page = s.pages.eulerchar;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3] = page.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/eulerchar/explorer"
      accent="text-signal-amber"
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="V − E + F = 2 − 2g"
      formulaLatex={"V - E + F = 2 - 2g"}
      finalLabel="Count and verify."
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Reference table: the five Platonic solids and their V − E + F = 2 */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-6 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.refPretitle}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {story.refTitle}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="hairline border-b text-[10px] uppercase tracking-widest2 text-ink-300">
                  <th className="py-3 pr-4 text-left">{story.colSolid}</th>
                  <th className="py-3 pr-4 text-left">{story.colFaces}</th>
                  <th className="px-3 py-3 text-right">V</th>
                  <th className="px-3 py-3 text-right">E</th>
                  <th className="px-3 py-3 text-right">F</th>
                  <th className={`py-3 pl-3 text-right ${ACCENT}`}>V − E + F</th>
                </tr>
              </thead>
              <tbody>
                {PLATONIC.map((row) => (
                  <tr key={row.key} className="hairline border-b last:border-b-0">
                    <td className="py-3 pr-4 text-ink-100">{story.platonicNames[row.key]}</td>
                    <td className="py-3 pr-4 text-ink-300">{story.platonicFaces[row.key]}</td>
                    <td className="px-3 py-3 text-right text-ink-100">{row.V}</td>
                    <td className="px-3 py-3 text-right text-ink-100">{row.E}</td>
                    <td className="px-3 py-3 text-right text-ink-100">{row.F}</td>
                    <td className={`py-3 pl-3 text-right ${ACCENT}`}>{row.V - row.E + row.F}</td>
                  </tr>
                ))}
                <tr className="text-[11px] text-ink-400">
                  <td className="py-3 pr-4">{story.truncIcoLabel}</td>
                  <td className="py-3 pr-4">{story.truncIcoFaces}</td>
                  <td className="px-3 py-3 text-right">60</td>
                  <td className="px-3 py-3 text-right">90</td>
                  <td className="px-3 py-3 text-right">32</td>
                  <td className={`py-3 pl-3 text-right ${ACCENT}`}>2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed text-ink-300">{story.refParagraph}</p>
        </section>
      </Reveal>

      {/* Genus panel: sphere χ=2, torus χ=0, double torus χ=−2 */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-6 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.topoPretitle}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {story.topoTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {GENUS_ICONS.map((icon) => {
              const label = story.genusLabels[icon.key];
              return (
                <div
                  key={icon.key}
                  className="hairline flex flex-col items-center space-y-3 rounded-xl border bg-ink-950/40 p-5 text-center"
                >
                  <svg
                    viewBox="0 0 160 120"
                    className="h-auto w-full max-w-[200px]"
                    role="img"
                    aria-label={story.genusAria(label, icon.chi)}
                  >
                    {icon.draw}
                  </svg>
                  <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                    {label}
                  </div>
                  <div className="font-mono text-sm text-ink-100">
                    g = {icon.genus} &nbsp;·&nbsp; χ = {icon.chi}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm leading-relaxed text-ink-300">{story.topoParagraph}</p>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
