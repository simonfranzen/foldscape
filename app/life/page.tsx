"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { palette } from "@/lib/visual/palette";
import { Reveal } from "@/components/Reveal";
import { LifeGliderDemo } from "@/components/LifeGliderDemo";
import { LifeMiniSandbox } from "@/components/LifeMiniSandbox";
import { LifeRuleExplorer } from "@/components/LifeRuleExplorer";
import { TopicApplications } from "@/components/TopicApplications";
import { RelatedTopics } from "@/components/RelatedTopics";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Rich, per-locale story content for the Game of Life atlas page. The base
// hero (pretitle/title/tagline/intro/CTA) still comes from s.pages.life;
// everything below the hero is authored inline so the page can tell a long
// story without touching the shared i18n bundles.
// --------------------------------------------------------------------------

type RichStory = {
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
  sandboxCaption: string;
  ruleExplorerCaption: string;
  sandboxLabels: {
    play: string;
    pause: string;
    step: string;
    clear: string;
    glider: string;
    blinker: string;
    pulsar: string;
    gun: string;
    generation: string;
    population: string;
    hint: string;
  };
  ruleLabels: {
    title: string;
    caption: string;
    step: string;
    reset: string;
    playPause: string;
    pause: string;
    birth: string;
    survive: string;
    presetLabel: string;
  };
  ruleBlock: {
    pretitle: string;
    born: string;
    survive: string;
    lonely: string;
    crowded: string;
    notation: string;
    neighbourhoodLabel: string;
    neighbourhoodNote: string;
  };
  zooBlock: {
    gliderLabel: string;
    gliderCaption: string;
    lwssLabel: string;
    lwssCaption: string;
  };
  sandboxBlock: {
    pretitle: string;
    heading: string;
  };
  computeBlock: {
    wiresLabel: string;
    wiresBody: string;
    gatesLabel: string;
    gatesBody: string;
    memoryLabel: string;
    memoryBody: string;
    clockLabel: string;
    clockBody: string;
  };
  ruleExplorerBlock: {
    pretitle: string;
    heading: string;
  };
  gunStats: {
    yearLabel: string;
    cellsLabel: string;
    gliderEveryLabel: string;
    gliderEveryValue: string;
  };
  miniGridLabels: {
    shapesCaption: string;
    blockStill: string;
    genSame: string;
    blinkerGen0: string;
    genFlipped: string;
  };
};

const en: RichStory = {
  encounter: {
    pretitle: "First encounter",
    title: "Four lines. A universe.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Take a grid. Each square is alive or dead. Apply four small rules to every square at once, then again, and again. Out of those four lines emerge spaceships that travel, factories that fire, oscillators that breathe, and — given enough room — calculators that add. Nobody puts the spaceships there. They just appear.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Born if exactly three live neighbours, survives with two or three, else die. That's the whole rule, written B3/S23. Drop a 2×2 Block and it never changes. Drop a straight line of three cells, a Blinker, and it flips between horizontal and vertical forever — one rule pulse per heartbeat.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "John Conway invented this in 1970 as a parlour game. By 1982 hobbyists had built logic gates from glider streams; by 2000 a Turing machine; by 2010 a CPU; by 2014 a Game of Life simulator running inside a Game of Life. Universal computation, discovered hiding inside a toy.",
      },
    ],
    tryIt: "Below: read the rules, watch the zoo, then click cells yourself.",
  },
  sections: [
    {
      pretitle: "Section 01 · The rules",
      title: "B3/S23 — born three, survive two or three",
      body: "Every cell counts its eight neighbours. A dead cell with exactly three live neighbours wakes up — birth. A live cell with two or three neighbours stays alive — survival. Anything else dies, from loneliness with fewer than two or from suffocation with more than three. That's it. The whole physics of this world fits in fourteen words. Everything else — the spaceships, the guns, the computers — is just consequence.",
    },
    {
      pretitle: "Section 02 · The zoo",
      title: "Still lifes, oscillators, spaceships",
      body: "Some shapes never move: the 2×2 Block, the Beehive, the Loaf — still lifes. Others pulse: the Blinker flips period 2, the Toad period 2, the Beacon period 2, the Pulsar period 3. And some shapes move across the grid by repeating themselves shifted: spaceships. The Glider, five cells, slides one square diagonally every four generations. The Lightweight Spaceship cruises straight. Catalogues now list tens of thousands of named patterns.",
    },
    {
      pretitle: "Section 03 · The glider gun",
      title: "Bill Gosper, 1970 — and Conway's fifty dollars",
      body: "Conway had conjectured that no Life pattern could grow forever. A bounded universe seemed reasonable. He offered fifty dollars to anyone who broke the conjecture. In November 1970, Bill Gosper's group at MIT found a pattern of 36 cells that fires a glider every 30 generations, forever — the first glider gun. The population grows without bound. Conway paid up. Suddenly Life was unbounded, and the door to building things inside it was wide open.",
    },
    {
      pretitle: "Section 04 · Universal computation",
      title: "Wires, gates, memory, clocks",
      body: "Treat a stream of gliders as a wire carrying bits — glider present is 1, absent is 0. Collisions between glider streams implement AND, OR, NOT. Loops of glider streams store bits — memory. Glider guns provide the clock. With those primitives you can build any Boolean circuit, and from any Boolean circuit, any computation. Paul Rendell built a working Turing machine entirely from Life patterns in 2000; Adam Goucher's metafier turned full CPUs into Life mosaics. Conway's four-line rule is Turing-complete.",
    },
    {
      pretitle: "Section 05 · Self-replication and meta-Life",
      title: "OTCA metapixels and Game of Life in Game of Life",
      body: "In 2006 Brice Due designed the OTCA metapixel — a 2048×2048 Life pattern whose collective behaviour, viewed from far enough away, is itself a single Life cell. Tile a whole grid with OTCA metapixels and you get Game of Life running inside Game of Life, indistinguishable in the limit from the original. Self-replicating patterns followed: in 2010 Andrew Wade built Gemini, a pattern of 846,278 live cells spanning a roughly 4.2-million-cell-wide bounding box, copying itself every 33.7 million generations. The toy contains itself.",
    },
    {
      pretitle: "Section 06 · Open frontiers",
      title: "Exotic rules, Margolus blocks, Hashlife",
      body: "Conway's B3/S23 is one point in a vast space. HighLife (B36/S23) adds period-12 replicators. Day & Night is symmetric under colour inversion. Seeds (B2/S) is purely generative — nothing ever survives. Margolus neighbourhoods partition the grid into 2×2 blocks and update them as units, giving reversible automata. Bill Gosper's Hashlife algorithm memoises space-time regions to simulate 10^20 generations in seconds. There is a whole biology to discover, one rule string at a time.",
    },
  ],
  closingTitle: "Your turn.",
  closingBody:
    "The Sandbox holds a 120×70 toroidal grid, seven classic patterns and a draw-by-dragging tool. Open it, click around, see what survives.",
  ctaLabel: "→ Open the Sandbox",
  sandboxCaption: "Inline sandbox · click cells, press play, try a preset.",
  ruleExplorerCaption: "Same starting soup · different B/S rules · watch them diverge.",
  sandboxLabels: {
    play: "Play",
    pause: "Pause",
    step: "Step",
    clear: "Clear",
    glider: "Glider",
    blinker: "Blinker",
    pulsar: "Pulsar",
    gun: "Gosper gun",
    generation: "gen",
    population: "alive",
    hint: "Click or drag to toggle cells. Then press play, or step one tick at a time.",
  },
  ruleLabels: {
    title: "Rule explorer",
    caption: "Flip a digit and the universe changes. Same seed, different physics.",
    step: "Step",
    reset: "Reset",
    playPause: "Play",
    pause: "Pause",
    birth: "Birth",
    survive: "Survive",
    presetLabel: "Preset",
  },
  ruleBlock: {
    pretitle: "The rule, in fourteen words",
    born: "If a dead cell is surrounded by exactly 3 live neighbours, it flips on.",
    survive: "A living cell holding on to 2 or 3 live neighbours carries over to the next step.",
    lonely: "Fewer than two live neighbours: dies of loneliness.",
    crowded: "More than three live neighbours: dies of overcrowding.",
    notation:
      "Notation: B3/S23. Born list / survive list. All other automata in this family are written the same way.",
    neighbourhoodLabel: "3×3 neighbourhood",
    neighbourhoodNote: "Each cell C looks at its eight surrounding squares.",
  },
  zooBlock: {
    gliderLabel: "The Glider · period 4",
    gliderCaption:
      "Five cells, period four, glides one diagonal per cycle. The first known spaceship — Conway's group named it in 1970.",
    lwssLabel: "Lightweight Spaceship · period 4",
    lwssCaption:
      "Nine cells, cruises orthogonally at c/2. Discovered by Conway in 1970; the smallest non-glider spaceship.",
  },
  sandboxBlock: {
    pretitle: "Inline sandbox · click cells",
    heading: "Build something. Press play.",
  },
  computeBlock: {
    wiresLabel: "Wires",
    wiresBody: "Streams of gliders carry bits along straight tracks.",
    gatesLabel: "Gates",
    gatesBody: "Collisions between gliders implement AND, OR, NOT.",
    memoryLabel: "Memory",
    memoryBody: "Loops of glider streams (or eaters plus reflectors) hold a bit.",
    clockLabel: "Clock",
    clockBody: "Glider guns fire on a fixed period, providing the heartbeat.",
  },
  ruleExplorerBlock: {
    pretitle: "Rule explorer · flip a digit",
    heading: "Change the physics. Watch it diverge.",
  },
  gunStats: {
    yearLabel: "Year",
    cellsLabel: "Cells in the gun",
    gliderEveryLabel: "Glider every",
    gliderEveryValue: "30 gens",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · two simple shapes",
    blockStill: "Block · still",
    genSame: "gen 1 · same",
    blinkerGen0: "Blinker · gen 0",
    genFlipped: "gen 1 · flipped",
  },
};

