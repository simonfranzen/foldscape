"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { MagPendulumBasinMini } from "@/components/MagPendulumBasinMini";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-coral";

// --------------------------------------------------------------------------
// Rich, per-locale narrative. Hero (pretitle/title/tagline/intro/cta) is
// authored here so we can tell a longer, warmer story than the shared
// stories.ts bundle, without bloating the global i18n. The shell expects
// a full StoryPage; we inject `sections: []` at the call site since the
// long-form sections are rendered manually below.
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
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  basinCaption: string;
  basinDamping: string;
  basinStrength: string;
  basinHint: string;
  basinComputing: string;
  basinReady: string;
  sketchCaption: string;
  sketchHint: string;
};

// Static SVG: 3 magnets and a few coloured radial spokes — a schematic
// preview of the basin structure.
function BasinSketchSVG() {
  const W = 280;
  const H = 200;
  const cx = W / 2;
  const cy = H / 2;
  const R = 60;
  const magnets = [
    { x: cx, y: cy - R, color: "#7df3ff" }, // cyan
    {
      x: cx + R * Math.cos((Math.PI * 7) / 6),
      y: cy - R * Math.sin((Math.PI * 7) / 6),
      color: "#b388ff",
    }, // violet
    {
      x: cx + R * Math.cos((Math.PI * 11) / 6),
      y: cy - R * Math.sin((Math.PI * 11) / 6),
      color: "#ffd166",
    }, // amber
  ];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Magnetic-pendulum basins (schematic)"
    >
      <rect width={W} height={H} fill="#06070d" rx={10} />
      {magnets.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r={28} fill={m.color} fillOpacity={0.08} />
          <circle cx={m.x} cy={m.y} r={16} fill={m.color} fillOpacity={0.18} />
          <circle cx={m.x} cy={m.y} r={5} fill={m.color} />
        </g>
      ))}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const r1 = 70 + Math.sin(i * 1.3) * 14;
        const x2 = cx + Math.cos(a) * r1;
        const y2 = cy + Math.sin(a) * r1;
        const color = ["#7df3ff", "#b388ff", "#ffd166"][i % 3];
        return (
          <line
            key={`s-${i}`}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeOpacity={0.22}
            strokeWidth={0.9}
          />
        );
      })}
    </svg>
  );
}

// --------------------------------------------------------------------------
// EN
// --------------------------------------------------------------------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Chaos",
    title: "The Magnetic Pendulum",
    tagline: "Colour each start by its winner — and a fractal appears.",
    intro:
      "Hang an iron pendulum over three magnets in a triangle. Newton's laws, magnetic pull, a touch of friction — deterministic, all of it. And still the question «which magnet does it land over?» has no smooth answer. Colour each starting point by its eventual winner and three interlocked basins appear, woven into one another at every scale.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Three magnets. One pendulum. Three colours that never separate.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "For every point above the plate, ask: which magnet will the pendulum eventually rest over? Paint that point with the winner's colour. The plate becomes a map of futures — and the map is a fractal.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Three identical magnets at the vertices of an equilateral triangle. A weak spring pulls the pendulum back to centre, air slowly drains its energy. Same release point twice → same magnet twice. Shift the start by a hair, and any of the three can win.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The boundary between colours is a Wada set: at every boundary point, all three colours meet. Determinism survives, predictability does not — the same paradox that haunts weather, the solar system, and any physics with competing attractors.",
      },
    ],
    tryIt: "Below: sketch the picture, then turn the knobs on a live basin map.",
  },
  sections: [
    {
      pretitle: "Section 01 · The physics",
      title: "Newton, magnets, a little friction",
      body: "A small iron bob hangs above a plate, free to swing in the plane. Three magnets pull it with a horizontal force component that scales as 1/(r² + h²)^(3/2) — near-cubic when the horizontal distance r is large compared to the plate-to-bob height h, gentler in the near field; a weak spring pulls it back to the centre; air resistance bleeds energy. The equations of motion are clean and deterministic — only the starting position is left free.",
    },
    {
      pretitle: "Section 02 · Deterministic chaos",
      title: "Same start, same end — different basin everywhere",
      body: "Release the pendulum twice from exactly the same point and it lands over the same magnet, twice. The physics has no randomness in it. But move the start by a millimetre and the answer can flip — and the flip pattern is dense at every scale.",
    },
    {
      pretitle: "Section 03 · Basins of attraction",
      title: "Three colours, one map",
      body: "Sweep a grid of starting points; for each one, integrate the equations until the pendulum settles; colour the point by its winning magnet. The interior of each basin is a clean coloured region. The boundary between them is where the picture stops being smooth.",
    },
    {
      pretitle: "Section 04 · The Wada property",
      title: "Every boundary point borders all three colours",
      body: "Zoom into the boundary between any two basins and the third colour is already there, threaded through the seam. Zoom again and all three colours are arbitrarily close to every boundary point. The frontier is not a curve — it is a Wada set, where three regions share one common boundary.",
    },
    {
      pretitle: "Section 05 · Yoneyama, 1917",
      title: "A topology curio that the chaos era weaponised",
      body: "The first Wada construction was a topology amuse-bouche by Kunizō Yoneyama in 1917: three «lakes» on an island, each carving channels so fine that every land point ends up on all three shores. For seventy years it stayed a curiosity. Then Kennedy and Yorke in 1991 coined the term Wada basins for chaotic dynamics (originally for the Hénon-Heiles system); Aguirre, Vallejo and Sanjuán demonstrated the property explicitly for the magnetic pendulum in the early 2000s — and chaos theory had its first concrete Wada basin in a tabletop experiment.",
    },
    {
      pretitle: "Section 06 · Connections",
      title: "Newton's method, the solar system, chaotic billiards",
      body: "The same fractal frontier appears in Newton's-method basins for the roots of a cubic, in long-term integrations of the planets, and in the «leaky» phase space of chaotic billiards. Hsu's cell-mapping method computes these basins by mass production. Wherever attractors compete, their boundaries tend to grow Wada.",
    },
  ],
  closingTitle: "Find the Wada boundary.",
  closingBody:
    "The Explorer lets you change the magnet strength, the damping, the height of the pendulum above the plate, and the resolution of the basin grid — and watch the fractal sharpen in real time.",
  ctaLabel: "→ Open the Explorer",
  basinCaption: "Live · low-res basin map",
  basinDamping: "Damping γ",
  basinStrength: "Magnet strength k",
  basinHint:
    "Each pixel is a starting position; its colour is the magnet that wins. Crank the damping down and the basin shatters; crank it up and the colours settle.",
  basinComputing: "computing",
  basinReady: "ready",
  sketchCaption: "Three magnets · three basins",
  sketchHint:
    "Each colour marks the magnet the pendulum eventually lands over. In the real picture, the spokes are infinitely fine.",
};

