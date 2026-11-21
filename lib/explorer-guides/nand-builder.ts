import type { ExplorerGuide } from "./types";

// Gate wirings and NAND counts quoted here match the GATES table in
// app/nand/builder/page.tsx; update both together.
const NAND_EXCERPT = `XOR: {
  formula: "(a ↑ (a ↑ b)) ↑ (b ↑ (a ↑ b))",
  eval: (a, b) => (a !== b ? 1 : 0),
  wires: [
    { name: "n0", left: "a",  right: "b"  },
    { name: "n1", left: "a",  right: "n0" },
    { name: "n2", left: "b",  right: "n0" },
    { name: "n3", left: "n1", right: "n2" },
  ],
},

// Every wire is a NAND of two earlier signals
for (const w of wires) {
  vals[w.name] = vals[w.left] && vals[w.right] ? 0 : 1;
}`;

const NAND_FORMULA =
  "\\neg a = a \\uparrow a, \\quad a \\land b = (a \\uparrow b) \\uparrow (a \\uparrow b), \\quad a \\lor b = (a \\uparrow a) \\uparrow (b \\uparrow b)";

export const NAND_BUILDER_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Build NOT, AND, OR and XOR from NAND gates alone, flip the inputs and watch every internal wire. See why NAND is functionally complete and how XOR needs four.",
    heading: "How this builder works",
    intro:
      "Every gate on this page is made of one single kind of part: the NAND gate. It outputs 0 only when both of its inputs are 1, and 1 in every other case. That sounds too modest to be useful, yet any Boolean function at all can be wired from NAND gates and nothing else. The builder shows five gates built this way, lets you flip the two inputs, and displays the value on every internal wire, so you can follow the signal through the circuit instead of taking the truth table on trust.",
    sections: [
      {
        heading: "Why one gate is enough",
        paragraphs: [
          "A set of logic gates is called functionally complete when every Boolean function can be expressed with it. AND, OR and NOT together are complete, because any truth table can be written as an OR of AND terms, one term per row that outputs 1. So it is enough to show that NAND can imitate those three. That is exactly the chain this builder walks through: NOT first, then AND, then OR.",
          "The arrow ↑ is a common notation for NAND. Wire both inputs of one NAND to the same signal and you get NOT, because a ↑ a is 0 exactly when a is 1. Put a NOT behind a NAND and the double negation leaves AND. OR uses De Morgan's law: a or b is the same as not (not a and not b), which is a NAND of the two inverted inputs.",
        ],
        formula:
          "\\neg a = a \\uparrow a, \\quad a \\land b = (a \\uparrow b) \\uparrow (a \\uparrow b), \\quad a \\lor b = (a \\uparrow a) \\uparrow (b \\uparrow b)",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The panel on the right lists the five gates with their NAND counts: NAND itself (1), NOT (1), AND (2), OR (3) and XOR (4). Pick one, and the header shows its formula written purely with ↑. The two large circles labelled a and b are the inputs; click or tap them to toggle between 0 and 1. Both start at 0. The output circle below lights up in the gate's colour when the result is 1.",
          "For every gate with more than one NAND, a box titled Internal NANDs lists each intermediate wire, for example n0 = a ↑ b, together with its current value. The truth table in the sidebar shows all four input combinations for the selected gate and highlights the row that matches your current inputs. NOT ignores input b completely, which the table makes visible: its two halves are identical.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Each gate is a small data record. Besides the label and colour it carries a list of wires, and each wire is a NAND whose two inputs refer by name to a, b or an earlier wire. Evaluation is a single pass in order: start with the values of a and b, compute each wire as a NAND of two values already known, and read the output from the last wire. Because wires may only refer backwards, the circuit can never contain a loop, and one pass is always enough.",
          "The truth table is deliberately computed another way. Every gate also has a direct formula such as a !== b for XOR, and the table is filled from that formula, while the output circle and the internal wires come from the NAND wiring. If the wiring were wrong, the highlighted table row and the output circle would disagree. There is no animation and no canvas here, only React state and plain markup, so the page works the same with reduced motion; the colour fades are ordinary CSS transitions that the site shortens globally when your system asks for less motion.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Inside the XOR",
        paragraphs: [
          "XOR is the most interesting circuit on the list. A naive construction from the formula (a and not b) or (b and not a) would cost far more than four NANDs. The trick is that the first NAND, n0 = a ↑ b, is shared. n1 = a ↑ n0 is 0 only when a is 1 and b is 0, n2 = b ↑ n0 is 0 only when b is 1 and a is 0, and the final NAND of the two outputs 1 exactly when one of them is 0. Four gates is the minimum for XOR from two-input NANDs.",
          "That shared n0 matters in practice too. It is the inverted AND of the two inputs, so adding one more NAND as an inverter gives a ∧ b. XOR delivers the sum bit and AND the carry bit of a half adder, the circuit that adds two single bits, and with the shared wire the whole half adder needs only five NAND gates.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch De Morgan at work",
        text: "Select OR and set both inputs to 0. n0 and n1 (the two inverted inputs) are both 1, so the final NAND gives 0. Flip either input to 1 and one inversion drops to 0, which is enough to make the output 1.",
      },
      {
        title: "Catch the XOR canceling out",
        text: "Select XOR and set a = 1, b = 1. n0 drops to 0, which forces both n1 and n2 to 1, and the last NAND outputs 0. Now set b back to 0 and see n1 become the only wire that changes to 0.",
      },
      {
        title: "Spot the double negation",
        text: "Select AND and step through all four input rows. n1 is always the opposite of n0: the second NAND is nothing but a NOT gate with both inputs tied to n0.",
      },
      {
        title: "Count the cost",
        text: "Compare the NAND counts in the list: 1, 1, 2, 3, 4. Then ask yourself how many NANDs a NOR gate would need. NOR is just OR followed by NOT, so four is enough.",
      },
    ],
  },
  de: {
    metaDescription:
      "NOT, AND, OR und XOR nur aus NAND-Gattern bauen, Eingänge umschalten, jede Leitung verfolgen und sehen, warum NAND funktional vollständig ist.",
    heading: "So funktioniert dieser Baukasten",
    intro:
      "Jedes Gatter auf dieser Seite besteht aus einer einzigen Art von Bauteil: dem NAND-Gatter. Es gibt nur dann 0 aus, wenn beide Eingänge 1 sind, und in jedem anderen Fall 1. Das klingt zu bescheiden, um nützlich zu sein, und trotzdem lässt sich jede beliebige boolesche Funktion allein aus NAND-Gattern verdrahten. Der Baukasten zeigt fünf so gebaute Gatter, du kannst die beiden Eingänge umschalten und siehst den Wert auf jeder internen Leitung. So verfolgst du das Signal durch die Schaltung, statt der Wahrheitstabelle einfach zu glauben.",
    sections: [
      {
        heading: "Warum ein Gatter genügt",
        paragraphs: [
          "Eine Menge von Logikgattern heißt funktional vollständig, wenn sich damit jede boolesche Funktion ausdrücken lässt. AND, OR und NOT zusammen sind vollständig, denn jede Wahrheitstabelle lässt sich als OR von AND-Termen schreiben, ein Term pro Zeile mit Ausgabe 1. Es reicht also zu zeigen, dass NAND diese drei nachbauen kann. Genau diese Kette geht der Baukasten durch: erst NOT, dann AND, dann OR.",
          "Der Pfeil ↑ ist eine gängige Schreibweise für NAND. Legst du beide Eingänge eines NAND auf dasselbe Signal, bekommst du NOT, denn a ↑ a ist genau dann 0, wenn a gleich 1 ist. Setzt du ein NOT hinter ein NAND, bleibt nach der doppelten Verneinung AND übrig. OR nutzt das Gesetz von De Morgan: a oder b ist dasselbe wie nicht (nicht a und nicht b), also ein NAND der beiden invertierten Eingänge.",
        ],
        formula:
          "\\neg a = a \\uparrow a, \\quad a \\land b = (a \\uparrow b) \\uparrow (a \\uparrow b), \\quad a \\lor b = (a \\uparrow a) \\uparrow (b \\uparrow b)",
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "Die Leiste rechts listet die fünf Gatter mit ihrer NAND-Zahl: NAND selbst (1), NOT (1), AND (2), OR (3) und XOR (4). Wählst du eines aus, zeigt die Kopfzeile seine Formel, geschrieben nur mit ↑. Die beiden großen Kreise a und b sind die Eingänge, ein Klick oder Tipp schaltet sie zwischen 0 und 1 um. Beide starten bei 0. Der Ausgangskreis darunter leuchtet in der Farbe des Gatters, wenn das Ergebnis 1 ist.",
          "Bei jedem Gatter mit mehr als einem NAND listet ein Kasten «Interne NANDs» jede Zwischenleitung auf, zum Beispiel n0 = a ↑ b, zusammen mit ihrem aktuellen Wert. Die Wahrheitstabelle in der Seitenleiste zeigt alle vier Eingabekombinationen für das gewählte Gatter und hebt die Zeile hervor, die zu deinen aktuellen Eingängen passt. NOT ignoriert den Eingang b vollständig, und die Tabelle macht das sichtbar: Ihre beiden Hälften sind gleich.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Jedes Gatter ist ein kleiner Datensatz. Neben Bezeichnung und Farbe enthält er eine Liste von Leitungen, und jede Leitung ist ein NAND, dessen zwei Eingänge per Namen auf a, b oder eine frühere Leitung verweisen. Ausgewertet wird in einem einzigen Durchlauf der Reihe nach: Mit den Werten von a und b beginnen, jede Leitung als NAND zweier schon bekannter Werte berechnen und den Ausgang an der letzten Leitung ablesen. Weil Leitungen nur nach hinten verweisen dürfen, kann die Schaltung nie eine Schleife enthalten, und ein Durchlauf reicht immer.",
          "Die Wahrheitstabelle wird absichtlich auf anderem Weg berechnet. Jedes Gatter hat zusätzlich eine direkte Formel, etwa a !== b für XOR, und daraus wird die Tabelle gefüllt, während Ausgangskreis und interne Leitungen aus der NAND-Verdrahtung stammen. Wäre die Verdrahtung falsch, würden die hervorgehobene Tabellenzeile und der Ausgangskreis einander widersprechen. Es gibt hier keine Animation und kein Canvas, nur React-State und schlichtes Markup, die Seite verhält sich bei reduzierter Bewegung also genauso. Die Farbübergänge sind gewöhnliche CSS-Transitions, die die Seite global verkürzt, wenn dein System weniger Bewegung wünscht.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Ein Blick ins XOR",
        paragraphs: [
          "XOR ist die spannendste Schaltung der Liste. Ein naiver Aufbau nach der Formel (a und nicht b) oder (b und nicht a) würde deutlich mehr als vier NANDs kosten. Der Trick: Das erste NAND, n0 = a ↑ b, wird geteilt. n1 = a ↑ n0 ist nur dann 0, wenn a gleich 1 und b gleich 0 ist, n2 = b ↑ n0 nur dann, wenn b gleich 1 und a gleich 0 ist, und das letzte NAND gibt genau dann 1 aus, wenn eines der beiden 0 ist. Vier Gatter sind das Minimum für XOR aus NANDs mit zwei Eingängen.",
          "Das geteilte n0 zählt auch in der Praxis. Es ist das negierte AND der beiden Eingänge, mit einem weiteren NAND als Inverter erhältst du also a ∧ b. XOR liefert das Summenbit und AND das Übertragsbit eines Halbaddierers, der Schaltung, die zwei einzelne Bits addiert. Dank der geteilten Leitung braucht der ganze Halbaddierer nur fünf NAND-Gatter.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "De Morgan bei der Arbeit",
        text: "Wähl OR und setz beide Eingänge auf 0. n0 und n1 (die beiden invertierten Eingänge) sind beide 1, also liefert das letzte NAND 0. Schalte einen der Eingänge auf 1, und eine Inversion fällt auf 0. Das reicht schon für Ausgang 1.",
      },
      {
        title: "Das XOR hebt sich auf",
        text: "Wähl XOR und setz a = 1, b = 1. n0 fällt auf 0, das zwingt n1 und n2 auf 1, und das letzte NAND gibt 0 aus. Stell b dann wieder auf 0 und sieh zu, wie n1 als einzige Leitung auf 0 wechselt.",
      },
      {
        title: "Die doppelte Verneinung entdecken",
        text: "Wähl AND und geh alle vier Eingabezeilen durch. n1 ist immer das Gegenteil von n0: Das zweite NAND ist nichts anderes als ein NOT-Gatter, dessen beide Eingänge an n0 hängen.",
      },
      {
        title: "Die Kosten zählen",
        text: "Vergleich die NAND-Zahlen in der Liste: 1, 1, 2, 3, 4. Überleg dann, wie viele NANDs ein NOR-Gatter bräuchte. NOR ist einfach OR mit einem NOT dahinter, vier reichen also.",
      },
    ],
  },
  es: {
    metaDescription:
      "Construye NOT, AND, OR y XOR solo con puertas NAND, cambia las entradas y sigue cada cable interno. Descubre por qué NAND es funcionalmente completo.",
    heading: "Cómo funciona este constructor",
    intro:
      "Todas las puertas de esta página están hechas de un único tipo de pieza: la puerta NAND. Da 0 solo cuando sus dos entradas valen 1, y 1 en cualquier otro caso. Suena demasiado modesto para ser útil y, sin embargo, cualquier función booleana se puede cablear con puertas NAND y nada más. El constructor muestra cinco puertas hechas así, te deja cambiar las dos entradas y enseña el valor de cada cable interno, para que sigas la señal a través del circuito en lugar de fiarte sin más de la tabla de verdad.",
    sections: [
      {
        heading: "Por qué basta con una puerta",
        paragraphs: [
          "Un conjunto de puertas lógicas se llama funcionalmente completo cuando toda función booleana puede expresarse con él. AND, OR y NOT juntos son completos, porque cualquier tabla de verdad puede escribirse como un OR de términos AND, un término por cada fila cuya salida es 1. Así que basta con mostrar que NAND puede imitar a esos tres. Esa es exactamente la cadena que recorre este constructor: primero NOT, luego AND, luego OR.",
          "La flecha ↑ es una notación habitual para NAND. Conecta las dos entradas de un NAND a la misma señal y obtienes NOT, porque a ↑ a vale 0 exactamente cuando a vale 1. Pon un NOT detrás de un NAND y la doble negación deja AND. OR utiliza la ley de De Morgan: a o b es lo mismo que no (no a y no b), es decir, un NAND de las dos entradas invertidas.",
        ],
        formula: NAND_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "El panel de la derecha enumera las cinco puertas con su número de NAND: el propio NAND (1), NOT (1), AND (2), OR (3) y XOR (4). Elige una y la cabecera mostrará su fórmula escrita únicamente con ↑. Los dos círculos grandes etiquetados a y b son las entradas; haz clic o tócalos para alternar entre 0 y 1. Ambas empiezan en 0. El círculo de salida de debajo se ilumina con el color de la puerta cuando el resultado es 1.",
          "Para cada puerta con más de un NAND, un recuadro titulado «NAND internos» enumera cada cable intermedio, por ejemplo n0 = a ↑ b, junto con su valor actual. La tabla de verdad de la barra lateral muestra las cuatro combinaciones de entrada de la puerta seleccionada y resalta la fila que corresponde a tus entradas actuales. NOT ignora por completo la entrada b, y la tabla lo hace visible: sus dos mitades son idénticas.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Cada puerta es un pequeño registro de datos. Además de la etiqueta y el color, lleva una lista de cables, y cada cable es un NAND cuyas dos entradas remiten por nombre a a, a b o a un cable anterior. La evaluación es una sola pasada en orden: se empieza con los valores de a y b, se calcula cada cable como el NAND de dos valores ya conocidos y se lee la salida en el último cable. Como los cables solo pueden remitir hacia atrás, el circuito nunca puede contener un bucle, y una pasada siempre basta.",
          "La tabla de verdad se calcula deliberadamente por otra vía. Cada puerta tiene además una fórmula directa, como a !== b para XOR, y la tabla se rellena con esa fórmula, mientras que el círculo de salida y los cables internos salen del cableado NAND. Si el cableado estuviera mal, la fila resaltada de la tabla y el círculo de salida no coincidirían. Aquí no hay animación ni lienzo, solo estado de React y marcado sencillo, así que la página funciona igual con movimiento reducido; los fundidos de color son transiciones CSS corrientes que el sitio acorta globalmente cuando tu sistema pide menos movimiento.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "El interior del XOR",
        paragraphs: [
          "XOR es el circuito más interesante de la lista. Una construcción ingenua a partir de la fórmula (a y no b) o (b y no a) costaría bastante más de cuatro NAND. El truco está en que el primer NAND, n0 = a ↑ b, se comparte. n1 = a ↑ n0 vale 0 solo cuando a es 1 y b es 0, n2 = b ↑ n0 vale 0 solo cuando b es 1 y a es 0, y el NAND final de ambos da 1 exactamente cuando uno de ellos vale 0. Cuatro puertas es el mínimo para XOR a partir de NAND de dos entradas.",
          "Ese n0 compartido también importa en la práctica. Es el AND invertido de las dos entradas, así que añadir un NAND más como inversor da a ∧ b. XOR entrega el bit de suma y AND el bit de acarreo de un semisumador, el circuito que suma dos bits individuales, y con el cable compartido el semisumador completo solo necesita cinco puertas NAND.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira a De Morgan en acción",
        text: "Selecciona OR y pon las dos entradas a 0. n0 y n1 (las dos entradas invertidas) valen 1, así que el NAND final da 0. Cambia cualquiera de las entradas a 1 y una inversión cae a 0, lo que basta para que la salida sea 1.",
      },
      {
        title: "Sorprende al XOR anulándose",
        text: "Selecciona XOR y pon a = 1, b = 1. n0 cae a 0, lo que obliga a n1 y a n2 a valer 1, y el último NAND da 0. Ahora vuelve a poner b a 0 y verás que n1 es el único cable que pasa a 0.",
      },
      {
        title: "Detecta la doble negación",
        text: "Selecciona AND y recorre las cuatro filas de entrada. n1 es siempre lo contrario de n0: el segundo NAND no es más que una puerta NOT con ambas entradas unidas a n0.",
      },
      {
        title: "Cuenta el coste",
        text: "Compara los números de NAND de la lista: 1, 1, 2, 3, 4. Luego pregúntate cuántos NAND necesitaría una puerta NOR. NOR es simplemente OR seguido de NOT, así que bastan cuatro.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Construis NOT, AND, OR et XOR uniquement avec des portes NAND, bascule les entrées et suis chaque fil interne. Vois pourquoi NAND est fonctionnellement complet.",
    heading: "Comment fonctionne ce constructeur",
    intro:
      "Chaque porte de cette page est faite d'un seul type de composant : la porte NAND. Elle ne renvoie 0 que lorsque ses deux entrées valent 1, et 1 dans tous les autres cas. Cela paraît trop modeste pour être utile, et pourtant n'importe quelle fonction booléenne peut être câblée avec des portes NAND et rien d'autre. Le constructeur montre cinq portes bâties ainsi, te laisse basculer les deux entrées et affiche la valeur de chaque fil interne : tu peux donc suivre le signal à travers le circuit au lieu de croire la table de vérité sur parole.",
    sections: [
      {
        heading: "Pourquoi une seule porte suffit",
        paragraphs: [
          "Un ensemble de portes logiques est dit fonctionnellement complet lorsque toute fonction booléenne peut s'exprimer avec lui. AND, OR et NOT forment ensemble un système complet, car toute table de vérité peut s'écrire comme un OR de termes AND, un terme par ligne dont la sortie vaut 1. Il suffit donc de montrer que NAND peut imiter ces trois portes. C'est exactement la chaîne que parcourt ce constructeur : d'abord NOT, puis AND, puis OR.",
          "La flèche ↑ est une notation courante pour NAND. Relie les deux entrées d'un NAND au même signal et tu obtiens NOT, car a ↑ a vaut 0 exactement quand a vaut 1. Place un NOT derrière un NAND et la double négation laisse AND. OR s'appuie sur la loi de De Morgan : a ou b équivaut à non (non a et non b), c'est-à-dire à un NAND des deux entrées inversées.",
        ],
        formula: NAND_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Le panneau de droite énumère les cinq portes avec leur nombre de NAND : NAND lui-même (1), NOT (1), AND (2), OR (3) et XOR (4). Choisis-en une, et l'en-tête affiche sa formule écrite uniquement avec ↑. Les deux grands cercles marqués a et b sont les entrées ; clique ou touche-les pour basculer entre 0 et 1. Les deux démarrent à 0. Le cercle de sortie, en dessous, s'allume dans la couleur de la porte lorsque le résultat vaut 1.",
          "Pour chaque porte comptant plus d'un NAND, un encadré intitulé « NAND internes » énumère chaque fil intermédiaire, par exemple n0 = a ↑ b, avec sa valeur actuelle. La table de vérité de la barre latérale montre les quatre combinaisons d'entrées de la porte sélectionnée et surligne la ligne qui correspond à tes entrées actuelles. NOT ignore complètement l'entrée b, ce que la table rend visible : ses deux moitiés sont identiques.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Chaque porte est un petit enregistrement de données. Outre le libellé et la couleur, il contient une liste de fils, et chaque fil est un NAND dont les deux entrées renvoient par leur nom à a, à b ou à un fil antérieur. L'évaluation se fait en une seule passe, dans l'ordre : on part des valeurs de a et de b, on calcule chaque fil comme le NAND de deux valeurs déjà connues, et on lit la sortie sur le dernier fil. Comme les fils ne peuvent renvoyer que vers l'arrière, le circuit ne peut jamais contenir de boucle, et une passe suffit toujours.",
          "La table de vérité est volontairement calculée d'une autre manière. Chaque porte possède aussi une formule directe, comme a !== b pour XOR, et la table est remplie à partir de cette formule, tandis que le cercle de sortie et les fils internes proviennent du câblage NAND. Si le câblage était faux, la ligne surlignée de la table et le cercle de sortie se contrediraient. Il n'y a ici ni animation ni canevas, seulement de l'état React et du balisage simple, de sorte que la page fonctionne de la même façon avec les animations réduites ; les fondus de couleur sont des transitions CSS ordinaires que le site raccourcit globalement lorsque ton système demande moins de mouvement.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "À l'intérieur du XOR",
        paragraphs: [
          "XOR est le circuit le plus intéressant de la liste. Une construction naïve à partir de la formule (a et non b) ou (b et non a) coûterait bien plus de quatre NAND. L'astuce, c'est que le premier NAND, n0 = a ↑ b, est partagé. n1 = a ↑ n0 ne vaut 0 que lorsque a vaut 1 et b vaut 0, n2 = b ↑ n0 ne vaut 0 que lorsque b vaut 1 et a vaut 0, et le NAND final des deux renvoie 1 exactement quand l'un d'eux vaut 0. Quatre portes, c'est le minimum pour un XOR à partir de NAND à deux entrées.",
          "Ce n0 partagé compte aussi en pratique. C'est le AND inversé des deux entrées, si bien qu'un NAND supplémentaire utilisé comme inverseur donne a ∧ b. XOR fournit le bit de somme et AND le bit de retenue d'un demi-additionneur, le circuit qui additionne deux bits, et grâce au fil partagé le demi-additionneur complet ne demande que cinq portes NAND.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde De Morgan à l'œuvre",
        text: "Sélectionne OR et mets les deux entrées à 0. n0 et n1 (les deux entrées inversées) valent tous deux 1, donc le NAND final donne 0. Passe l'une des entrées à 1 et une inversion tombe à 0, ce qui suffit pour que la sortie vaille 1.",
      },
      {
        title: "Surprends le XOR en train de s'annuler",
        text: "Sélectionne XOR et règle a = 1, b = 1. n0 tombe à 0, ce qui force n1 et n2 à 1, et le dernier NAND renvoie 0. Remets maintenant b à 0 et vois n1 devenir le seul fil qui passe à 0.",
      },
      {
        title: "Repère la double négation",
        text: "Sélectionne AND et parcours les quatre lignes d'entrées. n1 est toujours l'opposé de n0 : le second NAND n'est rien d'autre qu'une porte NOT dont les deux entrées sont reliées à n0.",
      },
      {
        title: "Compte le coût",
        text: "Compare les nombres de NAND de la liste : 1, 1, 2, 3, 4. Demande-toi ensuite combien de NAND il faudrait pour une porte NOR. NOR n'est qu'un OR suivi d'un NOT, donc quatre suffisent.",
      },
    ],
  },
  it: {
    metaDescription:
      "Costruisci NOT, AND, OR e XOR usando solo porte NAND, commuta gli ingressi e segui ogni filo interno. Scopri perché NAND è funzionalmente completo.",
    heading: "Come funziona questo costruttore",
    intro:
      "Ogni porta di questa pagina è fatta di un unico tipo di componente: la porta NAND. Dà 0 solo quando entrambi i suoi ingressi valgono 1, e 1 in tutti gli altri casi. Sembra troppo poco per essere utile, eppure qualsiasi funzione booleana si può cablare con porte NAND e nient'altro. Il costruttore mostra cinque porte realizzate così, ti lascia commutare i due ingressi e visualizza il valore su ogni filo interno, così puoi seguire il segnale attraverso il circuito invece di fidarti sulla parola della tabella di verità.",
    sections: [
      {
        heading: "Perché basta una sola porta",
        paragraphs: [
          "Un insieme di porte logiche si dice funzionalmente completo quando con esso si può esprimere ogni funzione booleana. AND, OR e NOT insieme sono completi, perché qualsiasi tabella di verità si può scrivere come un OR di termini AND, un termine per ogni riga con uscita 1. Basta quindi mostrare che NAND sa imitare queste tre porte. È esattamente la catena che questo costruttore percorre: prima NOT, poi AND, poi OR.",
          "La freccia ↑ è una notazione comune per NAND. Collega entrambi gli ingressi di un NAND allo stesso segnale e ottieni NOT, perché a ↑ a vale 0 esattamente quando a vale 1. Metti un NOT dietro un NAND e la doppia negazione lascia AND. OR sfrutta la legge di De Morgan: a o b equivale a non (non a e non b), cioè a un NAND dei due ingressi invertiti.",
        ],
        formula: NAND_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Il pannello a destra elenca le cinque porte con il rispettivo numero di NAND: il NAND stesso (1), NOT (1), AND (2), OR (3) e XOR (4). Scegline una e l'intestazione ne mostra la formula scritta soltanto con ↑. I due grandi cerchi etichettati a e b sono gli ingressi; fai clic o toccali per passare da 0 a 1 e viceversa. Entrambi partono da 0. Il cerchio di uscita, più in basso, si accende nel colore della porta quando il risultato è 1.",
          "Per ogni porta con più di un NAND, un riquadro intitolato «NAND interni» elenca ciascun filo intermedio, per esempio n0 = a ↑ b, insieme al suo valore attuale. La tabella di verità nella barra laterale mostra tutte e quattro le combinazioni di ingresso per la porta selezionata ed evidenzia la riga che corrisponde ai tuoi ingressi attuali. NOT ignora del tutto l'ingresso b, e la tabella lo rende visibile: le sue due metà sono identiche.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Ogni porta è un piccolo record di dati. Oltre all'etichetta e al colore contiene un elenco di fili, e ogni filo è un NAND i cui due ingressi rimandano per nome ad a, a b o a un filo precedente. La valutazione è un unico passaggio in ordine: si parte dai valori di a e b, si calcola ogni filo come NAND di due valori già noti e si legge l'uscita sull'ultimo filo. Poiché i fili possono rimandare solo all'indietro, il circuito non può mai contenere un ciclo, e un passaggio basta sempre.",
          "La tabella di verità è calcolata di proposito in un altro modo. Ogni porta ha anche una formula diretta, come a !== b per XOR, e la tabella viene riempita a partire da quella formula, mentre il cerchio di uscita e i fili interni derivano dal cablaggio NAND. Se il cablaggio fosse sbagliato, la riga evidenziata della tabella e il cerchio di uscita sarebbero in disaccordo. Qui non ci sono né animazioni né canvas, solo stato React e semplice markup, quindi la pagina funziona allo stesso modo con il movimento ridotto; le dissolvenze di colore sono normali transizioni CSS che il sito accorcia globalmente quando il tuo sistema chiede meno movimento.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Dentro lo XOR",
        paragraphs: [
          "XOR è il circuito più interessante dell'elenco. Una costruzione ingenua a partire dalla formula (a e non b) o (b e non a) costerebbe ben più di quattro NAND. Il trucco è che il primo NAND, n0 = a ↑ b, è condiviso. n1 = a ↑ n0 vale 0 solo quando a è 1 e b è 0, n2 = b ↑ n0 vale 0 solo quando b è 1 e a è 0, e il NAND finale dei due dà 1 esattamente quando uno di essi vale 0. Quattro porte sono il minimo per uno XOR realizzato con NAND a due ingressi.",
          "Quel n0 condiviso conta anche nella pratica. È l'AND invertito dei due ingressi, quindi aggiungendo un altro NAND come invertitore si ottiene a ∧ b. XOR fornisce il bit di somma e AND il bit di riporto di un semisommatore, il circuito che somma due singoli bit, e grazie al filo condiviso l'intero semisommatore richiede soltanto cinque porte NAND.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda De Morgan all'opera",
        text: "Seleziona OR e porta entrambi gli ingressi a 0. n0 e n1 (i due ingressi invertiti) valgono entrambi 1, quindi il NAND finale dà 0. Porta a 1 uno qualsiasi degli ingressi e un'inversione scende a 0, il che basta a rendere l'uscita 1.",
      },
      {
        title: "Cogli lo XOR mentre si annulla",
        text: "Seleziona XOR e imposta a = 1, b = 1. n0 scende a 0, il che forza n1 e n2 a 1, e l'ultimo NAND dà 0. Ora riporta b a 0 e osserva n1 diventare l'unico filo che passa a 0.",
      },
      {
        title: "Individua la doppia negazione",
        text: "Seleziona AND e passa in rassegna tutte e quattro le righe di ingresso. n1 è sempre l'opposto di n0: il secondo NAND non è altro che una porta NOT con entrambi gli ingressi collegati a n0.",
      },
      {
        title: "Conta il costo",
        text: "Confronta i numeri di NAND nell'elenco: 1, 1, 2, 3, 4. Poi chiediti quanti NAND servirebbero per una porta NOR. NOR è semplicemente OR seguito da NOT, quindi ne bastano quattro.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Constrói NOT, AND, OR e XOR apenas com portas NAND, comuta as entradas e segue cada fio interno. Descobre porque é que o NAND é funcionalmente completo.",
    heading: "Como funciona este construtor",
    intro:
      "Todas as portas desta página são feitas de um único tipo de peça: a porta NAND. Dá 0 apenas quando as suas duas entradas valem 1, e 1 em todos os outros casos. Parece demasiado modesto para ser útil e, no entanto, qualquer função booleana pode ser ligada com portas NAND e nada mais. O construtor mostra cinco portas feitas assim, deixa-te comutar as duas entradas e apresenta o valor em cada fio interno, para que possas seguir o sinal pelo circuito em vez de aceitares a tabela de verdade de olhos fechados.",
    sections: [
      {
        heading: "Porque é que uma porta chega",
        paragraphs: [
          "Um conjunto de portas lógicas diz-se funcionalmente completo quando qualquer função booleana pode ser expressa com ele. AND, OR e NOT juntos são completos, porque qualquer tabela de verdade pode ser escrita como um OR de termos AND, um termo por cada linha com saída 1. Basta, portanto, mostrar que o NAND consegue imitar esses três. É exatamente essa a cadeia que este construtor percorre: primeiro NOT, depois AND, depois OR.",
          "A seta ↑ é uma notação comum para NAND. Liga as duas entradas de um NAND ao mesmo sinal e obténs NOT, porque a ↑ a vale 0 exatamente quando a vale 1. Põe um NOT atrás de um NAND e a dupla negação deixa AND. OR usa a lei de De Morgan: a ou b é o mesmo que não (não a e não b), ou seja, um NAND das duas entradas invertidas.",
        ],
        formula: NAND_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "O painel à direita lista as cinco portas com o respetivo número de NAND: o próprio NAND (1), NOT (1), AND (2), OR (3) e XOR (4). Escolhe uma e o cabeçalho mostra a sua fórmula escrita apenas com ↑. Os dois círculos grandes com as etiquetas a e b são as entradas; clica ou toca neles para alternar entre 0 e 1. Ambas começam em 0. O círculo de saída, por baixo, acende-se na cor da porta quando o resultado é 1.",
          "Para cada porta com mais de um NAND, uma caixa intitulada «NAND internos» lista cada fio intermédio, por exemplo n0 = a ↑ b, juntamente com o seu valor atual. A tabela de verdade na barra lateral mostra as quatro combinações de entrada da porta selecionada e destaca a linha que corresponde às tuas entradas atuais. NOT ignora por completo a entrada b, e a tabela torna isso visível: as suas duas metades são idênticas.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Cada porta é um pequeno registo de dados. Além da etiqueta e da cor, traz uma lista de fios, e cada fio é um NAND cujas duas entradas remetem pelo nome para a, para b ou para um fio anterior. A avaliação é uma única passagem por ordem: começa-se com os valores de a e b, calcula-se cada fio como o NAND de dois valores já conhecidos e lê-se a saída no último fio. Como os fios só podem remeter para trás, o circuito nunca pode conter um ciclo, e uma passagem chega sempre.",
          "A tabela de verdade é calculada de propósito por outro caminho. Cada porta tem também uma fórmula direta, como a !== b para XOR, e a tabela é preenchida a partir dessa fórmula, enquanto o círculo de saída e os fios internos vêm das ligações NAND. Se as ligações estivessem erradas, a linha destacada da tabela e o círculo de saída não concordariam. Não há aqui animação nem canvas, apenas estado React e marcação simples, pelo que a página funciona da mesma forma com movimento reduzido; os esbatimentos de cor são transições CSS normais que o site encurta globalmente quando o teu sistema pede menos movimento.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Dentro do XOR",
        paragraphs: [
          "XOR é o circuito mais interessante da lista. Uma construção ingénua a partir da fórmula (a e não b) ou (b e não a) custaria bem mais do que quatro NAND. O truque é que o primeiro NAND, n0 = a ↑ b, é partilhado. n1 = a ↑ n0 vale 0 apenas quando a é 1 e b é 0, n2 = b ↑ n0 vale 0 apenas quando b é 1 e a é 0, e o NAND final dos dois dá 1 exatamente quando um deles vale 0. Quatro portas é o mínimo para um XOR feito de NAND de duas entradas.",
          "Esse n0 partilhado também conta na prática. É o AND invertido das duas entradas, pelo que acrescentar mais um NAND como inversor dá a ∧ b. XOR fornece o bit de soma e AND o bit de transporte de um meio somador, o circuito que soma dois bits individuais, e com o fio partilhado o meio somador inteiro precisa apenas de cinco portas NAND.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê De Morgan em ação",
        text: "Seleciona OR e põe as duas entradas a 0. n0 e n1 (as duas entradas invertidas) valem ambos 1, por isso o NAND final dá 0. Muda qualquer uma das entradas para 1 e uma inversão cai para 0, o que chega para a saída ser 1.",
      },
      {
        title: "Apanha o XOR a anular-se",
        text: "Seleciona XOR e define a = 1, b = 1. n0 cai para 0, o que obriga n1 e n2 a valer 1, e o último NAND dá 0. Agora volta a pôr b a 0 e vê n1 tornar-se o único fio que passa a 0.",
      },
      {
        title: "Repara na dupla negação",
        text: "Seleciona AND e percorre as quatro linhas de entrada. n1 é sempre o oposto de n0: o segundo NAND não é mais do que uma porta NOT com ambas as entradas ligadas a n0.",
      },
      {
        title: "Conta o custo",
        text: "Compara os números de NAND na lista: 1, 1, 2, 3, 4. Depois pergunta-te quantos NAND seriam precisos para uma porta NOR. NOR é apenas OR seguido de NOT, por isso quatro chegam.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Bygg NOT, AND, OR och XOR av enbart NAND-grindar, växla ingångarna och följ varje intern ledning. Se varför NAND är funktionellt fullständig.",
    heading: "Så fungerar den här byggaren",
    intro:
      "Varje grind på den här sidan består av en enda sorts del: NAND-grinden. Den ger 0 bara när båda ingångarna är 1, och 1 i alla andra fall. Det låter för blygsamt för att vara användbart, och ändå kan vilken boolesk funktion som helst kopplas ihop av NAND-grindar och ingenting annat. Byggaren visar fem grindar som är byggda så, låter dig växla de två ingångarna och visar värdet på varje intern ledning, så att du kan följa signalen genom kretsen i stället för att bara lita på sanningstabellen.",
    sections: [
      {
        heading: "Varför en grind räcker",
        paragraphs: [
          "En uppsättning logiska grindar kallas funktionellt fullständig när varje boolesk funktion kan uttryckas med den. AND, OR och NOT är tillsammans fullständiga, eftersom varje sanningstabell kan skrivas som en OR av AND-termer, en term för varje rad som ger 1. Det räcker alltså att visa att NAND kan efterlikna de tre. Det är precis den kedjan som byggaren går igenom: först NOT, sedan AND, sedan OR.",
          "Pilen ↑ är ett vanligt skrivsätt för NAND. Koppla båda ingångarna på en NAND till samma signal, så får du NOT, eftersom a ↑ a är 0 precis när a är 1. Sätt en NOT efter en NAND, så lämnar den dubbla negationen kvar AND. OR använder De Morgans lag: a eller b är detsamma som inte (inte a och inte b), alltså en NAND av de två inverterade ingångarna.",
        ],
        formula: NAND_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Panelen till höger listar de fem grindarna med deras antal NAND: NAND själv (1), NOT (1), AND (2), OR (3) och XOR (4). Välj en, så visar rubrikraden dess formel skriven enbart med ↑. De två stora cirklarna märkta a och b är ingångarna; klicka eller tryck på dem för att växla mellan 0 och 1. Båda börjar på 0. Utgångscirkeln nedanför lyser i grindens färg när resultatet är 1.",
          "För varje grind med mer än en NAND listar en ruta med rubriken ”Interna NAND” varje mellanledning, till exempel n0 = a ↑ b, tillsammans med dess aktuella värde. Sanningstabellen i sidofältet visar alla fyra ingångskombinationer för den valda grinden och markerar raden som motsvarar dina nuvarande ingångar. NOT bortser helt från ingång b, och det gör tabellen synligt: dess två halvor är identiska.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Varje grind är en liten datapost. Förutom etikett och färg innehåller den en lista med ledningar, och varje ledning är en NAND vars två ingångar hänvisar med namn till a, b eller en tidigare ledning. Utvärderingen sker i ett enda pass i ordning: börja med värdena på a och b, beräkna varje ledning som en NAND av två redan kända värden och läs av utgången på den sista ledningen. Eftersom ledningar bara får hänvisa bakåt kan kretsen aldrig innehålla en slinga, och ett pass räcker alltid.",
          "Sanningstabellen beräknas med flit på ett annat sätt. Varje grind har också en direkt formel, till exempel a !== b för XOR, och tabellen fylls i utifrån den formeln, medan utgångscirkeln och de interna ledningarna kommer från NAND-kopplingen. Om kopplingen vore fel skulle den markerade tabellraden och utgångscirkeln säga emot varandra. Här finns ingen animation och ingen canvas, bara React-state och vanlig markup, så sidan fungerar likadant med minskad rörelse; färgtoningarna är vanliga CSS-övergångar som webbplatsen förkortar globalt när ditt system ber om mindre rörelse.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Inuti XOR",
        paragraphs: [
          "XOR är den mest intressanta kretsen i listan. En naiv konstruktion utifrån formeln (a och inte b) eller (b och inte a) skulle kosta betydligt mer än fyra NAND. Knepet är att den första NAND:en, n0 = a ↑ b, delas. n1 = a ↑ n0 är 0 bara när a är 1 och b är 0, n2 = b ↑ n0 är 0 bara när b är 1 och a är 0, och den sista NAND:en av de två ger 1 precis när en av dem är 0. Fyra grindar är minimum för XOR byggd av NAND med två ingångar.",
          "Det delade n0 spelar roll även i praktiken. Det är den inverterade AND:en av de två ingångarna, så med ytterligare en NAND som inverterare får du a ∧ b. XOR levererar summabiten och AND minnesbiten i en halvadderare, kretsen som adderar två enskilda bitar, och med den delade ledningen behöver hela halvadderaren bara fem NAND-grindar.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se De Morgan i arbete",
        text: "Välj OR och sätt båda ingångarna till 0. n0 och n1 (de två inverterade ingångarna) är båda 1, så den sista NAND:en ger 0. Växla någon av ingångarna till 1, så faller en inversion till 0, och det räcker för att utgången ska bli 1.",
      },
      {
        title: "Se hur XOR tar ut sig själv",
        text: "Välj XOR och sätt a = 1, b = 1. n0 faller till 0, vilket tvingar både n1 och n2 till 1, och den sista NAND:en ger 0. Sätt nu tillbaka b till 0 och se hur n1 blir den enda ledningen som växlar till 0.",
      },
      {
        title: "Upptäck den dubbla negationen",
        text: "Välj AND och stega igenom alla fyra ingångsraderna. n1 är alltid motsatsen till n0: den andra NAND:en är inget annat än en NOT-grind med båda ingångarna kopplade till n0.",
      },
      {
        title: "Räkna kostnaden",
        text: "Jämför antalen NAND i listan: 1, 1, 2, 3, 4. Fråga dig sedan hur många NAND en NOR-grind skulle behöva. NOR är bara OR följt av NOT, så fyra räcker.",
      },
    ],
  },
  no: {
    metaDescription:
      "Bygg NOT, AND, OR og XOR av bare NAND-porter, veksle inngangene og følg hver interne ledning. Se hvorfor NAND er funksjonelt komplett og XOR trenger fire.",
    heading: "Slik fungerer denne byggeren",
    intro:
      "Hver port på denne siden er laget av én eneste type del: NAND-porten. Den gir 0 bare når begge inngangene er 1, og 1 i alle andre tilfeller. Det høres for beskjedent ut til å være nyttig, og likevel kan enhver boolsk funksjon kobles sammen av NAND-porter og ingenting annet. Byggeren viser fem porter som er bygd slik, lar deg veksle de to inngangene og viser verdien på hver interne ledning, slik at du kan følge signalet gjennom kretsen i stedet for å ta sannhetstabellen for god fisk.",
    sections: [
      {
        heading: "Hvorfor én port er nok",
        paragraphs: [
          "Et sett med logiske porter kalles funksjonelt komplett når enhver boolsk funksjon kan uttrykkes med det. AND, OR og NOT er til sammen komplette, fordi enhver sannhetstabell kan skrives som en OR av AND-ledd, ett ledd for hver rad som gir 1. Det holder altså å vise at NAND kan etterligne de tre. Det er nettopp den kjeden byggeren går gjennom: først NOT, så AND, så OR.",
          "Pilen ↑ er en vanlig skrivemåte for NAND. Koble begge inngangene på en NAND til samme signal, og du får NOT, fordi a ↑ a er 0 nøyaktig når a er 1. Sett en NOT bak en NAND, og den doble negasjonen etterlater AND. OR bruker De Morgans lov: a eller b er det samme som ikke (ikke a og ikke b), altså en NAND av de to inverterte inngangene.",
        ],
        formula: NAND_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Panelet til høyre lister opp de fem portene med antall NAND: NAND selv (1), NOT (1), AND (2), OR (3) og XOR (4). Velg en, og overskriftsfeltet viser formelen dens skrevet utelukkende med ↑. De to store sirklene merket a og b er inngangene; klikk eller trykk på dem for å veksle mellom 0 og 1. Begge starter på 0. Utgangssirkelen nedenfor lyser i portens farge når resultatet er 1.",
          "For hver port med mer enn én NAND lister en boks med tittelen «Interne NAND» opp hver mellomledning, for eksempel n0 = a ↑ b, sammen med den gjeldende verdien. Sannhetstabellen i sidefeltet viser alle fire inngangskombinasjonene for den valgte porten og fremhever raden som svarer til inngangene dine akkurat nå. NOT overser inngang b fullstendig, og det gjør tabellen synlig: De to halvdelene er identiske.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hver port er en liten datapost. I tillegg til etikett og farge har den en liste med ledninger, og hver ledning er en NAND der de to inngangene viser med navn til a, b eller en tidligere ledning. Evalueringen er ett enkelt gjennomløp i rekkefølge: Start med verdiene til a og b, beregn hver ledning som en NAND av to verdier som allerede er kjent, og les av utgangen på den siste ledningen. Fordi ledninger bare kan vise bakover, kan kretsen aldri inneholde en sløyfe, og ett gjennomløp er alltid nok.",
          "Sannhetstabellen beregnes med vilje på en annen måte. Hver port har også en direkte formel, for eksempel a !== b for XOR, og tabellen fylles ut fra den formelen, mens utgangssirkelen og de interne ledningene kommer fra NAND-koblingen. Hvis koblingen var feil, ville den fremhevede tabellraden og utgangssirkelen motsi hverandre. Her finnes det ingen animasjon og ikke noe lerret, bare React-state og enkel markup, så siden fungerer likt med redusert bevegelse; fargeovergangene er vanlige CSS-overganger som nettstedet forkorter globalt når systemet ditt ber om mindre bevegelse.",
        ],
        code: NAND_EXCERPT,
      },
      {
        heading: "Inni XOR",
        paragraphs: [
          "XOR er den mest interessante kretsen på listen. En naiv konstruksjon ut fra formelen (a og ikke b) eller (b og ikke a) ville koste langt mer enn fire NAND. Trikset er at den første NAND-en, n0 = a ↑ b, deles. n1 = a ↑ n0 er 0 bare når a er 1 og b er 0, n2 = b ↑ n0 er 0 bare når b er 1 og a er 0, og den siste NAND-en av de to gir 1 nøyaktig når en av dem er 0. Fire porter er minimum for XOR bygd av NAND med to innganger.",
          "Den delte n0 betyr noe i praksis også. Den er den inverterte AND-en av de to inngangene, så med én NAND til som inverter får du a ∧ b. XOR leverer sumbiten og AND mentebiten i en halvadderer, kretsen som adderer to enkeltbiter, og med den delte ledningen trenger hele halvaddereren bare fem NAND-porter.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se De Morgan i arbeid",
        text: "Velg OR og sett begge inngangene til 0. n0 og n1 (de to inverterte inngangene) er begge 1, så den siste NAND-en gir 0. Veksle en av inngangene til 1, og én inversjon faller til 0, noe som er nok til at utgangen blir 1.",
      },
      {
        title: "Se XOR oppheve seg selv",
        text: "Velg XOR og sett a = 1, b = 1. n0 faller til 0, noe som tvinger både n1 og n2 til 1, og den siste NAND-en gir 0. Sett nå b tilbake til 0 og se at n1 blir den eneste ledningen som skifter til 0.",
      },
      {
        title: "Oppdag den doble negasjonen",
        text: "Velg AND og gå gjennom alle fire inngangsradene. n1 er alltid det motsatte av n0: Den andre NAND-en er ikke noe annet enn en NOT-port med begge inngangene koblet til n0.",
      },
      {
        title: "Tell kostnaden",
        text: "Sammenlign antallene NAND i listen: 1, 1, 2, 3, 4. Spør deg så hvor mange NAND en NOR-port ville trenge. NOR er bare OR etterfulgt av NOT, så fire er nok.",
      },
    ],
  },
};
