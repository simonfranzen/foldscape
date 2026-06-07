"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { TuringGrayScott } from "@/components/TuringGrayScott";
import { TuringGallery } from "@/components/TuringGallery";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Rich, per-locale story copy for the Turing-patterns story page. The hero
// (pretitle/title/tagline/intro/sections) is taken from here too — the
// shared atlas is only used as a tone reference for the topic title.
// --------------------------------------------------------------------------

type Card = { label: string; title: string; body: string };
type Section = { pretitle: string; title: string; body: string };
type Regime = { id: string; label: string; F: number; k: number; body: string };

type GrayScott = {
  caption: string;
  feedLabel: string;
  killLabel: string;
  resetLabel: string;
  pauseLabel: string;
  playLabel: string;
  presetLabel: string;
  presetNames: { spots: string; stripes: string; coral: string; mitosis: string };
  note: string;
  pretitle: string;
  title: string;
  body: string;
};

type Gallery = {
  caption: string;
  hint: string;
  regimes: Regime[];
  pretitle: string;
  title: string;
  body: string;
};

type RichStory = {
  page: StoryPage;
  encounter: { pretitle: string; title: string; cards: Card[]; tryIt: string };
  sections: Section[];
  grayScott: GrayScott;
  gallery: Gallery;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// ----- English -----
const en: RichStory = {
  page: {
    pretitle: "Topic · Reaction–diffusion",
    title: "Turing patterns",
    tagline: "Two chemicals, two diffusion speeds — and a leopard's coat appears.",
    intro:
      "In 1952 Alan Turing showed that two interacting substances, one diffusing faster than the other, can spontaneously break a uniform mixture into spots, stripes, and branching networks. The same equations explain leopard skin, zebra stripes, angelfish bars, and a startling amount of how an embryo decides where to put things.",
    ctaInteractive: "Open the Explorer",
    sections: [],
  },
  encounter: {
    pretitle: "First encounter",
    title: "Two chemicals. Different speeds. A coat appears.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Mix two invisible chemicals on a flat sheet. One spreads slowly and amplifies itself. The other spreads quickly and shuts the first one down. Out of a perfectly uniform soup, dots, stripes, and branching networks slowly resolve. The very same equations explain the spots on a leopard, the stripes on a zebra, the bars on an angelfish — a single rule with two knobs, painted across every surface that needed a pattern.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Call them activator and inhibitor. The activator amplifies itself locally, like a small fire kindling more fire next to it. The inhibitor diffuses out faster and snuffs the activator at a distance. Where the activator wins, you get a spot. Around it, the inhibitor's halo prevents another spot from forming too close. Tile that competition across a surface and you get an even sea of dots — or stripes, if the geometry tilts that way.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Turing wrote this down in his last paper, 'The Chemical Basis of Morphogenesis' (1952), before any biology supported it. Modern molecular biology has since found the activator–inhibitor pairs he predicted, in zebrafish skin, mouse hair follicles, and digit spacing in vertebrate limbs. The same mathematics also appears in seashell pigmentation, sand-ripple physics, and density patterns in the early universe.",
      },
    ],
    tryIt:
      "Below: run a small Gray-Scott simulator and tour four of the regimes Pearson catalogued in 1993.",
  },
  sections: [
    {
      pretitle: "Section 01 · The equation",
      title: "Two coupled PDEs, two diffusion constants",
      body: "Let u and v be the concentrations of two interacting substances on a flat surface. Each one diffuses at its own rate, and each one reacts with the other. The system reads ∂u/∂t = D_u ∇²u + f(u, v) and ∂v/∂t = D_v ∇²v + g(u, v). The Laplacian terms describe spread; the f and g terms describe the chemistry. That's it — a uniform initial state plus the reaction terms plus a difference in D_u and D_v is enough to make patterns appear out of nothing.",
    },
    {
      pretitle: "Section 02 · Activator and inhibitor",
      title: "Local activation, lateral inhibition",
      body: "The cleanest intuition is the Gierer–Meinhardt picture: u is an activator that catalyses both itself and its own brake, v. The activator wants to ignite into a hot spot wherever a fluctuation lifts its concentration. But it also produces v, which diffuses outward faster and suppresses u in the surrounding ring. Result: every fledgling spot fences off its neighbours. The spacing between spots is set by how far v travels before u can catch up.",
    },
    {
      pretitle: "Section 03 · Why diffusion ratios matter",
      title: "The Turing instability needs the brake to be faster than the fire",
      body: "Without diffusion, the uniform state is locally stable: small perturbations die out. Turing's surprise was that adding diffusion can destabilise it — but only if D_v ≫ D_u. The slower activator clumps; the faster inhibitor sweeps the clumps clean, except at a characteristic wavelength where the rates balance. That wavelength becomes the spacing of the spots, the period of the stripes. Change the ratio and the pattern's scale changes with it — the same chemistry, retuned by one number.",
    },
    {
      pretitle: "Section 04 · The Gray–Scott model",
      title: "Two knobs: F (feed) and k (kill)",
      body: "The most famous concrete realisation is Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. The reaction u + 2v → 3v autocatalyses v; the feed F replenishes u, and the kill (F+k) removes v. Sweeping F and k across a tiny rectangle of the (F, k) plane traverses an entire bestiary, first catalogued by John Pearson in 1993: spots, stripes, mazes, coral, mitosis, U-skate world, solitons. One pair of equations, a whole zoo of behaviours.",
    },
    {
      pretitle: "Section 05 · Biology and beyond",
      title: "Embryos, fish skin, seashells, sand",
      body: "Hans Meinhardt spent decades fitting reaction–diffusion models to morphogenesis — limb formation, leaf venation, seashell pigment lines drawn out as a wavefront on a growing edge. Kondo and Asai showed in 1995 that the stripes on Pomacanthus angelfish rearrange exactly as a reaction–diffusion model predicts when the fish grows. The same mathematics describes sand ripples in shallow water, density variations in convecting fluids, and even the cosmic web of galaxies sketched out by gravitational instability in the early universe.",
    },
    {
      pretitle: "Section 06 · What we still don't know",
      title: "Open problems and surprising scaling",
      body: "Which exact molecules play the activator and inhibitor in mammalian skin is still debated — candidates involve Wnt and Notch signalling — and how the system scales the pattern with body size remains a mystery: a mouse and an elephant grow the same kinds of patterns at very different scales, yet the underlying chemistry should fix one absolute wavelength. Mathematically the connection to amplitude equations and pattern selection is well understood; biologically, the surprise that 'Turing was right' keeps deepening rather than closing.",
    },
  ],
  grayScott: {
    caption: "Interactive · Gray-Scott reaction-diffusion",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Reset",
    pauseLabel: "Pause",
    playLabel: "Play",
    presetLabel: "Pearson presets",
    presetNames: { spots: "Spots", stripes: "Stripes", coral: "Coral", mitosis: "Mitosis" },
    note: "Tiny 120×100 grid, toroidal wrap, 30 sub-steps per frame. Pick a Pearson preset or sweep the F and k sliders. Tip: small steps matter — most of the (F, k) plane gives empty fields; the interesting strip is razor-thin.",
    pretitle: "Interactive · turn the two knobs",
    title: "Run the model in your browser",
    body: "Watch real-time Gray-Scott reaction-diffusion on a small grid. The four presets correspond to the canonical regimes Pearson labelled in 1993; the sliders let you slip between them. The dynamics are sensitive: a change of 0.001 in F or k can take you from a leopard's spots to a maze of stripes.",
  },
  gallery: {
    caption: "Interactive · the Pearson zoo",
    hint: "Four regimes, four colour maps. Hover or tap a cell to read what it is. Each cell is its own live simulation.",
    pretitle: "Interactive · pattern gallery",
    title: "Four famous Gray-Scott regimes",
    body: "From a single pair of equations comes an entire bestiary. These four cells show the canonical examples: discrete spots, winding mazes, branching coral, and self-replicating mitosis. They live on tiny grids so they fit on a phone — but each one runs the same equations as the explorer.",
    regimes: [
      {
        id: "spots",
        label: "Spots",
        F: 0.025,
        k: 0.06,
        body: "Round, isolated dots — the texture of a leopard's coat or a peacock's eye. Each spot fences off a halo around itself; the spacing is set by how far the inhibitor reaches before the activator catches up.",
      },
      {
        id: "stripes",
        label: "Maze",
        F: 0.029,
        k: 0.057,
        body: "Winding labyrinthine stripes — Pearson's zeta regime. The pattern still has a preferred wavelength, but the system never decides between dots and continuous bands, so it draws long meandering ridges instead.",
      },
      {
        id: "coral",
        label: "Coral",
        F: 0.054,
        k: 0.063,
        body: "Branching, growing fronts — the same family of structures that real coral grows by, and that sea-shell pigmentation paints as a one-dimensional wavefront on a two-dimensional shell.",
      },
      {
        id: "mitosis",
        label: "Mitosis",
        F: 0.0367,
        k: 0.0649,
        body: "Self-replicating dots: each spot grows, splits, and the daughters drift apart before splitting again. The same equations that paint a leopard also model a tile of spreading cells.",
      },
    ],
  },
  closingPretitle: "Take it further",
  closingTitle: "Grow some spots.",
  closingBody:
    "The Explorer gives you the full 200×200 grid, every Pearson preset, control over the diffusion ratios D_u and D_v, multiple colour palettes, and the freedom to slow the simulation down and watch each step.",
  ctaLabel: "→ Open the Explorer",
};

