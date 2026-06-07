"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { QuineSignatureHero } from "@/components/signature/QuineSignatureHero";
import type { Locale } from "@/lib/i18n/types";
import type { StoryPage } from "@/lib/i18n/stories";

const ACCENT = "text-signal-cyan";

// --------------------------------------------------------------------------
// Quine — a program whose only output is its own source. Rich, per-locale
// inline prose for all 8 site locales lives directly in this file so the
// shared i18n bundles stay slim.
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
  figureCaption: string;
  figureSub: string;
  closingPretitle: string;
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

// The canonical Python quine — short, real, runs. Used in the inline figure.
const PYTHON_QUINE = `s = 's = %r\\nprint(s %% s)'\nprint(s % s)`;

// ---------------- English ----------------
const en: RichStory = {
  page: {
    pretitle: "Topic · Computation",
    title: "The Quine",
    tagline: "A program whose only output is its own source.",
    intro:
      "Write a program that prints itself, character for character, without reading its own file. Sounds impossible — the program would need to contain its own listing, including the part that contains its own listing. Kleene's recursion theorem (1938) says it is possible in any language expressive enough to talk about its own programs: every computable transformation of a program has a fixed point. Quines are that fixed point made concrete, and they are the same self-reference engine that powers Gödel's incompleteness proof and Turing's halting argument.",
    ctaInteractive: "→ Open the Explorer",
  },
  encounter: {
    pretitle: "First encounter",
    title: "Print yourself, exactly.",
    cards: [
      {
        label: "01",
        title: "The impossible exercise",
        body: "Write a program whose output is identical to its own source code. No cheating: no reading the file, no calling 'cat $0', no environment trick. Just instructions inside the program that happen to print those very instructions back. Most people try once, give up, and conclude there's a paradox.",
      },
      {
        label: "02",
        title: "It actually works",
        body: "Pick almost any modern language and a one-line quine exists. The trick is a data table that describes the code, and code that prints both the table and itself rendered through the table. The two halves are each other's reflection — and the fixed point of that mutual reflection is the source you wrote.",
      },
      {
        label: "03",
        title: "Why it matters",
        body: "Kleene's recursion theorem (1938) says every effective transformation of programs has a fixed point. Quines are the simplest non-trivial example — and Gödel's 'I am unprovable' sentence, Turing's diagonal-halting machine, biological self-replication and computer viruses are all the same trick wearing different costumes.",
      },
    ],
    tryIt: "Build one. Watch it print itself. Modify a single byte and watch self-equality break.",
  },
  sections: [
    {
      pretitle: "Section 01 · The impossible self-print",
      title: "Why the naive approach fails",
      body: "Your first attempt is print('print(\"…\")'). But what goes between the quotes? It has to contain the print statement, which has to contain its argument, which has to contain the print statement … the regress never bottoms out. Any program that tries to literally embed its full source is one character short of itself, forever. The puzzle is to break that infinite descent without cheating — without reading your own file from disk and without using introspection facilities that just hand you the source.",
    },
    {
      pretitle: "Section 02 · Kleene's recursion theorem",
      title: "Every effective transformation has a fixed point",
      body: "Stephen Cole Kleene (1938) proved a deep result about computable functions: for any computable f that takes a program and produces a program, there exists a program p such that p and f(p) behave identically. Choose f to be 'the function that, given any program, returns one which prints that program' — its fixed point is a program whose behaviour is to print itself. Quines are not a clever hack; they are guaranteed by a theorem.",
    },
    {
      pretitle: "Section 03 · The construction trick",
      title: "Split your program into a data sheet and a printer",
      body: "Every working quine has two halves. The data half is a string literal that describes the code half. The code half reads the data, then prints the data twice — once as a quoted string (re-creating the data half) and once as raw code (re-creating the code half). The string contains a placeholder where it expects to see itself. That eval-and-quote pair is the engine: data describes code, code rebuilds data. Lisp programmers know it as the quasi-quote dance; the same shape appears in every language that can manipulate its own representations.",
    },
    {
      pretitle: "Section 04 · A real, short, runnable quine",
      title: "Python in two lines",
      body: "The shortest readable quine in Python is two statements: bind a format-string template to s, then print s formatted with itself. The %r in the template forces Python to re-emit the string with its quotes intact — that single piece of self-aware formatting is what closes the loop. Run the program, copy the output, save it, run again: you get the same text out. The same shape works in C, JavaScript, Haskell, Ruby and Lisp — the names of the operators change, the architecture does not.",
    },
    {
      pretitle: "Section 05 · Viruses, worms, and Trusting Trust",
      title: "Self-reference as an attack surface",
      body: "A computer virus is a quine with extra payload: code that copies itself, then does something else. Every classical virus and worm — Morris (1988), ILOVEYOU (2000), Stuxnet's spreading layer — has a quine at its core. In 1984 Ken Thompson's Turing Award lecture (Reflections on Trusting Trust) showed something darker: a compiler can be a quine that inserts a backdoor at every build, including into a clean re-compile of itself. The backdoor never appears in the source. The lecture is the founding document of supply-chain security and reproducible-build research.",
    },
    {
      pretitle: "Section 06 · Gödel, Halting, and the engine of incompleteness",
      title: "All self-reference, all the way down",
      body: "Kurt Gödel's 1931 sentence 'I am unprovable' is a quine in formal logic: an arithmetic statement constructed via the diagonal lemma to refer to its own Gödel number. Alan Turing's halting machine (1936) is a quine that asks itself whether it halts and does the opposite. Hofstadter spent eight hundred pages of Gödel, Escher, Bach showing that DNA, J. S. Bach's canons and Escher's drawing hands are all the same diagonal trick. Quines are the engine; incompleteness, undecidability and self-replication are what falls out when you turn it.",
    },
  ],
  figureCaption: "A two-line Python quine. Run it; it prints itself.",
  figureSub: "Save the output to a file, run again, get the same text — for as many generations as you like.",
  closingPretitle: "Build one yourself",
  closingTitle: "Open the Explorer.",
  closingBody:
    "The Explorer shows a real Python quine and a real Lisp quine side by side, runs a faithful in-browser simulation of their execution, and lets you mutate a single character to watch the self-equality property collapse. Self-reference, taken apart and put back together.",
  ctaLabel: "→ Open the Explorer",
};

