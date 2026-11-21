import type { ExplorerGuide } from "./types";

// Numbers quoted here (depth 3 to 14, ratios n = 2 to 20, the angle slider
// 137.4° to 137.6° in steps of 0.0005°, 50 to 2000 seeds, defaults 10, 12,
// golden angle and 800) match app/phi/explorer/page.tsx; update both together.
const SUNFLOWER_EXCERPT = `const R = Math.min(W, H) / 2 - 20;      // disc radius in px
const c = R / Math.sqrt(count);          // outermost seed lands on the rim
const alpha = (angleDeg * Math.PI) / 180;

for (let n = 1; n <= count; n++) {
  const r = c * Math.sqrt(n);            // equal area per seed
  const theta = n * alpha;               // turn by α for every new seed
  const x = cx + r * Math.cos(theta);
  const y = cy + r * Math.sin(theta);
  const size = Math.max(1.2, c * 0.45);
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}`;

const PHI_FORMULA =
  "\\varphi = \\frac{1+\\sqrt5}{2}, \\qquad F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt5}, \\qquad \\frac{F_{n+1}}{F_n} \\to \\varphi";

export const PHI_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the golden ratio φ ≈ 1.618 in three views: a spiral of Fibonacci squares, Fibonacci ratios closing in on φ, and a sunflower built on the golden angle.",
    heading: "How this explorer works",
    intro:
      "The golden ratio φ = (1 + √5)/2 ≈ 1.618 turns up in three places here, each in its own panel. The spiral panel builds a rectangle out of squares whose sides are Fibonacci numbers. The ratios panel plots how fast consecutive Fibonacci numbers divide out to φ. The sunflower panel places seeds one after another, each turned by a fixed angle, and shows why one particular angle, the golden angle of about 137.5°, packs them better than any other.",
    sections: [
      {
        heading: "One number, three faces",
        paragraphs: [
          "φ is the positive solution of x² = x + 1. That single equation explains most of its tricks. Dividing by x gives φ = 1 + 1/φ, so 1/φ ≈ 0.618 has the same digits after the decimal point, and multiplying by φ gives φ² = φ + 1 ≈ 2.618. The other solution, ψ = (1 − √5)/2 ≈ −0.618, is the quiet partner that shows up in error terms.",
          "The Fibonacci numbers 1, 1, 2, 3, 5, 8, 13 obey the same rule in discrete form: each is the sum of the two before. Binet's formula below makes the link exact. Because |ψ| is smaller than 1, the ψⁿ term shrinks to nothing and Fₙ is simply the nearest whole number to φⁿ/√5. That is why the ratio of neighbours tends to φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Spiral: the depth slider chooses how many squares to draw, from 3 to 14 (default 10). The sides are F₁ to Fₙ, so the two smallest squares both have side 1 and the largest at depth 14 has side 377. Together they always form an Fₙ by Fₙ₊₁ rectangle, and the status bar prints its aspect ratio: 89/55 ≈ 1.61818182 at the default depth.",
          "Ratios: the n slider sets how many ratios Fₙ₊₁/Fₙ to plot, from 2 to 20 (default 12), against a dashed line at φ on a vertical axis from 1.0 to 2.5. The first values zigzag wildly (1, 2, 1.5, 1.667, 1.6), then the curve flattens onto the line. Odd n land below φ, even n above, and each error is about 0.382 times the previous one in size, which is ψ². By n = 20 the ratio 10946/6765 is off by less than 10⁻⁸.",
          "Sunflower: the divergence angle slider covers only 137.4° to 137.6°, in steps of 0.0005°, because everything interesting happens in that narrow window. The seed count slider goes from 50 to 2000 (default 800). The snap button restores the exact golden angle, 360°/φ² ≈ 137.5078°.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each panel is a plain 2D canvas that redraws whenever a slider moves or the panel is resized. Canvases are scaled by the device pixel ratio so lines stay crisp, and nothing animates, so there is no motion to reduce: every frame is a still picture of the current settings.",
          "The spiral is built square by square. The first square sits at the origin; each next one is attached to the growing bounding rectangle on the left, top, right and bottom in turn, spanning the full side it touches. Every square's arc is centred on the corner it shares with both neighbours, which is what makes the quarter circles meet without kinks, and the code flips arc endpoints where needed so a single path traces the whole spiral.",
          "The sunflower uses Vogel's model from 1979. Seed n sits at angle n·α and radius c·√n. The square root is the important part: the area of a disc grows with the square of its radius, so placing seeds at √n gives each one the same share of area and keeps the head evenly filled from centre to rim. The constant c is chosen so the last seed lands on the edge of the disc.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Why the golden angle wins",
        paragraphs: [
          "If the angle is a simple fraction of a full turn, say p/q, then every q-th seed lands on the same ray and the head splits into q straight spokes with empty wedges in between. Any rational fraction does this eventually; close approximations to a rational just take longer and bend the spokes into spiral arms. The best angle is the one that is hardest to approximate by fractions, and in a precise sense that is φ: its continued fraction is 1 + 1/(1 + 1/(1 + …)), all ones, the slowest converging expansion there is. Its best approximations are ratios of Fibonacci numbers, which is why real sunflowers and pine cones show 34 and 55 or 55 and 89 spirals, and not, say, 40 and 60.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Land on a fraction",
        text: "In the sunflower panel set the seed count to 2000 and drag the angle to exactly 137.5000°. That is 55/144 of a full turn, so the seeds line up into 144 straight spokes. Press snap and the spokes dissolve into an even field.",
      },
      {
        title: "Nudge off the golden angle",
        text: "Press snap, then move the slider to 137.52°, only about a hundredth of a degree away. Curved spiral arms appear, clearest near the rim, where the small error has been added up over the most seeds.",
      },
      {
        title: "Count the overshoot",
        text: "In the ratios panel set n to 6 and read the values: 1, 2, 1.5, 1.667, 1.6, 1.625. Each one crosses φ, and the distance shrinks by roughly 0.38 per step. Push n to 20 and the last points become indistinguishable from the dashed line.",
      },
      {
        title: "Grow the golden rectangle",
        text: "In the spiral panel step the depth from 3 to 14 and watch the ratio in the status bar: 1.5, 1.667, 1.6, then closer and closer to 1.6180339887. At depth 14 the rectangle is 377 by 610, and its ratio matches φ to five decimal places.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den goldenen Schnitt φ ≈ 1,618 in drei Ansichten erkunden: Spirale aus Fibonacci-Quadraten, Fibonacci-Verhältnisse auf dem Weg zu φ und eine Sonnenblume.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Der goldene Schnitt φ = (1 + √5)/2 ≈ 1,618 taucht hier an drei Stellen auf, jede in einer eigenen Ansicht. Die Spirale baut ein Rechteck aus Quadraten, deren Seiten Fibonacci-Zahlen sind. Die Verhältnisse zeigen, wie schnell sich benachbarte Fibonacci-Zahlen zu φ teilen. Die Sonnenblume setzt Samen nacheinander, jeden um einen festen Winkel gedreht, und zeigt, warum ein ganz bestimmter Winkel, der goldene Winkel von etwa 137,5°, sie besser packt als jeder andere.",
    sections: [
      {
        heading: "Eine Zahl, drei Gesichter",
        paragraphs: [
          "φ ist die positive Lösung von x² = x + 1. Diese eine Gleichung erklärt die meisten ihrer Eigenheiten. Teilt man durch x, erhält man φ = 1 + 1/φ, also hat 1/φ ≈ 0,618 dieselben Nachkommastellen. Multipliziert man mit φ, ergibt sich φ² = φ + 1 ≈ 2,618. Die andere Lösung, ψ = (1 − √5)/2 ≈ −0,618, ist die stille Partnerin, die in den Fehlertermen auftaucht.",
          "Die Fibonacci-Zahlen 1, 1, 2, 3, 5, 8, 13 gehorchen derselben Regel in diskreter Form: Jede ist die Summe der beiden vorherigen. Die Formel von Binet unten macht den Zusammenhang exakt. Weil |ψ| kleiner als 1 ist, verschwindet der Term ψⁿ, und Fₙ ist einfach die ganze Zahl, die φⁿ/√5 am nächsten liegt. Deshalb strebt das Verhältnis benachbarter Glieder gegen φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Spirale: Der Tiefenregler wählt, wie viele Quadrate gezeichnet werden, von 3 bis 14 (Standard 10). Die Seiten sind F₁ bis Fₙ, die beiden kleinsten Quadrate haben also beide die Seite 1, das größte bei Tiefe 14 die Seite 377. Zusammen bilden sie immer ein Rechteck aus Fₙ mal Fₙ₊₁, und die Statusleiste zeigt dessen Seitenverhältnis: 89/55 ≈ 1,61818182 bei der Standardtiefe.",
          "Verhältnisse: Der n-Regler legt fest, wie viele Verhältnisse Fₙ₊₁/Fₙ gezeichnet werden, von 2 bis 20 (Standard 12), vor einer gestrichelten Linie bei φ auf einer senkrechten Achse von 1,0 bis 2,5. Die ersten Werte springen wild hin und her (1, 2, 1,5, 1,667, 1,6), dann legt sich die Kurve auf die Linie. Ungerade n liegen unter φ, gerade darüber, und jeder Fehler ist ungefähr 0,382 mal so groß wie der vorige, das ist ψ². Bei n = 20 weicht 10946/6765 um weniger als 10⁻⁸ ab.",
          "Sonnenblume: Der Regler für den Divergenzwinkel reicht nur von 137,4° bis 137,6°, in Schritten von 0,0005°, weil alles Spannende in diesem schmalen Fenster passiert. Die Samenanzahl reicht von 50 bis 2000 (Standard 800). Der Snap-Knopf stellt den exakten goldenen Winkel wieder her, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jede Ansicht ist ein schlichtes 2D-Canvas, das neu zeichnet, sobald sich ein Regler bewegt oder die Größe ändert. Die Canvases sind an das Pixelverhältnis des Geräts angepasst, damit Linien scharf bleiben. Nichts ist animiert, es gibt also keine Bewegung, die man reduzieren müsste: Jedes Bild ist ein Standbild der aktuellen Einstellungen.",
          "Die Spirale entsteht Quadrat für Quadrat. Das erste liegt im Ursprung, jedes weitere wird abwechselnd links, oben, rechts und unten an das wachsende Rechteck angesetzt und überspannt die ganze Seite, an der es anliegt. Der Bogen jedes Quadrats hat seinen Mittelpunkt in der Ecke, die es mit beiden Nachbarn teilt. Dadurch treffen sich die Viertelkreise ohne Knick, und der Code vertauscht bei Bedarf Anfang und Ende der Bögen, damit ein einziger Pfad die ganze Spirale nachzeichnet.",
          "Die Sonnenblume folgt dem Modell von Vogel aus dem Jahr 1979. Samen n sitzt beim Winkel n·α und beim Radius c·√n. Entscheidend ist die Wurzel: Die Fläche einer Scheibe wächst mit dem Quadrat des Radius, also bekommt bei √n jeder Samen denselben Flächenanteil, und der Blütenkopf bleibt von der Mitte bis zum Rand gleichmäßig gefüllt. Die Konstante c ist so gewählt, dass der letzte Samen genau auf dem Rand der Scheibe landet.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Warum der goldene Winkel gewinnt",
        paragraphs: [
          "Ist der Winkel ein einfacher Bruchteil einer vollen Drehung, etwa p/q, dann landet jeder q-te Samen auf demselben Strahl, und der Kopf zerfällt in q gerade Speichen mit leeren Keilen dazwischen. Jeder rationale Bruch tut das irgendwann, gute Näherungen an einen Bruch brauchen nur länger und biegen die Speichen zu Spiralarmen. Der beste Winkel ist der, der sich am schlechtesten durch Brüche annähern lässt, und in einem präzisen Sinn ist das φ: Sein Kettenbruch ist 1 + 1/(1 + 1/(1 + …)), lauter Einsen, die am langsamsten konvergierende Entwicklung überhaupt. Seine besten Näherungen sind Verhältnisse von Fibonacci-Zahlen. Deshalb zeigen echte Sonnenblumen und Kiefernzapfen 34 und 55 oder 55 und 89 Spiralen, und nicht etwa 40 und 60.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Auf einem Bruch landen",
        text: "Stell in der Sonnenblume die Samenanzahl auf 2000 und zieh den Winkel auf genau 137,5000°. Das sind 55/144 einer vollen Drehung, die Samen reihen sich also zu 144 geraden Speichen auf. Drück auf Snap, und die Speichen lösen sich in ein gleichmäßiges Feld auf.",
      },
      {
        title: "Ein Hauch neben dem goldenen Winkel",
        text: "Drück auf Snap und schieb den Regler dann auf 137,52°, nur etwa ein hundertstel Grad daneben. Gebogene Spiralarme erscheinen, am deutlichsten am Rand, wo sich der kleine Fehler über die meisten Samen aufsummiert hat.",
      },
      {
        title: "Das Überschießen zählen",
        text: "Stell in den Verhältnissen n auf 6 und lies die Werte ab: 1, 2, 1,5, 1,667, 1,6, 1,625. Jeder Wert springt über φ hinweg, und der Abstand schrumpft pro Schritt um etwa den Faktor 0,38. Schieb n auf 20, und die letzten Punkte sind von der gestrichelten Linie nicht mehr zu unterscheiden.",
      },
      {
        title: "Das goldene Rechteck wachsen lassen",
        text: "Erhöhe in der Spirale die Tiefe schrittweise von 3 auf 14 und beobachte das Verhältnis in der Statusleiste: 1,5, 1,667, 1,6, dann immer näher an 1,6180339887. Bei Tiefe 14 misst das Rechteck 377 mal 610, und sein Verhältnis stimmt auf fünf Nachkommastellen mit φ überein.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora la razón áurea φ ≈ 1,618 en tres vistas: una espiral de cuadrados de Fibonacci, cocientes que se acercan a φ y un girasol con el ángulo áureo.",
    heading: "Cómo funciona este explorador",
    intro:
      "La razón áurea φ = (1 + √5)/2 ≈ 1,618 aparece aquí en tres lugares, cada uno con su propio panel. El panel de la espiral construye un rectángulo con cuadrados cuyos lados son números de Fibonacci. El panel de las razones muestra lo deprisa que el cociente de números de Fibonacci consecutivos se acerca a φ. El panel del girasol coloca semillas una tras otra, cada una girada un ángulo fijo, y muestra por qué un ángulo concreto, el ángulo áureo de unos 137,5°, las empaqueta mejor que cualquier otro.",
    sections: [
      {
        heading: "Un número, tres caras",
        paragraphs: [
          "φ es la solución positiva de x² = x + 1. Esa única ecuación explica casi todos sus trucos. Al dividir entre x se obtiene φ = 1 + 1/φ, de modo que 1/φ ≈ 0,618 tiene las mismas cifras decimales, y al multiplicar por φ resulta φ² = φ + 1 ≈ 2,618. La otra solución, ψ = (1 − √5)/2 ≈ −0,618, es la compañera discreta que asoma en los términos de error.",
          "Los números de Fibonacci 1, 1, 2, 3, 5, 8, 13 obedecen la misma regla en versión discreta: cada uno es la suma de los dos anteriores. La fórmula de Binet de abajo hace exacta la relación. Como |ψ| es menor que 1, el término ψⁿ se desvanece y Fₙ es sencillamente el entero más cercano a φⁿ/√5. Por eso el cociente entre vecinos tiende a φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Espiral: el deslizador de profundidad elige cuántos cuadrados se dibujan, de 3 a 14 (10 por defecto). Los lados son F₁ a Fₙ, así que los dos cuadrados más pequeños tienen lado 1 y el mayor, con profundidad 14, tiene lado 377. Juntos forman siempre un rectángulo de Fₙ por Fₙ₊₁, y la barra de estado muestra su relación de aspecto: 89/55 ≈ 1,61818182 con la profundidad por defecto.",
          "Razones: el deslizador n fija cuántos cocientes Fₙ₊₁/Fₙ se representan, de 2 a 20 (12 por defecto), frente a una línea discontinua en φ sobre un eje vertical que va de 1,0 a 2,5. Los primeros valores zigzaguean con fuerza (1; 2; 1,5; 1,667; 1,6) y después la curva se aplana sobre la línea. Los n impares quedan por debajo de φ, los pares por encima, y cada error mide unas 0,382 veces el anterior, es decir, ψ². Para n = 20, el cociente 10946/6765 se desvía menos de 10⁻⁸.",
          "Girasol: el deslizador del ángulo de divergencia solo abarca de 137,4° a 137,6°, en pasos de 0,0005°, porque todo lo interesante ocurre en esa ventana estrecha. El deslizador del número de semillas va de 50 a 2000 (800 por defecto). El botón «Ir al ángulo φ» restablece el ángulo áureo exacto, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada panel es un lienzo 2D sencillo que se redibuja cuando se mueve un deslizador o cambia el tamaño del panel. Los lienzos se escalan según la densidad de píxeles del dispositivo para que las líneas se vean nítidas, y nada está animado, así que no hay movimiento que reducir: cada imagen es una foto fija de los ajustes actuales.",
          "La espiral se construye cuadrado a cuadrado. El primero está en el origen; cada uno de los siguientes se adosa al rectángulo envolvente, que va creciendo, por la izquierda, arriba, la derecha y abajo, por turnos, y ocupa todo el lado que toca. El arco de cada cuadrado tiene su centro en la esquina que comparte con sus dos vecinos, y por eso los cuartos de círculo se unen sin quiebros. El código invierte los extremos de los arcos donde hace falta para que un solo trazado recorra toda la espiral.",
          "El girasol usa el modelo de Vogel de 1979. La semilla n está en el ángulo n·α y a un radio c·√n. La raíz cuadrada es lo importante: el área de un disco crece con el cuadrado de su radio, así que colocar las semillas en √n da a cada una la misma porción de área y mantiene la cabeza uniformemente llena del centro al borde. La constante c se elige para que la última semilla caiga justo en el borde del disco.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Por qué gana el ángulo áureo",
        paragraphs: [
          "Si el ángulo es una fracción sencilla de una vuelta completa, digamos p/q, cada q-ésima semilla cae sobre el mismo rayo y la cabeza se divide en q radios rectos con cuñas vacías entre ellos. Cualquier fracción racional acaba haciéndolo; las buenas aproximaciones a un racional solo tardan más y curvan los radios hasta convertirlos en brazos espirales. El mejor ángulo es el más difícil de aproximar con fracciones, y en un sentido preciso ese es φ: su fracción continua es 1 + 1/(1 + 1/(1 + …)), todo unos, el desarrollo que converge más despacio de todos. Sus mejores aproximaciones son cocientes de números de Fibonacci, y por eso los girasoles y las piñas reales muestran 34 y 55 o 55 y 89 espirales, y no, por ejemplo, 40 y 60.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Aterriza en una fracción",
        text: "En el panel del girasol, pon el número de semillas en 2000 y arrastra el ángulo hasta exactamente 137,5000°. Eso es 55/144 de una vuelta completa, así que las semillas se alinean en 144 radios rectos. Pulsa «Ir al ángulo φ» y los radios se disuelven en un campo uniforme.",
      },
      {
        title: "Desvíate un pelo del ángulo áureo",
        text: "Pulsa «Ir al ángulo φ» y luego mueve el deslizador hasta 137,52°, apenas una centésima de grado más allá. Aparecen brazos espirales curvos, más nítidos cerca del borde, donde el pequeño error se ha ido acumulando a lo largo de más semillas.",
      },
      {
        title: "Cuenta los vaivenes",
        text: "En el panel de las razones, pon n en 6 y lee los valores: 1; 2; 1,5; 1,667; 1,6; 1,625. Cada uno salta al otro lado de φ, y la distancia se reduce más o menos por un factor de 0,38 en cada paso. Sube n hasta 20 y los últimos puntos ya no se distinguen de la línea discontinua.",
      },
      {
        title: "Haz crecer el rectángulo áureo",
        text: "En el panel de la espiral, sube la profundidad paso a paso de 3 a 14 y observa la razón en la barra de estado: 1,5; 1,667; 1,6 y después cada vez más cerca de 1,6180339887. Con profundidad 14 el rectángulo mide 377 por 610, y su razón coincide con φ hasta la quinta cifra decimal.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore le nombre d'or φ ≈ 1,618 en trois vues : une spirale de carrés de Fibonacci, des rapports qui se resserrent sur φ et un tournesol à l'angle d'or.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le nombre d'or φ = (1 + √5)/2 ≈ 1,618 apparaît ici à trois endroits, chacun dans son propre panneau. Le panneau de la spirale construit un rectangle à partir de carrés dont les côtés sont des nombres de Fibonacci. Le panneau des rapports montre à quelle vitesse le quotient de deux nombres de Fibonacci consécutifs se rapproche de φ. Le panneau du tournesol pose des graines l'une après l'autre, chacune tournée d'un angle fixe, et montre pourquoi un angle bien précis, l'angle d'or d'environ 137,5°, les répartit mieux que tout autre.",
    sections: [
      {
        heading: "Un nombre, trois visages",
        paragraphs: [
          "φ est la solution positive de x² = x + 1. Cette seule équation explique la plupart de ses tours. En divisant par x, on obtient φ = 1 + 1/φ, si bien que 1/φ ≈ 0,618 a les mêmes chiffres après la virgule, et en multipliant par φ on trouve φ² = φ + 1 ≈ 2,618. L'autre solution, ψ = (1 − √5)/2 ≈ −0,618, est la partenaire discrète qui se manifeste dans les termes d'erreur.",
          "Les nombres de Fibonacci 1, 1, 2, 3, 5, 8, 13 obéissent à la même règle sous forme discrète : chacun est la somme des deux précédents. La formule de Binet ci-dessous rend le lien exact. Comme |ψ| est inférieur à 1, le terme ψⁿ s'évanouit et Fₙ est tout simplement l'entier le plus proche de φⁿ/√5. Voilà pourquoi le rapport de deux termes voisins tend vers φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Spirale : le curseur de profondeur choisit le nombre de carrés à dessiner, de 3 à 14 (10 par défaut). Les côtés vont de F₁ à Fₙ : les deux plus petits carrés ont donc tous deux un côté de 1, et le plus grand, à la profondeur 14, un côté de 377. Ensemble, ils forment toujours un rectangle de Fₙ sur Fₙ₊₁, et la barre d'état affiche son rapport largeur sur hauteur : 89/55 ≈ 1,61818182 à la profondeur par défaut.",
          "Rapports : le curseur n fixe le nombre de rapports Fₙ₊₁/Fₙ à tracer, de 2 à 20 (12 par défaut), face à une ligne en pointillés placée en φ sur un axe vertical allant de 1,0 à 2,5. Les premières valeurs zigzaguent fortement (1 ; 2 ; 1,5 ; 1,667 ; 1,6), puis la courbe vient s'aplatir sur la ligne. Les n impairs tombent sous φ, les n pairs au-dessus, et chaque erreur vaut environ 0,382 fois la précédente, soit ψ². À n = 20, le rapport 10946/6765 s'écarte de moins de 10⁻⁸.",
          "Tournesol : le curseur de l'angle de divergence ne couvre que l'intervalle de 137,4° à 137,6°, par pas de 0,0005°, car tout ce qui est intéressant se passe dans cette fenêtre étroite. Le curseur du nombre de graines va de 50 à 2 000 (800 par défaut). Le bouton « Aller à l'angle φ » rétablit l'angle d'or exact, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque panneau est un simple canevas 2D qui se redessine dès qu'un curseur bouge ou que le panneau change de taille. Les canevas sont mis à l'échelle selon la densité de pixels de l'appareil pour que les traits restent nets, et rien n'est animé : il n'y a donc aucun mouvement à réduire, chaque image est une vue fixe des réglages en cours.",
          "La spirale se construit carré après carré. Le premier est posé à l'origine ; chacun des suivants vient s'accoler au rectangle englobant, qui grandit, tour à tour à gauche, en haut, à droite et en bas, en couvrant tout le côté qu'il touche. L'arc de chaque carré est centré sur le coin qu'il partage avec ses deux voisins : c'est ce qui permet aux quarts de cercle de se raccorder sans cassure. Le code inverse les extrémités des arcs là où c'est nécessaire, afin qu'un seul tracé parcoure toute la spirale.",
          "Le tournesol utilise le modèle de Vogel, qui date de 1979. La graine n se trouve à l'angle n·α et au rayon c·√n. La racine carrée est l'élément essentiel : l'aire d'un disque croît comme le carré de son rayon, si bien que placer les graines en √n donne à chacune la même part de surface et garde le capitule uniformément rempli, du centre au bord. La constante c est choisie pour que la dernière graine arrive exactement sur le bord du disque.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Pourquoi l'angle d'or l'emporte",
        paragraphs: [
          "Si l'angle est une fraction simple d'un tour complet, disons p/q, alors une graine sur q tombe sur le même rayon et le capitule se divise en q rayons rectilignes séparés par des secteurs vides. Toute fraction rationnelle finit par produire cet effet ; les bonnes approximations d'un rationnel mettent seulement plus de temps et courbent les rayons en bras spiraux. Le meilleur angle est celui qui se laisse le plus mal approcher par des fractions, et en un sens précis, c'est φ : sa fraction continue est 1 + 1/(1 + 1/(1 + …)), rien que des uns, le développement qui converge le plus lentement de tous. Ses meilleures approximations sont des rapports de nombres de Fibonacci, et c'est pourquoi les vrais tournesols et les pommes de pin présentent 34 et 55 ou 55 et 89 spirales, et non, par exemple, 40 et 60.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Tombe sur une fraction",
        text: "Dans le panneau du tournesol, règle le nombre de graines sur 2 000 et fais glisser l'angle jusqu'à 137,5000° exactement. Cela représente 55/144 d'un tour complet, et les graines s'alignent donc en 144 rayons rectilignes. Appuie sur « Aller à l'angle φ » et les rayons se dissolvent en un champ régulier.",
      },
      {
        title: "Écarte-toi d'un rien de l'angle d'or",
        text: "Appuie sur « Aller à l'angle φ », puis amène le curseur sur 137,52°, à un centième de degré à peine. Des bras spiraux courbes apparaissent, surtout visibles près du bord, là où la petite erreur s'est accumulée sur le plus grand nombre de graines.",
      },
      {
        title: "Compte les dépassements",
        text: "Dans le panneau des rapports, règle n sur 6 et lis les valeurs : 1 ; 2 ; 1,5 ; 1,667 ; 1,6 ; 1,625. Chacune passe de l'autre côté de φ, et l'écart est multiplié par environ 0,38 à chaque étape. Pousse n jusqu'à 20 et les derniers points ne se distinguent plus de la ligne en pointillés.",
      },
      {
        title: "Fais grandir le rectangle d'or",
        text: "Dans le panneau de la spirale, augmente la profondeur pas à pas de 3 à 14 et observe le rapport dans la barre d'état : 1,5 ; 1,667 ; 1,6, puis de plus en plus près de 1,6180339887. À la profondeur 14, le rectangle mesure 377 sur 610, et son rapport coïncide avec φ jusqu'à la cinquième décimale.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora la sezione aurea φ ≈ 1,618 in tre viste: una spirale di quadrati di Fibonacci, rapporti che convergono a φ e un girasole basato sull'angolo aureo.",
    heading: "Come funziona questo esploratore",
    intro:
      "La sezione aurea φ = (1 + √5)/2 ≈ 1,618 compare qui in tre punti, ciascuno con il proprio pannello. Il pannello della spirale costruisce un rettangolo con quadrati i cui lati sono numeri di Fibonacci. Il pannello dei rapporti mostra quanto in fretta il quoziente di numeri di Fibonacci consecutivi si avvicina a φ. Il pannello del girasole dispone i semi uno dopo l'altro, ciascuno ruotato di un angolo fisso, e mostra perché un angolo in particolare, l'angolo aureo di circa 137,5°, li impacchetta meglio di qualunque altro.",
    sections: [
      {
        heading: "Un numero, tre volti",
        paragraphs: [
          "φ è la soluzione positiva di x² = x + 1. Questa sola equazione spiega quasi tutti i suoi trucchi. Dividendo per x si ottiene φ = 1 + 1/φ, quindi 1/φ ≈ 0,618 ha le stesse cifre dopo la virgola, e moltiplicando per φ si ha φ² = φ + 1 ≈ 2,618. L'altra soluzione, ψ = (1 − √5)/2 ≈ −0,618, è la compagna silenziosa che spunta nei termini di errore.",
          "I numeri di Fibonacci 1, 1, 2, 3, 5, 8, 13 obbediscono alla stessa regola in forma discreta: ognuno è la somma dei due precedenti. La formula di Binet qui sotto rende esatto il legame. Poiché |ψ| è minore di 1, il termine ψⁿ svanisce e Fₙ è semplicemente l'intero più vicino a φⁿ/√5. Ecco perché il rapporto tra termini vicini tende a φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Spirale: il cursore della profondità sceglie quanti quadrati disegnare, da 3 a 14 (10 per impostazione predefinita). I lati vanno da F₁ a Fₙ, quindi i due quadrati più piccoli hanno entrambi lato 1 e il più grande, a profondità 14, ha lato 377. Insieme formano sempre un rettangolo di Fₙ per Fₙ₊₁, e la barra di stato ne riporta il rapporto tra i lati: 89/55 ≈ 1,61818182 alla profondità predefinita.",
          "Rapporti: il cursore n stabilisce quanti rapporti Fₙ₊₁/Fₙ tracciare, da 2 a 20 (12 per impostazione predefinita), rispetto a una linea tratteggiata in φ su un asse verticale che va da 1,0 a 2,5. I primi valori oscillano con forza (1; 2; 1,5; 1,667; 1,6), poi la curva si appiattisce sulla linea. Gli n dispari cadono sotto φ, quelli pari sopra, e ogni errore è circa 0,382 volte il precedente, cioè ψ². Per n = 20 il rapporto 10946/6765 si discosta di meno di 10⁻⁸.",
          "Girasole: il cursore dell'angolo di divergenza copre soltanto l'intervallo da 137,4° a 137,6°, a passi di 0,0005°, perché tutto ciò che è interessante succede in quella finestra stretta. Il cursore del numero di semi va da 50 a 2000 (800 per impostazione predefinita). Il pulsante «Vai all'angolo φ» ripristina l'angolo aureo esatto, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni pannello è un semplice canvas 2D che si ridisegna ogni volta che si muove un cursore o che il pannello cambia dimensione. I canvas sono scalati in base alla densità di pixel del dispositivo, così le linee restano nitide, e nulla è animato, quindi non c'è alcun movimento da ridurre: ogni fotogramma è un'immagine fissa delle impostazioni correnti.",
          "La spirale si costruisce un quadrato alla volta. Il primo sta nell'origine; ciascuno dei successivi viene accostato al rettangolo complessivo, che via via cresce, a turno a sinistra, in alto, a destra e in basso, e copre per intero il lato che tocca. L'arco di ogni quadrato ha il centro nell'angolo che il quadrato condivide con entrambi i vicini: è questo a far combaciare i quarti di cerchio senza spigoli. Dove serve, il codice scambia gli estremi degli archi, così un unico tracciato percorre tutta la spirale.",
          "Il girasole usa il modello di Vogel del 1979. Il seme n si trova all'angolo n·α e al raggio c·√n. La radice quadrata è la parte importante: l'area di un disco cresce con il quadrato del raggio, perciò collocare i semi a √n assegna a ognuno la stessa porzione di area e mantiene il capolino riempito in modo uniforme dal centro al bordo. La costante c è scelta in modo che l'ultimo seme cada esattamente sul bordo del disco.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Perché vince l'angolo aureo",
        paragraphs: [
          "Se l'angolo è una frazione semplice di un giro completo, diciamo p/q, allora un seme ogni q finisce sullo stesso raggio e il capolino si divide in q raggi rettilinei separati da spicchi vuoti. Qualunque frazione razionale prima o poi produce questo effetto; le buone approssimazioni di un razionale ci mettono solo più tempo e piegano i raggi in bracci a spirale. L'angolo migliore è quello più difficile da approssimare con frazioni, e in un senso preciso questo è φ: la sua frazione continua è 1 + 1/(1 + 1/(1 + …)), tutti uno, lo sviluppo che converge più lentamente in assoluto. Le sue approssimazioni migliori sono rapporti di numeri di Fibonacci, ed è per questo che i girasoli e le pigne veri mostrano 34 e 55 oppure 55 e 89 spirali, e non, per esempio, 40 e 60.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Atterra su una frazione",
        text: "Nel pannello del girasole imposta il numero di semi a 2000 e trascina l'angolo esattamente su 137,5000°. Sono 55/144 di un giro completo, quindi i semi si allineano in 144 raggi rettilinei. Premi «Vai all'angolo φ» e i raggi si dissolvono in un campo uniforme.",
      },
      {
        title: "Spostati di un soffio dall'angolo aureo",
        text: "Premi «Vai all'angolo φ», poi porta il cursore su 137,52°, appena un centesimo di grado più in là. Compaiono bracci a spirale ricurvi, più evidenti vicino al bordo, dove il piccolo errore si è accumulato sul maggior numero di semi.",
      },
      {
        title: "Conta i sorpassi",
        text: "Nel pannello dei rapporti imposta n a 6 e leggi i valori: 1; 2; 1,5; 1,667; 1,6; 1,625. Ognuno scavalca φ, e la distanza si riduce di un fattore di circa 0,38 a ogni passo. Porta n a 20 e gli ultimi punti diventano indistinguibili dalla linea tratteggiata.",
      },
      {
        title: "Fai crescere il rettangolo aureo",
        text: "Nel pannello della spirale aumenta la profondità un passo alla volta da 3 a 14 e osserva il rapporto nella barra di stato: 1,5; 1,667; 1,6, poi sempre più vicino a 1,6180339887. A profondità 14 il rettangolo misura 377 per 610, e il suo rapporto coincide con φ fino alla quinta cifra decimale.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora a razão áurea φ ≈ 1,618 em três vistas: uma espiral de quadrados de Fibonacci, razões que se aproximam de φ e um girassol com o ângulo áureo.",
    heading: "Como funciona este explorador",
    intro:
      "A razão áurea φ = (1 + √5)/2 ≈ 1,618 aparece aqui em três sítios, cada um no seu próprio painel. O painel da espiral constrói um retângulo com quadrados cujos lados são números de Fibonacci. O painel das razões mostra a rapidez com que o quociente de números de Fibonacci consecutivos se aproxima de φ. O painel do girassol coloca sementes uma após outra, cada uma rodada de um ângulo fixo, e mostra porque é que um ângulo em particular, o ângulo áureo de cerca de 137,5°, as arruma melhor do que qualquer outro.",
    sections: [
      {
        heading: "Um número, três faces",
        paragraphs: [
          "φ é a solução positiva de x² = x + 1. Essa única equação explica a maior parte dos seus truques. Dividindo por x obtém-se φ = 1 + 1/φ, pelo que 1/φ ≈ 0,618 tem os mesmos algarismos depois da vírgula, e multiplicando por φ obtém-se φ² = φ + 1 ≈ 2,618. A outra solução, ψ = (1 − √5)/2 ≈ −0,618, é a parceira discreta que surge nos termos de erro.",
          "Os números de Fibonacci 1, 1, 2, 3, 5, 8, 13 obedecem à mesma regra em forma discreta: cada um é a soma dos dois anteriores. A fórmula de Binet, mais abaixo, torna a ligação exata. Como |ψ| é menor do que 1, o termo ψⁿ desaparece e Fₙ é simplesmente o inteiro mais próximo de φⁿ/√5. É por isso que a razão entre vizinhos tende para φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Espiral: o cursor de profundidade escolhe quantos quadrados são desenhados, de 3 a 14 (10 por omissão). Os lados vão de F₁ a Fₙ, por isso os dois quadrados mais pequenos têm ambos lado 1 e o maior, na profundidade 14, tem lado 377. Juntos formam sempre um retângulo de Fₙ por Fₙ₊₁, e a barra de estado mostra a razão entre os seus lados: 89/55 ≈ 1,61818182 na profundidade predefinida.",
          "Razões: o cursor n define quantas razões Fₙ₊₁/Fₙ são traçadas, de 2 a 20 (12 por omissão), contra uma linha tracejada em φ num eixo vertical que vai de 1,0 a 2,5. Os primeiros valores ziguezagueiam com força (1; 2; 1,5; 1,667; 1,6) e depois a curva assenta sobre a linha. Os n ímpares ficam abaixo de φ, os pares acima, e cada erro tem cerca de 0,382 vezes o tamanho do anterior, ou seja, ψ². Para n = 20, a razão 10946/6765 desvia-se menos de 10⁻⁸.",
          "Girassol: o cursor do ângulo de divergência cobre apenas o intervalo de 137,4° a 137,6°, em passos de 0,0005°, porque tudo o que é interessante acontece nessa janela estreita. O cursor do número de sementes vai de 50 a 2000 (800 por omissão). O botão «Ir para o ângulo φ» repõe o ângulo áureo exato, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada painel é um simples canvas 2D que se redesenha sempre que um cursor se move ou o painel muda de tamanho. Os canvas são dimensionados de acordo com a densidade de píxeis do dispositivo para que as linhas fiquem nítidas, e nada é animado, por isso não há movimento a reduzir: cada imagem é um retrato fixo das definições atuais.",
          "A espiral é construída quadrado a quadrado. O primeiro fica na origem; cada um dos seguintes é encostado ao retângulo envolvente, que vai crescendo, à vez à esquerda, em cima, à direita e em baixo, ocupando todo o lado em que toca. O arco de cada quadrado está centrado no canto que este partilha com os dois vizinhos, e é isso que faz os quartos de círculo unirem-se sem quebras. Onde é preciso, o código troca as extremidades dos arcos para que um único traçado percorra a espiral inteira.",
          "O girassol usa o modelo de Vogel, de 1979. A semente n fica no ângulo n·α e no raio c·√n. A raiz quadrada é a parte importante: a área de um disco cresce com o quadrado do raio, pelo que colocar as sementes em √n dá a cada uma a mesma fatia de área e mantém o capítulo uniformemente preenchido do centro à orla. A constante c é escolhida de modo que a última semente caia mesmo na orla do disco.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Porque é que o ângulo áureo ganha",
        paragraphs: [
          "Se o ângulo for uma fração simples de uma volta completa, digamos p/q, então de q em q sementes uma cai sobre o mesmo raio, e o capítulo divide-se em q raios retos com cunhas vazias entre eles. Qualquer fração racional acaba por fazer isto; as boas aproximações a um racional apenas demoram mais e encurvam os raios em braços espirais. O melhor ângulo é o mais difícil de aproximar por frações e, num sentido preciso, esse é φ: a sua fração contínua é 1 + 1/(1 + 1/(1 + …)), só uns, o desenvolvimento que converge mais devagar de todos. As suas melhores aproximações são razões de números de Fibonacci, e é por isso que os girassóis e as pinhas verdadeiros mostram 34 e 55 ou 55 e 89 espirais, e não, por exemplo, 40 e 60.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Aterra numa fração",
        text: "No painel do girassol, põe o número de sementes em 2000 e arrasta o ângulo até exatamente 137,5000°. Isso é 55/144 de uma volta completa, por isso as sementes alinham-se em 144 raios retos. Carrega em «Ir para o ângulo φ» e os raios dissolvem-se num campo uniforme.",
      },
      {
        title: "Desvia-te um nada do ângulo áureo",
        text: "Carrega em «Ir para o ângulo φ» e depois move o cursor para 137,52°, apenas cerca de um centésimo de grau ao lado. Surgem braços espirais curvos, mais nítidos junto à orla, onde o pequeno erro se foi somando ao longo de mais sementes.",
      },
      {
        title: "Conta as ultrapassagens",
        text: "No painel das razões, põe n em 6 e lê os valores: 1; 2; 1,5; 1,667; 1,6; 1,625. Cada um salta para o outro lado de φ, e a distância encolhe por um fator de cerca de 0,38 a cada passo. Leva n até 20 e os últimos pontos deixam de se distinguir da linha tracejada.",
      },
      {
        title: "Faz crescer o retângulo áureo",
        text: "No painel da espiral, aumenta a profundidade passo a passo de 3 até 14 e observa a razão na barra de estado: 1,5; 1,667; 1,6 e depois cada vez mais perto de 1,6180339887. Na profundidade 14 o retângulo mede 377 por 610, e a sua razão coincide com φ até à quinta casa decimal.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska gyllene snittet φ ≈ 1,618 i tre vyer: en spiral av Fibonaccikvadrater, kvoter som närmar sig φ och en solros byggd på den gyllene vinkeln.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Gyllene snittet φ = (1 + √5)/2 ≈ 1,618 dyker upp på tre ställen här, vart och ett i sin egen panel. Spiralpanelen bygger en rektangel av kvadrater vars sidor är Fibonaccital. Kvotpanelen visar hur snabbt kvoten mellan två på varandra följande Fibonaccital närmar sig φ. Solrospanelen placerar ut frön ett i taget, vart och ett vridet en fast vinkel, och visar varför en alldeles särskild vinkel, den gyllene vinkeln på ungefär 137,5°, packar dem bättre än någon annan.",
    sections: [
      {
        heading: "Ett tal, tre ansikten",
        paragraphs: [
          "φ är den positiva lösningen till x² = x + 1. Den enda ekvationen förklarar de flesta av talets konster. Dividerar man med x får man φ = 1 + 1/φ, så 1/φ ≈ 0,618 har samma decimaler, och multiplicerar man med φ får man φ² = φ + 1 ≈ 2,618. Den andra lösningen, ψ = (1 − √5)/2 ≈ −0,618, är den tysta partnern som dyker upp i feltermerna.",
          "Fibonaccitalen 1, 1, 2, 3, 5, 8, 13 lyder samma regel i diskret form: varje tal är summan av de två föregående. Binets formel nedan gör sambandet exakt. Eftersom |ψ| är mindre än 1 krymper termen ψⁿ till ingenting, och Fₙ är helt enkelt det heltal som ligger närmast φⁿ/√5. Därför går kvoten mellan grannar mot φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Spiral: djupreglaget väljer hur många kvadrater som ritas, från 3 till 14 (standard 10). Sidorna är F₁ till Fₙ, så de två minsta kvadraterna har båda sidan 1 och den största vid djup 14 har sidan 377. Tillsammans bildar de alltid en rektangel på Fₙ gånger Fₙ₊₁, och statusraden visar dess sidförhållande: 89/55 ≈ 1,61818182 vid standarddjupet.",
          "Kvoter: n-reglaget bestämmer hur många kvoter Fₙ₊₁/Fₙ som ritas, från 2 till 20 (standard 12), mot en streckad linje vid φ på en lodrät axel från 1,0 till 2,5. De första värdena hoppar vilt i sicksack (1; 2; 1,5; 1,667; 1,6), sedan planar kurvan ut mot linjen. Udda n hamnar under φ, jämna över, och varje fel är ungefär 0,382 gånger så stort som det föregående, vilket är ψ². Vid n = 20 avviker kvoten 10\u00a0946/6765 med mindre än 10⁻⁸.",
          "Solros: reglaget för divergensvinkeln täcker bara 137,4° till 137,6°, i steg om 0,0005°, eftersom allt intressant händer i det smala fönstret. Reglaget för antalet frön går från 50 till 2000 (standard 800). Knappen ”Hoppa till φ-vinkeln” återställer den exakta gyllene vinkeln, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje panel är en vanlig 2D-canvas som ritas om så fort ett reglage flyttas eller panelen ändrar storlek. Canvasytorna skalas efter enhetens pixeltäthet så att linjerna förblir skarpa, och ingenting är animerat, så det finns ingen rörelse att minska: varje bild är en stillbild av de aktuella inställningarna.",
          "Spiralen byggs kvadrat för kvadrat. Den första ligger i origo; varje ny kvadrat fogas till den växande omslutande rektangeln, i tur och ordning till vänster, upptill, till höger och nedtill, och täcker hela den sida den ligger an mot. Bågen i varje kvadrat har sitt centrum i det hörn som kvadraten delar med båda sina grannar, och det är därför kvartscirklarna möts utan knyckar. Koden byter plats på bågarnas ändpunkter där det behövs, så att en enda bana ritar hela spiralen.",
          "Solrosen använder Vogels modell från 1979. Frö n sitter vid vinkeln n·α och radien c·√n. Kvadratroten är det viktiga: arean av en cirkelskiva växer med kvadraten på radien, så när fröna placeras vid √n får vart och ett samma andel av arean och blomkorgen blir jämnt fylld från mitten till kanten. Konstanten c väljs så att det sista fröet hamnar precis på skivans rand.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Varför den gyllene vinkeln vinner",
        paragraphs: [
          "Om vinkeln är ett enkelt bråk av ett helt varv, säg p/q, hamnar vart q:te frö på samma stråle och blomkorgen delas upp i q raka ekrar med tomma kilar emellan. Varje rationellt bråk gör så förr eller senare; goda närmevärden till ett rationellt tal tar bara längre tid på sig och böjer ekrarna till spiralarmar. Den bästa vinkeln är den som är svårast att närma sig med bråk, och i en precis mening är det φ: dess kedjebråk är 1 + 1/(1 + 1/(1 + …)), bara ettor, den utveckling som konvergerar långsammast av alla. Dess bästa närmevärden är kvoter av Fibonaccital, och därför har riktiga solrosor och tallkottar 34 och 55 eller 55 och 89 spiraler, och inte till exempel 40 och 60.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Landa på ett bråk",
        text: "Ställ in antalet frön på 2000 i solrospanelen och dra vinkeln till exakt 137,5000°. Det är 55/144 av ett helt varv, så fröna radar upp sig i 144 raka ekrar. Tryck på ”Hoppa till φ-vinkeln” så löses ekrarna upp i ett jämnt fält.",
      },
      {
        title: "Knuffa dig bort från den gyllene vinkeln",
        text: "Tryck på ”Hoppa till φ-vinkeln” och flytta sedan reglaget till 137,52°, bara ungefär en hundradels grad bort. Böjda spiralarmar träder fram, tydligast nära kanten, där det lilla felet har hunnit summeras över flest frön.",
      },
      {
        title: "Räkna överslagen",
        text: "Ställ in n på 6 i kvotpanelen och läs av värdena: 1; 2; 1,5; 1,667; 1,6; 1,625. Vart och ett hoppar över till andra sidan av φ, och avståndet krymper med ungefär faktorn 0,38 för varje steg. Dra upp n till 20 så går de sista punkterna inte längre att skilja från den streckade linjen.",
      },
      {
        title: "Låt den gyllene rektangeln växa",
        text: "Stega djupet från 3 till 14 i spiralpanelen och håll ögonen på kvoten i statusraden: 1,5; 1,667; 1,6 och sedan allt närmare 1,6180339887. Vid djup 14 är rektangeln 377 gånger 610, och dess kvot stämmer med φ på fem decimaler.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk det gylne snitt φ ≈ 1,618 i tre visninger: en spiral av Fibonacci-kvadrater, forhold som nærmer seg φ, og en solsikke bygd på den gylne vinkelen.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det gylne snitt φ = (1 + √5)/2 ≈ 1,618 dukker opp tre steder her, hvert i sitt eget panel. Spiralpanelet bygger et rektangel av kvadrater der sidene er Fibonacci-tall. Forholdspanelet viser hvor raskt forholdet mellom to påfølgende Fibonacci-tall nærmer seg φ. Solsikkepanelet plasserer frø ett etter ett, hvert av dem dreid en fast vinkel, og viser hvorfor én bestemt vinkel, den gylne vinkelen på omtrent 137,5°, pakker dem bedre enn noen annen.",
    sections: [
      {
        heading: "Ett tall, tre ansikter",
        paragraphs: [
          "φ er den positive løsningen av x² = x + 1. Denne ene ligningen forklarer de fleste av triksene til tallet. Deler du på x, får du φ = 1 + 1/φ, så 1/φ ≈ 0,618 har de samme sifrene etter komma, og ganger du med φ, får du φ² = φ + 1 ≈ 2,618. Den andre løsningen, ψ = (1 − √5)/2 ≈ −0,618, er den stille partneren som dukker opp i feilleddene.",
          "Fibonacci-tallene 1, 1, 2, 3, 5, 8, 13 følger den samme regelen i diskret form: Hvert tall er summen av de to foregående. Binets formel nedenfor gjør sammenhengen eksakt. Fordi |ψ| er mindre enn 1, krymper leddet ψⁿ til ingenting, og Fₙ er ganske enkelt det hele tallet som ligger nærmest φⁿ/√5. Derfor går forholdet mellom naboer mot φ.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Spiral: Glidebryteren for dybde velger hvor mange kvadrater som tegnes, fra 3 til 14 (standard 10). Sidene er F₁ til Fₙ, så de to minste kvadratene har begge side 1, og det største ved dybde 14 har side 377. Sammen danner de alltid et rektangel på Fₙ ganger Fₙ₊₁, og statuslinjen viser sideforholdet: 89/55 ≈ 1,61818182 ved standarddybden.",
          "Forhold: Glidebryteren for n bestemmer hvor mange forhold Fₙ₊₁/Fₙ som tegnes, fra 2 til 20 (standard 12), mot en stiplet linje ved φ på en loddrett akse fra 1,0 til 2,5. De første verdiene hopper vilt i sikksakk (1; 2; 1,5; 1,667; 1,6), så flater kurven ut mot linjen. Odde n havner under φ, jevne n over, og hver feil er omtrent 0,382 ganger så stor som den forrige, altså ψ². Ved n = 20 avviker forholdet 10946/6765 med mindre enn 10⁻⁸.",
          "Solsikke: Glidebryteren for divergensvinkelen dekker bare 137,4° til 137,6°, i steg på 0,0005°, fordi alt det interessante skjer i dette smale vinduet. Glidebryteren for antall frø går fra 50 til 2000 (standard 800). Knappen «Hopp til φ-vinkelen» gjenoppretter den eksakte gylne vinkelen, 360°/φ² ≈ 137,5078°.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hvert panel er et enkelt 2D-lerret som tegnes på nytt hver gang en glidebryter flyttes eller panelet endrer størrelse. Lerretene skaleres etter enhetens pikseltetthet slik at linjene holder seg skarpe, og ingenting er animert, så det finnes ingen bevegelse å redusere: Hvert bilde er et stillbilde av de gjeldende innstillingene.",
          "Spiralen bygges kvadrat for kvadrat. Det første ligger i origo; hvert nytt kvadrat festes til det voksende omsluttende rektangelet, etter tur til venstre, øverst, til høyre og nederst, og dekker hele siden det ligger inntil. Buen i hvert kvadrat har sentrum i hjørnet som kvadratet deler med begge naboene, og det er derfor kvartsirklene møtes uten knekk. Koden bytter om endepunktene på buene der det trengs, slik at én enkelt bane tegner hele spiralen.",
          "Solsikken bruker Vogels modell fra 1979. Frø n sitter ved vinkelen n·α og radien c·√n. Kvadratroten er det viktige: Arealet av en sirkelskive vokser med kvadratet av radien, så når frøene plasseres ved √n, får hvert av dem den samme andelen av arealet, og blomsterkurven holder seg jevnt fylt fra sentrum til kanten. Konstanten c er valgt slik at det siste frøet havner akkurat på randen av skiven.",
        ],
        code: SUNFLOWER_EXCERPT,
      },
      {
        heading: "Hvorfor den gylne vinkelen vinner",
        paragraphs: [
          "Hvis vinkelen er en enkel brøkdel av en hel omdreining, la oss si p/q, havner hvert q-te frø på den samme strålen, og blomsterkurven deler seg i q rette eiker med tomme kiler imellom. Enhver rasjonal brøk gjør dette før eller siden; gode tilnærminger til et rasjonalt tall bruker bare lengre tid og bøyer eikene til spiralarmer. Den beste vinkelen er den som er vanskeligst å tilnærme med brøker, og i en presis forstand er det φ: Kjedebrøken er 1 + 1/(1 + 1/(1 + …)), bare enere, den utviklingen som konvergerer saktest av alle. De beste tilnærmingene er forhold mellom Fibonacci-tall, og derfor har ekte solsikker og furukongler 34 og 55 eller 55 og 89 spiraler, og ikke for eksempel 40 og 60.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Land på en brøk",
        text: "Sett antall frø til 2000 i solsikkepanelet og dra vinkelen til nøyaktig 137,5000°. Det er 55/144 av en hel omdreining, så frøene stiller seg opp i 144 rette eiker. Trykk på «Hopp til φ-vinkelen», og eikene løser seg opp i et jevnt felt.",
      },
      {
        title: "Dytt deg litt bort fra den gylne vinkelen",
        text: "Trykk på «Hopp til φ-vinkelen», og flytt deretter glidebryteren til 137,52°, bare omtrent en hundredels grad unna. Buede spiralarmer kommer til syne, tydeligst nær kanten, der den lille feilen har summert seg over flest frø.",
      },
      {
        title: "Tell overskytingene",
        text: "Sett n til 6 i forholdspanelet og les av verdiene: 1; 2; 1,5; 1,667; 1,6; 1,625. Hver av dem hopper over til den andre siden av φ, og avstanden krymper med omtrent faktoren 0,38 for hvert steg. Skyv n opp til 20, og de siste punktene lar seg ikke lenger skille fra den stiplede linjen.",
      },
      {
        title: "La det gylne rektangelet vokse",
        text: "Øk dybden steg for steg fra 3 til 14 i spiralpanelet og følg med på forholdet i statuslinjen: 1,5; 1,667; 1,6 og deretter stadig nærmere 1,6180339887. Ved dybde 14 måler rektangelet 377 ganger 610, og forholdet stemmer med φ på fem desimaler.",
      },
    ],
  },
};
