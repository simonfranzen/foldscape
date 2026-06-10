// Interactive-view UI strings. Kept separate from prose so the labels for
// buttons, sliders, HUD, etc. are easy to maintain.

import type { Locale } from "./types";

export interface UiDict {
  further?: { label: string };
  applications?: { label: string; lead: string };
  sound?: { label: string };
  // Related-topics preview cards at the bottom of every story page.
  // Optional so the six non-EN/DE locales fall back to the EN literal at the
  // call site (`u.related?.label ?? "Related topics"`) without breaking the
  // EN ↔ DE parity test.
  related?: { label: string; lead: string };
  mandel: {
    bookmarks: string;
    bookmarksInfo: string;
    iterations: string;
    iterationsInfo: string;
    hueShift: string;
    exposure: string;
    palette: string;
    zoomIn: string;
    zoomOut: string;
    reset: string;
    panHint: string;
    zoomLevel: string;
    autoIter: string;
    bookmarkOverview: string;
    bookmarkSeahorse: string;
    bookmarkElephant: string;
    bookmarkMini: string;
    bookmarkSpiral: string;
    bookmarkMisiurewicz: string;
    bookmarkLightning: string;
    bookmarkSelfSim: string;
    bookmarkAntenna: string;
  };
  life: {
    controls: string;
    play: string;
    pause: string;
    step: string;
    random: string;
    clear: string;
    speed: string;
    patterns: string;
    patternsInfo: string;
    cellColour: string;
    rulesBox: string;
    genLabel: string;
    popLabel: string;
    drawHint: string;
    ruleSummary: string;
  };
  back: string;
  // Primary CTA in every topic-page hero: a button that scrolls the
  // visitor down into the story content. Encourages reading the
  // narrative *before* jumping to the interactive Explorer (which is
  // a secondary outline next to it). Optional so the six non-EN/DE
  // locales fall back to the EN literal via `??`; EN + DE are filled.
  discoverStory?: string;
  // Footer/nav label for the editorial "About" page. Optional so locales
  // that haven't been translated yet fall back to the EN literal at the
  // call site; EN+DE are guaranteed by the parity test.
  about?: string;
}

const en: UiDict = {
  mandel: {
    bookmarks: "Bookmarks",
    bookmarksInfo:
      "Famous spots in the Mandelbrot landscape. Each one needs a deeper iteration count — the closer to the boundary, the longer the orbit takes to escape.",
    iterations: "Iterations",
    iterationsInfo:
      "Maximum number of times we apply zₙ → zₙ² + c before declaring a point inside the set. Higher numbers reveal finer detail at the cost of GPU work.",
    hueShift: "Hue shift",
    exposure: "Exposure",
    palette: "Palette",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset view",
    panHint: "drag to pan · double-click to zoom · ⌘ + wheel",
    zoomLevel: "Zoom",
    autoIter: "Auto-iter scales with zoom",
    bookmarkOverview: "Overview",
    bookmarkSeahorse: "Seahorse Valley",
    bookmarkElephant: "Elephant Valley",
    bookmarkMini: "Mini Mandelbrot",
    bookmarkSpiral: "Triple Spiral",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Lightning",
    bookmarkSelfSim: "Self-similar Heart",
    bookmarkAntenna: "Antenna",
  },
  life: {
    controls: "Controls",
    play: "Play",
    pause: "Pause",
    step: "Step ›",
    random: "Random",
    clear: "Clear",
    speed: "Speed",
    patterns: "Classic patterns",
    patternsInfo:
      "Famous starting configurations discovered between 1970 and today. Some die instantly; others run for thousands of generations or fire gliders forever.",
    cellColour: "Cell colour",
    rulesBox: "2 or 3 neighbours → survive · exactly 3 → birth · else → death",
    genLabel: "gen",
    popLabel: "pop",
    drawHint: "click · drag to draw",
    ruleSummary: "B3 / S23 · toroidal",
  },
  back: "← Back to the atlas",
  discoverStory: "Discover the story",
  about: "About",
  further: { label: "Further reading" },
  applications: {
    label: "Where you meet it",
    lead: "How and where this technique lives in the world today.",
  },
  sound: { label: "Hear it" },
  related: {
    label: "Related topics",
    lead: "Topics in the same vein.",
  },
};

