"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { GabrielsHornRenderer } from "@/components/GabrielsHornRenderer";
import { GabrielsHornGrowGraph } from "@/components/GabrielsHornGrowGraph";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-rose";

// --------------------------------------------------------------------------
// Per-locale story content. The hero (pretitle/title/tagline/intro) still
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
  volumeIntegralPretitle: string;
  volumeIntegralNote: string;
  surfaceIntegralPretitle: string;
  surfaceIntegralNote: string;
  hornCaption: string;
  hornXMaxLabel: string;
  hornVolumeLabel: string;
  hornAreaLabel: string;
  hornHint: string;
  growGraphCaption: string;
  growLegendV: string;
  growLegendA: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Paradox",
    title: "Gabriel's Horn",
    tagline: "Finite volume, infinite surface.",
    intro:
      "A shape from 1641 that swallowed every intuition mathematicians had about infinity. The Explorer cuts the horn off at a variable x, draws the side view, and computes the volume and the surface area live — watch one stay tame and the other run away.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Fill it with paint. Never coat its walls.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Spin the curve y = 1/x around its axis. The solid you get is finite in volume but infinite in surface area. Pour π units of paint in, the horn is full; try to brush its outside and you never finish.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "V = π ∫₁^∞ 1/x² dx = π — convergent, finite. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — the harmonic integral, divergent.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Torricelli announced the result in 1641, decades before calculus had a name. Hobbes and Wallis fought bitterly over what it could possibly mean. It was the first place infinity stopped behaving.",
      },
    ],
    tryIt:
      "Below: drag the horn, slide X_max, and watch one number settle while the other runs away.",
  },
  sections: [
    {
      pretitle: "Section 01 · The shape",
      title: "y = 1/x, spun around the axis",
      body: "Take the hyperbola y = 1/x on x ∈ [1, ∞). Rotate it around the x-axis. Each cross-section perpendicular to the axis is a disc of radius 1/x. The horn flares at x = 1 to a mouth of radius 1 and tapers forever toward zero — a slender trumpet that never quite closes.",
    },
    {
      pretitle: "Section 02 · Volume by disks",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Slice the horn into thin discs of thickness dx. Each has area π/x² and volume π/x² · dx. The sum is π · [−1/x]₁^∞ = π. The squares vanish fast enough — the integral converges. The whole infinite horn holds exactly π cubic units.",
    },
    {
      pretitle: "Section 03 · Surface by frustums",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "The lateral surface integrand has a square-root factor that is always ≥ 1, so A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. That is the harmonic integral — and it diverges. The surface area grows without bound.",
    },
    {
      pretitle: "Section 04 · The paint paradox",
      title: "Fill it; never paint it — and why that is fine",
      body: "Real paint has a thickness ε. Coating an infinite surface with a layer of nonzero ε needs infinite volume — no contradiction with A = ∞. The mathematical 'fill' uses paint of zero thickness on the wall; in that limit the inside wall is the same infinite surface, just approached differently. Drop the physical assumption and the paradox dissolves.",
    },
    {
      pretitle: "Section 05 · Generalizations",
      title: "y = 1/xᵏ — when do V and A converge?",
      body: "Replace 1/x by 1/xᵏ and redo the integrals. The volume integral ∫ 1/x²ᵏ dx converges iff 2k > 1, i.e. k > 1/2. The surface integral ∫ 1/xᵏ dx converges iff k > 1. The paradox lives exactly in the gap: 1/2 < k ≤ 1 gives finite volume and infinite surface.",
    },
    {
      pretitle: "Section 06 · Connections",
      title: "Koch snowflake — the 2D cousin",
      body: "The Koch snowflake encloses a finite area inside an infinite perimeter — the same finite-vs-infinite split, one dimension lower. Both are early hints that measure and shape can disagree in surprising ways. Torricelli's horn was the first; the snowflake came in 1904.",
    },
  ],
  volumeIntegralPretitle: "The volume integral",
  volumeIntegralNote:
    "Each cross-section is a disc of radius 1/x. Squaring sends the radii toward zero fast enough for the sum to converge.",
  surfaceIntegralPretitle: "The surface integral",
  surfaceIntegralNote:
    "The lower bound is the harmonic integral, the continuous cousin of 1 + 1/2 + 1/3 + … It diverges, and it drags the surface area to infinity with it.",
  hornCaption: "Interactive · drag to rotate, slide X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint: "V(X) = π(1 − 1/X) settles toward π. A(X) keeps climbing, bounded below by 2π · ln X.",
  growGraphCaption: "V(X) vs A(X) — one settles, one runs away",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer cuts the horn at any X you choose, draws the side view, and tracks V and A live. Push X out toward the horizon and feel the asymmetry land.",
  closingCta: "→ Open the Explorer",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Paradox",
    title: "Gabriels Horn",
    tagline: "Endliches Volumen, unendliche Oberfläche.",
    intro:
      "Eine Form von 1641, die jede Intuition verschluckte, die Mathematiker:innen über das Unendliche hatten. Der Explorer schneidet das Horn an einem variablen x ab, zeichnet die Seitenansicht und berechnet Volumen und Oberfläche live — sieh zu, wie das eine zahm bleibt und das andere davonläuft.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Mit Farbe füllen. Die Wand niemals streichen.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Drehe die Kurve y = 1/x um ihre Achse. Der entstehende Körper hat endliches Volumen, aber unendliche Oberfläche. Gieß π Einheiten Farbe hinein, das Horn ist voll; versuch die Außenseite zu streichen, du wirst nie fertig.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "V = π ∫₁^∞ 1/x² dx = π — konvergent, endlich. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — das harmonische Integral, divergent.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Torricelli verkündete das Ergebnis 1641, Jahrzehnte bevor die Analysis einen Namen hatte. Hobbes und Wallis stritten erbittert, was das bedeuten könne. Es war die erste Stelle, an der die Unendlichkeit aus dem Tritt geriet.",
      },
    ],
    tryIt:
      "Unten: dreh das Horn, zieh X_max, und sieh die eine Zahl ankommen, während die andere davonläuft.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Form",
      title: "y = 1/x, um die Achse gedreht",
      body: "Nimm die Hyperbel y = 1/x auf x ∈ [1, ∞). Dreh sie um die x-Achse. Jeder Querschnitt senkrecht zur Achse ist eine Scheibe vom Radius 1/x. Das Horn weitet sich bei x = 1 zu einer Mündung vom Radius 1 und verjüngt sich für immer gegen null — eine schlanke Trompete, die nie ganz schließt.",
    },
    {
      pretitle: "Abschnitt 02 · Volumen durch Scheiben",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Zerschneide das Horn in dünne Scheiben der Dicke dx. Jede hat Fläche π/x² und Volumen π/x² · dx. Die Summe ist π · [−1/x]₁^∞ = π. Die Quadrate verschwinden schnell genug — das Integral konvergiert. Das ganze unendliche Horn fasst genau π Kubikeinheiten.",
    },
    {
      pretitle: "Abschnitt 03 · Oberfläche durch Kegelstümpfe",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "Im Mantelintegral steht ein Wurzelfaktor, der stets ≥ 1 ist, also gilt A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. Das ist das harmonische Integral — und es divergiert. Die Oberfläche wächst über alle Schranken.",
    },
    {
      pretitle: "Abschnitt 04 · Das Farb-Paradoxon",
      title: "Füllen ja, streichen nie — und warum das in Ordnung ist",
      body: "Echte Farbe hat eine Dicke ε. Eine unendliche Fläche mit einer Schicht von ε > 0 zu überziehen braucht unendliches Volumen — kein Widerspruch zu A = ∞. Die mathematische «Füllung» nutzt Farbe mit Dicke null an der Wand; in diesem Grenzfall ist die Innenwand dieselbe unendliche Fläche, nur anders angenähert. Lass die physikalische Annahme fallen, und das Paradoxon löst sich auf.",
    },
    {
      pretitle: "Abschnitt 05 · Verallgemeinerungen",
      title: "y = 1/xᵏ — wann konvergieren V und A?",
      body: "Ersetz 1/x durch 1/xᵏ und rechne die Integrale neu. Das Volumenintegral ∫ 1/x²ᵏ dx konvergiert genau für 2k > 1, also k > 1/2. Das Oberflächenintegral ∫ 1/xᵏ dx konvergiert genau für k > 1. Das Paradoxon lebt exakt in der Lücke: 1/2 < k ≤ 1 liefert endliches Volumen und unendliche Oberfläche.",
    },
    {
      pretitle: "Abschnitt 06 · Verbindungen",
      title: "Koch-Schneeflocke — der 2D-Cousin",
      body: "Die Koch-Schneeflocke umschließt eine endliche Fläche bei unendlichem Umfang — derselbe Endlich-gegen-Unendlich-Bruch, eine Dimension tiefer. Beide sind frühe Hinweise, dass Maß und Form auf überraschende Weise auseinanderfallen können. Torricellis Horn war das erste; die Schneeflocke kam 1904.",
    },
  ],
  volumeIntegralPretitle: "Das Volumenintegral",
  volumeIntegralNote:
    "Jeder Querschnitt ist eine Scheibe vom Radius 1/x. Das Quadrieren treibt die Radien schnell genug gegen null, sodass die Summe konvergiert.",
  surfaceIntegralPretitle: "Das Oberflächenintegral",
  surfaceIntegralNote:
    "Die untere Schranke ist das harmonische Integral, der stetige Vetter von 1 + 1/2 + 1/3 + … Es divergiert und zieht die Oberfläche mit sich ins Unendliche.",
  hornCaption: "Interaktiv · ziehen zum Drehen, X_max schieben",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint:
    "V(X) = π(1 − 1/X) nähert sich π. A(X) klettert weiter, von unten durch 2π · ln X beschränkt.",
  growGraphCaption: "V(X) gegen A(X) — eine kommt an, die andere läuft davon",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer schneidet das Horn bei jedem X, das du willst, zeichnet die Seitenansicht und verfolgt V und A live. Schieb X bis zum Horizont — und spür, wie die Asymmetrie landet.",
  closingCta: "→ Explorer öffnen",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Paradoja",
    title: "El cuerno de Gabriel",
    tagline: "Volumen finito, superficie infinita.",
    intro:
      "Una forma de 1641 que devoró todas las intuiciones que los matemáticos tenían sobre el infinito. El Explorador corta el cuerno en una x variable, dibuja la vista lateral y calcula en vivo el volumen y el área de la superficie — observa cómo una se mantiene mansa y la otra se escapa.",
    ctaInteractive: "→ Abre el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Llénalo de pintura. Nunca cubras sus paredes.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Gira la curva y = 1/x alrededor de su eje. El sólido que sale tiene volumen finito pero superficie infinita. Vierte π unidades de pintura y el cuerno se llena; intenta pintarlo por fuera y no terminas nunca.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "V = π ∫₁^∞ 1/x² dx = π — converge, finito. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — la integral armónica, divergente.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Torricelli anunció el resultado en 1641, décadas antes de que el cálculo tuviera nombre. Hobbes y Wallis discutieron con furia qué podía significar. Fue el primer sitio donde el infinito dejó de portarse bien.",
      },
    ],
    tryIt:
      "Abajo: arrastra el cuerno, desliza X_max, y mira un número asentarse mientras el otro escapa.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La forma",
      title: "y = 1/x, girada en torno al eje",
      body: "Toma la hipérbola y = 1/x en x ∈ [1, ∞). Gírala en torno al eje x. Cada sección perpendicular al eje es un disco de radio 1/x. El cuerno se abre en x = 1 a una boca de radio 1 y se afina para siempre hacia cero — una trompeta esbelta que nunca se cierra del todo.",
    },
    {
      pretitle: "Sección 02 · Volumen por discos",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Corta el cuerno en discos finos de espesor dx. Cada uno tiene área π/x² y volumen π/x² · dx. La suma es π · [−1/x]₁^∞ = π. Los cuadrados se anulan lo bastante rápido — la integral converge. El cuerno infinito cabe en exactamente π unidades cúbicas.",
    },
    {
      pretitle: "Sección 03 · Superficie por troncos",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "El integrando de la superficie lleva un factor con raíz que siempre es ≥ 1, así que A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. Es la integral armónica — y diverge. La superficie crece sin cota.",
    },
    {
      pretitle: "Sección 04 · La paradoja del pintor",
      title: "Llénalo; nunca lo pintes — y por qué eso está bien",
      body: "La pintura real tiene espesor ε. Cubrir una superficie infinita con una capa de ε > 0 exige volumen infinito — sin contradicción con A = ∞. El «llenado» matemático usa pintura de espesor cero en la pared; en ese límite la pared interior es la misma superficie infinita, aproximada de otro modo. Quita la hipótesis física y la paradoja se disuelve.",
    },
    {
      pretitle: "Sección 05 · Generalizaciones",
      title: "y = 1/xᵏ — ¿cuándo convergen V y A?",
      body: "Sustituye 1/x por 1/xᵏ y rehaz las integrales. La de volumen ∫ 1/x²ᵏ dx converge si y solo si 2k > 1, o sea k > 1/2. La de superficie ∫ 1/xᵏ dx converge si y solo si k > 1. La paradoja vive justo en el hueco: 1/2 < k ≤ 1 da volumen finito y superficie infinita.",
    },
    {
      pretitle: "Sección 06 · Conexiones",
      title: "Copo de nieve de Koch — el primo 2D",
      body: "El copo de Koch encierra área finita con perímetro infinito — la misma escisión finito-vs-infinito, una dimensión más abajo. Ambas son indicios tempranos de que medida y forma pueden discrepar de modo sorprendente. El cuerno de Torricelli fue el primero; el copo llegó en 1904.",
    },
  ],
  volumeIntegralPretitle: "La integral de volumen",
  volumeIntegralNote:
    "Cada sección es un disco de radio 1/x. Elevar al cuadrado lleva los radios hacia cero lo bastante rápido para que la suma converja.",
  surfaceIntegralPretitle: "La integral de superficie",
  surfaceIntegralNote:
    "La cota inferior es la integral armónica, la prima continua de 1 + 1/2 + 1/3 + … Diverge, y arrastra el área de la superficie al infinito con ella.",
  hornCaption: "Interactivo · arrastra para girar, desliza X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint:
    "V(X) = π(1 − 1/X) se asienta hacia π. A(X) sigue subiendo, acotado por debajo por 2π · ln X.",
  growGraphCaption: "V(X) frente a A(X) — uno se asienta, el otro escapa",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador corta el cuerno en cualquier X que elijas, dibuja el perfil y rastrea V y A en vivo. Empuja X hacia el horizonte y siente caer la asimetría.",
  closingCta: "→ Abrir el Explorador",
};

