"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { CollatzTrajectoryPlot } from "@/components/CollatzTrajectoryPlot";
import { CollatzReverseTree } from "@/components/CollatzReverseTree";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-rose";

// --------------------------------------------------------------------------
// Per-locale story content. The hero copy (pretitle/title/tagline/intro)
// lives inline here in RICH_STORY[locale].page so the shared i18n bundles
// stay slim. Everything below the hero is also authored here.
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
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  trajectoryCaption: string;
  trajectoryTitle: string;
  trajectoryBody: string;
  trajectoryInputLabel: string;
  trajectoryPresetLabel: string;
  trajectoryStepsLabel: string;
  trajectoryPeakLabel: string;
  trajectoryHint: string;
  treeCaption: string;
  treeTitle: string;
  treeBody: string;
  treeDepthLabel: string;
  treeNodeLabel: string;
  treeHint: string;
  erdosQuote: string;
  erdosNote: string;
  twentySevenLabel: string;
  twentySevenStat: string;
};

// English ----------------------------------------------------------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Chaos",
    title: "The Collatz Conjecture",
    tagline: "Halve if even. Triple-plus-one if odd. End at 1 — probably.",
    intro:
      "A four-word rule, eighty-eight years of silence. Pick any positive integer, halve it when it is even and otherwise replace it with 3n + 1, and the sequence eventually falls into the cycle 4 → 2 → 1. Computers have checked every integer up to roughly 2⁶⁸. Nobody has proved it must always happen.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "The simplest unsolved problem in mathematics.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Pick any positive integer. If it is even, halve it. If it is odd, triple it and add one. Repeat. Every starting number we have ever tried eventually reaches 1. Probably. Nobody has proven it must. The whole rule fits in one breath and yet has resisted every attack for almost a century.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Start at 27 — a tiny seed. The orbit climbs and crashes and climbs again, peaking at 9 232 (about 340× its starting value) before finally falling back down to 1 in exactly 111 steps. Read the trajectory aloud and it sounds random; plotted on a log scale, it looks like hail in a thundercloud.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Verified by computer for every integer up to 2⁶⁸ — that is about 3 × 10²⁰ checks, no exceptions. Yet a proof is still missing. Collatz has become the shorthand for ‘easy to state, impossible to prove’. Paul Erdős shrugged and said: ‘Mathematics is not yet ripe for such problems.’ He offered $500. The prize is still unclaimed.",
      },
    ],
    tryIt:
      "Below: drop any seed into the hailstorm and watch it fall — then grow the reverse coral that holds every integer at once.",
  },
  sections: [
    {
      pretitle: "Section 01 · The recipe",
      title: "Two cases, one instruction",
      body: "Pick any positive integer n. If n is even, replace it with n / 2. If n is odd, replace it with 3n + 1. Repeat. That is the whole rule. Try n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, and then 1 → 4 → 2 → 1 forever. The map T(n) is one of the smallest discrete dynamical systems anyone has ever written down. Children can iterate it. Computers can iterate it billions of times a second. Nobody knows whether every orbit really does come home.",
    },
    {
      pretitle: "Section 02 · The 27 trajectory",
      title: "Hailstones over Syracuse",
      body: "The orbits earned the nickname hailstone sequences because they rise and fall erratically before finally hitting the ground — like hail tossed inside a thundercloud. The most famous small case is n = 27. It looks too small to be interesting and yet it takes 111 steps to terminate, climbing as high as 9 232 along the way — over 340 times its starting value. Other small seeds with disproportionate orbits: 97 takes 118 steps, 871 takes 178, 6 171 takes 261, 77 031 takes 350. Tiny inputs, wildly oversized journeys. The trajectory plotter below lets you drop any of them — or any seed you like — into the hailstorm.",
    },
    {
      pretitle: "Section 03 · The conjecture",
      title: "Every road leads to 4 → 2 → 1",
      body: "Lothar Collatz wrote the rule down in 1937, two years after his doctorate in Berlin. The same beast was rediscovered independently by Kakutani, Ulam, and the Syracuse number theorists, which is why the literature also calls it the Syracuse problem, Kakutani's problem and the Ulam conjecture. The claim is the same in every name: for every positive integer n, the iteration T(n) eventually reaches 1, and then loops forever on the cycle 4 → 2 → 1. As of 2025 it has been verified by direct computation for every integer up to about 2.36 × 10²¹. No counterexample. No proof either.",
    },
    {
      pretitle: "Section 04 · Tao's 2019 result",
      title: "Almost all orbits, almost all the way home",
      body: "The deepest progress came in 2019 from Terence Tao. His paper ‘Almost all orbits of the Collatz map attain almost bounded values’ shows that for any function f(n) tending to infinity, the set of starting integers whose Collatz orbit eventually drops below f(n) has natural density 1. In plain language: pick a random starting integer; almost certainly its orbit eventually shrinks below any target you set in advance. This is a probabilistic near-miss, not a proof. The remaining counterexamples — if they exist — would form a measure-zero exceptional set, but measure zero is not empty, and Tao's argument explicitly cannot rule them out.",
    },
    {
      pretitle: "Section 05 · The reverse coral",
      title: "Run the rule backwards and the integers self-assemble",
      body: "Forward Collatz is one number at a time. Reverse Collatz is the whole tree. Start at 1 and run the rule backwards: every node n has parent 2n (always — halving was its forward step), and additionally a parent (n − 1) / 3 whenever that number is a positive odd integer greater than 1. Sprout the tree breadth-first and the integers self-assemble into an infinite branching coral, rooted at 1, fanning outward. The Collatz conjecture is precisely the statement that every positive integer appears somewhere in this single tree — that the coral, eventually, contains them all.",
    },
    {
      pretitle: "Section 06 · What stops a proof",
      title: "An invariant nobody has found",
      body: "Why is this so hard? The deep reason is that no one has found a sufficient invariant. To prove every orbit terminates you need a quantity that strictly decreases along the iteration, or a Lyapunov function, or a clever potential — and nothing of the kind has surfaced in eighty-eight years of trying. John Conway proved in 1972 that a slightly generalised Collatz-like map is already undecidable; his later FRACTRAN system (1987) then realised full Turing-completeness in exactly this style of branching arithmetic. That suggests Collatz itself may live close to the boundary of undecidability: a problem that is not just hard but possibly outside the reach of any finite proof system. Erdős may have been right that mathematics is not yet ripe.",
    },
  ],
  closingTitle: "Watch it fall.",
  closingBody:
    "The Explorer plots the hailstone trajectory of any starting number on a wider canvas, grows the reverse coral to far greater depths, and lets you race seeds side by side. Everything you just read is one click away.",
  ctaLabel: "→ Open the Explorer",
  trajectoryCaption: "Interactive · trajectory plotter",
  trajectoryTitle: "Drop a seed, watch the hailstorm",
  trajectoryBody:
    "Type any positive integer. The canvas draws the orbit on a log scale until it reaches 1 — marking the peak (cyan) and the landing point (amber). The famous seeds 27, 871, 6 171 and 77 031 are pre-set.",
  trajectoryInputLabel: "Starting integer n",
  trajectoryPresetLabel: "Famous seeds",
  trajectoryStepsLabel: "Stopping time",
  trajectoryPeakLabel: "Maximum height",
  trajectoryHint:
    "Cyan ring = highest value reached along the orbit. Amber dot = the final 1. The y-axis is logarithmic so you can see the hailstones rise across orders of magnitude.",
  treeCaption: "Interactive · reverse coral tree",
  treeTitle: "Run the rule backwards from 1",
  treeBody:
    "Every integer in the Collatz universe is somewhere in this tree — assuming the conjecture is true. Slide the depth knob and watch the coral fan outward from 1 at the centre. At depth 14 the tree already holds hundreds of integers.",
  treeDepthLabel: "Reverse depth",
  treeNodeLabel: "Integers reached",
  treeHint:
    "Each node n branches to 2n always, and to (n − 1) / 3 when that yields an odd integer greater than 1. The colour cycles by depth — rose at the root, then amber, cyan, violet for finer detail.",
  erdosQuote: "“Mathematics is not yet ripe for such problems.”",
  erdosNote:
    "Paul Erdős, offering $500 for a solution. Eighty-eight years after Collatz wrote down the rule, the prize is still unclaimed.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 steps · peak 9 232 · 340× the start",
};

