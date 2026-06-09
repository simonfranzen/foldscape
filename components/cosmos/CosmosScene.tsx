"use client";

// Top-level scroll-driven cosmos. Mounts the fixed backdrops (StarField +
// NebulaLayer), then five vertically-stacked sections:
//   1. Hero (distant cosmos, title)
//   2. Approach (intro line, scroll indicator)
//   3..8. Six per-category ConstellationScenes (sticky-pinned)
//   9. Atlas overview (footer-CTA-like overview with search)
//
// The CosmosHUD floats over everything as a persistent nav layer.
//
// A small piece of choreography is kept here: when a scene reports its
// scroll progress, we update `activeCategory` (whichever scene has the
// highest non-zero progress) so the HUD compass and the global sky-tint
// CSS variable both line up to that category.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TOPICS, type TopicCategory } from "@/lib/topics";
import { Reveal } from "@/components/Reveal";
import { StarField } from "@/components/cosmos/StarField";
import { NebulaLayer } from "@/components/cosmos/NebulaLayer";
import { FloatingFormulas } from "@/components/cosmos/FloatingFormulas";
import { ConstellationScene } from "@/components/cosmos/ConstellationScene";
import { CosmosHUD } from "@/components/cosmos/CosmosHUD";
import { ScrollHint } from "@/components/cosmos/ScrollHint";
import { CATEGORY_RGB, SCENE_ORDER } from "@/lib/cosmos/layout";
import { SCENES } from "@/lib/cosmos/scenes";
import { COSMOS } from "@/lib/i18n/cosmos";

