"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { palette } from "@/lib/visual/palette";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { AizawaInlineMini } from "@/components/AizawaInlineMini";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-coral";

// -----------------------------------------------------------------------------
// Aizawa Attractor — rich, locale-aware story content. We author the hero
// metadata ourselves so each locale gets a tailored pretitle / tagline /
// intro, then inject `sections: []` into StoryPageShell (the long-form
// sections render as children below). Tone reference: a.topics.aizawa.
// -----------------------------------------------------------------------------

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
  miniCaption: string;
  miniHint: string;
  miniLabel: string;
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: {
    page: {
      pretitle: "Attractor · Aizawa family",
      title: "The Aizawa Attractor",
      tagline: "Lorenz's stranger, more ornate cousin",
      intro:
        "Three coupled equations, six dials, and a trajectory that folds itself into a basket-handled torus with a vertical spike through its heart. Aizawa lives in the same family as Lorenz and Rössler — but its geometry is uncannily sculptural, and a single parameter can melt it from basket to flower to chaos.",
      ctaInteractive: "Open the Explorer",
    },
    encounter: {
      pretitle: "First encounter",
      title: "A sculptural cousin in the chaos family",
      cards: [
        {
          label: "01 · The big idea",
          title: "Lorenz's stranger cousin",
          body: "Yoshisuke Aizawa and collaborators formulated this 3D system in the early 1980s; like Lorenz's butterfly it never settles and never repeats. But where Lorenz's attractor looks like two flat wings, Aizawa's looks like a torus threaded by a vertical spike — a geometry so distinctive it became a staple of strange-attractor galleries.",
        },
        {
          label: "02 · Concrete",
          title: "Three ODEs, a basket with a handle",
          body: "Pick the canonical parameters (a≈0.95, b≈0.7, c≈0.6, d≈3.5, e≈0.25, f≈0.1). Start anywhere. After a brief transient the orbit lies on a basket-handled torus pierced by a thin vertical column. Every visit traces a slightly different path along the basket's weave.",
        },
        {
          label: "03 · Why it matters",
          title: "A whole zoology of 3D chaos",
          body: "Aizawa is one point in a rich landscape of chaotic attractors — Rössler, Thomas, Halvorsen, Lorenz-84. Studying it teaches us what 3D chaos looks like geometrically, and how a small parameter change can rebuild an entire shape continuously.",
        },
      ],
      tryIt:
        "Drag the canvas to rotate. Pull the «b» slider — watch the basket close, breathe, and bloom.",
    },
    sections: [
      {
        pretitle: "Section one · The equations",
        title: "Three rates, six dials",
        body: "Each line says how fast one coordinate changes. The cross-terms (x·y, x²+y², z³, z·x³) are where the chaos lives — strip them and the system collapses to a damped spiral. Six parameters (a, b, c, d, e, f) give you a small kingdom of behaviours; the integrator step dt is a numerical knob, not a dynamical one.",
      },
      {
        pretitle: "Section two · Default geometry",
        title: "The basket-handled torus",
        body: "At the canonical values the attractor looks like a doughnut threaded onto a vertical needle — a torus with a basket-style weave around its body and a tall spike piercing its centre. The trajectory winds many times around the torus before slipping up the spike and coming back down.",
      },
      {
        pretitle: "Section three · Parameter sensitivity",
        title: "Turning one dial reshapes everything",
        body: "Slide «b» from 0.3 to 1.2 and the basket morphs continuously: ribbon, weave, bowl, vase, chaos. There is no clean phase diagram — instead the parameter space is a smooth atlas of shapes, each a slightly different equilibrium between stretching and folding.",
      },
      {
        pretitle: "Section four · The chaos zoo",
        title: "Aizawa among siblings",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — all are smooth 3D systems whose orbits fold onto fractal sets. Sprott's atlas catalogues hundreds. They share the same machinery: stretching that amplifies tiny differences, folding that keeps them bounded.",
      },
      {
        pretitle: "Section five · Lyapunov & dimension",
        title: "How fractal is a basket?",
        body: "The leading Lyapunov exponent is positive (reported numerical estimates sit around 0.1), meaning nearby trajectories separate exponentially — the signature of chaos. The Kaplan-Yorke conjecture turns the exponent spectrum into a fractal dimension; for Aizawa it lands just above 2 — barely thicker than a surface.",
      },
      {
        pretitle: "Section six · Why we care",
        title: "Visualisation, control, music",
        body: "Aizawa is a poster child for teaching 3D chaos — its shape reads at a glance. Control theorists use such systems as benchmarks for nonlinear stabilisation. And the trajectory's gentle, never-repeating undulations make beautiful raw material for procedural animation and analog-style music synthesis.",
      },
    ],
    closingTitle: "Spin the basket yourself",
    closingBody:
      "The Explorer integrates the equations live, lets you sweep all six parameters, and rotates the attractor freely in 3D. Switch between Aizawa, Rössler, Thomas, Halvorsen and Lorenz-84 to feel the whole family.",
    ctaLabel: "→ Open the Explorer",
    miniCaption: "Live · drag to rotate · vary b",
    miniHint:
      "Lower b thins the torus toward a ring; higher b puffs it into a fuller basket. The vertical spike persists across the whole range.",
    miniLabel: "b",
  },
  de: {
    page: {
      pretitle: "Attraktor · Aizawa-Familie",
      title: "Der Aizawa-Attraktor",
      tagline: "Lorenz' seltsamerer, ornamentalerer Cousin",
      intro:
        "Drei gekoppelte Gleichungen, sechs Regler und eine Bahn, die sich zu einem korbgeflochtenen Torus mit vertikaler Spitze durch sein Herz faltet. Aizawa gehört zur Familie von Lorenz und Rössler — aber seine Geometrie ist unheimlich skulptural, und ein einziger Parameter kann ihn von Korb zu Blume zu Chaos verwandeln.",
      ctaInteractive: "Explorer öffnen",
    },
    encounter: {
      pretitle: "Erste Begegnung",
      title: "Ein skulpturaler Cousin in der Chaos-Familie",
      cards: [
        {
          label: "01 · Die große Idee",
          title: "Lorenz' seltsamerer Cousin",
          body: "Yoshisuke Aizawa und Kolleg:innen formulierten dieses 3D-System in den frühen 1980er-Jahren; wie Lorenz' Schmetterling kommt es nie zur Ruhe und wiederholt sich nie. Doch wo Lorenz zwei flache Flügel zeigt, zeigt Aizawa einen Torus, von einer vertikalen Spitze durchstochen — eine Geometrie, die zu einem Klassiker der Attraktor-Galerien wurde.",
        },
        {
          label: "02 · Konkret",
          title: "Drei ODEs, ein Korb mit Henkel",
          body: "Nimm die kanonischen Parameter (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Starte irgendwo. Nach kurzer Einlaufzeit liegt die Bahn auf einem korbgeflochtenen Torus, durchstoßen von einer dünnen vertikalen Säule. Jeder Umlauf zeichnet einen leicht anderen Weg durchs Geflecht.",
        },
        {
          label: "03 · Warum es zählt",
          title: "Eine Zoologie des 3D-Chaos",
          body: "Aizawa ist ein Punkt in einer reichen Landschaft chaotischer Attraktoren — Rössler, Thomas, Halvorsen, Lorenz-84. Ihn zu studieren lehrt, wie 3D-Chaos geometrisch aussieht und wie eine kleine Parameteränderung eine ganze Form kontinuierlich umbaut.",
        },
      ],
      tryIt:
        "Ziehe die Leinwand zum Drehen. Bewege den «b»-Regler — sieh den Korb sich schließen, atmen und blühen.",
    },
    sections: [
      {
        pretitle: "Abschnitt eins · Die Gleichungen",
        title: "Drei Raten, sechs Regler",
        body: "Jede Zeile sagt, wie schnell sich eine Koordinate ändert. Die Mischterme (x·y, x²+y², z³, z·x³) sind, wo das Chaos lebt — entferne sie, und das System fällt zu einer gedämpften Spirale zusammen. Sechs Parameter (a, b, c, d, e, f) geben dir ein kleines Königreich von Verhalten; der Integrator-Schritt dt ist ein numerischer Knopf, kein dynamischer Parameter.",
      },
      {
        pretitle: "Abschnitt zwei · Standardgeometrie",
        title: "Der korbgeflochtene Torus",
        body: "Bei den kanonischen Werten sieht der Attraktor aus wie ein Donut, auf eine vertikale Nadel gezogen — ein Torus mit Korbgeflecht um den Körper und einer hohen Spitze, die sein Zentrum durchsticht. Die Bahn windet sich vielfach um den Torus, bevor sie an der Spitze hinauf und wieder herab schlüpft.",
      },
      {
        pretitle: "Abschnitt drei · Parameter-Empfindlichkeit",
        title: "Ein Regler formt alles um",
        body: "Schiebe «b» von 0,3 bis 1,2 und der Korb wandelt sich kontinuierlich: Band, Geflecht, Schale, Vase, Chaos. Es gibt kein sauberes Phasendiagramm — stattdessen ist der Parameterraum ein glatter Atlas von Formen, jede ein leicht anderes Gleichgewicht zwischen Strecken und Falten.",
      },
      {
        pretitle: "Abschnitt vier · Der Chaos-Zoo",
        title: "Aizawa unter Geschwistern",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — alles glatte 3D-Systeme, deren Bahnen sich auf fraktale Mengen falten. Sprotts Atlas katalogisiert Hunderte. Sie teilen dieselbe Mechanik: Strecken, das winzige Differenzen verstärkt, Falten, das sie eingegrenzt hält.",
      },
      {
        pretitle: "Abschnitt fünf · Lyapunov & Dimension",
        title: "Wie fraktal ist ein Korb?",
        body: "Der größte Lyapunov-Exponent ist positiv (numerische Schätzungen liegen um 0,1), was bedeutet, dass nahe Bahnen exponentiell auseinanderlaufen — die Signatur des Chaos. Die Kaplan-Yorke-Vermutung verwandelt das Exponentenspektrum in eine fraktale Dimension; für Aizawa landet sie knapp über 2 — gerade etwas dicker als eine Fläche.",
      },
      {
        pretitle: "Abschnitt sechs · Warum es zählt",
        title: "Visualisierung, Regelung, Musik",
        body: "Aizawa ist ein Aushängeschild zum Vermitteln von 3D-Chaos — die Form spricht auf einen Blick. Regelungstheoretiker nutzen solche Systeme als Maßstäbe nichtlinearer Stabilisierung. Und die sanften, nie wiederkehrenden Wellen der Bahn liefern schönes Material für prozedurale Animation und analogartige Klangsynthese.",
      },
    ],
    closingTitle: "Dreh den Korb selbst",
    closingBody:
      "Der Explorer integriert die Gleichungen live, lässt dich alle sechs Parameter durchstreichen und den Attraktor frei in 3D drehen. Wechsle zwischen Aizawa, Rössler, Thomas, Halvorsen und Lorenz-84, um die ganze Familie zu spüren.",
    ctaLabel: "→ Explorer öffnen",
    miniCaption: "Live · zum Drehen ziehen · b variieren",
    miniHint:
      "Kleineres b verdünnt den Torus zu einem Ring; größeres b bläht ihn zu einem volleren Korb. Die vertikale Spitze bleibt über den gesamten Bereich.",
    miniLabel: "b",
  },
  es: {
    page: {
      pretitle: "Atractor · familia Aizawa",
      title: "El atractor de Aizawa",
      tagline: "El primo más extraño y ornamental de Lorenz",
      intro:
        "Tres ecuaciones acopladas, seis diales y una trayectoria que se pliega en un toro tejido como cesta atravesado por una espiga vertical en su corazón. Aizawa vive en la misma familia que Lorenz y Rössler — pero su geometría es asombrosamente escultórica, y un solo parámetro puede transformarlo de cesta a flor a caos.",
      ctaInteractive: "Abrir el Explorer",
    },
    encounter: {
      pretitle: "Primer encuentro",
      title: "Un primo escultórico en la familia del caos",
      cards: [
        {
          label: "01 · La gran idea",
          title: "El primo más extraño de Lorenz",
          body: "Yoshisuke Aizawa y colaboradores formularon este sistema 3D a principios de los años 1980; como la mariposa de Lorenz, nunca se asienta y nunca se repite. Pero donde el atractor de Lorenz tiene dos alas planas, el de Aizawa parece un toro atravesado por una espiga vertical — una geometría tan distintiva que se volvió un clásico en galerías de atractores extraños.",
        },
        {
          label: "02 · Concreto",
          title: "Tres EDOs, una cesta con asa",
          body: "Toma los parámetros canónicos (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Empieza en cualquier punto. Tras un transitorio breve la órbita yace en un toro tejido como cesta atravesado por una columna vertical fina. Cada visita traza un camino ligeramente distinto por la trama.",
        },
        {
          label: "03 · Por qué importa",
          title: "Toda una zoología del caos 3D",
          body: "Aizawa es un punto en un rico paisaje de atractores caóticos — Rössler, Thomas, Halvorsen, Lorenz-84. Estudiarlo enseña cómo se ve el caos 3D geométricamente y cómo un pequeño cambio de parámetro puede reconstruir una forma entera de forma continua.",
        },
      ],
      tryIt:
        "Arrastra el lienzo para girar. Mueve el control «b» — observa cómo la cesta se cierra, respira y florece.",
    },
    sections: [
      {
        pretitle: "Sección uno · Las ecuaciones",
        title: "Tres tasas, seis diales",
        body: "Cada línea dice a qué velocidad cambia una coordenada. Los términos cruzados (x·y, x²+y², z³, z·x³) son donde vive el caos — quítalos y el sistema cae a una espiral amortiguada. Seis parámetros (a, b, c, d, e, f) te dan un pequeño reino de comportamientos; el paso dt del integrador es un mando numérico, no un parámetro dinámico.",
      },
      {
        pretitle: "Sección dos · Geometría por defecto",
        title: "El toro tejido como cesta",
        body: "En los valores canónicos el atractor parece un donut ensartado en una aguja vertical — un toro con trama de cesta alrededor del cuerpo y una espiga alta atravesando su centro. La trayectoria da muchas vueltas al toro antes de deslizarse por la espiga y volver a bajar.",
      },
      {
        pretitle: "Sección tres · Sensibilidad a parámetros",
        title: "Girar un dial lo reforma todo",
        body: "Desliza «b» de 0,3 a 1,2 y la cesta se transforma de forma continua: cinta, trama, cuenco, jarrón, caos. No hay un diagrama de fase limpio — el espacio de parámetros es un atlas suave de formas, cada una un equilibrio ligeramente distinto entre estirar y plegar.",
      },
      {
        pretitle: "Sección cuatro · El zoo del caos",
        title: "Aizawa entre hermanos",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — todos sistemas 3D suaves cuyas órbitas se pliegan en conjuntos fractales. El atlas de Sprott cataloga cientos. Comparten la misma maquinaria: estiramiento que amplifica diferencias minúsculas, plegado que las mantiene acotadas.",
      },
      {
        pretitle: "Sección cinco · Lyapunov y dimensión",
        title: "¿Cuán fractal es una cesta?",
        body: "El exponente de Lyapunov dominante es positivo (las estimaciones numéricas rondan 0,1), lo que significa que trayectorias cercanas se separan exponencialmente — la firma del caos. La conjetura de Kaplan-Yorke convierte el espectro de exponentes en una dimensión fractal; para Aizawa cae apenas por encima de 2 — apenas más gruesa que una superficie.",
      },
      {
        pretitle: "Sección seis · Por qué importa",
        title: "Visualización, control, música",
        body: "Aizawa es un emblema para enseñar caos 3D — su forma se lee de un vistazo. Los teóricos del control usan tales sistemas como referencia para la estabilización no lineal. Y las ondulaciones suaves y no repetitivas de la trayectoria son materia hermosa para animación procedural y síntesis sonora estilo analógico.",
      },
    ],
    closingTitle: "Gira la cesta tú mismo",
    closingBody:
      "El Explorer integra las ecuaciones en vivo, te deja barrer los seis parámetros y rotar el atractor libremente en 3D. Cambia entre Aizawa, Rössler, Thomas, Halvorsen y Lorenz-84 para sentir a toda la familia.",
    ctaLabel: "→ Abrir el Explorer",
    miniCaption: "En vivo · arrastra para girar · varía b",
    miniHint:
      "Una b menor adelgaza el toro hacia un anillo; una mayor lo hincha en una cesta más llena. La espiga vertical persiste en todo el rango.",
    miniLabel: "b",
  },
  fr: {
    page: {
      pretitle: "Attracteur · famille Aizawa",
      title: "L'attracteur d'Aizawa",
      tagline: "Le cousin plus étrange et ornemental de Lorenz",
      intro:
        "Trois équations couplées, six molettes et une trajectoire qui se replie en un tore tressé comme un panier traversé par une pointe verticale en son cœur. Aizawa vit dans la même famille que Lorenz et Rössler — mais sa géométrie est étrangement sculpturale, et un seul paramètre peut le faire fondre du panier à la fleur au chaos.",
      ctaInteractive: "Ouvrir l'Explorer",
    },
    encounter: {
      pretitle: "Première rencontre",
      title: "Un cousin sculptural dans la famille du chaos",
      cards: [
        {
          label: "01 · La grande idée",
          title: "Le cousin plus étrange de Lorenz",
          body: "Yoshisuke Aizawa et ses collaborateurs ont formulé ce système 3D au début des années 1980 ; comme le papillon de Lorenz, il ne se pose jamais et ne se répète jamais. Mais là où l'attracteur de Lorenz a deux ailes plates, celui d'Aizawa ressemble à un tore traversé par une pointe verticale — une géométrie si distinctive qu'elle est devenue un classique des galeries d'attracteurs étranges.",
        },
        {
          label: "02 · Concret",
          title: "Trois EDO, un panier à anse",
          body: "Prends les paramètres canoniques (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Démarre n'importe où. Après un bref transitoire, l'orbite repose sur un tore tressé comme un panier traversé par une fine colonne verticale. Chaque passage trace un chemin légèrement différent dans le tressage.",
        },
        {
          label: "03 · Pourquoi ça compte",
          title: "Toute une zoologie du chaos 3D",
          body: "Aizawa est un point dans un riche paysage d'attracteurs chaotiques — Rössler, Thomas, Halvorsen, Lorenz-84. L'étudier apprend à voir le chaos 3D géométriquement et comment un petit changement de paramètre peut reconstruire une forme entière en continu.",
        },
      ],
      tryIt:
        "Fais glisser le canevas pour tourner. Bouge le curseur «b» — regarde le panier se fermer, respirer et fleurir.",
    },
    sections: [
      {
        pretitle: "Section un · Les équations",
        title: "Trois taux, six molettes",
        body: "Chaque ligne dit à quelle vitesse une coordonnée change. Les termes croisés (x·y, x²+y², z³, z·x³) sont là où vit le chaos — enlève-les et le système retombe en spirale amortie. Six paramètres (a, b, c, d, e, f) te donnent un petit royaume de comportements ; le pas dt de l'intégrateur est un bouton numérique, pas un paramètre dynamique.",
      },
      {
        pretitle: "Section deux · Géométrie par défaut",
        title: "Le tore tressé en panier",
        body: "Aux valeurs canoniques, l'attracteur ressemble à un beignet enfilé sur une aiguille verticale — un tore au tressage de panier autour du corps et une haute pointe perçant son centre. La trajectoire fait de nombreux tours autour du tore avant de remonter le long de la pointe et de redescendre.",
      },
      {
        pretitle: "Section trois · Sensibilité aux paramètres",
        title: "Tourner une molette refond tout",
        body: "Glisse «b» de 0,3 à 1,2 et le panier se transforme en continu : ruban, tressage, bol, vase, chaos. Pas de diagramme de phase propre — l'espace des paramètres est un atlas lisse de formes, chacune un équilibre légèrement différent entre étirement et pliage.",
      },
      {
        pretitle: "Section quatre · Le zoo du chaos",
        title: "Aizawa parmi les frères",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — tous des systèmes 3D lisses dont les orbites se replient sur des ensembles fractals. L'atlas de Sprott en catalogue des centaines. Ils partagent la même mécanique : un étirement qui amplifie les minuscules différences, un pliage qui les garde bornées.",
      },
      {
        pretitle: "Section cinq · Lyapunov & dimension",
        title: "Un panier, est-ce fractal ?",
        body: "L'exposant de Lyapunov dominant est positif (les estimations numériques tournent autour de 0,1), c'est-à-dire que les trajectoires voisines se séparent exponentiellement — la signature du chaos. La conjecture de Kaplan-Yorke convertit le spectre des exposants en dimension fractale ; pour Aizawa elle tombe juste au-dessus de 2 — à peine plus épaisse qu'une surface.",
      },
      {
        pretitle: "Section six · Pourquoi ça compte",
        title: "Visualisation, contrôle, musique",
        body: "Aizawa est un emblème pour enseigner le chaos 3D — sa forme se lit d'un coup. Les théoriciens du contrôle utilisent ces systèmes comme bancs d'essai pour la stabilisation non linéaire. Et les ondulations douces et jamais répétitives de la trajectoire font une belle matière première pour l'animation procédurale et la synthèse sonore analogique.",
      },
    ],
    closingTitle: "Fais tourner le panier toi-même",
    closingBody:
      "L'Explorer intègre les équations en direct, te laisse balayer les six paramètres et fait tourner librement l'attracteur en 3D. Passe d'Aizawa à Rössler, Thomas, Halvorsen, Lorenz-84 pour sentir toute la famille.",
    ctaLabel: "→ Ouvrir l'Explorer",
    miniCaption: "En direct · glisse pour tourner · varie b",
    miniHint:
      "Un b plus petit amincit le tore en anneau ; plus grand, il le gonfle en panier plus plein. La pointe verticale persiste sur toute la plage.",
    miniLabel: "b",
  },
  it: {
    page: {
      pretitle: "Attrattore · famiglia Aizawa",
      title: "L'attrattore di Aizawa",
      tagline: "Il cugino più strano e ornamentale di Lorenz",
      intro:
        "Tre equazioni accoppiate, sei manopole e una traiettoria che si piega in un toro intrecciato a cestino attraversato da una punta verticale nel suo cuore. Aizawa vive nella stessa famiglia di Lorenz e Rössler — ma la sua geometria è straordinariamente scultorea, e un solo parametro può farlo passare da cesto a fiore a caos.",
      ctaInteractive: "Apri l'Explorer",
    },
    encounter: {
      pretitle: "Primo incontro",
      title: "Un cugino scultoreo nella famiglia del caos",
      cards: [
        {
          label: "01 · La grande idea",
          title: "Il cugino più strano di Lorenz",
          body: "Yoshisuke Aizawa e collaboratori formularono questo sistema 3D nei primi anni 1980; come la farfalla di Lorenz, non si stabilizza mai e non si ripete mai. Ma dove l'attrattore di Lorenz mostra due ali piatte, quello di Aizawa sembra un toro infilato da una punta verticale — una geometria così distintiva da diventare un classico delle gallerie di attrattori strani.",
        },
        {
          label: "02 · Concreto",
          title: "Tre EDO, un cesto con manico",
          body: "Prendi i parametri canonici (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Parti da un punto qualsiasi. Dopo un breve transitorio l'orbita giace su un toro intrecciato a cesto attraversato da una sottile colonna verticale. Ogni passaggio traccia una via leggermente diversa nell'intreccio.",
        },
        {
          label: "03 · Perché conta",
          title: "Un'intera zoologia del caos 3D",
          body: "Aizawa è un punto in un ricco paesaggio di attrattori caotici — Rössler, Thomas, Halvorsen, Lorenz-84. Studiarlo insegna come si presenta geometricamente il caos 3D e come una piccola variazione di parametro possa ricostruire una forma intera in modo continuo.",
        },
      ],
      tryIt:
        "Trascina la tela per ruotare. Muovi il cursore «b» — guarda il cesto chiudersi, respirare e fiorire.",
    },
    sections: [
      {
        pretitle: "Sezione uno · Le equazioni",
        title: "Tre tassi, sei manopole",
        body: "Ogni riga dice a quale velocità cambia una coordinata. I termini incrociati (x·y, x²+y², z³, z·x³) sono dove vive il caos — toglili e il sistema collassa in una spirale smorzata. Sei parametri (a, b, c, d, e, f) ti danno un piccolo regno di comportamenti; il passo dt dell'integratore è una manopola numerica, non un parametro dinamico.",
      },
      {
        pretitle: "Sezione due · Geometria di default",
        title: "Il toro intrecciato a cesto",
        body: "Ai valori canonici l'attrattore sembra una ciambella infilata su un ago verticale — un toro con intreccio a cesto attorno al corpo e una punta alta che ne perfora il centro. La traiettoria si avvolge molte volte attorno al toro prima di risalire lungo la punta e ridiscendere.",
      },
      {
        pretitle: "Sezione tre · Sensibilità ai parametri",
        title: "Una manopola rimodella tutto",
        body: "Scorri «b» da 0,3 a 1,2 e il cesto si trasforma con continuità: nastro, intreccio, ciotola, vaso, caos. Non c'è un diagramma di fase pulito — lo spazio dei parametri è un atlante liscio di forme, ciascuna un equilibrio leggermente diverso tra stiramento e ripiegamento.",
      },
      {
        pretitle: "Sezione quattro · Lo zoo del caos",
        title: "Aizawa fra i fratelli",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — tutti sistemi 3D lisci le cui orbite si piegano su insiemi frattali. L'atlante di Sprott ne cataloga centinaia. Condividono la stessa meccanica: stiramento che amplifica differenze minuscole, ripiegamento che le mantiene limitate.",
      },
      {
        pretitle: "Sezione cinque · Lyapunov e dimensione",
        title: "Quanto è frattale un cesto?",
        body: "L'esponente di Lyapunov dominante è positivo (le stime numeriche si aggirano intorno a 0,1), cioè le traiettorie vicine si separano esponenzialmente — la firma del caos. La congettura di Kaplan-Yorke trasforma lo spettro degli esponenti in una dimensione frattale; per Aizawa cade appena sopra 2 — appena più spessa di una superficie.",
      },
      {
        pretitle: "Sezione sei · Perché conta",
        title: "Visualizzazione, controllo, musica",
        body: "Aizawa è un'icona per insegnare il caos 3D — la forma si legge a colpo d'occhio. I teorici del controllo usano questi sistemi come banchi di prova per la stabilizzazione non lineare. E le ondulazioni morbide e mai ripetitive della traiettoria sono splendida materia per animazione procedurale e sintesi sonora in stile analogico.",
      },
    ],
    closingTitle: "Fai ruotare il cesto tu",
    closingBody:
      "L'Explorer integra le equazioni in tempo reale, ti lascia scorrere tutti i sei parametri e ruota liberamente l'attrattore in 3D. Passa fra Aizawa, Rössler, Thomas, Halvorsen e Lorenz-84 per sentire l'intera famiglia.",
    ctaLabel: "→ Apri l'Explorer",
    miniCaption: "Live · trascina per ruotare · varia b",
    miniHint:
      "Un b minore assottiglia il toro fino a un anello; uno maggiore lo gonfia in un cesto più pieno. La punta verticale persiste su tutto il range.",
    miniLabel: "b",
  },
  pt: {
    page: {
      pretitle: "Atrator · família Aizawa",
      title: "O atrator de Aizawa",
      tagline: "O primo mais estranho e ornamental de Lorenz",
      intro:
        "Três equações acopladas, seis botões e uma trajetória que se dobra num toro trançado como cesto atravessado por uma espiga vertical em seu coração. Aizawa vive na mesma família de Lorenz e Rössler — mas sua geometria é assombrosamente escultural, e um único parâmetro pode transformá-lo de cesto a flor a caos.",
      ctaInteractive: "Abrir o Explorer",
    },
    encounter: {
      pretitle: "Primeiro encontro",
      title: "Um primo escultural na família do caos",
      cards: [
        {
          label: "01 · A grande ideia",
          title: "O primo mais estranho de Lorenz",
          body: "Yoshisuke Aizawa e colaboradores formularam este sistema 3D no início dos anos 1980; como a borboleta de Lorenz, nunca se acomoda e nunca se repete. Mas onde o atrator de Lorenz mostra duas asas planas, o de Aizawa parece um toro atravessado por uma espiga vertical — uma geometria tão distintiva que se tornou clássica em galerias de atratores estranhos.",
        },
        {
          label: "02 · Concreto",
          title: "Três EDOs, um cesto com alça",
          body: "Tome os parâmetros canônicos (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Comece em qualquer ponto. Após um transiente breve a órbita reside num toro trançado como cesto atravessado por uma coluna vertical fina. Cada passagem traça um caminho ligeiramente diferente pela trama.",
        },
        {
          label: "03 · Por que importa",
          title: "Uma zoologia inteira do caos 3D",
          body: "Aizawa é um ponto numa paisagem rica de atratores caóticos — Rössler, Thomas, Halvorsen, Lorenz-84. Estudá-lo ensina como o caos 3D parece geometricamente e como uma pequena mudança de parâmetro pode reconstruir uma forma inteira de modo contínuo.",
        },
      ],
      tryIt:
        "Arraste a tela para girar. Mova o controle «b» — veja o cesto fechar, respirar e florescer.",
    },
    sections: [
      {
        pretitle: "Seção um · As equações",
        title: "Três taxas, seis botões",
        body: "Cada linha diz a que velocidade uma coordenada muda. Os termos cruzados (x·y, x²+y², z³, z·x³) são onde o caos vive — remova-os e o sistema colapsa numa espiral amortecida. Seis parâmetros (a, b, c, d, e, f) dão um pequeno reino de comportamentos; o passo dt do integrador é um botão numérico, não um parâmetro dinâmico.",
      },
      {
        pretitle: "Seção dois · Geometria padrão",
        title: "O toro trançado como cesto",
        body: "Nos valores canônicos o atrator parece um donut enfiado numa agulha vertical — um toro com trama de cesto ao redor do corpo e uma espiga alta perfurando seu centro. A trajetória dá muitas voltas em torno do toro antes de subir pela espiga e descer de novo.",
      },
      {
        pretitle: "Seção três · Sensibilidade a parâmetros",
        title: "Um botão remodela tudo",
        body: "Deslize «b» de 0,3 a 1,2 e o cesto se transforma continuamente: fita, trama, tigela, vaso, caos. Não há diagrama de fase limpo — o espaço de parâmetros é um atlas liso de formas, cada uma um equilíbrio ligeiramente diferente entre esticar e dobrar.",
      },
      {
        pretitle: "Seção quatro · O zoológico do caos",
        title: "Aizawa entre irmãos",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — todos sistemas 3D suaves cujas órbitas se dobram em conjuntos fractais. O atlas de Sprott cataloga centenas. Compartilham a mesma maquinaria: estiramento que amplifica diferenças minúsculas, dobramento que as mantém limitadas.",
      },
      {
        pretitle: "Seção cinco · Lyapunov e dimensão",
        title: "Quão fractal é um cesto?",
        body: "O expoente de Lyapunov dominante é positivo (estimativas numéricas ficam em torno de 0,1), ou seja, trajetórias próximas se separam exponencialmente — a assinatura do caos. A conjectura de Kaplan-Yorke converte o espectro de expoentes em dimensão fractal; para Aizawa ela cai apenas acima de 2 — apenas um pouco mais espessa que uma superfície.",
      },
      {
        pretitle: "Seção seis · Por que importa",
        title: "Visualização, controle, música",
        body: "Aizawa é um cartão-postal para ensinar caos 3D — sua forma se lê de relance. Teóricos de controle usam tais sistemas como referências para estabilização não linear. E as ondulações suaves e nunca repetitivas da trajetória são bela matéria-prima para animação procedural e síntese sonora em estilo analógico.",
      },
    ],
    closingTitle: "Gire o cesto você mesmo",
    closingBody:
      "O Explorer integra as equações ao vivo, deixa você varrer todos os seis parâmetros e gira o atrator livremente em 3D. Alterne entre Aizawa, Rössler, Thomas, Halvorsen e Lorenz-84 para sentir a família inteira.",
    ctaLabel: "→ Abrir o Explorer",
    miniCaption: "Ao vivo · arraste para girar · varie b",
    miniHint:
      "Um b menor afina o toro até um anel; um maior o infla num cesto mais cheio. A espiga vertical persiste em toda a faixa.",
    miniLabel: "b",
  },
  sv: {
    page: {
      pretitle: "Attraktor · Aizawa-familjen",
      title: "Aizawa-attraktorn",
      tagline: "Lorenz mer sällsamma och prydligare kusin",
      intro:
        "Tre kopplade ekvationer, sex rattar och en bana som viker sig till en korgflätad torus med en lodrät spets genom hjärtat. Aizawa hör till samma familj som Lorenz och Rössler — men dess geometri är kusligt skulptural, och en enda parameter kan smälta den från korg till blomma till kaos.",
      ctaInteractive: "Öppna Explorer",
    },
    encounter: {
      pretitle: "Första mötet",
      title: "En skulptural kusin i kaosfamiljen",
      cards: [
        {
          label: "01 · Den stora idén",
          title: "Lorenz mer sällsamma kusin",
          body: "Yoshisuke Aizawa och medarbetare formulerade detta 3D-system i början av 1980-talet; likt Lorenz fjäril lägger det sig aldrig till ro och upprepar sig aldrig. Men där Lorenz attraktor har två platta vingar liknar Aizawas en torus trädd på en lodrät spets — en geometri så distinkt att den blev en klassiker i attraktorgallerier.",
        },
        {
          label: "02 · Konkret",
          title: "Tre ODE:er, en korg med handtag",
          body: "Ta de kanoniska parametrarna (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Starta var som helst. Efter en kort transient ligger banan på en korgflätad torus genomborrad av en tunn lodrät pelare. Varje varv ritar en något annan väg genom flätningen.",
        },
        {
          label: "03 · Varför det spelar roll",
          title: "En hel zoologi av 3D-kaos",
          body: "Aizawa är en punkt i ett rikt landskap av kaotiska attraktorer — Rössler, Thomas, Halvorsen, Lorenz-84. Att studera den lär dig hur 3D-kaos ser ut geometriskt och hur en liten parameterändring kan bygga om en hel form kontinuerligt.",
        },
      ],
      tryIt:
        "Dra duken för att rotera. Skjut reglaget «b» — se korgen sluta sig, andas och blomma.",
    },
    sections: [
      {
        pretitle: "Avsnitt ett · Ekvationerna",
        title: "Tre takter, sex rattar",
        body: "Varje rad säger hur snabbt en koordinat ändras. Korstermerna (x·y, x²+y², z³, z·x³) är där kaoset bor — ta bort dem och systemet faller till en dämpad spiral. Sex parametrar (a, b, c, d, e, f) ger dig ett litet kungarike av beteenden; integratorns steg dt är en numerisk ratt, inte en dynamisk parameter.",
      },
      {
        pretitle: "Avsnitt två · Standardgeometri",
        title: "Den korgflätade torusen",
        body: "Vid de kanoniska värdena ser attraktorn ut som en munk trädd på en lodrät nål — en torus med korgflätning runt kroppen och en hög spets som genomborrar mitten. Banan virar sig många gånger runt torusen innan den glider upp längs spetsen och kommer ner igen.",
      },
      {
        pretitle: "Avsnitt tre · Parameterkänslighet",
        title: "En ratt formar om allt",
        body: "Dra «b» från 0,3 till 1,2 och korgen förvandlas kontinuerligt: band, flätning, skål, vas, kaos. Inget rent fasdiagram — parameterrummet är en jämn atlas av former, var och en en något annan balans mellan sträckning och vikning.",
      },
      {
        pretitle: "Avsnitt fyra · Kaoszoo",
        title: "Aizawa bland syskon",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — alla släta 3D-system vars banor viks på fraktala mängder. Sprotts atlas katalogiserar hundratals. De delar samma mekanik: sträckning som förstärker små skillnader, vikning som håller dem begränsade.",
      },
      {
        pretitle: "Avsnitt fem · Lyapunov & dimension",
        title: "Hur fraktal är en korg?",
        body: "Den ledande Lyapunov-exponenten är positiv (numeriska skattningar ligger runt 0,1), vilket betyder att närliggande banor separeras exponentiellt — kaosets signatur. Kaplan-Yorke-förmodan översätter exponentspektrumet till en fraktal dimension; för Aizawa hamnar den knappt över 2 — knappt tjockare än en yta.",
      },
      {
        pretitle: "Avsnitt sex · Varför det spelar roll",
        title: "Visualisering, reglering, musik",
        body: "Aizawa är ett emblem för att lära ut 3D-kaos — formen läses av med en blick. Reglerteoretiker använder sådana system som riktmärken för icke-linjär stabilisering. Och banans mjuka, aldrig återkommande dyningar är vacker råvara för procedurell animation och analoglik ljudsyntes.",
      },
    ],
    closingTitle: "Snurra korgen själv",
    closingBody:
      "Explorern integrerar ekvationerna live, låter dig svepa över alla sex parametrarna och roterar attraktorn fritt i 3D. Växla mellan Aizawa, Rössler, Thomas, Halvorsen och Lorenz-84 för att känna hela familjen.",
    ctaLabel: "→ Öppna Explorer",
    miniCaption: "Live · dra för att rotera · variera b",
    miniHint:
      "Lägre b drar ihop torusen mot en ring; högre b puffar ut den till en fylligare korg. Den lodräta spetsen finns kvar i hela intervallet.",
    miniLabel: "b",
  },
  no: {
    page: {
      pretitle: "Attraktor · Aizawa-familien",
      title: "Aizawa-attraktoren",
      tagline: "Lorenz' selsommere og mer ornamentale fetter",
      intro:
        "Tre koblede ligninger, seks rattenheter og en bane som folder seg til en kurvflettet torus med en loddrett spiss gjennom hjertet. Aizawa hører til samme familie som Lorenz og Rössler — men geometrien er underlig skulpturell, og en enkelt parameter kan smelte den fra kurv til blomst til kaos.",
      ctaInteractive: "Åpne Explorer",
    },
    encounter: {
      pretitle: "Første møte",
      title: "En skulpturell fetter i kaosfamilien",
      cards: [
        {
          label: "01 · Den store idéen",
          title: "Lorenz' selsommere fetter",
          body: "Yoshisuke Aizawa og medarbeidere formulerte dette 3D-systemet på begynnelsen av 1980-tallet; lik Lorenz-sommerfuglen faller det aldri til ro og gjentar seg aldri. Men der Lorenz-attraktoren har to flate vinger, ligner Aizawas en torus tredd på en loddrett spiss — en geometri så distinkt at den ble en klassiker i attraktorgallerier.",
        },
        {
          label: "02 · Konkret",
          title: "Tre ODE-er, en kurv med hank",
          body: "Ta de kanoniske parameterne (a≈0,95, b≈0,7, c≈0,6, d≈3,5, e≈0,25, f≈0,1). Start hvor som helst. Etter en kort transient ligger banen på en kurvflettet torus gjennomboret av en tynn loddrett søyle. Hvert besøk tegner en litt annen vei gjennom flettverket.",
        },
        {
          label: "03 · Hvorfor det betyr noe",
          title: "En hel zoologi av 3D-kaos",
          body: "Aizawa er ett punkt i et rikt landskap av kaotiske attraktorer — Rössler, Thomas, Halvorsen, Lorenz-84. Å studere den lærer hvordan 3D-kaos ser ut geometrisk, og hvordan en liten parameterendring kan bygge om en hel form kontinuerlig.",
        },
      ],
      tryIt:
        "Dra lerretet for å rotere. Skyv «b»-glidebryteren — se kurven lukke seg, puste og blomstre.",
    },
    sections: [
      {
        pretitle: "Del én · Ligningene",
        title: "Tre rater, seks rattenheter",
        body: "Hver linje sier hvor raskt en koordinat endrer seg. Kryssleddene (x·y, x²+y², z³, z·x³) er der kaoset bor — fjern dem og systemet faller til en dempet spiral. Seks parametere (a, b, c, d, e, f) gir deg et lite kongerike av oppførsel; integratorens skritt dt er en numerisk ratt, ikke en dynamisk parameter.",
      },
      {
        pretitle: "Del to · Standardgeometri",
        title: "Den kurvflettede torusen",
        body: "Ved de kanoniske verdiene ser attraktoren ut som en smultring tredd på en loddrett nål — en torus med kurvfletting rundt kroppen og en høy spiss som perforerer midten. Banen vikler seg mange ganger rundt torusen før den glir opp langs spissen og kommer ned igjen.",
      },
      {
        pretitle: "Del tre · Parameterfølsomhet",
        title: "Én ratt former om alt",
        body: "Skyv «b» fra 0,3 til 1,2 og kurven forvandler seg kontinuerlig: bånd, fletting, skål, vase, kaos. Det finnes ikke noe rent fasediagram — parameterrommet er et jevnt atlas av former, hver en litt annen balanse mellom strekking og folding.",
      },
      {
        pretitle: "Del fire · Kaoszooen",
        title: "Aizawa blant søsken",
        body: "Lorenz (1963), Rössler (1976), Aizawa (1982), Thomas, Halvorsen, Lorenz-84 — alle glatte 3D-systemer hvis baner folder seg på fraktale mengder. Sprotts atlas katalogiserer hundrevis. De deler samme maskineri: strekking som forsterker bittesmå forskjeller, folding som holder dem begrensede.",
      },
      {
        pretitle: "Del fem · Lyapunov & dimensjon",
        title: "Hvor fraktal er en kurv?",
        body: "Den ledende Lyapunov-eksponenten er positiv (numeriske anslag ligger rundt 0,1), det vil si at nære baner skilles eksponentielt — kaosets signatur. Kaplan-Yorke-formodningen oversetter eksponentspekteret til en fraktal dimensjon; for Aizawa havner den så vidt over 2 — så vidt tykkere enn en flate.",
      },
      {
        pretitle: "Del seks · Hvorfor det betyr noe",
        title: "Visualisering, regulering, musikk",
        body: "Aizawa er et emblem for å lære bort 3D-kaos — formen leses av med ett blikk. Reguleringsteoretikere bruker slike systemer som referansebenker for ikke-lineær stabilisering. Og banens myke, aldri gjentakende dønninger er vakkert råstoff for prosedyreanimasjon og analoglignende lydsyntese.",
      },
    ],
    closingTitle: "Snurr kurven selv",
    closingBody:
      "Explorer integrerer ligningene live, lar deg sveipe alle seks parametrene og roterer attraktoren fritt i 3D. Veksle mellom Aizawa, Rössler, Thomas, Halvorsen og Lorenz-84 for å kjenne hele familien.",
    ctaLabel: "→ Åpne Explorer",
    miniCaption: "Live · dra for å rotere · varier b",
    miniHint:
      "Lavere b tynner torusen mot en ring; høyere b puffer den ut til en fyldigere kurv. Den loddrette spissen vedvarer over hele området.",
    miniLabel: "b",
  },
};

