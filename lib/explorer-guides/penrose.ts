import type { ExplorerGuide } from "./types";

// Counts quoted here (10 seed triangles, 340 half-tiles at depth 4, 2330 at
// depth 6, the 1440 / 890 ratio) follow from the substitution rules in
// app/penrose/explorer/page.tsx; update both together.
const DEFLATE_EXCERPT = `function inflate(tris) {
  const out = [];
  for (const tr of tris) {
    if (tr.t === 0) {                       // thin half (36° apex)
      const P = add(tr.a, scale(sub(tr.b, tr.a), 1 / PHI));
      out.push({ t: 0, a: tr.c, b: P, c: tr.b });
      out.push({ t: 1, a: P, b: tr.c, c: tr.a });
    } else {                                // thick half (108° apex)
      const Q = add(tr.b, scale(sub(tr.a, tr.b), 1 / PHI));
      const R = add(tr.b, scale(sub(tr.c, tr.b), 1 / PHI));
      out.push({ t: 1, a: R, b: tr.c, c: tr.a });
      out.push({ t: 1, a: Q, b: R, c: tr.b });
      out.push({ t: 0, a: R, b: Q, c: tr.a });
    }
  }
  return out;
}`;

// Decimal-comma variant of the φ formula, shared by the locales that write 1,618.
const PHI_FORMULA =
  "\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1{,}618, \\qquad \\varphi^2 = \\varphi + 1";

// Same substitution matrix everywhere; only the two subscript labels are localized.
const substitutionFormula = (thin: string, thick: string) =>
  `\\begin{pmatrix} n_{\\text{${thin}}} \\\\ n_{\\text{${thick}}} \\end{pmatrix} \\mapsto \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} n_{\\text{${thin}}} \\\\ n_{\\text{${thick}}} \\end{pmatrix}`;

