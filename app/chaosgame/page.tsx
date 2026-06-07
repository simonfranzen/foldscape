"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { ChaosGameLive } from "@/components/ChaosGameLive";
import { ChaosGameBarnsleyFern } from "@/components/ChaosGameBarnsleyFern";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";
import { useEffect, useRef } from "react";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Tiny SVG: 200 vs 5000 dots side by side, both running the chaos game on
// a triangle with r = 1/2. Pre-computed at render time on the client.
// --------------------------------------------------------------------------

function ChaosDotsSVG({ count, color }: { count: number; color: string }) {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = 140;
    const H = 130;
    const cx = W / 2;
    const cy = H / 2 + 8;
    const R = 56;
    const vx = [
      cx,
      cx + R * Math.cos(-Math.PI / 2 + (2 * Math.PI) / 3),
      cx + R * Math.cos(-Math.PI / 2 + (4 * Math.PI) / 3),
    ];
    const vy = [
      cy - R,
      cy + R * Math.sin(-Math.PI / 2 + (2 * Math.PI) / 3),
      cy + R * Math.sin(-Math.PI / 2 + (4 * Math.PI) / 3),
    ];
    // background triangle outline
    const tri = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    tri.setAttribute("points", `${vx[0]},${vy[0]} ${vx[1]},${vy[1]} ${vx[2]},${vy[2]}`);
    tri.setAttribute("fill", "none");
    tri.setAttribute("stroke", "rgba(255,209,102,0.25)");
    tri.setAttribute("stroke-width", "1");
    svg.appendChild(tri);

    let x = cx;
    let y = cy;
    const dots: Array<[number, number]> = [];
    const burn = 30;
    for (let i = 0; i < count + burn; i++) {
      const pick = (Math.random() * 3) | 0;
      x = x + 0.5 * (vx[pick] - x);
      y = y + 0.5 * (vy[pick] - y);
      if (i >= burn) dots.push([x, y]);
    }
    // batch into a single path of tiny rects via path strings for perf
    const ns = "http://www.w3.org/2000/svg";
    for (const [dx, dy] of dots) {
      const c = document.createElementNS(ns, "rect");
      c.setAttribute("x", String(dx));
      c.setAttribute("y", String(dy));
      c.setAttribute("width", "1");
      c.setAttribute("height", "1");
      c.setAttribute("fill", color);
      svg.appendChild(c);
    }
  }, [count, color]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 140 130"
      width="100%"
      height="100%"
      style={{ maxWidth: 160 }}
      className="mx-auto block"
      aria-hidden
    />
  );
}

// --------------------------------------------------------------------------
// Inline rich, per-locale content. Eight languages, fully authored — the
// shared stories.ts dict only gives us four sections, this page wants six,
// plus encounter + closing + interactive captions.
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
  liveCaption: string;
  liveVerticesLabel: string;
  liveRatioLabel: string;
  liveNoRepeatLabel: string;
  liveMagicLabel: string;
  liveResetLabel: string;
  livePointsLabel: (n: number) => string;
  fernCaption: string;
  fernPlay: string;
  fernPause: string;
  fernReset: string;
  fernFastForward: string;
  fernPointsLabel: (n: number) => string;
  dotsSmallLabel: string;
  dotsLargeLabel: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

const fmt = (n: number) => n.toLocaleString();

