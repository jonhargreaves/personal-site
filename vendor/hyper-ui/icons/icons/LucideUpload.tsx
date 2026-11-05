import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M12 3v12m5-7-5-5-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const LucideUpload = createLucideIcon("LucideUpload", iconNode);
