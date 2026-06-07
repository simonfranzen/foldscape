"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { MandelOrbitDemo } from "@/components/MandelOrbitDemo";
import { MandelMini } from "@/components/MandelMini";
import { MandelCDragger } from "@/components/MandelCDragger";
import { Reveal } from "@/components/Reveal";
import { StoryCard } from "@/components/StoryPageShell";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Rich, per-locale story content. The base hero (pretitle/title/tagline/
// intro/CTA) still comes from the shared stories.ts; everything below this
// hero is authored inline so the page can tell a longer story without
// touching the shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  interactive: {
    draggerLabel: string;
    draggerPretitle: string;
    draggerTitle: string;
    draggerBody: string;
    draggerHint: string;
    iterLabel: string;
    iterPretitle: string;
    iterTitle: string;
    iterBody: string;
    iterCaption: (n: number) => string;
  };
  juliaPretitle: string;
  juliaTitle: string;
  juliaBody: string;
  juliaCaptions: { c1: string; c2: string; c3: string };
  zoomLabel: string;
  zoomBody: string;
  bulbsLabel: string;
  bulbsCaptions: { main: string; p2: string; p3: string };
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
  loopLabel: string;
  loopBody1Prefix: string;
  loopBody1Suffix: string;
  loopBody2: string;
  fullSetLabel: string;
  fullSetCaption: string;
  seahorseLabel: string;
  seahorseCaption: string;
  iterSliderNote: string;
  cascadePrefix: string;
  cascadeLogisticLink: string;
  cascadeMiddle: string;
  cascadeCardioidLink: string;
  cascadeSuffix: string;
};