// ---------------- Deutsch ----------------
const de: RichStory = {
  page: {
    pretitle: "Thema · Berechnung",
    title: "Die Quine",
    tagline: "Ein Programm, dessen einzige Ausgabe sein eigener Quelltext ist.",
    intro:
      "Schreibe ein Programm, das sich selbst Zeichen für Zeichen ausgibt — ohne seine eigene Datei zu lesen. Klingt unmöglich: das Programm müsste sein eigenes Listing enthalten, einschließlich des Teils, der das Listing enthält. Kleenes Rekursionssatz (1938) sagt: in jeder Sprache, die ausdrucksstark genug ist, um über eigene Programme zu sprechen, ist es möglich — jede berechenbare Transformation von Programmen hat einen Fixpunkt. Quines sind dieser Fixpunkt, konkret gemacht; und sie sind derselbe Selbstreferenz-Motor, der Gödels Unvollständigkeitsbeweis und Turings Halteproblem antreibt.",
    ctaInteractive: "→ Zum Explorer",
  },
  encounter: {
    pretitle: "Erste Begegnung",
    title: "Drucke dich selbst, exakt.",
    cards: [
      {
        label: "01",
        title: "Die unmögliche Übung",
        body: "Schreibe ein Programm, dessen Ausgabe identisch mit dem eigenen Quelltext ist. Nicht schummeln: kein Lesen der Datei, kein „cat $0«, kein Umgebungs-Trick. Nur Anweisungen, die zufällig genau diese Anweisungen wieder ausgeben. Die meisten versuchen es einmal, geben auf und schließen auf ein Paradox.",
      },
      {
        label: "02",
        title: "Es funktioniert tatsächlich",
        body: "In fast jeder modernen Sprache existiert eine einzeilige Quine. Der Trick: eine Datentabelle, die den Code beschreibt, und Code, der sowohl die Tabelle als auch sich selbst — gerendert durch die Tabelle — ausgibt. Beide Hälften sind das Spiegelbild der anderen, und der Fixpunkt dieser gegenseitigen Spiegelung ist der Quelltext, den du geschrieben hast.",
      },
      {
        label: "03",
        title: "Warum es wichtig ist",
        body: "Kleenes Rekursionssatz (1938) sagt: jede effektive Transformation von Programmen hat einen Fixpunkt. Quines sind das einfachste nichttriviale Beispiel — und Gödels Satz „ich bin unbeweisbar«, Turings Diagonal-Halte-Maschine, biologische Selbstreplikation und Computerviren sind alle derselbe Trick in unterschiedlichen Kostümen.",
      },
    ],
    tryIt: "Baue eine. Sieh ihr beim Selbstdruck zu. Ändere ein Byte und beobachte, wie die Selbstgleichheit zerbricht.",
  },
  sections: [
    {
      pretitle: "Abschnitt 01 · Der unmögliche Selbstdruck",
      title: "Warum der naive Ansatz scheitert",
      body: "Dein erster Versuch ist print('print(\"…\")'). Aber was steht zwischen den Anführungszeichen? Es muss das print-Statement enthalten, das sein Argument enthalten muss, das das print-Statement enthalten muss … der Regress endet nie. Jedes Programm, das seinen vollständigen Quelltext wörtlich einbetten will, ist auf ewig ein Zeichen zu kurz. Die Aufgabe: diesen unendlichen Abstieg brechen, ohne zu schummeln — ohne die eigene Datei von der Platte zu lesen und ohne Introspektions-Funktionen zu benutzen, die einem den Quelltext einfach in die Hand drücken.",
    },
    {
      pretitle: "Abschnitt 02 · Kleenes Rekursionssatz",
      title: "Jede effektive Transformation hat einen Fixpunkt",
      body: "Stephen Cole Kleene (1938) bewies ein tiefes Resultat über berechenbare Funktionen: für jede berechenbare Funktion f, die ein Programm nimmt und ein Programm liefert, existiert ein Programm p, sodass p und f(p) identisch arbeiten. Wähle f als „die Funktion, die zu jedem Programm eines liefert, das dieses Programm ausgibt« — ihr Fixpunkt ist ein Programm, dessen Verhalten darin besteht, sich selbst zu drucken. Quines sind kein cleverer Hack; sie sind durch einen Satz garantiert.",
    },
    {
      pretitle: "Abschnitt 03 · Der Konstruktionstrick",
      title: "Teile dein Programm in Datenblatt und Drucker",
      body: "Jede funktionierende Quine hat zwei Hälften. Die Daten-Hälfte ist ein String-Literal, das die Code-Hälfte beschreibt. Die Code-Hälfte liest die Daten und druckt sie zweimal — einmal als geklammerten String (wodurch die Daten-Hälfte rekonstruiert wird) und einmal als rohen Code (wodurch die Code-Hälfte rekonstruiert wird). Der String enthält einen Platzhalter an der Stelle, an der er sich selbst erwartet. Dieses Eval-und-Quote-Paar ist der Motor: Daten beschreiben Code, Code baut Daten wieder auf. Lisp-Programmierer:innen kennen es als Quasi-Quote-Tanz; dieselbe Form taucht in jeder Sprache auf, die ihre eigenen Repräsentationen manipulieren kann.",
    },
    {
      pretitle: "Abschnitt 04 · Eine echte, kurze, lauffähige Quine",
      title: "Python in zwei Zeilen",
      body: "Die kürzeste lesbare Quine in Python sind zwei Anweisungen: binde ein Format-String-Template an s, drucke dann s mit sich selbst formatiert. Das %r im Template zwingt Python dazu, den String mit erhaltenen Anführungszeichen wieder auszugeben — genau dieses Stück selbstbewusster Formatierung schließt die Schleife. Programm starten, Ausgabe kopieren, speichern, erneut starten: dasselbe Ergebnis. Dieselbe Form funktioniert in C, JavaScript, Haskell, Ruby und Lisp — die Operatornamen wechseln, die Architektur bleibt.",
    },
    {
      pretitle: "Abschnitt 05 · Viren, Würmer und Trusting Trust",
      title: "Selbstreferenz als Angriffsfläche",
      body: "Ein Computervirus ist eine Quine mit zusätzlicher Nutzlast: Code, der sich selbst kopiert, danach etwas anderes tut. Jeder klassische Virus und Wurm — Morris (1988), ILOVEYOU (2000), die Verbreitungsschicht von Stuxnet — hat eine Quine im Kern. 1984 zeigte Ken Thompson in seiner Turing-Award-Rede (Reflections on Trusting Trust) etwas Düstereres: ein Compiler kann eine Quine sein, die bei jedem Build eine Hintertür einfügt — auch in einen sauberen Recompile seiner selbst. Die Hintertür taucht im Quelltext nie auf. Diese Rede ist das Gründungsdokument der Lieferkettensicherheit und der Forschung zu reproduzierbaren Builds.",
    },
    {
      pretitle: "Abschnitt 06 · Gödel, Halten und der Motor der Unvollständigkeit",
      title: "Alles Selbstreferenz, von oben bis unten",
      body: "Kurt Gödels Satz von 1931 „ich bin unbeweisbar« ist eine Quine in der formalen Logik: eine arithmetische Aussage, die über das Diagonal-Lemma so konstruiert wird, dass sie auf ihre eigene Gödelnummer verweist. Alan Turings Halte-Maschine (1936) ist eine Quine, die sich selbst fragt, ob sie hält, und dann das Gegenteil tut. Hofstadter brauchte achthundert Seiten Gödel, Escher, Bach um zu zeigen, dass DNA, J. S. Bachs Kanons und Eschers zeichnende Hände alle derselbe Diagonaltrick sind. Quines sind der Motor; Unvollständigkeit, Unentscheidbarkeit und Selbstreplikation sind das, was herausfällt, wenn man ihn dreht.",
    },
  ],
  figureCaption: "Eine zweizeilige Python-Quine. Führe sie aus; sie druckt sich selbst.",
  figureSub: "Speichere die Ausgabe in einer Datei, starte erneut, bekomme denselben Text — für beliebig viele Generationen.",
  closingPretitle: "Bau dir eine",
  closingTitle: "Öffne den Explorer.",
  closingBody:
    "Der Explorer zeigt eine echte Python-Quine und eine echte Lisp-Quine nebeneinander, simuliert ihre Ausführung im Browser originalgetreu und lässt dich ein einziges Zeichen ändern, um zuzusehen, wie die Selbstgleichheit zerbricht. Selbstreferenz, auseinandergenommen und wieder zusammengesetzt.",
  ctaLabel: "→ Zum Explorer",
};

