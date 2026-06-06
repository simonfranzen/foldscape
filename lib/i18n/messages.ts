// All UI copy in 8 languages. Math identifiers (z, p, eml, eˣ, ln) are
// preserved unchanged across locales — they are notation, not words. Body
// prose is kept tight so the translations stay maintainable.

import type { Locale } from "./types";

export type Dict = {
  nav: { cathedral: string; atelier: string; resonance: string; imprint: string; language: string };
  footer: { paper: string; github: string; imprint: string; builtBy: string; copyright: string };
  hero: {
    paperPill: string;
    title1: string;
    title2: string;
    title3: string;
    byAuthor: string;
    paperLink: string;
    p1: string;
    p2: string;
    scroll: string;
  };
  encounter: {
    pretitle: string;
    title: string;
    legoTitle: string;
    legoBody: string;
    exampleTitle: string;
    exampleBody: string;
    insightTitle: string;
    insightBody: string;
    tryIt: string;
  };
  prologue: {
    pretitle: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    nandTitle: string;
    emlTitle: string;
    nandNote: string;
    emlNote: string;
  };
  operator: {
    pretitle: string;
    title: string;
    p1: string;
    p2: string;
    examplesLabel: string;
    sideTitle: string;
  };
  reading: {
    pretitle: string;
    title: string;
    p1: string;
    rowHue: string;
    rowMag: string;
    rowZero: string;
    rowInf: string;
    rowGrid: string;
    closing: string;
  };
  stationTitles: Record<string, { pretitle: string; title: string }>;
  verifier: { pretitle: string; title: string; intro: string; labelRe: string; labelIm: string; legend: string };
  complexity: { pretitle: string; title: string; intro: string; headTarget: string; headK: string; headNote: string; note: string };
  limits: { pretitle: string; title: string; intro: string };
  garden: { pretitle: string; title: string; intro: string };
  closing: { pill: string; title: string; intro: string; ctaAtelier: string; ctaResonance: string; meta: string };
  imprint: {
    title: string;
    intro: string;
    company: string;
    address: string;
    register: string;
    management: string;
    contact: string;
    phone: string;
    email: string;
    responsibility: string;
    responsibilityBody: string;
    disclaimer: string;
    disclaimerBody: string;
  };
};

const en: Dict = {
  nav: { cathedral: "Cathedral", atelier: "Atelier", resonance: "Resonance", imprint: "Imprint", language: "Language" },
  footer: {
    paper: "Read the paper",
    github: "View on GitHub",
    imprint: "Imprint",
    builtBy: "A visual essay on EML by zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Cathedral",
    title2: "of",
    title3: "One",
    byAuthor: "after the paper by Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "One operator. One constant. The claim of the EML calculus is that almost every elementary function — sin, cos, eˣ, multiplication, square root — can be reconstructed by nesting one simple recipe with itself.",
    p2: "What follows is a slow scroll through that claim, rendered as complex domain coloring. Each station is the same operator, stacked one level deeper. By the end you will have seen, in pictures, why one stone can build a cathedral.",
    scroll: "scroll",
  },
  encounter: {
    pretitle: "First encounter · for everyone",
    title: "Imagine one LEGO brick that builds everything",
    legoTitle: "The big idea",
    legoBody:
      "A child's LEGO box has dozens of shapes — wheels, slopes, bricks, plates. The EML paper asks a strange question: what if you only had ONE shape, but could click it together in any pattern? Could you still build a castle? A house? A cathedral?",
    exampleTitle: "A concrete example",
    exampleBody:
      "The single shape is called eml(x, y). It eats two numbers and returns one. The recipe is: take e to the power of the first, subtract the natural log of the second. That is the whole brick. Plug in eml(2, 1) and you get e² ≈ 7.389 — the right side falls silent because ln 1 = 0. Plug in eml(0, 1) and you get 1. The brick is small and asymmetric on purpose.",
    insightTitle: "Why it matters",
    insightBody:
      "The amazing claim of the paper is that by snapping copies of this single brick together — eml inside eml inside eml — you can recover almost every function from a scientific calculator. Sine, cosine, multiplication, the logarithm itself. The pictures below are not decoration. They are the brick, snapped together in different ways. The patterns are what one stone, repeated, looks like.",
    tryIt: "Scroll down to see it built up, one step at a time.",
  },
  prologue: {
    pretitle: "Prologue · Universal Primitives",
    title: "The shape of a universality claim",
    p1: "In digital logic, a single gate is enough. NAND is universal — any circuit, no matter how complex, can be built from copies of it. The result is one of the lasting facts of computer science: complexity is not in the parts, it is in the wiring.",
    p2: "The EML paper asks the same question of continuous mathematics. Is there an operator so plastic that, by nesting it with a single constant, you can reach eˣ, addition, multiplication, square root, sine, cosine — the whole cabinet of elementary functions?",
    p3: "Its candidate is eml(x, y) = eˣ − ln y. The constant kept is 1.",
    nandTitle: "Boolean analogue · NAND",
    emlTitle: "Continuous analogue · EML",
    nandNote: "Functionally complete. Every Boolean circuit reduces to NANDs.",
    emlNote: "Same trick — different alphabet.",
  },
  operator: {
    pretitle: "The Operator",
    title: "What eml actually does",
    p1: "Two inputs. Two operations. One subtraction. Take e to the power of the left input. Take the natural log of the right input. Subtract. The first half is explosive: small numbers rocket upward. The second half is patient: even astronomical inputs compress into something quiet.",
    p2: "The asymmetry is the point. Symmetric primitives can only produce symmetric structures. eml is lopsided by design — and putting an exponential and a logarithm on opposite sides of one minus sign turns the operator into a seesaw that, when stacked, can lean in any direction.",
    examplesLabel: "Worked examples",
    sideTitle: "The operator",
  },
  reading: {
    pretitle: "Reading the picture · Domain Coloring",
    title: "Every pixel is a complex output",
    p1: "The images are not decoration. Each one is the same recipe: the screen is the complex plane (real horizontal, imaginary vertical); the EML tree is evaluated at every pixel; the resulting complex number w picks a colour.",
    rowHue: "chooses the hue. A full rotation around zero cycles the palette once.",
    rowMag: "sets the brightness. Doubling the magnitude crosses one bright ring.",
    rowZero: "falls into ink — the field has a zero.",
    rowInf: "burns to white — there is a pole.",
    rowGrid: "marks integer real and imaginary values, so you can read positions off the field.",
    closing:
      "The disc to the left is the simplest possible specimen: w = z itself. Every later image is a deformation of this disc by an EML tree.",
  },
  stationTitles: {
    exp: { pretitle: "Station I — Exponential", title: "Feed one to the right slot" },
    ln: { pretitle: "Station II — Logarithm", title: "Three EMLs braid into ln" },
    id: { pretitle: "Station III — Identity", title: "Even doing nothing takes a tree" },
    selfdual: { pretitle: "Station IV — Self-dual", title: "The atom looks at itself" },
    twin: { pretitle: "Station V — Twin", title: "Exp and log fold into each other" },
    "param-vortex": { pretitle: "Station VI — Parametric Vortex", title: "A handle on the calculus" },
    cathedral: { pretitle: "Station VII — Cathedral", title: "Stacked rosette" },
    nebula: { pretitle: "Station VIII — Nebula", title: "Where the calculus overflows" },
  },
  verifier: {
    pretitle: "Interlude · Receipts",
    title: "The trees are not gestures.",
    intro:
      "They evaluate to the right number. Pick any z and the EML reconstruction of eˣ, ln, and identity return — within floating-point error — what the classical functions do.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "error < 10⁻⁶ · error < 10⁻³ · branch cut or overflow",
  },
  complexity: {
    pretitle: "Table IV · Complexity",
    title: "How big are the trees, really?",
    intro:
      "The paper measures each reconstruction in RPN tokens — the postfix length of the EML tree. The pattern: cheap things stay cheap, expensive things become unreasonable.",
    headTarget: "target",
    headK: "K (RPN length)",
    headNote: "note",
    note:
      "Read the jumps. From eˣ (K = 3) to identity (K = 9) takes a tripling. From identity to multiplication takes nearly five times that. The calculus reaches everywhere — but not always cheaply.",
  },
  limits: {
    pretitle: "Caveats · What it cannot do",
    title: "A cathedral with cracks",
    intro:
      "The paper does not claim total universality. A 2026 reply by Stylewarning showed counterexamples — elementary functions that no nesting of EML can recover exactly. The 'almost' in the claim is doing work.",
  },
  garden: {
    pretitle: "Garden · The Catalog",
    title: "Eight trees, eight worlds",
    intro:
      "Every tile is the same operator. The variation is structural: different nesting patterns push the complex plane into different geometries. The palettes shift to keep the eye honest.",
  },
  closing: {
    pill: "Exit Station",
    title: "The cathedral was built from one stone.",
    intro:
      "What remains is the statement itself, glowing faintly behind the math: that nesting a single primitive is enough to see the rest. The pictures are the side effect — the actual argument is the trees.",
    ctaAtelier: "→ Enter the Atelier · build your own",
    ctaResonance: "→ Hear the Resonance · play it",
    meta: "built on arxiv 2603.21852 · domain coloring in webgl2 · all images rendered live from the same six-line shader",
  },
  imprint: {
    title: "Imprint",
    intro: "Information in accordance with § 5 TMG.",
    company: "Company",
    address: "Address",
    register: "Commercial Register",
    management: "Management",
    contact: "Contact",
    phone: "Phone",
    email: "Email",
    responsibility: "Responsible for content (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, address as above.",
    disclaimer: "Disclaimer",
    disclaimerBody:
      "All texts and pictures on this site are presented as a non-commercial visual essay. The paper cited remains the work of its author; the source code is published under an open licence (see the repository link). External links open in a new window — we assume no responsibility for the content of third-party sites.",
  },
};

