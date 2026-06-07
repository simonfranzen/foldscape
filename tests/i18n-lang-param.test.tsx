// Tests for the URL-driven ?lang=<locale> mechanism. We mock next/navigation
// per-test so we can swap the searchParams that the provider observes, and
// we read the active locale out of the provider via a small probe child.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";

const replaceMock = vi.fn();
let currentSearch = new URLSearchParams();
let currentPath = "/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => currentPath,
  useSearchParams: () => currentSearch,
}));

import { I18nProvider, useI18n } from "@/lib/i18n/context";
import { parseLangParam } from "@/lib/i18n/types";

function Probe({ onRender }: { onRender: (locale: string) => void }) {
  const { locale } = useI18n();
  onRender(locale);
  return <span data-testid="locale">{locale}</span>;
}

beforeEach(() => {
  replaceMock.mockReset();
  currentSearch = new URLSearchParams();
  currentPath = "/";
  try {
    window.localStorage?.removeItem("foldscape.locale");
  } catch {
    /* noop */
  }
});

afterEach(() => {
  cleanup();
});

describe("parseLangParam", () => {
  it("returns the short locale for a valid short value", () => {
    expect(parseLangParam("de")).toBe("de");
  });

  it("strips the region tag from IETF forms like de-DE", () => {
    expect(parseLangParam("de-DE")).toBe("de");
    expect(parseLangParam("pt_BR")).toBe("pt");
  });

  it("returns null for unsupported or empty values", () => {
    expect(parseLangParam("xx")).toBeNull();
    expect(parseLangParam("")).toBeNull();
    expect(parseLangParam(null)).toBeNull();
    expect(parseLangParam(undefined)).toBeNull();
  });
});

describe("I18nProvider ?lang= handling", () => {
  it("initialises to ?lang=de when the URL provides it", async () => {
    currentSearch = new URLSearchParams("lang=de");
    const seen: string[] = [];
    await act(async () => {
      render(
        <I18nProvider>
          <Probe onRender={(l) => seen.push(l)} />
        </I18nProvider>,
      );
    });
    expect(seen[seen.length - 1]).toBe("de");
  });

  it("resolves ?lang=de-DE down to the short de locale", async () => {
    currentSearch = new URLSearchParams("lang=de-DE");
    const seen: string[] = [];
    await act(async () => {
      render(
        <I18nProvider>
          <Probe onRender={(l) => seen.push(l)} />
        </I18nProvider>,
      );
    });
    expect(seen[seen.length - 1]).toBe("de");
  });

  it("falls back to the default when ?lang=xx is invalid", async () => {
    currentSearch = new URLSearchParams("lang=xx");
    const seen: string[] = [];
    await act(async () => {
      render(
        <I18nProvider>
          <Probe onRender={(l) => seen.push(l)} />
        </I18nProvider>,
      );
    });
    // Invalid value is ignored: detectLocale runs and (with no localStorage
    // and a jsdom navigator.language of "en-US") yields the default "en".
    expect(seen[seen.length - 1]).toBe("en");
  });
});
