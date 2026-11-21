import type { ExplorerGuide } from "./types";

// Numbers quoted here (200 terms, 80 samples per unit of t, the 0.18 dip
// threshold, 400 samples on [2, 200], 50 zero heights) match
// app/riemann/explorer/page.tsx; update both together.
const ZETA_EXCERPT = `function zeta(s: Cx, N: number): Cx {
  let eta: Cx = { re: 0, im: 0 };
  for (let n = 1; n <= N; n++) {
    const term = cDiv({ re: 1, im: 0 }, nPowS(n, s));
    eta = n % 2 === 1 ? cAdd(eta, term) : cSub(eta, term);
  }
  // divide by (1 - 2^(1-s)) to turn eta back into zeta
  return cDiv(eta, denom);
}

function piApprox(x: number, nZeros: number): number {
  let val = riemannR(x);
  for (let i = 0; i < nZeros; i++) {
    val -= 2 * liComplexLead(x, ZERO_HEIGHTS[i]).re;
  }
  return val;
}`;

const EXPLICIT_FORMULA =
  "\\pi(x) \\approx R(x) - \\sum_{\\gamma} 2\\,\\operatorname{Re}\\frac{x^{1/2 + i\\gamma}}{(1/2 + i\\gamma)\\,\\ln x}, \\qquad R(x) = 1 + \\sum_{k \\ge 1} \\frac{(\\ln x)^k}{k \\cdot k! \\cdot \\zeta(k+1)}";

