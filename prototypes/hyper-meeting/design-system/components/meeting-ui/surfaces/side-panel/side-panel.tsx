"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { LucideX } from "../../../../icons/index";

import { Button } from "../../../button";
import { Skeleton } from "../../../skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../tabs";
import { cn } from "../../../../lib/utils";

import type { MeetingPanelId } from "../../runtime/index";
import {
  MEETING_SIDE_PANEL_DESKTOP_EDGE_INSET,
  MEETING_SIDE_PANEL_TRANSITION_EASING,
  MEETING_SIDE_PANEL_TRANSITION_MS,
  type MeetingSidePanelTabId,
} from "./side-panel-constants";
import {
  getMeetingSidePanelTitle,
  useMeetingSidePanelPresence,
} from "./side-panel-state";

export const meetingSidePanelOuterVariants = cva(
  "relative box-border shrink-0 overflow-hidden bg-neutral-950",
  {
    variants: {
      open: {
        false: "pointer-events-none p-0",
        true: "p-4",
      },
      resizing: {
        false: "transition-[width] motion-reduce:transition-none",
        true: "transition-none",
      },
    },
    defaultVariants: {
      open: false,
      resizing: false,
    },
  }
);

export const meetingSidePanelInnerVariants = cva(
  "h-full transition-[opacity,transform] motion-reduce:transition-none",
  {
    variants: {
      open: {
        false: "translate-x-2 opacity-0",
        true: "translate-x-0 opacity-100",
      },
    },
    defaultVariants: {
      open: false,
    },
  }
);

export const meetingSidePanelShellVariants = cva(
  "flex h-full flex-col overflow-clip rounded-lg border border-border bg-popover text-popover-foreground shadow-xs dark:bg-background",
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

export const meetingSidePanelHeaderVariants = cva(
  "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b p-2",
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

export type MeetingSidePanelRootProps =
  React.ComponentPropsWithoutRef<"aside"> &
    VariantProps<typeof meetingSidePanelOuterVariants> & {
      readonly activePanel: MeetingPanelId | null;
      readonly isMobile: boolean;
      readonly onResizeStart?: React.PointerEventHandler<HTMLButtonElement>;
      readonly ref?: React.Ref<HTMLElement>;
      readonly sidebarWidth: number;
    };

export function MeetingSidePanelRoot({
  activePanel,
  children,
  className,
  isMobile,
  onResizeStart,
  ref,
  resizing = false,
  sidebarWidth,
  ...props
}: MeetingSidePanelRootProps) {
  const isOpen = activePanel !== null;
  const sidebarReservedWidth =
    sidebarWidth + MEETING_SIDE_PANEL_DESKTOP_EDGE_INSET * 2;
  const hasMountedChildren =
    children !== null && children !== undefined && children !== false;

  if (!isOpen && isMobile && !hasMountedChildren) {
    return null;
  }

  // Keep one DOM hierarchy at every breakpoint so open panels, drafts, and
  // message history remain mounted when the viewer switches device sizes.
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        isMobile
          ? [
              "absolute inset-2 z-20 transition-[opacity,transform] motion-reduce:transition-none",
              isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            ]
          : ["block", meetingSidePanelOuterVariants({ open: isOpen, resizing })],
        className
      )}
      data-slot={isMobile ? "meeting-side-panel-mobile" : "meeting-side-panel-root"}
      ref={ref}
      {...props}
      style={{
        ...props.style,
        transitionDuration: !isMobile && resizing ? undefined : `${MEETING_SIDE_PANEL_TRANSITION_MS}ms`,
        transitionTimingFunction: !isMobile && resizing ? undefined : MEETING_SIDE_PANEL_TRANSITION_EASING,
        width: isMobile ? undefined : isOpen ? `${sidebarReservedWidth}px` : "0px",
      }}
    >
      {!isMobile && isOpen && onResizeStart ? (
        <MeetingSidePanelResizeHandle onPointerDown={onResizeStart} />
      ) : null}
      <div
        key="panel-content"
        className={isMobile ? "h-full" : meetingSidePanelInnerVariants({ open: isOpen })}
        data-slot="meeting-side-panel-inner"
        style={{
          transitionDuration: `${MEETING_SIDE_PANEL_TRANSITION_MS}ms`,
          transitionTimingFunction: MEETING_SIDE_PANEL_TRANSITION_EASING,
          width: isMobile ? "100%" : `${sidebarWidth}px`,
          height: "100%",
        }}
      >
        {children}
      </div>
    </aside>
  );
}