export default function AizawaStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/aizawa/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="ẋ=(z−b)x−dy · ẏ=dx+(z−b)y · ż=c+az−z³/3−(x²+y²)(1+ez)+fzx³"
      formulaLatex={
        "\\begin{aligned} \\dot{x} &= (z - b)x - dy \\\\ \\dot{y} &= dx + (z - b)y \\\\ \\dot{z} &= c + az - z^3/3 - (x^2 + y^2)(1 + ez) + fzx^3 \\end{aligned}"
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
      </section>

      {/* Section 1 — Equations + parameter table */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[0]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Aizawa 1982 · canonical dials
            </div>
            <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-4 font-mono text-sm leading-relaxed text-ink-100 md:text-base">
              {`  dx/dt = (z − b) x − d y
  dy/dt = d x + (z − b) y
  dz/dt = c + a z − z³/3 − (x² + y²)(1 + e z) + f z x³`}
            </pre>
            <div className="grid grid-cols-3 gap-3 pt-1 md:grid-cols-6">
              {[
                ["a", "0.95"],
                ["b", "0.70"],
                ["c", "0.60"],
                ["d", "3.50"],
                ["e", "0.25"],
                ["f", "0.10"],
              ].map(([k, v]) => (
                <Param key={k} label={k} value={v} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 2 — Default geometry + inline interactive */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <div className="mx-auto max-w-4xl">
          <StoryCard {...story.sections[1]} accent={ACCENT} />
        </div>
        <Reveal delay={140}>
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_340px]">
            <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                Basket-handled torus · vertical spike
              </div>
              <TorusSpikeSVG />
              <p className="text-xs leading-relaxed text-ink-300">
                A schematic of the canonical shape: a thick toroidal weave around the z-axis,
                pierced by a thin column that the orbit visits between long episodes around the rim.
              </p>
            </div>
            <AizawaInlineMini
              caption={story.miniCaption}
              bLabel={story.miniLabel}
              hint={story.miniHint}
            />
          </div>
        </Reveal>
      </section>

      {/* Section 3 — Parameter sensitivity */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[2]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT} mb-4`}>
              b sweep · 0.3 → 1.2
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[0.4, 0.7, 0.95, 1.15].map((bv) => (
                <SweepCell key={bv} b={bv} />
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-300">
              Same three equations, same five other dials. Only b changes — and the geometry
              breathes continuously.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 4 — Chaos zoo */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[3]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              ["Lorenz", "1963", "butterfly"],
              ["Rössler", "1976", "band + spiral"],
              ["Aizawa", "1982", "basket + spike"],
              ["Thomas", "—", "cyclically symmetric"],
              ["Halvorsen", "—", "tetrahedral"],
              ["Lorenz-84", "1984", "atmospheric"],
            ].map(([name, year, shape]) => (
              <div
                key={name}
                className="hairline space-y-1 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-signal-coral/40"
              >
                <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                  {year}
                </div>
                <div className="math-italic text-lg text-ink-100">{name}</div>
                <div className="text-xs text-ink-300">{shape}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Section 5 — Lyapunov & dimension */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[4]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Kaplan-Yorke dimension
            </div>
            <div className="math-italic text-6xl text-ink-100 md:text-7xl">just over 2</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Just above a surface, well below a solid. Computed from the Lyapunov spectrum (leading
              exponent positive, around 0.1; second near zero; third strongly negative).
            </p>
            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 pt-4 text-center">
              <DimDot label="curve" value="1" />
              <DimDot label="Aizawa" value="~2.0" highlight />
              <DimDot label="solid" value="3" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 6 — Why we care */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...story.sections[5]} accent={ACCENT} />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            Open the Explorer
          </div>
          <h2 className="math-italic text-3xl leading-tight md:text-5xl">{story.closingTitle}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{story.closingBody}</p>
          <div className="pt-2">
            <Link
              href="/aizawa/explorer"
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

function Param({ label, value }: { label: string; value: string }) {
  return (
    <div className="hairline rounded-md border bg-ink-950/60 p-3 text-center">
      <div className="mb-1 font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
        {label}
      </div>
      <div className="math-italic text-xl text-signal-coral">{value}</div>
    </div>
  );
}

function DimDot({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`hairline rounded-md border p-3 ${
        highlight ? "border-signal-coral/50 bg-signal-coral/10" : "bg-ink-950/60"
      }`}
    >
      <div className="mb-1 font-mono text-[9px] uppercase tracking-widest2 text-ink-300">
        {label}
      </div>
      <div className={`math-italic text-lg ${highlight ? "text-signal-coral" : "text-ink-100"}`}>
        {value}
      </div>
    </div>
  );
}

// Schematic of the canonical Aizawa attractor: a vertical spike piercing a
// toroidal weave. Pure decoration; the live demo is the inline mini.
function TorusSpikeSVG() {
  return (
    <svg
      viewBox="0 0 320 200"
      className="mx-auto h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Schematic torus pierced by a vertical spike"
    >
      <rect width="320" height="200" fill={palette.canvas.bg} rx="8" />
      {/* Torus outer ellipses */}
      <ellipse
        cx="160"
        cy="120"
        rx="100"
        ry="34"
        fill="none"
        stroke="rgba(125,243,255,0.7)"
        strokeWidth="1.1"
      />
      <ellipse
        cx="160"
        cy="120"
        rx="100"
        ry="20"
        fill="none"
        stroke="rgba(125,243,255,0.4)"
        strokeWidth="0.8"
      />
      {/* Weave hatches around the torus body */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x = 160 + 100 * Math.cos(a);
        const y = 120 + 30 * Math.sin(a);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="6"
            ry="12"
            fill="none"
            stroke="rgba(179,136,255,0.35)"
            strokeWidth="0.7"
          />
        );
      })}
      {/* Vertical spike */}
      <line
        x1="160"
        y1="30"
        x2="160"
        y2="190"
        stroke="rgba(255,209,102,0.85)"
        strokeWidth="1.1"
        strokeDasharray="3 3"
      />
      <circle cx="160" cy="120" r="2.6" fill={palette.signal.rose} />
      <text
        x="160"
        y="24"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill={palette.signal.amber}
      >
        z-axis
      </text>
    </svg>
  );
}

// Static thumbnails for the parameter sweep, computed once at render time.
function SweepCell({ b }: { b: number }) {
  const W = 160;
  const H = 110;
  // Project a small precomputed orbit onto a 2D thumbnail (xz-plane, slight
  // shear so the basket shape reads even without rotation).
  const pts: Array<[number, number]> = [];
  let x = 0.1,
    y = 0,
    z = 0;
  const a = 0.95,
    c = 0.6,
    d = 3.5,
    e = 0.25,
    f = 0.1;
  const dt = 0.01;
  // Warm-up
  for (let i = 0; i < 1500; i++) {
    const dx = (z - b) * x - d * y;
    const dy = d * x + (z - b) * y;
    const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }
  for (let i = 0; i < 3200; i++) {
    const dx = (z - b) * x - d * y;
    const dy = d * x + (z - b) * y;
    const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    // Project: light shear of y into x to read 3D-ish.
    const px = W / 2 + (x + 0.2 * y) * 30;
    const py = H / 2 - z * 30;
    pts.push([px, py]);
  }
  const dPath = pts
    .map(([px, py], i) => `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(" ");
  return (
    <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`b = ${b}`}>
        <rect width={W} height={H} fill={palette.canvas.bg} rx="4" />
        <path d={dPath} fill="none" stroke="rgba(125,243,255,0.55)" strokeWidth="0.6" />
      </svg>
      <div className="text-center font-mono text-[10px] text-ink-300">
        b · <span className="text-signal-coral">{b.toFixed(2)}</span>
      </div>
    </div>
  );
}
