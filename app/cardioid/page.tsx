"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { CardioidLightDemo } from "@/components/CardioidLightDemo";
import { CardioidMandelbrotBridge } from "@/components/CardioidMandelbrotBridge";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-amber";

// --------------------------------------------------------------------------
// Per-locale page copy authored here so the page can tell a longer, warmer
// story without bloating the shared i18n bundles. The hero (pretitle, title,
// tagline, intro) still comes from RICH_STORY[locale].page so it can stay in
// sync with the rest of the story copy.
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
  lightCaption: string;
  lightRayCountLabel: string;
  lightEnvelopeLabel: string;
  lightHint: string;
  lightPretitle: string;
  lightTitle: string;
  lightBody: string;
  bridgeCaption: string;
  bridgeParamLabel: string;
  bridgeHint: string;
  bridgePretitle: string;
  bridgeTitle: string;
  bridgeBody: string;
};

const en: RichStory = {
  page: {
    pretitle: "Topic · Geometry",
    title: "The Coffee-Cup Cardioid",
    tagline: "The light curve in your cup is Mandelbrot's heart.",
    intro:
      "Shine a small light onto the inside of a cylindrical coffee cup. The reflections do not focus at a point — they envelope a heart-shaped curve floating on the surface. That curve is the cardioid r = 2a(1 − cos θ). The very same equation parameterises the main bulb of the Mandelbrot set. Every morning, the most famous shape in dynamics is being drawn in light.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "A heart drawn by light.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "When light bounces off a curved surface, the reflected rays don't converge to a point — they crowd along a curve called the catacaustic. For a circle lit by a point on its rim, that curve is a perfect cardioid: a single heart, with one cusp, traced by light itself.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Set a coffee cup on a sunny table. The bright curve drifting on the dark surface is your cardioid — same equation r = 2a(1 − cos θ) that mathematicians have studied for four centuries. Move the light, the heart shifts. Tilt the cup, the heart tilts with it.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Now zoom into the Mandelbrot set. The big heart at its centre — the main bulb — is exactly the same cardioid, parameterised by c(t) = ½e^(it) − ¼e^(2it). A curve from kitchen optics is also the spine of the most studied object in complex dynamics. There is no obvious reason why.",
      },
    ],
    tryIt:
      "Below: watch the cardioid emerge from reflected light, then meet it again inside Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Section 01 · The catacaustic",
      title: "Light, a circle, and the curve that catches it",
      body: "Place a point light source on the rim of a circular mirror. Every ray from the source bounces off the inside wall and crosses every other reflected ray; the family of reflected rays envelopes a smooth curve — the catacaustic of the circle. That envelope is a cardioid, with its cusp at the source. It is not an approximation; it is exact.",
    },
    {
      pretitle: "Section 02 · The equation",
      title: "r = 2a (1 − cos θ)",
      body: "In polar coordinates centred at the cusp, the cardioid is r(θ) = 2a(1 − cos θ). At θ = 0 the radius is 0 — the cusp itself. At θ = π the radius is 4a — the far tip. The number a is the radius of a parent circle; the cardioid is twice as wide and exactly four times as long.",
    },
    {
      pretitle: "Section 03 · The rolling-circle definition",
      title: "A point on a wheel rolling around its twin",
      body: "Take two circles of equal radius a. Hold one fixed, let the other roll around it without slipping, and mark a single point on the rim of the rolling one. The curve traced by that point is the cardioid — kardía in Greek, «heart». The same shape from the same equation, but built from rolling instead of reflecting.",
    },
    {
      pretitle: "Section 04 · Mandelbrot's main bulb",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoom into z ↦ z² + c. The big heart-shaped component at the centre — Mandelbrot's main bulb — has boundary c(t) = ½e^(it) − ¼e^(2it), and this is algebraically a cardioid. The c-values inside it are precisely those for which the iteration converges to a single attracting fixed point. Douady and Hubbard pinned this down in the 1980s as part of their proof that the set is connected.",
    },
    {
      pretitle: "Section 05 · Other catacaustics",
      title: "A small zoo of envelopes",
      body: "Change the light and you change the curve. Parallel rays into a half-cup give the nephroid (two cusps, not one). A cardioid rolling around a circle traces the astroid. Each envelope is the fingerprint of its source — and once you know to look, you start spotting them in shop windows, polished pans, and rainbows.",
    },
    {
      pretitle: "Section 06 · History",
      title: "Étienne Pascal, 1637 — and a baptism in 1741",
      body: "The curve was first studied by Étienne Pascal — Blaise's father — around 1637, who called it «la limaçon». A century later, in 1741, Johann Castillon gave it the name we still use: cardioid, the heart-shaped curve. Newton, the Bernoullis, and Cayley all worked on its properties; today it survives as both a textbook example and the iconic silhouette of the Mandelbrot bulb.",
    },
  ],
  closingPretitle: "Take it further",
  closingTitle: "Shine a light. See the heart.",
  closingBody:
    "The Explorer lets you switch between the coffee-cup optics, the rolling-circle trace, and the Mandelbrot overlay. Same curve, three different stories — all one click away.",
  ctaLabel: "→ Open the Explorer",
  lightCaption: "Interactive · catacaustic of a circle",
  lightRayCountLabel: "Rays",
  lightEnvelopeLabel: "Show envelope",
  lightHint:
    "Add rays and the envelope crystallises. Cusp at the source on the rim, far tip at distance 2R on the opposite wall.",
  lightPretitle: "Interactive · the heart in the cup",
  lightTitle: "Add light, watch the heart appear",
  lightBody:
    "Each ray leaves the source on the rim, reflects off the wall, and crosses every other reflected ray. The cardioid is the curve where the chords pile up.",
  bridgeCaption: "Interactive · the same cardioid in Mandelbrot",
  bridgeParamLabel: "Parameter t",
  bridgeHint:
    "Slide t around the boundary. Inside the cardioid: dynamics with one attracting fixed point. Outside: period-doubled, chaotic, or escaping.",
  bridgePretitle: "Interactive · from cup to Mandelbrot",
  bridgeTitle: "Trace the boundary of the main bulb",
  bridgeBody:
    "The Douady–Hubbard parameterisation c(t) = ½e^(it) − ¼e^(2it) walks once around the cardioid as t goes from 0 to 2π. The same equation lives inside both pictures.",
};

