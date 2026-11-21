import type { ExplorerGuide } from "./types";

// Numbers quoted here (defaults d = 60 px and ℓ = 50 px, ℓ range 0.2d to 1.5d,
// d range 40 to 120, 240 drawn needles, a sample every 25 drops, the π ± 0.8
// plot band) match app/buffon/explorer/page.tsx; update both together.
const DROP_EXCERPT = `// Sample the centre over a whole number of line periods,
// so y mod d is uniform.
const rows = Math.max(1, Math.floor(H / d));
const yRange = rows * d;
for (let i = 0; i < n; i++) {
  const x = Math.random() * W;
  const y = Math.random() * yRange;
  const angle = Math.random() * Math.PI;
  // Crosses iff |yWithinStrip - d/2| + (l/2)·sin(angle) > d/2
  const yMod = ((y % d) + d) % d;
  const cross = Math.abs(yMod - d / 2) + (len / 2) * Math.sin(angle) > d / 2;
  totalRef.current += 1;
  if (cross) crossRef.current += 1;
}
const est = (2 * len * totalRef.current) / (d * crossRef.current);`;

export const BUFFON_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Estimate π with Buffon's needle: drop thousands of needles on parallel lines, change needle length and spacing, and watch the running estimate converge.",
    heading: "How this explorer works",
    intro:
      "The upper panel is a floor with parallel lines, and every drop throws a needle onto it at a random position and a random angle. Needles that touch a line light up amber, the others stay grey. Count how often a needle crosses a line, divide, and π appears out of nowhere. The lower panel plots the running estimate against the number of needles, so you can watch randomness slowly turn into a constant.",
    sections: [
      {
        heading: "Why a needle knows about π",
        paragraphs: [
          "The question goes back to Georges-Louis Leclerc, Comte de Buffon, in the 18th century: if a needle of length ℓ falls on a floor ruled with parallel lines a distance d apart, and ℓ is at most d, what is the chance that it crosses a line? Only two numbers matter. One is the distance from the needle's centre to the nearest line, uniform between 0 and d/2. The other is the angle θ between needle and lines, uniform between 0 and π. The needle crosses when its half-length projected onto the vertical, (ℓ/2) sin θ, is longer than that distance.",
          "Averaging over all positions and angles turns this into an integral of sin θ, and that integral is where π enters. The result is a probability of 2ℓ/(πd). Turn it around and you get an estimator: after n drops with k crossings, π ≈ 2ℓn/(dk). That is exactly the formula in the corner of the canvas.",
        ],
        formula:
          "P(\\text{cross}) = \\frac{2\\ell}{\\pi d} \\quad\\Longrightarrow\\quad \\pi \\approx \\frac{2\\ell\\, n}{d\\, k}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Line spacing d runs from 40 to 120 px, default 60. Needle length ℓ is tied to the spacing and runs from 0.2d to 1.5d, default 50 px; the label always shows the ratio ℓ/d. Changing either one clears all counts, because the estimator applies the current ℓ and d to the totals, and mixing drops from different settings would bias it for good.",
          "Drop 1 000 and Drop 10 000 throw a batch at once. Auto drop keeps throwing every animation frame at the chosen rate, from 1 to 500 needles per frame, default 40. The stats panel shows drops, crossings, the estimate to six decimals and its relative error in percent.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each drop draws three random numbers: x, y and an angle in [0, π). The crossing test does not search for nearby lines. It reduces y modulo d to find where the centre sits inside its strip, then checks whether the distance to the strip's middle plus the projected half-length exceeds d/2.",
          "One detail keeps the estimate honest. The canvas height is rarely a whole multiple of d, and drawing y uniformly over the full height would make some positions within a strip slightly more likely than others. The code therefore samples y only over a whole number of strips. The x coordinate plays no role in the test; it only spreads the needles across the picture.",
          "Counts live in refs rather than React state, so a batch of 10,000 needles triggers only one re-render. Only the most recent 240 needles are kept in a ring buffer for drawing, which keeps the picture readable after a million drops. Every 25 drops the current estimate is recorded, up to 1,200 samples, and the plot shows them inside a band of π ± 0.8 with a dashed reference line at the true value. Nothing moves on its own: auto drop is off by default, so the page is still until you start throwing. If your system asks for reduced motion, auto drop keeps sampling at the full rate but refreshes the picture, the plot and the numbers only twice a second.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Slow convergence and long needles",
        paragraphs: [
          "The estimate wanders a lot. With the default ℓ = 50 and d = 60, its standard deviation is roughly 3/√n, so after 10,000 needles you can expect an error of about 0.03, and every additional correct digit costs about a hundred times as many needles. Among needles no longer than the spacing, ℓ = d gives the smallest spread. That square-root law is shared by all Monte Carlo methods. A famous 1901 experiment by Mario Lazzarini reported 355/113 from 3,408 needles, a result far too good for this spread and widely believed to have been tuned.",
          "Once ℓ exceeds d, the panel shows a note and the estimate drifts away from π. A long needle can cross two lines, but it is still counted only once, and the probability of at least one crossing is smaller than 2ℓ/(πd). The expected number of crossings, counted with multiplicity, stays exactly 2ℓ/(πd) for any length, so the bias comes purely from counting events instead of intersections. At ℓ = 1.5d the estimate settles near 3.85 instead of 3.14.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Feel the noise",
        text: "Press Drop 1 000 a few times, clearing in between. The estimates scatter between roughly 3.0 and 3.3. Then press Drop 10 000 and notice that the scatter shrinks only by about a factor of three, not ten.",
      },
      {
        title: "The best needle",
        text: "Keep d at 60 and set ℓ to 60, so the ratio reads 1.00. Run auto drop at 500 per frame and compare the wobble of the plot with a run at ℓ = 15. The short needle crosses rarely, and its estimate jumps around much more.",
      },
      {
        title: "Watch the bias appear",
        text: "Set ℓ to 1.5d (90 px at d = 60) and switch on auto drop. The curve does not approach the dashed π line but levels off around 3.85. Lower ℓ back to 60 and it returns to π.",
      },
      {
        title: "Only the ratio matters",
        text: "Try d = 40 with ℓ = 30, then d = 120 with ℓ = 90. Both have ℓ/d = 0.75 and the same crossing probability of about 0.48, so after many drops the two estimates behave alike even though the pictures look very different.",
      },
    ],
  },
  de: {
    metaDescription:
      "π schätzen mit Buffons Nadel: Tausende Nadeln auf parallele Linien werfen, Länge und Abstand ändern und zusehen, wie die laufende Schätzung gegen π strebt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das obere Feld ist ein Boden mit parallelen Linien, und jeder Wurf lässt eine Nadel an zufälliger Stelle und in zufälligem Winkel darauf fallen. Nadeln, die eine Linie berühren, leuchten bernsteinfarben, die anderen bleiben grau. Zählst du, wie oft eine Nadel eine Linie kreuzt, und teilst geeignet, taucht π wie aus dem Nichts auf. Das untere Feld zeichnet die laufende Schätzung gegen die Zahl der Nadeln, so siehst du, wie sich Zufall langsam in eine Konstante verwandelt.",
    sections: [
      {
        heading: "Woher die Nadel π kennt",
        paragraphs: [
          "Die Frage stammt von Georges-Louis Leclerc, Comte de Buffon, aus dem 18. Jahrhundert: Eine Nadel der Länge ℓ fällt auf einen Boden mit parallelen Linien im Abstand d, und ℓ ist höchstens d. Wie wahrscheinlich kreuzt sie eine Linie? Es kommt nur auf zwei Zahlen an. Die eine ist der Abstand vom Nadelmittelpunkt zur nächsten Linie, gleichverteilt zwischen 0 und d/2. Die andere ist der Winkel θ zwischen Nadel und Linien, gleichverteilt zwischen 0 und π. Die Nadel kreuzt, wenn ihre senkrecht projizierte halbe Länge, (ℓ/2) sin θ, größer ist als dieser Abstand.",
          "Mittelt man über alle Lagen und Winkel, wird daraus ein Integral über sin θ, und genau dort kommt π ins Spiel. Heraus kommt die Wahrscheinlichkeit 2ℓ/(πd). Dreht man sie um, erhält man einen Schätzer: Nach n Würfen mit k Kreuzungen ist π ≈ 2ℓn/(dk). Das ist die Formel in der Ecke des Canvas.",
        ],
        formula:
          "P(\\text{Kreuzung}) = \\frac{2\\ell}{\\pi d} \\quad\\Longrightarrow\\quad \\pi \\approx \\frac{2\\ell\\, n}{d\\, k}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Linienabstand d reicht von 40 bis 120 px, Standard 60. Die Nadellänge ℓ hängt am Abstand und reicht von 0,2d bis 1,5d, Standard 50 px; die Beschriftung zeigt immer das Verhältnis ℓ/d. Jede Änderung an einem der beiden setzt die Zählung zurück, denn der Schätzer wendet das aktuelle ℓ und d auf die Summen an. Würfe aus verschiedenen Einstellungen zu mischen, würde ihn dauerhaft verzerren.",
          "«1 000 werfen» und «10 000 werfen» werfen einen Stapel auf einmal. Der Auto-Wurf wirft in jedem Animationsframe weiter, mit einer Rate von 1 bis 500 Nadeln pro Frame, Standard 40. Die Statistik zeigt Würfe, Kreuzungen, die Schätzung auf sechs Nachkommastellen und den relativen Fehler in Prozent. «Zurücksetzen» beginnt mit denselben Einstellungen von vorn.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jeder Wurf zieht drei Zufallszahlen: x, y und einen Winkel in [0, π). Der Kreuzungstest sucht keine benachbarten Linien. Er reduziert y modulo d, um die Lage des Mittelpunkts in seinem Streifen zu finden, und prüft dann, ob der Abstand zur Streifenmitte plus die projizierte halbe Länge größer als d/2 ist. Das ist dieselbe Bedingung wie in der Herleitung, nur ohne Fallunterscheidung geschrieben.",
          "Ein Detail hält die Schätzung ehrlich. Die Höhe des Canvas ist selten ein ganzzahliges Vielfaches von d, und ein gleichverteiltes y über die volle Höhe würde manche Lagen innerhalb eines Streifens leicht bevorzugen. Deshalb zieht der Code y nur über eine ganze Anzahl von Streifen. Die x-Koordinate spielt für den Test keine Rolle, sie verteilt die Nadeln nur über das Bild.",
          "Die Zähler liegen in Refs statt im React-State, sodass ein Stapel von 10.000 Nadeln nur ein einziges Re-Rendering auslöst. Gezeichnet werden nur die letzten 240 Nadeln aus einem Ringpuffer, damit das Bild auch nach einer Million Würfen lesbar bleibt. Alle 25 Würfe wird die aktuelle Schätzung notiert, bis zu 1.200 Messpunkte, und der Plot zeigt sie in einem Band von π ± 0,8 mit einer gestrichelten Linie beim wahren Wert. Von selbst bewegt sich nichts: Der Auto-Wurf ist standardmäßig aus, die Seite bleibt still, bis du zu werfen beginnst. Wünscht dein System reduzierte Bewegung, wirft der Auto-Wurf mit voller Rate weiter, aktualisiert Bild, Kurve und Zahlen aber nur zweimal pro Sekunde.",
        ],
        code: DROP_EXCERPT,
      },
      {
        heading: "Langsame Konvergenz und lange Nadeln",
        paragraphs: [
          "Die Schätzung schwankt stark. Mit den Standardwerten ℓ = 50 und d = 60 liegt ihre Standardabweichung bei etwa 3/√n. Nach 10.000 Nadeln ist also ein Fehler um 0,03 zu erwarten, und jede weitere richtige Stelle kostet ungefähr hundertmal so viele Nadeln. Unter den Nadeln, die nicht länger als der Abstand sind, streut ℓ = d am wenigsten. Dieses Wurzelgesetz teilen alle Monte-Carlo-Verfahren, deshalb ist Buffons Nadel eine wunderschöne Idee, aber ein schlechter Weg, π zu berechnen. Mario Lazzarini berichtete 1901 von 355/113 aus 3.408 Nadeln, ein Ergebnis, das für diese Streuung viel zu gut ist und allgemein als zurechtgelegt gilt.",
          "Sobald ℓ größer als d wird, erscheint ein Hinweis, und die Schätzung entfernt sich von π. Eine lange Nadel kann zwei Linien kreuzen, zählt aber nur einmal, und die Wahrscheinlichkeit für mindestens eine Kreuzung ist kleiner als 2ℓ/(πd). Die erwartete Zahl der Kreuzungen, mit Vielfachheit gezählt, bleibt für jede Länge genau 2ℓ/(πd). Die Verzerrung entsteht also nur, weil Ereignisse statt Schnittpunkte gezählt werden. Bei ℓ = 1,5d pendelt sich die Schätzung bei etwa 3,85 statt 3,14 ein.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Rauschen spüren",
        text: "Drück ein paarmal «1 000 werfen» und setz dazwischen zurück. Die Schätzungen streuen etwa zwischen 3,0 und 3,3. Drück dann «10 000 werfen»: Die Streuung schrumpft nur ungefähr um den Faktor drei, nicht um zehn.",
      },
      {
        title: "Die beste Nadel",
        text: "Lass d bei 60 und stell ℓ auf 60, das Verhältnis zeigt dann 1,00. Lass den Auto-Wurf mit 500 pro Frame laufen und vergleiche das Zittern der Kurve mit einem Lauf bei ℓ = 15. Die kurze Nadel kreuzt selten, und ihre Schätzung springt deutlich stärker.",
      },
      {
        title: "Der Verzerrung zusehen",
        text: "Stell ℓ auf 1,5d (90 px bei d = 60) und schalte den Auto-Wurf ein. Die Kurve nähert sich nicht der gestrichelten π-Linie, sondern pendelt sich um 3,85 ein. Senkst du ℓ wieder auf 60, kehrt sie zu π zurück.",
      },
      {
        title: "Nur das Verhältnis zählt",
        text: "Probier d = 40 mit ℓ = 30 und danach d = 120 mit ℓ = 90. Beide haben ℓ/d = 0,75 und dieselbe Kreuzungswahrscheinlichkeit von etwa 0,48. Nach vielen Würfen verhalten sich die Schätzungen gleich, obwohl die Bilder ganz verschieden aussehen.",
      },
    ],
  },
};