// ----- German -----
const de: RichStory = {
  page: {
    pretitle: "Thema · Reaktion–Diffusion",
    title: "Turing-Muster",
    tagline: "Zwei Stoffe, zwei Diffusionsgeschwindigkeiten — und ein Leopardenfell entsteht.",
    intro:
      "1952 zeigte Alan Turing: zwei wechselwirkende Stoffe, einer diffundiert schneller als der andere, können eine gleichförmige Mischung von allein in Punkte, Streifen und verzweigte Netze brechen. Dieselben Gleichungen erklären Leopardenfell, Zebrastreifen, Kaiserfisch-Bänder — und überraschend viel davon, wie ein Embryo entscheidet, wohin er was setzt.",
    ctaInteractive: "Explorer öffnen",
    sections: [],
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Zwei Stoffe. Verschiedene Tempi. Ein Fell entsteht.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Misch zwei unsichtbare Stoffe auf einer Fläche. Der eine breitet sich langsam aus und verstärkt sich selbst. Der andere breitet sich schneller aus und schaltet den ersten ab. Aus einer völlig gleichförmigen Suppe lösen sich langsam Punkte, Streifen und verzweigte Netze. Dieselben Gleichungen erklären die Flecken eines Leoparden, die Streifen eines Zebras, die Bänder eines Kaiserfischs — eine Regel mit zwei Reglern, über jede Oberfläche gespannt, die ein Muster brauchte.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Nenn sie Aktivator und Inhibitor. Der Aktivator verstärkt sich lokal — wie ein kleines Feuer, das neben sich ein neues entzündet. Der Inhibitor diffundiert schneller weg und erstickt den Aktivator in der Ferne. Wo der Aktivator gewinnt, entsteht ein Fleck. Drumherum verhindert der Inhibitor-Hof, dass dicht daneben ein zweiter Fleck wächst. Diesen Wettstreit kachelt man über eine Fläche und erhält ein gleichmäßiges Meer von Punkten — oder Streifen, je nach Geometrie.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Turing schrieb das in seinem letzten Aufsatz, «The Chemical Basis of Morphogenesis» (1952), bevor irgendeine Biologie ihn stützte. Die moderne Molekularbiologie hat seitdem die Aktivator-Inhibitor-Paare gefunden, die er vorhersagte — in Zebrafischhaut, Maus-Haarfollikeln, Fingerabständen in Wirbeltier-Gliedmaßen. Dieselbe Mathematik taucht in Schneckenhausmustern, Sandrippeln und Dichtemustern des frühen Universums wieder auf.",
      },
    ],
    tryIt:
      "Unten: lass einen kleinen Gray-Scott-Simulator laufen und tour durch vier der Regime, die Pearson 1993 katalogisierte.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Gleichung",
      title: "Zwei gekoppelte PDEs, zwei Diffusionskonstanten",
      body: "Sei u und v die Konzentration zweier wechselwirkender Stoffe auf einer Fläche. Jeder diffundiert mit eigener Rate, jeder reagiert mit dem anderen. Das System lautet ∂u/∂t = D_u ∇²u + f(u, v) und ∂v/∂t = D_v ∇²v + g(u, v). Die Laplace-Terme beschreiben die Ausbreitung; f und g die Chemie. Mehr braucht es nicht — gleichförmiger Anfangszustand plus Reaktion plus Unterschied zwischen D_u und D_v reichen, damit Muster aus dem Nichts erscheinen.",
    },
    {
      pretitle: "Abschnitt 02 · Aktivator und Inhibitor",
      title: "Lokale Aktivierung, laterale Inhibition",
      body: "Die sauberste Anschauung ist Gierer–Meinhardt: u ist ein Aktivator, der sich selbst und seine eigene Bremse v katalysiert. Der Aktivator möchte überall dort, wo eine Fluktuation seine Konzentration anhebt, zu einem heißen Fleck entbrennen. Aber er produziert auch v, das schneller nach außen diffundiert und u im umliegenden Ring drückt. Ergebnis: jeder werdende Fleck zäunt seine Nachbarn ab. Der Abstand der Flecken wird davon gesetzt, wie weit v reist, bis u nachziehen kann.",
    },
    {
      pretitle: "Abschnitt 03 · Warum das Diffusionsverhältnis zählt",
      title: "Die Turing-Instabilität braucht eine schnellere Bremse als das Feuer",
      body: "Ohne Diffusion ist der gleichförmige Zustand lokal stabil: kleine Störungen klingen ab. Turings Überraschung: Diffusion kann ihn destabilisieren — aber nur, wenn D_v ≫ D_u. Der langsame Aktivator klumpt; der schnelle Inhibitor fegt die Klumpen weg, außer bei einer charakteristischen Wellenlänge, an der sich die Raten ausgleichen. Diese Wellenlänge wird der Abstand der Flecken, die Periode der Streifen. Ändert man das Verhältnis, ändert sich die Skala des Musters — dieselbe Chemie, neu gestimmt durch eine Zahl.",
    },
    {
      pretitle: "Abschnitt 04 · Das Gray–Scott-Modell",
      title: "Zwei Regler: F (feed) und k (kill)",
      body: "Die berühmteste konkrete Realisierung ist Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. Die Reaktion u + 2v → 3v autokatalysiert v; der feed F füllt u nach, das kill (F+k) entfernt v. Streicht man F und k über ein winziges Rechteck der (F, k)-Ebene, durchwandert man eine ganze Bestiarium — erstmals 1993 von John Pearson katalogisiert: Punkte, Streifen, Labyrinthe, Korallen, Mitose, U-Skater-Welt, Solitonen. Ein einziges Paar Gleichungen, ein ganzer Zoo von Verhalten.",
    },
    {
      pretitle: "Abschnitt 05 · Biologie und darüber hinaus",
      title: "Embryonen, Fischhäute, Schneckenhäuser, Sand",
      body: "Hans Meinhardt hat Jahrzehnte damit verbracht, Reaktions-Diffusions-Modelle an die Morphogenese anzupassen — Gliedmaßenbildung, Blattadern, Schneckenpigmentlinien, die als Wellenfront an einer wachsenden Kante gemalt werden. Kondo und Asai zeigten 1995, dass sich die Streifen von Pomacanthus-Kaiserfischen exakt so umordnen, wie ein Reaktions-Diffusions-Modell vorhersagt, wenn der Fisch wächst. Dieselbe Mathematik beschreibt Sandrippeln im flachen Wasser, Dichteunterschiede in konvektierenden Flüssigkeiten — und selbst das kosmische Netz von Galaxien, das die gravitative Instabilität im frühen Universum skizzierte.",
    },
    {
      pretitle: "Abschnitt 06 · Was wir noch nicht wissen",
      title: "Offene Probleme und überraschende Skalierung",
      body: "Welche genauen Moleküle in Säugerhaut die Rolle von Aktivator und Inhibitor spielen, ist noch umstritten — Kandidaten sind Wnt- und Notch-Signale —, und wie das System das Muster mit der Körpergröße skaliert, bleibt rätselhaft: Maus und Elefant erzeugen dieselben Musterarten in sehr verschiedenen Skalen, obwohl die zugrundeliegende Chemie eine absolute Wellenlänge festlegen sollte. Mathematisch sind die Anschlüsse an Amplitudengleichungen und Musterauswahl gut verstanden; biologisch vertieft sich die Überraschung, dass «Turing recht hatte», eher, als dass sie sich schließt.",
    },
  ],
  grayScott: {
    caption: "Interaktiv · Gray-Scott-Reaktion-Diffusion",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Zurücksetzen",
    pauseLabel: "Pause",
    playLabel: "Start",
    presetLabel: "Pearson-Voreinstellungen",
    presetNames: { spots: "Punkte", stripes: "Streifen", coral: "Koralle", mitosis: "Mitose" },
    note: "Winziges 120×100-Gitter, toroidaler Rand, 30 Teilschritte pro Frame. Wähl ein Pearson-Preset oder zieh an den F- und k-Reglern. Tipp: kleine Schritte zählen — der größte Teil der (F, k)-Ebene gibt leere Felder; der interessante Streifen ist messerschmal.",
    pretitle: "Interaktiv · dreh an den zwei Reglern",
    title: "Lass das Modell im Browser laufen",
    body: "Sieh Gray-Scott-Reaktion-Diffusion live auf einem kleinen Gitter. Die vier Presets entsprechen den kanonischen Regimen, die Pearson 1993 benannte; mit den Reglern gleitest du dazwischen. Die Dynamik ist heikel: eine Änderung um 0,001 in F oder k kann dich von Leopardenflecken in ein Streifenlabyrinth tragen.",
  },
  gallery: {
    caption: "Interaktiv · der Pearson-Zoo",
    hint: "Vier Regime, vier Farbkarten. Fahr mit dem Cursor über eine Zelle oder tipp sie an, um zu lesen, was sie ist. Jede Zelle ist eine eigene laufende Simulation.",
    pretitle: "Interaktiv · Mustergalerie",
    title: "Vier berühmte Gray-Scott-Regime",
    body: "Aus einem einzigen Paar Gleichungen wächst ein ganzes Bestiarium. Diese vier Zellen zeigen die kanonischen Beispiele: einzelne Punkte, gewundene Labyrinthe, verzweigte Koralle und sich selbst replizierende Mitose. Sie laufen auf winzigen Gittern, damit sie auf ein Handy passen — aber jede rechnet dieselben Gleichungen wie der Explorer.",
    regimes: [
      {
        id: "spots",
        label: "Punkte",
        F: 0.025,
        k: 0.06,
        body: "Runde, isolierte Punkte — die Textur eines Leopardenfells oder eines Pfauenauges. Jeder Punkt zäunt einen Hof um sich herum ab; der Abstand wird davon gesetzt, wie weit der Inhibitor reicht, bevor der Aktivator nachziehen kann.",
      },
      {
        id: "stripes",
        label: "Labyrinth",
        F: 0.029,
        k: 0.057,
        body: "Gewundene labyrinthische Streifen — Pearsons Zeta-Regime. Das Muster hat noch eine bevorzugte Wellenlänge, aber das System entscheidet sich nie zwischen Punkten und durchgehenden Bändern und zeichnet stattdessen lange mäandernde Grate.",
      },
      {
        id: "coral",
        label: "Koralle",
        F: 0.054,
        k: 0.063,
        body: "Verzweigte, wachsende Fronten — dieselbe Strukturfamilie, mit der echte Korallen wachsen und mit der Schneckenhauspigmentierung als eindimensionale Wellenfront auf einer zweidimensionalen Schale malt.",
      },
      {
        id: "mitosis",
        label: "Mitose",
        F: 0.0367,
        k: 0.0649,
        body: "Sich selbst replizierende Punkte: jeder Fleck wächst, teilt sich, und die Töchter driften auseinander, bevor sie sich erneut teilen. Dieselben Gleichungen, die einen Leoparden bemalen, modellieren auch eine Kachel sich ausbreitender Zellen.",
      },
    ],
  },
  closingPretitle: "Geh weiter",
  closingTitle: "Zieh dir ein paar Flecken.",
  closingBody:
    "Der Explorer gibt dir das volle 200×200-Gitter, jedes Pearson-Preset, Kontrolle über die Diffusionsverhältnisse D_u und D_v, mehrere Farbpaletten und die Freiheit, die Simulation zu verlangsamen und jeden Schritt zu beobachten.",
  ctaLabel: "→ Explorer öffnen",
};