// German -----------------------------------------------------------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Chaos",
    title: "Die Collatz-Vermutung",
    tagline: "Gerade halbieren. Ungerade verdreifachen-plus-eins. Endet bei 1 — wahrscheinlich.",
    intro:
      "Eine Regel in vier Wörtern, achtundachtzig Jahre Schweigen. Wähl eine positive ganze Zahl: ist sie gerade, halbiere, sonst ersetze sie durch 3n + 1, und die Folge fällt am Ende in den Zyklus 4 → 2 → 1. Computer haben jede ganze Zahl bis etwa 2⁶⁸ geprüft. Niemand hat bewiesen, dass es immer so kommen muss.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Das einfachste ungelöste Problem der Mathematik.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Wähl irgendeine positive ganze Zahl. Ist sie gerade, halbiere. Ist sie ungerade, verdreifache und addiere eins. Wiederhole. Jede Startzahl, die je probiert wurde, landet schließlich bei 1. Wahrscheinlich. Niemand hat bewiesen, dass es so sein muss. Die ganze Regel passt in einen Atemzug und widersteht trotzdem seit fast einem Jahrhundert jedem Angriff.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Beginn bei 27 — winziger Keim. Die Bahn steigt und stürzt und steigt wieder, erreicht die Höhe 9 232 (etwa 340× ihren Startwert), bevor sie nach genau 111 Schritten bei 1 ankommt. Vorgelesen klingt die Trajektorie zufällig; auf logarithmischer Skala sieht sie aus wie Hagel in einer Gewitterwolke.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Per Computer überprüft für jede ganze Zahl bis 2⁶⁸ — also etwa 3 × 10²⁰ Tests, keine Ausnahme. Trotzdem fehlt der Beweis. Collatz steht heute als Chiffre für ‚leicht zu formulieren, unmöglich zu beweisen‘. Paul Erdős zuckte die Schultern: ‚Die Mathematik ist für solche Probleme noch nicht reif.‘ Er bot 500 Dollar. Der Preis ist nicht abgeholt.",
      },
    ],
    tryIt:
      "Unten: wirf irgendeinen Keim in den Hagel und sieh ihn fallen — dann lass die Rückwärts-Koralle wachsen, die alle ganzen Zahlen auf einmal hält.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Das Rezept",
      title: "Zwei Fälle, eine Anweisung",
      body: "Wähl irgendeine positive ganze Zahl n. Ist n gerade, ersetze sie durch n / 2. Ist n ungerade, ersetze sie durch 3n + 1. Wiederhole. Das ist die ganze Regel. Probier n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, danach läuft 1 → 4 → 2 → 1 für immer. Die Abbildung T(n) ist eines der kleinsten diskreten dynamischen Systeme, die je notiert wurden. Kinder können sie iterieren. Computer können sie milliardenfach pro Sekunde iterieren. Niemand weiß, ob wirklich jede Bahn nach Hause findet.",
    },
    {
      pretitle: "Abschnitt 02 · Die Bahn von 27",
      title: "Hagel über Syrakus",
      body: "Die Bahnen heißen Hagelfolgen, weil sie wild auf und ab schaukeln, bevor sie endlich am Boden ankommen — wie Hagel in einer Gewitterzelle. Der berühmteste kleine Fall ist n = 27. Sieht zu winzig aus, um interessant zu sein, und braucht trotzdem 111 Schritte zum Ende, mit einem Gipfel bei 9 232 — über 340-mal so hoch wie der Start. Weitere kleine Keime mit unverhältnismäßigen Bahnen: 97 braucht 118 Schritte, 871 schafft 178, 6 171 läuft 261, 77 031 läuft 350. Winzige Eingaben, riesige Reisen. Der Trajektorien-Plotter unten lässt dich jeden davon — oder einen eigenen Keim — in den Hagel werfen.",
    },
    {
      pretitle: "Abschnitt 03 · Die Vermutung",
      title: "Jeder Weg führt zu 4 → 2 → 1",
      body: "Lothar Collatz notierte die Regel 1937 in Berlin, zwei Jahre nach seiner Promotion. Dasselbe Biest wurde unabhängig von Kakutani, Ulam und den Zahlentheoretikern in Syracuse wiederentdeckt — deshalb heißt es in der Literatur auch Syracuse-Problem, Kakutani-Problem und Ulam-Vermutung. Die Behauptung ist überall dieselbe: für jede positive ganze Zahl n erreicht die Iteration T(n) am Ende 1 und kreist dann für immer im Zyklus 4 → 2 → 1. Stand 2025 ist sie für jede ganze Zahl bis etwa 2,36 × 10²¹ direkt durchgerechnet. Kein Gegenbeispiel. Auch kein Beweis.",
    },
    {
      pretitle: "Abschnitt 04 · Taos Ergebnis von 2019",
      title: "Fast alle Bahnen, fast bis nach Hause",
      body: "Den tiefsten Fortschritt brachte 2019 Terence Tao. Seine Arbeit ‚Almost all orbits of the Collatz map attain almost bounded values‘ zeigt: für jede Funktion f(n), die gegen unendlich strebt, hat die Menge der Startzahlen, deren Collatz-Bahn schließlich unter f(n) fällt, natürliche Dichte 1. Im Klartext: wähl eine Startzahl zufällig — fast sicher schrumpft ihre Bahn irgendwann unter jede vorher gesetzte Schranke. Das ist eine probabilistische Knapp-vorbei-Aussage, kein Beweis. Etwaige Gegenbeispiele würden eine Maß-null-Ausnahmemenge bilden, aber Maß null heißt nicht leer, und Taos Argument schließt sie ausdrücklich nicht aus.",
    },
    {
      pretitle: "Abschnitt 05 · Die Rückwärts-Koralle",
      title: "Lass die Regel rückwärts laufen — die Zahlen ordnen sich selbst",
      body: "Vorwärts ist Collatz eine Zahl nach der anderen. Rückwärts ist Collatz der ganze Baum. Beginn bei 1 und kehr die Regel um: jeder Knoten n hat Elter 2n (immer — das war der Halbierungsschritt), und zusätzlich einen Elter (n − 1) / 3, sobald diese Zahl eine positive, ungerade ganze Zahl größer als 1 ist. Lass den Baum in die Breite sprießen, und die ganzen Zahlen ordnen sich zu einer unendlichen, verzweigten Koralle, verwurzelt bei 1, nach außen fächernd. Die Collatz-Vermutung ist genau die Aussage, dass jede positive ganze Zahl irgendwo in diesem einen Baum auftaucht — dass die Koralle am Ende alle enthält.",
    },
    {
      pretitle: "Abschnitt 06 · Was den Beweis aufhält",
      title: "Eine Invariante, die niemand findet",
      body: "Warum ist das so schwer? Der tiefe Grund: niemand hat eine ausreichende Invariante gefunden. Um zu zeigen, dass jede Bahn endet, brauchst du eine Größe, die entlang der Iteration strikt fällt, oder eine Lyapunov-Funktion, oder ein kluges Potential — und nichts davon ist in achtundachtzig Jahren aufgetaucht. John Conway zeigte 1972, dass schon eine leicht verallgemeinerte Collatz-artige Abbildung unentscheidbar ist; sein späteres FRACTRAN-System (1987) realisierte dann volle Turing-Vollständigkeit in genau diesem Stil verzweigter Arithmetik. Das deutet darauf hin, dass Collatz selbst nahe an der Grenze der Unentscheidbarkeit liegen könnte: nicht nur schwer, sondern womöglich außerhalb der Reichweite jedes endlichen Beweissystems. Erdős könnte recht gehabt haben.",
    },
  ],
  closingTitle: "Sieh es fallen.",
  closingBody:
    "Der Explorer plottet die Hagelbahn jeder Startzahl auf größerer Leinwand, lässt die Rückwärts-Koralle deutlich tiefer wachsen und stellt Keime im Rennen nebeneinander. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  ctaLabel: "→ Explorer öffnen",
  trajectoryCaption: "Interaktiv · Bahn-Plotter",
  trajectoryTitle: "Wirf einen Keim in den Hagel",
  trajectoryBody:
    "Tipp eine positive ganze Zahl ein. Das Canvas zeichnet die Bahn auf logarithmischer Skala bis zur 1 — Gipfel (cyan) und Landepunkt (amber) markiert. Die berühmten Keime 27, 871, 6 171 und 77 031 sind voreingestellt.",
  trajectoryInputLabel: "Startzahl n",
  trajectoryPresetLabel: "Berühmte Keime",
  trajectoryStepsLabel: "Stoppzeit",
  trajectoryPeakLabel: "Maximalhöhe",
  trajectoryHint:
    "Cyan-Ring = höchster Wert der Bahn. Amber-Punkt = die finale 1. Die y-Achse ist logarithmisch, damit du den Hagel über Größenordnungen hinweg siehst.",
  treeCaption: "Interaktiv · Rückwärts-Koralle",
  treeTitle: "Lass die Regel von 1 aus rückwärts laufen",
  treeBody:
    "Jede ganze Zahl im Collatz-Universum liegt irgendwo in diesem Baum — wenn die Vermutung stimmt. Schieb am Tiefenregler und sieh die Koralle von der zentralen 1 nach außen fächern. Bei Tiefe 14 hält der Baum schon hunderte ganze Zahlen.",
  treeDepthLabel: "Rückwärtstiefe",
  treeNodeLabel: "Erreichte Zahlen",
  treeHint:
    "Jeder Knoten n verzweigt immer zu 2n und zusätzlich zu (n − 1) / 3, falls das eine ungerade Zahl größer als 1 ergibt. Die Farbe zykliert mit der Tiefe — Rose an der Wurzel, dann Amber, Cyan, Violett für feinere Verzweigungen.",
  erdosQuote: "„Die Mathematik ist für solche Probleme noch nicht reif.“",
  erdosNote:
    "Paul Erdős, der 500 Dollar für eine Lösung auslobte. Achtundachtzig Jahre nachdem Collatz die Regel notierte, ist der Preis nicht abgeholt.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 Schritte · Gipfel 9 232 · 340× der Start",
};

