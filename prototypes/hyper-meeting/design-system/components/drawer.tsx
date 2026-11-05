"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/utils";

import { Slot } from "./primitive/slot";

type SlottableProps<T> = T & {
  asChild?: boolean;
};

export type DrawerMotion = "animated" | "instant";

const drawerContentVariants = cva(
  "group/drawer-content fixed z-50 flex h-auto flex-col data-[swiping]:transition-none",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: [
          "bg-background transition-transform duration-300",
          "data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[80vh] data-[swipe-direction=up]:rounded-b-lg data-[swipe-direction=up]:border-b data-[swipe-direction=up]:[transform:translateY(var(--drawer-swipe-movement-y,0px))]",
          "data-[starting-style]:data-[swipe-direction=up]:[transform:translateY(-100%)] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(-100%)]",
          "data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=down]:rounded-t-lg data-[swipe-direction=down]:border-t data-[swipe-direction=down]:[transform:translateY(var(--drawer-swipe-movement-y,0px))]",
          "data-[starting-style]:data-[swipe-direction=down]:[transform:translateY(100%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(100%)]",
          "data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:border-l data-[swipe-direction=right]:sm:max-w-sm data-[swipe-direction=right]:[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
          "data-[starting-style]:data-[swipe-direction=right]:[transform:translateX(100%)] data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(100%)]",
          "data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:border-r data-[swipe-direction=left]:sm:max-w-sm data-[swipe-direction=left]:[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
          "data-[starting-style]:data-[swipe-direction=left]:[transform:translateX(-100%)] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(-100%)]",
        ],
        floating: [
          "right-4 bottom-4 w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[16px] border bg-popover p-0 shadow-2xl outline-none sm:max-w-md",
          "[transform:translate(var(--drawer-swipe-movement-x,0px),var(--drawer-swipe-movement-y,0px))] transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:duration-[350ms]",
          "data-[ending-style]:[transform:translateY(calc(100%+1rem))] data-[starting-style]:[transform:translateY(calc(100%+1rem))] md:data-[ending-style]:[transform:translateX(calc(100%+1rem))] md:data-[starting-style]:[transform:translateX(calc(100%+1rem))]",
          "motion-reduce:transition-opacity motion-reduce:duration-150 motion-reduce:data-[ending-style]:opacity-0 motion-reduce:data-[starting-style]:opacity-0 motion-reduce:data-[ending-style]:[transform:none] motion-reduce:data-[starting-style]:[transform:none]",
        ],
      },
    },
  }
);

function Drawer({
  onOpenChange,
  ...props
}: Omit<React.ComponentProps<typeof DrawerPrimitive.Root>, "onOpenChange"> & {
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      onOpenChange={(open) => {
        if (open && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        onOpenChange?.(open);
      }}
      {...props}
    />
  );
}

function DrawerTrigger({
  asChild = false,
  nativeButton,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof DrawerPrimitive.Trigger>>) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      nativeButton={nativeButton ?? !render}
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof DrawerPrimitive.Close>>) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function DrawerOverlay({
  className,
  motion = "animated",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop> & {
  motion?: DrawerMotion;
}) {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/50 opacity-100 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        motion === "instant" && "transition-none",
        className
      )}
      data-motion={motion}
      data-slot="drawer-overlay"
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  motion = "animated",
  overlayClassName,
  showOverlay = true,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup> &
  VariantProps<typeof drawerContentVariants> & {
    motion?: DrawerMotion;
    overlayClassName?: string;
    showOverlay?: boolean;
  }) {
  return (
    <DrawerPortal>
      {showOverlay ? (
        <DrawerOverlay className={overlayClassName} motion={motion} />
      ) : null}
      <DrawerPrimitive.Viewport data-slot="drawer-viewport">
        <DrawerPrimitive.Popup
          className={cn(
            drawerContentVariants({ variant }),
            motion === "instant" &&
              "transition-none motion-reduce:transition-none",
            className
          )}
          data-motion={motion}
          data-slot="drawer-content"
          data-variant={variant}
          {...props}
        >
          <div
            className={cn(
              "flex flex-1 flex-col overflow-auto",
              variant === "floating" && "contents"
            )}
          >
            {children}
          </div>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

function DrawerHandle({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-8 w-full shrink-0 cursor-grab items-center justify-center active:cursor-grabbing",
        className
      )}
      data-slot="drawer-handle"
      {...props}
    >
      {children ?? (
        <div
          className="h-1.5 w-12 rounded-full bg-muted-foreground/30"
          data-slot="drawer-handle-indicator"
        />
      )}
    </div>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[swipe-direction=down]/drawer-content:text-center group-data-[swipe-direction=up]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      )}
      data-slot="drawer-header"
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      data-slot="drawer-footer"
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("font-semibold text-foreground", className)}
      data-slot="drawer-title"
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