export function CosmosScene() {
  const { a, locale } = useI18n();
  const cosmos = COSMOS[locale];

  // Per-category scroll progress (0..1) reported by each ConstellationScene.
  // The orchestrator picks the strongest as the active category — which in
  // turn drives the sky-tint CSS variable and the HUD compass highlight.
  const progressRef = useRef<Record<TopicCategory, number>>({
    paradox: 0,
    logic: 0,
    computation: 0,
    chaos: 0,
    geometry: 0,
    analysis: 0,
  });
  const [active, setActive] = useState<TopicCategory | null>(null);
  const [tintIntensity, setTintIntensity] = useState(0);

  // Restore atlas scroll position when returning from a topic page.
  // TopicStar saves window.scrollY into sessionStorage before navigating;
  // here we read it back on every mount AND on bfcache restoration
  // (pageshow with persisted=true fires when the browser revives the
  // page from its back-forward cache, in which case the React component
  // does NOT remount and useEffect wouldn't run again).
  //
  // The scroll is instant — smooth would feel like the page is moving
  // *away* from the user instead of *picking up where they left off*.
  // We also disable native scroll restoration here so that Next.js /
  // the browser don't snap us back to 0 a frame after our restore.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Tell the browser we'll handle scroll restoration ourselves. Without
    // this, native restoration runs after our rAF and fights with it.
    const prev = window.history.scrollRestoration;
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      /* not supported, skip */
    }

    const tryRestore = () => {
      let raw: string | null = null;
      try {
        raw = sessionStorage.getItem("foldscape.atlas.scrollY");
      } catch {
        return;
      }
      if (!raw) return;
      const y = Number(raw);
      if (!Number.isFinite(y) || y <= 0) return;
      try {
        sessionStorage.removeItem("foldscape.atlas.scrollY");
      } catch {
        /* noop */
      }
      // Triple-step: scroll once synchronously, once on the next rAF,
      // once after a tick — and dispatch a synthetic scroll event after
      // each so every useScrollProgress hook recomputes against the new
      // position. The reason for the redundancy: late-firing native
      // restoration can otherwise snap us back to 0 after our scroll,
      // and IntersectionObservers don't always fire on instant scrolls.
      const goto = () => {
        window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
        window.dispatchEvent(new Event("scroll"));
      };
      goto();
      requestAnimationFrame(() => {
        goto();
        window.setTimeout(goto, 50);
      });
    };

    tryRestore();

    const onPageShow = (e: PageTransitionEvent) => {
      // bfcache restore — fires without a fresh mount. Re-run the same
      // logic so the user lands back where they were.
      if (e.persisted) tryRestore();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      try {
        window.history.scrollRestoration = prev;
      } catch {
        /* noop */
      }
    };
  }, []);

  const handleProgress = useCallback((category: TopicCategory, progress: number) => {
    progressRef.current[category] = progress;
    // Determine the active category as the one with progress nearest its
    // visual centre (≈0.5). Below 0.05 or above 0.95 counts as "leaving".
    let bestCat: TopicCategory | null = null;
    let bestScore = 0;
    for (const cat of SCENE_ORDER) {
      const p = progressRef.current[cat];
      // Score peaks at p=0.5, drops to zero at p=0 and p=1.
      const score = Math.max(0, 1 - Math.abs(p - 0.5) * 2);
      if (score > bestScore) {
        bestScore = score;
        bestCat = cat;
      }
    }
    setActive((prev) => (prev === bestCat ? prev : bestCat));
    setTintIntensity(bestScore);
  }, []);

  const tintStyle = useMemo(() => {
    if (!active) return undefined;
    const rgb = CATEGORY_RGB[active];
    // A whisper, not a wash. v1 ran the tint to 18% and the whole page read
    // as a saturated category colour — "Christmas" per the user. 3.5% is
    // the threshold where the eye can still tell paradox from chaos but
    // never thinks of the sky as anything other than black.
    const alpha = (tintIntensity * 0.035).toFixed(3);
    return {
      "--sky-tint": `rgba(${rgb} / ${alpha})`,
    } as React.CSSProperties;
  }, [active, tintIntensity]);

  return (
    <div className="cosmos-root relative isolate" style={tintStyle}>
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-signal-violet focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest2 focus:text-ink-950"
      >
        Skip to atlas overview
      </a>

      {/* Fixed backdrops */}
      <div className="cosmos-sky pointer-events-none fixed inset-0 -z-10 bg-ink-950" />
      <NebulaLayer />
      <StarField />
      <FloatingFormulas />
      {/* Sky-tint overlay — driven by the active scene's CSS custom prop. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-colors duration-500"
        style={{ background: "var(--sky-tint, transparent)" }}
      />

      {/* HUD — sits above everything */}
      <CosmosHUD activeCategory={active} />

      <main className="relative z-10">
        {/* 1. Hero */}
        <section className="relative flex min-h-[100vh] flex-col items-center justify-center px-6 text-center">
          <Reveal>
            <div className="tag-pill">{a.landing.pretitle}</div>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="math-italic mt-6 text-5xl leading-[0.95] tracking-tight md:text-8xl">
              {a.landing.title1}
              <span className="mx-2 text-ink-300 md:mx-4">—</span>
              <span className="shimmer-text">{a.landing.title2}</span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="math-italic mx-auto mt-6 max-w-2xl text-lg leading-snug text-ink-200 md:text-2xl">
              {a.landing.subtitle}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ink-100 md:text-lg">
              {a.landing.hook}
            </p>
          </Reveal>
          {/* Primary CTA — without this visitors landed on the hero and
              didn't know what to do (user feedback: "man ist schon lost
              bevor man angefangen hat"). Jumps past the prose straight
              to the first constellation so the visitor's first scroll
              is the cosmos itself. */}
          <Reveal delay={540}>
            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`scene-${SCENES[0].category}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-3 rounded-full border-2 border-signal-violet bg-signal-violet/10 px-7 py-3 font-mono text-xs uppercase tracking-widest2 text-signal-violet transition-all hover:bg-signal-violet/25 hover:text-ink-100 focus-visible:bg-signal-violet/25 focus-visible:text-ink-100"
              >
                <span>{cosmos.exploreAtlas}</span>
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("whom-why");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-xs text-ink-300 underline-offset-4 hover:underline focus-visible:underline"
              >
                {cosmos.scrollHint}
              </button>
            </div>
          </Reveal>
        </section>
        <ScrollHint targetId="whom-why" label={cosmos.scrollHint} />

        {/* 2. Whom + Why — the two glass cards from v3 that explain what the
            atlas is for. Kept because the user noted these words "mattered
            at the start". They sit between the hero and the approach line
            so the visitor's first scroll is text, not constellation. */}
        <section id="whom-why" className="relative z-10 px-6 pb-12 pt-8">
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

        {/* 3. Long-form intro paragraphs — also from v3. They prime the
            visitor for the cosmos below; without them the leap from the
            hero straight into a six-cluster sky felt abrupt. */}
        <section id="intro" className="relative z-10 px-6 pb-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center leading-relaxed text-ink-200">
            <Reveal>
              <p>{a.landing.intro1}</p>
            </Reveal>
            <Reveal delay={120}>
              <p>{a.landing.intro2}</p>
            </Reveal>
          </div>
        </section>
        <ScrollHint targetId="approach" label={cosmos.scrollHint} />

        {/* 4. Approach — the one-line invitation just before the first
            constellation scene. */}
        <section
          id="approach"
          className="relative flex min-h-[40vh] items-center justify-center px-6 text-center"
        >
          <Reveal>
            <p className="math-italic max-w-3xl text-2xl text-ink-100 md:text-4xl">
              {cosmos.approach}
            </p>
          </Reveal>
        </section>
        <ScrollHint targetId={`scene-${SCENES[0].category}`} label={cosmos.scrollHint} />

        {/* 3..8 — six constellations */}
        {SCENES.map((s) => (
          <ConstellationScene
            key={s.category}
            category={s.category}
            index={s.index}
            onProgress={handleProgress}
          />
        ))}

        {/* 9. Atlas overview — title + the full flat topic index (the
            "every star, in one place" view). v4 had a row of six headline
            chips above this table, which the user found duplicated:
            "erstmal so ein paar links zu einträgen und darunter dann
            nochmal die große tabelle". The chips are gone now; the
            heading rolls straight into the complete list. */}
        <section
          id="overview"
          className="relative flex flex-col items-center gap-6 px-6 pb-24 pt-16 text-center"
        >
          <Reveal>
            <h2 className="math-italic text-4xl text-ink-100 md:text-6xl">
              {cosmos.overviewTitle}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-2xl text-lg text-ink-200">{cosmos.overviewSub}</p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mx-auto w-full max-w-5xl pt-4">
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {TOPICS.map((t) => {
                  const meta = a.topics[t.id];
                  return (
                    <li key={t.id}>
                      <Link
                        href={t.href}
                        className="hairline flex items-center justify-between gap-3 rounded-md border bg-ink-950/40 px-3 py-2 text-left text-sm text-ink-200 transition-colors hover:border-signal-violet/40 hover:text-ink-100"
                      >
                        <span>{meta.title}</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest2 text-ink-400">
                          {t.category}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-mono text-[11px] uppercase tracking-widest2 text-signal-violet hover:text-ink-100"
            >
              ↑ {cosmos.beginAgain}
            </a>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