// ----- Spanish -----
const es: RichStory = {
  page: {
    pretitle: "Tema · Reacción–difusión",
    title: "Patrones de Turing",
    tagline: "Dos químicos, dos velocidades de difusión — y aparece la piel de un leopardo.",
    intro:
      "En 1952 Alan Turing demostró que dos sustancias que interactúan, una difundiendo más rápido que la otra, pueden romper espontáneamente una mezcla uniforme en puntos, rayas y redes ramificadas. Las mismas ecuaciones explican la piel del leopardo, las rayas de la cebra, las bandas del pez ángel — y sorprendentemente bien cómo un embrión decide dónde poner las cosas.",
    ctaInteractive: "Abrir el Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Dos químicos. Velocidades distintas. Aparece la piel.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Mezcla dos químicos invisibles en una hoja plana. Uno se difunde lento y se amplifica a sí mismo. El otro se difunde rápido y apaga al primero. A partir de una sopa perfectamente uniforme, puntos, rayas y redes ramificadas se resuelven lentamente. Las mismísimas ecuaciones explican las manchas del leopardo, las rayas de la cebra, las bandas del pez ángel — una regla con dos perillas, pintada por toda superficie que necesitaba un patrón.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Llámalos activador e inhibidor. El activador se amplifica localmente, como un fuego pequeño encendiendo otro a su lado. El inhibidor se difunde fuera más rápido y sofoca al activador a distancia. Donde gana el activador, sale una mancha. A su alrededor, el halo del inhibidor impide que otra mancha se forme demasiado cerca. Embaldosa esa competencia sobre una superficie y obtienes un mar uniforme de puntos — o rayas, si la geometría inclina así.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Turing lo escribió en su último artículo, «The Chemical Basis of Morphogenesis» (1952), antes de que ninguna biología lo respaldara. La biología molecular moderna ha encontrado desde entonces los pares activador-inhibidor que predijo: en piel de pez cebra, folículos pilosos de ratón, espaciado de dedos en extremidades de vertebrados. La misma matemática también aparece en pigmentación de caracolas, física de rizos de arena y patrones de densidad en el universo temprano.",
      },
    ],
    tryIt:
      "Abajo: corre un pequeño simulador de Gray-Scott y recorre cuatro de los regímenes que Pearson catalogó en 1993.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La ecuación",
      title: "Dos EDPs acopladas, dos constantes de difusión",
      body: "Sean u y v las concentraciones de dos sustancias que interactúan en una superficie plana. Cada una se difunde a su ritmo, y cada una reacciona con la otra. El sistema es ∂u/∂t = D_u ∇²u + f(u, v) y ∂v/∂t = D_v ∇²v + g(u, v). Los laplacianos describen el esparcido; f y g, la química. Eso basta: un estado inicial uniforme más los términos de reacción más una diferencia entre D_u y D_v generan patrones de la nada.",
    },
    {
      pretitle: "Sección 02 · Activador e inhibidor",
      title: "Activación local, inhibición lateral",
      body: "La intuición más limpia es el cuadro de Gierer–Meinhardt: u es un activador que cataliza tanto a sí mismo como a su propio freno, v. El activador quiere encenderse en un punto caliente donde una fluctuación suba su concentración. Pero también produce v, que se difunde fuera más rápido y suprime u en el anillo circundante. Resultado: toda mancha incipiente cerca a sus vecinas. El espaciado entre manchas lo fija qué tan lejos viaja v antes de que u alcance.",
    },
    {
      pretitle: "Sección 03 · Por qué importan las razones de difusión",
      title: "La inestabilidad de Turing exige que el freno corra más que el fuego",
      body: "Sin difusión, el estado uniforme es localmente estable: las perturbaciones pequeñas mueren. La sorpresa de Turing fue que añadir difusión puede desestabilizarlo — pero solo si D_v ≫ D_u. El activador lento se agrupa; el inhibidor rápido barre los grumos, salvo a una longitud de onda característica donde los ritmos se equilibran. Esa longitud de onda se vuelve el espaciado de los puntos, el periodo de las rayas. Cambia la razón y cambia la escala del patrón — la misma química, reafinada por un número.",
    },
    {
      pretitle: "Sección 04 · El modelo Gray–Scott",
      title: "Dos perillas: F (feed) y k (kill)",
      body: "La realización concreta más famosa es Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. La reacción u + 2v → 3v autocataliza v; el feed F repone u, y el kill (F+k) retira v. Barrer F y k por un rectángulo diminuto del plano (F, k) atraviesa todo un bestiario, catalogado por John Pearson en 1993: puntos, rayas, laberintos, coral, mitosis, U-skate world, solitones. Un par de ecuaciones, todo un zoo de comportamientos.",
    },
    {
      pretitle: "Sección 05 · Biología y más allá",
      title: "Embriones, piel de pez, caracolas, arena",
      body: "Hans Meinhardt pasó décadas ajustando modelos de reacción-difusión a la morfogénesis — formación de extremidades, nervadura de hojas, líneas de pigmento de caracolas dibujadas como un frente de onda en un borde que crece. Kondo y Asai mostraron en 1995 que las rayas del pez ángel Pomacanthus se reorganizan exactamente como predice un modelo de reacción-difusión cuando el pez crece. La misma matemática describe rizos de arena en aguas someras, variaciones de densidad en fluidos convectivos — e incluso la red cósmica de galaxias dibujada por la inestabilidad gravitatoria del universo temprano.",
    },
    {
      pretitle: "Sección 06 · Lo que aún no sabemos",
      title: "Problemas abiertos y escalado sorprendente",
      body: "Qué moléculas exactas juegan al activador y al inhibidor en la piel mamífera sigue en debate — los candidatos involucran señalización Wnt y Notch — y cómo el sistema escala el patrón con el tamaño del cuerpo permanece misterioso: un ratón y un elefante crecen los mismos tipos de patrones a escalas muy distintas, aunque la química subyacente debiera fijar una longitud de onda absoluta. Matemáticamente la conexión con ecuaciones de amplitud y selección de patrones se entiende bien; biológicamente, la sorpresa de que «Turing tenía razón» se profundiza, en lugar de cerrarse.",
    },
  ],
  grayScott: {
    caption: "Interactivo · reacción-difusión de Gray-Scott",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Reiniciar",
    pauseLabel: "Pausa",
    playLabel: "Jugar",
    presetLabel: "Predefiniciones de Pearson",
    presetNames: { spots: "Puntos", stripes: "Rayas", coral: "Coral", mitosis: "Mitosis" },
    note: "Cuadrícula minúscula 120×100, envoltura toroidal, 30 subpasos por cuadro. Elige una predefinición de Pearson o desliza F y k. Tip: los pasos pequeños importan — la mayor parte del plano (F, k) da campos vacíos; la franja interesante es finísima.",
    pretitle: "Interactivo · gira las dos perillas",
    title: "Corre el modelo en tu navegador",
    body: "Mira reacción-difusión de Gray-Scott en tiempo real en una cuadrícula pequeña. Las cuatro predefiniciones corresponden a los regímenes canónicos que Pearson etiquetó en 1993; los deslizadores te dejan deslizarte entre ellos. La dinámica es sensible: un cambio de 0,001 en F o k puede llevarte de manchas de leopardo a un laberinto de rayas.",
  },
  gallery: {
    caption: "Interactivo · el zoo de Pearson",
    hint: "Cuatro regímenes, cuatro paletas. Pasa por encima o toca una celda para leer qué es. Cada celda es su propia simulación viva.",
    pretitle: "Interactivo · galería de patrones",
    title: "Cuatro regímenes famosos de Gray-Scott",
    body: "De un solo par de ecuaciones sale un bestiario completo. Estas cuatro celdas muestran los ejemplos canónicos: puntos discretos, laberintos sinuosos, coral ramificado y mitosis autorreplicante. Viven en cuadrículas diminutas para caber en un móvil — pero cada una corre las mismas ecuaciones que el explorador.",
    regimes: [
      {
        id: "spots",
        label: "Puntos",
        F: 0.025,
        k: 0.06,
        body: "Puntos redondos y aislados — la textura del manto del leopardo o del ojo del pavo real. Cada punto cerca un halo a su alrededor; el espaciado lo fija qué tan lejos llega el inhibidor antes de que el activador lo alcance.",
      },
      {
        id: "stripes",
        label: "Laberinto",
        F: 0.029,
        k: 0.057,
        body: "Rayas laberínticas sinuosas — el régimen zeta de Pearson. El patrón aún tiene una longitud de onda preferida, pero el sistema nunca decide entre puntos y bandas continuas, y dibuja en cambio largas crestas serpenteantes.",
      },
      {
        id: "coral",
        label: "Coral",
        F: 0.054,
        k: 0.063,
        body: "Frentes ramificados que crecen — la misma familia de estructuras con que el coral real crece, y con que la pigmentación de caracolas pinta como un frente de onda unidimensional sobre una concha bidimensional.",
      },
      {
        id: "mitosis",
        label: "Mitosis",
        F: 0.0367,
        k: 0.0649,
        body: "Puntos que se autorreplican: cada mancha crece, se divide y las hijas se alejan antes de dividirse de nuevo. Las mismas ecuaciones que pintan a un leopardo también modelan una baldosa de células en propagación.",
      },
    ],
  },
  closingPretitle: "Ve más lejos",
  closingTitle: "Hazte unas manchas.",
  closingBody:
    "El Explorador te da la cuadrícula completa 200×200, cada predefinición de Pearson, control sobre las razones de difusión D_u y D_v, varias paletas y la libertad de frenar la simulación y observar cada paso.",
  ctaLabel: "→ Abrir el Explorador",
};

