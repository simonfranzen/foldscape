"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Reveal } from "@/components/Reveal";
import { Rule110Demo } from "@/components/Rule110Demo";
import { Rule110LookupTable } from "@/components/Rule110LookupTable";
import { Rule110MiniSimulator } from "@/components/Rule110MiniSimulator";
import { StoryCard } from "@/components/StoryPageShell";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// Rich, per-locale story content for the Rule 110 page. The hero (pretitle/
// title/tagline/intro/CTA) continues to come from the shared stories.ts;
// everything below this hero is authored inline so this page can tell a
// longer story without touching shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  classesCaption: string;
  classesLabels: { c1: string; c2: string; c3: string; c4: string };
  rivalsCaption: string;
  rivalsLabels: { r30: string; r90: string; r110: string };
  lookupPretitle: string;
  lookupTitle: string;
  lookupBody: string;
  lookupCaption: string;
  simulatorPretitle: string;
  simulatorTitle: string;
  simulatorBody: string;
  simulatorCaption: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

const en: RichStory = {
  encounter: {
    pretitle: "First encounter",
    title: "Eight bits of rule. A whole universe.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Draw a row of cells, each one black or white. Look at every cell with its two neighbours — three cells, eight possible patterns. A rule says, for each pattern, what the cell becomes next. Eight outputs. Eight bits. One byte. There are exactly 256 such rules — and one of them, Rule 110, is enough to do every computation a computer can do.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Write the eight neighbourhood patterns in descending binary: 111, 110, 101, 100, 011, 010, 001, 000. Under each, write the next-step output for Rule 110. Read the outputs as a single binary number — 01101110 — and convert: that is the decimal 110. The name is literally the rule.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "In the late 1990s Matthew Cook proved at Wolfram Research that Rule 110 is Turing-complete; the result was finally published in 2004 after a long publication dispute. Arrange the right initial pattern and it can simulate any computer, any algorithm, anything you can compute. From eight bits. The simplest known universal cellular automaton — and arguably the simplest universal computer ever discovered.",
      },
    ],
    tryIt: "Below: flip the eight output bits yourself, then watch the rule run live.",
  },
  sections: [
    {
      pretitle: "Section 01 · The 256 elementary rules",
      title: "Wolfram's zoo, sorted into four classes",
      body: "Stephen Wolfram catalogued every one of the 256 elementary cellular automata in the 1980s and noticed something striking: their long-run behaviour falls into four broad classes. Class 1 dies into uniform black or white. Class 2 settles into stripes or simple periodic patterns. Class 3 is pseudo-random — noise that never quite repeats. Class 4 is the rare and strange middle ground: islands of order drifting through noise, gliders colliding, structure that is neither periodic nor chaotic. Class 4 is where universality hides — and Rule 110 is its flagship.",
    },
    {
      pretitle: "Section 02 · Reading the rule",
      title: "From eight patterns to a single number",
      body: "Every elementary rule looks at three cells (left, centre, right) and returns one bit. Eight possible 3-bit inputs, one output each — that is exactly a function from {0,1}³ to {0,1}, which is exactly 8 bits of information, which is one byte. Lay the outputs in Wolfram's canonical order — input 111 contributes the high bit, input 000 the low bit — and the byte you read off is the rule's number. Rule 30 outputs 00011110₂. Rule 110 outputs 01101110₂. The naming is not decorative; it is the rule.",
    },
    {
      pretitle: "Section 03 · Rule 30 vs Rule 110",
      title: "Chaos and structure, side by side",
      body: "Pick Rule 30 and the centre cell of an evenly-spaced row diverges into apparent randomness so good that Mathematica still uses Rule 30 as a pseudo-random number generator. Pick Rule 90 and the same seed paints a perfect Sierpiński triangle — pure recursive order. Rule 110 sits between them: a striped background woven through with dozens of triangular gliders that drift, collide, and recombine. It is neither chaos (like 30) nor crystal (like 90). It is, exactly, computation.",
    },
    {
      pretitle: "Section 04 · Gliders in Rule 110",
      title: "Moving pieces, like Life but in one dimension",
      body: "If you let Rule 110 run on a random row for a few hundred generations, recognisable shapes emerge: long left-moving stripes, short right-moving wedges, stationary blocks. Matthew Cook catalogued more than a dozen distinct glider species — A, B, C₁, C₂, D₁, D₂, E, F, G, H — each with its own speed and width. Glider collisions act as logic gates: the right pair produces a stable signal, the wrong pair annihilates. It is Conway's Game of Life compressed into one dimension, with the same emergent zoo and the same hint of computation.",
    },
    {
      pretitle: "Section 05 · Turing-completeness",
      title: "Cook 2004 — universality from a byte",
      body: "Matthew Cook's construction, completed at Wolfram Research in the late 1990s and finally published in 2004 after a lengthy publication dispute, shows that the glider zoo of Rule 110 can simulate a cyclic tag system — and cyclic tag systems are themselves Turing-complete. Any program, any computation, any algorithm can be encoded as an initial row of cells; Rule 110, applied long enough, runs that program. The proof took thousands of cells per logical step and is famously intricate, but the conclusion is clean: a one-line lookup table is a universal computer. No clock, no memory, no instruction set — just a rule.",
    },
    {
      pretitle: "Section 06 · Universality everywhere",
      title: "Complexity from simplicity is a deep theme",
      body: "Rule 110 is one entry in a longer ledger. Conway's Game of Life is Turing-complete; so is the Wang-tile system; so are billiard balls, soap films, and certain piles of dominoes. Wolfram's Principle of Computational Equivalence conjectures that, beyond a low threshold of complexity, essentially every system that is not obviously simple is computationally universal. Whether or not that conjecture survives, the empirical pattern is unmistakable: universality is cheap. Nature did not have to wait for transistors. A row of cells and a byte of rule were always enough.",
    },
  ],
  classesCaption: "The four Wolfram classes · single-cell seed",
  classesLabels: {
    c1: "Class 1 · Rule 0 — dies",
    c2: "Class 2 · Rule 90 — Sierpiński",
    c3: "Class 3 · Rule 30 — chaos",
    c4: "Class 4 · Rule 110 — gliders",
  },
  rivalsCaption: "Same seed, three rules",
  rivalsLabels: {
    r30: "Rule 30 — chaotic",
    r90: "Rule 90 — fractal",
    r110: "Rule 110 — computational",
  },
  lookupPretitle: "Interactive · the lookup table",
  lookupTitle: "Build any of the 256 rules with eight clicks",
  lookupBody:
    "Each tile shows one of the eight neighbourhood patterns and the output bit it produces. Click any output to flip it. The binary string at the bottom updates live; its decimal value is the rule number. The presets jump you straight to four famous rules.",
  lookupCaption: "Lookup table · click any output bit",
  simulatorPretitle: "Interactive · the simulator",
  simulatorTitle: "Watch the rule you just built",
  simulatorBody:
    "The canvas runs the current rule for as many steps as the slider asks for, starting from a single centre cell or a random row. Edit the lookup table above and the picture redraws instantly — feel for yourself how dramatically one flipped bit can change everything.",
  simulatorCaption: "Live evolution · current rule",
  closingTitle: "Open the Simulator.",
  closingBody:
    "The full Simulator lets you switch palette, slow the time-step down to a crawl, jump to the eight most-studied rules, and seed the grid from the edge for asymmetric experiments. Everything you just played with, with more room to breathe.",
  ctaLabel: "→ Open the Simulator",
};

