// Long-form prose: station bodies, limits items, complexity row notes.
// Kept in a separate file so the core dictionary stays scannable. The math
// notation (eml, eˣ, ln, K = 3, etc.) is preserved verbatim across locales.

import type { Locale } from "./types";

export type StationBody = string[]; // ordered paragraphs
export type StationId =
  | "exp"
  | "ln"
  | "id"
  | "selfdual"
  | "twin"
  | "param-vortex"
  | "cathedral"
  | "nebula";

export interface LimitItem {
  k: string;
  v: string;
}

export interface BodyDict {
  expressionTree: string;
  presetLabel: string;
  depthLabel: string;

  stationBodies: Record<StationId, StationBody>;

  limits: {
    complexRequired: LimitItem;
    branchCuts: LimitItem;
    overflow: LimitItem;
    nonSelfGen: LimitItem;
    notFullyUniversal: LimitItem;
  };

  complexityRpnInfo: string;
  complexityRows: {
    constant: string;
    exp: string;
    ln: string;
    id: string;
    mul: string;
    pow: string;
    neg: string;
    sqrt: string;
  };
}

const en: BodyDict = {
  expressionTree: "expression tree",
  presetLabel: "preset",
  depthLabel: "depth",
  stationBodies: {
    exp: [
      "The first miracle is small. Take eml(z, 1). The logarithm of 1 is zero, so the entire right half of the operator falls silent. What remains is the exponential — the calculus's loudest function, in its purest tone.",
      "One primitive, one constant, one identity. The cathedral has its first window. Notice how the rings spread horizontally: real-axis growth dominates while the imaginary axis only rotates the phase.",
      "RPN length: K = 3 — three tokens in postfix order. It is the cheapest non-trivial EML reconstruction in the paper.",
    ],
    ln: [
      "The inverse is harder than the forward. To return the natural logarithm we must nest three EMLs around z, each one undoing some of the previous one's drama.",
      "Trace it. The innermost eml(1, z) = e − ln z. Wrap that in eml(·, 1) to get eᵉ ⁄ z. Then eml(1, ·) peels the layers again, and ln z walks out the other side.",
      "The paper notes this is the same as e − log(eᵉ ⁄ z) on the principal branch. RPN length: K = 7.",
    ],
    id: [
      "In ordinary algebra the identity function costs you a single keystroke. In the EML calculus the cheapest known identity tree has depth four.",
      "To say z = z you must first say ln z, then e to the power of that. The tautology is expensive — the building always costs something.",
      "The paper records this as the shortest non-trivial identity tree: RPN length K = 9, leaf budget five copies of 1 plus one z. The Numerical Verification panel below shows it returning its input on demand.",
    ],
    selfdual: [
      "Feed z into both slots. The operator runs in two directions at once: an exponential explosion on one side, a logarithmic crawl on the other, both anchored to the same point.",
      "The image is no longer a known function — it has no classical name. It is simply eᶻ − ln z, an atom of the new alphabet, watching itself.",
    ],
    twin: [
      "Two EMLs in parallel, mirrored at their inputs: eml(eml(z, 1), eml(1, z)). An exponential of eᶻ on one side; a logarithm of e − ln z on the other. The two limbs meet in the middle and the resulting field breathes.",
    ],
    "param-vortex": [
      "We add a complex parameter p — not a new primitive, just a knob on the existing ones. Turn it and the singularities migrate; the contours bend; the field rotates as though watched through liquid.",
      "In the Atelier you can hold this knob yourself.",
    ],
    cathedral: [
      "Depth four, five branches. The exponential's appetite for unbounded growth and the logarithm's appetite for singularity meet at scale. Domain coloring shows the stained glass: every hue is the argument of w, every ring a doubling in magnitude.",
      "Nothing here is decorative. The pattern is forced by the operator.",
    ],
    nebula: [
      "Push the tree past depth five and floating-point arithmetic gives up first. The paper reports symbolic-regression success rates collapsing from 100 % at depth 2 to under 1 % at depth 5 — the EMLs amplify so violently that the numbers exit the machine.",
      "What's left is the place where the calculation breaks. We render it anyway — the cathedral's last and brightest window.",
    ],
  },
  limits: {
    complexRequired: {
      k: "complex required",
      v: "To even spell out constants like i and π, internal arithmetic must run on the complex plane. There is no real-only construction.",
    },
    branchCuts: {
      k: "branch cuts",
      v: "ln on the complex plane has a jump of 2πi on the negative real axis. EML inherits this scar; some reconstructions need a manual fix to match the classical function across the cut.",
    },
    overflow: {
      k: "overflow at depth",
      v: "Stacked exponentials grow doubly. Symbolic regression succeeds 100 % at depth 2, ~25 % at depth 3–4, under 1 % at depth 5. The arithmetic runs out of room.",
    },
    nonSelfGen: {
      k: "non-self-generating",
      v: "Unlike NAND, EML cannot synthesise its terminal constant 1 from arbitrary inputs. The 1 must be given.",
    },
    notFullyUniversal: {
      k: "not fully universal",
      v: "Some elementary functions provably escape any finite EML tree. The reach is broad, not total.",
    },
  },
  complexityRpnInfo:
    "RPN (Reverse Polish Notation) writes the tree without parentheses. Length K counts each atom and each operator once.",
  complexityRows: {
    constant: "the only constant in the calculus",
    exp: "eml(x, 1)",
    ln: "depth 3, three nested EMLs",
    id: "depth 4, threaded through e ∘ ln",
    mul: "two-variable, found by symbolic regression",
    pow: "two-variable, fast growth",
    neg: "−x, surprisingly hard to spell",
    sqrt: "exhaustive search lower bound",
  },
};

