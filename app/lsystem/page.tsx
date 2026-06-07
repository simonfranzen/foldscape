"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { LsystemRewriteStepper } from "@/components/LsystemRewriteStepper";
import { LsystemTurtleRenderer } from "@/components/LsystemTurtleRenderer";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Rich, per-locale story content. The hero (pretitle/title/tagline/intro/CTA)
// and the long-form prose are all authored inline here, in all 8 site
// locales, so this page can tell a long story about Lindenmayer systems
// without leaking page-specific text into the shared i18n bundles. The
// shared atlas entry a.topics.lsystem is the tone reference, not the source.
// --------------------------------------------------------------------------

type EncounterCard = { label: string; title: string; body: string };

type RichStory = {
  page: StoryPage;
  encounter: {
    pretitle: string;
    title: string;
    cards: [EncounterCard, EncounterCard, EncounterCard];
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  rewriteCaption: string;
  rewriteStep: string;
  rewriteReset: string;
  rewritePreset: string;
  rewriteGeneration: string;
  rewriteLength: string;
  rewriteAxiom: string;
  rewriteRules: string;
  rewriteNote: string;
  turtleCaption: string;
  turtlePreset: string;
  turtleDepth: string;
  turtleAxiom: string;
  turtleRules: string;
  turtleAngle: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "L-Systems",
    tagline: "Letters that rewrite themselves into plants.",
    intro:
      "An L-system is a tiny grammar: a starting string, a handful of rewrite rules, and a turtle that turns the letters into lines. In a few generations, three letters become a fern. In the Explorer you edit the axiom, slide the depth and watch the turtle draw — Koch flakes, dragons, Hilbert curves, whole forests — out of a handful of characters.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "Replace letters. Draw the result. Get a fern.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Pick a short string of letters. Pick a tiny dictionary that says what each letter becomes in the next round. Apply the dictionary to every letter, simultaneously. Repeat. Now hand the resulting string to a turtle that knows how to draw — F means forward, + means turn left, − means turn right. After a few rounds the turtle is drawing ferns, coral, lightning, and trees.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Lindenmayer's algae: axiom A, rules A → AB and B → A. After 0 steps: A. After 1: AB. Then ABA, ABAAB, ABAABABA, and at step 5 the string is ABAABABAABAAB — thirteen letters. The lengths 1, 2, 3, 5, 8, 13 are the Fibonacci sequence: a botanical pattern hiding in pure rewriting.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Aristid Lindenmayer was a Hungarian biologist in Utrecht who wanted a formal language for how plants grow. He published the formalism in 1968 to model the cell-by-cell development of algae. The same idea now grows the trees in your favourite video game, the ferns in animated films and the procedural cities of the demoscene. A grammar for cells became a grammar for worlds.",
      },
    ],
    tryIt: "Below: step the rewrite by hand, then let a turtle draw the result.",
  },
  sections: [
    {
      pretitle: "Section 01 · The rewriting rule",
      title: "Alphabet, axiom, parallel rewrite",
      body: "An L-system has three pieces. An alphabet of symbols. An axiom — the starting string. A set of production rules, one per symbol, that say what each symbol becomes in the next generation. The defining trick is parallelism: at every step every symbol is rewritten at once, the way every cell in a young leaf divides at once. That single design decision is what separates an L-system from a Chomsky grammar, where one symbol is rewritten at a time. Parallelism gives you growth.",
    },
    {
      pretitle: "Section 02 · The turtle interpretation",
      title: "F, +, −, [, ] — a pen with memory",
      body: "Letters on their own are just text. The geometry appears when you hand the string to a turtle. F means draw forward by one unit. + turns left by a fixed angle (often 25°, 60°, 90°). − turns right by the same angle. Two more symbols give the turtle a memory: [ pushes its current position and heading onto a stack, ] pops them back. With just push and pop a one-dimensional string suddenly branches — bracket pairs become side-stems and twigs. Symbols outside the drawing alphabet (X, Y, A, B…) are silent variables: they carry information through the rewrites but the turtle ignores them on the page.",
    },
    {
      pretitle: "Section 03 · Famous L-systems",
      title: "Koch, Sierpiński, dragon, Hilbert, fern",
      body: "Four rules, four wildly different organisms. Koch snowflake: axiom F++F++F, rule F → F−F++F−F, angle 60°. Sierpiński arrowhead: A → B−A−B, B → A+B+A, angle 60°, alternating parity. Heighway's dragon: axiom FX, rules X → X+YF+, Y → −FX−Y, angle 90° — twelve rewrites and a folded paper strip falls out. Hilbert curve: A → +BF−AFA−FB+, B → −AF+BFB+FA−, angle 90°, sweeps every point of a square. Fractal plant: X → F+[[X]−X]−F[−FX]+X, F → FF, angle 25°, the canonical fern with side-branches and tips. Same engine, different worlds.",
    },
    {
      pretitle: "Section 04 · Branching with brackets",
      title: "[ pushes, ] pops — that is how plants grow",
      body: "Real plants are not curves; they branch. An L-system gets branching for free from two characters. When the turtle reads [ it saves its current position and direction on a stack, then keeps drawing. When it reads ] it restores them. Everything drawn between the matching brackets becomes a side-branch and the turtle then continues the trunk. Nesting brackets give you branches on branches on branches — the same way a sequoia's twigs grow off its branches, which grow off its limbs, which grow off its trunk. Two characters, infinite botany.",
    },
    {
      pretitle: "Section 05 · Stochastic and context-sensitive",
      title: "Beyond strict determinism",
      body: "The simple version above is context-free and deterministic: each symbol has exactly one rule. Two extensions make L-systems genuinely powerful. Stochastic L-systems give a symbol several possible rewrites, each with a probability — so two ferns from the same grammar look like siblings, not clones. Context-sensitive L-systems let a rule fire only when a symbol sits between specific neighbours, which is how biologists model signalling: a hormone in the parent cell triggers a particular division in the daughter. There are also parametric L-systems, where every symbol carries continuous parameters (length, angle, age), and timed L-systems where rules fire at different speeds. The whole family models real morphogenesis with surprising fidelity.",
    },
    {
      pretitle: "Section 06 · Real biology, real graphics",
      title: "From Lindenmayer 1968 to every animated forest",
      body: "Lindenmayer was modelling the cell-by-cell growth of Anabaena catenula, a filamentous blue-green alga, when he introduced the formalism in 1968. He kept refining it — for tobacco growth, for compound inflorescences, for the topology of branching axes. Przemyslaw Prusinkiewicz at Calgary turned the idea into a working pipeline with the 1990 book \"The Algorithmic Beauty of Plants,\" still the standard reference. From there it leaked into computer graphics: SpeedTree (used in countless films and games) is essentially an industrial L-system; Pixar's vegetation, the trees in The Witcher and Horizon, the wheat fields in Red Dead Redemption — all descend from Lindenmayer's parallel rewrite. A grammar for cells became a grammar for worlds.",
    },
  ],
  closingPretitle: "Now grow your own",
  closingTitle: "Three letters. One turtle. A whole forest.",
  closingBody:
    "Edit the axiom. Add a rule. Slide the depth and watch a grammar bloom into geometry. The Explorer is one click away.",
  ctaLabel: "→ Open the Explorer",
  rewriteCaption: "Interactive · rewrite by hand",
  rewriteStep: "Step",
  rewriteReset: "Reset",
  rewritePreset: "Preset",
  rewriteGeneration: "Generation",
  rewriteLength: "Length",
  rewriteAxiom: "Axiom",
  rewriteRules: "Rules",
  rewriteNote: "Note",
  turtleCaption: "Interactive · let the turtle draw",
  turtlePreset: "Preset",
  turtleDepth: "Depth",
  turtleAxiom: "Axiom",
  turtleRules: "Rules",
  turtleAngle: "Angle",
};

