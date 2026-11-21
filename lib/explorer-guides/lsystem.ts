import type { ExplorerGuide } from "./types";

// Numbers quoted here (the 500,000 symbol cap, iteration range 1 to 12, angle
// range 15° to 120°, start heading range −180° to 180°, preset values) match app/lsystem/explorer/page.tsx;
// update both together.
const TURTLE_EXCERPT = `function expand(axiom, rules, iterations) {
  let s = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const ch of s) {
      next += rules[ch] ?? ch;          // every symbol rewritten at once
      if (next.length > MAX_STRING) return next.slice(0, MAX_STRING);
    }
    s = next;
  }
  return s;
}

// Turtle: F G A B draw one unit, + and - turn, [ and ] push and pop state
if (isDraw(ch)) { x += Math.cos(h); y += Math.sin(h); }
else if (ch === "+") h += da;  else if (ch === "-") h -= da;`;

export const LSYSTEM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Build L-system fractals in the browser: edit axiom, rules and angle, grow the Koch snowflake, dragon or a fractal plant, and see how the turtle draws them.",
    heading: "How this explorer works",
    intro:
      "Every picture on this canvas starts as a short word, the axiom, and a handful of rewrite rules. The explorer applies the rules to every letter of the word at the same time, again and again, until the word is thousands of symbols long. Then a turtle walks through it letter by letter: some letters mean «step forward and draw a line», others mean «turn» or «remember where you are». Snowflakes, space-filling curves and branching plants all come out of the same tiny machine. Only the rules change.",
    sections: [
      {
        heading: "Rewriting in parallel",
        paragraphs: [
          "Lindenmayer systems, or L-systems, were introduced in 1968 by the Hungarian biologist Aristid Lindenmayer as a way to describe how simple organisms grow cell by cell. The key difference from ordinary grammars is that all symbols are replaced simultaneously, just as all cells of a filament divide in the same generation. A symbol without a rule is copied unchanged.",
          "Take the Koch curve preset: axiom F, one rule F → F+F-F-F+F. After one step there are 5 copies of F, after two steps 25, after n steps 5ⁿ. The string length grows to 2 · 5ⁿ − 1 symbols, so four iterations give 1,249 symbols and 625 line segments.",
        ],
        formula: "F \\;\\to\\; F{+}F{-}F{-}F{+}F, \\qquad \\#F_n = 5^n",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The eight presets load a complete system: Koch curve (90°, 4 iterations), Koch snowflake (60°, 4), Sierpiński arrowhead (60°, 6), Sierpiński triangle (120°, 5), dragon curve (90°, 12), fractal plant (25°, 5), Hilbert curve (90°, 5) and Lévy C curve (45°, 10). Picking one overwrites the axiom, rules, angle, start heading and iteration count. The Koch curve here is the square variant with right angles, not the classic 60° version; the snowflake preset shows the triangular one.",
          "The iterations slider runs from 1 to 12, the angle slider from 15° to 120° in whole degrees. The angle is the amount the turtle turns on every + or − symbol, and since it is applied hundreds of times, a change of a single degree can bend a neat curve into a spiral. The axiom field and the rules box are fully editable. Write one rule per line in the form X = …; each left-hand side must be a single character, and lines that do not parse are ignored. Start heading (−180° to 180° in steps of 5°) is the direction the turtle faces before its first step: 0° points right and −90° straight up. The plant preset sets it to −65°, every other preset to 0°, and it stays where you put it while you edit the axiom and rules. The colour buttons only change the stroke.",
          "The counter below the canvas shows the length of the generated string. If a system grows past 500,000 symbols, the expansion stops right there and an amber warning appears. What you see in that case is the beginning of the next generation, not the complete fractal.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The expansion is a plain loop over the string with a lookup in the rules object, recomputed only when the axiom, the rules or the iteration count change. Drawing happens on a 2D canvas in two passes over the same string. The first pass walks the turtle without drawing and records the bounding box. From that box the code computes one uniform scale factor and an offset, so the figure always fills the canvas with a 24 pixel margin, whether it has 10 segments or 100,000. The second pass walks again and adds every segment to a single path, which is stroked once at the end.",
          "Four letters draw: F, G, A and B. Every other letter is invisible to the turtle, which is exactly why the dragon and Hilbert presets use X and Y: they steer how the string grows without leaving marks. The brackets push the current position and heading onto a stack and pop them back, which is what lets the fractal plant grow side branches and then return to the stem. There is no animation, so the canvas only redraws when a control changes or the window is resized, and reduced-motion settings need no special handling.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Why the angle is part of the rules",
        paragraphs: [
          "The rules decide the combinatorics, the angle decides the geometry. The dragon curve string is a sequence of left and right turns; at 90° the curve touches itself at corners but never runs along the same segment twice, while the same string drawn at a different angle can pile segments on top of each other. In other words, an L-system is not a picture: it is a recipe that only becomes a particular fractal once you fix how far the turtle turns.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Hit the symbol cap",
        text: "Load the Koch curve and raise the iterations to 7. The string has 156,249 symbols and still draws completely. Go to 8 and the full string would need 781,249 symbols, so the cap kicks in and only part of the curve appears.",
      },
      {
        title: "Bend the dragon",
        text: "Load the dragon curve and move the angle from 90° down to 80° and then 60°. The same sequence of turns no longer closes into the familiar dragon and starts folding into overlapping spirals.",
      },
      {
        title: "Change the wind on the plant",
        text: "Load the fractal plant and try 15°, 25° and 35°. Small angles grow a narrow reed, large ones a sprawling bush. The branching structure is identical; only the turn changes.",
      },
      {
        title: "Write your own system",
        text: "Set the start heading to −90° so the turtle starts straight up. Then set the axiom to F, the rules to F = F[+F]F[-F]F, the angle to 25° and the iterations to 5. You get a branching weed from a single rule, because each bracket pair spawns a side shoot that returns to its stem.",
      },
    ],
  },
  de: {
    metaDescription:
      "L-System-Fraktale im Browser bauen: Axiom, Regeln und Winkel ändern, Koch-Schneeflocke, Drachenkurve oder Fraktalpflanze wachsen lassen, die Turtle verstehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jedes Bild auf diesem Canvas beginnt als kurzes Wort, das Axiom, und eine Handvoll Ersetzungsregeln. Der Explorer wendet die Regeln auf alle Buchstaben des Worts gleichzeitig an, immer wieder, bis das Wort Tausende Zeichen lang ist. Dann läuft eine Turtle Buchstabe für Buchstabe hindurch: Manche Zeichen bedeuten «geh vorwärts und zieh eine Linie», andere «dreh dich» oder «merk dir, wo du bist». Schneeflocken, raumfüllende Kurven und verzweigte Pflanzen entstehen alle aus derselben winzigen Maschine. Nur die Regeln ändern sich.",
    sections: [
      {
        heading: "Paralleles Ersetzen",
        paragraphs: [
          "Lindenmayer-Systeme, kurz L-Systeme, führte der ungarische Biologe Aristid Lindenmayer 1968 ein, um zu beschreiben, wie einfache Organismen Zelle für Zelle wachsen. Der entscheidende Unterschied zu gewöhnlichen Grammatiken: Alle Zeichen werden gleichzeitig ersetzt, so wie sich alle Zellen eines Zellfadens in derselben Generation teilen. Ein Zeichen ohne Regel wird unverändert übernommen.",
          "Nimm die Vorlage Koch-Kurve: Axiom F, eine Regel F → F+F-F-F+F. Nach einem Schritt gibt es 5 Kopien von F, nach zwei Schritten 25, nach n Schritten 5ⁿ. Die Zeichenkette wächst auf 2 · 5ⁿ − 1 Zeichen, vier Iterationen ergeben also 1.249 Zeichen und 625 Liniensegmente.",
        ],
        formula: "F \\;\\to\\; F{+}F{-}F{-}F{+}F, \\qquad \\#F_n = 5^n",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die acht Vorlagen laden jeweils ein komplettes System: Koch-Kurve (90°, 4 Iterationen), Koch-Schneeflocke (60°, 4), Sierpiński-Pfeilspitze (60°, 6), Sierpiński-Dreieck (120°, 5), Drachenkurve (90°, 12), Fraktalpflanze (25°, 5), Hilbert-Kurve (90°, 5) und Lévy-C-Kurve (45°, 10). Wählst du eine aus, werden Axiom, Regeln, Winkel, Startrichtung und Iterationszahl überschrieben. Die Koch-Kurve ist hier die eckige Variante mit rechten Winkeln, nicht die klassische mit 60°; die dreieckige Form zeigt die Schneeflocke.",
          "Der Iterationsregler reicht von 1 bis 12, der Winkelregler von 15° bis 120° in ganzen Grad. Der Winkel ist der Betrag, um den sich die Turtle bei jedem + oder − dreht. Weil er Hunderte Male angewendet wird, kann schon ein Grad Unterschied eine saubere Kurve in eine Spirale verbiegen. Axiom und Regelfeld sind frei bearbeitbar. Schreib eine Regel pro Zeile in der Form X = …; die linke Seite muss genau ein Zeichen sein, Zeilen, die sich nicht lesen lassen, werden ignoriert. Der Regler «Start heading» (−180° bis 180° in Schritten von 5°) ist die Richtung, in die die Turtle vor ihrem ersten Schritt schaut: 0° zeigt nach rechts, −90° senkrecht nach oben. Die Pflanzen-Vorlage setzt ihn auf −65°, jede andere auf 0°, und er bleibt, wo du ihn hinstellst, während du Axiom und Regeln bearbeitest. Die Farbknöpfe ändern nur die Linienfarbe.",
          "Der Zähler unter dem Canvas zeigt die Länge der erzeugten Zeichenkette. Wächst ein System über 500.000 Zeichen, bricht die Expansion genau dort ab, und ein bernsteinfarbener Hinweis erscheint. Was du dann siehst, ist der Anfang der nächsten Generation, nicht das vollständige Fraktal.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Expansion ist eine schlichte Schleife über die Zeichenkette mit einem Nachschlagen im Regelobjekt. Sie wird nur neu berechnet, wenn sich Axiom, Regeln oder Iterationszahl ändern. Gezeichnet wird auf einem 2D-Canvas in zwei Durchgängen über dieselbe Zeichenkette. Im ersten läuft die Turtle, ohne zu zeichnen, und merkt sich den umgebenden Rahmen. Daraus berechnet der Code einen einheitlichen Skalierungsfaktor und einen Versatz, sodass die Figur das Canvas immer mit 24 Pixeln Rand ausfüllt, egal ob sie 10 oder 100.000 Segmente hat. Im zweiten Durchgang läuft die Turtle erneut und hängt jedes Segment an einen einzigen Pfad, der am Ende einmal gezeichnet wird.",
          "Vier Buchstaben zeichnen: F, G, A und B. Alle anderen sind für die Turtle unsichtbar, und genau deshalb verwenden die Drachen- und die Hilbert-Vorlage X und Y: Sie steuern, wie die Zeichenkette wächst, ohne Spuren zu hinterlassen. Die eckigen Klammern legen Position und Richtung auf einen Stapel und holen sie wieder zurück. So kann die Fraktalpflanze Seitenäste treiben und danach zum Stängel zurückkehren. Es gibt keine Animation: Das Canvas zeichnet nur neu, wenn sich ein Regler ändert oder das Fenster seine Größe wechselt, eine Einstellung für reduzierte Bewegung braucht deshalb keine Sonderbehandlung.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Warum der Winkel zu den Regeln gehört",
        paragraphs: [
          "Die Regeln legen die Kombinatorik fest, der Winkel die Geometrie. Die Zeichenkette der Drachenkurve ist eine Folge von Links- und Rechtsdrehungen. Bei 90° berührt sich die Kurve an Ecken, läuft aber nie zweimal über dasselbe Segment; mit einem anderen Winkel kann dieselbe Zeichenkette Segmente übereinanderstapeln. Ein L-System ist also kein Bild, sondern ein Rezept, das erst zu einem bestimmten Fraktal wird, wenn du festlegst, wie weit sich die Turtle dreht.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Zeichengrenze erreichen",
        text: "Lade die Koch-Kurve und erhöhe auf 7 Iterationen. Die Zeichenkette hat 156.249 Zeichen und wird noch vollständig gezeichnet. Bei 8 bräuchte sie 781.249 Zeichen, die Grenze greift, und nur ein Teil der Kurve erscheint.",
      },
      {
        title: "Den Drachen verbiegen",
        text: "Lade die Drachenkurve und schieb den Winkel von 90° auf 80° und dann auf 60°. Dieselbe Folge von Drehungen schließt sich nicht mehr zum vertrauten Drachen, sondern faltet sich zu überlappenden Spiralen.",
      },
      {
        title: "Wind für die Pflanze",
        text: "Lade die Fraktalpflanze und probier 15°, 25° und 35°. Kleine Winkel lassen ein schmales Schilf wachsen, große einen ausladenden Busch. Die Verzweigungsstruktur bleibt identisch, nur die Drehung ändert sich.",
      },
      {
        title: "Schreib dein eigenes System",
        text: "Stell «Start heading» auf −90°, damit die Turtle senkrecht nach oben startet. Setz dann das Axiom auf F, die Regel auf F = F[+F]F[-F]F, den Winkel auf 25° und die Iterationen auf 5. Aus einer einzigen Regel wächst ein verzweigtes Kraut, weil jedes Klammerpaar einen Seitentrieb erzeugt, der zu seinem Stängel zurückkehrt.",
      },
    ],
  },
};