const de: BodyDict = {
  expressionTree: "Ausdrucksbaum",
  presetLabel: "Vorlage",
  depthLabel: "Tiefe",
  stationBodies: {
    exp: [
      "Das erste Wunder ist klein. Nimm eml(z, 1). Der Logarithmus von 1 ist Null, also verstummt die rechte Hälfte des Operators ganz. Übrig bleibt die Exponentialfunktion — die lauteste Funktion des Kalküls, in ihrem reinsten Ton.",
      "Ein Baustein, eine Konstante, eine Identität. Die Kathedrale hat ihr erstes Fenster. Achte darauf, wie sich die Ringe waagerecht ausbreiten: Wachstum auf der Realachse dominiert, während die imaginäre Achse nur die Phase dreht.",
      "RPN-Länge: K = 3 — drei Tokens in Postfix-Reihenfolge. Es ist die billigste nicht-triviale EML-Rekonstruktion im Paper.",
    ],
    ln: [
      "Die Umkehrung ist schwerer als der Hinweg. Um den natürlichen Logarithmus zurückzubekommen, müssen wir drei EMLs um z herum schachteln, jedes hebt einen Teil der Dramatik des vorherigen auf.",
      "Verfolge es. Das innerste eml(1, z) = e − ln z. Verpacke es in eml(·, 1) und du erhältst eᵉ ⁄ z. Dann schält eml(1, ·) die Schichten wieder ab, und ln z tritt am anderen Ende heraus.",
      "Das Paper notiert: das ist dasselbe wie e − log(eᵉ ⁄ z) auf dem Hauptzweig. RPN-Länge: K = 7.",
    ],
    id: [
      "In der gewöhnlichen Algebra kostet die Identitätsfunktion einen einzigen Tastendruck. Im EML-Kalkül hat der kürzeste bekannte Identitätsbaum Tiefe vier.",
      "Um z = z zu sagen, musst du erst ln z sagen, dann e hoch das Ganze. Die Tautologie ist teuer — das Bauen kostet immer etwas.",
      "Das Paper verzeichnet dies als den kürzesten nicht-trivialen Identitätsbaum: RPN-Länge K = 9, Blattbudget fünf Einsen plus ein z. Das Verifikations-Panel weiter unten zeigt, wie er auf Befehl seine Eingabe zurückgibt.",
    ],
    selfdual: [
      "Speise z in beide Schlitze. Der Operator läuft in zwei Richtungen gleichzeitig: eine exponentielle Explosion auf der einen Seite, ein logarithmisches Kriechen auf der anderen, beide am selben Punkt verankert.",
      "Das Bild ist keine bekannte Funktion mehr — es hat keinen klassischen Namen. Es ist schlicht eᶻ − ln z, ein Atom des neuen Alphabets, das auf sich selbst blickt.",
    ],
    twin: [
      "Zwei EMLs parallel, an ihren Eingängen gespiegelt: eml(eml(z, 1), eml(1, z)). Eine Exponentialfunktion von eᶻ auf der einen Seite; ein Logarithmus von e − ln z auf der anderen. Die zwei Glieder treffen sich in der Mitte und das entstehende Feld atmet.",
    ],
    "param-vortex": [
      "Wir fügen einen komplexen Parameter p hinzu — kein neuer Baustein, nur ein Drehknopf an den vorhandenen. Dreh ihn und die Singularitäten wandern; die Konturen biegen sich; das Feld dreht sich, als sähe man es durch Flüssigkeit.",
      "Im Atelier kannst du diesen Knopf selbst in die Hand nehmen.",
    ],
    cathedral: [
      "Tiefe vier, fünf Äste. Der Appetit der Exponentialfunktion auf unbegrenztes Wachstum und der Appetit des Logarithmus auf Singularitäten treffen sich im Großen. Domain Coloring zeigt das Buntglas: jeder Farbton ist das Argument von w, jeder Ring eine Verdoppelung des Betrags.",
      "Nichts hier ist Dekoration. Das Muster wird vom Operator erzwungen.",
    ],
    nebula: [
      "Drück den Baum über Tiefe fünf hinaus — die Gleitkomma-Arithmetik gibt zuerst auf. Das Paper berichtet, wie die Erfolgsraten der symbolischen Regression von 100 % bei Tiefe 2 auf unter 1 % bei Tiefe 5 einbrechen. Die EMLs verstärken so heftig, dass die Zahlen die Maschine verlassen.",
      "Was bleibt, ist der Ort, an dem die Rechnung bricht. Wir rendern ihn trotzdem — das letzte und hellste Fenster der Kathedrale.",
    ],
  },
  limits: {
    complexRequired: {
      k: "komplex erforderlich",
      v: "Selbst um Konstanten wie i und π auszudrücken, muss die interne Arithmetik in der komplexen Ebene laufen. Es gibt keine rein reelle Konstruktion.",
    },
    branchCuts: {
      k: "Astschnitte",
      v: "Der ln auf der komplexen Ebene hat einen Sprung von 2πi auf der negativen Realachse. EML erbt diese Narbe; manche Rekonstruktionen brauchen eine manuelle Korrektur, um über den Schnitt hinweg zur klassischen Funktion zu passen.",
    },
    overflow: {
      k: "Überlauf bei Tiefe",
      v: "Gestapelte Exponentialfunktionen wachsen doppelt. Symbolische Regression gelingt zu 100 % bei Tiefe 2, ~25 % bei Tiefe 3–4, unter 1 % bei Tiefe 5. Der Arithmetik geht der Platz aus.",
    },
    nonSelfGen: {
      k: "nicht selbst-erzeugend",
      v: "Anders als NAND kann EML seine terminale Konstante 1 nicht aus beliebigen Eingaben synthetisieren. Die 1 muss gegeben sein.",
    },
    notFullyUniversal: {
      k: "nicht voll universell",
      v: "Manche elementaren Funktionen entgehen nachweislich jedem endlichen EML-Baum. Die Reichweite ist breit, nicht total.",
    },
  },
  complexityRpnInfo:
    "RPN (Umgekehrte Polnische Notation) schreibt den Baum ohne Klammern. Die Länge K zählt jedes Atom und jeden Operator genau einmal.",
  complexityRows: {
    constant: "die einzige Konstante des Kalküls",
    exp: "eml(x, 1)",
    ln: "Tiefe 3, drei geschachtelte EMLs",
    id: "Tiefe 4, durch e ∘ ln gefädelt",
    mul: "zwei Variablen, durch symbolische Regression gefunden",
    pow: "zwei Variablen, rasches Wachstum",
    neg: "−x, überraschend schwer auszudrücken",
    sqrt: "untere Schranke durch erschöpfende Suche",
  },
};

