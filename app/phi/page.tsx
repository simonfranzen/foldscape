"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { PhiSunflowerSim } from "@/components/PhiSunflowerSim";
import { PhiFibonacciConvergence } from "@/components/PhiFibonacciConvergence";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Per-locale long-form copy. The hero (pretitle/title/tagline/intro) still
// comes from the shared stories.ts dictionary; everything below is authored
// here so the φ page can tell its full story without bloating the bundle.
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
  sunflower: {
    caption: string;
    angleLabel: string;
    seedsLabel: string;
    goldenLabel: string;
    hint: string;
  };
  fibonacci: {
    caption: string;
    nLabel: string;
    ratioHeader: string;
    diffHeader: string;
    hint: string;
    spiralCaption: string;
  };
  firstNumbersLabel: string;
  continuedFractionLabel: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "Golden Ratio & Fibonacci",
    tagline: "One simple recurrence. The ratio that hides everywhere.",
    intro:
      "The Explorer follows the Fibonacci sequence as its consecutive ratios close in on φ, draws the golden spiral built from nested Fibonacci squares, and lets you tilt the sunflower phyllotaxis pattern by the golden angle. Three views, one number — and the difference between where φ really shows up and where the infographics oversell it.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "One simple recurrence. A number that hides almost everywhere.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Start with 0 and 1, then keep adding the last two numbers. The ratio of consecutive terms closes in on one fixed irrational — φ ≈ 1.618. Same number, every starting pair (almost).",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Divide each by the one before: 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619. The ratios bounce above and below φ and tighten on it geometrically.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "φ is provably the hardest number to approximate by fractions — the “most irrational” one. That is exactly why sunflowers, pinecones, and many leaves space their parts by the golden angle: it leaves no gap, no preferred direction.",
      },
    ],
    tryIt:
      "Below: ride the ratios into φ, then tilt a sunflower to feel the golden angle do its work.",
  },
  sections: [
    {
      pretitle: "Section 01 · The recurrence",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Pick a starting pair — the standard one is F₀ = 0, F₁ = 1 — and then each new term is the sum of the previous two. That single rule generates 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … forever. No multiplication, no special functions, no growth constant baked in — and yet the sequence already encodes φ inside the addition.",
    },
    {
      pretitle: "Section 02 · Why the ratios converge",
      title: "Solve x² = x + 1 and the limit falls out",
      body: "Suppose the ratio Fₙ₊₁/Fₙ settles on some number x. Divide the recurrence by Fₙ: it forces x = 1 + 1/x, i.e. x² = x + 1. The positive root is φ = (1 + √5)/2 ≈ 1.618, the negative root ψ = (1 − √5)/2 ≈ −0.618 decays away. Binet's formula Fₙ = (φⁿ − ψⁿ)/√5 confirms it exactly.",
    },
    {
      pretitle: "Section 03 · The most irrational number",
      title: "Continued fraction [1; 1, 1, 1, …]",
      body: "Every irrational has a continued-fraction expansion; the bigger its terms, the better it is approximated by simple fractions. φ has the smallest possible terms — all ones — so it is the slowest of all numbers to approximate. That sounds abstract; it is exactly the property a plant needs to space leaves without any two ever shadowing each other.",
    },
    {
      pretitle: "Section 04 · Sunflowers and the 137.5° angle",
      title: "Turn by 360°/φ² between seeds",
      body: "Place seed n at radius √n and rotate by a fixed angle α from the previous one. If α is any rational fraction of a turn, seeds line up on a few radial spokes and leave gaps. Choose α = 360°/φ² ≈ 137.508° and the most-irrational property of φ guarantees the seeds never align — they pack densely, uniformly, with no preferred direction. The simulator below makes the failure modes painfully visible.",
    },
    {
      pretitle: "Section 05 · The golden rectangle and spiral",
      title: "Nested Fibonacci squares trace a logarithmic curve",
      body: "Lay down squares of side F₁, F₂, F₃, F₄, … in a clockwise pinwheel. Their outline is a rectangle whose aspect ratio tends to φ, and the quarter-circles inscribed in each square stitch together into the “golden spiral” — a discrete cousin of the true logarithmic spiral r = φ^(2θ/π). The chart on the right shows the ratio converging while the spiral grows.",
    },
    {
      pretitle: "Section 06 · Where φ really is — and where it isn't",
      title: "Robust biology vs. retrofitted mythology",
      body: "The Parthenon, the Mona Lisa, the nautilus shell — the famous “golden ratio in art” fits are mostly confirmation bias and rounded measurements. Where φ genuinely lives is in growth and packing: phyllotaxis, continued-fraction theory, Penrose tilings and quasicrystals. Real, narrower than the posters suggest, and far more interesting than the mythology.",
    },
  ],
  sunflower: {
    caption: "Interactive · sunflower phyllotaxis",
    angleLabel: "Divergence angle α",
    seedsLabel: "Seed count",
    goldenLabel: "Golden",
    hint: "Drag the angle 1° away from golden and watch radial spokes appear. Snap back to 137.51° and the spokes dissolve into a uniform tiling.",
  },
  fibonacci: {
    caption: "Interactive · ratios converging on φ",
    nLabel: "Number of terms N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "ratio − φ",
    hint: "The error alternates sign and shrinks by |ψ/φ| ≈ 0.382 each step; over two steps (same sign) that compounds to (ψ/φ)² ≈ 0.146 — a clean geometric convergence. The spiral on the right is built from the first few Fibonacci squares.",
    spiralCaption: "Golden spiral from Fibonacci squares",
  },
  firstNumbersLabel: "First Fibonacci numbers",
  continuedFractionLabel: "Continued fraction",
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you sweep the divergence angle continuously, watch the consecutive ratios close in on φ, and grow the golden spiral to any depth. Everything you just read is one click away.",
  closingCta: "→ Open the Explorer",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "Goldener Schnitt & Fibonacci",
    tagline: "Eine einfache Rekursion. Das Verhältnis, das sich überall versteckt.",
    intro:
      "Der Explorer folgt der Fibonacci-Folge, während ihre aufeinanderfolgenden Verhältnisse sich φ nähern, zeichnet die goldene Spirale aus verschachtelten Fibonacci-Quadraten und lässt dich das Sonnenblumen-Phyllotaxismuster um den goldenen Winkel kippen. Drei Ansichten, eine Zahl — und der Unterschied zwischen den Stellen, wo φ wirklich auftaucht, und denen, wo Infografiken übertreiben.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Eine einfache Rekursion. Eine Zahl, die sich überall versteckt.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Starte mit 0 und 1, dann addiere immer die letzten beiden Zahlen. Das Verhältnis aufeinanderfolgender Glieder läuft auf eine feste irrationale Zahl zu — φ ≈ 1,618. Immer dieselbe Zahl, egal welches Startpaar (fast).",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Teile jedes durch das vorherige: 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. Die Verhältnisse springen über und unter φ und ziehen sich geometrisch um φ zusammen.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "φ ist nachweislich die am schwersten durch Brüche approximierbare Zahl — die «irrationalste». Genau deshalb verteilen Sonnenblumen, Tannenzapfen und viele Blätter ihre Teile im goldenen Winkel: keine Lücke, keine Vorzugsrichtung.",
      },
    ],
    tryIt:
      "Unten: reite die Verhältnisse in φ hinein, dann verstelle den goldenen Winkel und sieh, was die Sonnenblume tut.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Rekursion",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Wähl ein Startpaar — Standard ist F₀ = 0, F₁ = 1 — und jedes neue Glied ist die Summe der beiden vorherigen. Diese eine Regel erzeugt 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … für immer. Keine Multiplikation, keine Spezialfunktionen, keine eingebackene Wachstumskonstante — und trotzdem steckt φ schon in der Addition.",
    },
    {
      pretitle: "Abschnitt 02 · Warum die Verhältnisse konvergieren",
      title: "Löse x² = x + 1 und der Grenzwert fällt heraus",
      body: "Angenommen, das Verhältnis Fₙ₊₁/Fₙ stabilisiert sich auf einen Wert x. Teil die Rekursion durch Fₙ: das erzwingt x = 1 + 1/x, also x² = x + 1. Die positive Lösung ist φ = (1 + √5)/2 ≈ 1,618, die negative ψ = (1 − √5)/2 ≈ −0,618 klingt ab. Binets Formel Fₙ = (φⁿ − ψⁿ)/√5 bestätigt es exakt.",
    },
    {
      pretitle: "Abschnitt 03 · Die irrationalste Zahl",
      title: "Kettenbruch [1; 1, 1, 1, …]",
      body: "Jede Irrationale hat eine Kettenbruchentwicklung; je größer ihre Glieder, desto besser ist sie durch einfache Brüche approximierbar. φ hat die kleinstmöglichen Glieder — lauter Einsen — und ist damit die langsamste aller Zahlen, sich approximieren zu lassen. Klingt abstrakt; ist genau die Eigenschaft, die eine Pflanze braucht, damit kein Blatt das andere beschattet.",
    },
    {
      pretitle: "Abschnitt 04 · Sonnenblumen und der 137,5°-Winkel",
      title: "Drehe um 360°/φ² zwischen den Samen",
      body: "Setz Samen n auf Radius √n und dreh ihn um einen festen Winkel α gegen den vorigen. Ist α ein rationaler Bruchteil einer Umdrehung, reihen sich die Samen auf wenigen Speichen auf und lassen Lücken. Wähl α = 360°/φ² ≈ 137,508°, und die «irrationalste» Eigenschaft von φ garantiert, dass sich die Samen nie ausrichten — sie packen sich dicht, gleichmäßig, ohne Vorzugsrichtung. Der Simulator unten zeigt die Fehlermodi schmerzhaft deutlich.",
    },
    {
      pretitle: "Abschnitt 05 · Goldenes Rechteck und Spirale",
      title: "Geschachtelte Fibonacci-Quadrate zeichnen eine logarithmische Kurve",
      body: "Leg Quadrate der Seite F₁, F₂, F₃, F₄, … im Uhrzeigersinn an. Ihr Umriss ist ein Rechteck, dessen Seitenverhältnis gegen φ läuft, und die Viertelkreise in jedem Quadrat ergeben zusammen die «goldene Spirale» — die diskrete Verwandte der echten logarithmischen Spirale r = φ^(2θ/π). Die Grafik rechts zeigt die Konvergenz, während die Spirale wächst.",
    },
    {
      pretitle: "Abschnitt 06 · Wo φ wirklich ist — und wo nicht",
      title: "Robuste Biologie gegen rückwirkende Mythologie",
      body: "Parthenon, Mona Lisa, Nautilus-Schale — die berühmten «goldener Schnitt in der Kunst»-Belege sind meist Bestätigungsfehler und gerundete Messungen. Wo φ ehrlich lebt, ist in Wachstum und Packung: Phyllotaxis, Kettenbruchtheorie, Penrose-Parkettierungen und Quasikristalle. Echt, schmaler als die Plakate behaupten, und weit interessanter als die Mythologie.",
    },
  ],
  sunflower: {
    caption: "Interaktiv · Sonnenblumen-Phyllotaxis",
    angleLabel: "Divergenzwinkel α",
    seedsLabel: "Samenanzahl",
    goldenLabel: "Golden",
    hint: "Zieh den Winkel 1° vom goldenen weg und sieh, wie radiale Speichen entstehen. Spring zurück auf 137,51° und die Speichen lösen sich in eine gleichmäßige Kachelung auf.",
  },
  fibonacci: {
    caption: "Interaktiv · Verhältnisse, die gegen φ laufen",
    nLabel: "Anzahl der Glieder N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "Verhältnis − φ",
    hint: "Der Fehler wechselt das Vorzeichen und schrumpft pro Schritt um |ψ/φ| ≈ 0,382; über zwei Schritte (gleiches Vorzeichen) ergibt das den Faktor (ψ/φ)² ≈ 0,146 — eine saubere geometrische Konvergenz. Die Spirale rechts entsteht aus den ersten Fibonacci-Quadraten.",
    spiralCaption: "Goldene Spirale aus Fibonacci-Quadraten",
  },
  firstNumbersLabel: "Erste Fibonacci-Zahlen",
  continuedFractionLabel: "Kettenbruch",
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich den Divergenzwinkel kontinuierlich durchziehen, den aufeinanderfolgenden Verhältnissen beim Zulaufen auf φ zusehen und die goldene Spirale auf jede Tiefe wachsen lassen. Alles, was du gerade gelesen hast, ist einen Klick entfernt.",
  closingCta: "→ Explorer öffnen",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "Razón áurea y Fibonacci",
    tagline: "Una recurrencia simple. La razón que se esconde por todas partes.",
    intro:
      "El Explorador sigue la sucesión de Fibonacci mientras sus razones consecutivas se acercan a φ, dibuja la espiral áurea construida con cuadrados de Fibonacci anidados, y te permite inclinar el patrón de filotaxis del girasol por el ángulo áureo. Tres vistas, un número — y la diferencia entre donde φ realmente aparece y donde las infografías exageran.",
    ctaInteractive: "→ Abre el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Una recurrencia simple. Un número que se esconde en casi todas partes.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Empieza con 0 y 1, y suma siempre los dos últimos. La razón entre términos consecutivos se acerca a un irracional fijo — φ ≈ 1,618. El mismo número, sea cual sea el par inicial (casi).",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Divide cada uno por el anterior: 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. Las razones rebotan por encima y debajo de φ y se ajustan a él geométricamente.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "φ es demostrablemente el número más difícil de aproximar por fracciones — el «más irracional». Por eso girasoles, piñas y muchas hojas separan sus partes con el ángulo áureo: ni hueco ni dirección preferida.",
      },
    ],
    tryIt:
      "Abajo: cabalga las razones hasta φ y luego inclina un girasol para sentir el ángulo áureo trabajando.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La recurrencia",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Toma un par inicial — el estándar es F₀ = 0, F₁ = 1 — y cada nuevo término es la suma de los dos anteriores. Esa única regla genera 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … sin fin. Sin multiplicación, sin funciones especiales, sin constante de crecimiento incrustada — y aun así φ ya vive dentro de la suma.",
    },
    {
      pretitle: "Sección 02 · Por qué las razones convergen",
      title: "Resuelve x² = x + 1 y aparece el límite",
      body: "Supón que la razón Fₙ₊₁/Fₙ se estabiliza en un valor x. Divide la recurrencia por Fₙ: obliga a x = 1 + 1/x, es decir x² = x + 1. La raíz positiva es φ = (1 + √5)/2 ≈ 1,618, la negativa ψ = (1 − √5)/2 ≈ −0,618 se desvanece. La fórmula de Binet Fₙ = (φⁿ − ψⁿ)/√5 lo confirma exactamente.",
    },
    {
      pretitle: "Sección 03 · El número más irracional",
      title: "Fracción continua [1; 1, 1, 1, …]",
      body: "Todo irracional tiene un desarrollo en fracción continua; cuanto mayores sus términos, mejor se aproxima por fracciones simples. φ tiene los términos más pequeños posibles — todos unos — y es por tanto el número más lento de aproximar de todos. Suena abstracto; es justo la propiedad que necesita una planta para que ninguna hoja sombree a otra.",
    },
    {
      pretitle: "Sección 04 · Girasoles y el ángulo de 137,5°",
      title: "Gira 360°/φ² entre semillas",
      body: "Coloca la semilla n a radio √n y gírala un ángulo fijo α respecto a la anterior. Si α es una fracción racional de vuelta, las semillas se alinean en pocos radios y dejan huecos. Elige α = 360°/φ² ≈ 137,508° y la propiedad de φ de ser «el más irracional» garantiza que nunca se alinean — se empaquetan densas, uniformes, sin dirección preferida. El simulador de abajo hace los modos de fallo dolorosamente visibles.",
    },
    {
      pretitle: "Sección 05 · El rectángulo y la espiral áureos",
      title: "Cuadrados de Fibonacci anidados trazan una curva logarítmica",
      body: "Apila cuadrados de lado F₁, F₂, F₃, F₄, … en molinete horario. Su contorno es un rectángulo cuya razón tiende a φ, y los cuartos de círculo inscritos en cada cuadrado se cosen en la «espiral áurea» — prima discreta de la verdadera espiral logarítmica r = φ^(2θ/π). El gráfico de la derecha muestra la razón convergiendo mientras la espiral crece.",
    },
    {
      pretitle: "Sección 06 · Dónde está φ de verdad — y dónde no",
      title: "Biología robusta vs. mitología retroajustada",
      body: "El Partenón, la Mona Lisa, la concha del nautilo — los famosos ajustes del «número áureo en el arte» son sobre todo sesgo de confirmación y medidas redondeadas. Donde φ vive de verdad es en el crecimiento y el empaquetado: filotaxia, teoría de fracciones continuas, teselaciones de Penrose y cuasicristales. Real, más estrecho de lo que sugieren los pósters, y mucho más interesante que la mitología.",
    },
  ],
  sunflower: {
    caption: "Interactivo · filotaxia del girasol",
    angleLabel: "Ángulo de divergencia α",
    seedsLabel: "Número de semillas",
    goldenLabel: "Áureo",
    hint: "Aparta el ángulo 1° del áureo y mira aparecer los radios. Vuelve a 137,51° y los radios se disuelven en un teselado uniforme.",
  },
  fibonacci: {
    caption: "Interactivo · razones convergiendo a φ",
    nLabel: "Número de términos N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "razón − φ",
    hint: "El error alterna de signo y encoge en |ψ/φ| ≈ 0,382 a cada paso; en dos pasos (mismo signo) eso compone (ψ/φ)² ≈ 0,146 — una convergencia geométrica limpia. La espiral de la derecha sale de los primeros cuadrados de Fibonacci.",
    spiralCaption: "Espiral áurea desde cuadrados de Fibonacci",
  },
  firstNumbersLabel: "Primeros números de Fibonacci",
  continuedFractionLabel: "Fracción continua",
  closingPretitle: "Ve más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja barrer el ángulo de divergencia de continuo, ver las razones consecutivas acercarse a φ y hacer crecer la espiral áurea a cualquier profundidad. Todo lo que acabas de leer está a un clic.",
  closingCta: "→ Abrir el Explorador",
};

