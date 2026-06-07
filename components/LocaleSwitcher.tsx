"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/types";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.nav.language}
        className="hairline inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 font-mono text-[10px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/50 hover:text-ink-100"
      >
        <span className="text-signal-violet">{LOCALE_LABELS[locale].flag}</span>
        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>
      {open && (
        <div className="glass hairline absolute right-0 top-full z-50 mt-2 w-48 rounded-md border py-1">
          {LOCALES.map((l: Locale) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors ${
                l === locale
                  ? "text-signal-violet"
                  : "text-ink-200 hover:bg-ink-700/40 hover:text-ink-100"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest2">
                {LOCALE_LABELS[l].flag}
              </span>
              <span className="text-xs">{LOCALE_LABELS[l].native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
