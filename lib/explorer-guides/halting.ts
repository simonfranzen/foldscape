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

// The case labels inside the display formula are prose, so each locale passes
// its own words; the mathematical skeleton stays the same everywhere.
const diagonalFormula = (loop: string, halt: string, when: string) =>
  `D(P) = \\begin{cases} \\text{${loop}} & \\text{${when} } \\mathrm{halts}(P, P) = \\top \\\\ \\text{${halt}} & \\text{${when} } \\mathrm{halts}(P, P) = \\bot \\end{cases}`;

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
          "Die Maschine versteht einen Befehlssatz im Stil von Brainfuck: + und − ändern die aktuelle Zelle (8 Bit, modulo 256), > und < bewegen den Zeiger (am Ende des 32 Zellen langen Bandes geht es vorne weiter), und [ ] bilden eine Schleife, die übersprungen oder wiederholt wird, je nachdem, ob die aktuelle Zelle null ist. Jedes andere Zeichen ist Kommentar. Vor dem Start baut die Seite in einem Durchgang mit einem Stapel eine Sprungtabelle, sodass jede Klammer ihr Gegenstück in konstanter Zeit findet. Die Registermaschine ist noch einfacher: ganzzahlige Register, nummerierte Zeilen, eine Zeile pro Schritt. Eine Zeile weist zu, prüft, springt oder hält an, und prime(p) ist ein eingebauter Test per Probedivision.",
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
  es: {
    metaDescription:
      "Ejecuta programas diminutos en una máquina de juguete y mira cómo decide el límite de pasos. El problema de la parada y por qué es indecidible, en directo.",
    heading: "Cómo funciona este explorador",
    intro:
      "A la izquierda hay un ordenador en miniatura. Dos de los seis programas corren en una máquina de cinta (un lenguaje de seis símbolos, 32 celdas de memoria y un puntero que las recorre), y los otros cuatro en una pequeña máquina de registros con líneas numeradas. Pulsa «Ejecutar» y la máquina ejecuta una instrucción cada vez hasta que el programa termina (ámbar: «detenido en el paso k») o salta el límite de pasos (rosa: sigue en marcha y no hay forma de saber si alguna vez se detendría). Esa segunda respuesta es la razón de ser de esta sala.",
    sections: [
      {
        heading: "La pregunta que ningún programa puede responder",
        paragraphs: [
          "El problema de la parada pide un único procedimiento halts(P, x) que tome cualquier programa P y cualquier entrada x y responda siempre, en tiempo finito, si P acaba deteniéndose con x. Alan Turing demostró en 1936 que tal procedimiento no existe. La demostración es un truco diagonal: supón que halts existe y construye un programa D que, dado un programa P, pregunta halts(P, P) y luego hace lo contrario (entra en un bucle infinito si la respuesta es sí, se detiene si es no). Pregúntate ahora qué hace D consigo mismo. Si D(D) se detiene, halts dijo que sí, así que D entra en bucle. Si D(D) entra en bucle, halts dijo que no, así que D se detiene. Ambos casos contradicen la definición, luego la suposición era falsa.",
          "Indecidible no significa que no se pueda analizar ningún programa. Significa que todo analizador, por ingenioso que sea, tiene programas ante los cuales debe dar una respuesta equivocada o no responder nunca. El límite de pasos es el analizador más simple posible: ejecuta el programa durante N pasos e informa de lo que has visto. Siempre acierta cuando dice «detenido», y nunca puede estar seguro cuando no dice nada.",
        ],
        formula: diagonalFormula("bucle infinito", "detenerse", "si"),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "La lista de programas ofrece seis entradas, y cada una hace lo que su nombre indica. «Incrementar sin fin» (+[>+<]) pone la celda 0 a 1 y luego gira en bucle sobre ella mientras va subiendo la celda 1, así que nunca se detiene; «Contar hasta 100» pone 100 en la celda 0 y el bucle [-] la va descontando, y se detiene tras exactamente 301 pasos (100 incrementos, una comprobación de entrada y después dos pasos por vuelta). Los otros cuatro necesitan números mayores de los que caben en una celda de 8 bits y corren en la máquina de registros. «Collatz de 27» itera n/2 o 3n+1 y cuenta las rondas en el registro k: se detiene con k = 111 tras 446 pasos de máquina. «Collatz de una entrada» es el mismo programa con un valor inicial que escribes tú. «Búsqueda de Goldbach» comprueba 4, 6, 8, … uno tras otro y solo se detendría ante un número par que no sea suma de dos primos. «D autorreferencial» es una ilustración y así lo dice: no se puede escribir un halts de verdad, de modo que introduces la respuesta que daría un supuesto decisor para halts(D, D), y D hace lo contrario. La línea «Lo que sabemos» bajo cada programa dice lo que las matemáticas saben realmente.",
          "«Paso» ejecuta una instrucción, «Ejecutar» y «Pausa» controlan la marcha continua y «Reiniciar» vacía la máquina. El deslizador del límite de pasos va de 10 a 10 000 en saltos de 10 y empieza en 2000; el de velocidad va de 1 a 200 pasos por segundo y empieza en 40. El cian marca la siguiente instrucción y el puntero, y el ámbar las celdas y los registros distintos de cero.",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "La máquina habla un juego de instrucciones al estilo de Brainfuck: + y − cambian la celda actual (8 bits, con desbordamiento módulo 256), > y < mueven el puntero (que da la vuelta al llegar al final de la cinta de 32 celdas), y [ ] forman un bucle que se salta o se repite según la celda actual sea cero o no. Cualquier otro carácter es un comentario. Antes de ejecutar, la página construye una tabla de saltos con una pila en una sola pasada por el código fuente, de modo que cada corchete encuentra a su pareja en tiempo constante. La máquina de registros es aún más sencilla: registros enteros, líneas numeradas, una línea por paso. Una línea asigna, comprueba, salta o se detiene, y prime(p) es una prueba incorporada por división por tentativa.",
          "El estado vive en React: una cinta Uint8Array, el puntero, el contador de programa, el número de pasos y un estado. Cada paso copia la cinta de 32 bytes antes de modificarla, porque React puede llamar dos veces a las funciones de actualización de estado en desarrollo, y un cambio in situ aplicaría cada + dos veces. En modo de ejecución continua, un bucle de requestAnimationFrame acumula el tiempo transcurrido multiplicado por la velocidad elegida y ejecuta ese número de pasos enteros por fotograma, 500 como máximo, y se para a sí mismo en cuanto el estado deja de ser «en ejecución». Si tu sistema pide movimiento reducido, «Ejecutar» se salta la reproducción: calcula de un tirón hasta el veredicto (detenido o límite alcanzado) y muestra el estado final. «Paso» sigue avanzando de instrucción en instrucción.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Por qué un límite mayor no ayuda",
        paragraphs: [
          "Para «Contar hasta 100», el veredicto rosa es pura impaciencia: sube el límite y la respuesta se vuelve definitiva. Pero para la búsqueda de Goldbach ningún límite finito resuelve nada. Aquí llega a n = 220 en 2000 pasos y a n = 848 en 10 000. Los ordenadores han comprobado todos los números pares hasta 4·10¹⁸ y cada uno ha resultado ser suma de dos primos, así que una búsqueda real tendría que correr al menos todo ese tramo antes de encontrar un contraejemplo, y si Goldbach es cierta corre para siempre. El teorema de Turing dice que esto no es una debilidad de esta página en concreto: sea cual sea el analizador más listo que construyas, algún programa lo dejará en la misma situación.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Pilla al analizador a un paso de la meta",
        text: "Elige «Contar hasta 100», pon el límite de pasos en 300 y pulsa «Ejecutar». El estado se vuelve rosa: desde el punto de vista del analizador, el programa podría correr para siempre. Reinicia, lleva el límite a 310 y ejecuta de nuevo. Ahora se detiene en el paso 301. El mismo programa, otro veredicto, únicamente por el presupuesto.",
      },
      {
        title: "Lo mismo con Collatz",
        text: "Escoge «Collatz de 27» y pon el límite en 440. Se rinde. Con 450, el programa se detiene en el paso 446 con k = 111. Por el camino, el registro n sube hasta 9232 antes de volver a caer a 1.",
      },
      {
        title: "Mira cómo se desborda una celda",
        text: "Selecciona «Incrementar sin fin», sube la velocidad a 200 y el límite a 2000. La celda 1 sube hasta 255 y luego vuelve a 0, porque las celdas guardan valores de 8 bits. El bucle en sí depende de la celda 0, que se queda en 1, así que el desbordamiento nunca deja escapar al programa.",
      },
      {
        title: "Dale a D las dos respuestas",
        text: "Elige «D autorreferencial». Con h = 1 (el decisor afirma que D se detiene) gira en bucle hasta que salta el límite. Pon h a 0 (el decisor afirma que D no termina nunca) y se detiene en el paso 3. Des la respuesta que des, D demuestra que es falsa.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Lance de petits programmes sur une machine jouet et regarde la limite de pas trancher. Le problème de l'arrêt et son indécidabilité, à manipuler toi-même.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "À gauche se trouve un ordinateur miniature. Deux des six programmes tournent sur une machine à ruban (un langage de six symboles, 32 cellules de mémoire et un pointeur qui les parcourt), les quatre autres sur une petite machine à registres aux lignes numérotées. Appuie sur « Lancer » et elle exécute une instruction à la fois, jusqu'à ce que le programme se termine (ambre : « arrêté au pas k ») ou que la limite de pas se déclenche (rose : toujours en cours, impossible de dire s'il s'arrêterait un jour). Cette seconde réponse est tout l'enjeu de la salle.",
    sections: [
      {
        heading: "La question à laquelle aucun programme ne peut répondre",
        paragraphs: [
          "Le problème de l'arrêt demande une procédure unique halts(P, x) qui prenne n'importe quel programme P et n'importe quelle entrée x et réponde toujours, en temps fini, si P finit par s'arrêter sur x. Alan Turing a prouvé en 1936 qu'une telle procédure n'existe pas. La preuve est une astuce diagonale : suppose que halts existe et construis un programme D qui, étant donné un programme P, demande halts(P, P) puis fait le contraire (boucle sans fin si la réponse est oui, s'arrête si c'est non). Demande-toi maintenant ce que fait D sur lui-même. Si D(D) s'arrête, halts a dit oui, donc D boucle. Si D(D) boucle, halts a dit non, donc D s'arrête. Les deux cas contredisent la définition, l'hypothèse était donc fausse.",
          "Indécidable ne veut pas dire qu'aucun programme ne peut être analysé. Cela veut dire que tout analyseur, aussi malin soit-il, rencontre des programmes sur lesquels il doit soit donner une mauvaise réponse, soit ne jamais répondre. La limite de pas est l'analyseur le plus simple qui soit : exécute le programme pendant N pas et rapporte ce que tu as vu. Il a toujours raison quand il dit « arrêté », et il ne peut jamais être sûr quand il ne dit rien.",
        ],
        formula: diagonalFormula("boucler sans fin", "s'arrêter", "si"),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "La liste des programmes propose six entrées, et chacune fait ce que son nom annonce. « Incrémenter sans fin » (+[>+<]) met la cellule 0 à 1 puis boucle dessus tout en augmentant la cellule 1, et ne s'arrête donc jamais ; « Compter jusqu'à 100 » place 100 dans la cellule 0 et la boucle [-] la décompte, avec un arrêt après exactement 301 pas (100 incréments, un test d'entrée, puis deux pas par tour). Les quatre autres ont besoin de nombres plus grands que ce que contient une cellule de 8 bits et tournent sur la machine à registres. « Collatz sur 27 » itère n/2 ou 3n+1 et compte les tours dans le registre k : il s'arrête avec k = 111 après 446 pas de machine. « Collatz sur une entrée » est le même programme avec une valeur de départ que tu saisis. « Recherche de Goldbach » teste 4, 6, 8, … tour à tour et ne s'arrêterait que sur un nombre pair qui n'est pas la somme de deux nombres premiers. « D autoréférentiel » est une illustration et le dit : aucun vrai halts ne peut être écrit, tu saisis donc la réponse qu'un prétendu décideur donnerait pour halts(D, D), et D fait le contraire. La ligne « Ce que l'on sait » sous chaque programme indique ce que les mathématiques savent réellement.",
          "« Pas » exécute une instruction, « Lancer » et « Pause » pilotent la machine en continu, et « Réinitialiser » vide la machine. Le curseur de limite de pas va de 10 à 10\u00a0000 par crans de 10 et démarre à 2\u00a0000 ; le curseur de vitesse va de 1 à 200 pas par seconde et démarre à 40. Le cyan marque la prochaine instruction et le pointeur, l'ambre les cellules et les registres non nuls.",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "La machine parle un jeu d'instructions à la Brainfuck : + et − modifient la cellule courante (8 bits, avec bouclage modulo 256), > et < déplacent le pointeur (qui reboucle au bout du ruban de 32 cellules), et [ ] forment une boucle qui est sautée ou répétée selon que la cellule courante vaut zéro ou non. Tout autre caractère est un commentaire. Avant l'exécution, la page construit une table de sauts à l'aide d'une pile, en une seule passe sur le code source, si bien que chaque crochet trouve son partenaire en temps constant. La machine à registres est plus simple encore : des registres entiers, des lignes numérotées, une ligne par pas. Une ligne affecte, teste, saute ou s'arrête, et prime(p) est un test intégré par divisions successives.",
          "L'état vit dans React : un ruban Uint8Array, le pointeur, le compteur de programme, le nombre de pas et un statut. Chaque pas copie le ruban de 32 octets avant de le modifier, car React peut appeler deux fois les fonctions de mise à jour d'état en développement, et une modification en place appliquerait chaque + deux fois. En mode continu, une boucle requestAnimationFrame accumule le temps écoulé multiplié par la vitesse choisie et exécute ce nombre de pas entiers par image, 500 au maximum, puis s'arrête d'elle-même dès que le statut n'est plus « en cours ». Si ton système demande une réduction des animations, « Lancer » saute la lecture : le calcul va directement jusqu'au verdict (arrêté, ou limite atteinte) et l'état final s'affiche. « Pas » continue d'avancer une instruction à la fois.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Pourquoi une limite plus grande n'aide pas",
        paragraphs: [
          "Pour « Compter jusqu'à 100 », le verdict rose n'est que de l'impatience : augmente la limite et la réponse devient définitive. Mais pour la recherche de Goldbach, aucune limite finie ne règle quoi que ce soit. Ici, elle atteint n = 220 en 2\u00a0000 pas et n = 848 en 10\u00a0000. Des ordinateurs ont vérifié tous les nombres pairs jusqu'à 4·10¹⁸ et chacun s'est révélé être la somme de deux nombres premiers, de sorte qu'une vraie recherche tournerait au moins aussi longtemps avant de trouver un contre-exemple, et si Goldbach est vraie elle tourne pour toujours. Le théorème de Turing dit que ce n'est pas une faiblesse de cette page en particulier : quel que soit l'analyseur plus malin que tu construis, un programme le laissera dans la même situation.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Prends l'analyseur en défaut à un pas près",
        text: "Choisis « Compter jusqu'à 100 », règle la limite de pas sur 300 et appuie sur « Lancer ». Le statut vire au rose : du point de vue de l'analyseur, le programme pourrait tourner pour toujours. Réinitialise, pousse la limite à 310 et relance. Cette fois, il s'arrête au pas 301. Même programme, verdict différent, uniquement à cause du budget.",
      },
      {
        title: "La même chose avec Collatz",
        text: "Prends « Collatz sur 27 » et règle la limite sur 440. Il abandonne. À 450, le programme s'arrête au pas 446 avec k = 111. En chemin, le registre n grimpe jusqu'à 9\u00a0232 avant de retomber à 1.",
      },
      {
        title: "Regarde une cellule reboucler",
        text: "Sélectionne « Incrémenter sans fin », monte la vitesse à 200 et la limite à 2\u00a0000. La cellule 1 grimpe jusqu'à 255 puis repasse à 0, parce que les cellules contiennent des valeurs de 8 bits. La boucle elle-même est gardée par la cellule 0, qui reste à 1, de sorte que le rebouclage ne laisse jamais le programme s'échapper.",
      },
      {
        title: "Donne à D les deux réponses",
        text: "Choisis « D autoréférentiel ». Avec h = 1 (le décideur affirme que D s'arrête), il boucle jusqu'à ce que la limite se déclenche. Mets h à 0 (le décideur affirme que D tourne sans fin) et il s'arrête au pas 3. Quelle que soit la réponse que tu fournis, D lui donne tort.",
      },
    ],
  },
  it: {
    metaDescription:
      "Esegui brevi programmi su una macchina giocattolo e guarda il limite di passi decidere. Il problema dell'arresto e la sua indecidibilità, da toccare con mano.",
    heading: "Come funziona questo esploratore",
    intro:
      "A sinistra c'è un computer in miniatura. Due dei sei programmi girano su una macchina a nastro (un linguaggio di sei simboli, 32 celle di memoria e un puntatore che le percorre), gli altri quattro su una piccola macchina a registri con righe numerate. Premi «Avvia» ed esegue un'istruzione alla volta finché il programma termina (ambra: «fermato al passo k») oppure scatta il limite di passi (rosa: ancora in esecuzione, e non c'è modo di dire se si fermerebbe mai). Questa seconda risposta è il senso della stanza.",
    sections: [
      {
        heading: "La domanda a cui nessun programma sa rispondere",
        paragraphs: [
          "Il problema dell'arresto chiede un'unica procedura halts(P, x) che prenda un qualsiasi programma P e un qualsiasi input x e risponda sempre, in tempo finito, se P prima o poi si ferma su x. Alan Turing dimostrò nel 1936 che una procedura simile non esiste. La dimostrazione è un trucco diagonale: supponi che halts esista e costruisci un programma D che, dato un programma P, chiede halts(P, P) e poi fa il contrario (cicla per sempre se la risposta è sì, si ferma se è no). Ora chiediti che cosa fa D su sé stesso. Se D(D) si ferma, halts ha detto sì, quindi D cicla. Se D(D) cicla, halts ha detto no, quindi D si ferma. Entrambi i casi contraddicono la definizione, perciò l'ipotesi era sbagliata.",
          "Indecidibile non significa che nessun programma si possa analizzare. Significa che ogni analizzatore, per quanto ingegnoso, ha programmi sui quali deve dare una risposta sbagliata oppure non rispondere mai. Il limite di passi è l'analizzatore più semplice possibile: esegui il programma per N passi e riferisci ciò che hai visto. Ha sempre ragione quando dice «fermato», e non può mai essere sicuro quando non dice nulla.",
        ],
        formula: diagonalFormula("ciclare per sempre", "fermarsi", "se"),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "L'elenco dei programmi offre sei voci, e ciascuna fa ciò che dice il suo nome. «Incrementa all'infinito» (+[>+<]) imposta la cella 0 a 1 e poi ci cicla sopra mentre fa salire la cella 1, quindi non si ferma mai; «Conta fino a 100» mette 100 nella cella 0 e il ciclo [-] la decrementa, fermandosi dopo esattamente 301 passi (100 incrementi, un controllo d'ingresso, poi due passi per giro). Gli altri quattro hanno bisogno di numeri più grandi di quelli che entrano in una cella a 8 bit e girano sulla macchina a registri. «Collatz su 27» itera n/2 oppure 3n+1 e conta i giri nel registro k: si ferma con k = 111 dopo 446 passi di macchina. «Collatz su input» è lo stesso programma con un valore iniziale che digiti tu. «Ricerca di Goldbach» controlla 4, 6, 8, … uno dopo l'altro e si fermerebbe solo davanti a un numero pari che non è somma di due primi. «D autoreferenziale» è un'illustrazione e lo dichiara: un vero halts non si può scrivere, perciò inserisci la risposta che un presunto decisore darebbe per halts(D, D), e D fa il contrario. La riga «Ciò che sappiamo» sotto ogni programma dice che cosa la matematica sa davvero.",
          "«Passo» esegue un'istruzione, «Avvia» e «Pausa» comandano l'esecuzione continua e «Reimposta» azzera la macchina. Il cursore del limite di passi va da 10 a 10.000 a passi di 10 e parte da 2000; quello della velocità va da 1 a 200 passi al secondo e parte da 40. Il ciano indica la prossima istruzione e il puntatore, l'ambra le celle e i registri diversi da zero.",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "La macchina parla un set di istruzioni in stile Brainfuck: + e − modificano la cella corrente (8 bit, con riavvolgimento modulo 256), > e < spostano il puntatore (che ricomincia da capo alla fine del nastro di 32 celle), e [ ] formano un ciclo che viene saltato o ripetuto a seconda che la cella corrente sia zero oppure no. Ogni altro carattere è un commento. Prima dell'esecuzione, la pagina costruisce una tabella dei salti con una pila in un'unica passata sul sorgente, così ogni parentesi trova la sua compagna in tempo costante. La macchina a registri è ancora più semplice: registri interi, righe numerate, una riga per passo. Una riga assegna, verifica, salta o si ferma, e prime(p) è un test incorporato per divisioni successive.",
          "Lo stato vive in React: un nastro Uint8Array, il puntatore, il contatore di programma, il numero di passi e uno stato di esecuzione. Ogni passo copia il nastro di 32 byte prima di modificarlo, perché in sviluppo React può chiamare due volte le funzioni di aggiornamento dello stato, e una modifica sul posto applicherebbe ogni + due volte. In esecuzione continua, un ciclo requestAnimationFrame accumula il tempo trascorso moltiplicato per la velocità scelta ed esegue quel numero di passi interi per fotogramma, al massimo 500, poi si ferma da solo non appena lo stato non è più «in esecuzione». Se il tuo sistema richiede movimento ridotto, «Avvia» salta la riproduzione: calcola direttamente fino al verdetto (fermato, o limite raggiunto) e mostra lo stato finale. «Passo» continua ad avanzare di un'istruzione alla volta.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Perché un limite più grande non aiuta",
        paragraphs: [
          "Per «Conta fino a 100» il verdetto rosa è solo impazienza: alza il limite e la risposta diventa definitiva. Ma per la ricerca di Goldbach nessun limite finito risolve qualcosa. Qui arriva a n = 220 entro 2000 passi e a n = 848 entro 10.000. I computer hanno controllato ogni numero pari fino a 4·10¹⁸ e ognuno è risultato somma di due primi, quindi una ricerca vera girerebbe almeno altrettanto a lungo prima di trovare un controesempio, e se la congettura di Goldbach è vera gira per sempre. Il teorema di Turing dice che questa non è una debolezza di questa pagina in particolare: qualunque analizzatore più astuto tu costruisca, qualche programma lo lascerà nella stessa posizione.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Cogli l'analizzatore a un passo dal traguardo",
        text: "Scegli «Conta fino a 100», imposta il limite di passi a 300 e premi «Avvia». Lo stato diventa rosa: dal punto di vista dell'analizzatore il programma potrebbe girare per sempre. Reimposta, porta il limite a 310 e avvia di nuovo. Ora si ferma al passo 301. Stesso programma, verdetto diverso, soltanto per via del budget.",
      },
      {
        title: "Lo stesso con Collatz",
        text: "Scegli «Collatz su 27» e imposta il limite a 440. Si arrende. A 450 il programma si ferma al passo 446 con k = 111. Lungo la strada il registro n sale fino a 9232 prima di ricadere a 1.",
      },
      {
        title: "Guarda una cella fare il giro",
        text: "Seleziona «Incrementa all'infinito», alza la velocità a 200 e il limite a 2000. La cella 1 sale fino a 255 e poi torna a 0, perché le celle contengono valori a 8 bit. Il ciclo in sé è sorvegliato dalla cella 0, che resta a 1, quindi il riavvolgimento non lascia mai uscire il programma.",
      },
      {
        title: "Dai a D entrambe le risposte",
        text: "Scegli «D autoreferenziale». Con h = 1 (il decisore sostiene che D si ferma) cicla finché scatta il limite. Imposta h a 0 (il decisore sostiene che D gira all'infinito) e si ferma al passo 3. Qualunque risposta tu fornisca, D la smentisce.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Corre pequenos programas numa máquina de brincar e vê o limite de passos decidir. O problema da paragem e a razão de ser indecidível, para experimentares.",
    heading: "Como funciona este explorador",
    intro:
      "À esquerda está um computador em miniatura. Dois dos seis programas correm numa máquina de fita (uma linguagem de seis símbolos, 32 células de memória e um ponteiro que as percorre), os outros quatro numa pequena máquina de registos com linhas numeradas. Carrega em «Executar» e ela executa uma instrução de cada vez até o programa terminar (âmbar: «parou no passo k») ou até o limite de passos disparar (rosa: ainda em execução, sem forma de saber se alguma vez pararia). Essa segunda resposta é a razão de ser desta sala.",
    sections: [
      {
        heading: "A pergunta a que nenhum programa consegue responder",
        paragraphs: [
          "O problema da paragem pede um único procedimento halts(P, x) que receba qualquer programa P e qualquer entrada x e responda sempre, em tempo finito, se P acaba por parar com x. Alan Turing provou em 1936 que tal procedimento não existe. A prova é um truque diagonal: supõe que halts existe e constrói um programa D que, dado um programa P, pergunta halts(P, P) e depois faz o contrário (entra em ciclo infinito se a resposta for sim, para se for não). Pergunta agora o que faz D consigo próprio. Se D(D) para, halts disse que sim, logo D entra em ciclo. Se D(D) entra em ciclo, halts disse que não, logo D para. Ambos os casos contradizem a definição, portanto a suposição estava errada.",
          "Indecidível não quer dizer que nenhum programa possa ser analisado. Quer dizer que todo o analisador, por mais engenhoso que seja, tem programas perante os quais tem de dar uma resposta errada ou nunca responder. O limite de passos é o analisador mais simples possível: corre o programa durante N passos e relata o que viste. Acerta sempre quando diz «parou», e nunca pode ter a certeza quando não diz nada.",
        ],
        formula: diagonalFormula("ciclo infinito", "parar", "se"),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "A lista de programas oferece seis entradas, e cada uma faz o que o nome diz. «Incrementar sem fim» (+[>+<]) põe a célula 0 a 1 e depois fica em ciclo sobre ela enquanto vai aumentando a célula 1, pelo que nunca para; «Contar até 100» coloca 100 na célula 0 e o ciclo [-] vai decrementando, parando ao fim de exatamente 301 passos (100 incrementos, uma verificação de entrada, depois dois passos por volta). Os outros quatro precisam de números maiores do que cabe numa célula de 8 bits e correm na máquina de registos. «Collatz de 27» itera n/2 ou 3n+1 e conta as rondas no registo k: para com k = 111 ao fim de 446 passos de máquina. «Collatz de uma entrada» é o mesmo programa com um valor inicial que tu escreves. «Busca de Goldbach» testa 4, 6, 8, … à vez e só pararia num número par que não fosse soma de dois primos. «D autorreferencial» é uma ilustração e di-lo: não é possível escrever um halts verdadeiro, por isso introduzes a resposta que um suposto decisor daria para halts(D, D), e D faz o contrário. A linha «O que sabemos» por baixo de cada programa diz o que a matemática sabe de facto.",
          "«Passo» executa uma instrução, «Executar» e «Pausa» comandam a execução contínua, e «Redefinir» limpa a máquina. O cursor do limite de passos vai de 10 a 10\u00a0000 em saltos de 10 e começa em 2000; o da velocidade vai de 1 a 200 passos por segundo e começa em 40. O ciano marca a próxima instrução e o ponteiro, o âmbar as células e os registos diferentes de zero.",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "A máquina fala um conjunto de instruções ao estilo do Brainfuck: + e − alteram a célula atual (8 bits, dando a volta em módulo 256), > e < movem o ponteiro (que dá a volta no fim da fita de 32 células), e [ ] formam um ciclo que é saltado ou repetido consoante a célula atual seja zero ou não. Qualquer outro carácter é um comentário. Antes de executar, a página constrói uma tabela de saltos com uma pilha numa única passagem pelo código-fonte, para que cada parêntese reto encontre o seu par em tempo constante. A máquina de registos é ainda mais simples: registos inteiros, linhas numeradas, uma linha por passo. Uma linha atribui, testa, salta ou para, e prime(p) é um teste incorporado por divisões sucessivas.",
          "O estado vive em React: uma fita Uint8Array, o ponteiro, o contador de programa, o número de passos e um estado de execução. Cada passo copia a fita de 32 bytes antes de a alterar, porque o React pode chamar duas vezes as funções de atualização de estado em desenvolvimento, e uma alteração no próprio lugar aplicaria cada + duas vezes. Em execução contínua, um ciclo de requestAnimationFrame acumula o tempo decorrido multiplicado pela velocidade escolhida e executa esse número de passos inteiros por fotograma, no máximo 500, e depois para sozinho assim que o estado deixa de ser «em execução». Se o teu sistema pedir movimento reduzido, «Executar» salta a reprodução: calcula de seguida até ao veredicto (parou, ou limite atingido) e mostra o estado final. «Passo» continua a avançar uma instrução de cada vez.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Porque é que um limite maior não ajuda",
        paragraphs: [
          "Para «Contar até 100», o veredicto rosa é só impaciência: sobe o limite e a resposta torna-se definitiva. Mas para a busca de Goldbach nenhum limite finito resolve coisa alguma. Aqui ela chega a n = 220 em 2000 passos e a n = 848 em 10\u00a0000. Os computadores verificaram todos os números pares até 4·10¹⁸ e cada um revelou-se soma de dois primos, pelo que uma busca a sério correria pelo menos esse tempo todo antes de encontrar um contraexemplo, e se Goldbach for verdadeira corre para sempre. O teorema de Turing diz que isto não é uma fraqueza desta página em particular: qualquer que seja o analisador mais esperto que construas, algum programa vai deixá-lo na mesma posição.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Apanha o analisador a um passo do fim",
        text: "Escolhe «Contar até 100», põe o limite de passos em 300 e carrega em «Executar». O estado fica rosa: do ponto de vista do analisador, o programa podia correr para sempre. Redefine, leva o limite para 310 e executa outra vez. Agora para no passo 301. O mesmo programa, outro veredicto, apenas por causa do orçamento.",
      },
      {
        title: "O mesmo com Collatz",
        text: "Escolhe «Collatz de 27» e põe o limite em 440. Desiste. Com 450, o programa para no passo 446 com k = 111. Pelo caminho, o registo n sobe até 9232 antes de voltar a cair para 1.",
      },
      {
        title: "Vê uma célula a dar a volta",
        text: "Seleciona «Incrementar sem fim», sobe a velocidade para 200 e o limite para 2000. A célula 1 sobe até 255 e depois volta a 0, porque as células guardam valores de 8 bits. O ciclo em si é guardado pela célula 0, que fica em 1, por isso a volta nunca deixa o programa escapar.",
      },
      {
        title: "Dá a D as duas respostas",
        text: "Escolhe «D autorreferencial». Com h = 1 (o decisor afirma que D para) fica em ciclo até o limite disparar. Põe h a 0 (o decisor afirma que D corre para sempre) e ele para no passo 3. Seja qual for a resposta que deres, D prova que está errada.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Kör små program på en leksaksmaskin och se steggränsen fälla domen: stannat eller okänt. En praktisk titt på varför stopproblemet är oavgörbart.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Till vänster finns en miniatyrdator. Två av de sex programmen körs på en bandmaskin (ett språk med sex symboler, 32 minnesceller och en pekare som vandrar längs dem), de andra fyra på en liten registermaskin med numrerade rader. Tryck på ”Kör” så utför den en instruktion i taget tills antingen programmet tar slut (bärnsten: ”stannade vid steg k”) eller steggränsen slår till (rosa: kör fortfarande, och det går inte att säga om det någonsin skulle stanna). Det andra svaret är hela poängen med rummet.",
    sections: [
      {
        heading: "Frågan som inget program kan besvara",
        paragraphs: [
          "Stopproblemet efterfrågar en enda procedur halts(P, x) som tar vilket program P och vilka indata x som helst och alltid svarar, på ändlig tid, om P till slut stannar på x. Alan Turing bevisade 1936 att någon sådan procedur inte finns. Beviset är ett diagonaltrick: anta att halts finns och bygg ett program D som, givet ett program P, frågar halts(P, P) och sedan gör tvärtom (loopar för evigt om svaret är ja, stannar om det är nej). Fråga nu vad D gör med sig självt. Om D(D) stannar sa halts ja, så D loopar. Om D(D) loopar sa halts nej, så D stannar. Båda fallen motsäger definitionen, så antagandet var fel.",
          "Oavgörbart betyder inte att inget program kan analyseras. Det betyder att varje analysator, hur smart den än är, har program där den antingen måste svara fel eller aldrig svara alls. Steggränsen är den enklaste tänkbara analysatorn: kör programmet i N steg och rapportera vad du såg. Den har alltid rätt när den säger ”stannade”, och den kan aldrig vara säker när den inte säger något.",
        ],
        formula: diagonalFormula("loopa för evigt", "stanna", "om"),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Programlistan har sex poster, och var och en gör vad namnet säger. ”Räkna upp för evigt” (+[>+<]) sätter cell 0 till 1 och loopar sedan på den medan cell 1 räknas upp, så det stannar aldrig. ”Räkna till 100” lägger 100 i cell 0 och loopen [-] räknar ner den, och programmet stannar efter exakt 301 steg (100 ökningar, en ingångskontroll, sedan två steg per varv). De andra fyra behöver större tal än en 8-bitarscell rymmer och körs på registermaskinen. ”Collatz på 27” itererar n/2 eller 3n+1 och räknar varven i register k: det stannar med k = 111 efter 446 maskinsteg. ”Collatz på indata” är samma program med ett startvärde som du skriver in. ”Goldbach-sökning” testar 4, 6, 8, … i tur och ordning och skulle bara stanna vid ett jämnt tal som inte är summan av två primtal. ”Självrefererande D” är en illustration och säger det också: något riktigt halts går inte att skriva, så du matar in svaret som en påstådd avgörare skulle ge på halts(D, D), och D gör tvärtom. Raden ”Vad vi vet” under varje program säger vad matematiken faktiskt vet.",
          "”Steg” utför en instruktion, ”Kör” och ”Paus” styr den kontinuerliga körningen och ”Återställ” nollställer maskinen. Reglaget för steggränsen går från 10 till 10\u00a0000 i steg om 10 och börjar på 2000. Hastighetsreglaget går från 1 till 200 steg per sekund och börjar på 40. Cyan markerar nästa instruktion och pekaren, bärnsten de celler och register som inte är noll.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Maskinen talar en instruktionsuppsättning i Brainfuck-stil: + och − ändrar den aktuella cellen (8 bitar, med omslag modulo 256), > och < flyttar pekaren (som slår runt vid slutet av bandet med 32 celler), och [ ] bildar en loop som hoppas över eller upprepas beroende på om den aktuella cellen är noll. Alla andra tecken är kommentarer. Före körningen bygger sidan en hopptabell med hjälp av en stack i ett enda svep över källkoden, så att varje hakparentes hittar sin partner på konstant tid. Registermaskinen är ännu enklare: heltalsregister, numrerade rader, en rad per steg. En rad tilldelar, testar, hoppar eller stannar, och prime(p) är ett inbyggt test med provdivision.",
          "Tillståndet ligger i React: ett band som Uint8Array, pekaren, programräknaren, antalet steg och en status. Varje steg kopierar bandets 32 byte innan det ändrar något, eftersom React kan anropa tillståndsuppdaterare två gånger i utvecklingsläge, och en ändring på plats skulle tillämpa varje + två gånger. I körläge samlar en requestAnimationFrame-loop ihop förfluten tid gånger vald hastighet och utför så många hela steg per bildruta, högst 500, och stoppar sig själv så snart statusen inte längre är ”kör”. Om ditt system ber om minskad rörelse hoppar ”Kör” över uppspelningen: sidan räknar rakt fram till domen (stannat eller gränsen nådd) och visar sluttillståndet. ”Steg” går fortfarande fram en instruktion i taget.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Varför en högre gräns inte hjälper",
        paragraphs: [
          "För ”Räkna till 100” är den rosa domen bara otålighet: höj gränsen så blir svaret definitivt. Men för Goldbach-sökningen avgör ingen ändlig gräns någonting. Här hinner den till n = 220 inom 2000 steg och till n = 848 inom 10\u00a0000. Datorer har kontrollerat varje jämnt tal upp till 4·10¹⁸ och funnit att vart och ett är summan av två primtal, så en riktig sökning skulle köra minst så länge innan den hittade ett motexempel, och om Goldbach stämmer kör den för evigt. Turings sats säger att det här inte är en svaghet hos just den här sidan: vilken smartare analysator du än bygger kommer något program att försätta den i samma läge.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Ta analysatorn på bar gärning ett steg för tidigt",
        text: "Välj ”Räkna till 100”, sätt steggränsen till 300 och tryck på ”Kör”. Statusen blir rosa: ur analysatorns synvinkel skulle programmet kunna köra för evigt. Återställ, flytta gränsen till 310 och kör igen. Nu stannar det vid steg 301. Samma program, annan dom, enbart på grund av budgeten.",
      },
      {
        title: "Samma sak med Collatz",
        text: "Välj ”Collatz på 27” och sätt gränsen till 440. Den ger upp. Vid 450 stannar programmet vid steg 446 med k = 111. På vägen klättrar register n ända upp till 9232 innan det faller tillbaka till 1.",
      },
      {
        title: "Se en cell slå runt",
        text: "Välj ”Räkna upp för evigt”, höj hastigheten till 200 och gränsen till 2000. Cell 1 klättrar till 255 och slår sedan om till 0, eftersom cellerna rymmer 8-bitarsvärden. Själva loopen vaktas av cell 0, som ligger kvar på 1, så omslaget låter aldrig programmet slippa ut.",
      },
      {
        title: "Ge D båda svaren",
        text: "Välj ”Självrefererande D”. Med h = 1 (avgöraren påstår att D stannar) loopar det tills gränsen slår till. Sätt h till 0 (avgöraren påstår att D kör för evigt) så stannar det vid steg 3. Vilket svar du än ger motbevisar D det.",
      },
    ],
  },
  no: {
    metaDescription:
      "Kjør små programmer på en lekemaskin og se steggrensen felle dommen: stoppet eller ukjent. En praktisk titt på hvorfor stoppeproblemet er uavgjørbart.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Til venstre står en miniatyrdatamaskin. To av de seks programmene kjører på en båndmaskin (et språk med seks symboler, 32 minneceller og en peker som vandrer langs dem), de fire andre på en liten registermaskin med nummererte linjer. Trykk på «Kjør», så utfører den én instruksjon om gangen til enten programmet er ferdig (rav: «stoppet ved steg k») eller steggrensen slår inn (rosa: kjører fortsatt, og det er umulig å si om det noen gang ville stoppet). Det andre svaret er hele poenget med rommet.",
    sections: [
      {
        heading: "Spørsmålet ingen programmer kan svare på",
        paragraphs: [
          "Stoppeproblemet ber om én enkelt prosedyre halts(P, x) som tar et hvilket som helst program P og vilkårlige inndata x, og som alltid svarer, på endelig tid, om P til slutt stopper på x. Alan Turing beviste i 1936 at en slik prosedyre ikke finnes. Beviset er et diagonaltriks: Anta at halts finnes, og bygg et program D som, gitt et program P, spør halts(P, P) og så gjør det motsatte (går i evig løkke hvis svaret er ja, stopper hvis det er nei). Spør nå hva D gjør med seg selv. Hvis D(D) stopper, sa halts ja, så D går i løkke. Hvis D(D) går i løkke, sa halts nei, så D stopper. Begge tilfellene motsier definisjonen, så antakelsen var feil.",
          "Uavgjørbart betyr ikke at ingen programmer kan analyseres. Det betyr at enhver analysator, uansett hvor smart, har programmer der den enten må svare feil eller aldri svare i det hele tatt. Steggrensen er den enkleste analysatoren man kan tenke seg: Kjør programmet i N steg og rapporter hva du så. Den har alltid rett når den sier «stoppet», og den kan aldri være sikker når den ikke sier noe.",
        ],
        formula: diagonalFormula("evig løkke", "stopp", "hvis"),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Programlisten har seks oppføringer, og hver av dem gjør det navnet sier. «Tell opp for alltid» (+[>+<]) setter celle 0 til 1 og går så i løkke på den mens celle 1 telles opp, så det stopper aldri. «Tell til 100» legger 100 i celle 0, og løkken [-] teller den ned, slik at programmet stopper etter nøyaktig 301 steg (100 økninger, én inngangssjekk, deretter to steg per runde). De fire andre trenger større tall enn en 8-biters celle rommer, og kjører på registermaskinen. «Collatz på 27» itererer n/2 eller 3n+1 og teller rundene i register k: Det stopper med k = 111 etter 446 maskinsteg. «Collatz på inndata» er det samme programmet med en startverdi du skriver inn. «Goldbach-søk» tester 4, 6, 8, … etter tur og ville bare stoppet ved et partall som ikke er summen av to primtall. «Selvrefererende D» er en illustrasjon og sier det selv: Et ekte halts lar seg ikke skrive, så du taster inn svaret en påstått avgjører ville gitt på halts(D, D), og D gjør det motsatte. Linjen «Hva vi vet» under hvert program sier hva matematikken faktisk vet.",
          "«Steg» utfører én instruksjon, «Kjør» og «Pause» styrer den kontinuerlige kjøringen, og «Tilbakestill» nullstiller maskinen. Glidebryteren for steggrensen går fra 10 til 10\u00a0000 i steg på 10 og starter på 2000. Glidebryteren for hastighet går fra 1 til 200 steg per sekund og starter på 40. Cyan markerer neste instruksjon og pekeren, rav de cellene og registrene som ikke er null.",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "Maskinen snakker et instruksjonssett i Brainfuck-stil: + og − endrer den gjeldende cellen (8 biter, med omslag modulo 256), > og < flytter pekeren (som går rundt ved enden av båndet på 32 celler), og [ ] danner en løkke som hoppes over eller gjentas avhengig av om den gjeldende cellen er null. Alle andre tegn er kommentarer. Før kjøringen bygger siden en hopptabell ved hjelp av en stakk i ett enkelt gjennomløp av kildekoden, slik at hver hakeparentes finner partneren sin på konstant tid. Registermaskinen er enda enklere: heltallsregistre, nummererte linjer, én linje per steg. En linje tilordner, tester, hopper eller stopper, og prime(p) er en innebygd test med prøvedivisjon.",
          "Tilstanden ligger i React: et bånd som Uint8Array, pekeren, programtelleren, antall steg og en status. Hvert steg kopierer båndets 32 byte før det endrer noe, fordi React kan kalle tilstandsoppdaterere to ganger under utvikling, og en endring på stedet ville brukt hver + to ganger. I kjøremodus samler en requestAnimationFrame-løkke opp medgått tid ganger valgt hastighet og utfører så mange hele steg per bilde, høyst 500, og stanser seg selv så snart statusen ikke lenger er «kjører». Hvis systemet ditt ber om redusert bevegelse, hopper «Kjør» over avspillingen: Siden regner rett fram til dommen (stoppet eller grensen nådd) og viser sluttilstanden. «Steg» går fortsatt fram én instruksjon om gangen.",
        ],
        code: STEP_EXCERPT,
      },
      {
        heading: "Hvorfor en høyere grense ikke hjelper",
        paragraphs: [
          "For «Tell til 100» er den rosa dommen bare utålmodighet: Øk grensen, så blir svaret endelig. Men for Goldbach-søket avgjør ingen endelig grense noe som helst. Her kommer det til n = 220 innen 2000 steg og til n = 848 innen 10\u00a0000. Datamaskiner har sjekket hvert partall opp til 4·10¹⁸ og funnet at hvert av dem er summen av to primtall, så et ekte søk ville kjørt minst så lenge før det fant et moteksempel, og hvis Goldbach stemmer, kjører det for alltid. Turings teorem sier at dette ikke er en svakhet ved akkurat denne siden: Uansett hvilken smartere analysator du bygger, vil et eller annet program sette den i samme stilling.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Ta analysatoren ett steg for tidlig",
        text: "Velg «Tell til 100», sett steggrensen til 300 og trykk på «Kjør». Statusen blir rosa: Fra analysatorens synspunkt kunne programmet kjørt for alltid. Tilbakestill, flytt grensen til 310 og kjør på nytt. Nå stopper det ved steg 301. Samme program, en annen dom, utelukkende på grunn av budsjettet.",
      },
      {
        title: "Det samme med Collatz",
        text: "Velg «Collatz på 27» og sett grensen til 440. Den gir opp. Ved 450 stopper programmet ved steg 446 med k = 111. Underveis klatrer register n helt opp til 9232 før det faller tilbake til 1.",
      },
      {
        title: "Se en celle gå rundt",
        text: "Velg «Tell opp for alltid», øk hastigheten til 200 og grensen til 2000. Celle 1 klatrer til 255 og slår så om til 0, fordi cellene rommer 8-biters verdier. Selve løkken voktes av celle 0, som blir stående på 1, så omslaget slipper aldri programmet ut.",
      },
      {
        title: "Gi D begge svarene",
        text: "Velg «Selvrefererende D». Med h = 1 (avgjøreren påstår at D stopper) går det i løkke til grensen slår inn. Sett h til 0 (avgjøreren påstår at D kjører for alltid), så stopper det ved steg 3. Uansett hvilket svar du gir, motbeviser D det.",
      },
    ],
  },
};
