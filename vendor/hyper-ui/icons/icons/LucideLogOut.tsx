import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m16 17 5-5-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideLogOut = createLucideIcon("LucideLogOut", iconNode);