// ---------------- Español ----------------
const es: RichStory = {
  page: {
    pretitle: "Tema · Computación",
    title: "La quine",
    tagline: "Un programa cuya única salida es su propio código fuente.",
    intro:
      "Escribe un programa que se imprima a sí mismo, carácter por carácter, sin leer su propio fichero. Suena imposible: el programa tendría que contener su listado, incluida la parte que contiene el listado. El teorema de recursión de Kleene (1938) dice que es posible en cualquier lenguaje lo bastante expresivo para hablar de sus propios programas: toda transformación computable de programas tiene un punto fijo. Las quines son ese punto fijo hecho concreto, y son el mismo motor de autorreferencia que mueve la prueba de incompletitud de Gödel y el argumento de la parada de Turing.",
    ctaInteractive: "→ Abrir el Explorer",
  },
  encounter: {
    pretitle: "Primer encuentro",
    title: "Imprímete a ti mismo, exacto.",
    cards: [
      {
        label: "01",
        title: "El ejercicio imposible",
        body: "Escribe un programa cuya salida sea idéntica a su propio código fuente. Sin trampas: nada de leer el fichero, ni «cat $0», ni triquiñuelas de entorno. Solo instrucciones dentro del programa que casualmente vuelven a imprimir esas mismas instrucciones. La mayoría lo intenta una vez, se rinde y concluye que hay una paradoja.",
      },
      {
        label: "02",
        title: "Realmente funciona",
        body: "Toma casi cualquier lenguaje moderno y existe una quine de una sola línea. El truco: una tabla de datos que describe el código, y código que imprime tanto la tabla como a sí mismo a través de la tabla. Las dos mitades son el reflejo la una de la otra, y el punto fijo de ese reflejo mutuo es el código que escribiste.",
      },
      {
        label: "03",
        title: "Por qué importa",
        body: "El teorema de recursión de Kleene (1938) dice que toda transformación efectiva de programas tiene un punto fijo. Las quines son el ejemplo no trivial más simple — y la frase «soy indemostrable» de Gödel, la máquina de parada diagonal de Turing, la autorreplicación biológica y los virus informáticos son todos el mismo truco con disfraces distintos.",
      },
    ],
    tryIt: "Construye una. Mírala imprimirse. Modifica un solo byte y observa cómo se rompe la autoigualdad.",
  },
  sections: [
    {
      pretitle: "Sección 01 · La autoimpresión imposible",
      title: "Por qué falla el enfoque ingenuo",
      body: "Tu primer intento es print('print(\"…\")'). Pero ¿qué va entre las comillas? Tiene que contener la sentencia print, que tiene que contener su argumento, que tiene que contener la sentencia print… la regresión no toca fondo. Cualquier programa que intente incrustar literalmente su código completo está siempre a un carácter de sí mismo. El reto es romper ese descenso infinito sin hacer trampa — sin leer tu propio fichero desde disco y sin facilidades de introspección que te entreguen el código en bandeja.",
    },
    {
      pretitle: "Sección 02 · El teorema de recursión de Kleene",
      title: "Toda transformación efectiva tiene un punto fijo",
      body: "Stephen Cole Kleene (1938) probó un resultado profundo sobre funciones computables: para cualquier f computable que tome un programa y produzca un programa, existe un programa p tal que p y f(p) se comportan idénticamente. Elige f como «la función que, dado cualquier programa, devuelve uno que imprime ese programa» — su punto fijo es un programa cuyo comportamiento es imprimirse a sí mismo. Las quines no son un truco ingenioso; las garantiza un teorema.",
    },
    {
      pretitle: "Sección 03 · El truco de construcción",
      title: "Divide tu programa en hoja de datos e impresora",
      body: "Toda quine que funciona tiene dos mitades. La mitad de datos es un literal de cadena que describe la mitad de código. La mitad de código lee los datos y los imprime dos veces — una como cadena entre comillas (recreando la mitad de datos) y otra como código crudo (recreando la mitad de código). La cadena contiene un marcador en el lugar donde espera verse a sí misma. Ese par evaluar-y-citar es el motor: los datos describen el código, el código reconstruye los datos. Los programadores de Lisp lo conocen como el baile de la cuasi-comilla; la misma forma aparece en todo lenguaje que sepa manipular sus propias representaciones.",
    },
    {
      pretitle: "Sección 04 · Una quine real, corta y ejecutable",
      title: "Python en dos líneas",
      body: "La quine más legible en Python son dos sentencias: enlaza una plantilla de cadena de formato a s, luego imprime s formateada consigo misma. El %r del template obliga a Python a reemitir la cadena con sus comillas intactas — ese único trozo de formato consciente de sí mismo es lo que cierra el bucle. Ejecuta el programa, copia la salida, guárdala, vuelve a ejecutar: obtienes el mismo texto. La misma forma funciona en C, JavaScript, Haskell, Ruby y Lisp — cambian los nombres de los operadores, no la arquitectura.",
    },
    {
      pretitle: "Sección 05 · Virus, gusanos y Trusting Trust",
      title: "La autorreferencia como superficie de ataque",
      body: "Un virus informático es una quine con carga útil añadida: código que se copia y luego hace otra cosa. Cada virus y gusano clásico — Morris (1988), ILOVEYOU (2000), la capa de propagación de Stuxnet — tiene una quine en su núcleo. En 1984, la conferencia del Turing Award de Ken Thompson (Reflections on Trusting Trust) mostró algo más oscuro: un compilador puede ser una quine que inserta una puerta trasera en cada compilación, incluso en una recompilación limpia de sí mismo. La puerta trasera no aparece nunca en el código. La conferencia es el documento fundacional de la seguridad de la cadena de suministro y de la investigación en builds reproducibles.",
    },
    {
      pretitle: "Sección 06 · Gödel, parada y el motor de la incompletitud",
      title: "Autorreferencia hasta el final",
      body: "La frase de 1931 de Kurt Gödel «soy indemostrable» es una quine en la lógica formal: una afirmación aritmética construida mediante el lema diagonal para referirse a su propio número de Gödel. La máquina de parada de Alan Turing (1936) es una quine que se pregunta a sí misma si se detiene y hace lo contrario. Hofstadter dedicó ochocientas páginas de Gödel, Escher, Bach a mostrar que el ADN, los cánones de J. S. Bach y las manos que se dibujan de Escher son el mismo truco diagonal. Las quines son el motor; la incompletitud, la indecidibilidad y la autorreplicación son lo que sale cuando lo haces girar.",
    },
  ],
  figureCaption: "Una quine de Python de dos líneas. Ejecútala; se imprime a sí misma.",
  figureSub: "Guarda la salida en un fichero, vuelve a ejecutar, obtén el mismo texto — para tantas generaciones como quieras.",
  closingPretitle: "Construye una",
  closingTitle: "Abre el Explorador.",
  closingBody:
    "El Explorador muestra una quine real en Python y una real en Lisp lado a lado, ejecuta una simulación fiel de su ejecución dentro del navegador y te deja mutar un único carácter para ver cómo se desploma la propiedad de autoigualdad. La autorreferencia, desmontada y vuelta a montar.",
  ctaLabel: "→ Abrir el Explorador",
};

