"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { SatClauseHero } from "@/components/signature/SatClauseHero";
import { SatClauseToggle } from "@/components/SatClauseToggle";
import type { StoryPage } from "@/lib/i18n/stories";
import type { Locale } from "@/lib/i18n/types";

const ACCENT = "text-signal-violet";

// --------------------------------------------------------------------------
// Boolean Satisfiability (SAT) — long-form story page. The canonical hero
// (pretitle, title, tagline, intro, ctaInteractive) lives inside
// RICH_STORY[locale].page so the whole 8-locale bundle is edited from one
// file. Five body sections, three encounter cards, and the labels for the
// inline "satisfy it by hand" widget are authored here too.
// --------------------------------------------------------------------------

type RichStory = {
  page: Omit<StoryPage, "sections">;
  encounter: {
    pretitle: string;
    title: string;
    cards: Array<{ label: string; title: string; body: string }>;
    tryIt: string;
  };
  sections: Array<{ pretitle: string; title: string; body: string }>;
  toggleCaption: string;
  toggleHint: string;
  toggleSatisfied: string;
  toggleUnsatisfied: string;
  toggleReset: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Logic",
    title: "Boolean Satisfiability",
    tagline: "The problem every hard problem reduces to.",
    intro:
      "Given a formula built from true/false variables joined by AND, OR and NOT, can you set the variables so the whole thing comes out true? Verifying a candidate answer is trivial; finding one can be brutal. SAT was the first problem ever proved NP-complete — the seam where 'easy to check' and 'easy to solve' pull apart, and the engine room of the P-versus-NP question.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Can you make it true?",
    cards: [
      {
        label: "01",
        title: "The big idea",
        body: "A Boolean formula is built from variables that are each true or false, joined by AND (∧), OR (∨) and NOT (¬). Satisfiability asks one question: is there a way to set the variables so the whole formula comes out true? If yes, the formula is satisfiable — produce the assignment and anyone can check it in seconds. If no, it is unsatisfiable, and proving that can mean ruling out every possibility.",
      },
      {
        label: "02",
        title: "A concrete example",
        body: "Take (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Three clauses joined by AND, so all three must hold at once. Try x = true, y = true, z = false: the first clause is true (x), the second is true (y), the third is true (¬z). Satisfied. You just verified a solution faster than you could read this card — but with 100 variables and 500 clauses, finding that assignment is another story entirely.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "In 1971 Stephen Cook proved SAT is NP-complete: every problem whose solutions are quick to check can be rewritten as a SAT instance in polynomial time. Map your scheduling problem, your puzzle, your cryptographic key onto a formula, and a SAT solver either cracks it or proves no solution exists. One fast SAT algorithm would collapse a thousand hard problems at once — which is exactly why almost nobody believes one exists.",
      },
    ],
    tryIt: "Below: a formula you can satisfy by hand. Flip the variables until every clause turns green.",
  },
  sections: [
    {
      pretitle: "Section 01 · The grammar",
      title: "Variables, literals, clauses, CNF",
      body: "A variable is a switch: true or false. A literal is a variable or its negation — x or ¬x. A clause is a handful of literals joined by OR, like (x ∨ ¬y ∨ z); it is satisfied the moment any one literal is true. A formula in conjunctive normal form (CNF) is clauses joined by AND, so every clause must hold at once. SAT is stated over CNF with no loss of generality: Tseitin's 1968 transformation rewrites any Boolean formula into an equisatisfiable CNF whose size grows only linearly — so insisting on CNF costs essentially nothing.",
    },
    {
      pretitle: "Section 02 · Easy to check, hard to find",
      title: "Why SAT lives in NP",
      body: "Hand someone an assignment and they verify it in a single linear pass — plug in the values, evaluate each clause. That puts SAT in NP: the class of problems whose yes-answers carry a short certificate that is quick to check. The open question is whether finding that certificate is as easy as checking it. Nobody has found a polynomial-time algorithm for SAT, and nobody has proved that none exists. That gap is the P-versus-NP problem, and SAT sits precisely on its fault line.",
    },
    {
      pretitle: "Section 03 · The first domino",
      title: "Cook–Levin and NP-completeness",
      body: "Cook (1971) and, independently behind the Iron Curtain, Levin (1973) proved the pivotal fact: you can encode the entire run of any polynomial-time non-deterministic machine as a Boolean formula — variables for the tape, the head and the clock; clauses that force the rules of computation — so that the formula is satisfiable exactly when the machine accepts. Hence every problem in NP reduces to SAT. The year after, Richard Karp showed 21 famous problems — graph colouring, Hamiltonian cycle, subset sum — reduce to it too. SAT is the first domino: knock it over quickly and the whole row falls.",
    },
    {
      pretitle: "Section 04 · How solvers actually win",
      title: "DPLL, and the search that prunes itself",
      body: "The brute-force tree has 2ⁿ leaves, one per assignment — hopeless past a few dozen variables. The Davis–Putnam–Logemann–Loveland procedure (1962) turns it into a search that prunes itself: pick a variable, assume a value, and propagate the consequences. Unit propagation — if a clause has just one unassigned literal left, that literal is forced. Pure-literal elimination — a variable that only ever appears positive can simply be set true. Hit a contradiction and backtrack. Modern solvers add conflict-driven clause learning, where every dead end teaches a new clause that blocks a whole family of future dead ends, and routinely settle formulas with millions of variables.",
    },
    {
      pretitle: "Section 05 · Where it gets hard",
      title: "Tractable islands and the phase transition",
      body: "Not all of SAT is hard. 2-SAT — at most two literals per clause — is solvable in linear time, as are Horn formulas; XOR formulas fall in polynomial time via Gaussian elimination over GF(2). Schaefer's 1978 dichotomy theorem is startling: every Boolean constraint problem of this shape is either in P or NP-complete, with nothing in between. And randomly generated 3-SAT shows a phase transition: as the ratio of clauses to variables crosses about 4.27, formulas flip sharply from almost-always-satisfiable to almost-always-unsatisfiable — and the very hardest instances cluster right at that threshold, like water poised exactly at freezing.",
    },
  ],
  toggleCaption: "Satisfy it by hand",
  toggleHint:
    "Click a, b or c to flip it between true and false. A clause turns green as soon as one of its literals is true; the formula is satisfied when all four clauses are green. Four of the eight assignments work — find one.",
  toggleSatisfied:
    "Satisfied. Every clause has a true literal, so the whole formula is true — and you verified it in seconds. Finding it was the easy case; imagine a thousand variables.",
  toggleUnsatisfied:
    "Not yet — at least one clause is still entirely false (shown in rose). Flip a variable and watch the clauses react.",
  toggleReset: "reset",
  closingPretitle: "Explore",
  closingTitle: "Watch a solver branch and backtrack.",
  closingBody:
    "The Explorer runs a DPLL search on a formula you control: it picks a variable, propagates the forced consequences, and backtracks out of every contradiction. Step through it, or let it run, and watch the search tree that P-versus-NP is really about.",
  ctaLabel: "→ Open the Explorer",
};

