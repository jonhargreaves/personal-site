import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      key: "0",
    },
  ],
  [
    "path",
    {
      d: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideSmile = createLucideIcon("LucideSmile", iconNode);
