import type { ExplorerGuide } from "./types";

// Numbers quoted here (the 500,000 symbol cap, iteration range 1 to 12, angle
// range 15° to 120°, start heading range −180° to 180°, preset values) match app/lsystem/explorer/page.tsx;
// update both together.
const TURTLE_EXCERPT = `function expand(axiom, rules, iterations) {
  let s = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const ch of s) {
      next += rules[ch] ?? ch;          // every symbol rewritten at once
      if (next.length > MAX_STRING) return next.slice(0, MAX_STRING);
    }
    s = next;
  }
  return s;
}

// Turtle: F G A B draw one unit, + and - turn, [ and ] push and pop state
if (isDraw(ch)) { x += Math.cos(h); y += Math.sin(h); }
else if (ch === "+") h += da;  else if (ch === "-") h -= da;`;

const KOCH_FORMULA = "F \\;\\to\\; F{+}F{-}F{-}F{+}F, \\qquad \\#F_n = 5^n";

export const LSYSTEM_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Build L-system fractals in the browser: edit axiom, rules and angle, grow the Koch snowflake, dragon or a fractal plant, and see how the turtle draws them.",
    heading: "How this explorer works",
    intro:
      "Every picture on this canvas starts as a short word, the axiom, and a handful of rewrite rules. The explorer applies the rules to every letter of the word at the same time, again and again, until the word is thousands of symbols long. Then a turtle walks through it letter by letter: some letters mean «step forward and draw a line», others mean «turn» or «remember where you are». Snowflakes, space-filling curves and branching plants all come out of the same tiny machine. Only the rules change.",
    sections: [
      {
        heading: "Rewriting in parallel",
        paragraphs: [
          "Lindenmayer systems, or L-systems, were introduced in 1968 by the Hungarian biologist Aristid Lindenmayer as a way to describe how simple organisms grow cell by cell. The key difference from ordinary grammars is that all symbols are replaced simultaneously, just as all cells of a filament divide in the same generation. A symbol without a rule is copied unchanged.",
          "Take the Koch curve preset: axiom F, one rule F → F+F-F-F+F. After one step there are 5 copies of F, after two steps 25, after n steps 5ⁿ. The string length grows to 2 · 5ⁿ − 1 symbols, so four iterations give 1,249 symbols and 625 line segments.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The eight presets load a complete system: Koch curve (90°, 4 iterations), Koch snowflake (60°, 4), Sierpiński arrowhead (60°, 6), Sierpiński triangle (120°, 5), dragon curve (90°, 12), fractal plant (25°, 5), Hilbert curve (90°, 5) and Lévy C curve (45°, 10). Picking one overwrites the axiom, rules, angle, start heading and iteration count. The Koch curve here is the square variant with right angles, not the classic 60° version; the snowflake preset shows the triangular one.",
          "The iterations slider runs from 1 to 12, the angle slider from 15° to 120° in whole degrees. The angle is the amount the turtle turns on every + or − symbol, and since it is applied hundreds of times, a change of a single degree can bend a neat curve into a spiral. The axiom field and the rules box are fully editable. Write one rule per line in the form X = …; each left-hand side must be a single character, and lines that do not parse are ignored. Start heading (−180° to 180° in steps of 5°) is the direction the turtle faces before its first step: 0° points right and −90° straight up. The plant preset sets it to −65°, every other preset to 0°, and it stays where you put it while you edit the axiom and rules. The colour buttons only change the stroke.",
          "The counter below the canvas shows the length of the generated string. If a system grows past 500,000 symbols, the expansion stops right there and an amber warning appears. What you see in that case is the beginning of the next generation, not the complete fractal.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The expansion is a plain loop over the string with a lookup in the rules object, recomputed only when the axiom, the rules or the iteration count change. Drawing happens on a 2D canvas in two passes over the same string. The first pass walks the turtle without drawing and records the bounding box. From that box the code computes one uniform scale factor and an offset, so the figure always fills the canvas with a 24 pixel margin, whether it has 10 segments or 100,000. The second pass walks again and adds every segment to a single path, which is stroked once at the end.",
          "Four letters draw: F, G, A and B. Every other letter is invisible to the turtle, which is exactly why the dragon and Hilbert presets use X and Y: they steer how the string grows without leaving marks. The brackets push the current position and heading onto a stack and pop them back, which is what lets the fractal plant grow side branches and then return to the stem. There is no animation, so the canvas only redraws when a control changes or the window is resized, and reduced-motion settings need no special handling.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Why the angle is part of the rules",
        paragraphs: [
          "The rules decide the combinatorics, the angle decides the geometry. The dragon curve string is a sequence of left and right turns; at 90° the curve touches itself at corners but never runs along the same segment twice, while the same string drawn at a different angle can pile segments on top of each other. In other words, an L-system is not a picture: it is a recipe that only becomes a particular fractal once you fix how far the turtle turns.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Hit the symbol cap",
        text: "Load the Koch curve and raise the iterations to 7. The string has 156,249 symbols and still draws completely. Go to 8 and the full string would need 781,249 symbols, so the cap kicks in and only part of the curve appears.",
      },
      {
        title: "Bend the dragon",
        text: "Load the dragon curve and move the angle from 90° down to 80° and then 60°. The same sequence of turns no longer closes into the familiar dragon and starts folding into overlapping spirals.",
      },
      {
        title: "Change the wind on the plant",
        text: "Load the fractal plant and try 15°, 25° and 35°. Small angles grow a narrow reed, large ones a sprawling bush. The branching structure is identical; only the turn changes.",
      },
      {
        title: "Write your own system",
        text: "Set the start heading to −90° so the turtle starts straight up. Then set the axiom to F, the rules to F = F[+F]F[-F]F, the angle to 25° and the iterations to 5. You get a branching weed from a single rule, because each bracket pair spawns a side shoot that returns to its stem.",
      },
    ],
  },
  de: {
    metaDescription:
      "L-System-Fraktale im Browser bauen: Axiom, Regeln und Winkel ändern, Koch-Schneeflocke, Drachenkurve oder Fraktalpflanze wachsen lassen, die Turtle verstehen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Jedes Bild auf diesem Canvas beginnt als kurzes Wort, das Axiom, und eine Handvoll Ersetzungsregeln. Der Explorer wendet die Regeln auf alle Buchstaben des Worts gleichzeitig an, immer wieder, bis das Wort Tausende Zeichen lang ist. Dann läuft eine Turtle Buchstabe für Buchstabe hindurch: Manche Zeichen bedeuten «geh vorwärts und zieh eine Linie», andere «dreh dich» oder «merk dir, wo du bist». Schneeflocken, raumfüllende Kurven und verzweigte Pflanzen entstehen alle aus derselben winzigen Maschine. Nur die Regeln ändern sich.",
    sections: [
      {
        heading: "Paralleles Ersetzen",
        paragraphs: [
          "Lindenmayer-Systeme, kurz L-Systeme, führte der ungarische Biologe Aristid Lindenmayer 1968 ein, um zu beschreiben, wie einfache Organismen Zelle für Zelle wachsen. Der entscheidende Unterschied zu gewöhnlichen Grammatiken: Alle Zeichen werden gleichzeitig ersetzt, so wie sich alle Zellen eines Zellfadens in derselben Generation teilen. Ein Zeichen ohne Regel wird unverändert übernommen.",
          "Nimm die Vorlage Koch-Kurve: Axiom F, eine Regel F → F+F-F-F+F. Nach einem Schritt gibt es 5 Kopien von F, nach zwei Schritten 25, nach n Schritten 5ⁿ. Die Zeichenkette wächst auf 2 · 5ⁿ − 1 Zeichen, vier Iterationen ergeben also 1.249 Zeichen und 625 Liniensegmente.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die acht Vorlagen laden jeweils ein komplettes System: Koch-Kurve (90°, 4 Iterationen), Koch-Schneeflocke (60°, 4), Sierpiński-Pfeilspitze (60°, 6), Sierpiński-Dreieck (120°, 5), Drachenkurve (90°, 12), Fraktalpflanze (25°, 5), Hilbert-Kurve (90°, 5) und Lévy-C-Kurve (45°, 10). Wählst du eine aus, werden Axiom, Regeln, Winkel, Startrichtung und Iterationszahl überschrieben. Die Koch-Kurve ist hier die eckige Variante mit rechten Winkeln, nicht die klassische mit 60°; die dreieckige Form zeigt die Schneeflocke.",
          "Der Iterationsregler reicht von 1 bis 12, der Winkelregler von 15° bis 120° in ganzen Grad. Der Winkel ist der Betrag, um den sich die Turtle bei jedem + oder − dreht. Weil er Hunderte Male angewendet wird, kann schon ein Grad Unterschied eine saubere Kurve in eine Spirale verbiegen. Axiom und Regelfeld sind frei bearbeitbar. Schreib eine Regel pro Zeile in der Form X = …; die linke Seite muss genau ein Zeichen sein, Zeilen, die sich nicht lesen lassen, werden ignoriert. Der Regler «Start heading» (−180° bis 180° in Schritten von 5°) ist die Richtung, in die die Turtle vor ihrem ersten Schritt schaut: 0° zeigt nach rechts, −90° senkrecht nach oben. Die Pflanzen-Vorlage setzt ihn auf −65°, jede andere auf 0°, und er bleibt, wo du ihn hinstellst, während du Axiom und Regeln bearbeitest. Die Farbknöpfe ändern nur die Linienfarbe.",
          "Der Zähler unter dem Canvas zeigt die Länge der erzeugten Zeichenkette. Wächst ein System über 500.000 Zeichen, bricht die Expansion genau dort ab, und ein bernsteinfarbener Hinweis erscheint. Was du dann siehst, ist der Anfang der nächsten Generation, nicht das vollständige Fraktal.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Expansion ist eine schlichte Schleife über die Zeichenkette mit einem Nachschlagen im Regelobjekt. Sie wird nur neu berechnet, wenn sich Axiom, Regeln oder Iterationszahl ändern. Gezeichnet wird auf einem 2D-Canvas in zwei Durchgängen über dieselbe Zeichenkette. Im ersten läuft die Turtle, ohne zu zeichnen, und merkt sich den umgebenden Rahmen. Daraus berechnet der Code einen einheitlichen Skalierungsfaktor und einen Versatz, sodass die Figur das Canvas immer mit 24 Pixeln Rand ausfüllt, egal ob sie 10 oder 100.000 Segmente hat. Im zweiten Durchgang läuft die Turtle erneut und hängt jedes Segment an einen einzigen Pfad, der am Ende einmal gezeichnet wird.",
          "Vier Buchstaben zeichnen: F, G, A und B. Alle anderen sind für die Turtle unsichtbar, und genau deshalb verwenden die Drachen- und die Hilbert-Vorlage X und Y: Sie steuern, wie die Zeichenkette wächst, ohne Spuren zu hinterlassen. Die eckigen Klammern legen Position und Richtung auf einen Stapel und holen sie wieder zurück. So kann die Fraktalpflanze Seitenäste treiben und danach zum Stängel zurückkehren. Es gibt keine Animation: Das Canvas zeichnet nur neu, wenn sich ein Regler ändert oder das Fenster seine Größe wechselt, eine Einstellung für reduzierte Bewegung braucht deshalb keine Sonderbehandlung.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Warum der Winkel zu den Regeln gehört",
        paragraphs: [
          "Die Regeln legen die Kombinatorik fest, der Winkel die Geometrie. Die Zeichenkette der Drachenkurve ist eine Folge von Links- und Rechtsdrehungen. Bei 90° berührt sich die Kurve an Ecken, läuft aber nie zweimal über dasselbe Segment; mit einem anderen Winkel kann dieselbe Zeichenkette Segmente übereinanderstapeln. Ein L-System ist also kein Bild, sondern ein Rezept, das erst zu einem bestimmten Fraktal wird, wenn du festlegst, wie weit sich die Turtle dreht.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Zeichengrenze erreichen",
        text: "Lade die Koch-Kurve und erhöhe auf 7 Iterationen. Die Zeichenkette hat 156.249 Zeichen und wird noch vollständig gezeichnet. Bei 8 bräuchte sie 781.249 Zeichen, die Grenze greift, und nur ein Teil der Kurve erscheint.",
      },
      {
        title: "Den Drachen verbiegen",
        text: "Lade die Drachenkurve und schieb den Winkel von 90° auf 80° und dann auf 60°. Dieselbe Folge von Drehungen schließt sich nicht mehr zum vertrauten Drachen, sondern faltet sich zu überlappenden Spiralen.",
      },
      {
        title: "Wind für die Pflanze",
        text: "Lade die Fraktalpflanze und probier 15°, 25° und 35°. Kleine Winkel lassen ein schmales Schilf wachsen, große einen ausladenden Busch. Die Verzweigungsstruktur bleibt identisch, nur die Drehung ändert sich.",
      },
      {
        title: "Schreib dein eigenes System",
        text: "Stell «Start heading» auf −90°, damit die Turtle senkrecht nach oben startet. Setz dann das Axiom auf F, die Regel auf F = F[+F]F[-F]F, den Winkel auf 25° und die Iterationen auf 5. Aus einer einzigen Regel wächst ein verzweigtes Kraut, weil jedes Klammerpaar einen Seitentrieb erzeugt, der zu seinem Stängel zurückkehrt.",
      },
    ],
  },
  es: {
    metaDescription:
      "Crea fractales con sistemas L en el navegador: edita axioma, reglas y ángulo, haz crecer el copo de Koch, el dragón o una planta y mira cómo dibuja la tortuga.",
    heading: "Cómo funciona este explorador",
    intro:
      "Cada imagen de este lienzo empieza como una palabra corta, el axioma, y un puñado de reglas de reescritura. El explorador aplica las reglas a todas las letras de la palabra a la vez, una y otra vez, hasta que la palabra tiene miles de símbolos. Entonces una tortuga la recorre letra a letra: algunas letras significan «avanza un paso y dibuja una línea», otras «gira» o «recuerda dónde estás». Copos de nieve, curvas que llenan el plano y plantas ramificadas salen todos de la misma máquina diminuta. Solo cambian las reglas.",
    sections: [
      {
        heading: "Reescritura en paralelo",
        paragraphs: [
          "Los sistemas de Lindenmayer, o sistemas L, los introdujo en 1968 el biólogo húngaro Aristid Lindenmayer para describir cómo crecen, célula a célula, los organismos sencillos. La diferencia clave con las gramáticas habituales es que todos los símbolos se sustituyen simultáneamente, igual que todas las células de un filamento se dividen en la misma generación. Un símbolo sin regla se copia tal cual.",
          "Toma el preajuste de la curva de Koch: axioma F, una sola regla F → F+F-F-F+F. Tras un paso hay 5 copias de F, tras dos pasos 25, tras n pasos 5ⁿ. La longitud de la cadena crece hasta 2 · 5ⁿ − 1 símbolos, de modo que cuatro iteraciones dan 1249 símbolos y 625 segmentos.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los ocho preajustes cargan un sistema completo: curva de Koch (90°, 4 iteraciones), copo de nieve de Koch (60°, 4), curva punta de flecha de Sierpiński (60°, 6), triángulo de Sierpiński (120°, 5), curva del dragón (90°, 12), planta fractal (25°, 5), curva de Hilbert (90°, 5) y curva C de Lévy (45°, 10). Al elegir uno se sobrescriben el axioma, las reglas, el ángulo, la orientación inicial y el número de iteraciones. La curva de Koch es aquí la variante cuadrada con ángulos rectos, no la versión clásica de 60°; la triangular la muestra el preajuste del copo de nieve.",
          "El control de iteraciones va de 1 a 12, el del ángulo de 15° a 120° en grados enteros. El ángulo es lo que gira la tortuga en cada símbolo + o −, y como se aplica cientos de veces, un cambio de un solo grado puede torcer una curva pulcra hasta convertirla en espiral. El campo del axioma y el cuadro de reglas se pueden editar libremente. Escribe una regla por línea con la forma X = …; cada lado izquierdo debe ser un único carácter, y las líneas que no se pueden interpretar se ignoran. «Start heading» (de −180° a 180° en pasos de 5°) es la dirección hacia la que mira la tortuga antes de su primer paso: 0° apunta a la derecha y −90° directamente hacia arriba. El preajuste de la planta lo fija en −65°, todos los demás en 0°, y se queda donde lo pongas mientras editas el axioma y las reglas. Los botones de color solo cambian el trazo.",
          "El contador bajo el lienzo muestra la longitud de la cadena generada. Si un sistema crece por encima de 500 000 símbolos, la expansión se detiene justo ahí y aparece un aviso de color ámbar. Lo que ves en ese caso es el comienzo de la siguiente generación, no el fractal completo.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La expansión es un simple bucle sobre la cadena con una consulta en el objeto de reglas, y solo se recalcula cuando cambian el axioma, las reglas o el número de iteraciones. El dibujo se hace en un lienzo 2D en dos pasadas sobre la misma cadena. En la primera la tortuga camina sin dibujar y registra el rectángulo envolvente. A partir de él, el código calcula un único factor de escala uniforme y un desplazamiento, de modo que la figura siempre llena el lienzo con un margen de 24 píxeles, tenga 10 segmentos o 100 000. En la segunda pasada vuelve a caminar y añade cada segmento a un único trazado, que se pinta una sola vez al final.",
          "Cuatro letras dibujan: F, G, A y B. Todas las demás son invisibles para la tortuga, y justo por eso los preajustes del dragón y de Hilbert usan X e Y: dirigen cómo crece la cadena sin dejar marcas. Los corchetes apilan la posición y la orientación actuales en una pila y las recuperan después, que es lo que permite a la planta fractal echar ramas laterales y volver luego al tallo. No hay animación, así que el lienzo solo se redibuja cuando cambia un control o se redimensiona la ventana, y los ajustes de movimiento reducido no necesitan ningún tratamiento especial.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Por qué el ángulo forma parte de las reglas",
        paragraphs: [
          "Las reglas deciden la combinatoria; el ángulo, la geometría. La cadena de la curva del dragón es una sucesión de giros a izquierda y derecha; a 90° la curva se toca a sí misma en las esquinas pero nunca recorre dos veces el mismo segmento, mientras que la misma cadena dibujada con otro ángulo puede apilar segmentos unos sobre otros. Dicho de otro modo, un sistema L no es una imagen: es una receta que solo se convierte en un fractal concreto cuando fijas cuánto gira la tortuga.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Llega al límite de símbolos",
        text: "Carga la curva de Koch y sube las iteraciones a 7. La cadena tiene 156 249 símbolos y aún se dibuja entera. Pasa a 8 y la cadena completa necesitaría 781 249 símbolos, así que el límite entra en acción y solo aparece una parte de la curva.",
      },
      {
        title: "Tuerce el dragón",
        text: "Carga la curva del dragón y baja el ángulo de 90° a 80° y luego a 60°. La misma sucesión de giros ya no se cierra en el dragón de siempre y empieza a plegarse en espirales que se solapan.",
      },
      {
        title: "Cambia el viento de la planta",
        text: "Carga la planta fractal y prueba con 15°, 25° y 35°. Los ángulos pequeños hacen crecer un junco estrecho; los grandes, un arbusto desparramado. La estructura de ramificación es idéntica; solo cambia el giro.",
      },
      {
        title: "Escribe tu propio sistema",
        text: "Pon «Start heading» en −90° para que la tortuga arranque hacia arriba. Después fija el axioma en F, las reglas en F = F[+F]F[-F]F, el ángulo en 25° y las iteraciones en 5. Obtienes una hierba ramificada a partir de una sola regla, porque cada par de corchetes genera un brote lateral que vuelve a su tallo.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Crée des fractales par L-système dans le navigateur : modifie axiome, règles et angle, fais pousser le flocon de Koch, le dragon ou une plante avec la tortue.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Chaque image de ce canevas commence par un mot court, l'axiome, et une poignée de règles de réécriture. L'explorateur applique les règles à toutes les lettres du mot en même temps, encore et encore, jusqu'à ce que le mot compte des milliers de symboles. Une tortue le parcourt alors lettre par lettre : certaines lettres signifient « avance d'un pas et trace un trait », d'autres « tourne » ou « retiens où tu es ». Flocons de neige, courbes remplissant le plan et plantes ramifiées sortent tous de la même machine minuscule. Seules les règles changent.",
    sections: [
      {
        heading: "Réécrire en parallèle",
        paragraphs: [
          "Les systèmes de Lindenmayer, ou L-systèmes, ont été introduits en 1968 par le biologiste hongrois Aristid Lindenmayer pour décrire la croissance, cellule par cellule, d'organismes simples. La différence essentielle avec les grammaires ordinaires est que tous les symboles sont remplacés simultanément, tout comme toutes les cellules d'un filament se divisent à la même génération. Un symbole sans règle est recopié tel quel.",
          "Prends le préréglage de la courbe de Koch : axiome F, une seule règle F → F+F-F-F+F. Après une étape il y a 5 copies de F, après deux étapes 25, après n étapes 5ⁿ. La longueur de la chaîne atteint 2 · 5ⁿ − 1 symboles : quatre itérations donnent donc 1\u00a0249 symboles et 625 segments.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les huit préréglages chargent chacun un système complet : courbe de Koch (90°, 4 itérations), flocon de Koch (60°, 4), courbe en pointe de flèche de Sierpiński (60°, 6), triangle de Sierpiński (120°, 5), courbe du dragon (90°, 12), plante fractale (25°, 5), courbe de Hilbert (90°, 5) et courbe C de Lévy (45°, 10). En choisir un écrase l'axiome, les règles, l'angle, l'orientation de départ et le nombre d'itérations. La courbe de Koch est ici la variante carrée à angles droits, pas la version classique à 60° ; la forme triangulaire, c'est le préréglage du flocon qui la montre.",
          "Le curseur des itérations va de 1 à 12, celui de l'angle de 15° à 120° par degrés entiers. L'angle est la quantité dont la tortue tourne à chaque symbole + ou −, et comme il est appliqué des centaines de fois, un écart d'un seul degré peut tordre une courbe bien nette en spirale. Le champ de l'axiome et la zone des règles sont entièrement modifiables. Écris une règle par ligne sous la forme X = … ; chaque membre de gauche doit être un caractère unique, et les lignes impossibles à interpréter sont ignorées. « Start heading » (de −180° à 180° par pas de 5°) est la direction vers laquelle la tortue regarde avant son premier pas : 0° pointe vers la droite et −90° droit vers le haut. Le préréglage de la plante le fixe à −65°, tous les autres à 0°, et il reste là où tu l'as mis pendant que tu modifies l'axiome et les règles. Les boutons de couleur ne changent que le trait.",
          "Le compteur sous le canevas affiche la longueur de la chaîne générée. Si un système dépasse 500\u00a0000 symboles, l'expansion s'arrête à cet endroit précis et un avertissement ambré apparaît. Ce que tu vois alors est le début de la génération suivante, pas la fractale complète.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "L'expansion est une simple boucle sur la chaîne avec une recherche dans l'objet des règles, recalculée uniquement quand l'axiome, les règles ou le nombre d'itérations changent. Le dessin se fait sur un canevas 2D en deux passes sur la même chaîne. La première fait marcher la tortue sans dessiner et enregistre la boîte englobante. À partir de cette boîte, le code calcule un facteur d'échelle uniforme et un décalage, de sorte que la figure remplit toujours le canevas avec une marge de 24 pixels, qu'elle compte 10 segments ou 100\u00a0000. La seconde passe refait le parcours et ajoute chaque segment à un chemin unique, tracé une seule fois à la fin.",
          "Quatre lettres dessinent : F, G, A et B. Toutes les autres sont invisibles pour la tortue, et c'est exactement pour cela que les préréglages du dragon et de Hilbert utilisent X et Y : elles pilotent la croissance de la chaîne sans laisser de trace. Les crochets empilent la position et l'orientation courantes sur une pile puis les dépilent, ce qui permet à la plante fractale de pousser des branches latérales avant de revenir à la tige. Il n'y a pas d'animation : le canevas ne se redessine que lorsqu'un réglage change ou que la fenêtre est redimensionnée, et les préférences de réduction des animations ne demandent aucun traitement particulier.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Pourquoi l'angle fait partie des règles",
        paragraphs: [
          "Les règles décident de la combinatoire, l'angle décide de la géométrie. La chaîne de la courbe du dragon est une suite de virages à gauche et à droite ; à 90°, la courbe se touche aux coins mais ne parcourt jamais deux fois le même segment, alors que la même chaîne tracée avec un autre angle peut empiler des segments les uns sur les autres. Autrement dit, un L-système n'est pas une image : c'est une recette qui ne devient une fractale précise qu'une fois fixé l'angle dont tourne la tortue.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Atteins la limite de symboles",
        text: "Charge la courbe de Koch et monte les itérations à 7. La chaîne compte 156\u00a0249 symboles et se dessine encore en entier. Passe à 8 et la chaîne complète demanderait 781\u00a0249 symboles : la limite s'applique et seule une partie de la courbe apparaît.",
      },
      {
        title: "Tords le dragon",
        text: "Charge la courbe du dragon et fais descendre l'angle de 90° à 80° puis à 60°. La même suite de virages ne se referme plus en dragon familier et commence à se replier en spirales qui se chevauchent.",
      },
      {
        title: "Change le vent sur la plante",
        text: "Charge la plante fractale et essaie 15°, 25° et 35°. Les petits angles font pousser un roseau étroit, les grands un buisson étalé. La structure des ramifications est identique ; seul le virage change.",
      },
      {
        title: "Écris ton propre système",
        text: "Règle « Start heading » sur −90° pour que la tortue parte droit vers le haut. Mets ensuite l'axiome à F, les règles à F = F[+F]F[-F]F, l'angle à 25° et les itérations à 5. Tu obtiens une herbe ramifiée à partir d'une seule règle, car chaque paire de crochets fait naître une pousse latérale qui revient à sa tige.",
      },
    ],
  },
  it: {
    metaDescription:
      "Costruisci frattali con i sistemi L nel browser: modifica assioma, regole e angolo, fai crescere il fiocco di Koch, il drago o una pianta con la tartaruga.",
    heading: "Come funziona questo esploratore",
    intro:
      "Ogni immagine su questo canvas nasce da una parola breve, l'assioma, e da una manciata di regole di riscrittura. L'esploratore applica le regole a tutte le lettere della parola nello stesso momento, ancora e ancora, finché la parola è lunga migliaia di simboli. Poi una tartaruga la percorre lettera per lettera: alcune lettere significano «fai un passo avanti e traccia una linea», altre «gira» o «ricorda dove sei». Fiocchi di neve, curve che riempiono il piano e piante ramificate escono tutti dalla stessa minuscola macchina. Cambiano solo le regole.",
    sections: [
      {
        heading: "Riscrivere in parallelo",
        paragraphs: [
          "I sistemi di Lindenmayer, o sistemi L (L-system), furono introdotti nel 1968 dal biologo ungherese Aristid Lindenmayer per descrivere come gli organismi semplici crescono cellula per cellula. La differenza chiave rispetto alle grammatiche ordinarie è che tutti i simboli vengono sostituiti simultaneamente, proprio come tutte le cellule di un filamento si dividono nella stessa generazione. Un simbolo senza regola viene copiato tale e quale.",
          "Prendi il preset della curva di Koch: assioma F, una sola regola F → F+F-F-F+F. Dopo un passo ci sono 5 copie di F, dopo due passi 25, dopo n passi 5ⁿ. La lunghezza della stringa cresce fino a 2 · 5ⁿ − 1 simboli, quindi quattro iterazioni danno 1249 simboli e 625 segmenti.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Gli otto preset caricano un sistema completo: curva di Koch (90°, 4 iterazioni), fiocco di neve di Koch (60°, 4), curva a punta di freccia di Sierpiński (60°, 6), triangolo di Sierpiński (120°, 5), curva del drago (90°, 12), pianta frattale (25°, 5), curva di Hilbert (90°, 5) e curva C di Lévy (45°, 10). Sceglierne uno sovrascrive assioma, regole, angolo, orientamento iniziale e numero di iterazioni. La curva di Koch è qui la variante quadrata ad angoli retti, non la versione classica a 60°; quella triangolare la mostra il preset del fiocco di neve.",
          "Il cursore delle iterazioni va da 1 a 12, quello dell'angolo da 15° a 120° in gradi interi. L'angolo è la quantità di cui la tartaruga ruota a ogni simbolo + o −, e poiché viene applicato centinaia di volte, una variazione di un solo grado può piegare una curva ordinata in una spirale. Il campo dell'assioma e il riquadro delle regole sono liberamente modificabili. Scrivi una regola per riga nella forma X = …; ogni lato sinistro deve essere un singolo carattere, e le righe che non si riescono a interpretare vengono ignorate. «Start heading» (da −180° a 180° a passi di 5°) è la direzione verso cui guarda la tartaruga prima del primo passo: 0° punta a destra e −90° dritto verso l'alto. Il preset della pianta lo imposta a −65°, tutti gli altri a 0°, e resta dove lo metti mentre modifichi assioma e regole. I pulsanti del colore cambiano soltanto il tratto.",
          "Il contatore sotto il canvas mostra la lunghezza della stringa generata. Se un sistema cresce oltre 500.000 simboli, l'espansione si ferma esattamente lì e compare un avviso color ambra. Quello che vedi in quel caso è l'inizio della generazione successiva, non il frattale completo.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "L'espansione è un semplice ciclo sulla stringa con una ricerca nell'oggetto delle regole, ricalcolata solo quando cambiano l'assioma, le regole o il numero di iterazioni. Il disegno avviene su un canvas 2D in due passate sulla stessa stringa. Nella prima la tartaruga cammina senza disegnare e registra il rettangolo di ingombro. Da quel rettangolo il codice calcola un unico fattore di scala uniforme e uno scostamento, così la figura riempie sempre il canvas con un margine di 24 pixel, che abbia 10 segmenti o 100.000. Nella seconda passata cammina di nuovo e aggiunge ogni segmento a un unico tracciato, che viene disegnato una volta sola alla fine.",
          "Quattro lettere disegnano: F, G, A e B. Tutte le altre sono invisibili per la tartaruga, ed è proprio per questo che i preset del drago e di Hilbert usano X e Y: guidano la crescita della stringa senza lasciare segni. Le parentesi quadre mettono la posizione e l'orientamento correnti su una pila e poi li riprendono, ed è questo che permette alla pianta frattale di far crescere rami laterali e tornare poi al fusto. Non c'è animazione, quindi il canvas si ridisegna solo quando cambia un controllo o la finestra viene ridimensionata, e le impostazioni di movimento ridotto non richiedono alcuna gestione speciale.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Perché l'angolo fa parte delle regole",
        paragraphs: [
          "Le regole decidono la combinatoria, l'angolo decide la geometria. La stringa della curva del drago è una sequenza di svolte a sinistra e a destra; a 90° la curva tocca sé stessa negli angoli ma non percorre mai due volte lo stesso segmento, mentre la stessa stringa disegnata con un altro angolo può impilare segmenti uno sull'altro. In altre parole, un sistema L non è un'immagine: è una ricetta che diventa un frattale preciso solo quando stabilisci di quanto ruota la tartaruga.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Raggiungi il limite di simboli",
        text: "Carica la curva di Koch e porta le iterazioni a 7. La stringa ha 156.249 simboli e viene ancora disegnata per intero. Passa a 8 e la stringa completa richiederebbe 781.249 simboli, quindi scatta il limite e compare solo una parte della curva.",
      },
      {
        title: "Piega il drago",
        text: "Carica la curva del drago e porta l'angolo da 90° a 80° e poi a 60°. La stessa sequenza di svolte non si chiude più nel drago che conosci e comincia a ripiegarsi in spirali sovrapposte.",
      },
      {
        title: "Cambia il vento sulla pianta",
        text: "Carica la pianta frattale e prova 15°, 25° e 35°. Gli angoli piccoli fanno crescere una canna sottile, quelli grandi un cespuglio disordinato. La struttura delle ramificazioni è identica; cambia solo la svolta.",
      },
      {
        title: "Scrivi il tuo sistema",
        text: "Imposta «Start heading» a −90° così la tartaruga parte dritta verso l'alto. Poi imposta l'assioma a F, le regole a F = F[+F]F[-F]F, l'angolo a 25° e le iterazioni a 5. Ottieni un'erbaccia ramificata da un'unica regola, perché ogni coppia di parentesi genera un germoglio laterale che torna al suo fusto.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Constrói fractais com sistemas L no navegador: edita axioma, regras e ângulo, faz crescer o floco de Koch, o dragão ou uma planta e vê a tartaruga desenhá-los.",
    heading: "Como funciona este explorador",
    intro:
      "Cada imagem neste canvas começa como uma palavra curta, o axioma, e um punhado de regras de reescrita. O explorador aplica as regras a todas as letras da palavra ao mesmo tempo, vezes sem conta, até a palavra ter milhares de símbolos. Depois uma tartaruga percorre-a letra a letra: algumas letras significam «dá um passo em frente e traça uma linha», outras «roda» ou «lembra-te de onde estás». Flocos de neve, curvas que preenchem o plano e plantas ramificadas saem todos da mesma máquina minúscula. Só as regras mudam.",
    sections: [
      {
        heading: "Reescrever em paralelo",
        paragraphs: [
          "Os sistemas de Lindenmayer, ou sistemas L, foram introduzidos em 1968 pelo biólogo húngaro Aristid Lindenmayer para descrever como os organismos simples crescem célula a célula. A diferença essencial em relação às gramáticas comuns é que todos os símbolos são substituídos em simultâneo, tal como todas as células de um filamento se dividem na mesma geração. Um símbolo sem regra é copiado sem alterações.",
          "Pega na predefinição da curva de Koch: axioma F, uma só regra F → F+F-F-F+F. Após um passo há 5 cópias de F, após dois passos 25, após n passos 5ⁿ. O comprimento da cadeia cresce até 2 · 5ⁿ − 1 símbolos, pelo que quatro iterações dão 1249 símbolos e 625 segmentos.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "As oito predefinições carregam um sistema completo: curva de Koch (90°, 4 iterações), floco de neve de Koch (60°, 4), curva ponta de seta de Sierpiński (60°, 6), triângulo de Sierpiński (120°, 5), curva do dragão (90°, 12), planta fractal (25°, 5), curva de Hilbert (90°, 5) e curva C de Lévy (45°, 10). Escolher uma substitui o axioma, as regras, o ângulo, a orientação inicial e o número de iterações. A curva de Koch é aqui a variante quadrada com ângulos retos, não a versão clássica de 60°; a triangular é mostrada pela predefinição do floco de neve.",
          "O cursor das iterações vai de 1 a 12, o do ângulo de 15° a 120° em graus inteiros. O ângulo é quanto a tartaruga roda em cada símbolo + ou −, e como é aplicado centenas de vezes, a diferença de um único grau pode dobrar uma curva arrumada numa espiral. O campo do axioma e a caixa das regras são totalmente editáveis. Escreve uma regra por linha na forma X = …; cada lado esquerdo tem de ser um único carácter, e as linhas que não se conseguem interpretar são ignoradas. «Start heading» (de −180° a 180° em passos de 5°) é a direção para onde a tartaruga está virada antes do primeiro passo: 0° aponta para a direita e −90° a direito para cima. A predefinição da planta coloca-o em −65°, todas as outras em 0°, e ele fica onde o puseres enquanto editas o axioma e as regras. Os botões de cor só alteram o traço.",
          "O contador por baixo do canvas mostra o comprimento da cadeia gerada. Se um sistema crescer para lá de 500\u00a0000 símbolos, a expansão para exatamente aí e surge um aviso em âmbar. O que vês nesse caso é o início da geração seguinte, não o fractal completo.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A expansão é um simples ciclo sobre a cadeia com uma consulta ao objeto das regras, recalculada apenas quando mudam o axioma, as regras ou o número de iterações. O desenho é feito num canvas 2D em duas passagens sobre a mesma cadeia. Na primeira a tartaruga caminha sem desenhar e regista a caixa envolvente. A partir dessa caixa o código calcula um único fator de escala uniforme e um deslocamento, de modo que a figura preenche sempre o canvas com uma margem de 24 píxeis, tenha ela 10 segmentos ou 100\u00a0000. Na segunda passagem volta a caminhar e acrescenta cada segmento a um único caminho, que é traçado uma só vez no fim.",
          "Quatro letras desenham: F, G, A e B. Todas as outras são invisíveis para a tartaruga, e é precisamente por isso que as predefinições do dragão e de Hilbert usam X e Y: orientam o crescimento da cadeia sem deixar marcas. Os parênteses retos guardam a posição e a orientação atuais numa pilha e voltam a retirá-las, e é isso que permite à planta fractal lançar ramos laterais e regressar depois ao caule. Não há animação, por isso o canvas só é redesenhado quando um controlo muda ou a janela é redimensionada, e as definições de movimento reduzido não precisam de tratamento especial.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Porque é que o ângulo faz parte das regras",
        paragraphs: [
          "As regras decidem a combinatória, o ângulo decide a geometria. A cadeia da curva do dragão é uma sequência de viragens à esquerda e à direita; a 90° a curva toca em si própria nos cantos mas nunca percorre duas vezes o mesmo segmento, ao passo que a mesma cadeia desenhada com outro ângulo pode empilhar segmentos uns sobre os outros. Por outras palavras, um sistema L não é uma imagem: é uma receita que só se torna um fractal concreto quando fixas quanto roda a tartaruga.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Chega ao limite de símbolos",
        text: "Carrega a curva de Koch e sobe as iterações para 7. A cadeia tem 156\u00a0249 símbolos e ainda é desenhada por inteiro. Passa para 8 e a cadeia completa precisaria de 781\u00a0249 símbolos, por isso o limite entra em ação e só aparece parte da curva.",
      },
      {
        title: "Dobra o dragão",
        text: "Carrega a curva do dragão e desce o ângulo de 90° para 80° e depois para 60°. A mesma sequência de viragens já não se fecha no dragão conhecido e começa a dobrar-se em espirais sobrepostas.",
      },
      {
        title: "Muda o vento na planta",
        text: "Carrega a planta fractal e experimenta 15°, 25° e 35°. Ângulos pequenos fazem crescer uma cana estreita, ângulos grandes um arbusto espalhado. A estrutura de ramificação é idêntica; só a viragem muda.",
      },
      {
        title: "Escreve o teu próprio sistema",
        text: "Põe «Start heading» em −90° para a tartaruga arrancar a direito para cima. Depois define o axioma como F, as regras como F = F[+F]F[-F]F, o ângulo como 25° e as iterações como 5. Obténs uma erva ramificada a partir de uma única regra, porque cada par de parênteses gera um rebento lateral que regressa ao seu caule.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Bygg L-systemfraktaler i webbläsaren: ändra axiom, regler och vinkel, låt Kochs snöflinga, drakkurvan eller en fraktalväxt växa och se hur sköldpaddan ritar.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Varje bild på den här canvasen börjar som ett kort ord, axiomet, och en handfull omskrivningsregler. Utforskaren tillämpar reglerna på alla bokstäver i ordet samtidigt, om och om igen, tills ordet är tusentals symboler långt. Sedan vandrar en sköldpadda igenom det bokstav för bokstav: vissa bokstäver betyder ”ta ett steg framåt och rita en linje”, andra ”sväng” eller ”kom ihåg var du är”. Snöflingor, rumsfyllande kurvor och förgrenade växter kommer alla ur samma pyttelilla maskin. Det enda som ändras är reglerna.",
    sections: [
      {
        heading: "Omskrivning parallellt",
        paragraphs: [
          "Lindenmayersystem, eller L-system, introducerades 1968 av den ungerske biologen Aristid Lindenmayer som ett sätt att beskriva hur enkla organismer växer cell för cell. Den avgörande skillnaden mot vanliga grammatiker är att alla symboler ersätts samtidigt, precis som alla celler i en celltråd delar sig i samma generation. En symbol utan regel kopieras oförändrad.",
          "Ta förvalet Kochkurvan: axiom F, en enda regel F → F+F-F-F+F. Efter ett steg finns 5 kopior av F, efter två steg 25, efter n steg 5ⁿ. Strängens längd växer till 2 · 5ⁿ − 1 symboler, så fyra iterationer ger 1249 symboler och 625 linjesegment.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De åtta förvalen laddar var sitt kompletta system: Kochkurvan (”Koch curve”, 90°, 4 iterationer), Kochs snöflinga (”Koch snowflake”, 60°, 4), Sierpińskis pilspetskurva (”Sierpiński arrowhead”, 60°, 6), Sierpiński-triangeln (”Sierpiński triangle”, 120°, 5), drakkurvan (”Dragon curve”, 90°, 12), fraktalväxten (”Fractal plant”, 25°, 5), Hilbertkurvan (”Hilbert curve”, 90°, 5) och Lévys C-kurva (”Lévy C curve”, 45°, 10). När du väljer ett skrivs axiom, regler, vinkel, startriktning och antal iterationer över. Kochkurvan är här den kantiga varianten med räta vinklar, inte den klassiska med 60°; den triangulära visas av snöflingeförvalet.",
          "Iterationsreglaget går från 1 till 12, vinkelreglaget från 15° till 120° i hela grader. Vinkeln är hur mycket sköldpaddan svänger vid varje + eller −, och eftersom den tillämpas hundratals gånger kan en ändring på en enda grad böja en prydlig kurva till en spiral. Axiomfältet och regelrutan går att redigera fritt. Skriv en regel per rad på formen X = …; varje vänsterled måste vara ett enda tecken, och rader som inte går att tolka ignoreras. ”Start heading” (−180° till 180° i steg om 5°) är riktningen sköldpaddan tittar åt före sitt första steg: 0° pekar åt höger och −90° rakt upp. Växtförvalet sätter den till −65°, alla andra förval till 0°, och den stannar där du ställer den medan du redigerar axiom och regler. Färgknapparna ändrar bara linjefärgen.",
          "Räknaren under canvasen visar längden på den genererade strängen. Om ett system växer förbi 500\u00a0000 symboler avbryts expansionen just där och en bärnstensfärgad varning visas. Det du ser då är början på nästa generation, inte den fullständiga fraktalen.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Expansionen är en vanlig loop över strängen med en uppslagning i regelobjektet, och den räknas bara om när axiomet, reglerna eller antalet iterationer ändras. Ritandet sker på en 2D-canvas i två pass över samma sträng. I det första går sköldpaddan utan att rita och noterar den omslutande rektangeln. Utifrån den beräknar koden en enhetlig skalfaktor och en förskjutning, så att figuren alltid fyller canvasen med 24 pixlars marginal, oavsett om den har 10 segment eller 100\u00a0000. I det andra passet går den igen och lägger varje segment till en enda bana, som ritas ut en gång på slutet.",
          "Fyra bokstäver ritar: F, G, A och B. Alla andra bokstäver är osynliga för sköldpaddan, och just därför använder drak- och Hilbertförvalen X och Y: de styr hur strängen växer utan att lämna spår. Hakparenteserna lägger aktuell position och riktning på en stack och hämtar tillbaka dem, och det är det som låter fraktalväxten skjuta sidogrenar och sedan återvända till stjälken. Det finns ingen animation, så canvasen ritas bara om när ett reglage ändras eller fönstret byter storlek, och inställningar för minskad rörelse kräver ingen särskild hantering.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Varför vinkeln hör till reglerna",
        paragraphs: [
          "Reglerna bestämmer kombinatoriken, vinkeln bestämmer geometrin. Drakkurvans sträng är en följd av vänster- och högersvängar; vid 90° nuddar kurvan sig själv i hörnen men går aldrig två gånger längs samma segment, medan samma sträng ritad med en annan vinkel kan stapla segment ovanpå varandra. Ett L-system är med andra ord ingen bild: det är ett recept som blir en bestämd fraktal först när du slår fast hur mycket sköldpaddan svänger.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Slå i symboltaket",
        text: "Ladda Kochkurvan och höj iterationerna till 7. Strängen har 156\u00a0249 symboler och ritas fortfarande ut helt. Gå till 8 så skulle hela strängen kräva 781\u00a0249 symboler, så taket slår till och bara en del av kurvan syns.",
      },
      {
        title: "Böj draken",
        text: "Ladda drakkurvan och sänk vinkeln från 90° till 80° och sedan till 60°. Samma följd av svängar sluter sig inte längre till den välbekanta draken utan börjar vika sig i överlappande spiraler.",
      },
      {
        title: "Ändra vinden på växten",
        text: "Ladda fraktalväxten och prova 15°, 25° och 35°. Små vinklar ger ett smalt vasstrå, stora en yvig buske. Förgreningsstrukturen är identisk; bara svängen ändras.",
      },
      {
        title: "Skriv ditt eget system",
        text: "Ställ ”Start heading” på −90° så att sköldpaddan startar rakt uppåt. Sätt sedan axiomet till F, reglerna till F = F[+F]F[-F]F, vinkeln till 25° och iterationerna till 5. Du får ett förgrenat ogräs ur en enda regel, eftersom varje parentespar ger ett sidoskott som återvänder till sin stjälk.",
      },
    ],
  },
  no: {
    metaDescription:
      "Bygg L-system-fraktaler i nettleseren: Endre aksiom, regler og vinkel, la Kochs snøflak, dragekurven eller en fraktalplante vokse, og se skilpadden tegne dem.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Hvert bilde på dette lerretet begynner som et kort ord, aksiomet, og en håndfull omskrivingsregler. Utforskeren bruker reglene på alle bokstavene i ordet samtidig, igjen og igjen, til ordet er flere tusen symboler langt. Så går en skilpadde gjennom det bokstav for bokstav: Noen bokstaver betyr «gå et steg fram og tegn en linje», andre «sving» eller «husk hvor du er». Snøflak, romfyllende kurver og forgrenede planter kommer alle ut av den samme bitte lille maskinen. Bare reglene endrer seg.",
    sections: [
      {
        heading: "Omskriving i parallell",
        paragraphs: [
          "Lindenmayer-systemer, eller L-systemer, ble innført i 1968 av den ungarske biologen Aristid Lindenmayer som en måte å beskrive hvordan enkle organismer vokser celle for celle. Den avgjørende forskjellen fra vanlige grammatikker er at alle symboler erstattes samtidig, akkurat som alle cellene i en celletråd deler seg i samme generasjon. Et symbol uten regel kopieres uendret.",
          "Ta forhåndsvalget Koch-kurven: aksiom F, én regel F → F+F-F-F+F. Etter ett steg finnes det 5 kopier av F, etter to steg 25, etter n steg 5ⁿ. Lengden på strengen vokser til 2 · 5ⁿ − 1 symboler, så fire iterasjoner gir 1249 symboler og 625 linjestykker.",
        ],
        formula: KOCH_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De åtte forhåndsvalgene laster hvert sitt komplette system: Koch-kurven (90°, 4 iterasjoner), Kochs snøflak (60°, 4), Sierpińskis pilspisskurve (60°, 6), Sierpiński-trekanten (120°, 5), dragekurven (90°, 12), fraktalplanten (25°, 5), Hilbert-kurven (90°, 5) og Lévys C-kurve (45°, 10). Når du velger ett, overskrives aksiom, regler, vinkel, startretning og antall iterasjoner. Koch-kurven er her den firkantede varianten med rette vinkler, ikke den klassiske med 60°; den trekantede vises av snøflak-forhåndsvalget.",
          "Glidebryteren for iterasjoner går fra 1 til 12, den for vinkel fra 15° til 120° i hele grader. Vinkelen er hvor mye skilpadden svinger ved hvert symbol + eller −, og siden den brukes hundrevis av ganger, kan en endring på én eneste grad bøye en ryddig kurve til en spiral. Aksiomfeltet og regelboksen kan redigeres fritt. Skriv én regel per linje på formen X = …; hver venstreside må være ett enkelt tegn, og linjer som ikke lar seg tolke, blir ignorert. «Start heading» (−180° til 180° i steg på 5°) er retningen skilpadden ser i før sitt første steg: 0° peker mot høyre og −90° rett opp. Plante-forhåndsvalget setter den til −65°, alle de andre til 0°, og den blir stående der du setter den mens du redigerer aksiom og regler. Fargeknappene endrer bare streken.",
          "Telleren under lerretet viser lengden på den genererte strengen. Hvis et system vokser forbi 500\u00a0000 symboler, stopper ekspansjonen akkurat der, og en ravfarget advarsel dukker opp. Det du ser da, er begynnelsen på neste generasjon, ikke den fullstendige fraktalen.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Ekspansjonen er en enkel løkke over strengen med et oppslag i regelobjektet, og den beregnes bare på nytt når aksiomet, reglene eller antall iterasjoner endres. Tegningen skjer på et 2D-lerret i to gjennomganger av den samme strengen. I den første går skilpadden uten å tegne og registrerer det omsluttende rektangelet. Ut fra det beregner koden én felles skaleringsfaktor og en forskyvning, slik at figuren alltid fyller lerretet med en marg på 24 piksler, enten den har 10 linjestykker eller 100\u00a0000. I den andre gjennomgangen går den på nytt og legger hvert linjestykke til én enkelt bane, som tegnes opp én gang til slutt.",
          "Fire bokstaver tegner: F, G, A og B. Alle andre bokstaver er usynlige for skilpadden, og nettopp derfor bruker forhåndsvalgene for dragen og Hilbert X og Y: De styrer hvordan strengen vokser uten å etterlate spor. Hakeparentesene legger gjeldende posisjon og retning på en stakk og henter dem tilbake igjen, og det er dette som lar fraktalplanten skyte sidegreiner og så vende tilbake til stilken. Det finnes ingen animasjon, så lerretet tegnes bare på nytt når en kontroll endres eller vinduet får ny størrelse, og innstillinger for redusert bevegelse trenger ingen særbehandling.",
        ],
        code: TURTLE_EXCERPT,
      },
      {
        heading: "Hvorfor vinkelen er en del av reglene",
        paragraphs: [
          "Reglene bestemmer kombinatorikken, vinkelen bestemmer geometrien. Strengen til dragekurven er en følge av venstre- og høyresvinger; ved 90° berører kurven seg selv i hjørnene, men går aldri to ganger langs det samme linjestykket, mens den samme strengen tegnet med en annen vinkel kan stable linjestykker oppå hverandre. Et L-system er med andre ord ikke et bilde: Det er en oppskrift som først blir en bestemt fraktal når du fastsetter hvor mye skilpadden svinger.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Treff symboltaket",
        text: "Last Koch-kurven og øk iterasjonene til 7. Strengen har 156\u00a0249 symboler og tegnes fortsatt helt ut. Gå til 8, og hele strengen ville trengt 781\u00a0249 symboler, så taket slår inn og bare en del av kurven vises.",
      },
      {
        title: "Bøy dragen",
        text: "Last dragekurven og senk vinkelen fra 90° til 80° og så til 60°. Den samme følgen av svinger lukker seg ikke lenger til den velkjente dragen, men begynner å folde seg i overlappende spiraler.",
      },
      {
        title: "Endre vinden på planten",
        text: "Last fraktalplanten og prøv 15°, 25° og 35°. Små vinkler gir et smalt siv, store en vidstrakt busk. Forgreningsstrukturen er identisk; bare svingen endrer seg.",
      },
      {
        title: "Skriv ditt eget system",
        text: "Sett «Start heading» til −90° slik at skilpadden starter rett oppover. Sett deretter aksiomet til F, reglene til F = F[+F]F[-F]F, vinkelen til 25° og iterasjonene til 5. Du får et forgrenet ugress fra én eneste regel, fordi hvert parentespar gir et sideskudd som vender tilbake til stilken sin.",
      },
    ],
  },
};