// ----- French -----
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Réaction–diffusion",
    title: "Motifs de Turing",
    tagline:
      "Deux produits chimiques, deux vitesses de diffusion — et la robe d'un léopard apparaît.",
    intro:
      "En 1952 Alan Turing a montré que deux substances en interaction, l'une diffusant plus vite que l'autre, peuvent spontanément briser un mélange uniforme en taches, rayures et réseaux ramifiés. Les mêmes équations expliquent la peau du léopard, les rayures du zèbre, les bandes du poisson-ange — et étonnamment bien comment un embryon décide où poser quoi.",
    ctaInteractive: "Ouvrir l'Explorateur",
    sections: [],
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Deux produits. Vitesses différentes. Une robe apparaît.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Mélange deux produits invisibles sur une feuille plate. L'un se diffuse lentement et s'amplifie lui-même. L'autre se diffuse vite et éteint le premier. À partir d'une soupe parfaitement uniforme, des points, des rayures et des réseaux ramifiés se résolvent lentement. Les mêmes équations expliquent les taches du léopard, les rayures du zèbre, les bandes du poisson-ange — une seule règle à deux molettes, peinte sur toute surface qui avait besoin d'un motif.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Appelle-les activateur et inhibiteur. L'activateur s'amplifie localement, comme un petit feu qui allume un autre feu à côté. L'inhibiteur se diffuse plus vite à l'extérieur et étouffe l'activateur à distance. Là où l'activateur gagne, une tache apparaît. Autour d'elle, le halo de l'inhibiteur empêche une autre tache de se former trop près. Pave cette compétition sur une surface et tu obtiens une mer uniforme de points — ou des rayures, si la géométrie penche dans ce sens.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Turing a écrit ça dans son dernier article, «The Chemical Basis of Morphogenesis» (1952), avant qu'aucune biologie ne le confirme. La biologie moléculaire moderne a depuis trouvé les couples activateur-inhibiteur qu'il prédisait — dans la peau du poisson-zèbre, les follicules pileux de la souris, l'espacement des doigts dans les membres de vertébrés. La même mathématique réapparaît dans la pigmentation des coquillages, la physique des rides de sable et les motifs de densité de l'univers primordial.",
      },
    ],
    tryIt:
      "Ci-dessous : lance un petit simulateur de Gray-Scott et fais le tour de quatre régimes cataloguées par Pearson en 1993.",
  },
  sections: [
    {
      pretitle: "Section 01 · L'équation",
      title: "Deux EDP couplées, deux constantes de diffusion",
      body: "Soient u et v les concentrations de deux substances en interaction sur une surface plane. Chacune diffuse à son propre rythme, et chacune réagit avec l'autre. Le système est ∂u/∂t = D_u ∇²u + f(u, v) et ∂v/∂t = D_v ∇²v + g(u, v). Les termes laplaciens décrivent l'étalement ; f et g décrivent la chimie. C'est tout — un état initial uniforme plus les termes de réaction plus une différence entre D_u et D_v suffisent pour que des motifs apparaissent à partir de rien.",
    },
    {
      pretitle: "Section 02 · Activateur et inhibiteur",
      title: "Activation locale, inhibition latérale",
      body: "L'intuition la plus nette est l'image de Gierer–Meinhardt : u est un activateur qui catalyse à la fois lui-même et son propre frein, v. L'activateur veut s'enflammer en un point chaud partout où une fluctuation soulève sa concentration. Mais il produit aussi v, qui diffuse vers l'extérieur plus vite et écrase u dans l'anneau qui l'entoure. Résultat : chaque tache naissante encercle ses voisines. L'espacement entre taches est fixé par la distance que parcourt v avant que u puisse rattraper.",
    },
    {
      pretitle: "Section 03 · Pourquoi les rapports de diffusion comptent",
      title: "L'instabilité de Turing exige que le frein aille plus vite que le feu",
      body: "Sans diffusion, l'état uniforme est localement stable : les petites perturbations meurent. La surprise de Turing fut qu'ajouter de la diffusion peut le déstabiliser — mais seulement si D_v ≫ D_u. L'activateur lent s'agglutine ; l'inhibiteur rapide balaie les agrégats, sauf à une longueur d'onde caractéristique où les rythmes s'équilibrent. Cette longueur d'onde devient l'espacement des taches, la période des rayures. Change le rapport et l'échelle du motif change — la même chimie, réaccordée par un seul nombre.",
    },
    {
      pretitle: "Section 04 · Le modèle Gray–Scott",
      title: "Deux molettes : F (feed) et k (kill)",
      body: "La réalisation concrète la plus célèbre est Gray–Scott : ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. La réaction u + 2v → 3v autocatalyse v ; le feed F reconstitue u, et le kill (F+k) retire v. Balayer F et k à travers un petit rectangle du plan (F, k) traverse tout un bestiaire, catalogué par John Pearson en 1993 : taches, rayures, labyrinthes, corail, mitose, U-skate world, solitons. Une paire d'équations, un zoo entier de comportements.",
    },
    {
      pretitle: "Section 05 · Biologie et au-delà",
      title: "Embryons, peaux de poissons, coquillages, sable",
      body: "Hans Meinhardt a passé des décennies à ajuster des modèles de réaction-diffusion à la morphogenèse — formation des membres, nervures des feuilles, lignes de pigment des coquillages tracées comme un front d'onde sur un bord en croissance. Kondo et Asai ont montré en 1995 que les rayures des poissons-anges Pomacanthus se réorganisent exactement comme le prédit un modèle de réaction-diffusion lorsque le poisson grandit. La même mathématique décrit les rides de sable dans les eaux peu profondes, les variations de densité dans les fluides convectifs — et même la toile cosmique des galaxies esquissée par l'instabilité gravitationnelle dans l'univers primordial.",
    },
    {
      pretitle: "Section 06 · Ce que l'on ignore encore",
      title: "Problèmes ouverts et mise à l'échelle surprenante",
      body: "Quelles molécules exactes jouent l'activateur et l'inhibiteur dans la peau des mammifères reste en débat — les candidats impliquent la signalisation Wnt et Notch — et comment le système met le motif à l'échelle du corps reste un mystère : une souris et un éléphant produisent les mêmes types de motifs à des échelles très différentes, alors que la chimie sous-jacente devrait fixer une longueur d'onde absolue. Mathématiquement, le lien avec les équations d'amplitude et la sélection de motifs est bien compris ; biologiquement, la surprise que «Turing avait raison» s'approfondit plutôt qu'elle ne se referme.",
    },
  ],
  grayScott: {
    caption: "Interactif · réaction-diffusion de Gray-Scott",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Réinitialiser",
    pauseLabel: "Pause",
    playLabel: "Lire",
    presetLabel: "Préréglages de Pearson",
    presetNames: { spots: "Taches", stripes: "Rayures", coral: "Corail", mitosis: "Mitose" },
    note: "Petite grille 120×100, repli toroïdal, 30 sous-pas par image. Choisis un préréglage de Pearson ou glisse F et k. Astuce : les petits pas comptent — la plus grande partie du plan (F, k) donne des champs vides ; la bande intéressante est très fine.",
    pretitle: "Interactif · tourne les deux molettes",
    title: "Lance le modèle dans ton navigateur",
    body: "Regarde la réaction-diffusion de Gray-Scott en temps réel sur une petite grille. Les quatre préréglages correspondent aux régimes canoniques étiquetés par Pearson en 1993 ; les curseurs te laissent glisser entre eux. La dynamique est sensible : un changement de 0,001 dans F ou k peut te conduire de taches de léopard à un labyrinthe de rayures.",
  },
  gallery: {
    caption: "Interactif · le zoo de Pearson",
    hint: "Quatre régimes, quatre palettes. Survole ou touche une cellule pour lire ce qu'elle est. Chaque cellule est sa propre simulation vivante.",
    pretitle: "Interactif · galerie de motifs",
    title: "Quatre régimes célèbres de Gray-Scott",
    body: "D'un seul couple d'équations sort un bestiaire entier. Ces quatre cellules montrent les exemples canoniques : taches discrètes, labyrinthes sinueux, corail ramifié et mitose auto-réplicante. Elles vivent sur de minuscules grilles pour tenir sur un téléphone — mais chacune calcule les mêmes équations que l'Explorateur.",
    regimes: [
      {
        id: "spots",
        label: "Taches",
        F: 0.025,
        k: 0.06,
        body: "Points ronds et isolés — la texture d'une robe de léopard ou d'un œil de paon. Chaque point clôt un halo autour de lui ; l'espacement est fixé par la distance que parcourt l'inhibiteur avant que l'activateur rattrape.",
      },
      {
        id: "stripes",
        label: "Labyrinthe",
        F: 0.029,
        k: 0.057,
        body: "Rayures labyrinthiques sinueuses — le régime zêta de Pearson. Le motif a encore une longueur d'onde préférée, mais le système ne tranche jamais entre points et bandes continues, et dessine plutôt de longues crêtes méandreuses.",
      },
      {
        id: "coral",
        label: "Corail",
        F: 0.054,
        k: 0.063,
        body: "Fronts ramifiés en croissance — la même famille de structures par laquelle le vrai corail grandit, et que la pigmentation des coquillages peint comme un front d'onde unidimensionnel sur une coquille bidimensionnelle.",
      },
      {
        id: "mitosis",
        label: "Mitose",
        F: 0.0367,
        k: 0.0649,
        body: "Points qui s'auto-répliquent : chaque tache grandit, se divise, et les filles s'éloignent avant de se diviser encore. Les mêmes équations qui peignent un léopard modélisent aussi un carreau de cellules en propagation.",
      },
    ],
  },
  closingPretitle: "Va plus loin",
  closingTitle: "Fais pousser des taches.",
  closingBody:
    "L'Explorateur te donne la grille complète 200×200, chaque préréglage de Pearson, le contrôle sur les rapports de diffusion D_u et D_v, plusieurs palettes et la liberté de ralentir la simulation pour observer chaque pas.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ----- Italian -----
