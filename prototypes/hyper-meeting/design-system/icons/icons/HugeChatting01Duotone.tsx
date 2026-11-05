import { createDuotoneIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M19.866 12.1q.133-.727.134-1.49C20 5.855 15.97 2 11 2s-9 3.855-9 8.61c0 2.285.93 4.36 2.447 5.9.334.34.557.803.467 1.28a4.76 4.76 0 0 1-.978 2.114 5.85 5.85 0 0 0 3.801-.591c.41-.218.614-.326.758-.348s.35.016.764.094a9.4 9.4 0 0 0 2.66.117A5.1 5.1 0 0 1 11 16.262C11 13.356 13.463 11 16.5 11c1.268 0 2.435.41 3.366 1.1",
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
      d: "M20 9c-.795-3.985-4.487-7-8.92-7C6.064 2 2 5.855 2 10.61c0 2.285.938 4.36 2.469 5.9.336.34.561.803.47 1.28a4.75 4.75 0 0 1-.986 2.114 5.95 5.95 0 0 0 3.835-.591c.412-.218.619-.326.764-.348.102-.016.235-.001.448.035",
      key: "1",
    },
  ],
  [
    "path",
    {
      stroke: "currentColor",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
      d: "M11 16.262c0 2.905 2.463 5.261 5.5 5.261q.537 0 1.064-.098c.253-.047.379-.071.467-.058.088.014.213.08.463.213.706.376 1.53.509 2.323.361a2.9 2.9 0 0 1-.598-1.291c-.055-.292.081-.575.286-.782A5.12 5.12 0 0 0 22 16.262C22 13.356 19.537 11 16.5 11S11 13.356 11 16.262Z",
      key: "2",
    },
  ],
] as const satisfies IconNode;

export const HugeChatting01Duotone = createDuotoneIcon(
  "HugeChatting01Duotone",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
