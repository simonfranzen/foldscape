"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS, type Topic, type TopicCategory } from "@/lib/topics";
import { LandingBackdrop } from "@/components/LandingBackdrop";
import { Reveal } from "@/components/Reveal";
import { TopicConstellation } from "@/components/TopicConstellation";

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

type ViewMode = "constellation" | "list";

export default function Landing() {
  const { a } = useI18n();
  const [filter, setFilter] = useState<TopicCategory | "all">("all");
  const [view, setView] = useState<ViewMode>("constellation");
  // List view needs its own search box (the constellation has one inside the
  // canvas; users in list view never see it). Independent state keeps the
  // two surfaces simple — one search per surface.
  const [listQuery, setListQuery] = useState("");

  // Per-session topic order: shuffled once on client mount so the list view
  // doesn't always lead with the same handful of topics. SSR renders the
  // canonical TOPICS order to avoid a hydration mismatch; the client effect
  // overrides it on the next tick. A new shuffle fires on each filter change
  // so the filtered list also feels random, not alphabetical.
  const [topicOrder, setTopicOrder] = useState<Topic[]>(TOPICS);
  useEffect(() => {
    const shuffled = [...TOPICS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTopicOrder(shuffled);
  }, [filter]);
  const listQ = listQuery.trim().toLowerCase();
  const visible = useMemo(() => {
    const byCategory =
      filter === "all" ? topicOrder : topicOrder.filter((t) => t.category === filter);
    if (!listQ) return byCategory;
    return byCategory.filter((t) => {
      const meta = a.topics[t.id];
      const hay = `${t.id} ${meta.title} ${meta.tagline} ${t.formula ?? ""}`.toLowerCase();
      return hay.includes(listQ);
    });
  }, [filter, topicOrder, listQ, a.topics]);

  return (
    <main className="relative isolate min-h-screen">
      <a
        href="#atlas"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-signal-violet focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest2 focus:text-ink-950"
      >
        Skip to atlas
      </a>
      <div className="pointer-events-none fixed inset-0 -z-0 bg-ink-950" />

      {/* Hero with live backdrop */}
      <section className="relative z-10 overflow-hidden pb-20 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <LandingBackdrop />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/55 to-ink-950" />
        </div>
        <div className="relative mx-auto max-w-4xl space-y-8 px-6 text-center">
          <Reveal>
            <div className="tag-pill mx-auto">{a.landing.pretitle}</div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="math-italic text-6xl leading-[0.9] tracking-tight md:text-9xl">
              {a.landing.title1}
              <span className="mx-2 text-ink-300 md:mx-4">—</span>
              <span className="shimmer-text">{a.landing.title2}</span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="math-italic mx-auto max-w-2xl text-xl leading-snug text-ink-200 md:text-2xl">
              {a.landing.subtitle}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="mx-auto max-w-3xl pt-2 text-lg leading-relaxed text-ink-100 md:text-xl">
              {a.landing.hook}
            </p>
          </Reveal>
          <Reveal delay={540}>
            <div className="pt-4 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {a.landing.authoredByPrefix}{" "}
              <a
                href="https://www.zauberware.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-violet transition-colors hover:text-ink-100"
              >
                {a.landing.authoredByName} · {a.landing.authoredByOrg}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* For whom + why */}
      <section className="relative z-10 px-6 pb-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          <Reveal>
            <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
                {a.landing.forWhomLabel}
              </div>
              <p className="leading-relaxed text-ink-100">{a.landing.forWhom}</p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="glass hairline h-full space-y-3 rounded-2xl border p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {a.landing.motivationLabel}
              </div>
              <p className="leading-relaxed text-ink-100">{a.landing.motivation}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Existing intros, lower-key now */}
      <section className="relative z-10 px-6 pb-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center leading-relaxed text-ink-200">
          <Reveal>
            <p>{a.landing.intro1}</p>
          </Reveal>
          <Reveal delay={120}>
            <p>{a.landing.intro2}</p>
          </Reveal>
        </div>
      </section>

      {/* View toggle. Sole top-level navigation control — categories live
          inside the constellation (or above the cards in list view) so the
          same chips never appear twice. */}
      <section className="relative z-10 px-6" id="atlas">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-6">
          <ViewToggle
            value={view}
            onChange={setView}
            constellationLabel={a.landing.viewConstellation ?? "Constellation"}
            listLabel={a.landing.viewList ?? "List"}
          />
        </div>
      </section>

      {/* Atlas: constellation (default) or list */}
      {view === "constellation" ? (
        <section className="relative z-10 px-4 pb-20 md:px-6">
          <div className="mx-auto max-w-7xl">
            <Reveal delay={120}>
              <div className="hairline overflow-hidden rounded-3xl border bg-ink-950/40">
                <TopicConstellation filter={filter} setFilter={setFilter} />
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="relative z-10 px-6 pb-20">
          {/* List view: search + all six category chips. The constellation
              uses a different surface for the same controls (search box +
              pills inside the canvas), so each view is self-sufficient. */}
          <div className="mx-auto mb-4 max-w-xl">
            <label className="block">
              <span className="sr-only">
                {a.landing.constellationSearchLabel ?? "Search the atlas"}
              </span>
              <div className="relative">
                <input
                  type="search"
                  value={listQuery}
                  onChange={(e) => setListQuery(e.target.value)}
                  placeholder={
                    a.landing.constellationSearchPlaceholder ?? "Search topics, formulas, ideas…"
                  }
                  className="hairline w-full rounded-full border bg-ink-950/60 px-4 py-2 pr-10 font-mono text-[11px] uppercase tracking-widest2 text-ink-100 placeholder:text-ink-400 focus:border-signal-violet/60 focus:outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest2 text-ink-400"
                >
                  {listQ ? `${visible.length}` : "⌕"}
                </div>
              </div>
            </label>
          </div>
          <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-center gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              {a.landing.browseLabel}
            </FilterChip>
            {(
              [
                "logic",
                "computation",
                "chaos",
                "geometry",
                "analysis",
                "paradox",
              ] as TopicCategory[]
            ).map((c) => (
              <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
                {
                  a.landing[
                    `category${c[0].toUpperCase()}${c.slice(1)}` as keyof typeof a.landing
                  ] as string
                }
              </FilterChip>
            ))}
          </div>
          {visible.length === 0 && (
            <p className="mx-auto max-w-md py-12 text-center text-sm text-ink-400">
              {a.landing.constellationEmpty ?? "Nothing matches."}
            </p>
          )}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                  className="hairline group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border bg-ink-900/50 transition-colors hover:border-signal-violet/40"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_BG[topic.category]} pointer-events-none opacity-60`}
                  />
                  <div className="relative flex h-full flex-col gap-4 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 ${CATEGORY_ACCENT[topic.category]}`}
                      >
                        {categoryLabel}
                      </div>
                      <div
                        className={`font-mono text-[10px] uppercase tracking-widest2 ${
                          topic.status === "interactive" ? "text-signal-cyan" : "text-ink-400"
                        }`}
                      >
                        {topic.status === "interactive" ? "● " : "○ "}
                        {statusLabel}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="math-italic text-3xl leading-tight text-ink-100">
                        {meta.title}
                      </div>
                      <div className="leading-snug text-ink-200">{meta.tagline}</div>
                      {topic.formula && (
                        <div className="hairline mt-2 inline-block rounded-md border bg-ink-950/40 px-3 py-2 font-mono text-xs text-ink-300">
                          {topic.formula}
                        </div>
                      )}
                    </div>
                    <div className="hairline flex items-center justify-between border-t pt-2">
                      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                        {topic.id}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet opacity-0 transition-opacity group-hover:opacity-100">
                        {a.landing.enterTopic}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
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
      className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors ${
        active
          ? "border-signal-violet bg-signal-violet/15 text-signal-violet"
          : "hairline text-ink-300 hover:border-ink-300/40 hover:text-ink-100"
      }`}
    >
      {children}
    </button>
  );
}

function ViewToggle({
  value,
  onChange,
  constellationLabel,
  listLabel,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  constellationLabel: string;
  listLabel: string;
}) {
  const Btn = ({ v, label }: { v: ViewMode; label: string }) => (
    <button
      onClick={() => onChange(v)}
      aria-pressed={value === v}
      className={`px-6 py-3 font-mono text-xs uppercase tracking-widest2 transition-colors ${
        value === v
          ? "bg-signal-cyan/10 text-signal-cyan"
          : "text-ink-400 hover:bg-ink-900/40 hover:text-ink-200"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="hairline inline-flex items-center overflow-hidden rounded-full border bg-ink-950/40">
      <Btn v="constellation" label={constellationLabel} />
      <div className="h-6 w-px bg-ink-700/60" aria-hidden="true" />
      <Btn v="list" label={listLabel} />
    </div>
  );
}