const de: RichStory = {
  page: {
    pretitle: "Thema · Geometrie",
    title: "Die Kaffeetassen-Kardioide",
    tagline: "Die Lichtkurve in deiner Tasse ist Mandelbrots Herz.",
    intro:
      "Leuchte mit einer kleinen Lichtquelle in die Innenwand einer zylindrischen Kaffeetasse. Die Reflexionen bündeln sich nicht in einem Punkt — sie umhüllen eine herzförmige Kurve auf der Oberfläche. Diese Kurve ist die Kardioide r = 2a(1 − cos θ). Dieselbe Gleichung parametrisiert die Hauptknospe der Mandelbrot-Menge. Jeden Morgen wird die berühmteste Form der Dynamik in Licht gezeichnet.",
    ctaInteractive: "→ Explorer öffnen",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Ein Herz, vom Licht gezeichnet.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Trifft Licht auf eine gekrümmte Fläche, sammeln sich die reflektierten Strahlen nicht in einem Punkt — sie verdichten sich entlang einer Kurve, der Katakaustik. Bei einem Kreis mit Lichtquelle am Rand ist diese Kurve eine perfekte Kardioide: ein einzelnes Herz mit einer Spitze, vom Licht selbst gezeichnet.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Stell eine Kaffeetasse in die Sonne. Die helle Kurve auf der dunklen Oberfläche ist deine Kardioide — dieselbe Gleichung r = 2a(1 − cos θ), die Mathematiker:innen seit vier Jahrhunderten untersuchen. Bewege das Licht, das Herz wandert mit. Kippe die Tasse, es kippt mit.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "Jetzt zoom in die Mandelbrot-Menge. Das große Herz in der Mitte — die Hauptknospe — ist genau dieselbe Kardioide, parametrisiert durch c(t) = ½e^(it) − ¼e^(2it). Eine Kurve aus der Küchen-Optik ist zugleich das Rückgrat des am meisten untersuchten Objekts der komplexen Dynamik. Einen offensichtlichen Grund gibt es nicht.",
      },
    ],
    tryIt:
      "Unten: sieh die Kardioide aus dem Licht hervortreten und finde sie in Mandelbrot wieder.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Katakaustik",
      title: "Licht, ein Kreis und die Kurve, die es einfängt",
      body: "Setz eine punktförmige Lichtquelle auf den Rand eines kreisförmigen Spiegels. Jeder Strahl reflektiert an der Innenwand, und alle reflektierten Strahlen kreuzen einander; die Familie umhüllt eine glatte Kurve — die Katakaustik des Kreises. Diese Hüllkurve ist eine Kardioide, mit ihrer Spitze an der Lichtquelle. Keine Näherung, sondern exakt.",
    },
    {
      pretitle: "Abschnitt 02 · Die Gleichung",
      title: "r = 2a (1 − cos θ)",
      body: "In Polarkoordinaten mit Ursprung in der Spitze lautet die Kardioide r(θ) = 2a(1 − cos θ). Bei θ = 0 ist r = 0 — die Spitze. Bei θ = π ist r = 4a — die ferne Spitze. Die Größe a ist der Radius eines Mutterkreises; die Kardioide ist doppelt so breit und genau viermal so lang.",
    },
    {
      pretitle: "Abschnitt 03 · Die rollende Definition",
      title: "Ein Punkt auf einem Rad, das um sein Zwillingsrad rollt",
      body: "Nimm zwei gleich große Kreise mit Radius a. Halt den einen fest, lass den anderen schlupffrei um ihn rollen, und markiere einen Punkt am Rand des rollenden Kreises. Die Bahn dieses Punktes ist die Kardioide — kardía heißt im Griechischen «Herz». Dieselbe Form, dieselbe Gleichung, aber aus Rollen statt Spiegeln gebaut.",
    },
    {
      pretitle: "Abschnitt 04 · Mandelbrots Hauptknospe",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoom in z ↦ z² + c. Die große herzförmige Komponente in der Mitte — Mandelbrots Hauptknospe — hat als Rand c(t) = ½e^(it) − ¼e^(2it), und das ist algebraisch eine Kardioide. Die c-Werte darin sind genau jene, für die die Iteration gegen einen einzigen anziehenden Fixpunkt konvergiert. Douady und Hubbard schnürten das in den 1980ern als Teil ihres Beweises der Zusammenhängenz zu.",
    },
    {
      pretitle: "Abschnitt 05 · Andere Katakaustiken",
      title: "Ein kleines Zoo von Hüllkurven",
      body: "Ändere das Licht, und du änderst die Kurve. Parallele Strahlen in eine halbe Tasse ergeben die Nephroide (zwei Spitzen statt einer). Eine Kardioide, die um einen Kreis rollt, zeichnet die Astroide. Jede Hüllkurve ist der Fingerabdruck ihrer Quelle — und wer einmal hinsieht, findet sie in Schaufenstern, polierten Pfannen, Regenbögen.",
    },
    {
      pretitle: "Abschnitt 06 · Geschichte",
      title: "Étienne Pascal, 1637 — und eine Taufe 1741",
      body: "Étienne Pascal — Blaises Vater — studierte die Kurve um 1637 und nannte sie «la limaçon». Ein Jahrhundert später, 1741, gab Johann Castillon ihr den Namen, den wir noch heute verwenden: Kardioide, die herzförmige Kurve. Newton, die Bernoullis und Cayley arbeiteten an ihren Eigenschaften; heute lebt sie als Lehrbuchbeispiel und als Silhouette der Mandelbrot-Knospe weiter.",
    },
  ],
  closingPretitle: "Geh weiter",
  closingTitle: "Mach Licht. Sieh das Herz.",
  closingBody:
    "Der Explorer lässt dich zwischen Kaffeetassen-Optik, rollendem Kreis und Mandelbrot-Überlagerung wechseln. Dieselbe Kurve, drei Geschichten — alle einen Klick entfernt.",
  ctaLabel: "→ Explorer öffnen",
  lightCaption: "Interaktiv · Katakaustik eines Kreises",
  lightRayCountLabel: "Strahlen",
  lightEnvelopeLabel: "Hüllkurve zeigen",
  lightHint:
    "Mehr Strahlen, klarere Hülle. Spitze bei der Lichtquelle am Rand, ferner Punkt in Abstand 2R auf der gegenüberliegenden Wand.",
  lightPretitle: "Interaktiv · das Herz in der Tasse",
  lightTitle: "Mach Licht, sieh das Herz erscheinen",
  lightBody:
    "Jeder Strahl verlässt die Quelle am Rand, reflektiert an der Wand und kreuzt alle anderen Reflexionen. Die Kardioide ist die Kurve, an der sich die Sehnen verdichten.",
  bridgeCaption: "Interaktiv · dieselbe Kardioide in Mandelbrot",
  bridgeParamLabel: "Parameter t",
  bridgeHint:
    "Schieb t entlang des Randes. Innen: Dynamik mit einem anziehenden Fixpunkt. Außen: periodenverdoppelt, chaotisch oder entkommend.",
  bridgePretitle: "Interaktiv · von der Tasse zu Mandelbrot",
  bridgeTitle: "Verfolg den Rand der Hauptknospe",
  bridgeBody:
    "Die Douady–Hubbard-Parametrisierung c(t) = ½e^(it) − ¼e^(2it) läuft einmal um die Kardioide, während t von 0 nach 2π wandert. Dieselbe Gleichung lebt in beiden Bildern.",
};

