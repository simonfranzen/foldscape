"use client";

import Link from "next/link";
import { StoryPageShell, StoryCard } from "@/components/StoryPageShell";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import { Formula } from "@/components/Formula";

const ACCENT = "text-signal-cyan";

interface KeyRow {
  symbol: string;
  latex: string;
  value: string;
  meaning: string;
}

const KEY_ROWS: KeyRow[] = [
  { symbol: "p", latex: "p", value: "17", meaning: "first prime (kept secret)" },
  { symbol: "q", latex: "q", value: "11", meaning: "second prime (kept secret)" },
  { symbol: "n", latex: "n = pq", value: "187", meaning: "modulus (public)" },
  {
    symbol: "φ(n)",
    latex: "\\varphi(n) = (p-1)(q-1)",
    value: "160",
    meaning: "Euler totient (secret)",
  },
  { symbol: "e", latex: "e", value: "7", meaning: "public exponent, coprime to φ(n)" },
  {
    symbol: "d",
    latex: "d \\equiv e^{-1} \\bmod \\varphi(n)",
    value: "23",
    meaning: "private exponent (secret)",
  },
];

export default function RsaStoryPage() {
  const { s, u } = useI18n();
  const page = s.pages.rsa;
  const [sec0, sec1, sec2, sec3] = page.sections;

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
      finalLabel="Try the maths."
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
            Worked example · a complete key pair on small numbers
          </div>
          <h2 className="math-italic text-2xl leading-tight text-ink-100 md:text-3xl">
            p = 17, q = 11 — the textbook RSA key.
          </h2>
          <p className="text-sm leading-relaxed text-ink-200">
            The values below show every quantity in one RSA key. The Explorer lets you change p, q
            and e and recomputes the rest — including the extended-Euclidean derivation of d — step
            by step.
          </p>
          <div className="hairline overflow-x-auto rounded-md border bg-ink-950/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="hairline border-b">
                  <th
                    className={`p-3 text-left font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    Symbol
                  </th>
                  <th
                    className={`p-3 text-left font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    Formula
                  </th>
                  <th
                    className={`p-3 text-right font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    Value
                  </th>
                  <th
                    className={`p-3 text-left font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}
                  >
                    Meaning
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
                    <td className="p-3 text-xs leading-relaxed text-ink-300">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 rounded-md border border-signal-cyan/30 bg-signal-cyan/5 p-5">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${ACCENT}`}>
              Round trip
            </div>
            <p className="text-sm leading-relaxed text-ink-100">
              Encrypt m = 88: &nbsp;c = 88<sup>7</sup> mod 187 ={" "}
              <span className="font-mono text-signal-cyan">11</span>. &nbsp;Decrypt: &nbsp;11
              <sup>23</sup> mod 187 = <span className="font-mono text-signal-cyan">88</span>. The
              maths returns the plaintext exactly because 7 · 23 = 161 ≡ 1 mod φ(n) = 160.
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