// ---------------- German ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Logik",
    title: "Erfüllbarkeit (SAT)",
    tagline: "Das Problem, auf das sich jedes schwere Problem zurückführen lässt.",
    intro:
      "Gegeben eine Formel aus Wahr/Falsch-Variablen, verknüpft mit UND, ODER und NICHT: Kann man die Variablen so setzen, dass das Ganze wahr wird? Eine vorgeschlagene Lösung zu prüfen ist trivial; eine zu finden kann brutal sein. SAT war das erste Problem, das je als NP-vollständig bewiesen wurde — die Nahtstelle, an der «leicht zu prüfen» und «leicht zu lösen» auseinanderbrechen, und der Maschinenraum der P-gegen-NP-Frage.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Kannst du sie wahr machen?",
    cards: [
      {
        label: "01",
        title: "Die Grundidee",
        body: "Eine boolesche Formel besteht aus Variablen, die jeweils wahr oder falsch sind, verknüpft mit UND (∧), ODER (∨) und NICHT (¬). Erfüllbarkeit stellt genau eine Frage: Gibt es eine Belegung der Variablen, sodass die ganze Formel wahr wird? Wenn ja, ist die Formel erfüllbar — nenne die Belegung, und jede:r kann sie in Sekunden prüfen. Wenn nein, ist sie unerfüllbar, und das zu beweisen heißt unter Umständen, jede Möglichkeit auszuschließen.",
      },
      {
        label: "02",
        title: "Ein konkretes Beispiel",
        body: "Nimm (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Drei Klauseln, mit UND verbunden, also müssen alle drei zugleich gelten. Probiere x = wahr, y = wahr, z = falsch: Die erste Klausel ist wahr (x), die zweite wahr (y), die dritte wahr (¬z). Erfüllt. Du hast eine Lösung schneller geprüft, als du diese Karte lesen konntest — aber bei 100 Variablen und 500 Klauseln ist das Finden dieser Belegung eine ganz andere Geschichte.",
      },
      {
        label: "03",
        title: "Warum es zählt",
        body: "1971 bewies Stephen Cook, dass SAT NP-vollständig ist: Jedes Problem, dessen Lösungen sich schnell prüfen lassen, kann in Polynomialzeit als SAT-Instanz umgeschrieben werden. Bilde dein Stundenplan-Problem, dein Rätsel, deinen kryptografischen Schlüssel auf eine Formel ab, und ein SAT-Solver knackt sie oder beweist, dass es keine Lösung gibt. Ein schneller SAT-Algorithmus würde tausend schwere Probleme auf einen Schlag einstürzen lassen — genau deshalb glaubt fast niemand, dass es ihn gibt.",
      },
    ],
    tryIt: "Unten: eine Formel, die du von Hand erfüllen kannst. Kipp die Variablen, bis jede Klausel grün wird.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Die Grammatik",
      title: "Variablen, Literale, Klauseln, KNF",
      body: "Eine Variable ist ein Schalter: wahr oder falsch. Ein Literal ist eine Variable oder ihre Negation — x oder ¬x. Eine Klausel ist eine Handvoll Literale, mit ODER verbunden, etwa (x ∨ ¬y ∨ z); sie ist erfüllt, sobald ein einziges Literal wahr ist. Eine Formel in konjunktiver Normalform (KNF) sind Klauseln, mit UND verbunden — jede Klausel muss also zugleich gelten. SAT wird ohne Beschränkung der Allgemeinheit über KNF formuliert: Tseitins Transformation von 1968 schreibt jede boolesche Formel in eine erfüllbarkeitsäquivalente KNF um, deren Größe nur linear wächst — auf KNF zu bestehen kostet also praktisch nichts.",
    },
    {
      pretitle: "Abschnitt 02 · Leicht zu prüfen, schwer zu finden",
      title: "Warum SAT in NP liegt",
      body: "Gib jemandem eine Belegung, und sie wird in einem einzigen linearen Durchgang geprüft — Werte einsetzen, jede Klausel auswerten. Das setzt SAT in NP: die Klasse der Probleme, deren Ja-Antworten ein kurzes, schnell prüfbares Zertifikat tragen. Die offene Frage ist, ob das Finden dieses Zertifikats so leicht ist wie das Prüfen. Niemand hat einen Polynomialzeit-Algorithmus für SAT gefunden, und niemand hat bewiesen, dass es keinen gibt. Diese Lücke ist das P-gegen-NP-Problem, und SAT liegt genau auf seiner Bruchlinie.",
    },
    {
      pretitle: "Abschnitt 03 · Der erste Dominostein",
      title: "Cook–Levin und NP-Vollständigkeit",
      body: "Cook (1971) und, unabhängig hinter dem Eisernen Vorhang, Levin (1973) bewiesen das Entscheidende: Man kann den gesamten Lauf jeder nichtdeterministischen Polynomialzeit-Maschine als boolesche Formel kodieren — Variablen für Band, Kopf und Takt; Klauseln, die die Rechenregeln erzwingen — sodass die Formel genau dann erfüllbar ist, wenn die Maschine akzeptiert. Also lässt sich jedes Problem in NP auf SAT zurückführen. Im Jahr darauf zeigte Richard Karp, dass 21 berühmte Probleme — Graphenfärbung, Hamilton-Kreis, Teilsummen — sich ebenfalls darauf reduzieren. SAT ist der erste Dominostein: Kippt er schnell, fällt die ganze Reihe.",
    },
    {
      pretitle: "Abschnitt 04 · Wie Solver wirklich gewinnen",
      title: "DPLL und die Suche, die sich selbst beschneidet",
      body: "Der Brute-Force-Baum hat 2ⁿ Blätter, eines pro Belegung — jenseits von ein paar Dutzend Variablen aussichtslos. Das Davis–Putnam–Logemann–Loveland-Verfahren (1962) macht daraus eine Suche, die sich selbst beschneidet: Variable wählen, einen Wert annehmen, die Konsequenzen propagieren. Unit-Propagation — bleibt in einer Klausel nur ein unbelegtes Literal, ist dieses erzwungen. Pure-Literal-Elimination — eine Variable, die nur positiv vorkommt, kann einfach wahr gesetzt werden. Stößt man auf einen Widerspruch, wird zurückgesetzt. Moderne Solver ergänzen das Conflict-Driven Clause Learning, bei dem jede Sackgasse eine neue Klausel lehrt, die eine ganze Familie künftiger Sackgassen blockiert — und bewältigen routinemäßig Formeln mit Millionen von Variablen.",
    },
    {
      pretitle: "Abschnitt 05 · Wo es schwer wird",
      title: "Inseln der Leichtigkeit und der Phasenübergang",
      body: "Nicht alles an SAT ist schwer. 2-SAT — höchstens zwei Literale pro Klausel — ist in Linearzeit lösbar, Horn-Formeln ebenso; XOR-Formeln liegen in Polynomialzeit dank Gauß-Elimination über GF(2). Schaefers Dichotomie-Satz von 1978 ist verblüffend: Jedes boolesche Constraint-Problem dieser Bauart ist entweder in P oder NP-vollständig, nichts dazwischen. Und zufällig erzeugtes 3-SAT zeigt einen Phasenübergang: Sobald das Verhältnis von Klauseln zu Variablen etwa 4,27 überschreitet, kippen Formeln abrupt von fast-immer-erfüllbar zu fast-immer-unerfüllbar — und die allerschwersten Instanzen drängen sich genau an dieser Schwelle, wie Wasser exakt am Gefrierpunkt.",
    },
  ],
  toggleCaption: "Von Hand erfüllen",
  toggleHint:
    "Klick a, b oder c, um zwischen wahr und falsch zu kippen. Eine Klausel wird grün, sobald eines ihrer Literale wahr ist; die Formel ist erfüllt, wenn alle vier Klauseln grün sind. Vier der acht Belegungen funktionieren — finde eine.",
  toggleSatisfied:
    "Erfüllt. Jede Klausel hat ein wahres Literal, also ist die ganze Formel wahr — und du hast es in Sekunden geprüft. Das Finden war der leichte Fall; stell dir tausend Variablen vor.",
  toggleUnsatisfied:
    "Noch nicht — mindestens eine Klausel ist noch ganz falsch (in Rosa). Kipp eine Variable und sieh zu, wie die Klauseln reagieren.",
  toggleReset: "zurücksetzen",
  closingPretitle: "Erkunden",
  closingTitle: "Sieh einem Solver beim Verzweigen und Zurücksetzen zu.",
  closingBody:
    "Der Explorer führt eine DPLL-Suche auf einer Formel aus, die du steuerst: Er wählt eine Variable, propagiert die erzwungenen Konsequenzen und setzt aus jedem Widerspruch zurück. Geh Schritt für Schritt durch oder lass ihn laufen — und sieh den Suchbaum, um den es bei P gegen NP wirklich geht.",
  ctaLabel: "→ Zum Explorer",
};

