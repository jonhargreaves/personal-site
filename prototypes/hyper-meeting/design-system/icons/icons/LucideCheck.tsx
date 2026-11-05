import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M20 6 9 17l-5-5",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideCheck = createLucideIcon("LucideCheck", iconNode);