const es: RichStory = {
  page: {
    pretitle: "Tema · Geometría",
    title: "La cardioide del café",
    tagline: "La curva de luz en tu taza es el corazón de Mandelbrot.",
    intro:
      "Apunta una pequeña luz hacia la pared interior de una taza cilíndrica. Los reflejos no se enfocan en un punto — envuelven una curva en forma de corazón sobre la superficie. Esa curva es la cardioide r = 2a(1 − cos θ). La misma ecuación parametriza el bulbo principal del conjunto de Mandelbrot. Cada mañana, la forma más famosa de la dinámica se dibuja en luz.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Un corazón dibujado con luz.",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Cuando la luz rebota en una superficie curva, los rayos no convergen en un punto — se apiñan a lo largo de una curva llamada catacáustica. Para un círculo iluminado desde un punto en su borde, esa curva es una cardioide perfecta: un corazón con una sola cúspide, trazado por la propia luz.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Pon una taza de café al sol. La curva brillante que flota en la superficie oscura es tu cardioide — la misma ecuación r = 2a(1 − cos θ) que los matemáticos estudian desde hace cuatro siglos. Mueve la luz y el corazón se desplaza. Inclina la taza y el corazón se inclina con ella.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Ahora hace zoom en el conjunto de Mandelbrot. El gran corazón en su centro — el bulbo principal — es exactamente la misma cardioide, parametrizada por c(t) = ½e^(it) − ¼e^(2it). Una curva de óptica casera es también la columna vertebral del objeto más estudiado de la dinámica compleja. Sin razón obvia.",
      },
    ],
    tryIt:
      "Abajo: mira la cardioide emerger de la luz reflejada y reencuéntrala dentro de Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La catacáustica",
      title: "Luz, un círculo y la curva que la atrapa",
      body: "Coloca una fuente puntual de luz en el borde de un espejo circular. Cada rayo rebota en la pared interior, y los rayos reflejados se cruzan unos con otros; la familia envuelve una curva suave — la catacáustica del círculo. Esa envolvente es una cardioide, con su cúspide en la fuente. No es una aproximación, es exacto.",
    },
    {
      pretitle: "Sección 02 · La ecuación",
      title: "r = 2a (1 − cos θ)",
      body: "En coordenadas polares centradas en la cúspide, la cardioide es r(θ) = 2a(1 − cos θ). En θ = 0 el radio es 0 — la cúspide. En θ = π el radio es 4a — el extremo lejano. El número a es el radio de un círculo madre; la cardioide es el doble de ancha y exactamente cuatro veces de larga.",
    },
    {
      pretitle: "Sección 03 · La definición rodante",
      title: "Un punto en una rueda que gira alrededor de su gemela",
      body: "Toma dos círculos del mismo radio a. Sujeta uno fijo, deja que el otro ruede a su alrededor sin deslizar y marca un punto en el borde del que rueda. La curva trazada es la cardioide — kardía es «corazón» en griego. La misma forma, la misma ecuación, pero construida desde la rodadura, no desde el espejo.",
    },
    {
      pretitle: "Sección 04 · El bulbo principal de Mandelbrot",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoom a z ↦ z² + c. La gran componente en forma de corazón del centro — el bulbo principal de Mandelbrot — tiene frontera c(t) = ½e^(it) − ¼e^(2it), y es algebraicamente una cardioide. Los c interiores son precisamente aquellos para los que la iteración converge a un único punto fijo atractor. Douady y Hubbard lo fijaron en los años 80 como parte de su prueba de la conexidad del conjunto.",
    },
    {
      pretitle: "Sección 05 · Otras catacáusticas",
      title: "Un pequeño zoo de envolventes",
      body: "Cambia la luz y cambias la curva. Rayos paralelos en media taza dan la nefroide (dos cúspides en vez de una). Una cardioide rodando alrededor de un círculo traza la astroide. Cada envolvente es la huella de su fuente — y, una vez sabes mirar, las ves en escaparates, sartenes pulidas y arcoíris.",
    },
    {
      pretitle: "Sección 06 · Historia",
      title: "Étienne Pascal, 1637 — y un bautizo en 1741",
      body: "Étienne Pascal — padre de Blaise — estudió la curva hacia 1637 y la llamó «la limaçon». Un siglo después, en 1741, Johann Castillon le dio el nombre que aún usamos: cardioide, la curva con forma de corazón. Newton, los Bernoulli y Cayley trabajaron sus propiedades; hoy sobrevive como ejemplo de libro de texto y como silueta icónica del bulbo de Mandelbrot.",
    },
  ],
  closingPretitle: "Ve más lejos",
  closingTitle: "Enciende una luz. Mira el corazón.",
  closingBody:
    "El Explorador te deja alternar entre la óptica de la taza, la traza del círculo rodante y la superposición sobre Mandelbrot. La misma curva, tres historias — todas a un clic.",
  ctaLabel: "→ Abrir el Explorador",
  lightCaption: "Interactivo · catacáustica de un círculo",
  lightRayCountLabel: "Rayos",
  lightEnvelopeLabel: "Mostrar envolvente",
  lightHint:
    "Añade rayos y la envolvente se cristaliza. Cúspide en la fuente sobre el borde, extremo lejano a distancia 2R en la pared opuesta.",
  lightPretitle: "Interactivo · el corazón en la taza",
  lightTitle: "Pon luz, mira aparecer el corazón",
  lightBody:
    "Cada rayo sale de la fuente en el borde, rebota en la pared y cruza todos los demás. La cardioide es la curva donde las cuerdas se apiñan.",
  bridgeCaption: "Interactivo · la misma cardioide en Mandelbrot",
  bridgeParamLabel: "Parámetro t",
  bridgeHint:
    "Desliza t alrededor de la frontera. Dentro: dinámica con un único punto fijo atractor. Fuera: período duplicado, caótico o escapando.",
  bridgePretitle: "Interactivo · de la taza a Mandelbrot",
  bridgeTitle: "Recorre la frontera del bulbo principal",
  bridgeBody:
    "La parametrización de Douady–Hubbard c(t) = ½e^(it) − ¼e^(2it) recorre la cardioide una vez mientras t va de 0 a 2π. La misma ecuación vive en las dos imágenes.",
};

