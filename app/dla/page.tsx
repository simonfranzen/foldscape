"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { DlaMiniSim } from "@/components/DlaMiniSim";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-coral";

// --------------------------------------------------------------------------
// Hand-drawn dendrite. Static, deterministic, used as a quiet visual cue
// underneath the «sticking rule» card. The live grower lives in
// <DlaMiniSim/>; this SVG is just a clean printable hint.
// --------------------------------------------------------------------------

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function DendriteSVG() {
  const W = 260;
  const H = 200;
  const cx = W / 2;
  const cy = H / 2;
  const rnd = mulberry32(1337);
  const arms = 5;
  const segs: Array<[number, number, number, number]> = [];
  for (let a = 0; a < arms; a++) {
    const baseAngle = (a / arms) * Math.PI * 2 + Math.PI / 7;
    let x = cx;
    let y = cy;
    let angle = baseAngle;
    for (let s = 0; s < 14; s++) {
      const len = 7 + rnd() * 4;
      const nx = x + Math.cos(angle) * len;
      const ny = y + Math.sin(angle) * len;
      segs.push([x, y, nx, ny]);
      x = nx;
      y = ny;
      angle += Math.sin(s * 0.7 + a) * 0.5;
      if (s % 4 === 2) {
        let bx = x;
        let by = y;
        let ba = angle + 0.9;
        for (let k = 0; k < 5; k++) {
          const len2 = 5 + rnd() * 3;
          const nbx = bx + Math.cos(ba) * len2;
          const nby = by + Math.sin(ba) * len2;
          segs.push([bx, by, nbx, nby]);
          bx = nbx;
          by = nby;
          ba += Math.sin(k + a) * 0.4;
        }
      }
    }
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto h-auto w-full max-w-[280px]"
      role="img"
      aria-label="DLA-like dendrite seeded at centre"
    >
      <rect width={W} height={H} fill="#06070d" rx={10} />
      {segs.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(255,122,182,0.7)"
          strokeWidth={1.1}
        />
      ))}
      <circle cx={cx} cy={cy} r={2.4} fill="#7df3ff" />
    </svg>
  );
}

// --------------------------------------------------------------------------
// Tip-vs-valley illustration. Three tips reaching outward; faint valleys
// between them. Used next to «why branchy not blobby».
// --------------------------------------------------------------------------

