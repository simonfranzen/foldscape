"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Formula } from "@/components/Formula";
import { RelatedTopics } from "@/components/RelatedTopics";
import { useI18n } from "@/lib/i18n/context";
import type { StoryPage } from "@/lib/i18n/stories";
import { TOPIC_LINKS } from "@/lib/topicLinks";
import { TOPIC_APPLICATIONS } from "@/lib/topicApplications";
import { TOPICS } from "@/lib/topics";
import type { TopicId } from "@/lib/topics";

interface Props {
  page: StoryPage;
  ctaHref: string;
  accent: string; // e.g. "text-signal-cyan"
  borderAccent: string; // e.g. "border-signal-cyan/70"
  bgAccent: string; // e.g. "bg-signal-cyan/10"
  hoverAccent: string; // e.g. "hover:bg-signal-cyan/20"
  gradient: string; // e.g. "from-signal-cyan/10"
  formulaBadge: string; // Plain-text fallback when formulaLatex is omitted
  formulaLatex?: string; // KaTeX source for the hero formula
  // Override default hero formula sizing. Default = "lg" (text-3xl md:text-5xl).
  // Use "sm" for long formulae that would otherwise overflow the badge box —
  // e.g. Pascalmod's `binom(n,k) ≢ 0 mod p ⇔ no carry in base-p`.
  formulaSize?: "sm" | "md" | "lg";
  finalLabel: string;
  furtherReading?: Array<{ label: string; href: string }>;
  // Optional signature-hero artefact: a topic-specific visual that sits
  // between the title block and the formula card. When provided, it replaces
  // the generic page identity and is what makes the room feel like itself.
  signature?: React.ReactNode;
  children?: React.ReactNode;
}

