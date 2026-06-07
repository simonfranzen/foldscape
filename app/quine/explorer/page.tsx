"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Quine Explorer — show two canonical quines (Python + Lisp), simulate
// their execution in plain JS, let the visitor mutate the data table and
// watch the self-equality property break.
// --------------------------------------------------------------------------

// We do NOT spawn a Python or Lisp interpreter. Instead, we re-implement the
// same templating logic the quine relies on, in plain TypeScript — exactly
// what an interpreter would compute. The result is the literal text the
// program would print on a real machine. That keeps the demo self-contained
// and side-effect-free.

/**
 * Simulate the Python quine:
 *   s = '<DATA>'
 *   print(s % s)
 *
 * where <DATA> contains exactly one `%r` placeholder. Python's `%r`
 * formatting wraps a string in single quotes and escapes embedded
 * single quotes and backslashes — mirrored faithfully below.
 */
function pythonRepr(s: string): string {
  // CPython uses single quotes by default unless the string contains '
  // and not ", in which case it switches to ". For the canonical data
  // table here we always have an unescaped " — so CPython uses single
  // quotes and escapes any embedded '. We emulate that.
  const needsDouble = s.includes("'") && !s.includes('"');
  const quote = needsDouble ? '"' : "'";
  const escaped = s
    .replace(/\\/g, "\\\\")
    .replace(new RegExp(quote, "g"), "\\" + quote)
    .replace(/\n/g, "\\n");
  return quote + escaped + quote;
}

function simulatePython(data: string): string {
  // The data table itself uses %r ONCE. Format and concatenate as the
  // real `s = '<DATA>'\nprint(s % s)` would.
  const formatted = data.replace("%r", pythonRepr(data));
  return formatted;
}

/**
 * Lisp quine:
 *   ((lambda (x) (list x (list 'quote x))) '(lambda (x) (list x (list 'quote x))))
 *
 * The outer apply substitutes x with the quoted list, producing a printable
 * S-expression that is equal to the original.  We model only the printed
 * form — exact text reproduction is all we need to demonstrate self-equality.
 */
function simulateLisp(body: string): string {
  // `body` is the inner s-expression following the LAMBDA — e.g.
  //   (lambda (x) (list x (list 'quote x)))
  // The quine is `(LAMBDA BODY)` applied to `'BODY` and prints
  //   (BODY (quote BODY))
  return `(${body} (quote ${body}))`;
}

// Canonical quines, used as the initial values.
const PY_DATA_DEFAULT = "s = %r\nprint(s %% s)";
const LISP_BODY_DEFAULT = "(lambda (x) (list x (list 'quote x)))";

/**
 * Re-assemble a Python program from its data table — what the user sees on
 * the left ("the source") for any given data string.
 */
function pythonSourceFor(data: string): string {
  return `s = ${pythonRepr(data)}\nprint(s % s)`;
}

function lispSourceFor(body: string): string {
  return `(${body} '${body})`;
}

// --------------------------------------------------------------------------
// Per-locale UI strings.
// --------------------------------------------------------------------------

type RichExplorer = {
  badge: string;
  pythonLabel: string;
  lispLabel: string;
  sourceLabel: string;
  outputLabel: string;
  dataLabel: string;
  dataHint: string;
  bodyLabel: string;
  bodyHint: string;
  runLabel: string;
  resetLabel: string;
  selfEqualBadge: string;
  divergedBadge: string;
  notesLabel: string;
  notesP1: string;
  notesP2: string;
  notesP3: string;
  fixedPointLabel: string;
  fixedPointHint: string;
  backToStory: string;
  topicTitle: string;
  topicTagline: string;
  topicBody: string;
};

