import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { Button, type ButtonProps } from "./button";
import { cn } from "../lib/utils";

import { Slot } from "./primitive/slot";

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-lg border bg-card text-card-foreground outline-none transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 has-[[data-slot=attachment-trigger][data-disabled=true]]:opacity-50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-28 flex-col",
      },
      size: {
        default:
          "gap-2.5 text-sm has-[[data-slot=attachment-content]]:px-2.5 has-[[data-slot=attachment-content]]:py-2 has-[[data-slot=attachment-media]]:p-2",
        sm: "gap-2 text-xs has-[[data-slot=attachment-content]]:px-2 has-[[data-slot=attachment-content]]:py-1.5 has-[[data-slot=attachment-media]]:p-1.5",
        xs: "gap-1.5 rounded-md text-xs has-[[data-slot=attachment-content]]:px-1.5 has-[[data-slot=attachment-content]]:py-1 has-[[data-slot=attachment-media]]:p-1",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
    },
  }
);

function Attachment({
  className,
  orientation = "horizontal",
  size = "default",
  state = "done",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "done" | "error" | "idle" | "processing" | "uploading";
  }) {
  return (
    <div
      className={cn(attachmentVariants({ orientation, size }), className)}
      data-orientation={orientation}
      data-size={size}
      data-slot="attachment"
      data-state={state}
      {...props}
    />
  );
}

function AttachmentAction({
  className,
  size = "icon",
  type = "button",
  variant = "ghost",
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn("relative z-20 size-8", className)}
      data-slot="attachment-action"
      size={size}
      type={type}
      variant={variant}
      {...props}
    />
  );
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-2 group-data-[orientation=vertical]/attachment:right-2",
        className
      )}
      data-slot="attachment-actions"
      {...props}
    />
  );
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:w-full group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      data-slot="attachment-content"
      {...props}
    />
  );
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "mt-0.5 block max-w-full min-w-0 truncate text-muted-foreground text-xs group-data-[state=error]/attachment:text-destructive/80",
        className
      )}
      data-slot="attachment-description"
      {...props}
    />
  );
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-1 flex min-w-0 snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain px-1 py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className
      )}
      data-slot="attachment-group"
      {...props}
    />
  );
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 [&_img]:aspect-square [&_img]:w-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
);

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      className={cn(attachmentMediaVariants({ variant }), className)}
      data-slot="attachment-media"
      data-variant={variant}
      {...props}
    />
  );
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
        className
      )}
      data-slot="attachment-title"
      {...props}
    />
  );
}

function AttachmentTrigger({
  asChild = false,
  className,
  disabled = false,
  onClick,
  onKeyDown,
  tabIndex,
  type,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  if (asChild) {
    return (
      <Slot
        aria-disabled={disabled || undefined}
        className={cn(
          "absolute inset-0 z-10 rounded-[inherit] outline-none",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        data-disabled={disabled || undefined}
        data-slot="attachment-trigger"
        onClick={
          disabled
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : onClick
        }
        onKeyDown={
          disabled
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : onKeyDown
        }
        tabIndex={disabled ? -1 : tabIndex}
        {...props}
      />
    );
  }

  return (
    <button
      className={cn(
        "absolute inset-0 z-10 rounded-[inherit] outline-none",
        className
      )}
      data-disabled={disabled || undefined}
      data-slot="attachment-trigger"
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      type={type ?? "button"}
      {...props}
    />
  );
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  attachmentMediaVariants,
  attachmentVariants,
};