// ---------------- German ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "L-Systeme",
    tagline: "Buchstaben, die sich zu Pflanzen umschreiben.",
    intro:
      "Ein L-System ist eine winzige Grammatik: eine Startzeichenkette, eine Handvoll Ersetzungsregeln und eine Schildkröte, die aus den Buchstaben Linien macht. Aus drei Buchstaben wird in wenigen Generationen ein Farn. Im Explorer veränderst du Axiom und Regeln, schiebst die Iterationstiefe und siehst zu, wie die Schildkröte zeichnet — Koch-Flocken, Drachen, Hilbert-Kurven, ganze Wälder — aus einer Handvoll Zeichen.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Buchstaben ersetzen. Ergebnis zeichnen. Farn entsteht.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Nimm eine kurze Folge von Buchstaben. Nimm ein winziges Wörterbuch, das sagt, was jeder Buchstabe in der nächsten Runde wird. Wende das Wörterbuch auf jeden Buchstaben gleichzeitig an. Wiederhole. Übergib die entstehende Zeichenkette einer Schildkröte, die zeichnen kann — F heißt vorwärts, + heißt links abbiegen, − heißt rechts abbiegen. Nach ein paar Runden zeichnet sie Farne, Korallen, Blitze und Bäume.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Lindenmayers Alge: Axiom A, Regeln A → AB und B → A. Nach 0 Schritten: A. Nach 1: AB. Dann ABA, ABAAB, ABAABABA, und nach 5 Schritten lautet die Zeichenkette ABAABABAABAAB — dreizehn Buchstaben. Die Längen 1, 2, 3, 5, 8, 13 sind die Fibonacci-Folge: ein botanisches Muster, das in reiner Umschreibung versteckt liegt.",
      },
      {
        label: "03",
        title: "Warum es wichtig ist",
        body: "Aristid Lindenmayer war ein ungarischer Biologe in Utrecht, der eine formale Sprache für das Wachstum von Pflanzen wollte. 1968 veröffentlichte er den Formalismus, um die zellweise Entwicklung von Algen zu modellieren. Heute wächst dieselbe Idee die Bäume in deinem Lieblings-Videospiel, die Farne in Animationsfilmen und die prozeduralen Städte der Demoszene. Aus einer Grammatik für Zellen wurde eine Grammatik für Welten.",
      },
    ],
    tryIt:
      "Unten: schalt die Umschreibung selbst weiter, dann lass die Schildkröte das Ergebnis zeichnen.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Ersetzungsregel",
      title: "Alphabet, Axiom, paralleles Umschreiben",
      body: "Ein L-System besteht aus drei Teilen. Einem Alphabet von Symbolen. Einem Axiom — der Startzeichenkette. Einer Menge von Produktionsregeln, eine pro Symbol, die sagt, was aus jedem Symbol in der nächsten Generation wird. Der entscheidende Kniff ist die Parallelität: in jedem Schritt werden alle Symbole gleichzeitig ersetzt, so wie sich in einem jungen Blatt alle Zellen gleichzeitig teilen. Genau diese Entwurfsentscheidung trennt ein L-System von einer Chomsky-Grammatik, in der pro Schritt ein Symbol ersetzt wird. Parallelität liefert Wachstum.",
    },
    {
      pretitle: "Abschnitt 02 · Die Schildkröten-Interpretation",
      title: "F, +, −, [, ] — ein Stift mit Gedächtnis",
      body: "Buchstaben für sich sind nur Text. Die Geometrie entsteht, wenn man die Zeichenkette einer Schildkröte gibt. F bedeutet eine Einheit vorwärts zeichnen. + dreht den Kopf um einen festen Winkel nach links (oft 25°, 60°, 90°). − dreht um denselben Winkel nach rechts. Zwei weitere Symbole geben der Schildkröte ein Gedächtnis: [ legt aktuelle Position und Richtung auf einen Stapel, ] holt sie zurück. Mit Push und Pop allein verzweigt sich eine eindimensionale Zeichenkette plötzlich — Klammerpaare werden zu Seitenästen und Zweigen. Symbole außerhalb des Zeichen-Alphabets (X, Y, A, B…) sind stumme Variablen: sie tragen Information durch die Umschreibungen, doch die Schildkröte ignoriert sie auf dem Papier.",
    },
    {
      pretitle: "Abschnitt 03 · Berühmte L-Systeme",
      title: "Koch, Sierpiński, Drache, Hilbert, Farn",
      body: "Vier Regeln, vier völlig verschiedene Organismen. Koch-Schneeflocke: Axiom F++F++F, Regel F → F−F++F−F, Winkel 60°. Sierpiński-Pfeilspitze: A → B−A−B, B → A+B+A, Winkel 60°, mit wechselnder Parität. Heighways Drache: Axiom FX, Regeln X → X+YF+, Y → −FX−Y, Winkel 90° — zwölf Umschreibungen und ein gefalteter Papierstreifen fällt heraus. Hilbert-Kurve: A → +BF−AFA−FB+, B → −AF+BFB+FA−, Winkel 90°, überstreicht jeden Punkt eines Quadrats. Fraktale Pflanze: X → F+[[X]−X]−F[−FX]+X, F → FF, Winkel 25°, der kanonische Farn mit Seitenästen und Spitzen. Dieselbe Maschinerie, andere Welten.",
    },
    {
      pretitle: "Abschnitt 04 · Verzweigung mit Klammern",
      title: "[ legt ab, ] holt zurück — so wachsen Pflanzen",
      body: "Echte Pflanzen sind keine Kurven, sie verzweigen. Ein L-System bekommt Verzweigung kostenlos aus zwei Zeichen. Liest die Schildkröte [, legt sie ihre aktuelle Position und Richtung auf einen Stapel und zeichnet weiter. Liest sie ], stellt sie sie wieder her. Alles, was zwischen den passenden Klammern gezeichnet wurde, wird zu einem Seitenast, dann setzt die Schildkröte den Stamm fort. Verschachtelte Klammern ergeben Äste auf Ästen auf Ästen — genauso wie die Zweige eines Mammutbaums aus seinen Ästen wachsen, die aus seinen Hauptästen wachsen, die aus seinem Stamm wachsen. Zwei Zeichen, unendliche Botanik.",
    },
    {
      pretitle: "Abschnitt 05 · Stochastisch und kontextsensitiv",
      title: "Jenseits strenger Determiniertheit",
      body: "Die einfache Variante oben ist kontextfrei und deterministisch: jedes Symbol hat genau eine Regel. Zwei Erweiterungen machen L-Systeme richtig mächtig. Stochastische L-Systeme geben einem Symbol mehrere mögliche Ersetzungen, jede mit einer Wahrscheinlichkeit — zwei Farne aus derselben Grammatik sehen dadurch wie Geschwister aus, nicht wie Klone. Kontextsensitive L-Systeme erlauben einer Regel nur dann zu feuern, wenn ein Symbol zwischen bestimmten Nachbarn steht. So modellieren Biolog:innen Signalwege: ein Hormon in der Mutterzelle löst eine bestimmte Teilung in der Tochterzelle aus. Es gibt auch parametrische L-Systeme, in denen jedes Symbol kontinuierliche Parameter trägt (Länge, Winkel, Alter), und getaktete L-Systeme, in denen Regeln mit unterschiedlicher Geschwindigkeit feuern. Die ganze Familie modelliert echte Morphogenese mit erstaunlicher Treue.",
    },
    {
      pretitle: "Abschnitt 06 · Echte Biologie, echte Grafik",
      title: "Von Lindenmayer 1968 bis zu jedem animierten Wald",
      body: "Lindenmayer modellierte das zellweise Wachstum von Anabaena catenula, einer filamentösen Blaualge, als er den Formalismus 1968 einführte. Er verfeinerte ihn immer weiter — für Tabakwachstum, für zusammengesetzte Blütenstände, für die Topologie verzweigter Achsen. Przemyslaw Prusinkiewicz in Calgary machte aus der Idee mit seinem 1990 erschienenen Buch «The Algorithmic Beauty of Plants» eine funktionierende Pipeline; es ist bis heute die Standardreferenz. Von dort sickerte sie in die Computergrafik: SpeedTree (in zahllosen Filmen und Spielen) ist im Kern ein industrielles L-System; die Vegetation bei Pixar, die Bäume in The Witcher und Horizon, die Weizenfelder in Red Dead Redemption — alles Abkömmlinge von Lindenmayers parallelem Umschreiben. Aus einer Grammatik für Zellen wurde eine Grammatik für Welten.",
    },
  ],
  closingPretitle: "Jetzt selbst wachsen lassen",
  closingTitle: "Drei Buchstaben. Eine Schildkröte. Ein ganzer Wald.",
  closingBody:
    "Ändere das Axiom. Füge eine Regel hinzu. Schieb die Tiefe und sieh zu, wie eine Grammatik zu Geometrie wird. Der Explorer ist einen Klick entfernt.",
  ctaLabel: "→ Explorer öffnen",
  rewriteCaption: "Interaktiv · von Hand umschreiben",
  rewriteStep: "Schritt",
  rewriteReset: "Zurücksetzen",
  rewritePreset: "Vorlage",
  rewriteGeneration: "Generation",
  rewriteLength: "Länge",
  rewriteAxiom: "Axiom",
  rewriteRules: "Regeln",
  rewriteNote: "Hinweis",
  turtleCaption: "Interaktiv · die Schildkröte lassen",
  turtlePreset: "Vorlage",
  turtleDepth: "Tiefe",
  turtleAxiom: "Axiom",
  turtleRules: "Regeln",
  turtleAngle: "Winkel",
};

