import type { ExplorerGuide } from "./types";

// The traces quoted here (7 steps for the first formula, 11 for the
// unsatisfiable one, 6 for the five-variable one) and the speed range 1 to 12
// match the presets and step() in app/sat/explorer/page.tsx; update together.
const BACKTRACK_EXCERPT = `// 1. Conflict: chronological backtrack.
const conflictIdx = p.clauses.findIndex((c) => clauseStatus(c, a).kind === "conflict");
if (conflictIdx >= 0) {
  // Undo propagations and already-flipped decisions back to the last open decision.
  while (
    trail.length &&
    (trail[trail.length - 1].reason === "unit" || trail[trail.length - 1].flipped)
  ) {
    a[trail[trail.length - 1].v] = null;
    trail = trail.slice(0, -1);
  }
  if (trail.length === 0) return { assignment: a, trail, level: 0, status: "unsat" };
  const d = trail[trail.length - 1];
  trail = trail.slice(0, -1);
  a[d.v] = !d.value;
  trail = [...trail, { v: d.v, value: !d.value, reason: "decide", flipped: true, level: d.level }];
}`;

export const SAT_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Watch a DPLL SAT solver work step by step: decisions, unit propagation and backtracking on three CNF formulas, one of them provably unsatisfiable.",
    heading: "How this explorer works",
    intro:
      "The formula in the middle is written in conjunctive normal form: a list of clauses joined by AND, where each clause is a few literals joined by OR. The question is whether some assignment of true and false to the variables makes every clause true at once. The solver answers it with DPLL, the backtracking procedure that still forms the skeleton of modern SAT solvers, and it does so one move per click, so you can follow every guess, every forced consequence and every retreat.",
    sections: [
      {
        heading: "Satisfiability",
        paragraphs: [
          "Checking a proposed answer is easy: plug the values in and read each clause once. Finding an answer is a different matter, because n variables allow 2ⁿ assignments, and nobody knows a method that avoids exponential time on every formula. In 1971 Stephen Cook proved that SAT is NP-complete, and Leonid Levin found the same independently: every problem whose solutions are quick to check can be translated into a SAT formula.",
          "The procedure used here goes back to Davis, Putnam, Logemann and Loveland (1962). It is a depth-first search with one crucial shortcut: whenever a clause has all but one literal false, that last literal is forced, so the solver sets it without guessing. Below is the first preset, the formula the page opens with.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Three formulas are available. The first has four variables and six clauses and is satisfiable, but only after the solver backs out of a wrong first guess. The second consists of all eight clauses with three literals over a, b and c; each one forbids exactly one of the eight possible assignments, so together they forbid all of them. The third has five variables and seven clauses and is satisfiable.",
          "Step performs exactly one DPLL action. Play repeats it automatically at the speed set by the slider, from 1 to 12 steps per second (3 by default), and stops by itself when the answer is found; Pause and Reset do what they say.",
          "Each clause is coloured by its state under the current assignment: green when satisfied, amber when it is a unit clause with exactly one literal left to force, rose when every literal is false, and neutral while undecided. False literals are struck through. The search path lists the assignments in order: violet chips are decisions (▼ for a first guess, ⤺ for a flipped one), cyan chips are forced by propagation. A line at the bottom narrates each move.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The whole solver is one pure function, step(), that takes the formula and the current state and returns the next state. It tries four things in a fixed order. If some clause is in conflict, it backtracks. Otherwise, if some clause is a unit, it sets the forced literal. Otherwise, if every variable has a value, the formula is satisfied. Otherwise it decides: it picks the first unassigned variable in alphabetical order and sets it to true.",
          "Backtracking is chronological. The solver removes forced assignments and decisions it has already flipped from the end of the trail until it reaches the most recent decision that has only been tried one way, then flips that one. If the trail empties first, every branch has failed and the formula is unsatisfiable. There is deliberately no clause learning and no clever variable ordering; modern solvers add exactly those on top of this skeleton.",
          "Play uses a plain timer and never starts on its own, so nothing moves unless you ask for it.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Reading the three runs",
        paragraphs: [
          "The first formula takes seven steps. The solver guesses a = true, clause 1 then forces b = true, and clause 2 is left with every literal false. It flips a to false; now clause 3 forces c and clause 4 forces d. Nothing constrains b any more, but every variable needs a value, so the solver decides b = true and reports satisfiable with a = false and b, c, d true.",
          "The unsatisfiable formula takes eleven steps: the four combinations of a and b each end with c forced one way and a clause demanding the other. The five-variable formula needs only six steps and not a single backtrack: after a = true, propagation forces c, d and e, and only b is left to decide.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "The cost of one bad guess",
        text: "With the first formula, press Step repeatedly. After the second step clause 2 turns rose; the third step flips the violet chip for a from ▼ to ⤺. One wrong decision cost two extra steps here; in a large formula it can cost an enormous subtree.",
      },
      {
        title: "Prove a negative",
        text: "Select the unsatisfiable formula and press Play at 2 steps per second. The solver visits all four branches for a and b, and only when backtracking runs past the root does it declare the formula unsatisfiable. A «no» answer needs the whole tree; there is no short certificate to check.",
      },
      {
        title: "Let propagation do the work",
        text: "Select the five-variable formula and step through. Count the chips: two decisions, three propagations, zero backtracks. Unit propagation is why DPLL beats blind enumeration of all 32 assignments.",
      },
      {
        title: "Check the certificate yourself",
        text: "After the first formula reports satisfiable, take a = false, b = true, c = true, d = true and check each of the six clauses by hand. It takes a few seconds, which is the asymmetry at the heart of NP: finding is hard, checking is easy.",
      },
    ],
  },
  de: {
    metaDescription:
      "Einem DPLL-SAT-Solver Schritt für Schritt zusehen: Entscheidungen, Unit-Propagation und Backtracking an drei KNF-Formeln, eine davon beweisbar unerfüllbar.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Formel in der Mitte steht in konjunktiver Normalform (KNF): eine Liste von Klauseln, verbunden durch UND, wobei jede Klausel aus ein paar Literalen besteht, verbunden durch ODER. Die Frage ist, ob es eine Belegung der Variablen mit wahr und falsch gibt, die alle Klauseln gleichzeitig wahr macht. Der Solver beantwortet sie mit DPLL, dem Backtracking-Verfahren, das bis heute das Gerüst moderner SAT-Solver bildet, und zwar einen Zug pro Klick. So kannst du jeder Vermutung, jeder erzwungenen Folgerung und jedem Rückzug folgen.",
    sections: [
      {
        heading: "Erfüllbarkeit",
        paragraphs: [
          "Eine vorgeschlagene Lösung zu prüfen ist leicht: Werte einsetzen und jede Klausel einmal lesen. Eine Lösung zu finden ist etwas anderes, denn n Variablen erlauben 2ⁿ Belegungen, und niemand kennt ein Verfahren, das bei jeder Formel ohne exponentielle Laufzeit auskommt. 1971 bewies Stephen Cook, dass SAT NP-vollständig ist, unabhängig davon fand Leonid Levin dasselbe: Jedes Problem, dessen Lösungen sich schnell prüfen lassen, lässt sich in eine SAT-Formel übersetzen.",
          "Das hier benutzte Verfahren geht auf Davis, Putnam, Logemann und Loveland (1962) zurück. Es ist eine Tiefensuche mit einer entscheidenden Abkürzung: Sind in einer Klausel alle Literale bis auf eines falsch, ist das letzte erzwungen, und der Solver setzt es, ohne zu raten. Unten steht die erste Formel, mit der die Seite startet.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Drei Formeln stehen zur Wahl. Die erste hat vier Variablen und sechs Klauseln und ist erfüllbar, aber erst, nachdem der Solver eine falsche erste Vermutung zurückgenommen hat. Die zweite besteht aus allen acht Klauseln mit drei Literalen über a, b und c; jede verbietet genau eine der acht möglichen Belegungen, zusammen verbieten sie also alle. Die dritte hat fünf Variablen und sieben Klauseln und ist erfüllbar.",
          "Schritt führt genau eine DPLL-Aktion aus. Los wiederholt das automatisch im Tempo des Reglers, von 1 bis 12 Schritten pro Sekunde (voreingestellt 3), und hält von selbst an, sobald die Antwort feststeht; Pause und Zurücksetzen tun, was sie sagen.",
          "Jede Klausel ist nach ihrem Zustand unter der aktuellen Belegung eingefärbt: grün, wenn sie erfüllt ist, bernsteinfarben, wenn sie eine Unit-Klausel ist, in der genau ein Literal übrig bleibt, rosa, wenn alle Literale falsch sind, und neutral, solange nichts entschieden ist. Falsche Literale sind durchgestrichen. Der Suchpfad listet die Belegungen der Reihe nach: Violette Chips sind Entscheidungen (▼ für einen ersten Versuch, ⤺ für einen umgekippten), cyanfarbene sind durch Propagation erzwungen. Eine Zeile ganz unten erzählt jeden Zug mit.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Der ganze Solver ist eine reine Funktion, step(), die Formel und aktuellen Zustand nimmt und den nächsten Zustand zurückgibt. Sie probiert vier Dinge in fester Reihenfolge. Steht eine Klausel im Konflikt, setzt sie zurück. Sonst setzt sie, falls eine Klausel eine Unit ist, das erzwungene Literal. Sonst meldet sie, falls jede Variable einen Wert hat, Erfüllbarkeit. Sonst entscheidet sie: Sie nimmt die alphabetisch erste unbelegte Variable und setzt sie auf wahr.",
          "Das Backtracking ist chronologisch. Der Solver entfernt erzwungene Belegungen und bereits umgekippte Entscheidungen vom Ende des Pfads, bis er die jüngste Entscheidung erreicht, die erst in eine Richtung probiert wurde, und kippt diese. Wird der Pfad vorher leer, sind alle Zweige gescheitert und die Formel ist unerfüllbar. Klausellernen und geschickte Variablenreihenfolgen gibt es absichtlich nicht; genau die setzen moderne Solver auf dieses Gerüst.",
          "Los nutzt einen einfachen Timer und startet nie von selbst, es bewegt sich also nichts, solange du es nicht willst.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Die drei Läufe lesen",
        paragraphs: [
          "Die erste Formel braucht sieben Schritte. Der Solver rät a = wahr, Klausel 1 erzwingt daraufhin b = wahr, und in Klausel 2 sind alle Literale falsch. Er kippt a auf falsch; jetzt erzwingt Klausel 3 das c und Klausel 4 das d. Für b gibt es keine Bedingung mehr, aber jede Variable braucht einen Wert, also entscheidet der Solver b = wahr und meldet Erfüllbarkeit mit a = falsch und b, c, d wahr.",
          "Die unerfüllbare Formel braucht elf Schritte: Jede der vier Kombinationen von a und b endet damit, dass c in eine Richtung erzwungen wird und eine Klausel die andere verlangt. Die Formel mit fünf Variablen braucht nur sechs Schritte und kein einziges Backtracking: Nach a = wahr erzwingt die Propagation c, d und e, und nur b bleibt zu entscheiden.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Was eine falsche Vermutung kostet",
        text: "Drück bei der ersten Formel mehrmals auf Schritt. Nach dem zweiten Schritt wird Klausel 2 rosa, der dritte kippt den violetten Chip für a von ▼ zu ⤺. Eine falsche Entscheidung kostet hier zwei zusätzliche Schritte, in einer großen Formel womöglich einen riesigen Teilbaum.",
      },
      {
        title: "Ein Nein beweisen",
        text: "Wähle die unerfüllbare Formel und drück Los bei 2 Schritten pro Sekunde. Der Solver besucht alle vier Zweige für a und b, und erst wenn das Backtracking über die Wurzel hinausläuft, erklärt er die Formel für unerfüllbar. Ein «Nein» braucht den ganzen Baum; ein kurzes Zertifikat zum Nachprüfen gibt es nicht.",
      },
      {
        title: "Die Propagation arbeiten lassen",
        text: "Wähle die Formel mit fünf Variablen und geh sie Schritt für Schritt durch. Zähl die Chips: zwei Entscheidungen, drei Propagationen, kein Backtracking. Die Unit-Propagation ist der Grund, warum DPLL das blinde Durchprobieren aller 32 Belegungen schlägt.",
      },
      {
        title: "Das Zertifikat selbst prüfen",
        text: "Sobald die erste Formel als erfüllbar gemeldet ist, nimm a = falsch, b = wahr, c = wahr, d = wahr und prüf alle sechs Klauseln von Hand. Das dauert ein paar Sekunden, und genau das ist die Asymmetrie im Herzen von NP: Finden ist schwer, Prüfen ist leicht.",
      },
    ],
  },
  es: {
    metaDescription:
      "Mira trabajar paso a paso un solver SAT con DPLL: decisiones, propagación unitaria y retroceso sobre tres fórmulas en FNC, una de ellas insatisfacible.",
    heading: "Cómo funciona este explorador",
    intro:
      "La fórmula del centro está escrita en forma normal conjuntiva: una lista de cláusulas unidas por Y, donde cada cláusula son unos pocos literales unidos por O. La pregunta es si alguna asignación de verdadero y falso a las variables hace verdaderas todas las cláusulas a la vez. El solver la responde con DPLL, el procedimiento de retroceso que sigue siendo el esqueleto de los solvers SAT modernos, y lo hace con un movimiento por clic, para que puedas seguir cada conjetura, cada consecuencia forzada y cada retirada.",
    sections: [
      {
        heading: "Satisfacibilidad",
        paragraphs: [
          "Comprobar una respuesta propuesta es fácil: sustituyes los valores y lees cada cláusula una vez. Encontrar una respuesta es otra historia, porque n variables admiten 2ⁿ asignaciones, y nadie conoce un método que evite el tiempo exponencial en todas las fórmulas. En 1971 Stephen Cook demostró que SAT es NP-completo, y Leonid Levin llegó a lo mismo de forma independiente: todo problema cuyas soluciones se comprueban rápido puede traducirse a una fórmula SAT.",
          "El procedimiento que se usa aquí se remonta a Davis, Putnam, Logemann y Loveland (1962). Es una búsqueda en profundidad con un atajo crucial: siempre que una cláusula tiene todos sus literales falsos menos uno, ese último literal queda forzado, así que el solver lo fija sin adivinar. Debajo está el primer ejemplo, la fórmula con la que se abre la página.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Hay tres fórmulas disponibles. La primera tiene cuatro variables y seis cláusulas y es satisfacible, pero solo después de que el solver se retire de una primera conjetura equivocada. La segunda consta de las ocho cláusulas de tres literales sobre a, b y c; cada una prohíbe exactamente una de las ocho asignaciones posibles, así que juntas las prohíben todas. La tercera tiene cinco variables y siete cláusulas y es satisfacible.",
          "«Paso» ejecuta exactamente una acción de DPLL. «Reproducir» la repite de forma automática a la velocidad que marca el deslizador, de 1 a 12 pasos por segundo (3 por defecto), y se detiene sola cuando se encuentra la respuesta; «Pausa» y «Reiniciar» hacen lo que dicen.",
          "Cada cláusula se colorea según su estado bajo la asignación actual: verde cuando está satisfecha, ámbar cuando es una cláusula unitaria a la que le queda exactamente un literal por forzar, rosa cuando todos los literales son falsos, y neutra mientras sigue indecisa. Los literales falsos aparecen tachados. La ruta de búsqueda enumera las asignaciones en orden: las fichas violetas son decisiones (▼ para una primera conjetura, ⤺ para una volteada), las fichas cian están forzadas por propagación. Una línea en la parte inferior narra cada movimiento.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Todo el solver es una única función pura, step(), que recibe la fórmula y el estado actual y devuelve el estado siguiente. Intenta cuatro cosas en un orden fijo. Si alguna cláusula está en conflicto, retrocede. Si no, y alguna cláusula es unitaria, fija el literal forzado. Si no, y todas las variables tienen valor, la fórmula está satisfecha. Si no, decide: toma la primera variable sin asignar en orden alfabético y la pone a verdadero.",
          "El retroceso es cronológico. El solver va quitando del final de la traza las asignaciones forzadas y las decisiones que ya ha volteado hasta llegar a la decisión más reciente que solo se ha probado en un sentido, y entonces voltea esa. Si la traza se vacía antes, todas las ramas han fracasado y la fórmula es insatisfacible. A propósito, no hay aprendizaje de cláusulas ni un orden de variables ingenioso; los solvers modernos añaden justo eso sobre este esqueleto.",
          "«Reproducir» usa un temporizador sencillo y nunca arranca por su cuenta, así que nada se mueve si no lo pides.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Cómo leer las tres ejecuciones",
        paragraphs: [
          "La primera fórmula necesita siete pasos. El solver supone a = verdadero, la cláusula 1 fuerza entonces b = verdadero, y la cláusula 2 se queda con todos sus literales falsos. Voltea a a falso; ahora la cláusula 3 fuerza c y la cláusula 4 fuerza d. Ya nada restringe b, pero toda variable necesita un valor, así que el solver decide b = verdadero e informa de que la fórmula es satisfacible con a = falso y b, c, d verdaderos.",
          "La fórmula insatisfacible necesita once pasos: cada una de las cuatro combinaciones de a y b termina con c forzada en un sentido y una cláusula que exige el otro. La fórmula de cinco variables solo necesita seis pasos y ni un solo retroceso: tras a = verdadero, la propagación fuerza c, d y e, y solo queda b por decidir.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "El coste de una mala conjetura",
        text: "Con la primera fórmula, pulsa «Paso» varias veces. Tras el segundo paso la cláusula 2 se vuelve rosa; el tercer paso cambia la ficha violeta de a de ▼ a ⤺. Una decisión equivocada ha costado aquí dos pasos de más; en una fórmula grande puede costar un subárbol enorme.",
      },
      {
        title: "Demuestra una negación",
        text: "Selecciona la fórmula insatisfacible y pulsa «Reproducir» a 2 pasos por segundo. El solver visita las cuatro ramas de a y b, y solo cuando el retroceso pasa de la raíz declara la fórmula insatisfacible. Una respuesta «no» necesita el árbol entero; no hay un certificado corto que comprobar.",
      },
      {
        title: "Deja que la propagación haga el trabajo",
        text: "Selecciona la fórmula de cinco variables y avanza paso a paso. Cuenta las fichas: dos decisiones, tres propagaciones, cero retrocesos. La propagación unitaria es la razón por la que DPLL supera a la enumeración a ciegas de las 32 asignaciones.",
      },
      {
        title: "Comprueba tú el certificado",
        text: "Cuando la primera fórmula se declare satisfacible, toma a = falso, b = verdadero, c = verdadero, d = verdadero y comprueba a mano cada una de las seis cláusulas. Lleva unos segundos, y esa es la asimetría que está en el corazón de NP: encontrar es difícil, comprobar es fácil.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Regarde un solveur SAT DPLL travailler pas à pas : décisions, propagation unitaire et retour arrière sur trois formules en FNC, dont une insatisfaisable.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "La formule au centre est écrite en forme normale conjonctive : une liste de clauses reliées par ET, chaque clause étant formée de quelques littéraux reliés par OU. La question est de savoir si une affectation de vrai et de faux aux variables rend toutes les clauses vraies en même temps. Le solveur y répond avec DPLL, la procédure de retour arrière qui constitue encore l'ossature des solveurs SAT modernes, et il le fait à raison d'un coup par clic, pour que tu puisses suivre chaque pari, chaque conséquence forcée et chaque repli.",
    sections: [
      {
        heading: "Satisfaisabilité",
        paragraphs: [
          "Vérifier une réponse proposée est facile : on remplace les variables par leurs valeurs et on lit chaque clause une fois. Trouver une réponse est une autre affaire, car n variables autorisent 2ⁿ affectations, et personne ne connaît de méthode qui évite un temps exponentiel sur toutes les formules. En 1971, Stephen Cook a démontré que SAT est NP-complet, et Leonid Levin est arrivé au même résultat de son côté : tout problème dont les solutions se vérifient vite peut être traduit en une formule SAT.",
          "La procédure utilisée ici remonte à Davis, Putnam, Logemann et Loveland (1962). C'est une recherche en profondeur dotée d'un raccourci décisif : dès qu'une clause a tous ses littéraux faux sauf un, ce dernier littéral est forcé, et le solveur le fixe sans deviner. Ci-dessous figure le premier exemple, la formule sur laquelle la page s'ouvre.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Trois formules sont proposées. La première a quatre variables et six clauses et elle est satisfaisable, mais seulement après que le solveur est revenu sur un premier pari erroné. La deuxième réunit les huit clauses à trois littéraux sur a, b et c ; chacune interdit exactement une des huit affectations possibles, si bien qu'ensemble elles les interdisent toutes. La troisième a cinq variables et sept clauses et elle est satisfaisable.",
          "« Pas » exécute exactement une action de DPLL. « Lecture » la répète automatiquement à la vitesse fixée par le curseur, de 1 à 12 pas par seconde (3 par défaut), et s'arrête d'elle-même quand la réponse est trouvée ; « Pause » et « Réinitialiser » font ce que leur nom indique.",
          "Chaque clause est colorée selon son état sous l'affectation courante : verte quand elle est satisfaite, ambre quand c'est une clause unitaire à laquelle il reste exactement un littéral à forcer, rose quand tous ses littéraux sont faux, et neutre tant qu'elle est indécise. Les littéraux faux sont barrés. Le chemin de recherche liste les affectations dans l'ordre : les jetons violets sont des décisions (▼ pour un premier pari, ⤺ pour une décision inversée), les jetons cyan sont forcés par propagation. Une ligne en bas raconte chaque coup.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Tout le solveur tient en une seule fonction pure, step(), qui reçoit la formule et l'état courant et renvoie l'état suivant. Elle essaie quatre choses dans un ordre fixe. Si une clause est en conflit, elle revient en arrière. Sinon, si une clause est unitaire, elle fixe le littéral forcé. Sinon, si toutes les variables ont une valeur, la formule est satisfaite. Sinon, elle décide : elle prend la première variable non affectée dans l'ordre alphabétique et la met à vrai.",
          "Le retour arrière est chronologique. Le solveur retire de la fin de la trace les affectations forcées et les décisions déjà inversées jusqu'à atteindre la décision la plus récente qui n'a été essayée que dans un sens, puis il inverse celle-là. Si la trace se vide avant, toutes les branches ont échoué et la formule est insatisfaisable. Il n'y a délibérément ni apprentissage de clauses ni ordre astucieux des variables ; les solveurs modernes ajoutent précisément cela par-dessus cette ossature.",
          "« Lecture » utilise un simple minuteur et ne démarre jamais toute seule : rien ne bouge tant que tu ne le demandes pas.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Lire les trois déroulements",
        paragraphs: [
          "La première formule demande sept pas. Le solveur parie sur a = vrai, la clause 1 force alors b = vrai, et la clause 2 se retrouve avec tous ses littéraux faux. Il inverse a, qui devient faux ; la clause 3 force maintenant c et la clause 4 force d. Plus rien ne contraint b, mais chaque variable a besoin d'une valeur : le solveur décide donc b = vrai et annonce que la formule est satisfaisable, avec a = faux et b, c, d vrais.",
          "La formule insatisfaisable demande onze pas : chacune des quatre combinaisons de a et b se termine avec c forcé dans un sens et une clause qui exige l'autre. La formule à cinq variables ne demande que six pas et pas un seul retour arrière : après a = vrai, la propagation force c, d et e, et il ne reste que b à décider.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Le prix d'un mauvais pari",
        text: "Avec la première formule, appuie plusieurs fois sur « Pas ». Après le deuxième pas, la clause 2 devient rose ; le troisième pas fait passer le jeton violet de a de ▼ à ⤺. Une seule mauvaise décision a coûté ici deux pas de plus ; dans une grande formule, elle peut coûter un sous-arbre gigantesque.",
      },
      {
        title: "Prouve une réponse négative",
        text: "Sélectionne la formule insatisfaisable et appuie sur « Lecture » à 2 pas par seconde. Le solveur visite les quatre branches pour a et b, et ce n'est que lorsque le retour arrière dépasse la racine qu'il déclare la formule insatisfaisable. Une réponse « non » exige l'arbre entier ; il n'existe pas de certificat court à vérifier.",
      },
      {
        title: "Laisse la propagation faire le travail",
        text: "Sélectionne la formule à cinq variables et avance pas à pas. Compte les jetons : deux décisions, trois propagations, zéro retour arrière. C'est grâce à la propagation unitaire que DPLL fait mieux que l'énumération aveugle des 32 affectations.",
      },
      {
        title: "Vérifie toi-même le certificat",
        text: "Une fois la première formule déclarée satisfaisable, prends a = faux, b = vrai, c = vrai, d = vrai et vérifie à la main chacune des six clauses. Cela prend quelques secondes, et c'est là l'asymétrie au cœur de NP : trouver est difficile, vérifier est facile.",
      },
    ],
  },
  it: {
    metaDescription:
      "Guarda un SAT solver DPLL lavorare passo dopo passo: decisioni, propagazione unitaria e backtracking su tre formule CNF, di cui una insoddisfacibile.",
    heading: "Come funziona questo esploratore",
    intro:
      "La formula al centro è scritta in forma normale congiuntiva: un elenco di clausole unite da AND, dove ogni clausola è fatta di pochi letterali uniti da OR. La domanda è se esista un assegnamento di vero e falso alle variabili che renda vere tutte le clausole insieme. Il solver risponde con DPLL, la procedura di backtracking che costituisce ancora oggi lo scheletro dei SAT solver moderni, e lo fa una mossa per clic, così puoi seguire ogni tentativo, ogni conseguenza forzata e ogni ritirata.",
    sections: [
      {
        heading: "Soddisfacibilità",
        paragraphs: [
          "Verificare una risposta proposta è facile: sostituisci i valori e leggi ogni clausola una volta. Trovare una risposta è tutta un'altra faccenda, perché n variabili ammettono 2ⁿ assegnamenti, e nessuno conosce un metodo che eviti il tempo esponenziale su ogni formula. Nel 1971 Stephen Cook dimostrò che SAT è NP-completo, e Leonid Levin arrivò allo stesso risultato in modo indipendente: ogni problema le cui soluzioni si verificano in fretta può essere tradotto in una formula SAT.",
          "La procedura usata qui risale a Davis, Putnam, Logemann e Loveland (1962). È una ricerca in profondità con una scorciatoia decisiva: ogni volta che una clausola ha tutti i letterali falsi tranne uno, quell'ultimo letterale è forzato, e il solver lo imposta senza tirare a indovinare. Qui sotto trovi il primo esempio, la formula con cui si apre la pagina.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Sono disponibili tre formule. La prima ha quattro variabili e sei clausole ed è soddisfacibile, ma solo dopo che il solver si è tirato fuori da un primo tentativo sbagliato. La seconda è composta da tutte le otto clausole di tre letterali su a, b e c; ciascuna vieta esattamente uno degli otto assegnamenti possibili, quindi insieme li vietano tutti. La terza ha cinque variabili e sette clausole ed è soddisfacibile.",
          "«Passo» esegue esattamente un'azione di DPLL. «Avvia» la ripete in automatico alla velocità impostata dal cursore, da 1 a 12 passi al secondo (3 come valore predefinito), e si ferma da solo quando la risposta è stata trovata; «Pausa» e «Azzera» fanno quello che dicono.",
          "Ogni clausola è colorata in base al suo stato sotto l'assegnamento attuale: verde quando è soddisfatta, ambra quando è una clausola unitaria a cui resta esattamente un letterale da forzare, rosa quando tutti i letterali sono falsi, e neutra finché è indecisa. I letterali falsi sono barrati. Il percorso di ricerca elenca gli assegnamenti in ordine: le etichette viola sono decisioni (▼ per un primo tentativo, ⤺ per una decisione ribaltata), le etichette ciano sono forzate dalla propagazione. Una riga in basso racconta ogni mossa.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "L'intero solver è un'unica funzione pura, step(), che riceve la formula e lo stato attuale e restituisce lo stato successivo. Prova quattro cose in un ordine fisso. Se qualche clausola è in conflitto, torna indietro. Altrimenti, se qualche clausola è unitaria, imposta il letterale forzato. Altrimenti, se ogni variabile ha un valore, la formula è soddisfatta. Altrimenti decide: prende la prima variabile non assegnata in ordine alfabetico e la imposta a vero.",
          "Il backtracking è cronologico. Il solver toglie dalla fine della traccia gli assegnamenti forzati e le decisioni che ha già ribaltato, finché arriva alla decisione più recente provata in un solo verso, e poi ribalta quella. Se la traccia si svuota prima, ogni ramo è fallito e la formula è insoddisfacibile. Di proposito non ci sono né apprendimento di clausole né un ordinamento furbo delle variabili; i solver moderni aggiungono proprio questo sopra lo stesso scheletro.",
          "«Avvia» usa un semplice timer e non parte mai da solo, quindi non si muove nulla se non lo chiedi tu.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Leggere le tre esecuzioni",
        paragraphs: [
          "La prima formula richiede sette passi. Il solver tenta a = vero, la clausola 1 forza allora b = vero, e la clausola 2 resta con tutti i letterali falsi. Ribalta a su falso; ora la clausola 3 forza c e la clausola 4 forza d. Nulla vincola più b, ma ogni variabile ha bisogno di un valore, quindi il solver decide b = vero e dichiara la formula soddisfacibile con a = falso e b, c, d veri.",
          "La formula insoddisfacibile richiede undici passi: ognuna delle quattro combinazioni di a e b finisce con c forzata in un verso e una clausola che pretende l'altro. La formula a cinque variabili richiede solo sei passi e nemmeno un backtracking: dopo a = vero, la propagazione forza c, d ed e, e resta da decidere soltanto b.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Il costo di un tentativo sbagliato",
        text: "Con la prima formula, premi «Passo» più volte. Dopo il secondo passo la clausola 2 diventa rosa; il terzo passo cambia l'etichetta viola di a da ▼ a ⤺. Qui una decisione sbagliata è costata due passi in più; in una formula grande può costare un sottoalbero enorme.",
      },
      {
        title: "Dimostra una risposta negativa",
        text: "Seleziona la formula insoddisfacibile e premi «Avvia» a 2 passi al secondo. Il solver visita tutti e quattro i rami per a e b, e solo quando il backtracking supera la radice dichiara la formula insoddisfacibile. Una risposta «no» richiede l'albero intero; non esiste un certificato breve da verificare.",
      },
      {
        title: "Lascia lavorare la propagazione",
        text: "Seleziona la formula a cinque variabili e procedi un passo alla volta. Conta le etichette: due decisioni, tre propagazioni, zero backtracking. La propagazione unitaria è il motivo per cui DPLL batte l'enumerazione alla cieca di tutti i 32 assegnamenti.",
      },
      {
        title: "Verifica il certificato di persona",
        text: "Quando la prima formula viene dichiarata soddisfacibile, prendi a = falso, b = vero, c = vero, d = vero e controlla a mano ciascuna delle sei clausole. Bastano pochi secondi, ed è questa l'asimmetria al cuore di NP: trovare è difficile, verificare è facile.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Vê um solver SAT com DPLL a trabalhar passo a passo: decisões, propagação unitária e retrocesso em três fórmulas em FNC, uma delas insatisfazível.",
    heading: "Como funciona este explorador",
    intro:
      "A fórmula ao centro está escrita em forma normal conjuntiva: uma lista de cláusulas ligadas por E, em que cada cláusula é um punhado de literais ligados por OU. A pergunta é se alguma atribuição de verdadeiro e falso às variáveis torna todas as cláusulas verdadeiras ao mesmo tempo. O solver responde com DPLL, o procedimento de retrocesso que ainda hoje forma o esqueleto dos solvers SAT modernos, e fá-lo com uma jogada por clique, para que possas seguir cada palpite, cada consequência forçada e cada recuo.",
    sections: [
      {
        heading: "Satisfazibilidade",
        paragraphs: [
          "Verificar uma resposta proposta é fácil: substituis os valores e lês cada cláusula uma vez. Encontrar uma resposta é outra conversa, porque n variáveis admitem 2ⁿ atribuições, e ninguém conhece um método que evite o tempo exponencial em todas as fórmulas. Em 1971, Stephen Cook demonstrou que SAT é NP-completo, e Leonid Levin chegou ao mesmo resultado de forma independente: todo o problema cujas soluções se verificam depressa pode ser traduzido numa fórmula SAT.",
          "O procedimento usado aqui remonta a Davis, Putnam, Logemann e Loveland (1962). É uma busca em profundidade com um atalho crucial: sempre que uma cláusula tem todos os literais falsos menos um, esse último literal fica forçado, e o solver define-o sem adivinhar. Abaixo está o primeiro exemplo, a fórmula com que a página abre.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Há três fórmulas disponíveis. A primeira tem quatro variáveis e seis cláusulas e é satisfazível, mas só depois de o solver recuar de um primeiro palpite errado. A segunda é composta por todas as oito cláusulas de três literais sobre a, b e c; cada uma proíbe exatamente uma das oito atribuições possíveis, pelo que juntas as proíbem todas. A terceira tem cinco variáveis e sete cláusulas e é satisfazível.",
          "«Passo» executa exatamente uma ação de DPLL. «Reproduzir» repete-a automaticamente à velocidade definida pelo cursor, de 1 a 12 passos por segundo (3 por omissão), e para sozinho quando a resposta é encontrada; «Pausa» e «Reiniciar» fazem o que dizem.",
          "Cada cláusula é colorida conforme o seu estado sob a atribuição atual: verde quando está satisfeita, âmbar quando é uma cláusula unitária a que resta exatamente um literal por forçar, rosa quando todos os literais são falsos, e neutra enquanto está indecisa. Os literais falsos aparecem riscados. O caminho de busca lista as atribuições por ordem: as fichas violeta são decisões (▼ para um primeiro palpite, ⤺ para uma decisão invertida), as fichas ciano são forçadas por propagação. Uma linha ao fundo narra cada jogada.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "O solver inteiro é uma única função pura, step(), que recebe a fórmula e o estado atual e devolve o estado seguinte. Tenta quatro coisas numa ordem fixa. Se alguma cláusula está em conflito, retrocede. Caso contrário, se alguma cláusula é unitária, define o literal forçado. Caso contrário, se todas as variáveis têm valor, a fórmula está satisfeita. Caso contrário, decide: escolhe a primeira variável por atribuir, por ordem alfabética, e põe-na a verdadeiro.",
          "O retrocesso é cronológico. O solver retira do fim do rasto as atribuições forçadas e as decisões que já inverteu, até chegar à decisão mais recente que só foi tentada num sentido, e depois inverte essa. Se o rasto ficar vazio antes disso, todos os ramos falharam e a fórmula é insatisfazível. De propósito, não há aprendizagem de cláusulas nem uma ordenação engenhosa das variáveis; os solvers modernos acrescentam exatamente isso por cima deste esqueleto.",
          "«Reproduzir» usa um temporizador simples e nunca arranca sozinho, por isso nada se mexe a menos que o peças.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Ler as três execuções",
        paragraphs: [
          "A primeira fórmula leva sete passos. O solver arrisca a = verdadeiro, a cláusula 1 força então b = verdadeiro, e a cláusula 2 fica com todos os literais falsos. Inverte a para falso; agora a cláusula 3 força c e a cláusula 4 força d. Já nada restringe b, mas todas as variáveis precisam de um valor, por isso o solver decide b = verdadeiro e declara a fórmula satisfazível com a = falso e b, c, d verdadeiros.",
          "A fórmula insatisfazível leva onze passos: cada uma das quatro combinações de a e b termina com c forçada num sentido e uma cláusula a exigir o outro. A fórmula de cinco variáveis precisa apenas de seis passos e de nem um único retrocesso: depois de a = verdadeiro, a propagação força c, d e e, e só fica b por decidir.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "O custo de um mau palpite",
        text: "Com a primeira fórmula, carrega em «Passo» várias vezes. Depois do segundo passo, a cláusula 2 fica rosa; o terceiro passo muda a ficha violeta de a de ▼ para ⤺. Uma decisão errada custou aqui dois passos a mais; numa fórmula grande pode custar uma subárvore enorme.",
      },
      {
        title: "Provar uma resposta negativa",
        text: "Seleciona a fórmula insatisfazível e carrega em «Reproduzir» a 2 passos por segundo. O solver visita os quatro ramos para a e b, e só quando o retrocesso passa da raiz é que declara a fórmula insatisfazível. Uma resposta «não» precisa da árvore inteira; não há um certificado curto para verificar.",
      },
      {
        title: "Deixa a propagação fazer o trabalho",
        text: "Seleciona a fórmula de cinco variáveis e avança passo a passo. Conta as fichas: duas decisões, três propagações, zero retrocessos. A propagação unitária é a razão pela qual o DPLL bate a enumeração às cegas das 32 atribuições.",
      },
      {
        title: "Verifica tu o certificado",
        text: "Depois de a primeira fórmula ser declarada satisfazível, toma a = falso, b = verdadeiro, c = verdadeiro, d = verdadeiro e verifica à mão cada uma das seis cláusulas. Demora uns segundos, e é essa a assimetria no coração de NP: encontrar é difícil, verificar é fácil.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Se en DPLL-baserad SAT-lösare arbeta steg för steg: beslut, enhetspropagering och backtracking på tre KNF-formler, varav en är bevisligen osatisfierbar.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Formeln i mitten är skriven på konjunktiv normalform: en lista av klausuler som binds ihop med OCH, där varje klausul är några literaler som binds ihop med ELLER. Frågan är om någon tilldelning av sant och falskt till variablerna gör alla klausuler sanna på en gång. Lösaren besvarar den med DPLL, den backtrackingmetod som fortfarande utgör skelettet i moderna SAT-lösare, och den gör det ett drag per klick, så att du kan följa varje gissning, varje framtvingad följd och varje reträtt.",
    sections: [
      {
        heading: "Satisfierbarhet",
        paragraphs: [
          "Att kontrollera ett föreslaget svar är lätt: sätt in värdena och läs varje klausul en gång. Att hitta ett svar är en annan sak, eftersom n variabler tillåter 2ⁿ tilldelningar, och ingen känner till en metod som undviker exponentiell tid för varje formel. År 1971 bevisade Stephen Cook att SAT är NP-fullständigt, och Leonid Levin kom fram till samma sak oberoende av honom: varje problem vars lösningar går snabbt att kontrollera kan översättas till en SAT-formel.",
          "Metoden som används här går tillbaka till Davis, Putnam, Logemann och Loveland (1962). Den är en djupet-först-sökning med en avgörande genväg: så fort en klausul har alla literaler utom en falska är den sista literalen tvingad, så lösaren sätter den utan att gissa. Nedan står det första exemplet, formeln som sidan öppnar med.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Det finns tre formler att välja mellan. Den första har fyra variabler och sex klausuler och är satisfierbar, men först efter att lösaren har backat ur en felaktig första gissning. Den andra består av alla åtta klausuler med tre literaler över a, b och c; var och en förbjuder exakt en av de åtta möjliga tilldelningarna, så tillsammans förbjuder de alla. Den tredje har fem variabler och sju klausuler och är satisfierbar.",
          "”Steg” utför exakt en DPLL-åtgärd. ”Spela” upprepar den automatiskt i den hastighet som reglaget anger, från 1 till 12 steg per sekund (3 som standard), och stannar av sig själv när svaret är funnet; ”Paus” och ”Återställ” gör vad de heter.",
          "Varje klausul färgas efter sitt tillstånd under den aktuella tilldelningen: grön när den är satisfierad, bärnstensgul när den är en enhetsklausul med exakt en literal kvar att tvinga, rosa när alla literaler är falska och neutral så länge den är obestämd. Falska literaler är överstrukna. Sökvägen listar tilldelningarna i ordning: violetta brickor är beslut (▼ för en första gissning, ⤺ för ett vänt beslut), cyanfärgade brickor är tvingade av propagering. En rad längst ner berättar om varje drag.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Hela lösaren är en enda ren funktion, step(), som tar formeln och det aktuella tillståndet och returnerar nästa tillstånd. Den prövar fyra saker i en fast ordning. Om någon klausul är i konflikt backar den. Annars, om någon klausul är en enhetsklausul, sätter lösaren den tvingade literalen. Annars, om varje variabel har ett värde, är formeln satisfierad. Annars fattar den ett beslut: den tar den första otilldelade variabeln i bokstavsordning och sätter den till sant.",
          "Backtrackingen är kronologisk. Lösaren tar bort tvingade tilldelningar och beslut som den redan har vänt från slutet av spåret tills den når det senaste beslutet som bara har prövats åt ett håll, och vänder sedan det. Om spåret töms först har varje gren misslyckats och formeln är osatisfierbar. Det finns avsiktligt ingen klausulinlärning och ingen smart variabelordning; moderna lösare lägger till just detta ovanpå det här skelettet.",
          "”Spela” använder en vanlig timer och startar aldrig av sig själv, så ingenting rör sig om du inte ber om det.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Att läsa de tre körningarna",
        paragraphs: [
          "Den första formeln tar sju steg. Lösaren gissar a = sant, klausul 1 tvingar då b = sant, och klausul 2 står kvar med alla literaler falska. Den vänder a till falskt; nu tvingar klausul 3 fram c och klausul 4 fram d. Ingenting begränsar b längre, men varje variabel behöver ett värde, så lösaren beslutar b = sant och rapporterar att formeln är satisfierbar med a = falskt och b, c, d sanna.",
          "Den osatisfierbara formeln tar elva steg: var och en av de fyra kombinationerna av a och b slutar med att c tvingas åt ett håll medan en klausul kräver det andra. Formeln med fem variabler behöver bara sex steg och inte en enda backning: efter a = sant tvingar propageringen fram c, d och e, och bara b återstår att besluta.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Priset för en dålig gissning",
        text: "Tryck på ”Steg” flera gånger med den första formeln. Efter det andra steget blir klausul 2 rosa; det tredje steget ändrar den violetta brickan för a från ▼ till ⤺. Ett felaktigt beslut kostade två extra steg här; i en stor formel kan det kosta ett enormt delträd.",
      },
      {
        title: "Bevisa ett nej",
        text: "Välj den osatisfierbara formeln och tryck på ”Spela” med 2 steg per sekund. Lösaren besöker alla fyra grenarna för a och b, och först när backtrackingen går förbi roten förklarar den formeln osatisfierbar. Ett ”nej” kräver hela trädet; det finns inget kort certifikat att kontrollera.",
      },
      {
        title: "Låt propageringen göra jobbet",
        text: "Välj formeln med fem variabler och stega igenom den. Räkna brickorna: två beslut, tre propageringar, noll backningar. Enhetspropagering är skälet till att DPLL slår en blind uppräkning av alla 32 tilldelningar.",
      },
      {
        title: "Kontrollera certifikatet själv",
        text: "När den första formeln har rapporterats som satisfierbar tar du a = falskt, b = sant, c = sant, d = sant och kontrollerar var och en av de sex klausulerna för hand. Det tar några sekunder, och det är asymmetrin i hjärtat av NP: att hitta är svårt, att kontrollera är lätt.",
      },
    ],
  },
  no: {
    metaDescription:
      "Se en DPLL-basert SAT-løser arbeide steg for steg: beslutninger, enhetspropagering og tilbakesporing på tre KNF-formler, der én beviselig er uoppfyllbar.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Formelen i midten er skrevet på konjunktiv normalform: en liste med klausuler bundet sammen med OG, der hver klausul er noen få literaler bundet sammen med ELLER. Spørsmålet er om en tilordning av sann og usann til variablene gjør alle klausulene sanne på én gang. Løseren svarer med DPLL, metoden med tilbakesporing (backtracking) som fortsatt er skjelettet i moderne SAT-løsere, og den gjør det ett trekk per klikk, slik at du kan følge hver gjetning, hver tvungen følge og hver retrett.",
    sections: [
      {
        heading: "Oppfyllbarhet",
        paragraphs: [
          "Det er lett å kontrollere et foreslått svar: Sett inn verdiene og les hver klausul én gang. Å finne et svar er noe helt annet, fordi n variabler gir 2ⁿ tilordninger, og ingen kjenner en metode som unngår eksponentiell tid på alle formler. I 1971 beviste Stephen Cook at SAT er NP-komplett, og Leonid Levin fant det samme uavhengig av ham: Ethvert problem der løsningene er raske å kontrollere, kan oversettes til en SAT-formel.",
          "Metoden som brukes her, går tilbake til Davis, Putnam, Logemann og Loveland (1962). Den er et dybde-først-søk med én avgjørende snarvei: Hver gang en klausul har alle literaler unntatt én usanne, er den siste literalen tvunget, så løseren setter den uten å gjette. Under står det første eksempelet, formelen siden åpner med.",
        ],
        formula:
          "(\\lnot a \\lor b) \\land (\\lnot a \\lor \\lnot b) \\land (a \\lor c) \\land (\\lnot c \\lor d) \\land (c \\lor \\lnot d) \\land (a \\lor d)",
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Tre formler er tilgjengelige. Den første har fire variabler og seks klausuler og er oppfyllbar, men først etter at løseren har trukket seg ut av en feil første gjetning. Den andre består av alle åtte klausuler med tre literaler over a, b og c; hver av dem forbyr nøyaktig én av de åtte mulige tilordningene, så sammen forbyr de alle. Den tredje har fem variabler og sju klausuler og er oppfyllbar.",
          "«Steg» utfører nøyaktig én DPLL-handling. «Spill» gjentar den automatisk i hastigheten glidebryteren angir, fra 1 til 12 steg per sekund (3 som standard), og stopper av seg selv når svaret er funnet. «Pause» og «Nullstill» gjør det de sier.",
          "Hver klausul farges etter tilstanden sin under den gjeldende tilordningen: grønn når den er oppfylt, ravgul når den er en enhetsklausul med nøyaktig én literal igjen å tvinge, rosa når alle literalene er usanne, og nøytral så lenge den er ubestemt. Usanne literaler er strøket over. Søkestien lister tilordningene i rekkefølge: Fiolette brikker er beslutninger (▼ for en første gjetning, ⤺ for en vendt beslutning), cyan brikker er tvunget fram av propagering. En linje nederst forteller om hvert trekk.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Hele løseren er én ren funksjon, step(), som tar formelen og den gjeldende tilstanden og returnerer neste tilstand. Den prøver fire ting i fast rekkefølge. Hvis en klausul er i konflikt, går den tilbake. Ellers, hvis en klausul er en enhetsklausul, setter den den tvungne literalen. Ellers, hvis alle variablene har en verdi, er formelen oppfylt. Ellers tar den en beslutning: Den velger den første variabelen uten verdi i alfabetisk rekkefølge og setter den til sann.",
          "Tilbakesporingen er kronologisk. Løseren fjerner tvungne tilordninger og beslutninger den allerede har vendt, fra slutten av sporet, helt til den når den nyeste beslutningen som bare er prøvd én vei, og så vender den denne. Hvis sporet blir tomt først, har alle grenene feilet, og formelen er uoppfyllbar. Det er med vilje ingen klausullæring og ingen smart variabelrekkefølge; moderne løsere legger nettopp dette oppå dette skjelettet.",
          "«Spill» bruker en vanlig timer og starter aldri av seg selv, så ingenting beveger seg uten at du ber om det.",
        ],
        code: BACKTRACK_EXCERPT,
      },
      {
        heading: "Slik leser du de tre kjøringene",
        paragraphs: [
          "Den første formelen tar sju steg. Løseren gjetter a = sann, klausul 1 tvinger da fram b = sann, og klausul 2 står igjen med alle literalene usanne. Den vender a til usann; nå tvinger klausul 3 fram c og klausul 4 fram d. Ingenting begrenser b lenger, men hver variabel trenger en verdi, så løseren beslutter b = sann og melder at formelen er oppfyllbar med a = usann og b, c, d sanne.",
          "Den uoppfyllbare formelen tar elleve steg: Hver av de fire kombinasjonene av a og b ender med at c tvinges én vei mens en klausul krever den andre. Formelen med fem variabler trenger bare seks steg og ikke én eneste tilbakesporing: Etter a = sann tvinger propageringen fram c, d og e, og bare b gjenstår å beslutte.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Prisen for én dårlig gjetning",
        text: "Trykk på «Steg» flere ganger med den første formelen. Etter det andre steget blir klausul 2 rosa; det tredje steget endrer den fiolette brikken for a fra ▼ til ⤺. Én feil beslutning kostet to ekstra steg her; i en stor formel kan den koste et enormt deltre.",
      },
      {
        title: "Bevis et nei",
        text: "Velg den uoppfyllbare formelen og trykk på «Spill» med 2 steg per sekund. Løseren besøker alle fire grenene for a og b, og først når tilbakesporingen går forbi roten, erklærer den formelen uoppfyllbar. Et «nei» krever hele treet; det finnes ikke noe kort sertifikat å kontrollere.",
      },
      {
        title: "La propageringen gjøre jobben",
        text: "Velg formelen med fem variabler og gå gjennom den steg for steg. Tell brikkene: to beslutninger, tre propageringer, null tilbakesporinger. Enhetspropagering er grunnen til at DPLL slår blind opplisting av alle 32 tilordninger.",
      },
      {
        title: "Kontroller sertifikatet selv",
        text: "Når den første formelen er meldt oppfyllbar, tar du a = usann, b = sann, c = sann, d = sann og kontrollerer hver av de seks klausulene for hånd. Det tar noen sekunder, og det er asymmetrien i hjertet av NP: Å finne er vanskelig, å kontrollere er lett.",
      },
    ],
  },
};
