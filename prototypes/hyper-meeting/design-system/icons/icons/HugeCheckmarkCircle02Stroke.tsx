import { createStrokeIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      stroke: "currentColor",
      strokeWidth: "1.5",
      d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10Z",
      key: "0",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "m8 12.5 2.5 2.5L16 9",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HugeCheckmarkCircle02Stroke = createStrokeIcon(
  "HugeCheckmarkCircle02Stroke",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