export type MeetingSidePanelShellProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingSidePanelShellVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingSidePanelShell({
  className,
  ref,
  variant,
  ...props
}: MeetingSidePanelShellProps) {
  return (
    <div
      className={cn(meetingSidePanelShellVariants({ variant }), className)}
      data-slot="meeting-side-panel-shell"
      ref={ref}
      {...props}
    />
  );
}

export type MeetingSidePanelHeaderProps =
  React.ComponentPropsWithoutRef<"header"> &
    VariantProps<typeof meetingSidePanelHeaderVariants> & {
      readonly leadingAction?: React.ReactNode;
      readonly onClose: () => void;
      readonly ref?: React.Ref<HTMLElement>;
      readonly title: string;
    };

export function MeetingSidePanelHeader({
  className,
  leadingAction,
  onClose,
  ref,
  title,
  variant,
  ...props
}: MeetingSidePanelHeaderProps) {
  return (
    <header
      className={cn(
        meetingSidePanelHeaderVariants({ variant }),
        leadingAction && "grid-cols-[auto_minmax(0,1fr)_auto]",
        className
      )}
      data-slot="meeting-side-panel-header"
      ref={ref}
      {...props}
    >
      {leadingAction}
      <h2
        className={cn("px-2 font-semibold text-base", leadingAction && "pl-0")}
      >
        {title}
      </h2>

      <MeetingSidePanelCloseButton onClick={onClose} />
    </header>
  );
}

export type MeetingSidePanelCloseButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children"
> & {
  readonly ref?: React.Ref<HTMLButtonElement>;
};

export function MeetingSidePanelCloseButton({
  "aria-label": ariaLabel = "Close sidebar",
  className,
  ref,
  ...props
}: MeetingSidePanelCloseButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      data-slot="meeting-side-panel-close"
      ref={ref}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      <LucideX aria-hidden="true" className="size-4" />
    </Button>
  );
}

export type MeetingSidePanelResizeHandleProps =
  React.ComponentPropsWithoutRef<"button"> & {
    readonly ref?: React.Ref<HTMLButtonElement>;
  };

export function MeetingSidePanelResizeHandle({
  className,
  ref,
  ...props
}: MeetingSidePanelResizeHandleProps) {
  return (
    <button
      aria-label="Resize sidebar"
      className={cn(
        "group absolute inset-y-4 left-0 flex w-3 -translate-x-1/2 cursor-col-resize touch-none select-none items-center justify-center outline-none",
        className
      )}
      data-slot="meeting-side-panel-resize-handle"
      ref={ref}
      title="Drag to resize sidebar"
      type="button"
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-12 w-1.5 rounded-full bg-border/80 transition-colors group-hover:bg-accent group-focus-visible:bg-accent"
      />
    </button>
  );
}

export type MeetingSidePanelTabsProps = React.ComponentPropsWithoutRef<
  typeof Tabs
> & {
  readonly canReadChat: boolean;
  readonly chatContent: React.ReactNode;
  readonly chatUnreadCount?: number;
  readonly onChatIntent?: () => void;
  readonly onClose: () => void;
  readonly onPanelChange: (panel: MeetingSidePanelTabId) => void;
  readonly participantsContent: React.ReactNode;
  readonly ref?: React.Ref<HTMLDivElement>;
  readonly value: MeetingSidePanelTabId;
};