// ---------------- Spanish ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "Sistemas L",
    tagline: "Letras que se reescriben hasta volverse plantas.",
    intro:
      "Un sistema L es una gramática diminuta: una cadena inicial, un puñado de reglas de reescritura y una tortuga que convierte las letras en líneas. En pocas generaciones, tres letras se vuelven un helecho. En el Explorador editas el axioma, deslizas la profundidad y ves dibujar a la tortuga — copos de Koch, dragones, curvas de Hilbert, bosques enteros — a partir de un puñado de caracteres.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Reemplaza letras. Dibuja el resultado. Aparece un helecho.",
    cards: [
      {
        label: "01",
        title: "La idea grande",
        body: "Toma una cadena corta de letras. Toma un diccionario diminuto que diga en qué se convierte cada letra en la siguiente ronda. Aplica el diccionario a cada letra, simultáneamente. Repite. Entrega la cadena resultante a una tortuga que sabe dibujar — F significa avanzar, + girar a la izquierda, − girar a la derecha. En pocas rondas dibuja helechos, corales, rayos y árboles.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Las algas de Lindenmayer: axioma A, reglas A → AB y B → A. Tras 0 pasos: A. Tras 1: AB. Luego ABA, ABAAB, ABAABABA, y en el paso 5 la cadena es ABAABABAABAAB — trece letras. Las longitudes 1, 2, 3, 5, 8, 13 son la sucesión de Fibonacci: un patrón botánico escondido en pura reescritura.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Aristid Lindenmayer era un biólogo húngaro en Utrecht que quería un lenguaje formal para describir el crecimiento de las plantas. Publicó el formalismo en 1968 para modelar el desarrollo célula a célula de las algas. Hoy la misma idea hace crecer los árboles de tu videojuego favorito, los helechos de las películas animadas y las ciudades procedurales de la demoescena. Una gramática para células se volvió una gramática para mundos.",
      },
    ],
    tryIt:
      "Debajo: avanza la reescritura tú mismo, luego deja que una tortuga dibuje el resultado.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La regla de reescritura",
      title: "Alfabeto, axioma, reescritura paralela",
      body: "Un sistema L tiene tres piezas. Un alfabeto de símbolos. Un axioma — la cadena inicial. Un conjunto de reglas de producción, una por símbolo, que dicen en qué se convierte cada símbolo en la generación siguiente. El truco definitorio es el paralelismo: en cada paso todos los símbolos se reescriben a la vez, igual que en una hoja joven todas las células se dividen a la vez. Esa única decisión de diseño separa al sistema L de una gramática de Chomsky, donde se reescribe un símbolo cada vez. El paralelismo te da crecimiento.",
    },
    {
      pretitle: "Sección 02 · La interpretación de la tortuga",
      title: "F, +, −, [, ] — una pluma con memoria",
      body: "Las letras solas son texto. La geometría aparece cuando entregas la cadena a una tortuga. F significa avanzar una unidad. + gira el rumbo a la izquierda por un ángulo fijo (a menudo 25°, 60°, 90°). − gira a la derecha el mismo ángulo. Dos símbolos más le dan memoria a la tortuga: [ apila su posición y rumbo actuales, ] los recupera. Con solo apilar y desapilar, una cadena unidimensional se ramifica de pronto — los pares de corchetes se vuelven tallos laterales y ramitas. Los símbolos fuera del alfabeto de dibujo (X, Y, A, B…) son variables mudas: llevan información a través de las reescrituras, pero la tortuga las ignora en el papel.",
    },
    {
      pretitle: "Sección 03 · Sistemas L famosos",
      title: "Koch, Sierpiński, dragón, Hilbert, helecho",
      body: "Cuatro reglas, cuatro organismos completamente distintos. Copo de Koch: axioma F++F++F, regla F → F−F++F−F, ángulo 60°. Punta de flecha de Sierpiński: A → B−A−B, B → A+B+A, ángulo 60°, alternando paridad. Dragón de Heighway: axioma FX, reglas X → X+YF+, Y → −FX−Y, ángulo 90° — doce reescrituras y cae una tira de papel doblada. Curva de Hilbert: A → +BF−AFA−FB+, B → −AF+BFB+FA−, ángulo 90°, barre cada punto de un cuadrado. Planta fractal: X → F+[[X]−X]−F[−FX]+X, F → FF, ángulo 25°, el helecho canónico con ramas laterales y puntas. La misma maquinaria, mundos distintos.",
    },
    {
      pretitle: "Sección 04 · Ramificación con corchetes",
      title: "[ apila, ] desapila — así crecen las plantas",
      body: "Las plantas reales no son curvas; se ramifican. Un sistema L obtiene ramificación gratis con dos caracteres. Cuando la tortuga lee [, guarda su posición y dirección actuales en una pila y sigue dibujando. Cuando lee ], las restaura. Todo lo dibujado entre los corchetes coincidentes se vuelve una rama lateral, y la tortuga continúa el tronco. Corchetes anidados dan ramas sobre ramas sobre ramas — del mismo modo en que las ramitas de una secuoya crecen de sus ramas, que crecen de sus brazos, que crecen de su tronco. Dos caracteres, botánica infinita.",
    },
    {
      pretitle: "Sección 05 · Estocásticos y sensibles al contexto",
      title: "Más allá del determinismo estricto",
      body: "La versión simple de arriba es libre de contexto y determinista: cada símbolo tiene exactamente una regla. Dos extensiones hacen a los sistemas L realmente potentes. Los sistemas L estocásticos dan a un símbolo varias reescrituras posibles, cada una con una probabilidad — así dos helechos de la misma gramática parecen hermanos, no clones. Los sistemas L sensibles al contexto solo permiten disparar una regla cuando un símbolo está entre vecinos específicos, que es como los biólogos modelan la señalización: una hormona en la célula madre dispara una división concreta en la hija. También hay sistemas L paramétricos, donde cada símbolo lleva parámetros continuos (longitud, ángulo, edad), y sistemas L temporizados, donde las reglas disparan a velocidades distintas. Toda la familia modela la morfogénesis real con fidelidad sorprendente.",
    },
    {
      pretitle: "Sección 06 · Biología real, gráficos reales",
      title: "De Lindenmayer 1968 a todo bosque animado",
      body: "Lindenmayer estaba modelando el crecimiento célula a célula de Anabaena catenula, un alga azul-verde filamentosa, cuando introdujo el formalismo en 1968. Lo refinó sin pausa — para el crecimiento del tabaco, para inflorescencias compuestas, para la topología de ejes ramificados. Przemyslaw Prusinkiewicz, en Calgary, convirtió la idea en una tubería funcional con su libro de 1990 «The Algorithmic Beauty of Plants», aún la referencia estándar. De ahí pasó a los gráficos por computadora: SpeedTree (usado en innumerables películas y juegos) es esencialmente un sistema L industrial; la vegetación de Pixar, los árboles de The Witcher y Horizon, los trigales de Red Dead Redemption — todos descienden de la reescritura paralela de Lindenmayer. Una gramática para células se volvió una gramática para mundos.",
    },
  ],
  closingPretitle: "Ahora hazlo crecer tú",
  closingTitle: "Tres letras. Una tortuga. Un bosque entero.",
  closingBody:
    "Edita el axioma. Añade una regla. Desliza la profundidad y mira florecer una gramática en geometría. El Explorador está a un clic.",
  ctaLabel: "→ Abrir el Explorador",
  rewriteCaption: "Interactivo · reescribe a mano",
  rewriteStep: "Paso",
  rewriteReset: "Reiniciar",
  rewritePreset: "Preajuste",
  rewriteGeneration: "Generación",
  rewriteLength: "Longitud",
  rewriteAxiom: "Axioma",
  rewriteRules: "Reglas",
  rewriteNote: "Nota",
  turtleCaption: "Interactivo · deja dibujar a la tortuga",
  turtlePreset: "Preajuste",
  turtleDepth: "Profundidad",
  turtleAxiom: "Axioma",
  turtleRules: "Reglas",
  turtleAngle: "Ángulo",
};

