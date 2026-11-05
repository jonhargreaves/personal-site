import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0",
      key: "0",
    },
  ],
  [
    "path",
    {
      d: "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6",
      key: "1",
    },
  ],
  [
    "path",
    {
      d: "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6",
      key: "2",
    },
  ],
  [
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      key: "3",
    },
  ],
] as const satisfies IconNode;

export const LucideLoaderPinwheel = createLucideIcon(
  "LucideLoaderPinwheel",
  iconNode
);
