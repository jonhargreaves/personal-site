import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M15 3h6v6m0-6-7 7M3 21l7-7m-1 7H3v-6",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideMaximize2 = createLucideIcon("LucideMaximize2", iconNode);