const de: RichStory = {
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Vier Zeilen. Ein Universum.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Nimm ein Gitter. Jede Zelle ist lebendig oder tot. Wende auf alle Zellen gleichzeitig vier kleine Regeln an, dann noch einmal, und noch einmal. Aus diesen vier Zeilen wachsen Raumschiffe, die wandern, Fabriken, die feuern, Oszillatoren, die atmen — und mit genug Platz Rechenmaschinen, die addieren. Niemand baut die Raumschiffe hinein. Sie erscheinen einfach.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Geboren bei genau drei lebenden Nachbarn, überlebt bei zwei oder drei, sonst stirbt. Das ist die ganze Regel, geschrieben B3/S23. Setz einen 2×2-Block hin — er bleibt für immer. Setz drei Zellen in eine Reihe, einen Blinker, und er kippt für immer zwischen waagerecht und senkrecht hin und her — ein Regelpuls pro Herzschlag.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "John Conway erfand das 1970 als Gesellschaftsspiel. 1982 bauten Bastler:innen Logikgatter aus Gleiterströmen, 2000 eine Turing-Maschine, 2010 eine CPU, 2014 einen Game-of-Life-Simulator innerhalb von Game of Life. Universelle Berechnung, entdeckt in einem Spielzeug.",
      },
    ],
    tryIt: "Unten: lies die Regeln, schau dem Zoo zu, dann klick selbst Zellen an.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Regeln",
      title: "B3/S23 — geboren bei drei, überlebt bei zwei oder drei",
      body: "Jede Zelle zählt ihre acht Nachbarn. Eine tote Zelle mit genau drei lebenden Nachbarn wacht auf — Geburt. Eine lebende Zelle mit zwei oder drei Nachbarn bleibt am Leben — Überleben. Alles andere stirbt: an Einsamkeit mit weniger als zwei, an Überfüllung mit mehr als drei. Das war's. Die ganze Physik dieser Welt passt in vierzehn Wörter. Alles andere — die Raumschiffe, die Kanonen, die Computer — ist nur Konsequenz.",
    },
    {
      pretitle: "Abschnitt 02 · Der Zoo",
      title: "Stillleben, Oszillatoren, Raumschiffe",
      body: "Manche Formen bewegen sich nie: der 2×2-Block, der Bienenstock, der Laib — Stillleben. Andere pulsieren: der Blinker mit Periode 2, die Kröte mit Periode 2, das Leuchtfeuer mit Periode 2, der Pulsar mit Periode 3. Und manche Formen bewegen sich, indem sie sich verschoben wiederholen: Raumschiffe. Der Gleiter, fünf Zellen, rutscht alle vier Generationen ein Feld diagonal. Das leichte Raumschiff fliegt geradeaus. Kataloge listen mittlerweile Zehntausende benannte Muster.",
    },
    {
      pretitle: "Abschnitt 03 · Die Gleiterkanone",
      title: "Bill Gosper, 1970 — und Conways fünfzig Dollar",
      body: "Conway hatte vermutet, dass kein Life-Muster unendlich wachsen kann. Eine begrenzte Welt schien plausibel. Er bot fünfzig Dollar, wer die Vermutung widerlegt. Im November 1970 fand Bill Gospers Gruppe am MIT ein 36-Zellen-Muster, das alle 30 Generationen einen Gleiter abfeuert, für immer — die erste Gleiterkanone. Die Population wächst unbeschränkt. Conway zahlte. Plötzlich war Life unbeschränkt, und die Tür, Dinge darin zu bauen, stand sperrangelweit offen.",
    },
    {
      pretitle: "Abschnitt 04 · Universelle Berechnung",
      title: "Drähte, Gatter, Speicher, Takt",
      body: "Behandle einen Gleiterstrom als Draht, der Bits trägt — Gleiter da ist 1, kein Gleiter ist 0. Kollisionen zwischen Strömen ergeben UND, ODER, NICHT. Schleifen aus Gleiterströmen speichern Bits — Arbeitsspeicher. Gleiterkanonen liefern den Takt. Mit diesen Grundbausteinen baust du jeden booleschen Schaltkreis, und aus jedem booleschen Schaltkreis jede Berechnung. Paul Rendell baute 2000 eine voll funktionsfähige Turing-Maschine ausschließlich aus Life-Mustern; Adam Gouchers Metafier verwandelt ganze CPUs in Life-Mosaike. Conways Vier-Zeilen-Regel ist Turing-vollständig.",
    },
    {
      pretitle: "Abschnitt 05 · Selbstreplikation und Meta-Life",
      title: "OTCA-Metapixel und Game of Life in Game of Life",
      body: "2006 entwarf Brice Due das OTCA-Metapixel — ein 2048×2048-Life-Muster, dessen Gesamtverhalten von weit genug weg betrachtet selbst wieder eine einzige Life-Zelle ist. Kachle ein ganzes Gitter mit OTCA-Metapixeln, und du erhältst Game of Life laufend in Game of Life, im Grenzwert ununterscheidbar vom Original. Selbstreplizierende Muster folgten: 2010 baute Andrew Wade Gemini, ein Muster aus 846.278 lebenden Zellen in einem rund 4,2 Millionen Zellen breiten Begrenzungsrahmen, das sich alle 33,7 Millionen Generationen selbst kopiert. Das Spielzeug enthält sich selbst.",
    },
    {
      pretitle: "Abschnitt 06 · Offene Grenzen",
      title: "Exotische Regeln, Margolus-Blöcke, Hashlife",
      body: "Conways B3/S23 ist ein Punkt in einem riesigen Raum. HighLife (B36/S23) bringt Periode-12-Replikatoren mit. Day & Night ist symmetrisch unter Farbumkehr. Seeds (B2/S) ist rein generativ — nichts überlebt je. Margolus-Nachbarschaften teilen das Gitter in 2×2-Blöcke und aktualisieren sie als Einheit, was reversible Automaten ergibt. Bill Gospers Hashlife-Algorithmus merkt sich Raum-Zeit-Regionen und simuliert 10^20 Generationen in Sekunden. Es gibt eine ganze Biologie zu entdecken, eine Regelzeichenkette nach der anderen.",
    },
  ],
  closingTitle: "Du bist dran.",
  closingBody:
    "Die Sandbox hält ein 120×70-Torus-Gitter, sieben klassische Muster und ein Zieh-Werkzeug bereit. Öffne sie, klick herum, sieh, was überlebt.",
  ctaLabel: "→ Sandbox öffnen",
  sandboxCaption: "Inline-Sandbox · Zellen klicken, abspielen, Preset probieren.",
  ruleExplorerCaption: "Selbe Anfangssuppe · andere B/S-Regeln · sieh sie auseinanderlaufen.",
  sandboxLabels: {
    play: "Start",
    pause: "Pause",
    step: "Schritt",
    clear: "Leeren",
    glider: "Gleiter",
    blinker: "Blinker",
    pulsar: "Pulsar",
    gun: "Gosper-Kanone",
    generation: "gen",
    population: "lebt",
    hint: "Klicken oder ziehen schaltet Zellen um. Dann Start drücken oder einzeln steppen.",
  },
  ruleLabels: {
    title: "Regel-Explorer",
    caption: "Eine Ziffer kippen, und das Universum ändert sich. Selbe Saat, andere Physik.",
    step: "Schritt",
    reset: "Reset",
    playPause: "Start",
    pause: "Pause",
    birth: "Geburt",
    survive: "Überleben",
    presetLabel: "Preset",
  },
  ruleBlock: {
    pretitle: "Die Regel, in vierzehn Wörtern",
    born: "Hat eine tote Zelle genau 3 lebende Nachbarn, geht sie an.",
    survive: "Eine lebende Zelle mit 2 oder 3 lebenden Nachbarn trägt sich weiter.",
    lonely: "Weniger als zwei lebende Nachbarn: stirbt aus Einsamkeit.",
    crowded: "Mehr als drei lebende Nachbarn: stirbt durch Überfüllung.",
    notation:
      "Notation: B3/S23. Geburts-Liste / Überlebens-Liste. Alle anderen Automaten dieser Familie werden genauso notiert.",
    neighbourhoodLabel: "3×3-Nachbarschaft",
    neighbourhoodNote: "Jede Zelle C betrachtet ihre acht umliegenden Felder.",
  },
  zooBlock: {
    gliderLabel: "Der Gleiter · Periode 4",
    gliderCaption:
      "Fünf Zellen, Periode vier, gleitet pro Zyklus eine Diagonale weit. Das erste bekannte Raumschiff — Conways Gruppe taufte es 1970.",
    lwssLabel: "Leichtes Raumschiff · Periode 4",
    lwssCaption:
      "Neun Zellen, fährt orthogonal mit c/2. Von Conway 1970 entdeckt; das kleinste Raumschiff jenseits des Gleiters.",
  },
  sandboxBlock: {
    pretitle: "Inline-Sandbox · klicke auf Zellen",
    heading: "Bau was. Drück Play.",
  },
  computeBlock: {
    wiresLabel: "Drähte",
    wiresBody: "Gleiterströme tragen Bits entlang gerader Bahnen.",
    gatesLabel: "Gatter",
    gatesBody: "Kollisionen zwischen Gleitern ergeben UND, ODER, NICHT.",
    memoryLabel: "Speicher",
    memoryBody: "Schleifen aus Gleiterströmen (oder Esser plus Reflektoren) halten ein Bit.",
    clockLabel: "Takt",
    clockBody: "Gleiterkanonen feuern in fester Periode und liefern den Herzschlag.",
  },
  ruleExplorerBlock: {
    pretitle: "Regel-Explorer · Ziffer kippen",
    heading: "Ändere die Physik. Sieh sie auseinanderlaufen.",
  },
  gunStats: {
    yearLabel: "Jahr",
    cellsLabel: "Zellen in der Kanone",
    gliderEveryLabel: "Gleiter alle",
    gliderEveryValue: "30 Gen.",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · zwei einfache Formen",
    blockStill: "Block · unverändert",
    genSame: "Gen 1 · gleich",
    blinkerGen0: "Blinker · Gen 0",
    genFlipped: "Gen 1 · gekippt",
  },
};