const en: RichExplorer = {
  badge: "Quine builder · p ↦ print(p)",
  pythonLabel: "Python · two-line quine",
  lispLabel: "Lisp · classic combinator quine",
  sourceLabel: "source",
  outputLabel: "output",
  dataLabel: "Edit the data table",
  dataHint:
    "The single string the program quotes back to itself. Keep the %r placeholder — change anything around it and the self-equality property collapses.",
  bodyLabel: "Edit the lambda body",
  bodyHint:
    "The body of the inner lambda. The quine substitutes itself in twice; change a word and the two copies will no longer match.",
  runLabel: "Run",
  resetLabel: "↺ reset to canonical",
  selfEqualBadge: "source = output · self-equal",
  divergedBadge: "source ≠ output · diverged",
  notesLabel: "What just happened",
  notesP1:
    "Each program splits into two parts: a string-literal data table and a tiny printer. The printer renders the data twice — once as a quoted string (rebuilding the data) and once as raw code (rebuilding the printer). When the data contains the printer's exact source as a description, the two rebuilds line up and the program prints itself.",
  notesP2:
    "We simulate execution in JS without invoking a real interpreter — pure string substitution, faithful to what CPython's %r operator and Lisp's list quoting would produce. The self-equality check then just compares two strings.",
  notesP3:
    "Mutate even one character of the data table and the printer keeps doing its job, but what it now prints is no longer equal to the program text. The fixed point is delicate; that is the whole point of Kleene's theorem.",
  fixedPointLabel: "Kleene's fixed point",
  fixedPointHint:
    "Every computable program-to-program transformation has a fixed point. The canonical quine on the left is that fixed point for the function 'wrap this string into a self-printing program'.",
  backToStory: "← Back to the story",
  topicTitle: "Topic · Computation",
  topicTagline: "Programs that print themselves",
  topicBody:
    "A quine is a program whose output is exactly its source. It exists in any language expressive enough to talk about its own programs — and it is the same self-reference engine that underlies Gödel's incompleteness proof, Turing's halting argument, and biological self-replication.",
};

const de: RichExplorer = {
  badge: "Quine-Baukasten · p ↦ print(p)",
  pythonLabel: "Python · zweizeilige Quine",
  lispLabel: "Lisp · klassische Kombinator-Quine",
  sourceLabel: "Quelltext",
  outputLabel: "Ausgabe",
  dataLabel: "Datentabelle bearbeiten",
  dataHint:
    "Der einzige String, den das Programm sich selbst zitiert zurückgibt. Lass den %r-Platzhalter stehen — alles andere ändern und die Selbstgleichheit bricht zusammen.",
  bodyLabel: "Lambda-Rumpf bearbeiten",
  bodyHint:
    "Der Rumpf des inneren Lambdas. Die Quine setzt sich zweimal ein; ein Wort ändern und die beiden Kopien stimmen nicht mehr überein.",
  runLabel: "Ausführen",
  resetLabel: "↺ auf Kanon zurücksetzen",
  selfEqualBadge: "Quelltext = Ausgabe · selbstgleich",
  divergedBadge: "Quelltext ≠ Ausgabe · divergiert",
  notesLabel: "Was gerade passiert ist",
  notesP1:
    "Jedes Programm teilt sich in zwei Teile: eine String-Literal-Datentabelle und einen winzigen Drucker. Der Drucker rendert die Daten zweimal — einmal als geklammerten String (Daten wieder aufbauen) und einmal als rohen Code (Drucker wieder aufbauen). Enthält der Datenstring die genaue Quelle des Druckers als Beschreibung, decken sich die beiden Aufbauten und das Programm druckt sich selbst.",
  notesP2:
    "Wir simulieren die Ausführung in JS, ohne einen echten Interpreter zu starten — reine String-Substitution, originalgetreu zu dem, was CPythons %r-Operator und Lisps List-Quoting produzieren würden. Die Selbstgleichheitsprüfung vergleicht dann nur zwei Strings.",
  notesP3:
    "Ändere auch nur ein Zeichen der Datentabelle, und der Drucker macht weiter seinen Job — aber was er nun druckt, ist nicht mehr gleich dem Programmtext. Der Fixpunkt ist heikel; genau darum geht es in Kleenes Satz.",
  fixedPointLabel: "Kleenes Fixpunkt",
  fixedPointHint:
    "Jede berechenbare Programm-zu-Programm-Transformation hat einen Fixpunkt. Die kanonische Quine links ist dieser Fixpunkt für die Funktion „verpacke diesen String in ein selbstdruckendes Programm«.",
  backToStory: "← Zurück zur Geschichte",
  topicTitle: "Thema · Berechnung",
  topicTagline: "Programme, die sich selbst drucken",
  topicBody:
    "Eine Quine ist ein Programm, dessen Ausgabe exakt sein Quelltext ist. Sie existiert in jeder Sprache, die ausdrucksstark genug ist, über eigene Programme zu reden — und sie ist derselbe Selbstreferenz-Motor, der Gödels Unvollständigkeitsbeweis, Turings Halteargument und der biologischen Selbstreplikation zugrunde liegt.",
};

