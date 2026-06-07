import type { EmlNode } from "./ast";
import { eml, one, p, z } from "./ast";

export class ParseError extends Error {
  constructor(
    message: string,
    public pos: number,
  ) {
    super(message);
  }
}

export function parse(src: string): EmlNode {
  let i = 0;

  const skip = () => {
    while (i < src.length && /\s/.test(src[i])) i++;
  };

  const peek = (s: string) => {
    skip();
    return src.slice(i, i + s.length) === s;
  };

  const eat = (s: string) => {
    skip();
    if (src.slice(i, i + s.length) !== s) {
      throw new ParseError(`expected "${s}" at position ${i}`, i);
    }
    i += s.length;
  };

  const parseExpr = (): EmlNode => {
    skip();
    if (i >= src.length) {
      throw new ParseError("unexpected end of input", i);
    }
    if (peek("eml")) {
      i += 3;
      eat("(");
      const a = parseExpr();
      eat(",");
      const b = parseExpr();
      eat(")");
      return eml(a, b);
    }
    const ch = src[i];
    if (ch === "1") {
      i++;
      return one();
    }
    if (ch === "z") {
      i++;
      return z();
    }
    if (ch === "p") {
      i++;
      return p();
    }
    throw new ParseError(`unexpected character "${ch}" at position ${i}`, i);
  };

  const node = parseExpr();
  skip();
  if (i !== src.length) {
    throw new ParseError(`trailing input at position ${i}`, i);
  }
  return node;
}

export function safeParse(
  src: string,
): { ok: true; node: EmlNode } | { ok: false; error: string; pos: number } {
  try {
    return { ok: true, node: parse(src) };
  } catch (e) {
    if (e instanceof ParseError) return { ok: false, error: e.message, pos: e.pos };
    return { ok: false, error: String(e), pos: 0 };
  }
}