// --------------------------------------------------------------------------
// DE
// --------------------------------------------------------------------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Chaos",
    title: "Das magnetische Pendel",
    tagline: "Färbe jeden Start nach seinem Sieger — und ein Fraktal erscheint.",
    intro:
      "Häng ein eisernes Pendel über drei in einem Dreieck angeordnete Magnete. Newtons Gesetze, magnetische Anziehung, ein wenig Reibung — alles deterministisch. Und doch hat die Frage «über welchem Magneten landet es?» keine glatte Antwort. Färbe jeden Startpunkt nach seinem späteren Sieger ein, und drei Bassins erscheinen, auf jeder Skala ineinander verwoben.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Drei Magnete. Ein Pendel. Drei Farben, die sich nie trennen.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Für jeden Punkt über der Platte frage: über welchem Magneten ruht das Pendel am Ende? Färbe diesen Punkt in der Farbe des Siegers. Die Platte wird zur Karte möglicher Zukünfte — und die Karte ist ein Fraktal.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Drei gleiche Magnete an den Ecken eines gleichseitigen Dreiecks. Eine schwache Feder zieht das Pendel zur Mitte zurück, Luft entzieht ihm langsam Energie. Gleicher Start zweimal → gleicher Magnet zweimal. Bewege den Start um ein Haar, und jeder der drei kann gewinnen.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Die Grenze zwischen den Farben ist eine Wada-Menge: an jedem Grenzpunkt treffen sich alle drei Farben. Determinismus überlebt, Vorhersagbarkeit nicht — dasselbe Paradox spukt im Wetter, im Sonnensystem und in jeder Physik mit konkurrierenden Attraktoren.",
      },
    ],
    tryIt: "Unten: erst die Skizze, dann dreh selbst an einer lebendigen Bassin-Karte.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Physik",
      title: "Newton, Magnete, ein wenig Reibung",
      body: "Ein kleiner Eisenpendel hängt über einer Platte, frei beweglich in der Ebene. Drei Magnete ziehen ihn an, wobei die horizontale Kraftkomponente wie 1/(r² + h²)^(3/2) skaliert — im Fernfeld (Abstand r groß gegenüber der Höhe h) annähernd 1/r³, im Nahfeld sanfter; eine schwache Feder holt ihn zur Mitte zurück; Luftreibung entzieht ihm Energie. Die Bewegungsgleichungen sind sauber und deterministisch — nur der Startpunkt bleibt frei.",
    },
    {
      pretitle: "Abschnitt 02 · Deterministisches Chaos",
      title: "Gleicher Start, gleiches Ende — überall andere Bassins",
      body: "Lass das Pendel zweimal exakt vom selben Punkt los, und es landet zweimal über demselben Magneten. Die Physik enthält keinen Zufall. Aber verschiebe den Start um einen Millimeter, und die Antwort kann kippen — und das Muster dieser Kipper ist auf jeder Skala dicht.",
    },
    {
      pretitle: "Abschnitt 03 · Bassins der Anziehung",
      title: "Drei Farben, eine Karte",
      body: "Lege ein Gitter von Startpunkten an; integriere für jeden die Gleichungen bis zum Ruhepunkt; färbe ihn nach seinem Siegermagneten. Das Innere jedes Bassins ist ein sauberer Farbbereich. Die Grenze dazwischen ist der Ort, an dem das Bild aufhört glatt zu sein.",
    },
    {
      pretitle: "Abschnitt 04 · Die Wada-Eigenschaft",
      title: "Jeder Grenzpunkt grenzt an alle drei Farben",
      body: "Zoom an die Grenze zwischen zwei Bassins, und die dritte Farbe ist schon da, durch die Naht gefädelt. Zoom weiter, und alle drei Farben kommen jedem Grenzpunkt beliebig nahe. Die Front ist keine Kurve — sie ist eine Wada-Menge, in der drei Bereiche eine gemeinsame Grenze teilen.",
    },
    {
      pretitle: "Abschnitt 05 · Yoneyama, 1917",
      title: "Eine topologische Kuriosität, die das Chaos-Zeitalter aufgriff",
      body: "Die erste Wada-Konstruktion war ein topologisches Häppchen von Kunizō Yoneyama, 1917: drei «Seen» auf einer Insel, jeder gräbt so feine Kanäle, dass jeder Landpunkt am Ende an allen drei Ufern liegt. Siebzig Jahre lang blieb sie Kuriosität. Dann prägten Kennedy und Yorke 1991 den Begriff der Wada-Bassins für chaotische Dynamik (ursprünglich am Hénon-Heiles-System); Aguirre, Vallejo und Sanjuán zeigten die Eigenschaft Anfang der 2000er Jahre explizit am magnetischen Pendel — und die Chaostheorie hatte ihr erstes konkretes Wada-Bassin im Tischexperiment.",
    },
    {
      pretitle: "Abschnitt 06 · Verbindungen",
      title: "Newton-Verfahren, Sonnensystem, chaotische Billards",
      body: "Dieselbe fraktale Front erscheint in den Newton-Bassins für die Wurzeln eines kubischen Polynoms, in Langzeitrechnungen der Planeten und im «leckenden» Phasenraum chaotischer Billards. Hsus Zellenabbildungs-Methode produziert solche Bassins in Serie. Wo Attraktoren konkurrieren, wachsen ihre Grenzen gerne Wada.",
    },
  ],
  closingTitle: "Finde die Wada-Grenze.",
  closingBody:
    "Der Explorer lässt dich Magnetstärke, Dämpfung, Pendelhöhe über der Platte und Bassin-Auflösung verändern — und beobachten, wie das Fraktal in Echtzeit schärfer wird.",
  ctaLabel: "→ Explorer öffnen",
  basinCaption: "Live · niedrig aufgelöste Bassin-Karte",
  basinDamping: "Dämpfung γ",
  basinStrength: "Magnetstärke k",
  basinHint:
    "Jeder Pixel ist eine Startposition; seine Farbe der Magnet, der gewinnt. Dreh die Dämpfung runter, und das Bassin zersplittert; dreh sie rauf, und die Farben beruhigen sich.",
  basinComputing: "rechne",
  basinReady: "bereit",
  sketchCaption: "Drei Magnete · drei Bassins",
  sketchHint:
    "Jede Farbe markiert den Magneten, über dem das Pendel am Ende ruht. Im echten Bild sind die Speichen unendlich fein.",
};

