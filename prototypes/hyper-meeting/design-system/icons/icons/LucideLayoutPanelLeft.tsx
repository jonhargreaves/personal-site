import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "rect",
    {
      width: "7",
      height: "18",
      x: "3",
      y: "3",
      rx: "1",
      key: "0",
    },
  ],
  [
    "rect",
    {
      width: "7",
      height: "7",
      x: "14",
      y: "3",
      rx: "1",
      key: "1",
    },
  ],
  [
    "rect",
    {
      width: "7",
      height: "7",
      x: "14",
      y: "14",
      rx: "1",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const LucideLayoutPanelLeft = createLucideIcon(
  "LucideLayoutPanelLeft",
  iconNode
);
