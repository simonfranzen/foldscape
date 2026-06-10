"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { palette } from "@/lib/visual/palette";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { LangtonMiniRunner } from "@/components/LangtonMiniRunner";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// A tiny schematic of the highway, drawn in violet — kept inline because no
// other page renders it. The 104-step loop drifts diagonally; this is just
// the visual shorthand.
// --------------------------------------------------------------------------
function HighwaySVG() {
  const W = 240;
  const H = 140;
  const c = 6;
  const cols = Math.floor(W / c);
  const rows = Math.floor(H / c);
  const blocks: Array<[number, number, string]> = [];
  for (let s = 0; s < 18; s++) {
    const bx = 4 + s * 1.6;
    const by = 18 + s * 1.1;
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(bx + i * 1.2);
      const y = Math.floor(by + i * 0.5);
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        blocks.push([x, y, i % 2 === 0 ? palette.signal.violet : "#e8eaf2"]);
      }
    }
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Langton highway schematic"
    >
      <rect width={W} height={H} fill={palette.canvas.bg} rx={10} />
      {blocks.map(([x, y, fill], i) => (
        <rect
          key={i}
          x={x * c}
          y={y * c}
          width={c - 0.5}
          height={c - 0.5}
          fill={fill}
          fillOpacity={fill === palette.signal.violet ? 0.8 : 0.6}
        />
      ))}
    </svg>
  );
}