const de: Dict = {
  nav: { cathedral: "Kathedrale", atelier: "Atelier", resonance: "Resonanz", imprint: "Impressum", language: "Sprache" },
  footer: {
    paper: "Paper lesen",
    github: "Auf GitHub ansehen",
    imprint: "Impressum",
    builtBy: "Ein visueller Essay über EML von zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Kathedrale",
    title2: "aus",
    title3: "Einem",
    byAuthor: "nach dem Paper von Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "Ein Operator. Eine Konstante. Die Behauptung des EML-Kalküls: nahezu jede elementare Funktion — Sinus, Cosinus, eˣ, Multiplikation, Wurzel — lässt sich konstruieren, indem man ein einziges, einfaches Rezept beliebig oft ineinander schachtelt.",
    p2: "Was folgt, ist ein langsamer Scroll durch genau diese Behauptung, gerendert als komplexe Domain-Coloring. Jede Station zeigt denselben Operator, eine Ebene tiefer gestapelt. Am Ende werden Sie in Bildern gesehen haben, warum aus einem Stein eine ganze Kathedrale werden kann.",
    scroll: "scrollen",
  },
  encounter: {
    pretitle: "Erste Begegnung · für alle",
    title: "Stell dir einen einzigen LEGO-Stein vor, aus dem alles entsteht",
    legoTitle: "Die große Idee",
    legoBody:
      "Eine LEGO-Kiste hat Dutzende von Formen — Räder, Schrägen, Steine, Platten. Das EML-Paper stellt eine seltsame Frage: Was wäre, wenn du nur EINE Form hättest, sie aber in beliebigen Mustern aneinander stecken könntest? Könntest du trotzdem ein Schloss bauen? Ein Haus? Eine Kathedrale?",
    exampleTitle: "Ein konkretes Beispiel",
    exampleBody:
      "Diese eine Form heißt eml(x, y). Sie nimmt zwei Zahlen und gibt eine zurück. Das Rezept: e hoch der ersten, minus den natürlichen Logarithmus der zweiten. Das ist der ganze Stein. Setze eml(2, 1) ein und du bekommst e² ≈ 7,389 — die rechte Seite verschwindet, weil ln 1 = 0. Setze eml(0, 1) ein und du bekommst 1. Der Stein ist absichtlich klein und unsymmetrisch.",
    insightTitle: "Warum das wichtig ist",
    insightBody:
      "Die erstaunliche Behauptung des Papers: Indem du Kopien dieses einen Steins zusammensteckst — eml in eml in eml — kannst du fast jede Funktion eines wissenschaftlichen Taschenrechners rekonstruieren. Sinus, Cosinus, Multiplikation, sogar den Logarithmus selbst. Die Bilder unten sind keine Dekoration. Sie sind dieser Stein, in verschiedenen Anordnungen. Die Muster sind, wie ein einziger Stein aussieht, wenn man ihn oft genug wiederholt.",
    tryIt: "Scrolle weiter und beobachte, wie es Schritt für Schritt aufgebaut wird.",
  },
  prologue: {
    pretitle: "Prolog · Universelle Bausteine",
    title: "Wie eine Universalitäts-Behauptung aussieht",
    p1: "In der digitalen Logik genügt ein einziges Gatter. NAND ist universell — jede noch so komplexe Schaltung lässt sich aus Kopien von NAND aufbauen. Das ist eine der bleibenden Erkenntnisse der Informatik: Komplexität liegt nicht in den Teilen, sondern in der Verdrahtung.",
    p2: "Das EML-Paper stellt dieselbe Frage an die kontinuierliche Mathematik. Gibt es einen Operator, der so wandelbar ist, dass man durch Schachteln mit einer einzigen Konstante eˣ, Addition, Multiplikation, Wurzel, Sinus, Cosinus erreichen kann — das ganze Sortiment elementarer Funktionen?",
    p3: "Sein Vorschlag ist eml(x, y) = eˣ − ln y. Die einzige zugelassene Konstante: 1.",
    nandTitle: "Boolesches Analogon · NAND",
    emlTitle: "Kontinuierliches Analogon · EML",
    nandNote: "Funktional vollständig. Jede boolesche Schaltung lässt sich auf NANDs reduzieren.",
    emlNote: "Gleicher Trick — anderes Alphabet.",
  },
  operator: {
    pretitle: "Der Operator",
    title: "Was eml eigentlich macht",
    p1: "Zwei Eingänge. Zwei Operationen. Eine Subtraktion. Nimm e hoch den linken Eingang. Nimm den natürlichen Logarithmus des rechten. Ziehe ab. Die erste Hälfte ist explosiv: kleine Zahlen schießen nach oben. Die zweite Hälfte ist geduldig: selbst astronomische Eingaben werden zu etwas Stillem zusammengepresst.",
    p2: "Die Asymmetrie ist der Punkt. Symmetrische Bausteine erzeugen nur symmetrische Strukturen. eml ist mit Absicht schief — und wenn man Exponential und Logarithmus auf entgegengesetzte Seiten eines Minuszeichens stellt, wird der Operator zu einer Wippe, die sich gestapelt in jede Richtung neigen kann.",
    examplesLabel: "Konkrete Werte",
    sideTitle: "Der Operator",
  },
  reading: {
    pretitle: "Das Bild lesen · Domain Coloring",
    title: "Jedes Pixel ist ein komplexes Ergebnis",
    p1: "Die Bilder sind keine Dekoration. Jedes folgt demselben Rezept: der Bildschirm ist die komplexe Ebene (Realteil waagerecht, Imaginärteil senkrecht); der EML-Baum wird an jedem Pixel ausgewertet; die entstehende komplexe Zahl w wählt eine Farbe.",
    rowHue: "bestimmt den Farbton. Ein voller Umlauf um Null durchläuft die Palette einmal.",
    rowMag: "steuert die Helligkeit. Eine Verdoppelung des Betrags überschreitet einen hellen Ring.",
    rowZero: "fällt ins Tinten-Dunkel — das Feld hat eine Nullstelle.",
    rowInf: "brennt nach Weiß — dort liegt ein Pol.",
    rowGrid: "markiert ganzzahlige Real- und Imaginärwerte, damit du Positionen ablesen kannst.",
    closing:
      "Die Scheibe links ist das einfachste mögliche Exemplar: w = z selbst. Jedes spätere Bild ist eine Verformung dieser Scheibe durch einen EML-Baum.",
  },
  stationTitles: {
    exp: { pretitle: "Station I — Exponentialfunktion", title: "Eine Eins in den rechten Schlitz" },
    ln: { pretitle: "Station II — Logarithmus", title: "Drei EMLs flechten ln" },
    id: { pretitle: "Station III — Identität", title: "Selbst Nichtstun braucht einen Baum" },
    selfdual: { pretitle: "Station IV — Selbstdual", title: "Der Baustein blickt auf sich selbst" },
    twin: { pretitle: "Station V — Zwilling", title: "Exp und log falten sich ineinander" },
    "param-vortex": { pretitle: "Station VI — Parametrischer Strudel", title: "Ein Griff am Kalkül" },
    cathedral: { pretitle: "Station VII — Kathedrale", title: "Gestapelte Rosette" },
    nebula: { pretitle: "Station VIII — Nebel", title: "Wo der Kalkül überläuft" },
  },
  verifier: {
    pretitle: "Zwischenspiel · Belege",
    title: "Die Bäume sind keine Gesten.",
    intro:
      "Sie liefern die richtigen Zahlen. Wähle ein beliebiges z und beobachte: die EML-Rekonstruktionen von eˣ, ln und Identität geben — bis auf Gleitkommafehler — genau das zurück, was die klassischen Funktionen liefern.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "Fehler < 10⁻⁶ · Fehler < 10⁻³ · Astenschnitt oder Überlauf",
  },
  complexity: {
    pretitle: "Tabelle IV · Komplexität",
    title: "Wie groß sind die Bäume eigentlich?",
    intro:
      "Das Paper misst jede Rekonstruktion in RPN-Token — der Länge des EML-Baums in umgekehrt polnischer Notation. Das Muster: günstige Dinge bleiben günstig, teure werden unverhältnismäßig.",
    headTarget: "Ziel",
    headK: "K (RPN-Länge)",
    headNote: "Notiz",
    note:
      "Lies die Sprünge. Von eˣ (K = 3) zur Identität (K = 9) verdreifacht es sich. Von der Identität zur Multiplikation fast verfünffacht. Der Kalkül reicht überall hin — aber nicht überall billig.",
  },
  limits: {
    pretitle: "Vorbehalte · Was er nicht kann",
    title: "Eine Kathedrale mit Rissen",
    intro:
      "Das Paper beansprucht keine totale Universalität. Eine Antwort von 2026 von Stylewarning zeigte Gegenbeispiele — elementare Funktionen, die kein Schachteln von EML exakt reproduzieren kann. Das ‚fast‘ in der Aussage leistet echte Arbeit.",
  },
  garden: {
    pretitle: "Garten · Der Katalog",
    title: "Acht Bäume, acht Welten",
    intro:
      "Jede Kachel zeigt denselben Operator. Die Variation ist strukturell: unterschiedliche Schachtelungen pressen die komplexe Ebene in unterschiedliche Geometrien. Die Paletten wechseln, damit das Auge ehrlich bleibt.",
  },
  closing: {
    pill: "Ausgang",
    title: "Die Kathedrale wurde aus einem Stein gebaut.",
    intro:
      "Was bleibt, ist die Aussage selbst, die hinter der Mathematik leise leuchtet: dass ein einziger geschachtelter Baustein genügt, um den Rest zu sehen. Die Bilder sind das Nebenprodukt — das eigentliche Argument sind die Bäume.",
    ctaAtelier: "→ Ins Atelier · selbst bauen",
    ctaResonance: "→ In die Resonanz · spielen",
    meta:
      "auf Basis von arxiv 2603.21852 · Domain Coloring in WebGL2 · alle Bilder live aus demselben sechs-Zeilen-Shader",
  },
  imprint: {
    title: "Impressum",
    intro: "Angaben gemäß § 5 TMG.",
    company: "Unternehmen",
    address: "Anschrift",
    register: "Handelsregister",
    management: "Vertretungsberechtigte",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-Mail",
    responsibility: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)",
    responsibilityBody: "Simon Franzen, Anschrift wie oben.",
    disclaimer: "Haftungshinweis",
    disclaimerBody:
      "Sämtliche Texte und Bilder auf dieser Seite sind als nicht-kommerzieller visueller Essay zu verstehen. Das zitierte Paper bleibt Werk seines Autors; der Quellcode steht unter einer offenen Lizenz (siehe Repository-Link). Externe Links öffnen in einem neuen Fenster — für die Inhalte fremder Seiten übernehmen wir keine Verantwortung.",
  },
};

