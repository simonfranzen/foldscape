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
        formula:
          "\\varphi = (x_1 \\lor x_2 \\lor x_3) \\land (\\lnot x_1 \\lor x_2 \\lor \\lnot x_3)",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Five presets load fixed instances. «Trivially SAT» is the two-clause formula above. «All 8 clauses on 3 vars» lists every possible three-literal clause over x₁, x₂, x₃, and since each assignment falsifies exactly one of them, the formula is unsatisfiable. «Phase transition» is a random instance with 7 variables and 30 clauses, a ratio close to 4.26; this particular instance turns out to be unsatisfiable. «Pigeonhole» encodes the claim that 4 pigeons fit into 3 holes with no hole shared, using 12 variables and 22 clauses; it is false, so the formula is unsatisfiable. «Verify-only» loads a 4-variable formula together with a candidate assignment and switches to Verify mode.",
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
        text: "Load «Phase transition» and press Run. This instance has no solution, so the solver cannot stop at a lucky guess: it has to refute every branch before it may answer UNSAT. Note the branch and conflict counters at the end. There is no assignment you could type into Verify mode to confirm that answer, and nobody knows a short certificate for unsatisfiability in general (that is the NP versus coNP question).",
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
        formula:
          "\\varphi = (x_1 \\lor x_2 \\lor x_3) \\land (\\lnot x_1 \\lor x_2 \\lor \\lnot x_3)",
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
};
