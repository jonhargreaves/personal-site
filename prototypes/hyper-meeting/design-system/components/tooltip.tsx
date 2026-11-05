"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";

import { cn } from "../lib/utils";

import {
  anchoredPopupMotionClassName,
  popupMotionClassName,
} from "./primitive/popup-motion";
import { Slot } from "./primitive/slot";

type SlottableProps<T> = T & {
  asChild?: boolean;
};

const TooltipProviderContext = React.createContext(false);

type TooltipProviderProps = Omit<
  React.ComponentProps<typeof TooltipPrimitive.Provider>,
  "closeDelay" | "delay" | "timeout"
> & {
  closeDelayDuration?: number;
  delayDuration?: number;
  skipDelayDuration?: number;
};

type TooltipContentProps = Omit<
  React.ComponentProps<typeof TooltipPrimitive.Popup>,
  "children"
> &
  Pick<
    React.ComponentProps<typeof TooltipPrimitive.Positioner>,
    | "align"
    | "alignOffset"
    | "arrowPadding"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "collisionPadding"
    | "disableAnchorTracking"
    | "positionMethod"
    | "side"
    | "sideOffset"
    | "sticky"
  > & {
    children?: React.ReactNode;
    unmountOnHide?: boolean;
  };

function TooltipProvider({
  closeDelayDuration,
  delayDuration = 0,
  skipDelayDuration,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider
        closeDelay={closeDelayDuration}
        data-slot="tooltip-provider"
        delay={delayDuration}
        timeout={skipDelayDuration}
        {...props}
      />
    </TooltipProviderContext.Provider>
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const hasProvider = React.useContext(TooltipProviderContext);
  if (hasProvider)
    return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof TooltipPrimitive.Trigger>>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function TooltipContent({
  align,
  alignOffset,
  arrowPadding,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  className,
  disableAnchorTracking,
  positionMethod,
  side = "top",
  sideOffset = 4,
  sticky,
  unmountOnHide,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal keepMounted={unmountOnHide === false}>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        className="pointer-events-none z-[60]"
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        disableAnchorTracking={disableAnchorTracking}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
      >
        <TooltipPrimitive.Popup
          className={cn(
            popupMotionClassName,
            anchoredPopupMotionClassName,
            "z-50 w-fit max-w-[min(20rem,calc(100vw-2rem))] origin-(--transform-origin) text-balance rounded-md border border-border bg-popover px-3 py-1.5 text-foreground text-xs shadow-lg backdrop-blur-sm",
            className
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export type { TooltipContentProps };
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