const es: Dict = {
  nav: { cathedral: "Catedral", atelier: "Taller", resonance: "Resonancia", imprint: "Aviso legal", language: "Idioma" },
  footer: {
    paper: "Leer el artículo",
    github: "Ver en GitHub",
    imprint: "Aviso legal",
    builtBy: "Un ensayo visual sobre EML por zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Catedral",
    title2: "de",
    title3: "Uno",
    byAuthor: "a partir del artículo de Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "Un operador. Una constante. La afirmación del cálculo EML es que casi cualquier función elemental — seno, coseno, eˣ, multiplicación, raíz cuadrada — puede reconstruirse anidando una sola receta consigo misma.",
    p2: "Lo que sigue es un desplazamiento lento por esa idea, representado como coloreado de dominio complejo. Cada estación es el mismo operador, una capa más profunda. Al final habrás visto, en imágenes, por qué una sola piedra basta para una catedral.",
    scroll: "desplaza",
  },
  encounter: {
    pretitle: "Primer encuentro · para todos",
    title: "Imagina una sola pieza de LEGO que lo construye todo",
    legoTitle: "La gran idea",
    legoBody:
      "Una caja de LEGO tiene decenas de formas — ruedas, rampas, ladrillos, placas. El artículo EML plantea una pregunta extraña: ¿y si solo tuvieras UNA forma, pero pudieras unirla en cualquier patrón? ¿Podrías aún construir un castillo? ¿Una casa? ¿Una catedral?",
    exampleTitle: "Un ejemplo concreto",
    exampleBody:
      "Esa forma única se llama eml(x, y). Toma dos números y devuelve uno. La receta: e elevado al primero, menos el logaritmo natural del segundo. Eso es la pieza entera. Calcula eml(2, 1) y obtienes e² ≈ 7,389 — el lado derecho se calla porque ln 1 = 0. Calcula eml(0, 1) y obtienes 1. La pieza es pequeña y asimétrica a propósito.",
    insightTitle: "Por qué importa",
    insightBody:
      "La afirmación sorprendente del artículo es que, encajando copias de esta única pieza — eml dentro de eml dentro de eml —, se recupera casi cualquier función de una calculadora científica. Seno, coseno, multiplicación, el propio logaritmo. Las imágenes de abajo no son decoración. Son esa pieza, ensamblada de distintas formas. Los patrones son lo que parece una sola piedra, repetida.",
    tryIt: "Sigue desplazándote y mira cómo se construye paso a paso.",
  },
  prologue: {
    pretitle: "Prólogo · Primitivos universales",
    title: "La forma de una afirmación de universalidad",
    p1: "En la lógica digital basta con una sola puerta. NAND es universal — cualquier circuito, por barroco que sea, se construye con copias de él. Es uno de los hechos perdurables de la informática: la complejidad no está en las piezas, está en el cableado.",
    p2: "El artículo EML plantea la misma pregunta a la matemática continua. ¿Existe un operador tan plástico que, anidándolo con una sola constante, pueda alcanzar eˣ, suma, multiplicación, raíz, seno, coseno — todo el armario de funciones elementales?",
    p3: "Su candidato es eml(x, y) = eˣ − ln y. La única constante que se conserva: 1.",
    nandTitle: "Análogo booleano · NAND",
    emlTitle: "Análogo continuo · EML",
    nandNote: "Funcionalmente completo. Todo circuito booleano se reduce a NANDs.",
    emlNote: "Mismo truco — alfabeto distinto.",
  },
  operator: {
    pretitle: "El operador",
    title: "Qué hace eml en realidad",
    p1: "Dos entradas. Dos operaciones. Una resta. Eleva e a la entrada izquierda; toma el logaritmo natural de la derecha; resta. La primera mitad es explosiva: los números pequeños se disparan hacia arriba. La segunda es paciente: incluso entradas astronómicas se comprimen en algo sereno.",
    p2: "La asimetría es la clave. Los primitivos simétricos solo producen estructuras simétricas. eml es deliberadamente desigual — y poner exponencial y logaritmo a lados opuestos de un menos convierte al operador en un balancín que, apilado, puede inclinarse en cualquier dirección.",
    examplesLabel: "Ejemplos resueltos",
    sideTitle: "El operador",
  },
  reading: {
    pretitle: "Leer la imagen · Coloreado de dominio",
    title: "Cada píxel es una salida compleja",
    p1: "Las imágenes no son adorno. Cada una sigue la misma receta: la pantalla es el plano complejo (parte real horizontal, imaginaria vertical); el árbol EML se evalúa en cada píxel; el número complejo resultante w elige un color.",
    rowHue: "elige el tono. Una vuelta completa alrededor de cero recorre la paleta una vez.",
    rowMag: "fija el brillo. Duplicar la magnitud cruza un anillo brillante.",
    rowZero: "cae a la tinta — el campo tiene un cero.",
    rowInf: "se quema a blanco — hay un polo.",
    rowGrid: "marca los valores enteros reales e imaginarios para que sitúes las posiciones.",
    closing:
      "El disco de la izquierda es el ejemplar más sencillo posible: w = z mismo. Cada imagen posterior es una deformación de este disco por un árbol EML.",
  },
  stationTitles: {
    exp: { pretitle: "Estación I — Exponencial", title: "Alimenta uno por la ranura derecha" },
    ln: { pretitle: "Estación II — Logaritmo", title: "Tres EMLs trenzan el ln" },
    id: { pretitle: "Estación III — Identidad", title: "Incluso no hacer nada cuesta un árbol" },
    selfdual: { pretitle: "Estación IV — Autodual", title: "El átomo se mira a sí mismo" },
    twin: { pretitle: "Estación V — Gemelo", title: "Exp y log se pliegan entre sí" },
    "param-vortex": { pretitle: "Estación VI — Vórtice paramétrico", title: "Un mango sobre el cálculo" },
    cathedral: { pretitle: "Estación VII — Catedral", title: "Rosetón apilado" },
    nebula: { pretitle: "Estación VIII — Nebulosa", title: "Donde el cálculo desborda" },
  },
  verifier: {
    pretitle: "Interludio · Comprobantes",
    title: "Los árboles no son gestos.",
    intro:
      "Devuelven el número correcto. Elige cualquier z y la reconstrucción EML de eˣ, ln e identidad coincide — dentro del error de coma flotante — con las funciones clásicas.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "error < 10⁻⁶ · error < 10⁻³ · corte de rama o desbordamiento",
  },
  complexity: {
    pretitle: "Tabla IV · Complejidad",
    title: "¿Cuán grandes son los árboles?",
    intro:
      "El artículo mide cada reconstrucción en tokens RPN — la longitud en notación polaca inversa del árbol EML. El patrón: lo barato sigue siendo barato; lo caro se vuelve desmesurado.",
    headTarget: "objetivo",
    headK: "K (longitud RPN)",
    headNote: "nota",
    note:
      "Mira los saltos. De eˣ (K = 3) a la identidad (K = 9) hay un triplicado. De identidad a multiplicación, casi cinco veces más. El cálculo llega a todas partes — pero no siempre barato.",
  },
  limits: {
    pretitle: "Salvedades · Lo que no puede",
    title: "Una catedral con grietas",
    intro:
      "El artículo no reclama universalidad total. Una respuesta de 2026 por Stylewarning mostró contraejemplos — funciones elementales que ningún anidamiento de EML reproduce exactamente. El ‘casi’ de la afirmación pesa.",
  },
  garden: {
    pretitle: "Jardín · El catálogo",
    title: "Ocho árboles, ocho mundos",
    intro:
      "Cada baldosa es el mismo operador. La variación es estructural: distintos anidamientos empujan al plano complejo a distintas geometrías. Las paletas cambian para mantener al ojo honesto.",
  },
  closing: {
    pill: "Salida",
    title: "La catedral se construyó con una sola piedra.",
    intro:
      "Lo que permanece es la afirmación misma, brillando suave detrás de la matemática: anidar un único primitivo basta para ver el resto. Las imágenes son el efecto secundario — el argumento real son los árboles.",
    ctaAtelier: "→ Entra al Taller · construye el tuyo",
    ctaResonance: "→ Escucha la Resonancia · tócala",
    meta:
      "basado en arxiv 2603.21852 · coloreado de dominio en webgl2 · todas las imágenes se renderizan en vivo con el mismo shader de seis líneas",
  },
  imprint: {
    title: "Aviso legal",
    intro: "Información conforme al § 5 de la Ley alemana de Telemedios (TMG).",
    company: "Empresa",
    address: "Dirección",
    register: "Registro mercantil",
    management: "Dirección",
    contact: "Contacto",
    phone: "Teléfono",
    email: "Correo electrónico",
    responsibility: "Responsable del contenido (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, dirección como arriba.",
    disclaimer: "Aviso de responsabilidad",
    disclaimerBody:
      "Todos los textos e imágenes de este sitio se presentan como ensayo visual no comercial. El artículo citado es obra de su autor; el código fuente se publica bajo licencia abierta (véase el enlace del repositorio). Los enlaces externos se abren en una nueva ventana; no asumimos responsabilidad por el contenido de sitios de terceros.",
  },
};

