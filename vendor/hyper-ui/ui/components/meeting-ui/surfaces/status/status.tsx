"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import {
  HugeAlert02Solid,
  HugeUserMultiple02Duotone,
  LucideX,
} from "../../../../../icons/index";

import { LogoLoader } from "../../../brand/logo-loader";
import { Button } from "../../../button";
import { ButtonGroup } from "../../../button-group";
import {
  ErrorPage,
  ErrorPageActions,
  ErrorPageContent,
  ErrorPageDescription,
  ErrorPageEyebrow,
  ErrorPageHeader,
  ErrorPageIcon,
  ErrorPageTitle,
} from "../../../error-page";
import { cn } from "../../../../lib/utils";

export const meetingLoadingRootVariants = cva(
  "flex h-full items-center justify-center px-6 py-10",
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

export const meetingErrorRootVariants = cva(
  "flex h-full flex-col items-center justify-center gap-4 p-6 text-center",
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

export const meetingStateCardRootVariants = cva(
  "flex h-full items-center justify-center p-6",
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

export const meetingStateCardSurfaceVariants = cva(
  "max-w-lg rounded-2xl border bg-card p-6 text-center shadow-sm",
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

export const meetingWaitingRoomNotificationVariants = cva(
  "pointer-events-auto w-[320px] max-w-[calc(100vw-2rem)] rounded-lg border bg-popover p-3 text-popover-foreground shadow-sm",
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

export type MeetingLoadingProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> &
  VariantProps<typeof meetingLoadingRootVariants> & {
    readonly label?: string;
    /** Decorative loader; defaults to the animated Hyper mark. */
    readonly loader?: React.ReactNode;
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingLoading({
  className,
  label = "Joining meeting...",
  loader = <LogoLoader decorative size={40} variant="trace" />,
  ref,
  variant,
  ...props
}: MeetingLoadingProps) {
  return (
    <div
      aria-live="polite"
      className={cn(meetingLoadingRootVariants({ variant }), className)}
      data-slot="meeting-loading"
      ref={ref}
      role="status"
      {...props}
    >
      <div
        className="flex flex-col items-center gap-4 text-center"
        data-slot="meeting-loading-content"
      >
        <div data-slot="meeting-loading-spinner">
          {/* This root owns the live region, so the loader is decoration. */}
          {loader}
        </div>
        <p
          className="font-medium text-muted-foreground text-sm"
          data-slot="meeting-loading-label"
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export type MeetingPendingShellProps = MeetingLoadingProps;

export function MeetingPendingShell(props: MeetingPendingShellProps) {
  return <MeetingLoading {...props} />;
}

export type MeetingErrorProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> &
  VariantProps<typeof meetingErrorRootVariants> & {
    readonly actionLabel?: string;
    readonly fallbackMessage?: string;
    readonly error: unknown;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly resetErrorBoundary: () => void;
    readonly title?: string;
  };

export function MeetingError({
  actionLabel = "Try again",
  className,
  error: _error,
  fallbackMessage = "Something went wrong. Please try again.",
  ref,
  resetErrorBoundary,
  title = "Unable to load meeting",
  variant,
  ...props
}: MeetingErrorProps) {
  return (
    <div
      className={cn(meetingErrorRootVariants({ variant }), className)}
      data-slot="meeting-error"
      ref={ref}
      {...props}
    >
      <ErrorPage>
        <ErrorPageContent>
          <ErrorPageIcon>
            <HugeAlert02Solid />
          </ErrorPageIcon>
          <ErrorPageHeader>
            <ErrorPageEyebrow>Unexpected error</ErrorPageEyebrow>
            <ErrorPageTitle data-slot="meeting-error-title">
              {title}
            </ErrorPageTitle>
            <ErrorPageDescription data-slot="meeting-error-message">
              {fallbackMessage}
            </ErrorPageDescription>
          </ErrorPageHeader>
          <ErrorPageActions>
            <Button
              data-slot="meeting-error-action"
              onClick={resetErrorBoundary}
              type="button"
            >
              {actionLabel}
            </Button>
          </ErrorPageActions>
        </ErrorPageContent>
      </ErrorPage>
    </div>
  );
}

export type MeetingStateCardProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingStateCardRootVariants> & {
    readonly cardClassName?: string;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly title: string;
  };

export function MeetingStateCard({
  cardClassName,
  children,
  className,
  ref,
  title,
  variant,
  ...props
}: MeetingStateCardProps) {
  return (
    <div
      className={cn(meetingStateCardRootVariants({ variant }), className)}
      data-slot="meeting-state-card-root"
      ref={ref}
      {...props}
    >
      <div
        className={cn(
          meetingStateCardSurfaceVariants({ variant }),
          cardClassName
        )}
        data-slot="meeting-state-card"
      >
        <h1
          className="font-semibold text-2xl"
          data-slot="meeting-state-card-title"
        >
          {title}
        </h1>
        <div
          className="mt-3 text-muted-foreground"
          data-slot="meeting-state-card-content"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export type MeetingDeniedStateProps = Omit<
  MeetingStateCardProps,
  "children" | "title"
> & {
  readonly children?: React.ReactNode;
  readonly title?: string;
};

export function MeetingDeniedState({
  children = "You have been denied access to this meeting.",
  title = "Access denied",
  ...props
}: MeetingDeniedStateProps) {
  return (
    <MeetingStateCard title={title} {...props}>
      <p>{children}</p>
    </MeetingStateCard>
  );
}

export type MeetingWaitingRoomStateProps = Omit<
  MeetingStateCardProps,
  "children" | "title"
> & {
  readonly children?: React.ReactNode;
  readonly title?: string;
};

export function MeetingWaitingRoomState({
  children = "The host has been notified of your request to join.",
  title = "Waiting for host",
  ...props
}: MeetingWaitingRoomStateProps) {
  return (
    <MeetingStateCard title={title} {...props}>
      <p>{children}</p>
    </MeetingStateCard>
  );
}

export type MeetingWaitingRoomToastActionsProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  readonly admitLabel?: string;
  readonly onAdmit: () => void;
  readonly onOpenPeople: () => void;
  readonly openPeopleLabel?: string;
};

export function MeetingWaitingRoomToastActions({
  admitLabel = "Let in",
  className,
  onAdmit,
  onOpenPeople,
  openPeopleLabel = "Open People panel",
  ...props
}: MeetingWaitingRoomToastActionsProps) {
  return (
    <ButtonGroup
      className={cn("ml-auto shrink-0", className)}
      data-slot="meeting-waiting-room-toast-actions"
      {...props}
    >
      <Button onClick={onAdmit} size="sm" type="button" variant="outline">
        {admitLabel}
      </Button>
      <Button
        aria-label={openPeopleLabel}
        onClick={onOpenPeople}
        size="sm"
        type="button"
        variant="outline"
      >
        <HugeUserMultiple02Duotone className="size-4.5" />
      </Button>
    </ButtonGroup>
  );
}

export type MeetingWaitingRoomNotificationProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "title"
> &
  VariantProps<typeof meetingWaitingRoomNotificationVariants> & {
    readonly description?: React.ReactNode;
    readonly dismissLabel?: string;
    readonly onDismiss: () => void;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly title: React.ReactNode;
  };

export function MeetingWaitingRoomNotification({
  className,
  description = "Review the waiting room.",
  dismissLabel = "Dismiss notification",
  onDismiss,
  ref,
  title,
  variant,
  ...props
}: MeetingWaitingRoomNotificationProps) {
  return (
    <div
      className={cn(
        meetingWaitingRoomNotificationVariants({ variant }),
        className
      )}
      data-slot="meeting-waiting-room-notification"
      ref={ref}
      {...props}
    >
      <div
        className="flex items-start justify-between gap-3"
        data-slot="meeting-waiting-room-notification-content"
      >
        <div
          className="space-y-1"
          data-slot="meeting-waiting-room-notification-copy"
        >
          <p
            className="font-medium text-sm"
            data-slot="meeting-waiting-room-notification-title"
          >
            {title}
          </p>
          {description ? (
            <p
              className="text-muted-foreground text-xs"
              data-slot="meeting-waiting-room-notification-description"
            >
              {description}
            </p>
          ) : null}
        </div>
        <Button
          aria-label={dismissLabel}
          data-slot="meeting-waiting-room-notification-dismiss"
          onClick={onDismiss}
          size="icon"
          type="button"
          variant="ghost"
        >
          <LucideX className="size-4" />
        </Button>
      </div>
    </div>
  );
}