// --------------------------------------------------------------------------
// ES
// --------------------------------------------------------------------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "El péndulo magnético",
    tagline: "Colorea cada arranque por su ganador — y aparece un fractal.",
    intro:
      "Cuelga un péndulo de hierro sobre tres imanes en triángulo. Las leyes de Newton, atracción magnética, un poco de fricción — todo determinista. Y aun así la pregunta «¿sobre qué imán cae?» no tiene respuesta suave. Colorea cada punto de partida por su ganador eventual y aparecen tres cuencas entrelazadas, urdidas a cada escala.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Tres imanes. Un péndulo. Tres colores que nunca se separan.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Para cada punto sobre la placa pregunta: ¿sobre qué imán descansará el péndulo? Pinta ese punto del color del ganador. La placa se vuelve un mapa de futuros — y el mapa es un fractal.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Tres imanes iguales en los vértices de un triángulo equilátero. Un resorte débil tira del péndulo al centro, el aire le drena energía. Mismo arranque dos veces → mismo imán dos veces. Mueve el inicio un pelo, y cualquiera de los tres puede ganar.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La frontera entre colores es un conjunto de Wada: en cada punto frontera se encuentran los tres colores. El determinismo sobrevive, la previsibilidad no — la misma paradoja que asedia al tiempo, al sistema solar y a toda física con atractores en competencia.",
      },
    ],
    tryIt: "Abajo: primero el boceto, después gira los mandos en un mapa de cuencas vivo.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La física",
      title: "Newton, imanes, un poco de fricción",
      body: "Un pequeño peso de hierro cuelga sobre una placa, libre de oscilar en el plano. Tres imanes tiran de él con una componente horizontal de fuerza que escala como 1/(r² + h²)^(3/2) — casi cúbica cuando la distancia horizontal r es grande comparada con la altura h sobre la placa, más suave en el campo cercano; un resorte débil lo devuelve al centro; el aire le quita energía. Las ecuaciones son limpias y deterministas — solo queda libre el punto de partida.",
    },
    {
      pretitle: "Sección 02 · Caos determinista",
      title: "Mismo inicio, mismo fin — distinta cuenca por todas partes",
      body: "Suelta el péndulo dos veces exactamente desde el mismo punto y cae dos veces sobre el mismo imán. No hay azar en la física. Pero corre el inicio un milímetro y la respuesta puede invertirse — y el patrón de inversiones es denso a cada escala.",
    },
    {
      pretitle: "Sección 03 · Cuencas de atracción",
      title: "Tres colores, un mapa",
      body: "Recorre una rejilla de puntos de inicio; para cada uno integra las ecuaciones hasta que reposa; coloréalo por su imán ganador. El interior de cada cuenca es una región limpia. La frontera entre ellas es donde la imagen deja de ser suave.",
    },
    {
      pretitle: "Sección 04 · La propiedad de Wada",
      title: "Cada punto frontera linda con los tres colores",
      body: "Acércate a la frontera entre dos cuencas y el tercer color ya está ahí, hilvanado en la costura. Acércate más y los tres colores están arbitrariamente cerca de cualquier punto frontera. La frontera no es una curva — es un conjunto de Wada, donde tres regiones comparten un mismo borde.",
    },
    {
      pretitle: "Sección 05 · Yoneyama, 1917",
      title: "Una curiosidad topológica que la era del caos rearmó",
      body: "La primera construcción de Wada fue un bocado topológico de Kunizō Yoneyama en 1917: tres «lagos» en una isla, cada uno cavando canales tan finos que cada punto de tierra acaba en las tres orillas. Setenta años se quedó como curiosidad. Luego Kennedy y Yorke en 1991 acuñaron el término «cuencas de Wada» para la dinámica caótica (originalmente para el sistema Hénon-Heiles); Aguirre, Vallejo y Sanjuán demostraron explícitamente la propiedad en el péndulo magnético a principios de los 2000 — y la teoría del caos tuvo su primera cuenca de Wada concreta en un experimento de mesa.",
    },
    {
      pretitle: "Sección 06 · Conexiones",
      title: "Método de Newton, sistema solar, billares caóticos",
      body: "La misma frontera fractal aparece en las cuencas del método de Newton para las raíces de un cúbico, en integraciones de larga duración de los planetas, y en el espacio de fases «con fugas» de los billares caóticos. El método de mapeo celular de Hsu produce esas cuencas en serie. Donde compiten atractores, sus fronteras tienden a hacerse Wada.",
    },
  ],
  closingTitle: "Encuentra la frontera de Wada.",
  closingBody:
    "El Explorador te deja cambiar la fuerza de los imanes, la amortiguación, la altura del péndulo sobre la placa y la resolución de la rejilla — y ver cómo el fractal se afila en tiempo real.",
  ctaLabel: "→ Abrir el Explorador",
  basinCaption: "En vivo · mapa de cuencas baja-res",
  basinDamping: "Amortiguación γ",
  basinStrength: "Fuerza del imán k",
  basinHint:
    "Cada píxel es una posición inicial; su color, el imán que gana. Baja la amortiguación y la cuenca se astilla; súbela y los colores se calman.",
  basinComputing: "calculando",
  basinReady: "listo",
  sketchCaption: "Tres imanes · tres cuencas",
  sketchHint:
    "Cada color marca el imán sobre el que el péndulo acaba descansando. En la imagen real, los radios son infinitamente finos.",
};