const fr: Dict = {
  nav: { cathedral: "Cathédrale", atelier: "Atelier", resonance: "Résonance", imprint: "Mentions légales", language: "Langue" },
  footer: {
    paper: "Lire l'article",
    github: "Voir sur GitHub",
    imprint: "Mentions légales",
    builtBy: "Un essai visuel sur EML par zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Cathédrale",
    title2: "à partir d'",
    title3: "Un",
    byAuthor: "d'après l'article d'Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "Un opérateur. Une constante. La revendication du calcul EML : presque toute fonction élémentaire — sinus, cosinus, eˣ, multiplication, racine carrée — peut être reconstruite en imbriquant une seule recette en elle-même.",
    p2: "Ce qui suit est un défilement lent à travers cette idée, rendu en coloriage de domaine complexe. Chaque station est le même opérateur, empilé d'un niveau supplémentaire. À la fin vous aurez vu, en images, pourquoi une seule pierre peut bâtir une cathédrale.",
    scroll: "défiler",
  },
  encounter: {
    pretitle: "Première rencontre · pour tous",
    title: "Imagine une seule brique LEGO qui construit tout",
    legoTitle: "L'idée centrale",
    legoBody:
      "Une boîte de LEGO contient des dizaines de formes — roues, pentes, briques, plaques. L'article EML pose une question étrange : et si vous n'aviez qu'UNE forme, mais pouviez l'assembler selon n'importe quel motif ? Pourriez-vous encore bâtir un château ? Une maison ? Une cathédrale ?",
    exampleTitle: "Un exemple concret",
    exampleBody:
      "Cette forme unique s'appelle eml(x, y). Elle prend deux nombres et en renvoie un. La recette : e à la puissance du premier, moins le logarithme naturel du second. C'est toute la brique. Avec eml(2, 1) on obtient e² ≈ 7,389 — la moitié droite se tait car ln 1 = 0. Avec eml(0, 1) on obtient 1. La brique est volontairement petite et asymétrique.",
    insightTitle: "Pourquoi cela compte",
    insightBody:
      "L'affirmation stupéfiante de l'article : en emboîtant des copies de cette unique brique — eml dans eml dans eml — on retrouve presque toutes les fonctions d'une calculatrice scientifique. Sinus, cosinus, multiplication, et même le logarithme. Les images ci-dessous ne sont pas décoratives. Ce sont cette brique, assemblée différemment. Les motifs sont l'apparence d'une seule pierre, répétée.",
    tryIt: "Continuez à défiler pour voir la construction se faire pas à pas.",
  },
  prologue: {
    pretitle: "Prologue · Primitives universelles",
    title: "À quoi ressemble une revendication d'universalité",
    p1: "En logique numérique, une seule porte suffit. NAND est universelle — n'importe quel circuit, aussi baroque soit-il, se construit avec des copies d'elle. C'est l'un des résultats durables de l'informatique : la complexité n'est pas dans les pièces, elle est dans le câblage.",
    p2: "L'article EML pose la même question aux mathématiques continues. Existe-t-il un opérateur si plastique qu'en l'imbriquant avec une seule constante on atteigne eˣ, l'addition, la multiplication, la racine, le sinus, le cosinus — tout l'armoire des fonctions élémentaires ?",
    p3: "Son candidat est eml(x, y) = eˣ − ln y. La seule constante conservée : 1.",
    nandTitle: "Analogue booléen · NAND",
    emlTitle: "Analogue continu · EML",
    nandNote: "Fonctionnellement complet. Tout circuit booléen se réduit à des NAND.",
    emlNote: "Même tour de passe-passe — alphabet différent.",
  },
  operator: {
    pretitle: "L'opérateur",
    title: "Ce que eml fait vraiment",
    p1: "Deux entrées. Deux opérations. Une soustraction. Élève e à l'entrée de gauche ; prends le logarithme naturel de celle de droite ; soustrais. La première moitié est explosive : de petits nombres décollent. La seconde est patiente : même des entrées astronomiques se comprimment en quelque chose de calme.",
    p2: "L'asymétrie est le point. Des primitives symétriques ne produisent que des structures symétriques. eml est volontairement bancal — et placer une exponentielle et un logarithme de part et d'autre d'un signe moins fait de l'opérateur une bascule qui, empilée, peut pencher dans n'importe quelle direction.",
    examplesLabel: "Exemples chiffrés",
    sideTitle: "L'opérateur",
  },
  reading: {
    pretitle: "Lire l'image · Coloriage de domaine",
    title: "Chaque pixel est une sortie complexe",
    p1: "Les images ne sont pas décoratives. Chacune suit la même recette : l'écran est le plan complexe (réel horizontal, imaginaire vertical) ; l'arbre EML est évalué à chaque pixel ; le nombre complexe résultant w choisit une couleur.",
    rowHue: "choisit la teinte. Un tour complet autour de zéro parcourt la palette une fois.",
    rowMag: "fixe la luminosité. Doubler la magnitude franchit un anneau lumineux.",
    rowZero: "tombe dans l'encre — le champ a un zéro.",
    rowInf: "se consume en blanc — il y a un pôle.",
    rowGrid: "marque les valeurs entières réelles et imaginaires, pour situer les positions.",
    closing:
      "Le disque à gauche est le spécimen le plus simple possible : w = z lui-même. Toutes les images suivantes sont des déformations de ce disque par un arbre EML.",
  },
  stationTitles: {
    exp: { pretitle: "Station I — Exponentielle", title: "Glissez un dans la fente de droite" },
    ln: { pretitle: "Station II — Logarithme", title: "Trois EMLs tressent le ln" },
    id: { pretitle: "Station III — Identité", title: "Même ne rien faire coûte un arbre" },
    selfdual: { pretitle: "Station IV — Autodual", title: "L'atome se regarde lui-même" },
    twin: { pretitle: "Station V — Jumeau", title: "Exp et log se replient l'un dans l'autre" },
    "param-vortex": { pretitle: "Station VI — Vortex paramétrique", title: "Une poignée sur le calcul" },
    cathedral: { pretitle: "Station VII — Cathédrale", title: "Rosace empilée" },
    nebula: { pretitle: "Station VIII — Nébuleuse", title: "Là où le calcul déborde" },
  },
  verifier: {
    pretitle: "Interlude · Reçus",
    title: "Les arbres ne sont pas des gestes.",
    intro:
      "Ils renvoient le bon nombre. Choisissez n'importe quel z : les reconstructions EML de eˣ, ln et identité retrouvent — à la précision flottante près — ce que les fonctions classiques donnent.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "erreur < 10⁻⁶ · erreur < 10⁻³ · coupure de branche ou débordement",
  },
  complexity: {
    pretitle: "Tableau IV · Complexité",
    title: "À quel point les arbres sont-ils grands ?",
    intro:
      "L'article mesure chaque reconstruction en jetons RPN — la longueur en notation polonaise inverse de l'arbre EML. Le motif : ce qui est bon marché le reste ; ce qui est coûteux devient déraisonnable.",
    headTarget: "cible",
    headK: "K (longueur RPN)",
    headNote: "note",
    note:
      "Regardez les sauts. De eˣ (K = 3) à l'identité (K = 9), c'est triplé. De l'identité à la multiplication, presque quintuplé. Le calcul atteint partout — mais pas toujours à bon compte.",
  },
  limits: {
    pretitle: "Réserves · Ce qu'il ne peut pas",
    title: "Une cathédrale fissurée",
    intro:
      "L'article ne revendique pas l'universalité totale. Une réponse de 2026 de Stylewarning a produit des contre-exemples — des fonctions élémentaires qu'aucun emboîtement EML ne reproduit exactement. Le ‘presque’ de l'affirmation fait du vrai travail.",
  },
  garden: {
    pretitle: "Jardin · Le catalogue",
    title: "Huit arbres, huit mondes",
    intro:
      "Chaque tuile est le même opérateur. La variation est structurelle : différents emboîtements poussent le plan complexe dans différentes géométries. Les palettes changent pour garder l'œil honnête.",
  },
  closing: {
    pill: "Sortie",
    title: "La cathédrale a été bâtie d'une seule pierre.",
    intro:
      "Reste l'affirmation elle-même, brillant doucement derrière la mathématique : emboîter un seul primitif suffit pour voir le reste. Les images sont le sous-produit — le véritable argument, ce sont les arbres.",
    ctaAtelier: "→ Entrez dans l'Atelier · construisez le vôtre",
    ctaResonance: "→ Écoutez la Résonance · jouez-en",
    meta:
      "basé sur arxiv 2603.21852 · coloriage de domaine en webgl2 · toutes les images rendues en direct par le même shader de six lignes",
  },
  imprint: {
    title: "Mentions légales",
    intro: "Informations selon § 5 TMG (Allemagne).",
    company: "Société",
    address: "Adresse",
    register: "Registre du commerce",
    management: "Direction",
    contact: "Contact",
    phone: "Téléphone",
    email: "Courriel",
    responsibility: "Responsable du contenu (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, adresse ci-dessus.",
    disclaimer: "Avertissement",
    disclaimerBody:
      "Tous les textes et images de ce site sont présentés comme un essai visuel non commercial. L'article cité demeure l'œuvre de son auteur ; le code source est publié sous licence libre (voir lien du dépôt). Les liens externes s'ouvrent dans une nouvelle fenêtre — nous déclinons toute responsabilité quant au contenu de sites tiers.",
  },
};

