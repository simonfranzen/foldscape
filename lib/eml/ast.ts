// Minimal expression tree for the EML calculus.
// Terminals: 1 (the paper's single constant) and z (input complex variable).
// Operator:  eml(a, b) = exp(a) - log(b), computed on the complex plane.
// Sugar:     p — a uniform complex parameter slot, used by sliders/morphs.

export type EmlNode =
  | { kind: "one" }
  | { kind: "z" }
  | { kind: "p" }
  | { kind: "eml"; a: EmlNode; b: EmlNode };

export const one = (): EmlNode => ({ kind: "one" });
export const z = (): EmlNode => ({ kind: "z" });
export const p = (): EmlNode => ({ kind: "p" });
export const eml = (a: EmlNode, b: EmlNode): EmlNode => ({ kind: "eml", a, b });

export function depth(n: EmlNode): number {
  if (n.kind === "eml") return 1 + Math.max(depth(n.a), depth(n.b));
  return 0;
}

export function nodeCount(n: EmlNode): number {
  if (n.kind === "eml") return 1 + nodeCount(n.a) + nodeCount(n.b);
  return 1;
}

export function toString(n: EmlNode): string {
  if (n.kind === "one") return "1";
  if (n.kind === "z") return "z";
  if (n.kind === "p") return "p";
  return `eml(${toString(n.a)}, ${toString(n.b)})`;
}