// ---------------- Français ----------------
const fr: RichStory = {
  page: {
    pretitle: "Sujet · Calcul",
    title: "La quine",
    tagline: "Un programme dont la seule sortie est son propre code source.",
    intro:
      "Écris un programme qui s'imprime lui-même, caractère par caractère, sans lire son propre fichier. Cela paraît impossible : le programme devrait contenir son propre listing, y compris la partie qui contient ce listing. Le théorème de récursion de Kleene (1938) dit que c'est possible dans tout langage assez expressif pour parler de ses propres programmes : toute transformation calculable de programmes admet un point fixe. Les quines sont ce point fixe rendu concret, et elles sont le même moteur d'autoréférence qui anime la preuve d'incomplétude de Gödel et l'argument de l'arrêt de Turing.",
    ctaInteractive: "→ Ouvrir l'Explorer",
  },
  encounter: {
    pretitle: "Première rencontre",
    title: "Imprime-toi, exactement.",
    cards: [
      {
        label: "01",
        title: "L'exercice impossible",
        body: "Écris un programme dont la sortie est identique à son propre code source. Pas de triche : pas de lecture du fichier, pas de « cat $0 », pas d'astuce d'environnement. Juste des instructions à l'intérieur du programme qui se trouvent imprimer ces mêmes instructions en retour. La plupart des gens essaient une fois, abandonnent et concluent à un paradoxe.",
      },
      {
        label: "02",
        title: "Ça marche vraiment",
        body: "Dans presque tout langage moderne, il existe une quine d'une seule ligne. L'astuce : une table de données qui décrit le code, et du code qui imprime à la fois la table et lui-même rendu à travers la table. Les deux moitiés sont le reflet l'une de l'autre, et le point fixe de cette réflexion mutuelle est le code que tu as écrit.",
      },
      {
        label: "03",
        title: "Pourquoi cela compte",
        body: "Le théorème de récursion de Kleene (1938) dit que toute transformation effective de programmes admet un point fixe. Les quines en sont l'exemple non trivial le plus simple — et la phrase « je suis indémontrable » de Gödel, la machine d'arrêt diagonale de Turing, l'autoréplication biologique et les virus informatiques sont tous le même tour de passe-passe sous des costumes différents.",
      },
    ],
    tryIt: "Construis-en une. Regarde-la s'imprimer. Modifie un seul octet et observe l'autoégalité se briser.",
  },
  sections: [
    {
      pretitle: "Section 01 · L'auto-impression impossible",
      title: "Pourquoi l'approche naïve échoue",
      body: "Ta première tentative est print('print(\"…\")'). Mais que met-on entre les guillemets ? Il faut y mettre l'instruction print, qui doit contenir son argument, qui doit contenir l'instruction print… la régression ne touche jamais le fond. Tout programme qui essaie d'embarquer littéralement son code complet est éternellement à un caractère de lui-même. Le défi est de casser cette descente infinie sans tricher — sans lire son propre fichier depuis le disque et sans utiliser des facilités d'introspection qui te tendent le code sur un plateau.",
    },
    {
      pretitle: "Section 02 · Le théorème de récursion de Kleene",
      title: "Toute transformation effective a un point fixe",
      body: "Stephen Cole Kleene (1938) a démontré un résultat profond sur les fonctions calculables : pour toute fonction calculable f qui prend un programme et produit un programme, il existe un programme p tel que p et f(p) se comportent à l'identique. Choisis f comme « la fonction qui, à tout programme, associe un programme qui imprime ce programme » — son point fixe est un programme dont le comportement est de s'imprimer lui-même. Les quines ne sont pas une astuce de débrouille ; elles sont garanties par un théorème.",
    },
    {
      pretitle: "Section 03 · Le truc de construction",
      title: "Sépare ton programme en feuille de données et imprimante",
      body: "Toute quine qui marche a deux moitiés. La moitié de données est un littéral de chaîne qui décrit la moitié de code. La moitié de code lit les données et les imprime deux fois — une fois sous forme de chaîne entre guillemets (recréant la moitié de données) et une fois sous forme de code brut (recréant la moitié de code). La chaîne contient un marqueur à l'endroit où elle s'attend à se voir elle-même. Cette paire eval-et-quote est le moteur : les données décrivent le code, le code reconstruit les données. Les programmeurs Lisp connaissent cela comme la danse de la quasi-quote ; la même forme apparaît dans tout langage capable de manipuler ses propres représentations.",
    },
    {
      pretitle: "Section 04 · Une vraie quine, courte et exécutable",
      title: "Python en deux lignes",
      body: "La quine la plus lisible en Python tient en deux instructions : lie un modèle de chaîne de format à s, puis imprime s formaté avec lui-même. Le %r du modèle force Python à ré-émettre la chaîne avec ses guillemets intacts — c'est ce seul morceau de formatage conscient de soi qui referme la boucle. Lance le programme, copie la sortie, sauvegarde-la, relance : tu obtiens le même texte. La même forme fonctionne en C, JavaScript, Haskell, Ruby et Lisp — les noms d'opérateurs changent, l'architecture non.",
    },
    {
      pretitle: "Section 05 · Virus, vers et Trusting Trust",
      title: "L'autoréférence comme surface d'attaque",
      body: "Un virus informatique est une quine avec une charge utile : du code qui se copie puis fait autre chose. Chaque virus et ver classique — Morris (1988), ILOVEYOU (2000), la couche de propagation de Stuxnet — a une quine en son cœur. En 1984, le discours du Turing Award de Ken Thompson (Reflections on Trusting Trust) a montré quelque chose de plus sombre : un compilateur peut être une quine qui insère une porte dérobée à chaque compilation, y compris dans une recompilation propre de lui-même. La porte dérobée n'apparaît jamais dans le code. Ce discours est le document fondateur de la sécurité de la chaîne d'approvisionnement et de la recherche sur les builds reproductibles.",
    },
    {
      pretitle: "Section 06 · Gödel, l'arrêt et le moteur de l'incomplétude",
      title: "De l'autoréférence partout, à tous les étages",
      body: "La phrase de 1931 de Kurt Gödel « je suis indémontrable » est une quine en logique formelle : un énoncé arithmétique construit via le lemme diagonal pour se référer à son propre nombre de Gödel. La machine d'arrêt d'Alan Turing (1936) est une quine qui se demande si elle s'arrête et fait l'inverse. Hofstadter a consacré huit cents pages de Gödel, Escher, Bach à montrer que l'ADN, les canons de J. S. Bach et les mains qui se dessinent d'Escher sont le même tour diagonal. Les quines sont le moteur ; l'incomplétude, l'indécidabilité et l'autoréplication sont ce qui en tombe quand on le tourne.",
    },
  ],
  figureCaption: "Une quine Python en deux lignes. Lance-la ; elle s'imprime elle-même.",
  figureSub: "Sauvegarde la sortie dans un fichier, relance, obtiens le même texte — pour autant de générations que tu veux.",
  closingPretitle: "Construis-en une",
  closingTitle: "Ouvre l'Explorateur.",
  closingBody:
    "L'Explorateur montre une vraie quine Python et une vraie quine Lisp côte à côte, simule fidèlement leur exécution dans le navigateur et te laisse muter un seul caractère pour voir la propriété d'autoégalité s'effondrer. L'autoréférence, démontée puis remontée.",
  ctaLabel: "→ Ouvrir l'Explorateur",
};