const de: UiDict = {
  mandel: {
    bookmarks: "Lesezeichen",
    bookmarksInfo:
      "Berühmte Stellen in der Mandelbrot-Landschaft. Jede braucht eine tiefere Iterationszahl — je näher am Rand, desto länger braucht die Bahn, um zu entkommen.",
    iterations: "Iterationen",
    iterationsInfo:
      "Wie oft wir zₙ → zₙ² + c anwenden, bevor ein Punkt als Teil der Menge gilt. Höhere Werte zeigen feinere Details — auf Kosten von GPU-Arbeit.",
    hueShift: "Farbton-Drehung",
    exposure: "Belichtung",
    palette: "Palette",
    zoomIn: "Hineinzoomen",
    zoomOut: "Herauszoomen",
    reset: "Ansicht zurücksetzen",
    panHint: "ziehen · Doppelklick zoomt · ⌘ + Mausrad",
    zoomLevel: "Zoom",
    autoIter: "Iterationen skalieren mit Zoom",
    bookmarkOverview: "Überblick",
    bookmarkSeahorse: "Seepferdchen-Tal",
    bookmarkElephant: "Elefanten-Tal",
    bookmarkMini: "Mini-Mandelbrot",
    bookmarkSpiral: "Dreifach-Spirale",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Blitz",
    bookmarkSelfSim: "Selbstähnliches Herz",
    bookmarkAntenna: "Antenne",
  },
  life: {
    controls: "Steuerung",
    play: "Start",
    pause: "Pause",
    step: "Schritt ›",
    random: "Zufall",
    clear: "Leeren",
    speed: "Geschwindigkeit",
    patterns: "Klassische Muster",
    patternsInfo:
      "Berühmte Startkonfigurationen, entdeckt zwischen 1970 und heute. Einige sterben sofort; andere laufen tausende Generationen oder feuern für immer Gleiter ab.",
    cellColour: "Zellfarbe",
    rulesBox: "2 oder 3 Nachbarn → überleben · genau 3 → Geburt · sonst → Tod",
    genLabel: "gen",
    popLabel: "pop",
    drawHint: "klicken · ziehen zum Zeichnen",
    ruleSummary: "B3 / S23 · toroidal",
  },
  back: "← Zurück zum Atlas",
  discoverStory: "Story entdecken",
  about: "Über",
  further: { label: "Weiterführend" },
  applications: {
    label: "Wo du es triffst",
    lead: "Wie und wo diese Technik heute in der Welt steckt.",
  },
  sound: { label: "Anhören" },
  related: {
    label: "Verwandte Themen",
    lead: "Themen, die in dieselbe Kerbe schlagen.",
  },
};

const es: UiDict = {
  mandel: {
    bookmarks: "Marcadores",
    bookmarksInfo:
      "Lugares famosos en el paisaje de Mandelbrot. Cada uno necesita más iteraciones — cuanto más cerca del borde, más tarda la órbita en escapar.",
    iterations: "Iteraciones",
    iterationsInfo:
      "Cuántas veces aplicamos zₙ → zₙ² + c antes de declarar un punto dentro del conjunto. Más iteraciones revelan más detalle.",
    hueShift: "Desplazamiento de tono",
    exposure: "Exposición",
    palette: "Paleta",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    reset: "Restablecer vista",
    panHint: "arrastra para mover · doble clic para acercar · ⌘ + rueda",
    zoomLevel: "Zoom",
    autoIter: "Auto-iteración con el zoom",
    bookmarkOverview: "Vista general",
    bookmarkSeahorse: "Valle del Caballito de Mar",
    bookmarkElephant: "Valle de los Elefantes",
    bookmarkMini: "Mini Mandelbrot",
    bookmarkSpiral: "Espiral Triple",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Rayo",
    bookmarkSelfSim: "Corazón autosimilar",
    bookmarkAntenna: "Antena",
  },
  life: {
    controls: "Controles",
    play: "Reproducir",
    pause: "Pausa",
    step: "Paso ›",
    random: "Aleatorio",
    clear: "Limpiar",
    speed: "Velocidad",
    patterns: "Patrones clásicos",
    patternsInfo:
      "Configuraciones iniciales famosas descubiertas entre 1970 y hoy. Algunas mueren al instante; otras corren miles de generaciones o disparan planeadores para siempre.",
    cellColour: "Color de célula",
    rulesBox: "2 o 3 vecinos → sobrevive · exactamente 3 → nace · si no → muere",
    genLabel: "gen",
    popLabel: "pob",
    drawHint: "clic · arrastra para dibujar",
    ruleSummary: "B3 / S23 · toroidal",
  },
  back: "← Volver al atlas",
  discoverStory: "Descubrir la historia",
  about: "Acerca",
  further: { label: "Más lecturas" },
  applications: {
    label: "Dónde te lo encuentras",
    lead: "Cómo y dónde vive hoy esta técnica en el mundo.",
  },
  sound: { label: "Escuchar" },
};

