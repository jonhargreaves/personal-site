"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, LazyMotion, m, useReducedMotion } from "motion/react";
import type * as React from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  HugeAlert02Solid,
  HugeEdit02Stroke,
  HugeMediumSignalBulkSolid,
  HugeSettings02Stroke,
  LucideCopy,
  LucideLogOut,
  LucideSignal,
} from "../../../../../icons/index";

import { loadDomMax } from "../../../../internal/load-dom-max";

import { useIsMobile } from "../../../../hooks/use-mobile";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../dropdown-menu-primitives";
import { Popover, PopoverContent, PopoverTrigger } from "../../../popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../tooltip";
import { MeetingRecordingIcon } from "../../primitives/recording-icon";
import { getMeetingIslandMotionProps } from "./meeting-island-motion";

const meetingIslandStatusMotionEase = [0.23, 1, 0.32, 1] as const;
const meetingIslandStatusRestTransform = "translateX(0) scale(1)";
const meetingIslandStatusStartTransform = "translateX(8px) scale(0.96)";
const meetingIslandStatusesRestTransform =
  "translateY(-50%) translateX(0) scale(1)";
const meetingIslandStatusesStartTransform =
  "translateY(-50%) translateX(8px) scale(0.96)";
export const meetingIslandRootVariants = cva(
  "relative inline-flex items-center gap-2 text-white",
  {
    variants: {
      variant: {
        default: "",
        fullBleed: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingIslandCapsuleVariants = cva(
  "group relative inline-flex h-8 w-auto max-w-[min(50vw,640px)] min-w-0 items-center overflow-visible rounded-none border border-transparent bg-transparent shadow-none",
  {
    variants: {
      variant: {
        default: "",
        fullBleed:
          "h-auto w-[280px] flex-col rounded-full border border-white/10 bg-black/35 px-3 py-2 shadow-lg backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingIslandMenuButtonVariants = cva(
  "h-8 min-w-0 max-w-[min(42vw,560px)] flex-none justify-center rounded-none px-3 text-center text-neutral-200 text-sm hover:bg-transparent hover:text-white data-[popup-open]:bg-transparent data-[popup-open]:text-white",
  {
    variants: {
      variant: {
        default: "",
        fullBleed:
          "h-5 w-full justify-center rounded-none p-0 text-white hover:bg-transparent hover:text-white data-[popup-open]:bg-transparent data-[popup-open]:text-white has-[>svg]:px-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingIslandMobileVariants = cva(
  "flex min-w-0 flex-1 items-center gap-2.5",
  {
    variants: {
      variant: {
        default: "",
        fullBleed: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingIslandScheduleBadgeVariants = cva(
  "inline-flex h-6 items-center rounded-full border px-2.5 font-medium text-xs",
  {
    variants: {
      kind: {
        "over-time": "border-red-500/10 bg-red-500/10 text-red-400",
        "time-left": "border-white/[0.045] bg-white/[0.045] text-neutral-400",
      },
    },
    defaultVariants: {
      kind: "time-left",
    },
  }
);

export const meetingIslandStatusPillVariants = cva(
  "inline-flex h-6 w-8 shrink-0 items-center justify-center rounded-full border p-0 transition-colors hover:border-input has-[>svg]:px-0",
  {
    variants: {
      type: {
        "media-error":
          "border-red-500/15 bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:text-red-300",
        "network-warning":
          "border-amber-500/15 bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 hover:text-amber-400",
        reconnecting:
          "border-amber-500/15 bg-amber-500/15 text-amber-500 hover:bg-amber-500/25",
        recording:
          "border-border bg-background text-red-400 hover:bg-secondary hover:text-red-400 dark:bg-input/30 dark:hover:bg-input/50",
        transcript:
          "border-border bg-background text-red-400 hover:bg-secondary hover:text-red-400 dark:bg-input/30 dark:hover:bg-input/50",
      },
    },
    defaultVariants: {
      type: "recording",
    },
  }
);

export type MeetingIslandStatusType =
  | "captions"
  | "media-error"
  | "network-warning"
  | "reconnecting"
  | "recording"
  | "sharing"
  | "transcript";

export interface MeetingIslandStatus {
  readonly label?: string;
  readonly onSelect?: () => void;
  readonly popoverContent?: React.ReactNode;
  readonly type: MeetingIslandStatusType;
}

export type MeetingIslandScheduleBadge = {
  readonly kind: "over-time" | "time-left";
  readonly label: string;
};

export interface MeetingIslandRef {
  startEditing: () => void;
}

export type MeetingIslandProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "title"
> &
  VariantProps<typeof meetingIslandRootVariants> & {
    readonly elapsedMs?: number;
    readonly onCopyLink?: () => void;
    readonly onEndMeeting?: () => void;
    readonly onOpenSettings?: () => void;
    readonly onRename?: () => void;
    readonly onTitleChange?: (title: string) => Promise<void> | void;
    readonly scheduleBadge?: MeetingIslandScheduleBadge;
    readonly showTimer?: boolean;
    readonly statuses?: readonly MeetingIslandStatus[];
    readonly title: string;
    readonly workspaceName?: string;
  };

export type MeetingIslandDesktopProps = MeetingIslandProps & {
  readonly ref?: React.Ref<MeetingIslandRef>;
};

export type MeetingIslandMobileProps = Omit<
  MeetingIslandProps,
  | "elapsedMs"
  | "onCopyLink"
  | "onEndMeeting"
  | "onOpenSettings"
  | "onRename"
  | "onTitleChange"
>;

export function formatMeetingIslandElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatMeetingIslandAriaElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
  }

  return `Meeting duration: ${parts.join(", ")}`;
}

function findStatus(
  statuses: readonly MeetingIslandStatus[],
  type: MeetingIslandStatusType
) {
  return statuses.find((status) => status.type === type);
}

function MeetingIslandScheduleBadgeView({
  scheduleBadge,
}: {
  readonly scheduleBadge: MeetingIslandScheduleBadge;
}) {
  return (
    <div
      className="inline-flex h-8 items-center p-1"
      data-slot="meeting-island-schedule"
    >
      <span
        className={meetingIslandScheduleBadgeVariants({
          kind: scheduleBadge.kind,
        })}
        data-kind={scheduleBadge.kind}
        data-slot="meeting-island-schedule-badge"
      >
        {scheduleBadge.label}
      </span>
    </div>
  );
}

type MeetingIslandStatusPillProps = {
  readonly alignToTopBar?: boolean;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly popoverContent?: React.ReactNode;
  readonly type:
    | "media-error"
    | "network-warning"
    | "reconnecting"
    | "recording"
    | "transcript";
};

function MeetingIslandStatusIcon({
  type,
}: Pick<MeetingIslandStatusPillProps, "type">) {
  return type === "media-error" ? (
    <HugeAlert02Solid className="size-4" size={16} stroke="none" />
  ) : type === "network-warning" ? (
    <HugeMediumSignalBulkSolid className="size-4" size={16} stroke="none" />
  ) : type === "reconnecting" ? (
    <LucideSignal className="size-3.5" />
  ) : type === "transcript" || type === "recording" ? (
    <MeetingRecordingIcon animated data-slot="meeting-island-recording-icon" />
  ) : null;
}

function MeetingIslandStatusPill({
  alignToTopBar = false,
  label,
  onSelect,
  popoverContent,
  type,
}: MeetingIslandStatusPillProps) {
  const content = <MeetingIslandStatusIcon type={type} />;

  const trigger =
    onSelect || popoverContent ? (
      <Button
        aria-label={label}
        className={meetingIslandStatusPillVariants({ type })}
        data-slot="meeting-island-status-pill"
        data-status={type}
        onClick={onSelect}
        type="button"
        variant="ghost"
      >
        {content}
      </Button>
    ) : (
      <span
        aria-label={label}
        className={meetingIslandStatusPillVariants({ type })}
        data-slot="meeting-island-status-pill"
        data-status={type}
        role="img"
      >
        {content}
      </span>
    );
  const tooltip = (
    <Tooltip>
      <TooltipTrigger asChild>
        {popoverContent ? (
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        ) : (
          trigger
        )}
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>{label}</TooltipContent>
    </Tooltip>
  );

  const floatingTrigger = alignToTopBar ? (
    <span className="inline-flex h-8 items-center">{tooltip}</span>
  ) : (
    tooltip
  );

  if (!popoverContent) {
    return floatingTrigger;
  }

  return (
    <Popover>
      {floatingTrigger}
      <PopoverContent
        align="center"
        className="w-80 p-0"
        side="bottom"
        sideOffset={8}
      >
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
}

function MeetingIslandStatuses({
  statusPills,
  reduceStatusMotion,
}: {
  statusPills: MeetingIslandStatusPillProps[];
  reduceStatusMotion: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {statusPills.length > 0 ? (
        <m.span
          animate={{
            opacity: 1,
            transform: meetingIslandStatusesRestTransform,
          }}
          className="right-full absolute top-1/2 mr-2 inline-flex items-center gap-2"
          data-slot="meeting-island-statuses"
          exit={{
            opacity: 0,
            transform: reduceStatusMotion
              ? meetingIslandStatusesRestTransform
              : meetingIslandStatusesStartTransform,
          }}
          initial={false}
          key="meeting-island-statuses"
          transition={{
            duration: reduceStatusMotion ? 0.12 : 0.14,
            ease: meetingIslandStatusMotionEase,
          }}
        >
          <AnimatePresence mode="popLayout">
            {statusPills.map((status, index) => (
              <m.span
                animate={{
                  opacity: 1,
                  transform: meetingIslandStatusRestTransform,
                  transition: {
                    delay: reduceStatusMotion ? 0 : index * 0.03,
                    duration: reduceStatusMotion ? 0.12 : 0.16,
                    ease: meetingIslandStatusMotionEase,
                  },
                }}
                className="inline-flex"
                exit={{
                  opacity: 0,
                  transform: reduceStatusMotion
                    ? meetingIslandStatusRestTransform
                    : meetingIslandStatusStartTransform,
                  transition: {
                    duration: reduceStatusMotion ? 0.12 : 0.14,
                    ease: meetingIslandStatusMotionEase,
                  },
                }}
                initial={{
                  opacity: 0,
                  transform: reduceStatusMotion
                    ? meetingIslandStatusRestTransform
                    : meetingIslandStatusStartTransform,
                }}
                key={status.type}
                layout={reduceStatusMotion ? false : "position"}
                transition={{
                  layout: {
                    duration: 0.16,
                    ease: meetingIslandStatusMotionEase,
                  },
                }}
              >
                <MeetingIslandStatusPill {...status} />
              </m.span>
            ))}
          </AnimatePresence>
        </m.span>
      ) : null}
    </AnimatePresence>
  );
}

function MeetingIslandMenu({
  setMenuOpen,
  menuOpen,
  variant,
  title,
  suppressMenuReturnFocusRef,
  onRename,
  onTitleChange,
  startEditing,
  onCopyLink,
  onOpenSettings,
  onEndMeeting,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  variant: "default" | "fullBleed" | null | undefined;
  title: string;
  suppressMenuReturnFocusRef: React.RefObject<boolean>;
  onRename: (() => void) | undefined;
  onTitleChange: ((title: string) => Promise<void> | void) | undefined;
  startEditing: () => void;
  onCopyLink: (() => void) | undefined;
  onOpenSettings: (() => void) | undefined;
  onEndMeeting: (() => void) | undefined;
}) {
  return (
    <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              className={meetingIslandMenuButtonVariants({ variant })}
              data-icon="inline-start"
              data-slot="meeting-island-menu-trigger"
              type="button"
              variant="ghost"
            >
              <span className="min-w-0 truncate text-center font-medium">
                {title}
              </span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>Open meeting menu</TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align="start"
        className="w-52"
        onCloseAutoFocus={(event) => {
          if (!suppressMenuReturnFocusRef.current) return;
          suppressMenuReturnFocusRef.current = false;
          event.preventDefault();
        }}
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Meeting</DropdownMenuLabel>
          {onRename || onTitleChange ? (
            <DropdownMenuItem
              data-hyper-elid="meeting-menu-rename"
              onSelect={() => {
                suppressMenuReturnFocusRef.current = true;
                setMenuOpen(false);
                if (onRename) onRename();
                else startEditing();
              }}
            >
              <HugeEdit02Stroke className="size-4 text-muted-foreground" />
              Rename
            </DropdownMenuItem>
          ) : null}
          {onCopyLink && (
            <DropdownMenuItem
              data-hyper-elid="meeting-menu-copy-link"
              onSelect={onCopyLink}
            >
              <LucideCopy className="size-4 text-muted-foreground" />
              Copy link
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        {onOpenSettings && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Preferences</DropdownMenuLabel>
              <DropdownMenuItem onSelect={onOpenSettings}>
                <HugeSettings02Stroke className="size-4 text-muted-foreground" />
                Meeting settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {onEndMeeting && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={onEndMeeting} variant="destructive">
                <LucideLogOut className="size-4 text-muted-foreground" />
                End meeting
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getMeetingIslandStatusPills({
  statuses,
  variant,
}: {
  statuses: readonly MeetingIslandStatus[];
  variant: "default" | "fullBleed" | null | undefined;
}) {
  const mediaErrorStatus = findStatus(statuses, "media-error");
  const networkWarningStatus = findStatus(statuses, "network-warning");
  const reconnectingStatus = findStatus(statuses, "reconnecting");
  const recordingStatus = findStatus(statuses, "recording");
  const transcriptStatus = findStatus(statuses, "transcript");
  const statusPills: MeetingIslandStatusPillProps[] = [];

  if (mediaErrorStatus) {
    statusPills.push({
      alignToTopBar: variant !== "fullBleed",
      label: mediaErrorStatus.label ?? "Media connection lost",
      onSelect: mediaErrorStatus.onSelect,
      type: "media-error",
    });
  }
  if (reconnectingStatus) {
    statusPills.push({
      alignToTopBar: variant !== "fullBleed",
      label: reconnectingStatus.label ?? "Poor connection",
      onSelect: reconnectingStatus.onSelect,
      type: "reconnecting",
    });
  }
  if (networkWarningStatus) {
    statusPills.push({
      alignToTopBar: variant !== "fullBleed",
      label: networkWarningStatus.label ?? "Poor connection",
      onSelect: networkWarningStatus.onSelect,
      type: "network-warning",
    });
  }
  if (recordingStatus) {
    statusPills.push({
      alignToTopBar: variant !== "fullBleed",
      label: recordingStatus.label ?? "Recording in progress",
      onSelect: recordingStatus.onSelect,
      popoverContent: recordingStatus.popoverContent,
      type: "recording",
    });
  }
  if (transcriptStatus) {
    statusPills.push({
      alignToTopBar: variant !== "fullBleed",
      label:
        transcriptStatus.label ?? "The meeting transcript is being recorded",
      onSelect: transcriptStatus.onSelect,
      popoverContent: transcriptStatus.popoverContent,
      type: "transcript",
    });
  }

  return { statusPills };
}

export const MeetingIslandDesktop = forwardRef<
  MeetingIslandRef,
  MeetingIslandDesktopProps
>(function MeetingIslandDesktop(
  {
    className,
    elapsedMs = 0,
    onCopyLink,
    onEndMeeting,
    onOpenSettings,
    onRename,
    onTitleChange,
    scheduleBadge,
    showTimer = true,
    statuses = [],
    title,
    variant,
    workspaceName: _workspaceName,
    ...props
  },
  ref
) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [menuOpen, setMenuOpen] = useState(false);
  const suppressMenuReturnFocusRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const motionProps = getMeetingIslandMotionProps(shouldReduceMotion);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(title);
    }
  }, [isEditing, title]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setDraftTitle(title);
    setIsEditing(true);
  }, [title]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setDraftTitle(title);
  }, [title]);

  const commitEdit = useCallback(() => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== title) {
      void onTitleChange?.(trimmed);
    }
    setIsEditing(false);
  }, [draftTitle, onTitleChange, title]);

  useImperativeHandle(ref, () => ({ startEditing }), [startEditing]);

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const isoDateTime = `PT${totalSeconds}S`;
  const { statusPills } = getMeetingIslandStatusPills({ statuses, variant });

  const reduceStatusMotion = shouldReduceMotion === true;
  return (
    <div
      className={cn(meetingIslandRootVariants({ variant }), className)}
      data-slot="meeting-island"
      data-variant={variant ?? "default"}
      {...props}
    >
      <LazyMotion features={loadDomMax}>
        <m.div
          className={cn(meetingIslandCapsuleVariants({ variant }))}
          data-slot="meeting-island-capsule"
          {...motionProps}
        >
          <MeetingIslandStatuses
            statusPills={statusPills}
            reduceStatusMotion={reduceStatusMotion}
          />

          {isEditing ? (
            <input
              aria-label="Meeting title"
              className="mx-3 min-w-0 flex-1 rounded-md border border-white/30 bg-neutral-900 px-1.5 py-0.5 font-medium text-sm text-white outline-none ring-2 ring-white/20"
              data-hyper-elid="meeting-title-input"
              data-slot="meeting-island-title-input"
              onBlur={() => {
                if (isEditing) {
                  commitEdit();
                }
              }}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitEdit();
                if (event.key === "Escape") cancelEdit();
              }}
              ref={inputRef}
              type="text"
              value={draftTitle}
            />
          ) : (
            <MeetingIslandMenu
              setMenuOpen={setMenuOpen}
              menuOpen={menuOpen}
              variant={variant}
              title={title}
              suppressMenuReturnFocusRef={suppressMenuReturnFocusRef}
              onRename={onRename}
              onTitleChange={onTitleChange}
              startEditing={startEditing}
              onCopyLink={onCopyLink}
              onOpenSettings={onOpenSettings}
              onEndMeeting={onEndMeeting}
            />
          )}

          {showTimer && elapsedMs > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "left-full absolute top-1/2 inline-flex h-8 shrink-0 -translate-y-1/2 items-center",
                    variant === "fullBleed" && "static h-4 translate-y-0"
                  )}
                >
                  <span
                    aria-label={formatMeetingIslandAriaElapsed(elapsedMs)}
                    className={cn(
                      "inline-flex h-5 shrink-0 items-center justify-center border-l border-white/10 px-3 font-mono text-neutral-400 text-sm tabular-nums transition-colors group-hover:text-neutral-50",
                      variant === "fullBleed" &&
                        "h-4 w-auto border-l-0 text-white/55 text-xs"
                    )}
                    data-slot="meeting-island-timer"
                    role="timer"
                  >
                    <time dateTime={isoDateTime}>
                      {formatMeetingIslandElapsed(elapsedMs)}
                    </time>
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                {formatMeetingIslandAriaElapsed(elapsedMs)}
              </TooltipContent>
            </Tooltip>
          )}
        </m.div>
      </LazyMotion>

      {scheduleBadge ? (
        <MeetingIslandScheduleBadgeView scheduleBadge={scheduleBadge} />
      ) : null}
    </div>
  );
});

export function MeetingIslandMobile({
  className,
  showTimer: _showTimer,
  scheduleBadge: _scheduleBadge,
  statuses = [],
  title,
  variant,
  workspaceName: _workspaceName,
  ...props
}: MeetingIslandMobileProps) {
  const recordingStatus = findStatus(statuses, "recording");
  const networkWarningStatus = findStatus(statuses, "network-warning");
  const reconnectingStatus = findStatus(statuses, "reconnecting");
  const transcriptStatus = findStatus(statuses, "transcript");

  return (
    <div
      className={className}
      data-slot="meeting-island-mobile"
      data-state={
        recordingStatus ? "recording" : transcriptStatus ? "transcript" : "idle"
      }
      {...props}
    >
      <div className={meetingIslandMobileVariants({ variant })}>
        {reconnectingStatus ? (
          <MeetingIslandStatusPill
            label={reconnectingStatus.label ?? "Poor connection"}
            onSelect={reconnectingStatus.onSelect}
            type="reconnecting"
          />
        ) : null}

        {networkWarningStatus ? (
          <MeetingIslandStatusPill
            label={networkWarningStatus.label ?? "Poor connection"}
            onSelect={networkWarningStatus.onSelect}
            type="network-warning"
          />
        ) : null}

        {recordingStatus ? (
          <MeetingIslandStatusPill
            label={recordingStatus.label ?? "Recording in progress"}
            onSelect={recordingStatus.onSelect}
            popoverContent={recordingStatus.popoverContent}
            type="recording"
          />
        ) : null}

        {transcriptStatus ? (
          <MeetingIslandStatusPill
            label={
              transcriptStatus.label ??
              "The meeting transcript is being recorded"
            }
            onSelect={transcriptStatus.onSelect}
            popoverContent={transcriptStatus.popoverContent}
            type="transcript"
          />
        ) : null}

        <span
          className="max-w-[40vw] truncate font-medium text-foreground/90 text-sm"
          data-slot="meeting-island-mobile-title"
        >
          {title}
        </span>
      </div>
    </div>
  );
}

export const MeetingIsland = forwardRef<MeetingIslandRef, MeetingIslandProps>(
  function MeetingIsland({ showTimer = true, ...props }, ref) {
    const isMobile = useIsMobile();

    if (isMobile) {
      return (
        <MeetingIslandMobile
          className={props.className}
          showTimer={showTimer}
          statuses={props.statuses}
          title={props.title}
          variant={props.variant}
          workspaceName={props.workspaceName}
        />
      );
    }

    return <MeetingIslandDesktop ref={ref} showTimer={showTimer} {...props} />;
  }
);