// ---------------- Italiano ----------------
const it: RichStory = {
  page: {
    pretitle: "Tema · Calcolo",
    title: "La quine",
    tagline: "Un programma il cui unico output è il proprio codice sorgente.",
    intro:
      "Scrivi un programma che stampi sé stesso, carattere per carattere, senza leggere il proprio file. Sembra impossibile: il programma dovrebbe contenere il proprio listato, inclusa la parte che contiene il listato. Il teorema di ricorsione di Kleene (1938) dice che è possibile in qualsiasi linguaggio abbastanza espressivo da parlare dei propri programmi: ogni trasformazione calcolabile di programmi ammette un punto fisso. Le quine sono quel punto fisso reso concreto, e sono lo stesso motore di autoreferenza che muove la dimostrazione di incompletezza di Gödel e l'argomento dell'arresto di Turing.",
    ctaInteractive: "→ Apri l'Explorer",
  },
  encounter: {
    pretitle: "Primo incontro",
    title: "Stampa te stesso, esattamente.",
    cards: [
      {
        label: "01",
        title: "L'esercizio impossibile",
        body: "Scrivi un programma il cui output sia identico al proprio codice sorgente. Niente trucchi: niente lettura del file, niente «cat $0», niente furberie d'ambiente. Solo istruzioni dentro il programma che si trovano a stampare proprio quelle istruzioni. La maggior parte ci prova una volta, si arrende e conclude che c'è un paradosso.",
      },
      {
        label: "02",
        title: "Funziona davvero",
        body: "Scegli quasi qualsiasi linguaggio moderno ed esiste una quine di una sola riga. Il trucco: una tabella di dati che descrive il codice, e del codice che stampa sia la tabella sia sé stesso passato attraverso la tabella. Le due metà sono il riflesso l'una dell'altra, e il punto fisso di questo riflesso reciproco è il codice che hai scritto.",
      },
      {
        label: "03",
        title: "Perché conta",
        body: "Il teorema di ricorsione di Kleene (1938) dice che ogni trasformazione effettiva di programmi ha un punto fisso. Le quine ne sono l'esempio non banale più semplice — e la frase «sono indimostrabile» di Gödel, la macchina diagonale dell'arresto di Turing, l'autoreplicazione biologica e i virus informatici sono tutti lo stesso trucco con costumi diversi.",
      },
    ],
    tryIt: "Costruiscine una. Guardala stamparsi. Modifica un singolo byte e osserva l'autougualianza spezzarsi.",
  },
  sections: [
    {
      pretitle: "Sezione 01 · L'autostampa impossibile",
      title: "Perché l'approccio ingenuo fallisce",
      body: "Il tuo primo tentativo è print('print(\"…\")'). Ma cosa va fra le virgolette? Deve contenere lo statement print, che deve contenere il suo argomento, che deve contenere lo statement print… la regressione non tocca mai il fondo. Ogni programma che tenta di incorporare letteralmente il proprio codice completo è eternamente a un carattere da sé stesso. La sfida è rompere quella discesa infinita senza barare — senza leggere il proprio file dal disco e senza facilities di introspezione che ti consegnino il codice già pronto.",
    },
    {
      pretitle: "Sezione 02 · Il teorema di ricorsione di Kleene",
      title: "Ogni trasformazione effettiva ha un punto fisso",
      body: "Stephen Cole Kleene (1938) dimostrò un risultato profondo sulle funzioni calcolabili: per ogni f calcolabile che prende un programma e produce un programma, esiste un programma p tale che p e f(p) si comportano in modo identico. Scegli f come «la funzione che, dato un qualsiasi programma, restituisce uno che stampa quel programma» — il suo punto fisso è un programma il cui comportamento è stampare sé stesso. Le quine non sono un trucco furbo; sono garantite da un teorema.",
    },
    {
      pretitle: "Sezione 03 · Il trucco di costruzione",
      title: "Dividi il programma in foglio dati e stampante",
      body: "Ogni quine funzionante ha due metà. La metà dati è un letterale di stringa che descrive la metà codice. La metà codice legge i dati e li stampa due volte — una come stringa fra virgolette (ricreando la metà dati) e una come codice grezzo (ricreando la metà codice). La stringa contiene un segnaposto nel punto in cui si aspetta di vedere sé stessa. Quella coppia eval-e-quote è il motore: i dati descrivono il codice, il codice ricostruisce i dati. I programmatori Lisp la conoscono come la danza della quasi-quote; la stessa forma compare in ogni linguaggio capace di manipolare le proprie rappresentazioni.",
    },
    {
      pretitle: "Sezione 04 · Una quine vera, breve e eseguibile",
      title: "Python in due righe",
      body: "La quine più leggibile in Python sono due istruzioni: lega un template di stringa di formato a s, poi stampa s formattata con sé stessa. Il %r nel template costringe Python a riemettere la stringa con le virgolette intatte — proprio quel singolo pezzo di formattazione consapevole di sé chiude il cerchio. Esegui il programma, copia l'output, salvalo, esegui di nuovo: ottieni lo stesso testo. La stessa forma funziona in C, JavaScript, Haskell, Ruby e Lisp — cambiano i nomi degli operatori, non l'architettura.",
    },
    {
      pretitle: "Sezione 05 · Virus, worm e Trusting Trust",
      title: "L'autoreferenza come superficie d'attacco",
      body: "Un virus informatico è una quine con un payload extra: codice che si copia, poi fa qualcos'altro. Ogni virus e worm classico — Morris (1988), ILOVEYOU (2000), lo strato di propagazione di Stuxnet — ha una quine al centro. Nel 1984 la lectio di Ken Thompson per il premio Turing (Reflections on Trusting Trust) mostrò qualcosa di più oscuro: un compilatore può essere una quine che inserisce una backdoor ad ogni build, anche in una ricompilazione pulita di sé stesso. La backdoor non compare mai nel codice. Quella lectio è il documento fondativo della sicurezza della catena di fornitura e della ricerca sui build riproducibili.",
    },
    {
      pretitle: "Sezione 06 · Gödel, arresto e il motore dell'incompletezza",
      title: "Autoreferenza fino in fondo",
      body: "La frase del 1931 di Kurt Gödel «sono indimostrabile» è una quine nella logica formale: un'affermazione aritmetica costruita tramite il lemma diagonale per riferirsi al proprio numero di Gödel. La macchina dell'arresto di Alan Turing (1936) è una quine che chiede a sé stessa se si ferma e fa il contrario. Hofstadter dedicò ottocento pagine di Gödel, Escher, Bach a mostrare che il DNA, i canoni di J. S. Bach e le mani che si disegnano di Escher sono tutti lo stesso trucco diagonale. Le quine sono il motore; incompletezza, indecidibilità e autoreplicazione sono ciò che cade fuori quando lo si fa girare.",
    },
  ],
  figureCaption: "Una quine Python di due righe. Eseguila; stampa sé stessa.",
  figureSub: "Salva l'output in un file, esegui di nuovo, ottieni lo stesso testo — per quante generazioni vuoi.",
  closingPretitle: "Costruiscine una",
  closingTitle: "Apri l'Esploratore.",
  closingBody:
    "L'Esploratore mostra una vera quine Python e una vera quine Lisp fianco a fianco, simula fedelmente la loro esecuzione nel browser e ti lascia mutare un singolo carattere per vedere la proprietà di autougualianza collassare. L'autoreferenza, smontata e rimontata.",
  ctaLabel: "→ Apri l'Esploratore",
};