const es: RichExplorer = {
  badge: "Constructor de quines · p ↦ print(p)",
  pythonLabel: "Python · quine en dos líneas",
  lispLabel: "Lisp · quine combinador clásico",
  sourceLabel: "código",
  outputLabel: "salida",
  dataLabel: "Edita la tabla de datos",
  dataHint:
    "La única cadena que el programa cita de vuelta a sí mismo. Mantén el marcador %r — cambia cualquier cosa a su alrededor y la propiedad de autoigualdad se desploma.",
  bodyLabel: "Edita el cuerpo del lambda",
  bodyHint:
    "El cuerpo del lambda interno. La quine se sustituye dos veces; cambia una palabra y las dos copias dejarán de coincidir.",
  runLabel: "Ejecutar",
  resetLabel: "↺ volver al canónico",
  selfEqualBadge: "código = salida · autoigual",
  divergedBadge: "código ≠ salida · divergente",
  notesLabel: "Qué acaba de pasar",
  notesP1:
    "Cada programa se divide en dos partes: una tabla de datos literal de cadena y una impresora minúscula. La impresora renderiza los datos dos veces — una como cadena entre comillas (reconstruyendo los datos) y otra como código crudo (reconstruyendo la impresora). Cuando los datos contienen la descripción exacta del código de la impresora, las dos reconstrucciones encajan y el programa se imprime a sí mismo.",
  notesP2:
    "Simulamos la ejecución en JS sin invocar un intérprete real — pura sustitución de cadenas, fiel a lo que producirían el operador %r de CPython y el quoting de listas de Lisp. La comprobación de autoigualdad se reduce a comparar dos cadenas.",
  notesP3:
    "Cambia un solo carácter de la tabla de datos y la impresora sigue haciendo su trabajo, pero lo que ahora imprime ya no es igual al texto del programa. El punto fijo es delicado; ese es exactamente el sentido del teorema de Kleene.",
  fixedPointLabel: "Punto fijo de Kleene",
  fixedPointHint:
    "Toda transformación computable de programa-a-programa tiene un punto fijo. La quine canónica de la izquierda es ese punto fijo para la función «envuelve esta cadena en un programa que se imprime a sí mismo».",
  backToStory: "← Volver a la historia",
  topicTitle: "Tema · Computación",
  topicTagline: "Programas que se imprimen a sí mismos",
  topicBody:
    "Una quine es un programa cuya salida es exactamente su código fuente. Existe en cualquier lenguaje suficientemente expresivo para hablar de sus propios programas — y es el mismo motor de autorreferencia que subyace a la prueba de incompletitud de Gödel, al argumento de parada de Turing y a la autorreplicación biológica.",
};

const fr: RichExplorer = {
  badge: "Constructeur de quines · p ↦ print(p)",
  pythonLabel: "Python · quine en deux lignes",
  lispLabel: "Lisp · quine combinatoire classique",
  sourceLabel: "code",
  outputLabel: "sortie",
  dataLabel: "Édite la table de données",
  dataHint:
    "L'unique chaîne que le programme se recite à lui-même. Garde le marqueur %r — change quoi que ce soit autour et la propriété d'autoégalité s'écroule.",
  bodyLabel: "Édite le corps du lambda",
  bodyHint:
    "Le corps du lambda interne. La quine se substitue deux fois ; change un mot et les deux copies ne correspondront plus.",
  runLabel: "Exécuter",
  resetLabel: "↺ revenir au canonique",
  selfEqualBadge: "code = sortie · autoégal",
  divergedBadge: "code ≠ sortie · divergent",
  notesLabel: "Ce qui vient de se passer",
  notesP1:
    "Chaque programme se divise en deux parties : une table de données littérale de chaîne et une imprimante minuscule. L'imprimante rend les données deux fois — une fois comme chaîne entre guillemets (reconstruisant les données) et une fois comme code brut (reconstruisant l'imprimante). Quand les données contiennent la description exacte du code de l'imprimante, les deux reconstructions coïncident et le programme s'imprime lui-même.",
  notesP2:
    "Nous simulons l'exécution en JS sans invoquer un véritable interpréteur — pure substitution de chaînes, fidèle à ce que produiraient l'opérateur %r de CPython et le quoting de listes de Lisp. Le test d'autoégalité se réduit alors à comparer deux chaînes.",
  notesP3:
    "Modifie ne serait-ce qu'un caractère de la table de données et l'imprimante continue son travail, mais ce qu'elle imprime n'est plus égal au texte du programme. Le point fixe est délicat ; c'est tout l'intérêt du théorème de Kleene.",
  fixedPointLabel: "Point fixe de Kleene",
  fixedPointHint:
    "Toute transformation calculable de programme à programme admet un point fixe. La quine canonique à gauche est ce point fixe pour la fonction « emballe cette chaîne dans un programme qui s'imprime lui-même ».",
  backToStory: "← Retour à l'histoire",
  topicTitle: "Sujet · Calcul",
  topicTagline: "Programmes qui s'impriment eux-mêmes",
  topicBody:
    "Une quine est un programme dont la sortie est exactement son code source. Elle existe dans tout langage suffisamment expressif pour parler de ses propres programmes — et elle est le même moteur d'autoréférence qui sous-tend la preuve d'incomplétude de Gödel, l'argument de l'arrêt de Turing et l'autoréplication biologique.",
};

