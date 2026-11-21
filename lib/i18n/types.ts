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
