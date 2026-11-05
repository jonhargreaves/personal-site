import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m14 10 7-7m-1 7h-6V4M3 21l7-7m-6 0h6v6",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideMinimize2 = createLucideIcon("LucideMinimize2", iconNode);