export function MeetingSidePanelTabs({
  canReadChat,
  chatContent,
  chatUnreadCount = 0,
  className,
  onChatIntent,
  onClose,
  onPanelChange,
  participantsContent,
  ref,
  value,
  ...props
}: MeetingSidePanelTabsProps) {
  return (
    <Tabs
      className={cn("flex h-full flex-col", className)}
      data-slot="meeting-side-panel-tabs"
      onValueChange={(nextValue) => {
        if (nextValue !== "chat" && nextValue !== "participants") {
          return;
        }

        if (nextValue === "chat" && !canReadChat) {
          return;
        }

        if (nextValue === "chat") {
          onChatIntent?.();
        }

        onPanelChange(nextValue);
      }}
      ref={ref}
      value={value}
      {...props}
    >
      <div
        className={meetingSidePanelHeaderVariants()}
        data-slot="meeting-side-panel-tab-header"
      >
        <TabsList className="h-auto bg-transparent p-1">
          <TabsTrigger
            className="data-[state=inactive]:opacity-50"
            data-hyper-elid="meeting-sidebar-participants-tab"
            value="participants"
          >
            Participants
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=inactive]:opacity-50"
            data-hyper-elid="meeting-sidebar-chat-tab"
            disabled={!canReadChat}
            onFocus={onChatIntent}
            onMouseEnter={onChatIntent}
            value="chat"
          >
            Chat
            {value !== "chat" && chatUnreadCount > 0 ? (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground leading-none">
                {chatUnreadCount > 9 ? "9+" : chatUnreadCount}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <MeetingSidePanelCloseButton onClick={onClose} />
      </div>

      <TabsContent
        className="mt-0 min-h-0 flex-1 overflow-hidden"
        value="participants"
      >
        {participantsContent}
      </TabsContent>

      <TabsContent className="mt-0 min-h-0 flex-1 overflow-hidden" value="chat">
        {chatContent}
      </TabsContent>
    </Tabs>
  );
}

export type MeetingSidePanelSurfaceProps = {
  readonly activePanel: MeetingPanelId | null;
  readonly chatContent?: React.ReactNode;
  readonly headerLeadingAction?: React.ReactNode;
  readonly networkContent?: React.ReactNode;
  readonly onChatIntent?: () => void;
  readonly onClose: () => void;
  readonly onTranscriptIntent?: () => void;
  readonly participantsContent: React.ReactNode;
  readonly transcriptContent?: React.ReactNode;
};

export function MeetingSidePanelSurface({
  activePanel,
  chatContent,
  headerLeadingAction,
  networkContent,
  onChatIntent,
  onClose,
  onTranscriptIntent,
  participantsContent,
  transcriptContent,
}: MeetingSidePanelSurfaceProps) {
  const panelForContent = useMeetingSidePanelPresence(activePanel);

  if (panelForContent === null) {
    return null;
  }

  return (
    <MeetingSidePanelShell>
      <MeetingSidePanelContent
        chatContent={chatContent}
        headerLeadingAction={headerLeadingAction}
        networkContent={networkContent}
        onChatIntent={onChatIntent}
        onClose={onClose}
        onTranscriptIntent={onTranscriptIntent}
        panelForContent={panelForContent}
        participantsContent={participantsContent}
        transcriptContent={transcriptContent}
      />
    </MeetingSidePanelShell>
  );
}

type MeetingSidePanelContentProps = Omit<
  MeetingSidePanelSurfaceProps,
  "activePanel"
> & {
  readonly panelForContent: MeetingPanelId;
};

function MeetingSidePanelContent({
  chatContent,
  headerLeadingAction,
  networkContent,
  onChatIntent,
  onClose,
  onTranscriptIntent,
  panelForContent,
  participantsContent,
  transcriptContent,
}: MeetingSidePanelContentProps) {
  if (panelForContent === "chat") {
    return (
      <>
        <MeetingSidePanelHeader
          leadingAction={headerLeadingAction}
          onClose={onClose}
          title="Chat"
        />

        <MeetingSidePanelBody onMouseEnter={onChatIntent}>
          {chatContent ?? <MeetingSidePanelChatSkeleton />}
        </MeetingSidePanelBody>
      </>
    );
  }

  if (panelForContent === "participants") {
    return (
      <>
        <MeetingSidePanelHeader
          leadingAction={headerLeadingAction}
          onClose={onClose}
          title="Participants"
        />

        <MeetingSidePanelBody>{participantsContent}</MeetingSidePanelBody>
      </>
    );
  }

  if (panelForContent === "transcript") {
    if (transcriptContent === undefined) {
      return (
        <MeetingSidePanelBody onMouseEnter={onTranscriptIntent}>
          <MeetingSidePanelTranscriptSkeleton
            leadingAction={headerLeadingAction}
            onClose={onClose}
          />
        </MeetingSidePanelBody>
      );
    }

    return (
      <MeetingSidePanelBody onMouseEnter={onTranscriptIntent}>
        {transcriptContent}
      </MeetingSidePanelBody>
    );
  }

  if (panelForContent === "network" && networkContent !== undefined) {
    return (
      <>
        <MeetingSidePanelHeader
          leadingAction={headerLeadingAction}
          onClose={onClose}
          title="Network"
        />

        <MeetingSidePanelBody>{networkContent}</MeetingSidePanelBody>
      </>
    );
  }

  return (
    <MeetingSidePanelPlaceholderPanel
      leadingAction={headerLeadingAction}
      onClose={onClose}
      panel={panelForContent}
    />
  );
}

function MeetingSidePanelPlaceholderPanel({
  leadingAction,
  onClose,
  panel,
}: {
  readonly leadingAction?: React.ReactNode;
  readonly onClose: () => void;
  readonly panel: MeetingPanelId;
}) {
  const title = getMeetingSidePanelTitle(panel);

  return (
    <>
      <MeetingSidePanelHeader
        leadingAction={leadingAction}
        onClose={onClose}
        title={title}
      />

      <MeetingSidePanelBody>
        <MeetingSidePanelPlaceholder title={title} />
      </MeetingSidePanelBody>
    </>
  );
}

export type MeetingSidePanelBodyProps =
  React.ComponentPropsWithoutRef<"div"> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingSidePanelBody({
  className,
  ref,
  ...props
}: MeetingSidePanelBodyProps) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-hidden", className)}
      data-slot="meeting-side-panel-body"
      ref={ref}
      {...props}
    />
  );
}

