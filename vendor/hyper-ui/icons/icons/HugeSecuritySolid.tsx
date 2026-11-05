import { createSolidIcon } from "../lib/create-icon";
import type { IconNode } from "../types";

const iconNode = [
  [
    "path",
    {
      fill: "currentColor",
      d: "M12 1.25c2.609 0 5.04.578 7.043 1.574.92.458 1.571.768 2.145 1.695.584.942.562 1.882.562 3.229v3.49c0 6.136-4.904 9.485-7.58 10.863l-.036.018c-.718.37-1.226.631-2.134.631s-1.415-.262-2.133-.63l-.037-.02c-2.677-1.377-7.58-4.726-7.58-10.863V7.748c0-1.347-.022-2.287.561-3.23.574-.926 1.225-1.236 2.146-1.694C6.96 1.828 9.39 1.25 12 1.25m0 6.5a1.75 1.75 0 0 0-.877 3.262l-.606 2.83a.75.75 0 0 0 .733.908h1.5a.75.75 0 0 0 .733-.907l-.607-2.831q.197-.113.361-.275A1.75 1.75 0 0 0 12 7.75",
      key: "0",
    },
  ],
] as const satisfies IconNode;

export const HugeSecuritySolid = createSolidIcon(
  "HugeSecuritySolid",
  iconNode,
  { viewBox: "0.4 0.4 23.2 23.2" }
);