const fr: RichStory = {
  page: {
    pretitle: "Sujet · Géométrie",
    title: "La cardioïde du café",
    tagline: "La courbe de lumière dans ta tasse est le cœur de Mandelbrot.",
    intro:
      "Pointe une petite lumière vers la paroi intérieure d'une tasse cylindrique. Les reflets ne convergent pas en un point — ils enveloppent une courbe en forme de cœur sur la surface. Cette courbe est la cardioïde r = 2a(1 − cos θ). La même équation paramètre le bulbe principal de l'ensemble de Mandelbrot. Chaque matin, la forme la plus célèbre de la dynamique se dessine en lumière.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Un cœur tracé par la lumière.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Quand la lumière rebondit sur une surface courbe, les rayons réfléchis ne convergent pas en un point — ils se massent le long d'une courbe, la catacaustique. Pour un cercle éclairé depuis un point de son bord, cette courbe est une cardioïde parfaite : un cœur avec un seul rebroussement, tracé par la lumière elle-même.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Pose une tasse de café au soleil. La courbe lumineuse qui flotte sur la surface sombre est ta cardioïde — la même équation r = 2a(1 − cos θ) que les mathématiciens étudient depuis quatre siècles. Bouge la lumière, le cœur se déplace. Incline la tasse, le cœur s'incline avec.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "Zoome maintenant dans l'ensemble de Mandelbrot. Le grand cœur en son centre — le bulbe principal — est exactement la même cardioïde, paramétrée par c(t) = ½e^(it) − ¼e^(2it). Une courbe d'optique de cuisine est aussi l'épine dorsale de l'objet le plus étudié de la dynamique complexe. Sans raison évidente.",
      },
    ],
    tryIt:
      "Ci-dessous : vois la cardioïde émerger de la lumière, puis retrouve-la dans Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Section 01 · La catacaustique",
      title: "Lumière, un cercle et la courbe qui l'attrape",
      body: "Place une source ponctuelle sur le bord d'un miroir circulaire. Chaque rayon rebondit sur la paroi intérieure, et les rayons réfléchis se croisent les uns les autres ; la famille enveloppe une courbe lisse — la catacaustique du cercle. Cette enveloppe est une cardioïde, son rebroussement à la source. Aucune approximation : c'est exact.",
    },
    {
      pretitle: "Section 02 · L'équation",
      title: "r = 2a (1 − cos θ)",
      body: "En coordonnées polaires centrées au rebroussement, la cardioïde est r(θ) = 2a(1 − cos θ). En θ = 0 le rayon est 0 — le rebroussement. En θ = π il vaut 4a — la pointe opposée. Le nombre a est le rayon d'un cercle parent ; la cardioïde est deux fois plus large et exactement quatre fois plus longue.",
    },
    {
      pretitle: "Section 03 · La définition par roulement",
      title: "Un point d'une roue qui tourne autour de sa jumelle",
      body: "Prends deux cercles de même rayon a. Fixe l'un, fais rouler l'autre sans glisser autour, marque un point sur le bord de celui qui roule. La courbe tracée est la cardioïde — kardía signifie «cœur» en grec. Même forme, même équation, mais bâtie depuis le roulement plutôt que la réflexion.",
    },
    {
      pretitle: "Section 04 · Le bulbe principal de Mandelbrot",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoome sur z ↦ z² + c. La grande composante en cœur au centre — le bulbe principal de Mandelbrot — a pour bord c(t) = ½e^(it) − ¼e^(2it), et c'est algébriquement une cardioïde. Les c intérieurs sont précisément ceux pour lesquels l'itération converge vers un unique point fixe attracteur. Douady et Hubbard ont fixé tout cela dans les années 1980, en chemin vers leur preuve de la connexité de l'ensemble.",
    },
    {
      pretitle: "Section 05 · Autres catacaustiques",
      title: "Un petit zoo d'enveloppes",
      body: "Change la lumière, tu changes la courbe. Des rayons parallèles dans une demi-tasse donnent la néphroïde (deux rebroussements au lieu d'un). Une cardioïde qui roule autour d'un cercle trace l'astroïde. Chaque enveloppe est l'empreinte de sa source — et dès qu'on sait regarder, on les voit dans les vitrines, les poêles polies, les arcs-en-ciel.",
    },
    {
      pretitle: "Section 06 · Histoire",
      title: "Étienne Pascal, 1637 — et un baptême en 1741",
      body: "Étienne Pascal — le père de Blaise — étudia la courbe vers 1637 et l'appela «la limaçon». Un siècle plus tard, en 1741, Johann Castillon lui donna le nom qu'on utilise encore : cardioïde, la courbe en cœur. Newton, les Bernoulli et Cayley en ont travaillé les propriétés ; aujourd'hui elle survit comme exemple de manuel et comme silhouette iconique du bulbe de Mandelbrot.",
    },
  ],
  closingPretitle: "Aller plus loin",
  closingTitle: "Allume une lumière. Vois le cœur.",
  closingBody:
    "L'Explorateur te laisse alterner entre l'optique de la tasse, le tracé du cercle qui roule et la superposition sur Mandelbrot. Même courbe, trois histoires — toutes à un clic.",
  ctaLabel: "→ Ouvrir l'Explorateur",
  lightCaption: "Interactif · catacaustique d'un cercle",
  lightRayCountLabel: "Rayons",
  lightEnvelopeLabel: "Afficher l'enveloppe",
  lightHint:
    "Ajoute des rayons et l'enveloppe se cristallise. Rebroussement à la source sur le bord, pointe lointaine à distance 2R sur la paroi opposée.",
  lightPretitle: "Interactif · le cœur dans la tasse",
  lightTitle: "Mets de la lumière, regarde apparaître le cœur",
  lightBody:
    "Chaque rayon part de la source sur le bord, rebondit sur la paroi et croise toutes les autres réflexions. La cardioïde est la courbe où les cordes s'accumulent.",
  bridgeCaption: "Interactif · la même cardioïde dans Mandelbrot",
  bridgeParamLabel: "Paramètre t",
  bridgeHint:
    "Glisse t le long du bord. À l'intérieur : dynamique avec un unique point fixe attracteur. À l'extérieur : doublement de période, chaos ou évasion.",
  bridgePretitle: "Interactif · de la tasse à Mandelbrot",
  bridgeTitle: "Suis le bord du bulbe principal",
  bridgeBody:
    "La paramétrisation de Douady–Hubbard c(t) = ½e^(it) − ¼e^(2it) parcourt la cardioïde une fois pendant que t va de 0 à 2π. La même équation vit dans les deux images.",
};

