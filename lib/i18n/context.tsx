"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  detectLocale,
  parseLangParam,
} from "./types";
import { MESSAGES, type Dict } from "./messages";
import { BODIES, type BodyDict } from "./bodies";
import { ATLAS, type AtlasDict } from "./atlas";
import { STORIES, type StoriesDict } from "./stories";
import { UI, type UiDict } from "./ui";

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
  b: BodyDict;
  a: AtlasDict;
  s: StoriesDict;
  u: UiDict;
}

const Ctx = createContext<I18nCtx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: MESSAGES[DEFAULT_LOCALE],
  b: BODIES[DEFAULT_LOCALE],
  a: ATLAS[DEFAULT_LOCALE],
  s: STORIES[DEFAULT_LOCALE],
  u: UI[DEFAULT_LOCALE],
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The `?lang=` query parameter — when present and valid — overrides both
  // localStorage and browser-language detection. We track the last value we
  // observed so that the effect below stays idempotent (URL write-back from
  // setLocale would otherwise re-trigger this on the next render).
  const lastSeenLangParam = useRef<string | null>(null);
  // Guard against the initial detection effect clobbering a URL-supplied
  // locale that the URL effect already applied.
  const initialised = useRef(false);

  // 1. Initial detection from localStorage / navigator. Only runs once and
  //    only if the URL didn't already provide a locale on first paint.
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const fromUrl = parseLangParam(searchParams?.get("lang"));
    if (fromUrl) {
      // The URL effect below will pick this up; nothing to do here.
      return;
    }
    setLocaleState(detectLocale());
    // We intentionally only want this on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. React to ?lang= changes (initial load with the param, or any future
  //    in-place navigation that swaps it). Idempotent via lastSeenLangParam.
  useEffect(() => {
    const raw = searchParams?.get("lang") ?? null;
    if (raw === lastSeenLangParam.current) return;
    lastSeenLangParam.current = raw;
    const parsed = parseLangParam(raw);
    if (parsed && parsed !== locale) {
      setLocaleState(parsed);
      try {
        localStorage.setItem("eml.locale", parsed);
      } catch {
        // storage may be unavailable; ignore
      }
      if (typeof document !== "undefined") {
        document.documentElement.lang = parsed;
      }
    }
  }, [searchParams, locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      try {
        localStorage.setItem("eml.locale", l);
      } catch {
        // storage may be unavailable; ignore
      }
      if (typeof document !== "undefined") {
        document.documentElement.lang = l;
      }
      // Sync the URL so links stay shareable. Use router.replace with
      // scroll:false so the route doesn't jump. We mark this value as
      // "already seen" so the URL effect above doesn't re-fire.
      lastSeenLangParam.current = l;
      try {
        const next = new URLSearchParams(searchParams?.toString() ?? "");
        next.set("lang", l);
        const qs = next.toString();
        const url = `${pathname || "/"}${qs ? `?${qs}` : ""}`;
        router.replace(url, { scroll: false });
      } catch {
        // router may not be available in some test environments; ignore
      }
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <Ctx.Provider
      value={{
        locale,
        setLocale,
        t: MESSAGES[locale],
        b: BODIES[locale],
        a: ATLAS[locale],
        s: STORIES[locale],
        u: UI[locale],
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  return useContext(Ctx);
}

export { LOCALES };