const es: BodyDict = {
  expressionTree: "árbol de expresión",
  presetLabel: "preajuste",
  depthLabel: "profundidad",
  stationBodies: {
    exp: [
      "El primer milagro es pequeño. Toma eml(z, 1). El logaritmo de 1 es cero, así que la mitad derecha del operador enmudece por completo. Lo que queda es la exponencial — la función más sonora del cálculo, en su tono más puro.",
      "Un primitivo, una constante, una identidad. La catedral tiene su primera vidriera. Observa cómo los anillos se extienden horizontalmente: el crecimiento sobre el eje real domina, mientras el imaginario sólo gira la fase.",
      "Longitud RPN: K = 3 — tres tokens en orden postfijo. Es la reconstrucción EML no trivial más barata del artículo.",
    ],
    ln: [
      "El inverso es más difícil que la ida. Para devolver el logaritmo natural debemos anidar tres EML alrededor de z, cada uno deshaciendo parte del drama del anterior.",
      "Síguelo. El más interno eml(1, z) = e − ln z. Envuélvelo en eml(·, 1) y obtienes eᵉ ⁄ z. Luego eml(1, ·) vuelve a pelar las capas, y ln z sale por el otro lado.",
      "El artículo señala que esto coincide con e − log(eᵉ ⁄ z) en la rama principal. Longitud RPN: K = 7.",
    ],
    id: [
      "En álgebra corriente la identidad cuesta una sola tecla. En el cálculo EML el árbol identidad más barato conocido tiene profundidad cuatro.",
      "Para decir z = z primero debes decir ln z, luego e elevado a eso. La tautología es cara — construir siempre cuesta algo.",
      "El artículo lo registra como el árbol identidad no trivial más corto: longitud RPN K = 9, presupuesto de hojas cinco copias de 1 más un z. El panel de verificación numérica más abajo lo muestra devolviendo su entrada cuando se le pide.",
    ],
    selfdual: [
      "Alimenta z en ambas ranuras. El operador corre en dos direcciones a la vez: una explosión exponencial por un lado, un avance logarítmico por el otro, ambos anclados al mismo punto.",
      "La imagen ya no es una función conocida — carece de nombre clásico. Es simplemente eᶻ − ln z, un átomo del nuevo alfabeto, mirándose a sí mismo.",
    ],
    twin: [
      "Dos EML en paralelo, espejados en sus entradas: eml(eml(z, 1), eml(1, z)). Un exponencial de eᶻ por un lado; un logaritmo de e − ln z por el otro. Los dos miembros se encuentran en medio y el campo resultante respira.",
    ],
    "param-vortex": [
      "Añadimos un parámetro complejo p — no un primitivo nuevo, sólo una manivela sobre los ya existentes. Gírala y las singularidades migran; los contornos se curvan; el campo rota como visto a través de un líquido.",
      "En el Taller puedes tomar esa manivela tú mismo.",
    ],
    cathedral: [
      "Profundidad cuatro, cinco ramas. El apetito exponencial por el crecimiento sin límite y el apetito logarítmico por la singularidad se encuentran a escala. El coloreado de dominio muestra la vidriera: cada tono es el argumento de w, cada anillo una duplicación de la magnitud.",
      "Nada aquí es decoración. El patrón lo impone el operador.",
    ],
    nebula: [
      "Empuja el árbol más allá de profundidad cinco y la aritmética de coma flotante cede primero. El artículo informa que la tasa de éxito de la regresión simbólica cae del 100 % en profundidad 2 a menos del 1 % en profundidad 5 — los EML amplifican tan violentamente que los números abandonan la máquina.",
      "Lo que queda es el lugar donde el cálculo se rompe. Lo renderizamos igualmente — la última y más luminosa vidriera de la catedral.",
    ],
  },
  limits: {
    complexRequired: {
      k: "complejo requerido",
      v: "Incluso para deletrear constantes como i y π, la aritmética interna debe correr en el plano complejo. No hay construcción solo real.",
    },
    branchCuts: {
      k: "cortes de rama",
      v: "El ln en el plano complejo tiene un salto de 2πi sobre el eje real negativo. EML hereda esa cicatriz; algunas reconstrucciones necesitan un parche manual para coincidir con la función clásica a través del corte.",
    },
    overflow: {
      k: "desbordamiento por profundidad",
      v: "Las exponenciales apiladas crecen doblemente. La regresión simbólica acierta el 100 % en profundidad 2, ~25 % en 3–4, menos del 1 % en 5. A la aritmética se le acaba el sitio.",
    },
    nonSelfGen: {
      k: "no autogenerador",
      v: "A diferencia de NAND, EML no puede sintetizar su constante terminal 1 a partir de entradas arbitrarias. El 1 debe darse.",
    },
    notFullyUniversal: {
      k: "no totalmente universal",
      v: "Algunas funciones elementales escapan de modo demostrable a cualquier árbol EML finito. El alcance es amplio, no total.",
    },
  },
  complexityRpnInfo:
    "La RPN (notación polaca inversa) escribe el árbol sin paréntesis. La longitud K cuenta cada átomo y cada operador una vez.",
  complexityRows: {
    constant: "la única constante del cálculo",
    exp: "eml(x, 1)",
    ln: "profundidad 3, tres EML anidados",
    id: "profundidad 4, enhebrado por e ∘ ln",
    mul: "dos variables, hallado por regresión simbólica",
    pow: "dos variables, crecimiento veloz",
    neg: "−x, sorprendentemente difícil de deletrear",
    sqrt: "cota inferior por búsqueda exhaustiva",
  },
};

