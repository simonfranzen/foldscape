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
        formula:
          "c \\equiv m^{e} \\pmod{n}, \\qquad m \\equiv c^{d} \\pmod{n}, \\qquad e\\,d \\equiv 1 \\pmod{\\varphi(n)}",
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
        formula:
          "c \\equiv m^{e} \\pmod{n}, \\qquad m \\equiv c^{d} \\pmod{n}, \\qquad e\\,d \\equiv 1 \\pmod{\\varphi(n)}",
      },
      {
        heading: "Was die Regler bewirken",
        paragraphs: [
          "Die beiden Auswahllisten bieten die Primzahlen von 11 bis 97. Die Seite startet mit dem Lehrbuchschlüssel p = 17 und q = 11, also n = 187 und φ(n) = 160. Zweimal dieselbe Primzahl lehnt die Seite ab, weil die Formel für φ(n) dann nicht mehr stimmt.",
          "Das Exponenten-Menü zeigt nur Kandidaten, die wirklich funktionieren: Zahlen aus einer festen Liste (3, 5, 7 und so weiter bis 61, dazu 65537), die kleiner als φ(n) und teilerfremd dazu sind. Bei φ(n) = 160 fällt die 5 weg, weil 160 durch 5 teilbar ist. 65537, der Exponent fast aller echten RSA-Schlüssel, taucht nie auf: Das größte mögliche φ(n) ist hier 96 · 88 = 8448. Machen neue Primzahlen dein e ungültig, springt die Seite auf das erste gültige.",
          "Das Klartextfeld nimmt jede ganze Zahl von 0 bis n − 1 an; voreingestellt ist 88. Das Textfeld kodiert die Buchstaben a bis z als 1 bis 26 und verschlüsselt jeden Buchstaben als eigenen Block (bis zu 32 Zeichen). Der Schritt-Schalter blendet die Tabellen ein oder aus, und Reset stellt die Standardwerte und das Wort «rsa» wieder her.",
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
};
