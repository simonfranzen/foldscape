"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { Formula } from "@/components/Formula";

const ACCENT = "text-signal-cyan";

// Row ids are locale-independent; the human-readable meaning is looked up per
// locale via WORKED[locale].meanings so all eight languages stay in step.
type KeyRowId = "p" | "q" | "n" | "phi" | "e" | "d";

interface KeyRow {
  id: KeyRowId;
  symbol: string;
  latex: string;
  value: string;
}

const KEY_ROWS: KeyRow[] = [
  { id: "p", symbol: "p", latex: "p", value: "17" },
  { id: "q", symbol: "q", latex: "q", value: "11" },
  { id: "n", symbol: "n", latex: "n = pq", value: "187" },
  { id: "phi", symbol: "φ(n)", latex: "\\varphi(n) = (p-1)(q-1)", value: "160" },
  { id: "e", symbol: "e", latex: "e", value: "7" },
  { id: "d", symbol: "d", latex: "d \\equiv e^{-1} \\bmod \\varphi(n)", value: "23" },
];

// --------------------------------------------------------------------------
// Per-locale copy for the worked-example figure and the story CTA label. The
// four narrative sections come from the shared s.pages.rsa bundle, so this
// dict only carries the figure-specific prose that used to be hardcoded in
// English (badge, title, intro, table headers, row meanings, round trip).
// --------------------------------------------------------------------------
type RichWorked = {
  finalLabel: string;
  workedBadge: string;
  workedTitle: string;
  workedIntro: string;
  symbolHeader: string;
  formulaHeader: string;
  valueHeader: string;
  meaningHeader: string;
  meanings: Record<KeyRowId, string>;
  roundTripBadge: string;
  roundTripEncrypt: string;
  roundTripDecrypt: string;
  roundTripExplain: string;
};

