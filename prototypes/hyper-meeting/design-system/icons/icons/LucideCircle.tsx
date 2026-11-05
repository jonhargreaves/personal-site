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
] as const satisfies IconNode;

export const LucideCircle = createLucideIcon("LucideCircle", iconNode);