const es: RichStory = {
  encounter: {
    pretitle: "Primer encuentro",
    title: "Cuatro líneas. Un universo.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Toma una cuadrícula. Cada casilla está viva o muerta. Aplica cuatro pequeñas reglas a todas las casillas a la vez, otra vez, y otra. De esas cuatro líneas emergen naves que viajan, fábricas que disparan, osciladores que respiran — y, con espacio suficiente, calculadoras que suman. Nadie pone las naves ahí. Sencillamente aparecen.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Nace si tiene exactamente tres vecinos vivos, sobrevive con dos o tres, en otro caso muere. Esa es toda la regla, escrita B3/S23. Deja un Bloque 2×2 y nunca cambia. Deja una línea recta de tres celdas, un Parpadeador, y oscila entre horizontal y vertical para siempre — un pulso de regla por latido.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "John Conway inventó esto en 1970 como juego de salón. En 1982 hubo aficionados que construyeron puertas lógicas con chorros de planeadores; en 2000, una máquina de Turing; en 2010, una CPU; en 2014, un simulador de Game of Life corriendo dentro de Game of Life. Cómputo universal, descubierto escondido en un juguete.",
      },
    ],
    tryIt: "Abajo: lee las reglas, mira el zoo, luego haz clic en las celdas tú mismo.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Las reglas",
      title: "B3/S23 — nace con tres, sobrevive con dos o tres",
      body: "Cada célula cuenta sus ocho vecinas. Una célula muerta con exactamente tres vecinas vivas despierta — nacimiento. Una célula viva con dos o tres vecinas sigue viva — supervivencia. Lo demás muere, por soledad con menos de dos o por asfixia con más de tres. Eso es todo. Toda la física de este mundo cabe en catorce palabras. Lo demás — las naves, los cañones, los ordenadores — es solo consecuencia.",
    },
    {
      pretitle: "Sección 02 · El zoo",
      title: "Naturalezas muertas, osciladores, naves",
      body: "Algunas formas no se mueven nunca: el Bloque 2×2, la Colmena, la Hogaza — naturalezas muertas. Otras pulsan: el Parpadeador con período 2, el Sapo con período 2, el Faro con período 2, el Púlsar con período 3. Y otras se desplazan repitiéndose desplazadas: naves. El Planeador, cinco celdas, resbala una casilla en diagonal cada cuatro generaciones. La nave ligera vuela recto. Los catálogos listan ya decenas de miles de patrones con nombre propio.",
    },
    {
      pretitle: "Sección 03 · El cañón de planeadores",
      title: "Bill Gosper, 1970 — y los cincuenta dólares de Conway",
      body: "Conway había conjeturado que ningún patrón de Life podía crecer indefinidamente. Un universo acotado parecía razonable. Ofreció cincuenta dólares a quien rompiera la conjetura. En noviembre de 1970 el grupo de Bill Gosper en el MIT halló un patrón de 36 celdas que dispara un planeador cada 30 generaciones, para siempre — el primer cañón de planeadores. La población crece sin cota. Conway pagó. De pronto Life era ilimitado y la puerta para construir cosas dentro estaba abierta de par en par.",
    },
    {
      pretitle: "Sección 04 · Cómputo universal",
      title: "Cables, puertas, memoria, relojes",
      body: "Trata un chorro de planeadores como un cable que lleva bits — planeador presente es 1, ausente es 0. Las colisiones entre chorros implementan Y, O, NO. Los bucles de chorros almacenan bits — memoria. Los cañones aportan el reloj. Con esas primitivas se construye cualquier circuito booleano, y de cualquier circuito booleano, cualquier cómputo. Paul Rendell construyó en 2000 una máquina de Turing completamente con patrones de Life; el metafier de Adam Goucher convierte CPUs enteras en mosaicos de Life. La regla de cuatro líneas de Conway es Turing-completa.",
    },
    {
      pretitle: "Sección 05 · Autorreplicación y meta-Life",
      title: "Metapíxeles OTCA y Game of Life dentro de Game of Life",
      body: "En 2006 Brice Due diseñó el metapíxel OTCA — un patrón de Life de 2048×2048 cuyo comportamiento colectivo, visto desde lejos, es a su vez una única celda de Life. Embaldosa una cuadrícula entera con metapíxeles OTCA y obtienes Game of Life corriendo dentro de Game of Life, indistinguible en el límite del original. Llegaron luego patrones autorreplicantes: en 2010 Andrew Wade construyó Gemini, un patrón de 846.278 celdas vivas que abarca un cuadro delimitador de unos 4,2 millones de celdas de ancho y se copia cada 33,7 millones de generaciones. El juguete se contiene a sí mismo.",
    },
    {
      pretitle: "Sección 06 · Fronteras abiertas",
      title: "Reglas exóticas, bloques de Margolus, Hashlife",
      body: "El B3/S23 de Conway es un punto en un espacio enorme. HighLife (B36/S23) añade replicadores de período 12. Day & Night es simétrico bajo inversión de color. Seeds (B2/S) es puramente generativo — nada sobrevive jamás. Los vecindarios de Margolus parten la cuadrícula en bloques 2×2 y los actualizan como unidad, dando autómatas reversibles. El algoritmo Hashlife de Bill Gosper memoiza regiones espacio-temporales para simular 10^20 generaciones en segundos. Hay toda una biología por descubrir, una cadena de reglas a la vez.",
    },
  ],
  closingTitle: "Tu turno.",
  closingBody:
    "El Sandbox tiene una cuadrícula toroidal de 120×70, siete patrones clásicos y una herramienta de dibujo. Ábrelo, haz clic, mira qué sobrevive.",
  ctaLabel: "→ Abrir el Sandbox",
  sandboxCaption: "Sandbox en línea · haz clic en celdas, pulsa play, prueba un preset.",
  ruleExplorerCaption: "Misma sopa inicial · distintas reglas B/S · míralas divergir.",
  sandboxLabels: {
    play: "Play",
    pause: "Pausa",
    step: "Paso",
    clear: "Limpiar",
    glider: "Planeador",
    blinker: "Parpadeador",
    pulsar: "Púlsar",
    gun: "Cañón Gosper",
    generation: "gen",
    population: "vivas",
    hint: "Haz clic o arrastra para alternar celdas. Luego pulsa play o avanza un paso.",
  },
  ruleLabels: {
    title: "Explorador de reglas",
    caption: "Cambia un dígito y el universo cambia. Misma semilla, otra física.",
    step: "Paso",
    reset: "Reiniciar",
    playPause: "Play",
    pause: "Pausa",
    birth: "Nacer",
    survive: "Sobrevivir",
    presetLabel: "Preset",
  },
  ruleBlock: {
    pretitle: "La regla, en catorce palabras",
    born: "Si una célula muerta queda rodeada de exactamente 3 vecinas vivas, se enciende.",
    survive: "Una célula viva que conserva 2 o 3 vecinas vivas pasa al siguiente paso.",
    lonely: "Menos de dos vecinas vivas: muere de soledad.",
    crowded: "Más de tres vecinas vivas: muere por hacinamiento.",
    notation:
      "Notación: B3/S23. Lista de nacimiento / lista de supervivencia. Todos los demás autómatas de esta familia se escriben igual.",
    neighbourhoodLabel: "Vecindad 3×3",
    neighbourhoodNote: "Cada célula C observa sus ocho casillas vecinas.",
  },
  zooBlock: {
    gliderLabel: "El Planeador · período 4",
    gliderCaption:
      "Cinco celdas, período cuatro, se desliza una diagonal por ciclo. La primera nave conocida — el grupo de Conway la bautizó en 1970.",
    lwssLabel: "Nave ligera · período 4",
    lwssCaption:
      "Nueve celdas, navega ortogonalmente a c/2. Descubierta por Conway en 1970; la nave más pequeña distinta del planeador.",
  },
  sandboxBlock: {
    pretitle: "Sandbox en línea · haz clic en celdas",
    heading: "Construye algo. Pulsa play.",
  },
  computeBlock: {
    wiresLabel: "Cables",
    wiresBody: "Chorros de planeadores llevan bits por pistas rectas.",
    gatesLabel: "Puertas",
    gatesBody: "Las colisiones entre planeadores implementan Y, O, NO.",
    memoryLabel: "Memoria",
    memoryBody: "Bucles de chorros de planeadores (o comedores más reflectores) guardan un bit.",
    clockLabel: "Reloj",
    clockBody: "Los cañones disparan con período fijo y dan el latido.",
  },
  ruleExplorerBlock: {
    pretitle: "Explorador de reglas · cambia un dígito",
    heading: "Cambia la física. Míralas divergir.",
  },
  gunStats: {
    yearLabel: "Año",
    cellsLabel: "Celdas en el cañón",
    gliderEveryLabel: "Planeador cada",
    gliderEveryValue: "30 gen",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · dos formas simples",
    blockStill: "Bloque · quieto",
    genSame: "gen 1 · igual",
    blinkerGen0: "Parpadeador · gen 0",
    genFlipped: "gen 1 · girado",
  },
};

