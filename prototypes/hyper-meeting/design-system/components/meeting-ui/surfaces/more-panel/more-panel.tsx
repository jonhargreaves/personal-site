"use client";

import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideX,
} from "../../../../icons/index";

import { Button } from "../../../button";
import { cn } from "../../../../lib/utils";

export type MeetingMorePanelGroup =
  | "coming-soon"
  | "meeting"
  | "most-used"
  | "plan";

const meetingMorePanelSectionVariants = cva("border-b p-2 last:border-b-0", {
  variants: {
    group: {
      "coming-soon": "",
      meeting:
        "[&_[data-slot=meeting-more-panel-item-icon]]:text-emerald-700 dark:[&_[data-slot=meeting-more-panel-item-icon]]:text-emerald-300",
      "most-used":
        "[&_[data-slot=meeting-more-panel-item-icon]]:text-accent-foreground",
      plan: "[&_[data-slot=meeting-more-panel-item-icon]]:text-amber-700 dark:[&_[data-slot=meeting-more-panel-item-icon]]:text-amber-300",
    },
  },
});

export type MeetingMorePanelRootProps = ComponentPropsWithoutRef<"div">;

export function MeetingMorePanelRoot({
  className,
  ...props
}: MeetingMorePanelRootProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col bg-background",
        className
      )}
      data-slot="meeting-more-panel-root"
      {...props}
    />
  );
}

export type MeetingMorePanelHeaderProps = ComponentPropsWithoutRef<"header"> & {
  readonly leadingAction?: ReactNode;
};

export function MeetingMorePanelHeader({
  children,
  className,
  leadingAction,
  ...props
}: MeetingMorePanelHeaderProps) {
  return (
    <header
      className={cn(
        "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b p-2",
        leadingAction &&
          "grid-cols-[auto_minmax(0,1fr)_auto] [&_[data-slot=meeting-more-panel-title]]:pl-0",
        className
      )}
      data-slot="meeting-more-panel-header"
      {...props}
    >
      {leadingAction}
      {children}
    </header>
  );
}

export type MeetingMorePanelTitleProps = ComponentPropsWithoutRef<"h2">;

export function MeetingMorePanelTitle({
  className,
  ...props
}: MeetingMorePanelTitleProps) {
  return (
    <h2
      className={cn("px-2 font-semibold text-base", className)}
      data-slot="meeting-more-panel-title"
      {...props}
    />
  );
}

export type MeetingMorePanelCloseProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children"
>;

export type MeetingMorePanelBackProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children"
>;

export function MeetingMorePanelBack({
  "aria-label": ariaLabel = "Back to More",
  className,
  ...props
}: MeetingMorePanelBackProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      data-slot="meeting-more-panel-back"
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      <LucideChevronLeft aria-hidden="true" className="size-4" />
    </Button>
  );
}

export function MeetingMorePanelClose({
  "aria-label": ariaLabel = "Close more options",
  className,
  ...props
}: MeetingMorePanelCloseProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      data-slot="meeting-more-panel-close"
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      <LucideX aria-hidden="true" className="size-4" />
    </Button>
  );
}

export type MeetingMorePanelContentProps = ComponentPropsWithoutRef<"div">;

export function MeetingMorePanelContent({
  className,
  ...props
}: MeetingMorePanelContentProps) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto", className)}
      data-slot="meeting-more-panel-content"
      {...props}
    />
  );
}

export type MeetingMorePanelSectionProps =
  ComponentPropsWithoutRef<"section"> & {
    readonly group: MeetingMorePanelGroup;
  };

export function MeetingMorePanelSection({
  className,
  group,
  ...props
}: MeetingMorePanelSectionProps) {
  return (
    <section
      className={cn(meetingMorePanelSectionVariants({ group }), className)}
      data-group={group}
      data-slot="meeting-more-panel-section"
      {...props}
    />
  );
}

export type MeetingMorePanelSectionTitleProps = ComponentPropsWithoutRef<"h3">;

export function MeetingMorePanelSectionTitle({
  className,
  ...props
}: MeetingMorePanelSectionTitleProps) {
  return (
    <h3
      className={cn(
        "mb-1.5 px-2 py-1.5 font-medium text-muted-foreground text-xs",
        className
      )}
      data-slot="meeting-more-panel-section-title"
      {...props}
    />
  );
}

