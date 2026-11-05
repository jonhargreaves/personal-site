"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { buttonVariants } from "./button";
import { cn } from "../lib/utils";

import {
  backdropMotionClassName,
  popupMotionClassName,
} from "./primitive/popup-motion";
import { Slot } from "./primitive/slot";

type SlottableProps<T> = T & {
  asChild?: boolean;
};

type AlertDialogButtonProps<T> = SlottableProps<T> &
  Pick<VariantProps<typeof buttonVariants>, "size" | "variant">;

type AlertDialogSize = "default" | "sm";

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof AlertDialogPrimitive.Trigger>>) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  return (
    <AlertDialogPrimitive.Backdrop
      className={cn(
        backdropMotionClassName,
        "fixed inset-0 z-50 bg-black/50",
        className
      )}
      data-slot="alert-dialog-overlay"
      {...props}
    />
  );
}

/**
 * `size="sm"` is a compact confirmation: a narrower popup that keeps the
 * header centered and stacked, and gives footer actions equal widths. The
 * default size places media beside the title on wider screens.
 */
function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup> & {
  size?: AlertDialogSize;
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        className={cn(
          popupMotionClassName,
          "group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-lg border bg-background p-6 shadow-lg",
          size === "sm" ? "sm:max-w-sm" : "sm:max-w-lg",
          className
        )}
        data-size={size}
        data-slot="alert-dialog-content"
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid gap-2 text-center sm:group-data-[size=default]/alert-dialog-content:text-left",
        "has-data-[slot=alert-dialog-media]:justify-items-center",
        "sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-cols-[auto_minmax(0,1fr)] sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:justify-items-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:gap-x-4",
        className
      )}
      data-slot="alert-dialog-header"
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        "sm:group-data-[size=sm]/alert-dialog-content:*:flex-1",
        className
      )}
      data-slot="alert-dialog-footer"
      {...props}
    />
  );
}

const alertDialogMediaVariants = cva(
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 sm:group-data-[size=default]/alert-dialog-content:row-span-2 sm:group-data-[size=default]/alert-dialog-content:self-start",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        info: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/15 text-warning",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * An icon or small illustration placed first inside `AlertDialogHeader`. The
 * header centers it above the title on narrow screens and in `size="sm"`
 * dialogs, and lets it span the title and description on wider screens.
 */
function AlertDialogMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertDialogMediaVariants>) {
  return (
    <div
      aria-hidden="true"
      className={cn(alertDialogMediaVariants({ variant }), className)}
      data-slot="alert-dialog-media"
      data-variant={variant}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn(
        "text-balance font-semibold text-lg leading-snug group-data-[size=sm]/alert-dialog-content:text-base",
        className
      )}
      data-slot="alert-dialog-title"
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn(
        "text-pretty text-muted-foreground text-sm [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

function AlertDialogAction({
  asChild = false,
  className,
  render,
  size,
  variant = "default",
  ...props
}: AlertDialogButtonProps<
  React.ComponentProps<typeof AlertDialogPrimitive.Close>
>) {
  return (
    <AlertDialogPrimitive.Close
      className={cn(buttonVariants({ size, variant }), className)}
      data-slot="alert-dialog-action"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function AlertDialogCancel({
  asChild = false,
  className,
  render,
  size,
  variant = "outline",
  ...props
}: AlertDialogButtonProps<
  React.ComponentProps<typeof AlertDialogPrimitive.Close>
>) {
  return (
    <AlertDialogPrimitive.Close
      className={cn(buttonVariants({ size, variant }), className)}
      data-slot="alert-dialog-cancel"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogMediaVariants,
};
