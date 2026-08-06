"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { SternBrocotTree } from "@/components/SternBrocotTree";
import { SternBrocotWalk } from "@/components/SternBrocotWalk";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-teal";

// --------------------------------------------------------------------------
// Rich, per-locale story content. The hero (pretitle/title/tagline/intro)
// is authored here too so the long story can live entirely in this module
// without bloating the shared i18n bundles. Section bodies are kept tight —
// 2-3 sentences — and the long-form thinking happens in the interactives.
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
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  treeCaption: string;
  treeDepthLabel: string;
  treeTargetLabel: string;
  treePathLabel: string;
  walkCaption: string;
  walkInputLabel: string;
  walkPresetsLabel: string;
  walkPathLabel: string;
  walkConvergentsLabel: string;
  walkStepHead: string;
  walkFractionHead: string;
  walkDecimalHead: string;
  walkErrorHead: string;
  // Interstitial callouts between the story sections.
  mediantBoxCaption: string;
  mediantBoxNote: string;
  treeInterCaption: string;
  treeInterTitle: string;
  piPathCaption: string;
  walkInterCaption: string;
  walkInterTitle: string;
  hurwitzNote: string;
};

const PHI = (1 + Math.sqrt(5)) / 2;

const en: RichStory = {
  page: {
    pretitle: "Topic · Number theory",
    title: "The Stern–Brocot Tree",
    tagline: "Every fraction, exactly once — built by adding badly.",
    intro:
      "Start with 0/1 and 1/0 — the two impossibilities. Slide a new fraction between them by adding numerators and denominators separately, the way a child would. Repeat forever. The infinite tree you build contains every positive fraction once, already in lowest terms — and the left-right path to each is its continued-fraction expansion.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Add fractions wrong. Discover every fraction.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Between any two fractions a/b and c/d, drop in the mediant (a+c)/(b+d). It is the wrong way to add, but it slides a new fraction strictly between the two — and every positive fraction, exactly once, lives somewhere in the tree this builds.",
      },
      {
        label: "02",
        title: "A concrete walk",
        body: "Begin with 0/1 and 1/0. Their mediant is 1/1. Slide it in. Now between 0/1 and 1/1 sits 1/2; between 1/1 and 1/0 sits 2/1. Keep going. Level by level, every reduced fraction appears, and the value of φ, π, √2 are roads through the same tree.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The tree hides the best rational approximations of every real number — and Brocot built it in 1861 to pick gears for clocks. Number theory, typography, and the digital second-hand all meet on the same diagram.",
      },
    ],
    tryIt: "Below: turn the depth knob, then walk the tree toward π or φ.",
  },
  sections: [
    {
      pretitle: "Section 01 · The mediant",
      title: "(a + c) / (b + d) — the wrong way that works",
      body: "The mediant of a/b and c/d is what happens if you add numerators and denominators separately — exactly the schoolchild mistake. The result is not a/b + c/d, but it is always a fraction strictly between them, and always already in lowest terms when the parents are. From this single bad addition, an infinite ordered structure falls out.",
    },
    {
      pretitle: "Section 02 · Every fraction, once",
      title: "Nothing missed, nothing repeated",
      body: "Stern discovered the tree in 1858 as a piece of pure number theory; Brocot rediscovered it in 1861 while picking gear ratios for clocks. Their shared theorem: walk far enough and you meet every reduced fraction p/q with p, q > 0 — each one sitting at its own unique node, no fraction missing, none ever repeated. The tree is simultaneously a complete listing of the positive rationals and a witness that they are merely countable.",
    },
    {
      pretitle: "Section 03 · Left-right is the continued fraction",
      title: "L, R, L, R, … encode the expansion",
      body: "Pick any positive number. Walk down from 1/1, going L when you are above your target and R when below. Group the moves into runs and you have written down the continued-fraction expansion of your target — the canonical address of a real number in arithmetic.",
    },
    {
      pretitle: "Section 04 · Best rational approximations",
      title: "Stop at a run's end: you're on a convergent",
      body: "Stop at the end of an L/R run, just before the direction flips, and the fraction you stand on is a convergent: a best rational approximation of the target, with no smaller denominator getting closer. Stop in the middle of a run and you land on a semiconvergent instead, close but not guaranteed to beat every smaller denominator. Hurwitz' theorem (1891) says every irrational has infinitely many convergents p/q with |x − p/q| < 1/(√5 q²), and the constant √5 is sharp, attained by φ.",
    },
    {
      pretitle: "Section 05 · The Farey cousin",
      title: "Filter the tree by denominator: you get the Farey sequence",
      body: "Gather every fraction anywhere in the tree with denominator at most n that lies in [0, 1], then add the endpoint 0/1. Read left to right, that list is the Farey sequence Fₙ, the sorted reduced fractions in [0, 1] with bounded denominator. A single level never suffices, since a fraction with denominator q already appears by depth q: 1/2 sits at depth 1, so you must sweep the whole subtree down to depth n. The two structures are different views of the same arithmetic skeleton.",
    },
    {
      pretitle: "Section 06 · Modern uses",
      title: "Font hinting, digital clocks, number theory",
      body: "Brocot wanted accurate gear trains; today the same tree picks rational approximations for font-hinting on pixel grids, drives the rational-approximation step in digital phase-locked loops, and underlies modern proofs in Diophantine approximation. Wherever you need «the simplest fraction that gets close enough», this is the data structure.",
    },
  ],
  closingPretitle: "Take it further",
  closingTitle: "Walk the tree.",
  closingBody:
    "The Explorer lets you type any real number — π, φ, e, √2, or your own — and watch the L/R path unfold, with the convergents listed step by step. Best rational approximations, on tap.",
  ctaLabel: "→ Open the Explorer",
  treeCaption: "Interactive · the first levels",
  treeDepthLabel: "Depth",
  treeTargetLabel: "Highlight path to",
  treePathLabel: "L/R path",
  walkCaption: "Interactive · walk to a real number",
  walkInputLabel: "Target value",
  walkPresetsLabel: "Famous numbers",
  walkPathLabel: "Path · L = smaller · R = larger",
  walkConvergentsLabel: "Best rational approximations — the convergents",
  walkStepHead: "step",
  walkFractionHead: "fraction",
  walkDecimalHead: "decimal",
  walkErrorHead: "error",
  mediantBoxCaption: "The mediant in one line",
  mediantBoxNote: "Three mediants in, and the seeds of every rational are already on the page.",
  treeInterCaption: "Interactive · the tree",
  treeInterTitle: "First levels, every fraction exactly once",
  piPathCaption: "π's path",
  walkInterCaption: "Interactive · walk a real number",
  walkInterTitle: "Type a number, watch the convergents appear",
  hurwitzNote:
    "For every irrational x, infinitely many fractions p/q satisfy this, and √5 is best possible, attained by the golden ratio.",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Zahlentheorie",
    title: "Der Stern-Brocot-Baum",
    tagline: "Jeder Bruch, genau einmal — aus falsch addieren gebaut.",
    intro:
      "Starte mit 0/1 und 1/0 — den beiden Unmöglichkeiten. Schiebe einen neuen Bruch dazwischen, indem du Zähler und Nenner getrennt addierst, wie ein Kind es täte. Weiter, unendlich. Der so entstehende Baum enthält jeden positiven Bruch genau einmal, bereits vollständig gekürzt — und der Links-Rechts-Pfad zu jedem ist seine Kettenbruchentwicklung.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Brüche falsch addieren. Jeden Bruch entdecken.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Zwischen zwei Brüche a/b und c/d schiebst du den Medianten (a+c)/(b+d). Es ist die falsche Art zu addieren, doch sie liefert einen Bruch strikt zwischen den beiden — und jeder positive Bruch lebt genau einmal in dem Baum, der so entsteht.",
      },
      {
        label: "02",
        title: "Ein konkreter Gang",
        body: "Beginn mit 0/1 und 1/0. Ihr Mediant ist 1/1. Schieb ihn dazwischen. Zwischen 0/1 und 1/1 steht jetzt 1/2; zwischen 1/1 und 1/0 steht 2/1. Mach weiter. Ebene für Ebene erscheint jeder gekürzte Bruch — und die Werte von φ, π, √2 sind Wege durch denselben Baum.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Der Baum versteckt die besten rationalen Näherungen jeder reellen Zahl — und Brocot baute ihn 1861, um Zahnräder für Uhren zu wählen. Zahlentheorie, Typografie und der digitale Sekundenzeiger treffen sich im selben Diagramm.",
      },
    ],
    tryIt: "Unten: dreh am Tiefen-Regler, dann laufe den Baum zu π oder φ entlang.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Der Mediant",
      title: "(a + c) / (b + d) — die falsche Art, die funktioniert",
      body: "Der Mediant von a/b und c/d ist das, was passiert, wenn du Zähler und Nenner getrennt addierst — genau der Schülerfehler. Das Ergebnis ist nicht a/b + c/d, liegt aber immer strikt zwischen beiden und ist sofort gekürzt, sobald es die Eltern sind. Aus dieser einen falschen Addition fällt eine unendlich geordnete Struktur heraus.",
    },
    {
      pretitle: "Abschnitt 02 · Jeder Bruch, einmal",
      title: "Nichts ausgelassen, nichts wiederholt",
      body: "Stern entdeckte den Baum 1858 als Stück reiner Zahlentheorie; Brocot fand ihn 1861 wieder, beim Wählen von Zahnradübersetzungen für Uhren. Ihr gemeinsamer Satz: gehst du weit genug, triffst du jeden gekürzten Bruch p/q mit p, q > 0 — jeder sitzt an seinem eigenen, einzigen Knoten, keiner fehlt, keiner taucht doppelt auf. Der Baum ist zugleich vollständige Liste der positiven rationalen Zahlen und Zeuge dafür, dass sie nur abzählbar sind.",
    },
    {
      pretitle: "Abschnitt 03 · Links-Rechts ist der Kettenbruch",
      title: "L, R, L, R, … kodieren die Entwicklung",
      body: "Wähl eine positive Zahl. Laufe von 1/1 abwärts, L wenn du über dem Ziel stehst, R wenn darunter. Fasse die Bewegungen zu Läufen zusammen und du hast die Kettenbruchentwicklung deines Ziels notiert — die kanonische Adresse einer reellen Zahl in der Arithmetik.",
    },
    {
      pretitle: "Abschnitt 04 · Beste rationale Näherungen",
      title: "Am Ende eines Laufs anhalten: du stehst auf einer Konvergente",
      body: "Halte am Ende eines L/R-Laufs an, kurz bevor die Richtung kippt, und der Bruch unter dir ist eine Konvergente: eine beste rationale Näherung des Ziels, kein Bruch mit kleinerem Nenner kommt näher. Hältst du mitten in einem Lauf an, landest du stattdessen auf einer Semikonvergente, nah dran, aber nicht garantiert besser als jeder kleinere Nenner. Hurwitz' Satz (1891) besagt: jede irrationale Zahl hat unendlich viele Konvergenten p/q mit |x − p/q| < 1/(√5 q²), und die Konstante √5 ist scharf, erreicht von φ.",
    },
    {
      pretitle: "Abschnitt 05 · Der Farey-Cousin",
      title: "Filtere den Baum nach Nenner: du bekommst die Farey-Folge",
      body: "Sammle jeden Bruch im ganzen Baum mit Nenner höchstens n, der in [0, 1] liegt, und nimm den Randpunkt 0/1 dazu. Von links nach rechts gelesen ist diese Liste die Farey-Folge Fₙ, die sortierten gekürzten Brüche in [0, 1] mit beschränktem Nenner. Eine einzelne Ebene reicht nie, denn ein Bruch mit Nenner q taucht schon bis Tiefe q auf: 1/2 sitzt auf Tiefe 1, also musst du den ganzen Teilbaum bis Tiefe n durchgehen. Beide Strukturen sind verschiedene Sichten auf dasselbe arithmetische Skelett.",
    },
    {
      pretitle: "Abschnitt 06 · Heutige Anwendungen",
      title: "Font-Hinting, Digitaluhren, Zahlentheorie",
      body: "Brocot wollte exakte Zahnradketten; heute wählt derselbe Baum rationale Näherungen für Font-Hinting auf Pixelrastern, treibt den Approximationsschritt in digitalen Phasenregelschleifen und stützt moderne Beweise in der Diophantischen Approximation. Wo immer du «den einfachsten Bruch brauchst, der nahe genug rankommt», ist dies die Datenstruktur.",
    },
  ],
  closingPretitle: "Geh weiter",
  closingTitle: "Laufe den Baum entlang.",
  closingBody:
    "Der Explorer lässt dich jede reelle Zahl tippen — π, φ, e, √2 oder deine eigene — und zeigt den L/R-Pfad, mit den Konvergenten Schritt für Schritt. Beste rationale Näherungen, auf Knopfdruck.",
  ctaLabel: "→ Explorer öffnen",
  treeCaption: "Interaktiv · die ersten Ebenen",
  treeDepthLabel: "Tiefe",
  treeTargetLabel: "Pfad hervorheben zu",
  treePathLabel: "L/R-Pfad",
  walkCaption: "Interaktiv · zu einer reellen Zahl laufen",
  walkInputLabel: "Zielwert",
  walkPresetsLabel: "Berühmte Zahlen",
  walkPathLabel: "Pfad · L = kleiner · R = größer",
  walkConvergentsLabel: "Beste rationale Näherungen — die Konvergenten",
  walkStepHead: "Schritt",
  walkFractionHead: "Bruch",
  walkDecimalHead: "Dezimal",
  walkErrorHead: "Fehler",
  mediantBoxCaption: "Der Mediant in einer Zeile",
  mediantBoxNote:
    "Drei Medianten weit, und die Keime jeder rationalen Zahl stehen schon auf dem Papier.",
  treeInterCaption: "Interaktiv · der Baum",
  treeInterTitle: "Erste Ebenen, jeder Bruch genau einmal",
  piPathCaption: "πs Pfad",
  walkInterCaption: "Interaktiv · eine reelle Zahl entlanglaufen",
  walkInterTitle: "Tippe eine Zahl, sieh die Konvergenten erscheinen",
  hurwitzNote:
    "Für jede irrationale Zahl x erfüllen unendlich viele Brüche p/q diese Schranke, und √5 ist bestmöglich, erreicht vom goldenen Schnitt.",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Teoría de números",
    title: "El árbol de Stern–Brocot",
    tagline: "Cada fracción, exactamente una vez — sumando mal.",
    intro:
      "Empieza con 0/1 y 1/0 — las dos imposibilidades. Mete una nueva fracción entre ellas sumando numeradores y denominadores por separado, como lo haría un niño. Repite para siempre. El árbol infinito que construyes contiene cada fracción positiva una sola vez, ya en su forma reducida — y el camino izquierda-derecha hasta cada una es su desarrollo en fracción continua.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Suma fracciones mal. Descubre cada fracción.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Entre dos fracciones a/b y c/d, mete la mediana (a+c)/(b+d). Es la forma equivocada de sumar, pero coloca una fracción estrictamente entre ambas — y cada fracción positiva vive, exactamente una vez, en el árbol que crece así.",
      },
      {
        label: "02",
        title: "Un paseo concreto",
        body: "Empieza con 0/1 y 1/0. Su mediana es 1/1. Mete. Entre 0/1 y 1/1 queda 1/2; entre 1/1 y 1/0 queda 2/1. Sigue. Nivel a nivel aparece toda fracción reducida — y los valores de φ, π, √2 son caminos por el mismo árbol.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "El árbol esconde las mejores aproximaciones racionales de todo número real — y Brocot lo construyó en 1861 para elegir engranajes de relojes. Teoría de números, tipografía y el segundero digital se encuentran en el mismo diagrama.",
      },
    ],
    tryIt: "Abajo: gira la profundidad, luego camina el árbol hacia π o φ.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La mediana",
      title: "(a + c) / (b + d) — el modo erróneo que funciona",
      body: "La mediana de a/b y c/d es lo que sale si sumas numeradores y denominadores por separado — el error escolar exacto. El resultado no es a/b + c/d, pero siempre cae estrictamente entre ambas y queda reducida en cuanto sus padres lo están. De esa única suma mal hecha brota una estructura ordenada infinita.",
    },
    {
      pretitle: "Sección 02 · Cada fracción, una vez",
      title: "Nada falta, nada se repite",
      body: "Stern descubrió el árbol en 1858 como teoría pura de números; Brocot lo redescubrió en 1861 eligiendo razones de engranaje para relojes. Su teorema común: si caminas lo bastante, te cruzas con cada fracción reducida p/q de términos positivos — cada una en su propio nodo único, ninguna ausente, ninguna repetida. El árbol es a la vez catálogo completo de los racionales positivos y testigo de que son numerables.",
    },
    {
      pretitle: "Sección 03 · Izquierda-derecha es la fracción continua",
      title: "L, R, L, R, … codifican el desarrollo",
      body: "Elige un número positivo. Baja desde 1/1: L si quedas por encima del objetivo, R si por debajo. Agrupa los movimientos en tiradas y habrás escrito la fracción continua de tu objetivo — la dirección canónica de un real dentro de la aritmética.",
    },
    {
      pretitle: "Sección 04 · Mejores aproximaciones racionales",
      title: "Para al final de una tirada: estás en un convergente",
      body: "Detente al final de una tirada L/R, justo antes de que la dirección cambie, y la fracción donde estás es un convergente: una mejor aproximación racional del objetivo, ninguna con denominador menor se acerca más. Si paras en mitad de una tirada, caes en cambio sobre un semiconvergente, cercano pero sin garantía de superar a todo denominador menor. El teorema de Hurwitz (1891) dice que todo irracional tiene infinitos convergentes p/q con |x − p/q| < 1/(√5 q²), y la constante √5 es óptima, alcanzada por φ.",
    },
    {
      pretitle: "Sección 05 · La prima Farey",
      title: "Filtra el árbol por denominador: sale la sucesión de Farey",
      body: "Reúne toda fracción en cualquier parte del árbol con denominador a lo sumo n que caiga en [0, 1], y añade el extremo 0/1. Leída de izquierda a derecha, esa lista es la sucesión de Farey Fₙ, las fracciones reducidas de [0, 1] con denominador acotado, ya ordenadas. Un solo nivel nunca basta, pues una fracción con denominador q ya aparece hacia la profundidad q: 1/2 vive en la profundidad 1, así que debes recorrer todo el subárbol hasta la profundidad n. Dos vistas del mismo esqueleto aritmético.",
    },
    {
      pretitle: "Sección 06 · Usos modernos",
      title: "Hinting de fuentes, relojes digitales, teoría de números",
      body: "Brocot quería trenes de engranajes precisos; hoy el mismo árbol elige aproximaciones racionales para hinting de fuentes en cuadrículas de píxeles, mueve el paso de aproximación en PLL digitales y sostiene pruebas modernas en aproximación diofántica. Donde necesites «la fracción más simple que se acerque lo bastante», esta es la estructura.",
    },
  ],
  closingPretitle: "Llega más lejos",
  closingTitle: "Camina el árbol.",
  closingBody:
    "El Explorador te deja teclear cualquier real — π, φ, e, √2 o el tuyo — y ver desplegarse el camino L/R, con los convergentes paso a paso. Mejores aproximaciones racionales, a un toque.",
  ctaLabel: "→ Abrir el Explorador",
  treeCaption: "Interactivo · los primeros niveles",
  treeDepthLabel: "Profundidad",
  treeTargetLabel: "Resaltar camino a",
  treePathLabel: "Camino L/R",
  walkCaption: "Interactivo · caminar hacia un real",
  walkInputLabel: "Valor objetivo",
  walkPresetsLabel: "Números famosos",
  walkPathLabel: "Camino · L = menor · R = mayor",
  walkConvergentsLabel: "Mejores aproximaciones racionales — los convergentes",
  walkStepHead: "paso",
  walkFractionHead: "fracción",
  walkDecimalHead: "decimal",
  walkErrorHead: "error",
  mediantBoxCaption: "La mediana en una línea",
  mediantBoxNote: "Tres medianas y las semillas de todo racional ya están en la página.",
  treeInterCaption: "Interactivo · el árbol",
  treeInterTitle: "Primeros niveles, cada fracción exactamente una vez",
  piPathCaption: "El camino de π",
  walkInterCaption: "Interactivo · caminar hacia un real",
  walkInterTitle: "Teclea un número y mira aparecer los convergentes",
  hurwitzNote:
    "Para todo irracional x, infinitas fracciones p/q cumplen esto, y √5 es lo mejor posible, alcanzado por la razón áurea.",
};