const it: Dict = {
  nav: { cathedral: "Cattedrale", atelier: "Atelier", resonance: "Risonanza", imprint: "Note legali", language: "Lingua" },
  footer: {
    paper: "Leggi l'articolo",
    github: "Vedi su GitHub",
    imprint: "Note legali",
    builtBy: "Un saggio visivo su EML di zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Cattedrale",
    title2: "da",
    title3: "Uno",
    byAuthor: "dall'articolo di Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "Un operatore. Una costante. La tesi del calcolo EML è che quasi ogni funzione elementare — seno, coseno, eˣ, moltiplicazione, radice quadrata — possa essere ricostruita annidando una sola ricetta in se stessa.",
    p2: "Quel che segue è uno scorrimento lento attraverso questa idea, reso come coloratura di dominio complesso. Ogni stazione è lo stesso operatore, impilato un livello più in profondità. Alla fine avrai visto, in immagini, perché una sola pietra basta a costruire una cattedrale.",
    scroll: "scorri",
  },
  encounter: {
    pretitle: "Primo incontro · per tutti",
    title: "Immagina un solo mattoncino LEGO che costruisce tutto",
    legoTitle: "L'idea principale",
    legoBody:
      "Una scatola di LEGO ha decine di forme — ruote, rampe, mattoncini, piastre. L'articolo EML pone una domanda strana: e se avessi UNA sola forma, ma potessi assemblarla in qualsiasi schema? Riusciresti comunque a costruire un castello? Una casa? Una cattedrale?",
    exampleTitle: "Un esempio concreto",
    exampleBody:
      "Quella forma unica si chiama eml(x, y). Prende due numeri e ne restituisce uno. La ricetta: e alla potenza del primo, meno il logaritmo naturale del secondo. È l'intero mattoncino. Inserisci eml(2, 1) e ottieni e² ≈ 7,389 — la metà destra tace perché ln 1 = 0. Inserisci eml(0, 1) e ottieni 1. Il mattoncino è piccolo e asimmetrico di proposito.",
    insightTitle: "Perché conta",
    insightBody:
      "L'affermazione sorprendente dell'articolo: incastrando copie di questo unico mattoncino — eml dentro eml dentro eml — si recupera quasi ogni funzione di una calcolatrice scientifica. Seno, coseno, moltiplicazione, il logaritmo stesso. Le immagini qui sotto non sono decorazione. Sono quel mattoncino, assemblato in modi diversi. I motivi mostrano l'aspetto di una sola pietra, ripetuta.",
    tryIt: "Continua a scorrere e guarda come si costruisce, un passo alla volta.",
  },
  prologue: {
    pretitle: "Prologo · Primitive universali",
    title: "La forma di una tesi di universalità",
    p1: "Nella logica digitale basta una sola porta. NAND è universale — qualsiasi circuito, per quanto barocco, si costruisce con sue copie. È uno dei fatti più duraturi dell'informatica: la complessità non sta nei pezzi, sta nei collegamenti.",
    p2: "L'articolo EML rivolge la stessa domanda alla matematica continua. Esiste un operatore così plastico che, annidandolo con una sola costante, si possa raggiungere eˣ, addizione, moltiplicazione, radice, seno, coseno — l'intero armadietto delle funzioni elementari?",
    p3: "Il suo candidato è eml(x, y) = eˣ − ln y. La sola costante mantenuta: 1.",
    nandTitle: "Analogo booleano · NAND",
    emlTitle: "Analogo continuo · EML",
    nandNote: "Funzionalmente completo. Ogni circuito booleano si riduce a NAND.",
    emlNote: "Stesso trucco — alfabeto diverso.",
  },
  operator: {
    pretitle: "L'operatore",
    title: "Cosa fa davvero eml",
    p1: "Due ingressi. Due operazioni. Una sottrazione. Eleva e all'ingresso sinistro; prendi il logaritmo naturale del destro; sottrai. La prima metà è esplosiva: numeri piccoli decollano. La seconda è paziente: anche ingressi astronomici si comprimono in qualcosa di quieto.",
    p2: "L'asimmetria è il punto. Primitive simmetriche producono solo strutture simmetriche. eml è volutamente sbilenco — e mettere esponenziale e logaritmo ai lati opposti di un meno trasforma l'operatore in un'altalena che, impilata, può pendere in qualsiasi direzione.",
    examplesLabel: "Esempi numerici",
    sideTitle: "L'operatore",
  },
  reading: {
    pretitle: "Leggere l'immagine · Coloratura di dominio",
    title: "Ogni pixel è un'uscita complessa",
    p1: "Le immagini non sono decoro. Ciascuna segue la stessa ricetta: lo schermo è il piano complesso (parte reale orizzontale, immaginaria verticale); l'albero EML è valutato in ogni pixel; il numero complesso risultante w sceglie un colore.",
    rowHue: "sceglie la tinta. Un giro completo attorno allo zero percorre la tavolozza una volta.",
    rowMag: "fissa la luminosità. Raddoppiare la magnitudine attraversa un anello luminoso.",
    rowZero: "cade nell'inchiostro — il campo ha uno zero.",
    rowInf: "brucia in bianco — c'è un polo.",
    rowGrid: "marca i valori interi reali e immaginari, per leggere le posizioni.",
    closing:
      "Il disco a sinistra è l'esemplare più semplice possibile: w = z stesso. Ogni immagine successiva è una deformazione di questo disco mediante un albero EML.",
  },
  stationTitles: {
    exp: { pretitle: "Stazione I — Esponenziale", title: "Inserisci uno nella fessura destra" },
    ln: { pretitle: "Stazione II — Logaritmo", title: "Tre EML intrecciano il ln" },
    id: { pretitle: "Stazione III — Identità", title: "Anche non fare nulla richiede un albero" },
    selfdual: { pretitle: "Stazione IV — Autoduale", title: "L'atomo guarda sé stesso" },
    twin: { pretitle: "Stazione V — Gemello", title: "Esp e log si ripiegano uno nell'altro" },
    "param-vortex": { pretitle: "Stazione VI — Vortice parametrico", title: "Una manopola sul calcolo" },
    cathedral: { pretitle: "Stazione VII — Cattedrale", title: "Rosone impilato" },
    nebula: { pretitle: "Stazione VIII — Nebulosa", title: "Dove il calcolo trabocca" },
  },
  verifier: {
    pretitle: "Interludio · Ricevute",
    title: "Gli alberi non sono gesti.",
    intro:
      "Restituiscono il numero giusto. Scegli un qualsiasi z e le ricostruzioni EML di eˣ, ln e identità coincidono — entro l'errore in virgola mobile — con le funzioni classiche.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "errore < 10⁻⁶ · errore < 10⁻³ · taglio di ramo o trabocco",
  },
  complexity: {
    pretitle: "Tabella IV · Complessità",
    title: "Quanto sono grandi questi alberi?",
    intro:
      "L'articolo misura ogni ricostruzione in token RPN — la lunghezza in notazione polacca inversa dell'albero EML. Lo schema: ciò che è economico resta tale; ciò che è caro diventa irragionevole.",
    headTarget: "obiettivo",
    headK: "K (lunghezza RPN)",
    headNote: "nota",
    note:
      "Guarda i salti. Da eˣ (K = 3) all'identità (K = 9) c'è una triplicazione. Dall'identità alla moltiplicazione, quasi cinque volte tanto. Il calcolo arriva ovunque — ma non sempre a buon mercato.",
  },
  limits: {
    pretitle: "Riserve · Cosa non può",
    title: "Una cattedrale con crepe",
    intro:
      "L'articolo non rivendica universalità totale. Una replica del 2026 di Stylewarning ha mostrato controesempi — funzioni elementari che nessun annidamento di EML riproduce esattamente. Il ‘quasi’ dell'enunciato lavora davvero.",
  },
  garden: {
    pretitle: "Giardino · Il catalogo",
    title: "Otto alberi, otto mondi",
    intro:
      "Ogni mattonella è lo stesso operatore. La variazione è strutturale: annidamenti diversi spingono il piano complesso in geometrie diverse. Le palette cambiano per mantenere onesto l'occhio.",
  },
  closing: {
    pill: "Uscita",
    title: "La cattedrale è stata costruita da una sola pietra.",
    intro:
      "Resta l'enunciato stesso, che brilla sommesso dietro la matematica: annidare un'unica primitiva basta per vedere il resto. Le immagini sono l'effetto collaterale — l'argomento reale sono gli alberi.",
    ctaAtelier: "→ Entra nell'Atelier · costruisci il tuo",
    ctaResonance: "→ Ascolta la Risonanza · suonala",
    meta:
      "basato su arxiv 2603.21852 · coloratura di dominio in webgl2 · tutte le immagini rese in tempo reale dallo stesso shader di sei righe",
  },
  imprint: {
    title: "Note legali",
    intro: "Informazioni ai sensi del § 5 TMG (Germania).",
    company: "Azienda",
    address: "Indirizzo",
    register: "Registro delle imprese",
    management: "Amministrazione",
    contact: "Contatti",
    phone: "Telefono",
    email: "E-mail",
    responsibility: "Responsabile del contenuto (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, indirizzo come sopra.",
    disclaimer: "Avviso di responsabilità",
    disclaimerBody:
      "Tutti i testi e le immagini di questo sito sono presentati come un saggio visivo non commerciale. L'articolo citato resta opera del suo autore; il codice sorgente è pubblicato con licenza aperta (vedi link al repository). I collegamenti esterni si aprono in una nuova finestra — non ci assumiamo responsabilità per il contenuto di siti di terzi.",
  },
};