function TipsVsValleysSVG() {
  const W = 280;
  const H = 200;
  const cx = W / 2;
  const cy = H - 20;
  const tips: Array<{ x: number; y: number; angle: number }> = [];
  // three tips
  const tipAngles = [-Math.PI / 2, -Math.PI / 2 - 0.6, -Math.PI / 2 + 0.6];
  for (const a of tipAngles) {
    const r = 110;
    tips.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, angle: a });
  }
  // dashed arrows: walkers approaching tips
  const arrows: Array<[number, number, number, number]> = [];
  for (const t of tips) {
    for (let k = 0; k < 3; k++) {
      const off = (k - 1) * 0.35;
      const ax = t.x + Math.cos(t.angle + off) * 50;
      const ay = t.y + Math.sin(t.angle + off) * 50;
      arrows.push([ax, ay, t.x, t.y]);
    }
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Tips capture walkers, valleys starve"
    >
      <rect width={W} height={H} fill="#06070d" rx={10} />
      {/* trunk */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 30} stroke="rgba(255,122,182,0.7)" strokeWidth={2} />
      {tips.map((t, i) => (
        <g key={i}>
          <line
            x1={cx}
            y1={cy - 30}
            x2={t.x}
            y2={t.y}
            stroke="rgba(255,122,182,0.75)"
            strokeWidth={1.6}
          />
          <circle cx={t.x} cy={t.y} r={3.2} fill="#ff7ab6" />
        </g>
      ))}
      {/* arrows hitting tips */}
      {arrows.map(([x1, y1, x2, y2], i) => (
        <line
          key={`a${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(125,243,255,0.55)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      ))}
      {/* faint valley arrow that misses */}
      <line
        x1={cx - 40}
        y1={cy - 20}
        x2={cx - 8}
        y2={cy - 28}
        stroke="rgba(179,136,255,0.35)"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <line
        x1={cx + 40}
        y1={cy - 20}
        x2={cx + 8}
        y2={cy - 28}
        stroke="rgba(179,136,255,0.35)"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text
        x={cx}
        y={H - 4}
        textAnchor="middle"
        fontSize="9"
        fill="rgba(255,209,102,0.7)"
        fontFamily="monospace"
      >
        seed
      </text>
    </svg>
  );
}

// --------------------------------------------------------------------------
// Per-locale rich story content. Hero copy still lives in shared stories.ts;
// the encounter, sections, and CTAs below are authored here per-locale.
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
  miniSimCaption: string;
  dendriteCaption: string;
  dendriteHint: string;
  tipsCaption: string;
  tipsHint: string;
  dimensionCaption: string;
  dimensionBody: string;
};

const en: RichStory = {
  page: {
    pretitle: "Diffusion-limited aggregation",
    title: "Random walks freeze on contact.",
    tagline: "And a coral grows from a single pixel.",
    intro:
      "Drop a seed in the middle of an empty grid. Release a particle at the edge; let it stagger on a random walk. The instant it touches the seed, it freezes there. Release another. Then ten thousand more. A branching, dendritic shape grows — the same fractal coral that copper takes on an electroplating tank, that lichen draws on a wall, that a lightning strike leaves on bare skin.",
    ctaInteractive: "Grow your own dendrite",
  },
  encounter: {
    pretitle: "First encounter",
    title: "One seed. Random walkers. A coral.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Put one stuck pixel at the centre. Release walkers at the boundary that drift on pure random walks. The moment a walker touches the cluster, it freezes there forever — and a branching shape grows out from a single seed.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "One seed pixel. A few thousand random walkers spawned around the edge of a circle. Each walker staggers — up, down, left, right with equal odds — until it grazes the cluster and locks on. Out comes the coral you see below.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Witten and Sander showed in 1981 that this two-rule game has a universal fractal dimension of ≈ 1.71 — independent of seed or lattice. The same shape returns in electroplated copper, lichen, bacterial colonies, and the Lichtenberg figures left by lightning.",
      },
    ],
    tryIt: "Below: turn the walker knob, watch the dendrite grow live.",
  },
  sections: [
    {
      pretitle: "Section 01 · The setup",
      title: "A seed, walkers, and a sticking rule",
      body: "Place a single stuck pixel at the centre of a grid — that is the seed. Spawn walkers at the boundary, each one taking a random step up, down, left or right at every tick. There is no force, no field, no plan; just diffusion.",
    },
    {
      pretitle: "Section 02 · The sticking rule",
      title: "Touch a stuck cell — freeze.",
      body: "The instant a walker lands next to any frozen cell, it sticks there and never moves again. That is the entire physics. No surface tension, no curvature term, no temperature — one binary rule, applied to every walker that wanders too close.",
    },
    {
      pretitle: "Section 03 · Why branchy, not blobby",
      title: "Tips eat the walkers; valleys starve.",
      body: "A walker drifting in from far away is far more likely to brush a tip sticking out than to slip down into a valley between two arms. Tips grow faster, valleys grow slower, and the gap widens with every frame. The cluster sharpens itself into a coral — geometry alone, with no hidden parameter.",
    },
    {
      pretitle: "Section 04 · The universal dimension",
      title: "D ≈ 1.71 — and it does not care about the seed.",
      body: "Witten & Sander, 1981: the Hausdorff dimension of a 2D DLA cluster is about 1.71, somewhere between a curve (D = 1) and a filled disc (D = 2). Niemeyer, Pietronero and Wiesmann (1984) wrapped it in the broader dielectric-breakdown family; Sander (1986) collected the early evidence. The number is universal across seeds, lattices, and walker rules.",
    },
    {
      pretitle: "Section 05 · Where it appears in nature",
      title: "Copper, lightning, lichen, neurons.",
      body: "Electroplated copper deposited too quickly grows DLA-like dendrites. Lichtenberg figures — the branching scars left by lightning or high-voltage discharges in resin — share the same statistics. So do lichen colonies on rock, the tips of bacterial mats on agar, and the dendrites of pyramidal neurons in cortex.",
    },
    {
      pretitle: "Section 06 · Variants",
      title: "Sticky vs slippery, point vs line vs ring, 2D vs 3D.",
      body: "Lower the stickiness and walkers bounce off the cluster a few times before freezing — the dendrite thickens into a denser blob. Swap the centre seed for a horizontal line and you get a frost-on-glass crystal; swap it for a ring and the coral grows inwards. Lift it into three dimensions and the fractal dimension shifts to about 2.5.",
    },
  ],
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you switch between point, line and ring seeds, push the walker count up to a thousand per frame, slide the stickiness, and watch the dendrite grow in real time. Everything you just read is one click away.",
  ctaLabel: "→ Open the Explorer",
  miniSimCaption: "Live · centre seed · grow it yourself",
  dendriteCaption: "A dendrite from a single seed",
  dendriteHint: "Tips grow faster than valleys — branches reach outward and starve the interior.",
  tipsCaption: "Why branches, not blobs",
  tipsHint:
    "Walkers drift in from far away. Tips that stick out catch them first; valleys between arms see almost nothing.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody:
    "The Hausdorff dimension of a 2D DLA cluster. Universal across seed shapes and lattice types.",
};

const de: RichStory = {
  page: {
    pretitle: "Diffusionsbegrenzte Aggregation",
    title: "Zufällige Wanderer frieren beim Kontakt fest.",
    tagline: "Und aus einem einzigen Pixel wächst eine Koralle.",
    intro:
      "Setz einen Saatpixel in die Mitte eines leeren Gitters. Lass am Rand ein Teilchen los, das in zufälligen Schritten taumelt. In dem Moment, in dem es den Cluster berührt, friert es dort fest. Lass noch eins los. Dann zehntausend mehr. Eine verästelte, dendritische Form wächst heran — dieselbe Fraktal-Koralle, die Kupfer in der Galvanik annimmt, die Flechten an einer Mauer zeichnen, die ein Blitz auf nackter Haut hinterlässt.",
    ctaInteractive: "Eigene Koralle wachsen lassen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Ein Saatpixel. Zufallswanderer. Eine Koralle.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Ein einziger Pixel klebt in der Mitte. Vom Rand starten Wanderer, die rein zufällig durch das Gitter taumeln. Sobald einer den Cluster berührt, friert er für immer fest — und aus dem Keim wächst eine verzweigte Form heraus.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Ein Saatpixel. Ein paar tausend Wanderer, die am Rand eines Kreises losgelassen werden. Jeder torkelt — hoch, runter, links, rechts mit gleicher Chance — bis er den Cluster streift und einrastet. Heraus kommt die Koralle, die du unten siehst.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Witten und Sander zeigten 1981, dass dieses Zwei-Regeln-Spiel eine universelle fraktale Dimension von ≈ 1,71 erzeugt — unabhängig vom Saatpixel oder Gitter. Dieselbe Form taucht in galvanisiertem Kupfer, in Flechten, in Bakterienkolonien und in Lichtenberg-Figuren auf, die Blitze hinterlassen.",
      },
    ],
    tryIt: "Unten: dreh am Wanderer-Regler, sieh dem Dendriten live beim Wachsen zu.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Der Aufbau",
      title: "Ein Saatpixel, Wanderer und eine Klebe-Regel",
      body: "Setz einen einzigen festen Pixel in die Mitte eines Gitters — das ist der Keim. Am Rand starten Wanderer, jeder macht pro Tick einen zufälligen Schritt hoch, runter, links oder rechts. Keine Kraft, kein Feld, kein Plan — nur Diffusion.",
    },
    {
      pretitle: "Abschnitt 02 · Die Klebe-Regel",
      title: "Berühr eine feste Zelle — friere fest.",
      body: "Sobald ein Wanderer auf einem Feld neben einer gefrorenen Zelle landet, klebt er dort und bewegt sich nie wieder. Das ist die gesamte Physik. Keine Oberflächenspannung, kein Krümmungsterm, keine Temperatur — eine einzige Ja/Nein-Regel, auf jeden Wanderer angewandt, der zu nah kommt.",
    },
    {
      pretitle: "Abschnitt 03 · Warum verzweigt, nicht blobby",
      title: "Spitzen fressen die Wanderer; Täler verhungern.",
      body: "Ein von weit her treibender Wanderer trifft viel wahrscheinlicher eine herausragende Spitze als ein Tal zwischen zwei Armen. Spitzen wachsen schneller, Täler langsamer, und der Abstand wird mit jedem Frame größer. Der Cluster schärft sich selbst zur Koralle — reine Geometrie, kein versteckter Parameter.",
    },
    {
      pretitle: "Abschnitt 04 · Die universelle Dimension",
      title: "D ≈ 1,71 — und sie schert sich nicht um den Keim.",
      body: "Witten & Sander, 1981: die Hausdorff-Dimension eines 2D-DLA-Clusters liegt bei etwa 1,71 — irgendwo zwischen einer Kurve (D = 1) und einer ausgefüllten Scheibe (D = 2). Niemeyer, Pietronero und Wiesmann (1984) verpackten das in die größere Familie der dielektrischen Durchschläge; Sander (1986) sammelte die frühen Belege. Die Zahl ist universell über Keime, Gitter und Wanderer-Regeln hinweg.",
    },
    {
      pretitle: "Abschnitt 05 · Wo es in der Natur auftaucht",
      title: "Kupfer, Blitze, Flechten, Neuronen.",
      body: "Zu schnell galvanisiertes Kupfer wächst in DLA-ähnlichen Dendriten. Lichtenberg-Figuren — die verästelten Narben, die Blitze oder Hochspannungs-Entladungen in Harz hinterlassen — folgen derselben Statistik. Genauso Flechtenkolonien auf Stein, die Spitzen von Bakterienmatten auf Agar und die Dendriten der Pyramidenzellen im Kortex.",
    },
    {
      pretitle: "Abschnitt 06 · Varianten",
      title: "Klebrig oder rutschig, Punkt oder Linie oder Ring, 2D oder 3D.",
      body: "Senk die Klebrigkeit, und Wanderer prallen ein paar Mal vom Cluster ab, bevor sie festfrieren — der Dendrit wird zum dichteren Blob. Tausch den Mittelpunkt-Keim gegen eine horizontale Linie aus und du bekommst einen Frost-am-Fenster-Kristall; tausch ihn gegen einen Ring, und die Koralle wächst nach innen. Heb das Ganze in drei Dimensionen, und die fraktale Dimension verschiebt sich auf etwa 2,5.",
    },
  ],
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Im Explorer kannst du zwischen Punkt-, Linien- und Ring-Keim wechseln, die Wanderer bis auf tausend pro Frame hochdrehen, die Klebrigkeit verschieben und dem Dendriten live beim Wachsen zusehen. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  ctaLabel: "→ Explorer öffnen",
  miniSimCaption: "Live · Mittelpunkt-Keim · selbst wachsen lassen",
  dendriteCaption: "Ein Dendrit aus einem einzigen Keim",
  dendriteHint:
    "Spitzen wachsen schneller als Täler — Äste greifen nach außen und lassen das Innere verhungern.",
  tipsCaption: "Warum Äste, keine Blobs",
  tipsHint:
    "Wanderer treiben von weit her ein. Herausragende Spitzen fangen sie zuerst; Täler zwischen den Armen sehen fast nichts.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody:
    "Die Hausdorff-Dimension eines 2D-DLA-Clusters. Universell über Keimformen und Gittertypen hinweg.",
};

const es: RichStory = {
  page: {
    pretitle: "Agregación limitada por difusión",
    title: "Los caminantes aleatorios se congelan al tocar.",
    tagline: "Y un coral crece a partir de un solo píxel.",
    intro:
      "Pon una semilla en medio de una cuadrícula vacía. Suelta una partícula en el borde y deja que tambalee al azar. En el instante en que toca al cúmulo, se congela ahí. Suelta otra. Luego diez mil más. Crece una forma ramificada, dendrítica — el mismo coral fractal que toma el cobre en una cuba de electrólisis, que dibujan los líquenes en una pared, que un rayo deja sobre la piel desnuda.",
    ctaInteractive: "Haz crecer tu coral",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Una semilla. Caminantes al azar. Un coral.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Un píxel pegado en el centro. Sueltas caminantes en el borde que se desplazan por puro azar. En cuanto uno toca al cúmulo, se congela para siempre — y de la semilla brota una forma ramificada.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Un píxel semilla. Unos pocos miles de caminantes aleatorios sueltos en el borde de un círculo. Cada uno tambalea — arriba, abajo, izquierda, derecha con igual probabilidad — hasta rozar al cúmulo y quedar fijo. Sale el coral que ves abajo.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Witten y Sander mostraron en 1981 que este juego de dos reglas tiene una dimensión fractal universal de ≈ 1,71 — independiente de la semilla o la red. La misma forma vuelve en el cobre electroplateado, en los líquenes, en las colonias bacterianas y en las figuras de Lichtenberg que dejan los rayos.",
      },
    ],
    tryIt: "Abajo: gira el botón de caminantes, mira al dendrito crecer en vivo.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El montaje",
      title: "Una semilla, caminantes y una regla de pegado",
      body: "Pon un único píxel pegado en el centro de la cuadrícula — esa es la semilla. En el borde brotan caminantes que dan, en cada tic, un paso al azar arriba, abajo, izquierda o derecha. Sin fuerza, sin campo, sin plan: pura difusión.",
    },
    {
      pretitle: "Sección 02 · La regla de pegado",
      title: "Toca una celda fija — congélate.",
      body: "En cuanto un caminante aterriza junto a cualquier celda congelada, queda pegado ahí y no se mueve más. Esa es toda la física. Sin tensión superficial, sin término de curvatura, sin temperatura — una sola regla binaria, aplicada a cada caminante que se acerca demasiado.",
    },
    {
      pretitle: "Sección 03 · Por qué ramificado, no blobby",
      title: "Las puntas se comen a los caminantes; los valles pasan hambre.",
      body: "Un caminante que llega de lejos roza mucho más probablemente una punta saliente que un valle entre dos brazos. Las puntas crecen más rápido, los valles más despacio, y la brecha se ensancha con cada frame. El cúmulo se afila solo hasta hacerse coral — pura geometría, sin parámetro oculto.",
    },
    {
      pretitle: "Sección 04 · La dimensión universal",
      title: "D ≈ 1,71 — y no le importa la semilla.",
      body: "Witten & Sander, 1981: la dimensión de Hausdorff de un cúmulo DLA en 2D es de aproximadamente 1,71, en algún sitio entre una curva (D = 1) y un disco lleno (D = 2). Niemeyer, Pietronero y Wiesmann (1984) lo envolvieron en la familia más amplia de la ruptura dieléctrica; Sander (1986) reunió las primeras pruebas. El número es universal sobre semillas, redes y reglas de caminante.",
    },
    {
      pretitle: "Sección 05 · Dónde aparece en la naturaleza",
      title: "Cobre, rayos, líquenes, neuronas.",
      body: "El cobre electrolítico depositado demasiado rápido crece en dendritas de tipo DLA. Las figuras de Lichtenberg — las cicatrices ramificadas que dejan rayos o descargas de alta tensión en resina — siguen la misma estadística. Y también las colonias de líquenes en la roca, las puntas de tapetes bacterianos en agar y las dendritas de las neuronas piramidales en la corteza.",
    },
    {
      pretitle: "Sección 06 · Variantes",
      title: "Pegajoso o resbaladizo, punto o línea o anillo, 2D o 3D.",
      body: "Baja la pegajosidad y los caminantes rebotan unas veces antes de congelarse — el dendrito se espesa en un blob más denso. Cambia la semilla central por una línea horizontal y obtienes un cristal de escarcha en cristal; cámbiala por un anillo y el coral crece hacia adentro. Súbelo a tres dimensiones y la dimensión fractal se desplaza a alrededor de 2,5.",
    },
  ],
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja cambiar entre semilla puntual, lineal o anular, subir los caminantes hasta mil por frame, deslizar la pegajosidad y ver crecer al dendrito en tiempo real. Todo lo que acabas de leer está a un clic.",
  ctaLabel: "→ Abrir el Explorador",
  miniSimCaption: "En vivo · semilla central · hazlo crecer tú",
  dendriteCaption: "Un dendrito a partir de una sola semilla",
  dendriteHint:
    "Las puntas crecen más rápido que los valles — las ramas se estiran hacia afuera y dejan el interior sin alimento.",
  tipsCaption: "Por qué ramas, no blobs",
  tipsHint:
    "Los caminantes llegan de lejos. Las puntas salientes los atrapan primero; los valles entre brazos casi no ven nada.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody:
    "La dimensión de Hausdorff de un cúmulo DLA en 2D. Universal sobre formas de semilla y tipos de red.",
};

const fr: RichStory = {
  page: {
    pretitle: "Agrégation limitée par diffusion",
    title: "Les marcheurs aléatoires gèlent au contact.",
    tagline: "Et un corail pousse à partir d'un seul pixel.",
    intro:
      "Pose une graine au milieu d'une grille vide. Lâche une particule au bord, laisse-la tituber sur une marche aléatoire. Au moment où elle touche l'amas, elle se fige là. Lâches-en une autre. Puis dix mille de plus. Une forme ramifiée, dendritique, pousse — le même corail fractal que prend le cuivre dans un bain d'électrolyse, que les lichens dessinent sur un mur, que la foudre laisse sur la peau nue.",
    ctaInteractive: "Fais pousser ton corail",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Une graine. Des marcheurs aléatoires. Un corail.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Un pixel collé au centre. Tu lâches au bord des marcheurs qui dérivent par pur hasard. Dès qu'un marcheur touche l'amas, il gèle pour toujours — et de la graine pousse une forme ramifiée.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Un pixel graine. Quelques milliers de marcheurs aléatoires lâchés au bord d'un cercle. Chacun titube — haut, bas, gauche, droite avec la même chance — jusqu'à frôler l'amas et s'y verrouiller. Sort le corail que tu vois plus bas.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Witten et Sander ont montré en 1981 que ce jeu à deux règles a une dimension fractale universelle d'environ 1,71 — peu importe la graine ou le réseau. La même forme revient dans le cuivre électrodéposé, les lichens, les colonies bactériennes et les figures de Lichtenberg laissées par la foudre.",
      },
    ],
    tryIt: "Ci-dessous : tourne la molette des marcheurs, regarde le dendrite pousser en direct.",
  },
  sections: [
    {
      pretitle: "Section 01 · Le montage",
      title: "Une graine, des marcheurs et une règle de collage",
      body: "Pose un unique pixel collé au centre d'une grille — c'est la graine. Au bord, des marcheurs apparaissent ; à chaque tic, chacun fait un pas aléatoire haut, bas, gauche ou droite. Pas de force, pas de champ, pas de plan : juste de la diffusion.",
    },
    {
      pretitle: "Section 02 · La règle de collage",
      title: "Touche une case figée — gèle.",
      body: "Dès qu'un marcheur atterrit à côté d'une case figée, il s'y colle et ne bouge plus jamais. C'est toute la physique. Pas de tension superficielle, pas de terme de courbure, pas de température — une seule règle binaire, appliquée à chaque marcheur qui s'approche trop.",
    },
    {
      pretitle: "Section 03 · Pourquoi ramifié, pas blobby",
      title: "Les pointes mangent les marcheurs ; les vallées jeûnent.",
      body: "Un marcheur arrivant de loin a bien plus de chances d'effleurer une pointe qui dépasse qu'une vallée entre deux bras. Les pointes poussent plus vite, les vallées moins vite, et l'écart se creuse à chaque image. L'amas s'affûte tout seul en corail — pure géométrie, sans paramètre caché.",
    },
    {
      pretitle: "Section 04 · La dimension universelle",
      title: "D ≈ 1,71 — et la graine ne change rien.",
      body: "Witten & Sander, 1981 : la dimension de Hausdorff d'un amas DLA en 2D vaut environ 1,71 — quelque part entre une courbe (D = 1) et un disque plein (D = 2). Niemeyer, Pietronero et Wiesmann (1984) l'ont enveloppée dans la famille plus large des décharges diélectriques ; Sander (1986) a rassemblé les premières preuves. Le nombre est universel sur les graines, les réseaux et les règles de marcheur.",
    },
    {
      pretitle: "Section 05 · Où ça apparaît dans la nature",
      title: "Cuivre, foudre, lichens, neurones.",
      body: "Le cuivre électrodéposé trop vite pousse en dendrites de type DLA. Les figures de Lichtenberg — les cicatrices ramifiées laissées par la foudre ou les décharges haute tension dans la résine — suivent la même statistique. Idem pour les colonies de lichens sur la roche, les pointes des tapis bactériens sur agar et les dendrites des neurones pyramidaux du cortex.",
    },
    {
      pretitle: "Section 06 · Variantes",
      title: "Collant ou glissant, point ou ligne ou anneau, 2D ou 3D.",
      body: "Baisse la viscosité et les marcheurs rebondissent quelques fois avant de geler — le dendrite s'épaissit en un blob plus dense. Échange la graine centrale contre une ligne horizontale et tu obtiens un cristal de givre sur vitre ; échange-la contre un anneau, et le corail pousse vers l'intérieur. Passe en trois dimensions et la dimension fractale grimpe à environ 2,5.",
    },
  ],
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse basculer entre graines en point, ligne et anneau, pousser les marcheurs jusqu'à mille par image, faire glisser la viscosité et voir le dendrite pousser en temps réel. Tout ce que tu viens de lire est à un clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  miniSimCaption: "En direct · graine centrale · fais-le pousser",
  dendriteCaption: "Un dendrite à partir d'une seule graine",
  dendriteHint:
    "Les pointes poussent plus vite que les vallées — les branches s'étirent vers l'extérieur et affament l'intérieur.",
  tipsCaption: "Pourquoi des branches, pas des blobs",
  tipsHint:
    "Les marcheurs arrivent de loin. Les pointes qui dépassent les attrapent d'abord ; les vallées entre les bras ne voient presque rien.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody:
    "La dimension de Hausdorff d'un amas DLA en 2D. Universelle sur les graines et les réseaux.",
};

const it: RichStory = {
  page: {
    pretitle: "Aggregazione limitata da diffusione",
    title: "I camminatori casuali gelano al contatto.",
    tagline: "E un corallo cresce da un solo pixel.",
    intro:
      "Posa un seme al centro di una griglia vuota. Lascia partire una particella dal bordo, falla barcollare in un cammino casuale. Nell'istante in cui tocca l'ammasso, gela lì. Lasciane partire un'altra. Poi diecimila. Cresce una forma ramificata, dendritica — lo stesso corallo frattale che il rame prende in una vasca galvanica, che i licheni disegnano su un muro, che un fulmine lascia sulla pelle nuda.",
    ctaInteractive: "Fai crescere il tuo corallo",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Un seme. Camminatori casuali. Un corallo.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Un pixel incollato al centro. Lasci partire dal bordo camminatori che vagano per puro caso. Appena uno tocca l'ammasso, gela per sempre — e dal seme cresce una forma ramificata.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Un pixel seme. Qualche migliaio di camminatori casuali sparati al bordo di un cerchio. Ciascuno barcolla — su, giù, sinistra, destra con uguale probabilità — finché sfiora l'ammasso e si blocca. Esce il corallo che vedi sotto.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Witten e Sander mostrarono nel 1981 che questo gioco a due regole ha una dimensione frattale universale di ≈ 1,71 — indipendente dal seme o dal reticolo. La stessa forma torna nel rame elettrodeposto, nei licheni, nelle colonie batteriche e nelle figure di Lichtenberg lasciate dai fulmini.",
      },
    ],
    tryIt: "Sotto: gira la manopola dei camminatori, guarda il dendrite crescere dal vivo.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Il setup",
      title: "Un seme, camminatori e una regola di adesione",
      body: "Posa un singolo pixel fisso al centro di una griglia — quello è il seme. Dal bordo nascono camminatori; ad ogni tic ognuno fa un passo a caso in su, giù, sinistra o destra. Nessuna forza, nessun campo, nessun piano — solo diffusione.",
    },
    {
      pretitle: "Sezione 02 · La regola di adesione",
      title: "Tocca una cella fissa — gela.",
      body: "Appena un camminatore atterra accanto a una cella già congelata, si attacca lì e non si muove più. Questa è tutta la fisica. Nessuna tensione superficiale, nessun termine di curvatura, nessuna temperatura — una sola regola binaria, applicata a ogni camminatore che si avvicina troppo.",
    },
    {
      pretitle: "Sezione 03 · Perché ramificato, non blobby",
      title: "Le punte mangiano i camminatori; le valli digiunano.",
      body: "Un camminatore che arriva da lontano sfiora molto più probabilmente una punta sporgente che una valle tra due bracci. Le punte crescono più in fretta, le valli più piano, e il divario si allarga ad ogni frame. L'ammasso si affila da solo in un corallo — pura geometria, senza parametri nascosti.",
    },
    {
      pretitle: "Sezione 04 · La dimensione universale",
      title: "D ≈ 1,71 — e non si cura del seme.",
      body: "Witten & Sander, 1981: la dimensione di Hausdorff di un ammasso DLA in 2D è di circa 1,71 — da qualche parte tra una curva (D = 1) e un disco pieno (D = 2). Niemeyer, Pietronero e Wiesmann (1984) la inserirono nella più ampia famiglia delle scariche dielettriche; Sander (1986) raccolse le prime prove. Il numero è universale su semi, reticoli e regole di camminatore.",
    },
    {
      pretitle: "Sezione 05 · Dove appare in natura",
      title: "Rame, fulmini, licheni, neuroni.",
      body: "Il rame elettrodeposto troppo in fretta cresce in dendriti tipo DLA. Le figure di Lichtenberg — le cicatrici ramificate lasciate da fulmini o da scariche ad alta tensione nella resina — seguono la stessa statistica. Lo stesso fanno le colonie di licheni sulla roccia, le punte dei tappeti batterici su agar e i dendriti dei neuroni piramidali nella corteccia.",
    },
    {
      pretitle: "Sezione 06 · Varianti",
      title: "Appiccicoso o scivoloso, punto o linea o anello, 2D o 3D.",
      body: "Abbassa l'appiccicosità e i camminatori rimbalzano qualche volta prima di gelare — il dendrite si ispessisce in un blob più denso. Sostituisci il seme centrale con una linea orizzontale e ottieni un cristallo di brina sul vetro; sostituiscilo con un anello e il corallo cresce verso l'interno. Solleva tutto in tre dimensioni e la dimensione frattale sale a circa 2,5.",
    },
  ],
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia passare tra seme puntiforme, lineare o ad anello, spingere i camminatori fino a mille per frame, far scorrere l'appiccicosità e guardare il dendrite crescere in tempo reale. Tutto quello che hai appena letto è a un clic.",
  ctaLabel: "→ Apri l'Esploratore",
  miniSimCaption: "Live · seme centrale · fallo crescere tu",
  dendriteCaption: "Un dendrite da un solo seme",
  dendriteHint: "Le punte crescono più delle valli — i rami si protendono e affamano l'interno.",
  tipsCaption: "Perché rami, non blob",
  tipsHint:
    "I camminatori arrivano da lontano. Le punte sporgenti li acchiappano prime; le valli tra i bracci non vedono quasi niente.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody:
    "La dimensione di Hausdorff di un ammasso DLA in 2D. Universale su forme di seme e reticoli.",
};

const pt: RichStory = {
  page: {
    pretitle: "Agregação limitada por difusão",
    title: "Os caminhantes aleatórios congelam ao tocar.",
    tagline: "E um coral cresce a partir de um único pixel.",
    intro:
      "Põe uma semente no meio de uma grelha vazia. Larga uma partícula na borda e deixa-a cambalear num passeio aleatório. No instante em que toca no aglomerado, congela ali. Larga outra. Depois mais dez mil. Cresce uma forma ramificada, dendrítica — o mesmo coral fractal que o cobre toma numa cuba de eletrólise, que os líquenes desenham numa parede, que um raio deixa na pele nua.",
    ctaInteractive: "Faz crescer o teu coral",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Uma semente. Caminhantes aleatórios. Um coral.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Um pixel colado ao centro. Largas na borda caminhantes que vagueiam por puro acaso. Mal um toca no aglomerado, congela para sempre — e da semente brota uma forma ramificada.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Um pixel semente. Uns milhares de caminhantes aleatórios largados na borda de um círculo. Cada um cambaleia — cima, baixo, esquerda, direita com igual probabilidade — até roçar o aglomerado e ficar preso. Sai o coral que vês em baixo.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Witten e Sander mostraram em 1981 que este jogo de duas regras tem uma dimensão fractal universal de ≈ 1,71 — independente da semente ou da rede. A mesma forma volta no cobre eletrodepositado, nos líquenes, nas colónias bacterianas e nas figuras de Lichtenberg que os raios deixam.",
      },
    ],
    tryIt: "Em baixo: roda o botão dos caminhantes, vê o dendrito crescer ao vivo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A montagem",
      title: "Uma semente, caminhantes e uma regra de cola",
      body: "Coloca um único pixel fixo no centro de uma grelha — é a semente. Na borda nascem caminhantes; a cada tique cada um dá um passo aleatório para cima, baixo, esquerda ou direita. Sem força, sem campo, sem plano: só difusão.",
    },
    {
      pretitle: "Secção 02 · A regra de cola",
      title: "Toca numa célula presa — congela.",
      body: "Assim que um caminhante aterra ao lado de uma célula congelada, fica colado e nunca mais se mexe. Esta é toda a física. Sem tensão superficial, sem termo de curvatura, sem temperatura — uma única regra binária, aplicada a cada caminhante que se aproxima demais.",
    },
    {
      pretitle: "Secção 03 · Porque ramificado, não blob",
      title: "As pontas comem os caminhantes; os vales passam fome.",
      body: "Um caminhante que vem de longe roça muito mais provavelmente uma ponta saliente do que um vale entre dois braços. As pontas crescem mais depressa, os vales mais devagar, e o fosso aumenta a cada frame. O aglomerado afia-se sozinho em coral — pura geometria, sem parâmetros escondidos.",
    },
    {
      pretitle: "Secção 04 · A dimensão universal",
      title: "D ≈ 1,71 — e não quer saber da semente.",
      body: "Witten & Sander, 1981: a dimensão de Hausdorff de um aglomerado DLA em 2D é cerca de 1,71 — algures entre uma curva (D = 1) e um disco cheio (D = 2). Niemeyer, Pietronero e Wiesmann (1984) embrulharam-na na família mais ampla das descargas dielétricas; Sander (1986) reuniu as primeiras provas. O número é universal sobre sementes, redes e regras de caminhante.",
    },
    {
      pretitle: "Secção 05 · Onde aparece na natureza",
      title: "Cobre, raios, líquenes, neurónios.",
      body: "O cobre eletrolítico depositado depressa demais cresce em dendritos tipo DLA. As figuras de Lichtenberg — as cicatrizes ramificadas que raios ou descargas de alta tensão deixam em resina — seguem a mesma estatística. O mesmo as colónias de líquenes na rocha, as pontas das esteiras bacterianas em ágar e os dendritos dos neurónios piramidais no córtex.",
    },
    {
      pretitle: "Secção 06 · Variantes",
      title: "Pegajoso ou escorregadio, ponto ou linha ou anel, 2D ou 3D.",
      body: "Baixa a aderência e os caminhantes saltitam algumas vezes antes de congelar — o dendrito engrossa num blob mais denso. Troca a semente central por uma linha horizontal e tens um cristal de geada no vidro; troca-a por um anel e o coral cresce para dentro. Levanta tudo para três dimensões e a dimensão fractal sobe para cerca de 2,5.",
    },
  ],
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te alternar entre sementes em ponto, linha e anel, empurrar os caminhantes até mil por frame, deslizar a aderência e ver o dendrito crescer em tempo real. Tudo o que acabaste de ler está a um clique.",
  ctaLabel: "→ Abrir o Explorador",
  miniSimCaption: "Ao vivo · semente central · fá-lo crescer",
  dendriteCaption: "Um dendrito a partir de uma única semente",
  dendriteHint:
    "As pontas crescem mais do que os vales — os ramos esticam-se e fazem o interior passar fome.",
  tipsCaption: "Porquê ramos, não blobs",
  tipsHint:
    "Os caminhantes vêm de longe. As pontas salientes apanham-nos primeiro; os vales entre braços quase não veem nada.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody:
    "A dimensão de Hausdorff de um aglomerado DLA em 2D. Universal sobre formas de semente e redes.",
};

const sv: RichStory = {
  page: {
    pretitle: "Diffusionsbegränsad aggregation",
    title: "Slumpvandrare fryser fast vid kontakt.",
    tagline: "Och en korall växer ur en enda pixel.",
    intro:
      "Lägg ett frö i mitten av ett tomt rutnät. Släpp en partikel vid kanten, låt den vingla i en slumpvandring. I samma stund den rör vid klumpen fryser den fast där. Släpp en till. Sedan tio tusen till. En förgrenad, dendritisk form växer fram — samma fraktala korall som koppar antar i ett elektrolysbad, som lavar ritar på en mur, som blixten lämnar på bar hud.",
    ctaInteractive: "Odla din egen korall",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Ett frö. Slumpvandrare. En korall.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "En pixel fastklistrad i mitten. Du släpper vandrare vid kanten som driver av rena slumpen. Så fort en vandrare rör vid klumpen fryser den fast för alltid — och ur fröet växer en förgrenad form.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "En frö-pixel. Några tusen slumpvandrare släppta vid kanten av en cirkel. Var och en vinglar — upp, ner, vänster, höger med samma odds — tills den snuddar klumpen och låser fast. Ut kommer korallen du ser nedan.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Witten och Sander visade 1981 att detta tvåregels-spel har en universell fraktal dimension på ≈ 1,71 — oberoende av frö eller gitter. Samma form återkommer i elektroplaterad koppar, i lavar, i bakteriekolonier och i Lichtenberg-figurerna blixten lämnar.",
      },
    ],
    tryIt: "Nedan: vrid på vandrar-ratten, se dendriten växa fram live.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Uppställningen",
      title: "Ett frö, vandrare och en klisterregel",
      body: "Lägg en ensam fastklistrad pixel i mitten av ett rutnät — det är fröet. Vid kanten dyker vandrare upp; vid varje tick tar var och en ett slumpvalt steg upp, ner, vänster eller höger. Ingen kraft, inget fält, ingen plan — bara diffusion.",
    },
    {
      pretitle: "Avsnitt 02 · Klisterregeln",
      title: "Rör en frusen cell — frys.",
      body: "I samma stund som en vandrare landar bredvid en frusen cell klistras den fast och rör sig aldrig mer. Det är hela fysiken. Ingen ytspänning, ingen krökningsterm, ingen temperatur — en enda binär regel, applicerad på varje vandrare som kommer för nära.",
    },
    {
      pretitle: "Avsnitt 03 · Varför grenig, inte blobbig",
      title: "Spetsarna äter vandrarna; dalarna svälter.",
      body: "En vandrare som driver in från långt håll snuddar mycket sannolikare en utstickande spets än en dal mellan två armar. Spetsar växer snabbare, dalar långsammare, och gapet växer för varje bildruta. Klumpen vässer sig själv till en korall — ren geometri, utan dolda parametrar.",
    },
    {
      pretitle: "Avsnitt 04 · Den universella dimensionen",
      title: "D ≈ 1,71 — och den bryr sig inte om fröet.",
      body: "Witten & Sander, 1981: Hausdorff-dimensionen för en 2D-DLA-klump är ungefär 1,71 — någonstans mellan en kurva (D = 1) och en fylld skiva (D = 2). Niemeyer, Pietronero och Wiesmann (1984) svepte in den i den bredare familjen för dielektriskt sammanbrott; Sander (1986) samlade de tidiga bevisen. Talet är universellt över frön, gitter och vandrarregler.",
    },
    {
      pretitle: "Avsnitt 05 · Var det dyker upp i naturen",
      title: "Koppar, blixt, lav, neuroner.",
      body: "Koppar som elektrolytiskt avsätts för snabbt växer i DLA-liknande dendriter. Lichtenberg-figurer — de förgrenade ärr som blixt eller högspänningsurladdningar lämnar i harts — följer samma statistik. Likaså lavkolonier på sten, spetsarna på bakteriemattor på agar och dendriterna hos pyramidneuroner i barken.",
    },
    {
      pretitle: "Avsnitt 06 · Varianter",
      title: "Klibbig eller hal, punkt eller linje eller ring, 2D eller 3D.",
      body: "Sänk klibbigheten och vandrarna studsar några gånger innan de fryser — dendriten tjocknar till en tätare klump. Byt ut centrum-fröet mot en horisontell linje och du får en frostkristall på glas; byt det mot en ring och korallen växer inåt. Lyft alltihop till tre dimensioner och den fraktala dimensionen skiftar till ungefär 2,5.",
    },
  ],
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig växla mellan punkt-, linje- och ring-frön, dra upp vandrarna till tusen per bildruta, glida på klibbigheten och se dendriten växa i realtid. Allt du just läste är ett klick bort.",
  ctaLabel: "→ Öppna Utforskaren",
  miniSimCaption: "Live · centerfrö · odla själv",
  dendriteCaption: "En dendrit från ett enda frö",
  dendriteHint:
    "Spetsar växer snabbare än dalar — grenar sträcker sig utåt och svälter ut det inre.",
  tipsCaption: "Varför grenar, inte klumpar",
  tipsHint:
    "Vandrarna driver in från långt håll. Utstickande spetsar fångar dem först; dalarna mellan armarna ser nästan inget.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody: "Hausdorff-dimensionen för en 2D-DLA-klump. Universell över fröformer och gitter.",
};

const no: RichStory = {
  page: {
    pretitle: "Diffusjonsbegrenset aggregasjon",
    title: "Tilfeldige vandrere fryser ved kontakt.",
    tagline: "Og en korall vokser ut av én piksel.",
    intro:
      "Legg et frø midt i et tomt rutenett. Slipp en partikkel ved kanten, la den sjangle på en tilfeldig gange. I det øyeblikket den berører klumpen, fryser den der. Slipp en til. Så ti tusen til. En forgrenet, dendrittisk form vokser fram — samme fraktale korall som kobber tar i et galvanisk bad, som lav tegner på en mur, som lynet etterlater på bar hud.",
    ctaInteractive: "Dyrk din egen korall",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Ett frø. Tilfeldige vandrere. En korall.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Én piksel klistret i midten. Du slipper vandrere ved kanten som driver av ren tilfeldighet. I det øyeblikket en vandrer berører klumpen, fryser den for alltid — og ut av frøet vokser en forgrenet form.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Én frø-piksel. Noen tusen tilfeldige vandrere sluppet ved kanten av en sirkel. Hver enkelt sjangler — opp, ned, venstre, høyre med lik sjanse — til den streifer klumpen og låser seg fast. Ut kommer korallen du ser nedenfor.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Witten og Sander viste i 1981 at dette to-regel-spillet har en universell fraktal dimensjon på ≈ 1,71 — uavhengig av frø eller gitter. Samme form dukker opp igjen i elektroplatert kobber, i lav, i bakteriekolonier og i Lichtenberg-figurene lynet etterlater.",
      },
    ],
    tryIt: "Nedenfor: vri på vandrer-rattet, se dendriten vokse live.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppsettet",
      title: "Et frø, vandrere og en klistringsregel",
      body: "Legg én enkelt fast piksel i midten av et rutenett — det er frøet. Ved kanten dukker vandrere opp; for hvert tikk tar hver enkelt et tilfeldig skritt opp, ned, venstre eller høyre. Ingen kraft, intet felt, ingen plan — bare diffusjon.",
    },
    {
      pretitle: "Avsnitt 02 · Klistringsregelen",
      title: "Berør en frosset celle — frys.",
      body: "I det øyeblikket en vandrer lander ved siden av en frossen celle, klistres den fast og rører seg aldri mer. Det er hele fysikken. Ingen overflatespenning, intet krumningsledd, ingen temperatur — én eneste binær regel, anvendt på hver vandrer som kommer for nær.",
    },
    {
      pretitle: "Avsnitt 03 · Hvorfor forgrenet, ikke klumpete",
      title: "Spissene spiser vandrerne; dalene sulter.",
      body: "En vandrer som driver inn fra langt hold streifer mye lettere en utstikkende spiss enn en dal mellom to armer. Spisser vokser raskere, daler langsommere, og gapet utvider seg for hver ramme. Klumpen kvesser seg selv til en korall — ren geometri, uten skjulte parametere.",
    },
    {
      pretitle: "Avsnitt 04 · Den universelle dimensjonen",
      title: "D ≈ 1,71 — og den bryr seg ikke om frøet.",
      body: "Witten & Sander, 1981: Hausdorff-dimensjonen til en 2D-DLA-klump er omtrent 1,71 — et sted mellom en kurve (D = 1) og en fylt skive (D = 2). Niemeyer, Pietronero og Wiesmann (1984) pakket den inn i den bredere familien for dielektrisk gjennombrudd; Sander (1986) samlet de tidlige bevisene. Tallet er universelt over frø, gittere og vandrer-regler.",
    },
    {
      pretitle: "Avsnitt 05 · Hvor det dukker opp i naturen",
      title: "Kobber, lyn, lav, nevroner.",
      body: "Kobber som elektrolytisk avsettes for fort vokser i DLA-lignende dendritter. Lichtenberg-figurer — de forgrenede arrene lyn eller høyspentutladninger etterlater i harpiks — følger samme statistikk. Det samme gjør lavkolonier på stein, spissene av bakteriematter på agar og dendrittene til pyramidenevroner i barken.",
    },
    {
      pretitle: "Avsnitt 06 · Varianter",
      title: "Klissete eller glatt, punkt eller linje eller ring, 2D eller 3D.",
      body: "Senk klisseheten, og vandrere spretter noen ganger før de fryser — dendriten tykner til en tettere klump. Bytt ut sentrumfrøet med en horisontal linje og du får en frostkrystall på glass; bytt det mot en ring, og korallen vokser innover. Løft alt opp i tre dimensjoner og den fraktale dimensjonen skifter til omtrent 2,5.",
    },
  ],
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg veksle mellom punkt-, linje- og ringfrø, skru vandrerne opp til tusen per ramme, dra på klisseheten og se dendriten vokse i sanntid. Alt du nettopp leste er ett klikk unna.",
  ctaLabel: "→ Åpne Utforskeren",
  miniSimCaption: "Live · senterfrø · dyrk selv",
  dendriteCaption: "En dendritt fra ett enkelt frø",
  dendriteHint:
    "Spisser vokser raskere enn daler — grener strekker seg utover og sulter ut det indre.",
  tipsCaption: "Hvorfor grener, ikke klumper",
  tipsHint:
    "Vandrerne driver inn fra langt hold. Utstikkende spisser fanger dem først; dalene mellom armene ser nesten ingenting.",
  dimensionCaption: "Witten–Sander, 1981",
  dimensionBody: "Hausdorff-dimensjonen til en 2D-DLA-klump. Universell over frøformer og gittere.",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function DlaStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/dla/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="random walk → first contact → freeze"
      formulaLatex={"D \\approx 1.71"}
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

      {/* Section 01 — the setup */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec0} accent={ACCENT} />
      </section>

      {/* Section 02 — the sticking rule + static dendrite */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec1} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline flex flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.dendriteCaption}
            </div>
            <DendriteSVG />
            <p className="max-w-md text-center font-mono text-xs text-ink-300">
              {story.dendriteHint}
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 · the live mini-sim */}
      <section className="mx-auto mb-32 max-w-5xl">
        <Reveal>
          <DlaMiniSim caption={story.miniSimCaption} />
        </Reveal>
      </section>

      {/* Section 03 — why branchy not blobby */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec2} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline grid grid-cols-1 items-center gap-6 rounded-2xl border bg-ink-950/40 p-6 md:grid-cols-2">
            <div>
              <div className={`mb-3 font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.tipsCaption}
              </div>
              <TipsVsValleysSVG />
            </div>
            <p className="text-sm leading-relaxed text-ink-200">{story.tipsHint}</p>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — the universal dimension */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec3} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.dimensionCaption}
            </div>
            <div className="math-italic text-6xl text-ink-100 md:text-7xl">≈ 1.71</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.dimensionBody}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — where it appears in nature */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...sec4} accent={ACCENT} />
      </section>

      {/* Section 06 — variants */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...sec5} accent={ACCENT} />
        <Reveal delay={150}>
          <div className="text-center">
            <Link
              href="/dla/explorer"
              className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
            >
              {story.ctaLabel}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Closing narrative card (the shell appends its own finalLabel block;
          this one is the longer, locale-rich version inside the page body). */}
      <Reveal>
        <section className="glass hairline mx-auto max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.encounter.pretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/dla/explorer"
            className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
          >
            {story.ctaLabel}
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-coral/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