const it: RichExplorer = {
  badge: "Costruttore di quine · p ↦ print(p)",
  pythonLabel: "Python · quine in due righe",
  lispLabel: "Lisp · quine combinatoria classica",
  sourceLabel: "codice",
  outputLabel: "output",
  dataLabel: "Modifica la tabella dei dati",
  dataHint:
    "L'unica stringa che il programma cita di ritorno a sé stesso. Mantieni il segnaposto %r — cambia qualcosa intorno e la proprietà di autougualianza crolla.",
  bodyLabel: "Modifica il corpo del lambda",
  bodyHint:
    "Il corpo del lambda interno. La quine si sostituisce due volte; cambia una parola e le due copie non coincideranno più.",
  runLabel: "Esegui",
  resetLabel: "↺ torna al canonico",
  selfEqualBadge: "codice = output · autouguali",
  divergedBadge: "codice ≠ output · divergente",
  notesLabel: "Cosa è appena successo",
  notesP1:
    "Ogni programma si divide in due parti: una tabella di dati literal di stringa e una stampante minuscola. La stampante renderizza i dati due volte — una come stringa fra virgolette (ricostruendo i dati) e una come codice grezzo (ricostruendo la stampante). Quando i dati contengono la descrizione esatta del codice della stampante, le due ricostruzioni combaciano e il programma stampa sé stesso.",
  notesP2:
    "Simuliamo l'esecuzione in JS senza invocare un vero interprete — pura sostituzione di stringhe, fedele a ciò che produrrebbero l'operatore %r di CPython e il quoting di liste di Lisp. Il controllo di autougualianza si riduce a confrontare due stringhe.",
  notesP3:
    "Modifica anche un solo carattere della tabella dati e la stampante continua il suo lavoro, ma ciò che ora stampa non è più uguale al testo del programma. Il punto fisso è delicato; è proprio questo il senso del teorema di Kleene.",
  fixedPointLabel: "Punto fisso di Kleene",
  fixedPointHint:
    "Ogni trasformazione calcolabile da programma a programma ammette un punto fisso. La quine canonica a sinistra è quel punto fisso per la funzione «avvolgi questa stringa in un programma che stampa sé stesso».",
  backToStory: "← Torna alla storia",
  topicTitle: "Tema · Calcolo",
  topicTagline: "Programmi che stampano sé stessi",
  topicBody:
    "Una quine è un programma il cui output è esattamente il proprio codice sorgente. Esiste in ogni linguaggio sufficientemente espressivo per parlare dei propri programmi — ed è lo stesso motore di autoreferenza che sta alla base della prova di incompletezza di Gödel, dell'argomento dell'arresto di Turing e dell'autoreplicazione biologica.",
};

