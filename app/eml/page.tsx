"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CathedralStage, STATION_IDS } from "@/components/CathedralStage";
import { PRESETS } from "@/lib/eml/presets";
import { EmlTree } from "@/components/EmlTree";
import { parse } from "@/lib/eml/parse";
import { DomainLegend } from "@/components/DomainLegend";
import { EmlVerifier } from "@/components/EmlVerifier";
import { GardenGrid } from "@/components/GardenGrid";
import { Info } from "@/components/Info";
import { useI18n } from "@/lib/i18n/context";
import { PAPER_URL, GITHUB_URL } from "@/components/Footer";
import type { StationId } from "@/lib/i18n/bodies";

// Per-station extra JSX (formulas, links). The prose paragraphs themselves
// come from the locale bodies. We only render here what genuinely needs JSX
// — code blocks, links — never translatable prose.

const STATION_FORMULAS: Partial<Record<StationId, string>> = {
  ln: "ln(z) = eml(1, eml(eml(1, z), 1))",
  id: "id(z) = eml(eml(1, eml(eml(1, z), 1)), 1)",
};

// Vortex prose ends "In the Atelier you can hold this knob yourself."
// We surface a JSX link to /atelier separately so the language string stays
// plain text. The link button below the body links to the Atelier anyway.

export default function CathedralPage() {
  const { t, b } = useI18n();
  const [station, setStation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const totalH = doc.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalH)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative isolate">
      <CathedralStage onStationChange={(idx) => setStation(idx)} />

      {/* Scroll-progress rail (top) */}
      <div className="fixed top-14 left-0 right-0 h-px z-40 bg-ink-300/15">
        <div
          className="h-full bg-gradient-to-r from-signal-violet via-signal-cyan to-signal-amber transition-[width] duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 z-10">
        <div className="max-w-3xl text-center space-y-8 glass border hairline rounded-3xl px-10 py-16 pulse-glow">
          <a
            href={PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="eml-pill mx-auto hover:bg-signal-violet/20 transition-colors"
          >
            {t.hero.paperPill} ↗
          </a>
          <h1 className="math-italic text-6xl md:text-8xl leading-[0.95] tracking-tight">
            {t.hero.title1}
            <br />
            {t.hero.title2} <span className="text-signal-violet">{t.hero.title3}</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-ink-100">
            eml(<span className="math-italic">x</span>,&nbsp;
            <span className="math-italic">y</span>) ={" "}
            <span className="math-italic">eˣ</span> − ln&nbsp;
            <span className="math-italic">y</span>
          </p>
          <div className="text-sm text-ink-300 space-y-1">
            <div>{t.hero.byAuthor}</div>
            <a
              href={PAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="italic text-signal-cyan hover:text-ink-100 transition-colors"
            >
              "{t.hero.paperLink}" ↗
            </a>
          </div>
          <div className="space-y-4 text-ink-200 leading-relaxed max-w-xl mx-auto">
            <p>{t.hero.p1}</p>
            <p>{t.hero.p2}</p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase">
              {t.hero.scroll}
            </div>
            <div className="w-px h-10 bg-ink-300/40 animate-float-slow" />
          </div>
        </div>
      </section>

      {/* First encounter — for laypeople */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="eml-pill mx-auto">{t.encounter.pretitle}</div>
            <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.encounter.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <EncounterCard label="01" title={t.encounter.legoTitle} accent="text-signal-violet">
              {t.encounter.legoBody}
            </EncounterCard>
            <EncounterCard label="02" title={t.encounter.exampleTitle} accent="text-signal-cyan">
              <p>{t.encounter.exampleBody}</p>
              <div className="mt-4 rounded-md border hairline bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100 space-y-1">
                <div>eml(2, 1) = e² − ln 1 = <span className="text-signal-amber">7.389…</span></div>
                <div>eml(0, 1) = 1 − 0 = <span className="text-signal-amber">1</span></div>
                <div>eml(1, e) = e − 1 = <span className="text-signal-amber">1.718…</span></div>
              </div>
            </EncounterCard>
            <EncounterCard label="03" title={t.encounter.insightTitle} accent="text-signal-amber">
              {t.encounter.insightBody}
            </EncounterCard>
          </div>
          <div className="text-center text-ink-300 italic">{t.encounter.tryIt}</div>
        </div>
      </section>

      {/* Prologue: universal primitives */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
          <div className="md:col-span-7 space-y-5 glass border hairline rounded-2xl p-8 md:p-10">
            <div className="font-mono text-[11px] tracking-widest2 text-signal-cyan uppercase">
              {t.prologue.pretitle}
            </div>
            <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.prologue.title}</h2>
            <p className="text-ink-100 leading-relaxed">{t.prologue.p1}</p>
            <p className="text-ink-100 leading-relaxed">{t.prologue.p2}</p>
            <p className="text-ink-200 leading-relaxed">{t.prologue.p3}</p>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-4">
            <div className="rounded-2xl border hairline glass p-5">
              <div className="font-mono text-[11px] tracking-widest2 text-ink-200 uppercase mb-3">
                {t.prologue.nandTitle}
              </div>
              <table className="w-full text-center font-mono text-xs">
                <thead className="text-ink-300">
                  <tr>
                    <th className="py-1">a</th>
                    <th className="py-1">b</th>
                    <th className="py-1 text-signal-amber">a NAND b</th>
                  </tr>
                </thead>
                <tbody className="text-ink-100">
                  <tr><td>0</td><td>0</td><td className="text-signal-amber">1</td></tr>
                  <tr><td>0</td><td>1</td><td className="text-signal-amber">1</td></tr>
                  <tr><td>1</td><td>0</td><td className="text-signal-amber">1</td></tr>
                  <tr><td>1</td><td>1</td><td className="text-signal-amber">0</td></tr>
                </tbody>
              </table>
              <p className="text-[11px] text-ink-300 mt-3 leading-relaxed">{t.prologue.nandNote}</p>
            </div>
            <div className="rounded-2xl border hairline glass p-5">
              <div className="font-mono text-[11px] tracking-widest2 text-ink-200 uppercase mb-3">
                {t.prologue.emlTitle}
              </div>
              <pre className="font-mono text-xs text-ink-100 bg-ink-950/60 rounded-md border hairline p-3 overflow-x-auto leading-relaxed">
{`eml(x, 1)              →  eˣ
eml(1, eml(eml(1,z),1))
                       →  ln z
…and so on, by nesting.`}
              </pre>
              <p className="text-[11px] text-ink-300 mt-3 leading-relaxed">{t.prologue.emlNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Operator */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-5xl mx-auto glass border hairline rounded-3xl p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7 space-y-5">
              <div className="font-mono text-[11px] tracking-widest2 text-signal-amber uppercase">
                {t.operator.pretitle}
              </div>
              <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.operator.title}</h2>
              <p className="text-ink-100 leading-relaxed">{t.operator.p1}</p>
              <p className="text-ink-100 leading-relaxed">{t.operator.p2}</p>
              <div className="pt-2">
                <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-2">
                  {t.operator.examplesLabel}
                </div>
                <ul className="text-ink-200 font-mono text-xs space-y-2">
                  <li>
                    <span className="text-signal-violet">▸</span>{" "}
                    <span className="math-italic">eml(0, 1) = e<sup>0</sup> − ln 1 = 1 − 0 = 1</span>
                  </li>
                  <li>
                    <span className="text-signal-violet">▸</span>{" "}
                    <span className="math-italic">eml(1, 1) = e − 0 = e ≈ 2.718</span>
                  </li>
                  <li>
                    <span className="text-signal-violet">▸</span>{" "}
                    <span className="math-italic">eml(0, e) = 1 − 1 = 0</span>
                  </li>
                  <li>
                    <span className="text-signal-violet">▸</span>{" "}
                    <span className="math-italic">eml(z, 1) = e<sup>z</sup></span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="aspect-square w-full max-w-[340px] mx-auto bg-ink-950/40 border hairline rounded-2xl p-6 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase">
                    {t.operator.sideTitle}
                  </div>
                  <div className="math-italic text-5xl text-ink-100 leading-tight">
                    eml(<span className="text-signal-violet">x</span>,{" "}
                    <span className="text-signal-cyan">y</span>)
                  </div>
                  <div className="text-2xl text-ink-300">=</div>
                  <div className="math-italic text-3xl text-signal-violet">
                    e<sup>x</sup>
                  </div>
                  <div className="text-xl text-ink-300">−</div>
                  <div className="math-italic text-3xl text-signal-cyan">ln y</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reading the picture */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 flex justify-center">
            <DomainLegend palette={0} />
          </div>
          <div className="md:col-span-7 space-y-5 glass border hairline rounded-2xl p-8 md:p-10">
            <div className="font-mono text-[11px] tracking-widest2 text-signal-rose uppercase">
              {t.reading.pretitle}
            </div>
            <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.reading.title}</h2>
            <p className="text-ink-100 leading-relaxed">{t.reading.p1}</p>
            <ul className="space-y-2 text-sm text-ink-200">
              <li className="flex gap-3">
                <span className="font-mono text-signal-violet w-20 shrink-0">arg(w)</span>
                {t.reading.rowHue}
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-signal-cyan w-20 shrink-0">|w|</span>
                {t.reading.rowMag}
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-ink-300 w-20 shrink-0">|w| → 0</span>
                {t.reading.rowZero}
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-ink-300 w-20 shrink-0">|w| → ∞</span>
                {t.reading.rowInf}
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-ink-300 w-20 shrink-0">grid</span>
                {t.reading.rowGrid}
              </li>
            </ul>
            <p className="text-ink-300 text-sm leading-relaxed pt-2 border-t hairline">
              {t.reading.closing}
            </p>
          </div>
        </div>
      </section>

      {/* Stations */}
      {STATION_IDS.map((stationId, i) => {
        const preset = PRESETS.find((p) => p.id === stationId)!;
        const node = parse(preset.src);
        const sideRight = i % 2 === 1;
        const titles = t.stationTitles[stationId];
        const sid = stationId as StationId;
        const paragraphs = b.stationBodies[sid] ?? [];
        const formula = STATION_FORMULAS[sid];
        return (
          <section
            key={stationId}
            className="relative min-h-screen flex items-center px-6 py-24 z-10"
            data-station={stationId}
          >
            <div
              className={`max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-center ${
                sideRight ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="md:col-span-7 space-y-6 glass border hairline rounded-2xl p-8 md:p-10">
                <div className="font-mono text-[11px] tracking-widest2 text-signal-violet uppercase">
                  {titles.pretitle}
                </div>
                <h2 className="math-italic text-4xl md:text-5xl leading-tight">{titles.title}</h2>
                <div className="space-y-4 text-ink-100 leading-relaxed">
                  {paragraphs.map((p, idx) => (
                    <div key={idx}>
                      <p className={idx === paragraphs.length - 1 && paragraphs.length > 1 ? "text-ink-200 text-sm" : ""}>
                        {p}
                      </p>
                      {/* Insert formula after first paragraph for ln and id */}
                      {idx === 0 && formula && (
                        <pre className="mt-4 font-mono text-xs text-ink-100 bg-ink-900/60 border hairline rounded-lg p-3 overflow-x-auto">
                          {formula}
                        </pre>
                      )}
                    </div>
                  ))}
                  {/* Special link for vortex station */}
                  {sid === "param-vortex" && (
                    <p>
                      <Link
                        href="/eml/atelier"
                        className="underline decoration-signal-violet/60 hover:text-signal-violet font-mono text-xs uppercase tracking-widest2"
                      >
                        → {t.nav.atelier}
                      </Link>
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t hairline flex items-center justify-between text-[11px] font-mono uppercase tracking-widest2 text-ink-300">
                  <span>
                    {b.presetLabel} · <span className="text-signal-cyan">{preset.id}</span>
                  </span>
                  <span>
                    {b.depthLabel} · <span className="text-signal-amber">{preset.depth}</span>
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 glass border hairline rounded-2xl p-6">
                <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-3">
                  {b.expressionTree}
                </div>
                <EmlTree root={node} className="w-full h-auto max-h-[42vh]" />
                <pre className="mt-3 font-mono text-[11px] text-ink-200 break-all leading-relaxed">
                  {preset.src}
                </pre>
              </div>
            </div>
          </section>
        );
      })}

      {/* Verification widget */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="eml-pill mx-auto">{t.verifier.pretitle}</div>
            <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.verifier.title}</h2>
            <p className="text-ink-200 max-w-xl mx-auto leading-relaxed">{t.verifier.intro}</p>
          </div>
          <EmlVerifier />
        </div>
      </section>

      {/* Complexity table */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="eml-pill mx-auto">{t.complexity.pretitle}</div>
            <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.complexity.title}</h2>
            <p className="text-ink-200 max-w-xl mx-auto leading-relaxed">
              {t.complexity.intro}{" "}
              <Info side="bottom">{b.complexityRpnInfo}</Info>
            </p>
          </div>
          <div className="rounded-2xl border hairline glass p-6 md:p-8">
            <table className="w-full font-mono text-sm">
              <thead className="text-ink-300 border-b hairline">
                <tr>
                  <th className="text-left py-2 px-2 font-mono text-[10px] tracking-widest2 uppercase">
                    {t.complexity.headTarget}
                  </th>
                  <th className="text-right py-2 px-2 font-mono text-[10px] tracking-widest2 uppercase">
                    {t.complexity.headK}
                  </th>
                  <th className="text-left py-2 px-2 font-mono text-[10px] tracking-widest2 uppercase">
                    {t.complexity.headNote}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", 1, b.complexityRows.constant],
                  ["eˣ", 3, b.complexityRows.exp],
                  ["ln(x)", 7, b.complexityRows.ln],
                  ["id(x)", 9, b.complexityRows.id],
                  ["×", 41, b.complexityRows.mul],
                  ["xʸ", 49, b.complexityRows.pow],
                  ["−x", 57, b.complexityRows.neg],
                  ["√x", "≥ 47", b.complexityRows.sqrt],
                ].map(([target, k, note]) => (
                  <tr key={target as string} className="border-b border-ink-700/30 last:border-0">
                    <td className="py-2 px-2 math-italic text-base text-ink-100">{target}</td>
                    <td className="py-2 px-2 text-right text-signal-amber">{k}</td>
                    <td className="py-2 px-2 text-ink-200 text-xs">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-4 mt-4 border-t hairline text-[11px] text-ink-300 leading-relaxed">
              {t.complexity.note}
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-5xl mx-auto glass border hairline rounded-3xl p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 space-y-4">
              <div className="font-mono text-[11px] tracking-widest2 text-signal-rose uppercase">
                {t.limits.pretitle}
              </div>
              <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.limits.title}</h2>
              <p className="text-ink-200 leading-relaxed text-sm">{t.limits.intro}</p>
            </div>
            <div className="md:col-span-7 space-y-3">
              {[
                b.limits.complexRequired,
                b.limits.branchCuts,
                b.limits.overflow,
                b.limits.nonSelfGen,
                b.limits.notFullyUniversal,
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-md border hairline bg-ink-950/40 px-4 py-3"
                >
                  <div className="font-mono text-[10px] tracking-widest2 text-signal-rose uppercase mb-1">
                    {row.k}
                  </div>
                  <div className="text-sm text-ink-200 leading-relaxed">{row.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Garden */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="eml-pill mx-auto">{t.garden.pretitle}</div>
            <h2 className="math-italic text-4xl md:text-5xl leading-tight">{t.garden.title}</h2>
            <p className="text-ink-200 max-w-2xl mx-auto leading-relaxed">{t.garden.intro}</p>
          </div>
          <GardenGrid />
        </div>
      </section>

      {/* Closing */}
      <section className="relative px-6 py-32 z-10">
        <div className="max-w-4xl mx-auto space-y-10 glass border hairline rounded-3xl p-10 md:p-14 text-center">
          <div className="eml-pill mx-auto">{t.closing.pill}</div>
          <h2 className="math-italic text-5xl md:text-7xl leading-tight">{t.closing.title}</h2>
          <p className="text-ink-200 max-w-2xl mx-auto leading-relaxed">{t.closing.intro}</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/eml/atelier"
              className="px-6 py-3 rounded-full border border-signal-violet/60 hover:border-signal-violet hover:bg-signal-violet/10 text-signal-violet font-mono text-xs uppercase tracking-widest2 transition-colors"
            >
              {t.closing.ctaAtelier}
            </Link>
            <Link
              href="/eml/resonance"
              className="px-6 py-3 rounded-full border border-signal-cyan/60 hover:border-signal-cyan hover:bg-signal-cyan/10 text-signal-cyan font-mono text-xs uppercase tracking-widest2 transition-colors"
            >
              {t.closing.ctaResonance}
            </Link>
          </div>
          <div className="pt-8 border-t hairline space-y-3">
            <div className="text-[10px] font-mono text-ink-400 uppercase tracking-widest2 leading-relaxed">
              {t.closing.meta}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono uppercase tracking-widest2">
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-cyan hover:text-ink-100 transition-colors"
              >
                ↗ {t.footer.paper}
              </a>
              <span className="text-ink-500">·</span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-cyan hover:text-ink-100 transition-colors"
              >
                ↗ {t.footer.github}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Progress rail (right) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
        {STATION_IDS.map((id, i) => (
          <div
            key={id}
            className={`w-1.5 transition-all rounded-full ${
              i === station ? "h-8 bg-signal-violet" : "h-3 bg-ink-300/40"
            }`}
            title={id}
          />
        ))}
      </div>
    </main>
  );
}

function EncounterCard({
  label,
  title,
  accent,
  children,
}: {
  label: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass border hairline rounded-2xl p-6 space-y-3 hover:border-signal-violet/40 transition-colors">
      <div className={`font-mono text-[10px] tracking-widest2 uppercase ${accent}`}>{label}</div>
      <h3 className="math-italic text-2xl text-ink-100 leading-snug">{title}</h3>
      <div className="text-sm text-ink-200 leading-relaxed">{children}</div>
    </div>
  );
}