const fr: RichStory = {
  page: {
    pretitle: "Thème · Théorie des nombres",
    title: "L'arbre de Stern–Brocot",
    tagline: "Chaque fraction, exactement une fois — en additionnant mal.",
    intro:
      "Pars de 0/1 et 1/0 — les deux impossibilités. Glisse une nouvelle fraction entre elles en additionnant numérateurs et dénominateurs séparément, comme le ferait un enfant. Recommence à l'infini. L'arbre que tu construis contient chaque fraction positive une seule fois, déjà irréductible — et le chemin gauche-droite vers chacune est son développement en fraction continue.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Additionne mal. Découvre toutes les fractions.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Entre deux fractions a/b et c/d, glisse la médiante (a+c)/(b+d). C'est la mauvaise façon d'additionner, mais elle place une fraction strictement entre les deux — et chaque fraction positive vit, exactement une fois, dans l'arbre qui s'en déduit.",
      },
      {
        label: "02",
        title: "Une marche concrète",
        body: "Commence par 0/1 et 1/0. Leur médiante est 1/1. Glisse. Entre 0/1 et 1/1 il y a 1/2 ; entre 1/1 et 1/0 il y a 2/1. Continue. Niveau après niveau, toute fraction irréductible apparaît — et les valeurs de φ, π, √2 sont des chemins dans le même arbre.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "L'arbre cache les meilleures approximations rationnelles de tout réel — et Brocot l'a construit en 1861 pour choisir des engrenages d'horloges. Théorie des nombres, typographie et seconde numérique se croisent dans le même diagramme.",
      },
    ],
    tryIt: "Ci-dessous : tourne la profondeur, puis marche dans l'arbre vers π ou φ.",
  },
  sections: [
    {
      pretitle: "Section 01 · La médiante",
      title: "(a + c) / (b + d) — la mauvaise manière qui marche",
      body: "La médiante de a/b et c/d, c'est ce que tu obtiens en additionnant numérateurs et dénominateurs séparément — exactement l'erreur d'écolier. Le résultat n'est pas a/b + c/d, mais tombe toujours strictement entre les deux et reste irréductible dès que les parents le sont. De cette unique mauvaise addition jaillit une structure ordonnée infinie.",
    },
    {
      pretitle: "Section 02 · Chaque fraction, une seule fois",
      title: "Rien oublié, rien répété",
      body: "Stern a découvert l'arbre en 1858 comme théorie pure des nombres ; Brocot l'a redécouvert en 1861 en choisissant des rapports d'engrenage pour des horloges. Leur théorème commun : descends assez loin et tu rencontres chaque fraction irréductible p/q à termes positifs — chacune à son propre nœud unique, aucune absente, aucune doublée. L'arbre est à la fois catalogue complet des rationnels positifs et témoin de leur dénombrabilité.",
    },
    {
      pretitle: "Section 03 · Gauche-droite est la fraction continue",
      title: "L, R, L, R, … codent le développement",
      body: "Choisis un nombre positif. Descends depuis 1/1 : L si tu es au-dessus, R si en dessous. Regroupe les pas en plages, et tu as écrit le développement en fraction continue de ta cible — l'adresse canonique d'un réel en arithmétique.",
    },
    {
      pretitle: "Section 04 · Meilleures approximations rationnelles",
      title: "Arrête-toi en fin de plage : tu es sur un convergent",
      body: "Arrête-toi à la fin d'une plage L/R, juste avant que la direction ne bascule, et la fraction sous tes pieds est un convergent : une meilleure approximation rationnelle de la cible, aucune fraction à plus petit dénominateur ne s'en approche davantage. Arrête-toi au milieu d'une plage et tu obtiens plutôt un semiconvergent, proche mais sans garantie de battre tout dénominateur plus petit. Le théorème de Hurwitz (1891) affirme que tout irrationnel a une infinité de convergents p/q avec |x − p/q| < 1/(√5 q²), et la constante √5 est optimale, atteinte par φ.",
    },
    {
      pretitle: "Section 05 · La cousine de Farey",
      title: "Filtre l'arbre par dénominateur : voici la suite de Farey",
      body: "Rassemble toute fraction, où qu'elle soit dans l'arbre, de dénominateur au plus n et située dans [0, 1], puis ajoute l'extrémité 0/1. Lue de gauche à droite, cette liste est la suite de Farey Fₙ, les fractions irréductibles de [0, 1] à dénominateur borné, déjà triées. Un seul niveau ne suffit jamais, car une fraction de dénominateur q apparaît déjà avant la profondeur q : 1/2 est à la profondeur 1, donc il faut parcourir tout le sous-arbre jusqu'à la profondeur n. Deux vues du même squelette arithmétique.",
    },
    {
      pretitle: "Section 06 · Usages modernes",
      title: "Hinting de polices, horloges numériques, théorie des nombres",
      body: "Brocot voulait des trains d'engrenages précis ; aujourd'hui le même arbre choisit des approximations rationnelles pour le hinting de polices sur grilles de pixels, anime l'étape d'approximation des PLL numériques, et soutient des preuves modernes d'approximation diophantienne. Partout où il faut «la fraction la plus simple qui s'approche assez», c'est la structure.",
    },
  ],
  closingPretitle: "Pour aller plus loin",
  closingTitle: "Marche dans l'arbre.",
  closingBody:
    "L'Explorateur te laisse taper n'importe quel réel — π, φ, e, √2 ou le tien — et voir se dérouler le chemin L/R, avec les convergents pas à pas. Meilleures approximations rationnelles, à portée de clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  treeCaption: "Interactif · les premiers niveaux",
  treeDepthLabel: "Profondeur",
  treeTargetLabel: "Surligner le chemin vers",
  treePathLabel: "Chemin L/R",
  walkCaption: "Interactif · marcher vers un réel",
  walkInputLabel: "Valeur cible",
  walkPresetsLabel: "Nombres célèbres",
  walkPathLabel: "Chemin · L = plus petit · R = plus grand",
  walkConvergentsLabel: "Meilleures approximations rationnelles — les convergents",
  walkStepHead: "pas",
  walkFractionHead: "fraction",
  walkDecimalHead: "décimal",
  walkErrorHead: "erreur",
  mediantBoxCaption: "La médiante en une ligne",
  mediantBoxNote: "Trois médiantes et les germes de tout rationnel sont déjà sur la page.",
  treeInterCaption: "Interactif · l'arbre",
  treeInterTitle: "Premiers niveaux, chaque fraction exactement une fois",
  piPathCaption: "Le chemin de π",
  walkInterCaption: "Interactif · marcher vers un réel",
  walkInterTitle: "Tape un nombre, regarde les convergents apparaître",
  hurwitzNote:
    "Pour tout irrationnel x, une infinité de fractions p/q vérifient cela, et √5 est optimal, atteint par le nombre d'or.",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Teoria dei numeri",
    title: "L'albero di Stern–Brocot",
    tagline: "Ogni frazione, esattamente una volta — sommando male.",
    intro:
      "Parti da 0/1 e 1/0 — le due impossibilità. Infilaci una nuova frazione sommando numeratori e denominatori separatamente, come farebbe un bambino. Ripeti per sempre. L'albero infinito che costruisci contiene ogni frazione positiva una sola volta, già ridotta ai minimi termini — e il cammino sinistra-destra fino a ciascuna è il suo sviluppo in frazione continua.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Somma male le frazioni. Scopri ogni frazione.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Tra due frazioni a/b e c/d infila la mediante (a+c)/(b+d). È il modo sbagliato di sommare, ma piazza una frazione strettamente fra le due — e ogni frazione positiva vive, esattamente una volta, nell'albero che ne nasce.",
      },
      {
        label: "02",
        title: "Una camminata concreta",
        body: "Inizia con 0/1 e 1/0. La loro mediante è 1/1. Infilala. Tra 0/1 e 1/1 ora c'è 1/2; tra 1/1 e 1/0 c'è 2/1. Vai avanti. Livello dopo livello compare ogni frazione ridotta — e i valori di φ, π, √2 sono strade nello stesso albero.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "L'albero nasconde le migliori approssimazioni razionali di ogni reale — e Brocot lo costruì nel 1861 per scegliere ingranaggi per orologi. Teoria dei numeri, tipografia e lancetta digitale dei secondi si ritrovano nello stesso diagramma.",
      },
    ],
    tryIt: "Sotto: gira la profondità, poi cammina nell'albero verso π o φ.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La mediante",
      title: "(a + c) / (b + d) — il modo sbagliato che funziona",
      body: "La mediante di a/b e c/d è ciò che esce sommando numeratori e denominatori separatamente — esattamente l'errore da scolaro. Il risultato non è a/b + c/d, ma cade sempre strettamente fra le due ed è già ridotto non appena lo sono i genitori. Da questa unica somma sbagliata sgorga una struttura ordinata infinita.",
    },
    {
      pretitle: "Sezione 02 · Ogni frazione, una volta",
      title: "Niente saltato, niente ripetuto",
      body: "Stern scoprì l'albero nel 1858 come pezzo di pura teoria dei numeri; Brocot lo riscoprì nel 1861 scegliendo rapporti di trasmissione per orologi. Il loro teorema condiviso: scendi abbastanza e incontri ogni frazione ridotta p/q a termini positivi — ciascuna in un suo nodo unico, nessuna mancante, nessuna ripetuta. L'albero è insieme elenco completo dei razionali positivi e testimone della loro numerabilità.",
    },
    {
      pretitle: "Sezione 03 · Sinistra-destra è la frazione continua",
      title: "L, R, L, R, … codificano lo sviluppo",
      body: "Scegli un numero positivo. Scendi da 1/1: L se sei sopra il bersaglio, R se sotto. Raggruppa i passi in serie ed avrai scritto la frazione continua del bersaglio — l'indirizzo canonico di un reale nell'aritmetica.",
    },
    {
      pretitle: "Sezione 04 · Migliori approssimazioni razionali",
      title: "Fermati a fine serie: sei su un convergente",
      body: "Fermati alla fine di una serie L/R, appena prima che la direzione cambi, e la frazione su cui stai è un convergente: una migliore approssimazione razionale del bersaglio, nessuna con denominatore minore si avvicina di più. Se ti fermi a metà di una serie, cadi invece su un semiconvergente, vicino ma non garantito migliore di ogni denominatore minore. Il teorema di Hurwitz (1891) dice che ogni irrazionale ha infiniti convergenti p/q con |x − p/q| < 1/(√5 q²), e la costante √5 è ottimale, raggiunta da φ.",
    },
    {
      pretitle: "Sezione 05 · La cugina di Farey",
      title: "Filtra l'albero per denominatore: esce la successione di Farey",
      body: "Raccogli ogni frazione, ovunque nell'albero, con denominatore al più n e situata in [0, 1], poi aggiungi l'estremo 0/1. Letta da sinistra a destra, quella lista è la successione di Farey Fₙ, le frazioni ridotte di [0, 1] con denominatore limitato, già ordinate. Un solo livello non basta mai, perché una frazione con denominatore q compare già entro la profondità q: 1/2 sta alla profondità 1, quindi devi percorrere tutto il sottoalbero fino alla profondità n. Due viste dello stesso scheletro aritmetico.",
    },
    {
      pretitle: "Sezione 06 · Usi moderni",
      title: "Hinting di font, orologi digitali, teoria dei numeri",
      body: "Brocot voleva treni di ingranaggi precisi; oggi lo stesso albero sceglie approssimazioni razionali per l'hinting dei font su griglie di pixel, muove il passo di approssimazione nei PLL digitali e sorregge dimostrazioni moderne in approssimazione diofantea. Ovunque serva «la frazione più semplice che ci arrivi abbastanza vicino», è questa la struttura.",
    },
  ],
  closingPretitle: "Vai oltre",
  closingTitle: "Cammina nell'albero.",
  closingBody:
    "L'Esploratore ti lascia digitare un reale qualsiasi — π, φ, e, √2 o il tuo — e osservare il cammino L/R che si srotola, con i convergenti passo per passo. Migliori approssimazioni razionali, a portata di click.",
  ctaLabel: "→ Apri l'Esploratore",
  treeCaption: "Interattivo · i primi livelli",
  treeDepthLabel: "Profondità",
  treeTargetLabel: "Evidenzia cammino verso",
  treePathLabel: "Cammino L/R",
  walkCaption: "Interattivo · cammina verso un reale",
  walkInputLabel: "Valore bersaglio",
  walkPresetsLabel: "Numeri famosi",
  walkPathLabel: "Cammino · L = minore · R = maggiore",
  walkConvergentsLabel: "Migliori approssimazioni razionali — i convergenti",
  walkStepHead: "passo",
  walkFractionHead: "frazione",
  walkDecimalHead: "decimale",
  walkErrorHead: "errore",
  mediantBoxCaption: "La mediante in una riga",
  mediantBoxNote: "Tre medianti e i semi di ogni razionale sono già sulla pagina.",
  treeInterCaption: "Interattivo · l'albero",
  treeInterTitle: "Primi livelli, ogni frazione esattamente una volta",
  piPathCaption: "Il cammino di π",
  walkInterCaption: "Interattivo · cammina verso un reale",
  walkInterTitle: "Digita un numero e guarda comparire i convergenti",
  hurwitzNote:
    "Per ogni irrazionale x, infinite frazioni p/q soddisfano questo, e √5 è il migliore possibile, raggiunto dalla sezione aurea.",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Teoria dos números",
    title: "A árvore de Stern–Brocot",
    tagline: "Cada fração, exatamente uma vez — somando mal.",
    intro:
      "Começa com 0/1 e 1/0 — as duas impossibilidades. Mete uma nova fração entre elas a somar numeradores e denominadores em separado, como uma criança faria. Repete para sempre. A árvore infinita que constróis contém cada fração positiva uma vez, já irredutível — e o caminho esquerda-direita até cada uma é o seu desenvolvimento em fração contínua.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Soma frações mal. Descobre cada fração.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Entre duas frações a/b e c/d, mete a mediante (a+c)/(b+d). É a forma errada de somar, mas coloca uma fração estritamente entre ambas — e cada fração positiva vive, exatamente uma vez, na árvore que daí cresce.",
      },
      {
        label: "02",
        title: "Um passeio concreto",
        body: "Começa com 0/1 e 1/0. A mediante é 1/1. Mete. Entre 0/1 e 1/1 fica 1/2; entre 1/1 e 1/0 fica 2/1. Continua. Nível após nível aparece cada fração reduzida — e os valores de φ, π, √2 são estradas pela mesma árvore.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A árvore esconde as melhores aproximações racionais de todo real — e Brocot construiu-a em 1861 para escolher engrenagens de relógios. Teoria dos números, tipografia e ponteiro digital dos segundos cruzam-se no mesmo diagrama.",
      },
    ],
    tryIt: "Abaixo: roda a profundidade e depois caminha na árvore até π ou φ.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A mediante",
      title: "(a + c) / (b + d) — o modo errado que funciona",
      body: "A mediante de a/b e c/d é o que sai a somar numeradores e denominadores em separado — exatamente o erro escolar. O resultado não é a/b + c/d, mas fica sempre estritamente entre as duas e mantém-se irredutível assim que os pais o são. Dessa única soma errada brota uma estrutura ordenada infinita.",
    },
    {
      pretitle: "Secção 02 · Cada fração, uma vez",
      title: "Nada falta, nada se repete",
      body: "Stern descobriu a árvore em 1858 como pura teoria dos números; Brocot redescobriu-a em 1861 a escolher razões de engrenagem para relógios. O teorema comum: desce o suficiente e encontras cada fração irredutível p/q de termos positivos — cada uma num nó próprio e único, nenhuma em falta, nenhuma repetida. A árvore é, ao mesmo tempo, catálogo completo dos racionais positivos e testemunho de que são numeráveis.",
    },
    {
      pretitle: "Secção 03 · Esquerda-direita é a fração contínua",
      title: "L, R, L, R, … codificam o desenvolvimento",
      body: "Escolhe um número positivo. Desce desde 1/1: L se estás acima do alvo, R se abaixo. Agrupa os passos em corridas e escreveste a fração contínua do teu alvo — o endereço canónico de um real na aritmética.",
    },
    {
      pretitle: "Secção 04 · Melhores aproximações racionais",
      title: "Para no fim de uma corrida: estás num convergente",
      body: "Para no fim de uma corrida L/R, mesmo antes de a direção virar, e a fração onde estás é um convergente: uma melhor aproximação racional do alvo, nenhuma com denominador menor chega mais perto. Se paras a meio de uma corrida, cais antes sobre um semiconvergente, próximo mas sem garantia de superar todo o denominador menor. O teorema de Hurwitz (1891) diz que todo o irracional tem infinitos convergentes p/q com |x − p/q| < 1/(√5 q²), e a constante √5 é ótima, atingida por φ.",
    },
    {
      pretitle: "Secção 05 · A prima Farey",
      title: "Filtra a árvore por denominador: sai a sequência de Farey",
      body: "Reúne toda a fração, em qualquer ponto da árvore, com denominador no máximo n e situada em [0, 1], e junta o extremo 0/1. Lida da esquerda para a direita, essa lista é a sequência de Farey Fₙ, as frações reduzidas em [0, 1] com denominador limitado, já ordenadas. Um só nível nunca chega, pois uma fração com denominador q já aparece até à profundidade q: 1/2 fica na profundidade 1, por isso tens de percorrer toda a subárvore até à profundidade n. Duas vistas do mesmo esqueleto aritmético.",
    },
    {
      pretitle: "Secção 06 · Usos modernos",
      title: "Hinting de fontes, relógios digitais, teoria dos números",
      body: "Brocot queria trens de engrenagens precisos; hoje a mesma árvore escolhe aproximações racionais para o hinting de fontes em grelhas de pixéis, anima o passo de aproximação nos PLL digitais e sustenta provas modernas em aproximação diofantina. Onde precises «da fração mais simples que chegue perto o suficiente», é esta a estrutura.",
    },
  ],
  closingPretitle: "Vai mais longe",
  closingTitle: "Caminha na árvore.",
  closingBody:
    "O Explorador deixa-te escrever qualquer real — π, φ, e, √2 ou o teu — e ver o caminho L/R a desenrolar-se, com os convergentes passo a passo. Melhores aproximações racionais, a um clique.",
  ctaLabel: "→ Abrir o Explorador",
  treeCaption: "Interativo · os primeiros níveis",
  treeDepthLabel: "Profundidade",
  treeTargetLabel: "Realçar caminho até",
  treePathLabel: "Caminho L/R",
  walkCaption: "Interativo · caminhar até um real",
  walkInputLabel: "Valor alvo",
  walkPresetsLabel: "Números famosos",
  walkPathLabel: "Caminho · L = menor · R = maior",
  walkConvergentsLabel: "Melhores aproximações racionais — os convergentes",
  walkStepHead: "passo",
  walkFractionHead: "fração",
  walkDecimalHead: "decimal",
  walkErrorHead: "erro",
  mediantBoxCaption: "A mediante numa linha",
  mediantBoxNote: "Três mediantes e as sementes de todo o racional já estão na página.",
  treeInterCaption: "Interativo · a árvore",
  treeInterTitle: "Primeiros níveis, cada fração exatamente uma vez",
  piPathCaption: "O caminho de π",
  walkInterCaption: "Interativo · caminhar até um real",
  walkInterTitle: "Escreve um número e vê surgir os convergentes",
  hurwitzNote:
    "Para todo o irracional x, infinitas frações p/q cumprem isto, e √5 é o melhor possível, atingido pela razão de ouro.",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Talteori",
    title: "Stern–Brocot-trädet",
    tagline: "Varje bråk, exakt en gång — byggt av att addera fel.",
    intro:
      "Börja med 0/1 och 1/0 — de två omöjligheterna. Skjut in ett nytt bråk emellan genom att addera täljare och nämnare var för sig, precis som ett barn skulle göra. Upprepa i oändlighet. Det oändliga träd du bygger innehåller varje positivt bråk en gång, redan i lägsta termer — och vänster-höger-stigen till vart och ett är dess kedjebråksutveckling.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Addera bråk fel. Upptäck varje bråk.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Mellan två bråk a/b och c/d, skjut in medianten (a+c)/(b+d). Det är fel sätt att addera, men lägger ett bråk strikt mellan de två — och varje positivt bråk bor, exakt en gång, i trädet som så växer fram.",
      },
      {
        label: "02",
        title: "En konkret vandring",
        body: "Börja med 0/1 och 1/0. Deras mediant är 1/1. Skjut in. Mellan 0/1 och 1/1 sitter nu 1/2; mellan 1/1 och 1/0 sitter 2/1. Fortsätt. Nivå för nivå dyker varje reducerat bråk upp — och värdena φ, π, √2 är vägar genom samma träd.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Trädet gömmer de bästa rationella approximationerna till varje reellt tal — och Brocot byggde det 1861 för att välja kugghjul till klockor. Talteori, typografi och den digitala sekundvisaren möts i samma diagram.",
      },
    ],
    tryIt: "Nedan: vrid djupreglaget, vandra sedan i trädet mot π eller φ.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Medianten",
      title: "(a + c) / (b + d) — det felaktiga sättet som funkar",
      body: "Medianten av a/b och c/d är vad du får om du adderar täljare och nämnare var för sig — precis skolbarnets misstag. Resultatet är inte a/b + c/d, men hamnar alltid strikt mellan de två och är reducerat så snart föräldrarna är det. Ur denna enda felaktiga addition faller en oändlig ordnad struktur ut.",
    },
    {
      pretitle: "Avsnitt 02 · Varje bråk, en gång",
      title: "Inget missas, inget upprepas",
      body: "Stern upptäckte trädet 1858 som ren talteori; Brocot återupptäckte det 1861 medan han valde utväxlingar till klockor. Deras gemensamma sats: gå tillräckligt långt och du möter varje förkortat bråk p/q med positiva termer — vart och ett vid sin egen unika nod, inget saknas, inget upprepas. Trädet är på en gång en fullständig katalog över de positiva rationella talen och ett vittnesbörd om att de bara är uppräkneligt många.",
    },
    {
      pretitle: "Avsnitt 03 · Vänster-höger är kedjebråket",
      title: "L, R, L, R, … kodar utvecklingen",
      body: "Välj ett positivt tal. Gå ned från 1/1: L om du ligger över målet, R om under. Gruppera stegen i körningar så har du skrivit ned kedjebråksutvecklingen för ditt mål — den kanoniska adressen för ett reellt tal i aritmetiken.",
    },
    {
      pretitle: "Avsnitt 04 · Bästa rationella approximationer",
      title: "Stanna vid en körnings slut: du står på en konvergent",
      body: "Stanna vid slutet av en L/R-körning, just innan riktningen vänder, och bråket du står på är en konvergent: en bästa rationell approximation till målet, inget bråk med mindre nämnare kommer närmare. Stannar du mitt i en körning hamnar du i stället på en semikonvergent, nära men utan garanti att slå varje mindre nämnare. Hurwitz sats (1891) säger att varje irrationellt tal har oändligt många konvergenter p/q med |x − p/q| < 1/(√5 q²), och konstanten √5 är skarp, uppnådd av φ.",
    },
    {
      pretitle: "Avsnitt 05 · Farey-kusinen",
      title: "Filtrera trädet efter nämnare: du får Fareyföljden",
      body: "Samla varje bråk var som helst i trädet med nämnare högst n som ligger i [0, 1], och lägg till ändpunkten 0/1. Läst från vänster till höger är listan Fareyföljden Fₙ, de sorterade förkortade bråken i [0, 1] med begränsad nämnare. En enda nivå räcker aldrig, eftersom ett bråk med nämnare q redan dyker upp senast vid djup q: 1/2 sitter på djup 1, så du måste gå igenom hela delträdet ned till djup n. Två vyer på samma aritmetiska skelett.",
    },
    {
      pretitle: "Avsnitt 06 · Moderna användningar",
      title: "Font-hinting, digitala klockor, talteori",
      body: "Brocot ville ha precisa kugghjulståg; idag väljer samma träd rationella approximationer för font-hinting på pixelrutnät, driver approximationssteget i digitala fasprovsslingor och bär moderna bevis i diofantisk approximation. Överallt där du behöver «det enklaste bråket som kommer tillräckligt nära» är detta strukturen.",
    },
  ],
  closingPretitle: "Gå vidare",
  closingTitle: "Vandra i trädet.",
  closingBody:
    "Utforskaren låter dig skriva vilket reellt tal som helst — π, φ, e, √2 eller ditt eget — och se L/R-stigen rulla ut, med konvergenterna steg för steg. Bästa rationella approximationer, ett klick bort.",
  ctaLabel: "→ Öppna Utforskaren",
  treeCaption: "Interaktivt · de första nivåerna",
  treeDepthLabel: "Djup",
  treeTargetLabel: "Markera stigen till",
  treePathLabel: "L/R-stig",
  walkCaption: "Interaktivt · vandra mot ett reellt tal",
  walkInputLabel: "Målvärde",
  walkPresetsLabel: "Berömda tal",
  walkPathLabel: "Stig · L = mindre · R = större",
  walkConvergentsLabel: "Bästa rationella approximationer — konvergenterna",
  walkStepHead: "steg",
  walkFractionHead: "bråk",
  walkDecimalHead: "decimal",
  walkErrorHead: "fel",
  mediantBoxCaption: "Medianten på en rad",
  mediantBoxNote: "Tre medianter in och fröna till varje rationellt tal står redan på sidan.",
  treeInterCaption: "Interaktivt · trädet",
  treeInterTitle: "Första nivåerna, varje bråk exakt en gång",
  piPathCaption: "π:s stig",
  walkInterCaption: "Interaktivt · vandra mot ett reellt tal",
  walkInterTitle: "Skriv ett tal och se konvergenterna dyka upp",
  hurwitzNote:
    "För varje irrationellt x uppfyller oändligt många bråk p/q detta, och √5 är bästa möjliga, uppnått av gyllene snittet.",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Tallteori",
    title: "Stern–Brocot-treet",
    tagline: "Hver brøk, nøyaktig én gang — bygd ved å addere feil.",
    intro:
      "Start med 0/1 og 1/0 — de to umulighetene. Skyv en ny brøk imellom ved å addere tellere og nevnere hver for seg, slik et barn ville gjort. Gjenta i det uendelige. Det uendelige treet du bygger inneholder hver positive brøk én gang, allerede i laveste form — og venstre-høyre-stien til hver er kjedebrøkutviklingen.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Adder brøker feil. Oppdag hver brøk.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Mellom to brøker a/b og c/d, skyv inn medianten (a+c)/(b+d). Det er feil måte å addere på, men plasserer en brøk strengt mellom de to — og hver positiv brøk bor, nøyaktig én gang, i treet som vokser fram.",
      },
      {
        label: "02",
        title: "En konkret vandring",
        body: "Begynn med 0/1 og 1/0. Medianten deres er 1/1. Skyv inn. Mellom 0/1 og 1/1 sitter nå 1/2; mellom 1/1 og 1/0 sitter 2/1. Fortsett. Nivå for nivå dukker hver reduserte brøk opp — og verdiene φ, π, √2 er veier gjennom det samme treet.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Treet skjuler de beste rasjonale tilnærmingene til hvert reelt tall — og Brocot bygde det i 1861 for å velge tannhjul til klokker. Tallteori, typografi og den digitale sekundviseren møtes i samme diagram.",
      },
    ],
    tryIt: "Under: vri på dybde-knappen, vandre så i treet mot π eller φ.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Medianten",
      title: "(a + c) / (b + d) — den feile måten som virker",
      body: "Medianten av a/b og c/d er det du får om du adderer tellere og nevnere hver for seg — akkurat skolebarnets feil. Resultatet er ikke a/b + c/d, men ligger alltid strengt mellom de to og er redusert så snart foreldrene er det. Fra denne ene feile addisjonen springer en uendelig ordnet struktur fram.",
    },
    {
      pretitle: "Avsnitt 02 · Hver brøk, én gang",
      title: "Ingenting glemt, ingenting gjentatt",
      body: "Stern oppdaget treet i 1858 som ren tallteori; Brocot gjenoppdaget det i 1861 mens han valgte utvekslinger til klokker. Deres felles teorem: gå langt nok og du møter hver forkortet brøk p/q med positive ledd — hver enkelt ved sin egen unike node, ingen mangler, ingen gjentas. Treet er samtidig en fullstendig liste over de positive rasjonale tallene og et vitne om at de bare er tellbart mange.",
    },
    {
      pretitle: "Avsnitt 03 · Venstre-høyre er kjedebrøken",
      title: "L, R, L, R, … koder utviklingen",
      body: "Velg et positivt tall. Gå ned fra 1/1: L hvis du er over målet, R hvis under. Grupper trinnene i kjøringer, og du har skrevet ned kjedebrøkutviklingen til målet — den kanoniske adressen til et reelt tall i aritmetikken.",
    },
    {
      pretitle: "Avsnitt 04 · Beste rasjonale tilnærminger",
      title: "Stopp ved en kjørings slutt: du står på en konvergent",
      body: "Stopp ved slutten av en L/R-kjøring, like før retningen snur, og brøken du står på er en konvergent: en beste rasjonal tilnærming til målet, ingen brøk med mindre nevner kommer nærmere. Stopper du midt i en kjøring, havner du i stedet på en semikonvergent, nær men uten garanti for å slå enhver mindre nevner. Hurwitz' teorem (1891) sier at hvert irrasjonalt tall har uendelig mange konvergenter p/q med |x − p/q| < 1/(√5 q²), og konstanten √5 er skarp, oppnådd av φ.",
    },
    {
      pretitle: "Avsnitt 05 · Farey-fetteren",
      title: "Filtrer treet etter nevner: du får Farey-følgen",
      body: "Samle hver brøk hvor som helst i treet med nevner høyst n som ligger i [0, 1], og legg til endepunktet 0/1. Lest fra venstre til høyre er listen Farey-følgen Fₙ, de sorterte forkortede brøkene i [0, 1] med begrenset nevner. Ett enkelt nivå holder aldri, for en brøk med nevner q dukker allerede opp innen dybde q: 1/2 sitter på dybde 1, så du må gå gjennom hele deltreet ned til dybde n. To utsikter til samme aritmetiske skjelett.",
    },
    {
      pretitle: "Avsnitt 06 · Moderne bruk",
      title: "Font-hinting, digitale klokker, tallteori",
      body: "Brocot ville ha presise tannhjulstog; i dag velger samme tre rasjonale tilnærminger for font-hinting på pikselrutenett, driver tilnærmingstrinnet i digitale faselåste sløyfer og bærer moderne bevis i diofantisk tilnærming. Overalt der du trenger «den enkleste brøken som kommer nær nok», er dette strukturen.",
    },
  ],
  closingPretitle: "Gå videre",
  closingTitle: "Vandre i treet.",
  closingBody:
    "Utforskeren lar deg skrive et hvilket som helst reelt tall — π, φ, e, √2 eller ditt eget — og se L/R-stien rulle ut, med konvergentene trinn for trinn. Beste rasjonale tilnærminger, ett klikk unna.",
  ctaLabel: "→ Åpne Utforskeren",
  treeCaption: "Interaktivt · de første nivåene",
  treeDepthLabel: "Dybde",
  treeTargetLabel: "Uthev stien til",
  treePathLabel: "L/R-sti",
  walkCaption: "Interaktivt · vandre mot et reelt tall",
  walkInputLabel: "Målverdi",
  walkPresetsLabel: "Berømte tall",
  walkPathLabel: "Sti · L = mindre · R = større",
  walkConvergentsLabel: "Beste rasjonale tilnærminger — konvergentene",
  walkStepHead: "trinn",
  walkFractionHead: "brøk",
  walkDecimalHead: "desimal",
  walkErrorHead: "feil",
  mediantBoxCaption: "Medianten på én linje",
  mediantBoxNote: "Tre medianter inn og frøene til hvert rasjonalt tall står allerede på siden.",
  treeInterCaption: "Interaktivt · treet",
  treeInterTitle: "Første nivåer, hver brøk nøyaktig én gang",
  piPathCaption: "πs sti",
  walkInterCaption: "Interaktivt · vandre mot et reelt tall",
  walkInterTitle: "Skriv et tall og se konvergentene dukke opp",
  hurwitzNote:
    "For hvert irrasjonalt x oppfyller uendelig mange brøker p/q dette, og √5 er best mulig, oppnådd av det gylne snitt.",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------
