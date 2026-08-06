"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";
import { BuffonNeedleSim } from "@/components/BuffonNeedleSim";
import { BuffonConvergencePlot } from "@/components/BuffonConvergencePlot";
import { palette } from "@/lib/visual/palette";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Tiny static SVG: parallel lines + six needles, three crossing.
// --------------------------------------------------------------------------

function SixNeedlesSVG() {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 260;
    const _H = 140;
    const D = 32;
    const ns = "http://www.w3.org/2000/svg";

    // parallel lines
    const lineYs = [D, D * 2, D * 3, D * 4];
    for (const y of lineYs) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", "0");
      line.setAttribute("x2", String(W));
      line.setAttribute("y1", String(y));
      line.setAttribute("y2", String(y));
      line.setAttribute("stroke", "rgba(138,144,164,0.45)");
      line.setAttribute("stroke-width", "0.8");
      svg.appendChild(line);
    }

    type Needle = { x: number; y: number; angle: number };
    const needles: Needle[] = [
      { x: 36, y: 24, angle: 0.4 },
      { x: 110, y: 64, angle: 1.3 },
      { x: 195, y: 50, angle: 0.85 },
      { x: 230, y: 100, angle: 2.35 },
      { x: 70, y: 116, angle: 1.95 },
      { x: 150, y: 128, angle: 0.55 },
    ];
    const LEN = 26;

    for (const n of needles) {
      const dx = (LEN / 2) * Math.cos(n.angle);
      const dy = (LEN / 2) * Math.sin(n.angle);
      const crossed = lineYs.some((ly) => n.y - Math.abs(dy) <= ly && n.y + Math.abs(dy) >= ly);
      const stroke = crossed ? palette.signal.amber : "rgba(176,182,200,0.7)";
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(n.x - dx));
      line.setAttribute("y1", String(n.y - dy));
      line.setAttribute("x2", String(n.x + dx));
      line.setAttribute("y2", String(n.y + dy));
      line.setAttribute("stroke", stroke);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("cx", String(n.x));
      dot.setAttribute("cy", String(n.y));
      dot.setAttribute("r", "1.3");
      dot.setAttribute("fill", stroke);
      svg.appendChild(dot);
    }
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 140"
      width="100%"
      height="auto"
      className="mx-auto block"
      style={{ maxWidth: 320 }}
      aria-hidden
    />
  );
}

// --------------------------------------------------------------------------
// Per-locale rich content. Eight languages, fully authored.
// --------------------------------------------------------------------------

