"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { ApollonianDescartes } from "@/components/ApollonianDescartes";
import { ApollonianGasket } from "@/components/ApollonianGasket";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-rose";

// --------------------------------------------------------------------------
// Rich, per-locale story content. The hero (pretitle/title/tagline/intro)
// still comes from the shared stories.ts; everything below the hero is
// authored here so the page can tell a longer story without bloating the
// shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
  page: Omit<StoryPage, "sections">;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  descartes: {
    caption: string;
    inputsLabel: string;
    solutionsLabel: string;
    invalidLabel: string;
    presetLabel: string;
    plusLabel: string;
    minusLabel: string;
    noteText: string;
    pretitle: string;
    title: string;
    body: string;
  };
  gasket: {
    caption: string;
    seedLabel: string;
    depthLabel: string;
    countLabel: (n: number) => string;
    hint: string;
    pretitle: string;
    title: string;
    body: string;
  };
  integerTableLabel: string;
  integerTableNote: string;
  integerTableSeedHead: string;
  integerTableRestHead: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "Apollonian Circle Packing",
    tagline: "Circles inside circles inside circles.",
    intro:
      "Start with three mutually tangent circles and a rule for what counts as tangent. The Explorer recursively fills every curved triangular gap with a new circle, then fills the smaller gaps in turn — pick the starting curvatures and watch a gasket emerge that is fractal forever.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Three circles. Fill every gap. Forever.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Draw three circles that all touch one another. Between them sits a curved triangular gap. Drop the largest circle you can into that gap — it touches all three. Now you have three new, smaller gaps. Repeat. The picture you get, the gasket, is a fractal coral that grows from a single rule: every gap is a new seat for a new circle.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Take the seed (−1, 2, 2, 3): one big outer circle of radius 1, two equal interior circles of radius 1/2 side by side, and one little circle of radius 1/3 perched between them. Each number is the curvature k = 1/radius. The outer one is negative because it encloses the others — that minus sign is the only piece of bookkeeping you need.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Apollonius asked which circles touch three given ones around 200 BC; Descartes locked the answer into algebra in 1643. But which integer curvatures actually appear in any given packing is still an open problem in arithmetic geometry. A picture of touching circles turns out to hide a piece of number theory we haven't finished writing.",
      },
    ],
    tryIt: "Below: compute the fourth curvature yourself, then watch the gasket grow.",
  },
  sections: [
    {
      pretitle: "Section 01 · The starting position",
      title: "Three circles touching",
      body: "Draw three circles, each one tangent to the other two — three kisses between them, three points of contact. Around 200 BC Apollonius of Perga asked the natural follow-up: which circles are tangent to all three? The answer is exactly two. A small one inscribed in the curved gap between them, and a large one circumscribed around the triple. Add either to your three, and you have four mutually tangent circles. That quadruple is the seed of everything that follows.",
    },
    {
      pretitle: "Section 02 · Descartes' theorem",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Write each circle's curvature as k = 1/r, taking the outer enclosing circle's k negative. Descartes worked this out in his 1643 correspondence with Princess Elisabeth of Bohemia, showing that any four mutually tangent circles satisfy a single quadratic identity. Solving it for the unknown fourth gives k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). The two signs are Apollonius' two answers: + drops the small inscribed circle into the gap, − gives the other tangent circle on the opposite side of the triple.",
    },
    {
      pretitle: "Section 03 · Recursive filling",
      title: "Every gap is a new seed",
      body: "Once the seed quadruple is in place, every curved-triangular gap is itself bounded by three mutually tangent circles — exactly the configuration we started from. Apply Descartes' formula again with the + sign to drop the inscribed circle into the gap. That new circle splits its gap into three new, smaller curved triangles, each of which is again a seed. The process is self-similar: the rule for filling the first gap is the same rule that fills every gap forever.",
    },
    {
      pretitle: "Section 04 · The integer surprise",
      title: "Pick integers — get integers forever",
      body: "Choose the four seed curvatures to be whole numbers. Then a small algebraic miracle happens: every subsequent circle in the gasket also has integer curvature. The reason is that (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) is symmetric in the four variables, so swapping the old k₄ for the new k₄' gives k₄' = 2(k₁+k₂+k₃) − k₄ — no square root, just integer arithmetic. The packing (−1, 2, 2, 3) generates curvatures 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Every single integer Apollonian packing does the same. The picture is, at heart, a number-theoretic object.",
    },
    {
      pretitle: "Section 05 · Hausdorff dimension ≈ 1.3056867",
      title: "Between a curve and a region",
      body: "Keep filling. The union of all the circles you ever draw covers more and more of the original disc, but never all of it. The leftover dust — the points that belong to no circle — has Lebesgue measure zero, yet it is everywhere dense. Its Hausdorff dimension was computed numerically by Boyd and rigorously bounded by McMullen at about 1.3056867. The number is universal: it does not depend on which seed you start from. Every Apollonian gasket has the same fractal weight.",
    },
    {
      pretitle: "Section 06 · Open problems and connections",
      title: "Bourgain–Fuchs, hyperbolic geometry, and what remains unknown",
      body: "The integer curvatures in an Apollonian packing form a set of natural numbers, but which numbers appear? The local-to-global conjecture predicted: a curvature appears in a fixed packing iff it appears modulo 24 in that packing — beyond a finite list of exceptions. Disproved in 2023 by Haag, Kertzer, Rickards and Stange (Annals of Mathematics): there are infinite families of curvatures that are locally allowed but never globally appear. Bourgain and Fuchs had already shown in 2011 that the integer curvatures still have positive density — a fixed positive fraction of all integers really do show up. Behind this lives a deeper story — every Apollonian packing is an orbit of a group acting by Lorentzian reflections on a quadratic form of signature (3,1), and the same packings reappear as boundaries of hyperbolic 3-manifolds. Geometry, number theory, and group theory meet in a picture of touching circles.",
    },
  ],
  descartes: {
    caption: "Interactive · Descartes calculator",
    inputsLabel: "Three curvatures",
    solutionsLabel: "Two solutions for k₄",
    invalidLabel:
      "These three curvatures cannot be mutually tangent — k₁k₂ + k₂k₃ + k₃k₁ must be ≥ 0.",
    presetLabel: "Try a known triple",
    plusLabel: "+ inscribed (small)",
    minusLabel: "− circumscribed (large)",
    noteText:
      "Pick three curvatures — positive for ordinary circles, negative for an enclosing one. The formula gives the two circles tangent to all three. Try (−1, 2, 2): the + solution is k₄ = 3, the − solution k₄ = 3 as well — the seed (−1, 2, 2, 3) is symmetric.",
    pretitle: "Interactive · the formula by hand",
    title: "Type three curvatures, watch the fourth appear",
    body: "Descartes' formula is a quadratic in k₄, so it has two roots. Type any three signed curvatures into the boxes below and the calculator returns both roots, the inscribed and the circumscribed. Pick the presets to feel how the algebra behaves on the canonical integer seeds — and notice how often the answer is itself an integer.",
  },
  gasket: {
    caption: "Interactive · grow the gasket",
    seedLabel: "Seed packing",
    depthLabel: "Recursion depth",
    countLabel: (n: number) => `${n} circles`,
    hint: "Each step fills every curved-triangle gap with its inscribed circle. The colour sweeps with the log of the curvature: rose for the outer ring, then amber, cyan, violet for finer and finer detail.",
    pretitle: "Interactive · the recursive picture",
    title: "Pick a seed, turn the depth knob",
    body: "Choose one of the four classical integer seeds, then slide the recursion depth up and down. At depth 1 you see the seed itself; at depth 6 a coral of thousands of circles. The renderer is the same one that powers the full Explorer — only the depth ceiling is lower so the story page stays responsive.",
  },
  integerTableLabel: "Integer seed packings",
  integerTableNote:
    "Every curvature in every one of these packings is an integer — forever, at every recursion depth.",
  integerTableSeedHead: "seed (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "first new curvatures",
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you push the recursion deeper, toggle curvature labels, switch palettes, and try every integer seed packing. Everything you just read is one click away.",
  closingCta: "→ Open the Explorer",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "Apollonische Kreispackung",
    tagline: "Kreise in Kreisen in Kreisen.",
    intro:
      "Starte mit drei sich gegenseitig berührenden Kreisen und einer Regel, was als Berührung zählt. Der Explorer füllt rekursiv jede gekrümmte Dreieckslücke mit einem neuen Kreis und füllt dann die kleineren Lücken — wähle die Anfangskrümmungen und beobachte, wie eine Packung entsteht, die für immer fraktal bleibt.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Drei Kreise. Jede Lücke füllen. Für immer.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Zeichne drei Kreise, die sich gegenseitig berühren. Zwischen ihnen liegt eine gekrümmte Dreieckslücke. Setz den größten Kreis hinein, der noch passt — er berührt alle drei. Jetzt hast du drei neue, kleinere Lücken. Wiederhole. Das Bild, das entsteht — die Packung — ist eine fraktale Koralle aus einer einzigen Regel: jede Lücke ist Sitz eines neuen Kreises.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Nimm den Keim (−1, 2, 2, 3): ein großer äußerer Kreis vom Radius 1, zwei gleichgroße Innenkreise mit Radius 1/2 nebeneinander, und ein kleiner Kreis mit Radius 1/3 darüber. Jede Zahl ist die Krümmung k = 1/Radius. Der äußere wird negativ gezählt, weil er die anderen umschließt — dieses Minuszeichen ist die einzige Buchhaltung, die du brauchst.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Apollonius fragte um 200 v. Chr., welche Kreise drei gegebene berühren; Descartes verriegelte 1643 die Antwort in Algebra. Aber welche ganzzahligen Krümmungen in einer Packung tatsächlich vorkommen, ist bis heute ein offenes Problem der arithmetischen Geometrie. Ein Bild sich küssender Kreise verbirgt ein Stück Zahlentheorie, das wir noch nicht zu Ende geschrieben haben.",
      },
    ],
    tryIt: "Unten: berechne die vierte Krümmung selbst, dann sieh der Packung beim Wachsen zu.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Ausgangslage",
      title: "Drei Kreise, die sich berühren",
      body: "Drei Kreise in der Ebene, jeder zu den anderen beiden tangent — drei Küsse, drei Berührpunkte. Um 200 v. Chr. stellte Apollonius von Perge die naheliegende Frage: welche Kreise berühren alle drei? Die Antwort lautet genau zwei. Ein kleiner, eingeschriebener in der gekrümmten Lücke, und ein großer, umschriebener um das Tripel. Nimm einen davon hinzu, und du hast vier paarweise tangentiale Kreise. Dieses Quadrupel ist der Keim für alles Weitere.",
    },
    {
      pretitle: "Abschnitt 02 · Descartes' Satz",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Schreib jede Krümmung als k = 1/r, mit einer Konvention: die umschließende Außenkreis-Krümmung ist negativ. In seiner Korrespondenz von 1643 mit Prinzessin Elisabeth von Böhmen zeigte Descartes, dass für vier paarweise tangentiale Kreise eine einzige quadratische Identität gilt. Auflösen nach der vierten ergibt k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Die zwei Vorzeichen sind Apollonius' zwei Antworten: + setzt den kleinen eingeschriebenen Kreis in die Lücke, − liefert den anderen Tangentialkreis auf der gegenüberliegenden Seite.",
    },
    {
      pretitle: "Abschnitt 03 · Rekursives Füllen",
      title: "Jede Lücke ist ein neuer Keim",
      body: "Sobald das Keim-Quadrupel steht, ist jede gekrümmte Dreieckslücke selbst von drei paarweise tangentialen Kreisen begrenzt — genau die Konfiguration vom Anfang. Wende Descartes' Formel mit dem + erneut an und setz den eingeschriebenen Kreis in die Lücke. Dieser neue Kreis spaltet seine Lücke in drei kleinere, gekrümmte Dreiecke auf — jedes ein neuer Keim. Der Prozess ist selbstähnlich: dieselbe Regel, die die erste Lücke füllt, füllt jede Lücke für immer.",
    },
    {
      pretitle: "Abschnitt 04 · Die Ganzzahl-Überraschung",
      title: "Ganze Zahlen rein — ganze Zahlen für immer",
      body: "Wähl die vier Keim-Krümmungen ganzzahlig. Dann passiert ein algebraisches Wunder: jede weitere Krümmung in der Packung ist ebenfalls ganzzahlig. Der Grund: (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) ist symmetrisch in den vier Variablen, also liefert das Ersetzen der alten k₄ durch die neue k₄' die Formel k₄' = 2(k₁+k₂+k₃) − k₄ — keine Wurzel, nur ganzzahlige Arithmetik. Die Packung (−1, 2, 2, 3) erzeugt 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Jede ganzzahlige Apollonius-Packung tut dasselbe. Das Bild ist im Kern ein zahlentheoretisches Objekt.",
    },
    {
      pretitle: "Abschnitt 05 · Hausdorff-Dimension ≈ 1,3056867",
      title: "Zwischen Kurve und Fläche",
      body: "Füll weiter. Die Vereinigung aller je gezeichneten Kreise bedeckt immer mehr der ursprünglichen Scheibe, aber nie alles. Der Reststaub — die Punkte, die zu keinem Kreis gehören — hat Lebesgue-Maß null, ist aber überall dicht. Seine Hausdorff-Dimension wurde von Boyd numerisch berechnet und von McMullen streng bei etwa 1,3056867 eingeschnürt. Die Zahl ist universell: sie hängt nicht vom Keim ab. Jede Apollonius-Packung hat dasselbe fraktale Gewicht.",
    },
    {
      pretitle: "Abschnitt 06 · Offene Probleme und Verbindungen",
      title: "Bourgain–Fuchs, hyperbolische Geometrie, und was offen bleibt",
      body: "Die ganzzahligen Krümmungen in einer Apollonius-Packung bilden eine Menge natürlicher Zahlen — aber welche kommen vor? Die lokal-global-Vermutung sagte voraus: eine Krümmung kommt in einer festen Packung genau dann vor, wenn sie modulo 24 in ihr vorkommt — bis auf endlich viele Ausnahmen. 2023 widerlegt von Haag, Kertzer, Rickards und Stange (Annals of Mathematics): es gibt unendliche Familien von Krümmungen, die lokal erlaubt sind, global aber nie erscheinen. Bourgain und Fuchs hatten 2011 immerhin gezeigt, dass die vorkommenden Krümmungen positive Dichte haben: ein fester positiver Anteil aller ganzen Zahlen taucht wirklich auf. Dahinter lebt eine tiefere Geschichte — jede Apollonius-Packung ist die Bahn einer Gruppe von Lorentz-Spiegelungen auf einer quadratischen Form der Signatur (3,1), und dieselben Packungen tauchen als Ränder hyperbolischer 3-Mannigfaltigkeiten wieder auf. Geometrie, Zahlentheorie und Gruppentheorie treffen sich in einem Bild sich berührender Kreise.",
    },
  ],
  descartes: {
    caption: "Interaktiv · Descartes-Rechner",
    inputsLabel: "Drei Krümmungen",
    solutionsLabel: "Zwei Lösungen für k₄",
    invalidLabel:
      "Diese drei Krümmungen können sich nicht paarweise berühren — k₁k₂ + k₂k₃ + k₃k₁ muss ≥ 0 sein.",
    presetLabel: "Bekannte Tripel ausprobieren",
    plusLabel: "+ eingeschrieben (klein)",
    minusLabel: "− umschrieben (groß)",
    noteText:
      "Wähl drei Krümmungen — positiv für gewöhnliche Kreise, negativ für einen umschließenden. Die Formel liefert die zwei Kreise, die alle drei berühren. Probier (−1, 2, 2): die +-Lösung ist k₄ = 3, die −-Lösung ebenfalls k₄ = 3 — der Keim (−1, 2, 2, 3) ist symmetrisch.",
    pretitle: "Interaktiv · die Formel von Hand",
    title: "Tipp drei Krümmungen ein, sieh die vierte erscheinen",
    body: "Descartes' Formel ist eine Quadratische in k₄, also hat sie zwei Lösungen. Tipp irgendeine drei vorzeichenbehaftete Krümmungen ein, und der Rechner gibt beide zurück — die eingeschriebene und die umschriebene. Spiel mit den Voreinstellungen, um zu spüren, wie die Algebra auf den klassischen Ganzzahl-Keimen reagiert — und beobachte, wie oft die Antwort selbst ganzzahlig ausfällt.",
  },
  gasket: {
    caption: "Interaktiv · Packung wachsen lassen",
    seedLabel: "Keim-Packung",
    depthLabel: "Rekursionstiefe",
    countLabel: (n: number) => `${n} Kreise`,
    hint: "Jeder Schritt füllt jede gekrümmte Dreieckslücke mit ihrem eingeschriebenen Kreis. Die Farbe folgt dem Log der Krümmung: Rosa für den Außenring, dann Amber, Cyan, Violett bei immer feineren Details.",
    pretitle: "Interaktiv · das rekursive Bild",
    title: "Wähl einen Keim, dreh am Tiefen-Regler",
    body: "Wähl einen der vier klassischen Ganzzahl-Keime, und zieh dann den Rekursionsschieber rauf und runter. Bei Tiefe 1 siehst du nur den Keim, bei Tiefe 6 eine Koralle aus Tausenden Kreisen. Der Renderer ist derselbe wie im großen Explorer — nur die Tiefen-Obergrenze ist niedriger, damit die Story-Seite flüssig bleibt.",
  },
  integerTableLabel: "Ganzzahlige Keim-Packungen",
  integerTableNote:
    "Jede Krümmung in jeder dieser Packungen ist ganzzahlig — für immer, auf jeder Rekursionsebene.",
  integerTableSeedHead: "Keim (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "erste neue Krümmungen",
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich die Rekursion tiefer treiben, Krümmungs-Labels einblenden, Paletten wechseln und jede ganzzahlige Keim-Packung durchspielen. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  closingCta: "→ Explorer öffnen",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "Empaquetamiento de círculos de Apolonio",
    tagline: "Círculos dentro de círculos dentro de círculos.",
    intro:
      "Comienza con tres círculos mutuamente tangentes y una regla sobre qué cuenta como tangente. El Explorador rellena recursivamente cada hueco triangular curvo con un nuevo círculo, y luego rellena los huecos más pequeños — elige las curvaturas iniciales y observa cómo emerge una junta que es fractal para siempre.",
    ctaInteractive: "→ Abre el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Tres círculos. Rellena cada hueco. Para siempre.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Dibuja tres círculos que se tocan entre sí. Entre ellos queda un hueco triangular curvado. Mete el círculo más grande que quepa — toca a los tres. Ahora tienes tres huecos nuevos, más pequeños. Repite. La imagen que sale, el empaquetado, es un coral fractal nacido de una sola regla: cada hueco es la silla de un nuevo círculo.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Toma la semilla (−1, 2, 2, 3): un círculo exterior grande de radio 1, dos círculos interiores iguales de radio 1/2 lado a lado y un circulito de radio 1/3 entre ellos. Cada número es la curvatura k = 1/radio. El exterior es negativo porque encierra a los demás — ese signo menos es la única contabilidad que necesitas.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Apolonio preguntó hacia el 200 a. C. qué círculos tocan a tres dados; Descartes encerró la respuesta en álgebra en 1643. Pero qué curvaturas enteras aparecen en un empaquetado dado es un problema abierto en geometría aritmética. Una imagen de círculos que se besan oculta un trozo de teoría de números que aún no hemos acabado de escribir.",
      },
    ],
    tryIt: "Abajo: calcula tú mismo la cuarta curvatura, después mira crecer el empaquetado.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La posición inicial",
      title: "Tres círculos que se tocan",
      body: "Tres círculos en el plano, cada uno tangente a los otros dos — tres besos, tres puntos de contacto. Hacia el 200 a. C. Apolonio de Perga planteó la pregunta natural: qué círculos tocan a los tres a la vez. La respuesta son exactamente dos. Uno pequeño inscrito en el hueco curvado, y uno grande circunscrito al trío. Añade uno de ellos y tienes cuatro círculos mutuamente tangentes. Ese cuádruple es la semilla de todo lo que sigue.",
    },
    {
      pretitle: "Sección 02 · El teorema de Descartes",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Escribe la curvatura de cada círculo como k = 1/r, tomando negativa la del exterior. En su correspondencia de 1643 con la princesa Isabel de Bohemia, Descartes demostró que cuatro círculos mutuamente tangentes cumplen una sola identidad cuadrática. Despejando la cuarta queda k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Los dos signos son las dos respuestas de Apolonio: + mete el círculo pequeño inscrito, − da el otro círculo tangente al lado opuesto del trío.",
    },
    {
      pretitle: "Sección 03 · Relleno recursivo",
      title: "Cada hueco es una nueva semilla",
      body: "Una vez colocada la semilla, todo hueco triangular curvado está él mismo bordeado por tres círculos mutuamente tangentes — la misma configuración del principio. Aplica de nuevo la fórmula de Descartes con el +. El nuevo círculo parte su hueco en tres triángulos curvados más pequeños, y cada uno vuelve a ser semilla. El proceso es autosemejante: la regla que rellena el primer hueco rellena cada hueco para siempre.",
    },
    {
      pretitle: "Sección 04 · La sorpresa de los enteros",
      title: "Pon enteros — quedan enteros para siempre",
      body: "Toma las cuatro curvaturas iniciales enteras. Ocurre entonces un pequeño milagro algebraico: toda curvatura posterior del empaquetado es también entera. La razón: (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) es simétrica en las cuatro variables, así que cambiar la k₄ vieja por la nueva k₄' da k₄' = 2(k₁+k₂+k₃) − k₄ — sin raíz, solo aritmética entera. El empaquetado (−1, 2, 2, 3) genera 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Todo empaquetado apoloniano entero hace lo mismo. La imagen es, en el fondo, un objeto de teoría de números.",
    },
    {
      pretitle: "Sección 05 · Dimensión de Hausdorff ≈ 1,3056867",
      title: "Entre una curva y una región",
      body: "Sigue rellenando. La unión de todos los círculos cubre cada vez más el disco original, pero nunca todo. El polvo restante — los puntos que no caen en ningún círculo — tiene medida de Lebesgue cero, pero es denso en todas partes. Su dimensión de Hausdorff la calculó Boyd numéricamente y la acotó McMullen con rigor en torno a 1,3056867. El número es universal: no depende de la semilla. Toda empaquetadura apoloniana tiene el mismo peso fractal.",
    },
    {
      pretitle: "Sección 06 · Problemas abiertos y conexiones",
      title: "Bourgain–Fuchs, geometría hiperbólica, y lo que aún no sabemos",
      body: "Las curvaturas enteras de un empaquetado apoloniano forman un conjunto de números naturales — ¿pero cuáles aparecen? La conjetura local-global predecía: una curvatura aparece en un empaquetado fijo si y solo si aparece módulo 24 en él — salvo una lista finita de excepciones. Refutada en 2023 por Haag, Kertzer, Rickards y Stange (Annals of Mathematics): existen familias infinitas de curvaturas localmente permitidas que globalmente nunca aparecen. Bourgain y Fuchs ya habían demostrado en 2011 que las curvaturas enteras tienen densidad positiva: una fracción positiva fija de todos los enteros aparece de verdad. Detrás vive una historia más profunda — cada empaquetado apoloniano es la órbita de un grupo de reflexiones de Lorentz sobre una forma cuadrática de signatura (3,1), y reaparecen como fronteras de 3-variedades hiperbólicas. Geometría, teoría de números y teoría de grupos se citan en una imagen de círculos que se tocan.",
    },
  ],
  descartes: {
    caption: "Interactivo · calculadora de Descartes",
    inputsLabel: "Tres curvaturas",
    solutionsLabel: "Dos soluciones para k₄",
    invalidLabel:
      "Estas tres curvaturas no pueden ser mutuamente tangentes — k₁k₂ + k₂k₃ + k₃k₁ debe ser ≥ 0.",
    presetLabel: "Probar un triple conocido",
    plusLabel: "+ inscrito (pequeño)",
    minusLabel: "− circunscrito (grande)",
    noteText:
      "Elige tres curvaturas — positivas para círculos ordinarios, negativa para uno que envuelva. La fórmula devuelve los dos círculos tangentes a los tres. Prueba (−1, 2, 2): la solución + da k₄ = 3, la − también k₄ = 3 — la semilla (−1, 2, 2, 3) es simétrica.",
    pretitle: "Interactivo · la fórmula a mano",
    title: "Teclea tres curvaturas, mira aparecer la cuarta",
    body: "La fórmula de Descartes es cuadrática en k₄, así que tiene dos raíces. Teclea tres curvaturas con signo y la calculadora devuelve ambas — la inscrita y la circunscrita. Juega con las preconfiguraciones para sentir cómo se comporta el álgebra sobre las semillas enteras canónicas — y mira con qué frecuencia la respuesta es también entera.",
  },
  gasket: {
    caption: "Interactivo · haz crecer el empaquetado",
    seedLabel: "Semilla",
    depthLabel: "Profundidad de recursión",
    countLabel: (n: number) => `${n} círculos`,
    hint: "Cada paso rellena cada hueco triangular curvado con su círculo inscrito. El color sigue el logaritmo de la curvatura: rosa para el aro exterior, luego ámbar, cian, violeta para los detalles cada vez más finos.",
    pretitle: "Interactivo · la imagen recursiva",
    title: "Elige una semilla, gira la perilla de profundidad",
    body: "Elige una de las cuatro semillas enteras clásicas y luego desliza la profundidad arriba y abajo. A profundidad 1 ves solo la semilla; a 6, un coral de miles de círculos. El renderizador es el mismo del Explorador grande — solo el tope de profundidad es menor para que la página siga ligera.",
  },
  integerTableLabel: "Semillas enteras",
  integerTableNote:
    "Toda curvatura en cada uno de estos empaquetados es entera — para siempre, a toda profundidad.",
  integerTableSeedHead: "semilla (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "primeras nuevas curvaturas",
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja empujar la recursión más hondo, activar etiquetas de curvatura, cambiar paletas y probar cada semilla entera. Todo lo que acabas de leer está a un clic.",
  closingCta: "→ Abrir el Explorador",
};

