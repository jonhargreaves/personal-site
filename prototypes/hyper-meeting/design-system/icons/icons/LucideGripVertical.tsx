import { createLucideIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "circle",
    {
      cx: "9",
      cy: "12",
      r: "1",
      key: "0",
    },
  ],
  [
    "circle",
    {
      cx: "9",
      cy: "5",
      r: "1",
      key: "1",
    },
  ],
  [
    "circle",
    {
      cx: "9",
      cy: "19",
      r: "1",
      key: "2",
    },
  ],
  [
    "circle",
    {
      cx: "15",
      cy: "12",
      r: "1",
      key: "3",
    },
  ],
  [
    "circle",
    {
      cx: "15",
      cy: "5",
      r: "1",
      key: "4",
    },
  ],
  [
    "circle",
    {
      cx: "15",
      cy: "19",
      r: "1",
      key: "5",
    },
  ],
] as const satisfies IconNode;

export const LucideGripVertical = createLucideIcon(
  "LucideGripVertical",
  iconNode
);
