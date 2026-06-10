"use client";

import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { palette } from "@/lib/visual/palette";

const ACCENT = "text-signal-cyan";

// Stable IDs for the canonical NP-complete problems — every gloss is looked
// up per locale via the RichFigures dict below so we keep the prose in step
// across all eight languages.
type NPProblemId =
  | "sat"
  | "threesat"
  | "hamiltonian"
  | "subsetsum"
  | "colouring"
  | "clique"
  | "tsp"
  | "tetris"
  | "sudoku"
  | "minesweeper";

const NP_COMPLETE_PROBLEMS: ReadonlyArray<{ id: NPProblemId; name: string }> = [
  { id: "sat", name: "SAT" },
  { id: "threesat", name: "3-SAT" },
  { id: "hamiltonian", name: "Hamiltonian Path" },
  { id: "subsetsum", name: "Subset Sum" },
  { id: "colouring", name: "Graph Colouring" },
  { id: "clique", name: "Clique" },
  { id: "tsp", name: "Travelling Salesman (decision)" },
  { id: "tetris", name: "Tetris / Solitaire" },
  { id: "sudoku", name: "Sudoku N×N" },
  { id: "minesweeper", name: "Minesweeper consistency" },
];

// --------------------------------------------------------------------------
// Per-locale strings for the two inline figure panels (the Venn diagram and
// the NP-complete catalogue). Hero + section prose lives in the shared
// s.pages.pvsnp bundle so this dict only carries the figure-specific copy.
// --------------------------------------------------------------------------

type RichFigures = {
  finalLabel: string;
  // figure 1 — complexity-zoo Venn diagram
  vennBadge: string;
  vennTitle: string;
  vennAriaLabel: string;
  vennCaption: string;
  vennBody: string;
  // figure 2 — canonical NP-complete catalogue
  catalogueBadge: string;
  catalogueTitle: string;
  catalogueFootnote: string;
  problems: Record<NPProblemId, string>;
};

