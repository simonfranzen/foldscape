import type { ExplorerGuide } from "./types";

// Numbers quoted here (16 x 16 table, 700 ms default, 50 to 1500 ms range,
// the two flip rules) match app/cantor/explorer/page.tsx; update both together.
const FLIP_EXCERPT = `function flipDigit(d, strategy, source) {
  if (source === "binary") return d === 0 ? 1 : 0;
  if (strategy === "swap56") {
    if (d === 5) return 6;
    if (d === 6) return 5;
    return 5;                    // anything else becomes 5
  }
  // +1 mod 10, skipping 0 and 9 (and equal-to-d)
  let next = (d + 1) % 10;
  for (let safety = 0; safety < 10; safety++) {
    if (next !== d && next !== 0 && next !== 9) return next;
    next = (next + 1) % 10;
  }
}

// digit i of s comes from the diagonal cell (i, i)
for (let i = 0; i < step; i++) out.push(flipDigit(table[i][i], strategy, source));`;

// The quantifier wording is the only translated part of the formula.
const diagonalFormula = (forEvery: string) =>
  `s_n \\neq d_{nn} \\text{ ${forEvery} } n \\;\\Rightarrow\\; s \\neq r_n \\text{ ${forEvery} } n`;

export const CANTOR_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Step through Cantor's diagonal argument on a 16 × 16 table of decimals, build the missing number digit by digit and see why the real numbers are uncountable.",
    heading: "How this explorer works",
    intro:
      "The table is a list of sixteen real numbers between 0 and 1, each written out to sixteen digits after the decimal point. Pretend it is the start of a list meant to contain every real number in that interval. Each press of Step looks at one cell on the diagonal (digit 1 of row 1, digit 2 of row 2, and so on), changes that digit, and appends the result to a new number s at the bottom. When the diagonal is used up, s disagrees with every row somewhere, so it cannot be on the list. That is Cantor's diagonal argument.",
    sections: [
      {
        heading: "The argument",
        paragraphs: [
          "A set is countable if its elements can be arranged in a list r₁, r₂, r₃, … in which every element eventually appears. The integers and even the fractions are countable. Georg Cantor showed in 1874 that the real numbers are not, and in 1891 he published the much shorter diagonal proof that this explorer animates.",
          "Suppose someone hands you a complete list of the reals in [0, 1]. Write the n-th digit of rₙ as dₙₙ and build s so that its n-th digit is something other than dₙₙ. Then s differs from r₁ in the first digit, from r₂ in the second, and in general from rₙ in the n-th. No row can equal s, yet s is clearly a real number between 0 and 1. The list was not complete after all, and since the list was arbitrary, no complete list exists.",
        ],
        formula:
          "s_n \\neq d_{nn} \\text{ for every } n \\;\\Rightarrow\\; s \\neq r_n \\text{ for every } n",
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "Step adds one digit of s, Play adds them automatically, and Reset clears s and starts again. The speed slider sets the pause between automatic steps, from 1500 ms down to 50 ms; the default is 700 ms. The amber cell is the diagonal digit being used right now, the faint amber cells have already been used, and the column on the right records each comparison as sₙ ≠ dₙₙ. After the sixteenth digit the contradiction panel appears and rows can be highlighted by hover or keyboard focus.",
          "Number source chooses where the table comes from. Decimal fills it with pseudo-random digits, Binary with pseudo-random zeros and ones, and the reshuffle button draws a new table. Custom lets you type one decimal per line. The prefilled custom list starts with the digits of π, e, √2, the golden ratio, ln 2 and the Euler-Mascheroni constant, shifted behind the decimal point.",
          "The digit-change rule decides how dₙₙ is altered. Swap 5 ↔ 6 turns a 5 into a 6 and every other digit into a 5. +1 mod 10 adds one but skips 0 and 9, so an 8 or a 9 becomes 1. In binary mode the rule is ignored and bits simply flip between 0 and 1; the rows are then treated as 0/1 sequences, not numbers (the prefix «0.» is dropped).",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "There is no canvas: the table is an ordinary HTML table, so screen readers can walk through it. The random tables come from a small linear congruential generator (multiplier 1664525, increment 1013904223, modulo 2³²) seeded with a number that changes when you reshuffle.",
          "The digits of s are not stored as state at all. The component keeps only the current step and recomputes s from the table on every render by reading the diagonal and applying the chosen rule. Changing the source, the rule or a custom line therefore resets the step. Play is a plain interval timer that advances the step. The only continuous animation is a gentle pulse on the newest digit, which the site-wide reduced-motion rule switches off.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Why avoid 0 and 9",
        paragraphs: [
          "Some real numbers have two decimal expansions: 0.4999… and 0.5000… are the same number. If s ended in an endless run of 9s, it could coincide with a listed number written with trailing 0s, even though the two disagree digit by digit, and the proof would break. Choosing replacement digits that are never 0 or 9 rules this out, because an expansion with no 0s and no 9s is the only way to write that number. Both decimal rules respect this. In binary the same trap exists (0.0111… equals 0.1000…), and flipping bits cannot avoid it. So in binary mode the explorer does what the textbook does: it argues with infinite 0/1 sequences rather than with real numbers, and its conclusion is that there are more such sequences than natural numbers.",
          "Keep in mind that sixteen rows are only an illustration. A finite list can always be beaten by brute force; the strength of the argument is that the same recipe defeats an infinite list, because row n is checked at digit n no matter how far down it sits.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Watch s escape",
        text: "Keep the decimal source and Swap 5 ↔ 6, press Play, and follow the amber cell down the diagonal.",
      },
      {
        title: "Try to trap s",
        text: "Switch to Custom and make row 1 start with 5, row 2 with 05, row 3 with 005, and so on. With Swap 5 ↔ 6 every diagonal 5 becomes a 6, so s = 0.666… slips past every row anyway.",
      },
      {
        title: "Compare the two rules",
        text: "Run the same table once with Swap 5 ↔ 6 and once with +1 mod 10. You get two different numbers s, both missing from the list. The proof yields as many missing reals as you like.",
      },
      {
        title: "Binary mode",
        text: "Choose Binary and step through. Each diagonal bit is flipped, and s is a 0/1 sequence that is missing from the list. Note that the panel now speaks of sequences, not numbers, because of the 0.0111… = 0.1000… caveat from above.",
      },
    ],
  },
  de: {
    metaDescription:
      "Cantors Diagonalargument Schritt für Schritt: in einer 16 × 16 Tabelle die fehlende Zahl Ziffer für Ziffer bauen und sehen, warum ℝ überabzählbar ist.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Die Tabelle ist eine Liste von sechzehn reellen Zahlen zwischen 0 und 1, jede mit sechzehn Nachkommastellen ausgeschrieben. Stell dir vor, das ist der Anfang einer Liste, die jede reelle Zahl aus diesem Intervall enthalten soll. Jeder Druck auf Step schaut sich eine Zelle auf der Diagonale an (Ziffer 1 von Zeile 1, Ziffer 2 von Zeile 2 und so weiter), verändert diese Ziffer und hängt das Ergebnis an eine neue Zahl s unten an. Ist die Diagonale verbraucht, weicht s von jeder Zeile irgendwo ab und kann deshalb nicht in der Liste stehen. Das ist Cantors Diagonalargument.",
    sections: [
      {
        heading: "Das Argument",
        paragraphs: [
          "Eine Menge heißt abzählbar, wenn man ihre Elemente in eine Liste r₁, r₂, r₃, … schreiben kann, in der jedes Element irgendwann vorkommt. Die ganzen Zahlen und sogar die Brüche sind abzählbar. Georg Cantor zeigte 1874, dass die reellen Zahlen es nicht sind, und veröffentlichte 1891 den viel kürzeren Diagonalbeweis, den dieser Explorer animiert.",
          "Angenommen, jemand gibt dir eine vollständige Liste der reellen Zahlen in [0, 1]. Nenne die n-te Ziffer von rₙ einfach dₙₙ und baue s so, dass seine n-te Ziffer nicht dₙₙ ist. Dann unterscheidet sich s von r₁ in der ersten Ziffer, von r₂ in der zweiten und allgemein von rₙ in der n-ten. Keine Zeile kann gleich s sein, und doch ist s eindeutig eine reelle Zahl zwischen 0 und 1. Die Liste war also nicht vollständig, und weil sie beliebig war, gibt es keine vollständige Liste.",
        ],
        formula:
          "s_n \\neq d_{nn} \\text{ für alle } n \\;\\Rightarrow\\; s \\neq r_n \\text{ für alle } n",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Step fügt eine Ziffer von s hinzu, Play erledigt das automatisch, und Reset löscht s und fängt neu an. Der Geschwindigkeitsregler legt die Pause zwischen den automatischen Schritten fest, von 1500 ms bis hinunter zu 50 ms; voreingestellt sind 700 ms. Die bernsteinfarbene Zelle ist die Diagonalziffer, die gerade verwendet wird, die blasseren sind schon verbraucht, und die Spalte rechts protokolliert jeden Vergleich als sₙ ≠ dₙₙ. Nach der sechzehnten Ziffer erscheint der Widerspruch, und die Zeilen lassen sich per Maus oder Tastatur hervorheben.",
          "Die Zahlenquelle bestimmt, woher die Tabelle kommt. Decimal füllt sie mit pseudozufälligen Ziffern, Binary mit pseudozufälligen Nullen und Einsen, und der Mischen-Knopf zieht eine neue Tabelle. Bei Custom tippst du eine Dezimalzahl pro Zeile ein. Die vorausgefüllte Liste beginnt mit den Ziffern von π, e, √2, dem goldenen Schnitt, ln 2 und der Euler-Mascheroni-Konstante, jeweils hinter das Komma verschoben.",
          "Die Änderungsregel bestimmt, wie dₙₙ verändert wird. Swap 5 ↔ 6 macht aus einer 5 eine 6 und aus jeder anderen Ziffer eine 5. +1 mod 10 zählt eins dazu, überspringt aber 0 und 9, aus einer 8 oder 9 wird also eine 1. Im Binärmodus wird die Regel ignoriert, und die Bits wechseln einfach zwischen 0 und 1; die Zeilen gelten dann als 0/1-Folgen, nicht als Zahlen (das vorangestellte «0.» entfällt).",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Es gibt kein Canvas: Die Tabelle ist eine gewöhnliche HTML-Tabelle, Screenreader können sie also durchgehen. Die Zufallstabellen stammen aus einem kleinen linearen Kongruenzgenerator (Faktor 1664525, Inkrement 1013904223, modulo 2³²), dessen Startwert sich beim Mischen ändert.",
          "Die Ziffern von s werden gar nicht als Zustand gespeichert. Die Komponente merkt sich nur den aktuellen Schritt und berechnet s bei jedem Rendern neu aus der Tabelle, indem sie die Diagonale liest und die gewählte Regel anwendet. Deshalb setzt ein Wechsel der Quelle, der Regel oder einer eigenen Zeile den Schritt zurück. Play ist ein einfacher Intervall-Timer, der den Schritt weiterzählt. Die einzige Daueranimation ist ein sanftes Pulsieren der neuesten Ziffer, das die seitenweite Regel für reduzierte Bewegung abschaltet.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Warum 0 und 9 tabu sind",
        paragraphs: [
          "Manche reellen Zahlen haben zwei Dezimaldarstellungen: 0,4999… und 0,5000… sind dieselbe Zahl. Endete s mit lauter Neunen, könnte es mit einer gelisteten Zahl übereinstimmen, die mit Nullen endet, obwohl beide sich Ziffer für Ziffer unterscheiden, und der Beweis bräche zusammen. Ersatzziffern, die nie 0 oder 9 sind, schließen das aus, denn eine Darstellung ganz ohne 0 und 9 ist die einzige Schreibweise dieser Zahl. Beide Dezimalregeln halten sich daran. Im Binären gibt es dieselbe Falle (0,0111… ist gleich 0,1000…), und durch Umdrehen von Bits lässt sie sich nicht vermeiden. Deshalb macht es der Explorer im Binärmodus wie das Lehrbuch: Er argumentiert mit unendlichen 0/1-Folgen statt mit reellen Zahlen und folgert, dass es mehr solche Folgen als natürliche Zahlen gibt.",
          "Denk daran, dass sechzehn Zeilen nur eine Illustration sind. Eine endliche Liste lässt sich immer mit roher Gewalt schlagen. Die Stärke des Arguments ist, dass dasselbe Rezept auch eine unendliche Liste besiegt, weil Zeile n an Ziffer n geprüft wird, egal wie weit unten sie steht.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Sieh zu, wie s entkommt",
        text: "Bleib bei der Dezimalquelle und Swap 5 ↔ 6, drück Play und folge der bernsteinfarbenen Zelle die Diagonale hinunter.",
      },
      {
        title: "Versuch, s zu fangen",
        text: "Wechsle zu Custom und lass Zeile 1 mit 5 beginnen, Zeile 2 mit 05, Zeile 3 mit 005 und so weiter. Mit Swap 5 ↔ 6 wird jede 5 auf der Diagonale zur 6, und s = 0,666… schlüpft trotzdem an jeder Zeile vorbei.",
      },
      {
        title: "Die beiden Regeln vergleichen",
        text: "Lass dieselbe Tabelle einmal mit Swap 5 ↔ 6 und einmal mit +1 mod 10 laufen. Du bekommst zwei verschiedene Zahlen s, beide fehlen in der Liste. Der Beweis liefert so viele fehlende reelle Zahlen, wie du willst.",
      },
      {
        title: "Binärmodus",
        text: "Wähle Binary und geh Schritt für Schritt durch. Jedes Diagonalbit wird umgedreht, und s ist eine 0/1-Folge, die in der Liste fehlt. Achte darauf, dass das Panel jetzt von Folgen spricht, nicht von Zahlen, wegen des Hakens mit 0,0111… = 0,1000… von oben.",
      },
    ],
  },
  es: {
    metaDescription:
      "Recorre el argumento diagonal de Cantor en una tabla de 16 × 16: construye el número que falta dígito a dígito y mira por qué los reales no son numerables.",
    heading: "Cómo funciona este explorador",
    intro:
      "La tabla es una lista de dieciséis números reales entre 0 y 1, cada uno escrito con dieciséis cifras decimales. Imagina que es el comienzo de una lista que pretende contener todos los números reales de ese intervalo. Cada pulsación de Paso mira una celda de la diagonal (el dígito 1 de la fila 1, el dígito 2 de la fila 2, y así sucesivamente), cambia ese dígito y añade el resultado a un número nuevo s, abajo. Cuando se agota la diagonal, s discrepa de cada fila en algún lugar, así que no puede estar en la lista. Ese es el argumento diagonal de Cantor.",
    sections: [
      {
        heading: "El argumento",
        paragraphs: [
          "Un conjunto es numerable si sus elementos pueden ordenarse en una lista r₁, r₂, r₃, … en la que cada elemento acaba apareciendo. Los enteros e incluso las fracciones son numerables. Georg Cantor demostró en 1874 que los números reales no lo son, y en 1891 publicó la demostración diagonal, mucho más corta, que este explorador anima.",
          "Supón que alguien te entrega una lista completa de los reales en [0, 1]. Llama dₙₙ al n-ésimo dígito de rₙ y construye s de modo que su n-ésimo dígito sea distinto de dₙₙ. Entonces s difiere de r₁ en el primer dígito, de r₂ en el segundo y, en general, de rₙ en el n-ésimo. Ninguna fila puede ser igual a s y, sin embargo, s es claramente un número real entre 0 y 1. La lista no estaba completa después de todo y, como era arbitraria, no existe ninguna lista completa.",
        ],
        formula: diagonalFormula("para todo"),
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Paso añade un dígito de s, Reproducir los añade automáticamente y Reiniciar borra s y vuelve a empezar. El deslizador de velocidad fija la pausa entre pasos automáticos, desde 1500 ms hasta 50 ms; el valor por defecto es 700 ms. La celda ámbar es el dígito diagonal que se está usando ahora mismo, las celdas de ámbar tenue ya se han usado, y la columna de la derecha registra cada comparación como sₙ ≠ dₙₙ. Tras el decimosexto dígito aparece el panel de la contradicción, y las filas pueden resaltarse pasando el ratón o con el foco del teclado.",
          "Fuente de números elige de dónde sale la tabla. Decimal la llena de dígitos pseudoaleatorios, Binario de ceros y unos pseudoaleatorios, y el botón de rebarajar saca una tabla nueva. Personal te deja escribir un decimal por línea. La lista personal que viene rellenada empieza con las cifras de π, e, √2, el número áureo, ln 2 y la constante de Euler-Mascheroni, desplazadas detrás de la coma decimal.",
          "La regla de cambio de dígito decide cómo se altera dₙₙ. Cambiar 5 ↔ 6 convierte un 5 en un 6 y cualquier otro dígito en un 5. +1 mod 10 suma uno pero se salta el 0 y el 9, así que un 8 o un 9 se convierten en 1. En modo binario la regla se ignora y los bits simplemente alternan entre 0 y 1; las filas se tratan entonces como sucesiones de 0 y 1, no como números (se omite el prefijo «0.»).",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "No hay canvas: la tabla es una tabla HTML corriente, de modo que los lectores de pantalla pueden recorrerla. Las tablas aleatorias salen de un pequeño generador lineal congruencial (multiplicador 1664525, incremento 1013904223, módulo 2³²) cuya semilla es un número que cambia cuando rebarajas.",
          "Los dígitos de s no se guardan como estado. El componente solo conserva el paso actual y recalcula s a partir de la tabla en cada renderizado, leyendo la diagonal y aplicando la regla elegida. Por eso, cambiar la fuente, la regla o una línea personal reinicia el paso. Reproducir es un simple temporizador de intervalo que hace avanzar el paso. La única animación continua es un pulso suave en el dígito más reciente, que la regla de movimiento reducido de todo el sitio desactiva.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Por qué evitar el 0 y el 9",
        paragraphs: [
          "Algunos números reales tienen dos desarrollos decimales: 0,4999… y 0,5000… son el mismo número. Si s terminara en una ristra infinita de nueves, podría coincidir con un número de la lista escrito con ceros al final, aunque los dos discrepen dígito a dígito, y la demostración se vendría abajo. Elegir dígitos de reemplazo que nunca sean 0 ni 9 lo descarta, porque un desarrollo sin ceros ni nueves es la única manera de escribir ese número. Las dos reglas decimales lo respetan. En binario existe la misma trampa (0,0111… es igual a 0,1000…), y voltear bits no puede evitarla. Así que en modo binario el explorador hace lo que hace el libro de texto: razona con sucesiones infinitas de 0 y 1 en lugar de con números reales, y su conclusión es que hay más sucesiones de ese tipo que números naturales.",
          "Ten presente que dieciséis filas son solo una ilustración. A una lista finita siempre se la puede vencer por fuerza bruta; la fuerza del argumento es que la misma receta derrota a una lista infinita, porque la fila n se comprueba en el dígito n por muy abajo que esté.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Mira cómo escapa s",
        text: "Mantén la fuente decimal y Cambiar 5 ↔ 6, pulsa Reproducir y sigue la celda ámbar diagonal abajo.",
      },
      {
        title: "Intenta atrapar a s",
        text: "Cambia a Personal y haz que la fila 1 empiece por 5, la fila 2 por 05, la fila 3 por 005, y así sucesivamente. Con Cambiar 5 ↔ 6 cada 5 de la diagonal se convierte en 6, así que s = 0,666… se escabulle de todas las filas igualmente.",
      },
      {
        title: "Compara las dos reglas",
        text: "Recorre la misma tabla una vez con Cambiar 5 ↔ 6 y otra con +1 mod 10. Obtienes dos números s distintos, y ambos faltan en la lista. La demostración produce tantos reales ausentes como quieras.",
      },
      {
        title: "Modo binario",
        text: "Elige Binario y avanza paso a paso. Cada bit de la diagonal se voltea, y s es una sucesión de 0 y 1 que falta en la lista. Fíjate en que el panel habla ahora de sucesiones, no de números, por la salvedad 0,0111… = 0,1000… de más arriba.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Suis l'argument diagonal de Cantor pas à pas dans un tableau 16 × 16 : construis le nombre manquant chiffre par chiffre et vois pourquoi ℝ est indénombrable.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Le tableau est une liste de seize nombres réels compris entre 0 et 1, chacun écrit avec seize chiffres après la virgule. Fais comme si c'était le début d'une liste censée contenir tous les nombres réels de cet intervalle. Chaque appui sur Pas examine une case de la diagonale (le chiffre 1 de la ligne 1, le chiffre 2 de la ligne 2, et ainsi de suite), modifie ce chiffre et ajoute le résultat à un nouveau nombre s, en bas. Une fois la diagonale épuisée, s diffère de chaque ligne quelque part : il ne peut donc pas figurer dans la liste. C'est l'argument diagonal de Cantor.",
    sections: [
      {
        heading: "L'argument",
        paragraphs: [
          "Un ensemble est dénombrable si l'on peut ranger ses éléments dans une liste r₁, r₂, r₃, … où chaque élément finit par apparaître. Les entiers et même les fractions sont dénombrables. Georg Cantor a montré en 1874 que les nombres réels ne le sont pas, et il a publié en 1891 la démonstration diagonale, bien plus courte, que cet explorateur anime.",
          "Suppose qu'on te remette une liste complète des réels de [0, 1]. Note dₙₙ le n-ième chiffre de rₙ et construis s de sorte que son n-ième chiffre soit autre chose que dₙₙ. Alors s diffère de r₁ par le premier chiffre, de r₂ par le deuxième et, plus généralement, de rₙ par le n-ième. Aucune ligne ne peut être égale à s, et pourtant s est bel et bien un nombre réel compris entre 0 et 1. La liste n'était donc pas complète, et comme elle était quelconque, il n'existe aucune liste complète.",
        ],
        formula: diagonalFormula("pour tout"),
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Pas ajoute un chiffre à s, Lecture les ajoute automatiquement, et Réinitialiser efface s et recommence. Le curseur de vitesse règle la pause entre deux pas automatiques, de 1500 ms jusqu'à 50 ms ; la valeur par défaut est 700 ms. La case ambrée est le chiffre diagonal utilisé en ce moment, les cases d'un ambre plus pâle ont déjà servi, et la colonne de droite consigne chaque comparaison sous la forme sₙ ≠ dₙₙ. Après le seizième chiffre, le panneau de la contradiction apparaît et les lignes peuvent être mises en évidence au survol ou au focus clavier.",
          "Source des nombres choisit d'où vient le tableau. Décimal le remplit de chiffres pseudo-aléatoires, Binaire de zéros et de uns pseudo-aléatoires, et le bouton pour rebattre tire un nouveau tableau. Perso te laisse saisir un nombre décimal par ligne. La liste personnalisée préremplie commence par les chiffres de π, e, √2, du nombre d'or, de ln 2 et de la constante d'Euler-Mascheroni, décalés derrière la virgule.",
          "La règle de changement de chiffre décide comment dₙₙ est modifié. Échange 5 ↔ 6 transforme un 5 en 6 et tout autre chiffre en 5. +1 mod 10 ajoute un, mais saute 0 et 9 : un 8 ou un 9 devient donc 1. En mode binaire, la règle est ignorée et les bits basculent simplement entre 0 et 1 ; les lignes sont alors traitées comme des suites de 0 et de 1, pas comme des nombres (le préfixe « 0. » disparaît).",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Il n'y a pas de canvas : le tableau est un tableau HTML ordinaire, que les lecteurs d'écran peuvent donc parcourir. Les tableaux aléatoires proviennent d'un petit générateur congruentiel linéaire (multiplicateur 1664525, incrément 1013904223, modulo 2³²) initialisé avec un nombre qui change quand tu rebats la liste.",
          "Les chiffres de s ne sont pas du tout stockés dans l'état. Le composant ne garde que le pas courant et recalcule s à partir du tableau à chaque rendu, en lisant la diagonale et en appliquant la règle choisie. Changer la source, la règle ou une ligne personnalisée remet donc le pas à zéro. Lecture est un simple minuteur à intervalle qui fait avancer le pas. La seule animation continue est une légère pulsation sur le chiffre le plus récent, que la règle de réduction des animations du site désactive.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Pourquoi éviter 0 et 9",
        paragraphs: [
          "Certains nombres réels ont deux développements décimaux : 0,4999… et 0,5000… sont le même nombre. Si s se terminait par une suite infinie de 9, il pourrait coïncider avec un nombre de la liste écrit avec des 0 à la fin, alors que les deux écritures diffèrent chiffre par chiffre, et la démonstration s'effondrerait. Choisir des chiffres de remplacement qui ne valent jamais 0 ni 9 écarte ce risque, car un développement sans 0 ni 9 est la seule façon d'écrire ce nombre. Les deux règles décimales respectent cette contrainte. En binaire, le même piège existe (0,0111… est égal à 0,1000…), et inverser des bits ne permet pas de l'éviter. En mode binaire, l'explorateur fait donc comme les manuels : il raisonne sur des suites infinies de 0 et de 1 plutôt que sur des nombres réels, et sa conclusion est qu'il existe plus de suites de ce type que d'entiers naturels.",
          "Garde en tête que seize lignes ne sont qu'une illustration. Une liste finie peut toujours être battue par la force brute ; la puissance de l'argument, c'est que la même recette vient à bout d'une liste infinie, parce que la ligne n est contrôlée au chiffre n, aussi bas qu'elle se trouve.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Regarde s s'échapper",
        text: "Garde la source décimale et Échange 5 ↔ 6, appuie sur Lecture et suis la case ambrée le long de la diagonale.",
      },
      {
        title: "Essaie de piéger s",
        text: "Passe sur Perso et fais commencer la ligne 1 par 5, la ligne 2 par 05, la ligne 3 par 005, et ainsi de suite. Avec Échange 5 ↔ 6, chaque 5 de la diagonale devient un 6, si bien que s = 0,666… échappe quand même à toutes les lignes.",
      },
      {
        title: "Compare les deux règles",
        text: "Parcours le même tableau une fois avec Échange 5 ↔ 6 et une fois avec +1 mod 10. Tu obtiens deux nombres s différents, tous deux absents de la liste. La démonstration fournit autant de réels manquants que tu veux.",
      },
      {
        title: "Mode binaire",
        text: "Choisis Binaire et avance pas à pas. Chaque bit de la diagonale est inversé, et s est une suite de 0 et de 1 absente de la liste. Remarque que le panneau parle désormais de suites, et non de nombres, à cause de la réserve 0,0111… = 0,1000… évoquée plus haut.",
      },
    ],
  },
  it: {
    metaDescription:
      "Segui l'argomento diagonale di Cantor in una tabella 16 × 16: costruisci il numero mancante cifra per cifra e scopri perché i reali non sono numerabili.",
    heading: "Come funziona questo esploratore",
    intro:
      "La tabella è un elenco di sedici numeri reali compresi tra 0 e 1, ognuno scritto con sedici cifre dopo la virgola. Fai finta che sia l'inizio di un elenco che dovrebbe contenere tutti i numeri reali di quell'intervallo. A ogni pressione di Passo si guarda una cella della diagonale (la cifra 1 della riga 1, la cifra 2 della riga 2, e così via), si cambia quella cifra e si aggiunge il risultato a un nuovo numero s, in basso. Quando la diagonale è esaurita, s è in disaccordo con ogni riga in qualche punto, quindi non può stare nell'elenco. È l'argomento diagonale di Cantor.",
    sections: [
      {
        heading: "L'argomento",
        paragraphs: [
          "Un insieme è numerabile se i suoi elementi si possono disporre in un elenco r₁, r₂, r₃, … in cui ogni elemento prima o poi compare. Gli interi e perfino le frazioni sono numerabili. Georg Cantor dimostrò nel 1874 che i numeri reali non lo sono, e nel 1891 pubblicò la dimostrazione diagonale, molto più breve, che questo esploratore anima.",
          "Supponi che qualcuno ti consegni un elenco completo dei reali in [0, 1]. Chiama dₙₙ la n-esima cifra di rₙ e costruisci s in modo che la sua n-esima cifra sia diversa da dₙₙ. Allora s differisce da r₁ nella prima cifra, da r₂ nella seconda e, in generale, da rₙ nella n-esima. Nessuna riga può essere uguale a s, eppure s è chiaramente un numero reale compreso tra 0 e 1. L'elenco, dunque, non era completo e, poiché era arbitrario, non esiste alcun elenco completo.",
        ],
        formula: diagonalFormula("per ogni"),
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "Passo aggiunge una cifra di s, Riproduci le aggiunge automaticamente e Reimposta cancella s e ricomincia. Il cursore della velocità regola la pausa tra i passi automatici, da 1500 ms fino a 50 ms; il valore predefinito è 700 ms. La cella ambra è la cifra diagonale in uso in questo momento, le celle di un ambra tenue sono già state usate, e la colonna a destra registra ogni confronto come sₙ ≠ dₙₙ. Dopo la sedicesima cifra compare il pannello della contraddizione e le righe si possono evidenziare passandoci sopra con il mouse o con il focus da tastiera.",
          "Sorgente numeri sceglie da dove arriva la tabella. Decimale la riempie di cifre pseudocasuali, Binario di zeri e uni pseudocasuali, e il pulsante per rimescolare estrae una nuova tabella. Personale ti lascia scrivere un numero decimale per riga. L'elenco personale precompilato comincia con le cifre di π, e, √2, della sezione aurea, di ln 2 e della costante di Eulero-Mascheroni, spostate dopo la virgola.",
          "La regola di cambio cifra decide come viene alterato dₙₙ. Scambia 5 ↔ 6 trasforma un 5 in un 6 e ogni altra cifra in un 5. +1 mod 10 aggiunge uno ma salta lo 0 e il 9, quindi un 8 o un 9 diventano 1. In modalità binaria la regola viene ignorata e i bit passano semplicemente da 0 a 1 e viceversa; le righe sono allora trattate come successioni di 0 e 1, non come numeri (il prefisso «0.» viene omesso).",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Non c'è nessun canvas: la tabella è una normale tabella HTML, così gli screen reader possono percorrerla. Le tabelle casuali vengono da un piccolo generatore lineare congruenziale (moltiplicatore 1664525, incremento 1013904223, modulo 2³²) il cui seme è un numero che cambia quando rimescoli.",
          "Le cifre di s non sono affatto memorizzate nello stato. Il componente conserva solo il passo corrente e ricalcola s dalla tabella a ogni rendering, leggendo la diagonale e applicando la regola scelta. Per questo cambiare la sorgente, la regola o una riga personale azzera il passo. Riproduci è un semplice timer a intervalli che fa avanzare il passo. L'unica animazione continua è una lieve pulsazione sulla cifra più recente, che la regola di riduzione del movimento valida per tutto il sito disattiva.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Perché evitare 0 e 9",
        paragraphs: [
          "Alcuni numeri reali hanno due sviluppi decimali: 0,4999… e 0,5000… sono lo stesso numero. Se s terminasse con una fila infinita di 9, potrebbe coincidere con un numero dell'elenco scritto con degli 0 in coda, anche se i due sono in disaccordo cifra per cifra, e la dimostrazione crollerebbe. Scegliere cifre sostitutive che non siano mai 0 né 9 lo esclude, perché uno sviluppo senza 0 e senza 9 è l'unico modo di scrivere quel numero. Entrambe le regole decimali lo rispettano. In binario esiste la stessa trappola (0,0111… è uguale a 0,1000…), e invertire i bit non può evitarla. Perciò in modalità binaria l'esploratore fa quello che fanno i manuali: ragiona su successioni infinite di 0 e 1 anziché su numeri reali, e conclude che di successioni di questo tipo ce ne sono più dei numeri naturali.",
          "Tieni presente che sedici righe sono solo un'illustrazione. Un elenco finito si può sempre battere con la forza bruta; la forza dell'argomento sta nel fatto che la stessa ricetta sconfigge un elenco infinito, perché la riga n viene controllata alla cifra n, per quanto in basso si trovi.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Guarda s che scappa",
        text: "Tieni la sorgente decimale e Scambia 5 ↔ 6, premi Riproduci e segui la cella ambra lungo la diagonale.",
      },
      {
        title: "Prova a intrappolare s",
        text: "Passa a Personale e fai cominciare la riga 1 con 5, la riga 2 con 05, la riga 3 con 005, e così via. Con Scambia 5 ↔ 6 ogni 5 sulla diagonale diventa un 6, quindi s = 0,666… sfugge comunque a ogni riga.",
      },
      {
        title: "Confronta le due regole",
        text: "Percorri la stessa tabella una volta con Scambia 5 ↔ 6 e una volta con +1 mod 10. Ottieni due numeri s diversi, entrambi assenti dall'elenco. La dimostrazione fornisce tutti i reali mancanti che vuoi.",
      },
      {
        title: "Modalità binaria",
        text: "Scegli Binario e avanza un passo alla volta. Ogni bit della diagonale viene invertito, e s è una successione di 0 e 1 che manca dall'elenco. Nota che ora il pannello parla di successioni, non di numeri, per via dell'avvertenza 0,0111… = 0,1000… vista sopra.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Percorre o argumento diagonal de Cantor numa tabela de 16 × 16: constrói o número em falta dígito a dígito e vê porque os números reais não são numeráveis.",
    heading: "Como funciona este explorador",
    intro:
      "A tabela é uma lista de dezasseis números reais entre 0 e 1, cada um escrito com dezasseis casas decimais. Faz de conta que é o início de uma lista que pretende conter todos os números reais desse intervalo. Cada clique em Passo olha para uma célula da diagonal (o dígito 1 da linha 1, o dígito 2 da linha 2, e assim por diante), altera esse dígito e acrescenta o resultado a um novo número s, em baixo. Quando a diagonal se esgota, s discorda de cada linha em algum ponto, por isso não pode estar na lista. É o argumento diagonal de Cantor.",
    sections: [
      {
        heading: "O argumento",
        paragraphs: [
          "Um conjunto é numerável se os seus elementos puderem ser dispostos numa lista r₁, r₂, r₃, … em que cada elemento acaba por aparecer. Os inteiros e até as frações são numeráveis. Georg Cantor mostrou em 1874 que os números reais não o são, e em 1891 publicou a demonstração diagonal, muito mais curta, que este explorador anima.",
          "Supõe que alguém te entrega uma lista completa dos reais em [0, 1]. Chama dₙₙ ao n-ésimo dígito de rₙ e constrói s de modo que o seu n-ésimo dígito seja diferente de dₙₙ. Então s difere de r₁ no primeiro dígito, de r₂ no segundo e, em geral, de rₙ no n-ésimo. Nenhuma linha pode ser igual a s e, no entanto, s é claramente um número real entre 0 e 1. Afinal a lista não estava completa e, como era arbitrária, não existe nenhuma lista completa.",
        ],
        formula: diagonalFormula("para todo o"),
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "Passo acrescenta um dígito de s, Reproduzir acrescenta-os automaticamente e Reiniciar apaga s e recomeça. O cursor de velocidade define a pausa entre passos automáticos, de 1500 ms até 50 ms; o valor predefinido é 700 ms. A célula âmbar é o dígito diagonal que está a ser usado neste momento, as células de âmbar ténue já foram usadas, e a coluna da direita regista cada comparação como sₙ ≠ dₙₙ. Depois do décimo sexto dígito aparece o painel da contradição, e as linhas podem ser realçadas ao passar o rato ou com o foco do teclado.",
          "Fonte de números escolhe de onde vem a tabela. Decimal enche-a de dígitos pseudoaleatórios, Binário de zeros e uns pseudoaleatórios, e o botão de baralhar tira uma tabela nova. Personalizado deixa-te escrever um decimal por linha. A lista personalizada que vem preenchida começa com os dígitos de π, e, √2, do número de ouro, de ln 2 e da constante de Euler-Mascheroni, deslocados para depois da vírgula.",
          "A regra de troca de dígito decide como dₙₙ é alterado. Trocar 5 ↔ 6 transforma um 5 num 6 e qualquer outro dígito num 5. +1 mod 10 soma um mas salta o 0 e o 9, pelo que um 8 ou um 9 passam a 1. No modo binário a regra é ignorada e os bits alternam simplesmente entre 0 e 1; as linhas são então tratadas como sucessões de 0 e 1, não como números (o prefixo «0.» é omitido).",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Não há canvas: a tabela é uma tabela HTML normal, por isso os leitores de ecrã conseguem percorrê-la. As tabelas aleatórias vêm de um pequeno gerador congruencial linear (multiplicador 1664525, incremento 1013904223, módulo 2³²) cuja semente é um número que muda quando baralhas.",
          "Os dígitos de s não são guardados como estado. O componente guarda apenas o passo atual e recalcula s a partir da tabela em cada renderização, lendo a diagonal e aplicando a regra escolhida. Por isso, mudar a fonte, a regra ou uma linha personalizada repõe o passo a zero. Reproduzir é um simples temporizador de intervalo que faz avançar o passo. A única animação contínua é uma pulsação suave no dígito mais recente, que a regra de movimento reduzido de todo o site desliga.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Porquê evitar o 0 e o 9",
        paragraphs: [
          "Alguns números reais têm duas expansões decimais: 0,4999… e 0,5000… são o mesmo número. Se s terminasse numa sequência infinita de noves, poderia coincidir com um número da lista escrito com zeros no fim, apesar de os dois discordarem dígito a dígito, e a demonstração cairia por terra. Escolher dígitos de substituição que nunca sejam 0 nem 9 exclui essa hipótese, porque uma expansão sem zeros e sem noves é a única maneira de escrever esse número. As duas regras decimais respeitam isto. Em binário existe a mesma armadilha (0,0111… é igual a 0,1000…), e inverter bits não a consegue evitar. Por isso, no modo binário o explorador faz o que fazem os manuais: argumenta com sucessões infinitas de 0 e 1 em vez de números reais, e a sua conclusão é que há mais sucessões destas do que números naturais.",
          "Lembra-te de que dezasseis linhas são apenas uma ilustração. Uma lista finita pode sempre ser vencida pela força bruta; a força do argumento está em que a mesma receita derrota uma lista infinita, porque a linha n é verificada no dígito n, por mais abaixo que esteja.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Vê s a escapar",
        text: "Mantém a fonte decimal e Trocar 5 ↔ 6, carrega em Reproduzir e segue a célula âmbar pela diagonal abaixo.",
      },
      {
        title: "Tenta apanhar s",
        text: "Muda para Personalizado e faz a linha 1 começar por 5, a linha 2 por 05, a linha 3 por 005, e assim por diante. Com Trocar 5 ↔ 6, cada 5 da diagonal passa a 6, pelo que s = 0,666… escapa a todas as linhas na mesma.",
      },
      {
        title: "Compara as duas regras",
        text: "Percorre a mesma tabela uma vez com Trocar 5 ↔ 6 e outra com +1 mod 10. Obténs dois números s diferentes, ambos ausentes da lista. A demonstração dá-te tantos reais em falta quantos quiseres.",
      },
      {
        title: "Modo binário",
        text: "Escolhe Binário e avança passo a passo. Cada bit da diagonal é invertido, e s é uma sucessão de 0 e 1 que falta na lista. Repara que o painel fala agora de sucessões, não de números, por causa da ressalva 0,0111… = 0,1000… referida acima.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Stega igenom Cantors diagonalargument i en tabell med 16 × 16 siffror: bygg det saknade talet siffra för siffra och se varför ℝ är överuppräknelig.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Tabellen är en lista med sexton reella tal mellan 0 och 1, vart och ett utskrivet med sexton decimaler. Låtsas att den är början på en lista som ska innehålla varje reellt tal i det intervallet. Varje tryck på Steg tittar på en cell på diagonalen (siffra 1 i rad 1, siffra 2 i rad 2 och så vidare), ändrar den siffran och lägger till resultatet i ett nytt tal s längst ner. När diagonalen är förbrukad skiljer sig s från varje rad någonstans, så det kan inte stå på listan. Det är Cantors diagonalargument.",
    sections: [
      {
        heading: "Argumentet",
        paragraphs: [
          "En mängd är uppräknelig om dess element kan ordnas i en lista r₁, r₂, r₃, … där varje element förr eller senare dyker upp. Heltalen och till och med bråken är uppräkneliga. Georg Cantor visade 1874 att de reella talen inte är det, och 1891 publicerade han det mycket kortare diagonalbeviset som den här utforskaren animerar.",
          "Anta att någon ger dig en fullständig lista över de reella talen i [0, 1]. Kalla den n:te siffran i rₙ för dₙₙ och bygg s så att dess n:te siffra är något annat än dₙₙ. Då skiljer sig s från r₁ i första siffran, från r₂ i den andra och allmänt från rₙ i den n:te. Ingen rad kan vara lika med s, och ändå är s helt klart ett reellt tal mellan 0 och 1. Listan var alltså inte fullständig, och eftersom listan var godtycklig finns det ingen fullständig lista.",
        ],
        formula: diagonalFormula("för alla"),
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "Steg lägger till en siffra i s, Spela lägger till dem automatiskt och Återställ rensar s och börjar om. Hastighetsreglaget bestämmer pausen mellan de automatiska stegen, från 1500 ms ner till 50 ms. Standardvärdet är 700 ms. Den bärnstensfärgade cellen är den diagonalsiffra som används just nu, de svagt bärnstensfärgade cellerna är redan använda, och kolumnen till höger antecknar varje jämförelse som sₙ ≠ dₙₙ. Efter den sextonde siffran visas motsägelsepanelen, och raderna kan markeras genom att hovra eller med tangentbordsfokus.",
          "Talkälla väljer var tabellen kommer ifrån. Decimal fyller den med pseudoslumpade siffror, Binär med pseudoslumpade nollor och ettor, och knappen för att blanda om drar en ny tabell. Med Egen kan du skriva ett decimaltal per rad. Den förifyllda egna listan börjar med siffrorna i π, e, √2, gyllene snittet, ln 2 och Euler-Mascheronis konstant, flyttade bakom decimaltecknet.",
          "Sifferbytesregeln avgör hur dₙₙ ändras. Byt 5 ↔ 6 gör en 5:a till en 6:a och varje annan siffra till en 5:a. +1 mod 10 lägger till ett men hoppar över 0 och 9, så en 8:a eller en 9:a blir 1. I binärläget ignoreras regeln och bitarna växlar helt enkelt mellan 0 och 1. Raderna behandlas då som 0/1-följder, inte som tal (prefixet ”0.” faller bort).",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "Det finns ingen canvas: tabellen är en vanlig HTML-tabell, så skärmläsare kan gå igenom den. De slumpade tabellerna kommer från en liten linjär kongruensgenerator (multiplikator 1664525, inkrement 1013904223, modulo 2³²) vars frö är ett tal som ändras när du blandar om.",
          "Siffrorna i s lagras inte alls som tillstånd. Komponenten håller bara reda på det aktuella steget och räknar om s från tabellen vid varje rendering genom att läsa diagonalen och tillämpa den valda regeln. Därför nollställs steget när du byter källa, regel eller en egen rad. Spela är en enkel intervalltimer som räknar upp steget. Den enda kontinuerliga animationen är en mjuk puls på den nyaste siffran, och den stängs av av webbplatsens regel för minskad rörelse.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Varför 0 och 9 undviks",
        paragraphs: [
          "Vissa reella tal har två decimalutvecklingar: 0,4999… och 0,5000… är samma tal. Om s slutade med en oändlig rad 9:or skulle det kunna sammanfalla med ett listat tal som skrivs med avslutande 0:or, trots att de två skiljer sig siffra för siffra, och beviset skulle falla. Att välja ersättningssiffror som aldrig är 0 eller 9 utesluter det, eftersom en utveckling utan 0:or och 9:or är det enda sättet att skriva det talet. Båda decimalreglerna följer detta. I det binära finns samma fälla (0,0111… är lika med 0,1000…), och den går inte att undvika genom att vända på bitar. I binärläget gör utforskaren därför som läroboken: den resonerar med oändliga 0/1-följder i stället för reella tal, och slutsatsen är att det finns fler sådana följder än naturliga tal.",
          "Tänk på att sexton rader bara är en illustration. En ändlig lista kan alltid besegras med råstyrka. Argumentets styrka är att samma recept besegrar en oändlig lista, eftersom rad n kontrolleras vid siffra n hur långt ner den än står.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Se s smita",
        text: "Behåll decimalkällan och Byt 5 ↔ 6, tryck på Spela och följ den bärnstensfärgade cellen nedför diagonalen.",
      },
      {
        title: "Försök fånga s",
        text: "Växla till Egen och låt rad 1 börja med 5, rad 2 med 05, rad 3 med 005 och så vidare. Med Byt 5 ↔ 6 blir varje 5:a på diagonalen en 6:a, så s = 0,666… slinker förbi varje rad ändå.",
      },
      {
        title: "Jämför de två reglerna",
        text: "Kör samma tabell en gång med Byt 5 ↔ 6 och en gång med +1 mod 10. Du får två olika tal s, och båda saknas på listan. Beviset ger hur många saknade reella tal du vill.",
      },
      {
        title: "Binärläget",
        text: "Välj Binär och stega igenom. Varje diagonalbit vänds, och s är en 0/1-följd som saknas på listan. Lägg märke till att panelen nu talar om följder, inte tal, på grund av förbehållet 0,0111… = 0,1000… ovan.",
      },
    ],
  },
  no: {
    metaDescription:
      "Gå gjennom Cantors diagonalargument steg for steg i en tabell på 16 × 16 sifre: bygg det manglende tallet siffer for siffer og se hvorfor ℝ er overtellbar.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Tabellen er en liste med seksten reelle tall mellom 0 og 1, hvert skrevet ut med seksten desimaler. Lat som om den er starten på en liste som skal inneholde hvert eneste reelle tall i det intervallet. Hvert trykk på Steg ser på én celle på diagonalen (siffer 1 i rad 1, siffer 2 i rad 2 og så videre), endrer det sifferet og legger resultatet til et nytt tall s nederst. Når diagonalen er brukt opp, avviker s fra hver rad et eller annet sted, så det kan ikke stå på listen. Det er Cantors diagonalargument.",
    sections: [
      {
        heading: "Argumentet",
        paragraphs: [
          "En mengde er tellbar hvis elementene kan ordnes i en liste r₁, r₂, r₃, … der hvert element før eller siden dukker opp. Heltallene og til og med brøkene er tellbare. Georg Cantor viste i 1874 at de reelle tallene ikke er det, og i 1891 publiserte han det mye kortere diagonalbeviset som denne utforskeren animerer.",
          "Anta at noen gir deg en fullstendig liste over de reelle tallene i [0, 1]. Kall det n-te sifferet i rₙ for dₙₙ, og bygg s slik at det n-te sifferet er noe annet enn dₙₙ. Da skiller s seg fra r₁ i første siffer, fra r₂ i andre og generelt fra rₙ i det n-te. Ingen rad kan være lik s, og likevel er s helt klart et reelt tall mellom 0 og 1. Listen var altså ikke fullstendig likevel, og siden listen var vilkårlig, finnes det ingen fullstendig liste.",
        ],
        formula: diagonalFormula("for alle"),
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "Steg legger til ett siffer i s, Spill legger dem til automatisk, og Nullstill tømmer s og begynner på nytt. Fartsglideren bestemmer pausen mellom de automatiske stegene, fra 1500 ms ned til 50 ms. Standardverdien er 700 ms. Den ravgule cellen er diagonalsifferet som brukes akkurat nå, de svakt ravgule cellene er allerede brukt, og kolonnen til høyre noterer hver sammenligning som sₙ ≠ dₙₙ. Etter det sekstende sifferet dukker motsigelsespanelet opp, og radene kan fremheves ved å holde pekeren over dem eller med tastaturfokus.",
          "Tallkilde velger hvor tabellen kommer fra. Desimal fyller den med pseudotilfeldige sifre, Binær med pseudotilfeldige nuller og enere, og knappen for å stokke på nytt trekker en ny tabell. Med Egen kan du skrive inn ett desimaltall per linje. Den forhåndsutfylte egne listen begynner med sifrene i π, e, √2, det gylne snitt, ln 2 og Euler-Mascheroni-konstanten, flyttet bak desimaltegnet.",
          "Sifferbytteregelen avgjør hvordan dₙₙ endres. Bytt 5 ↔ 6 gjør en 5-er til en 6-er og alle andre sifre til en 5-er. +1 mod 10 legger til én, men hopper over 0 og 9, så en 8-er eller en 9-er blir til 1. I binærmodus ignoreres regelen, og bitene veksler ganske enkelt mellom 0 og 1. Radene behandles da som 0/1-følger, ikke som tall (prefikset «0.» faller bort).",
        ],
      },
      {
        heading: "Hvordan den er bygd",
        paragraphs: [
          "Det finnes ikke noe canvas: tabellen er en vanlig HTML-tabell, så skjermlesere kan gå gjennom den. De tilfeldige tabellene kommer fra en liten lineær kongruensgenerator (multiplikator 1664525, inkrement 1013904223, modulo 2³²) med et frø som endres når du stokker på nytt.",
          "Sifrene i s lagres ikke som tilstand i det hele tatt. Komponenten holder bare rede på det gjeldende steget og regner ut s på nytt fra tabellen ved hver rendring, ved å lese diagonalen og bruke den valgte regelen. Derfor nullstilles steget når du endrer kilden, regelen eller en egen linje. Spill er en enkel intervalltimer som teller steget oppover. Den eneste kontinuerlige animasjonen er en myk puls på det nyeste sifferet, og den slås av av nettstedets regel for redusert bevegelse.",
        ],
        code: FLIP_EXCERPT,
      },
      {
        heading: "Hvorfor unngå 0 og 9",
        paragraphs: [
          "Noen reelle tall har to desimalutviklinger: 0,4999… og 0,5000… er samme tall. Hvis s endte i en uendelig rekke 9-ere, kunne det falle sammen med et tall på listen som er skrevet med 0-er til slutt, selv om de to avviker siffer for siffer, og beviset ville bryte sammen. Å velge erstatningssifre som aldri er 0 eller 9, utelukker dette, fordi en utvikling uten 0-er og 9-ere er den eneste måten å skrive det tallet på. Begge desimalreglene overholder dette. I det binære finnes den samme fellen (0,0111… er lik 0,1000…), og den kan ikke unngås ved å snu biter. I binærmodus gjør utforskeren derfor som læreboka: den argumenterer med uendelige 0/1-følger i stedet for reelle tall, og konklusjonen er at det finnes flere slike følger enn naturlige tall.",
          "Husk at seksten rader bare er en illustrasjon. En endelig liste kan alltid slås med rå makt. Styrken i argumentet er at den samme oppskriften slår en uendelig liste, fordi rad n kontrolleres ved siffer n uansett hvor langt nede den står.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Se s slippe unna",
        text: "Behold desimalkilden og Bytt 5 ↔ 6, trykk på Spill og følg den ravgule cellen nedover diagonalen.",
      },
      {
        title: "Prøv å fange s",
        text: "Bytt til Egen og la rad 1 begynne med 5, rad 2 med 05, rad 3 med 005 og så videre. Med Bytt 5 ↔ 6 blir hver 5-er på diagonalen til en 6-er, så s = 0,666… smetter forbi hver rad likevel.",
      },
      {
        title: "Sammenlign de to reglene",
        text: "Kjør den samme tabellen én gang med Bytt 5 ↔ 6 og én gang med +1 mod 10. Du får to forskjellige tall s, og begge mangler på listen. Beviset gir deg så mange manglende reelle tall du vil.",
      },
      {
        title: "Binærmodus",
        text: "Velg Binær og gå gjennom steg for steg. Hver diagonalbit snus, og s er en 0/1-følge som mangler på listen. Legg merke til at panelet nå snakker om følger, ikke tall, på grunn av forbeholdet 0,0111… = 0,1000… ovenfor.",
      },
    ],
  },
};
