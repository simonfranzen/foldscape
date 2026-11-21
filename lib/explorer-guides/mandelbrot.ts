import type { ExplorerGuide } from "./types";

// Numbers quoted here (escape test r² > 256, the 3200-iteration loop cap, the
// 0.012 colour cycle, 200 + 80 iterations per decade, the 1e-10 zoom floor,
// the home view at -0.75 with size 2.6, the Lightning bookmark's size 2e-3)
// match lib/gl/mandelbrot.ts and app/mandelbrot/explorer/page.tsx; update
// both together.
const SHADER_EXCERPT = `vec2 c = uCenter + uv * uScale;
vec2 z = vec2(0.0);
for (int i = 0; i < 3200; i++) {
  if (i >= uMaxIter) { iter = uMaxIter; break; }
  z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;   // z = z² + c
  float r2 = dot(z, z);
  if (r2 > 256.0) {
    // smooth (continuous) iteration count
    float log_zn = 0.5 * log(r2);
    float nu = log(log_zn / log(2.0)) / log(2.0);
    smooth_iter = float(i) + 1.0 - nu;
    iter = i;
    break;
  }
}`;

export const MANDELBROT_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Zoom into the Mandelbrot set in your browser: a WebGL shader iterates z² + c per pixel, with smooth colouring, nine bookmarks and automatic iteration depth.",
    heading: "How this explorer works",
    intro:
      "Every pixel on the screen is a complex number c. For each one, the explorer starts at z = 0 and applies the rule z → z² + c again and again. If z eventually runs off towards infinity, the pixel is outside the Mandelbrot set and gets a colour that tells you how quickly it escaped. If z stays bounded for as long as the explorer is willing to check, the pixel counts as inside and stays dark. The black shape is the set; the coloured bands around it are a map of how reluctantly nearby points leave.",
    sections: [
      {
        heading: "One rule, one question",
        paragraphs: [
          "The Mandelbrot set is the collection of all complex numbers c for which the sequence below stays bounded. That is all the explorer computes, and yet the boundary between bounded and unbounded is one of the most intricate shapes in mathematics.",
          "A useful fact makes the computation possible at all: once |z| exceeds 2, the orbit is guaranteed to escape. So a single escape test decides the outside. The inside can never be proven by iterating, only suspected, which is why the iteration limit matters. A few landmarks are easy to check by hand. c = 0 stays at 0 forever. c = −1 bounces between −1 and 0. c = −2 goes to 2 and stays there, which makes it the leftmost point of the set. c = 1 runs off as 1, 2, 5, 26 and so on. On the real axis the set covers exactly the interval from −2 to 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ stays bounded}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Drag to pan. Double-click zooms in by a factor of two around the cursor, Shift plus double-click zooms out. The mouse wheel only zooms while you hold Cmd or Ctrl, so the page still scrolls normally over the image. The +, − and ⟳ buttons in the corner zoom around the centre or return to the starting view, centred on c = −0.75. Its size is 2.6, measured along the shorter side of the canvas, so the whole set fits on wide and tall screens alike. The zoom readout counts powers of ten from that view.",
          "Iterations is the maximum number of steps before a point is declared inside, adjustable from 50 to 3000. With auto switched on (the default) it follows the zoom: 200 iterations at the starting view, 80 more for every factor of ten you zoom in, capped at 3000. Points near the boundary take longer and longer to escape, so a deep view with too few iterations looks blobby and too dark, because escaping points are wrongly counted as inside. Moving the slider by hand switches auto off.",
          "Hue shift rotates the palette along the escape count, exposure brightens or darkens the outside (the interior is unaffected), and the five palettes swap the colour curve. The nine bookmarks jump to well-known places: Seahorse Valley between the main cardioid and the big disc on its left, Elephant Valley at the cusp near c = 0.25, and several spots on the needle that runs to c = −2.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The whole image is computed on your graphics card. A WebGL2 fragment shader runs once per pixel over a single full-screen quad, so a 2000 by 1200 canvas means 2.4 million independent orbits per frame, all in parallel.",
          "The shader tests r² = |z|² > 256 instead of 4, which means it waits until |z| exceeds 16. The larger radius makes the smooth iteration count accurate: subtracting log₂(log₂|z|) from the step number turns the integer escape count into a continuous value, so colour bands blend instead of forming stairs. The palette position is that value times 0.012 plus the hue shift, so the colours cycle about every 83 iterations. Palettes are cosine gradients of the form a + b·cos(2π(c·t + d)). Points that never escape get a near-black ink with a faint glow that slowly drifts over time.",
          "If your system asks for reduced motion, the animation loop that drives that glow is stopped and the explorer draws a single frame whenever you change something, so the image still updates but never moves on its own.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Where the zoom runs out",
        paragraphs: [
          "You can zoom down to a view size of 10⁻¹⁰, but the shader works in 32-bit floating point (highp in WebGL2, with no double-precision emulation), which carries only about seven significant digits. Between 1 and 2 in absolute value, neighbouring representable numbers are 2⁻²³ ≈ 1.2 · 10⁻⁷ apart. Near c ≈ −1.75 two neighbouring pixel columns therefore land on the same real part once the view size drops below about 1.2 · 10⁻⁷ times the shorter canvas side in device pixels: roughly 1.2 · 10⁻⁴ for 1000 pixels, 2.4 · 10⁻⁴ for 2000. Close to the real axis the imaginary parts are small and stay much more finely resolved, so pixels first merge sideways into short horizontal bars. The bookmarks all stay above this limit. That is not a property of the set: the boundary keeps producing new detail at every scale. Deep zoom videos get past this with arbitrary precision arithmetic or perturbation methods that compute one reference orbit exactly and the rest as small offsets from it.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Starve the iterations",
        text: "Load the Triple Spiral bookmark, then drag the iteration slider down to 100. The spirals fill in with darkness, because points that need a few hundred steps to escape are now counted as inside. Raise it back to 1400 and the filaments reappear.",
      },
      {
        title: "Walk the real axis",
        text: "Reset the view and zoom in along the horizontal line through the centre. On the left you reach the needle that ends at −2; on the right the set ends at the cusp near 0.25. Load Antenna to see the very tip, right next to c = −2.",
      },
      {
        title: "Find the copies",
        text: "Open Mini Mandelbrot. In the middle of the frame, around c ≈ −1.76 on the needle, sits the largest of many small replicas of the whole set, with its own cardioid and bulbs. Zoom in on the needle to its left or right and you find even smaller ones.",
      },
      {
        title: "Hit the precision wall",
        text: "Load Lightning (view size 2 · 10⁻³) and press + five or six times; each press halves the view. From about 10⁻⁴ on, the fine branches smear into horizontal bars that get longer with every step, first on large high-density screens. That is the moment 32-bit floats run out of digits.",
      },
    ],
  },
  de: {
    metaDescription:
      "Zoome live in die Mandelbrot-Menge: Ein WebGL-Shader iteriert z² + c für jeden Pixel, mit weicher Färbung, neun Lesezeichen und automatischer Iterationstiefe.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder Pixel auf dem Bildschirm ist eine komplexe Zahl c. Für jede startet der Explorer bei z = 0 und wendet immer wieder die Regel z → z² + c an. Läuft z irgendwann ins Unendliche davon, liegt der Pixel außerhalb der Mandelbrot-Menge und bekommt eine Farbe, die verrät, wie schnell er entkommen ist. Bleibt z beschränkt, solange der Explorer nachsieht, gilt der Pixel als innen und bleibt dunkel. Die schwarze Form ist die Menge, die farbigen Bänder drumherum sind eine Karte dafür, wie zögerlich benachbarte Punkte sie verlassen.",
    sections: [
      {
        heading: "Eine Regel, eine Frage",
        paragraphs: [
          "Die Mandelbrot-Menge besteht aus allen komplexen Zahlen c, für die die Folge unten beschränkt bleibt. Mehr rechnet der Explorer nicht, und trotzdem ist die Grenze zwischen beschränkt und unbeschränkt eine der verwickeltsten Formen der Mathematik.",
          "Eine Tatsache macht die Berechnung überhaupt erst möglich: Sobald |z| größer als 2 ist, entkommt die Bahn garantiert. Ein einziger Test entscheidet also über das Außen. Das Innen lässt sich durch Iterieren nie beweisen, nur vermuten, deshalb ist die Iterationsgrenze so wichtig. Ein paar Wegmarken kannst du von Hand prüfen. c = 0 bleibt für immer bei 0. c = −1 springt zwischen −1 und 0 hin und her. c = −2 geht nach 2 und bleibt dort, das ist der Punkt der Menge, der am weitesten links liegt. c = 1 läuft als 1, 2, 5, 26 und so weiter davon. Auf der reellen Achse deckt die Menge genau das Intervall von −2 bis 1/4 ab.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ bleibt beschränkt}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Ziehen verschiebt das Bild. Ein Doppelklick zoomt um den Faktor zwei an die Stelle des Zeigers, mit gedrückter Umschalttaste zoomt er heraus. Das Mausrad zoomt nur, solange du Cmd oder Strg hältst, damit die Seite über dem Bild normal weiterscrollt. Die Knöpfe +, − und ⟳ in der Ecke zoomen um die Bildmitte oder kehren zur Startansicht zurück, zentriert auf c = −0,75. Ihre Größe ist 2,6, gemessen entlang der kürzeren Seite des Canvas, sodass die ganze Menge auf breite wie auf hohe Bildschirme passt. Die Zoom-Anzeige zählt Zehnerpotenzen ab dieser Ansicht.",
          "Iterationen ist die Höchstzahl an Schritten, bevor ein Punkt als innen gilt, einstellbar von 50 bis 3000. Mit eingeschaltetem Auto (Standard) folgt der Wert dem Zoom: 200 Iterationen in der Startansicht, 80 mehr pro Zehnerfaktor Vergrößerung, höchstens 3000. Punkte nahe der Grenze brauchen immer länger zum Entkommen. Eine tiefe Ansicht mit zu wenigen Iterationen wirkt deshalb klumpig und zu dunkel, weil entkommende Punkte fälschlich als innen gezählt werden. Bewegst du den Regler von Hand, schaltet sich Auto ab.",
          "Der Farbton-Regler verschiebt die Palette entlang der Fluchtzahl, die Belichtung macht das Außen heller oder dunkler (das Innere bleibt unberührt), und die fünf Paletten tauschen den Farbverlauf. Die neun Lesezeichen springen zu bekannten Orten: das Seepferdchen-Tal zwischen der Hauptkardioide und der großen Scheibe links davon, das Elefanten-Tal an der Spitze bei c = 0,25 und mehrere Stellen auf der Nadel, die bis c = −2 reicht.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das ganze Bild entsteht auf deiner Grafikkarte. Ein WebGL2-Fragment-Shader läuft einmal pro Pixel über ein einziges bildschirmfüllendes Rechteck. Ein Canvas mit 2000 mal 1200 Pixeln bedeutet also 2,4 Millionen unabhängige Bahnen pro Frame, alle parallel.",
          "Der Shader prüft r² = |z|² > 256 statt 4, wartet also, bis |z| größer als 16 ist. Der größere Radius macht die weiche Iterationszahl genau: Zieht man log₂(log₂|z|) von der Schrittzahl ab, wird aus der ganzzahligen Fluchtzahl ein kontinuierlicher Wert, und die Farbbänder gehen ineinander über statt Treppen zu bilden. Die Position in der Palette ist dieser Wert mal 0,012 plus Farbtonverschiebung, die Farben wiederholen sich also etwa alle 83 Iterationen. Die Paletten sind Kosinus-Verläufe der Form a + b·cos(2π(c·t + d)). Punkte, die nie entkommen, bekommen ein fast schwarzes Tintenblau mit einem schwachen Schimmer, der langsam wandert.",
          "Wünscht dein System reduzierte Bewegung, wird die Animationsschleife für diesen Schimmer angehalten. Der Explorer zeichnet dann bei jeder Änderung genau ein Bild: Es reagiert weiterhin auf dich, bewegt sich aber nie von selbst.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Wo der Zoom endet",
        paragraphs: [
          "Der Zoom reicht bis zu einer Bildgröße von 10⁻¹⁰, aber der Shader rechnet mit 32-Bit-Gleitkommazahlen (highp in WebGL2, ohne emulierte doppelte Genauigkeit), die nur etwa sieben signifikante Stellen tragen. Für Beträge zwischen 1 und 2 liegen benachbarte darstellbare Zahlen 2⁻²³ ≈ 1,2 · 10⁻⁷ auseinander. Bei c ≈ −1,75 fallen zwei benachbarte Pixelspalten deshalb auf denselben Realteil, sobald die Bildgröße unter etwa 1,2 · 10⁻⁷ mal die kürzere Canvas-Seite in Gerätepixeln sinkt: rund 1,2 · 10⁻⁴ bei 1000 Pixeln, 2,4 · 10⁻⁴ bei 2000. Nahe der reellen Achse sind die Imaginärteile klein und bleiben viel feiner aufgelöst, deshalb verschmelzen die Pixel zuerst seitlich zu kurzen waagerechten Balken. Die Lesezeichen bleiben alle über dieser Grenze. Das liegt nicht an der Menge: Ihr Rand bringt auf jeder Skala neue Details hervor. Deep-Zoom-Videos umgehen die Grenze mit beliebig genauer Arithmetik oder mit Störungsrechnung, die eine Referenzbahn exakt berechnet und alle anderen als kleine Abweichungen davon.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Iterationen aushungern",
        text: "Lade das Lesezeichen Dreifach-Spirale und zieh den Iterationsregler auf 100. Die Spiralen füllen sich mit Dunkelheit, weil Punkte, die ein paar hundert Schritte zum Entkommen brauchen, jetzt als innen zählen. Stell ihn zurück auf 1400, und die Filamente kehren zurück.",
      },
      {
        title: "Die reelle Achse entlang",
        text: "Setz die Ansicht zurück und zoome entlang der waagerechten Linie durch die Mitte. Links erreichst du die Nadel, die bei −2 endet, rechts endet die Menge an der Spitze bei 0,25. Mit dem Lesezeichen Antenne siehst du das äußerste Ende direkt neben c = −2.",
      },
      {
        title: "Die Kopien finden",
        text: "Öffne Mini-Mandelbrot. In der Bildmitte, bei c ≈ −1,76 auf der Nadel, sitzt das größte von vielen kleinen Abbildern der ganzen Menge, mit eigener Kardioide und eigenen Knospen. Zoomst du links oder rechts davon in die Nadel, findest du noch kleinere.",
      },
      {
        title: "An die Genauigkeitsgrenze stoßen",
        text: "Lade Blitz (Bildgröße 2 · 10⁻³) und drück fünf- oder sechsmal auf +; jeder Druck halbiert den Ausschnitt. Ab etwa 10⁻⁴ verschmieren die feinen Äste zu waagerechten Balken, die mit jedem Schritt länger werden, zuerst auf großen, hochauflösenden Bildschirmen. Genau dann gehen den 32-Bit-Zahlen die Stellen aus.",
      },
    ],
  },
};
