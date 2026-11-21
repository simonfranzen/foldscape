import type { ExplorerGuide } from "./types";

// Numbers quoted here (N 20 to 200 default 80, k 2 to 10 default 4, p in steps
// of 0.01 default 0.1, the eleven curve samples, L and C for N = 80, k = 4)
// match app/[locale]/smallworld/explorer/page.tsx; L and C values were measured with
// its own functions over seeds 1 to 5. Update both together.
const REWIRE_EXCERPT = `// Watts-Strogatz rewiring: for each "forward" edge (i, (i+j)%N), with
// probability p replace its far endpoint with a random node.
for (let j = 1; j <= k; j++) {
  for (let i = 0; i < N; i++) {
    if (rand() < p) {
      const old = (i + j) % N;
      let tries = 0;
      let t = Math.floor(rand() * N);
      while ((t === i || adj[i].has(t)) && tries < 50) {
        t = Math.floor(rand() * N);
        tries++;
      }
      if (t !== i && !adj[i].has(t)) {
        adj[i].delete(old); adj[old].delete(i);
        adj[i].add(t); adj[t].add(i);
      }
    }
  }
}`;

const RING_FORMULA =
  "C_{\\text{ring}} = \\frac{3(k-1)}{2(2k-1)}, \\qquad L_{\\text{ring}} \\approx \\frac{N}{4k}";