// --------------------------------------------------------------------------
// FR
// --------------------------------------------------------------------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Chaos",
    title: "Le pendule magnétique",
    tagline: "Colore chaque départ par son vainqueur — un fractal apparaît.",
    intro:
      "Suspends un pendule de fer au-dessus de trois aimants en triangle. Les lois de Newton, l'attraction magnétique, un soupçon de frottement — tout est déterministe. Et pourtant la question «au-dessus de quel aimant se posera-t-il ?» n'a pas de réponse lisse. Colore chaque point de départ par son vainqueur final et trois bassins enlacés apparaissent, tissés l'un dans l'autre à chaque échelle.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Trois aimants. Un pendule. Trois couleurs qui ne se séparent jamais.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Pour chaque point au-dessus de la plaque, demande : sur quel aimant le pendule va-t-il finir ? Peins ce point de la couleur du vainqueur. La plaque devient une carte des futurs — et la carte est un fractal.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Trois aimants identiques aux sommets d'un triangle équilatéral. Un ressort faible ramène le pendule au centre, l'air lui prend lentement son énergie. Même départ deux fois → même aimant deux fois. Décale le départ d'un cheveu, et n'importe lequel des trois peut gagner.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "La frontière entre les couleurs est un ensemble de Wada : en chaque point frontière, les trois couleurs se rejoignent. Le déterminisme survit, la prévisibilité non — le même paradoxe hante la météo, le système solaire et toute physique à attracteurs concurrents.",
      },
    ],
    tryIt:
      "Ci-dessous : d'abord l'esquisse, puis tourne toi-même les boutons sur une carte vivante.",
  },
  sections: [
    {
      pretitle: "Section 01 · La physique",
      title: "Newton, aimants, un peu de frottement",
      body: "Un petit bob de fer pend au-dessus d'une plaque, libre d'osciller dans le plan. Trois aimants l'attirent avec une composante horizontale de force qui s'écrit comme 1/(r² + h²)^(3/2) — presque en 1/r³ quand la distance horizontale r est grande devant la hauteur h au-dessus de la plaque, plus douce en champ proche ; un ressort faible le ramène au centre ; l'air lui prend son énergie. Les équations du mouvement sont propres et déterministes — seule la position de départ reste libre.",
    },
    {
      pretitle: "Section 02 · Chaos déterministe",
      title: "Même départ, même fin — bassin différent partout",
      body: "Lâche le pendule deux fois exactement du même point, il se pose deux fois sur le même aimant. Aucune aléa dans la physique. Mais décale le départ d'un millimètre et la réponse peut basculer — et le motif des bascules est dense à toute échelle.",
    },
    {
      pretitle: "Section 03 · Bassins d'attraction",
      title: "Trois couleurs, une carte",
      body: "Balaye une grille de points de départ ; pour chacun, intègre les équations jusqu'au repos ; colorie-le selon son aimant vainqueur. L'intérieur de chaque bassin est une région nette. La frontière entre eux est là où l'image cesse d'être lisse.",
    },
    {
      pretitle: "Section 04 · La propriété de Wada",
      title: "Chaque point frontière touche les trois couleurs",
      body: "Zoome sur la frontière entre deux bassins, la troisième couleur y est déjà, faufilée dans la couture. Zoome encore, et les trois couleurs sont arbitrairement proches de chaque point frontière. La frontière n'est pas une courbe — c'est un ensemble de Wada, où trois régions partagent un même bord.",
    },
    {
      pretitle: "Section 05 · Yoneyama, 1917",
      title: "Une curiosité topologique que l'ère du chaos a réarmée",
      body: "La première construction de Wada fut un amuse-bouche topologique de Kunizō Yoneyama en 1917 : trois «lacs» sur une île, chacun creusant des canaux si fins que tout point de terre finit sur les trois rives. Soixante-dix ans elle resta curiosité. Puis Kennedy et Yorke en 1991 forgent le terme «bassins de Wada» pour la dynamique chaotique (à l'origine pour le système de Hénon-Heiles) ; Aguirre, Vallejo et Sanjuán démontrent explicitement la propriété pour le pendule magnétique au début des années 2000 — et la théorie du chaos a son premier bassin de Wada concret dans une expérience de table.",
    },
    {
      pretitle: "Section 06 · Connexions",
      title: "Méthode de Newton, système solaire, billards chaotiques",
      body: "La même frontière fractale revient dans les bassins de la méthode de Newton pour les racines d'un cubique, dans les intégrations à long terme des planètes, et dans l'espace des phases «troué» des billards chaotiques. La méthode de cellules de Hsu produit ces bassins en série. Là où les attracteurs sont en compétition, leurs frontières aiment devenir Wada.",
    },
  ],
  closingTitle: "Trouve la frontière de Wada.",
  closingBody:
    "L'Explorateur te laisse changer la force des aimants, l'amortissement, la hauteur du pendule au-dessus de la plaque et la résolution de la grille — et regarder le fractal s'aiguiser en temps réel.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  basinCaption: "En direct · carte de bassins basse résolution",
  basinDamping: "Amortissement γ",
  basinStrength: "Force d'aimant k",
  basinHint:
    "Chaque pixel est une position de départ ; sa couleur, l'aimant qui gagne. Baisse l'amortissement et le bassin éclate ; monte-le et les couleurs s'apaisent.",
  basinComputing: "calcul",
  basinReady: "prêt",
  sketchCaption: "Trois aimants · trois bassins",
  sketchHint:
    "Chaque couleur marque l'aimant au-dessus duquel le pendule finit par se poser. Sur l'image réelle, les rayons sont infiniment fins.",
};

