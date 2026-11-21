import type { ExplorerGuide } from "./types";

// Numbers quoted here (32 cells, 8-bit wrap, default cap 2000, slider 10 to
// 10000 in steps of 10, speed 1 to 200 with default 40, 500 steps per frame,
// 301 and 446 steps to halt, k = 111, Goldbach reaching n = 220 and n = 848,
// D halting at step 3) match app/halting/explorer/page.tsx and
// lib/halting/machine.ts, and are pinned in tests/utilities.test.ts; update
// all of them together.
const STEP_EXCERPT = `function stepVM(state, code, jumps, stepCap) {
  if (state.status !== "running") return state;
  if (state.step >= stepCap) return { ...state, status: "cap" };
  const tape = state.tape.slice();   // keep the React updater pure
  let { pointer, pc } = state;
  switch (code[pc]) {
    case "+": tape[pointer] = (tape[pointer] + 1) & 0xff; pc++; break;
    case "-": tape[pointer] = (tape[pointer] - 1) & 0xff; pc++; break;
    case ">": pointer = (pointer + 1) % TAPE_SIZE; pc++; break;
    case "[": pc = tape[pointer] === 0 ? jumps.get(pc) + 1 : pc + 1; break;
    case "]": pc = tape[pointer] !== 0 ? jumps.get(pc) + 1 : pc + 1; break;
    default: pc++;                   // anything else is a comment
  }
  const status = pc >= code.length ? "halted" : "running";
  return { tape, pointer, pc, step: state.step + 1, status };
}`;