const fr: RichStory = {
  encounter: {
    pretitle: "Première rencontre",
    title: "Quatre lignes. Un univers.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Prends une grille. Chaque case est vivante ou morte. Applique quatre petites règles à toutes les cases en même temps, puis encore, et encore. De ces quatre lignes émergent des vaisseaux qui voyagent, des usines qui tirent, des oscillateurs qui respirent — et avec assez de place, des calculatrices qui additionnent. Personne ne place les vaisseaux. Ils apparaissent, c'est tout.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Naît si exactement trois voisines vivantes, survit avec deux ou trois, sinon meurt. C'est toute la règle, écrite B3/S23. Pose un Bloc 2×2, il ne change jamais. Pose une ligne droite de trois cellules, un Clignotant, et il bascule entre horizontal et vertical à jamais — un battement de règle par cœur.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "John Conway l'a inventé en 1970 comme jeu de salon. En 1982 des amateurs construisaient des portes logiques à partir de flux de planeurs ; en 2000, une machine de Turing ; en 2010, un CPU ; en 2014, un simulateur de Game of Life tournant dans un Game of Life. Calcul universel, découvert tapi dans un jouet.",
      },
    ],
    tryIt: "Ci-dessous : lis les règles, regarde le zoo, puis clique toi-même sur les cases.",
  },
  sections: [
    {
      pretitle: "Section 01 · Les règles",
      title: "B3/S23 — née à trois, survit à deux ou trois",
      body: "Chaque cellule compte ses huit voisines. Une cellule morte avec exactement trois voisines vivantes s'éveille — naissance. Une cellule vivante avec deux ou trois voisines reste vivante — survie. Tout le reste meurt : par solitude avec moins de deux, par suffocation avec plus de trois. C'est tout. Toute la physique de ce monde tient en quatorze mots. Le reste — les vaisseaux, les canons, les ordinateurs — n'est qu'une conséquence.",
    },
    {
      pretitle: "Section 02 · Le zoo",
      title: "Natures mortes, oscillateurs, vaisseaux",
      body: "Certaines formes ne bougent jamais : le Bloc 2×2, la Ruche, le Pain — natures mortes. D'autres pulsent : le Clignotant de période 2, le Crapaud de période 2, le Phare de période 2, le Pulsar de période 3. D'autres se déplacent en se reproduisant décalées : les vaisseaux. Le Planeur, cinq cellules, glisse d'une case en diagonale toutes les quatre générations. Le vaisseau léger file droit. Les catalogues listent désormais des dizaines de milliers de motifs nommés.",
    },
    {
      pretitle: "Section 03 · Le canon à planeurs",
      title: "Bill Gosper, 1970 — et les cinquante dollars de Conway",
      body: "Conway avait conjecturé qu'aucun motif de Life ne pouvait croître indéfiniment. Un univers borné semblait raisonnable. Il offrit cinquante dollars à qui réfuterait la conjecture. En novembre 1970, l'équipe de Bill Gosper au MIT trouva un motif de 36 cellules qui tire un planeur toutes les 30 générations, pour toujours — le premier canon à planeurs. La population croît sans borne. Conway paya. Soudain Life était non borné et la porte pour bâtir des choses à l'intérieur était grande ouverte.",
    },
    {
      pretitle: "Section 04 · Calcul universel",
      title: "Fils, portes, mémoire, horloges",
      body: "Traite un flux de planeurs comme un fil portant des bits — planeur présent = 1, absent = 0. Les collisions entre flux implémentent ET, OU, NON. Les boucles de flux stockent des bits — la mémoire. Les canons fournissent l'horloge. Avec ces primitives on bâtit n'importe quel circuit booléen, et donc n'importe quel calcul. Paul Rendell a construit en 2000 une machine de Turing entièrement faite de motifs de Life ; le metafier d'Adam Goucher transforme des CPU entiers en mosaïques de Life. La règle à quatre lignes de Conway est Turing-complète.",
    },
    {
      pretitle: "Section 05 · Auto-réplication et méta-Life",
      title: "Métapixels OTCA et Game of Life dans Game of Life",
      body: "En 2006, Brice Due a conçu le métapixel OTCA — un motif de Life de 2048×2048 dont le comportement collectif, vu d'assez loin, est à son tour une cellule de Life unique. Pavé une grille entière avec des métapixels OTCA et tu obtiens du Game of Life tournant dans du Game of Life, indiscernable à la limite de l'original. Des motifs auto-répliquants ont suivi : en 2010 Andrew Wade a bâti Gemini, un motif de 846 278 cellules vivantes couvrant une boîte englobante d'environ 4,2 millions de cellules de large, qui se recopie toutes les 33,7 millions de générations. Le jouet se contient lui-même.",
    },
    {
      pretitle: "Section 06 · Frontières ouvertes",
      title: "Règles exotiques, blocs de Margolus, Hashlife",
      body: "Le B3/S23 de Conway est un point dans un espace immense. HighLife (B36/S23) ajoute des réplicateurs de période 12. Day & Night est symétrique sous inversion de couleur. Seeds (B2/S) est purement générateur — rien ne survit jamais. Les voisinages de Margolus partagent la grille en blocs 2×2 mis à jour comme des unités, donnant des automates réversibles. L'algorithme Hashlife de Bill Gosper mémoïse des régions espace-temps pour simuler 10^20 générations en quelques secondes. Toute une biologie à découvrir, une chaîne de règles à la fois.",
    },
  ],
  closingTitle: "À toi.",
  closingBody:
    "Le Sandbox propose une grille toroïdale 120×70, sept motifs classiques et un outil de dessin au glissé. Ouvre, clique, regarde ce qui survit.",
  ctaLabel: "→ Ouvrir le Sandbox",
  sandboxCaption: "Sandbox en ligne · clique sur les cases, lance, essaie un préréglage.",
  ruleExplorerCaption: "Même soupe de départ · règles B/S différentes · regarde-les diverger.",
  sandboxLabels: {
    play: "Lecture",
    pause: "Pause",
    step: "Pas",
    clear: "Effacer",
    glider: "Planeur",
    blinker: "Clignotant",
    pulsar: "Pulsar",
    gun: "Canon Gosper",
    generation: "gén",
    population: "vivantes",
    hint: "Clique ou glisse pour basculer les cases. Puis lance, ou avance d'un pas.",
  },
  ruleLabels: {
    title: "Explorateur de règles",
    caption: "Change un chiffre et l'univers change. Même graine, autre physique.",
    step: "Pas",
    reset: "Réinit.",
    playPause: "Lecture",
    pause: "Pause",
    birth: "Naissance",
    survive: "Survie",
    presetLabel: "Préréglage",
  },
  ruleBlock: {
    pretitle: "La règle, en quatorze mots",
    born: "Si une cellule morte est entourée d'exactement 3 voisines vivantes, elle s'allume.",
    survive: "Une cellule vivante qui garde 2 ou 3 voisines vivantes passe à l'étape suivante.",
    lonely: "Moins de deux voisines vivantes : meurt de solitude.",
    crowded: "Plus de trois voisines vivantes : meurt de surpopulation.",
    notation:
      "Notation : B3/S23. Liste de naissance / liste de survie. Tous les autres automates de cette famille s'écrivent de la même façon.",
    neighbourhoodLabel: "Voisinage 3×3",
    neighbourhoodNote: "Chaque cellule C regarde ses huit cases voisines.",
  },
  zooBlock: {
    gliderLabel: "Le Planeur · période 4",
    gliderCaption:
      "Cinq cellules, période quatre, glisse d'une diagonale par cycle. Le premier vaisseau connu — l'équipe de Conway l'a baptisé en 1970.",
    lwssLabel: "Vaisseau léger · période 4",
    lwssCaption:
      "Neuf cellules, file orthogonalement à c/2. Découvert par Conway en 1970 ; le plus petit vaisseau autre que le planeur.",
  },
  sandboxBlock: {
    pretitle: "Sandbox en ligne · clique sur les cases",
    heading: "Construis quelque chose. Lance.",
  },
  computeBlock: {
    wiresLabel: "Fils",
    wiresBody: "Des flux de planeurs portent des bits le long de pistes droites.",
    gatesLabel: "Portes",
    gatesBody: "Les collisions entre planeurs réalisent ET, OU, NON.",
    memoryLabel: "Mémoire",
    memoryBody: "Des boucles de flux de planeurs (ou mangeurs plus réflecteurs) gardent un bit.",
    clockLabel: "Horloge",
    clockBody: "Les canons tirent à période fixe et fournissent le battement.",
  },
  ruleExplorerBlock: {
    pretitle: "Explorateur de règles · change un chiffre",
    heading: "Change la physique. Regarde-les diverger.",
  },
  gunStats: {
    yearLabel: "Année",
    cellsLabel: "Cellules du canon",
    gliderEveryLabel: "Planeur toutes les",
    gliderEveryValue: "30 gén",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · deux formes simples",
    blockStill: "Bloc · fixe",
    genSame: "gén 1 · identique",
    blinkerGen0: "Clignotant · gén 0",
    genFlipped: "gén 1 · basculé",
  },
};

