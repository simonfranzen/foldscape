"use client";

import katex from "katex";
import { useEffect, useRef } from "react";

interface Props {
  expression: string;
  block?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  // Spoken form used as the accessible label — overrides the screen-reader
  // text. When omitted, falls back to a best-effort speakable transform of
  // the LaTeX source. KaTeX's own MathML output still ships alongside so
  // assistive tech that speaks MathML gets the structured form too.
  ariaLabel?: string;
}

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-4xl md:text-5xl",
  hero: "text-5xl md:text-6xl",
};

// Best-effort speakable form of a LaTeX expression. Covers the small set of
// macros our pages actually use; anything unknown falls through unchanged so
// the screen reader at least reads the literal characters instead of silence.
const SPEAK_TABLE: Array<[RegExp, string]> = [
  [/\\Leftrightarrow/g, " if and only if "],
  [/\\Rightarrow/g, " implies "],
  [/\\leftrightarrow/g, " if and only if "],
  [/\\rightarrow/g, " to "],
  [/\\neg/g, " not "],
  [/\\land/g, " and "],
  [/\\lor/g, " or "],
  [/\\forall/g, " for all "],
  [/\\exists/g, " there exists "],
  [/\\in/g, " in "],
  [/\\notin/g, " not in "],
  [/\\leq/g, " less or equal "],
  [/\\geq/g, " greater or equal "],
  [/\\neq/g, " not equal "],
  [/\\approx/g, " approximately "],
  [/\\cdot/g, " times "],
  [/\\times/g, " times "],
  [/\\sum/g, " sum "],
  [/\\int/g, " integral "],
  [/\\sqrt\{([^}]*)\}/g, " square root of $1 "],
  [/\\frac\{([^}]*)\}\{([^}]*)\}/g, " $1 over $2 "],
  [/\\text\{([^}]*)\}/g, "$1"],
  [/\\mathrm\{([^}]*)\}/g, "$1"],
  [/\\ulcorner/g, " quote "],
  [/\\urcorner/g, " unquote "],
  [/\\chi/g, " chi "],
  [/\\pi/g, " pi "],
  [/\\Sigma/g, " sigma "],
  [/\\sigma/g, " sigma "],
  [/\\alpha/g, " alpha "],
  [/\\beta/g, " beta "],
  [/\\theta/g, " theta "],
  [/\\phi/g, " phi "],
  [/\\omega/g, " omega "],
  [/\\,|\\;|\\:|\\!|\\ /g, " "],
  [/\\\\/g, " "],
  [/\^\{([^}]*)\}/g, " to the $1 "],
  [/\^(\w)/g, " to the $1 "],
  [/_\{([^}]*)\}/g, " sub $1 "],
  [/_(\w)/g, " sub $1 "],
  [/\{|\}/g, ""],
  [/\s+/g, " "],
];

export function speakLatex(src: string): string {
  let out = src;
  for (const [re, sub] of SPEAK_TABLE) out = out.replace(re, sub);
  return out.trim();
}

export function Formula({ expression, block, className = "", size = "md", ariaLabel }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(expression, ref.current, {
        displayMode: !!block,
        throwOnError: false,
        // htmlAndMathml = visible HTML + a hidden MathML twin. Screen readers
        // pick up the MathML; sighted users see the styled HTML. This is the
        // single biggest a11y win on a maths-heavy site.
        output: "htmlAndMathml",
        strict: "ignore",
      });
    } catch (err) {
      console.warn("KaTeX render failed:", err);
    }
  }, [expression, block]);

  const label = ariaLabel ?? speakLatex(expression);

  return (
    <span
      ref={ref}
      role="math"
      aria-label={label}
      className={`${SIZE_CLASS[size]} ${block ? "block text-center" : "inline"} ${className}`}
    />
  );
}