const fr: BodyDict = {
  expressionTree: "arbre d'expression",
  presetLabel: "préréglage",
  depthLabel: "profondeur",
  stationBodies: {
    exp: [
      "Le premier miracle est petit. Prends eml(z, 1). Le logarithme de 1 vaut zéro, donc la moitié droite de l'opérateur se tait. Reste l'exponentielle — la fonction la plus sonore du calcul, dans son ton le plus pur.",
      "Une primitive, une constante, une identité. La cathédrale a son premier vitrail. Remarque comme les anneaux s'étalent horizontalement : la croissance le long de l'axe réel domine, tandis que l'axe imaginaire ne fait que tourner la phase.",
      "Longueur RPN : K = 3 — trois jetons en notation postfixée. C'est la reconstruction EML non triviale la moins coûteuse de l'article.",
    ],
    ln: [
      "L'inverse est plus difficile que l'aller. Pour retrouver le logarithme naturel, il faut imbriquer trois EML autour de z, chacun défaisant une partie du drame du précédent.",
      "Retrace-le. Le plus profond eml(1, z) = e − ln z. Enveloppe-le dans eml(·, 1) pour obtenir eᵉ ⁄ z. Puis eml(1, ·) épluche à nouveau les couches, et ln z ressort par l'autre côté.",
      "L'article note que c'est la même chose que e − log(eᵉ ⁄ z) sur la branche principale. Longueur RPN : K = 7.",
    ],
    id: [
      "En algèbre ordinaire l'identité coûte une seule frappe. Dans le calcul EML, le plus court arbre identité connu a une profondeur de quatre.",
      "Pour dire z = z il faut d'abord dire ln z, puis e à cette puissance. La tautologie coûte cher — bâtir a toujours un prix.",
      "L'article l'enregistre comme le plus court arbre identité non trivial : longueur RPN K = 9, budget de feuilles cinq copies de 1 plus un z. Le panneau de vérification numérique ci-dessous le montre rendant son entrée à la demande.",
    ],
    selfdual: [
      "Donne z aux deux fentes. L'opérateur tourne dans deux directions à la fois : une explosion exponentielle d'un côté, une reptation logarithmique de l'autre, toutes deux ancrées au même point.",
      "L'image n'est plus une fonction connue — elle n'a pas de nom classique. C'est simplement eᶻ − ln z, un atome du nouvel alphabet, se regardant.",
    ],
    twin: [
      "Deux EML en parallèle, miroirs sur leurs entrées : eml(eml(z, 1), eml(1, z)). Une exponentielle de eᶻ d'un côté ; un logarithme de e − ln z de l'autre. Les deux branches se rencontrent au milieu et le champ qui en résulte respire.",
    ],
    "param-vortex": [
      "Nous ajoutons un paramètre complexe p — pas une nouvelle primitive, juste une poignée sur les existantes. Tourne-la et les singularités migrent ; les contours se courbent ; le champ tourne comme observé à travers un liquide.",
      "Dans l'Atelier vous pouvez tenir cette poignée vous-même.",
    ],
    cathedral: [
      "Profondeur quatre, cinq branches. L'appétit de l'exponentielle pour la croissance sans bornes et celui du logarithme pour la singularité se rencontrent à grande échelle. Le coloriage de domaine montre le vitrail : chaque teinte est l'argument de w, chaque anneau un doublement de magnitude.",
      "Rien ici n'est décoratif. Le motif est imposé par l'opérateur.",
    ],
    nebula: [
      "Pousse l'arbre au-delà de la profondeur cinq et l'arithmétique flottante cède la première. L'article rapporte un effondrement des taux de succès de la régression symbolique, de 100 % en profondeur 2 à moins de 1 % en profondeur 5 — les EML amplifient si violemment que les nombres quittent la machine.",
      "Reste l'endroit où le calcul se brise. Nous le rendons quand même — le dernier et le plus lumineux vitrail de la cathédrale.",
    ],
  },
  limits: {
    complexRequired: {
      k: "complexe obligatoire",
      v: "Même pour épeler des constantes comme i et π, l'arithmétique interne doit fonctionner sur le plan complexe. Aucune construction purement réelle n'existe.",
    },
    branchCuts: {
      k: "coupures de branche",
      v: "Le ln sur le plan complexe a un saut de 2πi sur l'axe réel négatif. EML hérite de cette cicatrice ; certaines reconstructions exigent un correctif manuel pour coller à la fonction classique au-delà de la coupure.",
    },
    overflow: {
      k: "débordement en profondeur",
      v: "Les exponentielles empilées croissent doublement. La régression symbolique réussit à 100 % en profondeur 2, ~25 % en 3–4, moins de 1 % en 5. L'arithmétique manque de place.",
    },
    nonSelfGen: {
      k: "non autogénératrice",
      v: "Contrairement à NAND, EML ne peut pas synthétiser sa constante terminale 1 à partir d'entrées arbitraires. Le 1 doit être donné.",
    },
    notFullyUniversal: {
      k: "non pleinement universelle",
      v: "Certaines fonctions élémentaires échappent prouvablement à tout arbre EML fini. La portée est large, pas totale.",
    },
  },
  complexityRpnInfo:
    "La RPN (notation polonaise inverse) écrit l'arbre sans parenthèses. La longueur K compte chaque atome et chaque opérateur une fois.",
  complexityRows: {
    constant: "la seule constante du calcul",
    exp: "eml(x, 1)",
    ln: "profondeur 3, trois EML imbriqués",
    id: "profondeur 4, enfilé par e ∘ ln",
    mul: "deux variables, trouvée par régression symbolique",
    pow: "deux variables, croissance rapide",
    neg: "−x, étonnamment difficile à épeler",
    sqrt: "borne inférieure par recherche exhaustive",
  },
};