// Spanish ----------------------------------------------------------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "La Conjetura de Collatz",
    tagline: "Par a la mitad. Impar por tres más uno. Acaba en 1 — probablemente.",
    intro:
      "Una regla en cuatro palabras, ochenta y ocho años de silencio. Toma cualquier entero positivo: si es par divídelo entre dos, si es impar reemplázalo por 3n + 1, y la sucesión termina cayendo en el ciclo 4 → 2 → 1. Las computadoras lo han comprobado para cada entero hasta cerca de 2⁶⁸. Nadie ha demostrado que tenga que ocurrir siempre.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "El problema sin resolver más sencillo de las matemáticas.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Toma cualquier entero positivo. Si es par, divídelo entre dos. Si es impar, triplícalo y suma uno. Repite. Todo número que se ha probado acaba en 1. Probablemente. Nadie ha demostrado que deba. La regla cabe en una frase y aun así resiste casi un siglo de ataques.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Empieza en 27 — semilla minúscula. La órbita sube y se desploma y vuelve a subir, llegando a 9 232 (unas 340 veces su valor inicial) antes de caer a 1 en exactamente 111 pasos. Leída en voz alta suena aleatoria; en escala logarítmica parece granizo dentro de un nubarrón.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Verificada por computadora para cada entero hasta 2⁶⁸ — unos 3 × 10²⁰ controles sin excepción. Y aun así falta la demostración. Collatz se ha vuelto el cifrado de ‘fácil de enunciar, imposible de demostrar’. Paul Erdős se encogió de hombros: ‘Las matemáticas aún no están maduras para tales problemas.’ Ofreció 500 dólares. El premio sigue sin reclamar.",
      },
    ],
    tryIt:
      "Abajo: lanza cualquier semilla al granizo y mírala caer — luego haz crecer el coral inverso que sostiene todos los enteros a la vez.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La receta",
      title: "Dos casos, una instrucción",
      body: "Toma cualquier entero positivo n. Si n es par, sustitúyelo por n / 2. Si n es impar, sustitúyelo por 3n + 1. Repite. Esa es toda la regla. Prueba n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, y después 1 → 4 → 2 → 1 para siempre. La aplicación T(n) es uno de los sistemas dinámicos discretos más pequeños jamás escritos. Un niño puede iterarla. Una computadora la itera miles de millones de veces por segundo. Nadie sabe si todas las órbitas regresan a casa.",
    },
    {
      pretitle: "Sección 02 · La órbita de 27",
      title: "Granizo sobre Siracusa",
      body: "Las órbitas reciben el nombre de sucesiones de granizo porque suben y bajan caóticamente antes de tocar tierra — como el granizo dentro de una tormenta. El caso pequeño más famoso es n = 27. Parece demasiado chico para ser interesante y aun así necesita 111 pasos, con un pico en 9 232 — más de 340 veces el inicio. Otras semillas pequeñas con órbitas desproporcionadas: 97 toma 118 pasos, 871 toma 178, 6 171 toma 261, 77 031 toma 350. Entradas diminutas, viajes enormes. El graficador de abajo te deja lanzar cualquiera — o tu propia semilla — al granizo.",
    },
    {
      pretitle: "Sección 03 · La conjetura",
      title: "Todos los caminos llevan a 4 → 2 → 1",
      body: "Lothar Collatz anotó la regla en 1937, dos años después de doctorarse en Berlín. La misma bestia fue redescubierta de forma independiente por Kakutani, Ulam y los teóricos de números de Syracuse, por eso la literatura también la llama problema de Syracuse, problema de Kakutani y conjetura de Ulam. La afirmación es la misma con cualquier nombre: para todo entero positivo n, la iteración T(n) termina llegando a 1 y entra para siempre en el ciclo 4 → 2 → 1. A 2025 está comprobada por cálculo directo para cada entero hasta unos 2,36 × 10²¹. Sin contraejemplo. Tampoco hay demostración.",
    },
    {
      pretitle: "Sección 04 · El resultado de Tao de 2019",
      title: "Casi todas las órbitas, casi hasta el final",
      body: "El avance más profundo llegó en 2019 de la mano de Terence Tao. Su artículo ‘Almost all orbits of the Collatz map attain almost bounded values’ demuestra que para toda función f(n) que tienda a infinito, el conjunto de enteros de partida cuya órbita de Collatz acaba por bajar de f(n) tiene densidad natural 1. En cristiano: elige un entero al azar; casi seguro su órbita termina por encogerse bajo cualquier cota que fijes de antemano. Es un casi-roce probabilístico, no una demostración. Los posibles contraejemplos formarían un conjunto excepcional de medida cero, pero medida cero no es vacío, y el argumento de Tao no los descarta.",
    },
    {
      pretitle: "Sección 05 · El coral inverso",
      title: "Corre la regla al revés y los enteros se auto-ensamblan",
      body: "Hacia adelante, Collatz es un número cada vez. Hacia atrás, Collatz es el árbol completo. Arranca en 1 e invierte la regla: cada nodo n tiene padre 2n (siempre — fue su paso de halving) y, además, padre (n − 1) / 3 cuando ese número es un entero impar mayor que 1. Crece el árbol en anchura y los enteros se ensamblan en un coral ramificado infinito, con raíz en 1 y abriéndose hacia fuera. La conjetura de Collatz es exactamente la afirmación de que todo entero positivo aparece en algún punto de este único árbol — que el coral, a la larga, los contiene a todos.",
    },
    {
      pretitle: "Sección 06 · Qué impide demostrarlo",
      title: "Una invariante que nadie encuentra",
      body: "¿Por qué es tan duro? La razón profunda: nadie ha encontrado una invariante suficiente. Para probar que toda órbita termina necesitas una magnitud que disminuya estrictamente con la iteración, o una función de Lyapunov, o un potencial ingenioso — y nada así ha aparecido en ochenta y ocho años. John Conway demostró en 1972 que una aplicación tipo Collatz ligeramente generalizada ya es indecidible; su posterior sistema FRACTRAN (1987) realizó la Turing-completitud plena en exactamente este estilo de aritmética ramificada. Eso sugiere que el propio Collatz puede vivir cerca de la frontera de la indecidibilidad: un problema no solo duro sino quizá fuera del alcance de cualquier sistema de demostración finito. Quizá Erdős tenía razón al decir que las matemáticas aún no están maduras.",
    },
  ],
  closingTitle: "Mírala caer.",
  closingBody:
    "El Explorador grafica la trayectoria de granizo de cualquier número en un lienzo más amplio, hace crecer el coral inverso a profundidades mucho mayores y permite enfrentar semillas en paralelo. Todo lo que acabas de leer está a un clic.",
  ctaLabel: "→ Abrir el Explorador",
  trajectoryCaption: "Interactivo · graficador de órbita",
  trajectoryTitle: "Lanza una semilla al granizo",
  trajectoryBody:
    "Teclea cualquier entero positivo. El lienzo dibuja la órbita en escala logarítmica hasta 1 — marca el pico (cian) y el punto de aterrizaje (ámbar). Las semillas famosas 27, 871, 6 171 y 77 031 vienen preconfiguradas.",
  trajectoryInputLabel: "Entero inicial n",
  trajectoryPresetLabel: "Semillas famosas",
  trajectoryStepsLabel: "Tiempo de parada",
  trajectoryPeakLabel: "Altura máxima",
  trajectoryHint:
    "Anillo cian = valor más alto de la órbita. Punto ámbar = el 1 final. El eje y es logarítmico para ver el granizo cruzar órdenes de magnitud.",
  treeCaption: "Interactivo · coral inverso",
  treeTitle: "Corre la regla al revés desde 1",
  treeBody:
    "Todo entero del universo Collatz está en algún lugar de este árbol — si la conjetura es cierta. Mueve el control de profundidad y mira el coral abrirse desde el 1 central. A profundidad 14 el árbol ya alberga cientos de enteros.",
  treeDepthLabel: "Profundidad inversa",
  treeNodeLabel: "Enteros alcanzados",
  treeHint:
    "Cada nodo n se ramifica siempre a 2n y, además, a (n − 1) / 3 cuando da un entero impar mayor que 1. El color cicla con la profundidad — rosa en la raíz, después ámbar, cian, violeta en lo más fino.",
  erdosQuote: "«Las matemáticas aún no están maduras para tales problemas.»",
  erdosNote:
    "Paul Erdős, ofreciendo 500 dólares por una solución. Ochenta y ocho años después de que Collatz escribiera la regla, el premio sigue sin reclamar.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 pasos · pico 9 232 · 340× el inicio",
};

