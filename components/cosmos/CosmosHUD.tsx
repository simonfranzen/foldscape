"use client";

// Persistent navigation HUD: compass (jump to category), search palette
// (Ctrl/⌘-K or "/" opens), and a thin reading-progress bar. Stays fixed at
// the viewport edges so the cosmos remains navigable from anywhere.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS } from "@/lib/topics";
import { CATEGORY_COLOR, SCENE_ORDER } from "@/lib/cosmos/layout";
import { palette } from "@/lib/visual/palette";
import { COSMOS } from "@/lib/i18n/cosmos";
import { useDocumentScrollProgress } from "@/lib/cosmos/hooks";
import { buildHaystack, normaliseQuery, scoreTopic } from "@/lib/cosmos/search";
import { TopicListOverlay } from "@/components/cosmos/TopicListOverlay";

interface Props {
  activeCategory: string | null;
}

function smoothScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CosmosHUD({ activeCategory }: Props) {
  const { a, locale } = useI18n();
  const cosmos = COSMOS[locale];
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const progress = useDocumentScrollProgress();
  // When any overlay is open, mute the rest of the HUD so it doesn't peek
  // through the modal's backdrop. The dialog z-index keeps it above
  // everything, but the user still spotted ghost buttons through the
  // semi-transparent layer — hiding the HUD entirely is the clean answer.
  const overlayOpen = paletteOpen || listOpen;

  // Keyboard: "/" opens search, Cmd/Ctrl-K opens search, Esc closes,
  // 1..6 jumps to category scenes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
        return;
      }
      if (inField) return;
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= SCENE_ORDER.length) {
        e.preventDefault();
        smoothScrollToId(`scene-${SCENE_ORDER[n - 1]}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  // Focus input when palette opens
  useEffect(() => {
    if (paletteOpen) {
      // setTimeout so the input is in the DOM before we focus it
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
    setQuery("");
  }, [paletteOpen]);

  // Forgiving search: normalise both sides so "gameoflife" finds the
  // "Game of Life" topic. The per-topic haystack is recomputed only when
  // the locale-specific topics dict changes — cheap, but skip the work on
  // every keystroke.
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
  const results = useMemo(() => {
    if (!q) return TOPICS.slice(0, 24);
    return TOPICS.map((t) => ({ t, score: scoreTopic(haystacks.get(t.id) ?? "", q) }))
      .filter((r) => r.score > 0)
      .sort((a1, b1) => b1.score - a1.score)
      .slice(0, 24)
      .map((r) => r.t);
  }, [q, haystacks]);

  const closePalette = useCallback(() => setPaletteOpen(false), []);

  return (
    <>
      {/* DESKTOP — right-edge compass. Dots are flush-right; labels grow
          LEFT toward the viewport centre. Hidden on mobile (replaced by a
          bottom strip — see below). Whole HUD layer is conditionally
          rendered out when an overlay is open so it never bleeds through. */}
      {!overlayOpen && (
        <>
          <nav
            aria-label={cosmos.jumpLabel}
            className="hud-fixed pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
          >
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
              {cosmos.jumpLabel}
            </div>
            {SCENE_ORDER.map((cat, i) => {
              const isActive = activeCategory === cat;
              const categoryKey = `category${cat[0].toUpperCase()}${cat.slice(1)}` as
                | "categoryLogic"
                | "categoryComputation"
                | "categoryChaos"
                | "categoryGeometry"
                | "categoryAnalysis"
                | "categoryParadox";
              const name = (a.landing as unknown as Record<string, string>)[categoryKey] ?? cat;
              // The active category's name is ALWAYS visible (user feedback:
              // "die aktive sektion sollte mit namen dann immer sichtbar sein").
              // Inactive labels still reveal on hover/focus so the menu doesn't
              // sprawl into a column of words.
              return (
                <button
                  key={cat}
                  onClick={() => smoothScrollToId(`scene-${cat}`)}
                  aria-label={`${i + 1}. ${name}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex flex-row-reverse items-center gap-3 text-right"
                >
                  <span
                    className="inline-block h-3 w-3 flex-shrink-0 rounded-full transition-all"
                    style={{
                      background: isActive ? CATEGORY_COLOR[cat] : "rgba(234,236,243,0.32)",
                      boxShadow: isActive ? `0 0 14px ${CATEGORY_COLOR[cat]}` : undefined,
                      transform: isActive ? "scale(1.5)" : undefined,
                    }}
                  />
                  <span
                    className={`whitespace-nowrap font-mono text-[11px] uppercase tracking-widest2 transition-opacity ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                    }`}
                    style={{ color: isActive ? CATEGORY_COLOR[cat] : palette.ink[100] }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Top-centre search + list-view triggers. The global Nav header
          (layout.tsx) sits at z-50 with height 56 px — so HUD top-4 was
          hidden behind it (user feedback: "wo ist eigentlich der Link zur
          Listenansicht hin?"). top-[72px] tucks the cluster just *below*
          the header where it reads as part of the chrome but stays
          obviously a control, and z-[55] sits cleanly above the nav's
          glass background. */}
          <div className="hud-fixed fixed left-1/2 top-[72px] z-[55] flex -translate-x-1/2 items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="glass inline-flex items-center gap-3 rounded-full border border-signal-violet/40 bg-signal-violet/10 px-4 py-2 text-sm text-ink-100 shadow-lg shadow-signal-violet/10 transition-colors hover:border-signal-violet hover:bg-signal-violet/20 focus-visible:border-signal-violet focus-visible:bg-signal-violet/20"
              aria-label={cosmos.searchAria}
            >
              <span aria-hidden="true" className="text-base leading-none">
                ⌕
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest2">
                {cosmos.searchAria}
              </span>
              <span
                aria-hidden="true"
                className="hidden rounded border border-signal-violet/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest2 text-signal-violet md:inline-block"
              >
                /
              </span>
            </button>
            <button
              onClick={() => setListOpen(true)}
              className="glass inline-flex items-center gap-2 rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-4 py-2 text-sm text-ink-100 shadow-lg shadow-signal-cyan/10 transition-colors hover:border-signal-cyan hover:bg-signal-cyan/20 focus-visible:border-signal-cyan focus-visible:bg-signal-cyan/20"
              aria-label={a.landing.viewList ?? "List view"}
            >
              <span aria-hidden="true" className="text-base leading-none">
                ☰
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest2">
                {a.landing.viewList ?? "List"}
              </span>
            </button>
          </div>

          {/* MOBILE — horizontal bottom strip. Replaces the desktop right-edge
          compass on small screens (touch targets up, eyes-on-thumb position).
          Each chip is a category jump; the active one highlights. The bar
          floats with a glass background so the constellation stays visible
          behind it. */}
          <nav
            aria-label={cosmos.jumpLabel}
            className="hud-fixed glass hairline pointer-events-auto fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border px-2 py-2 md:hidden"
          >
            {SCENE_ORDER.map((cat, i) => {
              const isActive = activeCategory === cat;
              const categoryKey = `category${cat[0].toUpperCase()}${cat.slice(1)}` as
                | "categoryLogic"
                | "categoryComputation"
                | "categoryChaos"
                | "categoryGeometry"
                | "categoryAnalysis"
                | "categoryParadox";
              const name = (a.landing as unknown as Record<string, string>)[categoryKey] ?? cat;
              return (
                <button
                  key={cat}
                  onClick={() => smoothScrollToId(`scene-${cat}`)}
                  aria-label={`${i + 1}. ${name}`}
                  aria-current={isActive ? "true" : undefined}
                  className="flex h-10 min-w-[40px] items-center justify-center rounded-full px-3 transition-colors"
                  style={{
                    background: isActive ? `${CATEGORY_COLOR[cat]}20` : "transparent",
                    boxShadow: isActive ? `inset 0 0 0 1px ${CATEGORY_COLOR[cat]}` : undefined,
                  }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest2"
                    style={{ color: isActive ? CATEGORY_COLOR[cat] : "#cdd2e0" }}
                  >
                    {name.slice(0, 4)}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right-edge progress bar */}
          <div
            className="hud-fixed pointer-events-none fixed bottom-0 right-0 top-0 z-30 hidden w-px md:block"
            aria-hidden="true"
          >
            <div
              className="absolute right-0 top-0 w-px bg-signal-violet/60"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
        </>
      )}

      <TopicListOverlay open={listOpen} onClose={() => setListOpen(false)} />

      {/* Command palette overlay — z-[70] sits above the global Nav header
          (z-50) and the cosmos HUD buttons (z-[55]) so the modal owns the
          screen while it's open. */}
      {paletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cosmos.searchAria}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink-950/80 px-4 pt-24 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePalette();
          }}
        >
          <div className="glass hairline w-full max-w-xl overflow-hidden rounded-2xl border">
            <div className="border-b border-ink-700/40 p-4">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={cosmos.searchPlaceholder}
                aria-label={cosmos.searchAria}
                className="w-full bg-transparent font-mono text-sm text-ink-100 placeholder:text-ink-400 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                {cosmos.searchHint}
              </div>
            </div>
            <ul className="scrollbar-thin max-h-96 overflow-y-auto">
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-ink-400">{cosmos.searchEmpty}</li>
              )}
              {results.map((t) => {
                const meta = a.topics[t.id];
                return (
                  <li key={t.id}>
                    <Link
                      href={t.href}
                      onClick={closePalette}
                      className="flex items-center justify-between gap-3 border-b border-ink-700/30 px-4 py-3 last:border-0 hover:bg-ink-900/40"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="text-ink-100">{meta.title}</span>
                        <span className="text-xs text-ink-300">{meta.tagline}</span>
                      </span>
                      <span
                        className="font-mono text-[9px] uppercase tracking-widest2"
                        style={{ color: CATEGORY_COLOR[t.category] }}
                      >
                        {t.category}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
