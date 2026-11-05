import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M2 20h.01M7 20v-4m5 4v-8m5 8V8m5-4v16",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideSignal = createLucideIcon("LucideSignal", iconNode);
