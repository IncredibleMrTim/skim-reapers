import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference template, not live app code — its imports are
    // deliberately unresolved (filled in by whoever copies it into a
    // new project), so it isn't meant to type-check or lint clean.
    "sanity-admin-template/**",
  ]),
]);

export default eslintConfig;
