import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m18 15-6-6-6 6",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideChevronUp = createLucideIcon("LucideChevronUp", iconNode);
