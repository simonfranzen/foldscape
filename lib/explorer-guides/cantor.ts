import type { ExplorerGuide } from "./types";

// Numbers quoted here (16 x 16 table, 700 ms default, 50 to 1500 ms range,
// the two flip rules) match app/cantor/explorer/page.tsx; update both together.
const FLIP_EXCERPT = `function flipDigit(d, strategy, source) {
  if (source === "binary") return d === 0 ? 1 : 0;
  if (strategy === "swap56") {
    if (d === 5) return 6;
    if (d === 6) return 5;
    return 5;                    // anything else becomes 5
  }
  // +1 mod 10, skipping 0 and 9 (and equal-to-d)
  let next = (d + 1) % 10;
  for (let safety = 0; safety < 10; safety++) {
    if (next !== d && next !== 0 && next !== 9) return next;
    next = (next + 1) % 10;
  }
}

// digit i of s comes from the diagonal cell (i, i)
for (let i = 0; i < step; i++) out.push(flipDigit(table[i][i], strategy, source));`;

export const CANTOR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Step through Cantor's diagonal argument on a 16 × 16 table of decimals, build the missing number digit by digit and see why the real numbers are uncountable.",
    heading: "How this explorer works",
    intro:
      "The table is a list of sixteen real numbers between 0 and 1, each written out to sixteen digits after the decimal point. Pretend it is the start of a list meant to contain every real number in that interval. Each press of Step looks at one cell on the diagonal (digit 1 of row 1, digit 2 of row 2, and so on), changes that digit, and appends the result to a new number s at the bottom. When the diagonal is used up, s disagrees with every row somewhere, so it cannot be on the list. That is Cantor's diagonal argument.",
    sections: [
      {
        heading: "The argument",
        paragraphs: [
          "A set is countable if its elements can be arranged in a list r₁, r₂, r₃, … in which every element eventually appears. The integers and even the fractions are countable. Georg Cantor showed in 1874 that the real numbers are not, and in 1891 he published the much shorter diagonal proof that this explorer animates.",
          "Suppose someone hands you a complete list of the reals in [0, 1]. Write the n-th digit of rₙ as dₙₙ and build s so that its n-th digit is something other than dₙₙ. Then s differs from r₁ in the first digit, from r₂ in the second, and in general from rₙ in the n-th. No row can equal s, yet s is clearly a real number between 0 and 1. The list was not complete after all, and since the list was arbitrary, no complete list exists.",
        ],
        formula:
          "s_n \\neq d_{nn} \\text{ for every } n \\;\\Rightarrow\\; s \\neq r_n \\text{ for every } n",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Step adds one digit of s, Play adds them automatically, and Reset clears s and starts again. The speed slider sets the pause between automatic steps, from 1500 ms down to 50 ms; the default is 700 ms. The amber cell is the diagonal digit being used right now, the faint amber cells have already been used, and the column on the right records each comparison as sₙ ≠ dₙₙ. After the sixteenth digit the contradiction panel appears and rows can be highlighted by hover or keyboard focus.",
          "Number source chooses where the table comes from. Decimal fills it with pseudo-random digits, Binary with pseudo-random zeros and ones, and the reshuffle button draws a new table. Custom lets you type one decimal per line. The prefilled custom list starts with the digits of π, e, √2, the golden ratio, ln 2 and the Euler-Mascheroni constant, shifted behind the decimal point.",
          "The digit-change rule decides how dₙₙ is altered. Swap 5 ↔ 6 turns a 5 into a 6 and every other digit into a 5. +1 mod 10 adds one but skips 0 and 9, so an 8 or a 9 becomes 1. In binary mode the rule is ignored and bits simply flip between 0 and 1; the rows are then treated as 0/1 sequences, not numbers (the prefix «0.» is dropped).",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no canvas: the table is an ordinary HTML table, so screen readers can walk through it. The random tables come from a small linear congruential generator (multiplier 1664525, increment 1013904223, modulo 2³²) seeded with a number that changes when you reshuffle.",
          "The digits of s are not stored as state at all. The component keeps only the current step and recomputes s from the table on every render by reading the diagonal and applying the chosen rule. Changing the source, the rule or a custom line therefore resets the step. Play is a plain interval timer that advances the step. The only continuous animation is a gentle pulse on the newest digit, which the site-wide reduced-motion rule switches off.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Why avoid 0 and 9",
        paragraphs: [
          "Some real numbers have two decimal expansions: 0.4999… and 0.5000… are the same number. If s ended in an endless run of 9s, it could coincide with a listed number written with trailing 0s, even though the two disagree digit by digit, and the proof would break. Choosing replacement digits that are never 0 or 9 rules this out, because an expansion with no 0s and no 9s is the only way to write that number. Both decimal rules respect this. In binary the same trap exists (0.0111… equals 0.1000…), and flipping bits cannot avoid it. So in binary mode the explorer does what the textbook does: it argues with infinite 0/1 sequences rather than with real numbers, and its conclusion is that there are more such sequences than natural numbers.",
          "Keep in mind that sixteen rows are only an illustration. A finite list can always be beaten by brute force; the strength of the argument is that the same recipe defeats an infinite list, because row n is checked at digit n no matter how far down it sits.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch s escape",
        text: "Keep the decimal source and Swap 5 ↔ 6, press Play, and follow the amber cell down the diagonal.",
      },
      {
        title: "Try to trap s",
        text: "Switch to Custom and make row 1 start with 5, row 2 with 05, row 3 with 005, and so on. With Swap 5 ↔ 6 every diagonal 5 becomes a 6, so s = 0.666… slips past every row anyway.",
      },
      {
        title: "Compare the two rules",
        text: "Run the same table once with Swap 5 ↔ 6 and once with +1 mod 10. You get two different numbers s, both missing from the list. The proof yields as many missing reals as you like.",
      },
      {
        title: "Binary mode",
        text: "Choose Binary and step through. Each diagonal bit is flipped, and s is a 0/1 sequence that is missing from the list. Note that the panel now speaks of sequences, not numbers, because of the 0.0111… = 0.1000… caveat from above.",
      },
    ],
  },
  de: {
    metaDescription:
      "Cantors Diagonalargument Schritt für Schritt: in einer 16 × 16 Tabelle die fehlende Zahl Ziffer für Ziffer bauen und sehen, warum ℝ überabzählbar ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Tabelle ist eine Liste von sechzehn reellen Zahlen zwischen 0 und 1, jede mit sechzehn Nachkommastellen ausgeschrieben. Stell dir vor, das ist der Anfang einer Liste, die jede reelle Zahl aus diesem Intervall enthalten soll. Jeder Druck auf Step schaut sich eine Zelle auf der Diagonale an (Ziffer 1 von Zeile 1, Ziffer 2 von Zeile 2 und so weiter), verändert diese Ziffer und hängt das Ergebnis an eine neue Zahl s unten an. Ist die Diagonale verbraucht, weicht s von jeder Zeile irgendwo ab und kann deshalb nicht in der Liste stehen. Das ist Cantors Diagonalargument.",
    sections: [
      {
        heading: "Das Argument",
        paragraphs: [
          "Eine Menge heißt abzählbar, wenn man ihre Elemente in eine Liste r₁, r₂, r₃, … schreiben kann, in der jedes Element irgendwann vorkommt. Die ganzen Zahlen und sogar die Brüche sind abzählbar. Georg Cantor zeigte 1874, dass die reellen Zahlen es nicht sind, und veröffentlichte 1891 den viel kürzeren Diagonalbeweis, den dieser Explorer animiert.",
          "Angenommen, jemand gibt dir eine vollständige Liste der reellen Zahlen in [0, 1]. Nenne die n-te Ziffer von rₙ einfach dₙₙ und baue s so, dass seine n-te Ziffer nicht dₙₙ ist. Dann unterscheidet sich s von r₁ in der ersten Ziffer, von r₂ in der zweiten und allgemein von rₙ in der n-ten. Keine Zeile kann gleich s sein, und doch ist s eindeutig eine reelle Zahl zwischen 0 und 1. Die Liste war also nicht vollständig, und weil sie beliebig war, gibt es keine vollständige Liste.",
        ],
        formula:
          "s_n \\neq d_{nn} \\text{ für alle } n \\;\\Rightarrow\\; s \\neq r_n \\text{ für alle } n",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Step fügt eine Ziffer von s hinzu, Play erledigt das automatisch, und Reset löscht s und fängt neu an. Der Geschwindigkeitsregler legt die Pause zwischen den automatischen Schritten fest, von 1500 ms bis hinunter zu 50 ms; voreingestellt sind 700 ms. Die bernsteinfarbene Zelle ist die Diagonalziffer, die gerade verwendet wird, die blasseren sind schon verbraucht, und die Spalte rechts protokolliert jeden Vergleich als sₙ ≠ dₙₙ. Nach der sechzehnten Ziffer erscheint der Widerspruch, und die Zeilen lassen sich per Maus oder Tastatur hervorheben.",
          "Die Zahlenquelle bestimmt, woher die Tabelle kommt. Decimal füllt sie mit pseudozufälligen Ziffern, Binary mit pseudozufälligen Nullen und Einsen, und der Mischen-Knopf zieht eine neue Tabelle. Bei Custom tippst du eine Dezimalzahl pro Zeile ein. Die vorausgefüllte Liste beginnt mit den Ziffern von π, e, √2, dem goldenen Schnitt, ln 2 und der Euler-Mascheroni-Konstante, jeweils hinter das Komma verschoben.",
          "Die Änderungsregel bestimmt, wie dₙₙ verändert wird. Swap 5 ↔ 6 macht aus einer 5 eine 6 und aus jeder anderen Ziffer eine 5. +1 mod 10 zählt eins dazu, überspringt aber 0 und 9, aus einer 8 oder 9 wird also eine 1. Im Binärmodus wird die Regel ignoriert, und die Bits wechseln einfach zwischen 0 und 1; die Zeilen gelten dann als 0/1-Folgen, nicht als Zahlen (das vorangestellte «0.» entfällt).",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Es gibt kein Canvas: Die Tabelle ist eine gewöhnliche HTML-Tabelle, Screenreader können sie also durchgehen. Die Zufallstabellen stammen aus einem kleinen linearen Kongruenzgenerator (Faktor 1664525, Inkrement 1013904223, modulo 2³²), dessen Startwert sich beim Mischen ändert.",
          "Die Ziffern von s werden gar nicht als Zustand gespeichert. Die Komponente merkt sich nur den aktuellen Schritt und berechnet s bei jedem Rendern neu aus der Tabelle, indem sie die Diagonale liest und die gewählte Regel anwendet. Deshalb setzt ein Wechsel der Quelle, der Regel oder einer eigenen Zeile den Schritt zurück. Play ist ein einfacher Intervall-Timer, der den Schritt weiterzählt. Die einzige Daueranimation ist ein sanftes Pulsieren der neuesten Ziffer, das die seitenweite Regel für reduzierte Bewegung abschaltet.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Warum 0 und 9 tabu sind",
        paragraphs: [
          "Manche reellen Zahlen haben zwei Dezimaldarstellungen: 0,4999… und 0,5000… sind dieselbe Zahl. Endete s mit lauter Neunen, könnte es mit einer gelisteten Zahl übereinstimmen, die mit Nullen endet, obwohl beide sich Ziffer für Ziffer unterscheiden, und der Beweis bräche zusammen. Ersatzziffern, die nie 0 oder 9 sind, schließen das aus, denn eine Darstellung ganz ohne 0 und 9 ist die einzige Schreibweise dieser Zahl. Beide Dezimalregeln halten sich daran. Im Binären gibt es dieselbe Falle (0,0111… ist gleich 0,1000…), und durch Umdrehen von Bits lässt sie sich nicht vermeiden. Deshalb macht es der Explorer im Binärmodus wie das Lehrbuch: Er argumentiert mit unendlichen 0/1-Folgen statt mit reellen Zahlen und folgert, dass es mehr solche Folgen als natürliche Zahlen gibt.",
          "Denk daran, dass sechzehn Zeilen nur eine Illustration sind. Eine endliche Liste lässt sich immer mit roher Gewalt schlagen. Die Stärke des Arguments ist, dass dasselbe Rezept auch eine unendliche Liste besiegt, weil Zeile n an Ziffer n geprüft wird, egal wie weit unten sie steht.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Sieh zu, wie s entkommt",
        text: "Bleib bei der Dezimalquelle und Swap 5 ↔ 6, drück Play und folge der bernsteinfarbenen Zelle die Diagonale hinunter.",
      },
      {
        title: "Versuch, s zu fangen",
        text: "Wechsle zu Custom und lass Zeile 1 mit 5 beginnen, Zeile 2 mit 05, Zeile 3 mit 005 und so weiter. Mit Swap 5 ↔ 6 wird jede 5 auf der Diagonale zur 6, und s = 0,666… schlüpft trotzdem an jeder Zeile vorbei.",
      },
      {
        title: "Die beiden Regeln vergleichen",
        text: "Lass dieselbe Tabelle einmal mit Swap 5 ↔ 6 und einmal mit +1 mod 10 laufen. Du bekommst zwei verschiedene Zahlen s, beide fehlen in der Liste. Der Beweis liefert so viele fehlende reelle Zahlen, wie du willst.",
      },
      {
        title: "Binärmodus",
        text: "Wähle Binary und geh Schritt für Schritt durch. Jedes Diagonalbit wird umgedreht, und s ist eine 0/1-Folge, die in der Liste fehlt. Achte darauf, dass das Panel jetzt von Folgen spricht, nicht von Zahlen, wegen des Hakens mit 0,0111… = 0,1000… von oben.",
      },
    ],
  },
};