const it: BodyDict = {
  expressionTree: "albero dell'espressione",
  presetLabel: "preset",
  depthLabel: "profondità",
  stationBodies: {
    exp: [
      "Il primo miracolo è piccolo. Prendi eml(z, 1). Il logaritmo di 1 è zero, perciò l'intera metà destra dell'operatore tace. Resta l'esponenziale — la funzione più sonora del calcolo, nel suo tono più puro.",
      "Una primitiva, una costante, un'identità. La cattedrale ha la sua prima vetrata. Nota come gli anelli si distendono in orizzontale: la crescita sull'asse reale domina, mentre quello immaginario ruota soltanto la fase.",
      "Lunghezza RPN: K = 3 — tre token in ordine postfisso. È la ricostruzione EML non banale meno costosa nell'articolo.",
    ],
    ln: [
      "L'inverso è più difficile dell'andata. Per riavere il logaritmo naturale dobbiamo annidare tre EML attorno a z, ciascuno disfacendo parte del dramma del precedente.",
      "Seguilo. Il più interno eml(1, z) = e − ln z. Avvolgilo in eml(·, 1) e ottieni eᵉ ⁄ z. Poi eml(1, ·) sfoglia di nuovo gli strati, e ln z esce dall'altro lato.",
      "L'articolo nota che questo coincide con e − log(eᵉ ⁄ z) sul ramo principale. Lunghezza RPN: K = 7.",
    ],
    id: [
      "Nell'algebra ordinaria l'identità costa un solo tasto. Nel calcolo EML il più corto albero identità noto ha profondità quattro.",
      "Per dire z = z devi prima dire ln z, poi e elevato a quello. La tautologia è cara — costruire costa sempre qualcosa.",
      "L'articolo lo registra come l'albero identità non banale più corto: lunghezza RPN K = 9, budget di foglie cinque copie di 1 più una z. Il pannello di verifica numerica qui sotto lo mostra restituire l'input a richiesta.",
    ],
    selfdual: [
      "Alimenta z in entrambe le fessure. L'operatore corre in due direzioni insieme: un'esplosione esponenziale da un lato, uno strisciare logaritmico dall'altro, entrambi ancorati allo stesso punto.",
      "L'immagine non è più una funzione nota — non ha nome classico. È semplicemente eᶻ − ln z, un atomo del nuovo alfabeto, che guarda sé stesso.",
    ],
    twin: [
      "Due EML in parallelo, specchiati nei loro ingressi: eml(eml(z, 1), eml(1, z)). Un esponenziale di eᶻ da un lato; un logaritmo di e − ln z dall'altro. I due rami si incontrano nel mezzo e il campo che ne risulta respira.",
    ],
    "param-vortex": [
      "Aggiungiamo un parametro complesso p — non una nuova primitiva, solo una manopola su quelle esistenti. Giralo e le singolarità migrano; i contorni si piegano; il campo ruota come visto attraverso un liquido.",
      "Nell'Atelier puoi impugnare questa manopola tu stesso.",
    ],
    cathedral: [
      "Profondità quattro, cinque rami. L'appetito dell'esponenziale per la crescita illimitata e quello del logaritmo per la singolarità si incontrano su larga scala. La coloratura di dominio mostra la vetrata: ogni tinta è l'argomento di w, ogni anello un raddoppio della magnitudine.",
      "Nulla qui è ornamentale. Il motivo è imposto dall'operatore.",
    ],
    nebula: [
      "Spingi l'albero oltre la profondità cinque e l'aritmetica in virgola mobile cede per prima. L'articolo riporta tassi di successo della regressione simbolica che crollano dal 100 % a profondità 2 al di sotto dell'1 % a profondità 5 — gli EML amplificano così violentemente che i numeri escono dalla macchina.",
      "Resta il luogo dove il calcolo si spezza. Lo rendiamo lo stesso — l'ultima e più luminosa vetrata della cattedrale.",
    ],
  },
  limits: {
    complexRequired: {
      k: "complesso richiesto",
      v: "Persino per compitare costanti come i e π, l'aritmetica interna deve girare nel piano complesso. Non c'è costruzione puramente reale.",
    },
    branchCuts: {
      k: "tagli di ramo",
      v: "Il ln nel piano complesso ha un salto di 2πi sull'asse reale negativo. EML eredita la cicatrice; alcune ricostruzioni richiedono una correzione manuale per coincidere con la funzione classica oltre il taglio.",
    },
    overflow: {
      k: "trabocco in profondità",
      v: "Le esponenziali impilate crescono doppiamente. La regressione simbolica riesce al 100 % a profondità 2, ~25 % a 3–4, sotto l'1 % a 5. L'aritmetica resta senza spazio.",
    },
    nonSelfGen: {
      k: "non auto-generatrice",
      v: "Diversamente da NAND, EML non riesce a sintetizzare la sua costante terminale 1 da input arbitrari. L'1 va fornito.",
    },
    notFullyUniversal: {
      k: "non pienamente universale",
      v: "Alcune funzioni elementari sfuggono dimostrabilmente a ogni albero EML finito. La portata è ampia, non totale.",
    },
  },
  complexityRpnInfo:
    "La RPN (notazione polacca inversa) scrive l'albero senza parentesi. La lunghezza K conta ogni atomo e ogni operatore una sola volta.",
  complexityRows: {
    constant: "l'unica costante del calcolo",
    exp: "eml(x, 1)",
    ln: "profondità 3, tre EML annidati",
    id: "profondità 4, infilato attraverso e ∘ ln",
    mul: "due variabili, trovata per regressione simbolica",
    pow: "due variabili, crescita rapida",
    neg: "−x, sorprendentemente difficile da compitare",
    sqrt: "limite inferiore da ricerca esaustiva",
  },
};