const pt: RichExplorer = {
  badge: "Construtor de quines · p ↦ print(p)",
  pythonLabel: "Python · quine em duas linhas",
  lispLabel: "Lisp · quine combinatória clássica",
  sourceLabel: "código",
  outputLabel: "saída",
  dataLabel: "Edita a tabela de dados",
  dataHint:
    "A única string que o programa cita de volta a si próprio. Mantém o marcador %r — muda qualquer coisa à volta e a propriedade de autoigualdade colapsa.",
  bodyLabel: "Edita o corpo do lambda",
  bodyHint:
    "O corpo do lambda interno. A quine substitui-se duas vezes; muda uma palavra e as duas cópias deixarão de coincidir.",
  runLabel: "Executar",
  resetLabel: "↺ voltar ao canónico",
  selfEqualBadge: "código = saída · autoigual",
  divergedBadge: "código ≠ saída · divergente",
  notesLabel: "O que acaba de acontecer",
  notesP1:
    "Cada programa divide-se em duas partes: uma tabela de dados literal de string e uma impressora minúscula. A impressora renderiza os dados duas vezes — uma como string entre aspas (reconstruindo os dados) e outra como código cru (reconstruindo a impressora). Quando os dados contêm a descrição exata do código da impressora, as duas reconstruções coincidem e o programa imprime-se a si próprio.",
  notesP2:
    "Simulamos a execução em JS sem invocar um interpretador real — pura substituição de strings, fiel ao que o operador %r do CPython e o quoting de listas do Lisp produziriam. A verificação de autoigualdade reduz-se a comparar duas strings.",
  notesP3:
    "Muda apenas um carácter da tabela de dados e a impressora continua o seu trabalho, mas o que agora imprime já não é igual ao texto do programa. O ponto fixo é delicado; é exatamente esse o sentido do teorema de Kleene.",
  fixedPointLabel: "Ponto fixo de Kleene",
  fixedPointHint:
    "Toda a transformação computável de programa-para-programa admite um ponto fixo. A quine canónica à esquerda é esse ponto fixo para a função «embrulha esta string num programa que se imprime a si próprio».",
  backToStory: "← Voltar à história",
  topicTitle: "Tema · Computação",
  topicTagline: "Programas que se imprimem a si próprios",
  topicBody:
    "Uma quine é um programa cuja saída é exatamente o seu código-fonte. Existe em qualquer linguagem suficientemente expressiva para falar dos seus próprios programas — e é o mesmo motor de autorreferência que está na base da prova de incompletude de Gödel, do argumento da paragem de Turing e da autorreplicação biológica.",
};

const sv: RichExplorer = {
  badge: "Quine-byggare · p ↦ print(p)",
  pythonLabel: "Python · tvåradig quine",
  lispLabel: "Lisp · klassisk kombinator-quine",
  sourceLabel: "källkod",
  outputLabel: "utdata",
  dataLabel: "Redigera datatabellen",
  dataHint:
    "Den enda strängen som programmet citerar tillbaka till sig självt. Behåll %r-platshållaren — ändra något runt omkring och självlikhets-egenskapen kollapsar.",
  bodyLabel: "Redigera lambdans kropp",
  bodyHint:
    "Kroppen av den inre lambdan. Quinen substitueras två gånger; ändra ett ord och de två kopiorna matchar inte längre.",
  runLabel: "Kör",
  resetLabel: "↺ återställ till kanonisk",
  selfEqualBadge: "källkod = utdata · självlika",
  divergedBadge: "källkod ≠ utdata · divergerar",
  notesLabel: "Vad som just hände",
  notesP1:
    "Varje program delas i två delar: en sträng-literal datatabell och en pytteliten skrivare. Skrivaren renderar data två gånger — en gång som citerad sträng (återskapar data) och en gång som rå kod (återskapar skrivaren). När data innehåller skrivarens exakta källkod som beskrivning sammanfaller de två återskapningarna och programmet skriver ut sig självt.",
  notesP2:
    "Vi simulerar exekvering i JS utan att starta en riktig tolk — ren strängsubstitution, troget vad CPythons %r-operator och Lisps listcitering skulle producera. Självlikhetstestet reduceras till att jämföra två strängar.",
  notesP3:
    "Ändra ens ett tecken i datatabellen och skrivaren fortsätter göra sitt jobb, men det den nu skriver ut är inte längre lika med programtexten. Fixpunkten är ömtålig; det är hela poängen med Kleenes sats.",
  fixedPointLabel: "Kleenes fixpunkt",
  fixedPointHint:
    "Varje beräkningsbar program-till-program-transformation har en fixpunkt. Den kanoniska quinen till vänster är den fixpunkten för funktionen «slå in den här strängen i ett program som skriver ut sig självt».",
  backToStory: "← Tillbaka till berättelsen",
  topicTitle: "Ämne · Beräkning",
  topicTagline: "Program som skriver ut sig själva",
  topicBody:
    "En quine är ett program vars utdata är exakt dess källkod. Den finns i varje språk som är tillräckligt uttrycksfullt för att prata om sina egna program — och den är samma självreferensmotor som ligger bakom Gödels ofullständighetsbevis, Turings stoppargument och biologisk självreplikering.",
};