export type MeetingMorePanelItemsProps = ComponentPropsWithoutRef<"div">;

export function MeetingMorePanelItems({
  className,
  ...props
}: MeetingMorePanelItemsProps) {
  return (
    <div
      className={cn("space-y-1", className)}
      data-slot="meeting-more-panel-items"
      {...props}
    />
  );
}

export type MeetingMorePanelItemProps = ComponentPropsWithoutRef<typeof Button>;

export function MeetingMorePanelItem({
  asChild,
  className,
  type,
  ...props
}: MeetingMorePanelItemProps) {
  return (
    <Button
      asChild={asChild}
      // Immediate hover feedback prevents fading highlights between adjacent rows.
      className={cn(
        "h-auto min-h-12 w-full justify-start gap-3 rounded-lg px-2 py-2 text-left whitespace-normal transition-none disabled:cursor-default disabled:opacity-100 disabled:[&_[data-slot=meeting-more-panel-item-icon]]:opacity-60 disabled:[&_[data-slot=meeting-more-panel-item-title]]:text-muted-foreground aria-disabled:opacity-100 aria-disabled:[&_[data-slot=meeting-more-panel-item-icon]]:opacity-60 aria-disabled:[&_[data-slot=meeting-more-panel-item-title]]:text-muted-foreground",
        className
      )}
      data-slot="meeting-more-panel-item"
      type={asChild ? undefined : (type ?? "button")}
      variant="ghost"
      {...props}
    />
  );
}

export type MeetingMorePanelItemIconProps = ComponentPropsWithoutRef<"span">;

export function MeetingMorePanelItemIcon({
  className,
  ...props
}: MeetingMorePanelItemIconProps) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xs border border-border bg-foreground/4 text-muted-foreground [&_svg]:size-4.5",
        className
      )}
      data-slot="meeting-more-panel-item-icon"
      {...props}
    />
  );
}

export type MeetingMorePanelItemContentProps = ComponentPropsWithoutRef<"span">;

export function MeetingMorePanelItemContent({
  className,
  ...props
}: MeetingMorePanelItemContentProps) {
  return (
    <span
      className={cn("min-w-0 flex-1", className)}
      data-slot="meeting-more-panel-item-content"
      {...props}
    />
  );
}

export type MeetingMorePanelItemTitleProps = ComponentPropsWithoutRef<"span">;

export function MeetingMorePanelItemTitle({
  className,
  ...props
}: MeetingMorePanelItemTitleProps) {
  return (
    <span
      className={cn("block font-medium text-sm", className)}
      data-slot="meeting-more-panel-item-title"
      {...props}
    />
  );
}

export type MeetingMorePanelItemDescriptionProps =
  ComponentPropsWithoutRef<"span">;

export function MeetingMorePanelItemDescription({
  className,
  ...props
}: MeetingMorePanelItemDescriptionProps) {
  return (
    <span
      className={cn(
        "mt-0.5 block font-normal text-muted-foreground text-xs leading-snug",
        className
      )}
      data-slot="meeting-more-panel-item-description"
      {...props}
    />
  );
}

export type MeetingMorePanelItemStatusProps =
  ComponentPropsWithoutRef<"span"> & {
    readonly children?: ReactNode;
  };

export function MeetingMorePanelItemStatus({
  children = "Coming soon",
  className,
  ...props
}: MeetingMorePanelItemStatusProps) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full bg-muted px-2 py-1 font-medium text-[10px] text-muted-foreground",
        className
      )}
      data-slot="meeting-more-panel-item-status"
      {...props}
    >
      {children}
    </span>
  );
}

export type MeetingMorePanelItemTrailingProps =
  ComponentPropsWithoutRef<"span">;

export function MeetingMorePanelItemTrailing({
  className,
  ...props
}: MeetingMorePanelItemTrailingProps) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center p-2", className)}
      data-slot="meeting-more-panel-item-trailing"
      {...props}
    />
  );
}

export type MeetingMorePanelItemChevronProps = ComponentPropsWithoutRef<
  typeof LucideChevronRight
>;

export function MeetingMorePanelItemChevron({
  className,
  ...props
}: MeetingMorePanelItemChevronProps) {
  return (
    <LucideChevronRight
      aria-hidden="true"
      className={cn("size-4 shrink-0 text-muted-foreground/60", className)}
      data-slot="meeting-more-panel-item-chevron"
      {...props}
    />
  );
}