const pt: Dict = {
  nav: { cathedral: "Catedral", atelier: "Atelier", resonance: "Ressonância", imprint: "Aviso legal", language: "Idioma" },
  footer: {
    paper: "Ler o artigo",
    github: "Ver no GitHub",
    imprint: "Aviso legal",
    builtBy: "Um ensaio visual sobre EML pela zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Catedral",
    title2: "de",
    title3: "Um",
    byAuthor: "a partir do artigo de Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "Um operador. Uma constante. A alegação do cálculo EML é que quase toda função elementar — seno, cosseno, eˣ, multiplicação, raiz quadrada — pode ser reconstruída aninhando uma única receita em si mesma.",
    p2: "O que se segue é uma rolagem lenta por essa ideia, renderizada como coloração de domínio complexo. Cada estação é o mesmo operador, empilhado um nível mais fundo. Ao fim você terá visto, em imagens, por que uma única pedra basta para uma catedral.",
    scroll: "rolar",
  },
  encounter: {
    pretitle: "Primeiro encontro · para todos",
    title: "Imagine uma única peça de LEGO que constrói tudo",
    legoTitle: "A grande ideia",
    legoBody:
      "Uma caixa de LEGO tem dezenas de formas — rodas, rampas, blocos, placas. O artigo EML faz uma pergunta estranha: e se você tivesse apenas UMA forma, mas pudesse encaixá-la em qualquer padrão? Você ainda conseguiria construir um castelo? Uma casa? Uma catedral?",
    exampleTitle: "Um exemplo concreto",
    exampleBody:
      "Essa forma única chama-se eml(x, y). Pega dois números e devolve um. A receita: e elevado ao primeiro, menos o logaritmo natural do segundo. É a peça inteira. Calcule eml(2, 1) e obtém e² ≈ 7,389 — o lado direito se cala porque ln 1 = 0. Calcule eml(0, 1) e obtém 1. A peça é pequena e assimétrica de propósito.",
    insightTitle: "Por que importa",
    insightBody:
      "A afirmação espantosa do artigo: encaixando cópias desta única peça — eml dentro de eml dentro de eml — recupera-se quase toda função de uma calculadora científica. Seno, cosseno, multiplicação, o próprio logaritmo. As imagens abaixo não são decoração. São essa peça, montada de formas diferentes. Os padrões mostram como uma única pedra parece, repetida.",
    tryIt: "Continue rolando e veja a construção, passo a passo.",
  },
  prologue: {
    pretitle: "Prólogo · Primitivos universais",
    title: "A forma de uma alegação de universalidade",
    p1: "Na lógica digital, basta uma porta. NAND é universal — qualquer circuito, por mais barroco, constrói-se com cópias dela. É um dos fatos duradouros da computação: a complexidade não está nas peças, está nas ligações.",
    p2: "O artigo EML faz a mesma pergunta à matemática contínua. Existe um operador tão plástico que, aninhando-o com uma única constante, alcance eˣ, soma, multiplicação, raiz, seno, cosseno — todo o armário das funções elementares?",
    p3: "Seu candidato é eml(x, y) = eˣ − ln y. A única constante mantida: 1.",
    nandTitle: "Análogo booleano · NAND",
    emlTitle: "Análogo contínuo · EML",
    nandNote: "Funcionalmente completo. Todo circuito booleano reduz-se a NANDs.",
    emlNote: "Mesmo truque — alfabeto diferente.",
  },
  operator: {
    pretitle: "O operador",
    title: "O que eml realmente faz",
    p1: "Duas entradas. Duas operações. Uma subtração. Eleva e à entrada esquerda; toma o logaritmo natural da direita; subtrai. A primeira metade é explosiva: números pequenos disparam. A segunda é paciente: até entradas astronômicas comprimem-se em algo sereno.",
    p2: "A assimetria é o ponto. Primitivos simétricos produzem apenas estruturas simétricas. eml é deliberadamente torto — e pôr exponencial e logaritmo em lados opostos de um menos converte o operador numa gangorra que, empilhada, pode pender em qualquer direção.",
    examplesLabel: "Exemplos numéricos",
    sideTitle: "O operador",
  },
  reading: {
    pretitle: "Ler a imagem · Coloração de domínio",
    title: "Cada pixel é uma saída complexa",
    p1: "As imagens não são adorno. Cada uma segue a mesma receita: a tela é o plano complexo (real horizontal, imaginário vertical); a árvore EML é avaliada em cada pixel; o número complexo resultante w escolhe uma cor.",
    rowHue: "escolhe a matiz. Uma volta completa ao redor do zero percorre a paleta uma vez.",
    rowMag: "fixa o brilho. Dobrar a magnitude atravessa um anel brilhante.",
    rowZero: "cai na tinta — o campo tem um zero.",
    rowInf: "queima ao branco — há um polo.",
    rowGrid: "marca os valores inteiros reais e imaginários para localizar posições.",
    closing:
      "O disco à esquerda é o exemplar mais simples possível: w = z mesmo. Cada imagem seguinte é uma deformação deste disco por uma árvore EML.",
  },
  stationTitles: {
    exp: { pretitle: "Estação I — Exponencial", title: "Coloque um no encaixe da direita" },
    ln: { pretitle: "Estação II — Logaritmo", title: "Três EMLs entrelaçam o ln" },
    id: { pretitle: "Estação III — Identidade", title: "Até não fazer nada custa uma árvore" },
    selfdual: { pretitle: "Estação IV — Autodual", title: "O átomo olha para si mesmo" },
    twin: { pretitle: "Estação V — Gêmeo", title: "Exp e log dobram-se um no outro" },
    "param-vortex": { pretitle: "Estação VI — Vórtice paramétrico", title: "Um cabo sobre o cálculo" },
    cathedral: { pretitle: "Estação VII — Catedral", title: "Rosácea empilhada" },
    nebula: { pretitle: "Estação VIII — Nebulosa", title: "Onde o cálculo transborda" },
  },
  verifier: {
    pretitle: "Interlúdio · Comprovantes",
    title: "As árvores não são gestos.",
    intro:
      "Devolvem o número certo. Escolha qualquer z e as reconstruções EML de eˣ, ln e identidade devolvem — dentro do erro de ponto flutuante — o mesmo que as funções clássicas.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "erro < 10⁻⁶ · erro < 10⁻³ · corte de ramo ou estouro",
  },
  complexity: {
    pretitle: "Tabela IV · Complexidade",
    title: "Qual o tamanho real das árvores?",
    intro:
      "O artigo mede cada reconstrução em tokens RPN — o comprimento em notação polonesa inversa da árvore EML. O padrão: o que é barato permanece barato; o que é caro torna-se desproporcional.",
    headTarget: "alvo",
    headK: "K (comprimento RPN)",
    headNote: "nota",
    note:
      "Veja os saltos. De eˣ (K = 3) à identidade (K = 9) há um triplicar. De identidade à multiplicação, quase cinco vezes mais. O cálculo alcança tudo — mas nem sempre barato.",
  },
  limits: {
    pretitle: "Ressalvas · O que não pode",
    title: "Uma catedral com fendas",
    intro:
      "O artigo não reivindica universalidade total. Uma réplica de 2026 de Stylewarning mostrou contraexemplos — funções elementares que nenhum aninhamento de EML reproduz exatamente. O ‘quase’ na afirmação faz trabalho real.",
  },
  garden: {
    pretitle: "Jardim · O catálogo",
    title: "Oito árvores, oito mundos",
    intro:
      "Cada ladrilho é o mesmo operador. A variação é estrutural: aninhamentos distintos empurram o plano complexo a geometrias distintas. As paletas mudam para manter o olho honesto.",
  },
  closing: {
    pill: "Saída",
    title: "A catedral foi construída a partir de uma única pedra.",
    intro:
      "O que permanece é o próprio enunciado, brilhando baixinho atrás da matemática: aninhar um único primitivo basta para ver o resto. As imagens são o efeito colateral — o argumento real são as árvores.",
    ctaAtelier: "→ Entre no Atelier · construa o seu",
    ctaResonance: "→ Ouça a Ressonância · toque",
    meta:
      "baseado em arxiv 2603.21852 · coloração de domínio em webgl2 · todas as imagens renderizadas ao vivo pelo mesmo shader de seis linhas",
  },
  imprint: {
    title: "Aviso legal",
    intro: "Informações conforme § 5 TMG (Alemanha).",
    company: "Empresa",
    address: "Endereço",
    register: "Registro comercial",
    management: "Direção",
    contact: "Contato",
    phone: "Telefone",
    email: "E-mail",
    responsibility: "Responsável pelo conteúdo (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, endereço acima.",
    disclaimer: "Aviso de responsabilidade",
    disclaimerBody:
      "Todos os textos e imagens deste site são apresentados como ensaio visual não comercial. O artigo citado permanece obra de seu autor; o código fonte é publicado sob licença aberta (ver link do repositório). Links externos abrem em nova janela — não assumimos responsabilidade pelo conteúdo de sites de terceiros.",
  },
};