const it: RichStory = {
  page: {
    pretitle: "Argomento · Geometria",
    title: "La cardioide del caffè",
    tagline: "La curva di luce nella tua tazza è il cuore di Mandelbrot.",
    intro:
      "Punta una piccola luce contro la parete interna di una tazza cilindrica. I riflessi non si concentrano in un punto — avvolgono una curva a forma di cuore sulla superficie. Quella curva è la cardioide r = 2a(1 − cos θ). La stessa equazione parametrizza il bulbo principale dell'insieme di Mandelbrot. Ogni mattina la forma più famosa della dinamica viene disegnata in luce.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Un cuore disegnato dalla luce.",
    cards: [
      {
        label: "01",
        title: "L'idea centrale",
        body: "Quando la luce rimbalza su una superficie curva, i raggi non convergono in un punto — si addensano lungo una curva, la catacaustica. Per un cerchio illuminato da un punto sul bordo, quella curva è una cardioide perfetta: un cuore con una sola cuspide, tracciato dalla luce stessa.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Metti una tazza di caffè al sole. La curva luminosa sulla superficie scura è la tua cardioide — la stessa equazione r = 2a(1 − cos θ) che i matematici studiano da quattro secoli. Sposta la luce, il cuore si sposta. Inclina la tazza, si inclina con lei.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Ora zoom sull'insieme di Mandelbrot. Il grande cuore al centro — il bulbo principale — è esattamente la stessa cardioide, parametrizzata da c(t) = ½e^(it) − ¼e^(2it). Una curva di ottica casalinga è anche la spina dorsale dell'oggetto più studiato della dinamica complessa. Senza un motivo ovvio.",
      },
    ],
    tryIt: "Sotto: guarda la cardioide emergere dalla luce e ritrovala dentro Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La catacaustica",
      title: "Luce, un cerchio e la curva che la cattura",
      body: "Metti una sorgente puntiforme sul bordo di uno specchio circolare. Ogni raggio rimbalza sulla parete interna, e i raggi riflessi si incrociano tra loro; la famiglia avvolge una curva liscia — la catacaustica del cerchio. Quella inviluppo è una cardioide, con la cuspide sulla sorgente. Non un'approssimazione: è esatta.",
    },
    {
      pretitle: "Sezione 02 · L'equazione",
      title: "r = 2a (1 − cos θ)",
      body: "In coordinate polari centrate nella cuspide, la cardioide è r(θ) = 2a(1 − cos θ). A θ = 0 il raggio è 0 — la cuspide. A θ = π vale 4a — la punta lontana. Il numero a è il raggio del cerchio madre; la cardioide è larga il doppio e lunga esattamente quattro volte.",
    },
    {
      pretitle: "Sezione 03 · La definizione per rotolamento",
      title: "Un punto su una ruota che gira attorno alla sua gemella",
      body: "Prendi due cerchi dello stesso raggio a. Tieni fermo uno e fai rotolare l'altro attorno senza slittare, marcando un punto sul bordo di quello che rotola. La curva tracciata è la cardioide — kardía in greco è «cuore». Stessa forma, stessa equazione, ma costruita dal rotolamento invece che dalla riflessione.",
    },
    {
      pretitle: "Sezione 04 · Il bulbo principale di Mandelbrot",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoom su z ↦ z² + c. La grande componente a cuore al centro — il bulbo principale di Mandelbrot — ha bordo c(t) = ½e^(it) − ¼e^(2it), e algebricamente è una cardioide. I c interni sono esattamente quelli per cui l'iterazione converge a un unico punto fisso attrattivo. Douady e Hubbard lo fissarono negli anni '80 come parte della loro dimostrazione della connessione dell'insieme.",
    },
    {
      pretitle: "Sezione 05 · Altre catacaustiche",
      title: "Un piccolo zoo di inviluppi",
      body: "Cambia la luce, cambi la curva. Raggi paralleli in mezza tazza danno la nefroide (due cuspidi invece di una). Una cardioide che rotola attorno a un cerchio traccia l'astroide. Ogni inviluppo è l'impronta della sua sorgente — e quando impari a guardare, li vedi nelle vetrine, nelle pentole lucide, negli arcobaleni.",
    },
    {
      pretitle: "Sezione 06 · Storia",
      title: "Étienne Pascal, 1637 — e un battesimo nel 1741",
      body: "Étienne Pascal — padre di Blaise — studiò la curva intorno al 1637 e la chiamò «la limaçon». Un secolo dopo, nel 1741, Johann Castillon le diede il nome che ancora usiamo: cardioide, la curva a forma di cuore. Newton, i Bernoulli e Cayley ne lavorarono le proprietà; oggi sopravvive come esempio da manuale e come silhouette iconica del bulbo di Mandelbrot.",
    },
  ],
  closingPretitle: "Vai oltre",
  closingTitle: "Accendi una luce. Vedi il cuore.",
  closingBody:
    "L'Esploratore ti lascia passare tra l'ottica della tazza, la traccia del cerchio che rotola e la sovrapposizione su Mandelbrot. Stessa curva, tre storie — tutte a un clic.",
  ctaLabel: "→ Apri l'Esploratore",
  lightCaption: "Interattivo · catacaustica di un cerchio",
  lightRayCountLabel: "Raggi",
  lightEnvelopeLabel: "Mostra inviluppo",
  lightHint:
    "Aggiungi raggi e l'inviluppo si cristallizza. Cuspide sulla sorgente al bordo, punta lontana a distanza 2R sulla parete opposta.",
  lightPretitle: "Interattivo · il cuore nella tazza",
  lightTitle: "Metti luce, guarda il cuore apparire",
  lightBody:
    "Ogni raggio parte dalla sorgente sul bordo, rimbalza sulla parete e incrocia tutti gli altri. La cardioide è la curva su cui le corde si addensano.",
  bridgeCaption: "Interattivo · la stessa cardioide in Mandelbrot",
  bridgeParamLabel: "Parametro t",
  bridgeHint:
    "Trascina t lungo il bordo. Dentro: dinamica con un unico punto fisso attrattivo. Fuori: raddoppio di periodo, caos o fuga.",
  bridgePretitle: "Interattivo · dalla tazza a Mandelbrot",
  bridgeTitle: "Percorri il bordo del bulbo principale",
  bridgeBody:
    "La parametrizzazione di Douady–Hubbard c(t) = ½e^(it) − ¼e^(2it) percorre la cardioide una volta mentre t va da 0 a 2π. La stessa equazione vive in entrambe le immagini.",
};