const de: RichStory = {
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Acht Bit Regel. Ein ganzes Universum.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Zeichne eine Reihe Zellen, jede schwarz oder weiß. Schau jede Zelle mit ihren beiden Nachbarn an — drei Zellen, acht mögliche Muster. Eine Regel sagt für jedes Muster, was aus der Zelle als nächstes wird. Acht Ausgaben. Acht Bit. Ein Byte. Genau 256 solcher Regeln gibt es — und eine davon, Regel 110, reicht aus, um jede Berechnung zu erledigen, die ein Computer leisten kann.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Schreibe die acht Nachbarschaftsmuster in absteigender Binärreihenfolge: 111, 110, 101, 100, 011, 010, 001, 000. Unter jedes Muster schreibst du den nächsten Wert nach Regel 110. Lies die Ausgaben als eine einzige Binärzahl — 01101110 — und rechne um: das ist dezimal 110. Der Name ist buchstäblich die Regel.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "In den späten 1990er-Jahren bewies Matthew Cook bei Wolfram Research, dass Regel 110 Turing-vollständig ist; das Paper erschien nach langem Publikationsstreit erst 2004 in Complex Systems. Mit dem richtigen Anfangsmuster simuliert sie jeden Computer, jeden Algorithmus, alles, was berechenbar ist. Aus acht Bit. Der einfachste bekannte universelle Zellularautomat — und wohl der einfachste je entdeckte universelle Computer.",
      },
    ],
    tryIt: "Unten: kipp die acht Ausgabebits selbst und sieh die Regel live laufen.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die 256 elementaren Regeln",
      title: "Wolframs Zoo, sortiert in vier Klassen",
      body: "Stephen Wolfram katalogisierte in den 1980ern jede der 256 elementaren Zellularautomaten und bemerkte etwas Auffälliges: ihr Langzeitverhalten fällt in vier breite Klassen. Klasse 1 stirbt in einheitlichem Schwarz oder Weiß. Klasse 2 setzt sich in Streifen oder einfache periodische Muster. Klasse 3 ist pseudo-zufällig — Rauschen, das sich nie ganz wiederholt. Klasse 4 ist die seltene, merkwürdige Mitte: Inseln aus Ordnung, die durch Rauschen treiben, kollidierende Gleiter, Struktur, die weder periodisch noch chaotisch ist. In Klasse 4 versteckt sich Universalität — und Regel 110 ist ihr Flaggschiff.",
    },
    {
      pretitle: "Abschnitt 02 · Die Regel lesen",
      title: "Von acht Mustern zu einer einzigen Zahl",
      body: "Jede elementare Regel schaut sich drei Zellen an (links, Mitte, rechts) und liefert ein Bit. Acht mögliche 3-Bit-Eingaben, je eine Ausgabe — das ist genau eine Funktion von {0,1}³ nach {0,1}, also genau 8 Bit Information, also ein Byte. Lege die Ausgaben in Wolframs kanonischer Reihenfolge ab — Eingabe 111 liefert das höchste Bit, 000 das niedrigste — und das Byte, das du abliest, ist die Nummer der Regel. Regel 30 ergibt 00011110₂. Regel 110 ergibt 01101110₂. Der Name ist nicht Dekoration; er ist die Regel.",
    },
    {
      pretitle: "Abschnitt 03 · Regel 30 gegen Regel 110",
      title: "Chaos und Struktur, nebeneinander",
      body: "Wähle Regel 30 und die Mittelzelle einer regelmäßigen Reihe driftet in scheinbare Zufälligkeit so überzeugend, dass Mathematica Regel 30 noch heute als Pseudozufallszahlengenerator nutzt. Wähle Regel 90 und derselbe Saat malt ein perfektes Sierpiński-Dreieck — reine rekursive Ordnung. Regel 110 sitzt dazwischen: ein gestreifter Hintergrund, durchwoben von Dutzenden dreieckiger Gleiter, die treiben, kollidieren und sich neu verbinden. Sie ist weder Chaos (wie 30) noch Kristall (wie 90). Sie ist, genau, Berechnung.",
    },
    {
      pretitle: "Abschnitt 04 · Gleiter in Regel 110",
      title: "Bewegliche Teilchen, wie Life — aber eindimensional",
      body: "Lässt man Regel 110 ein paar hundert Generationen auf einer zufälligen Reihe laufen, tauchen erkennbare Formen auf: lange linkslaufende Streifen, kurze rechtslaufende Keile, stehende Blöcke. Matthew Cook katalogisierte über ein Dutzend verschiedene Gleiterarten — A, B, C₁, C₂, D₁, D₂, E, F, G, H — jede mit eigener Geschwindigkeit und Breite. Gleiterkollisionen wirken wie Logikgatter: das richtige Paar erzeugt ein stabiles Signal, das falsche Paar löscht aus. Es ist Conways Game of Life, zusammengepresst in eine Dimension, mit demselben emergenten Zoo und demselben Hauch von Berechnung.",
    },
    {
      pretitle: "Abschnitt 05 · Turing-Vollständigkeit",
      title: "Cook 2004 — Universalität aus einem Byte",
      body: "Matthew Cooks Konstruktion, in den späten 1990ern bei Wolfram Research fertiggestellt und nach langem Publikationsstreit 2004 endgültig erschienen, zeigt, dass der Gleiterzoo von Regel 110 ein zyklisches Tag-System simulieren kann — und zyklische Tag-Systeme sind selbst Turing-vollständig. Jedes Programm, jede Berechnung, jeder Algorithmus lässt sich als Anfangsreihe von Zellen kodieren; Regel 110, lange genug angewendet, führt dieses Programm aus. Der Beweis braucht pro logischem Schritt Tausende Zellen und ist berüchtigt verschachtelt, aber die Konsequenz ist sauber: eine einzeilige Lookup-Tabelle ist ein universeller Computer. Kein Takt, kein Speicher, kein Befehlssatz — nur eine Regel.",
    },
    {
      pretitle: "Abschnitt 06 · Universalität überall",
      title: "Komplexität aus Einfachheit ist ein tiefes Thema",
      body: "Regel 110 ist ein Eintrag in einem längeren Register. Conways Game of Life ist Turing-vollständig; das System der Wang-Kacheln auch; ebenso Billardkugeln, Seifenfilme und gewisse Dominos. Wolframs Prinzip der rechnerischen Äquivalenz vermutet, dass jenseits einer niedrigen Komplexitätsschwelle praktisch jedes System, das nicht offensichtlich einfach ist, rechnerisch universell ist. Ob diese Vermutung stehen bleibt oder nicht — das empirische Muster ist unverkennbar: Universalität ist billig. Die Natur musste nicht auf Transistoren warten. Eine Reihe Zellen und ein Byte Regel haben immer gereicht.",
    },
  ],
  classesCaption: "Die vier Wolfram-Klassen · Einzelzellen-Saat",
  classesLabels: {
    c1: "Klasse 1 · Regel 0 — stirbt",
    c2: "Klasse 2 · Regel 90 — Sierpiński",
    c3: "Klasse 3 · Regel 30 — Chaos",
    c4: "Klasse 4 · Regel 110 — Gleiter",
  },
  rivalsCaption: "Derselbe Saat, drei Regeln",
  rivalsLabels: {
    r30: "Regel 30 — chaotisch",
    r90: "Regel 90 — fraktal",
    r110: "Regel 110 — rechnend",
  },
  lookupPretitle: "Interaktiv · die Lookup-Tabelle",
  lookupTitle: "Bau jede der 256 Regeln mit acht Klicks",
  lookupBody:
    "Jede Kachel zeigt eines der acht Nachbarschaftsmuster und das Ausgabebit, das es erzeugt. Klick auf eine Ausgabe, um sie zu kippen. Die Binärzeichenfolge unten aktualisiert sich live; ihr Dezimalwert ist die Regelnummer. Die Voreinstellungen springen direkt zu vier berühmten Regeln.",
  lookupCaption: "Lookup-Tabelle · klick auf ein Ausgabebit",
  simulatorPretitle: "Interaktiv · der Simulator",
  simulatorTitle: "Sieh der Regel zu, die du gerade gebaut hast",
  simulatorBody:
    "Die Leinwand lässt die aktuelle Regel so viele Schritte laufen, wie der Schieber verlangt, beginnend mit einer einzelnen Mittelzelle oder einer zufälligen Reihe. Ändere die Lookup-Tabelle oben und das Bild zeichnet sich sofort neu — spür selbst, wie dramatisch ein einziges gekipptes Bit alles verändern kann.",
  simulatorCaption: "Live-Evolution · aktuelle Regel",
  closingTitle: "Öffne den Simulator.",
  closingBody:
    "Der volle Simulator lässt dich die Palette wechseln, den Zeitschritt bis zum Kriechen verlangsamen, zu den acht meistuntersuchten Regeln springen und das Gitter vom Rand aus säen, für asymmetrische Experimente. Alles, womit du gerade gespielt hast, mit mehr Raum zum Atmen.",
  ctaLabel: "→ Simulator öffnen",
};

