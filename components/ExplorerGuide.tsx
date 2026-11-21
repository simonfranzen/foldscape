"use client";

import { useRef, useState } from "react";
import Link from "@/components/LocaleLink";
import { Formula } from "@/components/Formula";
import { useI18n } from "@/lib/i18n/context";
import {
  guideFor,
  type ExplorerGuide,
  type ExplorerGuideContent,
} from "@/lib/explorer-guides/types";

const GUIDE_ID = "how-it-works";

const LABELS: Record<string, { help: string; close: string; story: string }> = {
  en: { help: "How does this work?", close: "Close", story: "Read the full story" },
  de: { help: "Wie funktioniert das?", close: "Schließen", story: "Zur ganzen Geschichte" },
};
const labelsFor = (locale: string) => LABELS[locale] ?? LABELS.en;

function GuideBody({ c, headingLevel }: { c: ExplorerGuideContent; headingLevel: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const H2 = headingLevel === 2 ? "h3" : "h4";
  return (
    <div className="space-y-10">
      <p className="text-base leading-relaxed text-ink-100 md:text-lg">{c.intro}</p>
      {c.sections.map((s) => (
        <section key={s.heading} className="space-y-4">
          <H className="math-italic text-2xl text-ink-100 md:text-3xl">{s.heading}</H>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed text-ink-200">
              {p}
            </p>
          ))}
          {s.formula && (
            <div className="overflow-x-auto py-2">
              <Formula expression={s.formula} block />
            </div>
          )}
          {s.code && (
            <pre className="hairline scrollbar-thin overflow-x-auto rounded-md border bg-ink-900/60 p-4 font-mono text-xs leading-relaxed text-ink-200">
              <code>{s.code}</code>
            </pre>
          )}
        </section>
      ))}
      <section className="space-y-4">
        <H className="math-italic text-2xl text-ink-100 md:text-3xl">{c.experimentsHeading}</H>
        <ol className="space-y-4">
          {c.experiments.map((e, i) => (
            <li key={e.title} className="hairline rounded-md border p-4">
              <H2 className="font-mono text-[11px] uppercase tracking-widest2 text-signal-amber">
                {i + 1}. {e.title}
              </H2>
              <p className="mt-2 leading-relaxed text-ink-200">{e.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// Long-form explanation below the playground. It is always rendered (not
// lazily, not collapsed) because this text is what makes the explorer route
// worth indexing; the help modal only re-presents the same content.
export function ExplorerGuideSection({
  guide,
  storyHref,
}: {
  guide: ExplorerGuide;
  storyHref: string;
}) {
  const { locale } = useI18n();
  const c = guideFor(guide, locale);
  const l = labelsFor(locale);
  return (
    <section
      id={GUIDE_ID}
      aria-labelledby={`${GUIDE_ID}-title`}
      className="hairline scroll-mt-20 border-t bg-ink-950"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h2
          id={`${GUIDE_ID}-title`}
          className="mb-10 font-mono text-[11px] uppercase tracking-widest2 text-signal-violet"
        >
          {c.heading}
        </h2>
        <GuideBody c={c} headingLevel={2} />
        <Link
          href={storyHref}
          className="hairline mt-12 inline-block rounded-md border px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
        >
          {l.story}
        </Link>
      </div>
    </section>
  );
}

// Floating "?" over the canvas. Opens a native <dialog> (focus trap, Esc and
// backdrop handling for free). The dialog body mounts on first open only, so
// the prerendered HTML carries the guide text once, in the section below.
export function ExplorerHelpButton({ guide }: { guide: ExplorerGuide }) {
  const { locale } = useI18n();
  const c = guideFor(guide, locale);
  const l = labelsFor(locale);
  const ref = useRef<HTMLDialogElement | null>(null);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={l.help}
        title={l.help}
        onClick={() => {
          setMounted(true);
          ref.current?.showModal();
        }}
        className="glass hairline pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border font-mono text-sm text-ink-200 transition-colors hover:border-signal-violet/60 hover:text-signal-violet"
      >
        ?
      </button>
      <dialog
        ref={ref}
        aria-label={c.heading}
        onClick={(e) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        className="m-auto max-h-[85vh] w-[min(720px,calc(100vw-32px))] overflow-hidden rounded-lg border border-ink-700 bg-ink-950 p-0 text-ink-100 backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm"
      >
        <div className="hairline flex items-center justify-between border-b bg-ink-950 px-6 py-4">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-signal-violet">
            {c.heading}
          </span>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300 hover:text-ink-100"
          >
            {l.close} ✕
          </button>
        </div>
        <div className="scrollbar-thin max-h-[calc(85vh-56px)] overflow-y-auto px-6 py-6">
          {mounted && <GuideBody c={c} headingLevel={3} />}
        </div>
      </dialog>
    </>
  );
}
