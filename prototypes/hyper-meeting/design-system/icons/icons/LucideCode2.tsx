import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m18 16 4-4-4-4M6 8l-4 4 4 4m8.5-12-5 16",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideCode2 = createLucideIcon("LucideCode2", iconNode);
