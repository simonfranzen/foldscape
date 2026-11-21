import type { ExplorerGuide } from "./types";

// Numbers quoted here (701 columns, 300 skipped and 200 drawn iterates, the
// slider ranges and defaults, the preset r values) match
// app/logistic/explorer/page.tsx; update both together.
const BIFURCATION_EXCERPT = `const NR = 700;      // r columns across the canvas
const skip = 300;    // transient iterates thrown away
const drawN = 200;   // iterates plotted per column
for (let i = 0; i <= NR; i++) {
  const rr = BIFURCATION_R_MIN + (i / NR) * (BIFURCATION_R_MAX - BIFURCATION_R_MIN);
  let x = 0.5;
  for (let k = 0; k < skip; k++) x = rr * x * (1 - x);
  for (let k = 0; k < drawN; k++) {
    x = rr * x * (1 - x);
    ctx.fillRect((i / NR) * W, (1 - x) * H, dot, dot);
  }
}
bifCacheRef.current = ctx.getImageData(0, 0, W, H);`;

export const LOGISTIC_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the logistic map bifurcation diagram: drag r from 2.5 to 4, watch period doubling turn into chaos, and see the time series and code behind every point.",
    heading: "How this explorer works",
    intro:
      "The large pink picture is the bifurcation diagram of the logistic map. Each thin vertical column belongs to one value of the growth rate r, and the dots in that column are the values the map keeps visiting once it has forgotten where it started. Where the column shows one dot, the system settles on a single value; two dots mean it alternates; a smeared band means it never repeats. The cyan line marks the r you have chosen, and the amber chart below shows the actual sequence of values for that r, one iteration after another.",
    sections: [
      {
        heading: "One line of arithmetic",
        paragraphs: [
          "The rule is the discrete form of logistic growth. Read x as the fraction of a habitat that is occupied, between 0 and 1. Next generation's fraction is r times this year's fraction times the room that is still free. Small populations grow, crowded ones shrink, and r sets how hard the population overshoots. Robert May made this map famous in a 1976 article in Nature, precisely to show that such a simple rule can behave in very complicated ways.",
          "For r between 1 and 3 every orbit is pulled to the fixed point x* = 1 − 1/r. At r = 3 that point becomes unstable and a stable 2-cycle takes over. At r = 1 + √6 ≈ 3.4495 the 2-cycle doubles into a 4-cycle, then into 8, 16 and so on, each doubling arriving sooner than the last. The gaps shrink by a factor that approaches Feigenbaum's constant δ ≈ 4.6692, and the doublings pile up at r∞ ≈ 3.5699. Beyond that point most values of r give chaos.",
        ],
        formula: "x_{n+1} = r\\,x_n\\,(1 - x_n), \\qquad x_n \\in [0, 1],\\; r \\in [2.5, 4]",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Growth rate r runs from 2.5 to 4 in steps of 0.0005 and starts at 3.7, in the chaotic region. The eight preset buttons jump to landmarks: 2.5 (calm fixed point at 0.6), 3.0 (the first bifurcation), 3.45 (just past the birth of the 4-cycle), 3.56995 (the onset of chaos), 3.7 (deep chaos), 3.83 (inside the period-3 window, a clean 3-cycle), 3.9 (chaos again) and 4.0 (full chaos, where the orbit covers the whole interval).",
          "x₀ is the starting value, from 0.001 to 0.999, default 0.2. Burn-in (0 to 2000, default 200) is how many iterations are computed and thrown away before the time series starts, and Show (20 to 1000, default 200) is how many are drawn after that. Setting burn-in to 0 lets you watch the transient: how the orbit wanders before it falls onto its attractor.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Both pictures are drawn on plain 2D canvases, without any animation loop. The bifurcation diagram is the expensive part: 701 columns of r, each starting from x = 0.5, iterating 300 times to discard the transient and then plotting the next 200 values as small semi-transparent dots. That is roughly 350,000 evaluations of the map, so the result is stored once as ImageData and only recomputed when the canvas changes size or the screen's pixel density changes.",
          "Moving the r slider does not touch that work. It restores the cached image with putImageData and draws the cyan cursor and its label on top, which is cheap enough to follow your finger. The time series is recomputed from scratch on every change of r, x₀, burn-in or Show: it iterates the map, joins the values with a line and marks each one with a dot. Nothing moves on its own, so reduced motion changes nothing here.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Reading the diagram honestly",
        paragraphs: [
          "Near every bifurcation point the branches look thick and fuzzy instead of sharp. That is not a rendering bug. At the exact moment a cycle loses stability, orbits approach it extremely slowly, so 300 discarded iterations are not enough to land on it. Mathematicians call this critical slowing down, and the diagram shows it as smudges at r = 3 and around 3.45.",
          "Inside the chaotic band you will also see thin white stripes. These are periodic windows, ranges of r where order briefly returns. The widest one starts at r = 1 + √8 ≈ 3.8284 with a stable 3-cycle, which then period doubles into 6, 12 and 24 before chaos returns. By a theorem of Li and Yorke, a map like this that has a cycle of period 3 also has cycles of every other period.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch intermittency",
        text: "Press the 3.83 preset and set Show to 1000: a clean 3-cycle. Now move r down to 3.8280, a hair below the window's edge at 3.8284. The orbit spends stretches of a few dozen steps almost repeating three values, then bursts into chaos, then calms down again.",
      },
      {
        title: "Test sensitive dependence",
        text: "At r = 4.0 note the shape of the time series, then move x₀ by a single step, from 0.200 to 0.201. After 200 burn-in iterations the two pictures have nothing in common. Repeat at r = 3.2 and nothing changes at all, because every start ends on the same 2-cycle.",
      },
      {
        title: "Watch the slowing down",
        text: "Set r to 3.0, burn-in to 0 and Show to 1000. The orbit zigzags around 0.667 and closes in painfully slowly. Move r to 2.8 and it settles within a few dozen steps.",
      },
      {
        title: "Count the doublings",
        text: "With burn-in at 2000, step r through 3.2, 3.5 and 3.56. The time series repeats every 2, 4 and 8 iterations. Each new period lives on a range of r roughly 4.7 times narrower than the one before, which is Feigenbaum's δ at work.",
      },
    ],
  },
  de: {
    metaDescription:
      "Bifurkationsdiagramm der logistischen Abbildung erkunden: r von 2,5 bis 4 ziehen, Periodenverdopplung ins Chaos kippen sehen, Zeitreihe und Code verstehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das große rosafarbene Bild ist das Bifurkationsdiagramm der logistischen Abbildung. Jede schmale senkrechte Spalte gehört zu einem Wert der Wachstumsrate r, und die Punkte darin sind die Werte, die die Abbildung immer wieder besucht, sobald sie ihren Startwert vergessen hat. Ein Punkt in der Spalte heißt: Das System kommt auf einem Wert zur Ruhe. Zwei Punkte heißen: Es pendelt. Ein verschmiertes Band heißt: Es wiederholt sich nie. Die cyanfarbene Linie markiert dein gewähltes r, und die bernsteinfarbene Kurve darunter zeigt die tatsächliche Folge der Werte für dieses r, Iteration für Iteration.",
    sections: [
      {
        heading: "Eine Zeile Arithmetik",
        paragraphs: [
          "Die Regel ist die diskrete Form des logistischen Wachstums. Lies x als den Anteil eines Lebensraums, der besetzt ist, zwischen 0 und 1. Der Anteil der nächsten Generation ist r mal der heutige Anteil mal der Platz, der noch frei ist. Kleine Populationen wachsen, überfüllte schrumpfen, und r bestimmt, wie heftig die Population über das Ziel hinausschießt. Robert May machte diese Abbildung 1976 mit einem Artikel in Nature bekannt, gerade um zu zeigen, dass so eine einfache Regel sehr kompliziertes Verhalten erzeugen kann.",
          "Für r zwischen 1 und 3 läuft jede Bahn auf den Fixpunkt x* = 1 − 1/r zu. Bei r = 3 wird dieser Punkt instabil, und ein stabiler 2-Zyklus übernimmt. Bei r = 1 + √6 ≈ 3,4495 verdoppelt sich der 2-Zyklus zu einem 4-Zyklus, dann zu 8, 16 und so weiter, wobei jede Verdopplung früher kommt als die vorige. Die Abstände schrumpfen um einen Faktor, der gegen Feigenbaums Konstante δ ≈ 4,6692 strebt, und die Verdopplungen häufen sich bei r∞ ≈ 3,5699. Dahinter liefern die meisten r-Werte Chaos.",
        ],
        formula: "x_{n+1} = r\\,x_n\\,(1 - x_n), \\qquad x_n \\in [0, 1],\\; r \\in [2{,}5;\\, 4]",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Wachstumsrate r reicht von 2,5 bis 4 in Schritten von 0,0005 und startet bei 3,7, mitten im chaotischen Bereich. Die acht Voreinstellungen springen zu Wegmarken: 2,5 (ruhiger Fixpunkt bei 0,6), 3,0 (die erste Bifurkation), 3,45 (knapp nach der Geburt des 4-Zyklus), 3,56995 (Beginn des Chaos), 3,7 (tiefes Chaos), 3,83 (im Periode-3-Fenster, ein sauberer 3-Zyklus), 3,9 (wieder Chaos) und 4,0 (volles Chaos, die Bahn überdeckt das ganze Intervall).",
          "x₀ ist der Startwert, von 0,001 bis 0,999, voreingestellt auf 0,2. Einschwingen (0 bis 2000, Standard 200) legt fest, wie viele Iterationen berechnet und verworfen werden, bevor die Zeitreihe beginnt. Anzeigen (20 bis 1000, Standard 200) bestimmt, wie viele danach gezeichnet werden. Mit Einschwingen auf 0 siehst du den Übergang: wie die Bahn herumirrt, bevor sie auf ihren Attraktor fällt.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Beide Bilder entstehen auf einfachen 2D-Canvas-Flächen, ganz ohne Animationsschleife. Teuer ist das Bifurkationsdiagramm: 701 Spalten für r, jede startet bei x = 0,5, iteriert 300-mal, um den Übergang zu verwerfen, und zeichnet dann die nächsten 200 Werte als kleine halbtransparente Punkte. Das sind ungefähr 350.000 Auswertungen der Abbildung. Deshalb wird das Ergebnis einmal als ImageData gespeichert und nur neu berechnet, wenn sich die Größe des Canvas oder die Pixeldichte des Bildschirms ändert.",
          "Der r-Regler rührt diese Arbeit nicht an. Er stellt das gespeicherte Bild per putImageData wieder her und zeichnet nur den cyanfarbenen Cursor samt Beschriftung darüber. Das ist billig genug, um deinem Finger zu folgen. Die Zeitreihe wird bei jeder Änderung von r, x₀, Einschwingen oder Anzeigen komplett neu berechnet: Sie iteriert die Abbildung, verbindet die Werte mit einer Linie und markiert jeden mit einem Punkt. Weil sich nichts von selbst bewegt, sieht die Seite mit reduzierter Bewegung genauso aus.",
        ],
        code: BIFURCATION_EXCERPT,
      },
      {
        heading: "Das Diagramm richtig lesen",
        paragraphs: [
          "In der Nähe jedes Bifurkationspunkts wirken die Äste dick und unscharf statt scharf. Das ist kein Darstellungsfehler. Genau dort, wo ein Zyklus seine Stabilität verliert, nähern sich die Bahnen ihm extrem langsam, und 300 verworfene Iterationen reichen nicht, um anzukommen. Mathematiker:innen nennen das kritische Verlangsamung, und im Diagramm zeigt sie sich als Schlieren bei r = 3 und um 3,45.",
          "Im chaotischen Band entdeckst du außerdem dünne weiße Streifen. Das sind periodische Fenster, Bereiche von r, in denen kurz wieder Ordnung herrscht. Das breiteste beginnt bei r = 1 + √8 ≈ 3,8284 mit einem stabilen 3-Zyklus, der sich zu 6, 12 und 24 verdoppelt, bevor das Chaos zurückkehrt. Nach einem Satz von Li und Yorke hat eine solche Abbildung, sobald sie einen Zyklus der Periode 3 besitzt, auch Zyklen jeder anderen Periode.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Intermittenz einfangen",
        text: "Drück die Voreinstellung 3,83 und stell Anzeigen auf 1000: ein sauberer 3-Zyklus. Schieb r dann hinunter auf 3,8280, haarscharf unter den Rand des Fensters bei 3,8284. Die Bahn wiederholt ein paar Dutzend Schritte lang fast genau drei Werte, bricht dann chaotisch aus und beruhigt sich wieder.",
      },
      {
        title: "Empfindliche Abhängigkeit testen",
        text: "Merk dir bei r = 4,0 die Form der Zeitreihe und verschiebe x₀ dann um einen einzigen Schritt, von 0,200 auf 0,201. Nach 200 Iterationen Einschwingen haben die beiden Bilder nichts mehr gemeinsam. Wiederhole das bei r = 3,2, und nichts ändert sich, weil jeder Start auf demselben 2-Zyklus endet.",
      },
      {
        title: "Die Verlangsamung sehen",
        text: "Stell r auf 3,0, Einschwingen auf 0 und Anzeigen auf 1000. Die Bahn zackt um 0,667 herum und nähert sich quälend langsam. Bei r = 2,8 kommt sie nach wenigen Dutzend Schritten zur Ruhe.",
      },
      {
        title: "Die Verdopplungen zählen",
        text: "Setz Einschwingen auf 2000 und geh r über 3,2, 3,5 und 3,56 durch. Die Zeitreihe wiederholt sich alle 2, 4 und 8 Iterationen. Jede neue Periode lebt auf einem r-Bereich, der etwa 4,7-mal schmaler ist als der vorige. Genau da wirkt Feigenbaums δ.",
      },
    ],
  },
};
