"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../../lib/utils";

import {
  meetingShellTopBarVariants as meetingTopBarVariants,
  meetingShellTopBarSlotVariants as meetingTopBarSlotVariants,
} from "../../layouts/meeting-shell";
export { meetingTopBarVariants, meetingTopBarSlotVariants };

export type MeetingTopBarPrimitiveProps =
  React.ComponentPropsWithoutRef<"header"> &
    VariantProps<typeof meetingTopBarVariants> & {
      ref?: React.Ref<HTMLElement>;
    };

export function MeetingTopBarPrimitive({
  className,
  ref,
  variant,
  ...props
}: MeetingTopBarPrimitiveProps) {
  return (
    <header
      className={cn(meetingTopBarVariants({ variant }), className)}
      data-slot="meeting-top-bar"
      data-variant={variant ?? "default"}
      ref={ref}
      {...props}
    />
  );
}

export type MeetingTopBarSlotProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingTopBarSlotVariants> & {
    ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingTopBarSlot({
  className,
  placement,
  ref,
  ...props
}: MeetingTopBarSlotProps) {
  return (
    <div
      className={cn(meetingTopBarSlotVariants({ placement }), className)}
      data-placement={placement ?? "left"}
      data-slot="meeting-top-bar-slot"
      ref={ref}
      {...props}
    />
  );
}
