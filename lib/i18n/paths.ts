import { DEFAULT_LOCALE, LOCALES, type Locale } from "./types";

// The locale is the first path segment (/de/lorenz); the default locale has
// no prefix (/lorenz) so the original English URLs stay stable. A rewrite in
// next.config.mjs maps the bare paths onto the internal /en/... routes.

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Public URL path for an internal path ("/lorenz") in the given locale. */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Split a public pathname into its locale and the locale-free path. */
export function splitLocale(pathname: string | null | undefined): {
  locale: Locale;
  path: string;
} {
  const p = pathname || "/";
  const seg = p.split("/")[1];
  if (isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const rest = p.slice(seg.length + 1);
    return { locale: seg, path: rest === "" ? "/" : rest };
  }
  return { locale: DEFAULT_LOCALE, path: p };
}

// Route params arrive as a promise in Next 15. Anything that is not a known
// locale falls back to the default instead of throwing, because metadata
// functions also run for paths that end in notFound().
export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