// French -----------------------------------------------------------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Chaos",
    title: "La Conjecture de Collatz",
    tagline: "Pair, on divise. Impair, on triple plus un. Finit à 1 — probablement.",
    intro:
      "Une règle en quatre mots, quatre-vingt-huit ans de silence. Choisis un entier positif : s'il est pair, on le divise par deux ; sinon, on le remplace par 3n + 1, et la suite finit toujours par tomber dans le cycle 4 → 2 → 1. Les ordinateurs l'ont vérifié pour chaque entier jusqu'à environ 2⁶⁸. Personne n'a prouvé que cela doit toujours arriver.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Le problème ouvert le plus simple des mathématiques.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Choisis n'importe quel entier positif. S'il est pair, divise-le par deux. S'il est impair, triple-le et ajoute un. Recommence. Tout point de départ jamais testé finit par atteindre 1. Probablement. Personne n'a prouvé qu'il le doit. La règle tient en un souffle et résiste pourtant à tous les assauts depuis presque un siècle.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Pars de 27 — graine minuscule. L'orbite monte, s'effondre, remonte, atteint 9 232 (environ 340 fois son point de départ) avant de retomber sur 1 en exactement 111 étapes. Lue à voix haute, la trajectoire paraît aléatoire ; en échelle logarithmique, elle ressemble à de la grêle dans un orage.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Vérifié par ordinateur pour chaque entier jusqu'à 2⁶⁸ — environ 3 × 10²⁰ contrôles, sans exception. Et pourtant, pas de preuve. Collatz est devenu le code de ‘facile à énoncer, impossible à prouver’. Paul Erdős haussa les épaules : ‘Les mathématiques ne sont pas encore mûres pour de tels problèmes.’ Il offrit 500 dollars. Le prix n'a jamais été réclamé.",
      },
    ],
    tryIt:
      "En bas : jette n'importe quelle graine dans la grêle et regarde-la tomber — puis fais pousser le corail inverse qui tient tous les entiers d'un coup.",
  },
  sections: [
    {
      pretitle: "Section 01 · La recette",
      title: "Deux cas, une seule consigne",
      body: "Choisis un entier positif n. Si n est pair, remplace-le par n / 2. Si n est impair, remplace-le par 3n + 1. Recommence. C'est toute la règle. Essaie n = 7 : 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, puis 1 → 4 → 2 → 1 pour toujours. L'application T(n) est l'un des plus petits systèmes dynamiques discrets jamais écrits. Un enfant peut l'itérer. Un ordinateur l'itère des milliards de fois par seconde. Personne ne sait si toutes les orbites rentrent vraiment à la maison.",
    },
    {
      pretitle: "Section 02 · L'orbite de 27",
      title: "Grêle sur Syracuse",
      body: "Les orbites sont surnommées suites de grêle parce qu'elles montent et descendent en désordre avant de toucher le sol — comme la grêle ballottée dans un nuage d'orage. Le petit cas le plus célèbre est n = 27. Trop petit, semble-t-il, pour être intéressant — et pourtant il faut 111 étapes pour s'éteindre, avec un sommet à 9 232 — plus de 340 fois le départ. Autres petites graines aux orbites disproportionnées : 97 prend 118 étapes, 871 en prend 178, 6 171 en prend 261, 77 031 en prend 350. Entrées minuscules, voyages immenses. Le traceur ci-dessous te laisse jeter n'importe laquelle d'entre elles — ou ta propre graine — dans la grêle.",
    },
    {
      pretitle: "Section 03 · La conjecture",
      title: "Tous les chemins mènent à 4 → 2 → 1",
      body: "Lothar Collatz a noté la règle en 1937 à Berlin, deux ans après sa thèse. La même bête fut redécouverte indépendamment par Kakutani, Ulam et les théoriciens des nombres de Syracuse, d'où les autres noms : problème de Syracuse, problème de Kakutani, conjecture d'Ulam. L'énoncé est partout le même : pour tout entier positif n, l'itération T(n) finit par atteindre 1 et tourne ensuite pour toujours dans le cycle 4 → 2 → 1. En 2025 elle est vérifiée par calcul direct pour tout entier jusqu'à environ 2,36 × 10²¹. Aucun contre-exemple. Aucune preuve non plus.",
    },
    {
      pretitle: "Section 04 · Le résultat de Tao en 2019",
      title: "Presque toutes les orbites, presque jusqu'au bout",
      body: "Le progrès le plus profond vient de Terence Tao en 2019. Son article ‘Almost all orbits of the Collatz map attain almost bounded values’ montre que pour toute fonction f(n) tendant vers l'infini, l'ensemble des entiers de départ dont l'orbite de Collatz finit par tomber sous f(n) a densité naturelle 1. En clair : tire un entier au hasard ; presque sûrement son orbite finit par passer sous n'importe quelle borne fixée à l'avance. C'est un quasi-passé probabiliste, pas une preuve. Les contre-exemples éventuels formeraient un ensemble exceptionnel de mesure nulle, mais mesure nulle ne veut pas dire vide, et l'argument de Tao ne les exclut pas.",
    },
    {
      pretitle: "Section 05 · Le corail inverse",
      title: "Inverse la règle et les entiers s'auto-assemblent",
      body: "En avant, Collatz, c'est un nombre à la fois. À l'envers, Collatz, c'est tout l'arbre. Pars de 1 et inverse la règle : chaque nœud n a pour parent 2n (toujours — c'était son pas de division) et, en plus, un parent (n − 1) / 3 dès que ce nombre est un entier impair strictement supérieur à 1. Fais pousser l'arbre en largeur et les entiers s'assemblent en un corail ramifié infini, enraciné en 1, s'ouvrant vers l'extérieur. La conjecture de Collatz est exactement l'énoncé que tout entier positif apparaît quelque part dans cet unique arbre — que le corail, à la fin, les contient tous.",
    },
    {
      pretitle: "Section 06 · Ce qui bloque la preuve",
      title: "Un invariant que personne n'a trouvé",
      body: "Pourquoi est-ce si difficile ? La raison profonde : personne n'a trouvé d'invariant suffisant. Pour prouver que toute orbite s'arrête, il te faut une quantité qui décroît strictement le long de l'itération, ou une fonction de Lyapunov, ou un potentiel astucieux — et rien de tel n'a émergé en quatre-vingt-huit ans. John Conway a montré en 1972 qu'une application de type Collatz légèrement généralisée est déjà indécidable ; son système FRACTRAN ultérieur (1987) a ensuite réalisé la Turing-complétude entière dans exactement ce style d'arithmétique ramifiée. Cela suggère que Collatz lui-même vit peut-être près de la frontière de l'indécidabilité : un problème non seulement difficile, mais peut-être hors d'atteinte de tout système de preuve fini. Erdős avait peut-être raison.",
    },
  ],
  closingTitle: "Regarde-la tomber.",
  closingBody:
    "L'Explorateur trace la grêle de n'importe quelle graine sur une plus grande toile, fait pousser le corail inverse beaucoup plus profondément et te laisse comparer plusieurs graines côte à côte. Tout ce que tu viens de lire est à un clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  trajectoryCaption: "Interactif · traceur d'orbite",
  trajectoryTitle: "Lance une graine dans la grêle",
  trajectoryBody:
    "Tape un entier positif. La toile dessine l'orbite en échelle logarithmique jusqu'à 1 — sommet (cyan) et point d'atterrissage (ambre) marqués. Les graines fameuses 27, 871, 6 171 et 77 031 sont préréglées.",
  trajectoryInputLabel: "Entier de départ n",
  trajectoryPresetLabel: "Graines fameuses",
  trajectoryStepsLabel: "Temps d'arrêt",
  trajectoryPeakLabel: "Hauteur maximale",
  trajectoryHint:
    "Anneau cyan = plus haute valeur atteinte. Point ambre = le 1 final. L'axe y est logarithmique, on voit la grêle traverser des ordres de grandeur.",
  treeCaption: "Interactif · corail inverse",
  treeTitle: "Inverse la règle depuis 1",
  treeBody:
    "Tout entier de l'univers Collatz est quelque part dans cet arbre — si la conjecture est vraie. Glisse la profondeur et regarde le corail s'ouvrir depuis le 1 central. À profondeur 14, l'arbre contient déjà des centaines d'entiers.",
  treeDepthLabel: "Profondeur inverse",
  treeNodeLabel: "Entiers atteints",
  treeHint:
    "Chaque nœud n se ramifie toujours vers 2n et, en plus, vers (n − 1) / 3 lorsque cela donne un entier impair plus grand que 1. La couleur tourne avec la profondeur — rose à la racine, puis ambre, cyan, violet pour les détails.",
  erdosQuote: "« Les mathématiques ne sont pas encore mûres pour de tels problèmes. »",
  erdosNote:
    "Paul Erdős, qui offrait 500 dollars pour une solution. Quatre-vingt-huit ans après que Collatz a écrit la règle, le prix n'a jamais été réclamé.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 étapes · sommet 9 232 · 340× le départ",
};