const FIGURES: Record<Locale, RichFigures> = {
  en: {
    finalLabel: "Watch the search.",
    vennBadge: "Diagram · the complexity zoo, restricted view",
    vennTitle: "P sits inside NP sits inside EXP. NP-complete is the hardest rim of NP.",
    vennAriaLabel: "Venn diagram of P, NP, NP-complete, PSPACE and EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (time hierarchy theorem)",
    vennBody:
      "P sits as a small disc inside NP. NP-complete problems are the hardest in NP — every other NP problem reduces to them. If a single NP-complete problem turned out to be in P, the rose disc would collapse into the cyan one and P would equal NP. The time hierarchy theorem already proves P ⊊ EXP, so at least one of the inclusions above is strict — we just don't know which.",
    catalogueBadge: "Catalogue · canonical NP-complete problems",
    catalogueTitle: "Solve any of these in polynomial time — solve them all.",
    catalogueFootnote:
      "All inter-reducible in polynomial time. 3-SAT is the canonical instance — the Explorer is a working DPLL solver on it.",
    problems: {
      sat: "Boolean satisfiability — the original Cook-Levin problem.",
      threesat: "SAT with clauses of length 3. The canonical NP-complete.",
      hamiltonian: "Trace a path through the graph that lands on each vertex once and only once.",
      subsetsum: "Pick a sub-multiset summing to a target integer.",
      colouring: "Colour vertices with k colours, no edge monochrome.",
      clique: "Find a complete subgraph of size k.",
      tsp: "Tour all cities within budget B.",
      tetris: "Optimal play — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Generalised to n² × n² boards. Yato & Seta 2003.",
      minesweeper: "Kaye 2000 — given a board, is it consistent?",
    },
  },
  de: {
    finalLabel: "Der Suche zusehen.",
    vennBadge: "Diagramm · der Komplexitäts-Zoo, eingeschränkte Sicht",
    vennTitle: "P liegt in NP, NP liegt in EXP. NP-vollständig ist der härteste Rand von NP.",
    vennAriaLabel: "Venn-Diagramm von P, NP, NP-vollständig, PSPACE und EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (Zeithierarchie-Satz)",
    vennBody:
      "P sitzt als kleine Scheibe innerhalb von NP. NP-vollständige Probleme sind die härtesten in NP — jedes andere NP-Problem lässt sich auf sie reduzieren. Würde ein einziges NP-vollständiges Problem in P fallen, kollabierte die rosafarbene Scheibe in die cyanfarbene, und P wäre gleich NP. Der Zeithierarchie-Satz beweist bereits P ⊊ EXP, also ist mindestens eine der obigen Inklusionen strikt — wir wissen nur nicht welche.",
    catalogueBadge: "Katalog · kanonische NP-vollständige Probleme",
    catalogueTitle: "Löse eines davon in Polynomialzeit — und du hast sie alle gelöst.",
    catalogueFootnote:
      "Alle in Polynomialzeit untereinander reduzierbar. 3-SAT ist der kanonische Fall — der Explorer ist ein lauffähiger DPLL-Solver dafür.",
    problems: {
      sat: "Boolesche Erfüllbarkeit — das ursprüngliche Cook-Levin-Problem.",
      threesat: "SAT mit Klauseln der Länge 3. Der kanonische NP-vollständige Fall.",
      hamiltonian: "Zeichne einen Pfad durch den Graphen, der jeden Knoten ein einziges Mal berührt.",
      subsetsum: "Wähle eine Teilmenge, deren Summe eine Zielzahl trifft.",
      colouring: "Färbe die Knoten mit k Farben, keine Kante einfarbig.",
      clique: "Finde einen vollständigen Teilgraphen der Größe k.",
      tsp: "Bereise alle Städte im Budget B.",
      tetris: "Optimales Spiel — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Verallgemeinert auf n² × n²-Bretter. Yato & Seta 2003.",
      minesweeper: "Kaye 2000 — ist ein gegebenes Brett widerspruchsfrei?",
    },
  },
  es: {
    finalLabel: "Mira la búsqueda.",
    vennBadge: "Diagrama · el zoológico de la complejidad, vista restringida",
    vennTitle: "P está dentro de NP, que está dentro de EXP. NP-completo es el borde más duro de NP.",
    vennAriaLabel: "Diagrama de Venn de P, NP, NP-completo, PSPACE y EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (teorema de la jerarquía temporal)",
    vennBody:
      "P es un disco pequeño dentro de NP. Los problemas NP-completos son los más difíciles de NP — todo otro problema de NP se reduce a ellos. Si un solo problema NP-completo resultara estar en P, el disco rosa colapsaría sobre el cian y P sería igual a NP. El teorema de la jerarquía temporal ya prueba P ⊊ EXP, así que al menos una de las inclusiones de arriba es estricta — solo no sabemos cuál.",
    catalogueBadge: "Catálogo · problemas NP-completos canónicos",
    catalogueTitle: "Resuelve uno de ellos en tiempo polinómico — los resuelves todos.",
    catalogueFootnote:
      "Todos interreducibles en tiempo polinómico. 3-SAT es la instancia canónica — el Explorer es un solucionador DPLL real sobre ella.",
    problems: {
      sat: "Satisfacibilidad booleana — el problema original de Cook-Levin.",
      threesat: "SAT con cláusulas de longitud 3. El NP-completo canónico.",
      hamiltonian: "Trazar un camino por el grafo que toque cada vértice una sola vez.",
      subsetsum: "Elegir un submulticonjunto que sume un entero dado.",
      colouring: "Colorear vértices con k colores, ninguna arista monocromática.",
      clique: "Hallar un subgrafo completo de tamaño k.",
      tsp: "Recorrer todas las ciudades con presupuesto B.",
      tetris: "Juego óptimo — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Generalizado a tableros n² × n². Yato y Seta 2003.",
      minesweeper: "Kaye 2000 — dado un tablero, ¿es consistente?",
    },
  },
  fr: {
    finalLabel: "Regarde la recherche.",
    vennBadge: "Diagramme · le zoo de la complexité, vue restreinte",
    vennTitle: "P est dans NP, qui est dans EXP. NP-complet est le bord le plus difficile de NP.",
    vennAriaLabel: "Diagramme de Venn de P, NP, NP-complet, PSPACE et EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (théorème de la hiérarchie temporelle)",
    vennBody:
      "P est un petit disque à l'intérieur de NP. Les problèmes NP-complets sont les plus durs de NP — tout autre problème de NP s'y réduit. Si un seul problème NP-complet s'avérait être dans P, le disque rose s'effondrerait dans le cyan et P serait égal à NP. Le théorème de la hiérarchie temporelle prouve déjà P ⊊ EXP, donc au moins l'une des inclusions ci-dessus est stricte — on ne sait simplement pas laquelle.",
    catalogueBadge: "Catalogue · problèmes NP-complets canoniques",
    catalogueTitle: "Résolvez l'un d'eux en temps polynomial — vous les résolvez tous.",
    catalogueFootnote:
      "Tous inter-réductibles en temps polynomial. 3-SAT est l'instance canonique — l'Explorer est un véritable solveur DPLL pour elle.",
    problems: {
      sat: "Satisfiabilité booléenne — le problème original de Cook-Levin.",
      threesat: "SAT avec des clauses de longueur 3. Le NP-complet canonique.",
      hamiltonian: "Tracer un chemin dans le graphe qui touche chaque sommet une seule fois.",
      subsetsum: "Choisir un sous-multi-ensemble dont la somme atteint un entier cible.",
      colouring: "Colorer les sommets avec k couleurs, aucune arête monochrome.",
      clique: "Trouver un sous-graphe complet de taille k.",
      tsp: "Parcourir toutes les villes dans le budget B.",
      tetris: "Jeu optimal — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Généralisé aux grilles n² × n². Yato et Seta 2003.",
      minesweeper: "Kaye 2000 — un plateau donné est-il cohérent ?",
    },
  },
  it: {
    finalLabel: "Guarda la ricerca.",
    vennBadge: "Diagramma · lo zoo della complessità, vista ristretta",
    vennTitle: "P sta dentro NP, che sta dentro EXP. NP-completo è il bordo più duro di NP.",
    vennAriaLabel: "Diagramma di Venn di P, NP, NP-completo, PSPACE ed EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (teorema della gerarchia temporale)",
    vennBody:
      "P sta come piccolo disco dentro NP. I problemi NP-completi sono i più difficili in NP — ogni altro problema di NP si riduce a essi. Se un singolo problema NP-completo si rivelasse in P, il disco rosa collasserebbe in quello ciano e P sarebbe uguale a NP. Il teorema della gerarchia temporale dimostra già P ⊊ EXP, quindi almeno una delle inclusioni sopra è stretta — solo non sappiamo quale.",
    catalogueBadge: "Catalogo · problemi NP-completi canonici",
    catalogueTitle: "Risolvine uno in tempo polinomiale — li risolvi tutti.",
    catalogueFootnote:
      "Tutti inter-riducibili in tempo polinomiale. 3-SAT è l'istanza canonica — l'Explorer è un solver DPLL funzionante su di essa.",
    problems: {
      sat: "Soddisfacibilità booleana — il problema originale di Cook-Levin.",
      threesat: "SAT con clausole di lunghezza 3. L'NP-completo canonico.",
      hamiltonian: "Tracciare un cammino nel grafo che tocchi ogni vertice una sola volta.",
      subsetsum: "Scegliere un sotto-multinsieme la cui somma colpisce un intero.",
      colouring: "Colorare i vertici con k colori, nessun arco monocromatico.",
      clique: "Trovare un sottografo completo di dimensione k.",
      tsp: "Visitare tutte le città entro il budget B.",
      tetris: "Gioco ottimale — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Generalizzato a tavole n² × n². Yato e Seta 2003.",
      minesweeper: "Kaye 2000 — data una tavola, è coerente?",
    },
  },
  pt: {
    finalLabel: "Observe a busca.",
    vennBadge: "Diagrama · o zoológico da complexidade, vista restrita",
    vennTitle: "P está dentro de NP, que está dentro de EXP. NP-completo é a borda mais dura de NP.",
    vennAriaLabel: "Diagrama de Venn de P, NP, NP-completo, PSPACE e EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (teorema da hierarquia temporal)",
    vennBody:
      "P é um pequeno disco dentro de NP. Os problemas NP-completos são os mais difíceis em NP — todo outro problema de NP se reduz a eles. Se um único problema NP-completo estivesse em P, o disco rosa colapsaria no ciano e P seria igual a NP. O teorema da hierarquia temporal já prova P ⊊ EXP, portanto pelo menos uma das inclusões acima é estrita — só não sabemos qual.",
    catalogueBadge: "Catálogo · problemas NP-completos canónicos",
    catalogueTitle: "Resolva um deles em tempo polinomial — resolveu todos.",
    catalogueFootnote:
      "Todos inter-redutíveis em tempo polinomial. 3-SAT é a instância canónica — o Explorer é um solucionador DPLL real para ela.",
    problems: {
      sat: "Satisfatibilidade booleana — o problema original de Cook-Levin.",
      threesat: "SAT com cláusulas de comprimento 3. O NP-completo canónico.",
      hamiltonian: "Traçar um caminho pelo grafo que toque cada vértice uma única vez.",
      subsetsum: "Escolher um submulticonjunto cuja soma atinge um inteiro alvo.",
      colouring: "Colorir vértices com k cores, nenhuma aresta monocromática.",
      clique: "Encontrar um subgrafo completo de tamanho k.",
      tsp: "Percorrer todas as cidades dentro do orçamento B.",
      tetris: "Jogo óptimo — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Generalizado a tabuleiros n² × n². Yato e Seta 2003.",
      minesweeper: "Kaye 2000 — dado um tabuleiro, é consistente?",
    },
  },
  sv: {
    finalLabel: "Följ sökningen.",
    vennBadge: "Diagram · komplexitetszoot, begränsad vy",
    vennTitle: "P ligger inuti NP som ligger inuti EXP. NP-fullständig är NP:s hårdaste kant.",
    vennAriaLabel: "Venn-diagram över P, NP, NP-fullständig, PSPACE och EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (tidshierarkisatsen)",
    vennBody:
      "P sitter som en liten skiva inuti NP. NP-fullständiga problem är de svåraste i NP — varje annat NP-problem reduceras till dem. Om ett enda NP-fullständigt problem visade sig ligga i P skulle den rosa skivan kollapsa in i den cyanfärgade och P vore lika med NP. Tidshierarkisatsen bevisar redan P ⊊ EXP, så åtminstone en av inklusionerna ovan är strikt — vi vet bara inte vilken.",
    catalogueBadge: "Katalog · kanoniska NP-fullständiga problem",
    catalogueTitle: "Lös ett av dem i polynomtid — och du har löst dem alla.",
    catalogueFootnote:
      "Alla ömsesidigt reducerbara i polynomtid. 3-SAT är det kanoniska fallet — Explorer är en fungerande DPLL-lösare för det.",
    problems: {
      sat: "Boolesk satisfierbarhet — det ursprungliga Cook-Levin-problemet.",
      threesat: "SAT med klausuler av längd 3. Det kanoniska NP-fullständiga.",
      hamiltonian: "Dra en stig genom grafen som landar på varje nod en enda gång.",
      subsetsum: "Välj en delmängd vars summa träffar ett mål-heltal.",
      colouring: "Färga noder med k färger, ingen kant enfärgad.",
      clique: "Hitta en fullständig delgraf av storlek k.",
      tsp: "Res genom alla städer inom budget B.",
      tetris: "Optimalt spel — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Generaliserat till n² × n²-bräden. Yato och Seta 2003.",
      minesweeper: "Kaye 2000 — är ett givet bräde konsistent?",
    },
  },
  no: {
    finalLabel: "Følg søket.",
    vennBadge: "Diagram · kompleksitetsdyrehagen, begrenset visning",
    vennTitle: "P ligger inni NP som ligger inni EXP. NP-fullstendig er NP-s hardeste kant.",
    vennAriaLabel: "Venn-diagram over P, NP, NP-fullstendig, PSPACE og EXP",
    vennCaption: "P ⊆ NP ⊆ PSPACE ⊆ EXP · P ⊊ EXP (tidshierarki-satsen)",
    vennBody:
      "P sitter som en liten skive inni NP. NP-fullstendige problemer er de hardeste i NP — ethvert annet NP-problem reduserer til dem. Hvis et eneste NP-fullstendig problem viste seg å ligge i P, ville den rosa skiven kollapse inn i den cyanfargede, og P ville være lik NP. Tidshierarki-satsen beviser allerede P ⊊ EXP, så minst én av inklusjonene over er strikt — vi vet bare ikke hvilken.",
    catalogueBadge: "Katalog · kanoniske NP-fullstendige problemer",
    catalogueTitle: "Løs ett av dem i polynomtid — og du har løst dem alle.",
    catalogueFootnote:
      "Alle gjensidig reduserbare i polynomtid. 3-SAT er det kanoniske tilfellet — Explorer er en fungerende DPLL-løser for det.",
    problems: {
      sat: "Boolsk tilfredsstillbarhet — det opprinnelige Cook-Levin-problemet.",
      threesat: "SAT med klausuler av lengde 3. Det kanoniske NP-fullstendige.",
      hamiltonian: "Tegn en sti gjennom grafen som lander på hver node en eneste gang.",
      subsetsum: "Velg en delmengde med sum lik et målheltall.",
      colouring: "Farg noder med k farger, ingen kant enfarget.",
      clique: "Finn en fullstendig delgraf av størrelse k.",
      tsp: "Reis gjennom alle byene innenfor budsjettet B.",
      tetris: "Optimalt spill — Demaine, Hohenberger, Liben-Nowell 2003.",
      sudoku: "Generalisert til n² × n²-brett. Yato og Seta 2003.",
      minesweeper: "Kaye 2000 — er et gitt brett konsistent?",
    },
  },
};

