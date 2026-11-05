import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["prototypes/**/*.ts", "prototypes/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // The tile-layout engine is a compiled third-party distribution, not UI source.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "prototypes/**/layout-engine/**"]),
]);
