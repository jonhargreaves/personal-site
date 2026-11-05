"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type * as React from "react";

import { cn } from "../lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const resolvedValue = value ?? null;

  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      data-slot="progress"
      value={resolvedValue}
      {...props}
    >
      <ProgressPrimitive.Track className="size-full">
        <ProgressPrimitive.Indicator
          className="h-full bg-primary transition-[width] data-[indeterminate]:w-full data-[indeterminate]:animate-pulse motion-reduce:animate-none motion-reduce:transition-none"
          data-slot="progress-indicator"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
