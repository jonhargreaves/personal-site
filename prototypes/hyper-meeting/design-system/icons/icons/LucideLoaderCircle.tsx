import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M21 12a9 9 0 1 1-6.219-8.56",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideLoaderCircle = createLucideIcon(
  "LucideLoaderCircle",
  iconNode
);