const WORKED: Record<Locale, RichWorked> = {
  en: {
    finalLabel: "Try the maths.",
    workedBadge: "Worked example · a complete key pair on small numbers",
    workedTitle: "p = 17, q = 11: the textbook RSA key.",
    workedIntro:
      "The values below show every quantity in one RSA key. The Explorer lets you change p, q and e, then recomputes the rest, including the extended-Euclidean derivation of d, step by step.",
    symbolHeader: "Symbol",
    formulaHeader: "Formula",
    valueHeader: "Value",
    meaningHeader: "Meaning",
    meanings: {
      p: "first prime (kept secret)",
      q: "second prime (kept secret)",
      n: "modulus (public)",
      phi: "Euler totient (secret)",
      e: "public exponent, coprime to φ(n)",
      d: "private exponent (secret)",
    },
    roundTripBadge: "Round trip",
    roundTripEncrypt: "Encrypt m = 88:",
    roundTripDecrypt: "Decrypt:",
    roundTripExplain:
      "The maths returns the plaintext exactly because 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  de: {
    finalLabel: "Jetzt selbst rechnen.",
    workedBadge: "Durchgerechnetes Beispiel · ein komplettes Schlüsselpaar mit kleinen Zahlen",
    workedTitle: "p = 17, q = 11: der Lehrbuch-RSA-Schlüssel.",
    workedIntro:
      "Die Werte unten zeigen jede Größe eines RSA-Schlüssels. Der Explorer lässt dich p, q und e ändern und berechnet den Rest neu, samt der erweiterten euklidischen Herleitung von d, Schritt für Schritt.",
    symbolHeader: "Symbol",
    formulaHeader: "Formel",
    valueHeader: "Wert",
    meaningHeader: "Bedeutung",
    meanings: {
      p: "erste Primzahl (geheim)",
      q: "zweite Primzahl (geheim)",
      n: "Modul (öffentlich)",
      phi: "eulersche Phi-Funktion (geheim)",
      e: "öffentlicher Exponent, teilerfremd zu φ(n)",
      d: "privater Exponent (geheim)",
    },
    roundTripBadge: "Hin und zurück",
    roundTripEncrypt: "Verschlüsseln m = 88:",
    roundTripDecrypt: "Entschlüsseln:",
    roundTripExplain:
      "Die Mathematik liefert den Klartext exakt zurück, weil 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  es: {
    finalLabel: "Haz las cuentas.",
    workedBadge: "Ejemplo resuelto · un par de claves completo con números pequeños",
    workedTitle: "p = 17, q = 11: la clave RSA de manual.",
    workedIntro:
      "Los valores de abajo muestran cada cantidad de una clave RSA. El Explorador te permite cambiar p, q y e, y recalcula el resto, incluida la derivación de d mediante el algoritmo extendido de Euclides, paso a paso.",
    symbolHeader: "Símbolo",
    formulaHeader: "Fórmula",
    valueHeader: "Valor",
    meaningHeader: "Significado",
    meanings: {
      p: "primer primo (secreto)",
      q: "segundo primo (secreto)",
      n: "módulo (público)",
      phi: "indicatriz de Euler (secreta)",
      e: "exponente público, coprimo con φ(n)",
      d: "exponente privado (secreto)",
    },
    roundTripBadge: "Ida y vuelta",
    roundTripEncrypt: "Cifrar m = 88:",
    roundTripDecrypt: "Descifrar:",
    roundTripExplain:
      "La matemática devuelve el texto claro exactamente porque 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  fr: {
    finalLabel: "Faites le calcul.",
    workedBadge: "Exemple résolu · une paire de clés complète sur de petits nombres",
    workedTitle: "p = 17, q = 11 : la clé RSA de manuel.",
    workedIntro:
      "Les valeurs ci-dessous montrent chaque grandeur d'une clé RSA. L'Explorateur vous laisse changer p, q et e, puis recalcule le reste, y compris la dérivation de d par l'algorithme d'Euclide étendu, étape par étape.",
    symbolHeader: "Symbole",
    formulaHeader: "Formule",
    valueHeader: "Valeur",
    meaningHeader: "Signification",
    meanings: {
      p: "premier nombre premier (secret)",
      q: "second nombre premier (secret)",
      n: "module (public)",
      phi: "indicatrice d'Euler (secrète)",
      e: "exposant public, premier avec φ(n)",
      d: "exposant privé (secret)",
    },
    roundTripBadge: "Aller-retour",
    roundTripEncrypt: "Chiffrer m = 88 :",
    roundTripDecrypt: "Déchiffrer :",
    roundTripExplain:
      "Le calcul rend le texte clair exactement parce que 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  it: {
    finalLabel: "Fai i conti.",
    workedBadge: "Esempio svolto · una coppia di chiavi completa con numeri piccoli",
    workedTitle: "p = 17, q = 11: la chiave RSA da manuale.",
    workedIntro:
      "I valori qui sotto mostrano ogni quantità di una chiave RSA. L'Esploratore ti permette di cambiare p, q ed e e ricalcola il resto, inclusa la derivazione di d con l'algoritmo di Euclide esteso, passo dopo passo.",
    symbolHeader: "Simbolo",
    formulaHeader: "Formula",
    valueHeader: "Valore",
    meaningHeader: "Significato",
    meanings: {
      p: "primo numero primo (segreto)",
      q: "secondo numero primo (segreto)",
      n: "modulo (pubblico)",
      phi: "funzione toziente di Eulero (segreta)",
      e: "esponente pubblico, coprimo con φ(n)",
      d: "esponente privato (segreto)",
    },
    roundTripBadge: "Andata e ritorno",
    roundTripEncrypt: "Cifrare m = 88:",
    roundTripDecrypt: "Decifrare:",
    roundTripExplain:
      "La matematica restituisce il testo in chiaro esattamente perché 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  pt: {
    finalLabel: "Faça as contas.",
    workedBadge: "Exemplo resolvido · um par de chaves completo com números pequenos",
    workedTitle: "p = 17, q = 11: a chave RSA de manual.",
    workedIntro:
      "Os valores abaixo mostram cada quantidade de uma chave RSA. O Explorador permite mudar p, q e e, e recalcula o resto, incluindo a derivação de d pelo algoritmo estendido de Euclides, passo a passo.",
    symbolHeader: "Símbolo",
    formulaHeader: "Fórmula",
    valueHeader: "Valor",
    meaningHeader: "Significado",
    meanings: {
      p: "primeiro primo (secreto)",
      q: "segundo primo (secreto)",
      n: "módulo (público)",
      phi: "função tociente de Euler (secreta)",
      e: "expoente público, coprimo de φ(n)",
      d: "expoente privado (secreto)",
    },
    roundTripBadge: "Ida e volta",
    roundTripEncrypt: "Cifrar m = 88:",
    roundTripDecrypt: "Decifrar:",
    roundTripExplain:
      "A matemática devolve o texto claro exatamente porque 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  sv: {
    finalLabel: "Räkna själv.",
    workedBadge: "Genomräknat exempel · ett komplett nyckelpar med små tal",
    workedTitle: "p = 17, q = 11: RSA-nyckeln ur läroboken.",
    workedIntro:
      "Värdena nedan visar varje storhet i en RSA-nyckel. Utforskaren låter dig ändra p, q och e och räknar om resten, inklusive den utvidgade euklidiska härledningen av d, steg för steg.",
    symbolHeader: "Symbol",
    formulaHeader: "Formel",
    valueHeader: "Värde",
    meaningHeader: "Betydelse",
    meanings: {
      p: "första primtalet (hemligt)",
      q: "andra primtalet (hemligt)",
      n: "modul (offentlig)",
      phi: "Eulers fi-funktion (hemlig)",
      e: "offentlig exponent, relativt prim till φ(n)",
      d: "privat exponent (hemlig)",
    },
    roundTripBadge: "Tur och retur",
    roundTripEncrypt: "Kryptera m = 88:",
    roundTripDecrypt: "Dekryptera:",
    roundTripExplain:
      "Matematiken ger tillbaka klartexten exakt, eftersom 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
  no: {
    finalLabel: "Regn selv.",
    workedBadge: "Gjennomregnet eksempel · et komplett nøkkelpar med små tall",
    workedTitle: "p = 17, q = 11: RSA-nøkkelen fra læreboka.",
    workedIntro:
      "Verdiene under viser hver størrelse i en RSA-nøkkel. Utforskeren lar deg endre p, q og e og regner om resten, inkludert den utvidede euklidske utledningen av d, steg for steg.",
    symbolHeader: "Symbol",
    formulaHeader: "Formel",
    valueHeader: "Verdi",
    meaningHeader: "Betydning",
    meanings: {
      p: "første primtall (hemmelig)",
      q: "andre primtall (hemmelig)",
      n: "modul (offentlig)",
      phi: "Eulers fi-funksjon (hemmelig)",
      e: "offentlig eksponent, koprim med φ(n)",
      d: "privat eksponent (hemmelig)",
    },
    roundTripBadge: "Tur og retur",
    roundTripEncrypt: "Krypter m = 88:",
    roundTripDecrypt: "Dekrypter:",
    roundTripExplain:
      "Matematikken gir klarteksten nøyaktig tilbake, fordi 7 · 23 = 161 ≡ 1 mod φ(n) = 160.",
  },
};

export default function RsaStoryPage() {
  const { s, u, locale } = useI18n();
  const page = s.pages.rsa;
  const [sec0, sec1, sec2, sec3] = page.sections;
  const w = WORKED[locale];

  return (
    <StoryPageShell
      page={page}
      ctaHref="/rsa/explorer"
      accent="text-signal-cyan"
      borderAccent="border-signal-cyan/70"
      bgAccent="bg-signal-cyan/10"
      hoverAccent="hover:bg-signal-cyan/20"
      gradient="from-signal-cyan/10"
      formulaBadge="c = m^e mod n,  m = c^d mod n"
      formulaLatex={"c = m^e \\bmod n, \\quad m = c^d \\bmod n"}
      finalLabel={w.finalLabel}
    >
      <section className="mx-auto mb-16 max-w-4xl space-y-8">
        <StoryCard pretitle={sec0.pretitle} title={sec0.title} body={sec0.body} accent={ACCENT} />
        <StoryCard pretitle={sec1.pretitle} title={sec1.title} body={sec1.body} accent={ACCENT} />
        <StoryCard pretitle={sec2.pretitle} title={sec2.title} body={sec2.body} accent={ACCENT} />
        <StoryCard pretitle={sec3.pretitle} title={sec3.title} body={sec3.body} accent={ACCENT} />
      </section>

      <Reveal>
        <section className="glass hairline mx-auto mb-12 mt-8 max-w-4xl space-y-6 rounded-2xl border p-8 md:p-10">
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
            {w.workedBadge}
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            {w.workedTitle}
          </h2>
          <p className="text-sm leading-relaxed text-ink-200">{w.workedIntro}</p>
          <div className="hairline overflow-x-auto rounded-md border bg-ink-950/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="hairline border-b">
                  <th
                    className={`p-3 text-left font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    {w.symbolHeader}
                  </th>
                  <th
                    className={`p-3 text-left font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    {w.formulaHeader}
                  </th>
                  <th
                    className={`p-3 text-right font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    {w.valueHeader}
                  </th>
                  <th
                    className={`p-3 text-left font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    {w.meaningHeader}
                  </th>
                </tr>
              </thead>
              <tbody>
                {KEY_ROWS.map((row) => (
                  <tr key={row.symbol} className="hairline border-b last:border-0">
                    <td className="p-3 font-mono text-ink-100">{row.symbol}</td>
                    <td className="p-3 text-ink-200">
                      <Formula expression={row.latex} size="sm" />
                    </td>
                    <td className="p-3 text-right font-mono text-signal-cyan">{row.value}</td>
                    <td className="p-3 text-xs leading-relaxed text-ink-300">
                      {w.meanings[row.id]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 rounded-md border border-signal-cyan/30 bg-signal-cyan/5 p-5">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              {w.roundTripBadge}
            </div>
            <p className="text-sm leading-relaxed text-ink-100">
              {w.roundTripEncrypt} &nbsp;c = 88<sup>7</sup> mod 187 ={" "}
              <span className="font-mono text-signal-cyan">11</span>. &nbsp;{w.roundTripDecrypt}{" "}
              &nbsp;11<sup>23</sup> mod 187 ={" "}
              <span className="font-mono text-signal-cyan">88</span>. {w.roundTripExplain}
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto mb-12 mt-8 max-w-3xl text-center">
          <Link
            href="/"
            className="hairline inline-block rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
          >
            {u.back}
          </Link>
        </section>
      </Reveal>
    </StoryPageShell>
  );
}
