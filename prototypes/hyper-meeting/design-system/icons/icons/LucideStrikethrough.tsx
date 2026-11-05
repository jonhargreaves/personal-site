import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6m-2-8h16",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideStrikethrough = createLucideIcon(
  "LucideStrikethrough",
  iconNode
);