const pt: BodyDict = {
  expressionTree: "árvore da expressão",
  presetLabel: "predefinição",
  depthLabel: "profundidade",
  stationBodies: {
    exp: [
      "O primeiro milagre é pequeno. Toma eml(z, 1). O logaritmo de 1 é zero, então toda a metade direita do operador silencia. O que sobra é a exponencial — a função mais sonora do cálculo, no seu tom mais puro.",
      "Um primitivo, uma constante, uma identidade. A catedral tem o seu primeiro vitral. Repara como os anéis se espalham na horizontal: o crescimento no eixo real domina, enquanto o imaginário apenas roda a fase.",
      "Comprimento RPN: K = 3 — três tokens em ordem pós-fixada. É a reconstrução EML não trivial mais barata do artigo.",
    ],
    ln: [
      "O inverso é mais difícil do que a ida. Para devolver o logaritmo natural temos de aninhar três EMLs em torno de z, cada um desfazendo parte do drama do anterior.",
      "Acompanha. O mais interno eml(1, z) = e − ln z. Envolve-o em eml(·, 1) e tens eᵉ ⁄ z. Depois eml(1, ·) descasca de novo as camadas, e ln z sai pelo outro lado.",
      "O artigo nota que isto coincide com e − log(eᵉ ⁄ z) no ramo principal. Comprimento RPN: K = 7.",
    ],
    id: [
      "Na álgebra comum a identidade custa uma única tecla. No cálculo EML a árvore identidade mais barata conhecida tem profundidade quatro.",
      "Para dizer z = z primeiro tens de dizer ln z, depois e elevado a isso. A tautologia é cara — construir custa sempre alguma coisa.",
      "O artigo regista-a como a árvore identidade não trivial mais curta: comprimento RPN K = 9, orçamento de folhas cinco cópias de 1 mais um z. O painel de verificação numérica abaixo mostra-a devolvendo a sua entrada quando pedido.",
    ],
    selfdual: [
      "Alimenta z em ambas as ranhuras. O operador corre em duas direções ao mesmo tempo: uma explosão exponencial de um lado, um rastejar logarítmico do outro, ambos ancorados no mesmo ponto.",
      "A imagem já não é uma função conhecida — não tem nome clássico. É simplesmente eᶻ − ln z, um átomo do novo alfabeto, a olhar para si mesmo.",
    ],
    twin: [
      "Dois EMLs em paralelo, espelhados nas entradas: eml(eml(z, 1), eml(1, z)). Um exponencial de eᶻ de um lado; um logaritmo de e − ln z do outro. Os dois ramos encontram-se no meio e o campo resultante respira.",
    ],
    "param-vortex": [
      "Adicionamos um parâmetro complexo p — não um primitivo novo, apenas um manípulo sobre os existentes. Gira-o e as singularidades migram; os contornos curvam; o campo roda como visto através de um líquido.",
      "No Atelier podes segurar tu próprio esse manípulo.",
    ],
    cathedral: [
      "Profundidade quatro, cinco ramos. O apetite da exponencial pelo crescimento ilimitado e o do logaritmo pela singularidade encontram-se em grande escala. A coloração de domínio mostra o vitral: cada matiz é o argumento de w, cada anel uma duplicação de magnitude.",
      "Nada aqui é decoração. O padrão é imposto pelo operador.",
    ],
    nebula: [
      "Empurra a árvore para além de profundidade cinco e a aritmética de vírgula flutuante cede primeiro. O artigo relata taxas de sucesso da regressão simbólica a desabarem de 100 % em profundidade 2 para abaixo de 1 % em profundidade 5 — os EMLs amplificam tão violentamente que os números deixam a máquina.",
      "Resta o lugar onde o cálculo parte. Renderizamo-lo mesmo assim — o último e mais brilhante vitral da catedral.",
    ],
  },
  limits: {
    complexRequired: {
      k: "complexo necessário",
      v: "Mesmo para soletrar constantes como i e π, a aritmética interna tem de correr no plano complexo. Não há construção apenas real.",
    },
    branchCuts: {
      k: "cortes de ramo",
      v: "O ln no plano complexo tem um salto de 2πi no eixo real negativo. EML herda essa cicatriz; algumas reconstruções precisam de uma correção manual para casar com a função clássica para lá do corte.",
    },
    overflow: {
      k: "estouro com profundidade",
      v: "Exponenciais empilhados crescem duplamente. A regressão simbólica acerta 100 % em profundidade 2, ~25 % em 3–4, abaixo de 1 % em 5. A aritmética fica sem espaço.",
    },
    nonSelfGen: {
      k: "não autogeradora",
      v: "Ao contrário do NAND, o EML não consegue sintetizar a sua constante terminal 1 a partir de entradas arbitrárias. O 1 tem de ser fornecido.",
    },
    notFullyUniversal: {
      k: "não totalmente universal",
      v: "Algumas funções elementares escapam comprovadamente a qualquer árvore EML finita. O alcance é vasto, não total.",
    },
  },
  complexityRpnInfo:
    "A RPN (notação polonesa inversa) escreve a árvore sem parênteses. O comprimento K conta cada átomo e cada operador uma vez.",
  complexityRows: {
    constant: "a única constante do cálculo",
    exp: "eml(x, 1)",
    ln: "profundidade 3, três EMLs aninhados",
    id: "profundidade 4, enfiado por e ∘ ln",
    mul: "duas variáveis, achada por regressão simbólica",
    pow: "duas variáveis, crescimento rápido",
    neg: "−x, surpreendentemente difícil de soletrar",
    sqrt: "limite inferior por busca exaustiva",
  },
};

