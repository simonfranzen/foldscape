import type { ExplorerGuide } from "./types";

// Numbers quoted here (rows 16 to 512 in steps of 8, default 256, the prime
// buttons 2 to 23, the 0.92 row spacing, the 11 nonzero palette colours)
// match app/pascalmod/explorer/page.tsx; update both together.
const ROWS_EXCERPT = `let prev = new Uint8Array(1);
prev[0] = 1;
for (let n = 0; n < maxRow; n++) {
  const len = n + 1;
  for (let k = 0; k < len; k++) {
    const r = prev[k];
    if (r !== 0) {
      const x = offsetX + (maxRow - n) * (cellSize / 2) + k * cellSize;
      const y = offsetY + n * cellSize * 0.92;
      ctx.fillStyle = colourFor(r);
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
  const next = new Uint8Array(len + 1);
  next[0] = 1 % modulus;
  next[len] = 1 % modulus;
  for (let k = 0; k < len - 1; k++) next[k + 1] = (prev[k] + prev[k + 1]) % modulus;
  prev = next;
}`;

// The six later locales share the Lucas formula; en and de keep their inline copy.
const LUCAS_FORMULA =
  "\\binom{n}{k} \\equiv \\prod_{i} \\binom{n_i}{k_i} \\pmod p, \\qquad n = \\sum_i n_i p^i,\\; k = \\sum_i k_i p^i";