// ---------------- Spanish ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Lógica",
    title: "Satisfacibilidad booleana (SAT)",
    tagline: "El problema al que se reduce todo problema difícil.",
    intro:
      "Dada una fórmula de variables verdadero/falso unidas por Y, O y NO, ¿puedes fijar las variables para que el conjunto resulte verdadero? Verificar una respuesta candidata es trivial; encontrarla puede ser brutal. SAT fue el primer problema demostrado NP-completo — la costura donde «fácil de comprobar» y «fácil de resolver» se separan, y la sala de máquinas de la cuestión P frente a NP.",
    ctaInteractive: "→ Abrir el Explorador",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "¿Puedes hacerla verdadera?",
    cards: [
      {
        label: "01",
        title: "La gran idea",
        body: "Una fórmula booleana se construye con variables que son verdaderas o falsas, unidas por Y (∧), O (∨) y NO (¬). La satisfacibilidad plantea una sola pregunta: ¿hay una manera de fijar las variables para que toda la fórmula resulte verdadera? Si la hay, la fórmula es satisfacible — da la asignación y cualquiera la comprueba en segundos. Si no, es insatisfacible, y demostrarlo puede significar descartar todas las posibilidades.",
      },
      {
        label: "02",
        title: "Un ejemplo concreto",
        body: "Toma (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Tres cláusulas unidas por Y, así que las tres deben cumplirse a la vez. Prueba x = verdadero, y = verdadero, z = falso: la primera cláusula es verdadera (x), la segunda verdadera (y), la tercera verdadera (¬z). Satisfecha. Acabas de verificar una solución más rápido de lo que leíste esta tarjeta — pero con 100 variables y 500 cláusulas, encontrar esa asignación es otra historia.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "En 1971 Stephen Cook demostró que SAT es NP-completo: todo problema cuyas soluciones se comprueban rápido puede reescribirse como una instancia de SAT en tiempo polinómico. Traduce tu problema de horarios, tu rompecabezas, tu clave criptográfica a una fórmula, y un solver de SAT la resuelve o demuestra que no hay solución. Un algoritmo de SAT rápido derrumbaría mil problemas difíciles de golpe — por eso casi nadie cree que exista.",
      },
    ],
    tryIt: "Abajo: una fórmula que puedes satisfacer a mano. Cambia las variables hasta que cada cláusula se ponga verde.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La gramática",
      title: "Variables, literales, cláusulas, FNC",
      body: "Una variable es un interruptor: verdadero o falso. Un literal es una variable o su negación — x o ¬x. Una cláusula es un puñado de literales unidos por O, como (x ∨ ¬y ∨ z); queda satisfecha en cuanto un literal es verdadero. Una fórmula en forma normal conjuntiva (FNC) son cláusulas unidas por Y, así que todas deben cumplirse a la vez. SAT se formula sobre FNC sin pérdida de generalidad: la transformación de Tseitin (1968) reescribe cualquier fórmula booleana en una FNC equisatisfacible cuyo tamaño crece solo de forma lineal — exigir FNC no cuesta casi nada.",
    },
    {
      pretitle: "Sección 02 · Fácil de comprobar, difícil de hallar",
      title: "Por qué SAT vive en NP",
      body: "Dale a alguien una asignación y la verifica en una sola pasada lineal — sustituye los valores, evalúa cada cláusula. Eso pone a SAT en NP: la clase de problemas cuyas respuestas afirmativas llevan un certificado breve y rápido de comprobar. La pregunta abierta es si hallar ese certificado es tan fácil como comprobarlo. Nadie ha encontrado un algoritmo polinómico para SAT, y nadie ha probado que no exista. Esa brecha es el problema P frente a NP, y SAT se sitúa justo sobre su línea de falla.",
    },
    {
      pretitle: "Sección 03 · La primera ficha de dominó",
      title: "Cook–Levin y la NP-completitud",
      body: "Cook (1971) y, de forma independiente tras el Telón de Acero, Levin (1973) probaron lo decisivo: puedes codificar la ejecución completa de cualquier máquina no determinista de tiempo polinómico como una fórmula booleana — variables para la cinta, el cabezal y el reloj; cláusulas que imponen las reglas del cómputo — de modo que la fórmula es satisfacible exactamente cuando la máquina acepta. Así, todo problema de NP se reduce a SAT. Al año siguiente, Richard Karp mostró que 21 problemas famosos — coloreo de grafos, ciclo hamiltoniano, suma de subconjuntos — también se reducen a él. SAT es la primera ficha: derríbala rápido y cae la fila entera.",
    },
    {
      pretitle: "Sección 04 · Cómo ganan de verdad los solvers",
      title: "DPLL, y la búsqueda que se poda sola",
      body: "El árbol de fuerza bruta tiene 2ⁿ hojas, una por asignación — inviable más allá de unas docenas de variables. El procedimiento Davis–Putnam–Logemann–Loveland (1962) lo convierte en una búsqueda que se poda sola: elige una variable, supón un valor y propaga las consecuencias. Propagación unitaria — si a una cláusula le queda un solo literal sin asignar, ese literal queda forzado. Eliminación de literal puro — una variable que solo aparece positiva puede ponerse verdadera. Si llegas a una contradicción, retrocede. Los solvers modernos añaden el aprendizaje de cláusulas por conflicto, donde cada callejón sin salida enseña una cláusula nueva que bloquea toda una familia de futuros callejones, y resuelven de rutina fórmulas con millones de variables.",
    },
    {
      pretitle: "Sección 05 · Dónde se pone difícil",
      title: "Islas tratables y la transición de fase",
      body: "No todo SAT es difícil. 2-SAT — a lo sumo dos literales por cláusula — se resuelve en tiempo lineal, igual que las fórmulas de Horn; las fórmulas XOR quedan en tiempo polinómico mediante eliminación gaussiana sobre GF(2). El teorema de dicotomía de Schaefer (1978) es asombroso: todo problema booleano de restricciones de esta forma está en P o es NP-completo, sin nada en medio. Y el 3-SAT generado al azar muestra una transición de fase: cuando la razón de cláusulas a variables cruza alrededor de 4,27, las fórmulas saltan bruscamente de casi-siempre-satisfacibles a casi-siempre-insatisfacibles — y las instancias más difíciles se agolpan justo en ese umbral, como agua al borde mismo de la congelación.",
    },
  ],
  toggleCaption: "Satisfácela a mano",
  toggleHint:
    "Pulsa a, b o c para cambiar entre verdadero y falso. Una cláusula se pone verde en cuanto uno de sus literales es verdadero; la fórmula queda satisfecha cuando las cuatro cláusulas están verdes. Cuatro de las ocho asignaciones funcionan — encuentra una.",
  toggleSatisfied:
    "Satisfecha. Cada cláusula tiene un literal verdadero, así que toda la fórmula es verdadera — y lo verificaste en segundos. Hallarla fue el caso fácil; imagina mil variables.",
  toggleUnsatisfied:
    "Todavía no — al menos una cláusula sigue del todo falsa (en rosa). Cambia una variable y observa cómo reaccionan las cláusulas.",
  toggleReset: "reiniciar",
  closingPretitle: "Explorar",
  closingTitle: "Mira a un solver ramificar y retroceder.",
  closingBody:
    "El Explorador ejecuta una búsqueda DPLL sobre una fórmula que tú controlas: elige una variable, propaga las consecuencias forzadas y retrocede de cada contradicción. Ve paso a paso, o déjalo correr, y observa el árbol de búsqueda del que trata de verdad P frente a NP.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------------- French ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Logique",
    title: "Satisfaisabilité booléenne (SAT)",
    tagline: "Le problème auquel se ramène tout problème difficile.",
    intro:
      "Étant donné une formule de variables vrai/faux reliées par ET, OU et NON, peut-on régler les variables pour que l'ensemble devienne vrai ? Vérifier une réponse candidate est trivial ; en trouver une peut être brutal. SAT fut le premier problème jamais prouvé NP-complet — la couture où « facile à vérifier » et « facile à résoudre » se séparent, et la salle des machines de la question P contre NP.",
    ctaInteractive: "→ Ouvrir l'Explorateur",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Peux-tu la rendre vraie ?",
    cards: [
      {
        label: "01",
        title: "L'idée maîtresse",
        body: "Une formule booléenne est faite de variables chacune vraie ou fausse, reliées par ET (∧), OU (∨) et NON (¬). La satisfaisabilité pose une seule question : existe-t-il un réglage des variables qui rende toute la formule vraie ? Si oui, la formule est satisfaisable — donne l'affectation et chacun la vérifie en quelques secondes. Sinon, elle est insatisfaisable, et le prouver peut signifier écarter toutes les possibilités.",
      },
      {
        label: "02",
        title: "Un exemple concret",
        body: "Prends (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Trois clauses reliées par ET : les trois doivent tenir à la fois. Essaie x = vrai, y = vrai, z = faux : la première clause est vraie (x), la deuxième vraie (y), la troisième vraie (¬z). Satisfaite. Tu viens de vérifier une solution plus vite que tu n'as lu cette carte — mais avec 100 variables et 500 clauses, trouver cette affectation est une tout autre affaire.",
      },
      {
        label: "03",
        title: "Pourquoi ça compte",
        body: "En 1971, Stephen Cook a prouvé que SAT est NP-complet : tout problème dont les solutions se vérifient vite peut se réécrire en une instance de SAT en temps polynomial. Traduis ton problème d'emploi du temps, ton casse-tête, ta clé cryptographique en une formule, et un solveur SAT la résout ou prouve qu'il n'y a pas de solution. Un algorithme SAT rapide ferait s'effondrer mille problèmes difficiles d'un coup — c'est précisément pourquoi presque personne ne croit qu'il existe.",
      },
    ],
    tryIt: "Ci-dessous : une formule que tu peux satisfaire à la main. Bascule les variables jusqu'à ce que chaque clause passe au vert.",
  },
  sections: [
    {
      pretitle: "Section 01 · La grammaire",
      title: "Variables, littéraux, clauses, FNC",
      body: "Une variable est un interrupteur : vrai ou faux. Un littéral est une variable ou sa négation — x ou ¬x. Une clause est une poignée de littéraux reliés par OU, comme (x ∨ ¬y ∨ z) ; elle est satisfaite dès qu'un littéral est vrai. Une formule en forme normale conjonctive (FNC) est faite de clauses reliées par ET, donc chaque clause doit tenir à la fois. SAT se formule sur la FNC sans perte de généralité : la transformation de Tseitin (1968) réécrit toute formule booléenne en une FNC équisatisfaisable dont la taille ne croît que linéairement — exiger la FNC ne coûte presque rien.",
    },
    {
      pretitle: "Section 02 · Facile à vérifier, dur à trouver",
      title: "Pourquoi SAT vit dans NP",
      body: "Donne une affectation à quelqu'un et il la vérifie en un seul passage linéaire — substitue les valeurs, évalue chaque clause. Cela place SAT dans NP : la classe des problèmes dont les réponses positives portent un certificat court et vite vérifiable. La question ouverte est de savoir si trouver ce certificat est aussi facile que le vérifier. Personne n'a trouvé d'algorithme polynomial pour SAT, et personne n'a prouvé qu'il n'en existe pas. Cet écart est le problème P contre NP, et SAT se tient exactement sur sa ligne de faille.",
    },
    {
      pretitle: "Section 03 · Le premier domino",
      title: "Cook–Levin et la NP-complétude",
      body: "Cook (1971) et, indépendamment derrière le rideau de fer, Levin (1973) ont prouvé l'essentiel : on peut encoder l'exécution entière de toute machine non déterministe en temps polynomial comme une formule booléenne — variables pour le ruban, la tête et l'horloge ; clauses imposant les règles du calcul — de sorte que la formule est satisfaisable exactement quand la machine accepte. Donc tout problème de NP se ramène à SAT. L'année suivante, Richard Karp a montré que 21 problèmes célèbres — coloration de graphes, cycle hamiltonien, somme de sous-ensembles — s'y ramènent aussi. SAT est le premier domino : fais-le tomber vite et toute la rangée suit.",
    },
    {
      pretitle: "Section 04 · Comment les solveurs gagnent vraiment",
      title: "DPLL, et la recherche qui s'élague d'elle-même",
      body: "L'arbre par force brute a 2ⁿ feuilles, une par affectation — sans espoir au-delà de quelques dizaines de variables. La procédure Davis–Putnam–Logemann–Loveland (1962) en fait une recherche qui s'élague d'elle-même : choisis une variable, suppose une valeur, propage les conséquences. Propagation unitaire — s'il ne reste qu'un littéral non affecté dans une clause, ce littéral est forcé. Élimination du littéral pur — une variable qui n'apparaît que positivement peut être mise à vrai. En cas de contradiction, on rebrousse chemin. Les solveurs modernes ajoutent l'apprentissage de clauses dirigé par les conflits, où chaque impasse enseigne une nouvelle clause qui bloque toute une famille d'impasses futures, et règlent couramment des formules à des millions de variables.",
    },
    {
      pretitle: "Section 05 · Là où ça devient dur",
      title: "Îlots traitables et transition de phase",
      body: "Tout SAT n'est pas dur. 2-SAT — au plus deux littéraux par clause — se résout en temps linéaire, tout comme les formules de Horn ; les formules XOR relèvent du temps polynomial via l'élimination de Gauss sur GF(2). Le théorème de dichotomie de Schaefer (1978) est saisissant : tout problème de contraintes booléennes de cette forme est soit dans P, soit NP-complet, sans rien entre les deux. Et le 3-SAT engendré au hasard montre une transition de phase : quand le rapport clauses/variables franchit environ 4,27, les formules basculent brusquement de presque-toujours-satisfaisables à presque-toujours-insatisfaisables — et les instances les plus dures se massent juste à ce seuil, comme l'eau exactement au point de gel.",
    },
  ],
  toggleCaption: "Satisfais-la à la main",
  toggleHint:
    "Clique a, b ou c pour basculer entre vrai et faux. Une clause passe au vert dès qu'un de ses littéraux est vrai ; la formule est satisfaite quand les quatre clauses sont vertes. Quatre des huit affectations marchent — trouves-en une.",
  toggleSatisfied:
    "Satisfaite. Chaque clause a un littéral vrai, donc toute la formule est vraie — et tu l'as vérifié en quelques secondes. La trouver, c'était le cas facile ; imagine mille variables.",
  toggleUnsatisfied:
    "Pas encore — au moins une clause est encore entièrement fausse (en rose). Bascule une variable et regarde les clauses réagir.",
  toggleReset: "réinitialiser",
  closingPretitle: "Explorer",
  closingTitle: "Regarde un solveur se ramifier et rebrousser chemin.",
  closingBody:
    "L'Explorateur lance une recherche DPLL sur une formule que tu contrôles : il choisit une variable, propage les conséquences forcées et rebrousse chemin à chaque contradiction. Avance pas à pas, ou laisse-le tourner, et observe l'arbre de recherche dont parle vraiment P contre NP.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ---------------- Italian ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Logica",
    title: "Soddisfacibilità booleana (SAT)",
    tagline: "Il problema a cui si riduce ogni problema difficile.",
    intro:
      "Data una formula di variabili vero/falso unite da E, O e NON, puoi impostare le variabili in modo che il tutto risulti vero? Verificare una risposta candidata è banale; trovarne una può essere brutale. SAT è stato il primo problema mai dimostrato NP-completo — la cucitura dove «facile da verificare» e «facile da risolvere» si separano, e la sala macchine della questione P contro NP.",
    ctaInteractive: "→ Apri l'Esploratore",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Riesci a renderla vera?",
    cards: [
      {
        label: "01",
        title: "L'idea di fondo",
        body: "Una formula booleana è fatta di variabili ciascuna vera o falsa, unite da E (∧), O (∨) e NON (¬). La soddisfacibilità pone una sola domanda: esiste un modo di impostare le variabili così che l'intera formula risulti vera? Se sì, la formula è soddisfacibile — fornisci l'assegnamento e chiunque lo verifica in pochi secondi. Se no, è insoddisfacibile, e dimostrarlo può voler dire escludere ogni possibilità.",
      },
      {
        label: "02",
        title: "Un esempio concreto",
        body: "Prendi (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Tre clausole unite da E, quindi tutte e tre devono valere insieme. Prova x = vero, y = vero, z = falso: la prima clausola è vera (x), la seconda vera (y), la terza vera (¬z). Soddisfatta. Hai appena verificato una soluzione più in fretta di quanto tu abbia letto questa scheda — ma con 100 variabili e 500 clausole, trovare quell'assegnamento è tutta un'altra storia.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Nel 1971 Stephen Cook dimostrò che SAT è NP-completo: ogni problema le cui soluzioni si verificano in fretta può essere riscritto come istanza di SAT in tempo polinomiale. Mappa il tuo problema di orari, il tuo rompicapo, la tua chiave crittografica su una formula, e un solver SAT la risolve o dimostra che non c'è soluzione. Un algoritmo SAT veloce farebbe crollare mille problemi difficili in un colpo — proprio per questo quasi nessuno crede che esista.",
      },
    ],
    tryIt: "Sotto: una formula che puoi soddisfare a mano. Ribalta le variabili finché ogni clausola diventa verde.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · La grammatica",
      title: "Variabili, letterali, clausole, FNC",
      body: "Una variabile è un interruttore: vero o falso. Un letterale è una variabile o la sua negazione — x o ¬x. Una clausola è una manciata di letterali uniti da O, come (x ∨ ¬y ∨ z); è soddisfatta non appena un letterale è vero. Una formula in forma normale congiuntiva (FNC) sono clausole unite da E, quindi ogni clausola deve valere insieme. SAT si formula sulla FNC senza perdita di generalità: la trasformazione di Tseitin (1968) riscrive qualsiasi formula booleana in una FNC equisoddisfacibile la cui dimensione cresce solo linearmente — insistere sulla FNC non costa quasi nulla.",
    },
    {
      pretitle: "Sezione 02 · Facile da verificare, difficile da trovare",
      title: "Perché SAT vive in NP",
      body: "Dài a qualcuno un assegnamento e lo verifica in un solo passaggio lineare — sostituisci i valori, valuta ogni clausola. Questo mette SAT in NP: la classe dei problemi le cui risposte affermative portano un certificato breve e veloce da controllare. La domanda aperta è se trovare quel certificato sia facile quanto verificarlo. Nessuno ha trovato un algoritmo polinomiale per SAT, e nessuno ha dimostrato che non esista. Quel divario è il problema P contro NP, e SAT sta esattamente sulla sua linea di faglia.",
    },
    {
      pretitle: "Sezione 03 · Il primo domino",
      title: "Cook–Levin e la NP-completezza",
      body: "Cook (1971) e, indipendentemente dietro la cortina di ferro, Levin (1973) dimostrarono il punto cruciale: si può codificare l'intera esecuzione di qualsiasi macchina non deterministica polinomiale come formula booleana — variabili per il nastro, la testina e il clock; clausole che impongono le regole del calcolo — così che la formula è soddisfacibile esattamente quando la macchina accetta. Quindi ogni problema in NP si riduce a SAT. L'anno dopo, Richard Karp mostrò che 21 problemi celebri — colorazione di grafi, ciclo hamiltoniano, somma di sottoinsiemi — vi si riducono pure. SAT è il primo domino: abbattilo in fretta e cade l'intera fila.",
    },
    {
      pretitle: "Sezione 04 · Come vincono davvero i solver",
      title: "DPLL e la ricerca che si pota da sola",
      body: "L'albero a forza bruta ha 2ⁿ foglie, una per assegnamento — senza speranza oltre qualche decina di variabili. La procedura Davis–Putnam–Logemann–Loveland (1962) lo trasforma in una ricerca che si pota da sola: scegli una variabile, assumi un valore, propaga le conseguenze. Propagazione unitaria — se in una clausola resta un solo letterale non assegnato, quel letterale è forzato. Eliminazione del letterale puro — una variabile che compare solo positiva può essere posta vera. Se incontri una contraddizione, torna indietro. I solver moderni aggiungono l'apprendimento di clausole guidato dai conflitti, dove ogni vicolo cieco insegna una nuova clausola che blocca un'intera famiglia di vicoli ciechi futuri, e risolvono di routine formule con milioni di variabili.",
    },
    {
      pretitle: "Sezione 05 · Dove diventa difficile",
      title: "Isole trattabili e la transizione di fase",
      body: "Non tutto SAT è difficile. 2-SAT — al più due letterali per clausola — si risolve in tempo lineare, come le formule di Horn; le formule XOR ricadono nel tempo polinomiale tramite l'eliminazione di Gauss su GF(2). Il teorema di dicotomia di Schaefer (1978) è sorprendente: ogni problema di vincoli booleani di questa forma è in P oppure NP-completo, senza nulla in mezzo. E il 3-SAT generato a caso mostra una transizione di fase: quando il rapporto clausole/variabili supera circa 4,27, le formule passano bruscamente da quasi-sempre-soddisfacibili a quasi-sempre-insoddisfacibili — e le istanze più difficili si accalcano proprio a quella soglia, come acqua esattamente al punto di congelamento.",
    },
  ],
  toggleCaption: "Soddisfala a mano",
  toggleHint:
    "Clicca a, b o c per ribaltare tra vero e falso. Una clausola diventa verde non appena uno dei suoi letterali è vero; la formula è soddisfatta quando tutte e quattro le clausole sono verdi. Quattro degli otto assegnamenti funzionano — trovane uno.",
  toggleSatisfied:
    "Soddisfatta. Ogni clausola ha un letterale vero, quindi l'intera formula è vera — e l'hai verificato in pochi secondi. Trovarla era il caso facile; immagina mille variabili.",
  toggleUnsatisfied:
    "Non ancora — almeno una clausola è ancora del tutto falsa (in rosa). Ribalta una variabile e guarda le clausole reagire.",
  toggleReset: "azzera",
  closingPretitle: "Esplora",
  closingTitle: "Guarda un solver ramificare e tornare indietro.",
  closingBody:
    "L'Esploratore esegue una ricerca DPLL su una formula che controlli tu: sceglie una variabile, propaga le conseguenze forzate e torna indietro da ogni contraddizione. Procedi passo passo, o lascialo correre, e osserva l'albero di ricerca di cui parla davvero P contro NP.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ---------------- Portuguese ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tópico · Lógica",
    title: "Satisfazibilidade booleana (SAT)",
    tagline: "O problema a que todo problema difícil se reduz.",
    intro:
      "Dada uma fórmula de variáveis verdadeiro/falso ligadas por E, OU e NÃO, consegues fixar as variáveis para que o conjunto fique verdadeiro? Verificar uma resposta candidata é trivial; encontrar uma pode ser brutal. SAT foi o primeiro problema alguma vez provado NP-completo — a costura onde «fácil de verificar» e «fácil de resolver» se separam, e a sala de máquinas da questão P contra NP.",
    ctaInteractive: "→ Abrir o Explorador",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Consegues torná-la verdadeira?",
    cards: [
      {
        label: "01",
        title: "A grande ideia",
        body: "Uma fórmula booleana é feita de variáveis cada uma verdadeira ou falsa, ligadas por E (∧), OU (∨) e NÃO (¬). A satisfazibilidade faz uma só pergunta: existe uma forma de fixar as variáveis para que a fórmula inteira fique verdadeira? Se sim, a fórmula é satisfazível — dá a atribuição e qualquer pessoa a verifica em segundos. Se não, é insatisfazível, e prová-lo pode significar descartar todas as possibilidades.",
      },
      {
        label: "02",
        title: "Um exemplo concreto",
        body: "Toma (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Três cláusulas ligadas por E, logo as três têm de valer ao mesmo tempo. Tenta x = verdadeiro, y = verdadeiro, z = falso: a primeira cláusula é verdadeira (x), a segunda verdadeira (y), a terceira verdadeira (¬z). Satisfeita. Acabaste de verificar uma solução mais depressa do que leste este cartão — mas com 100 variáveis e 500 cláusulas, encontrar essa atribuição é outra história.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "Em 1971 Stephen Cook provou que SAT é NP-completo: todo problema cujas soluções se verificam depressa pode ser reescrito como uma instância de SAT em tempo polinomial. Mapeia o teu problema de horários, o teu quebra-cabeças, a tua chave criptográfica numa fórmula, e um solver de SAT resolve-a ou prova que não há solução. Um algoritmo de SAT rápido faria ruir mil problemas difíceis de uma vez — é precisamente por isso que quase ninguém acredita que exista.",
      },
    ],
    tryIt: "Abaixo: uma fórmula que podes satisfazer à mão. Alterna as variáveis até cada cláusula ficar verde.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A gramática",
      title: "Variáveis, literais, cláusulas, FNC",
      body: "Uma variável é um interruptor: verdadeiro ou falso. Um literal é uma variável ou a sua negação — x ou ¬x. Uma cláusula é um punhado de literais ligados por OU, como (x ∨ ¬y ∨ z); fica satisfeita assim que um literal é verdadeiro. Uma fórmula em forma normal conjuntiva (FNC) são cláusulas ligadas por E, logo cada cláusula tem de valer ao mesmo tempo. SAT formula-se sobre FNC sem perda de generalidade: a transformação de Tseitin (1968) reescreve qualquer fórmula booleana numa FNC equissatisfazível cujo tamanho cresce só linearmente — exigir FNC quase não custa nada.",
    },
    {
      pretitle: "Secção 02 · Fácil de verificar, difícil de encontrar",
      title: "Porque SAT vive em NP",
      body: "Dá a alguém uma atribuição e verifica-a numa única passagem linear — substitui os valores, avalia cada cláusula. Isso põe SAT em NP: a classe de problemas cujas respostas afirmativas levam um certificado curto e rápido de verificar. A questão em aberto é se encontrar esse certificado é tão fácil como verificá-lo. Ninguém encontrou um algoritmo polinomial para SAT, e ninguém provou que não existe. Essa lacuna é o problema P contra NP, e SAT fica exatamente sobre a sua linha de falha.",
    },
    {
      pretitle: "Secção 03 · O primeiro dominó",
      title: "Cook–Levin e a NP-completude",
      body: "Cook (1971) e, de forma independente atrás da Cortina de Ferro, Levin (1973) provaram o essencial: pode-se codificar a execução inteira de qualquer máquina não determinista de tempo polinomial como uma fórmula booleana — variáveis para a fita, a cabeça e o relógio; cláusulas que impõem as regras do cálculo — de modo que a fórmula é satisfazível exatamente quando a máquina aceita. Assim, todo problema em NP reduz-se a SAT. No ano seguinte, Richard Karp mostrou que 21 problemas famosos — coloração de grafos, ciclo hamiltoniano, soma de subconjuntos — também se reduzem a ele. SAT é o primeiro dominó: derruba-o depressa e cai a fila inteira.",
    },
    {
      pretitle: "Secção 04 · Como os solvers vencem de facto",
      title: "DPLL, e a busca que se poda sozinha",
      body: "A árvore de força bruta tem 2ⁿ folhas, uma por atribuição — sem esperança para além de algumas dezenas de variáveis. O procedimento Davis–Putnam–Logemann–Loveland (1962) torna-a numa busca que se poda sozinha: escolhe uma variável, assume um valor e propaga as consequências. Propagação unitária — se a uma cláusula resta um só literal por atribuir, esse literal fica forçado. Eliminação de literal puro — uma variável que só aparece positiva pode ser posta verdadeira. Ao chegar a uma contradição, recua. Os solvers modernos acrescentam a aprendizagem de cláusulas guiada por conflitos, onde cada beco sem saída ensina uma cláusula nova que bloqueia toda uma família de becos futuros, e resolvem por rotina fórmulas com milhões de variáveis.",
    },
    {
      pretitle: "Secção 05 · Onde se torna difícil",
      title: "Ilhas tratáveis e a transição de fase",
      body: "Nem todo o SAT é difícil. 2-SAT — no máximo dois literais por cláusula — resolve-se em tempo linear, tal como as fórmulas de Horn; as fórmulas XOR ficam em tempo polinomial via eliminação de Gauss sobre GF(2). O teorema de dicotomia de Schaefer (1978) é impressionante: todo problema de restrições booleanas desta forma está em P ou é NP-completo, sem nada pelo meio. E o 3-SAT gerado ao acaso mostra uma transição de fase: quando a razão de cláusulas para variáveis cruza cerca de 4,27, as fórmulas saltam bruscamente de quase-sempre-satisfazíveis a quase-sempre-insatisfazíveis — e as instâncias mais difíceis amontoam-se mesmo nesse limiar, como água exatamente no ponto de congelação.",
    },
  ],
  toggleCaption: "Satisfaz à mão",
  toggleHint:
    "Carrega em a, b ou c para alternar entre verdadeiro e falso. Uma cláusula fica verde assim que um dos seus literais é verdadeiro; a fórmula fica satisfeita quando as quatro cláusulas estão verdes. Quatro das oito atribuições funcionam — encontra uma.",
  toggleSatisfied:
    "Satisfeita. Cada cláusula tem um literal verdadeiro, portanto a fórmula inteira é verdadeira — e verificaste-o em segundos. Encontrá-la foi o caso fácil; imagina mil variáveis.",
  toggleUnsatisfied:
    "Ainda não — pelo menos uma cláusula continua totalmente falsa (a rosa). Alterna uma variável e vê as cláusulas reagir.",
  toggleReset: "reiniciar",
  closingPretitle: "Explorar",
  closingTitle: "Vê um solver ramificar e recuar.",
  closingBody:
    "O Explorador corre uma busca DPLL sobre uma fórmula que controlas: escolhe uma variável, propaga as consequências forçadas e recua de cada contradição. Avança passo a passo, ou deixa-o correr, e observa a árvore de busca de que P contra NP realmente trata.",
  ctaLabel: "→ Abrir o Explorador",
};

