"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { GaltonInlineSim } from "@/components/GaltonInlineSim";
import { GaltonNormalOverlay } from "@/components/GaltonNormalOverlay";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// Rich, per-locale story content. Hero copy lives in `page`; encounter cards,
// section bodies and interactive captions all sit here so the story can
// breathe without bloating the shared i18n bundles.
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
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  simCaption: string;
  simRowsLabel: string;
  simSpawnLabel: string;
  simBallsLabel: (n: number) => string;
  simHint: string;
  simPretitle: string;
  simTitle: string;
  simBody: string;
  overlayCaption: string;
  overlayNLabel: string;
  overlayLegendBinomial: string;
  overlayLegendNormal: string;
  overlayHint: string;
  overlayPretitle: string;
  overlayTitle: string;
  overlayBody: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Analysis",
    title: "The Galton Board",
    tagline: "Bouncing balls always draw the same bell.",
    intro:
      "A triangle of pegs, a marble dropped from the top, fifty-fifty at every bounce — and somehow, every time, the bins below fill into the same curve. The board is the Central Limit Theorem made tactile: a thousand coin flips becoming the most universal shape in statistics.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Pegs, coin flips, and a bell that refuses to go away.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Stack N rows of pegs in a triangle. Drop a ball at the top. At every peg it strikes, it goes left or right by a fair coin flip. After N bounces it lands in one of N+1 bins. One ball tells you nothing. A thousand balls draw a bell — always the same bell, no matter how many times you reset.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Take N = 10 rows. The probability of landing in bin k is C(10, k) / 1024. The eleven bin probabilities, multiplied by 1024, read (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — row 10 of Pascal's triangle, already shaped like a bell.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The bell is not a coincidence. It is the Central Limit Theorem on its simplest stage: sum many independent fair coin flips, rescale, and the distribution converges to a Gaussian. Heights, errors, test scores, daily returns — anything that is a sum of many small independent kicks ends up here.",
      },
    ],
    tryIt: "Below: drop balls live, then watch the binomial morph into the normal as you crank N.",
  },
  sections: [
    {
      pretitle: "Section 01 · The setup",
      title: "N rows of pegs, one fair coin at each",
      body: "Francis Galton's 1889 quincunx is a board of N staggered rows of pegs. A ball dropped from the apex strikes one peg per row and bounces left or right independently with probability 1/2. After N rows the ball settles into one of N+1 collection bins, indexed by how many right-bounces it took.",
    },
    {
      pretitle: "Section 02 · Pascal landing",
      title: "P(bin = k) = C(N, k) / 2ᴺ",
      body: "The number of left-right paths leading to bin k is exactly the binomial coefficient C(N, k) — the same numbers as row N of Pascal's triangle. Divide by the total 2ᴺ paths and you have the bin probability. The Galton board is, secretly, a physical lookup table for binomial coefficients.",
    },
    {
      pretitle: "Section 03 · De Moivre–Laplace, 1733",
      title: "Binomial → normal",
      body: "Abraham de Moivre proved in 1733 that as N grows, C(N, k)/2ᴺ converges to the Gaussian density (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace generalised it to biased coins in 1810. This is the first instance of the Central Limit Theorem — a hundred years before the general statement.",
    },
    {
      pretitle: "Section 04 · Central Limit Theorem",
      title: "Any finite variance, any distribution → bell",
      body: "The general CLT, rigorously proved by Lyapunov in 1901 and sharpened by Lindeberg in 1922, says far more: take ANY independent random variables with finite variance — skewed, discrete, ugly — sum N of them, rescale. The limit is a Gaussian. The bell is the universal attractor of averaging.",
    },
    {
      pretitle: "Section 05 · Why it's everywhere",
      title: "Heights, errors, test scores, returns",
      body: "Adult heights are a sum of thousands of small genetic and environmental contributions — and so are measurement errors, IQ scores, daily logarithmic returns (under tidy assumptions). Each is a sum of many small independent kicks, so each is approximately Gaussian. This is why standard deviation has a name and why bell curves rule statistics.",
    },
    {
      pretitle: "Section 06 · Limitations",
      title: "Heavy tails refuse the bell",
      body: "The CLT needs finite variance. Drop that assumption and stranger attractors take over: the stable distributions, with Cauchy and Lévy at the extremes. Mandelbrot's critique of finance — that returns have «wild» power-law tails — is exactly this point. When a single contribution can dwarf the sum, no bell appears.",
    },
  ],
  closingPretitle: "Take it further",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer lets you push N to 40, bias the coin, watch the histogram fill in real time, and toggle the Gaussian overlay. Drop ten thousand marbles and watch the theorem assemble itself.",
  ctaLabel: "→ Open the Explorer",
  simCaption: "Interactive · drop balls live",
  simRowsLabel: "Rows N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} balls landed`,
  simHint:
    "Pegs in cyan, falling balls in amber, the histogram fills in cyan below. The shape sharpens with every drop.",
  simPretitle: "Interactive · the quincunx",
  simTitle: "Pegs, balls, bins — see the bell assemble",
  simBody:
    "Every ball takes its own random path; the histogram is the only thing that converges. Slide N and watch the bell sharpen.",
  overlayCaption: "Interactive · binomial → normal",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Cyan bars: the exact binomial. Violet curve: the matching Gaussian. The amber dashed line marks μ = N/2.",
  overlayPretitle: "Interactive · De Moivre–Laplace",
  overlayTitle: "Crank N — the binomial becomes a Gaussian",
  overlayBody:
    "At N = 4 the binomial is a coarse staircase; by N = 40 the Gaussian curve hugs every bar. This is the convergence De Moivre proved in 1733 — the first Central Limit Theorem in disguise.",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Analysis",
    title: "Das Galton-Brett",
    tagline: "Hüpfende Kugeln zeichnen immer dieselbe Glocke.",
    intro:
      "Ein Dreieck aus Stiften, eine Kugel oben fallengelassen, fifty-fifty an jedem Stoß — und irgendwie füllen sich die Fächer unten jedes Mal zur selben Kurve. Das Brett ist der Zentrale Grenzwertsatz zum Anfassen: tausend Münzwürfe werden zur universellsten Form der Statistik.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Stifte, Münzwürfe, und eine Glocke, die nicht weichen will.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Stapel N Reihen Stifte zu einem Dreieck. Lass oben eine Kugel los. An jedem Stift, den sie trifft, geht sie per fairem Münzwurf links oder rechts. Nach N Stößen landet sie in einem von N+1 Fächern. Eine Kugel sagt nichts. Tausend zeichnen eine Glocke — immer dieselbe, egal wie oft du neu startest.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Nimm N = 10. Die Wahrscheinlichkeit, in Fach k zu landen, ist C(10, k) / 1024. Die elf Werte, mit 1024 multipliziert, lesen sich (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — Zeile 10 des Pascalschen Dreiecks, schon glockenförmig.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Die Glocke ist kein Zufall. Sie ist der Zentrale Grenzwertsatz in seiner einfachsten Bühne: summier viele unabhängige faire Münzwürfe, skalier um, und die Verteilung konvergiert gegen eine Gauß. Körpergrößen, Messfehler, Testwerte, Renditen — alles, was Summe vieler kleiner unabhängiger Stöße ist, landet hier.",
      },
    ],
    tryIt:
      "Unten: lass live Kugeln fallen, dann sieh, wie die Binomialverteilung in die Normale übergeht, wenn du N hochziehst.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Der Aufbau",
      title: "N Reihen Stifte, je ein fairer Münzwurf",
      body: "Francis Galtons Quincunx von 1889 ist ein Brett mit N versetzten Reihen von Stiften. Eine vom Scheitel losgelassene Kugel trifft pro Reihe einen Stift und springt unabhängig mit Wahrscheinlichkeit 1/2 links oder rechts. Nach N Reihen landet sie in einem von N+1 Sammelfächern, indiziert durch die Zahl ihrer Rechtssprünge.",
    },
    {
      pretitle: "Abschnitt 02 · Pascal-Landung",
      title: "P(Fach = k) = C(N, k) / 2ᴺ",
      body: "Die Anzahl der Links-Rechts-Pfade, die zu Fach k führen, ist genau der Binomialkoeffizient C(N, k) — dieselben Zahlen wie Zeile N des Pascalschen Dreiecks. Teilst du durch die 2ᴺ Gesamtpfade, hast du die Fach-Wahrscheinlichkeit. Das Galton-Brett ist heimlich eine physische Nachschlagetabelle für Binomialkoeffizienten.",
    },
    {
      pretitle: "Abschnitt 03 · De Moivre–Laplace, 1733",
      title: "Binomial → Normal",
      body: "Abraham de Moivre bewies 1733, dass C(N, k)/2ᴺ für wachsendes N gegen die Gauß-Dichte (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)) konvergiert. Laplace verallgemeinerte es 1810 auf verzerrte Münzen. Dies ist die erste Instanz des Zentralen Grenzwertsatzes — hundert Jahre vor der allgemeinen Aussage.",
    },
    {
      pretitle: "Abschnitt 04 · Zentraler Grenzwertsatz",
      title: "Jede endliche Varianz, jede Verteilung → Glocke",
      body: "Der allgemeine ZGS, streng bewiesen 1901 von Ljapunow und 1922 von Lindeberg geschärft, sagt weit mehr: nimm IRGENDWELCHE unabhängigen Zufallsvariablen mit endlicher Varianz — schief, diskret, hässlich — summier N davon, skalier um. Der Grenzwert ist eine Gauß. Die Glocke ist der universelle Attraktor des Mittelns.",
    },
    {
      pretitle: "Abschnitt 05 · Warum sie überall ist",
      title: "Körpergröße, Fehler, Testwerte, Renditen",
      body: "Erwachsene Körpergrößen sind eine Summe tausender kleiner genetischer und Umweltbeiträge — genauso Messfehler, IQ-Werte, logarithmische Tagesrenditen (unter sauberen Annahmen). Jede ist Summe vieler kleiner unabhängiger Stöße, also annähernd gaußsch. Deshalb hat die Standardabweichung einen Namen und deshalb regieren Glockenkurven die Statistik.",
    },
    {
      pretitle: "Abschnitt 06 · Grenzen",
      title: "Schwere Schwänze verweigern die Glocke",
      body: "Der ZGS braucht endliche Varianz. Fällt diese Annahme, übernehmen seltsamere Attraktoren: die stabilen Verteilungen, mit Cauchy und Lévy am Extrem. Mandelbrots Kritik am Finanzwesen — dass Renditen «wilde» Potenzgesetz-Schwänze haben — ist genau dieser Punkt. Wenn ein einzelner Beitrag die Summe überschatten kann, erscheint keine Glocke.",
    },
  ],
  closingPretitle: "Geh weiter",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer lässt dich N bis 40 treiben, die Münze verzerren, das Histogramm in Echtzeit füllen sehen und die Gauß-Überlagerung umschalten. Lass zehntausend Kugeln fallen und sieh dem Satz beim Selbstbau zu.",
  ctaLabel: "→ Explorer öffnen",
  simCaption: "Interaktiv · live Kugeln fallen lassen",
  simRowsLabel: "Reihen N",
  simSpawnLabel: "Spawn / Frame",
  simBallsLabel: (n) => `${n.toLocaleString()} Kugeln gelandet`,
  simHint:
    "Stifte in Cyan, fallende Kugeln in Amber, das Histogramm füllt sich darunter in Cyan. Die Form wird mit jeder Kugel schärfer.",
  simPretitle: "Interaktiv · der Quincunx",
  simTitle: "Stifte, Kugeln, Fächer — sieh die Glocke entstehen",
  simBody:
    "Jede Kugel nimmt ihren eigenen Zufallspfad; nur das Histogramm konvergiert. Schieb N und sieh die Glocke schärfer werden.",
  overlayCaption: "Interaktiv · Binomial → Normal",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Cyane Balken: die exakte Binomialverteilung. Violette Kurve: die passende Gauß. Die amber gestrichelte Linie markiert μ = N/2.",
  overlayPretitle: "Interaktiv · De Moivre–Laplace",
  overlayTitle: "Dreh N hoch — die Binomial wird zur Gauß",
  overlayBody:
    "Bei N = 4 ist die Binomial eine grobe Treppe; bei N = 40 schmiegt sich die Gauß-Kurve an jeden Balken. Das ist die Konvergenz, die de Moivre 1733 bewies — der erste Zentrale Grenzwertsatz, verkleidet.",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Análisis",
    title: "El tablero de Galton",
    tagline: "Bolas que rebotan dibujan siempre la misma campana.",
    intro:
      "Un triángulo de clavos, una bola soltada arriba, cara o cruz en cada rebote — y de algún modo, cada vez, las casillas de abajo se llenan con la misma curva. El tablero es el Teorema Central del Límite hecho tangible: mil lanzamientos de moneda convirtiéndose en la forma más universal de la estadística.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Clavos, monedas, y una campana que no se va.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Apila N filas de clavos en triángulo. Suelta una bola arriba. En cada clavo que toca, va a izquierda o derecha por una moneda justa. Tras N rebotes cae en una de N+1 casillas. Una bola no te dice nada. Mil bolas dibujan una campana — siempre la misma, por mucho que reinicies.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Toma N = 10. La probabilidad de caer en la casilla k es C(10, k) / 1024. Los once valores, multiplicados por 1024, son (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — la fila 10 del triángulo de Pascal, ya con forma de campana.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La campana no es casualidad. Es el Teorema Central del Límite en su escenario más simple: suma muchas monedas justas independientes, reescala, y la distribución converge a una gaussiana. Estaturas, errores, puntajes de test, rendimientos — todo lo que es suma de muchos pequeños empujones independientes acaba aquí.",
      },
    ],
    tryIt:
      "Abajo: suelta bolas en vivo, luego mira la binomial transformarse en normal mientras subes N.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El montaje",
      title: "N filas de clavos, una moneda justa en cada uno",
      body: "El quincuncio de Francis Galton de 1889 es un tablero con N filas de clavos desplazadas. Una bola soltada en el vértice golpea un clavo por fila y rebota a izquierda o derecha con probabilidad 1/2, independientemente. Tras N filas cae en una de N+1 casillas, indexada por el número de rebotes a la derecha.",
    },
    {
      pretitle: "Sección 02 · Aterrizaje en Pascal",
      title: "P(casilla = k) = C(N, k) / 2ᴺ",
      body: "El número de caminos izquierda-derecha que llevan a la casilla k es exactamente el coeficiente binomial C(N, k) — los mismos números que la fila N del triángulo de Pascal. Divide entre los 2ᴺ caminos totales y tienes la probabilidad. El tablero de Galton es, en secreto, una tabla física de coeficientes binomiales.",
    },
    {
      pretitle: "Sección 03 · De Moivre–Laplace, 1733",
      title: "Binomial → normal",
      body: "Abraham de Moivre probó en 1733 que C(N, k)/2ᴺ, al crecer N, converge a la densidad gaussiana (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace lo generalizó a monedas sesgadas en 1810. Es la primera instancia del Teorema Central del Límite — un siglo antes del enunciado general.",
    },
    {
      pretitle: "Sección 04 · Teorema Central del Límite",
      title: "Cualquier varianza finita, cualquier distribución → campana",
      body: "El TCL general, demostrado con rigor por Lyapunov en 1901 y afinado por Lindeberg en 1922, dice mucho más: toma CUALESQUIERA variables aleatorias independientes con varianza finita — sesgadas, discretas, feas — suma N y reescala. El límite es una gaussiana. La campana es el atractor universal del promediar.",
    },
    {
      pretitle: "Sección 05 · Por qué está en todas partes",
      title: "Estaturas, errores, puntajes, rendimientos",
      body: "Las estaturas adultas son suma de miles de pequeñas contribuciones genéticas y ambientales — también lo son los errores de medida, los puntajes de IQ, los rendimientos diarios logarítmicos (bajo supuestos limpios). Cada uno es suma de muchos pequeños empujones independientes, así que cada uno es aproximadamente gaussiano. Por eso la desviación estándar tiene nombre y las campanas mandan en estadística.",
    },
    {
      pretitle: "Sección 06 · Límites",
      title: "Las colas pesadas rechazan la campana",
      body: "El TCL necesita varianza finita. Suelta ese supuesto y otros atractores extraños toman el relevo: las distribuciones estables, con Cauchy y Lévy en los extremos. La crítica de Mandelbrot al mundo financiero — que los rendimientos tienen colas «salvajes» de ley de potencias — es exactamente este punto. Cuando una sola contribución puede eclipsar la suma, no aparece campana.",
    },
  ],
  closingPretitle: "Llévalo más lejos",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador te deja empujar N a 40, sesgar la moneda, ver el histograma llenarse en tiempo real y alternar la curva gaussiana. Suelta diez mil bolas y mira al teorema construirse solo.",
  ctaLabel: "→ Abrir el Explorador",
  simCaption: "Interactivo · soltar bolas en vivo",
  simRowsLabel: "Filas N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} bolas caídas`,
  simHint:
    "Clavos en cian, bolas cayendo en ámbar, el histograma se llena en cian abajo. La forma se afila con cada bola.",
  simPretitle: "Interactivo · el quincuncio",
  simTitle: "Clavos, bolas, casillas — ve a la campana montarse",
  simBody:
    "Cada bola toma su propio camino al azar; solo el histograma converge. Mueve N y mira la campana afilarse.",
  overlayCaption: "Interactivo · binomial → normal",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Barras cian: la binomial exacta. Curva violeta: la gaussiana correspondiente. La línea ámbar punteada marca μ = N/2.",
  overlayPretitle: "Interactivo · De Moivre–Laplace",
  overlayTitle: "Sube N — la binomial se vuelve gaussiana",
  overlayBody:
    "Con N = 4 la binomial es una escalera tosca; con N = 40 la curva gaussiana abraza cada barra. Es la convergencia que de Moivre probó en 1733 — el primer Teorema Central del Límite, disfrazado.",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Analyse",
    title: "La planche de Galton",
    tagline: "Des billes qui rebondissent dessinent toujours la même cloche.",
    intro:
      "Un triangle de clous, une bille lâchée en haut, pile ou face à chaque rebond — et pourtant, à chaque fois, les casiers du bas se remplissent selon la même courbe. La planche, c'est le Théorème Central Limite rendu tangible : mille lancers de pièce qui deviennent la forme la plus universelle de la statistique.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Clous, pièces, et une cloche qui refuse de partir.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Empile N rangées de clous en triangle. Lâche une bille en haut. À chaque clou touché, elle va à gauche ou à droite par un tirage de pièce équilibré. Après N rebonds elle tombe dans l'un des N+1 casiers. Une bille ne t'apprend rien. Mille billes dessinent une cloche — toujours la même, peu importe combien de fois tu recommences.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Prends N = 10. La probabilité de tomber dans le casier k est C(10, k) / 1024. Les onze valeurs, multipliées par 1024, donnent (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — la rangée 10 du triangle de Pascal, déjà en forme de cloche.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "La cloche n'est pas un hasard. C'est le Théorème Central Limite sur sa scène la plus simple : somme beaucoup de pièces équilibrées indépendantes, renormalise, et la distribution converge vers une gaussienne. Tailles, erreurs, scores, rendements — tout ce qui est somme de nombreuses petites secousses indépendantes finit ici.",
      },
    ],
    tryIt:
      "Ci-dessous : lâche des billes en direct, puis regarde la binomiale virer en normale quand tu pousses N.",
  },
  sections: [
    {
      pretitle: "Section 01 · Le montage",
      title: "N rangées de clous, une pièce équilibrée à chaque clou",
      body: "Le quinconce de Francis Galton, 1889, est une planche à N rangées de clous décalées. Une bille lâchée au sommet frappe un clou par rangée et rebondit à gauche ou à droite avec probabilité 1/2, indépendamment. Après N rangées elle se loge dans l'un des N+1 casiers, indexé par le nombre de rebonds à droite.",
    },
    {
      pretitle: "Section 02 · L'atterrissage de Pascal",
      title: "P(casier = k) = C(N, k) / 2ᴺ",
      body: "Le nombre de chemins gauche-droite menant au casier k est exactement le coefficient binomial C(N, k) — les mêmes nombres que la rangée N du triangle de Pascal. Divise par les 2ᴺ chemins totaux et tu as la probabilité du casier. La planche de Galton est, en secret, une table physique des coefficients binomiaux.",
    },
    {
      pretitle: "Section 03 · De Moivre–Laplace, 1733",
      title: "Binomiale → normale",
      body: "Abraham de Moivre démontra en 1733 que C(N, k)/2ᴺ, à mesure que N croît, converge vers la densité gaussienne (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace l'a généralisée aux pièces biaisées en 1810. C'est la première instance du Théorème Central Limite — un siècle avant l'énoncé général.",
    },
    {
      pretitle: "Section 04 · Théorème Central Limite",
      title: "N'importe quelle variance finie, n'importe quelle loi → cloche",
      body: "Le TCL général, démontré rigoureusement par Lyapounov en 1901 et affiné par Lindeberg en 1922, dit bien plus : prends N'IMPORTE quelles variables aléatoires indépendantes à variance finie — biaisées, discrètes, laides — somme-en N, renormalise. La limite est une gaussienne. La cloche est l'attracteur universel de la moyenne.",
    },
    {
      pretitle: "Section 05 · Pourquoi elle est partout",
      title: "Tailles, erreurs, scores, rendements",
      body: "Les tailles adultes sont une somme de milliers de petites contributions génétiques et environnementales — pareil pour les erreurs de mesure, les scores de QI, les rendements logarithmiques quotidiens (sous des hypothèses propres). Chacun est somme de nombreuses petites secousses indépendantes, donc approximativement gaussien. Voilà pourquoi l'écart-type a un nom et pourquoi les courbes en cloche règnent en statistique.",
    },
    {
      pretitle: "Section 06 · Limites",
      title: "Les queues lourdes refusent la cloche",
      body: "Le TCL exige une variance finie. Lâche cette hypothèse et d'autres attracteurs plus étranges prennent le relais : les lois stables, avec Cauchy et Lévy aux extrêmes. La critique de Mandelbrot envers la finance — que les rendements ont des queues «sauvages» en loi de puissance — c'est exactement ce point. Quand une seule contribution peut éclipser la somme, aucune cloche n'apparaît.",
    },
  ],
  closingPretitle: "Aller plus loin",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur te laisse pousser N jusqu'à 40, biaiser la pièce, voir l'histogramme se remplir en temps réel et basculer la courbe gaussienne. Lâche dix mille billes et regarde le théorème s'assembler tout seul.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  simCaption: "Interactif · lâcher des billes en direct",
  simRowsLabel: "Rangées N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} billes tombées`,
  simHint:
    "Clous en cyan, billes en ambre, l'histogramme se remplit en cyan dessous. La forme s'affûte à chaque chute.",
  simPretitle: "Interactif · le quinconce",
  simTitle: "Clous, billes, casiers — vois la cloche se monter",
  simBody:
    "Chaque bille suit son propre chemin aléatoire ; seul l'histogramme converge. Glisse N et regarde la cloche s'affûter.",
  overlayCaption: "Interactif · binomiale → normale",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Barres cyan : la binomiale exacte. Courbe violette : la gaussienne correspondante. La ligne ambre pointillée marque μ = N/2.",
  overlayPretitle: "Interactif · De Moivre–Laplace",
  overlayTitle: "Pousse N — la binomiale devient gaussienne",
  overlayBody:
    "À N = 4 la binomiale est un escalier grossier ; à N = 40 la courbe gaussienne épouse chaque barre. C'est la convergence que de Moivre démontra en 1733 — le premier Théorème Central Limite, déguisé.",
};

