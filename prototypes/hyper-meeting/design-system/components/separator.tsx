import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type * as React from "react";

import { cn } from "../lib/utils";

const Separator = ({
  className,
  orientation = "horizontal",
  decorative: _decorative = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive> & {
  decorative?: boolean;
}) => (
  <SeparatorPrimitive
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    orientation={orientation}
    {...props}
  />
);
Separator.displayName = SeparatorPrimitive.displayName;

export { Separator };
