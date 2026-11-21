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
};