// Italian ----------------------------------------------------------------
const it: RichStory = {
  page: {
    pretitle: "Argomento · Caos",
    title: "La Congettura di Collatz",
    tagline: "Pari, dimezza. Dispari, triplica più uno. Finisce a 1 — probabilmente.",
    intro:
      "Una regola in quattro parole, ottantotto anni di silenzio. Prendi un intero positivo: se è pari dividilo per due, se è dispari sostituiscilo con 3n + 1, e la successione finisce nel ciclo 4 → 2 → 1. I computer l'hanno verificata per ogni intero fino a circa 2⁶⁸. Nessuno ha dimostrato che debba sempre succedere.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Il problema aperto più semplice della matematica.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Prendi un qualsiasi intero positivo. Se è pari, dimezzalo. Se è dispari, triplicalo e somma uno. Ripeti. Ogni numero di partenza mai provato finisce a 1. Probabilmente. Nessuno ha dimostrato che debba. La regola sta in un respiro e resiste comunque a quasi un secolo di attacchi.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Parti da 27 — seme minuscolo. L'orbita sale e crolla e risale, raggiunge 9 232 (circa 340 volte il valore iniziale) prima di ricadere a 1 in esattamente 111 passi. Letta a voce alta sembra casuale; su scala logaritmica somiglia a grandine dentro un nubifragio.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Verificata al computer per ogni intero fino a 2⁶⁸ — circa 3 × 10²⁰ controlli senza eccezioni. Eppure manca la dimostrazione. Collatz è diventato il sinonimo di ‘facile da enunciare, impossibile da provare’. Paul Erdős scrollò le spalle: ‘La matematica non è ancora matura per tali problemi.’ Offrì 500 dollari. Il premio non è mai stato ritirato.",
      },
    ],
    tryIt:
      "Sotto: butta un qualunque seme nella grandine e guardalo cadere — poi fai crescere il corallo inverso che tiene tutti gli interi insieme.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La ricetta",
      title: "Due casi, una sola istruzione",
      body: "Prendi un intero positivo n. Se n è pari, sostituiscilo con n / 2. Se n è dispari, sostituiscilo con 3n + 1. Ripeti. Questa è tutta la regola. Prova n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, e poi 1 → 4 → 2 → 1 per sempre. La mappa T(n) è uno dei più piccoli sistemi dinamici discreti mai scritti. Un bambino può iterarla. Un computer la itera miliardi di volte al secondo. Nessuno sa se ogni orbita torni davvero a casa.",
    },
    {
      pretitle: "Sezione 02 · L'orbita di 27",
      title: "Grandine su Siracusa",
      body: "Le orbite si chiamano successioni di grandine perché salgono e cadono in modo erratico prima di toccare terra — come grandine sbattuta dentro un temporale. Il piccolo caso più famoso è n = 27. Sembra troppo piccolo per essere interessante e invece servono 111 passi per terminare, con un picco a 9 232 — oltre 340 volte il punto di partenza. Altri semi piccoli con orbite sproporzionate: 97 fa 118 passi, 871 ne fa 178, 6 171 ne fa 261, 77 031 ne fa 350. Input minimi, viaggi enormi. Il tracciatore qui sotto ti lascia gettare uno qualunque — o un tuo seme — nella grandine.",
    },
    {
      pretitle: "Sezione 03 · La congettura",
      title: "Ogni strada porta a 4 → 2 → 1",
      body: "Lothar Collatz annotò la regola nel 1937, a Berlino, due anni dopo il dottorato. La stessa bestia fu riscoperta indipendentemente da Kakutani, Ulam e dai teorici dei numeri di Siracusa: ecco perché in letteratura compare anche come problema di Siracusa, problema di Kakutani e congettura di Ulam. L'affermazione è sempre la stessa: per ogni intero positivo n, l'iterazione T(n) raggiunge alla fine 1 e poi gira per sempre nel ciclo 4 → 2 → 1. Al 2025 è verificata per calcolo diretto per ogni intero fino a circa 2,36 × 10²¹. Nessun controesempio. Neppure una dimostrazione.",
    },
    {
      pretitle: "Sezione 04 · Il risultato di Tao del 2019",
      title: "Quasi tutte le orbite, quasi fino a casa",
      body: "Il progresso più profondo è arrivato nel 2019 da Terence Tao. Il suo articolo ‘Almost all orbits of the Collatz map attain almost bounded values’ mostra che per ogni funzione f(n) che tende all'infinito, l'insieme degli interi di partenza la cui orbita di Collatz finisce sotto f(n) ha densità naturale 1. In chiaro: prendi un intero a caso; quasi sicuramente la sua orbita finisce per scendere sotto qualsiasi soglia tu fissi prima. È un quasi-passaggio probabilistico, non una dimostrazione. Gli eventuali controesempi formerebbero un insieme eccezionale di misura nulla, ma misura nulla non significa vuoto, e l'argomento di Tao non li esclude.",
    },
    {
      pretitle: "Sezione 05 · Il corallo inverso",
      title: "Inverti la regola e gli interi si auto-assemblano",
      body: "In avanti, Collatz è un numero alla volta. All'indietro, Collatz è l'intero albero. Parti da 1 e inverti la regola: ogni nodo n ha genitore 2n (sempre — era il suo passo di dimezzamento) e, in più, genitore (n − 1) / 3 quando quel numero è un intero dispari strettamente maggiore di 1. Fai crescere l'albero in ampiezza e gli interi si assemblano in un corallo ramificato infinito, radicato in 1 e aperto verso l'esterno. La congettura di Collatz è esattamente l'affermazione che ogni intero positivo compare da qualche parte in questo unico albero — che il corallo, alla fine, li contiene tutti.",
    },
    {
      pretitle: "Sezione 06 · Cosa blocca la dimostrazione",
      title: "Un invariante che nessuno trova",
      body: "Perché è così difficile? La ragione profonda: nessuno ha trovato un invariante sufficiente. Per dimostrare che ogni orbita termina ti serve una grandezza che cali strettamente lungo l'iterazione, o una funzione di Lyapunov, o un potenziale ingegnoso — e nulla del genere è emerso in ottantotto anni. John Conway dimostrò nel 1972 che una mappa alla Collatz leggermente generalizzata è già indecidibile; il suo successivo sistema FRACTRAN (1987) ha poi realizzato la piena Turing-completezza proprio in questo stile di aritmetica ramificata. Suggerisce che Collatz stesso possa vivere vicino al confine dell'indecidibilità: un problema non solo difficile ma forse fuori dalla portata di qualsiasi sistema di prova finito. Erdős poteva avere ragione.",
    },
  ],
  closingTitle: "Guardala cadere.",
  closingBody:
    "L'Esploratore traccia la grandine di qualsiasi numero su una tela più ampia, fa crescere il corallo inverso a profondità molto maggiori e ti lascia gareggiare semi affiancati. Tutto quello che hai appena letto è a un clic.",
  ctaLabel: "→ Apri l'Esploratore",
  trajectoryCaption: "Interattivo · tracciatore di orbita",
  trajectoryTitle: "Butta un seme nella grandine",
  trajectoryBody:
    "Digita un intero positivo. La tela disegna l'orbita in scala logaritmica fino a 1 — picco (ciano) e atterraggio (ambra) segnati. I semi famosi 27, 871, 6 171 e 77 031 sono pre-impostati.",
  trajectoryInputLabel: "Intero di partenza n",
  trajectoryPresetLabel: "Semi famosi",
  trajectoryStepsLabel: "Tempo di arresto",
  trajectoryPeakLabel: "Altezza massima",
  trajectoryHint:
    "Anello ciano = valore più alto dell'orbita. Punto ambra = l'1 finale. L'asse y è logaritmico per vedere la grandine attraversare ordini di grandezza.",
  treeCaption: "Interattivo · corallo inverso",
  treeTitle: "Inverti la regola partendo da 1",
  treeBody:
    "Ogni intero dell'universo Collatz sta da qualche parte in questo albero — se la congettura è vera. Sposta la profondità e guarda il corallo aprirsi dal centrale 1. A profondità 14 l'albero raccoglie già centinaia di interi.",
  treeDepthLabel: "Profondità inversa",
  treeNodeLabel: "Interi raggiunti",
  treeHint:
    "Ogni nodo n si ramifica sempre verso 2n e in più verso (n − 1) / 3 quando dà un intero dispari maggiore di 1. Il colore ruota con la profondità — rosa alla radice, poi ambra, ciano, viola per il dettaglio.",
  erdosQuote: "«La matematica non è ancora matura per tali problemi.»",
  erdosNote:
    "Paul Erdős, che offrì 500 dollari per una soluzione. Ottantotto anni dopo che Collatz scrisse la regola, il premio non è mai stato ritirato.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 passi · picco 9 232 · 340× la partenza",
};

