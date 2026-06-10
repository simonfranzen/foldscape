"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { LorenzInlineRho } from "@/components/LorenzInlineRho";
import { LorenzTwoOrbits } from "@/components/LorenzTwoOrbits";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-coral";

// -----------------------------------------------------------------------------
// Rich, locale-aware story content extending the four-section base in
// stories.ts. We keep the canonical hero (s.pages.lorenz) untouched and
// layer encounter + six deeper sections + closing prose on top — fully
// translated into all eight supported locales.
// -----------------------------------------------------------------------------

type RichSection = { pretitle: string; title: string; body: string };

type RichStory = {
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: RichSection[]; // exactly 6
  inlineRho: { caption: string; rhoLabel: string; hint: string };
  twoOrbits: {
    captionA: string;
    captionB: string;
    playLabel: string;
    pauseLabel: string;
    resetLabel: string;
    timeLabel: string;
    divergenceLabel: string;
    legend: string;
  };
  dimensionCaption: string;
  dimensionNote: string;
  rhoBoringLabel: string;
  rhoBoringBody: string;
  rhoChaosLabel: string;
  rhoChaosBody: string;
  closingPill: string;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
};

const RICH_STORY: Record<Locale, RichStory> = {
  en: {
    encounter: {
      pretitle: "First encounter",
      title: "A weather scientist's accidental masterpiece",
      cards: [
        {
          label: "01 · The big idea",
          title: "Three lines that broke prediction",
          body: "In 1963 a quiet meteorologist named Edward Lorenz wrote down three short equations to model a slice of the atmosphere. The equations are simple enough to fit on a postcard. The behaviour they produce is so wild it ended the dream of perfect long-range weather forecasts and started a whole new branch of science.",
        },
        {
          label: "02 · A concrete example",
          title: "Two near-identical worlds drift apart",
          body: "Start two simulations with positions that differ by 0.00001 — about the width of a virus. For 20 seconds of simulated time the two paths trace the same butterfly wing. Then, almost without warning, one trajectory leaps to the other wing while the second stays put. After 30 seconds they are on opposite sides of the butterfly, totally uncorrelated.",
        },
        {
          label: "03 · Why it matters",
          title: "The butterfly effect, made of mathematics",
          body: "This is the origin of the 'butterfly effect' and the reason your weather app stops being trustworthy after about two weeks. Lorenz didn't invent chaos — he revealed that it was hiding inside the cleanest equations we knew, and he gave us a vocabulary for living with it.",
        },
      ],
      tryIt:
        "Drag the slider below to change ρ. Watch the shape collapse, breathe, and re-bloom into the butterfly.",
    },
    sections: [
      {
        pretitle: "Section one · The equations",
        title: "Three coupled rates of change",
        body: "Each equation describes how fast one quantity changes. x is the speed of the convection roll — warm air rising, cool air sinking. y is the horizontal temperature difference across the roll. z is the vertical departure from a linear temperature profile. The three pieces talk to each other: x pulls y, y pulls z, and z feeds back into y. The non-linear terms (xz and xy) are where chaos lives — without them the system would just be a damped oscillator.",
      },
      {
        pretitle: "Section two · Two regimes",
        title: "ρ < 1 is boring, ρ ≈ 28 is the butterfly",
        body: "ρ (the Rayleigh number) measures how hard you are heating the fluid from below. Below ρ = 1 nothing interesting happens: any starting condition decays to zero — no convection, just heat conduction. Between 1 and about 24.74 you get steady convection, with the trajectory spiralling into one of two fixed points. Cross ρ ≈ 24.74 and the fixed points lose stability; at the canonical value ρ = 28 the trajectory can no longer settle anywhere — it is condemned to roam the butterfly forever.",
      },
      {
        pretitle: "Section three · The wings",
        title: "Two ghosts at the centre of the butterfly",
        body: "Each wing is built around an unstable equilibrium — a point where the equations balance, but only fragilely. The trajectory spirals outward around one wing, gathering energy, until it suddenly slingshots across to the other wing and starts spiralling again. The number of loops on each wing before the jump is unpredictable. Sometimes 3, sometimes 17, never the same sequence twice — and that sequence is, in a precise sense, as random as a coin flip.",
      },
      {
        pretitle: "Section four · Sensitive dependence",
        title: "Why a virus-sized error becomes catastrophic",
        body: "Two trajectories separated by ε grow apart roughly like ε·eλt, where λ ≈ 0.906 is the leading Lyapunov exponent. That sounds tame until you do the arithmetic: in about 16 simulated seconds the gap multiplies by a million. Any uncertainty in the initial state — measurement noise, rounding in a computer, a butterfly flapping in Brazil — is amplified at this rate. Weather forecasts decay because the real atmosphere has its own positive Lyapunov exponent, and no amount of better sensors can outrun an exponential.",
      },
      {
        pretitle: "Section five · A strange attractor",
        title: "Dimension 2.06 — between a sheet and a solid",
        body: "Every trajectory, no matter where it starts, is sucked onto the same butterfly-shaped object. That object is the attractor. It is not a closed curve (which would have dimension 1) and not a smooth surface (dimension 2) and not a solid blob (dimension 3). Its Hausdorff dimension is approximately 2.06: a surface with a fractal frill, infinitely thin in one direction but never quite flat. Zoom in on any patch and you find the same wafer-thin layered structure. This is what 'strange' means in 'strange attractor'.",
      },
      {
        pretitle: "Section six · The cultural shockwave",
        title: "From a quiet 1963 paper to a household phrase",
        body: "Lorenz's paper went almost unnoticed for a decade. Then James Gleick's 1987 book 'Chaos' put the butterfly on every coffee table, and the phrase 'butterfly effect' entered the language. The deeper lesson is harder than the slogan: deterministic equations can be utterly unpredictable, the world is full of systems like this (climate, ecosystems, economies, hearts), and prediction is not a question of computing harder — it has a fundamental horizon. Modern weather services run dozens of slightly perturbed forecasts at once for exactly this reason.",
      },
    ],
    inlineRho: {
      caption: "Live · vary ρ from 0.5 to 35",
      rhoLabel: "ρ",
      hint: "Below 1: trajectory falls to the origin. Around 13.9: it settles to one of two fixed points. Past ≈24.7: the butterfly emerges.",
    },
    twoOrbits: {
      captionA: "Trajectory A · x₀ = 0.1",
      captionB: "Trajectory B · x₀ = 0.1 + 10⁻⁵",
      playLabel: "Play",
      pauseLabel: "Pause",
      resetLabel: "Reset",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Two trajectories. Same equations. Initial positions differ by a hundredth of a millionth.",
    },
    dimensionCaption: "Hausdorff dimension",
    dimensionNote:
      "Strictly between a surface (2) and a solid (3). Infinitely thin in one direction, fractally layered in another.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "No convection. Every trajectory dies into the origin.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Chaos. The trajectory never settles, never repeats.",
    closingPill: "Open the Explorer",
    closingTitle: "Hold the butterfly in your hands",
    closingBody:
      "The Explorer integrates the three equations live, lets you change σ, ρ, β, and rotates the attractor in three dimensions. You can also launch two close trajectories at once and watch them diverge.",
    closingCta: "→ Open the Explorer",
  },
  de: {
    encounter: {
      pretitle: "Erste Begegnung",
      title: "Das unfreiwillige Meisterwerk eines Meteorologen",
      cards: [
        {
          label: "01 · Die große Idee",
          title: "Drei Zeilen, die die Vorhersage brachen",
          body: "1963 schrieb ein stiller Meteorologe namens Edward Lorenz drei kurze Gleichungen auf, um einen Ausschnitt der Atmosphäre zu modellieren. Die Gleichungen sind einfach genug, um auf eine Postkarte zu passen. Ihr Verhalten ist so wild, dass es den Traum von perfekter Langzeit-Wettervorhersage beendete und einen neuen Wissenschaftszweig eröffnete.",
        },
        {
          label: "02 · Ein konkretes Beispiel",
          title: "Zwei fast identische Welten driften auseinander",
          body: "Starte zwei Simulationen mit Positionen, die sich um 0,00001 unterscheiden — etwa der Breite eines Virus. 20 simulierte Sekunden lang zeichnen beide Bahnen denselben Schmetterlingsflügel. Dann, fast ohne Vorwarnung, springt eine Bahn auf den anderen Flügel, während die zweite bleibt. Nach 30 Sekunden sind sie auf gegenüberliegenden Seiten des Schmetterlings, völlig unkorreliert.",
        },
        {
          label: "03 · Warum es zählt",
          title: "Der Schmetterlingseffekt, aus Mathematik gebaut",
          body: "Das ist der Ursprung des „Schmetterlingseffekts“ und der Grund, warum deine Wetter-App nach etwa zwei Wochen unzuverlässig wird. Lorenz hat das Chaos nicht erfunden — er hat gezeigt, dass es in den saubersten Gleichungen versteckt war, und uns ein Vokabular gegeben, damit zu leben.",
        },
      ],
      tryIt:
        "Zieh unten am Regler, um ρ zu ändern. Schau zu, wie die Form kollabiert, atmet und wieder zum Schmetterling aufblüht.",
    },
    sections: [
      {
        pretitle: "Abschnitt eins · Die Gleichungen",
        title: "Drei gekoppelte Änderungsraten",
        body: "Jede Gleichung beschreibt, wie schnell sich eine Größe ändert. x ist die Geschwindigkeit der Konvektionsrolle — warme Luft steigt, kalte sinkt. y ist die horizontale Temperaturdifferenz quer zur Rolle. z ist die vertikale Abweichung vom linearen Temperaturprofil. Die drei Stücke reden miteinander: x zieht y, y zieht z, und z wirkt auf y zurück. Die nichtlinearen Terme (xz und xy) sind, wo das Chaos wohnt — ohne sie wäre das System nur ein gedämpfter Oszillator.",
      },
      {
        pretitle: "Abschnitt zwei · Zwei Regime",
        title: "ρ < 1 ist langweilig, ρ ≈ 28 ist der Schmetterling",
        body: "ρ (die Rayleigh-Zahl) misst, wie stark du die Flüssigkeit von unten heizt. Unter ρ = 1 passiert nichts Interessantes: jeder Anfangszustand zerfällt zur Null — keine Konvektion, nur Wärmeleitung. Zwischen 1 und etwa 24,74 bekommst du stetige Konvektion, die Bahn spiralt in einen von zwei Fixpunkten. Überschreite ρ ≈ 24,74 und die Fixpunkte verlieren ihre Stabilität; beim kanonischen Wert ρ = 28 kann die Bahn nirgends mehr zur Ruhe kommen — sie ist verdammt, ewig den Schmetterling abzulaufen.",
      },
      {
        pretitle: "Abschnitt drei · Die Flügel",
        title: "Zwei Geister im Zentrum des Schmetterlings",
        body: "Jeder Flügel ist um ein instabiles Gleichgewicht herum gebaut — einen Punkt, an dem die Gleichungen sich ausgleichen, aber nur zerbrechlich. Die Bahn spiralt um einen Flügel nach außen, sammelt Energie, und schleudert sich plötzlich auf den anderen Flügel, wo sie wieder zu spiralen beginnt. Die Anzahl der Schleifen vor dem Sprung ist unvorhersehbar. Mal 3, mal 17, nie dieselbe Folge zweimal — und diese Folge ist, in präzisem Sinne, so zufällig wie ein Münzwurf.",
      },
      {
        pretitle: "Abschnitt vier · Sensitive Abhängigkeit",
        title: "Warum ein virusgroßer Fehler katastrophal wird",
        body: "Zwei Bahnen, durch ε getrennt, wachsen ungefähr wie ε·eλt auseinander, wobei λ ≈ 0,906 der größte Lyapunov-Exponent ist. Das klingt zahm, bis du rechnest: in etwa 16 simulierten Sekunden multipliziert sich der Abstand um eine Million. Jede Unsicherheit im Anfangszustand — Messrauschen, Rundung im Computer, ein Schmetterlingsflügel in Brasilien — wird mit dieser Rate verstärkt. Wettervorhersagen zerfallen, weil die reale Atmosphäre ihren eigenen positiven Lyapunov-Exponenten hat, und keine besseren Sensoren können einer Exponentialfunktion davonlaufen.",
      },
      {
        pretitle: "Abschnitt fünf · Ein seltsamer Attraktor",
        title: "Dimension 2,06 — zwischen Fläche und Volumen",
        body: "Jede Bahn, egal wo sie startet, wird auf dasselbe schmetterlingsförmige Objekt gesogen. Dieses Objekt ist der Attraktor. Es ist keine geschlossene Kurve (Dimension 1) und keine glatte Fläche (Dimension 2) und kein massiver Klumpen (Dimension 3). Seine Hausdorff-Dimension liegt bei etwa 2,06: eine Fläche mit fraktaler Krause, in einer Richtung unendlich dünn, aber nie ganz flach. Zoom in irgendeinen Fleck und du findest dieselbe wafer-dünne Schichtstruktur. Das meint „seltsam“ in „seltsamer Attraktor“.",
      },
      {
        pretitle: "Abschnitt sechs · Die kulturelle Schockwelle",
        title: "Von einem stillen 1963er-Paper zur Alltagsmetapher",
        body: "Lorenz' Paper blieb ein Jahrzehnt fast unbeachtet. Dann legte James Gleicks Buch „Chaos“ (1987) den Schmetterling auf jeden Couchtisch, und „Schmetterlingseffekt“ wanderte in die Alltagssprache. Die tiefere Lehre ist härter als der Slogan: deterministische Gleichungen können vollkommen unvorhersehbar sein, die Welt steckt voller solcher Systeme (Klima, Ökosysteme, Volkswirtschaften, Herzen), und Vorhersage ist keine Frage von mehr Rechnen — sie hat einen fundamentalen Horizont. Moderne Wetterdienste lassen aus genau diesem Grund Dutzende leicht gestörter Vorhersagen gleichzeitig laufen.",
      },
    ],
    inlineRho: {
      caption: "Live · ρ von 0,5 bis 35 variieren",
      rhoLabel: "ρ",
      hint: "Unter 1: die Bahn fällt in den Ursprung. Um 13,9: sie landet in einem von zwei Fixpunkten. Ab ≈24,7: der Schmetterling erscheint.",
    },
    twoOrbits: {
      captionA: "Bahn A · x₀ = 0,1",
      captionB: "Bahn B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Start",
      pauseLabel: "Pause",
      resetLabel: "Zurücksetzen",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Zwei Bahnen. Dieselben Gleichungen. Anfangspositionen unterscheiden sich um ein Hundertstel eines Millionstels.",
    },
    dimensionCaption: "Hausdorff-Dimension",
    dimensionNote:
      "Streng zwischen Fläche (2) und Volumen (3). Unendlich dünn in einer Richtung, fraktal geschichtet in einer anderen.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Keine Konvektion. Jede Bahn stirbt in den Ursprung.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Chaos. Die Bahn kommt nie zur Ruhe, wiederholt sich nie.",
    closingPill: "Explorer öffnen",
    closingTitle: "Halte den Schmetterling in den Händen",
    closingBody:
      "Der Explorer integriert die drei Gleichungen live, lässt dich σ, ρ, β ändern und den Attraktor in drei Dimensionen drehen. Du kannst auch zwei nahe Bahnen gleichzeitig starten und ihrem Auseinanderdriften zusehen.",
    closingCta: "→ Explorer öffnen",
  },
  es: {
    encounter: {
      pretitle: "Primer encuentro",
      title: "La obra maestra accidental de un meteorólogo",
      cards: [
        {
          label: "01 · La gran idea",
          title: "Tres líneas que rompieron la predicción",
          body: "En 1963, un meteorólogo discreto llamado Edward Lorenz escribió tres ecuaciones cortas para modelar un trozo de la atmósfera. Caben en una postal. Su comportamiento es tan salvaje que acabó con el sueño de pronósticos meteorológicos perfectos a largo plazo y abrió una nueva rama de la ciencia.",
        },
        {
          label: "02 · Un ejemplo concreto",
          title: "Dos mundos casi idénticos se separan",
          body: "Lanza dos simulaciones cuyas posiciones difieran en 0,00001 — el ancho aproximado de un virus. Durante 20 segundos simulados ambas trayectorias dibujan la misma ala de la mariposa. Después, casi sin aviso, una salta al otro lado mientras la otra se queda. Tras 30 segundos están en alas opuestas, completamente descorrelacionadas.",
        },
        {
          label: "03 · Por qué importa",
          title: "El efecto mariposa, hecho de matemáticas",
          body: "Este es el origen del «efecto mariposa» y la razón por la que tu app del tiempo deja de ser fiable después de unas dos semanas. Lorenz no inventó el caos — reveló que se escondía dentro de las ecuaciones más limpias que teníamos y nos dio un vocabulario para convivir con él.",
        },
      ],
      tryIt:
        "Mueve el deslizador para cambiar ρ. Observa cómo la forma colapsa, respira y vuelve a florecer en la mariposa.",
    },
    sections: [
      {
        pretitle: "Sección uno · Las ecuaciones",
        title: "Tres tasas de cambio acopladas",
        body: "Cada ecuación describe a qué velocidad cambia una magnitud. x es la velocidad del rollo de convección — aire caliente que sube, aire frío que baja. y es la diferencia horizontal de temperatura. z es la desviación vertical respecto a un perfil lineal de temperatura. Las tres se hablan entre sí: x tira de y, y tira de z, y z retroalimenta a y. Los términos no lineales (xz y xy) son donde vive el caos — sin ellos sería un oscilador amortiguado.",
      },
      {
        pretitle: "Sección dos · Dos regímenes",
        title: "ρ < 1 es aburrido, ρ ≈ 28 es la mariposa",
        body: "ρ (el número de Rayleigh) mide cuánto calientas el fluido desde abajo. Por debajo de ρ = 1 no pasa nada: cualquier condición inicial decae a cero — sin convección, solo conducción. Entre 1 y unos 24,74 hay convección estable, con la trayectoria espiralando hacia uno de dos puntos fijos. Cruza ρ ≈ 24,74 y los puntos fijos pierden estabilidad; en el valor canónico ρ = 28 la trayectoria ya no puede asentarse en ningún sitio — está condenada a recorrer la mariposa para siempre.",
      },
      {
        pretitle: "Sección tres · Las alas",
        title: "Dos fantasmas en el centro de la mariposa",
        body: "Cada ala está construida alrededor de un equilibrio inestable — un punto donde las ecuaciones se equilibran, pero solo frágilmente. La trayectoria espirala hacia afuera alrededor de un ala, acumulando energía, hasta que de pronto salta al ala opuesta y empieza a espiralar de nuevo. El número de vueltas antes del salto es impredecible. A veces 3, a veces 17, nunca la misma secuencia dos veces — y esa secuencia es, en sentido preciso, tan aleatoria como lanzar una moneda.",
      },
      {
        pretitle: "Sección cuatro · Dependencia sensible",
        title: "Por qué un error del tamaño de un virus se vuelve catastrófico",
        body: "Dos trayectorias separadas por ε se alejan aproximadamente como ε·eλt, donde λ ≈ 0,906 es el exponente de Lyapunov dominante. Suena manso hasta que haces la cuenta: en unos 16 segundos simulados la separación se multiplica por un millón. Cualquier incertidumbre en el estado inicial — ruido de medición, redondeo en el ordenador, una mariposa aleteando en Brasil — se amplifica a este ritmo. Los pronósticos meteorológicos se degradan porque la atmósfera real tiene su propio exponente de Lyapunov positivo, y ningún sensor mejor le gana a una exponencial.",
      },
      {
        pretitle: "Sección cinco · Un atractor extraño",
        title: "Dimensión 2,06 — entre superficie y volumen",
        body: "Cualquier trayectoria, donde sea que empiece, es absorbida hacia el mismo objeto en forma de mariposa. Ese objeto es el atractor. No es una curva cerrada (dimensión 1), ni una superficie lisa (dimensión 2), ni un sólido (dimensión 3). Su dimensión de Hausdorff es aproximadamente 2,06: una superficie con un fleco fractal, infinitamente delgada en una dirección pero nunca completamente plana. Acércate a cualquier zona y encontrarás la misma estructura laminar finísima. Eso significa «extraño» en «atractor extraño».",
      },
      {
        pretitle: "Sección seis · La onda cultural",
        title: "De un artículo silencioso a una frase cotidiana",
        body: "El artículo de Lorenz pasó casi inadvertido durante una década. Luego el libro «Caos» (1987) de James Gleick puso la mariposa en cada salón, y la frase «efecto mariposa» entró en el idioma. La lección profunda es más dura que el eslogan: ecuaciones deterministas pueden ser completamente impredecibles, el mundo está lleno de sistemas así (clima, ecosistemas, economías, corazones), y la predicción no es cuestión de calcular más fuerte — tiene un horizonte fundamental. Los servicios meteorológicos modernos ejecutan docenas de pronósticos ligeramente perturbados en paralelo precisamente por eso.",
      },
    ],
    inlineRho: {
      caption: "En vivo · varía ρ de 0,5 a 35",
      rhoLabel: "ρ",
      hint: "Por debajo de 1: la trayectoria cae al origen. Alrededor de 13,9: se asienta en uno de dos puntos fijos. Tras ≈24,7: aparece la mariposa.",
    },
    twoOrbits: {
      captionA: "Trayectoria A · x₀ = 0,1",
      captionB: "Trayectoria B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Reproducir",
      pauseLabel: "Pausa",
      resetLabel: "Reiniciar",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Dos trayectorias. Las mismas ecuaciones. Posiciones iniciales que difieren en una centésima de millonésima.",
    },
    dimensionCaption: "Dimensión de Hausdorff",
    dimensionNote:
      "Estrictamente entre superficie (2) y sólido (3). Infinitamente delgada en una dirección, fractalmente laminada en otra.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Sin convección. Toda trayectoria muere en el origen.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Caos. La trayectoria nunca se asienta, nunca se repite.",
    closingPill: "Abrir el Explorer",
    closingTitle: "Sostén la mariposa entre las manos",
    closingBody:
      "El Explorer integra las tres ecuaciones en vivo, te deja cambiar σ, ρ, β y rotar el atractor en tres dimensiones. También puedes lanzar dos trayectorias cercanas a la vez y verlas separarse.",
    closingCta: "→ Abrir el Explorer",
  },
  fr: {
    encounter: {
      pretitle: "Première rencontre",
      title: "Le chef-d'œuvre accidentel d'un météorologue",
      cards: [
        {
          label: "01 · La grande idée",
          title: "Trois lignes qui ont brisé la prévision",
          body: "En 1963, un météorologue discret, Edward Lorenz, a écrit trois courtes équations pour modéliser une tranche d'atmosphère. Elles tiennent sur une carte postale. Leur comportement est si sauvage qu'il a mis fin au rêve d'une prévision météo parfaite à long terme et fondé une nouvelle branche de la science.",
        },
        {
          label: "02 · Un exemple concret",
          title: "Deux mondes presque identiques s'écartent",
          body: "Lance deux simulations dont les positions diffèrent de 0,00001 — environ la largeur d'un virus. Pendant 20 secondes simulées, les deux trajectoires dessinent la même aile du papillon. Puis, presque sans prévenir, l'une bondit sur l'autre aile, tandis que la seconde reste. Après 30 secondes, elles sont sur des ailes opposées, complètement décorrélées.",
        },
        {
          label: "03 · Pourquoi c'est important",
          title: "L'effet papillon, en mathématiques",
          body: "C'est l'origine de « l'effet papillon » et la raison pour laquelle votre appli météo cesse d'être fiable après environ deux semaines. Lorenz n'a pas inventé le chaos — il a révélé qu'il se cachait dans les équations les plus propres et nous a donné un vocabulaire pour vivre avec.",
        },
      ],
      tryIt:
        "Glisse le curseur pour changer ρ. Regarde la forme s'effondrer, respirer et refleurir en papillon.",
    },
    sections: [
      {
        pretitle: "Section un · Les équations",
        title: "Trois taux de variation couplés",
        body: "Chaque équation décrit à quelle vitesse une grandeur change. x est la vitesse du rouleau de convection — air chaud qui monte, air froid qui descend. y est la différence horizontale de température. z est l'écart vertical par rapport au profil linéaire. Les trois pièces se parlent : x tire y, y tire z, z rétroagit sur y. Les termes non linéaires (xz et xy) sont là où vit le chaos — sans eux, le système ne serait qu'un oscillateur amorti.",
      },
      {
        pretitle: "Section deux · Deux régimes",
        title: "ρ < 1 est ennuyeux, ρ ≈ 28 est le papillon",
        body: "ρ (le nombre de Rayleigh) mesure l'intensité du chauffage par le bas. Sous ρ = 1, rien : toute condition initiale décroît vers zéro — pas de convection, juste de la conduction. Entre 1 et environ 24,74, convection stable : la trajectoire spirale vers l'un de deux points fixes. Passe ρ ≈ 24,74 et les points fixes deviennent instables ; à la valeur canonique ρ = 28, la trajectoire ne peut plus se poser nulle part — condamnée à parcourir le papillon pour toujours.",
      },
      {
        pretitle: "Section trois · Les ailes",
        title: "Deux fantômes au centre du papillon",
        body: "Chaque aile est construite autour d'un équilibre instable — un point où les équations s'équilibrent, mais fragilement. La trajectoire spirale vers l'extérieur autour d'une aile, accumule de l'énergie, puis catapulte vers l'autre aile et y reprend sa spirale. Le nombre de boucles avant le saut est imprévisible. Parfois 3, parfois 17, jamais la même séquence — et cette séquence est, en un sens précis, aussi aléatoire qu'un lancer de pièce.",
      },
      {
        pretitle: "Section quatre · Dépendance sensible",
        title: "Pourquoi une erreur de la taille d'un virus devient catastrophique",
        body: "Deux trajectoires séparées par ε s'écartent approximativement comme ε·eλt, où λ ≈ 0,906 est l'exposant de Lyapunov dominant. Cela paraît docile jusqu'au calcul : en environ 16 secondes simulées, l'écart est multiplié par un million. Toute incertitude initiale — bruit de mesure, arrondi machine, un papillon battant des ailes au Brésil — est amplifiée à ce rythme. Les prévisions météo se dégradent parce que l'atmosphère réelle a son propre exposant de Lyapunov positif, et aucun meilleur capteur ne distance une exponentielle.",
      },
      {
        pretitle: "Section cinq · Un attracteur étrange",
        title: "Dimension 2,06 — entre surface et solide",
        body: "Toute trajectoire, où qu'elle commence, est aspirée vers le même objet en forme de papillon. Cet objet est l'attracteur. Ce n'est pas une courbe fermée (dimension 1), ni une surface lisse (dimension 2), ni un solide (dimension 3). Sa dimension de Hausdorff vaut environ 2,06 : une surface à franges fractales, infiniment mince dans une direction sans jamais être plate. Zoome sur n'importe quel coin et tu retrouves la même structure feuilletée. Voilà ce que « étrange » veut dire dans « attracteur étrange ».",
      },
      {
        pretitle: "Section six · L'onde culturelle",
        title: "D'un article confidentiel à une phrase quotidienne",
        body: "L'article de Lorenz est passé presque inaperçu pendant une décennie. Puis le livre « Chaos » de James Gleick (1987) a posé le papillon sur toutes les tables basses, et « effet papillon » est entré dans la langue. La leçon profonde est plus dure que le slogan : des équations déterministes peuvent être totalement imprévisibles, le monde regorge de tels systèmes (climat, écosystèmes, économies, cœurs), et la prévision n'est pas une question de calculer plus fort — elle a un horizon fondamental. C'est exactement pour cela que les services météo modernes lancent des dizaines de prévisions légèrement perturbées en parallèle.",
      },
    ],
    inlineRho: {
      caption: "En direct · varier ρ de 0,5 à 35",
      rhoLabel: "ρ",
      hint: "Sous 1 : la trajectoire chute à l'origine. Autour de 13,9 : elle se pose sur un des deux points fixes. Au-delà d'≈24,7 : le papillon émerge.",
    },
    twoOrbits: {
      captionA: "Trajectoire A · x₀ = 0,1",
      captionB: "Trajectoire B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Lecture",
      pauseLabel: "Pause",
      resetLabel: "Réinit.",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Deux trajectoires. Mêmes équations. Positions initiales différant d'un centième de millionième.",
    },
    dimensionCaption: "Dimension de Hausdorff",
    dimensionNote:
      "Strictement entre surface (2) et solide (3). Infiniment mince dans une direction, fractalement feuilletée dans une autre.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Pas de convection. Toute trajectoire meurt à l'origine.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Chaos. La trajectoire ne se pose jamais, ne se répète jamais.",
    closingPill: "Ouvrir l'Explorer",
    closingTitle: "Tiens le papillon entre tes mains",
    closingBody:
      "L'Explorer intègre les trois équations en direct, te laisse changer σ, ρ, β et faire tourner l'attracteur en 3D. Tu peux aussi lancer deux trajectoires proches et les regarder diverger.",
    closingCta: "→ Ouvrir l'Explorer",
  },
  it: {
    encounter: {
      pretitle: "Primo incontro",
      title: "Il capolavoro accidentale di un meteorologo",
      cards: [
        {
          label: "01 · La grande idea",
          title: "Tre righe che ruppero la previsione",
          body: "Nel 1963 un meteorologo discreto di nome Edward Lorenz scrisse tre brevi equazioni per modellare una fetta di atmosfera. Stanno su una cartolina. Il loro comportamento è così selvaggio da aver chiuso il sogno di previsioni meteo perfette a lungo termine e da aver aperto un nuovo ramo della scienza.",
        },
        {
          label: "02 · Un esempio concreto",
          title: "Due mondi quasi identici si allontanano",
          body: "Avvia due simulazioni con posizioni che differiscono di 0,00001 — circa la larghezza di un virus. Per 20 secondi simulati le due traiettorie disegnano la stessa ala della farfalla. Poi, quasi senza preavviso, una salta sull'altra ala mentre la seconda resta. Dopo 30 secondi sono su ali opposte, del tutto scorrelate.",
        },
        {
          label: "03 · Perché conta",
          title: "L'effetto farfalla, fatto di matematica",
          body: "È l'origine dell'«effetto farfalla» e la ragione per cui la tua app meteo smette di essere affidabile dopo circa due settimane. Lorenz non ha inventato il caos — ha rivelato che si nascondeva nelle equazioni più pulite e ci ha dato un vocabolario per conviverci.",
        },
      ],
      tryIt:
        "Trascina il cursore per cambiare ρ. Guarda la forma collassare, respirare e rifiorire in farfalla.",
    },
    sections: [
      {
        pretitle: "Sezione uno · Le equazioni",
        title: "Tre tassi di variazione accoppiati",
        body: "Ogni equazione descrive quanto velocemente cambia una grandezza. x è la velocità del rotolo di convezione — aria calda che sale, aria fredda che scende. y è la differenza orizzontale di temperatura. z è la deviazione verticale dal profilo lineare. I tre pezzi si parlano: x tira y, y tira z, z retroagisce su y. I termini non lineari (xz e xy) sono dove vive il caos — senza di loro sarebbe un oscillatore smorzato.",
      },
      {
        pretitle: "Sezione due · Due regimi",
        title: "ρ < 1 è noioso, ρ ≈ 28 è la farfalla",
        body: "ρ (il numero di Rayleigh) misura quanto scaldi il fluido dal basso. Sotto ρ = 1 non accade nulla: ogni condizione iniziale decade a zero — niente convezione, solo conduzione. Tra 1 e circa 24,74 hai convezione stabile, con la traiettoria che spirala verso uno di due punti fissi. Supera ρ ≈ 24,74 e i punti fissi perdono stabilità; al valore canonico ρ = 28 la traiettoria non può più stabilirsi da nessuna parte — è condannata a percorrere la farfalla per sempre.",
      },
      {
        pretitle: "Sezione tre · Le ali",
        title: "Due fantasmi al centro della farfalla",
        body: "Ogni ala è costruita attorno a un equilibrio instabile — un punto in cui le equazioni si bilanciano, ma fragilmente. La traiettoria spirala verso l'esterno attorno a un'ala, accumulando energia, finché di colpo si lancia sull'altra ala e ricomincia a spiralare. Il numero di giri prima del salto è imprevedibile. A volte 3, a volte 17, mai la stessa sequenza due volte — e quella sequenza è, in senso preciso, casuale come il lancio di una moneta.",
      },
      {
        pretitle: "Sezione quattro · Dipendenza sensibile",
        title: "Perché un errore di grandezza virale diventa catastrofico",
        body: "Due traiettorie separate da ε si allontanano grossomodo come ε·eλt, dove λ ≈ 0,906 è l'esponente di Lyapunov dominante. Sembra mansueto finché non fai il conto: in circa 16 secondi simulati la separazione si moltiplica per un milione. Ogni incertezza iniziale — rumore di misura, arrotondamento di macchina, una farfalla che batte le ali in Brasile — è amplificata a questo ritmo. Le previsioni meteo decadono perché l'atmosfera reale ha il proprio esponente di Lyapunov positivo, e nessun sensore migliore batte un esponenziale.",
      },
      {
        pretitle: "Sezione cinque · Un attrattore strano",
        title: "Dimensione 2,06 — tra superficie e solido",
        body: "Ogni traiettoria, ovunque inizi, è risucchiata sullo stesso oggetto a forma di farfalla. Quell'oggetto è l'attrattore. Non è una curva chiusa (dimensione 1), né una superficie liscia (dimensione 2), né un solido (dimensione 3). La sua dimensione di Hausdorff è circa 2,06: una superficie con frange frattali, infinitamente sottile in una direzione ma mai del tutto piatta. Ingrandisci un punto qualsiasi e ritrovi la stessa struttura a fogli. Ecco cosa significa «strano» in «attrattore strano».",
      },
      {
        pretitle: "Sezione sei · L'onda culturale",
        title: "Da un articolo silenzioso a una frase di tutti i giorni",
        body: "L'articolo di Lorenz passò quasi inosservato per un decennio. Poi il libro «Chaos» di James Gleick (1987) mise la farfalla su ogni tavolino e «effetto farfalla» entrò nella lingua. La lezione profonda è più dura dello slogan: equazioni deterministiche possono essere del tutto imprevedibili, il mondo è pieno di tali sistemi (clima, ecosistemi, economie, cuori) e la previsione non è questione di calcolare di più — ha un orizzonte fondamentale. I servizi meteo moderni lanciano decine di previsioni leggermente perturbate in parallelo proprio per questo.",
      },
    ],
    inlineRho: {
      caption: "Live · varia ρ da 0,5 a 35",
      rhoLabel: "ρ",
      hint: "Sotto 1: la traiettoria cade nell'origine. Attorno a 13,9: si stabilisce su uno dei due punti fissi. Oltre ≈24,7: la farfalla emerge.",
    },
    twoOrbits: {
      captionA: "Traiettoria A · x₀ = 0,1",
      captionB: "Traiettoria B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Play",
      pauseLabel: "Pausa",
      resetLabel: "Reset",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Due traiettorie. Stesse equazioni. Posizioni iniziali che differiscono di un centesimo di milionesimo.",
    },
    dimensionCaption: "Dimensione di Hausdorff",
    dimensionNote:
      "Strettamente fra superficie (2) e solido (3). Infinitamente sottile in una direzione, frattalmente stratificata in un'altra.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Niente convezione. Ogni traiettoria muore nell'origine.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Caos. La traiettoria non si stabilizza mai, non si ripete mai.",
    closingPill: "Apri l'Explorer",
    closingTitle: "Tieni la farfalla tra le mani",
    closingBody:
      "L'Explorer integra le tre equazioni in tempo reale, ti lascia cambiare σ, ρ, β e ruotare l'attrattore in tre dimensioni. Puoi anche lanciare due traiettorie vicine e osservarle divergere.",
    closingCta: "→ Apri l'Explorer",
  },
  pt: {
    encounter: {
      pretitle: "Primeiro encontro",
      title: "A obra-prima acidental de um meteorologista",
      cards: [
        {
          label: "01 · A grande ideia",
          title: "Três linhas que quebraram a previsão",
          body: "Em 1963, um meteorologista discreto chamado Edward Lorenz escreveu três equações curtas para modelar um pedaço da atmosfera. Cabem num cartão-postal. O comportamento é tão selvagem que encerrou o sonho de previsões meteorológicas perfeitas a longo prazo e abriu um novo ramo da ciência.",
        },
        {
          label: "02 · Um exemplo concreto",
          title: "Dois mundos quase idênticos se afastam",
          body: "Inicie duas simulações com posições que diferem em 0,00001 — cerca da largura de um vírus. Durante 20 segundos simulados as duas trajetórias traçam a mesma asa da borboleta. Depois, quase sem aviso, uma salta para a outra asa enquanto a outra permanece. Após 30 segundos estão em asas opostas, totalmente descorrelacionadas.",
        },
        {
          label: "03 · Por que importa",
          title: "O efeito borboleta, feito de matemática",
          body: "É a origem do «efeito borboleta» e a razão pela qual o seu app de clima deixa de ser confiável depois de cerca de duas semanas. Lorenz não inventou o caos — revelou que ele se escondia dentro das equações mais limpas e nos deu um vocabulário para conviver com ele.",
        },
      ],
      tryIt:
        "Arraste o controle para mudar ρ. Veja a forma colapsar, respirar e voltar a florescer em borboleta.",
    },
    sections: [
      {
        pretitle: "Seção um · As equações",
        title: "Três taxas de variação acopladas",
        body: "Cada equação descreve a velocidade com que uma grandeza muda. x é a velocidade do rolo de convecção — ar quente que sobe, ar frio que desce. y é a diferença horizontal de temperatura. z é o desvio vertical do perfil linear. As três peças conversam: x puxa y, y puxa z, z retroage sobre y. Os termos não lineares (xz e xy) são onde mora o caos — sem eles, seria apenas um oscilador amortecido.",
      },
      {
        pretitle: "Seção dois · Dois regimes",
        title: "ρ < 1 é tedioso, ρ ≈ 28 é a borboleta",
        body: "ρ (o número de Rayleigh) mede o quanto você aquece o fluido por baixo. Abaixo de ρ = 1 nada acontece: qualquer condição inicial decai a zero — sem convecção, só condução. Entre 1 e cerca de 24,74 há convecção estável, com a trajetória espiralando em direção a um de dois pontos fixos. Cruze ρ ≈ 24,74 e os pontos fixos perdem estabilidade; no valor canônico ρ = 28 a trajetória já não pode se acomodar — está condenada a percorrer a borboleta para sempre.",
      },
      {
        pretitle: "Seção três · As asas",
        title: "Dois fantasmas no centro da borboleta",
        body: "Cada asa é construída em torno de um equilíbrio instável — um ponto em que as equações se equilibram, mas só frágilmente. A trajetória espirala para fora ao redor de uma asa, acumulando energia, até que de repente é arremessada para a outra asa e recomeça a espiralar. O número de voltas antes do salto é imprevisível. Às vezes 3, às vezes 17, nunca a mesma sequência duas vezes — e essa sequência é, em sentido preciso, tão aleatória quanto um lançamento de moeda.",
      },
      {
        pretitle: "Seção quatro · Dependência sensível",
        title: "Por que um erro do tamanho de um vírus se torna catastrófico",
        body: "Duas trajetórias separadas por ε se afastam aproximadamente como ε·eλt, onde λ ≈ 0,906 é o expoente de Lyapunov dominante. Parece manso até você fazer a conta: em cerca de 16 segundos simulados o intervalo se multiplica por um milhão. Qualquer incerteza inicial — ruído de medição, arredondamento do computador, uma borboleta batendo as asas no Brasil — é amplificada a esse ritmo. Previsões meteorológicas decaem porque a atmosfera real tem seu próprio expoente de Lyapunov positivo, e nenhum sensor melhor vence uma exponencial.",
      },
      {
        pretitle: "Seção cinco · Um atrator estranho",
        title: "Dimensão 2,06 — entre superfície e sólido",
        body: "Qualquer trajetória, onde quer que comece, é sugada para o mesmo objeto em forma de borboleta. Esse objeto é o atrator. Não é uma curva fechada (dimensão 1), nem uma superfície lisa (dimensão 2), nem um sólido (dimensão 3). Sua dimensão de Hausdorff é cerca de 2,06: uma superfície com franja fractal, infinitamente fina em uma direção mas nunca de fato plana. Aproxime-se de qualquer ponto e encontre a mesma estrutura em folhas finíssimas. Isso é o que «estranho» significa em «atrator estranho».",
      },
      {
        pretitle: "Seção seis · A onda cultural",
        title: "De um artigo silencioso a uma frase do cotidiano",
        body: "O artigo de Lorenz passou quase despercebido por uma década. Depois o livro «Chaos» de James Gleick (1987) pôs a borboleta em cada mesa de centro, e «efeito borboleta» entrou na língua. A lição profunda é mais dura que o slogan: equações deterministas podem ser completamente imprevisíveis, o mundo está cheio desses sistemas (clima, ecossistemas, economias, corações), e previsão não é uma questão de calcular mais — tem um horizonte fundamental. Os serviços meteorológicos modernos rodam dezenas de previsões ligeiramente perturbadas em paralelo exatamente por isso.",
      },
    ],
    inlineRho: {
      caption: "Ao vivo · varie ρ de 0,5 a 35",
      rhoLabel: "ρ",
      hint: "Abaixo de 1: a trajetória cai na origem. Em torno de 13,9: assenta em um de dois pontos fixos. Acima de ≈24,7: a borboleta emerge.",
    },
    twoOrbits: {
      captionA: "Trajetória A · x₀ = 0,1",
      captionB: "Trajetória B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Tocar",
      pauseLabel: "Pausa",
      resetLabel: "Reset",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Duas trajetórias. As mesmas equações. Posições iniciais que diferem em um centésimo de milionésimo.",
    },
    dimensionCaption: "Dimensão de Hausdorff",
    dimensionNote:
      "Estritamente entre superfície (2) e sólido (3). Infinitamente fina em uma direção, fractalmente estratificada em outra.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Sem convecção. Toda trajetória morre na origem.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Caos. A trajetória nunca se acomoda, nunca se repete.",
    closingPill: "Abrir o Explorer",
    closingTitle: "Segure a borboleta nas mãos",
    closingBody:
      "O Explorer integra as três equações ao vivo, deixa você mudar σ, ρ, β e girar o atrator em três dimensões. Você também pode lançar duas trajetórias próximas ao mesmo tempo e vê-las divergir.",
    closingCta: "→ Abrir o Explorer",
  },
  sv: {
    encounter: {
      pretitle: "Första mötet",
      title: "En meteorologs oavsiktliga mästerverk",
      cards: [
        {
          label: "01 · Den stora idén",
          title: "Tre rader som bröt prognosen",
          body: "År 1963 skrev en stillsam meteorolog vid namn Edward Lorenz ner tre korta ekvationer för att modellera en bit av atmosfären. De får plats på ett vykort. Beteendet de ger upphov till är så vilt att det avslutade drömmen om perfekta långtidsväderprognoser och startade en helt ny gren av vetenskapen.",
        },
        {
          label: "02 · Ett konkret exempel",
          title: "Två nästan identiska världar driver isär",
          body: "Starta två simuleringar vars positioner skiljer sig med 0,00001 — ungefär bredden på ett virus. Under 20 simulerade sekunder ritar båda banorna samma fjärilsvinge. Sedan, nästan utan förvarning, hoppar den ena till den andra vingen medan den andra stannar. Efter 30 sekunder är de på motsatta vingar, helt okorrelerade.",
        },
        {
          label: "03 · Varför det spelar roll",
          title: "Fjärilseffekten, byggd av matematik",
          body: "Det här är ursprunget till «fjärilseffekten» och anledningen till att din väderapp blir opålitlig efter cirka två veckor. Lorenz uppfann inte kaoset — han avslöjade att det gömde sig i de renaste ekvationerna vi kände till och gav oss ett ordförråd för att leva med det.",
        },
      ],
      tryIt:
        "Dra reglaget för att ändra ρ. Se hur formen kollapsar, andas och blommar tillbaka som fjäril.",
    },
    sections: [
      {
        pretitle: "Avsnitt ett · Ekvationerna",
        title: "Tre kopplade förändringshastigheter",
        body: "Varje ekvation beskriver hur snabbt en storhet ändras. x är hastigheten i konvektionsrullen — varm luft stiger, kall luft sjunker. y är den horisontella temperaturskillnaden. z är den vertikala avvikelsen från en linjär temperaturprofil. De tre delarna pratar med varandra: x drar y, y drar z, z återkopplar till y. De icke-linjära termerna (xz och xy) är där kaoset bor — utan dem vore systemet en dämpad oscillator.",
      },
      {
        pretitle: "Avsnitt två · Två regimer",
        title: "ρ < 1 är trist, ρ ≈ 28 är fjärilen",
        body: "ρ (Rayleigh-talet) mäter hur hårt du värmer vätskan underifrån. Under ρ = 1 händer inget intressant: varje begynnelsetillstånd avtar mot noll — ingen konvektion, bara ledning. Mellan 1 och cirka 24,74 får du stadig konvektion, banan spiralerar in mot en av två fixpunkter. Korsa ρ ≈ 24,74 och fixpunkterna förlorar stabilitet; vid det kanoniska värdet ρ = 28 kan banan inte längre lägga sig till ro någonstans — den är dömd att vandra fjärilen för evigt.",
      },
      {
        pretitle: "Avsnitt tre · Vingarna",
        title: "Två spöken i fjärilens centrum",
        body: "Varje vinge är byggd kring en instabil jämvikt — en punkt där ekvationerna balanserar, men bräckligt. Banan spiralerar utåt runt en vinge, samlar energi, tills den plötsligt slungas över till den andra vingen och börjar spirala igen. Antalet varv före hoppet är oförutsägbart. Ibland 3, ibland 17, aldrig samma sekvens två gånger — och denna sekvens är, i precis mening, lika slumpmässig som en slantsingling.",
      },
      {
        pretitle: "Avsnitt fyra · Känslig beroende",
        title: "Varför ett virusstort fel blir katastrofalt",
        body: "Två banor separerade med ε växer isär ungefär som ε·eλt, där λ ≈ 0,906 är den ledande Lyapunov-exponenten. Det låter tamt tills du räknar: på cirka 16 simulerade sekunder multipliceras gapet med en miljon. Varje osäkerhet i utgångsläget — mätbrus, datorns avrundning, en fjäril som slår med vingarna i Brasilien — förstärks i denna takt. Väderprognoser sönderfaller eftersom den verkliga atmosfären har sin egen positiva Lyapunov-exponent, och inga bättre sensorer kan springa ifrån en exponential.",
      },
      {
        pretitle: "Avsnitt fem · En sällsam attraktor",
        title: "Dimension 2,06 — mellan yta och solid",
        body: "Varje bana, oavsett startpunkt, sugs upp på samma fjärilsformade objekt. Det objektet är attraktorn. Det är inte en sluten kurva (dimension 1), inte en slät yta (dimension 2), inte en solid klump (dimension 3). Dess Hausdorff-dimension är ungefär 2,06: en yta med fraktal frans, oändligt tunn i en riktning men aldrig riktigt platt. Zooma in på ett område och du finner samma skiktade struktur. Det är vad «sällsam» betyder i «sällsam attraktor».",
      },
      {
        pretitle: "Avsnitt sex · Den kulturella stötvågen",
        title: "Från en tyst artikel 1963 till en vardagsfras",
        body: "Lorenz artikel passerade nästan obemärkt i ett decennium. Sedan satte James Gleicks bok «Chaos» (1987) fjärilen på varje soffbord, och «fjärilseffekt» gick in i språket. Den djupare läxan är hårdare än slagordet: deterministiska ekvationer kan vara helt oförutsägbara, världen är full av sådana system (klimat, ekosystem, ekonomier, hjärtan), och prognos är inte en fråga om att räkna hårdare — den har en grundläggande horisont. Moderna vädertjänster kör dussintals lätt störda prognoser parallellt just därför.",
      },
    ],
    inlineRho: {
      caption: "Live · variera ρ från 0,5 till 35",
      rhoLabel: "ρ",
      hint: "Under 1: banan faller till origo. Kring 13,9: den lägger sig på en av två fixpunkter. Förbi ≈24,7: fjärilen träder fram.",
    },
    twoOrbits: {
      captionA: "Bana A · x₀ = 0,1",
      captionB: "Bana B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Spela",
      pauseLabel: "Paus",
      resetLabel: "Återställ",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "Två banor. Samma ekvationer. Startpositioner som skiljer sig en hundradel av en miljondel.",
    },
    dimensionCaption: "Hausdorff-dimension",
    dimensionNote:
      "Strikt mellan yta (2) och solid (3). Oändligt tunn i en riktning, fraktalt skiktad i en annan.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Ingen konvektion. Varje bana dör i origo.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Kaos. Banan lägger sig aldrig till ro, upprepar sig aldrig.",
    closingPill: "Öppna Explorer",
    closingTitle: "Håll fjärilen i händerna",
    closingBody:
      "Explorern integrerar de tre ekvationerna live, låter dig ändra σ, ρ, β och rotera attraktorn i tre dimensioner. Du kan också skjuta iväg två nära banor samtidigt och se dem driva isär.",
    closingCta: "→ Öppna Explorer",
  },
  no: {
    encounter: {
      pretitle: "Første møte",
      title: "En meteorologs uventede mesterverk",
      cards: [
        {
          label: "01 · Den store idéen",
          title: "Tre linjer som brøt prognosen",
          body: "I 1963 skrev en stillferdig meteorolog ved navn Edward Lorenz ned tre korte ligninger for å modellere et stykke atmosfære. De får plass på et postkort. Oppførselen de gir er så vill at den avsluttet drømmen om perfekte langtidsvarsler og åpnet en helt ny gren av vitenskapen.",
        },
        {
          label: "02 · Et konkret eksempel",
          title: "To nesten identiske verdener driver fra hverandre",
          body: "Start to simuleringer der posisjonene skiller seg med 0,00001 — omtrent bredden på et virus. I 20 simulerte sekunder tegner begge banene den samme sommerfuglvingen. Så, nesten uten forvarsel, hopper den ene over til den andre vingen mens den andre blir igjen. Etter 30 sekunder er de på motsatte vinger, fullstendig ukorrelerte.",
        },
        {
          label: "03 · Hvorfor det betyr noe",
          title: "Sommerfugleffekten, laget av matematikk",
          body: "Dette er opphavet til «sommerfugleffekten» og grunnen til at vær-appen din slutter å være pålitelig etter omtrent to uker. Lorenz oppfant ikke kaoset — han avslørte at det gjemte seg i de reneste ligningene vi kjente, og ga oss et språk for å leve med det.",
        },
      ],
      tryIt:
        "Dra glidebryteren under for å endre ρ. Se formen kollapse, puste og blomstre tilbake som sommerfugl.",
    },
    sections: [
      {
        pretitle: "Del én · Ligningene",
        title: "Tre koblede endringsrater",
        body: "Hver ligning beskriver hvor raskt en størrelse endrer seg. x er hastigheten på konveksjonsrullen — varm luft stiger, kald luft synker. y er den horisontale temperaturforskjellen. z er det vertikale avviket fra en lineær temperaturprofil. De tre delene snakker sammen: x trekker y, y trekker z, z reagerer på y. De ikke-lineære leddene (xz og xy) er der kaoset bor — uten dem ville systemet bare være en dempet oscillator.",
      },
      {
        pretitle: "Del to · To regimer",
        title: "ρ < 1 er kjedelig, ρ ≈ 28 er sommerfuglen",
        body: "ρ (Rayleigh-tallet) måler hvor hardt du varmer væsken nedenfra. Under ρ = 1 skjer ingenting interessant: enhver starttilstand dør ut mot null — ingen konveksjon, bare ledning. Mellom 1 og rundt 24,74 får du jevn konveksjon, banen spiralerer inn mot ett av to faste punkter. Krysser du ρ ≈ 24,74 mister de faste punktene stabilitet; ved kanonisk verdi ρ = 28 kan banen ikke lenger slå seg til ro noe sted — den er dømt til å vandre sommerfuglen for alltid.",
      },
      {
        pretitle: "Del tre · Vingene",
        title: "To gjenferd i sommerfuglens senter",
        body: "Hver vinge er bygd rundt en ustabil likevekt — et punkt der ligningene balanserer, men bare skjørt. Banen spiralerer utover rundt én vinge, samler energi, helt til den plutselig slynges over til den andre vingen og begynner å spiralere igjen. Antall sløyfer før hoppet er uforutsigbart. Noen ganger 3, noen ganger 17, aldri samme sekvens to ganger — og den sekvensen er, i presis forstand, like tilfeldig som myntkast.",
      },
      {
        pretitle: "Del fire · Sensitiv avhengighet",
        title: "Hvorfor en virusstor feil blir katastrofal",
        body: "To baner adskilt av ε vokser fra hverandre omtrent som ε·eλt, der λ ≈ 0,906 er den ledende Lyapunov-eksponenten. Det høres tamt ut til du gjør regnestykket: på rundt 16 simulerte sekunder ganges avstanden med en million. Enhver usikkerhet i utgangstilstanden — målestøy, avrunding i datamaskinen, en sommerfugl som slår med vingene i Brasil — forsterkes i dette tempoet. Værvarsler forfaller fordi den virkelige atmosfæren har sin egen positive Lyapunov-eksponent, og ingen bedre sensorer kan løpe fra en eksponentialfunksjon.",
      },
      {
        pretitle: "Del fem · En selsom attraktor",
        title: "Dimensjon 2,06 — mellom flate og solid",
        body: "Enhver bane, uansett hvor den starter, suges inn på det samme sommerfuglformede objektet. Det objektet er attraktoren. Det er ikke en lukket kurve (dimensjon 1), ikke en glatt flate (dimensjon 2), ikke en solid klump (dimensjon 3). Hausdorff-dimensjonen er omtrent 2,06: en flate med fraktal frynse, uendelig tynn i én retning, men aldri helt flat. Zoom inn på et område og du finner den samme tynne, lagdelte strukturen. Det er hva «selsom» betyr i «selsom attraktor».",
      },
      {
        pretitle: "Del seks · Den kulturelle sjokkbølgen",
        title: "Fra en stille artikkel i 1963 til en hverdagsfrase",
        body: "Lorenz' artikkel gikk nesten ubemerket i et tiår. Så satte James Gleicks bok «Chaos» (1987) sommerfuglen på hvert sofabord, og «sommerfugleffekten» kom inn i språket. Den dypere lærdommen er hardere enn slagordet: deterministiske ligninger kan være fullstendig uforutsigbare, verden er full av slike systemer (klima, økosystemer, økonomier, hjerter), og prognose er ikke et spørsmål om å regne hardere — det har en grunnleggende horisont. Moderne værtjenester kjører dusinvis av lett forstyrrede varsler parallelt nettopp av denne grunnen.",
      },
    ],
    inlineRho: {
      caption: "Live · varier ρ fra 0,5 til 35",
      rhoLabel: "ρ",
      hint: "Under 1: banen faller til origo. Rundt 13,9: den slår seg til ro på ett av to faste punkter. Forbi ≈24,7: sommerfuglen trer fram.",
    },
    twoOrbits: {
      captionA: "Bane A · x₀ = 0,1",
      captionB: "Bane B · x₀ = 0,1 + 10⁻⁵",
      playLabel: "Spill",
      pauseLabel: "Pause",
      resetLabel: "Nullstill",
      timeLabel: "t",
      divergenceLabel: "|Δ|",
      legend:
        "To baner. Samme ligninger. Startposisjoner som skiller seg med en hundredel av en milliondel.",
    },
    dimensionCaption: "Hausdorff-dimensjon",
    dimensionNote:
      "Strengt mellom flate (2) og solid (3). Uendelig tynn i én retning, fraktalt lagdelt i en annen.",
    rhoBoringLabel: "ρ < 1",
    rhoBoringBody: "Ingen konveksjon. Hver bane dør i origo.",
    rhoChaosLabel: "ρ = 28",
    rhoChaosBody: "Kaos. Banen slår seg aldri til ro, gjentar seg aldri.",
    closingPill: "Åpne Explorer",
    closingTitle: "Hold sommerfuglen i hendene",
    closingBody:
      "Explorer integrerer de tre ligningene live, lar deg endre σ, ρ, β og rotere attraktoren i tre dimensjoner. Du kan også skyte ut to nære baner samtidig og se dem drive fra hverandre.",
    closingCta: "→ Åpne Explorer",
  },
};