// --------------------------------------------------------------------------
// IT
// --------------------------------------------------------------------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "Il pendolo magnetico",
    tagline: "Colora ogni partenza dal suo vincitore — appare un frattale.",
    intro:
      "Appendi un pendolo di ferro sopra tre magneti disposti a triangolo. Le leggi di Newton, l'attrazione magnetica, un pizzico d'attrito — tutto deterministico. Eppure la domanda «su quale magnete si poserà?» non ha risposta liscia. Colora ogni punto di partenza dal suo vincitore finale e appaiono tre bacini intrecciati, intessuti l'uno nell'altro a ogni scala.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Tre magneti. Un pendolo. Tre colori che non si separano mai.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Per ogni punto sopra la piastra chiedi: su quale magnete riposerà il pendolo? Dipingi quel punto del colore del vincitore. La piastra diventa una mappa di futuri — e la mappa è un frattale.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Tre magneti uguali ai vertici di un triangolo equilatero. Una molla debole riporta il pendolo al centro, l'aria gli prende energia lentamente. Stessa partenza due volte → stesso magnete due volte. Sposta la partenza di un capello e qualunque dei tre può vincere.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Il confine fra i colori è un insieme di Wada: in ogni punto di confine si incontrano tutti e tre i colori. Il determinismo sopravvive, la prevedibilità no — lo stesso paradosso che infesta il tempo, il sistema solare e ogni fisica con attrattori in competizione.",
      },
    ],
    tryIt: "Sotto: prima lo schizzo, poi gira tu le manopole su una mappa di bacini viva.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La fisica",
      title: "Newton, magneti, un po' di attrito",
      body: "Un piccolo peso di ferro pende sopra una piastra, libero di oscillare nel piano. Tre magneti lo attirano con una componente orizzontale di forza che scala come 1/(r² + h²)^(3/2) — quasi cubica quando la distanza orizzontale r è grande rispetto all'altezza h sopra la piastra, più morbida nel campo vicino; una molla debole lo riporta al centro; l'aria gli toglie energia. Le equazioni del moto sono pulite e deterministiche — solo la posizione di partenza resta libera.",
    },
    {
      pretitle: "Sezione 02 · Caos deterministico",
      title: "Stessa partenza, stessa fine — bacino diverso ovunque",
      body: "Lascia il pendolo due volte esattamente dallo stesso punto e cade due volte sullo stesso magnete. Nessun caso nella fisica. Ma sposta la partenza di un millimetro e la risposta può ribaltarsi — e il pattern di ribaltamenti è denso a ogni scala.",
    },
    {
      pretitle: "Sezione 03 · Bacini di attrazione",
      title: "Tre colori, una mappa",
      body: "Scorri una griglia di punti iniziali; per ciascuno integra le equazioni fino al riposo; coloralo dal suo magnete vincente. L'interno di ogni bacino è una regione netta. Il confine fra di loro è dove l'immagine smette di essere liscia.",
    },
    {
      pretitle: "Sezione 04 · La proprietà di Wada",
      title: "Ogni punto di confine confina con tutti e tre i colori",
      body: "Zooma sul confine tra due bacini e il terzo colore è già lì, intrecciato nella cucitura. Zooma ancora e tutti e tre i colori sono arbitrariamente vicini a ogni punto di confine. La frontiera non è una curva — è un insieme di Wada, dove tre regioni condividono un solo bordo.",
    },
    {
      pretitle: "Sezione 05 · Yoneyama, 1917",
      title: "Una curiosità topologica che l'era del caos ha riarmato",
      body: "La prima costruzione di Wada fu uno stuzzichino topologico di Kunizō Yoneyama nel 1917: tre «laghi» su un'isola, ognuno scava canali così fini che ogni punto di terra finisce su tutte e tre le rive. Per settant'anni rimase curiosità. Poi Kennedy e Yorke nel 1991 coniarono il termine «bacini di Wada» per la dinamica caotica (originariamente per il sistema Hénon-Heiles); Aguirre, Vallejo e Sanjuán dimostrarono esplicitamente la proprietà per il pendolo magnetico nei primi anni 2000 — e la teoria del caos ebbe il suo primo bacino di Wada concreto in un esperimento da tavolo.",
    },
    {
      pretitle: "Sezione 06 · Connessioni",
      title: "Metodo di Newton, sistema solare, biliardi caotici",
      body: "La stessa frontiera frattale ricompare nei bacini del metodo di Newton per le radici di un cubico, nelle integrazioni di lungo periodo dei pianeti e nello spazio delle fasi «forato» dei biliardi caotici. Il cell-mapping di Hsu produce questi bacini in serie. Dove gli attrattori competono, i loro confini amano diventare Wada.",
    },
  ],
  closingTitle: "Trova il confine di Wada.",
  closingBody:
    "L'Esploratore ti lascia cambiare forza dei magneti, smorzamento, altezza del pendolo sopra la piastra e risoluzione della griglia — e vedere il frattale affilarsi in tempo reale.",
  ctaLabel: "→ Apri l'Esploratore",
  basinCaption: "Live · mappa di bacini bassa risoluzione",
  basinDamping: "Smorzamento γ",
  basinStrength: "Forza magnete k",
  basinHint:
    "Ogni pixel è una posizione iniziale; il suo colore, il magnete che vince. Abbassa lo smorzamento e il bacino si frantuma; alzalo e i colori si calmano.",
  basinComputing: "calcolo",
  basinReady: "pronto",
  sketchCaption: "Tre magneti · tre bacini",
  sketchHint:
    "Ogni colore segna il magnete su cui il pendolo alla fine riposa. Nell'immagine reale, i raggi sono infinitamente fini.",
};

