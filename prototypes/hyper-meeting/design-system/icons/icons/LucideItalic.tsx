import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M19 4h-9m4 16H5M15 4 9 20",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideItalic = createLucideIcon("LucideItalic", iconNode);