export default function LorenzStory() {
  const { locale, s } = useI18n();
  const page = s.pages.lorenz;
  const story = RICH_STORY[locale];

  return (
    <StoryPageShell
      page={page}
      ctaHref="/lorenz/explorer"
      accent={ACCENT}
      borderAccent="border-signal-coral/70"
      bgAccent="bg-signal-coral/10"
      hoverAccent="hover:bg-signal-coral/20"
      gradient="from-signal-coral/10"
      formulaBadge="σ = 10, ρ = 28, β = 8/3"
      formulaLatex={
        "\\begin{aligned} \\dot{x} &= \\sigma(y - x) \\\\ \\dot{y} &= x(\\rho - z) - y \\\\ \\dot{z} &= xy - \\beta z \\end{aligned}"
      }
      finalLabel={s.storyLabels.readyToFly}
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
            <Reveal key={i} delay={140 + i * 90}>
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
        <Reveal delay={520}>
          <LorenzInlineRho
            caption={story.inlineRho.caption}
            rhoLabel={story.inlineRho.rhoLabel}
            hint={story.inlineRho.hint}
          />
        </Reveal>
      </section>

      {/* Section 1 — The equations */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[0]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              The system
            </div>
            <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-4 font-mono text-base leading-relaxed text-ink-100">
              {`  dx/dt = σ (y − x)
  dy/dt = x (ρ − z) − y
  dz/dt = x y − β z`}
            </pre>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <Param label="σ (Prandtl)" value="10" />
              <Param label="ρ (Rayleigh)" value="28" />
              <Param label="β (geom.)" value="8 / 3" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 2 — Two regimes */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[1]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.rhoBoringLabel}
              </div>
              <RegimeMini variant="stable" />
              <p className="text-xs leading-relaxed text-ink-300">{story.rhoBoringBody}</p>
            </div>
            <div className="hairline space-y-2 rounded-2xl border bg-ink-950/40 p-6">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
                {story.rhoChaosLabel}
              </div>
              <RegimeMini variant="chaos" />
              <p className="text-xs leading-relaxed text-ink-300">{story.rhoChaosBody}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 3 — Wings */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[2]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline flex flex-col items-center gap-3 rounded-2xl border bg-ink-950/40 p-6">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              C₊ and C₋ · the two unstable fixed points
            </div>
            <WingsSVG />
            <p className="max-w-md text-center text-xs leading-relaxed text-ink-300">
              Each wing forms around one of the equilibria at (±√(β(ρ−1)), ±√(β(ρ−1)), ρ−1). They
              repel — and the repulsion is what keeps the trajectory in motion.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 4 — Sensitive dependence + interactive two orbits */}
      <section className="mx-auto mb-32 max-w-5xl space-y-8">
        <StoryCard {...story.sections[3]} accent={ACCENT} />
        <Reveal delay={120}>
          <LorenzTwoOrbits
            captionA={story.twoOrbits.captionA}
            captionB={story.twoOrbits.captionB}
            playLabel={story.twoOrbits.playLabel}
            pauseLabel={story.twoOrbits.pauseLabel}
            resetLabel={story.twoOrbits.resetLabel}
            timeLabel={story.twoOrbits.timeLabel}
            divergenceLabel={story.twoOrbits.divergenceLabel}
          />
        </Reveal>
        <Reveal delay={220}>
          <p className="mx-auto max-w-2xl text-center text-xs italic leading-relaxed text-ink-400">
            {story.twoOrbits.legend}
          </p>
        </Reveal>
      </section>

      {/* Section 5 — Strange attractor + dimension */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard {...story.sections[4]} accent={ACCENT} />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.dimensionCaption}
            </div>
            <div className="math-italic text-6xl text-ink-100 md:text-7xl">≈ 2.06</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.dimensionNote}
            </p>
            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 pt-4 text-center">
              <DimDot label="curve" value="1" />
              <DimDot label="Lorenz" value="2.06" highlight />
              <DimDot label="solid" value="3" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 6 — Cultural impact */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard {...story.sections[5]} accent={ACCENT} />
      </section>

      {/* Closing CTA — matches apollonian/page.tsx pattern */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPill}
          </div>
          <h2 className="math-italic text-3xl leading-tight md:text-5xl">{story.closingTitle}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{story.closingBody}</p>
          <div className="pt-2">
            <Link
              href="/lorenz/explorer"
              className="inline-block rounded-full border border-signal-coral/70 bg-signal-coral/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-coral transition-colors hover:bg-signal-coral/25"
            >
              {story.closingCta}
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
      <div className="math-italic text-2xl text-signal-coral">{value}</div>
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