const en: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "The Chaos Game",
    tagline: "Roll a die, draw a fractal.",
    intro:
      "Three dots, a die, and one short step — repeat a few thousand times and a perfect Sierpiński triangle materialises out of pure randomness. The Explorer lets you tune the rule live; here we tell the story behind it.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "Three dots. A die. A halving step.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Mark three dots on a page — the corners of a triangle. Drop your pen anywhere. Now roll a three-sided die, walk halfway toward the chosen corner, and make a dot. Treat that dot as your new position and repeat. After a few thousand rolls a perfect Sierpiński triangle stares back at you. Order, from pure noise.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: 'Start anywhere inside an equilateral triangle. Each step: pick one of the three vertices uniformly at random, move halfway toward it, drop a dot. After 200 dots you see a scatter cloud. After 5000 you see the gasket — every "forbidden" region (the central hole, then the three sub-holes, then nine sub-sub-holes) is provably empty.',
      },
      {
        label: "03",
        title: "Why it matters",
        body: 'This is the iterated function system in disguise. Each "walk halfway to vertex i" is a contracting map on the plane; the set of dots converges onto the unique attractor of those three maps. Swap the maps and you get other fractals — Barnsley\'s fern grows from exactly the same recipe, just four affine maps instead of three halving steps.',
      },
    ],
    tryIt: "Below: watch the rule run live, then watch the fern grow.",
  },
  sections: [
    {
      pretitle: "Section 01 · The minimal recipe",
      title: "Three vertices, a halving step, a random choice",
      body: "Place three points v₁, v₂, v₃ at the corners of a triangle. Pick any starting position p₀ in the plane. At each step: roll a fair three-sided die to choose an index i ∈ {1, 2, 3}, then move halfway from your current position toward the chosen vertex — pₙ₊₁ = (pₙ + vᵢ) / 2 — and mark pₙ₊₁ as a dot. Repeat forever. That is the entire chaos game: two ingredients, three vertices, one fixed jump ratio of one-half. No memory, no plan, no global rule. The picture builds itself.",
    },
    {
      pretitle: "Section 02 · Why it works",
      title: "Fixed points of three contracting maps",
      body: "Each available move is a function fᵢ(x) = (x + vᵢ) / 2 — a contraction by factor 1/2 toward vertex vᵢ. The fixed point of fᵢ is vᵢ itself: walking halfway toward a vertex over and over takes you to the vertex. Composing the three maps in every possible order generates a self-similar set: the Sierpiński triangle. The chaos game samples that set with probability one. Each step is a random projection toward one of the three fixed points, and because every map contracts, the influence of where you started decays exponentially — after a short burn-in your trajectory lives entirely on the attractor.",
    },
    {
      pretitle: "Section 03 · Barnsley's collage theorem",
      title: "Any compact set has an IFS that converges to it",
      body: 'Michael Barnsley generalised the chaos game in 1988 with the collage theorem: every compact subset of the plane can be approximated arbitrarily well by the attractor of some finite iterated function system. Reverse the question — pick a target shape, then find a few affine maps whose images glue together (a "collage") to cover it. The attractor of that IFS is the shape. The chaos game then samples it with a single random orbit. Coastlines, ferns, mountains, clouds: every fractal in nature is, in principle, a few contractions in disguise.',
    },
    {
      pretitle: "Section 04 · Beyond triangles",
      title: "When halving fails — and the rule that fixes it",
      body: 'Try four vertices at the corners of a square with the same r = 1/2 step. The result is no fractal at all: the dots fill the interior uniformly. The reason is that the four halving maps on a square cover the whole square — their attractor is the filled square. The fix is a restriction rule. Forbid the next vertex from equalling the previous one ("no repeat") and a delicate Sierpiński-carpet relative appears. Each n-gon has its own magic jump ratio rₙ = 1 / (1 + 2·cos(π/n)) that yields a clean self-similar attractor without restrictions. For n = 3 this is 1/2; for n = 5 it is 1/φ² ≈ 0.382; for n = 6, 1/(1 + √3); and so on.',
    },
    {
      pretitle: "Section 05 · Barnsley's fern",
      title: "Four affine maps. One photograph of a fern.",
      body: "Drop the vertices entirely. Pick four affine transformations of the plane f₁ … f₄ and four probabilities (0.01, 0.85, 0.07, 0.07). At each step, choose one of the four maps with those probabilities and apply it to your current point. f₁ — the rare 1% — collapses everything onto the stem; f₂ — the dominant 85% — copies the fern onto itself, rotated and shrunk; f₃ and f₄ peel off the left and right leaflets. After a hundred thousand iterations the cloud of points is indistinguishable from a photograph of a real fern. The numbers are not magic: change a coefficient and the fern bends; change a probability and the leaflets thicken. The recipe is editable.",
    },
    {
      pretitle: "Section 06 · Deeper",
      title: "Chaos, ergodicity, and the SRB measure",
      body: "The chaos game is more than a drawing trick. The random orbit is a Markov chain on the attractor; the invariant distribution it samples — the Hutchinson measure — is the unique probability measure that splits into weighted pieces under the IFS. In smooth ergodic theory this is a sibling of the SRB measure (Sinai–Ruelle–Bowen) on a hyperbolic attractor: the physical measure that almost every initial condition picks out. The picture in front of you is a finite sample of a probability distribution that has support on a fractal of dimension log 3 / log 2 ≈ 1.585. Geometry, probability, and dynamics meet in a die roll.",
    },
  ],
  liveCaption: "Interactive · the chaos game running live",
  liveVerticesLabel: "Vertices",
  liveRatioLabel: "Jump ratio r",
  liveNoRepeatLabel: "No-repeat rule",
  liveMagicLabel: "↺ magic ratio",
  liveResetLabel: "↺ reset",
  livePointsLabel: (n) => `${fmt(n)} points`,
  fernCaption: "Interactive · Barnsley's fern grows",
  fernPlay: "▶ play",
  fernPause: "⏸ pause",
  fernReset: "↺ reset",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} points`,
  dotsSmallLabel: "200 dots",
  dotsLargeLabel: "5000 dots",
  closingPretitle: "Take it further",
  closingTitle: "Roll the dice.",
  closingBody:
    "The Explorer lets you tune the vertex count, the jump ratio, the restriction rule and the colour — and switch in a heartbeat to the four-map Barnsley fern. Everything you just read, in your hands.",
  closingCta: "→ Open the Explorer",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "Das Chaos-Spiel",
    tagline: "Würfle, zeichne ein Fraktal.",
    intro:
      "Drei Punkte, ein Würfel und ein kurzer Schritt – wiederhole das ein paar tausend Mal und aus reinem Zufall taucht ein perfektes Sierpiński-Dreieck auf. Im Explorer kannst du die Regel live drehen; hier erzählen wir die Geschichte dahinter.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Drei Punkte. Ein Würfel. Ein Halbierungsschritt.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Markiere drei Punkte auf dem Papier – die Ecken eines Dreiecks. Setz den Stift irgendwo an. Würfle jetzt einen dreiseitigen Würfel, geh halb in Richtung der gewählten Ecke und mach einen Punkt. Behandle diesen Punkt als deine neue Position und wiederhole. Nach ein paar tausend Würfen blickt dich ein perfektes Sierpiński-Dreieck an. Ordnung aus reinem Rauschen.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: 'Starte irgendwo in einem gleichseitigen Dreieck. Jeder Schritt: wähl eine der drei Ecken gleichverteilt zufällig, geh halb in ihre Richtung, setz einen Punkt. Nach 200 Punkten siehst du eine Streuwolke. Nach 5000 das Sieb – jede "verbotene" Region (das mittlere Loch, dann die drei Sub-Löcher, dann neun Sub-Sub-Löcher) ist beweisbar leer.',
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: 'Das ist ein verkapptes iteriertes Funktionensystem. Jeder "geh halb zu Ecke i" ist eine kontrahierende Abbildung in der Ebene; die Punktmenge konvergiert auf den einzigen Attraktor dieser drei Abbildungen. Tausch die Abbildungen aus und du bekommst andere Fraktale – Barnsleys Farn wächst aus genau demselben Rezept, nur vier affine Abbildungen statt drei Halbierungen.',
      },
    ],
    tryIt: "Unten: lass die Regel live laufen, dann sieh dem Farn beim Wachsen zu.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Das minimale Rezept",
      title: "Drei Ecken, ein Halbierungsschritt, eine Zufallswahl",
      body: "Setz drei Punkte v₁, v₂, v₃ an die Ecken eines Dreiecks. Wähl irgendeine Startposition p₀ in der Ebene. Bei jedem Schritt: würfle einen fairen dreiseitigen Würfel, um einen Index i ∈ {1, 2, 3} zu ziehen, geh dann halb von der aktuellen Position in Richtung der gewählten Ecke – pₙ₊₁ = (pₙ + vᵢ) / 2 – und markier pₙ₊₁ als Punkt. Wiederhole für immer. Das ist das ganze Chaos-Spiel: zwei Zutaten, drei Ecken, ein fester Sprungfaktor von einem Halben. Kein Gedächtnis, kein Plan, keine globale Regel. Das Bild baut sich selbst.",
    },
    {
      pretitle: "Abschnitt 02 · Warum es funktioniert",
      title: "Fixpunkte dreier kontrahierender Abbildungen",
      body: "Jede mögliche Bewegung ist eine Funktion fᵢ(x) = (x + vᵢ) / 2 – eine Kontraktion um den Faktor 1/2 zur Ecke vᵢ hin. Der Fixpunkt von fᵢ ist vᵢ selbst: immer wieder halb zu einer Ecke zu gehen, bringt dich zur Ecke. Die Verknüpfung der drei Abbildungen in jeder möglichen Reihenfolge erzeugt eine selbstähnliche Menge: das Sierpiński-Dreieck. Das Chaos-Spiel tastet diese Menge mit Wahrscheinlichkeit eins ab. Jeder Schritt ist eine zufällige Projektion auf einen der drei Fixpunkte, und weil jede Abbildung kontrahiert, klingt der Einfluss des Startpunkts exponentiell ab – nach kurzer Einlaufzeit lebt deine Bahn ganz auf dem Attraktor.",
    },
    {
      pretitle: "Abschnitt 03 · Barnsleys Collage-Theorem",
      title: "Jede kompakte Menge hat ein IFS, das gegen sie konvergiert",
      body: 'Michael Barnsley verallgemeinerte das Chaos-Spiel 1988 mit dem Collage-Theorem: jede kompakte Teilmenge der Ebene lässt sich beliebig gut durch den Attraktor eines endlichen iterierten Funktionensystems annähern. Dreh die Frage um – such dir eine Zielform, dann finde wenige affine Abbildungen, deren Bilder zusammen (eine "Collage") die Form überdecken. Der Attraktor dieses IFS ist die Form. Das Chaos-Spiel tastet sie mit einer einzigen Zufallsbahn ab. Küstenlinien, Farne, Berge, Wolken: jedes Fraktal in der Natur ist im Prinzip ein paar getarnte Kontraktionen.',
    },
    {
      pretitle: "Abschnitt 04 · Jenseits des Dreiecks",
      title: "Wenn Halbieren scheitert – und die Regel, die es rettet",
      body: 'Versuch vier Ecken am Quadrat mit demselben Schritt r = 1/2. Das Ergebnis ist kein Fraktal: die Punkte füllen das Innere gleichmäßig. Der Grund: die vier Halbierungsabbildungen auf dem Quadrat überdecken das ganze Quadrat – ihr Attraktor ist das gefüllte Quadrat. Die Lösung ist eine Beschränkungsregel. Verbiete, dass die nächste Ecke gleich der vorigen ist ("no repeat"), und ein zartes Sierpiński-Teppich-Verwandtes erscheint. Jedes n-Eck hat seinen eigenen magischen Sprungfaktor rₙ = 1 / (1 + 2·cos(π/n)), der ohne Beschränkungen einen sauberen selbstähnlichen Attraktor liefert. Für n = 3 ist das 1/2; für n = 5 ist es 1/φ² ≈ 0,382; für n = 6, 1/(1 + √3); und so weiter.',
    },
    {
      pretitle: "Abschnitt 05 · Barnsleys Farn",
      title: "Vier affine Abbildungen. Eine Fotografie eines Farns.",
      body: "Lass die Ecken ganz weg. Wähl vier affine Transformationen der Ebene f₁ … f₄ und vier Wahrscheinlichkeiten (0,01, 0,85, 0,07, 0,07). In jedem Schritt: wähl eine der vier Abbildungen mit diesen Wahrscheinlichkeiten und wende sie auf den aktuellen Punkt an. f₁ – das seltene 1 % – kollabiert alles auf den Stamm; f₂ – die dominanten 85 % – kopiert den Farn auf sich selbst, gedreht und geschrumpft; f₃ und f₄ schälen die linken und rechten Blättchen ab. Nach hunderttausend Iterationen ist die Punktwolke ununterscheidbar von der Fotografie eines echten Farns. Die Zahlen sind nicht magisch: änder einen Koeffizienten und der Farn biegt sich; änder eine Wahrscheinlichkeit und die Blättchen werden dichter. Das Rezept ist editierbar.",
    },
    {
      pretitle: "Abschnitt 06 · Tiefer",
      title: "Chaos, Ergodizität und das SRB-Maß",
      body: "Das Chaos-Spiel ist mehr als ein Zeichentrick. Die Zufallsbahn ist eine Markow-Kette auf dem Attraktor; die invariante Verteilung, die sie abtastet – das Hutchinson-Maß – ist das einzige Wahrscheinlichkeitsmaß, das unter dem IFS in gewichtete Stücke zerfällt. In der glatten Ergodentheorie ist das ein Geschwister des SRB-Maßes (Sinai–Ruelle–Bowen) auf einem hyperbolischen Attraktor: das physikalische Maß, das fast jede Anfangsbedingung herausstellt. Das Bild vor dir ist eine endliche Stichprobe einer Wahrscheinlichkeitsverteilung, die auf einem Fraktal der Dimension log 3 / log 2 ≈ 1,585 lebt. Geometrie, Wahrscheinlichkeit und Dynamik treffen sich in einem Würfelwurf.",
    },
  ],
  liveCaption: "Interaktiv · das Chaos-Spiel live",
  liveVerticesLabel: "Ecken",
  liveRatioLabel: "Sprungfaktor r",
  liveNoRepeatLabel: "No-repeat-Regel",
  liveMagicLabel: "↺ magischer Faktor",
  liveResetLabel: "↺ Reset",
  livePointsLabel: (n) => `${fmt(n)} Punkte`,
  fernCaption: "Interaktiv · Barnsleys Farn wächst",
  fernPlay: "▶ Start",
  fernPause: "⏸ Pause",
  fernReset: "↺ Reset",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} Punkte`,
  dotsSmallLabel: "200 Punkte",
  dotsLargeLabel: "5000 Punkte",
  closingPretitle: "Geh weiter",
  closingTitle: "Würfle.",
  closingBody:
    "Der Explorer lässt dich Eckenzahl, Sprungfaktor, Beschränkungsregel und Farbe drehen – und im Handumdrehen auf den Vier-Abbildungs-Farn von Barnsley umschalten. Alles, was du gerade gelesen hast, in deiner Hand.",
  closingCta: "→ Explorer öffnen",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "El Juego del Caos",
    tagline: "Tira un dado, dibuja un fractal.",
    intro:
      "Tres puntos, un dado y un paso corto: repítelo unos miles de veces y un triángulo de Sierpiński perfecto emerge del puro azar. El Explorador deja afinar la regla en vivo; aquí contamos la historia detrás.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Tres puntos. Un dado. Un paso a la mitad.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Marca tres puntos en una hoja: las esquinas de un triángulo. Apoya el lápiz donde quieras. Ahora tira un dado de tres caras, camina hasta la mitad de distancia a la esquina elegida y haz un punto. Trata ese punto como tu nueva posición y repite. Tras unos miles de tiradas un triángulo de Sierpiński perfecto te mira fijamente. Orden, del ruido puro.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: 'Empieza en cualquier sitio dentro de un triángulo equilátero. Cada paso: elige uniformemente una de las tres esquinas, muévete hasta la mitad, deja un punto. A los 200 puntos ves una nube dispersa. A los 5000 ves la junta — toda región "prohibida" (el agujero central, luego los tres subagujeros, luego nueve sub-subagujeros) está vacía demostrablemente.',
      },
      {
        label: "03",
        title: "Por qué importa",
        body: 'Esto es un sistema de funciones iteradas disfrazado. Cada "ve a la mitad hacia la esquina i" es una contracción del plano; el conjunto de puntos converge al único atractor de esas tres aplicaciones. Cambia las aplicaciones y obtienes otros fractales: el helecho de Barnsley crece exactamente del mismo guion, solo que con cuatro aplicaciones afines en lugar de tres pasos a la mitad.',
      },
    ],
    tryIt: "Abajo: mira la regla correr en vivo, después mira crecer el helecho.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La receta mínima",
      title: "Tres vértices, un paso a la mitad, una elección al azar",
      body: "Coloca tres puntos v₁, v₂, v₃ en las esquinas de un triángulo. Elige cualquier posición inicial p₀ en el plano. En cada paso: tira un dado justo de tres caras para elegir un índice i ∈ {1, 2, 3}, después muévete hasta la mitad desde tu posición actual hacia la esquina elegida — pₙ₊₁ = (pₙ + vᵢ) / 2 — y marca pₙ₊₁ como punto. Repite para siempre. Eso es todo el juego del caos: dos ingredientes, tres vértices, un factor de salto fijo de un medio. Sin memoria, sin plan, sin regla global. La imagen se construye sola.",
    },
    {
      pretitle: "Sección 02 · Por qué funciona",
      title: "Puntos fijos de tres aplicaciones contractivas",
      body: "Cada movimiento posible es una función fᵢ(x) = (x + vᵢ) / 2 — una contracción de factor 1/2 hacia el vértice vᵢ. El punto fijo de fᵢ es el propio vᵢ: caminar hasta la mitad hacia un vértice una y otra vez te lleva al vértice. Componer las tres aplicaciones en todos los órdenes posibles genera un conjunto autosemejante: el triángulo de Sierpiński. El juego del caos muestrea ese conjunto con probabilidad uno. Cada paso es una proyección al azar hacia uno de los tres puntos fijos, y como cada aplicación contrae, la influencia de dónde empezaste decae exponencialmente — tras un breve calentamiento tu trayectoria vive enteramente sobre el atractor.",
    },
    {
      pretitle: "Sección 03 · El teorema del collage de Barnsley",
      title: "Todo compacto admite un IFS que converge a él",
      body: 'Michael Barnsley generalizó el juego del caos en 1988 con el teorema del collage: todo subconjunto compacto del plano puede aproximarse arbitrariamente bien por el atractor de algún sistema finito de funciones iteradas. Invierte la pregunta — escoge una forma objetivo, después halla unas pocas aplicaciones afines cuyas imágenes peguen juntas (un "collage") para cubrirla. El atractor de ese IFS es la forma. El juego del caos la muestrea con una sola órbita aleatoria. Costas, helechos, montañas, nubes: todo fractal de la naturaleza es, en principio, unas pocas contracciones disfrazadas.',
    },
    {
      pretitle: "Sección 04 · Más allá del triángulo",
      title: "Cuando halviar falla — y la regla que lo arregla",
      body: 'Prueba cuatro esquinas en un cuadrado con el mismo paso r = 1/2. El resultado no es ningún fractal: los puntos llenan el interior de manera uniforme. La razón es que las cuatro contracciones por la mitad sobre el cuadrado cubren todo el cuadrado — su atractor es el cuadrado lleno. La solución es una regla de restricción. Prohíbe que el siguiente vértice sea igual al anterior ("no repetir") y aparece una delicada prima de la alfombra de Sierpiński. Cada n-gono tiene su factor de salto mágico rₙ = 1 / (1 + 2·cos(π/n)) que da un atractor autosemejante limpio sin restricciones. Para n = 3 es 1/2; para n = 5 es 1/φ² ≈ 0,382; para n = 6, 1/(1 + √3); y así.',
    },
    {
      pretitle: "Sección 05 · El helecho de Barnsley",
      title: "Cuatro aplicaciones afines. Una fotografía de un helecho.",
      body: "Quita los vértices del todo. Elige cuatro transformaciones afines del plano f₁ … f₄ y cuatro probabilidades (0,01, 0,85, 0,07, 0,07). En cada paso, escoge una de las cuatro aplicaciones con esas probabilidades y aplícala a tu punto actual. f₁ — el raro 1 % — colapsa todo sobre el tallo; f₂ — el dominante 85 % — copia el helecho sobre sí mismo, girado y reducido; f₃ y f₄ pelan los foliolos izquierdo y derecho. Tras cien mil iteraciones la nube de puntos es indistinguible de la fotografía de un helecho real. Los números no son mágicos: cambia un coeficiente y el helecho se curva; cambia una probabilidad y los foliolos engordan. La receta es editable.",
    },
    {
      pretitle: "Sección 06 · Más hondo",
      title: "Caos, ergodicidad y la medida SRB",
      body: "El juego del caos es más que un truco de dibujo. La órbita aleatoria es una cadena de Márkov sobre el atractor; la distribución invariante que muestrea — la medida de Hutchinson — es la única medida de probabilidad que se descompone en piezas ponderadas bajo el IFS. En la teoría ergódica suave es hermana de la medida SRB (Sinai–Ruelle–Bowen) sobre un atractor hiperbólico: la medida física que casi toda condición inicial selecciona. La imagen que tienes delante es una muestra finita de una distribución de probabilidad con soporte sobre un fractal de dimensión log 3 / log 2 ≈ 1,585. Geometría, probabilidad y dinámica se citan en una tirada de dado.",
    },
  ],
  liveCaption: "Interactivo · el juego del caos en vivo",
  liveVerticesLabel: "Vértices",
  liveRatioLabel: "Factor de salto r",
  liveNoRepeatLabel: "Regla no-repetir",
  liveMagicLabel: "↺ factor mágico",
  liveResetLabel: "↺ reinicio",
  livePointsLabel: (n) => `${fmt(n)} puntos`,
  fernCaption: "Interactivo · el helecho de Barnsley crece",
  fernPlay: "▶ reproducir",
  fernPause: "⏸ pausa",
  fernReset: "↺ reinicio",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} puntos`,
  dotsSmallLabel: "200 puntos",
  dotsLargeLabel: "5000 puntos",
  closingPretitle: "Ve más lejos",
  closingTitle: "Tira los dados.",
  closingBody:
    "El Explorador deja afinar el número de vértices, el factor de salto, la regla de restricción y el color, y cambiar en un instante al helecho de cuatro aplicaciones. Todo lo que acabas de leer, en tus manos.",
  closingCta: "→ Abrir el Explorador",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Géométrie",
    title: "Le Jeu du Chaos",
    tagline: "Lance un dé, dessine un fractal.",
    intro:
      "Trois points, un dé et un pas court — répète quelques milliers de fois et un triangle de Sierpiński parfait jaillit du hasard pur. L'Explorateur te laisse régler la règle en direct ; ici on raconte l'histoire derrière.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Trois points. Un dé. Un pas de moitié.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Marque trois points sur une feuille — les coins d'un triangle. Pose le crayon n'importe où. Lance un dé à trois faces, marche jusqu'à mi-chemin du coin choisi et fais un point. Traite ce point comme ta nouvelle position et recommence. Après quelques milliers de jets, un triangle de Sierpiński parfait te fixe. De l'ordre, du bruit pur.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: 'Commence n\'importe où dans un triangle équilatéral. À chaque pas : tire au hasard uniforme un des trois coins, déplace-toi à mi-chemin, dépose un point. Au bout de 200 points tu vois un nuage. Au bout de 5000, la dentelle — chaque région "interdite" (le trou central, puis les trois sous-trous, puis neuf sous-sous-trous) est démontrablement vide.',
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "C'est un système de fonctions itérées déguisé. Chaque \"avance à mi-chemin du coin i\" est une contraction du plan ; l'ensemble des points converge vers l'unique attracteur de ces trois applications. Échange les applications et tu obtiens d'autres fractales — la fougère de Barnsley pousse exactement de la même recette, juste quatre applications affines au lieu de trois pas de moitié.",
      },
    ],
    tryIt: "En bas : regarde la règle tourner en direct, puis vois la fougère pousser.",
  },
  sections: [
    {
      pretitle: "Section 01 · La recette minimale",
      title: "Trois sommets, un pas de moitié, un choix au hasard",
      body: "Place trois points v₁, v₂, v₃ aux coins d'un triangle. Choisis une position de départ p₀ dans le plan. À chaque pas : lance un dé équitable à trois faces pour choisir un indice i ∈ {1, 2, 3}, puis déplace-toi à mi-chemin de ta position vers le sommet choisi — pₙ₊₁ = (pₙ + vᵢ) / 2 — et marque pₙ₊₁ comme un point. Recommence sans fin. C'est tout le jeu du chaos : deux ingrédients, trois sommets, un facteur de saut fixé à un demi. Pas de mémoire, pas de plan, pas de règle globale. L'image se bâtit toute seule.",
    },
    {
      pretitle: "Section 02 · Pourquoi ça marche",
      title: "Points fixes de trois applications contractantes",
      body: "Chaque mouvement disponible est une fonction fᵢ(x) = (x + vᵢ) / 2 — une contraction de facteur 1/2 vers le sommet vᵢ. Le point fixe de fᵢ est vᵢ lui-même : marcher à mi-chemin d'un sommet encore et encore te mène au sommet. Composer les trois applications dans tous les ordres possibles engendre un ensemble autosemblable : le triangle de Sierpiński. Le jeu du chaos en échantillonne cet ensemble avec probabilité un. Chaque pas est une projection au hasard vers l'un des trois points fixes, et parce que chaque application contracte, l'influence de ton point de départ décroît exponentiellement — après un court rodage ta trajectoire vit entièrement sur l'attracteur.",
    },
    {
      pretitle: "Section 03 · Le théorème du collage de Barnsley",
      title: "Tout compact admet un IFS qui converge vers lui",
      body: "Michael Barnsley a généralisé le jeu du chaos en 1988 avec le théorème du collage : tout sous-ensemble compact du plan peut être approché arbitrairement bien par l'attracteur d'un système fini d'applications itérées. Renverse la question — choisis une forme cible, puis trouve quelques applications affines dont les images se collent (un \"collage\") pour la couvrir. L'attracteur de cet IFS, c'est la forme. Le jeu du chaos l'échantillonne avec une seule orbite aléatoire. Côtes, fougères, montagnes, nuages : tout fractal de la nature est, en principe, quelques contractions déguisées.",
    },
    {
      pretitle: "Section 04 · Au-delà du triangle",
      title: "Quand la moitié échoue — et la règle qui répare",
      body: "Essaie quatre coins au carré avec le même pas r = 1/2. Le résultat n'est aucun fractal : les points remplissent l'intérieur de façon uniforme. La raison : les quatre applications de moitié sur le carré couvrent le carré entier — leur attracteur, c'est le carré plein. Le remède est une règle de restriction. Interdis que le sommet suivant soit égal au précédent (\"pas de répétition\") et un cousin délicat du tapis de Sierpiński apparaît. Chaque n-gone a son propre facteur de saut magique rₙ = 1 / (1 + 2·cos(π/n)) qui donne un attracteur autosemblable propre sans restriction. Pour n = 3, c'est 1/2 ; pour n = 5, c'est 1/φ² ≈ 0,382 ; pour n = 6, 1/(1 + √3) ; et ainsi de suite.",
    },
    {
      pretitle: "Section 05 · La fougère de Barnsley",
      title: "Quatre applications affines. Une photographie de fougère.",
      body: "Laisse complètement tomber les sommets. Choisis quatre transformations affines du plan f₁ … f₄ et quatre probabilités (0,01, 0,85, 0,07, 0,07). À chaque pas, choisis l'une des quatre applications avec ces probabilités et applique-la à ton point courant. f₁ — le rare 1 % — écrase tout sur la tige ; f₂ — les 85 % dominants — copie la fougère sur elle-même, tournée et rétrécie ; f₃ et f₄ détachent les folioles gauche et droite. Après cent mille itérations le nuage de points est indiscernable d'une photographie de fougère réelle. Les nombres ne sont pas magiques : change un coefficient et la fougère se courbe ; change une probabilité et les folioles s'épaississent. La recette est modifiable.",
    },
    {
      pretitle: "Section 06 · Plus profond",
      title: "Chaos, ergodicité et la mesure SRB",
      body: "Le jeu du chaos est plus qu'une astuce de dessin. L'orbite aléatoire est une chaîne de Markov sur l'attracteur ; la distribution invariante qu'elle échantillonne — la mesure de Hutchinson — est la seule mesure de probabilité qui se décompose en morceaux pondérés sous l'IFS. En théorie ergodique lisse c'est une sœur de la mesure SRB (Sinai–Ruelle–Bowen) sur un attracteur hyperbolique : la mesure physique que presque toute condition initiale sélectionne. L'image devant toi est un échantillon fini d'une distribution de probabilité supportée par un fractal de dimension log 3 / log 2 ≈ 1,585. Géométrie, probabilité et dynamique se croisent dans un jet de dé.",
    },
  ],
  liveCaption: "Interactif · le jeu du chaos en direct",
  liveVerticesLabel: "Sommets",
  liveRatioLabel: "Facteur de saut r",
  liveNoRepeatLabel: "Règle sans répétition",
  liveMagicLabel: "↺ facteur magique",
  liveResetLabel: "↺ réinitialiser",
  livePointsLabel: (n) => `${fmt(n)} points`,
  fernCaption: "Interactif · la fougère de Barnsley pousse",
  fernPlay: "▶ lecture",
  fernPause: "⏸ pause",
  fernReset: "↺ réinitialiser",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} points`,
  dotsSmallLabel: "200 points",
  dotsLargeLabel: "5000 points",
  closingPretitle: "Aller plus loin",
  closingTitle: "Lance les dés.",
  closingBody:
    "L'Explorateur te laisse régler le nombre de sommets, le facteur de saut, la règle de restriction et la couleur — et basculer en un instant sur la fougère de Barnsley à quatre applications. Tout ce que tu viens de lire, entre tes mains.",
  closingCta: "→ Ouvrir l'Explorateur",
};

