import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  // Preserve upstream component implementations; snapshot hashes verify vendor integrity.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "vendor/**"]),
]);
