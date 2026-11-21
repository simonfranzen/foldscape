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
  es: {
    metaDescription:
      "Haz zoom en el conjunto de Mandelbrot en el navegador: un shader WebGL itera z² + c en cada píxel, con color suave, nueve marcadores e iteraciones automáticas.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada píxel de la pantalla es un número complejo c. Para cada uno, el explorador empieza en z = 0 y aplica la regla z → z² + c una y otra vez. Si z acaba escapándose hacia el infinito, el píxel está fuera del conjunto de Mandelbrot y recibe un color que indica lo rápido que escapó. Si z se mantiene acotado durante todo el tiempo que el explorador está dispuesto a comprobar, el píxel cuenta como interior y se queda oscuro. La forma negra es el conjunto; las bandas de color que la rodean son un mapa de lo mucho que se resisten a marcharse los puntos cercanos.",
    sections: [
      {
        heading: "Una regla, una pregunta",
        paragraphs: [
          "El conjunto de Mandelbrot reúne todos los números complejos c para los que la sucesión de abajo permanece acotada. Eso es todo lo que calcula el explorador, y sin embargo la frontera entre lo acotado y lo no acotado es una de las formas más intrincadas de las matemáticas.",
          "Un hecho muy útil hace posible el cálculo: en cuanto |z| supera 2, está garantizado que la órbita escapa. Así que una sola prueba de escape decide el exterior. El interior nunca se puede demostrar iterando, solo sospechar, y por eso importa el límite de iteraciones. Algunos puntos de referencia son fáciles de comprobar a mano. c = 0 se queda en 0 para siempre. c = −1 salta entre −1 y 0. c = −2 va a 2 y ahí se queda, lo que lo convierte en el punto más a la izquierda del conjunto. c = 1 se escapa como 1, 2, 5, 26 y así sucesivamente. Sobre el eje real, el conjunto cubre exactamente el intervalo de −2 a 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ permanece acotado}",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Arrastra para desplazarte. Un doble clic acerca la imagen en un factor de dos alrededor del cursor, y Mayús más doble clic la aleja. La rueda del ratón solo hace zoom mientras mantienes pulsado Cmd o Ctrl, para que la página siga desplazándose con normalidad sobre la imagen. Los botones +, − y ⟳ de la esquina hacen zoom alrededor del centro o vuelven a la vista inicial, centrada en c = −0,75. Su tamaño es 2,6, medido a lo largo del lado más corto del canvas, de modo que el conjunto entero cabe tanto en pantallas anchas como en altas. El indicador «Zoom» cuenta potencias de diez a partir de esa vista.",
          "«Iteraciones» es el número máximo de pasos antes de declarar que un punto está dentro, ajustable de 50 a 3000. Con «auto» activado (la opción por defecto) sigue al zoom: 200 iteraciones en la vista inicial, 80 más por cada factor de diez que te acerques, con un tope de 3000. Los puntos próximos a la frontera tardan cada vez más en escapar, así que una vista profunda con muy pocas iteraciones se ve grumosa y demasiado oscura, porque puntos que escapan se cuentan erróneamente como interiores. Mover el control a mano desactiva «auto».",
          "«Desplazamiento de tono» hace girar la paleta a lo largo del recuento de escape, «Exposición» aclara u oscurece el exterior (el interior no se ve afectado) y las cinco paletas cambian la curva de color. Los nueve marcadores saltan a lugares muy conocidos: el Valle del Caballito de Mar, entre la cardioide principal y el gran disco a su izquierda, el Valle de los Elefantes, en la cúspide cercana a c = 0,25, y varios puntos de la aguja que llega hasta c = −2.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Toda la imagen se calcula en tu tarjeta gráfica. Un fragment shader de WebGL2 se ejecuta una vez por píxel sobre un único rectángulo a pantalla completa, de modo que un canvas de 2000 por 1200 supone 2,4 millones de órbitas independientes por fotograma, todas en paralelo.",
          "El shader comprueba r² = |z|² > 256 en lugar de 4, es decir, espera a que |z| supere 16. El radio mayor hace que el recuento suave de iteraciones sea preciso: al restar log₂(log₂|z|) del número de paso, el recuento entero de escape se convierte en un valor continuo, y las bandas de color se funden en vez de formar escalones. La posición en la paleta es ese valor multiplicado por 0,012 más el desplazamiento de tono, así que los colores se repiten aproximadamente cada 83 iteraciones. Las paletas son degradados de coseno de la forma a + b·cos(2π(c·t + d)). Los puntos que nunca escapan reciben una tinta casi negra con un resplandor tenue que se desplaza lentamente con el tiempo.",
          "Si tu sistema pide reducir el movimiento, el bucle de animación que mueve ese resplandor se detiene y el explorador dibuja un único fotograma cada vez que cambias algo, de modo que la imagen se sigue actualizando pero nunca se mueve por sí sola.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Dónde se acaba el zoom",
        paragraphs: [
          "Puedes acercarte hasta un tamaño de vista de 10⁻¹⁰, pero el shader trabaja en coma flotante de 32 bits (highp en WebGL2, sin emulación de doble precisión), que solo ofrece unas siete cifras significativas. Entre 1 y 2 en valor absoluto, los números representables vecinos distan 2⁻²³ ≈ 1,2 · 10⁻⁷. Cerca de c ≈ −1,75, dos columnas de píxeles vecinas caen por tanto sobre la misma parte real en cuanto el tamaño de la vista baja de unas 1,2 · 10⁻⁷ veces el lado más corto del canvas en píxeles de dispositivo: aproximadamente 1,2 · 10⁻⁴ para 1000 píxeles y 2,4 · 10⁻⁴ para 2000. Cerca del eje real las partes imaginarias son pequeñas y se resuelven con mucha más finura, así que los píxeles se funden primero de lado en barras horizontales cortas. Todos los marcadores quedan por encima de este límite. No es una propiedad del conjunto: la frontera sigue produciendo detalle nuevo a cualquier escala. Los vídeos de zoom profundo lo superan con aritmética de precisión arbitraria o con métodos de perturbación que calculan una órbita de referencia de forma exacta y el resto como pequeñas desviaciones respecto a ella.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Deja sin iteraciones a la imagen",
        text: "Carga el marcador Espiral Triple y arrastra el control de iteraciones hasta 100. Las espirales se llenan de oscuridad, porque los puntos que necesitan unos cientos de pasos para escapar ahora cuentan como interiores. Vuelve a subirlo a 1400 y los filamentos reaparecen.",
      },
      {
        title: "Recorre el eje real",
        text: "Restablece la vista y acércate siguiendo la línea horizontal que pasa por el centro. A la izquierda llegas a la aguja que termina en −2; a la derecha, el conjunto acaba en la cúspide cercana a 0,25. Carga Antena para ver la punta misma, justo al lado de c = −2.",
      },
      {
        title: "Encuentra las copias",
        text: "Abre Mini Mandelbrot. En el centro del encuadre, en torno a c ≈ −1,76 sobre la aguja, está la mayor de muchas pequeñas réplicas del conjunto entero, con su propia cardioide y sus bulbos. Acércate a la aguja a su izquierda o a su derecha y encontrarás otras todavía más pequeñas.",
      },
      {
        title: "Choca contra el muro de la precisión",
        text: "Carga Rayo (tamaño de vista 2 · 10⁻³) y pulsa + cinco o seis veces; cada pulsación reduce la vista a la mitad. A partir de unos 10⁻⁴, las ramas finas se emborronan en barras horizontales que se alargan con cada paso, primero en pantallas grandes de alta densidad. Ese es el momento en que los números de coma flotante de 32 bits se quedan sin cifras.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Zoome sur l'ensemble de Mandelbrot dans ton navigateur : un shader WebGL itère z² + c par pixel, avec couleurs lisses, neuf signets et itérations automatiques.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque pixel de l'écran est un nombre complexe c. Pour chacun, l'explorateur part de z = 0 et applique la règle z → z² + c encore et encore. Si z finit par filer vers l'infini, le pixel est hors de l'ensemble de Mandelbrot et reçoit une couleur qui indique à quelle vitesse il s'est échappé. Si z reste borné aussi longtemps que l'explorateur veut bien vérifier, le pixel est considéré comme intérieur et reste sombre. La forme noire est l'ensemble ; les bandes colorées qui l'entourent dessinent la carte de la réticence des points voisins à s'en aller.",
    sections: [
      {
        heading: "Une règle, une question",
        paragraphs: [
          "L'ensemble de Mandelbrot rassemble tous les nombres complexes c pour lesquels la suite ci-dessous reste bornée. C'est tout ce que calcule l'explorateur, et pourtant la frontière entre borné et non borné est l'une des formes les plus complexes des mathématiques.",
          "Un fait bien utile rend le calcul tout simplement possible : dès que |z| dépasse 2, l'orbite s'échappe à coup sûr. Un seul test d'échappement suffit donc à trancher pour l'extérieur. L'intérieur, lui, ne peut jamais être prouvé par itération, seulement soupçonné, et c'est pour cela que la limite d'itérations compte. Quelques repères se vérifient facilement à la main. c = 0 reste en 0 pour toujours. c = −1 oscille entre −1 et 0. c = −2 va en 2 et y reste, ce qui en fait le point le plus à gauche de l'ensemble. c = 1 file en 1, 2, 5, 26 et ainsi de suite. Sur l'axe réel, l'ensemble couvre exactement l'intervalle de −2 à 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ reste borné}",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Fais glisser pour te déplacer. Un double-clic zoome d'un facteur deux autour du curseur, Maj plus double-clic dézoome. La molette ne zoome que si tu maintiens Cmd ou Ctrl, afin que la page continue de défiler normalement au-dessus de l'image. Les boutons +, − et ⟳ dans le coin zooment autour du centre ou reviennent à la vue de départ, centrée sur c = −0,75. Sa taille est de 2,6, mesurée le long du petit côté du canvas, de sorte que l'ensemble entier tient aussi bien sur les écrans larges que sur les écrans hauts. L'indicateur « Zoom » compte les puissances de dix à partir de cette vue.",
          "« Itérations » est le nombre maximal de pas avant qu'un point soit déclaré intérieur, réglable de 50 à 3000. Quand « auto » est activé (le réglage par défaut), il suit le zoom : 200 itérations dans la vue de départ, 80 de plus pour chaque facteur dix de zoom, avec un plafond de 3000. Les points proches de la frontière mettent de plus en plus de temps à s'échapper, si bien qu'une vue profonde avec trop peu d'itérations paraît pâteuse et trop sombre, parce que des points qui s'échappent sont comptés à tort comme intérieurs. Déplacer le curseur à la main désactive « auto ».",
          "« Décalage de teinte » fait tourner la palette le long du compte d'échappement, « Exposition » éclaircit ou assombrit l'extérieur (l'intérieur n'est pas touché), et les cinq palettes changent la courbe de couleur. Les neuf signets sautent vers des lieux bien connus : la Vallée des Hippocampes, entre la cardioïde principale et le grand disque à sa gauche, la Vallée des Éléphants, au point de rebroussement près de c = 0,25, et plusieurs endroits sur l'aiguille qui s'étend jusqu'à c = −2.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Toute l'image est calculée sur ta carte graphique. Un fragment shader WebGL2 s'exécute une fois par pixel sur un unique rectangle plein écran, si bien qu'un canvas de 2000 sur 1200 représente 2,4 millions d'orbites indépendantes par image, toutes en parallèle.",
          "Le shader teste r² = |z|² > 256 au lieu de 4, ce qui revient à attendre que |z| dépasse 16. Ce rayon plus grand rend précis le compte d'itérations lissé : en soustrayant log₂(log₂|z|) du numéro du pas, le compte d'échappement entier devient une valeur continue, et les bandes de couleur se fondent au lieu de former des marches. La position dans la palette est cette valeur multipliée par 0,012 plus le décalage de teinte, et les couleurs reviennent donc environ toutes les 83 itérations. Les palettes sont des dégradés en cosinus de la forme a + b·cos(2π(c·t + d)). Les points qui ne s'échappent jamais reçoivent une encre presque noire avec une faible lueur qui dérive lentement au fil du temps.",
          "Si ton système demande de réduire les animations, la boucle d'animation qui pilote cette lueur est arrêtée et l'explorateur dessine une seule image chaque fois que tu modifies quelque chose : l'image se met toujours à jour, mais ne bouge jamais d'elle-même.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Là où le zoom s'épuise",
        paragraphs: [
          "Tu peux zoomer jusqu'à une taille de vue de 10⁻¹⁰, mais le shader calcule en virgule flottante 32 bits (highp en WebGL2, sans émulation de la double précision), qui n'offre qu'environ sept chiffres significatifs. Entre 1 et 2 en valeur absolue, deux nombres représentables voisins sont séparés de 2⁻²³ ≈ 1,2 · 10⁻⁷. Près de c ≈ −1,75, deux colonnes de pixels voisines tombent donc sur la même partie réelle dès que la taille de la vue passe sous environ 1,2 · 10⁻⁷ fois le petit côté du canvas en pixels physiques : à peu près 1,2 · 10⁻⁴ pour 1000 pixels, 2,4 · 10⁻⁴ pour 2000. Près de l'axe réel, les parties imaginaires sont petites et restent bien plus finement résolues, si bien que les pixels fusionnent d'abord latéralement en courtes barres horizontales. Les signets restent tous au-dessus de cette limite. Ce n'est pas une propriété de l'ensemble : la frontière continue de produire de nouveaux détails à toutes les échelles. Les vidéos de zoom profond contournent l'obstacle grâce à l'arithmétique en précision arbitraire ou à des méthodes de perturbation qui calculent exactement une orbite de référence et toutes les autres comme de petits écarts par rapport à elle.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Affame les itérations",
        text: "Charge le signet Triple Spirale, puis fais descendre le curseur des itérations à 100. Les spirales se remplissent d'obscurité, parce que les points qui ont besoin de quelques centaines de pas pour s'échapper sont désormais comptés comme intérieurs. Remonte-le à 1400 et les filaments réapparaissent.",
      },
      {
        title: "Parcours l'axe réel",
        text: "Réinitialise la vue et zoome le long de la ligne horizontale qui passe par le centre. À gauche, tu atteins l'aiguille qui se termine en −2 ; à droite, l'ensemble s'arrête au point de rebroussement près de 0,25. Charge Antenne pour voir l'extrême pointe, juste à côté de c = −2.",
      },
      {
        title: "Trouve les copies",
        text: "Ouvre Mini Mandelbrot. Au milieu du cadre, vers c ≈ −1,76 sur l'aiguille, se trouve la plus grande des nombreuses petites répliques de l'ensemble entier, avec sa propre cardioïde et ses bulbes. Zoome sur l'aiguille à sa gauche ou à sa droite et tu en trouveras de plus petites encore.",
      },
      {
        title: "Heurte le mur de la précision",
        text: "Charge Éclair (taille de vue 2 · 10⁻³) et appuie cinq ou six fois sur + ; chaque appui divise la vue par deux. À partir d'environ 10⁻⁴, les fines branches bavent en barres horizontales qui s'allongent à chaque pas, d'abord sur les grands écrans à haute densité. C'est le moment où les flottants 32 bits arrivent à court de chiffres.",
      },
    ],
  },
  it: {
    metaDescription:
      "Zooma nell'insieme di Mandelbrot dal browser: uno shader WebGL itera z² + c per ogni pixel, con colorazione sfumata, nove segnalibri e iterazioni automatiche.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni pixel dello schermo è un numero complesso c. Per ciascuno, l'esploratore parte da z = 0 e applica la regola z → z² + c ancora e ancora. Se prima o poi z fugge verso l'infinito, il pixel è fuori dall'insieme di Mandelbrot e riceve un colore che dice quanto in fretta è fuggito. Se z resta limitato per tutto il tempo che l'esploratore è disposto a controllare, il pixel conta come interno e rimane scuro. La forma nera è l'insieme; le bande colorate che la circondano sono una mappa di quanto a malincuore se ne vanno i punti vicini.",
    sections: [
      {
        heading: "Una regola, una domanda",
        paragraphs: [
          "L'insieme di Mandelbrot raccoglie tutti i numeri complessi c per i quali la successione qui sotto resta limitata. È tutto ciò che l'esploratore calcola, eppure il confine tra limitato e illimitato è una delle forme più intricate della matematica.",
          "Un fatto utile rende possibile il calcolo: non appena |z| supera 2, è garantito che l'orbita fugge. Quindi un solo test di fuga decide l'esterno. L'interno non si può mai dimostrare iterando, solo sospettare, ed è per questo che il limite di iterazioni conta. Alcuni punti di riferimento si verificano facilmente a mano. c = 0 resta in 0 per sempre. c = −1 rimbalza tra −1 e 0. c = −2 va in 2 e lì rimane, il che ne fa il punto più a sinistra dell'insieme. c = 1 fugge come 1, 2, 5, 26 e così via. Sull'asse reale l'insieme copre esattamente l'intervallo da −2 a 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ resta limitato}",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Trascina per spostarti. Un doppio clic ingrandisce di un fattore due intorno al cursore, Maiusc più doppio clic rimpicciolisce. La rotellina del mouse fa zoom solo mentre tieni premuto Cmd o Ctrl, così la pagina continua a scorrere normalmente sopra l'immagine. I pulsanti +, − e ⟳ nell'angolo fanno zoom intorno al centro oppure tornano alla vista iniziale, centrata su c = −0,75. La sua dimensione è 2,6, misurata lungo il lato più corto del canvas, così l'intero insieme entra tanto negli schermi larghi quanto in quelli alti. L'indicatore «Zoom» conta le potenze di dieci a partire da quella vista.",
          "«Iterazioni» è il numero massimo di passi prima che un punto venga dichiarato interno, regolabile da 50 a 3000. Con «auto» attivo (l'impostazione predefinita) segue lo zoom: 200 iterazioni nella vista iniziale, 80 in più per ogni fattore dieci di ingrandimento, con un tetto di 3000. I punti vicini al confine impiegano sempre più tempo a fuggire, quindi una vista profonda con troppo poche iterazioni appare grumosa e troppo scura, perché punti in fuga vengono contati a torto come interni. Spostare il cursore a mano disattiva «auto».",
          "«Spostamento tonalità» fa ruotare la tavolozza lungo il conteggio di fuga, «Esposizione» schiarisce o scurisce l'esterno (l'interno non ne risente) e le cinque tavolozze cambiano la curva di colore. I nove segnalibri saltano a luoghi ben noti: la Valle del Cavalluccio, tra la cardioide principale e il grande disco alla sua sinistra, la Valle degli Elefanti, alla cuspide vicino a c = 0,25, e diversi punti sull'ago che arriva fino a c = −2.",
        ],
      },
      {
        heading: "Come è costruito",
        paragraphs: [
          "L'intera immagine viene calcolata sulla tua scheda grafica. Un fragment shader WebGL2 viene eseguito una volta per pixel su un unico rettangolo a tutto schermo, quindi un canvas di 2000 per 1200 significa 2,4 milioni di orbite indipendenti per fotogramma, tutte in parallelo.",
          "Lo shader verifica r² = |z|² > 256 invece di 4, cioè aspetta che |z| superi 16. Il raggio più grande rende accurato il conteggio sfumato delle iterazioni: sottraendo log₂(log₂|z|) dal numero del passo, il conteggio intero di fuga diventa un valore continuo, e le bande di colore sfumano l'una nell'altra invece di formare gradini. La posizione nella tavolozza è quel valore moltiplicato per 0,012 più lo spostamento di tonalità, perciò i colori si ripetono all'incirca ogni 83 iterazioni. Le tavolozze sono gradienti di coseno della forma a + b·cos(2π(c·t + d)). I punti che non fuggono mai ricevono un inchiostro quasi nero con un debole bagliore che si sposta lentamente nel tempo.",
          "Se il tuo sistema chiede di ridurre il movimento, il ciclo di animazione che muove quel bagliore viene fermato e l'esploratore disegna un solo fotogramma ogni volta che cambi qualcosa, così l'immagine si aggiorna comunque ma non si muove mai da sola.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Dove finisce lo zoom",
        paragraphs: [
          "Puoi ingrandire fino a una dimensione della vista di 10⁻¹⁰, ma lo shader lavora in virgola mobile a 32 bit (highp in WebGL2, senza emulazione della doppia precisione), che offre solo circa sette cifre significative. Tra 1 e 2 in valore assoluto, i numeri rappresentabili vicini distano 2⁻²³ ≈ 1,2 · 10⁻⁷. Vicino a c ≈ −1,75 due colonne di pixel adiacenti cadono quindi sulla stessa parte reale non appena la dimensione della vista scende sotto circa 1,2 · 10⁻⁷ volte il lato più corto del canvas in pixel del dispositivo: all'incirca 1,2 · 10⁻⁴ per 1000 pixel, 2,4 · 10⁻⁴ per 2000. Vicino all'asse reale le parti immaginarie sono piccole e restano risolte molto più finemente, perciò i pixel si fondono dapprima di lato in brevi barre orizzontali. I segnalibri restano tutti sopra questo limite. Non è una proprietà dell'insieme: il confine continua a produrre nuovi dettagli a ogni scala. I video di zoom profondo lo superano con l'aritmetica a precisione arbitraria o con metodi perturbativi che calcolano esattamente un'orbita di riferimento e tutte le altre come piccoli scostamenti da essa.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Affama le iterazioni",
        text: "Carica il segnalibro Spirale Tripla, poi trascina il cursore delle iterazioni giù fino a 100. Le spirali si riempiono di buio, perché i punti che hanno bisogno di qualche centinaio di passi per fuggire ora vengono contati come interni. Riportalo a 1400 e i filamenti ricompaiono.",
      },
      {
        title: "Percorri l'asse reale",
        text: "Ripristina la vista e ingrandisci lungo la linea orizzontale che passa per il centro. A sinistra raggiungi l'ago che termina in −2; a destra l'insieme finisce alla cuspide vicino a 0,25. Carica Antenna per vedere la punta estrema, proprio accanto a c = −2.",
      },
      {
        title: "Trova le copie",
        text: "Apri Mini Mandelbrot. Al centro dell'inquadratura, intorno a c ≈ −1,76 sull'ago, si trova la più grande di tante piccole repliche dell'intero insieme, con la sua cardioide e i suoi bulbi. Ingrandisci l'ago alla sua sinistra o alla sua destra e ne troverai di ancora più piccole.",
      },
      {
        title: "Sbatti contro il muro della precisione",
        text: "Carica Fulmine (dimensione della vista 2 · 10⁻³) e premi + cinque o sei volte; ogni pressione dimezza la vista. A partire da circa 10⁻⁴ i rami sottili si impastano in barre orizzontali che si allungano a ogni passo, prima sugli schermi grandi ad alta densità. È il momento in cui i numeri in virgola mobile a 32 bit restano senza cifre.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Faz zoom no conjunto de Mandelbrot no teu navegador: um shader WebGL itera z² + c em cada píxel, com cor suave, nove marcadores e iterações automáticas.",
    heading: "Como funciona este explorador",
    intro:
      "Cada píxel do ecrã é um número complexo c. Para cada um, o explorador começa em z = 0 e aplica a regra z → z² + c vezes sem conta. Se z acabar por fugir para o infinito, o píxel está fora do conjunto de Mandelbrot e recebe uma cor que indica a rapidez com que escapou. Se z se mantiver limitado durante todo o tempo que o explorador está disposto a verificar, o píxel conta como interior e fica escuro. A forma negra é o conjunto; as faixas coloridas à sua volta são um mapa da relutância com que os pontos vizinhos se vão embora.",
    sections: [
      {
        heading: "Uma regra, uma pergunta",
        paragraphs: [
          "O conjunto de Mandelbrot reúne todos os números complexos c para os quais a sucessão abaixo se mantém limitada. É tudo o que o explorador calcula, e no entanto a fronteira entre limitado e ilimitado é uma das formas mais intrincadas da matemática.",
          "Um facto útil torna o cálculo possível: assim que |z| ultrapassa 2, é garantido que a órbita escapa. Um único teste de fuga decide, portanto, o exterior. O interior nunca pode ser provado por iteração, apenas suspeitado, e é por isso que o limite de iterações importa. Alguns pontos de referência são fáceis de verificar à mão. c = 0 fica em 0 para sempre. c = −1 salta entre −1 e 0. c = −2 vai para 2 e fica lá, o que faz dele o ponto mais à esquerda do conjunto. c = 1 foge como 1, 2, 5, 26 e assim por diante. No eixo real, o conjunto cobre exatamente o intervalo de −2 a 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ mantém-se limitado}",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Arrasta para deslocar a imagem. Um duplo clique aproxima por um fator de dois em torno do cursor, Shift mais duplo clique afasta. A roda do rato só faz zoom enquanto manténs Cmd ou Ctrl premido, para que a página continue a deslizar normalmente sobre a imagem. Os botões +, − e ⟳ no canto fazem zoom em torno do centro ou regressam à vista inicial, centrada em c = −0,75. O seu tamanho é 2,6, medido ao longo do lado mais curto do canvas, pelo que o conjunto inteiro cabe tanto em ecrãs largos como em ecrãs altos. O indicador «Zoom» conta potências de dez a partir dessa vista.",
          "«Iterações» é o número máximo de passos antes de um ponto ser declarado interior, ajustável de 50 a 3000. Com «auto» ligado (a predefinição), acompanha o zoom: 200 iterações na vista inicial, mais 80 por cada fator de dez de aproximação, com um teto de 3000. Os pontos perto da fronteira demoram cada vez mais a escapar, pelo que uma vista profunda com iterações a menos fica empastada e demasiado escura, porque pontos que escapam são contados por engano como interiores. Mexer no controlo à mão desliga o «auto».",
          "«Mudança de matiz» roda a paleta ao longo da contagem de fuga, «Exposição» clareia ou escurece o exterior (o interior não é afetado) e as cinco paletas trocam a curva de cor. Os nove marcadores saltam para lugares bem conhecidos: o Vale do Cavalo-marinho, entre a cardioide principal e o grande disco à sua esquerda, o Vale dos Elefantes, na cúspide perto de c = 0,25, e vários pontos na agulha que se estende até c = −2.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A imagem inteira é calculada na tua placa gráfica. Um fragment shader WebGL2 corre uma vez por píxel sobre um único retângulo de ecrã inteiro, pelo que um canvas de 2000 por 1200 significa 2,4 milhões de órbitas independentes por fotograma, todas em paralelo.",
          "O shader testa r² = |z|² > 256 em vez de 4, ou seja, espera até |z| ultrapassar 16. O raio maior torna exata a contagem suave de iterações: ao subtrair log₂(log₂|z|) ao número do passo, a contagem inteira de fuga transforma-se num valor contínuo, e as faixas de cor fundem-se em vez de formarem degraus. A posição na paleta é esse valor vezes 0,012 mais a mudança de matiz, pelo que as cores se repetem mais ou menos a cada 83 iterações. As paletas são gradientes de cosseno da forma a + b·cos(2π(c·t + d)). Os pontos que nunca escapam recebem uma tinta quase preta com um brilho ténue que vai derivando lentamente com o tempo.",
          "Se o teu sistema pedir movimento reduzido, o ciclo de animação que conduz esse brilho é parado e o explorador desenha um único fotograma sempre que alteras alguma coisa, de modo que a imagem continua a atualizar-se mas nunca se move sozinha.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Onde o zoom se esgota",
        paragraphs: [
          "Podes aproximar até um tamanho de vista de 10⁻¹⁰, mas o shader trabalha em vírgula flutuante de 32 bits (highp em WebGL2, sem emulação de dupla precisão), que só garante cerca de sete algarismos significativos. Entre 1 e 2 em valor absoluto, os números representáveis vizinhos distam 2⁻²³ ≈ 1,2 · 10⁻⁷. Perto de c ≈ −1,75, duas colunas de píxeis vizinhas caem por isso na mesma parte real assim que o tamanho da vista desce abaixo de cerca de 1,2 · 10⁻⁷ vezes o lado mais curto do canvas em píxeis do dispositivo: aproximadamente 1,2 · 10⁻⁴ para 1000 píxeis, 2,4 · 10⁻⁴ para 2000. Perto do eixo real as partes imaginárias são pequenas e ficam resolvidas com muito mais finura, pelo que os píxeis se fundem primeiro para os lados em barras horizontais curtas. Os marcadores ficam todos acima deste limite. Não é uma propriedade do conjunto: a fronteira continua a produzir detalhe novo em todas as escalas. Os vídeos de zoom profundo contornam isto com aritmética de precisão arbitrária ou com métodos de perturbação que calculam uma órbita de referência de forma exata e as restantes como pequenos desvios em relação a ela.",
        ],
      },
    ],
    experimentsHeading: "Experimenta",
    experiments: [
      {
        title: "Deixa as iterações à míngua",
        text: "Carrega o marcador Espiral Tripla e arrasta o controlo das iterações para baixo, até 100. As espirais enchem-se de escuridão, porque os pontos que precisam de umas centenas de passos para escapar passam a contar como interiores. Volta a subi-lo para 1400 e os filamentos reaparecem.",
      },
      {
        title: "Percorre o eixo real",
        text: "Repõe a vista e aproxima ao longo da linha horizontal que passa pelo centro. À esquerda chegas à agulha que termina em −2; à direita o conjunto acaba na cúspide perto de 0,25. Carrega Antena para veres a ponta propriamente dita, mesmo ao lado de c = −2.",
      },
      {
        title: "Encontra as cópias",
        text: "Abre Mini Mandelbrot. No meio do enquadramento, por volta de c ≈ −1,76 na agulha, está a maior de muitas pequenas réplicas do conjunto inteiro, com a sua própria cardioide e os seus bolbos. Aproxima a agulha à esquerda ou à direita dela e encontras outras ainda mais pequenas.",
      },
      {
        title: "Bate na parede da precisão",
        text: "Carrega Relâmpago (tamanho de vista 2 · 10⁻³) e prime + cinco ou seis vezes; cada toque reduz a vista a metade. A partir de cerca de 10⁻⁴, os ramos finos esborratam-se em barras horizontais que ficam mais compridas a cada passo, primeiro em ecrãs grandes de alta densidade. É o momento em que os números de vírgula flutuante de 32 bits ficam sem algarismos.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Zooma in i Mandelbrotmängden i webbläsaren: en WebGL-shader itererar z² + c för varje pixel, med mjuka färger, nio bokmärken och automatiskt iterationsdjup.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje pixel på skärmen är ett komplext tal c. För vart och ett börjar utforskaren i z = 0 och tillämpar regeln z → z² + c om och om igen. Om z så småningom rusar iväg mot oändligheten ligger pixeln utanför Mandelbrotmängden och får en färg som visar hur snabbt den flydde. Om z håller sig begränsat så länge utforskaren är villig att kontrollera räknas pixeln som innanför och förblir mörk. Den svarta formen är mängden; de färgade banden runt den är en karta över hur motvilligt närliggande punkter ger sig av.",
    sections: [
      {
        heading: "En regel, en fråga",
        paragraphs: [
          "Mandelbrotmängden består av alla komplexa tal c för vilka följden nedan förblir begränsad. Det är allt utforskaren räknar ut, och ändå är gränsen mellan begränsat och obegränsat en av de mest invecklade formerna i matematiken.",
          "Ett användbart faktum gör beräkningen över huvud taget möjlig: så fort |z| överstiger 2 är det garanterat att banan flyr. Ett enda flykttest avgör alltså utsidan. Insidan kan aldrig bevisas genom iteration, bara misstänkas, och det är därför iterationsgränsen spelar roll. Några hållpunkter är lätta att kontrollera för hand. c = 0 stannar i 0 för alltid. c = −1 studsar mellan −1 och 0. c = −2 går till 2 och stannar där, vilket gör den till mängdens punkt längst till vänster. c = 1 rusar iväg som 1, 2, 5, 26 och så vidare. På den reella axeln täcker mängden exakt intervallet från −2 till 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ förblir begränsat}",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Dra för att panorera. Dubbelklick zoomar in med en faktor två kring pekaren, Skift plus dubbelklick zoomar ut. Mushjulet zoomar bara medan du håller ned Cmd eller Ctrl, så sidan rullar som vanligt över bilden. Knapparna +, − och ⟳ i hörnet zoomar kring mitten eller återgår till startvyn, centrerad på c = −0,75. Dess storlek är 2,6, mätt längs canvasens kortare sida, så hela mängden får plats på både breda och höga skärmar. Visaren ”Zoom” räknar tiopotenser från den vyn.",
          "”Iterationer” är det högsta antalet steg innan en punkt förklaras ligga innanför, inställbart från 50 till 3000. Med ”auto” påslaget (standard) följer värdet zoomen: 200 iterationer i startvyn, 80 till för varje faktor tio du zoomar in, med ett tak på 3000. Punkter nära randen tar allt längre tid på sig att fly, så en djup vy med för få iterationer ser klumpig och för mörk ut, eftersom flyende punkter felaktigt räknas som innanför. Flyttar du reglaget för hand stängs ”auto” av.",
          "”Nyansförskjutning” roterar paletten längs flykträkningen, ”Exponering” gör utsidan ljusare eller mörkare (insidan påverkas inte), och de fem paletterna byter färgkurva. De nio bokmärkena hoppar till välkända platser: Sjöhästdalen mellan huvudkardioiden och den stora skivan till vänster om den, Elefantdalen vid spetsen nära c = 0,25 och flera ställen på nålen som löper till c = −2.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Hela bilden beräknas på ditt grafikkort. En WebGL2-fragmentshader körs en gång per pixel över en enda skärmfyllande rektangel, så en canvas på 2000 gånger 1200 innebär 2,4 miljoner oberoende banor per bildruta, alla parallellt.",
          "Shadern testar r² = |z|² > 256 i stället för 4, vilket betyder att den väntar tills |z| överstiger 16. Den större radien gör det mjuka iterationsantalet noggrant: när man drar log₂(log₂|z|) från stegnumret blir det heltaliga flyktantalet ett kontinuerligt värde, så färgbanden flyter ihop i stället för att bilda trappsteg. Positionen i paletten är det värdet gånger 0,012 plus nyansförskjutningen, så färgerna går runt ungefär var 83:e iteration. Paletterna är cosinusgradienter av formen a + b·cos(2π(c·t + d)). Punkter som aldrig flyr får ett nästan svart bläck med ett svagt sken som långsamt driver med tiden.",
          "Om ditt system ber om reducerad rörelse stoppas animationsslingan som driver skenet, och utforskaren ritar en enda bildruta varje gång du ändrar något, så bilden uppdateras fortfarande men rör sig aldrig av sig själv.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Där zoomen tar slut",
        paragraphs: [
          "Du kan zooma ned till en vystorlek på 10⁻¹⁰, men shadern räknar med 32-bitars flyttal (highp i WebGL2, utan emulerad dubbel precision), som bara rymmer ungefär sju signifikanta siffror. Mellan 1 och 2 i absolutbelopp ligger närliggande representerbara tal 2⁻²³ ≈ 1,2 · 10⁻⁷ från varandra. Nära c ≈ −1,75 hamnar två intilliggande pixelkolumner därför på samma realdel så snart vystorleken sjunker under ungefär 1,2 · 10⁻⁷ gånger canvasens kortare sida i enhetspixlar: omkring 1,2 · 10⁻⁴ för 1000 pixlar, 2,4 · 10⁻⁴ för 2000. Nära den reella axeln är imaginärdelarna små och förblir mycket finare upplösta, så pixlarna smälter först ihop i sidled till korta vågräta streck. Bokmärkena håller sig alla över den gränsen. Det är ingen egenskap hos mängden: randen fortsätter att ge nya detaljer i varje skala. Djupzoomvideor kommer förbi detta med aritmetik med godtycklig precision eller med störningsmetoder som beräknar en referensbana exakt och resten som små avvikelser från den.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Svält iterationerna",
        text: "Ladda bokmärket Trippelspiral och dra sedan iterationsreglaget ned till 100. Spiralerna fylls av mörker, eftersom punkter som behöver några hundra steg för att fly nu räknas som innanför. Höj det till 1400 igen så kommer filamenten tillbaka.",
      },
      {
        title: "Vandra längs den reella axeln",
        text: "Återställ vyn och zooma in längs den vågräta linjen genom mitten. Till vänster når du nålen som slutar i −2; till höger slutar mängden i spetsen nära 0,25. Ladda Antenn för att se den yttersta änden, alldeles intill c = −2.",
      },
      {
        title: "Hitta kopiorna",
        text: "Öppna Mini-Mandelbrot. Mitt i bilden, kring c ≈ −1,76 på nålen, sitter den största av många små kopior av hela mängden, med egen kardioid och egna knoppar. Zooma in på nålen till vänster eller höger om den så hittar du ännu mindre.",
      },
      {
        title: "Slå i precisionsväggen",
        text: "Ladda Blixt (vystorlek 2 · 10⁻³) och tryck på + fem eller sex gånger; varje tryck halverar vyn. Från ungefär 10⁻⁴ smetas de fina grenarna ut till vågräta streck som blir längre för varje steg, först på stora skärmar med hög pixeltäthet. Det är ögonblicket då 32-bitars flyttal får slut på siffror.",
      },
    ],
  },
  no: {
    metaDescription:
      "Zoom inn i Mandelbrotmengden i nettleseren: en WebGL-shader itererer z² + c for hver piksel, med myk fargelegging, ni bokmerker og automatisk iterasjonsdybde.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver piksel på skjermen er et komplekst tall c. For hvert av dem starter utforskeren i z = 0 og bruker regelen z → z² + c om og om igjen. Hvis z etter hvert stikker av mot uendelig, ligger pikselen utenfor Mandelbrotmengden og får en farge som forteller hvor raskt den rømte. Hvis z holder seg begrenset så lenge utforskeren er villig til å sjekke, regnes pikselen som innenfor og forblir mørk. Den svarte formen er mengden; de fargede båndene rundt den er et kart over hvor motvillig nærliggende punkter drar sin vei.",
    sections: [
      {
        heading: "Én regel, ett spørsmål",
        paragraphs: [
          "Mandelbrotmengden består av alle komplekse tall c der følgen nedenfor forblir begrenset. Det er alt utforskeren regner ut, og likevel er grensen mellom begrenset og ubegrenset en av de mest innviklede formene i matematikken.",
          "Et nyttig faktum gjør beregningen mulig i det hele tatt: så snart |z| overstiger 2, er det garantert at banen rømmer. En enkelt rømningstest avgjør altså utsiden. Innsiden kan aldri bevises ved å iterere, bare mistenkes, og det er derfor iterasjonsgrensen betyr noe. Noen holdepunkter er lette å sjekke for hånd. c = 0 blir værende i 0 for alltid. c = −1 spretter mellom −1 og 0. c = −2 går til 2 og blir der, noe som gjør den til punktet lengst til venstre i mengden. c = 1 stikker av som 1, 2, 5, 26 og så videre. På den reelle aksen dekker mengden nøyaktig intervallet fra −2 til 1/4.",
        ],
        formula:
          "z_0 = 0, \\qquad z_{n+1} = z_n^2 + c, \\qquad c \\in M \\iff |z_n| \\text{ forblir begrenset}",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Dra for å panorere. Dobbeltklikk zoomer inn med en faktor to rundt pekeren, Shift pluss dobbeltklikk zoomer ut. Musehjulet zoomer bare mens du holder Cmd eller Ctrl, slik at siden ruller som vanlig over bildet. Knappene +, − og ⟳ i hjørnet zoomer rundt midten eller går tilbake til startvisningen, sentrert på c = −0,75. Størrelsen er 2,6, målt langs den korteste siden av canvaset, så hele mengden får plass på både brede og høye skjermer. Indikatoren «Zoom» teller tierpotenser fra den visningen.",
          "«Iterasjoner» er det største antallet steg før et punkt erklæres som innenfor, justerbart fra 50 til 3000. Med «auto» slått på (standard) følger verdien zoomen: 200 iterasjoner i startvisningen, 80 til for hver faktor ti du zoomer inn, med et tak på 3000. Punkter nær randen bruker stadig lengre tid på å rømme, så en dyp visning med for få iterasjoner ser klumpete og for mørk ut, fordi punkter som rømmer, feilaktig telles som innenfor. Flytter du glidebryteren for hånd, slås «auto» av.",
          "«Nyanseforskyvning» roterer paletten langs rømningstellingen, «Eksponering» gjør utsiden lysere eller mørkere (innsiden påvirkes ikke), og de fem palettene bytter fargekurve. De ni bokmerkene hopper til velkjente steder: Sjøhestdalen mellom hovedkardioiden og den store skiven til venstre for den, Elefantdalen ved spissen nær c = 0,25 og flere steder på nålen som går til c = −2.",
        ],
      },
      {
        heading: "Hvordan den er bygd",
        paragraphs: [
          "Hele bildet beregnes på grafikkortet ditt. En WebGL2-fragmentshader kjører én gang per piksel over ett enkelt skjermfyllende rektangel, så et canvas på 2000 ganger 1200 betyr 2,4 millioner uavhengige baner per bilde, alle parallelt.",
          "Shaderen tester r² = |z|² > 256 i stedet for 4, noe som betyr at den venter til |z| overstiger 16. Den større radien gjør det myke iterasjonstallet nøyaktig: når man trekker log₂(log₂|z|) fra stegnummeret, blir det heltallige rømningstallet en kontinuerlig verdi, så fargebåndene glir over i hverandre i stedet for å danne trappetrinn. Posisjonen i paletten er den verdien ganger 0,012 pluss nyanseforskyvningen, så fargene går rundt omtrent hver 83. iterasjon. Palettene er cosinusgradienter på formen a + b·cos(2π(c·t + d)). Punkter som aldri rømmer, får et nesten svart blekk med et svakt skjær som langsomt driver med tiden.",
          "Hvis systemet ditt ber om redusert bevegelse, stoppes animasjonsløkken som driver dette skjæret, og utforskeren tegner ett enkelt bilde hver gang du endrer noe, så bildet oppdateres fortsatt, men beveger seg aldri av seg selv.",
        ],
        code: SHADER_EXCERPT,
      },
      {
        heading: "Der zoomen tar slutt",
        paragraphs: [
          "Du kan zoome ned til en visningsstørrelse på 10⁻¹⁰, men shaderen regner med 32-biters flyttall (highp i WebGL2, uten emulert dobbel presisjon), som bare har omtrent sju signifikante sifre. Mellom 1 og 2 i absoluttverdi ligger representerbare nabotall 2⁻²³ ≈ 1,2 · 10⁻⁷ fra hverandre. Nær c ≈ −1,75 havner to nabokolonner av piksler derfor på samme realdel så snart visningsstørrelsen synker under omtrent 1,2 · 10⁻⁷ ganger den korteste siden av canvaset i enhetspiksler: rundt 1,2 · 10⁻⁴ for 1000 piksler, 2,4 · 10⁻⁴ for 2000. Nær den reelle aksen er imaginærdelene små og forblir mye finere oppløst, så pikslene smelter først sammen sidelengs til korte vannrette streker. Bokmerkene holder seg alle over denne grensen. Dette er ingen egenskap ved mengden: randen fortsetter å gi nye detaljer i enhver skala. Dypzoomvideoer kommer forbi dette med aritmetikk med vilkårlig presisjon eller med perturbasjonsmetoder som beregner én referansebane eksakt og resten som små avvik fra den.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Sult ut iterasjonene",
        text: "Last inn bokmerket Trippelspiral, og dra så iterasjonsbryteren ned til 100. Spiralene fylles av mørke, fordi punkter som trenger noen hundre steg for å rømme, nå telles som innenfor. Øk den til 1400 igjen, og filamentene dukker opp på nytt.",
      },
      {
        title: "Gå langs den reelle aksen",
        text: "Tilbakestill visningen og zoom inn langs den vannrette linjen gjennom midten. Til venstre når du nålen som ender i −2; til høyre slutter mengden i spissen nær 0,25. Last inn Antenne for å se selve tuppen, like ved c = −2.",
      },
      {
        title: "Finn kopiene",
        text: "Åpne Mini-Mandelbrot. Midt i bildet, rundt c ≈ −1,76 på nålen, sitter den største av mange små kopier av hele mengden, med egen kardioide og egne knopper. Zoom inn på nålen til venstre eller høyre for den, så finner du enda mindre.",
      },
      {
        title: "Møt presisjonsveggen",
        text: "Last inn Lyn (visningsstørrelse 2 · 10⁻³) og trykk på + fem eller seks ganger; hvert trykk halverer visningen. Fra omtrent 10⁻⁴ smøres de fine grenene ut til vannrette streker som blir lengre for hvert steg, først på store skjermer med høy pikseltetthet. Det er øyeblikket da 32-biters flyttall går tom for sifre.",
      },
    ],
  },
};
