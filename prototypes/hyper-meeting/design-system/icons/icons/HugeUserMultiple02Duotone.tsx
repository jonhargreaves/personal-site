import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0m-2 7H7a5 5 0 0 0-5 5 2 2 0 0 0 2 2h10a2 2 0 0 0 2-2 5 5 0 0 0-5-5",
      opacity: ".4",
      key: "0",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeWidth: "1.5",
      d: "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
      key: "1",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M15 11a4 4 0 0 0 0-8",
      key: "2",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M11 14H7a5 5 0 0 0-5 5 2 2 0 0 0 2 2h10a2 2 0 0 0 2-2 5 5 0 0 0-5-5Z",
      key: "3",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M17 14a5 5 0 0 1 5 5 2 2 0 0 1-2 2h-1.5",
      key: "4",
    },
  ],
] as const satisfies IconNode;

export const HugeUserMultiple02Duotone = createDuotoneIcon(
  "HugeUserMultiple02Duotone",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
