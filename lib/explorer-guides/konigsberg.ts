import type { ExplorerGuide } from "./types";

// Facts quoted here (seven historical bridges, three hypothetical extras,
// degrees 3/5/3/3 for A/B/C/D, the 30-unit click tolerance, 650 ms per auto-walk step) match
// app/konigsberg/explorer/page.tsx; update both together.
const CLASSIFY_EXCERPT = `function computeDegrees(activeIds) {
  const deg = { A: 0, B: 0, C: 0, D: 0 };
  for (const br of BRIDGES) {
    if (!activeIds.has(br.id)) continue;
    deg[br.a] += 1;
    deg[br.b] += 1;
  }
  return deg;
}

function classifyGraph(activeIds) {
  if (!isConnected(activeIds)) return { kind: "disconnected" };
  const deg = computeDegrees(activeIds);
  const odd = ["A", "B", "C", "D"].filter((v) => deg[v] % 2 === 1);
  if (odd.length === 0) return { kind: "circuit", oddCount: 0 };
  if (odd.length === 2) return { kind: "path", oddCount: 2, ends: [odd[0], odd[1]] };
  return { kind: "none", oddCount: odd.length };
}`;

// The words inside the display formula are prose, so each locale passes its
// own; the handshake identity itself is the same everywhere.
const parityFormula = (odd: string, isEven: string) =>
  `\\sum_{v} \\deg(v) = 2\\,|E| \\quad\\Longrightarrow\\quad \\#\\{v : \\deg(v) \\text{ ${odd}}\\} \\text{ ${isEven}}`;