const it: RichStory = {
  page: {
    pretitle: "Tema · Analisi",
    title: "La macchina di Galton",
    tagline: "Palline che rimbalzano disegnano sempre la stessa campana.",
    intro:
      "Un triangolo di chiodi, una pallina lasciata cadere dall'alto, testa o croce a ogni rimbalzo — eppure, ogni volta, le vaschette in basso si riempiono nella stessa curva. La macchina è il Teorema del Limite Centrale reso tangibile: mille lanci di moneta che diventano la forma più universale della statistica.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Chiodi, monete, e una campana che non se ne vuole andare.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Impila N file di chiodi a triangolo. Lascia cadere una pallina dall'alto. A ogni chiodo che colpisce, va a sinistra o a destra con una moneta equa. Dopo N rimbalzi cade in una di N+1 vaschette. Una pallina non ti dice nulla. Mille palline disegnano una campana — sempre la stessa, per quante volte tu ricominci.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Prendi N = 10. La probabilità di cadere nella vaschetta k è C(10, k) / 1024. Gli undici valori, moltiplicati per 1024, sono (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — la riga 10 del triangolo di Pascal, già a forma di campana.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "La campana non è caso. È il Teorema del Limite Centrale sul suo palco più semplice: somma molte monete eque indipendenti, riscala, e la distribuzione converge a una gaussiana. Altezze, errori, punteggi di test, rendimenti — tutto ciò che è somma di tante piccole spinte indipendenti finisce qui.",
      },
    ],
    tryIt:
      "Sotto: fai cadere palline dal vivo, poi guarda la binomiale virare nella normale mentre alzi N.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Il dispositivo",
      title: "N file di chiodi, una moneta equa per ciascuno",
      body: "Il quincunx di Francis Galton del 1889 è una tavola con N file di chiodi sfalsate. Una pallina lasciata cadere dall'apice colpisce un chiodo per fila e rimbalza a sinistra o a destra con probabilità 1/2, in modo indipendente. Dopo N file cade in una di N+1 vaschette di raccolta, indicizzata dal numero di rimbalzi a destra.",
    },
    {
      pretitle: "Sezione 02 · Atterraggio su Pascal",
      title: "P(vaschetta = k) = C(N, k) / 2ᴺ",
      body: "Il numero di cammini sinistra-destra che portano alla vaschetta k è esattamente il coefficiente binomiale C(N, k) — gli stessi numeri della riga N del triangolo di Pascal. Dividi per i 2ᴺ cammini totali e hai la probabilità della vaschetta. La macchina di Galton è, in segreto, una tabella fisica dei coefficienti binomiali.",
    },
    {
      pretitle: "Sezione 03 · De Moivre–Laplace, 1733",
      title: "Binomiale → normale",
      body: "Abraham de Moivre dimostrò nel 1733 che C(N, k)/2ᴺ, al crescere di N, converge alla densità gaussiana (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace la generalizzò alle monete sbilanciate nel 1810. È la prima istanza del Teorema del Limite Centrale — un secolo prima dell'enunciato generale.",
    },
    {
      pretitle: "Sezione 04 · Teorema del Limite Centrale",
      title: "Qualsiasi varianza finita, qualsiasi distribuzione → campana",
      body: "Il TLC generale, dimostrato con rigore da Ljapunov nel 1901 e affinato da Lindeberg nel 1922, dice molto di più: prendi QUALSIASI variabile aleatoria indipendente a varianza finita — sbilenca, discreta, brutta — sommane N, riscala. Il limite è una gaussiana. La campana è l'attrattore universale del fare la media.",
    },
    {
      pretitle: "Sezione 05 · Perché è ovunque",
      title: "Altezze, errori, punteggi, rendimenti",
      body: "Le altezze adulte sono somma di migliaia di piccoli contributi genetici e ambientali — così pure gli errori di misura, i punteggi di QI, i rendimenti logaritmici giornalieri (sotto ipotesi pulite). Ognuno è somma di tante piccole spinte indipendenti, quindi approssimativamente gaussiano. Ecco perché la deviazione standard ha un nome e perché le campane regnano in statistica.",
    },
    {
      pretitle: "Sezione 06 · Limiti",
      title: "Le code pesanti rifiutano la campana",
      body: "Il TLC richiede varianza finita. Cadi quest'ipotesi e prendono il sopravvento attrattori più strani: le distribuzioni stabili, con Cauchy e Lévy agli estremi. La critica di Mandelbrot alla finanza — che i rendimenti hanno code «selvagge» a legge di potenza — è esattamente questo punto. Quando un singolo contributo può sovrastare la somma, nessuna campana appare.",
    },
  ],
  closingPretitle: "Vai oltre",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore ti lascia spingere N a 40, sbilanciare la moneta, vedere l'istogramma riempirsi in tempo reale e accendere la curva gaussiana. Fai cadere diecimila palline e guarda il teorema costruirsi da solo.",
  ctaLabel: "→ Apri l'Esploratore",
  simCaption: "Interattivo · far cadere palline dal vivo",
  simRowsLabel: "File N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} palline cadute`,
  simHint:
    "Chiodi in ciano, palline in ambra, l'istogramma si riempie in ciano sotto. La forma si affila a ogni caduta.",
  simPretitle: "Interattivo · il quincunx",
  simTitle: "Chiodi, palline, vaschette — guarda la campana montarsi",
  simBody:
    "Ogni pallina prende il suo cammino casuale; solo l'istogramma converge. Scorri N e guarda la campana affilarsi.",
  overlayCaption: "Interattivo · binomiale → normale",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Barre ciano: la binomiale esatta. Curva viola: la gaussiana corrispondente. La linea ambra tratteggiata segna μ = N/2.",
  overlayPretitle: "Interattivo · De Moivre–Laplace",
  overlayTitle: "Alza N — la binomiale diventa gaussiana",
  overlayBody:
    "A N = 4 la binomiale è una scala grezza; a N = 40 la curva gaussiana abbraccia ogni barra. È la convergenza che de Moivre dimostrò nel 1733 — il primo Teorema del Limite Centrale, in incognito.",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Análise",
    title: "A placa de Galton",
    tagline: "Bolas que ressaltam desenham sempre o mesmo sino.",
    intro:
      "Um triângulo de pinos, uma bola largada em cima, cara ou coroa em cada ressalto — e, no entanto, sempre, as casas em baixo enchem-se com a mesma curva. A placa é o Teorema do Limite Central tornado tangível: mil lances de moeda a tornarem-se a forma mais universal da estatística.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Pinos, moedas, e um sino que se recusa a sair.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Empilha N filas de pinos em triângulo. Larga uma bola em cima. Em cada pino que toca, vai à esquerda ou à direita por uma moeda justa. Depois de N ressaltos cai numa de N+1 casas. Uma bola não diz nada. Mil bolas desenham um sino — sempre o mesmo, por mais que reinicies.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Toma N = 10. A probabilidade de cair na casa k é C(10, k) / 1024. Os onze valores, multiplicados por 1024, lêem-se (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — a linha 10 do triângulo de Pascal, já com forma de sino.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "O sino não é acaso. É o Teorema do Limite Central no seu palco mais simples: soma muitas moedas justas independentes, reescala, e a distribuição converge para uma gaussiana. Alturas, erros, pontuações de teste, retornos — tudo o que é soma de muitos pequenos empurrões independentes acaba aqui.",
      },
    ],
    tryIt: "Em baixo: larga bolas ao vivo, depois vê a binomial virar normal enquanto puxas N.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A montagem",
      title: "N filas de pinos, uma moeda justa em cada um",
      body: "O quincunx de Francis Galton de 1889 é uma placa com N filas de pinos desfasadas. Uma bola largada no topo bate num pino por fila e ressalta para a esquerda ou para a direita com probabilidade 1/2, de forma independente. Após N filas cai numa de N+1 casas de recolha, indexada pelo número de ressaltos à direita.",
    },
    {
      pretitle: "Secção 02 · Aterragem em Pascal",
      title: "P(casa = k) = C(N, k) / 2ᴺ",
      body: "O número de caminhos esquerda-direita que levam à casa k é exatamente o coeficiente binomial C(N, k) — os mesmos números da linha N do triângulo de Pascal. Divide pelos 2ᴺ caminhos totais e tens a probabilidade da casa. A placa de Galton é, em segredo, uma tabela física dos coeficientes binomiais.",
    },
    {
      pretitle: "Secção 03 · De Moivre–Laplace, 1733",
      title: "Binomial → normal",
      body: "Abraham de Moivre provou em 1733 que C(N, k)/2ᴺ, ao crescer N, converge para a densidade gaussiana (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace generalizou para moedas viciadas em 1810. É a primeira instância do Teorema do Limite Central — um século antes do enunciado geral.",
    },
    {
      pretitle: "Secção 04 · Teorema do Limite Central",
      title: "Qualquer variância finita, qualquer distribuição → sino",
      body: "O TLC geral, provado com rigor por Lyapunov em 1901 e afinado por Lindeberg em 1922, diz muito mais: pega em QUAISQUER variáveis aleatórias independentes com variância finita — enviesadas, discretas, feias — soma N e reescala. O limite é uma gaussiana. O sino é o atrator universal da média.",
    },
    {
      pretitle: "Secção 05 · Porque está em todo o lado",
      title: "Alturas, erros, pontuações, retornos",
      body: "As alturas adultas são soma de milhares de pequenas contribuições genéticas e ambientais — o mesmo para os erros de medida, pontuações de QI, retornos logarítmicos diários (sob hipóteses limpas). Cada um é soma de muitos pequenos empurrões independentes, logo aproximadamente gaussiano. Por isso o desvio padrão tem nome e por isso as curvas em sino mandam na estatística.",
    },
    {
      pretitle: "Secção 06 · Limites",
      title: "Caudas pesadas recusam o sino",
      body: "O TLC precisa de variância finita. Deixa cair essa hipótese e outros atratores mais estranhos tomam o lugar: as distribuições estáveis, com Cauchy e Lévy nos extremos. A crítica de Mandelbrot à finança — que os retornos têm caudas «selvagens» de lei de potência — é exatamente este ponto. Quando uma única contribuição pode eclipsar a soma, nenhum sino aparece.",
    },
  ],
  closingPretitle: "Vai mais longe",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador deixa-te empurrar N até 40, viciar a moeda, ver o histograma encher em tempo real e ligar a curva gaussiana. Larga dez mil bolas e vê o teorema montar-se sozinho.",
  ctaLabel: "→ Abrir o Explorador",
  simCaption: "Interativo · largar bolas ao vivo",
  simRowsLabel: "Filas N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} bolas caídas`,
  simHint:
    "Pinos a ciano, bolas em âmbar, o histograma enche-se a ciano em baixo. A forma afia-se a cada queda.",
  simPretitle: "Interativo · o quincunx",
  simTitle: "Pinos, bolas, casas — vê o sino montar-se",
  simBody:
    "Cada bola segue o seu próprio caminho aleatório; só o histograma converge. Desliza N e vê o sino afiar-se.",
  overlayCaption: "Interativo · binomial → normal",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Barras ciano: a binomial exata. Curva violeta: a gaussiana correspondente. A linha âmbar tracejada marca μ = N/2.",
  overlayPretitle: "Interativo · De Moivre–Laplace",
  overlayTitle: "Empurra N — a binomial torna-se gaussiana",
  overlayBody:
    "Em N = 4 a binomial é uma escadaria grosseira; em N = 40 a curva gaussiana abraça cada barra. É a convergência que de Moivre provou em 1733 — o primeiro Teorema do Limite Central, disfarçado.",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Analys",
    title: "Galtonbrädet",
    tagline: "Studsande bollar ritar alltid samma klocka.",
    intro:
      "En triangel av pinnar, en kula släppt från toppen, krona eller klave vid varje studs — och ändå, varje gång, fylls facken nedanför till samma kurva. Brädet är centrala gränsvärdessatsen i greppbar form: tusen myntkast som blir statistikens mest universella form.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Pinnar, mynt, och en klocka som vägrar gå.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Stapla N rader av pinnar i en triangel. Släpp en kula på toppen. Vid varje pinne den träffar går den åt vänster eller höger med ett rättvist mynt. Efter N studsar landar den i ett av N+1 fack. En kula säger inget. Tusen kulor ritar en klocka — alltid samma, oavsett hur ofta du startar om.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Ta N = 10. Sannolikheten att landa i fack k är C(10, k) / 1024. De elva värdena, multiplicerade med 1024, blir (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — rad 10 i Pascals triangel, redan klockformad.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Klockan är ingen slump. Det är centrala gränsvärdessatsen på sin enklaste scen: summera många oberoende rättvisa mynt, omskala, och fördelningen konvergerar mot en Gauss. Längder, mätfel, testpoäng, avkastningar — allt som är summan av många små oberoende knuffar hamnar här.",
      },
    ],
    tryIt: "Nedan: släpp kulor live, se sedan binomialen vrida sig till normal när du drar upp N.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Uppställningen",
      title: "N rader av pinnar, ett rättvist mynt vid varje",
      body: "Francis Galtons quincunx från 1889 är ett bräde med N förskjutna rader av pinnar. En kula släppt vid spetsen träffar en pinne per rad och studsar till vänster eller höger med sannolikhet 1/2, oberoende. Efter N rader hamnar den i ett av N+1 uppsamlingsfack, indexerat av antalet högerstudsar.",
    },
    {
      pretitle: "Avsnitt 02 · Landning i Pascal",
      title: "P(fack = k) = C(N, k) / 2ᴺ",
      body: "Antalet vänster-höger-vägar till fack k är precis binomialkoefficienten C(N, k) — samma tal som rad N i Pascals triangel. Dela med de 2ᴺ totala vägarna och du har facksannolikheten. Galtonbrädet är, i hemlighet, en fysisk uppslagstabell för binomialkoefficienter.",
    },
    {
      pretitle: "Avsnitt 03 · De Moivre–Laplace, 1733",
      title: "Binomial → normal",
      body: "Abraham de Moivre bevisade 1733 att C(N, k)/2ᴺ, när N växer, konvergerar mot Gausstätheten (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace generaliserade till sneda mynt 1810. Det är den första instansen av centrala gränsvärdessatsen — ett århundrade före det allmänna uttalandet.",
    },
    {
      pretitle: "Avsnitt 04 · Centrala gränsvärdessatsen",
      title: "Vilken ändlig varians som helst, vilken fördelning som helst → klocka",
      body: "Den allmänna CGS, strängt bevisad av Lyapunov 1901 och vässad av Lindeberg 1922, säger mycket mer: ta VILKA oberoende stokastiska variabler som helst med ändlig varians — sneda, diskreta, fula — summera N stycken, omskala. Gränsen är en Gauss. Klockan är medelvärdets universella attraktor.",
    },
    {
      pretitle: "Avsnitt 05 · Varför den syns överallt",
      title: "Längder, fel, testpoäng, avkastningar",
      body: "Vuxenlängder är summor av tusentals små genetiska och miljömässiga bidrag — likaså mätfel, IQ-poäng, dagliga logaritmiska avkastningar (under prydliga antaganden). Var och en är summan av många små oberoende knuffar, alltså ungefär gaussisk. Därför har standardavvikelsen ett namn och därför härskar klockkurvorna i statistik.",
    },
    {
      pretitle: "Avsnitt 06 · Begränsningar",
      title: "Tunga svansar vägrar klockan",
      body: "CGS kräver ändlig varians. Släpp det antagandet och konstigare attraktorer tar över: de stabila fördelningarna, med Cauchy och Lévy i ytterkanten. Mandelbrots kritik mot finanssektorn — att avkastningar har «vilda» potenslagssvansar — är just den här poängen. När ett enskilt bidrag kan dominera summan dyker ingen klocka upp.",
    },
  ],
  closingPretitle: "Gå vidare",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren låter dig pressa N till 40, vrida myntet snett, se histogrammet fyllas i realtid och slå på Gausskurvan. Släpp tiotusen kulor och se satsen montera sig själv.",
  ctaLabel: "→ Öppna Utforskaren",
  simCaption: "Interaktivt · släpp kulor live",
  simRowsLabel: "Rader N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} kulor landade`,
  simHint:
    "Pinnar i cyan, fallande kulor i bärnsten, histogrammet fylls i cyan nedanför. Formen vässas vid varje fall.",
  simPretitle: "Interaktivt · quincunxen",
  simTitle: "Pinnar, kulor, fack — se klockan ta form",
  simBody:
    "Varje kula tar sin egen slumpväg; bara histogrammet konvergerar. Skjut N och se klockan vässas.",
  overlayCaption: "Interaktivt · binomial → normal",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Cyanstaplar: den exakta binomialen. Violett kurva: motsvarande Gauss. Den bärnstensfärgade streckade linjen markerar μ = N/2.",
  overlayPretitle: "Interaktivt · De Moivre–Laplace",
  overlayTitle: "Veva upp N — binomialen blir gaussisk",
  overlayBody:
    "Vid N = 4 är binomialen en grov trappa; vid N = 40 omfamnar Gausskurvan varje stapel. Det är konvergensen som de Moivre bevisade 1733 — den första centrala gränsvärdessatsen, förklädd.",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Analyse",
    title: "Galton-brettet",
    tagline: "Sprettende kuler tegner alltid den samme klokken.",
    intro:
      "En trekant av pinner, en kule sluppet på toppen, krone eller mynt ved hver sprett — og likevel, hver gang, fylles båsene nedenfor til samme kurve. Brettet er den sentrale grenseverdisetningen gjort håndgripelig: tusen myntkast som blir statistikkens mest universelle form.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Pinner, mynter, og en klokke som nekter å forsvinne.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Stable N rader med pinner i en trekant. Slipp en kule på toppen. Ved hver pinne den treffer går den til venstre eller høyre med et rettferdig myntkast. Etter N sprett lander den i en av N+1 båser. Én kule sier ingenting. Tusen kuler tegner en klokke — alltid den samme, uansett hvor mange ganger du nullstiller.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Ta N = 10. Sannsynligheten for å lande i bås k er C(10, k) / 1024. De elleve verdiene, multiplisert med 1024, blir (1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1) — rad 10 i Pascals trekant, allerede klokkeformet.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Klokken er ingen tilfeldighet. Det er den sentrale grenseverdisetningen på sin enkleste scene: summer mange uavhengige rettferdige mynter, skaler om, og fordelingen konvergerer mot en Gauss. Høyder, feil, testpoeng, avkastninger — alt som er summen av mange små uavhengige dytt havner her.",
      },
    ],
    tryIt: "Under: slipp kuler live, så se binomialen vri seg til normal mens du drar opp N.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Oppsettet",
      title: "N rader med pinner, ett rettferdig myntkast ved hver",
      body: "Francis Galtons quincunx fra 1889 er et brett med N forskjøvne rader pinner. En kule sluppet fra toppen treffer én pinne per rad og spretter til venstre eller høyre med sannsynlighet 1/2, uavhengig. Etter N rader lander den i en av N+1 oppsamlingsbåser, indeksert av antall høyresprett.",
    },
    {
      pretitle: "Avsnitt 02 · Landing hos Pascal",
      title: "P(bås = k) = C(N, k) / 2ᴺ",
      body: "Antall venstre-høyre-veier som leder til bås k er nøyaktig binomialkoeffisienten C(N, k) — de samme tallene som rad N i Pascals trekant. Del på de 2ᴺ totale veiene og du har bås-sannsynligheten. Galton-brettet er, i hemmelighet, en fysisk oppslagstabell for binomialkoeffisienter.",
    },
    {
      pretitle: "Avsnitt 03 · De Moivre–Laplace, 1733",
      title: "Binomial → normal",
      body: "Abraham de Moivre beviste i 1733 at C(N, k)/2ᴺ, når N vokser, konvergerer mot Gauss-tettheten (1/√(2π·N/4)) · exp(−(k − N/2)² / (N/2)). Laplace generaliserte til skjeve mynter i 1810. Dette er den første instansen av den sentrale grenseverdisetningen — et århundre før den generelle utsagnet.",
    },
    {
      pretitle: "Avsnitt 04 · Sentrale grenseverdisetning",
      title: "Hvilken som helst endelig varians, hvilken som helst fordeling → klokke",
      body: "Den generelle SGS, strengt bevist av Lyapunov i 1901 og skarpsleipet av Lindeberg i 1922, sier mye mer: ta HVILKE som helst uavhengige stokastiske variable med endelig varians — skjeve, diskrete, stygge — summer N av dem, skaler om. Grensen er en Gauss. Klokken er den universelle attraktoren for å ta gjennomsnitt.",
    },
    {
      pretitle: "Avsnitt 05 · Hvorfor den dukker opp overalt",
      title: "Høyder, feil, testpoeng, avkastninger",
      body: "Voksne høyder er en sum av tusenvis av små genetiske og miljømessige bidrag — det samme er målefeil, IQ-poeng, daglige logaritmiske avkastninger (under ryddige antakelser). Hver er summen av mange små uavhengige dytt, altså omtrent gaussisk. Derfor har standardavviket et navn og derfor hersker klokkekurvene i statistikken.",
    },
    {
      pretitle: "Avsnitt 06 · Grenser",
      title: "Tunge haler nekter klokken",
      body: "SGS krever endelig varians. Slipp den antakelsen og merkeligere attraktorer tar over: de stabile fordelingene, med Cauchy og Lévy ytterst. Mandelbrots kritikk av finans — at avkastninger har «ville» potenslovs-haler — er nettopp dette poenget. Når et enkelt bidrag kan overskygge summen, dukker ingen klokke opp.",
    },
  ],
  closingPretitle: "Gå videre",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren lar deg presse N til 40, skjeve på mynten, se histogrammet fylles i sanntid og slå på Gauss-kurven. Slipp ti tusen kuler og se setningen montere seg selv.",
  ctaLabel: "→ Åpne Utforskeren",
  simCaption: "Interaktivt · slipp kuler live",
  simRowsLabel: "Rader N",
  simSpawnLabel: "Spawn / frame",
  simBallsLabel: (n) => `${n.toLocaleString()} kuler landet`,
  simHint:
    "Pinner i cyan, fallende kuler i rav, histogrammet fylles i cyan under. Formen kvesses ved hvert fall.",
  simPretitle: "Interaktivt · quincunxen",
  simTitle: "Pinner, kuler, båser — se klokken ta form",
  simBody:
    "Hver kule tar sin egen tilfeldige vei; bare histogrammet konvergerer. Dra N og se klokken kvesses.",
  overlayCaption: "Interaktivt · binomial → normal",
  overlayNLabel: "N",
  overlayLegendBinomial: "C(N, k) / 2ᴺ",
  overlayLegendNormal: "𝒩(N/2, N/4)",
  overlayHint:
    "Cyan-søyler: den eksakte binomialen. Fiolett kurve: tilsvarende Gauss. Den rav-fargede stiplede linjen markerer μ = N/2.",
  overlayPretitle: "Interaktivt · De Moivre–Laplace",
  overlayTitle: "Skru opp N — binomialen blir gaussisk",
  overlayBody:
    "Ved N = 4 er binomialen en grov trapp; ved N = 40 omfavner Gauss-kurven hver søyle. Det er konvergensen de Moivre beviste i 1733 — den første sentrale grenseverdisetningen, i forkledning.",
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
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        {label}
      </div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

