import { createStrokeIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M15 8A5 5 0 1 0 5 8a5 5 0 0 0 10 0m2.5 13v-7M14 17.5h7",
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
      d: "M3 20a7 7 0 0 1 11-5.745",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HugeUserAdd01Stroke = createStrokeIcon(
  "HugeUserAdd01Stroke",
  iconNode,
  { viewBox: "1.5 1.5 21.1 21.1" }
);