const sv: Dict = {
  nav: { cathedral: "Katedral", atelier: "Atelier", resonance: "Resonans", imprint: "Juridisk info", language: "Språk" },
  footer: {
    paper: "Läs artikeln",
    github: "Se på GitHub",
    imprint: "Juridisk info",
    builtBy: "En visuell essä om EML av zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Katedral",
    title2: "av",
    title3: "Ett",
    byAuthor: "efter artikeln av Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "En operator. En konstant. EML-kalkylens påstående är att nästan varje elementär funktion — sinus, cosinus, eˣ, multiplikation, kvadratrot — kan rekonstrueras genom att nästla ett enda recept i sig självt.",
    p2: "Det som följer är en långsam rullning genom den idén, renderad som komplex domänfärgning. Varje station är samma operator, staplad ett steg djupare. Mot slutet har du sett, i bilder, varför en enda sten räcker till en katedral.",
    scroll: "rulla",
  },
  encounter: {
    pretitle: "Första mötet · för alla",
    title: "Tänk dig en enda LEGO-kloss som bygger allt",
    legoTitle: "Den stora idén",
    legoBody:
      "En LEGO-låda har dussintals former — hjul, sluttningar, klossar, plattor. EML-artikeln ställer en konstig fråga: tänk om du bara hade EN form, men kunde foga ihop den i vilket mönster som helst? Skulle du fortfarande kunna bygga ett slott? Ett hus? En katedral?",
    exampleTitle: "Ett konkret exempel",
    exampleBody:
      "Den enda formen heter eml(x, y). Den tar två tal och ger ett. Receptet: e upphöjt till det första, minus den naturliga logaritmen av det andra. Det är hela klossen. Sätt in eml(2, 1) och du får e² ≈ 7,389 — högersidan tystnar eftersom ln 1 = 0. Sätt in eml(0, 1) och du får 1. Klossen är liten och osymmetrisk med flit.",
    insightTitle: "Varför det spelar roll",
    insightBody:
      "Artikelns häpnadsväckande påstående: genom att foga ihop kopior av denna enda kloss — eml inuti eml inuti eml — kan du återskapa nästan varje funktion på en vetenskaplig miniräknare. Sinus, cosinus, multiplikation, själva logaritmen. Bilderna nedan är ingen dekoration. De är klossen, ihopfogad på olika sätt. Mönstren visar hur en enda sten ser ut, upprepad.",
    tryIt: "Rulla vidare och se den byggas upp, ett steg i taget.",
  },
  prologue: {
    pretitle: "Prolog · Universella primitiv",
    title: "Hur ett universalitetspåstående ser ut",
    p1: "Inom digital logik räcker en enda grind. NAND är universell — vilken krets som helst, hur invecklad den än är, kan byggas av kopior av NAND. Det är ett av datavetenskapens bestående fakta: komplexiteten finns inte i delarna utan i kopplingarna.",
    p2: "EML-artikeln ställer samma fråga till den kontinuerliga matematiken. Finns det en operator så plastisk att man, genom att nästla den med en enda konstant, kan nå eˣ, addition, multiplikation, kvadratrot, sinus, cosinus — hela skåpet av elementära funktioner?",
    p3: "Dess kandidat är eml(x, y) = eˣ − ln y. Den enda kvarvarande konstanten: 1.",
    nandTitle: "Boolesk motsvarighet · NAND",
    emlTitle: "Kontinuerlig motsvarighet · EML",
    nandNote: "Funktionellt fullständig. Varje boolesk krets reduceras till NAND.",
    emlNote: "Samma knep — annat alfabet.",
  },
  operator: {
    pretitle: "Operatorn",
    title: "Vad eml faktiskt gör",
    p1: "Två ingångar. Två operationer. En subtraktion. Höj e till den vänstra ingången; ta den naturliga logaritmen av den högra; subtrahera. Den första halvan är explosiv: små tal skjuter i höjden. Den andra är tålmodig: även astronomiska indata pressas till något tyst.",
    p2: "Asymmetrin är poängen. Symmetriska primitiv ger bara symmetriska strukturer. eml är medvetet snedställd — och att placera exponentialfunktion och logaritm på var sin sida om ett minustecken gör operatorn till en gungbräda som, staplad, kan luta åt vilket håll som helst.",
    examplesLabel: "Konkreta värden",
    sideTitle: "Operatorn",
  },
  reading: {
    pretitle: "Läsa bilden · Domänfärgning",
    title: "Varje pixel är ett komplext utfall",
    p1: "Bilderna är ingen dekoration. Var och en följer samma recept: skärmen är det komplexa planet (realdelen horisontellt, imaginärdelen vertikalt); EML-trädet utvärderas i varje pixel; det resulterande komplexa talet w väljer en färg.",
    rowHue: "väljer kulören. Ett helt varv kring noll går igenom paletten en gång.",
    rowMag: "ger ljusstyrkan. En fördubbling av storleken passerar en ljus ring.",
    rowZero: "faller in i bläck — fältet har en nolla.",
    rowInf: "bränns till vitt — där finns en pol.",
    rowGrid: "markerar heltalsvärden i real- och imaginärled så att positioner går att läsa av.",
    closing:
      "Skivan till vänster är det enklaste möjliga exemplaret: w = z själv. Varje senare bild är en deformation av denna skiva genom ett EML-träd.",
  },
  stationTitles: {
    exp: { pretitle: "Station I — Exponential", title: "Mata in ett i den högra springan" },
    ln: { pretitle: "Station II — Logaritm", title: "Tre EML flätas till ln" },
    id: { pretitle: "Station III — Identitet", title: "Även att göra ingenting kostar ett träd" },
    selfdual: { pretitle: "Station IV — Självdual", title: "Atomen ser på sig själv" },
    twin: { pretitle: "Station V — Tvilling", title: "Exp och log viker in i varandra" },
    "param-vortex": { pretitle: "Station VI — Parametrisk virvel", title: "Ett handtag på kalkylen" },
    cathedral: { pretitle: "Station VII — Katedral", title: "Staplad rosett" },
    nebula: { pretitle: "Station VIII — Nebulosa", title: "Där kalkylen svämmar över" },
  },
  verifier: {
    pretitle: "Mellanspel · Kvitton",
    title: "Träden är inga gester.",
    intro:
      "De ger rätt tal. Välj ett godtyckligt z och EML-rekonstruktionerna av eˣ, ln och identitet återger — inom flyttalsfel — det de klassiska funktionerna gör.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "fel < 10⁻⁶ · fel < 10⁻³ · grensnitt eller överspill",
  },
  complexity: {
    pretitle: "Tabell IV · Komplexitet",
    title: "Hur stora är träden egentligen?",
    intro:
      "Artikeln mäter varje rekonstruktion i RPN-tecken — EML-trädets längd i omvänd polsk notation. Mönstret: det billiga förblir billigt; det dyra blir orimligt.",
    headTarget: "mål",
    headK: "K (RPN-längd)",
    headNote: "anmärkning",
    note:
      "Se hoppen. Från eˣ (K = 3) till identitet (K = 9) tredubblas det. Från identitet till multiplikation, nästan fem gånger så mycket. Kalkylen når överallt — men inte alltid billigt.",
  },
  limits: {
    pretitle: "Förbehåll · Vad den inte kan",
    title: "En katedral med sprickor",
    intro:
      "Artikeln gör inget anspråk på total universalitet. Ett svar från 2026 av Stylewarning visade motexempel — elementära funktioner som ingen EML-nästling kan återge exakt. ‘Nästan’ i påståendet gör verkligt arbete.",
  },
  garden: {
    pretitle: "Trädgård · Katalogen",
    title: "Åtta träd, åtta världar",
    intro:
      "Varje platta är samma operator. Variationen är strukturell: olika nästlingar pressar det komplexa planet i olika geometrier. Paletterna växlar för att hålla ögat ärligt.",
  },
  closing: {
    pill: "Utgång",
    title: "Katedralen byggdes av en enda sten.",
    intro:
      "Det som återstår är själva påståendet, som lyser svagt bakom matematiken: att nästla en enda primitiv räcker för att se resten. Bilderna är bieffekten — själva argumentet är träden.",
    ctaAtelier: "→ Stig in i Atelieren · bygg ditt eget",
    ctaResonance: "→ Hör Resonansen · spela",
    meta:
      "byggd på arxiv 2603.21852 · domänfärgning i webgl2 · alla bilder renderade i realtid av samma sex rader shader",
  },
  imprint: {
    title: "Juridisk information",
    intro: "Uppgifter enligt § 5 TMG (Tyskland).",
    company: "Företag",
    address: "Adress",
    register: "Handelsregister",
    management: "Ledning",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-post",
    responsibility: "Ansvarig för innehåll (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, adress enligt ovan.",
    disclaimer: "Ansvarsfriskrivning",
    disclaimerBody:
      "Alla texter och bilder på denna sajt presenteras som en icke-kommersiell visuell essä. Den citerade artikeln förblir sin författares verk; källkoden publiceras under en öppen licens (se repository-länken). Externa länkar öppnas i nytt fönster — vi tar inget ansvar för innehållet på tredjepartssajter.",
  },
};

