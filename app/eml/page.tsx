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
import { Reveal } from "@/components/Reveal";
import { TopicApplications } from "@/components/TopicApplications";
import { RelatedTopics } from "@/components/RelatedTopics";
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
  const { t, b, a, u } = useI18n();
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
      <div className="fixed left-0 right-0 top-14 z-40 h-px bg-ink-300/15">
        <div
          className="h-full bg-gradient-to-r from-signal-violet via-signal-cyan to-signal-amber transition-[width] duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero — canonical topic header, matching every other module */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl space-y-7 text-center">
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              Topic · {a.landing.categoryLogic}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="math-italic text-6xl leading-[0.95] tracking-tight md:text-8xl">
              {a.topics.eml.title}
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="math-italic text-2xl leading-snug text-ink-200 md:text-3xl">
              {a.topics.eml.tagline}
            </p>
          </Reveal>
          <Reveal delay={380}>
            <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{a.topics.eml.body}</p>
          </Reveal>
          <Reveal delay={500}>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 md:flex-row">
              <Link
                href="/eml/atelier"
                className="rounded-full border border-signal-violet/70 bg-signal-violet/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-violet transition-colors hover:bg-signal-violet/20"
              >
                → {t.nav.atelier}
              </Link>
              <Link
                href="/"
                className="hairline rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
              >
                {u.back}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={620}>
            <div className="hairline float-gentle mx-auto mt-6 max-w-md rounded-md border bg-ink-950/60 p-3 font-mono text-base text-ink-100">
              eml(x, y) = eˣ − ln y
            </div>
          </Reveal>
          <Reveal delay={740}>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              <span>{t.hero.byAuthor}</span>
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-violet transition-colors hover:text-ink-100"
              >
                ↗ {t.hero.paperPill}
              </a>
            </div>
          </Reveal>
          <Reveal delay={860}>
            <div className="flex items-center justify-center gap-4 pt-6">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {t.hero.scroll}
              </div>
              <div className="h-10 w-px animate-float-slow bg-ink-300/40" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* First encounter — for laypeople */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-3 text-center">
            <div className="eml-pill mx-auto">{t.encounter.pretitle}</div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.encounter.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <EncounterCard label="01" title={t.encounter.legoTitle} accent="text-signal-violet">
              {t.encounter.legoBody}
            </EncounterCard>
            <EncounterCard label="02" title={t.encounter.exampleTitle} accent="text-signal-cyan">
              <p>{t.encounter.exampleBody}</p>
              <div className="hairline mt-4 space-y-1 rounded-md border bg-ink-950/60 p-3 font-mono text-[11px] text-ink-100">
                <div>
                  eml(2, 1) = e² − ln 1 = <span className="text-signal-amber">7.389…</span>
                </div>
                <div>
                  eml(0, 1) = 1 − 0 = <span className="text-signal-amber">1</span>
                </div>
                <div>
                  eml(1, e) = e − 1 = <span className="text-signal-amber">1.718…</span>
                </div>
              </div>
            </EncounterCard>
            <EncounterCard label="03" title={t.encounter.insightTitle} accent="text-signal-amber">
              {t.encounter.insightBody}
            </EncounterCard>
          </div>
          <div className="text-center italic text-ink-300">{t.encounter.tryIt}</div>
        </div>
      </section>

      {/* Prologue: universal primitives */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-10 md:grid-cols-12">
          <div className="glass hairline space-y-5 rounded-2xl border p-8 md:col-span-7 md:p-10">
            <div className="font-mono text-[11px] uppercase tracking-widest2 text-signal-cyan">
              {t.prologue.pretitle}
            </div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.prologue.title}</h2>
            <p className="leading-relaxed text-ink-100">{t.prologue.p1}</p>
            <p className="leading-relaxed text-ink-100">{t.prologue.p2}</p>
            <p className="leading-relaxed text-ink-200">{t.prologue.p3}</p>
          </div>
          <div className="grid grid-rows-2 gap-4 md:col-span-5">
            <div className="hairline glass rounded-2xl border p-5">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink-200">
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
                  <tr>
                    <td>0</td>
                    <td>0</td>
                    <td className="text-signal-amber">1</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>1</td>
                    <td className="text-signal-amber">1</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>0</td>
                    <td className="text-signal-amber">1</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td className="text-signal-amber">0</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-300">{t.prologue.nandNote}</p>
            </div>
            <div className="hairline glass rounded-2xl border p-5">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink-200">
                {t.prologue.emlTitle}
              </div>
              <pre className="hairline overflow-x-auto rounded-md border bg-ink-950/60 p-3 font-mono text-xs leading-relaxed text-ink-100">
                {`eml(x, 1)              →  eˣ
eml(1, eml(eml(1,z),1))
                       →  ln z
…and so on, by nesting.`}
              </pre>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-300">{t.prologue.emlNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Operator */}
      <section className="relative z-10 px-6 py-32">
        <div className="glass hairline mx-auto max-w-5xl rounded-3xl border p-10 md:p-14">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
            <div className="space-y-5 md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-widest2 text-signal-amber">
                {t.operator.pretitle}
              </div>
              <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.operator.title}</h2>
              <p className="leading-relaxed text-ink-100">{t.operator.p1}</p>
              <p className="leading-relaxed text-ink-100">{t.operator.p2}</p>
              <div className="pt-2">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {t.operator.examplesLabel}
                </div>
                <ul className="space-y-2 font-mono text-xs text-ink-200">
                  <li>
                    <span className="text-signal-violet">▸</span>{" "}
                    <span className="math-italic">
                      eml(0, 1) = e<sup>0</sup> − ln 1 = 1 − 0 = 1
                    </span>
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
                    <span className="math-italic">
                      eml(z, 1) = e<sup>z</sup>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="hairline mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center rounded-2xl border bg-ink-950/40 p-6">
                <div className="space-y-4 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                    {t.operator.sideTitle}
                  </div>
                  <div className="math-italic text-5xl leading-tight text-ink-100">
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
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-12">
          <div className="flex justify-center md:col-span-5">
            <DomainLegend palette={0} />
          </div>
          <div className="glass hairline space-y-5 rounded-2xl border p-8 md:col-span-7 md:p-10">
            <div className="font-mono text-[11px] uppercase tracking-widest2 text-signal-rose">
              {t.reading.pretitle}
            </div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.reading.title}</h2>
            <p className="leading-relaxed text-ink-100">{t.reading.p1}</p>
            <ul className="space-y-2 text-sm text-ink-200">
              <li className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-signal-violet">arg(w)</span>
                {t.reading.rowHue}
              </li>
              <li className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-signal-cyan">|w|</span>
                {t.reading.rowMag}
              </li>
              <li className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-ink-300">|w| → 0</span>
                {t.reading.rowZero}
              </li>
              <li className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-ink-300">|w| → ∞</span>
                {t.reading.rowInf}
              </li>
              <li className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-ink-300">grid</span>
                {t.reading.rowGrid}
              </li>
            </ul>
            <p className="hairline border-t pt-2 text-sm leading-relaxed text-ink-300">
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
            className="relative z-10 flex min-h-screen items-center px-6 py-24"
            data-station={stationId}
          >
            <div
              className={`mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-12 ${
                sideRight ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="glass hairline space-y-6 rounded-2xl border p-8 md:col-span-7 md:p-10">
                <div className="font-mono text-[11px] uppercase tracking-widest2 text-signal-violet">
                  {titles.pretitle}
                </div>
                <h2 className="math-italic text-4xl leading-tight md:text-5xl">{titles.title}</h2>
                <div className="space-y-4 leading-relaxed text-ink-100">
                  {paragraphs.map((p, idx) => (
                    <div key={idx}>
                      <p
                        className={
                          idx === paragraphs.length - 1 && paragraphs.length > 1
                            ? "text-sm text-ink-200"
                            : ""
                        }
                      >
                        {p}
                      </p>
                      {/* Insert formula after first paragraph for ln and id */}
                      {idx === 0 && formula && (
                        <pre className="hairline mt-4 overflow-x-auto rounded-lg border bg-ink-900/60 p-3 font-mono text-xs text-ink-100">
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
                        className="font-mono text-xs uppercase tracking-widest2 underline decoration-signal-violet/60 hover:text-signal-violet"
                      >
                        → {t.nav.atelier}
                      </Link>
                    </p>
                  )}
                </div>
                <div className="hairline flex items-center justify-between border-t pt-3 font-mono text-[11px] uppercase tracking-widest2 text-ink-300">
                  <span>
                    {b.presetLabel} · <span className="text-signal-cyan">{preset.id}</span>
                  </span>
                  <span>
                    {b.depthLabel} · <span className="text-signal-amber">{preset.depth}</span>
                  </span>
                </div>
              </div>
              <div className="glass hairline rounded-2xl border p-6 md:col-span-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {b.expressionTree}
                </div>
                <EmlTree root={node} className="h-auto max-h-[42vh] w-full" />
                <pre className="mt-3 break-all font-mono text-[11px] leading-relaxed text-ink-200">
                  {preset.src}
                </pre>
              </div>
            </div>
          </section>
        );
      })}

      {/* Verification widget */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-3 text-center">
            <div className="eml-pill mx-auto">{t.verifier.pretitle}</div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.verifier.title}</h2>
            <p className="mx-auto max-w-xl leading-relaxed text-ink-200">{t.verifier.intro}</p>
          </div>
          <EmlVerifier />
        </div>
      </section>

      {/* Complexity table */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-3 text-center">
            <div className="eml-pill mx-auto">{t.complexity.pretitle}</div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.complexity.title}</h2>
            <p className="mx-auto max-w-xl leading-relaxed text-ink-200">
              {t.complexity.intro} <Info side="bottom">{b.complexityRpnInfo}</Info>
            </p>
          </div>
          <div className="hairline glass rounded-2xl border p-6 md:p-8">
            <table className="w-full font-mono text-sm">
              <thead className="hairline border-b text-ink-300">
                <tr>
                  <th className="px-2 py-2 text-left font-mono text-[10px] uppercase tracking-widest2">
                    {t.complexity.headTarget}
                  </th>
                  <th className="px-2 py-2 text-right font-mono text-[10px] uppercase tracking-widest2">
                    {t.complexity.headK}
                  </th>
                  <th className="px-2 py-2 text-left font-mono text-[10px] uppercase tracking-widest2">
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
                    <td className="math-italic px-2 py-2 text-base text-ink-100">{target}</td>
                    <td className="px-2 py-2 text-right text-signal-amber">{k}</td>
                    <td className="px-2 py-2 text-xs text-ink-200">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="hairline mt-4 border-t pt-4 text-[11px] leading-relaxed text-ink-300">
              {t.complexity.note}
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="relative z-10 px-6 py-32">
        <div className="glass hairline mx-auto max-w-5xl rounded-3xl border p-10 md:p-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <div className="font-mono text-[11px] uppercase tracking-widest2 text-signal-rose">
                {t.limits.pretitle}
              </div>
              <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.limits.title}</h2>
              <p className="text-sm leading-relaxed text-ink-200">{t.limits.intro}</p>
            </div>
            <div className="space-y-3 md:col-span-7">
              {[
                b.limits.complexRequired,
                b.limits.branchCuts,
                b.limits.overflow,
                b.limits.nonSelfGen,
                b.limits.notFullyUniversal,
              ].map((row) => (
                <div key={row.k} className="hairline rounded-md border bg-ink-950/40 px-4 py-3">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-signal-rose">
                    {row.k}
                  </div>
                  <div className="text-sm leading-relaxed text-ink-200">{row.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Garden */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3 text-center">
            <div className="eml-pill mx-auto">{t.garden.pretitle}</div>
            <h2 className="math-italic text-4xl leading-tight md:text-5xl">{t.garden.title}</h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{t.garden.intro}</p>
          </div>
          <GardenGrid />
        </div>
      </section>

      {/* Closing */}
      <section className="relative z-10 px-6 py-32">
        <div className="glass hairline mx-auto max-w-4xl space-y-10 rounded-3xl border p-10 text-center md:p-14">
          <div className="eml-pill mx-auto">{t.closing.pill}</div>
          <h2 className="math-italic text-5xl leading-tight md:text-7xl">{t.closing.title}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{t.closing.intro}</p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 md:flex-row">
            <Link
              href="/eml/atelier"
              className="rounded-full border border-signal-violet/60 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-violet transition-colors hover:border-signal-violet hover:bg-signal-violet/10"
            >
              {t.closing.ctaAtelier}
            </Link>
            <Link
              href="/eml/resonance"
              className="rounded-full border border-signal-cyan/60 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-cyan transition-colors hover:border-signal-cyan hover:bg-signal-cyan/10"
            >
              {t.closing.ctaResonance}
            </Link>
          </div>
          <div className="hairline space-y-3 border-t pt-8">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest2 text-ink-400">
              {t.closing.meta}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-widest2">
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-cyan transition-colors hover:text-ink-100"
              >
                ↗ {t.footer.paper}
              </a>
              <span className="text-ink-500">·</span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-cyan transition-colors hover:text-ink-100"
              >
                ↗ {t.footer.github}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6">
        <TopicApplications topicId="eml" accent="text-signal-violet" />
        <RelatedTopics topicId="eml" accent="text-signal-violet" />
      </div>

      {/* Progress rail (right) */}
      <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {STATION_IDS.map((id, i) => (
          <div
            key={id}
            className={`w-1.5 rounded-full transition-all ${
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
    <div className="glass hairline space-y-3 rounded-2xl border p-6 transition-colors hover:border-signal-violet/40">
      <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{label}</div>
      <h3 className="math-italic text-2xl leading-snug text-ink-100">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}
