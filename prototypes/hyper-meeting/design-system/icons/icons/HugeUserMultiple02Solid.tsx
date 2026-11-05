import { createSolidIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M4.25 7a4.75 4.75 0 1 1 9.5 0 4.75 4.75 0 0 1-9.5 0m-3 12A5.75 5.75 0 0 1 7 13.25h4A5.75 5.75 0 0 1 16.75 19 2.75 2.75 0 0 1 14 21.75H4A2.75 2.75 0 0 1 1.25 19",
      key: "0",
    },
  ],
  [
    "path",
    {
      fill: "currentColor",
      d: "M13.374 11.464a4.75 4.75 0 1 0 0-8.929A6.23 6.23 0 0 1 15.25 7c0 1.749-.718 3.33-1.876 4.464M17.24 21.75H20A2.75 2.75 0 0 0 22.75 19 5.75 5.75 0 0 0 17 13.25h-1.584A7.24 7.24 0 0 1 18.25 19a4.23 4.23 0 0 1-1.01 2.75",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HugeUserMultiple02Solid = createSolidIcon(
  "HugeUserMultiple02Solid",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