const fr: UiDict = {
  mandel: {
    bookmarks: "Signets",
    bookmarksInfo:
      "Endroits célèbres dans le paysage de Mandelbrot. Chacun demande plus d'itérations — plus on s'approche du bord, plus l'orbite met de temps à s'échapper.",
    iterations: "Itérations",
    iterationsInfo:
      "Nombre de fois où on applique zₙ → zₙ² + c avant de déclarer un point dans l'ensemble. Plus d'itérations révèlent plus de détails.",
    hueShift: "Décalage de teinte",
    exposure: "Exposition",
    palette: "Palette",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    reset: "Réinitialiser la vue",
    panHint: "glisser pour déplacer · double-clic pour zoomer · ⌘ + molette",
    zoomLevel: "Zoom",
    autoIter: "Auto-itération avec le zoom",
    bookmarkOverview: "Vue d'ensemble",
    bookmarkSeahorse: "Vallée des Hippocampes",
    bookmarkElephant: "Vallée des Éléphants",
    bookmarkMini: "Mini Mandelbrot",
    bookmarkSpiral: "Triple Spirale",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Éclair",
    bookmarkSelfSim: "Cœur auto-similaire",
    bookmarkAntenna: "Antenne",
  },
  life: {
    controls: "Contrôles",
    play: "Lecture",
    pause: "Pause",
    step: "Pas ›",
    random: "Aléatoire",
    clear: "Effacer",
    speed: "Vitesse",
    patterns: "Motifs classiques",
    patternsInfo:
      "Configurations de départ célèbres découvertes entre 1970 et aujourd'hui. Certaines meurent en un instant ; d'autres courent sur des milliers de générations ou tirent des planeurs à l'infini.",
    cellColour: "Couleur de cellule",
    rulesBox: "2 ou 3 voisins → survie · exactement 3 → naissance · sinon → mort",
    genLabel: "gén",
    popLabel: "pop",
    drawHint: "clic · glisser pour dessiner",
    ruleSummary: "B3 / S23 · toroïdal",
  },
  back: "← Retour à l'atlas",
  discoverStory: "Découvrir l'histoire",
  about: "À propos",
  further: { label: "Pour aller plus loin" },
  applications: {
    label: "Où on la rencontre",
    lead: "Comment et où cette technique vit aujourd'hui dans le monde.",
  },
  sound: { label: "Écouter" },
};