// ---------------- French ----------------
const fr: RichStory = {
  page: {
    pretitle: "Thème · Géométrie",
    title: "Systèmes L",
    tagline: "Des lettres qui se réécrivent en plantes.",
    intro:
      "Un système L est une grammaire minuscule : une chaîne de départ, une poignée de règles de réécriture et une tortue qui transforme les lettres en lignes. En quelques générations, trois lettres deviennent une fougère. Dans l'Explorateur tu édites l'axiome, fais glisser la profondeur et regardes la tortue dessiner — flocons de Koch, dragons, courbes de Hilbert, forêts entières — à partir d'une poignée de caractères.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Remplace des lettres. Dessine le résultat. Une fougère pousse.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Prends une courte chaîne de lettres. Prends un dictionnaire minuscule qui dit ce que devient chaque lettre au tour suivant. Applique le dictionnaire à chaque lettre, simultanément. Recommence. Donne la chaîne résultante à une tortue qui sait dessiner — F veut dire avance, + tourne à gauche, − tourne à droite. En quelques tours elle dessine des fougères, du corail, des éclairs et des arbres.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "L'algue de Lindenmayer : axiome A, règles A → AB et B → A. Après 0 pas : A. Après 1 : AB. Puis ABA, ABAAB, ABAABABA, et au pas 5 la chaîne est ABAABABAABAAB — treize lettres. Les longueurs 1, 2, 3, 5, 8, 13 sont la suite de Fibonacci : un motif botanique caché dans la pure réécriture.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "Aristid Lindenmayer était un biologiste hongrois à Utrecht qui voulait un langage formel pour décrire la croissance des plantes. Il publia le formalisme en 1968 pour modéliser le développement cellule par cellule des algues. La même idée fait pousser aujourd'hui les arbres de ton jeu vidéo préféré, les fougères des films d'animation et les villes procédurales de la demoscene. Une grammaire pour cellules est devenue une grammaire pour mondes.",
      },
    ],
    tryIt:
      "Ci-dessous : avance la réécriture à la main, puis laisse une tortue dessiner le résultat.",
  },
  sections: [
    {
      pretitle: "Section 01 · La règle de réécriture",
      title: "Alphabet, axiome, réécriture parallèle",
      body: "Un système L a trois pièces. Un alphabet de symboles. Un axiome — la chaîne de départ. Un ensemble de règles de production, une par symbole, qui disent ce que devient chaque symbole à la génération suivante. La trouvaille fondamentale, c'est le parallélisme : à chaque étape tous les symboles sont réécrits en même temps, comme dans une jeune feuille toutes les cellules se divisent en même temps. Cette seule décision de conception sépare un système L d'une grammaire de Chomsky, où l'on réécrit un symbole à la fois. Le parallélisme apporte la croissance.",
    },
    {
      pretitle: "Section 02 · L'interprétation de la tortue",
      title: "F, +, −, [, ] — un stylo avec mémoire",
      body: "Les lettres seules ne sont que du texte. La géométrie apparaît quand tu confies la chaîne à une tortue. F veut dire avance d'une unité. + tourne le cap à gauche d'un angle fixe (souvent 25°, 60°, 90°). − tourne du même angle à droite. Deux symboles supplémentaires donnent une mémoire à la tortue : [ empile sa position et son cap actuels, ] les restaure. Avec rien d'autre que empiler et dépiler, une chaîne unidimensionnelle se ramifie soudain — les paires de crochets deviennent rameaux latéraux et brindilles. Les symboles hors de l'alphabet de dessin (X, Y, A, B…) sont des variables muettes : elles transportent l'information à travers les réécritures, mais la tortue les ignore sur le papier.",
    },
    {
      pretitle: "Section 03 · Systèmes L célèbres",
      title: "Koch, Sierpiński, dragon, Hilbert, fougère",
      body: "Quatre règles, quatre organismes radicalement différents. Flocon de Koch : axiome F++F++F, règle F → F−F++F−F, angle 60°. Pointe de flèche de Sierpiński : A → B−A−B, B → A+B+A, angle 60°, parité alternée. Dragon de Heighway : axiome FX, règles X → X+YF+, Y → −FX−Y, angle 90° — douze réécritures et il en tombe une bande de papier pliée. Courbe de Hilbert : A → +BF−AFA−FB+, B → −AF+BFB+FA−, angle 90°, balaie chaque point d'un carré. Plante fractale : X → F+[[X]−X]−F[−FX]+X, F → FF, angle 25°, la fougère canonique avec branches latérales et pointes. Même machinerie, mondes différents.",
    },
    {
      pretitle: "Section 04 · Branches avec crochets",
      title: "[ empile, ] dépile — c'est ainsi que poussent les plantes",
      body: "Les vraies plantes ne sont pas des courbes : elles se ramifient. Un système L obtient la ramification gratuitement avec deux caractères. Quand la tortue lit [, elle place sa position et sa direction actuelles sur une pile, puis continue à dessiner. Quand elle lit ], elle les restaure. Tout ce qui a été dessiné entre les crochets correspondants devient une branche latérale, et la tortue reprend le tronc. Des crochets imbriqués donnent des branches sur des branches sur des branches — comme les rameaux d'un séquoia poussent sur ses branches, qui poussent sur ses maîtresses-branches, qui poussent sur son tronc. Deux caractères, une botanique infinie.",
    },
    {
      pretitle: "Section 05 · Stochastiques et contextuels",
      title: "Au-delà du déterminisme strict",
      body: "La version simple ci-dessus est hors-contexte et déterministe : chaque symbole a exactement une règle. Deux extensions rendent les systèmes L réellement puissants. Les systèmes L stochastiques donnent à un symbole plusieurs réécritures possibles, chacune avec une probabilité — deux fougères issues de la même grammaire ressemblent ainsi à des sœurs, pas à des clones. Les systèmes L contextuels n'autorisent une règle qu'à partir du moment où un symbole se trouve entre des voisins précis, ce qui est la manière dont les biologistes modélisent la signalisation : une hormone dans la cellule mère déclenche une division particulière chez la fille. Il y a aussi des systèmes L paramétriques, où chaque symbole porte des paramètres continus (longueur, angle, âge), et des systèmes L temporisés, où les règles s'allument à des vitesses différentes. Toute la famille modélise la morphogenèse réelle avec une fidélité étonnante.",
    },
    {
      pretitle: "Section 06 · Biologie réelle, graphiques réels",
      title: "De Lindenmayer 1968 à toute forêt animée",
      body: "Lindenmayer modélisait la croissance cellule par cellule d'Anabaena catenula, une algue bleu-vert filamenteuse, lorsqu'il introduisit le formalisme en 1968. Il l'a affiné sans relâche — pour la croissance du tabac, pour les inflorescences composées, pour la topologie des axes ramifiés. Przemyslaw Prusinkiewicz, à Calgary, a transformé l'idée en une chaîne de production opérationnelle avec son livre de 1990 « The Algorithmic Beauty of Plants », encore la référence. De là, elle a fui vers l'image de synthèse : SpeedTree (utilisé dans d'innombrables films et jeux) est un système L industriel ; la végétation de Pixar, les arbres de The Witcher et de Horizon, les champs de blé de Red Dead Redemption — tous descendent de la réécriture parallèle de Lindenmayer. Une grammaire pour cellules est devenue une grammaire pour mondes.",
    },
  ],
  closingPretitle: "À toi de faire pousser",
  closingTitle: "Trois lettres. Une tortue. Une forêt entière.",
  closingBody:
    "Édite l'axiome. Ajoute une règle. Glisse la profondeur et regarde une grammaire fleurir en géométrie. L'Explorateur est à un clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  rewriteCaption: "Interactif · réécris à la main",
  rewriteStep: "Étape",
  rewriteReset: "Réinitialiser",
  rewritePreset: "Préréglage",
  rewriteGeneration: "Génération",
  rewriteLength: "Longueur",
  rewriteAxiom: "Axiome",
  rewriteRules: "Règles",
  rewriteNote: "Note",
  turtleCaption: "Interactif · laisse dessiner la tortue",
  turtlePreset: "Préréglage",
  turtleDepth: "Profondeur",
  turtleAxiom: "Axiome",
  turtleRules: "Règles",
  turtleAngle: "Angle",
};

