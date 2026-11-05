import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M18 6 6 18M6 6l12 12",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideX = createLucideIcon("LucideX", iconNode);