const it: RichStory = {
  page: {
    pretitle: "Tema · Reazione–diffusione",
    title: "Motivi di Turing",
    tagline: "Due sostanze, due velocità di diffusione — e il manto di un leopardo appare.",
    intro:
      "Nel 1952 Alan Turing mostrò che due sostanze che interagiscono, una che diffonde più veloce dell'altra, possono spontaneamente rompere una miscela uniforme in macchie, strisce e reti ramificate. Le stesse equazioni spiegano la pelle del leopardo, le strisce della zebra, le bande del pesce angelo — e sorprendentemente bene come un embrione decide dove mettere le cose.",
    ctaInteractive: "Apri l'Esploratore",
    sections: [],
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Due sostanze. Velocità diverse. Appare un manto.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Mescola due sostanze invisibili su una superficie piatta. Una si diffonde lentamente e si amplifica da sola. L'altra si diffonde velocemente e spegne la prima. Da una zuppa perfettamente uniforme, punti, strisce e reti ramificate si risolvono pian piano. Le stesse equazioni spiegano le macchie di un leopardo, le strisce di una zebra, le bande di un pesce angelo — una sola regola con due manopole, dipinta su ogni superficie che aveva bisogno di un disegno.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Chiamale attivatore e inibitore. L'attivatore si amplifica localmente, come un piccolo fuoco che accende un altro fuoco accanto. L'inibitore si diffonde verso l'esterno più veloce e soffoca l'attivatore a distanza. Dove vince l'attivatore, nasce una macchia. Intorno, l'alone dell'inibitore impedisce a un'altra macchia di formarsi troppo vicino. Pava questa competizione su una superficie e ottieni un mare uniforme di puntini — o di strisce, se la geometria pende così.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Turing lo scrisse nel suo ultimo articolo, «The Chemical Basis of Morphogenesis» (1952), prima che alcuna biologia lo confermasse. La biologia molecolare moderna ha poi trovato le coppie attivatore-inibitore che aveva previsto — nella pelle del pesce zebra, nei follicoli del topo, nello spaziamento delle dita degli arti dei vertebrati. La stessa matematica riappare nella pigmentazione delle conchiglie, nella fisica delle increspature di sabbia e nei pattern di densità dell'universo primordiale.",
      },
    ],
    tryIt:
      "Sotto: fai girare un piccolo simulatore di Gray-Scott e gira tra quattro dei regimi catalogati da Pearson nel 1993.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · L'equazione",
      title: "Due PDE accoppiate, due costanti di diffusione",
      body: "Siano u e v le concentrazioni di due sostanze che interagiscono su una superficie piatta. Ognuna diffonde con il proprio ritmo, e ognuna reagisce con l'altra. Il sistema è ∂u/∂t = D_u ∇²u + f(u, v) e ∂v/∂t = D_v ∇²v + g(u, v). I termini laplaciani descrivono la diffusione; f e g, la chimica. Tutto qui — uno stato iniziale uniforme più i termini di reazione più una differenza tra D_u e D_v bastano perché i pattern emergano dal nulla.",
    },
    {
      pretitle: "Sezione 02 · Attivatore e inibitore",
      title: "Attivazione locale, inibizione laterale",
      body: "L'intuizione più pulita è il quadro di Gierer–Meinhardt: u è un attivatore che catalizza sia se stesso sia il proprio freno, v. L'attivatore vuole accendersi in un punto caldo ovunque una fluttuazione sollevi la sua concentrazione. Ma produce anche v, che diffonde verso l'esterno più veloce e schiaccia u nell'anello circostante. Risultato: ogni macchia nascente recinta i vicini. La spaziatura tra le macchie è fissata da quanto lontano viaggia v prima che u recuperi.",
    },
    {
      pretitle: "Sezione 03 · Perché i rapporti di diffusione contano",
      title: "L'instabilità di Turing richiede che il freno sia più veloce del fuoco",
      body: "Senza diffusione, lo stato uniforme è localmente stabile: le piccole perturbazioni muoiono. La sorpresa di Turing fu che aggiungere diffusione può destabilizzarlo — ma solo se D_v ≫ D_u. L'attivatore lento si raggruma; l'inibitore veloce spazza via i grumi, eccetto a una lunghezza d'onda caratteristica in cui i ritmi si bilanciano. Quella lunghezza d'onda diventa la spaziatura delle macchie, il periodo delle strisce. Cambia il rapporto e cambia la scala del pattern — la stessa chimica, riaccordata da un numero.",
    },
    {
      pretitle: "Sezione 04 · Il modello Gray–Scott",
      title: "Due manopole: F (feed) e k (kill)",
      body: "La realizzazione concreta più famosa è Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. La reazione u + 2v → 3v autocatalizza v; il feed F ricarica u, e il kill (F+k) rimuove v. Spazzare F e k su un rettangolino del piano (F, k) attraversa un intero bestiario, catalogato da John Pearson nel 1993: macchie, strisce, labirinti, corallo, mitosi, U-skate world, solitoni. Una coppia di equazioni, uno zoo intero di comportamenti.",
    },
    {
      pretitle: "Sezione 05 · Biologia e oltre",
      title: "Embrioni, pelli di pesce, conchiglie, sabbia",
      body: "Hans Meinhardt ha passato decenni a calibrare modelli di reazione-diffusione sulla morfogenesi — formazione degli arti, nervature delle foglie, linee di pigmento delle conchiglie tracciate come un fronte d'onda su un bordo che cresce. Kondo e Asai hanno mostrato nel 1995 che le strisce dei pesci angelo Pomacanthus si riorganizzano esattamente come predice un modello di reazione-diffusione quando il pesce cresce. La stessa matematica descrive le increspature di sabbia in acque basse, le variazioni di densità in fluidi convettivi — e perfino la ragnatela cosmica delle galassie tracciata dall'instabilità gravitazionale nell'universo primordiale.",
    },
    {
      pretitle: "Sezione 06 · Quello che ancora non sappiamo",
      title: "Problemi aperti e scalatura sorprendente",
      body: "Quali molecole esatte facciano da attivatore e inibitore nella pelle dei mammiferi è ancora dibattuto — i candidati coinvolgono la segnalazione Wnt e Notch — e come il sistema scali il pattern con la taglia del corpo resta un mistero: un topo e un elefante crescono lo stesso tipo di pattern a scale molto diverse, eppure la chimica sottostante dovrebbe fissare un'unica lunghezza d'onda assoluta. Matematicamente, il legame con le equazioni di ampiezza e la selezione di pattern è ben compreso; biologicamente, la sorpresa che «Turing aveva ragione» si approfondisce, anziché chiudersi.",
    },
  ],
  grayScott: {
    caption: "Interattivo · reazione-diffusione di Gray-Scott",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Reset",
    pauseLabel: "Pausa",
    playLabel: "Vai",
    presetLabel: "Preset di Pearson",
    presetNames: { spots: "Macchie", stripes: "Strisce", coral: "Corallo", mitosis: "Mitosi" },
    note: "Griglia minuscola 120×100, bordo toroidale, 30 sotto-passi per frame. Scegli un preset di Pearson o muovi F e k. Suggerimento: i piccoli passi contano — la maggior parte del piano (F, k) dà campi vuoti; la striscia interessante è sottilissima.",
    pretitle: "Interattivo · gira le due manopole",
    title: "Fai girare il modello nel browser",
    body: "Guarda reazione-diffusione di Gray-Scott in tempo reale su una piccola griglia. I quattro preset corrispondono ai regimi canonici etichettati da Pearson nel 1993; gli slider ti fanno scivolare tra essi. La dinamica è sensibile: un cambiamento di 0,001 in F o k può portarti da macchie di leopardo a un labirinto di strisce.",
  },
  gallery: {
    caption: "Interattivo · lo zoo di Pearson",
    hint: "Quattro regimi, quattro palette. Passa sopra o tocca una cella per leggere cos'è. Ogni cella è una propria simulazione viva.",
    pretitle: "Interattivo · galleria dei pattern",
    title: "Quattro regimi famosi di Gray-Scott",
    body: "Da una sola coppia di equazioni nasce un intero bestiario. Queste quattro celle mostrano gli esempi canonici: macchie discrete, labirinti sinuosi, corallo ramificato e mitosi autoreplicante. Vivono su griglie minuscole per stare su un telefono — ma ognuna calcola le stesse equazioni dell'Esploratore.",
    regimes: [
      {
        id: "spots",
        label: "Macchie",
        F: 0.025,
        k: 0.06,
        body: "Puntini rotondi e isolati — la trama del manto di un leopardo o dell'occhio di un pavone. Ogni punto recinta un alone attorno a sé; la spaziatura è fissata da quanto lontano arriva l'inibitore prima che l'attivatore lo raggiunga.",
      },
      {
        id: "stripes",
        label: "Labirinto",
        F: 0.029,
        k: 0.057,
        body: "Strisce labirintiche sinuose — il regime zeta di Pearson. Il pattern ha ancora una lunghezza d'onda preferita, ma il sistema non sceglie mai tra puntini e bande continue, e disegna invece lunghi creste meandranti.",
      },
      {
        id: "coral",
        label: "Corallo",
        F: 0.054,
        k: 0.063,
        body: "Fronti ramificati in crescita — la stessa famiglia di strutture con cui il vero corallo cresce, e con cui la pigmentazione delle conchiglie dipinge come un fronte d'onda unidimensionale su una conchiglia bidimensionale.",
      },
      {
        id: "mitosis",
        label: "Mitosi",
        F: 0.0367,
        k: 0.0649,
        body: "Puntini che si auto-replicano: ogni macchia cresce, si divide, e le figlie si allontanano prima di dividersi di nuovo. Le stesse equazioni che dipingono un leopardo modellano anche una piastrella di cellule in propagazione.",
      },
    ],
  },
  closingPretitle: "Vai oltre",
  closingTitle: "Falle crescere, le macchie.",
  closingBody:
    "L'Esploratore ti dà la griglia completa 200×200, ogni preset di Pearson, controllo sui rapporti di diffusione D_u e D_v, varie palette e la libertà di rallentare la simulazione per osservare ogni passo.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ----- Portuguese -----