const fr: RichStory = {
  page: {
    pretitle: "Thème · Géométrie",
    title: "Nombre d'or & Fibonacci",
    tagline: "Une récurrence simple. Le rapport qui se cache partout.",
    intro:
      "L'Explorateur suit la suite de Fibonacci tandis que ses rapports consécutifs se rapprochent de φ, trace la spirale d'or construite à partir de carrés de Fibonacci imbriqués, et te laisse incliner le motif de phyllotaxie du tournesol par l'angle d'or. Trois vues, un nombre — et la différence entre les endroits où φ apparaît vraiment et ceux où les infographies en font trop.",
    ctaInteractive: "→ Ouvre l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Une récurrence simple. Un nombre qui se cache presque partout.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Pars de 0 et 1, puis ajoute toujours les deux derniers nombres. Le rapport de termes consécutifs se rapproche d'un irrationnel fixe — φ ≈ 1,618. Le même nombre, quel que soit le couple de départ (presque).",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Divise chacun par le précédent : 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. Les rapports rebondissent au-dessus et en dessous de φ et se resserrent géométriquement autour.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "φ est démontrablement le nombre le plus dur à approcher par fractions — le « plus irrationnel ». C'est exactement pour cela que tournesols, pommes de pin et de nombreuses feuilles espacent leurs éléments selon l'angle d'or : aucun vide, aucune direction privilégiée.",
      },
    ],
    tryIt:
      "Ci-dessous : chevauche les rapports vers φ, puis incline un tournesol pour sentir l'angle d'or à l'œuvre.",
  },
  sections: [
    {
      pretitle: "Section 01 · La récurrence",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Choisis un couple de départ — le standard est F₀ = 0, F₁ = 1 — et chaque nouveau terme est la somme des deux précédents. Cette seule règle engendre 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … pour toujours. Pas de multiplication, pas de fonction spéciale, pas de constante de croissance cachée — et pourtant φ vit déjà dans l'addition.",
    },
    {
      pretitle: "Section 02 · Pourquoi les rapports convergent",
      title: "Résous x² = x + 1 et la limite tombe",
      body: "Suppose que le rapport Fₙ₊₁/Fₙ se stabilise sur un x. Divise la récurrence par Fₙ : cela impose x = 1 + 1/x, soit x² = x + 1. La racine positive est φ = (1 + √5)/2 ≈ 1,618, la racine négative ψ = (1 − √5)/2 ≈ −0,618 s'estompe. La formule de Binet Fₙ = (φⁿ − ψⁿ)/√5 le confirme exactement.",
    },
    {
      pretitle: "Section 03 · Le nombre le plus irrationnel",
      title: "Fraction continue [1; 1, 1, 1, …]",
      body: "Tout irrationnel a un développement en fraction continue ; plus ses termes sont grands, mieux il s'approche par des fractions simples. φ a les plus petits termes possibles — que des un — et c'est donc le nombre le plus lent à approcher. Cela paraît abstrait ; c'est précisément la propriété dont une plante a besoin pour qu'aucune feuille n'en ombrage une autre.",
    },
    {
      pretitle: "Section 04 · Tournesols et l'angle de 137,5°",
      title: "Tourne de 360°/φ² entre les graines",
      body: "Place la graine n au rayon √n et tourne-la d'un angle fixe α par rapport à la précédente. Si α est une fraction rationnelle de tour, les graines s'alignent sur quelques rayons et laissent des vides. Choisis α = 360°/φ² ≈ 137,508° et la propriété de φ d'être « le plus irrationnel » garantit qu'elles ne s'alignent jamais — elles s'empilent denses, uniformes, sans direction privilégiée. Le simulateur ci-dessous rend les modes d'échec douloureusement visibles.",
    },
    {
      pretitle: "Section 05 · Rectangle et spirale d'or",
      title: "Des carrés de Fibonacci imbriqués tracent une courbe logarithmique",
      body: "Empile des carrés de côtés F₁, F₂, F₃, F₄, … en moulinet horaire. Leur contour est un rectangle dont le rapport tend vers φ, et les quarts de cercle inscrits dans chaque carré se cousent en une « spirale d'or » — cousine discrète de la vraie spirale logarithmique r = φ^(2θ/π). Le graphe à droite montre le rapport converger pendant que la spirale grandit.",
    },
    {
      pretitle: "Section 06 · Où φ est vraiment — et où il n'est pas",
      title: "Biologie solide vs. mythologie a posteriori",
      body: "Le Parthénon, la Joconde, la coquille du nautile — les fameux ajustements du « nombre d'or dans l'art » relèvent surtout du biais de confirmation et de mesures arrondies. Là où φ vit vraiment, c'est dans la croissance et l'empilement : phyllotaxie, théorie des fractions continues, pavages de Penrose et quasicristaux. Réel, plus étroit que ne le clament les affiches, et bien plus intéressant que la mythologie.",
    },
  ],
  sunflower: {
    caption: "Interactif · phyllotaxie du tournesol",
    angleLabel: "Angle de divergence α",
    seedsLabel: "Nombre de graines",
    goldenLabel: "D'or",
    hint: "Éloigne l'angle de 1° de l'angle d'or et regarde les rayons radiaux apparaître. Reviens à 137,51° et ils se dissolvent en un pavage uniforme.",
  },
  fibonacci: {
    caption: "Interactif · rapports convergeant vers φ",
    nLabel: "Nombre de termes N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "rapport − φ",
    hint: "L'erreur change de signe et rétrécit d'environ |ψ/φ| ≈ 0,382 à chaque pas ; sur deux pas (même signe) cela donne le facteur (ψ/φ)² ≈ 0,146 — une convergence géométrique nette. La spirale à droite est faite des premiers carrés de Fibonacci.",
    spiralCaption: "Spirale d'or à partir des carrés de Fibonacci",
  },
  firstNumbersLabel: "Premiers nombres de Fibonacci",
  continuedFractionLabel: "Fraction continue",
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse balayer l'angle de divergence en continu, voir les rapports consécutifs se rapprocher de φ, et faire grandir la spirale d'or à toute profondeur. Tout ce que tu viens de lire est à un clic.",
  closingCta: "→ Ouvrir l'Explorateur",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Sezione aurea & Fibonacci",
    tagline: "Una semplice ricorrenza. Il rapporto che si nasconde ovunque.",
    intro:
      "L'Esploratore segue la successione di Fibonacci mentre i suoi rapporti consecutivi si avvicinano a φ, disegna la spirale aurea costruita con quadrati di Fibonacci annidati, e ti permette di inclinare il pattern di fillotassi del girasole secondo l'angolo aureo. Tre viste, un numero — e la differenza tra i posti dove φ appare davvero e dove le infografiche esagerano.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Una ricorrenza semplice. Un numero che si nasconde quasi ovunque.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Parti da 0 e 1, e somma sempre gli ultimi due. Il rapporto fra termini consecutivi si avvicina a un irrazionale fisso — φ ≈ 1,618. Lo stesso numero, qualunque sia la coppia di partenza (quasi).",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Dividi ciascuno per il precedente: 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. I rapporti rimbalzano sopra e sotto φ e si stringono geometricamente attorno a esso.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "φ è dimostrabilmente il numero più difficile da approssimare con frazioni — il «più irrazionale». È esattamente per questo che girasoli, pigne e molte foglie distanziano le proprie parti con l'angolo aureo: né vuoti né direzione preferita.",
      },
    ],
    tryIt:
      "Sotto: cavalca i rapporti dentro φ, poi inclina un girasole per sentire l'angolo aureo all'opera.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La ricorrenza",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Scegli una coppia iniziale — quella standard è F₀ = 0, F₁ = 1 — e ogni nuovo termine è la somma dei due precedenti. Quella singola regola genera 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … per sempre. Nessuna moltiplicazione, nessuna funzione speciale, nessuna costante di crescita nascosta — eppure φ vive già nella somma.",
    },
    {
      pretitle: "Sezione 02 · Perché i rapporti convergono",
      title: "Risolvi x² = x + 1 e il limite salta fuori",
      body: "Supponi che il rapporto Fₙ₊₁/Fₙ si stabilizzi su un valore x. Dividi la ricorrenza per Fₙ: forza x = 1 + 1/x, cioè x² = x + 1. La radice positiva è φ = (1 + √5)/2 ≈ 1,618, quella negativa ψ = (1 − √5)/2 ≈ −0,618 si spegne. La formula di Binet Fₙ = (φⁿ − ψⁿ)/√5 lo conferma in modo esatto.",
    },
    {
      pretitle: "Sezione 03 · Il numero più irrazionale",
      title: "Frazione continua [1; 1, 1, 1, …]",
      body: "Ogni irrazionale ha uno sviluppo in frazione continua; più grandi sono i suoi termini, meglio si approssima con frazioni semplici. φ ha i termini più piccoli possibili — tutti uno — e quindi è il numero più lento da approssimare. Sembra astratto; è esattamente la proprietà che serve a una pianta perché nessuna foglia ne ombreggi un'altra.",
    },
    {
      pretitle: "Sezione 04 · Girasoli e l'angolo di 137,5°",
      title: "Ruota di 360°/φ² fra i semi",
      body: "Metti il seme n al raggio √n e ruotalo di un angolo fisso α rispetto al precedente. Se α è una frazione razionale di giro, i semi si allineano su pochi raggi e lasciano vuoti. Scegli α = 360°/φ² ≈ 137,508° e la proprietà di φ di essere «il più irrazionale» garantisce che non si allineano mai — si impacchettano densi, uniformi, senza direzione preferita. Il simulatore sotto rende i modi di fallimento dolorosamente visibili.",
    },
    {
      pretitle: "Sezione 05 · Rettangolo e spirale aurei",
      title: "Quadrati di Fibonacci annidati tracciano una curva logaritmica",
      body: "Disponi quadrati di lato F₁, F₂, F₃, F₄, … a mulinello orario. Il loro contorno è un rettangolo il cui rapporto tende a φ, e i quarti di cerchio inscritti in ciascun quadrato si cuciono nella «spirale aurea» — cugina discreta della vera spirale logaritmica r = φ^(2θ/π). Il grafico a destra mostra il rapporto convergere mentre la spirale cresce.",
    },
    {
      pretitle: "Sezione 06 · Dove φ è davvero — e dove no",
      title: "Biologia robusta vs. mitologia retroadattata",
      body: "Il Partenone, la Gioconda, la conchiglia del nautilus — i famosi adattamenti del «numero aureo nell'arte» sono soprattutto bias di conferma e misure arrotondate. Dove φ vive davvero è nella crescita e nell'impacchettamento: fillotassi, teoria delle frazioni continue, tassellazioni di Penrose e quasicristalli. Reale, più stretto di quanto i poster suggeriscano, e molto più interessante della mitologia.",
    },
  ],
  sunflower: {
    caption: "Interattivo · fillotassi del girasole",
    angleLabel: "Angolo di divergenza α",
    seedsLabel: "Numero di semi",
    goldenLabel: "Aureo",
    hint: "Sposta l'angolo di 1° dall'aureo e guarda comparire i raggi. Torna a 137,51° e i raggi si sciolgono in una tassellazione uniforme.",
  },
  fibonacci: {
    caption: "Interattivo · rapporti che convergono a φ",
    nLabel: "Numero di termini N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "rapporto − φ",
    hint: "L'errore alterna segno e si restringe di |ψ/φ| ≈ 0,382 a ogni passo; su due passi (stesso segno) si compone in (ψ/φ)² ≈ 0,146 — una convergenza geometrica pulita. La spirale a destra nasce dai primi quadrati di Fibonacci.",
    spiralCaption: "Spirale aurea dai quadrati di Fibonacci",
  },
  firstNumbersLabel: "Primi numeri di Fibonacci",
  continuedFractionLabel: "Frazione continua",
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia spazzolare l'angolo di divergenza in continuo, vedere i rapporti consecutivi avvicinarsi a φ e far crescere la spirale aurea a ogni profondità. Tutto ciò che hai appena letto è a un clic.",
  closingCta: "→ Apri l'Esploratore",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "Razão áurea & Fibonacci",
    tagline: "Uma recorrência simples. A razão que se esconde em toda parte.",
    intro:
      "O Explorador segue a sequência de Fibonacci enquanto suas razões consecutivas se aproximam de φ, desenha a espiral áurea construída com quadrados de Fibonacci aninhados, e te permite inclinar o padrão de filotaxia do girassol pelo ângulo áureo. Três vistas, um número — e a diferença entre onde φ realmente aparece e onde os infográficos exageram.",
    ctaInteractive: "→ Abre o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Uma recorrência simples. Um número que se esconde em quase tudo.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Começa em 0 e 1 e soma sempre os dois últimos. A razão entre termos consecutivos aproxima-se de um irracional fixo — φ ≈ 1,618. O mesmo número, seja qual for o par inicial (quase).",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Divide cada um pelo anterior: 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. As razões saltam acima e abaixo de φ e apertam-se geometricamente em torno dele.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "φ é, demonstravelmente, o número mais difícil de aproximar por frações — o «mais irracional». É exatamente por isso que girassóis, pinhas e muitas folhas separam as suas partes pelo ângulo áureo: sem vazios, sem direção preferida.",
      },
    ],
    tryIt:
      "Abaixo: cavalga as razões até φ e depois inclina um girassol para sentir o ângulo áureo a trabalhar.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A recorrência",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Escolhe um par inicial — o padrão é F₀ = 0, F₁ = 1 — e cada novo termo é a soma dos dois anteriores. Essa regra única gera 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … sem fim. Nenhuma multiplicação, nenhuma função especial, nenhuma constante de crescimento escondida — e ainda assim φ já vive dentro da soma.",
    },
    {
      pretitle: "Secção 02 · Porque as razões convergem",
      title: "Resolve x² = x + 1 e o limite cai",
      body: "Supõe que a razão Fₙ₊₁/Fₙ se fixa num valor x. Divide a recorrência por Fₙ: força x = 1 + 1/x, isto é x² = x + 1. A raiz positiva é φ = (1 + √5)/2 ≈ 1,618, a negativa ψ = (1 − √5)/2 ≈ −0,618 desvanece-se. A fórmula de Binet Fₙ = (φⁿ − ψⁿ)/√5 confirma-o exatamente.",
    },
    {
      pretitle: "Secção 03 · O número mais irracional",
      title: "Fração contínua [1; 1, 1, 1, …]",
      body: "Todo irracional tem um desenvolvimento em fração contínua; quanto maiores os seus termos, melhor é aproximado por frações simples. φ tem os termos mais pequenos possíveis — só uns — e por isso é o número mais lento a aproximar. Soa abstrato; é exatamente a propriedade de que uma planta precisa para que nenhuma folha sombreie outra.",
    },
    {
      pretitle: "Secção 04 · Girassóis e o ângulo de 137,5°",
      title: "Roda 360°/φ² entre sementes",
      body: "Coloca a semente n no raio √n e roda-a de um ângulo fixo α em relação à anterior. Se α for uma fração racional de volta, as sementes alinham-se em poucos raios e deixam vazios. Escolhe α = 360°/φ² ≈ 137,508° e a propriedade de φ de ser «o mais irracional» garante que nunca se alinham — empacotam-se densas, uniformes, sem direção preferida. O simulador abaixo torna os modos de falha dolorosamente visíveis.",
    },
    {
      pretitle: "Secção 05 · Retângulo e espiral áureos",
      title: "Quadrados de Fibonacci encaixados traçam uma curva logarítmica",
      body: "Empilha quadrados de lado F₁, F₂, F₃, F₄, … em moinho horário. O seu contorno é um retângulo cuja razão tende para φ, e os quartos de círculo inscritos em cada quadrado costuram-se na «espiral áurea» — prima discreta da verdadeira espiral logarítmica r = φ^(2θ/π). O gráfico à direita mostra a razão a convergir enquanto a espiral cresce.",
    },
    {
      pretitle: "Secção 06 · Onde φ está mesmo — e onde não",
      title: "Biologia robusta vs. mitologia retroajustada",
      body: "O Pártenon, a Mona Lisa, a concha do nautilo — os famosos ajustes do «número áureo na arte» são sobretudo viés de confirmação e medidas arredondadas. Onde φ vive a sério é no crescimento e no empacotamento: filotaxia, teoria das frações contínuas, mosaicos de Penrose e quasicristais. Real, mais estreito do que os pósteres sugerem, e muito mais interessante do que a mitologia.",
    },
  ],
  sunflower: {
    caption: "Interativo · filotaxia do girassol",
    angleLabel: "Ângulo de divergência α",
    seedsLabel: "Número de sementes",
    goldenLabel: "Áureo",
    hint: "Afasta o ângulo 1° do áureo e vê surgir raios radiais. Volta a 137,51° e os raios dissolvem-se num mosaico uniforme.",
  },
  fibonacci: {
    caption: "Interativo · razões a convergir para φ",
    nLabel: "Número de termos N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "razão − φ",
    hint: "O erro troca de sinal e encolhe |ψ/φ| ≈ 0,382 a cada passo; em dois passos (mesmo sinal) isso compõe (ψ/φ)² ≈ 0,146 — uma convergência geométrica limpa. A espiral à direita nasce dos primeiros quadrados de Fibonacci.",
    spiralCaption: "Espiral áurea a partir de quadrados de Fibonacci",
  },
  firstNumbersLabel: "Primeiros números de Fibonacci",
  continuedFractionLabel: "Fração contínua",
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te varrer o ângulo de divergência em contínuo, ver as razões consecutivas aproximarem-se de φ e fazer crescer a espiral áurea a qualquer profundidade. Tudo o que acabaste de ler está a um clique.",
  closingCta: "→ Abrir o Explorador",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "Gyllene snittet & Fibonacci",
    tagline: "En enkel rekursion. Förhållandet som gömmer sig överallt.",
    intro:
      "Utforskaren följer Fibonacci-följden medan dess på varandra följande förhållanden närmar sig φ, ritar den gyllene spiralen byggd av nästlade Fibonacci-kvadrater och låter dig vinkla solrosens fyllotaximönster med den gyllene vinkeln. Tre vyer, ett tal — och skillnaden mellan där φ verkligen dyker upp och där infografiken överdriver.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "En enkel rekursion. Ett tal som gömmer sig nästan överallt.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Börja med 0 och 1, och addera alltid de två senaste. Kvoten mellan på varandra följande termer närmar sig ett fast irrationellt tal — φ ≈ 1,618. Samma tal, oavsett startpar (nästan).",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Dela vart och ett med det föregående: 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. Kvoterna studsar över och under φ och drar ihop sig geometriskt runt det.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "φ är bevisligen det tal som är svårast att approximera med bråk — det «mest irrationella». Det är precis därför solrosor, kottar och många blad delar in sina delar med den gyllene vinkeln: inga luckor, ingen föredragen riktning.",
      },
    ],
    tryIt:
      "Nedan: rid kvoterna in i φ, luta sen en solros för att känna den gyllene vinkeln arbeta.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Rekursionen",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Välj ett startpar — standarden är F₀ = 0, F₁ = 1 — och varje ny term är summan av de två föregående. Den enda regeln genererar 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … för alltid. Ingen multiplikation, inga specialfunktioner, ingen inbakad tillväxtkonstant — och ändå bor φ redan i additionen.",
    },
    {
      pretitle: "Avsnitt 02 · Varför kvoterna konvergerar",
      title: "Lös x² = x + 1 så ramlar gränsvärdet ut",
      body: "Anta att kvoten Fₙ₊₁/Fₙ stabiliseras kring ett x. Dela rekursionen med Fₙ: det tvingar x = 1 + 1/x, alltså x² = x + 1. Den positiva roten är φ = (1 + √5)/2 ≈ 1,618, den negativa ψ = (1 − √5)/2 ≈ −0,618 dör bort. Binets formel Fₙ = (φⁿ − ψⁿ)/√5 bekräftar det exakt.",
    },
    {
      pretitle: "Avsnitt 03 · Det mest irrationella talet",
      title: "Kedjebråk [1; 1, 1, 1, …]",
      body: "Varje irrationellt tal har en kedjebråksutveckling; ju större dess termer, desto bättre approximeras det av enkla bråk. φ har de minsta möjliga termerna — alla ettor — och är därför det långsammaste talet av alla att approximera. Det låter abstrakt; det är exakt den egenskap en växt behöver för att inget blad ska skugga ett annat.",
    },
    {
      pretitle: "Avsnitt 04 · Solrosor och 137,5°-vinkeln",
      title: "Vrid med 360°/φ² mellan fröna",
      body: "Lägg frö n vid radien √n och vrid det en fast vinkel α relativt det föregående. Om α är ett rationellt bråkdels varv ställer sig fröna på några få ekrar och lämnar luckor. Välj α = 360°/φ² ≈ 137,508° och φ:s «mest irrationella»-egenskap garanterar att de aldrig ställer sig på linje — de packas tätt, jämnt, utan föredragen riktning. Simulatorn nedan gör felägena smärtsamt synliga.",
    },
    {
      pretitle: "Avsnitt 05 · Gyllene rektangel och spiral",
      title: "Inkapslade Fibonacci-kvadrater spårar en logaritmisk kurva",
      body: "Lägg kvadrater med sidan F₁, F₂, F₃, F₄, … i ett medurs väderkvarnmönster. Deras kontur är en rektangel vars sidoförhållande närmar sig φ, och fjärdedelscirklarna inskrivna i varje kvadrat sys ihop till «den gyllene spiralen» — diskret kusin till den riktiga logaritmiska spiralen r = φ^(2θ/π). Grafen till höger visar kvoten konvergera medan spiralen växer.",
    },
    {
      pretitle: "Avsnitt 06 · Var φ verkligen finns — och var inte",
      title: "Robust biologi vs. retroanpassad mytologi",
      body: "Parthenon, Mona Lisa, nautilusskalet — de berömda «gyllene snittet i konsten»-anpassningarna är mest bekräftelsebias och avrundade mått. Där φ verkligen lever är i tillväxt och packning: phyllotaxis, kedjebråksteori, Penrose-täckningar och kvasikristaller. Riktigt, smalare än affischerna antyder, och långt mer intressant än mytologin.",
    },
  ],
  sunflower: {
    caption: "Interaktivt · solrosens phyllotaxis",
    angleLabel: "Divergensvinkel α",
    seedsLabel: "Antal frön",
    goldenLabel: "Gyllen",
    hint: "Dra vinkeln 1° bort från den gyllene och se ekrarna dyka upp. Hoppa tillbaka till 137,51° och de löses upp i en jämn täckning.",
  },
  fibonacci: {
    caption: "Interaktivt · kvoter konvergerar mot φ",
    nLabel: "Antal termer N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "kvot − φ",
    hint: "Felet växlar tecken och krymper med |ψ/φ| ≈ 0,382 per steg; över två steg (samma tecken) ger det faktorn (ψ/φ)² ≈ 0,146 — en ren geometrisk konvergens. Spiralen till höger byggs av de första Fibonacci-kvadraterna.",
    spiralCaption: "Gyllene spiralen från Fibonacci-kvadrater",
  },
  firstNumbersLabel: "Första Fibonacci-talen",
  continuedFractionLabel: "Kedjebråk",
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig svepa divergensvinkeln kontinuerligt, se de på varandra följande kvoterna närma sig φ och låta den gyllene spiralen växa till valfritt djup. Allt du just läst är ett klick bort.",
  closingCta: "→ Öppna Utforskaren",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "Det gylne snitt & Fibonacci",
    tagline: "En enkel rekursjon. Forholdet som skjuler seg overalt.",
    intro:
      "Utforskeren følger Fibonacci-følgen mens dens påfølgende forhold nærmer seg φ, tegner den gylne spiralen bygd av nøstede Fibonacci-kvadrater og lar deg vippe solsikkens fyllotaksimønster med den gylne vinkelen. Tre visninger, ett tall — og forskjellen mellom hvor φ virkelig dukker opp og hvor infografikken overdriver.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "En enkel rekursjon. Et tall som gjemmer seg nesten overalt.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Start med 0 og 1, og legg alltid sammen de to siste. Forholdet mellom påfølgende ledd nærmer seg et fast irrasjonalt tall — φ ≈ 1,618. Samme tall, uansett hvilket startpar (nesten).",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "1, 1, 2, 3, 5, 8, 13, 21, 34. Del hvert på det forrige: 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619. Forholdene spretter over og under φ og strammer seg geometrisk rundt det.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "φ er beviselig det vanskeligste tallet å tilnærme med brøker — det «mest irrasjonale». Akkurat derfor fordeler solsikker, kongler og mange blader delene sine med den gylne vinkelen: ingen tomrom, ingen foretrukket retning.",
      },
    ],
    tryIt:
      "Under: ri forholdene inn i φ, vipp så en solsikke for å kjenne den gylne vinkelen i arbeid.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Rekursjonen",
      title: "Fₙ = Fₙ₋₁ + Fₙ₋₂",
      body: "Velg et startpar — standarden er F₀ = 0, F₁ = 1 — og hvert nye ledd er summen av de to forrige. Den ene regelen genererer 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … for alltid. Ingen multiplikasjon, ingen spesialfunksjoner, ingen innbakt vekstkonstant — og likevel bor φ allerede i addisjonen.",
    },
    {
      pretitle: "Avsnitt 02 · Hvorfor forholdene konvergerer",
      title: "Løs x² = x + 1 og grensen faller ut",
      body: "Anta at forholdet Fₙ₊₁/Fₙ legger seg på et x. Del rekursjonen på Fₙ: det tvinger x = 1 + 1/x, det vil si x² = x + 1. Den positive roten er φ = (1 + √5)/2 ≈ 1,618, den negative ψ = (1 − √5)/2 ≈ −0,618 dør ut. Binets formel Fₙ = (φⁿ − ψⁿ)/√5 bekrefter det eksakt.",
    },
    {
      pretitle: "Avsnitt 03 · Det mest irrasjonale tallet",
      title: "Kjedebrøk [1; 1, 1, 1, …]",
      body: "Alle irrasjonale har en kjedebrøksutvikling; jo større leddene er, jo bedre tilnærmes tallet av enkle brøker. φ har de minste mulige leddene — bare enere — og er derfor det tregeste av alle tall å tilnærme. Det høres abstrakt ut; det er nøyaktig egenskapen en plante trenger for at ingen blader skal skygge hverandre.",
    },
    {
      pretitle: "Avsnitt 04 · Solsikker og 137,5°-vinkelen",
      title: "Vri med 360°/φ² mellom frøene",
      body: "Plasser frø n på radius √n og vri det en fast vinkel α i forhold til det forrige. Er α en rasjonal brøkdel av en omdreining, stiller frøene seg på noen få eiker og lar tomrom stå igjen. Velg α = 360°/φ² ≈ 137,508°, og φs «mest irrasjonale»-egenskap sikrer at de aldri stiller seg på linje — de pakker seg tett, jevnt, uten foretrukket retning. Simulatoren under gjør feilmodusene smertelig synlige.",
    },
    {
      pretitle: "Avsnitt 05 · Gylden rektangel og spiral",
      title: "Innkapslede Fibonacci-kvadrater tegner en logaritmisk kurve",
      body: "Legg kvadrater med side F₁, F₂, F₃, F₄, … i en medurs vindmølle. Konturen er en rektangel hvis sideforhold går mot φ, og kvartsirklene innskrevet i hvert kvadrat sys sammen til «den gylne spiralen» — diskret slektning av den ekte logaritmiske spiralen r = φ^(2θ/π). Grafen til høyre viser forholdet konvergere mens spiralen vokser.",
    },
    {
      pretitle: "Avsnitt 06 · Hvor φ virkelig er — og hvor det ikke er",
      title: "Robust biologi mot etterpåtilpasset mytologi",
      body: "Parthenon, Mona Lisa, nautilusskallet — de berømte «gylne snitt i kunsten»-tilpasningene er mest bekreftelsesskjevhet og avrundede mål. Der φ virkelig lever er i vekst og pakking: phyllotaxis, kjedebrøksteori, Penrose-flislegginger og kvasikrystaller. Ekte, smalere enn plakatene antyder, og langt mer interessant enn mytologien.",
    },
  ],
  sunflower: {
    caption: "Interaktivt · solsikkens phyllotaxis",
    angleLabel: "Divergensvinkel α",
    seedsLabel: "Antall frø",
    goldenLabel: "Gylden",
    hint: "Dra vinkelen 1° bort fra den gylne og se eikene komme fram. Hopp tilbake til 137,51° og de løses opp i en jevn flislegging.",
  },
  fibonacci: {
    caption: "Interaktivt · forhold som konvergerer mot φ",
    nLabel: "Antall ledd N",
    ratioHeader: "Fₙ₊₁ / Fₙ",
    diffHeader: "forhold − φ",
    hint: "Feilen veksler fortegn og krymper med |ψ/φ| ≈ 0,382 per steg; over to steg (samme fortegn) gir det faktoren (ψ/φ)² ≈ 0,146 — en ren geometrisk konvergens. Spiralen til høyre er bygget av de første Fibonacci-kvadratene.",
    spiralCaption: "Gylden spiral fra Fibonacci-kvadrater",
  },
  firstNumbersLabel: "Første Fibonacci-tall",
  continuedFractionLabel: "Kjedebrøk",
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg sveipe divergensvinkelen kontinuerlig, se de påfølgende forholdene nærme seg φ og la den gylne spiralen vokse til et hvilket som helst dyp. Alt du nettopp leste er ett klikk unna.",
  closingCta: "→ Åpne Utforskeren",
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-amber/40">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