// Portuguese -------------------------------------------------------------
const pt: RichStory = {
  page: {
    pretitle: "Tópico · Caos",
    title: "A Conjetura de Collatz",
    tagline: "Par, divide. Ímpar, triplica mais um. Termina em 1 — provavelmente.",
    intro:
      "Uma regra em quatro palavras, oitenta e oito anos de silêncio. Toma qualquer inteiro positivo: se for par divide por dois, se for ímpar substitui por 3n + 1, e a sequência acaba por cair no ciclo 4 → 2 → 1. Os computadores já verificaram para cada inteiro até cerca de 2⁶⁸. Ninguém provou que tem de ser sempre assim.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "O problema em aberto mais simples da matemática.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Toma qualquer inteiro positivo. Se for par, divide por dois. Se for ímpar, triplica e soma um. Repete. Todo número de partida alguma vez testado acaba em 1. Provavelmente. Ninguém provou que deva. A regra cabe num suspiro e mesmo assim resiste a quase um século de ataques.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Começa em 27 — semente minúscula. A órbita sobe, despenca, volta a subir, atinge 9 232 (cerca de 340 vezes o valor inicial) antes de cair a 1 em exatamente 111 passos. Lida em voz alta soa aleatória; em escala logarítmica parece granizo dentro de uma tempestade.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Verificada por computador para cada inteiro até 2⁶⁸ — uns 3 × 10²⁰ testes sem exceção. E mesmo assim falta a demonstração. Collatz tornou-se a cifra de ‘fácil de enunciar, impossível de demonstrar’. Paul Erdős encolheu os ombros: ‘A matemática ainda não está madura para tais problemas.’ Ofereceu 500 dólares. O prémio continua por reclamar.",
      },
    ],
    tryIt:
      "Em baixo: lança qualquer semente para o granizo e vê-a cair — depois faz crescer o coral inverso que segura todos os inteiros ao mesmo tempo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A receita",
      title: "Dois casos, uma só instrução",
      body: "Toma um inteiro positivo n. Se n for par, substitui por n / 2. Se for ímpar, substitui por 3n + 1. Repete. É toda a regra. Tenta n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, e depois 1 → 4 → 2 → 1 para sempre. A aplicação T(n) é um dos menores sistemas dinâmicos discretos alguma vez escritos. Uma criança pode iterá-la. Um computador itera-a milhares de milhões de vezes por segundo. Ninguém sabe se todas as órbitas voltam realmente para casa.",
    },
    {
      pretitle: "Secção 02 · A órbita de 27",
      title: "Granizo sobre Siracusa",
      body: "As órbitas são apelidadas de sequências de granizo porque sobem e descem de forma errática antes de aterrar — como granizo agitado dentro de uma trovoada. O caso pequeno mais famoso é n = 27. Parece pequeno demais para ser interessante e ainda assim precisa de 111 passos, com pico em 9 232 — mais de 340 vezes o início. Outras sementes pequenas com órbitas desproporcionadas: 97 faz 118 passos, 871 faz 178, 6 171 faz 261, 77 031 faz 350. Entradas minúsculas, viagens enormes. O traçador abaixo deixa-te lançar qualquer uma — ou a tua própria semente — para o granizo.",
    },
    {
      pretitle: "Secção 03 · A conjetura",
      title: "Todos os caminhos levam a 4 → 2 → 1",
      body: "Lothar Collatz anotou a regra em 1937, em Berlim, dois anos depois do doutoramento. A mesma besta foi redescoberta independentemente por Kakutani, Ulam e pelos teóricos dos números de Syracuse — daí na literatura aparecer também como problema de Syracuse, problema de Kakutani e conjetura de Ulam. A afirmação é sempre a mesma: para todo inteiro positivo n, a iteração T(n) acaba por chegar a 1 e gira para sempre no ciclo 4 → 2 → 1. Em 2025 está verificada por cálculo direto para cada inteiro até cerca de 2,36 × 10²¹. Sem contraexemplo. Sem demonstração também.",
    },
    {
      pretitle: "Secção 04 · O resultado de Tao de 2019",
      title: "Quase todas as órbitas, quase até ao fim",
      body: "O progresso mais profundo veio em 2019 da mão de Terence Tao. O seu artigo ‘Almost all orbits of the Collatz map attain almost bounded values’ mostra que para qualquer função f(n) que tende a infinito, o conjunto dos inteiros de partida cuja órbita de Collatz acaba por descer abaixo de f(n) tem densidade natural 1. Em claro: escolhe um inteiro ao acaso; quase de certeza a sua órbita acaba por encolher abaixo de qualquer limite fixado de antemão. É um quase-falhanço probabilístico, não uma demonstração. Os contraexemplos eventuais formariam um conjunto excepcional de medida zero, mas medida zero não é vazio, e o argumento de Tao não os exclui.",
    },
    {
      pretitle: "Secção 05 · O coral inverso",
      title: "Inverte a regra e os inteiros auto-organizam-se",
      body: "Para a frente, Collatz é um número de cada vez. Para trás, Collatz é a árvore inteira. Começa em 1 e inverte a regra: cada nó n tem pai 2n (sempre — foi o seu passo de divisão) e, além disso, pai (n − 1) / 3 quando esse número for um inteiro ímpar estritamente maior que 1. Faz crescer a árvore em largura e os inteiros organizam-se num coral ramificado infinito, com raiz em 1 e abrindo-se para fora. A conjetura de Collatz é exatamente a afirmação de que todo inteiro positivo aparece nalgum sítio desta única árvore — que o coral, no fim, contém todos.",
    },
    {
      pretitle: "Secção 06 · O que trava a demonstração",
      title: "Um invariante que ninguém encontra",
      body: "Porque é tão difícil? A razão profunda: ninguém encontrou um invariante suficiente. Para provar que toda órbita termina precisas de uma grandeza que decresça estritamente ao longo da iteração, ou uma função de Lyapunov, ou um potencial engenhoso — e nada disso surgiu em oitenta e oito anos. John Conway demonstrou em 1972 que um mapa à Collatz ligeiramente generalizado já é indecidível; o seu posterior sistema FRACTRAN (1987) realizou então a Turing-completude plena neste mesmo estilo de aritmética ramificada. Sugere que Collatz vive perto da fronteira da indecidibilidade: um problema não apenas difícil, mas talvez fora do alcance de qualquer sistema de prova finito. Erdős podia ter razão.",
    },
  ],
  closingTitle: "Vê-a cair.",
  closingBody:
    "O Explorador traça o granizo de qualquer semente numa tela maior, faz crescer o coral inverso a profundidades muito maiores e deixa-te correr sementes lado a lado. Tudo o que acabaste de ler está a um clique.",
  ctaLabel: "→ Abrir o Explorador",
  trajectoryCaption: "Interativo · traçador de órbita",
  trajectoryTitle: "Lança uma semente para o granizo",
  trajectoryBody:
    "Escreve um inteiro positivo. A tela desenha a órbita em escala logarítmica até 1 — pico (ciano) e aterragem (âmbar) marcados. As sementes famosas 27, 871, 6 171 e 77 031 já vêm preconfiguradas.",
  trajectoryInputLabel: "Inteiro inicial n",
  trajectoryPresetLabel: "Sementes famosas",
  trajectoryStepsLabel: "Tempo de paragem",
  trajectoryPeakLabel: "Altura máxima",
  trajectoryHint:
    "Anel ciano = valor mais alto da órbita. Ponto âmbar = o 1 final. O eixo y é logarítmico para ver o granizo atravessar ordens de grandeza.",
  treeCaption: "Interativo · coral inverso",
  treeTitle: "Inverte a regra a partir de 1",
  treeBody:
    "Todo inteiro do universo Collatz está nalgum lugar desta árvore — se a conjetura for verdadeira. Desliza a profundidade e vê o coral abrir-se do 1 central. À profundidade 14 a árvore já guarda centenas de inteiros.",
  treeDepthLabel: "Profundidade inversa",
  treeNodeLabel: "Inteiros alcançados",
  treeHint:
    "Cada nó n ramifica sempre para 2n e ainda para (n − 1) / 3 quando isso dá um inteiro ímpar maior que 1. A cor roda com a profundidade — rosa na raiz, depois âmbar, ciano, violeta para o detalhe.",
  erdosQuote: "«A matemática ainda não está madura para tais problemas.»",
  erdosNote:
    "Paul Erdős, oferecendo 500 dólares pela solução. Oitenta e oito anos depois de Collatz ter escrito a regra, o prémio continua por reclamar.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 passos · pico 9 232 · 340× o início",
};

