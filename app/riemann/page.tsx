"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { RiemannSignatureHero } from "@/components/signature/RiemannSignatureHero";
import { RiemannZetaPath } from "@/components/RiemannZetaPath";
import { palette } from "@/lib/visual/palette";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-teal";

// --------------------------------------------------------------------------
// All Riemann prose lives inline here so the page can carry the full
// 8-locale story without bloating the shared i18n bundles.
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
  figureCaption: string;
  zetaPathCaption: string;
  zetaPathTLabel: string;
  zetaPathZerosFound: string;
  zetaPathHint: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// First eight non-trivial zero heights — fact, not translation. Used as
// dot positions on the inline figure.
const FIRST_ZEROS = [14.13, 21.02, 25.01, 30.42, 32.93, 37.59, 40.92, 43.33];

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Analysis",
    title: "The Riemann Hypothesis",
    tagline: "Every non-trivial zero of ζ lies on a single vertical line.",
    intro:
      "Riemann's 1859 memoir analytically continued a humble sum of reciprocals to the whole complex plane, then noticed that the places where the result vanishes seem to all share one real part: ½. A proof would lock down the distribution of prime numbers tighter than any bound we have. A counter-example would topple a century and a half of consequences. None has been found.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "A function. A line. A century-old silence.",
    cards: [
      {
        label: "01",
        title: "The conjecture",
        body: "Take the function ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, extend it (analytically) to all complex s, and ask where it equals zero. Some zeros are trivial — the negative even integers. All the others, says Riemann, lie on the vertical line Re(s) = ½. Trillions of them have been checked. Not one has missed.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "The first non-trivial zero sits at s = ½ + 14.13… · i. The next at ½ + 21.02… · i, then ½ + 25.01… · i, marching upward forever. Each one is a tiny act of resonance between the integers — the heights are not random, they are the spectrum of how the primes deviate from average.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Hundreds of theorems are written in the conditional form 'assuming RH, then…'. A proof would activate them all simultaneously: tighter prime gaps, sharper error terms in number theory, hardness guarantees in cryptography, and a deeper bridge between analysis and arithmetic. It is Hilbert's eighth problem and one of the seven Clay Millennium Prizes.",
      },
    ],
    tryIt:
      "Below: walk the function ζ along the critical line and watch it loop through the origin at every zero. The Explorer scales the same picture up.",
  },
  sections: [
    {
      pretitle: "Section 01 · Euler's product",
      title: "ζ has the primes baked into its DNA",
      body: "In 1737, almost a century before Riemann, Euler noticed that the infinite sum ζ(s) = Σ 1/nˢ can be rewritten as an infinite product over primes: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). The equivalence is one of the most quietly stunning identities in mathematics — the additive structure of the integers and the multiplicative structure of the primes are literally the same object, viewed from two sides. Once you know that, the question 'where does ζ vanish?' is no longer a question about a function; it is a question about the primes themselves.",
    },
    {
      pretitle: "Section 02 · Analytic continuation",
      title: "Extending a sum that diverges",
      body: "The series Σ 1/nˢ only converges when Re(s) > 1. Riemann's 1859 paper performs a single, audacious move: it shows that ζ has a unique extension to the entire complex plane (apart from a single pole at s = 1), and that this extension satisfies the symmetric functional equation ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). The new ζ is no longer defined by the sum — it is defined by being the only well-behaved function that agrees with the sum where the sum makes sense. Everything afterwards is geometry on this extended object.",
    },
    {
      pretitle: "Section 03 · The critical strip",
      title: "Trivial zeros outside, the interesting ones inside",
      body: "The functional equation immediately reveals the 'trivial' zeros at s = −2, −4, −6, … — the sine factor forces them. Everything else has to live inside the critical strip 0 < Re(s) < 1, the only place where the function still has room to oscillate. Riemann's hypothesis is the claim that this whole strip is, in fact, deceptive: the non-trivial zeros do not spread out across it, they all collapse onto a single vertical seam down the middle, Re(s) = ½. The strip is a stage; the seam is where the action is.",
    },
    {
      pretitle: "Section 04 · The conjecture",
      title: "Re(s) = ½. Always.",
      body: "Hardy proved in 1914 that there are infinitely many zeros on the critical line. Selberg later showed a positive fraction of all zeros sit there; that fraction has since been pushed above 41% (Conrey, 1989) and edged upward every decade. The hypothesis itself is the maximal statement: not 'most' zeros, not 'all but finitely many' — all of them, with no exception, on Re(s) = ½. It is the sharpest conceivable form of a probabilistic intuition about primes — that they are as uniformly distributed as a deterministic sequence can be.",
    },
    {
      pretitle: "Section 05 · What a proof would buy us",
      title: "The downstream theorems are already written",
      body: "The prime counting function π(x) is approximated by the logarithmic integral Li(x). RH is equivalent to the error |π(x) − Li(x)| being bounded by √x log x — the sharpest bound possible, and tighter than anything currently known. Hundreds of further statements are RH-equivalent: bounds on the Möbius function, on character sums, on growth of arithmetic functions. Cryptography quietly depends on these for its asymptotic security claims. A proof would not change a single computation, but it would settle every conditional theorem in one breath.",
    },
    {
      pretitle: "Section 06 · Numerical evidence and quantum chaos",
      title: "The zeros line up — and they look like a physics spectrum",
      body: "Computer verifications have placed the first ten trillion non-trivial zeros exactly on the critical line (Gourdon, 2004 and successors). And then, in 1972, Hugh Montgomery and Freeman Dyson noticed something stranger than any number-theory result: the statistics of the spacings between zeta zeros match precisely the spacings between eigenvalues of large random Hermitian matrices — the same matrices physicists use to model the energy levels of heavy atomic nuclei. The primes, in some sense yet to be understood, are humming at the resonant frequency of a quantum system.",
    },
  ],
  figureCaption:
    "The critical strip 0 < Re(s) < 1. The dashed verticals mark its borders; the warm line in the middle is Re(s) = ½. Each bead is one of the first eight non-trivial zero heights — 14.13, 21.02, 25.01, 30.42, 32.93, 37.59, 40.92, 43.33.",
  zetaPathCaption: "ζ(½ + it) traced in the complex plane",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "zeros crossed",
  zetaPathHint:
    "Each time the curve loops through the origin, ζ has hit zero — and the imaginary part t at that moment is the height of a non-trivial zero. Drag the slider up: the first loop arrives around t ≈ 14.13, the second around 21.02, the third around 25.01.",
  closingPretitle: "See the engine",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer draws ζ along the critical line at full size, and lets you reconstruct the prime counting staircase from the zeros themselves — one Riemann correction at a time. The clean curves you build are the clearest physical statement of what the hypothesis is really claiming.",
  ctaLabel: "→ Open the Explorer",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Analysis",
    title: "Die Riemann-Hypothese",
    tagline: "Jede nichttriviale Nullstelle von ζ liegt auf einer einzigen senkrechten Linie.",
    intro:
      "Riemanns Abhandlung von 1859 setzte eine bescheidene Reihe von Kehrwerten analytisch in die gesamte komplexe Ebene fort und stellte fest, dass alle Nullstellen der so entstandenen Funktion denselben Realteil zu haben scheinen: ½. Ein Beweis würde die Verteilung der Primzahlen schärfer fixieren als jede Schranke, die wir kennen. Ein Gegenbeispiel würde anderthalb Jahrhunderte Konsequenzen kippen. Beides bleibt aus.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Eine Funktion. Eine Linie. Ein Jahrhundert Schweigen.",
    cards: [
      {
        label: "01",
        title: "Die Vermutung",
        body: "Nimm die Funktion ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, setze sie (analytisch) auf alle komplexen s fort und frage, wo sie verschwindet. Einige Nullstellen sind trivial — die negativen geraden Zahlen. Alle anderen, sagt Riemann, liegen auf der senkrechten Linie Re(s) = ½. Billionen wurden geprüft. Nicht eine danebenliegt.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Die erste nichttriviale Nullstelle sitzt bei s = ½ + 14,13… · i. Die nächste bei ½ + 21,02… · i, dann ½ + 25,01… · i, und so weiter, immer höher. Jede ist ein kleiner Akt der Resonanz zwischen den ganzen Zahlen — die Höhen sind nicht zufällig, sie bilden das Spektrum, mit dem die Primzahlen vom Mittel abweichen.",
      },
      {
        label: "03",
        title: "Warum es wichtig ist",
        body: 'Hunderte Sätze stehen im Konjunktiv „Angenommen RH gilt, dann …“. Ein Beweis würde sie alle auf einmal aktivieren: engere Primzahllücken, schärfere Fehlerterme in der Zahlentheorie, Härtegarantien in der Kryptographie, eine tiefere Brücke zwischen Analysis und Arithmetik. Es ist Hilberts achtes Problem und eines der sieben Clay Millennium Prizes.',
      },
    ],
    tryIt:
      "Unten: laufe mit ζ entlang der kritischen Linie und beobachte, wie die Kurve bei jeder Nullstelle durch den Ursprung schlüpft. Der Explorer skaliert dasselbe Bild hoch.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Eulers Produkt",
      title: "ζ hat die Primzahlen in der DNA",
      body: 'Schon 1737, fast ein Jahrhundert vor Riemann, bemerkte Euler, dass die unendliche Summe ζ(s) = Σ 1/nˢ als unendliches Produkt über die Primzahlen geschrieben werden kann: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). Die Identität gehört zu den leise atemberaubendsten der Mathematik — die additive Struktur der ganzen Zahlen und die multiplikative Struktur der Primzahlen sind buchstäblich dasselbe Objekt, nur von zwei Seiten gesehen. Sobald man das weiß, ist die Frage „Wo verschwindet ζ?“ keine Frage über eine Funktion mehr; sie ist eine Frage über die Primzahlen selbst.',
    },
    {
      pretitle: "Abschnitt 02 · Analytische Fortsetzung",
      title: "Eine divergierende Summe fortsetzen",
      body: "Die Reihe Σ 1/nˢ konvergiert nur für Re(s) > 1. Riemanns Arbeit von 1859 vollzieht einen einzigen, kühnen Zug: sie zeigt, dass ζ eine eindeutige Fortsetzung auf die gesamte komplexe Ebene besitzt (bis auf einen einzigen Pol bei s = 1) und dass diese Fortsetzung die symmetrische Funktionalgleichung ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s) erfüllt. Das neue ζ ist nicht mehr durch die Summe definiert — es ist als die einzige wohlerzogene Funktion definiert, die mit der Summe übereinstimmt, wo die Summe Sinn ergibt. Alles Weitere ist Geometrie auf diesem fortgesetzten Objekt.",
    },
    {
      pretitle: "Abschnitt 03 · Der kritische Streifen",
      title: "Triviale Nullstellen außerhalb, interessante drinnen",
      body: 'Die Funktionalgleichung verrät sofort die „trivialen“ Nullstellen bei s = −2, −4, −6, … — der Sinusfaktor erzwingt sie. Alles andere muss im kritischen Streifen 0 < Re(s) < 1 leben, dem einzigen Ort, an dem die Funktion noch Spielraum hat zu oszillieren. Riemanns Hypothese ist die Behauptung, dass dieser ganze Streifen letztlich täuscht: die nichttrivialen Nullstellen verteilen sich nicht über ihn, sie kollabieren auf eine einzige senkrechte Naht in der Mitte, Re(s) = ½. Der Streifen ist die Bühne; die Naht ist, wo etwas passiert.',
    },
    {
      pretitle: "Abschnitt 04 · Die Vermutung",
      title: "Re(s) = ½. Immer.",
      body: 'Hardy bewies 1914, dass es unendlich viele Nullstellen auf der kritischen Linie gibt. Selberg zeigte später, dass ein positiver Anteil aller Nullstellen dort sitzt; dieser Anteil wurde über 41 % gedrückt (Conrey, 1989) und steigt seitdem mit jedem Jahrzehnt. Die Hypothese selbst ist die maximale Aussage: nicht „die meisten“, nicht „alle bis auf endlich viele“ — alle, ohne Ausnahme, auf Re(s) = ½. Es ist die schärfste denkbare Form einer wahrscheinlichkeitstheoretischen Intuition über Primzahlen — dass sie so gleichmäßig verteilt sind, wie eine deterministische Folge nur sein kann.',
    },
    {
      pretitle: "Abschnitt 05 · Was ein Beweis brächte",
      title: "Die Folgesätze stehen längst geschrieben",
      body: "Die Primzahlzählfunktion π(x) wird vom Integrallogarithmus Li(x) approximiert. RH ist äquivalent dazu, dass der Fehler |π(x) − Li(x)| durch √x log x beschränkt ist — die schärfste denkbare Schranke, enger als alles bekannte. Hunderte weitere Aussagen sind RH-äquivalent: Schranken für die Möbius-Funktion, für Charaktersummen, für das Wachstum arithmetischer Funktionen. Die Kryptographie hängt still davon ab, was ihre asymptotischen Sicherheitsbehauptungen betrifft. Ein Beweis würde keine einzige Rechnung ändern, aber jeden konditionalen Satz in einem Atemzug erledigen.",
    },
    {
      pretitle: "Abschnitt 06 · Numerische Evidenz und Quantenchaos",
      title: "Die Nullstellen reihen sich auf — wie ein Physik-Spektrum",
      body: "Computerverifikationen haben die ersten zehn Billionen nichttrivialen Nullstellen exakt auf die kritische Linie gelegt (Gourdon, 2004 und Nachfolger). Und 1972 bemerkten Hugh Montgomery und Freeman Dyson etwas Seltsameres als jedes zahlentheoretische Resultat: die Statistik der Abstände zwischen Zeta-Nullstellen stimmt exakt mit der Statistik der Eigenwertabstände großer zufälliger hermitescher Matrizen überein — derselben Matrizen, mit denen Physiker:innen die Energieniveaus schwerer Atomkerne modellieren. Die Primzahlen, in einem noch zu klärenden Sinn, summen auf der Resonanzfrequenz eines Quantensystems.",
    },
  ],
  figureCaption:
    "Der kritische Streifen 0 < Re(s) < 1. Die gestrichelten Senkrechten markieren seine Ränder; die warme Linie in der Mitte ist Re(s) = ½. Jede Perle ist eine der ersten acht nichttrivialen Nullstellenhöhen — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) in der komplexen Ebene gezeichnet",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "Nullstellen passiert",
  zetaPathHint:
    "Jedes Mal, wenn die Kurve durch den Ursprung läuft, hat ζ den Wert null erreicht — und der Imaginärteil t in diesem Moment ist die Höhe einer nichttrivialen Nullstelle. Ziehe den Regler hoch: die erste Schleife kommt bei t ≈ 14,13, die zweite bei 21,02, die dritte bei 25,01.",
  closingPretitle: "Sieh die Maschine",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer zeichnet ζ entlang der kritischen Linie in voller Größe und lässt dich die Primzahlzähltreppe aus den Nullstellen selbst rekonstruieren — eine Riemann-Korrektur nach der anderen. Die sauberen Kurven, die du baust, sind die klarste physische Aussage darüber, was die Hypothese eigentlich behauptet.",
  ctaLabel: "→ Zum Explorer",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Análisis",
    title: "La hipótesis de Riemann",
    tagline: "Todo cero no trivial de ζ está en una única línea vertical.",
    intro:
      "La memoria de Riemann de 1859 continuó analíticamente una humilde suma de inversos hacia todo el plano complejo y observó que los lugares donde el resultado se anula parecen compartir una misma parte real: ½. Una prueba fijaría la distribución de los primos con más precisión que cualquier cota conocida. Un contraejemplo derrumbaría siglo y medio de consecuencias. No se ha encontrado ninguno.",
    ctaInteractive: "→ Abrir el Explorer",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Una función. Una línea. Un siglo y medio de silencio.",
    cards: [
      {
        label: "01",
        title: "La conjetura",
        body: "Toma la función ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, prolóngala (analíticamente) a todos los s complejos y pregunta dónde vale cero. Algunos ceros son triviales — los enteros pares negativos. Todos los demás, dice Riemann, están en la línea vertical Re(s) = ½. Se han comprobado billones. Ninguno ha fallado.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "El primer cero no trivial está en s = ½ + 14,13… · i. El siguiente en ½ + 21,02… · i, luego ½ + 25,01… · i, marchando hacia arriba sin fin. Cada uno es un pequeño acto de resonancia entre los enteros — las alturas no son aleatorias, son el espectro con el que los primos se desvían de la media.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "Cientos de teoremas están escritos en forma condicional «suponiendo RH, entonces…». Una prueba los activaría todos a la vez: huecos entre primos más estrechos, términos de error más afilados en teoría de números, garantías de dureza en criptografía, y un puente más profundo entre análisis y aritmética. Es el octavo problema de Hilbert y uno de los siete premios Clay Millennium.",
      },
    ],
    tryIt:
      "Abajo: camina con la función ζ por la línea crítica y observa cómo la curva pasa por el origen en cada cero. El Explorer escala la misma imagen.",
  },
  sections: [
    {
      pretitle: "Sección 01 · El producto de Euler",
      title: "ζ lleva los primos en el ADN",
      body: "En 1737, casi un siglo antes que Riemann, Euler notó que la suma infinita ζ(s) = Σ 1/nˢ puede reescribirse como producto infinito sobre los primos: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). La equivalencia es una de las identidades más silenciosamente espectaculares de la matemática — la estructura aditiva de los enteros y la estructura multiplicativa de los primos son literalmente el mismo objeto, visto desde dos caras. Sabido esto, la pregunta «¿dónde se anula ζ?» deja de ser sobre una función; es una pregunta sobre los primos mismos.",
    },
    {
      pretitle: "Sección 02 · Continuación analítica",
      title: "Extender una suma que diverge",
      body: "La serie Σ 1/nˢ solo converge cuando Re(s) > 1. El artículo de Riemann de 1859 ejecuta un único movimiento audaz: muestra que ζ admite una extensión única a todo el plano complejo (salvo un único polo en s = 1) y que esa extensión satisface la ecuación funcional simétrica ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). La nueva ζ ya no se define por la suma — se define como la única función bien comportada que coincide con la suma donde ésta tiene sentido. Todo lo posterior es geometría sobre este objeto prolongado.",
    },
    {
      pretitle: "Sección 03 · La banda crítica",
      title: "Ceros triviales fuera, interesantes dentro",
      body: "La ecuación funcional delata enseguida los ceros «triviales» en s = −2, −4, −6, … — los obliga el factor seno. Todo lo demás tiene que vivir en la banda crítica 0 < Re(s) < 1, el único lugar donde la función conserva espacio para oscilar. La hipótesis de Riemann afirma que toda esa banda es, en realidad, engañosa: los ceros no triviales no se reparten por ella, sino que colapsan sobre una única costura vertical en el medio, Re(s) = ½. La banda es el escenario; la costura es donde ocurre la acción.",
    },
    {
      pretitle: "Sección 04 · La conjetura",
      title: "Re(s) = ½. Siempre.",
      body: "Hardy demostró en 1914 que hay infinitos ceros en la línea crítica. Selberg mostró después que una proporción positiva de todos los ceros está allí; esa proporción ha sido empujada por encima del 41 % (Conrey, 1989) y sube cada década. La hipótesis es la afirmación maximal: no «la mayoría» de los ceros, ni «todos salvo finitos» — todos, sin excepción, en Re(s) = ½. Es la forma más afilada posible de una intuición probabilística sobre los primos: que están distribuidos tan uniformemente como puede estarlo una sucesión determinista.",
    },
    {
      pretitle: "Sección 05 · Qué nos compraría una prueba",
      title: "Los teoremas posteriores ya están escritos",
      body: "La función contadora de primos π(x) se aproxima por la integral logarítmica Li(x). RH es equivalente a que el error |π(x) − Li(x)| esté acotado por √x log x — la cota más fina posible y más estrecha que cualquier conocida. Cientos de enunciados son RH-equivalentes: cotas sobre la función de Möbius, sobre sumas de caracteres, sobre el crecimiento de funciones aritméticas. La criptografía depende silenciosamente de ellos para sus garantías asintóticas de seguridad. Una prueba no cambiaría un solo cálculo, pero zanjaría todo teorema condicional en un mismo aliento.",
    },
    {
      pretitle: "Sección 06 · Evidencia numérica y caos cuántico",
      title: "Los ceros se alinean — y parecen un espectro físico",
      body: "Las verificaciones por ordenador han colocado los primeros diez billones de ceros no triviales exactamente sobre la línea crítica (Gourdon, 2004 y sucesores). Y en 1972 Hugh Montgomery y Freeman Dyson notaron algo más extraño que cualquier resultado de teoría de números: la estadística de los espaciados entre ceros de zeta coincide exactamente con la estadística de los espaciados entre autovalores de grandes matrices hermíticas aleatorias — las mismas matrices con las que la física modela los niveles de energía de núcleos pesados. Los primos, en algún sentido aún por entender, vibran a la frecuencia de resonancia de un sistema cuántico.",
    },
  ],
  figureCaption:
    "La banda crítica 0 < Re(s) < 1. Las verticales discontinuas marcan sus bordes; la línea cálida del medio es Re(s) = ½. Cada cuenta es una de las primeras ocho alturas de ceros no triviales — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) trazada en el plano complejo",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "ceros cruzados",
  zetaPathHint:
    "Cada vez que la curva pasa por el origen, ζ ha alcanzado el cero — y la parte imaginaria t en ese instante es la altura de un cero no trivial. Sube el deslizador: el primer lazo aparece hacia t ≈ 14,13, el segundo hacia 21,02, el tercero hacia 25,01.",
  closingPretitle: "Mira el motor",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador dibuja ζ a tamaño completo a lo largo de la línea crítica y te deja reconstruir la escalera contadora de primos a partir de los propios ceros — una corrección de Riemann por vez. Las curvas limpias que armes son la declaración más física de lo que la hipótesis realmente afirma.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Analyse",
    title: "L'hypothèse de Riemann",
    tagline: "Tout zéro non trivial de ζ se trouve sur une seule droite verticale.",
    intro:
      "Le mémoire de Riemann de 1859 prolonge analytiquement une humble somme d'inverses à tout le plan complexe, puis remarque que les endroits où le résultat s'annule semblent partager une même partie réelle : ½. Une preuve fixerait la distribution des nombres premiers avec plus de précision que toute borne connue. Un contre-exemple ferait s'écrouler un siècle et demi de conséquences. Aucun n'a été trouvé.",
    ctaInteractive: "→ Ouvrir l'Explorer",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Une fonction. Une droite. Un siècle et demi de silence.",
    cards: [
      {
        label: "01",
        title: "La conjecture",
        body: "Prends la fonction ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, prolonge-la (analytiquement) à tout s complexe, et demande où elle s'annule. Certains zéros sont triviaux — les entiers pairs négatifs. Tous les autres, dit Riemann, sont sur la droite verticale Re(s) = ½. Des milliers de milliards ont été vérifiés. Aucun n'a manqué.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Le premier zéro non trivial est à s = ½ + 14,13… · i. Le suivant à ½ + 21,02… · i, puis ½ + 25,01… · i, et ils montent sans fin. Chacun est un petit acte de résonance entre les entiers — les hauteurs ne sont pas aléatoires, elles forment le spectre selon lequel les premiers s'écartent de la moyenne.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "Des centaines de théorèmes sont écrits au conditionnel « en supposant RH, alors… ». Une preuve les activerait tous en même temps : écarts entre premiers plus serrés, termes d'erreur plus précis en théorie des nombres, garanties de dureté en cryptographie, et un pont plus profond entre analyse et arithmétique. C'est le huitième problème de Hilbert et l'un des sept prix du millénaire de Clay.",
      },
    ],
    tryIt:
      "Ci-dessous : promène-toi avec ζ le long de la droite critique et regarde la courbe boucler autour de l'origine à chaque zéro. L'Explorer agrandit la même image.",
  },
  sections: [
    {
      pretitle: "Section 01 · Le produit d'Euler",
      title: "ζ porte les premiers dans son ADN",
      body: "Dès 1737, presque un siècle avant Riemann, Euler remarque que la somme infinie ζ(s) = Σ 1/nˢ peut s'écrire comme produit infini sur les nombres premiers : ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). L'équivalence est l'une des identités les plus discrètement bouleversantes des mathématiques — la structure additive des entiers et la structure multiplicative des premiers sont littéralement le même objet vu sous deux angles. Une fois cela admis, la question « où ζ s'annule-t-elle ? » n'est plus une question sur une fonction ; c'est une question sur les premiers eux-mêmes.",
    },
    {
      pretitle: "Section 02 · Prolongement analytique",
      title: "Prolonger une somme qui diverge",
      body: "La série Σ 1/nˢ ne converge que pour Re(s) > 1. L'article de Riemann de 1859 exécute un seul geste audacieux : il montre que ζ admet une extension unique à tout le plan complexe (sauf un pôle unique en s = 1) et que cette extension satisfait l'équation fonctionnelle symétrique ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). La nouvelle ζ n'est plus définie par la somme — elle est définie comme l'unique fonction bien élevée qui coïncide avec la somme là où celle-ci a un sens. Tout le reste est géométrie sur cet objet prolongé.",
    },
    {
      pretitle: "Section 03 · La bande critique",
      title: "Zéros triviaux à l'extérieur, intéressants à l'intérieur",
      body: "L'équation fonctionnelle révèle aussitôt les zéros « triviaux » en s = −2, −4, −6, … — le facteur sinus les impose. Tout le reste doit vivre dans la bande critique 0 < Re(s) < 1, seul endroit où la fonction a encore de l'espace pour osciller. L'hypothèse de Riemann affirme que toute cette bande est en réalité trompeuse : les zéros non triviaux ne s'y répartissent pas, ils s'effondrent sur une seule couture verticale au milieu, Re(s) = ½. La bande est la scène ; la couture est là où ça se passe.",
    },
    {
      pretitle: "Section 04 · La conjecture",
      title: "Re(s) = ½. Toujours.",
      body: "Hardy a prouvé en 1914 qu'il existe une infinité de zéros sur la droite critique. Selberg a montré plus tard qu'une proportion strictement positive de tous les zéros s'y trouve ; cette proportion a été poussée au-delà de 41 % (Conrey, 1989) et progresse chaque décennie. L'hypothèse elle-même est l'énoncé maximal : non pas « la plupart » des zéros, ni « tous sauf un nombre fini » — tous, sans exception, sur Re(s) = ½. C'est la forme la plus aiguë concevable d'une intuition probabiliste sur les premiers : qu'ils sont aussi uniformément distribués qu'une suite déterministe peut l'être.",
    },
    {
      pretitle: "Section 05 · Ce qu'une preuve nous offrirait",
      title: "Les théorèmes en aval sont déjà écrits",
      body: "La fonction de comptage des premiers π(x) est approchée par le logarithme intégral Li(x). RH équivaut à ce que l'erreur |π(x) − Li(x)| soit bornée par √x log x — la borne la plus fine possible, plus étroite que tout ce que l'on connaît. Des centaines d'autres énoncés sont RH-équivalents : bornes sur la fonction de Möbius, sur les sommes de caractères, sur la croissance des fonctions arithmétiques. La cryptographie en dépend silencieusement pour ses garanties asymptotiques de sécurité. Une preuve ne changerait pas un seul calcul, mais elle réglerait tous les théorèmes conditionnels d'un même souffle.",
    },
    {
      pretitle: "Section 06 · Preuves numériques et chaos quantique",
      title: "Les zéros s'alignent — et ressemblent à un spectre de physique",
      body: "Les vérifications par ordinateur ont placé les dix premiers billions de zéros non triviaux exactement sur la droite critique (Gourdon, 2004 et successeurs). Et en 1972, Hugh Montgomery et Freeman Dyson ont remarqué quelque chose de plus étrange qu'aucun résultat de théorie des nombres : la statistique des écarts entre zéros de zêta coïncide exactement avec celle des écarts entre valeurs propres de grandes matrices hermitiennes aléatoires — les mêmes matrices que les physiciens utilisent pour modéliser les niveaux d'énergie des noyaux lourds. Les premiers, en un sens qui reste à éclaircir, vibrent à la fréquence de résonance d'un système quantique.",
    },
  ],
  figureCaption:
    "La bande critique 0 < Re(s) < 1. Les verticales en pointillés en marquent les bords ; la ligne chaude au milieu est Re(s) = ½. Chaque perle est l'une des huit premières hauteurs de zéros non triviaux — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) tracée dans le plan complexe",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "zéros traversés",
  zetaPathHint:
    "Chaque fois que la courbe boucle autour de l'origine, ζ a touché zéro — et la partie imaginaire t à cet instant est la hauteur d'un zéro non trivial. Glisse le curseur vers le haut : la première boucle arrive vers t ≈ 14,13, la deuxième vers 21,02, la troisième vers 25,01.",
  closingPretitle: "Vois le moteur",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur trace ζ à pleine taille le long de la droite critique et te laisse reconstruire l'escalier de comptage des premiers à partir des zéros eux-mêmes — une correction de Riemann à la fois. Les courbes propres que tu construis sont l'énoncé physique le plus clair de ce que l'hypothèse affirme vraiment.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Analisi",
    title: "L'ipotesi di Riemann",
    tagline: "Ogni zero non banale di ζ giace su un'unica retta verticale.",
    intro:
      "La memoria di Riemann del 1859 prolungò analiticamente un'umile somma di reciproci a tutto il piano complesso, e poi notò che i punti in cui il risultato si annulla sembrano condividere tutti la stessa parte reale: ½. Una dimostrazione fisserebbe la distribuzione dei numeri primi più stretta di qualsiasi limite noto. Un controesempio rovescerebbe un secolo e mezzo di conseguenze. Nessuno dei due è stato trovato.",
    ctaInteractive: "→ Apri l'Explorer",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Una funzione. Una retta. Un secolo e mezzo di silenzio.",
    cards: [
      {
        label: "01",
        title: "La congettura",
        body: "Prendi la funzione ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, prolungala (analiticamente) a tutti gli s complessi, e chiediti dove vale zero. Alcuni zeri sono banali — gli interi pari negativi. Tutti gli altri, dice Riemann, si trovano sulla retta verticale Re(s) = ½. Ne sono stati controllati migliaia di miliardi. Nessuno ha sgarrato.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Il primo zero non banale è in s = ½ + 14,13… · i. Il successivo in ½ + 21,02… · i, poi ½ + 25,01… · i, e così via verso l'alto, all'infinito. Ognuno è un piccolo atto di risonanza tra gli interi — le altezze non sono casuali, formano lo spettro con cui i primi si scostano dalla media.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Centinaia di teoremi sono scritti al condizionale «assumendo RH, allora…». Una dimostrazione li attiverebbe tutti in un colpo: lacune tra primi più strette, termini d'errore più affilati in teoria dei numeri, garanzie di durezza in crittografia, e un ponte più profondo tra analisi e aritmetica. È l'ottavo problema di Hilbert e uno dei sette Clay Millennium Prizes.",
      },
    ],
    tryIt:
      "Sotto: cammina con ζ lungo la retta critica e guarda la curva passare per l'origine a ogni zero. L'Explorer ingrandisce la stessa immagine.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · Il prodotto di Eulero",
      title: "ζ ha i primi nel DNA",
      body: "Nel 1737, quasi un secolo prima di Riemann, Eulero notò che la somma infinita ζ(s) = Σ 1/nˢ può essere riscritta come prodotto infinito sui primi: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). L'equivalenza è una delle identità più silenziosamente sbalorditive della matematica — la struttura additiva degli interi e la struttura moltiplicativa dei primi sono letteralmente lo stesso oggetto, visti da due lati. Saputo questo, la domanda «dove si annulla ζ?» smette di essere una domanda su una funzione; è una domanda sui primi stessi.",
    },
    {
      pretitle: "Sezione 02 · Continuazione analitica",
      title: "Estendere una somma che diverge",
      body: "La serie Σ 1/nˢ converge solo per Re(s) > 1. L'articolo di Riemann del 1859 compie un unico, audace movimento: mostra che ζ ammette un'estensione unica a tutto il piano complesso (tranne un singolo polo in s = 1) e che tale estensione soddisfa l'equazione funzionale simmetrica ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). La nuova ζ non è più definita dalla somma — è definita come l'unica funzione ben educata che coincide con la somma laddove la somma ha senso. Tutto il resto è geometria su questo oggetto esteso.",
    },
    {
      pretitle: "Sezione 03 · La striscia critica",
      title: "Zeri banali fuori, interessanti dentro",
      body: "L'equazione funzionale rivela subito gli zeri «banali» in s = −2, −4, −6, … — li impone il fattore seno. Tutto il resto deve vivere nella striscia critica 0 < Re(s) < 1, l'unico luogo in cui la funzione ha ancora margine per oscillare. L'ipotesi di Riemann afferma che tutta quella striscia è in realtà ingannevole: gli zeri non banali non vi si distribuiscono, collassano su un'unica cucitura verticale in mezzo, Re(s) = ½. La striscia è il palco; la cucitura è dove accade qualcosa.",
    },
    {
      pretitle: "Sezione 04 · La congettura",
      title: "Re(s) = ½. Sempre.",
      body: "Hardy dimostrò nel 1914 che ci sono infiniti zeri sulla retta critica. Selberg mostrò poi che una proporzione positiva di tutti gli zeri sta lì; tale proporzione è stata portata oltre il 41 % (Conrey, 1989) e cresce ogni decennio. L'ipotesi stessa è l'enunciato massimale: non «la maggioranza» degli zeri, non «tutti tranne un numero finito» — tutti, senza eccezione, su Re(s) = ½. È la forma più affilata concepibile di un'intuizione probabilistica sui primi: che siano distribuiti tanto uniformemente quanto una successione deterministica possa esserlo.",
    },
    {
      pretitle: "Sezione 05 · Cosa ci darebbe una dimostrazione",
      title: "I teoremi a valle sono già scritti",
      body: "La funzione contatore dei primi π(x) è approssimata dall'integrale logaritmico Li(x). RH è equivalente al fatto che l'errore |π(x) − Li(x)| sia limitato da √x log x — il limite più stretto possibile, più sottile di qualunque sia noto. Centinaia di altri enunciati sono RH-equivalenti: limiti sulla funzione di Möbius, su somme di caratteri, sulla crescita di funzioni aritmetiche. La crittografia ne dipende silenziosamente per le sue garanzie asintotiche di sicurezza. Una dimostrazione non cambierebbe nemmeno un calcolo, ma chiuderebbe ogni teorema condizionale in un solo respiro.",
    },
    {
      pretitle: "Sezione 06 · Evidenza numerica e caos quantistico",
      title: "Gli zeri si allineano — e somigliano a uno spettro fisico",
      body: "Le verifiche al computer hanno collocato i primi diecimila miliardi di zeri non banali esattamente sulla retta critica (Gourdon, 2004 e successori). E nel 1972, Hugh Montgomery e Freeman Dyson notarono qualcosa di più strano di qualsiasi risultato di teoria dei numeri: la statistica delle distanze tra zeri di zeta coincide esattamente con la statistica delle distanze tra autovalori di grandi matrici hermitiane casuali — le stesse matrici che la fisica usa per modellare i livelli di energia dei nuclei pesanti. I primi, in un senso ancora da chiarire, vibrano alla frequenza di risonanza di un sistema quantistico.",
    },
  ],
  figureCaption:
    "La striscia critica 0 < Re(s) < 1. Le verticali tratteggiate ne marcano i bordi; la linea calda al centro è Re(s) = ½. Ogni perla è una delle prime otto altezze di zeri non banali — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) tracciata nel piano complesso",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "zeri attraversati",
  zetaPathHint:
    "Ogni volta che la curva passa per l'origine, ζ ha toccato zero — e la parte immaginaria t in quell'istante è l'altezza di uno zero non banale. Trascina il cursore in alto: il primo cappio arriva intorno a t ≈ 14,13, il secondo intorno a 21,02, il terzo intorno a 25,01.",
  closingPretitle: "Vedi il motore",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore disegna ζ a piena scala lungo la retta critica e ti lascia ricostruire la scala contatrice dei primi a partire dagli zeri stessi — una correzione di Riemann alla volta. Le curve pulite che monti sono l'enunciato fisico più chiaro di cosa stia davvero affermando l'ipotesi.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Análise",
    title: "A hipótese de Riemann",
    tagline: "Todo zero não trivial de ζ está numa única recta vertical.",
    intro:
      "A memória de Riemann de 1859 prolongou analiticamente uma humilde soma de inversos a todo o plano complexo e notou que os pontos onde o resultado se anula parecem partilhar todos a mesma parte real: ½. Uma demonstração fixaria a distribuição dos primos mais apertada do que qualquer limite conhecido. Um contraexemplo derrubaria século e meio de consequências. Nenhum foi encontrado.",
    ctaInteractive: "→ Abrir o Explorer",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Uma função. Uma recta. Um século e meio de silêncio.",
    cards: [
      {
        label: "01",
        title: "A conjectura",
        body: "Toma a função ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, prolonga-a (analiticamente) a todo s complexo, e pergunta onde vale zero. Alguns zeros são triviais — os inteiros pares negativos. Todos os outros, diz Riemann, estão na recta vertical Re(s) = ½. Já se verificaram biliões. Nenhum falhou.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "O primeiro zero não trivial está em s = ½ + 14,13… · i. O seguinte em ½ + 21,02… · i, depois ½ + 25,01… · i, marchando para cima sem fim. Cada um é um pequeno acto de ressonância entre os inteiros — as alturas não são aleatórias, formam o espectro com que os primos se desviam da média.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Centenas de teoremas estão escritos no condicional «assumindo RH, então…». Uma demonstração activá-los-ia a todos de uma vez: lacunas entre primos mais estreitas, termos de erro mais afinados em teoria dos números, garantias de dureza em criptografia, e uma ponte mais profunda entre análise e aritmética. É o oitavo problema de Hilbert e um dos sete Clay Millennium Prizes.",
      },
    ],
    tryIt:
      "Em baixo: caminha com ζ ao longo da recta crítica e vê como a curva passa pela origem em cada zero. O Explorer amplia a mesma imagem.",
  },
  sections: [
    {
      pretitle: "Secção 01 · O produto de Euler",
      title: "ζ tem os primos no ADN",
      body: "Em 1737, quase um século antes de Riemann, Euler notou que a soma infinita ζ(s) = Σ 1/nˢ pode ser reescrita como produto infinito sobre os primos: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). A equivalência é uma das identidades mais silenciosamente espantosas da matemática — a estrutura aditiva dos inteiros e a estrutura multiplicativa dos primos são literalmente o mesmo objecto, visto por dois lados. Sabido isto, a pergunta «onde se anula ζ?» deixa de ser sobre uma função; é uma pergunta sobre os próprios primos.",
    },
    {
      pretitle: "Secção 02 · Continuação analítica",
      title: "Estender uma soma que diverge",
      body: "A série Σ 1/nˢ só converge para Re(s) > 1. O artigo de Riemann de 1859 executa um único, audaz movimento: mostra que ζ admite uma extensão única a todo o plano complexo (salvo um polo único em s = 1) e que essa extensão satisfaz a equação funcional simétrica ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). A nova ζ deixa de ser definida pela soma — é definida como a única função bem comportada que coincide com a soma onde esta faz sentido. Tudo o que vem depois é geometria sobre este objecto prolongado.",
    },
    {
      pretitle: "Secção 03 · A banda crítica",
      title: "Zeros triviais fora, interessantes dentro",
      body: "A equação funcional denuncia logo os zeros «triviais» em s = −2, −4, −6, … — o factor seno impõe-nos. Tudo o resto tem de viver na banda crítica 0 < Re(s) < 1, o único lugar onde a função ainda tem margem para oscilar. A hipótese de Riemann afirma que toda essa banda é, no fundo, enganadora: os zeros não triviais não se distribuem por ela, colapsam numa única costura vertical no meio, Re(s) = ½. A banda é o palco; a costura é onde acontece a acção.",
    },
    {
      pretitle: "Secção 04 · A conjectura",
      title: "Re(s) = ½. Sempre.",
      body: "Hardy provou em 1914 que existem infinitos zeros na recta crítica. Selberg mostrou depois que uma proporção positiva de todos os zeros aí reside; essa proporção foi empurrada para além de 41 % (Conrey, 1989) e sobe a cada década. A hipótese é o enunciado maximal: não «a maioria» dos zeros, não «todos salvo um número finito» — todos, sem excepção, em Re(s) = ½. É a forma mais afiada concebível de uma intuição probabilística sobre os primos: que estão distribuídos tão uniformemente quanto uma sucessão determinista pode estar.",
    },
    {
      pretitle: "Secção 05 · O que nos compraria uma demonstração",
      title: "Os teoremas a jusante já estão escritos",
      body: "A função contadora de primos π(x) é aproximada pelo integral logarítmico Li(x). RH equivale a que o erro |π(x) − Li(x)| seja limitado por √x log x — o limite mais fino possível, mais estreito do que qualquer um conhecido. Centenas de outros enunciados são RH-equivalentes: limites sobre a função de Möbius, sobre somas de caracteres, sobre o crescimento de funções aritméticas. A criptografia depende silenciosamente disso para as suas garantias assintóticas de segurança. Uma demonstração não mudaria um único cálculo, mas resolveria todos os teoremas condicionais num só fôlego.",
    },
    {
      pretitle: "Secção 06 · Evidência numérica e caos quântico",
      title: "Os zeros alinham-se — e parecem um espectro físico",
      body: "Verificações por computador colocaram os primeiros dez biliões de zeros não triviais exactamente sobre a recta crítica (Gourdon, 2004 e sucessores). E em 1972, Hugh Montgomery e Freeman Dyson notaram algo mais estranho do que qualquer resultado de teoria dos números: a estatística dos espaçamentos entre zeros de zeta coincide exactamente com a dos espaçamentos entre valores próprios de grandes matrizes hermíticas aleatórias — as mesmas matrizes que a física usa para modelar os níveis de energia de núcleos pesados. Os primos, num sentido ainda por esclarecer, vibram à frequência de ressonância de um sistema quântico.",
    },
  ],
  figureCaption:
    "A banda crítica 0 < Re(s) < 1. As verticais tracejadas marcam as suas bordas; a linha quente no meio é Re(s) = ½. Cada conta é uma das primeiras oito alturas de zeros não triviais — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) traçada no plano complexo",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "zeros atravessados",
  zetaPathHint:
    "Cada vez que a curva passa pela origem, ζ atingiu zero — e a parte imaginária t nesse instante é a altura de um zero não trivial. Arrasta o controlo para cima: o primeiro laço aparece por volta de t ≈ 14,13, o segundo por volta de 21,02, o terceiro por volta de 25,01.",
  closingPretitle: "Vê o motor",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador desenha ζ em tamanho real ao longo da recta crítica e deixa-te reconstruir a escada contadora de primos a partir dos próprios zeros — uma correcção de Riemann de cada vez. As curvas limpas que constróis são a afirmação mais física do que a hipótese realmente pretende.",
  ctaLabel: "→ Abrir o Explorador",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Analys",
    title: "Riemannhypotesen",
    tagline: "Varje icke-trivialt nollställe till ζ ligger på en enda lodrät linje.",
    intro:
      "Riemanns avhandling från 1859 analytiskt förlängde en blygsam summa av inverser till hela det komplexa planet och noterade att de ställen där resultatet försvinner tycks dela en enda realdel: ½. Ett bevis skulle låsa primtalens fördelning hårdare än någon känd skranka. Ett motexempel skulle välta omkull ett och ett halvt sekel av följder. Ingetdera har hittats.",
    ctaInteractive: "→ Öppna Explorern",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "En funktion. En linje. Ett och ett halvt sekel av tystnad.",
    cards: [
      {
        label: "01",
        title: "Förmodan",
        body: "Ta funktionen ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, förläng den (analytiskt) till alla komplexa s, och fråga var den är noll. Vissa nollställen är triviala — de negativa jämna heltalen. Alla andra, säger Riemann, ligger på den lodräta linjen Re(s) = ½. Tusen miljarder har kontrollerats. Inget har missat.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Det första icke-triviala nollstället sitter vid s = ½ + 14,13… · i. Nästa vid ½ + 21,02… · i, sedan ½ + 25,01… · i, och så vidare uppåt utan slut. Var och en är en liten resonanshandling mellan heltalen — höjderna är inte slumpmässiga, de bildar det spektrum med vilket primtalen avviker från medelvärdet.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Hundratals satser är skrivna i villkorlig form «antag RH, då …». Ett bevis skulle aktivera dem alla samtidigt: tätare primtalsglapp, skarpare feltermer i talteori, hårdhetsgarantier i kryptografi, en djupare bro mellan analys och aritmetik. Det är Hilberts åttonde problem och ett av de sju Clay Millennium-priserna.",
      },
    ],
    tryIt:
      "Nedan: vandra med ζ längs den kritiska linjen och se kurvan löpa genom origo vid varje nollställe. Explorern skalar upp samma bild.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Eulers produkt",
      title: "ζ bär primtalen i DNA:t",
      body: "Redan 1737, nästan ett sekel före Riemann, noterade Euler att den oändliga summan ζ(s) = Σ 1/nˢ kan skrivas om som en oändlig produkt över primtalen: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). Ekvivalensen är en av matematikens tystaste men mest häpnadsväckande identiteter — heltalens additiva struktur och primtalens multiplikativa struktur är bokstavligt talat samma objekt, betraktat från två håll. När man väl vet det är frågan «var försvinner ζ?» inte längre en fråga om en funktion; det är en fråga om primtalen själva.",
    },
    {
      pretitle: "Avsnitt 02 · Analytisk fortsättning",
      title: "Förlänga en summa som divergerar",
      body: "Serien Σ 1/nˢ konvergerar endast då Re(s) > 1. Riemanns artikel från 1859 utför ett enda djärvt drag: den visar att ζ har en entydig förlängning till hela det komplexa planet (utom en enstaka pol vid s = 1), och att denna förlängning uppfyller den symmetriska funktionalekvationen ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). Den nya ζ definieras inte längre av summan — den definieras som den enda väluppfostrade funktion som överensstämmer med summan där summan har mening. Allt därefter är geometri på detta förlängda objekt.",
    },
    {
      pretitle: "Avsnitt 03 · Den kritiska remsan",
      title: "Triviala nollställen utanför, de intressanta inuti",
      body: "Funktionalekvationen avslöjar genast de «triviala» nollställena vid s = −2, −4, −6, … — sinusfaktorn tvingar fram dem. Allt annat måste leva i den kritiska remsan 0 < Re(s) < 1, det enda ställe där funktionen fortfarande har utrymme att oscillera. Riemanns hypotes är påståendet att hela remsan är bedräglig: de icke-triviala nollställena sprider sig inte över den, de kollapsar på en enda lodrät söm i mitten, Re(s) = ½. Remsan är scenen; sömmen är där det händer.",
    },
    {
      pretitle: "Avsnitt 04 · Förmodan",
      title: "Re(s) = ½. Alltid.",
      body: "Hardy bevisade 1914 att det finns oändligt många nollställen på den kritiska linjen. Selberg visade senare att en positiv andel av alla nollställen sitter där; den andelen har pressats över 41 % (Conrey, 1989) och kryper uppåt varje årtionde. Hypotesen själv är det maximala påståendet: inte «de flesta» nollställen, inte «alla utom ändligt många» — alla, utan undantag, på Re(s) = ½. Det är den skarpaste tänkbara formen av en probabilistisk intuition om primtal: att de är så jämnt fördelade som en deterministisk följd alls kan vara.",
    },
    {
      pretitle: "Avsnitt 05 · Vad ett bevis skulle ge oss",
      title: "Följdsatserna är redan skrivna",
      body: "Primtalsräknaren π(x) approximeras av logaritmiska integralen Li(x). RH är ekvivalent med att felet |π(x) − Li(x)| begränsas av √x log x — den skarpast möjliga skrankan, tätare än något känt. Hundratals andra påståenden är RH-ekvivalenta: skrankor för Möbius-funktionen, för karaktärssummor, för tillväxten hos aritmetiska funktioner. Kryptografin beror tyst på dem för sina asymptotiska säkerhetsgarantier. Ett bevis skulle inte ändra en enda beräkning, men det skulle avgöra varje villkorlig sats i ett andetag.",
    },
    {
      pretitle: "Avsnitt 06 · Numerisk evidens och kvantkaos",
      title: "Nollställena ställer upp sig — och liknar ett fysikspektrum",
      body: "Datorverifieringar har placerat de första tio biljonerna icke-triviala nollställen exakt på den kritiska linjen (Gourdon, 2004 och efterföljare). Och 1972 lade Hugh Montgomery och Freeman Dyson märke till något märkligare än något talteoretiskt resultat: statistiken över avstånden mellan zeta-nollställen stämmer exakt med statistiken över avstånden mellan egenvärden hos stora slumpmässiga hermitiska matriser — samma matriser som fysiker använder för att modellera energinivåerna hos tunga atomkärnor. Primtalen surrar, i någon ännu oförklarad mening, på resonansfrekvensen för ett kvantsystem.",
    },
  ],
  figureCaption:
    "Den kritiska remsan 0 < Re(s) < 1. De streckade lodrätorna markerar dess kanter; den varma linjen i mitten är Re(s) = ½. Varje pärla är en av de första åtta höjderna för icke-triviala nollställen — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) ritad i det komplexa planet",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "nollställen passerade",
  zetaPathHint:
    "Varje gång kurvan löper genom origo har ζ träffat noll — och imaginärdelen t i det ögonblicket är höjden för ett icke-trivialt nollställe. Dra reglaget uppåt: första öglan kommer runt t ≈ 14,13, andra runt 21,02, tredje runt 25,01.",
  closingPretitle: "Se motorn",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren ritar ζ i full storlek längs den kritiska linjen och låter dig återskapa primtalstrappan från nollställena själva — en Riemann-korrektion i taget. De rena kurvor du bygger är den fysiskt klaraste form hypotesens innehåll får.",
  ctaLabel: "→ Öppna Utforskaren",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Analyse",
    title: "Riemannhypotesen",
    tagline: "Hvert ikke-trivielt nullpunkt til ζ ligger på en enkelt loddrett linje.",
    intro:
      "Riemanns avhandling fra 1859 analytisk forlenget en beskjeden sum av inverser til hele det komplekse planet og merket at stedene der resultatet forsvinner ser ut til å dele én eneste realdel: ½. Et bevis ville feste primtallenes fordeling tettere enn noen kjent grense. Et moteksempel ville velte halvannet århundre med konsekvenser. Ingen av delene er funnet.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "En funksjon. En linje. Halvannet århundre med stillhet.",
    cards: [
      {
        label: "01",
        title: "Formodningen",
        body: "Ta funksjonen ζ(s) = 1 + 1/2ˢ + 1/3ˢ + 1/4ˢ + …, forleng den (analytisk) til alle komplekse s, og spør hvor den er null. Noen nullpunkter er trivielle — de negative partallene. Alle de andre, sier Riemann, ligger på den loddrette linjen Re(s) = ½. Tusen milliarder er sjekket. Ingen har bommet.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Det første ikke-trivielle nullpunktet sitter ved s = ½ + 14,13… · i. Det neste ved ½ + 21,02… · i, deretter ½ + 25,01… · i, og marsjerer videre oppover uten slutt. Hvert er en liten resonanshandling mellom heltallene — høydene er ikke tilfeldige, de utgjør spekteret som primtallene avviker fra middelet med.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Hundrevis av teoremer er skrevet i betinget form «anta RH, da …». Et bevis ville aktivere dem alle på én gang: tettere primtallsavstander, skarpere feilledd i tallteori, hardhetsgarantier i kryptografi, og en dypere bro mellom analyse og aritmetikk. Det er Hilberts åttende problem og ett av de syv Clay Millennium-prisene.",
      },
    ],
    tryIt:
      "Under: vandre med ζ langs den kritiske linjen og se kurven løkke gjennom origo ved hvert nullpunkt. Utforskeren forstørrer det samme bildet.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Eulers produkt",
      title: "ζ har primtallene i DNA-et",
      body: "Allerede i 1737, nesten et århundre før Riemann, merket Euler at den uendelige summen ζ(s) = Σ 1/nˢ kan skrives som et uendelig produkt over primtallene: ζ(s) = ∏ₚ 1 / (1 − p⁻ˢ). Ekvivalensen er en av matematikkens stilleste men mest forbløffende identiteter — heltallenes additive struktur og primtallenes multiplikative struktur er bokstavelig talt samme objekt, sett fra to sider. Når du først vet det, er spørsmålet «hvor forsvinner ζ?» ikke lenger et spørsmål om en funksjon; det er et spørsmål om primtallene selv.",
    },
    {
      pretitle: "Avsnitt 02 · Analytisk forlengelse",
      title: "Forlenge en sum som divergerer",
      body: "Rekka Σ 1/nˢ konvergerer bare for Re(s) > 1. Riemanns artikkel fra 1859 utfører ett eneste, dristig grep: den viser at ζ har en entydig forlengelse til hele det komplekse planet (med unntak av én enkelt pol ved s = 1), og at denne forlengelsen oppfyller den symmetriske funksjonalligningen ζ(s) = 2ˢ πˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s). Den nye ζ er ikke lenger definert av summen — den er definert som den eneste veloppdragne funksjonen som stemmer med summen der summen gir mening. Alt videre er geometri på dette forlengede objektet.",
    },
    {
      pretitle: "Avsnitt 03 · Den kritiske stripen",
      title: "Trivielle nullpunkter utenfor, interessante inni",
      body: "Funksjonalligningen avslører straks de «trivielle» nullpunktene ved s = −2, −4, −6, … — sinusfaktoren tvinger dem frem. Alt annet må leve i den kritiske stripen 0 < Re(s) < 1, det eneste stedet der funksjonen fremdeles har rom til å oscillere. Riemanns hypotese er påstanden om at hele stripen er bedragerisk: de ikke-trivielle nullpunktene fordeler seg ikke utover den, de kollapser på én loddrett søm i midten, Re(s) = ½. Stripen er scenen; sømmen er der noe skjer.",
    },
    {
      pretitle: "Avsnitt 04 · Formodningen",
      title: "Re(s) = ½. Alltid.",
      body: "Hardy beviste i 1914 at det finnes uendelig mange nullpunkter på den kritiske linjen. Selberg viste senere at en positiv andel av alle nullpunktene sitter der; den andelen er presset over 41 % (Conrey, 1989) og krabber oppover hvert tiår. Hypotesen selv er det maksimale utsagnet: ikke «de fleste» nullpunkter, ikke «alle utenom endelig mange» — alle, uten unntak, på Re(s) = ½. Det er den skarpest tenkelige formen av en sannsynlighetsmessig intuisjon om primtall: at de er så jevnt fordelt som en deterministisk følge kan være.",
    },
    {
      pretitle: "Avsnitt 05 · Hva et bevis ville gi oss",
      title: "Følgesetningene er allerede skrevet",
      body: "Primtallstellfunksjonen π(x) tilnærmes av den logaritmiske integralen Li(x). RH er ekvivalent med at feilen |π(x) − Li(x)| er begrenset av √x log x — den skarpest mulige grensen, tettere enn noe kjent. Hundrevis av andre utsagn er RH-ekvivalente: grenser for Möbius-funksjonen, for karaktersummer, for veksten av aritmetiske funksjoner. Kryptografi avhenger stilltiende av dem for sine asymptotiske sikkerhetsgarantier. Et bevis ville ikke endre én eneste beregning, men ville avgjøre hvert betingede teorem i ett åndedrag.",
    },
    {
      pretitle: "Avsnitt 06 · Numerisk evidens og kvantekaos",
      title: "Nullpunktene stiller seg på rekke — og ligner et fysikkspektrum",
      body: "Datamaskinverifikasjoner har plassert de første ti billioner ikke-trivielle nullpunktene nøyaktig på den kritiske linjen (Gourdon, 2004 og etterfølgere). Og i 1972 la Hugh Montgomery og Freeman Dyson merke til noe merkeligere enn noe tallteoretisk resultat: statistikken for avstandene mellom zeta-nullpunkter stemmer nøyaktig med statistikken for avstandene mellom egenverdier i store tilfeldige hermitiske matriser — de samme matrisene fysikere bruker for å modellere energinivåene til tunge atomkjerner. Primtallene summer, i en betydning som ennå ikke er forklart, på resonansfrekvensen til et kvantesystem.",
    },
  ],
  figureCaption:
    "Den kritiske stripen 0 < Re(s) < 1. De stiplede loddrettene markerer kantene; den varme linjen i midten er Re(s) = ½. Hver perle er en av de første åtte høydene til ikke-trivielle nullpunkter — 14,13, 21,02, 25,01, 30,42, 32,93, 37,59, 40,92, 43,33.",
  zetaPathCaption: "ζ(½ + it) tegnet i det komplekse planet",
  zetaPathTLabel: "t_max",
  zetaPathZerosFound: "nullpunkter krysset",
  zetaPathHint:
    "Hver gang kurven løkker gjennom origo har ζ truffet null — og imaginærdelen t i det øyeblikket er høyden til et ikke-trivielt nullpunkt. Dra glidebryteren oppover: første løkke kommer rundt t ≈ 14,13, den andre rundt 21,02, den tredje rundt 25,01.",
  closingPretitle: "Se motoren",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren tegner ζ i full størrelse langs den kritiske linjen og lar deg rekonstruere primtallstrappen fra nullpunktene selv — én Riemann-korreksjon om gangen. De rene kurvene du bygger er den fysisk klareste formen av det hypotesen egentlig påstår.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------