const fr: RichStory = {
  page: {
    pretitle: "Thème · Géométrie",
    title: "Empilement de cercles d'Apollonius",
    tagline: "Des cercles dans des cercles dans des cercles.",
    intro:
      "Commence par trois cercles mutuellement tangents et une règle pour ce qui compte comme tangent. L'Explorateur remplit récursivement chaque vide triangulaire courbe avec un nouveau cercle, puis remplit les vides plus petits — choisis les courbures de départ et regarde émerger un tapis qui est fractal pour toujours.",
    ctaInteractive: "→ Ouvre l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Trois cercles. Comble chaque vide. Pour toujours.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Trace trois cercles qui se touchent. Entre eux reste un vide triangulaire courbe. Glisses-y le plus grand cercle qui rentre — il touche les trois. Tu as maintenant trois nouveaux vides plus petits. Recommence. L'image obtenue, le tamis, est un corail fractal né d'une seule règle : chaque vide est le siège d'un nouveau cercle.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Prends la graine (−1, 2, 2, 3) : un grand cercle extérieur de rayon 1, deux cercles intérieurs égaux de rayon 1/2 côte à côte, et un petit cercle de rayon 1/3 perché entre eux. Chaque nombre est la courbure k = 1/rayon. Celle du cercle extérieur est négative parce qu'il enferme les autres — ce signe moins est la seule comptabilité dont tu as besoin.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Apollonios a demandé vers 200 av. J.-C. quels cercles touchent trois cercles donnés ; Descartes a verrouillé la réponse dans l'algèbre en 1643. Mais quelles courbures entières apparaissent vraiment dans une garniture donnée reste un problème ouvert de géométrie arithmétique. Une image de cercles qui s'embrassent cache un morceau de théorie des nombres que l'on n'a pas fini d'écrire.",
      },
    ],
    tryIt: "Ci-dessous : calcule toi-même la quatrième courbure, puis regarde le tamis pousser.",
  },
  sections: [
    {
      pretitle: "Section 01 · La position de départ",
      title: "Trois cercles qui se touchent",
      body: "Trois cercles dans le plan, chacun tangent aux deux autres — trois baisers, trois points de contact. Vers 200 av. J.-C., Apollonios de Perge a posé la question naturelle : quels cercles sont tangents aux trois à la fois ? La réponse est exactement deux. Un petit inscrit dans le vide courbe, un grand circonscrit au triplet. Ajoute l'un d'eux et tu as quatre cercles mutuellement tangents. Ce quadruple est la graine de tout ce qui suit.",
    },
    {
      pretitle: "Section 02 · Le théorème de Descartes",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Écris chaque courbure k = 1/r, en prenant négative celle du cercle qui enferme. Dans sa correspondance de 1643 avec la princesse Élisabeth de Bohême, Descartes a démontré que quatre cercles mutuellement tangents vérifient une seule identité quadratique. Résolue pour la quatrième, elle donne k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Les deux signes sont les deux réponses d'Apollonios : + dépose le petit cercle inscrit dans le vide, − donne l'autre cercle tangent du côté opposé au triplet.",
    },
    {
      pretitle: "Section 03 · Remplissage récursif",
      title: "Chaque vide est une nouvelle graine",
      body: "Une fois la graine en place, tout vide triangulaire courbe est lui-même bordé par trois cercles mutuellement tangents — la configuration du départ. Applique encore la formule de Descartes avec le signe +. Le nouveau cercle scinde son vide en trois triangles courbes plus petits, chacun à nouveau une graine. Le procédé est autosemblable : la règle qui remplit le premier vide remplit chaque vide pour toujours.",
    },
    {
      pretitle: "Section 04 · La surprise des entiers",
      title: "Mets des entiers — il en reste pour toujours",
      body: "Prends les quatre courbures de départ entières. Un petit miracle algébrique se produit : toute courbure ultérieure du tamis reste entière. La raison : (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) est symétrique dans les quatre variables, donc remplacer l'ancien k₄ par le nouveau k₄' donne k₄' = 2(k₁+k₂+k₃) − k₄ — sans racine, juste de l'arithmétique entière. La garniture (−1, 2, 2, 3) engendre 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Tout empilement apollonien entier fait pareil. L'image est, au fond, un objet de théorie des nombres.",
    },
    {
      pretitle: "Section 05 · Dimension de Hausdorff ≈ 1,3056867",
      title: "Entre une courbe et une région",
      body: "Continue à remplir. La réunion de tous les cercles couvre de plus en plus du disque initial, mais jamais en entier. La poussière qui reste — les points qui n'appartiennent à aucun cercle — a mesure de Lebesgue nulle, mais est partout dense. Sa dimension de Hausdorff a été calculée numériquement par Boyd, puis encadrée rigoureusement par McMullen autour de 1,3056867. Le nombre est universel : il ne dépend pas de la graine. Tout tamis apollonien a le même poids fractal.",
    },
    {
      pretitle: "Section 06 · Problèmes ouverts et liens",
      title: "Bourgain–Fuchs, géométrie hyperbolique, et ce qui reste à comprendre",
      body: "Les courbures entières d'un empilement apollonien forment un ensemble d'entiers naturels — lesquels apparaissent ? La conjecture local-global prédisait : une courbure apparaît dans un empilement fixé si et seulement si elle apparaît modulo 24 dans cet empilement — à un nombre fini d'exceptions près. Réfutée en 2023 par Haag, Kertzer, Rickards et Stange (Annals of Mathematics) : il existe des familles infinies de courbures localement autorisées qui n'apparaissent jamais globalement. Bourgain et Fuchs avaient déjà prouvé en 2011 que les courbures entières ont densité positive : une fraction positive fixée des entiers y apparaît vraiment. Derrière vit une histoire plus profonde — chaque empilement apollonien est l'orbite d'un groupe de réflexions de Lorentz sur une forme quadratique de signature (3,1), et les mêmes empilements reviennent comme bords de 3-variétés hyperboliques. Géométrie, théorie des nombres et théorie des groupes se croisent dans une image de cercles qui se touchent.",
    },
  ],
  descartes: {
    caption: "Interactif · calculateur de Descartes",
    inputsLabel: "Trois courbures",
    solutionsLabel: "Deux solutions pour k₄",
    invalidLabel:
      "Ces trois courbures ne peuvent pas être mutuellement tangentes — k₁k₂ + k₂k₃ + k₃k₁ doit être ≥ 0.",
    presetLabel: "Essayer un triplet connu",
    plusLabel: "+ inscrit (petit)",
    minusLabel: "− circonscrit (grand)",
    noteText:
      "Choisis trois courbures — positives pour des cercles ordinaires, négative pour un cercle qui enferme. La formule renvoie les deux cercles tangents aux trois. Essaie (−1, 2, 2) : la solution + donne k₄ = 3, la − aussi k₄ = 3 — la graine (−1, 2, 2, 3) est symétrique.",
    pretitle: "Interactif · la formule à la main",
    title: "Tape trois courbures, vois apparaître la quatrième",
    body: "La formule de Descartes est une équation du second degré en k₄, donc deux racines. Tape trois courbures signées, et le calculateur renvoie les deux — l'inscrite et la circonscrite. Joue avec les préréglages pour sentir comment l'algèbre se comporte sur les graines entières classiques — et observe combien de fois la réponse est elle-même entière.",
  },
  gasket: {
    caption: "Interactif · faire pousser le tamis",
    seedLabel: "Graine",
    depthLabel: "Profondeur de récursion",
    countLabel: (n: number) => `${n} cercles`,
    hint: "Chaque pas remplit chaque vide triangulaire courbe avec son cercle inscrit. La couleur suit le log de la courbure : rose pour l'anneau extérieur, puis ambre, cyan, violet pour les détails de plus en plus fins.",
    pretitle: "Interactif · l'image récursive",
    title: "Choisis une graine, tourne la molette de profondeur",
    body: "Choisis l'une des quatre graines entières classiques, puis glisse la profondeur de récursion vers le haut et le bas. À profondeur 1 tu vois la graine ; à 6, un corail de milliers de cercles. Le moteur est le même que dans le grand Explorateur — seul le plafond de profondeur est plus bas pour que la page reste fluide.",
  },
  integerTableLabel: "Graines entières",
  integerTableNote:
    "Toute courbure de chacun de ces empilements est entière — pour toujours, à toute profondeur de récursion.",
  integerTableSeedHead: "graine (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "premières nouvelles courbures",
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse pousser la récursion plus loin, afficher les courbures, changer la palette et essayer chaque graine entière. Tout ce que tu viens de lire est à un clic.",
  closingCta: "→ Ouvrir l'Explorateur",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Impacchettamento di cerchi di Apollonio",
    tagline: "Cerchi dentro cerchi dentro cerchi.",
    intro:
      "Parti da tre cerchi mutuamente tangenti e una regola su cosa conta come tangente. L'Esploratore riempie ricorsivamente ogni vuoto triangolare curvo con un nuovo cerchio, e poi riempie i vuoti più piccoli — scegli le curvature iniziali e guarda emergere un impacchettamento che è frattale per sempre.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Tre cerchi. Riempi ogni vuoto. Per sempre.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Disegna tre cerchi che si toccano. Tra loro resta un vuoto triangolare curvo. Infilaci il cerchio più grande che ci entra — tocca tutti e tre. Ora hai tre nuovi vuoti più piccoli. Ripeti. L'immagine che ne esce, la packing, è un corallo frattale nato da una sola regola: ogni vuoto è il seggio di un nuovo cerchio.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Prendi il seme (−1, 2, 2, 3): un grande cerchio esterno di raggio 1, due cerchi interni uguali di raggio 1/2 fianco a fianco e un cerchietto di raggio 1/3 in mezzo. Ogni numero è la curvatura k = 1/raggio. Quella esterna è negativa perché racchiude le altre — quel segno meno è l'unica contabilità che ti serve.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Apollonio chiese intorno al 200 a.C. quali cerchi toccano tre dati; Descartes blindò la risposta in algebra nel 1643. Ma quali curvature intere compaiano davvero in un dato impacchettamento è un problema aperto della geometria aritmetica. Un'immagine di cerchi che si baciano nasconde un pezzo di teoria dei numeri che non abbiamo finito di scrivere.",
      },
    ],
    tryIt: "Sotto: calcola tu stesso la quarta curvatura, poi guarda la packing crescere.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La posizione di partenza",
      title: "Tre cerchi che si toccano",
      body: "Tre cerchi nel piano, ognuno tangente agli altri due — tre baci, tre punti di contatto. Verso il 200 a.C. Apollonio di Perga pose la domanda naturale: quali cerchi sono tangenti a tutti e tre? La risposta è esattamente due. Uno piccolo inscritto nel vuoto curvo, uno grande circoscritto al terzetto. Aggiungine uno e hai quattro cerchi mutuamente tangenti. Quel quadrupletto è il seme di tutto quello che segue.",
    },
    {
      pretitle: "Sezione 02 · Il teorema di Descartes",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Scrivi ogni curvatura come k = 1/r, prendendo negativa quella del cerchio che racchiude. Nella sua corrispondenza del 1643 con la principessa Elisabetta di Boemia, Descartes dimostrò che quattro cerchi mutuamente tangenti soddisfano una sola identità quadratica. Risolvendola per la quarta si ottiene k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). I due segni sono le due risposte di Apollonio: + lascia cadere il piccolo cerchio inscritto, − dà l'altro cerchio tangente sul lato opposto del terzetto.",
    },
    {
      pretitle: "Sezione 03 · Riempimento ricorsivo",
      title: "Ogni vuoto è un nuovo seme",
      body: "Una volta posato il seme, ogni vuoto triangolare curvo è esso stesso bordato da tre cerchi mutuamente tangenti — la stessa configurazione dell'inizio. Applica di nuovo la formula di Descartes col segno +. Il nuovo cerchio spezza il suo vuoto in tre triangoli curvi più piccoli, ciascuno di nuovo un seme. Il processo è autosimile: la stessa regola che riempie il primo vuoto riempie ogni vuoto per sempre.",
    },
    {
      pretitle: "Sezione 04 · La sorpresa degli interi",
      title: "Metti interi — restano interi per sempre",
      body: "Scegli le quattro curvature iniziali intere. Allora si verifica un piccolo miracolo algebrico: ogni curvatura successiva nella packing è anch'essa intera. Il motivo: (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) è simmetrica nelle quattro variabili, quindi sostituire la vecchia k₄ con la nuova k₄' dà k₄' = 2(k₁+k₂+k₃) − k₄ — niente radice, solo aritmetica intera. La packing (−1, 2, 2, 3) genera 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Ogni impacchettamento apolloniano intero fa lo stesso. L'immagine è, nel profondo, un oggetto di teoria dei numeri.",
    },
    {
      pretitle: "Sezione 05 · Dimensione di Hausdorff ≈ 1,3056867",
      title: "Tra una curva e una regione",
      body: "Continua a riempire. L'unione di tutti i cerchi disegnati copre sempre di più il disco originario, ma mai tutto. La polvere residua — i punti che non stanno in nessun cerchio — ha misura di Lebesgue zero, ma è ovunque densa. La sua dimensione di Hausdorff è stata calcolata numericamente da Boyd e rigorosamente limitata da McMullen attorno a 1,3056867. Il numero è universale: non dipende dal seme. Ogni packing apolloniana ha lo stesso peso frattale.",
    },
    {
      pretitle: "Sezione 06 · Problemi aperti e collegamenti",
      title: "Bourgain–Fuchs, geometria iperbolica, e ciò che resta ignoto",
      body: "Le curvature intere di una packing apolloniana formano un insieme di numeri naturali — quali compaiono? La congettura locale-globale prevedeva: una curvatura compare in una data packing se e solo se compare modulo 24 in essa — a meno di un elenco finito di eccezioni. Confutata nel 2023 da Haag, Kertzer, Rickards e Stange (Annals of Mathematics): esistono famiglie infinite di curvature localmente ammesse che globalmente non appaiono mai. Bourgain e Fuchs avevano già dimostrato nel 2011 che le curvature intere hanno densità positiva: una frazione positiva fissata di tutti gli interi compare davvero. Dietro vive una storia più profonda — ogni packing apolloniana è l'orbita di un gruppo di riflessioni di Lorentz su una forma quadratica di segnatura (3,1), e le stesse packing tornano come bordi di 3-varietà iperboliche. Geometria, teoria dei numeri e teoria dei gruppi si incontrano in un'immagine di cerchi che si toccano.",
    },
  ],
  descartes: {
    caption: "Interattivo · calcolatore di Descartes",
    inputsLabel: "Tre curvature",
    solutionsLabel: "Due soluzioni per k₄",
    invalidLabel:
      "Queste tre curvature non possono essere mutuamente tangenti — k₁k₂ + k₂k₃ + k₃k₁ deve essere ≥ 0.",
    presetLabel: "Prova una terna nota",
    plusLabel: "+ inscritto (piccolo)",
    minusLabel: "− circoscritto (grande)",
    noteText:
      "Scegli tre curvature — positive per cerchi ordinari, negativa per uno che racchiude. La formula restituisce i due cerchi tangenti a tutti e tre. Prova (−1, 2, 2): la soluzione + dà k₄ = 3, la − anch'essa k₄ = 3 — il seme (−1, 2, 2, 3) è simmetrico.",
    pretitle: "Interattivo · la formula a mano",
    title: "Digita tre curvature, vedi apparire la quarta",
    body: "La formula di Descartes è una quadratica in k₄, quindi ha due radici. Digita tre curvature con segno e il calcolatore restituisce entrambe — l'inscritta e la circoscritta. Gioca coi preset per sentire come si comporta l'algebra sui semi interi canonici — e nota quanto spesso la risposta è anch'essa intera.",
  },
  gasket: {
    caption: "Interattivo · fai crescere la packing",
    seedLabel: "Seme",
    depthLabel: "Profondità di ricorsione",
    countLabel: (n: number) => `${n} cerchi`,
    hint: "Ogni passo riempie ogni vuoto triangolare curvo con il suo cerchio inscritto. Il colore segue il log della curvatura: rosa per l'anello esterno, poi ambra, ciano, violetto per i dettagli sempre più fini.",
    pretitle: "Interattivo · l'immagine ricorsiva",
    title: "Scegli un seme, gira la manopola della profondità",
    body: "Scegli uno dei quattro semi interi classici, poi muovi su e giù il cursore della profondità. A profondità 1 vedi solo il seme; a 6 un corallo di migliaia di cerchi. Il renderer è lo stesso del grande Esploratore — solo il tetto di profondità è più basso perché la pagina resti reattiva.",
  },
  integerTableLabel: "Semi interi",
  integerTableNote:
    "Ogni curvatura in ciascuno di questi impacchettamenti è intera — per sempre, a ogni profondità di ricorsione.",
  integerTableSeedHead: "seme (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "prime nuove curvature",
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia spingere la ricorsione più in profondità, attivare le etichette di curvatura, cambiare tavolozza e provare ogni seme intero. Tutto ciò che hai appena letto è a un clic.",
  closingCta: "→ Apri l'Esploratore",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Empacotamento de círculos de Apolônio",
    tagline: "Círculos dentro de círculos dentro de círculos.",
    intro:
      "Começa com três círculos mutuamente tangentes e uma regra do que conta como tangente. O Explorador preenche recursivamente cada vão triangular curvo com um novo círculo, depois preenche os vãos menores — escolhe as curvaturas iniciais e observa surgir um empacotamento que é fractal para sempre.",
    ctaInteractive: "→ Abre o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Três círculos. Enche cada vazio. Para sempre.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Desenha três círculos que se tocam uns aos outros. Entre eles fica um vazio triangular curvo. Mete o maior círculo que caiba — toca os três. Agora tens três vazios novos, mais pequenos. Repete. A imagem que sai, o empacotamento, é um coral fractal nascido de uma só regra: cada vazio é assento de um novo círculo.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Pega na semente (−1, 2, 2, 3): um grande círculo exterior de raio 1, dois círculos interiores iguais de raio 1/2 lado a lado e um circulozinho de raio 1/3 entre eles. Cada número é a curvatura k = 1/raio. O exterior é negativo porque encerra os outros — esse sinal de menos é toda a escrituração de que precisas.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Apolónio perguntou por volta de 200 a.C. quais círculos tocam três dados; Descartes selou a resposta em álgebra em 1643. Mas que curvaturas inteiras aparecem realmente num dado empacotamento continua a ser um problema em aberto na geometria aritmética. Uma imagem de círculos que se beijam esconde um bocado de teoria dos números que ainda não acabámos de escrever.",
      },
    ],
    tryIt: "Abaixo: calcula tu mesmo a quarta curvatura, depois vê o empacotamento crescer.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A posição inicial",
      title: "Três círculos que se tocam",
      body: "Três círculos no plano, cada um tangente aos outros dois — três beijos, três pontos de contacto. Por volta de 200 a.C., Apolónio de Perga colocou a pergunta natural: quais círculos são tangentes aos três ao mesmo tempo? A resposta são exatamente dois. Um pequeno inscrito no vazio curvo, outro grande circunscrito ao trio. Junta um deles e tens quatro círculos mutuamente tangentes. Esse quádruplo é a semente de tudo o que segue.",
    },
    {
      pretitle: "Secção 02 · O teorema de Descartes",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Escreve cada curvatura k = 1/r, com a do círculo que encerra a tomar negativa. Na sua correspondência de 1643 com a princesa Isabel da Boémia, Descartes provou que quatro círculos mutuamente tangentes satisfazem uma única identidade quadrática. Resolvendo para a quarta dá k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Os dois sinais são as duas respostas de Apolónio: + atira o pequeno círculo inscrito para o vazio, − dá o outro círculo tangente do lado oposto do trio.",
    },
    {
      pretitle: "Secção 03 · Enchimento recursivo",
      title: "Cada vazio é uma nova semente",
      body: "Posta a semente, todo vazio triangular curvo é, ele mesmo, bordado por três círculos mutuamente tangentes — a configuração de partida. Aplica de novo a fórmula de Descartes com o sinal +. O novo círculo parte o vazio em três triângulos curvos mais pequenos, cada um de novo uma semente. O processo é autossemelhante: a regra que enche o primeiro vazio enche cada vazio para sempre.",
    },
    {
      pretitle: "Secção 04 · A surpresa dos inteiros",
      title: "Põe inteiros — ficam inteiros para sempre",
      body: "Toma as quatro curvaturas iniciais inteiras. Acontece então um pequeno milagre algébrico: cada curvatura seguinte do empacotamento é também inteira. A razão: (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) é simétrica nas quatro variáveis, portanto trocar a k₄ velha pela nova k₄' dá k₄' = 2(k₁+k₂+k₃) − k₄ — sem raiz, só aritmética inteira. O empacotamento (−1, 2, 2, 3) gera 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Todo empacotamento apoloniano inteiro faz o mesmo. A imagem é, no fundo, um objeto da teoria dos números.",
    },
    {
      pretitle: "Secção 05 · Dimensão de Hausdorff ≈ 1,3056867",
      title: "Entre uma curva e uma região",
      body: "Continua a encher. A união de todos os círculos cobre cada vez mais do disco original, mas nunca tudo. O pó restante — os pontos que não estão em nenhum círculo — tem medida de Lebesgue nula, mas é denso por toda a parte. A sua dimensão de Hausdorff foi calculada numericamente por Boyd e enquadrada rigorosamente por McMullen em torno de 1,3056867. O número é universal: não depende da semente. Todo empacotamento apoloniano tem o mesmo peso fractal.",
    },
    {
      pretitle: "Secção 06 · Problemas em aberto e ligações",
      title: "Bourgain–Fuchs, geometria hiperbólica, e o que falta",
      body: "As curvaturas inteiras de um empacotamento apoloniano formam um conjunto de naturais — mas quais aparecem? A conjetura local-global previa: uma curvatura aparece num empacotamento fixo se e só se aparece módulo 24 nele — a menos de uma lista finita de exceções. Refutada em 2023 por Haag, Kertzer, Rickards e Stange (Annals of Mathematics): há famílias infinitas de curvaturas localmente admitidas que globalmente nunca aparecem. Bourgain e Fuchs já tinham provado em 2011 que as curvaturas inteiras têm densidade positiva: uma fração positiva fixa de todos os inteiros aparece mesmo. Por trás vive uma história mais funda — cada empacotamento apoloniano é a órbita de um grupo de reflexões de Lorentz sobre uma forma quadrática de assinatura (3,1), e os mesmos empacotamentos reaparecem como bordos de 3-variedades hiperbólicas. Geometria, teoria dos números e teoria de grupos encontram-se numa imagem de círculos a tocar-se.",
    },
  ],
  descartes: {
    caption: "Interativo · calculadora de Descartes",
    inputsLabel: "Três curvaturas",
    solutionsLabel: "Duas soluções para k₄",
    invalidLabel:
      "Estas três curvaturas não podem ser mutuamente tangentes — k₁k₂ + k₂k₃ + k₃k₁ tem de ser ≥ 0.",
    presetLabel: "Experimentar um triplo conhecido",
    plusLabel: "+ inscrito (pequeno)",
    minusLabel: "− circunscrito (grande)",
    noteText:
      "Escolhe três curvaturas — positivas para círculos comuns, negativa para um que envolva. A fórmula devolve os dois círculos tangentes aos três. Experimenta (−1, 2, 2): a solução + dá k₄ = 3, a − também k₄ = 3 — a semente (−1, 2, 2, 3) é simétrica.",
    pretitle: "Interativo · a fórmula à mão",
    title: "Escreve três curvaturas, vê aparecer a quarta",
    body: "A fórmula de Descartes é quadrática em k₄, logo tem duas raízes. Escreve três curvaturas com sinal e a calculadora devolve ambas — a inscrita e a circunscrita. Brinca com as predefinições para sentir como a álgebra se comporta nas sementes inteiras canónicas — e repara como a resposta é, tantas vezes, também inteira.",
  },
  gasket: {
    caption: "Interativo · fazer crescer o empacotamento",
    seedLabel: "Semente",
    depthLabel: "Profundidade de recursão",
    countLabel: (n: number) => `${n} círculos`,
    hint: "Cada passo enche cada vazio triangular curvo com o seu círculo inscrito. A cor segue o log da curvatura: rosa para o anel exterior, depois âmbar, ciano, violeta para os detalhes cada vez mais finos.",
    pretitle: "Interativo · a imagem recursiva",
    title: "Escolhe uma semente, roda o botão da profundidade",
    body: "Escolhe uma das quatro sementes inteiras clássicas e depois desliza a profundidade para cima e para baixo. Na profundidade 1 vês só a semente; em 6, um coral de milhares de círculos. O motor é o mesmo do grande Explorador — só o tecto de profundidade é mais baixo para a página continuar fluida.",
  },
  integerTableLabel: "Sementes inteiras",
  integerTableNote:
    "Toda curvatura em cada um destes empacotamentos é inteira — para sempre, em qualquer profundidade.",
  integerTableSeedHead: "semente (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "primeiras novas curvaturas",
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te empurrar a recursão mais fundo, ligar etiquetas de curvatura, mudar paletas e experimentar cada semente inteira. Tudo o que acabaste de ler está a um clique.",
  closingCta: "→ Abrir o Explorador",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "Apolloniansk cirkelpackning",
    tagline: "Cirklar inuti cirklar inuti cirklar.",
    intro:
      "Börja med tre cirklar som tangerar varandra och en regel för vad som räknas som tangent. Utforskaren fyller rekursivt varje krökt triangelformat tomrum med en ny cirkel, och fyller sedan de mindre tomrummen — välj startkurvaturerna och se hur en packning växer fram som är fraktal för alltid.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Tre cirklar. Fyll varje tomrum. För alltid.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Rita tre cirklar som rör vid varandra. Mellan dem ligger ett krökt triangulärt tomrum. Lägg in den största cirkel som får plats — den rör vid alla tre. Nu har du tre nya, mindre tomrum. Upprepa. Bilden som växer fram, packningen, är en fraktal korall född ur en enda regel: varje tomrum är sätet för en ny cirkel.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Ta fröet (−1, 2, 2, 3): en stor yttre cirkel med radie 1, två lika stora inre cirklar med radie 1/2 sida vid sida, och en liten cirkel med radie 1/3 mellan dem. Varje tal är krökningen k = 1/radie. Den yttre är negativ för den innesluter de andra — det minustecknet är all bokföring du behöver.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Apollonios frågade omkring 200 f.Kr. vilka cirklar som rör vid tre givna; Descartes låste fast svaret i algebra 1643. Men vilka heltalskrökningar som faktiskt dyker upp i en given packning är fortfarande ett öppet problem i aritmetisk geometri. En bild av cirklar som kysser varandra döljer ett stycke talteori vi inte är klara med att skriva.",
      },
    ],
    tryIt: "Nedan: räkna ut den fjärde krökningen själv, se sedan packningen växa.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Utgångsläget",
      title: "Tre cirklar som rör vid varandra",
      body: "Tre cirklar i planet, var och en tangerande de andra två — tre kyssar, tre kontaktpunkter. Omkring 200 f.Kr. ställde Apollonios från Perga den naturliga följdfrågan: vilka cirklar tangerar alla tre? Svaret är exakt två. En liten inskriven i det krökta tomrummet, en stor omskriven kring trippeln. Lägg till en av dem och du har fyra ömsesidigt tangerande cirklar. Den kvadrupeln är fröet för allt som följer.",
    },
    {
      pretitle: "Avsnitt 02 · Descartes sats",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Skriv varje krökning som k = 1/r, med den omslutande cirkelns krökning negativ. I sin korrespondens 1643 med prinsessan Elisabeth av Böhmen visade Descartes att fyra ömsesidigt tangerande cirklar uppfyller en enda kvadratisk identitet. Löst för den fjärde ger den k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). De två tecknen är Apollonios två svar: + lägger den lilla inskrivna i tomrummet, − ger den andra tangerande cirkeln på trippelns motsatta sida.",
    },
    {
      pretitle: "Avsnitt 03 · Rekursiv fyllning",
      title: "Varje tomrum är ett nytt frö",
      body: "Så snart frö-kvadrupeln ligger på plats är varje krökt triangulärt tomrum självt begränsat av tre ömsesidigt tangerande cirklar — exakt konfigurationen vi började med. Tillämpa Descartes formel igen med +. Den nya cirkeln delar sitt tomrum i tre mindre krökta trianglar, vart och ett ett nytt frö. Processen är självlik: regeln som fyller det första tomrummet fyller varje tomrum för evigt.",
    },
    {
      pretitle: "Avsnitt 04 · Heltalsöverraskningen",
      title: "Lägg in heltal — det förblir heltal för alltid",
      body: "Välj de fyra frö-krökningarna till heltal. Då händer ett litet algebraiskt under: varje följande krökning i packningen är också heltal. Skälet: (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) är symmetrisk i de fyra variablerna, så att byta gamla k₄ mot nya k₄' ger k₄' = 2(k₁+k₂+k₃) − k₄ — ingen rot, bara heltalsaritmetik. Packningen (−1, 2, 2, 3) genererar 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Varje heltalsapolloniansk packning gör samma sak. Bilden är, i grunden, ett talteoretiskt objekt.",
    },
    {
      pretitle: "Avsnitt 05 · Hausdorffdimension ≈ 1,3056867",
      title: "Mellan en kurva och en yta",
      body: "Fortsätt fylla. Unionen av alla cirklar du någonsin ritat täcker mer och mer av den ursprungliga disken, men aldrig allt. Det resterande dammet — punkterna som inte tillhör någon cirkel — har Lebesguemått noll men är överallt tätt. Dess Hausdorffdimension beräknades numeriskt av Boyd och inramades rigoröst av McMullen kring 1,3056867. Talet är universellt: det beror inte på vilket frö du börjar med. Varje apolloniansk packning har samma fraktala vikt.",
    },
    {
      pretitle: "Avsnitt 06 · Öppna problem och kopplingar",
      title: "Bourgain–Fuchs, hyperbolisk geometri och det som återstår",
      body: "Heltalskrökningarna i en apolloniansk packning bildar en mängd naturliga tal — men vilka dyker upp? Den lokal-globala förmodan förutsade: en krökning dyker upp i en given packning om och endast om den dyker upp modulo 24 i den — på en ändlig lista undantag när. Motbevisad 2023 av Haag, Kertzer, Rickards och Stange (Annals of Mathematics): det finns oändliga familjer av krökningar som är lokalt tillåtna men aldrig globalt dyker upp. Bourgain och Fuchs hade redan 2011 visat att heltalskrökningarna har positiv täthet: en fix positiv andel av alla heltal dyker faktiskt upp. Bakom lever en djupare historia — varje apolloniansk packning är banan för en grupp av Lorentzspeglingar på en kvadratisk form av signatur (3,1), och samma packningar dyker upp igen som ränder till hyperboliska 3-mångfalder. Geometri, talteori och gruppteori möts i en bild av cirklar som rör vid varandra.",
    },
  ],
  descartes: {
    caption: "Interaktivt · Descartes-räknare",
    inputsLabel: "Tre krökningar",
    solutionsLabel: "Två lösningar för k₄",
    invalidLabel:
      "Dessa tre krökningar kan inte vara ömsesidigt tangerande — k₁k₂ + k₂k₃ + k₃k₁ måste vara ≥ 0.",
    presetLabel: "Prova en känd trippel",
    plusLabel: "+ inskriven (liten)",
    minusLabel: "− omskriven (stor)",
    noteText:
      "Välj tre krökningar — positiva för vanliga cirklar, negativ för en som omsluter. Formeln ger de två cirklarna som tangerar alla tre. Prova (−1, 2, 2): +-lösningen ger k₄ = 3, även −-lösningen k₄ = 3 — fröet (−1, 2, 2, 3) är symmetriskt.",
    pretitle: "Interaktivt · formeln för hand",
    title: "Skriv tre krökningar, se den fjärde dyka upp",
    body: "Descartes formel är en andragradare i k₄, så den har två rötter. Skriv tre krökningar med tecken och räknaren ger båda — den inskrivna och den omskrivna. Lek med förinställningarna för att känna hur algebran beter sig på de klassiska heltalsfröna — och lägg märke till hur ofta svaret också blir ett heltal.",
  },
  gasket: {
    caption: "Interaktivt · låt packningen växa",
    seedLabel: "Frö",
    depthLabel: "Rekursionsdjup",
    countLabel: (n: number) => `${n} cirklar`,
    hint: "Varje steg fyller varje krökt triangeltomrum med sin inskrivna cirkel. Färgen följer logaritmen av krökningen: rosa för yttre ringen, sedan bärnsten, cyan, violett för allt finare detaljer.",
    pretitle: "Interaktivt · den rekursiva bilden",
    title: "Välj ett frö, vrid på djupreglaget",
    body: "Välj ett av de fyra klassiska heltalsfröna och dra sedan djupreglaget upp och ner. Vid djup 1 ser du bara fröet; vid 6 en korall av tusentals cirklar. Renderaren är samma som i stora Utforskaren — bara djupgränsen är lägre för att sidan ska förbli följsam.",
  },
  integerTableLabel: "Heltalsfrö",
  integerTableNote:
    "Varje krökning i var och en av dessa packningar är ett heltal — för alltid, på varje rekursionsnivå.",
  integerTableSeedHead: "frö (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "första nya krökningarna",
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig pressa rekursionen djupare, slå på krökningsetiketter, byta paletter och prova varje heltalsfrö. Allt du just läst är ett klick bort.",
  closingCta: "→ Öppna Utforskaren",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "Apollonisk sirkelpakking",
    tagline: "Sirkler i sirkler i sirkler.",
    intro:
      "Start med tre sirkler som tangerer hverandre og en regel for hva som regnes som tangent. Utforskeren fyller rekursivt hvert krumt trekantet tomrom med en ny sirkel, og fyller deretter de mindre tomrommene — velg startkurvaturene og se en pakking vokse frem som er fraktal for alltid.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Tre sirkler. Fyll hvert tomrom. For alltid.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Tegn tre sirkler som tar på hverandre. Mellom dem ligger et krummet trekantet tomrom. Slipp inn den største sirkelen som får plass — den tar på alle tre. Nå har du tre nye, mindre tomrom. Gjenta. Bildet som vokser fram, pakningen, er en fraktal korall født av én eneste regel: hvert tomrom er sete for en ny sirkel.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Ta frøet (−1, 2, 2, 3): én stor ytre sirkel med radius 1, to like store indre sirkler med radius 1/2 side om side, og én liten sirkel med radius 1/3 mellom dem. Hvert tall er krumningen k = 1/radius. Den ytre er negativ fordi den omslutter de andre — det minustegnet er all bokføring du trenger.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Apollonios spurte rundt 200 f.Kr. hvilke sirkler som tar på tre gitte; Descartes låste svaret i algebra i 1643. Men hvilke heltalskrumninger som faktisk dukker opp i en gitt pakning er fremdeles et åpent problem i aritmetisk geometri. Et bilde av sirkler som kysser hverandre skjuler et stykke tallteori vi ennå ikke har skrevet ferdig.",
      },
    ],
    tryIt: "Under: regn ut den fjerde krumningen selv, se så pakningen vokse.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Utgangsstillingen",
      title: "Tre sirkler som tar på hverandre",
      body: "Tre sirkler i planet, hver tangentiell til de andre to — tre kyss, tre kontaktpunkter. Rundt 200 f.Kr. stilte Apollonios fra Perga det naturlige oppfølgingsspørsmålet: hvilke sirkler tar på alle tre? Svaret er nøyaktig to. Én liten innskrevet i det krummede tomrommet, og én stor omskrevet rundt trippelen. Legg til en av dem og du har fire gjensidig tangente sirkler. Den firetuppelen er frøet for alt som følger.",
    },
    {
      pretitle: "Avsnitt 02 · Descartes' teorem",
      title: "(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)",
      body: "Skriv hver krumning som k = 1/r, med den omsluttende sirkelens krumning negativ. I sin korrespondanse i 1643 med prinsesse Elisabeth av Böhmen viste Descartes at fire gjensidig tangente sirkler oppfyller én enkelt kvadratisk identitet. Løst for den fjerde gir den k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). De to tegnene er Apollonios' to svar: + slipper den lille innskrevne i tomrommet, − gir den andre tangente sirkelen på motsatt side av trippelen.",
    },
    {
      pretitle: "Avsnitt 03 · Rekursiv fylling",
      title: "Hvert tomrom er et nytt frø",
      body: "Så snart frø-kvadrupelen ligger der, er hvert krummede trekantede tomrom selv begrenset av tre gjensidig tangente sirkler — akkurat samme konfigurasjon vi startet med. Bruk Descartes' formel igjen med +. Den nye sirkelen deler tomrommet i tre mindre krummede trekanter, hver av dem igjen et frø. Prosessen er selvlik: regelen som fyller det første tomrommet fyller hvert tomrom for evig.",
    },
    {
      pretitle: "Avsnitt 04 · Heltallsoverraskelsen",
      title: "Legg inn heltall — det blir heltall for alltid",
      body: "Velg de fire frø-krumningene som heltall. Da skjer et lite algebraisk mirakel: hver påfølgende krumning i pakningen er også heltall. Grunnen: (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²) er symmetrisk i de fire variablene, så å bytte den gamle k₄ med den nye k₄' gir k₄' = 2(k₁+k₂+k₃) − k₄ — ingen rot, bare heltallsaritmetikk. Pakningen (−1, 2, 2, 3) genererer 6, 11, 14, 15, 18, 23, 26, 27, 30, 35, … Hver heltalls-apollonsk pakning gjør det samme. Bildet er, i bunn og grunn, et tallteoretisk objekt.",
    },
    {
      pretitle: "Avsnitt 05 · Hausdorff-dimensjon ≈ 1,3056867",
      title: "Mellom en kurve og en flate",
      body: "Fortsett å fylle. Unionen av alle sirklene du noen gang tegner dekker mer og mer av den opprinnelige skiven, men aldri alt. Reststøvet — punktene som ikke tilhører noen sirkel — har Lebesgue-mål null, men er overalt tett. Hausdorff-dimensjonen ble regnet ut numerisk av Boyd og strengt innrammet av McMullen til rundt 1,3056867. Tallet er universelt: det avhenger ikke av hvilket frø du starter med. Hver apollonsk pakning har samme fraktale vekt.",
    },
    {
      pretitle: "Avsnitt 06 · Åpne problemer og forbindelser",
      title: "Bourgain–Fuchs, hyperbolsk geometri og det som gjenstår",
      body: "Heltallskrumningene i en apollonsk pakning danner en mengde naturlige tall — men hvilke dukker opp? Den lokal-globale formodningen forutsa: en krumning dukker opp i en gitt pakning hvis og bare hvis den dukker opp modulo 24 i den — på en endelig liste unntak nær. Motbevist i 2023 av Haag, Kertzer, Rickards og Stange (Annals of Mathematics): det finnes uendelige familier av krumninger som er lokalt tillatte, men globalt aldri dukker opp. Bourgain og Fuchs hadde allerede i 2011 vist at heltallskrumningene har positiv tetthet: en fast positiv andel av alle heltall dukker virkelig opp. Bak lever en dypere historie — hver apollonsk pakning er banen til en gruppe av Lorentz-refleksjoner på en kvadratisk form av signatur (3,1), og de samme pakningene dukker opp igjen som rander til hyperbolske 3-mangfoldigheter. Geometri, tallteori og gruppeteori møtes i et bilde av sirkler som tar på hverandre.",
    },
  ],
  descartes: {
    caption: "Interaktivt · Descartes-kalkulator",
    inputsLabel: "Tre krumninger",
    solutionsLabel: "To løsninger for k₄",
    invalidLabel:
      "Disse tre krumningene kan ikke være gjensidig tangente — k₁k₂ + k₂k₃ + k₃k₁ må være ≥ 0.",
    presetLabel: "Prøv en kjent trippel",
    plusLabel: "+ innskrevet (liten)",
    minusLabel: "− omskrevet (stor)",
    noteText:
      "Velg tre krumninger — positive for vanlige sirkler, negativ for en som omslutter. Formelen gir de to sirklene som tangerer alle tre. Prøv (−1, 2, 2): +-løsningen gir k₄ = 3, også −-løsningen gir k₄ = 3 — frøet (−1, 2, 2, 3) er symmetrisk.",
    pretitle: "Interaktivt · formelen for hånd",
    title: "Skriv tre krumninger, se den fjerde dukke opp",
    body: "Descartes' formel er en annengradsligning i k₄, så den har to røtter. Skriv tre krumninger med fortegn og kalkulatoren gir begge — den innskrevne og den omskrevne. Lek med forhåndsinnstillingene for å kjenne hvordan algebraen oppfører seg på de klassiske heltallsfrøene — og legg merke til hvor ofte svaret også blir et heltall.",
  },
  gasket: {
    caption: "Interaktivt · la pakningen vokse",
    seedLabel: "Frø",
    depthLabel: "Rekursjonsdybde",
    countLabel: (n: number) => `${n} sirkler`,
    hint: "Hvert trinn fyller hvert krummede trekant-tomrom med sin innskrevne sirkel. Fargen følger logaritmen til krumningen: rosa for ytterringen, så rav, cyan, fiolett for stadig finere detaljer.",
    pretitle: "Interaktivt · det rekursive bildet",
    title: "Velg et frø, vri på dybde-rattet",
    body: "Velg ett av de fire klassiske heltallsfrøene, og dra så rekursjonsdybden opp og ned. Ved dybde 1 ser du bare frøet; ved 6 en korall av tusenvis av sirkler. Rendereren er den samme som i den store Utforskeren — bare dybdegrensen er lavere så historiesiden holder seg responsiv.",
  },
  integerTableLabel: "Heltallsfrø",
  integerTableNote:
    "Hver krumning i hver av disse pakningene er et heltall — for alltid, på alle rekursjonsnivåer.",
  integerTableSeedHead: "frø (k₁, k₂, k₃, k₄)",
  integerTableRestHead: "første nye krumninger",
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg presse rekursjonen dypere, slå på krumningsetiketter, bytte paletter og prøve hvert heltallsfrø. Alt du nettopp leste er ett klikk unna.",
  closingCta: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

