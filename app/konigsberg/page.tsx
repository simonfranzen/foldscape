"use client";

import { Reveal } from "@/components/Reveal";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { palette } from "@/lib/visual/palette";

const ACCENT = "text-signal-teal";

// Per-locale strings for the four inline SVG figures. Proper place-names
// (Kneiphof, Lomse) stay untranslated — they're historical Königsberg
// districts. Each figure carries its own pretitle/heading/caption plus the
// few in-diagram labels it needs; everything else is shared via `shared`.
type FigureLabels = {
  fig1: {
    pretitle: string;
    heading: string;
    caption: string;
    northBank: string;
    southBank: string;
    aria: string;
  };
  fig2: {
    pretitle: string;
    heading: string;
    becomes: string;
    cityLabel: string;
    graphLabel: string;
    caption: string;
    aria: string;
  };
  fig3: {
    pretitle: string;
    heading: string;
    evenTitle: string;
    oddTitle: string;
    evenNote: string;
    oddNote: string;
    caption: string;
    aria: string;
  };
  fig4: {
    pretitle: string;
    heading: string;
    destroyed: string;
    caption: string;
    aria: string;
  };
  shared: {
    pretitle: string;
    heading: string;
    legendNote: string;
    caption: string;
    deg: string;
    aria: string;
  };
};