// Swedish ----------------------------------------------------------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Kaos",
    title: "Collatz-förmodan",
    tagline: "Jämnt, halvera. Udda, tre-plus-ett. Slutar på 1 — troligen.",
    intro:
      "En regel i fyra ord, åttioåtta år av tystnad. Välj vilket positivt heltal som helst: är det jämnt, halvera det; är det udda, ersätt det med 3n + 1, och följden faller till sist in i cykeln 4 → 2 → 1. Datorerna har kollat varje heltal upp till ungefär 2⁶⁸. Ingen har bevisat att det måste hända.",
    ctaInteractive: "→ Öppna utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Matematikens enklaste olösta problem.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Välj vilket positivt heltal som helst. Är det jämnt — halvera. Är det udda — multiplicera med tre och lägg på ett. Upprepa. Varje startvärde som någonsin testats hamnar till slut på 1. Troligen. Ingen har bevisat att det måste. Hela regeln ryms i ett andetag och har trots det stått emot allt i nästan ett sekel.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Börja på 27 — pyttelitet frö. Banan stiger, kraschar, stiger igen, når 9 232 (omkring 340× sitt utgångsvärde) innan den faller ner till 1 på exakt 111 steg. Läs banan högt och den låter slumpmässig; rita den på logaritmisk skala och den ser ut som hagel i en åskmolnsbukett.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Datorverifierad för varje heltal upp till 2⁶⁸ — ungefär 3 × 10²⁰ tester, inget undantag. Ändå saknas beviset. Collatz har blivit förkortningen för ‘lätt att formulera, omöjlig att bevisa’. Paul Erdős ryckte på axlarna: ‘Matematiken är ännu inte mogen för sådana problem.’ Han bjöd 500 dollar. Priset är fortfarande inte uthämtat.",
      },
    ],
    tryIt:
      "Nedan: släpp vilket frö som helst i hagelstormen och se det falla — väx sedan den omvända korallen som rymmer alla heltal samtidigt.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Receptet",
      title: "Två fall, en enda instruktion",
      body: "Välj ett positivt heltal n. Är n jämnt, ersätt med n / 2. Är n udda, ersätt med 3n + 1. Upprepa. Det är hela regeln. Pröva n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, och därefter 1 → 4 → 2 → 1 för alltid. Avbildningen T(n) är ett av de minsta diskreta dynamiska system som någonsin skrivits ned. Ett barn kan iterera den. En dator kan göra det miljarder gånger per sekund. Ingen vet om varje bana verkligen hittar hem.",
    },
    {
      pretitle: "Avsnitt 02 · Banan för 27",
      title: "Hagel över Syrakusa",
      body: "Banorna kallas hagelsekvenser eftersom de stiger och faller oregelbundet innan de slår i marken — som hagel i en åskcell. Det berömdaste lilla fallet är n = 27. Ser ut för litet för att vara intressant och ändå krävs 111 steg, med topp på 9 232 — över 340 gånger startvärdet. Andra små frön med oproportionerliga banor: 97 tar 118 steg, 871 tar 178, 6 171 tar 261, 77 031 tar 350. Pyttesmå indata, enorma resor. Plottaren nedan låter dig kasta vilken som helst — eller ditt eget frö — i hagelstormen.",
    },
    {
      pretitle: "Avsnitt 03 · Förmodan",
      title: "Varje väg leder till 4 → 2 → 1",
      body: "Lothar Collatz nedtecknade regeln 1937 i Berlin, två år efter doktorsdisputationen. Samma odjur återupptäcktes oberoende av Kakutani, Ulam och talteoretikerna i Syracuse, vilket är varför litteraturen också kallar det Syracuse-problemet, Kakutanis problem och Ulams förmodan. Påståendet är överallt detsamma: för varje positivt heltal n når iterationen T(n) till slut 1, och cyklar sedan för evigt i 4 → 2 → 1. Per 2025 är den verifierad genom direkt beräkning för varje heltal upp till cirka 2,36 × 10²¹. Inget motexempel. Inget bevis heller.",
    },
    {
      pretitle: "Avsnitt 04 · Taos resultat från 2019",
      title: "Nästan alla banor, nästan hela vägen hem",
      body: "Det djupaste framsteget kom 2019 från Terence Tao. Hans artikel ‘Almost all orbits of the Collatz map attain almost bounded values’ visar att för varje funktion f(n) som går mot oändligheten har mängden av starttal vilkas Collatz-bana till slut sjunker under f(n) naturlig täthet 1. På klarspråk: dra ett heltal slumpvis; nästan säkert sjunker dess bana till sist under vilken gräns du än sätter i förväg. Det är en probabilistisk nästan-träff, inget bevis. Eventuella motexempel skulle bilda en undantagsmängd av mått noll, men mått noll är inte tomt, och Taos argument utesluter dem inte uttryckligen.",
    },
    {
      pretitle: "Avsnitt 05 · Den omvända korallen",
      title: "Kör regeln baklänges och heltalen samlar sig själva",
      body: "Framåt är Collatz ett tal i taget. Bakåt är Collatz hela trädet. Börja vid 1 och vänd regeln: varje nod n har förälder 2n (alltid — det var dess halveringssteg) och dessutom föräldern (n − 1) / 3 så snart det talet är ett positivt udda heltal strikt större än 1. Låt trädet växa i bredd och heltalen samlar sig till en oändligt grenig korall, rotad vid 1 och utbredd utåt. Collatz-förmodan är precis påståendet att varje positivt heltal dyker upp någonstans i detta enda träd — att korallen i slutändan rymmer dem alla.",
    },
    {
      pretitle: "Avsnitt 06 · Det som stoppar beviset",
      title: "En invariant ingen har hittat",
      body: "Varför är det så svårt? Det djupa skälet: ingen har hittat en tillräcklig invariant. För att bevisa att varje bana avslutas behöver du en storhet som strikt minskar längs iterationen, eller en Lyapunov-funktion, eller en smart potential — och inget sådant har dykt upp på åttioåtta år. John Conway visade 1972 att redan en lätt generaliserad Collatz-liknande avbildning är oavgörbar; hans senare FRACTRAN-system (1987) realiserade sedan full Turing-komplettering i precis den här stilen av grenad aritmetik. Det antyder att Collatz själv kan ligga nära oavgörbarhetens gräns: ett problem inte bara svårt utan kanske bortom räckhåll för varje ändligt bevissystem. Erdős kan ha haft rätt.",
    },
  ],
  closingTitle: "Se den falla.",
  closingBody:
    "Utforskaren ritar hagelbanan för vilket starttal som helst på en större duk, växer den omvända korallen till mycket större djup och låter dig köra frön parallellt. Allt du nyss läste är ett klick bort.",
  ctaLabel: "→ Öppna utforskaren",
  trajectoryCaption: "Interaktivt · banplottare",
  trajectoryTitle: "Släpp ett frö i hagelstormen",
  trajectoryBody:
    "Skriv ett positivt heltal. Duken ritar banan på logaritmisk skala fram till 1 — topp (cyan) och landningspunkt (bärnsten) markerade. Berömda frön 27, 871, 6 171 och 77 031 är förinställda.",
  trajectoryInputLabel: "Starttal n",
  trajectoryPresetLabel: "Berömda frön",
  trajectoryStepsLabel: "Stopp-tid",
  trajectoryPeakLabel: "Maxhöjd",
  trajectoryHint:
    "Cyan ring = banans högsta värde. Bärnstensprick = den slutgiltiga 1:an. Y-axeln är logaritmisk så du ser haglet röra sig över storleksordningar.",
  treeCaption: "Interaktivt · omvänd korall",
  treeTitle: "Kör regeln baklänges från 1",
  treeBody:
    "Varje heltal i Collatz-universum ligger någonstans i detta träd — om förmodan stämmer. Dra i djupreglaget och se korallen vecka ut sig från 1:an i mitten. Vid djup 14 håller trädet redan hundratals heltal.",
  treeDepthLabel: "Omvänt djup",
  treeNodeLabel: "Nådda heltal",
  treeHint:
    "Varje nod n grenar alltid till 2n och dessutom till (n − 1) / 3 när det ger ett udda heltal större än 1. Färgen roterar med djupet — rosa vid roten, sedan bärnsten, cyan, violett för finare grenar.",
  erdosQuote: "”Matematiken är ännu inte mogen för sådana problem.”",
  erdosNote:
    "Paul Erdős, som bjöd 500 dollar för en lösning. Åttioåtta år efter att Collatz nedtecknade regeln är priset fortfarande inte uthämtat.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 steg · topp 9 232 · 340× starten",
};

