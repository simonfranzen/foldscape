"use client";

// Scroll-progress + parallax hooks. Pure rAF + IntersectionObserver — no
// dependencies. Both honour `prefers-reduced-motion: reduce` (returning a
// frozen progress of 0 and a zero translate) so callers don't have to
// branch themselves.

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// Returns the scroll progress (0..1) of a target element through the viewport:
//   0 — the element's top edge is at the viewport bottom (just entering)
//   1 — the element's bottom edge is at the viewport top (just leaving)
// Clamped, so callers can drive parallax without bounds-checking.
//
// v2: always computes on every tick. v1 gated tick on `visibleRef.current`
// (set by an IntersectionObserver) for perf — but that broke
// back-navigation: when the user restored scroll deep into the cosmos,
// the IO callback hadn't fired yet, visibleRef stayed false, tick
// returned early, and the topic stars never appeared (user feedback:
// "wenn ich browser back mache, dann sehe ich keine einträge mehr").
// The cost of always computing is one getBoundingClientRect per RAF;
// negligible compared to the bug.
export function useScrollProgress(targetRef: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      // Static rendering for reduced-motion: pretend the scene is at its
      // peak so all stars are fully revealed.
      setProgress(0.5);
      return;
    }

    const tick = () => {
      rafRef.current = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const span = r.height + vh;
      const raw = (vh - r.top) / span;
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    // Compute synchronously at mount so the first paint has correct
    // progress (especially when the page is restored mid-cosmos by the
    // scroll-restore effect in CosmosScene).
    tick();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Re-sync on bfcache restore — pageshow with persisted=true fires
    // without a fresh React mount.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) schedule();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", onPageShow);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetRef]);

  return progress;
}

// Global scroll progress against the document — useful for the persistent
// HUD progress bar and any cross-scene effects.
export function useDocumentScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(0);
      return;
    }
    const tick = () => {
      rafRef.current = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, window.scrollY / max));
      setProgress(p);
    };
    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
}

// Mouse parallax (desktop only). Returns the cursor offset from viewport
// centre as (-1..1, -1..1). On reduced-motion + touch devices, returns 0,0.
export function useMouseParallax(): { mx: number; my: number } {
  const [pos, setPos] = useState({ mx: 0, my: 0 });
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Coarse pointer (touch) — skip; the effect adds nothing on phones.
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPos({ mx: x, my: y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}