// Seed packing (−1, 2, 2, 3) — the simplest integer Apollonian gasket. We
// keep this small SVG illustration in the page module because it is the
// page's signature image and nothing else needs it.
function SeedSVG({ withLabels = true }: { withLabels?: boolean }) {
  const S = 110;
  const cx = 130;
  const cy = 130;
  const map = (x: number, y: number) => [cx + x * S, cy - y * S] as const;
  const circles: Array<{ x: number; y: number; r: number; k: number; color: string }> = [
    { x: 0, y: 0, r: 1, k: -1, color: "rgba(255,122,182,0.85)" },
    { x: -0.5, y: 0, r: 0.5, k: 2, color: "rgba(125,243,255,0.85)" },
    { x: 0.5, y: 0, r: 0.5, k: 2, color: "rgba(125,243,255,0.85)" },
    { x: 0, y: 2 / 3, r: 1 / 3, k: 3, color: "rgba(255,209,102,0.95)" },
    { x: 0, y: -2 / 3, r: 1 / 3, k: 3, color: "rgba(255,209,102,0.6)" },
  ];
  return (
    <svg
      viewBox="0 0 260 260"
      className="mx-auto h-auto w-full max-w-[260px]"
      role="img"
      aria-label="Integer Apollonian packing seed (−1, 2, 2, 3)"
    >
      <rect width="260" height="260" fill="#06070d" rx="14" />
      {circles.map((c, i) => {
        const [px, py] = map(c.x, c.y);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={c.r * S}
            fill="none"
            stroke={c.color}
            strokeWidth={1.6}
          />
        );
      })}
      {withLabels &&
        circles.slice(0, 4).map((c, i) => {
          const [px, py] = map(c.x, c.y);
          return (
            <text
              key={`l-${i}`}
              x={px}
              y={py + 4}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize={11}
              fill="#e8eaf2"
            >
              k = {c.k}
            </text>
          );
        })}
    </svg>
  );
}

function EncounterCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-rose/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

export default function ApollonianStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/apollonian/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)"
      formulaLatex={"(k_1 + k_2 + k_3 + k_4)^2 = 2(k_1^2 + k_2^2 + k_3^2 + k_4^2)"}
      finalLabel={story.closingTitle}
    >
      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              <EncounterCard label={card.label} title={card.title}>
                {i === 1 ? (
                  <>
                    <p>{card.body}</p>
                    <div className="mt-4">
                      <SeedSVG withLabels />
                    </div>
                    <div className="hairline mt-3 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                      <div>k = 1/r · the curvature</div>
                      <div>k &lt; 0 · circle encloses the others</div>
                    </div>
                  </>
                ) : (
                  <p>{card.body}</p>
                )}
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — three circles touching */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — Descartes' theorem */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Descartes, 1643
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              k₄ = k₁ + k₂ + k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁)
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Two solutions: the + sign drops the small inscribed circle into the gap; the − sign
              gives the other tangent circle on the opposite side of the triple.
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 · Descartes calculator */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.descartes.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.descartes.title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.descartes.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ApollonianDescartes
            caption={story.descartes.caption}
            inputsLabel={story.descartes.inputsLabel}
            solutionsLabel={story.descartes.solutionsLabel}
            invalidLabel={story.descartes.invalidLabel}
            presetLabel={story.descartes.presetLabel}
            plusLabel={story.descartes.plusLabel}
            minusLabel={story.descartes.minusLabel}
            noteText={story.descartes.noteText}
          />
        </Reveal>
      </section>

      {/* Section 03 — Recursive filling */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · Recursive gasket */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.gasket.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.gasket.title}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.gasket.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ApollonianGasket
            caption={story.gasket.caption}
            seedLabel={story.gasket.seedLabel}
            depthLabel={story.gasket.depthLabel}
            countLabel={story.gasket.countLabel}
            hint={story.gasket.hint}
          />
        </Reveal>
      </section>

      {/* Section 04 — the integer surprise + table */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.integerTableLabel}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.integerTableSeedHead}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.integerTableRestHead}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["(−1, 2, 2, 3)", "3, 6, 6, 11, 14, 15, 18, 23, …"],
                  ["(−2, 3, 6, 7)", "7, 10, 15, 19, 22, 27, 34, 35, …"],
                  ["(−3, 5, 8, 8)", "8, 12, 17, 20, 24, 32, 33, …"],
                  ["(−4, 8, 9, 9)", "9, 12, 17, 24, 25, 28, 33, …"],
                  ["(−6, 11, 14, 15)", "15, 18, 23, 26, 30, 35, 38, …"],
                ].map(([seed, rest]) => (
                  <tr key={seed} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-rose">{seed}</td>
                    <td className="px-2 py-2 text-ink-200">{rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pt-2 text-xs leading-relaxed text-ink-400">{story.integerTableNote}</p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — Hausdorff dimension */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Hausdorff dimension
            </div>
            <div className="math-italic text-6xl text-ink-100 md:text-7xl">≈ 1.3056867</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Strictly between a curve (dimension 1) and a region (dimension 2). The Apollonian
              residual set has measure zero but is fractally dense at every scale.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — Open problems and connections */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA — unified pattern */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/apollonian/explorer"
            className="inline-block rounded-full border border-signal-rose/70 bg-signal-rose/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/25"
          >
            {story.closingCta}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