const pt: RichStory = {
  page: {
    pretitle: "Tema · Geometria",
    title: "A cardioide do café",
    tagline: "A curva de luz na tua chávena é o coração de Mandelbrot.",
    intro:
      "Aponta uma pequena luz para a parede interior de uma chávena cilíndrica. Os reflexos não focam num ponto — envolvem uma curva em forma de coração na superfície. Essa curva é a cardioide r = 2a(1 − cos θ). A mesma equação parametriza o bulbo principal do conjunto de Mandelbrot. Todas as manhãs, a forma mais famosa da dinâmica é desenhada em luz.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Um coração desenhado pela luz.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Quando a luz salta de uma superfície curva, os raios refletidos não convergem num ponto — agrupam-se ao longo de uma curva, a catacáustica. Para um círculo iluminado por um ponto na sua borda, essa curva é uma cardioide perfeita: um coração com uma única cúspide, traçado pela própria luz.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Põe uma chávena de café ao sol. A curva luminosa que flutua na superfície escura é a tua cardioide — a mesma equação r = 2a(1 − cos θ) que os matemáticos estudam há quatro séculos. Move a luz e o coração desloca-se. Inclina a chávena e o coração inclina-se com ela.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Agora dá zoom no conjunto de Mandelbrot. O grande coração no seu centro — o bulbo principal — é exatamente a mesma cardioide, parametrizada por c(t) = ½e^(it) − ¼e^(2it). Uma curva de ótica caseira é também a espinha dorsal do objeto mais estudado da dinâmica complexa. Sem motivo óbvio.",
      },
    ],
    tryIt: "Abaixo: vê a cardioide emergir da luz refletida, e reencontra-a dentro de Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A catacáustica",
      title: "Luz, um círculo e a curva que a apanha",
      body: "Põe uma fonte pontual na borda de um espelho circular. Cada raio salta da parede interior e os raios refletidos cruzam-se uns com os outros; a família envolve uma curva suave — a catacáustica do círculo. Essa envolvente é uma cardioide, com a cúspide na fonte. Nada de aproximações: é exata.",
    },
    {
      pretitle: "Secção 02 · A equação",
      title: "r = 2a (1 − cos θ)",
      body: "Em coordenadas polares centradas na cúspide, a cardioide é r(θ) = 2a(1 − cos θ). Em θ = 0 o raio é 0 — a cúspide. Em θ = π vale 4a — a ponta oposta. O número a é o raio de um círculo-mãe; a cardioide tem o dobro da largura e exatamente o quádruplo do comprimento.",
    },
    {
      pretitle: "Secção 03 · A definição por rolamento",
      title: "Um ponto numa roda que gira em torno da sua gémea",
      body: "Toma dois círculos de igual raio a. Segura um, deixa o outro rolar à volta sem deslizar e marca um ponto na borda do que rola. A curva traçada é a cardioide — kardía em grego é «coração». A mesma forma, a mesma equação, mas construída a partir do rolamento e não do reflexo.",
    },
    {
      pretitle: "Secção 04 · O bulbo principal de Mandelbrot",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoom em z ↦ z² + c. A grande componente em coração no centro — o bulbo principal de Mandelbrot — tem fronteira c(t) = ½e^(it) − ¼e^(2it), e é algebricamente uma cardioide. Os c no interior são exatamente aqueles para os quais a iteração converge para um único ponto fixo atrator. Douady e Hubbard fixaram isto nos anos 80 como parte da sua prova de que o conjunto é conexo.",
    },
    {
      pretitle: "Secção 05 · Outras catacáusticas",
      title: "Um pequeno zoo de envolventes",
      body: "Muda a luz e mudas a curva. Raios paralelos em meia chávena dão a nefroide (duas cúspides em vez de uma). Uma cardioide a rolar em torno de um círculo traça a astroide. Cada envolvente é a impressão digital da sua fonte — e, assim que aprendes a olhar, vês-as em montras, frigideiras polidas, arco-íris.",
    },
    {
      pretitle: "Secção 06 · História",
      title: "Étienne Pascal, 1637 — e um batismo em 1741",
      body: "Étienne Pascal — pai de Blaise — estudou a curva por volta de 1637 e chamou-lhe «la limaçon». Um século depois, em 1741, Johann Castillon deu-lhe o nome que ainda usamos: cardioide, a curva em forma de coração. Newton, os Bernoulli e Cayley trabalharam as suas propriedades; hoje sobrevive como exemplo de manual e como silhueta icónica do bulbo de Mandelbrot.",
    },
  ],
  closingPretitle: "Vai mais longe",
  closingTitle: "Acende uma luz. Vê o coração.",
  closingBody:
    "O Explorador deixa-te alternar entre a ótica da chávena, o traço do círculo a rolar e a sobreposição em Mandelbrot. A mesma curva, três histórias — todas a um clique.",
  ctaLabel: "→ Abrir o Explorador",
  lightCaption: "Interativo · catacáustica de um círculo",
  lightRayCountLabel: "Raios",
  lightEnvelopeLabel: "Mostrar envolvente",
  lightHint:
    "Junta raios e a envolvente cristaliza. Cúspide na fonte sobre a borda, ponta distante a 2R na parede oposta.",
  lightPretitle: "Interativo · o coração na chávena",
  lightTitle: "Põe luz, vê aparecer o coração",
  lightBody:
    "Cada raio parte da fonte na borda, salta na parede e cruza todos os outros. A cardioide é a curva onde as cordas se acumulam.",
  bridgeCaption: "Interativo · a mesma cardioide em Mandelbrot",
  bridgeParamLabel: "Parâmetro t",
  bridgeHint:
    "Desliza t pela fronteira. Dentro: dinâmica com um único ponto fixo atrator. Fora: duplicação de período, caos ou fuga.",
  bridgePretitle: "Interativo · da chávena a Mandelbrot",
  bridgeTitle: "Percorre a fronteira do bulbo principal",
  bridgeBody:
    "A parametrização de Douady–Hubbard c(t) = ½e^(it) − ¼e^(2it) dá uma volta à cardioide enquanto t vai de 0 a 2π. A mesma equação vive nas duas imagens.",
};

