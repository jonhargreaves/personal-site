import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M6 4v6a6 6 0 0 0 12 0V4M4 20h16",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideUnderline = createLucideIcon("LucideUnderline", iconNode);
