import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M12 19v3m3-12.66V5a3 3 0 0 0-5.68-1.33m7.63 13.28A7 7 0 0 1 5 12v-2m13.89 3.23A7 7 0 0 0 19 12v-2M2 2l20 20",
      key: "0",
    },
  ],
  [
    "path",
    {
      d: "M9 9v3a3 3 0 0 0 5.12 2.12",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideMicOff = createLucideIcon("LucideMicOff", iconNode);
