"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./types";
import { localePath, splitLocale } from "./paths";
import { MESSAGES, type Dict } from "./messages";
import { ATLAS, type AtlasDict } from "./atlas";
import { STORIES, type StoriesDict } from "./stories";
import { UI, type UiDict } from "./ui";

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Public URL for an internal path in the active locale. */
  href: (path: string) => string;
  t: Dict;
  a: AtlasDict;
  s: StoriesDict;
  u: UiDict;
}

const Ctx = createContext<I18nCtx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  href: (path) => path,
  t: MESSAGES[DEFAULT_LOCALE],
  a: ATLAS[DEFAULT_LOCALE],
  s: STORIES[DEFAULT_LOCALE],
  u: UI[DEFAULT_LOCALE],
});

// The locale comes from the URL segment (/de/...) and is passed in by the
// root layout, so the server renders every page in its own language. The
// provider never guesses from the browser: a URL must always show the same
// language to a reader and to a crawler, otherwise search engines index the
// wrong text under it.
export function I18nProvider({
  locale = DEFAULT_LOCALE,
  children,
}: {
  locale?: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Switching language is a navigation to the same page under the other
  // prefix; the query string and hash travel along.
  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      const { path } = splitLocale(pathname);
      const suffix =
        typeof window !== "undefined" ? window.location.search + window.location.hash : "";
      router.push(`${localePath(l, path)}${suffix}`, { scroll: false });
    },
    [locale, pathname, router],
  );

  const href = useCallback((path: string) => localePath(locale, path), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      href,
      t: MESSAGES[locale],
      a: ATLAS[locale],
      s: STORIES[locale],
      u: UI[locale],
    }),
    [locale, setLocale, href],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Pathname without the locale prefix, for comparing against internal hrefs.
export function useBarePathname(): string {
  return splitLocale(usePathname()).path;
}

export function useI18n() {
  return useContext(Ctx);
}

export { LOCALES };