const en: RichStory = {
  encounter: {
    pretitle: "First encounter",
    title: "One rule. One picture. Forever.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Square a number. Add another number. Take the result and square that, add the same number again. Keep going. That single recipe — square, add, repeat — is the entire Mandelbrot set. Everything else is bookkeeping.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Pick c = −0.5. Start at 0. The next values are −0.5, −0.25, −0.4375, −0.309… The sequence settles, never running away. Now pick c = 1. The sequence is 0, 1, 2, 5, 26, 677 — it leaves and never comes back. That tiny yes/no is what colours the picture.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The boundary between yes and no is the most-photographed mathematical object on Earth. Zoom anywhere on it and new shapes appear, never repeating, never simplifying — all from one line of arithmetic that a child could understand.",
      },
    ],
    tryIt: "Below: watch the rule run, drag the dot, and turn the knob yourself.",
  },
  sections: [
    {
      pretitle: "Section 01 · The recipe",
      title: "z₀ = 0, then zₙ₊₁ = zₙ² + c",
      body: "Every point in the picture is a complex number c. For each c we run the same little loop: start at 0, square the current value, add c, and feed the result back in. After a few dozen steps we ask a single question — has the running value flown off to infinity, or is it still hanging around near zero? Black means it stayed. The colours encode how quickly it fled.",
    },
    {
      pretitle: "Section 02 · Bounded vs unbounded",
      title: "Three points, three fates",
      body: "Three c values, three completely different stories. Deep inside the set the orbit converges to a fixed point or a small cycle. Right on the boundary it dances forever, never settling, never escaping — a knife-edge between order and chaos. Just outside, the orbit spirals out and explodes within a handful of steps. Watch them race.",
    },
    {
      pretitle: "Section 03 · The set itself",
      title: "What black means, what colour means",
      body: "Black is the verdict: this c is in the Mandelbrot set, its orbit stays bounded forever. The colour bands outside encode escape time — how many steps the orbit took before the running value crossed the safety radius |z| = 2. Different palettes, different moods, same underlying integer. The picture is, at heart, a contour map.",
    },
    {
      pretitle: "Section 04 · The boundary",
      title: "Fractal at every scale",
      body: "The interior is calm and the exterior is calm; all of the drama lives on the boundary. Shishikura proved in 1998 that this boundary has Hausdorff dimension exactly 2 — it is so wiggly that, in a precise sense, it tries to fill a two-dimensional area despite being a curve. Zoom in by a factor of a billion and you find tiny near-copies of the whole set surrounded by filaments that never repeat. There is genuinely something new at every scale.",
    },
    {
      pretitle: "Section 05 · Bulbs and bulbs on bulbs",
      title: "The cardioid, the discs, the period-q lattice",
      body: "The big heart-shaped lobe in the middle is a cardioid — the same curve traced by a point on a rolling circle. Inside it, the iteration converges to one fixed point. Bolted to the cardioid is a perfect disc where the iteration settles into a 2-cycle, then another disc for a 3-cycle, another for a 5-cycle, and so on. The rational numbers p/q label exactly where each disc attaches. The Mandelbrot set is a directory of every cycle length, sorted geometrically.",
    },
    {
      pretitle: "Section 06 · Julia sets",
      title: "One Julia per c",
      body: "Fix c and run the same iteration zₙ₊₁ = zₙ² + c, but now let the starting point z₀ vary across the whole plane. The points whose orbits stay bounded form the Julia set for that c. There is one Julia set per choice of c — a whole universe per point in the Mandelbrot picture. Pick c inside the set and you get a beautifully connected Julia shape; pick c outside and the Julia set shatters into Cantor dust. The Mandelbrot set is, exactly, the map of which Julia sets are connected.",
    },
  ],
  interactive: {
    draggerLabel: "Drag the dot — pick your c",
    draggerPretitle: "Interactive · drag",
    draggerTitle: "Find the edge with your finger",
    draggerBody:
      "The dim shape behind the canvas hints at the set. Drag the bright yellow dot anywhere — inside the cardioid, into a bulb, off in the void — and watch the orbit decide. Bounded orbits trace a violet web; escaping orbits flash rose, then reset so you can try again.",
    draggerHint: "Try just outside the cardioid's tip — that's where the period-2 bulb attaches.",
    iterLabel: "Turn the iteration knob",
    iterPretitle: "Interactive · slider",
    iterTitle: "How many steps before we call it bounded?",
    iterBody:
      "We can only iterate finitely many times. Stop too early and the boundary looks crude; iterate longer and finer filaments emerge. Drag the slider to feel that trade-off live — every pixel that was 'in' at low iterations may still flee at high ones.",
    iterCaption: (n: number) => `${n} iterations`,
  },
  juliaPretitle: "Section 06 · Julia gallery",
  juliaTitle: "One Julia per c",
  juliaBody:
    "Three values of c, three Julia sets. The first c sits inside the main cardioid — a connected, nearly-circular Julia. The second sits in the period-3 bulb — a shape called Douady's rabbit. The third is just outside the set — the Julia set shatters into disconnected Fatou dust.",
  juliaCaptions: {
    c1: "c = −0.4 + 0.6i · connected",
    c2: "c = −0.123 + 0.745i · the rabbit",
    c3: "c = 0.3 + 0.5i · disconnected",
  },
  zoomLabel: "Zoom ladder · same point, ten times deeper at each step",
  zoomBody:
    "The structure does not simplify. Each step finds new spirals, new mini-Mandelbrots, new filigree.",
  bulbsLabel: "The cardioid + period bulbs",
  bulbsCaptions: {
    main: "main cardioid · period 1",
    p2: "left bulb · period 2",
    p3: "upper bulb · period 3",
  },
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you zoom into the boundary down to 10¹⁰, jump to famous spots, and turn the iteration knob live. Everything you just read is one click away.",
  closingCta: "→ Open the Explorer",
  loopLabel: "the loop · in pseudocode",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " is the safety net: once the running value crosses radius 2, it provably never comes back. That gives us our cheap yes/no test.",
  loopBody2:
    "The number of steps before escape is what becomes the colour. Black means we ran out of steps without escaping.",
  fullSetLabel: "the full set",
  fullSetCaption: "All of c, drawn at modest detail.",
  seahorseLabel: "seahorse valley",
  seahorseCaption: "Zoom 10² into the upper notch — and another universe.",
  iterSliderNote:
    "At low iterations, large stretches near the boundary are mis-classified as \"inside\" the set. Push the slider right and the filaments thin out, revealing what was always there.",
  cascadePrefix: "The same period-doubling cascade you see in the ",
  cascadeLogisticLink: "logistic map",
  cascadeMiddle: " is encoded here as a geometric tree of bulbs. The cardioid itself is the shape covered in detail at ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const de: RichStory = {
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Eine Regel. Ein Bild. Für immer.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Quadriere eine Zahl. Addiere eine andere Zahl. Nimm das Ergebnis, quadriere es, addiere wieder dieselbe Zahl. Mach weiter. Dieses eine Rezept — quadrieren, addieren, wiederholen — ist die gesamte Mandelbrot-Menge. Alles andere ist Buchhaltung.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Wähle c = −0,5. Starte bei 0. Die nächsten Werte sind −0,5, −0,25, −0,4375, −0,309… die Folge beruhigt sich, nichts läuft weg. Jetzt wähle c = 1. Die Folge ist 0, 1, 2, 5, 26, 677 — sie haut ab und kommt nie zurück. Genau dieses winzige Ja/Nein färbt das Bild ein.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Die Grenze zwischen Ja und Nein ist das meistfotografierte mathematische Objekt der Welt. Zoome irgendwo hinein, und neue Formen tauchen auf, ohne sich je zu wiederholen, ohne je einfacher zu werden — alles aus einer einzigen Zeile Arithmetik, die ein Kind verstehen kann.",
      },
    ],
    tryIt: "Unten: sieh der Regel beim Laufen zu, zieh den Punkt, dreh selbst am Knopf.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Das Rezept",
      title: "z₀ = 0, dann zₙ₊₁ = zₙ² + c",
      body: "Jeder Punkt im Bild ist eine komplexe Zahl c. Für jedes c spielen wir dieselbe kleine Schleife durch: starte bei 0, quadriere den aktuellen Wert, addiere c, füttere das Ergebnis zurück. Nach ein paar Dutzend Schritten stellen wir eine einzige Frage — ist der Wert ins Unendliche geflohen, oder hängt er noch in der Nähe der Null? Schwarz heißt, er ist geblieben. Die Farben zeigen, wie schnell er geflüchtet ist.",
    },
    {
      pretitle: "Abschnitt 02 · Beschränkt oder nicht",
      title: "Drei Punkte, drei Schicksale",
      body: "Drei c-Werte, drei völlig verschiedene Geschichten. Tief in der Menge konvergiert die Bahn zu einem Fixpunkt oder kleinen Zyklus. Direkt am Rand tanzt sie ewig, ohne sich je zu setzen oder zu entkommen — eine Messerschneide zwischen Ordnung und Chaos. Knapp außerhalb spiralt die Bahn nach außen und explodiert binnen weniger Schritte. Sieh ihnen beim Rennen zu.",
    },
    {
      pretitle: "Abschnitt 03 · Die Menge selbst",
      title: "Was schwarz bedeutet, was Farbe bedeutet",
      body: "Schwarz ist das Urteil: dieses c gehört zur Mandelbrot-Menge, seine Bahn bleibt für immer beschränkt. Die Farbbänder außen kodieren die Fluchtzeit — wie viele Schritte die Bahn brauchte, bis der laufende Wert den Sicherheitsradius |z| = 2 überschritt. Andere Palette, andere Stimmung, dieselbe Zahl darunter. Das Bild ist im Kern eine Höhenkarte.",
    },
    {
      pretitle: "Abschnitt 04 · Der Rand",
      title: "Fraktal auf jeder Skala",
      body: "Das Innere ist ruhig und das Äußere ist ruhig; das ganze Drama lebt am Rand. Shishikura bewies 1998, dass dieser Rand Hausdorff-Dimension genau 2 hat — er ist so verwinkelt, dass er in präzisem Sinn versucht, eine Fläche auszufüllen, obwohl er eine Kurve ist. Zoome um einen Faktor von einer Milliarde hinein, und du findest winzige Beinahe-Kopien der ganzen Menge, umgeben von Fäden, die sich nie wiederholen. Auf jeder Skala steckt wirklich etwas Neues.",
    },
    {
      pretitle: "Abschnitt 05 · Knospen und Knospen auf Knospen",
      title: "Die Kardioide, die Scheiben, das p/q-Gitter",
      body: "Die große herzförmige Hauptkomponente in der Mitte ist eine Kardioide — dieselbe Kurve, die ein Punkt auf einem rollenden Kreis zeichnet. In ihrem Inneren konvergiert die Iteration zu einem Fixpunkt. An die Kardioide hängt sich eine perfekte Scheibe, in der die Iteration zu einem 2-Zyklus wird, dann eine weitere Scheibe für 3-Zyklen, eine für 5-Zyklen, und so weiter. Die rationalen Zahlen p/q geben an, wo sich jede Scheibe ankoppelt. Die Mandelbrot-Menge ist ein geometrisch sortiertes Verzeichnis aller Zykluslängen.",
    },
    {
      pretitle: "Abschnitt 06 · Julia-Mengen",
      title: "Eine Julia-Menge pro c",
      body: "Halte c fest und lass dieselbe Iteration zₙ₊₁ = zₙ² + c laufen, aber lass jetzt den Startwert z₀ über die ganze Ebene wandern. Die Punkte, deren Bahnen beschränkt bleiben, bilden die Julia-Menge zu diesem c. Eine Julia-Menge pro Wahl von c — ein ganzes Universum pro Punkt im Mandelbrot-Bild. Wähle c innerhalb, und die Julia-Menge ist schön zusammenhängend; wähle c außerhalb, und sie zerfällt zu Cantor-Staub. Die Mandelbrot-Menge ist exakt die Karte, welche Julia-Mengen zusammenhängen.",
    },
  ],
  interactive: {
    draggerLabel: "Zieh den Punkt — wähl dein c",
    draggerPretitle: "Interaktiv · ziehen",
    draggerTitle: "Find den Rand mit dem Finger",
    draggerBody:
      "Die schwache Form hinter der Leinwand deutet die Menge an. Zieh den hellgelben Punkt irgendwohin — in die Kardioide, in eine Knospe, ab in die Leere — und sieh die Bahn entscheiden. Beschränkte Bahnen zeichnen ein violettes Netz; flüchtende Bahnen blitzen rosa und starten neu, damit du es noch einmal versuchen kannst.",
    draggerHint: "Probier knapp außerhalb der Kardioidenspitze — da setzt die Periode-2-Knospe an.",
    iterLabel: "Dreh am Iterations-Regler",
    iterPretitle: "Interaktiv · Schieberegler",
    iterTitle: "Wie viele Schritte, bevor wir beschränkt sagen?",
    iterBody:
      "Wir können nur endlich oft iterieren. Stoppt man zu früh, wirkt der Rand grob; iteriert man länger, treten feinere Fäden hervor. Zieh den Schieber, um den Kompromiss live zu spüren — jeder Pixel, der bei wenigen Iterationen drin war, kann bei vielen noch fliehen.",
    iterCaption: (n: number) => `${n} Iterationen`,
  },
  juliaPretitle: "Abschnitt 06 · Julia-Galerie",
  juliaTitle: "Eine Julia-Menge pro c",
  juliaBody:
    "Drei Werte von c, drei Julia-Mengen. Das erste c liegt im Inneren der Kardioide — eine zusammenhängende, fast kreisförmige Julia. Das zweite liegt in der 3er-Knospe — eine Form namens Douadys Hase. Das dritte liegt knapp außerhalb — die Julia zerfällt in unzusammenhängenden Fatou-Staub.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · zusammenhängend",
    c2: "c = −0,123 + 0,745i · der Hase",
    c3: "c = 0,3 + 0,5i · zerfallen",
  },
  zoomLabel: "Zoom-Leiter · derselbe Punkt, jeweils zehnmal tiefer",
  zoomBody:
    "Die Struktur wird nicht einfacher. Jeder Schritt findet neue Spiralen, neue Mini-Mandelbrots, neues Filigran.",
  bulbsLabel: "Die Kardioide + Perioden-Knospen",
  bulbsCaptions: {
    main: "Hauptkardioide · Periode 1",
    p2: "linke Knospe · Periode 2",
    p3: "obere Knospe · Periode 3",
  },
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich bis 10¹⁰ in den Rand zoomen, zu berühmten Stellen springen und live am Iterationsregler drehen. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  closingCta: "→ Explorer öffnen",
  loopLabel: "die Schleife · in Pseudocode",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " ist das Sicherheitsnetz: sobald der laufende Wert den Radius 2 überschreitet, kommt er nachweislich nie zurück. Das liefert uns den billigen Ja/Nein-Test.",
  loopBody2:
    "Die Zahl der Schritte bis zur Flucht wird zur Farbe. Schwarz bedeutet, dass uns die Schritte ausgegangen sind, ohne dass die Bahn geflohen wäre.",
  fullSetLabel: "die ganze Menge",
  fullSetCaption: "Das gesamte c, in moderater Auflösung gezeichnet.",
  seahorseLabel: "Seepferdchen-Tal",
  seahorseCaption: "Zoome um Faktor 10² in die obere Kerbe — und ein weiteres Universum.",
  iterSliderNote:
    "Bei wenigen Iterationen werden große Bereiche am Rand fälschlich als „drin\" eingestuft. Schiebe den Regler nach rechts, und die Fäden werden dünner — das, was immer schon da war, tritt hervor.",
  cascadePrefix: "Dieselbe Periodenverdopplungs-Kaskade, die du auch in der ",
  cascadeLogisticLink: "logistischen Abbildung",
  cascadeMiddle:
    " siehst, ist hier als geometrischer Knospenbaum kodiert. Die Kardioide selbst wird im Detail behandelt bei ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const es: RichStory = {
  encounter: {
    pretitle: "Primer encuentro",
    title: "Una regla. Una imagen. Para siempre.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Eleva un número al cuadrado. Suma otro número. Toma el resultado, elévalo al cuadrado, suma el mismo número otra vez. Sigue. Esa única receta — cuadrar, sumar, repetir — es todo el conjunto de Mandelbrot. Lo demás es contabilidad.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Toma c = −0,5. Empieza en 0. Los valores siguientes son −0,5, −0,25, −0,4375, −0,309… la sucesión se calma, nada se escapa. Ahora toma c = 1. La sucesión es 0, 1, 2, 5, 26, 677 — se va y no vuelve. Ese diminuto sí/no es lo que colorea la imagen.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La frontera entre el sí y el no es el objeto matemático más fotografiado del planeta. Haz zoom en cualquier parte y aparecen nuevas formas, sin repetirse jamás, sin simplificarse jamás — todo desde una sola línea de aritmética que entendería un niño.",
      },
    ],
    tryIt: "Abajo: mira correr la regla, arrastra el punto, gira tú mismo la perilla.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La receta",
      title: "z₀ = 0, luego zₙ₊₁ = zₙ² + c",
      body: "Cada punto de la imagen es un número complejo c. Para cada c repetimos el mismo bucle: empezar en 0, elevar al cuadrado el valor actual, sumar c, devolver el resultado. Tras unas decenas de pasos hacemos una única pregunta — ¿ha volado el valor al infinito o sigue rondando el cero? Negro significa que se quedó. Los colores codifican lo deprisa que escapó.",
    },
    {
      pretitle: "Sección 02 · Acotado o no",
      title: "Tres puntos, tres destinos",
      body: "Tres valores de c, tres historias completamente distintas. En lo profundo del conjunto la órbita converge a un punto fijo o a un ciclo pequeño. Justo en la frontera baila eternamente, sin asentarse ni escapar — el filo entre orden y caos. Fuera, la órbita espiral hacia afuera y explota en un puñado de pasos. Míralas correr.",
    },
    {
      pretitle: "Sección 03 · El conjunto mismo",
      title: "Qué significa el negro, qué significa el color",
      body: "Negro es el veredicto: este c pertenece al conjunto de Mandelbrot, su órbita queda acotada para siempre. Las bandas de color de fuera codifican el tiempo de escape — cuántos pasos tardó la órbita en cruzar el radio de seguridad |z| = 2. Distintas paletas, distintos ambientes, el mismo entero debajo. La imagen es, en el fondo, un mapa de contornos.",
    },
    {
      pretitle: "Sección 04 · La frontera",
      title: "Fractal a toda escala",
      body: "El interior es tranquilo y el exterior es tranquilo; todo el drama vive en la frontera. Shishikura demostró en 1998 que esta frontera tiene dimensión de Hausdorff exactamente 2 — está tan retorcida que, en un sentido preciso, intenta rellenar un área bidimensional aunque sea una curva. Acércate mil millones de veces y encuentras minicopias del conjunto entero rodeadas de filamentos que nunca se repiten. Hay algo nuevo en cada escala, de verdad.",
    },
    {
      pretitle: "Sección 05 · Bulbos sobre bulbos",
      title: "El cardioide, los discos, la retícula p/q",
      body: "El gran lóbulo con forma de corazón en el centro es un cardioide — la misma curva que dibuja un punto en un círculo que rueda. Dentro, la iteración converge a un punto fijo. Pegado al cardioide hay un disco perfecto donde la iteración cae en un 2-ciclo, luego otro disco para un 3-ciclo, otro para un 5-ciclo, y así. Los racionales p/q etiquetan exactamente dónde se engancha cada disco. El conjunto de Mandelbrot es un índice geométrico de toda longitud de ciclo.",
    },
    {
      pretitle: "Sección 06 · Conjuntos de Julia",
      title: "Un Julia por cada c",
      body: "Fija c y haz correr la misma iteración zₙ₊₁ = zₙ² + c, pero deja ahora que el punto de partida z₀ varíe por todo el plano. Los puntos cuyas órbitas quedan acotadas forman el conjunto de Julia para ese c. Un conjunto de Julia por elección de c — un universo entero por punto en la imagen de Mandelbrot. Elige c dentro y obtienes una Julia bellamente conectada; elige c fuera y se desmenuza en polvo de Cantor. El conjunto de Mandelbrot es, exactamente, el mapa de qué Julias son conexas.",
    },
  ],
  interactive: {
    draggerLabel: "Arrastra el punto — elige tu c",
    draggerPretitle: "Interactivo · arrastrar",
    draggerTitle: "Encuentra el borde con el dedo",
    draggerBody:
      "La forma tenue tras el lienzo sugiere el conjunto. Arrastra el punto amarillo a cualquier sitio — al cardioide, a un bulbo, al vacío — y mira decidir a la órbita. Las órbitas acotadas tejen una telaraña violeta; las que escapan brillan en rosa y se reinician para que vuelvas a probar.",
    draggerHint:
      "Prueba justo fuera de la punta del cardioide — ahí engancha el bulbo de período 2.",
    iterLabel: "Gira la perilla de iteraciones",
    iterPretitle: "Interactivo · deslizador",
    iterTitle: "¿Cuántos pasos antes de declarar acotado?",
    iterBody:
      "Sólo podemos iterar un número finito de veces. Detente pronto y la frontera se ve tosca; itera más y aparecen filamentos más finos. Arrastra el deslizador para sentir esa concesión en vivo — cada píxel que parecía 'dentro' con pocas iteraciones puede huir con muchas.",
    iterCaption: (n: number) => `${n} iteraciones`,
  },
  juliaPretitle: "Sección 06 · Galería de Julia",
  juliaTitle: "Un Julia por cada c",
  juliaBody:
    "Tres valores de c, tres conjuntos de Julia. El primer c está dentro del cardioide principal — una Julia conexa, casi circular. El segundo está en el bulbo de período 3 — una forma llamada el conejo de Douady. El tercero está justo fuera — la Julia se rompe en polvo de Fatou desconectado.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · conexa",
    c2: "c = −0,123 + 0,745i · el conejo",
    c3: "c = 0,3 + 0,5i · desconexa",
  },
  zoomLabel: "Escalera de zoom · mismo punto, diez veces más profundo en cada paso",
  zoomBody:
    "La estructura no se simplifica. Cada paso descubre nuevas espirales, nuevos mini-Mandelbrots, nuevos filigranas.",
  bulbsLabel: "El cardioide + bulbos de período",
  bulbsCaptions: {
    main: "cardioide principal · período 1",
    p2: "bulbo izquierdo · período 2",
    p3: "bulbo superior · período 3",
  },
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te permite acercarte al borde hasta 10¹⁰, saltar a sitios famosos y girar en vivo la perilla de iteraciones. Todo lo que acabas de leer está a un clic.",
  closingCta: "→ Abrir el Explorador",
  loopLabel: "el bucle · en pseudocódigo",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " es la red de seguridad: en cuanto el valor en curso cruza el radio 2, está demostrado que nunca vuelve. Eso nos da el test sí/no más barato.",
  loopBody2:
    "El número de pasos antes de la fuga es lo que se convierte en color. El negro significa que se nos acabaron los pasos sin que escapara.",
  fullSetLabel: "el conjunto completo",
  fullSetCaption: "Todo el c, dibujado a detalle modesto.",
  seahorseLabel: "valle de los caballitos de mar",
  seahorseCaption: "Acércate 10² en la muesca superior — y otro universo.",
  iterSliderNote:
    "Con pocas iteraciones, grandes franjas cerca del borde se clasifican erróneamente como «dentro» del conjunto. Empuja el deslizador a la derecha y los filamentos se afinan, revelando lo que siempre estuvo ahí.",
  cascadePrefix: "La misma cascada de duplicación de período que ves en el ",
  cascadeLogisticLink: "mapa logístico",
  cascadeMiddle:
    " está codificada aquí como un árbol geométrico de bulbos. La cardioide misma es la forma tratada en detalle en ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const fr: RichStory = {
  encounter: {
    pretitle: "Première rencontre",
    title: "Une règle. Une image. Pour toujours.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Élève un nombre au carré. Ajoute un autre nombre. Reprends le résultat, élève-le au carré, ajoute encore le même nombre. Continue. Cette unique recette — carré, somme, répétition — c'est tout l'ensemble de Mandelbrot. Le reste n'est que comptabilité.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Prends c = −0,5. Commence à 0. Les valeurs suivantes sont −0,5, −0,25, −0,4375, −0,309… la suite se calme, rien ne s'évade. Maintenant prends c = 1. La suite est 0, 1, 2, 5, 26, 677 — elle part et ne revient pas. Ce minuscule oui/non est ce qui colore l'image.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "La frontière entre le oui et le non est l'objet mathématique le plus photographié de la planète. Zoome n'importe où et de nouvelles formes apparaissent, sans jamais se répéter, sans jamais se simplifier — tout cela depuis une seule ligne d'arithmétique qu'un enfant pourrait comprendre.",
      },
    ],
    tryIt: "Ci-dessous : regarde la règle tourner, glisse le point, tourne toi-même la molette.",
  },
  sections: [
    {
      pretitle: "Section 01 · La recette",
      title: "z₀ = 0, puis zₙ₊₁ = zₙ² + c",
      body: "Chaque point de l'image est un nombre complexe c. Pour chaque c on rejoue la même petite boucle : partir de 0, élever la valeur courante au carré, ajouter c, réinjecter le résultat. Après quelques dizaines de pas on pose une seule question — la valeur s'est-elle envolée à l'infini, ou rôde-t-elle encore près de zéro ? Le noir signifie qu'elle est restée. Les couleurs encodent la vitesse de fuite.",
    },
    {
      pretitle: "Section 02 · Borné ou non",
      title: "Trois points, trois destins",
      body: "Trois valeurs de c, trois histoires totalement différentes. Au cœur de l'ensemble l'orbite converge vers un point fixe ou un petit cycle. Pile sur la frontière elle danse pour toujours, sans se poser ni s'enfuir — un fil du rasoir entre ordre et chaos. Juste à l'extérieur, l'orbite s'enroule vers le large et explose en quelques pas. Regarde-les courir.",
    },
    {
      pretitle: "Section 03 · L'ensemble lui-même",
      title: "Ce que veut dire le noir, ce que veulent dire les couleurs",
      body: "Le noir, c'est le verdict : ce c appartient à l'ensemble de Mandelbrot, son orbite reste bornée à jamais. Les bandes colorées encodent le temps d'évasion — combien de pas l'orbite a mis avant que la valeur courante ne franchisse le rayon de sécurité |z| = 2. Palettes différentes, ambiances différentes, même entier dessous. L'image est, au fond, une carte de niveaux.",
    },
    {
      pretitle: "Section 04 · La frontière",
      title: "Fractale à toutes les échelles",
      body: "L'intérieur est calme et l'extérieur est calme ; tout le drame vit sur la frontière. Shishikura a démontré en 1998 que cette frontière a une dimension de Hausdorff exactement 2 — elle est si torsadée qu'au sens précis elle tente de remplir une surface tout en restant courbe. Approche-toi d'un facteur d'un milliard et tu trouves de minuscules quasi-copies de l'ensemble entier, entourées de filaments qui ne se répètent jamais. Il y a vraiment du neuf à chaque échelle.",
    },
    {
      pretitle: "Section 05 · Bulbes sur bulbes",
      title: "La cardioïde, les disques, le treillis p/q",
      body: "Le grand lobe en forme de cœur au milieu est une cardioïde — la courbe tracée par un point sur un cercle qui roule. À l'intérieur, l'itération converge vers un point fixe. Accolé à la cardioïde, un disque parfait où l'itération s'installe en 2-cycle, puis un autre disque pour un 3-cycle, un autre pour un 5-cycle, et ainsi de suite. Les rationnels p/q indiquent exactement où chaque disque s'accroche. L'ensemble de Mandelbrot est un répertoire géométrique de toutes les longueurs de cycle.",
    },
    {
      pretitle: "Section 06 · Ensembles de Julia",
      title: "Un Julia par c",
      body: "Fixe c et lance la même itération zₙ₊₁ = zₙ² + c, mais laisse maintenant le point de départ z₀ balayer tout le plan. Les points dont les orbites restent bornées forment l'ensemble de Julia pour ce c. Un ensemble de Julia par choix de c — un univers entier par point de l'image de Mandelbrot. Choisis c à l'intérieur et tu obtiens un Julia magnifiquement connecté ; choisis-le dehors et il se brise en poussière de Cantor. L'ensemble de Mandelbrot est exactement la carte des Julia connexes.",
    },
  ],
  interactive: {
    draggerLabel: "Glisse le point — choisis ton c",
    draggerPretitle: "Interactif · glisser",
    draggerTitle: "Trouve le bord du bout du doigt",
    draggerBody:
      "La forme estompée derrière le canevas évoque l'ensemble. Glisse le point jaune n'importe où — dans la cardioïde, dans un bulbe, dans le vide — et regarde l'orbite trancher. Les orbites bornées tissent une toile violette ; celles qui s'enfuient virent au rose puis repartent, pour que tu retentes.",
    draggerHint:
      "Essaie juste au-delà de la pointe de la cardioïde — c'est là que s'accroche le bulbe de période 2.",
    iterLabel: "Tourne la molette d'itération",
    iterPretitle: "Interactif · curseur",
    iterTitle: "Combien de pas avant de dire « borné » ?",
    iterBody:
      "On ne peut itérer qu'un nombre fini de fois. Arrête-toi trop tôt et la frontière paraît grossière ; itère plus et des filaments plus fins émergent. Glisse le curseur pour sentir le compromis en direct — chaque pixel qui semblait « dedans » à peu d'itérations peut encore s'enfuir à beaucoup.",
    iterCaption: (n: number) => `${n} itérations`,
  },
  juliaPretitle: "Section 06 · Galerie de Julia",
  juliaTitle: "Un Julia par c",
  juliaBody:
    "Trois valeurs de c, trois ensembles de Julia. Le premier c est dans la cardioïde principale — un Julia connexe, presque circulaire. Le deuxième est dans le bulbe de période 3 — la forme dite lapin de Douady. Le troisième est juste à l'extérieur — le Julia se brise en poussière de Fatou disjointe.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · connexe",
    c2: "c = −0,123 + 0,745i · le lapin",
    c3: "c = 0,3 + 0,5i · disjoint",
  },
  zoomLabel: "Échelle de zoom · même point, dix fois plus profond à chaque palier",
  zoomBody:
    "La structure ne se simplifie pas. Chaque palier découvre de nouvelles spirales, de nouveaux mini-Mandelbrots, de nouveaux filigranes.",
  bulbsLabel: "La cardioïde + les bulbes de période",
  bulbsCaptions: {
    main: "cardioïde principale · période 1",
    p2: "bulbe gauche · période 2",
    p3: "bulbe supérieur · période 3",
  },
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te permet de plonger dans la frontière jusqu'à 10¹⁰, de sauter à des points célèbres et de tourner en direct la molette d'itération. Tout ce que tu viens de lire est à un clic.",
  closingCta: "→ Ouvrir l'Explorateur",
  loopLabel: "la boucle · en pseudocode",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " est le filet de sécurité : dès que la valeur courante franchit le rayon 2, on prouve qu'elle ne revient jamais. Cela nous donne notre test oui/non bon marché.",
  loopBody2:
    "Le nombre de pas avant l'évasion devient la couleur. Le noir signifie qu'on a épuisé les pas sans qu'elle s'échappe.",
  fullSetLabel: "l'ensemble complet",
  fullSetCaption: "Tout le c, tracé à un niveau de détail modeste.",
  seahorseLabel: "vallée des hippocampes",
  seahorseCaption: "Zoome de 10² dans l'encoche supérieure — et un autre univers.",
  iterSliderNote:
    "À faible nombre d'itérations, de larges bandes près du bord sont mal classées comme « à l'intérieur » de l'ensemble. Pousse le curseur vers la droite et les filaments s'amincissent, révélant ce qui était toujours là.",
  cascadePrefix: "La même cascade de doublement de période que tu vois dans l'",
  cascadeLogisticLink: "application logistique",
  cascadeMiddle:
    " est encodée ici comme un arbre géométrique de bulbes. La cardioïde elle-même est la forme traitée en détail à ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const it: RichStory = {
  encounter: {
    pretitle: "Primo incontro",
    title: "Una regola. Un'immagine. Per sempre.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Eleva un numero al quadrato. Aggiungi un altro numero. Prendi il risultato, elevalo al quadrato, aggiungi di nuovo lo stesso numero. Continua. Questa unica ricetta — quadrato, somma, ripetere — è l'intero insieme di Mandelbrot. Il resto è contabilità.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Scegli c = −0,5. Parti da 0. I valori successivi sono −0,5, −0,25, −0,4375, −0,309… la successione si placa, niente fugge. Ora prendi c = 1. La successione è 0, 1, 2, 5, 26, 677 — se ne va e non torna. Quel minuscolo sì/no è ciò che colora l'immagine.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Il confine tra il sì e il no è l'oggetto matematico più fotografato del pianeta. Zooma ovunque e compaiono nuove forme, mai uguali, mai più semplici — tutto da una singola riga di aritmetica che capirebbe un bambino.",
      },
    ],
    tryIt: "Sotto: guarda la regola in azione, trascina il punto, gira tu stesso la manopola.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La ricetta",
      title: "z₀ = 0, poi zₙ₊₁ = zₙ² + c",
      body: "Ogni punto dell'immagine è un numero complesso c. Per ciascun c ripetiamo lo stesso piccolo ciclo: partire da 0, elevare al quadrato il valore corrente, sommare c, reimmetterlo. Dopo qualche decina di passi facciamo una sola domanda — il valore è fuggito all'infinito o ronza ancora attorno allo zero? Nero significa che è rimasto. I colori codificano quanto in fretta è scappato.",
    },
    {
      pretitle: "Sezione 02 · Limitato o no",
      title: "Tre punti, tre destini",
      body: "Tre valori di c, tre storie del tutto diverse. Nel cuore dell'insieme l'orbita converge a un punto fisso o a un piccolo ciclo. Proprio sul bordo balla per sempre, senza posarsi né fuggire — un filo del rasoio tra ordine e caos. Appena fuori, l'orbita si avvita verso l'esterno ed esplode in pochi passi. Guardale correre.",
    },
    {
      pretitle: "Sezione 03 · L'insieme stesso",
      title: "Cosa significa il nero, cosa significa il colore",
      body: "Nero è il verdetto: questo c appartiene all'insieme di Mandelbrot, la sua orbita resta limitata per sempre. Le fasce colorate fuori codificano il tempo di fuga — quanti passi ha impiegato l'orbita prima che il valore corrente superasse il raggio di sicurezza |z| = 2. Tavolozze diverse, atmosfere diverse, lo stesso intero sotto. L'immagine è, in fondo, una mappa di livello.",
    },
    {
      pretitle: "Sezione 04 · Il bordo",
      title: "Frattale a ogni scala",
      body: "L'interno è calmo e l'esterno è calmo; tutto il dramma vive sul bordo. Shishikura ha dimostrato nel 1998 che questo bordo ha dimensione di Hausdorff esattamente 2 — è così contorto che, in senso preciso, tenta di riempire un'area pur restando una curva. Ingrandisci di un fattore di un miliardo e trovi minuscole quasi-copie dell'intero insieme circondate da filamenti che non si ripetono mai. C'è davvero qualcosa di nuovo a ogni scala.",
    },
    {
      pretitle: "Sezione 05 · Bulbi su bulbi",
      title: "La cardioide, i dischi, il reticolo p/q",
      body: "Il grande lobo a forma di cuore al centro è una cardioide — la stessa curva tracciata da un punto su un cerchio che rotola. Al suo interno l'iterazione converge a un punto fisso. Attaccato alla cardioide c'è un disco perfetto in cui l'iterazione si assesta in un 2-ciclo, poi un altro disco per un 3-ciclo, un altro per un 5-ciclo, e così via. I razionali p/q indicano esattamente dove ogni disco si aggancia. L'insieme di Mandelbrot è un indice geometrico di tutte le lunghezze di ciclo.",
    },
    {
      pretitle: "Sezione 06 · Insiemi di Julia",
      title: "Un Julia per ogni c",
      body: "Fissa c e fai girare la stessa iterazione zₙ₊₁ = zₙ² + c, ma lascia ora che il punto di partenza z₀ vari su tutto il piano. I punti le cui orbite restano limitate formano l'insieme di Julia per quel c. Un insieme di Julia per ogni scelta di c — un intero universo per ogni punto dell'immagine di Mandelbrot. Scegli c dentro e ottieni un Julia magnificamente connesso; scegli c fuori e si frantuma in polvere di Cantor. L'insieme di Mandelbrot è esattamente la mappa di quali Julia sono connessi.",
    },
  ],
  interactive: {
    draggerLabel: "Trascina il punto — scegli il tuo c",
    draggerPretitle: "Interattivo · trascina",
    draggerTitle: "Trova il bordo con il dito",
    draggerBody:
      "La forma sfocata dietro la tela suggerisce l'insieme. Trascina il punto giallo ovunque — nella cardioide, in un bulbo, nel vuoto — e guarda l'orbita decidere. Le orbite limitate tessono una ragnatela viola; quelle in fuga lampeggiano rosa e ripartono, così puoi riprovare.",
    draggerHint:
      "Prova subito fuori dalla punta della cardioide — è lì che si aggancia il bulbo di periodo 2.",
    iterLabel: "Gira la manopola delle iterazioni",
    iterPretitle: "Interattivo · cursore",
    iterTitle: "Quanti passi prima di chiamarlo limitato?",
    iterBody:
      "Possiamo iterare solo un numero finito di volte. Fermati troppo presto e il bordo appare rozzo; itera più a lungo ed emergono filamenti più fini. Trascina il cursore per sentire dal vivo il compromesso — ogni pixel che sembrava 'dentro' a poche iterazioni può ancora fuggirne a tante.",
    iterCaption: (n: number) => `${n} iterazioni`,
  },
  juliaPretitle: "Sezione 06 · Galleria di Julia",
  juliaTitle: "Un Julia per ogni c",
  juliaBody:
    "Tre valori di c, tre insiemi di Julia. Il primo c sta dentro la cardioide principale — un Julia connesso, quasi circolare. Il secondo sta nel bulbo di periodo 3 — la forma detta coniglio di Douady. Il terzo è appena fuori — il Julia si frantuma in polvere di Fatou disconnessa.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · connesso",
    c2: "c = −0,123 + 0,745i · il coniglio",
    c3: "c = 0,3 + 0,5i · disconnesso",
  },
  zoomLabel: "Scala di zoom · stesso punto, dieci volte più profondo a ogni passo",
  zoomBody:
    "La struttura non si semplifica. Ogni passo scopre nuove spirali, nuovi mini-Mandelbrot, nuovi filigrana.",
  bulbsLabel: "La cardioide + i bulbi di periodo",
  bulbsCaptions: {
    main: "cardioide principale · periodo 1",
    p2: "bulbo sinistro · periodo 2",
    p3: "bulbo superiore · periodo 3",
  },
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia entrare nel bordo fino a 10¹⁰, saltare a punti famosi e girare dal vivo la manopola delle iterazioni. Tutto quello che hai appena letto è a un clic.",
  closingCta: "→ Apri l'Esploratore",
  loopLabel: "il ciclo · in pseudocodice",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " è la rete di sicurezza: appena il valore corrente attraversa il raggio 2, è dimostrato che non torna mai indietro. Questo ci dà il test sì/no a basso costo.",
  loopBody2:
    "Il numero di passi prima della fuga diventa il colore. Il nero significa che abbiamo esaurito i passi senza che la successione scappasse.",
  fullSetLabel: "l'insieme completo",
  fullSetCaption: "Tutto il c, disegnato a dettaglio modesto.",
  seahorseLabel: "valle dei cavallucci marini",
  seahorseCaption: "Zooma 10² nell'incavo superiore — e un altro universo.",
  iterSliderNote:
    "A poche iterazioni, ampi tratti vicino al bordo vengono erroneamente classificati come «dentro» l'insieme. Spingi il cursore a destra e i filamenti si assottigliano, rivelando ciò che era sempre stato lì.",
  cascadePrefix: "La stessa cascata di raddoppio di periodo che vedi nella ",
  cascadeLogisticLink: "mappa logistica",
  cascadeMiddle:
    " è codificata qui come un albero geometrico di bulbi. La cardioide stessa è la forma trattata in dettaglio in ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const pt: RichStory = {
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Uma regra. Uma imagem. Para sempre.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Eleva um número ao quadrado. Soma outro número. Pega no resultado, eleva ao quadrado, soma de novo o mesmo número. Continua. Esta receita única — quadrar, somar, repetir — é todo o conjunto de Mandelbrot. O resto é escrituração.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Escolhe c = −0,5. Começa em 0. Os valores seguintes são −0,5, −0,25, −0,4375, −0,309… a sucessão acalma, nada foge. Agora escolhe c = 1. A sucessão é 0, 1, 2, 5, 26, 677 — vai-se e não volta. Esse minúsculo sim/não é o que pinta a imagem.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A fronteira entre o sim e o não é o objeto matemático mais fotografado do planeta. Faz zoom em qualquer ponto e novas formas aparecem, sem nunca se repetir, sem nunca simplificar — tudo a partir de uma única linha de aritmética que uma criança entenderia.",
      },
    ],
    tryIt: "Abaixo: vê a regra correr, arrasta o ponto, roda tu mesmo o botão.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A receita",
      title: "z₀ = 0, depois zₙ₊₁ = zₙ² + c",
      body: "Cada ponto da imagem é um número complexo c. Para cada c repetimos o mesmo pequeno ciclo: partir de 0, elevar ao quadrado o valor atual, somar c, devolvê-lo. Depois de algumas dezenas de passos fazemos uma única pergunta — o valor fugiu para o infinito, ou ainda anda por perto do zero? Preto significa que ficou. As cores codificam a rapidez com que escapou.",
    },
    {
      pretitle: "Secção 02 · Limitado ou não",
      title: "Três pontos, três destinos",
      body: "Três valores de c, três histórias totalmente diferentes. No fundo do conjunto a órbita converge para um ponto fixo ou para um pequeno ciclo. Mesmo na fronteira dança para sempre, sem assentar nem fugir — o fio da navalha entre ordem e caos. Mesmo fora, a órbita gira para fora e explode em poucos passos. Vê-as correr.",
    },
    {
      pretitle: "Secção 03 · O conjunto em si",
      title: "O que o preto significa, o que a cor significa",
      body: "Preto é o veredicto: este c pertence ao conjunto de Mandelbrot, a sua órbita fica limitada para sempre. As faixas de cor fora codificam o tempo de fuga — quantos passos a órbita demorou até o valor corrente cruzar o raio de segurança |z| = 2. Paletas diferentes, ambientes diferentes, o mesmo inteiro por baixo. A imagem é, no fundo, um mapa de níveis.",
    },
    {
      pretitle: "Secção 04 · A fronteira",
      title: "Fractal a toda a escala",
      body: "O interior é calmo e o exterior é calmo; todo o drama vive na fronteira. Shishikura provou em 1998 que esta fronteira tem dimensão de Hausdorff exatamente 2 — é tão tortuosa que, num sentido preciso, tenta encher uma área apesar de ser uma curva. Aproxima-te um bilião de vezes e encontras minicópias do conjunto inteiro rodeadas de filamentos que nunca se repetem. Há mesmo algo de novo em cada escala.",
    },
    {
      pretitle: "Secção 05 · Bolbos sobre bolbos",
      title: "A cardioide, os discos, a rede p/q",
      body: "O grande lóbulo em forma de coração ao centro é uma cardioide — a mesma curva traçada por um ponto num círculo que rola. Lá dentro, a iteração converge para um ponto fixo. Encostado à cardioide há um disco perfeito onde a iteração assenta num 2-ciclo, depois outro disco para um 3-ciclo, outro para um 5-ciclo, e assim por diante. Os racionais p/q indicam exatamente onde cada disco se prende. O conjunto de Mandelbrot é um índice geométrico de todos os comprimentos de ciclo.",
    },
    {
      pretitle: "Secção 06 · Conjuntos de Julia",
      title: "Um Julia por c",
      body: "Fixa c e corre a mesma iteração zₙ₊₁ = zₙ² + c, mas deixa agora o ponto inicial z₀ varrer todo o plano. Os pontos cujas órbitas ficam limitadas formam o conjunto de Julia para esse c. Um conjunto de Julia por escolha de c — um universo inteiro por ponto da imagem de Mandelbrot. Escolhe c dentro e obténs um Julia maravilhosamente conexo; escolhe-o fora e parte-se em pó de Cantor. O conjunto de Mandelbrot é exatamente o mapa de quais Julia são conexos.",
    },
  ],
  interactive: {
    draggerLabel: "Arrasta o ponto — escolhe o teu c",
    draggerPretitle: "Interativo · arrastar",
    draggerTitle: "Encontra a borda com o dedo",
    draggerBody:
      "A forma esbatida atrás da tela sugere o conjunto. Arrasta o ponto amarelo para onde quiseres — para a cardioide, para um bolbo, para o vazio — e vê a órbita decidir. Órbitas limitadas tecem uma teia violeta; as que escapam piscam rosa e reiniciam, para tentares de novo.",
    draggerHint:
      "Tenta logo a seguir à ponta da cardioide — é aí que se prende o bolbo de período 2.",
    iterLabel: "Roda o botão das iterações",
    iterPretitle: "Interativo · cursor",
    iterTitle: "Quantos passos antes de lhe chamar limitado?",
    iterBody:
      "Só podemos iterar um número finito de vezes. Para cedo demais e a fronteira parece grosseira; itera mais e surgem filamentos mais finos. Arrasta o cursor para sentir o compromisso em direto — cada pixel que estava 'dentro' com poucas iterações ainda pode fugir com muitas.",
    iterCaption: (n: number) => `${n} iterações`,
  },
  juliaPretitle: "Secção 06 · Galeria de Julia",
  juliaTitle: "Um Julia por c",
  juliaBody:
    "Três valores de c, três conjuntos de Julia. O primeiro c está dentro da cardioide principal — um Julia conexo, quase circular. O segundo está no bolbo de período 3 — uma forma chamada coelho de Douady. O terceiro está logo fora — o Julia parte-se em pó de Fatou desconexo.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · conexo",
    c2: "c = −0,123 + 0,745i · o coelho",
    c3: "c = 0,3 + 0,5i · desconexo",
  },
  zoomLabel: "Escada de zoom · mesmo ponto, dez vezes mais fundo a cada passo",
  zoomBody:
    "A estrutura não simplifica. Cada passo descobre novas espirais, novos mini-Mandelbrots, novas filigranas.",
  bulbsLabel: "A cardioide + bolbos de período",
  bulbsCaptions: {
    main: "cardioide principal · período 1",
    p2: "bolbo esquerdo · período 2",
    p3: "bolbo superior · período 3",
  },
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te mergulhar na borda até 10¹⁰, saltar para sítios famosos e rodar em direto o botão das iterações. Tudo o que acabaste de ler está a um clique.",
  closingCta: "→ Abrir o Explorador",
  loopLabel: "o ciclo · em pseudocódigo",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " é a rede de segurança: assim que o valor em curso atravessa o raio 2, prova-se que nunca mais volta. Isso dá-nos o teste sim/não barato.",
  loopBody2:
    "O número de passos antes da fuga é o que se torna cor. Preto significa que esgotámos os passos sem que escapasse.",
  fullSetLabel: "o conjunto completo",
  fullSetCaption: "Todo o c, desenhado com detalhe modesto.",
  seahorseLabel: "vale dos cavalos-marinhos",
  seahorseCaption: "Faz zoom 10² no entalhe superior — e outro universo.",
  iterSliderNote:
    "Com poucas iterações, grandes faixas perto da fronteira são mal classificadas como «dentro» do conjunto. Empurra o cursor para a direita e os filamentos afinam-se, revelando o que sempre lá esteve.",
  cascadePrefix: "A mesma cascata de duplicação de período que vês no ",
  cascadeLogisticLink: "mapa logístico",
  cascadeMiddle:
    " está codificada aqui como uma árvore geométrica de bolbos. A cardioide em si é a forma tratada em detalhe em ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const sv: RichStory = {
  encounter: {
    pretitle: "Första mötet",
    title: "En regel. En bild. För alltid.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Kvadrera ett tal. Lägg till ett annat tal. Ta resultatet, kvadrera det, lägg till samma tal igen. Fortsätt. Det enda receptet — kvadrera, addera, upprepa — är hela Mandelbrotmängden. Resten är bokföring.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Välj c = −0,5. Börja på 0. Nästa värden blir −0,5, −0,25, −0,4375, −0,309… följden lugnar sig, ingenting drar iväg. Välj nu c = 1. Följden blir 0, 1, 2, 5, 26, 677 — den sticker och kommer aldrig tillbaka. Det är detta lilla ja/nej som färgar bilden.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Gränsen mellan ja och nej är det mest fotograferade matematiska objektet på planeten. Zooma in var som helst och nya former dyker upp, aldrig upprepade, aldrig förenklade — allt från en enda rad aritmetik som ett barn skulle förstå.",
      },
    ],
    tryIt: "Nedan: se regeln rulla, dra i punkten, vrid själv på ratten.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Receptet",
      title: "z₀ = 0, sedan zₙ₊₁ = zₙ² + c",
      body: "Varje punkt i bilden är ett komplext tal c. För varje c kör vi samma lilla slinga: börja på 0, kvadrera det aktuella värdet, lägg till c, mata in resultatet igen. Efter några tiotal steg ställer vi en enda fråga — har värdet flugit iväg mot oändligheten, eller hänger det fortfarande kring noll? Svart betyder att det stannade. Färgerna kodar hur snabbt det flydde.",
    },
    {
      pretitle: "Avsnitt 02 · Begränsad eller inte",
      title: "Tre punkter, tre öden",
      body: "Tre värden på c, tre helt olika historier. Djupt inne i mängden konvergerar banan mot en fixpunkt eller en liten cykel. Precis på gränsen dansar den för alltid, varken landar eller flyr — en knivsegg mellan ordning och kaos. Strax utanför virvlar banan utåt och exploderar inom några få steg. Se på när de tävlar.",
    },
    {
      pretitle: "Avsnitt 03 · Själva mängden",
      title: "Vad svart betyder, vad färg betyder",
      body: "Svart är domen: detta c tillhör Mandelbrotmängden, dess bana är begränsad för alltid. Färgbanden utanför kodar flykttiden — hur många steg banan tog innan det löpande värdet passerade säkerhetsradien |z| = 2. Olika paletter, olika stämningar, samma heltal under. Bilden är, i grunden, en nivåkarta.",
    },
    {
      pretitle: "Avsnitt 04 · Gränsen",
      title: "Fraktal på alla skalor",
      body: "Det inre är lugnt och det yttre är lugnt; allt drama bor på gränsen. Shishikura bevisade 1998 att denna gräns har Hausdorffdimension exakt 2 — den är så snårig att den i strikt mening försöker fylla en yta trots att den är en kurva. Zooma in med en faktor en miljard och du hittar minimala nästan-kopior av hela mängden, omgivna av trådar som aldrig upprepas. Det finns verkligen något nytt på varje skala.",
    },
    {
      pretitle: "Avsnitt 05 · Knoppar på knoppar",
      title: "Kardioiden, skivorna, p/q-gittret",
      body: "Den stora hjärtformade loben i mitten är en kardioid — samma kurva som spåras av en punkt på en rullande cirkel. I dess inre konvergerar iterationen mot en fixpunkt. Fastsatt vid kardioiden finns en perfekt skiva där iterationen lägger sig i en 2-cykel, sedan en annan skiva för en 3-cykel, en till för en 5-cykel, och så vidare. De rationella talen p/q anger exakt var varje skiva ansluter. Mandelbrotmängden är ett geometriskt sorterat register över varje cykellängd.",
    },
    {
      pretitle: "Avsnitt 06 · Juliamängder",
      title: "Ett Julia per c",
      body: "Fixera c och kör samma iteration zₙ₊₁ = zₙ² + c, men låt nu startpunkten z₀ variera över hela planet. De punkter vars banor förblir begränsade bildar Juliamängden för det c. En Juliamängd per val av c — ett helt universum per punkt i Mandelbrotbilden. Välj c inuti och du får en vackert sammanhängande Julia; välj c utanför och den faller sönder till Cantorstoff. Mandelbrotmängden är exakt kartan över vilka Julia-mängder som är sammanhängande.",
    },
  ],
  interactive: {
    draggerLabel: "Dra punkten — välj ditt c",
    draggerPretitle: "Interaktivt · dra",
    draggerTitle: "Hitta kanten med fingret",
    draggerBody:
      "Den svaga formen bakom duken antyder mängden. Dra den ljusgula punkten vart du vill — in i kardioiden, in i en knopp, ut i tomheten — och se banan avgöra. Begränsade banor väver ett violett nät; flyende banor blinkar rosa och startar om så du kan försöka igen.",
    draggerHint: "Prova precis utanför kardioidens spets — där fäster periodknopp 2.",
    iterLabel: "Vrid på iterationsratten",
    iterPretitle: "Interaktivt · reglage",
    iterTitle: "Hur många steg innan vi kallar den begränsad?",
    iterBody:
      "Vi kan bara iterera ändligt många gånger. Stannar man för tidigt verkar gränsen grov; itererar man längre framträder finare trådar. Dra i reglaget för att känna kompromissen live — varje pixel som verkade 'inne' vid få iterationer kan fortfarande fly vid många.",
    iterCaption: (n: number) => `${n} iterationer`,
  },
  juliaPretitle: "Avsnitt 06 · Juliagalleri",
  juliaTitle: "Ett Julia per c",
  juliaBody:
    "Tre värden på c, tre Juliamängder. Det första c ligger inuti huvudkardioiden — ett sammanhängande, nästan cirkulärt Julia. Det andra ligger i periodknopp 3 — en form som kallas Douadys kanin. Det tredje ligger precis utanför — Julia faller sönder till osammanhängande Fatoustoft.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · sammanhängande",
    c2: "c = −0,123 + 0,745i · kaninen",
    c3: "c = 0,3 + 0,5i · osammanhängande",
  },
  zoomLabel: "Zoomstege · samma punkt, tio gånger djupare vid varje steg",
  zoomBody:
    "Strukturen förenklas inte. Varje steg hittar nya spiraler, nya mini-Mandelbrots, nya filigraner.",
  bulbsLabel: "Kardioiden + periodknoppar",
  bulbsCaptions: {
    main: "huvudkardioid · period 1",
    p2: "vänster knopp · period 2",
    p3: "övre knopp · period 3",
  },
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig zooma in i gränsen ända ner till 10¹⁰, hoppa till kända ställen och vrida iterationsratten live. Allt du just läst är ett klick bort.",
  closingCta: "→ Öppna Utforskaren",
  loopLabel: "slingan · i pseudokod",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " är skyddsnätet: så snart det pågående värdet korsar radien 2 är det bevisat att det aldrig kommer tillbaka. Det ger oss vårt billiga ja/nej-test.",
  loopBody2:
    "Antalet steg före flykten är vad som blir färgen. Svart betyder att stegen tog slut utan att den flydde.",
  fullSetLabel: "hela mängden",
  fullSetCaption: "Hela c, ritat med måttlig detalj.",
  seahorseLabel: "sjöhästdalen",
  seahorseCaption: "Zooma 10² in i den övre skåran — och ännu ett universum.",
  iterSliderNote:
    "Vid få iterationer felklassas långa sträckor nära kanten som »inuti« mängden. Skjut reglaget åt höger så tunnas filamenten ut och visar det som alltid funnits där.",
  cascadePrefix: "Samma periodfördubblingskaskad som du ser i den ",
  cascadeLogisticLink: "logistiska avbildningen",
  cascadeMiddle:
    " är här kodad som ett geometriskt knoppträd. Själva kardioiden är formen som behandlas i detalj på ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const no: RichStory = {
  encounter: {
    pretitle: "Første møte",
    title: "Én regel. Ett bilde. For alltid.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Kvadrer et tall. Legg til et annet tall. Ta resultatet, kvadrer det, legg til samme tall igjen. Hold på. Den ene oppskriften — kvadrer, legg til, gjenta — er hele Mandelbrotmengden. Resten er bokføring.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Velg c = −0,5. Start på 0. De neste verdiene blir −0,5, −0,25, −0,4375, −0,309… følgen roer seg, ingenting stikker av. Velg nå c = 1. Følgen blir 0, 1, 2, 5, 26, 677 — den drar og kommer aldri tilbake. Det er dette bittelille ja/nei som farger bildet.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Grensen mellom ja og nei er det mest fotograferte matematiske objektet på planeten. Zoom inn hvor som helst og nye former dukker opp, aldri gjentatt, aldri forenklet — alt fra én linje aritmetikk et barn ville forstå.",
      },
    ],
    tryIt: "Under: se regelen kjøre, dra i punktet, vri selv på rattet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppskriften",
      title: "z₀ = 0, så zₙ₊₁ = zₙ² + c",
      body: "Hvert punkt i bildet er et komplekst tall c. For hver c kjører vi samme lille løkke: start på 0, kvadrer gjeldende verdi, legg til c, mat resultatet tilbake. Etter noen titalls steg stiller vi ett enkelt spørsmål — har verdien stukket av mot uendelig, eller henger den fortsatt rundt null? Svart betyr at den ble. Fargene koder hvor raskt den flyktet.",
    },
    {
      pretitle: "Avsnitt 02 · Begrenset eller ikke",
      title: "Tre punkter, tre skjebner",
      body: "Tre verdier av c, tre helt forskjellige historier. Dypt inne i mengden konvergerer banen mot et fastpunkt eller en liten syklus. Rett på grensen danser den for alltid, uten å lande eller flykte — en knivsegg mellom orden og kaos. Like utenfor spiraler banen utover og eksploderer på noen få steg. Se dem løpe.",
    },
    {
      pretitle: "Avsnitt 03 · Mengden selv",
      title: "Hva svart betyr, hva farge betyr",
      body: "Svart er dommen: dette c-et hører til Mandelbrotmengden, banen forblir begrenset for alltid. Fargebåndene utenfor koder fluktstiden — hvor mange steg banen brukte før verdien krysset sikkerhetsradien |z| = 2. Ulike paletter, ulik stemning, samme heltall under. Bildet er i bunn og grunn et høydekart.",
    },
    {
      pretitle: "Avsnitt 04 · Grensen",
      title: "Fraktal på alle skalaer",
      body: "Det indre er rolig og det ytre er rolig; alt dramaet bor på grensen. Shishikura beviste i 1998 at denne grensen har Hausdorff-dimensjon nøyaktig 2 — den er så kronglete at den i streng forstand prøver å fylle et areal selv om den er en kurve. Zoom inn med en faktor på en milliard og du finner bittesmå nær-kopier av hele mengden, omgitt av filamenter som aldri gjentar seg. Det er virkelig noe nytt på hver skala.",
    },
    {
      pretitle: "Avsnitt 05 · Knopper på knopper",
      title: "Kardioiden, skivene, p/q-gitteret",
      body: "Den store hjerteformede loben i midten er en kardioide — samme kurve som tegnes av et punkt på en rullende sirkel. Innenfor konvergerer iterasjonen mot et fastpunkt. Festet til kardioiden er en perfekt skive der iterasjonen legger seg i en 2-syklus, så enda en skive for en 3-syklus, en til for en 5-syklus, og så videre. De rasjonale tallene p/q forteller nøyaktig hvor hver skive fester seg. Mandelbrotmengden er et geometrisk register over hver mulig sykluslengde.",
    },
    {
      pretitle: "Avsnitt 06 · Julia-mengder",
      title: "Én Julia per c",
      body: "Fest c og kjør samme iterasjon zₙ₊₁ = zₙ² + c, men la nå startpunktet z₀ vandre over hele planet. Punktene hvis baner forblir begrenset danner Julia-mengden for det c-et. Én Julia per valg av c — et helt univers per punkt i Mandelbrot-bildet. Velg c innenfor og du får en vakkert sammenhengende Julia; velg c utenfor og den smuldrer til Cantor-støv. Mandelbrotmengden er nøyaktig kartet over hvilke Julia-mengder som er sammenhengende.",
    },
  ],
  interactive: {
    draggerLabel: "Dra punktet — velg ditt c",
    draggerPretitle: "Interaktivt · dra",
    draggerTitle: "Finn kanten med fingeren",
    draggerBody:
      "Den svake formen bak lerretet antyder mengden. Dra det lysegule punktet hvor du vil — inn i kardioiden, inn i en knopp, ut i tomheten — og se banen bestemme seg. Begrensede baner vever et fiolett nett; baner som flykter blinker rosa og starter på nytt, så du kan prøve igjen.",
    draggerHint: "Prøv like utenfor kardioidespissen — der fester periodeknopp 2 seg.",
    iterLabel: "Vri på iterasjonsrattet",
    iterPretitle: "Interaktivt · glidebryter",
    iterTitle: "Hvor mange steg før vi kaller den begrenset?",
    iterBody:
      "Vi kan bare iterere endelig mange ganger. Stopper du for tidlig virker grensen grov; itererer du lengre dukker finere filamenter opp. Dra i glidebryteren for å kjenne kompromisset live — hver piksel som var 'inne' ved få iterasjoner kan likevel flykte ved mange.",
    iterCaption: (n: number) => `${n} iterasjoner`,
  },
  juliaPretitle: "Avsnitt 06 · Julia-galleri",
  juliaTitle: "Én Julia per c",
  juliaBody:
    "Tre verdier av c, tre Julia-mengder. Den første c-en ligger inne i hovedkardioiden — en sammenhengende, nesten sirkulær Julia. Den andre ligger i periodeknopp 3 — formen kalt Douadys kanin. Den tredje ligger like utenfor — Julia smuldrer til frakoblet Fatou-støv.",
  juliaCaptions: {
    c1: "c = −0,4 + 0,6i · sammenhengende",
    c2: "c = −0,123 + 0,745i · kaninen",
    c3: "c = 0,3 + 0,5i · frakoblet",
  },
  zoomLabel: "Zoom-stige · samme punkt, ti ganger dypere ved hvert steg",
  zoomBody:
    "Strukturen forenkles ikke. Hvert steg finner nye spiraler, nye mini-Mandelbroter, nye filigraner.",
  bulbsLabel: "Kardioiden + periodeknopper",
  bulbsCaptions: {
    main: "hovedkardioide · periode 1",
    p2: "venstre knopp · periode 2",
    p3: "øvre knopp · periode 3",
  },
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg zoome ned i grensen helt til 10¹⁰, hoppe til kjente steder og vri iterasjonsrattet live. Alt du nettopp leste er ett klikk unna.",
  closingCta: "→ Åpne Utforskeren",
  loopLabel: "løkka · i pseudokode",
  loopBody1Prefix: "|z| > 2",
  loopBody1Suffix:
    " er sikkerhetsnettet: så snart den løpende verdien krysser radius 2, er det bevist at den aldri kommer tilbake. Det gir oss den billige ja/nei-testen.",
  loopBody2:
    "Antall steg før flukt blir til fargen. Svart betyr at vi gikk tom for steg uten at den flyktet.",
  fullSetLabel: "hele mengden",
  fullSetCaption: "Hele c, tegnet med moderat detaljgrad.",
  seahorseLabel: "sjøhestdalen",
  seahorseCaption: "Zoom 10² inn i det øvre hakket — og enda et univers.",
  iterSliderNote:
    "Ved få iterasjoner blir lange strekninger nær kanten feilklassifisert som «inne i» mengden. Skyv glidebryteren mot høyre, og filamentene tynnes ut og avslører det som alltid var der.",
  cascadePrefix: "Den samme periodedoblingskaskaden du ser i den ",
  cascadeLogisticLink: "logistiske avbildningen",
  cascadeMiddle:
    " er kodet her som et geometrisk knopptre. Selve kardioiden er formen som behandles i detalj på ",
  cascadeCardioidLink: "/cardioid",
  cascadeSuffix: ".",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function MandelbrotStory() {
  const { locale, s, u } = useI18n();
  const page = s.pages.mandelbrot;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  const [iter, setIter] = useState(50);

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-signal-amber/10 via-transparent to-ink-950" />

      {/* Hero — unchanged structure */}
      <section className="mx-auto mb-32 max-w-5xl space-y-7 text-center">
        <Reveal>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
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
              href="/mandelbrot/explorer"
              className="rounded-full border border-signal-amber/70 bg-signal-amber/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/20"
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
            z₀ = 0, zₙ₊₁ = zₙ² + c
          </div>
        </Reveal>
      </section>

      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
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
                        c = −0.5 · 0 → −0.5 → −0.25 → −0.4375 →{" "}
                        <span className="text-signal-amber">bounded</span>
                      </div>
                      <div>
                        c = 1 · 0 → 1 → 2 → 5 → 26 →{" "}
                        <span className="text-signal-rose">escape</span>
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

      {/* Section 01 — the recipe */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0.pretitle}
          title={sec0.title}
          body={sec0.body}
          accent="text-signal-amber"
        />
        <Reveal>
          <div className="hairline grid grid-cols-1 items-center gap-6 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {story.loopLabel}
              </div>
              <pre className="hairline rounded-md border bg-ink-950/60 p-4 font-mono text-xs leading-relaxed text-ink-100">
                {`z = 0
for step in 1..N:
    z = z * z + c
    if |z| > 2:
        return "escaped at " + step
return "bounded"`}
              </pre>
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-ink-200">
              <p>
                <span className="font-mono text-signal-amber">{story.loopBody1Prefix}</span>
                {story.loopBody1Suffix}
              </p>
              <p>{story.loopBody2}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — three fates · orbit demos */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard
          pretitle={sec1.pretitle}
          title={sec1.title}
          body={sec1.body}
          accent="text-signal-amber"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Reveal delay={80}>
            <MandelOrbitDemo
              c={[-0.5, 0]}
              label="inside the set"
              accent="text-signal-cyan"
              maxSteps={80}
              bound={1.6}
              speedMs={140}
            />
          </Reveal>
          <Reveal delay={200}>
            <MandelOrbitDemo
              c={[-0.745, 0.113]}
              label="on the boundary"
              accent="text-signal-violet"
              maxSteps={120}
              bound={1.6}
              speedMs={120}
            />
          </Reveal>
          <Reveal delay={320}>
            <MandelOrbitDemo
              c={[0.4, 0.3]}
              label="outside the set"
              accent="text-signal-rose"
              maxSteps={40}
              bound={2.2}
              speedMs={140}
            />
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE 1 · c-dragger */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {story.interactive.draggerPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.interactive.draggerTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.interactive.draggerBody}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2">
          <Reveal delay={120}>
            <MandelCDragger label={story.interactive.draggerLabel} accent="text-signal-amber" />
          </Reveal>
          <Reveal delay={220}>
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                hint
              </div>
              <p className="text-sm leading-relaxed text-ink-200">
                {story.interactive.draggerHint}
              </p>
              <div className="hairline space-y-1 border-t pt-3 font-mono text-[11px] text-ink-300">
                <div>
                  <span className="text-signal-violet">violet web</span> · orbit bounded
                </div>
                <div>
                  <span className="text-signal-rose">rose flash</span> · orbit escaped
                </div>
                <div>
                  <span className="text-signal-amber">yellow dot</span> · your c
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 03 — the set itself */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard
          pretitle={sec2.pretitle}
          title={sec2.title}
          body={sec2.body}
          accent="text-signal-amber"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Reveal delay={100}>
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {story.fullSetLabel}
              </div>
              <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                <MandelMini
                  center={[-0.6, 0]}
                  scale={1.4}
                  maxIter={160}
                  className="h-full w-full"
                />
              </div>
              <div className="text-xs text-ink-300">{story.fullSetCaption}</div>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
                {story.seahorseLabel}
              </div>
              <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                <MandelMini
                  center={[-0.75, 0.1]}
                  scale={0.05}
                  maxIter={350}
                  className="h-full w-full"
                />
              </div>
              <div className="text-xs text-ink-300">{story.seahorseCaption}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE 2 · iteration slider */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {story.interactive.iterPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.interactive.iterTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.interactive.iterBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline space-y-5 rounded-2xl border bg-ink-950/40 p-6">
            <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2">
              <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                <MandelMini
                  key={iter}
                  center={[-0.745, 0.113]}
                  scale={0.03}
                  maxIter={iter}
                  className="h-full w-full"
                />
              </div>
              <div className="space-y-4">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                  {story.interactive.iterLabel}
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-ink-200">
                  <span>10</span>
                  <span className="text-base text-signal-amber">
                    {story.interactive.iterCaption(iter)}
                  </span>
                  <span>800</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={800}
                  step={5}
                  value={iter}
                  onChange={(e) => setIter(parseInt(e.target.value, 10))}
                  className="w-full accent-signal-amber"
                />
                <p className="text-xs leading-relaxed text-ink-300">{story.iterSliderNote}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — the boundary + deep zoom ladder */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard
          pretitle={sec3.pretitle}
          title={sec3.title}
          body={sec3.body}
          accent="text-signal-amber"
        />
        <Reveal delay={150}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {story.zoomLabel}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                {
                  center: [-0.7436438, 0.1318259] as [number, number],
                  scale: 0.05,
                  iter: 250,
                  label: "10²",
                },
                {
                  center: [-0.7436438, 0.1318259] as [number, number],
                  scale: 0.005,
                  iter: 450,
                  label: "10³",
                },
                {
                  center: [-0.7436438, 0.1318259] as [number, number],
                  scale: 0.0005,
                  iter: 700,
                  label: "10⁴",
                },
                {
                  center: [-0.7436438, 0.1318259] as [number, number],
                  scale: 0.00005,
                  iter: 1100,
                  label: "10⁵",
                },
              ].map((z) => (
                <div key={z.label} className="space-y-1">
                  <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                    <MandelMini
                      center={z.center}
                      scale={z.scale}
                      maxIter={z.iter}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
                    {z.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-ink-300">{story.zoomBody}</div>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — cardioid + bulbs */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard
          pretitle={sec4.pretitle}
          title={sec4.title}
          body={sec4.body}
          accent="text-signal-amber"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {story.bulbsLabel}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                  <MandelMini
                    center={[-0.25, 0]}
                    scale={0.55}
                    maxIter={250}
                    className="h-full w-full"
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-300">
                  {story.bulbsCaptions.main}
                </div>
              </div>
              <div className="space-y-1">
                <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                  <MandelMini
                    center={[-1.0, 0]}
                    scale={0.3}
                    maxIter={300}
                    className="h-full w-full"
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-300">
                  {story.bulbsCaptions.p2}
                </div>
              </div>
              <div className="space-y-1">
                <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
                  <MandelMini
                    center={[-0.125, 0.745]}
                    scale={0.3}
                    maxIter={300}
                    className="h-full w-full"
                  />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-300">
                  {story.bulbsCaptions.p3}
                </div>
              </div>
            </div>
            <div className="text-xs leading-relaxed text-ink-300">
              {story.cascadePrefix}
              <Link
                href="/logistic"
                className="underline decoration-signal-amber/40 hover:text-signal-amber"
              >
                {story.cascadeLogisticLink}
              </Link>
              {story.cascadeMiddle}
              <Link
                href="/cardioid"
                className="underline decoration-signal-amber/40 hover:text-signal-amber"
              >
                {story.cascadeCardioidLink}
              </Link>
              {story.cascadeSuffix}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — Julia sets */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard
          pretitle={sec5.pretitle}
          title={sec5.title}
          body={sec5.body}
          accent="text-signal-amber"
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
              {story.juliaPretitle}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <JuliaPanel c={[-0.4, 0.6]} caption={story.juliaCaptions.c1} />
              <JuliaPanel c={[-0.123, 0.745]} caption={story.juliaCaptions.c2} />
              <JuliaPanel c={[0.3, 0.5]} caption={story.juliaCaptions.c3} />
            </div>
            <div className="text-xs leading-relaxed text-ink-300">{story.juliaBody}</div>
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/mandelbrot/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

// Julia set mini renderer — same iteration as Mandelbrot but z₀ varies and c is fixed.
function JuliaPanel({ c, caption }: { c: [number, number]; caption: string }) {
  return (
    <div className="space-y-1">
      <div className="hairline aspect-square w-full overflow-hidden rounded-md border bg-ink-950">
        <JuliaMini c={c} className="h-full w-full" />
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-300">{caption}</div>
    </div>
  );
}

// Inline Julia renderer. Kept inside this file because no other page needs it.
function JuliaMini({ c, className = "" }: { c: [number, number]; className?: string }) {
  return <JuliaCanvas c={c} className={className} />;
}

function JuliaCanvas({ c, className }: { c: [number, number]; className: string }) {
  const ref = useRefCanvas(c);
  return <canvas ref={ref} className={`block ${className}`} />;
}

// Custom hook: render a Julia set on a canvas. We keep it tiny so the page
// stays responsive — render once on mount + on size changes.
function useRefCanvas(c: [number, number]) {
  const ref = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    let cancelled = false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      if (cancelled) return;
      const targetW = Math.floor(canvas.clientWidth * dpr);
      const targetH = Math.floor(canvas.clientHeight * dpr);
      if (targetW < 4 || targetH < 4) {
        requestAnimationFrame(render);
        return;
      }
      if (canvas.width !== targetW) canvas.width = targetW;
      if (canvas.height !== targetH) canvas.height = targetH;
      const W = canvas.width;
      const H = canvas.height;
      const image = ctx.createImageData(W, H);
      const data = image.data;
      const scale = 1.7;
      const maxIter = 180;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          let zx = ((x - W / 2) / H) * (2 * scale);
          let zy = -((y - H / 2) / H) * (2 * scale);
          let i = 0;
          for (; i < maxIter; i++) {
            const r2 = zx * zx + zy * zy;
            if (r2 > 256) break;
            const nzx = zx * zx - zy * zy + c[0];
            zy = 2 * zx * zy + c[1];
            zx = nzx;
          }
          const idx = (y * W + x) * 4;
          if (i >= maxIter) {
            data[idx] = 8;
            data[idx + 1] = 7;
            data[idx + 2] = 14;
          } else {
            const log_zn = 0.5 * Math.log(zx * zx + zy * zy);
            const nu = Math.log(log_zn / Math.LN2) / Math.LN2;
            const smooth = i + 1 - nu;
            const t = (smooth * 0.05) % 1;
            const r = 0.5 + 0.5 * Math.cos(6.28318 * (0.95 * t + 0.1));
            const g = 0.5 + 0.5 * Math.cos(6.28318 * (0.7 * t + 0.4));
            const b = 0.5 + 0.5 * Math.cos(6.28318 * (0.45 * t + 0.6));
            data[idx] = Math.max(0, Math.min(255, r * 255));
            data[idx + 1] = Math.max(0, Math.min(255, g * 255));
            data[idx + 2] = Math.max(0, Math.min(255, b * 255));
          }
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };
    requestAnimationFrame(render);
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(render);
    });
    ro.observe(canvas);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  };
  return ref;
}