// ---------------- Swedish ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Logik",
    title: "Boolesk satisfierbarhet (SAT)",
    tagline: "Problemet som varje svårt problem reduceras till.",
    intro:
      "Givet en formel av sant/falskt-variabler sammanfogade med OCH, ELLER och ICKE — kan du ställa in variablerna så att helheten blir sann? Att verifiera ett kandidatsvar är trivialt; att hitta ett kan vara brutalt. SAT var det första problem som någonsin bevisats NP-fullständigt — sömmen där «lätt att kontrollera» och «lätt att lösa» dras isär, och maskinrummet för frågan P mot NP.",
    ctaInteractive: "→ Öppna Utforskaren",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Kan du göra den sann?",
    cards: [
      {
        label: "01",
        title: "Grundidén",
        body: "En boolesk formel byggs av variabler som var och en är sann eller falsk, sammanfogade med OCH (∧), ELLER (∨) och ICKE (¬). Satisfierbarhet ställer en enda fråga: finns det ett sätt att ställa in variablerna så att hela formeln blir sann? Om ja är formeln satisfierbar — ge tilldelningen så kan vem som helst kontrollera den på sekunder. Om nej är den osatisfierbar, och att bevisa det kan betyda att utesluta varje möjlighet.",
      },
      {
        label: "02",
        title: "Ett konkret exempel",
        body: "Ta (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Tre klausuler sammanfogade med OCH, så alla tre måste gälla samtidigt. Prova x = sant, y = sant, z = falskt: första klausulen är sann (x), andra sann (y), tredje sann (¬z). Satisfierad. Du verifierade just en lösning snabbare än du hann läsa det här kortet — men med 100 variabler och 500 klausuler är det en helt annan sak att hitta den tilldelningen.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "År 1971 bevisade Stephen Cook att SAT är NP-fullständigt: varje problem vars lösningar snabbt kan kontrolleras kan skrivas om till en SAT-instans i polynomtid. Avbilda ditt schemaläggningsproblem, ditt pussel, din kryptonyckel på en formel, så löser en SAT-lösare den eller bevisar att ingen lösning finns. En snabb SAT-algoritm skulle få tusen svåra problem att rasa på en gång — just därför tror nästan ingen att den finns.",
      },
    ],
    tryIt: "Nedan: en formel du kan satisfiera för hand. Växla variablerna tills varje klausul blir grön.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Grammatiken",
      title: "Variabler, literaler, klausuler, KNF",
      body: "En variabel är en strömbrytare: sann eller falsk. En literal är en variabel eller dess negation — x eller ¬x. En klausul är en handfull literaler sammanfogade med ELLER, som (x ∨ ¬y ∨ z); den är satisfierad så snart en literal är sann. En formel i konjunktiv normalform (KNF) är klausuler sammanfogade med OCH, så varje klausul måste gälla samtidigt. SAT formuleras över KNF utan inskränkning: Tseitins transformation (1968) skriver om varje boolesk formel till en eksatisfierbar KNF vars storlek bara växer linjärt — att kräva KNF kostar nästan ingenting.",
    },
    {
      pretitle: "Avsnitt 02 · Lätt att kontrollera, svårt att hitta",
      title: "Varför SAT bor i NP",
      body: "Ge någon en tilldelning så verifierar de den i ett enda linjärt svep — sätt in värdena, utvärdera varje klausul. Det placerar SAT i NP: klassen av problem vars ja-svar bär ett kort certifikat som snabbt går att kontrollera. Den öppna frågan är om det är lika lätt att hitta certifikatet som att kontrollera det. Ingen har hittat en polynomtidsalgoritm för SAT, och ingen har bevisat att ingen finns. Den klyftan är problemet P mot NP, och SAT ligger precis på dess förkastningslinje.",
    },
    {
      pretitle: "Avsnitt 03 · Den första brickan",
      title: "Cook–Levin och NP-fullständighet",
      body: "Cook (1971) och, oberoende bakom järnridån, Levin (1973) bevisade det avgörande: man kan koda hela körningen av vilken icke-deterministisk polynomtidsmaskin som helst som en boolesk formel — variabler för bandet, huvudet och klockan; klausuler som tvingar fram beräkningsreglerna — så att formeln är satisfierbar exakt när maskinen accepterar. Alltså reduceras varje problem i NP till SAT. Året därpå visade Richard Karp att 21 berömda problem — graffärgning, hamiltonsk cykel, delmängdssumma — också reduceras till det. SAT är den första brickan: fäll den snabbt och hela raden faller.",
    },
    {
      pretitle: "Avsnitt 04 · Hur lösare faktiskt vinner",
      title: "DPLL, och sökningen som beskär sig själv",
      body: "Brute force-trädet har 2ⁿ löv, ett per tilldelning — hopplöst bortom några dussin variabler. Davis–Putnam–Logemann–Loveland-proceduren (1962) gör det till en sökning som beskär sig själv: välj en variabel, anta ett värde, propagera följderna. Enhetspropagering — om en klausul har en enda otilldelad literal kvar är den literalen tvingad. Eliminering av ren literal — en variabel som bara förekommer positivt kan helt enkelt sättas sann. Stöter du på en motsägelse, backa. Moderna lösare lägger till konfliktdriven klausulinlärning, där varje återvändsgränd lär ut en ny klausul som blockerar en hel familj framtida återvändsgränder, och avgör rutinmässigt formler med miljoner variabler.",
    },
    {
      pretitle: "Avsnitt 05 · Där det blir svårt",
      title: "Lösbara öar och fasövergången",
      body: "Allt SAT är inte svårt. 2-SAT — högst två literaler per klausul — löses i linjär tid, liksom Horn-formler; XOR-formler ligger i polynomtid via gausselimination över GF(2). Schaefers dikotomisats (1978) är häpnadsväckande: varje booleskt villkorsproblem av den här formen är antingen i P eller NP-fullständigt, med ingenting däremellan. Och slumpmässigt genererad 3-SAT visar en fasövergång: när förhållandet mellan klausuler och variabler passerar omkring 4,27 vänder formler tvärt från nästan-alltid-satisfierbara till nästan-alltid-osatisfierbara — och de allra svåraste instanserna trängs precis vid den tröskeln, som vatten exakt vid fryspunkten.",
    },
  ],
  toggleCaption: "Satisfiera för hand",
  toggleHint:
    "Klicka a, b eller c för att växla mellan sant och falskt. En klausul blir grön så snart en av dess literaler är sann; formeln är satisfierad när alla fyra klausuler är gröna. Fyra av de åtta tilldelningarna fungerar — hitta en.",
  toggleSatisfied:
    "Satisfierad. Varje klausul har en sann literal, så hela formeln är sann — och du verifierade det på sekunder. Att hitta den var det lätta fallet; tänk dig tusen variabler.",
  toggleUnsatisfied:
    "Inte än — minst en klausul är fortfarande helt falsk (i rosa). Växla en variabel och se klausulerna reagera.",
  toggleReset: "återställ",
  closingPretitle: "Utforska",
  closingTitle: "Se en lösare förgrena sig och backa.",
  closingBody:
    "Utforskaren kör en DPLL-sökning på en formel du styr: den väljer en variabel, propagerar de tvingade följderna och backar ur varje motsägelse. Stega igenom, eller låt den löpa, och se sökträdet som P mot NP egentligen handlar om.",
  ctaLabel: "→ Öppna Utforskaren",
};