export const RIEMANN_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Riemann zeta function on the critical line: trace ζ(½ + it), find zeros at t ≈ 14.13, 21.02, 25.01 and watch them rebuild the prime staircase.",
    heading: "How this explorer works",
    intro:
      "There are two plots. The upper one counts primes: a grey staircase that steps up by one at every prime up to 200, and a warm smooth curve that tries to follow it. The lower one follows the Riemann zeta function along the vertical line Re(s) = ½ and draws where its values land in the complex plane. Every time that path runs through the origin, ζ has a zero. Those zeros are exactly what the warm curve in the upper plot is built from.",
    sections: [
      {
        heading: "Zeros and primes",
        paragraphs: [
          "For Re(s) > 1 the zeta function is the sum of 1/n^s over all positive integers, and Euler showed that it equals a product over all primes. That product is why ζ knows about primes at all. Riemann extended the function to the whole complex plane (except s = 1) and, in his 1859 paper, wrote down an explicit formula: the count of primes below x equals a smooth main term minus one oscillating correction for every non-trivial zero.",
          "The non-trivial zeros come in mirror-image pairs above and below the real axis. Every one found so far lies on the line Re(s) = ½, so it has the form ½ ± iγ, and the Riemann hypothesis claims that this holds for all of them. The first heights are γ ≈ 14.1347, 21.0220 and 25.0109; the explorer stores the first 50 of them, up to γ ≈ 143.11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "t_max (5 to 60, default 45) sets how far up the critical line the lower plot goes. The path starts at ζ(½) ≈ −1.46 on the negative real axis and gets brighter as t grows. With t_max = 45 it passes through the origin eight times, once for each zero below 45. The list in the panel shows the heights where the path came close enough to count; push t_max to 60 and it grows to 13 entries, the last near 59.35.",
          "N (20 to 500, default 200) is the number of terms used to evaluate ζ. More terms mean a more accurate path, especially high up the line; fewer terms make the curve slightly wrong and, at large t, visibly shaky.",
          "N_zeros (0 to 50, default 8) is how many zero pairs feed the warm curve in the upper plot. At 0 you see Riemann's smooth function R(x) on its own, which already runs through the middle of the steps: R(100) ≈ 25.66, and there are 25 primes below 100. Each extra zero adds a wave whose frequency grows with γ, and together these waves make the curve rise faster at the primes and flatten between them. The badge in the corner reports the largest gap between the two curves over the visible range. It falls from about 1.7 with no zeros to about 1.1 with 8 and about 0.9 with all 50. Reset returns all three sliders to their defaults.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The familiar series for ζ does not converge on the critical line, so the code uses the Dirichlet eta function instead: the alternating sum 1 − 1/2^s + 1/3^s − … converges for every s with positive real part, and dividing it by 1 − 2^(1−s) gives ζ back.",
          "The trace samples t at 80 points per unit (at least 500 points), evaluates ζ at each, and is memoised, so moving N_zeros never recomputes it. Zeros are found by scanning for local minima of |ζ| that dip below 0.18. The upper plot samples 400 points between x = 2 and 200, takes π(x) from a table of the first 80 primes, and computes R(x) from the Gram series shown above, which converges for every x.",
          "For each zero the correction uses the leading asymptotic term x^ρ / (ρ ln x) instead of the full complex li(x^ρ), and the conjugate zero is handled by doubling the real part. Both plots are static 2D canvases that redraw only when a slider changes or the pane is resized, so there is no animation to switch off for reduced motion.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Why the curve never lands exactly on the steps",
        paragraphs: [
          "Riemann's smooth function R(x) = Σ μ(n)/n · li(x^(1/n)) is built from the logarithmic integral li and already accounts for prime powers, which is why it sits so much closer to the staircase than li(x) alone (li(100) ≈ 30.1). The exact formula subtracts R(x^ρ) for every zero ρ plus two small extra terms. The explorer keeps R(x) in full and only the leading part of each zero term. Measured on the plot, the warm curve is then on average only about 0.05 above π(x), for any number of zeros. It can never match exactly: a continuous curve must miss a jump of height 1 by at least ½, so the badge has a floor near 0.5. Every zero contributes a wave of amplitude about √x / (γ ln x), the waves interfere, and the more of them you add, the sharper the rises at the primes become.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Find the first zero",
        text: "Set t_max to 13 and look at the lower plot: the path swings around but misses the origin, and the zero list is empty. Raise it to 15. The path now cuts through the origin and the list shows γ₁ near 14.13.",
      },
      {
        title: "From R(x) to the staircase",
        text: "Set N_zeros to 0 and note the error badge (about 1.7). Then step through 1, 3, 8, 20 and 50. The smooth curve develops ripples that climb at the primes and level off in the gaps, and the badge drops to about 1.1 at 8 and about 0.9 at 50. It does not fall at every single step: between 1 and 3 it wobbles around 1.4.",
      },
      {
        title: "Starve the series",
        text: "Put t_max at 60 and drop N to 20. Compare the path with N = 500. The rough version still loops near the origin at the right heights, but the shape near the top end of the trace drifts. Accuracy at large t needs more terms.",
      },
      {
        title: "Two zeros close together",
        text: "Zeros 4 and 5 sit at about 30.42 and 32.94. Set t_max to 34 and follow the brightest end of the path: it threads the origin twice in quick succession, with only a small loop in between.",
      },
    ],
  },
  de: {
    metaDescription:
      "Die riemannsche Zetafunktion live: ζ(½ + it) verfolgen, Nullstellen bei t ≈ 14,13, 21,02 und 25,01 finden und sehen, wie sie die Primzahltreppe nachbauen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die beiden Bilder zeigen dasselbe Geheimnis von zwei Seiten. Oben werden Primzahlen gezählt: eine graue Treppe, die bei jeder Primzahl bis 200 um eins steigt, und eine warme, glatte Kurve, die ihr zu folgen versucht. Unten läuft die riemannsche Zetafunktion die senkrechte Linie Re(s) = ½ hinauf, und das Bild zeigt, wo ihre Werte in der komplexen Ebene landen. Jedes Mal, wenn dieser Weg durch den Ursprung führt, hat ζ eine Nullstelle. Genau aus diesen Nullstellen ist die warme Kurve oben gebaut.",
    sections: [
      {
        heading: "Nullstellen und Primzahlen",
        paragraphs: [
          "Für Re(s) > 1 ist die Zetafunktion die Summe von 1/n^s über alle positiven ganzen Zahlen, und Euler hat gezeigt, dass sie einem Produkt über alle Primzahlen entspricht. Deshalb weiß ζ überhaupt etwas über Primzahlen. Riemann setzte die Funktion auf die ganze komplexe Ebene fort (außer s = 1) und schrieb 1859 eine explizite Formel auf: Die Anzahl der Primzahlen unter x ist ein glatter Hauptterm minus je einer schwingenden Korrektur für jede nichttriviale Nullstelle.",
          "Die nichttrivialen Nullstellen treten in Paaren auf, gespiegelt an der reellen Achse. Jede bisher gefundene liegt auf der Linie Re(s) = ½, hat also die Form ½ ± iγ, und die Riemannsche Vermutung behauptet, dass das für alle gilt. Die ersten Höhen sind γ ≈ 14,1347, 21,0220 und 25,0109; der Explorer kennt die ersten 50, bis γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "t_max (5 bis 60, Standard 45) legt fest, wie weit das untere Bild die kritische Linie hinaufgeht. Der Weg beginnt bei ζ(½) ≈ −1,46 auf der negativen reellen Achse und wird mit wachsendem t heller. Bei t_max = 45 läuft er achtmal durch den Ursprung, einmal für jede Nullstelle unter 45. Die Liste im Panel zeigt die Höhen, an denen der Weg nah genug herankam; schiebst du t_max auf 60, wächst sie auf 13 Einträge, der letzte bei etwa 59,35.",
          "N (20 bis 500, Standard 200) ist die Zahl der Glieder, mit denen ζ ausgewertet wird. Mehr Glieder ergeben einen genaueren Weg, vor allem weit oben auf der Linie; mit weniger Gliedern wird die Kurve leicht falsch und bei großem t sichtbar zittrig.",
          "N_zeros (0 bis 50, Standard 8) bestimmt, wie viele Nullstellenpaare in die warme Kurve oben eingehen. Bei 0 siehst du Riemanns glatte Funktion R(x) allein, die schon mitten durch die Stufen läuft: R(100) ≈ 25,66, und unter 100 gibt es 25 Primzahlen. Jede weitere Nullstelle fügt eine Welle hinzu, deren Frequenz mit γ wächst, und zusammen lassen diese Wellen die Kurve an den Primzahlen schneller steigen und dazwischen abflachen. Die Plakette in der Ecke zeigt den größten Abstand der beiden Kurven im sichtbaren Bereich. Er fällt von etwa 1,7 ohne Nullstellen auf etwa 1,1 mit 8 und etwa 0,9 mit allen 50. Zurücksetzen stellt alle drei Regler auf ihre Standardwerte.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die bekannte Reihe für ζ konvergiert auf der kritischen Linie nicht, deshalb nutzt der Code die Dirichletsche Etafunktion: Die alternierende Summe 1 − 1/2^s + 1/3^s − … konvergiert für jedes s mit positivem Realteil, und geteilt durch 1 − 2^(1−s) ergibt sie wieder ζ.",
          "Die Spur tastet t mit 80 Punkten pro Einheit ab (mindestens 500 Punkte), wertet an jedem ζ aus und wird zwischengespeichert, sodass ein Verschieben von N_zeros sie nie neu berechnet. Nullstellen findet der Code als lokale Minima von |ζ|, die unter 0,18 fallen. Das obere Bild nimmt 400 Stützstellen zwischen x = 2 und 200, liest π(x) aus einer Tabelle der ersten 80 Primzahlen und berechnet R(x) über die oben gezeigte Gram-Reihe, die für jedes x konvergiert.",
          "Für jede Nullstelle verwendet die Korrektur statt des vollen komplexen li(x^ρ) nur den führenden asymptotischen Term x^ρ / (ρ ln x), und die konjugierte Nullstelle wird durch Verdoppeln des Realteils erfasst. Beide Bilder sind statische 2D-Canvas, scharf auf hochauflösenden Displays, und werden nur neu gezeichnet, wenn sich ein Regler oder die Fenstergröße ändert. Für reduzierte Bewegung gibt es also nichts abzuschalten.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Warum die Kurve nie genau auf den Stufen landet",
        paragraphs: [
          "Riemanns glatte Funktion R(x) = Σ μ(n)/n · li(x^(1/n)) ist aus dem Integrallogarithmus li gebaut und berücksichtigt die Primzahlpotenzen bereits. Deshalb liegt sie so viel näher an der Treppe als li(x) allein (li(100) ≈ 30,1). Die exakte Formel zieht für jede Nullstelle ρ noch R(x^ρ) ab, dazu kommen zwei kleine Zusatzterme. Der Explorer behält R(x) vollständig und von jedem Nullstellenterm nur den führenden Teil. Im Bild gemessen liegt die warme Kurve damit im Mittel nur etwa 0,05 über π(x), egal mit wie vielen Nullstellen. Exakt treffen kann sie nie: Eine stetige Kurve verfehlt einen Sprung der Höhe 1 um mindestens ½, die Plakette hat also eine Untergrenze bei etwa 0,5. Jede Nullstelle trägt eine Welle mit einer Amplitude von etwa √x / (γ ln x) bei, die Wellen überlagern sich, und je mehr du hinzunimmst, desto schärfer werden die Anstiege an den Primzahlen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die erste Nullstelle finden",
        text: "Stell t_max auf 13 und schau auf das untere Bild: Der Weg schwingt herum, verfehlt aber den Ursprung, und die Nullstellenliste ist leer. Erhöhe auf 15. Jetzt schneidet der Weg den Ursprung, und die Liste zeigt γ₁ bei etwa 14,13.",
      },
      {
        title: "Von R(x) zur Treppe",
        text: "Setz N_zeros auf 0 und merk dir den Wert in der Fehlerplakette (etwa 1,7). Geh dann über 1, 3, 8 und 20 bis 50. Die glatte Kurve bekommt Wellen, die an den Primzahlen ansteigen und in den Lücken abflachen, und die Plakette sinkt auf etwa 1,1 bei 8 und etwa 0,9 bei 50. Sie fällt nicht bei jedem einzelnen Schritt: Zwischen 1 und 3 schwankt sie um 1,4.",
      },
      {
        title: "Die Reihe aushungern",
        text: "Stell t_max auf 60 und senke N auf 20. Vergleiche den Weg mit N = 500. Die grobe Version schleift noch an den richtigen Höhen nahe am Ursprung vorbei, aber die Form am oberen Ende der Spur verrutscht. Genauigkeit bei großem t braucht mehr Glieder.",
      },
      {
        title: "Zwei Nullstellen dicht beieinander",
        text: "Die Nullstellen 4 und 5 liegen bei etwa 30,42 und 32,94. Stell t_max auf 34 und folge dem hellsten Ende des Wegs: Er fädelt zweimal kurz hintereinander durch den Ursprung, mit nur einer kleinen Schleife dazwischen.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora la función zeta de Riemann en la línea crítica: sigue ζ(½ + it), halla ceros en t ≈ 14,13; 21,02 y 25,01 y mira cómo reconstruyen la escalera de primos.",
    heading: "Cómo funciona este explorador",
    intro:
      "Hay dos gráficos. El de arriba cuenta primos: una escalera gris que sube un peldaño en cada primo hasta 200 y una curva cálida y suave que intenta seguirla. El de abajo recorre la función zeta de Riemann a lo largo de la recta vertical Re(s) = ½ y dibuja dónde caen sus valores en el plano complejo. Cada vez que ese camino pasa por el origen, ζ tiene un cero. Y con esos ceros, precisamente, está construida la curva cálida del gráfico superior.",
    sections: [
      {
        heading: "Ceros y primos",
        paragraphs: [
          "Para Re(s) > 1, la función zeta es la suma de 1/n^s sobre todos los enteros positivos, y Euler demostró que coincide con un producto sobre todos los primos. Por ese producto ζ sabe algo de los primos. Riemann extendió la función a todo el plano complejo (salvo s = 1) y, en su artículo de 1859, escribió una fórmula explícita: la cantidad de primos menores que x es igual a un término principal suave menos una corrección oscilante por cada cero no trivial.",
          "Los ceros no triviales vienen en parejas simétricas, por encima y por debajo del eje real. Todos los encontrados hasta hoy están sobre la recta Re(s) = ½, así que tienen la forma ½ ± iγ, y la hipótesis de Riemann afirma que eso vale para todos. Las primeras alturas son γ ≈ 14,1347; 21,0220 y 25,0109; el explorador guarda las 50 primeras, hasta γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "t_max (de 5 a 60, por defecto 45) fija hasta qué altura de la línea crítica llega el gráfico inferior. El camino empieza en ζ(½) ≈ −1,46, sobre el eje real negativo, y se vuelve más brillante a medida que t crece. Con t_max = 45 pasa ocho veces por el origen, una por cada cero por debajo de 45. La lista del panel muestra las alturas en las que el camino se acercó lo bastante como para contar; lleva t_max a 60 y crece hasta 13 entradas, la última cerca de 59,35.",
          "N (de 20 a 500, por defecto 200) es el número de términos con los que se evalúa ζ. Más términos dan un camino más preciso, sobre todo en lo alto de la línea; con menos, la curva sale ligeramente equivocada y, para t grande, visiblemente temblorosa.",
          "N_zeros (de 0 a 50, por defecto 8) indica cuántas parejas de ceros alimentan la curva cálida del gráfico superior. Con 0 ves la función suave R(x) de Riemann a solas, que ya pasa por el medio de los escalones: R(100) ≈ 25,66, y hay 25 primos por debajo de 100. Cada cero adicional suma una onda cuya frecuencia crece con γ, y entre todas hacen que la curva suba más deprisa en los primos y se aplane entre ellos. La etiqueta de la esquina indica la mayor separación entre las dos curvas en el rango visible. Baja de unos 1,7 sin ceros a unos 1,1 con 8 y a unos 0,9 con los 50. «↺ reiniciar» devuelve los tres deslizadores a sus valores por defecto.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La serie habitual de ζ no converge en la línea crítica, así que el código usa en su lugar la función eta de Dirichlet: la suma alternada 1 − 1/2^s + 1/3^s − … converge para todo s con parte real positiva, y al dividirla entre 1 − 2^(1−s) se recupera ζ.",
          "El trazo muestrea t en 80 puntos por unidad (500 puntos como mínimo), evalúa ζ en cada uno y queda memorizado, de modo que mover N_zeros nunca lo recalcula. Los ceros se detectan buscando mínimos locales de |ζ| que bajen de 0,18. El gráfico superior toma 400 muestras entre x = 2 y 200, obtiene π(x) de una tabla con los 80 primeros primos y calcula R(x) con la serie de Gram mostrada arriba, que converge para todo x.",
          "Para cada cero, la corrección usa el término asintótico dominante x^ρ / (ρ ln x) en lugar del li(x^ρ) complejo completo, y el cero conjugado se tiene en cuenta duplicando la parte real. Ambos gráficos son lienzos 2D estáticos que solo se redibujan cuando cambia un deslizador o el tamaño del panel, así que no hay ninguna animación que desactivar para el modo de movimiento reducido.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Por qué la curva nunca cae exactamente sobre los escalones",
        paragraphs: [
          "La función suave de Riemann, R(x) = Σ μ(n)/n · li(x^(1/n)), se construye a partir de la integral logarítmica li y ya tiene en cuenta las potencias de primos; por eso queda mucho más cerca de la escalera que li(x) por sí sola (li(100) ≈ 30,1). La fórmula exacta resta R(x^ρ) por cada cero ρ, más dos pequeños términos adicionales. El explorador conserva R(x) entera y, de cada término de cero, solo la parte dominante. Medida sobre el gráfico, la curva cálida queda entonces, en promedio, apenas unos 0,05 por encima de π(x), sea cual sea el número de ceros. Nunca puede coincidir del todo: una curva continua tiene que fallar un salto de altura 1 por al menos ½, de modo que la etiqueta tiene un suelo cercano a 0,5. Cada cero aporta una onda de amplitud aproximada √x / (γ ln x), las ondas interfieren y, cuantas más añades, más abruptas se vuelven las subidas en los primos.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Encuentra el primer cero",
        text: "Pon t_max en 13 y mira el gráfico inferior: el camino da vueltas pero no toca el origen, y la lista de ceros está vacía. Súbelo a 15. Ahora el camino atraviesa el origen y la lista muestra γ₁ cerca de 14,13.",
      },
      {
        title: "De R(x) a la escalera",
        text: "Pon N_zeros en 0 y fíjate en la etiqueta de error (unos 1,7). Después pasa por 1, 3, 8, 20 y 50. A la curva suave le salen ondulaciones que trepan en los primos y se nivelan en los huecos, y la etiqueta baja a unos 1,1 con 8 y a unos 0,9 con 50. No desciende en cada paso: entre 1 y 3 oscila en torno a 1,4.",
      },
      {
        title: "Deja la serie sin términos",
        text: "Pon t_max en 60 y baja N a 20. Compara el camino con el de N = 500. La versión tosca sigue haciendo lazos cerca del origen a las alturas correctas, pero la forma se desvía en el extremo superior del trazo. La precisión para t grande exige más términos.",
      },
      {
        title: "Dos ceros muy juntos",
        text: "Los ceros 4 y 5 están aproximadamente en 30,42 y 32,94. Pon t_max en 34 y sigue el extremo más brillante del camino: enhebra el origen dos veces seguidas, con solo un pequeño lazo entre medias.",
      },
    ],
  },
  fr: {
    metaDescription:
      "La fonction zêta de Riemann sur la droite critique : suis ζ(½ + it), trouve les zéros en t ≈ 14,13 ; 21,02 et 25,01, vois-les rebâtir l'escalier des premiers.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Il y a deux graphiques. Celui du haut compte les nombres premiers : un escalier gris qui monte d'une marche à chaque premier jusqu'à 200, et une courbe chaude et lisse qui tente de le suivre. Celui du bas suit la fonction zêta de Riemann le long de la droite verticale Re(s) = ½ et dessine où ses valeurs atterrissent dans le plan complexe. Chaque fois que ce chemin passe par l'origine, ζ possède un zéro. Et c'est exactement à partir de ces zéros qu'est construite la courbe chaude du graphique du haut.",
    sections: [
      {
        heading: "Zéros et nombres premiers",
        paragraphs: [
          "Pour Re(s) > 1, la fonction zêta est la somme des 1/n^s sur tous les entiers strictement positifs, et Euler a montré qu'elle est égale à un produit sur tous les nombres premiers. C'est ce produit qui explique que ζ sache quoi que ce soit des premiers. Riemann a prolongé la fonction à tout le plan complexe (sauf s = 1) et, dans son article de 1859, a écrit une formule explicite : le nombre de premiers inférieurs à x est égal à un terme principal lisse, moins une correction oscillante pour chaque zéro non trivial.",
          "Les zéros non triviaux vont par paires symétriques, au-dessus et au-dessous de l'axe réel. Tous ceux trouvés à ce jour se situent sur la droite Re(s) = ½, ils sont donc de la forme ½ ± iγ, et l'hypothèse de Riemann affirme que c'est vrai pour tous. Les premières hauteurs sont γ ≈ 14,1347 ; 21,0220 et 25,0109 ; l'explorateur garde en mémoire les 50 premières, jusqu'à γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "t_max (de 5 à 60, 45 par défaut) fixe jusqu'où le graphique du bas remonte la droite critique. Le chemin part de ζ(½) ≈ −1,46, sur l'axe réel négatif, et devient plus lumineux à mesure que t grandit. Avec t_max = 45, il passe huit fois par l'origine, une fois pour chaque zéro en dessous de 45. La liste du panneau indique les hauteurs où le chemin s'est approché assez près pour compter ; pousse t_max à 60 et elle passe à 13 entrées, la dernière vers 59,35.",
          "N (de 20 à 500, 200 par défaut) est le nombre de termes utilisés pour évaluer ζ. Plus de termes donnent un chemin plus précis, surtout en haut de la droite ; avec moins de termes, la courbe devient légèrement fausse et, pour t grand, visiblement tremblante.",
          "N_zeros (de 0 à 50, 8 par défaut) indique combien de paires de zéros alimentent la courbe chaude du graphique du haut. À 0, tu vois la fonction lisse R(x) de Riemann seule, qui passe déjà au milieu des marches : R(100) ≈ 25,66, et il y a 25 nombres premiers en dessous de 100. Chaque zéro supplémentaire ajoute une onde dont la fréquence croît avec γ, et ensemble ces ondes font monter la courbe plus vite aux nombres premiers et l'aplatissent entre eux. Le badge dans le coin donne le plus grand écart entre les deux courbes sur l'intervalle visible. Il passe d'environ 1,7 sans zéro à environ 1,1 avec 8 et environ 0,9 avec les 50. « réinitialiser » ramène les trois curseurs à leurs valeurs par défaut.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La série habituelle de ζ ne converge pas sur la droite critique ; le code utilise donc à la place la fonction êta de Dirichlet : la somme alternée 1 − 1/2^s + 1/3^s − … converge pour tout s de partie réelle positive, et en la divisant par 1 − 2^(1−s) on retrouve ζ.",
          "La trace échantillonne t à raison de 80 points par unité (au moins 500 points), évalue ζ en chacun d'eux et est mémoïsée, si bien que déplacer N_zeros ne la recalcule jamais. Les zéros sont repérés en cherchant les minimums locaux de |ζ| qui descendent sous 0,18. Le graphique du haut prend 400 échantillons entre x = 2 et 200, tire π(x) d'une table des 80 premiers nombres premiers et calcule R(x) avec la série de Gram donnée plus haut, qui converge pour tout x.",
          "Pour chaque zéro, la correction utilise le terme asymptotique dominant x^ρ / (ρ ln x) au lieu du li(x^ρ) complexe complet, et le zéro conjugué est pris en compte en doublant la partie réelle. Les deux graphiques sont des canevas 2D statiques qui ne se redessinent que lorsqu'un curseur bouge ou que le panneau change de taille : il n'y a donc aucune animation à couper quand la réduction des animations est activée.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Pourquoi la courbe ne se pose jamais exactement sur les marches",
        paragraphs: [
          "La fonction lisse de Riemann, R(x) = Σ μ(n)/n · li(x^(1/n)), est construite à partir du logarithme intégral li et tient déjà compte des puissances de nombres premiers ; c'est pourquoi elle colle bien mieux à l'escalier que li(x) seul (li(100) ≈ 30,1). La formule exacte soustrait R(x^ρ) pour chaque zéro ρ, plus deux petits termes supplémentaires. L'explorateur conserve R(x) en entier et seulement la partie dominante de chaque terme lié à un zéro. Mesurée sur le graphique, la courbe chaude ne se trouve alors en moyenne qu'à environ 0,05 au-dessus de π(x), quel que soit le nombre de zéros. Elle ne peut jamais coïncider exactement : une courbe continue manque forcément un saut de hauteur 1 d'au moins ½, le badge a donc un plancher proche de 0,5. Chaque zéro apporte une onde d'amplitude voisine de √x / (γ ln x), les ondes interfèrent, et plus tu en ajoutes, plus les montées aux nombres premiers deviennent raides.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Trouve le premier zéro",
        text: "Règle t_max sur 13 et regarde le graphique du bas : le chemin tournoie mais manque l'origine, et la liste des zéros est vide. Monte à 15. Le chemin coupe maintenant l'origine et la liste affiche γ₁ près de 14,13.",
      },
      {
        title: "De R(x) à l'escalier",
        text: "Règle N_zeros sur 0 et note la valeur du badge d'erreur (environ 1,7). Passe ensuite par 1, 3, 8, 20 et 50. La courbe lisse se couvre d'ondulations qui grimpent aux nombres premiers et s'aplanissent dans les intervalles, et le badge descend à environ 1,1 pour 8 et environ 0,9 pour 50. Il ne baisse pas à chaque étape : entre 1 et 3, il oscille autour de 1,4.",
      },
      {
        title: "Affame la série",
        text: "Mets t_max à 60 et descends N à 20. Compare le chemin avec celui de N = 500. La version grossière boucle encore près de l'origine aux bonnes hauteurs, mais la forme dérive vers l'extrémité haute de la trace. La précision pour t grand demande plus de termes.",
      },
      {
        title: "Deux zéros très proches",
        text: "Les zéros 4 et 5 se trouvent vers 30,42 et 32,94. Règle t_max sur 34 et suis l'extrémité la plus lumineuse du chemin : il enfile l'origine deux fois coup sur coup, avec seulement une petite boucle entre les deux.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora la funzione zeta di Riemann sulla retta critica: segui ζ(½ + it), trova gli zeri a t ≈ 14,13; 21,02 e 25,01 e guarda come ricreano la scala dei primi.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ci sono due grafici. Quello in alto conta i numeri primi: una scala grigia che sale di un gradino a ogni primo fino a 200 e una curva calda e liscia che cerca di seguirla. Quello in basso percorre la funzione zeta di Riemann lungo la retta verticale Re(s) = ½ e disegna dove cadono i suoi valori nel piano complesso. Ogni volta che quel percorso passa per l'origine, ζ ha uno zero. Ed è proprio con questi zeri che è costruita la curva calda del grafico in alto.",
    sections: [
      {
        heading: "Zeri e numeri primi",
        paragraphs: [
          "Per Re(s) > 1 la funzione zeta è la somma di 1/n^s su tutti gli interi positivi, ed Eulero dimostrò che coincide con un prodotto su tutti i numeri primi. È per via di quel prodotto che ζ sa qualcosa dei primi. Riemann estese la funzione a tutto il piano complesso (tranne s = 1) e, nel suo articolo del 1859, scrisse una formula esplicita: il numero di primi minori di x è uguale a un termine principale liscio meno una correzione oscillante per ogni zero non banale.",
          "Gli zeri non banali si presentano in coppie speculari, sopra e sotto l'asse reale. Tutti quelli trovati finora stanno sulla retta Re(s) = ½, hanno quindi la forma ½ ± iγ, e l'ipotesi di Riemann afferma che questo vale per tutti. Le prime altezze sono γ ≈ 14,1347; 21,0220 e 25,0109; l'esploratore ne memorizza le prime 50, fino a γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "t_max (da 5 a 60, predefinito 45) stabilisce fin dove il grafico in basso risale la retta critica. Il percorso parte da ζ(½) ≈ −1,46, sull'asse reale negativo, e diventa più luminoso al crescere di t. Con t_max = 45 passa otto volte per l'origine, una per ogni zero sotto 45. L'elenco nel pannello mostra le altezze in cui il percorso si è avvicinato abbastanza da contare; porta t_max a 60 e sale a 13 voci, l'ultima vicino a 59,35.",
          "N (da 20 a 500, predefinito 200) è il numero di termini usati per valutare ζ. Più termini danno un percorso più accurato, soprattutto in alto lungo la retta; con meno termini la curva risulta leggermente sbagliata e, per t grande, visibilmente tremolante.",
          "N_zeros (da 0 a 50, predefinito 8) indica quante coppie di zeri alimentano la curva calda del grafico in alto. A 0 vedi la funzione liscia R(x) di Riemann da sola, che passa già in mezzo ai gradini: R(100) ≈ 25,66, e sotto 100 ci sono 25 numeri primi. Ogni zero in più aggiunge un'onda la cui frequenza cresce con γ, e insieme queste onde fanno salire la curva più in fretta in corrispondenza dei primi e la appiattiscono negli intervalli. L'etichetta nell'angolo riporta il massimo scarto tra le due curve nell'intervallo visibile. Scende da circa 1,7 senza zeri a circa 1,1 con 8 e a circa 0,9 con tutti e 50.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La serie consueta di ζ non converge sulla retta critica, perciò il codice usa al suo posto la funzione eta di Dirichlet: la somma a segni alterni 1 − 1/2^s + 1/3^s − … converge per ogni s con parte reale positiva, e dividendola per 1 − 2^(1−s) si riottiene ζ.",
          "La traccia campiona t con 80 punti per unità (almeno 500 punti), valuta ζ in ciascuno e viene memoizzata, così spostare N_zeros non la ricalcola mai. Gli zeri si trovano cercando i minimi locali di |ζ| che scendono sotto 0,18. Il grafico in alto prende 400 campioni tra x = 2 e 200, ricava π(x) da una tabella dei primi 80 numeri primi e calcola R(x) con la serie di Gram mostrata sopra, che converge per ogni x.",
          "Per ogni zero la correzione usa il termine asintotico dominante x^ρ / (ρ ln x) al posto del li(x^ρ) complesso completo, e dello zero coniugato si tiene conto raddoppiando la parte reale. Entrambi i grafici sono canvas 2D statici che vengono ridisegnati solo quando cambia un cursore o la dimensione del riquadro, quindi non c'è alcuna animazione da disattivare per il movimento ridotto.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Perché la curva non si posa mai esattamente sui gradini",
        paragraphs: [
          "La funzione liscia di Riemann, R(x) = Σ μ(n)/n · li(x^(1/n)), è costruita a partire dal logaritmo integrale li e tiene già conto delle potenze dei primi; per questo sta molto più vicina alla scala di li(x) da solo (li(100) ≈ 30,1). La formula esatta sottrae R(x^ρ) per ogni zero ρ, più due piccoli termini aggiuntivi. L'esploratore mantiene R(x) per intero e, di ciascun termine legato a uno zero, soltanto la parte dominante. Misurata sul grafico, la curva calda sta allora in media solo circa 0,05 sopra π(x), qualunque sia il numero di zeri. Non può mai coincidere esattamente: una curva continua deve mancare un salto di altezza 1 di almeno ½, quindi l'etichetta ha un minimo vicino a 0,5. Ogni zero contribuisce con un'onda di ampiezza pari a circa √x / (γ ln x), le onde interferiscono e, più ne aggiungi, più ripide diventano le salite in corrispondenza dei primi.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Trova il primo zero",
        text: "Imposta t_max a 13 e guarda il grafico in basso: il percorso gira intorno ma manca l'origine, e l'elenco degli zeri è vuoto. Alzalo a 15. Ora il percorso taglia l'origine e l'elenco mostra γ₁ vicino a 14,13.",
      },
      {
        title: "Da R(x) alla scala",
        text: "Imposta N_zeros a 0 e annota l'etichetta dell'errore (circa 1,7). Poi passa per 1, 3, 8, 20 e 50. Sulla curva liscia compaiono increspature che salgono in corrispondenza dei primi e si spianano negli intervalli, e l'etichetta scende a circa 1,1 con 8 e a circa 0,9 con 50. Non cala a ogni singolo passo: tra 1 e 3 oscilla intorno a 1,4.",
      },
      {
        title: "Affama la serie",
        text: "Porta t_max a 60 e abbassa N a 20. Confronta il percorso con quello per N = 500. La versione grossolana forma ancora cappi vicino all'origine alle altezze giuste, ma la forma verso l'estremità superiore della traccia va alla deriva. La precisione per t grande richiede più termini.",
      },
      {
        title: "Due zeri ravvicinati",
        text: "Gli zeri 4 e 5 si trovano a circa 30,42 e 32,94. Imposta t_max a 34 e segui l'estremità più luminosa del percorso: infila l'origine due volte in rapida successione, con solo un piccolo cappio in mezzo.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora a função zeta de Riemann na reta crítica: segue ζ(½ + it), encontra zeros em t ≈ 14,13; 21,02 e 25,01 e vê como reconstroem a escada dos números primos.",
    heading: "Como funciona este explorador",
    intro:
      "Há dois gráficos. O de cima conta primos: uma escada cinzenta que sobe um degrau em cada primo até 200 e uma curva quente e suave que tenta acompanhá-la. O de baixo percorre a função zeta de Riemann ao longo da reta vertical Re(s) = ½ e desenha onde os seus valores caem no plano complexo. Sempre que esse caminho passa pela origem, ζ tem um zero. E é precisamente com esses zeros que se constrói a curva quente do gráfico de cima.",
    sections: [
      {
        heading: "Zeros e primos",
        paragraphs: [
          "Para Re(s) > 1, a função zeta é a soma de 1/n^s sobre todos os inteiros positivos, e Euler mostrou que é igual a um produto sobre todos os primos. É por causa desse produto que ζ sabe alguma coisa sobre os primos. Riemann estendeu a função a todo o plano complexo (exceto s = 1) e, no seu artigo de 1859, escreveu uma fórmula explícita: a quantidade de primos abaixo de x é igual a um termo principal suave menos uma correção oscilante por cada zero não trivial.",
          "Os zeros não triviais surgem em pares simétricos, acima e abaixo do eixo real. Todos os que se encontraram até hoje estão sobre a reta Re(s) = ½, pelo que têm a forma ½ ± iγ, e a hipótese de Riemann afirma que isso vale para todos. As primeiras alturas são γ ≈ 14,1347; 21,0220 e 25,0109; o explorador guarda as 50 primeiras, até γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "t_max (de 5 a 60, predefinição 45) define até onde o gráfico de baixo sobe pela reta crítica. O caminho começa em ζ(½) ≈ −1,46, no eixo real negativo, e fica mais brilhante à medida que t cresce. Com t_max = 45 passa oito vezes pela origem, uma por cada zero abaixo de 45. A lista no painel mostra as alturas em que o caminho se aproximou o suficiente para contar; leva t_max até 60 e ela cresce para 13 entradas, a última perto de 59,35.",
          "N (de 20 a 500, predefinição 200) é o número de termos usados para avaliar ζ. Mais termos dão um caminho mais exato, sobretudo no alto da reta; com menos termos a curva fica ligeiramente errada e, para t grande, visivelmente trémula.",
          "N_zeros (de 0 a 50, predefinição 8) indica quantos pares de zeros alimentam a curva quente do gráfico de cima. Em 0 vês a função suave R(x) de Riemann sozinha, que já passa pelo meio dos degraus: R(100) ≈ 25,66, e há 25 primos abaixo de 100. Cada zero adicional acrescenta uma onda cuja frequência cresce com γ, e em conjunto estas ondas fazem a curva subir mais depressa nos primos e achatar entre eles. A etiqueta no canto indica a maior distância entre as duas curvas no intervalo visível. Desce de cerca de 1,7 sem zeros para cerca de 1,1 com 8 e cerca de 0,9 com todos os 50. «↺ reiniciar» repõe os três cursores nos valores predefinidos.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A série habitual de ζ não converge na reta crítica, por isso o código usa em vez dela a função eta de Dirichlet: a soma alternada 1 − 1/2^s + 1/3^s − … converge para todo o s com parte real positiva, e dividi-la por 1 − 2^(1−s) devolve ζ.",
          "O traço amostra t em 80 pontos por unidade (no mínimo 500 pontos), avalia ζ em cada um e fica memorizado, de modo que mexer em N_zeros nunca o recalcula. Os zeros são detetados procurando mínimos locais de |ζ| que desçam abaixo de 0,18. O gráfico de cima toma 400 amostras entre x = 2 e 200, obtém π(x) de uma tabela dos 80 primeiros primos e calcula R(x) com a série de Gram mostrada acima, que converge para todo o x.",
          "Para cada zero, a correção usa o termo assintótico dominante x^ρ / (ρ ln x) em vez do li(x^ρ) complexo completo, e o zero conjugado é tratado duplicando a parte real. Ambos os gráficos são canvas 2D estáticos que só são redesenhados quando um cursor muda ou o painel é redimensionado, pelo que não há nenhuma animação a desligar para o movimento reduzido.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Porque é que a curva nunca assenta exatamente nos degraus",
        paragraphs: [
          "A função suave de Riemann, R(x) = Σ μ(n)/n · li(x^(1/n)), é construída a partir do logaritmo integral li e já tem em conta as potências de primos; é por isso que fica muito mais perto da escada do que li(x) sozinho (li(100) ≈ 30,1). A fórmula exata subtrai R(x^ρ) por cada zero ρ, mais dois pequenos termos adicionais. O explorador mantém R(x) por inteiro e, de cada termo de zero, apenas a parte dominante. Medida no gráfico, a curva quente fica então, em média, apenas cerca de 0,05 acima de π(x), seja qual for o número de zeros. Nunca pode coincidir exatamente: uma curva contínua tem de falhar um salto de altura 1 por pelo menos ½, pelo que a etiqueta tem um piso perto de 0,5. Cada zero contribui com uma onda de amplitude aproximada √x / (γ ln x), as ondas interferem e, quantas mais acrescentas, mais abruptas se tornam as subidas nos primos.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Encontra o primeiro zero",
        text: "Põe t_max em 13 e olha para o gráfico de baixo: o caminho anda às voltas mas falha a origem, e a lista de zeros está vazia. Sobe para 15. Agora o caminho atravessa a origem e a lista mostra γ₁ perto de 14,13.",
      },
      {
        title: "De R(x) à escada",
        text: "Põe N_zeros em 0 e repara na etiqueta de erro (cerca de 1,7). Depois passa por 1, 3, 8, 20 e 50. A curva suave ganha ondulações que sobem nos primos e nivelam nos intervalos, e a etiqueta desce para cerca de 1,1 com 8 e cerca de 0,9 com 50. Não desce em todos os passos: entre 1 e 3 oscila em torno de 1,4.",
      },
      {
        title: "Deixa a série à míngua",
        text: "Põe t_max em 60 e baixa N para 20. Compara o caminho com o de N = 500. A versão grosseira continua a fazer laços perto da origem nas alturas certas, mas a forma desvia-se junto ao extremo superior do traço. A exatidão para t grande exige mais termos.",
      },
      {
        title: "Dois zeros muito próximos",
        text: "Os zeros 4 e 5 ficam em cerca de 30,42 e 32,94. Põe t_max em 34 e segue a ponta mais brilhante do caminho: enfia a origem duas vezes de seguida, com apenas um pequeno laço pelo meio.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska Riemanns zetafunktion på den kritiska linjen: följ ζ(½ + it), hitta nollställen vid t ≈ 14,13; 21,02 och 25,01 och se dem bygga upp primtalstrappan.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Det finns två diagram. Det övre räknar primtal: en grå trappa som tar ett steg uppåt vid varje primtal upp till 200, och en varm, slät kurva som försöker följa den. Det nedre följer Riemanns zetafunktion längs den lodräta linjen Re(s) = ½ och ritar var dess värden hamnar i det komplexa talplanet. Varje gång den vägen går genom origo har ζ ett nollställe. Det är precis de nollställena som den varma kurvan i det övre diagrammet är byggd av.",
    sections: [
      {
        heading: "Nollställen och primtal",
        paragraphs: [
          "För Re(s) > 1 är zetafunktionen summan av 1/n^s över alla positiva heltal, och Euler visade att den är lika med en produkt över alla primtal. Den produkten är skälet till att ζ över huvud taget vet något om primtal. Riemann utvidgade funktionen till hela det komplexa talplanet (utom s = 1) och skrev i sin artikel från 1859 ner en explicit formel: antalet primtal under x är lika med en slät huvudterm minus en svängande korrektion för varje icke-trivialt nollställe.",
          "De icke-triviala nollställena kommer i spegelvända par över och under den reella axeln. Alla som hittills har hittats ligger på linjen Re(s) = ½ och har alltså formen ½ ± iγ, och Riemannhypotesen påstår att det gäller för samtliga. De första höjderna är γ ≈ 14,1347; 21,0220 och 25,0109. Utforskaren har de 50 första lagrade, upp till γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "t_max (5 till 60, standard 45) bestämmer hur långt upp längs den kritiska linjen det nedre diagrammet går. Vägen börjar i ζ(½) ≈ −1,46 på den negativa reella axeln och blir ljusare när t växer. Med t_max = 45 går den genom origo åtta gånger, en gång för varje nollställe under 45. Listan i panelen visar höjderna där vägen kom tillräckligt nära för att räknas; dra t_max till 60 så växer den till 13 poster, den sista nära 59,35.",
          "N (20 till 500, standard 200) är antalet termer som används för att beräkna ζ. Fler termer ger en noggrannare väg, särskilt högt upp på linjen; med färre termer blir kurvan en aning fel och, för stora t, synbart darrig.",
          "N_zeros (0 till 50, standard 8) anger hur många nollställespar som matar den varma kurvan i det övre diagrammet. Vid 0 ser du Riemanns släta funktion R(x) ensam, och den går redan mitt genom trappstegen: R(100) ≈ 25,66, och det finns 25 primtal under 100. Varje ytterligare nollställe lägger till en våg vars frekvens växer med γ, och tillsammans får vågorna kurvan att stiga snabbare vid primtalen och plana ut mellan dem. Märket i hörnet anger det största avståndet mellan de två kurvorna i det synliga området. Det sjunker från ungefär 1,7 utan nollställen till ungefär 1,1 med 8 och ungefär 0,9 med alla 50.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Den välbekanta serien för ζ konvergerar inte på den kritiska linjen, så koden använder Dirichlets etafunktion i stället: den alternerande summan 1 − 1/2^s + 1/3^s − … konvergerar för varje s med positiv realdel, och delar man den med 1 − 2^(1−s) får man tillbaka ζ.",
          "Spåret samplar t i 80 punkter per enhet (minst 500 punkter), beräknar ζ i var och en och sparas i minnet, så att N_zeros kan flyttas utan att det någonsin räknas om. Nollställen hittas genom att leta efter lokala minima av |ζ| som dyker under 0,18. Det övre diagrammet tar 400 sampel mellan x = 2 och 200, hämtar π(x) ur en tabell över de 80 första primtalen och beräknar R(x) med Gramserien som visas ovan, som konvergerar för varje x.",
          "För varje nollställe använder korrektionen den ledande asymptotiska termen x^ρ / (ρ ln x) i stället för det fullständiga komplexa li(x^ρ), och det konjugerade nollstället hanteras genom att realdelen fördubblas. Båda diagrammen är statiska 2D-canvasar som bara ritas om när ett reglage ändras eller panelen byter storlek, så det finns ingen animation att stänga av för minskad rörelse.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Varför kurvan aldrig hamnar exakt på trappstegen",
        paragraphs: [
          "Riemanns släta funktion R(x) = Σ μ(n)/n · li(x^(1/n)) är byggd av den logaritmiska integralen li och tar redan hänsyn till primtalspotenser, och därför ligger den så mycket närmare trappan än li(x) ensam (li(100) ≈ 30,1). Den exakta formeln drar ifrån R(x^ρ) för varje nollställe ρ, plus två små extratermer. Utforskaren behåller R(x) i sin helhet och bara den ledande delen av varje nollställesterm. Mätt i diagrammet ligger den varma kurvan då i genomsnitt bara ungefär 0,05 över π(x), oavsett antalet nollställen. Den kan aldrig stämma exakt: en kontinuerlig kurva måste missa ett hopp av höjd 1 med minst ½, så märket har ett golv nära 0,5. Varje nollställe bidrar med en våg med amplitud ungefär √x / (γ ln x), vågorna interfererar, och ju fler du lägger till, desto skarpare blir stigningarna vid primtalen.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Hitta det första nollstället",
        text: "Sätt t_max till 13 och titta på det nedre diagrammet: vägen svänger runt men missar origo, och listan över nollställen är tom. Höj till 15. Nu skär vägen genom origo och listan visar γ₁ nära 14,13.",
      },
      {
        title: "Från R(x) till trappan",
        text: "Sätt N_zeros till 0 och titta på felmärket (ungefär 1,7). Stega sedan genom 1, 3, 8, 20 och 50. Den släta kurvan får krusningar som klättrar vid primtalen och planar ut i luckorna, och märket sjunker till ungefär 1,1 vid 8 och ungefär 0,9 vid 50. Den sjunker inte i varje enskilt steg: mellan 1 och 3 pendlar den kring 1,4.",
      },
      {
        title: "Svält serien",
        text: "Ställ t_max på 60 och sänk N till 20. Jämför vägen med den för N = 500. Den grova versionen gör fortfarande öglor nära origo på rätt höjder, men formen nära spårets övre ände glider iväg. Noggrannhet för stora t kräver fler termer.",
      },
      {
        title: "Två nollställen tätt ihop",
        text: "Nollställe 4 och 5 ligger vid ungefär 30,42 och 32,94. Sätt t_max till 34 och följ vägens ljusaste ände: den trär sig genom origo två gånger i snabb följd, med bara en liten ögla emellan.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk Riemanns zetafunksjon på den kritiske linjen: Følg ζ(½ + it), finn nullpunkter ved t ≈ 14,13; 21,02 og 25,01 og se dem bygge opp primtallstrappen igjen.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det er to diagrammer. Det øverste teller primtall: en grå trapp som går ett trinn opp ved hvert primtall opp til 200, og en varm, glatt kurve som prøver å følge den. Det nederste følger Riemanns zetafunksjon langs den loddrette linjen Re(s) = ½ og tegner hvor verdiene havner i det komplekse planet. Hver gang den banen går gjennom origo, har ζ et nullpunkt. Det er nettopp disse nullpunktene den varme kurven i det øverste diagrammet er bygd av.",
    sections: [
      {
        heading: "Nullpunkter og primtall",
        paragraphs: [
          "For Re(s) > 1 er zetafunksjonen summen av 1/n^s over alle positive heltall, og Euler viste at den er lik et produkt over alle primtall. Det produktet er grunnen til at ζ i det hele tatt vet noe om primtall. Riemann utvidet funksjonen til hele det komplekse planet (unntatt s = 1) og skrev i artikkelen sin fra 1859 ned en eksplisitt formel: Antallet primtall under x er lik et glatt hovedledd minus en svingende korreksjon for hvert ikke-trivielle nullpunkt.",
          "De ikke-trivielle nullpunktene kommer i speilvendte par over og under den reelle aksen. Alle som er funnet til nå, ligger på linjen Re(s) = ½ og har dermed formen ½ ± iγ, og Riemannhypotesen hevder at det gjelder for alle. De første høydene er γ ≈ 14,1347; 21,0220 og 25,0109. Utforskeren har lagret de 50 første, opp til γ ≈ 143,11.",
        ],
        formula: EXPLICIT_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "t_max (5 til 60, standard 45) bestemmer hvor langt opp langs den kritiske linjen det nederste diagrammet går. Banen starter i ζ(½) ≈ −1,46 på den negative reelle aksen og blir lysere etter hvert som t vokser. Med t_max = 45 går den gjennom origo åtte ganger, én gang for hvert nullpunkt under 45. Listen i panelet viser høydene der banen kom nær nok til å telle; skyv t_max til 60, så vokser den til 13 oppføringer, den siste nær 59,35.",
          "N (20 til 500, standard 200) er antallet ledd som brukes til å beregne ζ. Flere ledd gir en mer nøyaktig bane, særlig høyt oppe på linjen; med færre ledd blir kurven litt feil og, for store t, synlig skjelven.",
          "N_zeros (0 til 50, standard 8) angir hvor mange nullpunktpar som mater den varme kurven i det øverste diagrammet. Ved 0 ser du Riemanns glatte funksjon R(x) alene, og den går allerede midt gjennom trinnene: R(100) ≈ 25,66, og det finnes 25 primtall under 100. Hvert ekstra nullpunkt legger til en bølge med en frekvens som vokser med γ, og sammen får bølgene kurven til å stige raskere ved primtallene og flate ut mellom dem. Merket i hjørnet oppgir den største avstanden mellom de to kurvene i det synlige området. Den faller fra omtrent 1,7 uten nullpunkter til omtrent 1,1 med 8 og omtrent 0,9 med alle 50. «tilbakestill» setter alle de tre glidebryterne tilbake til standardverdiene.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Den velkjente rekken for ζ konvergerer ikke på den kritiske linjen, så koden bruker Dirichlets etafunksjon i stedet: Den alternerende summen 1 − 1/2^s + 1/3^s − … konvergerer for enhver s med positiv realdel, og deler du den på 1 − 2^(1−s), får du ζ tilbake.",
          "Sporet beregnes i 80 t-verdier per enhet (minst 500 punkter), beregner ζ i hvert av dem og blir mellomlagret, slik at det aldri regnes ut på nytt når du flytter N_zeros. Nullpunkter finnes ved å lete etter lokale minima av |ζ| som dykker under 0,18. Det øverste diagrammet bruker 400 punkter mellom x = 2 og 200, henter π(x) fra en tabell over de 80 første primtallene og beregner R(x) med Gram-rekken vist ovenfor, som konvergerer for enhver x.",
          "For hvert nullpunkt bruker korreksjonen det ledende asymptotiske leddet x^ρ / (ρ ln x) i stedet for den fulle komplekse li(x^ρ), og det konjugerte nullpunktet tas med ved å doble realdelen. Begge diagrammene er statiske 2D-lerreter som bare tegnes på nytt når en glidebryter endres eller panelet får ny størrelse, så det finnes ingen animasjon å slå av for redusert bevegelse.",
        ],
        code: ZETA_EXCERPT,
      },
      {
        heading: "Hvorfor kurven aldri lander nøyaktig på trinnene",
        paragraphs: [
          "Riemanns glatte funksjon R(x) = Σ μ(n)/n · li(x^(1/n)) er bygd av det logaritmiske integralet li og tar allerede hensyn til primtallspotenser, og derfor ligger den så mye nærmere trappen enn li(x) alene (li(100) ≈ 30,1). Den eksakte formelen trekker fra R(x^ρ) for hvert nullpunkt ρ, pluss to små tilleggsledd. Utforskeren beholder R(x) i sin helhet og bare den ledende delen av hvert nullpunktsledd. Målt i diagrammet ligger den varme kurven da i snitt bare omtrent 0,05 over π(x), uansett antall nullpunkter. Den kan aldri treffe nøyaktig: En kontinuerlig kurve må bomme på et sprang med høyde 1 med minst ½, så merket har et gulv nær 0,5. Hvert nullpunkt bidrar med en bølge med amplitude omtrent √x / (γ ln x), bølgene interfererer, og jo flere du legger til, desto skarpere blir stigningene ved primtallene.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Finn det første nullpunktet",
        text: "Sett t_max til 13 og se på det nederste diagrammet: Banen svinger rundt, men bommer på origo, og listen over nullpunkter er tom. Øk til 15. Nå skjærer banen gjennom origo, og listen viser γ₁ nær 14,13.",
      },
      {
        title: "Fra R(x) til trappen",
        text: "Sett N_zeros til 0 og legg merke til feilmerket (omtrent 1,7). Gå deretter gjennom 1, 3, 8, 20 og 50. Den glatte kurven får krusninger som klatrer ved primtallene og flater ut i mellomrommene, og merket synker til omtrent 1,1 ved 8 og omtrent 0,9 ved 50. Det faller ikke ved hvert eneste steg: Mellom 1 og 3 vingler det rundt 1,4.",
      },
      {
        title: "Sult ut rekken",
        text: "Sett t_max til 60 og senk N til 20. Sammenlign banen med den for N = 500. Den grove versjonen lager fortsatt løkker nær origo i de riktige høydene, men formen nær den øvre enden av sporet glir ut. Nøyaktighet for store t krever flere ledd.",
      },
      {
        title: "To nullpunkter tett sammen",
        text: "Nullpunkt 4 og 5 ligger ved omtrent 30,42 og 32,94. Sett t_max til 34 og følg den lyseste enden av banen: Den trer seg gjennom origo to ganger rett etter hverandre, med bare en liten løkke imellom.",
      },
    ],
  },
};
