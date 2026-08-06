"use client";

import Link from "next/link";
import { palette } from "@/lib/visual/palette";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { SierpinskiSubdivision } from "@/components/SierpinskiSubdivision";
import { SierpinskiThreeRoutes } from "@/components/SierpinskiThreeRoutes";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Per-locale story content. Hero copy lives in s.pages.sierpinski; everything
// below the hero is authored here so the shared i18n bundles stay slim.
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
  subdivision: {
    pretitle: string;
    title: string;
    body: string;
    caption: string;
    depthLabel: string;
    triangleLabel: string;
    hint: string;
  };
  threeRoutes: {
    pretitle: string;
    title: string;
    body: string;
    caption: string;
    tabSubdivision: string;
    tabPascal: string;
    tabChaos: string;
    legendSubdivision: string;
    legendPascal: string;
    legendChaos: string;
    footnote: string;
  };
  panels: {
    dimensionLabel: string;
    dimensionCaption: string;
    contractionsLabel: string;
    f1Desc: string;
    f2Desc: string;
    f3Desc: string;
    fixedSet: string;
    routePascalLabel: string;
    routePascalDesc: string;
    routeChaosLabel: string;
    routeChaosDesc: string;
    routeSubdivisionLabel: string;
    routeSubdivisionDesc: string;
    familyLabel: string;
    colName: string;
    colAmbient: string;
    colCopies: string;
    colDimension: string;
    familyRows: Array<{ name: string; ambient: string; copies: string; dim: string }>;
  };
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// English ----------------------------------------------------------------
const enStory: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "The Sierpiński Triangle",
    tagline: "One fractal. Three roads in.",
    intro:
      "Recursion, arithmetic, and a random walk all converge on the same triangular gasket. Each route is a different mathematics — and each one draws the same picture in the limit.",
    ctaInteractive: "→ Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "One triangle inside itself, forever.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "A triangle, but every time you look closer you see three smaller copies of it tucked into the corners — and inside each of those, three smaller copies again, infinitely down. The astonishing part is that three completely different recipes — folding paper, counting Pascal's triangle, rolling a die — all draw the same shape.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Start with one solid triangle. Find the midpoints of its three sides; that splits it into four little triangles. Throw away the middle one. Now do the same to the three survivors. After just five steps you can already see the gasket — by step ten it's unmistakable.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The same shape arrives from (1) recursive subdivision, (2) Pascal's triangle with even cells erased, and (3) the random Chaos Game where you keep jumping halfway towards one of three corners. Three unrelated processes, one inevitable answer: the structure is built into the geometry itself.",
      },
    ],
    tryIt: "Slide the depth knob below, then watch all three routes meet in the gasket.",
  },
  sections: [
    {
      pretitle: "Section 01 · The classical construction",
      title: "Remove the centre, then recurse",
      body: "Take an equilateral triangle. Connect the midpoints of its three sides — this slices it into four congruent smaller triangles, three pointing up and one pointing down. Erase the down-pointing one. Now you have three little triangles in the corners. Apply the same rule to each of them: connect midpoints, erase the central inverted triangle, keep the corners. Repeat. Each iteration multiplies the number of pieces by three and shrinks each piece to half its previous edge length. In the limit the leftover set has Lebesgue area zero, and yet it stays connected, self-similar at every scale, an uncountable perfect set with no isolated points. That limit set is the Sierpiński triangle.",
    },
    {
      pretitle: "Section 02 · The fractal dimension",
      title: "log 3 / log 2 ≈ 1.585",
      body: "How many copies of yourself fit inside you, at what scale? Three copies, each at half the linear size. The similarity dimension solves N = (1/r)^d, giving d = log 3 / log 2 ≈ 1.585. The Sierpiński triangle is strictly more than a curve and strictly less than a region: a true intermediate object. Its Hausdorff dimension and box-counting dimension coincide at this value, which is why the gasket is one of the cleanest concrete examples in a first lecture on fractal geometry.",
    },
    {
      pretitle: "Section 03 · Self-similarity at every scale",
      title: "Three copies of itself, each at half size",
      body: "The gasket S satisfies a single set-equation: S = f₁(S) ∪ f₂(S) ∪ f₃(S), where f₁, f₂, f₃ are the contraction maps that send the whole triangle into each of its three corners with ratio 1/2. Any point in S is the image of some point in S under one of these three maps — and that point, in turn, is the image of another point in S, forever. The triangle isn't merely approximately self-similar; it is the unique non-empty compact fixed set of this three-map iterated function system. Hutchinson's 1981 theorem guarantees such a set exists and is unique.",
    },
    {
      pretitle: "Section 04 · Three roads to the same gasket",
      title: "Recursion · arithmetic · randomness",
      body: "Route one is the deterministic subdivision above. Route two is arithmetic: write out Pascal's triangle and colour every odd entry, leaving the even ones blank. By Lucas's theorem, C(n, k) is odd exactly when the binary digits of k are a subset of the binary digits of n — and that combinatorial condition, drawn as a triangle, is the gasket. Route three is the random Chaos Game: drop a point anywhere, then repeatedly pick one of the three corners at random and jump halfway towards it; after a few hundred jumps the dots condense into the same shape. Recursion, divisibility, randomness — visit /pascalmod and /chaosgame to play the last two by hand.",
    },
    {
      pretitle: "Section 05 · Connections",
      title: "Carpet · sponge · dust",
      body: "Run the same recipe with a square divided into nine, keeping eight and erasing the centre: you get the Sierpiński carpet, dimension log 8 / log 3 ≈ 1.893. Run it again in three dimensions with a cube split into twenty-seven, keeping twenty and erasing the centre of each face plus the cube's central cell: Menger's sponge, dimension log 20 / log 3 ≈ 2.727. Run it in one dimension with a line split into three, keeping the outer two and erasing the middle third: Cantor dust. The whole family — dust, gasket, carpet, sponge — sits inside the same construction, just at different ambient dimensions.",
    },
    {
      pretitle: "Section 06 · Mathematical history",
      title: "Sierpiński 1915 and the rise of Polish set theory",
      body: "Wacław Sierpiński published the triangle in 1915, working in Lwów (now Lviv) against the backdrop of an emerging Polish school of set theory and point-set topology that he, Janiszewski and Mazurkiewicz would soon institutionalise around the Warsaw journal Fundamenta Mathematicae. Sierpiński himself contributed the carpet in 1916; Karl Menger generalised the construction to three dimensions in 1926. (The famous Lwów school around Banach, Steinhaus, Mazur and Ulam at the Scottish Café came later, through the 1920s and 1930s.) The pattern itself, however, is far older: thirteenth-century Cosmatesque marble floors in Roman churches already carry recognisable Sierpiński gaskets, cut three or four iterations deep. The mathematics formalised what the masons had been laying out for seven centuries.",
    },
  ],
  subdivision: {
    pretitle: "Interactive · the recursive picture",
    title: "Slide the depth — watch the gasket emerge",
    body: "Each step replaces every solid triangle with three smaller copies — corner, corner, corner — and removes the central inverted triangle. The count of surviving triangles grows as 3ⁿ; the total area shrinks as (3/4)ⁿ. By depth 5 the gasket is clearly visible; by depth 7 the individual pieces are too fine to resolve.",
    caption: "Interactive · subdivision visualiser",
    depthLabel: "Depth",
    triangleLabel: "Triangles",
    hint: "At depth n there are 3ⁿ filled triangles. The total area is (3/4)ⁿ of the original, tending to zero, yet the limit set, the gasket, keeps empty interior and stays self-similar at every scale.",
  },
  threeRoutes: {
    pretitle: "Interactive · three routes, one shape",
    title: "Recursion, arithmetic, randomness — same gasket",
    body: "Three completely different procedures, side by side. The subdivision route follows the geometric recipe. The Pascal route colours every odd binomial coefficient C(n, k). The Chaos Game route picks a triangle vertex at random and jumps halfway — a dot at a time. Watch the random walk fill in the same triangular silhouette as the deterministic two.",
    caption: "Interactive · three routes comparator",
    tabSubdivision: "Subdivision · depth 6",
    tabPascal: "Pascal mod 2 · 64 rows",
    tabChaos: "Chaos game · live",
    legendSubdivision:
      "Geometric recursion: keep the three corner triangles, erase the central one. Three copies at half size — the IFS in pictures.",
    legendPascal:
      "Lucas's theorem in colour: C(n, k) is odd iff the bits of k fit inside the bits of n. The pattern of odd cells is the gasket.",
    legendChaos:
      "Pick a vertex at random, jump halfway towards it, mark the spot. A few hundred dots are already enough for the silhouette.",
    footnote:
      "Three unrelated recipes — geometric, combinatorial, stochastic — settle on the same compact set. That set is the unique fixed point of the three-map IFS.",
  },
  panels: {
    dimensionLabel: "Hausdorff dimension",
    dimensionCaption:
      "Strictly between a curve (dim 1) and a region (dim 2). The same value is the box-counting dimension, so the gasket is dimensionally well-behaved.",
    contractionsLabel: "The three contractions",
    f1Desc: "towards the bottom-left vertex",
    f2Desc: "towards the bottom-right vertex",
    f3Desc: "towards the top vertex",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), the unique non-empty compact fixed set.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ See the arithmetic route in full",
    routeChaosLabel: "Chaos Game",
    routeChaosDesc: "→ Play the random walk yourself",
    routeSubdivisionLabel: "Subdivision",
    routeSubdivisionDesc: "→ Recursive construction, deep",
    familyLabel: "The family",
    colName: "name",
    colAmbient: "ambient",
    colCopies: "copies / scale",
    colDimension: "dimension",
    familyRows: [
      { name: "Cantor dust", ambient: "1D", copies: "2 copies at 1/3", dim: "log 2 / log 3 ≈ 0.631" },
      {
        name: "Sierpiński triangle",
        ambient: "2D",
        copies: "3 copies at 1/2",
        dim: "log 3 / log 2 ≈ 1.585",
      },
      {
        name: "Sierpiński carpet",
        ambient: "2D",
        copies: "8 copies at 1/3",
        dim: "log 8 / log 3 ≈ 1.893",
      },
      {
        name: "Menger sponge",
        ambient: "3D",
        copies: "20 copies at 1/3",
        dim: "log 20 / log 3 ≈ 2.727",
      },
    ],
  },
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you push subdivision deeper, run the Chaos Game on the triangle, switch the colour and step through all four constructions, subdivision, chaos game, Pascal mod 2 and Rule 90, one at a time. Everything you just read is one click away.",
  ctaLabel: "→ Open the Explorer",
};

