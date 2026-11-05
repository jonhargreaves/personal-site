"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

import { SurfaceThemeContext } from "./surface-theme";

/** Available control-bar width below which the standard meeting uses mobile controls. */
export const MEETING_SHELL_CONTROLS_BREAKPOINT = 1100;

const meetingShellVariants = cva(
  "dark relative flex w-full flex-col overflow-hidden bg-neutral-950 text-foreground",
  {
    variants: { height: { viewport: "h-svh", fill: "h-full" } },
    defaultVariants: { height: "viewport" },
  }
);

export const meetingShellTopBarVariants = cva(
  "relative z-20 grid h-16 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-transparent bg-neutral-950 px-4 text-white sm:gap-4 sm:px-5",
  {
    variants: {
      variant: {
        default: "",
        fullBleed:
          "h-auto border-0 bg-gradient-to-b from-black/70 via-black/35 to-transparent px-3 pt-3 pb-12 sm:px-5",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export const meetingShellTopBarSlotVariants = cva(
  "pointer-events-auto flex h-8 min-w-0 items-center gap-4",
  {
    variants: {
      placement: {
        left: "col-start-1 justify-start",
        center: "sr-only col-start-2 justify-center sm:not-sr-only sm:flex",
        right: "col-start-3 justify-end",
      },
    },
    defaultVariants: { placement: "left" },
  }
);

export const meetingShellStageVariants = cva(
  "relative min-h-0 min-w-0 flex-1",
  {
    variants: { inset: { default: "px-4", none: "" } },
    defaultVariants: { inset: "default" },
  }
);

export const meetingShellBottomBarVariants = cva(
  "flex shrink-0 items-center bg-neutral-950 p-4 md:h-[92px]",
  {
    variants: {
      variant: {
        default: "",
        fullBleed:
          "h-auto bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pt-14 pb-5 md:h-auto",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export const meetingShellBottomBarContentVariants = cva(
  "w-full min-w-0 items-center",
  {
    variants: {
      layout: {
        desktop: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
        mobile: "flex justify-center",
      },
    },
    defaultVariants: { layout: "desktop" },
  }
);

export const meetingShellBottomBarSlotVariants = cva(
  "flex min-w-0 flex-nowrap items-center gap-1",
  {
    variants: {
      placement: {
        left: "col-start-1 justify-self-start",
        center: "col-start-2 justify-self-center",
        right: "col-start-3 justify-self-end",
      },
    },
    defaultVariants: { placement: "center" },
  }
);

export type MeetingShellProps = React.ComponentProps<"div"> &
  VariantProps<typeof meetingShellVariants>;
function MeetingShell({ className, height, ...props }: MeetingShellProps) {
  return (
    <SurfaceThemeContext value="dark">
      <div
        className={cn(meetingShellVariants({ height }), className)}
        data-height={height ?? "viewport"}
        data-slot="meeting-shell"
        {...props}
      />
    </SurfaceThemeContext>
  );
}

export type MeetingShellTopBarProps = React.ComponentProps<"header"> &
  VariantProps<typeof meetingShellTopBarVariants>;
function MeetingShellTopBar({
  className,
  variant,
  ...props
}: MeetingShellTopBarProps) {
  return (
    <header
      className={cn(meetingShellTopBarVariants({ variant }), className)}
      data-slot="meeting-shell-top-bar"
      data-variant={variant ?? "default"}
      {...props}
    />
  );
}

export type MeetingShellTopBarSlotProps = React.ComponentProps<"div"> &
  VariantProps<typeof meetingShellTopBarSlotVariants>;
function MeetingShellTopBarSlot({
  className,
  placement,
  ...props
}: MeetingShellTopBarSlotProps) {
  return (
    <div
      className={cn(meetingShellTopBarSlotVariants({ placement }), className)}
      data-slot="meeting-shell-top-bar-slot"
      data-placement={placement ?? "left"}
      {...props}
    />
  );
}

export type MeetingShellStageProps = React.ComponentProps<"div"> &
  VariantProps<typeof meetingShellStageVariants>;
function MeetingShellStage({
  className,
  inset,
  ...props
}: MeetingShellStageProps) {
  return (
    <div
      className={cn(meetingShellStageVariants({ inset }), className)}
      data-slot="meeting-shell-stage"
      data-inset={inset ?? "default"}
      {...props}
    />
  );
}

export type MeetingShellBottomBarProps = React.ComponentProps<"footer"> &
  VariantProps<typeof meetingShellBottomBarVariants>;
function MeetingShellBottomBar({
  className,
  variant,
  ...props
}: MeetingShellBottomBarProps) {
  return (
    <footer
      className={cn(meetingShellBottomBarVariants({ variant }), className)}
      data-slot="meeting-shell-bottom-bar"
      data-variant={variant ?? "default"}
      {...props}
    />
  );
}

export type MeetingShellBottomBarContentProps = React.ComponentProps<"div"> &
  VariantProps<typeof meetingShellBottomBarContentVariants>;
function MeetingShellBottomBarContent({
  className,
  layout,
  ...props
}: MeetingShellBottomBarContentProps) {
  return (
    <div
      className={cn(
        meetingShellBottomBarContentVariants({ layout }),
        className
      )}
      data-slot="meeting-shell-bottom-bar-content"
      data-layout={layout ?? "desktop"}
      {...props}
    />
  );
}

export type MeetingShellBottomBarSlotProps = React.ComponentProps<"div"> &
  VariantProps<typeof meetingShellBottomBarSlotVariants>;
function MeetingShellBottomBarSlot({
  className,
  placement,
  ...props
}: MeetingShellBottomBarSlotProps) {
  return (
    <div
      className={cn(
        meetingShellBottomBarSlotVariants({ placement }),
        className
      )}
      data-slot="meeting-shell-bottom-bar-slot"
      data-placement={placement ?? "center"}
      {...props}
    />
  );
}

/** Optional overlay controls. Standard meeting controls belong in BottomBar. */
function MeetingShellChrome({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center",
        className
      )}
      data-slot="meeting-shell-chrome"
      {...props}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

export {
  MeetingShell,
  MeetingShellChrome,
  MeetingShellStage,
  MeetingShellTopBar,
  MeetingShellTopBarSlot,
  MeetingShellBottomBar,
  MeetingShellBottomBarContent,
  MeetingShellBottomBarSlot,
  meetingShellVariants,
};
