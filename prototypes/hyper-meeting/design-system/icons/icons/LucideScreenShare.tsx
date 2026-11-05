import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3M8 21h8m-4-4v4m5-13 5-5m-5 0h5v5",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideScreenShare = createLucideIcon(
  "LucideScreenShare",
  iconNode
);