// --------------------------------------------------------------------------
// PT
// --------------------------------------------------------------------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Caos",
    title: "O pêndulo magnético",
    tagline: "Colore cada arranque pelo seu vencedor — e surge um fractal.",
    intro:
      "Pendura um pêndulo de ferro sobre três ímanes em triângulo. As leis de Newton, atracção magnética, um pingo de atrito — tudo determinista. E ainda assim a pergunta «sobre que íman pousa?» não tem resposta lisa. Colore cada ponto de partida pelo seu vencedor final e surgem três bacias entrelaçadas, tecidas uma na outra a cada escala.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Três ímanes. Um pêndulo. Três cores que nunca se separam.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Para cada ponto sobre a placa pergunta: sobre que íman descansará o pêndulo? Pinta esse ponto da cor do vencedor. A placa torna-se um mapa de futuros — e o mapa é um fractal.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Três ímanes iguais nos vértices de um triângulo equilátero. Uma mola fraca puxa o pêndulo de volta ao centro, o ar drena-lhe energia. Mesmo arranque duas vezes → mesmo íman duas vezes. Move o início por um fio e qualquer dos três pode vencer.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "A fronteira entre as cores é um conjunto de Wada: em cada ponto fronteira encontram-se as três cores. O determinismo sobrevive, a previsibilidade não — o mesmo paradoxo que assombra o tempo, o sistema solar e toda a física com atractores em competição.",
      },
    ],
    tryIt: "Em baixo: primeiro o esboço, depois mexe tu nos botões de um mapa de bacias vivo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A física",
      title: "Newton, ímanes, um pouco de atrito",
      body: "Um pequeno peso de ferro pendura-se sobre uma placa, livre de oscilar no plano. Três ímanes atraem-no com uma componente horizontal de força que escala como 1/(r² + h²)^(3/2) — quase cúbica quando a distância horizontal r é grande comparada com a altura h sobre a placa, mais suave no campo próximo; uma mola fraca devolve-o ao centro; o ar tira-lhe energia. As equações do movimento são limpas e deterministas — só o ponto de partida fica livre.",
    },
    {
      pretitle: "Secção 02 · Caos determinista",
      title: "Mesmo início, mesmo fim — bacia distinta por toda parte",
      body: "Solta o pêndulo duas vezes exactamente do mesmo ponto e cai duas vezes sobre o mesmo íman. Não há acaso na física. Mas desloca o início um milímetro e a resposta pode virar — e o padrão dessas viragens é denso a toda a escala.",
    },
    {
      pretitle: "Secção 03 · Bacias de atracção",
      title: "Três cores, um mapa",
      body: "Varre uma grelha de pontos de partida; para cada um integra as equações até parar; pinta-o pelo íman vencedor. O interior de cada bacia é uma região limpa. A fronteira entre elas é onde a imagem deixa de ser lisa.",
    },
    {
      pretitle: "Secção 04 · A propriedade de Wada",
      title: "Cada ponto fronteira confina com as três cores",
      body: "Aproxima-te da fronteira entre duas bacias e a terceira cor já está ali, alinhavada na costura. Aproxima-te mais e as três cores ficam arbitrariamente perto de cada ponto fronteira. A frente não é uma curva — é um conjunto de Wada, onde três regiões partilham uma só fronteira.",
    },
    {
      pretitle: "Secção 05 · Yoneyama, 1917",
      title: "Uma curiosidade topológica que a era do caos rearmou",
      body: "A primeira construção de Wada foi um aperitivo topológico de Kunizō Yoneyama em 1917: três «lagos» numa ilha, cada um escavando canais tão finos que cada ponto de terra acaba em todas as três margens. Setenta anos ficou como curiosidade. Depois Kennedy e Yorke em 1991 cunharam o termo «bacias de Wada» para a dinâmica caótica (originalmente para o sistema Hénon-Heiles); Aguirre, Vallejo e Sanjuán demonstraram explicitamente a propriedade para o pêndulo magnético no início dos anos 2000 — e a teoria do caos teve a sua primeira bacia de Wada concreta numa experiência de bancada.",
    },
    {
      pretitle: "Secção 06 · Ligações",
      title: "Método de Newton, sistema solar, bilhares caóticos",
      body: "A mesma fronteira fractal reaparece nas bacias do método de Newton para as raízes de um cúbico, em integrações de longo prazo dos planetas e no espaço de fases «furado» dos bilhares caóticos. O cell-mapping de Hsu produz essas bacias em série. Onde atractores competem, as suas fronteiras gostam de ficar Wada.",
    },
  ],
  closingTitle: "Encontra a fronteira de Wada.",
  closingBody:
    "O Explorador deixa-te mudar a força dos ímanes, o amortecimento, a altura do pêndulo sobre a placa e a resolução da grelha — e ver o fractal afinar em tempo real.",
  ctaLabel: "→ Abrir o Explorador",
  basinCaption: "Em directo · mapa de bacias baixa resolução",
  basinDamping: "Amortecimento γ",
  basinStrength: "Força do íman k",
  basinHint:
    "Cada pixel é uma posição inicial; a sua cor, o íman que ganha. Baixa o amortecimento e a bacia estilhaça; sobe-o e as cores acalmam.",
  basinComputing: "a calcular",
  basinReady: "pronto",
  sketchCaption: "Três ímanes · três bacias",
  sketchHint:
    "Cada cor marca o íman sobre o qual o pêndulo acaba por descansar. Na imagem real, os raios são infinitamente finos.",
};