export const SMALLWORLD_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Explore the Watts-Strogatz small-world model: rewire a ring network with probability p and watch path length collapse while clustering stays high.",
    heading: "How this explorer works",
    intro:
      "The circle of dots is a network of N nodes. It starts as a tidy ring in which every node is linked to its k nearest neighbours on each side, so friends of friends are usually friends too. Then every link gets a chance p to be cut loose at one end and reattached to a random node. Grey lines are the local links that survived, cyan lines are the long-range shortcuts the rewiring created. The two numbers in the header measure how far apart nodes are (L) and how cliquish the network is (C).",
    sections: [
      {
        heading: "A small world in two numbers",
        paragraphs: [
          "L is the average number of hops on the shortest path between two nodes, taken over all pairs. C, the clustering coefficient, asks for each node what fraction of its neighbours are also linked to each other, and averages that over all nodes. A ring lattice is highly clustered but has long paths: to cross it you have to walk around, k nodes at a time. A completely random graph has short paths but almost no clustering.",
          "Duncan Watts and Steven Strogatz showed in 1998 that you do not have to choose. Rewire just a few percent of the links and L drops almost to the random value, while C hardly moves. Networks with both properties, short paths and dense local cliques, are called small worlds, and they turned out to be everywhere, from acquaintance networks to power grids and neural wiring. For the unrewired ring there are simple formulas for both numbers.",
        ],
        formula:
          "C_{\\text{ring}} = \\frac{3(k-1)}{2(2k-1)}, \\qquad L_{\\text{ring}} \\approx \\frac{N}{4k}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "N sets the number of nodes, from 20 to 200 (default 80). k sets the number of neighbours on each side, from 2 to 10 (default 4), so every node starts with degree 2k. p is the rewiring probability, from 0 to 1 in steps of 0.01 (default 0.1); the buttons below it jump to 0, 0.01, 0.1 and 1. «Generate (new seed)» draws a fresh random graph with the same settings.",
          "Click any node, then a second one, and a breadth-first search highlights a shortest path between them in amber; a third click starts a new selection, and «Clear path» removes it. The statistics panel lists L, C, both relative to the unrewired ring (L/L₀ and C/C₀), and the largest degree, which grows as rewiring piles extra links onto some nodes.",
          "The lower plot is the famous Watts-Strogatz picture for your N and k. It shows L/L₀ in cyan and C/C₀ in rose for eleven values of p from 0 to 1 on a logarithmic axis; the dashed amber line marks your current p.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The graph is an array of sets: adj[i] holds the neighbours of node i, which makes «are these two linked?» a constant-time question. The builder first creates the ring lattice, then walks over the k forward links of every node and, with probability p, moves the far end to a random node, skipping self-loops and duplicate links (it gives up after 50 failed tries). Random numbers come from a small seeded generator, mulberry32, so the same seed always gives the same graph and «Generate» simply increments the seed.",
          "L is computed exactly by running a breadth-first search from every node; pairs that cannot reach each other are left out. C counts, for each node, how many pairs of its neighbours are adjacent. The curve below repeats both computations for eleven separately generated graphs whenever N, k or the seed changes. Even at N = 200 and k = 10 that is only a few thousand searches over a few thousand edges.",
          "Both canvases are drawn once per change and on resize. Nodes sit on a circle, and a link is drawn grey if its endpoints are at most k places apart around the ring and cyan otherwise. Nothing animates, so there is no motion to reduce.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Why so few shortcuts are enough",
        paragraphs: [
          "A single shortcut shortens the trip for every node near either of its ends, so each new one helps many pairs at once. Clustering, on the other hand, only drops for the few triangles the rewired link belonged to. With the default N = 80 and k = 4, the ring has L₀ = 5.44 and C₀ = 9/14 ≈ 0.643. At p = 0.1 the path length typically halves to about 2.8 while clustering keeps roughly three quarters of its value, near 0.47. Only at p = 1 does clustering collapse, to below 0.1, while L barely improves further to about 2.3.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Check the lattice formulas",
        text: "Set p to 0 with N = 80 and k = 4. The panel shows L = 5.44 and C = 0.643, which is exactly 9/14. Change k and compare C with 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Three shortcuts",
        text: "Press the 0.01 button. With N · k = 320 links, that rewires about three of them on average, yet L usually falls from 5.44 to somewhere between 3.5 and 4.5 while C stays above 0.6. Press «Generate» a few times to see how much depends on where those few shortcuts land.",
      },
      {
        title: "A long thin ring",
        text: "Set N = 200 and k = 2, then compare p = 0 with p = 0.01. The ring starts with L ≈ 25.4, and the four or so shortcuts that p = 0.01 creates typically cut that roughly in half, while C barely drops from 0.5.",
      },
      {
        title: "Follow a path across",
        text: "With p = 0, N = 80 and k = 4, click two nodes on opposite sides of the circle: the shortest path needs 10 hops. Now raise p to 0.1 without clicking anything else. The path is recomputed on the new graph, typically uses a cyan shortcut or two, and usually needs only two to five hops.",
      },
    ],
  },
  de: {
    metaDescription:
      "Das Kleine-Welt-Modell von Watts und Strogatz erkunden: ein Ringnetz mit Wahrscheinlichkeit p umverdrahten und zusehen, wie die Pfadlänge einbricht.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Der Kreis aus Punkten ist ein Netzwerk aus N Knoten. Es beginnt als ordentlicher Ring, in dem jeder Knoten mit seinen k nächsten Nachbarn auf jeder Seite verbunden ist, Freund:innen von Freund:innen sind also meist auch befreundet. Dann bekommt jede Verbindung mit Wahrscheinlichkeit p die Chance, an einem Ende gelöst und an einen zufälligen Knoten gehängt zu werden. Graue Linien sind die erhaltenen lokalen Verbindungen, cyanfarbene die Abkürzungen, die durch das Umverdrahten entstanden sind. Die beiden Zahlen oben messen, wie weit Knoten voneinander entfernt sind (L) und wie cliquenhaft das Netz ist (C).",
    sections: [
      {
        heading: "Eine kleine Welt in zwei Zahlen",
        paragraphs: [
          "L ist die durchschnittliche Zahl der Schritte auf dem kürzesten Weg zwischen zwei Knoten, gemittelt über alle Paare. C, der Clusterkoeffizient, fragt für jeden Knoten, welcher Anteil seiner Nachbarn auch untereinander verbunden ist, und mittelt das über alle Knoten. Ein Ringgitter ist stark geclustert, hat aber lange Wege: Um es zu durchqueren, musst du außen herum laufen, k Knoten pro Schritt. Ein völlig zufälliger Graph hat kurze Wege, aber kaum Cluster.",
          "Duncan Watts und Steven Strogatz zeigten 1998, dass man sich nicht entscheiden muss. Verdrahtest du nur ein paar Prozent der Verbindungen um, fällt L fast auf den Zufallswert, während C sich kaum rührt. Netze mit beiden Eigenschaften, kurzen Wegen und dichten lokalen Cliquen, heißen Kleine Welten, und sie stellten sich als allgegenwärtig heraus, von Bekanntschaftsnetzen über Stromnetze bis zur Verschaltung von Nervenzellen. Für den nicht umverdrahteten Ring gibt es einfache Formeln für beide Zahlen.",
        ],
        formula:
          "C_{\\text{Ring}} = \\frac{3(k-1)}{2(2k-1)}, \\qquad L_{\\text{Ring}} \\approx \\frac{N}{4k}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "N legt die Zahl der Knoten fest, von 20 bis 200 (voreingestellt 80). k ist die Zahl der Nachbarn pro Seite, von 2 bis 10 (voreingestellt 4), jeder Knoten startet also mit Grad 2k. p ist die Umverdrahtungswahrscheinlichkeit, von 0 bis 1 in Schritten von 0,01 (voreingestellt 0,1); die Knöpfe darunter springen auf 0, 0,01, 0,1 und 1. «Neu erzeugen (neuer Startwert)» würfelt mit denselben Einstellungen einen neuen Graphen.",
          "Klick auf einen Knoten und dann auf einen zweiten, und eine Breitensuche hebt einen kürzesten Weg zwischen ihnen in Bernstein hervor; ein dritter Klick beginnt eine neue Auswahl, «Pfad löschen» entfernt sie. Das Statistikfeld zeigt L, C, beide im Verhältnis zum nicht umverdrahteten Ring (L/L₀ und C/C₀), und den größten Knotengrad, der wächst, weil das Umverdrahten manchen Knoten zusätzliche Verbindungen aufbürdet.",
          "Das untere Diagramm ist das berühmte Watts-Strogatz-Bild für dein N und k. Es zeigt L/L₀ in Cyan und C/C₀ in Rosa für elf Werte von p zwischen 0 und 1 auf logarithmischer Achse; die gestrichelte bernsteinfarbene Linie markiert dein aktuelles p.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Graph ist ein Array von Mengen: adj[i] enthält die Nachbarn von Knoten i, so lässt sich «sind die beiden verbunden?» in konstanter Zeit beantworten. Der Aufbau erzeugt zuerst das Ringgitter, geht dann die k Vorwärtsverbindungen jedes Knotens durch und verlegt mit Wahrscheinlichkeit p das ferne Ende auf einen zufälligen Knoten. Schleifen und doppelte Verbindungen werden übersprungen (nach 50 Fehlversuchen gibt er auf). Die Zufallszahlen stammen aus einem kleinen Generator mit Startwert, mulberry32: Derselbe Startwert ergibt immer denselben Graphen, und «Neu erzeugen» erhöht einfach den Startwert.",
          "L wird exakt berechnet, mit einer Breitensuche von jedem Knoten aus; Paare, die sich nicht erreichen, werden ausgelassen. C zählt für jeden Knoten, wie viele Paare seiner Nachbarn benachbart sind. Die Kurve darunter wiederholt beide Rechnungen für elf eigens erzeugte Graphen, sobald sich N, k oder der Startwert ändert. Selbst bei N = 200 und k = 10 sind das nur einige tausend Suchen über einige tausend Kanten.",
          "Beide Canvas-Flächen werden bei jeder Änderung und Größenänderung einmal gezeichnet. Die Knoten sitzen auf einem Kreis, eine Verbindung wird grau gezeichnet, wenn ihre Enden höchstens k Plätze auseinanderliegen, sonst cyan. Nichts ist animiert, es gibt also keine Bewegung, die sich reduzieren ließe.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Warum so wenige Abkürzungen reichen",
        paragraphs: [
          "Eine einzige Abkürzung verkürzt den Weg für jeden Knoten in der Nähe eines ihrer Enden, jede neue hilft also vielen Paaren auf einmal. Der Clusterkoeffizient sinkt dagegen nur für die wenigen Dreiecke, zu denen die verlegte Verbindung gehörte. Mit den Standardwerten N = 80 und k = 4 hat der Ring L₀ = 5,44 und C₀ = 9/14 ≈ 0,643. Bei p = 0,1 halbiert sich die Pfadlänge typischerweise auf etwa 2,8, während der Clusterkoeffizient rund drei Viertel seines Werts behält, etwa 0,47. Erst bei p = 1 bricht er ein, auf unter 0,1, während L sich nur noch auf etwa 2,3 verbessert.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Die Gitterformeln prüfen",
        text: "Setz p auf 0, mit N = 80 und k = 4. Das Feld zeigt L = 5,44 und C = 0,643, also genau 9/14. Ändere k und vergleiche C mit 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Drei Abkürzungen",
        text: "Drück den Knopf 0,01. Bei N · k = 320 Verbindungen werden im Schnitt etwa drei umverdrahtet, und trotzdem fällt L meist von 5,44 auf einen Wert zwischen 3,5 und 4,5, während C über 0,6 bleibt. Drück ein paarmal «Neu erzeugen», um zu sehen, wie viel davon abhängt, wo diese wenigen Abkürzungen landen.",
      },
      {
        title: "Ein langer dünner Ring",
        text: "Stell N = 200 und k = 2 ein und vergleiche p = 0 mit p = 0,01. Der Ring startet mit L ≈ 25,4, und die etwa vier Abkürzungen, die p = 0,01 erzeugt, halbieren das typischerweise ungefähr, während C kaum unter 0,5 fällt.",
      },
      {
        title: "Einem Weg quer durch folgen",
        text: "Klick bei p = 0, N = 80 und k = 4 auf zwei gegenüberliegende Knoten: Der kürzeste Weg braucht 10 Schritte. Erhöhe jetzt p auf 0,1, ohne etwas anderes anzuklicken. Der Weg wird auf dem neuen Graphen neu berechnet, nutzt meist eine oder zwei cyanfarbene Abkürzungen und braucht meist nur noch zwei bis fünf Schritte.",
      },
    ],
  },
  es: {
    metaDescription:
      "Explora el modelo de mundo pequeño de Watts y Strogatz: reconecta una red en anillo con probabilidad p y mira cómo se desploma la longitud de los caminos.",
    heading: "Cómo funciona este explorador",
    intro:
      "El círculo de puntos es una red de N nodos. Empieza como un anillo ordenado en el que cada nodo está enlazado con sus k vecinos más cercanos a cada lado, de modo que quienes comparten una amistad suelen ser también amigos entre sí. Después, cada enlace tiene una probabilidad p de soltarse por un extremo y volver a engancharse a un nodo al azar. Las líneas grises son los enlaces locales que han sobrevivido, las líneas cian son los atajos de largo alcance que ha creado la reconexión. Los dos números de la cabecera miden lo lejos que están los nodos entre sí (L) y lo dada que es la red a formar camarillas (C).",
    sections: [
      {
        heading: "Un mundo pequeño en dos números",
        paragraphs: [
          "L es el número medio de saltos del camino más corto entre dos nodos, calculado sobre todos los pares. C, el coeficiente de agrupamiento, pregunta para cada nodo qué fracción de sus vecinos están además enlazados entre sí, y promedia eso sobre todos los nodos. Una retícula en anillo está muy agrupada pero tiene caminos largos: para cruzarla hay que dar la vuelta, de k en k nodos. Un grafo completamente aleatorio tiene caminos cortos pero casi ningún agrupamiento.",
          "Duncan Watts y Steven Strogatz mostraron en 1998 que no hace falta elegir. Basta reconectar un pequeño porcentaje de los enlaces para que L caiga casi hasta el valor aleatorio, mientras que C apenas se mueve. Las redes con ambas propiedades, caminos cortos y camarillas locales densas, se llaman mundos pequeños, y resultó que están por todas partes, desde las redes de conocidos hasta las redes eléctricas y el cableado neuronal. Para el anillo sin reconectar hay fórmulas sencillas para los dos números.",
        ],
        formula: RING_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "N fija el número de nodos, de 20 a 200 (80 por defecto). k fija el número de vecinos a cada lado, de 2 a 10 (4 por defecto), así que cada nodo empieza con grado 2k. p es la probabilidad de reconexión, de 0 a 1 en pasos de 0,01 (0,1 por defecto); los botones de debajo saltan a 0; 0,01; 0,1 y 1. «Generate (new seed)» genera un nuevo grafo aleatorio con los mismos ajustes.",
          "Haz clic en un nodo cualquiera y luego en otro, y una búsqueda en anchura resalta en ámbar un camino más corto entre ambos; un tercer clic inicia una nueva selección, y «Clear path» la borra. El panel de estadísticas muestra L, C, ambos en relación con el anillo sin reconectar (L/L₀ y C/C₀), y el grado máximo, que crece a medida que la reconexión acumula enlaces de más en algunos nodos.",
          "El gráfico inferior es la famosa imagen de Watts y Strogatz para tus valores de N y k. Muestra L/L₀ en cian y C/C₀ en rosa para once valores de p entre 0 y 1 en un eje logarítmico; la línea discontinua de color ámbar marca tu p actual.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El grafo es un array de conjuntos: adj[i] contiene los vecinos del nodo i, lo que convierte «¿están enlazados estos dos?» en una pregunta de tiempo constante. El constructor crea primero la retícula en anillo, después recorre los k enlaces hacia delante de cada nodo y, con probabilidad p, traslada el extremo lejano a un nodo al azar, saltándose los bucles sobre el propio nodo y los enlaces duplicados (se rinde tras 50 intentos fallidos). Los números aleatorios salen de un pequeño generador con semilla, mulberry32, así que la misma semilla da siempre el mismo grafo y «Generate» simplemente incrementa la semilla.",
          "L se calcula de forma exacta lanzando una búsqueda en anchura desde cada nodo; los pares que no pueden alcanzarse se dejan fuera. C cuenta, para cada nodo, cuántos pares de sus vecinos son adyacentes. La curva de abajo repite ambos cálculos para once grafos generados por separado cada vez que cambian N, k o la semilla. Incluso con N = 200 y k = 10 son solo unos miles de búsquedas sobre unos miles de aristas.",
          "Los dos lienzos se dibujan una vez por cada cambio y al cambiar de tamaño. Los nodos están sobre un círculo, y un enlace se dibuja en gris si sus extremos están como mucho a k puestos de distancia a lo largo del anillo y en cian en caso contrario. Nada está animado, así que no hay movimiento que reducir.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Por qué bastan tan pocos atajos",
        paragraphs: [
          "Un solo atajo acorta el trayecto de todos los nodos cercanos a cualquiera de sus extremos, así que cada atajo nuevo ayuda a muchos pares a la vez. El agrupamiento, en cambio, solo baja para los pocos triángulos a los que pertenecía el enlace reconectado. Con los valores por defecto N = 80 y k = 4, el anillo tiene L₀ = 5,44 y C₀ = 9/14 ≈ 0,643. Con p = 0,1, la longitud de camino suele reducirse a la mitad, hasta unos 2,8, mientras que el agrupamiento conserva aproximadamente tres cuartos de su valor, cerca de 0,47. Solo con p = 1 se desploma el agrupamiento, por debajo de 0,1, mientras que L apenas mejora ya, hasta unos 2,3.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Comprueba las fórmulas de la retícula",
        text: "Pon p en 0 con N = 80 y k = 4. El panel muestra L = 5,44 y C = 0,643, que es exactamente 9/14. Cambia k y compara C con 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Tres atajos",
        text: "Pulsa el botón 0,01. Con N · k = 320 enlaces, eso reconecta unos tres de media, y aun así L suele caer de 5,44 a algún valor entre 3,5 y 4,5, mientras que C se mantiene por encima de 0,6. Pulsa «Generate» unas cuantas veces para ver cuánto depende de dónde caen esos pocos atajos.",
      },
      {
        title: "Un anillo largo y delgado",
        text: "Pon N = 200 y k = 2, y compara p = 0 con p = 0,01. El anillo empieza con L ≈ 25,4, y los cuatro atajos, más o menos, que crea p = 0,01 suelen reducirlo aproximadamente a la mitad, mientras que C apenas baja de 0,5.",
      },
      {
        title: "Sigue un camino de lado a lado",
        text: "Con p = 0, N = 80 y k = 4, haz clic en dos nodos situados en lados opuestos del círculo: el camino más corto necesita 10 saltos. Ahora sube p a 0,1 sin hacer clic en nada más. El camino se recalcula sobre el nuevo grafo, suele aprovechar uno o dos atajos de color cian y normalmente necesita solo entre dos y cinco saltos.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Explore le modèle du petit monde de Watts et Strogatz : recâble un réseau en anneau avec la probabilité p et regarde la longueur des chemins s'effondrer.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le cercle de points est un réseau de N nœuds. Au départ, c'est un anneau bien rangé où chaque nœud est relié à ses k plus proches voisins de chaque côté, si bien que les amis de tes amis sont en général aussi tes amis. Ensuite, chaque lien a une probabilité p d'être détaché à une extrémité et rattaché à un nœud pris au hasard. Les traits gris sont les liens locaux qui ont survécu, les traits cyan sont les raccourcis à longue portée créés par le recâblage. Les deux nombres de l'en-tête mesurent à quelle distance les nœuds se trouvent les uns des autres (L) et à quel point le réseau forme des cliques (C).",
    sections: [
      {
        heading: "Un petit monde en deux nombres",
        paragraphs: [
          "L est le nombre moyen de sauts sur le plus court chemin entre deux nœuds, calculé sur toutes les paires. C, le coefficient de clustering, demande pour chaque nœud quelle fraction de ses voisins sont aussi reliés entre eux, puis en fait la moyenne sur tous les nœuds. Un réseau régulier en anneau est fortement regroupé mais ses chemins sont longs : pour le traverser, il faut en faire le tour, k nœuds à la fois. Un graphe complètement aléatoire a des chemins courts mais presque aucun regroupement.",
          "Duncan Watts et Steven Strogatz ont montré en 1998 qu'il n'est pas nécessaire de choisir. Recâble seulement quelques pour cent des liens et L tombe presque à la valeur aléatoire, tandis que C bouge à peine. Les réseaux qui réunissent les deux propriétés, chemins courts et cliques locales denses, s'appellent des petits mondes, et il s'est avéré qu'on en trouve partout, des réseaux de connaissances aux réseaux électriques et au câblage des neurones. Pour l'anneau non recâblé, il existe des formules simples pour les deux nombres.",
        ],
        formula: RING_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "N fixe le nombre de nœuds, de 20 à 200 (80 par défaut). k fixe le nombre de voisins de chaque côté, de 2 à 10 (4 par défaut), de sorte que chaque nœud commence avec un degré 2k. p est la probabilité de recâblage, de 0 à 1 par pas de 0,01 (0,1 par défaut) ; les boutons en dessous sautent à 0 ; 0,01 ; 0,1 et 1. « Generate (new seed) » tire un nouveau graphe aléatoire avec les mêmes réglages.",
          "Clique sur un nœud quelconque, puis sur un second, et un parcours en largeur met en évidence en ambre un plus court chemin entre les deux ; un troisième clic lance une nouvelle sélection, et « Clear path » l'efface. Le panneau de statistiques indique L, C, tous deux rapportés à l'anneau non recâblé (L/L₀ et C/C₀), ainsi que le degré maximal, qui augmente à mesure que le recâblage accumule des liens supplémentaires sur certains nœuds.",
          "Le graphique du bas est la célèbre figure de Watts et Strogatz pour tes valeurs de N et k. Il montre L/L₀ en cyan et C/C₀ en rose pour onze valeurs de p entre 0 et 1 sur un axe logarithmique ; la ligne ambre en pointillés marque ton p actuel.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Le graphe est un tableau d'ensembles : adj[i] contient les voisins du nœud i, ce qui fait de « ces deux-là sont-ils reliés ? » une question à temps constant. Le constructeur crée d'abord le réseau en anneau, puis parcourt les k liens vers l'avant de chaque nœud et, avec la probabilité p, déplace l'extrémité lointaine vers un nœud au hasard, en évitant les boucles sur soi-même et les liens en double (il abandonne après 50 essais ratés). Les nombres aléatoires proviennent d'un petit générateur à graine, mulberry32, si bien que la même graine donne toujours le même graphe et que « Generate » se contente d'incrémenter la graine.",
          "L est calculé exactement en lançant un parcours en largeur depuis chaque nœud ; les paires qui ne peuvent pas se rejoindre sont laissées de côté. C compte, pour chaque nœud, combien de paires de ses voisins sont adjacentes. La courbe du dessous refait les deux calculs pour onze graphes générés séparément chaque fois que N, k ou la graine change. Même avec N = 200 et k = 10, cela ne représente que quelques milliers de parcours sur quelques milliers d'arêtes.",
          "Les deux canevas sont dessinés une fois à chaque changement et à chaque redimensionnement. Les nœuds sont placés sur un cercle, et un lien est tracé en gris si ses extrémités sont distantes d'au plus k places le long de l'anneau, en cyan sinon. Rien n'est animé, il n'y a donc aucun mouvement à réduire.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Pourquoi si peu de raccourcis suffisent",
        paragraphs: [
          "Un seul raccourci abrège le trajet de tous les nœuds proches de l'une ou l'autre de ses extrémités, donc chaque nouveau raccourci aide beaucoup de paires à la fois. Le clustering, lui, ne baisse que pour les quelques triangles auxquels appartenait le lien recâblé. Avec les valeurs par défaut N = 80 et k = 4, l'anneau a L₀ = 5,44 et C₀ = 9/14 ≈ 0,643. À p = 0,1, la longueur des chemins est en général divisée par deux, à environ 2,8, alors que le clustering conserve à peu près les trois quarts de sa valeur, près de 0,47. Ce n'est qu'à p = 1 que le clustering s'effondre, en dessous de 0,1, tandis que L ne s'améliore plus guère, jusqu'à environ 2,3.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Vérifie les formules de l'anneau",
        text: "Mets p à 0 avec N = 80 et k = 4. Le panneau affiche L = 5,44 et C = 0,643, soit exactement 9/14. Change k et compare C à 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Trois raccourcis",
        text: "Appuie sur le bouton 0,01. Avec N · k = 320 liens, cela en recâble environ trois en moyenne, et pourtant L tombe en général de 5,44 à une valeur comprise entre 3,5 et 4,5, tandis que C reste au-dessus de 0,6. Appuie plusieurs fois sur « Generate » pour voir à quel point tout dépend de l'endroit où tombent ces quelques raccourcis.",
      },
      {
        title: "Un anneau long et mince",
        text: "Règle N = 200 et k = 2, puis compare p = 0 et p = 0,01. L'anneau part de L ≈ 25,4, et les quatre raccourcis environ que crée p = 0,01 divisent le plus souvent cette valeur à peu près par deux, alors que C descend à peine sous 0,5.",
      },
      {
        title: "Suis un chemin d'un bord à l'autre",
        text: "Avec p = 0, N = 80 et k = 4, clique sur deux nœuds situés de part et d'autre du cercle : le plus court chemin demande 10 sauts. Monte maintenant p à 0,1 sans cliquer sur quoi que ce soit d'autre. Le chemin est recalculé sur le nouveau graphe, emprunte le plus souvent un ou deux raccourcis cyan et ne demande en général que deux à cinq sauts.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esplora il modello del piccolo mondo di Watts e Strogatz: ricabla una rete ad anello con probabilità p e guarda crollare la lunghezza dei cammini.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il cerchio di punti è una rete di N nodi. All'inizio è un anello ordinato in cui ogni nodo è collegato ai suoi k vicini più prossimi su ciascun lato, per cui gli amici degli amici sono di solito amici anche tra loro. Poi ogni collegamento ha una probabilità p di essere staccato a un'estremità e riattaccato a un nodo a caso. Le linee grigie sono i collegamenti locali sopravvissuti, le linee ciano sono le scorciatoie a lungo raggio create dal ricablaggio. I due numeri nell'intestazione misurano quanto sono lontani i nodi tra loro (L) e quanto la rete tende a formare cricche (C).",
    sections: [
      {
        heading: "Un piccolo mondo in due numeri",
        paragraphs: [
          "L è il numero medio di passi sul cammino più breve tra due nodi, calcolato su tutte le coppie. C, il coefficiente di clustering, chiede per ogni nodo quale frazione dei suoi vicini è collegata anche tra loro, e ne fa la media su tutti i nodi. Un reticolo ad anello ha un clustering elevato ma cammini lunghi: per attraversarlo bisogna fare il giro, k nodi alla volta. Un grafo completamente casuale ha cammini brevi ma quasi nessun clustering.",
          "Duncan Watts e Steven Strogatz mostrarono nel 1998 che non occorre scegliere. Basta ricablare pochi punti percentuali dei collegamenti perché L scenda quasi al valore casuale, mentre C si muove appena. Le reti con entrambe le proprietà, cammini brevi e fitte cricche locali, si chiamano piccoli mondi, e si è scoperto che sono ovunque, dalle reti di conoscenze alle reti elettriche e ai collegamenti tra neuroni. Per l'anello non ricablato esistono formule semplici per entrambi i numeri.",
        ],
        formula: RING_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "N imposta il numero di nodi, da 20 a 200 (predefinito 80). k imposta il numero di vicini per lato, da 2 a 10 (predefinito 4), quindi ogni nodo parte con grado 2k. p è la probabilità di ricablaggio, da 0 a 1 a passi di 0,01 (predefinito 0,1); i pulsanti sotto saltano a 0; 0,01; 0,1 e 1. «Generate (new seed)» estrae un nuovo grafo casuale con le stesse impostazioni.",
          "Fai clic su un nodo qualsiasi, poi su un secondo, e una ricerca in ampiezza evidenzia in ambra un cammino minimo tra i due; un terzo clic avvia una nuova selezione, e «Clear path» la rimuove. Il pannello delle statistiche elenca L, C, entrambi in rapporto all'anello non ricablato (L/L₀ e C/C₀), e il grado massimo, che cresce man mano che il ricablaggio accumula collegamenti in più su alcuni nodi.",
          "Il grafico in basso è la celebre figura di Watts e Strogatz per i tuoi N e k. Mostra L/L₀ in ciano e C/C₀ in rosa per undici valori di p tra 0 e 1 su un asse logaritmico; la linea tratteggiata color ambra indica il tuo p attuale.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Il grafo è un array di insiemi: adj[i] contiene i vicini del nodo i, il che rende «questi due sono collegati?» una domanda a tempo costante. Il costruttore crea prima il reticolo ad anello, poi scorre i k collegamenti in avanti di ogni nodo e, con probabilità p, sposta l'estremità lontana su un nodo a caso, saltando i cappi e i collegamenti doppi (rinuncia dopo 50 tentativi falliti). I numeri casuali vengono da un piccolo generatore con seme, mulberry32, quindi lo stesso seme dà sempre lo stesso grafo e «Generate» si limita a incrementare il seme.",
          "L è calcolato esattamente lanciando una ricerca in ampiezza da ogni nodo; le coppie che non possono raggiungersi vengono escluse. C conta, per ogni nodo, quante coppie dei suoi vicini sono adiacenti. La curva sotto ripete entrambi i calcoli per undici grafi generati separatamente ogni volta che cambia N, k o il seme. Anche con N = 200 e k = 10 si tratta solo di qualche migliaio di ricerche su qualche migliaio di collegamenti.",
          "Entrambi i canvas vengono disegnati una volta a ogni modifica e al ridimensionamento. I nodi stanno su un cerchio, e un collegamento è disegnato in grigio se i suoi estremi distano al massimo k posti lungo l'anello, in ciano altrimenti. Niente è animato, quindi non c'è alcun movimento da ridurre.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Perché bastano così poche scorciatoie",
        paragraphs: [
          "Una sola scorciatoia accorcia il tragitto per tutti i nodi vicini a una delle sue estremità, quindi ogni nuova scorciatoia aiuta molte coppie in una volta. Il clustering, invece, cala solo per i pochi triangoli di cui faceva parte il collegamento ricablato. Con i valori predefiniti N = 80 e k = 4, l'anello ha L₀ = 5,44 e C₀ = 9/14 ≈ 0,643. Con p = 0,1 la lunghezza dei cammini tipicamente si dimezza, a circa 2,8, mentre il clustering conserva all'incirca tre quarti del suo valore, intorno a 0,47. Solo con p = 1 il clustering crolla, sotto 0,1, mentre L migliora ancora di poco, fino a circa 2,3.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Verifica le formule del reticolo",
        text: "Imposta p a 0 con N = 80 e k = 4. Il pannello mostra L = 5,44 e C = 0,643, che è esattamente 9/14. Cambia k e confronta C con 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Tre scorciatoie",
        text: "Premi il pulsante 0,01. Con N · k = 320 collegamenti, in media ne vengono ricablati circa tre, eppure L di solito scende da 5,44 a un valore tra 3,5 e 4,5, mentre C resta sopra 0,6. Premi «Generate» qualche volta per vedere quanto dipende da dove finiscono quelle poche scorciatoie.",
      },
      {
        title: "Un anello lungo e sottile",
        text: "Imposta N = 200 e k = 2, poi confronta p = 0 con p = 0,01. L'anello parte da L ≈ 25,4, e le circa quattro scorciatoie create da p = 0,01 tipicamente lo riducono più o meno della metà, mentre C scende appena da 0,5.",
      },
      {
        title: "Segui un cammino da parte a parte",
        text: "Con p = 0, N = 80 e k = 4, fai clic su due nodi ai lati opposti del cerchio: il cammino minimo richiede 10 passi. Ora porta p a 0,1 senza fare clic su nient'altro. Il cammino viene ricalcolato sul nuovo grafo, sfrutta tipicamente una o due scorciatoie ciano e di solito richiede solo da due a cinque passi.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Explora o modelo de mundo pequeno de Watts e Strogatz: religa uma rede em anel com probabilidade p e vê o comprimento dos caminhos cair a pique.",
    heading: "Como funciona este explorador",
    intro:
      "O círculo de pontos é uma rede de N nós. Começa como um anel arrumado em que cada nó está ligado aos seus k vizinhos mais próximos de cada lado, pelo que os amigos dos amigos costumam ser também amigos entre si. Depois, cada ligação tem uma probabilidade p de ser solta numa ponta e presa de novo a um nó ao acaso. As linhas cinzentas são as ligações locais que sobreviveram, as linhas ciano são os atalhos de longo alcance criados pela religação. Os dois números no cabeçalho medem a que distância os nós estão uns dos outros (L) e até que ponto a rede forma grupos fechados (C).",
    sections: [
      {
        heading: "Um mundo pequeno em dois números",
        paragraphs: [
          "L é o número médio de saltos no caminho mais curto entre dois nós, calculado sobre todos os pares. C, o coeficiente de aglomeração, pergunta para cada nó que fração dos seus vizinhos estão também ligados entre si, e faz a média sobre todos os nós. Um reticulado em anel é muito aglomerado mas tem caminhos longos: para o atravessar tens de dar a volta, k nós de cada vez. Um grafo completamente aleatório tem caminhos curtos mas quase nenhuma aglomeração.",
          "Duncan Watts e Steven Strogatz mostraram em 1998 que não é preciso escolher. Basta religar uma pequena percentagem das ligações para L cair quase até ao valor aleatório, enquanto C mal se mexe. As redes com as duas propriedades, caminhos curtos e grupos locais densos, chamam-se mundos pequenos, e afinal estão por todo o lado, das redes de conhecidos às redes elétricas e às ligações entre neurónios. Para o anel sem religação há fórmulas simples para os dois números.",
        ],
        formula: RING_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "N define o número de nós, de 20 a 200 (80 por omissão). k define o número de vizinhos de cada lado, de 2 a 10 (4 por omissão), pelo que cada nó começa com grau 2k. p é a probabilidade de religação, de 0 a 1 em passos de 0,01 (0,1 por omissão); os botões por baixo saltam para 0; 0,01; 0,1 e 1. «Generate (new seed)» gera um novo grafo aleatório com as mesmas definições.",
          "Clica num nó qualquer e depois noutro, e uma busca em largura destaca a âmbar um caminho mais curto entre os dois; um terceiro clique inicia uma nova seleção, e «Clear path» remove-a. O painel de estatísticas lista L, C, ambos em relação ao anel sem religação (L/L₀ e C/C₀), e o grau máximo, que cresce à medida que a religação acumula ligações a mais em alguns nós.",
          "O gráfico de baixo é a famosa figura de Watts e Strogatz para os teus N e k. Mostra L/L₀ a ciano e C/C₀ a rosa para onze valores de p entre 0 e 1 num eixo logarítmico; a linha tracejada âmbar assinala o teu p atual.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O grafo é um array de conjuntos: adj[i] guarda os vizinhos do nó i, o que faz de «estes dois estão ligados?» uma pergunta de tempo constante. O construtor cria primeiro o reticulado em anel, depois percorre as k ligações para a frente de cada nó e, com probabilidade p, muda a ponta distante para um nó ao acaso, saltando os laços sobre o próprio nó e as ligações duplicadas (desiste ao fim de 50 tentativas falhadas). Os números aleatórios vêm de um pequeno gerador com semente, mulberry32, pelo que a mesma semente dá sempre o mesmo grafo e «Generate» limita-se a incrementar a semente.",
          "L é calculado de forma exata, correndo uma busca em largura a partir de cada nó; os pares que não conseguem alcançar-se ficam de fora. C conta, para cada nó, quantos pares dos seus vizinhos são adjacentes. A curva por baixo repete os dois cálculos para onze grafos gerados separadamente sempre que N, k ou a semente mudam. Mesmo com N = 200 e k = 10, são apenas alguns milhares de buscas sobre alguns milhares de arestas.",
          "Os dois canvas são desenhados uma vez por cada alteração e ao redimensionar. Os nós ficam sobre um círculo, e uma ligação é desenhada a cinzento se as suas pontas estiverem no máximo a k lugares de distância ao longo do anel, e a ciano caso contrário. Nada é animado, pelo que não há movimento para reduzir.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Porque é que bastam tão poucos atalhos",
        paragraphs: [
          "Um único atalho encurta o percurso de todos os nós próximos de qualquer uma das suas pontas, pelo que cada atalho novo ajuda muitos pares de uma vez. A aglomeração, pelo contrário, só desce para os poucos triângulos a que a ligação religada pertencia. Com os valores por omissão N = 80 e k = 4, o anel tem L₀ = 5,44 e C₀ = 9/14 ≈ 0,643. Com p = 0,1, o comprimento dos caminhos cai tipicamente para metade, cerca de 2,8, enquanto a aglomeração mantém aproximadamente três quartos do seu valor, perto de 0,47. Só com p = 1 a aglomeração colapsa, para menos de 0,1, enquanto L pouco mais melhora, até cerca de 2,3.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Verifica as fórmulas do reticulado",
        text: "Põe p em 0 com N = 80 e k = 4. O painel mostra L = 5,44 e C = 0,643, que é exatamente 9/14. Muda k e compara C com 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Três atalhos",
        text: "Carrega no botão 0,01. Com N · k = 320 ligações, isso religa cerca de três em média, e mesmo assim L costuma cair de 5,44 para um valor entre 3,5 e 4,5, enquanto C se mantém acima de 0,6. Carrega em «Generate» algumas vezes para veres quanto depende do sítio onde calham esses poucos atalhos.",
      },
      {
        title: "Um anel comprido e fino",
        text: "Põe N = 200 e k = 2, e compara p = 0 com p = 0,01. O anel começa com L ≈ 25,4, e os cerca de quatro atalhos que p = 0,01 cria reduzem-no tipicamente para mais ou menos metade, enquanto C mal desce de 0,5.",
      },
      {
        title: "Segue um caminho de um lado ao outro",
        text: "Com p = 0, N = 80 e k = 4, clica em dois nós em lados opostos do círculo: o caminho mais curto precisa de 10 saltos. Agora sobe p para 0,1 sem clicar em mais nada. O caminho é recalculado no novo grafo, usa tipicamente um ou dois atalhos ciano e normalmente precisa apenas de dois a cinco saltos.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Utforska Watts och Strogatz modell för småvärldsnätverk: koppla om ett ringnätverk med sannolikheten p och se väglängden rasa medan klustringen består.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Cirkeln av prickar är ett nätverk med N noder. Det börjar som en prydlig ring där varje nod är länkad till sina k närmaste grannar på vardera sidan, så vänners vänner är oftast också vänner. Sedan får varje länk chansen p att lossas i ena änden och fästas vid en slumpmässig nod. Grå linjer är de lokala länkar som överlevde, cyanfärgade linjer är de långväga genvägar som omkopplingen skapade. De två talen i sidhuvudet mäter hur långt ifrån varandra noderna ligger (L) och hur klickbenäget nätverket är (C).",
    sections: [
      {
        heading: "En liten värld i två tal",
        paragraphs: [
          "L är det genomsnittliga antalet hopp längs den kortaste vägen mellan två noder, taget över alla par. C, klustringskoefficienten, frågar för varje nod hur stor andel av dess grannar som också är länkade till varandra, och tar medelvärdet över alla noder. Ett ringgitter är starkt klustrat men har långa vägar: för att ta sig tvärs över måste man gå runt, k noder i taget. En helt slumpmässig graf har korta vägar men nästan ingen klustring.",
          "Duncan Watts och Steven Strogatz visade 1998 att man inte behöver välja. Koppla om bara några få procent av länkarna så sjunker L nästan till slumpvärdet, medan C knappt rör sig. Nätverk med båda egenskaperna, korta vägar och täta lokala klickar, kallas små världar, och de visade sig finnas överallt, från bekantskapsnätverk till elnät och nervcellernas kopplingar. För den icke omkopplade ringen finns enkla formler för båda talen.",
        ],
        formula: RING_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "N anger antalet noder, från 20 till 200 (standard 80). k anger antalet grannar på vardera sidan, från 2 till 10 (standard 4), så varje nod börjar med grad 2k. p är omkopplingssannolikheten, från 0 till 1 i steg om 0,01 (standard 0,1); knapparna under hoppar till 0; 0,01; 0,1 och 1. ”Generate (new seed)” drar en ny slumpgraf med samma inställningar.",
          "Klicka på en valfri nod och sedan på en till, så markerar en bredden-först-sökning en kortaste väg mellan dem i bärnstensfärg; ett tredje klick påbörjar ett nytt urval, och ”Clear path” tar bort det. Statistikpanelen visar L, C, båda i förhållande till den icke omkopplade ringen (L/L₀ och C/C₀), samt den största graden, som växer när omkopplingen lastar extra länkar på vissa noder.",
          "Det nedre diagrammet är den berömda Watts-Strogatz-bilden för ditt N och k. Det visar L/L₀ i cyan och C/C₀ i rosa för elva värden på p från 0 till 1 på en logaritmisk axel; den streckade bärnstensfärgade linjen markerar ditt nuvarande p.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Grafen är en array av mängder: adj[i] innehåller grannarna till nod i, vilket gör ”är de här två länkade?” till en fråga som besvaras i konstant tid. Byggaren skapar först ringgittret, går sedan igenom de k framåtlänkarna för varje nod och flyttar med sannolikheten p den bortre änden till en slumpmässig nod, och hoppar då över öglor och dubbla länkar (den ger upp efter 50 misslyckade försök). Slumptalen kommer från en liten generator med frö, mulberry32, så samma frö ger alltid samma graf och ”Generate” räknar helt enkelt upp fröet.",
          "L beräknas exakt genom en bredden-först-sökning från varje nod; par som inte kan nå varandra utelämnas. C räknar för varje nod hur många par av dess grannar som är grannar med varandra. Kurvan nedanför upprepar båda beräkningarna för elva separat genererade grafer varje gång N, k eller fröet ändras. Även vid N = 200 och k = 10 är det bara några tusen sökningar över några tusen kanter.",
          "Båda ritytorna ritas en gång per ändring och när storleken ändras. Noderna sitter på en cirkel, och en länk ritas grå om dess ändpunkter ligger högst k platser ifrån varandra längs ringen, annars cyan. Ingenting är animerat, så det finns ingen rörelse att minska.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Varför det räcker med så få genvägar",
        paragraphs: [
          "En enda genväg förkortar resan för varje nod i närheten av någon av dess ändar, så varje ny genväg hjälper många par på en gång. Klustringen sjunker däremot bara för de få trianglar som den omkopplade länken ingick i. Med förvalda N = 80 och k = 4 har ringen L₀ = 5,44 och C₀ = 9/14 ≈ 0,643. Vid p = 0,1 halveras väglängden vanligen till omkring 2,8 medan klustringen behåller ungefär tre fjärdedelar av sitt värde, nära 0,47. Först vid p = 1 rasar klustringen, till under 0,1, medan L knappt förbättras ytterligare, till omkring 2,3.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Kontrollera gitterformlerna",
        text: "Sätt p till 0 med N = 80 och k = 4. Panelen visar L = 5,44 och C = 0,643, vilket är exakt 9/14. Ändra k och jämför C med 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Tre genvägar",
        text: "Tryck på knappen 0,01. Med N · k = 320 länkar kopplas i genomsnitt ungefär tre av dem om, och ändå faller L oftast från 5,44 till någonstans mellan 3,5 och 4,5 medan C håller sig över 0,6. Tryck på ”Generate” några gånger för att se hur mycket som beror på var de få genvägarna hamnar.",
      },
      {
        title: "En lång, smal ring",
        text: "Ställ in N = 200 och k = 2 och jämför p = 0 med p = 0,01. Ringen börjar med L ≈ 25,4, och de ungefär fyra genvägar som p = 0,01 skapar brukar ungefär halvera det, medan C knappt sjunker från 0,5.",
      },
      {
        title: "Följ en väg tvärs över",
        text: "Med p = 0, N = 80 och k = 4 klickar du på två noder på motsatta sidor av cirkeln: den kortaste vägen kräver 10 hopp. Höj nu p till 0,1 utan att klicka på något annat. Vägen beräknas om på den nya grafen, använder vanligen en eller två cyanfärgade genvägar och behöver oftast bara två till fem hopp.",
      },
    ],
  },
  no: {
    metaDescription:
      "Utforsk Watts og Strogatz' modell for småverdensnettverk: Koble om et ringnettverk med sannsynlighet p, og se veilengden rase mens klyngingen holder seg.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Sirkelen av prikker er et nettverk med N noder. Det starter som en ryddig ring der hver node er koblet til sine k nærmeste naboer på hver side, så venners venner er som regel også venner. Deretter får hver kobling sjansen p til å bli løsnet i den ene enden og festet til en tilfeldig node. Grå linjer er de lokale koblingene som overlevde, cyanfargede linjer er de langtrekkende snarveiene som omkoblingen skapte. De to tallene i toppfeltet måler hvor langt fra hverandre nodene ligger (L), og hvor klikkete nettverket er (C).",
    sections: [
      {
        heading: "En liten verden i to tall",
        paragraphs: [
          "L er det gjennomsnittlige antallet hopp langs den korteste veien mellom to noder, tatt over alle par. C, klyngekoeffisienten, spør for hver node hvor stor andel av naboene som også er koblet til hverandre, og tar gjennomsnittet over alle noder. Et ringgitter er sterkt klynget, men har lange veier: For å krysse det må du gå rundt, k noder om gangen. En helt tilfeldig graf har korte veier, men nesten ingen klynging.",
          "Duncan Watts og Steven Strogatz viste i 1998 at man ikke trenger å velge. Koble om bare noen få prosent av koblingene, så faller L nesten til tilfeldighetsverdien, mens C knapt rører seg. Nettverk med begge egenskapene, korte veier og tette lokale klikker, kalles små verdener, og de viste seg å finnes overalt, fra bekjentskapsnettverk til strømnett og koblingene mellom nerveceller. For ringen uten omkobling finnes det enkle formler for begge tallene.",
        ],
        formula: RING_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "N setter antall noder, fra 20 til 200 (standard 80). k setter antall naboer på hver side, fra 2 til 10 (standard 4), så hver node starter med grad 2k. p er omkoblingssannsynligheten, fra 0 til 1 i steg på 0,01 (standard 0,1); knappene under hopper til 0; 0,01; 0,1 og 1. «Generate (new seed)» trekker en ny tilfeldig graf med de samme innstillingene.",
          "Klikk på en hvilken som helst node og deretter på en til, så markerer et bredde-først-søk en korteste vei mellom dem i ravgult; et tredje klikk starter et nytt utvalg, og «Clear path» fjerner det. Statistikkpanelet viser L, C, begge i forhold til ringen uten omkobling (L/L₀ og C/C₀), og den største graden, som vokser når omkoblingen lesser ekstra koblinger på enkelte noder.",
          "Det nederste diagrammet er det berømte Watts-Strogatz-bildet for din N og k. Det viser L/L₀ i cyan og C/C₀ i rosa for elleve verdier av p fra 0 til 1 på en logaritmisk akse; den stiplede ravgule linjen markerer din nåværende p.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Grafen er en array av mengder: adj[i] inneholder naboene til node i, noe som gjør «er disse to koblet?» til et spørsmål som besvares i konstant tid. Byggeren lager først ringgitteret, går deretter gjennom de k foroverkoblingene til hver node og flytter med sannsynlighet p den fjerne enden til en tilfeldig node, og hopper da over løkker og doble koblinger (den gir opp etter 50 mislykkede forsøk). Tilfeldige tall kommer fra en liten generator med frø, mulberry32, så samme frø gir alltid samme graf, og «Generate» øker ganske enkelt frøet med én.",
          "L beregnes eksakt ved å kjøre et bredde-først-søk fra hver node; par som ikke kan nå hverandre, utelates. C teller for hver node hvor mange par av naboene som er naboer med hverandre. Kurven under gjentar begge beregningene for elleve separat genererte grafer hver gang N, k eller frøet endres. Selv ved N = 200 og k = 10 er det bare noen tusen søk over noen tusen kanter.",
          "Begge lerretene tegnes én gang per endring og når størrelsen endres. Nodene sitter på en sirkel, og en kobling tegnes grå hvis endepunktene ligger høyst k plasser fra hverandre langs ringen, ellers cyan. Ingenting er animert, så det finnes ingen bevegelse å redusere.",
        ],
        code: REWIRE_EXCERPT,
      },
      {
        heading: "Hvorfor så få snarveier er nok",
        paragraphs: [
          "En enkelt snarvei forkorter turen for hver node i nærheten av en av endene, så hver ny snarvei hjelper mange par på en gang. Klyngingen faller derimot bare for de få trekantene som den omkoblede koblingen var en del av. Med standardverdiene N = 80 og k = 4 har ringen L₀ = 5,44 og C₀ = 9/14 ≈ 0,643. Ved p = 0,1 halveres veilengden typisk til omtrent 2,8, mens klyngingen beholder omtrent tre firedeler av verdien, nær 0,47. Først ved p = 1 raser klyngingen, til under 0,1, mens L knapt forbedres videre, til omtrent 2,3.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Sjekk gitterformlene",
        text: "Sett p til 0 med N = 80 og k = 4. Panelet viser L = 5,44 og C = 0,643, som er nøyaktig 9/14. Endre k og sammenlign C med 3(k − 1) / (2(2k − 1)).",
      },
      {
        title: "Tre snarveier",
        text: "Trykk på knappen 0,01. Med N · k = 320 koblinger blir i gjennomsnitt omtrent tre av dem koblet om, og likevel faller L som regel fra 5,44 til et sted mellom 3,5 og 4,5, mens C holder seg over 0,6. Trykk på «Generate» noen ganger for å se hvor mye som avhenger av hvor de få snarveiene havner.",
      },
      {
        title: "En lang, tynn ring",
        text: "Sett N = 200 og k = 2, og sammenlign p = 0 med p = 0,01. Ringen starter med L ≈ 25,4, og de omtrent fire snarveiene som p = 0,01 skaper, pleier å halvere det omtrent, mens C knapt faller fra 0,5.",
      },
      {
        title: "Følg en vei tvers over",
        text: "Med p = 0, N = 80 og k = 4 klikker du på to noder på motsatte sider av sirkelen: Den korteste veien trenger 10 hopp. Øk nå p til 0,1 uten å klikke på noe annet. Veien beregnes på nytt på den nye grafen, bruker typisk én eller to cyanfargede snarveier og trenger som regel bare to til fem hopp.",
      },
    ],
  },
};
