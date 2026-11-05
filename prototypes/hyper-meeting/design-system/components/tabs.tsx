import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type * as React from "react";

import { cn } from "../lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      {...props}
    />
  );
}
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-8 w-fit items-center justify-center rounded-xs bg-muted p-0.5 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col text-muted-foreground",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  );
}
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "inline-flex h-full flex-1 cursor-pointer group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start items-center justify-center gap-1.5 whitespace-nowrap rounded-xs border border-transparent px-2.5 py-1 font-medium text-muted-foreground text-sm transition-[color,box-shadow] aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-xs focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:aria-selected:border-input dark:aria-selected:bg-input/30 dark:aria-selected:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