export const PENROSE_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Grow a Penrose tiling by deflation: thick and thin rhombi, Robinson triangles, and a thick to thin ratio that converges to the golden ratio φ as you go deeper.",
    heading: "How this explorer works",
    intro:
      "The pattern on the canvas is a Penrose rhombus tiling, often called P3. It uses only two tiles, a thick rhombus and a thin one, both with the same edge length. Together they can cover the entire plane, but never periodically: there is no way to shift the whole pattern so that it lands on itself. The explorer starts from a small ring of triangles and repeatedly cuts every triangle into smaller ones according to a fixed rule, and the tiling grows out of that subdivision.",
    sections: [
      {
        heading: "Two rhombi, two triangles",
        paragraphs: [
          "The thick rhombus has angles of 72° and 108°, the thin one 36° and 144°. Cut each in half along its axis of symmetry and you get the two Robinson triangles the code actually works with. Halving the thin rhombus along its short diagonal gives a triangle with a 36° apex and two 72° base angles. Halving the thick rhombus along its long diagonal gives a triangle with a 108° apex and two 36° base angles. In both, the two equal sides are rhombus edges, and in both, the ratio between the long and the short side is the golden ratio φ.",
          "Roger Penrose found aperiodic tile sets of this kind in the 1970s. Without extra rules the two rhombi could also tile periodically, so the true Penrose tiling comes with matching rules on the edges that forbid every periodic arrangement. Subdivision sidesteps the problem: every tiling produced by repeatedly deflating the triangles automatically obeys those rules.",
        ],
        formula:
          "\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.618, \\qquad \\varphi^2 = \\varphi + 1",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Deflation depth runs from 0 to 6 and starts at 4. Depth 0 is the seed: ten thin half triangles with their apex at the centre, together forming a decagon. Every step replaces each thin half by two smaller triangles and each thick half by three, all scaled down by a factor of φ, so the whole disc stays the same size while the tiles get smaller. The total number of half triangles goes 10, 20, 50, 130, 340, 890, 2330, growing by roughly φ² ≈ 2.618 per step.",
          "Seed rotation turns the starting decagon from 0° to 360°. The seed alternates the orientation of neighbouring triangles, so it has fivefold symmetry, and rotating by 72° gives exactly the same picture. The mode buttons switch between Rhombi, where mirrored half triangles are glued back into full rhombi (thick violet, thin rose), and Half-triangles, which shows the same subdivision one level lower (thick halves violet, thin halves amber). The display toggles hide outlines or colours. The centre button resets the rotation to 0°.",
          "Matching markers draws small arrowheads on two opposite sides of every rhombus, amber for thick and cyan for thin, with one single and one double head each. They are a simplified visual hint at the idea of edge decorations, not a complete set of Penrose matching rules.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Every half triangle is stored as three complex numbers A, B, C plus a type flag: 0 for the thin half, 1 for the thick half. A is always the apex between the two equal sides. Deflation needs nothing but points that divide an edge in the golden ratio, which is what the expression A + (B − A) / φ computes.",
          "To show rhombi, the code pairs up triangles that share their base B C. It keys each triangle by the midpoint of B C rounded to six decimals, and when two triangles of the same type meet on the same key it forms the rhombus with the fourth vertex B + C − A, the reflection of the apex across the base. Halves left over at the rim of the disc are reflected the same way, so the boundary looks clean, which is why the rhombus counter is slightly more than half the triangle count.",
          "Drawing uses a 2D canvas scaled so the unit disc fills about 95 percent of the shorter side (minus a small margin), followed by a soft radial vignette. Nothing is animated: the canvas redraws only when you change a control or resize the window, so the page behaves the same with reduced motion enabled.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Where the golden ratio comes from",
        paragraphs: [
          "Count what one step does. A thin half becomes one thin and one thick half; a thick half becomes one thin and two thick halves. Starting from ten thin halves, the counts are ten times consecutive Fibonacci numbers: 10 and 0, then 10 and 10, 20 and 30, 50 and 80, and so on. The ratio of thick to thin therefore approaches φ: (1, φ) is the direction of the dominant eigenvector of the substitution matrix, whose eigenvalue is φ². Because φ is irrational, no repeating block of tiles could ever produce this ratio, which gives a neat argument for why the tiling cannot be periodic.",
        ],
        formula:
          "\\begin{pmatrix} n_{\\text{thin}} \\\\ n_{\\text{thick}} \\end{pmatrix} \\mapsto \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} n_{\\text{thin}} \\\\ n_{\\text{thick}} \\end{pmatrix}",
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch the ratio converge",
        text: "Switch to Half-triangles and step the depth from 1 to 6. The ratio reads 1, 1.5, 1.6, 1.6154, 1.6176 and finally 1.6180 at depth 6, where there are 1440 thick and 890 thin halves.",
      },
      {
        title: "Find the fivefold symmetry",
        text: "Set the depth to 3 and the rotation to 72°. The picture is identical to 0°.",
      },
      {
        title: "Strip away the colour",
        text: "At depth 5, switch colours off and leave only the outlines. Without the violet and rose hints, look for the five-pointed stars made of thick rhombi. The same small patches recur all over the disc, but never on a regular grid.",
      },
      {
        title: "See the seed",
        text: "Set the depth to 0 in Rhombi mode. The ten seed triangles are each reflected outward into a thin rhombus, and the counter shows 10 thin and 0 thick.",
      },
    ],
  },
  de: {
    metaDescription:
      "Penrose-Parkettierung per Deflation wachsen lassen: dicke und dünne Rhomben, Robinson-Dreiecke und ein Verhältnis, das gegen den goldenen Schnitt φ strebt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Muster auf dem Canvas ist eine Penrose-Rhombenparkettierung, oft P3 genannt. Sie kommt mit nur zwei Kacheln aus, einem dicken und einem dünnen Rhombus mit gleicher Kantenlänge. Zusammen können sie die ganze Ebene bedecken, aber niemals periodisch: Es gibt keine Verschiebung, die das gesamte Muster auf sich selbst abbildet. Der Explorer beginnt mit einem kleinen Ring aus Dreiecken und zerschneidet jedes Dreieck immer wieder nach einer festen Regel in kleinere. Aus dieser Unterteilung wächst die Parkettierung.",
    sections: [
      {
        heading: "Zwei Rhomben, zwei Dreiecke",
        paragraphs: [
          "Der dicke Rhombus hat Winkel von 72° und 108°, der dünne 36° und 144°. Halbierst du beide entlang ihrer Symmetrieachse, erhältst du die zwei Robinson-Dreiecke, mit denen der Code tatsächlich rechnet. Der dünne Rhombus, entlang der kurzen Diagonale halbiert, ergibt ein Dreieck mit 36° an der Spitze und zwei Basiswinkeln von 72°. Der dicke Rhombus, entlang der langen Diagonale halbiert, ergibt ein Dreieck mit 108° an der Spitze und zwei Basiswinkeln von 36°. In beiden sind die zwei gleich langen Seiten Rhombuskanten, und in beiden ist das Verhältnis von langer zu kurzer Seite der goldene Schnitt φ.",
          "Roger Penrose fand aperiodische Kachelsätze dieser Art in den 1970er-Jahren. Ohne Zusatzregeln könnten die beiden Rhomben auch periodisch parkettieren, deshalb gehören zur echten Penrose-Parkettierung Anlegeregeln an den Kanten, die jede periodische Anordnung verbieten. Die Unterteilung umgeht dieses Problem: Jede Parkettierung, die durch wiederholte Deflation der Dreiecke entsteht, hält diese Regeln automatisch ein.",
        ],
        formula:
          "\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1{,}618, \\qquad \\varphi^2 = \\varphi + 1",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Deflationstiefe reicht von 0 bis 6 und startet bei 4. Tiefe 0 ist der Keim: zehn dünne Halbdreiecke mit der Spitze im Mittelpunkt, die zusammen ein Zehneck bilden. Jeder Schritt ersetzt jede dünne Hälfte durch zwei kleinere Dreiecke und jede dicke durch drei, alle um den Faktor φ verkleinert. Die Scheibe bleibt also gleich groß, während die Kacheln schrumpfen. Die Gesamtzahl der Halbdreiecke lautet 10, 20, 50, 130, 340, 890, 2330 und wächst pro Schritt ungefähr um φ² ≈ 2,618.",
          "Die Keim-Drehung dreht das Ausgangszehneck von 0° bis 360°. Benachbarte Keimdreiecke sind abwechselnd gespiegelt, der Keim hat deshalb fünfzählige Symmetrie, und eine Drehung um 72° ergibt exakt dasselbe Bild. Die Modusknöpfe wechseln zwischen Rhomben, bei denen gespiegelte Halbdreiecke wieder zu ganzen Rhomben zusammengesetzt werden (dick violett, dünn rosa), und Halbdreiecken, die dieselbe Unterteilung eine Ebene tiefer zeigen (dicke Hälften violett, dünne bernstein). Die Anzeigeschalter blenden Umrisse oder Farben aus. Der Zentrieren-Knopf setzt die Drehung auf 0° zurück.",
          "Die Anlegemarken zeichnen kleine Pfeilspitzen auf zwei gegenüberliegende Seiten jedes Rhombus, bernstein für dicke und cyan für dünne, jeweils eine einfache und eine doppelte. Sie sind ein vereinfachter visueller Hinweis auf die Idee der Kantenmarkierung, kein vollständiger Satz von Penrose-Anlegeregeln.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jedes Halbdreieck ist als drei komplexe Zahlen A, B, C plus ein Typ gespeichert: 0 für die dünne Hälfte, 1 für die dicke. A ist immer die Spitze zwischen den beiden gleich langen Seiten. Für die Deflation braucht es nur Punkte, die eine Kante im goldenen Schnitt teilen, genau das berechnet der Ausdruck A + (B − A) / φ.",
          "Für die Rhomben sucht der Code Dreieckspaare, die sich ihre Basis B C teilen. Er ordnet jedes Dreieck dem Mittelpunkt von B C zu, gerundet auf sechs Nachkommastellen. Treffen zwei Dreiecke gleichen Typs auf denselben Schlüssel, entsteht der Rhombus mit der vierten Ecke B + C − A, der Spiegelung der Spitze an der Basis. Übrig gebliebene Hälften am Rand der Scheibe werden genauso gespiegelt, damit der Rand sauber aussieht. Deshalb liegt der Rhombenzähler etwas über der Hälfte der Dreieckszahl.",
          "Gezeichnet wird auf einem 2D-Canvas, so skaliert, dass die Einheitsscheibe etwa 95 Prozent der kürzeren Seite füllt (abzüglich eines kleinen Rands), darüber eine weiche radiale Vignette. Nichts ist animiert: Das Canvas zeichnet nur neu, wenn du einen Regler änderst oder das Fenster seine Größe wechselt. Mit reduzierter Bewegung verhält sich die Seite also genauso.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Woher der goldene Schnitt kommt",
        paragraphs: [
          "Zähl nach, was ein Schritt bewirkt. Eine dünne Hälfte wird zu einer dünnen und einer dicken, eine dicke zu einer dünnen und zwei dicken. Ausgehend von zehn dünnen Hälften sind die Anzahlen das Zehnfache aufeinanderfolgender Fibonacci-Zahlen: 10 und 0, dann 10 und 10, 20 und 30, 50 und 80 und so weiter. Das Verhältnis von dick zu dünn strebt deshalb gegen φ: (1, φ) ist die Richtung des dominanten Eigenvektors der Substitutionsmatrix, ihr Eigenwert ist φ². Weil φ irrational ist, könnte kein sich wiederholender Kachelblock dieses Verhältnis erzeugen. Das ist ein eleganter Grund, warum die Parkettierung nicht periodisch sein kann.",
        ],
        formula:
          "\\begin{pmatrix} n_{\\text{dünn}} \\\\ n_{\\text{dick}} \\end{pmatrix} \\mapsto \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} n_{\\text{dünn}} \\\\ n_{\\text{dick}} \\end{pmatrix}",
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Verhältnis konvergieren sehen",
        text: "Wechsle zu Halbdreiecken und erhöhe die Tiefe schrittweise von 1 bis 6. Das Verhältnis zeigt 1, 1,5, 1,6, 1,6154, 1,6176 und schließlich 1,6180 bei Tiefe 6, wo es 1440 dicke und 890 dünne Hälften gibt.",
      },
      {
        title: "Die fünfzählige Symmetrie finden",
        text: "Stell die Tiefe auf 3 und die Drehung auf 72°. Das Bild ist identisch mit 0°.",
      },
      {
        title: "Die Farbe weglassen",
        text: "Schalte bei Tiefe 5 die Farben aus und lass nur die Umrisse stehen. Such ohne die violetten und rosa Hinweise nach fünfzackigen Sternen aus dicken Rhomben. Dieselben kleinen Ausschnitte kehren überall auf der Scheibe wieder, aber nie in einem regelmäßigen Raster.",
      },
      {
        title: "Den Keim ansehen",
        text: "Stell im Rhomben-Modus die Tiefe auf 0. Die zehn Keimdreiecke werden jeweils nach außen zu einem dünnen Rhombus gespiegelt, der Zähler zeigt 10 dünne und 0 dicke.",
      },
    ],
  },
  es: {
    metaDescription:
      "Haz crecer una teselación de Penrose por deflación: rombos gruesos y finos, triángulos de Robinson y una razón grueso/fino que converge al número áureo φ.",
    heading: "Cómo funciona este explorador",
    intro:
      "El patrón del lienzo es una teselación de Penrose de rombos, a menudo llamada P3. Usa solo dos piezas, un rombo grueso y uno fino, ambos con la misma longitud de lado. Juntos pueden cubrir todo el plano, pero nunca de forma periódica: no hay manera de desplazar el patrón entero de modo que coincida consigo mismo. El explorador parte de un pequeño anillo de triángulos y corta una y otra vez cada triángulo en otros más pequeños según una regla fija, y de esa subdivisión nace la teselación.",
    sections: [
      {
        heading: "Dos rombos, dos triángulos",
        paragraphs: [
          "El rombo grueso tiene ángulos de 72° y 108°, el fino de 36° y 144°. Corta cada uno por la mitad a lo largo de su eje de simetría y obtienes los dos triángulos de Robinson con los que trabaja realmente el código. Al partir el rombo fino por su diagonal corta sale un triángulo con 36° en el vértice superior y dos ángulos de 72° en la base. Al partir el rombo grueso por su diagonal larga sale un triángulo con 108° en el vértice superior y dos ángulos de 36° en la base. En ambos, los dos lados iguales son lados del rombo, y en ambos la razón entre el lado largo y el corto es el número áureo φ.",
          "Roger Penrose encontró conjuntos aperiódicos de piezas de este tipo en la década de 1970. Sin reglas adicionales, los dos rombos también podrían teselar de forma periódica, así que la verdadera teselación de Penrose viene acompañada de reglas de encaje en los lados que prohíben toda disposición periódica. La subdivisión esquiva el problema: cualquier teselación obtenida al deflacionar repetidamente los triángulos cumple esas reglas de forma automática.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Profundidad de deflación» va de 0 a 6 y empieza en 4. La profundidad 0 es la semilla: diez medios triángulos finos con el vértice superior en el centro, que juntos forman un decágono. Cada paso sustituye cada mitad fina por dos triángulos más pequeños y cada mitad gruesa por tres, todos reducidos en un factor φ, de modo que el disco entero conserva su tamaño mientras las piezas se hacen más pequeñas. El número total de medios triángulos es 10, 20, 50, 130, 340, 890, 2330 y crece aproximadamente por φ² ≈ 2,618 en cada paso.",
          "«Rotación de la semilla» gira el decágono inicial de 0° a 360°. La semilla alterna la orientación de los triángulos vecinos, por lo que tiene simetría de orden cinco, y girar 72° da exactamente la misma imagen. Los botones de modo cambian entre «Rombos», donde los medios triángulos reflejados se vuelven a pegar en rombos completos (gruesos en violeta, finos en rosa), y «Medios triángulos», que muestra la misma subdivisión un nivel más abajo (mitades gruesas en violeta, mitades finas en ámbar). Los interruptores de visualización ocultan los contornos o los colores. El botón «Centrar · restablecer rotación» devuelve la rotación a 0°.",
          "«Marcas de encaje» dibuja pequeñas puntas de flecha en dos lados opuestos de cada rombo, en ámbar para los gruesos y en cian para los finos, con una punta simple y una doble en cada caso. Son una pista visual simplificada de la idea de decorar los lados, no un conjunto completo de reglas de encaje de Penrose.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada medio triángulo se guarda como tres números complejos A, B, C más un indicador de tipo: 0 para la mitad fina, 1 para la mitad gruesa. A es siempre el vértice situado entre los dos lados iguales. La deflación no necesita más que puntos que dividan un lado en proporción áurea, y eso es lo que calcula la expresión A + (B − A) / φ.",
          "Para mostrar rombos, el código empareja los triángulos que comparten la base B C. Asigna a cada triángulo como clave el punto medio de B C redondeado a seis decimales, y cuando dos triángulos del mismo tipo coinciden en la misma clave forma el rombo con el cuarto vértice B + C − A, el reflejo del vértice superior respecto de la base. Las mitades que sobran en el borde del disco se reflejan del mismo modo para que el contorno quede limpio, y por eso el contador de rombos es algo mayor que la mitad del número de triángulos.",
          "El dibujo usa un lienzo 2D escalado para que el disco unidad ocupe alrededor del 95 por ciento del lado más corto (menos un pequeño margen), seguido de una suave viñeta radial. No hay nada animado: el lienzo solo se vuelve a dibujar cuando cambias un control o redimensionas la ventana, así que la página se comporta igual con el movimiento reducido activado.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "De dónde sale el número áureo",
        paragraphs: [
          "Cuenta lo que hace un paso. Una mitad fina se convierte en una fina y una gruesa; una mitad gruesa, en una fina y dos gruesas. Partiendo de diez mitades finas, las cantidades son diez veces números de Fibonacci consecutivos: 10 y 0, luego 10 y 10, 20 y 30, 50 y 80, y así sucesivamente. La razón entre gruesas y finas tiende por tanto a φ: (1, φ) es la dirección del vector propio dominante de la matriz de sustitución, cuyo valor propio es φ². Como φ es irracional, ningún bloque de piezas que se repita podría producir jamás esa razón, lo que da un argumento elegante de por qué la teselación no puede ser periódica.",
        ],
        formula: substitutionFormula("fino", "grueso"),
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira cómo converge la razón",
        text: "Cambia a «Medios triángulos» y sube la profundidad paso a paso de 1 a 6. La razón marca 1; 1,5; 1,6; 1,6154; 1,6176 y finalmente 1,6180 en la profundidad 6, donde hay 1440 mitades gruesas y 890 finas.",
      },
      {
        title: "Encuentra la simetría de orden cinco",
        text: "Pon la profundidad en 3 y la rotación en 72°. La imagen es idéntica a la de 0°.",
      },
      {
        title: "Quita el color",
        text: "En la profundidad 5, desactiva los colores y deja solo los contornos. Sin las pistas del violeta y el rosa, busca las estrellas de cinco puntas hechas de rombos gruesos. Los mismos fragmentos pequeños reaparecen por todo el disco, pero nunca sobre una cuadrícula regular.",
      },
      {
        title: "Observa la semilla",
        text: "Pon la profundidad en 0 en el modo «Rombos». Cada uno de los diez triángulos de la semilla se refleja hacia fuera hasta formar un rombo fino, y el contador muestra 10 finos y 0 gruesos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Fais pousser un pavage de Penrose par déflation : losanges épais et fins, triangles de Robinson, et un rapport épais/fin qui converge vers le nombre d'or φ.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le motif du canevas est un pavage de Penrose en losanges, souvent appelé P3. Il n'utilise que deux tuiles, un losange épais et un losange fin, de même longueur de côté. Ensemble, ils peuvent recouvrir tout le plan, mais jamais de façon périodique : il n'existe aucune translation qui fasse coïncider le motif entier avec lui-même. L'explorateur part d'un petit anneau de triangles et découpe sans cesse chaque triangle en triangles plus petits selon une règle fixe, et c'est de cette subdivision que naît le pavage.",
    sections: [
      {
        heading: "Deux losanges, deux triangles",
        paragraphs: [
          "Le losange épais a des angles de 72° et 108°, le fin de 36° et 144°. Coupe chacun en deux le long de son axe de symétrie et tu obtiens les deux triangles de Robinson avec lesquels le code travaille réellement. Le losange fin, coupé selon sa petite diagonale, donne un triangle avec un angle de 36° au sommet et deux angles de 72° à la base. Le losange épais, coupé selon sa grande diagonale, donne un triangle avec un angle de 108° au sommet et deux angles de 36° à la base. Dans les deux cas, les deux côtés égaux sont des côtés du losange, et dans les deux cas le rapport entre le grand côté et le petit est le nombre d'or φ.",
          "Roger Penrose a découvert des jeux de tuiles apériodiques de ce genre dans les années 1970. Sans règles supplémentaires, les deux losanges pourraient aussi paver de façon périodique : le véritable pavage de Penrose s'accompagne donc de règles d'accord sur les côtés, qui interdisent tout arrangement périodique. La subdivision contourne le problème : tout pavage obtenu par déflation répétée des triangles respecte automatiquement ces règles.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Profondeur de déflation » va de 0 à 6 et démarre à 4. La profondeur 0 est la graine : dix demi-triangles fins dont le sommet est au centre et qui forment ensemble un décagone. Chaque étape remplace chaque moitié fine par deux triangles plus petits et chaque moitié épaisse par trois, tous réduits d'un facteur φ, de sorte que le disque garde la même taille pendant que les tuiles rapetissent. Le nombre total de demi-triangles vaut 10, 20, 50, 130, 340, 890, 2\u00a0330 et croît d'environ φ² ≈ 2,618 à chaque étape.",
          "« Rotation de la graine » fait tourner le décagone de départ de 0° à 360°. La graine alterne l'orientation des triangles voisins, elle possède donc une symétrie d'ordre cinq, et une rotation de 72° donne exactement la même image. Les boutons de mode basculent entre « Losanges », où les demi-triangles en miroir sont recollés en losanges entiers (épais en violet, fins en rose), et « Demi-triangles », qui montre la même subdivision un niveau plus bas (moitiés épaisses en violet, moitiés fines en ambre). Les interrupteurs d'affichage masquent les contours ou les couleurs. Le bouton « Centrer · réinitialiser la rotation » ramène la rotation à 0°.",
          "« Marques d'accord » dessine de petites pointes de flèche sur deux côtés opposés de chaque losange, ambre pour les épais et cyan pour les fins, avec à chaque fois une pointe simple et une pointe double. C'est une évocation visuelle simplifiée de l'idée de décorer les côtés, pas un jeu complet de règles d'accord de Penrose.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque demi-triangle est stocké sous la forme de trois nombres complexes A, B, C et d'un indicateur de type : 0 pour la moitié fine, 1 pour la moitié épaisse. A est toujours le sommet situé entre les deux côtés égaux. La déflation n'a besoin que de points qui partagent un côté selon le nombre d'or, et c'est ce que calcule l'expression A + (B − A) / φ.",
          "Pour afficher des losanges, le code apparie les triangles qui partagent leur base B C. Il associe à chaque triangle une clé, le milieu de B C arrondi à six décimales, et quand deux triangles de même type se retrouvent sur la même clé, il forme le losange avec le quatrième sommet B + C − A, le symétrique du sommet par rapport à la base. Les moitiés restées seules au bord du disque sont réfléchies de la même façon pour que le contour soit net, et c'est pourquoi le compteur de losanges dépasse légèrement la moitié du nombre de triangles.",
          "Le dessin utilise un canevas 2D mis à l'échelle pour que le disque unité occupe environ 95 pour cent du plus petit côté (moins une petite marge), suivi d'un doux vignettage radial. Rien n'est animé : le canevas n'est redessiné que lorsque tu modifies une commande ou redimensionnes la fenêtre, si bien que la page se comporte de la même manière quand la réduction des animations est activée.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "D'où vient le nombre d'or",
        paragraphs: [
          "Compte ce que fait une étape. Une moitié fine devient une fine et une épaisse ; une moitié épaisse devient une fine et deux épaisses. En partant de dix moitiés fines, les effectifs valent dix fois des nombres de Fibonacci consécutifs : 10 et 0, puis 10 et 10, 20 et 30, 50 et 80, et ainsi de suite. Le rapport entre épaisses et fines tend donc vers φ : (1, φ) est la direction du vecteur propre dominant de la matrice de substitution, dont la valeur propre est φ². Comme φ est irrationnel, aucun bloc de tuiles qui se répète ne pourrait jamais produire ce rapport, ce qui fournit un argument élégant expliquant pourquoi le pavage ne peut pas être périodique.",
        ],
        formula: substitutionFormula("fin", "épais"),
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde le rapport converger",
        text: "Passe en « Demi-triangles » et augmente la profondeur pas à pas de 1 à 6. Le rapport affiche 1 ; 1,5 ; 1,6 ; 1,6154 ; 1,6176 et enfin 1,6180 à la profondeur 6, où l'on compte 1\u00a0440 moitiés épaisses et 890 fines.",
      },
      {
        title: "Trouve la symétrie d'ordre cinq",
        text: "Règle la profondeur sur 3 et la rotation sur 72°. L'image est identique à celle de 0°.",
      },
      {
        title: "Retire la couleur",
        text: "À la profondeur 5, désactive les couleurs et ne garde que les contours. Sans les repères violets et roses, cherche les étoiles à cinq branches faites de losanges épais. Les mêmes petits fragments reviennent partout sur le disque, mais jamais sur une grille régulière.",
      },
      {
        title: "Observe la graine",
        text: "Règle la profondeur sur 0 en mode « Losanges ». Chacun des dix triangles de la graine est réfléchi vers l'extérieur pour former un losange fin, et le compteur affiche 10 fins et 0 épais.",
      },
    ],
  },
  it: {
    metaDescription:
      "Fai crescere una tassellatura di Penrose per deflazione: rombi spessi e sottili, triangoli di Robinson e un rapporto che converge alla sezione aurea φ.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il motivo sul canvas è una tassellatura di Penrose a rombi, spesso chiamata P3. Usa soltanto due tasselli, un rombo spesso e uno sottile, con lati della stessa lunghezza. Insieme possono ricoprire l'intero piano, ma mai in modo periodico: non c'è modo di traslare tutto il motivo così che si sovrapponga a sé stesso. L'esploratore parte da un piccolo anello di triangoli e taglia ripetutamente ogni triangolo in triangoli più piccoli secondo una regola fissa, e da questa suddivisione nasce la tassellatura.",
    sections: [
      {
        heading: "Due rombi, due triangoli",
        paragraphs: [
          "Il rombo spesso ha angoli di 72° e 108°, quello sottile di 36° e 144°. Taglia ciascuno a metà lungo il suo asse di simmetria e ottieni i due triangoli di Robinson con cui il codice lavora davvero. Dividendo il rombo sottile lungo la diagonale corta si ottiene un triangolo con 36° al vertice e due angoli alla base di 72°. Dividendo il rombo spesso lungo la diagonale lunga si ottiene un triangolo con 108° al vertice e due angoli alla base di 36°. In entrambi i due lati uguali sono lati del rombo, e in entrambi il rapporto tra il lato lungo e quello corto è la sezione aurea φ.",
          "Roger Penrose trovò insiemi aperiodici di tasselli di questo tipo negli anni Settanta. Senza regole aggiuntive i due rombi potrebbero tassellare anche in modo periodico, perciò la vera tassellatura di Penrose prevede regole di incastro sui lati che vietano ogni disposizione periodica. La suddivisione aggira il problema: ogni tassellatura ottenuta deflazionando ripetutamente i triangoli rispetta automaticamente quelle regole.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Profondità di deflazione» va da 0 a 6 e parte da 4. La profondità 0 è il seme: dieci mezzi triangoli sottili con il vertice al centro, che insieme formano un decagono. Ogni passo sostituisce ciascuna metà sottile con due triangoli più piccoli e ciascuna metà spessa con tre, tutti rimpiccioliti di un fattore φ, così l'intero disco mantiene le stesse dimensioni mentre i tasselli diventano più piccoli. Il numero totale di mezzi triangoli è 10, 20, 50, 130, 340, 890, 2330 e cresce di circa φ² ≈ 2,618 a ogni passo.",
          "«Rotazione del seme» ruota il decagono iniziale da 0° a 360°. Il seme alterna l'orientamento dei triangoli vicini, quindi ha una simmetria di ordine cinque, e una rotazione di 72° dà esattamente la stessa immagine. I pulsanti della modalità passano da «Rombi», in cui i mezzi triangoli speculari vengono riuniti in rombi interi (spessi viola, sottili rosa), a «Mezzi triangoli», che mostra la stessa suddivisione un livello più in basso (metà spesse viola, metà sottili ambra). Gli interruttori di visualizzazione nascondono i contorni o i colori. Il pulsante «Centra · azzera rotazione» riporta la rotazione a 0°.",
          "«Marche di incastro» disegna piccole punte di freccia su due lati opposti di ogni rombo, ambra per quelli spessi e ciano per quelli sottili, ogni volta con una punta singola e una doppia. Sono un accenno visivo semplificato all'idea di decorare i lati, non un insieme completo di regole di incastro di Penrose.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni mezzo triangolo è memorizzato come tre numeri complessi A, B, C più un indicatore di tipo: 0 per la metà sottile, 1 per la metà spessa. A è sempre il vertice compreso tra i due lati uguali. Alla deflazione servono soltanto punti che dividono un lato secondo la sezione aurea, ed è proprio ciò che calcola l'espressione A + (B − A) / φ.",
          "Per mostrare i rombi, il codice accoppia i triangoli che condividono la base B C. Assegna a ogni triangolo come chiave il punto medio di B C arrotondato a sei decimali, e quando due triangoli dello stesso tipo si incontrano sulla stessa chiave forma il rombo con il quarto vertice B + C − A, il simmetrico del vertice rispetto alla base. Le metà rimaste spaiate sul bordo del disco vengono riflesse allo stesso modo, così il contorno appare pulito, ed è per questo che il contatore dei rombi supera di poco la metà del numero di triangoli.",
          "Il disegno usa un canvas 2D scalato in modo che il disco unitario occupi circa il 95 per cento del lato più corto (meno un piccolo margine), seguito da una morbida vignettatura radiale. Nulla è animato: il canvas viene ridisegnato solo quando cambi un controllo o ridimensioni la finestra, quindi la pagina si comporta allo stesso modo con il movimento ridotto attivo.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Da dove viene la sezione aurea",
        paragraphs: [
          "Conta che cosa fa un singolo passo. Una metà sottile diventa una sottile e una spessa; una metà spessa diventa una sottile e due spesse. Partendo da dieci metà sottili, i conteggi sono dieci volte numeri di Fibonacci consecutivi: 10 e 0, poi 10 e 10, 20 e 30, 50 e 80, e così via. Il rapporto tra spesse e sottili tende perciò a φ: (1, φ) è la direzione dell'autovettore dominante della matrice di sostituzione, il cui autovalore è φ². Poiché φ è irrazionale, nessun blocco di tasselli che si ripete potrebbe mai produrre questo rapporto, il che offre un argomento elegante sul perché la tassellatura non può essere periodica.",
        ],
        formula: substitutionFormula("sottile", "spesso"),
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda il rapporto convergere",
        text: "Passa a «Mezzi triangoli» e aumenta la profondità un passo alla volta da 1 a 6. Il rapporto segna 1; 1,5; 1,6; 1,6154; 1,6176 e infine 1,6180 alla profondità 6, dove ci sono 1440 metà spesse e 890 sottili.",
      },
      {
        title: "Trova la simmetria di ordine cinque",
        text: "Imposta la profondità su 3 e la rotazione su 72°. L'immagine è identica a quella a 0°.",
      },
      {
        title: "Togli il colore",
        text: "Alla profondità 5, disattiva i colori e lascia solo i contorni. Senza gli indizi del viola e del rosa, cerca le stelle a cinque punte fatte di rombi spessi. Gli stessi piccoli frammenti ricompaiono in tutto il disco, ma mai su una griglia regolare.",
      },
      {
        title: "Osserva il seme",
        text: "Imposta la profondità su 0 in modalità «Rombi». Ciascuno dei dieci triangoli del seme viene riflesso verso l'esterno in un rombo sottile, e il contatore mostra 10 sottili e 0 spessi.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Faz crescer uma pavimentação de Penrose por deflação: losangos espessos e finos, triângulos de Robinson e uma razão que converge para a razão áurea φ.",
    heading: "Como funciona este explorador",
    intro:
      "O padrão no canvas é uma pavimentação de Penrose com losangos, muitas vezes chamada P3. Usa apenas duas peças, um losango espesso e um fino, ambos com o mesmo comprimento de lado. Juntos conseguem cobrir o plano inteiro, mas nunca de forma periódica: não há maneira de deslocar o padrão todo de modo a que coincida consigo mesmo. O explorador parte de um pequeno anel de triângulos e corta repetidamente cada triângulo em triângulos mais pequenos segundo uma regra fixa, e é dessa subdivisão que nasce a pavimentação.",
    sections: [
      {
        heading: "Dois losangos, dois triângulos",
        paragraphs: [
          "O losango espesso tem ângulos de 72° e 108°, o fino de 36° e 144°. Corta cada um ao meio ao longo do seu eixo de simetria e obténs os dois triângulos de Robinson com que o código realmente trabalha. Dividir o losango fino pela diagonal curta dá um triângulo com 36° no vértice e dois ângulos de 72° na base. Dividir o losango espesso pela diagonal longa dá um triângulo com 108° no vértice e dois ângulos de 36° na base. Em ambos, os dois lados iguais são lados do losango, e em ambos a razão entre o lado comprido e o curto é a razão áurea φ.",
          "Roger Penrose encontrou conjuntos aperiódicos de peças deste género na década de 1970. Sem regras adicionais, os dois losangos também poderiam pavimentar de forma periódica, por isso a verdadeira pavimentação de Penrose inclui regras de encaixe nos lados que proíbem qualquer disposição periódica. A subdivisão contorna o problema: qualquer pavimentação obtida por deflação repetida dos triângulos cumpre automaticamente essas regras.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Profundidade de deflação» vai de 0 a 6 e começa em 4. A profundidade 0 é a semente: dez meios triângulos finos com o vértice no centro, que juntos formam um decágono. Cada passo substitui cada metade fina por dois triângulos mais pequenos e cada metade espessa por três, todos reduzidos por um fator φ, de modo que o disco mantém o mesmo tamanho enquanto as peças ficam mais pequenas. O número total de meios triângulos é 10, 20, 50, 130, 340, 890, 2330 e cresce cerca de φ² ≈ 2,618 em cada passo.",
          "«Rotação da semente» roda o decágono inicial de 0° a 360°. A semente alterna a orientação dos triângulos vizinhos, por isso tem simetria de ordem cinco, e rodar 72° dá exatamente a mesma imagem. Os botões de modo alternam entre «Losangos», em que os meios triângulos espelhados são colados de novo em losangos inteiros (espessos em violeta, finos em rosa), e «Meios triângulos», que mostra a mesma subdivisão um nível abaixo (metades espessas em violeta, metades finas em âmbar). Os interruptores de visualização escondem os contornos ou as cores. O botão «Centrar · repor rotação» volta a pôr a rotação em 0°.",
          "«Marcas de encaixe» desenha pequenas pontas de seta em dois lados opostos de cada losango, âmbar nos espessos e ciano nos finos, com uma ponta simples e uma dupla em cada caso. São uma sugestão visual simplificada da ideia de decorar os lados, não um conjunto completo de regras de encaixe de Penrose.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada meio triângulo é guardado como três números complexos A, B, C e um indicador de tipo: 0 para a metade fina, 1 para a metade espessa. A é sempre o vértice entre os dois lados iguais. A deflação só precisa de pontos que dividam um lado na razão áurea, e é isso que calcula a expressão A + (B − A) / φ.",
          "Para mostrar losangos, o código emparelha os triângulos que partilham a base B C. Atribui a cada triângulo como chave o ponto médio de B C arredondado a seis casas decimais, e quando dois triângulos do mesmo tipo se encontram na mesma chave forma o losango com o quarto vértice B + C − A, o simétrico do vértice em relação à base. As metades que sobram na orla do disco são refletidas da mesma maneira, para que o contorno fique limpo, e é por isso que o contador de losangos é um pouco superior a metade do número de triângulos.",
          "O desenho usa um canvas 2D dimensionado para que o disco unitário ocupe cerca de 95 por cento do lado mais curto (menos uma pequena margem), seguido de uma vinheta radial suave. Nada é animado: o canvas só é redesenhado quando mudas um controlo ou redimensionas a janela, por isso a página comporta-se da mesma forma com o movimento reduzido ativado.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "De onde vem a razão áurea",
        paragraphs: [
          "Conta o que faz um passo. Uma metade fina transforma-se numa fina e numa espessa; uma metade espessa transforma-se numa fina e em duas espessas. Partindo de dez metades finas, as contagens são dez vezes números de Fibonacci consecutivos: 10 e 0, depois 10 e 10, 20 e 30, 50 e 80, e assim por diante. A razão entre espessas e finas tende, portanto, para φ: (1, φ) é a direção do vetor próprio dominante da matriz de substituição, cujo valor próprio é φ². Como φ é irracional, nenhum bloco de peças que se repita poderia alguma vez produzir esta razão, o que dá um argumento elegante para a pavimentação não poder ser periódica.",
        ],
        formula: substitutionFormula("fino", "espesso"),
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê a razão convergir",
        text: "Muda para «Meios triângulos» e aumenta a profundidade passo a passo de 1 a 6. A razão indica 1; 1,5; 1,6; 1,6154; 1,6176 e por fim 1,6180 na profundidade 6, onde há 1440 metades espessas e 890 finas.",
      },
      {
        title: "Encontra a simetria de ordem cinco",
        text: "Põe a profundidade em 3 e a rotação em 72°. A imagem é idêntica à de 0°.",
      },
      {
        title: "Tira a cor",
        text: "Na profundidade 5, desliga as cores e deixa apenas os contornos. Sem as pistas do violeta e do rosa, procura as estrelas de cinco pontas feitas de losangos espessos. Os mesmos pequenos fragmentos repetem-se por todo o disco, mas nunca numa grelha regular.",
      },
      {
        title: "Vê a semente",
        text: "Põe a profundidade em 0 no modo «Losangos». Cada um dos dez triângulos da semente é refletido para fora, formando um losango fino, e o contador mostra 10 finos e 0 espessos.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Låt en Penrose-täckning växa fram genom deflation: tjocka och tunna romber, Robinsontrianglar och ett förhållande som konvergerar mot gyllene snittet φ.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Mönstret på ytan är en Penrose-täckning med romber, ofta kallad P3. Den använder bara två plattor, en tjock romb och en tunn, båda med samma kantlängd. Tillsammans kan de täcka hela planet, men aldrig periodiskt: det går inte att förskjuta hela mönstret så att det hamnar på sig självt. Utforskaren börjar med en liten ring av trianglar och skär gång på gång varje triangel i mindre trianglar enligt en fast regel, och ur den uppdelningen växer täckningen fram.",
    sections: [
      {
        heading: "Två romber, två trianglar",
        paragraphs: [
          "Den tjocka romben har vinklarna 72° och 108°, den tunna 36° och 144°. Dela var och en mitt itu längs symmetriaxeln så får du de två Robinsontrianglar som koden faktiskt arbetar med. Om du halverar den tunna romben längs den korta diagonalen får du en triangel med 36° i toppen och två basvinklar på 72°. Om du halverar den tjocka romben längs den långa diagonalen får du en triangel med 108° i toppen och två basvinklar på 36°. I båda är de två lika långa sidorna rombkanter, och i båda är förhållandet mellan den långa och den korta sidan gyllene snittet φ.",
          "Roger Penrose hittade aperiodiska uppsättningar av plattor av det här slaget på 1970-talet. Utan extra regler skulle de två romberna också kunna lägga ett periodiskt mönster, så den äkta Penrose-täckningen har matchningsregler för kanterna som förbjuder varje periodiskt arrangemang. Uppdelningen kringgår problemet: varje täckning som uppstår genom upprepad deflation av trianglarna följer automatiskt de reglerna.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Deflationsdjup” går från 0 till 6 och börjar på 4. Djup 0 är fröet: tio tunna halvtrianglar med toppen i mitten, som tillsammans bildar en tiohörning. Varje steg ersätter varje tunn halva med två mindre trianglar och varje tjock halva med tre, alla förminskade med faktorn φ, så hela skivan behåller sin storlek medan plattorna blir mindre. Det totala antalet halvtrianglar blir 10, 20, 50, 130, 340, 890, 2330 och växer med ungefär φ² ≈ 2,618 per steg.",
          "”Frörotation” vrider starttiohörningen från 0° till 360°. Fröet växlar orientering mellan intilliggande trianglar och har därför femtalig symmetri, och en vridning på 72° ger exakt samma bild. Lägesknapparna växlar mellan ”Romber”, där spegelvända halvtrianglar limmas ihop till hela romber igen (tjocka violetta, tunna rosa), och ”Halvtrianglar”, som visar samma uppdelning en nivå längre ner (tjocka halvor violetta, tunna halvor bärnstensfärgade). Visningsreglagen döljer konturer eller färger. Knappen ”Centrera · nollställ rotation” återställer rotationen till 0°.",
          "”Matchmarkeringar” ritar små pilspetsar på två motstående sidor av varje romb, bärnsten för tjocka och cyan för tunna, med en enkel och en dubbel spets vardera. De är en förenklad visuell antydan om idén med kantdekorationer, inte en fullständig uppsättning Penrosematchningsregler.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje halvtriangel lagras som tre komplexa tal A, B, C plus en typflagga: 0 för den tunna halvan, 1 för den tjocka. A är alltid toppen mellan de två lika långa sidorna. Deflationen behöver inget annat än punkter som delar en kant i gyllene snittet, och det är just vad uttrycket A + (B − A) / φ beräknar.",
          "För att visa romber parar koden ihop trianglar som delar basen B C. Den ger varje triangel en nyckel, mittpunkten på B C avrundad till sex decimaler, och när två trianglar av samma typ möts på samma nyckel bildar den romben med det fjärde hörnet B + C − A, toppens spegelbild i basen. Halvor som blir över vid skivans rand speglas på samma sätt så att kanten ser ren ut, och därför är rombräknaren något större än halva antalet trianglar.",
          "Ritningen görs på en 2D-canvas som skalas så att enhetsskivan fyller ungefär 95 procent av den kortare sidan (minus en liten marginal), följt av en mjuk radiell vinjett. Ingenting är animerat: canvasen ritas om bara när du ändrar ett reglage eller ändrar fönstrets storlek, så sidan beter sig likadant med minskad rörelse aktiverad.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Varifrån gyllene snittet kommer",
        paragraphs: [
          "Räkna efter vad ett steg gör. En tunn halva blir en tunn och en tjock; en tjock halva blir en tunn och två tjocka. Med start i tio tunna halvor är antalen tio gånger på varandra följande Fibonaccital: 10 och 0, sedan 10 och 10, 20 och 30, 50 och 80, och så vidare. Förhållandet mellan tjocka och tunna närmar sig därför φ: (1, φ) är riktningen för den dominanta egenvektorn till substitutionsmatrisen, vars egenvärde är φ². Eftersom φ är irrationellt skulle inget upprepat block av plattor någonsin kunna ge det förhållandet, vilket ger ett elegant argument för varför täckningen inte kan vara periodisk.",
        ],
        formula: substitutionFormula("tunn", "tjock"),
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se förhållandet konvergera",
        text: "Byt till ”Halvtrianglar” och stega djupet från 1 till 6. Förhållandet visar 1; 1,5; 1,6; 1,6154; 1,6176 och till sist 1,6180 vid djup 6, där det finns 1440 tjocka och 890 tunna halvor.",
      },
      {
        title: "Hitta den femtaliga symmetrin",
        text: "Sätt djupet till 3 och rotationen till 72°. Bilden är identisk med den vid 0°.",
      },
      {
        title: "Ta bort färgen",
        text: "Stäng av färgerna vid djup 5 och lämna bara konturerna. Leta, utan de violetta och rosa ledtrådarna, efter de femuddiga stjärnorna av tjocka romber. Samma små utsnitt återkommer över hela skivan, men aldrig i ett regelbundet rutnät.",
      },
      {
        title: "Titta på fröet",
        text: "Sätt djupet till 0 i läget ”Romber”. De tio frötrianglarna speglas var och en utåt till en tunn romb, och räknaren visar 10 tunna och 0 tjocka.",
      },
    ],
  },
  no: {
    metaDescription:
      "La en Penrose-flislegging vokse fram ved deflasjon: tykke og tynne romber, Robinson-trekanter og et forhold som konvergerer mot det gylne snitt φ.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Mønsteret på lerretet er en Penrose-flislegging med romber, ofte kalt P3. Den bruker bare to fliser, en tykk rombe og en tynn, begge med samme kantlengde. Sammen kan de dekke hele planet, men aldri periodisk: Det er ikke mulig å forskyve hele mønsteret slik at det lander på seg selv. Utforskeren starter med en liten ring av trekanter og skjærer gang på gang hver trekant opp i mindre trekanter etter en fast regel, og ut av den oppdelingen vokser flisleggingen fram.",
    sections: [
      {
        heading: "To romber, to trekanter",
        paragraphs: [
          "Den tykke romben har vinkler på 72° og 108°, den tynne 36° og 144°. Del hver av dem i to langs symmetriaksen, så får du de to Robinson-trekantene som koden faktisk arbeider med. Halverer du den tynne romben langs den korte diagonalen, får du en trekant med 36° i toppen og to grunnvinkler på 72°. Halverer du den tykke romben langs den lange diagonalen, får du en trekant med 108° i toppen og to grunnvinkler på 36°. I begge er de to like lange sidene rombekanter, og i begge er forholdet mellom den lange og den korte siden det gylne snitt φ.",
          "Roger Penrose fant aperiodiske flissett av dette slaget på 1970-tallet. Uten ekstra regler kunne de to rombene også lagt et periodisk mønster, så den ekte Penrose-flisleggingen har regler for hvordan kantene må passe sammen, som forbyr enhver periodisk ordning. Oppdelingen omgår problemet: Enhver flislegging som oppstår ved gjentatt deflasjon av trekantene, følger disse reglene automatisk.",
        ],
        formula: PHI_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Deflasjonsdybde» går fra 0 til 6 og starter på 4. Dybde 0 er frøet: ti tynne halvtrekanter med toppen i sentrum, som til sammen danner en tikant. Hvert trinn erstatter hver tynne halvdel med to mindre trekanter og hver tykke halvdel med tre, alle forminsket med faktoren φ, så hele skiven beholder størrelsen mens flisene blir mindre. Det samlede antallet halvtrekanter blir 10, 20, 50, 130, 340, 890, 2330 og vokser med omtrent φ² ≈ 2,618 per trinn.",
          "«Frørotasjon» dreier starttikanten fra 0° til 360°. Frøet veksler orientering mellom nabotrekanter og har derfor femtallig symmetri, og en dreining på 72° gir nøyaktig det samme bildet. Modusknappene bytter mellom «Romber», der speilvendte halvtrekanter limes sammen til hele romber igjen (tykke fiolette, tynne rosa), og «Halvtrekanter», som viser den samme oppdelingen ett nivå lenger ned (tykke halvdeler fiolette, tynne halvdeler ravfargede). Visningsbryterne skjuler omriss eller farger. Knappen «Sentrer · nullstill rotasjon» setter rotasjonen tilbake til 0°.",
          "«Matchmarkeringer» tegner små pilspisser på to motstående sider av hver rombe, rav for tykke og cyan for tynne, med én enkel og én dobbel spiss hver. De er et forenklet visuelt hint om ideen med kantdekorasjoner, ikke et fullstendig sett med Penrose-regler for kantene.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hver halvtrekant lagres som tre komplekse tall A, B, C pluss et typeflagg: 0 for den tynne halvdelen, 1 for den tykke. A er alltid toppen mellom de to like lange sidene. Deflasjonen trenger ikke annet enn punkter som deler en kant i det gylne snitt, og det er nettopp det uttrykket A + (B − A) / φ beregner.",
          "For å vise romber parer koden sammen trekanter som deler grunnlinjen B C. Den gir hver trekant en nøkkel, midtpunktet på B C avrundet til seks desimaler, og når to trekanter av samme type møtes på samme nøkkel, danner den romben med det fjerde hjørnet B + C − A, speilbildet av toppen om grunnlinjen. Halvdeler som blir til overs ved randen av skiven, speiles på samme måte slik at kanten ser ryddig ut, og derfor er rombetelleren litt større enn halvparten av antall trekanter.",
          "Tegningen gjøres på et 2D-lerret som skaleres slik at enhetsskiven fyller omtrent 95 prosent av den korteste siden (minus en liten marg), etterfulgt av en myk radiell vignett. Ingenting er animert: Lerretet tegnes på nytt bare når du endrer en kontroll eller endrer størrelsen på vinduet, så siden oppfører seg likt med redusert bevegelse slått på.",
        ],
        code: DEFLATE_EXCERPT,
      },
      {
        heading: "Hvor det gylne snitt kommer fra",
        paragraphs: [
          "Tell etter hva ett trinn gjør. En tynn halvdel blir til én tynn og én tykk; en tykk halvdel blir til én tynn og to tykke. Med ti tynne halvdeler som utgangspunkt er antallene ti ganger påfølgende Fibonacci-tall: 10 og 0, så 10 og 10, 20 og 30, 50 og 80, og så videre. Forholdet mellom tykke og tynne nærmer seg derfor φ: (1, φ) er retningen til den dominante egenvektoren til substitusjonsmatrisen, som har egenverdien φ². Fordi φ er irrasjonalt, kunne ingen gjentatt blokk av fliser noen gang gi dette forholdet, og det gir et elegant argument for hvorfor flisleggingen ikke kan være periodisk.",
        ],
        formula: substitutionFormula("tynn", "tykk"),
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se forholdet konvergere",
        text: "Bytt til «Halvtrekanter» og øk dybden trinn for trinn fra 1 til 6. Forholdet viser 1; 1,5; 1,6; 1,6154; 1,6176 og til slutt 1,6180 ved dybde 6, der det finnes 1440 tykke og 890 tynne halvdeler.",
      },
      {
        title: "Finn den femtallige symmetrien",
        text: "Sett dybden til 3 og rotasjonen til 72°. Bildet er identisk med det ved 0°.",
      },
      {
        title: "Ta bort fargen",
        text: "Slå av fargene ved dybde 5 og la bare omrissene stå igjen. Let, uten de fiolette og rosa hintene, etter de femtaggede stjernene av tykke romber. De samme små utsnittene går igjen over hele skiven, men aldri i et regelmessig rutenett.",
      },
      {
        title: "Se på frøet",
        text: "Sett dybden til 0 i modusen «Romber». De ti frøtrekantene speiles hver for seg utover til en tynn rombe, og telleren viser 10 tynne og 0 tykke.",
      },
    ],
  },
};