// --------------------------------------------------------------------------
// Rich, per-locale story content. The base hero (pretitle/title/tagline/
// intro/CTA) still comes from the shared stories.ts; everything below the
// hero is authored inline so the page can tell a longer story without
// touching the shared i18n bundles.
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
  rulesGrid: { white: string; black: string; whiteOp: string; blackOp: string };
  regimes: Array<{ range: string; phase: string; note: string }>;
  highwayCaption: string;
  highwayDetail: string;
  runnerLabel: string;
  runnerCaption: string;
  runnerHint: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Computation",
    title: "Langton's Ant",
    tagline: "Two rules. Ten thousand steps. A highway.",
    intro:
      "An ant on an infinite grid follows two rules: flip the cell, turn one way on white, the other on black. For about ten thousand steps the trail looks like pure chaos. Then — without warning — she starts laying down a perfectly periodic 104-step pattern that drifts off to infinity. Two rules, an unsolved emergent miracle.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Two rules. Infinite chaos. Then a highway.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "One ant on an infinite grid, two rules per cell. After ten thousand steps of chaos she locks into a periodic stripe and walks off to infinity. The miracle is that no one programmed her to.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Start on a single white square, facing north. Rule: white → turn right, flip the square black, step forward. Step one and she is one cell north on a freshly-blackened tile. Step two reads black, turns left, flips, steps. That is the entire universe.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Two lines of code on a napkin secretly contain universal computation — Gajardo, Moreira and Goles proved that generalised ants can simulate any Turing machine. Emergence at its purest, no parameters required.",
      },
    ],
    tryIt: "Below: watch the rule run, step her by hand, then jump to the full Explorer.",
  },
  sections: [
    {
      pretitle: "Section 01 · The rules",
      title: "Two lines is the whole program",
      body: "On a white cell: turn right, flip the cell black, step one square forward. On a black cell: turn left, flip the cell white, step one square forward. That is the complete specification Christopher Langton wrote down in 1986. No random numbers, no neighbours, no parameters.",
    },
    {
      pretitle: "Section 02 · Three regimes",
      title: "Symmetry, then chaos, then order again",
      body: "From a blank grid the trail is bilaterally symmetric for about 500 steps — determinism plus an empty start has no choice. Then symmetry shatters and the trail looks essentially random for roughly ten thousand more. Without warning, a third phase clicks on and stays on forever.",
    },
    {
      pretitle: "Section 03 · The highway",
      title: "A 104-step loop, drifting forever",
      body: "Somewhere near step 10 000 the ant locks into a cycle of exactly 104 steps that translates her two cells diagonally per loop. From the outside it looks like a tidy striped «highway» heading off into one corner of the plane. She will follow it, undisturbed, for the rest of time.",
    },
    {
      pretitle: "Section 04 · The unsolved conjecture",
      title: "Does the highway always emerge?",
      body: "Run the ant from any finite arrangement of black cells anyone has tried and she still finds the highway. No one has ever found a starting configuration that doesn't end in one. No one has ever proved that none exists. That is the open question, untouched for four decades.",
    },
    {
      pretitle: "Section 05 · Bunimovich–Troubetzkoy 1992",
      title: "Unbounded trajectory, proven",
      body: "What is proved is weaker but elegant: Bunimovich and Troubetzkoy showed that from any finite initial pattern the ant's path is unbounded — she cannot be trapped inside any finite region forever. The highway lives strictly inside that unboundedness theorem, but the theorem itself does not see it.",
    },
    {
      pretitle: "Section 06 · Generalisations",
      title: "n colours, n turns, every possible computer",
      body: "Replace «two colours» with «n colours» and give each one its own R/L rule. Most of these generalised ants still produce highways, spirals, filled regions. A subset, identified by Gajardo, Moreira and Goles in 2002, is Turing-complete: you can encode any program into the starting grid and the ant's path is its execution.",
    },
  ],
  rulesGrid: {
    white: "white",
    black: "black",
    whiteOp: "→ R · flip · step",
    blackOp: "→ L · flip · step",
  },
  regimes: [
    { range: "0 – 500", phase: "Symmetric", note: "small bilaterally-symmetric figure" },
    { range: "500 – 10 000", phase: "Chaos", note: "trail looks completely random" },
    { range: "≥ 10 000", phase: "Highway", note: "104-step periodic drift, forever" },
  ],
  highwayCaption: "Schematic · the highway drifts diagonally",
  highwayDetail: "104 steps per loop · 2 cells of translation · indefinite period.",
  runnerLabel: "Mini runner · classic RL ant",
  runnerCaption: "Press play. Watch chaos arrive long before the highway.",
  runnerHint:
    "Slow the slider down to 1 and use the step button — every individual rule application becomes visible.",
  closingTitle: "Run the ant.",
  closingBody:
    "The Explorer lets you switch rule strings, change cell sizes, run millions of steps per second, and watch the highway emerge in real time.",
  ctaLabel: "→ Open the Explorer",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Berechnung",
    title: "Langtons Ameise",
    tagline: "Zwei Regeln. Zehntausend Schritte. Eine Autobahn.",
    intro:
      "Eine Ameise auf einem unendlichen Gitter folgt zwei Regeln: färbe das Feld um, drehe auf Weiß in die eine Richtung, auf Schwarz in die andere. Etwa zehntausend Schritte lang sieht die Spur wie pures Chaos aus. Dann — ohne Vorwarnung — beginnt sie, ein perfekt periodisches Muster aus 104 Schritten zu zeichnen, das nach unendlich davondriftet. Zwei Regeln, ein ungelöstes Wunder der Emergenz.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Zwei Regeln. Unendliches Chaos. Dann eine Autobahn.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Eine Ameise auf unendlichem Gitter, zwei Regeln pro Feld. Nach zehntausend Schritten Chaos rastet sie in einen periodischen Streifen ein und läuft ins Unendliche davon. Das Wunder: niemand hat es ihr einprogrammiert.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Sie steht auf einem weißen Feld, blickt nach Norden. Regel: weiß → rechts drehen, Feld umfärben, ein Schritt vor. Schritt eins steht sie ein Feld nördlich auf frisch geschwärztem Boden. Schritt zwei liest schwarz, dreht links, färbt, geht. Mehr Universum gibt es nicht.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Zwei Zeilen Code auf einer Serviette enthalten heimlich universelle Berechnung — Gajardo, Moreira und Goles bewiesen, dass verallgemeinerte Ameisen jede Turingmaschine simulieren können. Emergenz in Reinform, ohne Parameter.",
      },
    ],
    tryIt:
      "Unten: sieh der Regel beim Laufen zu, schrittweise selbst weiter, dann ab in den Explorer.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Regeln",
      title: "Zwei Zeilen sind das ganze Programm",
      body: "Auf weißem Feld: nach rechts drehen, Feld schwarz färben, ein Feld vorgehen. Auf schwarzem Feld: nach links drehen, Feld weiß färben, ein Feld vorgehen. Mehr hat Christopher Langton 1986 nicht aufgeschrieben. Keine Zufallszahlen, keine Nachbarn, keine Parameter.",
    },
    {
      pretitle: "Abschnitt 02 · Drei Regime",
      title: "Symmetrie, dann Chaos, dann wieder Ordnung",
      body: "Aus leerem Gitter ist die Spur für rund 500 Schritte bilateral symmetrisch — Determinismus plus leerer Start lässt nichts anderes zu. Dann zerbricht die Symmetrie und die Spur wirkt rund zehntausend Schritte lang vollkommen zufällig. Ohne Vorwarnung schaltet die dritte Phase an und bleibt für immer an.",
    },
    {
      pretitle: "Abschnitt 03 · Die Autobahn",
      title: "Eine Schleife aus 104 Schritten, für immer",
      body: "Irgendwo um Schritt 10 000 rastet die Ameise in einen Zyklus aus genau 104 Schritten ein, der sie pro Durchlauf zwei Felder diagonal versetzt. Von außen sieht es aus wie eine ordentlich gestreifte «Autobahn» in Richtung einer Ecke der Ebene. Sie folgt ihr, ungestört, bis ans Ende der Zeit.",
    },
    {
      pretitle: "Abschnitt 04 · Die ungelöste Vermutung",
      title: "Entsteht die Autobahn immer?",
      body: "Egal welche endliche Anfangsanordnung schwarzer Felder bisher jemand ausprobiert hat — die Ameise findet die Autobahn. Niemand hat je eine Startkonfiguration gefunden, in der sie nicht entsteht. Niemand hat je bewiesen, dass keine existiert. Das ist die offene Frage, seit vier Jahrzehnten unangetastet.",
    },
    {
      pretitle: "Abschnitt 05 · Bunimovich–Troubetzkoy 1992",
      title: "Unbeschränkte Bahn, bewiesen",
      body: "Bewiesen ist Schwächeres, aber Schönes: Bunimovich und Troubetzkoy zeigten, dass die Bahn der Ameise aus jeder endlichen Anfangsanordnung unbeschränkt ist — sie kann in keiner endlichen Region für immer gefangen sein. Die Autobahn lebt streng innerhalb dieses Satzes, aber der Satz selbst sieht sie nicht.",
    },
    {
      pretitle: "Abschnitt 06 · Verallgemeinerungen",
      title: "n Farben, n Drehregeln, jeder denkbare Computer",
      body: "Ersetze «zwei Farben» durch «n Farben» und gib jeder eine eigene R/L-Regel. Die meisten dieser verallgemeinerten Ameisen erzeugen Autobahnen, Spiralen, ausgefüllte Bereiche. Eine Untergruppe, identifiziert von Gajardo, Moreira und Goles 2002, ist Turing-vollständig: jedes Programm lässt sich in das Startgitter codieren, die Bahn der Ameise ist seine Ausführung.",
    },
  ],
  rulesGrid: {
    white: "weiß",
    black: "schwarz",
    whiteOp: "→ R · färben · Schritt",
    blackOp: "→ L · färben · Schritt",
  },
  regimes: [
    { range: "0 – 500", phase: "Symmetrisch", note: "kleine bilateral symmetrische Figur" },
    { range: "500 – 10 000", phase: "Chaos", note: "Spur wirkt vollkommen zufällig" },
    { range: "≥ 10 000", phase: "Autobahn", note: "104-Schritt-Drift, für immer" },
  ],
  highwayCaption: "Schema · die Autobahn driftet diagonal",
  highwayDetail: "104 Schritte pro Schleife · 2 Felder Translation · unbegrenzte Periode.",
  runnerLabel: "Mini-Lauf · klassische RL-Ameise",
  runnerCaption: "Play drücken. Sieh dem Chaos zu, lange bevor die Autobahn kommt.",
  runnerHint:
    "Schiebe den Regler auf 1 und benutze den Step-Knopf — jede einzelne Regelanwendung wird sichtbar.",
  closingTitle: "Lass die Ameise laufen.",
  closingBody:
    "Im Explorer kannst du Regelzeichenketten wechseln, Zellgrößen ändern, Millionen Schritte pro Sekunde fahren und der Autobahn live beim Entstehen zusehen.",
  ctaLabel: "→ Explorer öffnen",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Computación",
    title: "La hormiga de Langton",
    tagline: "Dos reglas. Diez mil pasos. Una autopista.",
    intro:
      "Una hormiga en una cuadrícula infinita sigue dos reglas: invierte la celda, gira en un sentido en blanco y en el otro en negro. Durante unos diez mil pasos el rastro parece puro caos. Y entonces — sin previo aviso — empieza a trazar un patrón perfectamente periódico de 104 pasos que se aleja hacia el infinito. Dos reglas, un milagro emergente sin resolver.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Dos reglas. Caos infinito. Después una autopista.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Una hormiga sobre una rejilla infinita, dos reglas por casilla. Tras diez mil pasos de caos engrana en una franja periódica y se va al infinito. El milagro: nadie la programó para eso.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Está en una casilla blanca, mirando al norte. Regla: blanco → gira a la derecha, pinta la casilla de negro, avanza un paso. Tras el paso uno está una casilla al norte sobre suelo recién ennegrecido. El paso dos lee negro, gira a la izquierda, pinta, avanza. No hay más universo.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Dos líneas de código en una servilleta esconden computación universal — Gajardo, Moreira y Goles demostraron que las hormigas generalizadas simulan cualquier máquina de Turing. Emergencia en estado puro, sin parámetros.",
      },
    ],
    tryIt: "Abajo: mira correr la regla, dale tú mismo un paso, luego salta al Explorador.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Las reglas",
      title: "Dos líneas son todo el programa",
      body: "En casilla blanca: gira a la derecha, pinta la casilla de negro, avanza una. En casilla negra: gira a la izquierda, pinta la casilla de blanco, avanza una. Es la especificación completa que Christopher Langton escribió en 1986. Ni azar, ni vecindario, ni parámetros.",
    },
    {
      pretitle: "Sección 02 · Tres regímenes",
      title: "Simetría, después caos, después orden de nuevo",
      body: "Desde rejilla en blanco la traza es bilateralmente simétrica unos 500 pasos — determinismo más inicio vacío no permite otra cosa. Luego la simetría se quiebra y la traza parece totalmente aleatoria durante unos diez mil pasos. Sin previo aviso, una tercera fase se enciende y se queda encendida para siempre.",
    },
    {
      pretitle: "Sección 03 · La autopista",
      title: "Un ciclo de 104 pasos, a la deriva eterna",
      body: "Cerca del paso 10 000 la hormiga engrana en un ciclo de exactamente 104 pasos que la traslada dos casillas en diagonal por vuelta. Por fuera parece una «autopista» rayada y prolija que se va hacia una esquina del plano. La seguirá, imperturbable, hasta el fin del tiempo.",
    },
    {
      pretitle: "Sección 04 · La conjetura abierta",
      title: "¿Siempre aparece la autopista?",
      body: "Cualquier disposición finita de casillas negras que se haya probado — la hormiga acaba encontrando la autopista. Nadie ha encontrado una configuración inicial que no termine ahí. Nadie ha demostrado que no exista. Esa es la pregunta abierta, intocada desde hace cuatro décadas.",
    },
    {
      pretitle: "Sección 05 · Bunimovich–Troubetzkoy 1992",
      title: "Trayectoria no acotada, demostrada",
      body: "Lo demostrado es más débil pero elegante: Bunimovich y Troubetzkoy mostraron que desde cualquier patrón inicial finito la trayectoria es no acotada — no puede quedar atrapada para siempre en ninguna región finita. La autopista vive estrictamente dentro de ese teorema, pero el teorema mismo no la ve.",
    },
    {
      pretitle: "Sección 06 · Generalizaciones",
      title: "n colores, n giros, cualquier computador imaginable",
      body: "Cambia «dos colores» por «n colores» y dale a cada uno su regla R/L. La mayoría de estas hormigas generalizadas siguen produciendo autopistas, espirales, regiones rellenas. Un subconjunto, identificado por Gajardo, Moreira y Goles en 2002, es Turing-completo: cualquier programa se codifica en la rejilla inicial y la trayectoria de la hormiga es su ejecución.",
    },
  ],
  rulesGrid: {
    white: "blanco",
    black: "negro",
    whiteOp: "→ R · pinta · paso",
    blackOp: "→ L · pinta · paso",
  },
  regimes: [
    { range: "0 – 500", phase: "Simétrico", note: "pequeña figura bilateralmente simétrica" },
    { range: "500 – 10 000", phase: "Caos", note: "la traza parece completamente aleatoria" },
    { range: "≥ 10 000", phase: "Autopista", note: "deriva periódica de 104 pasos, para siempre" },
  ],
  highwayCaption: "Esquema · la autopista deriva en diagonal",
  highwayDetail: "104 pasos por vuelta · 2 casillas de traslación · período indefinido.",
  runnerLabel: "Mini ejecución · hormiga RL clásica",
  runnerCaption: "Pulsa play. Mira llegar el caos mucho antes que la autopista.",
  runnerHint:
    "Baja el deslizador a 1 y usa el botón de paso — cada aplicación de la regla se vuelve visible.",
  closingTitle: "Haz correr la hormiga.",
  closingBody:
    "El Explorador te deja cambiar cadenas de reglas, ajustar el tamaño de celda, correr millones de pasos por segundo y ver la autopista emerger en vivo.",
  ctaLabel: "→ Abrir el Explorador",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Calcul",
    title: "La fourmi de Langton",
    tagline: "Deux règles. Dix mille pas. Une autoroute.",
    intro:
      "Une fourmi sur une grille infinie suit deux règles : retourne la case, tourne dans un sens sur blanc, dans l'autre sur noir. Pendant environ dix mille pas la trace ressemble à du pur chaos. Puis — sans prévenir — elle se met à tracer un motif parfaitement périodique de 104 pas qui s'éloigne vers l'infini. Deux règles, un miracle émergent encore irrésolu.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Deux règles. Chaos infini. Puis une autoroute.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Une fourmi sur une grille infinie, deux règles par case. Après dix mille pas de chaos elle s'enclenche dans une bande périodique et s'en va à l'infini. Le miracle : personne ne l'a programmée pour cela.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Elle est sur une case blanche, regardant au nord. Règle : blanc → tourne à droite, noircis la case, avance d'un pas. Au pas un elle est une case au nord sur du fraîchement noirci. Au pas deux elle lit noir, tourne à gauche, repeint, avance. C'est tout l'univers.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Deux lignes de code sur une serviette contiennent en secret le calcul universel — Gajardo, Moreira et Goles ont prouvé que les fourmis généralisées simulent toute machine de Turing. L'émergence à l'état pur, sans paramètre.",
      },
    ],
    tryIt:
      "Ci-dessous : regarde tourner la règle, fais-la avancer toi-même d'un pas, puis va à l'Explorateur.",
  },
  sections: [
    {
      pretitle: "Section 01 · Les règles",
      title: "Deux lignes, c'est tout le programme",
      body: "Sur case blanche : tourne à droite, peins la case en noir, avance d'une case. Sur case noire : tourne à gauche, peins la case en blanc, avance d'une case. Voilà la spécification complète que Christopher Langton a écrite en 1986. Ni hasard, ni voisinage, ni paramètre.",
    },
    {
      pretitle: "Section 02 · Trois régimes",
      title: "Symétrie, puis chaos, puis ordre à nouveau",
      body: "Depuis une grille vide, la trace est bilatéralement symétrique pendant environ 500 pas — déterminisme plus départ vide n'a pas le choix. Puis la symétrie se brise et la trace paraît totalement aléatoire pendant à peu près dix mille pas de plus. Sans prévenir, une troisième phase s'enclenche et reste enclenchée pour toujours.",
    },
    {
      pretitle: "Section 03 · L'autoroute",
      title: "Une boucle de 104 pas, à la dérive éternelle",
      body: "Quelque part autour du pas 10 000 la fourmi se cale dans un cycle d'exactement 104 pas qui la décale de deux cases en diagonale par tour. Vu de l'extérieur, c'est une «autoroute» rayée filant proprement vers un coin du plan. Elle la suivra, imperturbable, jusqu'à la fin des temps.",
    },
    {
      pretitle: "Section 04 · La conjecture ouverte",
      title: "L'autoroute apparaît-elle toujours ?",
      body: "Toute disposition finie de cases noires jamais essayée — la fourmi finit par trouver l'autoroute. Personne n'a découvert de configuration initiale qui n'y mène pas. Personne n'a prouvé qu'aucune n'existe. C'est la question ouverte, intouchée depuis quarante ans.",
    },
    {
      pretitle: "Section 05 · Bunimovich–Troubetzkoy 1992",
      title: "Trajectoire non bornée, prouvée",
      body: "Ce qui est prouvé est plus faible mais élégant : Bunimovich et Troubetzkoy ont montré que depuis tout motif initial fini la trajectoire est non bornée — elle ne peut être piégée pour toujours dans aucune région finie. L'autoroute vit strictement à l'intérieur de ce théorème, mais le théorème lui-même ne la voit pas.",
    },
    {
      pretitle: "Section 06 · Généralisations",
      title: "n couleurs, n tours, tout ordinateur imaginable",
      body: "Remplace «deux couleurs» par «n couleurs» et donne à chacune sa propre règle R/L. La plupart de ces fourmis généralisées produisent encore autoroutes, spirales, régions remplies. Un sous-ensemble, identifié par Gajardo, Moreira et Goles en 2002, est Turing-complet : tout programme s'encode dans la grille de départ et la trajectoire de la fourmi en est l'exécution.",
    },
  ],
  rulesGrid: {
    white: "blanc",
    black: "noir",
    whiteOp: "→ R · peins · pas",
    blackOp: "→ L · peins · pas",
  },
  regimes: [
    { range: "0 – 500", phase: "Symétrique", note: "petite figure bilatéralement symétrique" },
    { range: "500 – 10 000", phase: "Chaos", note: "la trace paraît totalement aléatoire" },
    { range: "≥ 10 000", phase: "Autoroute", note: "dérive périodique de 104 pas, pour toujours" },
  ],
  highwayCaption: "Schéma · l'autoroute dérive en diagonale",
  highwayDetail: "104 pas par boucle · 2 cases de translation · période indéfinie.",
  runnerLabel: "Mini exécution · fourmi RL classique",
  runnerCaption: "Appuie sur lecture. Regarde le chaos arriver bien avant l'autoroute.",
  runnerHint:
    "Descends le curseur à 1 et utilise le bouton pas — chaque application de la règle devient visible.",
  closingTitle: "Lance la fourmi.",
  closingBody:
    "L'Explorateur te permet de changer les chaînes de règles, d'ajuster la taille des cellules, de tourner à des millions de pas par seconde et de voir l'autoroute émerger en direct.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