const sv: BodyDict = {
  expressionTree: "uttrycks­träd",
  presetLabel: "förinställning",
  depthLabel: "djup",
  stationBodies: {
    exp: [
      "Det första miraklet är litet. Ta eml(z, 1). Logaritmen av 1 är noll, så hela operatorens högra halva tystnar. Det som blir kvar är exponentialfunktionen — kalkylens högljuddaste funktion, i sin renaste ton.",
      "En primitiv, en konstant, en identitet. Katedralen har sitt första fönster. Notera hur ringarna sprider sig vågrätt: tillväxten längs realaxeln dominerar, medan den imaginära axeln bara roterar fasen.",
      "RPN-längd: K = 3 — tre tecken i postfix-ordning. Det är artikelns billigaste icke-triviala EML-rekonstruktion.",
    ],
    ln: [
      "Inversen är svårare än framvägen. För att få tillbaka den naturliga logaritmen måste vi nästla tre EML kring z, var och en upphäver något av det förras drama.",
      "Följ den. Det innersta eml(1, z) = e − ln z. Linda in det i eml(·, 1) så får du eᵉ ⁄ z. Sedan skalar eml(1, ·) skikten igen, och ln z kliver ut på andra sidan.",
      "Artikeln noterar att det är samma sak som e − log(eᵉ ⁄ z) på huvudgrenen. RPN-längd: K = 7.",
    ],
    id: [
      "I vanlig algebra kostar identiteten en enda tangenttryckning. I EML-kalkylen har det kortast kända identitets­trädet djup fyra.",
      "För att säga z = z måste du först säga ln z, sedan e upphöjt till det. Tautologin är dyr — bygget kostar alltid något.",
      "Artikeln noterar detta som det kortaste icke-triviala identitets­trädet: RPN-längd K = 9, lövbudget fem kopior av 1 plus en z. Den numeriska verifierings­panelen nedan visar det återlämna sin indata på begäran.",
    ],
    selfdual: [
      "Mata in z i båda hålen. Operatorn löper i två riktningar samtidigt: en exponentiell explosion på ena sidan, ett logaritmiskt krypande på andra, båda förankrade i samma punkt.",
      "Bilden är inte längre någon känd funktion — den saknar klassiskt namn. Det är helt enkelt eᶻ − ln z, en atom i det nya alfabetet, som ser på sig själv.",
    ],
    twin: [
      "Två EML parallellt, speglade vid sina indata: eml(eml(z, 1), eml(1, z)). En exponential av eᶻ på ena sidan; en logaritm av e − ln z på den andra. De två lemmarna möts i mitten och det resulterande fältet andas.",
    ],
    "param-vortex": [
      "Vi lägger till en komplex parameter p — ingen ny primitiv, bara ett vred på de befintliga. Vrid den och singulariteterna vandrar; konturerna böjer sig; fältet roterar som sett genom vätska.",
      "I Atelieren kan du själv hålla i det vredet.",
    ],
    cathedral: [
      "Djup fyra, fem grenar. Exponentialens aptit för obegränsad tillväxt och logaritmens aptit för singularitet möts i stor skala. Domänfärgning visar det blyinfattade glaset: varje kulör är argumentet av w, varje ring en fördubbling i storlek.",
      "Inget här är dekorativt. Mönstret tvingas fram av operatorn.",
    ],
    nebula: [
      "Tryck trädet förbi djup fem och flyttalsaritmetiken ger upp först. Artikeln rapporterar att framgångsfrekvensen för symbolisk regression rasar från 100 % vid djup 2 till under 1 % vid djup 5 — EML förstärker så våldsamt att talen lämnar maskinen.",
      "Det som återstår är platsen där beräkningen brister. Vi renderar den ändå — katedralens sista och starkaste fönster.",
    ],
  },
  limits: {
    complexRequired: {
      k: "komplex krävs",
      v: "Redan för att stava konstanter som i och π måste den interna aritmetiken arbeta i det komplexa planet. Ingen rent reell konstruktion finns.",
    },
    branchCuts: {
      k: "grensnitt",
      v: "ln i det komplexa planet har ett hopp om 2πi över den negativa realaxeln. EML ärver det ärret; vissa rekonstruktioner behöver en manuell korrigering för att matcha den klassiska funktionen över snittet.",
    },
    overflow: {
      k: "överspill vid djup",
      v: "Staplade exponentialer växer dubbelt. Symbolisk regression lyckas till 100 % vid djup 2, ~25 % vid 3–4, under 1 % vid 5. Aritmetiken får slut på plats.",
    },
    nonSelfGen: {
      k: "ej självgenererande",
      v: "Till skillnad från NAND kan EML inte syntetisera sin terminala konstant 1 från godtycklig indata. Ettan måste ges.",
    },
    notFullyUniversal: {
      k: "ej helt universell",
      v: "Vissa elementära funktioner undgår bevisligen varje ändligt EML-träd. Räckvidden är bred, inte total.",
    },
  },
  complexityRpnInfo:
    "RPN (omvänd polsk notation) skriver trädet utan parenteser. Längden K räknar varje atom och varje operator en gång.",
  complexityRows: {
    constant: "kalkylens enda konstant",
    exp: "eml(x, 1)",
    ln: "djup 3, tre nästlade EML",
    id: "djup 4, trädd genom e ∘ ln",
    mul: "två variabler, funnen via symbolisk regression",
    pow: "två variabler, snabb tillväxt",
    neg: "−x, förvånansvärt svår att stava",
    sqrt: "undre gräns genom uttömmande sökning",
  },
};

