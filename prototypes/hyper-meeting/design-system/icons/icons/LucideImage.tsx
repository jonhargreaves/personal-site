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
      ry: "2",
      key: "0",
    },
  ],
  [
    "circle",
    {
      cx: "9",
      cy: "9",
      r: "2",
      key: "1",
    },
  ],
  [
    "path",
    {
      d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const LucideImage = createLucideIcon("LucideImage", iconNode);
