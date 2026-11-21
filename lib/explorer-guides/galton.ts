import type { ExplorerGuide } from "./types";

// Numbers quoted here (rows 4 to 40, spawn 1 to 12, STEP_EVERY = 4, the
// 5000-ball reduced-motion histogram, the 20-ball overlay threshold) match
// app/galton/explorer/page.tsx; update both together.
const STEP_EXCERPT = `if (frame % STEP_EVERY === 0) {
  for (let i = 0; i < cfg.spawnRate; i++) {
    balls.push({ x: 0, y: 0, px: cx, py: top, done: false, bin: 0 });
  }
  for (const b of balls) {
    if (b.done || b.y >= rows) continue;
    const goRight = Math.random() < cfg.bias;
    b.y++;
    b.x += goRight ? 0.5 : -0.5; // offset from the centre line
    if (b.y === rows) {
      b.done = true;
      b.bin = Math.round(b.x + rows / 2); // = number of right bounces
      histRef.current[b.bin]++;
    }
  }
}`;

// Display formulas are shared by every locale, so they live here once.
const BINOMIAL_FORMULA = "P(k) = \\binom{N}{k} \\, p^{k} (1-p)^{N-k}, \\qquad k = 0, 1, \\dots, N";

export const GALTON_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "A live Galton board: change the rows and the right-bias p, watch the binomial histogram grow, and compare it with the normal curve 𝒩(Np, Np(1−p)).",
    heading: "How this explorer works",
    intro:
      "Each amber dot is a ball dropped from the top of a triangular field of pegs. At every peg it bounces left or right, and after the last row it falls into one of the bins at the bottom. No single ball is predictable, yet the pile of thousands of them grows into the same bell shape every time.",
    sections: [
      {
        heading: "Counting right bounces",
        paragraphs: [
          "Francis Galton described this device, which he called the quincunx, in his 1889 book Natural Inheritance. The mathematics behind it is a counting argument. With N rows a ball makes N independent decisions. If each one goes right with probability p, the bin a ball lands in is simply the number of right bounces k, which runs from 0 to N. So there are N + 1 bins, and the chance of landing in bin k is the binomial probability below: the number of paths with exactly k right turns, times the probability of any one of those paths.",
          "For large N this binomial shape is approximated by a normal distribution with mean Np and variance Np(1−p). That statement is the de Moivre-Laplace theorem, the oldest special case of the central limit theorem: add up many small independent effects and a bell curve appears.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Rows N sets the depth of the board, from 4 to 40 rows (default 16). More rows mean more bins and a smoother curve, but also a wider one: the standard deviation grows like the square root of N. At N = 16 and p = 0.5 the spread is exactly 2 bins; at N = 40 it is about 3.16.",
          "Spawn / step (1 to 12, default 2) is how many new balls enter at the top on each physics step. It only changes the speed at which the histogram fills, not its shape. Right-bias p (0 to 1, default 0.5) is the probability of bouncing right at every peg. At 0.5 the board is fair and the pile is symmetric around the middle bin; any other value shifts the centre to Np and makes the shape lean.",
          "The overlay checkbox draws the normal curve 𝒩(Np, Np(1−p)) in rose on top of the bars, scaled to the number of balls that have landed. It only appears once more than 20 balls are in, and it disappears at p = 0 or p = 1, where the variance is zero and every ball lands in the same bin. Changing N or p empties the histogram, so the curve is never fitted to a mixture of counts from different settings. Pause freezes the board, Clear histogram starts counting from zero.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Everything is drawn on a 2D canvas scaled for your screen's pixel density. A ball does not bounce physically; it stores its row y and a horizontal offset x from the centre line, and every step it moves down one row and half a peg spacing left or right, decided by a single call to Math.random() compared with p. When it reaches row N, its offset converts directly into a bin index, because x + N/2 equals the number of right bounces.",
          "Physics only advances on every fourth animation frame (STEP_EVERY = 4). That is deliberate: at one row per frame a ball crosses the board faster than the eye can follow, while at one row every four frames you can track an individual path. The bars are scaled relative to the tallest bin, so the histogram always uses the full height of its strip no matter how many balls have landed.",
          "If your system asks for reduced motion, no balls fall at all. Instead the histogram is filled with the exact binomial probabilities for the current N and p, multiplied by 5000 and rounded, and the board is drawn once.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "When the bell curve fails",
        paragraphs: [
          "The normal curve is an approximation, and the overlay lets you see where it breaks. With strong bias and few rows, say p = 0.1 and N = 8, the expected value is 0.8, and the binomial is lopsided: a tall bar at 0 or 1 and a short tail to the right. The Gaussian is symmetric and cannot follow that: part of its mass belongs below bin 0, where there are no bins, so on the board it is simply cut off at the left edge. A common rule of thumb is that the approximation becomes good when Np(1−p) is comfortably larger than about 9. Raising N always wins eventually, which is exactly what the central limit theorem promises.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Follow a single ball",
        text: "Set Spawn / step to 1 and Rows N to 30. Pick one ball near the top and follow it down. Its path looks aimless, and yet the histogram it contributes to is already taking the bell shape after a few hundred balls.",
      },
      {
        title: "Watch the curve sharpen",
        text: "With the overlay on and p = 0.5, compare N = 6 and N = 40. At 6 rows the rose curve only roughly matches seven chunky bars; at 40 rows the bars hug it closely, although the peak bin then holds a much smaller share of all balls.",
      },
      {
        title: "Break the approximation",
        text: "Set N = 8 and p = 0.1, then let a few hundred balls land. Most of them pile into bins 0 and 1, and the symmetric Gaussian visibly misses the skew. Now raise N to 40 and keep p = 0.1: the mean moves to 4, the variance to 3.6, and the fit improves noticeably.",
      },
    ],
  },
  de: {
    metaDescription:
      "Ein Galton-Brett live: Reihen und Rechts-Bias p verändern, das Binomial-Histogramm wachsen sehen und mit der Normalverteilung 𝒩(Np, Np(1−p)) vergleichen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jeder bernsteinfarbene Punkt ist eine Kugel, die oben in ein dreieckiges Feld aus Stiften fällt. An jedem Stift springt sie nach links oder rechts, und nach der letzten Reihe landet sie in einem der Fächer unten. Keine einzelne Kugel ist vorhersagbar, trotzdem wächst der Haufen aus Tausenden von ihnen jedes Mal zur selben Glockenform.",
    sections: [
      {
        heading: "Rechtssprünge zählen",
        paragraphs: [
          "Francis Galton beschrieb dieses Gerät, das er Quincunx nannte, 1889 in seinem Buch Natural Inheritance. Dahinter steckt ein Zählargument. Bei N Reihen trifft eine Kugel N unabhängige Entscheidungen. Geht jede davon mit Wahrscheinlichkeit p nach rechts, dann ist das Fach, in dem die Kugel landet, einfach die Anzahl k ihrer Rechtssprünge, von 0 bis N. Es gibt also N + 1 Fächer, und die Wahrscheinlichkeit für Fach k ist die Binomialwahrscheinlichkeit unten: die Zahl der Wege mit genau k Rechtsabbiegungen mal die Wahrscheinlichkeit eines solchen Weges.",
          "Für großes N wird diese Binomialform durch eine Normalverteilung mit Mittelwert Np und Varianz Np(1−p) angenähert. Das ist der Satz von de Moivre-Laplace, der älteste Spezialfall des zentralen Grenzwertsatzes: Summierst du viele kleine unabhängige Einflüsse, entsteht eine Glockenkurve.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Reihen N legt die Tiefe des Bretts fest, von 4 bis 40 Reihen (Standard 16). Mehr Reihen bedeuten mehr Fächer und eine glattere Kurve, aber auch eine breitere: Die Standardabweichung wächst mit der Wurzel aus N. Bei N = 16 und p = 0,5 beträgt die Streuung genau 2 Fächer, bei N = 40 etwa 3,16.",
          "Spawn / Schritt (1 bis 12, Standard 2) bestimmt, wie viele neue Kugeln pro Physikschritt oben einfallen. Das ändert nur, wie schnell sich das Histogramm füllt, nicht seine Form. Der Rechts-Bias p (0 bis 1, Standard 0,5) ist die Wahrscheinlichkeit, an jedem Stift nach rechts zu springen. Bei 0,5 ist das Brett fair und der Haufen symmetrisch um das mittlere Fach; jeder andere Wert verschiebt die Mitte nach Np und lässt die Form kippen.",
          "Die Checkbox für die Überlagerung zeichnet die Normalverteilung 𝒩(Np, Np(1−p)) in Rosa über die Balken, skaliert auf die Zahl der gelandeten Kugeln. Sie erscheint erst, wenn mehr als 20 Kugeln angekommen sind, und verschwindet bei p = 0 oder p = 1, denn dann ist die Varianz null und alle Kugeln landen im selben Fach. Wenn du N oder p änderst, wird das Histogramm geleert, damit die Kurve nie an eine Mischung aus verschiedenen Einstellungen angepasst wird. Pause friert das Brett ein, «Histogramm leeren» zählt von vorn.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Alles wird auf ein 2D-Canvas gezeichnet, das an die Pixeldichte deines Bildschirms angepasst ist. Eine Kugel prallt nicht physikalisch ab. Sie speichert ihre Reihe y und einen horizontalen Versatz x zur Mittellinie, und bei jedem Schritt rückt sie eine Reihe nach unten und einen halben Stiftabstand nach links oder rechts. Entschieden wird das durch einen einzigen Aufruf von Math.random(), verglichen mit p. Erreicht sie Reihe N, wird ihr Versatz direkt zum Fachindex, denn x + N/2 ist genau die Zahl der Rechtssprünge.",
          "Die Physik rückt nur in jedem vierten Animationsframe vor (STEP_EVERY = 4). Das ist Absicht: Mit einer Reihe pro Frame wäre eine Kugel schneller durch das Brett, als das Auge folgen kann, mit einer Reihe alle vier Frames kannst du einzelne Wege verfolgen. Die Balken sind relativ zum höchsten Fach skaliert, das Histogramm nutzt also immer die volle Höhe seines Streifens, egal wie viele Kugeln schon gelandet sind.",
          "Wünscht dein System reduzierte Bewegung, fällt gar keine Kugel. Stattdessen wird das Histogramm mit den exakten Binomialwahrscheinlichkeiten für das aktuelle N und p gefüllt, mal 5000 und gerundet, und das Brett einmal gezeichnet.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Wann die Glockenkurve versagt",
        paragraphs: [
          "Die Normalverteilung ist eine Näherung, und mit der Überlagerung siehst du, wo sie bricht. Bei starkem Bias und wenigen Reihen, etwa p = 0,1 und N = 8, liegt der Erwartungswert bei 0,8, und die Binomialverteilung ist schief: ein hoher Balken bei 0 oder 1 und ein kurzer Ausläufer nach rechts. Die symmetrische Gaußkurve kann dem nicht folgen: Ein Teil ihrer Masse gehört links von Fach 0 hin, wo es keine Fächer gibt, deshalb wird sie auf dem Brett am linken Rand einfach abgeschnitten. Als Faustregel gilt, dass die Näherung gut wird, wenn Np(1−p) deutlich größer als etwa 9 ist. Ein größeres N gewinnt am Ende immer, genau das verspricht der zentrale Grenzwertsatz.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Einer einzelnen Kugel folgen",
        text: "Stell Spawn / Schritt auf 1 und Reihen N auf 30. Such dir oben eine Kugel aus und verfolge sie nach unten. Ihr Weg wirkt ziellos, und doch nimmt das Histogramm, zu dem sie beiträgt, schon nach ein paar hundert Kugeln die Glockenform an.",
      },
      {
        title: "Die Kurve schärfer werden sehen",
        text: "Vergleiche mit eingeschalteter Überlagerung und p = 0,5 einmal N = 6 und N = 40. Bei 6 Reihen passt die rosa Kurve nur grob zu sieben klobigen Balken, bei 40 Reihen schmiegen sich die Balken eng an sie, auch wenn das höchste Fach dann einen viel kleineren Anteil aller Kugeln enthält.",
      },
      {
        title: "Die Näherung brechen",
        text: "Stell N = 8 und p = 0,1 ein und lass ein paar hundert Kugeln landen. Die meisten stapeln sich in den Fächern 0 und 1, und die symmetrische Gaußkurve verfehlt die Schiefe sichtbar. Erhöhe dann N auf 40 bei p = 0,1: Der Mittelwert wandert auf 4, die Varianz auf 3,6, und die Anpassung wird spürbar besser.",
      },
    ],
  },
  es: {
    metaDescription:
      "Máquina de Galton en vivo: cambia las filas y el sesgo p, mira crecer el histograma binomial y compáralo con la curva normal 𝒩(Np, Np(1−p)).",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada punto ámbar es una bola que cae desde lo alto de un campo triangular de clavos. En cada clavo rebota hacia la izquierda o hacia la derecha, y tras la última fila cae en una de las casillas de abajo. Ninguna bola es predecible por sí sola y, sin embargo, el montón de miles de ellas adopta cada vez la misma forma de campana.",
    sections: [
      {
        heading: "Contar los rebotes a la derecha",
        paragraphs: [
          "Francis Galton describió este aparato, al que llamó quincunx, en su libro Natural Inheritance de 1889. La matemática que hay detrás es un argumento de conteo. Con N filas, una bola toma N decisiones independientes. Si cada una va a la derecha con probabilidad p, la casilla en la que cae la bola es sencillamente el número k de rebotes a la derecha, que va de 0 a N. Hay por tanto N + 1 casillas, y la probabilidad de caer en la casilla k es la probabilidad binomial de abajo: el número de caminos con exactamente k giros a la derecha, multiplicado por la probabilidad de uno cualquiera de esos caminos.",
          "Para N grande, esta forma binomial se aproxima mediante una distribución normal de media Np y varianza Np(1−p). Ese enunciado es el teorema de De Moivre-Laplace, el caso particular más antiguo del teorema central del límite: suma muchos efectos pequeños e independientes y aparece una campana.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Filas N» fija la profundidad del tablero, de 4 a 40 filas (16 por defecto). Más filas significan más casillas y una curva más suave, pero también más ancha: la desviación típica crece como la raíz cuadrada de N. Con N = 16 y p = 0,5 la dispersión es exactamente de 2 casillas; con N = 40 ronda las 3,16.",
          "«Spawn / paso» (de 1 a 12, 2 por defecto) indica cuántas bolas nuevas entran por arriba en cada paso de la física. Solo cambia la velocidad a la que se llena el histograma, no su forma. «Sesgo derecha p» (de 0 a 1, 0,5 por defecto) es la probabilidad de rebotar a la derecha en cada clavo. Con 0,5 el tablero es justo y el montón es simétrico respecto a la casilla central; cualquier otro valor desplaza el centro a Np e inclina la forma.",
          "La casilla de verificación de superposición dibuja en rosa la curva normal 𝒩(Np, Np(1−p)) sobre las barras, escalada al número de bolas que han aterrizado. Solo aparece cuando han entrado más de 20 bolas, y desaparece con p = 0 o p = 1, donde la varianza es cero y todas las bolas caen en la misma casilla. Cambiar N o p vacía el histograma, de modo que la curva nunca se ajusta a una mezcla de recuentos de configuraciones distintas. «Pausa» congela el tablero y «Limpiar histograma» empieza a contar desde cero.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todo se dibuja en un lienzo 2D escalado a la densidad de píxeles de tu pantalla. Una bola no rebota físicamente: guarda su fila y y un desplazamiento horizontal x respecto a la línea central, y en cada paso baja una fila y se mueve medio espacio entre clavos a la izquierda o a la derecha, según una única llamada a Math.random() comparada con p. Cuando llega a la fila N, su desplazamiento se convierte directamente en un índice de casilla, porque x + N/2 es igual al número de rebotes a la derecha.",
          "La física solo avanza en uno de cada cuatro fotogramas de animación (STEP_EVERY = 4). Es deliberado: a una fila por fotograma, una bola cruza el tablero más rápido de lo que el ojo puede seguir, mientras que a una fila cada cuatro fotogramas puedes seguir un camino concreto. Las barras se escalan respecto a la casilla más alta, así que el histograma aprovecha siempre toda la altura de su franja, sin importar cuántas bolas hayan aterrizado.",
          "Si tu sistema pide movimiento reducido, no cae ninguna bola. En su lugar, el histograma se rellena con las probabilidades binomiales exactas para los N y p actuales, multiplicadas por 5000 y redondeadas, y el tablero se dibuja una sola vez.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Cuando la campana falla",
        paragraphs: [
          "La curva normal es una aproximación, y la superposición te deja ver dónde se rompe. Con un sesgo fuerte y pocas filas, por ejemplo p = 0,1 y N = 8, el valor esperado es 0,8 y la binomial queda descompensada: una barra alta en 0 o en 1 y una cola corta hacia la derecha. La gaussiana es simétrica y no puede seguir eso: parte de su masa corresponde a la zona por debajo de la casilla 0, donde no hay casillas, así que en el tablero simplemente queda cortada en el borde izquierdo. Una regla práctica habitual dice que la aproximación empieza a ser buena cuando Np(1−p) supera con holgura un valor de alrededor de 9. Aumentar N acaba ganando siempre, que es exactamente lo que promete el teorema central del límite.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Sigue una sola bola",
        text: "Pon «Spawn / paso» en 1 y «Filas N» en 30. Elige una bola cerca de la parte superior y síguela hacia abajo. Su camino parece no tener rumbo y, aun así, el histograma al que contribuye ya va tomando forma de campana tras unos pocos cientos de bolas.",
      },
      {
        title: "Mira cómo se afina la curva",
        text: "Con la superposición activada y p = 0,5, compara N = 6 y N = 40. Con 6 filas, la curva rosa solo encaja a grandes rasgos con siete barras toscas; con 40 filas las barras se ciñen a ella, aunque la casilla más alta contiene entonces una fracción mucho menor de todas las bolas.",
      },
      {
        title: "Rompe la aproximación",
        text: "Pon N = 8 y p = 0,1 y deja caer unos cientos de bolas. La mayoría se amontona en las casillas 0 y 1, y la gaussiana simétrica no capta la asimetría, como se ve a simple vista. Ahora sube N a 40 y mantén p = 0,1: la media pasa a 4, la varianza a 3,6 y el ajuste mejora de forma apreciable.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Une planche de Galton en direct : règle les rangées et le biais p, regarde grandir l'histogramme binomial et compare-le à la loi normale 𝒩(Np, Np(1−p)).",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque point ambré est une bille lâchée au sommet d'un champ triangulaire de clous. À chaque clou, elle rebondit à gauche ou à droite et, après la dernière rangée, elle tombe dans l'une des cases du bas. Aucune bille n'est prévisible à elle seule, et pourtant le tas formé par des milliers d'entre elles prend à chaque fois la même forme de cloche.",
    sections: [
      {
        heading: "Compter les rebonds à droite",
        paragraphs: [
          "Francis Galton a décrit cet appareil, qu'il appelait le quinconce, dans son livre Natural Inheritance paru en 1889. Les mathématiques qui se cachent derrière sont un argument de dénombrement. Avec N rangées, une bille prend N décisions indépendantes. Si chacune part à droite avec la probabilité p, la case où la bille atterrit est tout simplement le nombre k de rebonds à droite, qui va de 0 à N. Il y a donc N + 1 cases, et la chance de tomber dans la case k est la probabilité binomiale ci-dessous : le nombre de chemins comportant exactement k virages à droite, multiplié par la probabilité de l'un quelconque de ces chemins.",
          "Pour N grand, cette forme binomiale est approchée par une loi normale de moyenne Np et de variance Np(1−p). Cet énoncé est le théorème de Moivre-Laplace, le plus ancien cas particulier du théorème central limite : additionne beaucoup de petits effets indépendants et une courbe en cloche apparaît.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Rangées N » fixe la profondeur de la planche, de 4 à 40 rangées (16 par défaut). Plus de rangées, c'est plus de cases et une courbe plus lisse, mais aussi plus large : l'écart type croît comme la racine carrée de N. Pour N = 16 et p = 0,5, la dispersion vaut exactement 2 cases ; pour N = 40, elle est d'environ 3,16.",
          "« Spawn / pas » (de 1 à 12, 2 par défaut) indique combien de nouvelles billes entrent par le haut à chaque pas de la physique. Cela ne change que la vitesse à laquelle l'histogramme se remplit, pas sa forme. « Biais droite p » (de 0 à 1, 0,5 par défaut) est la probabilité de rebondir à droite à chaque clou. À 0,5, la planche est équitable et le tas est symétrique autour de la case centrale ; toute autre valeur déplace le centre vers Np et fait pencher la forme.",
          "La case à cocher de superposition trace en rose la courbe normale 𝒩(Np, Np(1−p)) par-dessus les barres, mise à l'échelle du nombre de billes déjà tombées. Elle n'apparaît qu'une fois que plus de 20 billes sont arrivées, et elle disparaît pour p = 0 ou p = 1, où la variance est nulle et où toutes les billes tombent dans la même case. Modifier N ou p vide l'histogramme, si bien que la courbe n'est jamais ajustée à un mélange de comptages issus de réglages différents. « Pause » fige la planche, « Effacer l'histogramme » reprend le comptage à zéro.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tout est dessiné sur un canevas 2D mis à l'échelle de la densité de pixels de ton écran. Une bille ne rebondit pas physiquement : elle mémorise sa rangée y et un décalage horizontal x par rapport à l'axe central, et à chaque pas elle descend d'une rangée et se déplace d'un demi-intervalle entre clous vers la gauche ou vers la droite, selon un unique appel à Math.random() comparé à p. Quand elle atteint la rangée N, son décalage se convertit directement en indice de case, car x + N/2 est égal au nombre de rebonds à droite.",
          "La physique n'avance qu'une image d'animation sur quatre (STEP_EVERY = 4). C'est voulu : à une rangée par image, une bille traverse la planche plus vite que l'œil ne peut la suivre, alors qu'à une rangée toutes les quatre images tu peux suivre un chemin précis. Les barres sont mises à l'échelle par rapport à la case la plus haute, de sorte que l'histogramme occupe toujours toute la hauteur de sa bande, quel que soit le nombre de billes tombées.",
          "Si ton système demande une réduction des animations, aucune bille ne tombe. À la place, l'histogramme est rempli avec les probabilités binomiales exactes pour les N et p courants, multipliées par 5 000 et arrondies, et la planche est dessinée une seule fois.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Quand la courbe en cloche échoue",
        paragraphs: [
          "La courbe normale est une approximation, et la superposition te montre où elle craque. Avec un biais fort et peu de rangées, disons p = 0,1 et N = 8, l'espérance vaut 0,8 et la loi binomiale est déséquilibrée : une grande barre en 0 ou en 1 et une courte queue vers la droite. La gaussienne est symétrique et ne peut pas suivre : une partie de sa masse se situe en dessous de la case 0, là où il n'y a pas de cases, et sur la planche elle est donc simplement coupée au bord gauche. Une règle empirique courante dit que l'approximation devient bonne lorsque Np(1−p) dépasse nettement 9 environ. Augmenter N finit toujours par l'emporter, et c'est exactement ce que promet le théorème central limite.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Suis une seule bille",
        text: "Règle « Spawn / pas » sur 1 et « Rangées N » sur 30. Choisis une bille près du sommet et suis-la jusqu'en bas. Son chemin semble sans but, et pourtant l'histogramme auquel elle contribue prend déjà sa forme de cloche après quelques centaines de billes.",
      },
      {
        title: "Regarde la courbe s'affiner",
        text: "Superposition activée et p = 0,5, compare N = 6 et N = 40. Avec 6 rangées, la courbe rose ne colle que grossièrement à sept barres massives ; avec 40 rangées, les barres l'épousent de près, même si la case la plus haute contient alors une part bien plus faible de l'ensemble des billes.",
      },
      {
        title: "Casse l'approximation",
        text: "Règle N = 8 et p = 0,1, puis laisse tomber quelques centaines de billes. La plupart s'entassent dans les cases 0 et 1, et la gaussienne symétrique passe visiblement à côté de l'asymétrie. Monte maintenant N à 40 en gardant p = 0,1 : la moyenne passe à 4, la variance à 3,6, et l'ajustement s'améliore nettement.",
      },
    ],
  },
  it: {
    metaDescription:
      "Una macchina di Galton dal vivo: cambia le file e il bias p, guarda crescere l'istogramma binomiale e confrontalo con la curva normale 𝒩(Np, Np(1−p)).",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni punto color ambra è una pallina lasciata cadere dalla cima di un campo triangolare di pioli. A ogni piolo rimbalza a sinistra o a destra, e dopo l'ultima fila cade in uno degli scomparti in basso. Nessuna pallina è prevedibile da sola, eppure il mucchio di migliaia di palline assume ogni volta la stessa forma a campana.",
    sections: [
      {
        heading: "Contare i rimbalzi a destra",
        paragraphs: [
          "Francis Galton descrisse questo dispositivo, che chiamava quinconce, nel suo libro Natural Inheritance del 1889. La matematica che c'è dietro è un argomento di conteggio. Con N file, una pallina prende N decisioni indipendenti. Se ciascuna va a destra con probabilità p, lo scomparto in cui la pallina finisce è semplicemente il numero k di rimbalzi a destra, che va da 0 a N. Ci sono quindi N + 1 scomparti, e la probabilità di finire nello scomparto k è la probabilità binomiale qui sotto: il numero di percorsi con esattamente k svolte a destra, moltiplicato per la probabilità di uno qualsiasi di quei percorsi.",
          "Per N grande, questa forma binomiale è approssimata da una distribuzione normale con media Np e varianza Np(1−p). Questo enunciato è il teorema di De Moivre-Laplace, il più antico caso particolare del teorema del limite centrale: somma tanti piccoli effetti indipendenti e compare una curva a campana.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«File N» imposta la profondità della tavola, da 4 a 40 file (predefinito 16). Più file significano più scomparti e una curva più liscia, ma anche più larga: la deviazione standard cresce come la radice quadrata di N. Con N = 16 e p = 0,5 la dispersione è esattamente di 2 scomparti; con N = 40 è circa 3,16.",
          "«Spawn / passo» (da 1 a 12, predefinito 2) è il numero di nuove palline che entrano dall'alto a ogni passo della fisica. Cambia soltanto la velocità con cui l'istogramma si riempie, non la sua forma. «Bias a destra p» (da 0 a 1, predefinito 0,5) è la probabilità di rimbalzare a destra a ogni piolo. A 0,5 la tavola è equa e il mucchio è simmetrico attorno allo scomparto centrale; qualsiasi altro valore sposta il centro in Np e fa pendere la forma.",
          "La casella di sovrapposizione disegna in rosa la curva normale 𝒩(Np, Np(1−p)) sopra le barre, scalata sul numero di palline atterrate. Compare solo quando sono arrivate più di 20 palline, e sparisce per p = 0 o p = 1, dove la varianza è zero e tutte le palline finiscono nello stesso scomparto. Cambiare N o p svuota l'istogramma, così la curva non viene mai adattata a un miscuglio di conteggi provenienti da impostazioni diverse. «Pausa» congela la tavola, «Pulisci istogramma» fa ripartire il conteggio da zero.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutto è disegnato su un canvas 2D scalato sulla densità di pixel del tuo schermo. Una pallina non rimbalza fisicamente: memorizza la sua fila y e uno scostamento orizzontale x dalla linea centrale, e a ogni passo scende di una fila e si sposta di mezzo intervallo tra i pioli a sinistra o a destra, in base a un'unica chiamata a Math.random() confrontata con p. Quando raggiunge la fila N, il suo scostamento si converte direttamente in un indice di scomparto, perché x + N/2 è uguale al numero di rimbalzi a destra.",
          "La fisica avanza solo ogni quattro fotogrammi dell'animazione (STEP_EVERY = 4). È voluto: a una fila per fotogramma una pallina attraversa la tavola più in fretta di quanto l'occhio riesca a seguirla, mentre a una fila ogni quattro fotogrammi puoi seguire un singolo percorso. Le barre sono scalate rispetto allo scomparto più alto, quindi l'istogramma usa sempre tutta l'altezza della sua fascia, a prescindere da quante palline sono atterrate.",
          "Se il tuo sistema richiede movimento ridotto, non cade nessuna pallina. L'istogramma viene invece riempito con le probabilità binomiali esatte per gli N e p attuali, moltiplicate per 5000 e arrotondate, e la tavola viene disegnata una volta sola.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Quando la campana fallisce",
        paragraphs: [
          "La curva normale è un'approssimazione, e la sovrapposizione ti fa vedere dove cede. Con un bias forte e poche file, diciamo p = 0,1 e N = 8, il valore atteso è 0,8 e la binomiale è sbilanciata: una barra alta in 0 o in 1 e una coda corta verso destra. La gaussiana è simmetrica e non riesce a seguirla: una parte della sua massa appartiene alla zona sotto lo scomparto 0, dove non ci sono scomparti, e sulla tavola viene quindi semplicemente tagliata al bordo sinistro. Una regola pratica diffusa dice che l'approssimazione diventa buona quando Np(1−p) è abbondantemente maggiore di circa 9. Aumentare N alla fine vince sempre, ed è esattamente ciò che promette il teorema del limite centrale.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Segui una sola pallina",
        text: "Imposta «Spawn / passo» su 1 e «File N» su 30. Scegli una pallina vicino alla cima e seguila fino in fondo. Il suo percorso sembra senza meta, eppure l'istogramma a cui contribuisce sta già prendendo la forma a campana dopo qualche centinaio di palline.",
      },
      {
        title: "Guarda la curva affinarsi",
        text: "Con la sovrapposizione attiva e p = 0,5, confronta N = 6 e N = 40. Con 6 file la curva rosa corrisponde solo grossolanamente a sette barre tozze; con 40 file le barre la seguono da vicino, anche se lo scomparto più alto contiene allora una quota molto più piccola di tutte le palline.",
      },
      {
        title: "Manda in crisi l'approssimazione",
        text: "Imposta N = 8 e p = 0,1, poi lascia atterrare qualche centinaio di palline. La maggior parte si accumula negli scomparti 0 e 1, e la gaussiana simmetrica manca visibilmente l'asimmetria. Ora porta N a 40 mantenendo p = 0,1: la media si sposta a 4, la varianza a 3,6 e l'adattamento migliora in modo evidente.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Uma tábua de Galton ao vivo: muda as filas e o viés p, vê crescer o histograma binomial e compara-o com a curva normal 𝒩(Np, Np(1−p)) sobreposta.",
    heading: "Como funciona este explorador",
    intro:
      "Cada ponto âmbar é uma bola largada do topo de um campo triangular de pregos. Em cada prego ressalta para a esquerda ou para a direita e, depois da última fila, cai numa das caixas em baixo. Nenhuma bola é previsível por si só e, no entanto, o monte de milhares delas ganha sempre a mesma forma de sino.",
    sections: [
      {
        heading: "Contar os ressaltos à direita",
        paragraphs: [
          "Francis Galton descreveu este aparelho, a que chamou quincunx, no seu livro Natural Inheritance, de 1889. A matemática por trás dele é um argumento de contagem. Com N filas, uma bola toma N decisões independentes. Se cada uma for para a direita com probabilidade p, a caixa onde a bola cai é simplesmente o número k de ressaltos à direita, que vai de 0 a N. Há portanto N + 1 caixas, e a probabilidade de cair na caixa k é a probabilidade binomial abaixo: o número de caminhos com exatamente k viragens à direita, multiplicado pela probabilidade de qualquer um desses caminhos.",
          "Para N grande, esta forma binomial é aproximada por uma distribuição normal com média Np e variância Np(1−p). Esse enunciado é o teorema de De Moivre-Laplace, o caso particular mais antigo do teorema do limite central: soma muitos efeitos pequenos e independentes e surge uma curva em sino.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Filas N» define a profundidade da tábua, de 4 a 40 filas (16 por omissão). Mais filas significam mais caixas e uma curva mais suave, mas também mais larga: o desvio padrão cresce como a raiz quadrada de N. Com N = 16 e p = 0,5 a dispersão é exatamente de 2 caixas; com N = 40 é de cerca de 3,16.",
          "«Spawn / passo» (de 1 a 12, 2 por omissão) é o número de bolas novas que entram pelo topo em cada passo da física. Só altera a velocidade a que o histograma se enche, não a sua forma. «Viés à direita p» (de 0 a 1, 0,5 por omissão) é a probabilidade de ressaltar para a direita em cada prego. Com 0,5 a tábua é justa e o monte é simétrico em torno da caixa central; qualquer outro valor desloca o centro para Np e faz a forma inclinar-se.",
          "A caixa de seleção da sobreposição desenha a rosa a curva normal 𝒩(Np, Np(1−p)) por cima das barras, à escala do número de bolas que já aterraram. Só aparece quando tiverem chegado mais de 20 bolas, e desaparece com p = 0 ou p = 1, onde a variância é zero e todas as bolas caem na mesma caixa. Alterar N ou p esvazia o histograma, pelo que a curva nunca é ajustada a uma mistura de contagens de configurações diferentes. «Pausa» congela a tábua, «Limpar histograma» recomeça a contagem do zero.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Tudo é desenhado num canvas 2D à escala da densidade de píxeis do teu ecrã. Uma bola não ressalta fisicamente: guarda a sua fila y e um desvio horizontal x em relação à linha central, e em cada passo desce uma fila e desloca-se meio espaçamento entre pregos para a esquerda ou para a direita, decidido por uma única chamada a Math.random() comparada com p. Quando chega à fila N, o seu desvio converte-se diretamente num índice de caixa, porque x + N/2 é igual ao número de ressaltos à direita.",
          "A física só avança de quatro em quatro fotogramas de animação (STEP_EVERY = 4). É propositado: a uma fila por fotograma, uma bola atravessa a tábua mais depressa do que o olho consegue acompanhar, ao passo que a uma fila a cada quatro fotogramas consegues seguir um caminho individual. As barras são escaladas em relação à caixa mais alta, por isso o histograma usa sempre toda a altura da sua faixa, independentemente de quantas bolas já aterraram.",
          "Se o teu sistema pedir movimento reduzido, não cai bola nenhuma. Em vez disso, o histograma é preenchido com as probabilidades binomiais exatas para os N e p atuais, multiplicadas por 5000 e arredondadas, e a tábua é desenhada uma única vez.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Quando a curva em sino falha",
        paragraphs: [
          "A curva normal é uma aproximação, e a sobreposição deixa-te ver onde ela cede. Com um viés forte e poucas filas, digamos p = 0,1 e N = 8, o valor esperado é 0,8 e a binomial fica desequilibrada: uma barra alta em 0 ou em 1 e uma cauda curta para a direita. A gaussiana é simétrica e não consegue acompanhar: parte da sua massa pertence à zona abaixo da caixa 0, onde não há caixas, e por isso na tábua fica simplesmente cortada na margem esquerda. Uma regra prática comum diz que a aproximação se torna boa quando Np(1−p) é folgadamente maior do que cerca de 9. Aumentar N acaba sempre por ganhar, que é exatamente o que promete o teorema do limite central.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Segue uma única bola",
        text: "Põe «Spawn / passo» em 1 e «Filas N» em 30. Escolhe uma bola perto do topo e segue-a até abaixo. O caminho dela parece sem rumo e, ainda assim, o histograma para o qual contribui já está a ganhar a forma de sino ao fim de algumas centenas de bolas.",
      },
      {
        title: "Vê a curva a afinar-se",
        text: "Com a sobreposição ligada e p = 0,5, compara N = 6 e N = 40. Com 6 filas, a curva rosa só corresponde de forma grosseira a sete barras toscas; com 40 filas as barras colam-se a ela, embora a caixa mais alta contenha então uma fração muito menor de todas as bolas.",
      },
      {
        title: "Quebra a aproximação",
        text: "Define N = 8 e p = 0,1 e deixa aterrar algumas centenas de bolas. A maioria amontoa-se nas caixas 0 e 1, e a gaussiana simétrica falha visivelmente a assimetria. Agora sobe N para 40 e mantém p = 0,1: a média passa para 4, a variância para 3,6 e o ajuste melhora de forma notória.",
      },
    ],
  },
  sv: {
    metaDescription:
      "En Galtonbräda i realtid: ändra antalet rader och högerbias p, se det binomiala histogrammet växa fram och jämför med normalkurvan 𝒩(Np, Np(1−p)).",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje bärnstensfärgad prick är en kula som släpps från toppen av ett triangulärt fält av spikar. Vid varje spik studsar den åt vänster eller höger, och efter den sista raden faller den ner i ett av facken längst ner. Ingen enskild kula går att förutsäga, men högen av tusentals kulor växer ändå till samma klockform varje gång.",
    sections: [
      {
        heading: "Att räkna högerstudsar",
        paragraphs: [
          "Francis Galton beskrev den här apparaten, som han kallade quincunx, i sin bok Natural Inheritance från 1889. Matematiken bakom är ett räkneargument. Med N rader fattar en kula N oberoende beslut. Om vart och ett går åt höger med sannolikheten p är facket som kulan hamnar i helt enkelt antalet högerstudsar k, som går från 0 till N. Det finns alltså N + 1 fack, och chansen att hamna i fack k är den binomiala sannolikheten nedan: antalet vägar med exakt k högersvängar, gånger sannolikheten för en sådan väg.",
          "För stora N approximeras den här binomiala formen av en normalfördelning med väntevärde Np och varians Np(1−p). Det påståendet är de Moivre-Laplaces sats, det äldsta specialfallet av centrala gränsvärdessatsen: lägg ihop många små oberoende effekter så uppstår en klockkurva.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Rader N” bestämmer brädans djup, från 4 till 40 rader (standard 16). Fler rader ger fler fack och en jämnare kurva, men också en bredare: standardavvikelsen växer som kvadratroten ur N. Vid N = 16 och p = 0,5 är spridningen exakt 2 fack, vid N = 40 ungefär 3,16.",
          "”Spawn / steg” (1 till 12, standard 2) är hur många nya kulor som släpps in upptill i varje fysiksteg. Det ändrar bara hur fort histogrammet fylls, inte dess form. ”Högerbias p” (0 till 1, standard 0,5) är sannolikheten att studsa åt höger vid varje spik. Vid 0,5 är brädan rättvis och högen symmetrisk kring mittfacket. Alla andra värden flyttar mitten till Np och får formen att luta.",
          "Kryssrutan för överlagring ritar normalkurvan 𝒩(Np, Np(1−p)) i rosa ovanpå staplarna, skalad efter antalet kulor som har landat. Den visas först när fler än 20 kulor har kommit ner, och den försvinner vid p = 0 eller p = 1, där variansen är noll och alla kulor hamnar i samma fack. När du ändrar N eller p töms histogrammet, så kurvan anpassas aldrig till en blandning av räkningar från olika inställningar. ”Paus” fryser brädan, ”Rensa histogram” börjar räkna från noll.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Allt ritas på en 2D-canvas som skalas efter skärmens pixeltäthet. En kula studsar inte fysikaliskt. Den lagrar sin rad y och en horisontell förskjutning x från mittlinjen, och i varje steg flyttas den en rad nedåt och ett halvt spikavstånd åt vänster eller höger, vilket avgörs av ett enda anrop till Math.random() som jämförs med p. När den når rad N omvandlas förskjutningen direkt till ett fackindex, eftersom x + N/2 är lika med antalet högerstudsar.",
          "Fysiken går bara framåt i var fjärde animationsbildruta (STEP_EVERY = 4). Det är avsiktligt: med en rad per bildruta korsar en kula brädan fortare än ögat hinner med, medan du med en rad var fjärde bildruta kan följa en enskild väg. Staplarna skalas i förhållande till det högsta facket, så histogrammet utnyttjar alltid hela höjden på sin remsa oavsett hur många kulor som har landat.",
          "Om ditt system ber om minskad rörelse faller inga kulor alls. I stället fylls histogrammet med de exakta binomiala sannolikheterna för aktuella N och p, multiplicerade med 5000 och avrundade, och brädan ritas en gång.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "När klockkurvan sviker",
        paragraphs: [
          "Normalkurvan är en approximation, och överlagringen låter dig se var den brister. Med stark bias och få rader, säg p = 0,1 och N = 8, är väntevärdet 0,8 och binomialfördelningen blir sned: en hög stapel vid 0 eller 1 och en kort svans åt höger. Gausskurvan är symmetrisk och kan inte följa med: en del av dess massa hör hemma nedanför fack 0, där det inte finns några fack, så på brädan kapas den helt enkelt vid vänsterkanten. En vanlig tumregel är att approximationen blir bra när Np(1−p) med god marginal är större än ungefär 9. Att höja N vinner alltid till slut, och det är precis vad centrala gränsvärdessatsen utlovar.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Följ en enda kula",
        text: "Ställ ”Spawn / steg” på 1 och ”Rader N” på 30. Välj en kula nära toppen och följ den nedåt. Dess väg ser planlös ut, och ändå börjar histogrammet som den bidrar till få klockform redan efter några hundra kulor.",
      },
      {
        title: "Se kurvan skärpas",
        text: "Med överlagringen på och p = 0,5, jämför N = 6 och N = 40. Vid 6 rader stämmer den rosa kurvan bara grovt med sju klumpiga staplar. Vid 40 rader följer staplarna den tätt, fast det högsta facket då rymmer en mycket mindre andel av alla kulor.",
      },
      {
        title: "Knäck approximationen",
        text: "Ställ in N = 8 och p = 0,1 och låt några hundra kulor landa. De flesta hamnar i fack 0 och 1, och den symmetriska gausskurvan missar tydligt snedheten. Höj nu N till 40 och behåll p = 0,1: väntevärdet flyttas till 4, variansen till 3,6, och anpassningen blir märkbart bättre.",
      },
    ],
  },
  no: {
    metaDescription:
      "Et Galtonbrett i sanntid: Endre antall rader og høyrebias p, se det binomiske histogrammet vokse fram og sammenlign med normalkurven 𝒩(Np, Np(1−p)).",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hver ravgule prikk er en kule som slippes fra toppen av et trekantet felt av pinner. Ved hver pinne spretter den til venstre eller høyre, og etter den siste raden faller den ned i en av båsene nederst. Ingen enkeltkule lar seg forutsi, men haugen av tusenvis av dem vokser likevel til den samme klokkeformen hver gang.",
    sections: [
      {
        heading: "Å telle sprett til høyre",
        paragraphs: [
          "Francis Galton beskrev dette apparatet, som han kalte quincunx, i boken Natural Inheritance fra 1889. Matematikken bak er et telleargument. Med N rader tar en kule N uavhengige valg. Hvis hvert av dem går til høyre med sannsynlighet p, er båsen kulen havner i ganske enkelt antallet høyresprett k, som går fra 0 til N. Det finnes altså N + 1 båser, og sjansen for å havne i bås k er den binomiske sannsynligheten nedenfor: antallet veier med nøyaktig k høyresvinger, ganger sannsynligheten for én slik vei.",
          "For store N tilnærmes denne binomiske formen av en normalfordeling med forventning Np og varians Np(1−p). Den påstanden er de Moivre-Laplaces teorem, det eldste spesialtilfellet av sentralgrenseteoremet: Legg sammen mange små uavhengige effekter, og en klokkekurve dukker opp.",
        ],
        formula: BINOMIAL_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Rader N» bestemmer dybden på brettet, fra 4 til 40 rader (standard 16). Flere rader gir flere båser og en jevnere kurve, men også en bredere: Standardavviket vokser som kvadratroten av N. Ved N = 16 og p = 0,5 er spredningen nøyaktig 2 båser, ved N = 40 omtrent 3,16.",
          "«Spawn / steg» (1 til 12, standard 2) er hvor mange nye kuler som slippes inn øverst i hvert fysikksteg. Det endrer bare hvor fort histogrammet fylles, ikke formen. «Høyrebias p» (0 til 1, standard 0,5) er sannsynligheten for å sprette til høyre ved hver pinne. Ved 0,5 er brettet rettferdig og haugen symmetrisk om den midterste båsen. Alle andre verdier flytter midten til Np og får formen til å helle.",
          "Avkrysningsboksen for overlegg tegner normalkurven 𝒩(Np, Np(1−p)) i rosa oppå søylene, skalert etter antallet kuler som har landet. Den vises først når mer enn 20 kuler er kommet ned, og den forsvinner ved p = 0 eller p = 1, der variansen er null og alle kulene havner i samme bås. Når du endrer N eller p, tømmes histogrammet, slik at kurven aldri tilpasses en blanding av tellinger fra ulike innstillinger. «Pause» fryser brettet, «Tøm histogram» starter tellingen fra null.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Alt tegnes på et 2D-lerret som skaleres etter pikseltettheten på skjermen din. En kule spretter ikke fysisk. Den lagrer raden sin y og en horisontal forskyvning x fra midtlinjen, og i hvert steg flytter den seg én rad ned og en halv pinneavstand til venstre eller høyre, avgjort av ett enkelt kall til Math.random() som sammenlignes med p. Når den når rad N, gjøres forskyvningen direkte om til en båsindeks, fordi x + N/2 er lik antallet høyresprett.",
          "Fysikken går bare videre i hvert fjerde animasjonsbilde (STEP_EVERY = 4). Det er med vilje: Med én rad per bilde krysser en kule brettet raskere enn øyet klarer å følge, mens du med én rad hvert fjerde bilde kan følge en enkelt vei. Søylene skaleres i forhold til den høyeste båsen, så histogrammet bruker alltid hele høyden av stripen sin, uansett hvor mange kuler som har landet.",
          "Hvis systemet ditt ber om redusert bevegelse, faller det ingen kuler i det hele tatt. I stedet fylles histogrammet med de eksakte binomiske sannsynlighetene for gjeldende N og p, multiplisert med 5000 og avrundet, og brettet tegnes én gang.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Når klokkekurven svikter",
        paragraphs: [
          "Normalkurven er en tilnærming, og overlegget lar deg se hvor den bryter sammen. Med sterk bias og få rader, la oss si p = 0,1 og N = 8, er forventningsverdien 0,8, og binomialfordelingen blir skjev: en høy søyle ved 0 eller 1 og en kort hale mot høyre. Gausskurven er symmetrisk og klarer ikke å følge med: En del av massen hører hjemme nedenfor bås 0, der det ikke finnes båser, så på brettet blir den rett og slett kuttet ved venstre kant. En vanlig tommelfingerregel er at tilnærmingen blir god når Np(1−p) med god margin er større enn omtrent 9. Å øke N vinner alltid til slutt, og det er nettopp det sentralgrenseteoremet lover.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Følg én enkelt kule",
        text: "Sett «Spawn / steg» til 1 og «Rader N» til 30. Velg en kule nær toppen og følg den nedover. Veien dens ser planløs ut, og likevel er histogrammet den bidrar til, allerede i ferd med å få klokkeform etter noen hundre kuler.",
      },
      {
        title: "Se kurven bli skarpere",
        text: "Med overlegget på og p = 0,5, sammenlign N = 6 og N = 40. Ved 6 rader stemmer den rosa kurven bare grovt med sju klumpete søyler. Ved 40 rader ligger søylene tett inntil den, selv om den høyeste båsen da rommer en mye mindre andel av alle kulene.",
      },
      {
        title: "Knekk tilnærmingen",
        text: "Sett N = 8 og p = 0,1, og la noen hundre kuler lande. De fleste hoper seg opp i bås 0 og 1, og den symmetriske gausskurven bommer synlig på skjevheten. Øk så N til 40 og behold p = 0,1: Forventningen flytter seg til 4, variansen til 3,6, og tilpasningen blir merkbart bedre.",
      },
    ],
  },
};