// Inline figure: a small SVG of the critical strip with the first eight
// non-trivial zero heights drawn as dots on the central line. Pure SVG, no
// interactivity — the moving version lives in <RiemannZetaPath /> below.
// --------------------------------------------------------------------------

function CriticalStripFigure({ caption }: { caption: string }) {
  const W = 800;
  const H = 320;
  const padTop = 32;
  const padBot = 32;
  const lineX = W / 2;
  const tMax = 50;
  const tToY = (t: number) => H - padBot - (t / tMax) * (H - padTop - padBot);
  return (
    <figure
      className="hairline glass space-y-3 rounded-2xl border p-5 md:p-6"
      aria-label="The critical strip 0 < Re(s) < 1 with the first eight non-trivial zero heights of ζ marked on the central line Re(s) = 1/2."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden="true">
        {/* Strip wash */}
        <rect
          x={lineX - 120}
          y={padTop}
          width={240}
          height={H - padTop - padBot}
          fill="rgba(255,209,102,0.045)"
        />
        {/* Strip edges Re=0, Re=1 */}
        <line
          x1={lineX - 120}
          x2={lineX - 120}
          y1={padTop}
          y2={H - padBot}
          stroke="rgba(168,171,189,0.4)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1={lineX + 120}
          x2={lineX + 120}
          y1={padTop}
          y2={H - padBot}
          stroke="rgba(168,171,189,0.4)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        {/* Critical line Re=1/2 */}
        <line
          x1={lineX}
          x2={lineX}
          y1={padTop}
          y2={H - padBot}
          stroke="rgba(255,209,102,0.85)"
          strokeWidth="1.4"
        />
        {/* Tick marks every t=10 along the critical line */}
        {[0, 10, 20, 30, 40, 50].map((t) => {
          const y = tToY(t);
          return (
            <g key={t}>
              <line
                x1={lineX - 6}
                x2={lineX + 6}
                y1={y}
                y2={y}
                stroke="rgba(168,171,189,0.5)"
                strokeWidth="0.8"
              />
              <text
                x={lineX + 12}
                y={y + 4}
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="rgba(168,171,189,0.7)"
              >
                t = {t}
              </text>
            </g>
          );
        })}
        {/* Zeros */}
        {FIRST_ZEROS.map((t, i) => {
          const y = tToY(t);
          return (
            <g key={i}>
              <circle cx={lineX} cy={y} r="9" fill="rgba(255,209,102,0.25)" />
              <circle cx={lineX} cy={y} r="4" fill={palette.canvas.ivory} />
              <text
                x={lineX - 14}
                y={y + 4}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="rgba(255,245,214,0.85)"
              >
                {t.toFixed(2)}
              </text>
            </g>
          );
        })}
        {/* Edge labels */}
        <text
          x={lineX - 120 - 6}
          y={padTop - 10}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="rgba(168,171,189,0.85)"
        >
          Re(s) = 0
        </text>
        <text
          x={lineX}
          y={padTop - 10}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="rgba(255,209,102,0.95)"
        >
          Re(s) = ½  ← critical line
        </text>
        <text
          x={lineX + 120 + 6}
          y={padTop - 10}
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="rgba(168,171,189,0.85)"
        >
          Re(s) = 1
        </text>
      </svg>
      <figcaption className="text-[12px] leading-relaxed text-ink-300">{caption}</figcaption>
    </figure>
  );
}

