"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export const GITHUB_URL = "https://github.com/zauberware/foldscape";
export const ZAUBERWARE_URL = "https://www.zauberware.com";
export const AUTHOR_URL = "https://www.zauberware.com";
export const SIMON_GITHUB_URL = "https://github.com/simonfranzen";

export function Footer() {
  const { t, a, u } = useI18n();
  return (
    <footer className="hairline glass relative z-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="h-5 w-5 select-none opacity-80"
              draggable={false}
            />
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300 md:whitespace-nowrap">
              Foldscape · An atlas of mathematical curiosities
            </div>
          </div>
          <div className="text-sm text-ink-200">
            {a.landing.authoredByPrefix}{" "}
            <a
              href={SIMON_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-violet transition-colors hover:text-ink-100"
            >
              {a.landing.authoredByName}
            </a>{" "}
            ·{" "}
            <a
              href={ZAUBERWARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-cyan transition-colors hover:text-ink-100"
            >
              {a.landing.authoredByOrg}
            </a>
          </div>
          <div className="font-mono text-[10px] text-ink-400">{t.footer.copyright}</div>
          <div className="font-mono text-[10px] text-ink-400">
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer license"
              className="transition-colors hover:text-signal-cyan"
            >
              {t.footer.license} ↗
            </a>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest2">
          <a
            href={ZAUBERWARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hairline rounded-full border px-3 py-2 text-ink-200 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
          >
            ↗ zauberware.com
          </a>
          <Link
            href="/about"
            className="hairline rounded-full border px-3 py-2 text-ink-200 transition-colors hover:border-signal-rose/50 hover:text-signal-rose"
          >
            {u.about ?? "About"}
          </Link>
          <Link
            href="/impressum"
            className="hairline rounded-full border px-3 py-2 text-ink-200 transition-colors hover:border-signal-violet/50 hover:text-signal-violet"
          >
            {t.footer.imprint}
          </Link>
        </div>
      </div>
    </footer>
  );
}
