import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m21 21-4.34-4.34",
      key: "0",
    },
  ],
  [
    "circle",
    {
      cx: "11",
      cy: "11",
      r: "8",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideSearch = createLucideIcon("LucideSearch", iconNode);
