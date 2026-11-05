/**
 * Get initials from a name string.
 *
 * - Single word: returns first 2 characters (e.g., "Clara" → "CL")
 * - Two words: returns first character of each (e.g., "Clara Oswald" → "CO")
 * - Multiple words: returns first and last initials (e.g., "Sarah Jane Smith" → "SS")
 *
 * @param name - The name to extract initials from
 * @returns Uppercase initials (1-2 characters)
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  const firstWord = words[0];
  if (words.length === 1 || !firstWord) {
    // Single word: take up to first 2 characters
    return (firstWord ?? "").slice(0, 2).toUpperCase();
  }

  // Multiple words: take first char of first and last word
  const lastWord = words.at(-1);
  const first = firstWord[0] ?? "";
  const last = lastWord?.[0] ?? "";

  return (first + last).toUpperCase();
}
