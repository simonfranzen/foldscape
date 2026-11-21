import type { ExplorerGuide } from "./types";

// Numbers quoted here (speed 0.05 to 3 rad/s, default 0.6, the 0.02 rad
// window around π, the 0.05 s frame clamp) match
// app/euler/explorer/page.tsx; update both together.
const TICK_EXCERPT = `useEffect(() => {
  if (!running) return;
  let raf = 0;
  let prev = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    const next = thetaRef.current + speedRef.current * dt;
    setTheta(((next % TAU) + TAU) % TAU);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [running]);

// in the renderer: the point e^(iθ), with canvas y pointing down
const px = cx + R * Math.cos(t);
const py = cy - R * Math.sin(t);`;

// The same in every locale.
const EULER_FORMULA = "e^{i\\theta} = \\cos\\theta + i \\sin\\theta, \\qquad e^{i\\pi} + 1 = 0";

export const EULER_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "See Euler's formula e^(iθ) = cos θ + i sin θ move: drag the angle around the unit circle, watch cos and sin trace their waves, and land on e^(iπ) + 1 = 0.",
    heading: "How this explorer works",
    intro:
      "The large canvas is the complex plane, with the real numbers running left to right and the imaginary numbers running up. The bright point is e^(iθ) for the current angle θ. As θ grows, the point travels counter-clockwise around the circle of radius 1, the arc it has swept is drawn in amber, and dashed lines drop from the point to both axes. The strip below plots cos θ and sin θ over one full turn, with a cursor at the current angle: the circle and the two waves are one and the same motion.",
    sections: [
      {
        heading: "One formula, three readings",
        paragraphs: [
          "Euler's formula says that raising e to an imaginary power produces a point on the unit circle. The real part of e^(iθ) is cos θ and the imaginary part is sin θ. Leonhard Euler published it in his Introductio in analysin infinitorum in 1748, and one way to see why it holds is to put iθ into the power series of the exponential function. The powers of i cycle through i, −1, −i, 1, so the even terms collect into the series for cos θ and the odd terms into i times the series for sin θ.",
          "A second reading is about motion. The derivative of e^(iθ) with respect to θ is i·e^(iθ), and multiplying by i rotates a complex number by a quarter turn. So the velocity of the point is always at right angles to its position and always of length 1. A point that moves at unit speed and always sideways to its own radius can only go round in a circle, and θ is exactly the distance travelled along it.",
          "The third reading is the famous special case. At θ = π the point has travelled half the circle and sits at −1, so e^(iπ) + 1 = 0, an equation that links e, i, π, 1 and 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The Angle θ slider runs from 0 to 2π in steps of 0.01 radians. The five buttons below jump to the quarter turns 0, π/2, π, 3π/2 and 2π, labelled with where the point lands: 1, i, −1, −i and 1 again. The overlay in the corner of the plane shows θ, cos θ, sin θ and the point written as a + bi.",
          "Play animates θ at a constant angular speed, set by the Speed slider from 0.05 to 3 radians per second (default 0.6, so a full turn takes about 10.5 seconds). When θ passes 2π it wraps back to 0. Reset sets θ to 0 again. Whenever θ is within 0.02 radians of π, the point turns rose, the plane gets a faint rose wash, and the banner e^(iπ) + 1 = 0 appears at the top.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Both pictures are 2D canvases sized to the device pixel ratio. There is no permanent animation loop: each canvas redraws only when θ, the canvas size or the reset counter changes, which means an idle page draws nothing at all.",
          "The animation loop exists only while Play is active. Each frame it measures the time since the previous frame, caps it at 0.05 seconds so returning to a background tab does not fling the point around, adds speed times elapsed time to θ, and wraps the result into the range from 0 to 2π. Because the page opens paused and only moves when you press Play, there is nothing to switch off for reduced motion; dragging the slider works the same either way.",
          "The renderer converts θ to screen coordinates with one cosine and one sine. The minus sign on the y coordinate is the only subtle part: canvas y points down, mathematical y points up.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Why angles are measured in radians here",
        paragraphs: [
          "The formula only works this neatly when θ is in radians, where one radian is the angle whose arc on the unit circle has length 1. That is why θ is also the length of the amber arc: at θ = π the arc is half the circumference of a circle with radius 1, which is π. Measure the angle in degrees instead and the formula picks up an awkward factor of π/180 in the exponent.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch the identity moment",
        text: "Set the speed to 0.05 and press Play from θ = 0. After about a minute the point reaches π, the plane flashes rose and the banner stays up for almost a second. At the default 0.6 the same window passes in a blink.",
      },
      {
        title: "Read cos and sin off the circle",
        text: "Drag θ slowly from 0 to π/2. On the plane the point rises and moves left; in the strip the cyan sin curve climbs to 1 while the amber cos curve falls to 0. At π/2 the overlay shows z = 0.000 + 1.000 i, which is i.",
      },
      {
        title: "Find where cos equals sin",
        text: "Move the slider to about 0.785 radians, or 45 degrees. The point sits on the diagonal, both dashed lines have the same length, and the readout shows cos θ and sin θ both near 0.7071, which is 1/√2.",
      },
      {
        title: "Multiply by i with a quarter turn",
        text: "Click the buttons in order: 0, π/2, π, 3π/2, 2π. Each click adds π/2 to θ, which multiplies the point by e^(iπ/2) = i. The landing points 1, i, −1, −i, 1 are exactly the powers of i.",
      },
    ],
  },
  de: {
    metaDescription:
      "Eulersche Formel e^(iθ) = cos θ + i sin θ in Bewegung: den Winkel über den Einheitskreis ziehen, cos- und sin-Wellen sehen und bei e^(iπ) + 1 = 0 landen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das große Canvas ist die komplexe Ebene: Die reellen Zahlen laufen von links nach rechts, die imaginären nach oben. Der leuchtende Punkt ist e^(iθ) für den aktuellen Winkel θ. Wächst θ, wandert der Punkt gegen den Uhrzeigersinn über den Kreis mit Radius 1, der überstrichene Bogen wird in Bernstein gezeichnet, und gestrichelte Linien fallen vom Punkt auf beide Achsen. Der Streifen darunter zeigt cos θ und sin θ über eine volle Umdrehung, mit einem Cursor beim aktuellen Winkel. So siehst du den Kreis und die beiden Wellen als ein und dieselbe Bewegung.",
    sections: [
      {
        heading: "Eine Formel, drei Lesarten",
        paragraphs: [
          "Die Eulersche Formel besagt: Hebt man e in eine imaginäre Potenz, landet man auf dem Einheitskreis. Der Realteil von e^(iθ) ist cos θ, der Imaginärteil sin θ. Leonhard Euler veröffentlichte sie 1748 in seiner Introductio in analysin infinitorum. Warum sie stimmt, sieht man, wenn man iθ in die Potenzreihe der Exponentialfunktion einsetzt. Die Potenzen von i laufen zyklisch durch i, −1, −i, 1, deshalb sammeln sich die geraden Glieder zur Reihe für cos θ und die ungeraden zu i mal der Reihe für sin θ.",
          "Die zweite Lesart handelt von Bewegung. Die Ableitung von e^(iθ) nach θ ist i·e^(iθ), und Multiplizieren mit i dreht eine komplexe Zahl um eine Vierteldrehung. Die Geschwindigkeit des Punkts steht also immer senkrecht auf seiner Position und hat immer die Länge 1. Ein Punkt, der sich mit Tempo 1 und stets quer zu seinem eigenen Radius bewegt, kann nur im Kreis laufen, und θ ist genau die Strecke, die er dabei zurücklegt.",
          "Die dritte Lesart ist der berühmte Spezialfall. Bei θ = π hat der Punkt den halben Kreis zurückgelegt und sitzt bei −1, also gilt e^(iπ) + 1 = 0, eine Gleichung, die e, i, π, 1 und 0 verbindet.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Der Regler «Winkel θ» läuft von 0 bis 2π in Schritten von 0,01 Radiant, die Anzeige darüber zeigt den Wert in Radiant und Grad. Die fünf Knöpfe darunter springen zu den Vierteldrehungen 0, π/2, π, 3π/2 und 2π, beschriftet mit dem Landepunkt: 1, i, −1, −i und wieder 1. Die Einblendung in der Ecke der Ebene zeigt θ, cos θ, sin θ und den Punkt in der Form a + bi.",
          "Start animiert θ mit konstanter Winkelgeschwindigkeit, einstellbar mit dem Geschwindigkeitsregler von 0,05 bis 3 Radiant pro Sekunde (Standard 0,6, eine volle Umdrehung dauert also etwa 10,5 Sekunden). Überschreitet θ den Wert 2π, springt es zurück auf 0. Zurücksetzen stellt θ wieder auf 0. Sobald θ weniger als 0,02 Radiant von π entfernt ist, wird der Punkt rosa, die Ebene bekommt einen zarten rosa Schleier, und oben erscheint das Banner e^(iπ) + 1 = 0.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Beide Bilder sind 2D-Canvas-Flächen in der Pixeldichte des Geräts. Eine Dauerschleife gibt es nicht: Jedes Canvas zeichnet nur neu, wenn sich θ, die Größe oder der Reset-Zähler ändert, eine ruhende Seite zeichnet also gar nichts.",
          "Die Animationsschleife existiert nur, solange Start aktiv ist. In jedem Frame misst sie die Zeit seit dem vorigen Frame, deckelt sie bei 0,05 Sekunden, damit der Punkt nach der Rückkehr in einen Hintergrund-Tab nicht wegspringt, addiert Geschwindigkeit mal Zeit zu θ und bringt das Ergebnis zurück in den Bereich von 0 bis 2π. Weil die Seite pausiert startet und sich erst bewegt, wenn du Start drückst, muss für reduzierte Bewegung nichts abgeschaltet werden. Der Regler funktioniert in beiden Fällen gleich.",
          "Der Renderer rechnet θ mit einem Kosinus und einem Sinus in Bildschirmkoordinaten um. Die einzige Feinheit ist das Minuszeichen bei y: Auf dem Canvas zeigt y nach unten, in der Mathematik nach oben.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Warum hier in Radiant gemessen wird",
        paragraphs: [
          "Die Formel ist nur dann so elegant, wenn θ in Radiant angegeben ist. Ein Radiant ist der Winkel, dessen Bogen auf dem Einheitskreis die Länge 1 hat. Deshalb ist θ auch die Länge des Bernsteinbogens: Bei θ = π ist der Bogen der halbe Umfang eines Kreises mit Radius 1, also π. Misst du den Winkel in Grad, schleppt die Formel einen unschönen Faktor π/180 im Exponenten mit.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Den Moment der Identität erwischen",
        text: "Stell die Geschwindigkeit auf 0,05 und drück Start bei θ = 0. Nach etwa einer Minute erreicht der Punkt π, die Ebene leuchtet rosa auf, und das Banner bleibt fast eine Sekunde stehen. Bei der Standardgeschwindigkeit 0,6 ist dasselbe Fenster im Nu vorbei.",
      },
      {
        title: "cos und sin am Kreis ablesen",
        text: "Zieh θ langsam von 0 bis π/2. In der Ebene steigt der Punkt und wandert nach links, im Streifen klettert die cyanfarbene sin-Kurve auf 1, während die bernsteinfarbene cos-Kurve auf 0 fällt. Bei π/2 zeigt die Einblendung z = 0.000 + 1.000 i, also i.",
      },
      {
        title: "Finde, wo cos gleich sin ist",
        text: "Schieb den Regler auf etwa 0,785 Radiant, also 45 Grad. Der Punkt liegt auf der Diagonalen, beide gestrichelten Linien sind gleich lang, und die Anzeige zeigt für cos θ und sin θ jeweils etwa 0,7071, das ist 1/√2.",
      },
      {
        title: "Mal i ist eine Vierteldrehung",
        text: "Klick die Knöpfe der Reihe nach: 0, π/2, π, 3π/2, 2π. Jeder Klick addiert π/2 zu θ und multipliziert den Punkt damit mit e^(iπ/2) = i. Die Landepunkte 1, i, −1, −i, 1 sind genau die Potenzen von i.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mira moverse la fórmula de Euler e^(iθ) = cos θ + i sin θ: arrastra el ángulo por la circunferencia unidad, sigue las ondas y llega a e^(iπ) + 1 = 0.",
    heading: "Cómo funciona este explorador",
    intro:
      "El lienzo grande es el plano complejo, con los números reales de izquierda a derecha y los imaginarios hacia arriba. El punto brillante es e^(iθ) para el ángulo θ actual. A medida que θ crece, el punto recorre en sentido antihorario la circunferencia de radio 1, el arco que ha barrido se dibuja en ámbar y unas líneas discontinuas bajan desde el punto hasta los dos ejes. La franja de abajo representa cos θ y sin θ a lo largo de una vuelta completa, con un cursor en el ángulo actual: la circunferencia y las dos ondas son un único movimiento.",
    sections: [
      {
        heading: "Una fórmula, tres lecturas",
        paragraphs: [
          "La fórmula de Euler dice que elevar e a una potencia imaginaria da un punto de la circunferencia unidad. La parte real de e^(iθ) es cos θ y la parte imaginaria es sin θ. Leonhard Euler la publicó en su Introductio in analysin infinitorum en 1748, y una forma de ver por qué se cumple es meter iθ en la serie de potencias de la función exponencial. Las potencias de i recorren en ciclo i, −1, −i, 1, de modo que los términos pares se agrupan en la serie de cos θ y los impares en i por la serie de sin θ.",
          "La segunda lectura habla de movimiento. La derivada de e^(iθ) respecto a θ es i·e^(iθ), y multiplicar por i gira un número complejo un cuarto de vuelta. Así que la velocidad del punto forma siempre un ángulo recto con su posición y tiene siempre longitud 1. Un punto que se mueve con rapidez unidad y siempre de lado respecto a su propio radio solo puede dar vueltas en círculo, y θ es exactamente la distancia recorrida sobre él.",
          "La tercera lectura es el famoso caso particular. En θ = π el punto ha recorrido media circunferencia y está en −1, así que e^(iπ) + 1 = 0, una ecuación que enlaza e, i, π, 1 y 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El deslizador «Ángulo θ» va de 0 a 2π en pasos de 0,01 radianes. Los cinco botones de debajo saltan a los cuartos de vuelta 0, π/2, π, 3π/2 y 2π, y llevan como etiqueta el lugar donde cae el punto: 1, i, −1, −i y otra vez 1. El recuadro de la esquina del plano muestra θ, cos θ, sin θ y el punto escrito como a + bi.",
          "«Reproducir» anima θ con velocidad angular constante, fijada por el deslizador «Velocidad» entre 0,05 y 3 radianes por segundo (0,6 por defecto, de modo que una vuelta completa tarda unos 10,5 segundos). Cuando θ pasa de 2π, vuelve a 0. «Reiniciar» pone θ de nuevo en 0. Siempre que θ está a menos de 0,02 radianes de π, el punto se vuelve rosa, el plano recibe un leve velo rosa y arriba aparece el rótulo e^(iπ) + 1 = 0.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Las dos imágenes son lienzos 2D dimensionados según la densidad de píxeles del dispositivo. No hay un bucle de animación permanente: cada lienzo se redibuja solo cuando cambian θ, el tamaño del lienzo o el contador de reinicios, lo que significa que una página en reposo no dibuja nada en absoluto.",
          "El bucle de animación solo existe mientras «Reproducir» está activo. En cada fotograma mide el tiempo transcurrido desde el anterior, lo limita a 0,05 segundos para que volver a una pestaña en segundo plano no lance el punto por los aires, suma a θ la velocidad por el tiempo transcurrido y devuelve el resultado al intervalo de 0 a 2π. Como la página se abre en pausa y solo se mueve cuando pulsas «Reproducir», no hay nada que desactivar para el movimiento reducido; arrastrar el deslizador funciona igual en ambos casos.",
          "El renderizador convierte θ en coordenadas de pantalla con un coseno y un seno. El signo menos en la coordenada y es el único detalle sutil: la y del lienzo apunta hacia abajo y la y matemática, hacia arriba.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Por qué aquí los ángulos se miden en radianes",
        paragraphs: [
          "La fórmula solo queda así de limpia cuando θ está en radianes, donde un radián es el ángulo cuyo arco sobre la circunferencia unidad tiene longitud 1. Por eso θ es también la longitud del arco ámbar: en θ = π el arco es la mitad del perímetro de una circunferencia de radio 1, es decir, π. Si mides el ángulo en grados, a la fórmula le sale un incómodo factor π/180 en el exponente.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Atrapa el momento de la identidad",
        text: "Pon la velocidad en 0,05 y pulsa «Reproducir» desde θ = 0. Al cabo de un minuto más o menos el punto llega a π, el plano destella en rosa y el rótulo se queda casi un segundo. Con el 0,6 por defecto, esa misma ventana pasa en un parpadeo.",
      },
      {
        title: "Lee cos y sin en la circunferencia",
        text: "Arrastra θ despacio de 0 a π/2. En el plano el punto sube y se desplaza a la izquierda; en la franja, la curva cian de sin sube hasta 1 mientras la curva ámbar de cos baja hasta 0. En π/2 el recuadro muestra z = 0.000 + 1.000 i, que es i.",
      },
      {
        title: "Busca dónde cos es igual a sin",
        text: "Lleva el deslizador a unos 0,785 radianes, o 45 grados. El punto queda sobre la diagonal, las dos líneas discontinuas miden lo mismo y la lectura muestra cos θ y sin θ cerca de 0,7071, que es 1/√2.",
      },
      {
        title: "Multiplica por i con un cuarto de vuelta",
        text: "Pulsa los botones en orden: 0, π/2, π, 3π/2, 2π. Cada pulsación suma π/2 a θ, lo que multiplica el punto por e^(iπ/2) = i. Los puntos de llegada 1, i, −1, −i, 1 son justo las potencias de i.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Vois bouger la formule d'Euler e^(iθ) = cos θ + i sin θ : fais tourner l'angle sur le cercle unité, suis les ondes cos et sin et atteins e^(iπ) + 1 = 0.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le grand canevas est le plan complexe, avec les nombres réels de gauche à droite et les nombres imaginaires vers le haut. Le point lumineux est e^(iθ) pour l'angle θ courant. Quand θ augmente, le point parcourt dans le sens antihoraire le cercle de rayon 1, l'arc déjà balayé est tracé en ambre, et des lignes en tirets descendent du point vers les deux axes. La bande du dessous trace cos θ et sin θ sur un tour complet, avec un curseur à l'angle courant : le cercle et les deux ondes sont un seul et même mouvement.",
    sections: [
      {
        heading: "Une formule, trois lectures",
        paragraphs: [
          "La formule d'Euler dit qu'élever e à une puissance imaginaire donne un point du cercle unité. La partie réelle de e^(iθ) est cos θ et sa partie imaginaire est sin θ. Leonhard Euler l'a publiée dans son Introductio in analysin infinitorum en 1748, et une façon de voir pourquoi elle est vraie consiste à injecter iθ dans la série entière de la fonction exponentielle. Les puissances de i parcourent en boucle i, −1, −i, 1, si bien que les termes pairs se regroupent en la série de cos θ et les termes impairs en i fois la série de sin θ.",
          "La deuxième lecture parle de mouvement. La dérivée de e^(iθ) par rapport à θ est i·e^(iθ), et multiplier par i fait tourner un nombre complexe d'un quart de tour. La vitesse du point est donc toujours perpendiculaire à sa position et toujours de longueur 1. Un point qui avance à vitesse unité, toujours de côté par rapport à son propre rayon, ne peut que tourner en rond, et θ est exactement la distance parcourue le long du cercle.",
          "La troisième lecture est le célèbre cas particulier. En θ = π, le point a parcouru la moitié du cercle et se trouve en −1, donc e^(iπ) + 1 = 0, une équation qui relie e, i, π, 1 et 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le curseur « Angle θ » va de 0 à 2π par pas de 0,01 radian. Les cinq boutons placés dessous sautent aux quarts de tour 0, π/2, π, 3π/2 et 2π, et portent comme étiquette l'endroit où le point arrive : 1, i, −1, −i et de nouveau 1. L'encart dans le coin du plan affiche θ, cos θ, sin θ et le point écrit sous la forme a + bi.",
          "« Lecture » anime θ à vitesse angulaire constante, réglée par le curseur « Vitesse » entre 0,05 et 3 radians par seconde (0,6 par défaut, soit un tour complet en 10,5 secondes environ). Quand θ dépasse 2π, il repart de 0. « Réinitialiser » remet θ à 0. Dès que θ est à moins de 0,02 radian de π, le point vire au rose, le plan se couvre d'un léger voile rose et la bannière e^(iπ) + 1 = 0 apparaît en haut.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Les deux images sont des canevas 2D dimensionnés selon la densité de pixels de l'appareil. Il n'y a pas de boucle d'animation permanente : chaque canevas n'est redessiné que lorsque θ, la taille du canevas ou le compteur de réinitialisations change, ce qui veut dire qu'une page au repos ne dessine rien du tout.",
          "La boucle d'animation n'existe que tant que « Lecture » est actif. À chaque image, elle mesure le temps écoulé depuis l'image précédente, le plafonne à 0,05 seconde pour qu'un retour sur un onglet resté en arrière-plan ne projette pas le point n'importe où, ajoute à θ la vitesse multipliée par le temps écoulé, et ramène le résultat dans l'intervalle de 0 à 2π. Comme la page s'ouvre en pause et ne bouge que lorsque tu appuies sur « Lecture », il n'y a rien à désactiver pour la réduction des animations ; faire glisser le curseur fonctionne de la même façon dans les deux cas.",
          "Le moteur de rendu convertit θ en coordonnées d'écran avec un cosinus et un sinus. Le signe moins sur la coordonnée y est le seul point délicat : le y du canevas pointe vers le bas, le y mathématique vers le haut.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Pourquoi les angles sont ici en radians",
        paragraphs: [
          "La formule n'est aussi nette que si θ est en radians, un radian étant l'angle dont l'arc sur le cercle unité a pour longueur 1. C'est pourquoi θ est aussi la longueur de l'arc ambre : en θ = π, l'arc vaut la moitié de la circonférence d'un cercle de rayon 1, c'est-à-dire π. Mesure l'angle en degrés, et la formule récolte un facteur π/180 bien encombrant dans l'exposant.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Attrape le moment de l'identité",
        text: "Règle la vitesse sur 0,05 et appuie sur « Lecture » à partir de θ = 0. Au bout d'une minute environ, le point atteint π, le plan s'illumine en rose et la bannière reste affichée presque une seconde. Avec la valeur par défaut de 0,6, la même fenêtre passe en un clin d'œil.",
      },
      {
        title: "Lis cos et sin sur le cercle",
        text: "Fais glisser θ lentement de 0 à π/2. Dans le plan, le point monte et part vers la gauche ; dans la bande, la courbe cyan de sin grimpe jusqu'à 1 pendant que la courbe ambre de cos descend jusqu'à 0. En π/2, l'encart affiche z = 0.000 + 1.000 i, c'est-à-dire i.",
      },
      {
        title: "Trouve où cos égale sin",
        text: "Amène le curseur vers 0,785 radian, soit 45 degrés. Le point se trouve sur la diagonale, les deux lignes en tirets ont la même longueur, et l'affichage donne cos θ et sin θ tous deux proches de 0,7071, c'est-à-dire 1/√2.",
      },
      {
        title: "Multiplie par i d'un quart de tour",
        text: "Clique sur les boutons dans l'ordre : 0, π/2, π, 3π/2, 2π. Chaque clic ajoute π/2 à θ, ce qui multiplie le point par e^(iπ/2) = i. Les points d'arrivée 1, i, −1, −i, 1 sont exactement les puissances de i.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarda muoversi la formula di Eulero e^(iθ) = cos θ + i sin θ: trascina l'angolo sulla circonferenza unitaria, segui le onde e arriva a e^(iπ) + 1 = 0.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il canvas grande è il piano complesso, con i numeri reali da sinistra a destra e gli immaginari verso l'alto. Il punto luminoso è e^(iθ) per l'angolo θ corrente. Al crescere di θ il punto percorre in senso antiorario la circonferenza di raggio 1, l'arco già spazzato viene disegnato in ambra e delle linee tratteggiate scendono dal punto verso i due assi. La striscia in basso traccia cos θ e sin θ su un giro completo, con un cursore sull'angolo corrente: la circonferenza e le due onde sono un unico movimento.",
    sections: [
      {
        heading: "Una formula, tre letture",
        paragraphs: [
          "La formula di Eulero dice che elevare e a una potenza immaginaria produce un punto della circonferenza unitaria. La parte reale di e^(iθ) è cos θ e la parte immaginaria è sin θ. Leonhard Euler la pubblicò nella sua Introductio in analysin infinitorum nel 1748, e un modo per capire perché vale è inserire iθ nella serie di potenze della funzione esponenziale. Le potenze di i ruotano ciclicamente tra i, −1, −i, 1, quindi i termini pari si raccolgono nella serie di cos θ e quelli dispari in i per la serie di sin θ.",
          "La seconda lettura riguarda il movimento. La derivata di e^(iθ) rispetto a θ è i·e^(iθ), e moltiplicare per i ruota un numero complesso di un quarto di giro. Quindi la velocità del punto è sempre perpendicolare alla sua posizione e ha sempre lunghezza 1. Un punto che si muove a velocità unitaria e sempre di lato rispetto al proprio raggio non può che girare in cerchio, e θ è esattamente la distanza percorsa lungo di esso.",
          "La terza lettura è il celebre caso particolare. Per θ = π il punto ha percorso mezza circonferenza e si trova in −1, quindi e^(iπ) + 1 = 0, un'equazione che lega e, i, π, 1 e 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Il cursore «Angolo θ» va da 0 a 2π a passi di 0,01 radianti. I cinque pulsanti sotto saltano ai quarti di giro 0, π/2, π, 3π/2 e 2π, e riportano come etichetta il punto di arrivo: 1, i, −1, −i e di nuovo 1. Il riquadro nell'angolo del piano mostra θ, cos θ, sin θ e il punto scritto come a + bi.",
          "«Avvia» anima θ a velocità angolare costante, impostata dal cursore «Velocità» tra 0,05 e 3 radianti al secondo (predefinito 0,6, quindi un giro completo dura circa 10,5 secondi). Quando θ supera 2π riparte da 0. «Reimposta» riporta θ a 0. Ogni volta che θ dista meno di 0,02 radianti da π, il punto diventa rosa, il piano si copre di un leggero velo rosa e in alto compare la scritta e^(iπ) + 1 = 0.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Entrambe le immagini sono canvas 2D dimensionati in base alla densità di pixel del dispositivo. Non c'è un ciclo di animazione permanente: ogni canvas viene ridisegnato solo quando cambiano θ, la dimensione del canvas o il contatore dei reset, il che significa che una pagina ferma non disegna assolutamente nulla.",
          "Il ciclo di animazione esiste solo finché «Avvia» è attivo. A ogni fotogramma misura il tempo trascorso dal fotogramma precedente, lo limita a 0,05 secondi perché il ritorno a una scheda rimasta in background non scaraventi via il punto, aggiunge a θ la velocità per il tempo trascorso e riporta il risultato nell'intervallo da 0 a 2π. Poiché la pagina si apre in pausa e si muove solo quando premi «Avvia», non c'è nulla da disattivare per il movimento ridotto; trascinare il cursore funziona allo stesso modo in entrambi i casi.",
          "Il renderer converte θ in coordinate dello schermo con un coseno e un seno. Il segno meno sulla coordinata y è l'unico punto delicato: la y del canvas punta verso il basso, la y matematica verso l'alto.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Perché qui gli angoli si misurano in radianti",
        paragraphs: [
          "La formula funziona in modo così pulito solo quando θ è in radianti, dove un radiante è l'angolo il cui arco sulla circonferenza unitaria ha lunghezza 1. Ecco perché θ è anche la lunghezza dell'arco color ambra: per θ = π l'arco è metà della circonferenza di un cerchio di raggio 1, cioè π. Se misuri l'angolo in gradi, la formula si porta dietro uno scomodo fattore π/180 nell'esponente.",
        ],
      },
    ],
    experimentsHeading: "Da provare",
    experiments: [
      {
        title: "Cogli il momento dell'identità",
        text: "Imposta la velocità a 0,05 e premi «Avvia» da θ = 0. Dopo circa un minuto il punto raggiunge π, il piano lampeggia di rosa e la scritta resta visibile per quasi un secondo. Con il valore predefinito 0,6 la stessa finestra passa in un batter d'occhio.",
      },
      {
        title: "Leggi cos e sin sulla circonferenza",
        text: "Trascina θ lentamente da 0 a π/2. Sul piano il punto sale e si sposta a sinistra; nella striscia la curva ciano di sin sale fino a 1 mentre la curva ambra di cos scende fino a 0. A π/2 il riquadro mostra z = 0.000 + 1.000 i, cioè i.",
      },
      {
        title: "Trova dove cos è uguale a sin",
        text: "Porta il cursore a circa 0,785 radianti, ovvero 45 gradi. Il punto sta sulla diagonale, le due linee tratteggiate hanno la stessa lunghezza e la lettura mostra cos θ e sin θ entrambi vicini a 0,7071, cioè 1/√2.",
      },
      {
        title: "Moltiplica per i con un quarto di giro",
        text: "Clicca i pulsanti in ordine: 0, π/2, π, 3π/2, 2π. Ogni clic aggiunge π/2 a θ, il che moltiplica il punto per e^(iπ/2) = i. I punti di arrivo 1, i, −1, −i, 1 sono esattamente le potenze di i.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Vê a fórmula de Euler e^(iθ) = cos θ + i sin θ em movimento: arrasta o ângulo pela circunferência unitária, segue as ondas e chega a e^(iπ) + 1 = 0.",
    heading: "Como funciona este explorador",
    intro:
      "A tela grande é o plano complexo, com os números reais da esquerda para a direita e os imaginários para cima. O ponto brilhante é e^(iθ) para o ângulo θ atual. À medida que θ cresce, o ponto percorre no sentido anti-horário a circunferência de raio 1, o arco já varrido é desenhado a âmbar e linhas tracejadas descem do ponto até aos dois eixos. A faixa de baixo traça cos θ e sin θ ao longo de uma volta completa, com um cursor no ângulo atual: a circunferência e as duas ondas são um único movimento.",
    sections: [
      {
        heading: "Uma fórmula, três leituras",
        paragraphs: [
          "A fórmula de Euler diz que elevar e a uma potência imaginária dá um ponto da circunferência unitária. A parte real de e^(iθ) é cos θ e a parte imaginária é sin θ. Leonhard Euler publicou-a na sua Introductio in analysin infinitorum em 1748, e uma maneira de ver porque é verdadeira é substituir iθ na série de potências da função exponencial. As potências de i percorrem em ciclo i, −1, −i, 1, pelo que os termos pares se juntam na série de cos θ e os ímpares em i vezes a série de sin θ.",
          "A segunda leitura é sobre movimento. A derivada de e^(iθ) em ordem a θ é i·e^(iθ), e multiplicar por i roda um número complexo um quarto de volta. Portanto a velocidade do ponto faz sempre um ângulo reto com a sua posição e tem sempre comprimento 1. Um ponto que se move com rapidez unitária e sempre de lado em relação ao seu próprio raio só pode andar às voltas num círculo, e θ é exatamente a distância percorrida ao longo dele.",
          "A terceira leitura é o famoso caso particular. Em θ = π o ponto percorreu meia circunferência e está em −1, logo e^(iπ) + 1 = 0, uma equação que liga e, i, π, 1 e 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "O cursor «Ângulo θ» vai de 0 a 2π em passos de 0,01 radianos. Os cinco botões por baixo saltam para os quartos de volta 0, π/2, π, 3π/2 e 2π, e têm como etiqueta o sítio onde o ponto vai parar: 1, i, −1, −i e outra vez 1. O quadro no canto do plano mostra θ, cos θ, sin θ e o ponto escrito como a + bi.",
          "«Reproduzir» anima θ a uma velocidade angular constante, definida pelo cursor «Velocidade» entre 0,05 e 3 radianos por segundo (0,6 por omissão, pelo que uma volta completa demora cerca de 10,5 segundos). Quando θ passa de 2π, volta a 0. «Repor» põe θ outra vez em 0. Sempre que θ está a menos de 0,02 radianos de π, o ponto fica cor-de-rosa, o plano ganha um leve véu rosado e aparece no topo a faixa e^(iπ) + 1 = 0.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "As duas imagens são telas 2D dimensionadas pela densidade de píxeis do dispositivo. Não há um ciclo de animação permanente: cada tela só é redesenhada quando muda θ, o tamanho da tela ou o contador de reposições, o que significa que uma página parada não desenha absolutamente nada.",
          "O ciclo de animação só existe enquanto «Reproduzir» está ativo. Em cada fotograma mede o tempo desde o fotograma anterior, limita-o a 0,05 segundos para que o regresso a um separador em segundo plano não atire o ponto para longe, soma a θ a velocidade vezes o tempo decorrido e reconduz o resultado ao intervalo de 0 a 2π. Como a página abre em pausa e só se mexe quando carregas em «Reproduzir», não há nada a desligar para o movimento reduzido; arrastar o cursor funciona da mesma maneira nos dois casos.",
          "O renderizador converte θ em coordenadas de ecrã com um cosseno e um seno. O sinal de menos na coordenada y é a única subtileza: o y da tela aponta para baixo, o y matemático aponta para cima.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Porque é que aqui os ângulos se medem em radianos",
        paragraphs: [
          "A fórmula só funciona de forma tão limpa quando θ está em radianos, em que um radiano é o ângulo cujo arco na circunferência unitária tem comprimento 1. É por isso que θ é também o comprimento do arco âmbar: em θ = π o arco é metade do perímetro de uma circunferência de raio 1, ou seja, π. Se medires o ângulo em graus, a fórmula ganha um incómodo fator π/180 no expoente.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Apanha o momento da identidade",
        text: "Põe a velocidade em 0,05 e carrega em «Reproduzir» a partir de θ = 0. Passado cerca de um minuto o ponto chega a π, o plano pisca a rosa e a faixa fica visível quase um segundo. Com o valor por omissão de 0,6, a mesma janela passa num piscar de olhos.",
      },
      {
        title: "Lê cos e sin na circunferência",
        text: "Arrasta θ devagar de 0 a π/2. No plano, o ponto sobe e desloca-se para a esquerda; na faixa, a curva ciano de sin sobe até 1 enquanto a curva âmbar de cos desce até 0. Em π/2 o quadro mostra z = 0.000 + 1.000 i, que é i.",
      },
      {
        title: "Descobre onde cos é igual a sin",
        text: "Leva o cursor até cerca de 0,785 radianos, ou 45 graus. O ponto fica na diagonal, as duas linhas tracejadas têm o mesmo comprimento e a leitura mostra cos θ e sin θ ambos perto de 0,7071, que é 1/√2.",
      },
      {
        title: "Multiplica por i com um quarto de volta",
        text: "Clica nos botões por ordem: 0, π/2, π, 3π/2, 2π. Cada clique soma π/2 a θ, o que multiplica o ponto por e^(iπ/2) = i. Os pontos de chegada 1, i, −1, −i, 1 são exatamente as potências de i.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Se Eulers formel e^(iθ) = cos θ + i sin θ i rörelse: dra vinkeln runt enhetscirkeln, följ hur cos och sin ritar sina vågor och landa på e^(iπ) + 1 = 0.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Den stora ytan är det komplexa talplanet, med de reella talen från vänster till höger och de imaginära uppåt. Den lysande punkten är e^(iθ) för den aktuella vinkeln θ. När θ växer rör sig punkten moturs runt cirkeln med radien 1, den båge den har svept över ritas i bärnsten, och streckade linjer går från punkten ner till båda axlarna. Remsan under ritar cos θ och sin θ över ett helt varv, med en markör vid den aktuella vinkeln: cirkeln och de två vågorna är en och samma rörelse.",
    sections: [
      {
        heading: "En formel, tre läsningar",
        paragraphs: [
          "Eulers formel säger att e upphöjt till en imaginär exponent ger en punkt på enhetscirkeln. Realdelen av e^(iθ) är cos θ och imaginärdelen är sin θ. Leonhard Euler publicerade den i sin Introductio in analysin infinitorum 1748, och ett sätt att se varför den gäller är att sätta in iθ i exponentialfunktionens potensserie. Potenserna av i går runt i, −1, −i, 1, så de jämna termerna samlas till serien för cos θ och de udda till i gånger serien för sin θ.",
          "Den andra läsningen handlar om rörelse. Derivatan av e^(iθ) med avseende på θ är i·e^(iθ), och att multiplicera med i vrider ett komplext tal ett kvarts varv. Punktens hastighet är alltså alltid vinkelrät mot dess läge och har alltid längden 1. En punkt som rör sig med farten 1 och alltid i sidled mot sin egen radie kan bara gå runt i en cirkel, och θ är exakt den sträcka den har färdats längs den.",
          "Den tredje läsningen är det berömda specialfallet. Vid θ = π har punkten färdats halva cirkeln och ligger på −1, så e^(iπ) + 1 = 0, en ekvation som knyter ihop e, i, π, 1 och 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Reglaget ”Vinkel θ” går från 0 till 2π i steg om 0,01 radianer. De fem knapparna under hoppar till kvartsvarven 0, π/2, π, 3π/2 och 2π, märkta med var punkten hamnar: 1, i, −1, −i och 1 igen. Rutan i planets hörn visar θ, cos θ, sin θ och punkten skriven som a + bi.",
          "”Spela” animerar θ med konstant vinkelhastighet, som ställs in med reglaget ”Hastighet” från 0,05 till 3 radianer per sekund (standard 0,6, så ett helt varv tar ungefär 10,5 sekunder). När θ passerar 2π börjar den om från 0. ”Återställ” sätter θ till 0 igen. Så snart θ ligger inom 0,02 radianer från π blir punkten rosa, planet får en svag rosa ton och texten e^(iπ) + 1 = 0 visas högst upp.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Båda bilderna är 2D-canvasar som anpassas efter enhetens pixeltäthet. Det finns ingen permanent animationsslinga: varje canvas ritas om bara när θ, canvasens storlek eller återställningsräknaren ändras, vilket betyder att en sida i vila inte ritar någonting alls.",
          "Animationsslingan finns bara medan ”Spela” är aktivt. Varje bildruta mäter den tiden sedan den förra bildrutan, begränsar den till 0,05 sekunder så att punkten inte slungas iväg när du kommer tillbaka till en flik i bakgrunden, lägger hastigheten gånger den förflutna tiden till θ och för tillbaka resultatet till intervallet 0 till 2π. Eftersom sidan öppnas pausad och bara rör sig när du trycker på ”Spela” finns det inget att stänga av för reducerad rörelse. Att dra i reglaget fungerar likadant i båda fallen.",
          "Renderaren räknar om θ till skärmkoordinater med en cosinus och en sinus. Minustecknet på y-koordinaten är den enda finessen: canvasens y pekar nedåt, det matematiska y pekar uppåt.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Varför vinklarna mäts i radianer här",
        paragraphs: [
          "Formeln blir bara så här prydlig när θ anges i radianer, där en radian är den vinkel vars båge på enhetscirkeln har längden 1. Därför är θ också längden på den bärnstensfärgade bågen: vid θ = π är bågen halva omkretsen av en cirkel med radien 1, alltså π. Mäter du vinkeln i grader får formeln i stället en besvärlig faktor π/180 i exponenten.",
        ],
      },
    ],
    experimentsHeading: "Testa det här",
    experiments: [
      {
        title: "Fånga identitetens ögonblick",
        text: "Sätt hastigheten till 0,05 och tryck på ”Spela” från θ = 0. Efter ungefär en minut når punkten π, planet blinkar till i rosa och texten ligger kvar i nästan en sekund. Med standardvärdet 0,6 passerar samma fönster på ett ögonblick.",
      },
      {
        title: "Läs av cos och sin på cirkeln",
        text: "Dra θ långsamt från 0 till π/2. I planet stiger punkten och rör sig åt vänster. I remsan klättrar den cyanfärgade sin-kurvan till 1 medan den bärnstensfärgade cos-kurvan sjunker till 0. Vid π/2 visar rutan z = 0.000 + 1.000 i, alltså i.",
      },
      {
        title: "Hitta var cos är lika med sin",
        text: "Flytta reglaget till ungefär 0,785 radianer, eller 45 grader. Punkten ligger på diagonalen, de två streckade linjerna är lika långa, och avläsningen visar cos θ och sin θ som båda ligger nära 0,7071, vilket är 1/√2.",
      },
      {
        title: "Multiplicera med i genom ett kvarts varv",
        text: "Klicka på knapparna i ordning: 0, π/2, π, 3π/2, 2π. Varje klick lägger π/2 till θ, vilket multiplicerar punkten med e^(iπ/2) = i. Landningspunkterna 1, i, −1, −i, 1 är precis potenserna av i.",
      },
    ],
  },
  no: {
    metaDescription:
      "Se Eulers formel e^(iθ) = cos θ + i sin θ i bevegelse: dra vinkelen rundt enhetssirkelen, følg bølgene til cos og sin, og land på e^(iπ) + 1 = 0.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Det store lerretet er det komplekse planet, med de reelle tallene fra venstre mot høyre og de imaginære oppover. Det lysende punktet er e^(iθ) for den gjeldende vinkelen θ. Når θ vokser, beveger punktet seg mot klokka rundt sirkelen med radius 1, buen det har sveipet over, tegnes i rav, og stiplede linjer går fra punktet ned til begge aksene. Stripen under tegner cos θ og sin θ over en hel omdreining, med en markør ved den gjeldende vinkelen: sirkelen og de to bølgene er én og samme bevegelse.",
    sections: [
      {
        heading: "Én formel, tre lesemåter",
        paragraphs: [
          "Eulers formel sier at e opphøyd i en imaginær eksponent gir et punkt på enhetssirkelen. Realdelen av e^(iθ) er cos θ, og imaginærdelen er sin θ. Leonhard Euler publiserte den i sin Introductio in analysin infinitorum i 1748, og én måte å se hvorfor den holder på, er å sette iθ inn i potensrekken til eksponentialfunksjonen. Potensene av i går i ring gjennom i, −1, −i, 1, så de jevne leddene samles til rekken for cos θ og de odde til i ganger rekken for sin θ.",
          "Den andre lesemåten handler om bevegelse. Den deriverte av e^(iθ) med hensyn på θ er i·e^(iθ), og å multiplisere med i dreier et komplekst tall en kvart omdreining. Hastigheten til punktet står altså alltid vinkelrett på posisjonen og har alltid lengde 1. Et punkt som beveger seg med fart 1 og alltid sidelengs i forhold til sin egen radius, kan bare gå rundt i en sirkel, og θ er nøyaktig strekningen det har tilbakelagt langs den.",
          "Den tredje lesemåten er det berømte spesialtilfellet. Ved θ = π har punktet tilbakelagt halve sirkelen og ligger på −1, så e^(iπ) + 1 = 0, en ligning som knytter sammen e, i, π, 1 og 0.",
        ],
        formula: EULER_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Glidebryteren «Vinkel θ» går fra 0 til 2π i steg på 0,01 radianer. De fem knappene under hopper til kvartomdreiningene 0, π/2, π, 3π/2 og 2π, merket med hvor punktet lander: 1, i, −1, −i og 1 igjen. Feltet i hjørnet av planet viser θ, cos θ, sin θ og punktet skrevet som a + bi.",
          "«Spill» animerer θ med konstant vinkelhastighet, som stilles inn med glidebryteren «Fart» fra 0,05 til 3 radianer per sekund (standard 0,6, så en hel omdreining tar omtrent 10,5 sekunder). Når θ passerer 2π, begynner den på 0 igjen. «Nullstill» setter θ tilbake til 0. Så snart θ er innenfor 0,02 radianer fra π, blir punktet rosa, planet får et svakt rosa skjær, og banneret e^(iπ) + 1 = 0 vises øverst.",
        ],
      },
      {
        heading: "Hvordan den er bygget",
        paragraphs: [
          "Begge bildene er 2D-lerreter som tilpasses pikseltettheten til enheten. Det finnes ingen permanent animasjonsløkke: hvert lerret tegnes på nytt bare når θ, lerretsstørrelsen eller nullstillingstelleren endres, noe som betyr at en side i ro ikke tegner noe som helst.",
          "Animasjonsløkken finnes bare mens «Spill» er aktiv. For hver rute måler den tiden siden forrige rute, begrenser den til 0,05 sekunder slik at punktet ikke slynges av gårde når du kommer tilbake til en fane i bakgrunnen, legger farten ganger den medgåtte tiden til θ og fører resultatet tilbake til intervallet fra 0 til 2π. Fordi siden åpner i pause og bare beveger seg når du trykker «Spill», er det ingenting å slå av for redusert bevegelse. Å dra i glidebryteren fungerer likt i begge tilfeller.",
          "Tegnekoden regner om θ til skjermkoordinater med én cosinus og én sinus. Minustegnet på y-koordinaten er den eneste finurligheten: y på lerretet peker nedover, matematisk y peker oppover.",
        ],
        code: TICK_EXCERPT,
      },
      {
        heading: "Hvorfor vinklene måles i radianer her",
        paragraphs: [
          "Formelen blir bare så ryddig når θ er i radianer, der én radian er vinkelen som har en bue med lengde 1 på enhetssirkelen. Derfor er θ også lengden på den ravfargede buen: ved θ = π er buen halve omkretsen av en sirkel med radius 1, altså π. Måler du vinkelen i grader i stedet, får formelen en klønete faktor π/180 i eksponenten.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Fang identitetens øyeblikk",
        text: "Sett farten til 0,05 og trykk «Spill» fra θ = 0. Etter omtrent et minutt når punktet π, planet blinker rosa, og banneret blir stående i nesten et sekund. Med standardverdien 0,6 passerer det samme vinduet på et blunk.",
      },
      {
        title: "Les av cos og sin på sirkelen",
        text: "Dra θ sakte fra 0 til π/2. I planet stiger punktet og flytter seg mot venstre. I stripen klatrer den cyanfargede sin-kurven til 1, mens den ravfargede cos-kurven faller til 0. Ved π/2 viser feltet z = 0.000 + 1.000 i, altså i.",
      },
      {
        title: "Finn hvor cos er lik sin",
        text: "Flytt glidebryteren til omtrent 0,785 radianer, eller 45 grader. Punktet ligger på diagonalen, de to stiplede linjene er like lange, og avlesningen viser cos θ og sin θ som begge ligger nær 0,7071, som er 1/√2.",
      },
      {
        title: "Multipliser med i med en kvart omdreining",
        text: "Klikk på knappene i rekkefølge: 0, π/2, π, 3π/2, 2π. Hvert klikk legger π/2 til θ, noe som multipliserer punktet med e^(iπ/2) = i. Landingspunktene 1, i, −1, −i, 1 er nettopp potensene av i.",
      },
    ],
  },
};
