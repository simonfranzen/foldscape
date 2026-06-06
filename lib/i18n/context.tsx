"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, type Locale, detectLocale } from "./types";
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

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("eml.locale", l);
    } catch {
      // storage may be unavailable; ignore
    }
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
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