const it: UiDict = {
  mandel: {
    bookmarks: "Segnalibri",
    bookmarksInfo:
      "Luoghi famosi nel paesaggio di Mandelbrot. Ciascuno richiede più iterazioni — più ci si avvicina al bordo, più l'orbita impiega a fuggire.",
    iterations: "Iterazioni",
    iterationsInfo:
      "Quante volte applichiamo zₙ → zₙ² + c prima di dichiarare un punto interno all'insieme. Più iterazioni rivelano più dettagli.",
    hueShift: "Spostamento tonalità",
    exposure: "Esposizione",
    palette: "Tavolozza",
    zoomIn: "Zoom avanti",
    zoomOut: "Zoom indietro",
    reset: "Ripristina vista",
    panHint: "trascina per muovere · doppio clic per ingrandire · ⌘ + rotella",
    zoomLevel: "Zoom",
    autoIter: "Auto-iterazioni con lo zoom",
    bookmarkOverview: "Panoramica",
    bookmarkSeahorse: "Valle del Cavalluccio",
    bookmarkElephant: "Valle degli Elefanti",
    bookmarkMini: "Mini Mandelbrot",
    bookmarkSpiral: "Spirale Tripla",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Fulmine",
    bookmarkSelfSim: "Cuore autosimile",
    bookmarkAntenna: "Antenna",
  },
  life: {
    controls: "Controlli",
    play: "Riproduci",
    pause: "Pausa",
    step: "Passo ›",
    random: "Casuale",
    clear: "Svuota",
    speed: "Velocità",
    patterns: "Schemi classici",
    patternsInfo:
      "Configurazioni famose scoperte tra il 1970 e oggi. Alcune muoiono subito; altre corrono per migliaia di generazioni o sparano alianti per sempre.",
    cellColour: "Colore della cella",
    rulesBox: "2 o 3 vicini → sopravvive · esattamente 3 → nasce · altrimenti → muore",
    genLabel: "gen",
    popLabel: "pop",
    drawHint: "clic · trascina per disegnare",
    ruleSummary: "B3 / S23 · toroidale",
  },
  back: "← Torna all'atlante",
  discoverStory: "Scopri la storia",
  about: "Chi siamo",
  further: { label: "Letture di approfondimento" },
  applications: {
    label: "Dove la incontri",
    lead: "Come e dove questa tecnica vive oggi nel mondo.",
  },
  sound: { label: "Ascoltare" },
};

const pt: UiDict = {
  mandel: {
    bookmarks: "Marcadores",
    bookmarksInfo:
      "Lugares famosos na paisagem de Mandelbrot. Cada um exige mais iterações — quanto mais perto da borda, mais demora a órbita a escapar.",
    iterations: "Iterações",
    iterationsInfo:
      "Quantas vezes aplicamos zₙ → zₙ² + c antes de declarar um ponto dentro do conjunto. Mais iterações revelam mais detalhe.",
    hueShift: "Mudança de matiz",
    exposure: "Exposição",
    palette: "Paleta",
    zoomIn: "Aproximar",
    zoomOut: "Afastar",
    reset: "Repor vista",
    panHint: "arrasta para mover · duplo clique para aproximar · ⌘ + roda",
    zoomLevel: "Zoom",
    autoIter: "Iterações automáticas com o zoom",
    bookmarkOverview: "Visão geral",
    bookmarkSeahorse: "Vale do Cavalo-marinho",
    bookmarkElephant: "Vale dos Elefantes",
    bookmarkMini: "Mini Mandelbrot",
    bookmarkSpiral: "Espiral Tripla",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Relâmpago",
    bookmarkSelfSim: "Coração autossimilar",
    bookmarkAntenna: "Antena",
  },
  life: {
    controls: "Controlos",
    play: "Reproduzir",
    pause: "Pausa",
    step: "Passo ›",
    random: "Aleatório",
    clear: "Limpar",
    speed: "Velocidade",
    patterns: "Padrões clássicos",
    patternsInfo:
      "Configurações iniciais famosas descobertas entre 1970 e hoje. Algumas morrem de imediato; outras correm por milhares de gerações ou disparam planadores para sempre.",
    cellColour: "Cor da célula",
    rulesBox: "2 ou 3 vizinhos → sobrevive · exatamente 3 → nasce · senão → morre",
    genLabel: "ger",
    popLabel: "pop",
    drawHint: "clica · arrasta para desenhar",
    ruleSummary: "B3 / S23 · toroidal",
  },
  back: "← Voltar ao atlas",
  discoverStory: "Descobrir a história",
  about: "Sobre",
  further: { label: "Leituras adicionais" },
  applications: {
    label: "Onde te encontras com isto",
    lead: "Como e onde esta técnica vive hoje no mundo.",
  },
  sound: { label: "Ouvir" },
};

