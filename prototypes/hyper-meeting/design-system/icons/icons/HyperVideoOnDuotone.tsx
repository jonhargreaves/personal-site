import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M2.52 4.187c-.853.855-.853 2.23-.853 4.98v1.666c0 2.75 0 4.125.854 4.98.855.853 2.23.853 4.98.853h.833c2.75 0 4.124 0 4.979-.854.854-.854.854-2.23.854-4.98V9.167c0-2.75 0-4.124-.854-4.979-.855-.855-2.23-.855-4.98-.855h-.832c-2.75 0-4.125 0-4.98.854",
      clipRule: "evenodd",
      opacity: ".1",
      key: "0",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeWidth: "1.5",
      d: "M1.667 9.166c0-2.75 0-4.124.854-4.979.855-.854 2.229-.854 4.98-.854h.834c2.75 0 4.124 0 4.979.854.854.855.854 2.23.854 4.98v1.666c0 2.75 0 4.125-.854 4.98-.855.853-2.23.853-4.98.853H7.5c-2.75 0-4.125 0-4.98-.854-.854-.854-.854-2.23-.854-4.98Z",
      key: "1",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      d: "m14.167 7.421.105-.086c1.763-1.455 2.645-2.183 3.353-1.83.709.35.709 1.514.709 3.843v1.303c0 2.33 0 3.493-.71 3.845-.707.35-1.59-.377-3.352-1.83l-.105-.088",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const HyperVideoOnDuotone = createDuotoneIcon(
  "HyperVideoOnDuotone",
  iconNode,
  { viewBox: "0 0 20 20" }
);
