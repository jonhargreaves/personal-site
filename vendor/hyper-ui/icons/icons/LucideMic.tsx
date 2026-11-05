import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M12 19v3m7-12v2a7 7 0 0 1-14 0v-2",
      key: "0",
    },
  ],
  [
    "rect",
    {
      width: "6",
      height: "13",
      x: "9",
      y: "2",
      rx: "3",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideMic = createLucideIcon("LucideMic", iconNode);
