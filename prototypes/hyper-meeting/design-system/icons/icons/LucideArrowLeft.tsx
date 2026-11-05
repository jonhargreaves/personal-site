import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "m12 19-7-7 7-7m7 7H5",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideArrowLeft = createLucideIcon("LucideArrowLeft", iconNode);
