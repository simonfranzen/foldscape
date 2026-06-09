// Render smoke tests. Goal is the lowest bar imaginable: the page mounts
// without throwing. We mock next/navigation hooks (jsdom has no router) and
// stub the canvas-heavy cosmos visuals (StarField, NebulaLayer) whose
// 2d context / matchMedia / IntersectionObserver dependencies jsdom can't
// fully satisfy. KaTeX is left intact — its DOM mutations don't crash in
// jsdom.

import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, cleanup } from "@testing-library/react";

// next/navigation: stub the small surface our pages actually use.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// StarField + NebulaLayer draw into a 2d canvas / lean on
// window.matchMedia for reduced-motion + IntersectionObserver for scroll
// progress; jsdom only partially satisfies these. Replace both with inert
// placeholders for the smoke test — we are testing that the cosmos page
// MOUNTS, not that the parallax animates.
vi.mock("@/components/cosmos/StarField", () => ({
  StarField: () => null,
}));
vi.mock("@/components/cosmos/NebulaLayer", () => ({
  NebulaLayer: () => null,
}));

// Reveal is an IntersectionObserver-driven fade — stub to children-only so
// the test doesn't depend on jsdom's IO behaviour.
vi.mock("@/components/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Polyfill matchMedia so any reduced-motion check doesn't blow up.
beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (q: string) => ({
        matches: false,
        media: q,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
  if (!(globalThis as { ResizeObserver?: unknown }).ResizeObserver) {
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  // The cosmos hooks (useScrollProgress) use IntersectionObserver to gate
  // their rAF loop. jsdom doesn't ship it, so the cosmos would throw at
  // mount without this polyfill.
  if (!(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver) {
    (globalThis as { IntersectionObserver: unknown }).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    };
  }
});

import { I18nProvider } from "@/lib/i18n/context";
import Landing from "@/app/page";
import BanachStory from "@/app/banach/page";
import { TopicConstellation } from "@/components/TopicConstellation";

function withProviders(node: React.ReactNode) {
  return <I18nProvider>{node}</I18nProvider>;
}

describe("render smoke", () => {
  it("landing page mounts without throwing", () => {
    const { container } = render(withProviders(<Landing />));
    expect(container.firstChild).not.toBeNull();
    cleanup();
  });

  it("banach story page mounts in EN", () => {
    // I18nProvider defaults to EN before the locale-detection effect kicks in
    // under jsdom; that's exactly the locale we want to render here.
    const { container } = render(withProviders(<BanachStory />));
    expect(container.textContent ?? "").not.toBe("");
    cleanup();
  });

  it("banach story page mounts after switching to DE", () => {
    // Drive the locale through localStorage — detectLocale reads it on
    // first effect. Falls back gracefully if jsdom hasn't surfaced
    // localStorage on the window in this configuration.
    try {
      window.localStorage?.setItem("foldscape.locale", "de");
    } catch {
      // ignore — we still want the smoke test to run
    }
    const { container } = render(withProviders(<BanachStory />));
    expect(container.textContent ?? "").not.toBe("");
    try {
      window.localStorage?.removeItem("foldscape.locale");
    } catch {
      /* noop */
    }
    cleanup();
  });

  it("TopicConstellation mounts with a non-trivial filter", () => {
    const { container } = render(
      withProviders(<TopicConstellation filter="chaos" setFilter={() => {}} />),
    );
    // The component renders an SVG sky on desktop and a card list on mobile.
    // Either way the root should produce *something*.
    expect(container.firstChild).not.toBeNull();
    cleanup();
  });
});
