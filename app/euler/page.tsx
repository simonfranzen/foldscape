"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Reveal } from "@/components/Reveal";
import { StoryCard } from "@/components/StoryPageShell";
import { EulerUnitCircle } from "@/components/EulerUnitCircle";
import { EulerTaylorBuilder } from "@/components/EulerTaylorBuilder";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

// --------------------------------------------------------------------------
// Rich, per-locale story content for the Euler page. The hero block still
// comes from the shared stories.ts; everything below is authored inline so
// the page can be a proper long-form story without touching shared bundles.
// --------------------------------------------------------------------------

type RichStory = {
  page: Omit<StoryPage, "sections">;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  // small UI strings for inline demos
  unitCircleCaption: string;
  unitCircleIdentity: string;
  taylorCaption: string;
  taylorTerms: string;
  taylorExp: string;
  taylorCos: string;
  taylorSin: string;
  taylorWalk: string;
  // closing CTA
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
  // helper inline labels
  interactivePretitle1: string;
  interactiveTitle1: string;
  interactiveBody1: string;
  interactivePretitle2: string;
  interactiveTitle2: string;
  interactiveBody2: string;
  // five-characters table
  charactersLabel: string;
  charactersRows: Array<{ sym: string; role: string; home: string }>;
  // proof sketch caption
  proofLabel: string;
  proofIntro: string;
  // connections
  connectionsLabel: string;
  connectionsRows: Array<{ field: string; body: string }>;
  // progression
  progressionLabel: string;
  progressionRows: string[];
  // inline diagram captions (were English literals in the JSX)
  quarterTurnNote: string;
  walkStart: string;
  walkHalfTurn: string;
  walkLand: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Analysis",
    title: "Euler's Identity",
    tagline: "Five numbers, one line.",
    intro:
      "e^(iπ) + 1 = 0 — five constants from five different corners of mathematics, locked into a single equality. The Explorer next door lets you watch e^(iθ) sweep around the unit circle in real time, so you can see, with your own eyes, the moment at θ = π when the identity actually happens.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Five strangers. One line. Forever.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Five of mathematics' most important numbers — e, i, π, 0, 1 — never run into each other in everyday life. Yet one equation, e^(iπ) + 1 = 0, ties all five together with only addition, multiplication, and exponentiation. Nothing else. No constants left over, no decoration. That is the whole identity.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Imagine walking around a circle of radius 1, centred at the origin of a flat plane. Start at the point 1 on the right. Multiplying by e^(iθ) means: walk θ radians around the circle. So walk π radians — half the way round — and you arrive at the point −1. Add 1 and you are back at 0.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: 'Feynman called the formula e^(iθ) = cos θ + i sin θ, of which this identity is the θ = π case, "the most remarkable formula in mathematics", "our jewel." A 1990 Mathematical Intelligencer poll of working mathematicians voted this identity the most beautiful theorem ever proved. It is a bridge: algebra writes the symbols, geometry walks the circle, analysis supplies the infinite series that makes it all click.',
      },
    ],
    tryIt:
      "Below: slide θ around the circle yourself, and watch the Taylor series build it term by term.",
  },
  sections: [
    {
      pretitle: "Section 01 · Five characters",
      title: "Who is in this equation",
      body: "Each of the five numbers arrives from a different country of mathematics. 0 is the additive identity — adding it changes nothing. 1 is the multiplicative identity — multiplying by it changes nothing. e ≈ 2.71828 is the natural base, the number whose own derivative is itself, born in calculus from compound interest and continuous growth. i is the imaginary unit, defined by i² = −1, born in algebra when Cardano needed a square root of a negative to solve cubic equations. π ≈ 3.14159 is the half-turn of the circle, the ratio of circumference to diameter, born in geometry. They normally never share a room. The identity is the room.",
    },
    {
      pretitle: "Section 02 · Complex multiplication",
      title: "Why i is a quarter-turn",
      body: 'Forget that i is "imaginary" for a moment and look at what multiplying by i does. Start at 1 on the real axis. Multiply by i and you land at i — a quarter-turn up. Multiply by i again and you land at i² = −1 — another quarter-turn, exactly opposite where you started. Two quarter-turns make a half-turn, which is exactly what i² = −1 means geometrically. Complex multiplication is rotation (by the argument) times scaling (by the magnitude). The numbers on the unit circle, where the magnitude is 1, are pure rotation. They are the engine of the identity.',
    },
    {
      pretitle: "Section 03 · Euler's formula",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler published this formula in his 1748 Introductio in analysin infinitorum, and it is the larger truth of which the identity is a single value. The left-hand side, e^(iθ), is an exponential with an imaginary exponent — a kind of growth nobody had ever pictured before. The right-hand side, cos θ + i sin θ, is the point on the unit circle at angle θ. Euler's claim is that those two completely different-looking things are equal. Set θ = π and the right-hand side collapses to −1 + 0i, so e^(iπ) = −1, and adding 1 gives the identity. The identity is Euler's formula at θ = π.",
    },
    {
      pretitle: "Section 04 · Why it's true",
      title: "Taylor series, substituted",
      body: "The cleanest proof goes through power series. Each of the three functions has a Taylor expansion that converges on the entire real line: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Now formally substitute x = iθ into the series for e^x. Because i^k cycles through 1, i, −1, −i, the real terms of the resulting series are exactly the Taylor series for cos θ, and the imaginary terms (without the i) are exactly the Taylor series for sin θ. So e^(iθ) = cos θ + i sin θ — not by definition, but as a theorem about converging series. Set θ = π and the algebra finishes the proof.",
    },
    {
      pretitle: "Section 05 · Connection everywhere",
      title: "Where the identity lives in the wild",
      body: "Once you have e^(iθ), it stops being a curiosity and becomes an indispensable tool. Electrical engineers write the impedance of a circuit as a complex number Z = R + iX, so that voltages and currents become rotating phasors V·e^(iωt) and Kirchhoff's laws turn into linear algebra. Quantum mechanics writes the time-evolution of a state as ψ(t) = e^(−iHt/ℏ) ψ(0) — the Schrödinger equation, with e^(iθ) doing every bit of the rotation in Hilbert space. Fourier analysis decomposes any reasonable signal into a sum (or integral) of e^(iωt) modes, and every JPEG, MP3, MRI scanner and Wi-Fi handshake on the planet is built on top of that decomposition. The identity is the boundary stone where all four roads — arithmetic, algebra, geometry, analysis — meet.",
    },
    {
      pretitle: "Section 06 · Where it sits",
      title: "A short progression",
      body: "Step back and see the chain. Real-line arithmetic gives you +, ×, and the constants 0 and 1. Calculus turns growth into a number and names it e. Algebra solves cubics, runs out of real square roots, invents i, and discovers the complex plane. Geometry parameterises the unit circle by angle and meets π. Euler's formula then notices, with two pages of power series, that growth in the imaginary direction is rotation in the plane — that e and i secretly do the same thing. Set the angle to a half-turn and the five constants finally meet, with nothing in between. The identity is not a coincidence; it is the destination.",
    },
  ],
  unitCircleCaption: "Drag θ · e^(iθ) on the unit circle",
  unitCircleIdentity: "Euler's identity",
  taylorCaption: "Slide N · partial Taylor sums",
  taylorTerms: "terms",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Complex walk · e^(iπ) partial sum",
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you sweep θ live, watch e^(iθ) trace the circle, and decompose any complex number into its rotating, scaling pieces. Everything you just read is one click away.",
  closingCta: "→ Open the Explorer",
  interactivePretitle1: "Interactive · slider",
  interactiveTitle1: "Walk θ around the circle",
  interactiveBody1:
    "Drag the slider from 0 to 2π. The yellow dot is e^(iθ); the cyan and violet markers are its real and imaginary projections — the cos θ and sin θ components. When θ ≈ π you land on −1, and the identity glows.",
  interactivePretitle2: "Interactive · slider",
  interactiveTitle2: "Build the proof, term by term",
  interactiveBody2:
    "Each curve is a partial Taylor sum — the first N+1 terms only. Slide N up and the partial sums close in on the true exp, cos and sin curves. Watch the small panel underneath: the complex partial sum of (iπ)^k / k! drifts toward −1 as N grows.",
  charactersLabel: "The five constants",
  charactersRows: [
    { sym: "0", role: "Additive identity", home: "Arithmetic" },
    { sym: "1", role: "Multiplicative identity", home: "Arithmetic" },
    { sym: "e", role: "Base of natural growth ≈ 2.71828", home: "Calculus" },
    { sym: "i", role: "Imaginary unit, i² = −1", home: "Algebra" },
    { sym: "π", role: "Half-turn of the circle ≈ 3.14159", home: "Geometry" },
  ],
  proofLabel: "Proof in four steps",
  proofIntro:
    "Substitute x = iθ into the Taylor series of eˣ and watch the real and imaginary parts split.",
  connectionsLabel: "Where the identity shows up",
  connectionsRows: [
    {
      field: "Electrical engineering",
      body: "Impedance Z = R + iX; phasors V·e^(iωt) turn AC circuit analysis into linear algebra.",
    },
    {
      field: "Quantum mechanics",
      body: "Time evolution ψ(t) = e^(−iHt/ℏ) ψ(0); every state rotates in Hilbert space via e^(iθ).",
    },
    {
      field: "Fourier analysis",
      body: "Every signal decomposes into e^(iωt) modes — the basis of MP3, JPEG, MRI, Wi-Fi.",
    },
    {
      field: "Number theory",
      body: "Roots of unity e^(2πik/n) parameterise every solution to z^n = 1 and seed cyclotomic fields.",
    },
  ],
  progressionLabel: "The arc that leads here",
  progressionRows: [
    "Real-line arithmetic gives you +, ×, 0, 1.",
    "Calculus turns continuous growth into a number and names it e.",
    "Algebra runs out of real square roots and invents i; the complex plane appears.",
    "Geometry parameterises the unit circle by angle and meets π.",
    "Euler's formula shows growth in the imaginary direction = rotation in the plane.",
    "Set θ = π. All five constants meet.",
  ],
  quarterTurnNote: "Four quarter-turns close the loop. Each ×i is a 90° rotation; i² = −1 is two of them.",
  walkStart: "start",
  walkHalfTurn: "half-turn",
  walkLand: "land",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Analysis",
    title: "Eulers Identität",
    tagline: "Fünf Zahlen, eine Zeile.",
    intro:
      "e^(iπ) + 1 = 0 — fünf Konstanten aus fünf verschiedenen Ecken der Mathematik, festgezurrt in einer einzigen Gleichung. Im Explorer nebenan kannst du e^(iθ) live um den Einheitskreis ziehen sehen und mit eigenen Augen den Moment bei θ = π erleben, in dem die Identität tatsächlich passiert.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Fünf Fremde. Eine Zeile. Für immer.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Fünf der wichtigsten Zahlen der Mathematik — e, i, π, 0, 1 — laufen sich im Alltag nie über den Weg. Und doch bindet eine einzige Gleichung, e^(iπ) + 1 = 0, alle fünf zusammen, mit nur Addition, Multiplikation und Potenzieren. Sonst nichts. Keine Konstante bleibt übrig, keine Verzierung. Das ist die ganze Identität.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Stell dir vor, du läufst um einen Kreis mit Radius 1 um den Ursprung einer Ebene. Starte bei der 1 rechts. Multiplizieren mit e^(iθ) heißt: laufe θ Bogenmaß um den Kreis. Lauf also π Bogenmaß — den halben Weg — und du kommst beim Punkt −1 an. Addiere 1 und du bist wieder bei 0.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: 'Feynman nannte die Formel e^(iθ) = cos θ + i sin θ, von der diese Identität der Fall θ = π ist, „die bemerkenswerteste Formel der Mathematik“, „unser Juwel.“ Eine Umfrage im Mathematical Intelligencer von 1990 unter arbeitenden Mathematiker:innen wählte diese Identität zum schönsten je bewiesenen Satz. Sie ist eine Brücke: Algebra schreibt die Symbole, Geometrie läuft den Kreis, Analysis liefert die unendliche Reihe, die alles einrasten lässt.',
      },
    ],
    tryIt:
      "Unten: schieb θ selbst um den Kreis und sieh, wie die Taylor-Reihe sie Term für Term aufbaut.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Fünf Charaktere",
      title: "Wer in dieser Gleichung steht",
      body: "Jede der fünf Zahlen kommt aus einem anderen Land der Mathematik. 0 ist die additive Identität — sie zu addieren ändert nichts. 1 ist die multiplikative Identität — mit ihr zu multiplizieren ändert nichts. e ≈ 2,71828 ist die natürliche Basis, die Zahl, deren eigene Ableitung sie selbst ist, geboren in der Analysis aus Zinseszins und stetigem Wachstum. i ist die imaginäre Einheit, definiert durch i² = −1, geboren in der Algebra, als Cardano eine Wurzel aus einer negativen Zahl brauchte, um kubische Gleichungen zu lösen. π ≈ 3,14159 ist die Halbdrehung des Kreises, das Verhältnis von Umfang zu Durchmesser, geboren in der Geometrie. Normalerweise teilen sie keinen Raum. Die Identität ist der Raum.",
    },
    {
      pretitle: "Abschnitt 02 · Komplexe Multiplikation",
      title: "Warum i eine Vierteldrehung ist",
      body: 'Vergiss kurz, dass i „imaginär“ sein soll, und sieh, was Multiplikation mit i wirklich tut. Starte bei 1 auf der reellen Achse. Multipliziere mit i und du landest bei i — eine Vierteldrehung nach oben. Noch einmal mit i, und du landest bei i² = −1 — eine weitere Vierteldrehung, genau gegenüber vom Start. Zwei Vierteldrehungen ergeben eine Halbdrehung, und genau das ist die geometrische Bedeutung von i² = −1. Komplexe Multiplikation ist Drehung (um das Argument) mal Streckung (um den Betrag). Die Zahlen auf dem Einheitskreis, wo der Betrag 1 ist, sind reine Drehung. Sie sind der Motor der Identität.',
    },
    {
      pretitle: "Abschnitt 03 · Eulers Formel",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler veröffentlichte diese Formel 1748 in seiner Introductio in analysin infinitorum, und sie ist die größere Wahrheit, von der die Identität nur ein einzelner Wert ist. Die linke Seite, e^(iθ), ist eine Exponentialfunktion mit imaginärem Exponenten — eine Art Wachstum, die sich vorher niemand vorgestellt hatte. Die rechte Seite, cos θ + i sin θ, ist der Punkt auf dem Einheitskreis bei Winkel θ. Eulers Behauptung: diese beiden völlig verschieden aussehenden Dinge sind gleich. Setzt man θ = π, kollabiert die rechte Seite zu −1 + 0i, also e^(iπ) = −1, und 1 addiert ergibt die Identität. Die Identität ist Eulers Formel bei θ = π.",
    },
    {
      pretitle: "Abschnitt 04 · Warum sie wahr ist",
      title: "Taylor-Reihen, eingesetzt",
      body: "Der sauberste Beweis läuft über Potenzreihen. Jede der drei Funktionen hat eine Taylor-Entwicklung, die auf der ganzen reellen Achse konvergiert: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Setze nun formal x = iθ in die Reihe für e^x ein. Weil i^k die Werte 1, i, −1, −i durchläuft, sind die reellen Terme der entstehenden Reihe genau die Taylor-Reihe für cos θ, und die imaginären Terme (ohne das i) genau die Taylor-Reihe für sin θ. Also gilt e^(iθ) = cos θ + i sin θ — nicht per Definition, sondern als Satz über konvergente Reihen. Setze θ = π, und die Algebra schließt den Beweis ab.",
    },
    {
      pretitle: "Abschnitt 05 · Verbindungen überall",
      title: "Wo die Identität in der Welt vorkommt",
      body: "Sobald du e^(iθ) hast, ist es keine Kuriosität mehr, sondern unverzichtbares Werkzeug. Elektrotechniker:innen schreiben die Impedanz einer Schaltung als komplexe Zahl Z = R + iX, sodass Spannungen und Ströme zu rotierenden Phasoren V·e^(iωt) werden und Kirchhoffs Regeln zu linearer Algebra. Die Quantenmechanik schreibt die Zeitentwicklung eines Zustands als ψ(t) = e^(−iHt/ℏ) ψ(0) — die Schrödinger-Gleichung, mit e^(iθ) als alleinigem Rotator im Hilbertraum. Die Fourier-Analyse zerlegt jedes vernünftige Signal in eine Summe (oder ein Integral) von e^(iωt)-Moden, und jedes JPEG, jedes MP3, jeder MRT-Scanner und jeder WLAN-Handschlag des Planeten baut darauf auf. Die Identität ist der Grenzstein, an dem alle vier Straßen — Arithmetik, Algebra, Geometrie, Analysis — zusammenlaufen.",
    },
    {
      pretitle: "Abschnitt 06 · Wo sie steht",
      title: "Eine kurze Progression",
      body: "Tritt einen Schritt zurück und sieh die Kette. Arithmetik auf der reellen Achse gibt dir +, × und die Konstanten 0 und 1. Die Analysis macht aus stetigem Wachstum eine Zahl und nennt sie e. Die Algebra löst Kubiken, geht der reellen Quadratwurzel aus, erfindet i und entdeckt die komplexe Ebene. Die Geometrie parametrisiert den Einheitskreis durch Winkel und begegnet π. Eulers Formel bemerkt dann, mit zwei Seiten Potenzreihe, dass Wachstum in imaginärer Richtung Drehung in der Ebene ist — dass e und i heimlich dasselbe tun. Setze den Winkel auf eine Halbdrehung, und die fünf Konstanten treffen sich schließlich, ohne irgendetwas dazwischen. Die Identität ist kein Zufall; sie ist das Ziel.",
    },
  ],
  unitCircleCaption: "Zieh θ · e^(iθ) auf dem Einheitskreis",
  unitCircleIdentity: "Eulers Identität",
  taylorCaption: "Schieb N · Taylor-Teilsummen",
  taylorTerms: "Terme",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Komplexer Lauf · Teilsumme von e^(iπ)",
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich θ live durchziehen, sieh e^(iθ) den Kreis zeichnen und zerlege jede komplexe Zahl in ihre rotierenden, streckenden Anteile. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  closingCta: "→ Explorer öffnen",
  interactivePretitle1: "Interaktiv · Schieberegler",
  interactiveTitle1: "Lauf θ um den Kreis",
  interactiveBody1:
    "Zieh den Regler von 0 bis 2π. Der gelbe Punkt ist e^(iθ); die cyan- und violettfarbenen Marker sind die reelle und imaginäre Projektion — die Komponenten cos θ und sin θ. Bei θ ≈ π landest du auf −1, und die Identität leuchtet auf.",
  interactivePretitle2: "Interaktiv · Schieberegler",
  interactiveTitle2: "Bau den Beweis, Term für Term",
  interactiveBody2:
    "Jede Kurve ist eine Taylor-Teilsumme — nur die ersten N+1 Glieder. Schieb N hoch, und die Teilsummen schmiegen sich an die echten exp-, cos- und sin-Kurven an. Sieh das kleine Panel darunter: die komplexe Teilsumme von (iπ)^k / k! driftet gegen −1, wenn N wächst.",
  charactersLabel: "Die fünf Konstanten",
  charactersRows: [
    { sym: "0", role: "Additive Identität", home: "Arithmetik" },
    { sym: "1", role: "Multiplikative Identität", home: "Arithmetik" },
    { sym: "e", role: "Basis natürlichen Wachstums ≈ 2,71828", home: "Analysis" },
    { sym: "i", role: "Imaginäre Einheit, i² = −1", home: "Algebra" },
    { sym: "π", role: "Halbdrehung des Kreises ≈ 3,14159", home: "Geometrie" },
  ],
  proofLabel: "Beweis in vier Schritten",
  proofIntro:
    "Setze x = iθ in die Taylor-Reihe von eˣ ein und sieh die reellen und imaginären Teile sich trennen.",
  connectionsLabel: "Wo die Identität auftaucht",
  connectionsRows: [
    {
      field: "Elektrotechnik",
      body: "Impedanz Z = R + iX; Phasoren V·e^(iωt) verwandeln Wechselstromanalyse in lineare Algebra.",
    },
    {
      field: "Quantenmechanik",
      body: "Zeitentwicklung ψ(t) = e^(−iHt/ℏ) ψ(0); jeder Zustand rotiert im Hilbertraum via e^(iθ).",
    },
    {
      field: "Fourier-Analyse",
      body: "Jedes Signal zerfällt in e^(iωt)-Moden — die Basis von MP3, JPEG, MRT, WLAN.",
    },
    {
      field: "Zahlentheorie",
      body: "Einheitswurzeln e^(2πik/n) parametrisieren jede Lösung von z^n = 1 und säen Kreisteilungskörper.",
    },
  ],
  progressionLabel: "Der Bogen, der hierher führt",
  progressionRows: [
    "Arithmetik auf der reellen Achse liefert +, ×, 0, 1.",
    "Die Analysis macht stetiges Wachstum zur Zahl und nennt sie e.",
    "Die Algebra geht den reellen Wurzeln aus und erfindet i; die komplexe Ebene erscheint.",
    "Die Geometrie parametrisiert den Einheitskreis durch Winkel und begegnet π.",
    "Eulers Formel zeigt: Wachstum in imaginärer Richtung = Drehung in der Ebene.",
    "Setze θ = π. Alle fünf Konstanten treffen sich.",
  ],
  quarterTurnNote: "Vier Vierteldrehungen schließen den Kreis. Jedes ×i ist eine 90°-Drehung; i² = −1 sind zwei davon.",
  walkStart: "Start",
  walkHalfTurn: "Halbdrehung",
  walkLand: "Ziel",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Análisis",
    title: "La identidad de Euler",
    tagline: "Cinco números, una línea.",
    intro:
      "e^(iπ) + 1 = 0 — cinco constantes de cinco rincones distintos de las matemáticas, encerradas en una sola igualdad. El Explorer de al lado te deja ver e^(iθ) barriendo el círculo unidad en tiempo real, para que puedas presenciar con tus propios ojos el instante en θ = π en el que la identidad realmente ocurre.",
    ctaInteractive: "→ Abrir el Explorer",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Cinco extraños. Una línea. Para siempre.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Cinco de los números más importantes de la matemática — e, i, π, 0, 1 — nunca se cruzan en la vida cotidiana. Y sin embargo una sola ecuación, e^(iπ) + 1 = 0, ata a los cinco con sólo suma, producto y potencia. Nada más. Ninguna constante sobrante, ningún adorno. Esa es toda la identidad.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Imagina caminar alrededor de un círculo de radio 1 centrado en el origen de un plano. Empieza en el punto 1 a la derecha. Multiplicar por e^(iθ) significa: camina θ radianes por el círculo. Camina pues π radianes — la mitad del trayecto — y llegas al punto −1. Suma 1 y vuelves a 0.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Feynman llamó a la fórmula e^(iθ) = cos θ + i sin θ, de la que esta identidad es el caso θ = π, «la fórmula más notable de la matemática», «nuestra joya». Una encuesta del Mathematical Intelligencer de 1990 entre matemáticos en ejercicio votó esta identidad como el teorema más bello jamás demostrado. Es un puente: el álgebra escribe los símbolos, la geometría recorre el círculo, el análisis aporta la serie infinita que hace que todo encaje.",
      },
    ],
    tryIt:
      "Abajo: arrastra tú mismo θ por el círculo y mira la serie de Taylor construirla término a término.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Cinco personajes",
      title: "Quién aparece en esta ecuación",
      body: "Cada uno de los cinco números llega de un país distinto de la matemática. 0 es la identidad aditiva — sumarlo no cambia nada. 1 es la identidad multiplicativa — multiplicar por él no cambia nada. e ≈ 2,71828 es la base natural, el número cuya derivada es él mismo, nacido en el cálculo a partir del interés compuesto y el crecimiento continuo. i es la unidad imaginaria, definida por i² = −1, nacida en el álgebra cuando Cardano necesitaba una raíz de un negativo para resolver cúbicas. π ≈ 3,14159 es la media vuelta del círculo, la razón entre la circunferencia y el diámetro, nacida en la geometría. Normalmente no comparten habitación. La identidad es la habitación.",
    },
    {
      pretitle: "Sección 02 · Multiplicación compleja",
      title: "Por qué i es un cuarto de vuelta",
      body: "Olvida por un instante que i es «imaginaria» y mira lo que hace multiplicar por i. Empieza en 1 sobre el eje real. Multiplica por i y aterrizas en i — un cuarto de vuelta hacia arriba. Multiplica de nuevo por i y aterrizas en i² = −1 — otro cuarto de vuelta, justo enfrente del punto de partida. Dos cuartos de vuelta hacen media vuelta, que es exactamente lo que significa geométricamente i² = −1. La multiplicación compleja es rotación (por el argumento) por escalado (por el módulo). Los números del círculo unitario, donde el módulo vale 1, son rotación pura. Son el motor de la identidad.",
    },
    {
      pretitle: "Sección 03 · La fórmula de Euler",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler publicó esta fórmula en 1748 en su Introductio in analysin infinitorum, y es la verdad mayor de la que la identidad es un único valor. El lado izquierdo, e^(iθ), es una exponencial con exponente imaginario — un tipo de crecimiento que nadie había imaginado antes. El lado derecho, cos θ + i sin θ, es el punto del círculo unitario en el ángulo θ. La afirmación de Euler es que esas dos cosas tan distintas son iguales. Pon θ = π y el lado derecho colapsa a −1 + 0i, así que e^(iπ) = −1, y sumar 1 da la identidad. La identidad es la fórmula de Euler en θ = π.",
    },
    {
      pretitle: "Sección 04 · Por qué es verdad",
      title: "Series de Taylor, sustituidas",
      body: "La demostración más limpia va por series de potencias. Cada una de las tres funciones tiene un desarrollo de Taylor que converge en toda la recta real: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Ahora sustituye formalmente x = iθ en la serie de e^x. Como i^k recorre 1, i, −1, −i, los términos reales de la serie resultante son exactamente la serie de Taylor de cos θ, y los términos imaginarios (sin la i) son exactamente la serie de Taylor de sin θ. Así e^(iθ) = cos θ + i sin θ — no por definición, sino como teorema sobre series convergentes. Pon θ = π y el álgebra cierra la demostración.",
    },
    {
      pretitle: "Sección 05 · Conexiones por doquier",
      title: "Dónde vive la identidad en lo real",
      body: "Una vez que tienes e^(iθ), deja de ser curiosidad y se vuelve herramienta imprescindible. Los ingenieros eléctricos escriben la impedancia como Z = R + iX, de modo que voltajes y corrientes se vuelven fasores rotatorios V·e^(iωt) y las leyes de Kirchhoff se convierten en álgebra lineal. La mecánica cuántica escribe la evolución temporal de un estado como ψ(t) = e^(−iHt/ℏ) ψ(0) — la ecuación de Schrödinger, con e^(iθ) haciendo toda la rotación en el espacio de Hilbert. El análisis de Fourier descompone cualquier señal razonable en una suma (o integral) de modos e^(iωt), y todo JPEG, MP3, escáner de RMN y apretón de manos Wi-Fi del planeta se asienta sobre esa descomposición. La identidad es el mojón donde se cruzan las cuatro vías: aritmética, álgebra, geometría, análisis.",
    },
    {
      pretitle: "Sección 06 · Dónde encaja",
      title: "Una progresión breve",
      body: "Da un paso atrás y ve la cadena. La aritmética en la recta real te da +, × y las constantes 0 y 1. El cálculo convierte el crecimiento continuo en un número y lo llama e. El álgebra resuelve cúbicas, se queda sin raíces cuadradas reales, inventa i y descubre el plano complejo. La geometría parametriza el círculo unitario por ángulo y se encuentra con π. La fórmula de Euler observa entonces, con dos páginas de series de potencias, que crecer en la dirección imaginaria es rotar en el plano — que e e i hacen secretamente lo mismo. Pon el ángulo a media vuelta y las cinco constantes se encuentran al fin, sin nada en medio. La identidad no es coincidencia; es el destino.",
    },
  ],
  unitCircleCaption: "Arrastra θ · e^(iθ) en el círculo unitario",
  unitCircleIdentity: "identidad de Euler",
  taylorCaption: "Mueve N · sumas parciales de Taylor",
  taylorTerms: "términos",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Paseo complejo · suma parcial de e^(iπ)",
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja barrer θ en vivo, ver a e^(iθ) trazar el círculo y descomponer cualquier complejo en sus piezas de rotación y escala. Todo lo que acabas de leer está a un clic.",
  closingCta: "→ Abrir el Explorador",
  interactivePretitle1: "Interactivo · deslizador",
  interactiveTitle1: "Camina θ alrededor del círculo",
  interactiveBody1:
    "Arrastra el deslizador de 0 a 2π. El punto amarillo es e^(iθ); los marcadores cian y violeta son sus proyecciones real e imaginaria — las componentes cos θ y sin θ. Cuando θ ≈ π aterrizas en −1 y la identidad se enciende.",
  interactivePretitle2: "Interactivo · deslizador",
  interactiveTitle2: "Construye la demostración, término a término",
  interactiveBody2:
    "Cada curva es una suma parcial de Taylor — sólo los primeros N+1 términos. Sube N y las sumas se ciñen a las verdaderas exp, cos y sin. Mira el panel inferior: la suma parcial compleja de (iπ)^k / k! deriva hacia −1 al crecer N.",
  charactersLabel: "Las cinco constantes",
  charactersRows: [
    { sym: "0", role: "Identidad aditiva", home: "Aritmética" },
    { sym: "1", role: "Identidad multiplicativa", home: "Aritmética" },
    { sym: "e", role: "Base del crecimiento natural ≈ 2,71828", home: "Cálculo" },
    { sym: "i", role: "Unidad imaginaria, i² = −1", home: "Álgebra" },
    { sym: "π", role: "Media vuelta del círculo ≈ 3,14159", home: "Geometría" },
  ],
  proofLabel: "Demostración en cuatro pasos",
  proofIntro:
    "Sustituye x = iθ en la serie de Taylor de eˣ y mira separarse las partes real e imaginaria.",
  connectionsLabel: "Dónde aparece la identidad",
  connectionsRows: [
    {
      field: "Ingeniería eléctrica",
      body: "Impedancia Z = R + iX; fasores V·e^(iωt) convierten el análisis de CA en álgebra lineal.",
    },
    {
      field: "Mecánica cuántica",
      body: "Evolución ψ(t) = e^(−iHt/ℏ) ψ(0); cada estado rota en el espacio de Hilbert vía e^(iθ).",
    },
    {
      field: "Análisis de Fourier",
      body: "Toda señal se descompone en modos e^(iωt) — la base de MP3, JPEG, RMN, Wi-Fi.",
    },
    {
      field: "Teoría de números",
      body: "Las raíces de la unidad e^(2πik/n) parametrizan toda solución de z^n = 1 y siembran cuerpos ciclotómicos.",
    },
  ],
  progressionLabel: "El arco que conduce aquí",
  progressionRows: [
    "La aritmética en la recta real da +, ×, 0, 1.",
    "El cálculo convierte el crecimiento continuo en un número y lo llama e.",
    "El álgebra se queda sin raíces reales e inventa i; aparece el plano complejo.",
    "La geometría parametriza el círculo unitario por ángulo y se encuentra con π.",
    "La fórmula de Euler muestra que crecer en imaginario = rotar en el plano.",
    "Pon θ = π. Las cinco constantes se encuentran.",
  ],
  quarterTurnNote: "Cuatro cuartos de vuelta cierran el ciclo. Cada ×i es una rotación de 90°; i² = −1 son dos de ellas.",
  walkStart: "inicio",
  walkHalfTurn: "media vuelta",
  walkLand: "llegada",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Analyse",
    title: "L'identité d'Euler",
    tagline: "Cinq nombres, une ligne.",
    intro:
      "e^(iπ) + 1 = 0 — cinq constantes venues de cinq coins différents des mathématiques, verrouillées dans une seule égalité. L'Explorer voisin te laisse voir e^(iθ) balayer le cercle unité en temps réel, pour que tu puisses observer, de tes propres yeux, l'instant en θ = π où l'identité se produit vraiment.",
    ctaInteractive: "→ Ouvrir l'Explorer",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Cinq étrangers. Une ligne. Pour toujours.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Cinq des nombres les plus importants des mathématiques — e, i, π, 0, 1 — ne se croisent jamais dans la vie courante. Pourtant une seule équation, e^(iπ) + 1 = 0, les noue tous les cinq avec la seule addition, multiplication et exponentiation. Rien d'autre. Pas de constante en reste, pas de décoration. C'est toute l'identité.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Imagine marcher autour d'un cercle de rayon 1 centré à l'origine d'un plan. Pars du point 1 à droite. Multiplier par e^(iθ) signifie : avance de θ radians sur le cercle. Avance donc de π radians — la moitié du tour — et tu arrives au point −1. Ajoute 1 et tu reviens à 0.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Feynman a appelé la formule e^(iθ) = cos θ + i sin θ, dont cette identité est le cas θ = π, « la formule la plus remarquable des mathématiques », « notre joyau ». Un sondage du Mathematical Intelligencer en 1990, auprès de mathématiciens en exercice, a élu cette identité plus beau théorème jamais démontré. Elle est un pont : l'algèbre écrit les symboles, la géométrie parcourt le cercle, l'analyse fournit la série infinie qui fait tout claquer en place.",
      },
    ],
    tryIt:
      "Ci-dessous : glisse toi-même θ autour du cercle, et regarde la série de Taylor la construire terme à terme.",
  },
  sections: [
    {
      pretitle: "Section 01 · Cinq personnages",
      title: "Qui apparaît dans cette équation",
      body: "Chacun des cinq nombres vient d'un pays différent des mathématiques. 0 est l'identité additive — l'ajouter ne change rien. 1 est l'identité multiplicative — multiplier par lui ne change rien. e ≈ 2,71828 est la base naturelle, le nombre dont la dérivée est elle-même, né dans le calcul à partir des intérêts composés et de la croissance continue. i est l'unité imaginaire, définie par i² = −1, née de l'algèbre quand Cardan avait besoin d'une racine d'un négatif pour résoudre les cubiques. π ≈ 3,14159 est le demi-tour du cercle, le rapport entre la circonférence et le diamètre, né de la géométrie. Normalement ils ne partagent jamais la même pièce. L'identité est cette pièce.",
    },
    {
      pretitle: "Section 02 · Multiplication complexe",
      title: "Pourquoi i est un quart de tour",
      body: "Oublie un instant que i est « imaginaire » et regarde ce que fait la multiplication par i. Pars de 1 sur l'axe réel. Multiplie par i et tu atterris en i — un quart de tour vers le haut. Multiplie encore par i et tu atterris en i² = −1 — un autre quart de tour, exactement à l'opposé du départ. Deux quarts de tour font un demi-tour, ce que i² = −1 signifie géométriquement. La multiplication complexe est rotation (par l'argument) fois mise à l'échelle (par le module). Les nombres du cercle unité, où le module vaut 1, sont la rotation pure. Ils sont le moteur de l'identité.",
    },
    {
      pretitle: "Section 03 · La formule d'Euler",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler publia cette formule en 1748 dans son Introductio in analysin infinitorum, et c'est la vérité plus large dont l'identité n'est qu'une valeur unique. Le côté gauche, e^(iθ), est une exponentielle à exposant imaginaire — un type de croissance que personne n'avait imaginé. Le côté droit, cos θ + i sin θ, est le point du cercle unité d'angle θ. L'affirmation d'Euler est que ces deux choses d'apparence très différente sont égales. Pose θ = π et le côté droit s'effondre en −1 + 0i, donc e^(iπ) = −1, et ajouter 1 donne l'identité. L'identité est la formule d'Euler à θ = π.",
    },
    {
      pretitle: "Section 04 · Pourquoi c'est vrai",
      title: "Séries de Taylor, substituées",
      body: "La preuve la plus nette passe par les séries entières. Chacune des trois fonctions a un développement de Taylor convergeant sur toute la droite réelle : e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Substitue maintenant formellement x = iθ dans la série de e^x. Comme i^k parcourt 1, i, −1, −i, les termes réels de la série obtenue sont exactement la série de Taylor de cos θ, et les termes imaginaires (sans le i) sont exactement la série de Taylor de sin θ. Donc e^(iθ) = cos θ + i sin θ — non par définition, mais comme théorème sur les séries convergentes. Pose θ = π et l'algèbre clôt la preuve.",
    },
    {
      pretitle: "Section 05 · Des connexions partout",
      title: "Où l'identité vit dans le réel",
      body: "Dès que tu as e^(iθ), il cesse d'être une curiosité et devient un outil indispensable. Les ingénieurs en électricité écrivent l'impédance d'un circuit comme un nombre complexe Z = R + iX, si bien que tensions et courants deviennent des phaseurs tournants V·e^(iωt) et les lois de Kirchhoff se ramènent à de l'algèbre linéaire. La mécanique quantique écrit l'évolution temporelle d'un état comme ψ(t) = e^(−iHt/ℏ) ψ(0) — l'équation de Schrödinger, où e^(iθ) accomplit toute la rotation dans l'espace de Hilbert. L'analyse de Fourier décompose tout signal raisonnable en somme (ou intégrale) de modes e^(iωt), et chaque JPEG, MP3, IRM et poignée de main Wi-Fi de la planète repose sur cette décomposition. L'identité est la borne où se rejoignent les quatre routes : arithmétique, algèbre, géométrie, analyse.",
    },
    {
      pretitle: "Section 06 · Où elle se place",
      title: "Une brève progression",
      body: "Recule d'un pas et vois la chaîne. L'arithmétique sur la droite réelle te donne +, × et les constantes 0 et 1. Le calcul transforme la croissance continue en un nombre nommé e. L'algèbre résout les cubiques, manque de racines carrées réelles, invente i et découvre le plan complexe. La géométrie paramètre le cercle unité par l'angle et rencontre π. La formule d'Euler remarque alors, en deux pages de séries entières, que croître dans la direction imaginaire, c'est tourner dans le plan — que e et i font en secret la même chose. Pose l'angle à un demi-tour et les cinq constantes se rencontrent enfin, sans rien entre elles. L'identité n'est pas un hasard ; elle est la destination.",
    },
  ],
  unitCircleCaption: "Glisse θ · e^(iθ) sur le cercle unité",
  unitCircleIdentity: "identité d'Euler",
  taylorCaption: "Glisse N · sommes partielles de Taylor",
  taylorTerms: "termes",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Marche complexe · somme partielle de e^(iπ)",
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te permet de balayer θ en direct, de voir e^(iθ) tracer le cercle et de décomposer tout complexe en ses parts de rotation et d'échelle. Tout ce que tu viens de lire est à un clic.",
  closingCta: "→ Ouvrir l'Explorateur",
  interactivePretitle1: "Interactif · curseur",
  interactiveTitle1: "Promène θ autour du cercle",
  interactiveBody1:
    "Glisse le curseur de 0 à 2π. Le point jaune est e^(iθ) ; les repères cyan et violet sont ses projections réelle et imaginaire — les composantes cos θ et sin θ. Quand θ ≈ π tu atterris en −1, et l'identité s'allume.",
  interactivePretitle2: "Interactif · curseur",
  interactiveTitle2: "Construis la preuve, terme par terme",
  interactiveBody2:
    "Chaque courbe est une somme partielle de Taylor — seuls les N+1 premiers termes. Pousse N et les sommes partielles épousent les vraies courbes exp, cos et sin. Regarde le petit panneau dessous : la somme partielle complexe de (iπ)^k / k! glisse vers −1 quand N grandit.",
  charactersLabel: "Les cinq constantes",
  charactersRows: [
    { sym: "0", role: "Identité additive", home: "Arithmétique" },
    { sym: "1", role: "Identité multiplicative", home: "Arithmétique" },
    { sym: "e", role: "Base de la croissance naturelle ≈ 2,71828", home: "Analyse" },
    { sym: "i", role: "Unité imaginaire, i² = −1", home: "Algèbre" },
    { sym: "π", role: "Demi-tour du cercle ≈ 3,14159", home: "Géométrie" },
  ],
  proofLabel: "Preuve en quatre étapes",
  proofIntro:
    "Substitue x = iθ dans la série de Taylor de eˣ et regarde les parties réelle et imaginaire se séparer.",
  connectionsLabel: "Où l'identité apparaît",
  connectionsRows: [
    {
      field: "Génie électrique",
      body: "Impédance Z = R + iX ; les phaseurs V·e^(iωt) ramènent l'analyse des circuits AC à de l'algèbre linéaire.",
    },
    {
      field: "Mécanique quantique",
      body: "Évolution ψ(t) = e^(−iHt/ℏ) ψ(0) ; tout état tourne dans l'espace de Hilbert via e^(iθ).",
    },
    {
      field: "Analyse de Fourier",
      body: "Tout signal se décompose en modes e^(iωt) — fondement du MP3, JPEG, IRM, Wi-Fi.",
    },
    {
      field: "Théorie des nombres",
      body: "Les racines de l'unité e^(2πik/n) paramètrent toute solution de z^n = 1 et engendrent les corps cyclotomiques.",
    },
  ],
  progressionLabel: "L'arc qui conduit ici",
  progressionRows: [
    "L'arithmétique sur la droite réelle fournit +, ×, 0, 1.",
    "Le calcul fait de la croissance continue un nombre nommé e.",
    "L'algèbre est à court de racines réelles et invente i ; le plan complexe apparaît.",
    "La géométrie paramètre le cercle unité par l'angle et rencontre π.",
    "La formule d'Euler montre que croître en imaginaire = tourner dans le plan.",
    "Pose θ = π. Les cinq constantes se rencontrent.",
  ],
  quarterTurnNote: "Quatre quarts de tour bouclent la boucle. Chaque ×i est une rotation de 90° ; i² = −1 en fait deux.",
  walkStart: "départ",
  walkHalfTurn: "demi-tour",
  walkLand: "arrivée",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Analisi",
    title: "L'identità di Eulero",
    tagline: "Cinque numeri, una riga.",
    intro:
      "e^(iπ) + 1 = 0 — cinque costanti da cinque angoli diversi della matematica, racchiuse in un'unica uguaglianza. L'Explorer qui accanto ti lascia vedere e^(iθ) percorrere il cerchio unitario in tempo reale, così puoi cogliere con i tuoi occhi l'istante in θ = π in cui l'identità accade davvero.",
    ctaInteractive: "→ Apri l'Explorer",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Cinque estranei. Una riga. Per sempre.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Cinque dei numeri più importanti della matematica — e, i, π, 0, 1 — non si incrociano mai nella vita quotidiana. Eppure una sola equazione, e^(iπ) + 1 = 0, lega tutti e cinque con sola somma, prodotto ed esponenziazione. Nient'altro. Nessuna costante in più, nessun ornamento. È tutta l'identità.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Immagina di camminare attorno a un cerchio di raggio 1 centrato nell'origine di un piano. Parti dal punto 1 a destra. Moltiplicare per e^(iθ) significa: cammina θ radianti lungo il cerchio. Cammina dunque π radianti — metà del giro — e arrivi al punto −1. Aggiungi 1 e torni a 0.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Feynman chiamò la formula e^(iθ) = cos θ + i sin θ, di cui questa identità è il caso θ = π, «la formula più notevole della matematica», «il nostro gioiello». Un sondaggio del Mathematical Intelligencer del 1990 fra matematici in attività votò questa identità come il più bel teorema mai dimostrato. È un ponte: l'algebra scrive i simboli, la geometria percorre il cerchio, l'analisi fornisce la serie infinita che fa quadrare tutto.",
      },
    ],
    tryIt:
      "Sotto: trascina tu stesso θ attorno al cerchio e guarda la serie di Taylor costruirla termine per termine.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Cinque personaggi",
      title: "Chi compare in questa equazione",
      body: "Ciascuno dei cinque numeri arriva da un paese diverso della matematica. 0 è l'identità additiva — sommarlo non cambia nulla. 1 è l'identità moltiplicativa — moltiplicare per esso non cambia nulla. e ≈ 2,71828 è la base naturale, il numero la cui derivata è sé stesso, nato nell'analisi dall'interesse composto e dalla crescita continua. i è l'unità immaginaria, definita da i² = −1, nata nell'algebra quando a Cardano servì una radice di un numero negativo per risolvere le cubiche. π ≈ 3,14159 è il mezzo giro del cerchio, il rapporto tra circonferenza e diametro, nato nella geometria. Normalmente non condividono mai una stanza. L'identità è quella stanza.",
    },
    {
      pretitle: "Sezione 02 · Moltiplicazione complessa",
      title: "Perché i è un quarto di giro",
      body: "Dimentica per un momento che i sia «immaginaria» e guarda cosa fa moltiplicare per i. Parti da 1 sull'asse reale. Moltiplica per i e atterri in i — un quarto di giro verso l'alto. Moltiplica di nuovo per i e atterri in i² = −1 — un altro quarto di giro, esattamente di fronte al punto di partenza. Due quarti di giro fanno un mezzo giro, che è proprio ciò che i² = −1 significa geometricamente. La moltiplicazione complessa è rotazione (per l'argomento) per scalatura (per il modulo). I numeri sul cerchio unitario, dove il modulo vale 1, sono pura rotazione. Sono il motore dell'identità.",
    },
    {
      pretitle: "Sezione 03 · La formula di Eulero",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Eulero pubblicò questa formula nel 1748 nella sua Introductio in analysin infinitorum, ed è la verità più ampia di cui l'identità è un singolo valore. Il lato sinistro, e^(iθ), è un'esponenziale con esponente immaginario — un tipo di crescita che nessuno aveva immaginato. Il lato destro, cos θ + i sin θ, è il punto del cerchio unitario all'angolo θ. L'affermazione di Eulero è che quelle due cose così diverse sono uguali. Poni θ = π e il lato destro collassa in −1 + 0i, quindi e^(iπ) = −1, e sommando 1 ottieni l'identità. L'identità è la formula di Eulero a θ = π.",
    },
    {
      pretitle: "Sezione 04 · Perché è vera",
      title: "Serie di Taylor, sostituite",
      body: "La dimostrazione più pulita passa per le serie di potenze. Ciascuna delle tre funzioni ha uno sviluppo di Taylor che converge su tutta la retta reale: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Sostituisci ora formalmente x = iθ nella serie di e^x. Poiché i^k attraversa 1, i, −1, −i, i termini reali della serie risultante sono esattamente la serie di Taylor di cos θ, e i termini immaginari (senza la i) sono esattamente la serie di Taylor di sin θ. Quindi e^(iθ) = cos θ + i sin θ — non per definizione, ma come teorema su serie convergenti. Poni θ = π e l'algebra chiude la dimostrazione.",
    },
    {
      pretitle: "Sezione 05 · Connessioni ovunque",
      title: "Dove vive l'identità nel reale",
      body: "Una volta che hai e^(iθ), smette di essere una curiosità e diventa strumento indispensabile. Gli ingegneri elettrici scrivono l'impedenza come Z = R + iX, così che tensioni e correnti diventino fasori rotanti V·e^(iωt) e le leggi di Kirchhoff si riducano ad algebra lineare. La meccanica quantistica scrive l'evoluzione temporale di uno stato come ψ(t) = e^(−iHt/ℏ) ψ(0) — l'equazione di Schrödinger, con e^(iθ) a compiere ogni rotazione nello spazio di Hilbert. L'analisi di Fourier decompone ogni segnale ragionevole in somma (o integrale) di modi e^(iωt), e ogni JPEG, MP3, scanner RM e handshake Wi-Fi del pianeta poggia su quella decomposizione. L'identità è la pietra di confine dove si incontrano le quattro strade: aritmetica, algebra, geometria, analisi.",
    },
    {
      pretitle: "Sezione 06 · Dove si colloca",
      title: "Una breve progressione",
      body: "Fai un passo indietro e guarda la catena. L'aritmetica sulla retta reale ti dà +, × e le costanti 0 e 1. L'analisi rende la crescita continua un numero e lo chiama e. L'algebra risolve cubiche, esaurisce le radici reali, inventa i e scopre il piano complesso. La geometria parametrizza il cerchio unitario tramite l'angolo e incontra π. La formula di Eulero osserva poi, con due pagine di serie di potenze, che crescere nella direzione immaginaria è ruotare nel piano — che e ed i fanno di nascosto la stessa cosa. Poni l'angolo a un mezzo giro e le cinque costanti si incontrano, senza nulla in mezzo. L'identità non è una coincidenza; è la destinazione.",
    },
  ],
  unitCircleCaption: "Trascina θ · e^(iθ) sul cerchio unitario",
  unitCircleIdentity: "identità di Eulero",
  taylorCaption: "Scorri N · somme parziali di Taylor",
  taylorTerms: "termini",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Cammino complesso · somma parziale di e^(iπ)",
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti permette di scorrere θ dal vivo, vedere e^(iθ) tracciare il cerchio e scomporre ogni complesso nelle sue parti di rotazione e scala. Tutto ciò che hai appena letto è a un clic.",
  closingCta: "→ Apri l'Esploratore",
  interactivePretitle1: "Interattivo · cursore",
  interactiveTitle1: "Cammina θ attorno al cerchio",
  interactiveBody1:
    "Trascina il cursore da 0 a 2π. Il punto giallo è e^(iθ); i marcatori ciano e viola sono le sue proiezioni reale e immaginaria — le componenti cos θ e sin θ. Quando θ ≈ π atterri in −1 e l'identità si accende.",
  interactivePretitle2: "Interattivo · cursore",
  interactiveTitle2: "Costruisci la dimostrazione, termine per termine",
  interactiveBody2:
    "Ogni curva è una somma parziale di Taylor — solo i primi N+1 termini. Aumenta N e le somme parziali si stringono attorno alle vere curve exp, cos e sin. Guarda il piccolo pannello sotto: la somma parziale complessa di (iπ)^k / k! deriva verso −1 al crescere di N.",
  charactersLabel: "Le cinque costanti",
  charactersRows: [
    { sym: "0", role: "Identità additiva", home: "Aritmetica" },
    { sym: "1", role: "Identità moltiplicativa", home: "Aritmetica" },
    { sym: "e", role: "Base della crescita naturale ≈ 2,71828", home: "Analisi" },
    { sym: "i", role: "Unità immaginaria, i² = −1", home: "Algebra" },
    { sym: "π", role: "Mezzo giro del cerchio ≈ 3,14159", home: "Geometria" },
  ],
  proofLabel: "Dimostrazione in quattro passi",
  proofIntro:
    "Sostituisci x = iθ nella serie di Taylor di eˣ e guarda separarsi parte reale e immaginaria.",
  connectionsLabel: "Dove compare l'identità",
  connectionsRows: [
    {
      field: "Ingegneria elettrica",
      body: "Impedenza Z = R + iX; i fasori V·e^(iωt) trasformano l'analisi AC in algebra lineare.",
    },
    {
      field: "Meccanica quantistica",
      body: "Evoluzione ψ(t) = e^(−iHt/ℏ) ψ(0); ogni stato ruota nello spazio di Hilbert tramite e^(iθ).",
    },
    {
      field: "Analisi di Fourier",
      body: "Ogni segnale si decompone in modi e^(iωt) — la base di MP3, JPEG, RM, Wi-Fi.",
    },
    {
      field: "Teoria dei numeri",
      body: "Le radici dell'unità e^(2πik/n) parametrizzano ogni soluzione di z^n = 1 e generano corpi ciclotomici.",
    },
  ],
  progressionLabel: "L'arco che conduce qui",
  progressionRows: [
    "L'aritmetica sulla retta reale dà +, ×, 0, 1.",
    "L'analisi rende la crescita continua un numero e lo chiama e.",
    "L'algebra esaurisce le radici reali e inventa i; appare il piano complesso.",
    "La geometria parametrizza il cerchio unitario tramite l'angolo e incontra π.",
    "La formula di Eulero mostra che crescere in immaginario = ruotare nel piano.",
    "Poni θ = π. Le cinque costanti si incontrano.",
  ],
  quarterTurnNote: "Quattro quarti di giro chiudono il cerchio. Ogni ×i è una rotazione di 90°; i² = −1 ne sono due.",
  walkStart: "inizio",
  walkHalfTurn: "mezzo giro",
  walkLand: "arrivo",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Análise",
    title: "A identidade de Euler",
    tagline: "Cinco números, uma linha.",
    intro:
      "e^(iπ) + 1 = 0 — cinco constantes vindas de cinco cantos diferentes da matemática, presas numa única igualdade. O Explorer ao lado deixa-te ver e^(iθ) a percorrer o círculo unitário em tempo real, para que possas testemunhar com os teus próprios olhos o instante em θ = π em que a identidade realmente acontece.",
    ctaInteractive: "→ Abrir o Explorer",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Cinco estranhos. Uma linha. Para sempre.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Cinco dos números mais importantes da matemática — e, i, π, 0, 1 — nunca se cruzam no dia a dia. Mas uma única equação, e^(iπ) + 1 = 0, amarra os cinco juntos com apenas soma, produto e potência. Nada mais. Nenhuma constante a sobrar, nenhum enfeite. É toda a identidade.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Imagina caminhar à volta de um círculo de raio 1 centrado na origem de um plano. Começa no ponto 1 à direita. Multiplicar por e^(iθ) significa: caminha θ radianos pelo círculo. Caminha então π radianos — metade do percurso — e chegas ao ponto −1. Soma 1 e voltas a 0.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Feynman chamou à fórmula e^(iθ) = cos θ + i sin θ, de que esta identidade é o caso θ = π, «a fórmula mais notável da matemática», «a nossa joia». Um inquérito do Mathematical Intelligencer em 1990, junto a matemáticos em atividade, votou esta identidade como o teorema mais belo alguma vez provado. É uma ponte: a álgebra escreve os símbolos, a geometria percorre o círculo, a análise fornece a série infinita que faz tudo encaixar.",
      },
    ],
    tryIt:
      "Abaixo: arrasta tu próprio θ pelo círculo e vê a série de Taylor construí-la termo a termo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · Cinco personagens",
      title: "Quem aparece nesta equação",
      body: "Cada um dos cinco números chega de um país diferente da matemática. 0 é a identidade aditiva — somá-lo não muda nada. 1 é a identidade multiplicativa — multiplicar por ele não muda nada. e ≈ 2,71828 é a base natural, o número cuja derivada é ele próprio, nascido no cálculo a partir do juro composto e do crescimento contínuo. i é a unidade imaginária, definida por i² = −1, nascida na álgebra quando Cardano precisou de uma raiz de um negativo para resolver cúbicas. π ≈ 3,14159 é a meia-volta do círculo, a razão entre perímetro e diâmetro, nascida na geometria. Normalmente nunca partilham a mesma sala. A identidade é essa sala.",
    },
    {
      pretitle: "Secção 02 · Multiplicação complexa",
      title: "Porque i é um quarto de volta",
      body: "Esquece por um instante que i é «imaginário» e vê o que multiplicar por i faz. Começa em 1 no eixo real. Multiplica por i e aterras em i — um quarto de volta para cima. Multiplica de novo por i e aterras em i² = −1 — outro quarto de volta, exatamente em frente ao ponto inicial. Dois quartos de volta fazem meia-volta, que é precisamente o que i² = −1 significa geometricamente. A multiplicação complexa é rotação (pelo argumento) vezes escala (pelo módulo). Os números do círculo unitário, onde o módulo é 1, são rotação pura. São o motor da identidade.",
    },
    {
      pretitle: "Secção 03 · A fórmula de Euler",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler publicou esta fórmula em 1748 na sua Introductio in analysin infinitorum, e é a verdade mais ampla da qual a identidade é apenas um único valor. O lado esquerdo, e^(iθ), é uma exponencial com expoente imaginário — um tipo de crescimento que ninguém havia imaginado. O lado direito, cos θ + i sin θ, é o ponto do círculo unitário no ângulo θ. A afirmação de Euler é que essas duas coisas tão diferentes são iguais. Põe θ = π e o lado direito colapsa para −1 + 0i, logo e^(iπ) = −1, e somar 1 dá a identidade. A identidade é a fórmula de Euler em θ = π.",
    },
    {
      pretitle: "Secção 04 · Porque é verdade",
      title: "Séries de Taylor, substituídas",
      body: "A demonstração mais limpa passa por séries de potências. Cada uma das três funções tem um desenvolvimento de Taylor que converge em toda a reta real: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Substitui agora formalmente x = iθ na série de e^x. Como i^k percorre 1, i, −1, −i, os termos reais da série resultante são exatamente a série de Taylor de cos θ, e os termos imaginários (sem o i) são exatamente a série de Taylor de sin θ. Logo e^(iθ) = cos θ + i sin θ — não por definição, mas como teorema sobre séries convergentes. Põe θ = π e a álgebra fecha a demonstração.",
    },
    {
      pretitle: "Secção 05 · Conexões por toda a parte",
      title: "Onde a identidade vive na realidade",
      body: "Assim que tens e^(iθ), deixa de ser curiosidade e torna-se ferramenta indispensável. Os engenheiros eletrotécnicos escrevem a impedância como Z = R + iX, de modo que tensões e correntes se tornam fasores rotativos V·e^(iωt) e as leis de Kirchhoff viram álgebra linear. A mecânica quântica escreve a evolução temporal de um estado como ψ(t) = e^(−iHt/ℏ) ψ(0) — a equação de Schrödinger, com e^(iθ) a fazer toda a rotação no espaço de Hilbert. A análise de Fourier decompõe qualquer sinal razoável numa soma (ou integral) de modos e^(iωt), e todo JPEG, MP3, scanner de RMN e handshake Wi-Fi do planeta assenta sobre essa decomposição. A identidade é o marco onde se cruzam as quatro estradas: aritmética, álgebra, geometria, análise.",
    },
    {
      pretitle: "Secção 06 · Onde se situa",
      title: "Uma progressão curta",
      body: "Dá um passo atrás e vê a cadeia. A aritmética na reta real dá-te +, × e as constantes 0 e 1. O cálculo transforma o crescimento contínuo num número e chama-lhe e. A álgebra resolve cúbicas, fica sem raízes reais, inventa i e descobre o plano complexo. A geometria parametriza o círculo unitário pelo ângulo e encontra π. A fórmula de Euler nota então, com duas páginas de séries de potências, que crescer na direção imaginária é rodar no plano — que e e i fazem em segredo a mesma coisa. Põe o ângulo numa meia-volta e as cinco constantes encontram-se enfim, sem nada no meio. A identidade não é coincidência; é o destino.",
    },
  ],
  unitCircleCaption: "Arrasta θ · e^(iθ) no círculo unitário",
  unitCircleIdentity: "identidade de Euler",
  taylorCaption: "Desliza N · somas parciais de Taylor",
  taylorTerms: "termos",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Caminho complexo · soma parcial de e^(iπ)",
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te varrer θ ao vivo, ver e^(iθ) a traçar o círculo e decompor qualquer complexo nas suas partes de rotação e escala. Tudo o que acabaste de ler está a um clique.",
  closingCta: "→ Abrir o Explorador",
  interactivePretitle1: "Interativo · cursor",
  interactiveTitle1: "Caminha θ à volta do círculo",
  interactiveBody1:
    "Arrasta o cursor de 0 a 2π. O ponto amarelo é e^(iθ); os marcadores ciano e violeta são as suas projeções real e imaginária — as componentes cos θ e sin θ. Quando θ ≈ π aterras em −1 e a identidade acende-se.",
  interactivePretitle2: "Interativo · cursor",
  interactiveTitle2: "Constrói a demonstração, termo a termo",
  interactiveBody2:
    "Cada curva é uma soma parcial de Taylor — apenas os primeiros N+1 termos. Sobe N e as somas parciais ajustam-se às verdadeiras curvas exp, cos e sin. Olha para o pequeno painel em baixo: a soma parcial complexa de (iπ)^k / k! deriva para −1 à medida que N cresce.",
  charactersLabel: "As cinco constantes",
  charactersRows: [
    { sym: "0", role: "Identidade aditiva", home: "Aritmética" },
    { sym: "1", role: "Identidade multiplicativa", home: "Aritmética" },
    { sym: "e", role: "Base do crescimento natural ≈ 2,71828", home: "Cálculo" },
    { sym: "i", role: "Unidade imaginária, i² = −1", home: "Álgebra" },
    { sym: "π", role: "Meia-volta do círculo ≈ 3,14159", home: "Geometria" },
  ],
  proofLabel: "Demonstração em quatro passos",
  proofIntro:
    "Substitui x = iθ na série de Taylor de eˣ e vê as partes real e imaginária separarem-se.",
  connectionsLabel: "Onde a identidade aparece",
  connectionsRows: [
    {
      field: "Engenharia elétrica",
      body: "Impedância Z = R + iX; os fasores V·e^(iωt) reduzem a análise CA a álgebra linear.",
    },
    {
      field: "Mecânica quântica",
      body: "Evolução ψ(t) = e^(−iHt/ℏ) ψ(0); cada estado roda no espaço de Hilbert via e^(iθ).",
    },
    {
      field: "Análise de Fourier",
      body: "Todo sinal se decompõe em modos e^(iωt) — base de MP3, JPEG, RMN, Wi-Fi.",
    },
    {
      field: "Teoria dos números",
      body: "As raízes da unidade e^(2πik/n) parametrizam toda solução de z^n = 1 e geram corpos ciclotómicos.",
    },
  ],
  progressionLabel: "O arco que leva até aqui",
  progressionRows: [
    "A aritmética na reta real dá +, ×, 0, 1.",
    "O cálculo transforma o crescimento contínuo num número e chama-lhe e.",
    "A álgebra fica sem raízes reais e inventa i; aparece o plano complexo.",
    "A geometria parametriza o círculo unitário pelo ângulo e encontra π.",
    "A fórmula de Euler mostra que crescer em imaginário = rodar no plano.",
    "Põe θ = π. As cinco constantes encontram-se.",
  ],
  quarterTurnNote: "Quatro quartos de volta fecham o ciclo. Cada ×i é uma rotação de 90°; i² = −1 são dois deles.",
  walkStart: "início",
  walkHalfTurn: "meia-volta",
  walkLand: "chegada",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Analys",
    title: "Eulers identitet",
    tagline: "Fem tal, en rad.",
    intro:
      "e^(iπ) + 1 = 0 — fem konstanter från fem olika hörn av matematiken, inlåsta i en enda likhet. Explorern bredvid låter dig se e^(iθ) svepa runt enhetscirkeln i realtid, så att du med egna ögon kan bevittna ögonblicket vid θ = π när identiteten faktiskt inträffar.",
    ctaInteractive: "→ Öppna Explorern",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Fem främlingar. En rad. För alltid.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Fem av matematikens viktigaste tal — e, i, π, 0, 1 — möts aldrig i vardagen. Ändå knyter en enda ekvation, e^(iπ) + 1 = 0, samman alla fem med bara addition, multiplikation och exponentiering. Inget annat. Ingen extra konstant, ingen utsmyckning. Det är hela identiteten.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Tänk dig att gå runt en cirkel med radie 1 centrerad i origo i ett plan. Börja vid punkten 1 till höger. Att multiplicera med e^(iθ) betyder: gå θ radianer runt cirkeln. Gå alltså π radianer — halva varvet — och du landar vid punkten −1. Lägg till 1 och du är tillbaka vid 0.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Feynman kallade formeln e^(iθ) = cos θ + i sin θ, där denna identitet är specialfallet θ = π, ”matematikens mest anmärkningsvärda formel”, ”vår juvel”. En undersökning i Mathematical Intelligencer 1990 bland yrkesverksamma matematiker röstade fram denna identitet som den vackraste sats som någonsin bevisats. Den är en bro: algebran skriver symbolerna, geometrin går runt cirkeln, analysen levererar den oändliga serie som får allt att klicka.",
      },
    ],
    tryIt: "Nedan: dra θ runt cirkeln själv, och se Taylorserien bygga den term för term.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Fem rollfigurer",
      title: "Vem som står i ekvationen",
      body: "Vart och ett av de fem talen kommer från ett eget land i matematiken. 0 är den additiva identiteten — att addera det ändrar inget. 1 är den multiplikativa identiteten — att multiplicera med det ändrar inget. e ≈ 2,71828 är den naturliga basen, talet vars derivata är sig självt, fött ur analysen genom ränta på ränta och kontinuerlig tillväxt. i är imaginära enheten, definierad av i² = −1, född i algebran när Cardano behövde en rot ur ett negativt tal för att lösa kubiska ekvationer. π ≈ 3,14159 är cirkelns halvvarv, förhållandet mellan omkrets och diameter, fött ur geometrin. Vanligen delar de aldrig rum. Identiteten är rummet.",
    },
    {
      pretitle: "Avsnitt 02 · Komplex multiplikation",
      title: "Varför i är ett kvartsvarv",
      body: "Glöm för ett ögonblick att i är ”imaginär” och se vad multiplikation med i faktiskt gör. Börja vid 1 på reella axeln. Multiplicera med i och du landar vid i — ett kvartsvarv upp. Multiplicera igen med i och du landar vid i² = −1 — ett kvartsvarv till, precis mittemot startpunkten. Två kvartsvarv är ett halvvarv, och det är precis vad i² = −1 betyder geometriskt. Komplex multiplikation är rotation (med argumentet) gånger skalning (med beloppet). Talen på enhetscirkeln, där beloppet är 1, är ren rotation. De är identitetens motor.",
    },
    {
      pretitle: "Avsnitt 03 · Eulers formel",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler publicerade denna formel 1748 i sin Introductio in analysin infinitorum, och den är den större sanning av vilken identiteten bara är ett enstaka värde. Vänstersidan, e^(iθ), är en exponentialfunktion med imaginär exponent — en sorts tillväxt ingen tidigare hade föreställt sig. Högersidan, cos θ + i sin θ, är punkten på enhetscirkeln vid vinkeln θ. Eulers påstående är att dessa två så olika ting är lika. Sätt θ = π och högersidan kollapsar till −1 + 0i, alltså e^(iπ) = −1, och att lägga till 1 ger identiteten. Identiteten är Eulers formel vid θ = π.",
    },
    {
      pretitle: "Avsnitt 04 · Varför den är sann",
      title: "Taylorserier, insatta",
      body: "Det renaste beviset går genom potensserier. Var och en av de tre funktionerna har en Taylorutveckling som konvergerar på hela reella axeln: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Sätt nu formellt in x = iθ i serien för e^x. Eftersom i^k cyklar genom 1, i, −1, −i blir de reella termerna i den resulterande serien exakt Taylorserien för cos θ, och de imaginära termerna (utan i) exakt Taylorserien för sin θ. Alltså är e^(iθ) = cos θ + i sin θ — inte per definition, utan som sats om konvergenta serier. Sätt θ = π och algebran slutför beviset.",
    },
    {
      pretitle: "Avsnitt 05 · Kopplingar överallt",
      title: "Var identiteten bor i verkligheten",
      body: "Så snart du har e^(iθ) upphör den att vara en kuriositet och blir ett oumbärligt verktyg. Elingenjörer skriver impedansen som Z = R + iX, så att spänningar och strömmar blir roterande fasorer V·e^(iωt) och Kirchhoffs lagar reduceras till linjär algebra. Kvantmekaniken skriver tidsutvecklingen av ett tillstånd som ψ(t) = e^(−iHt/ℏ) ψ(0) — Schrödingerekvationen, med e^(iθ) som utför all rotation i Hilbertrummet. Fourieranalysen sönderdelar varje rimlig signal i en summa (eller integral) av e^(iωt)-moder, och varje JPEG, MP3, MR-skanner och Wi-Fi-handshake på planeten vilar på den sönderdelningen. Identiteten är gränsstenen där de fyra vägarna — aritmetik, algebra, geometri, analys — möts.",
    },
    {
      pretitle: "Avsnitt 06 · Var den passar in",
      title: "En kort progression",
      body: "Ta ett steg tillbaka och se kedjan. Aritmetik på reella axeln ger dig +, × och konstanterna 0 och 1. Analysen gör kontinuerlig tillväxt till ett tal och kallar det e. Algebran löser kubiska ekvationer, tar slut på reella kvadratrötter, uppfinner i och upptäcker det komplexa planet. Geometrin parametriserar enhetscirkeln med vinkel och möter π. Eulers formel märker sedan, med två sidor potensserier, att tillväxt i imaginär riktning är rotation i planet — att e och i i hemlighet gör samma sak. Sätt vinkeln till ett halvvarv och de fem konstanterna möts till sist, utan något emellan. Identiteten är ingen tillfällighet; den är destinationen.",
    },
  ],
  unitCircleCaption: "Dra θ · e^(iθ) på enhetscirkeln",
  unitCircleIdentity: "Eulers identitet",
  taylorCaption: "Dra N · Taylor-delsummor",
  taylorTerms: "termer",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Komplex vandring · delsumma av e^(iπ)",
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig svepa θ live, se e^(iθ) rita cirkeln och bryta upp varje komplext tal i sina roterande och skalande delar. Allt du just läst är ett klick bort.",
  closingCta: "→ Öppna Utforskaren",
  interactivePretitle1: "Interaktivt · reglage",
  interactiveTitle1: "Promenera θ runt cirkeln",
  interactiveBody1:
    "Dra reglaget från 0 till 2π. Den gula punkten är e^(iθ); de cyan och violetta markörerna är dess reella och imaginära projektioner — komponenterna cos θ och sin θ. När θ ≈ π landar du på −1 och identiteten tänds.",
  interactivePretitle2: "Interaktivt · reglage",
  interactiveTitle2: "Bygg beviset, term för term",
  interactiveBody2:
    "Varje kurva är en Taylor-delsumma — bara de första N+1 termerna. Dra upp N och delsummorna sluter sig mot de verkliga exp-, cos- och sin-kurvorna. Titta på den lilla panelen under: den komplexa delsumman av (iπ)^k / k! driver mot −1 när N växer.",
  charactersLabel: "De fem konstanterna",
  charactersRows: [
    { sym: "0", role: "Additiv identitet", home: "Aritmetik" },
    { sym: "1", role: "Multiplikativ identitet", home: "Aritmetik" },
    { sym: "e", role: "Bas för naturlig tillväxt ≈ 2,71828", home: "Analys" },
    { sym: "i", role: "Imaginär enhet, i² = −1", home: "Algebra" },
    { sym: "π", role: "Cirkelns halvvarv ≈ 3,14159", home: "Geometri" },
  ],
  proofLabel: "Bevis i fyra steg",
  proofIntro:
    "Sätt in x = iθ i Taylorserien för eˣ och se reella och imaginära delar separera sig.",
  connectionsLabel: "Var identiteten dyker upp",
  connectionsRows: [
    {
      field: "Elteknik",
      body: "Impedans Z = R + iX; fasorer V·e^(iωt) gör AC-analys till linjär algebra.",
    },
    {
      field: "Kvantmekanik",
      body: "Utveckling ψ(t) = e^(−iHt/ℏ) ψ(0); varje tillstånd roterar i Hilbertrum via e^(iθ).",
    },
    {
      field: "Fourieranalys",
      body: "Varje signal bryts ner i e^(iωt)-moder — grund för MP3, JPEG, MR, Wi-Fi.",
    },
    {
      field: "Talteori",
      body: "Enhetsrötter e^(2πik/n) parametriserar varje lösning till z^n = 1 och föder cyklotomiska kroppar.",
    },
  ],
  progressionLabel: "Bågen som leder hit",
  progressionRows: [
    "Aritmetik på reella axeln ger +, ×, 0, 1.",
    "Analysen gör kontinuerlig tillväxt till ett tal och kallar det e.",
    "Algebran tar slut på reella rötter och uppfinner i; det komplexa planet uppstår.",
    "Geometrin parametriserar enhetscirkeln med vinkel och möter π.",
    "Eulers formel visar att växa i imaginär riktning = rotera i planet.",
    "Sätt θ = π. De fem konstanterna möts.",
  ],
  quarterTurnNote: "Fyra kvartsvarv sluter cirkeln. Varje ×i är en 90°-rotation; i² = −1 är två av dem.",
  walkStart: "start",
  walkHalfTurn: "halvvarv",
  walkLand: "mål",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Analyse",
    title: "Eulers identitet",
    tagline: "Fem tall, én linje.",
    intro:
      "e^(iπ) + 1 = 0 — fem konstanter fra fem ulike hjørner av matematikken, låst sammen i én eneste likhet. Utforskeren ved siden av lar deg se e^(iθ) feie rundt enhetssirkelen i sanntid, så du med egne øyne kan oppleve øyeblikket ved θ = π når identiteten virkelig inntreffer.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Fem fremmede. Én linje. For alltid.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Fem av matematikkens viktigste tall — e, i, π, 0, 1 — møtes aldri i hverdagen. Likevel binder én eneste ligning, e^(iπ) + 1 = 0, alle fem sammen med bare addisjon, multiplikasjon og eksponensiering. Ingenting mer. Ingen konstant til overs, ingen pynt. Det er hele identiteten.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Forestill deg å gå rundt en sirkel med radius 1 sentrert i origo i et plan. Start ved punktet 1 til høyre. Å multiplisere med e^(iθ) betyr: gå θ radianer rundt sirkelen. Gå altså π radianer — halve runden — og du lander ved punktet −1. Legg til 1 og du er tilbake ved 0.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Feynman kalte formelen e^(iθ) = cos θ + i sin θ, der denne identiteten er spesialtilfellet θ = π, «matematikkens mest bemerkelsesverdige formel», «vår juvel». En undersøkelse i Mathematical Intelligencer i 1990 blant yrkesmatematikere kåret denne identiteten til det vakreste teoremet som noen gang er bevist. Den er en bro: algebraen skriver symbolene, geometrien går rundt sirkelen, analysen leverer den uendelige rekken som får alt til å klikke på plass.",
      },
    ],
    tryIt: "Under: dra θ rundt sirkelen selv, og se Taylor-rekken bygge den ledd for ledd.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Fem skikkelser",
      title: "Hvem som står i ligningen",
      body: "Hvert av de fem tallene kommer fra sitt eget land i matematikken. 0 er den additive identiteten — å legge den til endrer ingenting. 1 er den multiplikative identiteten — å multiplisere med den endrer ingenting. e ≈ 2,71828 er den naturlige basen, tallet hvis derivert er seg selv, født i analysen ut av rentes rente og kontinuerlig vekst. i er den imaginære enheten, definert ved i² = −1, født i algebraen da Cardano trengte en kvadratrot av et negativt tall for å løse kubiske ligninger. π ≈ 3,14159 er sirkelens halvomdreining, forholdet mellom omkrets og diameter, født i geometrien. Vanligvis deler de aldri rom. Identiteten er rommet.",
    },
    {
      pretitle: "Avsnitt 02 · Kompleks multiplikasjon",
      title: "Hvorfor i er en kvart omdreining",
      body: "Glem et øyeblikk at i er «imaginær» og se hva det å multiplisere med i faktisk gjør. Start ved 1 på den reelle aksen. Multipliser med i og du lander ved i — en kvart omdreining oppover. Multipliser igjen med i og du lander ved i² = −1 — en kvart omdreining til, rett overfor startpunktet. To kvarte omdreininger blir en halv omdreining, som er nøyaktig hva i² = −1 betyr geometrisk. Kompleks multiplikasjon er rotasjon (med argumentet) ganget med skalering (med absoluttverdien). Tallene på enhetssirkelen, der absoluttverdien er 1, er ren rotasjon. De er identitetens motor.",
    },
    {
      pretitle: "Avsnitt 03 · Eulers formel",
      title: "e^(iθ) = cos θ + i sin θ",
      body: "Euler publiserte denne formelen i 1748 i sin Introductio in analysin infinitorum, og den er den større sannheten som identiteten bare er én enkelt verdi av. Venstresiden, e^(iθ), er en eksponentialfunksjon med imaginær eksponent — en slags vekst ingen tidligere hadde forestilt seg. Høyresiden, cos θ + i sin θ, er punktet på enhetssirkelen ved vinkel θ. Eulers påstand er at disse to vidt forskjellige tingene er like. Sett θ = π og høyresiden kollapser til −1 + 0i, altså e^(iπ) = −1, og å legge til 1 gir identiteten. Identiteten er Eulers formel ved θ = π.",
    },
    {
      pretitle: "Avsnitt 04 · Hvorfor den er sann",
      title: "Taylor-rekker, satt inn",
      body: "Det reneste beviset går gjennom potensrekker. Hver av de tre funksjonene har en Taylor-utvikling som konvergerer på hele den reelle linjen: e^x = Σ x^k / k!, cos x = Σ (−1)^k x^(2k) / (2k)!, sin x = Σ (−1)^k x^(2k+1) / (2k+1)!. Sett nå formelt x = iθ inn i rekken for e^x. Siden i^k gjentar mønsteret 1, i, −1, −i, blir de reelle leddene i den resulterende rekken nøyaktig Taylor-rekken for cos θ, og de imaginære leddene (uten i) nøyaktig Taylor-rekken for sin θ. Altså er e^(iθ) = cos θ + i sin θ — ikke per definisjon, men som teorem om konvergente rekker. Sett θ = π og algebraen avslutter beviset.",
    },
    {
      pretitle: "Avsnitt 05 · Forbindelser overalt",
      title: "Hvor identiteten bor i virkeligheten",
      body: "Så snart du har e^(iθ) slutter den å være en kuriositet og blir et uunnværlig verktøy. Elektroingeniører skriver impedansen som Z = R + iX, slik at spenninger og strømmer blir roterende fasorer V·e^(iωt) og Kirchhoffs lover reduseres til lineær algebra. Kvantemekanikken skriver tidsutviklingen til en tilstand som ψ(t) = e^(−iHt/ℏ) ψ(0) — Schrödinger-ligningen, der e^(iθ) utfører all rotasjon i Hilbert-rommet. Fourier-analysen dekomponerer ethvert rimelig signal i en sum (eller integral) av e^(iωt)-moder, og hver JPEG, MP3, MR-skanner og Wi-Fi-håndtrykk på planeten hviler på den dekomposisjonen. Identiteten er grensesteinen der de fire veiene — aritmetikk, algebra, geometri, analyse — møtes.",
    },
    {
      pretitle: "Avsnitt 06 · Hvor den hører hjemme",
      title: "En kort progresjon",
      body: "Ta et skritt tilbake og se kjeden. Aritmetikk på den reelle linjen gir deg +, × og konstantene 0 og 1. Analysen gjør kontinuerlig vekst til et tall og kaller det e. Algebraen løser kubiske ligninger, går tom for reelle kvadratrøtter, oppfinner i og oppdager det komplekse planet. Geometrien parametriserer enhetssirkelen ved vinkel og møter π. Eulers formel merker så, med to sider potensrekker, at å vokse i imaginær retning er å rotere i planet — at e og i i hemmelighet gjør det samme. Sett vinkelen til en halv omdreining og de fem konstantene møtes til slutt, uten noe imellom. Identiteten er ingen tilfeldighet; den er målet.",
    },
  ],
  unitCircleCaption: "Dra θ · e^(iθ) på enhetssirkelen",
  unitCircleIdentity: "Eulers identitet",
  taylorCaption: "Dra N · Taylor-delsummer",
  taylorTerms: "ledd",
  taylorExp: "exp",
  taylorCos: "cos",
  taylorSin: "sin",
  taylorWalk: "Kompleks vandring · delsum av e^(iπ)",
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg sveipe θ live, se e^(iθ) tegne sirkelen og bryte ethvert komplekst tall ned i dets roterende og skalerende deler. Alt du nettopp leste er ett klikk unna.",
  closingCta: "→ Åpne Utforskeren",
  interactivePretitle1: "Interaktivt · glidebryter",
  interactiveTitle1: "Spasere θ rundt sirkelen",
  interactiveBody1:
    "Dra bryteren fra 0 til 2π. Det gule punktet er e^(iθ); de cyan og fiolette markørene er dets reelle og imaginære projeksjoner — komponentene cos θ og sin θ. Når θ ≈ π lander du på −1 og identiteten lyser opp.",
  interactivePretitle2: "Interaktivt · glidebryter",
  interactiveTitle2: "Bygg beviset, ledd for ledd",
  interactiveBody2:
    "Hver kurve er en Taylor-delsum — bare de første N+1 leddene. Skru opp N og delsummene legger seg mot de ekte exp-, cos- og sin-kurvene. Se på det lille panelet under: den komplekse delsummen av (iπ)^k / k! glir mot −1 etter hvert som N vokser.",
  charactersLabel: "De fem konstantene",
  charactersRows: [
    { sym: "0", role: "Additiv identitet", home: "Aritmetikk" },
    { sym: "1", role: "Multiplikativ identitet", home: "Aritmetikk" },
    { sym: "e", role: "Base for naturlig vekst ≈ 2,71828", home: "Analyse" },
    { sym: "i", role: "Imaginær enhet, i² = −1", home: "Algebra" },
    { sym: "π", role: "Sirkelens halve omdreining ≈ 3,14159", home: "Geometri" },
  ],
  proofLabel: "Bevis i fire trinn",
  proofIntro: "Sett x = iθ inn i Taylor-rekken for eˣ og se den reelle og imaginære delen skilles.",
  connectionsLabel: "Hvor identiteten dukker opp",
  connectionsRows: [
    {
      field: "Elektroteknikk",
      body: "Impedans Z = R + iX; fasorer V·e^(iωt) gjør AC-analyse til lineær algebra.",
    },
    {
      field: "Kvantemekanikk",
      body: "Utvikling ψ(t) = e^(−iHt/ℏ) ψ(0); hver tilstand roterer i Hilbert-rom via e^(iθ).",
    },
    {
      field: "Fourier-analyse",
      body: "Hvert signal dekomponeres i e^(iωt)-moder — grunnlaget for MP3, JPEG, MR, Wi-Fi.",
    },
    {
      field: "Tallteori",
      body: "Enhetsrøtter e^(2πik/n) parametriserer enhver løsning av z^n = 1 og avler syklotomiske kropper.",
    },
  ],
  progressionLabel: "Buen som fører hit",
  progressionRows: [
    "Aritmetikk på den reelle linjen gir +, ×, 0, 1.",
    "Analysen gjør kontinuerlig vekst til et tall og kaller det e.",
    "Algebraen går tom for reelle røtter og oppfinner i; det komplekse planet dukker opp.",
    "Geometrien parametriserer enhetssirkelen ved vinkel og møter π.",
    "Eulers formel viser at å vokse i imaginær retning = å rotere i planet.",
    "Sett θ = π. De fem konstantene møtes.",
  ],
  quarterTurnNote: "Fire kvartsomdreininger lukker sirkelen. Hver ×i er en 90°-rotasjon; i² = −1 er to av dem.",
  walkStart: "start",
  walkHalfTurn: "halvomdreining",
  walkLand: "mål",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function EulerStory() {
  const { locale, u } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-signal-teal/10 via-transparent to-ink-950" />

      {/* Hero — canonical pretitle / title / tagline / intro / 2 buttons / formula badge */}
      <section className="mx-auto mb-32 max-w-5xl space-y-7 text-center">
        <Reveal>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
            {page.pretitle}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="math-italic text-6xl leading-[0.95] tracking-tight md:text-8xl">
            {page.title}
          </h1>
        </Reveal>
        <Reveal delay={250}>
          <p className="math-italic text-2xl leading-snug text-ink-200 md:text-3xl">
            {page.tagline}
          </p>
        </Reveal>
        <Reveal delay={380}>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{page.intro}</p>
        </Reveal>
        <Reveal delay={500}>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 md:flex-row">
            <Link
              href="/euler/explorer"
              className="rounded-full border border-signal-teal/70 bg-signal-teal/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/20"
            >
              {page.ctaInteractive}
            </Link>
            <Link
              href="/"
              className="hairline rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
            >
              {u.back}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={620}>
          <div className="hairline float-gentle mx-auto mt-6 max-w-md rounded-md border bg-ink-950/60 p-3 font-mono text-base text-ink-100">
            eⁱᵖⁱ + 1 = 0
          </div>
        </Reveal>
      </section>

      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
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
                    <div className="hairline mt-4 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                      <div>
                        {story.walkStart} · <span className="text-signal-cyan">1</span>
                      </div>
                      <div>
                        × e^(iπ) · <span className="text-signal-teal">{story.walkHalfTurn}</span>
                      </div>
                      <div>
                        {story.walkLand} · <span className="text-signal-rose">−1</span>
                      </div>
                      <div>
                        + 1 · <span className="text-signal-violet">0</span>
                      </div>
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

      {/* Section 01 — five characters */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard
          pretitle={sec0.pretitle}
          title={sec0.title}
          body={sec0.body}
          accent="text-signal-teal"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.charactersLabel}
            </div>
            <table className="w-full font-mono text-sm">
              <tbody>
                {story.charactersRows.map((r) => (
                  <tr key={r.sym} className="border-b border-ink-700/30 last:border-0">
                    <td className="math-italic w-12 px-2 py-2 text-lg text-signal-teal">
                      {r.sym}
                    </td>
                    <td className="px-2 py-2 text-ink-100">{r.role}</td>
                    <td className="px-2 py-2 text-xs uppercase tracking-widest text-ink-300">
                      {r.home}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — complex multiplication = rotation */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard
          pretitle={sec1.pretitle}
          title={sec1.title}
          body={sec1.body}
          accent="text-signal-teal"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6 text-center font-mono text-sm">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              i · i · i · i
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-ink-100">
              <span className="text-signal-cyan">1</span>
              <span className="text-ink-400">→×i→</span>
              <span className="text-signal-teal">i</span>
              <span className="text-ink-400">→×i→</span>
              <span className="text-signal-rose">−1</span>
              <span className="text-ink-400">→×i→</span>
              <span className="text-signal-violet">−i</span>
              <span className="text-ink-400">→×i→</span>
              <span className="text-signal-cyan">1</span>
            </div>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-ink-300">
              {story.quarterTurnNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 — Unit-circle slider */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.interactivePretitle1}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.interactiveTitle1}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.interactiveBody1}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <EulerUnitCircle
            caption={story.unitCircleCaption}
            identityHint={story.unitCircleIdentity}
          />
        </Reveal>
      </section>

      {/* Section 03 — Euler's formula */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard
          pretitle={sec2.pretitle}
          title={sec2.title}
          body={sec2.body}
          accent="text-signal-teal"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-8 text-center font-mono">
            <div className="text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.proofLabel}
            </div>
            <div className="mx-auto grid max-w-md gap-3 text-left text-sm">
              <div className="flex gap-3">
                <span className="w-6 text-ink-400">1.</span>
                <span className="text-ink-100">e^(iθ) = cos θ + i sin θ</span>
              </div>
              <div className="flex gap-3">
                <span className="w-6 text-ink-400">2.</span>
                <span className="text-ink-100">θ ← π</span>
              </div>
              <div className="flex gap-3">
                <span className="w-6 text-ink-400">3.</span>
                <span className="text-ink-100">e^(iπ) = −1 + i·0 = −1</span>
              </div>
              <div className="flex gap-3">
                <span className="w-6 text-ink-400">4.</span>
                <span className="text-signal-teal">e^(iπ) + 1 = 0 ∎</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — Taylor proof */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard
          pretitle={sec3.pretitle}
          title={sec3.title}
          body={sec3.body}
          accent="text-signal-teal"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6 font-mono text-xs">
            <div className="text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.proofIntro}
            </div>
            <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-4 leading-relaxed text-ink-100">
              {`e^x   = Σₖ xᵏ / k!
e^(iθ) = Σₖ (iθ)ᵏ / k!
       = Σₖ iᵏ θᵏ / k!

iᵏ cycles:  k mod 4 = 0 → +1
            k mod 4 = 1 → +i
            k mod 4 = 2 → −1
            k mod 4 = 3 → −i

real part      = Σ (−1)ʲ θ²ʲ / (2j)!     = cos θ
imaginary part = Σ (−1)ʲ θ²ʲ⁺¹ / (2j+1)! = sin θ`}
            </pre>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 2 — Taylor series builder */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.interactivePretitle2}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.interactiveTitle2}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.interactiveBody2}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <EulerTaylorBuilder
            caption={story.taylorCaption}
            termsLabel={story.taylorTerms}
            expLabel={story.taylorExp}
            cosLabel={story.taylorCos}
            sinLabel={story.taylorSin}
            walkLabel={story.taylorWalk}
          />
        </Reveal>
      </section>

      {/* Section 05 — connections everywhere */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard
          pretitle={sec4.pretitle}
          title={sec4.title}
          body={sec4.body}
          accent="text-signal-teal"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.connectionsLabel}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {story.connectionsRows.map((c) => (
                <div
                  key={c.field}
                  className="hairline space-y-1.5 rounded-md border bg-ink-950/60 p-4 transition-colors hover:border-signal-teal/40"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
                    {c.field}
                  </div>
                  <div className="text-sm leading-relaxed text-ink-200">{c.body}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — where it sits, progression */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <StoryCard
          pretitle={sec5.pretitle}
          title={sec5.title}
          body={sec5.body}
          accent="text-signal-teal"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
              {story.progressionLabel}
            </div>
            <ol className="space-y-2">
              {story.progressionRows.map((row, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-100">
                  <span className="w-6 shrink-0 font-mono text-signal-teal">{i + 1}.</span>
                  <span>{row}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA — apollonian-style */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/euler/explorer"
            className="inline-block rounded-full border border-signal-teal/70 bg-signal-teal/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/25"
          >
            {story.closingCta}
          </Link>
        </section>
      </Reveal>
    </main>
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-teal/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-teal">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
