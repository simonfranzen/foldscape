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
        className="flex items-center gap-1.5 rounded-md border hairline px-2.5 py-1.5 font-mono text-[10px] tracking-widest2 uppercase text-ink-200 hover:text-ink-100 hover:border-signal-violet/50 transition-colors"
      >
        <span className="text-signal-violet">{LOCALE_LABELS[locale].flag}</span>
        <svg width="8" height="6" viewBox="0 0 8 6" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 glass border hairline rounded-md py-1 w-48">
          {LOCALES.map((l: Locale) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                l === locale ? "text-signal-violet" : "text-ink-200 hover:text-ink-100 hover:bg-ink-700/40"
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest2 uppercase">
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
