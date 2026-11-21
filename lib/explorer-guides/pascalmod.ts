import type { ExplorerGuide } from "./types";

// Numbers quoted here (rows 16 to 512 in steps of 8, default 256, the prime
// buttons 2 to 23, the 0.92 row spacing, the 11 nonzero palette colours)
// match app/pascalmod/explorer/page.tsx; update both together.
const ROWS_EXCERPT = `let prev = new Uint8Array(1);
prev[0] = 1;
for (let n = 0; n < maxRow; n++) {
  const len = n + 1;
  for (let k = 0; k < len; k++) {
    const r = prev[k];
    if (r !== 0) {
      const x = offsetX + (maxRow - n) * (cellSize / 2) + k * cellSize;
      const y = offsetY + n * cellSize * 0.92;
      ctx.fillStyle = colourFor(r);
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
  const next = new Uint8Array(len + 1);
  next[0] = 1 % modulus;
  next[len] = 1 % modulus;
  for (let k = 0; k < len - 1; k++) next[k + 1] = (prev[k] + prev[k + 1]) % modulus;
  prev = next;
}`;

export const PASCALMOD_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Colour Pascal's triangle modulo a prime and watch Sierpiński gaskets appear. Explore Lucas's and Kummer's theorems with up to 512 rows, live in the browser.",
    heading: "How this explorer works",
    intro:
      "Every small square on the canvas is one binomial coefficient C(n, k), the number in row n and position k of Pascal's triangle. Instead of writing the number down, the explorer only keeps its remainder after division by a prime p and paints that remainder as a colour. Remainder zero, meaning p divides the number, is left blank. What remains is not noise but a nested pattern of triangles inside triangles: for p = 2 it is the Sierpiński gasket, for other primes a gasket with p(p + 1)/2 copies of itself instead of three.",
    sections: [
      {
        heading: "One addition rule, read modulo p",
        paragraphs: [
          "Pascal's triangle is built by a single rule: each entry is the sum of the two entries above it, with ones along both edges. The numbers grow very fast (the middle of row 511, the last one you can draw, has more than 150 digits), but remainders behave well under addition. If you only care about C(n, k) mod p, you can apply the same rule to the remainders and never touch a large number at all.",
          "Why the blank regions form triangles is explained by Lucas's theorem. Write n and k in base p, with digits n_i and k_i. Then C(n, k) mod p is simply the product of the small coefficients C(n_i, k_i), digit by digit. A factor is zero exactly when some digit of k is larger than the corresponding digit of n. For p = 2 this gives a famous shortcut: C(n, k) is odd exactly when every binary 1 of k also appears in n.",
        ],
        formula:
          "\\binom{n}{k} \\equiv \\prod_{i} \\binom{n_i}{k_i} \\pmod p, \\qquad n = \\sum_i n_i p^i,\\; k = \\sum_i k_i p^i",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The modulus buttons choose the prime p from 2, 3, 5, 7, 11, 13, 17, 19 and 23; the explorer starts at p = 2. The overlay names the result: «Sierpiński» for p = 2, otherwise «p-gasket». The rows slider runs from 16 to 512 in steps of 8 and starts at 256. More rows mean smaller cells and deeper levels of the fractal; the triangle always scales to fit the canvas.",
          "The residue legend in the sidebar shows which colour stands for which remainder from 0 to p − 1. There are eleven distinct colours for nonzero remainders, so from p = 13 upward the colours start to repeat. The blank, though, is never reused: a nonzero remainder can never be painted as background, so every gap you see really is a multiple of p.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The whole picture is computed on a 2D canvas in one pass. The code keeps only the previous row, as a Uint8Array of remainders, and builds the next row from it with the addition rule taken mod p. Since p is at most 23, any sum of two remainders fits comfortably into a byte. Memory therefore grows with the row length, not with the size of the triangle, and with 512 rows the loop visits about 131,000 cells.",
          "Each nonzero cell becomes one filled square. Row n is shifted right by half a cell per missing entry, which centres the triangle, and rows are placed 0.92 cell heights apart, so the triangle is slightly flatter than it is wide. The canvas is sized in device pixels, so the cells stay crisp on high-density screens. There is no animation at all: the picture is redrawn only when you change p or the row count, or when a ResizeObserver reports a new canvas size. That also means there is nothing to slow down for reduced-motion settings.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Counting carries: Kummer's view",
        paragraphs: [
          "The sidebar hint names Lucas's theorem. Kummer's theorem looks at the same pattern from another angle. It says that the exponent of p in C(n, k) equals the number of carries when you add k and n − k in base p. So a cell is blank exactly when that addition produces at least one carry, and coloured exactly when it does not.",
          "From either theorem you can count the coloured cells. The first p^m rows contain exactly (p(p + 1)/2)^m entries not divisible by p, because each level of the pattern consists of p(p + 1)/2 smaller copies. That gives the fractal a dimension of log(p(p + 1)/2) / log p: about 1.585 for p = 2, about 1.631 for p = 3 and about 1.683 for p = 5. The larger the prime, the closer the dimension gets to 2 and the more the triangle looks filled in.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A full row, then an empty one",
        text: "Keep p = 2 and 256 rows. The bottom row is row 255, and 255 is 11111111 in binary, so every entry is odd and the row is solid. Raise the slider to 264: row 256 appears, and it is blank except for its two ends, because 256 is a single 1 followed by zeros.",
      },
      {
        title: "Exactly one gasket of 343",
        text: "Pick p = 7 and set the rows to 344. The first 343 rows (7 cubed) form one complete level-three gasket, and the extra row underneath, row 343, shows only its two corner cells. Every coloured row segment inside follows the base-7 digits of its row number.",
      },
      {
        title: "Read the alternating row",
        text: "Choose p = 5 with 16 rows and compare row 4 with the legend. Its entries 1, 4, 6, 4, 1 become 1, 4, 1, 4, 1 mod 5: in general row p − 1 alternates between 1 and p − 1, because C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Watch the gaps shrink",
        text: "With 512 rows, step through p = 2, 3, 5, 11 and 23. The blank triangles become rarer and the coloured area grows, just as the dimension formula predicts. At p = 23 the basic block is 23 rows tall, so 512 rows are not even enough to finish the second level of the pattern: that would take 23 × 23 = 529 rows.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Pascalsche Dreieck modulo einer Primzahl einfärben und Sierpiński-Dreiecke entstehen sehen. Mit bis zu 512 Zeilen die Sätze von Lucas und Kummer erkunden.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jedes kleine Quadrat auf dem Canvas ist ein Binomialkoeffizient C(n, k), also die Zahl in Zeile n an Position k des Pascalschen Dreiecks. Statt die Zahl hinzuschreiben, merkt sich der Explorer nur ihren Rest bei Division durch eine Primzahl p und malt diesen Rest als Farbe. Rest null, also «p teilt die Zahl», bleibt leer. Übrig bleibt kein Rauschen, sondern ein verschachteltes Muster aus Dreiecken in Dreiecken: Für p = 2 ist es das Sierpiński-Dreieck, für andere Primzahlen ein Sieb mit p(p + 1)/2 Kopien seiner selbst statt drei.",
    sections: [
      {
        heading: "Eine Additionsregel, modulo p gelesen",
        paragraphs: [
          "Das Pascalsche Dreieck entsteht aus einer einzigen Regel: Jeder Eintrag ist die Summe der beiden darüber, an beiden Rändern stehen Einsen. Die Zahlen wachsen rasant (die Mitte von Zeile 511, der letzten, die du zeichnen kannst, hat mehr als 150 Stellen), aber Reste vertragen sich gut mit Addition. Interessiert dich nur C(n, k) mod p, kannst du dieselbe Regel direkt auf die Reste anwenden und musst nie eine große Zahl anfassen.",
          "Warum die leeren Bereiche Dreiecke bilden, erklärt der Satz von Lucas. Schreib n und k zur Basis p, mit den Ziffern n_i und k_i. Dann ist C(n, k) mod p einfach das Produkt der kleinen Koeffizienten C(n_i, k_i), Ziffer für Ziffer. Ein Faktor ist genau dann null, wenn eine Ziffer von k größer ist als die passende Ziffer von n. Für p = 2 ergibt das eine bekannte Abkürzung: C(n, k) ist genau dann ungerade, wenn jede binäre 1 von k auch in n vorkommt.",
        ],
        formula:
          "\\binom{n}{k} \\equiv \\prod_{i} \\binom{n_i}{k_i} \\pmod p, \\qquad n = \\sum_i n_i p^i,\\; k = \\sum_i k_i p^i",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Modulus-Knöpfe wählen die Primzahl p aus 2, 3, 5, 7, 11, 13, 17, 19 und 23; der Explorer startet bei p = 2. Das Overlay benennt das Ergebnis: «Sierpiński» für p = 2, sonst «p-gasket». Der Zeilen-Regler reicht von 16 bis 512 in Achterschritten und startet bei 256. Mehr Zeilen bedeuten kleinere Zellen und tiefere Ebenen des Fraktals; das Dreieck passt sich immer an das Canvas an.",
          "Die Rest-Legende in der Seitenleiste zeigt, welche Farbe für welchen Rest von 0 bis p − 1 steht. Für Reste ungleich null gibt es elf verschiedene Farben, ab p = 13 wiederholen sie sich also. Das Leere wird dagegen nie wiederverwendet: Ein Rest ungleich null kann nie als Hintergrund gemalt werden, jede Lücke ist also wirklich ein Vielfaches von p.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das ganze Bild wird in einem Durchgang auf einem 2D-Canvas berechnet. Der Code hält nur die vorige Zeile als Uint8Array von Resten und baut daraus mit der Additionsregel mod p die nächste. Weil p höchstens 23 ist, passt die Summe zweier Reste bequem in ein Byte. Der Speicher wächst also mit der Zeilenlänge, nicht mit der Größe des Dreiecks, und bei 512 Zeilen besucht die Schleife rund 131.000 Zellen.",
          "Jede Zelle ungleich null wird zu einem gefüllten Quadrat. Zeile n rückt pro fehlendem Eintrag eine halbe Zelle nach rechts, das zentriert das Dreieck, und die Zeilen liegen 0,92 Zellhöhen auseinander, sodass das Dreieck etwas flacher als breit ist. Das Canvas wird in Gerätepixeln dimensioniert, die Zellen bleiben also auch auf hochauflösenden Displays scharf. Eine Animation gibt es gar nicht: Das Bild wird nur neu gezeichnet, wenn du p oder die Zeilenzahl änderst oder ein ResizeObserver eine neue Canvas-Größe meldet. Für reduzierte Bewegung muss deshalb auch nichts gebremst werden.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Überträge zählen: Kummers Blick",
        paragraphs: [
          "Der Hinweis in der Seitenleiste nennt den Satz von Lucas. Der Satz von Kummer betrachtet dasselbe Muster von einer anderen Seite. Er besagt, dass der Exponent von p in C(n, k) gleich der Anzahl der Überträge ist, wenn du k und n − k zur Basis p addierst. Eine Zelle ist also genau dann leer, wenn diese Addition mindestens einen Übertrag erzeugt, und genau dann farbig, wenn nicht.",
          "Aus beiden Sätzen lassen sich die farbigen Zellen zählen. Die ersten p^m Zeilen enthalten genau (p(p + 1)/2)^m Einträge, die nicht durch p teilbar sind, denn jede Ebene des Musters besteht aus p(p + 1)/2 kleineren Kopien. Daraus folgt eine fraktale Dimension von log(p(p + 1)/2) / log p: etwa 1,585 für p = 2, etwa 1,631 für p = 3 und etwa 1,683 für p = 5. Je größer die Primzahl, desto näher rückt die Dimension an 2 und desto gefüllter wirkt das Dreieck.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine volle Zeile, dann eine leere",
        text: "Bleib bei p = 2 und 256 Zeilen. Die unterste Zeile ist Zeile 255, und 255 ist binär 11111111, also ist jeder Eintrag ungerade und die Zeile durchgehend gefüllt. Schieb den Regler auf 264: Zeile 256 erscheint und ist bis auf ihre beiden Enden leer, weil 256 binär eine einzelne 1 mit lauter Nullen ist.",
      },
      {
        title: "Genau ein Sieb aus 343 Zeilen",
        text: "Wähle p = 7 und stell 344 Zeilen ein. Die ersten 343 Zeilen (7 hoch 3) bilden ein vollständiges Sieb dritter Stufe, und die zusätzliche Zeile darunter, Zeile 343, zeigt nur ihre beiden Eckzellen. Jedes farbige Stück einer Zeile folgt den Ziffern ihrer Zeilennummer zur Basis 7.",
      },
      {
        title: "Die alternierende Zeile lesen",
        text: "Nimm p = 5 mit 16 Zeilen und vergleiche Zeile 4 mit der Legende. Ihre Einträge 1, 4, 6, 4, 1 werden mod 5 zu 1, 4, 1, 4, 1. Allgemein wechselt Zeile p − 1 zwischen 1 und p − 1, denn C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Die Lücken schrumpfen sehen",
        text: "Geh bei 512 Zeilen nacheinander p = 2, 3, 5, 11 und 23 durch. Die leeren Dreiecke werden seltener und die farbige Fläche wächst, genau wie die Dimensionsformel es vorhersagt. Bei p = 23 ist der Grundblock 23 Zeilen hoch, 512 Zeilen reichen also nicht einmal für die zweite Stufe des Musters: Dafür bräuchte es 23 × 23 = 529 Zeilen.",
      },
    ],
  },
};