// --------------------------------------------------------------------------
// SV
// --------------------------------------------------------------------------
const sv: RichStory = {
  page: {
    pretitle: "Tema · Kaos",
    title: "Den magnetiska pendeln",
    tagline: "Färga varje start efter sin vinnare — och en fraktal dyker upp.",
    intro:
      "Häng en järnpendel över tre magneter i triangel. Newtons lagar, magnetisk dragning, en aning friktion — allt deterministiskt. Och ändå har frågan «över vilken magnet landar den?» inget slätt svar. Färga varje startpunkt efter sin slutliga vinnare och tre sammanflätade bäcken dyker upp, vävda i varandra på varje skala.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Tre magneter. En pendel. Tre färger som aldrig skiljs åt.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "För varje punkt över plattan fråga: över vilken magnet kommer pendeln att vila? Måla punkten i vinnarens färg. Plattan blir en karta över framtider — och kartan är en fraktal.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Tre lika magneter i hörnen av en liksidig triangel. En svag fjäder drar pendeln till mitten, luften tappar den långsamt på energi. Samma start två gånger → samma magnet två gånger. Flytta starten ett hårsmål, och vilken som helst av de tre kan vinna.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Gränsen mellan färgerna är en Wada-mängd: i varje gränspunkt möts alla tre färger. Determinismen överlever, förutsägbarheten inte — samma paradox spökar i vädret, solsystemet och all fysik med konkurrerande attraktorer.",
      },
    ],
    tryIt: "Nedan: först skissen, sedan vrider du själv rattarna på en levande bäckenkarta.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Fysiken",
      title: "Newton, magneter, en aning friktion",
      body: "En liten järnvikt hänger över en platta, fri att svänga i planet. Tre magneter drar i den med en horisontell kraftkomponent som skalar som 1/(r² + h²)^(3/2) — nära kubisk när horisontalavståndet r är stort jämfört med höjden h över plattan, mildare i närfältet; en svag fjäder drar tillbaka den till mitten; luft tar dess energi. Rörelseekvationerna är rena och deterministiska — bara startpunkten är fri.",
    },
    {
      pretitle: "Avsnitt 02 · Deterministisk kaos",
      title: "Samma start, samma slut — olika bäcken överallt",
      body: "Släpp pendeln två gånger från exakt samma punkt och den landar två gånger över samma magnet. Ingen slump i fysiken. Men flytta starten en millimeter och svaret kan vända — och mönstret av vändningar är tätt på varje skala.",
    },
    {
      pretitle: "Avsnitt 03 · Attraktionsbäcken",
      title: "Tre färger, en karta",
      body: "Svep ett rutnät av startpunkter; för var och en integrera ekvationerna tills den vilar; färga den efter sin vinnande magnet. Insidan av varje bäcken är en ren färgad region. Gränsen mellan dem är där bilden slutar vara slät.",
    },
    {
      pretitle: "Avsnitt 04 · Wada-egenskapen",
      title: "Varje gränspunkt gränsar till alla tre färger",
      body: "Zooma in på gränsen mellan två bäcken och den tredje färgen finns redan där, trädd genom sömmen. Zooma igen och alla tre färger ligger godtyckligt nära varje gränspunkt. Fronten är ingen kurva — den är en Wada-mängd, där tre regioner delar en gemensam gräns.",
    },
    {
      pretitle: "Avsnitt 05 · Yoneyama, 1917",
      title: "En topologisk kuriositet som kaos-eran beväpnade",
      body: "Den första Wada-konstruktionen var en topologisk amuse-bouche av Kunizō Yoneyama 1917: tre «sjöar» på en ö, var och en gräver kanaler så fina att varje landpunkt hamnar på alla tre stränder. I sjuttio år förblev det en kuriositet. Sedan myntade Kennedy och Yorke 1991 begreppet Wada-bäcken för kaotisk dynamik (ursprungligen för Hénon-Heiles-systemet); Aguirre, Vallejo och Sanjuán demonstrerade egenskapen explicit för den magnetiska pendeln i början av 2000-talet — och kaosteorin hade sitt första konkreta Wada-bäcken i ett bordsexperiment.",
    },
    {
      pretitle: "Avsnitt 06 · Kopplingar",
      title: "Newtons metod, solsystemet, kaotiska biljarder",
      body: "Samma fraktala front dyker upp i Newton-metodens bäcken för rötterna till ett kubiskt polynom, i långtidsintegrationer av planeterna och i det «läckande» fasrummet hos kaotiska biljarder. Hsus cell-mapping-metod producerar dessa bäcken på löpande band. Där attraktorer konkurrerar tenderar deras gränser att växa Wada.",
    },
  ],
  closingTitle: "Hitta Wada-gränsen.",
  closingBody:
    "Utforskaren låter dig ändra magnetstyrka, dämpning, pendelhöjd över plattan och rutnätets upplösning — och se fraktalen skärpas i realtid.",
  ctaLabel: "→ Öppna Utforskaren",
  basinCaption: "Live · låguppl. bäckenkarta",
  basinDamping: "Dämpning γ",
  basinStrength: "Magnetstyrka k",
  basinHint:
    "Varje pixel är en startposition; dess färg, magneten som vinner. Vrid ner dämpningen och bäckenet splittras; vrid upp och färgerna lugnar sig.",
  basinComputing: "räknar",
  basinReady: "klar",
  sketchCaption: "Tre magneter · tre bäcken",
  sketchHint:
    "Varje färg markerar magneten som pendeln till slut vilar över. I den riktiga bilden är ekrarna oändligt fina.",
};