const es: RichStory = {
  encounter: {
    pretitle: "Primer encuentro",
    title: "Ocho bits de regla. Un universo entero.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Dibuja una fila de celdas, cada una negra o blanca. Mira cada celda con sus dos vecinas — tres celdas, ocho patrones posibles. Una regla dice, para cada patrón, en qué se convierte la celda. Ocho salidas. Ocho bits. Un byte. Hay exactamente 256 reglas así — y una de ellas, la Regla 110, basta para hacer todo lo que un computador puede hacer.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Escribe los ocho patrones de vecindario en orden binario descendente: 111, 110, 101, 100, 011, 010, 001, 000. Bajo cada uno, anota la salida de la Regla 110. Lee las salidas como un único número binario — 01101110 — y conviértelo: es el decimal 110. El nombre es, literalmente, la regla.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "A finales de los años 90, Matthew Cook demostró en Wolfram Research que la Regla 110 es Turing-completa; el artículo apareció en Complex Systems en 2004 tras una larga disputa editorial. Con el patrón inicial adecuado simula cualquier computador, cualquier algoritmo, cualquier cosa computable. A partir de ocho bits. El autómata celular universal más simple conocido — y posiblemente el computador universal más simple jamás descubierto.",
      },
    ],
    tryIt: "Abajo: cambia tú los ocho bits de salida y mira la regla correr en vivo.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Las 256 reglas elementales",
      title: "El zoológico de Wolfram, en cuatro clases",
      body: "Stephen Wolfram catalogó en los años 80 cada uno de los 256 autómatas celulares elementales y notó algo sorprendente: su comportamiento a largo plazo cae en cuatro clases amplias. La clase 1 muere en un negro o blanco uniforme. La clase 2 se asienta en franjas o patrones periódicos simples. La clase 3 es pseudo-aleatoria — ruido que nunca llega a repetirse. La clase 4 es el raro punto medio: islas de orden que flotan por el ruido, planeadores que colisionan, estructura que no es ni periódica ni caótica. La universalidad se esconde en la clase 4 — y la Regla 110 es su buque insignia.",
    },
    {
      pretitle: "Sección 02 · Leer la regla",
      title: "De ocho patrones a un único número",
      body: "Cada regla elemental mira tres celdas (izquierda, centro, derecha) y devuelve un bit. Ocho entradas posibles de 3 bits, una salida cada una — es exactamente una función de {0,1}³ a {0,1}, es decir, 8 bits de información, es decir, un byte. Coloca las salidas en el orden canónico de Wolfram — la entrada 111 aporta el bit alto, 000 el bajo — y el byte que lees es el número de la regla. La Regla 30 da 00011110₂. La Regla 110 da 01101110₂. El nombre no es decorativo; es la regla.",
    },
    {
      pretitle: "Sección 03 · Regla 30 vs Regla 110",
      title: "Caos y estructura, lado a lado",
      body: "Toma la Regla 30 y la celda central de una fila uniforme diverge en una aparente aleatoriedad tan convincente que Mathematica todavía usa la Regla 30 como generador de números pseudo-aleatorios. Toma la Regla 90 y la misma semilla pinta un triángulo de Sierpiński perfecto — orden recursivo puro. La Regla 110 se sienta entre ambas: un fondo rayado entretejido por decenas de planeadores triangulares que derivan, colisionan y se recombinan. No es ni caos (como 30) ni cristal (como 90). Es, precisamente, computación.",
    },
    {
      pretitle: "Sección 04 · Planeadores en la Regla 110",
      title: "Piezas en movimiento, como Life pero en una dimensión",
      body: "Si dejas correr la Regla 110 sobre una fila aleatoria durante unos cientos de generaciones, emergen formas reconocibles: franjas largas hacia la izquierda, cuñas cortas hacia la derecha, bloques estacionarios. Matthew Cook catalogó más de una docena de especies de planeadores — A, B, C₁, C₂, D₁, D₂, E, F, G, H — cada una con su propia velocidad y anchura. Las colisiones entre planeadores actúan como puertas lógicas: el par correcto produce una señal estable, el incorrecto se aniquila. Es el juego de la vida de Conway comprimido en una dimensión, con el mismo zoológico emergente y la misma insinuación de computación.",
    },
    {
      pretitle: "Sección 05 · Turing-completitud",
      title: "Cook 2004 — universalidad desde un byte",
      body: "La construcción de Matthew Cook, completada en Wolfram Research a finales de los noventa y finalmente publicada en 2004 tras una larga disputa editorial, muestra que el zoológico de planeadores de la Regla 110 puede simular un sistema de etiquetas cíclico — y los sistemas de etiquetas cíclicos son a su vez Turing-completos. Cualquier programa, cualquier cómputo, cualquier algoritmo puede codificarse como una fila inicial de celdas; la Regla 110, aplicada suficiente tiempo, ejecuta ese programa. La prueba requiere miles de celdas por paso lógico y es célebremente intrincada, pero la conclusión es limpia: una tabla de búsqueda de una sola línea es un computador universal. Sin reloj, sin memoria, sin conjunto de instrucciones — solo una regla.",
    },
    {
      pretitle: "Sección 06 · Universalidad por todas partes",
      title: "La complejidad desde la simplicidad es un tema profundo",
      body: "La Regla 110 es una entrada en un libro mayor. El juego de la vida de Conway es Turing-completo; también el sistema de teselas de Wang; también las bolas de billar, las películas de jabón y ciertos amontonamientos de dominós. El principio de equivalencia computacional de Wolfram conjetura que, más allá de un umbral bajo de complejidad, esencialmente todo sistema que no sea obviamente simple es universal en sentido computacional. Sobreviva o no la conjetura, el patrón empírico es inequívoco: la universalidad es barata. La naturaleza no tuvo que esperar a los transistores. Una fila de celdas y un byte de regla siempre han bastado.",
    },
  ],
  classesCaption: "Las cuatro clases de Wolfram · semilla de una sola celda",
  classesLabels: {
    c1: "Clase 1 · Regla 0 — muere",
    c2: "Clase 2 · Regla 90 — Sierpiński",
    c3: "Clase 3 · Regla 30 — caos",
    c4: "Clase 4 · Regla 110 — planeadores",
  },
  rivalsCaption: "Misma semilla, tres reglas",
  rivalsLabels: {
    r30: "Regla 30 — caótica",
    r90: "Regla 90 — fractal",
    r110: "Regla 110 — computacional",
  },
  lookupPretitle: "Interactivo · la tabla de búsqueda",
  lookupTitle: "Construye cualquiera de las 256 reglas con ocho clics",
  lookupBody:
    "Cada azulejo muestra uno de los ocho patrones de vecindario y el bit de salida que produce. Pulsa una salida para cambiarla. La cadena binaria de abajo se actualiza en vivo; su valor decimal es el número de la regla. Los presets te llevan directo a cuatro reglas célebres.",
  lookupCaption: "Tabla de búsqueda · pulsa un bit de salida",
  simulatorPretitle: "Interactivo · el simulador",
  simulatorTitle: "Mira la regla que acabas de construir",
  simulatorBody:
    "El lienzo ejecuta la regla actual durante tantos pasos como pida el control deslizante, empezando por una única celda central o una fila aleatoria. Edita la tabla de arriba y la imagen se redibuja al instante — siente tú mismo cuán drásticamente puede cambiarlo todo un solo bit invertido.",
  simulatorCaption: "Evolución en vivo · regla actual",
  closingTitle: "Abre el Simulador.",
  closingBody:
    "El Simulador completo te permite cambiar la paleta, ralentizar el paso de tiempo hasta el arrastre, saltar a las ocho reglas más estudiadas y sembrar la rejilla desde el borde para experimentos asimétricos. Todo con lo que jugaste, con más espacio para respirar.",
  ctaLabel: "→ Abrir el Simulador",
};

