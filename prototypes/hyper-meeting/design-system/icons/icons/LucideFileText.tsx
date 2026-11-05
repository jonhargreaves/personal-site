import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "0",
    },
  ],
  [
    "path",
    {
      d: "M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideFileText = createLucideIcon("LucideFileText", iconNode);