// Tiny static SVG showing the two regimes — a decaying spiral (stable) and a
// schematic butterfly (chaos). Pure decoration; the live demo is above.
function RegimeMini({ variant }: { variant: "stable" | "chaos" }) {
  if (variant === "stable") {
    const path: string[] = [];
    for (let i = 0; i < 220; i++) {
      const a = i * 0.25;
      const r = 50 * Math.exp(-i / 60);
      const x = 110 + r * Math.cos(a);
      const y = 70 + r * Math.sin(a);
      path.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return (
      <svg viewBox="0 0 220 140" className="h-auto w-full" role="img" aria-label="Stable spiral">
        <rect width="220" height="140" fill={palette.canvas.bg} rx="6" />
        <path d={path.join(" ")} fill="none" stroke="rgba(125,243,255,0.7)" strokeWidth="1.1" />
        <circle cx="110" cy="70" r="2.4" fill={palette.signal.amber} />
      </svg>
    );
  }
  // chaos: schematic butterfly
  const path: string[] = [];
  for (let i = 0; i < 600; i++) {
    const t = i / 600;
    const a = t * Math.PI * 16;
    const wing = Math.sin(t * Math.PI * 8) > 0 ? -1 : 1;
    const r = 30 + 18 * Math.cos(a * 0.7);
    const x = 110 + wing * 35 + r * 0.35 * Math.cos(a);
    const y = 70 + r * 0.45 * Math.sin(a);
    path.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return (
    <svg
      viewBox="0 0 220 140"
      className="h-auto w-full"
      role="img"
      aria-label="Butterfly schematic"
    >
      <rect width="220" height="140" fill={palette.canvas.bg} rx="6" />
      <path d={path.join(" ")} fill="none" stroke="rgba(255,122,182,0.6)" strokeWidth="0.9" />
    </svg>
  );
}

// Tiny SVG marking the two unstable fixed points around which the wings form.
function WingsSVG() {
  return (
    <svg
      viewBox="0 0 320 180"
      className="h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Two wings around two fixed points"
    >
      <rect width="320" height="180" fill={palette.canvas.bg} rx="8" />
      {/* Left wing — a loose ellipse */}
      <ellipse
        cx="110"
        cy="90"
        rx="60"
        ry="42"
        fill="none"
        stroke="rgba(125,243,255,0.7)"
        strokeWidth="1.1"
      />
      <ellipse
        cx="110"
        cy="90"
        rx="42"
        ry="28"
        fill="none"
        stroke="rgba(125,243,255,0.4)"
        strokeWidth="0.9"
      />
      <ellipse
        cx="110"
        cy="90"
        rx="22"
        ry="14"
        fill="none"
        stroke="rgba(125,243,255,0.25)"
        strokeWidth="0.7"
      />
      <circle cx="110" cy="90" r="2.6" fill={palette.signal.rose} />
      <text
        x="110"
        y="106"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill={palette.signal.rose}
      >
        C₋
      </text>

      {/* Right wing */}
      <ellipse
        cx="210"
        cy="90"
        rx="60"
        ry="42"
        fill="none"
        stroke="rgba(179,136,255,0.7)"
        strokeWidth="1.1"
      />
      <ellipse
        cx="210"
        cy="90"
        rx="42"
        ry="28"
        fill="none"
        stroke="rgba(179,136,255,0.4)"
        strokeWidth="0.9"
      />
      <ellipse
        cx="210"
        cy="90"
        rx="22"
        ry="14"
        fill="none"
        stroke="rgba(179,136,255,0.25)"
        strokeWidth="0.7"
      />
      <circle cx="210" cy="90" r="2.6" fill={palette.signal.rose} />
      <text
        x="210"
        y="106"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill={palette.signal.rose}
      >
        C₊
      </text>

      {/* Connection sketch */}
      <path
        d="M 158 76 Q 160 60 162 76"
        fill="none"
        stroke="rgba(255,209,102,0.6)"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <text
        x="160"
        y="50"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        fill={palette.signal.amber}
      >
        jump
      </text>
    </svg>
  );
}
