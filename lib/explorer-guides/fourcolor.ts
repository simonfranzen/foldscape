import type { ExplorerGuide } from "./types";

// Behaviour quoted here (Voronoi maps with Lloyd relaxation, MRV backtracking,
// region counts 5 to 80, 8 to 400 ms per step, neighbours need 3 shared pixel
// pairs, the preset region counts and
// the EN and DE control labels from RICH_EXPLORER) matches
// app/fourcolor/explorer/page.tsx and lib/fourcolor/map.ts; update them
// together.
const SOLVER_EXCERPT = `function recurse(): boolean {
  if (steps.length > STEP_CAP) return false;
  const i = pickNext();              // fewest colours left, ties: most neighbours
  if (i === -1) return true;         // every region coloured
  const used = new Set<number>();
  for (const j of adj[i]) {
    if (colours[j] !== -1) used.add(colours[j]);
  }
  for (let c = 0; c < 4; c++) {
    if (used.has(c)) continue;
    colours[i] = c;
    steps.push({ cell: i, colour: c });
    if (recurse()) return true;
    colours[i] = -1;                 // dead end: undo and try the next colour
    steps.push({ cell: i, colour: -1 });
    backtracks++;
  }
  return false;
}`;

export const FOURCOLOR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch the four colour theorem at work: generate random planar maps and see a backtracking solver colour every region with four colours, step by step.",
    heading: "How this explorer works",
    intro:
      "The canvas shows a map: a plane cut into regions that share borders, each labelled with a number. The explorer generates it, works out which regions touch, and then colours it with four colours so that no two neighbours ever share a colour. You can watch that colouring happen one decision at a time, including the moments when the solver changes its mind. The four colour theorem promises it will always succeed, however the map is drawn.",
    sections: [
      {
        heading: "Four colours are always enough",
        paragraphs: [
          "Francis Guthrie noticed in 1852 that four colours seemed to suffice for any map in which neighbouring countries must differ, as long as each country is one connected piece and touching at a single corner point does not count as sharing a border. Turning that observation into a theorem took more than a century. Alfred Kempe published a proof in 1879 that was found to be flawed in 1890, although the argument was still strong enough to prove that five colours always suffice.",
          "Kenneth Appel and Wolfgang Haken finally proved the four colour theorem in 1976, with a computer checking a large set of unavoidable configurations. A simpler computer proof followed in 1997, and in 2005 Georges Gonthier verified the whole argument in the Coq proof assistant.",
          "In graph language, every region becomes a vertex and every shared border an edge. The result is a planar graph, and the theorem says its chromatic number χ is at most 4. That is what the badge above the canvas means.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{for every planar graph } G",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The preset list chooses how many regions the map has and how evenly they are shaped. Random Voronoi starts with 30 or 60 cells. Three presets fix the count at 48, 16 and 54 regions, as many as there are contiguous US states, German states and UN member states in Africa. Only the numbers are borrowed: these are random maps with that many cells and extra smoothing, not real borders. Stress test places six regions in a tight ring, all meeting at one point in the centre, and six more around them, without smoothing, to create a crowded neighbourhood. Generate random moves to the next random seed and draws a new map; the seed in the top badge makes every map reproducible.",
          "Number of regions (5 to 80) sets the cell count directly; moving it on any other preset switches back to a random Voronoi map. The palette swatches can be clicked to pick your own colours.",
          "In the Auto-colourer panel, Step applies one decision, Run replays them all at the chosen speed (8 to 400 milliseconds per step, default 60), Auto jumps straight to the finished colouring, and Reset colouring returns every region to grey. The counters show how many regions are coloured, how many backtracks the solver needed, and the total number of steps.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The map is a Voronoi diagram: random seed points are placed in the canvas and every pixel belongs to its nearest seed. A few rounds of Lloyd relaxation, which move each seed to the centre of its own cell and recompute, make the regions rounder and more even. A final full-resolution pass assigns every pixel. Seeds come from a small deterministic random generator, so seed 1 always gives the same map at a given canvas size.",
          "Adjacency is read directly from the pixels: the code scans every horizontal and vertical pair of neighbouring pixels, and whenever their labels differ, that pair is counted for the two regions. Regions are neighbours once they share at least three such pairs, so cells that only meet at a corner are not linked.",
          "The colouring is a backtracking search with the most-constrained-variable heuristic. At each step it picks the uncoloured region with the fewest colours still allowed, breaking ties by the number of neighbours, and tries colours in a fixed order. The whole search runs once when the map is created and is recorded as a list of assign and undo steps; the animation simply replays that list. Nothing moves until you press Run, so the page behaves the same with reduced motion.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Why the solver rarely backtracks",
        paragraphs: [
          "Proving that four colours always work is hard; finding a colouring for one particular map usually is not. Euler's formula limits a planar graph with V vertices to at most 3V − 6 edges, so the average region has fewer than six neighbours and there is always some region with five or fewer. Combined with the habit of colouring the most constrained region first, dead ends are rare. On most random maps the backtrack counter stays at 0, and when it is not, it is typically a handful.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch a dead end",
        text: "Choose Random Voronoi (60 cells), press Generate random until the backtracks counter shows a non-zero value, then set the speed to 300 ms and press Run. Look for regions that receive a colour and later turn grey again: each of those is one undo step.",
      },
      {
        title: "Count the neighbours",
        text: "Push Number of regions to 80 and read the edges and max deg badges. The edge count always stays below three times the number of regions, as Euler's formula requires for any planar map.",
      },
      {
        title: "Corners do not count",
        text: "On the stress test, six regions meet at a single point in the middle. Press Auto and look at their colours: with only four colours for six regions, at least two of them must match, and those two are never side by side. Meeting at a corner is not a border, which is exactly the exception in Guthrie's rule.",
      },
      {
        title: "Step by hand",
        text: "Pick the preset with 16 regions and click Step repeatedly. Before each click, guess which region the solver will choose next: it will be one with the fewest options left, often the one with the most already coloured neighbours.",
      },
    ],
  },
  de: {
    metaDescription:
      "Den Vierfarbensatz in Aktion sehen: zufällige ebene Landkarten erzeugen und zuschauen, wie ein Backtracking-Löser jede Region mit vier Farben einfärbt.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Das Canvas zeigt eine Landkarte: eine Ebene, die in Regionen mit gemeinsamen Grenzen zerlegt ist, jede mit einer Nummer. Der Explorer erzeugt die Karte, ermittelt, welche Regionen sich berühren, und färbt sie dann mit vier Farben so, dass zwei Nachbarn nie dieselbe Farbe haben. Du kannst dabei Entscheidung für Entscheidung zusehen, auch in den Momenten, in denen der Löser umdenkt. Der Vierfarbensatz garantiert, dass das immer gelingt, egal wie die Karte gezeichnet ist.",
    sections: [
      {
        heading: "Vier Farben reichen immer",
        paragraphs: [
          "Francis Guthrie fiel 1852 auf, dass vier Farben für jede Landkarte zu genügen scheinen, auf der benachbarte Länder verschieden gefärbt sein müssen, solange jedes Land ein zusammenhängendes Stück ist und eine Berührung in nur einem Eckpunkt nicht als gemeinsame Grenze zählt. Aus dieser Beobachtung einen Satz zu machen, dauerte mehr als ein Jahrhundert. Alfred Kempe veröffentlichte 1879 einen Beweis, der sich 1890 als fehlerhaft herausstellte. Sein Argument reichte aber immerhin für den Beweis, dass fünf Farben immer genügen.",
          "Kenneth Appel und Wolfgang Haken bewiesen den Vierfarbensatz schließlich 1976, wobei ein Computer eine große Menge unvermeidbarer Konfigurationen prüfte. 1997 folgte ein einfacherer Computerbeweis, und 2005 verifizierte Georges Gonthier das gesamte Argument im Beweisassistenten Coq.",
          "In der Sprache der Graphentheorie wird jede Region zu einem Knoten und jede gemeinsame Grenze zu einer Kante. Das Ergebnis ist ein planarer Graph, und der Satz besagt, dass seine chromatische Zahl χ höchstens 4 ist. Genau das bedeutet das Abzeichen über dem Canvas.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{für jeden planaren Graphen } G",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die Liste der Voreinstellungen bestimmt, wie viele Regionen die Karte hat und wie gleichmäßig sie geformt sind. «Zufälliges Voronoi» startet mit 30 oder 60 Zellen. Drei Voreinstellungen legen die Zahl auf 48, 16 und 54 Regionen fest, so viele, wie es US-Staaten ohne Alaska und Hawaii, deutsche Bundesländer und UN-Mitgliedstaaten in Afrika gibt. Übernommen sind nur die Zahlen: Es sind Zufallskarten mit so vielen Zellen und zusätzlicher Glättung, keine echten Grenzen. Der Stresstest setzt sechs Regionen in einen engen Ring, die sich alle in einem Punkt in der Mitte treffen, und sechs weitere darum herum, ohne Glättung, damit eine dicht gedrängte Nachbarschaft entsteht. «Neue Zufallskarte» springt zum nächsten Zufalls-Seed und zeichnet eine neue Karte. Der Seed im oberen Abzeichen macht jede Karte reproduzierbar.",
          "«Anzahl Regionen» (5 bis 80) legt die Zahl der Zellen direkt fest. Bewegst du den Regler bei einer anderen Voreinstellung, wechselt die Karte zurück zu «Zufälliges Voronoi». Die Farbfelder lassen sich anklicken, um eigene Farben zu wählen.",
          "Im Bereich «Auto-Färber» wendet «Schritt» eine einzelne Entscheidung an, «Start» spielt alle im gewählten Tempo ab (8 bis 400 Millisekunden pro Schritt, Standard 60), «Auto» springt direkt zur fertigen Färbung, und «Färbung zurücksetzen» macht alle Regionen wieder grau. Die Zähler zeigen, wie viele Regionen gefärbt sind, wie oft der Löser zurückgehen musste und wie viele Schritte es insgesamt sind.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Karte ist ein Voronoi-Diagramm: Zufällige Startpunkte werden auf dem Canvas verteilt, und jedes Pixel gehört zum nächstgelegenen Punkt. Einige Runden Lloyd-Relaxation, bei denen jeder Punkt in die Mitte seiner eigenen Zelle wandert und alles neu berechnet wird, machen die Regionen runder und gleichmäßiger. Ein letzter Durchgang in voller Auflösung ordnet dann jedes Pixel zu. Die Startpunkte stammen aus einem kleinen deterministischen Zufallsgenerator, Seed 1 ergibt bei gleicher Canvasgröße also immer dieselbe Karte.",
          "Die Nachbarschaften werden direkt aus den Pixeln abgelesen: Der Code durchläuft jedes waagrechte und senkrechte Paar benachbarter Pixel, und wo sich ihre Zuordnung unterscheidet, wird das Paar für die beiden Regionen gezählt. Nachbarn sind zwei Regionen ab drei solchen Paaren, Zellen, die sich nur in einer Ecke treffen, werden also nicht verbunden.",
          "Die Färbung ist eine Backtracking-Suche mit der Heuristik der am stärksten eingeschränkten Variable. In jedem Schritt wählt sie die ungefärbte Region mit den wenigsten noch erlaubten Farben, bei Gleichstand die mit den meisten Nachbarn, und probiert die Farben in fester Reihenfolge. Die ganze Suche läuft einmal beim Erzeugen der Karte und wird als Liste von Zuweisungs- und Rücknahmeschritten gespeichert, die Animation spielt diese Liste nur ab. Bevor du «Start» drückst, bewegt sich nichts, die Seite verhält sich mit reduzierter Bewegung also genauso.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Warum der Löser selten zurückgeht",
        paragraphs: [
          "Zu beweisen, dass vier Farben immer reichen, ist schwer. Eine Färbung für eine bestimmte Karte zu finden, ist es meistens nicht. Die Eulersche Polyederformel begrenzt einen planaren Graphen mit V Knoten auf höchstens 3V − 6 Kanten. Im Schnitt hat eine Region also weniger als sechs Nachbarn, und es gibt immer eine Region mit fünf oder weniger. Zusammen mit der Gewohnheit, die am stärksten eingeschränkte Region zuerst zu färben, sind Sackgassen selten. Auf den meisten Zufallskarten bleibt der Zähler «Rücknahmen» bei 0, und wenn nicht, sind es meist nur eine Handvoll.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Eine Sackgasse beobachten",
        text: "Wähle «Zufälliges Voronoi (60 Zellen)» und drück «Neue Zufallskarte», bis der Zähler «Rücknahmen» einen Wert über null zeigt. Stell dann das Tempo auf 300 ms und drück «Start». Achte auf Regionen, die eine Farbe bekommen und später wieder grau werden: Jede davon ist ein Rücknahmeschritt.",
      },
      {
        title: "Die Nachbarn zählen",
        text: "Schieb die Zahl der Regionen auf 80 und lies die Abzeichen «Kanten» und «max. Grad». Die Kantenzahl bleibt immer unter dem Dreifachen der Regionenzahl, so wie es die Eulersche Formel für jede ebene Karte verlangt.",
      },
      {
        title: "Ecken zählen nicht",
        text: "Beim Stresstest treffen sich sechs Regionen in einem einzigen Punkt in der Mitte. Drück «Auto» und schau auf ihre Farben: Bei nur vier Farben für sechs Regionen müssen mindestens zwei gleich sein, und diese beiden liegen nie nebeneinander. Eine Berührung in einer Ecke ist keine Grenze, das ist genau die Ausnahme in Guthries Regel.",
      },
      {
        title: "Schritt für Schritt von Hand",
        text: "Nimm die Voreinstellung mit 16 Regionen und klick wiederholt auf «Schritt». Rate vor jedem Klick, welche Region der Löser als Nächstes wählt: Es ist eine mit den wenigsten verbleibenden Möglichkeiten, oft die mit den meisten schon gefärbten Nachbarn.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mira el teorema de los cuatro colores en acción: genera mapas planos aleatorios y observa cómo un algoritmo de retroceso colorea cada región paso a paso.",
    heading: "Cómo funciona este explorador",
    intro:
      "El lienzo muestra un mapa: un plano cortado en regiones que comparten fronteras, cada una etiquetada con un número. El explorador lo genera, averigua qué regiones se tocan y después lo colorea con cuatro colores de modo que dos vecinas nunca compartan color. Puedes ver cómo ocurre ese coloreado decisión a decisión, incluidos los momentos en que el algoritmo cambia de idea. El teorema de los cuatro colores promete que siempre lo conseguirá, se dibuje el mapa como se dibuje.",
    sections: [
      {
        heading: "Cuatro colores siempre bastan",
        paragraphs: [
          "Francis Guthrie se dio cuenta en 1852 de que cuatro colores parecían bastar para cualquier mapa en el que los países vecinos deban ser distintos, siempre que cada país sea una sola pieza conexa y que tocarse en un único punto de esquina no cuente como compartir frontera. Convertir esa observación en un teorema llevó más de un siglo. Alfred Kempe publicó en 1879 una demostración en la que se encontró un fallo en 1890, aunque el argumento seguía siendo lo bastante fuerte como para demostrar que cinco colores siempre bastan.",
          "Kenneth Appel y Wolfgang Haken demostraron por fin el teorema de los cuatro colores en 1976, con un ordenador que comprobó un gran conjunto de configuraciones inevitables. En 1997 llegó una demostración por ordenador más sencilla, y en 2005 Georges Gonthier verificó todo el argumento en el asistente de demostración Coq.",
          "En el lenguaje de los grafos, cada región se convierte en un vértice y cada frontera compartida en una arista. El resultado es un grafo plano, y el teorema dice que su número cromático χ es como mucho 4. Eso es lo que significa el rótulo que hay sobre el lienzo.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{para todo grafo plano } G",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "La lista de mapas predefinidos elige cuántas regiones tiene el mapa y lo uniforme que es su forma. «Random Voronoi» empieza con 30 o 60 celdas. Tres opciones fijan el número en 48, 16 y 54 regiones, tantas como estados contiguos de Estados Unidos, estados federados alemanes y estados miembros de la ONU en África. Solo se toman prestadas las cifras: son mapas aleatorios con ese número de celdas y un suavizado adicional, no fronteras reales. «Stress test» coloca seis regiones en un anillo apretado, todas reunidas en un punto del centro, y seis más a su alrededor, sin suavizado, para crear un vecindario abarrotado. «Generate random» pasa a la siguiente semilla aleatoria y dibuja un mapa nuevo; la semilla del rótulo superior hace que cada mapa sea reproducible.",
          "«Number of regions» (de 5 a 80) fija directamente el número de celdas; moverlo con cualquier otra opción seleccionada vuelve a un mapa de Voronoi aleatorio. Puedes pulsar las muestras de la paleta para elegir tus propios colores.",
          "En el panel «Auto-colourer», «Step» aplica una decisión, «Run» las reproduce todas a la velocidad elegida (de 8 a 400 milisegundos por paso, por defecto 60), «Auto» salta directamente al coloreado terminado y «Reset colouring» devuelve todas las regiones al gris. Los contadores muestran cuántas regiones están coloreadas, cuántos retrocesos necesitó el algoritmo y el número total de pasos.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "El mapa es un diagrama de Voronoi: se colocan puntos semilla al azar en el lienzo y cada píxel pertenece a la semilla más cercana. Unas cuantas rondas de relajación de Lloyd, que mueven cada semilla al centro de su propia celda y recalculan, hacen que las regiones sean más redondas y uniformes. Una pasada final a resolución completa asigna cada píxel. Las semillas salen de un pequeño generador aleatorio determinista, así que la semilla 1 da siempre el mismo mapa para un tamaño de lienzo dado.",
          "La adyacencia se lee directamente de los píxeles: el código recorre cada par horizontal y vertical de píxeles vecinos y, cuando sus etiquetas difieren, ese par se anota para las dos regiones. Dos regiones son vecinas cuando comparten al menos tres de esos pares, de modo que las celdas que solo se tocan en una esquina no quedan enlazadas.",
          "El coloreado es una búsqueda con retroceso (backtracking) con la heurística de la variable más restringida. En cada paso elige la región sin colorear a la que le quedan menos colores permitidos, desempata por el número de vecinas y prueba los colores en un orden fijo. Toda la búsqueda se ejecuta una sola vez al crear el mapa y se graba como una lista de pasos de asignar y deshacer; la animación se limita a reproducir esa lista. Nada se mueve hasta que pulsas «Run», así que la página se comporta igual con movimiento reducido.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Por qué el algoritmo casi nunca retrocede",
        paragraphs: [
          "Demostrar que cuatro colores funcionan siempre es difícil; encontrar un coloreado para un mapa concreto no suele serlo. La fórmula de Euler limita un grafo plano con V vértices a un máximo de 3V − 6 aristas, así que la región media tiene menos de seis vecinas y siempre hay alguna región con cinco o menos. Unido a la costumbre de colorear primero la región más restringida, los callejones sin salida son raros. En la mayoría de los mapas aleatorios el contador de retrocesos se queda en 0, y cuando no, suele ser un puñado.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Observa un callejón sin salida",
        text: "Elige «Random Voronoi (60 cells)», pulsa «Generate random» hasta que el contador «backtracks» muestre un valor distinto de cero, luego pon la velocidad en 300 ms y pulsa «Run». Busca regiones que reciben un color y más tarde vuelven al gris: cada una de ellas es un paso de deshacer.",
      },
      {
        title: "Cuenta las vecinas",
        text: "Sube «Number of regions» a 80 y lee los rótulos «edges» y «max deg». El número de aristas se queda siempre por debajo del triple del número de regiones, como exige la fórmula de Euler para cualquier mapa plano.",
      },
      {
        title: "Las esquinas no cuentan",
        text: "En el «Stress test», seis regiones se juntan en un único punto del centro. Pulsa «Auto» y mira sus colores: con solo cuatro colores para seis regiones, al menos dos tienen que coincidir, y esas dos nunca están una al lado de la otra. Tocarse en una esquina no es una frontera, que es justo la excepción de la regla de Guthrie.",
      },
      {
        title: "Avanza a mano",
        text: "Elige la opción con 16 regiones y pulsa «Step» varias veces. Antes de cada pulsación, adivina qué región elegirá el algoritmo a continuación: será una de las que tienen menos opciones, a menudo la que tiene más vecinas ya coloreadas.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Le théorème des quatre couleurs à l'œuvre : génère des cartes planaires aléatoires et regarde un solveur à retour arrière colorier chaque région pas à pas.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le canevas montre une carte : un plan découpé en régions qui partagent des frontières, chacune portant un numéro. L'explorateur la génère, détermine quelles régions se touchent, puis la colorie avec quatre couleurs de sorte que deux voisines n'aient jamais la même. Tu peux regarder ce coloriage se faire une décision à la fois, y compris les moments où le solveur change d'avis. Le théorème des quatre couleurs promet qu'il réussira toujours, quelle que soit la façon dont la carte est dessinée.",
    sections: [
      {
        heading: "Quatre couleurs suffisent toujours",
        paragraphs: [
          "Francis Guthrie a remarqué en 1852 que quatre couleurs semblaient suffire pour toute carte où les pays voisins doivent différer, à condition que chaque pays soit d'un seul tenant et que se toucher en un seul point d'angle ne compte pas comme partager une frontière. Faire de cette observation un théorème a pris plus d'un siècle. Alfred Kempe a publié en 1879 une démonstration dont on a découvert la faille en 1890, même si l'argument restait assez solide pour prouver que cinq couleurs suffisent toujours.",
          "Kenneth Appel et Wolfgang Haken ont finalement démontré le théorème des quatre couleurs en 1976, un ordinateur vérifiant un vaste ensemble de configurations inévitables. Une démonstration par ordinateur plus simple a suivi en 1997, et en 2005 Georges Gonthier a vérifié l'ensemble de l'argument dans l'assistant de preuve Coq.",
          "Dans le langage des graphes, chaque région devient un sommet et chaque frontière commune une arête. On obtient un graphe planaire, et le théorème dit que son nombre chromatique χ vaut au plus 4. C'est ce que signifie le badge au-dessus du canevas.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{pour tout graphe planaire } G",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "La liste des cartes prédéfinies choisit le nombre de régions de la carte et la régularité de leur forme. « Random Voronoi » démarre avec 30 ou 60 cellules. Trois préréglages fixent le nombre à 48, 16 et 54 régions, autant qu'il y a d'États contigus aux États-Unis, de Länder allemands et d'États membres de l'ONU en Afrique. Seuls les nombres sont empruntés : ce sont des cartes aléatoires avec ce nombre de cellules et un lissage supplémentaire, pas de vraies frontières. « Stress test » place six régions en anneau serré, qui se rejoignent toutes en un point au centre, et six autres autour d'elles, sans lissage, pour créer un voisinage encombré. « Generate random » passe à la graine aléatoire suivante et dessine une nouvelle carte ; la graine affichée dans le badge du haut rend chaque carte reproductible.",
          "« Number of regions » (de 5 à 80) fixe directement le nombre de cellules ; le déplacer alors qu'un autre préréglage est choisi fait revenir à une carte de Voronoï aléatoire. Tu peux cliquer sur les pastilles de la palette pour choisir tes propres couleurs.",
          "Dans le panneau « Auto-colourer », « Step » applique une décision, « Run » les rejoue toutes à la vitesse choisie (de 8 à 400 millisecondes par étape, 60 par défaut), « Auto » saute directement au coloriage terminé, et « Reset colouring » remet toutes les régions en gris. Les compteurs indiquent combien de régions sont coloriées, combien de retours arrière le solveur a dû faire, et le nombre total d'étapes.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La carte est un diagramme de Voronoï : des points germes sont placés au hasard dans le canevas et chaque pixel appartient au germe le plus proche. Quelques tours de relaxation de Lloyd, qui déplacent chaque germe au centre de sa propre cellule puis recalculent, rendent les régions plus rondes et plus régulières. Une dernière passe en pleine résolution attribue chaque pixel. Les germes viennent d'un petit générateur aléatoire déterministe, si bien que la graine 1 donne toujours la même carte pour une taille de canevas donnée.",
          "L'adjacence se lit directement sur les pixels : le code parcourt chaque paire horizontale et verticale de pixels voisins et, dès que leurs étiquettes diffèrent, cette paire est comptée pour les deux régions. Deux régions sont voisines dès qu'elles partagent au moins trois paires de ce type, de sorte que les cellules qui ne se touchent que par un coin ne sont pas reliées.",
          "Le coloriage est une recherche avec retour arrière (backtracking) utilisant l'heuristique de la variable la plus contrainte. À chaque étape, elle choisit la région non coloriée à laquelle il reste le moins de couleurs autorisées, départage les égalités par le nombre de voisines, et essaie les couleurs dans un ordre fixe. Toute la recherche s'exécute une seule fois à la création de la carte et est enregistrée sous forme de liste d'étapes d'affectation et d'annulation ; l'animation ne fait que rejouer cette liste. Rien ne bouge tant que tu n'appuies pas sur « Run », donc la page se comporte de la même façon avec la réduction des animations.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Pourquoi le solveur revient rarement en arrière",
        paragraphs: [
          "Démontrer que quatre couleurs marchent toujours est difficile ; trouver un coloriage pour une carte donnée ne l'est généralement pas. La formule d'Euler limite un graphe planaire à V sommets à 3V − 6 arêtes au plus, donc la région moyenne a moins de six voisines et il existe toujours une région qui en a cinq ou moins. Ajoute à cela l'habitude de colorier d'abord la région la plus contrainte, et les impasses deviennent rares. Sur la plupart des cartes aléatoires, le compteur de retours arrière reste à 0, et quand ce n'est pas le cas, il s'agit en général d'une poignée.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Observe une impasse",
        text: "Choisis « Random Voronoi (60 cells) », appuie sur « Generate random » jusqu'à ce que le compteur « backtracks » affiche une valeur non nulle, puis règle la vitesse sur 300 ms et appuie sur « Run ». Repère les régions qui reçoivent une couleur puis redeviennent grises : chacune correspond à une étape d'annulation.",
      },
      {
        title: "Compte les voisines",
        text: "Pousse « Number of regions » à 80 et lis les badges « edges » et « max deg ». Le nombre d'arêtes reste toujours inférieur à trois fois le nombre de régions, comme l'exige la formule d'Euler pour toute carte planaire.",
      },
      {
        title: "Les coins ne comptent pas",
        text: "Dans le « Stress test », six régions se rejoignent en un seul point au milieu. Appuie sur « Auto » et regarde leurs couleurs : avec seulement quatre couleurs pour six régions, au moins deux d'entre elles doivent avoir la même, et ces deux-là ne sont jamais côte à côte. Se toucher par un coin n'est pas une frontière, et c'est exactement l'exception prévue par la règle de Guthrie.",
      },
      {
        title: "Avance à la main",
        text: "Prends le préréglage à 16 régions et clique plusieurs fois sur « Step ». Avant chaque clic, devine quelle région le solveur va choisir ensuite : ce sera l'une de celles qui ont le moins d'options, souvent celle qui a le plus de voisines déjà coloriées.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarda il teorema dei quattro colori all'opera: genera mappe planari casuali e osserva un solver con backtracking colorare ogni regione passo dopo passo.",
    heading: "Come funziona questo esploratore",
    intro:
      "Il canvas mostra una mappa: un piano tagliato in regioni che condividono confini, ciascuna contrassegnata da un numero. L'esploratore la genera, stabilisce quali regioni si toccano e poi la colora con quattro colori in modo che due regioni vicine non abbiano mai lo stesso colore. Puoi guardare la colorazione avvenire una decisione alla volta, compresi i momenti in cui il solver cambia idea. Il teorema dei quattro colori promette che ci riuscirà sempre, comunque sia disegnata la mappa.",
    sections: [
      {
        heading: "Quattro colori bastano sempre",
        paragraphs: [
          "Francis Guthrie notò nel 1852 che quattro colori sembravano bastare per qualsiasi mappa in cui i paesi confinanti devono essere diversi, purché ogni paese sia un unico pezzo connesso e toccarsi in un solo punto d'angolo non conti come condividere un confine. Trasformare quell'osservazione in un teorema richiese più di un secolo. Alfred Kempe pubblicò nel 1879 una dimostrazione che nel 1890 si rivelò difettosa, anche se l'argomento era ancora abbastanza forte da dimostrare che cinque colori bastano sempre.",
          "Kenneth Appel e Wolfgang Haken dimostrarono finalmente il teorema dei quattro colori nel 1976, con un computer che verificava un ampio insieme di configurazioni inevitabili. Una dimostrazione al computer più semplice arrivò nel 1997, e nel 2005 Georges Gonthier verificò l'intero argomento nell'assistente alla dimostrazione Coq.",
          "Nel linguaggio dei grafi, ogni regione diventa un vertice e ogni confine condiviso uno spigolo. Il risultato è un grafo planare, e il teorema dice che il suo numero cromatico χ è al massimo 4. È questo il significato dell'etichetta sopra il canvas.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{per ogni grafo planare } G",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "L'elenco dei preset sceglie quante regioni ha la mappa e quanto è regolare la loro forma. «Random Voronoi» parte con 30 o 60 celle. Tre preset fissano il numero a 48, 16 e 54 regioni, tante quanti sono gli stati contigui degli Stati Uniti, gli stati federati tedeschi e gli stati membri dell'ONU in Africa. Si prendono in prestito solo i numeri: sono mappe casuali con quel numero di celle e una levigatura aggiuntiva, non confini reali. «Stress test» dispone sei regioni in un anello stretto, che si incontrano tutte in un punto al centro, e altre sei attorno, senza levigatura, per creare un vicinato affollato. «Generate random» passa al seme casuale successivo e disegna una nuova mappa; il seme nell'etichetta in alto rende ogni mappa riproducibile.",
          "«Number of regions» (da 5 a 80) imposta direttamente il numero di celle; spostarlo con qualsiasi altro preset selezionato riporta a una mappa di Voronoi casuale. Puoi cliccare sui campioni della tavolozza per scegliere i tuoi colori.",
          "Nel pannello «Auto-colourer», «Step» applica una decisione, «Run» le riproduce tutte alla velocità scelta (da 8 a 400 millisecondi per passo, predefinito 60), «Auto» salta direttamente alla colorazione finita e «Reset colouring» riporta ogni regione al grigio. I contatori mostrano quante regioni sono colorate, quanti passi indietro ha dovuto fare il solver e il numero totale di passi.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La mappa è un diagramma di Voronoi: dei punti seme vengono piazzati a caso nel canvas e ogni pixel appartiene al seme più vicino. Alcuni cicli di rilassamento di Lloyd, che spostano ogni seme al centro della propria cella e ricalcolano, rendono le regioni più tonde e uniformi. Un passaggio finale a piena risoluzione assegna ogni pixel. I semi provengono da un piccolo generatore casuale deterministico, quindi il seme 1 dà sempre la stessa mappa per una data dimensione del canvas.",
          "L'adiacenza viene letta direttamente dai pixel: il codice scorre ogni coppia orizzontale e verticale di pixel vicini e, ogni volta che le loro etichette differiscono, quella coppia viene contata per le due regioni. Due regioni sono vicine quando condividono almeno tre di queste coppie, quindi le celle che si toccano solo in un angolo non vengono collegate.",
          "La colorazione è una ricerca con backtracking che usa l'euristica della variabile più vincolata. A ogni passo sceglie la regione non colorata con il minor numero di colori ancora ammessi, risolve i pareggi in base al numero di vicine e prova i colori in un ordine fisso. L'intera ricerca viene eseguita una sola volta alla creazione della mappa ed è registrata come un elenco di passi di assegnazione e di annullamento; l'animazione si limita a riprodurre quell'elenco. Nulla si muove finché non premi «Run», quindi la pagina si comporta allo stesso modo con il movimento ridotto.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Perché il solver torna indietro di rado",
        paragraphs: [
          "Dimostrare che quattro colori funzionano sempre è difficile; trovare una colorazione per una mappa in particolare di solito non lo è. La formula di Eulero limita un grafo planare con V vertici a un massimo di 3V − 6 spigoli, quindi la regione media ha meno di sei vicine e ce n'è sempre qualcuna con cinque o meno. Insieme all'abitudine di colorare per prima la regione più vincolata, questo rende rari i vicoli ciechi. Nella maggior parte delle mappe casuali il contatore dei passi indietro resta a 0, e quando non è così si tratta in genere di una manciata.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Osserva un vicolo cieco",
        text: "Scegli «Random Voronoi (60 cells)», premi «Generate random» finché il contatore «backtracks» non mostra un valore diverso da zero, poi imposta la velocità a 300 ms e premi «Run». Cerca le regioni che ricevono un colore e più tardi tornano grigie: ognuna di esse è un passo di annullamento.",
      },
      {
        title: "Conta le vicine",
        text: "Porta «Number of regions» a 80 e leggi le etichette «edges» e «max deg». Il numero di spigoli resta sempre sotto il triplo del numero di regioni, come la formula di Eulero richiede per qualsiasi mappa planare.",
      },
      {
        title: "Gli angoli non contano",
        text: "Nello «Stress test» sei regioni si incontrano in un unico punto al centro. Premi «Auto» e guarda i loro colori: con soli quattro colori per sei regioni, almeno due devono coincidere, e quelle due non sono mai fianco a fianco. Incontrarsi in un angolo non è un confine, ed è esattamente l'eccezione prevista dalla regola di Guthrie.",
      },
      {
        title: "Procedi a mano",
        text: "Scegli il preset con 16 regioni e clicca più volte su «Step». Prima di ogni clic, prova a indovinare quale regione sceglierà il solver: sarà una di quelle con meno opzioni rimaste, spesso quella con più vicine già colorate.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Vê o teorema das quatro cores em ação: gera mapas planares aleatórios e observa um algoritmo de retrocesso a colorir cada região com 4 cores, passo a passo.",
    heading: "Como funciona este explorador",
    intro:
      "O canvas mostra um mapa: um plano cortado em regiões que partilham fronteiras, cada uma identificada por um número. O explorador gera-o, descobre que regiões se tocam e depois colore-o com quatro cores, de modo que duas vizinhas nunca tenham a mesma cor. Podes ver essa coloração acontecer uma decisão de cada vez, incluindo os momentos em que o algoritmo muda de ideias. O teorema das quatro cores garante que vai sempre conseguir, seja qual for o desenho do mapa.",
    sections: [
      {
        heading: "Quatro cores chegam sempre",
        paragraphs: [
          "Francis Guthrie reparou em 1852 que quatro cores pareciam chegar para qualquer mapa em que países vizinhos têm de ser diferentes, desde que cada país seja uma única peça conexa e que tocar-se num só ponto de canto não conte como partilhar uma fronteira. Transformar essa observação num teorema levou mais de um século. Alfred Kempe publicou em 1879 uma demonstração em que se descobriu uma falha em 1890, embora o argumento continuasse suficientemente forte para provar que cinco cores chegam sempre.",
          "Kenneth Appel e Wolfgang Haken demonstraram finalmente o teorema das quatro cores em 1976, com um computador a verificar um grande conjunto de configurações inevitáveis. Uma demonstração por computador mais simples surgiu em 1997, e em 2005 Georges Gonthier verificou todo o argumento no assistente de demonstração Coq.",
          "Na linguagem dos grafos, cada região passa a ser um vértice e cada fronteira partilhada uma aresta. O resultado é um grafo planar, e o teorema diz que o seu número cromático χ é no máximo 4. É isso que significa o emblema por cima do canvas.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{para todo o grafo planar } G",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "A lista de mapas predefinidos escolhe quantas regiões o mapa tem e quão regular é a sua forma. «Random Voronoi» começa com 30 ou 60 células. Três predefinições fixam o número em 48, 16 e 54 regiões, tantas quantos os estados contíguos dos Estados Unidos, os estados federados alemães e os estados-membros da ONU em África. Só os números são emprestados: são mapas aleatórios com esse número de células e uma suavização adicional, não fronteiras reais. «Stress test» coloca seis regiões num anel apertado, todas a encontrarem-se num ponto no centro, e mais seis à volta delas, sem suavização, para criar uma vizinhança apinhada. «Generate random» avança para a semente aleatória seguinte e desenha um mapa novo; a semente no emblema de cima torna cada mapa reproduzível.",
          "«Number of regions» (de 5 a 80) define diretamente o número de células; mexer-lhe com qualquer outra predefinição escolhida volta a um mapa de Voronoi aleatório. Podes clicar nas amostras da paleta para escolheres as tuas próprias cores.",
          "No painel «Auto-colourer», «Step» aplica uma decisão, «Run» reproduz todas à velocidade escolhida (de 8 a 400 milissegundos por passo, 60 por omissão), «Auto» salta diretamente para a coloração terminada e «Reset colouring» devolve todas as regiões ao cinzento. Os contadores mostram quantas regiões estão coloridas, quantos retrocessos o algoritmo precisou de fazer e o número total de passos.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O mapa é um diagrama de Voronoi: pontos-semente aleatórios são colocados no canvas e cada píxel pertence à semente mais próxima. Algumas rondas de relaxação de Lloyd, que movem cada semente para o centro da sua própria célula e recalculam, tornam as regiões mais redondas e regulares. Uma passagem final em resolução total atribui cada píxel. As sementes vêm de um pequeno gerador aleatório determinístico, pelo que a semente 1 dá sempre o mesmo mapa para um dado tamanho do canvas.",
          "A adjacência é lida diretamente dos píxeis: o código percorre cada par horizontal e vertical de píxeis vizinhos e, sempre que as etiquetas diferem, esse par é contado para as duas regiões. Duas regiões são vizinhas quando partilham pelo menos três pares destes, por isso as células que só se tocam num canto não ficam ligadas.",
          "A coloração é uma busca com retrocesso (backtracking) com a heurística da variável mais restringida. Em cada passo escolhe a região por colorir com menos cores ainda permitidas, desempata pelo número de vizinhas e experimenta as cores por uma ordem fixa. Toda a busca corre uma única vez quando o mapa é criado e fica gravada como uma lista de passos de atribuir e desfazer; a animação limita-se a reproduzir essa lista. Nada se mexe até carregares em «Run», pelo que a página se comporta da mesma maneira com movimento reduzido.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Porque é que o algoritmo raramente recua",
        paragraphs: [
          "Demonstrar que quatro cores funcionam sempre é difícil; encontrar uma coloração para um mapa em particular normalmente não é. A fórmula de Euler limita um grafo planar com V vértices a um máximo de 3V − 6 arestas, pelo que a região média tem menos de seis vizinhas e há sempre alguma região com cinco ou menos. Junta-se a isto o hábito de colorir primeiro a região mais restringida, e os becos sem saída tornam-se raros. Na maioria dos mapas aleatórios o contador de retrocessos fica em 0, e quando não fica, costuma ser uma mão-cheia.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Observa um beco sem saída",
        text: "Escolhe «Random Voronoi (60 cells)», carrega em «Generate random» até o contador «backtracks» mostrar um valor diferente de zero, depois põe a velocidade em 300 ms e carrega em «Run». Procura regiões que recebem uma cor e mais tarde voltam a cinzento: cada uma delas é um passo de desfazer.",
      },
      {
        title: "Conta as vizinhas",
        text: "Leva «Number of regions» até 80 e lê os emblemas «edges» e «max deg». O número de arestas fica sempre abaixo do triplo do número de regiões, como a fórmula de Euler exige para qualquer mapa planar.",
      },
      {
        title: "Os cantos não contam",
        text: "No «Stress test», seis regiões encontram-se num único ponto no meio. Carrega em «Auto» e olha para as cores delas: com apenas quatro cores para seis regiões, pelo menos duas têm de coincidir, e essas duas nunca estão lado a lado. Encontrar-se num canto não é uma fronteira, que é precisamente a exceção da regra de Guthrie.",
      },
      {
        title: "Avança à mão",
        text: "Escolhe a predefinição com 16 regiões e clica em «Step» repetidamente. Antes de cada clique, adivinha que região o algoritmo vai escolher a seguir: será uma das que têm menos opções, muitas vezes a que tem mais vizinhas já coloridas.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Se fyrfärgssatsen i arbete: skapa slumpmässiga plana kartor och följ hur en lösare med backtracking färgar varje region med fyra färger, steg för steg.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Ytan visar en karta: ett plan uppskuret i regioner som delar gränser, var och en märkt med ett nummer. Utforskaren skapar den, räknar ut vilka regioner som rör vid varandra och färgar den sedan med fyra färger så att två grannar aldrig får samma färg. Du kan se färgläggningen ske ett beslut i taget, inklusive de ögonblick då lösaren ändrar sig. Fyrfärgssatsen lovar att den alltid lyckas, hur kartan än är ritad.",
    sections: [
      {
        heading: "Fyra färger räcker alltid",
        paragraphs: [
          "Francis Guthrie lade 1852 märke till att fyra färger verkade räcka för varje karta där grannländer måste ha olika färg, så länge varje land är ett sammanhängande stycke och det inte räknas som en gemensam gräns att mötas i en enda hörnpunkt. Att göra en sats av den iakttagelsen tog mer än ett sekel. Alfred Kempe publicerade 1879 ett bevis som 1890 visade sig vara felaktigt, även om argumentet fortfarande var starkt nog att bevisa att fem färger alltid räcker.",
          "Kenneth Appel och Wolfgang Haken bevisade till slut fyrfärgssatsen 1976, med en dator som kontrollerade en stor mängd oundvikliga konfigurationer. Ett enklare datorbevis följde 1997, och 2005 verifierade Georges Gonthier hela argumentet i bevisassistenten Coq.",
          "På grafspråk blir varje region ett hörn och varje gemensam gräns en kant. Resultatet är en planär graf, och satsen säger att dess kromatiska tal χ är högst 4. Det är vad märket ovanför ytan betyder.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{för varje planär graf } G",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Listan med förinställda kartor väljer hur många regioner kartan har och hur jämnt de är formade. ”Random Voronoi” börjar med 30 eller 60 celler. Tre förval låser antalet till 48, 16 och 54 regioner, lika många som USA:s sammanhängande delstater, Tysklands förbundsländer och FN:s medlemsstater i Afrika. Det är bara talen som är lånade: det här är slumpkartor med så många celler och extra utjämning, inga verkliga gränser. ”Stress test” lägger sex regioner i en tät ring, som alla möts i en punkt i mitten, och sex till runt dem, utan utjämning, för att skapa ett trångt grannskap. ”Generate random” går vidare till nästa slumpfrö och ritar en ny karta. Fröet i det övre märket gör varje karta reproducerbar.",
          "”Number of regions” (5 till 80) anger antalet celler direkt. Om du flyttar det när något annat förval är valt går du tillbaka till en slumpmässig Voronoikarta. Du kan klicka på palettens färgrutor för att välja egna färger.",
          "I panelen ”Auto-colourer” utför ”Step” ett beslut, ”Run” spelar upp alla i vald hastighet (8 till 400 millisekunder per steg, standard 60), ”Auto” hoppar direkt till den färdiga färgläggningen och ”Reset colouring” gör alla regioner grå igen. Räknarna visar hur många regioner som är färgade, hur många gånger lösaren behövde backa och det totala antalet steg.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Kartan är ett Voronoidiagram: slumpmässiga fröpunkter placeras på ytan och varje pixel tillhör sitt närmaste frö. Några omgångar Lloyd-relaxation, som flyttar varje frö till mitten av sin egen cell och räknar om, gör regionerna rundare och jämnare. Ett sista pass i full upplösning tilldelar varje pixel. Fröna kommer från en liten deterministisk slumpgenerator, så frö 1 ger alltid samma karta vid en given storlek på ytan.",
          "Grannskapet läses direkt ur pixlarna: koden går igenom varje vågrätt och lodrätt par av intilliggande pixlar, och när deras etiketter skiljer sig räknas paret för de två regionerna. Regioner är grannar så snart de delar minst tre sådana par, så celler som bara möts i ett hörn kopplas inte ihop.",
          "Färgläggningen är en sökning med backtracking enligt heuristiken att alltid ta den mest begränsade variabeln först. I varje steg väljer sökningen den ofärgade region som har minst antal tillåtna färger kvar, avgör lika lägen efter antalet grannar och provar färgerna i en fast ordning. Hela sökningen körs en gång när kartan skapas och sparas som en lista av tilldelnings- och ångra-steg. Animationen spelar bara upp den listan. Ingenting rör sig förrän du trycker på ”Run”, så sidan beter sig likadant med minskad rörelse.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Varför lösaren sällan backar",
        paragraphs: [
          "Att bevisa att fyra färger alltid fungerar är svårt. Att hitta en färgläggning för en viss karta är det oftast inte. Eulers formel begränsar en planär graf med V hörn till högst 3V − 6 kanter, så den genomsnittliga regionen har färre än sex grannar och det finns alltid någon region med fem eller färre. Tillsammans med vanan att färga den mest begränsade regionen först blir återvändsgränder sällsynta. På de flesta slumpkartor står räknaren för backningar kvar på 0, och när den inte gör det handlar det oftast om en handfull.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se en återvändsgränd",
        text: "Välj ”Random Voronoi (60 cells)”, tryck på ”Generate random” tills räknaren ”backtracks” visar ett värde som inte är noll, sätt sedan hastigheten till 300 ms och tryck på ”Run”. Leta efter regioner som får en färg och senare blir grå igen: var och en av dem är ett ångra-steg.",
      },
      {
        title: "Räkna grannarna",
        text: "Dra ”Number of regions” till 80 och läs av märkena ”edges” och ”max deg”. Antalet kanter håller sig alltid under tre gånger antalet regioner, precis som Eulers formel kräver för varje plan karta.",
      },
      {
        title: "Hörn räknas inte",
        text: "I ”Stress test” möts sex regioner i en enda punkt i mitten. Tryck på ”Auto” och titta på deras färger: med bara fyra färger till sex regioner måste minst två av dem ha samma, och de två ligger aldrig sida vid sida. Att mötas i ett hörn är ingen gräns, och det är precis undantaget i Guthries regel.",
      },
      {
        title: "Stega för hand",
        text: "Välj förvalet med 16 regioner och klicka på ”Step” flera gånger. Gissa före varje klick vilken region lösaren väljer härnäst: det blir en av dem med minst antal alternativ kvar, ofta den med flest redan färgade grannar.",
      },
    ],
  },
  no: {
    metaDescription:
      "Se firefargeteoremet i arbeid: Lag tilfeldige plane kart og følg hvordan en løser med tilbakesporing farger hver region med fire farger, steg for steg.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Lerretet viser et kart: et plan skåret opp i regioner som deler grenser, hver merket med et nummer. Utforskeren lager det, finner ut hvilke regioner som berører hverandre, og farger det så med fire farger slik at to naboer aldri får samme farge. Du kan se fargeleggingen skje én beslutning om gangen, også de øyeblikkene der løseren ombestemmer seg. Firefargeteoremet lover at den alltid lykkes, uansett hvordan kartet er tegnet.",
    sections: [
      {
        heading: "Fire farger er alltid nok",
        paragraphs: [
          "Francis Guthrie la i 1852 merke til at fire farger så ut til å holde for ethvert kart der naboland må ha ulik farge, så lenge hvert land er ett sammenhengende stykke og det ikke regnes som felles grense å møtes i ett enkelt hjørnepunkt. Å gjøre den observasjonen til et teorem tok mer enn hundre år. Alfred Kempe publiserte i 1879 et bevis som i 1890 viste seg å inneholde en feil, selv om argumentet fortsatt var sterkt nok til å bevise at fem farger alltid er nok.",
          "Kenneth Appel og Wolfgang Haken beviste til slutt firefargeteoremet i 1976, med en datamaskin som sjekket en stor mengde uunngåelige konfigurasjoner. Et enklere databevis fulgte i 1997, og i 2005 verifiserte Georges Gonthier hele argumentet i bevisassistenten Coq.",
          "I grafspråk blir hver region en node og hver felles grense en kant. Resultatet er en planar graf, og teoremet sier at det kromatiske tallet χ er høyst 4. Det er det merket over lerretet betyr.",
        ],
        formula: "\\chi(G) \\le 4 \\quad \\text{for enhver planar graf } G",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Listen med forhåndsdefinerte kart velger hvor mange regioner kartet har, og hvor jevnt de er formet. «Random Voronoi» starter med 30 eller 60 celler. Tre forhåndsvalg låser antallet til 48, 16 og 54 regioner, like mange som de sammenhengende delstatene i USA, de tyske delstatene og FNs medlemsland i Afrika. Bare tallene er lånt: Dette er tilfeldige kart med så mange celler og ekstra utjevning, ikke virkelige grenser. «Stress test» legger seks regioner i en tett ring, som alle møtes i ett punkt i midten, og seks til rundt dem, uten utjevning, for å lage et trangt nabolag. «Generate random» går videre til neste tilfeldige frø og tegner et nytt kart. Frøet i det øverste merket gjør hvert kart reproduserbart.",
          "«Number of regions» (5 til 80) setter antall celler direkte. Flytter du den mens et annet forhåndsvalg er valgt, går du tilbake til et tilfeldig Voronoi-kart. Du kan klikke på fargeprøvene i paletten for å velge dine egne farger.",
          "I panelet «Auto-colourer» utfører «Step» én beslutning, «Run» spiller av alle i valgt hastighet (8 til 400 millisekunder per steg, standard 60), «Auto» hopper rett til den ferdige fargeleggingen, og «Reset colouring» gjør alle regionene grå igjen. Tellerne viser hvor mange regioner som er farget, hvor mange ganger løseren måtte gå tilbake, og det totale antallet steg.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Kartet er et Voronoi-diagram: Tilfeldige frøpunkter plasseres på lerretet, og hver piksel tilhører det nærmeste frøet. Noen runder med Lloyd-relaksasjon, som flytter hvert frø til midten av sin egen celle og regner på nytt, gjør regionene rundere og jevnere. Et siste gjennomløp i full oppløsning tildeler hver piksel. Frøene kommer fra en liten deterministisk tilfeldighetsgenerator, så frø 1 gir alltid det samme kartet for en gitt lerretsstørrelse.",
          "Naboskap leses rett fra pikslene: Koden går gjennom hvert vannrette og loddrette par av nabopiksler, og hver gang merkelappene er forskjellige, telles paret for de to regionene. Regioner er naboer så snart de deler minst tre slike par, så celler som bare møtes i et hjørne, kobles ikke sammen.",
          "Fargeleggingen er et søk med tilbakesporing (backtracking) og heuristikken mest begrenset variabel. I hvert steg velger det den ufargede regionen som har færrest tillatte farger igjen, avgjør likhet etter antall naboer og prøver fargene i fast rekkefølge. Hele søket kjøres én gang når kartet lages, og lagres som en liste med tildelings- og angresteg. Animasjonen spiller bare av den listen. Ingenting beveger seg før du trykker «Run», så siden oppfører seg likt med redusert bevegelse.",
        ],
        code: SOLVER_EXCERPT,
      },
      {
        heading: "Hvorfor løseren sjelden går tilbake",
        paragraphs: [
          "Å bevise at fire farger alltid virker, er vanskelig. Å finne en fargelegging for ett bestemt kart er det som regel ikke. Eulers formel begrenser en planar graf med V noder til høyst 3V − 6 kanter, så den gjennomsnittlige regionen har færre enn seks naboer, og det finnes alltid en region med fem eller færre. Sammen med vanen med å farge den mest begrensede regionen først gjør det blindveier sjeldne. På de fleste tilfeldige kart blir telleren for tilbakesporinger stående på 0, og når den ikke gjør det, er det vanligvis en håndfull.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se en blindvei",
        text: "Velg «Random Voronoi (60 cells)», trykk «Generate random» til telleren «backtracks» viser en verdi som ikke er null, sett så hastigheten til 300 ms og trykk «Run». Se etter regioner som får en farge og senere blir grå igjen: Hver av dem er ett angresteg.",
      },
      {
        title: "Tell naboene",
        text: "Skyv «Number of regions» til 80 og les av merkene «edges» og «max deg». Antall kanter holder seg alltid under tre ganger antall regioner, slik Eulers formel krever for ethvert plant kart.",
      },
      {
        title: "Hjørner teller ikke",
        text: "I «Stress test» møtes seks regioner i ett enkelt punkt i midten. Trykk «Auto» og se på fargene deres: Med bare fire farger til seks regioner må minst to av dem være like, og de to ligger aldri side om side. Å møtes i et hjørne er ikke en grense, og det er nettopp unntaket i Guthries regel.",
      },
      {
        title: "Gå steg for steg for hånd",
        text: "Velg forhåndsvalget med 16 regioner og klikk «Step» gjentatte ganger. Gjett før hvert klikk hvilken region løseren velger som neste: Det blir en av dem med færrest muligheter igjen, ofte den med flest naboer som allerede er farget.",
      },
    ],
  },
};