type RichStory = {
  page: StoryPage;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  // Live sim
  needleSimCaption: string;
  needleSimPlay: string;
  needleSimPause: string;
  needleSimReset: string;
  needleSimFastForward: string;
  needleSimDrops: string;
  needleSimCrossings: string;
  needleSimEstimate: string;
  needleSimTrue: string;
  // Convergence plot
  convergenceCaption: string;
  convergenceNLabel: string;
  convergenceYLabel: string;
  convergenceXLabel: string;
  convergenceFinal: string;
  // Exact-probability callout (Section 02)
  exactProb: { title: string; body: string };
  // Lazzarini convergence table (Section 05)
  lazzarini: {
    caption: string;
    colN: string;
    colErr: string;
    lastRowN: string;
    claimed: string;
    footnote: string;
  };
  // Bertrand paradox table (Section 06)
  bertrand: {
    caption: string;
    colProc: string;
    colP: string;
    rows: [string, string, string];
    footnote: string;
  };
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Analysis",
    title: "Buffon's Needle",
    tagline: "Drop sticks on lined paper. π falls out.",
    intro:
      "Georges-Louis Leclerc, Comte de Buffon, asked the question in 1733 and published it in 1777: drop a needle on a floor of parallel lines and count the crossings. The ratio gives back π — a constant from circles emerging out of straight needles on straight wood. Here we walk the proof, the history and the experiment side by side.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "A needle. A lined page. A constant from circles.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Rule a sheet of paper with parallel lines, all the same distance d apart. Take a needle of length ℓ ≤ d and drop it from above so it lands at a random spot and angle. The chance the needle lies across one of the lines is exactly 2ℓ / (π d). Drop a great many needles, count the crossings, and rearrange — π comes out of straight sticks, with no circle in sight.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Take ℓ = d. Drop a thousand needles. Roughly 2 / π ≈ 0.6366 of them should cross a line — about 636 of the thousand. The estimator gives back π ≈ 2 · 1000 / 636 ≈ 3.145. Below, six needles fall on four parallel lines; the amber ones cross.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "This is the first known Monte Carlo method — long before the name was coined at Los Alamos in 1947. Buffon's needle bridges geometry and probability: it shows that a deterministic constant can be sampled with randomness alone. Modern proofs of probability lean on the same machinery — replace a hard integral with an expectation, sample the expectation, take the limit.",
      },
    ],
    tryIt: "Below: drop a few thousand virtual needles and watch π emerge.",
  },
  sections: [
    {
      pretitle: "Section 01 · The setup",
      title: "Parallel lines, distance d, needle of length ℓ ≤ d",
      body: "Rule a floor — or a sheet of paper — with parallel lines, all spaced a constant distance d apart. Take a needle of length ℓ with ℓ ≤ d, and drop it from above. Two random variables describe the landing: the vertical position y of the needle's centre, uniform between two consecutive lines, and the angle θ between the needle and the lines, uniform on [0, π / 2] by symmetry. The needle lies across a line if its half-length projected vertically — that is, (ℓ / 2) · sin θ — exceeds the distance from its centre to the nearer line. Two parameters, one yes/no question, repeated a great many times. That is the entire experiment.",
    },
    {
      pretitle: "Section 02 · The probability derivation",
      title: "Why π appears from a sine and an integral",
      body: "Fix the angle θ. The needle crosses a line iff y < (ℓ / 2) · sin θ. Since y is uniform on [0, d / 2], that conditional probability is (ℓ / d) · sin θ. Average over θ uniform on [0, π / 2]: P(cross) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). The 2 / π factor comes from the uniform density on the angle, and the integral of sin θ from 0 to π / 2 equals 1. There it is — π sitting in the denominator, smuggled in by a sine. The constant of the circle has appeared in a problem about straight lines on straight paper.",
    },
    {
      pretitle: "Section 03 · From P to π",
      title: "Invert the formula: π ≈ 2 ℓ N / (d · C)",
      body: "Drop N needles. Count the C that cross a line. The law of large numbers tells us C / N converges, almost surely, to the true probability P = 2 ℓ / (π d). Solve the equation for π: π ≈ 2 ℓ N / (d · C). This is the Buffon estimator. With ℓ = d and N = 1000 we expect C ≈ 636 and π ≈ 3.145. With N = 10⁶ and ℓ = d we expect about three correct digits. The convergence is slow — error decays as 1 / √N, as for every Monte Carlo method — but it is genuine, and every additional needle nudges the estimate honestly toward 3.14159…",
    },
    {
      pretitle: "Section 04 · The Monte Carlo method",
      title: "Sampling an integral with randomness",
      body: "Buffon's needle is the prototype of what Stanisław Ulam and John von Neumann formalised at Los Alamos in 1947 and named Monte Carlo, after the casino: estimate a hard integral by sampling it with random points. The trick is the law of large numbers — averages of independent samples converge to their expectation. Today Monte Carlo runs the cores of modern computational physics (lattice QCD), financial derivatives pricing (Black–Scholes with stochastic volatility), photorealistic rendering (path tracing in ray-tracers, where every pixel is a Buffon-style sample of a light integral), Bayesian inference (Markov-chain Monte Carlo), and parts of modern machine-learning training where gradients are estimated stochastically. All of it descends from a count of crossings.",
    },
    {
      pretitle: "Section 05 · Lazzarini's 1901 'experiment'",
      title: "Six decimal places from 3408 drops — too good to be true",
      body: "In 1901 the Italian mathematician Mario Lazzarini published an experiment in which he claimed to have computed π ≈ 3.1415929 from just 3408 needle drops — six correct digits, agreeing exactly with the famous Chinese-era approximation 355 / 113. That accuracy from a Buffon trial would require something like 10¹⁴ drops by honest convergence. The trick: Lazzarini's design used N = 213 · 16 = 3408 drops with a needle-to-line ratio ℓ/d = 5/6, chosen so that, the moment the running count happened to hit C = 1808 crossings, the estimator π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 landed on the famous fraction by construction. He almost certainly stopped at the right moment. The episode is famous as the cleanest cautionary tale in experimental statistics — and as evidence that Buffon's needle, honestly conducted, converges painfully slowly. Pierre-Simon Laplace had already extended the problem in 1812 to a square grid of lines, where two crossings (horizontal and vertical) can be counted independently and the variance is halved; Laplace's variant is the one a serious experimenter would actually run.",
    },
    {
      pretitle: "Section 06 · Other geometric probabilities",
      title: "Bertrand's paradox and the trap of 'random'",
      body: "Buffon's needle works because the words 'uniform position, uniform angle' fix the sample space precisely. Other geometric-probability problems are not so kind. Joseph Bertrand published a paradox in 1889: what is the probability that a random chord of a unit circle is longer than the side of the inscribed equilateral triangle? Three natural procedures — pick two random endpoints on the circle, pick a random midpoint inside the disk, pick a random distance from the centre — give three different answers (1/3, 1/4, 1/2). All three are correct given their own definition of 'random chord'; the paradox is that the phrase, without a procedure, is ambiguous. Edwin Jaynes argued in 1973 for the 1/2 answer on grounds of maximum-entropy invariance, but the deeper lesson stands: geometric probability is only well-defined once the sampling procedure is fully specified. Buffon's needle is famous partly because that specification is so transparent — and the answer, 2 ℓ / (π d), does not depend on which natural procedure you pick.",
    },
  ],
  closingPretitle: "Take it further",
  closingTitle: "Drop the needles.",
  closingBody:
    "The Explorer hands you the parameters: needle length, line spacing, drop rate. Watch the running estimate of π crawl toward the true value, watch the 1 / √N envelope tighten, and feel for yourself how slow Monte Carlo really is — and how reliable.",
  ctaLabel: "→ Open the Explorer",
  needleSimCaption: "Interactive · live needle drops",
  needleSimPlay: "▶ play",
  needleSimPause: "⏸ pause",
  needleSimReset: "↺ reset",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Drops N",
  needleSimCrossings: "Crossings C",
  needleSimEstimate: "Estimate of π",
  needleSimTrue: "True",
  convergenceCaption: "Interactive · estimate vs sample size",
  convergenceNLabel: "Total drops N",
  convergenceYLabel: "estimate",
  convergenceXLabel: "log N",
  convergenceFinal: "Final estimate",
  exactProb: {
    title: "The exact probability",
    body: "A sine, an integral, a uniform density: π emerges from straight lines.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · honest convergence",
    colN: "N drops",
    colErr: "typical |Δπ|",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "claimed 0.0000003",
    footnote:
      "The last row is not a fact about randomness: it is a fact about a man stopping at exactly the right needle.",
  },
  bertrand: {
    caption: "Bertrand 1889 · three answers to one question",
    colProc: "procedure",
    colP: "P(longer than side)",
    rows: [
      "two random endpoints on the circle",
      "random midpoint uniform in the disk",
      "random distance from centre",
    ],
    footnote:
      "Same words, three sample spaces, three answers. Buffon's needle is famous in part because its sampling procedure is so unambiguous, and the answer the same.",
  },
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Analysis",
    title: "Buffons Nadel",
    tagline: "Wirf Stäbchen auf liniertes Papier. π fällt heraus.",
    intro:
      "Georges-Louis Leclerc, Comte de Buffon, stellte die Frage 1733 und veröffentlichte sie 1777: wirf eine Nadel auf einen Boden aus parallelen Linien und zähl die Überschneidungen. Das Verhältnis gibt π zurück – eine Kreiskonstante, die aus geraden Nadeln auf geradem Holz auftaucht. Hier gehen wir den Beweis, die Geschichte und das Experiment nebeneinander durch.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Eine Nadel. Eine linierte Seite. Eine Kreiskonstante.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Linier ein Blatt Papier mit parallelen Linien, alle im selben Abstand d. Nimm eine Nadel der Länge ℓ ≤ d und wirf sie zufällig nach Position und Winkel. Die Wahrscheinlichkeit, dass die Nadel über einer Linie liegt, ist genau 2ℓ / (π d). Wirf viele Nadeln, zähl die Überschneidungen, stell um – π fällt aus geraden Stäbchen, ohne dass ein Kreis in Sicht ist.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Nimm ℓ = d. Wirf tausend Nadeln. Etwa 2 / π ≈ 0,6366 davon sollten eine Linie kreuzen – ungefähr 636 von tausend. Der Schätzer gibt π ≈ 2 · 1000 / 636 ≈ 3,145 zurück. Unten fallen sechs Nadeln auf vier parallele Linien; die ambernen kreuzen.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Das ist die erste bekannte Monte-Carlo-Methode – lange bevor der Name 1947 in Los Alamos geprägt wurde. Buffons Nadel überbrückt Geometrie und Wahrscheinlichkeit: sie zeigt, dass eine deterministische Konstante allein mit Zufall abgetastet werden kann. Moderne Beweise der Wahrscheinlichkeit stützen sich auf dieselbe Maschinerie – ersetz ein hartes Integral durch einen Erwartungswert, tast den Erwartungswert ab, nimm den Grenzwert.",
      },
    ],
    tryIt: "Unten: wirf ein paar tausend virtuelle Nadeln und sieh, wie π auftaucht.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Der Aufbau",
      title: "Parallele Linien, Abstand d, Nadel der Länge ℓ ≤ d",
      body: "Linier einen Boden – oder ein Blatt Papier – mit parallelen Linien, alle im konstanten Abstand d. Nimm eine Nadel der Länge ℓ mit ℓ ≤ d und wirf sie von oben. Zwei Zufallsvariablen beschreiben die Landung: die senkrechte Position y des Nadelmittelpunkts, gleichverteilt zwischen zwei aufeinanderfolgenden Linien, und der Winkel θ zwischen Nadel und Linien, aus Symmetrie gleichverteilt auf [0, π / 2]. Die Nadel liegt über einer Linie, wenn ihre senkrecht projizierte Hälfte – also (ℓ / 2) · sin θ – den Abstand des Mittelpunkts zur näheren Linie überschreitet. Zwei Parameter, eine Ja/Nein-Frage, viele Wiederholungen. Das ist das ganze Experiment.",
    },
    {
      pretitle: "Abschnitt 02 · Die Wahrscheinlichkeitsherleitung",
      title: "Warum π aus einem Sinus und einem Integral auftaucht",
      body: "Fixier den Winkel θ. Die Nadel kreuzt genau dann, wenn y < (ℓ / 2) · sin θ. Da y gleichverteilt auf [0, d / 2] ist, ist diese bedingte Wahrscheinlichkeit (ℓ / d) · sin θ. Mitteln über θ gleichverteilt auf [0, π / 2]: P(kreuzt) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). Der Faktor 2 / π kommt aus der gleichförmigen Dichte des Winkels, und das Integral von sin θ von 0 bis π / 2 ist 1. Da ist es – π sitzt im Nenner, eingeschmuggelt von einem Sinus. Die Kreiskonstante taucht in einer Aufgabe über gerade Linien auf geradem Papier auf.",
    },
    {
      pretitle: "Abschnitt 03 · Von P zu π",
      title: "Formel umstellen: π ≈ 2 ℓ N / (d · C)",
      body: "Wirf N Nadeln. Zähl die C, die eine Linie kreuzen. Das Gesetz der großen Zahlen sagt, dass C / N fast sicher gegen die wahre Wahrscheinlichkeit P = 2 ℓ / (π d) konvergiert. Stell die Gleichung nach π um: π ≈ 2 ℓ N / (d · C). Das ist der Buffon-Schätzer. Mit ℓ = d und N = 1000 erwarten wir C ≈ 636 und π ≈ 3,145. Mit N = 10⁶ und ℓ = d ungefähr drei korrekte Stellen. Die Konvergenz ist langsam – der Fehler fällt wie 1 / √N, wie bei jeder Monte-Carlo-Methode – aber sie ist echt, und jede weitere Nadel schiebt die Schätzung ehrlich Richtung 3,14159…",
    },
    {
      pretitle: "Abschnitt 04 · Die Monte-Carlo-Methode",
      title: "Ein Integral mit Zufall abtasten",
      body: "Buffons Nadel ist der Prototyp dessen, was Stanisław Ulam und John von Neumann 1947 in Los Alamos formalisierten und nach dem Casino Monte Carlo benannten: ein schwieriges Integral durch zufällige Stichproben schätzen. Der Trick ist das Gesetz der großen Zahlen – Mittelwerte unabhängiger Stichproben konvergieren gegen ihren Erwartungswert. Heute treibt Monte Carlo die Kerne moderner Rechenphysik (Gitter-QCD), die Bewertung von Finanzderivaten (Black–Scholes mit stochastischer Volatilität), fotorealistisches Rendering (Path-Tracing in Raytracern, wo jeder Pixel eine Buffon-artige Stichprobe eines Lichtintegrals ist), bayessche Inferenz (Markov-Ketten-Monte-Carlo) und Teile modernen Maschinenlern-Trainings, in denen Gradienten stochastisch geschätzt werden. Alles davon stammt von einem Kreuzungszählwerk ab.",
    },
    {
      pretitle: "Abschnitt 05 · Lazzarinis 'Experiment' 1901",
      title: "Sechs Nachkommastellen aus 3408 Würfen – zu schön um wahr zu sein",
      body: "1901 veröffentlichte der italienische Mathematiker Mario Lazzarini ein Experiment, in dem er behauptete, π ≈ 3,1415929 aus nur 3408 Nadelwürfen berechnet zu haben – sechs korrekte Stellen, exakt übereinstimmend mit der berühmten chinesischen Näherung 355 / 113. Solche Genauigkeit aus einem Buffon-Versuch würde bei ehrlicher Konvergenz rund 10¹⁴ Würfe erfordern. Der Trick: Lazzarinis Design nutzte N = 213 · 16 = 3408 Würfe mit einem Nadel-zu-Linien-Verhältnis ℓ/d = 5/6, so gewählt, dass in dem Moment, in dem die laufende Zählung gerade C = 1808 Kreuzungen erreichte, der Schätzer π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 per Konstruktion auf der berühmten Näherung landete. Er hörte mit ziemlicher Sicherheit im richtigen Moment auf. Die Episode ist berühmt als die sauberste Warnung in experimenteller Statistik – und als Beleg, dass Buffons Nadel, ehrlich durchgeführt, qualvoll langsam konvergiert. Pierre-Simon Laplace hatte das Problem schon 1812 auf ein quadratisches Gitter erweitert, in dem zwei Kreuzungen (horizontal und vertikal) unabhängig gezählt werden können und die Varianz halbiert wird; Laplaces Variante ist die, die man bei einem ernsthaften Experiment tatsächlich laufen lassen würde.",
    },
    {
      pretitle: "Abschnitt 06 · Andere geometrische Wahrscheinlichkeiten",
      title: "Bertrands Paradox und die Falle des Worts 'zufällig'",
      body: "Buffons Nadel funktioniert, weil die Worte 'gleichverteilte Position, gleichverteilter Winkel' den Stichprobenraum genau festlegen. Andere Aufgaben der geometrischen Wahrscheinlichkeit sind nicht so freundlich. Joseph Bertrand veröffentlichte 1889 ein Paradox: wie groß ist die Wahrscheinlichkeit, dass eine zufällige Sehne eines Einheitskreises länger ist als die Seite des einbeschriebenen gleichseitigen Dreiecks? Drei natürliche Vorgehensweisen – zwei zufällige Endpunkte auf dem Kreis wählen, einen zufälligen Mittelpunkt im Inneren wählen, einen zufälligen Abstand vom Zentrum wählen – ergeben drei verschiedene Antworten (1/3, 1/4, 1/2). Alle drei sind unter der jeweiligen Definition von 'zufällige Sehne' korrekt; das Paradox ist, dass der Ausdruck ohne Verfahren mehrdeutig ist. Edwin Jaynes argumentierte 1973 aus Maximum-Entropie-Invarianzgründen für die 1/2-Antwort, aber die tiefere Lehre bleibt: geometrische Wahrscheinlichkeit ist erst wohldefiniert, wenn das Stichprobenverfahren vollständig spezifiziert ist. Buffons Nadel ist teilweise deshalb berühmt, weil diese Spezifikation so transparent ist – und die Antwort, 2 ℓ / (π d), nicht davon abhängt, welches natürliche Verfahren man wählt.",
    },
  ],
  closingPretitle: "Geh weiter",
  closingTitle: "Wirf die Nadeln.",
  closingBody:
    "Der Explorer übergibt dir die Parameter: Nadellänge, Linienabstand, Wurfrate. Sieh der laufenden Schätzung von π beim Krabbeln zum wahren Wert zu, sieh, wie sich die 1 / √N-Hülle zusammenzieht, und spür selbst, wie langsam Monte Carlo wirklich ist – und wie zuverlässig.",
  ctaLabel: "→ Explorer öffnen",
  needleSimCaption: "Interaktiv · Nadelwürfe live",
  needleSimPlay: "▶ Start",
  needleSimPause: "⏸ Pause",
  needleSimReset: "↺ Reset",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Würfe N",
  needleSimCrossings: "Kreuzungen C",
  needleSimEstimate: "Schätzung von π",
  needleSimTrue: "Wahr",
  convergenceCaption: "Interaktiv · Schätzung vs Stichprobengröße",
  convergenceNLabel: "Gesamtwürfe N",
  convergenceYLabel: "Schätzung",
  convergenceXLabel: "log N",
  convergenceFinal: "Endschätzung",
  exactProb: {
    title: "Die exakte Wahrscheinlichkeit",
    body: "Ein Sinus, ein Integral, eine gleichförmige Dichte: π taucht aus geraden Linien auf.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · ehrliche Konvergenz",
    colN: "N Würfe",
    colErr: "typisches |Δπ|",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "behauptet 0.0000003",
    footnote:
      "Die letzte Zeile ist keine Aussage über den Zufall: sie ist eine Aussage über einen Mann, der bei genau der richtigen Nadel aufhört.",
  },
  bertrand: {
    caption: "Bertrand 1889 · drei Antworten auf eine Frage",
    colProc: "Verfahren",
    colP: "P(länger als Seite)",
    rows: [
      "zwei zufällige Endpunkte auf dem Kreis",
      "zufälliger Mittelpunkt gleichverteilt in der Scheibe",
      "zufälliger Abstand vom Zentrum",
    ],
    footnote:
      "Dieselben Worte, drei Stichprobenräume, drei Antworten. Buffons Nadel ist teils deshalb berühmt, weil ihr Stichprobenverfahren so eindeutig ist, und die Antwort dieselbe.",
  },
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Análisis",
    title: "La Aguja de Buffon",
    tagline: "Tira palitos sobre papel rayado. π aparece.",
    intro:
      "Georges-Louis Leclerc, conde de Buffon, planteó la pregunta en 1733 y la publicó en 1777: tira una aguja sobre un piso de líneas paralelas y cuenta los cruces. La razón devuelve π — una constante de los círculos surgiendo de agujas rectas sobre madera recta. Aquí recorremos la prueba, la historia y el experimento en paralelo.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Una aguja. Una hoja rayada. Una constante de los círculos.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Raya una hoja con líneas paralelas, todas a la misma distancia d. Toma una aguja de longitud ℓ ≤ d y déjala caer al azar en posición y ángulo. La probabilidad de que la aguja cruce una línea es exactamente 2ℓ / (π d). Tira muchas agujas, cuenta los cruces, reordena — π aparece de palitos rectos sin un círculo a la vista.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Toma ℓ = d. Tira mil agujas. Cerca de 2 / π ≈ 0,6366 deberían cruzar una línea — unas 636 de mil. El estimador devuelve π ≈ 2 · 1000 / 636 ≈ 3,145. Abajo, seis agujas caen sobre cuatro líneas paralelas; las ámbar cruzan.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Este es el primer método de Monte Carlo conocido — mucho antes de que el nombre se acuñara en Los Álamos en 1947. La aguja de Buffon une geometría y probabilidad: muestra que una constante determinista puede muestrearse solo con azar. Las pruebas modernas de probabilidad se apoyan en la misma maquinaria — reemplaza una integral difícil por una esperanza, muestrea la esperanza, toma el límite.",
      },
    ],
    tryIt: "Abajo: tira unas miles de agujas virtuales y ve cómo emerge π.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El montaje",
      title: "Líneas paralelas, distancia d, aguja de longitud ℓ ≤ d",
      body: "Raya un suelo — o una hoja — con líneas paralelas, todas a una distancia constante d. Toma una aguja de longitud ℓ con ℓ ≤ d y déjala caer desde arriba. Dos variables aleatorias describen la caída: la posición vertical y del centro de la aguja, uniforme entre dos líneas consecutivas, y el ángulo θ entre la aguja y las líneas, uniforme en [0, π / 2] por simetría. La aguja cruza una línea si su semilongitud proyectada en vertical — es decir, (ℓ / 2) · sin θ — supera la distancia del centro a la línea más cercana. Dos parámetros, una pregunta sí/no, repetida muchas veces. Eso es todo el experimento.",
    },
    {
      pretitle: "Sección 02 · La derivación de la probabilidad",
      title: "Por qué π aparece de un seno y una integral",
      body: "Fija el ángulo θ. La aguja cruza ssi y < (ℓ / 2) · sin θ. Como y es uniforme en [0, d / 2], esa probabilidad condicional es (ℓ / d) · sin θ. Promedia sobre θ uniforme en [0, π / 2]: P(cruza) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). El factor 2 / π viene de la densidad uniforme del ángulo, y la integral de sin θ de 0 a π / 2 es 1. Ahí está — π en el denominador, colado por un seno. La constante del círculo aparece en un problema sobre líneas rectas en papel recto.",
    },
    {
      pretitle: "Sección 03 · De P a π",
      title: "Invierte la fórmula: π ≈ 2 ℓ N / (d · C)",
      body: "Tira N agujas. Cuenta las C que cruzan una línea. La ley de los grandes números dice que C / N converge casi seguramente a la probabilidad verdadera P = 2 ℓ / (π d). Despeja π: π ≈ 2 ℓ N / (d · C). Ese es el estimador de Buffon. Con ℓ = d y N = 1000 esperamos C ≈ 636 y π ≈ 3,145. Con N = 10⁶ y ℓ = d esperamos unos tres dígitos correctos. La convergencia es lenta — el error decae como 1 / √N, como en todo método de Monte Carlo — pero es genuina, y cada aguja añadida empuja honestamente la estimación hacia 3,14159…",
    },
    {
      pretitle: "Sección 04 · El método de Monte Carlo",
      title: "Muestrear una integral con azar",
      body: "La aguja de Buffon es el prototipo de lo que Stanisław Ulam y John von Neumann formalizaron en Los Álamos en 1947 y bautizaron Monte Carlo, por el casino: estimar una integral difícil muestreándola con puntos aleatorios. El truco es la ley de los grandes números — los promedios de muestras independientes convergen a su esperanza. Hoy Monte Carlo mueve los núcleos de la física computacional moderna (QCD en red), la valoración de derivados financieros (Black–Scholes con volatilidad estocástica), la representación fotorrealista (path tracing en trazadores de rayos, donde cada píxel es una muestra estilo Buffon de una integral lumínica), la inferencia bayesiana (Monte Carlo por cadenas de Markov) y partes del entrenamiento moderno de aprendizaje automático donde se estiman gradientes de forma estocástica. Todo eso desciende de un recuento de cruces.",
    },
    {
      pretitle: "Sección 05 · El 'experimento' de Lazzarini 1901",
      title: "Seis decimales de 3408 caídas — demasiado bueno para ser cierto",
      body: "En 1901 el matemático italiano Mario Lazzarini publicó un experimento en el que decía haber calculado π ≈ 3,1415929 desde solo 3408 caídas de aguja — seis dígitos correctos, coincidiendo exactamente con la famosa aproximación de la era china 355 / 113. Esa precisión en una prueba de Buffon requeriría unas 10¹⁴ caídas con convergencia honesta. El truco: el diseño de Lazzarini usó N = 213 · 16 = 3408 lanzamientos con una razón aguja-línea ℓ/d = 5/6, elegida para que, en el instante en que el conteo en curso alcanzaba C = 1808 cruces, el estimador π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 aterrizara en la famosa fracción por construcción. Casi con seguridad detuvo el experimento en el momento adecuado. El episodio es famoso como la advertencia más limpia en estadística experimental — y como prueba de que la aguja de Buffon, hecha con honestidad, converge dolorosamente despacio. Pierre-Simon Laplace ya había extendido el problema en 1812 a una cuadrícula de líneas, donde dos cruces (horizontal y vertical) pueden contarse independientemente y la varianza se reduce a la mitad; la variante de Laplace es la que un experimentador serio correría de verdad.",
    },
    {
      pretitle: "Sección 06 · Otras probabilidades geométricas",
      title: "La paradoja de Bertrand y la trampa del 'al azar'",
      body: "La aguja de Buffon funciona porque las palabras 'posición uniforme, ángulo uniforme' fijan el espacio muestral con precisión. Otros problemas de probabilidad geométrica no son tan amables. Joseph Bertrand publicó una paradoja en 1889: ¿cuál es la probabilidad de que una cuerda aleatoria de un círculo unitario sea más larga que el lado del triángulo equilátero inscrito? Tres procedimientos naturales — tomar dos extremos al azar sobre el círculo, tomar un punto medio al azar dentro del disco, tomar una distancia al azar del centro — dan tres respuestas distintas (1/3, 1/4, 1/2). Las tres son correctas con su propia definición de 'cuerda al azar'; la paradoja es que la frase, sin un procedimiento, es ambigua. Edwin Jaynes argumentó en 1973 a favor del 1/2 por invariancia de máxima entropía, pero la lección profunda permanece: la probabilidad geométrica solo queda bien definida cuando el procedimiento de muestreo se especifica por completo. La aguja de Buffon es célebre en parte porque esa especificación es transparente — y la respuesta, 2 ℓ / (π d), no depende del procedimiento natural elegido.",
    },
  ],
  closingPretitle: "Ve más lejos",
  closingTitle: "Tira las agujas.",
  closingBody:
    "El Explorador te entrega los parámetros: longitud de la aguja, separación entre líneas, ritmo de caída. Mira cómo la estimación corriente de π se arrastra hacia el valor real, observa cómo se estrecha la envoltura 1 / √N y siente por ti mismo lo lento que es realmente Monte Carlo — y lo confiable.",
  ctaLabel: "→ Abrir el Explorador",
  needleSimCaption: "Interactivo · caídas de aguja en vivo",
  needleSimPlay: "▶ reproducir",
  needleSimPause: "⏸ pausa",
  needleSimReset: "↺ reinicio",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Caídas N",
  needleSimCrossings: "Cruces C",
  needleSimEstimate: "Estimación de π",
  needleSimTrue: "Verdadero",
  convergenceCaption: "Interactivo · estimación vs tamaño de muestra",
  convergenceNLabel: "Caídas totales N",
  convergenceYLabel: "estimación",
  convergenceXLabel: "log N",
  convergenceFinal: "Estimación final",
  exactProb: {
    title: "La probabilidad exacta",
    body: "Un seno, una integral, una densidad uniforme: π aparece de líneas rectas.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · convergencia honesta",
    colN: "N caídas",
    colErr: "|Δπ| típico",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "declarado 0.0000003",
    footnote:
      "La última fila no es un hecho sobre el azar: es un hecho sobre un hombre que se detuvo justo en la aguja correcta.",
  },
  bertrand: {
    caption: "Bertrand 1889 · tres respuestas a una pregunta",
    colProc: "procedimiento",
    colP: "P(más larga que el lado)",
    rows: [
      "dos extremos al azar en el círculo",
      "punto medio al azar uniforme en el disco",
      "distancia al azar del centro",
    ],
    footnote:
      "Las mismas palabras, tres espacios muestrales, tres respuestas. La aguja de Buffon es célebre en parte porque su procedimiento de muestreo es tan inequívoco, y la respuesta la misma.",
  },
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Analyse",
    title: "L'Aiguille de Buffon",
    tagline: "Lance des bâtons sur du papier réglé. π en tombe.",
    intro:
      "Georges-Louis Leclerc, comte de Buffon, posa la question en 1733 et la publia en 1777 : lance une aiguille sur un sol de lignes parallèles et compte les croisements. Le rapport rend π — une constante des cercles surgissant d'aiguilles droites sur du bois droit. Ici on parcourt la preuve, l'histoire et l'expérience côte à côte.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Une aiguille. Une page réglée. Une constante des cercles.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Règle une feuille de lignes parallèles, toutes à la même distance d. Prends une aiguille de longueur ℓ ≤ d et lance-la au hasard en position et en angle. La probabilité que l'aiguille croise une ligne est exactement 2ℓ / (π d). Lance beaucoup d'aiguilles, compte les croisements, réarrange — π sort de bâtons droits sans le moindre cercle.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Prends ℓ = d. Lance mille aiguilles. Environ 2 / π ≈ 0,6366 devraient croiser une ligne — autour de 636 sur mille. L'estimateur rend π ≈ 2 · 1000 / 636 ≈ 3,145. Ci-dessous, six aiguilles tombent sur quatre lignes parallèles ; les ambrées croisent.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "C'est la première méthode de Monte-Carlo connue — bien avant que le nom ne soit forgé à Los Alamos en 1947. L'aiguille de Buffon relie géométrie et probabilité : elle montre qu'une constante déterministe peut être échantillonnée par le seul hasard. Les preuves modernes de probabilité s'appuient sur la même machinerie — remplace une intégrale dure par une espérance, échantillonne l'espérance, prends la limite.",
      },
    ],
    tryIt: "En bas : lance quelques milliers d'aiguilles virtuelles et vois π émerger.",
  },
  sections: [
    {
      pretitle: "Section 01 · Le montage",
      title: "Lignes parallèles, distance d, aiguille de longueur ℓ ≤ d",
      body: "Règle un sol — ou une feuille de papier — de lignes parallèles, toutes espacées d'une distance constante d. Prends une aiguille de longueur ℓ avec ℓ ≤ d et lâche-la d'en haut. Deux variables aléatoires décrivent l'atterrissage : la position verticale y du centre de l'aiguille, uniforme entre deux lignes consécutives, et l'angle θ entre l'aiguille et les lignes, uniforme sur [0, π / 2] par symétrie. L'aiguille croise une ligne si sa demi-longueur projetée verticalement — c'est-à-dire (ℓ / 2) · sin θ — dépasse la distance de son centre à la ligne la plus proche. Deux paramètres, une question oui/non, répétée un grand nombre de fois. C'est toute l'expérience.",
    },
    {
      pretitle: "Section 02 · La dérivation de la probabilité",
      title: "Pourquoi π apparaît d'un sinus et d'une intégrale",
      body: "Fixe l'angle θ. L'aiguille croise ssi y < (ℓ / 2) · sin θ. Comme y est uniforme sur [0, d / 2], cette probabilité conditionnelle est (ℓ / d) · sin θ. Moyenne sur θ uniforme sur [0, π / 2] : P(croise) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). Le facteur 2 / π vient de la densité uniforme de l'angle, et l'intégrale de sin θ de 0 à π / 2 vaut 1. Le voilà — π au dénominateur, glissé là par un sinus. La constante du cercle apparaît dans un problème de lignes droites sur papier droit.",
    },
    {
      pretitle: "Section 03 · De P à π",
      title: "Inverse la formule : π ≈ 2 ℓ N / (d · C)",
      body: "Lance N aiguilles. Compte les C qui croisent une ligne. La loi des grands nombres dit que C / N converge, presque sûrement, vers la probabilité vraie P = 2 ℓ / (π d). Résous pour π : π ≈ 2 ℓ N / (d · C). C'est l'estimateur de Buffon. Avec ℓ = d et N = 1000 on attend C ≈ 636 et π ≈ 3,145. Avec N = 10⁶ et ℓ = d, environ trois chiffres corrects. La convergence est lente — l'erreur décroît comme 1 / √N, comme pour toute méthode de Monte-Carlo — mais elle est sincère, et chaque aiguille supplémentaire pousse honnêtement l'estimation vers 3,14159…",
    },
    {
      pretitle: "Section 04 · La méthode de Monte-Carlo",
      title: "Échantillonner une intégrale par le hasard",
      body: "L'aiguille de Buffon est le prototype de ce que Stanisław Ulam et John von Neumann formalisèrent à Los Alamos en 1947 et baptisèrent Monte-Carlo, d'après le casino : estimer une intégrale dure en l'échantillonnant par des points aléatoires. L'astuce est la loi des grands nombres — les moyennes d'échantillons indépendants convergent vers leur espérance. Aujourd'hui Monte-Carlo fait tourner les cœurs de la physique computationnelle moderne (QCD sur réseau), la valorisation des dérivés financiers (Black–Scholes à volatilité stochastique), le rendu photoréaliste (path tracing dans les ray-tracers, où chaque pixel est un échantillon façon Buffon d'une intégrale lumineuse), l'inférence bayésienne (Monte-Carlo par chaînes de Markov), et des parties de l'entraînement moderne en apprentissage automatique où les gradients sont estimés stochastiquement. Tout cela descend d'un comptage de croisements.",
    },
    {
      pretitle: "Section 05 · L'« expérience » de Lazzarini 1901",
      title: "Six décimales pour 3408 lancers — trop beau pour être vrai",
      body: "En 1901 le mathématicien italien Mario Lazzarini publia une expérience où il prétendait avoir calculé π ≈ 3,1415929 à partir de seulement 3408 lancers d'aiguille — six chiffres corrects, en accord exact avec la célèbre approximation chinoise 355 / 113. Une telle précision avec un essai de Buffon exigerait de l'ordre de 10¹⁴ lancers par convergence honnête. L'astuce : le plan de Lazzarini utilisa N = 213 · 16 = 3408 lancers avec un rapport aiguille-ligne ℓ/d = 5/6, choisi pour que, au moment où le compteur courant atteignait C = 1808 croisements, l'estimateur π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 tombe sur la fameuse fraction par construction. Il s'est arrêté presque à coup sûr au bon moment. L'épisode est célèbre comme le récit-avertissement le plus net en statistique expérimentale — et comme preuve que l'aiguille de Buffon, conduite honnêtement, converge atrocement lentement. Pierre-Simon Laplace avait déjà étendu le problème en 1812 à une grille carrée de lignes, où deux croisements (horizontal et vertical) peuvent être comptés indépendamment et la variance est divisée par deux ; la variante de Laplace est celle qu'un expérimentateur sérieux ferait vraiment tourner.",
    },
    {
      pretitle: "Section 06 · Autres probabilités géométriques",
      title: "Le paradoxe de Bertrand et le piège du « au hasard »",
      body: "L'aiguille de Buffon marche parce que les mots « position uniforme, angle uniforme » fixent précisément l'espace d'échantillonnage. D'autres problèmes de probabilité géométrique ne sont pas aussi aimables. Joseph Bertrand publia un paradoxe en 1889 : quelle est la probabilité qu'une corde aléatoire d'un cercle unité soit plus longue que le côté du triangle équilatéral inscrit ? Trois procédés naturels — tirer deux extrémités au hasard sur le cercle, tirer un point milieu au hasard dans le disque, tirer une distance au hasard depuis le centre — donnent trois réponses différentes (1/3, 1/4, 1/2). Les trois sont correctes pour leur propre définition de « corde aléatoire » ; le paradoxe est que la phrase, sans procédé, est ambiguë. Edwin Jaynes argumenta en 1973 en faveur de la réponse 1/2 par invariance d'entropie maximale, mais la leçon profonde tient : la probabilité géométrique n'est bien définie qu'une fois le procédé d'échantillonnage entièrement spécifié. L'aiguille de Buffon est en partie célèbre parce que cette spécification est transparente — et la réponse, 2 ℓ / (π d), ne dépend pas du procédé naturel choisi.",
    },
  ],
  closingPretitle: "Aller plus loin",
  closingTitle: "Lance les aiguilles.",
  closingBody:
    "L'Explorateur te confie les paramètres : longueur de l'aiguille, espacement des lignes, cadence de lancer. Regarde l'estimation courante de π ramper vers la vraie valeur, regarde l'enveloppe 1 / √N se resserrer, et sens par toi-même à quel point Monte-Carlo est lent — et fiable.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  needleSimCaption: "Interactif · lancers d'aiguille en direct",
  needleSimPlay: "▶ lecture",
  needleSimPause: "⏸ pause",
  needleSimReset: "↺ réinitialiser",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Lancers N",
  needleSimCrossings: "Croisements C",
  needleSimEstimate: "Estimation de π",
  needleSimTrue: "Vrai",
  convergenceCaption: "Interactif · estimation vs taille d'échantillon",
  convergenceNLabel: "Lancers totaux N",
  convergenceYLabel: "estimation",
  convergenceXLabel: "log N",
  convergenceFinal: "Estimation finale",
  exactProb: {
    title: "La probabilité exacte",
    body: "Un sinus, une intégrale, une densité uniforme : π émerge de lignes droites.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · convergence honnête",
    colN: "N lancers",
    colErr: "|Δπ| typique",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "annoncé 0.0000003",
    footnote:
      "La dernière ligne n'est pas un fait sur le hasard : c'est un fait sur un homme qui s'est arrêté à exactement la bonne aiguille.",
  },
  bertrand: {
    caption: "Bertrand 1889 · trois réponses à une question",
    colProc: "procédé",
    colP: "P(plus longue que le côté)",
    rows: [
      "deux extrémités au hasard sur le cercle",
      "point milieu au hasard uniforme dans le disque",
      "distance au hasard depuis le centre",
    ],
    footnote:
      "Les mêmes mots, trois espaces d'échantillonnage, trois réponses. L'aiguille de Buffon est célèbre en partie parce que son procédé d'échantillonnage est si univoque, et la réponse la même.",
  },
};

