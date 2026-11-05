import { createSolidIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M4 14a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m8-6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1m11 14a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h20a1 1 0 0 1 1 1m-3-10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1",
      key: "0",
    },
  ],
  [
    "path",
    {
      fill: "currentColor",
      d: "M9 4a3 3 0 1 1 5.977.37l2.94 1.47a3 3 0 1 1-.895 1.789l-2.94-1.47A3 3 0 0 1 12 7a3 3 0 0 1-1.663-.503L6.863 9.103a3 3 0 1 1-1.2-1.6l3.474-2.606A3 3 0 0 1 9 4",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HugeChartBarLineSolid = createSolidIcon(
  "HugeChartBarLineSolid",
  iconNode,
  { viewBox: "0.1 0.1 23.8 23.8" }
);
