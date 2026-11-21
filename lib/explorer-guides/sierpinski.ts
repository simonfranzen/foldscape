import type { ExplorerGuide } from "./types";

// Numbers quoted here (depth 0 to 10, default 6; 100 to 20000 points per frame,
// default 4000; 20 warm-up jumps; 60000-point reduced-motion batch; rows and
// generations 10 to 256 with defaults 64 and 96; 280 ms per subdivision level)
// match app/sierpinski/explorer/page.tsx; update both together.
const SUBDIVISION_EXCERPT = `function recurseSub(ctx, a, b, c, depth) {
  if (depth <= 0) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.closePath();
    ctx.fill();
    return;
  }
  const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
  const ca = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
  recurseSub(ctx, a, ab, ca, depth - 1);  // the middle triangle
  recurseSub(ctx, ab, b, bc, depth - 1);  // (ab, bc, ca) is never drawn
  recurseSub(ctx, ca, bc, c, depth - 1);
}`;

// Same formula as in `en`, with the decimal comma the other locales use.
const SIERPINSKI_FORMULA_COMMA =
  "A_n = \\left(\\tfrac{3}{4}\\right)^{n} A_0, \\qquad \\dim = \\frac{\\log 3}{\\log 2} \\approx 1{,}585";

export const SIERPINSKI_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Draw the Sierpiński triangle four ways: recursive subdivision, the chaos game, Pascal's triangle mod 2 and Rule 90, and see why all four give the same fractal.",
    heading: "How this explorer works",
    intro:
      "The same shape is drawn here in four completely different ways: by cutting triangles out of a triangle, by a random walk, by the parity of binomial coefficients and by a one-dimensional cellular automaton. Switching modes changes the recipe, not the result. That four unrelated procedures land on the same fractal is the real point of this room.",
    sections: [
      {
        heading: "A triangle with holes at every scale",
        paragraphs: [
          "Start with a filled triangle and join the midpoints of its sides. That splits it into four smaller triangles; remove the middle one. Three half-size copies remain, and you repeat the step on each of them, forever. After n steps there are 3ⁿ triangles, each with sides 2ⁿ times shorter, so the remaining area is (3/4)ⁿ of the original and tends to zero. Wacław Sierpiński described the set in 1915.",
          "What survives is self-similar: it consists of exactly three copies of itself, each scaled by one half. For an ordinary filled triangle, halving the size gives four copies; for a line segment, two. Solving 2^d = 3 gives the fractal dimension d = log 3 / log 2, so the gasket is more than a curve and less than a surface.",
        ],
        formula:
          "A_n = \\left(\\tfrac{3}{4}\\right)^{n} A_0, \\qquad \\dim = \\frac{\\log 3}{\\log 2} \\approx 1.585",
      },
      {
        heading: "The four constructions and their controls",
        paragraphs: [
          "Subdivision draws the triangle at a chosen depth from 0 to 10, starting at 6. When you change the depth, the picture is rebuilt level by level, one level every 280 milliseconds. The counter shows 3^depth triangles, which is 59,049 at depth 10.",
          "The chaos game starts at the centre of the canvas, picks one of the three corners at random, jumps halfway towards it, plots a dot and repeats. The slider sets how many dots are plotted per animation frame, from 100 to 20,000 (default 4,000), and the counter shows the running total.",
          "Pascal mod 2 builds Pascal's triangle and fills a cell only where the binomial coefficient C(n, k) is odd. The slider sets the number of rows, from 10 to 256 (default 64). Rule 90 starts from a single live cell and makes each cell the XOR of its two neighbours in the row above; the slider sets the number of generations, again from 10 to 256 (default 96). The colour swatches recolour the drawing, and Restart runs the current construction again from scratch.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything is drawn on a 2D canvas sized to the device pixel ratio and redrawn when it is resized. Subdivision is the recursive function below: it halves the three edges, recurses into the three corner triangles and fills a triangle only when the depth reaches zero, so the middle triangle at each level is simply never painted.",
          "The chaos game runs in an animation loop. Before anything is plotted it makes 20 warm-up jumps, then plots every point as a one-pixel rectangle in a semi-transparent colour, so regions that are visited more often grow brighter. Pascal mod 2 never computes a binomial coefficient: each row is built from the previous one with XOR, which is addition modulo 2. That is why 256 rows are instant, although C(255, 127) has 76 digits. Rule 90 uses a Uint8Array per generation that is 2 · generations − 1 cells wide, wide enough that the pattern never reaches the edge.",
          "With reduced motion enabled, subdivision jumps straight to the final depth, and the chaos game plots a single batch of 60,000 points at once and then stops. Pascal and Rule 90 are static drawings in any case.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Why the four pictures agree",
        paragraphs: [
          "The chaos game works because the gasket is the one set that is exactly covered by its three halved copies. Each jump applies one of the three maps «halve the distance to corner i». A point on the gasket stays on it, and a point off it gets twice as close with every jump. After the 20 warm-up jumps any starting error has shrunk by a factor of about a million, far below a pixel, so not a single dot lands in a hole.",
          "Pascal and Rule 90 agree because they are the same rule. Pascal's rule C(n, k) = C(n − 1, k − 1) + C(n − 1, k), read modulo 2, says that each entry is the XOR of the two entries above it, and that is Rule 90 with the cells spread out. Lucas's theorem then tells you exactly which cells are filled: C(n, k) is odd precisely when every binary digit of k is at most the matching digit of n. So row n has 2^s odd entries, where s is the number of ones in the binary expansion of n.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Count the triangles",
        text: "In subdivision mode set the depth to 1, 2 and 3. You get 3, 9 and 27 triangles, covering 3/4, 9/16 and 27/64 of the original area. At depth 10 the 59,049 triangles cover less than 6 percent of it.",
      },
      {
        title: "Randomness that draws order",
        text: "Switch to the chaos game and drag the points per frame down to 100. In the first second the dots look like scattered noise, yet none of them falls into the large central hole. Then push it to 20,000.",
      },
      {
        title: "Find the powers of two",
        text: "In Pascal mod 2, set exactly 64 rows: the triangle is complete and its last row, row 63, is filled from end to end, because 63 is 111111 in binary. Now set 65 rows: the new row 64 has only its two end cells filled, the seed of the next, twice as large copy.",
      },
      {
        title: "Same triangle, different spacing",
        text: "Compare Pascal mod 2 with 64 rows and Rule 90 with 64 generations. The patterns match, except that Rule 90 uses twice as many columns and its live cells sit only on every second position, because each Pascal entry lands between the two cells it came from.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Sierpiński-Dreieck vierfach zeichnen: rekursive Teilung, Chaosspiel, Pascal mod 2 und Regel 90, und verstehen, warum alle dasselbe Fraktal liefern.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Dieselbe Form entsteht hier auf vier völlig verschiedene Arten: durch Herausschneiden von Dreiecken aus einem Dreieck, durch eine Zufallswanderung, durch die Parität von Binomialkoeffizienten und durch einen eindimensionalen Zellularautomaten. Der Moduswechsel ändert das Rezept, nicht das Ergebnis. Dass vier voneinander unabhängige Verfahren beim selben Fraktal landen, ist der eigentliche Witz dieses Raums.",
    sections: [
      {
        heading: "Ein Dreieck mit Löchern auf jeder Skala",
        paragraphs: [
          "Nimm ein gefülltes Dreieck und verbinde die Mittelpunkte seiner Seiten. Das zerlegt es in vier kleinere Dreiecke; das mittlere entfernst du. Übrig bleiben drei halb so große Kopien, und auf jede wendest du denselben Schritt an, immer weiter. Nach n Schritten gibt es 3ⁿ Dreiecke mit 2ⁿ-mal kürzeren Seiten, die verbleibende Fläche ist also (3/4)ⁿ der ursprünglichen und geht gegen null. Wacław Sierpiński beschrieb die Menge 1915.",
          "Was übrig bleibt, ist selbstähnlich: Es besteht aus genau drei Kopien seiner selbst, jede um die Hälfte verkleinert. Ein gewöhnliches gefülltes Dreieck zerfällt beim Halbieren in vier Kopien, eine Strecke in zwei. Löst man 2^d = 3, erhält man die fraktale Dimension d = log 3 / log 2. Das Dreieck ist also mehr als eine Kurve und weniger als eine Fläche.",
        ],
        formula:
          "A_n = \\left(\\tfrac{3}{4}\\right)^{n} A_0, \\qquad \\dim = \\frac{\\log 3}{\\log 2} \\approx 1{,}585",
      },
      {
        heading: "Die vier Konstruktionen und ihre Regler",
        paragraphs: [
          "Die Unterteilung zeichnet das Dreieck in einer wählbaren Tiefe von 0 bis 10, voreingestellt ist 6. Änderst du die Tiefe, baut sich das Bild Ebene für Ebene neu auf, alle 280 Millisekunden eine Ebene. Der Zähler zeigt 3^Tiefe Dreiecke, bei Tiefe 10 sind das 59.049.",
          "Das Chaosspiel startet in der Mitte des Canvas, wählt zufällig eine der drei Ecken, springt auf halbem Weg auf sie zu, setzt einen Punkt und wiederholt das. Der Regler legt fest, wie viele Punkte pro Animationsframe gezeichnet werden, von 100 bis 20.000 (voreingestellt 4.000), und der Zähler zeigt die laufende Summe.",
          "Pascal mod 2 baut das Pascalsche Dreieck auf und füllt eine Zelle nur dort, wo der Binomialkoeffizient C(n, k) ungerade ist. Der Regler legt die Zahl der Zeilen fest, von 10 bis 256 (voreingestellt 64). Regel 90 startet mit einer einzigen lebenden Zelle und macht jede Zelle zum XOR ihrer beiden Nachbarinnen in der Zeile darüber; der Regler bestimmt die Zahl der Generationen, ebenfalls von 10 bis 256 (voreingestellt 96). Die Farbfelder färben die Zeichnung um, und Neustart lässt die aktuelle Konstruktion von vorn laufen.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles wird auf ein 2D-Canvas gezeichnet, dessen Auflösung an die Pixeldichte des Geräts angepasst ist und das bei jeder Größenänderung neu zeichnet. Die Unterteilung ist die rekursive Funktion unten: Sie halbiert die drei Kanten, steigt in die drei Eckdreiecke hinab und füllt ein Dreieck erst, wenn die Tiefe null erreicht. Das mittlere Dreieck jeder Ebene wird also schlicht nie gemalt.",
          "Das Chaosspiel läuft in einer Animationsschleife. Bevor etwas gezeichnet wird, macht es 20 Aufwärmsprünge, dann setzt es jeden Punkt als Ein-Pixel-Rechteck in halbtransparenter Farbe, sodass oft besuchte Bereiche heller werden. Pascal mod 2 berechnet nie einen Binomialkoeffizienten: Jede Zeile entsteht per XOR aus der vorherigen, und XOR ist Addition modulo 2. Deshalb sind 256 Zeilen sofort fertig, obwohl C(255, 127) 76 Stellen hat. Regel 90 nutzt pro Generation ein Uint8Array mit 2 · Generationen − 1 Zellen, breit genug, dass das Muster nie den Rand erreicht.",
          "Bei reduzierter Bewegung springt die Unterteilung direkt auf die Zieltiefe, und das Chaosspiel zeichnet einmalig 60.000 Punkte auf einen Schlag und hört dann auf. Pascal und Regel 90 sind ohnehin statische Zeichnungen.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Warum alle vier Bilder übereinstimmen",
        paragraphs: [
          "Das Chaosspiel funktioniert, weil das Dreieck die einzige Menge ist, die von ihren drei halbierten Kopien exakt überdeckt wird. Jeder Sprung wendet eine der drei Abbildungen «halbiere den Abstand zur Ecke i» an. Ein Punkt auf dem Dreieck bleibt darauf, ein Punkt daneben kommt mit jedem Sprung doppelt so nah heran. Nach den 20 Aufwärmsprüngen ist jeder Startfehler um etwa den Faktor eine Million geschrumpft, weit unter ein Pixel, und kein einziger Punkt landet in einem Loch.",
          "Pascal und Regel 90 stimmen überein, weil sie dieselbe Regel sind. Die Pascal-Regel C(n, k) = C(n − 1, k − 1) + C(n − 1, k), modulo 2 gelesen, sagt: Jeder Eintrag ist das XOR der beiden Einträge darüber. Das ist Regel 90 mit auseinandergezogenen Zellen. Der Satz von Lucas verrät dann genau, welche Zellen gefüllt sind: C(n, k) ist genau dann ungerade, wenn jede Binärziffer von k höchstens so groß ist wie die entsprechende Ziffer von n. Zeile n hat deshalb 2^s ungerade Einträge, wobei s die Anzahl der Einsen in der Binärdarstellung von n ist.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Dreiecke zählen",
        text: "Stell in der Unterteilung die Tiefe auf 1, 2 und 3. Du bekommst 3, 9 und 27 Dreiecke, die 3/4, 9/16 und 27/64 der ursprünglichen Fläche bedecken. Bei Tiefe 10 bedecken die 59.049 Dreiecke weniger als 6 Prozent davon.",
      },
      {
        title: "Zufall, der Ordnung zeichnet",
        text: "Wechsle zum Chaosspiel und zieh die Punkte pro Frame auf 100 herunter. In der ersten Sekunde wirken die Punkte wie verstreutes Rauschen, und trotzdem fällt keiner in das große Loch in der Mitte. Schieb den Regler dann auf 20.000.",
      },
      {
        title: "Die Zweierpotenzen finden",
        text: "Stell bei Pascal mod 2 genau 64 Zeilen ein: Das Dreieck ist vollständig, und seine letzte Zeile, Zeile 63, ist von Ende zu Ende gefüllt, weil 63 binär 111111 ist. Stell nun 65 Zeilen ein: In der neuen Zeile 64 sind nur die beiden Endzellen gefüllt, der Keim der nächsten, doppelt so großen Kopie.",
      },
      {
        title: "Gleiches Dreieck, anderer Abstand",
        text: "Vergleiche Pascal mod 2 mit 64 Zeilen und Regel 90 mit 64 Generationen. Die Muster stimmen überein, nur hat Regel 90 doppelt so viele Spalten, und ihre lebenden Zellen sitzen nur auf jeder zweiten Position, weil jeder Pascal-Eintrag zwischen den beiden Zellen landet, aus denen er entsteht.",
      },
    ],
  },
  es: {
    metaDescription:
      "Dibuja el triángulo de Sierpiński de cuatro maneras: subdivisión recursiva, juego del caos, Pascal módulo 2 y regla 90, y descubre por qué coinciden.",
    heading: "Cómo funciona este explorador",
    intro:
      "Aquí la misma figura se dibuja de cuatro maneras completamente distintas: recortando triángulos de un triángulo, con un paseo aleatorio, con la paridad de los coeficientes binomiales y con un autómata celular unidimensional. Cambiar de modo cambia la receta, no el resultado. Que cuatro procedimientos sin relación entre sí acaben en el mismo fractal es la verdadera gracia de esta sala.",
    sections: [
      {
        heading: "Un triángulo con agujeros a todas las escalas",
        paragraphs: [
          "Empieza con un triángulo relleno y une los puntos medios de sus lados. Eso lo divide en cuatro triángulos más pequeños; quita el del centro. Quedan tres copias de la mitad de tamaño, y repites el paso en cada una de ellas, para siempre. Tras n pasos hay 3ⁿ triángulos, cada uno con lados 2ⁿ veces más cortos, así que el área restante es (3/4)ⁿ de la original y tiende a cero. Wacław Sierpiński describió el conjunto en 1915.",
          "Lo que sobrevive es autosemejante: consta exactamente de tres copias de sí mismo, cada una reducida a la mitad. En un triángulo relleno corriente, reducir el tamaño a la mitad da cuatro copias; en un segmento, dos. Al resolver 2^d = 3 se obtiene la dimensión fractal d = log 3 / log 2, de modo que el triángulo de Sierpiński es más que una curva y menos que una superficie.",
        ],
        formula: SIERPINSKI_FORMULA_COMMA,
      },
      {
        heading: "Las cuatro construcciones y sus controles",
        paragraphs: [
          "«Subdivisión» dibuja el triángulo con la profundidad que elijas, de 0 a 10, empezando en 6. Cuando cambias la profundidad, la imagen se reconstruye nivel a nivel, un nivel cada 280 milisegundos. El contador muestra 3^profundidad triángulos, que son 59 049 con profundidad 10.",
          "El «Juego del Caos» empieza en el centro del lienzo, elige al azar uno de los tres vértices, salta hasta la mitad del camino hacia él, marca un punto y repite. El deslizador fija cuántos puntos se marcan por fotograma de animación, de 100 a 20 000 (4000 por defecto), y el contador muestra el total acumulado.",
          "«Pascal mod 2» construye el triángulo de Pascal y rellena una celda solo donde el coeficiente binomial C(n, k) es impar. El deslizador fija el número de filas, de 10 a 256 (64 por defecto). La «Regla 90» parte de una única celda viva y hace que cada celda sea el XOR de sus dos vecinas de la fila de arriba; el deslizador fija el número de generaciones, también de 10 a 256 (96 por defecto). Las muestras de color cambian el color del dibujo, y «Reiniciar» vuelve a ejecutar desde cero la construcción actual.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todo se dibuja en un lienzo 2D ajustado a la densidad de píxeles del dispositivo y se vuelve a dibujar cuando cambia de tamaño. La subdivisión es la función recursiva de abajo: divide por la mitad las tres aristas, desciende a los tres triángulos de las esquinas y rellena un triángulo solo cuando la profundidad llega a cero, así que el triángulo central de cada nivel sencillamente no se pinta nunca.",
          "El juego del caos corre en un bucle de animación. Antes de marcar nada da 20 saltos de calentamiento, y después dibuja cada punto como un rectángulo de un píxel en un color semitransparente, de modo que las zonas más visitadas se vuelven más brillantes. Pascal mod 2 no calcula nunca un coeficiente binomial: cada fila se construye a partir de la anterior con XOR, que es la suma módulo 2. Por eso 256 filas salen al instante, aunque C(255, 127) tiene 76 cifras. La regla 90 usa por generación un Uint8Array de 2 · generaciones − 1 celdas de ancho, suficiente para que el patrón no llegue nunca al borde.",
          "Con el movimiento reducido activado, la subdivisión salta directamente a la profundidad final, y el juego del caos marca de una vez un único lote de 60 000 puntos y se detiene. Pascal y la regla 90 son dibujos estáticos en cualquier caso.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Por qué coinciden las cuatro imágenes",
        paragraphs: [
          "El juego del caos funciona porque el triángulo de Sierpiński es el único conjunto que queda cubierto exactamente por sus tres copias reducidas a la mitad. Cada salto aplica una de las tres transformaciones «reduce a la mitad la distancia al vértice i». Un punto del triángulo se queda en él, y un punto de fuera se acerca al doble con cada salto. Tras los 20 saltos de calentamiento, cualquier error inicial se ha reducido en un factor de alrededor de un millón, muy por debajo de un píxel, así que ni un solo punto cae en un agujero.",
          "Pascal y la regla 90 coinciden porque son la misma regla. La regla de Pascal C(n, k) = C(n − 1, k − 1) + C(n − 1, k), leída módulo 2, dice que cada entrada es el XOR de las dos entradas que tiene encima, y eso es la regla 90 con las celdas separadas. El teorema de Lucas te dice entonces exactamente qué celdas están rellenas: C(n, k) es impar precisamente cuando cada dígito binario de k es como mucho el dígito correspondiente de n. Por tanto, la fila n tiene 2^s entradas impares, donde s es el número de unos en la expresión binaria de n.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Cuenta los triángulos",
        text: "En el modo «Subdivisión», pon la profundidad en 1, 2 y 3. Obtienes 3, 9 y 27 triángulos, que cubren 3/4, 9/16 y 27/64 del área original. Con profundidad 10, los 59 049 triángulos cubren menos del 6 % de ella.",
      },
      {
        title: "Un azar que dibuja orden",
        text: "Cambia al «Juego del Caos» y baja los puntos por fotograma hasta 100. Durante el primer segundo los puntos parecen ruido disperso, y sin embargo ninguno cae en el gran agujero central. Después súbelo a 20 000.",
      },
      {
        title: "Encuentra las potencias de dos",
        text: "En «Pascal mod 2», pon exactamente 64 filas: el triángulo está completo y su última fila, la fila 63, está rellena de punta a punta, porque 63 es 111111 en binario. Ahora pon 65 filas: la nueva fila 64 solo tiene rellenas sus dos celdas de los extremos, la semilla de la siguiente copia, el doble de grande.",
      },
      {
        title: "El mismo triángulo, otro espaciado",
        text: "Compara «Pascal mod 2» con 64 filas y la «Regla 90» con 64 generaciones. Los patrones coinciden, salvo que la regla 90 usa el doble de columnas y sus celdas vivas ocupan solo una de cada dos posiciones, porque cada entrada de Pascal cae entre las dos celdas de las que procede.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Trace le triangle de Sierpiński de quatre façons : subdivision récursive, jeu du chaos, Pascal modulo 2 et règle 90, et vois pourquoi tout coïncide.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La même forme est tracée ici de quatre manières complètement différentes : en découpant des triangles dans un triangle, par une marche aléatoire, par la parité des coefficients binomiaux et par un automate cellulaire à une dimension. Changer de mode change la recette, pas le résultat. Que quatre procédés sans rapport entre eux aboutissent à la même fractale, voilà le vrai sujet de cette salle.",
    sections: [
      {
        heading: "Un triangle troué à toutes les échelles",
        paragraphs: [
          "Pars d'un triangle plein et relie les milieux de ses côtés. Cela le découpe en quatre triangles plus petits ; retire celui du milieu. Il reste trois copies deux fois plus petites, et tu répètes l'opération sur chacune d'elles, indéfiniment. Après n étapes, il y a 3ⁿ triangles, chacun avec des côtés 2ⁿ fois plus courts, si bien que l'aire restante vaut (3/4)ⁿ de l'aire de départ et tend vers zéro. Wacław Sierpiński a décrit cet ensemble en 1915.",
          "Ce qui subsiste est autosimilaire : l'ensemble se compose d'exactement trois copies de lui-même, chacune réduite de moitié. Pour un triangle plein ordinaire, diviser la taille par deux donne quatre copies ; pour un segment, deux. En résolvant 2^d = 3, on obtient la dimension fractale d = log 3 / log 2 : le triangle de Sierpiński est donc plus qu'une courbe et moins qu'une surface.",
        ],
        formula: SIERPINSKI_FORMULA_COMMA,
      },
      {
        heading: "Les quatre constructions et leurs réglages",
        paragraphs: [
          "« Subdivision » trace le triangle à la profondeur de ton choix, de 0 à 10, en partant de 6. Quand tu changes la profondeur, l'image se reconstruit niveau par niveau, un niveau toutes les 280 millisecondes. Le compteur affiche 3^profondeur triangles, soit 59 049 à la profondeur 10.",
          "Le « Jeu du Chaos » part du centre du canevas, choisit au hasard l'un des trois sommets, saute à mi-chemin dans sa direction, pose un point et recommence. Le curseur fixe le nombre de points posés par image d'animation, de 100 à 20 000 (4 000 par défaut), et le compteur affiche le total cumulé.",
          "« Pascal mod 2 » construit le triangle de Pascal et ne remplit une cellule que là où le coefficient binomial C(n, k) est impair. Le curseur fixe le nombre de lignes, de 10 à 256 (64 par défaut). La « Règle 90 » part d'une seule cellule vivante et fait de chaque cellule le XOR de ses deux voisines de la ligne du dessus ; le curseur fixe le nombre de générations, là aussi de 10 à 256 (96 par défaut). Les pastilles de couleur recolorent le dessin, et « Redémarrer » relance la construction en cours depuis le début.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tout est dessiné sur un canevas 2D dimensionné selon la densité de pixels de l'appareil et redessiné quand sa taille change. La subdivision est la fonction récursive ci-dessous : elle coupe les trois arêtes en deux, descend dans les trois triangles des coins et ne remplit un triangle que lorsque la profondeur atteint zéro, de sorte que le triangle central de chaque niveau n'est tout simplement jamais peint.",
          "Le jeu du chaos tourne dans une boucle d'animation. Avant de tracer quoi que ce soit, il effectue 20 sauts d'échauffement, puis dessine chaque point comme un rectangle d'un pixel dans une couleur semi-transparente, si bien que les zones les plus visitées deviennent plus lumineuses. Pascal mod 2 ne calcule jamais de coefficient binomial : chaque ligne se construit à partir de la précédente avec XOR, qui est l'addition modulo 2. C'est pourquoi 256 lignes s'affichent instantanément, alors que C(255, 127) compte 76 chiffres. La règle 90 utilise pour chaque génération un Uint8Array large de 2 · générations − 1 cellules, assez large pour que le motif n'atteigne jamais le bord.",
          "Quand la réduction des animations est activée, la subdivision passe directement à la profondeur finale, et le jeu du chaos trace d'un coup un unique lot de 60 000 points puis s'arrête. Pascal et la règle 90 sont de toute façon des dessins statiques.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Pourquoi les quatre images coïncident",
        paragraphs: [
          "Le jeu du chaos fonctionne parce que le triangle de Sierpiński est le seul ensemble exactement recouvert par ses trois copies réduites de moitié. Chaque saut applique l'une des trois transformations « divise par deux la distance au sommet i ». Un point du triangle y reste, et un point situé en dehors s'en rapproche deux fois plus à chaque saut. Après les 20 sauts d'échauffement, toute erreur de départ a été réduite d'un facteur d'environ un million, bien en dessous d'un pixel, et pas un seul point ne tombe dans un trou.",
          "Pascal et la règle 90 coïncident parce que c'est la même règle. La règle de Pascal C(n, k) = C(n − 1, k − 1) + C(n − 1, k), lue modulo 2, dit que chaque entrée est le XOR des deux entrées situées au-dessus d'elle, et c'est la règle 90 avec des cellules espacées. Le théorème de Lucas t'indique alors exactement quelles cellules sont remplies : C(n, k) est impair précisément lorsque chaque chiffre binaire de k est au plus égal au chiffre correspondant de n. La ligne n compte donc 2^s entrées impaires, où s est le nombre de 1 dans l'écriture binaire de n.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Compte les triangles",
        text: "En mode « Subdivision », règle la profondeur sur 1, 2 puis 3. Tu obtiens 3, 9 et 27 triangles, qui couvrent 3/4, 9/16 et 27/64 de l'aire de départ. À la profondeur 10, les 59 049 triangles en couvrent moins de 6 %.",
      },
      {
        title: "Un hasard qui dessine de l'ordre",
        text: "Passe au « Jeu du Chaos » et descends le nombre de points par image à 100. Pendant la première seconde, les points ressemblent à du bruit éparpillé, et pourtant aucun ne tombe dans le grand trou central. Monte ensuite à 20 000.",
      },
      {
        title: "Trouve les puissances de deux",
        text: "Dans « Pascal mod 2 », règle exactement 64 lignes : le triangle est complet et sa dernière ligne, la ligne 63, est remplie d'un bout à l'autre, parce que 63 s'écrit 111111 en binaire. Passe maintenant à 65 lignes : la nouvelle ligne 64 n'a que ses deux cellules extrêmes remplies, le germe de la copie suivante, deux fois plus grande.",
      },
      {
        title: "Même triangle, autre espacement",
        text: "Compare « Pascal mod 2 » avec 64 lignes et la « Règle 90 » avec 64 générations. Les motifs coïncident, sauf que la règle 90 utilise deux fois plus de colonnes et que ses cellules vivantes n'occupent qu'une position sur deux, parce que chaque entrée de Pascal tombe entre les deux cellules dont elle provient.",
      },
    ],
  },
  it: {
    metaDescription:
      "Disegna il triangolo di Sierpiński in quattro modi: suddivisione ricorsiva, gioco del caos, Pascal modulo 2 e regola 90, e scopri perché coincidono.",
    heading: "Come funziona questo esploratore",
    intro:
      "Qui la stessa figura viene disegnata in quattro modi del tutto diversi: ritagliando triangoli da un triangolo, con una passeggiata aleatoria, con la parità dei coefficienti binomiali e con un automa cellulare unidimensionale. Cambiare modalità cambia la ricetta, non il risultato. Che quattro procedimenti senza alcun legame arrivino allo stesso frattale è il vero senso di questa stanza.",
    sections: [
      {
        heading: "Un triangolo con buchi a ogni scala",
        paragraphs: [
          "Parti da un triangolo pieno e unisci i punti medi dei suoi lati. In questo modo lo dividi in quattro triangoli più piccoli; togli quello centrale. Restano tre copie grandi la metà, e ripeti il passo su ciascuna di esse, all'infinito. Dopo n passi ci sono 3ⁿ triangoli, ciascuno con lati 2ⁿ volte più corti, quindi l'area rimanente è (3/4)ⁿ di quella iniziale e tende a zero. Wacław Sierpiński descrisse l'insieme nel 1915.",
          "Ciò che sopravvive è autosimile: è formato esattamente da tre copie di sé stesso, ciascuna ridotta della metà. Per un normale triangolo pieno, dimezzare la dimensione dà quattro copie; per un segmento, due. Risolvendo 2^d = 3 si ottiene la dimensione frattale d = log 3 / log 2, quindi il triangolo di Sierpiński è più di una curva e meno di una superficie.",
        ],
        formula: SIERPINSKI_FORMULA_COMMA,
      },
      {
        heading: "Le quattro costruzioni e i loro controlli",
        paragraphs: [
          "«Suddivisione» disegna il triangolo alla profondità che scegli, da 0 a 10, partendo da 6. Quando cambi la profondità, l'immagine viene ricostruita livello per livello, un livello ogni 280 millisecondi. Il contatore mostra 3^profondità triangoli, cioè 59.049 a profondità 10.",
          "Il «Gioco del Caos» parte dal centro del canvas, sceglie a caso uno dei tre vertici, salta a metà strada verso di esso, segna un punto e ripete. Il cursore stabilisce quanti punti vengono segnati per ogni fotogramma dell'animazione, da 100 a 20.000 (4000 di default), e il contatore mostra il totale progressivo.",
          "«Pascal mod 2» costruisce il triangolo di Tartaglia (o di Pascal) e riempie una cella solo dove il coefficiente binomiale C(n, k) è dispari. Il cursore stabilisce il numero di righe, da 10 a 256 (64 di default). La «Regola 90» parte da una sola cella viva e rende ogni cella lo XOR delle sue due vicine nella riga sopra; il cursore stabilisce il numero di generazioni, anche qui da 10 a 256 (96 di default). I campioni di colore ricolorano il disegno, e «Riavvia» fa ripartire da capo la costruzione corrente.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutto è disegnato su un canvas 2D dimensionato in base alla densità di pixel del dispositivo e ridisegnato quando viene ridimensionato. La suddivisione è la funzione ricorsiva qui sotto: dimezza i tre lati, scende nei tre triangoli d'angolo e riempie un triangolo solo quando la profondità arriva a zero, così il triangolo centrale di ogni livello semplicemente non viene mai dipinto.",
          "Il gioco del caos gira in un ciclo di animazione. Prima di segnare qualsiasi cosa fa 20 salti di riscaldamento, poi disegna ogni punto come un rettangolo di un pixel in un colore semitrasparente, così le zone visitate più spesso diventano più luminose. Pascal mod 2 non calcola mai un coefficiente binomiale: ogni riga è costruita dalla precedente con lo XOR, che è l'addizione modulo 2. Per questo 256 righe sono istantanee, benché C(255, 127) abbia 76 cifre. La regola 90 usa per ogni generazione un Uint8Array largo 2 · generazioni − 1 celle, abbastanza perché il motivo non raggiunga mai il bordo.",
          "Con la riduzione del movimento attiva, la suddivisione salta direttamente alla profondità finale, e il gioco del caos segna in una volta sola un unico blocco di 60.000 punti e poi si ferma. Pascal e la regola 90 sono in ogni caso disegni statici.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Perché le quattro immagini coincidono",
        paragraphs: [
          "Il gioco del caos funziona perché il triangolo di Sierpiński è l'unico insieme ricoperto esattamente dalle sue tre copie dimezzate. Ogni salto applica una delle tre trasformazioni «dimezza la distanza dal vertice i». Un punto del triangolo ci rimane, e un punto esterno si avvicina del doppio a ogni salto. Dopo i 20 salti di riscaldamento, qualsiasi errore iniziale si è ridotto di un fattore di circa un milione, molto al di sotto di un pixel, quindi nemmeno un punto finisce in un buco.",
          "Pascal e la regola 90 coincidono perché sono la stessa regola. La regola di Pascal C(n, k) = C(n − 1, k − 1) + C(n − 1, k), letta modulo 2, dice che ogni elemento è lo XOR dei due elementi sopra di esso, e questa è la regola 90 con le celle distanziate. Il teorema di Lucas ti dice poi esattamente quali celle sono piene: C(n, k) è dispari precisamente quando ogni cifra binaria di k è al più uguale alla cifra corrispondente di n. Quindi la riga n ha 2^s elementi dispari, dove s è il numero di uno nella scrittura binaria di n.",
        ],
      },
    ],
    experimentsHeading: "Prova questo",
    experiments: [
      {
        title: "Conta i triangoli",
        text: "In modalità «Suddivisione», imposta la profondità a 1, 2 e 3. Ottieni 3, 9 e 27 triangoli, che coprono 3/4, 9/16 e 27/64 dell'area iniziale. A profondità 10 i 59.049 triangoli ne coprono meno del 6 per cento.",
      },
      {
        title: "Un caso che disegna ordine",
        text: "Passa al «Gioco del Caos» e abbassa i punti per fotogramma a 100. Nel primo secondo i punti sembrano rumore sparso, eppure nessuno cade nel grande buco centrale. Poi portalo a 20.000.",
      },
      {
        title: "Trova le potenze di due",
        text: "In «Pascal mod 2», imposta esattamente 64 righe: il triangolo è completo e la sua ultima riga, la riga 63, è piena da un capo all'altro, perché 63 in binario è 111111. Ora imposta 65 righe: la nuova riga 64 ha piene solo le due celle estreme, il seme della copia successiva, grande il doppio.",
      },
      {
        title: "Stesso triangolo, spaziatura diversa",
        text: "Confronta «Pascal mod 2» con 64 righe e la «Regola 90» con 64 generazioni. I motivi coincidono, salvo che la regola 90 usa il doppio delle colonne e le sue celle vive occupano solo una posizione su due, perché ogni elemento di Pascal cade tra le due celle da cui deriva.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Desenha o triângulo de Sierpiński de quatro maneiras: subdivisão recursiva, jogo do caos, Pascal módulo 2 e regra 90, e descobre porque coincidem.",
    heading: "Como funciona este explorador",
    intro:
      "Aqui a mesma figura é desenhada de quatro maneiras completamente diferentes: recortando triângulos de um triângulo, com um passeio aleatório, com a paridade dos coeficientes binomiais e com um autómato celular unidimensional. Mudar de modo muda a receita, não o resultado. Que quatro processos sem relação entre si cheguem ao mesmo fractal é o verdadeiro sentido desta sala.",
    sections: [
      {
        heading: "Um triângulo com buracos em todas as escalas",
        paragraphs: [
          "Começa com um triângulo preenchido e une os pontos médios dos seus lados. Isso divide-o em quatro triângulos mais pequenos; retira o do meio. Ficam três cópias com metade do tamanho, e repetes o passo em cada uma delas, para sempre. Ao fim de n passos há 3ⁿ triângulos, cada um com lados 2ⁿ vezes mais curtos, pelo que a área restante é (3/4)ⁿ da original e tende para zero. Wacław Sierpiński descreveu o conjunto em 1915.",
          "O que sobrevive é autossemelhante: é formado por exatamente três cópias de si próprio, cada uma reduzida a metade. Num triângulo preenchido comum, reduzir o tamanho a metade dá quatro cópias; num segmento de reta, duas. Resolvendo 2^d = 3 obtém-se a dimensão fractal d = log 3 / log 2, pelo que o triângulo de Sierpiński é mais do que uma curva e menos do que uma superfície.",
        ],
        formula: SIERPINSKI_FORMULA_COMMA,
      },
      {
        heading: "As quatro construções e os seus controlos",
        paragraphs: [
          "«Subdivisão» desenha o triângulo com a profundidade que escolheres, de 0 a 10, começando em 6. Quando mudas a profundidade, a imagem é reconstruída nível a nível, um nível a cada 280 milissegundos. O contador mostra 3^profundidade triângulos, ou seja, 59.049 com profundidade 10.",
          "O «Jogo do Caos» começa no centro da tela, escolhe ao acaso um dos três vértices, salta até meio do caminho na sua direção, marca um ponto e repete. O cursor define quantos pontos são marcados por fotograma da animação, de 100 a 20.000 (4000 por omissão), e o contador mostra o total acumulado.",
          "«Pascal mod 2» constrói o triângulo de Pascal e preenche uma célula apenas onde o coeficiente binomial C(n, k) é ímpar. O cursor define o número de linhas, de 10 a 256 (64 por omissão). A «Regra 90» parte de uma única célula viva e faz de cada célula o XOR das suas duas vizinhas na linha de cima; o cursor define o número de gerações, também de 10 a 256 (96 por omissão). As amostras de cor mudam a cor do desenho, e «Reiniciar» volta a executar do zero a construção atual.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Tudo é desenhado numa tela 2D dimensionada de acordo com a densidade de píxeis do dispositivo e redesenhada quando muda de tamanho. A subdivisão é a função recursiva abaixo: divide ao meio as três arestas, desce aos três triângulos dos cantos e só preenche um triângulo quando a profundidade chega a zero, pelo que o triângulo central de cada nível simplesmente nunca é pintado.",
          "O jogo do caos corre num ciclo de animação. Antes de marcar seja o que for, dá 20 saltos de aquecimento, e depois desenha cada ponto como um retângulo de um píxel numa cor semitransparente, de modo que as zonas mais visitadas ficam mais brilhantes. Pascal mod 2 nunca calcula um coeficiente binomial: cada linha é construída a partir da anterior com XOR, que é a adição módulo 2. É por isso que 256 linhas são instantâneas, embora C(255, 127) tenha 76 algarismos. A regra 90 usa, por geração, um Uint8Array com 2 · gerações − 1 células de largura, o suficiente para o padrão nunca chegar à borda.",
          "Com o movimento reduzido ativado, a subdivisão salta diretamente para a profundidade final, e o jogo do caos marca de uma só vez um único lote de 60.000 pontos e depois para. Pascal e a regra 90 são, de qualquer modo, desenhos estáticos.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Porque é que as quatro imagens coincidem",
        paragraphs: [
          "O jogo do caos funciona porque o triângulo de Sierpiński é o único conjunto exatamente coberto pelas suas três cópias reduzidas a metade. Cada salto aplica uma das três transformações «reduz a metade a distância ao vértice i». Um ponto do triângulo permanece nele, e um ponto de fora fica duas vezes mais perto a cada salto. Depois dos 20 saltos de aquecimento, qualquer erro inicial encolheu por um fator de cerca de um milhão, muito abaixo de um píxel, pelo que nem um único ponto cai num buraco.",
          "Pascal e a regra 90 coincidem porque são a mesma regra. A regra de Pascal C(n, k) = C(n − 1, k − 1) + C(n − 1, k), lida módulo 2, diz que cada entrada é o XOR das duas entradas acima dela, e isso é a regra 90 com as células afastadas. O teorema de Lucas diz-te então exatamente que células estão preenchidas: C(n, k) é ímpar precisamente quando cada dígito binário de k é, no máximo, o dígito correspondente de n. Assim, a linha n tem 2^s entradas ímpares, onde s é o número de uns na representação binária de n.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Conta os triângulos",
        text: "No modo «Subdivisão», põe a profundidade em 1, 2 e 3. Obténs 3, 9 e 27 triângulos, que cobrem 3/4, 9/16 e 27/64 da área original. Com profundidade 10, os 59.049 triângulos cobrem menos de 6 por cento dela.",
      },
      {
        title: "Um acaso que desenha ordem",
        text: "Muda para o «Jogo do Caos» e baixa os pontos por fotograma para 100. No primeiro segundo os pontos parecem ruído disperso, e no entanto nenhum cai no grande buraco central. Depois sobe para 20.000.",
      },
      {
        title: "Encontra as potências de dois",
        text: "Em «Pascal mod 2», põe exatamente 64 linhas: o triângulo está completo e a sua última linha, a linha 63, está preenchida de ponta a ponta, porque 63 é 111111 em binário. Agora põe 65 linhas: a nova linha 64 só tem preenchidas as duas células das extremidades, a semente da cópia seguinte, duas vezes maior.",
      },
      {
        title: "O mesmo triângulo, outro espaçamento",
        text: "Compara «Pascal mod 2» com 64 linhas e a «Regra 90» com 64 gerações. Os padrões coincidem, só que a regra 90 usa o dobro das colunas e as suas células vivas ocupam apenas uma em cada duas posições, porque cada entrada de Pascal cai entre as duas células de onde veio.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Rita Sierpińskitriangeln på fyra sätt: rekursiv uppdelning, kaosspelet, Pascals triangel modulo 2 och regel 90, och se varför alla ger samma fraktal.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Samma form ritas här på fyra helt olika sätt: genom att skära ut trianglar ur en triangel, genom en slumpvandring, genom binomialkoefficienternas paritet och genom en endimensionell cellulär automat. När du byter läge ändras receptet, inte resultatet. Att fyra orelaterade metoder hamnar i samma fraktal är själva poängen med det här rummet.",
    sections: [
      {
        heading: "En triangel med hål i alla skalor",
        paragraphs: [
          "Börja med en fylld triangel och förbind sidornas mittpunkter. Då delas den i fyra mindre trianglar; ta bort den i mitten. Kvar blir tre kopior i halv storlek, och du upprepar steget på var och en av dem, i all oändlighet. Efter n steg finns det 3ⁿ trianglar, var och en med 2ⁿ gånger kortare sidor, så den återstående arean är (3/4)ⁿ av den ursprungliga och går mot noll. Wacław Sierpiński beskrev mängden 1915.",
          "Det som blir kvar är självlikformigt: det består av exakt tre kopior av sig självt, var och en förminskad till hälften. För en vanlig fylld triangel ger en halvering av storleken fyra kopior; för en sträcka två. Löser man 2^d = 3 får man den fraktala dimensionen d = log 3 / log 2, så Sierpińskitriangeln är mer än en kurva och mindre än en yta.",
        ],
        formula: SIERPINSKI_FORMULA_COMMA,
      },
      {
        heading: "De fyra konstruktionerna och deras reglage",
        paragraphs: [
          "”Uppdelning” ritar triangeln med ett valfritt djup från 0 till 10, med 6 som startvärde. När du ändrar djupet byggs bilden upp på nytt nivå för nivå, en nivå var 280:e millisekund. Räknaren visar 3^djup trianglar, vilket är 59 049 vid djup 10.",
          "”Kaosspelet” börjar mitt på ritytan, väljer slumpmässigt ett av de tre hörnen, hoppar halvvägs dit, sätter ut en punkt och upprepar. Reglaget bestämmer hur många punkter som sätts ut per animationsbildruta, från 100 till 20 000 (förvalt 4 000), och räknaren visar den löpande summan.",
          "”Pascal mod 2” bygger upp Pascals triangel och fyller en cell bara där binomialkoefficienten C(n, k) är udda. Reglaget bestämmer antalet rader, från 10 till 256 (förvalt 64). ”Regel 90” utgår från en enda levande cell och låter varje cell bli XOR av sina två grannar i raden ovanför; reglaget bestämmer antalet generationer, även här från 10 till 256 (förvalt 96). Färgrutorna färgar om teckningen, och ”Starta om” kör den aktuella konstruktionen från början igen.",
        ],
      },
      {
        heading: "Så är den byggd",
        paragraphs: [
          "Allt ritas på en 2D-canvas som är anpassad till enhetens pixeltäthet och ritas om när storleken ändras. Uppdelningen är den rekursiva funktionen nedan: den halverar de tre kanterna, går vidare in i de tre hörntrianglarna och fyller en triangel först när djupet når noll, så mittentriangeln på varje nivå blir helt enkelt aldrig målad.",
          "Kaosspelet körs i en animationsloop. Innan något ritas gör det 20 uppvärmningshopp, och sedan ritas varje punkt som en rektangel på en pixel i en halvgenomskinlig färg, så att områden som besöks oftare blir ljusare. Pascal mod 2 beräknar aldrig någon binomialkoefficient: varje rad byggs från den föregående med XOR, som är addition modulo 2. Därför går 256 rader på ett ögonblick, trots att C(255, 127) har 76 siffror. Regel 90 använder för varje generation en Uint8Array som är 2 · generationer − 1 celler bred, tillräckligt bred för att mönstret aldrig ska nå kanten.",
          "Med reducerad rörelse påslagen hoppar uppdelningen direkt till slutdjupet, och kaosspelet ritar en enda omgång på 60 000 punkter på en gång och stannar sedan. Pascal och regel 90 är statiska teckningar i vilket fall.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Varför de fyra bilderna stämmer överens",
        paragraphs: [
          "Kaosspelet fungerar eftersom Sierpińskitriangeln är den enda mängd som täcks exakt av sina tre halverade kopior. Varje hopp tillämpar en av de tre avbildningarna ”halvera avståndet till hörn i”. En punkt på triangeln stannar kvar på den, och en punkt utanför kommer dubbelt så nära för varje hopp. Efter de 20 uppvärmningshoppen har varje startfel krympt med en faktor på ungefär en miljon, långt under en pixel, så inte en enda punkt hamnar i ett hål.",
          "Pascal och regel 90 stämmer överens eftersom de är samma regel. Pascals regel C(n, k) = C(n − 1, k − 1) + C(n − 1, k), läst modulo 2, säger att varje element är XOR av de två elementen ovanför, och det är regel 90 med cellerna utdragna. Lucas sats talar sedan om exakt vilka celler som är fyllda: C(n, k) är udda precis när varje binär siffra i k är högst lika stor som motsvarande siffra i n. Rad n har alltså 2^s udda element, där s är antalet ettor i den binära utvecklingen av n.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Räkna trianglarna",
        text: "Ställ in djupet på 1, 2 och 3 i läget ”Uppdelning”. Du får 3, 9 och 27 trianglar, som täcker 3/4, 9/16 och 27/64 av den ursprungliga arean. Vid djup 10 täcker de 59 049 trianglarna mindre än 6 procent av den.",
      },
      {
        title: "Slump som ritar ordning",
        text: "Byt till ”Kaosspelet” och dra ner punkter per bildruta till 100. Under den första sekunden ser punkterna ut som utspritt brus, och ändå hamnar ingen av dem i det stora hålet i mitten. Dra sedan upp till 20 000.",
      },
      {
        title: "Hitta tvåpotenserna",
        text: "Ställ in exakt 64 rader i ”Pascal mod 2”: triangeln är fullständig och dess sista rad, rad 63, är fylld från ände till ände, eftersom 63 är 111111 binärt. Ställ nu in 65 rader: den nya raden 64 har bara sina två ändceller fyllda, fröet till nästa, dubbelt så stora kopia.",
      },
      {
        title: "Samma triangel, annat avstånd",
        text: "Jämför ”Pascal mod 2” med 64 rader och ”Regel 90” med 64 generationer. Mönstren stämmer överens, förutom att regel 90 använder dubbelt så många kolumner och att dess levande celler bara sitter på varannan position, eftersom varje Pascalelement hamnar mellan de två celler det kom från.",
      },
    ],
  },
  no: {
    metaDescription:
      "Tegn Sierpiński-trekanten på fire måter: rekursiv oppdeling, kaosspillet, Pascals trekant modulo 2 og regel 90, og se hvorfor alle gir samme fraktal.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Den samme formen tegnes her på fire helt forskjellige måter: ved å skjære trekanter ut av en trekant, ved en tilfeldig vandring, ved pariteten til binomialkoeffisienter og ved en endimensjonal cellulær automat. Når du bytter modus, endres oppskriften, ikke resultatet. At fire urelaterte framgangsmåter ender i samme fraktal, er det egentlige poenget med dette rommet.",
    sections: [
      {
        heading: "En trekant med hull i alle skalaer",
        paragraphs: [
          "Start med en fylt trekant og forbind midtpunktene på sidene. Da deles den i fire mindre trekanter; fjern den i midten. Igjen står tre kopier i halv størrelse, og du gjentar steget på hver av dem, i det uendelige. Etter n steg er det 3ⁿ trekanter, hver med 2ⁿ ganger kortere sider, så det gjenværende arealet er (3/4)ⁿ av det opprinnelige og går mot null. Wacław Sierpiński beskrev mengden i 1915.",
          "Det som overlever, er selvlikt: Det består av nøyaktig tre kopier av seg selv, hver forminsket til det halve. For en vanlig fylt trekant gir halvering av størrelsen fire kopier; for et linjestykke to. Løser man 2^d = 3, får man den fraktale dimensjonen d = log 3 / log 2, så Sierpiński-trekanten er mer enn en kurve og mindre enn en flate.",
        ],
        formula: SIERPINSKI_FORMULA_COMMA,
      },
      {
        heading: "De fire konstruksjonene og kontrollene deres",
        paragraphs: [
          "«Oppdeling» tegner trekanten med en valgfri dybde fra 0 til 10, med 6 som startverdi. Når du endrer dybden, bygges bildet opp på nytt nivå for nivå, ett nivå hvert 280. millisekund. Telleren viser 3^dybde trekanter, som er 59 049 ved dybde 10.",
          "«Kaosspillet» starter midt på lerretet, velger tilfeldig ett av de tre hjørnene, hopper halvveis dit, setter et punkt og gjentar. Glidebryteren bestemmer hvor mange punkter som settes per animasjonsbilde, fra 100 til 20 000 (standard 4000), og telleren viser den løpende summen.",
          "«Pascal mod 2» bygger opp Pascals trekant og fyller en celle bare der binomialkoeffisienten C(n, k) er odde. Glidebryteren bestemmer antall rader, fra 10 til 256 (standard 64). «Regel 90» starter med én enkelt levende celle og lar hver celle bli XOR av de to naboene i raden over; glidebryteren bestemmer antall generasjoner, også her fra 10 til 256 (standard 96). Fargefeltene gir tegningen ny farge, og «Start på nytt» kjører den gjeldende konstruksjonen fra begynnelsen igjen.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Alt tegnes på et 2D-lerret som er tilpasset enhetens pikseltetthet og tegnes på nytt når størrelsen endres. Oppdelingen er den rekursive funksjonen nedenfor: Den halverer de tre kantene, går videre inn i de tre hjørnetrekantene og fyller en trekant først når dybden når null, så den midterste trekanten på hvert nivå blir rett og slett aldri malt.",
          "Kaosspillet kjører i en animasjonsløkke. Før noe tegnes, gjør det 20 oppvarmingshopp, og deretter tegnes hvert punkt som et rektangel på én piksel i en halvgjennomsiktig farge, slik at områder som besøkes oftere, blir lysere. Pascal mod 2 beregner aldri en binomialkoeffisient: Hver rad bygges fra den forrige med XOR, som er addisjon modulo 2. Derfor går 256 rader på et øyeblikk, selv om C(255, 127) har 76 sifre. Regel 90 bruker for hver generasjon en Uint8Array som er 2 · generasjoner − 1 celler bred, bred nok til at mønsteret aldri når kanten.",
          "Med redusert bevegelse slått på hopper oppdelingen rett til sluttdybden, og kaosspillet tegner én enkelt omgang på 60 000 punkter på en gang og stopper deretter. Pascal og regel 90 er uansett statiske tegninger.",
        ],
        code: SUBDIVISION_EXCERPT,
      },
      {
        heading: "Hvorfor de fire bildene stemmer overens",
        paragraphs: [
          "Kaosspillet virker fordi Sierpiński-trekanten er den eneste mengden som dekkes nøyaktig av sine tre halverte kopier. Hvert hopp anvender én av de tre avbildningene «halver avstanden til hjørne i». Et punkt på trekanten blir værende på den, og et punkt utenfor kommer dobbelt så nær for hvert hopp. Etter de 20 oppvarmingshoppene har enhver startfeil krympet med en faktor på omtrent en million, langt under en piksel, så ikke et eneste punkt havner i et hull.",
          "Pascal og regel 90 stemmer overens fordi de er den samme regelen. Pascals regel C(n, k) = C(n − 1, k − 1) + C(n − 1, k), lest modulo 2, sier at hvert element er XOR av de to elementene over, og det er regel 90 med cellene trukket fra hverandre. Lucas' sats forteller deretter nøyaktig hvilke celler som er fylt: C(n, k) er odde nettopp når hvert binære siffer i k er høyst like stort som det tilsvarende sifferet i n. Rad n har altså 2^s odde elementer, der s er antall enere i den binære utviklingen av n.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Tell trekantene",
        text: "Sett dybden til 1, 2 og 3 i modusen «Oppdeling». Du får 3, 9 og 27 trekanter, som dekker 3/4, 9/16 og 27/64 av det opprinnelige arealet. Ved dybde 10 dekker de 59 049 trekantene mindre enn 6 prosent av det.",
      },
      {
        title: "Tilfeldighet som tegner orden",
        text: "Bytt til «Kaosspillet» og dra punkter per bilde ned til 100. Det første sekundet ser punktene ut som spredt støy, og likevel havner ingen av dem i det store hullet i midten. Dra deretter opp til 20 000.",
      },
      {
        title: "Finn toerpotensene",
        text: "Still inn nøyaktig 64 rader i «Pascal mod 2»: Trekanten er komplett, og den siste raden, rad 63, er fylt fra ende til ende, fordi 63 er 111111 binært. Still nå inn 65 rader: Den nye raden 64 har bare de to endecellene fylt, frøet til den neste, dobbelt så store kopien.",
      },
      {
        title: "Samme trekant, annen avstand",
        text: "Sammenlign «Pascal mod 2» med 64 rader og «Regel 90» med 64 generasjoner. Mønstrene stemmer overens, bortsett fra at regel 90 bruker dobbelt så mange kolonner, og at de levende cellene bare sitter på annenhver posisjon, fordi hvert Pascal-element havner mellom de to cellene det kom fra.",
      },
    ],
  },
};
