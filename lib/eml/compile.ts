import type { EmlNode } from "./ast";

// Compile an EML AST to a sequence of GLSL statements over vec2 complex numbers.
// Returns { body, ret } where `body` is a list of `vec2 t<n> = ...;` lines
// and `ret` is the variable name holding the result.

export interface Compiled {
  body: string;
  ret: string;
}

export function compileToGLSL(node: EmlNode): Compiled {
  let counter = 0;
  const lines: string[] = [];

  const visit = (n: EmlNode): string => {
    switch (n.kind) {
      case "one":
        return "vec2(1.0, 0.0)";
      case "z":
        return "z";
      case "p":
        return "uParam";
      case "eml": {
        const a = visit(n.a);
        const b = visit(n.b);
        const name = `t${counter++}`;
        lines.push(`  vec2 ${name} = ceml(${a}, ${b});`);
        return name;
      }
    }
  };

  const ret = visit(node);
  return { body: lines.join("\n"), ret };
}

// Pure JS evaluator — used for the AST tree visualization and tests.
// Returns a complex number as [re, im], or null if the value is non-finite.
export type C = [number, number];
const cadd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const csub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
const cexp = (a: C): C => {
  const e = Math.exp(a[0]);
  return [e * Math.cos(a[1]), e * Math.sin(a[1])];
};
const clog = (a: C): C => {
  const r = Math.hypot(a[0], a[1]);
  return [Math.log(r || 1e-30), Math.atan2(a[1], a[0])];
};

export function evalEml(n: EmlNode, zVal: C, pVal: C): C {
  if (n.kind === "one") return [1, 0];
  if (n.kind === "z") return zVal;
  if (n.kind === "p") return pVal;
  const a = evalEml(n.a, zVal, pVal);
  const b = evalEml(n.b, zVal, pVal);
  return csub(cexp(a), clog(b));
}

export { cadd, csub, cexp, clog };