// Shared preset list — small SVG tree uses a curated subset; the walk
// component covers the full set.
// --------------------------------------------------------------------------

const TREE_PRESETS = [
  { id: "phi", label: "φ — 1.618…", value: PHI },
  { id: "sqrt2", label: "√2 — 1.414…", value: Math.SQRT2 },
  { id: "pi", label: "π/2 — 1.570…", value: Math.PI / 2 },
  { id: "twothirds", label: "2/3", value: 2 / 3 },
];

const WALK_PRESETS = [
  { id: "pi", label: "π", value: Math.PI },
  { id: "phi", label: "φ", value: PHI },
  { id: "e", label: "e", value: Math.E },
  { id: "sqrt2", label: "√2", value: Math.SQRT2 },
  { id: "frac227", label: "22/7", value: 22 / 7 },
];

// --------------------------------------------------------------------------

export default function SternbrocotStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/sternbrocot/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="a/b ⊕ c/d = (a + c) / (b + d)"
      formulaLatex={"\\frac{a}{b} \\oplus \\frac{c}{d} = \\frac{a + c}{b + d}"}
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
              <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-teal/40">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {card.label}
                </div>
                <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the mediant */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.mediantBoxCaption}
            </div>
            <div className="math-italic text-2xl text-ink-100 md:text-3xl">
              0/1 ⊕ 1/0 = 1/1 · 0/1 ⊕ 1/1 = 1/2 · 1/1 ⊕ 1/0 = 2/1
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.mediantBoxNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — every fraction once */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 · The tree */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.treeInterCaption}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.treeInterTitle}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SternBrocotTree
            caption={story.treeCaption}
            depthLabel={story.treeDepthLabel}
            targetLabel={story.treeTargetLabel}
            pathLabel={story.treePathLabel}
            presets={TREE_PRESETS}
          />
        </Reveal>
      </section>

      {/* Section 03 — L/R encodes the continued fraction */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.piPathCaption}
            </div>
            <div className="math-italic text-2xl text-ink-100">R³ L⁷ R¹⁵ L¹ R²⁹² L¹ …</div>
            <p className="mx-auto max-w-xl font-mono text-sm leading-relaxed text-ink-300">
              3, 22/7, 333/106, 355/113, 103993/33102, …
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 2 · Walk to a real number */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.walkInterCaption}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.walkInterTitle}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SternBrocotWalk
            caption={story.walkCaption}
            inputLabel={story.walkInputLabel}
            presetsLabel={story.walkPresetsLabel}
            pathLabel={story.walkPathLabel}
            convergentsLabel={story.walkConvergentsLabel}
            stepHead={story.walkStepHead}
            fractionHead={story.walkFractionHead}
            decimalHead={story.walkDecimalHead}
            errorHead={story.walkErrorHead}
            presets={WALK_PRESETS}
          />
        </Reveal>
      </section>

      {/* Section 04 — best approximations (Hurwitz) */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Hurwitz, 1891
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              |x − p/q| &lt; 1 / (√5 · q²)
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.hurwitzNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — Farey cousin */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — modern uses */}
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
            href="/sternbrocot/explorer"
            className="inline-block rounded-full border border-signal-teal/70 bg-signal-teal/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
