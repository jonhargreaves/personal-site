import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M7 7v4a5 5 0 0 0 8 4z",
      opacity: ".4",
      key: "0",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      d: "m2 2 20 20M4 11a8 8 0 0 0 8 8m0 0c1.954 0 3.745-.7 5.135-1.865M12 19v3m0 0h3m-3 0H9m11-11c0 1.651-.5 3.186-1.358 4.46M7.672 4.484C8.53 2.965 10.132 2 12 2c2.761 0 5 2.219 5 4.98V11c0 .83-.203 1.555-.561 2.244M7 6.98V11a5 5 0 0 0 5 5c1.135 0 2.165-.39 3.004-1.028",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HugeMicOff02Duotone = createDuotoneIcon(
  "HugeMicOff02Duotone",
  iconNode
);