const fr: RichStory = {
  encounter: {
    pretitle: "Première rencontre",
    title: "Huit bits de règle. Un univers entier.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Trace une rangée de cellules, chacune noire ou blanche. Regarde chaque cellule avec ses deux voisines — trois cellules, huit motifs possibles. Une règle dit, pour chaque motif, ce que la cellule devient ensuite. Huit sorties. Huit bits. Un octet. Il existe exactement 256 telles règles — et l'une d'elles, la Règle 110, suffit à faire tout ce qu'un ordinateur peut faire.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Écris les huit motifs de voisinage en binaire décroissant : 111, 110, 101, 100, 011, 010, 001, 000. Sous chacun, note la sortie de la Règle 110. Lis les sorties comme un seul nombre binaire — 01101110 — et convertis : c'est le décimal 110. Le nom est, littéralement, la règle.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "À la fin des années 1990, Matthew Cook a démontré chez Wolfram Research que la Règle 110 est Turing-complète ; l'article n'a paru qu'en 2004 dans Complex Systems après une longue dispute éditoriale. Avec le bon motif initial elle simule n'importe quel ordinateur, n'importe quel algorithme, tout ce qui est calculable. Depuis huit bits. Le plus simple automate cellulaire universel connu — et probablement le plus simple ordinateur universel jamais découvert.",
      },
    ],
    tryIt:
      "En dessous : bascule toi-même les huit bits de sortie et regarde la règle tourner en direct.",
  },
  sections: [
    {
      pretitle: "Section 01 · Les 256 règles élémentaires",
      title: "Le zoo de Wolfram, en quatre classes",
      body: "Stephen Wolfram a catalogué dans les années 1980 chacun des 256 automates cellulaires élémentaires et a remarqué un fait frappant : leur comportement à long terme se range dans quatre grandes classes. La classe 1 meurt en noir ou blanc uniforme. La classe 2 se range en bandes ou en motifs périodiques simples. La classe 3 est pseudo-aléatoire — du bruit qui ne se répète jamais tout à fait. La classe 4 est le rare et étrange entre-deux : des îlots d'ordre dérivant dans du bruit, des planeurs qui se heurtent, une structure ni périodique ni chaotique. L'universalité se cache dans la classe 4 — et la Règle 110 en est le vaisseau amiral.",
    },
    {
      pretitle: "Section 02 · Lire la règle",
      title: "De huit motifs à un seul nombre",
      body: "Toute règle élémentaire regarde trois cellules (gauche, centre, droite) et renvoie un bit. Huit entrées 3 bits possibles, une sortie chacune — exactement une fonction de {0,1}³ vers {0,1}, soit exactement 8 bits d'information, soit un octet. Place les sorties dans l'ordre canonique de Wolfram — l'entrée 111 donne le bit de poids fort, 000 le bit de poids faible — et l'octet que tu lis est le numéro de la règle. La Règle 30 donne 00011110₂. La Règle 110 donne 01101110₂. Le nom n'est pas décoratif ; il est la règle.",
    },
    {
      pretitle: "Section 03 · Règle 30 contre Règle 110",
      title: "Chaos et structure, côte à côte",
      body: "Prends la Règle 30 et la cellule centrale d'une rangée régulière diverge en un aléa apparent si convaincant que Mathematica utilise encore la Règle 30 comme générateur de nombres pseudo-aléatoires. Prends la Règle 90 et la même graine peint un triangle de Sierpiński parfait — ordre récursif pur. La Règle 110 se tient entre les deux : un fond rayé tissé de dizaines de planeurs triangulaires qui dérivent, se heurtent, se recombinent. Ni chaos (comme 30), ni cristal (comme 90). C'est, exactement, du calcul.",
    },
    {
      pretitle: "Section 04 · Planeurs dans la Règle 110",
      title: "Pièces en mouvement, comme Life mais à une dimension",
      body: "Si tu laisses la Règle 110 tourner sur une rangée aléatoire pendant quelques centaines de générations, des formes reconnaissables émergent : longues bandes vers la gauche, courts coins vers la droite, blocs stationnaires. Matthew Cook a catalogué plus d'une douzaine d'espèces de planeurs — A, B, C₁, C₂, D₁, D₂, E, F, G, H — chacune avec sa vitesse et sa largeur. Les collisions de planeurs agissent comme des portes logiques : la bonne paire produit un signal stable, la mauvaise s'annihile. C'est le Jeu de la vie de Conway compressé en une dimension, avec le même zoo émergent et le même soupçon de calcul.",
    },
    {
      pretitle: "Section 05 · Turing-complétude",
      title: "Cook 2004 — l'universalité depuis un octet",
      body: "La construction de Matthew Cook, achevée chez Wolfram Research à la fin des années 1990 et finalement publiée en 2004 après une longue dispute éditoriale, montre que le zoo de planeurs de la Règle 110 peut simuler un système de tag cyclique — et les systèmes de tag cycliques sont eux-mêmes Turing-complets. Tout programme, tout calcul, tout algorithme peut s'encoder comme une rangée initiale de cellules ; la Règle 110, appliquée assez longtemps, exécute ce programme. La preuve réclame des milliers de cellules par pas logique et est célèbre pour son enchevêtrement, mais la conclusion est nette : une table de correspondance d'une ligne est un ordinateur universel. Pas d'horloge, pas de mémoire, pas de jeu d'instructions — juste une règle.",
    },
    {
      pretitle: "Section 06 · Universalité partout",
      title: "La complexité depuis la simplicité, un thème profond",
      body: "La Règle 110 n'est qu'une entrée dans un registre plus long. Le Jeu de la vie de Conway est Turing-complet ; les tuiles de Wang aussi ; les boules de billard, les films de savon et certaines piles de dominos le sont également. Le principe d'équivalence computationnelle de Wolfram conjecture qu'au-delà d'un seuil bas de complexité, pratiquement tout système qui n'est pas manifestement simple est universel sur le plan computationnel. Que la conjecture survive ou non, le motif empirique est sans équivoque : l'universalité est bon marché. La nature n'a pas eu à attendre les transistors. Une rangée de cellules et un octet de règle ont toujours suffi.",
    },
  ],
  classesCaption: "Les quatre classes de Wolfram · graine d'une seule cellule",
  classesLabels: {
    c1: "Classe 1 · Règle 0 — meurt",
    c2: "Classe 2 · Règle 90 — Sierpiński",
    c3: "Classe 3 · Règle 30 — chaos",
    c4: "Classe 4 · Règle 110 — planeurs",
  },
  rivalsCaption: "Même graine, trois règles",
  rivalsLabels: {
    r30: "Règle 30 — chaotique",
    r90: "Règle 90 — fractale",
    r110: "Règle 110 — calculatoire",
  },
  lookupPretitle: "Interactif · la table de correspondance",
  lookupTitle: "Construis n'importe laquelle des 256 règles en huit clics",
  lookupBody:
    "Chaque tuile montre l'un des huit motifs de voisinage et le bit de sortie qu'il produit. Clique une sortie pour la basculer. La chaîne binaire en bas se met à jour en direct ; sa valeur décimale est le numéro de la règle. Les préréglages t'envoient droit à quatre règles célèbres.",
  lookupCaption: "Table de correspondance · clique un bit de sortie",
  simulatorPretitle: "Interactif · le simulateur",
  simulatorTitle: "Regarde la règle que tu viens de construire",
  simulatorBody:
    "Le canevas exécute la règle courante pour autant de pas que le curseur le demande, en partant d'une seule cellule centrale ou d'une rangée aléatoire. Modifie la table ci-dessus et l'image se redessine instantanément — sens par toi-même à quel point un seul bit basculé peut tout changer.",
  simulatorCaption: "Évolution en direct · règle courante",
  closingTitle: "Ouvre le Simulateur.",
  closingBody:
    "Le Simulateur complet te permet de changer de palette, ralentir le pas de temps au minimum, sauter aux huit règles les plus étudiées et amorcer la grille depuis le bord pour des expériences asymétriques. Tout ce avec quoi tu viens de jouer, avec plus d'espace pour respirer.",
  ctaLabel: "→ Ouvrir le Simulateur",
};