export const KONIGSBERG_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Walk the seven bridges of Königsberg yourself, toggle bridges, watch vertex degrees change and see Euler's parity rule and Hierholzer's algorithm at work.",
    heading: "How this explorer works",
    intro:
      "The map shows two river banks (A in the north, D in the south) and two islands (Kneiphof, B, and Lomse, C), joined by bridges. You pick a starting point and then click bridges to cross them, one after another, never using a bridge twice. The question is the one the citizens of Königsberg are said to have asked: can you cross every bridge exactly once? With the seven bridges, the answer is no, and you can find that out the honest way: by getting stuck.",
    sections: [
      {
        heading: "Euler's parity argument",
        paragraphs: [
          "In 1736 Leonhard Euler noticed that the shape of the land and the length of the bridges are irrelevant. All that matters is which land masses are connected, and by how many bridges. Today this is called a graph: the land masses are vertices, the bridges are edges, and the number of bridges at a land mass is its degree.",
          "Every time a walk passes through a land mass, it uses one bridge to arrive and another to leave. So every vertex in the middle of the walk uses up its bridges in pairs. Only the start and the end can have a bridge left over. A walk that uses every edge exactly once (an Eulerian path) is therefore only possible if at most two vertices have odd degree. If it should end where it started (an Eulerian circuit), every degree must be even. For a connected graph, these conditions are also sufficient.",
          "In the default setup, the island B has five bridges and A, C and D have three each. Four odd vertices, so no such walk exists, no matter where you start or how cleverly you choose.",
        ],
        formula:
          "\\sum_{v} \\deg(v) = 2\\,|E| \\quad\\Longrightarrow\\quad \\#\\{v : \\deg(v) \\text{ odd}\\} \\text{ is even}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Start at chooses the land mass where your walk begins; it is highlighted on the map. On the canvas, the bridges you may cross next light up when you hover over them. A click within a short distance of a bridge crosses it, as long as it touches your current land mass and has not been used yet. Crossed bridges fade and get a numbered marker.",
          "The bridges list has ten entries: the seven historical bridges, which are on by default, plus three hypothetical ones that never existed and are drawn dashed (two direct bank to bank bridges, AD and AD2, and a second bridge between the islands, BC2). Toggling any of them recomputes every degree, the odd or even badge of each vertex and the status at the top: Eulerian circuit, Eulerian path (with its two possible end points), Eulerian: no, or disconnected. Changing the bridge set or the start resets your walk.",
          "The auto button changes its job with the graph. If an Eulerian path or circuit exists, it animates Hierholzer's algorithm crossing every bridge exactly once, one bridge every 650 milliseconds. It begins at your start if a complete walk can begin there, and otherwise moves the start to an odd vertex. If not, it runs a greedy walk that picks a random unused bridge at every step until none is left, and you watch it get stuck.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The map is drawn on a 2D canvas in a fixed logical space of 800 by 500 units, scaled to your screen and pixel density. Each bridge is a cubic Bézier curve between two vertex centres. To decide which bridge you clicked, the explorer samples each curve at 25 points and takes the bridge whose nearest sample is within 30 units of the pointer.",
          "The graph itself is just the list of active bridge ids. Degrees are counted by walking that list once. Connectivity is a depth-first search over the vertices that still have at least one bridge, so a land mass with all its bridges removed is simply ignored rather than making the graph count as disconnected. Hierholzer's algorithm uses a stack: it keeps following unused edges, and whenever it reaches a dead end it backtracks and records the edge it backs out of. Reversing that record gives the Eulerian trail.",
          "There is no continuous animation on this page. The map only redraws when something changes (a hover, a crossing, a toggle) or when the canvas is resized.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Why one bridge changes everything",
        paragraphs: [
          "Adding or removing a single bridge changes the degree of exactly two vertices by one, so it flips the parity of both ends. That is why the status jumps in steps of two: from four odd vertices to two, or from two to zero. It is also why a graph never has exactly one or three odd vertices: the degrees always add up to twice the number of edges.",
          "The map is a schematic of the layout Euler analysed in 1736. Kneiphof (B) has five bridges: two to each bank and one to the neighbouring island Lomse (C), which in turn has one bridge to each bank. Shapes and distances are simplified, but which land mass is joined to which, and how often, is historical.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Get stuck on purpose",
        text: "Leave the seven bridges on, start at A and try to cross everything by hand. Then press the auto button a few times. The greedy walk picks differently each time, but it always ends with at least one bridge unused.",
      },
      {
        title: "Add one bridge that never existed",
        text: "Switch on AD, a direct bridge between the banks. Now A and D have degree four, and only B and C are odd. The status turns to Eulerian path, from B to C. Start at B and you can finish the tour; start at A and you will strand yourself.",
      },
      {
        title: "Close the circuit",
        text: "With AD on, also switch on BC2. Every vertex is now even, and the status says Eulerian circuit: a round trip over all nine bridges that ends where it began.",
      },
      {
        title: "Remove instead of adding",
        text: "Return to the original seven and switch off AC, BC and CD. Lomse (C) drops out of the graph entirely, and A, B and D are left with degrees two, four and two. Without building anything new, the remaining four bridges form a circuit.",
      },
    ],
  },
  de: {
    metaDescription:
      "Lauf selbst über die sieben Brücken von Königsberg, schalte Brücken um, beobachte die Knotengrade und sieh Eulers Paritätsregel und Hierholzer in Aktion.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Karte zeigt zwei Flussufer (A im Norden, D im Süden) und zwei Inseln (Kneiphof, B, und Lomse, C), verbunden durch Brücken. Du wählst einen Startpunkt und klickst dann Brücke für Brücke an, um sie zu überqueren, ohne eine Brücke zweimal zu benutzen. Die Frage ist die, die sich die Menschen in Königsberg gestellt haben sollen: Kann man jede Brücke genau einmal überqueren? Mit den sieben Brücken lautet die Antwort nein, und du findest das auf ehrliche Weise heraus: indem du stecken bleibst.",
    sections: [
      {
        heading: "Eulers Paritätsargument",
        paragraphs: [
          "1736 erkannte Leonhard Euler, dass die Form des Landes und die Länge der Brücken keine Rolle spielen. Es zählt nur, welche Landstücke verbunden sind und durch wie viele Brücken. Heute nennen wir so ein Bild einen Graphen: Die Landstücke sind Knoten, die Brücken Kanten, und die Zahl der Brücken an einem Landstück ist sein Grad.",
          "Jedes Mal, wenn ein Weg durch ein Landstück führt, braucht er eine Brücke zum Ankommen und eine zum Verlassen. Jeder Knoten in der Mitte des Wegs verbraucht seine Brücken also paarweise. Nur Start und Ziel dürfen eine Brücke übrig haben. Ein Weg, der jede Kante genau einmal benutzt (ein Eulerweg), ist deshalb nur möglich, wenn höchstens zwei Knoten ungeraden Grad haben. Soll er dort enden, wo er begann (ein Eulerkreis), müssen alle Grade gerade sein. Für zusammenhängende Graphen reichen diese Bedingungen auch aus.",
          "In der Grundeinstellung hat die Insel B fünf Brücken, A, C und D je drei. Vier ungerade Knoten, also gibt es keinen solchen Weg, egal wo du startest und wie geschickt du wählst.",
        ],
        formula:
          "\\sum_{v} \\deg(v) = 2\\,|E| \\quad\\Longrightarrow\\quad \\#\\{v : \\deg(v) \\text{ ungerade}\\} \\text{ ist gerade}",
      },
      {
        heading: "Was die Bedienelemente bewirken",
        paragraphs: [
          "«Start bei» legt fest, auf welchem Landstück dein Weg beginnt; es wird auf der Karte hervorgehoben. Auf dem Canvas leuchten die Brücken auf, die du als Nächstes nehmen darfst, sobald du mit der Maus darüberfährst. Ein Klick in der Nähe einer Brücke überquert sie, sofern sie an deinem aktuellen Landstück liegt und noch nicht benutzt wurde. Überquerte Brücken verblassen und bekommen eine Nummer.",
          "Die Brückenliste hat zehn Einträge: die sieben historischen Brücken, die anfangs aktiv sind, und drei hypothetische, die es nie gab und die gestrichelt gezeichnet sind (zwei direkte Brücken von Ufer zu Ufer, AD und AD2, und eine zweite Brücke zwischen den Inseln, BC2). Jedes Umschalten berechnet alle Grade neu, dazu die Markierung gerade oder ungerade an jedem Knoten und den Status oben: «Eulerscher Kreis», «Eulerscher Weg» (mit seinen beiden möglichen Endpunkten), «Eulersch: nein» oder unzusammenhängend. Eine neue Brückenauswahl oder ein neuer Start setzt deinen Weg zurück.",
          "Der Auto-Knopf ändert seine Aufgabe je nach Graph. Gibt es einen Eulerweg oder Eulerkreis, animiert er den Algorithmus von Hierholzer, der jede Brücke genau einmal überquert, alle 650 Millisekunden eine. Er beginnt an deinem Start, wenn ein vollständiger Weg dort beginnen kann, und verlegt den Start sonst auf einen ungeraden Knoten. Gibt es keinen, läuft ein gieriger Weg, der bei jedem Schritt zufällig eine unbenutzte Brücke wählt, bis keine mehr übrig ist, und du siehst ihn stecken bleiben.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Karte wird auf ein 2D-Canvas in einem festen logischen Raum von 800 mal 500 Einheiten gezeichnet und auf deinen Bildschirm und dessen Pixeldichte skaliert. Jede Brücke ist eine kubische Bézierkurve zwischen zwei Knotenmittelpunkten. Um herauszufinden, welche Brücke du angeklickt hast, tastet der Explorer jede Kurve an 25 Punkten ab und nimmt die Brücke, deren nächster Punkt höchstens 30 Einheiten vom Zeiger entfernt liegt.",
          "Der Graph selbst ist nur die Liste der aktiven Brücken. Die Grade entstehen in einem einzigen Durchlauf durch diese Liste. Der Zusammenhang wird per Tiefensuche über die Knoten geprüft, die noch mindestens eine Brücke haben. Ein Landstück ohne Brücken wird also einfach ignoriert, statt den Graphen als unzusammenhängend zu werten. Hierholzers Algorithmus arbeitet mit einem Stapel: Er folgt so lange unbenutzten Kanten, bis er in einer Sackgasse landet, geht dann zurück und notiert die Kante, über die er zurückweicht. Diese Notiz rückwärts gelesen ergibt den Eulerweg.",
          "Auf dieser Seite gibt es keine Daueranimation. Die Karte wird nur neu gezeichnet, wenn sich etwas ändert (Hover, Überquerung, Umschalten) oder das Canvas seine Größe ändert.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Warum eine Brücke alles ändert",
        paragraphs: [
          "Eine Brücke mehr oder weniger ändert den Grad von genau zwei Knoten um eins, sie kippt also die Parität an beiden Enden. Darum springt der Status immer in Zweierschritten: von vier ungeraden Knoten auf zwei oder von zwei auf null. Deshalb hat ein Graph auch nie genau einen oder drei ungerade Knoten: Die Grade ergeben zusammen immer das Doppelte der Kantenzahl.",
          "Die Karte ist ein Schema der Lage, die Euler 1736 untersucht hat. Der Kneiphof (B) hat fünf Brücken: je zwei zu den beiden Ufern und eine zur Nachbarinsel Lomse (C), die ihrerseits je eine Brücke zu jedem Ufer hat. Formen und Entfernungen sind vereinfacht, aber welches Landstück mit welchem verbunden ist und wie oft, ist historisch.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Absichtlich stecken bleiben",
        text: "Lass die sieben Brücken aktiv, starte bei A und versuch, alles von Hand zu überqueren. Drück danach ein paarmal den Auto-Knopf. Der gierige Weg wählt jedes Mal anders, endet aber immer mit mindestens einer unbenutzten Brücke.",
      },
      {
        title: "Eine Brücke, die es nie gab",
        text: "Schalte AD ein, eine direkte Brücke zwischen den Ufern. Jetzt haben A und D den Grad vier, und nur noch B und C sind ungerade. Der Status springt auf «Eulerscher Weg», von B nach C. Startest du bei B, schaffst du die Runde; startest du bei A, sitzt du irgendwann fest.",
      },
      {
        title: "Den Kreis schließen",
        text: "Lass AD an und schalte zusätzlich BC2 ein. Jetzt ist jeder Knoten gerade, und der Status meldet «Eulerscher Kreis»: eine Rundtour über alle neun Brücken, die dort endet, wo sie begann.",
      },
      {
        title: "Wegnehmen statt bauen",
        text: "Kehr zu den sieben Originalbrücken zurück und schalte AC, BC und CD aus. Die Lomse (C) fällt ganz aus dem Graphen, A, B und D behalten die Grade zwei, vier und zwei. Ohne eine einzige neue Brücke bilden die übrigen vier einen Kreis.",
      },
    ],
  },
  es: {
    metaDescription:
      "Recorre los siete puentes de Königsberg, activa y desactiva puentes, mira cambiar los grados y descubre la regla de paridad de Euler y a Hierholzer en acción.",
    heading: "Cómo funciona este explorador",
    intro:
      "El mapa muestra dos orillas del río (A al norte, D al sur) y dos islas (Kneiphof, B, y Lomse, C), unidas por puentes. Eliges un punto de partida y luego haces clic en los puentes para cruzarlos, uno tras otro, sin usar nunca dos veces el mismo. La pregunta es la que, según se cuenta, se hacían los habitantes de Königsberg: ¿se puede cruzar cada puente exactamente una vez? Con los siete puentes la respuesta es no, y puedes comprobarlo por la vía honrada: quedándote sin salida.",
    sections: [
      {
        heading: "El argumento de paridad de Euler",
        paragraphs: [
          "En 1736, Leonhard Euler se dio cuenta de que la forma del terreno y la longitud de los puentes son irrelevantes. Lo único que importa es qué zonas de tierra están conectadas y por cuántos puentes. Hoy a eso se le llama grafo: las zonas de tierra son vértices, los puentes son aristas, y el número de puentes que llegan a una zona es su grado.",
          "Cada vez que un recorrido atraviesa una zona de tierra, usa un puente para llegar y otro para marcharse. Así, todo vértice intermedio del recorrido gasta sus puentes de dos en dos. Solo al inicio y al final puede sobrar un puente. Un recorrido que use cada arista exactamente una vez (un camino euleriano) solo es posible, por tanto, si como mucho dos vértices tienen grado impar. Si además debe terminar donde empezó (un circuito euleriano), todos los grados tienen que ser pares. Para un grafo conexo, estas condiciones son también suficientes.",
          "En la configuración inicial, la isla B tiene cinco puentes y A, C y D tienen tres cada una. Cuatro vértices impares, así que ese recorrido no existe, empieces donde empieces y elijas con toda la astucia que quieras.",
        ],
        formula: parityFormula("impar", "es par"),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "«Empezar en» elige la zona de tierra donde comienza tu recorrido, que queda resaltada en el mapa. En el lienzo, los puentes que puedes cruzar a continuación se iluminan al pasar el puntero por encima. Un clic a poca distancia de un puente lo cruza, siempre que toque tu zona de tierra actual y aún no se haya usado. Los puentes cruzados se atenúan y reciben un marcador numerado.",
          "La lista «Puentes» tiene diez entradas: los siete puentes históricos, activos por defecto, y tres hipotéticos que nunca existieron y se dibujan con línea discontinua (dos puentes directos de orilla a orilla, AD y AD2, y un segundo puente entre las islas, BC2). Al activar o desactivar cualquiera se recalculan todos los grados, la etiqueta de par o impar de cada vértice y el estado de arriba: «Circuito euleriano», «Camino euleriano» (con sus dos extremos posibles), «Euleriano: no» o desconectado. Cambiar el conjunto de puentes o el punto de partida reinicia tu recorrido.",
          "El botón automático cambia de tarea según el grafo. Si existe un camino o un circuito euleriano, anima el algoritmo de Hierholzer cruzando cada puente exactamente una vez, un puente cada 650 milisegundos. Empieza en tu punto de partida si un recorrido completo puede comenzar ahí; de lo contrario, traslada el inicio a un vértice impar. Si no existe, ejecuta un recorrido voraz que en cada paso elige al azar un puente sin usar hasta que no queda ninguno, y lo ves quedarse atascado.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El mapa se dibuja en un lienzo 2D con un espacio lógico fijo de 800 por 500 unidades, escalado a tu pantalla y a su densidad de píxeles. Cada puente es una curva de Bézier cúbica entre los centros de dos vértices. Para decidir en qué puente has hecho clic, el explorador muestrea cada curva en 25 puntos y toma el puente cuya muestra más cercana queda a menos de 30 unidades del puntero.",
          "El grafo en sí es simplemente la lista de identificadores de los puentes activos. Los grados se cuentan recorriendo esa lista una vez. La conexidad es una búsqueda en profundidad sobre los vértices que aún conservan al menos un puente, de modo que una zona de tierra a la que se le han quitado todos los puentes sencillamente se ignora en lugar de hacer que el grafo cuente como desconectado. El algoritmo de Hierholzer usa una pila: va siguiendo aristas sin usar y, cada vez que llega a un callejón sin salida, retrocede y anota la arista por la que da marcha atrás. Al invertir ese registro se obtiene el recorrido euleriano.",
          "En esta página no hay animación continua. El mapa solo se redibuja cuando algo cambia (un paso del puntero, un cruce, un puente que se activa o desactiva) o cuando se redimensiona el lienzo.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Por qué un solo puente lo cambia todo",
        paragraphs: [
          "Añadir o quitar un único puente cambia en una unidad el grado de exactamente dos vértices, así que invierte la paridad de ambos extremos. Por eso el estado salta de dos en dos: de cuatro vértices impares a dos, o de dos a cero. Y por eso un grafo nunca tiene exactamente uno o tres vértices impares: los grados suman siempre el doble del número de aristas.",
          "El mapa es un esquema de la disposición que Euler analizó en 1736. Kneiphof (B) tiene cinco puentes: dos hacia cada orilla y uno hacia la isla vecina, Lomse (C), que a su vez tiene un puente hacia cada orilla. Las formas y las distancias están simplificadas, pero qué zona de tierra está unida a cuál, y cuántas veces, es histórico.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Quédate sin salida a propósito",
        text: "Deja activos los siete puentes, empieza en A e intenta cruzarlo todo a mano. Después pulsa unas cuantas veces el botón automático. El recorrido voraz elige distinto cada vez, pero siempre termina con al menos un puente sin usar.",
      },
      {
        title: "Añade un puente que nunca existió",
        text: "Activa AD, un puente directo entre las orillas. Ahora A y D tienen grado cuatro y solo B y C son impares. El estado pasa a «Camino euleriano», de B a C. Empieza en B y podrás terminar la ruta; empieza en A y te quedarás varado.",
      },
      {
        title: "Cierra el circuito",
        text: "Con AD activo, activa también BC2. Ahora todos los vértices son pares y el estado dice «Circuito euleriano»: un viaje de ida y vuelta por los nueve puentes que termina donde empezó.",
      },
      {
        title: "Quita en lugar de añadir",
        text: "Vuelve a los siete originales y desactiva AC, BC y CD. Lomse (C) sale por completo del grafo, y A, B y D se quedan con grados dos, cuatro y dos. Sin construir nada nuevo, los cuatro puentes restantes forman un circuito.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Parcours toi-même les sept ponts de Königsberg, active ou retire des ponts, observe les degrés et vois à l'œuvre la règle de parité d'Euler et Hierholzer.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La carte montre deux rives du fleuve (A au nord, D au sud) et deux îles (Kneiphof, B, et Lomse, C), reliées par des ponts. Tu choisis un point de départ puis tu cliques sur les ponts pour les franchir, l'un après l'autre, sans jamais emprunter deux fois le même. La question est celle que se posaient, dit-on, les habitants de Königsberg : peut-on franchir chaque pont exactement une fois ? Avec les sept ponts, la réponse est non, et tu peux le découvrir à la loyale : en te retrouvant coincé.",
    sections: [
      {
        heading: "L'argument de parité d'Euler",
        paragraphs: [
          "En 1736, Leonhard Euler a remarqué que la forme des terres et la longueur des ponts n'ont aucune importance. Tout ce qui compte, c'est quelles terres sont reliées, et par combien de ponts. On appelle cela aujourd'hui un graphe : les terres sont des sommets, les ponts sont des arêtes, et le nombre de ponts qui touchent une terre est son degré.",
          "Chaque fois qu'un parcours traverse une terre, il utilise un pont pour arriver et un autre pour repartir. Tout sommet situé au milieu du parcours consomme donc ses ponts par paires. Seuls le départ et l'arrivée peuvent avoir un pont en trop. Un parcours qui emprunte chaque arête exactement une fois (un chemin eulérien) n'est donc possible que si au plus deux sommets ont un degré impair. S'il doit se terminer là où il a commencé (un circuit eulérien), tous les degrés doivent être pairs. Pour un graphe connexe, ces conditions sont aussi suffisantes.",
          "Dans la configuration par défaut, l'île B a cinq ponts et A, C et D en ont trois chacune. Quatre sommets impairs, donc aucun parcours de ce genre n'existe, quel que soit ton point de départ et aussi malins que soient tes choix.",
        ],
        formula: parityFormula("impair", "est pair"),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "« Départ en » choisit la terre où commence ton parcours ; elle est mise en évidence sur la carte. Sur le canevas, les ponts que tu peux franchir ensuite s'illuminent quand tu les survoles. Un clic à faible distance d'un pont le franchit, à condition qu'il touche la terre où tu te trouves et qu'il n'ait pas encore servi. Les ponts franchis s'estompent et reçoivent un repère numéroté.",
          "La liste « Ponts » compte dix entrées : les sept ponts historiques, activés par défaut, plus trois ponts hypothétiques qui n'ont jamais existé et sont tracés en pointillés (deux ponts directs de rive à rive, AD et AD2, et un second pont entre les îles, BC2). Basculer l'un d'eux recalcule tous les degrés, le badge pair ou impair de chaque sommet et le statut en haut : circuit eulérien, chemin eulérien (avec ses deux extrémités possibles), « Eulérien : non » ou non connexe. Changer l'ensemble des ponts ou le point de départ réinitialise ton parcours.",
          "Le bouton automatique change de rôle selon le graphe. S'il existe un chemin ou un circuit eulérien, il anime l'algorithme de Hierholzer qui franchit chaque pont exactement une fois, à raison d'un pont toutes les 650 millisecondes. Il part de ton point de départ si un parcours complet peut y commencer, et déplace sinon le départ vers un sommet impair. S'il n'en existe pas, il lance un parcours glouton qui choisit à chaque pas un pont inutilisé au hasard jusqu'à ce qu'il n'en reste plus, et tu le regardes se coincer.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La carte est dessinée sur un canevas 2D dans un espace logique fixe de 800 sur 500 unités, mis à l'échelle de ton écran et de sa densité de pixels. Chaque pont est une courbe de Bézier cubique entre les centres de deux sommets. Pour déterminer sur quel pont tu as cliqué, l'explorateur échantillonne chaque courbe en 25 points et retient le pont dont l'échantillon le plus proche se trouve à moins de 30 unités du pointeur.",
          "Le graphe lui-même n'est que la liste des identifiants des ponts actifs. Les degrés se comptent en parcourant cette liste une fois. La connexité est un parcours en profondeur sur les sommets qui ont encore au moins un pont, de sorte qu'une terre privée de tous ses ponts est simplement ignorée au lieu de faire passer le graphe pour non connexe. L'algorithme de Hierholzer utilise une pile : il suit sans relâche des arêtes inutilisées et, chaque fois qu'il atteint une impasse, il revient en arrière et note l'arête par laquelle il recule. En inversant ce relevé, on obtient le parcours eulérien.",
          "Il n'y a pas d'animation continue sur cette page. La carte n'est redessinée que lorsque quelque chose change (un survol, une traversée, une bascule) ou lorsque le canevas est redimensionné.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Pourquoi un seul pont change tout",
        paragraphs: [
          "Ajouter ou retirer un seul pont modifie d'une unité le degré d'exactement deux sommets, et inverse donc la parité des deux extrémités. C'est pourquoi le statut saute par pas de deux : de quatre sommets impairs à deux, ou de deux à zéro. C'est aussi pourquoi un graphe n'a jamais exactement un ou trois sommets impairs : la somme des degrés vaut toujours le double du nombre d'arêtes.",
          "La carte est un schéma de la disposition qu'Euler a analysée en 1736. Kneiphof (B) a cinq ponts : deux vers chaque rive et un vers l'île voisine, Lomse (C), qui a elle-même un pont vers chaque rive. Les formes et les distances sont simplifiées, mais quelle terre est reliée à quelle autre, et combien de fois, est historique.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Coince-toi exprès",
        text: "Laisse les sept ponts activés, pars de A et essaie de tout franchir à la main. Appuie ensuite plusieurs fois sur le bouton automatique. Le parcours glouton fait des choix différents à chaque fois, mais il finit toujours avec au moins un pont inutilisé.",
      },
      {
        title: "Ajoute un pont qui n'a jamais existé",
        text: "Active AD, un pont direct entre les rives. Désormais A et D sont de degré quatre, et seuls B et C sont impairs. Le statut passe à « Chemin eulérien », de B à C. Pars de B et tu pourras terminer la tournée ; pars de A et tu resteras coincé.",
      },
      {
        title: "Ferme le circuit",
        text: "Avec AD activé, active aussi BC2. Tous les sommets sont maintenant pairs, et le statut annonce « Circuit eulérien » : un aller-retour par les neuf ponts qui se termine là où il a commencé.",
      },
      {
        title: "Retire au lieu d'ajouter",
        text: "Reviens aux sept ponts d'origine et désactive AC, BC et CD. Lomse (C) sort complètement du graphe, et il reste à A, B et D les degrés deux, quatre et deux. Sans rien construire de nouveau, les quatre ponts restants forment un circuit.",
      },
    ],
  },
  it: {
    metaDescription:
      "Percorri i sette ponti di Königsberg, attiva e disattiva i ponti, guarda cambiare i gradi e scopri la regola di parità di Eulero e Hierholzer all'opera.",
    heading: "Come funziona questo esploratore",
    intro:
      "La mappa mostra due rive del fiume (A a nord, D a sud) e due isole (Kneiphof, B, e Lomse, C), collegate da ponti. Scegli un punto di partenza e poi fai clic sui ponti per attraversarli, uno dopo l'altro, senza mai usare due volte lo stesso. La domanda è quella che, si racconta, si ponevano gli abitanti di Königsberg: si può attraversare ogni ponte esattamente una volta? Con i sette ponti la risposta è no, e puoi scoprirlo nel modo più onesto: rimanendo bloccato.",
    sections: [
      {
        heading: "L'argomento di parità di Eulero",
        paragraphs: [
          "Nel 1736 Eulero si accorse che la forma del terreno e la lunghezza dei ponti sono irrilevanti. Conta soltanto quali zone di terra sono collegate, e da quanti ponti. Oggi questo si chiama grafo: le zone di terra sono vertici, i ponti sono spigoli, e il numero di ponti che toccano una zona è il suo grado.",
          "Ogni volta che un percorso attraversa una zona di terra, usa un ponte per arrivare e un altro per ripartire. Quindi ogni vertice intermedio del percorso consuma i suoi ponti a coppie. Solo la partenza e l'arrivo possono avere un ponte che avanza. Un percorso che usa ogni spigolo esattamente una volta (un cammino euleriano) è perciò possibile solo se al massimo due vertici hanno grado dispari. Se deve finire dove è iniziato (un circuito euleriano), ogni grado deve essere pari. Per un grafo connesso, queste condizioni sono anche sufficienti.",
          "Nella configurazione predefinita, l'isola B ha cinque ponti e A, C e D ne hanno tre ciascuna. Quattro vertici dispari, quindi un percorso del genere non esiste, da qualunque punto tu parta e per quanto astute siano le tue scelte.",
        ],
        formula: parityFormula("dispari", "è pari"),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "«Parti da» sceglie la zona di terra in cui comincia il tuo percorso, che viene evidenziata sulla mappa. Sul canvas, i ponti che puoi attraversare subito dopo si illuminano quando ci passi sopra con il puntatore. Un clic a breve distanza da un ponte lo attraversa, purché tocchi la zona di terra in cui ti trovi e non sia ancora stato usato. I ponti attraversati sbiadiscono e ricevono un contrassegno numerato.",
          "L'elenco «Ponti» ha dieci voci: i sette ponti storici, attivi all'inizio, più tre ipotetici che non sono mai esistiti e sono disegnati tratteggiati (due ponti diretti da riva a riva, AD e AD2, e un secondo ponte tra le isole, BC2). Attivarne o disattivarne uno ricalcola tutti i gradi, l'etichetta pari o dispari di ogni vertice e lo stato in alto: circuito euleriano, cammino euleriano (con i suoi due possibili estremi), non euleriano oppure sconnesso. Cambiare l'insieme dei ponti o la partenza azzera il tuo percorso.",
          "Il pulsante automatico cambia compito a seconda del grafo. Se esiste un cammino o un circuito euleriano, anima l'algoritmo di Hierholzer che attraversa ogni ponte esattamente una volta, un ponte ogni 650 millisecondi. Comincia dalla tua partenza se un percorso completo può iniziare lì, altrimenti sposta la partenza su un vertice dispari. Se non esiste, esegue un percorso goloso che a ogni passo sceglie a caso un ponte non usato finché non ne restano più, e tu lo guardi rimanere bloccato.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La mappa è disegnata su un canvas 2D in uno spazio logico fisso di 800 per 500 unità, scalato sul tuo schermo e sulla sua densità di pixel. Ogni ponte è una curva di Bézier cubica tra i centri di due vertici. Per decidere su quale ponte hai fatto clic, l'esploratore campiona ogni curva in 25 punti e prende il ponte il cui campione più vicino si trova entro 30 unità dal puntatore.",
          "Il grafo in sé è soltanto l'elenco degli identificatori dei ponti attivi. I gradi si contano scorrendo quell'elenco una volta. La connessione è una ricerca in profondità sui vertici che hanno ancora almeno un ponte, così una zona di terra a cui sono stati tolti tutti i ponti viene semplicemente ignorata anziché far risultare il grafo sconnesso. L'algoritmo di Hierholzer usa una pila: continua a seguire spigoli non usati e, ogni volta che arriva a un vicolo cieco, torna indietro e registra lo spigolo da cui si ritira. Invertendo quella registrazione si ottiene il percorso euleriano.",
          "In questa pagina non c'è animazione continua. La mappa viene ridisegnata solo quando qualcosa cambia (un passaggio del puntatore, un attraversamento, un ponte attivato o disattivato) o quando il canvas viene ridimensionato.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Perché un solo ponte cambia tutto",
        paragraphs: [
          "Aggiungere o togliere un singolo ponte cambia di uno il grado di esattamente due vertici, quindi inverte la parità di entrambi gli estremi. Ecco perché lo stato salta a passi di due: da quattro vertici dispari a due, o da due a zero. Ed ecco perché un grafo non ha mai esattamente uno o tre vertici dispari: la somma dei gradi è sempre il doppio del numero di spigoli.",
          "La mappa è uno schema della disposizione che Eulero analizzò nel 1736. Kneiphof (B) ha cinque ponti: due verso ciascuna riva e uno verso l'isola vicina, Lomse (C), che a sua volta ha un ponte verso ciascuna riva. Forme e distanze sono semplificate, ma quale zona di terra è collegata a quale, e quante volte, è storia.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Resta bloccato apposta",
        text: "Lascia attivi i sette ponti, parti da A e prova ad attraversare tutto a mano. Poi premi qualche volta il pulsante automatico. Il percorso goloso sceglie ogni volta in modo diverso, ma finisce sempre con almeno un ponte non usato.",
      },
      {
        title: "Aggiungi un ponte mai esistito",
        text: "Attiva AD, un ponte diretto tra le rive. Ora A e D hanno grado quattro, e solo B e C sono dispari. Lo stato diventa «Cammino euleriano», da B a C. Parti da B e riuscirai a completare il giro; parti da A e resterai bloccato.",
      },
      {
        title: "Chiudi il circuito",
        text: "Con AD attivo, attiva anche BC2. Ora ogni vertice è pari e lo stato dice «Circuito euleriano»: un giro su tutti e nove i ponti che finisce dove è cominciato.",
      },
      {
        title: "Togli invece di aggiungere",
        text: "Torna ai sette originali e disattiva AC, BC e CD. Lomse (C) esce del tutto dal grafo, e ad A, B e D restano i gradi due, quattro e due. Senza costruire nulla di nuovo, i quattro ponti rimasti formano un circuito.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Percorre as sete pontes de Königsberg, liga e desliga pontes, vê os graus a mudar e descobre a regra de paridade de Euler e o algoritmo de Hierholzer.",
    heading: "Como funciona este explorador",
    intro:
      "O mapa mostra duas margens do rio (A a norte, D a sul) e duas ilhas (Kneiphof, B, e Lomse, C), ligadas por pontes. Escolhes um ponto de partida e depois clicas nas pontes para as atravessar, uma a seguir à outra, sem nunca usar a mesma duas vezes. A pergunta é a que, segundo se conta, os habitantes de Königsberg faziam: é possível atravessar cada ponte exatamente uma vez? Com as sete pontes a resposta é não, e podes descobri-lo da maneira honesta: ficando sem saída.",
    sections: [
      {
        heading: "O argumento de paridade de Euler",
        paragraphs: [
          "Em 1736, Leonhard Euler reparou que a forma do terreno e o comprimento das pontes são irrelevantes. Só interessa que massas de terra estão ligadas, e por quantas pontes. Hoje chama-se a isto um grafo: as massas de terra são vértices, as pontes são arestas, e o número de pontes numa massa de terra é o seu grau.",
          "Sempre que um percurso passa por uma massa de terra, usa uma ponte para chegar e outra para sair. Assim, cada vértice a meio do percurso gasta as suas pontes aos pares. Só o início e o fim podem ficar com uma ponte a mais. Um percurso que use cada aresta exatamente uma vez (um caminho euleriano) só é portanto possível se, no máximo, dois vértices tiverem grau ímpar. Se tiver de acabar onde começou (um circuito euleriano), todos os graus têm de ser pares. Para um grafo conexo, estas condições são também suficientes.",
          "Na configuração inicial, a ilha B tem cinco pontes e A, C e D têm três cada. Quatro vértices ímpares, logo esse percurso não existe, comeces onde começares e por mais astutas que sejam as tuas escolhas.",
        ],
        formula: parityFormula("ímpar", "é par"),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "«Começar em» escolhe a massa de terra onde o teu percurso começa, que fica destacada no mapa. No canvas, as pontes que podes atravessar a seguir acendem-se quando passas o ponteiro por cima delas. Um clique a curta distância de uma ponte atravessa-a, desde que ela toque a tua massa de terra atual e ainda não tenha sido usada. As pontes atravessadas esbatem-se e recebem um marcador numerado.",
          "A lista «Pontes» tem dez entradas: as sete pontes históricas, ligadas à partida, mais três hipotéticas que nunca existiram e são desenhadas a tracejado (duas pontes diretas de margem a margem, AD e AD2, e uma segunda ponte entre as ilhas, BC2). Ligar ou desligar qualquer uma recalcula todos os graus, a etiqueta de par ou ímpar de cada vértice e o estado no topo: circuito euleriano, caminho euleriano (com os seus dois extremos possíveis), «Euleriano: não» ou desconectado. Mudar o conjunto de pontes ou o ponto de partida reinicia o teu percurso.",
          "O botão automático muda de função consoante o grafo. Se existir um caminho ou circuito euleriano, anima o algoritmo de Hierholzer a atravessar cada ponte exatamente uma vez, uma ponte a cada 650 milissegundos. Começa no teu ponto de partida se um percurso completo puder começar aí; caso contrário, muda o início para um vértice ímpar. Se não existir, corre um percurso guloso que em cada passo escolhe ao acaso uma ponte por usar até não sobrar nenhuma, e tu vê-lo ficar encalhado.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O mapa é desenhado num canvas 2D num espaço lógico fixo de 800 por 500 unidades, à escala do teu ecrã e da sua densidade de píxeis. Cada ponte é uma curva de Bézier cúbica entre os centros de dois vértices. Para decidir em que ponte clicaste, o explorador amostra cada curva em 25 pontos e fica com a ponte cuja amostra mais próxima está a menos de 30 unidades do ponteiro.",
          "O grafo em si é apenas a lista de identificadores das pontes ativas. Os graus contam-se percorrendo essa lista uma vez. A conexidade é uma busca em profundidade sobre os vértices que ainda têm pelo menos uma ponte, pelo que uma massa de terra a que foram retiradas todas as pontes é simplesmente ignorada, em vez de fazer o grafo contar como desconectado. O algoritmo de Hierholzer usa uma pilha: vai seguindo arestas por usar e, sempre que chega a um beco sem saída, recua e regista a aresta por onde recua. Invertendo esse registo obtém-se o percurso euleriano.",
          "Não há animação contínua nesta página. O mapa só é redesenhado quando algo muda (uma passagem do ponteiro, uma travessia, uma ponte ligada ou desligada) ou quando o canvas é redimensionado.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Porque é que uma só ponte muda tudo",
        paragraphs: [
          "Acrescentar ou retirar uma única ponte altera em um o grau de exatamente dois vértices, pelo que inverte a paridade de ambos os extremos. É por isso que o estado salta de dois em dois: de quatro vértices ímpares para dois, ou de dois para zero. É também por isso que um grafo nunca tem exatamente um ou três vértices ímpares: os graus somam sempre o dobro do número de arestas.",
          "O mapa é um esquema da disposição que Euler analisou em 1736. Kneiphof (B) tem cinco pontes: duas para cada margem e uma para a ilha vizinha, Lomse (C), que por sua vez tem uma ponte para cada margem. As formas e as distâncias estão simplificadas, mas que massa de terra está ligada a qual, e quantas vezes, é histórico.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Fica sem saída de propósito",
        text: "Deixa as sete pontes ligadas, começa em A e tenta atravessar tudo à mão. Depois carrega algumas vezes no botão automático. O percurso guloso escolhe de maneira diferente de cada vez, mas acaba sempre com pelo menos uma ponte por usar.",
      },
      {
        title: "Acrescenta uma ponte que nunca existiu",
        text: "Liga AD, uma ponte direta entre as margens. Agora A e D têm grau quatro, e só B e C são ímpares. O estado passa a «Caminho euleriano», de B para C. Começa em B e consegues terminar a volta; começa em A e vais ficar apeado.",
      },
      {
        title: "Fecha o circuito",
        text: "Com AD ligada, liga também BC2. Agora todos os vértices são pares e o estado diz «Circuito euleriano»: uma viagem de ida e volta pelas nove pontes que acaba onde começou.",
      },
      {
        title: "Retira em vez de acrescentar",
        text: "Volta às sete originais e desliga AC, BC e CD. Lomse (C) sai completamente do grafo, e A, B e D ficam com graus dois, quatro e dois. Sem construir nada de novo, as quatro pontes que restam formam um circuito.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Gå över Königsbergs sju broar själv, slå av och på broar, se hörnens grader ändras och upptäck Eulers paritetsregel och Hierholzers algoritm i arbete.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Kartan visar två flodstränder (A i norr, D i söder) och två öar (Kneiphof, B, och Lomse, C) som binds samman av broar. Du väljer en startpunkt och klickar sedan på broar för att gå över dem, en efter en, utan att någonsin använda samma bro två gånger. Frågan är den som invånarna i Königsberg sägs ha ställt: kan man gå över varje bro exakt en gång? Med de sju broarna är svaret nej, och det kan du ta reda på den ärliga vägen: genom att köra fast.",
    sections: [
      {
        heading: "Eulers paritetsargument",
        paragraphs: [
          "År 1736 insåg Leonhard Euler att landets form och broarnas längd saknar betydelse. Det enda som spelar roll är vilka landområden som hänger ihop, och med hur många broar. I dag kallas det en graf: landområdena är hörn, broarna är kanter, och antalet broar vid ett landområde är dess grad.",
          "Varje gång en vandring passerar genom ett landområde använder den en bro för att komma dit och en annan för att lämna det. Varje hörn mitt i vandringen förbrukar alltså sina broar parvis. Bara starten och slutet kan ha en bro över. En vandring som använder varje kant exakt en gång (en Eulerväg) är därför bara möjlig om högst två hörn har udda grad. Ska den sluta där den började (en Eulerkrets) måste alla grader vara jämna. För en sammanhängande graf är villkoren också tillräckliga.",
          "I standarduppställningen har ön B fem broar, och A, C och D har tre var. Fyra udda hörn, så någon sådan vandring finns inte, oavsett var du börjar eller hur listigt du väljer.",
        ],
        formula: parityFormula("udda", "är jämnt"),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "”Börja vid” väljer landområdet där din vandring börjar, och det markeras på kartan. På canvasen lyser de broar du får gå över härnäst upp när du håller pekaren över dem. Ett klick på kort avstånd från en bro går över den, så länge den rör vid ditt nuvarande landområde och inte redan har använts. Korsade broar bleknar och får en numrerad markör.",
          "Listan ”Broar” har tio poster: de sju historiska broarna, som är på från början, plus tre hypotetiska som aldrig har funnits och ritas streckade (två direkta broar från strand till strand, AD och AD2, och en andra bro mellan öarna, BC2). När du slår av eller på någon av dem räknas alla grader om, liksom märket udda eller jämn vid varje hörn och statusen överst: Eulerkrets, Eulerväg (med sina två möjliga ändpunkter), inte eulersk eller osammanhängande. Ändrar du brouppsättningen eller starten återställs din vandring.",
          "Autoknappen byter uppgift beroende på grafen. Om det finns en Eulerväg eller Eulerkrets animerar den Hierholzers algoritm som går över varje bro exakt en gång, en bro var 650:e millisekund. Den börjar vid din start om en fullständig vandring kan börja där, och flyttar annars starten till ett udda hörn. Om ingen finns kör den en girig vandring som i varje steg väljer en slumpmässig oanvänd bro tills ingen finns kvar, och du får se den köra fast.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Kartan ritas på en 2D-canvas i ett fast logiskt koordinatrum på 800 gånger 500 enheter, skalat efter din skärm och dess pixeltäthet. Varje bro är en kubisk Bézierkurva mellan två hörns mittpunkter. För att avgöra vilken bro du klickade på samplar utforskaren varje kurva i 25 punkter och tar den bro vars närmaste sampel ligger inom 30 enheter från pekaren.",
          "Själva grafen är bara listan med de aktiva broarnas id:n. Graderna räknas genom att gå igenom den listan en gång. Sammanhang avgörs med en djupet-först-sökning över de hörn som fortfarande har minst en bro, så ett landområde som har blivit av med alla sina broar ignoreras helt enkelt i stället för att grafen ska räknas som osammanhängande. Hierholzers algoritm använder en stack: den fortsätter att följa oanvända kanter, och varje gång den når en återvändsgränd backar den och antecknar kanten den backar ut ur. Vänder man på den anteckningen får man Eulervandringen.",
          "Det finns ingen kontinuerlig animation på den här sidan. Kartan ritas bara om när något ändras (en pekarrörelse över en bro, en korsning, en bro som slås av eller på) eller när canvasen ändrar storlek.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Varför en enda bro ändrar allt",
        paragraphs: [
          "Att lägga till eller ta bort en enda bro ändrar graden hos exakt två hörn med ett, och växlar därmed pariteten i båda ändarna. Det är därför statusen hoppar i steg om två: från fyra udda hörn till två, eller från två till noll. Det är också därför en graf aldrig har exakt ett eller tre udda hörn: graderna summerar alltid till det dubbla antalet kanter.",
          "Kartan är en schematisk bild av den uppställning som Euler analyserade 1736. Kneiphof (B) har fem broar: två till vardera stranden och en till grannön Lomse (C), som i sin tur har en bro till vardera stranden. Former och avstånd är förenklade, men vilket landområde som är förbundet med vilket, och hur många gånger, är historiskt.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Kör fast med flit",
        text: "Låt de sju broarna vara på, börja vid A och försök gå över allt för hand. Tryck sedan på autoknappen några gånger. Den giriga vandringen väljer olika varje gång, men den slutar alltid med minst en oanvänd bro.",
      },
      {
        title: "Lägg till en bro som aldrig har funnits",
        text: "Slå på AD, en direkt bro mellan stränderna. Nu har A och D grad fyra, och bara B och C är udda. Statusen slår om till ”Eulerväg”, från B till C. Börja vid B så kan du fullfölja turen. Börja vid A så blir du strandsatt.",
      },
      {
        title: "Slut kretsen",
        text: "Med AD på, slå också på BC2. Nu är varje hörn jämnt, och statusen säger ”Eulerkrets”: en rundtur över alla nio broarna som slutar där den började.",
      },
      {
        title: "Ta bort i stället för att lägga till",
        text: "Gå tillbaka till de ursprungliga sju och slå av AC, BC och CD. Lomse (C) faller helt ur grafen, och A, B och D står kvar med graderna två, fyra och två. Utan att något nytt byggs bildar de fyra återstående broarna en krets.",
      },
    ],
  },
  no: {
    metaDescription:
      "Gå over Königsbergs sju broer selv, slå broer av og på, se gradene til hjørnene endre seg, og oppdag Eulers paritetsregel og Hierholzers algoritme i arbeid.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Kartet viser to elvebredder (A i nord, D i sør) og to øyer (Kneiphof, B, og Lomse, C), forbundet med broer. Du velger et startpunkt og klikker så på broer for å krysse dem, én etter én, uten noen gang å bruke samme bro to ganger. Spørsmålet er det innbyggerne i Königsberg skal ha stilt: Kan man krysse hver bro nøyaktig én gang? Med de sju broene er svaret nei, og det kan du finne ut på den ærlige måten: ved å kjøre deg fast.",
    sections: [
      {
        heading: "Eulers paritetsargument",
        paragraphs: [
          "I 1736 la Leonhard Euler merke til at formen på landet og lengden på broene er uten betydning. Det eneste som teller, er hvilke landområder som henger sammen, og med hvor mange broer. I dag kalles dette en graf: Landområdene er hjørner, broene er kanter, og antallet broer ved et landområde er graden til hjørnet.",
          "Hver gang en vandring går gjennom et landområde, bruker den én bro for å komme dit og en annen for å dra videre. Hvert hjørne midt i vandringen bruker altså opp broene sine parvis. Bare starten og slutten kan ha en bro til overs. En vandring som bruker hver kant nøyaktig én gang (en Eulervei), er derfor bare mulig hvis høyst to hjørner har odde grad. Skal den slutte der den begynte (en Eulerkrets), må alle grader være jevne. For en sammenhengende graf er disse betingelsene også tilstrekkelige.",
          "I standardoppsettet har øya B fem broer, og A, C og D har tre hver. Fire odde hjørner, så en slik vandring finnes ikke, uansett hvor du starter eller hvor lurt du velger.",
        ],
        formula: parityFormula("odde", "er et partall"),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "«Start ved» velger landområdet der vandringen din begynner, og det utheves på kartet. På lerretet lyser broene du kan krysse som det neste, opp når du holder pekeren over dem. Et klikk i kort avstand fra en bro krysser den, så lenge den berører landområdet du står på, og ikke er brukt ennå. Kryssede broer blekner og får en nummerert markør.",
          "Listen «Broer» har ti oppføringer: de sju historiske broene, som er på fra starten, pluss tre hypotetiske som aldri har eksistert og tegnes stiplet (to direkte broer fra bredd til bredd, AD og AD2, og en ekstra bro mellom øyene, BC2). Når du slår en av dem av eller på, regnes alle grader ut på nytt, i tillegg til merket odde eller jevn ved hvert hjørne og statusen øverst: Eulerkrets, Eulervei (med de to mulige endepunktene), ikke eulersk eller usammenhengende. Endrer du brosettet eller starten, tilbakestilles vandringen din.",
          "Autoknappen bytter oppgave etter grafen. Hvis det finnes en Eulervei eller Eulerkrets, animerer den Hierholzers algoritme som krysser hver bro nøyaktig én gang, én bro hvert 650. millisekund. Den begynner ved starten din hvis en fullstendig vandring kan begynne der, og flytter ellers starten til et odde hjørne. Hvis ingen finnes, kjører den en grådig vandring som i hvert steg velger en tilfeldig ubrukt bro til det ikke er flere igjen, og du ser den kjøre seg fast.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Kartet tegnes på et 2D-lerret i et fast logisk koordinatrom på 800 ganger 500 enheter, skalert etter skjermen din og pikseltettheten. Hver bro er en kubisk Bézier-kurve mellom midtpunktene til to hjørner. For å avgjøre hvilken bro du klikket på, regner utforskeren ut 25 punkter langs hver kurve og tar den broen som har sitt nærmeste punkt innenfor 30 enheter fra pekeren.",
          "Selve grafen er bare listen over ID-ene til de aktive broene. Gradene telles ved å gå gjennom den listen én gang. Sammenheng avgjøres med et dybde-først-søk over de hjørnene som fortsatt har minst én bro, så et landområde som har mistet alle broene sine, blir rett og slett ignorert i stedet for at grafen regnes som usammenhengende. Hierholzers algoritme bruker en stakk: Den fortsetter å følge ubrukte kanter, og hver gang den når en blindvei, går den tilbake og noterer kanten den rygger ut av. Snur man den noteringen, får man Eulervandringen.",
          "Det finnes ingen kontinuerlig animasjon på denne siden. Kartet tegnes bare på nytt når noe endrer seg (en peker over en bro, en kryssing, en bro som slås av eller på) eller når lerretet endrer størrelse.",
        ],
        code: CLASSIFY_EXCERPT,
      },
      {
        heading: "Hvorfor én bro endrer alt",
        paragraphs: [
          "Å legge til eller fjerne én enkelt bro endrer graden til nøyaktig to hjørner med én, og snur dermed pariteten i begge ender. Derfor hopper statusen i steg på to: fra fire odde hjørner til to, eller fra to til null. Det er også derfor en graf aldri har nøyaktig ett eller tre odde hjørner: Gradene summerer seg alltid til det dobbelte av antallet kanter.",
          "Kartet er en skjematisk framstilling av oppsettet Euler analyserte i 1736. Kneiphof (B) har fem broer: to til hver bredd og én til naboøya Lomse (C), som igjen har én bro til hver bredd. Former og avstander er forenklet, men hvilket landområde som er forbundet med hvilket, og hvor mange ganger, er historisk.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Kjør deg fast med vilje",
        text: "La de sju broene stå på, start ved A og prøv å krysse alt for hånd. Trykk så på autoknappen noen ganger. Den grådige vandringen velger forskjellig hver gang, men den ender alltid med minst én ubrukt bro.",
      },
      {
        title: "Legg til en bro som aldri har eksistert",
        text: "Slå på AD, en direkte bro mellom breddene. Nå har A og D grad fire, og bare B og C er odde. Statusen slår om til «Eulervei», fra B til C. Start ved B, så kan du fullføre turen. Start ved A, så blir du stående fast.",
      },
      {
        title: "Lukk kretsen",
        text: "Med AD på, slå også på BC2. Nå er hvert hjørne jevnt, og statusen sier «Eulerkrets»: en rundtur over alle de ni broene som slutter der den begynte.",
      },
      {
        title: "Fjern i stedet for å legge til",
        text: "Gå tilbake til de sju opprinnelige og slå av AC, BC og CD. Lomse (C) faller helt ut av grafen, og A, B og D står igjen med gradene to, fire og to. Uten at noe nytt bygges, danner de fire gjenværende broene en krets.",
      },
    ],
  },
};
