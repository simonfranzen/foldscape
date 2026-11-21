import type { ExplorerGuide } from "./types";

// Numbers quoted here (side 51 to 501 in steps of 2, default 251; prime counts
// 378, 6,320 and 22,115; the n < 600 highlight range; the ±40 diagonals of
// Euler's polynomial) were computed with buildSieve() and spiralCoord() from
// app/ulam/explorer/page.tsx; update both together.
const SPIRAL_EXCERPT = `// Spiral coordinate for n (1-indexed), centred at (0, 0).
function spiralCoord(n: number): [number, number] {
  if (n === 1) return [0, 0];
  // ring k contains numbers (2k-1)² + 1 .. (2k+1)²
  const k = Math.ceil((Math.sqrt(n) - 1) / 2);
  const sideLen = 2 * k;
  const off = n - ((2 * k - 1) * (2 * k - 1) + 1);
  let x = k, y = -(k - 1);
  if (off < sideLen) y += off;                     // up the right side
  else if (off < 2 * sideLen) { y += sideLen - 1; x -= off - sideLen + 1; }  // top
  else if (off < 3 * sideLen) { y = k - (off - 2 * sideLen + 1); x = -k; }  // left
  else { y = -k; x = -k + (off - 3 * sideLen + 1); }                       // bottom
  return [x, y];
}`;