const it: RichStory = {
  encounter: {
    pretitle: "Primo incontro",
    title: "Otto bit di regola. Un intero universo.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Disegna una riga di celle, ciascuna nera o bianca. Guarda ogni cella con le sue due vicine — tre celle, otto motivi possibili. Una regola dice, per ogni motivo, in cosa diventa la cella. Otto uscite. Otto bit. Un byte. Esistono esattamente 256 regole così — e una di esse, la Regola 110, basta a fare tutto ciò che un computer può fare.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Scrivi gli otto motivi di vicinato in ordine binario decrescente: 111, 110, 101, 100, 011, 010, 001, 000. Sotto ciascuno scrivi l'uscita della Regola 110. Leggi le uscite come un unico numero binario — 01101110 — e converti: è il decimale 110. Il nome è, letteralmente, la regola.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Alla fine degli anni '90 Matthew Cook ha dimostrato alla Wolfram Research che la Regola 110 è Turing-completa; il lavoro è apparso solo nel 2004 su Complex Systems dopo una lunga disputa editoriale. Con il motivo iniziale giusto simula qualsiasi computer, qualsiasi algoritmo, qualsiasi cosa sia calcolabile. A partire da otto bit. L'automa cellulare universale più semplice conosciuto — e probabilmente il computer universale più semplice mai scoperto.",
      },
    ],
    tryIt: "Sotto: capovolgi tu stesso gli otto bit di uscita e guarda la regola correre dal vivo.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Le 256 regole elementari",
      title: "Lo zoo di Wolfram, ordinato in quattro classi",
      body: "Stephen Wolfram catalogò negli anni '80 ciascuno dei 256 automi cellulari elementari e notò qualcosa di sorprendente: il loro comportamento a lungo termine ricade in quattro grandi classi. La classe 1 muore in nero o bianco uniforme. La classe 2 si assesta in strisce o motivi periodici semplici. La classe 3 è pseudo-casuale — rumore che non si ripete mai del tutto. La classe 4 è la rara, strana via di mezzo: isole di ordine che galleggiano nel rumore, alianti che si scontrano, struttura né periodica né caotica. L'universalità si nasconde nella classe 4 — e la Regola 110 ne è l'ammiraglia.",
    },
    {
      pretitle: "Sezione 02 · Leggere la regola",
      title: "Da otto motivi a un singolo numero",
      body: "Ogni regola elementare guarda tre celle (sinistra, centro, destra) e restituisce un bit. Otto possibili ingressi a 3 bit, un'uscita ciascuno — è esattamente una funzione da {0,1}³ a {0,1}, cioè esattamente 8 bit di informazione, cioè un byte. Disponi le uscite nell'ordine canonico di Wolfram — l'ingresso 111 dà il bit più alto, 000 quello più basso — e il byte che leggi è il numero della regola. La Regola 30 dà 00011110₂. La Regola 110 dà 01101110₂. Il nome non è decorativo; è la regola.",
    },
    {
      pretitle: "Sezione 03 · Regola 30 contro Regola 110",
      title: "Caos e struttura, fianco a fianco",
      body: "Prendi la Regola 30 e la cella centrale di una riga uniforme diverge in una casualità apparente così convincente che Mathematica usa ancora la Regola 30 come generatore di numeri pseudo-casuali. Prendi la Regola 90 e lo stesso seme dipinge un triangolo di Sierpiński perfetto — ordine ricorsivo puro. La Regola 110 sta tra le due: uno sfondo rigato intessuto da decine di alianti triangolari che vanno alla deriva, si scontrano, si ricombinano. Non è né caos (come 30) né cristallo (come 90). È, esattamente, calcolo.",
    },
    {
      pretitle: "Sezione 04 · Alianti nella Regola 110",
      title: "Pezzi in moto, come Life ma in una dimensione",
      body: "Se lasci correre la Regola 110 su una riga casuale per qualche centinaio di generazioni, emergono forme riconoscibili: lunghe strisce verso sinistra, brevi cunei verso destra, blocchi fermi. Matthew Cook ha catalogato più di una dozzina di specie di alianti — A, B, C₁, C₂, D₁, D₂, E, F, G, H — ciascuna con velocità e larghezza proprie. Le collisioni tra alianti agiscono come porte logiche: la coppia giusta produce un segnale stabile, quella sbagliata si annichila. È il Game of Life di Conway compresso in una dimensione, con lo stesso zoo emergente e lo stesso accenno di calcolo.",
    },
    {
      pretitle: "Sezione 05 · Turing-completezza",
      title: "Cook 2004 — universalità da un byte",
      body: "La costruzione di Matthew Cook, completata alla Wolfram Research alla fine degli anni '90 e pubblicata definitivamente nel 2004 dopo una lunga disputa editoriale, mostra che lo zoo di alianti della Regola 110 può simulare un sistema di tag ciclico — e i sistemi di tag ciclici sono a loro volta Turing-completi. Qualsiasi programma, qualsiasi calcolo, qualsiasi algoritmo può essere codificato come riga iniziale di celle; la Regola 110, applicata a lungo, esegue quel programma. La dimostrazione richiede migliaia di celle per passo logico ed è notoriamente intricata, ma la conclusione è netta: una tabella di lookup di una riga è un computer universale. Niente clock, niente memoria, niente set di istruzioni — solo una regola.",
    },
    {
      pretitle: "Sezione 06 · Universalità ovunque",
      title: "La complessità dalla semplicità è un tema profondo",
      body: "La Regola 110 è una voce in un registro più lungo. Il Game of Life di Conway è Turing-completo; lo è anche il sistema di tasselli di Wang; lo sono le palle da biliardo, i film di sapone e certe pile di tessere del domino. Il principio di equivalenza computazionale di Wolfram congettura che, oltre una soglia bassa di complessità, praticamente ogni sistema che non sia ovviamente semplice è computazionalmente universale. Che la congettura regga o no, il pattern empirico è inequivocabile: l'universalità è a buon mercato. La natura non ha dovuto aspettare i transistor. Una riga di celle e un byte di regola sono sempre bastati.",
    },
  ],
  classesCaption: "Le quattro classi di Wolfram · seme a singola cella",
  classesLabels: {
    c1: "Classe 1 · Regola 0 — muore",
    c2: "Classe 2 · Regola 90 — Sierpiński",
    c3: "Classe 3 · Regola 30 — caos",
    c4: "Classe 4 · Regola 110 — alianti",
  },
  rivalsCaption: "Stesso seme, tre regole",
  rivalsLabels: {
    r30: "Regola 30 — caotica",
    r90: "Regola 90 — frattale",
    r110: "Regola 110 — computazionale",
  },
  lookupPretitle: "Interattivo · la tabella di lookup",
  lookupTitle: "Costruisci una qualsiasi delle 256 regole con otto clic",
  lookupBody:
    "Ogni tassello mostra uno degli otto motivi di vicinato e il bit di uscita che produce. Clicca un'uscita per ribaltarla. La stringa binaria in basso si aggiorna in tempo reale; il suo valore decimale è il numero della regola. I preset ti portano dritto a quattro regole celebri.",
  lookupCaption: "Tabella di lookup · clicca un bit di uscita",
  simulatorPretitle: "Interattivo · il simulatore",
  simulatorTitle: "Guarda la regola che hai appena costruito",
  simulatorBody:
    "Il canvas esegue la regola corrente per quanti passi chiede il cursore, partendo da una singola cella centrale o da una riga casuale. Modifica la tabella sopra e l'immagine si ridisegna all'istante — senti tu stesso quanto drasticamente un solo bit ribaltato possa cambiare tutto.",
  simulatorCaption: "Evoluzione dal vivo · regola corrente",
  closingTitle: "Apri il Simulatore.",
  closingBody:
    "Il Simulatore completo ti lascia cambiare palette, rallentare il passo temporale fino a strisciare, saltare alle otto regole più studiate e seminare la griglia dal bordo per esperimenti asimmetrici. Tutto ciò con cui hai appena giocato, con più spazio per respirare.",
  ctaLabel: "→ Apri il Simulatore",
};