export const PASCALMOD_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Colour Pascal's triangle modulo a prime and watch Sierpiński gaskets appear. Explore Lucas's and Kummer's theorems with up to 512 rows, live in the browser.",
    heading: "How this explorer works",
    intro:
      "Every small square on the canvas is one binomial coefficient C(n, k), the number in row n and position k of Pascal's triangle. Instead of writing the number down, the explorer only keeps its remainder after division by a prime p and paints that remainder as a colour. Remainder zero, meaning p divides the number, is left blank. What remains is not noise but a nested pattern of triangles inside triangles: for p = 2 it is the Sierpiński gasket, for other primes a gasket with p(p + 1)/2 copies of itself instead of three.",
    sections: [
      {
        heading: "One addition rule, read modulo p",
        paragraphs: [
          "Pascal's triangle is built by a single rule: each entry is the sum of the two entries above it, with ones along both edges. The numbers grow very fast (the middle of row 511, the last one you can draw, has more than 150 digits), but remainders behave well under addition. If you only care about C(n, k) mod p, you can apply the same rule to the remainders and never touch a large number at all.",
          "Why the blank regions form triangles is explained by Lucas's theorem. Write n and k in base p, with digits n_i and k_i. Then C(n, k) mod p is simply the product of the small coefficients C(n_i, k_i), digit by digit. A factor is zero exactly when some digit of k is larger than the corresponding digit of n. For p = 2 this gives a famous shortcut: C(n, k) is odd exactly when every binary 1 of k also appears in n.",
        ],
        formula:
          "\\binom{n}{k} \\equiv \\prod_{i} \\binom{n_i}{k_i} \\pmod p, \\qquad n = \\sum_i n_i p^i,\\; k = \\sum_i k_i p^i",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The modulus buttons choose the prime p from 2, 3, 5, 7, 11, 13, 17, 19 and 23; the explorer starts at p = 2. The overlay names the result: «Sierpiński» for p = 2, otherwise «p-gasket». The rows slider runs from 16 to 512 in steps of 8 and starts at 256. More rows mean smaller cells and deeper levels of the fractal; the triangle always scales to fit the canvas.",
          "The residue legend in the sidebar shows which colour stands for which remainder from 0 to p − 1. There are eleven distinct colours for nonzero remainders, so from p = 13 upward the colours start to repeat. The blank, though, is never reused: a nonzero remainder can never be painted as background, so every gap you see really is a multiple of p.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The whole picture is computed on a 2D canvas in one pass. The code keeps only the previous row, as a Uint8Array of remainders, and builds the next row from it with the addition rule taken mod p. Since p is at most 23, any sum of two remainders fits comfortably into a byte. Memory therefore grows with the row length, not with the size of the triangle, and with 512 rows the loop visits about 131,000 cells.",
          "Each nonzero cell becomes one filled square. Row n is shifted right by half a cell per missing entry, which centres the triangle, and rows are placed 0.92 cell heights apart, so the triangle is slightly flatter than it is wide. The canvas is sized in device pixels, so the cells stay crisp on high-density screens. There is no animation at all: the picture is redrawn only when you change p or the row count, or when a ResizeObserver reports a new canvas size. That also means there is nothing to slow down for reduced-motion settings.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Counting carries: Kummer's view",
        paragraphs: [
          "The sidebar hint names Lucas's theorem. Kummer's theorem looks at the same pattern from another angle. It says that the exponent of p in C(n, k) equals the number of carries when you add k and n − k in base p. So a cell is blank exactly when that addition produces at least one carry, and coloured exactly when it does not.",
          "From either theorem you can count the coloured cells. The first p^m rows contain exactly (p(p + 1)/2)^m entries not divisible by p, because each level of the pattern consists of p(p + 1)/2 smaller copies. That gives the fractal a dimension of log(p(p + 1)/2) / log p: about 1.585 for p = 2, about 1.631 for p = 3 and about 1.683 for p = 5. The larger the prime, the closer the dimension gets to 2 and the more the triangle looks filled in.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A full row, then an empty one",
        text: "Keep p = 2 and 256 rows. The bottom row is row 255, and 255 is 11111111 in binary, so every entry is odd and the row is solid. Raise the slider to 264: row 256 appears, and it is blank except for its two ends, because 256 is a single 1 followed by zeros.",
      },
      {
        title: "Exactly one gasket of 343",
        text: "Pick p = 7 and set the rows to 344. The first 343 rows (7 cubed) form one complete level-three gasket, and the extra row underneath, row 343, shows only its two corner cells. Every coloured row segment inside follows the base-7 digits of its row number.",
      },
      {
        title: "Read the alternating row",
        text: "Choose p = 5 with 16 rows and compare row 4 with the legend. Its entries 1, 4, 6, 4, 1 become 1, 4, 1, 4, 1 mod 5: in general row p − 1 alternates between 1 and p − 1, because C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Watch the gaps shrink",
        text: "With 512 rows, step through p = 2, 3, 5, 11 and 23. The blank triangles become rarer and the coloured area grows, just as the dimension formula predicts. At p = 23 the basic block is 23 rows tall, so 512 rows are not even enough to finish the second level of the pattern: that would take 23 × 23 = 529 rows.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Pascalsche Dreieck modulo einer Primzahl einfärben und Sierpiński-Dreiecke entstehen sehen. Mit bis zu 512 Zeilen die Sätze von Lucas und Kummer erkunden.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jedes kleine Quadrat auf dem Canvas ist ein Binomialkoeffizient C(n, k), also die Zahl in Zeile n an Position k des Pascalschen Dreiecks. Statt die Zahl hinzuschreiben, merkt sich der Explorer nur ihren Rest bei Division durch eine Primzahl p und malt diesen Rest als Farbe. Rest null, also «p teilt die Zahl», bleibt leer. Übrig bleibt kein Rauschen, sondern ein verschachteltes Muster aus Dreiecken in Dreiecken: Für p = 2 ist es das Sierpiński-Dreieck, für andere Primzahlen ein Sieb mit p(p + 1)/2 Kopien seiner selbst statt drei.",
    sections: [
      {
        heading: "Eine Additionsregel, modulo p gelesen",
        paragraphs: [
          "Das Pascalsche Dreieck entsteht aus einer einzigen Regel: Jeder Eintrag ist die Summe der beiden darüber, an beiden Rändern stehen Einsen. Die Zahlen wachsen rasant (die Mitte von Zeile 511, der letzten, die du zeichnen kannst, hat mehr als 150 Stellen), aber Reste vertragen sich gut mit Addition. Interessiert dich nur C(n, k) mod p, kannst du dieselbe Regel direkt auf die Reste anwenden und musst nie eine große Zahl anfassen.",
          "Warum die leeren Bereiche Dreiecke bilden, erklärt der Satz von Lucas. Schreib n und k zur Basis p, mit den Ziffern n_i und k_i. Dann ist C(n, k) mod p einfach das Produkt der kleinen Koeffizienten C(n_i, k_i), Ziffer für Ziffer. Ein Faktor ist genau dann null, wenn eine Ziffer von k größer ist als die passende Ziffer von n. Für p = 2 ergibt das eine bekannte Abkürzung: C(n, k) ist genau dann ungerade, wenn jede binäre 1 von k auch in n vorkommt.",
        ],
        formula:
          "\\binom{n}{k} \\equiv \\prod_{i} \\binom{n_i}{k_i} \\pmod p, \\qquad n = \\sum_i n_i p^i,\\; k = \\sum_i k_i p^i",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Modulus-Knöpfe wählen die Primzahl p aus 2, 3, 5, 7, 11, 13, 17, 19 und 23; der Explorer startet bei p = 2. Das Overlay benennt das Ergebnis: «Sierpiński» für p = 2, sonst «p-gasket». Der Zeilen-Regler reicht von 16 bis 512 in Achterschritten und startet bei 256. Mehr Zeilen bedeuten kleinere Zellen und tiefere Ebenen des Fraktals; das Dreieck passt sich immer an das Canvas an.",
          "Die Rest-Legende in der Seitenleiste zeigt, welche Farbe für welchen Rest von 0 bis p − 1 steht. Für Reste ungleich null gibt es elf verschiedene Farben, ab p = 13 wiederholen sie sich also. Das Leere wird dagegen nie wiederverwendet: Ein Rest ungleich null kann nie als Hintergrund gemalt werden, jede Lücke ist also wirklich ein Vielfaches von p.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Das ganze Bild wird in einem Durchgang auf einem 2D-Canvas berechnet. Der Code hält nur die vorige Zeile als Uint8Array von Resten und baut daraus mit der Additionsregel mod p die nächste. Weil p höchstens 23 ist, passt die Summe zweier Reste bequem in ein Byte. Der Speicher wächst also mit der Zeilenlänge, nicht mit der Größe des Dreiecks, und bei 512 Zeilen besucht die Schleife rund 131.000 Zellen.",
          "Jede Zelle ungleich null wird zu einem gefüllten Quadrat. Zeile n rückt pro fehlendem Eintrag eine halbe Zelle nach rechts, das zentriert das Dreieck, und die Zeilen liegen 0,92 Zellhöhen auseinander, sodass das Dreieck etwas flacher als breit ist. Das Canvas wird in Gerätepixeln dimensioniert, die Zellen bleiben also auch auf hochauflösenden Displays scharf. Eine Animation gibt es gar nicht: Das Bild wird nur neu gezeichnet, wenn du p oder die Zeilenzahl änderst oder ein ResizeObserver eine neue Canvas-Größe meldet. Für reduzierte Bewegung muss deshalb auch nichts gebremst werden.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Überträge zählen: Kummers Blick",
        paragraphs: [
          "Der Hinweis in der Seitenleiste nennt den Satz von Lucas. Der Satz von Kummer betrachtet dasselbe Muster von einer anderen Seite. Er besagt, dass der Exponent von p in C(n, k) gleich der Anzahl der Überträge ist, wenn du k und n − k zur Basis p addierst. Eine Zelle ist also genau dann leer, wenn diese Addition mindestens einen Übertrag erzeugt, und genau dann farbig, wenn nicht.",
          "Aus beiden Sätzen lassen sich die farbigen Zellen zählen. Die ersten p^m Zeilen enthalten genau (p(p + 1)/2)^m Einträge, die nicht durch p teilbar sind, denn jede Ebene des Musters besteht aus p(p + 1)/2 kleineren Kopien. Daraus folgt eine fraktale Dimension von log(p(p + 1)/2) / log p: etwa 1,585 für p = 2, etwa 1,631 für p = 3 und etwa 1,683 für p = 5. Je größer die Primzahl, desto näher rückt die Dimension an 2 und desto gefüllter wirkt das Dreieck.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine volle Zeile, dann eine leere",
        text: "Bleib bei p = 2 und 256 Zeilen. Die unterste Zeile ist Zeile 255, und 255 ist binär 11111111, also ist jeder Eintrag ungerade und die Zeile durchgehend gefüllt. Schieb den Regler auf 264: Zeile 256 erscheint und ist bis auf ihre beiden Enden leer, weil 256 binär eine einzelne 1 mit lauter Nullen ist.",
      },
      {
        title: "Genau ein Sieb aus 343 Zeilen",
        text: "Wähle p = 7 und stell 344 Zeilen ein. Die ersten 343 Zeilen (7 hoch 3) bilden ein vollständiges Sieb dritter Stufe, und die zusätzliche Zeile darunter, Zeile 343, zeigt nur ihre beiden Eckzellen. Jedes farbige Stück einer Zeile folgt den Ziffern ihrer Zeilennummer zur Basis 7.",
      },
      {
        title: "Die alternierende Zeile lesen",
        text: "Nimm p = 5 mit 16 Zeilen und vergleiche Zeile 4 mit der Legende. Ihre Einträge 1, 4, 6, 4, 1 werden mod 5 zu 1, 4, 1, 4, 1. Allgemein wechselt Zeile p − 1 zwischen 1 und p − 1, denn C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Die Lücken schrumpfen sehen",
        text: "Geh bei 512 Zeilen nacheinander p = 2, 3, 5, 11 und 23 durch. Die leeren Dreiecke werden seltener und die farbige Fläche wächst, genau wie die Dimensionsformel es vorhersagt. Bei p = 23 ist der Grundblock 23 Zeilen hoch, 512 Zeilen reichen also nicht einmal für die zweite Stufe des Musters: Dafür bräuchte es 23 × 23 = 529 Zeilen.",
      },
    ],
  },
  es: {
    metaDescription:
      "Colorea el triángulo de Pascal módulo un primo y mira surgir triángulos de Sierpiński. Explora los teoremas de Lucas y Kummer con hasta 512 filas.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada cuadradito del lienzo es un coeficiente binomial C(n, k), el número situado en la fila n y la posición k del triángulo de Pascal. En lugar de escribir el número, el explorador solo conserva su resto al dividirlo entre un primo p y pinta ese resto como un color. El resto cero, es decir, cuando p divide al número, se deja en blanco. Lo que queda no es ruido, sino un patrón anidado de triángulos dentro de triángulos: para p = 2 es el triángulo de Sierpiński, para otros primos un tamiz con p(p + 1)/2 copias de sí mismo en lugar de tres.",
    sections: [
      {
        heading: "Una sola regla de suma, leída módulo p",
        paragraphs: [
          "El triángulo de Pascal se construye con una única regla: cada entrada es la suma de las dos que tiene encima, con unos en ambos bordes. Los números crecen muy deprisa (el centro de la fila 511, la última que puedes dibujar, tiene más de 150 cifras), pero los restos se llevan bien con la suma. Si solo te interesa C(n, k) mod p, puedes aplicar la misma regla a los restos y no tocar jamás un número grande.",
          "Por qué las zonas en blanco forman triángulos lo explica el teorema de Lucas. Escribe n y k en base p, con cifras n_i y k_i. Entonces C(n, k) mod p es simplemente el producto de los pequeños coeficientes C(n_i, k_i), cifra a cifra. Un factor vale cero exactamente cuando alguna cifra de k es mayor que la cifra correspondiente de n. Para p = 2 esto da un atajo famoso: C(n, k) es impar exactamente cuando cada 1 binario de k aparece también en n.",
        ],
        formula: LUCAS_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los botones de «Módulo p» eligen el primo p entre 2, 3, 5, 7, 11, 13, 17, 19 y 23; el explorador empieza en p = 2. El rótulo superpuesto nombra el resultado: «Sierpiński» para p = 2 y «p-gasket» en los demás casos. El deslizador «Filas» va de 16 a 512 en pasos de 8 y empieza en 256. Más filas significan celdas más pequeñas y niveles más profundos del fractal; el triángulo siempre se escala para caber en el lienzo.",
          "La «Leyenda de residuos» de la barra lateral muestra qué color corresponde a cada resto de 0 a p − 1. Hay once colores distintos para los restos no nulos, así que a partir de p = 13 los colores empiezan a repetirse. El blanco, en cambio, nunca se reutiliza: un resto no nulo jamás puede pintarse como fondo, de modo que cada hueco que ves es de verdad un múltiplo de p.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Toda la imagen se calcula en un canvas 2D de una sola pasada. El código solo guarda la fila anterior, como un Uint8Array de restos, y a partir de ella construye la siguiente con la regla de suma tomada mod p. Como p vale como mucho 23, cualquier suma de dos restos cabe de sobra en un byte. La memoria crece por tanto con la longitud de la fila, no con el tamaño del triángulo, y con 512 filas el bucle recorre unas 131 000 celdas.",
          "Cada celda no nula se convierte en un cuadrado relleno. La fila n se desplaza media celda a la derecha por cada entrada que le falta, lo que centra el triángulo, y las filas se colocan a 0,92 alturas de celda de distancia, de modo que el triángulo es algo más plano que ancho. El canvas se dimensiona en píxeles del dispositivo, así que las celdas se ven nítidas en pantallas de alta densidad. No hay ninguna animación: la imagen solo se vuelve a dibujar cuando cambias p o el número de filas, o cuando un ResizeObserver comunica un nuevo tamaño del canvas. Eso significa también que no hay nada que frenar cuando el sistema pide movimiento reducido.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Contar acarreos: la mirada de Kummer",
        paragraphs: [
          "La pista de la barra lateral menciona el teorema de Lucas. El teorema de Kummer mira el mismo patrón desde otro ángulo. Dice que el exponente de p en C(n, k) es igual al número de acarreos que se producen al sumar k y n − k en base p. Así, una celda queda en blanco exactamente cuando esa suma produce al menos un acarreo, y coloreada exactamente cuando no produce ninguno.",
          "Con cualquiera de los dos teoremas puedes contar las celdas coloreadas. Las primeras p^m filas contienen exactamente (p(p + 1)/2)^m entradas no divisibles por p, porque cada nivel del patrón consta de p(p + 1)/2 copias más pequeñas. Eso da al fractal una dimensión de log(p(p + 1)/2) / log p: aproximadamente 1,585 para p = 2, 1,631 para p = 3 y 1,683 para p = 5. Cuanto mayor es el primo, más se acerca la dimensión a 2 y más relleno parece el triángulo.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Una fila llena y después una vacía",
        text: "Mantén p = 2 y 256 filas. La fila inferior es la 255, y 255 se escribe 11111111 en binario, así que todas las entradas son impares y la fila queda completamente llena. Sube el deslizador a 264: aparece la fila 256, en blanco salvo en sus dos extremos, porque 256 es un único 1 seguido de ceros.",
      },
      {
        title: "Exactamente un tamiz de 343 filas",
        text: "Elige p = 7 y pon 344 filas. Las primeras 343 filas (7 al cubo) forman un tamiz completo de nivel tres, y la fila adicional de debajo, la 343, solo muestra sus dos celdas de las esquinas. Cada tramo coloreado de una fila sigue las cifras en base 7 de su número de fila.",
      },
      {
        title: "Lee la fila alternante",
        text: "Elige p = 5 con 16 filas y compara la fila 4 con la leyenda. Sus entradas 1, 4, 6, 4, 1 se convierten en 1, 4, 1, 4, 1 mod 5: en general, la fila p − 1 alterna entre 1 y p − 1, porque C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Mira cómo se encogen los huecos",
        text: "Con 512 filas, recorre p = 2, 3, 5, 11 y 23. Los triángulos en blanco se vuelven más escasos y la superficie coloreada crece, tal como predice la fórmula de la dimensión. Con p = 23 el bloque básico mide 23 filas de alto, así que 512 filas ni siquiera bastan para completar el segundo nivel del patrón: harían falta 23 × 23 = 529 filas.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Colorie le triangle de Pascal modulo un nombre premier et vois surgir des triangles de Sierpiński. Explore les théorèmes de Lucas et de Kummer sur 512 lignes.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque petit carré du canevas est un coefficient binomial C(n, k), le nombre situé à la ligne n et à la position k du triangle de Pascal. Au lieu d'écrire ce nombre, l'explorateur ne garde que son reste dans la division par un nombre premier p et peint ce reste sous forme de couleur. Le reste zéro, c'est-à-dire le cas où p divise le nombre, reste vide. Ce qui subsiste n'est pas du bruit, mais un motif emboîté de triangles dans des triangles : pour p = 2, c'est le triangle de Sierpiński, pour les autres nombres premiers un tamis fait de p(p + 1)/2 copies de lui-même au lieu de trois.",
    sections: [
      {
        heading: "Une seule règle d'addition, lue modulo p",
        paragraphs: [
          "Le triangle de Pascal se construit avec une règle unique : chaque entrée est la somme des deux entrées placées au-dessus, avec des 1 le long des deux bords. Les nombres grandissent très vite (le milieu de la ligne 511, la dernière que tu peux dessiner, compte plus de 150 chiffres), mais les restes se comportent bien vis-à-vis de l'addition. Si seul C(n, k) mod p t'intéresse, tu peux appliquer la même règle aux restes et ne jamais manipuler un grand nombre.",
          "Pourquoi les zones vides forment des triangles, c'est le théorème de Lucas qui l'explique. Écris n et k en base p, avec les chiffres n_i et k_i. Alors C(n, k) mod p est simplement le produit des petits coefficients C(n_i, k_i), chiffre par chiffre. Un facteur vaut zéro exactement quand un chiffre de k est plus grand que le chiffre correspondant de n. Pour p = 2, on obtient un raccourci célèbre : C(n, k) est impair exactement quand chaque 1 binaire de k apparaît aussi dans n.",
        ],
        formula: LUCAS_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les boutons « Module p » choisissent le nombre premier p parmi 2, 3, 5, 7, 11, 13, 17, 19 et 23 ; l'explorateur démarre à p = 2. L'incrustation nomme le résultat : « Sierpiński » pour p = 2, « p-gasket » sinon. Le curseur « Lignes » va de 16 à 512 par pas de 8 et démarre à 256. Plus de lignes, ce sont des cellules plus petites et des niveaux plus profonds de la fractale ; le triangle est toujours mis à l'échelle pour tenir dans le canevas.",
          "La « Légende des résidus », dans la barre latérale, indique quelle couleur correspond à quel reste de 0 à p − 1. Il existe onze couleurs distinctes pour les restes non nuls, si bien qu'à partir de p = 13 les couleurs commencent à se répéter. Le vide, lui, n'est jamais réutilisé : un reste non nul ne peut jamais être peint comme le fond, donc chaque trou que tu vois est réellement un multiple de p.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Toute l'image est calculée sur un canvas 2D en une seule passe. Le code ne conserve que la ligne précédente, sous forme d'un Uint8Array de restes, et construit la suivante à partir d'elle avec la règle d'addition prise mod p. Comme p vaut au plus 23, toute somme de deux restes tient largement dans un octet. La mémoire croît donc avec la longueur de la ligne, pas avec la taille du triangle, et avec 512 lignes la boucle parcourt environ 131 000 cellules.",
          "Chaque cellule non nulle devient un carré plein. La ligne n est décalée vers la droite d'une demi-cellule par entrée manquante, ce qui centre le triangle, et les lignes sont espacées de 0,92 hauteur de cellule, de sorte que le triangle est un peu plus plat que large. Le canvas est dimensionné en pixels physiques, les cellules restent donc nettes sur les écrans à haute densité. Il n'y a aucune animation : l'image n'est redessinée que lorsque tu changes p ou le nombre de lignes, ou lorsqu'un ResizeObserver signale une nouvelle taille du canvas. Il n'y a donc rien non plus à ralentir quand le système demande de réduire les animations.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Compter les retenues : le regard de Kummer",
        paragraphs: [
          "L'indication de la barre latérale cite le théorème de Lucas. Le théorème de Kummer observe le même motif sous un autre angle. Il affirme que l'exposant de p dans C(n, k) est égal au nombre de retenues produites quand on additionne k et n − k en base p. Une cellule est donc vide exactement quand cette addition produit au moins une retenue, et colorée exactement quand elle n'en produit aucune.",
          "Chacun des deux théorèmes permet de compter les cellules colorées. Les p^m premières lignes contiennent exactement (p(p + 1)/2)^m entrées non divisibles par p, car chaque niveau du motif se compose de p(p + 1)/2 copies plus petites. La fractale a donc pour dimension log(p(p + 1)/2) / log p : environ 1,585 pour p = 2, environ 1,631 pour p = 3 et environ 1,683 pour p = 5. Plus le nombre premier est grand, plus la dimension s'approche de 2 et plus le triangle paraît rempli.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Une ligne pleine, puis une ligne vide",
        text: "Garde p = 2 et 256 lignes. La ligne du bas est la ligne 255, et 255 s'écrit 11111111 en binaire : toutes les entrées sont impaires et la ligne est pleine. Monte le curseur à 264 : la ligne 256 apparaît, vide à l'exception de ses deux extrémités, parce que 256 est un unique 1 suivi de zéros.",
      },
      {
        title: "Exactement un tamis de 343 lignes",
        text: "Choisis p = 7 et règle le nombre de lignes sur 344. Les 343 premières lignes (7 au cube) forment un tamis complet de niveau trois, et la ligne supplémentaire en dessous, la ligne 343, ne montre que ses deux cellules d'angle. Chaque segment coloré d'une ligne suit les chiffres en base 7 de son numéro de ligne.",
      },
      {
        title: "Lire la ligne alternée",
        text: "Prends p = 5 avec 16 lignes et compare la ligne 4 à la légende. Ses entrées 1, 4, 6, 4, 1 deviennent 1, 4, 1, 4, 1 mod 5 : en général, la ligne p − 1 alterne entre 1 et p − 1, car C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Regarder les trous rétrécir",
        text: "Avec 512 lignes, passe en revue p = 2, 3, 5, 11 et 23. Les triangles vides se raréfient et la surface colorée grandit, exactement comme le prédit la formule de la dimension. Pour p = 23, le bloc de base fait 23 lignes de haut, et 512 lignes ne suffisent même pas à terminer le deuxième niveau du motif : il en faudrait 23 × 23 = 529.",
      },
    ],
  },
  it: {
    metaDescription:
      "Colora il triangolo di Tartaglia (o di Pascal) modulo un primo e guarda nascere i triangoli di Sierpiński. Teoremi di Lucas e Kummer, fino a 512 righe.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni quadratino della tela è un coefficiente binomiale C(n, k), il numero che sta nella riga n e nella posizione k del triangolo di Pascal. Invece di scrivere il numero, l'esploratore ne conserva solo il resto della divisione per un primo p e dipinge quel resto come un colore. Il resto zero, cioè il caso in cui p divide il numero, rimane vuoto. Quello che resta non è rumore, ma un motivo annidato di triangoli dentro triangoli: per p = 2 è il triangolo di Sierpiński, per gli altri primi un setaccio con p(p + 1)/2 copie di sé stesso invece di tre.",
    sections: [
      {
        heading: "Una sola regola di somma, letta modulo p",
        paragraphs: [
          "Il triangolo di Pascal si costruisce con un'unica regola: ogni elemento è la somma dei due che gli stanno sopra, con degli 1 lungo entrambi i bordi. I numeri crescono molto in fretta (il centro della riga 511, l'ultima che puoi disegnare, ha più di 150 cifre), ma i resti si comportano bene rispetto alla somma. Se ti interessa soltanto C(n, k) mod p, puoi applicare la stessa regola ai resti e non toccare mai un numero grande.",
          "Perché le zone vuote formino dei triangoli lo spiega il teorema di Lucas. Scrivi n e k in base p, con cifre n_i e k_i. Allora C(n, k) mod p è semplicemente il prodotto dei piccoli coefficienti C(n_i, k_i), cifra per cifra. Un fattore vale zero esattamente quando una cifra di k è maggiore della cifra corrispondente di n. Per p = 2 ne viene una scorciatoia famosa: C(n, k) è dispari esattamente quando ogni 1 binario di k compare anche in n.",
        ],
        formula: LUCAS_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I pulsanti «Modulo p» scelgono il primo p tra 2, 3, 5, 7, 11, 13, 17, 19 e 23; l'esploratore parte da p = 2. La scritta in sovrimpressione dà un nome al risultato: «Sierpiński» per p = 2, altrimenti «p-gasket». Il cursore «Righe» va da 16 a 512 a passi di 8 e parte da 256. Più righe significano celle più piccole e livelli più profondi del frattale; il triangolo viene sempre scalato per stare nella tela.",
          "La «Legenda dei resti» nella barra laterale mostra quale colore corrisponde a quale resto da 0 a p − 1. Per i resti non nulli ci sono undici colori distinti, quindi da p = 13 in su i colori cominciano a ripetersi. Il vuoto, invece, non viene mai riutilizzato: un resto non nullo non può mai essere dipinto come lo sfondo, perciò ogni buco che vedi è davvero un multiplo di p.",
        ],
      },
      {
        heading: "Come è costruito",
        paragraphs: [
          "L'intera immagine viene calcolata su un canvas 2D in un solo passaggio. Il codice tiene in memoria soltanto la riga precedente, come Uint8Array di resti, e da quella costruisce la successiva con la regola di somma presa mod p. Poiché p vale al massimo 23, qualsiasi somma di due resti sta comodamente in un byte. La memoria cresce quindi con la lunghezza della riga, non con la grandezza del triangolo, e con 512 righe il ciclo visita circa 131.000 celle.",
          "Ogni cella non nulla diventa un quadrato pieno. La riga n viene spostata a destra di mezza cella per ogni elemento mancante, il che centra il triangolo, e le righe distano 0,92 altezze di cella l'una dall'altra, così il triangolo risulta leggermente più schiacciato che largo. Il canvas è dimensionato in pixel del dispositivo, quindi le celle restano nitide sugli schermi ad alta densità. Non c'è alcuna animazione: l'immagine viene ridisegnata solo quando cambi p o il numero di righe, oppure quando un ResizeObserver segnala una nuova dimensione del canvas. Di conseguenza non c'è nulla da rallentare nemmeno quando il sistema chiede di ridurre il movimento.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Contare i riporti: lo sguardo di Kummer",
        paragraphs: [
          "Il suggerimento nella barra laterale cita il teorema di Lucas. Il teorema di Kummer guarda lo stesso motivo da un'altra angolazione. Afferma che l'esponente di p in C(n, k) è uguale al numero di riporti che si hanno sommando k e n − k in base p. Una cella è quindi vuota esattamente quando quella somma produce almeno un riporto, e colorata esattamente quando non ne produce nessuno.",
          "Con l'uno o con l'altro teorema puoi contare le celle colorate. Le prime p^m righe contengono esattamente (p(p + 1)/2)^m elementi non divisibili per p, perché ogni livello del motivo è fatto di p(p + 1)/2 copie più piccole. Questo dà al frattale una dimensione pari a log(p(p + 1)/2) / log p: circa 1,585 per p = 2, circa 1,631 per p = 3 e circa 1,683 per p = 5. Più grande è il primo, più la dimensione si avvicina a 2 e più il triangolo sembra pieno.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Una riga piena, poi una vuota",
        text: "Tieni p = 2 e 256 righe. La riga più in basso è la 255, e 255 in binario si scrive 11111111, quindi ogni elemento è dispari e la riga è tutta piena. Porta il cursore a 264: compare la riga 256, vuota tranne che alle due estremità, perché 256 è un solo 1 seguito da zeri.",
      },
      {
        title: "Esattamente un setaccio di 343 righe",
        text: "Scegli p = 7 e imposta 344 righe. Le prime 343 righe (7 al cubo) formano un setaccio completo di terzo livello, e la riga in più lì sotto, la 343, mostra soltanto le sue due celle d'angolo. Ogni tratto colorato di una riga segue le cifre in base 7 del suo numero di riga.",
      },
      {
        title: "Leggi la riga alternata",
        text: "Scegli p = 5 con 16 righe e confronta la riga 4 con la legenda. I suoi elementi 1, 4, 6, 4, 1 diventano 1, 4, 1, 4, 1 mod 5: in generale la riga p − 1 alterna 1 e p − 1, perché C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Guarda i buchi restringersi",
        text: "Con 512 righe, passa in rassegna p = 2, 3, 5, 11 e 23. I triangoli vuoti si fanno più rari e l'area colorata cresce, proprio come prevede la formula della dimensione. Con p = 23 il blocco di base è alto 23 righe, quindi 512 righe non bastano nemmeno a completare il secondo livello del motivo: ne servirebbero 23 × 23 = 529.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Pinta o triângulo de Pascal módulo um primo e vê surgir triângulos de Sierpiński. Explora os teoremas de Lucas e de Kummer com até 512 linhas, no browser.",
    heading: "Como funciona este explorador",
    intro:
      "Cada quadradinho da tela é um coeficiente binomial C(n, k), o número que está na linha n e na posição k do triângulo de Pascal. Em vez de escrever o número, o explorador guarda apenas o seu resto na divisão por um primo p e pinta esse resto como uma cor. O resto zero, ou seja, quando p divide o número, fica em branco. O que sobra não é ruído, mas um padrão encaixado de triângulos dentro de triângulos: para p = 2 é o triângulo de Sierpiński, para outros primos um peneiro com p(p + 1)/2 cópias de si mesmo em vez de três.",
    sections: [
      {
        heading: "Uma só regra de adição, lida módulo p",
        paragraphs: [
          "O triângulo de Pascal constrói-se com uma única regra: cada entrada é a soma das duas que estão por cima, com uns ao longo das duas margens. Os números crescem muito depressa (o meio da linha 511, a última que podes desenhar, tem mais de 150 algarismos), mas os restos dão-se bem com a adição. Se só te interessa C(n, k) mod p, podes aplicar a mesma regra aos restos e nunca tocar num número grande.",
          "A razão pela qual as zonas em branco formam triângulos é explicada pelo teorema de Lucas. Escreve n e k na base p, com algarismos n_i e k_i. Então C(n, k) mod p é simplesmente o produto dos pequenos coeficientes C(n_i, k_i), algarismo a algarismo. Um fator é zero exatamente quando algum algarismo de k é maior do que o algarismo correspondente de n. Para p = 2 isto dá um atalho famoso: C(n, k) é ímpar exatamente quando cada 1 binário de k aparece também em n.",
        ],
        formula: LUCAS_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Os botões «Módulo p» escolhem o primo p entre 2, 3, 5, 7, 11, 13, 17, 19 e 23; o explorador começa em p = 2. A legenda sobreposta dá nome ao resultado: «Sierpiński» para p = 2, «p-gasket» nos restantes casos. O cursor «Linhas» vai de 16 a 512 em passos de 8 e começa em 256. Mais linhas significam células mais pequenas e níveis mais profundos do fractal; o triângulo é sempre redimensionado para caber na tela.",
          "A «Legenda de resíduos» na barra lateral mostra que cor corresponde a cada resto de 0 a p − 1. Há onze cores distintas para os restos não nulos, por isso a partir de p = 13 as cores começam a repetir-se. Já o branco nunca é reutilizado: um resto não nulo nunca pode ser pintado como fundo, de modo que cada buraco que vês é mesmo um múltiplo de p.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Toda a imagem é calculada num canvas 2D numa única passagem. O código guarda apenas a linha anterior, como um Uint8Array de restos, e a partir dela constrói a seguinte com a regra de adição tomada mod p. Como p é no máximo 23, qualquer soma de dois restos cabe à vontade num byte. A memória cresce, portanto, com o comprimento da linha e não com o tamanho do triângulo, e com 512 linhas o ciclo percorre cerca de 131 000 células.",
          "Cada célula não nula torna-se um quadrado preenchido. A linha n é deslocada meia célula para a direita por cada entrada em falta, o que centra o triângulo, e as linhas ficam a 0,92 alturas de célula umas das outras, pelo que o triângulo é ligeiramente mais achatado do que largo. O canvas é dimensionado em píxeis do dispositivo, por isso as células mantêm-se nítidas em ecrãs de alta densidade. Não há qualquer animação: a imagem só é redesenhada quando mudas p ou o número de linhas, ou quando um ResizeObserver comunica um novo tamanho do canvas. Isso significa também que não há nada para abrandar quando o sistema pede movimento reduzido.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Contar transportes: o olhar de Kummer",
        paragraphs: [
          "A dica na barra lateral refere o teorema de Lucas. O teorema de Kummer olha para o mesmo padrão de outro ângulo. Diz que o expoente de p em C(n, k) é igual ao número de transportes que ocorrem ao somar k e n − k na base p. Assim, uma célula fica em branco exatamente quando essa soma produz pelo menos um transporte, e colorida exatamente quando não produz nenhum.",
          "Com qualquer um dos dois teoremas podes contar as células coloridas. As primeiras p^m linhas contêm exatamente (p(p + 1)/2)^m entradas não divisíveis por p, porque cada nível do padrão é formado por p(p + 1)/2 cópias mais pequenas. Isso dá ao fractal uma dimensão de log(p(p + 1)/2) / log p: cerca de 1,585 para p = 2, cerca de 1,631 para p = 3 e cerca de 1,683 para p = 5. Quanto maior o primo, mais a dimensão se aproxima de 2 e mais preenchido parece o triângulo.",
        ],
      },
    ],
    experimentsHeading: "Experimenta",
    experiments: [
      {
        title: "Uma linha cheia, depois uma vazia",
        text: "Mantém p = 2 e 256 linhas. A linha de baixo é a linha 255, e 255 escreve-se 11111111 em binário, por isso todas as entradas são ímpares e a linha fica toda preenchida. Sobe o cursor para 264: aparece a linha 256, em branco exceto nas duas pontas, porque 256 é um único 1 seguido de zeros.",
      },
      {
        title: "Exatamente um peneiro de 343 linhas",
        text: "Escolhe p = 7 e define 344 linhas. As primeiras 343 linhas (7 ao cubo) formam um peneiro completo de nível três, e a linha extra por baixo, a linha 343, mostra apenas as suas duas células de canto. Cada troço colorido de uma linha segue os algarismos na base 7 do seu número de linha.",
      },
      {
        title: "Lê a linha alternada",
        text: "Escolhe p = 5 com 16 linhas e compara a linha 4 com a legenda. As suas entradas 1, 4, 6, 4, 1 passam a 1, 4, 1, 4, 1 mod 5: em geral, a linha p − 1 alterna entre 1 e p − 1, porque C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Vê os buracos encolher",
        text: "Com 512 linhas, percorre p = 2, 3, 5, 11 e 23. Os triângulos em branco tornam-se mais raros e a área colorida cresce, tal como prevê a fórmula da dimensão. Com p = 23 o bloco básico tem 23 linhas de altura, por isso 512 linhas nem sequer chegam para completar o segundo nível do padrão: seriam precisas 23 × 23 = 529 linhas.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Färglägg Pascals triangel modulo ett primtal och se Sierpińskitrianglar växa fram. Utforska Lucas och Kummers satser med upp till 512 rader, i webbläsaren.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje liten kvadrat på ytan är en binomialkoefficient C(n, k), talet på rad n och plats k i Pascals triangel. I stället för att skriva ut talet behåller utforskaren bara dess rest vid division med ett primtal p och målar den resten som en färg. Rest noll, alltså att p delar talet, lämnas tom. Det som blir kvar är inget brus utan ett mönster av trianglar inuti trianglar: för p = 2 är det Sierpińskitriangeln, för andra primtal en sil med p(p + 1)/2 kopior av sig själv i stället för tre.",
    sections: [
      {
        heading: "En enda additionsregel, läst modulo p",
        paragraphs: [
          "Pascals triangel byggs med en enda regel: varje tal är summan av de två talen ovanför, med ettor längs båda kanterna. Talen växer mycket snabbt (mitten av rad 511, den sista du kan rita, har fler än 150 siffror), men rester fungerar bra ihop med addition. Om du bara bryr dig om C(n, k) mod p kan du tillämpa samma regel på resterna och behöver aldrig röra ett stort tal.",
          "Varför de tomma områdena bildar trianglar förklaras av Lucas sats. Skriv n och k i basen p, med siffrorna n_i och k_i. Då är C(n, k) mod p helt enkelt produkten av de små koefficienterna C(n_i, k_i), siffra för siffra. En faktor är noll precis när någon siffra i k är större än motsvarande siffra i n. För p = 2 ger det en berömd genväg: C(n, k) är udda precis när varje binär etta i k också finns i n.",
        ],
        formula: LUCAS_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Knapparna under ”Modul p” väljer primtalet p bland 2, 3, 5, 7, 11, 13, 17, 19 och 23; utforskaren börjar på p = 2. Texten ovanpå bilden namnger resultatet: ”Sierpiński” för p = 2, annars ”p-gasket”. Reglaget ”Rader” går från 16 till 512 i steg om 8 och börjar på 256. Fler rader betyder mindre celler och djupare nivåer av fraktalen; triangeln skalas alltid så att den ryms på ytan.",
          "”Restförklaring” i sidofältet visar vilken färg som står för vilken rest från 0 till p − 1. Det finns elva olika färger för rester skilda från noll, så från p = 13 och uppåt börjar färgerna upprepas. Det tomma återanvänds däremot aldrig: en rest skild från noll kan aldrig målas som bakgrund, så varje lucka du ser är verkligen en multipel av p.",
        ],
      },
      {
        heading: "Så är den byggd",
        paragraphs: [
          "Hela bilden beräknas på en 2D-canvas i ett enda svep. Koden sparar bara föregående rad, som en Uint8Array med rester, och bygger nästa rad utifrån den med additionsregeln räknad mod p. Eftersom p är högst 23 ryms varje summa av två rester gott och väl i en byte. Minnet växer därför med radens längd, inte med triangelns storlek, och med 512 rader besöker slingan omkring 131 000 celler.",
          "Varje cell skild från noll blir en fylld kvadrat. Rad n skjuts en halv cell åt höger för varje tal som saknas, vilket centrerar triangeln, och raderna ligger 0,92 cellhöjder från varandra, så triangeln är något plattare än den är bred. Canvasen dimensioneras i enhetspixlar, så cellerna förblir skarpa på högupplösta skärmar. Det finns ingen animation alls: bilden ritas om bara när du ändrar p eller antalet rader, eller när en ResizeObserver rapporterar en ny canvasstorlek. Det betyder också att det inte finns något att bromsa när systemet ber om minskad rörelse.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Räkna minnessiffror: Kummers perspektiv",
        paragraphs: [
          "Tipset i sidofältet nämner Lucas sats. Kummers sats ser samma mönster ur en annan vinkel. Den säger att exponenten för p i C(n, k) är lika med antalet minnessiffror när du adderar k och n − k i basen p. En cell är alltså tom precis när den additionen ger minst en minnessiffra, och färgad precis när den inte ger någon.",
          "Med vilken som helst av satserna kan du räkna de färgade cellerna. De första p^m raderna innehåller exakt (p(p + 1)/2)^m tal som inte är delbara med p, eftersom varje nivå i mönstret består av p(p + 1)/2 mindre kopior. Det ger fraktalen dimensionen log(p(p + 1)/2) / log p: ungefär 1,585 för p = 2, ungefär 1,631 för p = 3 och ungefär 1,683 för p = 5. Ju större primtalet är, desto närmare 2 kommer dimensionen och desto mer ifylld ser triangeln ut.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "En full rad, sedan en tom",
        text: "Behåll p = 2 och 256 rader. Den nedersta raden är rad 255, och 255 är 11111111 binärt, så varje tal är udda och raden är helt fylld. Dra reglaget till 264: rad 256 dyker upp, och den är tom utom i sina två ändar, eftersom 256 är en enda etta följd av nollor.",
      },
      {
        title: "Exakt en sil på 343 rader",
        text: "Välj p = 7 och ställ in 344 rader. De första 343 raderna (7 upphöjt till 3) bildar en komplett sil på nivå tre, och den extra raden under, rad 343, visar bara sina två hörnceller. Varje färgat stycke av en rad följer siffrorna i radnumret skrivet i basen 7.",
      },
      {
        title: "Läs den alternerande raden",
        text: "Välj p = 5 med 16 rader och jämför rad 4 med förklaringen. Dess tal 1, 4, 6, 4, 1 blir 1, 4, 1, 4, 1 mod 5: i allmänhet växlar rad p − 1 mellan 1 och p − 1, eftersom C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Se luckorna krympa",
        text: "Stega med 512 rader igenom p = 2, 3, 5, 11 och 23. De tomma trianglarna blir färre och den färgade ytan växer, precis som dimensionsformeln förutsäger. Vid p = 23 är grundblocket 23 rader högt, så 512 rader räcker inte ens för att göra klart mönstrets andra nivå: det skulle kräva 23 × 23 = 529 rader.",
      },
    ],
  },
  no: {
    metaDescription:
      "Fargelegg Pascals trekant modulo et primtall og se Sierpiński-trekanter vokse fram. Utforsk Lucas' og Kummers teoremer med opptil 512 rader, rett i nettleseren.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver lille rute på lerretet er en binomialkoeffisient C(n, k), tallet i rad n og posisjon k i Pascals trekant. I stedet for å skrive ut tallet beholder utforskeren bare resten ved divisjon med et primtall p og maler den resten som en farge. Rest null, altså at p deler tallet, står tom. Det som blir igjen, er ikke støy, men et mønster av trekanter inni trekanter: for p = 2 er det Sierpiński-trekanten, for andre primtall en sil med p(p + 1)/2 kopier av seg selv i stedet for tre.",
    sections: [
      {
        heading: "Én addisjonsregel, lest modulo p",
        paragraphs: [
          "Pascals trekant bygges med én eneste regel: hvert tall er summen av de to tallene over, med enere langs begge kantene. Tallene vokser svært raskt (midten av rad 511, den siste du kan tegne, har mer enn 150 sifre), men rester oppfører seg pent under addisjon. Hvis du bare bryr deg om C(n, k) mod p, kan du bruke den samme regelen på restene og trenger aldri å røre et stort tall.",
          "Hvorfor de tomme områdene danner trekanter, forklares av Lucas' teorem. Skriv n og k i grunntall p, med sifrene n_i og k_i. Da er C(n, k) mod p ganske enkelt produktet av de små koeffisientene C(n_i, k_i), siffer for siffer. En faktor er null nøyaktig når et siffer i k er større enn det tilsvarende sifferet i n. For p = 2 gir det en berømt snarvei: C(n, k) er et oddetall nøyaktig når hver binære ener i k også finnes i n.",
        ],
        formula: LUCAS_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Knappene under «Modulus p» velger primtallet p blant 2, 3, 5, 7, 11, 13, 17, 19 og 23; utforskeren starter på p = 2. Teksten oppå bildet gir resultatet et navn: «Sierpiński» for p = 2, ellers «p-gasket». Glidebryteren «Rader» går fra 16 til 512 i steg på 8 og starter på 256. Flere rader betyr mindre celler og dypere nivåer av fraktalen; trekanten skaleres alltid slik at den får plass på lerretet.",
          "«Rest-forklaring» i sidefeltet viser hvilken farge som står for hvilken rest fra 0 til p − 1. Det finnes elleve ulike farger for rester forskjellig fra null, så fra p = 13 og oppover begynner fargene å gjenta seg. Det tomme blir derimot aldri gjenbrukt: en rest forskjellig fra null kan aldri males som bakgrunn, så hvert hull du ser, er virkelig et multiplum av p.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hele bildet beregnes på et 2D-canvas i ett gjennomløp. Koden tar bare vare på forrige rad, som en Uint8Array med rester, og bygger neste rad ut fra den med addisjonsregelen regnet mod p. Siden p er høyst 23, får enhver sum av to rester god plass i en byte. Minnet vokser derfor med lengden på raden, ikke med størrelsen på trekanten, og med 512 rader besøker løkken omtrent 131 000 celler.",
          "Hver celle forskjellig fra null blir til en fylt rute. Rad n forskyves en halv celle mot høyre for hvert tall som mangler, noe som sentrerer trekanten, og radene ligger 0,92 cellehøyder fra hverandre, så trekanten er litt flatere enn den er bred. Canvaset dimensjoneres i enhetspiksler, så cellene holder seg skarpe på skjermer med høy pikseltetthet. Det finnes ingen animasjon i det hele tatt: bildet tegnes på nytt bare når du endrer p eller antall rader, eller når en ResizeObserver melder om en ny canvasstørrelse. Det betyr også at det ikke er noe å bremse når systemet ber om redusert bevegelse.",
        ],
        code: ROWS_EXCERPT,
      },
      {
        heading: "Å telle menteoverføringer: Kummers blikk",
        paragraphs: [
          "Hintet i sidefeltet nevner Lucas' teorem. Kummers teorem ser det samme mønsteret fra en annen kant. Det sier at eksponenten til p i C(n, k) er lik antall menteoverføringer når du adderer k og n − k i grunntall p. En celle er altså tom nøyaktig når den addisjonen gir minst én menteoverføring, og farget nøyaktig når den ikke gir noen.",
          "Med hvilket som helst av de to teoremene kan du telle de fargede cellene. De første p^m radene inneholder nøyaktig (p(p + 1)/2)^m tall som ikke er delelige med p, fordi hvert nivå i mønsteret består av p(p + 1)/2 mindre kopier. Det gir fraktalen dimensjonen log(p(p + 1)/2) / log p: omtrent 1,585 for p = 2, omtrent 1,631 for p = 3 og omtrent 1,683 for p = 5. Jo større primtallet er, desto nærmere 2 kommer dimensjonen, og desto mer utfylt ser trekanten ut.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "En full rad, så en tom",
        text: "Behold p = 2 og 256 rader. Den nederste raden er rad 255, og 255 er 11111111 binært, så hvert tall er et oddetall og raden er helt fylt. Dra glidebryteren til 264: rad 256 dukker opp, og den er tom bortsett fra de to endene, fordi 256 er en enkelt ener fulgt av nuller.",
      },
      {
        title: "Nøyaktig én sil på 343 rader",
        text: "Velg p = 7 og still inn 344 rader. De første 343 radene (7 i tredje) danner en komplett sil på nivå tre, og den ekstra raden under, rad 343, viser bare de to hjørnecellene sine. Hvert farget stykke av en rad følger sifrene i radnummeret skrevet i grunntall 7.",
      },
      {
        title: "Les den alternerende raden",
        text: "Velg p = 5 med 16 rader og sammenlign rad 4 med forklaringen. Tallene 1, 4, 6, 4, 1 blir til 1, 4, 1, 4, 1 mod 5: generelt veksler rad p − 1 mellom 1 og p − 1, fordi C(p − 1, k) ≡ (−1)^k mod p.",
      },
      {
        title: "Se hullene krympe",
        text: "Gå med 512 rader gjennom p = 2, 3, 5, 11 og 23. De tomme trekantene blir sjeldnere og det fargede arealet vokser, akkurat slik dimensjonsformelen forutsier. Ved p = 23 er grunnblokken 23 rader høy, så 512 rader er ikke engang nok til å fullføre det andre nivået i mønsteret: det ville kreve 23 × 23 = 529 rader.",
      },
    ],
  },
};