// ---------------- Italian ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Sistemi L",
    tagline: "Lettere che si riscrivono in piante.",
    intro:
      "Un sistema L è una grammatica minuscola: una stringa di partenza, una manciata di regole di riscrittura e una tartaruga che trasforma le lettere in linee. In poche generazioni tre lettere diventano una felce. Nell'Esploratore modifichi l'assioma, fai scorrere la profondità e guardi la tartaruga disegnare — fiocchi di Koch, draghi, curve di Hilbert, foreste intere — a partire da una manciata di caratteri.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Sostituisci lettere. Disegna il risultato. Spunta una felce.",
    cards: [
      {
        label: "01",
        title: "L'idea grande",
        body: "Prendi una stringa breve di lettere. Prendi un dizionario minuscolo che dica in cosa diventa ogni lettera al turno successivo. Applica il dizionario a ogni lettera, simultaneamente. Ripeti. Passa la stringa risultante a una tartaruga che sa disegnare — F vuol dire avanza, + gira a sinistra, − gira a destra. In pochi turni disegna felci, coralli, fulmini e alberi.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "L'alga di Lindenmayer: assioma A, regole A → AB e B → A. Dopo 0 passi: A. Dopo 1: AB. Poi ABA, ABAAB, ABAABABA, e al passo 5 la stringa è ABAABABAABAAB — tredici lettere. Le lunghezze 1, 2, 3, 5, 8, 13 sono la successione di Fibonacci: uno schema botanico nascosto nella pura riscrittura.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Aristid Lindenmayer era un biologo ungherese a Utrecht che voleva un linguaggio formale per la crescita delle piante. Pubblicò il formalismo nel 1968 per modellare lo sviluppo cellula per cellula delle alghe. La stessa idea oggi fa crescere gli alberi del tuo videogioco preferito, le felci dei film d'animazione e le città procedurali della demoscene. Una grammatica per cellule è diventata una grammatica per mondi.",
      },
    ],
    tryIt:
      "Sotto: avanza la riscrittura a mano, poi lascia che una tartaruga disegni il risultato.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La regola di riscrittura",
      title: "Alfabeto, assioma, riscrittura parallela",
      body: "Un sistema L ha tre pezzi. Un alfabeto di simboli. Un assioma — la stringa di partenza. Un insieme di regole di produzione, una per simbolo, che dicono in cosa diventa ogni simbolo nella generazione successiva. Il colpo di genio è il parallelismo: a ogni passo tutti i simboli vengono riscritti insieme, come in una foglia giovane tutte le cellule si dividono insieme. Questa unica scelta di progetto separa un sistema L da una grammatica di Chomsky, dove si riscrive un simbolo per volta. Il parallelismo dà crescita.",
    },
    {
      pretitle: "Sezione 02 · L'interpretazione della tartaruga",
      title: "F, +, −, [, ] — una penna con memoria",
      body: "Le lettere da sole sono solo testo. La geometria appare quando consegni la stringa a una tartaruga. F vuol dire avanza di un'unità. + ruota la direzione a sinistra di un angolo fisso (spesso 25°, 60°, 90°). − ruota dello stesso angolo a destra. Due simboli in più danno memoria alla tartaruga: [ mette la posizione e direzione attuali su una pila, ] le ripristina. Con solo push e pop, una stringa unidimensionale si ramifica all'improvviso — le coppie di parentesi diventano rami laterali e ramoscelli. I simboli fuori dall'alfabeto di disegno (X, Y, A, B…) sono variabili mute: trasportano informazione attraverso le riscritture, ma la tartaruga le ignora sul foglio.",
    },
    {
      pretitle: "Sezione 03 · Sistemi L famosi",
      title: "Koch, Sierpiński, drago, Hilbert, felce",
      body: "Quattro regole, quattro organismi completamente diversi. Fiocco di Koch: assioma F++F++F, regola F → F−F++F−F, angolo 60°. Punta di freccia di Sierpiński: A → B−A−B, B → A+B+A, angolo 60°, con parità alternata. Drago di Heighway: assioma FX, regole X → X+YF+, Y → −FX−Y, angolo 90° — dodici riscritture e cade una striscia di carta piegata. Curva di Hilbert: A → +BF−AFA−FB+, B → −AF+BFB+FA−, angolo 90°, spazza ogni punto di un quadrato. Pianta frattale: X → F+[[X]−X]−F[−FX]+X, F → FF, angolo 25°, la felce canonica con rami laterali e punte. Stessa macchina, mondi diversi.",
    },
    {
      pretitle: "Sezione 04 · Ramificazione con parentesi",
      title: "[ impila, ] disimpila — così crescono le piante",
      body: "Le piante vere non sono curve: si ramificano. Un sistema L ottiene la ramificazione gratis con due caratteri. Quando la tartaruga legge [, salva la sua posizione e direzione attuali su una pila e continua a disegnare. Quando legge ], le ripristina. Tutto ciò che è stato disegnato tra le parentesi corrispondenti diventa un ramo laterale, e la tartaruga riprende il tronco. Parentesi annidate danno rami su rami su rami — come i ramoscelli di una sequoia crescono dai suoi rami, che crescono dai suoi braccioli, che crescono dal suo tronco. Due caratteri, botanica infinita.",
    },
    {
      pretitle: "Sezione 05 · Stocastici e sensibili al contesto",
      title: "Oltre il determinismo stretto",
      body: "La versione semplice qui sopra è libera dal contesto e deterministica: ogni simbolo ha esattamente una regola. Due estensioni rendono i sistemi L davvero potenti. I sistemi L stocastici danno a un simbolo più riscritture possibili, ciascuna con una probabilità — così due felci dalla stessa grammatica sembrano sorelle, non cloni. I sistemi L sensibili al contesto permettono a una regola di scattare solo quando un simbolo si trova fra vicini specifici, che è il modo in cui i biologi modellano la segnalazione: un ormone nella cellula madre innesca una particolare divisione nella figlia. Esistono anche sistemi L parametrici, dove ogni simbolo porta parametri continui (lunghezza, angolo, età), e sistemi L temporizzati, dove le regole scattano a velocità diverse. L'intera famiglia modella la morfogenesi reale con fedeltà sorprendente.",
    },
    {
      pretitle: "Sezione 06 · Biologia vera, grafica vera",
      title: "Da Lindenmayer 1968 a ogni foresta animata",
      body: "Lindenmayer stava modellando la crescita cellula per cellula di Anabaena catenula, un'alga azzurra filamentosa, quando introdusse il formalismo nel 1968. Continuò a raffinarlo — per la crescita del tabacco, per le infiorescenze composte, per la topologia degli assi ramificati. Przemyslaw Prusinkiewicz, a Calgary, trasformò l'idea in una pipeline funzionante con il libro del 1990 «The Algorithmic Beauty of Plants», ancora oggi il riferimento standard. Da lì è filtrata nella computer grafica: SpeedTree (usato in innumerevoli film e giochi) è essenzialmente un sistema L industriale; la vegetazione di Pixar, gli alberi di The Witcher e Horizon, i campi di grano di Red Dead Redemption — tutti discendono dalla riscrittura parallela di Lindenmayer. Una grammatica per cellule è diventata una grammatica per mondi.",
    },
  ],
  closingPretitle: "Ora coltivala tu",
  closingTitle: "Tre lettere. Una tartaruga. Una foresta intera.",
  closingBody:
    "Modifica l'assioma. Aggiungi una regola. Sposta la profondità e guarda una grammatica sbocciare in geometria. L'Esploratore è a un clic.",
  ctaLabel: "→ Apri l'Esploratore",
  rewriteCaption: "Interattivo · riscrivi a mano",
  rewriteStep: "Passo",
  rewriteReset: "Reimposta",
  rewritePreset: "Preimpostato",
  rewriteGeneration: "Generazione",
  rewriteLength: "Lunghezza",
  rewriteAxiom: "Assioma",
  rewriteRules: "Regole",
  rewriteNote: "Nota",
  turtleCaption: "Interattivo · lascia disegnare la tartaruga",
  turtlePreset: "Preimpostato",
  turtleDepth: "Profondità",
  turtleAxiom: "Assioma",
  turtleRules: "Regole",
  turtleAngle: "Angolo",
};

