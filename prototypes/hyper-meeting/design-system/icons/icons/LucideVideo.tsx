import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "0",
    },
  ],
  [
    "rect",
    {
      width: "14",
      height: "12",
      x: "2",
      y: "6",
      rx: "2",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideVideo = createLucideIcon("LucideVideo", iconNode);