const it: RichStory = {
  page: {
    pretitle: "Argomento · Analisi",
    title: "L'Ago di Buffon",
    tagline: "Lancia bastoncini su carta a righe. π ne cade.",
    intro:
      "Georges-Louis Leclerc, conte di Buffon, pose la domanda nel 1733 e la pubblicò nel 1777: lascia cadere un ago su un pavimento di linee parallele e conta gli incroci. Il rapporto restituisce π — una costante dei cerchi che sgorga da aghi dritti su legno dritto. Qui percorriamo la prova, la storia e l'esperimento fianco a fianco.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Un ago. Una pagina a righe. Una costante dei cerchi.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Rigare un foglio con linee parallele, tutte alla stessa distanza d. Prendi un ago di lunghezza ℓ ≤ d e lascialo cadere a caso in posizione e angolo. La probabilità che l'ago giaccia su una linea è esattamente 2ℓ / (π d). Lascia cadere molti aghi, conta gli incroci, riordina — π esce da bastoncini dritti senza un cerchio in vista.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Prendi ℓ = d. Lascia cadere mille aghi. Circa 2 / π ≈ 0,6366 dovrebbero incrociare una linea — circa 636 su mille. Lo stimatore restituisce π ≈ 2 · 1000 / 636 ≈ 3,145. Sotto, sei aghi cadono su quattro linee parallele; quelli ambrati incrociano.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Questo è il primo metodo Monte Carlo noto — molto prima che il nome venisse coniato a Los Alamos nel 1947. L'ago di Buffon ponte fra geometria e probabilità: mostra che una costante deterministica può essere campionata col solo caso. Le dimostrazioni moderne della probabilità si appoggiano allo stesso macchinario — sostituisci un integrale duro con un valore atteso, campiona il valore atteso, prendi il limite.",
      },
    ],
    tryIt: "Sotto: lascia cadere qualche migliaio di aghi virtuali e guarda π emergere.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · L'impianto",
      title: "Linee parallele, distanza d, ago di lunghezza ℓ ≤ d",
      body: "Riga un pavimento — o un foglio — con linee parallele, tutte distanziate di un valore costante d. Prendi un ago di lunghezza ℓ con ℓ ≤ d e lascialo cadere dall'alto. Due variabili casuali descrivono l'atterraggio: la posizione verticale y del centro dell'ago, uniforme fra due linee consecutive, e l'angolo θ fra l'ago e le linee, uniforme su [0, π / 2] per simmetria. L'ago giace su una linea se la sua semilunghezza proiettata verticalmente — cioè (ℓ / 2) · sin θ — supera la distanza del centro dalla linea più vicina. Due parametri, una domanda sì/no, ripetuta moltissime volte. Questo è tutto l'esperimento.",
    },
    {
      pretitle: "Sezione 02 · La derivazione della probabilità",
      title: "Perché π appare da un seno e un integrale",
      body: "Fissa l'angolo θ. L'ago incrocia sse y < (ℓ / 2) · sin θ. Poiché y è uniforme su [0, d / 2], quella probabilità condizionale è (ℓ / d) · sin θ. Media su θ uniforme su [0, π / 2]: P(incrocia) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). Il fattore 2 / π viene dalla densità uniforme dell'angolo, e l'integrale di sin θ da 0 a π / 2 vale 1. Eccolo — π al denominatore, infilato da un seno. La costante del cerchio compare in un problema su linee dritte su carta dritta.",
    },
    {
      pretitle: "Sezione 03 · Da P a π",
      title: "Inverti la formula: π ≈ 2 ℓ N / (d · C)",
      body: "Lascia cadere N aghi. Conta i C che incrociano una linea. La legge dei grandi numeri dice che C / N converge, quasi certamente, alla vera probabilità P = 2 ℓ / (π d). Risolvi per π: π ≈ 2 ℓ N / (d · C). Questo è lo stimatore di Buffon. Con ℓ = d e N = 1000 ci aspettiamo C ≈ 636 e π ≈ 3,145. Con N = 10⁶ e ℓ = d ci aspettiamo circa tre cifre corrette. La convergenza è lenta — l'errore decade come 1 / √N, come per ogni metodo Monte Carlo — ma è genuina, e ogni ago in più sposta onestamente la stima verso 3,14159…",
    },
    {
      pretitle: "Sezione 04 · Il metodo Monte Carlo",
      title: "Campionare un integrale col caso",
      body: "L'ago di Buffon è il prototipo di ciò che Stanisław Ulam e John von Neumann formalizzarono a Los Alamos nel 1947 e battezzarono Monte Carlo, dal casinò: stimare un integrale duro campionandolo con punti casuali. Il trucco è la legge dei grandi numeri — le medie di campioni indipendenti convergono al loro valore atteso. Oggi Monte Carlo fa girare i nuclei della fisica computazionale moderna (QCD su reticolo), la valutazione dei derivati finanziari (Black–Scholes con volatilità stocastica), il rendering fotorealistico (path tracing nei ray-tracer, dove ogni pixel è un campione alla Buffon di un integrale di luce), l'inferenza bayesiana (Monte Carlo a catene di Markov) e parti dell'addestramento moderno del machine learning dove i gradienti sono stimati stocasticamente. Tutto ciò discende da un conteggio di incroci.",
    },
    {
      pretitle: "Sezione 05 · L'«esperimento» di Lazzarini 1901",
      title: "Sei decimali da 3408 lanci — troppo bello per essere vero",
      body: "Nel 1901 il matematico italiano Mario Lazzarini pubblicò un esperimento in cui sosteneva di aver calcolato π ≈ 3,1415929 da soli 3408 lanci di ago — sei cifre corrette, in accordo esatto con la celebre approssimazione cinese 355 / 113. Quella precisione da un test di Buffon richiederebbe nell'ordine di 10¹⁴ lanci con convergenza onesta. Il trucco: il disegno di Lazzarini usò N = 213 · 16 = 3408 lanci con un rapporto ago-linea ℓ/d = 5/6, scelto perché, nel momento in cui il conteggio in corso toccava C = 1808 incroci, lo stimatore π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 atterrasse sulla famosa frazione per costruzione. Quasi certamente si fermò al momento giusto. L'episodio è famoso come il monito più pulito della statistica sperimentale — e come prova che l'ago di Buffon, condotto onestamente, converge dolorosamente lento. Pierre-Simon Laplace aveva già esteso il problema nel 1812 a una griglia quadrata di linee, dove due incroci (orizzontale e verticale) possono essere contati indipendentemente e la varianza è dimezzata; la variante di Laplace è quella che uno sperimentatore serio farebbe davvero girare.",
    },
    {
      pretitle: "Sezione 06 · Altre probabilità geometriche",
      title: "Il paradosso di Bertrand e la trappola del «a caso»",
      body: "L'ago di Buffon funziona perché le parole «posizione uniforme, angolo uniforme» fissano con precisione lo spazio dei campioni. Altri problemi di probabilità geometrica non sono così gentili. Joseph Bertrand pubblicò un paradosso nel 1889: qual è la probabilità che una corda casuale di un cerchio unitario sia più lunga del lato del triangolo equilatero inscritto? Tre procedure naturali — scegliere due estremi a caso sul cerchio, scegliere un punto medio a caso dentro il disco, scegliere una distanza a caso dal centro — danno tre risposte diverse (1/3, 1/4, 1/2). Tutte e tre sono corrette per la loro definizione di «corda casuale»; il paradosso è che la frase, senza procedura, è ambigua. Edwin Jaynes argomentò nel 1973 a favore del 1/2 per invarianza di massima entropia, ma la lezione profonda resta: la probabilità geometrica è ben definita solo quando la procedura di campionamento è specificata interamente. L'ago di Buffon è celebre in parte perché quella specifica è trasparente — e la risposta, 2 ℓ / (π d), non dipende dalla procedura naturale scelta.",
    },
  ],
  closingPretitle: "Vai oltre",
  closingTitle: "Lascia cadere gli aghi.",
  closingBody:
    "L'Esploratore ti consegna i parametri: lunghezza dell'ago, distanza fra le linee, ritmo di lancio. Guarda la stima corrente di π strisciare verso il valore vero, guarda l'inviluppo 1 / √N stringersi, e senti tu stesso quanto lento sia davvero Monte Carlo — e quanto affidabile.",
  ctaLabel: "→ Apri l'Esploratore",
  needleSimCaption: "Interattivo · lanci di ago dal vivo",
  needleSimPlay: "▶ avvia",
  needleSimPause: "⏸ pausa",
  needleSimReset: "↺ reset",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Lanci N",
  needleSimCrossings: "Incroci C",
  needleSimEstimate: "Stima di π",
  needleSimTrue: "Vero",
  convergenceCaption: "Interattivo · stima vs dimensione del campione",
  convergenceNLabel: "Lanci totali N",
  convergenceYLabel: "stima",
  convergenceXLabel: "log N",
  convergenceFinal: "Stima finale",
  exactProb: {
    title: "La probabilità esatta",
    body: "Un seno, un integrale, una densità uniforme: π emerge da linee dritte.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · convergenza onesta",
    colN: "N lanci",
    colErr: "|Δπ| tipico",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "dichiarato 0.0000003",
    footnote:
      "L'ultima riga non è un fatto sul caso: è un fatto su un uomo che si è fermato esattamente all'ago giusto.",
  },
  bertrand: {
    caption: "Bertrand 1889 · tre risposte a una domanda",
    colProc: "procedura",
    colP: "P(più lunga del lato)",
    rows: [
      "due estremi a caso sul cerchio",
      "punto medio a caso uniforme nel disco",
      "distanza a caso dal centro",
    ],
    footnote:
      "Le stesse parole, tre spazi campionari, tre risposte. L'ago di Buffon è celebre in parte perché la sua procedura di campionamento è così univoca, e la risposta la stessa.",
  },
};

