"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS, type TopicCategory } from "@/lib/topics";
import { PAPER_URL, GITHUB_URL } from "@/components/Footer";

const CATEGORY_ACCENT: Record<TopicCategory, string> = {
  logic: "text-signal-violet border-signal-violet/40",
  computation: "text-signal-cyan border-signal-cyan/40",
  chaos: "text-signal-rose border-signal-rose/40",
  geometry: "text-signal-amber border-signal-amber/40",
  analysis: "text-signal-amber border-signal-amber/40",
  paradox: "text-signal-rose border-signal-rose/40",
};

const CATEGORY_BG: Record<TopicCategory, string> = {
  logic: "from-signal-violet/15 via-transparent to-transparent",
  computation: "from-signal-cyan/15 via-transparent to-transparent",
  chaos: "from-signal-rose/15 via-transparent to-transparent",
  geometry: "from-signal-amber/15 via-transparent to-transparent",
  analysis: "from-signal-amber/12 via-transparent to-transparent",
  paradox: "from-signal-rose/12 via-transparent to-transparent",
};

export default function Landing() {
  const { a } = useI18n();
  const [filter, setFilter] = useState<TopicCategory | "all">("all");

  const visible = filter === "all" ? TOPICS : TOPICS.filter((t) => t.category === filter);

  return (
    <main className="relative isolate min-h-screen">
      <div className="fixed inset-0 -z-0 grid-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 -z-0 bg-gradient-to-b from-ink-950 via-ink-950/80 to-ink-950 pointer-events-none" />

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-16 z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="eml-pill mx-auto">{a.landing.pretitle}</div>
          <h1 className="math-italic text-6xl md:text-8xl leading-[0.95] tracking-tight">
            {a.landing.title1}{" "}
            <span className="text-signal-violet">{a.landing.title2}</span>
          </h1>
          <p className="text-xl md:text-2xl text-ink-200 leading-snug max-w-2xl mx-auto math-italic">
            {a.landing.subtitle}
          </p>
          <div className="space-y-4 text-ink-200 leading-relaxed max-w-xl mx-auto pt-3">
            <p>{a.landing.intro1}</p>
            <p>{a.landing.intro2}</p>
          </div>
          <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase pt-2">
            {a.landing.authoredByPrefix}{" "}
            <a
              href="https://www.zauberware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-violet hover:text-ink-100 transition-colors"
            >
              {a.landing.authoredByName} · {a.landing.authoredByOrg}
            </a>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="relative px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2 py-6">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            {a.landing.browseLabel}
          </FilterChip>
          {(["logic", "computation", "chaos", "analysis", "paradox"] as TopicCategory[]).map((c) => (
            <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
              {a.landing[`category${c[0].toUpperCase()}${c.slice(1)}` as keyof typeof a.landing] as string}
            </FilterChip>
          ))}
        </div>
      </section>

      {/* Topic grid */}
      <section className="relative px-6 pb-20 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((topic) => {
            const meta = a.topics[topic.id];
            const categoryLabel = a.landing[
              `category${topic.category[0].toUpperCase()}${topic.category.slice(1)}` as keyof typeof a.landing
            ] as string;
            const statusLabel =
              topic.status === "interactive" ? a.landing.statusInteractive : a.landing.statusStub;
            return (
              <Link
                key={topic.id}
                href={topic.href}
                className="group relative rounded-2xl overflow-hidden border hairline bg-ink-900/50 hover:border-signal-violet/40 transition-colors min-h-[280px] flex flex-col"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_BG[topic.category]} opacity-60 pointer-events-none`} />
                <div className="relative p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full border font-mono text-[10px] tracking-widest2 uppercase ${CATEGORY_ACCENT[topic.category]}`}>
                      {categoryLabel}
                    </div>
                    <div
                      className={`font-mono text-[10px] tracking-widest2 uppercase ${
                        topic.status === "interactive" ? "text-signal-cyan" : "text-ink-400"
                      }`}
                    >
                      {topic.status === "interactive" ? "● " : "○ "}
                      {statusLabel}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="math-italic text-3xl text-ink-100 leading-tight">
                      {meta.title}
                    </div>
                    <div className="text-ink-200 leading-snug">{meta.tagline}</div>
                    {topic.formula && (
                      <div className="font-mono text-xs text-ink-300 mt-2 bg-ink-950/40 border hairline rounded-md px-3 py-2 inline-block">
                        {topic.formula}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t hairline">
                    <div className="font-mono text-[10px] tracking-widest2 uppercase text-ink-400">
                      {topic.id}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest2 uppercase text-signal-violet opacity-0 group-hover:opacity-100 transition-opacity">
                      {a.landing.enterTopic}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer links */}
      <section className="relative px-6 pb-20 z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="font-mono text-[10px] tracking-widest2 text-ink-400 uppercase">
            external
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-widest2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-full border hairline text-ink-200 hover:text-signal-cyan hover:border-signal-cyan/40 transition-colors"
            >
              ↗ GitHub
            </a>
            <a
              href="https://www.zauberware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-full border hairline text-ink-200 hover:text-signal-amber hover:border-signal-amber/40 transition-colors"
            >
              ↗ zauberware.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 font-mono text-[10px] tracking-widest2 uppercase border transition-colors ${
        active
          ? "border-signal-violet bg-signal-violet/15 text-signal-violet"
          : "hairline text-ink-300 hover:text-ink-100 hover:border-ink-300/40"
      }`}
    >
      {children}
    </button>
  );
}