const fr: RichStory = {
  page: {
    pretitle: "Thème · Paradoxe",
    title: "La trompette de Gabriel",
    tagline: "Volume fini, surface infinie.",
    intro:
      "Une forme de 1641 qui a englouti toute intuition que les mathématiciens avaient sur l'infini. L'Explorateur coupe la trompette à un x variable, dessine la vue de côté et calcule en direct le volume et l'aire de la surface : regarde l'un rester sage et l'autre s'enfuir.",
    ctaInteractive: "→ Ouvre l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Remplis-le de peinture. N'en peins jamais les parois.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Fais tourner la courbe y = 1/x autour de son axe. Le solide obtenu a un volume fini mais une surface infinie. Verses-y π unités de peinture, la trompette est pleine ; essaie d'en peindre l'extérieur et tu ne finis jamais.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "V = π ∫₁^∞ 1/x² dx = π — convergente, finie. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — l'intégrale harmonique, divergente.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Torricelli a annoncé le résultat en 1641, des décennies avant que le calcul ait un nom. Hobbes et Wallis se sont déchirés sur ce que cela pouvait bien vouloir dire. C'est le premier endroit où l'infini a cessé de se tenir.",
      },
    ],
    tryIt:
      "Ci-dessous : tourne la trompette, glisse X_max, et regarde un nombre se poser pendant que l'autre s'enfuit.",
  },
  sections: [
    {
      pretitle: "Section 01 · La forme",
      title: "y = 1/x, tournée autour de l'axe",
      body: "Prends l'hyperbole y = 1/x sur x ∈ [1, ∞). Fais-la tourner autour de l'axe des x. Chaque section perpendiculaire à l'axe est un disque de rayon 1/x. La trompette s'évase en x = 1 vers une bouche de rayon 1 et s'effile pour toujours vers zéro, un pavillon mince qui ne se ferme jamais tout à fait.",
    },
    {
      pretitle: "Section 02 · Volume par disques",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Tranche la trompette en disques fins d'épaisseur dx. Chacun a pour aire π/x² et pour volume π/x² · dx. La somme vaut π · [−1/x]₁^∞ = π. Les carrés s'annulent assez vite, l'intégrale converge. La trompette infinie tient en exactement π unités cubiques.",
    },
    {
      pretitle: "Section 03 · Surface par troncs",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "L'intégrande de la surface latérale a un facteur racine toujours ≥ 1, donc A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. C'est l'intégrale harmonique — et elle diverge. La surface croît sans borne.",
    },
    {
      pretitle: "Section 04 · Le paradoxe du peintre",
      title: "Remplir oui, peindre non — et pourquoi c'est cohérent",
      body: "La peinture réelle a une épaisseur ε. Couvrir une surface infinie d'une couche d'épaisseur ε > 0 demande un volume infini — pas de contradiction avec A = ∞. Le « remplissage » mathématique utilise une peinture d'épaisseur nulle sur la paroi ; à cette limite, la paroi intérieure est la même surface infinie, abordée autrement. Lâche l'hypothèse physique et le paradoxe se dissout.",
    },
    {
      pretitle: "Section 05 · Généralisations",
      title: "y = 1/xᵏ — quand V et A convergent-ils ?",
      body: "Remplace 1/x par 1/xᵏ et refais les intégrales. Celle du volume ∫ 1/x²ᵏ dx converge ssi 2k > 1, soit k > 1/2. Celle de la surface ∫ 1/xᵏ dx converge ssi k > 1. Le paradoxe vit pile dans l'écart : 1/2 < k ≤ 1 donne volume fini et surface infinie.",
    },
    {
      pretitle: "Section 06 · Connexions",
      title: "Flocon de Koch — le cousin 2D",
      body: "Le flocon de Koch enferme une aire finie sous un périmètre infini, la même scission fini-vs-infini, une dimension plus bas. Tous deux signalent tôt que mesure et forme peuvent se contredire de façons surprenantes. La trompette de Torricelli est la première ; le flocon date de 1904.",
    },
  ],
  volumeIntegralPretitle: "L'intégrale de volume",
  volumeIntegralNote:
    "Chaque section est un disque de rayon 1/x. L'élévation au carré pousse les rayons vers zéro assez vite pour que la somme converge.",
  surfaceIntegralPretitle: "L'intégrale de surface",
  surfaceIntegralNote:
    "La borne inférieure est l'intégrale harmonique, la cousine continue de 1 + 1/2 + 1/3 + … Elle diverge et entraîne l'aire de la surface vers l'infini avec elle.",
  hornCaption: "Interactif · fais tourner, glisse X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint: "V(X) = π(1 − 1/X) se pose vers π. A(X) continue de grimper, minoré par 2π · ln X.",
  growGraphCaption: "V(X) face à A(X) — l'un se pose, l'autre s'enfuit",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur coupe la trompette à n'importe quel X, en dessine le profil et suit V et A en direct. Pousse X vers l'horizon et sens l'asymétrie atterrir.",
  closingCta: "→ Ouvrir l'Explorateur",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Paradosso",
    title: "Il corno di Gabriele",
    tagline: "Volume finito, superficie infinita.",
    intro:
      "Una forma del 1641 che inghiottì ogni intuizione che i matematici avevano sull'infinito. L'Esploratore taglia il corno in una x variabile, disegna la vista laterale e calcola dal vivo il volume e l'area della superficie — guarda l'uno restare mansueto e l'altra scappare via.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Riempilo di vernice. Non rivestirne mai le pareti.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Fai ruotare la curva y = 1/x attorno al suo asse. Il solido che ottieni ha volume finito ma superficie infinita. Versa π unità di vernice e il corno è pieno; prova a verniciarne l'esterno e non finisci mai.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "V = π ∫₁^∞ 1/x² dx = π — convergente, finito. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — l'integrale armonico, divergente.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Torricelli annunciò il risultato nel 1641, decenni prima che l'analisi avesse un nome. Hobbes e Wallis si scontrarono con ferocia su cosa potesse mai significare. Fu il primo punto in cui l'infinito smise di comportarsi.",
      },
    ],
    tryIt:
      "Sotto: trascina il corno, sposta X_max, e guarda un numero posarsi mentre l'altro fugge.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La forma",
      title: "y = 1/x, ruotata attorno all'asse",
      body: "Prendi l'iperbole y = 1/x su x ∈ [1, ∞). Falla ruotare attorno all'asse x. Ogni sezione perpendicolare all'asse è un disco di raggio 1/x. Il corno si apre in x = 1 a una bocca di raggio 1 e si assottiglia per sempre verso zero — una tromba esile che non si chiude mai del tutto.",
    },
    {
      pretitle: "Sezione 02 · Volume per dischi",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Taglia il corno in dischi sottili di spessore dx. Ognuno ha area π/x² e volume π/x² · dx. La somma è π · [−1/x]₁^∞ = π. I quadrati si annullano abbastanza in fretta — l'integrale converge. Il corno infinito sta in esattamente π unità cubiche.",
    },
    {
      pretitle: "Sezione 03 · Superficie per tronchi",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "L'integrando della superficie laterale ha un fattore radice sempre ≥ 1, quindi A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. È l'integrale armonico — e diverge. La superficie cresce senza limite.",
    },
    {
      pretitle: "Sezione 04 · Il paradosso del pittore",
      title: "Riempi sì, dipingi mai — e perché va bene",
      body: "La vernice vera ha spessore ε. Coprire una superficie infinita con uno strato di ε > 0 richiede volume infinito — nessuna contraddizione con A = ∞. Il «riempimento» matematico usa vernice di spessore nullo sulla parete; in quel limite la parete interna è la stessa superficie infinita, solo avvicinata in altro modo. Lascia cadere l'ipotesi fisica e il paradosso si dissolve.",
    },
    {
      pretitle: "Sezione 05 · Generalizzazioni",
      title: "y = 1/xᵏ — quando V e A convergono?",
      body: "Sostituisci 1/x con 1/xᵏ e rifai gli integrali. Quello del volume ∫ 1/x²ᵏ dx converge sse 2k > 1, cioè k > 1/2. Quello della superficie ∫ 1/xᵏ dx converge sse k > 1. Il paradosso vive proprio nella fessura: 1/2 < k ≤ 1 dà volume finito e superficie infinita.",
    },
    {
      pretitle: "Sezione 06 · Collegamenti",
      title: "Fiocco di Koch — il cugino 2D",
      body: "Il fiocco di Koch racchiude un'area finita con perimetro infinito — la stessa scissione finito-vs-infinito, una dimensione più in basso. Entrambi anticipano che misura e forma possono divergere in modi sorprendenti. Il corno di Torricelli fu il primo; il fiocco arrivò nel 1904.",
    },
  ],
  volumeIntegralPretitle: "L'integrale di volume",
  volumeIntegralNote:
    "Ogni sezione è un disco di raggio 1/x. Elevare al quadrato spinge i raggi verso zero abbastanza in fretta perché la somma converga.",
  surfaceIntegralPretitle: "L'integrale di superficie",
  surfaceIntegralNote:
    "L'estremo inferiore è l'integrale armonico, il cugino continuo di 1 + 1/2 + 1/3 + … Diverge, e trascina con sé l'area della superficie all'infinito.",
  hornCaption: "Interattivo · trascina per ruotare, sposta X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint:
    "V(X) = π(1 − 1/X) si posa verso π. A(X) continua a salire, limitato dal basso da 2π · ln X.",
  growGraphCaption: "V(X) contro A(X) — uno si posa, l'altro scappa",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore taglia il corno a qualunque X scegli, ne disegna il profilo e segue V e A in tempo reale. Spingi X verso l'orizzonte e senti atterrare l'asimmetria.",
  closingCta: "→ Apri l'Esploratore",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Paradoxo",
    title: "A trombeta de Gabriel",
    tagline: "Volume finito, superfície infinita.",
    intro:
      "Uma forma de 1641 que engoliu toda a intuição que os matemáticos tinham sobre o infinito. O Explorador corta a trombeta num x variável, desenha a vista lateral e calcula ao vivo o volume e a área da superfície — observa um manter-se manso e o outro fugir.",
    ctaInteractive: "→ Abre o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Enche-o de tinta. Nunca pintes as suas paredes.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Roda a curva y = 1/x em torno do seu eixo. O sólido obtido tem volume finito mas superfície infinita. Despeja π unidades de tinta, a trombeta enche; tenta pintá-la por fora e nunca acabas.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "V = π ∫₁^∞ 1/x² dx = π — convergente, finito. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — o integral harmónico, divergente.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Torricelli anunciou o resultado em 1641, décadas antes de o cálculo ter nome. Hobbes e Wallis discutiram com fúria sobre o que aquilo poderia significar. Foi o primeiro sítio onde o infinito deixou de se portar.",
      },
    ],
    tryIt:
      "Abaixo: arrasta a trombeta, desliza X_max, e vê um número assentar enquanto o outro foge.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A forma",
      title: "y = 1/x, rodada em torno do eixo",
      body: "Toma a hipérbole y = 1/x em x ∈ [1, ∞). Roda-a em torno do eixo x. Cada secção perpendicular ao eixo é um disco de raio 1/x. A trombeta abre-se em x = 1 numa boca de raio 1 e afina para sempre em direção a zero, um pavilhão esguio que nunca se fecha totalmente.",
    },
    {
      pretitle: "Secção 02 · Volume por discos",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Corta a trombeta em discos finos de espessura dx. Cada um tem área π/x² e volume π/x² · dx. A soma é π · [−1/x]₁^∞ = π. Os quadrados anulam-se depressa que chegue, o integral converge. A trombeta infinita cabe em exatamente π unidades cúbicas.",
    },
    {
      pretitle: "Secção 03 · Superfície por troncos",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "O integrando da superfície lateral tem um fator raiz sempre ≥ 1, portanto A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. É o integral harmónico — e diverge. A superfície cresce sem limite.",
    },
    {
      pretitle: "Secção 04 · O paradoxo do pintor",
      title: "Enche sim, pinta nunca — e porque está tudo bem",
      body: "Tinta real tem espessura ε. Cobrir uma superfície infinita com uma camada de ε > 0 exige volume infinito — sem contradição com A = ∞. O «enchimento» matemático usa tinta de espessura nula na parede; nesse limite a parede interior é a mesma superfície infinita, só aproximada de outro modo. Larga a hipótese física e o paradoxo dissolve-se.",
    },
    {
      pretitle: "Secção 05 · Generalizações",
      title: "y = 1/xᵏ — quando convergem V e A?",
      body: "Substitui 1/x por 1/xᵏ e refaz os integrais. O do volume ∫ 1/x²ᵏ dx converge sse 2k > 1, ou seja k > 1/2. O da superfície ∫ 1/xᵏ dx converge sse k > 1. O paradoxo vive precisamente na fenda: 1/2 < k ≤ 1 dá volume finito e superfície infinita.",
    },
    {
      pretitle: "Secção 06 · Ligações",
      title: "Floco de Koch — o primo 2D",
      body: "O floco de Koch encerra uma área finita num perímetro infinito, a mesma cisão finito-vs-infinito, uma dimensão abaixo. Ambos são pistas precoces de que medida e forma podem divergir de modos surpreendentes. A trombeta de Torricelli foi a primeira; o floco apareceu em 1904.",
    },
  ],
  volumeIntegralPretitle: "O integral de volume",
  volumeIntegralNote:
    "Cada secção é um disco de raio 1/x. Elevar ao quadrado leva os raios a zero depressa que chegue para a soma convergir.",
  surfaceIntegralPretitle: "O integral de superfície",
  surfaceIntegralNote:
    "O limite inferior é o integral harmónico, o primo contínuo de 1 + 1/2 + 1/3 + … Diverge, e arrasta a área da superfície para o infinito com ele.",
  hornCaption: "Interativo · arrasta para rodar, desliza X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint:
    "V(X) = π(1 − 1/X) assenta-se em π. A(X) continua a subir, limitado por baixo por 2π · ln X.",
  growGraphCaption: "V(X) contra A(X) — um assenta, o outro foge",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador corta a trombeta em qualquer X que escolheres, desenha o perfil e segue V e A ao vivo. Empurra X até ao horizonte e sente a assimetria aterrar.",
  closingCta: "→ Abrir o Explorador",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Paradox",
    title: "Gabriels horn",
    tagline: "Ändlig volym, oändlig yta.",
    intro:
      "En form från 1641 som slukade all intuition matematiker hade om oändligheten. Utforskaren kapar hornet vid ett variabelt x, ritar sidvyn och räknar volym och yta i realtid — se det ena förbli tamt och det andra rusa iväg.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Fyll det med färg. Måla aldrig dess väggar.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Snurra kurvan y = 1/x kring sin axel. Kroppen du får har ändlig volym men oändlig yta. Häll i π enheter färg och hornet är fullt; försök måla utsidan och du blir aldrig klar.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "V = π ∫₁^∞ 1/x² dx = π — konvergent, ändlig. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — den harmoniska integralen, divergent.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Torricelli tillkännagav resultatet 1641, decennier innan analysen hade ett namn. Hobbes och Wallis grälade hett om vad det egentligen kunde betyda. Det var första gången oändligheten slutade bete sig.",
      },
    ],
    tryIt: "Nedan: dra hornet, dra X_max, och se ett tal lägga sig medan det andra rymmer.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Formen",
      title: "y = 1/x, snurrad kring axeln",
      body: "Ta hyperbeln y = 1/x på x ∈ [1, ∞). Snurra den kring x-axeln. Varje tvärsnitt vinkelrätt mot axeln är en skiva med radie 1/x. Hornet vidgas vid x = 1 till en mynning med radie 1 och smalnar för alltid mot noll — en slank trumpet som aldrig riktigt sluter sig.",
    },
    {
      pretitle: "Avsnitt 02 · Volym via skivor",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Skär hornet i tunna skivor med tjocklek dx. Var och en har area π/x² och volym π/x² · dx. Summan är π · [−1/x]₁^∞ = π. Kvadraterna försvinner snabbt nog — integralen konvergerar. Hela det oändliga hornet rymmer exakt π kubikenheter.",
    },
    {
      pretitle: "Avsnitt 03 · Yta via stympade koner",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "Mantelintegralens integrand har en rotfaktor som alltid är ≥ 1, så A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. Det är den harmoniska integralen — och den divergerar. Ytan växer obegränsat.",
    },
    {
      pretitle: "Avsnitt 04 · Målarens paradox",
      title: "Fyll ja, måla aldrig — och varför det är okej",
      body: "Riktig färg har en tjocklek ε. Att täcka en oändlig yta med ett skikt av ε > 0 kräver oändlig volym — ingen motsägelse mot A = ∞. Den matematiska «fyllningen» använder färg med tjocklek noll på väggen; i den gränsen är innerväggen samma oändliga yta, bara närmad annorlunda. Släpp det fysiska antagandet och paradoxen löses upp.",
    },
    {
      pretitle: "Avsnitt 05 · Generaliseringar",
      title: "y = 1/xᵏ — när konvergerar V och A?",
      body: "Byt 1/x mot 1/xᵏ och räkna om integralerna. Volymintegralen ∫ 1/x²ᵏ dx konvergerar omm 2k > 1, alltså k > 1/2. Ytintegralen ∫ 1/xᵏ dx konvergerar omm k > 1. Paradoxen lever precis i springan: 1/2 < k ≤ 1 ger ändlig volym och oändlig yta.",
    },
    {
      pretitle: "Avsnitt 06 · Kopplingar",
      title: "Kochs snöflinga — 2D-kusinen",
      body: "Kochs snöflinga omsluter en ändlig area med oändlig omkrets — samma ändligt-mot-oändligt-klyvning, ett steg ner i dimension. Båda är tidiga tecken på att mått och form kan dra åt olika håll på överraskande sätt. Torricellis horn kom först; snöflingan dök upp 1904.",
    },
  ],
  volumeIntegralPretitle: "Volymintegralen",
  volumeIntegralNote:
    "Varje tvärsnitt är en skiva med radie 1/x. Kvadreringen driver radierna mot noll snabbt nog för att summan ska konvergera.",
  surfaceIntegralPretitle: "Ytintegralen",
  surfaceIntegralNote:
    "Den nedre gränsen är den harmoniska integralen, den kontinuerliga kusinen till 1 + 1/2 + 1/3 + … Den divergerar och drar med sig ytan mot oändligheten.",
  hornCaption: "Interaktivt · dra för att rotera, dra X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint:
    "V(X) = π(1 − 1/X) lägger sig mot π. A(X) klättrar vidare, nedåt begränsat av 2π · ln X.",
  growGraphCaption: "V(X) mot A(X) — den ena lägger sig, den andra rymmer",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren kapar hornet vid valfritt X, ritar sidovyn och följer V och A live. Skjut X mot horisonten och känn asymmetrin landa.",
  closingCta: "→ Öppna Utforskaren",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Paradoks",
    title: "Gabriels horn",
    tagline: "Endelig volum, uendelig overflate.",
    intro:
      "En form fra 1641 som slukte all intuisjon matematikere hadde om det uendelige. Utforskeren kutter hornet ved en variabel x, tegner sidevisningen og beregner volum og overflate i sanntid — se det ene forbli tamt og det andre løpe avgårde.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Fyll det med maling. Mal aldri veggene.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Snurr kurven y = 1/x rundt sin akse. Legemet du får har endelig volum, men uendelig overflate. Hell i π enheter maling og hornet er fullt; prøv å male utsiden, og du blir aldri ferdig.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "V = π ∫₁^∞ 1/x² dx = π — konvergent, endelig. A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx ≥ 2π ∫₁^∞ 1/x dx = ∞ — den harmoniske integralen, divergent.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Torricelli kunngjorde resultatet i 1641, flere tiår før analysen hadde et navn. Hobbes og Wallis kranglet bittert om hva det kunne bety. Det var første sted uendeligheten sluttet å oppføre seg.",
      },
    ],
    tryIt: "Under: dra hornet, dra X_max, og se ett tall legge seg mens det andre rømmer.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Formen",
      title: "y = 1/x, dreid rundt aksen",
      body: "Ta hyperbelen y = 1/x på x ∈ [1, ∞). Drei den rundt x-aksen. Hvert tverrsnitt vinkelrett på aksen er en skive med radius 1/x. Hornet vider seg i x = 1 ut til en munning med radius 1 og avtar for alltid mot null — en slank trompet som aldri helt lukker seg.",
    },
    {
      pretitle: "Avsnitt 02 · Volum med skiver",
      title: "V = π ∫₁^∞ 1/x² dx = π",
      body: "Del hornet i tynne skiver med tykkelse dx. Hver har areal π/x² og volum π/x² · dx. Summen er π · [−1/x]₁^∞ = π. Kvadratene forsvinner raskt nok — integralet konvergerer. Hele det uendelige hornet rommer nøyaktig π kubikkenheter.",
    },
    {
      pretitle: "Avsnitt 03 · Overflate med kjeglestumper",
      title: "A = 2π ∫₁^∞ 1/x · √(1+1/x⁴) dx = ∞",
      body: "Integranden for mantelarealet har en rotfaktor som alltid er ≥ 1, så A ≥ 2π ∫₁^∞ 1/x dx = 2π · [ln x]₁^∞. Det er den harmoniske integralen — og den divergerer. Overflaten vokser uten grense.",
    },
    {
      pretitle: "Avsnitt 04 · Malerens paradoks",
      title: "Fyll ja, mal aldri — og hvorfor det er greit",
      body: "Ekte maling har tykkelse ε. Å dekke en uendelig flate med et lag på ε > 0 krever uendelig volum — ingen motsetning til A = ∞. Den matematiske «fyllingen» bruker maling med tykkelse null på veggen; i den grensen er innerveggen den samme uendelige flaten, bare nærmet på annet vis. Slipp den fysiske antakelsen og paradokset løser seg opp.",
    },
    {
      pretitle: "Avsnitt 05 · Generaliseringer",
      title: "y = 1/xᵏ — når konvergerer V og A?",
      body: "Bytt 1/x med 1/xᵏ og regn integralene på nytt. Volumintegralet ∫ 1/x²ᵏ dx konvergerer hvis og bare hvis 2k > 1, altså k > 1/2. Overflateintegralet ∫ 1/xᵏ dx konvergerer hvis og bare hvis k > 1. Paradokset lever akkurat i sprekken: 1/2 < k ≤ 1 gir endelig volum og uendelig overflate.",
    },
    {
      pretitle: "Avsnitt 06 · Forbindelser",
      title: "Kochs snøfnugg — 2D-fetteren",
      body: "Kochs snøfnugg omslutter et endelig areal med uendelig omkrets — samme endelig-mot-uendelig-spalting, ett hakk ned i dimensjon. Begge er tidlige hint om at mål og form kan dra i ulike retninger på overraskende vis. Torricellis horn kom først; snøfnugget dukket opp i 1904.",
    },
  ],
  volumeIntegralPretitle: "Volumintegralet",
  volumeIntegralNote:
    "Hvert tverrsnitt er en skive med radius 1/x. Kvadreringen driver radiene mot null raskt nok til at summen konvergerer.",
  surfaceIntegralPretitle: "Overflateintegralet",
  surfaceIntegralNote:
    "Den nedre grensen er det harmoniske integralet, den kontinuerlige fetteren til 1 + 1/2 + 1/3 + … Det divergerer og drar overflaten med seg mot uendeligheten.",
  hornCaption: "Interaktivt · dra for å rotere, dra X_max",
  hornXMaxLabel: "X_max",
  hornVolumeLabel: "V(X) → π",
  hornAreaLabel: "A(X) → ∞",
  hornHint:
    "V(X) = π(1 − 1/X) legger seg mot π. A(X) klatrer videre, nedad begrenset av 2π · ln X.",
  growGraphCaption: "V(X) mot A(X) — én legger seg, den andre rømmer",
  growLegendV: "V(X) → π",
  growLegendA: "A(X) → ∞",
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren kutter hornet ved hvilket som helst X du velger, tegner sideprofilen og følger V og A live. Skyv X mot horisonten og kjenn asymmetrien lande.",
  closingCta: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function GabrielsHornStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/gabrielshorn/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="V = π  ·  A = ∞"
      formulaLatex={"V = \\pi, \\quad A = \\infty"}
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
              <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-rose/40">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
                  {card.label}
                </div>
                <h3 className="math-italic text-2xl leading-snug text-ink-100">{card.title}</h3>
                <p className="text-sm leading-relaxed text-ink-200">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Section 01 — the shape */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — volume by disks */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.volumeIntegralPretitle}
            </div>
            <div className="math-italic text-2xl leading-snug text-ink-100 md:text-3xl">
              V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.volumeIntegralNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — surface area + INLINE HORN RENDERER */}
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
              {story.surfaceIntegralPretitle}
            </div>
            <div className="math-italic text-xl leading-snug text-ink-100 md:text-2xl">
              A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx ≥ 2π ∫₁^∞ (1/x) dx = ∞
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.surfaceIntegralNote}
            </p>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <GabrielsHornRenderer
            caption={story.hornCaption}
            xMaxLabel={story.hornXMaxLabel}
            volumeLabel={story.hornVolumeLabel}
            areaLabel={story.hornAreaLabel}
            hint={story.hornHint}
          />
        </Reveal>
      </section>

      {/* Section 04 — paint paradox */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 05 — generalizations + INLINE GROW GRAPH */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <GabrielsHornGrowGraph
            caption={story.growGraphCaption}
            legendV={story.growLegendV}
            legendA={story.growLegendA}
          />
        </Reveal>
      </section>

      {/* Section 06 — Koch snowflake parallel */}
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
            href="/gabrielshorn/explorer"
            className="inline-block rounded-full border border-signal-rose/70 bg-signal-rose/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/25"
          >
            {story.closingCta}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