// --------------------------------------------------------------------------
// NO
// --------------------------------------------------------------------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Kaos",
    title: "Den magnetiske pendelen",
    tagline: "Farg hver start etter sin vinner — og en fraktal dukker opp.",
    intro:
      "Heng en jernpendel over tre magneter i en trekant. Newtons lover, magnetisk tiltrekning, et streif av friksjon — alt deterministisk. Likevel har spørsmålet «over hvilken magnet lander den?» ikke noe glatt svar. Farg hvert startpunkt etter sin endelige vinner, og tre sammenflettede bekken dukker opp, vevet inn i hverandre på hver skala.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Tre magneter. Én pendel. Tre farger som aldri skilles.",
    cards: [
      {
        label: "01",
        title: "Den store idéen",
        body: "For hvert punkt over platen, spør: over hvilken magnet vil pendelen hvile? Mal punktet i vinnerens farge. Platen blir et kart over framtider — og kartet er en fraktal.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Tre like magneter i hjørnene av en likesidet trekant. En svak fjær drar pendelen tilbake til midten, luft tapper den sakte for energi. Samme start to ganger → samme magnet to ganger. Flytt starten et hårsbredd, og hvilken som helst av de tre kan vinne.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Grensen mellom fargene er en Wada-mengde: i hvert grensepunkt møtes alle tre farger. Determinismen overlever, forutsigbarheten ikke — det samme paradokset hjemsøker været, solsystemet og all fysikk med konkurrerende attraktorer.",
      },
    ],
    tryIt: "Under: først skissen, så vrir du selv på rattene på et levende bekkenkart.",
  },
  sections: [
    {
      pretitle: "Del 01 · Fysikken",
      title: "Newton, magneter, litt friksjon",
      body: "En liten jernlodd henger over en plate, fri til å svinge i planet. Tre magneter trekker i den med en horisontal kraftkomponent som skalerer som 1/(r² + h²)^(3/2) — nær kubisk når horisontalavstanden r er stor sammenlignet med høyden h over platen, mildere i nærfeltet; en svak fjær drar den tilbake til midten; luft tapper energien. Bevegelsesligningene er rene og deterministiske — bare startpunktet er fritt.",
    },
    {
      pretitle: "Del 02 · Deterministisk kaos",
      title: "Samme start, samme slutt — annet bekken overalt",
      body: "Slipp pendelen to ganger fra nøyaktig samme punkt og den lander to ganger over samme magnet. Ingen tilfeldighet i fysikken. Men flytt starten en millimeter og svaret kan snu — og mønsteret av snuinger er tett på hver skala.",
    },
    {
      pretitle: "Del 03 · Tiltrekningsbekken",
      title: "Tre farger, ett kart",
      body: "Sveip et rutenett av startpunkter; for hvert et integrer ligningene til ro; farg det etter den vinnende magneten. Innsiden av hvert bekken er en ren farget region. Grensen mellom dem er der bildet slutter å være glatt.",
    },
    {
      pretitle: "Del 04 · Wada-egenskapen",
      title: "Hvert grensepunkt grenser til alle tre farger",
      body: "Zoom inn på grensen mellom to bekken og den tredje fargen er allerede der, trådd gjennom sømmen. Zoom igjen og alle tre farger ligger vilkårlig nær hvert grensepunkt. Fronten er ingen kurve — den er en Wada-mengde, der tre regioner deler én felles grense.",
    },
    {
      pretitle: "Del 05 · Yoneyama, 1917",
      title: "En topologisk kuriositet som kaos-tiden væpnet opp",
      body: "Den første Wada-konstruksjonen var en topologisk smakebit fra Kunizō Yoneyama i 1917: tre «sjøer» på en øy, hver graver kanaler så fine at hvert landpunkt ender på alle tre bredder. I sytti år forble det en kuriositet. Så myntet Kennedy og Yorke i 1991 begrepet Wada-bekken for kaotisk dynamikk (opprinnelig for Hénon-Heiles-systemet); Aguirre, Vallejo og Sanjuán viste egenskapen eksplisitt for den magnetiske pendelen tidlig på 2000-tallet — og kaosteorien hadde sitt første konkrete Wada-bekken i et bordeksperiment.",
    },
    {
      pretitle: "Del 06 · Forbindelser",
      title: "Newtons metode, solsystemet, kaotiske biljarder",
      body: "Den samme fraktale fronten dukker opp i Newton-metodens bekken for røttene til et tredjegradspolynom, i langtidsintegrasjoner av planetene og i det «lekke» faserommet til kaotiske biljarder. Hsus cellekartlegging produserer slike bekken i serie. Der attraktorer konkurrerer, vokser grensene gjerne Wada.",
    },
  ],
  closingTitle: "Finn Wada-grensen.",
  closingBody:
    "Utforskeren lar deg endre magnetstyrke, demping, pendelhøyde over platen og rutenettets oppløsning — og se fraktalen skjerpe seg i sanntid.",
  ctaLabel: "→ Åpne Utforskeren",
  basinCaption: "Live · lav-oppl. bekkenkart",
  basinDamping: "Demping γ",
  basinStrength: "Magnetstyrke k",
  basinHint:
    "Hvert piksel er en startposisjon; fargen, magneten som vinner. Skru dempingen ned og bekkenet splintres; skru opp og fargene roer seg.",
  basinComputing: "regner",
  basinReady: "klar",
  sketchCaption: "Tre magneter · tre bekken",
  sketchHint:
    "Hver farge markerer magneten pendelen til slutt hviler over. I det ekte bildet er ekrene uendelig fine.",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------
export default function MagpendulumStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  // The shell needs a full StoryPage; we inject `sections: []` since the
  // long-form sections are rendered manually below.
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/magpendulum/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="m·p̈ = −Σᵢ kᵢ (p − mᵢ) / r³ − γ·ṗ − ω²·p"
      formulaLatex={
        "\\ddot{\\vec p} = -\\sum_i k_i \\dfrac{\\vec p - \\vec m_i}{|\\vec p - \\vec m_i|^3} - \\gamma \\dot{\\vec p} - \\omega^2 \\vec p"
      }
      finalLabel={story.closingTitle}
    >
      {/* Encounter — three layperson cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={140 + i * 90}>
              <article className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-coral/40">
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {card.label}
                </div>
                <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={420}>
          <p className="mx-auto max-w-2xl text-center italic text-ink-300">
            {story.encounter.tryIt}
          </p>
        </Reveal>

        {/* Schematic preview — static SVG */}
        <Reveal delay={520}>
          <div className="hairline flex flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.sketchCaption}
            </div>
            <BasinSketchSVG />
            <p className="max-w-md text-center font-mono text-xs leading-relaxed text-ink-300">
              {story.sketchHint}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 01 — The physics */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec0!} accent={ACCENT} />
      </section>

      {/* Section 02 — Deterministic chaos */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec1!} accent={ACCENT} />
      </section>

      {/* Section 03 — Basins of attraction + LIVE INTERACTIVE BASIN MINI */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard {...sec2!} accent={ACCENT} />
        <Reveal delay={120}>
          <MagPendulumBasinMini
            caption={story.basinCaption}
            dampingLabel={story.basinDamping}
            strengthLabel={story.basinStrength}
            hint={story.basinHint}
            computingLabel={story.basinComputing}
            readyLabel={story.basinReady}
          />
        </Reveal>
      </section>

      {/* Section 04 — Wada property */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec3!} accent={ACCENT} />
      </section>

      {/* Section 05 — Yoneyama 1917 */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec4!} accent={ACCENT} />
      </section>

      {/* Section 06 — Connections */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec5!} accent={ACCENT} />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.encounter.pretitle}
          </div>
          <h2 className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{story.closingBody}</p>
          <div className="pt-2">
            <Link
              href="/magpendulum/explorer"
              className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
            >
              {story.ctaLabel}
            </Link>
          </div>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
