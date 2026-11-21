import type { ExplorerGuide } from "./types";

// Numbers quoted here (primes 11 to 97, the e candidate list, defaults
// p = 17, q = 11, e = 7, m = 88, the 32-character text limit) match
// app/rsa/explorer/page.tsx; update both together.
const MODPOW_EXCERPT = `// Square-and-multiply mod n, exponent bits read MSB first
const bits: Array<0 | 1> = [];
let e = exp;
while (e > 0n) {
  bits.push((e & 1n) === 1n ? 1 : 0);
  e >>= 1n;
}
bits.reverse();
let result = 1n;
for (let i = 0; i < bits.length; i++) {
  const squared = (result * result) % mod;
  let acc = squared;
  if (i === 0) acc = bits[i] === 1 ? base % mod : 1n;
  else if (bits[i] === 1) acc = (squared * base) % mod;
  result = acc;
}`;

const RSA_FORMULA =
  "c \\equiv m^{e} \\pmod{n}, \\qquad m \\equiv c^{d} \\pmod{n}, \\qquad e\\,d \\equiv 1 \\pmod{\\varphi(n)}";

export const RSA_GUIDE: ExplorerGuide = {
  en: {
    metaDescription:
      "Build a toy RSA key step by step: pick primes p and q, get φ(n), derive d with the extended Euclidean algorithm and trace square-and-multiply encryption.",
    heading: "How this explorer works",
    intro:
      "Everything on this page is one RSA key pair, built from two small primes and used to lock and unlock a single number. The tables show every division of the extended Euclidean algorithm that produces the private exponent, and every squaring and multiplication that turns plaintext into ciphertext and back. The numbers are tiny on purpose; real RSA works the same way with primes hundreds of digits long.",
    sections: [
      {
        heading: "The idea in four lines",
        paragraphs: [
          "Choose two different primes p and q and multiply them: n = p · q is the public modulus. Then compute φ(n) = (p − 1)(q − 1), the number of integers below n that share no factor with n. The public exponent e must be coprime to φ(n), and the private exponent d is its inverse modulo φ(n), which means that e · d leaves remainder 1 when divided by φ(n). Encryption raises the message m to the power e, decryption raises the result to the power d, both modulo n.",
          "Why does the round trip work? Because e · d = 1 + k · φ(n) for some integer k, and Euler's theorem says that m to the power φ(n) is 1 modulo n whenever m and n are coprime. So m to the power e · d is m times a power of 1, which is m again. (Thanks to the Chinese remainder theorem it even works when m shares a factor with n.) The security rests on one asymmetry: multiplying p and q is easy, recovering them from a modulus with hundreds of digits is believed to be infeasible, and without them there is no φ(n) and no d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "What the controls do",
        paragraphs: [
          "The two dropdowns offer the primes from 11 to 97. The page starts with the textbook key p = 17 and q = 11, which gives n = 187 and φ(n) = 160. Picking the same prime twice is refused, because the formula for φ(n) would no longer hold.",
          "The exponent menu only lists candidates that actually work: numbers from a fixed list (3, 5, 7 and so on up to 61, plus 65537) that are smaller than φ(n) and coprime to it. For φ(n) = 160 that rules out 5, because 160 is divisible by 5. 65537, the exponent of almost every real RSA key, never shows up: the largest possible φ(n) here is 96 · 88 = 8448. If new primes make your e invalid, the page switches to the first valid one.",
          "The plaintext field accepts any integer from 0 to n − 1; the default is 88. The text field encodes each letter a to z as 1 to 26 and encrypts every letter as its own block (up to 32 characters). The step toggle shows or hides the tables, and reset restores the defaults and the word «rsa».",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "All arithmetic uses JavaScript BigInt, so there is no floating point anywhere and nothing is rounded. Every value is derived from the inputs during rendering with React's useMemo; there is no canvas and no animation, so reduced-motion settings have nothing to switch off.",
          "The private exponent comes from the extended Euclidean algorithm, run on the pair (e, φ(n)). Each row of the first table is one division, with the two Bézout coefficients s and t updated alongside. When the remainder reaches zero, the last nonzero remainder is gcd(e, φ(n)) = 1, and s satisfies e · s + φ(n) · t = 1. Because s can be negative, the page reduces it modulo φ(n) to get d. For the default key that gives d = 23, and indeed 7 · 23 = 161 = 160 + 1.",
          "Encryption and decryption use square-and-multiply. The exponent is written in binary and read from the most significant bit: every bit squares the accumulator, and every 1 bit also multiplies it by the base. That costs at most two multiplications per bit instead of e − 1 in total, which is what makes exponents of 2048 bits practical. The real function also records every intermediate value for the trace.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Why this is not real security",
        paragraphs: [
          "Two things make this toy breakable instantly. First, n is at most 97 · 89 = 8633, so trial division finds p and q at once. Second, the text mode is textbook RSA without padding: the same letter always produces the same ciphertext, and the letter a, encoded as 1, encrypts to 1 under every key, because 1 to any power is 1. Real systems add randomised padding such as OAEP and use moduli of 2048 bits or more.",
        ],
      },
    ],
    experimentsHeading: "Try this",
    experiments: [
      {
        title: "Verify the textbook example",
        text: "Keep the defaults. With m = 88, e = 7 and n = 187 the ciphertext is 11, and 11 raised to d = 23 modulo 187 brings back 88. The exponent 7 is 111 in binary, so the encryption trace has exactly three rows.",
      },
      {
        title: "Find a key that is its own inverse",
        text: "Choose p = 11, q = 13 and e = 11. Now φ(n) = 120, and 11 · 11 = 121 leaves remainder 1, so d = 11 as well: the same operation locks and unlocks the message.",
      },
      {
        title: "Spot the fixed points",
        text: "With the default key, try m = 0, m = 1 and m = 186. All three encrypt to themselves. 186 is −1 modulo 187, and −1 to an odd power stays −1.",
      },
      {
        title: "Watch the missing padding",
        text: "Type «banana» into the text field. Every a turns into 1 and every n into the same ciphertext number, so the repetition pattern of the word is plainly visible in the ciphertext column.",
      },
    ],
  },
  de: {
    metaDescription:
      "Einen RSA-Schlüssel Schritt für Schritt bauen: Primzahlen p und q wählen, φ(n) sehen, d mit dem erweiterten Euklid finden und die Verschlüsselung nachrechnen.",
    heading: "So funktioniert dieser Explorer",
    intro:
      "Alles auf dieser Seite ist ein einziges RSA-Schlüsselpaar, gebaut aus zwei kleinen Primzahlen und benutzt, um eine Zahl zu verschließen und wieder zu öffnen. Die Tabellen zeigen jede Division des erweiterten euklidischen Algorithmus, der den privaten Exponenten liefert, und jedes Quadrieren und Multiplizieren auf dem Weg vom Klartext zum Geheimtext und zurück. Die Zahlen sind absichtlich winzig; echtes RSA funktioniert genauso, nur mit Primzahlen von Hunderten Stellen.",
    sections: [
      {
        heading: "Die Idee in vier Zeilen",
        paragraphs: [
          "Du wählst zwei verschiedene Primzahlen p und q und multiplizierst sie: n = p · q ist der öffentliche Modul. Dann berechnest du φ(n) = (p − 1)(q − 1), die Anzahl der Zahlen unter n, die mit n keinen gemeinsamen Teiler haben. Der öffentliche Exponent e muss teilerfremd zu φ(n) sein, und der private Exponent d ist sein Inverses modulo φ(n). Das heißt: e · d lässt bei Division durch φ(n) den Rest 1. Verschlüsseln heißt, die Nachricht m mit e zu potenzieren, Entschlüsseln, das Ergebnis mit d zu potenzieren, beides modulo n.",
          "Warum kommt am Ende wieder m heraus? Weil e · d = 1 + k · φ(n) für eine ganze Zahl k gilt, und der Satz von Euler sagt, dass m hoch φ(n) modulo n gleich 1 ist, sobald m und n teilerfremd sind. Also ist m hoch e · d gleich m mal einer Potenz von 1, und das ist wieder m. (Dank des chinesischen Restsatzes klappt das sogar, wenn m einen Faktor mit n teilt.) Die Sicherheit beruht auf einer Asymmetrie: p und q zu multiplizieren ist leicht, sie aus einem Modul mit Hunderten Stellen zurückzugewinnen gilt als praktisch unmöglich, und ohne sie gibt es weder φ(n) noch d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die beiden Auswahllisten bieten die Primzahlen von 11 bis 97. Die Seite startet mit dem Lehrbuchschlüssel p = 17 und q = 11, also n = 187 und φ(n) = 160. Zweimal dieselbe Primzahl lehnt die Seite ab, weil die Formel für φ(n) dann nicht mehr stimmt.",
          "Das Exponenten-Menü zeigt nur Kandidaten, die wirklich funktionieren: Zahlen aus einer festen Liste (3, 5, 7 und so weiter bis 61, dazu 65537), die kleiner als φ(n) und teilerfremd dazu sind. Bei φ(n) = 160 fällt die 5 weg, weil 160 durch 5 teilbar ist. 65537, der Exponent fast aller echten RSA-Schlüssel, taucht nie auf: Das größte mögliche φ(n) ist hier 96 · 88 = 8448. Machen neue Primzahlen dein e ungültig, springt die Seite auf das erste gültige.",
          "Das Klartextfeld nimmt jede ganze Zahl von 0 bis n − 1 an; voreingestellt ist 88. Das Textfeld kodiert die Buchstaben a bis z als 1 bis 26 und verschlüsselt jeden Buchstaben als eigenen Block (bis zu 32 Zeichen). Der Schritt-Schalter («Step animation») blendet die Tabellen ein oder aus, und «Reset to defaults» stellt die Standardwerte und das Wort «rsa» wieder her.",
        ],
      },
      {
        heading: "Wie es gebaut ist",
        paragraphs: [
          "Die gesamte Arithmetik läuft mit JavaScript-BigInt, es gibt also nirgends Gleitkommazahlen und nichts wird gerundet. Jeder Wert wird beim Rendern mit Reacts useMemo aus den Eingaben abgeleitet; es gibt kein Canvas und keine Animation, eine Einstellung für reduzierte Bewegung hat hier also nichts abzuschalten.",
          "Der private Exponent stammt aus dem erweiterten euklidischen Algorithmus, angewandt auf das Paar (e, φ(n)). Jede Zeile der ersten Tabelle ist eine Division, die beiden Bézout-Koeffizienten s und t laufen nebenher mit. Wird der Rest null, ist der letzte Rest ungleich null gerade ggT(e, φ(n)) = 1, und s erfüllt e · s + φ(n) · t = 1. Weil s negativ sein kann, reduziert die Seite es modulo φ(n) und erhält d. Beim Standardschlüssel ergibt das d = 23, und tatsächlich ist 7 · 23 = 161 = 160 + 1.",
          "Ver- und Entschlüsselung nutzen Square-and-Multiply. Der Exponent wird binär geschrieben und vom höchsten Bit an gelesen: Jedes Bit quadriert den Akkumulator, jedes 1-Bit multipliziert zusätzlich mit der Basis. Das kostet höchstens zwei Multiplikationen pro Bit statt insgesamt e − 1, und erst das macht Exponenten mit 2048 Bit praktikabel. Die echte Funktion merkt sich zusätzlich jeden Zwischenwert für die Spur.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Warum das keine echte Sicherheit ist",
        paragraphs: [
          "Zwei Dinge machen dieses Spielzeug sofort knackbar. Erstens ist n höchstens 97 · 89 = 8633, Probedivision findet p und q also sofort. Zweitens ist der Textmodus Lehrbuch-RSA ohne Padding: Derselbe Buchstabe ergibt immer denselben Geheimtext, und der Buchstabe a, kodiert als 1, wird unter jedem Schlüssel zu 1, weil 1 hoch irgendwas 1 bleibt. Echte Systeme fügen ein zufälliges Padding wie OAEP hinzu und nutzen Moduln mit 2048 Bit oder mehr.",
        ],
      },
    ],
    experimentsHeading: "Probier das aus",
    experiments: [
      {
        title: "Das Lehrbuchbeispiel prüfen",
        text: "Lass die Standardwerte stehen. Mit m = 88, e = 7 und n = 187 ist der Geheimtext 11, und 11 hoch d = 23 modulo 187 ergibt wieder 88. Der Exponent 7 ist binär 111, deshalb hat die Verschlüsselungsspur genau drei Zeilen.",
      },
      {
        title: "Ein Schlüssel, der sein eigenes Inverses ist",
        text: "Wähle p = 11, q = 13 und e = 11. Jetzt ist φ(n) = 120, und 11 · 11 = 121 lässt den Rest 1. Also ist auch d = 11: Dieselbe Operation verschließt und öffnet die Nachricht.",
      },
      {
        title: "Fixpunkte finden",
        text: "Probier mit dem Standardschlüssel m = 0, m = 1 und m = 186. Alle drei werden auf sich selbst verschlüsselt. 186 ist −1 modulo 187, und −1 hoch eine ungerade Zahl bleibt −1.",
      },
      {
        title: "Das fehlende Padding sehen",
        text: "Tipp «banana» ins Textfeld. Jedes a wird zu 1 und jedes n zur selben Geheimzahl, das Wiederholungsmuster des Wortes ist in der Geheimtextspalte also deutlich zu erkennen.",
      },
    ],
  },
  es: {
    metaDescription:
      "Construye una clave RSA de juguete paso a paso: elige los primos p y q, obtén φ(n), deduce d con el algoritmo de Euclides extendido y sigue el cifrado.",
    heading: "Cómo funciona este explorador",
    intro:
      "Todo lo que hay en esta página es un único par de claves RSA, construido a partir de dos primos pequeños y usado para cerrar y abrir un solo número. Las tablas muestran cada división del algoritmo de Euclides extendido que produce el exponente privado, y cada elevación al cuadrado y cada multiplicación que convierten el texto claro en texto cifrado y viceversa. Los números son diminutos a propósito; el RSA real funciona igual, con primos de cientos de cifras.",
    sections: [
      {
        heading: "La idea en cuatro líneas",
        paragraphs: [
          "Elige dos primos distintos p y q y multiplícalos: n = p · q es el módulo público. Calcula después φ(n) = (p − 1)(q − 1), la cantidad de enteros menores que n que no comparten ningún factor con n. El exponente público e tiene que ser coprimo con φ(n), y el exponente privado d es su inverso módulo φ(n), es decir, e · d deja resto 1 al dividirlo entre φ(n). Cifrar consiste en elevar el mensaje m a la potencia e, y descifrar en elevar el resultado a la potencia d, en ambos casos módulo n.",
          "¿Por qué funciona el viaje de ida y vuelta? Porque e · d = 1 + k · φ(n) para algún entero k, y el teorema de Euler dice que m elevado a φ(n) es 1 módulo n siempre que m y n sean coprimos. Así, m elevado a e · d es m por una potencia de 1, o sea, m otra vez. (Gracias al teorema chino del resto funciona incluso cuando m comparte un factor con n.) La seguridad descansa en una asimetría: multiplicar p y q es fácil, recuperarlos a partir de un módulo de cientos de cifras se considera inviable, y sin ellos no hay φ(n) ni d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "Qué hacen los controles",
        paragraphs: [
          "Los dos desplegables ofrecen los primos del 11 al 97. La página arranca con la clave de manual p = 17 y q = 11, que da n = 187 y φ(n) = 160. Elegir dos veces el mismo primo no está permitido, porque la fórmula de φ(n) dejaría de ser válida.",
          "El menú del exponente solo lista candidatos que funcionan de verdad: números de una lista fija (3, 5, 7 y así hasta 61, más 65 537) que son menores que φ(n) y coprimos con él. Para φ(n) = 160 eso descarta el 5, porque 160 es divisible entre 5. El 65 537, el exponente de casi todas las claves RSA reales, no aparece nunca: el mayor φ(n) posible aquí es 96 · 88 = 8448. Si unos primos nuevos invalidan tu e, la página pasa al primero que sea válido.",
          "El campo de texto claro admite cualquier entero de 0 a n − 1; el valor por defecto es 88. El campo de texto codifica cada letra de la a a la z como un número del 1 al 26 y cifra cada letra como un bloque propio (hasta 32 caracteres). El interruptor «Step animation» muestra u oculta las tablas, y «Reset to defaults» restaura los valores por defecto y la palabra «rsa».",
        ],
      },
      {
        heading: "Cómo está construido",
        paragraphs: [
          "Toda la aritmética usa BigInt de JavaScript, así que no hay coma flotante en ninguna parte y no se redondea nada. Cada valor se deriva de las entradas durante el renderizado con useMemo de React; no hay lienzo ni animación, de modo que los ajustes de movimiento reducido no tienen nada que desactivar.",
          "El exponente privado sale del algoritmo de Euclides extendido, aplicado al par (e, φ(n)). Cada fila de la primera tabla es una división, y los dos coeficientes de Bézout s y t se actualizan a la par. Cuando el resto llega a cero, el último resto no nulo es mcd(e, φ(n)) = 1, y s cumple e · s + φ(n) · t = 1. Como s puede ser negativo, la página lo reduce módulo φ(n) para obtener d. Con la clave por defecto resulta d = 23 y, en efecto, 7 · 23 = 161 = 160 + 1.",
          "El cifrado y el descifrado usan el método de elevar al cuadrado y multiplicar (square-and-multiply). El exponente se escribe en binario y se lee desde el bit más significativo: cada bit eleva al cuadrado el acumulador, y cada bit a 1 lo multiplica además por la base. Eso cuesta como mucho dos multiplicaciones por bit, en lugar de e − 1 en total, y es lo que hace practicables los exponentes de 2048 bits. La función real registra además cada valor intermedio para la traza.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Por qué esto no es seguridad de verdad",
        paragraphs: [
          "Dos cosas hacen que este juguete se rompa al instante. La primera: n vale como mucho 97 · 89 = 8633, así que la división por tentativa encuentra p y q de inmediato. La segunda: el modo de texto es RSA de manual sin relleno (padding): la misma letra produce siempre el mismo texto cifrado, y la letra a, codificada como 1, se cifra como 1 con cualquier clave, porque 1 elevado a lo que sea es 1. Los sistemas reales añaden un relleno aleatorio como OAEP y usan módulos de 2048 bits o más.",
        ],
      },
    ],
    experimentsHeading: "Prueba esto",
    experiments: [
      {
        title: "Comprueba el ejemplo de manual",
        text: "Deja los valores por defecto. Con m = 88, e = 7 y n = 187 el texto cifrado es 11, y 11 elevado a d = 23 módulo 187 devuelve 88. El exponente 7 es 111 en binario, así que la traza del cifrado tiene exactamente tres filas.",
      },
      {
        title: "Encuentra una clave que es su propio inverso",
        text: "Elige p = 11, q = 13 y e = 11. Ahora φ(n) = 120, y 11 · 11 = 121 deja resto 1, así que también d = 11: la misma operación cierra y abre el mensaje.",
      },
      {
        title: "Localiza los puntos fijos",
        text: "Con la clave por defecto, prueba m = 0, m = 1 y m = 186. Los tres se cifran como ellos mismos. 186 es −1 módulo 187, y −1 elevado a una potencia impar sigue siendo −1.",
      },
      {
        title: "Observa la falta de relleno",
        text: "Escribe «banana» en el campo de texto. Cada a se convierte en 1 y cada n en el mismo número cifrado, de modo que el patrón de repeticiones de la palabra se ve a simple vista en la columna del texto cifrado.",
      },
    ],
  },
  fr: {
    metaDescription:
      "Construis une clé RSA jouet pas à pas : choisis les premiers p et q, obtiens φ(n), calcule d par l'algorithme d'Euclide étendu et suis le chiffrement RSA.",
    heading: "Comment fonctionne cet explorateur",
    intro:
      "Tout ce que montre cette page tient en une seule paire de clés RSA, construite à partir de deux petits nombres premiers et utilisée pour verrouiller puis déverrouiller un unique nombre. Les tableaux détaillent chaque division de l'algorithme d'Euclide étendu qui fournit l'exposant privé, ainsi que chaque élévation au carré et chaque multiplication qui transforment le texte clair en texte chiffré, et inversement. Les nombres sont minuscules à dessein ; le vrai RSA fonctionne de la même façon, avec des nombres premiers de plusieurs centaines de chiffres.",
    sections: [
      {
        heading: "L'idée en quatre lignes",
        paragraphs: [
          "Choisis deux nombres premiers distincts p et q et multiplie-les : n = p · q est le module public. Calcule ensuite φ(n) = (p − 1)(q − 1), le nombre d'entiers inférieurs à n qui n'ont aucun facteur commun avec n. L'exposant public e doit être premier avec φ(n), et l'exposant privé d est son inverse modulo φ(n), ce qui signifie que e · d laisse un reste de 1 dans la division par φ(n). Chiffrer, c'est élever le message m à la puissance e ; déchiffrer, c'est élever le résultat à la puissance d, dans les deux cas modulo n.",
          "Pourquoi l'aller-retour fonctionne-t-il ? Parce que e · d = 1 + k · φ(n) pour un certain entier k, et que le théorème d'Euler affirme que m à la puissance φ(n) vaut 1 modulo n dès que m et n sont premiers entre eux. Donc m à la puissance e · d est égal à m fois une puissance de 1, c'est-à-dire de nouveau m. (Grâce au théorème des restes chinois, cela marche même quand m a un facteur commun avec n.) La sécurité repose sur une asymétrie : multiplier p et q est facile, les retrouver à partir d'un module de plusieurs centaines de chiffres est considéré comme infaisable, et sans eux, pas de φ(n) ni de d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "À quoi servent les commandes",
        paragraphs: [
          "Les deux listes déroulantes proposent les nombres premiers de 11 à 97. La page démarre avec la clé d'école p = 17 et q = 11, ce qui donne n = 187 et φ(n) = 160. Choisir deux fois le même nombre premier est refusé, car la formule de φ(n) ne serait plus valable.",
          "Le menu de l'exposant ne liste que des candidats qui fonctionnent vraiment : des nombres tirés d'une liste fixe (3, 5, 7 et ainsi de suite jusqu'à 61, plus 65 537) qui sont inférieurs à φ(n) et premiers avec lui. Pour φ(n) = 160, cela exclut 5, puisque 160 est divisible par 5. 65 537, l'exposant de presque toutes les vraies clés RSA, n'apparaît jamais : le plus grand φ(n) possible ici est 96 · 88 = 8 448. Si de nouveaux nombres premiers rendent ton e invalide, la page bascule sur le premier qui convient.",
          "Le champ du texte clair accepte tout entier de 0 à n − 1 ; la valeur par défaut est 88. Le champ de texte code chaque lettre de a à z par un nombre de 1 à 26 et chiffre chaque lettre comme un bloc à part (32 caractères au maximum). L'interrupteur « Step animation » affiche ou masque les tableaux, et « Reset to defaults » rétablit les valeurs par défaut ainsi que le mot « rsa ».",
        ],
      },
      {
        heading: "Comment c'est construit",
        paragraphs: [
          "Toute l'arithmétique passe par les BigInt de JavaScript : il n'y a donc de virgule flottante nulle part et rien n'est arrondi. Chaque valeur est dérivée des entrées au moment du rendu avec le useMemo de React ; il n'y a ni canevas ni animation, si bien que la réduction des animations n'a rien à désactiver.",
          "L'exposant privé provient de l'algorithme d'Euclide étendu, appliqué au couple (e, φ(n)). Chaque ligne du premier tableau correspond à une division, et les deux coefficients de Bézout s et t sont mis à jour en parallèle. Quand le reste atteint zéro, le dernier reste non nul est pgcd(e, φ(n)) = 1, et s vérifie e · s + φ(n) · t = 1. Comme s peut être négatif, la page le réduit modulo φ(n) pour obtenir d. Pour la clé par défaut, cela donne d = 23, et en effet 7 · 23 = 161 = 160 + 1.",
          "Le chiffrement et le déchiffrement utilisent l'exponentiation rapide (square-and-multiply). L'exposant est écrit en binaire et lu à partir du bit de poids fort : chaque bit élève l'accumulateur au carré, et chaque bit à 1 le multiplie en plus par la base. Cela coûte au plus deux multiplications par bit au lieu de e − 1 au total, et c'est ce qui rend praticables des exposants de 2 048 bits. La fonction réelle enregistre en outre chaque valeur intermédiaire pour la trace.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Pourquoi ce n'est pas une vraie sécurité",
        paragraphs: [
          "Deux choses rendent ce jouet cassable instantanément. D'abord, n vaut au plus 97 · 89 = 8 633, de sorte que des divisions successives trouvent p et q tout de suite. Ensuite, le mode texte est du RSA d'école sans remplissage (padding) : la même lettre produit toujours le même texte chiffré, et la lettre a, codée par 1, se chiffre en 1 avec n'importe quelle clé, puisque 1 à n'importe quelle puissance vaut 1. Les systèmes réels ajoutent un remplissage aléatoire tel qu'OAEP et utilisent des modules de 2 048 bits ou plus.",
        ],
      },
    ],
    experimentsHeading: "À essayer",
    experiments: [
      {
        title: "Vérifie l'exemple d'école",
        text: "Garde les valeurs par défaut. Avec m = 88, e = 7 et n = 187, le texte chiffré est 11, et 11 élevé à la puissance d = 23 modulo 187 redonne 88. L'exposant 7 s'écrit 111 en binaire, la trace du chiffrement compte donc exactement trois lignes.",
      },
      {
        title: "Trouve une clé qui est son propre inverse",
        text: "Choisis p = 11, q = 13 et e = 11. On a maintenant φ(n) = 120, et 11 · 11 = 121 laisse un reste de 1, donc d = 11 aussi : la même opération verrouille et déverrouille le message.",
      },
      {
        title: "Repère les points fixes",
        text: "Avec la clé par défaut, essaie m = 0, m = 1 et m = 186. Tous les trois se chiffrent en eux-mêmes. 186 vaut −1 modulo 187, et −1 à une puissance impaire reste −1.",
      },
      {
        title: "Observe l'absence de remplissage",
        text: "Tape « banana » dans le champ de texte. Chaque a devient 1 et chaque n le même nombre chiffré, si bien que le motif de répétition du mot se lit sans peine dans la colonne du texte chiffré.",
      },
    ],
  },
  it: {
    metaDescription:
      "Costruisci passo dopo passo una chiave RSA giocattolo: scegli i primi p e q, ottieni φ(n), ricava d con l'algoritmo di Euclide esteso e segui la cifratura.",
    heading: "Come funziona questo esploratore",
    intro:
      "Tutto ciò che vedi in questa pagina è un'unica coppia di chiavi RSA, costruita a partire da due numeri primi piccoli e usata per chiudere e riaprire un solo numero. Le tabelle mostrano ogni divisione dell'algoritmo di Euclide esteso che produce l'esponente privato, e ogni elevamento al quadrato e ogni moltiplicazione che trasformano il testo in chiaro in testo cifrato e viceversa. I numeri sono minuscoli di proposito; l'RSA vero funziona allo stesso modo, con primi lunghi centinaia di cifre.",
    sections: [
      {
        heading: "L'idea in quattro righe",
        paragraphs: [
          "Scegli due numeri primi diversi p e q e moltiplicali: n = p · q è il modulo pubblico. Calcola poi φ(n) = (p − 1)(q − 1), il numero di interi minori di n che non hanno fattori in comune con n. L'esponente pubblico e deve essere coprimo con φ(n), e l'esponente privato d è il suo inverso modulo φ(n), cioè e · d dà resto 1 nella divisione per φ(n). Cifrare significa elevare il messaggio m alla potenza e, decifrare significa elevare il risultato alla potenza d, in entrambi i casi modulo n.",
          "Perché il viaggio di andata e ritorno funziona? Perché e · d = 1 + k · φ(n) per un certo intero k, e il teorema di Eulero dice che m elevato a φ(n) è 1 modulo n ogni volta che m e n sono coprimi. Quindi m elevato a e · d è m per una potenza di 1, cioè di nuovo m. (Grazie al teorema cinese del resto funziona perfino quando m ha un fattore in comune con n.) La sicurezza poggia su un'asimmetria: moltiplicare p e q è facile, ricavarli da un modulo di centinaia di cifre è ritenuto impraticabile, e senza di loro non ci sono né φ(n) né d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "Che cosa fanno i controlli",
        paragraphs: [
          "I due menu a tendina offrono i numeri primi da 11 a 97. La pagina parte con la chiave da manuale p = 17 e q = 11, che dà n = 187 e φ(n) = 160. Scegliere due volte lo stesso primo non è ammesso, perché la formula per φ(n) non varrebbe più.",
          "Il menu dell'esponente elenca solo candidati che funzionano davvero: numeri presi da una lista fissa (3, 5, 7 e così via fino a 61, più 65537) che sono minori di φ(n) e coprimi con esso. Per φ(n) = 160 questo esclude il 5, perché 160 è divisibile per 5. Il 65537, l'esponente di quasi tutte le chiavi RSA reali, non compare mai: il massimo φ(n) possibile qui è 96 · 88 = 8448. Se dei nuovi primi rendono non valido il tuo e, la pagina passa al primo valido.",
          "Il campo del testo in chiaro accetta qualunque intero da 0 a n − 1; il valore predefinito è 88. Il campo di testo codifica ogni lettera dalla a alla z come un numero da 1 a 26 e cifra ciascuna lettera come un blocco a sé (fino a 32 caratteri). L'interruttore «Step animation» mostra o nasconde le tabelle, e «Reset to defaults» ripristina i valori predefiniti e la parola «rsa».",
        ],
      },
      {
        heading: "Com'è costruito",
        paragraphs: [
          "Tutta l'aritmetica usa i BigInt di JavaScript, quindi non c'è virgola mobile da nessuna parte e nulla viene arrotondato. Ogni valore è derivato dagli input durante il rendering con useMemo di React; non ci sono né canvas né animazioni, perciò le impostazioni di movimento ridotto non hanno nulla da disattivare.",
          "L'esponente privato viene dall'algoritmo di Euclide esteso, applicato alla coppia (e, φ(n)). Ogni riga della prima tabella è una divisione, con i due coefficienti di Bézout s e t aggiornati di pari passo. Quando il resto arriva a zero, l'ultimo resto non nullo è MCD(e, φ(n)) = 1, e s soddisfa e · s + φ(n) · t = 1. Poiché s può essere negativo, la pagina lo riduce modulo φ(n) per ottenere d. Per la chiave predefinita risulta d = 23, e in effetti 7 · 23 = 161 = 160 + 1.",
          "Cifratura e decifratura usano il metodo «quadra e moltiplica» (square-and-multiply). L'esponente viene scritto in binario e letto a partire dal bit più significativo: ogni bit eleva al quadrato l'accumulatore, e ogni bit a 1 lo moltiplica in più per la base. Il costo è al massimo di due moltiplicazioni per bit invece di e − 1 in totale, ed è questo a rendere praticabili esponenti di 2048 bit. La funzione reale registra inoltre ogni valore intermedio per la traccia.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Perché questa non è vera sicurezza",
        paragraphs: [
          "Due cose rendono questo giocattolo violabile all'istante. Primo, n vale al massimo 97 · 89 = 8633, quindi la divisione per tentativi trova subito p e q. Secondo, la modalità testo è RSA da manuale senza padding: la stessa lettera produce sempre lo stesso testo cifrato, e la lettera a, codificata come 1, viene cifrata in 1 con qualunque chiave, perché 1 elevato a qualsiasi potenza è 1. I sistemi reali aggiungono un padding casuale come OAEP e usano moduli di 2048 bit o più.",
        ],
      },
    ],
    experimentsHeading: "Prova così",
    experiments: [
      {
        title: "Verifica l'esempio da manuale",
        text: "Lascia i valori predefiniti. Con m = 88, e = 7 e n = 187 il testo cifrato è 11, e 11 elevato a d = 23 modulo 187 restituisce 88. L'esponente 7 in binario è 111, quindi la traccia della cifratura ha esattamente tre righe.",
      },
      {
        title: "Trova una chiave che è l'inversa di sé stessa",
        text: "Scegli p = 11, q = 13 ed e = 11. Ora φ(n) = 120, e 11 · 11 = 121 dà resto 1, quindi anche d = 11: la stessa operazione chiude e riapre il messaggio.",
      },
      {
        title: "Individua i punti fissi",
        text: "Con la chiave predefinita prova m = 0, m = 1 e m = 186. Tutti e tre vengono cifrati in sé stessi. 186 è −1 modulo 187, e −1 elevato a una potenza dispari resta −1.",
      },
      {
        title: "Osserva il padding che manca",
        text: "Scrivi «banana» nel campo di testo. Ogni a diventa 1 e ogni n lo stesso numero cifrato, così lo schema di ripetizioni della parola si vede chiaramente nella colonna del testo cifrato.",
      },
    ],
  },
  pt: {
    metaDescription:
      "Constrói passo a passo uma chave RSA de brincar: escolhe os primos p e q, obtém φ(n), deduz d com o algoritmo de Euclides estendido e acompanha a cifragem.",
    heading: "Como funciona este explorador",
    intro:
      "Tudo o que está nesta página é um único par de chaves RSA, construído a partir de dois primos pequenos e usado para trancar e destrancar um só número. As tabelas mostram cada divisão do algoritmo de Euclides estendido que produz o expoente privado, e cada quadrado e cada multiplicação que transformam o texto simples em texto cifrado e vice-versa. Os números são minúsculos de propósito; o RSA a sério funciona da mesma maneira, com primos de centenas de algarismos.",
    sections: [
      {
        heading: "A ideia em quatro linhas",
        paragraphs: [
          "Escolhe dois primos diferentes p e q e multiplica-os: n = p · q é o módulo público. Depois calcula φ(n) = (p − 1)(q − 1), o número de inteiros abaixo de n que não partilham nenhum fator com n. O expoente público e tem de ser coprimo com φ(n), e o expoente privado d é o seu inverso módulo φ(n), o que significa que e · d deixa resto 1 na divisão por φ(n). Cifrar é elevar a mensagem m à potência e, decifrar é elevar o resultado à potência d, em ambos os casos módulo n.",
          "Porque é que a viagem de ida e volta funciona? Porque e · d = 1 + k · φ(n) para algum inteiro k, e o teorema de Euler diz que m elevado a φ(n) é 1 módulo n sempre que m e n são coprimos. Logo, m elevado a e · d é m vezes uma potência de 1, ou seja, m outra vez. (Graças ao teorema chinês dos restos, funciona até quando m partilha um fator com n.) A segurança assenta numa assimetria: multiplicar p e q é fácil, recuperá-los a partir de um módulo com centenas de algarismos é considerado inviável, e sem eles não há φ(n) nem d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "O que fazem os controlos",
        paragraphs: [
          "As duas listas pendentes oferecem os primos de 11 a 97. A página arranca com a chave de manual p = 17 e q = 11, o que dá n = 187 e φ(n) = 160. Escolher duas vezes o mesmo primo é recusado, porque a fórmula de φ(n) deixaria de ser válida.",
          "O menu do expoente só lista candidatos que funcionam mesmo: números de uma lista fixa (3, 5, 7 e assim por diante até 61, mais 65537) que são menores do que φ(n) e coprimos com ele. Para φ(n) = 160 isso exclui o 5, porque 160 é divisível por 5. O 65537, o expoente de quase todas as chaves RSA reais, nunca aparece: o maior φ(n) possível aqui é 96 · 88 = 8448. Se novos primos tornarem o teu e inválido, a página muda para o primeiro que seja válido.",
          "O campo do texto simples aceita qualquer inteiro de 0 a n − 1; o valor predefinido é 88. O campo de texto codifica cada letra de a a z como um número de 1 a 26 e cifra cada letra como um bloco próprio (até 32 caracteres). O interruptor «Step animation» mostra ou esconde as tabelas, e «Reset to defaults» repõe os valores predefinidos e a palavra «rsa».",
        ],
      },
      {
        heading: "Como está construído",
        paragraphs: [
          "Toda a aritmética usa BigInt de JavaScript, por isso não há vírgula flutuante em lado nenhum e nada é arredondado. Cada valor é derivado das entradas durante a renderização com o useMemo do React; não há canvas nem animação, pelo que as definições de movimento reduzido não têm nada para desligar.",
          "O expoente privado vem do algoritmo de Euclides estendido, aplicado ao par (e, φ(n)). Cada linha da primeira tabela é uma divisão, com os dois coeficientes de Bézout s e t atualizados em paralelo. Quando o resto chega a zero, o último resto não nulo é mdc(e, φ(n)) = 1, e s satisfaz e · s + φ(n) · t = 1. Como s pode ser negativo, a página redu-lo módulo φ(n) para obter d. Para a chave predefinida isso dá d = 23 e, de facto, 7 · 23 = 161 = 160 + 1.",
          "A cifragem e a decifragem usam o método de elevar ao quadrado e multiplicar (square-and-multiply). O expoente é escrito em binário e lido a partir do bit mais significativo: cada bit eleva o acumulador ao quadrado, e cada bit a 1 multiplica-o ainda pela base. Isso custa no máximo duas multiplicações por bit, em vez de e − 1 no total, e é o que torna praticáveis expoentes de 2048 bits. A função real regista também cada valor intermédio para o traço.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Porque é que isto não é segurança a sério",
        paragraphs: [
          "Duas coisas fazem com que este brinquedo se quebre num instante. Primeiro, n é no máximo 97 · 89 = 8633, pelo que a divisão por tentativas encontra p e q de imediato. Segundo, o modo de texto é RSA de manual sem preenchimento (padding): a mesma letra produz sempre o mesmo texto cifrado, e a letra a, codificada como 1, é cifrada em 1 com qualquer chave, porque 1 elevado a qualquer potência é 1. Os sistemas reais acrescentam um preenchimento aleatório como o OAEP e usam módulos de 2048 bits ou mais.",
        ],
      },
    ],
    experimentsHeading: "Experimenta isto",
    experiments: [
      {
        title: "Verifica o exemplo de manual",
        text: "Mantém os valores predefinidos. Com m = 88, e = 7 e n = 187 o texto cifrado é 11, e 11 elevado a d = 23 módulo 187 devolve 88. O expoente 7 é 111 em binário, por isso o traço da cifragem tem exatamente três linhas.",
      },
      {
        title: "Encontra uma chave que é o seu próprio inverso",
        text: "Escolhe p = 11, q = 13 e e = 11. Agora φ(n) = 120, e 11 · 11 = 121 deixa resto 1, por isso também d = 11: a mesma operação tranca e destranca a mensagem.",
      },
      {
        title: "Descobre os pontos fixos",
        text: "Com a chave predefinida, experimenta m = 0, m = 1 e m = 186. Os três são cifrados em si mesmos. 186 é −1 módulo 187, e −1 elevado a uma potência ímpar continua a ser −1.",
      },
      {
        title: "Repara no preenchimento em falta",
        text: "Escreve «banana» no campo de texto. Cada a transforma-se em 1 e cada n no mesmo número cifrado, pelo que o padrão de repetições da palavra fica bem à vista na coluna do texto cifrado.",
      },
    ],
  },
  sv: {
    metaDescription:
      "Bygg en RSA-nyckel i leksaksformat steg för steg: välj primtalen p och q, få fram φ(n), härled d med Euklides utökade algoritm och följ RSA-krypteringen.",
    heading: "Så fungerar den här utforskaren",
    intro:
      "Allt på den här sidan är ett enda RSA-nyckelpar, byggt av två små primtal och använt för att låsa och låsa upp ett enda tal. Tabellerna visar varje division i Euklides utökade algoritm, som ger den privata exponenten, och varje kvadrering och multiplikation som gör klartext till chiffertext och tillbaka igen. Talen är pyttesmå med flit; riktig RSA fungerar på samma sätt, med primtal som är hundratals siffror långa.",
    sections: [
      {
        heading: "Idén på fyra rader",
        paragraphs: [
          "Välj två olika primtal p och q och multiplicera dem: n = p · q är den offentliga modulen. Beräkna sedan φ(n) = (p − 1)(q − 1), antalet heltal under n som inte har någon gemensam faktor med n. Den offentliga exponenten e måste vara relativt prima med φ(n), och den privata exponenten d är dess invers modulo φ(n), vilket betyder att e · d ger resten 1 vid division med φ(n). Kryptering upphöjer meddelandet m till e, dekryptering upphöjer resultatet till d, båda modulo n.",
          "Varför fungerar resan fram och tillbaka? Därför att e · d = 1 + k · φ(n) för något heltal k, och Eulers sats säger att m upphöjt till φ(n) är 1 modulo n så snart m och n är relativt prima. Alltså är m upphöjt till e · d lika med m gånger en potens av 1, det vill säga m igen. (Tack vare kinesiska restsatsen fungerar det till och med när m har en gemensam faktor med n.) Säkerheten vilar på en asymmetri: att multiplicera p och q är lätt, att få tillbaka dem ur en modul med hundratals siffror anses ogörligt, och utan dem finns varken φ(n) eller d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "Vad reglagen gör",
        paragraphs: [
          "De två rullgardinslistorna erbjuder primtalen från 11 till 97. Sidan startar med läroboksnyckeln p = 17 och q = 11, vilket ger n = 187 och φ(n) = 160. Att välja samma primtal två gånger godtas inte, eftersom formeln för φ(n) då inte längre skulle gälla.",
          "Exponentmenyn listar bara kandidater som faktiskt fungerar: tal ur en fast lista (3, 5, 7 och så vidare upp till 61, plus 65\u00a0537) som är mindre än φ(n) och relativt prima med det. För φ(n) = 160 faller 5 bort, eftersom 160 är delbart med 5. 65\u00a0537, exponenten i nästan alla riktiga RSA-nycklar, dyker aldrig upp: det största möjliga φ(n) här är 96 · 88 = 8448. Om nya primtal gör ditt e ogiltigt byter sidan till det första giltiga.",
          "Klartextfältet tar emot vilket heltal som helst från 0 till n − 1; standardvärdet är 88. Textfältet kodar varje bokstav a till z som 1 till 26 och krypterar varje bokstav som ett eget block (upp till 32 tecken). Omkopplaren ”Step animation” visar eller döljer tabellerna, och ”Reset to defaults” återställer standardvärdena och ordet ”rsa”.",
        ],
      },
      {
        heading: "Hur den är byggd",
        paragraphs: [
          "All aritmetik använder BigInt i JavaScript, så det finns inga flyttal någonstans och ingenting avrundas. Varje värde härleds ur inmatningen under renderingen med Reacts useMemo; det finns ingen canvas och ingen animation, så inställningar för minskad rörelse har inget att stänga av.",
          "Den privata exponenten kommer från Euklides utökade algoritm, körd på paret (e, φ(n)). Varje rad i den första tabellen är en division, och de två Bézoutkoefficienterna s och t uppdateras parallellt. När resten når noll är den sista resten skild från noll lika med sgd(e, φ(n)) = 1, och s uppfyller e · s + φ(n) · t = 1. Eftersom s kan vara negativt reducerar sidan det modulo φ(n) för att få d. För standardnyckeln ger det d = 23, och mycket riktigt är 7 · 23 = 161 = 160 + 1.",
          "Kryptering och dekryptering använder upprepad kvadrering (square-and-multiply). Exponenten skrivs binärt och läses från den mest signifikanta biten: varje bit kvadrerar ackumulatorn, och varje ettbit multiplicerar den dessutom med basen. Det kostar högst två multiplikationer per bit i stället för e − 1 totalt, och det är det som gör exponenter på 2048 bitar praktiskt användbara. Den riktiga funktionen sparar dessutom varje mellanvärde till spåret.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Varför det här inte är riktig säkerhet",
        paragraphs: [
          "Två saker gör att den här leksaken knäcks direkt. För det första är n som mest 97 · 89 = 8633, så provdivision hittar p och q på en gång. För det andra är textläget läroboks-RSA utan utfyllnad (padding): samma bokstav ger alltid samma chiffertext, och bokstaven a, kodad som 1, krypteras till 1 under varje nyckel, eftersom 1 upphöjt till vad som helst är 1. Riktiga system lägger till slumpmässig utfyllnad som OAEP och använder moduler på 2048 bitar eller mer.",
        ],
      },
    ],
    experimentsHeading: "Prova det här",
    experiments: [
      {
        title: "Kontrollera läroboksexemplet",
        text: "Behåll standardvärdena. Med m = 88, e = 7 och n = 187 blir chiffertexten 11, och 11 upphöjt till d = 23 modulo 187 ger tillbaka 88. Exponenten 7 är 111 binärt, så krypteringsspåret har exakt tre rader.",
      },
      {
        title: "Hitta en nyckel som är sin egen invers",
        text: "Välj p = 11, q = 13 och e = 11. Nu är φ(n) = 120, och 11 · 11 = 121 ger resten 1, så även d = 11: samma operation låser och låser upp meddelandet.",
      },
      {
        title: "Hitta fixpunkterna",
        text: "Prova m = 0, m = 1 och m = 186 med standardnyckeln. Alla tre krypteras till sig själva. 186 är −1 modulo 187, och −1 upphöjt till ett udda tal förblir −1.",
      },
      {
        title: "Se utfyllnaden som saknas",
        text: "Skriv ”banana” i textfältet. Varje a blir 1 och varje n samma chiffertal, så ordets upprepningsmönster syns tydligt i chiffertextkolumnen.",
      },
    ],
  },
  no: {
    metaDescription:
      "Bygg en RSA-nøkkel i leketøysformat steg for steg: Velg primtallene p og q, finn φ(n), utled d med Euklids utvidede algoritme og følg RSA-krypteringen.",
    heading: "Slik fungerer denne utforskeren",
    intro:
      "Alt på denne siden er ett eneste RSA-nøkkelpar, bygd av to små primtall og brukt til å låse og låse opp ett enkelt tall. Tabellene viser hver divisjon i Euklids utvidede algoritme, som gir den private eksponenten, og hver kvadrering og multiplikasjon som gjør klartekst til chiffertekst og tilbake igjen. Tallene er bittesmå med vilje; ekte RSA fungerer på samme måte, med primtall som er flere hundre sifre lange.",
    sections: [
      {
        heading: "Ideen på fire linjer",
        paragraphs: [
          "Velg to forskjellige primtall p og q og multipliser dem: n = p · q er den offentlige modulen. Regn deretter ut φ(n) = (p − 1)(q − 1), antallet heltall under n som ikke har noen felles faktor med n. Den offentlige eksponenten e må være innbyrdes primisk med φ(n), og den private eksponenten d er inversen til e modulo φ(n), som betyr at e · d gir rest 1 ved divisjon med φ(n). Kryptering opphøyer meldingen m i e, dekryptering opphøyer resultatet i d, begge deler modulo n.",
          "Hvorfor fungerer turen fram og tilbake? Fordi e · d = 1 + k · φ(n) for et heltall k, og Eulers teorem sier at m opphøyd i φ(n) er 1 modulo n så sant m og n er innbyrdes primiske. Altså er m opphøyd i e · d lik m ganger en potens av 1, og det er m igjen. (Takket være det kinesiske restteoremet fungerer det til og med når m har en felles faktor med n.) Sikkerheten hviler på en asymmetri: Å multiplisere p og q er lett, å finne dem igjen ut fra en modul med flere hundre sifre regnes som ugjørlig, og uten dem finnes verken φ(n) eller d.",
        ],
        formula: RSA_FORMULA,
      },
      {
        heading: "Hva kontrollene gjør",
        paragraphs: [
          "De to nedtrekkslistene tilbyr primtallene fra 11 til 97. Siden starter med læreboknøkkelen p = 17 og q = 11, som gir n = 187 og φ(n) = 160. Å velge samme primtall to ganger blir avvist, fordi formelen for φ(n) da ikke lenger ville holde.",
          "Eksponentmenyen lister bare opp kandidater som faktisk fungerer: tall fra en fast liste (3, 5, 7 og så videre opp til 61, pluss 65\u00a0537) som er mindre enn φ(n) og innbyrdes primiske med det. For φ(n) = 160 faller 5 bort, fordi 160 er delelig med 5. 65\u00a0537, eksponenten i nesten alle ekte RSA-nøkler, dukker aldri opp: Den største mulige φ(n) her er 96 · 88 = 8448. Hvis nye primtall gjør e-en din ugyldig, bytter siden til den første gyldige.",
          "Klartekstfeltet godtar et hvilket som helst heltall fra 0 til n − 1; standardverdien er 88. Tekstfeltet koder hver bokstav fra a til z som 1 til 26 og krypterer hver bokstav som en egen blokk (opptil 32 tegn). Bryteren «Step animation» viser eller skjuler tabellene, og «Reset to defaults» gjenoppretter standardverdiene og ordet «rsa».",
        ],
      },
      {
        heading: "Slik er den bygget",
        paragraphs: [
          "All aritmetikk bruker BigInt i JavaScript, så det finnes ingen flyttall noe sted, og ingenting blir avrundet. Hver verdi utledes fra inndataene under rendringen med Reacts useMemo; det finnes verken lerret eller animasjon, så innstillinger for redusert bevegelse har ingenting å slå av.",
          "Den private eksponenten kommer fra Euklids utvidede algoritme, kjørt på paret (e, φ(n)). Hver rad i den første tabellen er én divisjon, og de to Bézout-koeffisientene s og t oppdateres underveis. Når resten blir null, er den siste resten ulik null lik sfd(e, φ(n)) = 1, og s oppfyller e · s + φ(n) · t = 1. Siden s kan være negativ, reduserer siden den modulo φ(n) for å få d. For standardnøkkelen gir det d = 23, og ganske riktig er 7 · 23 = 161 = 160 + 1.",
          "Kryptering og dekryptering bruker gjentatt kvadrering (square-and-multiply). Eksponenten skrives binært og leses fra den mest signifikante biten: Hver bit kvadrerer akkumulatoren, og hver 1-bit multipliserer den i tillegg med grunntallet. Det koster høyst to multiplikasjoner per bit i stedet for e − 1 totalt, og det er dette som gjør eksponenter på 2048 biter praktisk brukbare. Den virkelige funksjonen lagrer dessuten hver mellomverdi til sporet.",
        ],
        code: MODPOW_EXCERPT,
      },
      {
        heading: "Hvorfor dette ikke er ekte sikkerhet",
        paragraphs: [
          "To ting gjør at dette leketøyet knekkes med en gang. For det første er n høyst 97 · 89 = 8633, så prøvedivisjon finner p og q umiddelbart. For det andre er tekstmodusen lærebok-RSA uten utfylling (padding): Samme bokstav gir alltid samme chiffertekst, og bokstaven a, kodet som 1, krypteres til 1 under enhver nøkkel, fordi 1 opphøyd i hva som helst er 1. Ekte systemer legger til tilfeldig utfylling som OAEP og bruker moduler på 2048 biter eller mer.",
        ],
      },
    ],
    experimentsHeading: "Prøv dette",
    experiments: [
      {
        title: "Kontroller lærebokeksempelet",
        text: "Behold standardverdiene. Med m = 88, e = 7 og n = 187 blir chifferteksten 11, og 11 opphøyd i d = 23 modulo 187 gir 88 tilbake. Eksponenten 7 er 111 binært, så krypteringssporet har nøyaktig tre rader.",
      },
      {
        title: "Finn en nøkkel som er sin egen invers",
        text: "Velg p = 11, q = 13 og e = 11. Nå er φ(n) = 120, og 11 · 11 = 121 gir rest 1, så også d = 11: Den samme operasjonen låser og låser opp meldingen.",
      },
      {
        title: "Finn fikspunktene",
        text: "Prøv m = 0, m = 1 og m = 186 med standardnøkkelen. Alle tre krypteres til seg selv. 186 er −1 modulo 187, og −1 opphøyd i et oddetall forblir −1.",
      },
      {
        title: "Se utfyllingen som mangler",
        text: "Skriv «banana» i tekstfeltet. Hver a blir til 1 og hver n til det samme chiffertallet, så gjentakelsesmønsteret i ordet er godt synlig i chiffertekstkolonnen.",
      },
    ],
  },
};