const pt: RichStory = {
  page: {
    pretitle: "Tema · Reação–difusão",
    title: "Padrões de Turing",
    tagline: "Dois químicos, duas velocidades de difusão — e a pelagem do leopardo aparece.",
    intro:
      "Em 1952 Alan Turing mostrou que duas substâncias que interagem, uma a difundir mais depressa do que a outra, podem quebrar espontaneamente uma mistura uniforme em pontos, riscas e redes ramificadas. As mesmas equações explicam a pele do leopardo, as riscas da zebra, as bandas do peixe-anjo — e surpreendentemente bem como um embrião decide onde pôr cada coisa.",
    ctaInteractive: "Abrir o Explorador",
    sections: [],
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Dois químicos. Velocidades diferentes. Aparece uma pelagem.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Mistura dois químicos invisíveis numa folha plana. Um espalha-se devagar e amplifica-se a si mesmo. O outro espalha-se depressa e desliga o primeiro. Da sopa perfeitamente uniforme, pontos, riscas e redes ramificadas resolvem-se devagar. As mesmíssimas equações explicam as manchas de um leopardo, as riscas de uma zebra, as bandas de um peixe-anjo — uma só regra com dois botões, pintada sobre toda a superfície que precisava de um padrão.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Chama-lhes ativador e inibidor. O ativador amplifica-se localmente, como um pequeno fogo a acender outro ao lado. O inibidor difunde-se para fora mais depressa e abafa o ativador à distância. Onde o ativador ganha, sai uma mancha. À volta, o halo do inibidor impede outra mancha de se formar demasiado perto. Pavimenta essa competição sobre uma superfície e tens um mar uniforme de pontos — ou riscas, se a geometria pender assim.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Turing escreveu isto no seu último artigo, «The Chemical Basis of Morphogenesis» (1952), antes de qualquer biologia o apoiar. A biologia molecular moderna já encontrou desde então os pares ativador-inibidor que previa — em pele de peixe-zebra, folículos de pelo do rato, espaçamento dos dedos em membros de vertebrados. A mesma matemática aparece também na pigmentação de conchas, na física de ondulações de areia e em padrões de densidade do universo primordial.",
      },
    ],
    tryIt:
      "Abaixo: corre um pequeno simulador Gray-Scott e percorre quatro dos regimes que Pearson catalogou em 1993.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A equação",
      title: "Duas EDPs acopladas, duas constantes de difusão",
      body: "Sejam u e v as concentrações de duas substâncias que interagem numa superfície plana. Cada uma difunde ao seu próprio ritmo, e cada uma reage com a outra. O sistema é ∂u/∂t = D_u ∇²u + f(u, v) e ∂v/∂t = D_v ∇²v + g(u, v). Os termos laplacianos descrevem o espalhar; f e g, a química. É só isto — um estado inicial uniforme mais os termos de reação mais uma diferença entre D_u e D_v bastam para que padrões apareçam do nada.",
    },
    {
      pretitle: "Secção 02 · Ativador e inibidor",
      title: "Ativação local, inibição lateral",
      body: "A intuição mais limpa é o quadro de Gierer–Meinhardt: u é um ativador que catalisa tanto a si próprio quanto o seu próprio travão, v. O ativador quer pegar fogo num ponto quente onde uma flutuação levantar a sua concentração. Mas também produz v, que difunde para fora mais depressa e esmaga u no anel à volta. Resultado: cada mancha nascente cerca os vizinhos. O espaçamento entre manchas é fixado pelo quão longe viaja v antes de u apanhar.",
    },
    {
      pretitle: "Secção 03 · Porque os rácios de difusão importam",
      title: "A instabilidade de Turing exige que o travão seja mais rápido que o fogo",
      body: "Sem difusão, o estado uniforme é localmente estável: as pequenas perturbações morrem. A surpresa de Turing foi que acrescentar difusão pode desestabilizá-lo — mas só se D_v ≫ D_u. O ativador lento agrupa-se; o inibidor rápido varre os grumos, exceto a um comprimento de onda característico onde os ritmos se equilibram. Esse comprimento de onda torna-se o espaçamento dos pontos, o período das riscas. Muda o rácio e muda a escala do padrão — a mesma química, reafinada por um número.",
    },
    {
      pretitle: "Secção 04 · O modelo Gray–Scott",
      title: "Dois botões: F (feed) e k (kill)",
      body: "A realização concreta mais famosa é Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. A reação u + 2v → 3v autocatalisa v; o feed F repõe u, e o kill (F+k) tira v. Varrer F e k por um retângulo pequenino do plano (F, k) atravessa um bestiário inteiro, catalogado por John Pearson em 1993: pontos, riscas, labirintos, coral, mitose, U-skate world, solitões. Um par de equações, um zoológico inteiro de comportamentos.",
    },
    {
      pretitle: "Secção 05 · Biologia e mais além",
      title: "Embriões, peles de peixe, conchas, areia",
      body: "Hans Meinhardt passou décadas a ajustar modelos de reação-difusão à morfogénese — formação de membros, nervuras de folhas, linhas de pigmento de conchas traçadas como uma frente de onda numa borda em crescimento. Kondo e Asai mostraram em 1995 que as riscas dos peixes-anjo Pomacanthus se reorganizam exatamente como um modelo de reação-difusão prevê quando o peixe cresce. A mesma matemática descreve ondulações de areia em águas rasas, variações de densidade em fluidos convectivos — e até a teia cósmica de galáxias esboçada pela instabilidade gravitacional no universo primordial.",
    },
    {
      pretitle: "Secção 06 · O que ainda não sabemos",
      title: "Problemas em aberto e escala surpreendente",
      body: "Quais moléculas exatas fazem de ativador e inibidor na pele dos mamíferos ainda se debate — os candidatos envolvem sinalização Wnt e Notch — e como o sistema escala o padrão com o tamanho do corpo permanece um mistério: um rato e um elefante criam os mesmos tipos de padrões em escalas muito diferentes, embora a química subjacente devesse fixar um único comprimento de onda absoluto. Matematicamente, a ligação às equações de amplitude e seleção de padrões está bem compreendida; biologicamente, a surpresa de que «Turing tinha razão» aprofunda-se em vez de se fechar.",
    },
  ],
  grayScott: {
    caption: "Interativo · reação-difusão de Gray-Scott",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Reiniciar",
    pauseLabel: "Pausa",
    playLabel: "Jogar",
    presetLabel: "Predefinições de Pearson",
    presetNames: { spots: "Pontos", stripes: "Riscas", coral: "Coral", mitosis: "Mitose" },
    note: "Grelha minúscula 120×100, embrulho toroidal, 30 sub-passos por frame. Escolhe uma predefinição de Pearson ou desliza F e k. Dica: os passos pequenos contam — a maior parte do plano (F, k) dá campos vazios; a faixa interessante é fininha.",
    pretitle: "Interativo · gira os dois botões",
    title: "Corre o modelo no teu navegador",
    body: "Vê reação-difusão de Gray-Scott em tempo real numa pequena grelha. As quatro predefinições correspondem aos regimes canónicos que Pearson rotulou em 1993; os deslizadores deixam-te deslizar entre eles. A dinâmica é sensível: uma mudança de 0,001 em F ou k pode levar-te de manchas de leopardo a um labirinto de riscas.",
  },
  gallery: {
    caption: "Interativo · o zoo de Pearson",
    hint: "Quatro regimes, quatro paletas. Passa por cima ou toca numa célula para ler o que é. Cada célula é a sua própria simulação viva.",
    pretitle: "Interativo · galeria de padrões",
    title: "Quatro regimes famosos de Gray-Scott",
    body: "De um único par de equações nasce um bestiário inteiro. Estas quatro células mostram os exemplos canónicos: pontos discretos, labirintos sinuosos, coral ramificado e mitose autorreplicante. Vivem em grelhas minúsculas para caberem num telemóvel — mas cada uma calcula as mesmas equações do Explorador.",
    regimes: [
      {
        id: "spots",
        label: "Pontos",
        F: 0.025,
        k: 0.06,
        body: "Pontos redondos e isolados — a textura da pelagem de um leopardo ou do olho de um pavão. Cada ponto cerca um halo à sua volta; o espaçamento é fixado pela distância a que o inibidor chega antes de o ativador o apanhar.",
      },
      {
        id: "stripes",
        label: "Labirinto",
        F: 0.029,
        k: 0.057,
        body: "Riscas labirínticas sinuosas — o regime zeta de Pearson. O padrão ainda tem um comprimento de onda preferido, mas o sistema nunca decide entre pontos e bandas contínuas e desenha em vez disso longas cristas meandrantes.",
      },
      {
        id: "coral",
        label: "Coral",
        F: 0.054,
        k: 0.063,
        body: "Frentes ramificadas em crescimento — a mesma família de estruturas com que o coral real cresce, e com que a pigmentação das conchas pinta como uma frente de onda unidimensional sobre uma concha bidimensional.",
      },
      {
        id: "mitosis",
        label: "Mitose",
        F: 0.0367,
        k: 0.0649,
        body: "Pontos que se autorreplicam: cada mancha cresce, divide-se, e as filhas afastam-se antes de se dividirem outra vez. As mesmas equações que pintam um leopardo modelam também um ladrilho de células em propagação.",
      },
    ],
  },
  closingPretitle: "Vai mais longe",
  closingTitle: "Faz crescer umas manchas.",
  closingBody:
    "O Explorador dá-te a grelha completa 200×200, todas as predefinições de Pearson, controlo sobre os rácios de difusão D_u e D_v, várias paletas e a liberdade de abrandar a simulação e ver cada passo.",
  ctaLabel: "→ Abrir o Explorador",
};