// Norwegian --------------------------------------------------------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Kaos",
    title: "Collatz-formodningen",
    tagline: "Partall, halver. Oddetall, tre-pluss-én. Ender på 1 — sannsynligvis.",
    intro:
      "En regel på fire ord, åttiåtte års stillhet. Velg et positivt heltall: er det et partall, halver det; er det et oddetall, erstatt med 3n + 1, og følgen havner til slutt i sløyfen 4 → 2 → 1. Datamaskinene har sjekket hvert heltall opp til omtrent 2⁶⁸. Ingen har bevist at det må skje.",
    ctaInteractive: "→ Åpne utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "Matematikkens enkleste uløste problem.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "Velg hvilket som helst positivt heltall. Er det et partall — halver. Er det et oddetall — gang med tre og legg til én. Gjenta. Hvert startpunkt som noen gang er testet ender på 1. Sannsynligvis. Ingen har bevist at det må. Hele regelen får plass i ett åndedrag og motstår likevel alle angrep i snart et århundre.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Start på 27 — bittelite frø. Banen stiger, raser, stiger igjen, når 9 232 (omtrent 340× startverdien) før den faller ned til 1 på nøyaktig 111 trinn. Les banen høyt og den høres tilfeldig ut; tegn den på logaritmisk skala og den ligner hagl i en tordensky.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Verifisert av datamaskin for hvert heltall opp til 2⁶⁸ — rundt 3 × 10²⁰ tester, ingen unntak. Likevel mangler beviset. Collatz har blitt kortformen for ‘lett å formulere, umulig å bevise’. Paul Erdős trakk på skuldrene: ‘Matematikken er ennå ikke moden for slike problemer.’ Han lovte 500 dollar. Premien er fortsatt ikke hentet.",
      },
    ],
    tryIt:
      "Under: kast hvilket som helst frø inn i hagelstormen og se det falle — la så den omvendte korallen vokse, den som rommer alle heltallene på én gang.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppskriften",
      title: "To tilfeller, én eneste instruks",
      body: "Velg et positivt heltall n. Er n et partall, erstatt med n / 2. Er n et oddetall, erstatt med 3n + 1. Gjenta. Det er hele regelen. Prøv n = 7: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, og deretter 1 → 4 → 2 → 1 for alltid. Avbildningen T(n) er ett av de minste diskrete dynamiske systemene som noen gang er skrevet ned. Et barn kan itere den. En datamaskin gjør det milliarder av ganger i sekundet. Ingen vet om hver bane virkelig finner hjem.",
    },
    {
      pretitle: "Avsnitt 02 · Banen for 27",
      title: "Hagl over Syrakus",
      body: "Banene kalles haglsekvenser fordi de stiger og faller uregelmessig før de treffer bakken — som hagl ristet i en tordencelle. Det mest kjente lille tilfellet er n = 27. Ser for lite ut til å være interessant, og likevel kreves 111 trinn, med topp på 9 232 — over 340 ganger startverdien. Andre små frø med uforholdsmessige baner: 97 tar 118 trinn, 871 tar 178, 6 171 tar 261, 77 031 tar 350. Bittesmå inndata, enorme reiser. Plottet under lar deg kaste hvilket som helst — eller ditt eget frø — inn i hagelet.",
    },
    {
      pretitle: "Avsnitt 03 · Formodningen",
      title: "Hver vei leder til 4 → 2 → 1",
      body: "Lothar Collatz skrev ned regelen i 1937 i Berlin, to år etter doktorgraden. Samme udyr ble gjenoppdaget uavhengig av Kakutani, Ulam og talleteoretikerne i Syracuse, og derfor kaller litteraturen den også Syracuse-problemet, Kakutanis problem og Ulam-formodningen. Påstanden er den samme overalt: for hvert positivt heltall n når iterasjonen T(n) til slutt 1 og roterer deretter for alltid i sløyfen 4 → 2 → 1. Per 2025 er den verifisert ved direkte regning for hvert heltall opp til omtrent 2,36 × 10²¹. Ingen motrepresentanter. Heller intet bevis.",
    },
    {
      pretitle: "Avsnitt 04 · Taos resultat fra 2019",
      title: "Nesten alle baner, nesten hele veien hjem",
      body: "Det dypeste framskrittet kom i 2019 fra Terence Tao. Artikkelen ‘Almost all orbits of the Collatz map attain almost bounded values’ viser at for hver funksjon f(n) som går mot uendelig har mengden av startheltall hvis Collatz-bane til slutt synker under f(n) naturlig tetthet 1. På klarspråk: trekk et heltall tilfeldig; nesten sikkert ender banen med å krympe under hvilken som helst grense du setter på forhånd. Det er et sannsynlighetsteoretisk nesten-treff, ikke et bevis. Eventuelle motrepresentanter ville danne en unntaksmengde av mål null, men mål null er ikke tom, og Taos argument utelukker dem ikke.",
    },
    {
      pretitle: "Avsnitt 05 · Den omvendte korallen",
      title: "Kjør regelen baklengs, så ordner heltallene seg selv",
      body: "Forover er Collatz ett tall om gangen. Baklengs er Collatz hele treet. Start ved 1 og snu regelen: hver node n har forelder 2n (alltid — det var halveringsskrittet), og i tillegg en forelder (n − 1) / 3 så snart det tallet er et positivt oddetall strengt større enn 1. La treet vokse i bredden, og heltallene samler seg til en uendelig forgrenet korall, rotfestet i 1 og spredd utover. Collatz-formodningen er nettopp påstanden om at hvert positivt heltall dukker opp et sted i dette ene treet — at korallen til slutt rommer dem alle.",
    },
    {
      pretitle: "Avsnitt 06 · Det som hindrer beviset",
      title: "En invariant ingen har funnet",
      body: "Hvorfor er det så vanskelig? Den dypeste grunnen: ingen har funnet en tilstrekkelig invariant. For å bevise at hver bane stopper, trengs en størrelse som strengt avtar langs iterasjonen, eller en Lyapunov-funksjon, eller et slu potensial — og intet slikt har dukket opp på åttiåtte år. John Conway viste i 1972 at allerede en lett generalisert Collatz-lignende avbildning er uavgjørbar; hans senere FRACTRAN-system (1987) realiserte deretter full Turing-komplettering i nettopp denne stilen av forgrenet aritmetikk. Det antyder at Collatz selv kan ligge nær uavgjørbarhetens grense: et problem ikke bare vanskelig, men kanskje utenfor rekkevidde for ethvert endelig bevisystem. Erdős kan ha hatt rett.",
    },
  ],
  closingTitle: "Se den falle.",
  closingBody:
    "Utforskeren tegner hagelbanen for hvert starttall på et større lerret, vokser den omvendte korallen til langt større dybder og lar deg kjøre frø i parallell. Alt du akkurat leste er ett klikk unna.",
  ctaLabel: "→ Åpne utforskeren",
  trajectoryCaption: "Interaktivt · baneplotter",
  trajectoryTitle: "Kast et frø i hagelet",
  trajectoryBody:
    "Skriv et positivt heltall. Lerretet tegner banen på logaritmisk skala helt til 1 — topp (cyan) og landingspunkt (rav) merket. De berømte frøene 27, 871, 6 171 og 77 031 er forhåndsinnstilt.",
  trajectoryInputLabel: "Starttall n",
  trajectoryPresetLabel: "Berømte frø",
  trajectoryStepsLabel: "Stopptid",
  trajectoryPeakLabel: "Største høyde",
  trajectoryHint:
    "Cyan ring = banens høyeste verdi. Ravprikk = den endelige 1-eren. Y-aksen er logaritmisk så du ser haglet bevege seg over størrelsesordener.",
  treeCaption: "Interaktivt · omvendt korall",
  treeTitle: "Kjør regelen baklengs fra 1",
  treeBody:
    "Hvert heltall i Collatz-universet ligger et sted i dette treet — hvis formodningen er sann. Dra i dybdereguleringen og se korallen folde seg ut fra 1-eren i midten. Ved dybde 14 holder treet allerede hundrevis av heltall.",
  treeDepthLabel: "Omvendt dybde",
  treeNodeLabel: "Nådde heltall",
  treeHint:
    "Hver node n forgrener alltid til 2n og i tillegg til (n − 1) / 3 når det gir et oddetall større enn 1. Fargen roterer med dybden — rosa ved roten, så rav, cyan, fiolett for finere grener.",
  erdosQuote: "«Matematikken er ennå ikke moden for slike problemer.»",
  erdosNote:
    "Paul Erdős, som lovte 500 dollar for en løsning. Åttiåtte år etter at Collatz skrev ned regelen er premien fortsatt ikke hentet.",
  twentySevenLabel: "n = 27",
  twentySevenStat: "111 trinn · topp 9 232 · 340× starten",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------
// Small inline SVG mini-graph for the 27 trajectory inside the encounter
// card. Kept inline because nothing else needs it.
// --------------------------------------------------------------------------

function trajectory27(): number[] {
  const out: number[] = [];
  let n = 27;
  out.push(n);
  while (n !== 1) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    out.push(n);
  }
  return out;
}

function Trajectory27Mini() {
  const data = trajectory27();
  const W = 240;
  const H = 90;
  const padL = 4;
  const padR = 4;
  const padT = 6;
  const padB = 6;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const steps = data.length - 1;
  let peak = 0;
  for (const v of data) if (v > peak) peak = v;
  const yMax = Math.log10(peak) + 0.05;
  const xAt = (i: number) => padL + (i / steps) * innerW;
  const yAt = (v: number) => padT + innerH - (Math.log10(Math.max(1, v)) / yMax) * innerH;
  let path = "";
  for (let i = 0; i < data.length; i++) {
    path += `${i === 0 ? "M" : "L"}${xAt(i).toFixed(2)},${yAt(data[i]).toFixed(2)} `;
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Trajectory of n = 27 on a log scale"
    >
      <rect x={0} y={0} width={W} height={H} fill="#06070d" />
      <path d={path} fill="none" stroke="rgba(255,122,182,0.9)" strokeWidth={1.2} />
    </svg>
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-rose/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

export default function CollatzStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={story.page}
      ctaHref="/collatz/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="T(n) = n/2  if even  ·  3n + 1  if odd"
      formulaLatex={
        "T(n) = \\begin{cases} n/2 & n \\text{ even} \\\\ 3n + 1 & n \\text{ odd} \\end{cases}"
      }
      finalLabel={story.closingTitle}
    >
      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              <EncounterCard label={card.label} title={card.title}>
                {i === 1 ? (
                  <>
                    <p>{card.body}</p>
                    <div className="hairline mt-4 rounded-md border bg-ink-950/60 p-2">
                      <Trajectory27Mini />
                    </div>
                    <div className="hairline mt-3 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                      <div className={ACCENT}>{story.twentySevenLabel}</div>
                      <div>{story.twentySevenStat}</div>
                    </div>
                  </>
                ) : (
                  <p>{card.body}</p>
                )}
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the recipe */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — 27 trajectory */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 · Trajectory plotter */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.trajectoryCaption}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.trajectoryTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.trajectoryBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <CollatzTrajectoryPlot
            caption={story.trajectoryCaption}
            inputLabel={story.trajectoryInputLabel}
            presetLabel={story.trajectoryPresetLabel}
            stepsLabel={story.trajectoryStepsLabel}
            peakLabel={story.trajectoryPeakLabel}
            hint={story.trajectoryHint}
          />
        </Reveal>
      </section>

      {/* Section 03 — the conjecture */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Collatz · 1937
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              ∀ n ∈ ℕ⁺ &nbsp; ∃ k ∈ ℕ : T^k(n) = 1
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              For every positive integer n there is a finite number of steps k after which T
              iterated k times lands on 1. Verified for n ≤ 2.36 × 10²¹. Never proved.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — Tao 2019 */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 05 — Reverse coral */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · Reverse coral tree */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.treeCaption}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.treeTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.treeBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <CollatzReverseTree
            caption={story.treeCaption}
            depthLabel={story.treeDepthLabel}
            nodeLabel={story.treeNodeLabel}
            hint={story.treeHint}
          />
        </Reveal>
      </section>

      {/* Section 06 — What stops a proof */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Erdős
            </div>
            <div className="math-italic text-2xl leading-snug text-ink-100 md:text-3xl">
              {story.erdosQuote}
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.erdosNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.encounter.pretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/collatz/explorer"
            className="inline-block rounded-full border border-signal-rose/70 bg-signal-rose/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