export default function PvsNPStoryPage() {
  const { s, locale } = useI18n();
  const page = s.pages.pvsnp;
  const [sec0, sec1, sec2, sec3] = page.sections;
  const fig = FIGURES[locale];

  return (
    <StoryPageShell
      page={page}
      ctaHref="/pvsnp/explorer"
      accent="text-signal-cyan"
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="P ⊆ NP ⊆ EXP"
      formulaLatex={
        "\\mathrm{P} \\;\\subseteq\\; \\mathrm{NP} \\;\\subseteq\\; \\mathrm{PSPACE} \\;\\subseteq\\; \\mathrm{EXP}"
      }
      finalLabel={fig.finalLabel}
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Venn diagram of complexity classes */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {fig.vennBadge}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {fig.vennTitle}
          </h2>
          <div className="flex justify-center">
            <svg
              viewBox="0 0 640 360"
              role="img"
              aria-label={fig.vennAriaLabel}
              className="h-auto w-full max-w-2xl"
            >
              {/* EXP outer */}
              <ellipse
                cx="320"
                cy="180"
                rx="300"
                ry="160"
                fill="rgba(125,243,255,0.05)"
                stroke="rgba(125,243,255,0.55)"
                strokeWidth="1.5"
              />
              <text x="40" y="40" fill={palette.signal.cyan} fontFamily="ui-monospace, monospace" fontSize="14">
                EXP
              </text>

              {/* PSPACE */}
              <ellipse
                cx="320"
                cy="190"
                rx="250"
                ry="130"
                fill="rgba(167,139,250,0.06)"
                stroke="rgba(167,139,250,0.6)"
                strokeWidth="1.5"
              />
              <text x="90" y="80" fill="#a78bfa" fontFamily="ui-monospace, monospace" fontSize="13">
                PSPACE
              </text>

              {/* NP */}
              <ellipse
                cx="290"
                cy="200"
                rx="180"
                ry="100"
                fill="rgba(255,209,102,0.08)"
                stroke="rgba(255,209,102,0.7)"
                strokeWidth="1.5"
              />
              <text
                x="145"
                y="120"
                fill={palette.signal.amber}
                fontFamily="ui-monospace, monospace"
                fontSize="13"
              >
                NP
              </text>

              {/* P */}
              <ellipse
                cx="240"
                cy="210"
                rx="80"
                ry="55"
                fill="rgba(125,243,255,0.12)"
                stroke="rgba(125,243,255,0.8)"
                strokeWidth="1.5"
              />
              <text
                x="225"
                y="215"
                fill={palette.signal.cyan}
                fontFamily="ui-monospace, monospace"
                fontSize="14"
              >
                P
              </text>

              {/* NP-complete (a crescent at NP's rim, excluding P) */}
              <ellipse
                cx="380"
                cy="200"
                rx="80"
                ry="60"
                fill="rgba(255,122,182,0.18)"
                stroke="rgba(255,122,182,0.8)"
                strokeWidth="1.5"
              />
              <text
                x="345"
                y="205"
                fill={palette.signal.rose}
                fontFamily="ui-monospace, monospace"
                fontSize="11"
              >
                NP-complete
              </text>

              {/* Caption: containment line */}
              <text
                x="320"
                y="335"
                fill="#cfd2dc"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                textAnchor="middle"
              >
                {fig.vennCaption}
              </text>
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-ink-300">{fig.vennBody}</p>
        </section>
      </Reveal>

      {/* Canonical NP-complete problems */}
      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {fig.catalogueBadge}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {fig.catalogueTitle}
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {NP_COMPLETE_PROBLEMS.map((p) => (
              <div
                key={p.id}
                className="hairline space-y-2 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-signal-cyan/40"
              >
                <div className={`font-mono text-[11px] uppercase tracking-widest2 ${ACCENT}`}>
                  {p.name}
                </div>
                <div className="text-sm leading-relaxed text-ink-200">{fig.problems[p.id]}</div>
              </div>
            ))}
          </div>
          <p className="pt-2 text-xs leading-relaxed text-ink-400">{fig.catalogueFootnote}</p>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