export default function PhiStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/phi/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="φ = (1 + √5) / 2 ≈ 1.6180339887"
      formulaLatex={"\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.6180339887"}
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

      {/* Section 01 — the recurrence */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.firstNumbersLabel}
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, …
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 02 — quadratic */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec1!.pretitle}
          title={sec1!.title}
          body={sec1!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — continued fraction */}
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
              {story.continuedFractionLabel}
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              φ = 1 + 1 / (1 + 1 / (1 + 1 / (1 + …)))
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 04 — sunflower + inline simulator */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <PhiSunflowerSim
            caption={story.sunflower.caption}
            angleLabel={story.sunflower.angleLabel}
            seedsLabel={story.sunflower.seedsLabel}
            goldenLabel={story.sunflower.goldenLabel}
            hint={story.sunflower.hint}
          />
        </Reveal>
      </section>

      {/* Section 05 — golden rectangle + inline ratio chart */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <PhiFibonacciConvergence
            caption={story.fibonacci.caption}
            nLabel={story.fibonacci.nLabel}
            ratioHeader={story.fibonacci.ratioHeader}
            diffHeader={story.fibonacci.diffHeader}
            hint={story.fibonacci.hint}
            spiralCaption={story.fibonacci.spiralCaption}
          />
        </Reveal>
      </section>

      {/* Section 06 — mythology vs biology */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA — unified pattern */}
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
            href="/phi/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.closingCta}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
