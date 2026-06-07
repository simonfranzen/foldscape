// Tiny SKI + Iota reducer. The AST is binary: every node is either a single
// symbol (S, K, I, ι) or an Application(f, x). Reduction walks the tree
// once per step, performing the leftmost-outermost redex it finds — exactly
// the strategy the textbooks use to demonstrate normal-order evaluation.

export type Term = { kind: "sym"; name: string } | { kind: "app"; f: Term; x: Term };

export const sym = (name: string): Term => ({ kind: "sym", name });
export const app = (f: Term, x: Term): Term => ({ kind: "app", f, x });

const _KNOWN_ATOMS = new Set(["S", "K", "I", "i", "ι", "I"]);

// Parser — accepts:
//   S, K, I, i, ι
//   parentheses for grouping
//   whitespace ignored
//   juxtaposition is left-associative application: S K K ≡ (S K) K
export function parse(src: string): Term {
  let i = 0;
  const skip = () => {
    while (i < src.length && /\s/.test(src[i])) i++;
  };
  const parseAtom = (): Term => {
    skip();
    if (i >= src.length) throw new Error("Unexpected end of input");
    const ch = src[i];
    if (ch === "(") {
      i++;
      const t = parseExpr();
      skip();
      if (src[i] !== ")") throw new Error("Expected ')'");
      i++;
      return t;
    }
    if (ch === "ι" || ch === "i") {
      i++;
      return sym("i");
    }
    if (ch === "S" || ch === "K" || ch === "I") {
      const name = ch;
      i++;
      return sym(name);
    }
    throw new Error(`Unexpected character '${ch}' at position ${i}`);
  };
  const parseExpr = (): Term => {
    let t = parseAtom();
    while (true) {
      skip();
      if (i >= src.length || src[i] === ")") break;
      const next = parseAtom();
      t = app(t, next);
    }
    return t;
  };
  const result = parseExpr();
  skip();
  if (i !== src.length) throw new Error(`Trailing input at position ${i}`);
  return result;
}

export function show(t: Term): string {
  if (t.kind === "sym") return t.name === "i" ? "ι" : t.name;
  // Add parens around right side if it is an application
  const left = show(t.f);
  const right = t.x.kind === "app" ? `(${show(t.x)})` : show(t.x);
  return `${left} ${right}`;
}

// Single leftmost-outermost reduction step. Returns null if no redex.
export function reduceOnce(t: Term): Term | null {
  // I x → x
  if (t.kind === "app" && t.f.kind === "sym" && t.f.name === "I") {
    return t.x;
  }
  // K x y → x
  if (t.kind === "app" && t.f.kind === "app" && t.f.f.kind === "sym" && t.f.f.name === "K") {
    return t.f.x;
  }
  // S x y z → x z (y z)
  if (
    t.kind === "app" &&
    t.f.kind === "app" &&
    t.f.f.kind === "app" &&
    t.f.f.f.kind === "sym" &&
    t.f.f.f.name === "S"
  ) {
    const x = t.f.f.x;
    const y = t.f.x;
    const z = t.x;
    return app(app(x, z), app(y, z));
  }
  // ι x → x S K
  if (t.kind === "app" && t.f.kind === "sym" && t.f.name === "i") {
    return app(app(t.x, sym("S")), sym("K"));
  }
  // recurse left, then right
  if (t.kind === "app") {
    const lf = reduceOnce(t.f);
    if (lf) return app(lf, t.x);
    const rx = reduceOnce(t.x);
    if (rx) return app(t.f, rx);
  }
  return null;
}

export interface ReduceTrace {
  steps: string[];
  normal: boolean;
  hitLimit: boolean;
}

export function reduceTrace(t: Term, maxSteps = 80): ReduceTrace {
  const steps = [show(t)];
  let cur = t;
  for (let k = 0; k < maxSteps; k++) {
    const next = reduceOnce(cur);
    if (!next) return { steps, normal: true, hitLimit: false };
    cur = next;
    steps.push(show(cur));
  }
  return { steps, normal: false, hitLimit: true };
}

export const PRESETS = [
  { id: "ki", label: "K I (identity selector)", src: "K I" },
  { id: "k-recover", label: "Recover K from ι", src: "ι (ι (ι ι))" },
  { id: "s-recover", label: "Recover S from ι", src: "ι (ι (ι (ι ι)))" },
  { id: "i-eq", label: "S K K x = I x", src: "S K K I" },
  { id: "skk", label: "S K K x — identity in disguise", src: "S K K (S K K)" },
  { id: "mockingbird", label: "Self-application M x = x x", src: "S I I (S K)" },
];