const pt: RichStory = {
  page: {
    pretitle: "Tópico · Análise",
    title: "A Agulha de Buffon",
    tagline: "Lança pauzinhos em papel pautado. π cai.",
    intro:
      "Georges-Louis Leclerc, conde de Buffon, fez a pergunta em 1733 e publicou-a em 1777: lança uma agulha num chão de linhas paralelas e conta os cruzamentos. A razão devolve π — uma constante dos círculos a surgir de agulhas direitas sobre madeira direita. Aqui percorremos a prova, a história e a experiência lado a lado.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Uma agulha. Uma página pautada. Uma constante dos círculos.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Pauta uma folha com linhas paralelas, todas à mesma distância d. Pega numa agulha de comprimento ℓ ≤ d e larga-a ao acaso em posição e ângulo. A probabilidade de a agulha cruzar uma linha é exatamente 2ℓ / (π d). Larga muitas agulhas, conta os cruzamentos, reorganiza — π sai de pauzinhos direitos sem um único círculo à vista.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Toma ℓ = d. Larga mil agulhas. Cerca de 2 / π ≈ 0,6366 deviam cruzar uma linha — uns 636 em mil. O estimador devolve π ≈ 2 · 1000 / 636 ≈ 3,145. Em baixo, seis agulhas caem em quatro linhas paralelas; as âmbar cruzam.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Este é o primeiro método de Monte Carlo conhecido — muito antes de o nome ser cunhado em Los Alamos em 1947. A agulha de Buffon liga geometria e probabilidade: mostra que uma constante determinística pode ser amostrada só com acaso. As provas modernas de probabilidade apoiam-se na mesma maquinaria — substitui um integral duro por um valor esperado, amostra o valor esperado, leva ao limite.",
      },
    ],
    tryIt: "Em baixo: larga uns milhares de agulhas virtuais e vê π emergir.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A montagem",
      title: "Linhas paralelas, distância d, agulha de comprimento ℓ ≤ d",
      body: "Pauta um chão — ou uma folha de papel — com linhas paralelas, todas a uma distância constante d. Pega numa agulha de comprimento ℓ com ℓ ≤ d e larga-a do alto. Duas variáveis aleatórias descrevem a aterragem: a posição vertical y do centro da agulha, uniforme entre duas linhas consecutivas, e o ângulo θ entre a agulha e as linhas, uniforme em [0, π / 2] por simetria. A agulha jaz sobre uma linha se a sua meia-comprimento projetada na vertical — isto é, (ℓ / 2) · sin θ — exceder a distância do centro à linha mais próxima. Dois parâmetros, uma pergunta sim/não, repetida muitas vezes. É toda a experiência.",
    },
    {
      pretitle: "Secção 02 · A derivação da probabilidade",
      title: "Porque π aparece de um seno e de um integral",
      body: "Fixa o ângulo θ. A agulha cruza sse y < (ℓ / 2) · sin θ. Como y é uniforme em [0, d / 2], essa probabilidade condicional é (ℓ / d) · sin θ. Faz a média sobre θ uniforme em [0, π / 2]: P(cruza) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). O fator 2 / π vem da densidade uniforme do ângulo, e o integral de sin θ de 0 a π / 2 vale 1. Aqui está — π no denominador, contrabandeado por um seno. A constante do círculo aparece num problema sobre linhas direitas em papel direito.",
    },
    {
      pretitle: "Secção 03 · De P a π",
      title: "Inverte a fórmula: π ≈ 2 ℓ N / (d · C)",
      body: "Larga N agulhas. Conta as C que cruzam uma linha. A lei dos grandes números diz que C / N converge, quase certamente, para a verdadeira probabilidade P = 2 ℓ / (π d). Resolve para π: π ≈ 2 ℓ N / (d · C). É o estimador de Buffon. Com ℓ = d e N = 1000 esperamos C ≈ 636 e π ≈ 3,145. Com N = 10⁶ e ℓ = d esperamos cerca de três algarismos corretos. A convergência é lenta — o erro decresce como 1 / √N, como em qualquer método de Monte Carlo — mas é genuína, e cada agulha extra empurra honestamente a estimativa para 3,14159…",
    },
    {
      pretitle: "Secção 04 · O método de Monte Carlo",
      title: "Amostrar um integral com acaso",
      body: "A agulha de Buffon é o protótipo do que Stanisław Ulam e John von Neumann formalizaram em Los Alamos em 1947 e batizaram Monte Carlo, em homenagem ao casino: estimar um integral duro amostrando-o com pontos aleatórios. O truque é a lei dos grandes números — as médias de amostras independentes convergem para o seu valor esperado. Hoje Monte Carlo faz rodar os núcleos da física computacional moderna (QCD na rede), a precificação de derivados financeiros (Black–Scholes com volatilidade estocástica), a renderização fotorrealista (path tracing em ray-tracers, onde cada pixel é uma amostra ao estilo de Buffon de um integral de luz), a inferência bayesiana (Monte Carlo por cadeias de Markov) e partes do treino moderno em aprendizagem automática onde os gradientes são estimados estocasticamente. Tudo isso descende de uma contagem de cruzamentos.",
    },
    {
      pretitle: "Secção 05 · A 'experiência' de Lazzarini 1901",
      title: "Seis casas decimais de 3408 lançamentos — bom demais para ser verdade",
      body: "Em 1901 o matemático italiano Mario Lazzarini publicou uma experiência em que afirmava ter calculado π ≈ 3,1415929 a partir de apenas 3408 lançamentos de agulha — seis dígitos corretos, em acordo exato com a famosa aproximação chinesa 355 / 113. Essa precisão num ensaio de Buffon exigiria algo como 10¹⁴ lançamentos por convergência honesta. O truque: o desenho de Lazzarini usou N = 213 · 16 = 3408 lançamentos com uma razão agulha-linha ℓ/d = 5/6, escolhida para que, no instante em que a contagem em curso atingia C = 1808 cruzamentos, o estimador π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 caísse na famosa fração por construção. Quase de certeza parou no momento certo. O episódio é famoso como o aviso mais limpo na estatística experimental — e como prova de que a agulha de Buffon, feita com honestidade, converge dolorosamente devagar. Pierre-Simon Laplace já tinha estendido o problema em 1812 a uma grelha quadrada de linhas, onde dois cruzamentos (horizontal e vertical) podem ser contados independentemente e a variância é dividida ao meio; a variante de Laplace é a que um experimentador sério realmente correria.",
    },
    {
      pretitle: "Secção 06 · Outras probabilidades geométricas",
      title: "O paradoxo de Bertrand e a armadilha do 'ao acaso'",
      body: "A agulha de Buffon funciona porque as palavras 'posição uniforme, ângulo uniforme' fixam com precisão o espaço amostral. Outros problemas de probabilidade geométrica não são tão simpáticos. Joseph Bertrand publicou um paradoxo em 1889: qual é a probabilidade de uma corda aleatória de um círculo unitário ser mais longa do que o lado do triângulo equilátero inscrito? Três procedimentos naturais — escolher dois extremos ao acaso no círculo, escolher um ponto médio ao acaso dentro do disco, escolher uma distância ao acaso ao centro — dão três respostas diferentes (1/3, 1/4, 1/2). Os três estão corretos para a sua própria definição de 'corda aleatória'; o paradoxo é que a frase, sem procedimento, é ambígua. Edwin Jaynes argumentou em 1973 a favor do 1/2 por invariância de máxima entropia, mas a lição mais profunda mantém-se: a probabilidade geométrica só é bem definida quando o procedimento de amostragem é totalmente especificado. A agulha de Buffon é célebre em parte porque essa especificação é transparente — e a resposta, 2 ℓ / (π d), não depende de qual procedimento natural se escolhe.",
    },
  ],
  closingPretitle: "Vai mais longe",
  closingTitle: "Larga as agulhas.",
  closingBody:
    "O Explorador entrega-te os parâmetros: comprimento da agulha, espaçamento das linhas, ritmo de queda. Vê a estimativa corrente de π rastejar para o valor verdadeiro, vê o envelope 1 / √N apertar-se e sente por ti como o Monte Carlo é realmente lento — e fiável.",
  ctaLabel: "→ Abrir o Explorador",
  needleSimCaption: "Interativo · lançamentos de agulha ao vivo",
  needleSimPlay: "▶ tocar",
  needleSimPause: "⏸ pausa",
  needleSimReset: "↺ reset",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Lançamentos N",
  needleSimCrossings: "Cruzamentos C",
  needleSimEstimate: "Estimativa de π",
  needleSimTrue: "Verdadeiro",
  convergenceCaption: "Interativo · estimativa vs tamanho da amostra",
  convergenceNLabel: "Lançamentos totais N",
  convergenceYLabel: "estimativa",
  convergenceXLabel: "log N",
  convergenceFinal: "Estimativa final",
  exactProb: {
    title: "A probabilidade exata",
    body: "Um seno, um integral, uma densidade uniforme: π emerge de linhas direitas.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · convergência honesta",
    colN: "N lançamentos",
    colErr: "|Δπ| típico",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "alegado 0.0000003",
    footnote:
      "A última linha não é um facto sobre o acaso: é um facto sobre um homem que parou exatamente na agulha certa.",
  },
  bertrand: {
    caption: "Bertrand 1889 · três respostas a uma pergunta",
    colProc: "procedimento",
    colP: "P(mais longa que o lado)",
    rows: [
      "dois extremos ao acaso no círculo",
      "ponto médio ao acaso uniforme no disco",
      "distância ao acaso ao centro",
    ],
    footnote:
      "As mesmas palavras, três espaços amostrais, três respostas. A agulha de Buffon é célebre em parte porque o seu procedimento de amostragem é tão inequívoco, e a resposta a mesma.",
  },
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Analys",
    title: "Buffons Nål",
    tagline: "Släpp stickor på linjerat papper. π faller ut.",
    intro:
      "Georges-Louis Leclerc, greve av Buffon, ställde frågan 1733 och publicerade den 1777: släpp en nål på ett golv av parallella linjer och räkna korsningarna. Förhållandet ger tillbaka π — en cirkelkonstant som dyker upp ur raka nålar på rakt trä. Här går vi igenom beviset, historien och experimentet sida vid sida.",
    ctaInteractive: "→ Öppna Utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "En nål. En linjerad sida. En cirkelkonstant.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Linjera ett papper med parallella linjer, alla på samma avstånd d. Ta en nål av längd ℓ ≤ d och släpp den slumpmässigt i läge och vinkel. Sannolikheten att nålen ligger över en linje är exakt 2ℓ / (π d). Släpp många nålar, räkna korsningarna, stuva om — π faller ut ur raka stickor utan en cirkel i sikte.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Ta ℓ = d. Släpp tusen nålar. Ungefär 2 / π ≈ 0,6366 av dem bör korsa en linje — omkring 636 av tusen. Skattaren ger tillbaka π ≈ 2 · 1000 / 636 ≈ 3,145. Nedan faller sex nålar på fyra parallella linjer; de bärnstensgula korsar.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Det här är den första kända Monte Carlo-metoden — långt innan namnet myntades i Los Alamos 1947. Buffons nål bryggar geometri och sannolikhet: den visar att en deterministisk konstant kan samplas med enbart slump. Moderna sannolikhetsbevis lutar sig mot samma maskineri — byt ut en hård integral mot ett väntevärde, sampla väntevärdet, ta gränsen.",
      },
    ],
    tryIt: "Nedan: släpp några tusen virtuella nålar och se π träda fram.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Uppställningen",
      title: "Parallella linjer, avstånd d, nål av längd ℓ ≤ d",
      body: "Linjera ett golv — eller ett papper — med parallella linjer, alla med ett konstant avstånd d. Ta en nål av längd ℓ med ℓ ≤ d och släpp den uppifrån. Två slumpvariabler beskriver landningen: nålcentrums vertikala läge y, likformigt mellan två på varandra följande linjer, och vinkeln θ mellan nålen och linjerna, likformig på [0, π / 2] av symmetri. Nålen ligger över en linje om dess vertikalt projicerade halva — det vill säga (ℓ / 2) · sin θ — överstiger avståndet från centrum till den närmaste linjen. Två parametrar, en ja/nej-fråga, upprepad många gånger. Det är hela experimentet.",
    },
    {
      pretitle: "Avsnitt 02 · Sannolikhetshärledningen",
      title: "Varför π dyker upp ur en sinus och en integral",
      body: "Fixera vinkeln θ. Nålen korsar omm y < (ℓ / 2) · sin θ. Eftersom y är likformig på [0, d / 2] är denna betingade sannolikhet (ℓ / d) · sin θ. Medelvärdera över θ likformig på [0, π / 2]: P(korsar) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). Faktorn 2 / π kommer från vinkelns likformiga täthet, och integralen av sin θ från 0 till π / 2 är 1. Där sitter den — π i nämnaren, insmugglad av en sinus. Cirkelkonstanten dyker upp i ett problem om raka linjer på rakt papper.",
    },
    {
      pretitle: "Avsnitt 03 · Från P till π",
      title: "Invertera formeln: π ≈ 2 ℓ N / (d · C)",
      body: "Släpp N nålar. Räkna de C som korsar en linje. Stora talens lag säger att C / N konvergerar, nästan säkert, mot den sanna sannolikheten P = 2 ℓ / (π d). Lös ut π: π ≈ 2 ℓ N / (d · C). Det är Buffon-skattaren. Med ℓ = d och N = 1000 väntar vi oss C ≈ 636 och π ≈ 3,145. Med N = 10⁶ och ℓ = d väntar vi oss omkring tre korrekta siffror. Konvergensen är långsam — felet avtar som 1 / √N, som för varje Monte Carlo-metod — men den är äkta, och varje extra nål knuffar ärligt skattningen mot 3,14159…",
    },
    {
      pretitle: "Avsnitt 04 · Monte Carlo-metoden",
      title: "Sampla en integral med slump",
      body: "Buffons nål är prototypen för det som Stanisław Ulam och John von Neumann formaliserade i Los Alamos 1947 och döpte till Monte Carlo efter kasinot: skatta en hård integral genom att sampla den med slumppunkter. Tricket är stora talens lag — medelvärden av oberoende stickprov konvergerar mot sitt väntevärde. Idag driver Monte Carlo kärnorna i modern beräkningsfysik (gitter-QCD), prissättning av finansiella derivat (Black–Scholes med stokastisk volatilitet), fotorealistisk rendering (path tracing i ray-tracers, där varje pixel är ett Buffon-likt stickprov av en ljusintegral), bayesiansk inferens (Markovkedjor Monte Carlo) och delar av modern maskininlärningsträning där gradienter skattas stokastiskt. Allt detta härstammar från en räkning av korsningar.",
    },
    {
      pretitle: "Avsnitt 05 · Lazzarinis 'experiment' 1901",
      title: "Sex decimaler från 3408 släpp — för bra för att vara sant",
      body: "År 1901 publicerade den italienske matematikern Mario Lazzarini ett experiment där han hävdade att han hade beräknat π ≈ 3,1415929 från endast 3408 nålsläpp — sex korrekta siffror, i exakt överensstämmelse med den berömda kinesiska approximationen 355 / 113. Den noggrannheten ur ett Buffon-försök skulle kräva i storleksordningen 10¹⁴ släpp vid ärlig konvergens. Tricket: Lazzarinis upplägg använde N = 213 · 16 = 3408 släpp med ett nål-till-linje-förhållande ℓ/d = 5/6, valt så att, i det ögonblick det pågående räknet råkade hamna på C = 1808 korsningar, skattaren π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 landade på den berömda bråkdelen per konstruktion. Han stannade nästan säkert i rätt ögonblick. Episoden är ökänd som den renaste varningssagan i experimentell statistik — och som bevis för att Buffons nål, ärligt genomförd, konvergerar plågsamt långsamt. Pierre-Simon Laplace hade redan 1812 utvidgat problemet till ett kvadratiskt rutnät av linjer, där två korsningar (horisontell och vertikal) kan räknas oberoende och variansen halveras; Laplaces variant är den en seriös experimentör faktiskt skulle köra.",
    },
    {
      pretitle: "Avsnitt 06 · Andra geometriska sannolikheter",
      title: "Bertrands paradox och fällan med 'slumpmässig'",
      body: "Buffons nål fungerar för att orden 'likformigt läge, likformig vinkel' fixerar sampelrummet exakt. Andra problem i geometrisk sannolikhet är inte lika vänliga. Joseph Bertrand publicerade en paradox 1889: vad är sannolikheten att en slumpmässig korda till en enhetscirkel är längre än sidan i den inskrivna liksidiga triangeln? Tre naturliga procedurer — välj två slumpmässiga ändpunkter på cirkeln, välj en slumpmässig mittpunkt inuti skivan, välj ett slumpmässigt avstånd från centrum — ger tre olika svar (1/3, 1/4, 1/2). Alla tre är korrekta givet sin egen definition av 'slumpmässig korda'; paradoxen är att frasen utan procedur är tvetydig. Edwin Jaynes argumenterade 1973 för 1/2-svaret på grund av maximentropi-invarians, men den djupare lärdomen står kvar: geometrisk sannolikhet är välddefinierad först när samplingsproceduren är fullt specificerad. Buffons nål är delvis berömd för att den specifikationen är så transparent — och svaret, 2 ℓ / (π d), beror inte på vilken naturlig procedur du väljer.",
    },
  ],
  closingPretitle: "Gå vidare",
  closingTitle: "Släpp nålarna.",
  closingBody:
    "Utforskaren lämnar parametrarna i din hand: nållängd, linjeavstånd, släpptakt. Se den pågående π-skattningen krypa mot det sanna värdet, se 1 / √N-höljet dras samman och känn själv hur långsam Monte Carlo verkligen är — och hur tillförlitlig.",
  ctaLabel: "→ Öppna Utforskaren",
  needleSimCaption: "Interaktivt · nålsläpp live",
  needleSimPlay: "▶ spela",
  needleSimPause: "⏸ paus",
  needleSimReset: "↺ återställ",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Släpp N",
  needleSimCrossings: "Korsningar C",
  needleSimEstimate: "Skattning av π",
  needleSimTrue: "Sant",
  convergenceCaption: "Interaktivt · skattning vs urvalsstorlek",
  convergenceNLabel: "Totala släpp N",
  convergenceYLabel: "skattning",
  convergenceXLabel: "log N",
  convergenceFinal: "Slutskattning",
  exactProb: {
    title: "Den exakta sannolikheten",
    body: "En sinus, en integral, en likformig täthet: π träder fram ur raka linjer.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · ärlig konvergens",
    colN: "N släpp",
    colErr: "typiskt |Δπ|",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "påstått 0.0000003",
    footnote:
      "Den sista raden är inte ett faktum om slumpen: den är ett faktum om en man som stannade vid exakt rätt nål.",
  },
  bertrand: {
    caption: "Bertrand 1889 · tre svar på en fråga",
    colProc: "procedur",
    colP: "P(längre än sidan)",
    rows: [
      "två slumpmässiga ändpunkter på cirkeln",
      "slumpmässig mittpunkt likformig i skivan",
      "slumpmässigt avstånd från centrum",
    ],
    footnote:
      "Samma ord, tre sampelrum, tre svar. Buffons nål är delvis berömd för att dess samplingsprocedur är så entydig, och svaret detsamma.",
  },
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Analyse",
    title: "Buffons Nål",
    tagline: "Slipp pinner på linjert papir. π faller ut.",
    intro:
      "Georges-Louis Leclerc, greve av Buffon, stilte spørsmålet i 1733 og publiserte det i 1777: slipp en nål på et gulv av parallelle linjer og tell kryssingene. Forholdet gir tilbake π — en sirkelkonstant som dukker opp av rette nåler på rett tre. Her går vi gjennom beviset, historien og eksperimentet side om side.",
    ctaInteractive: "→ Åpne Utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "En nål. En linjert side. En sirkelkonstant.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "Linjer et ark med parallelle linjer, alle med samme avstand d. Ta en nål av lengde ℓ ≤ d og slipp den tilfeldig i posisjon og vinkel. Sannsynligheten for at nålen ligger over en linje er nøyaktig 2ℓ / (π d). Slipp mange nåler, tell kryssingene, stokk om — π faller ut av rette pinner uten en sirkel i sikte.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Ta ℓ = d. Slipp tusen nåler. Omtrent 2 / π ≈ 0,6366 av dem bør krysse en linje — rundt 636 av tusen. Estimatoren gir tilbake π ≈ 2 · 1000 / 636 ≈ 3,145. Under faller seks nåler på fire parallelle linjer; de ravgule krysser.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Dette er den første kjente Monte Carlo-metoden — lenge før navnet ble myntet i Los Alamos i 1947. Buffons nål binder geometri og sannsynlighet sammen: den viser at en deterministisk konstant kan samples med bare tilfeldighet. Moderne sannsynlighetsbevis hviler på samme maskineri — bytt ut et hardt integral mot en forventningsverdi, sampl forventningsverdien, ta grensen.",
      },
    ],
    tryIt: "Under: slipp noen tusen virtuelle nåler og se π tre fram.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppsettet",
      title: "Parallelle linjer, avstand d, nål av lengde ℓ ≤ d",
      body: "Linjer et gulv — eller et papir — med parallelle linjer, alle med konstant avstand d. Ta en nål av lengde ℓ med ℓ ≤ d og slipp den ovenfra. To stokastiske variabler beskriver landingen: nålesenterets vertikale posisjon y, jevnt fordelt mellom to påfølgende linjer, og vinkelen θ mellom nålen og linjene, jevnt fordelt på [0, π / 2] av symmetri. Nålen ligger over en linje hvis dens vertikalt projiserte halvlengde — det vil si (ℓ / 2) · sin θ — overstiger avstanden fra senteret til den nærmeste linjen. To parametre, ett ja/nei-spørsmål, gjentatt mange ganger. Det er hele eksperimentet.",
    },
    {
      pretitle: "Avsnitt 02 · Sannsynlighetsutledningen",
      title: "Hvorfor π dukker opp av en sinus og et integral",
      body: "Fest vinkelen θ. Nålen krysser hviss y < (ℓ / 2) · sin θ. Siden y er jevnt fordelt på [0, d / 2], er denne betingede sannsynligheten (ℓ / d) · sin θ. Snitt over θ jevnt fordelt på [0, π / 2]: P(krysser) = ∫₀^{π/2} (ℓ / d) · sin θ · (2 / π) dθ = (2 ℓ) / (π d). Faktoren 2 / π kommer fra vinkelens jevne tetthet, og integralet av sin θ fra 0 til π / 2 er 1. Der er den — π i nevneren, smuglet inn av en sinus. Sirkelkonstanten dukker opp i et problem om rette linjer på rett papir.",
    },
    {
      pretitle: "Avsnitt 03 · Fra P til π",
      title: "Inverter formelen: π ≈ 2 ℓ N / (d · C)",
      body: "Slipp N nåler. Tell de C som krysser en linje. De store talls lov sier at C / N konvergerer, nesten sikkert, mot den sanne sannsynligheten P = 2 ℓ / (π d). Løs for π: π ≈ 2 ℓ N / (d · C). Det er Buffon-estimatoren. Med ℓ = d og N = 1000 venter vi C ≈ 636 og π ≈ 3,145. Med N = 10⁶ og ℓ = d venter vi om lag tre korrekte siffer. Konvergensen er treg — feilen avtar som 1 / √N, som for enhver Monte Carlo-metode — men den er ekte, og hver ekstra nål dytter estimatet ærlig mot 3,14159…",
    },
    {
      pretitle: "Avsnitt 04 · Monte Carlo-metoden",
      title: "Sample et integral med tilfeldighet",
      body: "Buffons nål er prototypen på det Stanisław Ulam og John von Neumann formaliserte i Los Alamos i 1947 og døpte Monte Carlo etter kasinoet: estimer et hardt integral ved å sample det med tilfeldige punkter. Trikset er de store talls lov — gjennomsnitt av uavhengige stikkprøver konvergerer mot sin forventningsverdi. I dag driver Monte Carlo kjernene i moderne beregningsfysikk (gitter-QCD), prising av finansielle derivater (Black–Scholes med stokastisk volatilitet), fotorealistisk rendering (path tracing i ray-tracere, der hver piksel er en Buffon-aktig stikkprøve av et lysintegral), bayesiansk inferens (Markov-kjede Monte Carlo) og deler av moderne maskinlæringstrening der gradienter estimeres stokastisk. Alt dette stammer fra en telling av kryssinger.",
    },
    {
      pretitle: "Avsnitt 05 · Lazzarinis 'eksperiment' 1901",
      title: "Seks desimaler fra 3408 slipp — for godt til å være sant",
      body: "I 1901 publiserte den italienske matematikeren Mario Lazzarini et eksperiment der han hevdet å ha regnet ut π ≈ 3,1415929 fra bare 3408 nålslipp — seks korrekte siffer, i nøyaktig samsvar med den berømte kinesiske tilnærmingen 355 / 113. Den nøyaktigheten fra et Buffon-forsøk ville kreve i størrelsesorden 10¹⁴ slipp ved ærlig konvergens. Trikset: Lazzarinis design brukte N = 213 · 16 = 3408 slipp med et nål-til-linje-forhold ℓ/d = 5/6, valgt slik at i det øyeblikket det løpende telleverket traff C = 1808 kryssinger, landet estimatoren π ≈ 2·(ℓ/d)·N/C = 2·(5/6)·(3408/1808) = 355/113 på den berømte brøken ved konstruksjon. Han stoppet nesten sikkert i riktig øyeblikk. Episoden er kjent som den reneste advarselen i eksperimentell statistikk — og som bevis for at Buffons nål, ærlig gjennomført, konvergerer smertefullt sent. Pierre-Simon Laplace hadde allerede utvidet problemet i 1812 til et kvadratisk rutenett av linjer, der to kryssinger (horisontal og vertikal) kan telles uavhengig og variansen halveres; Laplaces variant er den en seriøs eksperimentator faktisk ville kjørt.",
    },
    {
      pretitle: "Avsnitt 06 · Andre geometriske sannsynligheter",
      title: "Bertrands paradoks og fellen med 'tilfeldig'",
      body: "Buffons nål fungerer fordi ordene 'jevnt fordelt posisjon, jevnt fordelt vinkel' fester utvalgsrommet presist. Andre geometriske sannsynlighetsproblemer er ikke like greie. Joseph Bertrand publiserte et paradoks i 1889: hva er sannsynligheten for at en tilfeldig korde i en enhetssirkel er lengre enn siden i den innskrevne likesidede trekanten? Tre naturlige prosedyrer — velg to tilfeldige endepunkt på sirkelen, velg et tilfeldig midtpunkt inne i skiven, velg en tilfeldig avstand fra sentrum — gir tre forskjellige svar (1/3, 1/4, 1/2). Alle tre er riktige gitt sin egen definisjon av 'tilfeldig korde'; paradokset er at uttrykket uten en prosedyre er tvetydig. Edwin Jaynes argumenterte i 1973 for 1/2-svaret på grunn av maks-entropi-invarians, men den dypere lærdommen står ved lag: geometrisk sannsynlighet er først veldefinert når samplingsprosedyren er fullstendig spesifisert. Buffons nål er delvis berømt fordi den spesifikasjonen er så gjennomsiktig — og svaret, 2 ℓ / (π d), avhenger ikke av hvilken naturlig prosedyre du velger.",
    },
  ],
  closingPretitle: "Gå videre",
  closingTitle: "Slipp nålene.",
  closingBody:
    "Utforskeren overlater parametrene til deg: nålelengde, linjeavstand, slipprate. Se det løpende estimatet av π krype mot den sanne verdien, se 1 / √N-konvolutten trekke seg sammen, og kjenn selv hvor sent Monte Carlo egentlig er — og hvor pålitelig.",
  ctaLabel: "→ Åpne Utforskeren",
  needleSimCaption: "Interaktivt · nålslipp live",
  needleSimPlay: "▶ spill",
  needleSimPause: "⏸ pause",
  needleSimReset: "↺ tilbakestill",
  needleSimFastForward: "⏩ +1000",
  needleSimDrops: "Slipp N",
  needleSimCrossings: "Kryssinger C",
  needleSimEstimate: "Estimat av π",
  needleSimTrue: "Sant",
  convergenceCaption: "Interaktivt · estimat vs utvalgsstørrelse",
  convergenceNLabel: "Totale slipp N",
  convergenceYLabel: "estimat",
  convergenceXLabel: "log N",
  convergenceFinal: "Sluttestimat",
  exactProb: {
    title: "Den eksakte sannsynligheten",
    body: "En sinus, et integral, en jevn tetthet: π trer fram av rette linjer.",
  },
  lazzarini: {
    caption: "Lazzarini, 1901 · ærlig konvergens",
    colN: "N slipp",
    colErr: "typisk |Δπ|",
    lastRowN: "3 408 (Lazzarini)",
    claimed: "påstått 0.0000003",
    footnote:
      "Den siste raden er ikke et faktum om tilfeldigheten: den er et faktum om en mann som stoppet ved nøyaktig riktig nål.",
  },
  bertrand: {
    caption: "Bertrand 1889 · tre svar på ett spørsmål",
    colProc: "prosedyre",
    colP: "P(lengre enn siden)",
    rows: [
      "to tilfeldige endepunkt på sirkelen",
      "tilfeldig midtpunkt jevnt i skiven",
      "tilfeldig avstand fra sentrum",
    ],
    footnote:
      "De samme ordene, tre utvalgsrom, tre svar. Buffons nål er delvis berømt fordi samplingsprosedyren er så entydig, og svaret det samme.",
  },
};

