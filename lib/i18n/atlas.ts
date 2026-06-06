// Landing page + per-topic strings in 8 languages. The topic body is one
// concise paragraph that explains the curiosity to a layperson, accurate
// enough that a mathematician will not wince.

import type { Locale } from "./types";
import type { TopicId } from "../topics";

export interface AtlasDict {
  landing: {
    pretitle: string;
    title1: string;
    title2: string;
    subtitle: string;
    intro1: string;
    intro2: string;
    browseLabel: string;
    statusInteractive: string;
    statusStub: string;
    categoryLogic: string;
    categoryComputation: string;
    categoryChaos: string;
    categoryGeometry: string;
    categoryAnalysis: string;
    categoryParadox: string;
    enterTopic: string;
    inDevelopment: string;
    authoredByPrefix: string;
    authoredByName: string;
    authoredByOrg: string;
  };
  nav: {
    atlas: string;
  };
  footer: {
    author: string;
  };
  comingSoon: {
    title: string;
    body: string;
    back: string;
  };
  topics: Record<TopicId, { title: string; tagline: string; body: string }>;
}

const en: AtlasDict = {
  landing: {
    pretitle: "An atlas of mathematical curiosities",
    title1: "From one",
    title2: "everything",
    subtitle: "Eleven ideas where a single rule unfolds into a universe.",
    intro1:
      "Every room here begins from almost nothing — one operator, one rule, one equation — and walks until the picture is dense. Some rooms are fully built and let you turn the knobs; others are still being furnished and offer the explanation only.",
    intro2:
      "Click any tile to enter. Read for two minutes, play for ten. None of these are tricks. They are the small statements mathematicians keep coming back to, dressed up so you can see them.",
    browseLabel: "Browse the atlas",
    statusInteractive: "Interactive",
    statusStub: "In development",
    categoryLogic: "Logic",
    categoryComputation: "Computation",
    categoryChaos: "Chaos",
    categoryGeometry: "Geometry",
    categoryAnalysis: "Analysis",
    categoryParadox: "Paradox",
    enterTopic: "Enter →",
    inDevelopment: "An interactive room is being built. Below is the idea itself, in plain language.",
    authoredByPrefix: "Curated by",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: {
    author: "Curated by Simon Franzen · zauberware technologies",
  },
  comingSoon: {
    title: "Coming soon",
    body: "An interactive exhibit for this curiosity is in progress. The text below is the idea in plain language — accurate, but not yet playable.",
    back: "← Back to the atlas",
  },
  topics: {
    eml: {
      title: "The EML Calculus",
      tagline: "One operator builds (almost) every elementary function",
      body:
        "Take eml(x, y) = eˣ − ln y. Nest it inside itself enough times, with the number 1 as the only available constant, and you can recover exponentials, logarithms, multiplication, the identity, even sin and cos. A 2026 paper makes the case formally and shows where the calculus eventually breaks.",
    },
    nand: {
      title: "The Sheffer Stroke",
      tagline: "One gate is enough for all of digital logic",
      body:
        "The NAND gate (a ↑ b = ¬(a ∧ b)) is functionally complete on its own: every Boolean expression — AND, OR, NOT, XOR, the lot — can be built from NANDs alone. This is why entire computer chips are physically realised as a sea of NANDs. It is the EML of electronics, settled in the 1910s by Henry Sheffer.",
    },
    iota: {
      title: "The Iota Combinator",
      tagline: "One symbol that is Turing-complete",
      body:
        "Iota (℩) is a single combinator defined as ℩x = xSK. With nothing but Iota and parentheses you can re-derive S and K, and from S and K you can encode every computable function. A whole programming language lives inside one symbol — the spiritual cousin of EML, but for computation itself.",
    },
    life: {
      title: "Conway's Game of Life",
      tagline: "Four rules. Spaceships, factories, computers.",
      body:
        "A cell on a grid is born if it has exactly three live neighbours, survives with two or three, dies otherwise. From those four lines unfold gliders, glider guns, oscillators, replicators — and, fully working, a Turing machine. People have built Game of Life inside Game of Life.",
    },
    rule110: {
      title: "Rule 110",
      tagline: "An eight-bit rule, provably universal",
      body:
        "Each cell looks at itself and its two neighbours and updates by the rule numbered 110 in binary (01101110). The pattern that grows from a single dot encodes computations — Cook and Wolfram proved this single rule is Turing-complete. The simplest known universal machine you can describe in a tweet.",
    },
    logistic: {
      title: "The Logistic Map",
      tagline: "A harmless formula where order collapses into chaos",
      body:
        "Iterate xₙ₊₁ = r · xₙ · (1 − xₙ) and increase r. The fixed point splits into a 2-cycle, then 4, then 8 — a cascade of doublings that ends in full chaos around r ≈ 3.5699. Inside that cascade hides the Feigenbaum constant 4.6692…, the same number that governs unrelated chaotic systems across physics.",
    },
    mandelbrot: {
      title: "The Mandelbrot Set",
      tagline: "Square and add. Forever.",
      body:
        "For each complex number c, iterate zₙ₊₁ = zₙ² + c starting from 0 and ask whether the sequence stays bounded. The black blob of points that do is the Mandelbrot set — one of the most intricate objects ever drawn. Zoom anywhere on its edge and the structure never simplifies.",
    },
    lorenz: {
      title: "The Lorenz Attractor",
      tagline: "Three lines of code, one butterfly",
      body:
        "Three coupled differential equations modelling a slice of the atmosphere. Plotted in space, the trajectory loops around two centres in a shape that looks exactly like a butterfly — the visual signature of chaos theory and the source of the phrase 'butterfly effect'.",
    },
    fourier: {
      title: "The Fourier Transform",
      tagline: "Every signal is a sum of sine waves",
      body:
        "Any reasonable function of time can be decomposed into a (possibly infinite) sum of pure sines and cosines, each with its own frequency and amplitude. This single fact is why MP3, JPEG, MRI scanners, your Wi-Fi, and almost every modern audio tool work. Sound, image, signal — all secretly waves stacked on waves.",
    },
    euler: {
      title: "Euler's Identity",
      tagline: "The five most important numbers, in one line",
      body:
        "eⁱᵖⁱ + 1 = 0. The number e from growth, π from circles, i from the imaginary, plus 0 and 1 — all bound by a single equality. Most working mathematicians vote it the most beautiful formula they know; the proof is two lines of calculus and a leap of identification.",
    },
    banach: {
      title: "The Banach–Tarski Paradox",
      tagline: "Cut a ball, end up with two of the same size",
      body:
        "Using the Axiom of Choice you can decompose a solid ball in three-dimensional space into finitely many pieces and reassemble them — without stretching or distorting — into two solid balls each identical to the original. It is rigorously proven and impossible to do with anything physical. The 'pieces' are not measurable sets; that is where the strangeness lives.",
    },
  },
};

const de: AtlasDict = {
  landing: {
    pretitle: "Ein Atlas mathematischer Kuriositäten",
    title1: "Aus einem",
    title2: "alles",
    subtitle: "Elf Ideen, in denen sich aus einer einzigen Regel ein ganzes Universum entfaltet.",
    intro1:
      "Jeder Raum beginnt bei fast nichts — ein Operator, eine Regel, eine Gleichung — und läuft, bis das Bild dicht wird. Manche Räume sind fertig ausgebaut und du darfst an den Knöpfen drehen; andere werden gerade eingerichtet und liefern vorerst nur die Erklärung.",
    intro2:
      "Klicke eine Kachel, um einzutreten. Zwei Minuten Lesen, zehn Minuten Spielen. Keine Tricks. Es sind die kleinen Aussagen, zu denen Mathematiker immer wieder zurückkehren — hier aufbereitet, damit du sie siehst.",
    browseLabel: "Atlas durchstöbern",
    statusInteractive: "Interaktiv",
    statusStub: "In Entwicklung",
    categoryLogic: "Logik",
    categoryComputation: "Berechnung",
    categoryChaos: "Chaos",
    categoryGeometry: "Geometrie",
    categoryAnalysis: "Analysis",
    categoryParadox: "Paradoxon",
    enterTopic: "Eintreten →",
    inDevelopment: "Der interaktive Raum wird noch gebaut. Unten steht die Idee selbst, in einfacher Sprache.",
    authoredByPrefix: "Kuratiert von",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: {
    author: "Kuratiert von Simon Franzen · zauberware technologies",
  },
  comingSoon: {
    title: "In Vorbereitung",
    body: "Eine interaktive Ausstellung zu dieser Kuriosität ist in Arbeit. Der Text unten ist die Idee in einfacher Sprache — korrekt, aber noch nicht spielbar.",
    back: "← Zurück zum Atlas",
  },
  topics: {
    eml: {
      title: "Der EML-Kalkül",
      tagline: "Ein Operator baut (fast) jede elementare Funktion",
      body:
        "Nimm eml(x, y) = eˣ − ln y. Schachtle ihn oft genug in sich selbst, mit der Zahl 1 als einziger Konstante, und du erhältst Exponentialfunktion, Logarithmus, Multiplikation, Identität, sogar Sinus und Cosinus zurück. Ein Paper von 2026 führt das formal vor und zeigt, wo der Kalkül schließlich zusammenbricht.",
    },
    nand: {
      title: "Der Sheffer-Strich",
      tagline: "Ein Gatter genügt für die gesamte digitale Logik",
      body:
        "Das NAND-Gatter (a ↑ b = ¬(a ∧ b)) ist allein funktional vollständig: jede boolesche Verknüpfung — UND, ODER, NICHT, XOR, alles — lässt sich aus NANDs bauen. Genau deshalb sind ganze Computerchips physikalisch ein Meer aus NAND-Gattern. Es ist das EML der Elektronik, geklärt von Henry Sheffer in den 1910ern.",
    },
    iota: {
      title: "Der Iota-Kombinator",
      tagline: "Ein Symbol — und damit Turing-vollständig",
      body:
        "Iota (℩) ist ein einzelner Kombinator, definiert als ℩x = xSK. Mit nichts als Iota und Klammern kannst du S und K wiedergewinnen — und aus S und K jede berechenbare Funktion. Eine ganze Programmiersprache lebt in einem Symbol — der geistige Verwandte des EML, nur für das Rechnen selbst.",
    },
    life: {
      title: "Conways Game of Life",
      tagline: "Vier Regeln. Raumschiffe, Fabriken, Computer.",
      body:
        "Eine Zelle auf einem Gitter wird geboren bei genau drei lebenden Nachbarn, überlebt bei zwei oder drei, stirbt sonst. Aus diesen vier Zeilen entstehen Gleiter, Gleiter-Kanonen, Oszillatoren, Replikatoren — und eine voll funktionierende Turing-Maschine. Man hat Game of Life innerhalb von Game of Life gebaut.",
    },
    rule110: {
      title: "Regel 110",
      tagline: "Eine Achtbit-Regel, beweisbar universell",
      body:
        "Jede Zelle sieht sich selbst und ihre zwei Nachbarn an und aktualisiert nach der Regel mit Binärnummer 110 (01101110). Das Muster, das aus einem einzigen Punkt wächst, kodiert Berechnungen — Cook und Wolfram bewiesen, dass diese eine Regel Turing-vollständig ist. Die einfachste bekannte universelle Maschine, die in einen Tweet passt.",
    },
    logistic: {
      title: "Die logistische Abbildung",
      tagline: "Eine harmlose Formel, in der Ordnung in Chaos kippt",
      body:
        "Iteriere xₙ₊₁ = r · xₙ · (1 − xₙ) und erhöhe r. Der Fixpunkt spaltet sich in einen 2-Zyklus, dann 4, dann 8 — eine Kaskade von Verdoppelungen, die um r ≈ 3,5699 in volles Chaos endet. In dieser Kaskade versteckt sich die Feigenbaum-Konstante 4,6692…, die dieselbe Zahl ist, die in völlig anderen chaotischen Systemen der Physik wiederkehrt.",
    },
    mandelbrot: {
      title: "Die Mandelbrot-Menge",
      tagline: "Quadriere und addiere. Immer wieder.",
      body:
        "Für jede komplexe Zahl c iteriere zₙ₊₁ = zₙ² + c, startend bei 0, und frage, ob die Folge beschränkt bleibt. Die schwarze Insel jener Punkte, die das tun, ist die Mandelbrot-Menge — eines der filigransten je gezeichneten Objekte. Zoom irgendwo an ihren Rand und die Struktur wird nie einfacher.",
    },
    lorenz: {
      title: "Der Lorenz-Attraktor",
      tagline: "Drei Zeilen Code, ein Schmetterling",
      body:
        "Drei gekoppelte Differentialgleichungen modellieren ein Stück Atmosphäre. Im Raum dargestellt, schlingt sich die Bahn um zwei Zentren — in einer Form, die exakt wie ein Schmetterling aussieht. Das visuelle Markenzeichen der Chaostheorie und Ursprung des Begriffs „Schmetterlingseffekt“.",
    },
    fourier: {
      title: "Die Fourier-Transformation",
      tagline: "Jedes Signal ist eine Summe von Sinuswellen",
      body:
        "Jede vernünftige Funktion der Zeit lässt sich in eine (möglicherweise unendliche) Summe reiner Sinus- und Cosinuswellen zerlegen — jede mit eigener Frequenz und Amplitude. Diese eine Tatsache ist der Grund, warum MP3, JPEG, MRT-Scanner, dein WLAN und fast jedes moderne Audio-Werkzeug funktionieren. Klang, Bild, Signal — alle insgeheim Wellen auf Wellen.",
    },
    euler: {
      title: "Eulers Identität",
      tagline: "Die fünf wichtigsten Zahlen, in einer Zeile",
      body:
        "eⁱᵖⁱ + 1 = 0. Die Zahl e aus dem Wachstum, π aus dem Kreis, i aus dem Imaginären, dazu 0 und 1 — alle verbunden in einer einzigen Gleichheit. Die meisten Mathematiker halten sie für die schönste Formel überhaupt; der Beweis sind zwei Zeilen Analysis und ein gedanklicher Sprung.",
    },
    banach: {
      title: "Das Banach-Tarski-Paradoxon",
      tagline: "Zerlege eine Kugel — und erhalte zwei gleich große",
      body:
        "Mit dem Auswahlaxiom kannst du eine massive Kugel im dreidimensionalen Raum in endlich viele Teile zerlegen und sie — ohne Strecken oder Verformen — zu zwei massiven Kugeln gleicher Größe wie das Original zusammensetzen. Streng bewiesen und mit nichts Physikalischem nachvollziehbar. Die „Teile“ sind keine messbaren Mengen; dort wohnt die Seltsamkeit.",
    },
  },
};

const es: AtlasDict = {
  landing: {
    pretitle: "Un atlas de curiosidades matemáticas",
    title1: "Desde uno",
    title2: "todo",
    subtitle: "Once ideas en que una sola regla se despliega en un universo.",
    intro1:
      "Cada sala empieza con casi nada — un operador, una regla, una ecuación — y avanza hasta que la imagen se densifica. Algunas salas están totalmente montadas y puedes girar las perillas; otras siguen amueblándose y de momento solo ofrecen la explicación.",
    intro2:
      "Pulsa cualquier baldosa para entrar. Dos minutos leyendo, diez jugando. Ninguno es un truco. Son los pequeños enunciados a los que los matemáticos vuelven una y otra vez, presentados para que los veas.",
    browseLabel: "Recorrer el atlas",
    statusInteractive: "Interactivo",
    statusStub: "En preparación",
    categoryLogic: "Lógica",
    categoryComputation: "Computación",
    categoryChaos: "Caos",
    categoryGeometry: "Geometría",
    categoryAnalysis: "Análisis",
    categoryParadox: "Paradoja",
    enterTopic: "Entrar →",
    inDevelopment: "La sala interactiva todavía se está construyendo. Abajo está la idea misma, en lenguaje sencillo.",
    authoredByPrefix: "Comisariado por",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Comisariado por Simon Franzen · zauberware technologies" },
  comingSoon: {
    title: "Próximamente",
    body: "Una sala interactiva para esta curiosidad está en preparación. El texto siguiente es la idea en lenguaje sencillo — precisa, pero aún no jugable.",
    back: "← Volver al atlas",
  },
  topics: {
    eml: {
      title: "El cálculo EML",
      tagline: "Un operador construye (casi) toda función elemental",
      body:
        "Toma eml(x, y) = eˣ − ln y. Anídalo en sí mismo lo suficiente, con el número 1 como única constante, y recuperas exponencial, logaritmo, multiplicación, identidad, incluso seno y coseno. Un artículo de 2026 lo plantea formalmente y muestra dónde el cálculo termina rompiéndose.",
    },
    nand: {
      title: "La barra de Sheffer",
      tagline: "Una sola puerta basta para toda la lógica digital",
      body:
        "La puerta NAND (a ↑ b = ¬(a ∧ b)) es funcionalmente completa por sí sola: toda expresión booleana — AND, OR, NOT, XOR, lo que sea — se construye sólo con NANDs. Por eso chips enteros se realizan físicamente como un mar de NANDs. Es el EML de la electrónica, establecido por Henry Sheffer en los años 1910.",
    },
    iota: {
      title: "El combinador Iota",
      tagline: "Un símbolo y, con él, completitud de Turing",
      body:
        "Iota (℩) es un solo combinador definido como ℩x = xSK. Con sólo Iota y paréntesis se derivan S y K, y a partir de S y K se codifica toda función computable. Todo un lenguaje habita en un único símbolo — el pariente espiritual de EML, pero para la computación misma.",
    },
    life: {
      title: "El juego de la vida de Conway",
      tagline: "Cuatro reglas. Naves, fábricas, ordenadores.",
      body:
        "Una célula en una cuadrícula nace si tiene exactamente tres vecinas vivas, sobrevive con dos o tres, muere en otro caso. De esas cuatro líneas surgen planeadores, cañones de planeadores, osciladores, replicadores — y una máquina de Turing en pleno funcionamiento. Se ha construido el juego de la vida dentro del juego de la vida.",
    },
    rule110: {
      title: "Regla 110",
      tagline: "Una regla de ocho bits, demostradamente universal",
      body:
        "Cada célula mira a sí misma y a sus dos vecinas y se actualiza según la regla número 110 en binario (01101110). El patrón que crece a partir de un solo punto codifica computaciones — Cook y Wolfram demostraron que esta sola regla es Turing-completa. La máquina universal más simple conocida, que cabe en un tuit.",
    },
    logistic: {
      title: "El mapa logístico",
      tagline: "Una fórmula inocente donde el orden cae en caos",
      body:
        "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) e incrementa r. El punto fijo se divide en un ciclo de 2, luego 4, luego 8 — una cascada de duplicaciones que acaba en caos total alrededor de r ≈ 3,5699. Dentro de esa cascada se esconde la constante de Feigenbaum 4,6692…, el mismo número que rige sistemas caóticos sin relación entre sí en la física.",
    },
    mandelbrot: {
      title: "El conjunto de Mandelbrot",
      tagline: "Eleva al cuadrado y suma. Para siempre.",
      body:
        "Para cada número complejo c, itera zₙ₊₁ = zₙ² + c empezando en 0 y pregunta si la sucesión queda acotada. La mancha negra de puntos que sí lo hacen es el conjunto de Mandelbrot — uno de los objetos más intrincados jamás dibujados. Haz zoom en cualquier lugar de su borde y la estructura nunca se simplifica.",
    },
    lorenz: {
      title: "El atractor de Lorenz",
      tagline: "Tres líneas de código, una mariposa",
      body:
        "Tres ecuaciones diferenciales acopladas que modelan un trozo de atmósfera. Trazada en el espacio, la trayectoria gira alrededor de dos centros con una forma exactamente de mariposa — el emblema visual de la teoría del caos y origen de la expresión «efecto mariposa».",
    },
    fourier: {
      title: "La transformada de Fourier",
      tagline: "Toda señal es una suma de ondas senoidales",
      body:
        "Cualquier función razonable del tiempo puede descomponerse en una suma (posiblemente infinita) de senos y cosenos puros, cada uno con su frecuencia y amplitud. Este único hecho explica por qué MP3, JPEG, los escáneres MRI, tu Wi-Fi y casi toda herramienta de audio moderna funcionan. Sonido, imagen, señal — todos en secreto son ondas sobre ondas.",
    },
    euler: {
      title: "La identidad de Euler",
      tagline: "Los cinco números más importantes en una sola línea",
      body:
        "eⁱᵖⁱ + 1 = 0. El número e del crecimiento, π de los círculos, i de lo imaginario, más 0 y 1 — todos unidos por una sola igualdad. La mayoría de matemáticos la votan como la fórmula más bella; su demostración son dos líneas de cálculo y un salto de identificación.",
    },
    banach: {
      title: "La paradoja de Banach–Tarski",
      tagline: "Corta una bola y queda con dos del mismo tamaño",
      body:
        "Usando el axioma de elección puedes descomponer una bola sólida en el espacio tridimensional en un número finito de piezas y reensamblarlas — sin estirar ni deformar — en dos bolas sólidas idénticas a la original. Está rigurosamente probado e imposible con nada físico. Las «piezas» no son conjuntos medibles; allí vive lo extraño.",
    },
  },
};

const fr: AtlasDict = {
  landing: {
    pretitle: "Un atlas de curiosités mathématiques",
    title1: "À partir d'un",
    title2: "tout",
    subtitle: "Onze idées où une seule règle se déploie en un univers.",
    intro1:
      "Chaque salle commence avec presque rien — un opérateur, une règle, une équation — et marche jusqu'à ce que l'image soit dense. Certaines salles sont entièrement bâties et vous laissez tourner les boutons ; d'autres se meublent encore et n'offrent pour l'instant que l'explication.",
    intro2:
      "Cliquez sur une tuile pour entrer. Deux minutes de lecture, dix de jeu. Aucun n'est un tour de magie. Ce sont les petits énoncés sur lesquels les mathématiciens reviennent sans cesse, présentés pour que vous les voyiez.",
    browseLabel: "Parcourir l'atlas",
    statusInteractive: "Interactif",
    statusStub: "En préparation",
    categoryLogic: "Logique",
    categoryComputation: "Calcul",
    categoryChaos: "Chaos",
    categoryGeometry: "Géométrie",
    categoryAnalysis: "Analyse",
    categoryParadox: "Paradoxe",
    enterTopic: "Entrer →",
    inDevelopment: "La salle interactive est encore en construction. Ci-dessous se trouve l'idée même, en mots simples.",
    authoredByPrefix: "Commissariat",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Commissariat : Simon Franzen · zauberware technologies" },
  comingSoon: {
    title: "Bientôt disponible",
    body: "Une salle interactive pour cette curiosité est en préparation. Le texte ci-dessous présente l'idée en langage simple — exacte, mais pas encore jouable.",
    back: "← Retour à l'atlas",
  },
  topics: {
    eml: {
      title: "Le calcul EML",
      tagline: "Un opérateur bâtit (presque) toute fonction élémentaire",
      body:
        "Prenez eml(x, y) = eˣ − ln y. Imbriquez-le en lui-même suffisamment de fois, avec le nombre 1 pour seule constante, et vous retrouvez exponentielle, logarithme, multiplication, identité, jusqu'aux sinus et cosinus. Un article de 2026 le démontre formellement et indique où le calcul finit par céder.",
    },
    nand: {
      title: "La barre de Sheffer",
      tagline: "Une seule porte suffit à toute la logique numérique",
      body:
        "La porte NAND (a ↑ b = ¬(a ∧ b)) est fonctionnellement complète à elle seule : toute expression booléenne — ET, OU, NON, XOR, l'intégralité — se construit avec des NAND seuls. C'est pour cela que des puces entières sont physiquement réalisées comme une mer de NAND. C'est l'EML de l'électronique, établi par Henry Sheffer dans les années 1910.",
    },
    iota: {
      title: "Le combinateur Iota",
      tagline: "Un symbole, et avec lui la complétude de Turing",
      body:
        "Iota (℩) est un combinateur unique défini par ℩x = xSK. Avec seulement Iota et des parenthèses on retrouve S et K, et à partir de S et K on encode toute fonction calculable. Tout un langage habite dans un seul symbole — le cousin spirituel d'EML, pour le calcul lui-même.",
    },
    life: {
      title: "Le jeu de la vie de Conway",
      tagline: "Quatre règles. Vaisseaux, usines, ordinateurs.",
      body:
        "Une cellule sur une grille naît avec exactement trois voisines vivantes, survit avec deux ou trois, meurt sinon. De ces quatre lignes naissent planeurs, canons à planeurs, oscillateurs, réplicateurs — et une machine de Turing pleinement fonctionnelle. On a bâti le jeu de la vie à l'intérieur du jeu de la vie.",
    },
    rule110: {
      title: "Règle 110",
      tagline: "Une règle huit bits, démontrablement universelle",
      body:
        "Chaque cellule se regarde et regarde ses deux voisines, puis se met à jour selon la règle numérotée 110 en binaire (01101110). Le motif issu d'un seul point encode des calculs — Cook et Wolfram ont prouvé que cette règle unique est Turing-complète. La machine universelle la plus simple connue tient dans un tweet.",
    },
    logistic: {
      title: "La carte logistique",
      tagline: "Une formule inoffensive où l'ordre bascule en chaos",
      body:
        "Itérez xₙ₊₁ = r · xₙ · (1 − xₙ) en augmentant r. Le point fixe se scinde en cycle de 2, puis 4, puis 8 — une cascade de doublements qui s'achève en chaos total vers r ≈ 3,5699. Dans cette cascade se cache la constante de Feigenbaum 4,6692…, le même nombre qui régit des systèmes chaotiques sans rapport en physique.",
    },
    mandelbrot: {
      title: "L'ensemble de Mandelbrot",
      tagline: "Carrer et ajouter. À l'infini.",
      body:
        "Pour chaque nombre complexe c, itérez zₙ₊₁ = zₙ² + c en partant de 0 et demandez si la suite reste bornée. La tache noire des points qui le font est l'ensemble de Mandelbrot — l'un des objets les plus complexes jamais dessinés. Zoomez n'importe où sur son bord, la structure ne se simplifie jamais.",
    },
    lorenz: {
      title: "L'attracteur de Lorenz",
      tagline: "Trois lignes de code, un papillon",
      body:
        "Trois équations différentielles couplées modélisant un morceau d'atmosphère. Tracée dans l'espace, la trajectoire s'enroule autour de deux centres en une forme exactement de papillon — la signature visuelle de la théorie du chaos et l'origine de l'« effet papillon ».",
    },
    fourier: {
      title: "La transformation de Fourier",
      tagline: "Tout signal est une somme d'ondes sinusoïdales",
      body:
        "Toute fonction raisonnable du temps se décompose en une somme (possiblement infinie) de sinus et cosinus purs, chacun avec sa fréquence et son amplitude. Ce seul fait explique pourquoi MP3, JPEG, IRM, votre Wi-Fi et presque tout outil audio moderne fonctionnent. Son, image, signal — tous, en secret, des ondes empilées sur des ondes.",
    },
    euler: {
      title: "L'identité d'Euler",
      tagline: "Les cinq nombres les plus importants en une ligne",
      body:
        "eⁱᵖⁱ + 1 = 0. Le nombre e issu de la croissance, π des cercles, i de l'imaginaire, plus 0 et 1 — tous reliés par une seule égalité. La plupart des mathématiciens la votent plus belle formule connue ; la démonstration tient en deux lignes d'analyse et un saut d'identification.",
    },
    banach: {
      title: "Le paradoxe de Banach–Tarski",
      tagline: "Découpez une boule, obtenez-en deux de même taille",
      body:
        "Avec l'axiome du choix, on peut décomposer une boule pleine de l'espace tridimensionnel en un nombre fini de morceaux et les réassembler — sans étirer ni déformer — en deux boules pleines identiques à l'originale. C'est rigoureusement prouvé et impossible avec quoi que ce soit de physique. Les « morceaux » ne sont pas des ensembles mesurables ; c'est là que vit l'étrangeté.",
    },
  },
};

const it: AtlasDict = {
  landing: {
    pretitle: "Un atlante di curiosità matematiche",
    title1: "Da uno",
    title2: "tutto",
    subtitle: "Undici idee in cui una sola regola si dispiega in un universo.",
    intro1:
      "Ogni stanza inizia da quasi nulla — un operatore, una regola, un'equazione — e cammina finché l'immagine non si addensa. Alcune stanze sono completamente allestite e puoi girare le manopole; altre vengono ancora arredate e per ora offrono solo la spiegazione.",
    intro2:
      "Tocca una mattonella per entrare. Due minuti di lettura, dieci di gioco. Nessuno è un trucco. Sono i piccoli enunciati ai quali i matematici tornano sempre, presentati perché tu li veda.",
    browseLabel: "Sfoglia l'atlante",
    statusInteractive: "Interattivo",
    statusStub: "In sviluppo",
    categoryLogic: "Logica",
    categoryComputation: "Calcolo",
    categoryChaos: "Caos",
    categoryGeometry: "Geometria",
    categoryAnalysis: "Analisi",
    categoryParadox: "Paradosso",
    enterTopic: "Entra →",
    inDevelopment: "La sala interattiva è ancora in costruzione. Sotto trovi l'idea stessa, in parole semplici.",
    authoredByPrefix: "A cura di",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlante" },
  footer: { author: "A cura di Simon Franzen · zauberware technologies" },
  comingSoon: {
    title: "In arrivo",
    body: "Una sala interattiva per questa curiosità è in lavorazione. Il testo seguente è l'idea in linguaggio semplice — corretta, ma non ancora giocabile.",
    back: "← Torna all'atlante",
  },
  topics: {
    eml: {
      title: "Il calcolo EML",
      tagline: "Un operatore costruisce (quasi) ogni funzione elementare",
      body:
        "Prendi eml(x, y) = eˣ − ln y. Annidalo in sé stesso a sufficienza, con il numero 1 come unica costante, e recuperi esponenziale, logaritmo, moltiplicazione, identità, perfino seno e coseno. Un articolo del 2026 lo formalizza e mostra dove il calcolo finisce per spezzarsi.",
    },
    nand: {
      title: "Il tratto di Sheffer",
      tagline: "Una sola porta basta per tutta la logica digitale",
      body:
        "La porta NAND (a ↑ b = ¬(a ∧ b)) è funzionalmente completa da sola: ogni espressione booleana — AND, OR, NOT, XOR, tutto — si costruisce con soli NAND. Per questo interi chip sono realizzati fisicamente come un mare di NAND. È l'EML dell'elettronica, fissato da Henry Sheffer negli anni 1910.",
    },
    iota: {
      title: "Il combinatore Iota",
      tagline: "Un simbolo e, con esso, completezza di Turing",
      body:
        "Iota (℩) è un singolo combinatore definito da ℩x = xSK. Con sole Iota e parentesi si ricavano S e K, e da S e K si codifica ogni funzione calcolabile. Un intero linguaggio abita in un solo simbolo — il cugino spirituale di EML, ma per il calcolo stesso.",
    },
    life: {
      title: "Il gioco della vita di Conway",
      tagline: "Quattro regole. Navi, fabbriche, computer.",
      body:
        "Una cellula su una griglia nasce con esattamente tre vicine vive, sopravvive con due o tre, muore altrimenti. Da quelle quattro righe nascono alianti, cannoni di alianti, oscillatori, replicatori — e una macchina di Turing pienamente funzionante. È stato costruito il gioco della vita dentro al gioco della vita.",
    },
    rule110: {
      title: "Regola 110",
      tagline: "Una regola a otto bit, dimostrata universale",
      body:
        "Ogni cellula guarda sé stessa e le due vicine e si aggiorna secondo la regola numerata 110 in binario (01101110). Il motivo che cresce da un singolo punto codifica calcoli — Cook e Wolfram hanno dimostrato che questa sola regola è Turing-completa. La più semplice macchina universale nota, che entra in un tweet.",
    },
    logistic: {
      title: "La mappa logistica",
      tagline: "Una formula innocua dove l'ordine scivola nel caos",
      body:
        "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) aumentando r. Il punto fisso si scinde in un ciclo 2, poi 4, poi 8 — una cascata di raddoppi che finisce in caos pieno intorno a r ≈ 3,5699. Dentro quella cascata si nasconde la costante di Feigenbaum 4,6692…, lo stesso numero che governa sistemi caotici scorrelati nella fisica.",
    },
    mandelbrot: {
      title: "L'insieme di Mandelbrot",
      tagline: "Eleva al quadrato e somma. All'infinito.",
      body:
        "Per ogni numero complesso c, itera zₙ₊₁ = zₙ² + c partendo da 0 e chiediti se la successione resta limitata. La macchia nera dei punti che ci riescono è l'insieme di Mandelbrot — uno degli oggetti più intricati mai disegnati. Zooma in qualunque punto del suo bordo: la struttura non si semplifica mai.",
    },
    lorenz: {
      title: "L'attrattore di Lorenz",
      tagline: "Tre righe di codice, una farfalla",
      body:
        "Tre equazioni differenziali accoppiate che modellano una fetta di atmosfera. Tracciata nello spazio, la traiettoria si avvolge attorno a due centri in una forma esattamente a farfalla — la firma visiva della teoria del caos e origine dell'« effetto farfalla ».",
    },
    fourier: {
      title: "La trasformata di Fourier",
      tagline: "Ogni segnale è una somma di onde sinusoidali",
      body:
        "Ogni funzione ragionevole del tempo si decompone in una somma (eventualmente infinita) di seni e coseni puri, ciascuno con la propria frequenza e ampiezza. Questo unico fatto è il motivo per cui MP3, JPEG, le risonanze magnetiche, il tuo Wi-Fi e quasi ogni strumento audio moderno funzionano. Suono, immagine, segnale — tutti in segreto onde su onde.",
    },
    euler: {
      title: "L'identità di Eulero",
      tagline: "I cinque numeri più importanti, in una riga",
      body:
        "eⁱᵖⁱ + 1 = 0. Il numero e dalla crescita, π dai cerchi, i dall'immaginario, più 0 e 1 — tutti legati da una sola uguaglianza. La maggior parte dei matematici la elegge formula più bella che conoscano; la dimostrazione è due righe di analisi e un balzo di identificazione.",
    },
    banach: {
      title: "Il paradosso di Banach–Tarski",
      tagline: "Taglia una palla, ottienine due della stessa misura",
      body:
        "Usando l'assioma della scelta puoi decomporre una palla solida nello spazio tridimensionale in un numero finito di pezzi e riassemblarli — senza stirare né deformare — in due palle solide identiche all'originale. È rigorosamente dimostrato e impossibile con qualsiasi cosa fisica. I « pezzi » non sono insiemi misurabili; lì abita la stranezza.",
    },
  },
};

const pt: AtlasDict = {
  landing: {
    pretitle: "Um atlas de curiosidades matemáticas",
    title1: "De um",
    title2: "tudo",
    subtitle: "Onze ideias em que uma única regra se desdobra num universo.",
    intro1:
      "Cada sala começa com quase nada — um operador, uma regra, uma equação — e caminha até a imagem ficar densa. Algumas salas estão totalmente montadas e podes girar os botões; outras ainda estão a ser mobiladas e por agora oferecem apenas a explicação.",
    intro2:
      "Carrega num azulejo para entrar. Dois minutos a ler, dez a brincar. Nenhum é truque. São os pequenos enunciados aos quais os matemáticos voltam sempre, postos à mostra para que os vejas.",
    browseLabel: "Percorrer o atlas",
    statusInteractive: "Interativo",
    statusStub: "Em desenvolvimento",
    categoryLogic: "Lógica",
    categoryComputation: "Computação",
    categoryChaos: "Caos",
    categoryGeometry: "Geometria",
    categoryAnalysis: "Análise",
    categoryParadox: "Paradoxo",
    enterTopic: "Entrar →",
    inDevelopment: "A sala interativa ainda está a ser construída. Abaixo está a ideia mesma, em linguagem simples.",
    authoredByPrefix: "Curado por",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Curado por Simon Franzen · zauberware technologies" },
  comingSoon: {
    title: "Em breve",
    body: "Uma sala interativa para esta curiosidade está em preparação. O texto seguinte é a ideia em linguagem simples — correta, mas ainda não jogável.",
    back: "← Voltar ao atlas",
  },
  topics: {
    eml: {
      title: "O cálculo EML",
      tagline: "Um operador constrói (quase) toda função elementar",
      body:
        "Toma eml(x, y) = eˣ − ln y. Aninha-o em si mesmo o suficiente, com o número 1 como única constante, e recuperas exponencial, logaritmo, multiplicação, identidade, até seno e cosseno. Um artigo de 2026 o expõe formalmente e mostra onde o cálculo acaba por se partir.",
    },
    nand: {
      title: "O traço de Sheffer",
      tagline: "Uma só porta basta para toda a lógica digital",
      body:
        "A porta NAND (a ↑ b = ¬(a ∧ b)) é por si só funcionalmente completa: toda expressão booleana — AND, OR, NOT, XOR, tudo — constrói-se só com NANDs. Por isso chips inteiros são realizados fisicamente como um mar de NANDs. É o EML da eletrónica, estabelecido por Henry Sheffer nos anos 1910.",
    },
    iota: {
      title: "O combinador Iota",
      tagline: "Um símbolo e, com ele, completude de Turing",
      body:
        "Iota (℩) é um único combinador definido por ℩x = xSK. Com apenas Iota e parênteses recuperas S e K, e a partir de S e K codificas qualquer função computável. Uma linguagem inteira mora num só símbolo — o primo espiritual de EML, mas para a computação em si.",
    },
    life: {
      title: "O jogo da vida de Conway",
      tagline: "Quatro regras. Naves, fábricas, computadores.",
      body:
        "Uma célula numa grelha nasce se tiver exatamente três vizinhas vivas, sobrevive com duas ou três, morre caso contrário. Dessas quatro linhas nascem planadores, canhões de planadores, osciladores, replicadores — e uma máquina de Turing em pleno funcionamento. Já se construiu o jogo da vida dentro do jogo da vida.",
    },
    rule110: {
      title: "Regra 110",
      tagline: "Uma regra de oito bits, comprovadamente universal",
      body:
        "Cada célula olha para si e para as duas vizinhas e atualiza-se pela regra numerada 110 em binário (01101110). O padrão que cresce a partir de um único ponto codifica computações — Cook e Wolfram provaram que esta regra única é Turing-completa. A máquina universal mais simples conhecida, cabe num tweet.",
    },
    logistic: {
      title: "O mapa logístico",
      tagline: "Uma fórmula inofensiva onde a ordem cai no caos",
      body:
        "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) e aumenta r. O ponto fixo divide-se num ciclo 2, depois 4, depois 8 — uma cascata de duplicações que termina em caos pleno em torno de r ≈ 3,5699. Dentro dessa cascata esconde-se a constante de Feigenbaum 4,6692…, o mesmo número que rege sistemas caóticos sem relação na física.",
    },
    mandelbrot: {
      title: "O conjunto de Mandelbrot",
      tagline: "Eleva ao quadrado e soma. Para sempre.",
      body:
        "Para cada número complexo c, itera zₙ₊₁ = zₙ² + c começando em 0 e pergunta se a sucessão fica limitada. A mancha negra dos pontos que ficam é o conjunto de Mandelbrot — um dos objetos mais intrincados já desenhados. Faz zoom em qualquer ponto do seu bordo: a estrutura nunca simplifica.",
    },
    lorenz: {
      title: "O atrator de Lorenz",
      tagline: "Três linhas de código, uma borboleta",
      body:
        "Três equações diferenciais acopladas a modelar uma fatia de atmosfera. Traçada no espaço, a trajetória enrola-se em torno de dois centros numa forma exatamente de borboleta — a assinatura visual da teoria do caos e origem da expressão « efeito borboleta ».",
    },
    fourier: {
      title: "A transformada de Fourier",
      tagline: "Todo sinal é uma soma de ondas senoidais",
      body:
        "Qualquer função razoável do tempo decompõe-se numa soma (possivelmente infinita) de senos e cossenos puros, cada um com a sua frequência e amplitude. Este único facto explica por que o MP3, o JPEG, os scanners de ressonância, o teu Wi-Fi e quase toda ferramenta moderna de áudio funcionam. Som, imagem, sinal — todos em segredo ondas sobre ondas.",
    },
    euler: {
      title: "A identidade de Euler",
      tagline: "Os cinco números mais importantes, numa linha",
      body:
        "eⁱᵖⁱ + 1 = 0. O número e do crescimento, π dos círculos, i do imaginário, mais 0 e 1 — todos amarrados por uma única igualdade. A maioria dos matemáticos elege-a a fórmula mais bela que conhece; a prova são duas linhas de análise e um salto de identificação.",
    },
    banach: {
      title: "O paradoxo de Banach–Tarski",
      tagline: "Corta uma bola e obténs duas do mesmo tamanho",
      body:
        "Usando o axioma da escolha podes decompor uma bola sólida no espaço tridimensional num número finito de peças e remontá-las — sem esticar nem deformar — em duas bolas sólidas idênticas à original. É rigorosamente demonstrado e impossível com qualquer coisa física. As « peças » não são conjuntos mensuráveis; é aí que vive a estranheza.",
    },
  },
};

const sv: AtlasDict = {
  landing: {
    pretitle: "En atlas över matematiska kuriosa",
    title1: "Från ett",
    title2: "allt",
    subtitle: "Elva idéer där en enda regel viker ut sig till ett universum.",
    intro1:
      "Varje rum börjar med nästan ingenting — en operator, en regel, en ekvation — och går tills bilden är tät. Vissa rum är helt utbyggda och du får vrida på rattarna; andra möbleras fortfarande och erbjuder för stunden bara förklaringen.",
    intro2:
      "Klicka på en bricka för att gå in. Två minuters läsning, tio minuters lek. Inget är ett trick. Det är de små utsagor som matematiker återkommer till, framlagda så att du ser dem.",
    browseLabel: "Botanisera i atlasen",
    statusInteractive: "Interaktiv",
    statusStub: "Under utveckling",
    categoryLogic: "Logik",
    categoryComputation: "Beräkning",
    categoryChaos: "Kaos",
    categoryGeometry: "Geometri",
    categoryAnalysis: "Analys",
    categoryParadox: "Paradox",
    enterTopic: "Gå in →",
    inDevelopment: "Det interaktiva rummet håller på att byggas. Här nedan står själva idén, i enkel form.",
    authoredByPrefix: "Kurerat av",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Kurerat av Simon Franzen · zauberware technologies" },
  comingSoon: {
    title: "Kommer snart",
    body: "Ett interaktivt rum för denna kuriositet är under arbete. Texten nedan är idén i enkelt språk — korrekt, men ännu inte spelbar.",
    back: "← Tillbaka till atlasen",
  },
  topics: {
    eml: {
      title: "EML-kalkylen",
      tagline: "En operator bygger (nästan) varje elementär funktion",
      body:
        "Ta eml(x, y) = eˣ − ln y. Nästla den i sig själv tillräckligt många gånger, med talet 1 som enda konstant, och du får tillbaka exponentialfunktion, logaritm, multiplikation, identitet, till och med sinus och cosinus. En artikel från 2026 lägger fram det formellt och visar var kalkylen till sist brister.",
    },
    nand: {
      title: "Sheffer-strecket",
      tagline: "En enda grind räcker för all digital logik",
      body:
        "NAND-grinden (a ↑ b = ¬(a ∧ b)) är funktionellt fullständig i sig själv: varje booleskt uttryck — AND, OR, NOT, XOR, alltihop — kan byggas av enbart NAND. Det är därför hela chip fysiskt realiseras som ett hav av NAND-grindar. Det är elektronikens EML, fastslaget av Henry Sheffer på 1910-talet.",
    },
    iota: {
      title: "Iota-kombinatorn",
      tagline: "En symbol, och med den Turing-fullständighet",
      body:
        "Iota (℩) är en enda kombinator definierad som ℩x = xSK. Med bara Iota och parenteser kan du återskapa S och K, och från S och K koda varje beräkningsbar funktion. Ett helt programmeringsspråk bor i en enda symbol — EML:s andliga släkting, fast för själva räknandet.",
    },
    life: {
      title: "Conways Game of Life",
      tagline: "Fyra regler. Rymdskepp, fabriker, datorer.",
      body:
        "En cell på ett rutnät föds om den har exakt tre levande grannar, överlever med två eller tre, dör annars. Ur dessa fyra rader växer glidare, glidarkanoner, oscillatorer, replikatorer — och en fullt fungerande Turing-maskin. Man har byggt Game of Life inuti Game of Life.",
    },
    rule110: {
      title: "Regel 110",
      tagline: "En åttabitsregel, bevisat universell",
      body:
        "Varje cell tittar på sig själv och sina två grannar och uppdateras enligt regeln med binärnumret 110 (01101110). Mönstret som växer ur en enda punkt kodar beräkningar — Cook och Wolfram bevisade att denna enda regel är Turing-fullständig. Den enklaste kända universella maskinen, som ryms i en tweet.",
    },
    logistic: {
      title: "Den logistiska avbildningen",
      tagline: "En oskyldig formel där ordningen tippar över i kaos",
      body:
        "Itera xₙ₊₁ = r · xₙ · (1 − xₙ) och öka r. Fixpunkten delas i en 2-cykel, sedan 4, sedan 8 — en kaskad av fördubblingar som mynnar i fullt kaos kring r ≈ 3,5699. Inuti kaskaden gömmer sig Feigenbaums konstant 4,6692…, samma tal som styr orelaterade kaotiska system i fysiken.",
    },
    mandelbrot: {
      title: "Mandelbrotmängden",
      tagline: "Kvadrera och addera. För evigt.",
      body:
        "För varje komplext tal c, itera zₙ₊₁ = zₙ² + c med start i 0 och fråga om följden förblir begränsad. Den svarta klumpen av punkter där så sker är Mandelbrotmängden — ett av de mest invecklade objekt som någonsin ritats. Zooma var som helst längs randen, strukturen blir aldrig enklare.",
    },
    lorenz: {
      title: "Lorenzattraktorn",
      tagline: "Tre rader kod, en fjäril",
      body:
        "Tre kopplade differentialekvationer som modellerar en bit av atmosfären. Ritad i rummet slingrar sig banan kring två centra i en form som är exakt en fjäril — kaosteorins visuella signatur och ursprunget till uttrycket « fjärilseffekten ».",
    },
    fourier: {
      title: "Fouriertransformen",
      tagline: "Varje signal är en summa av sinusvågor",
      body:
        "Varje rimlig tidsfunktion kan delas upp i en (möjligen oändlig) summa av rena sinus- och cosinusvågor, var och en med sin frekvens och amplitud. Detta enda faktum förklarar varför MP3, JPEG, magnetröntgen, ditt Wi-Fi och nästan varje modernt ljudverktyg fungerar. Ljud, bild, signal — alla i hemlighet vågor på vågor.",
    },
    euler: {
      title: "Eulers identitet",
      tagline: "De fem viktigaste talen, på en rad",
      body:
        "eⁱᵖⁱ + 1 = 0. Talet e från tillväxten, π från cirkeln, i från det imaginära, plus 0 och 1 — alla bundna i en enda likhet. De flesta matematiker röstar fram den som den vackraste formeln; beviset är två rader analys och ett identifikationssprång.",
    },
    banach: {
      title: "Banach–Tarskis paradox",
      tagline: "Skär en boll, få två lika stora",
      body:
        "Med urvalsaxiomet kan du dela en solid boll i tredimensionellt rum i ändligt många bitar och sätta ihop dem — utan att tänja eller deformera — till två solida bollar identiska med originalet. Det är strängt bevisat och omöjligt med något fysiskt. « Bitarna » är inte mätbara mängder; där bor det märkliga.",
    },
  },
};

const no: AtlasDict = {
  landing: {
    pretitle: "Et atlas over matematiske kuriositeter",
    title1: "Fra én",
    title2: "alt",
    subtitle: "Elleve idéer der en eneste regel folder seg ut til et univers.",
    intro1:
      "Hvert rom starter med nesten ingenting — én operator, én regel, én likning — og går til bildet er tett. Noen rom er ferdig bygd og du får vri på knappene; andre er fortsatt under møblering og tilbyr foreløpig bare forklaringen.",
    intro2:
      "Klikk på en flis for å gå inn. To minutter lesing, ti minutter lek. Ingen er triks. Det er de små utsagnene matematikere alltid vender tilbake til, satt frem så du ser dem.",
    browseLabel: "Bla i atlaset",
    statusInteractive: "Interaktiv",
    statusStub: "Under utvikling",
    categoryLogic: "Logikk",
    categoryComputation: "Beregning",
    categoryChaos: "Kaos",
    categoryGeometry: "Geometri",
    categoryAnalysis: "Analyse",
    categoryParadox: "Paradoks",
    enterTopic: "Gå inn →",
    inDevelopment: "Det interaktive rommet bygges fortsatt. Under finner du selve idéen, i enkelt språk.",
    authoredByPrefix: "Kuratert av",
    authoredByName: "Simon Franzen",
    authoredByOrg: "zauberware technologies",
  },
  nav: { atlas: "Atlas" },
  footer: { author: "Kuratert av Simon Franzen · zauberware technologies" },
  comingSoon: {
    title: "Kommer snart",
    body: "Et interaktivt rom for denne kuriositeten er under arbeid. Teksten nedenfor er idéen i enkelt språk — korrekt, men ennå ikke spillbar.",
    back: "← Tilbake til atlaset",
  },
  topics: {
    eml: {
      title: "EML-kalkylen",
      tagline: "Én operator bygger (nesten) hver elementær funksjon",
      body:
        "Ta eml(x, y) = eˣ − ln y. Nøst den i seg selv ofte nok, med tallet 1 som eneste konstant, og du får tilbake eksponentialfunksjon, logaritme, multiplikasjon, identitet, til og med sinus og cosinus. En artikkel fra 2026 fremlegger det formelt og viser hvor kalkylen til slutt brister.",
    },
    nand: {
      title: "Sheffer-streken",
      tagline: "Én port er nok for all digital logikk",
      body:
        "NAND-porten (a ↑ b = ¬(a ∧ b)) er funksjonelt fullstendig alene: ethvert boolsk uttrykk — AND, OR, NOT, XOR, alt — kan bygges utelukkende av NAND. Det er derfor hele brikker fysisk realiseres som et hav av NAND-porter. Det er elektronikkens EML, slått fast av Henry Sheffer på 1910-tallet.",
    },
    iota: {
      title: "Iota-kombinatoren",
      tagline: "Ett symbol, og med det Turing-fullstendighet",
      body:
        "Iota (℩) er én enkelt kombinator definert ved ℩x = xSK. Med kun Iota og parenteser gjenfinner du S og K, og fra S og K koder du enhver beregnelig funksjon. Et helt programmerings­språk bor i ett symbol — EMLs åndelige slektning, men for selve regningen.",
    },
    life: {
      title: "Conways Game of Life",
      tagline: "Fire regler. Romskip, fabrikker, datamaskiner.",
      body:
        "En celle på et rutenett fødes med nøyaktig tre levende naboer, overlever med to eller tre, dør ellers. Av disse fire linjene vokser glidere, glider­kanoner, oscillatorer, replikatorer — og en fullt fungerende Turing-maskin. Man har bygget Game of Life inni Game of Life.",
    },
    rule110: {
      title: "Regel 110",
      tagline: "En åttebitsregel, bevist universell",
      body:
        "Hver celle ser på seg selv og sine to naboer og oppdateres etter regelen med binærnummeret 110 (01101110). Mønsteret som vokser fra ett enkelt punkt koder beregninger — Cook og Wolfram beviste at denne ene regelen er Turing-fullstendig. Den enkleste kjente universelle maskinen, som får plass i en tweet.",
    },
    logistic: {
      title: "Den logistiske avbildningen",
      tagline: "En harmløs formel der orden kollapser i kaos",
      body:
        "Iterér xₙ₊₁ = r · xₙ · (1 − xₙ) og øk r. Fastpunktet splittes i en 2-syklus, så 4, så 8 — en kaskade av doblinger som ender i fullt kaos rundt r ≈ 3,5699. I kaskaden gjemmer Feigenbaum-konstanten 4,6692… seg, det samme tallet som styrer urelaterte kaotiske systemer i fysikken.",
    },
    mandelbrot: {
      title: "Mandelbrotmengden",
      tagline: "Kvadrér og legg til. For alltid.",
      body:
        "For hvert komplekst tall c, iterér zₙ₊₁ = zₙ² + c med start i 0 og spør om følgen forblir begrenset. Den svarte klumpen av punkter der det skjer er Mandelbrotmengden — et av de mest sammenvevde objektene som er tegnet. Zoom hvor som helst på kanten; strukturen blir aldri enklere.",
    },
    lorenz: {
      title: "Lorenz-attraktoren",
      tagline: "Tre linjer kode, én sommerfugl",
      body:
        "Tre koblede differensiallikninger som modellerer en skive av atmosfæren. Tegnet i rommet snor banen seg rundt to sentre i en form som er nøyaktig en sommerfugl — kaosteoriens visuelle signatur og opphav til « sommerfugleffekten ».",
    },
    fourier: {
      title: "Fouriertransformasjonen",
      tagline: "Hvert signal er en sum av sinusbølger",
      body:
        "Enhver rimelig tidsfunksjon kan dekomponeres i en (eventuelt uendelig) sum av rene sinus- og cosinusbølger, hver med sin frekvens og amplitude. Dette ene faktumet forklarer hvorfor MP3, JPEG, MR-skannere, Wi-Fi-en din og nær sagt ethvert moderne lydverktøy fungerer. Lyd, bilde, signal — alle i det skjulte bølger på bølger.",
    },
    euler: {
      title: "Eulers identitet",
      tagline: "De fem viktigste tallene, på én linje",
      body:
        "eⁱᵖⁱ + 1 = 0. Tallet e fra veksten, π fra sirkelen, i fra det imaginære, pluss 0 og 1 — alle bundet i én likhet. De fleste matematikere stemmer den frem som den vakreste formelen de kjenner; beviset er to linjer analyse og et identifiseringssprang.",
    },
    banach: {
      title: "Banach–Tarski-paradokset",
      tagline: "Del en kule, sitt igjen med to like store",
      body:
        "Med utvalgsaksiomet kan du dekomponere en solid kule i tredimensjonalt rom i et endelig antall biter og sette dem sammen igjen — uten å strekke eller forvrenge — til to solide kuler identiske med originalen. Det er strengt bevist og umulig med noe fysisk. « Bitene » er ikke målbare mengder; der bor det merkelige.",
    },
  },
};

export const ATLAS: Record<Locale, AtlasDict> = { en, de, es, fr, it, pt, sv, no };
