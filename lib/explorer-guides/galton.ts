import type { ExplorerGuide } from "./types";

// Numbers quoted here (rows 4 to 40, spawn 1 to 12, STEP_EVERY = 4, the
// 5000-ball reduced-motion histogram, the 20-ball overlay threshold) match
// app/galton/explorer/page.tsx; update both together.
const STEP_EXCERPT = `if (frame % STEP_EVERY === 0) {
  for (let i = 0; i < cfg.spawnRate; i++) {
    balls.push({ x: 0, y: 0, px: cx, py: top, done: false, bin: 0 });
  }
  for (const b of balls) {
    if (b.done || b.y >= rows) continue;
    const goRight = Math.random() < cfg.bias;
    b.y++;
    b.x += goRight ? 0.5 : -0.5; // offset from the centre line
    if (b.y === rows) {
      b.done = true;
      b.bin = Math.round(b.x + rows / 2); // = number of right bounces
      histRef.current[b.bin]++;
    }
  }
}`;

export const GALTON_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "A live Galton board: change the rows and the right-bias p, watch the binomial histogram grow, and compare it with the normal curve 𝒩(Np, Np(1−p)).",
    heading: "How this explorer works",
    intro:
      "Each amber dot is a ball dropped from the top of a triangular field of pegs. At every peg it bounces left or right, and after the last row it falls into one of the bins at the bottom. No single ball is predictable, yet the pile of thousands of them grows into the same bell shape every time.",
    sections: [
      {
        heading: "Counting right bounces",
        paragraphs: [
          "Francis Galton described this device, which he called the quincunx, in his 1889 book Natural Inheritance. The mathematics behind it is a counting argument. With N rows a ball makes N independent decisions. If each one goes right with probability p, the bin a ball lands in is simply the number of right bounces k, which runs from 0 to N. So there are N + 1 bins, and the chance of landing in bin k is the binomial probability below: the number of paths with exactly k right turns, times the probability of any one of those paths.",
          "For large N this binomial shape is approximated by a normal distribution with mean Np and variance Np(1−p). That statement is the de Moivre-Laplace theorem, the oldest special case of the central limit theorem: add up many small independent effects and a bell curve appears.",
        ],
        formula: "P(k) = \\binom{N}{k} \\, p^{k} (1-p)^{N-k}, \\qquad k = 0, 1, \\dots, N",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Rows N sets the depth of the board, from 4 to 40 rows (default 16). More rows mean more bins and a smoother curve, but also a wider one: the standard deviation grows like the square root of N. At N = 16 and p = 0.5 the spread is exactly 2 bins; at N = 40 it is about 3.16.",
          "Spawn per step (1 to 12, default 2) is how many new balls enter at the top on each physics step. It only changes the speed at which the histogram fills, not its shape. Right-bias p (0 to 1, default 0.5) is the probability of bouncing right at every peg. At 0.5 the board is fair and the pile is symmetric around the middle bin; any other value shifts the centre to Np and makes the shape lean.",
          "The overlay checkbox draws the normal curve 𝒩(Np, Np(1−p)) in rose on top of the bars, scaled to the number of balls that have landed. It only appears once more than 20 balls are in, and it disappears at p = 0 or p = 1, where the variance is zero and every ball lands in the same bin. Changing N or p empties the histogram, so the curve is never fitted to a mixture of counts from different settings. Pause freezes the board, Clear histogram starts counting from zero.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything is drawn on a 2D canvas scaled for your screen's pixel density. A ball does not bounce physically; it stores its row y and a horizontal offset x from the centre line, and every step it moves down one row and half a peg spacing left or right, decided by a single call to Math.random() compared with p. When it reaches row N, its offset converts directly into a bin index, because x + N/2 equals the number of right bounces.",
          "Physics only advances on every fourth animation frame (STEP_EVERY = 4). That is deliberate: at one row per frame a ball crosses the board faster than the eye can follow, while at one row every four frames you can track an individual path. The bars are scaled relative to the tallest bin, so the histogram always uses the full height of its strip no matter how many balls have landed.",
          "If your system asks for reduced motion, no balls fall at all. Instead the histogram is filled with the exact binomial probabilities for the current N and p, multiplied by 5000 and rounded, and the board is drawn once.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "When the bell curve fails",
        paragraphs: [
          "The normal curve is an approximation, and the overlay lets you see where it breaks. With strong bias and few rows, say p = 0.1 and N = 8, the expected value is 0.8, and the binomial is lopsided: a tall bar at 0 or 1 and a short tail to the right. The Gaussian is symmetric and cannot follow that: part of its mass belongs below bin 0, where there are no bins, so on the board it is simply cut off at the left edge. A common rule of thumb is that the approximation becomes good when Np(1−p) is comfortably larger than about 9. Raising N always wins eventually, which is exactly what the central limit theorem promises.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Follow a single ball",
        text: "Set Spawn per step to 1 and Rows N to 30. Pick one ball near the top and follow it down. Its path looks aimless, and yet the histogram it contributes to is already taking the bell shape after a few hundred balls.",
      },
      {
        title: "Watch the curve sharpen",
        text: "With the overlay on and p = 0.5, compare N = 6 and N = 40. At 6 rows the rose curve only roughly matches seven chunky bars; at 40 rows the bars hug it closely, although the peak bin then holds a much smaller share of all balls.",
      },
      {
        title: "Break the approximation",
        text: "Set N = 8 and p = 0.1, then let a few hundred balls land. Most of them pile into bins 0 and 1, and the symmetric Gaussian visibly misses the skew. Now raise N to 40 and keep p = 0.1: the mean moves to 4, the variance to 3.6, and the fit improves noticeably.",
      },
    ],
  },
  de: {
    metaDescription:
      "Ein Galton-Brett live: Reihen und Rechts-Bias p verändern, das Binomial-Histogramm wachsen sehen und mit der Normalverteilung 𝒩(Np, Np(1−p)) vergleichen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder bernsteinfarbene Punkt ist eine Kugel, die oben in ein dreieckiges Feld aus Stiften fällt. An jedem Stift springt sie nach links oder rechts, und nach der letzten Reihe landet sie in einem der Fächer unten. Keine einzelne Kugel ist vorhersagbar, trotzdem wächst der Haufen aus Tausenden von ihnen jedes Mal zur selben Glockenform.",
    sections: [
      {
        heading: "Rechtssprünge zählen",
        paragraphs: [
          "Francis Galton beschrieb dieses Gerät, das er Quincunx nannte, 1889 in seinem Buch Natural Inheritance. Dahinter steckt ein Zählargument. Bei N Reihen trifft eine Kugel N unabhängige Entscheidungen. Geht jede davon mit Wahrscheinlichkeit p nach rechts, dann ist das Fach, in dem die Kugel landet, einfach die Anzahl k ihrer Rechtssprünge, von 0 bis N. Es gibt also N + 1 Fächer, und die Wahrscheinlichkeit für Fach k ist die Binomialwahrscheinlichkeit unten: die Zahl der Wege mit genau k Rechtsabbiegungen mal die Wahrscheinlichkeit eines solchen Weges.",
          "Für großes N wird diese Binomialform durch eine Normalverteilung mit Mittelwert Np und Varianz Np(1−p) angenähert. Das ist der Satz von de Moivre-Laplace, der älteste Spezialfall des zentralen Grenzwertsatzes: Summierst du viele kleine unabhängige Einflüsse, entsteht eine Glockenkurve.",
        ],
        formula: "P(k) = \\binom{N}{k} \\, p^{k} (1-p)^{N-k}, \\qquad k = 0, 1, \\dots, N",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Reihen N legt die Tiefe des Bretts fest, von 4 bis 40 Reihen (Standard 16). Mehr Reihen bedeuten mehr Fächer und eine glattere Kurve, aber auch eine breitere: Die Standardabweichung wächst mit der Wurzel aus N. Bei N = 16 und p = 0,5 beträgt die Streuung genau 2 Fächer, bei N = 40 etwa 3,16.",
          "Spawn pro Schritt (1 bis 12, Standard 2) bestimmt, wie viele neue Kugeln pro Physikschritt oben einfallen. Das ändert nur, wie schnell sich das Histogramm füllt, nicht seine Form. Der Rechts-Bias p (0 bis 1, Standard 0,5) ist die Wahrscheinlichkeit, an jedem Stift nach rechts zu springen. Bei 0,5 ist das Brett fair und der Haufen symmetrisch um das mittlere Fach; jeder andere Wert verschiebt die Mitte nach Np und lässt die Form kippen.",
          "Die Checkbox für die Überlagerung zeichnet die Normalverteilung 𝒩(Np, Np(1−p)) in Rosa über die Balken, skaliert auf die Zahl der gelandeten Kugeln. Sie erscheint erst, wenn mehr als 20 Kugeln angekommen sind, und verschwindet bei p = 0 oder p = 1, denn dann ist die Varianz null und alle Kugeln landen im selben Fach. Wenn du N oder p änderst, wird das Histogramm geleert, damit die Kurve nie an eine Mischung aus verschiedenen Einstellungen angepasst wird. Pause friert das Brett ein, «Histogramm leeren» zählt von vorn.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles wird auf ein 2D-Canvas gezeichnet, das an die Pixeldichte deines Bildschirms angepasst ist. Eine Kugel prallt nicht physikalisch ab. Sie speichert ihre Reihe y und einen horizontalen Versatz x zur Mittellinie, und bei jedem Schritt rückt sie eine Reihe nach unten und einen halben Stiftabstand nach links oder rechts. Entschieden wird das durch einen einzigen Aufruf von Math.random(), verglichen mit p. Erreicht sie Reihe N, wird ihr Versatz direkt zum Fachindex, denn x + N/2 ist genau die Zahl der Rechtssprünge.",
          "Die Physik rückt nur in jedem vierten Animationsframe vor (STEP_EVERY = 4). Das ist Absicht: Mit einer Reihe pro Frame wäre eine Kugel schneller durch das Brett, als das Auge folgen kann, mit einer Reihe alle vier Frames kannst du einzelne Wege verfolgen. Die Balken sind relativ zum höchsten Fach skaliert, das Histogramm nutzt also immer die volle Höhe seines Streifens, egal wie viele Kugeln schon gelandet sind.",
          "Wünscht dein System reduzierte Bewegung, fällt gar keine Kugel. Stattdessen wird das Histogramm mit den exakten Binomialwahrscheinlichkeiten für das aktuelle N und p gefüllt, mal 5000 und gerundet, und das Brett einmal gezeichnet.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Wann die Glockenkurve versagt",
        paragraphs: [
          "Die Normalverteilung ist eine Näherung, und mit der Überlagerung siehst du, wo sie bricht. Bei starkem Bias und wenigen Reihen, etwa p = 0,1 und N = 8, liegt der Erwartungswert bei 0,8, und die Binomialverteilung ist schief: ein hoher Balken bei 0 oder 1 und ein kurzer Ausläufer nach rechts. Die symmetrische Gaußkurve kann dem nicht folgen: Ein Teil ihrer Masse gehört links von Fach 0 hin, wo es keine Fächer gibt, deshalb wird sie auf dem Brett am linken Rand einfach abgeschnitten. Als Faustregel gilt, dass die Näherung gut wird, wenn Np(1−p) deutlich größer als etwa 9 ist. Ein größeres N gewinnt am Ende immer, genau das verspricht der zentrale Grenzwertsatz.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Einer einzelnen Kugel folgen",
        text: "Stell Spawn pro Schritt auf 1 und Reihen N auf 30. Such dir oben eine Kugel aus und verfolge sie nach unten. Ihr Weg wirkt ziellos, und doch nimmt das Histogramm, zu dem sie beiträgt, schon nach ein paar hundert Kugeln die Glockenform an.",
      },
      {
        title: "Die Kurve schärfer werden sehen",
        text: "Vergleiche mit eingeschalteter Überlagerung und p = 0,5 einmal N = 6 und N = 40. Bei 6 Reihen passt die rosa Kurve nur grob zu sieben klobigen Balken, bei 40 Reihen schmiegen sich die Balken eng an sie, auch wenn das höchste Fach dann einen viel kleineren Anteil aller Kugeln enthält.",
      },
      {
        title: "Die Näherung brechen",
        text: "Stell N = 8 und p = 0,1 ein und lass ein paar hundert Kugeln landen. Die meisten stapeln sich in den Fächern 0 und 1, und die symmetrische Gaußkurve verfehlt die Schiefe sichtbar. Erhöhe dann N auf 40 bei p = 0,1: Der Mittelwert wandert auf 4, die Varianz auf 3,6, und die Anpassung wird spürbar besser.",
      },
    ],
  },
};
