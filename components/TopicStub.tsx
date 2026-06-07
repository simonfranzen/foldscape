"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { getTopic, type TopicId } from "@/lib/topics";

const CATEGORY_ACCENT: Record<string, string> = {
  logic: "text-signal-violet",
  computation: "text-signal-cyan",
  chaos: "text-signal-rose",
  geometry: "text-signal-amber",
  analysis: "text-signal-amber",
  paradox: "text-signal-rose",
};

const CATEGORY_BG: Record<string, string> = {
  logic: "from-signal-violet/20",
  computation: "from-signal-cyan/20",
  chaos: "from-signal-rose/20",
  geometry: "from-signal-amber/20",
  analysis: "from-signal-amber/20",
  paradox: "from-signal-rose/20",
};

export function TopicStub({ topicId }: { topicId: TopicId }) {
  const { a } = useI18n();
  const topic = getTopic(topicId);
  const meta = a.topics[topicId];
  const categoryLabel = a.landing[
    `category${topic.category[0].toUpperCase()}${topic.category.slice(1)}` as keyof typeof a.landing
  ] as string;

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div
        className={`fixed inset-0 -z-10 bg-gradient-to-br ${CATEGORY_BG[topic.category]} pointer-events-none via-transparent to-transparent opacity-50`}
      />
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />

      <div className="mx-auto max-w-3xl space-y-12">
        <Link
          href="/"
          className="inline-block font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:text-signal-violet"
        >
          {a.comingSoon.back}
        </Link>

        <header className="space-y-6">
          <div
            className={`font-mono text-[10px] uppercase tracking-widest2 ${CATEGORY_ACCENT[topic.category]}`}
          >
            {categoryLabel} · {a.landing.statusStub}
          </div>
          <h1 className="math-italic text-5xl leading-[0.95] tracking-tight md:text-7xl">
            {meta.title}
          </h1>
          <p className="math-italic text-2xl leading-snug text-ink-200">{meta.tagline}</p>
        </header>

        {topic.formula && (
          <div className="glass hairline rounded-2xl border p-8 text-center">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              Formula
            </div>
            <div className="math-italic break-words text-3xl text-ink-100 md:text-4xl">
              {topic.formula}
            </div>
          </div>
        )}

        <section className="glass hairline space-y-5 rounded-2xl border p-8">
          <p className="text-lg leading-relaxed text-ink-100">{meta.body}</p>
        </section>

        <section className="glass hairline space-y-3 rounded-2xl border p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
            {a.comingSoon.title}
          </div>
          <p className="text-sm leading-relaxed text-ink-200">{a.comingSoon.body}</p>
        </section>
      </div>
    </main>
  );
}
