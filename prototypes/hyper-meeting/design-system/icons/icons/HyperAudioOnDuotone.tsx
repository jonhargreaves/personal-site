import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M14.167 5.833v3.334a4.167 4.167 0 1 1-8.334 0V5.833a4.167 4.167 0 1 1 8.334 0",
      opacity: ".1",
      key: "0",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeWidth: "1.5",
      d: "M14.167 5.833v3.334a4.167 4.167 0 1 1-8.334 0V5.833a4.167 4.167 0 1 1 8.334 0Z",
      key: "1",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      d: "M16.667 9.167A6.667 6.667 0 0 1 10 15.833m0 0a6.667 6.667 0 0 1-6.667-6.666M10 15.833v2.5m0 0h2.5m-2.5 0H7.5",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const HyperAudioOnDuotone = createDuotoneIcon(
  "HyperAudioOnDuotone",
  iconNode,
  { viewBox: "0 0 20 20" }
);