const pt: RichStory = {
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Oito bits de regra. Um universo inteiro.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Desenha uma fila de células, cada uma preta ou branca. Olha para cada célula com as duas vizinhas — três células, oito padrões possíveis. Uma regra diz, para cada padrão, no que a célula se torna a seguir. Oito saídas. Oito bits. Um byte. Existem exatamente 256 regras assim — e uma delas, a Regra 110, basta para fazer tudo o que um computador pode fazer.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Escreve os oito padrões de vizinhança em ordem binária decrescente: 111, 110, 101, 100, 011, 010, 001, 000. Por baixo de cada um, anota a saída da Regra 110. Lê as saídas como um único número binário — 01101110 — e converte: dá o decimal 110. O nome é, literalmente, a regra.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "No final dos anos 90, Matthew Cook provou na Wolfram Research que a Regra 110 é Turing-completa; o artigo só apareceu em 2004 em Complex Systems, após uma longa disputa editorial. Com o padrão inicial certo simula qualquer computador, qualquer algoritmo, tudo o que é computável. A partir de oito bits. O autómato celular universal mais simples conhecido — e provavelmente o computador universal mais simples alguma vez descoberto.",
      },
    ],
    tryIt: "Em baixo: inverte tu mesmo os oito bits de saída e vê a regra correr ao vivo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · As 256 regras elementares",
      title: "O zoo de Wolfram, ordenado em quatro classes",
      body: "Stephen Wolfram catalogou nos anos 80 cada um dos 256 autómatos celulares elementares e notou algo impressionante: o comportamento a longo prazo cai em quatro grandes classes. A classe 1 morre num preto ou branco uniforme. A classe 2 assenta em faixas ou padrões periódicos simples. A classe 3 é pseudo-aleatória — ruído que nunca chega a repetir-se. A classe 4 é o raro e estranho meio-termo: ilhas de ordem a flutuar no ruído, planadores a colidir, estrutura que não é nem periódica nem caótica. A universalidade esconde-se na classe 4 — e a Regra 110 é a sua nau capitânea.",
    },
    {
      pretitle: "Secção 02 · Ler a regra",
      title: "De oito padrões a um único número",
      body: "Cada regra elementar olha para três células (esquerda, centro, direita) e devolve um bit. Oito entradas possíveis de 3 bits, uma saída cada — é exatamente uma função de {0,1}³ para {0,1}, ou seja, exatamente 8 bits de informação, ou seja, um byte. Coloca as saídas na ordem canónica de Wolfram — a entrada 111 dá o bit mais alto, 000 o mais baixo — e o byte que lês é o número da regra. A Regra 30 dá 00011110₂. A Regra 110 dá 01101110₂. O nome não é decorativo; é a regra.",
    },
    {
      pretitle: "Secção 03 · Regra 30 vs Regra 110",
      title: "Caos e estrutura, lado a lado",
      body: "Escolhe a Regra 30 e a célula central de uma fila uniforme diverge numa aparente aleatoriedade tão convincente que o Mathematica ainda usa a Regra 30 como gerador de números pseudo-aleatórios. Escolhe a Regra 90 e a mesma semente pinta um triângulo de Sierpiński perfeito — ordem recursiva pura. A Regra 110 fica entre as duas: um fundo às riscas atravessado por dezenas de planadores triangulares que derivam, colidem e se recombinam. Não é nem caos (como 30) nem cristal (como 90). É, exatamente, computação.",
    },
    {
      pretitle: "Secção 04 · Planadores na Regra 110",
      title: "Peças em movimento, como Life mas a uma dimensão",
      body: "Se deixares a Regra 110 correr numa fila aleatória durante algumas centenas de gerações, surgem formas reconhecíveis: longas faixas para a esquerda, curtas cunhas para a direita, blocos parados. Matthew Cook catalogou mais de uma dúzia de espécies de planadores — A, B, C₁, C₂, D₁, D₂, E, F, G, H — cada uma com a sua velocidade e largura. As colisões entre planadores funcionam como portas lógicas: o par certo produz um sinal estável, o par errado aniquila-se. É o jogo da vida de Conway comprimido numa dimensão, com o mesmo zoo emergente e a mesma sugestão de computação.",
    },
    {
      pretitle: "Secção 05 · Turing-completude",
      title: "Cook 2004 — universalidade a partir de um byte",
      body: "A construção de Matthew Cook, concluída na Wolfram Research no final dos anos 90 e finalmente publicada em 2004 após uma longa disputa editorial, mostra que o zoo de planadores da Regra 110 pode simular um sistema de tags cíclicos — e os sistemas de tags cíclicos são, por sua vez, Turing-completos. Qualquer programa, qualquer cálculo, qualquer algoritmo pode ser codificado como uma fila inicial de células; a Regra 110, aplicada o suficiente, executa esse programa. A prova exige milhares de células por passo lógico e é célebre pela complexidade, mas a conclusão é limpa: uma tabela de procura de uma linha é um computador universal. Sem relógio, sem memória, sem conjunto de instruções — apenas uma regra.",
    },
    {
      pretitle: "Secção 06 · Universalidade por toda a parte",
      title: "Complexidade a partir da simplicidade é um tema profundo",
      body: "A Regra 110 é uma entrada num livro maior. O jogo da vida de Conway é Turing-completo; também o é o sistema de mosaicos de Wang; também o são bolas de bilhar, películas de sabão e certas pilhas de dominós. O princípio de equivalência computacional de Wolfram conjectura que, para além de um limiar baixo de complexidade, praticamente todo o sistema que não seja obviamente simples é universal computacionalmente. Sobreviva ou não a conjectura, o padrão empírico é inequívoco: a universalidade é barata. A natureza não teve de esperar pelos transístores. Uma fila de células e um byte de regra sempre chegaram.",
    },
  ],
  classesCaption: "As quatro classes de Wolfram · semente de uma única célula",
  classesLabels: {
    c1: "Classe 1 · Regra 0 — morre",
    c2: "Classe 2 · Regra 90 — Sierpiński",
    c3: "Classe 3 · Regra 30 — caos",
    c4: "Classe 4 · Regra 110 — planadores",
  },
  rivalsCaption: "Mesma semente, três regras",
  rivalsLabels: {
    r30: "Regra 30 — caótica",
    r90: "Regra 90 — fractal",
    r110: "Regra 110 — computacional",
  },
  lookupPretitle: "Interativo · a tabela de procura",
  lookupTitle: "Constrói qualquer uma das 256 regras com oito cliques",
  lookupBody:
    "Cada peça mostra um dos oito padrões de vizinhança e o bit de saída que produz. Clica numa saída para a inverter. A cadeia binária em baixo atualiza-se ao vivo; o seu valor decimal é o número da regra. As predefinições levam-te direto a quatro regras célebres.",
  lookupCaption: "Tabela de procura · clica num bit de saída",
  simulatorPretitle: "Interativo · o simulador",
  simulatorTitle: "Vê a regra que acabaste de construir",
  simulatorBody:
    "A tela executa a regra atual pelo número de passos que o cursor pedir, começando por uma única célula central ou uma fila aleatória. Edita a tabela acima e a imagem redesenha-se ao instante — sente por ti próprio quão drasticamente um único bit invertido pode mudar tudo.",
  simulatorCaption: "Evolução ao vivo · regra atual",
  closingTitle: "Abre o Simulador.",
  closingBody:
    "O Simulador completo permite-te trocar de paleta, abrandar o passo temporal até quase parar, saltar para as oito regras mais estudadas e semear a grelha a partir da borda para experiências assimétricas. Tudo com que acabaste de brincar, com mais espaço para respirar.",
  ctaLabel: "→ Abrir o Simulador",
};

const sv: RichStory = {
  encounter: {
    pretitle: "Första mötet",
    title: "Åtta bitar regel. Ett helt universum.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Rita en rad celler, var och en svart eller vit. Titta på varje cell tillsammans med dess två grannar — tre celler, åtta möjliga mönster. En regel säger, för varje mönster, vad cellen blir härnäst. Åtta utgångar. Åtta bitar. En byte. Det finns exakt 256 sådana regler — och en av dem, Regel 110, räcker för att göra allt en dator kan göra.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Skriv de åtta grannskaps­mönstren i fallande binär ordning: 111, 110, 101, 100, 011, 010, 001, 000. Skriv under varje mönster utgången för Regel 110. Läs utgångarna som ett enda binärt tal — 01101110 — och konvertera: det är decimaltalet 110. Namnet är bokstavligen regeln.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "I slutet av 1990-talet bevisade Matthew Cook på Wolfram Research att Regel 110 är Turing-komplett; arbetet publicerades först 2004 i Complex Systems efter en lång publikationstvist. Med rätt startmönster simulerar den vilken dator som helst, vilken algoritm som helst, allt som är beräkningsbart. Från åtta bitar. Den enklaste kända universella cellulära automaten — och troligen den enklaste universella dator som någonsin upptäckts.",
      },
    ],
    tryIt: "Nedan: vrid själv på de åtta utgångsbitarna och se regeln rulla live.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · De 256 elementära reglerna",
      title: "Wolframs zoo, sorterat i fyra klasser",
      body: "Stephen Wolfram katalogiserade på 1980-talet var och en av de 256 elementära cellulära automatena och märkte något slående: deras långtidsbeteende faller i fyra breda klasser. Klass 1 dör ut i enhetligt svart eller vitt. Klass 2 lägger sig i ränder eller enkla periodiska mönster. Klass 3 är pseudo-slumpmässig — brus som aldrig riktigt upprepar sig. Klass 4 är den sällsynta, märkliga mellangrunden: öar av ordning som driver genom brus, glidare som krockar, struktur som varken är periodisk eller kaotisk. Universaliteten gömmer sig i klass 4 — och Regel 110 är dess flaggskepp.",
    },
    {
      pretitle: "Avsnitt 02 · Att läsa regeln",
      title: "Från åtta mönster till ett enda tal",
      body: "Varje elementär regel tittar på tre celler (vänster, mitt, höger) och returnerar en bit. Åtta möjliga 3-bitars-ingångar, en utgång var — det är exakt en funktion från {0,1}³ till {0,1}, alltså exakt 8 bitars information, alltså en byte. Lägg utgångarna i Wolframs kanoniska ordning — ingång 111 ger den högsta biten, 000 den lägsta — och den byte du läser av är regelns nummer. Regel 30 ger 00011110₂. Regel 110 ger 01101110₂. Namnet är inte dekorativt; det är regeln.",
    },
    {
      pretitle: "Avsnitt 03 · Regel 30 mot Regel 110",
      title: "Kaos och struktur, sida vid sida",
      body: "Välj Regel 30 och mittencellen i en jämn rad divergerar i en skenbar slumpmässighet så övertygande att Mathematica än idag använder Regel 30 som pseudoslumptals­generator. Välj Regel 90 och samma frö målar en perfekt Sierpiński-triangel — ren rekursiv ordning. Regel 110 sitter mellan dem: en randig bakgrund vävd med dussintals triangulära glidare som driver, krockar och rekombinerar. Den är varken kaos (som 30) eller kristall (som 90). Den är, exakt, beräkning.",
    },
    {
      pretitle: "Avsnitt 04 · Glidare i Regel 110",
      title: "Rörliga delar, som Life fast endimensionellt",
      body: "Låter du Regel 110 köra på en slumprad i några hundra generationer dyker igenkännbara former upp: långa vänsterförflyttande ränder, korta högerförflyttande kilar, stationära block. Matthew Cook katalogiserade över ett dussin distinkta glidararter — A, B, C₁, C₂, D₁, D₂, E, F, G, H — var och en med egen hastighet och bredd. Glidar­krockar verkar som logiska grindar: rätt par ger en stabil signal, fel par utplånar varandra. Det är Conways Game of Life ihoptryckt till en dimension, med samma framväxande zoo och samma antydan om beräkning.",
    },
    {
      pretitle: "Avsnitt 05 · Turing-komplettering",
      title: "Cook 2004 — universalitet från en byte",
      body: "Matthew Cooks konstruktion, färdig på Wolfram Research i slutet av 1990-talet och slutligen publicerad 2004 efter en lång publikationstvist, visar att glidarzoot i Regel 110 kan simulera ett cykliskt tagg-system — och cykliska tagg-system är själva Turing-kompletta. Varje program, varje beräkning, varje algoritm kan kodas som en startrad celler; Regel 110, applicerad tillräckligt länge, kör det programmet. Beviset kräver tusentals celler per logiskt steg och är ökänt invecklat, men slutsatsen är klar: en enradig uppslagningstabell är en universell dator. Ingen klocka, inget minne, ingen instruktionsuppsättning — bara en regel.",
    },
    {
      pretitle: "Avsnitt 06 · Universalitet överallt",
      title: "Komplexitet från enkelhet är ett djupt tema",
      body: "Regel 110 är en post i en längre liggare. Conways Game of Life är Turing-komplett; även Wang-plattssystemet; även biljardbollar, tvålhinnor och vissa hopar av dominobrickor. Wolframs princip om beräknings­ekvivalens förmodar att, bortom en låg komplexitets­tröskel, i princip varje system som inte uppenbart är enkelt är beräkningsmässigt universellt. Vare sig förmodandet håller eller ej är det empiriska mönstret omisskännligt: universalitet är billigt. Naturen behövde inte vänta på transistorer. En rad celler och en byte regel har alltid räckt.",
    },
  ],
  classesCaption: "De fyra Wolfram-klasserna · encells-frö",
  classesLabels: {
    c1: "Klass 1 · Regel 0 — dör",
    c2: "Klass 2 · Regel 90 — Sierpiński",
    c3: "Klass 3 · Regel 30 — kaos",
    c4: "Klass 4 · Regel 110 — glidare",
  },
  rivalsCaption: "Samma frö, tre regler",
  rivalsLabels: {
    r30: "Regel 30 — kaotisk",
    r90: "Regel 90 — fraktal",
    r110: "Regel 110 — beräknande",
  },
  lookupPretitle: "Interaktivt · uppslagstabellen",
  lookupTitle: "Bygg vilken som helst av de 256 reglerna med åtta klick",
  lookupBody:
    "Varje ruta visar ett av de åtta grannskapsmönstren och utgångsbiten den ger. Klicka på en utgång för att vända den. Den binära strängen längst ned uppdateras live; dess decimalvärde är regelns nummer. Förinställningarna tar dig direkt till fyra berömda regler.",
  lookupCaption: "Uppslagstabell · klicka på en utgångsbit",
  simulatorPretitle: "Interaktivt · simulatorn",
  simulatorTitle: "Se regeln du just byggde",
  simulatorBody:
    "Duken kör den aktuella regeln så många steg reglaget begär, med start från en enda mittcell eller en slumpmässig rad. Redigera tabellen ovan och bilden ritas om omedelbart — känn själv hur dramatiskt en enda omvänd bit kan ändra allt.",
  simulatorCaption: "Liveutveckling · aktuell regel",
  closingTitle: "Öppna simulatorn.",
  closingBody:
    "Den fullständiga simulatorn låter dig byta palett, sakta ner tidssteget till krypfart, hoppa till de åtta mest studerade reglerna och så rutnätet från kanten för asymmetriska experiment. Allt du just lekt med, med mer plats att andas.",
  ctaLabel: "→ Öppna simulatorn",
};

