import type { ExplorerGuide } from "./types";

// Numbers quoted here (200 terms, 80 samples per unit of t, the 0.18 dip
// threshold, 400 samples on [2, 200], 50 zero heights) match
// app/riemann/explorer/page.tsx; update both together.
const ZETA_EXCERPT = `function zeta(s: Cx, N: number): Cx {
  let eta: Cx = { re: 0, im: 0 };
  for (let n = 1; n <= N; n++) {
    const term = cDiv({ re: 1, im: 0 }, nPowS(n, s));
    eta = n % 2 === 1 ? cAdd(eta, term) : cSub(eta, term);
  }
  // divide by (1 - 2^(1-s)) to turn eta back into zeta
  return cDiv(eta, denom);
}

function piApprox(x: number, nZeros: number): number {
  let val = riemannR(x);
  for (let i = 0; i < nZeros; i++) {
    val -= 2 * liComplexLead(x, ZERO_HEIGHTS[i]).re;
  }
  return val;
}`;

export const RIEMANN_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Riemann zeta function on the critical line: trace ζ(½ + it), find zeros at t ≈ 14.13, 21.02, 25.01 and watch them rebuild the prime staircase.",
    heading: "How this explorer works",
    intro:
      "There are two plots. The upper one counts primes: a grey staircase that steps up by one at every prime up to 200, and a warm smooth curve that tries to follow it. The lower one follows the Riemann zeta function along the vertical line Re(s) = ½ and draws where its values land in the complex plane. Every time that path runs through the origin, ζ has a zero. Those zeros are exactly what the warm curve in the upper plot is built from.",
    sections: [
      {
        heading: "Zeros and primes",
        paragraphs: [
          "For Re(s) > 1 the zeta function is the sum of 1/n^s over all positive integers, and Euler showed that it equals a product over all primes. That product is why ζ knows about primes at all. Riemann extended the function to the whole complex plane (except s = 1) and, in his 1859 paper, wrote down an explicit formula: the count of primes below x equals a smooth main term minus one oscillating correction for every non-trivial zero.",
          "The non-trivial zeros come in mirror-image pairs above and below the real axis. Every one found so far lies on the line Re(s) = ½, so it has the form ½ ± iγ, and the Riemann hypothesis claims that this holds for all of them. The first heights are γ ≈ 14.1347, 21.0220 and 25.0109; the explorer stores the first 50 of them, up to γ ≈ 143.11.",
        ],
        formula:
          "\\pi(x) \\approx R(x) - \\sum_{\\gamma} 2\\,\\operatorname{Re}\\frac{x^{1/2 + i\\gamma}}{(1/2 + i\\gamma)\\,\\ln x}, \\qquad R(x) = 1 + \\sum_{k \\ge 1} \\frac{(\\ln x)^k}{k \\cdot k! \\cdot \\zeta(k+1)}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "t_max (5 to 60, default 45) sets how far up the critical line the lower plot goes. The path starts at ζ(½) ≈ −1.46 on the negative real axis and gets brighter as t grows. With t_max = 45 it passes through the origin eight times, once for each zero below 45. The list in the panel shows the heights where the path came close enough to count; push t_max to 60 and it grows to 13 entries, the last near 59.35.",
          "N (20 to 500, default 200) is the number of terms used to evaluate ζ. More terms mean a more accurate path, especially high up the line; fewer terms make the curve slightly wrong and, at large t, visibly shaky.",
          "N_zeros (0 to 50, default 8) is how many zero pairs feed the warm curve in the upper plot. At 0 you see Riemann's smooth function R(x) on its own, which already runs through the middle of the steps: R(100) ≈ 25.66, and there are 25 primes below 100. Each extra zero adds a wave whose frequency grows with γ, and together these waves make the curve rise faster at the primes and flatten between them. The badge in the corner reports the largest gap between the two curves over the visible range. It falls from about 1.7 with no zeros to about 1.1 with 8 and about 0.9 with all 50.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The familiar series for ζ does not converge on the critical line, so the code uses the Dirichlet eta function instead: the alternating sum 1 − 1/2^s + 1/3^s − … converges for every s with positive real part, and dividing it by 1 − 2^(1−s) gives ζ back.",
          "The trace samples t at 80 points per unit (at least 500 points), evaluates ζ at each, and is memoised, so moving N_zeros never recomputes it. Zeros are found by scanning for local minima of |ζ| that dip below 0.18. The upper plot samples 400 points between x = 2 and 200, takes π(x) from a table of the first 80 primes, and computes R(x) from the Gram series shown above, which converges for every x.",
          "For each zero the correction uses the leading asymptotic term x^ρ / (ρ ln x) instead of the full complex li(x^ρ), and the conjugate zero is handled by doubling the real part. Both plots are static 2D canvases that redraw only when a slider changes or the pane is resized, so there is no animation to switch off for reduced motion.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Why the curve never lands exactly on the steps",
        paragraphs: [
          "Riemann's smooth function R(x) = Σ μ(n)/n · li(x^(1/n)) is built from the logarithmic integral li and already accounts for prime powers, which is why it sits so much closer to the staircase than li(x) alone (li(100) ≈ 30.1). The exact formula subtracts R(x^ρ) for every zero ρ plus two small extra terms. The explorer keeps R(x) in full and only the leading part of each zero term. Measured on the plot, the warm curve is then on average only about 0.05 above π(x), for any number of zeros. It can never match exactly: a continuous curve must miss a jump of height 1 by at least ½, so the badge has a floor near 0.5. Every zero contributes a wave of amplitude about √x / (γ ln x), the waves interfere, and the more of them you add, the sharper the rises at the primes become.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Find the first zero",
        text: "Set t_max to 13 and look at the lower plot: the path swings around but misses the origin, and the zero list is empty. Raise it to 15. The path now cuts through the origin and the list shows γ₁ near 14.13.",
      },
      {
        title: "From R(x) to the staircase",
        text: "Set N_zeros to 0 and note the error badge (about 1.7). Then step through 1, 3, 8, 20 and 50. The smooth curve develops ripples that climb at the primes and level off in the gaps, and the badge drops to about 1.1 at 8 and about 0.9 at 50. It does not fall at every single step: between 1 and 3 it wobbles around 1.4.",
      },
      {
        title: "Starve the series",
        text: "Put t_max at 60 and drop N to 20. Compare the path with N = 500. The rough version still loops near the origin at the right heights, but the shape near the top end of the trace drifts. Accuracy at large t needs more terms.",
      },
      {
        title: "Two zeros close together",
        text: "Zeros 4 and 5 sit at about 30.42 and 32.94. Set t_max to 34 and follow the brightest end of the path: it threads the origin twice in quick succession, with only a small loop in between.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die riemannsche Zetafunktion live: ζ(½ + it) verfolgen, Nullstellen bei t ≈ 14,13, 21,02 und 25,01 finden und sehen, wie sie die Primzahltreppe nachbauen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die beiden Bilder zeigen dasselbe Geheimnis von zwei Seiten. Oben werden Primzahlen gezählt: eine graue Treppe, die bei jeder Primzahl bis 200 um eins steigt, und eine warme, glatte Kurve, die ihr zu folgen versucht. Unten läuft die riemannsche Zetafunktion die senkrechte Linie Re(s) = ½ hinauf, und das Bild zeigt, wo ihre Werte in der komplexen Ebene landen. Jedes Mal, wenn dieser Weg durch den Ursprung führt, hat ζ eine Nullstelle. Genau aus diesen Nullstellen ist die warme Kurve oben gebaut.",
    sections: [
      {
        heading: "Nullstellen und Primzahlen",
        paragraphs: [
          "Für Re(s) > 1 ist die Zetafunktion die Summe von 1/n^s über alle positiven ganzen Zahlen, und Euler hat gezeigt, dass sie einem Produkt über alle Primzahlen entspricht. Deshalb weiß ζ überhaupt etwas über Primzahlen. Riemann setzte die Funktion auf die ganze komplexe Ebene fort (außer s = 1) und schrieb 1859 eine explizite Formel auf: Die Anzahl der Primzahlen unter x ist ein glatter Hauptterm minus je einer schwingenden Korrektur für jede nichttriviale Nullstelle.",
          "Die nichttrivialen Nullstellen treten in Paaren auf, gespiegelt an der reellen Achse. Jede bisher gefundene liegt auf der Linie Re(s) = ½, hat also die Form ½ ± iγ, und die Riemannsche Vermutung behauptet, dass das für alle gilt. Die ersten Höhen sind γ ≈ 14,1347, 21,0220 und 25,0109; der Explorer kennt die ersten 50, bis γ ≈ 143,11.",
        ],
        formula:
          "\\pi(x) \\approx R(x) - \\sum_{\\gamma} 2\\,\\operatorname{Re}\\frac{x^{1/2 + i\\gamma}}{(1/2 + i\\gamma)\\,\\ln x}, \\qquad R(x) = 1 + \\sum_{k \\ge 1} \\frac{(\\ln x)^k}{k \\cdot k! \\cdot \\zeta(k+1)}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "t_max (5 bis 60, Standard 45) legt fest, wie weit das untere Bild die kritische Linie hinaufgeht. Der Weg beginnt bei ζ(½) ≈ −1,46 auf der negativen reellen Achse und wird mit wachsendem t heller. Bei t_max = 45 läuft er achtmal durch den Ursprung, einmal für jede Nullstelle unter 45. Die Liste im Panel zeigt die Höhen, an denen der Weg nah genug herankam; schiebst du t_max auf 60, wächst sie auf 13 Einträge, der letzte bei etwa 59,35.",
          "N (20 bis 500, Standard 200) ist die Zahl der Glieder, mit denen ζ ausgewertet wird. Mehr Glieder ergeben einen genaueren Weg, vor allem weit oben auf der Linie; mit weniger Gliedern wird die Kurve leicht falsch und bei großem t sichtbar zittrig.",
          "N_zeros (0 bis 50, Standard 8) bestimmt, wie viele Nullstellenpaare in die warme Kurve oben eingehen. Bei 0 siehst du Riemanns glatte Funktion R(x) allein, die schon mitten durch die Stufen läuft: R(100) ≈ 25,66, und unter 100 gibt es 25 Primzahlen. Jede weitere Nullstelle fügt eine Welle hinzu, deren Frequenz mit γ wächst, und zusammen lassen diese Wellen die Kurve an den Primzahlen schneller steigen und dazwischen abflachen. Die Plakette in der Ecke zeigt den größten Abstand der beiden Kurven im sichtbaren Bereich. Er fällt von etwa 1,7 ohne Nullstellen auf etwa 1,1 mit 8 und etwa 0,9 mit allen 50. Zurücksetzen stellt alle drei Regler auf ihre Standardwerte.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die bekannte Reihe für ζ konvergiert auf der kritischen Linie nicht, deshalb nutzt der Code die Dirichletsche Etafunktion: Die alternierende Summe 1 − 1/2^s + 1/3^s − … konvergiert für jedes s mit positivem Realteil, und geteilt durch 1 − 2^(1−s) ergibt sie wieder ζ.",
          "Die Spur tastet t mit 80 Punkten pro Einheit ab (mindestens 500 Punkte), wertet an jedem ζ aus und wird zwischengespeichert, sodass ein Verschieben von N_zeros sie nie neu berechnet. Nullstellen findet der Code als lokale Minima von |ζ|, die unter 0,18 fallen. Das obere Bild nimmt 400 Stützstellen zwischen x = 2 und 200, liest π(x) aus einer Tabelle der ersten 80 Primzahlen und berechnet R(x) über die oben gezeigte Gram-Reihe, die für jedes x konvergiert.",
          "Für jede Nullstelle verwendet die Korrektur statt des vollen komplexen li(x^ρ) nur den führenden asymptotischen Term x^ρ / (ρ ln x), und die konjugierte Nullstelle wird durch Verdoppeln des Realteils erfasst. Beide Bilder sind statische 2D-Canvas, scharf auf hochauflösenden Displays, und werden nur neu gezeichnet, wenn sich ein Regler oder die Fenstergröße ändert. Für reduzierte Bewegung gibt es also nichts abzuschalten.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Warum die Kurve nie genau auf den Stufen landet",
        paragraphs: [
          "Riemanns glatte Funktion R(x) = Σ μ(n)/n · li(x^(1/n)) ist aus dem Integrallogarithmus li gebaut und berücksichtigt die Primzahlpotenzen bereits. Deshalb liegt sie so viel näher an der Treppe als li(x) allein (li(100) ≈ 30,1). Die exakte Formel zieht für jede Nullstelle ρ noch R(x^ρ) ab, dazu kommen zwei kleine Zusatzterme. Der Explorer behält R(x) vollständig und von jedem Nullstellenterm nur den führenden Teil. Im Bild gemessen liegt die warme Kurve damit im Mittel nur etwa 0,05 über π(x), egal mit wie vielen Nullstellen. Exakt treffen kann sie nie: Eine stetige Kurve verfehlt einen Sprung der Höhe 1 um mindestens ½, die Plakette hat also eine Untergrenze bei etwa 0,5. Jede Nullstelle trägt eine Welle mit einer Amplitude von etwa √x / (γ ln x) bei, die Wellen überlagern sich, und je mehr du hinzunimmst, desto schärfer werden die Anstiege an den Primzahlen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die erste Nullstelle finden",
        text: "Stell t_max auf 13 und schau auf das untere Bild: Der Weg schwingt herum, verfehlt aber den Ursprung, und die Nullstellenliste ist leer. Erhöhe auf 15. Jetzt schneidet der Weg den Ursprung, und die Liste zeigt γ₁ bei etwa 14,13.",
      },
      {
        title: "Von R(x) zur Treppe",
        text: "Setz N_zeros auf 0 und merk dir den Wert in der Fehlerplakette (etwa 1,7). Geh dann über 1, 3, 8 und 20 bis 50. Die glatte Kurve bekommt Wellen, die an den Primzahlen ansteigen und in den Lücken abflachen, und die Plakette sinkt auf etwa 1,1 bei 8 und etwa 0,9 bei 50. Sie fällt nicht bei jedem einzelnen Schritt: Zwischen 1 und 3 schwankt sie um 1,4.",
      },
      {
        title: "Die Reihe aushungern",
        text: "Stell t_max auf 60 und senke N auf 20. Vergleiche den Weg mit N = 500. Die grobe Version schleift noch an den richtigen Höhen nahe am Ursprung vorbei, aber die Form am oberen Ende der Spur verrutscht. Genauigkeit bei großem t braucht mehr Glieder.",
      },
      {
        title: "Zwei Nullstellen dicht beieinander",
        text: "Die Nullstellen 4 und 5 liegen bei etwa 30,42 und 32,94. Stell t_max auf 34 und folge dem hellsten Ende des Wegs: Er fädelt zweimal kurz hintereinander durch den Ursprung, mit nur einer kleinen Schleife dazwischen.",
      },
    ],
  },
};