const sv: RichStory = {
  page: {
    pretitle: "Ämne · Geometri",
    title: "Kaffekoppens kardioid",
    tagline: "Ljuskurvan i din kopp är Mandelbrots hjärta.",
    intro:
      "Lys med en liten ljuskälla mot innerväggen i en cylindrisk kaffekopp. Reflexerna fokuserar inte i en punkt — de omsluter en hjärtformad kurva på ytan. Den kurvan är kardioiden r = 2a(1 − cos θ). Samma ekvation parametriserar huvudbulben i Mandelbrotmängden. Varje morgon ritas dynamikens mest berömda form i ljus.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Ett hjärta tecknat av ljus.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "När ljus studsar mot en krökt yta samlas inte de reflekterade strålarna i en punkt — de förtätas längs en kurva som kallas katakaustik. För en cirkel upplyst av en punkt på sin kant är den kurvan en perfekt kardioid: ett hjärta med en enda spets, tecknat av själva ljuset.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Ställ en kaffekopp i solen. Den ljusa kurvan som flyter på den mörka ytan är din kardioid — samma ekvation r = 2a(1 − cos θ) som matematikerna studerat i fyra sekler. Flytta ljuset, hjärtat flyttar sig. Luta koppen, hjärtat lutar med.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Zooma nu in i Mandelbrotmängden. Det stora hjärtat i mitten — huvudbulben — är exakt samma kardioid, parametriserad av c(t) = ½e^(it) − ¼e^(2it). En kurva från köksoptiken är också ryggraden i det mest studerade objektet inom komplex dynamik. Utan uppenbart skäl.",
      },
    ],
    tryIt: "Nedan: se kardioiden växa fram ur reflekterat ljus och möt den igen inne i Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Katakaustiken",
      title: "Ljus, en cirkel och kurvan som fångar det",
      body: "Sätt en punktformig ljuskälla på kanten av en cirkelformad spegel. Varje stråle studsar mot innerväggen och de reflekterade strålarna korsar varandra; familjen omsluter en slät kurva — cirkelns katakaustik. Den höljekurvan är en kardioid, med spetsen vid källan. Ingen approximation, det är exakt.",
    },
    {
      pretitle: "Avsnitt 02 · Ekvationen",
      title: "r = 2a (1 − cos θ)",
      body: "I polära koordinater med ursprung i spetsen är kardioiden r(θ) = 2a(1 − cos θ). Vid θ = 0 är radien 0 — spetsen själv. Vid θ = π är den 4a — den bortre udden. Talet a är moderlands cirkelns radie; kardioiden är dubbelt så bred och exakt fyra gånger så lång.",
    },
    {
      pretitle: "Avsnitt 03 · Den rullande definitionen",
      title: "En punkt på ett hjul som rullar runt sin tvilling",
      body: "Ta två cirklar med samma radie a. Håll den ena stilla, låt den andra rulla runt utan att glida och markera en punkt på den rullandes kant. Kurvan som ritas är kardioiden — kardía betyder «hjärta» på grekiska. Samma form, samma ekvation, men byggd av rullning istället för spegling.",
    },
    {
      pretitle: "Avsnitt 04 · Mandelbrots huvudbulb",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zooma in på z ↦ z² + c. Den stora hjärtformiga komponenten i mitten — Mandelbrots huvudbulb — har randen c(t) = ½e^(it) − ¼e^(2it), och algebraiskt är det en kardioid. De c-värden som ligger innanför är just de där iterationen konvergerar mot en enda attraktiv fixpunkt. Douady och Hubbard fäste detta på 1980-talet som en del av sitt bevis att mängden är sammanhängande.",
    },
    {
      pretitle: "Avsnitt 05 · Andra katakaustiker",
      title: "Ett litet zoo av höljekurvor",
      body: "Byt ljus, så byter du kurva. Parallella strålar in i en halv kopp ger nefroiden (två spetsar istället för en). En kardioid som rullar runt en cirkel tecknar astroiden. Varje hölje är sin källas fingeravtryck — och när du väl lärt dig titta ser du dem i skyltfönster, polerade stekpannor, regnbågar.",
    },
    {
      pretitle: "Avsnitt 06 · Historia",
      title: "Étienne Pascal, 1637 — och ett dop 1741",
      body: "Étienne Pascal — Blaises far — studerade kurvan omkring 1637 och kallade den «la limaçon». Ett sekel senare, 1741, gav Johann Castillon den namnet vi fortfarande använder: kardioid, den hjärtformade kurvan. Newton, Bernoullierna och Cayley arbetade med dess egenskaper; idag lever den vidare som läroboksexempel och som Mandelbrotbulbens ikoniska siluett.",
    },
  ],
  closingPretitle: "Gå vidare",
  closingTitle: "Tänd en lampa. Se hjärtat.",
  closingBody:
    "Utforskaren låter dig växla mellan kaffekoppens optik, den rullande cirkelns spår och Mandelbrot-överlägget. Samma kurva, tre berättelser — alla ett klick bort.",
  ctaLabel: "→ Öppna Utforskaren",
  lightCaption: "Interaktivt · cirkelns katakaustik",
  lightRayCountLabel: "Strålar",
  lightEnvelopeLabel: "Visa höljekurva",
  lightHint:
    "Lägg till strålar så kristalliseras höljet. Spets vid källan på kanten, bortre udde på avstånd 2R på motsatta väggen.",
  lightPretitle: "Interaktivt · hjärtat i koppen",
  lightTitle: "Sätt på ljus, se hjärtat dyka upp",
  lightBody:
    "Varje stråle lämnar källan på kanten, studsar mot väggen och korsar alla andra reflexer. Kardioiden är kurvan där kordorna förtätas.",
  bridgeCaption: "Interaktivt · samma kardioid i Mandelbrot",
  bridgeParamLabel: "Parameter t",
  bridgeHint:
    "Dra t längs randen. Innanför: dynamik med en enda attraktiv fixpunkt. Utanför: perioddubblering, kaos eller flykt.",
  bridgePretitle: "Interaktivt · från kopp till Mandelbrot",
  bridgeTitle: "Följ huvudbulbens rand",
  bridgeBody:
    "Douady–Hubbards parametrisering c(t) = ½e^(it) − ¼e^(2it) går ett varv runt kardioiden medan t går från 0 till 2π. Samma ekvation lever i båda bilderna.",
};

