"use client";

// Full-screen card list overlay — restores the v3 "list view" the user
// liked, now as an option rather than a default. Opens from the HUD
// "List" button. Card carries formula + category accent + hover reveal of
// "Enter →". No status chip: every topic is interactive, so the badge only
// ever said the same thing.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS, type Topic, type TopicCategory } from "@/lib/topics";
import { buildHaystack, normaliseQuery, scoreTopic } from "@/lib/cosmos/search";

// Each category owns one signal hue — coral and teal added so chaos and
// analysis no longer share with paradox / geometry.
const CATEGORY_ACCENT: Record<TopicCategory, string> = {
  logic: "text-signal-violet border-signal-violet/40",
  computation: "text-signal-cyan border-signal-cyan/40",
  chaos: "text-signal-coral border-signal-coral/40",
  geometry: "text-signal-amber border-signal-amber/40",
  analysis: "text-signal-teal border-signal-teal/40",
  paradox: "text-signal-rose border-signal-rose/40",
};
const CATEGORY_BG: Record<TopicCategory, string> = {
  logic: "from-signal-violet/15 via-transparent to-transparent",
  computation: "from-signal-cyan/15 via-transparent to-transparent",
  chaos: "from-signal-coral/15 via-transparent to-transparent",
  geometry: "from-signal-amber/15 via-transparent to-transparent",
  analysis: "from-signal-teal/12 via-transparent to-transparent",
  paradox: "from-signal-rose/12 via-transparent to-transparent",
};

const CATEGORIES: TopicCategory[] = [
  "logic",
  "computation",
  "chaos",
  "geometry",
  "analysis",
  "paradox",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TopicListOverlay({ open, onClose }: Props) {
  const { a } = useI18n();
  const [filter, setFilter] = useState<TopicCategory | "all">("all");
  const [query, setQuery] = useState("");

  // Esc closes the overlay — matches CommandPalette behaviour so the two
  // dismissal paths feel the same.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const haystacks = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of TOPICS) {
      const meta = a.topics[t.id];
      m.set(
        t.id,
        buildHaystack({ id: t.id, title: meta.title, tagline: meta.tagline, formula: t.formula }),
      );
    }
    return m;
  }, [a.topics]);

  const q = normaliseQuery(query);
  const visible: Topic[] = useMemo(() => {
    const byCat = filter === "all" ? TOPICS : TOPICS.filter((t) => t.category === filter);
    if (!q) return byCat;
    return byCat
      .map((t) => ({ t, score: scoreTopic(haystacks.get(t.id) ?? "", q) }))
      .filter((r) => r.score > 0)
      .sort((a1, b1) => b1.score - a1.score)
      .map((r) => r.t);
  }, [filter, haystacks, q]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Topic list"
      // z-[70] sits above both the global Nav header (z-50) and the cosmos
      // HUD search/list buttons (z-[55]) so the overlay reads as a clean
      // modal — not a card grid with floating widgets pasted over it
      // (user feedback: "chaos oben unter dem header").
      className="fixed inset-0 z-[70] overflow-y-auto bg-ink-950/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="math-italic text-3xl text-ink-100 md:text-4xl">{a.landing.browseLabel}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close list view"
            className="hairline rounded-full border bg-ink-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/50 hover:text-ink-100"
          >
            ✕
          </button>
        </div>

        {/* Search + category chips */}
        <div className="mb-6 space-y-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              a.landing.constellationSearchPlaceholder ?? "Search topics, formulas, ideas…"
            }
            aria-label={a.landing.constellationSearchLabel ?? "Search topics"}
            className="hairline w-full rounded-full border bg-ink-950/60 px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-100 placeholder:text-ink-400 focus:border-signal-violet/60 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              {a.landing.browseLabel}
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
                {
                  a.landing[
                    `category${c[0].toUpperCase()}${c.slice(1)}` as keyof typeof a.landing
                  ] as string
                }
              </FilterChip>
            ))}
          </div>
        </div>

        {visible.length === 0 && (
          <p className="mx-auto max-w-md py-12 text-center text-sm text-ink-400">
            {a.landing.constellationEmpty ?? "Nothing matches."}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((topic) => {
            const meta = a.topics[topic.id];
            const categoryLabel = a.landing[
              `category${topic.category[0].toUpperCase()}${topic.category.slice(1)}` as keyof typeof a.landing
            ] as string;
            return (
              <Link
                key={topic.id}
                href={topic.href}
                onClick={onClose}
                className="hairline group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border bg-ink-900/50 transition-colors hover:border-signal-violet/40"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_BG[topic.category]} pointer-events-none opacity-60`}
                />
                <div className="relative flex h-full flex-col gap-4 p-6">
                  <div>
                    <div
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 ${CATEGORY_ACCENT[topic.category]}`}
                    >
                      {categoryLabel}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="math-italic text-2xl leading-tight text-ink-100">
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
      </div>
    </div>
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
      type="button"
      onClick={onClick}
      aria-pressed={active}
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
