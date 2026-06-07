// Flat ESLint config (ESLint 9). Lean ruleset: Next + react-hooks + TS recommended.
// Prettier owns formatting via eslint-config-prettier; ESLint focuses on correctness.

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    // Global ignores. Build artefacts, deps, generated type files.
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "**/*.d.ts",
      "next-env.d.ts",
      ".playwright-mcp/**",
      "dev.log",
    ],
  },

  // Base JS recommended.
  js.configs.recommended,

  // typescript-eslint "recommended" — not "strict", that's too noisy for
  // Canvas/WebGL-heavy demo code that legitimately reaches for `any`.
  ...tseslint.configs.recommended,

  // React + hooks. Flat-config friendly entries.
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser + Node ambient names used across the codebase.
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        performance: "readonly",
        HTMLElement: "readonly",
        HTMLCanvasElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLAudioElement: "readonly",
        Image: "readonly",
        ImageData: "readonly",
        AudioContext: "readonly",
        OfflineAudioContext: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        MediaQueryList: "readonly",
        Event: "readonly",
        MouseEvent: "readonly",
        TouchEvent: "readonly",
        KeyboardEvent: "readonly",
        PointerEvent: "readonly",
        WheelEvent: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        FormData: "readonly",
        Headers: "readonly",
        Request: "readonly",
        Response: "readonly",
        AbortController: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        location: "readonly",
        history: "readonly",
        matchMedia: "readonly",
        getComputedStyle: "readonly",
        SVGElement: "readonly",
        SVGSVGElement: "readonly",
        Path2D: "readonly",
        DOMRect: "readonly",
        crypto: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        queueMicrotask: "readonly",
        structuredClone: "readonly",
        globalThis: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Next.js recommended set + Core Web Vitals.
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Hooks: must be ERROR.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React.
      "react/jsx-key": "error",
      "react/react-in-jsx-scope": "off", // Next 15 auto JSX runtime.
      "react/prop-types": "off", // TS handles props.
      "react/display-name": "off", // Inline anonymous heroes.
      "react/no-unescaped-entities": "off", // Lots of legit prose w/ apostrophes.
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],

      // TS unused vars — allow underscore-prefixed escape hatch.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Base rule must be off when the TS variant is on.
      "no-unused-vars": "off",

      // Demo components have legit `any`s for Canvas/WebGL. Warn, don't fail.
      "@typescript-eslint/no-explicit-any": "warn",

      // Empty interfaces extending React types are a common pattern.
      "@typescript-eslint/no-empty-object-type": "off",

      // `Function` type appears in some signature helpers — warn rather than error.
      "@typescript-eslint/no-unsafe-function-type": "warn",

      // `prefer-const` is good hygiene but not worth blocking on.
      "prefer-const": "warn",

      // We use plenty of `let x: any = ...` from JSON-ish sources.
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Test files: lighten further.
  {
    files: ["tests/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Config files at the root run in Node and are fine with require/CJS shapes.
  {
    files: ["*.{js,mjs,cjs,ts}", "*.config.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },

  // Prettier must come last — disables formatting rules that conflict.
  prettierConfig,
);