export const ULAM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Ulam spiral of primes: up to 251,001 numbers on a square spiral, prime-rich diagonals, and Euler's n² − n + 41 highlighted in place.",
    heading: "How this explorer works",
    intro:
      "Write 1 in the middle of a grid, 2 to its right, and keep counting in a square spiral, anticlockwise, ring after ring. Then mark only the primes. At the default size of 251 × 251 the grid holds 63,001 numbers, 6,320 of them prime, and the marks do not look like random dust: they line up along diagonals. Stanisław Ulam noticed this in 1963 while doodling during a talk. Part of the pattern has a simple explanation, and part of it is still an open problem.",
    sections: [
      {
        heading: "Why primes like diagonals",
        paragraphs: [
          "The first reason is parity. In this spiral a number is odd exactly when x + y is even, so odd and even numbers form a checkerboard. A diagonal step changes x + y by 0 or 2, which keeps the parity, so every diagonal line consists entirely of odd numbers or entirely of even ones. Since every prime except 2 is odd, half of all diagonals carry no primes at all (apart from the single 2), and the primes are forced onto the other half.",
          "The second reason is algebra. Walking along a diagonal ray, the numbers you meet are the values of a quadratic polynomial, for example 1, 9, 25, 49, … = (2n + 1)² on the ray running to the lower right of 1. Some quadratics can never be prime, because they factor or are always divisible by a small prime. Others avoid all small divisors and produce primes far more often than average. Hardy and Littlewood conjectured in 1923 exactly how often each quadratic should hit primes; nobody has proved that any quadratic produces infinitely many.",
        ],
        formula:
          "f(n) = n^2 - n + 41 \\text{ is prime for } n = 0, 1, \\dots, 40, \\qquad f(41) = 41^2",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The grid side runs from 51 to 501 in steps of 2. It stays odd so that 1 sits in the exact centre cell, which is outlined in cyan. The header shows how many numbers the grid holds and how many of them are prime: 378 primes among 2,601 numbers at the smallest size, 22,115 among 251,001 at the largest.",
          "The highlight menu colours the primes that are values of a chosen quadratic in pink: Euler's n² − n + 41 (the default), n² + n + 17, n² + n + 11, 4n² − 2n + 41 and n², or switches highlighting off. Only primes are drawn, so a pink cell is always a prime value of the polynomial; values for n from 0 to 599 are checked.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Primality comes from a sieve of Eratosthenes over a Uint8Array with one byte per number up to side² + 5, recomputed only when the grid size changes. Even at the largest size that is about a quarter of a million bytes and takes a few milliseconds.",
          "Placing a number does not require walking the spiral. Ring k around the centre holds the numbers from (2k − 1)² + 1 to (2k + 1)², because each ring ends with an odd square in its lower right corner. From n the code computes its ring with one square root, then its offset within the ring, and the offset tells which of the four sides it lies on and where. The function below is that closed form.",
          "The canvas is sized to the device pixel ratio and redrawn whenever the grid size, the highlight or the window size changes. Every prime is a filled square, amber or pink. The highlighted cells are stored in a Set of packed (x, y) keys, so the draw loop can check each prime in constant time. Nothing is animated, so a reduced-motion setting has nothing to switch off.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "What the polynomials show",
        paragraphs: [
          "Euler's polynomial n² − n + 41 gives primes for the 41 consecutive values n = 0 to 40, and fails at n = 41, where it equals 41². n² + n + 17 is prime for n = 0 to 15 and n² + n + 11 for n = 0 to 9. 4n² − 2n + 41 is Euler's polynomial evaluated at 2n, so it picks every second value and is prime for n = 0 to 20.",
          "On the spiral, those guaranteed primes are scattered near the centre, because the constant 41 is larger than the inner rings. From n = 40 on, though, every value of Euler's polynomial lands on one of two diagonal lines that run from the lower left to the upper right, shifted 40 columns to either side of the diagonal through 1. Within the default grid about seven in ten of those later values are still prime, so the lines stay visibly pink. n² is the counterexample: no square is prime, so nothing turns pink at all.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Measure how primes thin out",
        text: "Compare the smallest grid (378 primes among 2,601 numbers, about 14.5 percent) with the largest (22,115 among 251,001, about 8.8 percent). Both match the prime number theorem's estimate 1/(ln N − 1) to within a few tenths of a percent.",
      },
      {
        title: "Follow Euler's lines",
        text: "Keep Euler's polynomial selected at side 251. Ignore the pink cluster near the centre and look further out: two parallel pink diagonals run from the lower left to the upper right, 40 cells away from the centre on either side.",
      },
      {
        title: "Find the empty diagonal",
        text: "Select n² and start at the cyan centre cell. Follow the diagonal down and to the right: it holds 9, 25, 49 and every other odd square, so not a single cell on it is marked. That dark ray is the simplest prime-free diagonal there is.",
      },
      {
        title: "Zoom out",
        text: "Drag the side to 501. The grid now holds a quarter of a million numbers and the cells become tiny, but the diagonal streaks stand out more clearly than at small sizes, while the overall density keeps falling.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die Ulam-Spirale der Primzahlen erkunden: bis zu 251.001 Zahlen auf einer Quadratspirale, primzahlreiche Diagonalen und Eulers n² − n + 41 hervorgehoben.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Schreib die 1 in die Mitte eines Gitters, die 2 rechts daneben, und zähl in einer quadratischen Spirale gegen den Uhrzeigersinn weiter, Ring für Ring. Dann markierst du nur die Primzahlen. In der Standardgröße von 251 × 251 enthält das Gitter 63.001 Zahlen, davon 6.320 Primzahlen, und die Markierungen sehen nicht aus wie zufälliger Staub: Sie reihen sich entlang von Diagonalen auf. Stanisław Ulam bemerkte das 1963, als er während eines Vortrags kritzelte. Ein Teil des Musters hat eine einfache Erklärung, ein anderer ist bis heute offen.",
    sections: [
      {
        heading: "Warum Primzahlen Diagonalen mögen",
        paragraphs: [
          "Der erste Grund ist die Parität. In dieser Spirale ist eine Zahl genau dann ungerade, wenn x + y gerade ist, gerade und ungerade Zahlen bilden also ein Schachbrett. Ein Diagonalschritt ändert x + y um 0 oder 2 und erhält damit die Parität. Jede Diagonale besteht also nur aus ungeraden oder nur aus geraden Zahlen. Weil jede Primzahl außer 2 ungerade ist, trägt die Hälfte aller Diagonalen überhaupt keine Primzahlen (bis auf die einzelne 2), und die Primzahlen müssen sich auf die andere Hälfte drängen.",
          "Der zweite Grund ist Algebra. Entlang eines diagonalen Strahls sind die Zahlen, denen du begegnest, Werte eines quadratischen Polynoms, zum Beispiel 1, 9, 25, 49, … = (2n + 1)² auf dem Strahl, der von der 1 nach rechts unten läuft. Manche quadratischen Polynome können nie prim sein, weil sie sich faktorisieren lassen oder immer durch eine kleine Primzahl teilbar sind. Andere meiden alle kleinen Teiler und liefern viel öfter Primzahlen als der Durchschnitt. Hardy und Littlewood vermuteten 1923, wie oft genau jedes Polynom Primzahlen treffen sollte; dass irgendein quadratisches Polynom unendlich viele liefert, hat noch niemand bewiesen.",
        ],
        formula:
          "f(n) = n^2 - n + 41 \\text{ ist prim für } n = 0, 1, \\dots, 40, \\qquad f(41) = 41^2",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Gitterseite reicht von 51 bis 501 in Zweierschritten. Sie bleibt ungerade, damit die 1 genau in der mittleren Zelle sitzt, die cyan umrandet ist. Die Kopfzeile zeigt, wie viele Zahlen das Gitter enthält und wie viele davon prim sind: 378 Primzahlen unter 2.601 Zahlen in der kleinsten Größe, 22.115 unter 251.001 in der größten.",
          "Das Hervorhebungsmenü färbt die Primzahlen rosa, die Werte eines gewählten Polynoms sind: Eulers n² − n + 41 (voreingestellt), n² + n + 17, n² + n + 11, 4n² − 2n + 41 und n², oder schaltet die Hervorhebung aus. Gezeichnet werden nur Primzahlen, eine rosa Zelle ist also immer ein primer Wert des Polynoms; geprüft werden die Werte für n von 0 bis 599.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Ob eine Zahl prim ist, liefert ein Sieb des Eratosthenes über ein Uint8Array mit einem Byte pro Zahl bis Seite² + 5, neu berechnet nur, wenn sich die Gittergröße ändert. Selbst in der größten Größe ist das etwa eine Viertelmillion Bytes und dauert ein paar Millisekunden.",
          "Um eine Zahl zu platzieren, muss niemand die Spirale ablaufen. Ring k um die Mitte enthält die Zahlen von (2k − 1)² + 1 bis (2k + 1)², weil jeder Ring mit einem ungeraden Quadrat in seiner rechten unteren Ecke endet. Aus n berechnet der Code mit einer Quadratwurzel den Ring, dann den Versatz innerhalb des Rings, und der Versatz verrät, auf welcher der vier Seiten die Zahl liegt und wo. Die Funktion unten ist diese geschlossene Formel.",
          "Das Canvas ist an die Pixeldichte des Geräts angepasst und wird neu gezeichnet, sobald sich Gittergröße, Hervorhebung oder Fenstergröße ändern. Jede Primzahl ist ein gefülltes Quadrat, bernsteinfarben oder rosa. Die hervorgehobenen Zellen liegen als gepackte (x, y)-Schlüssel in einem Set, so prüft die Zeichenschleife jede Primzahl in konstanter Zeit. Nichts ist animiert, eine Einstellung für reduzierte Bewegung hat hier also nichts abzuschalten.",
        ],
        code: SPIRAL_EXCERPT,
      },
      {
        heading: "Was die Polynome zeigen",
        paragraphs: [
          "Eulers Polynom n² − n + 41 liefert Primzahlen für die 41 aufeinanderfolgenden Werte n = 0 bis 40 und scheitert bei n = 41, wo es 41² ergibt. n² + n + 17 ist prim für n = 0 bis 15, n² + n + 11 für n = 0 bis 9. 4n² − 2n + 41 ist Eulers Polynom an der Stelle 2n, es greift also jeden zweiten Wert heraus und ist prim für n = 0 bis 20.",
          "Auf der Spirale liegen diese garantierten Primzahlen verstreut in der Nähe der Mitte, weil die Konstante 41 größer ist als die inneren Ringe. Ab n = 40 aber landet jeder Wert von Eulers Polynom auf einer von zwei Diagonalen, die von links unten nach rechts oben laufen, um 40 Spalten zu beiden Seiten der Diagonale durch die 1 verschoben. Im Standardgitter sind etwa sieben von zehn dieser späteren Werte noch prim, die Linien bleiben also sichtbar rosa. n² ist das Gegenbeispiel: Kein Quadrat ist prim, also wird überhaupt nichts rosa.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Messen, wie Primzahlen seltener werden",
        text: "Vergleiche das kleinste Gitter (378 Primzahlen unter 2.601 Zahlen, etwa 14,5 Prozent) mit dem größten (22.115 unter 251.001, etwa 8,8 Prozent). Beide treffen die Schätzung 1/(ln N − 1) aus dem Primzahlsatz bis auf wenige Zehntelprozent.",
      },
      {
        title: "Eulers Linien folgen",
        text: "Lass Eulers Polynom bei Seite 251 ausgewählt. Übersieh die rosa Häufung nahe der Mitte und schau weiter nach außen: Zwei parallele rosa Diagonalen laufen von links unten nach rechts oben, 40 Zellen auf beiden Seiten der Mitte.",
      },
      {
        title: "Die leere Diagonale finden",
        text: "Wähle n² und beginne bei der cyan umrandeten Mittelzelle. Folge der Diagonale nach rechts unten: Auf ihr liegen 9, 25, 49 und alle weiteren ungeraden Quadrate, keine einzige Zelle darauf ist markiert. Dieser dunkle Strahl ist die einfachste primzahlfreie Diagonale überhaupt.",
      },
      {
        title: "Herauszoomen",
        text: "Zieh die Seite auf 501. Das Gitter enthält jetzt eine Viertelmillion Zahlen und die Zellen werden winzig, aber die diagonalen Streifen treten deutlicher hervor als bei kleinen Größen, während die Gesamtdichte weiter sinkt.",
      },
    ],
  },
};
