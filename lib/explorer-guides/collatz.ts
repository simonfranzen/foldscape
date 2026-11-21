import type { ExplorerGuide } from "./types";

// Step counts and peaks quoted here (27: 111 steps, peak 9232 at step 77;
// 871: 178; 6171: 261; the 29-node tree at depth 10) were computed with the
// same rules as app/collatz/explorer/page.tsx; update both together.
const TRAJECTORY_EXCERPT = `function computeTrajectory(seed: number): TrajectoryStats {
  const values: number[] = [];
  let n = Math.max(1, Math.floor(seed));
  values.push(n);
  let peak = n;
  let peakStep = 0;
  let i = 0;
  while (n !== 1 && i < MAX_STEPS) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    values.push(n);
    i++;
    if (n > peak) { peak = n; peakStep = i; }
  }
  return { values, steps: i, peak, peakStep };
}`;

export const COLLATZ_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Collatz conjecture: plot any hailstone sequence up to one million on a log scale, find its peak, and grow the inverse Collatz tree back from 1.",
    heading: "How this explorer works",
    intro:
      "The upper chart is the hailstone sequence of one starting number n. Each dot is one step of the Collatz rule, plotted from left to right, with the height showing the value on a logarithmic scale. The lower picture runs the same rule backwards: it starts at 1 and grows a tree of every number that reaches 1 within a few steps. Your seed's orbit lights up in cyan wherever it passes through that tree.",
    sections: [
      {
        heading: "One rule, one open question",
        paragraphs: [
          "The rule fits on a napkin. If n is even, halve it. If n is odd, triple it and add one. Repeat. Start at 6 and you get 6, 3, 10, 5, 16, 8, 4, 2, 1. Once you reach 1, the sequence would cycle through 4, 2, 1 forever, so the explorer stops there and counts the steps.",
          "The Collatz conjecture, named after Lothar Collatz who posed it in 1937, says that every positive integer eventually reaches 1. Computers have checked every starting value beyond 10^20 without finding a counterexample, yet nobody has a proof. The difficulty is that halving and tripling pull in opposite directions: on average an odd step multiplies by about 3/2 after the halving that must follow, while runs of even steps divide by powers of 2, and no one knows how to control the mix for every n.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ even} \\\\ 3n + 1 & n \\text{ odd} \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The number field accepts any seed from 1 to 1,000,000; press Enter or leave the field to apply it, and invalid entries snap back to the previous seed. The slider below it covers 1 to 10,000 for quick scrubbing. The page opens on n = 27, the classic surprise: a small number that takes 111 steps and climbs to 9232 (at step 77) before it finally falls.",
          "The four preset buttons are 27, 97, 871 and 6171. The last two are records: 871 needs 178 steps, more than any other start below 1000, and 6171 needs 261 steps, more than any other start below 10,000. The stats panel shows the step count, the peak value, the step at which the peak happens, and the path length (always one more than the step count, because the start is included).",
          "Show inverse tree toggles the lower picture, and Tree depth (3 to 10, default 8) sets how many backward steps are explored from 1.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Nothing here animates. Both pictures are plain SVG recomputed with React's useMemo whenever the seed or the tree settings change, so the page renders the same with or without reduced motion. The trajectory function below is the whole forward computation. It is capped at 2000 steps as a safety net, but no seed in the allowed range comes close: the longest one below a million is 837,799 with 524 steps.",
          "The chart maps the step index linearly to the x axis and log10 of the value to the y axis, with grid lines at every power of ten. Without the log scale the 9232 peak of n = 27 would squash the rest of the path into a flat line along the bottom. A cyan ring marks the peak.",
          "The inverse tree is a breadth-first search from 1. Every node v always gets the predecessor 2v. It gets a second predecessor (v − 1)/3 only if v leaves remainder 4 when divided by 6, because that is exactly when (v − 1)/3 is an odd whole number; the code also skips v = 4 so the trivial 1, 4, 2, 1 loop does not reappear. The layout is radial: depth sets the distance from the centre, and each child receives a slice of its parent's angle proportional to how many leaves hang below it.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Why the tree stays thin",
        paragraphs: [
          "Backwards, the branching is sparse. Most nodes have only the doubling predecessor, so for the first few levels the tree is a straight line: 1, 2, 4, 8, 16. The first branch appears at 16, which can also be reached from 5. At the maximum depth of 10 the tree holds just 29 numbers, and the only odd ones besides 1 are 3, 5, 13, 21 and 85. The conjecture is equivalent to saying that this tree, grown without a depth limit, eventually contains every positive integer.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "27 against its neighbours",
        text: "Type 26, then 27, then 28. Seed 26 takes 10 steps and 28 takes 18, while 27 takes 111 and spikes to 9232. Nothing about 27 looks special until you run the rule.",
      },
      {
        title: "Powers of two fall straight down",
        text: "Enter 1024. The plot is a clean staircase of 10 halvings with the peak at step 0. Then try 1023, one less, which takes 62 steps and climbs far above its start.",
      },
      {
        title: "A path that lives inside the tree",
        text: "Set Tree depth to 9 and the seed to 13. Its orbit 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 lies entirely in the tree, so every node on it glows cyan. Seed 85 does the same: it jumps to 256 and then halves all the way down.",
      },
      {
        title: "The record holder below a million",
        text: "Type 837799. It needs 524 steps and peaks at almost three billion, yet the log scale still fits the whole journey on one chart.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die Collatz-Vermutung erkunden: Hagelbahnen bis eine Million auf Log-Skala zeichnen, den Gipfel finden und den inversen Collatz-Baum ab 1 wachsen lassen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das obere Diagramm zeigt die Hagelbahn einer einzigen Startzahl n. Jeder Punkt ist ein Schritt der Collatz-Regel, von links nach rechts aufgetragen, die Höhe zeigt den Wert auf einer logarithmischen Skala. Das untere Bild lässt dieselbe Regel rückwärts laufen: Es beginnt bei 1 und lässt einen Baum aus allen Zahlen wachsen, die in wenigen Schritten bei 1 ankommen. Wo die Bahn deiner Startzahl diesen Baum kreuzt, leuchtet sie cyan auf.",
    sections: [
      {
        heading: "Eine Regel, eine offene Frage",
        paragraphs: [
          "Die Regel passt auf einen Bierdeckel. Ist n gerade, halbiere es. Ist n ungerade, verdreifache es und addiere eins. Wiederhole das. Ab 6 ergibt sich 6, 3, 10, 5, 16, 8, 4, 2, 1. Bei 1 würde die Folge für immer durch 4, 2, 1 kreisen, deshalb hält der Explorer dort an und zählt die Schritte.",
          "Die Collatz-Vermutung, benannt nach Lothar Collatz, der sie 1937 formulierte, besagt, dass jede positive ganze Zahl irgendwann bei 1 landet. Computer haben jeden Startwert bis jenseits von 10^20 geprüft, ohne ein Gegenbeispiel zu finden, aber einen Beweis gibt es nicht. Das Problem: Halbieren und Verdreifachen ziehen in entgegengesetzte Richtungen. Ein ungerader Schritt samt der zwingend folgenden Halbierung multipliziert grob mit 3/2, Folgen gerader Schritte teilen durch Zweierpotenzen, und niemand weiß, wie man diese Mischung für jedes n in den Griff bekommt.",
        ],
        formula:
          "T(n) = \\begin{cases} n/2 & n \\text{ gerade} \\\\ 3n + 1 & n \\text{ ungerade} \\end{cases}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Das Zahlenfeld nimmt jede Startzahl von 1 bis 1.000.000 an. Mit Enter oder beim Verlassen des Felds wird sie übernommen, ungültige Eingaben springen auf den vorherigen Wert zurück. Der Regler darunter deckt 1 bis 10.000 zum schnellen Durchscrollen ab. Die Seite startet mit n = 27, der klassischen Überraschung: eine kleine Zahl, die 111 Schritte braucht und bis 9232 klettert (bei Schritt 77), bevor sie endlich fällt.",
          "Die vier Schnellwahl-Knöpfe sind 27, 97, 871 und 6171. Die letzten beiden sind Rekorde: 871 braucht 178 Schritte, mehr als jede andere Startzahl unter 1000, und 6171 braucht 261 Schritte, mehr als jede andere unter 10.000. Das Statistikfeld zeigt Schrittzahl, Gipfelwert, den Schritt, an dem der Gipfel erreicht wird, und die Pfadlänge (immer eins mehr als die Schrittzahl, weil der Start mitzählt).",
          "«Inversen Baum zeigen» blendet das untere Bild ein und aus, und die Baumtiefe (3 bis 10, Standard 8) legt fest, wie viele Schritte rückwärts ab 1 erkundet werden.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Hier bewegt sich nichts. Beide Bilder sind schlichtes SVG, das React per useMemo neu berechnet, sobald sich Startzahl oder Baumeinstellungen ändern. Mit oder ohne reduzierte Bewegung sieht die Seite also gleich aus. Die Funktion unten ist die gesamte Vorwärtsrechnung. Sie ist zur Sicherheit bei 2000 Schritten gedeckelt, aber keine erlaubte Startzahl kommt auch nur in die Nähe: Die längste Bahn unter einer Million hat 837.799 mit 524 Schritten.",
          "Das Diagramm bildet den Schrittindex linear auf die x-Achse ab und den Zehnerlogarithmus des Werts auf die y-Achse, mit Gitterlinien bei jeder Zehnerpotenz. Ohne Log-Skala würde der Gipfel 9232 von n = 27 den Rest der Bahn zu einer flachen Linie am unteren Rand zerquetschen. Ein cyanfarbener Ring markiert den Gipfel.",
          "Der inverse Baum entsteht durch eine Breitensuche ab 1. Jeder Knoten v bekommt immer den Vorgänger 2v. Einen zweiten Vorgänger (v − 1)/3 bekommt er nur, wenn v bei Division durch 6 den Rest 4 lässt, denn genau dann ist (v − 1)/3 eine ungerade ganze Zahl. Der Code überspringt außerdem v = 4, damit die triviale Schleife 1, 4, 2, 1 nicht wieder auftaucht. Das Layout ist radial: Die Tiefe bestimmt den Abstand zur Mitte, und jedes Kind erhält einen Winkelanteil seines Elternknotens, proportional zur Zahl der Blätter darunter.",
        ],
        code: TRAJECTORY_EXCERPT,
      },
      {
        heading: "Warum der Baum so dünn bleibt",
        paragraphs: [
          "Rückwärts verzweigt sich wenig. Die meisten Knoten haben nur den Verdopplungs-Vorgänger, deshalb ist der Baum auf den ersten Ebenen eine gerade Linie: 1, 2, 4, 8, 16. Die erste Verzweigung kommt bei 16, das man auch von 5 aus erreicht. Bei der maximalen Tiefe 10 enthält der Baum gerade einmal 29 Zahlen, und die einzigen ungeraden außer 1 sind 3, 5, 13, 21 und 85. Die Vermutung ist gleichbedeutend damit, dass dieser Baum, ohne Tiefengrenze weitergezüchtet, irgendwann jede positive ganze Zahl enthält.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "27 gegen seine Nachbarn",
        text: "Gib 26 ein, dann 27, dann 28. Die 26 braucht 10 Schritte und die 28 braucht 18, die 27 dagegen 111 und schießt bis 9232 hoch. Man sieht der 27 nichts an, bis man die Regel laufen lässt.",
      },
      {
        title: "Zweierpotenzen fallen gerade nach unten",
        text: "Gib 1024 ein. Das Diagramm ist eine saubere Treppe aus 10 Halbierungen, der Gipfel liegt bei Schritt 0. Probier dann 1023, eins weniger: 62 Schritte, und die Bahn klettert weit über ihren Start.",
      },
      {
        title: "Eine Bahn, die ganz im Baum liegt",
        text: "Stell die Baumtiefe auf 9 und die Startzahl auf 13. Die Bahn 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 liegt vollständig im Baum, jeder ihrer Knoten leuchtet cyan. Mit 85 klappt das auch: Die Zahl springt auf 256 und halbiert sich dann bis ganz nach unten.",
      },
      {
        title: "Der Rekordhalter unter einer Million",
        text: "Gib 837799 ein. Die Bahn braucht 524 Schritte und erreicht fast drei Milliarden, trotzdem passt die ganze Reise dank Log-Skala in ein Diagramm.",
      },
    ],
  },
};
