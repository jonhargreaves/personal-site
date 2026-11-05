import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M18.709 3.495C16.817 2.554 14.5 2 12 2s-4.816.554-6.709 1.495c-.928.462-1.392.693-1.841 1.419S3 6.343 3 7.748v3.49c0 5.683 4.542 8.843 7.173 10.196.734.377 1.1.566 1.827.566s1.093-.189 1.827-.566C16.457 20.08 21 16.92 21 11.237V7.748c0-1.405 0-2.108-.45-2.834s-.913-.957-1.841-1.419",
      opacity: ".4",
      key: "0",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M18.709 3.495C16.817 2.554 14.5 2 12 2s-4.816.554-6.709 1.495c-.928.462-1.392.693-1.841 1.419S3 6.343 3 7.748v3.49c0 5.683 4.542 8.843 7.173 10.196.734.377 1.1.566 1.827.566s1.093-.189 1.827-.566C16.457 20.08 21 16.92 21 11.237V7.748c0-1.405 0-2.108-.45-2.834s-.913-.957-1.841-1.419",
      key: "1",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M12 9v1m-1-.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0",
      key: "2",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M12.75 14h-1.5l.75-3.5z",
      key: "3",
    },
  ],
] as const satisfies IconNode;

export const HugeSecurityDuotone = createDuotoneIcon(
  "HugeSecurityDuotone",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
