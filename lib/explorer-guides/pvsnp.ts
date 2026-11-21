import type { ExplorerGuide } from "./types";

// Numbers quoted here (n 3 to 12, m 3 to 50, seed 1 to 999, speed 1 to 60
// steps/s with default 8, the presets) match app/pvsnp/explorer/page.tsx;
// update both together.
const DPLL_EXCERPT = `const verdictNow = evalFormula(prev.formula, assign);
if (verdictNow === "sat") { /* every clause is true: done */ }
if (verdictNow === "unsat") return backtrack(/* ... */);

const unit = findUnit(prev.formula, assign); // one free literal left
if (unit !== null) { assign.set(Math.abs(unit), unit > 0); unitProps++; /* ... */ }

const pure = findPure(prev.formula, assign); // only one polarity left
if (pure !== null) { assign.set(Math.abs(pure), pure > 0); pureLits++; /* ... */ }

const branchVar = chooseBranchVar(prev.numVars, assign); // lowest free index
stack.push({ variable: branchVar, triedFirst: true, triedSecond: false,
             firstValue: true, snapshotAssign: cloneAssignSnapshot(assign) });
assign.set(branchVar, true);
branches++;`;

const PVSNP_FORMULA =
  "\\varphi = (x_1 \\lor x_2 \\lor x_3) \\land (\\lnot x_1 \\lor x_2 \\lor \\lnot x_3)";

