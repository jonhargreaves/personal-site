import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type * as React from "react";

import { cn } from "../lib/utils";

const ScrollArea = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>) => (
  <ScrollAreaPrimitive.Root
    className={cn("relative overflow-hidden", className)}
    data-slot="scroll-area"
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className="h-full w-full rounded-[inherit]"
    >
      <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
        {children}
      </ScrollAreaPrimitive.Content>
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>) => (
  <ScrollAreaPrimitive.Scrollbar
    className={cn(
      "flex touch-none select-none transition-opacity data-[hovering]:opacity-100 data-[scrolling]:opacity-100 data-[hovering]:duration-75 data-[scrolling]:duration-75 opacity-0 duration-150",
      orientation === "vertical" && "absolute inset-y-0 right-0 w-2.5 p-0.5",
      orientation === "horizontal" &&
        "absolute inset-x-0 bottom-0 h-2.5 flex-col p-0.5",
      className
    )}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.Scrollbar>
);
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;

export { ScrollArea, ScrollBar };