export function StoryPageShell({
  page,
  ctaHref,
  accent,
  borderAccent,
  bgAccent,
  hoverAccent,
  gradient,
  formulaBadge,
  formulaLatex,
  formulaSize = "lg",
  finalLabel,
  furtherReading,
  signature,
  children,
}: Props) {
  const { u, locale } = useI18n();
  // Auto-look up further-reading links by parsing the topic id out of the
  // CTA href (e.g. "/mandelbrot/explorer" → "mandelbrot"). Explicit
  // furtherReading prop still wins when provided.
  const inferredTopicId = ctaHref.split("/").filter(Boolean)[0] as TopicId | undefined;
  const links = furtherReading ?? (inferredTopicId && TOPIC_LINKS[inferredTopicId]) ?? [];
  const applications = inferredTopicId
    ? (TOPIC_APPLICATIONS[locale]?.[inferredTopicId] ?? TOPIC_APPLICATIONS.en[inferredTopicId])
    : undefined;
  // Auto-detect a sound sub-route from topics.ts and offer it as a third
  // CTA — so visitors don't miss it when they land on the story page.
  const topicEntry = TOPICS.find((t) => t.id === inferredTopicId);
  const soundSection = topicEntry?.sections?.find((s) => s.key === "sound");

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div
        className={`fixed inset-0 -z-10 bg-gradient-to-b ${gradient} pointer-events-none via-transparent to-ink-950`}
      />

      <section className="mx-auto mb-32 max-w-5xl space-y-7 pb-12 text-center md:pb-16">
        <Reveal>
          <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
            {page.pretitle}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="math-italic text-6xl leading-[0.95] tracking-tight md:text-8xl">
            {page.title}
          </h1>
        </Reveal>
        <Reveal delay={250}>
          <p className="math-italic text-2xl leading-snug text-ink-200 md:text-3xl">
            {page.tagline}
          </p>
        </Reveal>
        <Reveal delay={380}>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{page.intro}</p>
        </Reveal>
        {signature && (
          <Reveal delay={460}>
            <div className="mx-auto mt-4 max-w-4xl">{signature}</div>
          </Reveal>
        )}
        <Reveal delay={500}>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 md:flex-row">
            <Link
              href={ctaHref}
              className={`rounded-full border px-6 py-3 ${borderAccent} ${bgAccent} ${hoverAccent} ${accent} font-mono text-xs uppercase tracking-widest2 transition-colors`}
            >
              {page.ctaInteractive}
            </Link>
            {soundSection && (
              <Link
                href={soundSection.href}
                className="flex items-center gap-2 rounded-full border border-signal-cyan/60 bg-signal-cyan/10 px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-cyan transition-colors hover:bg-signal-cyan/20"
              >
                <span aria-hidden="true">♪</span>
                {u.sound?.label ?? "Hear it"}
              </Link>
            )}
            <Link
              href="/"
              className="hairline rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
            >
              {u.back}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={620}>
          <div
            className={`hairline glass float-gentle mx-auto mt-8 max-w-4xl overflow-x-auto rounded-2xl border px-4 py-6 md:px-8 md:py-8 ${accent}`}
          >
            {formulaLatex ? (
              <Formula
                expression={formulaLatex}
                block
                size={formulaSize}
                className={
                  formulaSize === "lg"
                    ? "md:text-5xl"
                    : formulaSize === "md"
                      ? "md:text-3xl"
                      : "md:text-xl"
                }
              />
            ) : (
              <div className="break-words text-center font-mono text-xl text-ink-100 md:text-2xl">
                {formulaBadge}
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {children}

      {applications && applications.length > 0 && (
        <Reveal>
          <section className="glass hairline mx-auto mt-16 max-w-5xl space-y-5 rounded-2xl border p-8 md:p-10">
            <div className="space-y-2">
              <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
                {u.applications?.label ?? "Where you meet it"}
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-ink-200">
                {u.applications?.lead ?? "How and where this technique lives in the world today."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {applications.map((app, i) => (
                <div
                  key={i}
                  className="hairline flex gap-4 rounded-md border bg-ink-950/40 p-4 transition-colors hover:border-ink-300/40"
                >
                  {inferredTopicId && (
                    /* Per-topic, per-application filigree icons under
                       public/icons/<topic>/<index>.svg. Rendered via CSS
                       mask-image — NOT <img> — because the icons use
                       `stroke="currentColor"` to inherit the page accent,
                       and <img> would render that as black on black. With
                       a mask, the box's background colour shows through
                       the icon's silhouette, so the icon takes whatever
                       `text-signal-*` colour the surrounding accent class
                       provides. `bg-current` ties it to the parent's text
                       colour set via `${accent}`. */
                    <span
                      aria-hidden="true"
                      className={`h-11 w-11 flex-shrink-0 select-none bg-current ${accent} opacity-90`}
                      style={{
                        WebkitMaskImage: `url(/icons/${inferredTopicId}/${i}.svg)`,
                        maskImage: `url(/icons/${inferredTopicId}/${i}.svg)`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                    />
                  )}
                  <div className="min-w-0 space-y-2">
                    <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
                      {app.domain}
                    </div>
                    <div className="text-sm leading-relaxed text-ink-100">{app.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {links.length > 0 && (
        <Reveal>
          <section className="glass hairline mx-auto mt-16 max-w-3xl space-y-4 rounded-2xl border p-8">
            <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
              {u.further?.label ?? "Further reading"}
            </div>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2 text-ink-100 hover:${accent} transition-colors`}
                  >
                    <span
                      className={`${accent} opacity-60 transition-opacity group-hover:opacity-100`}
                    >
                      ↗
                    </span>
                    <span className="underline decoration-ink-700 underline-offset-4 group-hover:decoration-current">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {inferredTopicId && <RelatedTopics topicId={inferredTopicId} accent={accent} />}

      <Reveal>
        <section className="glass hairline mx-auto mt-16 max-w-3xl space-y-6 rounded-3xl border p-10 text-center">
          <div className="math-italic shimmer-text text-3xl leading-tight md:text-5xl">
            {finalLabel}
          </div>
          <Link
            href={ctaHref}
            className={`inline-block rounded-full border px-8 py-4 ${borderAccent} ${bgAccent} ${hoverAccent.replace("/20", "/25")} ${accent} font-mono text-sm uppercase tracking-widest2 transition-colors`}
          >
            {page.ctaInteractive}
          </Link>
        </section>
      </Reveal>
    </main>
  );
}

export function StoryCard({
  pretitle,
  title,
  body,
  accent,
}: {
  pretitle: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <Reveal>
      <article className="glass hairline space-y-4 rounded-2xl border p-8 md:p-10">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>
          {pretitle}
        </div>
        <h2 className="math-italic text-3xl leading-tight md:text-4xl">{title}</h2>
        <p className="leading-relaxed text-ink-100">{body}</p>
      </article>
    </Reveal>
  );
}

// Small interactive "explain the formula" card — break down a formula into
// parts the user can hover to see what each symbol means.
interface FormulaPart {
  latex: string;
  name: string;
  description: string;
}

export function FormulaExplainer({
  title,
  fullLatex,
  parts,
  accent,
}: {
  title: string;
  fullLatex: string;
  parts: FormulaPart[];
  accent: string;
}) {
  return (
    <Reveal>
      <div className="hairline space-y-6 rounded-2xl border bg-ink-950/40 p-6 md:p-8">
        <div className={`font-mono text-[10px] uppercase tracking-widest2 ${accent}`}>{title}</div>
        <div className="py-4">
          <Formula expression={fullLatex} block size="xl" className="text-ink-100" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {parts.map((p) => (
            <div
              key={p.name}
              className="hairline space-y-2 rounded-md border bg-ink-950/60 p-4 transition-colors hover:border-ink-300/40"
            >
              <div className="flex items-baseline gap-3">
                <div className={`${accent}`}>
                  <Formula expression={p.latex} size="md" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                  {p.name}
                </div>
              </div>
              <div className="text-sm leading-relaxed text-ink-200">{p.description}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
