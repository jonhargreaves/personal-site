"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { useIsMobile } from "../../../../hooks/use-mobile";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../button";

export const MEETING_CALL_STAGE_MAIN_HORIZONTAL_PADDING = 32;

export const meetingCallStageRootVariants = cva(
  "relative flex h-full min-w-0",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingCallStageMainVariants = cva("min-w-0 flex-1 px-4", {
  variants: {
    isMobile: {
      false: "",
      true: "pt-4",
    },
    variant: {
      default: "",
      fullBleed: "px-0",
    },
  },
  defaultVariants: {
    isMobile: false,
    variant: "default",
  },
  compoundVariants: [
    {
      isMobile: true,
      variant: "fullBleed",
      className: "pt-0",
    },
  ],
});

export const meetingCallContentFrameVariants = cva("h-full", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const meetingCallEmptyStateRootVariants = cva(
  "flex h-full flex-1 items-center justify-center p-6",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingCallEmptyStateCardVariants = cva(
  "max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingTileGridViewportVariants = cva(
  "relative h-full w-full overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type MeetingCallStageRootProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingCallStageRootVariants> & {
    ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingCallStageRoot({
  className,
  ref,
  variant,
  ...props
}: MeetingCallStageRootProps) {
  return (
    <div
      className={cn(meetingCallStageRootVariants({ variant }), className)}
      data-slot="meeting-call-stage-root"
      ref={ref}
      {...props}
    />
  );
}

export type MeetingCallStageMainProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingCallStageMainVariants> & {
    ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingCallStageMain({
  className,
  isMobile,
  ref,
  variant,
  ...props
}: MeetingCallStageMainProps) {
  const detectedMobile = useIsMobile();

  return (
    <div
      className={cn(
        meetingCallStageMainVariants({
          isMobile: isMobile ?? detectedMobile,
          variant,
        }),
        className
      )}
      data-mobile={(isMobile ?? detectedMobile) ? "true" : "false"}
      data-slot="meeting-call-stage-main"
      data-variant={variant ?? "default"}
      ref={ref}
      {...props}
    />
  );
}

export type MeetingCallContentFrameProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof meetingCallContentFrameVariants> & {
      ref?: React.Ref<HTMLDivElement>;
    };

export function MeetingCallContentFrame({
  className,
  ref,
  variant,
  ...props
}: MeetingCallContentFrameProps) {
  return (
    <div
      className={cn(meetingCallContentFrameVariants({ variant }), className)}
      data-slot="meeting-call-content-frame"
      ref={ref}
      {...props}
    />
  );
}

export type MeetingCallEmptyStateProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingCallEmptyStateRootVariants> & {
    readonly description?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    readonly title?: React.ReactNode;
  };

export function MeetingCallEmptyState({
  className,
  description = "Video tiles will appear here as people join the meeting.",
  ref,
  title = "Waiting for participants",
  variant,
  ...props
}: MeetingCallEmptyStateProps) {
  return (
    <div
      className={cn(meetingCallEmptyStateRootVariants({ variant }), className)}
      data-slot="meeting-call-empty-state"
      ref={ref}
      {...props}
    >
      <div className={meetingCallEmptyStateCardVariants({ variant })}>
        <h2 className="font-semibold text-xl">{title}</h2>
        <p className="mt-2 text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

export type MeetingTileGridViewportProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof meetingTileGridViewportVariants> & {
      ref?: React.Ref<HTMLDivElement>;
    };

export function MeetingTileGridViewport({
  className,
  ref,
  variant,
  ...props
}: MeetingTileGridViewportProps) {
  return (
    <div
      className={cn(meetingTileGridViewportVariants({ variant }), className)}
      data-slot="meeting-tile-grid-viewport"
      ref={ref}
      {...props}
    />
  );
}

export type MeetingTileGridPaginationProps =
  React.ComponentPropsWithoutRef<"div"> & {
    readonly canGoNext: boolean;
    readonly canGoPrevious: boolean;
    readonly currentPage: number;
    readonly onNext: () => void;
    readonly onPrevious: () => void;
    readonly totalPages: number;
  };

export function MeetingTileGridPagination({
  canGoNext,
  canGoPrevious,
  className,
  currentPage,
  onNext,
  onPrevious,
  totalPages,
  ...props
}: MeetingTileGridPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-3 flex justify-center",
        className
      )}
      data-slot="meeting-tile-grid-pagination"
      {...props}
    >
      <div className="rounded-full bg-background/90 px-2 py-1 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2">
          <Button
            disabled={!canGoPrevious}
            onClick={onPrevious}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <span className="text-muted-foreground text-xs">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            disabled={!canGoNext}
            onClick={onNext}
            size="sm"
            variant="ghost"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