const no: RichStory = {
  page: {
    pretitle: "Tema · Geometri",
    title: "Kaffekoppens kardioide",
    tagline: "Lyskurven i koppen din er Mandelbrots hjerte.",
    intro:
      "Lys med en liten lyskilde mot innerveggen i en sylindrisk kaffekopp. Refleksene fokuserer ikke i ett punkt — de omslutter en hjerteformet kurve på overflaten. Den kurven er kardioiden r = 2a(1 − cos θ). Samme ligning parametriserer hovedknoppen i Mandelbrotmengden. Hver morgen tegnes dynamikkens mest kjente form i lys.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Et hjerte tegnet av lys.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Når lys spretter av en krummet flate, samles ikke de reflekterte strålene i ett punkt — de fortettes langs en kurve som kalles katakaustikk. For en sirkel opplyst av et punkt på kanten er den kurven en perfekt kardioide: ett hjerte med én eneste spiss, tegnet av lyset selv.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Sett en kaffekopp i sola. Den lyse kurven som flyter på den mørke overflaten er din kardioide — samme ligning r = 2a(1 − cos θ) som matematikerne har studert i fire århundrer. Flytt lyset, hjertet flytter seg. Tipp koppen, hjertet tipper med.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Zoom så inn i Mandelbrotmengden. Det store hjertet midt i — hovedknoppen — er nøyaktig samme kardioide, parametrisert ved c(t) = ½e^(it) − ¼e^(2it). En kurve fra kjøkkenoptikken er også ryggraden i det mest studerte objektet i kompleks dynamikk. Uten åpenbar grunn.",
      },
    ],
    tryIt: "Under: se kardioiden vokse fram av reflektert lys og møt den igjen inne i Mandelbrot.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Katakaustikken",
      title: "Lys, en sirkel og kurven som fanger det",
      body: "Sett en punktformet lyskilde på kanten av et sirkelformet speil. Hver stråle spretter av innerveggen, og de reflekterte strålene krysser hverandre; familien omslutter en glatt kurve — sirkelens katakaustikk. Den hyllingskurven er en kardioide, med spissen ved kilden. Ingen tilnærming: det er eksakt.",
    },
    {
      pretitle: "Avsnitt 02 · Ligningen",
      title: "r = 2a (1 − cos θ)",
      body: "I polare koordinater med utgangspunkt i spissen er kardioiden r(θ) = 2a(1 − cos θ). Ved θ = 0 er radien 0 — spissen. Ved θ = π er den 4a — den bortre spissen. Tallet a er radius på morsirkelen; kardioiden er dobbelt så bred og nøyaktig fire ganger så lang.",
    },
    {
      pretitle: "Avsnitt 03 · Den rullende definisjonen",
      title: "Et punkt på et hjul som ruller rundt sin tvilling",
      body: "Ta to sirkler med samme radius a. Hold den ene fast, la den andre rulle rundt uten å gli, og merk et punkt på kanten av den rullende. Kurven som tegnes er kardioiden — kardía betyr «hjerte» på gresk. Samme form, samme ligning, men bygd av rulling i stedet for refleksjon.",
    },
    {
      pretitle: "Avsnitt 04 · Mandelbrots hovedknopp",
      title: "c(t) = ½ e^(it) − ¼ e^(2it)",
      body: "Zoom inn på z ↦ z² + c. Den store hjerteformede komponenten midt i — Mandelbrots hovedknopp — har randen c(t) = ½e^(it) − ¼e^(2it), og det er algebraisk en kardioide. c-verdiene innenfor er nettopp de der iterasjonen konvergerer mot ett enkelt tiltrekkende fast punkt. Douady og Hubbard festet dette på 1980-tallet som del av beviset på at mengden er sammenhengende.",
    },
    {
      pretitle: "Avsnitt 05 · Andre katakaustikker",
      title: "Et lite zoo av hyllingskurver",
      body: "Skift lys, og du skifter kurve. Parallelle stråler i en halv kopp gir nefroiden (to spisser i stedet for én). En kardioide som ruller rundt en sirkel tegner astroiden. Hver hylling er sin kildes fingeravtrykk — og når du først lærer å se, dukker de opp i utstillingsvinduer, polerte panner, regnbuer.",
    },
    {
      pretitle: "Avsnitt 06 · Historie",
      title: "Étienne Pascal, 1637 — og en dåp i 1741",
      body: "Étienne Pascal — Blaises far — studerte kurven rundt 1637 og kalte den «la limaçon». Et hundreår senere, i 1741, ga Johann Castillon den navnet vi fortsatt bruker: kardioide, den hjerteformede kurven. Newton, Bernoulli-ene og Cayley arbeidet med egenskapene; i dag lever den videre som lærebokeksempel og som Mandelbrotknoppens ikoniske silhuett.",
    },
  ],
  closingPretitle: "Gå videre",
  closingTitle: "Tenn et lys. Se hjertet.",
  closingBody:
    "Utforskeren lar deg veksle mellom kaffekoppens optikk, den rullende sirkelens spor og Mandelbrot-overlegget. Samme kurve, tre historier — alle ett klikk unna.",
  ctaLabel: "→ Åpne Utforskeren",
  lightCaption: "Interaktivt · sirkelens katakaustikk",
  lightRayCountLabel: "Stråler",
  lightEnvelopeLabel: "Vis hylling",
  lightHint:
    "Legg til stråler, og hyllingen krystalliseres. Spiss ved kilden på kanten, bortre spiss i avstand 2R på motsatt vegg.",
  lightPretitle: "Interaktivt · hjertet i koppen",
  lightTitle: "Sett på lys, se hjertet dukke opp",
  lightBody:
    "Hver stråle forlater kilden på kanten, spretter av veggen og krysser alle andre refleksjoner. Kardioiden er kurven der kordene fortettes.",
  bridgeCaption: "Interaktivt · samme kardioide i Mandelbrot",
  bridgeParamLabel: "Parameter t",
  bridgeHint:
    "Dra t langs randen. Innenfor: dynamikk med ett tiltrekkende fast punkt. Utenfor: periodedobling, kaos eller flukt.",
  bridgePretitle: "Interaktivt · fra koppen til Mandelbrot",
  bridgeTitle: "Følg hovedknoppens rand",
  bridgeBody:
    "Douady–Hubbard-parametriseringen c(t) = ½e^(it) − ¼e^(2it) går én runde rundt kardioiden mens t går fra 0 til 2π. Samme ligning lever i begge bildene.",
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

export default function CardioidStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };
  const [sec0, sec1, sec2, sec3, sec4, sec5] = story.sections;

  return (
    <StoryPageShell
      page={page}
      ctaHref="/cardioid/explorer"
      accent={ACCENT}
      borderAccent="border-signal-amber/70"
      bgAccent="bg-signal-amber/10"
      hoverAccent="hover:bg-signal-amber/20"
      gradient="from-signal-amber/10"
      formulaBadge="r = 2a (1 − cos θ)   =   catacaustic of a circle"
      formulaLatex={"r = 2a(1 - \\cos\\theta)"}
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

      {/* Section 01 — The catacaustic */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec0!.pretitle}
          title={sec0!.title}
          body={sec0!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 · Light demo */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.lightPretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.lightTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.lightBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <CardioidLightDemo
            caption={story.lightCaption}
            rayCountLabel={story.lightRayCountLabel}
            envelopeLabel={story.lightEnvelopeLabel}
            hint={story.lightHint}
          />
        </Reveal>
      </section>

      {/* Section 02 — The equation */}
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
              polar form
            </div>
            <div className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
              r(θ) = 2a (1 − cos θ)
            </div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              Cusp at θ = 0, far tip at θ = π with radius 4a. The parent circle has radius a; the
              cardioid is twice as wide and exactly four times as long.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 03 — Rolling-circle */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec2!.pretitle}
          title={sec2!.title}
          body={sec2!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — Mandelbrot main bulb */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec3!.pretitle}
          title={sec3!.title}
          body={sec3!.body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 2 · Mandelbrot bridge */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <Reveal>
          <div className="space-y-2 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.bridgePretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{story.bridgeTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink-200">
              {story.bridgeBody}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <CardioidMandelbrotBridge
            caption={story.bridgeCaption}
            paramLabel={story.bridgeParamLabel}
            hint={story.bridgeHint}
          />
        </Reveal>
      </section>

      {/* Section 05 — Other catacaustics */}
      <section className="mx-auto mb-32 max-w-5xl space-y-6">
        <StoryCard
          pretitle={sec4!.pretitle}
          title={sec4!.title}
          body={sec4!.body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — History */}
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
            href="/cardioid/explorer"
            className="inline-block rounded-full border border-signal-amber/70 bg-signal-amber/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-amber transition-colors hover:bg-signal-amber/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
