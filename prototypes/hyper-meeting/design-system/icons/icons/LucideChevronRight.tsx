import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m9 18 6-6-6-6",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideChevronRight = createLucideIcon(
  "LucideChevronRight",
  iconNode
);