const it: RichStory = {
  encounter: {
    pretitle: "Primo incontro",
    title: "Quattro righe. Un universo.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Prendi una griglia. Ogni casella è viva o morta. Applica quattro piccole regole a tutte le caselle insieme, poi ancora, e ancora. Da quelle quattro righe sbocciano astronavi che viaggiano, fabbriche che sparano, oscillatori che respirano — e con spazio sufficiente, calcolatrici che sommano. Nessuno mette le astronavi lì. Compaiono e basta.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Nasce con esattamente tre vicine vive, sopravvive con due o tre, altrimenti muore. Questa è tutta la regola, scritta B3/S23. Posa un Blocco 2×2 e non cambia mai. Posa una linea retta di tre celle, un Lampeggiatore, e oscilla tra orizzontale e verticale per sempre — un impulso di regola per battito.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "John Conway lo inventò nel 1970 come gioco da salotto. Nel 1982 gli appassionati costruirono porte logiche con flussi di alianti; nel 2000 una macchina di Turing; nel 2010 una CPU; nel 2014 un simulatore di Game of Life che gira dentro Game of Life. Computazione universale, scoperta nascosta dentro un giocattolo.",
      },
    ],
    tryIt: "Sotto: leggi le regole, guarda lo zoo, poi clicca tu stesso le celle.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Le regole",
      title: "B3/S23 — nasce a tre, sopravvive a due o tre",
      body: "Ogni cella conta le sue otto vicine. Una cella morta con esattamente tre vicine vive si sveglia — nascita. Una cella viva con due o tre vicine resta viva — sopravvivenza. Tutto il resto muore, per solitudine sotto due o per soffocamento sopra tre. Tutto qui. L'intera fisica di questo mondo sta in quattordici parole. Il resto — le astronavi, i cannoni, i computer — è solo conseguenza.",
    },
    {
      pretitle: "Sezione 02 · Lo zoo",
      title: "Nature morte, oscillatori, astronavi",
      body: "Alcune forme non si muovono mai: il Blocco 2×2, l'Alveare, la Pagnotta — nature morte. Altre pulsano: il Lampeggiatore di periodo 2, il Rospo di periodo 2, il Faro di periodo 2, il Pulsar di periodo 3. Altre ancora si spostano replicandosi traslate: le astronavi. L'Aliante, cinque celle, scivola di una casella in diagonale ogni quattro generazioni. L'astronave leggera vola dritta. I cataloghi elencano ormai decine di migliaia di pattern con nome proprio.",
    },
    {
      pretitle: "Sezione 03 · Il cannone di alianti",
      title: "Bill Gosper, 1970 — e i cinquanta dollari di Conway",
      body: "Conway aveva congetturato che nessun pattern di Life potesse crescere all'infinito. Un universo limitato sembrava ragionevole. Offrì cinquanta dollari a chi smentisse la congettura. Nel novembre 1970 il gruppo di Bill Gosper al MIT trovò un pattern di 36 celle che spara un aliante ogni 30 generazioni, per sempre — il primo cannone di alianti. La popolazione cresce senza limiti. Conway pagò. All'improvviso Life era illimitato, e la porta per costruirci dentro era spalancata.",
    },
    {
      pretitle: "Sezione 04 · Computazione universale",
      title: "Fili, porte, memoria, clock",
      body: "Tratta un flusso di alianti come un filo che porta bit — aliante presente è 1, assente è 0. Le collisioni tra flussi realizzano AND, OR, NOT. Gli anelli di flussi memorizzano bit — memoria. I cannoni forniscono il clock. Con queste primitive si costruisce qualsiasi circuito booleano, e da qualsiasi circuito booleano qualsiasi computazione. Paul Rendell nel 2000 costruì una macchina di Turing fatta interamente di pattern di Life; il metafier di Adam Goucher trasforma intere CPU in mosaici di Life. La regola di quattro righe di Conway è Turing-completa.",
    },
    {
      pretitle: "Sezione 05 · Autoreplicazione e meta-Life",
      title: "Metapixel OTCA e Game of Life dentro Game of Life",
      body: "Nel 2006 Brice Due progettò il metapixel OTCA — un pattern di Life di 2048×2048 il cui comportamento collettivo, visto da abbastanza lontano, è a sua volta una singola cella di Life. Piastrella un'intera griglia con metapixel OTCA e ottieni Game of Life che gira dentro Game of Life, indistinguibile al limite dall'originale. Seguirono pattern autoreplicanti: nel 2010 Andrew Wade costruì Gemini, un pattern di 846.278 celle vive che occupa un riquadro di delimitazione largo circa 4,2 milioni di celle e si copia ogni 33,7 milioni di generazioni. Il giocattolo contiene se stesso.",
    },
    {
      pretitle: "Sezione 06 · Frontiere aperte",
      title: "Regole esotiche, blocchi di Margolus, Hashlife",
      body: "Il B3/S23 di Conway è un punto in uno spazio enorme. HighLife (B36/S23) aggiunge replicatori di periodo 12. Day & Night è simmetrico sotto inversione di colore. Seeds (B2/S) è puramente generativo — nulla sopravvive mai. I vicinati di Margolus partizionano la griglia in blocchi 2×2 aggiornati come unità, dando automi reversibili. L'algoritmo Hashlife di Bill Gosper memoizza regioni spazio-tempo per simulare 10^20 generazioni in secondi. C'è un'intera biologia da scoprire, una stringa di regole alla volta.",
    },
  ],
  closingTitle: "Tocca a te.",
  closingBody:
    "Il Sandbox ospita una griglia toroidale 120×70, sette pattern classici e uno strumento di disegno a trascinamento. Aprilo, clicca, guarda cosa sopravvive.",
  ctaLabel: "→ Apri il Sandbox",
  sandboxCaption: "Sandbox in linea · clicca celle, premi play, prova un preset.",
  ruleExplorerCaption: "Stessa zuppa iniziale · regole B/S diverse · guardale divergere.",
  sandboxLabels: {
    play: "Play",
    pause: "Pausa",
    step: "Passo",
    clear: "Pulisci",
    glider: "Aliante",
    blinker: "Lampeggiatore",
    pulsar: "Pulsar",
    gun: "Cannone Gosper",
    generation: "gen",
    population: "vive",
    hint: "Clicca o trascina per alternare le celle. Poi premi play o avanza di un passo.",
  },
  ruleLabels: {
    title: "Esploratore di regole",
    caption: "Cambia una cifra e l'universo cambia. Stesso seme, fisica diversa.",
    step: "Passo",
    reset: "Reset",
    playPause: "Play",
    pause: "Pausa",
    birth: "Nascita",
    survive: "Sopravvive",
    presetLabel: "Preset",
  },
  ruleBlock: {
    pretitle: "La regola, in quattordici parole",
    born: "Se una cella morta è circondata da esattamente 3 vicine vive, si accende.",
    survive: "Una cella viva che mantiene 2 o 3 vicine vive passa al passo successivo.",
    lonely: "Meno di due vicine vive: muore di solitudine.",
    crowded: "Più di tre vicine vive: muore per sovraffollamento.",
    notation:
      "Notazione: B3/S23. Lista di nascita / lista di sopravvivenza. Tutti gli altri automi di questa famiglia si scrivono allo stesso modo.",
    neighbourhoodLabel: "Vicinato 3×3",
    neighbourhoodNote: "Ogni cella C guarda le sue otto caselle circostanti.",
  },
  zooBlock: {
    gliderLabel: "L'Aliante · periodo 4",
    gliderCaption:
      "Cinque celle, periodo quattro, scivola di una diagonale per ciclo. La prima astronave conosciuta — il gruppo di Conway la battezzò nel 1970.",
    lwssLabel: "Astronave leggera · periodo 4",
    lwssCaption:
      "Nove celle, viaggia ortogonalmente a c/2. Scoperta da Conway nel 1970; la più piccola astronave diversa dall'aliante.",
  },
  sandboxBlock: {
    pretitle: "Sandbox in linea · clicca le celle",
    heading: "Costruisci qualcosa. Premi play.",
  },
  computeBlock: {
    wiresLabel: "Fili",
    wiresBody: "Flussi di alianti portano bit lungo tracce dritte.",
    gatesLabel: "Porte",
    gatesBody: "Le collisioni tra alianti realizzano AND, OR, NOT.",
    memoryLabel: "Memoria",
    memoryBody: "Anelli di flussi di alianti (o mangiatori più riflettori) mantengono un bit.",
    clockLabel: "Clock",
    clockBody: "I cannoni sparano a periodo fisso e danno il battito.",
  },
  ruleExplorerBlock: {
    pretitle: "Esploratore di regole · cambia una cifra",
    heading: "Cambia la fisica. Guardale divergere.",
  },
  gunStats: {
    yearLabel: "Anno",
    cellsLabel: "Celle nel cannone",
    gliderEveryLabel: "Aliante ogni",
    gliderEveryValue: "30 gen",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · due forme semplici",
    blockStill: "Blocco · fermo",
    genSame: "gen 1 · uguale",
    blinkerGen0: "Lampeggiatore · gen 0",
    genFlipped: "gen 1 · ribaltato",
  },
};

const pt: RichStory = {
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Quatro linhas. Um universo.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Pega numa grelha. Cada casa está viva ou morta. Aplica quatro pequenas regras a todas as casas ao mesmo tempo, depois outra vez, e outra. Dessas quatro linhas emergem naves que viajam, fábricas que disparam, osciladores que respiram — e, com espaço suficiente, calculadoras que somam. Ninguém põe lá as naves. Elas simplesmente aparecem.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Nasce com exatamente três vizinhas vivas, sobrevive com duas ou três, caso contrário morre. Esta é toda a regra, escrita B3/S23. Coloca um Bloco 2×2, nunca muda. Coloca uma linha reta de três células, um Pisca-pisca, e ele alterna entre horizontal e vertical para sempre — um pulso de regra por batimento.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "John Conway inventou isto em 1970 como jogo de salão. Em 1982 amadores construíram portas lógicas a partir de fluxos de planadores; em 2000, uma máquina de Turing; em 2010, um CPU; em 2014, um simulador de Game of Life a correr dentro de um Game of Life. Computação universal, descoberta escondida dentro de um brinquedo.",
      },
    ],
    tryIt: "Abaixo: lê as regras, vê o zoo, depois clica tu mesmo nas células.",
  },
  sections: [
    {
      pretitle: "Secção 01 · As regras",
      title: "B3/S23 — nasce com três, sobrevive com duas ou três",
      body: "Cada célula conta as suas oito vizinhas. Uma célula morta com exatamente três vizinhas vivas acorda — nascimento. Uma célula viva com duas ou três vizinhas mantém-se viva — sobrevivência. Tudo o resto morre: por solidão com menos de duas, por sufocamento com mais de três. É tudo. Toda a física deste mundo cabe em catorze palavras. Tudo o resto — as naves, os canhões, os computadores — é apenas consequência.",
    },
    {
      pretitle: "Secção 02 · O zoo",
      title: "Naturezas mortas, osciladores, naves",
      body: "Algumas formas nunca se mexem: o Bloco 2×2, a Colmeia, o Pão — naturezas mortas. Outras pulsam: o Pisca-pisca de período 2, o Sapo de período 2, o Farol de período 2, o Pulsar de período 3. E outras movem-se repetindo-se deslocadas: as naves. O Planador, cinco células, desliza uma casa na diagonal a cada quatro gerações. A nave ligeira segue a direito. Os catálogos listam hoje dezenas de milhares de padrões com nome.",
    },
    {
      pretitle: "Secção 03 · O canhão de planadores",
      title: "Bill Gosper, 1970 — e os cinquenta dólares de Conway",
      body: "Conway tinha conjecturado que nenhum padrão de Life podia crescer indefinidamente. Um universo limitado parecia razoável. Ofereceu cinquenta dólares a quem refutasse a conjectura. Em novembro de 1970, o grupo de Bill Gosper no MIT encontrou um padrão de 36 células que dispara um planador a cada 30 gerações, para sempre — o primeiro canhão de planadores. A população cresce sem limite. Conway pagou. De repente Life era ilimitado e a porta para construir coisas lá dentro estava escancarada.",
    },
    {
      pretitle: "Secção 04 · Computação universal",
      title: "Fios, portas, memória, relógios",
      body: "Trata um fluxo de planadores como um fio que leva bits — planador presente é 1, ausente é 0. Colisões entre fluxos implementam E, OU, NÃO. Ciclos de fluxos guardam bits — memória. Os canhões fornecem o relógio. Com estas primitivas constrói-se qualquer circuito booleano, e de qualquer circuito booleano, qualquer computação. Paul Rendell construiu em 2000 uma máquina de Turing inteiramente feita de padrões de Life; o metafier de Adam Goucher transforma CPUs inteiros em mosaicos de Life. A regra de quatro linhas de Conway é Turing-completa.",
    },
    {
      pretitle: "Secção 05 · Auto-replicação e meta-Life",
      title: "Metapíxeis OTCA e Game of Life dentro de Game of Life",
      body: "Em 2006 Brice Due projetou o metapíxel OTCA — um padrão de Life de 2048×2048 cujo comportamento coletivo, visto de longe o suficiente, é por sua vez uma única célula de Life. Ladrilha uma grelha inteira com metapíxeis OTCA e obténs Game of Life a correr dentro de Game of Life, no limite indistinguível do original. Seguiram-se padrões auto-replicantes: em 2010 Andrew Wade construiu Gemini, um padrão de 846.278 células vivas que ocupa uma caixa delimitadora com cerca de 4,2 milhões de células de largura e se copia a cada 33,7 milhões de gerações. O brinquedo contém-se a si próprio.",
    },
    {
      pretitle: "Secção 06 · Fronteiras abertas",
      title: "Regras exóticas, blocos de Margolus, Hashlife",
      body: "O B3/S23 de Conway é um ponto num espaço imenso. HighLife (B36/S23) acrescenta replicadores de período 12. Day & Night é simétrico sob inversão de cor. Seeds (B2/S) é puramente gerativo — nada sobrevive jamais. As vizinhanças de Margolus dividem a grelha em blocos 2×2 e atualizam-nos como unidade, dando autómatos reversíveis. O algoritmo Hashlife de Bill Gosper memoíza regiões espaço-tempo para simular 10^20 gerações em segundos. Há toda uma biologia por descobrir, uma cadeia de regras de cada vez.",
    },
  ],
  closingTitle: "É a tua vez.",
  closingBody:
    "O Sandbox tem uma grelha toroidal de 120×70, sete padrões clássicos e uma ferramenta de desenho por arrasto. Abre, clica, vê o que sobrevive.",
  ctaLabel: "→ Abrir o Sandbox",
  sandboxCaption: "Sandbox em linha · clica nas células, prime play, experimenta um preset.",
  ruleExplorerCaption: "Mesma sopa inicial · regras B/S diferentes · vê-as divergir.",
  sandboxLabels: {
    play: "Play",
    pause: "Pausa",
    step: "Passo",
    clear: "Limpar",
    glider: "Planador",
    blinker: "Pisca-pisca",
    pulsar: "Pulsar",
    gun: "Canhão Gosper",
    generation: "ger",
    population: "vivas",
    hint: "Clica ou arrasta para alternar células. Depois prime play, ou avança um passo.",
  },
  ruleLabels: {
    title: "Explorador de regras",
    caption: "Muda um dígito e o universo muda. Mesma semente, outra física.",
    step: "Passo",
    reset: "Repor",
    playPause: "Play",
    pause: "Pausa",
    birth: "Nasce",
    survive: "Sobrevive",
    presetLabel: "Preset",
  },
  ruleBlock: {
    pretitle: "A regra, em catorze palavras",
    born: "Se uma célula morta está rodeada por exatamente 3 vizinhas vivas, acende-se.",
    survive: "Uma célula viva que conserva 2 ou 3 vizinhas vivas transita para o passo seguinte.",
    lonely: "Menos de duas vizinhas vivas: morre de solidão.",
    crowded: "Mais de três vizinhas vivas: morre por superlotação.",
    notation:
      "Notação: B3/S23. Lista de nascimento / lista de sobrevivência. Todos os outros autómatos desta família escrevem-se da mesma forma.",
    neighbourhoodLabel: "Vizinhança 3×3",
    neighbourhoodNote: "Cada célula C olha para as suas oito casas vizinhas.",
  },
  zooBlock: {
    gliderLabel: "O Planador · período 4",
    gliderCaption:
      "Cinco células, período quatro, desliza uma diagonal por ciclo. A primeira nave conhecida — o grupo de Conway batizou-a em 1970.",
    lwssLabel: "Nave ligeira · período 4",
    lwssCaption:
      "Nove células, navega ortogonalmente a c/2. Descoberta por Conway em 1970; a menor nave que não é o planador.",
  },
  sandboxBlock: {
    pretitle: "Sandbox em linha · clica nas células",
    heading: "Constrói algo. Prime play.",
  },
  computeBlock: {
    wiresLabel: "Fios",
    wiresBody: "Fluxos de planadores levam bits por pistas retas.",
    gatesLabel: "Portas",
    gatesBody: "As colisões entre planadores realizam E, OU, NÃO.",
    memoryLabel: "Memória",
    memoryBody: "Ciclos de fluxos de planadores (ou comedores mais refletores) guardam um bit.",
    clockLabel: "Relógio",
    clockBody: "Os canhões disparam com período fixo e dão o batimento.",
  },
  ruleExplorerBlock: {
    pretitle: "Explorador de regras · muda um dígito",
    heading: "Muda a física. Vê-as divergir.",
  },
  gunStats: {
    yearLabel: "Ano",
    cellsLabel: "Células no canhão",
    gliderEveryLabel: "Planador a cada",
    gliderEveryValue: "30 ger",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · duas formas simples",
    blockStill: "Bloco · parado",
    genSame: "ger 1 · igual",
    blinkerGen0: "Pisca-pisca · ger 0",
    genFlipped: "ger 1 · invertido",
  },
};

