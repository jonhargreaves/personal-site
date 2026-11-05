import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "rect",
    {
      width: "20",
      height: "14",
      x: "2",
      y: "3",
      rx: "2",
      key: "0",
    },
  ],
  [
    "path",
    {
      d: "M8 21h8m-4-4v4",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideMonitor = createLucideIcon("LucideMonitor", iconNode);
