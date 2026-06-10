"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { GITHUB_URL } from "./Footer";
import { TOPICS } from "@/lib/topics";

// The nav resolves the current topic from the URL prefix (e.g. /mandelbrot/...).
// If that topic has declared sub-sections, they render as a sub-tab strip and
// stay visible at the top — interactive views are never more than one click
// away.

export function Nav() {
  const pathname = usePathname();
  const { a, s } = useI18n();

  const topic = TOPICS.find((t) => pathname === t.href || pathname.startsWith(t.href + "/"));
  const sections = topic?.sections ?? [];

  return (
    <header className="glass hairline fixed left-0 right-0 top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center"
          aria-label="Foldscape — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Foldscape"
            width={156}
            height={32}
            className="h-8 w-auto select-none opacity-95 transition-opacity group-hover:opacity-100"
            draggable={false}
          />
        </Link>

        {sections.length > 0 ? (
          <nav className="hidden items-center gap-2 md:flex">
            {/* Back-to-atlas link sits *before* the section tabs on every
                topic page so the back path is always visible — the body
                of the story used to carry a "Back to atlas" button which
                made the hero feel cluttered (user feedback). */}
            <Link
              href="/"
              className="mr-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest2 text-ink-400 transition-colors hover:text-signal-violet"
            >
              <span aria-hidden="true">←</span>
              <span>{a.nav.atlas}</span>
            </Link>
            <span className="h-4 w-px bg-ink-700/50" aria-hidden="true" />
            {sections.map((sec, i) => {
              const active = pathname === sec.href;
              const label = s.sectionLabels[sec.key] ?? sec.key;
              return (
                <Link
                  key={sec.href}
                  href={sec.href}
                  className={`relative rounded-md px-3 py-1.5 font-mono text-sm uppercase tracking-widest transition-colors ${
                    active
                      ? "font-medium text-signal-violet"
                      : "text-ink-300 hover:text-ink-100"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="mr-2 text-[10px] opacity-50">{romanize(i + 1)}</span>
                  {label}
                  {active && (
                    <span className="absolute -bottom-px left-3 right-3 h-px bg-signal-violet/70" />
                  )}
                </Link>
              );
            })}
          </nav>
        ) : pathname !== "/" ? (
          <Link
            href="/"
            className="hidden font-mono text-[11px] uppercase tracking-widest2 text-ink-300 transition-colors hover:text-signal-violet md:block"
          >
            ← {a.nav.atlas}
          </Link>
        ) : null}

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="hairline inline-flex h-9 w-9 items-center justify-center rounded-md border text-ink-300 transition-colors hover:border-signal-violet/50 hover:text-ink-100"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}

function romanize(n: number): string {
  return ["I", "II", "III", "IV", "V"][n - 1] ?? String(n);
}