const no: Dict = {
  nav: { cathedral: "Katedral", atelier: "Atelier", resonance: "Resonans", imprint: "Juridisk info", language: "Språk" },
  footer: {
    paper: "Les artikkelen",
    github: "Se på GitHub",
    imprint: "Juridisk info",
    builtBy: "Et visuelt essay om EML av zauberware",
    copyright: "© 2026 zauberware technologies",
  },
  hero: {
    paperPill: "arxiv 2603.21852 · 2026",
    title1: "Katedral",
    title2: "av",
    title3: "Én",
    byAuthor: "etter artikkelen av Andrzej Odrzywołek",
    paperLink: "All elementary functions from a single binary operator",
    p1: "Én operator. Én konstant. EML-kalkulusens påstand er at nesten enhver elementær funksjon — sinus, cosinus, eˣ, multiplikasjon, kvadratrot — kan rekonstrueres ved å nøste én eneste oppskrift i seg selv.",
    p2: "Det som følger er en sakte rulling gjennom den ideen, gjengitt som kompleks domenefarging. Hver stasjon er samme operator, stablet ett nivå dypere. Mot slutten har du sett, i bilder, hvorfor én eneste stein holder til en katedral.",
    scroll: "rull",
  },
  encounter: {
    pretitle: "Første møte · for alle",
    title: "Tenk deg én eneste LEGO-kloss som bygger alt",
    legoTitle: "Den store ideen",
    legoBody:
      "En LEGO-eske har dusinvis av former — hjul, skråninger, klosser, plater. EML-artikkelen stiller et merkelig spørsmål: hva om du bare hadde ÉN form, men kunne sette den sammen i hvilket som helst mønster? Kunne du fortsatt bygge et slott? Et hus? En katedral?",
    exampleTitle: "Et konkret eksempel",
    exampleBody:
      "Den ene formen heter eml(x, y). Den tar to tall og gir ett. Oppskriften: e opphøyd i den første, minus den naturlige logaritmen av den andre. Det er hele klossen. Regn ut eml(2, 1) og du får e² ≈ 7,389 — høyresiden faller stille fordi ln 1 = 0. Regn ut eml(0, 1) og du får 1. Klossen er liten og asymmetrisk med vilje.",
    insightTitle: "Hvorfor det spiller en rolle",
    insightBody:
      "Artikkelens forbløffende påstand: ved å sette sammen kopier av denne ene klossen — eml inni eml inni eml — kan du gjenskape nesten enhver funksjon på en vitenskapelig kalkulator. Sinus, cosinus, multiplikasjon, selve logaritmen. Bildene nedenfor er ikke pynt. De er klossen, satt sammen på ulike måter. Mønstrene viser hvordan én eneste stein ser ut, gjentatt.",
    tryIt: "Fortsett å rulle og se den bygges opp, ett trinn av gangen.",
  },
  prologue: {
    pretitle: "Prolog · Universelle primitiver",
    title: "Hva en universalitetspåstand ser ut som",
    p1: "I digital logikk holder én port. NAND er universell — enhver krets, uansett hvor barokk, bygges av kopier av den. Det er ett av datavitenskapens varige funn: kompleksiteten ligger ikke i delene, men i koblingene.",
    p2: "EML-artikkelen stiller samme spørsmål til den kontinuerlige matematikken. Finnes det en operator så plastisk at man — ved å nøste den med én eneste konstant — kan nå eˣ, addisjon, multiplikasjon, rot, sinus, cosinus — hele skapet av elementære funksjoner?",
    p3: "Kandidaten dens er eml(x, y) = eˣ − ln y. Den eneste beholdte konstanten: 1.",
    nandTitle: "Boolsk motstykke · NAND",
    emlTitle: "Kontinuerlig motstykke · EML",
    nandNote: "Funksjonelt fullstendig. Enhver boolsk krets reduseres til NAND-er.",
    emlNote: "Samme triks — annet alfabet.",
  },
  operator: {
    pretitle: "Operatoren",
    title: "Hva eml egentlig gjør",
    p1: "To innganger. To operasjoner. Én subtraksjon. Hev e til den venstre inngangen; ta den naturlige logaritmen av den høyre; trekk fra. Den første halvdelen er eksplosiv: små tall skyter i været. Den andre er tålmodig: selv astronomiske inndata presses til noe stille.",
    p2: "Asymmetrien er poenget. Symmetriske primitiver gir bare symmetriske strukturer. eml er bevisst skjev — og å sette eksponential og logaritme på hver sin side av et minus gjør operatoren til en vippe som, stablet, kan helle i hvilken som helst retning.",
    examplesLabel: "Konkrete verdier",
    sideTitle: "Operatoren",
  },
  reading: {
    pretitle: "Lese bildet · Domenefarging",
    title: "Hver piksel er et komplekst utfall",
    p1: "Bildene er ikke pynt. Hvert av dem følger samme oppskrift: skjermen er det komplekse planet (realdel vannrett, imaginærdel loddrett); EML-treet evalueres i hver piksel; det resulterende komplekse tallet w velger en farge.",
    rowHue: "velger kuløren. En full omdreining rundt null går gjennom paletten én gang.",
    rowMag: "setter lysstyrken. En dobling av størrelsen krysser en lys ring.",
    rowZero: "faller ned i blekk — feltet har et nullpunkt.",
    rowInf: "brennes til hvitt — der finnes en pol.",
    rowGrid: "markerer heltallsverdier i real- og imaginærretning så posisjoner kan leses av.",
    closing:
      "Skiven til venstre er det enkleste mulige eksemplaret: w = z selv. Hvert senere bilde er en deformasjon av denne skiven gjennom et EML-tre.",
  },
  stationTitles: {
    exp: { pretitle: "Stasjon I — Eksponential", title: "Mat én inn i høyre spor" },
    ln: { pretitle: "Stasjon II — Logaritme", title: "Tre EML-er flettes til ln" },
    id: { pretitle: "Stasjon III — Identitet", title: "Selv det å ikke gjøre noe koster et tre" },
    selfdual: { pretitle: "Stasjon IV — Selvdual", title: "Atomet ser på seg selv" },
    twin: { pretitle: "Stasjon V — Tvilling", title: "Exp og log brettes inn i hverandre" },
    "param-vortex": { pretitle: "Stasjon VI — Parametrisk virvel", title: "Et håndtak på kalkylen" },
    cathedral: { pretitle: "Stasjon VII — Katedral", title: "Stablet rosett" },
    nebula: { pretitle: "Stasjon VIII — Stjernetåke", title: "Der kalkylen renner over" },
  },
  verifier: {
    pretitle: "Mellomspill · Kvitteringer",
    title: "Trærne er ikke gester.",
    intro:
      "De gir rett tall. Velg en vilkårlig z og EML-rekonstruksjonene av eˣ, ln og identitet gir — innenfor flyttallsfeil — det de klassiske funksjonene gir.",
    labelRe: "Re(z)",
    labelIm: "Im(z)",
    legend: "feil < 10⁻⁶ · feil < 10⁻³ · grenskutt eller overflyt",
  },
  complexity: {
    pretitle: "Tabell IV · Kompleksitet",
    title: "Hvor store er trærne egentlig?",
    intro:
      "Artikkelen måler hver rekonstruksjon i RPN-tegn — EML-treets lengde i omvendt polsk notasjon. Mønsteret: det billige forblir billig; det dyre blir urimelig.",
    headTarget: "mål",
    headK: "K (RPN-lengde)",
    headNote: "merknad",
    note:
      "Se på hoppene. Fra eˣ (K = 3) til identitet (K = 9) tredobles det. Fra identitet til multiplikasjon, nær fem ganger så mye. Kalkylen når overalt — men ikke alltid billig.",
  },
  limits: {
    pretitle: "Forbehold · Hva den ikke kan",
    title: "En katedral med sprekker",
    intro:
      "Artikkelen krever ikke total universalitet. Et svar fra 2026 av Stylewarning viste moteksempler — elementære funksjoner som ingen EML-nøsting kan gjengi eksakt. ‘Nesten’ i påstanden gjør reelt arbeid.",
  },
  garden: {
    pretitle: "Hage · Katalogen",
    title: "Åtte trær, åtte verdener",
    intro:
      "Hver flis er samme operator. Variasjonen er strukturell: ulike nøstinger presser det komplekse planet inn i ulike geometrier. Palettene skifter for å holde øyet ærlig.",
  },
  closing: {
    pill: "Utgang",
    title: "Katedralen ble bygget av én eneste stein.",
    intro:
      "Det som står igjen er selve påstanden, lyser svakt bak matematikken: å nøste én eneste primitiv er nok til å se resten. Bildene er bieffekten — selve argumentet er trærne.",
    ctaAtelier: "→ Gå inn i Atelieret · bygg ditt eget",
    ctaResonance: "→ Hør Resonansen · spill",
    meta:
      "bygget på arxiv 2603.21852 · domenefarging i webgl2 · alle bilder gjengitt live av samme seks-linjers shader",
  },
  imprint: {
    title: "Juridisk informasjon",
    intro: "Opplysninger i henhold til § 5 TMG (Tyskland).",
    company: "Selskap",
    address: "Adresse",
    register: "Handelsregister",
    management: "Ledelse",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-post",
    responsibility: "Ansvarlig for innholdet (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, adresse som over.",
    disclaimer: "Ansvarsfraskrivelse",
    disclaimerBody:
      "Alle tekster og bilder på dette nettstedet presenteres som et ikke-kommersielt visuelt essay. Den siterte artikkelen forblir sin forfatters verk; kildekoden er publisert under en åpen lisens (se repository-lenken). Eksterne lenker åpnes i nytt vindu — vi tar ikke ansvar for innholdet på tredjeparts nettsteder.",
  },
};

export const MESSAGES: Record<Locale, Dict> = { en, de, es, fr, it, pt, sv, no };