// ---------------- Português ----------------
const pt: RichStory = {
  page: {
    pretitle: "Tema · Computação",
    title: "A quine",
    tagline: "Um programa cuja única saída é o seu próprio código-fonte.",
    intro:
      "Escreve um programa que se imprima a si próprio, carácter a carácter, sem ler o seu próprio ficheiro. Parece impossível: o programa teria de conter a sua própria listagem, incluindo a parte que contém a listagem. O teorema da recursão de Kleene (1938) diz que é possível em qualquer linguagem suficientemente expressiva para falar dos seus próprios programas: toda a transformação computável de programas tem um ponto fixo. As quines são esse ponto fixo tornado concreto, e são o mesmo motor de autorreferência que move a prova de incompletude de Gödel e o argumento da paragem de Turing.",
    ctaInteractive: "→ Abrir o Explorer",
  },
  encounter: {
    pretitle: "Primeiro encontro",
    title: "Imprime-te a ti próprio, exato.",
    cards: [
      {
        label: "01",
        title: "O exercício impossível",
        body: "Escreve um programa cuja saída seja idêntica ao seu próprio código-fonte. Sem batota: nada de ler o ficheiro, nada de «cat $0», nada de truques de ambiente. Apenas instruções dentro do programa que por acaso voltam a imprimir essas mesmas instruções. A maioria tenta uma vez, desiste e conclui que há um paradoxo.",
      },
      {
        label: "02",
        title: "Funciona mesmo",
        body: "Escolhe quase qualquer linguagem moderna e existe uma quine de uma única linha. O truque: uma tabela de dados que descreve o código, e código que imprime tanto a tabela como a si próprio passado pela tabela. As duas metades são o reflexo uma da outra, e o ponto fixo desse reflexo mútuo é o código que escreveste.",
      },
      {
        label: "03",
        title: "Porque importa",
        body: "O teorema da recursão de Kleene (1938) diz que toda a transformação efetiva de programas tem um ponto fixo. As quines são o exemplo não trivial mais simples — e a frase «sou indemonstrável» de Gödel, a máquina diagonal de paragem de Turing, a autorreplicação biológica e os vírus informáticos são todos o mesmo truque com fatos diferentes.",
      },
    ],
    tryIt: "Constrói uma. Vê-a imprimir-se. Modifica um único byte e observa a autoigualdade quebrar-se.",
  },
  sections: [
    {
      pretitle: "Secção 01 · A auto-impressão impossível",
      title: "Porque a abordagem ingénua falha",
      body: "A tua primeira tentativa é print('print(\"…\")'). Mas o que vai entre as aspas? Tem de conter a instrução print, que tem de conter o seu argumento, que tem de conter a instrução print… a regressão nunca toca fundo. Qualquer programa que tente embutir literalmente o seu código completo está eternamente a um carácter de si mesmo. O desafio é quebrar essa descida infinita sem fazer batota — sem ler o próprio ficheiro do disco e sem usar facilidades de introspeção que te entreguem o código de bandeja.",
    },
    {
      pretitle: "Secção 02 · O teorema da recursão de Kleene",
      title: "Toda a transformação efetiva tem um ponto fixo",
      body: "Stephen Cole Kleene (1938) provou um resultado profundo sobre funções computáveis: para qualquer f computável que toma um programa e produz um programa, existe um programa p tal que p e f(p) se comportam de forma idêntica. Escolhe f como «a função que, dado qualquer programa, devolve um que imprime esse programa» — o seu ponto fixo é um programa cujo comportamento é imprimir-se a si próprio. As quines não são um truque esperto; são garantidas por um teorema.",
    },
    {
      pretitle: "Secção 03 · O truque de construção",
      title: "Divide o programa em folha de dados e impressora",
      body: "Toda a quine funcional tem duas metades. A metade de dados é um literal de string que descreve a metade de código. A metade de código lê os dados e imprime-os duas vezes — uma como string entre aspas (recriando a metade de dados) e outra como código cru (recriando a metade de código). A string contém um marcador no sítio onde espera ver-se a si própria. Esse par eval-e-quote é o motor: os dados descrevem o código, o código reconstrói os dados. Programadores de Lisp conhecem-no como a dança da quasi-aspa; a mesma forma aparece em toda a linguagem capaz de manipular as suas próprias representações.",
    },
    {
      pretitle: "Secção 04 · Uma quine real, curta e executável",
      title: "Python em duas linhas",
      body: "A quine mais legível em Python são duas instruções: liga um template de string de formato a s, depois imprime s formatado consigo próprio. O %r no template obriga Python a reemitir a string com as aspas intactas — esse único pedaço de formatação consciente de si é o que fecha o ciclo. Executa o programa, copia a saída, guarda, executa de novo: obténs o mesmo texto. A mesma forma funciona em C, JavaScript, Haskell, Ruby e Lisp — os nomes dos operadores mudam, a arquitetura não.",
    },
    {
      pretitle: "Secção 05 · Vírus, worms e Trusting Trust",
      title: "Autorreferência como superfície de ataque",
      body: "Um vírus informático é uma quine com payload extra: código que se copia, depois faz outra coisa. Cada vírus e worm clássico — Morris (1988), ILOVEYOU (2000), a camada de propagação do Stuxnet — tem uma quine no centro. Em 1984, a lectio do Turing Award de Ken Thompson (Reflections on Trusting Trust) mostrou algo mais sombrio: um compilador pode ser uma quine que insere uma backdoor em cada build, mesmo numa recompilação limpa de si próprio. A backdoor nunca aparece no código. Essa lectio é o documento fundador da segurança da cadeia de fornecimento e da investigação em builds reproduzíveis.",
    },
    {
      pretitle: "Secção 06 · Gödel, paragem e o motor da incompletude",
      title: "Autorreferência até ao fim",
      body: "A frase de 1931 de Kurt Gödel «sou indemonstrável» é uma quine na lógica formal: uma afirmação aritmética construída via o lema diagonal para se referir ao seu próprio número de Gödel. A máquina de paragem de Alan Turing (1936) é uma quine que pergunta a si própria se pára e faz o contrário. Hofstadter dedicou oitocentas páginas de Gödel, Escher, Bach a mostrar que o ADN, os cânones de J. S. Bach e as mãos a desenhar-se de Escher são todos o mesmo truque diagonal. As quines são o motor; incompletude, indecidibilidade e autorreplicação são o que cai quando o fazes girar.",
    },
  ],
  figureCaption: "Uma quine Python de duas linhas. Executa-a; imprime-se a si própria.",
  figureSub: "Guarda a saída num ficheiro, executa de novo, obténs o mesmo texto — para quantas gerações quiseres.",
  closingPretitle: "Constrói uma",
  closingTitle: "Abre o Explorador.",
  closingBody:
    "O Explorador mostra uma quine real em Python e uma real em Lisp lado a lado, simula fielmente a sua execução no browser e deixa-te mutar um único carácter para ver a propriedade de autoigualdade colapsar. Autorreferência, desmontada e remontada.",
  ctaLabel: "→ Abrir o Explorador",
};