const no: RichStory = {
  encounter: {
    pretitle: "Første møte",
    title: "Åtte biter regel. Et helt univers.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Tegn en rad celler, hver svart eller hvit. Se på hver celle sammen med dens to naboer — tre celler, åtte mulige mønstre. En regel sier, for hvert mønster, hva cellen blir neste gang. Åtte utganger. Åtte biter. En byte. Det finnes nøyaktig 256 slike regler — og én av dem, Regel 110, holder for å gjøre alt en datamaskin kan gjøre.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Skriv de åtte nabolagsmønstrene i synkende binær rekkefølge: 111, 110, 101, 100, 011, 010, 001, 000. Under hvert mønster skriver du utgangen for Regel 110. Les utgangene som ett enkelt binært tall — 01101110 — og regn om: det er desimaltallet 110. Navnet er bokstavelig talt regelen.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "På slutten av 1990-tallet beviste Matthew Cook ved Wolfram Research at Regel 110 er Turing-komplett; arbeidet ble først publisert i 2004 i Complex Systems etter en lang publiseringsstrid. Med riktig startmønster simulerer den hvilken som helst datamaskin, hvilken som helst algoritme, alt som er beregnbart. Fra åtte biter. Den enkleste kjente universelle cellulære automaten — og trolig den enkleste universelle datamaskinen som noensinne er oppdaget.",
      },
    ],
    tryIt: "Under: vri selv på de åtte utgangsbitene og se regelen kjøre live.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · De 256 elementære reglene",
      title: "Wolframs dyrehage, sortert i fire klasser",
      body: "Stephen Wolfram katalogiserte på 1980-tallet hver av de 256 elementære cellulære automatene og la merke til noe slående: deres langtidsoppførsel faller i fire brede klasser. Klasse 1 dør ut i ensartet svart eller hvitt. Klasse 2 legger seg i striper eller enkle periodiske mønstre. Klasse 3 er pseudo-tilfeldig — støy som aldri helt gjentar seg. Klasse 4 er den sjeldne, merkelige mellomgrunnen: øyer av orden som driver gjennom støy, glidere som kolliderer, struktur som verken er periodisk eller kaotisk. Universaliteten skjuler seg i klasse 4 — og Regel 110 er flaggskipet.",
    },
    {
      pretitle: "Avsnitt 02 · Lese regelen",
      title: "Fra åtte mønstre til ett enkelt tall",
      body: "Hver elementær regel ser på tre celler (venstre, midt, høyre) og returnerer én bit. Åtte mulige 3-biters innganger, én utgang hver — det er nøyaktig en funksjon fra {0,1}³ til {0,1}, altså nøyaktig 8 biter informasjon, altså én byte. Legg utgangene i Wolframs kanoniske rekkefølge — inngang 111 gir den høyeste biten, 000 den laveste — og byten du leser av er regelens nummer. Regel 30 gir 00011110₂. Regel 110 gir 01101110₂. Navnet er ikke dekorativt; det er regelen.",
    },
    {
      pretitle: "Avsnitt 03 · Regel 30 mot Regel 110",
      title: "Kaos og struktur, side om side",
      body: "Velg Regel 30 og midtcellen i en jevn rad divergerer i en tilsynelatende tilfeldighet så overbevisende at Mathematica fortsatt bruker Regel 30 som pseudo-tilfeldig tallgenerator. Velg Regel 90 og samme frø maler en perfekt Sierpiński-trekant — ren rekursiv orden. Regel 110 sitter mellom dem: en stripet bakgrunn vevd med titalls trekantede glidere som driver, kolliderer og rekombinerer. Den er verken kaos (som 30) eller krystall (som 90). Den er, nøyaktig, beregning.",
    },
    {
      pretitle: "Avsnitt 04 · Glidere i Regel 110",
      title: "Bevegelige biter, som Life men i én dimensjon",
      body: "Lar du Regel 110 kjøre på en tilfeldig rad i noen hundre generasjoner, dukker gjenkjennelige former opp: lange venstre­løpende striper, korte høyre­løpende kiler, stille­stående blokker. Matthew Cook katalogiserte over et dusin distinkte gliderarter — A, B, C₁, C₂, D₁, D₂, E, F, G, H — hver med egen hastighet og bredde. Gliderkollisjoner fungerer som logiske porter: riktig par gir et stabilt signal, feil par utsletter hverandre. Det er Conways Game of Life presset sammen i én dimensjon, med samme fremvoksende dyrehage og samme antydning av beregning.",
    },
    {
      pretitle: "Avsnitt 05 · Turing-kompletthet",
      title: "Cook 2004 — universalitet fra én byte",
      body: "Matthew Cooks konstruksjon, fullført ved Wolfram Research på slutten av 1990-tallet og endelig publisert i 2004 etter en lang publiseringsstrid, viser at glidersamlingen i Regel 110 kan simulere et syklisk tag-system — og sykliske tag-systemer er selv Turing-komplette. Ethvert program, enhver beregning, enhver algoritme kan kodes som en startrad av celler; Regel 110, anvendt lenge nok, kjører det programmet. Beviset krever tusenvis av celler per logisk steg og er beryktet for sin innfløkthet, men konklusjonen er ren: en énrads oppslagstabell er en universell datamaskin. Ingen klokke, intet minne, intet instruksjonssett — bare en regel.",
    },
    {
      pretitle: "Avsnitt 06 · Universalitet overalt",
      title: "Kompleksitet fra enkelhet er et dypt tema",
      body: "Regel 110 er én oppføring i en lengre bok. Conways Game of Life er Turing-komplett; det samme er Wang-flissystemet; det samme er biljardkuler, såpehinner og visse stabler med dominobrikker. Wolframs prinsipp om beregnings­ekvivalens antar at, utover en lav kompleksitetstroskel, praktisk talt ethvert system som ikke åpenbart er enkelt er beregningsmessig universelt. Enten antakelsen står seg eller ikke, er det empiriske mønsteret umiskjennelig: universalitet er billig. Naturen trengte ikke vente på transistorer. En rad celler og en byte regel har alltid vært nok.",
    },
  ],
  classesCaption: "De fire Wolfram-klassene · encellet frø",
  classesLabels: {
    c1: "Klasse 1 · Regel 0 — dør",
    c2: "Klasse 2 · Regel 90 — Sierpiński",
    c3: "Klasse 3 · Regel 30 — kaos",
    c4: "Klasse 4 · Regel 110 — glidere",
  },
  rivalsCaption: "Samme frø, tre regler",
  rivalsLabels: {
    r30: "Regel 30 — kaotisk",
    r90: "Regel 90 — fraktal",
    r110: "Regel 110 — beregnende",
  },
  lookupPretitle: "Interaktivt · oppslagstabellen",
  lookupTitle: "Bygg hvilken som helst av de 256 reglene med åtte klikk",
  lookupBody:
    "Hver flis viser ett av de åtte nabolagsmønstrene og utgangsbiten den gir. Klikk på en utgang for å vri den. Den binære strengen nederst oppdateres live; desimalverdien er regelens nummer. Forhåndsinnstillingene tar deg rett til fire kjente regler.",
  lookupCaption: "Oppslagstabell · klikk på en utgangsbit",
  simulatorPretitle: "Interaktivt · simulatoren",
  simulatorTitle: "Se regelen du nettopp bygde",
  simulatorBody:
    "Lerretet kjører den aktuelle regelen så mange steg glidebryteren ber om, med start fra én enkelt midtcelle eller en tilfeldig rad. Rediger tabellen over og bildet tegnes på nytt umiddelbart — kjenn selv hvor dramatisk en eneste vendt bit kan endre alt.",
  simulatorCaption: "Liveutvikling · aktuell regel",
  closingTitle: "Åpne simulatoren.",
  closingBody:
    "Den fulle simulatoren lar deg bytte palett, bremse tidssteget til snegletempo, hoppe til de åtte mest studerte reglene og så rutenettet fra kanten for asymmetriske eksperimenter. Alt du nettopp lekte med, med mer plass å puste på.",
  ctaLabel: "→ Åpne simulatoren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function Rule110Story() {
  const { locale, s, u } = useI18n();
  const page = s.pages.rule110;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  // Lift the live rule into this page so the lookup-table editor and the
  // mini-simulator share state — flipping a bit above redraws the canvas
  // below instantly.
  const [rule, setRule] = useState(110);

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-signal-cyan/10 via-transparent to-ink-950" />

      {/* Hero — unchanged structure (data from shared stories.ts) */}
      <section className="mx-auto mb-32 max-w-5xl space-y-7 text-center">
        <Reveal>
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
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
              href="/rule110/simulator"
              className="rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20"
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
            01101110₂ = 110₁₀
          </div>
        </Reveal>
      </section>

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
                    <div className="hairline mt-4 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                      <div>
                        <span className="text-ink-400">patterns</span> · 111 110 101 100 011 010 001
                        000
                      </div>
                      <div>
                        <span className="text-ink-400">outputs</span> ·{" "}
                        <span className="text-signal-cyan">0 1 1 0 1 1 1 0</span> ={" "}
                        <span className="text-signal-amber">110</span>
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

      {/* Section 01 — the 256 elementary rules + class gallery */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.classesCaption}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <ClassPanel rule={0} label={story.classesLabels.c1} accent="text-ink-300" />
              <ClassPanel rule={90} label={story.classesLabels.c2} accent="text-signal-violet" />
              <ClassPanel rule={30} label={story.classesLabels.c3} accent="text-signal-amber" />
              <ClassPanel rule={110} label={story.classesLabels.c4} accent="text-signal-cyan" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — reading the rule */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline rounded-2xl border bg-ink-950/40 p-6">
            <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
              {[
                { p: "111", v: 0 },
                { p: "110", v: 1 },
                { p: "101", v: 1 },
                { p: "100", v: 0 },
                { p: "011", v: 1 },
                { p: "010", v: 1 },
                { p: "001", v: 1 },
                { p: "000", v: 0 },
              ].map(({ p, v }) => (
                <div key={p} className="space-y-2 text-center">
                  <div className="flex justify-center gap-0.5">
                    {p.split("").map((b, i) => (
                      <div
                        key={i}
                        className={`hairline h-5 w-5 rounded-sm border ${
                          b === "1" ? "border-signal-cyan/60 bg-signal-cyan" : "bg-ink-950"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[10px] text-ink-400">{p}</div>
                  <div className="flex justify-center">
                    <div
                      className={`hairline h-5 w-5 rounded-sm border ${
                        v === 1 ? "border-signal-cyan/60 bg-signal-cyan" : "bg-ink-950"
                      }`}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-signal-cyan">{v}</div>
                </div>
              ))}
            </div>
            <div className="hairline mt-6 border-t pt-4 text-center font-mono text-sm text-ink-100">
              <span className="text-signal-cyan">0 1 1 0 1 1 1 0</span>
              <span className="text-ink-400">₂ = </span>
              <span className="text-signal-amber">110</span>
              <span className="text-ink-400">₁₀</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — Rule 30 vs Rule 110 vs Rule 90 */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.rivalsCaption}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                  {story.rivalsLabels.r30}
                </div>
                <Rule110Demo rule={30} initial="single" accent="text-signal-amber" cycleMs={9000} />
              </div>
              <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
                  {story.rivalsLabels.r90}
                </div>
                <Rule110Demo
                  rule={90}
                  initial="single"
                  accent="text-signal-violet"
                  cycleMs={9000}
                />
              </div>
              <div className="hairline space-y-2 rounded-md border bg-ink-950/60 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                  {story.rivalsLabels.r110}
                </div>
                <Rule110Demo rule={110} initial="random" accent="text-signal-cyan" cycleMs={9000} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 · lookup-table editor */}
      <section className="mx-auto mb-16 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.lookupPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.lookupTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.lookupBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Rule110LookupTable rule={rule} onRuleChange={setRule} caption={story.lookupCaption} />
        </Reveal>
      </section>

      {/* INTERACTIVE 2 · mini simulator (shares `rule` state with the lookup editor) */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.simulatorPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.simulatorTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.simulatorBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
            <Rule110MiniSimulator rule={rule} caption={story.simulatorCaption} />
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-5 md:max-w-[260px]">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                live · rule {rule}
              </div>
              <div className="space-y-2 font-mono text-[11px] leading-relaxed text-ink-300">
                <div>
                  <span className="text-ink-400">binary</span> ·{" "}
                  <span className="text-signal-cyan">{rule.toString(2).padStart(8, "0")}</span>
                </div>
                <div>
                  <span className="text-ink-400">decimal</span> ·{" "}
                  <span className="text-signal-amber">{rule}</span>
                </div>
                <div>
                  <span className="text-ink-400">of</span> · 256 total
                </div>
              </div>
              <p className="hairline border-t pt-2 text-[11px] leading-relaxed text-ink-300">
                Flip a bit in the table above and the canvas redraws instantly.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — gliders */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      {/* Section 05 — Turing-completeness */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard pretitle={sec4.pretitle} title={sec4.title} body={sec4.body} accent={ACCENT} />
      </section>

      {/* Section 06 — universality everywhere */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard pretitle={sec5.pretitle} title={sec5.title} body={sec5.body} accent={ACCENT} />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/rule110/simulator"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

function ClassPanel({ rule, label, accent }: { rule: number; label: string; accent: string }) {
  return (
    <div className="space-y-2">
      <div className="hairline rounded-md border bg-ink-950/60 p-2">
        <Rule110Demo rule={rule} initial="single" accent={accent} cycleMs={12000} />
      </div>
      <div className={`font-mono text-[10px] uppercase tracking-widest ${accent}`}>{label}</div>
    </div>
  );
}
