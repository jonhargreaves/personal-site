import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "1",
      key: "0",
    },
  ],
  [
    "circle",
    {
      cx: "19",
      cy: "12",
      r: "1",
      key: "1",
    },
  ],
  [
    "circle",
    {
      cx: "5",
      cy: "12",
      r: "1",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const LucideMoreHorizontal = createLucideIcon(
  "LucideMoreHorizontal",
  iconNode
);