const RICH_STORY: Record<Locale, RichStory> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
  sv,
  no,
};

// --------------------------------------------------------------------------
// Page component
// --------------------------------------------------------------------------

export default function BuffonStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale] ?? en;
  const sec = story.sections;
  const sec0 = sec[0]!;
  const sec1 = sec[1]!;
  const sec2 = sec[2]!;
  const sec3 = sec[3]!;
  const sec4 = sec[4]!;
  const sec5 = sec[5]!;

  return (
    <StoryPageShell
      page={story.page}
      ctaHref="/buffon/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="π ≈ 2 ℓ N / (d · C)"
      formulaLatex={"\\pi \\approx \\frac{2\\,\\ell\\,N}{d\\,C}"}
      finalLabel={story.closingTitle}
    >
      {/* Encounter section · three layperson cards + tryIt line */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.encounter.pretitle}
          </div>
          <h2 className="math-italic text-4xl leading-tight md:text-5xl">
            {story.encounter.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 90}>
              <EncounterCard label={card.label} title={card.title}>
                {/* Card 2 also embeds the tiny SVG showing six needles */}
                {i === 1 ? (
                  <div className="space-y-4">
                    <p>{card.body}</p>
                    <div className="hairline rounded-md border bg-ink-950/60 p-3">
                      <SixNeedlesSVG />
                    </div>
                  </div>
                ) : (
                  card.body
                )}
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
      </section>

      {/* Section 01 — The setup */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
      </section>

      {/* Section 02 — Probability derivation */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.exactProb.title}
            </div>
            <div className="math-italic text-4xl text-ink-100 md:text-5xl">
              P(cross) = 2 ℓ / (π d)
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.exactProb.body}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — From P to π */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
      </section>

      {/* INTERACTIVE 1 · Live needle simulator */}
      <Reveal>
        <section className="mx-auto mb-32 max-w-5xl">
          <BuffonNeedleSim
            caption={story.needleSimCaption}
            playLabel={story.needleSimPlay}
            pauseLabel={story.needleSimPause}
            resetLabel={story.needleSimReset}
            fastForwardLabel={story.needleSimFastForward}
            dropsLabel={story.needleSimDrops}
            crossingsLabel={story.needleSimCrossings}
            estimateLabel={story.needleSimEstimate}
            trueLabel={story.needleSimTrue}
          />
        </section>
      </Reveal>

      {/* Section 04 — Monte Carlo */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* INTERACTIVE 2 · Convergence plot */}
      <Reveal>
        <section className="mx-auto mb-32 max-w-5xl">
          <BuffonConvergencePlot
            caption={story.convergenceCaption}
            nLabel={story.convergenceNLabel}
            yLabel={story.convergenceYLabel}
            xLabel={story.convergenceXLabel}
            finalEstimateLabel={story.convergenceFinal}
          />
        </section>
      </Reveal>

      {/* Section 05 — Lazzarini */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard pretitle={sec4.pretitle} title={sec4.title} body={sec4.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.lazzarini.caption}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.lazzarini.colN}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.lazzarini.colErr}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["100", "~0.1"],
                  ["1 000", "~0.03"],
                  ["10 000", "~0.01"],
                  ["100 000", "~0.003"],
                  ["1 000 000", "~0.001"],
                  [story.lazzarini.lastRowN, story.lazzarini.claimed],
                ].map(([n, err]) => (
                  <tr key={n} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-amber">{n}</td>
                    <td className="px-2 py-2 text-ink-200">{err}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] leading-relaxed text-ink-400">{story.lazzarini.footnote}</p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — Bertrand & geometric probability */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard pretitle={sec5.pretitle} title={sec5.title} body={sec5.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.bertrand.caption}
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.bertrand.colProc}
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    {story.bertrand.colP}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [story.bertrand.rows[0], "1 / 3"],
                  [story.bertrand.rows[1], "1 / 4"],
                  [story.bertrand.rows[2], "1 / 2"],
                ].map(([proc, p]) => (
                  <tr key={p} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-ink-200">{proc}</td>
                    <td className="px-2 py-2 text-signal-amber">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] leading-relaxed text-ink-400">{story.bertrand.footnote}</p>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/buffon/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}

function EncounterCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
