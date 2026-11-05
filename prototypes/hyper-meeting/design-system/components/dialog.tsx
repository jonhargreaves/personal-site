"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";

import { LucideX } from "../icons/index";

import { cn } from "../lib/utils";

import {
  backdropMotionClassName,
  popupMotionClassName,
} from "./primitive/popup-motion";
import { Slot } from "./primitive/slot";

type SlottableProps<T> = T & {
  asChild?: boolean;
};

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof DialogPrimitive.Trigger>>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof DialogPrimitive.Close>>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        backdropMotionClassName,
        "fixed inset-0 z-50 bg-black/50",
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          popupMotionClassName,
          "fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100dvh-2rem)] w-full overflow-y-auto max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
          className
        )}
        data-slot="dialog-content"
        data-has-close-button={showCloseButton || undefined}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute top-1 right-1 flex size-10 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
            data-slot="dialog-close"
          >
            <LucideX />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-center sm:text-left [[data-has-close-button]>&]:pr-6",
        className
      )}
      data-slot="dialog-header"
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      data-slot="dialog-footer"
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-balance font-semibold text-lg leading-snug",
        className
      )}
      data-slot="dialog-title"
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-pretty text-muted-foreground text-sm", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
