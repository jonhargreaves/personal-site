import { createSolidIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M11 2a9 9 0 1 0 5.618 16.032l3.675 3.675a1 1 0 0 0 1.414-1.414l-3.675-3.675A9 9 0 0 0 11 2m-7 9a7 7 0 1 1 14 0 7 7 0 0 1-14 0",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const HugeSearch01Solid = createSolidIcon(
  "HugeSearch01Solid",
  iconNode,
  { viewBox: "1.2 1.2 21.6 21.6" }
);
