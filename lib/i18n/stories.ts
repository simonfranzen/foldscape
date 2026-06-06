// Long-form story content for individual topic landing pages. Currently
// authored in English (full) and German (full); other locales fall back to
// the English copy until a native pass is done.

import type { Locale } from "./types";

export interface StoryPage {
  pretitle: string;
  title: string;
  tagline: string;
  intro: string;
  ctaInteractive: string;
  sections: Array<{
    pretitle: string;
    title: string;
    body: string;
  }>;
}

export interface StoriesDict {
  sectionLabels: Record<string, string>;
  pages: {
    mandelbrot: StoryPage;
    life: StoryPage;
  };
}

const en: StoriesDict = {
  sectionLabels: {
    cathedral: "Cathedral",
    atelier: "Atelier",
    resonance: "Resonance",
    story: "Story",
    explorer: "Explorer",
    sandbox: "Sandbox",
  },
  pages: {
    mandelbrot: {
      pretitle: "Topic II · Chaos",
      title: "The Mandelbrot Set",
      tagline: "Square and add. Forever.",
      intro:
        "One of the most photographed objects in mathematics is the visualisation of an absurdly simple rule. Below: what the rule is, what we are actually looking at, and a button straight into the Explorer for when you want to fly.",
      ctaInteractive: "→ Open the Explorer",
      sections: [
        {
          pretitle: "Step one · The rule",
          title: "Pick a complex number, then iterate",
          body:
            "Choose any complex number c. Start a sequence at z₀ = 0 and keep applying zₙ₊₁ = zₙ² + c. That is the entire rule. We then ask one yes/no question: does the sequence stay bounded, or does it eventually escape to infinity? The set of values of c for which the sequence stays bounded — that is the Mandelbrot set. Everything else, including the famous picture, is just a colourful answer to that question.",
        },
        {
          pretitle: "Step two · Watching the orbit",
          title: "Three points, three fates",
          body:
            "It helps to actually watch the sequence. For a c deep inside the set, the orbit tightens around a small loop and never leaves. For a c just outside, the orbit drifts outward and then explodes within a handful of steps. For a c right on the boundary, the orbit dances forever, never settling and never escaping. The three animated panels below show those three regimes side by side.",
        },
        {
          pretitle: "Step three · Why the picture is infinite",
          title: "The boundary never simplifies",
          body:
            "Once you colour each c by how quickly its orbit escapes, the boundary lights up. The astonishing fact, proven by Tan Lei and others, is that the boundary is self-similar in a deep sense — wherever you zoom, you find new tiny copies of the whole shape, surrounded by filigree that never repeats. That is why the Explorer goes down to 10¹⁰ zoom: there is genuinely something new at every scale.",
        },
        {
          pretitle: "Step four · The fixed points",
          title: "Where the math is hiding",
          body:
            "Inside the big cardioid in the centre, the iteration converges to a single fixed point. Inside each round disc attached to it, the iteration converges to a 2-cycle, then a 4-cycle, then 8 — the same period-doubling cascade as the logistic map. The Mandelbrot set is, in a precise sense, a map of where the logistic story is calm and where it goes chaotic. Two famous chaotic systems, one picture.",
        },
      ],
    },
    life: {
      pretitle: "Topic III · Computation",
      title: "Conway's Game of Life",
      tagline: "Four rules. Universes follow.",
      intro:
        "Conway published the rules in 1970 in a Scientific American column. Two pages of magazine, four lines of rule, and a community of mathematicians has spent fifty years discovering what was already inside them. The Sandbox lets you draw and run any pattern — but first, the four rules in action.",
      ctaInteractive: "→ Open the Sandbox",
      sections: [
        {
          pretitle: "Step one · The rules",
          title: "Birth, survival, death — and nothing else",
          body:
            "The grid is infinite, every cell is either alive or dead, and every cell looks at its eight neighbours. A dead cell with exactly three live neighbours becomes alive. A live cell with two or three live neighbours stays alive. Any other case — too few neighbours, too many neighbours, no neighbours — kills the cell. The four animated demos below show each rule firing on a five-by-five grid.",
        },
        {
          pretitle: "Step two · From rules to motion",
          title: "The Glider walks",
          body:
            "A pattern of five cells, the Glider, is the smallest moving thing in Life. Watch it step. After four generations it has returned to its original shape but shifted one cell diagonally. That is how movement works in a world with no concept of motion: a shape that, after a few applications of the rules, equals itself somewhere else.",
        },
        {
          pretitle: "Step three · From motion to computation",
          title: "Gliders carry information",
          body:
            "If a glider moves, it can be aimed. If it can be aimed, it can collide with other gliders. From collisions you can build AND, OR, NOT — and from those, every Boolean circuit. People have built Turing machines, Game of Life simulators, and entire programmable computers entirely out of carefully arranged gliders. The Sandbox holds the Gosper Glider Gun preset: a pattern that fires a glider every thirty generations, forever.",
        },
        {
          pretitle: "Step four · What this tells us",
          title: "Complexity does not need complex rules",
          body:
            "The deeper claim is philosophical. Life shows that elaborate structure — motion, replication, computation, even consciousness, if you believe the strong versions — can sit inside a rule small enough to write on a postcard. It is the same lesson EML offers for analysis, NAND for logic, and Rule 110 for cellular automata. A small primitive, applied with discipline, is enough.",
        },
      ],
    },
  },
};

