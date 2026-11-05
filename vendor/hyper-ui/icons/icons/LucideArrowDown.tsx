import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M12 5v14m7-7-7 7-7-7",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideArrowDown = createLucideIcon("LucideArrowDown", iconNode);