// ---------------- Portuguese ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tópico · Geometria",
    title: "Sistemas L",
    tagline: "Letras que se reescrevem em plantas.",
    intro:
      "Um sistema L é uma gramática minúscula: uma cadeia inicial, um punhado de regras de reescrita e uma tartaruga que transforma as letras em linhas. Em poucas gerações, três letras viram uma samambaia. No Explorador editas o axioma, deslizas a profundidade e vês a tartaruga desenhar — flocos de Koch, dragões, curvas de Hilbert, florestas inteiras — a partir de um punhado de caracteres.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Substitui letras. Desenha o resultado. Surge uma samambaia.",
    cards: [
      {
        label: "01",
        title: "A ideia principal",
        body: "Pega uma cadeia curta de letras. Pega um dicionário minúsculo que diga em que cada letra se transforma na ronda seguinte. Aplica o dicionário a cada letra, simultaneamente. Repete. Entrega a cadeia resultante a uma tartaruga que sabe desenhar — F significa avançar, + virar à esquerda, − virar à direita. Em poucas rondas ela desenha samambaias, corais, raios e árvores.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "A alga de Lindenmayer: axioma A, regras A → AB e B → A. Após 0 passos: A. Após 1: AB. Depois ABA, ABAAB, ABAABABA, e no passo 5 a cadeia é ABAABABAABAAB — treze letras. Os comprimentos 1, 2, 3, 5, 8, 13 são a sequência de Fibonacci: um padrão botânico escondido na pura reescrita.",
      },
      {
        label: "03",
        title: "Por que importa",
        body: "Aristid Lindenmayer era um biólogo húngaro em Utrecht que queria uma linguagem formal para o crescimento das plantas. Publicou o formalismo em 1968 para modelar o desenvolvimento célula a célula das algas. A mesma ideia hoje faz crescer as árvores do teu videojogo preferido, as samambaias dos filmes de animação e as cidades procedurais da demoscene. Uma gramática para células tornou-se uma gramática para mundos.",
      },
    ],
    tryIt: "Em baixo: avança a reescrita à mão, depois deixa uma tartaruga desenhar o resultado.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A regra de reescrita",
      title: "Alfabeto, axioma, reescrita paralela",
      body: "Um sistema L tem três peças. Um alfabeto de símbolos. Um axioma — a cadeia inicial. Um conjunto de regras de produção, uma por símbolo, que dizem em que cada símbolo se transforma na geração seguinte. O truque definidor é o paralelismo: em cada passo todos os símbolos são reescritos ao mesmo tempo, como numa folha jovem todas as células se dividem ao mesmo tempo. Essa única decisão de projeto separa um sistema L de uma gramática de Chomsky, onde se reescreve um símbolo de cada vez. O paralelismo dá-te crescimento.",
    },
    {
      pretitle: "Secção 02 · A interpretação da tartaruga",
      title: "F, +, −, [, ] — uma caneta com memória",
      body: "Letras sozinhas são apenas texto. A geometria surge quando entregas a cadeia a uma tartaruga. F significa avançar uma unidade. + roda o rumo para a esquerda num ângulo fixo (frequentemente 25°, 60°, 90°). − roda o mesmo ângulo para a direita. Mais dois símbolos dão memória à tartaruga: [ empilha a sua posição e rumo atuais, ] repõe-nos. Só com empilhar e desempilhar, uma cadeia unidimensional ramifica-se de repente — pares de colchetes tornam-se hastes laterais e ramos. Os símbolos fora do alfabeto de desenho (X, Y, A, B…) são variáveis mudas: transportam informação ao longo das reescritas, mas a tartaruga ignora-os no papel.",
    },
    {
      pretitle: "Secção 03 · Sistemas L famosos",
      title: "Koch, Sierpiński, dragão, Hilbert, samambaia",
      body: "Quatro regras, quatro organismos completamente diferentes. Floco de Koch: axioma F++F++F, regra F → F−F++F−F, ângulo 60°. Ponta de seta de Sierpiński: A → B−A−B, B → A+B+A, ângulo 60°, com paridade alternada. Dragão de Heighway: axioma FX, regras X → X+YF+, Y → −FX−Y, ângulo 90° — doze reescritas e cai uma tira de papel dobrada. Curva de Hilbert: A → +BF−AFA−FB+, B → −AF+BFB+FA−, ângulo 90°, varre cada ponto de um quadrado. Planta fractal: X → F+[[X]−X]−F[−FX]+X, F → FF, ângulo 25°, a samambaia canónica com ramos laterais e pontas. Mesma maquinaria, mundos diferentes.",
    },
    {
      pretitle: "Secção 04 · Ramificação com colchetes",
      title: "[ empilha, ] desempilha — é assim que as plantas crescem",
      body: "Plantas reais não são curvas; ramificam-se. Um sistema L obtém ramificação grátis com dois caracteres. Quando a tartaruga lê [, guarda a sua posição e direção atuais numa pilha e continua a desenhar. Quando lê ], repõe-nas. Tudo o que foi desenhado entre os colchetes correspondentes torna-se um ramo lateral, e a tartaruga retoma o tronco. Colchetes aninhados dão ramos sobre ramos sobre ramos — tal como os ramos de uma sequoia crescem dos seus ramos maiores, que crescem dos seus braços, que crescem do seu tronco. Dois caracteres, botânica infinita.",
    },
    {
      pretitle: "Secção 05 · Estocásticos e sensíveis ao contexto",
      title: "Para além do determinismo estrito",
      body: "A versão simples acima é livre de contexto e determinística: cada símbolo tem exatamente uma regra. Duas extensões tornam os sistemas L verdadeiramente potentes. Os sistemas L estocásticos dão a um símbolo várias reescritas possíveis, cada uma com uma probabilidade — assim duas samambaias da mesma gramática parecem irmãs, não clones. Os sistemas L sensíveis ao contexto só permitem que uma regra dispare quando um símbolo se encontra entre vizinhos específicos, que é como os biólogos modelam a sinalização: uma hormona na célula-mãe dispara uma divisão particular na filha. Existem ainda sistemas L paramétricos, onde cada símbolo carrega parâmetros contínuos (comprimento, ângulo, idade), e sistemas L temporizados, onde regras disparam a velocidades distintas. Toda a família modela a morfogénese real com fidelidade surpreendente.",
    },
    {
      pretitle: "Secção 06 · Biologia real, gráficos reais",
      title: "De Lindenmayer 1968 a toda floresta animada",
      body: "Lindenmayer estava a modelar o crescimento célula a célula de Anabaena catenula, uma alga azul-verde filamentosa, quando introduziu o formalismo em 1968. Continuou a refiná-lo — para o crescimento do tabaco, para inflorescências compostas, para a topologia de eixos ramificados. Przemyslaw Prusinkiewicz, em Calgary, transformou a ideia numa pipeline funcional com o livro de 1990 «The Algorithmic Beauty of Plants», ainda a referência padrão. Dali escorreu para a computação gráfica: SpeedTree (usado em incontáveis filmes e jogos) é essencialmente um sistema L industrial; a vegetação da Pixar, as árvores de The Witcher e Horizon, os trigais de Red Dead Redemption — todos descendem da reescrita paralela de Lindenmayer. Uma gramática para células tornou-se uma gramática para mundos.",
    },
  ],
  closingPretitle: "Agora faz crescer a tua",
  closingTitle: "Três letras. Uma tartaruga. Uma floresta inteira.",
  closingBody:
    "Edita o axioma. Adiciona uma regra. Desliza a profundidade e vê uma gramática florir em geometria. O Explorador está a um clique.",
  ctaLabel: "→ Abrir o Explorador",
  rewriteCaption: "Interativo · reescreve à mão",
  rewriteStep: "Passo",
  rewriteReset: "Repor",
  rewritePreset: "Predefinição",
  rewriteGeneration: "Geração",
  rewriteLength: "Comprimento",
  rewriteAxiom: "Axioma",
  rewriteRules: "Regras",
  rewriteNote: "Nota",
  turtleCaption: "Interativo · deixa a tartaruga desenhar",
  turtlePreset: "Predefinição",
  turtleDepth: "Profundidade",
  turtleAxiom: "Axioma",
  turtleRules: "Regras",
  turtleAngle: "Ângulo",
};