const de: StoriesDict = {
  sectionLabels: {
    cathedral: "Kathedrale",
    atelier: "Atelier",
    resonance: "Resonanz",
    story: "Story",
    explorer: "Explorer",
    sandbox: "Sandbox",
  },
  pages: {
    mandelbrot: {
      pretitle: "Thema II · Chaos",
      title: "Die Mandelbrot-Menge",
      tagline: "Quadrieren und addieren. Immer wieder.",
      intro:
        "Eines der meistfotografierten Objekte der Mathematik ist die Visualisierung einer absurd einfachen Regel. Unten: was die Regel ist, was wir eigentlich anschauen — und ein Knopf direkt in den Explorer, wenn du fliegen willst.",
      ctaInteractive: "→ Explorer öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Regel",
          title: "Wähle eine komplexe Zahl, dann iteriere",
          body:
            "Wähle eine beliebige komplexe Zahl c. Starte eine Folge bei z₀ = 0 und wende immer wieder zₙ₊₁ = zₙ² + c an. Das ist die ganze Regel. Wir stellen dann eine einzige Ja/Nein-Frage: bleibt die Folge beschränkt — oder wandert sie irgendwann ins Unendliche? Die Menge der c, für die die Folge beschränkt bleibt, ist die Mandelbrot-Menge. Alles weitere, auch das berühmte Bild, ist nur eine bunte Antwort auf diese Frage.",
        },
        {
          pretitle: "Schritt zwei · Die Bahn beobachten",
          title: "Drei Punkte, drei Schicksale",
          body:
            "Es hilft, die Folge tatsächlich zu sehen. Für ein c tief im Inneren der Menge zieht sich die Bahn auf eine kleine Schleife zusammen und verlässt sie nie. Für ein c knapp außerhalb wandert die Bahn nach außen und explodiert binnen weniger Schritte. Für ein c direkt am Rand tanzt die Bahn ewig, ohne sich je zu beruhigen oder zu entkommen. Die drei animierten Felder unten zeigen diese drei Regime nebeneinander.",
        },
        {
          pretitle: "Schritt drei · Warum das Bild unendlich ist",
          title: "Der Rand wird nie einfacher",
          body:
            "Sobald du jedes c danach einfärbst, wie schnell seine Bahn entkommt, leuchtet der Rand auf. Die erstaunliche Tatsache, bewiesen unter anderem von Tan Lei, ist: der Rand ist in einem tiefen Sinn selbstähnlich — wo immer du hineinzoomst, findest du neue winzige Kopien der ganzen Form, umgeben von Filigran, das sich nie wiederholt. Deshalb geht der Explorer bis zu 10¹⁰ Zoom: es gibt auf jeder Skala wirklich etwas Neues.",
        },
        {
          pretitle: "Schritt vier · Die Fixpunkte",
          title: "Wo die Mathematik sich versteckt",
          body:
            "Innerhalb der großen Kardioide in der Mitte konvergiert die Iteration zu einem einzigen Fixpunkt. Innerhalb jeder runden Scheibe, die daran hängt, zu einem 2-Zyklus, dann 4, dann 8 — dieselbe Verdoppelungs-Kaskade wie bei der logistischen Abbildung. Die Mandelbrot-Menge ist in präzisem Sinn eine Karte davon, wo die logistische Geschichte ruhig ist und wo sie ins Chaos kippt. Zwei berühmte chaotische Systeme, ein Bild.",
        },
      ],
    },
    life: {
      pretitle: "Thema III · Berechnung",
      title: "Conways Game of Life",
      tagline: "Vier Regeln. Universen folgen.",
      intro:
        "Conway veröffentlichte die Regeln 1970 in einer Kolumne von Scientific American. Zwei Magazinseiten, vier Regelzeilen — und eine Gemeinschaft von Mathematikern hat seither fünfzig Jahre damit verbracht zu entdecken, was schon darin steckte. Die Sandbox erlaubt dir, jedes Muster zu zeichnen und laufen zu lassen — vorher: die vier Regeln in Aktion.",
      ctaInteractive: "→ Sandbox öffnen",
      sections: [
        {
          pretitle: "Schritt eins · Die Regeln",
          title: "Geburt, Überleben, Tod — und sonst nichts",
          body:
            "Das Gitter ist unendlich, jede Zelle ist entweder lebendig oder tot, und jede Zelle schaut auf ihre acht Nachbarn. Eine tote Zelle mit genau drei lebenden Nachbarn wird lebendig. Eine lebende Zelle mit zwei oder drei lebenden Nachbarn bleibt lebendig. Jeder andere Fall — zu wenige Nachbarn, zu viele Nachbarn, keine Nachbarn — tötet die Zelle. Die vier animierten Demos unten zeigen, wie jede Regel auf einem 5×5-Gitter zündet.",
        },
        {
          pretitle: "Schritt zwei · Von Regeln zur Bewegung",
          title: "Der Gleiter wandert",
          body:
            "Ein Muster aus fünf Zellen, der Gleiter, ist das kleinste bewegliche Ding in Life. Beobachte seine Schritte. Nach vier Generationen ist er wieder in seiner ursprünglichen Form — aber um eine Zelle diagonal verschoben. So funktioniert Bewegung in einer Welt, die den Begriff Bewegung nicht kennt: eine Form, die nach wenigen Regel-Anwendungen sich selbst woanders gleicht.",
        },
        {
          pretitle: "Schritt drei · Von Bewegung zu Berechnung",
          title: "Gleiter tragen Information",
          body:
            "Wenn ein Gleiter sich bewegt, kann er gezielt geschickt werden. Wenn er gezielt geschickt werden kann, kann er mit anderen Gleitern kollidieren. Aus Kollisionen lassen sich UND, ODER, NICHT bauen — und daraus jeder boolesche Schaltkreis. Es sind Turing-Maschinen, Game-of-Life-Simulatoren und ganze programmierbare Computer ausschließlich aus sorgfältig angeordneten Gleitern gebaut worden. Die Sandbox enthält die Gosper-Gleiter-Kanone als Preset: ein Muster, das alle dreißig Generationen einen Gleiter abfeuert, für immer.",
        },
        {
          pretitle: "Schritt vier · Was uns das sagt",
          title: "Komplexität braucht keine komplexen Regeln",
          body:
            "Die tiefere Aussage ist philosophisch. Life zeigt, dass aufwendige Struktur — Bewegung, Replikation, Berechnung, ja in den starken Varianten sogar Bewusstsein — in einer Regel sitzen kann, die auf eine Postkarte passt. Es ist dieselbe Lektion, die EML für die Analysis liefert, NAND für die Logik, Regel 110 für Zellularautomaten. Ein kleiner Baustein, mit Disziplin angewendet, reicht.",
        },
      ],
    },
  },
};

// Other locales currently fall back to English content for these story pages;
// nav labels and topic taglines remain fully translated in the main atlas dict.
export const STORIES: Record<Locale, StoriesDict> = {
  en,
  de,
  es: en,
  fr: en,
  it: en,
  pt: en,
  sv: en,
  no: en,
};