export const PVSNP_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch a DPLL solver attack 3-SAT step by step, then check a solution in one pass. A hands-on look at P vs NP: why finding is hard and verifying is easy.",
    heading: "How this explorer works",
    intro:
      "The row of brackets at the top is a Boolean formula in conjunctive normal form: a list of clauses joined by AND, each clause an OR of a few literals such as x₁ or ¬x₃. The question is whether some choice of true and false for the variables makes every clause true at once. That question, called SAT, sits at the centre of the P versus NP problem. The explorer lets you feel both halves of it: in Solve mode a search algorithm hunts for an answer and draws its search tree, in Verify mode you hand it an answer and it simply checks it.",
    sections: [
      {
        heading: "Finding versus checking",
        paragraphs: [
          "NP is the class of yes-or-no problems where a yes answer comes with a certificate that can be checked quickly, meaning in time polynomial in the input size. For SAT the certificate is a satisfying assignment, and checking it means reading each clause once: linear in the size of the formula. P is the class of problems that can also be solved quickly, without being handed the certificate. Whether P equals NP is open, and it is one of the Clay Mathematics Institute's Millennium Prize Problems.",
          "SAT matters so much because it is NP-complete: every problem in NP can be translated into SAT efficiently. This was shown by Stephen Cook in 1971 and independently by Leonid Levin. A fast algorithm for SAT would therefore give a fast algorithm for every problem in NP. The variant used here, 3-SAT, restricts clauses to three literals and is still NP-complete.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Five presets load fixed instances. «Trivially SAT» is the two-clause formula above. «All 8 clauses on 3 vars» lists every possible three-literal clause over x₁, x₂, x₃, and since each assignment falsifies exactly one of them, the formula is unsatisfiable. «Phase-transition» is a random instance with 7 variables and 30 clauses, a ratio close to 4.26; this particular instance turns out to be unsatisfiable. «Pigeonhole» encodes the claim that 4 pigeons fit into 3 holes with no hole shared, using 12 variables and 22 clauses; it is false, so the formula is unsatisfiable. «Verify-only» loads a 4-variable formula together with a candidate assignment and switches to Verify mode.",
          "The random generator builds a 3-SAT formula from n variables (3 to 12, default 5), m clauses (3 to 50, default 20) and a seed (1 to 999). Each clause picks three distinct variables and negates each with probability one half, so the same seed always produces the same formula. The m / n readout tells you where you are relative to the phase transition.",
          "In Solve mode, Step advances the solver by exactly one action, Run repeats it at the chosen speed (1 to 60 steps per second, default 8) and Reset returns to the empty assignment. In Verify mode you click a variable to cycle it through T, F and unset; every clause lights up as satisfied, falsified or still open, and the verdict updates instantly.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "A clause is an array of signed integers: 3 means x₃, −3 means ¬x₃. The solver is a small version of the DPLL procedure (Davis, Putnam, Logemann and Loveland, 1962) written as an explicit stack instead of recursion, so it can pause after any single step. Each step does the first thing that applies: report SAT if every clause is satisfied, backtrack if some clause is falsified, apply unit propagation (a clause with all literals false except one unassigned literal forces that literal), apply pure-literal elimination (a variable that appears with only one sign in the remaining clauses can safely be set to make it true), and otherwise branch.",
          "Branching is deliberately naive: it takes the lowest-numbered unassigned variable and tries true first. Before branching it stores a snapshot of the assignment on the stack. On a conflict, backtracking restores the snapshot of the newest frame that still has an untried value and flips that variable to false; frames with both values tried are popped. When the stack is empty, every branch has failed and the verdict is UNSAT. Each step returns a fresh state object, which React renders as coloured clauses and an SVG tree where cyan nodes are open, grey nodes explored, rose nodes conflicts and the amber node the solution. Nothing moves unless you press Step or Run, so there is no motion to reduce.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Why 4.26 is special",
        paragraphs: [
          "For random 3-SAT a simple count already explains a lot. A random three-literal clause is false for exactly one of the eight combinations of its variables, so a fixed assignment satisfies it with probability 7/8. The expected number of satisfying assignments is therefore 2^n · (7/8)^m, which drops below one once m / n exceeds about 5.19. The true threshold is lower: experiments show that random formulas switch from almost always satisfiable to almost always unsatisfiable around m / n ≈ 4.26, and solvers like this one empirically need the most work near that ratio. Below it, solutions are plentiful and the first descent often succeeds. Far above it, contradictions surface after a few assignments.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "A no that takes the whole tree",
        text: "Load «Phase-transition» and press Run. This instance has no solution, so the solver cannot stop at a lucky guess: it has to refute every branch before it may answer UNSAT. Note the branch and conflict counters at the end. There is no assignment you could type into Verify mode to confirm that answer, and nobody knows a short certificate for unsatisfiability in general (that is the NP versus coNP question).",
      },
      {
        title: "Easy, hard, hopeless",
        text: "Generate three random formulas with n = 12: m = 20 (ratio 1.67), m = 50 (ratio 4.17) and then n = 5 with m = 50 (ratio 10). The first is almost certainly satisfiable and solved quickly, the second is near the threshold and can go either way, the third is very likely unsatisfiable and the tree fills up with rose conflict nodes.",
      },
      {
        title: "Watch the pigeons fight",
        text: "Load «Pigeonhole» and step slowly. The first branch puts pigeon 1 into hole 1, and over the next steps unit propagation forbids the three other pigeons from that hole. The solver has to try many placements before it can be sure that four pigeons never fit. For larger versions of this formula, any DPLL run is known to need exponentially many steps.",
      },
      {
        title: "Break a solution by hand",
        text: "Load «Verify-only». The candidate x₁ = T, x₂ = T, x₃ = F, x₄ = T satisfies all six clauses. Click x₃ twice (from F to unset, then to T) and watch clause c4 turn into a falsified clause: one flipped bit is enough to break the certificate.",
      },
    ],
  },
  de: {
    metaDescription:
      "Sieh einem DPLL-Solver zu, wie er 3-SAT löst, und prüfe eine Lösung in einem Durchgang. P vs NP zum Anfassen: Finden ist schwer, Prüfen leicht.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Reihe von Klammern oben ist eine aussagenlogische Formel in konjunktiver Normalform: eine Liste von Klauseln, verbunden durch UND, jede Klausel ein ODER aus wenigen Literalen wie x₁ oder ¬x₃. Die Frage ist, ob es eine Wahl von wahr und falsch für die Variablen gibt, die alle Klauseln gleichzeitig wahr macht. Diese Frage heißt SAT und steht im Zentrum des P-versus-NP-Problems. Der Explorer lässt dich beide Seiten spüren: Im Modus «Lösen» sucht ein Algorithmus nach einer Antwort und zeichnet seinen Suchbaum, im Modus «Verifizieren» gibst du ihm eine Antwort, und er kontrolliert sie nur.",
    sections: [
      {
        heading: "Finden gegen Prüfen",
        paragraphs: [
          "NP ist die Klasse der Ja-Nein-Probleme, bei denen eine Ja-Antwort mit einem Zertifikat kommt, das sich schnell prüfen lässt, also in polynomieller Zeit in der Eingabegröße. Bei SAT ist das Zertifikat eine erfüllende Belegung, und die Prüfung liest jede Klausel einmal: linear in der Größe der Formel. P ist die Klasse der Probleme, die sich auch ohne geschenktes Zertifikat schnell lösen lassen. Ob P gleich NP ist, ist offen, und die Frage gehört zu den Millennium-Problemen des Clay Mathematics Institute.",
          "SAT ist deshalb so wichtig, weil es NP-vollständig ist: Jedes Problem aus NP lässt sich effizient in SAT übersetzen. Das zeigte Stephen Cook 1971, unabhängig davon auch Leonid Levin. Ein schneller Algorithmus für SAT wäre also ein schneller Algorithmus für alles in NP. Die hier verwendete Variante 3-SAT beschränkt Klauseln auf drei Literale und ist immer noch NP-vollständig.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Fünf Presets laden feste Instanzen. «Trivial erfüllbar» ist die Formel mit zwei Klauseln oben. Das Preset mit allen 8 Klauseln über x₁, x₂, x₃ enthält jede mögliche Dreierklausel, und weil jede Belegung genau eine davon falsch macht, ist die Formel unerfüllbar. «Phasenübergang» ist eine zufällige Instanz mit 7 Variablen und 30 Klauseln, ein Verhältnis nahe 4,26; genau diese Instanz ist übrigens unerfüllbar. «Schubfach» kodiert die Behauptung, dass 4 Tauben in 3 Löcher passen, ohne dass sich zwei ein Loch teilen, mit 12 Variablen und 22 Klauseln; das ist falsch, die Formel also unerfüllbar. Das Preset «Nur verifizieren» lädt eine Formel mit 4 Variablen samt Kandidatenbelegung und schaltet in den Modus «Verifizieren».",
          "Der Zufallsgenerator baut eine 3-SAT-Formel aus n Variablen (3 bis 12, Standard 5), m Klauseln (3 bis 50, Standard 20) und einem Seed (1 bis 999). Jede Klausel wählt drei verschiedene Variablen und negiert jede mit Wahrscheinlichkeit einhalb, derselbe Seed liefert also immer dieselbe Formel. Die Anzeige m / n verrät dir, wo du relativ zum Phasenübergang stehst.",
          "Im Modus «Lösen» rückt «Schritt» den Solver um genau eine Aktion vor, «Lauf» wiederholt das im gewählten Tempo (1 bis 60 Schritte pro Sekunde, Standard 8), und «Zurücksetzen» kehrt zur leeren Belegung zurück. Im Modus «Verifizieren» klickst du eine Variable an, um sie durch T, F und unbelegt zu schalten; jede Klausel zeigt sofort, ob sie erfüllt, verletzt oder noch offen ist.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Eine Klausel ist ein Array ganzer Zahlen mit Vorzeichen: 3 bedeutet x₃, −3 bedeutet ¬x₃. Der Solver ist eine kleine Version des DPLL-Verfahrens (Davis, Putnam, Logemann und Loveland, 1962), geschrieben mit explizitem Stack statt Rekursion, damit er nach jedem einzelnen Schritt anhalten kann. Jeder Schritt tut das Erste, was zutrifft: SAT melden, wenn alle Klauseln erfüllt sind, zurücksetzen, wenn eine Klausel verletzt ist, Unit Propagation anwenden (eine Klausel, deren Literale alle falsch sind bis auf ein unbelegtes, erzwingt dieses Literal), Pure-Literal-Elimination anwenden (eine Variable, die in den offenen Klauseln nur mit einem Vorzeichen vorkommt, kann gefahrlos passend gesetzt werden), und sonst verzweigen.",
          "Das Verzweigen ist absichtlich schlicht: Es nimmt die unbelegte Variable mit der kleinsten Nummer und probiert zuerst wahr. Vorher legt es einen Schnappschuss der Belegung auf den Stack. Bei einem Konflikt stellt das Backtracking den Schnappschuss des jüngsten Frames wieder her, der noch einen unprobierten Wert hat, und setzt diese Variable auf falsch; Frames, bei denen beide Werte probiert sind, fliegen vom Stack. Ist der Stack leer, ist jeder Zweig gescheitert, und das Urteil lautet UNSAT. Jeder Schritt liefert ein frisches Zustandsobjekt, das React als eingefärbte Klauseln und als SVG-Baum darstellt: Cyan heißt offen, Grau erkundet, Rosa Konflikt, Bernstein Lösung. Ohne «Schritt» oder «Lauf» bewegt sich nichts, es gibt also auch keine Bewegung zu reduzieren.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Warum 4,26 besonders ist",
        paragraphs: [
          "Für zufälliges 3-SAT erklärt schon eine einfache Zählung viel. Eine zufällige Dreierklausel ist für genau eine der acht Kombinationen ihrer Variablen falsch, eine feste Belegung erfüllt sie also mit Wahrscheinlichkeit 7/8. Die erwartete Zahl erfüllender Belegungen ist damit 2^n · (7/8)^m und fällt unter eins, sobald m / n etwa 5,19 übersteigt. Die echte Schwelle liegt tiefer: Experimente zeigen, dass zufällige Formeln um m / n ≈ 4,26 von fast immer erfüllbar zu fast immer unerfüllbar kippen, und Solver wie dieser brauchen empirisch in der Nähe dieses Verhältnisses am meisten Arbeit. Darunter gibt es Lösungen im Überfluss, und oft klappt schon der erste Abstieg. Weit darüber zeigen sich Widersprüche nach wenigen Belegungen.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Ein Nein, das den ganzen Baum kostet",
        text: "Lade «Phasenübergang» und drück «Lauf». Diese Instanz hat keine Lösung, der Solver kann also nicht bei einem Glückstreffer aufhören: Er muss jeden Zweig widerlegen, bevor er UNSAT melden darf. Merk dir am Ende die Zähler für Verzweigungen und Konflikte. Es gibt keine Belegung, die du im Modus «Verifizieren» eintippen könntest, um diese Antwort zu bestätigen, und niemand kennt allgemein ein kurzes Zertifikat für Unerfüllbarkeit (das ist die Frage NP gegen coNP).",
      },
      {
        title: "Leicht, schwer, hoffnungslos",
        text: "Erzeuge drei Zufallsformeln mit n = 12: m = 20 (Verhältnis 1,67), m = 50 (Verhältnis 4,17) und dann n = 5 mit m = 50 (Verhältnis 10). Die erste ist fast sicher erfüllbar und schnell gelöst, die zweite liegt nahe der Schwelle und kann so oder so ausgehen, die dritte ist sehr wahrscheinlich unerfüllbar, und der Baum füllt sich mit rosa Konfliktknoten.",
      },
      {
        title: "Die Tauben streiten lassen",
        text: "Lade «Schubfach» und geh langsam Schritt für Schritt vor. Der erste Zweig setzt Taube 1 in Loch 1, und Unit Propagation verbietet den drei anderen Tauben in den nächsten Schritten dieses Loch. Der Solver muss viele Verteilungen durchprobieren, bevor feststeht, dass vier Tauben nie passen. Für größere Versionen dieser Formel braucht bekanntlich jeder DPLL-Lauf exponentiell viele Schritte.",
      },
      {
        title: "Eine Lösung von Hand zerbrechen",
        text: "Lade «Nur verifizieren». Die Kandidatin x₁ = T, x₂ = T, x₃ = F, x₄ = T erfüllt alle sechs Klauseln. Klick x₃ zweimal an (von F auf unbelegt, dann auf T), und sieh zu, wie Klausel c4 verletzt wird: Ein einziges gekipptes Bit reicht, um das Zertifikat zu zerstören.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mira cómo un solver DPLL ataca 3-SAT paso a paso y comprueba una solución de una pasada. P frente a NP en la práctica: encontrar es difícil, verificar es fácil.",
    heading: "Cómo funciona este explorador",
    intro:
      "La fila de paréntesis de arriba es una fórmula booleana en forma normal conjuntiva: una lista de cláusulas unidas por Y, cada una un O de unos pocos literales como x₁ o ¬x₃. La pregunta es si alguna elección de verdadero y falso para las variables hace verdaderas todas las cláusulas a la vez. Esa pregunta, llamada SAT, está en el centro del problema P frente a NP. El explorador te deja sentir sus dos mitades: en el modo «Resolver» un algoritmo de búsqueda persigue una respuesta y dibuja su árbol de búsqueda, en el modo «Verificar» le entregas una respuesta y él se limita a comprobarla.",
    sections: [
      {
        heading: "Encontrar frente a comprobar",
        paragraphs: [
          "NP es la clase de problemas de sí o no en los que una respuesta afirmativa viene con un certificado que se puede comprobar rápido, es decir, en tiempo polinómico respecto al tamaño de la entrada. Para SAT el certificado es una asignación que satisface la fórmula, y comprobarlo consiste en leer cada cláusula una vez: lineal en el tamaño de la fórmula. P es la clase de problemas que además se pueden resolver rápido, sin que nadie te dé el certificado. Si P es igual a NP sigue siendo una cuestión abierta, y es uno de los Problemas del Milenio del Clay Mathematics Institute.",
          "SAT importa tanto porque es NP-completo: todo problema de NP se puede traducir a SAT de forma eficiente. Lo demostró Stephen Cook en 1971 y, de forma independiente, Leonid Levin. Un algoritmo rápido para SAT daría, por tanto, un algoritmo rápido para todos los problemas de NP. La variante que se usa aquí, 3-SAT, limita las cláusulas a tres literales y sigue siendo NP-completa.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Cinco preajustes cargan instancias fijas. «Trivialmente SAT» es la fórmula de dos cláusulas de arriba. «Las 8 cláusulas sobre 3 variables» enumera todas las cláusulas posibles de tres literales sobre x₁, x₂, x₃, y como cada asignación hace falsa exactamente una de ellas, la fórmula es insatisfacible. «Transición de fase» es una instancia aleatoria con 7 variables y 30 cláusulas, una proporción cercana a 4,26; esta instancia en concreto resulta ser insatisfacible. «Palomar» codifica la afirmación de que 4 palomas caben en 3 huecos sin compartir ninguno, con 12 variables y 22 cláusulas; es falsa, así que la fórmula es insatisfacible. «Sólo verificar» carga una fórmula de 4 variables junto con una asignación candidata y cambia al modo «Verificar».",
          "El generador aleatorio construye una fórmula 3-SAT a partir de n variables (de 3 a 12, 5 por defecto), m cláusulas (de 3 a 50, 20 por defecto) y una semilla (de 1 a 999). Cada cláusula elige tres variables distintas y niega cada una con probabilidad un medio, de modo que la misma semilla produce siempre la misma fórmula. El indicador m / n te dice dónde estás respecto a la transición de fase.",
          "En el modo «Resolver», «Paso» hace avanzar el solver exactamente una acción, «Ejecutar» lo repite a la velocidad elegida (de 1 a 60 pasos por segundo, 8 por defecto) y «Reiniciar» vuelve a la asignación vacía. En el modo «Verificar» pulsas una variable para hacerla pasar por T, F y sin asignar; cada cláusula se ilumina como satisfecha, falsada o todavía abierta, y el veredicto se actualiza al instante.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Una cláusula es un array de enteros con signo: 3 significa x₃, −3 significa ¬x₃. El solver es una versión pequeña del procedimiento DPLL (Davis, Putnam, Logemann y Loveland, 1962) escrita con una pila explícita en lugar de recursión, para poder detenerse después de cualquier paso. Cada paso hace lo primero que sea aplicable: informar SAT si todas las cláusulas están satisfechas, retroceder si alguna cláusula ha quedado falsada, aplicar propagación unitaria (una cláusula con todos sus literales falsos salvo uno sin asignar fuerza ese literal), aplicar eliminación de literales puros (una variable que aparece con un solo signo en las cláusulas restantes puede fijarse sin riesgo para hacerlo verdadero) y, si no, ramificar.",
          "La ramificación es ingenua a propósito: toma la variable sin asignar de menor índice y prueba primero verdadero. Antes de ramificar guarda en la pila una instantánea de la asignación. Ante un conflicto, el retroceso restaura la instantánea del marco más reciente que aún tiene un valor por probar y cambia esa variable a falso; los marcos con ambos valores probados se sacan de la pila. Cuando la pila está vacía, todas las ramas han fracasado y el veredicto es UNSAT. Cada paso devuelve un objeto de estado nuevo, que React dibuja como cláusulas coloreadas y un árbol SVG en el que los nodos cian están abiertos, los grises explorados, los rosas son conflictos y el nodo ámbar es la solución. Nada se mueve si no pulsas «Paso» o «Ejecutar», así que no hay movimiento que reducir.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Por qué 4,26 es especial",
        paragraphs: [
          "Para 3-SAT aleatorio, un simple recuento ya explica mucho. Una cláusula aleatoria de tres literales es falsa para exactamente una de las ocho combinaciones de sus variables, así que una asignación fija la satisface con probabilidad 7/8. El número esperado de asignaciones que satisfacen la fórmula es, por tanto, 2^n · (7/8)^m, que cae por debajo de uno en cuanto m / n supera aproximadamente 5,19. El umbral real es más bajo: los experimentos muestran que las fórmulas aleatorias pasan de ser casi siempre satisfacibles a casi siempre insatisfacibles en torno a m / n ≈ 4,26, y los solvers como este necesitan empíricamente el máximo trabajo cerca de esa proporción. Por debajo, las soluciones abundan y el primer descenso suele tener éxito. Muy por encima, las contradicciones afloran tras unas pocas asignaciones.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Un no que cuesta el árbol entero",
        text: "Carga «Transición de fase» y pulsa «Ejecutar». Esta instancia no tiene solución, así que el solver no puede detenerse con un golpe de suerte: tiene que refutar cada rama antes de poder responder UNSAT. Fíjate al final en los contadores de ramas y conflictos. No existe ninguna asignación que puedas introducir en el modo «Verificar» para confirmar esa respuesta, y nadie conoce en general un certificado corto de insatisfacibilidad (esa es la cuestión NP frente a coNP).",
      },
      {
        title: "Fácil, difícil, imposible",
        text: "Genera tres fórmulas aleatorias con n = 12: m = 20 (proporción 1,67), m = 50 (proporción 4,17) y después n = 5 con m = 50 (proporción 10). La primera es casi con seguridad satisfacible y se resuelve rápido, la segunda está cerca del umbral y puede salir de cualquier manera, la tercera es muy probablemente insatisfacible y el árbol se llena de nodos de conflicto rosas.",
      },
      {
        title: "Mira pelearse a las palomas",
        text: "Carga «Palomar» y avanza despacio, paso a paso. La primera rama mete la paloma 1 en el hueco 1, y en los pasos siguientes la propagación unitaria prohíbe ese hueco a las otras tres palomas. El solver tiene que probar muchas colocaciones antes de estar seguro de que cuatro palomas no caben nunca. Para versiones más grandes de esta fórmula se sabe que cualquier ejecución de DPLL necesita un número exponencial de pasos.",
      },
      {
        title: "Rompe una solución a mano",
        text: "Carga «Sólo verificar». La candidata x₁ = T, x₂ = T, x₃ = F, x₄ = T satisface las seis cláusulas. Pulsa x₃ dos veces (de F a sin asignar y luego a T) y observa cómo la cláusula c4 queda falsada: basta un solo bit invertido para romper el certificado.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Regarde un solveur DPLL attaquer 3-SAT pas à pas, puis vérifie une solution en une seule passe. P contre NP en pratique : trouver est dur, vérifier est facile.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La rangée de parenthèses en haut est une formule booléenne en forme normale conjonctive : une liste de clauses reliées par des ET, chaque clause étant un OU de quelques littéraux comme x₁ ou ¬x₃. La question est de savoir s'il existe un choix de vrai et de faux pour les variables qui rende toutes les clauses vraies en même temps. Cette question, appelée SAT, est au cœur du problème P contre NP. L'explorateur te fait éprouver ses deux moitiés : en mode « Résoudre », un algorithme de recherche traque une réponse et dessine son arbre de recherche ; en mode « Vérifier », tu lui fournis une réponse et il se contente de la contrôler.",
    sections: [
      {
        heading: "Trouver ou vérifier",
        paragraphs: [
          "NP est la classe des problèmes à réponse oui ou non pour lesquels une réponse oui s'accompagne d'un certificat vérifiable rapidement, c'est-à-dire en temps polynomial par rapport à la taille de l'entrée. Pour SAT, le certificat est une affectation qui satisfait la formule, et le vérifier revient à lire chaque clause une fois : c'est linéaire en la taille de la formule. P est la classe des problèmes que l'on sait aussi résoudre rapidement, sans qu'on nous donne le certificat. Savoir si P est égal à NP reste une question ouverte, et c'est l'un des problèmes du prix du millénaire du Clay Mathematics Institute.",
          "SAT compte autant parce qu'il est NP-complet : tout problème de NP peut être traduit efficacement en SAT. Stephen Cook l'a montré en 1971, et Leonid Levin indépendamment. Un algorithme rapide pour SAT donnerait donc un algorithme rapide pour tous les problèmes de NP. La variante utilisée ici, 3-SAT, limite les clauses à trois littéraux et reste NP-complète.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Cinq préréglages chargent des instances fixes. « Trivialement SAT » est la formule à deux clauses ci-dessus. « Les 8 clauses sur 3 variables » énumère toutes les clauses possibles de trois littéraux sur x₁, x₂, x₃, et comme chaque affectation en rend exactement une fausse, la formule est insatisfaisable. « Transition de phase » est une instance aléatoire de 7 variables et 30 clauses, soit un rapport proche de 4,26 ; il se trouve que cette instance précise est insatisfaisable. « Tiroirs » encode l'affirmation selon laquelle 4 pigeons tiennent dans 3 trous sans qu'aucun trou soit partagé, avec 12 variables et 22 clauses ; elle est fausse, la formule est donc insatisfaisable. « Vérification seule » charge une formule à 4 variables accompagnée d'une affectation candidate et bascule en mode « Vérifier ».",
          "Le générateur aléatoire construit une formule 3-SAT à partir de n variables (de 3 à 12, 5 par défaut), de m clauses (de 3 à 50, 20 par défaut) et d'une graine (de 1 à 999). Chaque clause choisit trois variables distinctes et nie chacune avec une probabilité d'un demi, si bien qu'une même graine produit toujours la même formule. L'affichage m / n t'indique où tu te situes par rapport à la transition de phase.",
          "En mode « Résoudre », « Pas » fait avancer le solveur d'une seule action, « Lancer » répète l'opération à la vitesse choisie (de 1 à 60 pas par seconde, 8 par défaut) et « Réinitialiser » revient à l'affectation vide. En mode « Vérifier », tu cliques sur une variable pour la faire passer par T, F et non assigné ; chaque clause s'allume selon qu'elle est satisfaite, falsifiée ou encore ouverte, et le verdict se met à jour instantanément.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Une clause est un tableau d'entiers signés : 3 signifie x₃, −3 signifie ¬x₃. Le solveur est une petite version de la procédure DPLL (Davis, Putnam, Logemann et Loveland, 1962), écrite avec une pile explicite plutôt qu'avec de la récursion, afin de pouvoir s'arrêter après n'importe quelle étape. Chaque étape effectue la première action applicable : annoncer SAT si toutes les clauses sont satisfaites, revenir en arrière si une clause est falsifiée, appliquer la propagation unitaire (une clause dont tous les littéraux sont faux sauf un, non assigné, impose ce littéral), appliquer l'élimination des littéraux purs (une variable qui n'apparaît qu'avec un seul signe dans les clauses restantes peut être fixée sans risque de façon à le rendre vrai), et sinon brancher.",
          "Le branchement est volontairement naïf : il prend la variable non assignée de plus petit indice et essaie d'abord vrai. Avant de brancher, il enregistre sur la pile un instantané de l'affectation. En cas de conflit, le retour arrière restaure l'instantané du cadre le plus récent qui possède encore une valeur non essayée et bascule cette variable à faux ; les cadres dont les deux valeurs ont été essayées sont dépilés. Quand la pile est vide, toutes les branches ont échoué et le verdict est UNSAT. Chaque étape renvoie un nouvel objet d'état, que React affiche sous forme de clauses colorées et d'un arbre SVG où les nœuds cyan sont ouverts, les gris explorés, les roses des conflits et le nœud ambre la solution. Rien ne bouge tant que tu n'appuies pas sur « Pas » ou « Lancer », il n'y a donc aucun mouvement à réduire.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Pourquoi 4,26 est particulier",
        paragraphs: [
          "Pour le 3-SAT aléatoire, un simple dénombrement explique déjà beaucoup de choses. Une clause aléatoire de trois littéraux est fausse pour exactement une des huit combinaisons de ses variables, si bien qu'une affectation fixée la satisfait avec une probabilité de 7/8. Le nombre attendu d'affectations satisfaisantes vaut donc 2^n · (7/8)^m, qui passe sous un dès que m / n dépasse environ 5,19. Le vrai seuil est plus bas : les expériences montrent que les formules aléatoires basculent de presque toujours satisfaisables à presque toujours insatisfaisables autour de m / n ≈ 4,26, et que les solveurs comme celui-ci demandent empiriquement le plus de travail près de ce rapport. En dessous, les solutions abondent et la première descente réussit souvent. Bien au-dessus, les contradictions surgissent après quelques affectations.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Un non qui coûte l'arbre entier",
        text: "Charge « Transition de phase » et appuie sur « Lancer ». Cette instance n'a pas de solution, le solveur ne peut donc pas s'arrêter sur un coup de chance : il doit réfuter chaque branche avant de pouvoir répondre UNSAT. Note à la fin les compteurs de branches et de conflits. Il n'existe aucune affectation que tu pourrais saisir en mode « Vérifier » pour confirmer cette réponse, et personne ne connaît de certificat court d'insatisfaisabilité dans le cas général (c'est la question NP contre coNP).",
      },
      {
        title: "Facile, difficile, sans espoir",
        text: "Génère trois formules aléatoires avec n = 12 : m = 20 (rapport 1,67), m = 50 (rapport 4,17), puis n = 5 avec m = 50 (rapport 10). La première est presque sûrement satisfaisable et vite résolue, la deuxième est proche du seuil et peut pencher d'un côté comme de l'autre, la troisième est très probablement insatisfaisable et l'arbre se remplit de nœuds de conflit roses.",
      },
      {
        title: "Regarde les pigeons se disputer",
        text: "Charge « Tiroirs » et avance lentement, pas à pas. La première branche place le pigeon 1 dans le trou 1, et au fil des étapes suivantes la propagation unitaire interdit ce trou aux trois autres pigeons. Le solveur doit essayer de nombreux placements avant d'être certain que quatre pigeons ne tiennent jamais. Pour des versions plus grandes de cette formule, on sait que toute exécution de DPLL demande un nombre exponentiel d'étapes.",
      },
      {
        title: "Casse une solution à la main",
        text: "Charge « Vérification seule ». La candidate x₁ = T, x₂ = T, x₃ = F, x₄ = T satisfait les six clauses. Clique deux fois sur x₃ (de F à non assigné, puis à T) et regarde la clause c4 devenir une clause falsifiée : un seul bit inversé suffit à briser le certificat.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarda un solver DPLL affrontare 3-SAT passo dopo passo, poi verifica una soluzione in una sola passata. P vs NP dal vivo: trovare è difficile, verificare no.",
    heading: "Come funziona questo esploratore",
    intro:
      "La riga di parentesi in alto è una formula booleana in forma normale congiuntiva: un elenco di clausole unite da AND, ciascuna un OR di pochi letterali come x₁ o ¬x₃. La domanda è se esista una scelta di vero e falso per le variabili che renda vere tutte le clausole contemporaneamente. Questa domanda, chiamata SAT, sta al centro del problema P contro NP. L'esploratore te ne fa provare entrambe le metà: nella modalità «Risolvi» un algoritmo di ricerca va a caccia di una risposta e disegna il proprio albero di ricerca, nella modalità «Verifica» gli consegni una risposta e lui si limita a controllarla.",
    sections: [
      {
        heading: "Trovare contro controllare",
        paragraphs: [
          "NP è la classe dei problemi con risposta sì o no in cui una risposta affermativa è accompagnata da un certificato che si può controllare in fretta, cioè in tempo polinomiale rispetto alla dimensione dell'input. Per SAT il certificato è un assegnamento che soddisfa la formula, e controllarlo significa leggere ogni clausola una volta: lineare nella dimensione della formula. P è la classe dei problemi che si possono anche risolvere in fretta, senza che qualcuno fornisca il certificato. Se P sia uguale a NP è una questione aperta, ed è uno dei Problemi del Millennio del Clay Mathematics Institute.",
          "SAT è così importante perché è NP-completo: ogni problema in NP si può tradurre in SAT in modo efficiente. Lo dimostrò Stephen Cook nel 1971 e, indipendentemente, Leonid Levin. Un algoritmo veloce per SAT darebbe quindi un algoritmo veloce per ogni problema in NP. La variante usata qui, 3-SAT, limita le clausole a tre letterali ed è ancora NP-completa.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Cinque preset caricano istanze fisse. «Banalmente SAT» è la formula a due clausole qui sopra. «Tutte le 8 clausole su 3 variabili» elenca ogni possibile clausola di tre letterali su x₁, x₂, x₃ e, poiché ogni assegnamento ne rende falsa esattamente una, la formula è insoddisfacibile. «Transizione di fase» è un'istanza casuale con 7 variabili e 30 clausole, un rapporto vicino a 4,26; questa particolare istanza risulta insoddisfacibile. «Cassetti» codifica l'affermazione che 4 piccioni stiano in 3 buchi senza condividerne nessuno, con 12 variabili e 22 clausole; è falsa, quindi la formula è insoddisfacibile. «Solo verifica» carica una formula a 4 variabili insieme a un assegnamento candidato e passa alla modalità «Verifica».",
          "Il generatore casuale costruisce una formula 3-SAT a partire da n variabili (da 3 a 12, 5 per impostazione predefinita), m clausole (da 3 a 50, 20 per impostazione predefinita) e un seme («Seed», da 1 a 999). Ogni clausola sceglie tre variabili distinte e nega ciascuna con probabilità un mezzo, perciò lo stesso seme produce sempre la stessa formula. L'indicatore m / n ti dice dove ti trovi rispetto alla transizione di fase.",
          "Nella modalità «Risolvi», «Passo» fa avanzare il solver di una sola azione, «Avvia» la ripete alla velocità scelta (da 1 a 60 passi al secondo, 8 per impostazione predefinita) e «Reset» torna all'assegnamento vuoto. Nella modalità «Verifica» clicchi una variabile per farla passare tra T, F e non assegnata; ogni clausola si illumina come soddisfatta, falsificata o ancora aperta, e il verdetto si aggiorna all'istante.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Una clausola è un array di interi con segno: 3 significa x₃, −3 significa ¬x₃. Il solver è una piccola versione della procedura DPLL (Davis, Putnam, Logemann e Loveland, 1962) scritta con una pila esplicita al posto della ricorsione, così da potersi fermare dopo ogni singolo passo. Ogni passo fa la prima cosa applicabile: dichiarare SAT se tutte le clausole sono soddisfatte, tornare indietro se una clausola è falsificata, applicare la propagazione unitaria (una clausola con tutti i letterali falsi tranne uno non assegnato impone quel letterale), applicare l'eliminazione dei letterali puri (una variabile che nelle clausole rimanenti compare con un solo segno può essere fissata senza rischi in modo da renderlo vero) e, altrimenti, ramificare.",
          "La ramificazione è volutamente ingenua: prende la variabile non assegnata con l'indice più basso e prova prima vero. Prima di ramificare salva sulla pila un'istantanea dell'assegnamento. In caso di conflitto, il backtracking ripristina l'istantanea del frame più recente che ha ancora un valore non provato e porta quella variabile a falso; i frame con entrambi i valori provati vengono tolti dalla pila. Quando la pila è vuota, ogni ramo è fallito e il verdetto è UNSAT. Ogni passo restituisce un nuovo oggetto di stato, che React disegna come clausole colorate e come un albero SVG in cui i nodi ciano sono aperti, i grigi esplorati, i rosa sono conflitti e il nodo ambra è la soluzione. Nulla si muove finché non premi «Passo» o «Avvia», quindi non c'è alcun movimento da ridurre.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Perché 4,26 è speciale",
        paragraphs: [
          "Per il 3-SAT casuale basta un semplice conteggio a spiegare molto. Una clausola casuale di tre letterali è falsa per esattamente una delle otto combinazioni delle sue variabili, quindi un assegnamento fissato la soddisfa con probabilità 7/8. Il numero atteso di assegnamenti che soddisfano la formula è perciò 2^n · (7/8)^m, che scende sotto uno non appena m / n supera circa 5,19. La soglia vera è più bassa: gli esperimenti mostrano che le formule casuali passano da quasi sempre soddisfacibili a quasi sempre insoddisfacibili intorno a m / n ≈ 4,26, e solver come questo richiedono empiricamente il massimo lavoro vicino a quel rapporto. Al di sotto le soluzioni abbondano e spesso riesce già la prima discesa. Molto al di sopra le contraddizioni emergono dopo pochi assegnamenti.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Un no che costa l'intero albero",
        text: "Carica «Transizione di fase» e premi «Avvia». Questa istanza non ha soluzione, quindi il solver non può fermarsi a un colpo di fortuna: deve confutare ogni ramo prima di poter rispondere UNSAT. Alla fine guarda i contatori di rami e conflitti. Non esiste alcun assegnamento che tu possa inserire nella modalità «Verifica» per confermare quella risposta, e nessuno conosce in generale un certificato breve di insoddisfacibilità (è la questione NP contro coNP).",
      },
      {
        title: "Facile, difficile, senza speranza",
        text: "Genera tre formule casuali con n = 12: m = 20 (rapporto 1,67), m = 50 (rapporto 4,17) e poi n = 5 con m = 50 (rapporto 10). La prima è quasi certamente soddisfacibile e si risolve in fretta, la seconda è vicina alla soglia e può andare in un modo o nell'altro, la terza è molto probabilmente insoddisfacibile e l'albero si riempie di nodi di conflitto rosa.",
      },
      {
        title: "Guarda i piccioni litigare",
        text: "Carica «Cassetti» e procedi lentamente, un passo alla volta. Il primo ramo mette il piccione 1 nel buco 1, e nei passi successivi la propagazione unitaria vieta quel buco agli altri tre piccioni. Il solver deve provare molte sistemazioni prima di essere sicuro che quattro piccioni non ci stanno mai. Per versioni più grandi di questa formula è noto che qualunque esecuzione di DPLL richiede un numero esponenziale di passi.",
      },
      {
        title: "Rompi una soluzione a mano",
        text: "Carica «Solo verifica». La candidata x₁ = T, x₂ = T, x₃ = F, x₄ = T soddisfa tutte e sei le clausole. Clicca x₃ due volte (da F a non assegnata, poi a T) e guarda la clausola c4 diventare falsificata: basta un solo bit invertito per rompere il certificato.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Vê um solver DPLL atacar o 3-SAT passo a passo e verifica uma solução numa só passagem. P vs NP na prática: encontrar é difícil, verificar é fácil.",
    heading: "Como funciona este explorador",
    intro:
      "A fila de parênteses no topo é uma fórmula booleana em forma normal conjuntiva: uma lista de cláusulas ligadas por E, cada uma um OU de alguns literais como x₁ ou ¬x₃. A pergunta é se alguma escolha de verdadeiro e falso para as variáveis torna todas as cláusulas verdadeiras ao mesmo tempo. Essa pergunta, chamada SAT, está no centro do problema P contra NP. O explorador deixa-te sentir as duas metades: no modo «Resolver» um algoritmo de busca persegue uma resposta e desenha a sua árvore de busca, no modo «Verificar» entregas-lhe uma resposta e ele limita-se a conferi-la.",
    sections: [
      {
        heading: "Encontrar contra conferir",
        paragraphs: [
          "NP é a classe dos problemas de sim ou não em que uma resposta afirmativa vem com um certificado que pode ser conferido depressa, isto é, em tempo polinomial no tamanho da entrada. Para o SAT o certificado é uma atribuição que satisfaz a fórmula, e conferi-lo significa ler cada cláusula uma vez: linear no tamanho da fórmula. P é a classe dos problemas que também podem ser resolvidos depressa, sem que alguém entregue o certificado. Se P é igual a NP continua em aberto, e é um dos Problemas do Milénio do Clay Mathematics Institute.",
          "O SAT é tão importante porque é NP-completo: todo o problema em NP pode ser traduzido para SAT de forma eficiente. Isto foi demonstrado por Stephen Cook em 1971 e, de forma independente, por Leonid Levin. Um algoritmo rápido para o SAT daria, portanto, um algoritmo rápido para todos os problemas em NP. A variante usada aqui, o 3-SAT, limita as cláusulas a três literais e continua a ser NP-completa.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Cinco predefinições carregam instâncias fixas. «Trivialmente SAT» é a fórmula de duas cláusulas acima. «Todas as 8 cláusulas sobre 3 variáveis» enumera todas as cláusulas possíveis de três literais sobre x₁, x₂, x₃ e, como cada atribuição torna falsa exatamente uma delas, a fórmula é insatisfazível. «Transição de fase» é uma instância aleatória com 7 variáveis e 30 cláusulas, uma razão próxima de 4,26; esta instância em particular acaba por ser insatisfazível. «Casas dos pombos» codifica a afirmação de que 4 pombos cabem em 3 casas sem partilhar nenhuma, com 12 variáveis e 22 cláusulas; é falsa, logo a fórmula é insatisfazível. «Só verificar» carrega uma fórmula de 4 variáveis juntamente com uma atribuição candidata e muda para o modo «Verificar».",
          "O gerador aleatório constrói uma fórmula 3-SAT a partir de n variáveis (de 3 a 12, 5 por omissão), m cláusulas (de 3 a 50, 20 por omissão) e uma semente (de 1 a 999). Cada cláusula escolhe três variáveis distintas e nega cada uma com probabilidade um meio, pelo que a mesma semente produz sempre a mesma fórmula. O indicador m / n diz-te onde estás em relação à transição de fase.",
          "No modo «Resolver», «Passo» faz o solver avançar exatamente uma ação, «Executar» repete-a à velocidade escolhida (de 1 a 60 passos por segundo, 8 por omissão) e «Reiniciar» regressa à atribuição vazia. No modo «Verificar» clicas numa variável para a fazer passar por T, F e não atribuída; cada cláusula acende-se como satisfeita, falsificada ou ainda em aberto, e o veredicto atualiza-se de imediato.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Uma cláusula é um array de inteiros com sinal: 3 significa x₃, −3 significa ¬x₃. O solver é uma versão pequena do procedimento DPLL (Davis, Putnam, Logemann e Loveland, 1962), escrita com uma pilha explícita em vez de recursão, para poder parar depois de qualquer passo. Cada passo faz a primeira coisa que se aplique: declarar SAT se todas as cláusulas estiverem satisfeitas, retroceder se alguma cláusula estiver falsificada, aplicar propagação unitária (uma cláusula com todos os literais falsos exceto um, ainda não atribuído, força esse literal), aplicar eliminação de literais puros (uma variável que aparece com um só sinal nas cláusulas restantes pode ser fixada sem risco de modo a torná-lo verdadeiro) e, caso contrário, ramificar.",
          "A ramificação é ingénua de propósito: pega na variável não atribuída de índice mais baixo e experimenta primeiro verdadeiro. Antes de ramificar guarda na pilha um instantâneo da atribuição. Perante um conflito, o retrocesso repõe o instantâneo do quadro mais recente que ainda tem um valor por experimentar e passa essa variável para falso; os quadros com ambos os valores experimentados são retirados da pilha. Quando a pilha fica vazia, todos os ramos falharam e o veredicto é UNSAT. Cada passo devolve um novo objeto de estado, que o React desenha como cláusulas coloridas e uma árvore SVG em que os nós ciano estão abertos, os cinzentos explorados, os rosa são conflitos e o nó âmbar é a solução. Nada se mexe sem carregares em «Passo» ou «Executar», por isso não há movimento a reduzir.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Porque é que 4,26 é especial",
        paragraphs: [
          "Para o 3-SAT aleatório, uma simples contagem já explica muito. Uma cláusula aleatória de três literais é falsa para exatamente uma das oito combinações das suas variáveis, pelo que uma atribuição fixa a satisfaz com probabilidade 7/8. O número esperado de atribuições que satisfazem a fórmula é, portanto, 2^n · (7/8)^m, que desce abaixo de um assim que m / n ultrapassa cerca de 5,19. O limiar verdadeiro é mais baixo: as experiências mostram que as fórmulas aleatórias passam de quase sempre satisfazíveis a quase sempre insatisfazíveis por volta de m / n ≈ 4,26, e solvers como este precisam empiricamente de mais trabalho perto dessa razão. Abaixo dela as soluções abundam e a primeira descida resulta muitas vezes. Muito acima, as contradições vêm à tona ao fim de poucas atribuições.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Um não que custa a árvore inteira",
        text: "Carrega «Transição de fase» e prime «Executar». Esta instância não tem solução, por isso o solver não pode parar num palpite feliz: tem de refutar todos os ramos antes de poder responder UNSAT. Repara, no fim, nos contadores de ramos e de conflitos. Não existe nenhuma atribuição que possas introduzir no modo «Verificar» para confirmar essa resposta, e ninguém conhece, em geral, um certificado curto de insatisfazibilidade (essa é a questão NP contra coNP).",
      },
      {
        title: "Fácil, difícil, sem esperança",
        text: "Gera três fórmulas aleatórias com n = 12: m = 20 (razão 1,67), m = 50 (razão 4,17) e depois n = 5 com m = 50 (razão 10). A primeira é quase de certeza satisfazível e resolve-se depressa, a segunda está perto do limiar e pode cair para qualquer lado, a terceira é muito provavelmente insatisfazível e a árvore enche-se de nós de conflito cor-de-rosa.",
      },
      {
        title: "Vê os pombos à bulha",
        text: "Carrega «Casas dos pombos» e avança devagar, passo a passo. O primeiro ramo põe o pombo 1 na casa 1 e, nos passos seguintes, a propagação unitária proíbe essa casa aos outros três pombos. O solver tem de experimentar muitas arrumações antes de ter a certeza de que quatro pombos nunca cabem. Para versões maiores desta fórmula sabe-se que qualquer execução do DPLL precisa de um número exponencial de passos.",
      },
      {
        title: "Estraga uma solução à mão",
        text: "Carrega «Só verificar». A candidata x₁ = T, x₂ = T, x₃ = F, x₄ = T satisfaz as seis cláusulas. Clica duas vezes em x₃ (de F para não atribuída e depois para T) e vê a cláusula c4 passar a falsificada: basta um único bit trocado para estragar o certificado.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Se en DPLL-lösare angripa 3-SAT steg för steg och kontrollera sedan en lösning i ett enda svep. P mot NP i praktiken: att hitta är svårt, att verifiera lätt.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Raden av parenteser högst upp är en boolesk formel i konjunktiv normalform: en lista av klausuler som binds ihop med OCH, där varje klausul är ett ELLER av några få literaler som x₁ eller ¬x₃. Frågan är om något val av sant och falskt för variablerna gör alla klausuler sanna på en gång. Den frågan kallas SAT och står i centrum för problemet P mot NP. Utforskaren låter dig känna på båda halvorna: i läget ”Lös” jagar en sökalgoritm ett svar och ritar sitt sökträd, i läget ”Verifiera” ger du den ett svar och den kontrollerar det bara.",
    sections: [
      {
        heading: "Att hitta eller att kontrollera",
        paragraphs: [
          "NP är klassen av ja-eller-nej-problem där ett ja-svar kommer med ett certifikat som går snabbt att kontrollera, det vill säga i tid som är polynomiell i indatas storlek. För SAT är certifikatet en satisfierande tilldelning, och att kontrollera den innebär att läsa varje klausul en gång: linjärt i formelns storlek. P är klassen av problem som dessutom går att lösa snabbt, utan att man får certifikatet i handen. Om P är lika med NP är en öppen fråga, och den är ett av Clay Mathematics Institutes millennieproblem.",
          "SAT är så viktigt eftersom det är NP-fullständigt: varje problem i NP kan effektivt översättas till SAT. Det visade Stephen Cook 1971 och, oberoende av honom, Leonid Levin. En snabb algoritm för SAT skulle därför ge en snabb algoritm för varje problem i NP. Varianten som används här, 3-SAT, begränsar klausulerna till tre literaler och är fortfarande NP-fullständig.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Fem förval laddar fasta instanser. ”Trivialt SAT” är formeln med två klausuler ovan. ”Alla 8 klausuler på 3 variabler” räknar upp varje möjlig klausul med tre literaler över x₁, x₂, x₃, och eftersom varje tilldelning gör exakt en av dem falsk är formeln osatisfierbar. ”Fasövergång” är en slumpmässig instans med 7 variabler och 30 klausuler, en kvot nära 4,26; just den här instansen visar sig vara osatisfierbar. ”Lådprincip” kodar påståendet att 4 duvor får plats i 3 hål utan att något hål delas, med 12 variabler och 22 klausuler; det är falskt, så formeln är osatisfierbar. ”Endast verifiera” laddar en formel med 4 variabler tillsammans med en kandidattilldelning och växlar till läget ”Verifiera”.",
          "Slumpgeneratorn bygger en 3-SAT-formel av n variabler (3 till 12, standard 5), m klausuler (3 till 50, standard 20) och ett frö (1 till 999). Varje klausul väljer tre olika variabler och negerar var och en med sannolikheten en halv, så samma frö ger alltid samma formel. Avläsningen m / n visar var du befinner dig i förhållande till fasövergången.",
          "I läget ”Lös” flyttar ”Steg” fram lösaren exakt en åtgärd, ”Kör” upprepar det i vald hastighet (1 till 60 steg per sekund, standard 8) och ”Återställ” går tillbaka till den tomma tilldelningen. I läget ”Verifiera” klickar du på en variabel för att stega den genom T, F och otilldelad; varje klausul lyser upp som satisfierad, falsifierad eller fortfarande öppen, och utslaget uppdateras direkt.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "En klausul är en array av heltal med tecken: 3 betyder x₃, −3 betyder ¬x₃. Lösaren är en liten version av DPLL-proceduren (Davis, Putnam, Logemann och Loveland, 1962), skriven med en explicit stack i stället för rekursion så att den kan pausa efter vilket enskilt steg som helst. Varje steg gör det första som är tillämpligt: rapportera SAT om alla klausuler är satisfierade, backa om någon klausul är falsifierad, tillämpa enhetspropagering (en klausul där alla literaler är falska utom en otilldelad tvingar fram den literalen), tillämpa eliminering av rena literaler (en variabel som bara förekommer med ett tecken i de återstående klausulerna kan utan risk sättas så att literalen blir sann) och i annat fall förgrena.",
          "Förgreningen är avsiktligt naiv: den tar den otilldelade variabeln med lägst nummer och provar sant först. Innan den förgrenar lägger den en ögonblicksbild av tilldelningen på stacken. Vid en konflikt återställer backtrackingen ögonblicksbilden från den nyaste ramen som fortfarande har ett oprövat värde och slår om den variabeln till falskt; ramar där båda värdena är prövade plockas bort från stacken. När stacken är tom har varje gren misslyckats och utslaget är UNSAT. Varje steg returnerar ett nytt tillståndsobjekt, som React ritar som färgade klausuler och ett SVG-träd där cyanfärgade noder är öppna, grå noder utforskade, rosa noder konflikter och den bärnstensfärgade noden lösningen. Ingenting rör sig om du inte trycker på ”Steg” eller ”Kör”, så det finns ingen rörelse att minska.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Varför 4,26 är speciellt",
        paragraphs: [
          "För slumpmässig 3-SAT förklarar redan en enkel räkning mycket. En slumpmässig klausul med tre literaler är falsk för exakt en av de åtta kombinationerna av sina variabler, så en fix tilldelning satisfierar den med sannolikheten 7/8. Det förväntade antalet satisfierande tilldelningar är därför 2^n · (7/8)^m, vilket sjunker under ett så snart m / n överstiger ungefär 5,19. Den verkliga tröskeln ligger lägre: experiment visar att slumpmässiga formler slår om från nästan alltid satisfierbara till nästan alltid osatisfierbara kring m / n ≈ 4,26, och lösare som den här behöver empiriskt mest arbete nära den kvoten. Under den finns lösningar i överflöd och den första nedstigningen lyckas ofta. Långt över den dyker motsägelser upp efter några få tilldelningar.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Ett nej som kostar hela trädet",
        text: "Ladda ”Fasövergång” och tryck på ”Kör”. Den här instansen saknar lösning, så lösaren kan inte stanna vid en lyckad gissning: den måste vederlägga varje gren innan den får svara UNSAT. Lägg märke till räknarna för grenar och konflikter på slutet. Det finns ingen tilldelning som du skulle kunna mata in i läget ”Verifiera” för att bekräfta svaret, och ingen känner till något kort certifikat för osatisfierbarhet i allmänhet (det är frågan om NP mot coNP).",
      },
      {
        title: "Lätt, svårt, hopplöst",
        text: "Generera tre slumpmässiga formler med n = 12: m = 20 (kvot 1,67), m = 50 (kvot 4,17) och sedan n = 5 med m = 50 (kvot 10). Den första är nästan säkert satisfierbar och löses snabbt, den andra ligger nära tröskeln och kan gå åt vilket håll som helst, den tredje är med stor sannolikhet osatisfierbar och trädet fylls med rosa konfliktnoder.",
      },
      {
        title: "Se duvorna slåss",
        text: "Ladda ”Lådprincip” och stega långsamt. Den första grenen sätter duva 1 i hål 1, och under de följande stegen förbjuder enhetspropageringen de tre andra duvorna att använda det hålet. Lösaren måste prova många placeringar innan den kan vara säker på att fyra duvor aldrig får plats. För större versioner av den här formeln vet man att varje DPLL-körning kräver exponentiellt många steg.",
      },
      {
        title: "Ha sönder en lösning för hand",
        text: "Ladda ”Endast verifiera”. Kandidaten x₁ = T, x₂ = T, x₃ = F, x₄ = T satisfierar alla sex klausulerna. Klicka på x₃ två gånger (från F till otilldelad, sedan till T) och se hur klausul c4 blir falsifierad: det räcker med en enda omslagen bit för att certifikatet ska gå sönder.",
      },
    ],
  },
  no: {
    metaDescription:
      "Se en DPLL-løser angripe 3-SAT steg for steg, og kontroller deretter en løsning i ett gjennomløp. P vs NP i praksis: Å finne er vanskelig, å verifisere lett.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Raden med parenteser øverst er en boolsk formel på konjunktiv normalform: en liste med klausuler som er bundet sammen med OG, der hver klausul er et ELLER av noen få literaler som x₁ eller ¬x₃. Spørsmålet er om et eller annet valg av sant og usant for variablene gjør alle klausulene sanne på én gang. Dette spørsmålet kalles SAT og står i sentrum av problemet P mot NP. Utforskeren lar deg kjenne på begge halvdelene: I modusen «Løs» jakter en søkealgoritme på et svar og tegner søketreet sitt, i modusen «Verifiser» gir du den et svar, og den bare kontrollerer det.",
    sections: [
      {
        heading: "Å finne eller å kontrollere",
        paragraphs: [
          "NP er klassen av ja-eller-nei-problemer der et ja-svar kommer med et sertifikat som kan kontrolleres raskt, det vil si i tid som er polynomisk i størrelsen på inndataene. For SAT er sertifikatet en tilordning som oppfyller formelen, og å kontrollere den betyr å lese hver klausul én gang: lineært i størrelsen på formelen. P er klassen av problemer som også kan løses raskt, uten at man får sertifikatet utlevert. Om P er lik NP, er et åpent spørsmål, og det er et av millenniumsproblemene til Clay Mathematics Institute.",
          "SAT er så viktig fordi det er NP-komplett: Ethvert problem i NP kan oversettes effektivt til SAT. Det viste Stephen Cook i 1971 og, uavhengig av ham, Leonid Levin. En rask algoritme for SAT ville derfor gi en rask algoritme for ethvert problem i NP. Varianten som brukes her, 3-SAT, begrenser klausulene til tre literaler og er fortsatt NP-komplett.",
        ],
        formula: PVSNP_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Fem forhåndsvalg laster inn faste instanser. «Trivielt SAT» er formelen med to klausuler ovenfor. «Alle 8 klausuler på 3 variabler» lister opp hver mulige klausul med tre literaler over x₁, x₂, x₃, og siden hver tilordning gjør nøyaktig én av dem usann, er formelen uoppfyllbar. «Faseovergang» er en tilfeldig instans med 7 variabler og 30 klausuler, et forhold nær 4,26; akkurat denne instansen viser seg å være uoppfyllbar. «Skuffeprinsipp» koder påstanden om at 4 duer får plass i 3 hull uten at noe hull deles, med 12 variabler og 22 klausuler; den er usann, så formelen er uoppfyllbar. «Kun verifiser» laster inn en formel med 4 variabler sammen med en kandidattilordning og bytter til modusen «Verifiser».",
          "Tilfeldighetsgeneratoren bygger en 3-SAT-formel av n variabler (3 til 12, standard 5), m klausuler (3 til 50, standard 20) og et frø (1 til 999). Hver klausul velger tre ulike variabler og negerer hver av dem med sannsynlighet en halv, så det samme frøet gir alltid den samme formelen. Avlesningen m / n forteller deg hvor du befinner deg i forhold til faseovergangen.",
          "I modusen «Løs» flytter «Steg» løseren fram nøyaktig én handling, «Kjør» gjentar det i valgt fart (1 til 60 steg per sekund, standard 8), og «Tilbakestill» går tilbake til den tomme tilordningen. I modusen «Verifiser» klikker du på en variabel for å bla den gjennom T, F og uten verdi; hver klausul lyser opp som oppfylt, falsifisert eller fortsatt åpen, og dommen oppdateres med en gang.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "En klausul er en array av heltall med fortegn: 3 betyr x₃, −3 betyr ¬x₃. Løseren er en liten versjon av DPLL-prosedyren (Davis, Putnam, Logemann og Loveland, 1962), skrevet med en eksplisitt stakk i stedet for rekursjon, slik at den kan stoppe etter hvert enkelt steg. Hvert steg gjør det første som passer: melde SAT hvis alle klausulene er oppfylt, gå tilbake hvis en klausul er falsifisert, bruke enhetspropagering (en klausul der alle literalene er usanne bortsett fra én som ikke har fått verdi, tvinger fram den literalen), bruke eliminering av rene literaler (en variabel som bare forekommer med ett fortegn i de gjenværende klausulene, kan trygt settes slik at literalen blir sann), og ellers forgrene.",
          "Forgreningen er bevisst naiv: Den tar variabelen uten verdi som har lavest nummer, og prøver sant først. Før den forgrener, legger den et øyeblikksbilde av tilordningen på stakken. Ved en konflikt gjenoppretter tilbakesporingen øyeblikksbildet fra den nyeste rammen som fortsatt har en uprøvd verdi, og slår den variabelen om til usant; rammer der begge verdiene er prøvd, fjernes fra stakken. Når stakken er tom, har hver gren mislyktes, og dommen er UNSAT. Hvert steg returnerer et nytt tilstandsobjekt, som React tegner som fargede klausuler og et SVG-tre der cyanfargede noder er åpne, grå noder utforsket, rosa noder konflikter og den ravfargede noden løsningen. Ingenting beveger seg med mindre du trykker på «Steg» eller «Kjør», så det finnes ingen bevegelse å redusere.",
        ],
        code: DPLL_EXCERPT,
      },
      {
        heading: "Hvorfor 4,26 er spesielt",
        paragraphs: [
          "For tilfeldig 3-SAT forklarer allerede en enkel opptelling mye. En tilfeldig klausul med tre literaler er usann for nøyaktig én av de åtte kombinasjonene av variablene sine, så en fast tilordning oppfyller den med sannsynlighet 7/8. Det forventede antallet tilordninger som oppfyller formelen, er derfor 2^n · (7/8)^m, som faller under én så snart m / n overstiger omtrent 5,19. Den virkelige terskelen ligger lavere: Eksperimenter viser at tilfeldige formler slår om fra nesten alltid oppfyllbare til nesten alltid uoppfyllbare rundt m / n ≈ 4,26, og løsere som denne trenger empirisk mest arbeid nær det forholdet. Under det finnes det løsninger i overflod, og den første nedstigningen lykkes ofte. Langt over det dukker motsigelser opp etter noen få tilordninger.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Et nei som koster hele treet",
        text: "Last inn «Faseovergang» og trykk på «Kjør». Denne instansen har ingen løsning, så løseren kan ikke stoppe ved en heldig gjetning: Den må motbevise hver gren før den får svare UNSAT. Legg merke til tellerne for grener og konflikter til slutt. Det finnes ingen tilordning du kunne skrive inn i modusen «Verifiser» for å bekrefte det svaret, og ingen kjenner noe kort sertifikat for uoppfyllbarhet generelt (det er spørsmålet om NP mot coNP).",
      },
      {
        title: "Lett, vanskelig, håpløst",
        text: "Generer tre tilfeldige formler med n = 12: m = 20 (forhold 1,67), m = 50 (forhold 4,17) og deretter n = 5 med m = 50 (forhold 10). Den første er nesten sikkert oppfyllbar og løses raskt, den andre ligger nær terskelen og kan gå begge veier, den tredje er høyst sannsynlig uoppfyllbar, og treet fylles med rosa konfliktnoder.",
      },
      {
        title: "Se duene slåss",
        text: "Last inn «Skuffeprinsipp» og gå sakte fram, steg for steg. Den første grenen setter due 1 i hull 1, og i løpet av de neste stegene forbyr enhetspropageringen de tre andre duene å bruke det hullet. Løseren må prøve mange plasseringer før den kan være sikker på at fire duer aldri får plass. For større versjoner av denne formelen vet man at enhver DPLL-kjøring trenger eksponentielt mange steg.",
      },
      {
        title: "Ødelegg en løsning for hånd",
        text: "Last inn «Kun verifiser». Kandidaten x₁ = T, x₂ = T, x₃ = F, x₄ = T oppfyller alle de seks klausulene. Klikk på x₃ to ganger (fra F til uten verdi, deretter til T), og se hvordan klausul c4 blir falsifisert: Det holder med én eneste snudd bit for å ødelegge sertifikatet.",
      },
    ],
  },
};