const FIGURE: Record<Locale, FigureLabels> = {
  en: {
    fig1: {
      pretitle: "Figure 1 · The city",
      heading: "Königsberg in 1736 — two banks, two islands, seven bridges",
      caption:
        "A Sunday-stroll puzzle: cross every bridge exactly once and end where you started. Townspeople tried for decades. Nobody could prove it was impossible until Euler showed up.",
      northBank: "north bank",
      southBank: "south bank",
      aria: "Schematic map of Königsberg: a river runs east–west with two islands (Kneiphof on the west, Lomse on the east) connected to the north bank, the south bank and each other by seven arched bridges.",
    },
    fig2: {
      pretitle: "Figure 2 · From city to graph",
      heading: "Euler's leap — geometry becomes topology",
      becomes: "becomes",
      cityLabel: "the city",
      graphLabel: "the graph",
      caption:
        "Ignore distance, ignore angle, ignore upstream-versus-downstream. Land masses collapse to dots; bridges collapse to edges. The walk problem is now purely about how the dots connect — geometria situs. Graph theory and topology are born in the same stroke.",
      aria: "Two-panel figure. Left: the city silhouette with four land masses and seven bridges. Right: the same connectivity drawn as four dots A, B, C, D and seven curved edges.",
    },
    fig3: {
      pretitle: "Figure 3 · The parity argument",
      heading: "In, out, in, out — each interior vertex needs an even degree",
      evenTitle: "Even (degree 4)",
      oddTitle: "Odd (degree 3)",
      evenNote: "in→out, in→out",
      oddNote: "one edge left over — start, end, or stuck",
      caption:
        "Every time the walk enters a land mass it must leave again on a different bridge. Interior vertices need an even number of incident bridges. Odd vertices are allowed only at the start and the end — at most two of them. Königsberg has four odd vertices. Two too many.",
      aria: "Two side-by-side vertex diagrams. Left: a dot with four edges paired as two in-out arrows. Right: a dot with three edges where one is left dangling, marked unresolved.",
    },
    fig4: {
      pretitle: "Figure 4 · Königsberg today",
      heading: "1944 — two bridges gone, the walk is finally possible",
      destroyed: "destroyed 1944",
      caption:
        "After WWII, five of the original seven bridges remain. The new degrees: A 3 · B 2 · C 2 · D 3. Exactly two odd vertices — exactly the parity an Eulerian path needs, starting at one odd vertex and ending at the other. Today the walk is finally possible, though Euler is no longer there to take it.",
      aria: "The Königsberg graph with two edges drawn as dashed faded lines marked destroyed 1944. New degrees A 3, B 2, C 2, D 3. Vertices A and D are highlighted as the odd endpoints of an Eulerian path.",
    },
    shared: {
      pretitle: "The map, abstracted",
      heading: "Four land masses · seven bridges · four odd degrees",
      legendNote: "seven bridges, four odd degrees",
      caption:
        "Drop the river, drop the streets, drop the angles. What remains is a graph. The degree of each vertex (5, 3, 3, 3) is the count of bridges touching that land mass — and the parity argument needs at most two of those numbers to be odd. Königsberg has four. The walk is impossible, and the impossibility is purely topological.",
      deg: "deg",
      aria: "The Königsberg graph: four vertices A, B, C, D with seven edges showing bridge multiplicities A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
  de: {
    fig1: {
      pretitle: "Abbildung 1 · Die Stadt",
      heading: "Königsberg 1736 — zwei Ufer, zwei Inseln, sieben Brücken",
      caption:
        "Ein Sonntagsspaziergangs-Rätsel: jede Brücke genau einmal überqueren und am Ausgangspunkt enden. Die Bürger versuchten es jahrzehntelang. Niemand konnte beweisen, dass es unmöglich war — bis Euler kam.",
      northBank: "Nordufer",
      southBank: "Südufer",
      aria: "Schematische Karte von Königsberg: ein Fluss verläuft von Ost nach West, zwei Inseln (Kneiphof im Westen, Lomse im Osten) sind durch sieben gebogene Brücken mit den Ufern und miteinander verbunden.",
    },
    fig2: {
      pretitle: "Abbildung 2 · Von der Stadt zum Graphen",
      heading: "Eulers Sprung — Geometrie wird Topologie",
      becomes: "wird zu",
      cityLabel: "die Stadt",
      graphLabel: "der Graph",
      caption:
        "Entfernung weg, Winkel weg, flussauf-flussab weg. Landmassen werden zu Punkten, Brücken werden zu Kanten. Das Spaziergangsproblem hängt nur noch davon ab, wie die Punkte verbunden sind — «geometria situs». Graphentheorie und Topologie werden im selben Atemzug geboren.",
      aria: "Zweiteilige Abbildung. Links: die Silhouette der Stadt mit vier Landmassen und sieben Brücken. Rechts: dieselbe Verbindung als vier Punkte A, B, C, D und sieben gebogene Kanten.",
    },
    fig3: {
      pretitle: "Abbildung 3 · Das Paritätsargument",
      heading: "Rein, raus, rein, raus — jeder innere Knoten braucht geraden Grad",
      evenTitle: "Gerade (Grad 4)",
      oddTitle: "Ungerade (Grad 3)",
      evenNote: "rein→raus, rein→raus",
      oddNote: "eine Kante bleibt übrig — Start, Ende oder Sackgasse",
      caption:
        "Jedes Mal, wenn der Spaziergang eine Landmasse betritt, muss er sie auf einer anderen Brücke wieder verlassen. Innere Knoten brauchen also eine gerade Zahl an Brücken. Ungerade Knoten sind nur am Anfang und am Ende erlaubt — höchstens zwei. Königsberg hat vier ungerade Knoten. Zwei zu viel.",
      aria: "Zwei nebeneinander angeordnete Knotendiagramme. Links: ein Punkt mit vier Kanten, paarweise als rein-raus-Pfeile. Rechts: ein Punkt mit drei Kanten, eine bleibt ungepaart und ist als ungelöst markiert.",
    },
    fig4: {
      pretitle: "Abbildung 4 · Königsberg heute",
      heading: "1944 — zwei Brücken zerstört, der Spaziergang ist endlich möglich",
      destroyed: "1944 zerstört",
      caption:
        "Nach dem Zweiten Weltkrieg sind fünf der ursprünglich sieben Brücken übrig. Die neuen Grade: A 3 · B 2 · C 2 · D 3. Genau zwei ungerade Knoten — genau die Parität, die ein Eulerweg braucht, mit Start am einen und Ende am anderen ungeraden Knoten. Heute ist der Spaziergang endlich möglich — nur Euler ist nicht mehr da, um ihn zu gehen.",
      aria: "Der Königsberg-Graph mit zwei Kanten als gestrichelte, ausgegraute Linien, markiert als 1944 zerstört. Neue Grade A 3, B 2, C 2, D 3. Die Knoten A und D sind als die ungeraden Endpunkte eines Eulerwegs hervorgehoben.",
    },
    shared: {
      pretitle: "Die Karte, abstrahiert",
      heading: "Vier Landmassen · sieben Brücken · vier ungerade Grade",
      legendNote: "sieben Brücken, vier ungerade Grade",
      caption:
        "Lass den Fluss weg, lass die Straßen weg, lass die Winkel weg. Was übrig bleibt, ist ein Graph. Der Grad jedes Knotens (5, 3, 3, 3) ist die Anzahl der Brücken, die diese Landmasse berühren — und das Paritätsargument verlangt, dass höchstens zwei dieser Zahlen ungerade sind. Königsberg hat vier. Der Spaziergang ist unmöglich, und die Unmöglichkeit ist rein topologisch.",
      deg: "Grad",
      aria: "Der Königsberg-Graph: vier Knoten A, B, C, D mit sieben Kanten, die die Brückenanzahlen A-B 2, A-C 2, A-D 1, B-D 1, C-D 1 darstellen.",
    },
  },
  es: {
    fig1: {
      pretitle: "Figura 1 · La ciudad",
      heading: "Königsberg en 1736 — dos orillas, dos islas, siete puentes",
      caption:
        "Un acertijo de paseo dominical: cruzar cada puente exactamente una vez y terminar donde empezaste. Los habitantes lo intentaron durante décadas. Nadie podía demostrar que era imposible, hasta que llegó Euler.",
      northBank: "orilla norte",
      southBank: "orilla sur",
      aria: "Mapa esquemático de Königsberg: un río corre de este a oeste con dos islas (Kneiphof al oeste, Lomse al este) conectadas a las orillas y entre sí por siete puentes arqueados.",
    },
    fig2: {
      pretitle: "Figura 2 · De la ciudad al grafo",
      heading: "El salto de Euler — la geometría se vuelve topología",
      becomes: "se convierte en",
      cityLabel: "la ciudad",
      graphLabel: "el grafo",
      caption:
        "Ignora la distancia, ignora el ángulo, ignora río-arriba-río-abajo. Las masas de tierra se reducen a puntos; los puentes, a aristas. El problema del paseo depende ahora solo de cómo se conectan los puntos — geometria situs. La teoría de grafos y la topología nacen de un mismo trazo.",
      aria: "Figura de dos paneles. Izquierda: la silueta de la ciudad con cuatro masas de tierra y siete puentes. Derecha: la misma conectividad dibujada como cuatro puntos A, B, C, D y siete aristas curvas.",
    },
    fig3: {
      pretitle: "Figura 3 · El argumento de paridad",
      heading: "Entra, sale, entra, sale — cada vértice interior necesita grado par",
      evenTitle: "Par (grado 4)",
      oddTitle: "Impar (grado 3)",
      evenNote: "entra→sale, entra→sale",
      oddNote: "queda una arista — inicio, fin o atascado",
      caption:
        "Cada vez que el paseo entra en una masa de tierra debe salir por un puente diferente. Los vértices interiores necesitan un número par de puentes incidentes. Los vértices impares solo se permiten al inicio y al final — como mucho dos. Königsberg tiene cuatro vértices impares. Dos de más.",
      aria: "Dos diagramas de vértice uno al lado del otro. Izquierda: un punto con cuatro aristas emparejadas como flechas entra-sale. Derecha: un punto con tres aristas, una queda sin emparejar y se marca como no resuelta.",
    },
    fig4: {
      pretitle: "Figura 4 · Königsberg hoy",
      heading: "1944 — dos puentes destruidos, el paseo es por fin posible",
      destroyed: "destruido en 1944",
      caption:
        "Tras la Segunda Guerra Mundial, cinco de los siete puentes originales siguen en pie. Los nuevos grados: A 3 · B 2 · C 2 · D 3. Exactamente dos vértices impares — justo la paridad que necesita un camino euleriano, empezando en un vértice impar y terminando en el otro. Hoy el paseo es por fin posible, aunque Euler ya no está para darlo.",
      aria: "El grafo de Königsberg con dos aristas dibujadas como líneas discontinuas atenuadas, marcadas como destruidas en 1944. Nuevos grados A 3, B 2, C 2, D 3. Los vértices A y D están resaltados como los extremos impares de un camino euleriano.",
    },
    shared: {
      pretitle: "El mapa, abstraído",
      heading: "Cuatro masas de tierra · siete puentes · cuatro grados impares",
      legendNote: "siete puentes, cuatro grados impares",
      caption:
        "Quita el río, quita las calles, quita los ángulos. Lo que queda es un grafo. El grado de cada vértice (5, 3, 3, 3) es el número de puentes que tocan esa masa de tierra — y el argumento de paridad exige que como mucho dos de esos números sean impares. Königsberg tiene cuatro. El paseo es imposible, y la imposibilidad es puramente topológica.",
      deg: "grado",
      aria: "El grafo de Königsberg: cuatro vértices A, B, C, D con siete aristas que muestran las multiplicidades de puentes A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
  fr: {
    fig1: {
      pretitle: "Figure 1 · La ville",
      heading: "Königsberg en 1736 — deux rives, deux îles, sept ponts",
      caption:
        "Une énigme de promenade dominicale : traverser chaque pont exactement une fois et finir d'où l'on est parti. Les habitants ont essayé pendant des décennies. Personne n'a pu prouver que c'était impossible, jusqu'à l'arrivée d'Euler.",
      northBank: "rive nord",
      southBank: "rive sud",
      aria: "Carte schématique de Königsberg : une rivière coule d'est en ouest, deux îles (Kneiphof à l'ouest, Lomse à l'est) sont reliées aux rives et entre elles par sept ponts en arc.",
    },
    fig2: {
      pretitle: "Figure 2 · De la ville au graphe",
      heading: "Le saut d'Euler — la géométrie devient topologie",
      becomes: "devient",
      cityLabel: "la ville",
      graphLabel: "le graphe",
      caption:
        "Oublie la distance, oublie l'angle, oublie l'amont et l'aval. Les masses de terre se réduisent à des points ; les ponts, à des arêtes. Le problème de la promenade ne dépend plus que de la manière dont les points sont connectés — geometria situs. La théorie des graphes et la topologie naissent du même geste.",
      aria: "Figure à deux panneaux. À gauche : la silhouette de la ville avec quatre masses de terre et sept ponts. À droite : la même connectivité dessinée comme quatre points A, B, C, D et sept arêtes courbes.",
    },
    fig3: {
      pretitle: "Figure 3 · L'argument de parité",
      heading: "Entre, sort, entre, sort — chaque sommet intérieur a besoin d'un degré pair",
      evenTitle: "Pair (degré 4)",
      oddTitle: "Impair (degré 3)",
      evenNote: "entre→sort, entre→sort",
      oddNote: "une arête de trop — début, fin ou bloqué",
      caption:
        "Chaque fois que la promenade entre dans une masse de terre, elle doit en ressortir par un autre pont. Les sommets intérieurs ont donc besoin d'un nombre pair de ponts incidents. Les sommets impairs ne sont autorisés qu'au début et à la fin — au plus deux. Königsberg en a quatre. Deux de trop.",
      aria: "Deux diagrammes de sommet côte à côte. À gauche : un point avec quatre arêtes appariées en deux flèches entre-sort. À droite : un point avec trois arêtes dont une reste seule et est marquée non résolue.",
    },
    fig4: {
      pretitle: "Figure 4 · Königsberg aujourd'hui",
      heading: "1944 — deux ponts détruits, la promenade est enfin possible",
      destroyed: "détruit en 1944",
      caption:
        "Après la Seconde Guerre mondiale, cinq des sept ponts d'origine subsistent. Les nouveaux degrés : A 3 · B 2 · C 2 · D 3. Exactement deux sommets impairs — précisément la parité qu'exige un chemin eulérien, en partant d'un sommet impair et en finissant à l'autre. Aujourd'hui la promenade est enfin possible, mais Euler n'est plus là pour la faire.",
      aria: "Le graphe de Königsberg avec deux arêtes dessinées en pointillés estompés, étiquetées détruites en 1944. Nouveaux degrés A 3, B 2, C 2, D 3. Les sommets A et D sont mis en évidence comme les extrémités impaires d'un chemin eulérien.",
    },
    shared: {
      pretitle: "La carte, abstraite",
      heading: "Quatre masses de terre · sept ponts · quatre degrés impairs",
      legendNote: "sept ponts, quatre degrés impairs",
      caption:
        "Retire la rivière, retire les rues, retire les angles. Ce qui reste est un graphe. Le degré de chaque sommet (5, 3, 3, 3) est le nombre de ponts qui touchent cette masse de terre — et l'argument de parité exige qu'au plus deux de ces nombres soient impairs. Königsberg en a quatre. La promenade est impossible, et l'impossibilité est purement topologique.",
      deg: "deg",
      aria: "Le graphe de Königsberg : quatre sommets A, B, C, D avec sept arêtes montrant les multiplicités de ponts A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
  it: {
    fig1: {
      pretitle: "Figura 1 · La città",
      heading: "Königsberg nel 1736 — due rive, due isole, sette ponti",
      caption:
        "Un rompicapo da passeggiata domenicale: attraversare ogni ponte esattamente una volta e tornare al punto di partenza. I cittadini ci provarono per decenni. Nessuno riuscì a dimostrare che fosse impossibile — finché non arrivò Euler.",
      northBank: "riva nord",
      southBank: "riva sud",
      aria: "Mappa schematica di Königsberg: un fiume scorre da est a ovest, due isole (Kneiphof a ovest, Lomse a est) sono collegate alle rive e tra loro da sette ponti ad arco.",
    },
    fig2: {
      pretitle: "Figura 2 · Dalla città al grafo",
      heading: "Il salto di Euler — la geometria diventa topologia",
      becomes: "diventa",
      cityLabel: "la città",
      graphLabel: "il grafo",
      caption:
        "Ignora la distanza, ignora l'angolo, ignora monte-e-valle. Le masse di terra si riducono a punti; i ponti a spigoli. Il problema della passeggiata dipende ora soltanto da come i punti sono connessi — geometria situs. Teoria dei grafi e topologia nascono nello stesso gesto.",
      aria: "Figura a due pannelli. A sinistra: la sagoma della città con quattro masse di terra e sette ponti. A destra: la stessa connessione disegnata come quattro punti A, B, C, D e sette spigoli curvi.",
    },
    fig3: {
      pretitle: "Figura 3 · L'argomento di parità",
      heading: "Entra, esce, entra, esce — ogni vertice interno ha bisogno di grado pari",
      evenTitle: "Pari (grado 4)",
      oddTitle: "Dispari (grado 3)",
      evenNote: "entra→esce, entra→esce",
      oddNote: "uno spigolo di troppo — inizio, fine o bloccato",
      caption:
        "Ogni volta che la passeggiata entra in una massa di terra, deve uscirne su un altro ponte. I vertici interni hanno bisogno di un numero pari di ponti incidenti. I vertici dispari sono ammessi solo all'inizio e alla fine — al massimo due. Königsberg ne ha quattro. Due di troppo.",
      aria: "Due diagrammi di vertice affiancati. A sinistra: un punto con quattro spigoli accoppiati come due frecce entra-esce. A destra: un punto con tre spigoli, uno resta scompagnato e viene marcato come non risolto.",
    },
    fig4: {
      pretitle: "Figura 4 · Königsberg oggi",
      heading: "1944 — due ponti distrutti, la passeggiata è finalmente possibile",
      destroyed: "distrutto nel 1944",
      caption:
        "Dopo la Seconda guerra mondiale, cinque dei sette ponti originari rimangono. I nuovi gradi: A 3 · B 2 · C 2 · D 3. Esattamente due vertici dispari — proprio la parità che richiede un cammino euleriano, partendo da un vertice dispari e finendo all'altro. Oggi la passeggiata è finalmente possibile, ma Euler non è più qui per farla.",
      aria: "Il grafo di Königsberg con due spigoli disegnati come linee tratteggiate sbiadite, etichettati come distrutti nel 1944. Nuovi gradi A 3, B 2, C 2, D 3. I vertici A e D sono evidenziati come gli estremi dispari di un cammino euleriano.",
    },
    shared: {
      pretitle: "La mappa, astratta",
      heading: "Quattro masse di terra · sette ponti · quattro gradi dispari",
      legendNote: "sette ponti, quattro gradi dispari",
      caption:
        "Togli il fiume, togli le strade, togli gli angoli. Ciò che resta è un grafo. Il grado di ogni vertice (5, 3, 3, 3) è il numero di ponti che toccano quella massa di terra — e l'argomento di parità richiede che al più due di quei numeri siano dispari. Königsberg ne ha quattro. La passeggiata è impossibile, e l'impossibilità è puramente topologica.",
      deg: "grado",
      aria: "Il grafo di Königsberg: quattro vertici A, B, C, D con sette spigoli che mostrano le molteplicità di ponti A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
  pt: {
    fig1: {
      pretitle: "Figura 1 · A cidade",
      heading: "Königsberg em 1736 — duas margens, duas ilhas, sete pontes",
      caption:
        "Um enigma de passeio dominical: atravessar cada ponte exatamente uma vez e terminar onde se começou. Os habitantes tentaram durante décadas. Ninguém conseguiu provar que era impossível — até Euler chegar.",
      northBank: "margem norte",
      southBank: "margem sul",
      aria: "Mapa esquemático de Königsberg: um rio corre de leste a oeste, duas ilhas (Kneiphof a oeste, Lomse a leste) ligadas às margens e uma à outra por sete pontes em arco.",
    },
    fig2: {
      pretitle: "Figura 2 · Da cidade ao grafo",
      heading: "O salto de Euler — a geometria torna-se topologia",
      becomes: "torna-se",
      cityLabel: "a cidade",
      graphLabel: "o grafo",
      caption:
        "Ignora a distância, ignora o ângulo, ignora rio-acima-rio-abaixo. As massas de terra reduzem-se a pontos; as pontes a arestas. O problema do passeio depende agora apenas de como os pontos estão ligados — geometria situs. A teoria dos grafos e a topologia nascem no mesmo gesto.",
      aria: "Figura de dois painéis. À esquerda: a silhueta da cidade com quatro massas de terra e sete pontes. À direita: a mesma conectividade desenhada como quatro pontos A, B, C, D e sete arestas curvas.",
    },
    fig3: {
      pretitle: "Figura 3 · O argumento de paridade",
      heading: "Entra, sai, entra, sai — cada vértice interior precisa de grau par",
      evenTitle: "Par (grau 4)",
      oddTitle: "Ímpar (grau 3)",
      evenNote: "entra→sai, entra→sai",
      oddNote: "sobra uma aresta — início, fim ou preso",
      caption:
        "Cada vez que o passeio entra numa massa de terra, tem de sair por outra ponte. Os vértices interiores precisam de um número par de pontes incidentes. Os vértices ímpares só são permitidos no início e no fim — no máximo dois. Königsberg tem quatro vértices ímpares. Dois a mais.",
      aria: "Dois diagramas de vértice lado a lado. À esquerda: um ponto com quatro arestas emparelhadas como duas setas entra-sai. À direita: um ponto com três arestas, uma fica sem par e é marcada como não resolvida.",
    },
    fig4: {
      pretitle: "Figura 4 · Königsberg hoje",
      heading: "1944 — duas pontes destruídas, o passeio é finalmente possível",
      destroyed: "destruída em 1944",
      caption:
        "Depois da Segunda Guerra Mundial, cinco das sete pontes originais permanecem. Os novos graus: A 3 · B 2 · C 2 · D 3. Exatamente dois vértices ímpares — precisamente a paridade que um caminho euleriano exige, começando num vértice ímpar e terminando no outro. Hoje o passeio é finalmente possível, mas Euler já não está cá para o fazer.",
      aria: "O grafo de Königsberg com duas arestas desenhadas como linhas tracejadas esbatidas, marcadas como destruídas em 1944. Novos graus A 3, B 2, C 2, D 3. Os vértices A e D estão realçados como os extremos ímpares de um caminho euleriano.",
    },
    shared: {
      pretitle: "O mapa, abstraído",
      heading: "Quatro massas de terra · sete pontes · quatro graus ímpares",
      legendNote: "sete pontes, quatro graus ímpares",
      caption:
        "Tira o rio, tira as ruas, tira os ângulos. O que sobra é um grafo. O grau de cada vértice (5, 3, 3, 3) é o número de pontes que tocam essa massa de terra — e o argumento de paridade exige que no máximo dois desses números sejam ímpares. Königsberg tem quatro. O passeio é impossível, e a impossibilidade é puramente topológica.",
      deg: "grau",
      aria: "O grafo de Königsberg: quatro vértices A, B, C, D com sete arestas mostrando as multiplicidades de pontes A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
  sv: {
    fig1: {
      pretitle: "Figur 1 · Staden",
      heading: "Königsberg 1736 — två stränder, två öar, sju broar",
      caption:
        "En söndagspromenadgåta: korsa varje bro exakt en gång och avsluta där du började. Stadsborna försökte i decennier. Ingen kunde bevisa att det var omöjligt — förrän Euler dök upp.",
      northBank: "norra stranden",
      southBank: "södra stranden",
      aria: "Schematisk karta över Königsberg: en flod löper från öst till väst, två öar (Kneiphof i väster, Lomse i öster) är förbundna med stränderna och med varandra av sju välvda broar.",
    },
    fig2: {
      pretitle: "Figur 2 · Från stad till graf",
      heading: "Eulers språng — geometri blir topologi",
      becomes: "blir",
      cityLabel: "staden",
      graphLabel: "grafen",
      caption:
        "Strunta i avstånd, strunta i vinklar, strunta i uppströms-och-nedströms. Landmassorna krymper till prickar; broarna till kanter. Promenadproblemet hänger nu bara på hur prickarna är kopplade — geometria situs. Grafteorin och topologin föds i samma drag.",
      aria: "Tvådelad figur. Till vänster: stadens silhuett med fyra landmassor och sju broar. Till höger: samma koppling ritad som fyra prickar A, B, C, D och sju böjda kanter.",
    },
    fig3: {
      pretitle: "Figur 3 · Paritetsargumentet",
      heading: "In, ut, in, ut — varje inre hörn behöver jämnt gradtal",
      evenTitle: "Jämnt (grad 4)",
      oddTitle: "Udda (grad 3)",
      evenNote: "in→ut, in→ut",
      oddNote: "en kant blir över — start, slut eller fast",
      caption:
        "Varje gång promenaden går in på en landmassa måste den ut igen på en annan bro. Inre hörn behöver alltså ett jämnt antal broar. Udda hörn är bara tillåtna i början och i slutet — högst två. Königsberg har fyra udda hörn. Två för många.",
      aria: "Två hörndiagram bredvid varandra. Till vänster: en prick med fyra kanter parade som två in-ut-pilar. Till höger: en prick med tre kanter där en blir över och är märkt som ouppklarad.",
    },
    fig4: {
      pretitle: "Figur 4 · Königsberg idag",
      heading: "1944 — två broar borta, promenaden är äntligen möjlig",
      destroyed: "förstörd 1944",
      caption:
        "Efter andra världskriget återstår fem av de ursprungliga sju broarna. De nya gradtalen: A 3 · B 2 · C 2 · D 3. Exakt två udda hörn — precis den paritet en Eulerstig behöver, med start i ett udda hörn och slut i det andra. Idag är promenaden äntligen möjlig — Euler är bara inte längre här för att ta den.",
      aria: "Königsbergsgrafen med två kanter ritade som streckade, bleknade linjer, märkta som förstörda 1944. Nya gradtal A 3, B 2, C 2, D 3. Hörnen A och D är markerade som de udda ändpunkterna för en Eulerstig.",
    },
    shared: {
      pretitle: "Kartan, abstraherad",
      heading: "Fyra landmassor · sju broar · fyra udda gradtal",
      legendNote: "sju broar, fyra udda gradtal",
      caption:
        "Ta bort floden, ta bort gatorna, ta bort vinklarna. Det som blir kvar är en graf. Varje hörns gradtal (5, 3, 3, 3) är antalet broar som rör vid den landmassan — och paritetsargumentet kräver att högst två av talen är udda. Königsberg har fyra. Promenaden är omöjlig, och omöjligheten är rent topologisk.",
      deg: "grad",
      aria: "Königsbergsgrafen: fyra hörn A, B, C, D med sju kanter som visar broantalen A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
  no: {
    fig1: {
      pretitle: "Figur 1 · Byen",
      heading: "Königsberg i 1736 — to bredder, to øyer, sju broer",
      caption:
        "En søndagsspaserturs-gåte: krysse hver bro nøyaktig én gang og ende der du startet. Byboerne forsøkte i tiår. Ingen klarte å bevise at det var umulig — før Euler dukket opp.",
      northBank: "nordbredden",
      southBank: "sørbredden",
      aria: "Skjematisk kart over Königsberg: en elv renner fra øst til vest, to øyer (Kneiphof i vest, Lomse i øst) er forbundet med bredden og med hverandre via sju buede broer.",
    },
    fig2: {
      pretitle: "Figur 2 · Fra by til graf",
      heading: "Eulers sprang — geometri blir topologi",
      becomes: "blir",
      cityLabel: "byen",
      graphLabel: "grafen",
      caption:
        "Glem avstand, glem vinkel, glem oppstrøms-og-nedstrøms. Landmassene krymper til prikker; broene til kanter. Spaserturproblemet henger nå bare på hvordan prikkene er koblet — geometria situs. Grafteori og topologi fødes i samme bevegelse.",
      aria: "Todelt figur. Til venstre: byens silhuett med fire landmasser og sju broer. Til høyre: samme tilkobling tegnet som fire prikker A, B, C, D og sju buede kanter.",
    },
    fig3: {
      pretitle: "Figur 3 · Paritetsargumentet",
      heading: "Inn, ut, inn, ut — hvert indre hjørne trenger partall som grad",
      evenTitle: "Partall (grad 4)",
      oddTitle: "Oddetall (grad 3)",
      evenNote: "inn→ut, inn→ut",
      oddNote: "én kant til overs — start, slutt eller fast",
      caption:
        "Hver gang spaserturen går inn på en landmasse må den ut igjen på en annen bro. Indre hjørner trenger derfor et partall av broer. Hjørner med oddetall er bare tillatt i start og slutt — høyst to. Königsberg har fire slike hjørner. To for mange.",
      aria: "To hjørnediagrammer side om side. Til venstre: en prikk med fire kanter parret som to inn-ut-piler. Til høyre: en prikk med tre kanter der én blir til overs og er merket som uløst.",
    },
    fig4: {
      pretitle: "Figur 4 · Königsberg i dag",
      heading: "1944 — to broer borte, spaserturen er endelig mulig",
      destroyed: "ødelagt i 1944",
      caption:
        "Etter andre verdenskrig står fem av de opprinnelige sju broene igjen. De nye gradene: A 3 · B 2 · C 2 · D 3. Nøyaktig to hjørner med oddetall — akkurat den pariteten en Eulervei trenger, med start i det ene hjørnet og slutt i det andre. I dag er spaserturen endelig mulig — bare Euler er ikke lenger her for å gå den.",
      aria: "Königsberg-grafen med to kanter tegnet som stiplede, bleknede linjer, merket som ødelagt i 1944. Nye grader A 3, B 2, C 2, D 3. Hjørnene A og D er fremhevet som de odde endepunktene for en Eulervei.",
    },
    shared: {
      pretitle: "Kartet, abstrahert",
      heading: "Fire landmasser · sju broer · fire odde gradtall",
      legendNote: "sju broer, fire odde gradtall",
      caption:
        "Fjern elva, fjern gatene, fjern vinklene. Det som er igjen er en graf. Hvert hjørnes grad (5, 3, 3, 3) er antallet broer som berører den landmassen — og paritetsargumentet krever at høyst to av tallene er odde. Königsberg har fire. Spaserturen er umulig, og umuligheten er rent topologisk.",
      deg: "grad",
      aria: "Königsberg-grafen: fire hjørner A, B, C, D med sju kanter som viser broantall A-B 2, A-C 2, A-D 1, B-D 1, C-D 1.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Figure helpers
// ─────────────────────────────────────────────────────────────────────────────

const AMBER = palette.signal.amber;
const RIVER = "rgba(125,243,255,0.10)";
const RIVER_EDGE = "rgba(125,243,255,0.30)";
const MUTED = palette.canvas.muted;

// Schematic Königsberg map. Two horizontal bank rectangles + two island ovals,
// connected by seven arched bridges. Reused at smaller scale in Figure 2.
// `compact` strips labels and tightens visuals so it sits inside a 2-panel split.
function CityMap({
  northLabel,
  southLabel,
  compact = false,
}: {
  northLabel: string;
  southLabel: string;
  compact?: boolean;
}) {
  // Coordinates designed for a 800x440 viewbox. Bridges are drawn as
  // semicircular arches crossing the river channels.
  const labelFontSize = compact ? 0 : 13;
  const islandFontSize = compact ? 0 : 12;

  return (
    <svg
      viewBox="0 0 800 440"
      className="block h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Banks */}
      <rect x="0" y="0" width="800" height="110" fill="rgba(255,209,102,0.08)" />
      <rect x="0" y="330" width="800" height="110" fill="rgba(255,209,102,0.08)" />
      {/* River body */}
      <rect x="0" y="110" width="800" height="220" fill={RIVER} />
      {/* River outlines (subtle current) */}
      <path
        d="M 0 145 Q 200 130 400 145 T 800 145"
        stroke={RIVER_EDGE}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 0 295 Q 200 280 400 295 T 800 295"
        stroke={RIVER_EDGE}
        strokeWidth="1"
        fill="none"
      />
      {/* Islands: Kneiphof (west, B) and Lomse (east, C) */}
      <ellipse
        cx="260"
        cy="220"
        rx="120"
        ry="55"
        fill="rgba(255,209,102,0.10)"
        stroke={AMBER}
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <ellipse
        cx="540"
        cy="220"
        rx="100"
        ry="48"
        fill="rgba(255,209,102,0.10)"
        stroke={AMBER}
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />

      {/* Bridges — semicircular arcs. Two A-B (north↔Kneiphof), two A-C
          (north↔Lomse), one A-D (long bridge wrapping east end, drawn as a
          big arc), one B-D (Kneiphof↔south), one C-D (Lomse↔south). */}
      {/* A-B bridges (north bank to Kneiphof) */}
      <path
        d="M 200 110 Q 200 145 200 170"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 320 110 Q 320 145 320 168"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* A-C bridges (north bank to Lomse) */}
      <path
        d="M 500 110 Q 500 145 500 175"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 600 110 Q 600 145 600 178"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* A-D bridge — long arc wrapping around the eastern end of the islands */}
      <path
        d="M 740 80 Q 790 220 740 360"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="0"
      />
      {/* B-D bridge (Kneiphof to south bank) */}
      <path
        d="M 240 272 Q 240 300 240 330"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* C-D bridge (Lomse to south bank) */}
      <path
        d="M 540 268 Q 540 300 540 330"
        stroke={AMBER}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Land labels */}
      {!compact && (
        <>
          <text
            x="20"
            y="40"
            fontFamily="ui-monospace, monospace"
            fontSize={labelFontSize}
            fill={MUTED}
          >
            A · {northLabel}
          </text>
          <text
            x="20"
            y="410"
            fontFamily="ui-monospace, monospace"
            fontSize={labelFontSize}
            fill={MUTED}
          >
            D · {southLabel}
          </text>
          <text
            x="260"
            y="225"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={islandFontSize}
            fill={MUTED}
          >
            B · Kneiphof
          </text>
          <text
            x="540"
            y="225"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={islandFontSize}
            fill={MUTED}
          >
            C · Lomse
          </text>
        </>
      )}
    </svg>
  );
}

// Abstract Königsberg graph. `removed` is a list of [u, v, key] edges that
// should be drawn as dashed/faded, for the WWII figure. `odd` is the set of
// vertex labels to highlight as odd-degree (Eulerian path endpoints).
// `degrees` lets the caller pass the post-removal degree sequence.
type EdgeKey = string; // "A-B-0" etc.
function AbstractGraph({
  degLabel,
  degrees,
  removedEdges = new Set<EdgeKey>(),
  highlightOdd = new Set<string>(),
  destroyedLabel,
  compact = false,
}: {
  degLabel: string;
  degrees: Record<"A" | "B" | "C" | "D", number>;
  removedEdges?: Set<EdgeKey>;
  highlightOdd?: Set<string>;
  destroyedLabel?: string;
  compact?: boolean;
}) {
  // Vertex positions designed for a 800x480 viewbox (same as the original
  // end-of-page figure, for visual continuity).
  const verts: Array<{
    id: "A" | "B" | "C" | "D";
    x: number;
    y: number;
    sub: string;
  }> = [
    { id: "A", x: 150, y: 90, sub: "north bank" },
    { id: "B", x: 330, y: 260, sub: "Kneiphof" },
    { id: "C", x: 490, y: 260, sub: "Lomse" },
    { id: "D", x: 670, y: 90, sub: "south bank" },
  ];

  // Edges as (u, v, key, pathD). Keys must match what callers pass via
  // `removedEdges`. There are 7 edges total.
  const edges: Array<{ u: string; v: string; key: EdgeKey; d: string }> = [
    { u: "A", v: "B", key: "A-B-0", d: "M 150 90 Q 200 130 330 260" },
    { u: "A", v: "B", key: "A-B-1", d: "M 150 90 Q 280 120 330 260" },
    { u: "A", v: "C", key: "A-C-0", d: "M 150 90 Q 320 180 490 260" },
    { u: "A", v: "C", key: "A-C-1", d: "M 150 90 Q 380 230 490 260" },
    { u: "A", v: "D", key: "A-D-0", d: "M 150 90 Q 410 50 670 90" },
    { u: "B", v: "D", key: "B-D-0", d: "M 330 260 Q 510 380 670 90" },
    { u: "C", v: "D", key: "C-D-0", d: "M 490 260 Q 600 200 670 90" },
  ];

  // For "destroyed" labels: place a small badge near the midpoint of the
  // removed edges. Hard-coded midpoints because we have only two removed
  // edges and the geometry is fixed.
  const destroyedMidpoints: Record<EdgeKey, { x: number; y: number }> = {
    "A-B-0": { x: 245, y: 175 },
    "A-B-1": { x: 270, y: 165 },
    "A-C-0": { x: 320, y: 175 },
    "A-C-1": { x: 360, y: 200 },
    "A-D-0": { x: 410, y: 65 },
    "B-D-0": { x: 510, y: 270 },
    "C-D-0": { x: 595, y: 175 },
  };

  return (
    <svg
      viewBox="0 0 800 480"
      className="block h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="kb-vert-shared" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.9" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="kb-vert-odd" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.signal.cyan} stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.signal.cyan} stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* Edges */}
      {edges.map((e) => {
        const removed = removedEdges.has(e.key);
        return (
          <path
            key={e.key}
            d={e.d}
            stroke={removed ? MUTED : AMBER}
            strokeWidth="2.6"
            fill="none"
            opacity={removed ? 0.4 : 0.85}
            strokeDasharray={removed ? "6 6" : undefined}
          />
        );
      })}

      {/* Destroyed badges */}
      {destroyedLabel &&
        edges
          .filter((e) => removedEdges.has(e.key))
          .map((e) => {
            const m = destroyedMidpoints[e.key];
            return (
              <g key={`badge-${e.key}`}>
                <rect
                  x={m.x - 50}
                  y={m.y - 14}
                  width="100"
                  height="20"
                  rx="6"
                  fill={palette.canvas.bgAlt}
                  stroke={MUTED}
                  strokeWidth="0.8"
                />
                <text
                  x={m.x}
                  y={m.y}
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  fill={MUTED}
                >
                  {destroyedLabel}
                </text>
              </g>
            );
          })}

      {/* Vertices */}
      {verts.map((v) => {
        const odd = highlightOdd.has(v.id);
        return (
          <g key={v.id}>
            <circle
              cx={v.x}
              cy={v.y}
              r="40"
              fill={odd ? "url(#kb-vert-odd)" : "url(#kb-vert-shared)"}
            />
            <circle
              cx={v.x}
              cy={v.y}
              r="22"
              fill={palette.canvas.bgAlt}
              stroke={odd ? palette.signal.cyan : AMBER}
              strokeWidth={odd ? "2" : "1.6"}
            />
            {odd && (
              // Small star/notch indicating this vertex is an Eulerian-path endpoint.
              <text
                x={v.x + 22}
                y={v.y - 22}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                fill={palette.signal.cyan}
              >
                ★
              </text>
            )}
            <text
              x={v.x}
              y={v.y + 6}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="20"
              fill={odd ? palette.signal.cyan : AMBER}
            >
              {v.id}
            </text>
            {!compact && (
              <text
                x={v.x}
                y={v.y + 60}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                fill={MUTED}
              >
                {degLabel} {degrees[v.id]} · {v.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Figure 3 helper — a single vertex with its incident edges, plus the
// "stuck" badge for the odd case.
function ParityPanel({ kind, title, note }: { kind: "even" | "odd"; title: string; note: string }) {
  const cx = 150;
  const cy = 140;
  // Even: 4 edges in two pairs (NW/SE, NE/SW) with arrows.
  // Odd: 3 edges (NW, NE, S). The S edge gets a "?" badge.
  const evenEdges = [
    { x: 30, y: 40, dir: "in" },
    { x: 270, y: 240, dir: "out" },
    { x: 270, y: 40, dir: "in" },
    { x: 30, y: 240, dir: "out" },
  ];
  const oddEdges = [
    { x: 40, y: 50 },
    { x: 260, y: 50 },
    { x: 150, y: 260 },
  ];
  return (
    <svg viewBox="0 0 300 300" className="block h-auto w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker
          id={`arr-${kind}`}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={AMBER} />
        </marker>
      </defs>

      {/* Panel title */}
      <text
        x="150"
        y="22"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="12"
        fill={AMBER}
      >
        {title}
      </text>

      {kind === "even"
        ? evenEdges.map((e, i) => {
            // Draw arrow from in-edge to center, and from center to out-edge.
            const from = e.dir === "in" ? { x: e.x, y: e.y } : { x: cx, y: cy };
            const to = e.dir === "in" ? { x: cx, y: cy } : { x: e.x, y: e.y };
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={AMBER}
                strokeWidth="2"
                markerEnd={`url(#arr-${kind})`}
                opacity="0.85"
              />
            );
          })
        : oddEdges.map((e, i) => (
            <line
              key={i}
              x1={e.x}
              y1={e.y}
              x2={cx}
              y2={cy}
              stroke={i === 2 ? MUTED : AMBER}
              strokeWidth="2"
              strokeDasharray={i === 2 ? "5 4" : undefined}
              opacity={i === 2 ? 0.7 : 0.85}
            />
          ))}

      {/* Center vertex */}
      <circle cx={cx} cy={cy} r="22" fill={palette.canvas.bgAlt} stroke={AMBER} strokeWidth="1.6" />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="14"
        fill={AMBER}
      >
        {kind === "even" ? "4" : "3"}
      </text>

      {/* Odd "stuck" badge near the leftover edge endpoint */}
      {kind === "odd" && (
        <g>
          <circle cx="150" cy="265" r="12" fill={palette.canvas.bgAlt} stroke={MUTED} strokeWidth="1" />
          <text
            x="150"
            y="270"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="14"
            fill={MUTED}
          >
            ?
          </text>
        </g>
      )}

      {/* Footnote */}
      <text
        x="150"
        y="295"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        fill={MUTED}
      >
        {note}
      </text>
    </svg>
  );
}

// Common figure wrapper to match StoryCard typography.
function FigureFrame({
  pretitle,
  heading,
  aria,
  children,
  caption,
}: {
  pretitle: string;
  heading: string;
  aria: string;
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <Reveal>
      <figure className="glass hairline space-y-5 rounded-2xl border p-8 md:p-10">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
          {pretitle}
        </div>
        <h2 className="math-italic text-2xl leading-tight md:text-3xl">{heading}</h2>
        <div
          className="hairline overflow-hidden rounded-xl border bg-ink-950/60"
          role="img"
          aria-label={aria}
        >
          {children}
        </div>
        <figcaption className="text-sm leading-relaxed text-ink-200">{caption}</figcaption>
      </figure>
    </Reveal>
  );
}

export default function KonigsbergStoryPage() {
  const { locale, s } = useI18n();
  const fig = FIGURE[locale];
  const page = s.pages.konigsberg;
  const [sec0, sec1, sec2, sec3] = page.sections;

  // Original Königsberg degrees from the AbstractGraph wiring.
  const originalDegrees = { A: 5, B: 3, C: 3, D: 3 } as const;
  // WWII removal: one A-B bridge (Krämerbrücke) and one A-C bridge
  // (Grüne Brücke). After removal: A 5-2=3, B 3-1=2, C 3-1=2, D 3.
  // Odd-degree vertices: {A, D} — exactly two, so an Eulerian path is
  // possible from A to D. This matches the story text and gives the
  // "exactly two odd vertices" property an Eulerian path requires.
  const removed = new Set<EdgeKey>(["A-B-0", "A-C-0"]);
  const postDegrees = { A: 3, B: 2, C: 2, D: 3 } as const;
  const oddVerts = new Set<string>(["A", "D"]);

  return (
    <StoryPageShell
      page={page}
      ctaHref="/konigsberg/explorer"
      accent={ACCENT}
      borderAccent="border-signal-teal/70"
      bgAccent="bg-signal-teal/10"
      hoverAccent="hover:bg-signal-teal/20"
      gradient="from-signal-teal/10"
      formulaBadge="Eulerian path ⇔ ≤ 2 odd-degree vertices"
      formulaLatex={
        "\\text{Eulerian path} \\;\\Leftrightarrow\\; \\#\\{v: \\deg(v) \\text{ odd}\\} \\leq 2"
      }
      finalLabel="Try the walk."
    >
      <section className="mx-auto mt-16 max-w-5xl space-y-8">
        {/* Step 1 — the puzzle */}
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <FigureFrame
          pretitle={fig.fig1.pretitle}
          heading={fig.fig1.heading}
          aria={fig.fig1.aria}
          caption={fig.fig1.caption}
        >
          <CityMap northLabel={fig.fig1.northBank} southLabel={fig.fig1.southBank} />
        </FigureFrame>

        {/* Step 2 — Euler's reduction (city → graph) */}
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <FigureFrame
          pretitle={fig.fig2.pretitle}
          heading={fig.fig2.heading}
          aria={fig.fig2.aria}
          caption={fig.fig2.caption}
        >
          <div className="grid grid-cols-1 items-center gap-4 p-4 md:grid-cols-[1fr_auto_1fr] md:gap-2">
            <div className="space-y-2">
              <div
                className={`text-center font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
              >
                {fig.fig2.cityLabel}
              </div>
              <CityMap
                northLabel={fig.fig1.northBank}
                southLabel={fig.fig1.southBank}
                compact
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-2 md:px-4">
              <div className="text-2xl text-ink-200 md:text-3xl">→</div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {fig.fig2.becomes}
              </div>
            </div>
            <div className="space-y-2">
              <div
                className={`text-center font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
              >
                {fig.fig2.graphLabel}
              </div>
              <AbstractGraph degLabel={fig.shared.deg} degrees={originalDegrees} compact />
            </div>
          </div>
        </FigureFrame>

        {/* Step 3 — parity argument */}
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <FigureFrame
          pretitle={fig.fig3.pretitle}
          heading={fig.fig3.heading}
          aria={fig.fig3.aria}
          caption={fig.fig3.caption}
        >
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <ParityPanel kind="even" title={fig.fig3.evenTitle} note={fig.fig3.evenNote} />
            <ParityPanel kind="odd" title={fig.fig3.oddTitle} note={fig.fig3.oddNote} />
          </div>
        </FigureFrame>

        {/* The full original-degrees abstract graph — kept as the "summary"
            visual that bridges Step 3 and Step 4. Wording reused from the
            original page (shared.*) so we don't lose that text. */}
        <FigureFrame
          pretitle={fig.shared.pretitle}
          heading={fig.shared.heading}
          aria={fig.shared.aria}
          caption={fig.shared.caption}
        >
          <AbstractGraph degLabel={fig.shared.deg} degrees={originalDegrees} />
          <div className="px-4 pb-3 text-center">
            <span
              className="font-mono text-[11px] text-ink-400"
              aria-hidden="true"
            >
              A-B: 2 · A-C: 2 · A-D: 1 · B-D: 1 · C-D: 1 — {fig.shared.legendNote}
            </span>
          </div>
        </FigureFrame>

        {/* Step 4 — birth of graph theory + Königsberg today */}
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
        <FigureFrame
          pretitle={fig.fig4.pretitle}
          heading={fig.fig4.heading}
          aria={fig.fig4.aria}
          caption={fig.fig4.caption}
        >
          <AbstractGraph
            degLabel={fig.shared.deg}
            degrees={postDegrees}
            removedEdges={removed}
            highlightOdd={oddVerts}
            destroyedLabel={fig.fig4.destroyed}
          />
        </FigureFrame>
      </section>
    </StoryPageShell>
  );
}
