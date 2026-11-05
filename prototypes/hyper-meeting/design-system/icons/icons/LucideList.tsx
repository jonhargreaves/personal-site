import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideList = createLucideIcon("LucideList", iconNode);
