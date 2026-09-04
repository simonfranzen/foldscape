"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const TEXT_INPUT_MAX_LENGTH = 32;

const SMALL_PRIMES: readonly bigint[] = [
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  67n,
  71n,
  73n,
  79n,
  83n,
  89n,
  97n,
] as const;

const E_CANDIDATES: readonly bigint[] = [
  3n,
  5n,
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  65537n,
] as const;

function gcdBig(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

interface EuclidStep {
  a: bigint;
  b: bigint;
  q: bigint;
  r: bigint;
  s: bigint;
  t: bigint;
}

interface EuclidResult {
  g: bigint;
  s: bigint;
  t: bigint;
  steps: EuclidStep[];
}

// Extended Euclidean algorithm. Returns (g, s, t) with s·a + t·b = g and the
// full sequence of (a_i, b_i, q_i, r_i, s_i, t_i) rows for animation.
function extendedEuclid(a: bigint, b: bigint): EuclidResult {
  const steps: EuclidStep[] = [];
  let oldR = a;
  let r = b;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  while (r !== 0n) {
    const q = oldR / r;
    const nr = oldR - q * r;
    const ns = oldS - q * s;
    const nt = oldT - q * t;
    steps.push({ a: oldR, b: r, q, r: nr, s: ns, t: nt });
    oldR = r;
    r = nr;
    oldS = s;
    s = ns;
    oldT = t;
    t = nt;
  }
  return { g: oldR, s: oldS, t: oldT, steps };
}

function _modInverse(e: bigint, phi: bigint): bigint | null {
  const { g, s } = extendedEuclid(e, phi);
  if (g !== 1n) return null;
  return ((s % phi) + phi) % phi;
}

interface ModExpStep {
  bit: 0 | 1;
  position: number;
  squareLeft: bigint;
  squareResult: bigint;
  multiplyApplied: boolean;
  accumulator: bigint;
}

interface ModExpResult {
  value: bigint;
  steps: ModExpStep[];
}

// Square-and-multiply mod n. Walks the exponent bit-by-bit (MSB first),
// recording the intermediate square and the running accumulator at each step.
function modPowSteps(base: bigint, exp: bigint, mod: bigint): ModExpResult {
  if (mod === 1n) return { value: 0n, steps: [] };
  const steps: ModExpStep[] = [];
  const bits: Array<0 | 1> = [];
  let e = exp;
  while (e > 0n) {
    bits.push((e & 1n) === 1n ? 1 : 0);
    e >>= 1n;
  }
  bits.reverse(); // MSB first
  let result = 1n;
  for (let i = 0; i < bits.length; i++) {
    const before = result;
    const squared = (before * before) % mod;
    const bit = bits[i];
    let multiplyApplied = false;
    let acc = squared;
    if (i === 0) {
      // first iteration: result starts at 1 → just multiply by base if bit is 1
      acc = bit === 1 ? base % mod : 1n;
    } else {
      if (bit === 1) {
        acc = (squared * base) % mod;
        multiplyApplied = true;
      }
    }
    steps.push({
      bit,
      position: bits.length - 1 - i,
      squareLeft: before,
      squareResult: i === 0 ? 1n : squared,
      multiplyApplied: i === 0 ? bit === 1 : multiplyApplied,
      accumulator: acc,
    });
    result = acc;
  }
  return { value: result, steps };
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  return modPowSteps(base, exp, mod).value;
}

export default function RsaExplorer() {
  const { a, u } = useI18n();
  const topic = a.topics.rsa;

  const [p, setP] = useState<bigint>(17n);
  const [q, setQ] = useState<bigint>(11n);
  const [eVal, setEVal] = useState<bigint>(7n);
  const [m, setM] = useState<string>("88");
  const [showSteps, setShowSteps] = useState(true);
  const [textInput, setTextInput] = useState("rsa");

  // Derived quantities. Recompute on every render; cheap for small primes.
  const derived = useMemo(() => {
    if (p === q) {
      return { n: 0n, phi: 0n, valid: false, reason: "p and q must differ" };
    }
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    return { n, phi, valid: true, reason: "" };
  }, [p, q]);

  // Valid e candidates: coprime to φ(n) and 1 < e < φ(n).
  const validEs = useMemo<bigint[]>(() => {
    if (!derived.valid) return [];
    return E_CANDIDATES.filter((e) => e < derived.phi && gcdBig(e, derived.phi) === 1n);
  }, [derived]);

  // Pin e to a valid candidate when the prime selection changes.
  const effectiveE = useMemo<bigint>(() => {
    if (!derived.valid) return eVal;
    if (validEs.includes(eVal)) return eVal;
    return validEs[0] ?? 3n;
  }, [eVal, validEs, derived.valid]);

  // Extended-Euclid run that gives us d. We always pass (e, φ) so that s in
  // the result is the inverse of e modulo φ.
  const euclid = useMemo(() => {
    if (!derived.valid) return null;
    return extendedEuclid(effectiveE, derived.phi);
  }, [effectiveE, derived]);

  const d = useMemo<bigint | null>(() => {
    if (!derived.valid || !euclid || euclid.g !== 1n) return null;
    return ((euclid.s % derived.phi) + derived.phi) % derived.phi;
  }, [derived, euclid]);

  // Parse the plaintext as a BigInt; reject anything outside [0, n).
  const mBig = useMemo<bigint | null>(() => {
    if (!derived.valid) return null;
    const trimmed = m.trim();
    if (trimmed === "" || !/^\d+$/.test(trimmed)) return null;
    const v = BigInt(trimmed);
    if (v < 0n || v >= derived.n) return null;
    return v;
  }, [m, derived]);

  const encryption = useMemo(() => {
    if (mBig === null || !derived.valid) return null;
    return modPowSteps(mBig, effectiveE, derived.n);
  }, [mBig, effectiveE, derived]);

  const decryption = useMemo(() => {
    if (encryption === null || d === null || !derived.valid) return null;
    return modPowSteps(encryption.value, d, derived.n);
  }, [encryption, d, derived]);

  // Try-as-text round trip: each character a..z is encoded as 1..26, encrypted
  // and decrypted as a separate block. Non-letters are skipped silently.
  const textRoundTrip = useMemo(() => {
    if (!derived.valid || d === null) return null;
    const cleaned = textInput.toLowerCase().replace(/[^a-z]/g, "");
    if (cleaned.length === 0) return null;
    const blocks = cleaned.split("").map((ch) => {
      const m0 = BigInt(ch.charCodeAt(0) - 96);
      if (m0 >= derived.n) {
        return { ch, m: m0, c: null as bigint | null, mBack: null as bigint | null };
      }
      const c = modPow(m0, effectiveE, derived.n);
      const mBack = modPow(c, d, derived.n);
      return { ch, m: m0, c, mBack };
    });
    const decoded = blocks
      .map((b) => (b.mBack !== null ? String.fromCharCode(Number(b.mBack) + 96) : "?"))
      .join("");
    return { blocks, decoded, cleaned };
  }, [textInput, derived, effectiveE, d]);

  const handlePrimeChange = (which: "p" | "q") => (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const v = BigInt(ev.target.value);
    if (which === "p") setP(v);
    else setQ(v);
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative flex min-h-[60vh] flex-col gap-4 overflow-y-auto bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <section className="hairline glass space-y-4 rounded-2xl border p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                Key generation
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                public (n, e) · private (n, d)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <KvCell label="p" value={p.toString()} accent />
              <KvCell label="q" value={q.toString()} accent />
              <KvCell label="n = p·q" value={derived.valid ? derived.n.toString() : "—"} />
              <KvCell
                label="φ(n) = (p−1)(q−1)"
                value={derived.valid ? derived.phi.toString() : "—"}
              />
              <KvCell label="e" value={effectiveE.toString()} accent />
              <KvCell label="d ≡ e⁻¹ mod φ(n)" value={d !== null ? d.toString() : "—"} accent />
            </div>

            {!derived.valid && (
              <div className="rounded-md border border-signal-rose/40 bg-signal-rose/10 p-3 font-mono text-xs text-signal-rose">
                {derived.reason}
              </div>
            )}

            {derived.valid && euclid && (
              <div className="hairline space-y-3 rounded-md border bg-ink-950/60 p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                  Extended Euclidean · finding s so that e·s + φ(n)·t = 1, then d = s mod φ(n)
                </div>
                {euclid.g !== 1n ? (
                  <div className="font-mono text-xs text-signal-rose">
                    gcd(e, φ(n)) = {euclid.g.toString()} ≠ 1 — pick a different e.
                  </div>
                ) : showSteps ? (
                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-xs">
                      <thead>
                        <tr className="hairline border-b text-ink-300">
                          <th className="p-1.5 text-right">i</th>
                          <th className="p-1.5 text-right">aᵢ</th>
                          <th className="p-1.5 text-right">bᵢ</th>
                          <th className="p-1.5 text-right">qᵢ = ⌊aᵢ/bᵢ⌋</th>
                          <th className="p-1.5 text-right">rᵢ = aᵢ − qᵢ·bᵢ</th>
                          <th className="p-1.5 text-right">sᵢ</th>
                          <th className="p-1.5 text-right">tᵢ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {euclid.steps.map((st, i) => (
                          <tr key={i} className="hairline border-b text-ink-100 last:border-0">
                            <td className="p-1.5 text-right text-ink-400">{i}</td>
                            <td className="p-1.5 text-right">{st.a.toString()}</td>
                            <td className="p-1.5 text-right">{st.b.toString()}</td>
                            <td className="p-1.5 text-right">{st.q.toString()}</td>
                            <td className="p-1.5 text-right">{st.r.toString()}</td>
                            <td className="p-1.5 text-right text-signal-cyan">{st.s.toString()}</td>
                            <td className="p-1.5 text-right text-signal-cyan">{st.t.toString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-3 text-xs leading-relaxed text-ink-300">
                      Bézout:{" "}
                      <span className="font-mono text-signal-cyan">
                        {effectiveE.toString()} · {euclid.s.toString()} + {derived.phi.toString()} ·{" "}
                        {euclid.t.toString()} = 1
                      </span>
                      . Reducing s mod φ(n) gives d ={" "}
                      <span className="font-mono text-signal-cyan">{d?.toString() ?? "—"}</span>.
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-ink-300">
                    e·d ≡ 1 mod φ(n) &nbsp;⇒&nbsp; d ={" "}
                    <span className="font-mono text-signal-cyan">{d?.toString() ?? "—"}</span>.
                    Toggle steps on to see the row-by-row derivation.
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="hairline glass space-y-4 rounded-2xl border p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                Encrypt &nbsp;·&nbsp; decrypt
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                c = m^e mod n &nbsp;·&nbsp; m = c^d mod n
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <KvCell label="m (plaintext)" value={mBig !== null ? mBig.toString() : "—"} accent />
              <KvCell
                label="c = m^e mod n"
                value={encryption ? encryption.value.toString() : "—"}
                accent
              />
              <KvCell
                label="c^d mod n"
                value={decryption ? decryption.value.toString() : "—"}
                accent
              />
            </div>

            {mBig === null && derived.valid && (
              <div className="rounded-md border border-signal-rose/40 bg-signal-rose/10 p-3 font-mono text-xs text-signal-rose">
                m must be an integer in [0, {derived.n.toString()}).
              </div>
            )}

            {encryption && (
              <ModExpTrace
                title={`Encrypt · ${mBig?.toString()}^${effectiveE.toString()} mod ${derived.n.toString()}`}
                trace={encryption.steps}
                show={showSteps}
              />
            )}

            {decryption && (
              <ModExpTrace
                title={`Decrypt · ${encryption?.value.toString()}^${d?.toString()} mod ${derived.n.toString()}`}
                trace={decryption.steps}
                show={showSteps}
              />
            )}

            {decryption && mBig !== null && (
              <div
                className={`rounded-md border p-3 font-mono text-xs ${
                  decryption.value === mBig
                    ? "border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan"
                    : "border-signal-rose/40 bg-signal-rose/10 text-signal-rose"
                }`}
              >
                {decryption.value === mBig
                  ? `Round trip OK · c^d mod n = ${decryption.value.toString()} = m`
                  : `Mismatch · ${decryption.value.toString()} ≠ ${mBig.toString()} — check the key`}
              </div>
            )}
          </section>

          {textRoundTrip && (
            <section className="hairline glass space-y-3 rounded-2xl border p-5 md:p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                Try as text · each letter is one RSA block
              </div>
              <p className="text-xs leading-relaxed text-ink-300">
                Letters a–z are encoded as 1–26. With small primes this is just a demonstration —
                the encoding is deterministic so the same plaintext always gives the same ciphertext
                (no padding), which is why real RSA uses OAEP and 2048-bit moduli.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead>
                    <tr className="hairline border-b text-ink-300">
                      <th className="p-1.5 text-left">char</th>
                      <th className="p-1.5 text-right">m</th>
                      <th className="p-1.5 text-right">c = m^e mod n</th>
                      <th className="p-1.5 text-right">c^d mod n</th>
                      <th className="p-1.5 pl-3 text-left">back</th>
                    </tr>
                  </thead>
                  <tbody>
                    {textRoundTrip.blocks.map((b, i) => (
                      <tr key={i} className="hairline border-b text-ink-100 last:border-0">
                        <td className="p-1.5 text-signal-cyan">{b.ch}</td>
                        <td className="p-1.5 text-right">{b.m.toString()}</td>
                        <td className="p-1.5 text-right">{b.c !== null ? b.c.toString() : "—"}</td>
                        <td className="p-1.5 text-right">
                          {b.mBack !== null ? b.mBack.toString() : "—"}
                        </td>
                        <td className="p-1.5 pl-3 text-signal-cyan">
                          {b.mBack !== null ? String.fromCharCode(Number(b.mBack) + 96) : "?"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-md border border-signal-cyan/30 bg-signal-cyan/5 p-3 font-mono text-xs text-signal-cyan">
                «{textRoundTrip.cleaned}» → «{textRoundTrip.decoded}»
              </div>
            </section>
          )}
        </div>

        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          <div className="hairline space-y-4 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Primes
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <div className="font-mono text-[10px] text-ink-400">p</div>
                <select
                  value={p.toString()}
                  onChange={handlePrimeChange("p")}
                  className="hairline w-full rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-sm text-signal-cyan focus:border-signal-cyan/60 focus:outline-none"
                >
                  {SMALL_PRIMES.map((pr) => (
                    <option key={pr.toString()} value={pr.toString()}>
                      {pr.toString()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <div className="font-mono text-[10px] text-ink-400">q</div>
                <select
                  value={q.toString()}
                  onChange={handlePrimeChange("q")}
                  className="hairline w-full rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-sm text-signal-cyan focus:border-signal-cyan/60 focus:outline-none"
                >
                  {SMALL_PRIMES.map((pr) => (
                    <option key={pr.toString()} value={pr.toString()}>
                      {pr.toString()}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="hairline space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-xs">
              <div className="text-ink-300">
                n ={" "}
                <span className="text-signal-cyan">
                  {derived.valid ? derived.n.toString() : "—"}
                </span>
              </div>
              <div className="text-ink-300">
                φ(n) ={" "}
                <span className="text-signal-cyan">
                  {derived.valid ? derived.phi.toString() : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label
              htmlFor="rsa-e"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              Public exponent e
            </label>
            <select
              id="rsa-e"
              value={effectiveE.toString()}
              onChange={(ev) => setEVal(BigInt(ev.target.value))}
              disabled={!derived.valid || validEs.length === 0}
              className="hairline w-full rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-sm text-signal-cyan focus:border-signal-cyan/60 focus:outline-none disabled:opacity-50"
            >
              {validEs.length === 0 ? (
                <option value="">— no valid e —</option>
              ) : (
                validEs.map((cand) => (
                  <option key={cand.toString()} value={cand.toString()}>
                    {cand.toString()}
                  </option>
                ))
              )}
            </select>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              Each candidate is coprime to φ(n) and strictly less than φ(n).
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label
              htmlFor="rsa-m"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              Plaintext m (integer, 0 ≤ m &lt; n)
            </label>
            <input
              id="rsa-m"
              type="text"
              inputMode="numeric"
              value={m}
              onChange={(ev) => setM(ev.target.value)}
              className="hairline w-full rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-sm text-signal-cyan focus:border-signal-cyan/60 focus:outline-none"
            />
            <div className="font-mono text-[10px] text-ink-400">
              n = {derived.valid ? derived.n.toString() : "—"} · max plaintext ={" "}
              {derived.valid ? (derived.n - 1n).toString() : "—"}
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <label
              htmlFor="rsa-text"
              className="block font-mono text-[10px] uppercase tracking-widest2 text-ink-300"
            >
              Try as text
            </label>
            <input
              id="rsa-text"
              type="text"
              value={textInput}
              onChange={(ev) => setTextInput(ev.target.value)}
              maxLength={TEXT_INPUT_MAX_LENGTH}
              placeholder="rsa"
              className="hairline w-full rounded-md border bg-ink-950/60 px-3 py-2 font-mono text-sm text-signal-cyan focus:border-signal-cyan/60 focus:outline-none"
            />
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              a–z → 1–26 · each letter is encrypted as one block · whitespace ignored.
            </div>
          </div>

          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Step animation
            </div>
            <button
              type="button"
              onClick={() => setShowSteps((v) => !v)}
              className={`w-full rounded-md border px-3 py-2 font-mono text-xs uppercase tracking-widest2 transition-colors ${
                showSteps
                  ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                  : "hairline text-ink-300 hover:border-signal-cyan/40 hover:text-ink-100"
              }`}
            >
              {showSteps ? "Showing steps" : "Steps hidden"}
            </button>
            <div className="font-mono text-[10px] leading-relaxed text-ink-400">
              Toggles the row-by-row trace of extended-Euclid and the square-and-multiply modular
              exponentiation.
            </div>
          </div>

          <div className="hairline border-b p-5">
            <button
              type="button"
              onClick={() => {
                // All derived values are already fully reactive, so a plain
                // "recompute" would be a no-op. Reset every input back to the
                // textbook key instead, which is a real state change.
                setP(17n);
                setQ(11n);
                setEVal(7n);
                setM("88");
                setTextInput("rsa");
              }}
              className="w-full rounded-md border border-signal-cyan/40 bg-signal-cyan/5 px-3 py-2 font-mono text-xs uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/15"
            >
              Reset to defaults
            </button>
          </div>

          <div className="p-5">
            <Link
              href="/rsa"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function KvCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="hairline space-y-1 rounded-md border bg-ink-950/40 p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
      <div
        className={`break-all font-mono text-sm ${accent ? "text-signal-cyan" : "text-ink-100"}`}
      >
        {value}
      </div>
    </div>
  );
}

function ModExpTrace({
  title,
  trace,
  show,
}: {
  title: string;
  trace: ModExpStep[];
  show: boolean;
}) {
  if (!show) return null;
  return (
    <div className="hairline space-y-3 rounded-md border bg-ink-950/60 p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
        Square-and-multiply · {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="hairline border-b text-ink-300">
              <th className="p-1.5 text-right">bit #</th>
              <th className="p-1.5 text-right">bit</th>
              <th className="p-1.5 text-right">square (acc²)</th>
              <th className="p-1.5 text-right">multiply?</th>
              <th className="p-1.5 text-right">accumulator</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((s, i) => (
              <tr key={i} className="hairline border-b text-ink-100 last:border-0">
                <td className="p-1.5 text-right text-ink-400">{s.position}</td>
                <td className="p-1.5 text-right">{s.bit}</td>
                <td className="p-1.5 text-right">{s.squareResult.toString()}</td>
                <td className="p-1.5 text-right">
                  {s.multiplyApplied ? (
                    <span className="text-signal-cyan">× base</span>
                  ) : (
                    <span className="text-ink-400">—</span>
                  )}
                </td>
                <td className="p-1.5 text-right text-signal-cyan">{s.accumulator.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