// German -----------------------------------------------------------------
const deStory: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "Das Sierpiński-Dreieck",
    tagline: "Ein Fraktal. Drei Wege hinein.",
    intro:
      "Rekursion, Arithmetik und eine zufällige Wanderung treffen sich in derselben dreieckigen Packung. Jeder Weg ist eine andere Mathematik — und jeder zeichnet im Grenzwert dasselbe Bild.",
    ctaInteractive: "→ Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Ein Dreieck in sich selbst, für immer.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Ein Dreieck — und sobald du näher hinsiehst, stecken in jeder Ecke drei kleinere Kopien davon. In jeder dieser Kopien wieder drei kleinere, unendlich weit nach unten. Das Erstaunliche: drei völlig verschiedene Rezepte — Papier falten, Pascals Dreieck zählen, Würfel rollen — zeichnen dieselbe Figur.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Beginn mit einem vollen Dreieck. Verbinde die Mittelpunkte seiner drei Seiten; das zerlegt es in vier kleinere Dreiecke. Wirf das mittlere weg. Tu dasselbe mit den drei übrig gebliebenen. Nach fünf Schritten ist die Packung schon sichtbar — nach zehn unverkennbar.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Dieselbe Form entsteht aus (1) rekursiver Unterteilung, (2) Pascals Dreieck, in dem die geraden Zellen ausgelöscht werden, und (3) dem zufälligen Chaosspiel, bei dem du immer halb auf eine von drei Ecken zu springst. Drei zusammenhanglose Prozesse, eine unausweichliche Antwort: die Struktur steckt in der Geometrie selbst.",
      },
    ],
    tryIt: "Schieb unten am Tiefen-Regler — sieh, wie alle drei Wege sich in der Packung treffen.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die klassische Konstruktion",
      title: "Mitte raus, dann rekursiv weiter",
      body: "Nimm ein gleichseitiges Dreieck. Verbinde die Mittelpunkte seiner drei Seiten — das zerschneidet es in vier deckungsgleiche kleinere Dreiecke, drei zeigen nach oben, eines nach unten. Lösch das nach unten gerichtete. Übrig bleiben drei kleine Dreiecke in den Ecken. Wende auf jedes dieselbe Regel an: Mittelpunkte verbinden, das zentrale umgekehrte Dreieck löschen, die Ecken behalten. Wiederhole. Jede Iteration verdreifacht die Anzahl der Teile und halbiert die Kantenlänge. Im Grenzwert hat die übrig gebliebene Menge Lebesgue-Maß null, ist aber trotzdem zusammenhängend, auf jeder Skala selbstähnlich, eine überabzählbare perfekte Menge ohne isolierte Punkte. Dieser Grenzwert ist das Sierpiński-Dreieck.",
    },
    {
      pretitle: "Abschnitt 02 · Die fraktale Dimension",
      title: "log 3 / log 2 ≈ 1,585",
      body: "Wie viele Kopien seiner selbst stecken in dir, mit welchem Maßstab? Drei Kopien, jede auf der halben Kantenlänge. Die Ähnlichkeitsdimension löst N = (1/r)^d und ergibt d = log 3 / log 2 ≈ 1,585. Das Sierpiński-Dreieck ist echt mehr als eine Kurve und echt weniger als eine Fläche: ein Zwischenobjekt im strengen Sinn. Hausdorff- und Boxdimension fallen hier zusammen — deshalb ist die Packung eines der saubersten konkreten Beispiele in einer ersten Vorlesung über fraktale Geometrie.",
    },
    {
      pretitle: "Abschnitt 03 · Selbstähnlichkeit auf jeder Skala",
      title: "Drei Kopien, jede halb so groß",
      body: "Die Packung S erfüllt eine einzige Mengengleichung: S = f₁(S) ∪ f₂(S) ∪ f₃(S), wobei f₁, f₂, f₃ die Kontraktionen sind, die das ganze Dreieck mit Faktor 1/2 in seine drei Ecken legen. Jeder Punkt in S ist das Bild eines anderen Punktes in S unter einer der drei Abbildungen — und der ist wiederum das Bild eines weiteren, für immer. Das Dreieck ist nicht nur ungefähr selbstähnlich; es ist die eindeutige nichtleere kompakte Fixmenge dieses Dreier-IFS. Hutchinsons Satz von 1981 garantiert Existenz und Eindeutigkeit.",
    },
    {
      pretitle: "Abschnitt 04 · Drei Wege zur selben Packung",
      title: "Rekursion · Arithmetik · Zufall",
      body: "Weg eins ist die deterministische Unterteilung oben. Weg zwei ist Arithmetik: schreib Pascals Dreieck aus und färb alle ungeraden Einträge ein, lass die geraden weiß. Nach dem Satz von Lucas ist C(n, k) genau dann ungerade, wenn die Binärziffern von k Teilmenge der Binärziffern von n sind — und diese kombinatorische Bedingung, als Dreieck gezeichnet, ist die Packung. Weg drei ist das zufällige Chaosspiel: setz irgendwo einen Punkt, wähl dann immer wieder zufällig eine der drei Ecken und spring auf halbem Weg dorthin; nach wenigen hundert Sprüngen verdichten sich die Punkte zur selben Figur. Rekursion, Teilbarkeit, Zufall — auf /pascalmod und /chaosgame kannst du die letzten beiden selbst durchspielen.",
    },
    {
      pretitle: "Abschnitt 05 · Verwandte",
      title: "Teppich · Schwamm · Staub",
      body: "Lass dieselbe Vorschrift auf einem Quadrat laufen, das in neun zerlegt wird, behalt acht und lösch die Mitte: der Sierpiński-Teppich, Dimension log 8 / log 3 ≈ 1,893. Lauf sie dreidimensional, mit einem Würfel in 27 Teile, behalt 20 und lösch die Mittelseiten und die zentrale Zelle: der Menger-Schwamm, Dimension log 20 / log 3 ≈ 2,727. Eindimensional, mit einer Strecke in drei Teile, behalt die äußeren und lösch das mittlere Drittel: Cantor-Staub. Die ganze Familie — Staub, Packung, Teppich, Schwamm — sitzt in derselben Konstruktion, nur in unterschiedlichen Umgebungsdimensionen.",
    },
    {
      pretitle: "Abschnitt 06 · Mathematische Geschichte",
      title: "Sierpiński 1915 und die aufkommende polnische Mengenlehre",
      body: "Wacław Sierpiński publizierte das Dreieck 1915 in Lemberg (heute Lwiw), vor dem Hintergrund einer aufkommenden polnischen Schule für Mengenlehre und Punktmengen-Topologie, die er, Janiszewski und Mazurkiewicz wenig später um die Warschauer Zeitschrift Fundamenta Mathematicae herum institutionalisieren sollten. 1916 folgte Sierpińskis Teppich; 1926 verallgemeinerte Karl Menger die Konstruktion ins Räumliche. (Die berühmte Lemberger Schule um Banach, Steinhaus, Mazur und Ulam im Café Szkocka kam erst später — in den 1920ern und 1930ern.) Das Muster selbst ist jedoch viel älter: kosmateske Marmorböden des 13. Jahrhunderts in römischen Kirchen tragen schon klar erkennbare Sierpiński-Packungen, drei oder vier Iterationen tief geschnitten. Die Mathematik formalisierte, was die Steinmetze seit sieben Jahrhunderten verlegt hatten.",
    },
  ],
  subdivision: {
    pretitle: "Interaktiv · das rekursive Bild",
    title: "Tiefe schieben — sieh die Packung entstehen",
    body: "Jeder Schritt ersetzt jedes volle Dreieck durch drei kleinere Kopien — Ecke, Ecke, Ecke — und löscht das zentrale umgekehrte Dreieck. Die Anzahl der überlebenden Dreiecke wächst wie 3ⁿ, die Gesamtfläche schrumpft wie (3/4)ⁿ. Bei Tiefe 5 ist die Packung deutlich zu sehen; bei Tiefe 7 sind die Einzelteile zu fein, um sie noch aufzulösen.",
    caption: "Interaktiv · Unterteilungs-Visualisierer",
    depthLabel: "Tiefe",
    triangleLabel: "Dreiecke",
    hint: "Bei Tiefe n gibt es 3ⁿ ausgefüllte Dreiecke. Die Gesamtfläche ist (3/4)ⁿ der ursprünglichen, geht gegen null, die Grenzmenge hat trotzdem leeres Inneres und bleibt auf jeder Skala selbstähnlich.",
  },
  threeRoutes: {
    pretitle: "Interaktiv · drei Wege, eine Form",
    title: "Rekursion, Arithmetik, Zufall — dieselbe Packung",
    body: "Drei völlig verschiedene Verfahren, nebeneinander. Der Unterteilungsweg folgt dem geometrischen Rezept. Der Pascal-Weg färbt jeden ungeraden Binomialkoeffizienten C(n, k) ein. Das Chaosspiel wählt eine Dreieckspitze zufällig und springt halbwegs — Punkt für Punkt. Schau zu, wie die zufällige Wanderung dieselbe Silhouette füllt wie die beiden deterministischen.",
    caption: "Interaktiv · Vergleich der drei Wege",
    tabSubdivision: "Unterteilung · Tiefe 6",
    tabPascal: "Pascal mod 2 · 64 Zeilen",
    tabChaos: "Chaosspiel · live",
    legendSubdivision:
      "Geometrische Rekursion: die drei Eckdreiecke bleiben, das mittlere wird gelöscht. Drei Kopien zur Hälfte — das IFS in Bildern.",
    legendPascal:
      "Satz von Lucas in Farbe: C(n, k) ist ungerade gdw. die Bits von k in den Bits von n stecken. Das Muster der Ungeraden ist die Packung.",
    legendChaos:
      "Zufällig eine Ecke wählen, halb hinspringen, markieren. Ein paar hundert Punkte reichen für die Silhouette.",
    footnote:
      "Drei zusammenhanglose Rezepte — geometrisch, kombinatorisch, stochastisch — landen auf derselben kompakten Menge. Sie ist der eindeutige Fixpunkt des Dreier-IFS.",
  },
  panels: {
    dimensionLabel: "Hausdorff-Dimension",
    dimensionCaption:
      "Echt zwischen einer Kurve (Dim 1) und einer Fläche (Dim 2). Derselbe Wert ist die Boxdimension, die Packung ist also dimensionsmäßig gutartig.",
    contractionsLabel: "Die drei Kontraktionen",
    f1Desc: "zur Ecke unten links",
    f2Desc: "zur Ecke unten rechts",
    f3Desc: "zur oberen Ecke",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), die eindeutige nichtleere kompakte Fixmenge.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Den arithmetischen Weg ganz sehen",
    routeChaosLabel: "Chaosspiel",
    routeChaosDesc: "→ Die Zufallswanderung selbst spielen",
    routeSubdivisionLabel: "Unterteilung",
    routeSubdivisionDesc: "→ Rekursive Konstruktion, tief",
    familyLabel: "Die Familie",
    colName: "Name",
    colAmbient: "Umgebung",
    colCopies: "Kopien / Skala",
    colDimension: "Dimension",
    familyRows: [
      { name: "Cantor-Staub", ambient: "1D", copies: "2 Kopien bei 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "Sierpiński-Dreieck",
        ambient: "2D",
        copies: "3 Kopien bei 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "Sierpiński-Teppich",
        ambient: "2D",
        copies: "8 Kopien bei 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "Menger-Schwamm",
        ambient: "3D",
        copies: "20 Kopien bei 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich die Unterteilung tiefer treiben, das Chaosspiel auf dem Dreieck laufen lassen, die Farbe wechseln und alle vier Konstruktionen, Unterteilung, Chaosspiel, Pascal mod 2 und Regel 90, nacheinander durchspielen. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  ctaLabel: "→ Explorer öffnen",
};

// Spanish ----------------------------------------------------------------
const esStory: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "El Triángulo de Sierpiński",
    tagline: "Un fractal. Tres caminos para llegar.",
    intro:
      "Recursión, aritmética y un paseo aleatorio convergen en el mismo enrejado triangular. Cada camino es una matemática distinta — y en el límite todos dibujan la misma figura.",
    ctaInteractive: "→ Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Un triángulo dentro de sí mismo, para siempre.",
    cards: [
      {
        label: "01",
        title: "La idea central",
        body: "Un triángulo — y en cuanto miras más cerca, en cada esquina hay tres copias más pequeñas, y dentro de cada una otras tres, hasta el infinito. Lo asombroso: tres recetas completamente distintas — doblar papel, contar en el triángulo de Pascal, lanzar un dado — dibujan exactamente la misma figura.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Empieza con un triángulo sólido. Une los puntos medios de sus tres lados; eso lo parte en cuatro triángulos pequeños. Tira el del medio. Haz lo mismo con los tres supervivientes. Tras cinco pasos ya ves la trama — en diez es inconfundible.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La misma figura aparece desde (1) subdivisión recursiva, (2) el triángulo de Pascal con las casillas pares borradas, y (3) el Juego del Caos aleatorio donde saltas a mitad de camino hacia una de las tres esquinas. Tres procesos sin relación, una misma respuesta inevitable: la estructura vive en la propia geometría.",
      },
    ],
    tryIt:
      "Mueve abajo el control de profundidad y observa cómo los tres caminos se encuentran en la trama.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La construcción clásica",
      title: "Quita el centro, luego recursión",
      body: "Toma un triángulo equilátero. Une los puntos medios de sus tres lados — eso lo parte en cuatro triángulos pequeños congruentes, tres apuntando arriba y uno hacia abajo. Borra el de abajo. Te quedan tres triangulitos en las esquinas. Aplica la misma regla a cada uno: une puntos medios, borra el central invertido, conserva las esquinas. Repite. Cada iteración triplica el número de piezas y reduce el lado a la mitad. En el límite el conjunto restante tiene medida de Lebesgue cero, y aun así es conexo, autosemejante en toda escala, un conjunto perfecto no numerable sin puntos aislados. Ese límite es el triángulo de Sierpiński.",
    },
    {
      pretitle: "Sección 02 · La dimensión fractal",
      title: "log 3 / log 2 ≈ 1,585",
      body: "¿Cuántas copias de ti mismo caben dentro de ti, y a qué escala? Tres copias, cada una al medio del tamaño lineal. La dimensión de similitud resuelve N = (1/r)^d y da d = log 3 / log 2 ≈ 1,585. El triángulo de Sierpiński es estrictamente más que una curva y estrictamente menos que una región: un objeto intermedio. Las dimensiones de Hausdorff y de conteo por cajas coinciden aquí, por eso la trama es uno de los ejemplos concretos más limpios en una primera clase de geometría fractal.",
    },
    {
      pretitle: "Sección 03 · Autosemejanza en toda escala",
      title: "Tres copias de sí mismo, cada una a la mitad",
      body: "El conjunto S cumple una sola ecuación de conjuntos: S = f₁(S) ∪ f₂(S) ∪ f₃(S), donde f₁, f₂, f₃ son las contracciones que mandan el triángulo entero a cada una de sus tres esquinas con razón 1/2. Cada punto de S es la imagen de algún otro punto de S por una de las tres aplicaciones — y ese punto, a su vez, es la imagen de otro, para siempre. El triángulo no es solo aproximadamente autosemejante; es el único conjunto fijo compacto no vacío de este IFS de tres mapas. El teorema de Hutchinson (1981) garantiza la existencia y la unicidad.",
    },
    {
      pretitle: "Sección 04 · Tres caminos a la misma trama",
      title: "Recursión · aritmética · azar",
      body: "Camino uno es la subdivisión determinista de arriba. Camino dos es aritmética: escribe el triángulo de Pascal y colorea cada entrada impar, deja en blanco las pares. Por el teorema de Lucas, C(n, k) es impar exactamente cuando los dígitos binarios de k son subconjunto de los de n — y esa condición combinatoria, dibujada como un triángulo, es la trama. Camino tres es el Juego del Caos aleatorio: pon un punto donde sea, luego elige una de las tres esquinas al azar y salta a mitad de camino; tras unos cientos de saltos los puntos se condensan en la misma figura. Recursión, divisibilidad, azar — en /pascalmod y /chaosgame puedes jugar los dos últimos a mano.",
    },
    {
      pretitle: "Sección 05 · Conexiones",
      title: "Alfombra · esponja · polvo",
      body: "Aplica la misma receta a un cuadrado dividido en nueve, conserva ocho y borra el centro: la alfombra de Sierpiński, dimensión log 8 / log 3 ≈ 1,893. Aplícala en tres dimensiones con un cubo dividido en veintisiete, conserva veinte y borra el centro de cada cara y el centro del cubo: la esponja de Menger, dimensión log 20 / log 3 ≈ 2,727. Aplícala en una dimensión con un segmento dividido en tres, conserva los dos exteriores y borra el tercio central: el polvo de Cantor. Toda la familia — polvo, trama, alfombra, esponja — vive dentro de la misma construcción, solo a dimensiones ambiente distintas.",
    },
    {
      pretitle: "Sección 06 · Historia matemática",
      title: "Sierpiński 1915 y el surgimiento de la teoría polaca de conjuntos",
      body: "Wacław Sierpiński publicó el triángulo en 1915 trabajando en Lwów (hoy Lviv), con el telón de fondo de una escuela polaca emergente de teoría de conjuntos y topología de conjuntos de puntos que él, Janiszewski y Mazurkiewicz institucionalizarían poco después en torno a la revista varsoviana Fundamenta Mathematicae. El propio Sierpiński aportó la alfombra en 1916; Karl Menger generalizó la construcción al espacio en 1926. (La famosa escuela de Lwów en torno a Banach, Steinhaus, Mazur y Ulam en el Café Escocés llegó más tarde — durante los años 1920 y 1930.) El patrón, sin embargo, es mucho más antiguo: los suelos cosmatescos de mármol del siglo XIII en iglesias romanas ya llevan tramas de Sierpiński reconocibles, cortadas tres o cuatro iteraciones de profundidad. Las matemáticas formalizaron lo que los canteros llevaban siete siglos colocando.",
    },
  ],
  subdivision: {
    pretitle: "Interactivo · la imagen recursiva",
    title: "Desliza la profundidad — mira nacer la trama",
    body: "Cada paso reemplaza cada triángulo sólido por tres copias más pequeñas — esquina, esquina, esquina — y borra el triángulo central invertido. El número de triángulos supervivientes crece como 3ⁿ; el área total mengua como (3/4)ⁿ. A profundidad 5 la trama es claramente visible; a 7 las piezas individuales son demasiado finas para resolverlas.",
    caption: "Interactivo · visualizador de subdivisión",
    depthLabel: "Profundidad",
    triangleLabel: "Triángulos",
    hint: "A profundidad n hay 3ⁿ triángulos llenos. El área total es (3/4)ⁿ de la original, tiende a cero, pero el conjunto límite, la trama, tiene interior vacío y sigue siendo autosemejante en toda escala.",
  },
  threeRoutes: {
    pretitle: "Interactivo · tres caminos, una forma",
    title: "Recursión, aritmética, azar — la misma trama",
    body: "Tres procedimientos completamente distintos, lado a lado. La subdivisión sigue la receta geométrica. Pascal colorea cada coeficiente binomial C(n, k) impar. El Juego del Caos elige al azar un vértice del triángulo y salta a mitad de camino — punto a punto. Mira cómo el paseo aleatorio rellena la misma silueta triangular que las dos rutas deterministas.",
    caption: "Interactivo · comparador de tres rutas",
    tabSubdivision: "Subdivisión · profundidad 6",
    tabPascal: "Pascal mod 2 · 64 filas",
    tabChaos: "Juego del Caos · en vivo",
    legendSubdivision:
      "Recursión geométrica: conserva los tres triángulos de las esquinas, borra el central. Tres copias a la mitad — el IFS en imágenes.",
    legendPascal:
      "El teorema de Lucas a color: C(n, k) es impar sii los bits de k caben en los bits de n. El patrón de las impares es la trama.",
    legendChaos:
      "Elige un vértice al azar, salta a mitad de camino, marca el punto. Unos cuantos cientos de puntos bastan para la silueta.",
    footnote:
      "Tres recetas sin relación — geométrica, combinatoria, estocástica — aterrizan en el mismo conjunto compacto. Ese conjunto es el único punto fijo del IFS de tres mapas.",
  },
  panels: {
    dimensionLabel: "Dimensión de Hausdorff",
    dimensionCaption:
      "Estrictamente entre una curva (dim 1) y una región (dim 2). El mismo valor es la dimensión de conteo por cajas, así que la trama se comporta bien dimensionalmente.",
    contractionsLabel: "Las tres contracciones",
    f1Desc: "hacia el vértice inferior izquierdo",
    f2Desc: "hacia el vértice inferior derecho",
    f3Desc: "hacia el vértice superior",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), el único conjunto fijo compacto no vacío.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Ver la ruta aritmética completa",
    routeChaosLabel: "Juego del Caos",
    routeChaosDesc: "→ Juega tú mismo el paseo aleatorio",
    routeSubdivisionLabel: "Subdivisión",
    routeSubdivisionDesc: "→ Construcción recursiva, profunda",
    familyLabel: "La familia",
    colName: "nombre",
    colAmbient: "ambiente",
    colCopies: "copias / escala",
    colDimension: "dimensión",
    familyRows: [
      { name: "polvo de Cantor", ambient: "1D", copies: "2 copias a 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "triángulo de Sierpiński",
        ambient: "2D",
        copies: "3 copias a 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "alfombra de Sierpiński",
        ambient: "2D",
        copies: "8 copias a 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "esponja de Menger",
        ambient: "3D",
        copies: "20 copias a 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja empujar la subdivisión más hondo, correr el Juego del Caos sobre el triángulo, cambiar el color y recorrer las cuatro construcciones, subdivisión, Juego del Caos, Pascal mod 2 y Regla 90, una a una. Todo lo que acabas de leer está a un clic.",
  ctaLabel: "→ Abrir el Explorador",
};

// French -----------------------------------------------------------------
const frStory: RichStory = {
  page: {
    pretitle: "Sujet · Géométrie",
    title: "Le Triangle de Sierpiński",
    tagline: "Une seule fractale. Trois chemins pour y arriver.",
    intro:
      "La récursion, l'arithmétique et une marche aléatoire convergent vers le même tamis triangulaire. Chaque chemin est une mathématique différente — et à la limite chacun dessine la même figure.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Un triangle dans lui-même, pour toujours.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Un triangle — et dès que tu regardes plus près, dans chaque coin trois copies plus petites, et dans chacune encore trois, indéfiniment. Le plus étonnant : trois recettes complètement différentes — plier du papier, compter dans le triangle de Pascal, lancer un dé — dessinent exactement la même figure.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Commence par un triangle plein. Relie les milieux de ses trois côtés ; cela le découpe en quatre petits triangles. Jette celui du milieu. Refais pareil sur les trois survivants. Après cinq étapes le tamis est déjà visible — à dix, indubitable.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "La même figure naît de (1) la subdivision récursive, (2) le triangle de Pascal avec les cases paires effacées et (3) le Jeu du Chaos aléatoire où l'on saute à mi-chemin vers l'un des trois coins. Trois procédés sans rapport, une même réponse inévitable : la structure est inscrite dans la géométrie elle-même.",
      },
    ],
    tryIt:
      "Fais glisser le curseur de profondeur ci-dessous, regarde les trois chemins se rejoindre dans le tamis.",
  },
  sections: [
    {
      pretitle: "Section 01 · La construction classique",
      title: "Enlève le centre, puis récursion",
      body: "Prends un triangle équilatéral. Relie les milieux de ses trois côtés — cela le découpe en quatre petits triangles congrus, trois pointant vers le haut et un vers le bas. Efface celui qui pointe vers le bas. Il reste trois petits triangles dans les coins. Applique la même règle à chacun : relier les milieux, effacer le triangle central inversé, garder les coins. Recommence. Chaque itération triple le nombre de morceaux et divise leur côté par deux. À la limite l'ensemble restant a mesure de Lebesgue nulle, et reste pourtant connexe, autosimilaire à toute échelle, un ensemble parfait non dénombrable sans points isolés. Cette limite, c'est le triangle de Sierpiński.",
    },
    {
      pretitle: "Section 02 · La dimension fractale",
      title: "log 3 / log 2 ≈ 1,585",
      body: "Combien de copies de toi-même tiennent dans toi, et à quelle échelle ? Trois copies, chacune à la moitié de la taille linéaire. La dimension de similarité résout N = (1/r)^d et donne d = log 3 / log 2 ≈ 1,585. Le triangle de Sierpiński est strictement plus qu'une courbe et strictement moins qu'une région : un objet intermédiaire au sens strict. Les dimensions de Hausdorff et de boîte coïncident sur cette valeur — c'est pourquoi le tamis est l'un des exemples concrets les plus propres d'un premier cours de géométrie fractale.",
    },
    {
      pretitle: "Section 03 · Autosimilarité à toute échelle",
      title: "Trois copies de soi, chacune à moitié",
      body: "Le tamis S vérifie une seule équation ensembliste : S = f₁(S) ∪ f₂(S) ∪ f₃(S), où f₁, f₂, f₃ sont les contractions qui envoient le triangle entier dans chacun de ses trois coins avec rapport 1/2. Chaque point de S est l'image d'un autre point de S par l'une des trois applications — et ce point à son tour est l'image d'un autre, pour toujours. Le triangle n'est pas seulement approximativement autosimilaire ; c'est l'unique ensemble compact non vide fixé par cet IFS à trois cartes. Le théorème de Hutchinson (1981) garantit son existence et son unicité.",
    },
    {
      pretitle: "Section 04 · Trois chemins, même tamis",
      title: "Récursion · arithmétique · hasard",
      body: "Chemin un : la subdivision déterministe ci-dessus. Chemin deux : l'arithmétique. Écris le triangle de Pascal et colore chaque entrée impaire, laisse les paires en blanc. Par le théorème de Lucas, C(n, k) est impair exactement quand les chiffres binaires de k sont inclus dans ceux de n — et cette condition combinatoire, tracée en triangle, est le tamis. Chemin trois : le Jeu du Chaos aléatoire. Pose un point n'importe où, puis choisis au hasard l'un des trois coins et saute à mi-chemin ; après quelques centaines de sauts les points convergent vers la même figure. Récursion, divisibilité, hasard — va sur /pascalmod et /chaosgame pour jouer les deux derniers à la main.",
    },
    {
      pretitle: "Section 05 · Connexions",
      title: "Tapis · éponge · poussière",
      body: "Applique la même recette à un carré découpé en neuf, garde-en huit et efface le centre : le tapis de Sierpiński, dimension log 8 / log 3 ≈ 1,893. Refais en trois dimensions avec un cube découpé en vingt-sept, garde-en vingt et efface le centre de chaque face plus celui du cube : l'éponge de Menger, dimension log 20 / log 3 ≈ 2,727. Refais en une dimension avec un segment découpé en trois, garde les deux extérieurs et efface le tiers central : la poussière de Cantor. Toute la famille — poussière, tamis, tapis, éponge — habite la même construction, à des dimensions ambiantes différentes.",
    },
    {
      pretitle: "Section 06 · Histoire mathématique",
      title: "Sierpiński 1915 et l'essor de la théorie polonaise des ensembles",
      body: "Wacław Sierpiński a publié le triangle en 1915, à Lwów (aujourd'hui Lviv), sur fond d'une école polonaise naissante de théorie des ensembles et de topologie des espaces de points que lui, Janiszewski et Mazurkiewicz allaient institutionnaliser peu après autour de la revue varsovienne Fundamenta Mathematicae. Sierpiński a apporté lui-même le tapis en 1916 ; Karl Menger a généralisé la construction à trois dimensions en 1926. (La fameuse école de Lwów autour de Banach, Steinhaus, Mazur et Ulam au Café écossais est venue plus tard — dans les années 1920 et 1930.) Le motif lui-même est pourtant bien plus ancien : les sols cosmatesques en marbre du XIIIᵉ siècle dans les églises romaines portent déjà des tamis de Sierpiński reconnaissables, taillés trois ou quatre itérations de profondeur. Les mathématiques ont formalisé ce que les tailleurs de pierre posaient depuis sept siècles.",
    },
  ],
  subdivision: {
    pretitle: "Interactif · l'image récursive",
    title: "Fais glisser la profondeur — vois le tamis apparaître",
    body: "Chaque étape remplace chaque triangle plein par trois copies plus petites — coin, coin, coin — et efface le triangle central inversé. Le nombre de triangles survivants croît en 3ⁿ ; l'aire totale décroît en (3/4)ⁿ. À la profondeur 5 le tamis est nettement visible ; à 7 les pièces individuelles deviennent trop fines pour être résolues.",
    caption: "Interactif · visualiseur de subdivision",
    depthLabel: "Profondeur",
    triangleLabel: "Triangles",
    hint: "À la profondeur n il y a 3ⁿ triangles pleins. L'aire totale est (3/4)ⁿ de l'originale, tend vers zéro, et pourtant l'ensemble limite, le tamis, a un intérieur vide et reste autosimilaire à toute échelle.",
  },
  threeRoutes: {
    pretitle: "Interactif · trois chemins, une forme",
    title: "Récursion, arithmétique, hasard — même tamis",
    body: "Trois procédés complètement différents, côte à côte. La subdivision suit la recette géométrique. Pascal colore chaque coefficient binomial C(n, k) impair. Le Jeu du Chaos choisit un sommet au hasard et saute à mi-chemin — point par point. Regarde la marche aléatoire remplir la même silhouette triangulaire que les deux routes déterministes.",
    caption: "Interactif · comparateur des trois routes",
    tabSubdivision: "Subdivision · profondeur 6",
    tabPascal: "Pascal mod 2 · 64 lignes",
    tabChaos: "Jeu du Chaos · en direct",
    legendSubdivision:
      "Récursion géométrique : on garde les trois triangles des coins, on efface celui du centre. Trois copies à la moitié — l'IFS en images.",
    legendPascal:
      "Théorème de Lucas en couleur : C(n, k) est impair ssi les bits de k tiennent dans ceux de n. Le motif des impairs est le tamis.",
    legendChaos:
      "Choisir un sommet au hasard, sauter à mi-chemin, marquer le point. Quelques centaines de points suffisent à la silhouette.",
    footnote:
      "Trois recettes sans rapport — géométrique, combinatoire, stochastique — se posent sur le même ensemble compact. C'est l'unique point fixe de l'IFS à trois cartes.",
  },
  panels: {
    dimensionLabel: "Dimension de Hausdorff",
    dimensionCaption:
      "Strictement entre une courbe (dim 1) et une région (dim 2). La même valeur est la dimension de boîte, le tamis est donc bien réglé dimensionnellement.",
    contractionsLabel: "Les trois contractions",
    f1Desc: "vers le sommet en bas à gauche",
    f2Desc: "vers le sommet en bas à droite",
    f3Desc: "vers le sommet du haut",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), l'unique ensemble compact non vide fixé.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Voir la route arithmétique en entier",
    routeChaosLabel: "Jeu du Chaos",
    routeChaosDesc: "→ Joue toi-même la marche aléatoire",
    routeSubdivisionLabel: "Subdivision",
    routeSubdivisionDesc: "→ Construction récursive, profonde",
    familyLabel: "La famille",
    colName: "nom",
    colAmbient: "ambiant",
    colCopies: "copies / échelle",
    colDimension: "dimension",
    familyRows: [
      { name: "poussière de Cantor", ambient: "1D", copies: "2 copies à 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "triangle de Sierpiński",
        ambient: "2D",
        copies: "3 copies à 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "tapis de Sierpiński",
        ambient: "2D",
        copies: "8 copies à 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "éponge de Menger",
        ambient: "3D",
        copies: "20 copies à 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse pousser la subdivision plus loin, lancer le Jeu du Chaos sur le triangle, changer la couleur et parcourir les quatre constructions, subdivision, Jeu du Chaos, Pascal mod 2 et Règle 90, une à la fois. Tout ce que tu viens de lire est à un clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// Italian ----------------------------------------------------------------
const itStory: RichStory = {
  page: {
    pretitle: "Argomento · Geometria",
    title: "Il Triangolo di Sierpiński",
    tagline: "Un solo frattale. Tre strade per arrivarci.",
    intro:
      "Ricorsione, aritmetica e una passeggiata casuale convergono nello stesso setaccio triangolare. Ogni strada è una matematica diversa — e nel limite ognuna disegna la stessa figura.",
    ctaInteractive: "→ Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Un triangolo dentro se stesso, per sempre.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Un triangolo — e appena guardi più da vicino, in ogni angolo ci sono tre copie più piccole; dentro ognuna altre tre, all'infinito. La cosa sorprendente: tre ricette completamente diverse — piegare carta, contare nel triangolo di Pascal, tirare un dado — disegnano la stessa figura.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Parti da un triangolo pieno. Unisci i punti medi dei tre lati; questo lo spezza in quattro triangolini. Butta via quello centrale. Fai lo stesso sui tre superstiti. Dopo cinque passi il setaccio è già visibile — a dieci è inconfondibile.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "La stessa figura arriva da (1) suddivisione ricorsiva, (2) il triangolo di Pascal con le caselle pari cancellate, (3) il Gioco del Caos casuale, in cui salti a metà strada verso uno dei tre angoli. Tre processi senza legame, una risposta inevitabile: la struttura sta nella geometria stessa.",
      },
    ],
    tryIt:
      "Sposta sotto il cursore della profondità e guarda i tre cammini incontrarsi nel setaccio.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La costruzione classica",
      title: "Togli il centro, poi ricorri",
      body: "Prendi un triangolo equilatero. Unisci i punti medi dei tre lati — lo tagli in quattro triangoli congruenti più piccoli, tre con la punta in alto e uno in basso. Cancella quello in basso. Restano tre triangoli piccoli negli angoli. Applica a ciascuno la stessa regola: unisci i punti medi, cancella il triangolo centrale rovesciato, tieni gli angoli. Ripeti. Ogni iterazione triplica il numero di pezzi e dimezza la lunghezza dei lati. Nel limite l'insieme residuo ha misura di Lebesgue zero, eppure è connesso, autosimile a ogni scala, un insieme perfetto più che numerabile senza punti isolati. Quel limite è il triangolo di Sierpiński.",
    },
    {
      pretitle: "Sezione 02 · La dimensione frattale",
      title: "log 3 / log 2 ≈ 1,585",
      body: "Quante copie di sé entrano in te, e a quale scala? Tre copie, ognuna a metà della dimensione lineare. La dimensione di similitudine risolve N = (1/r)^d e dà d = log 3 / log 2 ≈ 1,585. Il triangolo di Sierpiński è strettamente più di una curva e strettamente meno di una regione: un oggetto intermedio in senso forte. Le dimensioni di Hausdorff e di box-counting coincidono qui, per questo il setaccio è uno degli esempi concreti più puliti in una prima lezione di geometria frattale.",
    },
    {
      pretitle: "Sezione 03 · Autosimilarità a ogni scala",
      title: "Tre copie di sé, ognuna a metà",
      body: "Il setaccio S soddisfa una sola equazione insiemistica: S = f₁(S) ∪ f₂(S) ∪ f₃(S), dove f₁, f₂, f₃ sono le contrazioni che mandano l'intero triangolo in ciascuno dei suoi tre angoli con rapporto 1/2. Ogni punto di S è immagine di un altro punto di S sotto una delle tre applicazioni — e quel punto è a sua volta immagine di un altro, per sempre. Il triangolo non è solo approssimativamente autosimile; è l'unico insieme compatto non vuoto fissato da questo IFS a tre mappe. Il teorema di Hutchinson (1981) ne garantisce l'esistenza e l'unicità.",
    },
    {
      pretitle: "Sezione 04 · Tre strade allo stesso setaccio",
      title: "Ricorsione · aritmetica · caso",
      body: "Strada uno è la suddivisione deterministica di sopra. Strada due è aritmetica: scrivi il triangolo di Pascal e colora ogni entrata dispari, lascia in bianco le pari. Per il teorema di Lucas, C(n, k) è dispari esattamente quando le cifre binarie di k sono sottoinsieme di quelle di n — e questa condizione combinatoria, disegnata come triangolo, è il setaccio. Strada tre è il Gioco del Caos casuale: metti un punto qualsiasi, poi scegli un angolo a caso e salta a metà; dopo poche centinaia di salti i punti si addensano nella stessa figura. Ricorsione, divisibilità, caso — vai su /pascalmod e /chaosgame per giocare a mano gli ultimi due.",
    },
    {
      pretitle: "Sezione 05 · Collegamenti",
      title: "Tappeto · spugna · polvere",
      body: "Applica la stessa ricetta a un quadrato diviso in nove, tieni otto e cancella il centro: il tappeto di Sierpiński, dimensione log 8 / log 3 ≈ 1,893. Fallo in tre dimensioni con un cubo diviso in ventisette, tieni venti e cancella i centri delle facce e del cubo: la spugna di Menger, dimensione log 20 / log 3 ≈ 2,727. Fallo in una dimensione con un segmento diviso in tre, tieni i due esterni e cancella il terzo centrale: la polvere di Cantor. L'intera famiglia — polvere, setaccio, tappeto, spugna — vive dentro la stessa costruzione, solo a diverse dimensioni ambientali.",
    },
    {
      pretitle: "Sezione 06 · Storia matematica",
      title: "Sierpiński 1915 e l'ascesa della teoria polacca degli insiemi",
      body: "Wacław Sierpiński pubblicò il triangolo nel 1915, lavorando a Leopoli (oggi Lviv), sullo sfondo di una nascente scuola polacca di teoria degli insiemi e topologia generale che lui, Janiszewski e Mazurkiewicz avrebbero presto istituzionalizzato intorno alla rivista varsaviana Fundamenta Mathematicae. Sierpiński stesso contribuì col tappeto nel 1916; Karl Menger generalizzò la costruzione al tridimensionale nel 1926. (La famosa scuola di Leopoli attorno a Banach, Steinhaus, Mazur e Ulam al Caffè Scozzese venne più tardi — negli anni 1920 e 1930.) Il motivo, però, è molto più antico: i pavimenti cosmateschi in marmo del XIII secolo nelle chiese romane portano già setacci di Sierpiński riconoscibili, tagliati a profondità tre o quattro. La matematica ha formalizzato ciò che gli scalpellini posavano da sette secoli.",
    },
  ],
  subdivision: {
    pretitle: "Interattivo · l'immagine ricorsiva",
    title: "Sposta la profondità — guarda il setaccio nascere",
    body: "Ogni passo sostituisce ogni triangolo pieno con tre copie più piccole — angolo, angolo, angolo — e cancella il triangolo centrale rovesciato. Il numero di triangoli sopravvissuti cresce come 3ⁿ; l'area totale si riduce come (3/4)ⁿ. A profondità 5 il setaccio è chiaramente visibile; a 7 i pezzi sono troppo fini per essere risolti.",
    caption: "Interattivo · visualizzatore di suddivisione",
    depthLabel: "Profondità",
    triangleLabel: "Triangoli",
    hint: "A profondità n ci sono 3ⁿ triangoli pieni. L'area totale è (3/4)ⁿ dell'originale, tende a zero, ma l'insieme limite, il setaccio, ha interno vuoto e resta autosimile a ogni scala.",
  },
  threeRoutes: {
    pretitle: "Interattivo · tre strade, una forma",
    title: "Ricorsione, aritmetica, caso — stesso setaccio",
    body: "Tre procedimenti completamente diversi, fianco a fianco. La suddivisione segue la ricetta geometrica. Pascal colora ogni coefficiente binomiale C(n, k) dispari. Il Gioco del Caos sceglie un vertice a caso e salta a metà — un punto alla volta. Guarda la passeggiata casuale riempire la stessa sagoma triangolare delle due rotte deterministiche.",
    caption: "Interattivo · confronto delle tre strade",
    tabSubdivision: "Suddivisione · profondità 6",
    tabPascal: "Pascal mod 2 · 64 righe",
    tabChaos: "Gioco del Caos · live",
    legendSubdivision:
      "Ricorsione geometrica: tieni i tre triangoli d'angolo, cancella quello centrale. Tre copie a metà — l'IFS in immagini.",
    legendPascal:
      "Teorema di Lucas a colori: C(n, k) è dispari sse i bit di k stanno nei bit di n. Il motivo dei dispari è il setaccio.",
    legendChaos:
      "Scegli un vertice a caso, salta a metà, marca il punto. Bastano poche centinaia di punti per la sagoma.",
    footnote:
      "Tre ricette senza legame — geometrica, combinatoria, stocastica — si posano sullo stesso insieme compatto. È l'unico punto fisso dell'IFS a tre mappe.",
  },
  panels: {
    dimensionLabel: "Dimensione di Hausdorff",
    dimensionCaption:
      "Strettamente tra una curva (dim 1) e una regione (dim 2). Lo stesso valore è la dimensione di box-counting, quindi il setaccio è ben regolato dal punto di vista dimensionale.",
    contractionsLabel: "Le tre contrazioni",
    f1Desc: "verso il vertice in basso a sinistra",
    f2Desc: "verso il vertice in basso a destra",
    f3Desc: "verso il vertice in alto",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), l'unico insieme compatto non vuoto fisso.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Vedi per intero la strada aritmetica",
    routeChaosLabel: "Gioco del Caos",
    routeChaosDesc: "→ Gioca tu stesso la passeggiata casuale",
    routeSubdivisionLabel: "Suddivisione",
    routeSubdivisionDesc: "→ Costruzione ricorsiva, profonda",
    familyLabel: "La famiglia",
    colName: "nome",
    colAmbient: "ambiente",
    colCopies: "copie / scala",
    colDimension: "dimensione",
    familyRows: [
      { name: "polvere di Cantor", ambient: "1D", copies: "2 copie a 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "triangolo di Sierpiński",
        ambient: "2D",
        copies: "3 copie a 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "tappeto di Sierpiński",
        ambient: "2D",
        copies: "8 copie a 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "spugna di Menger",
        ambient: "3D",
        copies: "20 copie a 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia spingere la suddivisione più in profondità, far girare il Gioco del Caos sul triangolo, cambiare colore e scorrere le quattro costruzioni, suddivisione, Gioco del Caos, Pascal mod 2 e Regola 90, una alla volta. Tutto quello che hai appena letto è a un clic.",
  ctaLabel: "→ Apri l'Esploratore",
};

// Portuguese -------------------------------------------------------------
const ptStory: RichStory = {
  page: {
    pretitle: "Tópico · Geometria",
    title: "O Triângulo de Sierpiński",
    tagline: "Um fractal. Três caminhos para chegar.",
    intro:
      "Recursão, aritmética e um passeio aleatório convergem para o mesmo crivo triangular. Cada caminho é uma matemática diferente — e no limite cada um desenha a mesma figura.",
    ctaInteractive: "→ Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Um triângulo dentro de si mesmo, para sempre.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Um triângulo — e assim que olhas mais perto, em cada canto há três cópias mais pequenas; dentro de cada uma outras três, ao infinito. O espantoso: três receitas completamente diferentes — dobrar papel, contar no triângulo de Pascal, lançar um dado — desenham a mesma figura.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Começa com um triângulo cheio. Liga os pontos médios dos seus três lados; isso parte-o em quatro triângulos pequenos. Deita fora o do meio. Faz o mesmo aos três sobreviventes. Em cinco passos já vês o crivo — em dez é inconfundível.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A mesma figura aparece a partir de (1) subdivisão recursiva, (2) o triângulo de Pascal com as casas pares apagadas, e (3) o Jogo do Caos aleatório onde saltas a meio caminho para um dos três cantos. Três processos sem relação, uma mesma resposta inevitável: a estrutura vive na própria geometria.",
      },
    ],
    tryIt:
      "Mexe em baixo o controlo da profundidade e observa os três caminhos a juntarem-se no crivo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A construção clássica",
      title: "Tira o centro, depois recorre",
      body: "Toma um triângulo equilátero. Liga os pontos médios dos seus três lados — isso corta-o em quatro triângulos pequenos congruentes, três com a ponta para cima e um para baixo. Apaga o de baixo. Ficam três triangulozinhos nos cantos. Aplica a cada um a mesma regra: ligar os pontos médios, apagar o triângulo central invertido, guardar os cantos. Repete. Cada iteração triplica o número de peças e reduz o lado a metade. No limite o conjunto restante tem medida de Lebesgue zero, mesmo assim é conexo, autossemelhante em qualquer escala, um conjunto perfeito não numerável sem pontos isolados. Esse limite é o triângulo de Sierpiński.",
    },
    {
      pretitle: "Secção 02 · A dimensão fractal",
      title: "log 3 / log 2 ≈ 1,585",
      body: "Quantas cópias de si mesmo cabem em ti, e a que escala? Três cópias, cada uma a metade do tamanho linear. A dimensão de similitude resolve N = (1/r)^d e dá d = log 3 / log 2 ≈ 1,585. O triângulo de Sierpiński é estritamente mais que uma curva e estritamente menos que uma região: um objeto intermédio em sentido forte. As dimensões de Hausdorff e de contagem de caixas coincidem aqui, por isso o crivo é um dos exemplos concretos mais limpos numa primeira aula de geometria fractal.",
    },
    {
      pretitle: "Secção 03 · Autossemelhança em qualquer escala",
      title: "Três cópias de si próprio, cada uma a metade",
      body: "O crivo S satisfaz uma única equação de conjuntos: S = f₁(S) ∪ f₂(S) ∪ f₃(S), onde f₁, f₂, f₃ são as contrações que mandam o triângulo inteiro para cada um dos seus três cantos com razão 1/2. Cada ponto de S é imagem de outro ponto de S por uma das três aplicações — e esse ponto, por sua vez, é imagem de outro, para sempre. O triângulo não é só aproximadamente autossemelhante; é o único conjunto compacto não vazio fixo deste IFS de três mapas. O teorema de Hutchinson (1981) garante existência e unicidade.",
    },
    {
      pretitle: "Secção 04 · Três caminhos ao mesmo crivo",
      title: "Recursão · aritmética · acaso",
      body: "Caminho um é a subdivisão determinista acima. Caminho dois é aritmética: escreve o triângulo de Pascal e colore cada entrada ímpar, deixa as pares em branco. Pelo teorema de Lucas, C(n, k) é ímpar exatamente quando os dígitos binários de k são subconjunto dos de n — e essa condição combinatória, desenhada como triângulo, é o crivo. Caminho três é o Jogo do Caos aleatório: põe um ponto onde quiseres, depois escolhe um dos três cantos ao acaso e salta a meio caminho; após algumas centenas de saltos os pontos condensam-se na mesma figura. Recursão, divisibilidade, acaso — em /pascalmod e /chaosgame podes jogar os dois últimos à mão.",
    },
    {
      pretitle: "Secção 05 · Conexões",
      title: "Tapete · esponja · pó",
      body: "Aplica a mesma receita a um quadrado dividido em nove, guarda oito e apaga o centro: o tapete de Sierpiński, dimensão log 8 / log 3 ≈ 1,893. Faz o mesmo a três dimensões com um cubo em vinte e sete, guarda vinte e apaga os centros das faces e o do cubo: a esponja de Menger, dimensão log 20 / log 3 ≈ 2,727. Faz a uma dimensão com um segmento em três, guarda os dois exteriores e apaga o terço central: o pó de Cantor. A família inteira — pó, crivo, tapete, esponja — vive dentro da mesma construção, só a dimensões de envolvimento diferentes.",
    },
    {
      pretitle: "Secção 06 · História matemática",
      title: "Sierpiński 1915 e a ascensão da teoria polaca dos conjuntos",
      body: "Wacław Sierpiński publicou o triângulo em 1915, a trabalhar em Lwów (hoje Lviv), no pano de fundo de uma escola polaca nascente de teoria dos conjuntos e topologia geral que ele, Janiszewski e Mazurkiewicz iriam em breve institucionalizar em torno da revista varsoviana Fundamenta Mathematicae. O próprio Sierpiński trouxe o tapete em 1916; Karl Menger generalizou a construção ao tridimensional em 1926. (A famosa escola de Lwów em torno de Banach, Steinhaus, Mazur e Ulam no Café Escocês veio mais tarde — nos anos 1920 e 1930.) O padrão, porém, é muito mais antigo: os pavimentos cosmatescos em mármore do século XIII em igrejas romanas trazem já crivos de Sierpiński reconhecíveis, talhados a três ou quatro iterações de profundidade. A matemática formalizou o que os canteiros vinham a assentar há sete séculos.",
    },
  ],
  subdivision: {
    pretitle: "Interativo · a imagem recursiva",
    title: "Desliza a profundidade — vê o crivo a nascer",
    body: "Cada passo substitui cada triângulo cheio por três cópias menores — canto, canto, canto — e apaga o triângulo central invertido. O número de triângulos sobreviventes cresce como 3ⁿ; a área total reduz-se como (3/4)ⁿ. À profundidade 5 o crivo é claramente visível; a 7 as peças individuais são finas demais para resolver.",
    caption: "Interativo · visualizador de subdivisão",
    depthLabel: "Profundidade",
    triangleLabel: "Triângulos",
    hint: "À profundidade n há 3ⁿ triângulos cheios. A área total é (3/4)ⁿ da original, tende a zero, mas o conjunto limite, o crivo, tem interior vazio e continua autossemelhante em qualquer escala.",
  },
  threeRoutes: {
    pretitle: "Interativo · três caminhos, uma forma",
    title: "Recursão, aritmética, acaso — o mesmo crivo",
    body: "Três procedimentos completamente diferentes, lado a lado. A subdivisão segue a receita geométrica. Pascal colore cada coeficiente binomial C(n, k) ímpar. O Jogo do Caos escolhe um vértice ao acaso e salta a meio — um ponto de cada vez. Vê o passeio aleatório a preencher a mesma silhueta triangular das duas rotas deterministas.",
    caption: "Interativo · comparador de três caminhos",
    tabSubdivision: "Subdivisão · profundidade 6",
    tabPascal: "Pascal mod 2 · 64 linhas",
    tabChaos: "Jogo do Caos · ao vivo",
    legendSubdivision:
      "Recursão geométrica: guarda os três triângulos dos cantos, apaga o central. Três cópias a metade — o IFS em imagens.",
    legendPascal:
      "Teorema de Lucas a cor: C(n, k) é ímpar sse os bits de k cabem nos bits de n. O padrão dos ímpares é o crivo.",
    legendChaos:
      "Escolhe um vértice ao acaso, salta a meio, marca o ponto. Algumas centenas de pontos chegam para a silhueta.",
    footnote:
      "Três receitas sem relação — geométrica, combinatória, estocástica — pousam no mesmo conjunto compacto. Esse conjunto é o único ponto fixo do IFS de três mapas.",
  },
  panels: {
    dimensionLabel: "Dimensão de Hausdorff",
    dimensionCaption:
      "Estritamente entre uma curva (dim 1) e uma região (dim 2). O mesmo valor é a dimensão de contagem de caixas, por isso o crivo comporta-se bem dimensionalmente.",
    contractionsLabel: "As três contrações",
    f1Desc: "para o vértice inferior esquerdo",
    f2Desc: "para o vértice inferior direito",
    f3Desc: "para o vértice superior",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), o único conjunto fixo compacto não vazio.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Ver a rota aritmética por inteiro",
    routeChaosLabel: "Jogo do Caos",
    routeChaosDesc: "→ Joga tu mesmo o passeio aleatório",
    routeSubdivisionLabel: "Subdivisão",
    routeSubdivisionDesc: "→ Construção recursiva, profunda",
    familyLabel: "A família",
    colName: "nome",
    colAmbient: "ambiente",
    colCopies: "cópias / escala",
    colDimension: "dimensão",
    familyRows: [
      { name: "pó de Cantor", ambient: "1D", copies: "2 cópias a 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "triângulo de Sierpiński",
        ambient: "2D",
        copies: "3 cópias a 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "tapete de Sierpiński",
        ambient: "2D",
        copies: "8 cópias a 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "esponja de Menger",
        ambient: "3D",
        copies: "20 cópias a 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te empurrar a subdivisão mais fundo, correr o Jogo do Caos no triângulo, mudar a cor e percorrer as quatro construções, subdivisão, Jogo do Caos, Pascal mod 2 e Regra 90, uma de cada vez. Tudo o que acabaste de ler está a um clique.",
  ctaLabel: "→ Abrir o Explorador",
};

// Swedish ----------------------------------------------------------------
const svStory: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "Sierpiński-triangeln",
    tagline: "En fraktal. Tre vägar in.",
    intro:
      "Rekursion, aritmetik och en slumpvandring konvergerar mot samma triangulära såll. Varje väg är en egen matematik — och i gränsen ritar var och en samma bild.",
    ctaInteractive: "→ Öppna utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "En triangel inuti sig själv, för alltid.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "En triangel — och så fort du tittar närmare ser du i varje hörn tre mindre kopior av den; inuti varje sådan ytterligare tre, oändligt långt ned. Det häpnadsväckande: tre helt olika recept — vika papper, räkna i Pascals triangel, rulla en tärning — ritar samma figur.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Börja med en fylld triangel. Förbind mittpunkterna på de tre sidorna; det delar upp den i fyra små trianglar. Kasta den mellersta. Gör likadant med de tre överlevande. Efter fem steg ser du sållet — efter tio är det omisskännligt.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Samma figur uppstår ur (1) rekursiv uppdelning, (2) Pascals triangel där de jämna cellerna suddas bort, och (3) det slumpartade Kaosspelet där man hoppar halvvägs mot ett av tre hörn. Tre orelaterade processer, ett oundvikligt svar: strukturen sitter inbyggd i själva geometrin.",
      },
    ],
    tryIt: "Dra i djupreglaget nedan och se hur de tre vägarna möts i sållet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den klassiska konstruktionen",
      title: "Ta bort mitten, fortsätt rekursivt",
      body: "Ta en liksidig triangel. Förbind mittpunkterna på de tre sidorna — det delar upp den i fyra kongruenta mindre trianglar, tre pekande uppåt och en nedåt. Sudda den nedåtpekande. Tre små trianglar i hörnen återstår. Tillämpa samma regel på var och en: förbind mittpunkter, sudda den centrala omvända, behåll hörnen. Upprepa. Varje iteration tredubblar antalet bitar och halverar sidlängden. I gränsen har den kvarvarande mängden Lebesguemått noll, men är ändå sammanhängande, självlik i varje skala, en överuppräknelig perfekt mängd utan isolerade punkter. Den gränsen är Sierpiński-triangeln.",
    },
    {
      pretitle: "Avsnitt 02 · Den fraktala dimensionen",
      title: "log 3 / log 2 ≈ 1,585",
      body: "Hur många kopior av dig själv ryms i dig, och i vilken skala? Tre kopior, var och en på halva den linjära storleken. Likformighetsdimensionen löser N = (1/r)^d och ger d = log 3 / log 2 ≈ 1,585. Sierpiński-triangeln är strikt mer än en kurva och strikt mindre än en region: ett mellanting i strikt mening. Hausdorff- och boxdimensionerna sammanfaller här, och därför är sållet ett av de renaste konkreta exemplen i en första föreläsning om fraktal geometri.",
    },
    {
      pretitle: "Avsnitt 03 · Självlikhet i varje skala",
      title: "Tre kopior av sig själv, vardera halverad",
      body: "Sållet S uppfyller en enda mängdekvation: S = f₁(S) ∪ f₂(S) ∪ f₃(S), där f₁, f₂, f₃ är kontraktionerna som skickar hela triangeln in i vart och ett av dess tre hörn med faktor 1/2. Varje punkt i S är bilden av en annan punkt i S under en av de tre avbildningarna — och den i sin tur är bilden av ytterligare en, för evigt. Triangeln är inte bara ungefär självlik; den är den unika icke-tomma kompakta fixmängden för detta IFS med tre kartor. Hutchinsons sats från 1981 garanterar existens och entydighet.",
    },
    {
      pretitle: "Avsnitt 04 · Tre vägar till samma såll",
      title: "Rekursion · aritmetik · slump",
      body: "Väg ett är den deterministiska uppdelningen ovan. Väg två är aritmetisk: skriv ut Pascals triangel och färga varje udda inträde, lämna de jämna vita. Enligt Lucas sats är C(n, k) udda exakt när k:s binära siffror är en delmängd av n:s — och det kombinatoriska villkoret, ritat som en triangel, är sållet. Väg tre är det slumpartade Kaosspelet: släpp en punkt var som helst, välj sedan ett av de tre hörnen slumpmässigt och hoppa halvvägs dit; efter några hundra hopp förtätar sig punkterna till samma figur. Rekursion, delbarhet, slump — gå till /pascalmod och /chaosgame för att spela de två sista för hand.",
    },
    {
      pretitle: "Avsnitt 05 · Kopplingar",
      title: "Matta · svamp · damm",
      body: "Kör samma recept på en kvadrat indelad i nio, behåll åtta och radera mitten: Sierpiński-mattan, dimension log 8 / log 3 ≈ 1,893. Kör den i tre dimensioner med en kub i tjugosju, behåll tjugo och radera centrum på varje sida plus kubens centrum: Mengers svamp, dimension log 20 / log 3 ≈ 2,727. Kör i en dimension med en sträcka i tre delar, behåll de yttre och radera den mellersta tredjedelen: Cantor-damm. Hela familjen — damm, såll, matta, svamp — bor i samma konstruktion, bara i olika omgivande dimensioner.",
    },
    {
      pretitle: "Avsnitt 06 · Matematikens historia",
      title: "Sierpiński 1915 och den framväxande polska mängdläran",
      body: "Wacław Sierpiński publicerade triangeln 1915, verksam i Lwów (i dag Lviv), mot bakgrund av en framväxande polsk skola i mängdlära och punktmängdtopologi som han, Janiszewski och Mazurkiewicz snart skulle institutionalisera kring den Warszawabaserade tidskriften Fundamenta Mathematicae. Sierpiński själv bidrog med mattan 1916; Karl Menger generaliserade konstruktionen till tre dimensioner 1926. (Den berömda Lwów-skolan kring Banach, Steinhaus, Mazur och Ulam på Skotska kaféet kom senare — under 1920- och 1930-talen.) Mönstret är dock mycket äldre: kosmateska marmorgolv från 1200-talet i romerska kyrkor bär redan tydligt igenkännbara Sierpiński-såll, skurna tre eller fyra iterationer djupt. Matematiken formaliserade vad stenhuggarna hade lagt ned i sju århundraden.",
    },
  ],
  subdivision: {
    pretitle: "Interaktivt · den rekursiva bilden",
    title: "Dra i djupet — se sållet växa fram",
    body: "Varje steg byter ut varje fylld triangel mot tre mindre kopior — hörn, hörn, hörn — och raderar den centrala omvända triangeln. Antalet överlevande trianglar växer som 3ⁿ; totalarean krymper som (3/4)ⁿ. Vid djup 5 syns sållet tydligt; vid 7 är de enskilda bitarna för fina för att urskilja.",
    caption: "Interaktivt · uppdelningsvisualiserare",
    depthLabel: "Djup",
    triangleLabel: "Trianglar",
    hint: "Vid djup n finns 3ⁿ fyllda trianglar. Totalarean är (3/4)ⁿ av den ursprungliga, går mot noll, men gränsmängden, sållet, har ändå tomt inre och förblir självlik i varje skala.",
  },
  threeRoutes: {
    pretitle: "Interaktivt · tre vägar, en form",
    title: "Rekursion, aritmetik, slump — samma såll",
    body: "Tre helt olika procedurer sida vid sida. Uppdelningen följer det geometriska receptet. Pascal-vägen färgar varje udda binomialkoefficient C(n, k). Kaosspelet väljer ett triangelhörn slumpmässigt och hoppar halvvägs — en punkt i taget. Se hur slumpvandringen fyller samma triangulära silhuett som de två deterministiska.",
    caption: "Interaktivt · jämförelse mellan tre vägar",
    tabSubdivision: "Uppdelning · djup 6",
    tabPascal: "Pascal mod 2 · 64 rader",
    tabChaos: "Kaosspelet · live",
    legendSubdivision:
      "Geometrisk rekursion: behåll de tre hörntrianglarna, radera den centrala. Tre kopior på halva — IFS i bilder.",
    legendPascal:
      "Lucas sats i färg: C(n, k) är udda omm bitarna i k ryms i bitarna i n. Mönstret av udda är sållet.",
    legendChaos:
      "Välj ett hörn slumpmässigt, hoppa halvvägs, markera punkten. Några hundra punkter räcker för silhuetten.",
    footnote:
      "Tre orelaterade recept — geometriskt, kombinatoriskt, stokastiskt — landar på samma kompakta mängd. Den är den unika fixpunkten för IFS med tre kartor.",
  },
  panels: {
    dimensionLabel: "Hausdorffdimension",
    dimensionCaption:
      "Strikt mellan en kurva (dim 1) och en region (dim 2). Samma värde är boxdimensionen, så sållet är dimensionellt välartat.",
    contractionsLabel: "De tre kontraktionerna",
    f1Desc: "mot hörnet nere till vänster",
    f2Desc: "mot hörnet nere till höger",
    f3Desc: "mot det övre hörnet",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), den unika icke-tomma kompakta fixmängden.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Se hela den aritmetiska vägen",
    routeChaosLabel: "Kaosspelet",
    routeChaosDesc: "→ Spela slumpvandringen själv",
    routeSubdivisionLabel: "Uppdelning",
    routeSubdivisionDesc: "→ Rekursiv konstruktion, djup",
    familyLabel: "Familjen",
    colName: "namn",
    colAmbient: "rymd",
    colCopies: "kopior / skala",
    colDimension: "dimension",
    familyRows: [
      { name: "Cantor-damm", ambient: "1D", copies: "2 kopior på 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "Sierpiński-triangel",
        ambient: "2D",
        copies: "3 kopior på 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "Sierpiński-matta",
        ambient: "2D",
        copies: "8 kopior på 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "Mengers svamp",
        ambient: "3D",
        copies: "20 kopior på 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna utforskaren.",
  closingBody:
    "Utforskaren låter dig pressa uppdelningen djupare, köra Kaosspelet på triangeln, byta färg och stega genom alla fyra konstruktionerna, uppdelning, Kaosspelet, Pascal mod 2 och Regel 90, en i taget. Allt du just läst är ett klick bort.",
  ctaLabel: "→ Öppna utforskaren",
};

// Norwegian --------------------------------------------------------------
const noStory: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "Sierpiński-trekanten",
    tagline: "Én fraktal. Tre veier inn.",
    intro:
      "Rekursjon, aritmetikk og en tilfeldig vandring møtes i den samme triangulære sikten. Hver vei er en egen matematikk — og i grensen tegner hver den samme figuren.",
    ctaInteractive: "→ Åpne utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "En trekant inni seg selv, for alltid.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "En trekant — og så snart du ser nærmere, ligger det i hvert hjørne tre mindre kopier av den; inni hver av dem nye tre, i det uendelige. Det forbløffende: tre helt forskjellige oppskrifter — å brette papir, å telle i Pascals trekant, å rulle en terning — tegner den samme figuren.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Start med én fylt trekant. Forbind midtpunktene på de tre sidene; det deler den i fire små trekanter. Kast den midterste. Gjør det samme med de tre overlevende. Etter fem trinn ser du sikten — etter ti er den umiskjennelig.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Den samme figuren oppstår fra (1) rekursiv oppdeling, (2) Pascals trekant der de jevne cellene viskes ut, og (3) det tilfeldige Kaosspillet der du hopper halvveis mot et av tre hjørner. Tre prosesser uten sammenheng, ett uunngåelig svar: strukturen sitter i selve geometrien.",
      },
    ],
    tryIt: "Dra dybde-glidebryteren nedenfor og se hvordan de tre veiene møtes i sikten.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den klassiske konstruksjonen",
      title: "Fjern midten, fortsett rekursivt",
      body: "Ta en likesidet trekant. Forbind midtpunktene på de tre sidene — det deler den i fire kongruente mindre trekanter, tre med spissen opp og en med spissen ned. Visk ut den nedoverpekende. Da står du igjen med tre små trekanter i hjørnene. Anvend samme regel på hver: forbind midtpunkter, visk ut den sentrale omvendte, behold hjørnene. Gjenta. Hver iterasjon tredobler antallet biter og halverer sidelengden. I grensen har den gjenværende mengden Lebesguemål null, men er likevel sammenhengende, selvlik i alle skalaer, en overtellbar perfekt mengde uten isolerte punkter. Den grensen er Sierpiński-trekanten.",
    },
    {
      pretitle: "Avsnitt 02 · Den fraktale dimensjonen",
      title: "log 3 / log 2 ≈ 1,585",
      body: "Hvor mange kopier av seg selv får plass i deg, og i hvilken skala? Tre kopier, hver på halv lineær størrelse. Likhetsdimensjonen løser N = (1/r)^d og gir d = log 3 / log 2 ≈ 1,585. Sierpiński-trekanten er strengt mer enn en kurve og strengt mindre enn en flate: et mellomobjekt i streng forstand. Hausdorff- og boksdimensjonen faller sammen her, og derfor er sikten ett av de reneste konkrete eksemplene i en første forelesning i fraktalgeometri.",
    },
    {
      pretitle: "Avsnitt 03 · Selvlikhet i alle skalaer",
      title: "Tre kopier av seg selv, hver halvert",
      body: "Sikten S oppfyller én enkelt mengdeligning: S = f₁(S) ∪ f₂(S) ∪ f₃(S), der f₁, f₂, f₃ er kontraksjonene som sender hele trekanten inn i hvert av dens tre hjørner med faktor 1/2. Hvert punkt i S er bildet av et annet punkt i S under en av de tre avbildningene — og det punktet er igjen bilde av enda et, for alltid. Trekanten er ikke bare omtrent selvlik; den er den entydige ikke-tomme kompakte fastmengden for dette IFS-et med tre kart. Hutchinsons sats fra 1981 garanterer eksistens og entydighet.",
    },
    {
      pretitle: "Avsnitt 04 · Tre veier til samme sikt",
      title: "Rekursjon · aritmetikk · tilfeldighet",
      body: "Vei én er den deterministiske oppdelingen over. Vei to er aritmetikk: skriv ut Pascals trekant og fargelegg hvert oddetalls-tall, la de partall hvite. Ved Lucas' sats er C(n, k) odde nøyaktig når k:s binære sifre er en delmengde av n:s — og denne kombinatoriske betingelsen, tegnet som en trekant, er sikten. Vei tre er det tilfeldige Kaosspillet: slipp et punkt hvor som helst, velg så et av de tre hjørnene tilfeldig og hopp halvveis dit; etter noen hundre hopp tetner punktene seg til samme figur. Rekursjon, delelighet, tilfeldighet — gå til /pascalmod og /chaosgame for å spille de to siste for hånd.",
    },
    {
      pretitle: "Avsnitt 05 · Forbindelser",
      title: "Teppe · svamp · støv",
      body: "Kjør samme oppskrift på et kvadrat delt i ni, behold åtte og slett midten: Sierpiński-teppet, dimensjon log 8 / log 3 ≈ 1,893. Kjør det i tre dimensjoner med en kube delt i tjuesju, behold tjue og slett midten av hver side pluss kubens midte: Mengers svamp, dimensjon log 20 / log 3 ≈ 2,727. Kjør det i én dimensjon med en strek delt i tre, behold de ytre og slett midtre tredjedel: Cantor-støv. Hele familien — støv, sikt, teppe, svamp — bor i den samme konstruksjonen, bare i ulike omgivelsesdimensjoner.",
    },
    {
      pretitle: "Avsnitt 06 · Matematisk historie",
      title: "Sierpiński 1915 og fremveksten av polsk mengdelære",
      body: "Wacław Sierpiński publiserte trekanten i 1915, mens han arbeidet i Lwów (i dag Lviv), mot bakgrunnen av en gryende polsk skole i mengdelære og punktmengde-topologi som han, Janiszewski og Mazurkiewicz snart skulle institusjonalisere rundt det Warszawabaserte tidsskriftet Fundamenta Mathematicae. Sierpiński bidro selv med teppet i 1916; Karl Menger generaliserte konstruksjonen til tre dimensjoner i 1926. (Den berømte Lwów-skolen rundt Banach, Steinhaus, Mazur og Ulam på Den skotske kafeen kom senere — gjennom 1920- og 1930-årene.) Selve mønsteret er likevel mye eldre: kosmateske marmorgulv fra 1200-tallet i romerske kirker bærer allerede gjenkjennelige Sierpiński-sikter, hugget tre eller fire iterasjoner dypt. Matematikken formaliserte det steinhuggerne hadde lagt ned i sju århundrer.",
    },
  ],
  subdivision: {
    pretitle: "Interaktivt · det rekursive bildet",
    title: "Dra dybden — se sikten vokse fram",
    body: "Hvert trinn erstatter hver fylte trekant med tre mindre kopier — hjørne, hjørne, hjørne — og sletter den sentrale omvendte trekanten. Antall overlevende trekanter vokser som 3ⁿ; totalarealet krymper som (3/4)ⁿ. Ved dybde 5 er sikten tydelig synlig; ved 7 er bitene for fine til å skille.",
    caption: "Interaktivt · oppdelings-visualisering",
    depthLabel: "Dybde",
    triangleLabel: "Trekanter",
    hint: "Ved dybde n finnes 3ⁿ fylte trekanter. Totalarealet er (3/4)ⁿ av det opprinnelige, går mot null, men grensemengden, sikten, har likevel tomt indre og forblir selvlik i alle skalaer.",
  },
  threeRoutes: {
    pretitle: "Interaktivt · tre veier, én form",
    title: "Rekursjon, aritmetikk, tilfeldighet — samme sikt",
    body: "Tre helt forskjellige prosedyrer side om side. Oppdelingen følger den geometriske oppskriften. Pascal-veien fargelegger hver odde binomialkoeffisient C(n, k). Kaosspillet velger et trekanthjørne tilfeldig og hopper halvveis — ett punkt om gangen. Se den tilfeldige vandringen fylle ut samme triangulære silhuett som de to deterministiske.",
    caption: "Interaktivt · sammenligning av tre veier",
    tabSubdivision: "Oppdeling · dybde 6",
    tabPascal: "Pascal mod 2 · 64 rader",
    tabChaos: "Kaosspillet · live",
    legendSubdivision:
      "Geometrisk rekursjon: behold de tre hjørnetrekantene, slett den midterste. Tre kopier på halvparten — IFS-et i bilder.",
    legendPascal:
      "Lucas' sats i farge: C(n, k) er odde hvis og bare hvis bitene i k får plass i bitene i n. Mønsteret av odde er sikten.",
    legendChaos:
      "Velg et hjørne tilfeldig, hopp halvveis, marker punktet. Noen hundre punkter er nok for silhuetten.",
    footnote:
      "Tre urelaterte oppskrifter — geometrisk, kombinatorisk, stokastisk — lander på samme kompakte mengde. Den er det entydige fastpunktet for IFS-et med tre kart.",
  },
  panels: {
    dimensionLabel: "Hausdorff-dimensjon",
    dimensionCaption:
      "Strengt mellom en kurve (dim 1) og en flate (dim 2). Samme verdi er boksdimensjonen, så sikten er dimensjonelt velartet.",
    contractionsLabel: "De tre kontraksjonene",
    f1Desc: "mot hjørnet nede til venstre",
    f2Desc: "mot hjørnet nede til høyre",
    f3Desc: "mot det øvre hjørnet",
    fixedSet: "S = f₁(S) ∪ f₂(S) ∪ f₃(S), den entydige ikke-tomme kompakte fastmengden.",
    routePascalLabel: "Pascal mod 2",
    routePascalDesc: "→ Se hele den aritmetiske veien",
    routeChaosLabel: "Kaosspillet",
    routeChaosDesc: "→ Spill den tilfeldige vandringen selv",
    routeSubdivisionLabel: "Oppdeling",
    routeSubdivisionDesc: "→ Rekursiv konstruksjon, dyp",
    familyLabel: "Familien",
    colName: "navn",
    colAmbient: "rom",
    colCopies: "kopier / skala",
    colDimension: "dimensjon",
    familyRows: [
      { name: "Cantor-støv", ambient: "1D", copies: "2 kopier på 1/3", dim: "log 2 / log 3 ≈ 0,631" },
      {
        name: "Sierpiński-trekant",
        ambient: "2D",
        copies: "3 kopier på 1/2",
        dim: "log 3 / log 2 ≈ 1,585",
      },
      {
        name: "Sierpiński-teppe",
        ambient: "2D",
        copies: "8 kopier på 1/3",
        dim: "log 8 / log 3 ≈ 1,893",
      },
      {
        name: "Mengers svamp",
        ambient: "3D",
        copies: "20 kopier på 1/3",
        dim: "log 20 / log 3 ≈ 2,727",
      },
    ],
  },
  closingPretitle: "Gå videre",
  closingTitle: "Åpne utforskeren.",
  closingBody:
    "Utforskeren lar deg presse oppdelingen dypere, kjøre Kaosspillet på trekanten, bytte farge og gå gjennom alle fire konstruksjonene, oppdeling, Kaosspillet, Pascal mod 2 og Regel 90, én om gangen. Alt du nettopp leste er ett klikk unna.",
  ctaLabel: "→ Åpne utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: enStory,
  de: deStory,
  es: esStory,
  fr: frStory,
  it: itStory,
  pt: ptStory,
  sv: svStory,
  no: noStory,
};

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------

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

