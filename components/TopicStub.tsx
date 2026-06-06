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
    <main className="pt-24 pb-32 px-6 min-h-screen relative isolate">
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${CATEGORY_BG[topic.category]} via-transparent to-transparent opacity-50 pointer-events-none`} />
      <div className="fixed inset-0 -z-10 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-12">
        <Link
          href="/"
          className="inline-block font-mono text-[10px] tracking-widest2 uppercase text-ink-300 hover:text-signal-violet transition-colors"
        >
          {a.comingSoon.back}
        </Link>

        <header className="space-y-6">
          <div className={`font-mono text-[10px] tracking-widest2 uppercase ${CATEGORY_ACCENT[topic.category]}`}>
            {categoryLabel} · {a.landing.statusStub}
          </div>
          <h1 className="math-italic text-5xl md:text-7xl leading-[0.95] tracking-tight">
            {meta.title}
          </h1>
          <p className="text-2xl text-ink-200 leading-snug math-italic">
            {meta.tagline}
          </p>
        </header>

        {topic.formula && (
          <div className="glass border hairline rounded-2xl p-8 text-center">
            <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase mb-3">
              Formula
            </div>
            <div className="math-italic text-3xl md:text-4xl text-ink-100 break-words">
              {topic.formula}
            </div>
          </div>
        )}

        <section className="glass border hairline rounded-2xl p-8 space-y-5">
          <p className="text-ink-100 text-lg leading-relaxed">{meta.body}</p>
        </section>

        <section className="glass border hairline rounded-2xl p-6 space-y-3">
          <div className="font-mono text-[10px] tracking-widest2 text-signal-amber uppercase">
            {a.comingSoon.title}
          </div>
          <p className="text-ink-200 text-sm leading-relaxed">{a.comingSoon.body}</p>
        </section>
      </div>
    </main>
  );
}