// ---------------- Svenska ----------------
const sv: RichStory = {
  page: {
    pretitle: "Ämne · Beräkning",
    title: "Quinen",
    tagline: "Ett program vars enda utdata är dess egen källkod.",
    intro:
      "Skriv ett program som skriver ut sig självt, tecken för tecken, utan att läsa sin egen fil. Låter omöjligt: programmet skulle behöva innehålla sin egen listning, inklusive den del som innehåller listningen. Kleenes rekursionssats (1938) säger att det är möjligt i varje språk som är tillräckligt uttrycksfullt för att prata om sina egna program: varje beräkningsbar transformation av program har en fixpunkt. Quiner är den fixpunkten gjord konkret, och de är samma självreferensmotor som driver Gödels ofullständighetsbevis och Turings stoppargument.",
    ctaInteractive: "→ Öppna Explorern",
  },
  encounter: {
    pretitle: "Första mötet",
    title: "Skriv ut dig själv, exakt.",
    cards: [
      {
        label: "01",
        title: "Den omöjliga övningen",
        body: "Skriv ett program vars utdata är identisk med dess egen källkod. Inget fusk: ingen filläsning, inget «cat $0», inga miljötrix. Bara instruktioner inuti programmet som råkar skriva ut just de instruktionerna igen. De flesta försöker en gång, ger upp och drar slutsatsen att det är en paradox.",
      },
      {
        label: "02",
        title: "Det fungerar faktiskt",
        body: "Välj nästan vilket modernt språk som helst och en enradig quine finns. Tricket: en datatabell som beskriver koden, och kod som skriver ut både tabellen och sig själv renderad genom tabellen. De två halvorna är varandras spegelbild, och fixpunkten för den ömsesidiga speglingen är koden du skrev.",
      },
      {
        label: "03",
        title: "Varför det spelar roll",
        body: "Kleenes rekursionssats (1938) säger att varje effektiv transformation av program har en fixpunkt. Quiner är det enklaste icke-triviala exemplet — och Gödels mening «jag är obevisbar», Turings diagonala stoppmaskin, biologisk självreplikering och datorvirus är alla samma trick i olika kostymer.",
      },
    ],
    tryIt: "Bygg en. Se den skriva ut sig själv. Ändra en enda byte och se hur självlikheten brister.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den omöjliga självutskriften",
      title: "Varför det naiva angreppssättet misslyckas",
      body: "Ditt första försök är print('print(\"…\")'). Men vad står mellan citationstecknen? Det måste innehålla print-satsen, som måste innehålla sitt argument, som måste innehålla print-satsen… regressen når aldrig botten. Varje program som försöker bokstavligen bädda in sin fullständiga källkod är för evigt ett tecken kort av sig självt. Utmaningen är att bryta den oändliga nedstigningen utan att fuska — utan att läsa sin egen fil från disk och utan att använda introspektionsfaciliteter som räcker dig källkoden på silverfat.",
    },
    {
      pretitle: "Avsnitt 02 · Kleenes rekursionssats",
      title: "Varje effektiv transformation har en fixpunkt",
      body: "Stephen Cole Kleene (1938) bevisade ett djupt resultat om beräkningsbara funktioner: för varje beräkningsbar f som tar ett program och producerar ett program finns ett program p så att p och f(p) beter sig identiskt. Välj f som «funktionen som, givet ett program, returnerar ett som skriver ut det programmet» — dess fixpunkt är ett program vars beteende är att skriva ut sig självt. Quiner är inte ett smart hack; de garanteras av en sats.",
    },
    {
      pretitle: "Avsnitt 03 · Konstruktionstricket",
      title: "Dela programmet i datablad och skrivare",
      body: "Varje fungerande quine har två halvor. Datahalvan är en sträng-literal som beskriver kodhalvan. Kodhalvan läser data och skriver ut det två gånger — en gång som citerad sträng (vilket återskapar datahalvan) och en gång som rå kod (vilket återskapar kodhalvan). Strängen innehåller en platshållare där den förväntar sig se sig själv. Det eval-och-quote-paret är motorn: data beskriver kod, kod bygger upp data igen. Lisp-programmerare kallar det quasi-quote-dansen; samma form dyker upp i varje språk som kan manipulera sina egna representationer.",
    },
    {
      pretitle: "Avsnitt 04 · En riktig, kort, körbar quine",
      title: "Python på två rader",
      body: "Den läsbaraste quinen i Python är två satser: bind en formatsträngsmall till s, skriv sedan ut s formaterat med sig självt. %r i mallen tvingar Python att åter-emittera strängen med sina citattecken intakta — just den enda biten självmedveten formatering är vad som stänger slingan. Kör programmet, kopiera utdata, spara, kör igen: du får samma text. Samma form fungerar i C, JavaScript, Haskell, Ruby och Lisp — operatornamnen byts, arkitekturen inte.",
    },
    {
      pretitle: "Avsnitt 05 · Virus, maskar och Trusting Trust",
      title: "Självreferens som attackyta",
      body: "Ett datorvirus är en quine med extra last: kod som kopierar sig själv, sedan gör något annat. Varje klassiskt virus och mask — Morris (1988), ILOVEYOU (2000), Stuxnets spridningslager — har en quine i kärnan. 1984 visade Ken Thompsons Turing-tal (Reflections on Trusting Trust) något mörkare: en kompilator kan vara en quine som infogar en bakdörr vid varje build, även i en ren omkompilering av sig själv. Bakdörren visas aldrig i källkoden. Talet är grunddokumentet för leveranskedjesäkerhet och forskning om reproducerbara builds.",
    },
    {
      pretitle: "Avsnitt 06 · Gödel, stopp och ofullständighetens motor",
      title: "Självreferens hela vägen ner",
      body: "Kurt Gödels mening från 1931 «jag är obevisbar» är en quine i formell logik: ett aritmetiskt påstående konstruerat via diagonallemmat för att referera till sitt eget Gödel-nummer. Alan Turings stoppmaskin (1936) är en quine som frågar sig själv om den stannar och gör motsatsen. Hofstadter använde åttahundra sidor av Gödel, Escher, Bach till att visa att DNA, J. S. Bachs kanoner och Eschers ritande händer alla är samma diagonaltrick. Quiner är motorn; ofullständighet, oavgörbarhet och självreplikering är vad som faller ut när du vrider på den.",
    },
  ],
  figureCaption: "En tvåradig Python-quine. Kör den; den skriver ut sig själv.",
  figureSub: "Spara utdata till en fil, kör igen, få samma text — för hur många generationer du vill.",
  closingPretitle: "Bygg en själv",
  closingTitle: "Öppna Utforskaren.",
  closingBody:
    "Utforskaren visar en riktig Python-quine och en riktig Lisp-quine sida vid sida, simulerar troget deras exekvering i webbläsaren och låter dig mutera ett enda tecken för att se självlikhetsegenskapen kollapsa. Självreferens, isärtagen och hopsatt igen.",
  ctaLabel: "→ Öppna Utforskaren",
};