// Tiny SVG illustration for card 02 — a depth-2 gasket sketch.
function MiniGasket() {
  const W = 220;
  const H = 200;
  const triangles: Array<[[number, number], [number, number], [number, number]]> = [];
  const margin = 8;
  const w = W - 2 * margin;
  const triH = (w * Math.sqrt(3)) / 2;
  const top: [number, number] = [W / 2, margin + (H - 2 * margin - triH) / 2];
  const left: [number, number] = [margin, top[1] + triH];
  const right: [number, number] = [W - margin, top[1] + triH];
  const recurse = (p1: [number, number], p2: [number, number], p3: [number, number], d: number) => {
    if (d <= 0) {
      triangles.push([p1, p2, p3]);
      return;
    }
    const m12: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const m23: [number, number] = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2];
    const m31: [number, number] = [(p3[0] + p1[0]) / 2, (p3[1] + p1[1]) / 2];
    recurse(p1, m12, m31, d - 1);
    recurse(m12, p2, m23, d - 1);
    recurse(m31, m23, p3, d - 1);
  };
  recurse(top, left, right, 4);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 220, display: "block" }}
      aria-hidden="true"
    >
      <rect x={0} y={0} width={W} height={H} fill={palette.canvas.bg} />
      {triangles.map((tri, i) => (
        <polygon
          key={i}
          points={tri.map((p) => `${p[0]},${p[1]}`).join(" ")}
          fill={palette.signal.amber}
          fillOpacity={0.82}
        />
      ))}
    </svg>
  );
}