const no: BodyDict = {
  expressionTree: "uttrykks­tre",
  presetLabel: "forhåndsinnstilling",
  depthLabel: "dybde",
  stationBodies: {
    exp: [
      "Det første miraklet er lite. Ta eml(z, 1). Logaritmen av 1 er null, så hele høyre halvdel av operatoren tier. Det som står igjen er eksponentialfunksjonen — kalkulusens høyeste funksjon, i sin reneste tone.",
      "Én primitiv, én konstant, én identitet. Katedralen har sitt første vindu. Legg merke til hvordan ringene sprer seg vannrett: vekst langs realaksen dominerer, mens den imaginære aksen bare roterer fasen.",
      "RPN-lengde: K = 3 — tre tegn i postfiks rekkefølge. Det er artikkelens billigste ikke-trivielle EML-rekonstruksjon.",
    ],
    ln: [
      "Det inverse er vanskeligere enn fremveien. For å få tilbake den naturlige logaritmen må vi nøste tre EML rundt z, hver av dem opphever noe av forrige dramaturgi.",
      "Følg den. Det innerste eml(1, z) = e − ln z. Pakk det inn i eml(·, 1) og du får eᵉ ⁄ z. Så skreller eml(1, ·) lagene igjen, og ln z kommer ut på den andre siden.",
      "Artikkelen påpeker at dette tilsvarer e − log(eᵉ ⁄ z) på hovedgrenen. RPN-lengde: K = 7.",
    ],
    id: [
      "I vanlig algebra koster identiteten et enkelt tastetrykk. I EML-kalkylen har det korteste kjente identitets­treet dybde fire.",
      "For å si z = z må du først si ln z, deretter e opphøyd i det. Tautologien er dyr — det å bygge koster alltid noe.",
      "Artikkelen oppgir dette som det korteste ikke-trivielle identitets­treet: RPN-lengde K = 9, blad­budsjett fem kopier av 1 pluss én z. Det numeriske verifikasjons­panelet under viser at det returnerer inndataen på forespørsel.",
    ],
    selfdual: [
      "Mat z inn i begge spor. Operatoren løper i to retninger samtidig: en eksponentiell eksplosjon på den ene siden, et logaritmisk krip på den andre, begge forankret i samme punkt.",
      "Bildet er ikke lenger en kjent funksjon — det har intet klassisk navn. Det er ganske enkelt eᶻ − ln z, et atom i det nye alfabetet, som ser på seg selv.",
    ],
    twin: [
      "To EML parallelt, speilet ved inngangene: eml(eml(z, 1), eml(1, z)). En eksponential av eᶻ på den ene siden; en logaritme av e − ln z på den andre. De to grenene møtes på midten og det resulterende feltet puster.",
    ],
    "param-vortex": [
      "Vi legger til en kompleks parameter p — ingen ny primitiv, bare et håndtak på de eksisterende. Vri på den og singularitetene vandrer; konturene bøyer seg; feltet roterer som sett gjennom væske.",
      "I Atelieret kan du holde dette håndtaket selv.",
    ],
    cathedral: [
      "Dybde fire, fem grener. Eksponentialens appetitt for ubegrenset vekst og logaritmens appetitt for singulariteter møtes i stor skala. Domenefarging viser glassmaleriet: hver kulør er argumentet til w, hver ring en dobling i størrelse.",
      "Ingenting her er pynt. Mønsteret tvinges fram av operatoren.",
    ],
    nebula: [
      "Press treet forbi dybde fem og flyttalls­aritmetikken gir opp først. Artikkelen rapporterer at suksess­ratene for symbolsk regresjon stuper fra 100 % ved dybde 2 til under 1 % ved dybde 5 — EML-ene forsterker så voldsomt at tallene forlater maskinen.",
      "Det som står igjen er stedet der regningen brister. Vi rendrer det likevel — katedralens siste og sterkeste vindu.",
    ],
  },
  limits: {
    complexRequired: {
      k: "krever kompleks",
      v: "Selv for å stave konstanter som i og π må den interne aritmetikken arbeide i det komplekse planet. Ingen rent reell konstruksjon finnes.",
    },
    branchCuts: {
      k: "grenskutt",
      v: "ln i det komplekse planet har et sprang på 2πi over den negative realaksen. EML arver arret; noen rekonstruksjoner trenger en manuell korreksjon for å passe den klassiske funksjonen på tvers av snittet.",
    },
    overflow: {
      k: "overflyt ved dybde",
      v: "Stablede eksponentialer vokser dobbelt. Symbolsk regresjon lykkes til 100 % ved dybde 2, ~25 % ved 3–4, under 1 % ved 5. Aritmetikken går tom for plass.",
    },
    nonSelfGen: {
      k: "ikke selvgenererende",
      v: "I motsetning til NAND kan ikke EML syntetisere sin terminale konstant 1 fra vilkårlig inndata. Ettallet må gis.",
    },
    notFullyUniversal: {
      k: "ikke fullt universell",
      v: "Noen elementære funksjoner unnslipper påviselig ethvert endelig EML-tre. Rekkevidden er bred, ikke total.",
    },
  },
  complexityRpnInfo:
    "RPN (omvendt polsk notasjon) skriver treet uten parenteser. Lengden K teller hvert atom og hver operator én gang.",
  complexityRows: {
    constant: "kalkylens eneste konstant",
    exp: "eml(x, 1)",
    ln: "dybde 3, tre nøstede EML",
    id: "dybde 4, trådd gjennom e ∘ ln",
    mul: "to variabler, funnet ved symbolsk regresjon",
    pow: "to variabler, rask vekst",
    neg: "−x, overraskende vanskelig å stave",
    sqrt: "nedre grense ved uttømmende søk",
  },
};

export const BODIES: Record<Locale, BodyDict> = { en, de, es, fr, it, pt, sv, no };