// ---------------- Norwegian ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Logikk",
    title: "Boolsk oppfyllbarhet (SAT)",
    tagline: "Problemet som ethvert vanskelig problem reduseres til.",
    intro:
      "Gitt en formel av sann/usann-variabler bundet sammen med OG, ELLER og IKKE — kan du sette variablene slik at helheten blir sann? Å verifisere et kandidatsvar er trivielt; å finne ett kan være brutalt. SAT var det første problemet som noensinne ble bevist NP-fullstendig — sømmen der «lett å sjekke» og «lett å løse» trekkes fra hverandre, og maskinrommet for spørsmålet P mot NP.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Klarer du å gjøre den sann?",
    cards: [
      {
        label: "01",
        title: "Hovedidéen",
        body: "En boolsk formel bygges av variabler som hver er sanne eller usanne, bundet sammen med OG (∧), ELLER (∨) og IKKE (¬). Oppfyllbarhet stiller ett eneste spørsmål: finnes det en måte å sette variablene på slik at hele formelen blir sann? Hvis ja, er formelen oppfyllbar — oppgi tildelingen, så kan hvem som helst sjekke den på sekunder. Hvis nei, er den uoppfyllbar, og å bevise det kan bety å utelukke enhver mulighet.",
      },
      {
        label: "02",
        title: "Et konkret eksempel",
        body: "Ta (x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x). Tre klausuler bundet med OG, så alle tre må gjelde samtidig. Prøv x = sann, y = sann, z = usann: første klausul er sann (x), andre sann (y), tredje sann (¬z). Oppfylt. Du verifiserte nettopp en løsning raskere enn du rakk å lese dette kortet — men med 100 variabler og 500 klausuler er det å finne den tildelingen en helt annen sak.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "I 1971 beviste Stephen Cook at SAT er NP-fullstendig: ethvert problem hvis løsninger er raske å sjekke, kan skrives om til en SAT-instans i polynomtid. Avbild planleggingsproblemet ditt, gåten din, kryptonøkkelen din på en formel, så løser en SAT-løser den eller beviser at ingen løsning finnes. En rask SAT-algoritme ville fått tusen vanskelige problemer til å rase sammen på én gang — nettopp derfor tror nesten ingen at den finnes.",
      },
    ],
    tryIt: "Nedenfor: en formel du kan oppfylle for hånd. Vipp variablene til hver klausul blir grønn.",
  },
  sections: [
    {
      pretitle: "Del 01 · Grammatikken",
      title: "Variabler, literaler, klausuler, KNF",
      body: "En variabel er en bryter: sann eller usann. En literal er en variabel eller dens negasjon — x eller ¬x. En klausul er en håndfull literaler bundet med ELLER, som (x ∨ ¬y ∨ z); den er oppfylt så snart én literal er sann. En formel i konjunktiv normalform (KNF) er klausuler bundet med OG, så hver klausul må gjelde samtidig. SAT formuleres over KNF uten tap av generalitet: Tseitins transformasjon (1968) skriver om enhver boolsk formel til en ekvioppfyllbar KNF hvis størrelse bare vokser lineært — å kreve KNF koster nesten ingenting.",
    },
    {
      pretitle: "Del 02 · Lett å sjekke, vanskelig å finne",
      title: "Hvorfor SAT bor i NP",
      body: "Gi noen en tildeling, og de verifiserer den i ett eneste lineært gjennomløp — sett inn verdiene, evaluer hver klausul. Det plasserer SAT i NP: klassen av problemer hvis ja-svar bærer et kort sertifikat som er raskt å sjekke. Det åpne spørsmålet er om det er like lett å finne sertifikatet som å sjekke det. Ingen har funnet en polynomtidsalgoritme for SAT, og ingen har bevist at ingen finnes. Det gapet er problemet P mot NP, og SAT ligger nøyaktig på forkastningslinjen.",
    },
    {
      pretitle: "Del 03 · Den første brikken",
      title: "Cook–Levin og NP-fullstendighet",
      body: "Cook (1971) og, uavhengig bak jernteppet, Levin (1973) beviste det avgjørende: man kan kode hele kjøringen av enhver ikke-deterministisk polynomtidsmaskin som en boolsk formel — variabler for båndet, hodet og klokken; klausuler som tvinger fram beregningsreglene — slik at formelen er oppfyllbar nøyaktig når maskinen aksepterer. Altså reduseres ethvert problem i NP til SAT. Året etter viste Richard Karp at 21 berømte problemer — graffarging, hamiltonsk sykel, delmengdesum — også reduseres til det. SAT er den første brikken: velt den raskt, så faller hele rekken.",
    },
    {
      pretitle: "Del 04 · Hvordan løsere faktisk vinner",
      title: "DPLL, og søket som beskjærer seg selv",
      body: "Brute force-treet har 2ⁿ blader, ett per tildeling — håpløst forbi noen titalls variabler. Davis–Putnam–Logemann–Loveland-prosedyren (1962) gjør det til et søk som beskjærer seg selv: velg en variabel, anta en verdi, propager følgene. Enhetspropagering — har en klausul bare én utildelt literal igjen, er den literalen tvunget. Eliminering av ren literal — en variabel som bare opptrer positivt, kan rett og slett settes sann. Støter du på en motsigelse, gå tilbake. Moderne løsere legger til konfliktdrevet klausullæring, der hver blindvei lærer bort en ny klausul som blokkerer en hel familie av framtidige blindveier, og avgjør rutinemessig formler med millioner av variabler.",
    },
    {
      pretitle: "Del 05 · Der det blir vanskelig",
      title: "Løsbare øyer og faseovergangen",
      body: "Ikke alt SAT er vanskelig. 2-SAT — høyst to literaler per klausul — løses i lineær tid, det samme gjelder Horn-formler; XOR-formler ligger i polynomtid via gausseliminasjon over GF(2). Schaefers dikotomiteorem (1978) er forbløffende: ethvert boolsk skrankeproblem av denne formen er enten i P eller NP-fullstendig, med ingenting imellom. Og tilfeldig generert 3-SAT viser en faseovergang: når forholdet mellom klausuler og variabler krysser omtrent 4,27, vipper formler brått fra nesten-alltid-oppfyllbare til nesten-alltid-uoppfyllbare — og de aller vanskeligste instansene trengs nøyaktig ved den terskelen, som vann akkurat ved frysepunktet.",
    },
  ],
  toggleCaption: "Oppfyll for hånd",
  toggleHint:
    "Klikk a, b eller c for å vippe mellom sann og usann. En klausul blir grønn så snart én av literalene er sann; formelen er oppfylt når alle fire klausuler er grønne. Fire av de åtte tildelingene virker — finn én.",
  toggleSatisfied:
    "Oppfylt. Hver klausul har en sann literal, så hele formelen er sann — og du verifiserte det på sekunder. Å finne den var det lette tilfellet; tenk deg tusen variabler.",
  toggleUnsatisfied:
    "Ikke ennå — minst én klausul er fortsatt helt usann (i rosa). Vipp en variabel og se klausulene reagere.",
  toggleReset: "nullstill",
  closingPretitle: "Utforsk",
  closingTitle: "Se en løser forgrene seg og gå tilbake.",
  closingBody:
    "Utforskeren kjører et DPLL-søk på en formel du styrer: den velger en variabel, propagerer de tvungne følgene og går tilbake fra hver motsigelse. Steg gjennom, eller la den løpe, og se søketreet som P mot NP egentlig handler om.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