export default function SierpinskiStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/sierpinski/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="dim ≈ log 3 / log 2 ≈ 1.585"
      formulaLatex={"\\dim_H S = \\dfrac{\\log 3}{\\log 2} \\approx 1.585"}
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
                    <div className="mt-4 flex justify-center">
                      <MiniGasket />
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

      {/* Section 01 · Classical construction */}
      {sec0 && (
        <section className="mx-auto mb-32 max-w-5xl space-y-6">
          <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        </section>
      )}

      {/* INTERACTIVE 1 · Subdivision visualiser */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.subdivision.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.subdivision.title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.subdivision.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SierpinskiSubdivision
            caption={story.subdivision.caption}
            depthLabel={story.subdivision.depthLabel}
            triangleLabel={story.subdivision.triangleLabel}
            hint={story.subdivision.hint}
          />
        </Reveal>
      </section>

      {/* Section 02 · Fractal dimension */}
      {sec1 && (
        <section className="mx-auto mb-32 max-w-5xl space-y-6">
          <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
          <Reveal delay={120}>
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.panels.dimensionLabel}
              </div>
              <div className="math-italic text-5xl leading-tight text-ink-100 md:text-7xl">
                log 3 / log 2 ≈ 1.585
              </div>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
                {story.panels.dimensionCaption}
              </p>
            </div>
          </Reveal>
        </section>
      )}

      {/* Section 03 · Self-similarity */}
      {sec2 && (
        <section className="mx-auto mb-32 max-w-5xl space-y-6">
          <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
          <Reveal delay={120}>
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.panels.contractionsLabel}
              </div>
              <div className="space-y-1 font-mono text-xs leading-relaxed text-ink-100 md:text-sm">
                <div>
                  <span className="text-signal-amber">f₁(x, y)</span> = (x/2, y/2){" "}
                  <span className="text-ink-400">{story.panels.f1Desc}</span>
                </div>
                <div>
                  <span className="text-signal-amber">f₂(x, y)</span> = ((x+1)/2, y/2){" "}
                  <span className="text-ink-400">{story.panels.f2Desc}</span>
                </div>
                <div>
                  <span className="text-signal-amber">f₃(x, y)</span> = ((x+1/2)/2, (y+√3/2)/2){" "}
                  <span className="text-ink-400">{story.panels.f3Desc}</span>
                </div>
              </div>
              <p className="hairline border-t pt-2 text-xs leading-relaxed text-ink-400">
                {story.panels.fixedSet}
              </p>
            </div>
          </Reveal>
        </section>
      )}

      {/* Section 04 · Three roads */}
      {sec3 && (
        <section className="mx-auto mb-32 max-w-5xl space-y-6">
          <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
          <Reveal delay={120}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Link
                href="/pascalmod"
                className="hairline block space-y-1 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-signal-amber/50"
              >
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {story.panels.routePascalLabel}
                </div>
                <div className="text-sm text-ink-200">{story.panels.routePascalDesc}</div>
              </Link>
              <Link
                href="/chaosgame"
                className="hairline block space-y-1 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-signal-amber/50"
              >
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {story.panels.routeChaosLabel}
                </div>
                <div className="text-sm text-ink-200">{story.panels.routeChaosDesc}</div>
              </Link>
              <Link
                href="/sierpinski/explorer"
                className="hairline block space-y-1 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-signal-amber/50"
              >
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {story.panels.routeSubdivisionLabel}
                </div>
                <div className="text-sm text-ink-200">{story.panels.routeSubdivisionDesc}</div>
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* INTERACTIVE 2 · Three routes comparator */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.threeRoutes.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.threeRoutes.title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.threeRoutes.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SierpinskiThreeRoutes
            caption={story.threeRoutes.caption}
            tabSubdivision={story.threeRoutes.tabSubdivision}
            tabPascal={story.threeRoutes.tabPascal}
            tabChaos={story.threeRoutes.tabChaos}
            legendSubdivision={story.threeRoutes.legendSubdivision}
            legendPascal={story.threeRoutes.legendPascal}
            legendChaos={story.threeRoutes.legendChaos}
            footnote={story.threeRoutes.footnote}
          />
        </Reveal>
      </section>

      {/* Section 05 · Connections */}
      {sec4 && (
        <section className="mx-auto mb-32 max-w-5xl space-y-6">
          <StoryCard pretitle={sec4.pretitle} title={sec4.title} body={sec4.body} accent={ACCENT} />
          <Reveal delay={120}>
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.panels.familyLabel}
              </div>
              <table className="w-full font-mono text-sm">
                <thead className="hairline border-b text-ink-300">
                  <tr>
                    <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                      {story.panels.colName}
                    </th>
                    <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                      {story.panels.colAmbient}
                    </th>
                    <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                      {story.panels.colCopies}
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] uppercase tracking-widest">
                      {story.panels.colDimension}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {story.panels.familyRows.map((r) => (
                    <tr key={r.name} className="border-b border-ink-700/30 last:border-0">
                      <td className="px-2 py-2 text-signal-amber">{r.name}</td>
                      <td className="px-2 py-2 text-xs text-ink-200">{r.ambient}</td>
                      <td className="px-2 py-2 text-xs text-ink-200">{r.copies}</td>
                      <td className="px-2 py-2 text-right text-xs text-ink-100">{r.dim}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>
      )}

      {/* Section 06 · History */}
      {sec5 && (
        <section className="mx-auto mb-32 max-w-5xl space-y-6">
          <StoryCard pretitle={sec5.pretitle} title={sec5.title} body={sec5.body} accent={ACCENT} />
        </section>
      )}

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
            href="/sierpinski/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
