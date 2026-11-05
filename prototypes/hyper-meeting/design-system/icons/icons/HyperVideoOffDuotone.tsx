import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      d: "m.665.665 16.646 16.667",
      key: "0",
    },
  ],
  [
    "path",
    {
      fill: "currentColor",
      fillOpacity: ".1",
      d: "M13.04 13.055c-.108.782-.321 1.332-.744 1.755-.853.855-2.226.855-4.973.855h-.832c-2.746 0-4.12 0-4.973-.855-.853-.854-.853-2.229-.853-4.979V8.165c0-2.75 0-4.125.853-4.98.286-.285.629-.475 1.063-.602",
      key: "1",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      d: "M13.04 13.055c-.108.782-.321 1.332-.744 1.755-.853.855-2.226.855-4.973.855h-.832c-2.746 0-4.12 0-4.973-.855-.853-.854-.853-2.229-.853-4.979V8.165c0-2.75 0-4.125.853-4.98.286-.285.629-.475 1.063-.602m3.279-.251h1.463c2.746 0 4.12 0 4.973.854s.853 2.229.853 4.979V9.63m.015-3.21.104-.086c1.764-1.455 2.645-2.183 3.354-1.831.708.351.708 1.515.708 3.844V9.65c0 2.053 0 3.201-.485 3.685",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const HyperVideoOffDuotone = createDuotoneIcon(
  "HyperVideoOffDuotone",
  iconNode,
  {
    defaultSecondaryOpacity: 0.1,
    viewBox: "0 0 18 18",
  }
);