export default function GaltonStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;
  // Inject empty sections so the hero shell can consume StoryPage shape.
  const page = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/galton/explorer"
      accent={ACCENT}
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="P(bin = k) = C(N, k) / 2ᴺ   →   𝒩(N/2, N/4)"
      formulaLatex={
        "\\binom{N}{k} \\, 2^{-N} \\;\\xrightarrow[N \\to \\infty]{}\\; \\mathcal{N}\\!\\left(\\tfrac{N}{2},\\, \\tfrac{N}{4}\\right)"
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
                {i === 1 ? (
                  <>
                    <p>{card.body}</p>
                    <div className="hairline mt-4 space-y-1 rounded-md border bg-ink-950/60 p-3 text-center font-mono text-[11px] leading-relaxed text-signal-cyan">
                      <div className="text-[10px] uppercase tracking-widest2 text-ink-300">
                        N = 10 · row of Pascal
                      </div>
                      <div>1 · 10 · 45 · 120 · 210 · 252 · 210 · 120 · 45 · 10 · 1</div>
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

      {/* Section 01 — the setup */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 · Galton inline simulator */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.simPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.simTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.simBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <GaltonInlineSim
            caption={story.simCaption}
            rowsLabel={story.simRowsLabel}
            spawnLabel={story.simSpawnLabel}
            ballsLabel={story.simBallsLabel}
            hint={story.simHint}
          />
        </Reveal>
      </section>

      {/* Section 02 — Pascal landing */}
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
              N = 10 · bin probabilities × 1024
            </div>
            <div className="font-mono text-sm leading-relaxed text-ink-100 md:text-base">
              1 · 10 · 45 · 120 · 210 · <span className="text-signal-cyan">252</span> · 210 · 120 ·
              45 · 10 · 1
            </div>
            <p className="mx-auto max-w-xl text-xs text-ink-400">
              Total = 1024 = 2¹⁰. The centre fattens; the edges starve. Already a bell — and N is
              still tiny.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — De Moivre–Laplace */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · binomial → normal overlay */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.overlayPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.overlayTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.overlayBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <GaltonNormalOverlay
            caption={story.overlayCaption}
            nLabel={story.overlayNLabel}
            hint={story.overlayHint}
            legendBinomial={story.overlayLegendBinomial}
            legendNormal={story.overlayLegendNormal}
          />
        </Reveal>
      </section>

      {/* Section 04 — Central Limit Theorem */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Lyapunov 1901 · Lindeberg 1922
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              (X₁ + X₂ + … + Xₙ − nμ) / (σ√n) → 𝒩(0, 1)
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Independent, finite variance, any distribution. The standardised sum always converges
              to the standard normal — the bell is the universal attractor of averaging.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 05 — Why it's everywhere */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — Limitations */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec5!.pretitle}
          title={sec5!.title}
          body={sec5!.body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-6 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Where the bell breaks
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-200">
              Cauchy · Lévy · Pareto · stable distributions with infinite variance. Mandelbrot,
              1963: financial returns are «wild», not «mild».
            </p>
          </div>
        </Reveal>
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
            href="/galton/explorer"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
