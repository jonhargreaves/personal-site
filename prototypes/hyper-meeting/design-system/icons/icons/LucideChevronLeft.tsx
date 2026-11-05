import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m15 18-6-6 6-6",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideChevronLeft = createLucideIcon(
  "LucideChevronLeft",
  iconNode
);