const it: RichStory = {
  page: {
    pretitle: "Argomento · Calcolo",
    title: "La formica di Langton",
    tagline: "Due regole. Diecimila passi. Un'autostrada.",
    intro:
      "Una formica su una griglia infinita segue due regole: inverti la cella, gira in un senso sul bianco e nell'altro sul nero. Per circa diecimila passi la traccia sembra puro caos. Poi — senza preavviso — comincia a tracciare un motivo perfettamente periodico di 104 passi che si allontana verso l'infinito. Due regole, un miracolo emergente ancora irrisolto.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Due regole. Caos infinito. Poi un'autostrada.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Una formica su una griglia infinita, due regole per cella. Dopo diecimila passi di caos si incastra in una striscia periodica e se ne va all'infinito. Il miracolo: nessuno l'ha programmata per farlo.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "È su una cella bianca, rivolta a nord. Regola: bianco → gira a destra, dipingi la cella di nero, avanza di un passo. Al passo uno è una cella più a nord, su pavimento appena annerito. Al passo due legge nero, gira a sinistra, ridipinge, avanza. L'universo è tutto qui.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Due righe di codice su un tovagliolo nascondono calcolo universale — Gajardo, Moreira e Goles hanno dimostrato che le formiche generalizzate simulano qualsiasi macchina di Turing. Emergenza allo stato puro, senza parametri.",
      },
    ],
    tryIt:
      "Sotto: guarda girare la regola, falla avanzare tu di un passo, poi salta all'Esploratore.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Le regole",
      title: "Due righe sono tutto il programma",
      body: "Su cella bianca: gira a destra, dipingi la cella di nero, avanza di una cella. Su cella nera: gira a sinistra, dipingi la cella di bianco, avanza di una cella. È la specifica completa che Christopher Langton scrisse nel 1986. Niente casualità, niente vicinato, niente parametri.",
    },
    {
      pretitle: "Sezione 02 · Tre regimi",
      title: "Simmetria, poi caos, poi di nuovo ordine",
      body: "Da griglia vuota la traccia è bilateralmente simmetrica per circa 500 passi — determinismo più partenza vuota non lascia altra scelta. Poi la simmetria si frantuma e la traccia sembra del tutto casuale per altri diecimila passi circa. Senza preavviso una terza fase scatta e resta accesa per sempre.",
    },
    {
      pretitle: "Sezione 03 · L'autostrada",
      title: "Un ciclo di 104 passi, alla deriva per sempre",
      body: "Da qualche parte verso il passo 10 000 la formica si incastra in un ciclo di esattamente 104 passi che la trasla di due celle in diagonale a giro. Dall'esterno sembra un'«autostrada» a strisce ordinate che punta verso un angolo del piano. La seguirà, imperturbabile, fino alla fine dei tempi.",
    },
    {
      pretitle: "Sezione 04 · La congettura aperta",
      title: "L'autostrada emerge sempre?",
      body: "Qualunque disposizione finita di celle nere chiunque abbia mai provato — la formica trova l'autostrada. Nessuno ha trovato una configurazione iniziale che non vi conduca. Nessuno ha dimostrato che non esista. È la domanda aperta, intoccata da quarant'anni.",
    },
    {
      pretitle: "Sezione 05 · Bunimovich–Troubetzkoy 1992",
      title: "Traiettoria illimitata, dimostrata",
      body: "Ciò che è dimostrato è più debole ma elegante: Bunimovich e Troubetzkoy hanno mostrato che da ogni configurazione iniziale finita la traiettoria è illimitata — non può restare intrappolata per sempre in alcuna regione finita. L'autostrada vive strettamente dentro questo teorema, ma il teorema stesso non la vede.",
    },
    {
      pretitle: "Sezione 06 · Generalizzazioni",
      title: "n colori, n rotazioni, ogni computer immaginabile",
      body: "Sostituisci «due colori» con «n colori» e dai a ciascuno la propria regola R/L. La maggior parte di queste formiche generalizzate continua a produrre autostrade, spirali, regioni piene. Un sottoinsieme, individuato da Gajardo, Moreira e Goles nel 2002, è Turing-completo: qualunque programma si codifica nella griglia iniziale e la traiettoria della formica è la sua esecuzione.",
    },
  ],
  rulesGrid: {
    white: "bianco",
    black: "nero",
    whiteOp: "→ R · dipingi · passo",
    blackOp: "→ L · dipingi · passo",
  },
  regimes: [
    { range: "0 – 500", phase: "Simmetrico", note: "piccola figura bilateralmente simmetrica" },
    { range: "500 – 10 000", phase: "Caos", note: "la traccia appare del tutto casuale" },
    { range: "≥ 10 000", phase: "Autostrada", note: "deriva periodica di 104 passi, per sempre" },
  ],
  highwayCaption: "Schema · l'autostrada deriva in diagonale",
  highwayDetail: "104 passi per ciclo · 2 celle di traslazione · periodo indefinito.",
  runnerLabel: "Mini esecuzione · formica RL classica",
  runnerCaption: "Premi play. Vedi arrivare il caos molto prima dell'autostrada.",
  runnerHint:
    "Porta il cursore a 1 e usa il bottone passo — ogni singola applicazione della regola diventa visibile.",
  closingTitle: "Fai correre la formica.",
  closingBody:
    "L'Esploratore ti permette di cambiare stringhe di regole, regolare la dimensione delle celle, correre milioni di passi al secondo e vedere l'autostrada emergere in diretta.",
  ctaLabel: "→ Apri l'Esploratore",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Computação",
    title: "A formiga de Langton",
    tagline: "Duas regras. Dez mil passos. Uma autoestrada.",
    intro:
      "Uma formiga numa grelha infinita segue duas regras: inverte a célula, vira num sentido no branco e no outro no preto. Durante cerca de dez mil passos o rasto parece puro caos. Depois — sem aviso — começa a desenhar um padrão perfeitamente periódico de 104 passos que se afasta para o infinito. Duas regras, um milagre emergente por resolver.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Duas regras. Caos infinito. Depois uma autoestrada.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Uma formiga numa grelha infinita, duas regras por casa. Após dez mil passos de caos engata numa faixa periódica e vai-se embora para o infinito. O milagre: ninguém a programou para isso.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Está numa casa branca, virada a norte. Regra: branco → vira à direita, pinta a casa de preto, avança um passo. Ao passo um está uma casa a norte, sobre chão recém-enegrecido. Ao passo dois lê preto, vira à esquerda, repinta, avança. Não há mais universo.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Duas linhas de código num guardanapo escondem computação universal — Gajardo, Moreira e Goles provaram que as formigas generalizadas simulam qualquer máquina de Turing. Emergência em estado puro, sem parâmetros.",
      },
    ],
    tryIt: "Abaixo: vê a regra correr, dá-lhe tu um passo, depois salta para o Explorador.",
  },
  sections: [
    {
      pretitle: "Secção 01 · As regras",
      title: "Duas linhas são todo o programa",
      body: "Em casa branca: vira à direita, pinta a casa de preto, avança uma. Em casa preta: vira à esquerda, pinta a casa de branco, avança uma. É a especificação completa que Christopher Langton escreveu em 1986. Sem acaso, sem vizinhança, sem parâmetros.",
    },
    {
      pretitle: "Secção 02 · Três regimes",
      title: "Simetria, depois caos, depois ordem outra vez",
      body: "A partir de grelha vazia o rasto é bilateralmente simétrico durante uns 500 passos — determinismo mais início vazio não permite outra coisa. Depois a simetria parte-se e o rasto parece totalmente aleatório durante mais cerca de dez mil passos. Sem aviso uma terceira fase liga-se e fica ligada para sempre.",
    },
    {
      pretitle: "Secção 03 · A autoestrada",
      title: "Um ciclo de 104 passos, à deriva eterna",
      body: "Algures perto do passo 10 000 a formiga engata num ciclo de exatamente 104 passos que a translada duas casas na diagonal por volta. De fora parece uma «autoestrada» às riscas, certinha, a sair para um canto do plano. Vai segui-la, imperturbável, até ao fim dos tempos.",
    },
    {
      pretitle: "Secção 04 · A conjectura em aberto",
      title: "A autoestrada emerge sempre?",
      body: "Qualquer disposição finita de casas pretas que alguém alguma vez tentou — a formiga acaba por encontrar a autoestrada. Ninguém encontrou uma configuração inicial que não acabe nela. Ninguém provou que não exista. É a pergunta aberta, intocada há quatro décadas.",
    },
    {
      pretitle: "Secção 05 · Bunimovich–Troubetzkoy 1992",
      title: "Trajectória ilimitada, demonstrada",
      body: "O que está demonstrado é mais fraco mas elegante: Bunimovich e Troubetzkoy mostraram que a partir de qualquer padrão inicial finito a trajectória é ilimitada — não pode ficar presa para sempre em nenhuma região finita. A autoestrada vive estritamente dentro desse teorema, mas o teorema em si não a vê.",
    },
    {
      pretitle: "Secção 06 · Generalizações",
      title: "n cores, n rotações, qualquer computador imaginável",
      body: "Substitui «duas cores» por «n cores» e dá a cada uma a sua regra R/L. A maior parte destas formigas generalizadas continua a produzir autoestradas, espirais, regiões preenchidas. Um subconjunto, identificado por Gajardo, Moreira e Goles em 2002, é Turing-completo: qualquer programa codifica-se na grelha inicial e a trajectória da formiga é a sua execução.",
    },
  ],
  rulesGrid: {
    white: "branco",
    black: "preto",
    whiteOp: "→ R · pinta · passo",
    blackOp: "→ L · pinta · passo",
  },
  regimes: [
    { range: "0 – 500", phase: "Simétrico", note: "pequena figura bilateralmente simétrica" },
    { range: "500 – 10 000", phase: "Caos", note: "o rasto parece totalmente aleatório" },
    {
      range: "≥ 10 000",
      phase: "Autoestrada",
      note: "deriva periódica de 104 passos, para sempre",
    },
  ],
  highwayCaption: "Esquema · a autoestrada deriva em diagonal",
  highwayDetail: "104 passos por ciclo · 2 casas de translação · período indefinido.",
  runnerLabel: "Mini execução · formiga RL clássica",
  runnerCaption: "Carrega em play. Vê o caos chegar muito antes da autoestrada.",
  runnerHint: "Baixa o cursor para 1 e usa o botão passo — cada aplicação da regra fica visível.",
  closingTitle: "Põe a formiga a correr.",
  closingBody:
    "O Explorador deixa-te trocar cadeias de regras, ajustar o tamanho da célula, correr milhões de passos por segundo e ver a autoestrada surgir em direto.",
  ctaLabel: "→ Abrir o Explorador",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Beräkning",
    title: "Langtons myra",
    tagline: "Två regler. Tio tusen steg. En motorväg.",
    intro:
      "En myra på ett oändligt rutnät följer två regler: vänd cellen, sväng åt ena hållet på vit och åt andra på svart. I cirka tio tusen steg ser spåret ut som rent kaos. Sedan — utan förvarning — börjar hon lägga ut ett perfekt periodiskt mönster på 104 steg som driver iväg mot oändligheten. Två regler, ett olöst emergent mirakel.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Två regler. Oändligt kaos. Sedan en motorväg.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "En myra på ett oändligt rutnät, två regler per ruta. Efter tio tusen steg av kaos klickar hon in i en periodisk rand och vandrar iväg mot oändligheten. Miraklet: ingen programmerade henne till det.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Hon står på en vit ruta och tittar norrut. Regel: vit → sväng höger, måla rutan svart, ta ett steg fram. Efter steg ett står hon en ruta norr på nymålad svart. Steg två läser svart, svänger vänster, målar, går. Mer universum finns inte.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Två rader kod på en servett innehåller i hemlighet universell beräkning — Gajardo, Moreira och Goles bevisade att generaliserade myror kan simulera vilken Turingmaskin som helst. Emergens i renaste form, utan parametrar.",
      },
    ],
    tryIt: "Nedan: se regeln rulla, ta ett steg själv, hoppa sedan till Utforskaren.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Reglerna",
      title: "Två rader är hela programmet",
      body: "På vit ruta: sväng höger, måla rutan svart, gå en ruta fram. På svart ruta: sväng vänster, måla rutan vit, gå en ruta fram. Det är hela specifikationen Christopher Langton skrev ned 1986. Ingen slump, ingen grannskap, inga parametrar.",
    },
    {
      pretitle: "Avsnitt 02 · Tre regimer",
      title: "Symmetri, sedan kaos, sedan ordning igen",
      body: "Från tomt rutnät är spåret bilateralt symmetriskt i cirka 500 steg — determinism plus tom start har inget val. Sedan splittras symmetrin och spåret ser helt slumpartat ut i ungefär tio tusen steg till. Utan förvarning klickar en tredje fas i och stannar i för alltid.",
    },
    {
      pretitle: "Avsnitt 03 · Motorvägen",
      title: "En slinga på 104 steg, för evigt på drift",
      body: "Någonstans kring steg 10 000 låser myran sig i en cykel på exakt 104 steg som förskjuter henne två rutor diagonalt per varv. Utifrån ser det ut som en prydligt randig «motorväg» som drar iväg mot ett hörn av planet. Hon följer den, ostörd, till tidens slut.",
    },
    {
      pretitle: "Avsnitt 04 · Den olösta förmodan",
      title: "Dyker motorvägen alltid upp?",
      body: "Vilken ändlig uppställning av svarta rutor någon någonsin har provat — myran hittar motorvägen. Ingen har hittat en startkonfiguration som inte slutar där. Ingen har bevisat att ingen finns. Det är den öppna frågan, orörd sedan fyra decennier.",
    },
    {
      pretitle: "Avsnitt 05 · Bunimovich–Troubetzkoy 1992",
      title: "Obegränsad bana, bevisad",
      body: "Det som är bevisat är svagare men elegant: Bunimovich och Troubetzkoy visade att från varje ändligt startmönster är banan obegränsad — hon kan inte sitta fast i någon ändlig region för alltid. Motorvägen lever strikt inom den satsen, men satsen själv ser den inte.",
    },
    {
      pretitle: "Avsnitt 06 · Generaliseringar",
      title: "n färger, n vändningar, varje tänkbar dator",
      body: "Byt «två färger» mot «n färger» och ge var och en sin egen R/L-regel. De flesta av dessa generaliserade myror producerar fortfarande motorvägar, spiraler, ifyllda områden. En delmängd, identifierad av Gajardo, Moreira och Goles 2002, är Turingfullständig: vilket program som helst kodas i startrutnätet, myrans bana är dess körning.",
    },
  ],
  rulesGrid: {
    white: "vit",
    black: "svart",
    whiteOp: "→ R · måla · steg",
    blackOp: "→ L · måla · steg",
  },
  regimes: [
    { range: "0 – 500", phase: "Symmetrisk", note: "liten bilateralt symmetrisk figur" },
    { range: "500 – 10 000", phase: "Kaos", note: "spåret ser helt slumpartat ut" },
    { range: "≥ 10 000", phase: "Motorväg", note: "104-stegs drift, för alltid" },
  ],
  highwayCaption: "Schema · motorvägen driver diagonalt",
  highwayDetail: "104 steg per slinga · 2 rutor förskjutning · obegränsad period.",
  runnerLabel: "Minikörning · klassisk RL-myra",
  runnerCaption: "Tryck play. Se kaoset komma långt innan motorvägen.",
  runnerHint:
    "Dra reglaget till 1 och använd stegknappen — varje enskild regeltillämpning blir synlig.",
  closingTitle: "Låt myran springa.",
  closingBody:
    "Utforskaren låter dig växla regelsträngar, ändra cellstorlek, köra miljoner steg per sekund och se motorvägen växa fram live.",
  ctaLabel: "→ Öppna Utforskaren",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Beregning",
    title: "Langtons maur",
    tagline: "To regler. Ti tusen skritt. En motorvei.",
    intro:
      "En maur på et uendelig rutenett følger to regler: snu cellen, vri den ene veien på hvitt og den andre på svart. I omtrent ti tusen skritt ser sporet ut som rent kaos. Så — uten varsel — begynner hun å legge ut et perfekt periodisk mønster på 104 skritt som driver av mot uendeligheten. To regler, et uløst emergent mirakel.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "To regler. Uendelig kaos. Så en motorvei.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Én maur på et uendelig rutenett, to regler per rute. Etter ti tusen steg med kaos klikker hun inn i en periodisk stripe og marsjerer av mot uendelig. Mirakelet: ingen programmerte henne til det.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Hun står på en hvit rute, vendt mot nord. Regel: hvit → sving til høyre, mal ruten svart, ta ett steg fram. Etter steg én står hun én rute nord på nymalt svart. Steg to leser svart, svinger venstre, maler, går. Mer univers finnes ikke.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "To linjer kode på en serviett rommer i hemmelighet universell beregning — Gajardo, Moreira og Goles beviste at generaliserte maur kan simulere enhver Turingmaskin. Emergens i sin reneste form, uten parametre.",
      },
    ],
    tryIt: "Under: se regelen kjøre, ta et steg selv, hopp så til Utforskeren.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Reglene",
      title: "To linjer er hele programmet",
      body: "På hvit rute: sving til høyre, mal ruten svart, gå én rute frem. På svart rute: sving til venstre, mal ruten hvit, gå én rute frem. Det er hele spesifikasjonen Christopher Langton skrev ned i 1986. Ingen tilfeldighet, ingen naboer, ingen parametre.",
    },
    {
      pretitle: "Avsnitt 02 · Tre regimer",
      title: "Symmetri, så kaos, så orden igjen",
      body: "Fra tomt rutenett er sporet bilateralt symmetrisk i omtrent 500 steg — determinisme pluss tom start har ikke noe valg. Så sprekker symmetrien og sporet ser helt tilfeldig ut i rundt ti tusen steg til. Uten varsel klikker en tredje fase på og blir stående på for alltid.",
    },
    {
      pretitle: "Avsnitt 03 · Motorveien",
      title: "En løkke på 104 steg, evig på drift",
      body: "Et sted rundt steg 10 000 låser mauren seg i en syklus på nøyaktig 104 steg som forskyver henne to ruter diagonalt per runde. Utenfra ser det ut som en pent stripet «motorvei» som strekker seg mot et hjørne av planet. Hun følger den, uforstyrret, til tidens ende.",
    },
    {
      pretitle: "Avsnitt 04 · Den uløste formodningen",
      title: "Dukker motorveien alltid opp?",
      body: "Enhver endelig oppstilling av svarte ruter noen har prøvd — mauren finner motorveien. Ingen har funnet en startkonfigurasjon som ikke ender der. Ingen har bevist at ingen finnes. Det er det åpne spørsmålet, urørt i fire tiår.",
    },
    {
      pretitle: "Avsnitt 05 · Bunimovich–Troubetzkoy 1992",
      title: "Ubegrenset bane, bevist",
      body: "Det som er bevist er svakere, men elegant: Bunimovich og Troubetzkoy viste at fra ethvert endelig startmønster er banen ubegrenset — hun kan ikke sitte fast i noen endelig region for alltid. Motorveien lever strengt inne i denne setningen, men setningen selv ser den ikke.",
    },
    {
      pretitle: "Avsnitt 06 · Generaliseringer",
      title: "n farger, n svinger, enhver tenkelig datamaskin",
      body: "Bytt «to farger» med «n farger» og gi hver sin egen R/L-regel. De fleste av disse generaliserte maurene produserer fortsatt motorveier, spiraler, fylte områder. En delmengde, identifisert av Gajardo, Moreira og Goles i 2002, er Turing-komplett: ethvert program kodes inn i startrutenettet, og maurens bane er dets utførelse.",
    },
  ],
  rulesGrid: {
    white: "hvit",
    black: "svart",
    whiteOp: "→ R · mal · steg",
    blackOp: "→ L · mal · steg",
  },
  regimes: [
    { range: "0 – 500", phase: "Symmetrisk", note: "liten bilateralt symmetrisk figur" },
    { range: "500 – 10 000", phase: "Kaos", note: "sporet ser helt tilfeldig ut" },
    { range: "≥ 10 000", phase: "Motorvei", note: "104-stegs drift, for alltid" },
  ],
  highwayCaption: "Skjema · motorveien driver diagonalt",
  highwayDetail: "104 steg per løkke · 2 ruters forskyvning · ubestemt periode.",
  runnerLabel: "Minikjøring · klassisk RL-maur",
  runnerCaption: "Trykk play. Se kaoset komme lenge før motorveien.",
  runnerHint:
    "Dra glidebryteren til 1 og bruk steg-knappen — hver enkelt regelanvendelse blir synlig.",
  closingTitle: "La mauren løpe.",
  closingBody:
    "Utforskeren lar deg bytte regelstrenger, justere cellestørrelse, kjøre millioner av steg per sekund og se motorveien vokse fram live.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function LangtonStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/langton/explorer"
      accent={ACCENT}
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="white → R · flip · step    black → L · flip · step"
      formulaLatex={
        "\\text{white} \\to R \\cdot \\text{flip} \\cdot \\text{step}, \\quad \\text{black} \\to L \\cdot \\text{flip} \\cdot \\text{step}"
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
              <article className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {card.label}
                </div>
                <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the rules + a tiny rule-grid visual */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec0} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-1 gap-4 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            <div className="hairline flex items-center gap-4 rounded-xl border bg-ink-950/60 p-5">
              <div className="hairline h-12 w-12 flex-shrink-0 rounded-md border bg-[#e8eaf2]" />
              <div className="space-y-1">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {story.rulesGrid.white}
                </div>
                <div className="font-mono text-sm text-ink-100">{story.rulesGrid.whiteOp}</div>
              </div>
            </div>
            <div className="hairline flex items-center gap-4 rounded-xl border bg-ink-950/60 p-5">
              <div className="hairline h-12 w-12 flex-shrink-0 rounded-md border bg-[#b388ff]" />
              <div className="space-y-1">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {story.rulesGrid.black}
                </div>
                <div className="font-mono text-sm text-ink-100">{story.rulesGrid.blackOp}</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INLINE INTERACTIVE — mini runner */}
      <section className="mx-auto mb-32 max-w-4xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle} · live
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.runnerCaption}
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_320px]">
          <Reveal delay={100}>
            <LangtonMiniRunner
              label={story.runnerLabel}
              caption={story.highwayDetail}
              initialStepsPerFrame={8}
            />
          </Reveal>
          <Reveal delay={220}>
            <div className="hairline h-full space-y-3 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                hint
              </div>
              <p className="text-sm leading-relaxed text-ink-200">{story.runnerHint}</p>
              <div className="hairline space-y-1 border-t pt-3 font-mono text-[11px] text-ink-300">
                <div>
                  <span className="text-signal-cyan">violet cells</span> · black squares
                </div>
                <div>
                  <span className="text-signal-amber">amber pixel</span> · the ant
                </div>
                <div>
                  <span className="text-ink-100">empty</span> · white squares
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 02 — three regimes */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec1} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-1 gap-4 rounded-2xl border bg-ink-950/40 p-6 text-center md:grid-cols-3">
            {story.regimes.map((p) => (
              <div key={p.range} className="hairline space-y-2 rounded-xl border bg-ink-950/40 p-4">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {p.range}
                </div>
                <div className="math-italic text-2xl text-ink-100">{p.phase}</div>
                <div className="font-mono text-xs text-ink-300">{p.note}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Section 03 — the highway + schematic */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec2} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline flex flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.highwayCaption}
            </div>
            <HighwaySVG />
            <p className="max-w-md text-center font-mono text-xs text-ink-300">
              {story.highwayDetail}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — the unsolved conjecture */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec3} accent={ACCENT} />
      </section>

      {/* Section 05 — Bunimovich-Troubetzkoy */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec4} accent={ACCENT} />
      </section>

      {/* Section 06 — Turing-complete generalisations */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec5} accent={ACCENT} />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            run it yourself
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/langton/explorer"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