// ---------------- Swedish ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "L-system",
    tagline: "Bokstäver som skriver om sig själva till växter.",
    intro:
      "Ett L-system är en pytteliten grammatik: en startsträng, en handfull omskrivningsregler och en sköldpadda som gör om bokstäverna till linjer. På några generationer blir tre bokstäver en ormbunke. I Utforskaren redigerar du axiomet, drar djupet och ser sköldpaddan rita — Koch-flingor, drakar, Hilbert-kurvor, hela skogar — ur en handfull tecken.",
    ctaInteractive: "→ Öppna Utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Byt ut bokstäver. Rita resultatet. En ormbunke växer fram.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Ta en kort sträng bokstäver. Ta en liten ordbok som säger vad varje bokstav blir nästa runda. Använd ordboken på varje bokstav samtidigt. Upprepa. Lämna den resulterande strängen till en sköldpadda som kan rita — F betyder framåt, + svänger vänster, − svänger höger. Efter några rundor ritar den ormbunkar, koraller, blixtar och träd.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Lindenmayers alg: axiom A, regler A → AB och B → A. Efter 0 steg: A. Efter 1: AB. Sedan ABA, ABAAB, ABAABABA, och vid steg 5 är strängen ABAABABAABAAB — tretton bokstäver. Längderna 1, 2, 3, 5, 8, 13 är Fibonacci-följden: ett botaniskt mönster som gömmer sig i ren omskrivning.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Aristid Lindenmayer var en ungersk biolog i Utrecht som ville ha ett formellt språk för hur växter växer. Han publicerade formalismen 1968 för att modellera algers cellvisa utveckling. Samma idé låter idag träden i ditt favoritspel växa, ormbunkarna i animerade filmer och de procedurella städerna i demoscenen. En grammatik för celler blev en grammatik för världar.",
      },
    ],
    tryIt: "Nedan: stega omskrivningen för hand, låt sedan en sköldpadda rita resultatet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Omskrivningsregeln",
      title: "Alfabet, axiom, parallell omskrivning",
      body: "Ett L-system har tre delar. Ett alfabet av symboler. Ett axiom — startsträngen. En uppsättning produktionsregler, en per symbol, som säger vad varje symbol blir nästa generation. Den avgörande knepet är parallellitet: i varje steg skrivs alla symboler om samtidigt, precis som alla celler i ett ungt blad delar sig samtidigt. Det enda designbeslutet skiljer ett L-system från en Chomsky-grammatik, där en symbol skrivs om åt gången. Parallellitet ger tillväxt.",
    },
    {
      pretitle: "Avsnitt 02 · Sköldpaddans tolkning",
      title: "F, +, −, [, ] — en penna med minne",
      body: "Bokstäver för sig själva är bara text. Geometrin uppstår när du ger strängen till en sköldpadda. F betyder gå framåt en enhet. + vrider kursen till vänster med en fast vinkel (ofta 25°, 60°, 90°). − vrider åt höger med samma vinkel. Två symboler till ger sköldpaddan minne: [ lägger nuvarande position och kurs på en stack, ] hämtar tillbaka dem. Med bara push och pop förgrenas en endimensionell sträng plötsligt — klammerparen blir sidogrenar och kvistar. Symboler utanför ritalfabetet (X, Y, A, B…) är tysta variabler: de bär information genom omskrivningarna men sköldpaddan ignorerar dem på pappret.",
    },
    {
      pretitle: "Avsnitt 03 · Berömda L-system",
      title: "Koch, Sierpiński, drake, Hilbert, ormbunke",
      body: "Fyra regler, fyra helt olika organismer. Koch-snöflingan: axiom F++F++F, regel F → F−F++F−F, vinkel 60°. Sierpińskis pilspets: A → B−A−B, B → A+B+A, vinkel 60°, med alternerande paritet. Heighways drake: axiom FX, regler X → X+YF+, Y → −FX−Y, vinkel 90° — tolv omskrivningar och ut faller en vikt pappersremsa. Hilbert-kurvan: A → +BF−AFA−FB+, B → −AF+BFB+FA−, vinkel 90°, sveper varje punkt i en kvadrat. Fraktal växt: X → F+[[X]−X]−F[−FX]+X, F → FF, vinkel 25°, den kanoniska ormbunken med sidogrenar och spetsar. Samma maskineri, helt olika världar.",
    },
    {
      pretitle: "Avsnitt 04 · Förgrening med klammer",
      title: "[ lägger på, ] tar av — så växer växter",
      body: "Riktiga växter är inga kurvor; de förgrenar sig. Ett L-system får förgrening gratis från två tecken. När sköldpaddan läser [ sparar den sin nuvarande position och riktning på en stack och ritar vidare. När den läser ] återställer den dem. Allt som ritats mellan de matchande klammerna blir en sidogren och sköldpaddan fortsätter sedan med stammen. Nästlade klammer ger grenar på grenar på grenar — på samma sätt som en sequoias kvistar växer ur dess grenar, som växer ur dess huvudgrenar, som växer ur dess stam. Två tecken, oändlig botanik.",
    },
    {
      pretitle: "Avsnitt 05 · Stokastiska och kontextkänsliga",
      title: "Bortom strikt determinism",
      body: "Den enkla versionen ovan är kontextfri och deterministisk: varje symbol har exakt en regel. Två utvidgningar gör L-system riktigt kraftfulla. Stokastiska L-system ger en symbol flera möjliga omskrivningar, var och en med en sannolikhet — så två ormbunkar från samma grammatik ser ut som syskon, inte kloner. Kontextkänsliga L-system låter en regel avfyras bara när en symbol står mellan specifika grannar, vilket är hur biologer modellerar signalering: ett hormon i modercellen utlöser en viss delning hos dottern. Det finns också parametriska L-system, där varje symbol bär kontinuerliga parametrar (längd, vinkel, ålder), och tidsstyrda L-system där regler avfyras i olika hastigheter. Hela familjen modellerar verklig morfogenes med slående trohet.",
    },
    {
      pretitle: "Avsnitt 06 · Riktig biologi, riktig grafik",
      title: "Från Lindenmayer 1968 till varje animerad skog",
      body: "Lindenmayer modellerade den cellvisa tillväxten hos Anabaena catenula, en trådformig blågrönalg, när han 1968 introducerade formalismen. Han fortsatte förfina den — för tobakstillväxt, för sammansatta blomställningar, för förgrenade axlars topologi. Przemyslaw Prusinkiewicz i Calgary gjorde idén till en fungerande pipeline med 1990 års bok «The Algorithmic Beauty of Plants», fortfarande standardreferensen. Därifrån sipprade den in i datorgrafiken: SpeedTree (använt i otaliga filmer och spel) är i grunden ett industriellt L-system; vegetationen hos Pixar, träden i The Witcher och Horizon, vetefälten i Red Dead Redemption — alla härstammar från Lindenmayers parallella omskrivning. En grammatik för celler blev en grammatik för världar.",
    },
  ],
  closingPretitle: "Odla din egen nu",
  closingTitle: "Tre bokstäver. En sköldpadda. En hel skog.",
  closingBody:
    "Redigera axiomet. Lägg till en regel. Dra djupet och se en grammatik blomma ut i geometri. Utforskaren är ett klick bort.",
  ctaLabel: "→ Öppna Utforskaren",
  rewriteCaption: "Interaktivt · skriv om för hand",
  rewriteStep: "Steg",
  rewriteReset: "Nollställ",
  rewritePreset: "Förval",
  rewriteGeneration: "Generation",
  rewriteLength: "Längd",
  rewriteAxiom: "Axiom",
  rewriteRules: "Regler",
  rewriteNote: "Not",
  turtleCaption: "Interaktivt · låt sköldpaddan rita",
  turtlePreset: "Förval",
  turtleDepth: "Djup",
  turtleAxiom: "Axiom",
  turtleRules: "Regler",
  turtleAngle: "Vinkel",
};

