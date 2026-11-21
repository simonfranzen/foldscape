import type { ExplorerGuide } from "./types";

// Paths, step numbers and continued fractions quoted here were produced by
// walk() and pathToCF() from app/sternbrocot/explorer/page.tsx with the preset
// values and default depth 20 (range 4 to 60); update both together.
const WALK_EXCERPT = `let lo_n = 0, lo_d = 1;   // 0/1
let hi_n = 1, hi_d = 0;   // 1/0, standing in for infinity
let med_n = 1, med_d = 1;
for (let i = 0; i < maxDepth; i++) {
  const val = med_n / med_d;
  if (Math.abs(val - target) < 1e-15) break;
  if (target < val) {
    hi_n = med_n; hi_d = med_d;
    out[out.length - 1].side = "L";
  } else {
    lo_n = med_n; lo_d = med_d;
    out[out.length - 1].side = "R";
  }
  med_n = lo_n + hi_n;   // the mediant of the two bounds
  med_d = lo_d + hi_d;
  if (med_d > 1e15) break;
  out.push({ num: med_n, den: med_d, side: null });
}`;

export const STERNBROCOT_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Walk the Stern-Brocot tree to any number: see its L/R path, the continued fraction it encodes and the best rational approximations, from φ to π and 355/113.",
    heading: "How this explorer works",
    intro:
      "Every positive fraction lives at exactly one place in a single infinite binary tree, the Stern-Brocot tree. Starting at 1/1 you can reach any of them by a sequence of left and right moves, where each move says whether the target is smaller or larger than the fraction you are standing on. This page performs that walk for a number you choose and prints three things: the string of L and R moves, the continued fraction those moves encode, and a table of the fractions visited on the way, together with how far each one is from the target.",
    sections: [
      {
        heading: "Mediants",
        paragraphs: [
          "The tree is built from one strange-looking operation. The mediant of two fractions a/b and c/d is (a + c)/(b + d): add the numerators, add the denominators. It is not the average, but it always lies strictly between the two. Start with 0/1 and 1/0, which plays the role of infinity, and insert their mediant 1/1. Then insert mediants between every pair of neighbours, level after level.",
          "Two facts make the result remarkable. Neighbouring fractions a/b < c/d in the construction always satisfy bc − ad = 1, and because of that every mediant is automatically in lowest terms. And every positive rational number appears, exactly once. Achille Brocot, a French clockmaker, used the tree to find gear ratios that approximate a desired value with small numbers of teeth, which is precisely what the walk on this page does.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Type any positive number into the target field. The page opens with the golden ratio φ, rounded to 1.61803399. The buttons below fill in φ, π, e, √2, 1/3, 2/3 or 22/7, each written with 12 decimal places.",
          "The depth slider, from 4 to 60 (default 20), caps the number of moves. The status line shows the target and how many fractions the walk visited; the path line shows the moves, ending with a dot. The table lists the visited fractions with their decimal value, their error and the move taken from them, but only the last 32 rows, so for long walks the early steps scroll out of the table.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The walk keeps a lower bound and an upper bound, starting at 0/1 and 1/0, and the current fraction is always their mediant. If the target is smaller, the current fraction becomes the new upper bound and the move is L; otherwise it becomes the lower bound and the move is R. It stops when the fraction equals the target to within 10⁻¹⁵, when the denominator would exceed 10¹⁵, or when the depth limit is reached. Plain JavaScript numbers represent integers exactly up to about 9 · 10¹⁵, so the cap keeps every printed fraction exact.",
          "The continued fraction comes from run lengths: the moves always arrive in blocks such as RRR, then LLLLLLL, and the block lengths are the terms. A walk that begins with L belongs to a number below 1, so a leading 0 is added. When the walk lands exactly on the target, the last block is one move short of the final term, and the page adds that one back. Everything is recomputed from the input during rendering; nothing is animated.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "What the runs tell you",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] has the path RLRLRL…, and the fractions it visits are ratios of consecutive Fibonacci numbers: 2/1, 3/2, 5/3, 8/5, up to 17711/10946 at depth 20. Because every block has length one, the walk changes direction as often as possible and closes in as slowly as possible. In a precise sense, made exact by Hurwitz's theorem, no irrational number is harder to approximate by fractions than φ.",
          "π is the opposite. Its path starts RRR, then seven L, fifteen R, one L, and then a very long run of R. That last run reflects the large term 292 in π = [3; 7, 15, 1, 292, …]: the next good fraction after 355/113 is far away, which is exactly why 355/113 is such an outstanding approximation. With 12 decimals and at most 60 moves, the page can only show the first 34 moves of that run.",
          "Finite decimals are honest rationals. The 1/3 button enters 0.333333333333, which is slightly less than 1/3, so the walk passes 1/3 at step 3, turns, and keeps going; at depth 60 the continued fraction reads [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Fibonacci in disguise",
        text: "Keep the default golden ratio and read down the fraction column: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Each numerator is the sum of the two before it, and the error shrinks by a factor of about 2.6 per step.",
      },
      {
        title: "Find 355/113",
        text: "Choose π and set the depth to 30, so the whole path fits into the table. 22/7 appears at step 10 with an error of about 1.3 · 10⁻³, and 355/113 at step 26 with an error of about 2.7 · 10⁻⁷.",
      },
      {
        title: "Watch a walk end",
        text: "Type 0.75. The path is LRR and stops at 3/4, and the continued fraction is [0; 1, 3]. Then try 1.4142 with the depth at 60: after 41 moves the walk lands exactly on 7071/5000.",
      },
      {
        title: "The rhythm of √2",
        text: "Choose √2. The path settles into RLLRRLLRR…, so every term after the first is 2, and the table lists 3/2, 7/5, 17/12, 41/29 and 99/70, solutions of p² − 2q² = ±1.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Stern-Brocot-Baum bis zu jeder Zahl durchwandern: L/R-Pfad, Kettenbruch und beste rationale Näherungen ansehen, von φ über π bis 355/113.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder positive Bruch hat genau einen Platz in einem einzigen unendlichen Binärbaum, dem Stern-Brocot-Baum. Von 1/1 aus erreichst du jeden davon durch eine Folge von Schritten nach links und rechts, wobei jeder Schritt sagt, ob das Ziel kleiner oder größer ist als der Bruch, auf dem du gerade stehst. Diese Seite geht diesen Weg für eine Zahl deiner Wahl und zeigt drei Dinge: die Folge der L- und R-Schritte, den Kettenbruch, den diese Schritte kodieren, und eine Tabelle der besuchten Brüche samt ihrem Abstand zum Ziel.",
    sections: [
      {
        heading: "Medianten",
        paragraphs: [
          "Der Baum entsteht aus einer seltsam aussehenden Operation. Die Mediante zweier Brüche a/b und c/d ist (a + c)/(b + d): Zähler addieren, Nenner addieren. Das ist nicht der Mittelwert, liegt aber immer echt zwischen den beiden. Beginne mit 0/1 und 1/0, das hier die Rolle von unendlich spielt, und füge ihre Mediante 1/1 ein. Dann fügst du zwischen allen Nachbarpaaren Medianten ein, Ebene für Ebene.",
          "Zwei Tatsachen machen das Ergebnis bemerkenswert. Benachbarte Brüche a/b < c/d der Konstruktion erfüllen immer bc − ad = 1, und deshalb ist jede Mediante automatisch vollständig gekürzt. Und jede positive rationale Zahl kommt vor, genau einmal. Achille Brocot, ein französischer Uhrmacher, suchte mit dem Baum Zahnradübersetzungen, die einen gewünschten Wert mit kleinen Zähnezahlen annähern, und genau das tut der Weg auf dieser Seite.",
        ],
        formula: "\\frac{a}{b} < \\frac{a+c}{b+d} < \\frac{c}{d}, \\qquad bc - ad = 1",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Tipp eine beliebige positive Zahl ins Zielfeld. Die Seite startet mit dem goldenen Schnitt φ, gerundet auf 1.61803399 (das Eingabefeld nutzt den Dezimalpunkt). Die Knöpfe darunter setzen φ, π, e, √2, 1/3, 2/3 oder 22/7 ein, jeweils mit 12 Nachkommastellen.",
          "Der Tiefenregler von 4 bis 60 (voreingestellt 20) begrenzt die Zahl der Schritte. Die Statuszeile zeigt das Ziel und wie viele Brüche der Weg besucht hat; die Pfadzeile zeigt die Schritte und endet mit einem Punkt. Die Tabelle listet die besuchten Brüche mit Dezimalwert, Fehler und dem Schritt, der von ihnen aus folgte, allerdings nur die letzten 32 Zeilen. Bei langen Wegen fallen die frühen Schritte also aus der Tabelle.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Weg merkt sich eine untere und eine obere Schranke, anfangs 0/1 und 1/0, und der aktuelle Bruch ist immer ihre Mediante. Ist das Ziel kleiner, wird der aktuelle Bruch zur neuen oberen Schranke und der Schritt heißt L; sonst wird er zur unteren Schranke und der Schritt heißt R. Der Weg endet, wenn der Bruch bis auf 10⁻¹⁵ mit dem Ziel übereinstimmt, wenn der Nenner 10¹⁵ überschreiten würde oder wenn die Tiefengrenze erreicht ist. Gewöhnliche JavaScript-Zahlen stellen ganze Zahlen bis etwa 9 · 10¹⁵ exakt dar, die Grenze hält also jeden angezeigten Bruch exakt.",
          "Der Kettenbruch ergibt sich aus Lauflängen: Die Schritte kommen immer in Blöcken wie RRR, dann LLLLLLL, und die Blocklängen sind die Glieder. Ein Weg, der mit L beginnt, gehört zu einer Zahl unter 1, deshalb wird eine 0 vorangestellt. Landet der Weg genau auf dem Ziel, ist der letzte Block einen Schritt kürzer als das letzte Glied, und die Seite zählt diesen Schritt dazu. Alles wird beim Rendern aus der Eingabe neu berechnet; nichts ist animiert.",
        ],
        code: WALK_EXCERPT,
      },
      {
        heading: "Was die Läufe verraten",
        paragraphs: [
          "φ = [1; 1, 1, 1, …] hat den Pfad RLRLRL…, und die besuchten Brüche sind Quotienten aufeinanderfolgender Fibonacci-Zahlen: 2/1, 3/2, 5/3, 8/5, bis 17711/10946 bei Tiefe 20. Weil jeder Block die Länge eins hat, wechselt der Weg so oft wie möglich die Richtung und nähert sich so langsam wie möglich. In einem präzisen Sinn, den der Satz von Hurwitz exakt macht, lässt sich keine irrationale Zahl schlechter durch Brüche annähern als φ.",
          "π ist das Gegenteil. Sein Pfad beginnt mit RRR, dann sieben L, fünfzehn R, ein L und dann ein sehr langer Lauf aus R. Dieser letzte Lauf spiegelt das große Glied 292 in π = [3; 7, 15, 1, 292, …]: Der nächste gute Bruch nach 355/113 ist weit entfernt, und genau deshalb ist 355/113 eine so herausragende Näherung. Mit 12 Nachkommastellen und höchstens 60 Schritten zeigt die Seite nur die ersten 34 Schritte dieses Laufs.",
          "Endliche Dezimalzahlen sind ehrliche rationale Zahlen. Der Knopf 1/3 setzt 0.333333333333 ein, und das ist etwas kleiner als 1/3. Der Weg passiert 1/3 also in Schritt 3, biegt ab und läuft weiter; bei Tiefe 60 lautet der Kettenbruch [0; 3, 57].",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Fibonacci in Verkleidung",
        text: "Lass den goldenen Schnitt stehen und lies die Bruchspalte von oben nach unten: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8. Jeder Zähler ist die Summe der beiden davor, und der Fehler schrumpft pro Schritt etwa um den Faktor 2,6.",
      },
      {
        title: "355/113 finden",
        text: "Wähle π und stell die Tiefe auf 30, damit der ganze Pfad in die Tabelle passt. 22/7 erscheint in Schritt 10 mit einem Fehler von etwa 1,3 · 10⁻³, 355/113 in Schritt 26 mit einem Fehler von etwa 2,7 · 10⁻⁷.",
      },
      {
        title: "Einen Weg enden sehen",
        text: "Tipp 0.75 ein. Der Pfad ist LRR und hält bei 3/4, der Kettenbruch lautet [0; 1, 3]. Probier dann 1.4142 bei Tiefe 60: Nach 41 Schritten landet der Weg genau auf 7071/5000.",
      },
      {
        title: "Der Rhythmus von √2",
        text: "Wähle √2. Der Pfad pendelt sich auf RLLRRLLRR… ein, jedes Glied nach dem ersten ist also 2, und die Tabelle zeigt 3/2, 7/5, 17/12, 41/29 und 99/70, Lösungen von p² − 2q² = ±1.",
      },
    ],
  },
};