const it: RichStory = {
  page: {
    pretitle: "Argomento · Geometria",
    title: "Il Gioco del Caos",
    tagline: "Tira un dado, disegna un frattale.",
    intro:
      "Tre punti, un dado e un breve passo: ripeti qualche migliaio di volte e dal puro caso emerge un perfetto triangolo di Sierpiński. L'Esploratore lascia regolare la regola dal vivo; qui raccontiamo la storia dietro.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Tre punti. Un dado. Un passo a metà.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Segna tre punti su un foglio: gli angoli di un triangolo. Appoggia la matita dove vuoi. Ora tira un dado a tre facce, cammina fino a metà strada dall'angolo scelto e fai un punto. Tratta quel punto come la tua nuova posizione e ripeti. Dopo qualche migliaio di tiri un perfetto triangolo di Sierpiński ti fissa. Ordine, dal puro rumore.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: 'Parti da un punto qualsiasi dentro un triangolo equilatero. Ogni passo: scegli uno dei tre angoli uniformemente a caso, spostati a metà strada, lascia un punto. Dopo 200 punti vedi una nube sparsa. Dopo 5000 vedi il triangolino — ogni regione "vietata" (il buco centrale, poi i tre sotto-buchi, poi nove sotto-sotto-buchi) è dimostrabilmente vuota.',
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Questo è un sistema di funzioni iterate travestito. Ogni \"va' a metà verso l'angolo i\" è una contrazione del piano; l'insieme dei punti converge all'unico attrattore di quelle tre mappe. Cambia le mappe e ottieni altri frattali: la felce di Barnsley cresce esattamente dalla stessa ricetta, solo quattro mappe affini invece di tre passi a metà.",
      },
    ],
    tryIt: "Sotto: guarda la regola scorrere dal vivo, poi vedi la felce crescere.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La ricetta minima",
      title: "Tre vertici, un passo a metà, una scelta a caso",
      body: "Posiziona tre punti v₁, v₂, v₃ agli angoli di un triangolo. Scegli una posizione iniziale p₀ qualsiasi nel piano. A ogni passo: tira un dado equo a tre facce per scegliere un indice i ∈ {1, 2, 3}, poi spostati a metà strada dalla tua posizione verso il vertice scelto — pₙ₊₁ = (pₙ + vᵢ) / 2 — e segna pₙ₊₁ come punto. Ripeti per sempre. Questo è tutto il gioco del caos: due ingredienti, tre vertici, un rapporto di salto fisso di un mezzo. Niente memoria, niente piano, niente regola globale. L'immagine si costruisce da sola.",
    },
    {
      pretitle: "Sezione 02 · Perché funziona",
      title: "Punti fissi di tre mappe contrattive",
      body: "Ogni mossa disponibile è una funzione fᵢ(x) = (x + vᵢ) / 2 — una contrazione di fattore 1/2 verso il vertice vᵢ. Il punto fisso di fᵢ è vᵢ stesso: camminare a metà strada verso un vertice ripetutamente ti porta al vertice. Comporre le tre mappe in ogni ordine possibile genera un insieme autosimile: il triangolo di Sierpiński. Il gioco del caos lo campiona con probabilità uno. Ogni passo è una proiezione casuale verso uno dei tre punti fissi, e poiché ogni mappa contrae, l'influenza del punto di partenza decade esponenzialmente — dopo un breve rodaggio la tua traiettoria vive interamente sull'attrattore.",
    },
    {
      pretitle: "Sezione 03 · Il teorema del collage di Barnsley",
      title: "Ogni compatto ammette un IFS che converge a esso",
      body: "Michael Barnsley generalizzò il gioco del caos nel 1988 con il teorema del collage: ogni sottoinsieme compatto del piano può essere approssimato arbitrariamente bene dall'attrattore di un qualche sistema finito di funzioni iterate. Capovolgi la domanda — scegli una forma bersaglio, poi trova poche mappe affini le cui immagini si incollino insieme (un \"collage\") a coprirla. L'attrattore di quell'IFS è la forma. Il gioco del caos lo campiona con una singola orbita casuale. Coste, felci, montagne, nuvole: ogni frattale in natura è, in linea di principio, poche contrazioni travestite.",
    },
    {
      pretitle: "Sezione 04 · Oltre il triangolo",
      title: "Quando dimezzare fallisce — e la regola che lo aggiusta",
      body: "Prova quattro angoli al quadrato con lo stesso passo r = 1/2. Il risultato non è alcun frattale: i punti riempiono l'interno uniformemente. Il motivo è che le quattro mappe di dimezzamento sul quadrato coprono l'intero quadrato — il loro attrattore è il quadrato pieno. La cura è una regola di restrizione. Vieta che il vertice successivo sia uguale al precedente (\"non ripetere\") e appare un delicato cugino del tappeto di Sierpiński. Ogni n-gono ha il proprio rapporto di salto magico rₙ = 1 / (1 + 2·cos(π/n)) che dà un attrattore autosimile pulito senza restrizioni. Per n = 3 è 1/2; per n = 5 è 1/φ² ≈ 0,382; per n = 6, 1/(1 + √3); e così via.",
    },
    {
      pretitle: "Sezione 05 · La felce di Barnsley",
      title: "Quattro mappe affini. Una fotografia di felce.",
      body: "Togli del tutto i vertici. Scegli quattro trasformazioni affini del piano f₁ … f₄ e quattro probabilità (0,01, 0,85, 0,07, 0,07). A ogni passo, scegli una delle quattro mappe con quelle probabilità e applicala al tuo punto corrente. f₁ — l'1 % raro — collassa tutto sul fusto; f₂ — l'85 % dominante — copia la felce su sé stessa, ruotata e rimpicciolita; f₃ e f₄ staccano le pinnule sinistra e destra. Dopo centomila iterazioni la nuvola di punti è indistinguibile dalla fotografia di una felce vera. I numeri non sono magici: cambia un coefficiente e la felce si curva; cambia una probabilità e le pinnule si ispessiscono. La ricetta è modificabile.",
    },
    {
      pretitle: "Sezione 06 · Più a fondo",
      title: "Caos, ergodicità e la misura SRB",
      body: "Il gioco del caos è più di un trucco di disegno. L'orbita casuale è una catena di Markov sull'attrattore; la distribuzione invariante che campiona — la misura di Hutchinson — è l'unica misura di probabilità che si spezza in pezzi pesati sotto l'IFS. Nella teoria ergodica liscia è sorella della misura SRB (Sinai–Ruelle–Bowen) su un attrattore iperbolico: la misura fisica che quasi ogni condizione iniziale individua. L'immagine davanti a te è un campione finito di una distribuzione di probabilità supportata su un frattale di dimensione log 3 / log 2 ≈ 1,585. Geometria, probabilità e dinamica si incontrano in un lancio di dado.",
    },
  ],
  liveCaption: "Interattivo · il gioco del caos dal vivo",
  liveVerticesLabel: "Vertici",
  liveRatioLabel: "Rapporto di salto r",
  liveNoRepeatLabel: "Regola non-ripetere",
  liveMagicLabel: "↺ rapporto magico",
  liveResetLabel: "↺ reset",
  livePointsLabel: (n) => `${fmt(n)} punti`,
  fernCaption: "Interattivo · la felce di Barnsley cresce",
  fernPlay: "▶ avvia",
  fernPause: "⏸ pausa",
  fernReset: "↺ reset",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} punti`,
  dotsSmallLabel: "200 punti",
  dotsLargeLabel: "5000 punti",
  closingPretitle: "Vai oltre",
  closingTitle: "Tira i dadi.",
  closingBody:
    "L'Esploratore ti lascia regolare il numero di vertici, il rapporto di salto, la regola di restrizione e il colore — e passare in un attimo alla felce a quattro mappe di Barnsley. Tutto ciò che hai appena letto, in mano tua.",
  closingCta: "→ Apri l'Esploratore",
};

const pt: RichStory = {
  page: {
    pretitle: "Tópico · Geometria",
    title: "O Jogo do Caos",
    tagline: "Lança um dado, desenha um fractal.",
    intro:
      "Três pontos, um dado e um passo curto — repete uns milhares de vezes e do puro acaso emerge um perfeito triângulo de Sierpiński. O Explorador deixa-te afinar a regra ao vivo; aqui contamos a história por trás.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Três pontos. Um dado. Um passo a meio.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Marca três pontos numa folha — os cantos de um triângulo. Pousa o lápis onde quiseres. Agora lança um dado de três faces, anda até meio do caminho ao canto escolhido e faz um ponto. Trata esse ponto como a tua nova posição e repete. Após uns milhares de lançamentos, um perfeito triângulo de Sierpiński fita-te. Ordem, do puro ruído.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: 'Começa em qualquer ponto dentro de um triângulo equilátero. A cada passo: escolhe uniformemente um dos três cantos, move-te até meio, deixa um ponto. Aos 200 pontos vês uma nuvem dispersa. Aos 5000 vês a junta — toda região "proibida" (o buraco central, depois os três sub-buracos, depois nove sub-sub-buracos) está demonstravelmente vazia.',
      },
      {
        label: "03",
        title: "Porque importa",
        body: 'Isto é um sistema de funções iteradas disfarçado. Cada "vai a meio para o canto i" é uma contração do plano; o conjunto de pontos converge para o único atrator dessas três aplicações. Troca as aplicações e tens outros fractais — o feto de Barnsley cresce exatamente da mesma receita, só que quatro aplicações afins em vez de três passos a meio.',
      },
    ],
    tryIt: "Em baixo: vê a regra correr ao vivo, depois vê o feto crescer.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A receita mínima",
      title: "Três vértices, um passo a meio, uma escolha ao acaso",
      body: "Coloca três pontos v₁, v₂, v₃ nos cantos de um triângulo. Escolhe uma posição inicial p₀ qualquer no plano. A cada passo: lança um dado justo de três faces para escolher um índice i ∈ {1, 2, 3}, depois move-te até meio do caminho da tua posição para o vértice escolhido — pₙ₊₁ = (pₙ + vᵢ) / 2 — e marca pₙ₊₁ como ponto. Repete para sempre. Isto é todo o jogo do caos: dois ingredientes, três vértices, um fator de salto fixo de um meio. Sem memória, sem plano, sem regra global. A imagem constrói-se sozinha.",
    },
    {
      pretitle: "Secção 02 · Porque funciona",
      title: "Pontos fixos de três aplicações contrativas",
      body: "Cada movimento disponível é uma função fᵢ(x) = (x + vᵢ) / 2 — uma contração de fator 1/2 para o vértice vᵢ. O ponto fixo de fᵢ é o próprio vᵢ: caminhar até meio em direção a um vértice repetidamente leva-te ao vértice. Compor as três aplicações em todas as ordens possíveis gera um conjunto auto-semelhante: o triângulo de Sierpiński. O jogo do caos amostra esse conjunto com probabilidade um. Cada passo é uma projeção ao acaso para um dos três pontos fixos, e como cada aplicação contrai, a influência do ponto inicial decai exponencialmente — após um breve aquecimento a tua trajetória vive inteiramente sobre o atrator.",
    },
    {
      pretitle: "Secção 03 · O teorema da colagem de Barnsley",
      title: "Todo compacto admite um IFS que converge para ele",
      body: 'Michael Barnsley generalizou o jogo do caos em 1988 com o teorema da colagem: todo subconjunto compacto do plano pode ser aproximado arbitrariamente bem pelo atrator de algum sistema finito de funções iteradas. Inverte a pergunta — escolhe uma forma alvo, depois acha umas poucas aplicações afins cujas imagens se colem juntas (uma "colagem") a cobri-la. O atrator desse IFS é a forma. O jogo do caos amostra-a com uma única órbita aleatória. Costas, fetos, montanhas, nuvens: todo fractal na natureza é, em princípio, umas poucas contrações disfarçadas.',
    },
    {
      pretitle: "Secção 04 · Para além do triângulo",
      title: "Quando dividir ao meio falha — e a regra que conserta",
      body: 'Tenta quatro cantos num quadrado com o mesmo passo r = 1/2. O resultado não é qualquer fractal: os pontos enchem o interior de forma uniforme. A razão é que as quatro aplicações de meio sobre o quadrado cobrem o quadrado todo — o atrator delas é o quadrado cheio. A cura é uma regra de restrição. Proíbe que o próximo vértice seja igual ao anterior ("não repetir") e aparece um delicado primo do tapete de Sierpiński. Cada n-gono tem o seu fator de salto mágico rₙ = 1 / (1 + 2·cos(π/n)) que dá um atrator auto-semelhante limpo sem restrições. Para n = 3 é 1/2; para n = 5 é 1/φ² ≈ 0,382; para n = 6, 1/(1 + √3); e por aí adiante.',
    },
    {
      pretitle: "Secção 05 · O feto de Barnsley",
      title: "Quatro aplicações afins. Uma fotografia de feto.",
      body: "Tira os vértices todos. Escolhe quatro transformações afins do plano f₁ … f₄ e quatro probabilidades (0,01, 0,85, 0,07, 0,07). A cada passo, escolhe uma das quatro aplicações com essas probabilidades e aplica-a ao teu ponto atual. f₁ — o raro 1 % — colapsa tudo sobre o caule; f₂ — os dominantes 85 % — copia o feto sobre si mesmo, rodado e encolhido; f₃ e f₄ descascam os folíolos esquerdo e direito. Após cem mil iterações a nuvem de pontos é indistinguível de uma fotografia de um feto real. Os números não são mágicos: muda um coeficiente e o feto curva-se; muda uma probabilidade e os folíolos engrossam. A receita é editável.",
    },
    {
      pretitle: "Secção 06 · Mais fundo",
      title: "Caos, ergodicidade e a medida SRB",
      body: "O jogo do caos é mais do que um truque de desenho. A órbita aleatória é uma cadeia de Markov sobre o atrator; a distribuição invariante que ela amostra — a medida de Hutchinson — é a única medida de probabilidade que se decompõe em peças ponderadas sob o IFS. Na teoria ergódica suave é irmã da medida SRB (Sinai–Ruelle–Bowen) sobre um atrator hiperbólico: a medida física que quase toda condição inicial seleciona. A imagem à tua frente é uma amostra finita de uma distribuição de probabilidade com suporte sobre um fractal de dimensão log 3 / log 2 ≈ 1,585. Geometria, probabilidade e dinâmica encontram-se num lançamento de dado.",
    },
  ],
  liveCaption: "Interativo · o jogo do caos ao vivo",
  liveVerticesLabel: "Vértices",
  liveRatioLabel: "Fator de salto r",
  liveNoRepeatLabel: "Regra não-repetir",
  liveMagicLabel: "↺ fator mágico",
  liveResetLabel: "↺ reset",
  livePointsLabel: (n) => `${fmt(n)} pontos`,
  fernCaption: "Interativo · o feto de Barnsley cresce",
  fernPlay: "▶ tocar",
  fernPause: "⏸ pausa",
  fernReset: "↺ reset",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} pontos`,
  dotsSmallLabel: "200 pontos",
  dotsLargeLabel: "5000 pontos",
  closingPretitle: "Vai mais longe",
  closingTitle: "Lança os dados.",
  closingBody:
    "O Explorador deixa-te afinar o número de vértices, o fator de salto, a regra de restrição e a cor — e mudar num instante para o feto de Barnsley de quatro aplicações. Tudo o que acabaste de ler, na tua mão.",
  closingCta: "→ Abrir o Explorador",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "Kaosspelet",
    tagline: "Slå en tärning, rita en fraktal.",
    intro:
      "Tre punkter, en tärning och ett kort steg — upprepa några tusen gånger och ur rent slump dyker en perfekt Sierpiński-triangel upp. Utforskaren låter dig vrida regeln live; här berättar vi historien bakom.",
    ctaInteractive: "→ Öppna Utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Tre punkter. En tärning. Ett halveringssteg.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Markera tre punkter på papperet — hörnen i en triangel. Sätt pennan var som helst. Slå nu en tresidig tärning, gå halvvägs mot det valda hörnet och gör en punkt. Behandla den punkten som din nya position och upprepa. Efter några tusen kast stirrar en perfekt Sierpiński-triangel tillbaka på dig. Ordning, ur rent brus.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: 'Starta var som helst inuti en liksidig triangel. Varje steg: välj likformigt ett av de tre hörnen, gå halvvägs dit, släpp en punkt. Efter 200 punkter ser du ett spritt moln. Efter 5000 ser du gallret — varje "förbjuden" region (mitthålet, sedan de tre underhålen, sedan nio underunderhål) är bevisligen tom.',
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: 'Det här är ett iterativt funktionssystem i förklädnad. Varje "gå halvvägs mot hörn i" är en kontraktion av planet; punktmängden konvergerar mot den enda attraktorn av dessa tre avbildningar. Byt avbildningar och du får andra fraktaler — Barnsleys ormbunke växer ur exakt samma recept, bara fyra affina avbildningar i stället för tre halveringssteg.',
      },
    ],
    tryIt: "Nedan: se regeln rulla live, se sedan ormbunken växa.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Det minimala receptet",
      title: "Tre hörn, ett halveringssteg, ett slumpval",
      body: "Placera tre punkter v₁, v₂, v₃ i hörnen av en triangel. Välj en startposition p₀ var som helst i planet. Vid varje steg: slå en rättvis tresidig tärning för att välja ett index i ∈ {1, 2, 3}, gå sedan halvvägs från din nuvarande position mot det valda hörnet — pₙ₊₁ = (pₙ + vᵢ) / 2 — och markera pₙ₊₁ som en punkt. Upprepa för alltid. Det är hela kaosspelet: två ingredienser, tre hörn, ett fast hoppförhållande på en halv. Inget minne, ingen plan, ingen global regel. Bilden bygger sig själv.",
    },
    {
      pretitle: "Avsnitt 02 · Varför det fungerar",
      title: "Fixpunkter för tre kontraherande avbildningar",
      body: "Varje tillgänglig rörelse är en funktion fᵢ(x) = (x + vᵢ) / 2 — en kontraktion med faktor 1/2 mot hörn vᵢ. Fixpunkten för fᵢ är vᵢ själv: att gå halvvägs mot ett hörn om och om igen tar dig till hörnet. Att komponera de tre avbildningarna i alla möjliga ordningar genererar en självlik mängd: Sierpiński-triangeln. Kaosspelet samplar den mängden med sannolikhet ett. Varje steg är en slumpad projektion mot en av de tre fixpunkterna, och eftersom varje avbildning kontraherar avtar startpunktens inflytande exponentiellt — efter en kort inkörning lever din bana helt på attraktorn.",
    },
    {
      pretitle: "Avsnitt 03 · Barnsleys collage-sats",
      title: "Varje kompakt mängd har ett IFS som konvergerar mot den",
      body: 'Michael Barnsley generaliserade kaosspelet 1988 med collage-satsen: varje kompakt delmängd av planet kan approximeras godtyckligt väl av attraktorn för något ändligt iterativt funktionssystem. Vänd på frågan — välj en målform, hitta sedan några affina avbildningar vars bilder klistras ihop (ett "collage") för att täcka den. Attraktorn för det IFS:et är formen. Kaosspelet samplar den med en enda slumpbana. Kuster, ormbunkar, berg, moln: varje fraktal i naturen är i princip ett par förklädda kontraktioner.',
    },
    {
      pretitle: "Avsnitt 04 · Bortom triangeln",
      title: "När halvering misslyckas — och regeln som lagar",
      body: 'Prova fyra hörn på en kvadrat med samma steg r = 1/2. Resultatet är ingen fraktal alls: punkterna fyller insidan jämnt. Skälet är att de fyra halveringsavbildningarna på kvadraten täcker hela kvadraten — deras attraktor är den fyllda kvadraten. Boten är en begränsningsregel. Förbjud att nästa hörn är samma som föregående ("ingen upprepning") och en delikat kusin till Sierpiński-mattan dyker upp. Varje n-hörning har sitt eget magiska hoppförhållande rₙ = 1 / (1 + 2·cos(π/n)) som ger en ren självlik attraktor utan restriktioner. För n = 3 är det 1/2; för n = 5 är det 1/φ² ≈ 0,382; för n = 6, 1/(1 + √3); och så vidare.',
    },
    {
      pretitle: "Avsnitt 05 · Barnsleys ormbunke",
      title: "Fyra affina avbildningar. Ett fotografi av en ormbunke.",
      body: "Släpp hörnen helt. Välj fyra affina transformationer av planet f₁ … f₄ och fyra sannolikheter (0,01, 0,85, 0,07, 0,07). Vid varje steg, välj en av de fyra avbildningarna med de sannolikheterna och applicera den på din nuvarande punkt. f₁ — den sällsynta 1 % — kollapsar allt på stammen; f₂ — de dominerande 85 % — kopierar ormbunken på sig själv, roterad och krympt; f₃ och f₄ skalar av vänster och höger småblad. Efter hundratusen iterationer är punktmolnet omöjligt att skilja från ett fotografi av en riktig ormbunke. Talen är inte magiska: ändra en koefficient och ormbunken böjs; ändra en sannolikhet och småbladen blir tjockare. Receptet är redigerbart.",
    },
    {
      pretitle: "Avsnitt 06 · Djupare",
      title: "Kaos, ergodicitet och SRB-måttet",
      body: "Kaosspelet är mer än ett rittrick. Slumpbanan är en Markovkedja på attraktorn; den invarianta fördelningen den samplar — Hutchinson-måttet — är det enda sannolikhetsmått som splittras i viktade bitar under IFS:et. I slät ergodteori är det en syster till SRB-måttet (Sinai–Ruelle–Bowen) på en hyperbolisk attraktor: det fysiska mått som nästan varje begynnelsetillstånd plockar ut. Bilden framför dig är ett ändligt stickprov av en sannolikhetsfördelning vars stöd är en fraktal av dimension log 3 / log 2 ≈ 1,585. Geometri, sannolikhet och dynamik möts i ett tärningskast.",
    },
  ],
  liveCaption: "Interaktivt · kaosspelet live",
  liveVerticesLabel: "Hörn",
  liveRatioLabel: "Hoppförhållande r",
  liveNoRepeatLabel: "Ingen-upprepning-regel",
  liveMagicLabel: "↺ magiskt förhållande",
  liveResetLabel: "↺ återställ",
  livePointsLabel: (n) => `${fmt(n)} punkter`,
  fernCaption: "Interaktivt · Barnsleys ormbunke växer",
  fernPlay: "▶ spela",
  fernPause: "⏸ paus",
  fernReset: "↺ återställ",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} punkter`,
  dotsSmallLabel: "200 punkter",
  dotsLargeLabel: "5000 punkter",
  closingPretitle: "Gå vidare",
  closingTitle: "Slå tärningarna.",
  closingBody:
    "Utforskaren låter dig vrida antalet hörn, hoppförhållandet, begränsningsregeln och färgen — och växla på ett ögonblick till Barnsleys ormbunke med fyra avbildningar. Allt du just läst, i din hand.",
  closingCta: "→ Öppna Utforskaren",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "Kaosspillet",
    tagline: "Kast en terning, tegn en fraktal.",
    intro:
      "Tre punkter, en terning og et kort skritt — gjenta noen tusen ganger og fra ren tilfeldighet dukker en perfekt Sierpiński-triangel opp. Utforskeren lar deg skru på regelen live; her forteller vi historien bak.",
    ctaInteractive: "→ Åpne Utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "Tre punkter. En terning. Et halveringssteg.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Marker tre punkter på arket — hjørnene av en triangel. Sett pennen hvor du vil. Kast nå en tresidet terning, gå halvveis mot det valgte hjørnet og lag et punkt. Behandle det punktet som din nye posisjon og gjenta. Etter noen tusen kast stirrer en perfekt Sierpiński-triangel tilbake på deg. Orden, fra ren støy.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: 'Start hvor som helst inne i en likesidig triangel. Hvert skritt: velg likt fordelt ett av de tre hjørnene, gå halvveis dit, slipp et punkt. Etter 200 punkter ser du en spredt sky. Etter 5000 ser du gitteret — hver "forbudte" region (det sentrale hullet, så de tre underhullene, så ni underunderhull) er beviselig tom.',
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: 'Dette er et iterert funksjonssystem i forkledning. Hvert "gå halvveis mot hjørne i" er en kontraksjon av planet; punktmengden konvergerer mot den eneste attraktoren til de tre avbildningene. Bytt ut avbildningene og du får andre fraktaler — Barnsleys bregne vokser fra nøyaktig samme oppskrift, bare fire affine avbildninger i stedet for tre halveringssteg.',
      },
    ],
    tryIt: "Under: se regelen kjøre live, se så bregnen vokse.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den minimale oppskriften",
      title: "Tre hjørner, et halveringssteg, et tilfeldig valg",
      body: "Plasser tre punkter v₁, v₂, v₃ i hjørnene av en triangel. Velg en startposisjon p₀ hvor som helst i planet. Ved hvert skritt: kast en rettferdig tresidet terning for å velge en indeks i ∈ {1, 2, 3}, gå så halvveis fra din nåværende posisjon mot det valgte hjørnet — pₙ₊₁ = (pₙ + vᵢ) / 2 — og marker pₙ₊₁ som et punkt. Gjenta i det uendelige. Det er hele kaosspillet: to ingredienser, tre hjørner, et fast hoppforhold på en halv. Ingen hukommelse, ingen plan, ingen global regel. Bildet bygger seg selv.",
    },
    {
      pretitle: "Avsnitt 02 · Hvorfor det fungerer",
      title: "Fikspunkter for tre kontraherende avbildninger",
      body: "Hvert tilgjengelige trekk er en funksjon fᵢ(x) = (x + vᵢ) / 2 — en kontraksjon med faktor 1/2 mot hjørne vᵢ. Fikspunktet til fᵢ er vᵢ selv: å gå halvveis mot et hjørne om og om igjen tar deg til hjørnet. Å sette sammen de tre avbildningene i alle mulige rekkefølger gir en selvlignende mengde: Sierpiński-triangelen. Kaosspillet samples den mengden med sannsynlighet én. Hvert skritt er en tilfeldig projeksjon mot ett av de tre fikspunktene, og fordi hver avbildning kontraherer, dør innflytelsen fra startpunktet eksponentielt — etter en kort innkjøring lever banen din helt på attraktoren.",
    },
    {
      pretitle: "Avsnitt 03 · Barnsleys collage-teorem",
      title: "Enhver kompakt mengde har et IFS som konvergerer mot den",
      body: 'Michael Barnsley generaliserte kaosspillet i 1988 med collage-teoremet: enhver kompakt delmengde av planet kan tilnærmes vilkårlig godt av attraktoren til et endelig iterert funksjonssystem. Snu spørsmålet — velg en målform, finn så noen få affine avbildninger hvis bilder limes sammen (en "collage") til å dekke den. Attraktoren til det IFS-et er formen. Kaosspillet samples den med én tilfeldig bane. Kystlinjer, bregner, fjell, skyer: enhver fraktal i naturen er i prinsippet noen få forkledde kontraksjoner.',
    },
    {
      pretitle: "Avsnitt 04 · Forbi triangelen",
      title: "Når halvering svikter — og regelen som fikser det",
      body: 'Prøv fire hjørner på et kvadrat med samme steg r = 1/2. Resultatet er ingen fraktal: punktene fyller innsiden jevnt. Grunnen er at de fire halveringsavbildningene på kvadratet dekker hele kvadratet — attraktoren deres er det fylte kvadratet. Boten er en restriksjonsregel. Forby at neste hjørne er likt det forrige ("ingen gjentakelse") og en delikat slektning av Sierpiński-teppet dukker opp. Hver n-kant har sitt eget magiske hoppforhold rₙ = 1 / (1 + 2·cos(π/n)) som gir en ren selvlignende attraktor uten restriksjoner. For n = 3 er det 1/2; for n = 5 er det 1/φ² ≈ 0,382; for n = 6, 1/(1 + √3); og så videre.',
    },
    {
      pretitle: "Avsnitt 05 · Barnsleys bregne",
      title: "Fire affine avbildninger. Et fotografi av en bregne.",
      body: "Slipp hjørnene helt. Velg fire affine transformasjoner av planet f₁ … f₄ og fire sannsynligheter (0,01, 0,85, 0,07, 0,07). Ved hvert skritt, velg én av de fire avbildningene med de sannsynlighetene og bruk den på ditt nåværende punkt. f₁ — de sjeldne 1 % — kollapser alt på stilken; f₂ — de dominerende 85 % — kopierer bregnen på seg selv, rotert og krympet; f₃ og f₄ skreller av venstre og høyre småblad. Etter hundre tusen iterasjoner er punktskyen umulig å skille fra et fotografi av en ekte bregne. Tallene er ikke magiske: endre en koeffisient og bregnen bøyer seg; endre en sannsynlighet og småbladene blir tykkere. Oppskriften er redigerbar.",
    },
    {
      pretitle: "Avsnitt 06 · Dypere",
      title: "Kaos, ergodisitet og SRB-målet",
      body: "Kaosspillet er mer enn et tegnetriks. Den tilfeldige banen er en Markov-kjede på attraktoren; den invariante fordelingen den samples — Hutchinson-målet — er det eneste sannsynlighetsmålet som splittes i vektede biter under IFS-et. I glatt ergodisk teori er det en søster av SRB-målet (Sinai–Ruelle–Bowen) på en hyperbolsk attraktor: det fysiske målet som nesten enhver begynnelsesbetingelse plukker ut. Bildet foran deg er et endelig utvalg av en sannsynlighetsfordeling med støtte på en fraktal av dimensjon log 3 / log 2 ≈ 1,585. Geometri, sannsynlighet og dynamikk møtes i et terningkast.",
    },
  ],
  liveCaption: "Interaktivt · kaosspillet live",
  liveVerticesLabel: "Hjørner",
  liveRatioLabel: "Hoppforhold r",
  liveNoRepeatLabel: "Ingen-gjentakelse-regel",
  liveMagicLabel: "↺ magisk forhold",
  liveResetLabel: "↺ tilbakestill",
  livePointsLabel: (n) => `${fmt(n)} punkter`,
  fernCaption: "Interaktivt · Barnsleys bregne vokser",
  fernPlay: "▶ spill",
  fernPause: "⏸ pause",
  fernReset: "↺ tilbakestill",
  fernFastForward: "⏩ +100k",
  fernPointsLabel: (n) => `${fmt(n)} punkter`,
  dotsSmallLabel: "200 punkter",
  dotsLargeLabel: "5000 punkter",
  closingPretitle: "Gå videre",
  closingTitle: "Kast terningene.",
  closingBody:
    "Utforskeren lar deg skru på antall hjørner, hoppforholdet, restriksjonsregelen og fargen — og bytte i et øyeblikk til Barnsleys bregne med fire avbildninger. Alt du nettopp leste, i hånden din.",
  closingCta: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function ChaosGameStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const heroPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={heroPage}
      ctaHref="/chaosgame/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="p ← (p + vᵢ) / 2"
      formulaLatex={"p_{n+1} = \\dfrac{p_n + v_i}{2}"}
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
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-2">
                        <ChaosDotsSVG count={200} color="rgba(255, 209, 102, 0.85)" />
                        <div className="text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                          {story.dotsSmallLabel}
                        </div>
                      </div>
                      <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-2">
                        <ChaosDotsSVG count={5000} color="rgba(255, 209, 102, 0.7)" />
                        <div className="text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                          {story.dotsLargeLabel}
                        </div>
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

      {/* Section 01 — minimal recipe */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — why it works */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Three contracting maps
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              f₁(x) = (x + v₁)/2 &nbsp;·&nbsp; f₂(x) = (x + v₂)/2 &nbsp;·&nbsp; f₃(x) = (x + v₃)/2
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Each map contracts the plane by factor 1/2 toward its fixed point vᵢ. The attractor of
              the IFS {`{f₁, f₂, f₃}`} is the Sierpiński triangle.
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 · Live chaos game animator */}
      <Reveal>
        <section className="mx-auto mb-32 max-w-5xl">
          <ChaosGameLive
            caption={story.liveCaption}
            verticesLabel={story.liveVerticesLabel}
            ratioLabel={story.liveRatioLabel}
            noRepeatLabel={story.liveNoRepeatLabel}
            magicLabel={story.liveMagicLabel}
            resetLabel={story.liveResetLabel}
            pointsLabel={story.livePointsLabel}
          />
        </section>
      </Reveal>

      {/* Section 03 — Barnsley's collage theorem */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — Beyond triangles */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Magic ratio · rₙ = 1 / (1 + 2·cos(π/n))
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">n</th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">rₙ</th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    shape
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 3, note: "Sierpiński triangle" },
                  { n: 4, note: "1 / (1 + √2)" },
                  { n: 5, note: "1 / φ² (pentagon)" },
                  { n: 6, note: "1 / (1 + √3)" },
                  { n: 7, note: "heptagon" },
                  { n: 8, note: "octagon" },
                ].map(({ n, note }) => {
                  const r = 1 / (1 + 2 * Math.cos(Math.PI / n));
                  return (
                    <tr key={n} className="border-b border-ink-700/30 last:border-0">
                      <td className="px-2 py-2 text-signal-cyan">{n}</td>
                      <td className="px-2 py-2 text-signal-amber">{r.toFixed(4)}</td>
                      <td className="px-2 py-2 text-ink-200">{note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — Barnsley's fern */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · Barnsley fern */}
      <Reveal>
        <section className="mx-auto mb-32 max-w-5xl">
          <ChaosGameBarnsleyFern
            caption={story.fernCaption}
            playLabel={story.fernPlay}
            pauseLabel={story.fernPause}
            resetLabel={story.fernReset}
            fastForwardLabel={story.fernFastForward}
            pointsLabel={story.fernPointsLabel}
          />
        </section>
      </Reveal>

      {/* Section 06 — Deeper */}
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
              Hausdorff dimension
            </div>
            <div className="math-italic text-6xl text-ink-100 md:text-7xl">
              log 3 / log 2 ≈ 1.585
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              The Sierpiński triangle has fractal dimension between a curve (1) and a region (2).
              Three copies, each scaled by 1/2 — the dimension d satisfies 3·(1/2)ᵈ = 1.
            </p>
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
            href="/chaosgame/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.closingCta}
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