const sv: RichStory = {
  encounter: {
    pretitle: "Första mötet",
    title: "Fyra rader. Ett universum.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Ta ett rutnät. Varje ruta är levande eller död. Tillämpa fyra små regler på alla rutor samtidigt, sedan igen, och igen. Ur de fyra raderna växer rymdskepp som färdas, fabriker som skjuter, oscillatorer som andas — och med tillräckligt utrymme räknemaskiner som adderar. Ingen lägger dit rymdskeppen. De dyker bara upp.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Föds vid exakt tre levande grannar, överlever med två eller tre, annars dör. Det är hela regeln, skriven B3/S23. Lägg ner ett 2×2-Block och det ändras aldrig. Lägg ner en rak rad av tre celler, en Blinkare, och den vippar mellan vågrätt och lodrätt för evigt — en regelpuls per hjärtslag.",
      },
      {
        label: "03",
        title: "Varför det betyder något",
        body: "John Conway hittade på det 1970 som sällskapsspel. Vid 1982 byggde hobbyister logiska grindar av glidarflöden; vid 2000 en Turingmaskin; vid 2010 en CPU; vid 2014 en Game of Life-simulator som körde i Game of Life. Universell beräkning, upptäckt gömd inuti en leksak.",
      },
    ],
    tryIt: "Nedan: läs reglerna, titta på djurparken, klicka sedan på rutor själv.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Reglerna",
      title: "B3/S23 — föds vid tre, överlever vid två eller tre",
      body: "Varje cell räknar sina åtta grannar. En död cell med precis tre levande grannar vaknar — födelse. En levande cell med två eller tre grannar förblir levande — överlevnad. Allt annat dör: av ensamhet under två, av kvävning över tre. Det är allt. Hela världens fysik ryms i fjorton ord. Allt annat — rymdskeppen, kanonerna, datorerna — är bara följd.",
    },
    {
      pretitle: "Avsnitt 02 · Djurparken",
      title: "Stilleben, oscillatorer, rymdskepp",
      body: "Vissa former rör sig aldrig: 2×2-Blocket, Bikupan, Limpan — stilleben. Andra pulserar: Blinkaren med period 2, Paddan med period 2, Fyrtornet med period 2, Pulsaren med period 3. Och andra rör sig genom att upprepa sig förflyttade: rymdskepp. Glidaren, fem celler, glider en ruta diagonalt var fjärde generation. Det lätta rymdskeppet kryssar rakt. Kataloger listar nu tiotusentals namngivna mönster.",
    },
    {
      pretitle: "Avsnitt 03 · Glidarkanonen",
      title: "Bill Gosper, 1970 — och Conways femtio dollar",
      body: "Conway hade förmodat att inget Life-mönster kunde växa i evighet. Ett begränsat universum verkade rimligt. Han bjöd femtio dollar till den som motbevisade förmodandet. I november 1970 hittade Bill Gospers grupp på MIT ett mönster av 36 celler som avfyrar en glidare var 30:e generation, för alltid — den första glidarkanonen. Populationen växer obegränsat. Conway betalade. Plötsligt var Life obegränsat och dörren till att bygga saker inuti stod vidöppen.",
    },
    {
      pretitle: "Avsnitt 04 · Universell beräkning",
      title: "Trådar, grindar, minne, klockor",
      body: "Betrakta ett glidarflöde som en tråd som bär bitar — glidare närvarande är 1, frånvarande är 0. Kollisioner mellan flöden ger OCH, ELLER, ICKE. Slingor av flöden lagrar bitar — minne. Kanoner ger klockan. Med dessa primitiver kan vilken boolesk krets som helst byggas, och därmed vilken beräkning som helst. Paul Rendell byggde år 2000 en fungerande Turingmaskin enbart av Life-mönster; Adam Gouchers metafier gör hela CPU:er till Life-mosaiker. Conways fyraraders regel är Turing-fullständig.",
    },
    {
      pretitle: "Avsnitt 05 · Självreplikation och meta-Life",
      title: "OTCA-metapixlar och Game of Life i Game of Life",
      body: "År 2006 utformade Brice Due OTCA-metapixeln — ett Life-mönster på 2048×2048 vars samlade beteende, betraktat från tillräckligt långt håll, i sin tur är en enda Life-cell. Klä ett helt rutnät med OTCA-metapixlar och du får Game of Life som körs inuti Game of Life, i gränsen oskiljbart från originalet. Självreplikerande mönster följde: 2010 byggde Andrew Wade Gemini, ett mönster på 846 278 levande celler i en ungefär 4,2 miljoner celler bred begränsningsruta, som kopierar sig själv var 33,7 miljonte generation. Leksaken innehåller sig själv.",
    },
    {
      pretitle: "Avsnitt 06 · Öppna gränser",
      title: "Exotiska regler, Margolus-block, Hashlife",
      body: "Conways B3/S23 är en punkt i ett enormt rum. HighLife (B36/S23) lägger till period-12-replikatorer. Day & Night är symmetrisk under färginversion. Seeds (B2/S) är rent genererande — inget överlever någonsin. Margolus-grannskap delar rutnätet i 2×2-block som uppdateras som enheter och ger reversibla automater. Bill Gospers Hashlife-algoritm memoiserar tidrumsregioner och simulerar 10^20 generationer på sekunder. Det finns en hel biologi att upptäcka, en regelsträng i taget.",
    },
  ],
  closingTitle: "Din tur.",
  closingBody:
    "Sandlådan rymmer ett toroidalt 120×70-rutnät, sju klassiska mönster och ett dra-och-rita-verktyg. Öppna, klicka runt, se vad som överlever.",
  ctaLabel: "→ Öppna Sandlådan",
  sandboxCaption: "Inbäddad sandlåda · klicka på rutor, tryck play, prova en förinställning.",
  ruleExplorerCaption: "Samma startsoppa · olika B/S-regler · se dem divergera.",
  sandboxLabels: {
    play: "Spela",
    pause: "Paus",
    step: "Steg",
    clear: "Rensa",
    glider: "Glidare",
    blinker: "Blinkare",
    pulsar: "Pulsar",
    gun: "Gosperkanon",
    generation: "gen",
    population: "lever",
    hint: "Klicka eller dra för att växla rutor. Tryck sedan play eller stega ett snäpp.",
  },
  ruleLabels: {
    title: "Regelutforskare",
    caption: "Vänd en siffra och universum ändrar sig. Samma frö, annan fysik.",
    step: "Steg",
    reset: "Återställ",
    playPause: "Spela",
    pause: "Paus",
    birth: "Födelse",
    survive: "Överlevnad",
    presetLabel: "Förinst.",
  },
  ruleBlock: {
    pretitle: "Regeln, i fjorton ord",
    born: "Om en död cell omges av exakt 3 levande grannar tänds den.",
    survive: "En levande cell som behåller 2 eller 3 levande grannar går vidare till nästa steg.",
    lonely: "Färre än två levande grannar: dör av ensamhet.",
    crowded: "Fler än tre levande grannar: dör av trängsel.",
    notation:
      "Notation: B3/S23. Födelselista / överlevnadslista. Alla andra automater i denna familj skrivs på samma sätt.",
    neighbourhoodLabel: "3×3-grannskap",
    neighbourhoodNote: "Varje cell C tittar på sina åtta omgivande rutor.",
  },
  zooBlock: {
    gliderLabel: "Glidaren · period 4",
    gliderCaption:
      "Fem celler, period fyra, glider en diagonal per cykel. Det första kända rymdskeppet — Conways grupp döpte det 1970.",
    lwssLabel: "Lätt rymdskepp · period 4",
    lwssCaption:
      "Nio celler, kryssar ortogonalt i c/2. Upptäckt av Conway 1970; det minsta rymdskeppet som inte är en glidare.",
  },
  sandboxBlock: {
    pretitle: "Inbäddad sandlåda · klicka på rutor",
    heading: "Bygg något. Tryck spela.",
  },
  computeBlock: {
    wiresLabel: "Trådar",
    wiresBody: "Glidarflöden bär bitar längs raka spår.",
    gatesLabel: "Grindar",
    gatesBody: "Kollisioner mellan glidare ger OCH, ELLER, ICKE.",
    memoryLabel: "Minne",
    memoryBody: "Slingor av glidarflöden (eller ätare plus reflektorer) håller en bit.",
    clockLabel: "Klocka",
    clockBody: "Glidarkanoner avfyrar med fast period och ger hjärtslaget.",
  },
  ruleExplorerBlock: {
    pretitle: "Regelutforskare · vänd en siffra",
    heading: "Ändra fysiken. Se dem divergera.",
  },
  gunStats: {
    yearLabel: "År",
    cellsLabel: "Celler i kanonen",
    gliderEveryLabel: "Glidare var",
    gliderEveryValue: "30 gen",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · två enkla former",
    blockStill: "Block · stilla",
    genSame: "gen 1 · samma",
    blinkerGen0: "Blinkare · gen 0",
    genFlipped: "gen 1 · vänd",
  },
};