export function MeetingSidePanelPlaceholder({
  title,
}: {
  readonly title: string;
}) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-center">
      <div className="space-y-1">
        <p className="font-medium text-popover-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-sm">Coming soon</p>
      </div>
    </div>
  );
}

export function MeetingSidePanelChatSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 px-4 py-4">
        <div className="flex h-full flex-col justify-end gap-3">
          <div className="space-y-2 rounded-xl border bg-background/80 px-3 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <div className="space-y-2 rounded-xl border bg-background/80 px-3 py-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-3">
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function MeetingSidePanelTranscriptSkeleton({
  leadingAction,
  onClose,
}: {
  readonly leadingAction?: React.ReactNode;
  readonly onClose?: () => void;
} = {}) {
  return (
    <div className="flex h-full flex-col">
      {onClose ? (
        <MeetingSidePanelHeader
          leadingAction={leadingAction}
          onClose={onClose}
          title="Transcript"
        />
      ) : (
        <div className="border-b px-4 py-3">
          <Skeleton className="h-4 w-28" />
        </div>
      )}
      <div className="min-h-0 flex-1 px-4 py-4">
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function MeetingSidePanelErrorFallback({
  description = "Refresh the meeting to try again.",
  title,
}: {
  readonly description?: string;
  readonly title: string;
}) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-center">
      <div className="space-y-1">
        <p className="font-medium text-popover-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
