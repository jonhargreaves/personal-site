import { createStrokeIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "1.5",
      d: "m19.5 5.5-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5m16.5 0H3m13.058 0-.683-1.408c-.454-.936-.68-1.403-1.072-1.695a2 2 0 0 0-.274-.172C13.596 2 13.076 2 12.036 2c-1.065 0-1.598 0-2.039.234a2 2 0 0 0-.278.18c-.396.303-.617.788-1.059 1.757L8.055 5.5m1.445 11v-6m5 6v-6",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const HugeDelete02Stroke = createStrokeIcon(
  "HugeDelete02Stroke",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