const no: RichStory = {
  encounter: {
    pretitle: "Første møte",
    title: "Fire linjer. Et univers.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Ta et rutenett. Hver rute er levende eller død. Bruk fire små regler på alle rutene samtidig, så igjen, og igjen. Ut av de fire linjene vokser romskip som reiser, fabrikker som skyter, oscillatorer som puster — og med nok plass kalkulatorer som adderer. Ingen plasserer romskipene. De bare dukker opp.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Født ved nøyaktig tre levende naboer, overlever med to eller tre, ellers dør. Det er hele regelen, skrevet B3/S23. Legg ned en 2×2-Blokk og den endrer seg aldri. Legg ned en rett linje av tre celler, en Blinker, og den veksler mellom vannrett og loddrett for alltid — én regelpuls per hjerteslag.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "John Conway fant det opp i 1970 som selskapslek. Innen 1982 hadde hobbyister bygd logiske porter av gliderstrømmer; innen 2000 en Turing-maskin; innen 2010 en CPU; innen 2014 en Game of Life-simulator som kjørte inni Game of Life. Universell beregning, oppdaget gjemt inne i en leke.",
      },
    ],
    tryIt: "Under: les reglene, se på dyrehagen, og klikk så på celler selv.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Reglene",
      title: "B3/S23 — født ved tre, overlever ved to eller tre",
      body: "Hver celle teller sine åtte naboer. En død celle med nøyaktig tre levende naboer våkner — fødsel. En levende celle med to eller tre naboer forblir levende — overlevelse. Alt annet dør: av ensomhet under to, av kvelning over tre. Det er alt. Hele verdens fysikk får plass i fjorten ord. Alt annet — romskipene, kanonene, datamaskinene — er bare følge.",
    },
    {
      pretitle: "Avsnitt 02 · Dyrehagen",
      title: "Stilleben, oscillatorer, romskip",
      body: "Noen former beveger seg aldri: 2×2-Blokken, Bikuben, Loftet — stilleben. Andre pulserer: Blinkeren med periode 2, Padden med periode 2, Fyrtårnet med periode 2, Pulsaren med periode 3. Andre igjen flytter seg ved å gjenta seg forskjøvet: romskip. Glideren, fem celler, sklir én rute diagonalt hver fjerde generasjon. Det lette romskipet kryser rett fram. Kataloger lister nå titusenvis av navngitte mønstre.",
    },
    {
      pretitle: "Avsnitt 03 · Gliderkanonen",
      title: "Bill Gosper, 1970 — og Conways femti dollar",
      body: "Conway hadde antatt at intet Life-mønster kunne vokse i det uendelige. Et begrenset univers virket rimelig. Han bød femti dollar til den som motbeviste antagelsen. I november 1970 fant Bill Gospers gruppe ved MIT et mønster på 36 celler som fyrer av en glider hver 30. generasjon, for alltid — den første gliderkanonen. Populasjonen vokser uten grense. Conway betalte. Plutselig var Life ubegrenset, og døren til å bygge ting inni stod på vidt gap.",
    },
    {
      pretitle: "Avsnitt 04 · Universell beregning",
      title: "Tråder, porter, minne, klokker",
      body: "Behandle en gliderstrøm som en tråd som bærer bits — glider til stede er 1, fraværende er 0. Kollisjoner mellom strømmer realiserer OG, ELLER, IKKE. Løkker av strømmer lagrer bits — minne. Kanoner gir klokken. Med disse primitivene kan en hvilken som helst boolsk krets bygges, og dermed en hvilken som helst beregning. Paul Rendell bygde i 2000 en fungerende Turing-maskin laget kun av Life-mønstre; Adam Gouchers metafier gjør hele CPU-er om til Life-mosaikker. Conways fire-linjers regel er Turing-komplett.",
    },
    {
      pretitle: "Avsnitt 05 · Selvreplikasjon og meta-Life",
      title: "OTCA-metapiksler og Game of Life i Game of Life",
      body: "I 2006 designet Brice Due OTCA-metapikselet — et Life-mønster på 2048×2048 hvis kollektive atferd, sett fra langt nok unna, i sin tur er en enkelt Life-celle. Flislegg et helt rutenett med OTCA-metapiksler og du får Game of Life som kjører inni Game of Life, i grensen umulig å skille fra originalen. Selvreplikerende mønstre fulgte: i 2010 bygde Andrew Wade Gemini, et mønster på 846 278 levende celler i en om lag 4,2 millioner celler bred avgrensningsboks, som kopierer seg selv hver 33,7. million generasjon. Leken inneholder seg selv.",
    },
    {
      pretitle: "Avsnitt 06 · Åpne grenser",
      title: "Eksotiske regler, Margolus-blokker, Hashlife",
      body: "Conways B3/S23 er ett punkt i et enormt rom. HighLife (B36/S23) tilfører periode-12-replikatorer. Day & Night er symmetrisk under fargeinversjon. Seeds (B2/S) er rent genererende — ingenting overlever noensinne. Margolus-naboskap deler rutenettet i 2×2-blokker som oppdateres som enheter, og gir reversible automater. Bill Gospers Hashlife-algoritme memoiserer tidrom-regioner og simulerer 10^20 generasjoner på sekunder. Det finnes en hel biologi å oppdage, én regelstreng om gangen.",
    },
  ],
  closingTitle: "Din tur.",
  closingBody:
    "Sandkassen rommer et toroidalt 120×70-rutenett, sju klassiske mønstre og et dra-og-tegn-verktøy. Åpne, klikk rundt, se hva som overlever.",
  ctaLabel: "→ Åpne Sandkassen",
  sandboxCaption: "Innebygd sandkasse · klikk på celler, trykk spill, prøv et forhåndsvalg.",
  ruleExplorerCaption: "Samme startsuppe · ulike B/S-regler · se dem divergere.",
  sandboxLabels: {
    play: "Spill",
    pause: "Pause",
    step: "Steg",
    clear: "Tøm",
    glider: "Glider",
    blinker: "Blinker",
    pulsar: "Pulsar",
    gun: "Gosperkanon",
    generation: "gen",
    population: "lever",
    hint: "Klikk eller dra for å veksle celler. Trykk så spill, eller stepp ett hakk.",
  },
  ruleLabels: {
    title: "Regelutforsker",
    caption: "Snu et tall og universet endres. Samme frø, annen fysikk.",
    step: "Steg",
    reset: "Nullstill",
    playPause: "Spill",
    pause: "Pause",
    birth: "Fødsel",
    survive: "Overlevelse",
    presetLabel: "Forhåndsv.",
  },
  ruleBlock: {
    pretitle: "Regelen, i fjorten ord",
    born: "Er en død celle omgitt av nøyaktig 3 levende naboer, tennes den.",
    survive: "En levende celle som beholder 2 eller 3 levende naboer, går videre til neste trinn.",
    lonely: "Færre enn to levende naboer: dør av ensomhet.",
    crowded: "Flere enn tre levende naboer: dør av overbefolkning.",
    notation:
      "Notasjon: B3/S23. Fødselsliste / overlevelsesliste. Alle andre automater i denne familien skrives på samme måte.",
    neighbourhoodLabel: "3×3-naboskap",
    neighbourhoodNote: "Hver celle C ser på sine åtte omkringliggende ruter.",
  },
  zooBlock: {
    gliderLabel: "Glideren · periode 4",
    gliderCaption:
      "Fem celler, periode fire, sklir en diagonal per syklus. Det første kjente romskipet — Conways gruppe døpte det i 1970.",
    lwssLabel: "Lett romskip · periode 4",
    lwssCaption:
      "Ni celler, krysser ortogonalt i c/2. Oppdaget av Conway i 1970; det minste romskipet som ikke er en glider.",
  },
  sandboxBlock: {
    pretitle: "Innebygd sandkasse · klikk på celler",
    heading: "Bygg noe. Trykk spill.",
  },
  computeBlock: {
    wiresLabel: "Tråder",
    wiresBody: "Gliderstrømmer bærer bits langs rette spor.",
    gatesLabel: "Porter",
    gatesBody: "Kollisjoner mellom glidere gir OG, ELLER, IKKE.",
    memoryLabel: "Minne",
    memoryBody: "Løkker av gliderstrømmer (eller etere pluss reflektorer) holder en bit.",
    clockLabel: "Klokke",
    clockBody: "Gliderkanoner fyrer med fast periode og gir hjerteslaget.",
  },
  ruleExplorerBlock: {
    pretitle: "Regelutforsker · snu et tall",
    heading: "Endre fysikken. Se dem divergere.",
  },
  gunStats: {
    yearLabel: "År",
    cellsLabel: "Celler i kanonen",
    gliderEveryLabel: "Glider hver",
    gliderEveryValue: "30 gen",
  },
  miniGridLabels: {
    shapesCaption: "B3/S23 · to enkle former",
    blockStill: "Blokk · stille",
    genSame: "gen 1 · lik",
    blinkerGen0: "Blinker · gen 0",
    genFlipped: "gen 1 · vendt",
  },
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------
// Inline visuals — small ASCII / SVG helpers used by the encounter section.
// --------------------------------------------------------------------------

