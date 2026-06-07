export const LOCALES = ["en", "de", "es", "fr", "it", "pt", "sv", "no"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, { native: string; flag: string }> = {
  en: { native: "English", flag: "EN" },
  de: { native: "Deutsch", flag: "DE" },
  es: { native: "Español", flag: "ES" },
  fr: { native: "Français", flag: "FR" },
  it: { native: "Italiano", flag: "IT" },
  pt: { native: "Português", flag: "PT" },
  sv: { native: "Svenska", flag: "SV" },
  no: { native: "Norsk", flag: "NO" },
};

export const DEFAULT_LOCALE: Locale = "en";

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const stored =
    typeof localStorage !== "undefined"
      ? (localStorage.getItem("eml.locale") as Locale | null)
      : null;
  if (stored && (LOCALES as readonly string[]).includes(stored)) return stored;
  const nav = navigator.language.slice(0, 2).toLowerCase();
  if ((LOCALES as readonly string[]).includes(nav)) return nav as Locale;
  return DEFAULT_LOCALE;
}

// Normalise a raw value from `?lang=` to a supported Locale, or null.
// Accepts both short ("de") and IETF ("de-DE") forms; strips region tag,
// lowercases, and matches against LOCALES. Anything not in the list returns
// null so callers can fall back to their existing detection.
export function parseLangParam(raw: string | null | undefined): Locale | null {
  if (!raw) return null;
  const short = raw.trim().toLowerCase().split(/[-_]/)[0];
  if (!short) return null;
  if ((LOCALES as readonly string[]).includes(short)) return short as Locale;
  return null;
}
