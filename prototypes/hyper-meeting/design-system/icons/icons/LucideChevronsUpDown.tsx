import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m7 15 5 5 5-5M7 9l5-5 5 5",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideChevronsUpDown = createLucideIcon(
  "LucideChevronsUpDown",
  iconNode
);