const BLOCK_CELLS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
];
const BLINKER_H: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 1],
  [2, 1],
];
const BLINKER_V: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [1, 1],
  [1, 2],
];

function MiniGrid({
  cells,
  size: _size = 4,
  cols = 4,
  rows = 3,
  accent = palette.signal.cyan,
}: {
  cells: ReadonlyArray<readonly [number, number]>;
  size?: number;
  cols?: number;
  rows?: number;
  accent?: string;
}) {
  const cell = 18;
  const W = cols * cell;
  const H = rows * cell;
  const set = new Set(cells.map(([x, y]) => `${x},${y}`));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" aria-hidden="true">
      <rect width={W} height={H} fill={palette.canvas.bg} />
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * cell}
          y1={0}
          x2={i * cell}
          y2={H}
          stroke="rgba(138,144,164,0.15)"
        />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={i * cell}
          x2={W}
          y2={i * cell}
          stroke="rgba(138,144,164,0.15)"
        />
      ))}
      {Array.from({ length: rows }).flatMap((_, y) =>
        Array.from({ length: cols }).map((__, x) =>
          set.has(`${x},${y}`) ? (
            <circle
              key={`${x}-${y}`}
              cx={x * cell + cell / 2}
              cy={y * cell + cell / 2}
              r={cell * 0.34}
              fill={accent}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

const GLIDER_DEMO = [
  [2, 1],
  [3, 2],
  [1, 3],
  [2, 3],
  [3, 3],
] as const;
const LWSS_DEMO = [
  [1, 1],
  [4, 1],
  [5, 2],
  [1, 3],
  [5, 3],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
] as const;

// --------------------------------------------------------------------------

export default function LifeStory() {
  const { locale, s, u } = useI18n();
  const page = s.pages.life;
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-signal-cyan/10 via-transparent to-ink-950" />

      {/* Hero — kept verbatim from the original page so the shared stories
          prose still drives the top of the page. */}
      <section className="mx-auto mb-32 max-w-5xl space-y-7 text-center">
        <Reveal>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
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
              href="/life/sandbox"
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
            Born 3 · Survive 2,3 · else die
          </div>
        </Reveal>
      </section>

      {/* Encounter — three layperson-tone cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Reveal delay={60}>
            <EncounterCard
              label={story.encounter.cards[0].label}
              title={story.encounter.cards[0].title}
              accent="text-signal-cyan"
            >
              <p>{story.encounter.cards[0].body}</p>
            </EncounterCard>
          </Reveal>
          <Reveal delay={140}>
            <EncounterCard
              label={story.encounter.cards[1].label}
              title={story.encounter.cards[1].title}
              accent="text-signal-violet"
            >
              <p>{story.encounter.cards[1].body}</p>
              <div className="hairline mt-4 space-y-3 rounded-md border bg-ink-950/60 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                  {story.miniGridLabels.shapesCaption}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="space-y-1">
                    <MiniGrid cells={BLOCK_CELLS} cols={4} rows={4} accent={palette.signal.cyan} />
                    <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
                      {story.miniGridLabels.blockStill}
                    </div>
                  </div>
                  <div className="font-mono text-2xl text-ink-300">→</div>
                  <div className="space-y-1">
                    <MiniGrid cells={BLOCK_CELLS} cols={4} rows={4} accent={palette.signal.cyan} />
                    <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
                      {story.miniGridLabels.genSame}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="space-y-1">
                    <MiniGrid cells={BLINKER_H} cols={3} rows={3} accent={palette.signal.violet} />
                    <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
                      {story.miniGridLabels.blinkerGen0}
                    </div>
                  </div>
                  <div className="font-mono text-2xl text-ink-300">↔</div>
                  <div className="space-y-1">
                    <MiniGrid cells={BLINKER_V} cols={3} rows={3} accent={palette.signal.violet} />
                    <div className="font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
                      {story.miniGridLabels.genFlipped}
                    </div>
                  </div>
                </div>
              </div>
            </EncounterCard>
          </Reveal>
          <Reveal delay={220}>
            <EncounterCard
              label={story.encounter.cards[2].label}
              title={story.encounter.cards[2].title}
              accent="text-signal-amber"
            >
              <p>{story.encounter.cards[2].body}</p>
            </EncounterCard>
          </Reveal>
        </div>
        <Reveal delay={300}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the rules */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <Reveal>
          <Card
            pretitle={sec0.pretitle}
            title={sec0.title}
            body={sec0.body}
            accent="text-signal-cyan"
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-1 items-center gap-6 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                {story.ruleBlock.pretitle}
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-ink-100">
                <li>
                  <span className="font-mono text-signal-cyan">B3</span> · {story.ruleBlock.born}
                </li>
                <li>
                  <span className="font-mono text-signal-amber">S2/S3</span> ·{" "}
                  {story.ruleBlock.survive}
                </li>
                <li>
                  <span className="font-mono text-signal-rose">&lt; 2</span> ·{" "}
                  {story.ruleBlock.lonely}
                </li>
                <li>
                  <span className="font-mono text-signal-rose">&gt; 3</span> ·{" "}
                  {story.ruleBlock.crowded}
                </li>
              </ul>
              <div className="pt-2 font-mono text-xs leading-relaxed text-ink-300">
                {story.ruleBlock.notation}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center font-mono leading-relaxed text-ink-100">
                <div className="mb-3 text-[10px] uppercase tracking-widest2 text-ink-300">
                  {story.ruleBlock.neighbourhoodLabel}
                </div>
                <pre className="hairline inline-block rounded-md border bg-ink-950/60 p-4 text-base text-ink-100">{`. . .
. C .
. . .`}</pre>
                <div className="mt-3 max-w-[200px] text-[11px] text-ink-300">
                  {story.ruleBlock.neighbourhoodNote}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — the zoo */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <Reveal>
          <Card
            pretitle={sec1.pretitle}
            title={sec1.title}
            body={sec1.body}
            accent="text-signal-cyan"
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Reveal delay={80}>
            <LifeGliderDemo
              cells={GLIDER_DEMO}
              label={story.zooBlock.gliderLabel}
              caption={story.zooBlock.gliderCaption}
              cols={18}
              rows={12}
              speedMs={180}
              accent="text-signal-cyan"
            />
          </Reveal>
          <Reveal delay={200}>
            <LifeGliderDemo
              cells={LWSS_DEMO}
              label={story.zooBlock.lwssLabel}
              caption={story.zooBlock.lwssCaption}
              cols={20}
              rows={14}
              speedMs={180}
              accent="text-signal-violet"
            />
          </Reveal>
        </div>
      </section>

      {/* Inline interactive — sandbox */}
      <section className="mx-auto mb-32 max-w-5xl space-y-5">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {story.sandboxBlock.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.sandboxBlock.heading}
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.sandboxCaption}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <LifeMiniSandbox labels={story.sandboxLabels} />
        </Reveal>
      </section>

      {/* Section 03 — the gun */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <Card
            pretitle={sec2.pretitle}
            title={sec2.title}
            body={sec2.body}
            accent="text-signal-cyan"
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline mt-6 grid grid-cols-1 gap-4 rounded-2xl border bg-ink-950/40 p-6 text-center md:grid-cols-3">
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                {story.gunStats.yearLabel}
              </div>
              <div className="math-italic text-3xl text-ink-100">1970</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
                {story.gunStats.cellsLabel}
              </div>
              <div className="math-italic text-3xl text-ink-100">36</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {story.gunStats.gliderEveryLabel}
              </div>
              <div className="math-italic text-3xl text-ink-100">
                {story.gunStats.gliderEveryValue}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — universal computation */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <Card
            pretitle={sec3.pretitle}
            title={sec3.title}
            body={sec3.body}
            accent="text-signal-cyan"
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="hairline mt-6 grid grid-cols-1 gap-4 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            {[
              { k: story.computeBlock.wiresLabel, v: story.computeBlock.wiresBody },
              { k: story.computeBlock.gatesLabel, v: story.computeBlock.gatesBody },
              { k: story.computeBlock.memoryLabel, v: story.computeBlock.memoryBody },
              { k: story.computeBlock.clockLabel, v: story.computeBlock.clockBody },
            ].map((row) => (
              <div key={row.k} className="hairline rounded-md border bg-ink-950/60 px-4 py-3">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                  {row.k}
                </div>
                <div className="text-sm leading-relaxed text-ink-200">{row.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Inline interactive — rule explorer */}
      <section className="mx-auto mb-32 max-w-5xl space-y-5">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {story.ruleExplorerBlock.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.ruleExplorerBlock.heading}
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.ruleExplorerCaption}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <LifeRuleExplorer labels={story.ruleLabels} />
        </Reveal>
      </section>

      {/* Section 05 — meta-Life */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <Card
            pretitle={sec4.pretitle}
            title={sec4.title}
            body={sec4.body}
            accent="text-signal-cyan"
          />
        </Reveal>
      </section>

      {/* Section 06 — open frontiers */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <Card
            pretitle={sec5.pretitle}
            title={sec5.title}
            body={sec5.body}
            accent="text-signal-cyan"
          />
        </Reveal>
      </section>

      <TopicApplications topicId="life" accent="text-signal-cyan" />
      <RelatedTopics topicId="life" accent="text-signal-cyan" />

      {/* Final CTA — apollonian-style closing */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/life/sandbox"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </main>
  );
}

function Card({
  pretitle,
  title,
  body,
  accent,
}: {
  pretitle: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{pretitle}</div>
      <h2 className="math-italic text-3xl leading-tight md:text-4xl">{title}</h2>
      <p className="whitespace-pre-line leading-relaxed text-ink-100">{body}</p>
    </article>
  );
}

function EncounterCard({
  label,
  title,
  accent,
  children,
}: {
  label: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