// ----- Swedish -----
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Reaktion–diffusion",
    title: "Turingmönster",
    tagline: "Två kemikalier, två diffusionshastigheter — och en leopardpäls träder fram.",
    intro:
      "År 1952 visade Alan Turing att två ämnen som påverkar varandra, ett som diffunderar snabbare än det andra, spontant kan bryta sönder en jämn blandning till prickar, ränder och förgrenade nätverk. Samma ekvationer förklarar leopardens päls, sebrans ränder, kejsarfiskens band — och förvånansvärt mycket av hur ett embryo bestämmer var saker ska placeras.",
    ctaInteractive: "Öppna Utforskaren",
    sections: [],
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Två kemikalier. Olika tempo. En päls träder fram.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Blanda två osynliga kemikalier på ett platt ark. Det ena sprider sig långsamt och förstärker sig själv. Det andra sprider sig snabbt och stänger av det första. Ur en perfekt jämn soppa löser sig prickar, ränder och förgrenade nätverk långsamt fram. Exakt samma ekvationer förklarar fläckarna på en leopard, ränderna på en sebra, banden på en kejsarfisk — en enda regel med två rattar, målad över varje yta som behövde ett mönster.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Kalla dem aktivator och inhibitor. Aktivatorn förstärker sig lokalt — som en liten eld som tänder en till bredvid. Inhibitorn diffunderar ut snabbare och kväver aktivatorn på avstånd. Där aktivatorn vinner växer en fläck. Runt omkring hindrar inhibitorns halo en annan fläck från att bildas för nära. Kakla den kampen över en yta och du får ett jämnt hav av prickar — eller ränder, om geometrin lutar åt det hållet.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Turing skrev ned detta i sin sista artikel, «The Chemical Basis of Morphogenesis» (1952), innan någon biologi backade upp honom. Modern molekylärbiologi har sedan hittat aktivator-inhibitor-paren han förutsade — i zebrafiskhud, mushårsäckar, fingerspridning i ryggradsdjurs lemmar. Samma matematik dyker upp i snäckpigmentering, sandripplor och täthetsmönster i det tidiga universum.",
      },
    ],
    tryIt:
      "Nedan: kör en liten Gray-Scott-simulator och turné genom fyra av de regimer Pearson katalogiserade 1993.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Ekvationen",
      title: "Två kopplade PDE:er, två diffusionskonstanter",
      body: "Låt u och v vara koncentrationerna av två växelverkande ämnen på en plan yta. Var och en diffunderar i sin egen takt och var och en reagerar med den andra. Systemet är ∂u/∂t = D_u ∇²u + f(u, v) och ∂v/∂t = D_v ∇²v + g(u, v). Laplaceleden beskriver spridning; f och g, kemin. Mer behövs inte — ett jämnt utgångsläge plus reaktionsleden plus en skillnad mellan D_u och D_v räcker för att mönster ska uppstå ur intet.",
    },
    {
      pretitle: "Avsnitt 02 · Aktivator och inhibitor",
      title: "Lokal aktivering, lateral inhibition",
      body: "Den renaste intuitionen är Gierer–Meinhardt-bilden: u är en aktivator som katalyserar både sig själv och sin egen broms, v. Aktivatorn vill flamma upp i en het fläck där en fluktuation höjer dess koncentration. Men den producerar också v, som diffunderar utåt snabbare och pressar ner u i den omgivande ringen. Resultat: varje gryende fläck stänger ute sina grannar. Avståndet mellan fläckar bestäms av hur långt v hinner innan u hänger på.",
    },
    {
      pretitle: "Avsnitt 03 · Varför diffusionsförhållanden spelar roll",
      title: "Turing-instabiliteten kräver att bromsen är snabbare än elden",
      body: "Utan diffusion är det jämna tillståndet lokalt stabilt: små störningar dör ut. Turings överraskning var att tillägg av diffusion kan destabilisera det — men bara om D_v ≫ D_u. Den långsamma aktivatorn klumpar ihop sig; den snabba inhibitorn sopar bort klumparna, utom vid en karakteristisk våglängd där tempot balanserar. Den våglängden blir avståndet mellan fläckar, perioden mellan ränder. Ändra förhållandet och mönstrets skala ändras med — samma kemi, omstämd av ett enda tal.",
    },
    {
      pretitle: "Avsnitt 04 · Gray–Scott-modellen",
      title: "Två rattar: F (feed) och k (kill)",
      body: "Den mest kända konkreta realiseringen är Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. Reaktionen u + 2v → 3v autokatalyserar v; matningen F fyller på u, och dödandet (F+k) tar bort v. Att sopa F och k över en liten rektangel av (F, k)-planet vandrar genom ett helt bestiarium, först katalogiserat av John Pearson 1993: prickar, ränder, labyrinter, korall, mitos, U-skate world, solitoner. Ett ekvationspar, en hel zoologi av beteenden.",
    },
    {
      pretitle: "Avsnitt 05 · Biologi och bortom",
      title: "Embryon, fiskhud, snäckor, sand",
      body: "Hans Meinhardt tillbringade årtionden med att anpassa reaktions-diffusionsmodeller till morfogenesen — lembildning, bladnervatur, snäckpigmentlinjer ritade som en vågfront längs en växande kant. Kondo och Asai visade 1995 att ränderna på Pomacanthus-kejsarfiskar omorganiseras exakt som en reaktions-diffusionsmodell förutsäger när fisken växer. Samma matematik beskriver sandripplor i grunda vatten, täthetsvariationer i konvektiva vätskor — och till och med kosmiska galaxnätet som skissats av gravitationsinstabilitet i det tidiga universum.",
    },
    {
      pretitle: "Avsnitt 06 · Vad vi fortfarande inte vet",
      title: "Öppna problem och överraskande skalning",
      body: "Vilka exakta molekyler som spelar aktivator och inhibitor i däggdjurshud debatteras fortfarande — kandidater rör Wnt- och Notch-signalering — och hur systemet skalar mönstret med kroppsstorlek förblir en gåta: en mus och en elefant odlar samma typer av mönster i mycket olika skalor, trots att den underliggande kemin borde fixera en enda absolut våglängd. Matematiskt är kopplingen till amplitudekvationer och mönsterval välförstådd; biologiskt fördjupar sig överraskningen att «Turing hade rätt» snarare än att stängas.",
    },
  ],
  grayScott: {
    caption: "Interaktivt · Gray-Scott reaktion-diffusion",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Återställ",
    pauseLabel: "Paus",
    playLabel: "Spela",
    presetLabel: "Pearson-förinställningar",
    presetNames: { spots: "Prickar", stripes: "Ränder", coral: "Korall", mitosis: "Mitos" },
    note: "Liten 120×100-rutmatta, toroidal omslagning, 30 delsteg per bildruta. Välj en Pearson-förinställning eller dra F- och k-reglagen. Tips: små steg räknas — det mesta av (F, k)-planet ger tomma fält; den intressanta randen är knivvass.",
    pretitle: "Interaktivt · vrid på de två rattarna",
    title: "Kör modellen i din webbläsare",
    body: "Se Gray-Scott reaktion-diffusion i realtid på en liten rutmatta. De fyra förinställningarna motsvarar de kanoniska regimer Pearson döpte 1993; reglagen låter dig glida mellan dem. Dynamiken är känslig: en ändring på 0,001 i F eller k kan ta dig från leopardens fläckar till en labyrint av ränder.",
  },
  gallery: {
    caption: "Interaktivt · Pearsons zoo",
    hint: "Fyra regimer, fyra färgkartor. Hovra eller tryck på en cell för att läsa vad den är. Varje cell är sin egen levande simulering.",
    pretitle: "Interaktivt · mönstergalleri",
    title: "Fyra berömda Gray-Scott-regimer",
    body: "Ur ett enda ekvationspar växer ett helt bestiarium. Dessa fyra celler visar de kanoniska exemplen: diskreta prickar, slingrande labyrinter, förgrenad korall och självreplikerande mitos. De lever på små rutmattor så de får plats på en mobil — men varje en räknar samma ekvationer som Utforskaren.",
    regimes: [
      {
        id: "spots",
        label: "Prickar",
        F: 0.025,
        k: 0.06,
        body: "Runda, isolerade prickar — texturen på en leopardpäls eller en påfågelöga. Varje prick stänger ut en halo runt sig; avståndet bestäms av hur långt inhibitorn når innan aktivatorn hinner ikapp.",
      },
      {
        id: "stripes",
        label: "Labyrint",
        F: 0.029,
        k: 0.057,
        body: "Slingrande labyrintränder — Pearsons zeta-regim. Mönstret har fortfarande en föredragen våglängd, men systemet väljer aldrig mellan prickar och kontinuerliga band, utan ritar i stället långa, meandrande åsar.",
      },
      {
        id: "coral",
        label: "Korall",
        F: 0.054,
        k: 0.063,
        body: "Förgrenade, växande fronter — samma familj av strukturer som riktig korall växer i, och som snäckpigmentering målar som en endimensionell vågfront över ett tvådimensionellt skal.",
      },
      {
        id: "mitosis",
        label: "Mitos",
        F: 0.0367,
        k: 0.0649,
        body: "Självreplikerande prickar: varje fläck växer, delar sig, och döttrarna driver isär innan de delar sig igen. Samma ekvationer som målar en leopard modellerar också en bricka av spridande celler.",
      },
    ],
  },
  closingPretitle: "Gå vidare",
  closingTitle: "Odla några fläckar.",
  closingBody:
    "Utforskaren ger dig hela 200×200-rutmattan, varje Pearson-förinställning, kontroll över diffusionsförhållandena D_u och D_v, flera paletter och friheten att sakta ned simuleringen och se varje steg.",
  ctaLabel: "→ Öppna Utforskaren",
};