// ---------------- Norsk ----------------
const no: RichStory = {
  page: {
    pretitle: "Tema · Beregning",
    title: "Quinen",
    tagline: "Et program hvis eneste utdata er dets egen kildekode.",
    intro:
      "Skriv et program som skriver seg selv ut, tegn for tegn, uten å lese sin egen fil. Høres umulig ut: programmet måtte inneholde sin egen listing, inkludert delen som inneholder listingen. Kleenes rekursjonssetning (1938) sier at det er mulig i ethvert språk som er uttrykksfullt nok til å snakke om sine egne programmer: hver beregnbar transformasjon av programmer har et fikspunkt. Quiner er det fikspunktet gjort konkret, og de er den samme selvreferansemotoren som driver Gödels ufullstendighetsbevis og Turings stoppargument.",
    ctaInteractive: "→ Åpne Utforskeren",
  },
  encounter: {
    pretitle: "Første møte",
    title: "Skriv deg selv ut, eksakt.",
    cards: [
      {
        label: "01",
        title: "Den umulige øvelsen",
        body: "Skriv et program hvis utdata er identisk med dets egen kildekode. Ingen juks: ingen fillesing, ingen «cat $0», ingen miljøtriks. Bare instruksjoner inni programmet som tilfeldigvis skriver ut akkurat de instruksjonene igjen. De fleste prøver én gang, gir opp og konkluderer med at det er et paradoks.",
      },
      {
        label: "02",
        title: "Det fungerer faktisk",
        body: "Velg nesten et hvilket som helst moderne språk og det finnes en enradet quine. Trikset: en datatabell som beskriver koden, og kode som skriver ut både tabellen og seg selv rendret gjennom tabellen. De to halvdelene er hverandres speilbilde, og fikspunktet i denne gjensidige speilingen er koden du skrev.",
      },
      {
        label: "03",
        title: "Hvorfor det betyr noe",
        body: "Kleenes rekursjonssetning (1938) sier at hver effektiv transformasjon av programmer har et fikspunkt. Quiner er det enkleste ikke-trivielle eksempelet — og Gödels setning «jeg er ubevisbar», Turings diagonale stoppmaskin, biologisk selvreplikering og datavirus er alle det samme trikset i forskjellige kostymer.",
      },
    ],
    tryIt: "Bygg én. Se den skrive seg selv ut. Endre én byte og se hvordan selvlikheten brister.",
  },
  sections: [
    {
      pretitle: "Avsnitt 01 · Den umulige selvutskriften",
      title: "Hvorfor den naive tilnærmingen feiler",
      body: "Ditt første forsøk er print('print(\"…\")'). Men hva står mellom anførselstegnene? Det må inneholde print-utsagnet, som må inneholde sitt argument, som må inneholde print-utsagnet… regressen treffer aldri bunnen. Hvert program som prøver bokstavelig talt å bygge inn sin fulle kildekode er for evig ett tegn kort av seg selv. Utfordringen er å bryte den uendelige nedstigningen uten å jukse — uten å lese sin egen fil fra disk og uten å bruke introspeksjonsfasiliteter som rekker deg kildekoden på sølvfat.",
    },
    {
      pretitle: "Avsnitt 02 · Kleenes rekursjonssetning",
      title: "Hver effektive transformasjon har et fikspunkt",
      body: "Stephen Cole Kleene (1938) beviste et dypt resultat om beregnbare funksjoner: for hver beregnbar f som tar et program og produserer et program, finnes det et program p slik at p og f(p) oppfører seg identisk. Velg f som «funksjonen som, gitt et hvilket som helst program, returnerer ett som skriver ut det programmet» — dets fikspunkt er et program hvis atferd er å skrive seg selv ut. Quiner er ikke et smart hack; de er garantert av et teorem.",
    },
    {
      pretitle: "Avsnitt 03 · Konstruksjonstrikset",
      title: "Del programmet i dataark og skriver",
      body: "Hver fungerende quine har to halvdeler. Datahalvdelen er en streng-literal som beskriver kodehalvdelen. Kodehalvdelen leser dataene og skriver dem ut to ganger — én gang som sitert streng (som gjenskaper datahalvdelen) og én gang som rå kode (som gjenskaper kodehalvdelen). Strengen inneholder en plassholder der den forventer å se seg selv. Det eval-og-sitat-paret er motoren: data beskriver kode, kode bygger opp data igjen. Lisp-programmerere kjenner det som kvasi-sitat-dansen; den samme formen dukker opp i hvert språk som kan manipulere sine egne representasjoner.",
    },
    {
      pretitle: "Avsnitt 04 · En ekte, kort, kjørbar quine",
      title: "Python på to linjer",
      body: "Den mest lesbare quinen i Python er to utsagn: bind en formatstrengmal til s, skriv så ut s formatert med seg selv. %r i malen tvinger Python til å re-emittere strengen med anførselstegnene intakte — akkurat den ene biten av selvbevisst formatering er det som lukker sløyfen. Kjør programmet, kopier utdata, lagre, kjør igjen: du får den samme teksten. Den samme formen fungerer i C, JavaScript, Haskell, Ruby og Lisp — operatornavnene endres, arkitekturen ikke.",
    },
    {
      pretitle: "Avsnitt 05 · Virus, ormer og Trusting Trust",
      title: "Selvreferanse som angrepsoverflate",
      body: "Et datavirus er en quine med ekstra last: kode som kopierer seg selv, og deretter gjør noe annet. Hvert klassisk virus og orm — Morris (1988), ILOVEYOU (2000), Stuxnets spredningslag — har en quine i kjernen. I 1984 viste Ken Thompsons Turing-tale (Reflections on Trusting Trust) noe mørkere: en kompilator kan være en quine som setter inn en bakdør ved hver build, også i en ren rekompilering av seg selv. Bakdøren dukker aldri opp i kildekoden. Talen er grunnlagsdokumentet for forsyningskjedesikkerhet og forskning på reproduserbare builds.",
    },
    {
      pretitle: "Avsnitt 06 · Gödel, stopp og ufullstendighetens motor",
      title: "Selvreferanse hele veien ned",
      body: "Kurt Gödels setning fra 1931 «jeg er ubevisbar» er en quine i formell logikk: et aritmetisk utsagn konstruert via diagonal-lemmaet for å vise til sitt eget Gödel-tall. Alan Turings stoppmaskin (1936) er en quine som spør seg selv om den stopper og gjør det motsatte. Hofstadter brukte åtte hundre sider av Gödel, Escher, Bach på å vise at DNA, J. S. Bachs kanoner og Eschers tegnende hender alle er det samme diagonaltrikset. Quiner er motoren; ufullstendighet, uavgjørbarhet og selvreplikering er det som faller ut når du vrir på den.",
    },
  ],
  figureCaption: "En tolinjes Python-quine. Kjør den; den skriver seg selv ut.",
  figureSub: "Lagre utdata til en fil, kjør igjen, få samme tekst — i så mange generasjoner du vil.",
  closingPretitle: "Bygg én selv",
  closingTitle: "Åpne Utforskeren.",
  closingBody:
    "Utforskeren viser en ekte Python-quine og en ekte Lisp-quine side om side, simulerer trofast utførelsen deres i nettleseren og lar deg mutere ett enkelt tegn for å se selvlikhetsegenskapen kollapse. Selvreferanse, demontert og satt sammen igjen.",
  ctaLabel: "→ Åpne Utforskeren",
};

const RICH_STORY: Record<Locale, RichStory> = { en, de, es, fr, it, pt, sv, no };

// --------------------------------------------------------------------------

export default function QuineStory() {
  const { locale } = useI18n();
  const story = RICH_STORY[locale];
  const page: StoryPage = { ...story.page, sections: [] };

  return (
    <StoryPageShell
      page={page}
      ctaHref="/quine/explorer"
      accent={ACCENT}
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="p ↦ print(p)"
      formulaLatex={"\\lambda f.\\;(\\lambda x.\\,f(xx))(\\lambda x.\\,f(xx))"}
      finalLabel={story.closingTitle}
      signature={<QuineSignatureHero />}
    >
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

      {/* Section 01 — naive impossibility */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[0].pretitle}
          title={story.sections[0].title}
          body={story.sections[0].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 02 — Kleene */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[1].pretitle}
          title={story.sections[1].title}
          body={story.sections[1].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 03 — Construction trick */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[2].pretitle}
          title={story.sections[2].title}
          body={story.sections[2].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 04 — Canonical Python quine + inline figure */}
      <section className="mx-auto mb-32 max-w-4xl space-y-8">
        <StoryCard
          pretitle={story.sections[3].pretitle}
          title={story.sections[3].title}
          body={story.sections[3].body}
          accent={ACCENT}
        />
        <Reveal delay={120}>
          <figure className="glass hairline space-y-4 rounded-2xl border bg-ink-950/50 p-6 md:p-8">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {story.figureCaption}
            </div>
            <pre className="overflow-x-auto rounded-md bg-ink-950/80 p-5 font-mono text-[13px] leading-relaxed text-ink-100">
              <code>{PYTHON_QUINE}</code>
            </pre>
            <figcaption className="text-xs leading-relaxed text-ink-300">
              {story.figureSub}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Section 05 — Viruses + Trusting Trust */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[4].pretitle}
          title={story.sections[4].title}
          body={story.sections[4].body}
          accent={ACCENT}
        />
      </section>

      {/* Section 06 — Gödel & Halting */}
      <section className="mx-auto mb-32 max-w-4xl">
        <StoryCard
          pretitle={story.sections[5].pretitle}
          title={story.sections[5].title}
          body={story.sections[5].body}
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
            href="/quine/explorer"
            className="inline-block rounded-full border border-signal-cyan/70 bg-signal-cyan/10 px-8 py-4 font-mono text-sm uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/25"
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
    <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-cyan/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
