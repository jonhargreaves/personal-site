"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { LucideMonitor } from "../../../../icons/index";

import { cn } from "../../../../lib/utils";

import { meetingTileScreenShareBadgeVariants } from "./tile-variants";

const SIGNAL_BARS = [1, 2, 3];

export interface MeetingTileScreenShareBadgeProps extends ComponentPropsWithoutRef<"div"> {
  readonly label?: ReactNode;
}

export function MeetingTileScreenShareBadge({
  className,
  label = "Sharing",
  ...props
}: MeetingTileScreenShareBadgeProps) {
  return (
    <div
      className={cn(meetingTileScreenShareBadgeVariants(), className)}
      data-slot="meeting-tile-screen-share-badge"
      {...props}
    >
      <LucideMonitor className="size-4" />
      {label}
    </div>
  );
}

export interface MeetingTileSignalIndicatorProps {
  readonly activeColor?: string;
  readonly className?: string;
  readonly strength?: number;
}

export function MeetingTileSignalIndicator({
  activeColor = "bg-emerald-500",
  className,
  strength = 3,
}: MeetingTileSignalIndicatorProps) {
  return (
    <div
      className={cn("flex items-end gap-[2px]", className)}
      data-slot="meeting-tile-signal-indicator"
    >
      {SIGNAL_BARS.map((bar) => (
        <div
          className={cn(
            "w-[2.5px] rounded-sm transition-colors",
            bar === 1 && "h-[6px]",
            bar === 2 && "h-[9px]",
            bar === 3 && "h-[12px]",
            bar <= strength ? activeColor : "bg-neutral-6"
          )}
          key={bar}
        />
      ))}
    </div>
  );
}
