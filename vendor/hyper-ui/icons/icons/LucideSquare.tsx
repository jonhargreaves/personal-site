import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "rect",
    {
      width: "18",
      height: "18",
      x: "3",
      y: "3",
      rx: "2",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideSquare = createLucideIcon("LucideSquare", iconNode);
