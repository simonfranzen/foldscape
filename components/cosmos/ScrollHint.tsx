"use client";

// Subtle scroll-down affordance at the bottom of each major section.
// Clickable: smooth-scrolls one viewport height down (or to a specific
// element if `targetId` is given). Keyboard-focusable. Honours
// reduced-motion (no bounce, instant jump). The animation is gentle so
// it whispers "there's more below" without shouting.

interface Props {
  targetId?: string;
  label?: string;
}

export function ScrollHint({ targetId, label }: Props) {
  const onClick = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
  };
  return (
    <div className="pointer-events-none flex w-full justify-center pb-6 pt-8">
      <button
        type="button"
        onClick={onClick}
        aria-label={label ?? "Scroll to next section"}
        className="cosmos-scroll-hint pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink-700/40 bg-ink-950/40 text-ink-300 transition-colors hover:border-signal-violet/60 hover:text-signal-violet focus-visible:border-signal-violet focus-visible:text-signal-violet"
      >
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
          <path
            d="M1 6l6 7 6-7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