const no: RichExplorer = {
  badge: "Quine-bygger · p ↦ print(p)",
  pythonLabel: "Python · tolinjes quine",
  lispLabel: "Lisp · klassisk kombinator-quine",
  sourceLabel: "kildekode",
  outputLabel: "utdata",
  dataLabel: "Rediger datatabellen",
  dataHint:
    "Den eneste strengen programmet siterer tilbake til seg selv. Behold %r-plassholderen — endre noe rundt og selvlikhetsegenskapen kollapser.",
  bodyLabel: "Rediger lambda-kroppen",
  bodyHint:
    "Kroppen til den indre lambdaen. Quinen substitueres to ganger; endre ett ord og de to kopiene matcher ikke lenger.",
  runLabel: "Kjør",
  resetLabel: "↺ tilbakestill til kanonisk",
  selfEqualBadge: "kildekode = utdata · selvlik",
  divergedBadge: "kildekode ≠ utdata · divergerer",
  notesLabel: "Hva som nettopp skjedde",
  notesP1:
    "Hvert program deles i to deler: en streng-literal datatabell og en bitteliten skriver. Skriveren rendrer dataene to ganger — én gang som sitert streng (gjenskaper data) og én gang som rå kode (gjenskaper skriveren). Når dataene inneholder skriverens nøyaktige kildekode som beskrivelse, sammenfaller de to gjenskapningene og programmet skriver seg selv ut.",
  notesP2:
    "Vi simulerer kjøring i JS uten å starte en ekte tolk — ren strengsubstitusjon, trofast mot hva CPythons %r-operator og Lisps listsitering ville produsere. Selvlikhetstesten reduseres til å sammenligne to strenger.",
  notesP3:
    "Endre bare ett tegn i datatabellen og skriveren fortsetter jobben sin, men det den nå skriver ut er ikke lenger likt programteksten. Fikspunktet er skjørt; det er hele poenget med Kleenes setning.",
  fixedPointLabel: "Kleenes fikspunkt",
  fixedPointHint:
    "Hver beregnbar program-til-program-transformasjon har et fikspunkt. Den kanoniske quinen til venstre er dette fikspunktet for funksjonen «pakk denne strengen inn i et program som skriver seg selv ut».",
  backToStory: "← Tilbake til historien",
  topicTitle: "Tema · Beregning",
  topicTagline: "Programmer som skriver seg selv ut",
  topicBody:
    "En quine er et program hvis utdata er nøyaktig dets kildekode. Den finnes i ethvert språk som er uttrykksfullt nok til å snakke om sine egne programmer — og den er den samme selvreferansemotoren som ligger bak Gödels ufullstendighetsbevis, Turings stoppargument og biologisk selvreplikering.",
};