// ----- Norwegian -----
const no: RichStory = {
  page: {
    pretitle: "Tema · Reaksjon–diffusjon",
    title: "Turing-mønstre",
    tagline: "To kjemikalier, to diffusjonshastigheter — og en leopardpels trer fram.",
    intro:
      "I 1952 viste Alan Turing at to stoffer som påvirker hverandre, ett som diffunderer raskere enn det andre, spontant kan bryte opp en jevn blanding i prikker, striper og forgrenede nettverk. De samme ligningene forklarer leopardens pels, sebraens striper, keiserfiskens bånd — og overraskende mye av hvordan et embryo bestemmer hvor ting skal være.",
    ctaInteractive: "Åpne Utforskeren",
    sections: [],
  },
  encounter: {
    pretitle: "Første møte",
    title: "To kjemikalier. Ulike tempi. En pels trer fram.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Bland to usynlige kjemikalier på et flatt ark. Det ene sprer seg sakte og forsterker seg selv. Det andre sprer seg raskt og slår av det første. Ut av en helt jevn suppe løser prikker, striper og forgrenede nettverk seg sakte fram. Nøyaktig de samme ligningene forklarer flekkene på en leopard, stripene på en sebra, båndene på en keiserfisk — én regel med to rattepar, malt over hver flate som trengte et mønster.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Kall dem aktivator og inhibitor. Aktivatoren forsterker seg lokalt — som en liten ild som tenner en annen ved siden av. Inhibitoren diffunderer raskere utover og kveler aktivatoren på avstand. Der aktivatoren vinner vokser en flekk. Rundt den hindrer inhibitorens halo en annen flekk i å danne seg for tett inntil. Flislegg den konkurransen over en flate og du får et jevnt hav av prikker — eller striper, hvis geometrien heller dit.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Turing skrev dette ned i sin siste artikkel, «The Chemical Basis of Morphogenesis» (1952), før noen biologi støttet ham. Moderne molekylærbiologi har siden funnet aktivator-inhibitor-parene han forutsa — i sebrafiskhud, mus-hårsekker, fingeravstand i virveldyrlemmer. Den samme matematikken dukker opp i snegleskall-pigmentering, sandkrusninger og tetthetsmønstre i det tidlige universet.",
      },
    ],
    tryIt:
      "Under: kjør en liten Gray-Scott-simulator og turne gjennom fire av regimene Pearson katalogiserte i 1993.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Ligningen",
      title: "To koblede PDE-er, to diffusjonskonstanter",
      body: "La u og v være konsentrasjonene av to vekselvirkende stoffer på en flat overflate. Hvert av dem diffunderer i sin egen rytme, og hvert av dem reagerer med det andre. Systemet er ∂u/∂t = D_u ∇²u + f(u, v) og ∂v/∂t = D_v ∇²v + g(u, v). Laplace-leddene beskriver spredning; f og g beskriver kjemien. Det er alt — en jevn utgangstilstand pluss reaksjonsleddene pluss en forskjell mellom D_u og D_v er nok til at mønstre dukker opp ut av intet.",
    },
    {
      pretitle: "Avsnitt 02 · Aktivator og inhibitor",
      title: "Lokal aktivering, lateral inhibisjon",
      body: "Den reneste intuisjonen er Gierer–Meinhardt-bildet: u er en aktivator som katalyserer både seg selv og sin egen brems, v. Aktivatoren vil ta fyr i en het flekk der en fluktuasjon løfter konsentrasjonen. Men den produserer også v, som diffunderer utover raskere og presser ned u i ringen rundt. Resultat: hver gryende flekk gjerder inn naboene. Avstanden mellom flekker settes av hvor langt v rekker før u tar igjen.",
    },
    {
      pretitle: "Avsnitt 03 · Hvorfor diffusjonsforhold betyr noe",
      title: "Turing-instabiliteten krever at bremsen er raskere enn ilden",
      body: "Uten diffusjon er den jevne tilstanden lokalt stabil: små forstyrrelser dør ut. Turings overraskelse var at å legge til diffusjon kan destabilisere den — men bare hvis D_v ≫ D_u. Den langsomme aktivatoren klumper seg; den raske inhibitoren feier bort klumpene, unntatt ved en karakteristisk bølgelengde der tempoene balanserer. Den bølgelengden blir avstanden mellom flekkene, perioden i stripene. Endre forholdet og mønsterets skala endrer seg — samme kjemi, omstemt av ett tall.",
    },
    {
      pretitle: "Avsnitt 04 · Gray–Scott-modellen",
      title: "To ratt: F (feed) og k (kill)",
      body: "Den mest kjente konkrete realiseringen er Gray–Scott: ∂u/∂t = D_u ∇²u − uv² + F(1−u), ∂v/∂t = D_v ∇²v + uv² − (F+k)v. Reaksjonen u + 2v → 3v autokatalyserer v; matingen F fyller på u, og drepingen (F+k) fjerner v. Å sveipe F og k gjennom et lite rektangel av (F, k)-planet vandrer gjennom et helt bestiarium, først katalogisert av John Pearson i 1993: prikker, striper, labyrinter, korall, mitose, U-skate world, solitoner. Ett ligningspar, en hel dyrehage av oppførsler.",
    },
    {
      pretitle: "Avsnitt 05 · Biologi og videre",
      title: "Embryoer, fiskehud, snegleskall, sand",
      body: "Hans Meinhardt brukte tiår på å tilpasse reaksjons-diffusjonsmodeller til morfogenese — lemdannelse, blanervatur, snegleskallpigmentlinjer tegnet som en bølgefront langs en voksende kant. Kondo og Asai viste i 1995 at stripene på Pomacanthus-keiserfisk omorganiserer seg nøyaktig som en reaksjons-diffusjonsmodell forutsier når fisken vokser. Den samme matematikken beskriver sandkrusninger i grunt vann, tetthetsvariasjoner i konvektive væsker — og til og med det kosmiske galakse-nettet skissert av gravitasjonsinstabilitet i det tidlige universet.",
    },
    {
      pretitle: "Avsnitt 06 · Hva vi ennå ikke vet",
      title: "Åpne problemer og overraskende skalering",
      body: "Hvilke nøyaktige molekyler som spiller aktivator og inhibitor i pattedyrhud er fortsatt omdiskutert — kandidater er Wnt- og Notch-signalering — og hvordan systemet skalerer mønsteret med kroppsstørrelse forblir et mysterium: en mus og en elefant lager de samme mønstertypene i veldig forskjellige skalaer, selv om den underliggende kjemien skulle fiksere én absolutt bølgelengde. Matematisk er forbindelsen til amplitudeligninger og mønstervalg godt forstått; biologisk fordyper overraskelsen at «Turing hadde rett» seg, snarere enn at den lukker seg.",
    },
  ],
  grayScott: {
    caption: "Interaktivt · Gray-Scott reaksjon-diffusjon",
    feedLabel: "F · feed",
    killLabel: "k · kill",
    resetLabel: "Nullstill",
    pauseLabel: "Pause",
    playLabel: "Spill",
    presetLabel: "Pearson-forhåndsvalg",
    presetNames: { spots: "Prikker", stripes: "Striper", coral: "Korall", mitosis: "Mitose" },
    note: "Liten 120×100-rutenett, toroidal omslag, 30 deltrinn per ramme. Velg en Pearson-forhåndsvalg eller skyv F og k. Tips: små skritt teller — mesteparten av (F, k)-planet gir tomme felter; den interessante stripen er knivskarpt smal.",
    pretitle: "Interaktivt · vri på de to rattene",
    title: "Kjør modellen i nettleseren",
    body: "Se Gray-Scott reaksjon-diffusjon i sanntid på et lite rutenett. De fire forhåndsvalgene tilsvarer de kanoniske regimene Pearson navnga i 1993; skyvebryterne lar deg gli mellom dem. Dynamikken er følsom: en endring på 0,001 i F eller k kan ta deg fra leopardflekker til en labyrint av striper.",
  },
  gallery: {
    caption: "Interaktivt · Pearsons zoo",
    hint: "Fire regimer, fire fargekart. Hold over eller trykk på en celle for å lese hva den er. Hver celle er sin egen levende simulering.",
    pretitle: "Interaktivt · mønstergalleri",
    title: "Fire berømte Gray-Scott-regimer",
    body: "Fra ett enkelt ligningspar vokser et helt bestiarium. Disse fire cellene viser de kanoniske eksemplene: diskrete prikker, slyngende labyrinter, forgrenet korall og selvreplikerende mitose. De lever på små rutenett så de får plass på en mobil — men hver av dem regner de samme ligningene som Utforskeren.",
    regimes: [
      {
        id: "spots",
        label: "Prikker",
        F: 0.025,
        k: 0.06,
        body: "Runde, isolerte prikker — teksturen på en leopardpels eller et påfugleøye. Hver prikk gjerder inn en halo rundt seg; avstanden settes av hvor langt inhibitoren rekker før aktivatoren tar igjen.",
      },
      {
        id: "stripes",
        label: "Labyrint",
        F: 0.029,
        k: 0.057,
        body: "Slyngende labyrintstriper — Pearsons zeta-regime. Mønsteret har fortsatt en foretrukket bølgelengde, men systemet velger aldri mellom prikker og kontinuerlige bånd, og tegner i stedet lange, meandrerende rygger.",
      },
      {
        id: "coral",
        label: "Korall",
        F: 0.054,
        k: 0.063,
        body: "Forgrenede, voksende fronter — samme familie av strukturer som ekte korall vokser i, og som snegleskallpigmentering maler som en endimensjonal bølgefront over et todimensjonalt skall.",
      },
      {
        id: "mitosis",
        label: "Mitose",
        F: 0.0367,
        k: 0.0649,
        body: "Selvreplikerende prikker: hver flekk vokser, deler seg, og døtrene driver fra hverandre før de deler seg igjen. De samme ligningene som maler en leopard modellerer også et flis av spredende celler.",
      },
    ],
  },
  closingPretitle: "Gå videre",
  closingTitle: "Dyrk fram noen flekker.",
  closingBody:
    "Utforskeren gir deg hele 200×200-rutenettet, hver Pearson-forhåndsvalg, kontroll over diffusjonsforholdene D_u og D_v, flere paletter og friheten til å sakte ned simuleringen og se hvert trinn.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

function EncounterCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-200">{body}</p>
    </div>
  );
}

// Tiny illustrative SVG comparing leopard-style spots with zebra-style stripes.
function LeopardZebraGlyph() {
  return (
    <svg
      viewBox="0 0 240 110"
      className="mx-auto h-auto w-full max-w-[240px]"
      role="img"
      aria-label="Spots versus stripes"
    >
      <rect width="240" height="110" fill="#06070d" rx="10" />
      {/* leopard side */}
      <g>
        {[
          [20, 25, 7],
          [44, 38, 6],
          [30, 60, 8],
          [60, 70, 5],
          [22, 85, 6],
          [55, 18, 5],
          [78, 50, 7],
          [70, 90, 6],
          [95, 28, 5],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,209,102,0.85)" />
        ))}
      </g>
      {/* zebra side */}
      <g transform="translate(135 0)">
        {[15, 30, 45, 60, 75, 90].map((y) => (
          <path
            key={y}
            d={`M0 ${y} Q 25 ${y - 6} 50 ${y} T 100 ${y}`}
            stroke="rgba(125,243,255,0.85)"
            strokeWidth={4}
            fill="none"
          />
        ))}
      </g>
      <line
        x1="120"
        y1="8"
        x2="120"
        y2="102"
        stroke="rgba(232,234,242,0.18)"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export default function TuringPatternStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page = story.page;
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/turingpattern/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="∂u/∂t = D_u ∇²u + f(u, v)"
      formulaLatex={
        "\\dfrac{\\partial u}{\\partial t} = D_u \\nabla^2 u + f(u, v) \\qquad \\dfrac{\\partial v}{\\partial t} = D_v \\nabla^2 v + g(u, v)"
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
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              {i === 1 ? (
                <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                    {card.label}
                  </div>
                  <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
                  <div className="mt-4">
                    <LeopardZebraGlyph />
                  </div>
                </div>
              ) : (
                <EncounterCard label={card.label} title={card.title} body={card.body} />
              )}
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the equation */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — activator/inhibitor */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              activator · inhibitor
            </div>
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    substance
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    role
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] uppercase tracking-widest">
                    diffusion
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["u · activator", "Catalyses itself and produces the inhibitor.", "Slow (D_u)"],
                  ["v · inhibitor", "Suppresses the activator at distance.", "Fast (D_v ≫ D_u)"],
                ].map(([sub, role, diff]) => (
                  <tr key={sub} className="border-b border-ink-700/30 last:border-0">
                    <td className="px-2 py-2 text-signal-amber">{sub}</td>
                    <td className="px-2 py-2 text-ink-200">{role}</td>
                    <td className="px-2 py-2 text-signal-cyan">{diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — diffusion ratios */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              The Turing condition
            </div>
            <div className="math-italic text-3xl leading-snug text-ink-100 md:text-4xl">
              D_v / D_u ≫ 1
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              The inhibitor must outrun the activator. Equal diffusion gives a uniform smear; a
              strong ratio gives a sharp wavelength — the very scale of the spots.
            </p>
          </div>
        </Reveal>
      </section>

      {/* INTERACTIVE 1 · Gray-Scott mini-simulator */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.grayScott.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.grayScott.title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.grayScott.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <TuringGrayScott
            caption={story.grayScott.caption}
            feedLabel={story.grayScott.feedLabel}
            killLabel={story.grayScott.killLabel}
            resetLabel={story.grayScott.resetLabel}
            pauseLabel={story.grayScott.pauseLabel}
            playLabel={story.grayScott.playLabel}
            presetLabel={story.grayScott.presetLabel}
            presetNames={story.grayScott.presetNames}
            note={story.grayScott.note}
          />
        </Reveal>
      </section>

      {/* Section 04 — Gray-Scott model */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · Pattern gallery */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.gallery.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {story.gallery.title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.gallery.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <TuringGallery
            caption={story.gallery.caption}
            regimes={story.gallery.regimes}
            hint={story.gallery.hint}
          />
        </Reveal>
      </section>

      {/* Section 05 — biology and beyond */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — open questions */}
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
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/turingpattern/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
