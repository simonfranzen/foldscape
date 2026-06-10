"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { BoidsDemo } from "@/components/BoidsDemo";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";
import { palette } from "@/lib/visual/palette";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// One small SVG vignette per rule. Each shows the focus boid (cyan) with
// neighbours (grey) inside a perception circle, and the steering arrow that
// rule produces. Kept inline because nothing else in the app needs it.
// --------------------------------------------------------------------------

function RuleSVG({ kind }: { kind: "separation" | "alignment" | "cohesion" }) {
  const W = 220;
  const H = 140;
  const cx = W / 2;
  const cy = H / 2;
  const neighbours: Array<{ x: number; y: number; vx: number; vy: number }> = [
    { x: cx + 30, y: cy - 16, vx: 1, vy: 0.2 },
    { x: cx + 18, y: cy + 24, vx: 0.9, vy: -0.1 },
    { x: cx - 34, y: cy + 12, vx: 1.0, vy: 0.0 },
    { x: cx - 16, y: cy - 28, vx: 0.7, vy: 0.4 },
  ];
  const focus = { x: cx, y: cy, vx: 0.6, vy: 0.1 };

  let arrow: { dx: number; dy: number; label: string };
  if (kind === "separation") {
    let dx = 0;
    let dy = 0;
    for (const n of neighbours) {
      const ddx = focus.x - n.x;
      const ddy = focus.y - n.y;
      const d2 = Math.max(1, ddx * ddx + ddy * ddy);
      dx += ddx / d2;
      dy += ddy / d2;
    }
    const m = Math.hypot(dx, dy) || 1;
    arrow = { dx: (dx / m) * 34, dy: (dy / m) * 34, label: "push away" };
  } else if (kind === "alignment") {
    let dx = 0;
    let dy = 0;
    for (const n of neighbours) {
      dx += n.vx;
      dy += n.vy;
    }
    const m = Math.hypot(dx, dy) || 1;
    arrow = { dx: (dx / m) * 34, dy: (dy / m) * 34, label: "match heading" };
  } else {
    let sx = 0;
    let sy = 0;
    for (const n of neighbours) {
      sx += n.x;
      sy += n.y;
    }
    sx /= neighbours.length;
    sy /= neighbours.length;
    const ddx = sx - focus.x;
    const ddy = sy - focus.y;
    const m = Math.hypot(ddx, ddy) || 1;
    arrow = { dx: (ddx / m) * 34, dy: (ddy / m) * 34, label: "steer to centre" };
  }

  const ax = focus.x + arrow.dx;
  const ay = focus.y + arrow.dy;

  const boidPath = (x: number, y: number, vx: number, vy: number, size = 5) => {
    const a = Math.atan2(vy, vx);
    const p1 = [x + Math.cos(a) * size * 1.8, y + Math.sin(a) * size * 1.8];
    const p2 = [x + Math.cos(a + 2.4) * size, y + Math.sin(a + 2.4) * size];
    const p3 = [x + Math.cos(a - 2.4) * size, y + Math.sin(a - 2.4) * size];
    return `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} Z`;
  };

  const radius = 52;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${kind} rule`}>
      <rect width={W} height={H} fill={palette.canvas.bg} rx={10} />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(125,243,255,0.18)"
        strokeDasharray="2 3"
      />
      {neighbours.map((n, i) => (
        <path key={i} d={boidPath(n.x, n.y, n.vx, n.vy)} fill="rgba(232,234,242,0.55)" />
      ))}
      <path d={boidPath(focus.x, focus.y, focus.vx, focus.vy, 6)} fill={palette.signal.cyan} />
      <line x1={focus.x} y1={focus.y} x2={ax} y2={ay} stroke={palette.signal.cyan} strokeWidth={1.6} />
      <polygon
        points={(() => {
          const a = Math.atan2(arrow.dy, arrow.dx);
          const w = 4;
          const len = 7;
          return [
            [ax + Math.cos(a) * len, ay + Math.sin(a) * len],
            [ax + Math.cos(a + 2.4) * w, ay + Math.sin(a + 2.4) * w],
            [ax + Math.cos(a - 2.4) * w, ay + Math.sin(a - 2.4) * w],
          ]
            .map((p) => p.join(","))
            .join(" ");
        })()}
        fill={palette.signal.cyan}
      />
      <text
        x={W / 2}
        y={H - 10}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={9}
        fill="#9aa0b4"
      >
        {arrow.label}
      </text>
    </svg>
  );
}

// --------------------------------------------------------------------------
// Per-locale rich story. The hero (pretitle/title/tagline/intro) still
// comes from shared stories.ts; everything below the hero lives here so the
// page can tell a longer story without bloating the shared i18n bundles.
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
  demoCaption: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Computation",
    title: "Boids",
    tagline: "Three local rules. A whole flock.",
    intro:
      "Craig Reynolds gave each simulated bird three tiny instincts in 1986 — no leader, no plan, no shared map — and let them loose. From those local urges, a flock emerged. The Explorer lets you tune the three rules in real time and watch the whole choreography ripple out.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "No leader. No plan. A flock anyway.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "In 1986 Craig Reynolds wondered if a flock needs a choreographer. He gave each simulated bird — a «boid» — three local instincts and let them loose. Out of pure neighbour-watching, a flock appears.",
      },
      {
        label: "02",
        title: "Three rules, that's it",
        body: "Each boid looks at the handful of neighbours inside its perception radius. Separation: steer away from anyone too close. Alignment: rotate toward the mean heading of the group. Cohesion: drift toward the local centre of mass.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Reynolds' rules became the blueprint for emergent behaviour: starlings, fish schools, drone swarms, evacuation simulations, even particle-swarm optimization. Local perception, global pattern — the recipe behind a thousand systems.",
      },
    ],
    tryIt:
      "Below: watch the three rules in isolation, then see the live flock that emerges when they run together.",
  },
  sections: [
    {
      pretitle: "Section 01 · The setup",
      title: "Autonomous agents, local perception",
      body: "Imagine a few hundred triangles, each with a position and a velocity, each able to see only the neighbours inside a small disc around it. No central controller, no shared map, no global goal. Every boid runs the same three-line update rule, every frame, independently — and the flock falls out of the sum.",
    },
    {
      pretitle: "Section 02 · Rule 1",
      title: "Separation",
      body: "Look at neighbours that are too close — the ones inside a tighter avoidance radius. Sum a steering vector that points away from each, weighted by 1/distance² so closer neighbours push harder. Without separation, the flock collapses to a single point.",
    },
    {
      pretitle: "Section 03 · Rule 2",
      title: "Alignment",
      body: "Average the velocities of every neighbour inside the perception radius and steer to match that mean heading. Without alignment, boids cluster but face every which way — there is no «direction of the flock».",
    },
    {
      pretitle: "Section 04 · Rule 3",
      title: "Cohesion",
      body: "Average the positions of every neighbour inside the perception radius and steer gently toward that local centre of mass. Without cohesion, the boids drift apart — alignment alone cannot keep the flock together.",
    },
    {
      pretitle: "Section 05 · Live demo",
      title: "Three rules, one flock",
      body: "Each triangle is a boid running the same separation-alignment-cohesion update. Nothing is scripted: the streams, splits, and reunions all come from local interactions. Watch the swirls form for a few seconds — every pattern you see is emergent.",
    },
    {
      pretitle: "Section 06 · Emergence and applications",
      title: "From SIGGRAPH to drone shows",
      body: "Reynolds presented boids at SIGGRAPH 1987; six years later the bats of Batman Returns (1992) and the wildebeest stampede of The Lion King (1994) used the same engine. Today the descendants steer Intel's Shooting Star drone swarms, simulate crowd evacuations, and power particle-swarm optimization — a search algorithm where candidate solutions «flock» toward the best one.",
    },
  ],
  demoCaption: "Live · 120 boids, three rules",
  closingTitle: "Open the Explorer.",
  closingBody:
    "Tune the weights, the perception radius, the avoidance distance. Watch one rule at a time, then add the others back in and see how the flock changes character.",
  ctaLabel: "→ Open the Explorer",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Berechnung",
    title: "Boids",
    tagline: "Drei lokale Regeln. Ein ganzer Schwarm.",
    intro:
      "Craig Reynolds gab 1986 jedem simulierten Vogel drei winzige Instinkte mit — kein Anführer, kein Plan, keine geteilte Karte — und ließ sie los. Aus diesen lokalen Impulsen entstand ein Schwarm. Im Explorer kannst du die drei Regeln in Echtzeit justieren und beobachten, wie sich die ganze Choreografie davon fortpflanzt.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Kein Anführer. Kein Plan. Trotzdem ein Schwarm.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "1986 fragte sich Craig Reynolds, ob ein Schwarm eine Choreograf:in braucht. Er gab jedem simulierten Vogel — einem «Boid» — drei lokale Instinkte und ließ sie fliegen. Aus reinem Nachbar-Beobachten entsteht ein Schwarm.",
      },
      {
        label: "02",
        title: "Drei Regeln, mehr nicht",
        body: "Jeder Boid sieht nur die paar Nachbarn innerhalb seines Wahrnehmungsradius. Trennung: weiche jedem aus, der zu nah ist. Ausrichtung: dreh in die mittlere Flugrichtung der Gruppe. Zusammenhalt: steuere auf das lokale Zentrum zu.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Reynolds' Regeln wurden zur Blaupause für emergentes Verhalten: Stare, Fischschwärme, Drohnenshows, Evakuierungssimulationen, sogar Particle-Swarm-Optimization. Lokale Wahrnehmung, globales Muster — das Rezept hinter tausend Systemen.",
      },
    ],
    tryIt:
      "Unten: jede der drei Regeln isoliert, dann der lebende Schwarm, der entsteht, wenn sie zusammenlaufen.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Ausgangslage",
      title: "Autonome Agent:innen, lokale Wahrnehmung",
      body: "Stell dir ein paar Hundert Dreiecke vor, jedes mit Position und Geschwindigkeit, jedes nur fähig, die Nachbarn in einer kleinen Scheibe um sich herum zu sehen. Keine zentrale Steuerung, keine geteilte Karte, kein globales Ziel. Jeder Boid führt dieselben drei Zeilen Update-Regel pro Frame unabhängig aus — und der Schwarm fällt aus der Summe heraus.",
    },
    {
      pretitle: "Abschnitt 02 · Regel 1",
      title: "Trennung",
      body: "Schau auf die Nachbarn, die zu nah sind — die im engeren Vermeidungsradius. Summiere einen Steuervektor, der von jedem weg zeigt, gewichtet mit 1/Distanz², damit nähere stärker drücken. Ohne Trennung kollabiert der Schwarm zu einem Punkt.",
    },
    {
      pretitle: "Abschnitt 03 · Regel 2",
      title: "Ausrichtung",
      body: "Mittel die Geschwindigkeiten aller Nachbarn im Wahrnehmungsradius und steuer in diese mittlere Flugrichtung. Ohne Ausrichtung ballen sich die Boids zwar, zeigen aber in alle Richtungen — es gibt keine «Richtung des Schwarms».",
    },
    {
      pretitle: "Abschnitt 04 · Regel 3",
      title: "Zusammenhalt",
      body: "Mittel die Positionen aller Nachbarn im Wahrnehmungsradius und steuer sanft auf dieses lokale Massezentrum zu. Ohne Zusammenhalt treiben die Boids auseinander — Ausrichtung allein hält den Schwarm nicht zusammen.",
    },
    {
      pretitle: "Abschnitt 05 · Live-Demo",
      title: "Drei Regeln, ein Schwarm",
      body: "Jedes Dreieck ist ein Boid mit derselben Trennung-Ausrichtung-Zusammenhalt-Aktualisierung. Nichts ist skriptiert: die Bahnen, Spaltungen und Wiedervereinigungen kommen alle aus lokalen Interaktionen. Schau ein paar Sekunden lang den Wirbeln zu — jedes Muster, das du siehst, ist emergent.",
    },
    {
      pretitle: "Abschnitt 06 · Emergenz und Anwendungen",
      title: "Von SIGGRAPH zu Drohnenshows",
      body: "Reynolds präsentierte Boids 1987 auf der SIGGRAPH; sechs Jahre später nutzten die Fledermäuse in Batman Returns (1992) und der Gnustampede in König der Löwen (1994) dieselbe Engine. Heute steuern Nachkommen Intels Shooting-Star-Drohnenschwärme, simulieren Menschenmengen-Evakuierungen und treiben Particle-Swarm-Optimization an — einen Suchalgorithmus, bei dem Lösungskandidaten zur besten «schwärmen».",
    },
  ],
  demoCaption: "Live · 120 Boids, drei Regeln",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Stell die Gewichte, den Wahrnehmungsradius, den Vermeidungsabstand ein. Schalte eine Regel nach der anderen ab, schalt sie wieder dazu, und sieh, wie sich der Charakter des Schwarms ändert.",
  ctaLabel: "→ Explorer öffnen",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Computación",
    title: "Boids",
    tagline: "Tres reglas locales. Una bandada entera.",
    intro:
      "Craig Reynolds dio en 1986 a cada pájaro simulado tres instintos diminutos — sin líder, sin plan, sin mapa compartido — y los soltó. De esos impulsos locales emergió una bandada. El Explorador te deja ajustar las tres reglas en tiempo real y ver cómo toda la coreografía se propaga.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Sin líder. Sin plan. Y aun así, una bandada.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "En 1986 Craig Reynolds se preguntó si una bandada necesita coreógrafo. Dio a cada pájaro simulado — un «boid» — tres instintos locales y los soltó. Solo mirando a los vecinos, aparece una bandada.",
      },
      {
        label: "02",
        title: "Tres reglas, nada más",
        body: "Cada boid mira solo a los pocos vecinos dentro de su radio de percepción. Separación: aléjate del que está demasiado cerca. Alineación: gira hacia el rumbo medio del grupo. Cohesión: deriva hacia el centro de masas local.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Las reglas de Reynolds fueron el modelo del comportamiento emergente: estorninos, bancos de peces, enjambres de drones, simulaciones de evacuación, incluso la optimización por enjambre de partículas. Percepción local, patrón global — la receta detrás de mil sistemas.",
      },
    ],
    tryIt:
      "Abajo: cada una de las tres reglas aislada, después la bandada viva que emerge cuando corren juntas.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El montaje",
      title: "Agentes autónomos, percepción local",
      body: "Imagina unos cientos de triángulos, cada uno con posición y velocidad, cada uno capaz de ver solo a los vecinos dentro de un pequeño disco. Sin controlador central, sin mapa compartido, sin objetivo global. Cada boid ejecuta las mismas tres líneas de actualización por fotograma, de forma independiente — y la bandada sale de la suma.",
    },
    {
      pretitle: "Sección 02 · Regla 1",
      title: "Separación",
      body: "Mira a los vecinos que están demasiado cerca — los del radio de evitación más estrecho. Suma un vector de dirección que apunte lejos de cada uno, pesado por 1/distancia² para que los más cercanos empujen más fuerte. Sin separación, la bandada colapsa en un punto.",
    },
    {
      pretitle: "Sección 03 · Regla 2",
      title: "Alineación",
      body: "Promedia las velocidades de todos los vecinos dentro del radio de percepción y gira para igualar ese rumbo medio. Sin alineación, los boids se agrupan pero miran a todos lados — no hay «dirección de la bandada».",
    },
    {
      pretitle: "Sección 04 · Regla 3",
      title: "Cohesión",
      body: "Promedia las posiciones de todos los vecinos dentro del radio de percepción y dirígete suavemente hacia ese centro de masas local. Sin cohesión, los boids se separan — la alineación sola no mantiene la bandada unida.",
    },
    {
      pretitle: "Sección 05 · Demo en vivo",
      title: "Tres reglas, una bandada",
      body: "Cada triángulo es un boid corriendo la misma actualización de separación-alineación-cohesión. Nada está guionado: las corrientes, divisiones y reuniones vienen todas de interacciones locales. Mira los remolinos formarse unos segundos — cada patrón que ves es emergente.",
    },
    {
      pretitle: "Sección 06 · Emergencia y aplicaciones",
      title: "De SIGGRAPH a los espectáculos de drones",
      body: "Reynolds presentó los boids en SIGGRAPH 1987; seis años después los murciélagos de Batman Returns (1992) y la estampida de ñus de El Rey León (1994) usaban el mismo motor. Hoy los descendientes pilotan los enjambres de drones Shooting Star de Intel, simulan evacuaciones y alimentan la optimización por enjambre de partículas — un algoritmo de búsqueda donde las soluciones candidatas «vuelan en bandada» hacia la mejor.",
    },
  ],
  demoCaption: "En vivo · 120 boids, tres reglas",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "Ajusta los pesos, el radio de percepción, la distancia de evitación. Apaga una regla, vuelve a encenderla, y mira cómo cambia el carácter de la bandada.",
  ctaLabel: "→ Abrir el Explorador",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Calcul",
    title: "Boids",
    tagline: "Trois règles locales. Une nuée entière.",
    intro:
      "Craig Reynolds a doté en 1986 chaque oiseau simulé de trois instincts minuscules — sans chef, sans plan, sans carte commune — puis les a lâchés. De ces impulsions locales a surgi une nuée. L'Explorateur te laisse régler les trois règles en temps réel et observer la chorégraphie entière s'en répercuter.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Aucun chef. Aucun plan. Une nuée quand même.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "En 1986, Craig Reynolds s'est demandé si une nuée a besoin d'un chorégraphe. Il a donné à chaque oiseau simulé — un «boid» — trois instincts locaux et les a lâchés. À force d'observer ses voisins, une nuée apparaît.",
      },
      {
        label: "02",
        title: "Trois règles, c'est tout",
        body: "Chaque boid ne voit que la poignée de voisins dans son rayon de perception. Séparation : s'écarter de qui est trop près. Alignement : tourner vers le cap moyen du groupe. Cohésion : dériver vers le centre de masse local.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Les règles de Reynolds sont devenues le modèle du comportement émergent : étourneaux, bancs de poissons, essaims de drones, simulations d'évacuation, jusqu'à l'optimisation par essaim de particules. Perception locale, motif global — la recette derrière mille systèmes.",
      },
    ],
    tryIt:
      "Ci-dessous : chaque règle isolée, puis la nuée vivante qui émerge quand elles tournent ensemble.",
  },
  sections: [
    {
      pretitle: "Section 01 · La mise en place",
      title: "Agents autonomes, perception locale",
      body: "Imagine quelques centaines de triangles, chacun avec position et vitesse, chacun capable de ne voir que ses voisins dans un petit disque. Pas de contrôleur central, pas de carte partagée, pas d'objectif global. Chaque boid exécute la même mise à jour de trois lignes par image, indépendamment — et la nuée naît de la somme.",
    },
    {
      pretitle: "Section 02 · Règle 1",
      title: "Séparation",
      body: "Regarde les voisins trop proches — ceux dans le rayon d'évitement plus serré. Somme un vecteur de direction pointant loin de chacun, pondéré par 1/distance² pour que les plus proches poussent plus fort. Sans séparation, la nuée s'effondre en un point.",
    },
    {
      pretitle: "Section 03 · Règle 2",
      title: "Alignement",
      body: "Moyenne les vitesses de tous les voisins dans le rayon de perception et tourne pour suivre ce cap moyen. Sans alignement, les boids s'agglutinent mais regardent dans tous les sens — il n'y a aucune «direction de la nuée».",
    },
    {
      pretitle: "Section 04 · Règle 3",
      title: "Cohésion",
      body: "Moyenne les positions de tous les voisins dans le rayon de perception et dirige-toi doucement vers ce centre de masse local. Sans cohésion, les boids dérivent les uns loin des autres — l'alignement seul ne tient pas la nuée.",
    },
    {
      pretitle: "Section 05 · Démo en direct",
      title: "Trois règles, une nuée",
      body: "Chaque triangle est un boid qui exécute la même mise à jour séparation-alignement-cohésion. Rien n'est scripté : les courants, les divisions, les retrouvailles viennent tous d'interactions locales. Regarde les tourbillons se former quelques secondes — chaque motif est émergent.",
    },
    {
      pretitle: "Section 06 · Émergence et applications",
      title: "De SIGGRAPH aux spectacles de drones",
      body: "Reynolds a présenté les boids à SIGGRAPH 1987 ; six ans plus tard, les chauves-souris de Batman, le défi (1992) et la ruée des gnous du Roi Lion (1994) tournaient sur le même moteur. Aujourd'hui leurs descendants pilotent les essaims de drones Shooting Star d'Intel, simulent les évacuations de foule et alimentent l'optimisation par essaim de particules — un algorithme où les solutions candidates «volent en nuée» vers la meilleure.",
    },
  ],
  demoCaption: "En direct · 120 boids, trois règles",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "Règle les poids, le rayon de perception, la distance d'évitement. Coupe une règle, rallume-la, et observe comme la nuée change de caractère.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

const it: RichStory = {
  page: {
    pretitle: "Argomento · Calcolo",
    title: "Boids",
    tagline: "Tre regole locali. Uno stormo intero.",
    intro:
      "Nel 1986 Craig Reynolds diede a ogni uccello simulato tre piccoli istinti — nessun capo, nessun piano, nessuna mappa condivisa — e li lasciò andare. Da quegli impulsi locali emerse uno stormo. L'Esploratore ti permette di regolare le tre regole in tempo reale e vedere come l'intera coreografia si propaga.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Nessun capo. Nessun piano. Eppure uno stormo.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Nel 1986 Craig Reynolds si chiese se uno stormo abbia bisogno di un coreografo. Diede a ogni uccello simulato — un «boid» — tre istinti locali e li lasciò volare. Dal puro guardare i vicini nasce uno stormo.",
      },
      {
        label: "02",
        title: "Tre regole, niente di più",
        body: "Ogni boid vede solo la manciata di vicini nel suo raggio di percezione. Separazione: scostati da chi è troppo vicino. Allineamento: ruota verso la direzione media del gruppo. Coesione: deriva verso il centro di massa locale.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Le regole di Reynolds sono diventate il modello del comportamento emergente: storni, banchi di pesci, sciami di droni, simulazioni di evacuazione, persino la particle-swarm optimization. Percezione locale, motivo globale — la ricetta dietro mille sistemi.",
      },
    ],
    tryIt: "Sotto: ogni regola isolata, poi lo stormo vivo che emerge quando girano insieme.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · L'impostazione",
      title: "Agenti autonomi, percezione locale",
      body: "Immagina qualche centinaio di triangoli, ognuno con posizione e velocità, ciascuno in grado di vedere solo i vicini in un piccolo disco. Niente controllore centrale, niente mappa condivisa, nessun obiettivo globale. Ogni boid esegue le stesse tre righe di aggiornamento per fotogramma, in modo indipendente — e lo stormo cade fuori dalla somma.",
    },
    {
      pretitle: "Sezione 02 · Regola 1",
      title: "Separazione",
      body: "Guarda i vicini troppo vicini — quelli nel raggio di evitamento più stretto. Somma un vettore di sterzata che punti lontano da ciascuno, pesato per 1/distanza² così i più vicini spingono di più. Senza separazione lo stormo collassa in un punto.",
    },
    {
      pretitle: "Sezione 03 · Regola 2",
      title: "Allineamento",
      body: "Media le velocità di tutti i vicini nel raggio di percezione e sterza per seguire quella direzione media. Senza allineamento i boid si ammassano ma guardano ovunque — non c'è una «direzione dello stormo».",
    },
    {
      pretitle: "Sezione 04 · Regola 3",
      title: "Coesione",
      body: "Media le posizioni di tutti i vicini nel raggio di percezione e sterza dolcemente verso quel centro di massa locale. Senza coesione i boid si allontanano — l'allineamento da solo non tiene insieme lo stormo.",
    },
    {
      pretitle: "Sezione 05 · Demo dal vivo",
      title: "Tre regole, uno stormo",
      body: "Ogni triangolo è un boid che esegue lo stesso aggiornamento separazione-allineamento-coesione. Niente è scriptato: correnti, divisioni e riunificazioni vengono tutte da interazioni locali. Guarda i vortici formarsi per qualche secondo — ogni motivo che vedi è emergente.",
    },
    {
      pretitle: "Sezione 06 · Emergenza e applicazioni",
      title: "Da SIGGRAPH agli spettacoli di droni",
      body: "Reynolds presentò i boids a SIGGRAPH 1987; sei anni dopo i pipistrelli di Batman - Il ritorno (1992) e la fuga degli gnu del Re Leone (1994) usavano lo stesso motore. Oggi i discendenti pilotano gli sciami di droni Shooting Star di Intel, simulano evacuazioni di folla e alimentano la particle-swarm optimization — un algoritmo di ricerca in cui le soluzioni candidate «sciamano» verso la migliore.",
    },
  ],
  demoCaption: "Dal vivo · 120 boid, tre regole",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "Regola i pesi, il raggio di percezione, la distanza di evitamento. Spegni una regola, riaccendila, e guarda come cambia il carattere dello stormo.",
  ctaLabel: "→ Apri l'Esploratore",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Computação",
    title: "Boids",
    tagline: "Três regras locais. Um bando inteiro.",
    intro:
      "Em 1986, Craig Reynolds deu a cada pássaro simulado três instintos minúsculos — sem líder, sem plano, sem mapa partilhado — e soltou-os. Desses impulsos locais emergiu um bando. O Explorador deixa-te ajustar as três regras em tempo real e ver como toda a coreografia se propaga.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Sem líder. Sem plano. Mesmo assim, um bando.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Em 1986 Craig Reynolds perguntou-se se um bando precisa de coreógrafo. Deu a cada pássaro simulado — um «boid» — três instintos locais e largou-os. De puro olhar para os vizinhos, surge um bando.",
      },
      {
        label: "02",
        title: "Três regras, mais nada",
        body: "Cada boid vê só o punhado de vizinhos dentro do seu raio de percepção. Separação: afasta-te de quem está demasiado perto. Alinhamento: roda para o rumo médio do grupo. Coesão: deriva para o centro de massa local.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "As regras de Reynolds tornaram-se a planta do comportamento emergente: estorninhos, cardumes, enxames de drones, simulações de evacuação, até a otimização por enxame de partículas. Percepção local, padrão global — a receita por trás de mil sistemas.",
      },
    ],
    tryIt:
      "Abaixo: cada uma das três regras isolada, depois o bando vivo que emerge quando correm juntas.",
  },
  sections: [
    {
      pretitle: "Secção 01 · O cenário",
      title: "Agentes autónomos, percepção local",
      body: "Imagina umas centenas de triângulos, cada um com posição e velocidade, cada um capaz de ver só os vizinhos dentro de um pequeno disco. Sem controlador central, sem mapa partilhado, sem objetivo global. Cada boid corre as mesmas três linhas de atualização por frame, de forma independente — e o bando sai da soma.",
    },
    {
      pretitle: "Secção 02 · Regra 1",
      title: "Separação",
      body: "Olha para os vizinhos demasiado perto — os do raio de evitamento mais apertado. Soma um vetor de direção que aponta para longe de cada um, ponderado por 1/distância² para que os mais próximos empurrem mais. Sem separação, o bando colapsa num ponto.",
    },
    {
      pretitle: "Secção 03 · Regra 2",
      title: "Alinhamento",
      body: "Faz a média das velocidades de todos os vizinhos no raio de percepção e roda para seguir esse rumo médio. Sem alinhamento, os boids juntam-se mas apontam para todo o lado — não há «direção do bando».",
    },
    {
      pretitle: "Secção 04 · Regra 3",
      title: "Coesão",
      body: "Faz a média das posições de todos os vizinhos no raio de percepção e dirige-te suavemente para esse centro de massa local. Sem coesão, os boids afastam-se — o alinhamento sozinho não segura o bando.",
    },
    {
      pretitle: "Secção 05 · Demo ao vivo",
      title: "Três regras, um bando",
      body: "Cada triângulo é um boid a correr a mesma atualização de separação-alinhamento-coesão. Nada é roteirizado: as correntes, divisões e reencontros vêm todos de interações locais. Olha os vórtices a formar-se uns segundos — cada padrão que vês é emergente.",
    },
    {
      pretitle: "Secção 06 · Emergência e aplicações",
      title: "De SIGGRAPH aos espetáculos de drones",
      body: "Reynolds apresentou os boids no SIGGRAPH 1987; seis anos depois, os morcegos de Batman - O Regresso (1992) e a debandada dos gnus de O Rei Leão (1994) usavam o mesmo motor. Hoje os descendentes pilotam os enxames Shooting Star da Intel, simulam evacuações de multidões e alimentam a otimização por enxame de partículas — um algoritmo onde soluções candidatas «voam em bando» até à melhor.",
    },
  ],
  demoCaption: "Ao vivo · 120 boids, três regras",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "Afina os pesos, o raio de percepção, a distância de evitamento. Desliga uma regra, religa, e vê como muda o carácter do bando.",
  ctaLabel: "→ Abrir o Explorador",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Beräkning",
    title: "Boids",
    tagline: "Tre lokala regler. En hel flock.",
    intro:
      "Craig Reynolds gav 1986 varje simulerad fågel tre små instinkter — ingen ledare, ingen plan, ingen gemensam karta — och släppte dem fria. Ur dessa lokala impulser växte en flock fram. I Utforskaren kan du justera de tre reglerna i realtid och se hela koreografin rippla ut.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Ingen ledare. Ingen plan. Ändå en flock.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "1986 undrade Craig Reynolds om en flock behöver en koreograf. Han gav varje simulerad fågel — en «boid» — tre lokala instinkter och släppte dem fria. Av att bara titta på grannarna växer en flock fram.",
      },
      {
        label: "02",
        title: "Tre regler, det är allt",
        body: "Varje boid ser bara den handfull grannar som ligger inom dess perceptionsradie. Separation: undvik dem som är för nära. Riktning: vrid mot gruppens medelkurs. Sammanhållning: driv mot det lokala masscentrumet.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Reynolds regler blev ritningen för emergent beteende: starar, fiskstim, drönarsvärmar, evakueringssimuleringar, till och med particle-swarm-optimering. Lokal varseblivning, globalt mönster — receptet bakom tusen system.",
      },
    ],
    tryIt:
      "Nedan: var och en av de tre reglerna isolerad, sedan den levande flocken som uppstår när de körs ihop.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Uppställningen",
      title: "Autonoma agenter, lokal varseblivning",
      body: "Föreställ dig några hundra trianglar, var och en med position och hastighet, var och en med möjlighet att bara se grannarna i en liten skiva runt sig. Ingen central styrning, ingen delad karta, inget globalt mål. Varje boid kör samma tre rader uppdateringsregel per bildruta, oberoende — och flocken faller ut ur summan.",
    },
    {
      pretitle: "Avsnitt 02 · Regel 1",
      title: "Separation",
      body: "Titta på grannarna som är för nära — de inom den snävare undvikelseradien. Summera en styrvektor som pekar bort från var och en, viktad med 1/avstånd² så att närmare grannar trycker hårdare. Utan separation kollapsar flocken till en enda punkt.",
    },
    {
      pretitle: "Avsnitt 03 · Regel 2",
      title: "Riktning",
      body: "Medelvärdesbilda hastigheterna hos alla grannar i perceptionsradien och vrid för att matcha den genomsnittliga kursen. Utan riktning klumpar sig boidsen men pekar åt alla håll — det finns ingen «flockens riktning».",
    },
    {
      pretitle: "Avsnitt 04 · Regel 3",
      title: "Sammanhållning",
      body: "Medelvärdesbilda positionerna hos alla grannar i perceptionsradien och styr försiktigt mot det lokala masscentrumet. Utan sammanhållning driver boidsen isär — riktning ensam håller inte ihop flocken.",
    },
    {
      pretitle: "Avsnitt 05 · Live-demo",
      title: "Tre regler, en flock",
      body: "Varje triangel är en boid som kör samma separation-riktning-sammanhållning-uppdatering. Inget är skriptat: strömmarna, splittringarna och återföreningarna kommer alla från lokala interaktioner. Titta på virvlarna bildas några sekunder — varje mönster du ser är emergent.",
    },
    {
      pretitle: "Avsnitt 06 · Emergens och tillämpningar",
      title: "Från SIGGRAPH till drönaruppvisningar",
      body: "Reynolds presenterade boids på SIGGRAPH 1987; sex år senare körde fladdermössen i Batman — återkomsten (1992) och gnustampeden i Lejonkungen (1994) på samma motor. Idag styr ättlingarna Intels Shooting Star-drönarsvärmar, simulerar folkmassevakueringar och driver particle-swarm-optimering — en sökalgoritm där kandidatlösningar «flockas» mot den bästa.",
    },
  ],
  demoCaption: "Live · 120 boids, tre regler",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Vrid på vikterna, perceptionsradien, undvikelseavståndet. Stäng av en regel, slå på den igen, och se hur flockens karaktär förändras.",
  ctaLabel: "→ Öppna Utforskaren",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Beregning",
    title: "Boids",
    tagline: "Tre lokale regler. En hel flokk.",
    intro:
      "Craig Reynolds ga i 1986 hver simulerte fugl tre bittesmå instinkter — ingen leder, ingen plan, ingen felles kart — og slapp dem fri. Av disse lokale impulsene oppsto en flokk. I Utforskeren kan du justere de tre reglene i sanntid og se hele koreografien spille seg ut.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Ingen leder. Ingen plan. Likevel en flokk.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "I 1986 lurte Craig Reynolds på om en flokk trenger en koreograf. Han ga hver simulert fugl — en «boid» — tre lokale instinkter og slapp dem fri. Av bare å se på naboene vokser en flokk fram.",
      },
      {
        label: "02",
        title: "Tre regler, ikke mer",
        body: "Hver boid ser bare den håndfullen naboer innenfor sin persepsjonsradius. Separasjon: hold deg unna dem som er for nære. Retning: drei mot gruppens gjennomsnittlige kurs. Samhold: driv mot det lokale massesenteret.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Reynolds' regler ble malen for emergent atferd: stærer, fiskestimer, droneshow, evakueringssimuleringer, til og med particle-swarm-optimering. Lokal sansing, globalt mønster — oppskriften bak tusen systemer.",
      },
    ],
    tryIt:
      "Under: hver av de tre reglene isolert, deretter den levende flokken som dukker opp når de kjøres sammen.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppsettet",
      title: "Autonome agenter, lokal sansing",
      body: "Tenk deg noen hundre trekanter, hver med posisjon og hastighet, hver i stand til å se bare naboene innenfor en liten skive rundt seg. Ingen sentral styring, ingen delt kart, ingen global plan. Hver boid kjører de samme tre linjene oppdateringsregel per bilde, uavhengig — og flokken faller ut av summen.",
    },
    {
      pretitle: "Avsnitt 02 · Regel 1",
      title: "Separasjon",
      body: "Se på naboene som er for nære — de innenfor den strammere unngåelsesradien. Summer en styrvektor som peker bort fra hver, vektet med 1/avstand² slik at nærmere naboer dytter hardere. Uten separasjon kollapser flokken til ett punkt.",
    },
    {
      pretitle: "Avsnitt 03 · Regel 2",
      title: "Retning",
      body: "Ta gjennomsnittet av hastighetene til alle naboer i persepsjonsradien og drei for å matche den gjennomsnittlige kursen. Uten retning klumper boidene seg sammen, men peker i alle retninger — det finnes ingen «flokkens retning».",
    },
    {
      pretitle: "Avsnitt 04 · Regel 3",
      title: "Samhold",
      body: "Ta gjennomsnittet av posisjonene til alle naboer i persepsjonsradien og styr forsiktig mot det lokale massesenteret. Uten samhold driver boidene fra hverandre — retning alene holder ikke flokken sammen.",
    },
    {
      pretitle: "Avsnitt 05 · Live-demo",
      title: "Tre regler, én flokk",
      body: "Hver trekant er en boid som kjører den samme separasjon-retning-samhold-oppdateringen. Ingenting er skriptet: strømmene, splittelsene og gjenforeningene kommer alle fra lokale samhandlinger. Se virvlene danne seg noen sekunder — hvert mønster du ser er emergent.",
    },
    {
      pretitle: "Avsnitt 06 · Emergens og anvendelser",
      title: "Fra SIGGRAPH til droneshow",
      body: "Reynolds presenterte boids på SIGGRAPH 1987; seks år senere brukte flaggermusene i Batman — Returns (1992) og gnustampeden i Løvenes konge (1994) den samme motoren. I dag styrer etterkommerne Intels Shooting Star-droneflokker, simulerer folkemengde-evakueringer og driver particle-swarm-optimering — en søkealgoritme der kandidatløsninger «flokker» mot den beste.",
    },
  ],
  demoCaption: "Live · 120 boids, tre regler",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Juster vektene, persepsjonsradien, unngåelsesavstanden. Slå av en regel, slå den på igjen, og se hvordan flokken endrer karakter.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

const RULE_KINDS: Array<{
  index: number;
  kind: "separation" | "alignment" | "cohesion";
  caption: string;
}> = [
  { index: 1, kind: "separation", caption: "Closer neighbours push the focus harder away." },
  { index: 2, kind: "alignment", caption: "Velocity rotates toward the mean heading." },
  { index: 3, kind: "cohesion", caption: "Steers toward the neighbourhood centroid." },
];

export default function BoidsStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/boids/explorer"
      accent={ACCENT}
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="Separate · Align · Cohere"
      formulaLatex={
        "\\vec{v}_{n+1} = \\vec{v}_n + w_s\\, \\vec{S} + w_a\\, \\vec{A} + w_c\\, \\vec{C}"
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
                <p>{card.body}</p>
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — The setup */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — Rule 1 SEPARATION */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Rule 1 · {RULE_KINDS[0]!.kind}
            </div>
            <RuleSVG kind="separation" />
            <p className="text-center font-mono text-[11px] leading-relaxed text-ink-300">
              {RULE_KINDS[0]!.caption}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — Rule 2 ALIGNMENT */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Rule 2 · {RULE_KINDS[1]!.kind}
            </div>
            <RuleSVG kind="alignment" />
            <p className="text-center font-mono text-[11px] leading-relaxed text-ink-300">
              {RULE_KINDS[1]!.caption}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — Rule 3 COHESION */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Rule 3 · {RULE_KINDS[2]!.kind}
            </div>
            <RuleSVG kind="cohesion" />
            <p className="text-center font-mono text-[11px] leading-relaxed text-ink-300">
              {RULE_KINDS[2]!.caption}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — Live demo */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-4">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.demoCaption}
            </div>
            <div className="hairline overflow-hidden rounded-xl border bg-ink-950/80">
              <BoidsDemo className="block h-[420px] w-full" count={120} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — Emergence and applications */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/boids/explorer"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