const sv: UiDict = {
  mandel: {
    bookmarks: "Bokmärken",
    bookmarksInfo:
      "Berömda platser i Mandelbrotlandskapet. Var och en kräver fler iterationer — ju närmare randen, desto längre tid tar banan att fly.",
    iterations: "Iterationer",
    iterationsInfo:
      "Hur många gånger vi applicerar zₙ → zₙ² + c innan en punkt räknas till mängden. Fler iterationer ger finare detaljer.",
    hueShift: "Nyansförskjutning",
    exposure: "Exponering",
    palette: "Palett",
    zoomIn: "Zooma in",
    zoomOut: "Zooma ut",
    reset: "Återställ vy",
    panHint: "dra för att panorera · dubbelklick för att zooma · ⌘ + hjul",
    zoomLevel: "Zoom",
    autoIter: "Auto-iter skalar med zoom",
    bookmarkOverview: "Översikt",
    bookmarkSeahorse: "Sjöhästdalen",
    bookmarkElephant: "Elefantdalen",
    bookmarkMini: "Mini-Mandelbrot",
    bookmarkSpiral: "Trippelspiral",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Blixt",
    bookmarkSelfSim: "Självliknande hjärta",
    bookmarkAntenna: "Antenn",
  },
  life: {
    controls: "Kontroller",
    play: "Spela",
    pause: "Paus",
    step: "Steg ›",
    random: "Slump",
    clear: "Rensa",
    speed: "Hastighet",
    patterns: "Klassiska mönster",
    patternsInfo:
      "Berömda startkonfigurationer upptäckta mellan 1970 och idag. Vissa dör direkt; andra löper i tusentals generationer eller skickar iväg glidare för evigt.",
    cellColour: "Cellfärg",
    rulesBox: "2 eller 3 grannar → överlever · exakt 3 → föds · annars → dör",
    genLabel: "gen",
    popLabel: "pop",
    drawHint: "klick · dra för att rita",
    ruleSummary: "B3 / S23 · toroidal",
  },
  back: "← Tillbaka till atlasen",
  discoverStory: "Upptäck berättelsen",
  about: "Om",
  further: { label: "Vidare läsning" },
  applications: {
    label: "Var du möter den",
    lead: "Hur och var den här tekniken lever i världen idag.",
  },
  sound: { label: "Lyssna" },
};

const no: UiDict = {
  mandel: {
    bookmarks: "Bokmerker",
    bookmarksInfo:
      "Berømte steder i Mandelbrot-landskapet. Hvert sted krever flere iterasjoner — jo nærmere kanten, desto lengre tid bruker banen på å rømme.",
    iterations: "Iterasjoner",
    iterationsInfo:
      "Hvor mange ganger vi anvender zₙ → zₙ² + c før et punkt regnes med i mengden. Flere iterasjoner gir finere detaljer.",
    hueShift: "Nyanseforskyvning",
    exposure: "Eksponering",
    palette: "Palett",
    zoomIn: "Zoom inn",
    zoomOut: "Zoom ut",
    reset: "Tilbakestill visning",
    panHint: "dra for å panorere · dobbeltklikk for å zoome · ⌘ + hjul",
    zoomLevel: "Zoom",
    autoIter: "Auto-iter skalerer med zoom",
    bookmarkOverview: "Oversikt",
    bookmarkSeahorse: "Sjøhestdalen",
    bookmarkElephant: "Elefantdalen",
    bookmarkMini: "Mini-Mandelbrot",
    bookmarkSpiral: "Trippelspiral",
    bookmarkMisiurewicz: "Misiurewicz",
    bookmarkLightning: "Lyn",
    bookmarkSelfSim: "Selvlignende hjerte",
    bookmarkAntenna: "Antenne",
  },
  life: {
    controls: "Kontroller",
    play: "Spill",
    pause: "Pause",
    step: "Steg ›",
    random: "Tilfeldig",
    clear: "Tøm",
    speed: "Hastighet",
    patterns: "Klassiske mønstre",
    patternsInfo:
      "Berømte startkonfigurasjoner oppdaget mellom 1970 og i dag. Noen dør med en gang; andre løper i tusenvis av generasjoner eller fyrer av glidere for alltid.",
    cellColour: "Cellefarge",
    rulesBox: "2 eller 3 naboer → overlever · nøyaktig 3 → fødes · ellers → dør",
    genLabel: "gen",
    popLabel: "pop",
    drawHint: "klikk · dra for å tegne",
    ruleSummary: "B3 / S23 · toroidal",
  },
  back: "← Tilbake til atlaset",
  discoverStory: "Oppdag historien",
  about: "Om",
  further: { label: "Videre lesing" },
  applications: {
    label: "Hvor du møter den",
    lead: "Hvordan og hvor denne teknikken lever i verden i dag.",
  },
  sound: { label: "Hør" },
};

export const UI: Record<Locale, UiDict> = { en, de, es, fr, it, pt, sv, no };
