"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { LocaleSwitcher } from "./LocaleSwitcher";
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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b hairline">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-14 gap-4">
        <Link href="/" className="flex items-baseline gap-3 group min-w-0 shrink-0">
          <span className="font-mono text-[11px] tracking-widest2 text-ink-300 uppercase">
            {a.nav.atlas}
          </span>
          <span className="math-italic text-xl text-ink-100 leading-none truncate group-hover:text-signal-violet transition-colors">
            Foldscape
          </span>
        </Link>

        {sections.length > 0 ? (
          <nav className="hidden md:flex items-center gap-1">
            {sections.map((sec, i) => {
              const active = pathname === sec.href;
              const label = s.sectionLabels[sec.key] ?? sec.key;
              return (
                <Link
                  key={sec.href}
                  href={sec.href}
                  className={`relative px-3 py-1.5 rounded-md text-sm font-mono uppercase tracking-widest transition-colors ${
                    active ? "text-signal-violet" : "text-ink-200 hover:text-ink-100"
                  }`}
                >
                  <span className="opacity-50 mr-2 text-[10px]">{romanize(i + 1)}</span>
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
            className="hidden md:block font-mono text-[11px] tracking-widest2 uppercase text-ink-300 hover:text-signal-violet transition-colors"
          >
            ← {a.nav.atlas}
          </Link>
        ) : null}

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}

function romanize(n: number): string {
  return ["I", "II", "III", "IV", "V"][n - 1] ?? String(n);
}
