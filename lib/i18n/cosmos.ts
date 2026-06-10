// Cosmos-only i18n bundle. Kept separate from atlas.ts so the scroll-driven
// landing can carry its own poetic copy without bloating the topic-card
// dictionary. All eight locales are fully filled — every string here is
// short enough that translation cost is negligible.

import type { TopicCategory } from "@/lib/topics";
import type { Locale } from "@/lib/i18n/types";

export interface CosmosDict {
  scrollHint: string;
  approach: string;
  overviewTitle: string;
  overviewSub: string;
  searchHint: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchAria: string;
  jumpLabel: string;
  beginAgain: string;
  paletteShortcut: string;
  progressAria: string;
  // Hero CTA — primary "begin here" button. Without it visitors landed on
  // the hero, read the prose, and didn't know what to do next.
  exploreAtlas: string;
  // One poetic 1-liner per category, displayed beside the constellation.
  taglines: Record<TopicCategory, string>;
  // Narrative arc — six acts in three pairs:
  //   I  · paradox     → crisis
  //   II · logic       → stability (the crisis answered)
  //   III · computation → construction
  //   IV · chaos       → undoing (construction unbuilt)
  //   V  · geometry    → form
  //   VI · analysis    → limit (form dissolved into continuum)
  // Each scene's heading carries its Roman numeral + chapter title in
  // the category colour so the visitor can feel they're moving through
  // a sequence, not picking from a flat menu.
  acts: Record<TopicCategory, { numeral: string; title: string }>;
}

