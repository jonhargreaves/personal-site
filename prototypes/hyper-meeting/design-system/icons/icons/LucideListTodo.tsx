import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      d: "M13 5h8m-8 7h8m-8 7h8M3 17l2 2 4-4",
      key: "0",
    },
  ],
  [
    "rect",
    {
      width: "6",
      height: "6",
      x: "3",
      y: "4",
      rx: "1",
      key: "1",
    },
  ],
] as const satisfies IconNode;

export const LucideListTodo = createLucideIcon("LucideListTodo", iconNode);
