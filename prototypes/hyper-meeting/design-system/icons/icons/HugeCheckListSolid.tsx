import { createSolidIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M10 6a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H11a1 1 0 0 1-1-1m0 6a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H11a1 1 0 0 1-1-1m0 6a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H11a1 1 0 0 1-1-1",
      key: "0",
    },
  ],
  [
    "path",
    {
      fill: "currentColor",
      d: "M8.848 3.47a1 1 0 0 1-.318 1.378c-.773.483-1.546 1.539-2.162 2.617a18 18 0 0 0-.94 1.906 1 1 0 0 1-1.814.093c-.173-.331-.453-.641-.722-.884a6 6 0 0 0-.438-.35 1 1 0 0 1 1.092-1.675c.136.092.472.336.726.577q.164-.314.36-.66c.634-1.108 1.611-2.553 2.838-3.32a1 1 0 0 1 1.378.318m0 11a1 1 0 0 1-.318 1.378c-.773.483-1.546 1.539-2.162 2.617a18 18 0 0 0-.94 1.906 1 1 0 0 1-1.814.093c-.173-.331-.453-.641-.722-.884a6 6 0 0 0-.438-.35 1 1 0 0 1 1.092-1.675c.136.092.472.336.726.577q.164-.314.36-.66c.634-1.108 1.611-2.553 2.838-3.32a1 1 0 0 1 1.378.318",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const HugeCheckListSolid = createSolidIcon(
  "HugeCheckListSolid",
  iconNode,
  { viewBox: "1.2 1.2 21.6 21.6" }
);
