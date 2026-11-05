import type { HighlightOptions, LanguageName } from "sugar-high";
import { parse, type ParsedToken, type ParseOptions } from "sugar-high/core";
import { lang as resolveSugarHighLanguage, languages } from "sugar-high/lang";

export const CODE_LANGUAGE_OPTIONS = [
  { label: "Plain text", value: "plaintext" },
  { label: "C", value: "c" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cpp" },
  { label: "CSS", value: "css" },
  { label: "Diff / Patch", value: "diff" },
  { label: "Dockerfile", value: "dockerfile" },
  { label: "Go", value: "go" },
  { label: "GraphQL", value: "graphql" },
  { label: "HCL / Terraform", value: "hcl" },
  { label: "HTML", value: "html" },
  { label: "Java", value: "java" },
  { label: "JavaScript / JSX", value: "javascript" },
  { label: "JSON / JSONC", value: "json" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Markdown / MDX", value: "markdown" },
  { label: "PHP", value: "php" },
  { label: "PowerShell", value: "powershell" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Shell (Bash / Zsh)", value: "shell" },
  { label: "SQL", value: "sql" },
  { label: "Swift", value: "swift" },
  { label: "TOML", value: "toml" },
  { label: "TypeScript / TSX", value: "typescript" },
  { label: "YAML", value: "yaml" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: LanguageName | "plaintext";
}>;

type LiteralUnion<T extends string> = T | (string & {});

const LINE_BREAK_TOKEN = {
  type: "break",
  value: "\n",
} satisfies ParsedToken;

const SUGAR_HIGH_PARSE_OPTIONS = new Map<
  LanguageName,
  ParseOptions | undefined
>(languages.map(({ config, id }) => [id, config]));

export type CodeLanguageValue = (typeof CODE_LANGUAGE_OPTIONS)[number]["value"];
export type SupportedCodeLanguage = LiteralUnion<CodeLanguageValue | "auto">;

function getCanonicalSugarHighLanguage(
  value: SupportedCodeLanguage | undefined
): LanguageName | undefined {
  return value ? resolveSugarHighLanguage(value) : undefined;
}

export function normalizeCodeLanguage(
  value: SupportedCodeLanguage | undefined
): string {
  if (!value) return "plaintext";
  const normalized = value.toLowerCase().trim();
  if (!normalized) return "plaintext";
  return resolveSugarHighLanguage(normalized) ?? normalized;
}

export function getCodeLanguageLabel(
  value: SupportedCodeLanguage | undefined
): string {
  const normalized = normalizeCodeLanguage(value);
  return (
    CODE_LANGUAGE_OPTIONS.find((option) => option.value === normalized)
      ?.label ?? normalized
  );
}

export function isCodeLanguageHighlighted(
  value: SupportedCodeLanguage | undefined
): boolean {
  return getCanonicalSugarHighLanguage(value) !== undefined;
}

export function getSugarHighOptions(
  value: SupportedCodeLanguage | undefined
): HighlightOptions | undefined {
  const lang = getCanonicalSugarHighLanguage(value);
  return lang ? { lang } : undefined;
}

export function getSugarHighTokens(
  code: string,
  value: SupportedCodeLanguage | undefined
): ReadonlyArray<ParsedToken> | undefined {
  const lang = getCanonicalSugarHighLanguage(value);
  if (!lang) return undefined;

  const parsed = parse(code, SUGAR_HIGH_PARSE_OPTIONS.get(lang));
  const tokens: ParsedToken[] = [];

  parsed.lines.forEach((line, index) => {
    tokens.push(...line.tokens);
    if (index < parsed.lines.length - 1) {
      tokens.push(LINE_BREAK_TOKEN);
    }
  });

  return tokens;
}
