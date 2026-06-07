"use client";

import { useEffect, useRef, useState } from "react";

// Tiny info chip. Hover or click reveals an explanation. Click-state persists
// so users can read longer copy without keeping the cursor still.
export function Info({
  children,
  className = "",
  side = "top",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!sticky) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setSticky(false);
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [sticky]);

  const placement =
    side === "bottom"
      ? "top-full mt-2 left-1/2 -translate-x-1/2"
      : side === "right"
        ? "left-full ml-2 top-1/2 -translate-y-1/2"
        : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  return (
    <span ref={ref} className={`relative inline-flex align-middle ${className}`}>
      <button
        type="button"
        aria-label="More info"
        onMouseEnter={() => !sticky && setOpen(true)}
        onMouseLeave={() => !sticky && setOpen(false)}
        onClick={() => {
          setSticky((v) => !v);
          setOpen((v) => !v || !sticky);
        }}
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border font-mono text-[9px] leading-none transition-colors ${
          sticky
            ? "border-signal-violet bg-signal-violet/10 text-signal-violet"
            : "border-ink-300/40 text-ink-300 hover:border-signal-violet/60 hover:text-signal-violet"
        }`}
      >
        i
      </button>
      {open && (
        <span
          className={`absolute ${placement} glass hairline pointer-events-none z-50 w-64 rounded-md border px-3 py-2 text-xs leading-relaxed text-ink-200 shadow-xl`}
          style={{ pointerEvents: sticky ? "auto" : "none" }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
