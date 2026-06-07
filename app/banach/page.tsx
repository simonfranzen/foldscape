"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { BanachFreeGroup } from "@/components/BanachFreeGroup";
import { BanachHilbertMini } from "@/components/BanachHilbertMini";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-rose";

// --------------------------------------------------------------------------
// Rich per-locale content. The hero (pretitle/title/tagline/intro/cta) is
// still pulled from the shared stories.ts. Everything below the hero is
// authored inline here, in all 8 site locales, so we can tell a longer
// story without leaking page-specific prose into the shared i18n bundles.
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
  freeGroupCaption: string;
  freeGroupReset: string;
  freeGroupHint: string;
  freeGroupWordLabel: string;
  hilbertCaption: string;
  hilbertAddOne: string;
  hilbertDouble: string;
  hilbertReset: string;
  hilbertFreeRooms: string;
  hilbertOccupied: string;
  hilbertHint: string;
  robinsonNote: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Paradox",
    title: "The Banach–Tarski Paradox",
    tagline: "Cut a ball, end up with two.",
    intro:
      "A solid ball, split into a handful of pieces, can be reassembled into two solid balls each identical to the original — no stretching, no extra matter. The Explorer draws the engine behind the trick: the free group F₂ of two rotations, whose self-similar Cayley tree contains four shifted copies of itself. That branching structure is, almost literally, where the second ball comes from.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Cut one ball. End up with two.",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "Take a solid ball. Cut it into a handful of pieces. Move the pieces around — only rotations and translations, no stretching, no distorting. Reassemble them. You now have two solid balls, each the same size as the original. This is a theorem, not a trick. It is also, obviously, physically impossible.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Take a solid orange. Cut it — mathematically — into just five pieces. Not orange-slices: each piece is a dense, intertwined cloud of points threaded through the fruit. Now rotate each cloud rigidly in place, no stretching, no extra matter. The five pieces reassemble into two solid oranges, each the same size as the original and indistinguishable from it. The cut is exactly defined but physically unbuildable — no scalpel can trace it, because it lives only in the continuum.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "The paradox is the cleanest signal that mathematical reality and physical reality are not the same thing. It depends on the Axiom of Choice — a quiet assumption most mathematicians use without thinking — and it forced a century of debate about which set-theory foundations are worth keeping. The pieces are not regions you could touch; they are infinite point-clouds with no defined volume.",
      },
    ],
    tryIt: "Walk a free-group tree. Watch the duplication trick play out below.",
  },
  sections: [
    {
      pretitle: "Section 01 · Your intuition",
      title: "Physics says no",
      body: "Drop a cricket ball on the floor. Cut it cleanly. Whatever pieces fall out, their volumes have to add up to the volume of the ball. That is conservation of matter, and the world will not let you cheat it. Everything you have ever cut, ground, sliced, melted, or mixed has obeyed this rule. So when somebody tells you they can carve a ball into five pieces that reassemble into two identical balls, your gut answer is correct: nothing physical works that way. The surprise is that, in pure mathematics, something can.",
    },
    {
      pretitle: "Section 02 · The Axiom of Choice",
      title: "Picking one of each, uncountably many times",
      body: "The Axiom of Choice says: given any collection of non-empty sets, you can simultaneously pick one element from each — even if there are uncountably many sets and you have no rule for choosing. For finite or countable collections it is obvious. For uncountable collections it is an act of pure declaration: a chooser exists, full stop. Banach and Tarski use it to select one representative from each of uncountably many orbits of a rotation group acting on the sphere. From that single selection, the duplication follows.",
    },
    {
      pretitle: "Section 03 · Non-measurable sets",
      title: "Pieces that have no volume",
      body: "Lebesgue measure assigns a volume to every set you could reasonably draw. But Vitali showed in 1905 that, using the Axiom of Choice, you can construct a subset of the unit interval that admits no consistent length at all — assigning it any value, even zero, contradicts the rules of measure. The Banach–Tarski pieces are three-dimensional cousins of Vitali's set: dense point-clouds whose volume is genuinely undefined. That is why the rearrangement does not violate volume conservation — the input pieces never had a volume to conserve.",
    },
    {
      pretitle: "Section 04 · The free group F₂",
      title: "Two rotations, no relations",
      body: "Pick two rotations a and b of the unit sphere — for instance both through the angle θ = arccos(1/3), about two perpendicular axes. No matter how you compose them — aba⁻¹b, b²a⁻³, anything — you never get back to the identity except by trivially cancelling inverses. The group they generate is the free group F₂ on two letters: every reduced word in a, a⁻¹, b, b⁻¹ is a distinct rotation. F₂ has a paradoxical decomposition: split it into the four subsets of words starting with each generator, apply a single shift, and each subset covers what was the rest of the group. The sphere inherits the same property — and then the ball.",
    },
    {
      pretitle: "Section 05 · The actual decomposition",
      title: "Five pieces — and Robinson proved that is the minimum",
      body: "Banach and Tarski's 1924 paper gives a construction with a finite number of pieces; later refinements brought it down to five. Raphael M. Robinson proved in 1947 that five is sharp — four pieces are not enough. One of the five is a single point at the centre, an artifact of how the rotations behave at the origin; the other four are the dense, non-measurable point-clouds carved out of the sphere by the F₂ action and pushed back into the ball. Each piece is rotated as a rigid body, with no stretching, and the result is two solid balls indistinguishable from the original.",
    },
    {
      pretitle: "Section 06 · Why it isn't a contradiction",
      title: "Different worlds, different rules",
      body: "Physical pieces have measure: you can weigh them, measure their volume, count their atoms. Banach–Tarski pieces have no measure — they are uncountable, dense, unphysical sets. Volume conservation is a statement about measurable things, and the theorem never says the pieces are measurable; it says the opposite. Matter has atoms, set theory does not. The paradox is an exact, formal warning that the continuum has structure we cannot touch, and that the comforting equation 'volume in = volume out' is a property of nice sets, not all sets. That is the whole lesson.",
    },
  ],
  freeGroupCaption: "Cayley graph of F₂",
  freeGroupReset: "↺ reset to ε",
  freeGroupHint:
    "Every reduced word in a, a⁻¹, b, b⁻¹ is a unique vertex. The walker never lands on the same node twice unless you retrace your last move. Four branches at the root, three at every other node — and the whole infinite tree contains four shrunken copies of itself. That self-similarity is the paradox.",
  freeGroupWordLabel: "current word",
  hilbertCaption: "Hilbert's hotel — make room for more",
  hilbertAddOne: "+1 guest",
  hilbertDouble: "+∞ guests (n → 2n)",
  hilbertReset: "↺ reset",
  hilbertFreeRooms: "free",
  hilbertOccupied: "occupied",
  hilbertHint:
    "The hotel is full, yet there is always room for one more — or for infinitely many more. Banach–Tarski takes the same algebraic trick (shifting an infinite collection into a proper subset of itself) and runs it inside a solid ball.",

  robinsonNote: "Minimum number of pieces. Four are dense non-measurable point-clouds carved by the F₂ action; the fifth is a single point at the centre, an artefact of rotations fixing the origin.",
  closingPretitle: "See the engine",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer draws the F₂ Cayley tree explicitly: it lets you mark the four word-classes, watch the paradoxical decomposition assemble, and trace each piece back to a rotation. The maths above becomes a picture you can rotate.",
  ctaLabel: "→ Open the Explorer",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Paradoxon",
    title: "Das Banach–Tarski-Paradoxon",
    tagline: "Eine Kugel zerschneiden, zwei zurückbekommen.",
    intro:
      "Eine massive Kugel, in eine Handvoll Stücke zerlegt, lässt sich zu zwei massiven Kugeln zusammensetzen, jede identisch mit der ursprünglichen — kein Strecken, keine zusätzliche Materie. Der Explorer zeichnet den Motor hinter dem Trick: die freie Gruppe F₂ aus zwei Drehungen, deren selbstähnlicher Cayley-Baum vier verschobene Kopien seiner selbst enthält. Genau diese Verzweigungsstruktur ist, fast wörtlich, der Ort, an dem die zweite Kugel herkommt.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Eine Kugel zerschneiden. Zwei zurückbekommen.",
    cards: [
      {
        label: "01",
        title: "Die große Idee",
        body: "Nimm eine massive Kugel. Zerlege sie in eine Handvoll Teile. Bewege die Teile — nur Drehungen und Verschiebungen, kein Strecken, kein Verformen. Setze sie wieder zusammen. Du hältst jetzt zwei massive Kugeln, jede so groß wie die ursprüngliche. Das ist ein Satz, kein Trick. Und es ist offensichtlich physikalisch unmöglich.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Nimm eine massive Orange. Zerlege sie — rein mathematisch — in genau fünf Teile. Keine Orangenspalten: jedes Teil ist eine dichte, ineinander verwobene Punktwolke, die durch die ganze Frucht zieht. Drehe jede Wolke starr an Ort und Stelle, kein Strecken, keine zusätzliche Materie. Die fünf Teile fügen sich zu zwei massiven Orangen zusammen, jede so groß wie die ursprüngliche und nicht von ihr zu unterscheiden. Der Schnitt ist exakt definiert, aber physikalisch nicht ausführbar — kein Skalpell kann ihm folgen, denn er existiert nur im Kontinuum.",
      },
      {
        label: "03",
        title: "Warum es wichtig ist",
        body: "Das Paradox ist das sauberste Signal dafür, dass mathematische und physikalische Wirklichkeit nicht dasselbe sind. Es hängt vom Auswahlaxiom ab — einer leisen Annahme, die die meisten Mathematiker:innen gedankenlos benutzen — und es entfachte ein Jahrhundert Streit darüber, welches Fundament der Mengenlehre überhaupt tragfähig ist. Die Teile sind keine Gebiete, die man anfassen könnte; sie sind unendliche Punktwolken ohne definiertes Volumen.",
      },
    ],
    tryIt:
      "Lauf durch einen Baum freier Gruppen. Sieh den Verdopplungstrick unten in Aktion.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Deine Intuition",
      title: "Die Physik sagt nein",
      body: "Lass einen Cricketball auf den Boden fallen. Schneide ihn sauber. Welche Stücke auch herausfallen, ihre Volumina müssen sich zum Volumen des Balls aufsummieren. Das ist Materieerhaltung, und die Welt lässt sich davon nicht abbringen. Alles, was du je geschnitten, gemahlen, geschmolzen oder vermischt hast, hat dieser Regel gehorcht. Wenn dir also jemand erzählt, er könne eine Kugel in fünf Teile zerlegen, die zu zwei identischen Kugeln zusammensetzbar sind, ist deine Bauchreaktion richtig: nichts Physikalisches funktioniert so. Die Überraschung ist, dass in der reinen Mathematik etwas so funktionieren kann.",
    },
    {
      pretitle: "Abschnitt 02 · Das Auswahlaxiom",
      title: "Aus jeder Menge eines wählen — überabzählbar oft",
      body: "Das Auswahlaxiom besagt: aus jeder Sammlung nichtleerer Mengen kannst du gleichzeitig je ein Element auswählen — selbst wenn die Sammlung überabzählbar ist und du keine Regel hast, wie zu wählen sei. Für endliche oder abzählbare Sammlungen ist das offensichtlich. Für überabzählbare ist es eine reine Deklaration: ein Wähler existiert, Punkt. Banach und Tarski nutzen es, um aus überabzählbar vielen Bahnen einer Drehgruppe auf der Sphäre je einen Vertreter zu picken. Aus diesem einen Akt der Auswahl folgt die Verdopplung.",
    },
    {
      pretitle: "Abschnitt 03 · Nichtmessbare Mengen",
      title: "Stücke ohne Volumen",
      body: "Das Lebesgue-Maß ordnet jeder vernünftig zeichenbaren Menge ein Volumen zu. Doch Vitali zeigte 1905, dass man — mit dem Auswahlaxiom — eine Teilmenge des Einheitsintervalls konstruieren kann, der überhaupt keine konsistente Länge zukommt: jeder Wert, auch null, führt zum Widerspruch mit den Maßregeln. Die Banach–Tarski-Stücke sind dreidimensionale Verwandte von Vitalis Menge: dichte Punktwolken, deren Volumen wirklich undefiniert ist. Deshalb verletzt die Umlagerung die Volumenerhaltung nicht — die Eingangsstücke hatten nie ein Volumen, das man hätte erhalten können.",
    },
    {
      pretitle: "Abschnitt 04 · Die freie Gruppe F₂",
      title: "Zwei Drehungen, keine Beziehungen",
      body: "Wähle zwei Drehungen a und b der Einheitssphäre — zum Beispiel beide um den Winkel θ = arccos(1/3), um zwei zueinander senkrechte Achsen. Egal wie du sie verkettest — aba⁻¹b, b²a⁻³, was auch immer — du kommst nie zur Identität zurück, außer indem du Inverse trivial kürzt. Die Gruppe, die sie erzeugen, ist die freie Gruppe F₂ über zwei Buchstaben: jedes reduzierte Wort in a, a⁻¹, b, b⁻¹ ist eine andere Drehung. F₂ hat eine paradoxe Zerlegung: zerteile sie in die vier Teilmengen der Wörter, die mit je einem Erzeuger beginnen, wende eine einzige Verschiebung an, und jede Teilmenge überdeckt den Rest der Gruppe. Die Sphäre erbt dieselbe Eigenschaft — und danach die Kugel.",
    },
    {
      pretitle: "Abschnitt 05 · Die tatsächliche Zerlegung",
      title: "Fünf Stücke — und Robinson bewies, dass weniger nicht geht",
      body: "Die Originalarbeit von Banach und Tarski (1924) gibt eine Konstruktion mit endlich vielen Stücken; spätere Verfeinerungen drückten die Zahl auf fünf. Raphael M. Robinson bewies 1947, dass fünf scharf ist — vier reichen nicht. Eines der fünf Stücke ist ein einzelner Punkt im Zentrum, ein Artefakt des Verhaltens der Drehungen am Ursprung; die anderen vier sind die dichten, nichtmessbaren Punktwolken, die die F₂-Wirkung aus der Sphäre schneidet und in die Kugel zurückträgt. Jedes Stück wird als starrer Körper gedreht, ohne Strecken, und am Ende stehen zwei massive Kugeln da, ununterscheidbar vom Original.",
    },
    {
      pretitle: "Abschnitt 06 · Warum es kein Widerspruch ist",
      title: "Verschiedene Welten, verschiedene Regeln",
      body: "Physikalische Stücke haben ein Maß: man kann sie wiegen, ihr Volumen messen, ihre Atome zählen. Banach–Tarski-Stücke haben kein Maß — sie sind überabzählbare, dichte, unphysikalische Mengen. Volumenerhaltung ist eine Aussage über messbare Dinge, und der Satz behauptet nie, dass die Stücke messbar seien; er behauptet das Gegenteil. Materie hat Atome, die Mengenlehre nicht. Das Paradox ist eine exakte, formale Warnung: das Kontinuum hat Strukturen, die wir nicht anfassen können, und die beruhigende Gleichung „Volumen rein = Volumen raus« ist eine Eigenschaft braver Mengen, nicht aller Mengen. Das ist die ganze Lektion.",
    },
  ],
  freeGroupCaption: "Cayley-Graph von F₂",
  freeGroupReset: "↺ zurück auf ε",
  freeGroupHint:
    "Jedes reduzierte Wort in a, a⁻¹, b, b⁻¹ ist eine einzigartige Ecke. Der Läufer landet nie zweimal am selben Knoten, außer du zeichnest deinen letzten Schritt zurück. Vier Äste an der Wurzel, drei an jedem weiteren Knoten — und der ganze unendliche Baum enthält vier verkleinerte Kopien seiner selbst. Diese Selbstähnlichkeit ist das Paradox.",
  freeGroupWordLabel: "aktuelles Wort",
  hilbertCaption: "Hilberts Hotel — Platz für mehr schaffen",
  hilbertAddOne: "+1 Gast",
  hilbertDouble: "+∞ Gäste (n → 2n)",
  hilbertReset: "↺ zurücksetzen",
  hilbertFreeRooms: "frei",
  hilbertOccupied: "belegt",
  hilbertHint:
    "Das Hotel ist voll und hat trotzdem immer Platz für einen mehr — oder für unendlich viele mehr. Banach–Tarski nimmt denselben algebraischen Trick (eine unendliche Sammlung in eine echte Teilmenge ihrer selbst verschieben) und führt ihn innerhalb einer massiven Kugel aus.",

  robinsonNote: "Minimale Stückzahl. Vier sind dichte, nichtmessbare Punktwolken, die die F₂-Wirkung aus der Sphäre schneidet; das fünfte ist ein einzelner Punkt im Zentrum — ein Artefakt der Drehungen, die den Ursprung fixieren.",
  closingPretitle: "Sieh die Maschine",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer zeichnet den Cayley-Baum von F₂ explizit: du kannst die vier Wortklassen markieren, die paradoxe Zerlegung zusammenfügen sehen und jedes Stück bis auf eine Drehung zurückverfolgen. Die Mathematik oben wird zu einem Bild, das du drehen kannst.",
  ctaLabel: "→ Zum Explorer",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Paradoja",
    title: "La paradoja de Banach–Tarski",
    tagline: "Corta una bola, quédate con dos.",
    intro:
      "Una bola sólida, partida en un puñado de trozos, puede reensamblarse en dos bolas sólidas, cada una idéntica a la original — sin estirar, sin materia extra. El Explorer dibuja el motor que hay tras el truco: el grupo libre F₂ de dos rotaciones, cuyo árbol de Cayley autosemejante contiene cuatro copias desplazadas de sí mismo. Esa estructura ramificada es, casi literalmente, de donde sale la segunda bola.",
    ctaInteractive: "→ Abrir el Explorer",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Corta una bola. Quédate con dos.",
    cards: [
      {
        label: "01",
        title: "La idea grande",
        body: "Toma una bola sólida. Córtala en un puñado de piezas. Mueve las piezas — solo rotaciones y traslaciones, sin estirar, sin deformar. Vuelve a montarlas. Ahora tienes dos bolas sólidas, cada una del tamaño de la original. Es un teorema, no un truco. Y, evidentemente, es físicamente imposible.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Toma una naranja sólida. Córtala — matemáticamente — en exactamente cinco piezas. Nada de gajos: cada pieza es una nube densa de puntos entrelazada por toda la fruta. Gira cada nube como un cuerpo rígido en su sitio, sin estirar, sin materia extra. Las cinco piezas se reensamblan en dos naranjas sólidas, cada una del mismo tamaño que la original e indistinguible de ella. El corte está definido con precisión, pero es físicamente irrealizable — ningún escalpelo puede seguirlo, porque solo existe en el continuo.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "La paradoja es la señal más limpia de que la realidad matemática y la realidad física no son lo mismo. Depende del axioma de elección — una suposición silenciosa que la mayoría de matemáticos usan sin pensarlo — y desató un siglo de debate sobre qué cimientos de la teoría de conjuntos merecen conservarse. Las piezas no son regiones que pudieras tocar; son nubes infinitas de puntos sin volumen definido.",
      },
    ],
    tryIt:
      "Recorre un árbol de grupo libre. Mira el truco de duplicación en acción abajo.",
  },
  sections: [
    {
      pretitle: "Sección 01 · Tu intuición",
      title: "La física dice no",
      body: "Deja caer una pelota de críquet al suelo. Córtala limpio. Sean las que sean las piezas que salgan, sus volúmenes tienen que sumar el volumen de la pelota. Eso es conservación de la materia, y el mundo no te dejará hacer trampa. Todo lo que has cortado, molido, fundido o mezclado en tu vida ha obedecido esta regla. Así que cuando alguien te dice que puede tallar una bola en cinco piezas que se reensamblan en dos bolas idénticas, tu reacción visceral es correcta: nada físico funciona así. La sorpresa es que, en matemática pura, algo sí puede.",
    },
    {
      pretitle: "Sección 02 · El axioma de elección",
      title: "Elegir uno de cada, una cantidad incontable de veces",
      body: "El axioma de elección dice: dada cualquier colección de conjuntos no vacíos, puedes elegir simultáneamente un elemento de cada uno — incluso si la colección es no numerable y no tienes regla alguna para escoger. Para colecciones finitas o numerables es obvio. Para colecciones no numerables es un acto de pura declaración: existe un elector, fin de la historia. Banach y Tarski lo usan para elegir un representante en cada una de las no numerables órbitas de un grupo de rotaciones que actúa sobre la esfera. De esa única elección se sigue la duplicación.",
    },
    {
      pretitle: "Sección 03 · Conjuntos no medibles",
      title: "Piezas sin volumen",
      body: "La medida de Lebesgue asigna un volumen a todo conjunto razonablemente dibujable. Pero Vitali demostró en 1905 que, usando el axioma de elección, se puede construir un subconjunto del intervalo unidad que no admite ninguna longitud consistente — asignarle cualquier valor, incluso cero, contradice las reglas de la medida. Las piezas de Banach–Tarski son primas tridimensionales del conjunto de Vitali: nubes densas de puntos cuyo volumen es genuinamente indefinido. Por eso la reorganización no viola la conservación del volumen — las piezas de entrada nunca tuvieron volumen que conservar.",
    },
    {
      pretitle: "Sección 04 · El grupo libre F₂",
      title: "Dos rotaciones, sin relaciones",
      body: "Elige dos rotaciones a y b de la esfera unidad — por ejemplo ambas por el ángulo θ = arccos(1/3), en torno a dos ejes perpendiculares. Sin importar cómo las compongas — aba⁻¹b, b²a⁻³, lo que sea — nunca regresas a la identidad salvo cancelando inversos trivialmente. El grupo que generan es el grupo libre F₂ sobre dos letras: cada palabra reducida en a, a⁻¹, b, b⁻¹ es una rotación distinta. F₂ admite una descomposición paradójica: divídelo en los cuatro subconjuntos de palabras que empiezan por cada generador, aplica un único desplazamiento, y cada subconjunto cubre el resto del grupo. La esfera hereda la misma propiedad — y luego la bola.",
    },
    {
      pretitle: "Sección 05 · La descomposición real",
      title: "Cinco piezas — y Robinson probó que es el mínimo",
      body: "El artículo original de Banach y Tarski (1924) da una construcción con un número finito de piezas; refinamientos posteriores la redujeron a cinco. Raphael M. Robinson probó en 1947 que cinco es óptimo — cuatro no bastan. Una de las cinco es un único punto en el centro, un artefacto del comportamiento de las rotaciones en el origen; las otras cuatro son las nubes densas y no medibles que la acción de F₂ talla en la esfera y se reincorporan a la bola. Cada pieza se gira como un cuerpo rígido, sin estirar, y el resultado son dos bolas sólidas indistinguibles del original.",
    },
    {
      pretitle: "Sección 06 · Por qué no es una contradicción",
      title: "Mundos distintos, reglas distintas",
      body: "Las piezas físicas tienen medida: puedes pesarlas, medir su volumen, contar sus átomos. Las piezas de Banach–Tarski no tienen medida — son conjuntos no numerables, densos, no físicos. La conservación del volumen es un enunciado sobre cosas medibles, y el teorema nunca dice que las piezas sean medibles; dice lo contrario. La materia tiene átomos; la teoría de conjuntos no. La paradoja es una advertencia formal y exacta: el continuo tiene una estructura que no podemos tocar, y la cómoda ecuación «volumen entra = volumen sale» es propiedad de los conjuntos amables, no de todos. Esa es toda la lección.",
    },
  ],
  freeGroupCaption: "Grafo de Cayley de F₂",
  freeGroupReset: "↺ volver a ε",
  freeGroupHint:
    "Cada palabra reducida en a, a⁻¹, b, b⁻¹ es un vértice único. El caminante nunca aterriza dos veces en el mismo nodo a menos que deshagas tu último paso. Cuatro ramas en la raíz, tres en cualquier otro nodo — y el árbol infinito completo contiene cuatro copias reducidas de sí mismo. Esa autosimilaridad es la paradoja.",
  freeGroupWordLabel: "palabra actual",
  hilbertCaption: "Hotel de Hilbert — hacer sitio para más",
  hilbertAddOne: "+1 huésped",
  hilbertDouble: "+∞ huéspedes (n → 2n)",
  hilbertReset: "↺ reiniciar",
  hilbertFreeRooms: "libres",
  hilbertOccupied: "ocupadas",
  hilbertHint:
    "El hotel está lleno y, sin embargo, siempre hay sitio para uno más — o para infinitos más. Banach–Tarski toma el mismo truco algebraico (desplazar una colección infinita a un subconjunto propio de sí misma) y lo ejecuta dentro de una bola sólida.",

  robinsonNote: "Número mínimo de piezas. Cuatro son nubes densas no medibles talladas por la acción de F₂; la quinta es un único punto en el centro, un artefacto de las rotaciones que fijan el origen.",
  closingPretitle: "Mira el motor",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador dibuja el árbol de Cayley de F₂ de forma explícita: te deja marcar las cuatro clases de palabras, ver cómo se ensambla la descomposición paradójica y rastrear cada pieza hasta su rotación. La matemática de arriba se convierte en una imagen que puedes girar.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Paradoxe",
    title: "Le paradoxe de Banach–Tarski",
    tagline: "Coupe une boule, repars avec deux.",
    intro:
      "Une boule pleine, découpée en une poignée de morceaux, peut être réassemblée en deux boules pleines, chacune identique à l'originale — sans étirer, sans matière supplémentaire. L'Explorer dessine le moteur derrière le tour : le groupe libre F₂ de deux rotations, dont l'arbre de Cayley auto-similaire contient quatre copies décalées de lui-même. Cette structure ramifiée est, presque littéralement, d'où sort la seconde boule.",
    ctaInteractive: "→ Ouvrir l'Explorer",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Coupe une boule. Repars avec deux.",
    cards: [
      {
        label: "01",
        title: "L'idée centrale",
        body: "Prends une boule pleine. Découpe-la en quelques morceaux. Déplace les morceaux — uniquement rotations et translations, aucun étirement, aucune déformation. Réassemble-les. Tu tiens à présent deux boules pleines, chacune de la même taille que l'originale. C'est un théorème, pas un tour de passe-passe. Et c'est, évidemment, physiquement impossible.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Prends une orange pleine. Découpe-la — mathématiquement — en exactement cinq morceaux. Pas des quartiers : chaque morceau est un nuage dense de points, entrelacé à travers tout le fruit. Fais tourner chaque nuage comme un solide rigide sur place, sans étirement, sans matière supplémentaire. Les cinq morceaux se réassemblent en deux oranges pleines, chacune de la même taille que l'originale et impossible à en distinguer. La coupe est définie avec précision mais physiquement irréalisable — aucun scalpel ne peut la suivre, car elle n'existe que dans le continu.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "Le paradoxe est le signal le plus net que la réalité mathématique et la réalité physique ne sont pas la même chose. Il dépend de l'axiome du choix — une hypothèse discrète que la plupart des mathématiciens utilisent sans y penser — et il a déclenché un siècle de débat sur les fondements de la théorie des ensembles. Les morceaux ne sont pas des régions que l'on pourrait toucher ; ce sont des nuages infinis de points sans volume défini.",
      },
    ],
    tryIt:
      "Parcours un arbre de groupe libre. Regarde le tour du dédoublement se jouer en bas.",
  },
  sections: [
    {
      pretitle: "Section 01 · Ton intuition",
      title: "La physique dit non",
      body: "Laisse tomber une balle de cricket sur le sol. Découpe-la proprement. Quels que soient les morceaux qui sortent, leurs volumes doivent s'additionner pour donner celui de la balle. C'est la conservation de la matière, et le monde ne te laisse pas tricher. Tout ce que tu as un jour coupé, broyé, fondu ou mélangé a obéi à cette règle. Donc quand quelqu'un te dit qu'il peut tailler une boule en cinq morceaux que l'on réassemble en deux boules identiques, ta réaction viscérale est juste : rien de physique ne fonctionne ainsi. La surprise est qu'en mathématiques pures, quelque chose le peut.",
    },
    {
      pretitle: "Section 02 · L'axiome du choix",
      title: "Choisir un élément par ensemble, une infinité non dénombrable de fois",
      body: "L'axiome du choix dit : pour toute collection d'ensembles non vides, tu peux choisir simultanément un élément dans chacun — même si la collection est non dénombrable et même si tu n'as aucune règle de choix. Pour les collections finies ou dénombrables, c'est évident. Pour les collections non dénombrables, c'est un acte de pure déclaration : un sélecteur existe, point. Banach et Tarski s'en servent pour choisir un représentant dans chacune des orbites non dénombrables d'un groupe de rotations agissant sur la sphère. De ce seul choix découle la duplication.",
    },
    {
      pretitle: "Section 03 · Ensembles non mesurables",
      title: "Des morceaux sans volume",
      body: "La mesure de Lebesgue attribue un volume à tout ensemble que l'on peut raisonnablement dessiner. Mais Vitali a montré en 1905 qu'avec l'axiome du choix, on peut construire un sous-ensemble de l'intervalle unité auquel aucune longueur cohérente ne peut être attribuée — toute valeur, même zéro, contredit les règles de la mesure. Les morceaux de Banach–Tarski sont les cousins tridimensionnels de l'ensemble de Vitali : nuages denses de points dont le volume est véritablement indéfini. Voilà pourquoi le réarrangement ne viole pas la conservation du volume — les morceaux d'entrée n'ont jamais eu de volume à conserver.",
    },
    {
      pretitle: "Section 04 · Le groupe libre F₂",
      title: "Deux rotations, aucune relation",
      body: "Choisis deux rotations a et b de la sphère unité — par exemple toutes deux par l'angle θ = arccos(1/3), autour de deux axes perpendiculaires. Quelle que soit la façon dont tu les composes — aba⁻¹b, b²a⁻³, n'importe quoi — tu ne reviens jamais à l'identité sauf par annulation triviale des inverses. Le groupe qu'elles engendrent est le groupe libre F₂ sur deux lettres : chaque mot réduit en a, a⁻¹, b, b⁻¹ est une rotation distincte. F₂ admet une décomposition paradoxale : sépare-le en quatre sous-ensembles selon le générateur initial de chaque mot, applique un unique décalage, et chaque sous-ensemble recouvre le reste du groupe. La sphère hérite de la même propriété — puis la boule.",
    },
    {
      pretitle: "Section 05 · La décomposition réelle",
      title: "Cinq morceaux — et Robinson a prouvé que c'est le minimum",
      body: "L'article original de Banach et Tarski (1924) donne une construction avec un nombre fini de morceaux ; des raffinements ultérieurs l'ont ramenée à cinq. Raphael M. Robinson a prouvé en 1947 que cinq est optimal — quatre ne suffisent pas. L'un des cinq est un unique point au centre, artefact du comportement des rotations à l'origine ; les quatre autres sont les nuages denses et non mesurables que l'action de F₂ découpe dans la sphère puis ramène dans la boule. Chaque morceau est tourné comme un solide rigide, sans étirement, et le résultat est deux boules pleines indiscernables de l'originale.",
    },
    {
      pretitle: "Section 06 · Pourquoi ce n'est pas une contradiction",
      title: "Mondes distincts, règles distinctes",
      body: "Les morceaux physiques ont une mesure : on peut les peser, mesurer leur volume, compter leurs atomes. Les morceaux de Banach–Tarski n'ont pas de mesure — ce sont des ensembles non dénombrables, denses, non physiques. La conservation du volume est un énoncé sur des choses mesurables, et le théorème ne dit jamais que les morceaux le sont ; il dit le contraire. La matière a des atomes ; la théorie des ensembles n'en a pas. Le paradoxe est un avertissement formel et précis : le continu a une structure qu'on ne peut pas toucher, et la rassurante équation « volume entrant = volume sortant » est une propriété des ensembles sages, pas de tous. Voilà toute la leçon.",
    },
  ],
  freeGroupCaption: "Graphe de Cayley de F₂",
  freeGroupReset: "↺ retour à ε",
  freeGroupHint:
    "Chaque mot réduit en a, a⁻¹, b, b⁻¹ est un sommet unique. Le marcheur ne retombe jamais sur le même nœud, sauf si tu reprends ton dernier pas. Quatre branches à la racine, trois à chaque autre nœud — et l'arbre infini entier contient quatre copies réduites de lui-même. Cette auto-similarité est le paradoxe.",
  freeGroupWordLabel: "mot courant",
  hilbertCaption: "Hôtel de Hilbert — faire de la place",
  hilbertAddOne: "+1 hôte",
  hilbertDouble: "+∞ hôtes (n → 2n)",
  hilbertReset: "↺ réinitialiser",
  hilbertFreeRooms: "libres",
  hilbertOccupied: "occupées",
  hilbertHint:
    "L'hôtel est plein et, pourtant, il y a toujours de la place pour un de plus — ou pour une infinité de plus. Banach–Tarski reprend la même astuce algébrique (déplacer une collection infinie dans un sous-ensemble propre d'elle-même) et l'exécute à l'intérieur d'une boule pleine.",

  robinsonNote: "Nombre minimum de morceaux. Quatre sont des nuages denses non mesurables découpés par l’action de F₂ ; le cinquième est un unique point au centre, artefact des rotations qui fixent l’origine.",
  closingPretitle: "Vois le moteur",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur dessine explicitement l'arbre de Cayley de F₂ : il te laisse marquer les quatre classes de mots, observer la décomposition paradoxale s'assembler, et remonter chaque morceau jusqu'à une rotation. Les mathématiques ci-dessus deviennent une image que tu peux faire tourner.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Paradosso",
    title: "Il paradosso di Banach–Tarski",
    tagline: "Taglia una palla, ritrovatene due.",
    intro:
      "Una palla piena, divisa in una manciata di pezzi, può essere ricomposta in due palle piene, ciascuna identica all'originale — niente stiramenti, niente materia in più. L'Explorer disegna il motore dietro il trucco: il gruppo libero F₂ di due rotazioni, il cui albero di Cayley autosimile contiene quattro copie traslate di sé stesso. Quella struttura ramificata è, quasi letteralmente, il punto da cui esce la seconda palla.",
    ctaInteractive: "→ Apri l'Explorer",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Taglia una palla. Ritrovati con due.",
    cards: [
      {
        label: "01",
        title: "L'idea grande",
        body: "Prendi una palla piena. Tagliala in una manciata di pezzi. Sposta i pezzi — solo rotazioni e traslazioni, niente stiramenti, niente deformazioni. Rimontali. Hai adesso due palle piene, ciascuna delle dimensioni dell'originale. È un teorema, non un trucco. Ed è, evidentemente, fisicamente impossibile.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Prendi un'arancia piena. Tagliala — matematicamente — in esattamente cinque pezzi. Non spicchi: ogni pezzo è una nuvola densa di punti, intrecciata attraverso tutto il frutto. Ruota ciascuna nuvola come corpo rigido sul posto, senza stirare, senza materia in più. I cinque pezzi si ricompongono in due arance piene, ciascuna delle dimensioni dell'originale e indistinguibile da essa. Il taglio è definito con precisione ma fisicamente irrealizzabile — nessun bisturi può seguirlo, perché esiste solo nel continuo.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Il paradosso è il segnale più pulito che la realtà matematica e la realtà fisica non sono la stessa cosa. Dipende dall'assioma della scelta — un'assunzione silenziosa che la maggior parte dei matematici usa senza pensarci — e ha innescato un secolo di dibattito su quali fondamenti della teoria degli insiemi tenere. I pezzi non sono regioni che potresti toccare; sono nuvole infinite di punti senza volume definito.",
      },
    ],
    tryIt:
      "Cammina su un albero di gruppo libero. Guarda il trucco della duplicazione svolgersi qui sotto.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La tua intuizione",
      title: "La fisica dice no",
      body: "Lascia cadere una palla da cricket a terra. Tagliala bene. Qualunque pezzo ne esca, i loro volumi devono sommarsi al volume della palla. È la conservazione della materia, e il mondo non ti lascia barare. Tutto ciò che hai mai tagliato, macinato, fuso o mescolato ha obbedito a questa regola. Perciò quando qualcuno ti dice che può scolpire una palla in cinque pezzi che si rimontano in due palle identiche, la tua reazione di pancia è corretta: niente di fisico funziona così. La sorpresa è che, in matematica pura, qualcosa può.",
    },
    {
      pretitle: "Sezione 02 · L'assioma della scelta",
      title: "Scegliere uno per ciascuno, non numerabilmente molte volte",
      body: "L'assioma della scelta dice: data una qualsiasi collezione di insiemi non vuoti, puoi selezionare contemporaneamente un elemento da ciascuno — anche se la collezione è non numerabile e non hai nessuna regola di scelta. Per collezioni finite o numerabili è ovvio. Per collezioni non numerabili è un atto di pura dichiarazione: un selettore esiste, punto. Banach e Tarski lo usano per scegliere un rappresentante in ciascuna delle non numerabili orbite di un gruppo di rotazioni che agisce sulla sfera. Da quella singola scelta segue la duplicazione.",
    },
    {
      pretitle: "Sezione 03 · Insiemi non misurabili",
      title: "Pezzi senza volume",
      body: "La misura di Lebesgue assegna un volume a ogni insieme ragionevolmente disegnabile. Ma Vitali mostrò nel 1905 che, usando l'assioma della scelta, si può costruire un sottoinsieme dell'intervallo unitario che non ammette alcuna lunghezza coerente — assegnargli qualunque valore, anche zero, contraddice le regole della misura. I pezzi di Banach–Tarski sono i cugini tridimensionali dell'insieme di Vitali: nuvole dense di punti il cui volume è genuinamente indefinito. Ecco perché il riassemblaggio non viola la conservazione del volume — i pezzi in ingresso non hanno mai avuto un volume da conservare.",
    },
    {
      pretitle: "Sezione 04 · Il gruppo libero F₂",
      title: "Due rotazioni, nessuna relazione",
      body: "Scegli due rotazioni a e b della sfera unitaria — ad esempio entrambe dell'angolo θ = arccos(1/3), attorno a due assi perpendicolari. Comunque le componi — aba⁻¹b, b²a⁻³, qualsiasi cosa — non torni mai all'identità se non cancellando inversi in modo banale. Il gruppo che generano è il gruppo libero F₂ su due lettere: ogni parola ridotta in a, a⁻¹, b, b⁻¹ è una rotazione diversa. F₂ ammette una decomposizione paradossale: dividilo nei quattro sottoinsiemi delle parole che iniziano con ciascun generatore, applica un singolo spostamento, e ogni sottoinsieme copre il resto del gruppo. La sfera eredita la stessa proprietà — e poi la palla.",
    },
    {
      pretitle: "Sezione 05 · La decomposizione vera",
      title: "Cinque pezzi — e Robinson dimostrò che è il minimo",
      body: "L'articolo originale di Banach e Tarski (1924) fornisce una costruzione con un numero finito di pezzi; raffinamenti successivi l'hanno portata a cinque. Raphael M. Robinson dimostrò nel 1947 che cinque è ottimo — quattro non bastano. Uno dei cinque è un singolo punto al centro, un artefatto del comportamento delle rotazioni nell'origine; gli altri quattro sono le nuvole dense e non misurabili che l'azione di F₂ ritaglia nella sfera e riporta nella palla. Ogni pezzo è ruotato come corpo rigido, senza stiramenti, e il risultato sono due palle piene indistinguibili dall'originale.",
    },
    {
      pretitle: "Sezione 06 · Perché non è una contraddizione",
      title: "Mondi diversi, regole diverse",
      body: "I pezzi fisici hanno misura: puoi pesarli, misurarne il volume, contarne gli atomi. I pezzi di Banach–Tarski non hanno misura — sono insiemi non numerabili, densi, non fisici. La conservazione del volume è un enunciato su cose misurabili, e il teorema non dice mai che i pezzi siano misurabili; dice il contrario. La materia ha atomi, la teoria degli insiemi no. Il paradosso è un avvertimento formale ed esatto: il continuo ha una struttura che non possiamo toccare, e la rassicurante equazione «volume in = volume out» è una proprietà degli insiemi a modo, non di tutti. Questa è l'intera lezione.",
    },
  ],
  freeGroupCaption: "Grafo di Cayley di F₂",
  freeGroupReset: "↺ torna a ε",
  freeGroupHint:
    "Ogni parola ridotta in a, a⁻¹, b, b⁻¹ è un vertice unico. Il camminatore non atterra mai due volte sullo stesso nodo a meno che tu non riavvolga l'ultimo passo. Quattro rami alla radice, tre a ogni altro nodo — e l'intero albero infinito contiene quattro copie rimpicciolite di sé. Questa autosimilarità è il paradosso.",
  freeGroupWordLabel: "parola corrente",
  hilbertCaption: "Hotel di Hilbert — fare spazio per altri",
  hilbertAddOne: "+1 ospite",
  hilbertDouble: "+∞ ospiti (n → 2n)",
  hilbertReset: "↺ azzera",
  hilbertFreeRooms: "libere",
  hilbertOccupied: "occupate",
  hilbertHint:
    "L'hotel è pieno e tuttavia c'è sempre posto per uno in più — o per infiniti in più. Banach–Tarski prende lo stesso trucco algebrico (spostare una collezione infinita in un proprio sottoinsieme di sé) e lo esegue all'interno di una palla piena.",

  robinsonNote: "Numero minimo di pezzi. Quattro sono nuvole dense e non misurabili scolpite dall’azione di F₂; il quinto è un singolo punto al centro, un artefatto delle rotazioni che fissano l’origine.",
  closingPretitle: "Vedi il motore",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore disegna esplicitamente l'albero di Cayley di F₂: ti permette di marcare le quattro classi di parole, vedere la decomposizione paradossale assemblarsi, e ricondurre ogni pezzo a una rotazione. La matematica qui sopra diventa un'immagine che puoi ruotare.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Paradoxo",
    title: "O paradoxo de Banach–Tarski",
    tagline: "Corta uma bola, acaba com duas.",
    intro:
      "Uma bola sólida, dividida num punhado de pedaços, pode ser remontada em duas bolas sólidas, cada uma idêntica à original — sem esticar, sem matéria extra. O Explorer desenha o motor por trás do truque: o grupo livre F₂ de duas rotações, cuja árvore de Cayley autossemelhante contém quatro cópias deslocadas de si mesma. Essa estrutura ramificada é, quase literalmente, de onde sai a segunda bola.",
    ctaInteractive: "→ Abrir o Explorer",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Corta uma bola. Acaba com duas.",
    cards: [
      {
        label: "01",
        title: "A ideia central",
        body: "Pega numa bola sólida. Corta-a em meia dúzia de peças. Move as peças — apenas rotações e translações, sem esticar, sem deformar. Volta a montar. Tens agora duas bolas sólidas, cada uma do tamanho da original. É um teorema, não um truque. E é, evidentemente, fisicamente impossível.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Pega numa laranja sólida. Corta-a — matematicamente — em exactamente cinco peças. Nada de gomos: cada peça é uma nuvem densa de pontos, entrelaçada por toda a fruta. Roda cada nuvem como corpo rígido no mesmo sítio, sem esticar, sem matéria extra. As cinco peças voltam a juntar-se em duas laranjas sólidas, cada uma do tamanho da original e indistinguível dela. O corte está definido com precisão, mas é fisicamente irrealizável — nenhum bisturi o consegue seguir, porque só existe no contínuo.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "O paradoxo é o sinal mais limpo de que a realidade matemática e a realidade física não são a mesma coisa. Depende do axioma da escolha — uma suposição silenciosa que a maioria dos matemáticos usa sem pensar — e desencadeou um século de debate sobre quais fundamentos da teoria de conjuntos valem a pena manter. As peças não são regiões que pudesses tocar; são nuvens infinitas de pontos sem volume definido.",
      },
    ],
    tryIt:
      "Percorre uma árvore de grupo livre. Vê o truque da duplicação a desenrolar-se em baixo.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A tua intuição",
      title: "A física diz não",
      body: "Deixa cair uma bola de críquete no chão. Corta-a bem. Sejam quais forem as peças que saiam, os seus volumes têm de somar ao volume da bola. Isto é a conservação da matéria, e o mundo não te deixa enganá-lo. Tudo o que alguma vez cortaste, moeste, fundiste ou misturaste obedeceu a esta regra. Por isso, quando alguém te diz que pode esculpir uma bola em cinco peças que se remontam em duas bolas idênticas, a tua reação visceral é correcta: nada físico funciona assim. A surpresa é que, em matemática pura, algo pode.",
    },
    {
      pretitle: "Secção 02 · O axioma da escolha",
      title: "Escolher um de cada, uma quantidade não numerável de vezes",
      body: "O axioma da escolha diz: dada qualquer coleção de conjuntos não vazios, podes seleccionar simultaneamente um elemento de cada — mesmo que a coleção seja não numerável e não tenhas qualquer regra de escolha. Para coleções finitas ou numeráveis é óbvio. Para coleções não numeráveis é um acto de pura declaração: existe um selector, ponto final. Banach e Tarski usam-no para escolher um representante em cada uma das não numeráveis órbitas de um grupo de rotações a agir sobre a esfera. Dessa única escolha segue-se a duplicação.",
    },
    {
      pretitle: "Secção 03 · Conjuntos não mensuráveis",
      title: "Peças sem volume",
      body: "A medida de Lebesgue atribui um volume a todo o conjunto razoavelmente desenhável. Mas Vitali mostrou em 1905 que, usando o axioma da escolha, se pode construir um subconjunto do intervalo unitário que não admite comprimento consistente algum — atribuir-lhe qualquer valor, mesmo zero, contradiz as regras da medida. As peças de Banach–Tarski são primas tridimensionais do conjunto de Vitali: nuvens densas de pontos cujo volume é genuinamente indefinido. É por isso que o rearranjo não viola a conservação do volume — as peças de entrada nunca tiveram volume a conservar.",
    },
    {
      pretitle: "Secção 04 · O grupo livre F₂",
      title: "Duas rotações, sem relações",
      body: "Escolhe duas rotações a e b da esfera unitária — por exemplo ambas pelo ângulo θ = arccos(1/3), em torno de dois eixos perpendiculares. Por mais que as componhas — aba⁻¹b, b²a⁻³, o que for — nunca regressas à identidade salvo cancelando inversos de forma trivial. O grupo que geram é o grupo livre F₂ sobre duas letras: cada palavra reduzida em a, a⁻¹, b, b⁻¹ é uma rotação distinta. F₂ admite uma decomposição paradoxal: divide-o nos quatro subconjuntos das palavras que começam por cada gerador, aplica um único deslocamento, e cada subconjunto cobre o resto do grupo. A esfera herda a mesma propriedade — e depois a bola.",
    },
    {
      pretitle: "Secção 05 · A decomposição real",
      title: "Cinco peças — e Robinson provou que é o mínimo",
      body: "O artigo original de Banach e Tarski (1924) dá uma construção com um número finito de peças; refinamentos posteriores reduziram-no a cinco. Raphael M. Robinson provou em 1947 que cinco é óptimo — quatro não chegam. Uma das cinco é um único ponto no centro, um artefacto do comportamento das rotações na origem; as outras quatro são as nuvens densas e não mensuráveis que a acção de F₂ recorta na esfera e devolve à bola. Cada peça é rodada como corpo rígido, sem esticar, e o resultado são duas bolas sólidas indistinguíveis da original.",
    },
    {
      pretitle: "Secção 06 · Por que não é uma contradição",
      title: "Mundos diferentes, regras diferentes",
      body: "As peças físicas têm medida: podes pesá-las, medir o seu volume, contar os seus átomos. As peças de Banach–Tarski não têm medida — são conjuntos não numeráveis, densos, não físicos. A conservação do volume é uma afirmação sobre coisas mensuráveis, e o teorema nunca diz que as peças o sejam; diz o contrário. A matéria tem átomos; a teoria de conjuntos não. O paradoxo é um aviso formal e exacto: o contínuo tem uma estrutura que não podemos tocar, e a confortável equação «volume entra = volume sai» é propriedade dos conjuntos bem comportados, não de todos. Esta é a lição inteira.",
    },
  ],
  freeGroupCaption: "Grafo de Cayley de F₂",
  freeGroupReset: "↺ voltar a ε",
  freeGroupHint:
    "Cada palavra reduzida em a, a⁻¹, b, b⁻¹ é um vértice único. O caminhante nunca cai duas vezes no mesmo nó a não ser que desfaças o último passo. Quatro ramos na raiz, três em cada outro nó — e toda a árvore infinita contém quatro cópias reduzidas de si mesma. Essa autossimilaridade é o paradoxo.",
  freeGroupWordLabel: "palavra atual",
  hilbertCaption: "Hotel de Hilbert — abrir espaço para mais",
  hilbertAddOne: "+1 hóspede",
  hilbertDouble: "+∞ hóspedes (n → 2n)",
  hilbertReset: "↺ reiniciar",
  hilbertFreeRooms: "livres",
  hilbertOccupied: "ocupados",
  hilbertHint:
    "O hotel está cheio e, ainda assim, há sempre espaço para mais um — ou para infinitos mais. Banach–Tarski apanha o mesmo truque algébrico (deslocar uma coleção infinita para um subconjunto próprio de si mesma) e executa-o dentro de uma bola sólida.",

  robinsonNote: "Número mínimo de peças. Quatro são nuvens densas não mensuráveis recortadas pela acção de F₂; a quinta é um único ponto no centro, um artefacto das rotações que fixam a origem.",
  closingPretitle: "Vê o motor",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador desenha explicitamente a árvore de Cayley de F₂: deixa-te marcar as quatro classes de palavras, ver a decomposição paradoxal a montar-se e seguir cada peça até uma rotação. A matemática lá em cima torna-se uma imagem que podes rodar.",
  ctaLabel: "→ Abrir o Explorador",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Paradox",
    title: "Banach–Tarskis paradox",
    tagline: "Skär ett klot, få två tillbaka.",
    intro:
      "Ett massivt klot, uppdelat i en handfull bitar, kan sättas ihop till två massiva klot, vart och ett identiskt med originalet — ingen sträckning, ingen extra materia. Explorern ritar upp motorn bakom tricket: den fria gruppen F₂ av två rotationer, vars självlika Cayley-träd innehåller fyra förskjutna kopior av sig självt. Den förgrenade strukturen är, nästan bokstavligt, varifrån det andra klotet kommer.",
    ctaInteractive: "→ Öppna Explorern",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Skär ett klot. Få två tillbaka.",
    cards: [
      {
        label: "01",
        title: "Den stora idén",
        body: "Ta ett massivt klot. Skär det i en handfull bitar. Flytta bitarna — bara rotationer och translationer, inget töjande, ingen deformation. Sätt ihop dem igen. Nu har du två massiva klot, vart och ett lika stort som originalet. Det är en sats, inget trick. Och det är förstås fysiskt omöjligt.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Ta en hel apelsin. Skär den — matematiskt — i exakt fem bitar. Inga klyftor: varje bit är ett tätt punktmoln som löper sammanflätat genom hela frukten. Rotera varje moln stelt på plats, ingen sträckning, ingen extra materia. De fem bitarna sätts ihop till två hela apelsiner, var och en lika stor som originalet och omöjlig att skilja från det. Snittet är exakt definierat men fysiskt outförbart — ingen skalpell kan följa det, för det existerar bara i kontinuumet.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Paradoxen är den klaraste signalen om att matematisk verklighet och fysisk verklighet inte är samma sak. Den hänger på urvalsaxiomet — ett tyst antagande som de flesta matematiker använder utan att tänka på det — och den utlöste ett århundrade av debatt om vilka grunder för mängdteorin som är värda att behålla. Bitarna är inga områden du skulle kunna ta på; de är oändliga punktmoln utan definierad volym.",
      },
    ],
    tryIt:
      "Vandra i ett fri-grupp-träd. Se dubbleringstricket spela ut sig nedan.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Din intuition",
      title: "Fysiken säger nej",
      body: "Tappa en cricketboll i golvet. Skär den rent. Vilka bitar som än faller ut måste deras volymer summera till bollens volym. Det är materiens bevarande, och världen låter dig inte fuska. Allt du någonsin skurit, malt, smält eller blandat har följt denna regel. Så när någon säger till dig att de kan tälja ett klot i fem bitar som sätts ihop till två identiska klot, är din magkänsla rätt: inget fysiskt fungerar så. Överraskningen är att i ren matematik kan något göra det.",
    },
    {
      pretitle: "Avsnitt 02 · Urvalsaxiomet",
      title: "Plocka ett ur var och en, oräkneligt många gånger",
      body: "Urvalsaxiomet säger: givet vilken samling av icke-tomma mängder som helst kan du samtidigt välja ett element ur var och en — även om samlingen är överuppräknelig och du inte har någon regel för hur du ska välja. För ändliga eller uppräkneliga samlingar är det självklart. För överuppräkneliga samlingar är det en ren deklaration: en väljare finns, punkt. Banach och Tarski använder det för att välja en representant ur var och en av de överuppräkneligt många banorna i en rotationsgrupp som verkar på sfären. Från den enda valhandlingen följer dubbleringen.",
    },
    {
      pretitle: "Avsnitt 03 · Icke-mätbara mängder",
      title: "Bitar utan volym",
      body: "Lebesguemåttet tilldelar en volym till varje mängd du rimligen kan rita. Men Vitali visade 1905 att man, med urvalsaxiomet, kan konstruera en delmängd av enhetsintervallet som inte tillåter någon konsistent längd alls — att ge den vilket värde som helst, även noll, motsäger måttets regler. Banach–Tarski-bitarna är tredimensionella kusiner till Vitalis mängd: täta punktmoln vars volym är genuint odefinierad. Det är därför omgrupperingen inte bryter mot volymbevarandet — ingångsbitarna hade aldrig någon volym att bevara.",
    },
    {
      pretitle: "Avsnitt 04 · Den fria gruppen F₂",
      title: "Två rotationer, inga relationer",
      body: "Välj två rotationer a och b av enhetssfären — till exempel båda med vinkeln θ = arccos(1/3), kring två vinkelräta axlar. Hur du än sammansätter dem — aba⁻¹b, b²a⁻³, vad som helst — kommer du aldrig tillbaka till identiteten utom genom triviala inversförkortningar. Gruppen de genererar är den fria gruppen F₂ över två bokstäver: varje reducerat ord i a, a⁻¹, b, b⁻¹ är en distinkt rotation. F₂ tillåter en paradoxal sönderdelning: dela den i de fyra delmängderna av ord som börjar med varje generator, tillämpa en enda förskjutning, och varje delmängd täcker resten av gruppen. Sfären ärver samma egenskap — och sedan klotet.",
    },
    {
      pretitle: "Avsnitt 05 · Den faktiska sönderdelningen",
      title: "Fem bitar — och Robinson bevisade att det är minimum",
      body: "Banach och Tarskis originalartikel (1924) ger en konstruktion med ändligt antal bitar; senare förfiningar pressade ned antalet till fem. Raphael M. Robinson bevisade 1947 att fem är skarpt — fyra räcker inte. En av de fem är en enda punkt i centrum, en artefakt av rotationernas beteende vid origo; de övriga fyra är de täta, icke-mätbara punktmolnen som F₂-verkan skär ut ur sfären och bär in i klotet. Varje bit roteras som en stel kropp, utan töjning, och resultatet är två massiva klot som inte går att skilja från originalet.",
    },
    {
      pretitle: "Avsnitt 06 · Varför det inte är en motsägelse",
      title: "Olika världar, olika regler",
      body: "Fysiska bitar har mått: man kan väga dem, mäta deras volym, räkna deras atomer. Banach–Tarski-bitar har inget mått — de är överuppräkneliga, täta, ofysiska mängder. Volymbevarande är ett påstående om mätbara saker, och satsen säger aldrig att bitarna är mätbara; den säger tvärtom. Materia har atomer, mängdteori har det inte. Paradoxen är en exakt, formell varning: kontinuumet har struktur vi inte kan röra, och den lugnande ekvationen «volym in = volym ut» är en egenskap hos snälla mängder, inte alla. Det är hela lektionen.",
    },
  ],
  freeGroupCaption: "Cayleygraf för F₂",
  freeGroupReset: "↺ tillbaka till ε",
  freeGroupHint:
    "Varje reducerat ord i a, a⁻¹, b, b⁻¹ är en unik nod. Vandraren landar aldrig på samma nod två gånger om du inte vänder ditt senaste steg. Fyra grenar vid roten, tre vid varje annan nod — och hela det oändliga trädet innehåller fyra förminskade kopior av sig självt. Den självsimilariteten är paradoxen.",
  freeGroupWordLabel: "aktuellt ord",
  hilbertCaption: "Hilberts hotell — gör plats för fler",
  hilbertAddOne: "+1 gäst",
  hilbertDouble: "+∞ gäster (n → 2n)",
  hilbertReset: "↺ återställ",
  hilbertFreeRooms: "lediga",
  hilbertOccupied: "upptagna",
  hilbertHint:
    "Hotellet är fullt och har ändå alltid plats för en till — eller för oändligt många till. Banach–Tarski tar samma algebraiska trick (att flytta en oändlig samling in i en äkta delmängd av sig själv) och kör det inne i ett massivt klot.",

  robinsonNote: "Minimalt antal bitar. Fyra är täta, icke-mätbara punktmoln som F₂-verkan skär ut; den femte är en enda punkt i centrum, en artefakt av rotationerna som fixerar origo.",
  closingPretitle: "Se motorn",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren ritar Cayley-trädet för F₂ explicit: den låter dig markera de fyra ordklasserna, se den paradoxala sönderdelningen sättas ihop och spåra varje bit tillbaka till en rotation. Matematiken ovan blir en bild du kan rotera.",
  ctaLabel: "→ Öppna Utforskaren",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Paradoks",
    title: "Banach–Tarskis paradoks",
    tagline: "Skjær én kule, stå igjen med to.",
    intro:
      "En massiv kule, delt opp i en håndfull biter, kan settes sammen igjen til to massive kuler, hver identisk med originalen — ingen strekking, ingen ekstra materie. Utforskeren tegner motoren bak trikset: den frie gruppen F₂ av to rotasjoner, hvis selvliknende Cayley-tre inneholder fire forskjøvne kopier av seg selv. Den forgrenede strukturen er, nesten bokstavelig talt, der den andre kulen kommer fra.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Skjær én kule. Stå igjen med to.",
    cards: [
      {
        label: "01",
        title: "Den store ideen",
        body: "Ta en massiv kule. Skjær den i en håndfull biter. Flytt bitene — bare rotasjoner og translasjoner, ingen strekking, ingen forvrengning. Sett dem sammen igjen. Du har nå to massive kuler, hver like stor som originalen. Det er et teorem, ikke et triks. Og det er åpenbart fysisk umulig.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Ta en hel appelsin. Skjær den — matematisk — i nøyaktig fem biter. Ingen båter: hver bit er en tett punktsky som er flettet gjennom hele frukten. Roter hver sky stivt på stedet, ingen strekking, ingen ekstra materie. De fem bitene settes sammen til to hele appelsiner, hver like stor som originalen og umulig å skille fra den. Snittet er presist definert, men fysisk uutførbart — ingen skalpell kan følge det, for det finnes bare i kontinuumet.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Paradokset er det reneste signalet om at matematisk virkelighet og fysisk virkelighet ikke er det samme. Det hviler på utvalgsaksiomet — en stille antakelse de fleste matematikere bruker uten å tenke over det — og det utløste et århundre med debatt om hvilke fundamenter for mengdelæren som er verdt å beholde. Bitene er ikke områder du kunne tatt på; de er uendelige punktskyer uten definert volum.",
      },
    ],
    tryIt:
      "Vandre i et frigruppe-tre. Se duplikasjonstrikset utspille seg under.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Din intuisjon",
      title: "Fysikken sier nei",
      body: "Slipp en cricketball i gulvet. Skjær den rent. Hvilke biter enn som faller ut, må volumene deres summere til ballens volum. Det er materiebevaring, og verden lar deg ikke jukse. Alt du noensinne har kuttet, malt, smeltet eller blandet har fulgt denne regelen. Så når noen sier til deg at de kan skjære en kule i fem biter som settes sammen til to identiske kuler, er magefølelsen din riktig: ingenting fysisk fungerer slik. Overraskelsen er at i ren matematikk kan noe gjøre det.",
    },
    {
      pretitle: "Avsnitt 02 · Utvalgsaksiomet",
      title: "Velge én fra hver, utellbart mange ganger",
      body: "Utvalgsaksiomet sier: gitt en hvilken som helst samling av ikke-tomme mengder kan du samtidig velge ett element fra hver — selv om samlingen er overtellbar og du ikke har noen regel for å velge. For endelige eller tellbare samlinger er det opplagt. For overtellbare samlinger er det en ren erklæring: en velger finnes, punktum. Banach og Tarski bruker det til å plukke én representant fra hver av de overtellbart mange banene til en rotasjonsgruppe som virker på sfæren. Fra det ene valget følger dubleringen.",
    },
    {
      pretitle: "Avsnitt 03 · Ikke-målbare mengder",
      title: "Biter uten volum",
      body: "Lebesgue-målet gir et volum til hver mengde du med rimelighet kan tegne. Men Vitali viste i 1905 at man, med utvalgsaksiomet, kan konstruere en delmengde av enhetsintervallet som ikke tillater noen konsistent lengde i det hele tatt — å gi den hvilken som helst verdi, selv null, bryter målereglene. Banach–Tarski-bitene er tredimensjonale fettere av Vitalis mengde: tette punktskyer hvis volum genuint er udefinert. Det er derfor omplasseringen ikke bryter volumbevaring — innbitene hadde aldri noe volum å bevare.",
    },
    {
      pretitle: "Avsnitt 04 · Den frie gruppen F₂",
      title: "To rotasjoner, ingen relasjoner",
      body: "Velg to rotasjoner a og b av enhetssfæren — for eksempel begge med vinkelen θ = arccos(1/3), om to vinkelrette akser. Uansett hvordan du komponerer dem — aba⁻¹b, b²a⁻³, hva det skal være — kommer du aldri tilbake til identiteten utenom triviell inverskansellering. Gruppen de genererer er den frie gruppen F₂ over to bokstaver: hvert redusert ord i a, a⁻¹, b, b⁻¹ er en distinkt rotasjon. F₂ har en paradoksal dekomposisjon: del den i de fire delmengdene av ord som starter med hver generator, anvend ett enkelt skift, og hver delmengde dekker resten av gruppen. Sfæren arver samme egenskap — og deretter kulen.",
    },
    {
      pretitle: "Avsnitt 05 · Den faktiske dekomposisjonen",
      title: "Fem biter — og Robinson beviste at det er minimum",
      body: "Banach og Tarskis originalartikkel (1924) gir en konstruksjon med endelig mange biter; senere forfining presset antallet ned til fem. Raphael M. Robinson beviste i 1947 at fem er skarpt — fire er ikke nok. En av de fem er et enkelt punkt i sentrum, en artefakt av hvordan rotasjonene oppfører seg ved origo; de andre fire er de tette, ikke-målbare punktskyene som F₂-virkningen kutter ut av sfæren og bærer inn i kulen. Hver bit roteres som et stivt legeme, uten strekking, og resultatet er to massive kuler som ikke kan skilles fra originalen.",
    },
    {
      pretitle: "Avsnitt 06 · Hvorfor det ikke er en motsigelse",
      title: "Forskjellige verdener, forskjellige regler",
      body: "Fysiske biter har mål: du kan veie dem, måle volumet deres, telle atomene deres. Banach–Tarski-biter har ikke mål — de er overtellbare, tette, ufysiske mengder. Volumbevaring er en påstand om målbare ting, og teoremet sier aldri at bitene er målbare; det sier det motsatte. Materie har atomer, mengdelæren har ikke det. Paradokset er en eksakt, formell advarsel: kontinuumet har struktur vi ikke kan ta på, og den betryggende ligningen «volum inn = volum ut» er en egenskap ved snille mengder, ikke alle. Det er hele leksjonen.",
    },
  ],
  freeGroupCaption: "Cayley-graf for F₂",
  freeGroupReset: "↺ tilbake til ε",
  freeGroupHint:
    "Hvert redusert ord i a, a⁻¹, b, b⁻¹ er en unik node. Vandreren lander aldri på samme node to ganger med mindre du angrer siste steg. Fire grener ved roten, tre ved hver annen node — og hele det uendelige treet inneholder fire forminskede kopier av seg selv. Den selvlikheten er paradokset.",
  freeGroupWordLabel: "gjeldende ord",
  hilbertCaption: "Hilberts hotell — lag plass til flere",
  hilbertAddOne: "+1 gjest",
  hilbertDouble: "+∞ gjester (n → 2n)",
  hilbertReset: "↺ tilbakestill",
  hilbertFreeRooms: "ledige",
  hilbertOccupied: "opptatte",
  hilbertHint:
    "Hotellet er fullt, og likevel er det alltid plass til én til — eller til uendelig mange til. Banach–Tarski tar samme algebraiske triks (å flytte en uendelig samling inn i en ekte delmengde av seg selv) og kjører det inne i en massiv kule.",

  robinsonNote: "Minimum antall biter. Fire er tette, ikke-målbare punktskyer som F₂-virkningen skjærer ut; den femte er et enkelt punkt i sentrum, en artefakt av rotasjonene som fester origo.",
  closingPretitle: "Se motoren",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren tegner Cayley-treet for F₂ eksplisitt: den lar deg merke de fire ordklassene, se den paradoksale dekomposisjonen settes sammen, og spore hver bit tilbake til en rotasjon. Matematikken over blir et bilde du kan rotere.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function BanachStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/banach/explorer"
      accent={ACCENT}
      borderAccent="border-signal-rose/70"
      bgAccent="bg-signal-rose/10"
      hoverAccent="hover:bg-signal-rose/20"
      gradient="from-signal-rose/10"
      formulaBadge="B³ = B³ ⊔ B³"
      formulaLatex={"B^3 = B^3 \\sqcup B^3"}
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

      {/* Section 01 — naive impossibility */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* INTERACTIVE 1 — Hilbert mini (intuition for "more from infinite") */}
      <section className="mx-auto mb-32 max-w-4xl">
        <Reveal>
          <BanachHilbertMini
            caption={story.hilbertCaption}
            addOneLabel={story.hilbertAddOne}
            doubleLabel={story.hilbertDouble}
            resetLabel={story.hilbertReset}
            freeRoomsLabel={story.hilbertFreeRooms}
            occupiedLabel={story.hilbertOccupied}
            hintLabel={story.hilbertHint}
          />
        </Reveal>
      </section>

      {/* Section 02 — Axiom of Choice */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Non-measurable sets */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — Free group F₂ */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />

        {/* INTERACTIVE 2 — Free-group walker */}
        <Reveal delay={120}>
          <BanachFreeGroup
            caption={story.freeGroupCaption}
            resetLabel={story.freeGroupReset}
            hintLabel={story.freeGroupHint}
            wordLabel={story.freeGroupWordLabel}
          />
        </Reveal>
      </section>

      {/* Section 05 — Actual decomposition, Robinson 1947 */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <div className="hairline space-y-3 rounded-2xl border bg-ink-950/40 p-8 text-center">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Robinson · 1947
            </div>
            <div className="math-italic text-5xl text-ink-100 md:text-6xl">5</div>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-300">
              {story.robinsonNote}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Section 06 — Why it isn't a contradiction */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[5].pretitle}
          title={story.sections[5].title}
          body={story.sections[5].body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA — glass card matching apollonian style */}
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
            href="/banach/explorer"
            className="inline-block rounded-full border border-signal-rose/70 bg-signal-rose/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-rose transition-colors hover:bg-signal-rose/25"
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-rose/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