const EXPLORER: Record<Locale, RichExplorer> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function QuineExplorer() {
  const { locale } = useI18n();
  const x = EXPLORER[locale];

  const [pyData, setPyData] = useState(PY_DATA_DEFAULT);
  const [lispBody, setLispBody] = useState(LISP_BODY_DEFAULT);

  // Recompute on every keystroke — both halves are pure functions of state.
  const pySource = useMemo(() => pythonSourceFor(pyData), [pyData]);
  const pyOutput = useMemo(() => simulatePython(pyData), [pyData]);
  const pySelfEqual = pySource === pyOutput;

  const lispSource = useMemo(() => lispSourceFor(lispBody), [lispBody]);
  const lispOutput = useMemo(() => simulateLisp(lispBody), [lispBody]);
  const lispSelfEqual = lispSource === lispOutput;

  return (
    <main className="relative isolate min-h-screen bg-ink-950 px-6 pb-24 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-signal-cyan/10 via-transparent to-ink-950" />

      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {x.topicTitle}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100 md:text-4xl">
              {x.topicTagline}
            </h1>
          </div>
          <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {x.badge}
          </div>
        </header>

        <p className="max-w-3xl text-sm leading-relaxed text-ink-200">{x.topicBody}</p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <QuinePanel
            title={x.pythonLabel}
            source={pySource}
            output={pyOutput}
            selfEqual={pySelfEqual}
            sourceLabel={x.sourceLabel}
            outputLabel={x.outputLabel}
            selfEqualBadge={x.selfEqualBadge}
            divergedBadge={x.divergedBadge}
            editorLabel={x.dataLabel}
            editorHint={x.dataHint}
            editorValue={pyData}
            onEditorChange={setPyData}
            onReset={() => setPyData(PY_DATA_DEFAULT)}
            resetLabel={x.resetLabel}
            runLabel={x.runLabel}
          />
          <QuinePanel
            title={x.lispLabel}
            source={lispSource}
            output={lispOutput}
            selfEqual={lispSelfEqual}
            sourceLabel={x.sourceLabel}
            outputLabel={x.outputLabel}
            selfEqualBadge={x.selfEqualBadge}
            divergedBadge={x.divergedBadge}
            editorLabel={x.bodyLabel}
            editorHint={x.bodyHint}
            editorValue={lispBody}
            onEditorChange={setLispBody}
            onReset={() => setLispBody(LISP_BODY_DEFAULT)}
            resetLabel={x.resetLabel}
            runLabel={x.runLabel}
          />
        </div>

        <section className="glass hairline space-y-4 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
            {x.notesLabel}
          </div>
          <p className="text-sm leading-relaxed text-ink-200">{x.notesP1}</p>
          <p className="text-sm leading-relaxed text-ink-200">{x.notesP2}</p>
          <p className="text-sm leading-relaxed text-ink-200">{x.notesP3}</p>
        </section>

        <section className="hairline rounded-2xl border bg-ink-950/40 p-6 md:p-8">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {x.fixedPointLabel}
            </div>
            <p className="text-sm leading-relaxed text-ink-300">{x.fixedPointHint}</p>
          </div>
        </section>

        <div className="pt-2">
          <Link
            href="/quine"
            className="hairline inline-block rounded-full border px-6 py-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
          >
            {x.backToStory}
          </Link>
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------------------------------

interface PanelProps {
  title: string;
  source: string;
  output: string;
  selfEqual: boolean;
  sourceLabel: string;
  outputLabel: string;
  selfEqualBadge: string;
  divergedBadge: string;
  editorLabel: string;
  editorHint: string;
  editorValue: string;
  onEditorChange: (v: string) => void;
  onReset: () => void;
  resetLabel: string;
  runLabel: string;
}

function QuinePanel({
  title,
  source,
  output,
  selfEqual,
  sourceLabel,
  outputLabel,
  selfEqualBadge,
  divergedBadge,
  editorLabel,
  editorHint,
  editorValue,
  onEditorChange,
  onReset,
  resetLabel,
  // runLabel is intentionally unused — execution is reactive on every keystroke,
  // so there is nothing to defer. The label is kept in the i18n surface so we
  // can re-introduce a manual Run button later without churning translations.
}: PanelProps) {
  return (
    <article className="glass hairline space-y-4 rounded-2xl border bg-ink-950/40 p-5 md:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="math-italic text-xl text-ink-100">{title}</h2>
        <span
          className={`hairline rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 ${
            selfEqual
              ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
              : "border-signal-rose/60 bg-signal-rose/10 text-signal-rose"
          }`}
        >
          {selfEqual ? selfEqualBadge : divergedBadge}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {sourceLabel}
          </div>
          <pre className="h-44 overflow-auto rounded-md border border-ink-700/40 bg-ink-950/80 p-3 font-mono text-[12px] leading-relaxed text-ink-100">
            <code>{source}</code>
          </pre>
        </div>
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {outputLabel}
          </div>
          <pre
            className={`h-44 overflow-auto rounded-md border p-3 font-mono text-[12px] leading-relaxed ${
              selfEqual
                ? "border-signal-cyan/40 bg-signal-cyan/5 text-ink-100"
                : "border-signal-rose/40 bg-signal-rose/5 text-ink-100"
            }`}
          >
            <code>{output}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            {editorLabel}
          </div>
          <button
            type="button"
            onClick={onReset}
            className="hairline rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
          >
            {resetLabel}
          </button>
        </div>
        <p className="text-[11px] leading-relaxed text-ink-400">{editorHint}</p>
        <textarea
          value={editorValue}
          onChange={(e) => onEditorChange(e.target.value)}
          spellCheck={false}
          rows={3}
          className="hairline w-full resize-y rounded-md border bg-ink-950/80 p-3 font-mono text-[12px] leading-relaxed text-ink-100 focus:border-signal-cyan/60 focus:outline-none"
        />
      </div>
    </article>
  );
}