// ---------------- Norwegian ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "L-systemer",
    tagline: "Bokstaver som skriver seg om til planter.",
    intro:
      "Et L-system er en bitteliten grammatikk: en startstreng, en håndfull omskrivingsregler og en skilpadde som gjør bokstavene om til linjer. På få generasjoner blir tre bokstaver en bregne. I Utforskeren redigerer du aksiomet, drar dybden og ser skilpadden tegne — Koch-flak, drager, Hilbert-kurver, hele skoger — ut av en håndfull tegn.",
    ctaInteractive: "→ Åpne Utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "Bytt ut bokstaver. Tegn resultatet. En bregne vokser fram.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "Ta en kort streng bokstaver. Ta en liten ordbok som sier hva hver bokstav blir i neste runde. Bruk ordboken på hver bokstav samtidig. Gjenta. Gi den resulterende strengen til en skilpadde som kan tegne — F betyr fremover, + svinger venstre, − svinger høyre. Etter noen runder tegner den bregner, koraller, lyn og trær.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Lindenmayers alge: aksiom A, regler A → AB og B → A. Etter 0 skritt: A. Etter 1: AB. Så ABA, ABAAB, ABAABABA, og ved skritt 5 er strengen ABAABABAABAAB — tretten bokstaver. Lengdene 1, 2, 3, 5, 8, 13 er Fibonacci-rekken: et botanisk mønster som gjemmer seg i ren omskriving.",
      },
      {
        label: "03",
        title: "Hvorfor det er viktig",
        body: "Aristid Lindenmayer var en ungarsk biolog i Utrecht som ville ha et formelt språk for hvordan planter vokser. I 1968 publiserte han formalismen for å modellere algers cellevise utvikling. Samme idé får i dag trærne i favorittspillet ditt til å vokse, bregnene i animasjonsfilm og de prosedurale byene i demoscenen. En grammatikk for celler ble en grammatikk for verdener.",
      },
    ],
    tryIt: "Under: gå omskrivingen for hånd, la så en skilpadde tegne resultatet.",
  },
  sections: [
    {
      pretitle: "Del 01 · Omskrivingsregelen",
      title: "Alfabet, aksiom, parallell omskriving",
      body: "Et L-system har tre deler. Et alfabet av symboler. Et aksiom — startstrengen. Et sett produksjonsregler, én per symbol, som sier hva hvert symbol blir i neste generasjon. Den definerende vrien er parallellitet: i hvert skritt skrives alle symboler om samtidig, slik alle cellene i et ungt blad deler seg samtidig. Akkurat den ene designvalget skiller et L-system fra en Chomsky-grammatikk, der ett symbol skrives om av gangen. Parallellitet gir vekst.",
    },
    {
      pretitle: "Del 02 · Skilpaddetolkningen",
      title: "F, +, −, [, ] — en penn med hukommelse",
      body: "Bokstaver alene er bare tekst. Geometrien dukker opp når du gir strengen til en skilpadde. F betyr gå én enhet fram. + dreier kursen til venstre med en fast vinkel (ofte 25°, 60°, 90°). − dreier samme vinkel til høyre. To symboler til gir skilpadden hukommelse: [ legger nåværende posisjon og kurs på en stabel, ] henter dem tilbake. Bare med push og pop forgrener en endimensjonal streng seg plutselig — parentespar blir sidekvister og småkvister. Symboler utenfor tegnealfabetet (X, Y, A, B…) er stumme variabler: de bærer informasjon gjennom omskrivingene, men skilpadden overser dem på papiret.",
    },
    {
      pretitle: "Del 03 · Berømte L-systemer",
      title: "Koch, Sierpiński, drage, Hilbert, bregne",
      body: "Fire regler, fire helt forskjellige organismer. Koch-snøfnugget: aksiom F++F++F, regel F → F−F++F−F, vinkel 60°. Sierpiński-pilspissen: A → B−A−B, B → A+B+A, vinkel 60°, med vekslende paritet. Heighways drage: aksiom FX, regler X → X+YF+, Y → −FX−Y, vinkel 90° — tolv omskrivinger og ut faller en brettet papirstrimmel. Hilbert-kurven: A → +BF−AFA−FB+, B → −AF+BFB+FA−, vinkel 90°, sveiper hvert punkt i et kvadrat. Fraktalplante: X → F+[[X]−X]−F[−FX]+X, F → FF, vinkel 25°, den kanoniske bregnen med sidekvister og topper. Samme maskineri, ulike verdener.",
    },
    {
      pretitle: "Del 04 · Forgrening med parenteser",
      title: "[ legger på, ] tar av — slik vokser planter",
      body: "Ekte planter er ikke kurver; de forgrener seg. Et L-system får forgrening gratis fra to tegn. Når skilpadden leser [ lagrer den nåværende posisjon og retning på en stabel og fortsetter å tegne. Når den leser ] henter den dem tilbake. Alt som ble tegnet mellom de matchende parentesene blir en sidegren, og skilpadden fortsetter så stammen. Nøstede parenteser gir grener på grener på grener — på samme måte som en sequoia-kvist vokser fra dens grener, som vokser fra dens hovedgrener, som vokser fra stammen. To tegn, uendelig botanikk.",
    },
    {
      pretitle: "Del 05 · Stokastiske og kontekstsensitive",
      title: "Forbi streng determinisme",
      body: "Den enkle versjonen over er kontekstfri og deterministisk: hvert symbol har nøyaktig én regel. To utvidelser gjør L-systemer virkelig kraftige. Stokastiske L-systemer gir et symbol flere mulige omskrivinger, hver med en sannsynlighet — to bregner fra samme grammatikk ser dermed ut som søsken, ikke kloner. Kontekstsensitive L-systemer lar en regel utløses bare når et symbol står mellom bestemte naboer, som er måten biologer modellerer signalering på: et hormon i morcellen utløser en bestemt deling hos dattercellen. Det finnes også parametriske L-systemer, der hvert symbol bærer kontinuerlige parametre (lengde, vinkel, alder), og tidsstyrte L-systemer der regler utløses i ulike hastigheter. Hele familien modellerer ekte morfogenese med slående troskap.",
    },
    {
      pretitle: "Del 06 · Ekte biologi, ekte grafikk",
      title: "Fra Lindenmayer 1968 til hver animerte skog",
      body: "Lindenmayer modellerte den cellevise veksten av Anabaena catenula, en trådaktig blågrønnalge, da han i 1968 introduserte formalismen. Han fortsatte å foredle den — for tobakkvekst, for sammensatte blomsterstander, for forgrenede aksers topologi. Przemyslaw Prusinkiewicz i Calgary gjorde idéen til en fungerende pipeline med 1990-boken «The Algorithmic Beauty of Plants», fortsatt standardreferansen. Derfra siver den inn i dataggrafikken: SpeedTree (brukt i utallige filmer og spill) er i hovedsak et industrielt L-system; vegetasjonen hos Pixar, trærne i The Witcher og Horizon, hveteåkrene i Red Dead Redemption — alle stammer fra Lindenmayers parallelle omskriving. En grammatikk for celler ble en grammatikk for verdener.",
    },
  ],
  closingPretitle: "Få din egen til å vokse nå",
  closingTitle: "Tre bokstaver. En skilpadde. En hel skog.",
  closingBody:
    "Rediger aksiomet. Legg til en regel. Dra dybden og se en grammatikk blomstre til geometri. Utforskeren er ett klikk unna.",
  ctaLabel: "→ Åpne Utforskeren",
  rewriteCaption: "Interaktivt · skriv om for hånd",
  rewriteStep: "Steg",
  rewriteReset: "Nullstill",
  rewritePreset: "Forhåndsvalg",
  rewriteGeneration: "Generasjon",
  rewriteLength: "Lengde",
  rewriteAxiom: "Aksiom",
  rewriteRules: "Regler",
  rewriteNote: "Notat",
  turtleCaption: "Interaktivt · la skilpadden tegne",
  turtlePreset: "Forhåndsvalg",
  turtleDepth: "Dybde",
  turtleAxiom: "Aksiom",
  turtleRules: "Regler",
  turtleAngle: "Vinkel",
};

const RICH_STORY: Record<Locale, RichStory> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  sv,
  no,
};

// --------------------------------------------------------------------------

export default function LsystemStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale] ?? RICH_STORY.en;

  return (
    <StoryPageShell
      page={story.page}
      ctaHref="/lsystem/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="X → F+[[X]−X]−F[−FX]+X"
      formulaLatex={"X \\rightarrow F+[[X]-X]-F[-FX]+X"}
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
                <p>{card.body}</p>
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — Rewriting rule */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 — Rewrite stepper */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <LsystemRewriteStepper
            caption={story.rewriteCaption}
            stepLabel={story.rewriteStep}
            resetLabel={story.rewriteReset}
            presetLabel={story.rewritePreset}
            generationLabel={story.rewriteGeneration}
            lengthLabel={story.rewriteLength}
            axiomLabel={story.rewriteAxiom}
            rulesLabel={story.rewriteRules}
            noteLabel={story.rewriteNote}
          />
        </Reveal>
      </section>

      {/* Section 02 — Turtle interpretation */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Famous L-systems */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 — Turtle renderer */}
      <section className="mx-auto mb-32 max-w-5xl">
        <Reveal>
          <LsystemTurtleRenderer
            caption={story.turtleCaption}
            presetLabel={story.turtlePreset}
            depthLabel={story.turtleDepth}
            axiomLabel={story.turtleAxiom}
            rulesLabel={story.turtleRules}
            angleLabel={story.turtleAngle}
          />
        </Reveal>
      </section>

      {/* Section 04 — Branching with brackets */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 05 — Stochastic / context-sensitive */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — Real biology, modern graphics */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[5].pretitle}
          title={story.sections[5].title}
          body={story.sections[5].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Lindenmayer · 1968
            </div>
            <div className="math-italic text-4xl text-ink-100 md:text-5xl">A → AB, B → A</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              The two-line algae grammar that started a whole field of mathematical botany —
              published in the Journal of Theoretical Biology, 18(3): 280–315.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA — glass card matching apollonian style */}
      <Reveal>
        <section className="glass hairline mx-auto mt-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/lsystem/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