export default function SatStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/sat/explorer"
      accent={ACCENT}
      borderAccent="border-signal-violet/70"
      bgAccent="bg-signal-violet/10"
      hoverAccent="hover:bg-signal-violet/20"
      gradient="from-signal-violet/10"
      formulaBadge="(x ∨ ¬y) ∧ (y ∨ z) ∧ (¬z ∨ ¬x)"
      formulaLatex={"(x \\lor \\neg y) \\land (y \\lor z) \\land (\\neg z \\lor \\neg x)"}
      formulaSize="md"
      finalLabel={story.closingTitle}
    >
      {/* Signature hero */}
      <Reveal>
        <div className="mx-auto mb-24 max-w-4xl">
          <SatClauseHero />
        </div>
      </Reveal>

      {/* Encounter — three approachable cards */}
      <section className="mx-auto mb-32 max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <Reveal>
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.encounter.pretitle}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">
              {story.encounter.title}
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {story.encounter.cards.map((card, i) => (
            <Reveal key={card.label} delay={120 + i * 100}>
              <EncounterCard label={card.label} title={card.title}>
                <p>{card.body}</p>
              </EncounterCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <div className="text-center italic text-ink-300">{story.encounter.tryIt}</div>
        </Reveal>
      </section>

      {/* Inline interactive — satisfy a formula by hand */}
      <section className="mx-auto mb-32 max-w-3xl">
        <Reveal>
          <SatClauseToggle
            caption={story.toggleCaption}
            hint={story.toggleHint}
            satisfiedLabel={story.toggleSatisfied}
            unsatisfiedLabel={story.toggleUnsatisfied}
            resetLabel={story.toggleReset}
          />
        </Reveal>
      </section>

      {/* Section 01 — grammar */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — easy to check */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Cook–Levin */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — DPLL */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 05 — phase transition */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="glass hairline mx-auto mt-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {story.closingPretitle}
          </div>
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {story.closingTitle}
          </div>
          <p className="leading-relaxed text-ink-200">{story.closingBody}</p>
          <Link
            href="/sat/explorer"
            className="inline-block rounded-full border border-signal-violet/70 bg-signal-violet/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/25"
          >
            {story.ctaLabel}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}

function EncounterCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-violet/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
