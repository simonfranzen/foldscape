// The locale is part of the path (/de/lorenz). These tests pin the path
// helpers, the provider's "URL decides, never the browser" contract, and the
// metadata that tells search engines which language variants exist.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";

const pushMock = vi.fn();
let currentPath = "/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => currentPath,
}));

import { I18nProvider, useI18n } from "@/lib/i18n/context";
import { localePath, splitLocale, isLocale } from "@/lib/i18n/paths";
import { LOCALES } from "@/lib/i18n/types";
import { languageAlternates, topicMetadata, topicSubpageMetadata } from "@/lib/og/metadata";
import { LORENZ_GUIDE } from "@/lib/explorer-guides/lorenz";
import { EXPLORER_GUIDES } from "@/lib/explorer-guides";
import type { ExplorerGuide } from "@/lib/explorer-guides/types";
import sitemap from "@/app/sitemap";

let api: ReturnType<typeof useI18n> | null = null;
function Probe() {
  api = useI18n();
  return <span>{api.locale}</span>;
}

beforeEach(() => {
  pushMock.mockReset();
  currentPath = "/";
  window.history.replaceState({}, "", "/");
});
afterEach(cleanup);

describe("locale paths", () => {
  it("leaves the default locale without a prefix", () => {
    expect(localePath("en", "/lorenz")).toBe("/lorenz");
    expect(localePath("en", "/")).toBe("/");
  });

  it("prefixes every other locale", () => {
    expect(localePath("de", "/lorenz/explorer")).toBe("/de/lorenz/explorer");
    expect(localePath("de", "/")).toBe("/de");
  });

  it("splits a public pathname back into locale and path", () => {
    expect(splitLocale("/de/lorenz")).toEqual({ locale: "de", path: "/lorenz" });
    expect(splitLocale("/de")).toEqual({ locale: "de", path: "/" });
    expect(splitLocale("/lorenz")).toEqual({ locale: "en", path: "/lorenz" });
    // A topic whose id merely starts like a locale must not be split.
    expect(splitLocale("/dla/explorer")).toEqual({ locale: "en", path: "/dla/explorer" });
    expect(splitLocale(null)).toEqual({ locale: "en", path: "/" });
    // The internal English route must resolve like the public bare path.
    expect(splitLocale("/en/lorenz")).toEqual({ locale: "en", path: "/lorenz" });
    expect(splitLocale("/en")).toEqual({ locale: "en", path: "/" });
  });

  it("round-trips for every locale", () => {
    for (const l of LOCALES) {
      expect(splitLocale(localePath(l, "/banach"))).toEqual({ locale: l, path: "/banach" });
    }
    expect(isLocale("de")).toBe(true);
    expect(isLocale("xx")).toBe(false);
  });
});

describe("I18nProvider", () => {
  it("uses the locale it is given and ignores browser preferences", () => {
    try {
      window.localStorage?.setItem("foldscape.locale", "fr");
    } catch {
      /* storage may be unavailable */
    }
    const { container } = render(
      <I18nProvider locale="de">
        <Probe />
      </I18nProvider>,
    );
    expect(container.textContent).toBe("de");
    expect(api?.href("/lorenz")).toBe("/de/lorenz");
  });

  it("defaults to English", () => {
    const { container } = render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    expect(container.textContent).toBe("en");
    expect(api?.href("/lorenz")).toBe("/lorenz");
  });

  it("switches language by navigating to the same page under the new prefix", () => {
    currentPath = "/de/lorenz/explorer";
    window.history.replaceState({}, "", "/de/lorenz/explorer?x=1#how-it-works");
    render(
      <I18nProvider locale="de">
        <Probe />
      </I18nProvider>,
    );
    act(() => api?.setLocale("fr"));
    expect(pushMock).toHaveBeenCalledWith("/fr/lorenz/explorer?x=1#how-it-works", {
      scroll: false,
    });
    act(() => api?.setLocale("en"));
    expect(pushMock).toHaveBeenLastCalledWith("/lorenz/explorer?x=1#how-it-works", {
      scroll: false,
    });
  });
});

describe("locale metadata", () => {
  it("lists every locale plus x-default as alternates", () => {
    const alt = languageAlternates("/lorenz");
    expect(alt.de).toBe("/de/lorenz");
    expect(alt.en).toBe("/lorenz");
    expect(alt["x-default"]).toBe("/lorenz");
    expect(Object.keys(alt)).toHaveLength(LOCALES.length + 1);
  });

  it("gives each translated story page its own canonical and translated title", () => {
    const de = topicMetadata("lorenz", "de");
    expect(de.alternates?.canonical).toBe("/de/lorenz");
    expect(de.robots).toBeUndefined();
    expect(String((de.title as { absolute: string }).absolute)).toContain("Lorenz");
    expect((de.description ?? "").length).toBeLessThanOrEqual(160);
    expect(de.description).not.toBe(topicMetadata("lorenz", "en").description);
  });

  it("indexes a sub-room in every locale its guide covers", () => {
    for (const l of LOCALES) {
      const meta = topicSubpageMetadata("lorenz", "explorer", "Explorer", LORENZ_GUIDE, l);
      expect(meta.alternates?.canonical).toBe(localePath(l, "/lorenz/explorer"));
      expect(meta.description).toBe(LORENZ_GUIDE[l]?.metaDescription);
      expect(meta.robots).toBeUndefined();
    }
  });

  it("keeps a sub-room out of the index where its guide is not translated", () => {
    const partial: ExplorerGuide = { en: LORENZ_GUIDE.en, de: LORENZ_GUIDE.de };
    const fr = topicSubpageMetadata("lorenz", "explorer", "Explorer", partial, "fr");
    expect(fr.robots).toEqual({ index: false, follow: true });
    expect(fr.alternates?.canonical).toBe("/fr/lorenz/explorer");
    expect(Object.keys(fr.alternates?.languages ?? {}).sort()).toEqual(["de", "en", "x-default"]);
  });

  it("every guide is complete in all locales", () => {
    for (const [key, guide] of Object.entries(EXPLORER_GUIDES)) {
      for (const l of LOCALES) {
        const g = guide[l];
        expect(g, `${key} is missing ${l}`).toBeDefined();
        if (!g) continue;
        expect(g.sections.length, `${key} ${l} sections`).toBe(guide.en.sections.length);
        expect(g.experiments.length, `${key} ${l} experiments`).toBe(guide.en.experiments.length);
        g.sections.forEach((sec, i) =>
          expect(sec.paragraphs.length, `${key} ${l} section ${i}`).toBe(
            guide.en.sections[i].paragraphs.length,
          ),
        );
        expect(g.metaDescription.length, `${key} ${l} description`).toBeGreaterThanOrEqual(140);
        expect(g.metaDescription.length, `${key} ${l} description`).toBeLessThanOrEqual(160);
        expect(JSON.stringify(g), `${key} ${l} has a dash`).not.toMatch(/[\u2013\u2014]/);
      }
    }
  });

  it("sitemap has one entry per indexable language variant", () => {
    const urls = sitemap().map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain("https://foldscape.zauberware.com/de/lorenz");
    expect(urls).toContain("https://foldscape.zauberware.com/de/lorenz/explorer");
    expect(urls).toContain("https://foldscape.zauberware.com/fr/lorenz/explorer");
    expect(urls.some((u) => u.includes("?lang="))).toBe(false);
  });
});
