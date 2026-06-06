"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export const GITHUB_URL = "https://github.com/zauberware/foldscape";
export const PAPER_URL = "https://arxiv.org/abs/2603.21852";
export const ZAUBERWARE_URL = "https://www.zauberware.com";
export const AUTHOR_URL = "https://www.zauberware.com";

export function Footer() {
  const { t, a } = useI18n();
  return (
    <footer className="relative z-20 border-t hairline glass">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-md">
          <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase">
            Foldscape · An atlas of mathematical curiosities
          </div>
          <div className="text-sm text-ink-200">
            {a.landing.authoredByPrefix}{" "}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-violet hover:text-ink-100 transition-colors"
            >
              {a.landing.authoredByName}
            </a>{" "}
            ·{" "}
            <a
              href={ZAUBERWARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-cyan hover:text-ink-100 transition-colors"
            >
              {a.landing.authoredByOrg}
            </a>
          </div>
          <div className="font-mono text-[10px] text-ink-400">{t.footer.copyright}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest2">
          <a
            href={ZAUBERWARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-full border hairline text-ink-200 hover:text-signal-amber hover:border-signal-amber/50 transition-colors"
          >
            ↗ zauberware.com
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-full border hairline text-ink-200 hover:text-signal-cyan hover:border-signal-cyan/50 transition-colors"
          >
            ↗ {t.footer.github}
          </a>
          <Link
            href="/impressum"
            className="px-3 py-2 rounded-full border hairline text-ink-200 hover:text-signal-violet hover:border-signal-violet/50 transition-colors"
          >
            {t.footer.imprint}
          </Link>
        </div>
      </div>
    </footer>
  );
}
