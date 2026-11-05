import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "#f0b100",
      stroke: "#d08700",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M10 18.056a8.055 8.055 0 1 0 0-16.111 8.055 8.055 0 0 0 0 16.11",
      key: "0",
    },
  ],
  [
    "path",
    {
      fill: "#432004",
      stroke: "transparent",
      d: "M6.667 10a1.111 1.111 0 1 0 0-2.222 1.111 1.111 0 0 0 0 2.222m6.666 0a1.111 1.111 0 1 0 0-2.222 1.111 1.111 0 0 0 0 2.222m-.114 1.952a.75.75 0 0 0-.648-.21 16.8 16.8 0 0 1-5.153 0 .74.74 0 0 0-.636.205.77.77 0 0 0-.214.664A3.49 3.49 0 0 0 10 15.557a3.49 3.49 0 0 0 3.432-2.95.77.77 0 0 0-.213-.654",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HyperReactHoverDuotone = createDuotoneIcon(
  "HyperReactHoverDuotone",
  iconNode,
  { viewBox: "0 0 20 20" }
);