export const HALTING_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Run tiny programs on a toy machine and watch the step limit decide: halted, or unknown. A hands-on look at why the halting problem is undecidable.",
    heading: "How this explorer works",
    intro:
      "On the left is a miniature computer. Two of the six programs run on a tape machine (a six-symbol language, 32 memory cells and a pointer that walks along them), the other four on a small register machine with numbered lines. Press Run and it executes one instruction at a time until either the program ends (amber: «halted at step k») or the step limit fires (rose: still running, no way to tell whether it would ever stop). That second answer is the point of the room.",
    sections: [
      {
        heading: "The question no program can answer",
        paragraphs: [
          "The halting problem asks for a single procedure halts(P, x) that takes any program P and any input x and always answers, in finite time, whether P eventually stops on x. Alan Turing proved in 1936 that no such procedure exists. The proof is a diagonal trick: assume halts exists and build a program D that, given a program P, asks halts(P, P) and then does the opposite (loops forever if the answer is yes, stops if it is no). Now ask what D does on itself. If D(D) halts, halts said yes, so D loops. If D(D) loops, halts said no, so D halts. Both cases contradict the definition, so the assumption was wrong.",
          "Undecidable does not mean that no program can be analysed. It means that every analyser, however clever, has programs on which it must either give a wrong answer or never answer at all. The step limit is the simplest possible analyser: run the program for N steps and report what you saw. It is always right when it says «halted», and it can never be sure when it says nothing.",
        ],
        formula:
          "D(P) = \\begin{cases} \\text{loop forever} & \\text{if } \\mathrm{halts}(P, P) = \\top \\\\ \\text{halt} & \\text{if } \\mathrm{halts}(P, P) = \\bot \\end{cases}",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The program list offers six entries, and each one runs what its name says. «Increment forever» (+[>+<]) sets cell 0 to 1 and then loops on it while bumping cell 1, so it never stops; «Count to 100» puts 100 into cell 0 and the loop [-] counts it down, halting after exactly 301 steps (100 increments, one entry check, then two steps per pass). The other four need bigger numbers than an 8-bit cell holds and run on the register machine. «Collatz on 27» iterates n/2 or 3n+1 and counts the rounds in register k: it halts with k = 111 after 446 machine steps. «Collatz on input» is the same program with a start value you type in. «Goldbach search» tests 4, 6, 8, … in turn and would halt only at an even number that is not a sum of two primes. «Self-referential D» is an illustration and says so: no real halts can be written, so you enter the answer a claimed decider would give for halts(D, D), and D does the opposite. The ground-truth line under each program says what mathematics actually knows.",
          "Step runs one instruction, Run and Pause drive the machine continuously, and Reset clears the machine. The step limit slider goes from 10 to 10000 in steps of 10 and starts at 2000; the speed slider runs from 1 to 200 steps per second and starts at 40. Cyan marks the next instruction and the pointer, amber the non-zero cells and registers.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "The machine speaks a Brainfuck-style instruction set: + and − change the current cell (8-bit, wrapping modulo 256), > and < move the pointer (wrapping around the 32-cell tape), and [ ] form a loop that is skipped or repeated depending on whether the current cell is zero. Every other character is a comment. Before running, the page builds a jump table with a stack in one pass over the source, so each bracket finds its partner in constant time. The register machine is simpler still: integer registers, numbered lines, one line per step. A line assigns, tests, jumps or halts, and prime(p) is a built-in test by trial division.",
          "The state lives in React: a Uint8Array tape, the pointer, the program counter, the step count and a status. Each step copies the 32-byte tape before changing it, because React may call state updaters twice in development and an in-place change would apply every + twice. In Run mode a requestAnimationFrame loop accumulates elapsed time times the chosen speed and executes that many whole steps per frame, at most 500, then stops itself once the status is no longer running. If your system asks for reduced motion, Run skips the playback: it computes straight through to the verdict (halted, or limit reached) and shows the final state. Step still advances one instruction at a time.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Why a bigger limit does not help",
        paragraphs: [
          "For «Count to 100» the rose verdict is just impatience: raise the limit and the answer becomes definite. But for the Goldbach search no finite limit settles anything. Here it gets to n = 220 within 2000 steps and to n = 848 within 10000. Computers have checked every even number up to 4·10¹⁸ and found each one a sum of two primes, so a real search would run at least that long before finding a counterexample, and if Goldbach is true it runs forever. Turing's theorem says this is not a weakness of this particular page: whatever cleverer analyser you build, some program will leave it in the same position.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Catch the analyser one step short",
        text: "Choose «Count to 100», set the step limit to 300 and press Run. The status turns rose: from the analyser's point of view the program might run forever. Reset, move the limit to 310 and run again. Now it halts at step 301. Same program, different verdict, purely because of the budget.",
      },
      {
        title: "The same with Collatz",
        text: "Pick «Collatz on 27» and set the limit to 440. It gives up. At 450 the program halts at step 446 with k = 111. On the way, register n climbs as high as 9232 before falling back to 1.",
      },
      {
        title: "Watch a cell wrap around",
        text: "Select «Increment forever», raise the speed to 200 and the limit to 2000. Cell 1 climbs to 255 and then wraps to 0, because cells hold 8-bit values. The loop itself is guarded by cell 0, which stays at 1, so the wrap never lets the program escape.",
      },
      {
        title: "Give D both answers",
        text: "Choose «Self-referential D». With h = 1 (the decider claims D halts) it loops until the limit fires. Set h to 0 (the decider claims D runs forever) and it halts at step 3. Whichever answer you supply, D proves it wrong.",
      },
    ],
  },
  de: {
    metaDescription:
      "Kleine Programme auf einer Spielzeugmaschine laufen lassen und sehen, wie das Schrittlimit urteilt: angehalten oder unbekannt. Das Halteproblem zum Anfassen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Links siehst du einen Miniaturcomputer. Zwei der sechs Programme laufen auf einer Bandmaschine (eine Sprache mit sechs Zeichen, 32 Speicherzellen und ein Zeiger, der darauf hin und her läuft), die anderen vier auf einer kleinen Registermaschine mit nummerierten Zeilen. Drück auf Los, und er arbeitet Befehl für Befehl, bis entweder das Programm endet (bernsteinfarben: «angehalten bei Schritt k») oder das Schrittlimit greift (rosa: läuft noch, und niemand kann sagen, ob es je anhält). Um diese zweite Antwort geht es hier.",
    sections: [
      {
        heading: "Die Frage, die kein Programm beantworten kann",
        paragraphs: [
          "Das Halteproblem verlangt ein einziges Verfahren halts(P, x), das für jedes Programm P und jede Eingabe x in endlicher Zeit sicher sagt, ob P auf x irgendwann stoppt. Alan Turing hat 1936 bewiesen, dass es so ein Verfahren nicht gibt. Der Beweis ist ein Diagonaltrick: Angenommen, halts existiert. Dann baust du ein Programm D, das zu einem Programm P die Frage halts(P, P) stellt und das Gegenteil tut (endlos laufen bei Ja, anhalten bei Nein). Was macht D, wenn du es auf sich selbst ansetzt? Hält D(D) an, hat halts Ja gesagt, also läuft D endlos. Läuft D(D) endlos, hat halts Nein gesagt, also hält D an. Beide Fälle widersprechen der Definition, die Annahme war also falsch.",
          "Unentscheidbar heißt nicht, dass sich kein Programm analysieren lässt. Es heißt, dass jeder Analysator, egal wie raffiniert, auf Programme trifft, bei denen er entweder falsch liegt oder nie antwortet. Das Schrittlimit ist der einfachste denkbare Analysator: Lass das Programm N Schritte laufen und berichte, was du gesehen hast. Sagt es «angehalten», stimmt das immer. Sagt es nichts, kann es nie sicher sein.",
        ],
        formula:
          "D(P) = \\begin{cases} \\text{endlos laufen} & \\text{falls } \\mathrm{halts}(P, P) = \\top \\\\ \\text{anhalten} & \\text{falls } \\mathrm{halts}(P, P) = \\bot \\end{cases}",
      },
      {
        heading: "Was die Bedienelemente tun",
        paragraphs: [
          "In der Programmliste stehen sechs Einträge, und jeder tut, was sein Name sagt. «Endlos hochzählen» (+[>+<]) setzt Zelle 0 auf 1 und kreist dann darauf, während es Zelle 1 erhöht, hält also nie an. «Bis 100 zählen» schreibt 100 in Zelle 0, und die Schleife [-] zählt herunter. Es hält nach genau 301 Schritten (100 Erhöhungen, eine Eingangsprüfung, dann zwei Schritte pro Durchlauf). Die anderen vier brauchen größere Zahlen, als in eine 8-Bit-Zelle passen, und laufen auf der Registermaschine. «Collatz für 27» iteriert n/2 oder 3n+1 und zählt die Runden im Register k: Es hält mit k = 111 nach 446 Maschinenschritten. «Collatz für Eingabe» ist dasselbe Programm mit einem Startwert, den du eintippst. «Goldbach-Suche» prüft der Reihe nach 4, 6, 8, … und würde nur bei einer geraden Zahl anhalten, die keine Summe zweier Primzahlen ist. «Selbstbezügliches D» ist eine Illustration und sagt das auch: Ein echtes halts lässt sich nicht schreiben, also gibst du die Antwort ein, die ein angeblicher Entscheider auf halts(D, D) gäbe, und D tut das Gegenteil. Die Zeile «Was wir wissen» unter jedem Programm sagt, was die Mathematik tatsächlich weiß.",
          "Schritt führt einen Befehl aus, Los und Pause steuern den Dauerbetrieb, Zurücksetzen leert die Maschine. Der Regler für das Schrittlimit reicht von 10 bis 10000 in Zehnerschritten und startet bei 2000, der Geschwindigkeitsregler von 1 bis 200 Schritten pro Sekunde mit Startwert 40. Cyan markiert den nächsten Befehl und den Zeiger, Bernstein die Zellen und Register ungleich null.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die Maschine versteht einen Befehlssatz im Stil von Brainfuck: + und − ändern die aktuelle Zelle (8 Bit, modulo 256), > und < bewegen den Zeiger (am Ende des Bandes geht es vorne weiter), und [ ] bilden eine Schleife, die übersprungen oder wiederholt wird, je nachdem, ob die aktuelle Zelle null ist. Jedes andere Zeichen ist Kommentar. Vor dem Start baut die Seite in einem Durchgang mit einem Stapel eine Sprungtabelle, sodass jede Klammer ihr Gegenstück in konstanter Zeit findet. Die Registermaschine ist noch einfacher: ganzzahlige Register, nummerierte Zeilen, eine Zeile pro Schritt. Eine Zeile weist zu, prüft, springt oder hält an, und prime(p) ist ein eingebauter Test per Probedivision.",
          "Der Zustand liegt in React: ein Uint8Array als Band, Zeiger, Programmzähler, Schrittzahl und Status. Jeder Schritt kopiert die 32 Byte des Bandes, bevor er etwas ändert, denn React ruft Updater im Entwicklungsmodus manchmal doppelt auf, und eine Änderung an Ort und Stelle würde jedes + zweimal anwenden. Im Dauerbetrieb sammelt eine requestAnimationFrame-Schleife die verstrichene Zeit mal Geschwindigkeit und führt so viele ganze Schritte pro Frame aus, höchstens 500. Sobald der Status nicht mehr «läuft» ist, hält sie sich selbst an. Wünscht dein System reduzierte Bewegung, überspringt Los das Abspielen: Die Seite rechnet direkt bis zum Urteil durch (angehalten oder Limit erreicht) und zeigt den Endzustand. «Schritt» geht weiterhin Befehl für Befehl vor.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Warum ein größeres Limit nicht hilft",
        paragraphs: [
          "Bei «Bis 100 zählen» ist das rosa Urteil bloß Ungeduld: Erhöhst du das Limit, wird die Antwort eindeutig. Bei der Goldbach-Suche aber entscheidet kein endliches Limit irgendetwas. Hier kommt sie in 2000 Schritten bis n = 220 und in 10000 bis n = 848. Computer haben jede gerade Zahl bis 4·10¹⁸ geprüft und jede als Summe zweier Primzahlen gefunden. Eine echte Suche müsste also mindestens so lange laufen, bevor sie ein Gegenbeispiel fände, und wenn Goldbach stimmt, läuft sie ewig. Turings Satz sagt: Das ist keine Schwäche dieser Seite. Welchen klügeren Analysator du auch baust, ein Programm bringt ihn in dieselbe Lage.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Den Analysator einen Schritt zu früh erwischen",
        text: "Wähl «Bis 100 zählen», stell das Schrittlimit auf 300 und drück auf Los. Der Status wird rosa: Aus Sicht des Analysators könnte das Programm ewig laufen. Setz zurück, schieb das Limit auf 310 und starte erneut. Jetzt hält es bei Schritt 301. Dasselbe Programm, ein anderes Urteil, nur wegen des Budgets.",
      },
      {
        title: "Dasselbe mit Collatz",
        text: "Nimm «Collatz für 27» und setz das Limit auf 440. Es gibt auf. Bei 450 hält das Programm bei Schritt 446 mit k = 111. Unterwegs steigt das Register n bis auf 9232, bevor es auf 1 zurückfällt.",
      },
      {
        title: "Eine Zelle überlaufen sehen",
        text: "Wähl «Endlos hochzählen», stell die Geschwindigkeit auf 200 und das Limit auf 2000. Zelle 1 klettert bis 255 und springt dann auf 0, weil die Zellen 8-Bit-Werte speichern. Die Schleife selbst hängt an Zelle 0, die bei 1 bleibt, deshalb hilft der Überlauf dem Programm nicht heraus.",
      },
      {
        title: "Gib D beide Antworten",
        text: "Wähl «Selbstbezügliches D». Mit h = 1 (der Entscheider behauptet, D hält) kreist es, bis das Limit greift. Stell h auf 0 (der Entscheider behauptet, D läuft endlos), und es hält bei Schritt 3. Welche Antwort du auch vorgibst, D widerlegt sie.",
      },
    ],
  },
};