// --------------------------------------------------------------------------

export default function RiemannStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/riemann/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="ζ(s) = 0 ⇒ Re(s) = 1/2"
      formulaLatex={"\\zeta(s) = 0 \\;\\Rightarrow\\; \\Re(s) = \\tfrac{1}{2}"}
      finalLabel={story.closingTitle}
      signature={<RiemannSignatureHero />}
    >
      {/* Encounter — three cards */}
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

      {/* Section 01 — Euler product */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — Analytic continuation */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Critical strip + the inline figure */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <CriticalStripFigure caption={story.figureCaption} />
        </Reveal>
      </section>

      {/* Section 04 — The conjecture, with the interactive ζ-path */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <RiemannZetaPath
            caption={story.zetaPathCaption}
            tLabel={story.zetaPathTLabel}
            zerosFoundLabel={story.zetaPathZerosFound}
            hintLabel={story.zetaPathHint}
          />
        </Reveal>
      </section>

      {/* Section 05 — What a proof would buy us */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — Numerical evidence + Montgomery-Dyson */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[5].pretitle}
          title={story.sections[5].title}
          body={story.sections[5].body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mt-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/riemann/explorer"
            className="inline-block rounded-full border border-signal-teal/70 bg-signal-teal/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-teal transition-colors hover:bg-signal-teal/25"
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-teal/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
