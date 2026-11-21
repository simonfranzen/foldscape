import type { ExplorerGuide } from "./types";

// Numbers quoted here (N 20 to 200 default 80, k 2 to 10 default 4, p in steps
// of 0.01 default 0.1, the eleven curve samples, L and C for N = 80, k = 4)
// match app/smallworld/explorer/page.tsx; L and C values were measured with
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
          "N legt die Zahl der Knoten fest, von 20 bis 200 (voreingestellt 80). k ist die Zahl der Nachbarn pro Seite, von 2 bis 10 (voreingestellt 4), jeder Knoten startet also mit Grad 2k. p ist die Umverdrahtungswahrscheinlichkeit, von 0 bis 1 in Schritten von 0,01 (voreingestellt 0,1); die Knöpfe darunter springen auf 0, 0,01, 0,1 und 1. «Generate (new seed)» würfelt mit denselben Einstellungen einen neuen Graphen.",
          "Klick auf einen Knoten und dann auf einen zweiten, und eine Breitensuche hebt einen kürzesten Weg zwischen ihnen in Bernstein hervor; ein dritter Klick beginnt eine neue Auswahl, «Clear path» entfernt sie. Das Statistikfeld zeigt L, C, beide im Verhältnis zum nicht umverdrahteten Ring (L/L₀ und C/C₀), und den größten Knotengrad, der wächst, weil das Umverdrahten manchen Knoten zusätzliche Verbindungen aufbürdet.",
          "Das untere Diagramm ist das berühmte Watts-Strogatz-Bild für dein N und k. Es zeigt L/L₀ in Cyan und C/C₀ in Rosa für elf Werte von p zwischen 0 und 1 auf logarithmischer Achse; die gestrichelte bernsteinfarbene Linie markiert dein aktuelles p.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der Graph ist ein Array von Mengen: adj[i] enthält die Nachbarn von Knoten i, so lässt sich «sind die beiden verbunden?» in konstanter Zeit beantworten. Der Aufbau erzeugt zuerst das Ringgitter, geht dann die k Vorwärtsverbindungen jedes Knotens durch und verlegt mit Wahrscheinlichkeit p das ferne Ende auf einen zufälligen Knoten. Schleifen und doppelte Verbindungen werden übersprungen (nach 50 Fehlversuchen gibt er auf). Die Zufallszahlen stammen aus einem kleinen Generator mit Startwert, mulberry32: Derselbe Startwert ergibt immer denselben Graphen, und «Generate» erhöht einfach den Startwert.",
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
        text: "Drück den Knopf 0,01. Bei N · k = 320 Verbindungen werden im Schnitt etwa drei umverdrahtet, und trotzdem fällt L meist von 5,44 auf einen Wert zwischen 3,5 und 4,5, während C über 0,6 bleibt. Drück ein paarmal «Generate», um zu sehen, wie viel davon abhängt, wo diese wenigen Abkürzungen landen.",
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
};