export const COSMOS: Record<Locale, CosmosDict> = {
  en: {
    scrollHint: "Scroll into the cosmos",
    approach: "Six clusters. Fifty ideas. One rule each.",
    overviewTitle: "The whole sky",
    overviewSub: "Pick a star. Or search the cosmos.",
    searchHint: "Topics, formulas, ideas — try “chaos” or “ζ”",
    searchPlaceholder: "Search the cosmos…",
    searchEmpty: "No stars match that name.",
    searchAria: "Search the cosmos",
    jumpLabel: "Jump to",
    beginAgain: "Begin again",
    paletteShortcut: "Press / to search",
    progressAria: "Reading progress",
    exploreAtlas: "Explore the atlas",
    taglines: {
      paradox: "Where intuition splits in two.",
      logic: "Truth from a single hinge.",
      computation: "Rules that learn to draw worlds.",
      chaos: "Order, in love with its own undoing.",
      geometry: "Shape, where shape stops being decoration.",
      analysis: "The arithmetic of the infinite.",
    },
    acts: {
      paradox: { numeral: "I", title: "The crisis" },
      logic: { numeral: "II", title: "The hinge" },
      computation: { numeral: "III", title: "The build" },
      chaos: { numeral: "IV", title: "The undoing" },
      geometry: { numeral: "V", title: "The form" },
      analysis: { numeral: "VI", title: "The limit" },
    },
  },
  de: {
    scrollHint: "In den Kosmos hineinscrollen",
    approach: "Sechs Cluster. Fünfzig Ideen. Jeweils eine Regel.",
    overviewTitle: "Der ganze Himmel",
    overviewSub: "Wähl einen Stern. Oder durchsuche den Kosmos.",
    searchHint: "Themen, Formeln, Ideen — versuch «Chaos» oder «ζ»",
    searchPlaceholder: "Den Kosmos durchsuchen…",
    searchEmpty: "Kein Stern passt zu diesem Namen.",
    searchAria: "Den Kosmos durchsuchen",
    jumpLabel: "Springen zu",
    beginAgain: "Von vorn beginnen",
    paletteShortcut: "Drücke / zum Suchen",
    progressAria: "Lese-Fortschritt",
    exploreAtlas: "Atlas erkunden",
    taglines: {
      paradox: "Wo Intuition sich in zwei spaltet.",
      logic: "Wahrheit aus einem einzigen Scharnier.",
      computation: "Regeln, die lernen, Welten zu zeichnen.",
      chaos: "Ordnung, verliebt in ihren eigenen Zerfall.",
      geometry: "Form, wo Form aufhört, Dekoration zu sein.",
      analysis: "Die Arithmetik des Unendlichen.",
    },
    acts: {
      paradox: { numeral: "I", title: "Die Krise" },
      logic: { numeral: "II", title: "Das Scharnier" },
      computation: { numeral: "III", title: "Der Aufbau" },
      chaos: { numeral: "IV", title: "Der Zerfall" },
      geometry: { numeral: "V", title: "Die Form" },
      analysis: { numeral: "VI", title: "Die Grenze" },
    },
  },
  es: {
    scrollHint: "Desplázate hacia el cosmos",
    approach: "Seis cúmulos. Cincuenta ideas. Una regla cada uno.",
    overviewTitle: "El cielo entero",
    overviewSub: "Elige una estrella. O busca en el cosmos.",
    searchHint: "Temas, fórmulas, ideas — prueba «caos» o «ζ»",
    searchPlaceholder: "Buscar en el cosmos…",
    searchEmpty: "Ninguna estrella coincide.",
    searchAria: "Buscar en el cosmos",
    jumpLabel: "Saltar a",
    beginAgain: "Empezar de nuevo",
    paletteShortcut: "Pulsa / para buscar",
    progressAria: "Progreso de lectura",
    exploreAtlas: "Explorar el atlas",
    taglines: {
      paradox: "Donde la intuición se parte en dos.",
      logic: "Verdad desde una sola bisagra.",
      computation: "Reglas que aprenden a dibujar mundos.",
      chaos: "Orden, enamorado de su propio deshacerse.",
      geometry: "Forma, donde la forma deja de ser decoración.",
      analysis: "La aritmética del infinito.",
    },
    acts: {
      paradox: { numeral: "I", title: "La crisis" },
      logic: { numeral: "II", title: "La bisagra" },
      computation: { numeral: "III", title: "La construcción" },
      chaos: { numeral: "IV", title: "El deshacer" },
      geometry: { numeral: "V", title: "La forma" },
      analysis: { numeral: "VI", title: "El límite" },
    },
  },
  fr: {
    scrollHint: "Glissez dans le cosmos",
    approach: "Six amas. Cinquante idées. Une règle chacune.",
    overviewTitle: "Le ciel entier",
    overviewSub: "Choisissez une étoile. Ou cherchez dans le cosmos.",
    searchHint: "Sujets, formules, idées — essayez « chaos » ou « ζ »",
    searchPlaceholder: "Chercher dans le cosmos…",
    searchEmpty: "Aucune étoile ne correspond.",
    searchAria: "Chercher dans le cosmos",
    jumpLabel: "Aller à",
    beginAgain: "Recommencer",
    paletteShortcut: "Appuyez sur / pour chercher",
    progressAria: "Progression de lecture",
    exploreAtlas: "Explorer l'atlas",
    taglines: {
      paradox: "Là où l'intuition se dédouble.",
      logic: "La vérité née d'une seule charnière.",
      computation: "Des règles qui apprennent à dessiner des mondes.",
      chaos: "L'ordre, épris de sa propre défaite.",
      geometry: "La forme, là où elle cesse d'être décoration.",
      analysis: "L'arithmétique de l'infini.",
    },
    acts: {
      paradox: { numeral: "I", title: "La crise" },
      logic: { numeral: "II", title: "La charnière" },
      computation: { numeral: "III", title: "La construction" },
      chaos: { numeral: "IV", title: "La défaite" },
      geometry: { numeral: "V", title: "La forme" },
      analysis: { numeral: "VI", title: "La limite" },
    },
  },
  it: {
    scrollHint: "Scorri dentro il cosmo",
    approach: "Sei ammassi. Cinquanta idee. Una regola ciascuno.",
    overviewTitle: "L'intero cielo",
    overviewSub: "Scegli una stella. O cerca nel cosmo.",
    searchHint: "Argomenti, formule, idee — prova «caos» o «ζ»",
    searchPlaceholder: "Cerca nel cosmo…",
    searchEmpty: "Nessuna stella corrisponde.",
    searchAria: "Cerca nel cosmo",
    jumpLabel: "Vai a",
    beginAgain: "Ricominciare",
    paletteShortcut: "Premi / per cercare",
    progressAria: "Avanzamento di lettura",
    exploreAtlas: "Esplora l'atlante",
    taglines: {
      paradox: "Dove l'intuizione si sdoppia.",
      logic: "Verità da una sola cerniera.",
      computation: "Regole che imparano a disegnare mondi.",
      chaos: "Ordine, innamorato del proprio disfarsi.",
      geometry: "Forma, dove la forma smette di essere decorazione.",
      analysis: "L'aritmetica dell'infinito.",
    },
    acts: {
      paradox: { numeral: "I", title: "La crisi" },
      logic: { numeral: "II", title: "La cerniera" },
      computation: { numeral: "III", title: "La costruzione" },
      chaos: { numeral: "IV", title: "Il disfarsi" },
      geometry: { numeral: "V", title: "La forma" },
      analysis: { numeral: "VI", title: "Il limite" },
    },
  },
  pt: {
    scrollHint: "Role para o cosmos",
    approach: "Seis aglomerados. Cinquenta ideias. Uma regra cada um.",
    overviewTitle: "O céu inteiro",
    overviewSub: "Escolha uma estrela. Ou pesquise o cosmos.",
    searchHint: "Tópicos, fórmulas, ideias — tente «caos» ou «ζ»",
    searchPlaceholder: "Pesquisar no cosmos…",
    searchEmpty: "Nenhuma estrela corresponde.",
    searchAria: "Pesquisar no cosmos",
    jumpLabel: "Saltar para",
    beginAgain: "Começar de novo",
    paletteShortcut: "Pressione / para pesquisar",
    progressAria: "Progresso de leitura",
    exploreAtlas: "Explorar o atlas",
    taglines: {
      paradox: "Onde a intuição se parte em dois.",
      logic: "Verdade a partir de uma só dobradiça.",
      computation: "Regras que aprendem a desenhar mundos.",
      chaos: "Ordem, apaixonada pelo próprio desfazer-se.",
      geometry: "Forma, onde a forma deixa de ser decoração.",
      analysis: "A aritmética do infinito.",
    },
    acts: {
      paradox: { numeral: "I", title: "A crise" },
      logic: { numeral: "II", title: "A dobradiça" },
      computation: { numeral: "III", title: "A construção" },
      chaos: { numeral: "IV", title: "O desfazer" },
      geometry: { numeral: "V", title: "A forma" },
      analysis: { numeral: "VI", title: "O limite" },
    },
  },
  sv: {
    scrollHint: "Rulla in i kosmos",
    approach: "Sex hopar. Femtio idéer. En regel var.",
    overviewTitle: "Hela himlen",
    overviewSub: "Välj en stjärna. Eller sök i kosmos.",
    searchHint: "Ämnen, formler, idéer — testa ”kaos” eller ”ζ”",
    searchPlaceholder: "Sök i kosmos…",
    searchEmpty: "Ingen stjärna matchar.",
    searchAria: "Sök i kosmos",
    jumpLabel: "Hoppa till",
    beginAgain: "Börja om",
    paletteShortcut: "Tryck / för att söka",
    progressAria: "Läsförlopp",
    exploreAtlas: "Utforska atlasen",
    taglines: {
      paradox: "Där intuitionen klyvs i tu.",
      logic: "Sanning ur ett enda gångjärn.",
      computation: "Regler som lär sig rita världar.",
      chaos: "Ordning, förälskad i sin egen upplösning.",
      geometry: "Form, där form upphör att vara dekoration.",
      analysis: "Det oändligas aritmetik.",
    },
    acts: {
      paradox: { numeral: "I", title: "Krisen" },
      logic: { numeral: "II", title: "Gångjärnet" },
      computation: { numeral: "III", title: "Bygget" },
      chaos: { numeral: "IV", title: "Upplösningen" },
      geometry: { numeral: "V", title: "Formen" },
      analysis: { numeral: "VI", title: "Gränsen" },
    },
  },
  no: {
    scrollHint: "Rull inn i kosmos",
    approach: "Seks hoper. Femti idéer. Én regel hver.",
    overviewTitle: "Hele himmelen",
    overviewSub: "Velg en stjerne. Eller søk i kosmos.",
    searchHint: "Temaer, formler, idéer — prøv «kaos» eller «ζ»",
    searchPlaceholder: "Søk i kosmos…",
    searchEmpty: "Ingen stjerne passer.",
    searchAria: "Søk i kosmos",
    jumpLabel: "Hopp til",
    beginAgain: "Begynn på nytt",
    paletteShortcut: "Trykk / for å søke",
    progressAria: "Lesefremdrift",
    exploreAtlas: "Utforsk atlaset",
    taglines: {
      paradox: "Der intuisjonen kløyves i to.",
      logic: "Sannhet ut av et eneste hengsel.",
      computation: "Regler som lærer å tegne verdener.",
      chaos: "Orden, forelsket i sin egen oppløsning.",
      geometry: "Form, der form slutter å være pynt.",
      analysis: "Det uendeliges aritmetikk.",
    },
    acts: {
      paradox: { numeral: "I", title: "Krisen" },
      logic: { numeral: "II", title: "Hengselet" },
      computation: { numeral: "III", title: "Byggverket" },
      chaos: { numeral: "IV", title: "Oppløsningen" },
      geometry: { numeral: "V", title: "Formen" },
      analysis: { numeral: "VI", title: "Grensen" },
    },
  },
};
