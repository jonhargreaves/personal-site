"use client";

import type { VariantProps } from "class-variance-authority";
import { useCallback, useRef, useState } from "react";
import type * as React from "react";

import { Button } from "../button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../empty-primitives";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  type MessageScrollerContentProps,
  type MessageScrollerProps,
  MessageScrollerProvider,
  type MessageScrollerProviderProps,
  MessageScrollerViewport,
  type MessageScrollerViewportProps,
} from "../message-scroller";
import * as Predicate from "../../lib/predicate";
import { cn } from "../../lib/utils";

import { EmptyChatIllustration } from "../illustrations/empty-chat";
import {
  ChatComposerInput,
  type ChatComposerInputHandle,
  type ChatComposerInputProps,
} from "./composer";
import {
  ChatMessageContent as RichChatMessageContent,
  type ChatMessageContentProps as RichChatMessageContentProps,
} from "./rich-message-content";
import {
  chatViewportVariants,
  chatThreadComposerInputVariants,
  chatThreadComposerSlotVariants,
  chatThreadEmptyRegionVariants,
  chatThreadEmptyStateVariants,
  chatThreadMessageBodyVariants,
  chatThreadMessagesVariants,
  chatThreadPanelVariants,
  chatThreadScrollAreaVariants,
} from "./thread-variants";

const CHAT_THREAD_COMPOSER_DEFAULT_HEIGHT = 148;
const CHAT_THREAD_COMPOSER_MAX_HEIGHT = 320;
const CHAT_THREAD_COMPOSER_MIN_HEIGHT = 120;

function clampChatThreadComposerHeight({
  maxHeight,
  minHeight,
  value,
}: {
  readonly maxHeight: number;
  readonly minHeight: number;
  readonly value: number;
}) {
  return Math.min(Math.max(value, minHeight), maxHeight);
}

export type ChatViewportProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatViewportVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatViewport({
  className,
  ref,
  variant,
  ...props
}: ChatViewportProps) {
  return (
    <div
      className={cn(chatViewportVariants({ variant }), className)}
      data-slot="chat-viewport"
      ref={ref}
      {...props}
    />
  );
}

export type ChatThreadPanelProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatThreadPanelVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatThreadPanel({
  className,
  ref,
  variant,
  ...props
}: ChatThreadPanelProps) {
  return (
    <div
      className={cn(chatThreadPanelVariants({ variant }), className)}
      data-hyper-elid="chat-ui-panel"
      data-slot="chat-thread-panel"
      ref={ref}
      {...props}
    />
  );
}

export type ChatThreadEmptyRegionProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatThreadEmptyRegionVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatThreadEmptyRegion({
  className,
  ref,
  variant,
  ...props
}: ChatThreadEmptyRegionProps) {
  return (
    <div
      className={cn(chatThreadEmptyRegionVariants({ variant }), className)}
      data-hyper-elid="chat-ui-empty"
      data-slot="chat-thread-empty-region"
      ref={ref}
      {...props}
    />
  );
}

export type ChatThreadEmptyStateProps = Omit<
  React.ComponentPropsWithoutRef<typeof Empty>,
  "children" | "title"
> &
  VariantProps<typeof chatThreadEmptyStateVariants> & {
    readonly description: string;
    readonly title: string;
  };

export function ChatThreadEmptyState({
  className,
  description,
  title,
  variant,
  ...props
}: ChatThreadEmptyStateProps) {
  return (
    <Empty
      className={cn(chatThreadEmptyStateVariants({ variant }), className)}
      data-slot="chat-thread-empty-state"
      {...props}
    >
      <EmptyHeader className="max-w-[16rem] gap-3">
        <EmptyMedia className="mb-0 [&_svg]:w-[8.5rem]" variant="illustration">
          <EmptyChatIllustration />
        </EmptyMedia>
        <EmptyTitle className="text-popover-foreground text-xl">
          {title}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export type ChatThreadScrollAreaProps = MessageScrollerProps &
  VariantProps<typeof chatThreadScrollAreaVariants> &
  Pick<
    MessageScrollerProviderProps,
    | "autoScroll"
    | "defaultScrollPosition"
    | "scrollEdgeThreshold"
    | "scrollMargin"
    | "scrollPreviousItemPeek"
  > &
  Pick<
    MessageScrollerViewportProps,
    "aria-label" | "preserveScrollOnPrepend"
  > & {
    readonly viewportClassName?: string;
  };

export function ChatThreadScrollArea({
  "aria-label": ariaLabel,
  autoScroll = true,
  className,
  defaultScrollPosition = "end",
  preserveScrollOnPrepend = true,
  scrollEdgeThreshold,
  scrollMargin,
  scrollPreviousItemPeek,
  variant,
  viewportClassName,
  ...props
}: ChatThreadScrollAreaProps) {
  return (
    <MessageScrollerProvider
      autoScroll={autoScroll}
      defaultScrollPosition={defaultScrollPosition}
      scrollEdgeThreshold={scrollEdgeThreshold}
      scrollMargin={scrollMargin}
      scrollPreviousItemPeek={scrollPreviousItemPeek}
    >
      <MessageScroller
        className={cn(chatThreadScrollAreaVariants({ variant }), className)}
        data-hyper-elid="chat-ui-scroll"
        data-slot="chat-thread-scroll-area"
        {...props}
      >
        <MessageScrollerViewport
          aria-label={ariaLabel ?? "Chat messages"}
          className={viewportClassName}
          preserveScrollOnPrepend={preserveScrollOnPrepend}
        >
          {props.children}
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

export type ChatThreadMessagesProps = Omit<MessageScrollerContentProps, "ref"> &
  VariantProps<typeof chatThreadMessagesVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export type ChatThreadDividerProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly label: string;
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function ChatThreadMessages({
  className,
  ref,
  variant,
  ...props
}: ChatThreadMessagesProps) {
  return (
    <MessageScrollerContent
      className={cn(chatThreadMessagesVariants({ variant }), className)}
      data-slot="chat-thread-messages"
      ref={ref}
      {...props}
    />
  );
}

export function ChatThreadDivider({
  className,
  label,
  ref,
  ...props
}: ChatThreadDividerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 py-1 text-muted-foreground text-xs",
        className
      )}
      data-slot="chat-thread-divider"
      ref={ref}
      role="separator"
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-px min-w-0 flex-1 bg-border/70"
        data-slot="chat-thread-divider-line"
      />
      <span
        className="shrink-0 whitespace-nowrap font-medium"
        data-slot="chat-thread-divider-label"
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="h-px min-w-0 flex-1 bg-border/70"
        data-slot="chat-thread-divider-line"
      />
    </div>
  );
}

export type ChatThreadLoadOlderButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children"
> & {
  readonly isLoading?: boolean;
  readonly loadingLabel?: string;
  readonly ref?: React.Ref<HTMLButtonElement>;
  readonly readyLabel?: string;
};

export function ChatThreadLoadOlderButton({
  disabled,
  isLoading = false,
  loadingLabel = "Loading...",
  readyLabel = "Load older",
  ref,
  size = "sm",
  type = "button",
  variant = "ghost",
  ...props
}: ChatThreadLoadOlderButtonProps) {
  const state = isLoading ? "loading" : "ready";

  return (
    <div
      className="flex justify-center"
      data-slot="chat-thread-load-older-row"
      data-state={state}
    >
      <Button
        data-hyper-elid="chat-ui-load-older"
        data-slot="chat-thread-load-older-button"
        data-state={state}
        disabled={disabled || isLoading}
        ref={ref}
        size={size}
        type={type}
        variant={variant}
        {...props}
      >
        {isLoading ? loadingLabel : readyLabel}
      </Button>
    </div>
  );
}

export type ChatThreadComposerSlotProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof chatThreadComposerSlotVariants> & {
      readonly defaultHeight?: number;
      readonly maxHeight?: number;
      readonly minHeight?: number;
      readonly ref?: React.Ref<HTMLDivElement>;
      readonly resizable?: boolean;
    };

export function ChatThreadComposerSlot({
  children,
  className,
  defaultHeight = CHAT_THREAD_COMPOSER_DEFAULT_HEIGHT,
  maxHeight = CHAT_THREAD_COMPOSER_MAX_HEIGHT,
  minHeight = CHAT_THREAD_COMPOSER_MIN_HEIGHT,
  ref,
  resizable = false,
  style,
  variant,
  ...props
}: ChatThreadComposerSlotProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const resizeStateRef = useRef<{
    readonly pointerId: number;
    readonly startHeight: number;
    readonly startY: number;
  } | null>(null);
  const [height, setHeight] = useState(() =>
    clampChatThreadComposerHeight({
      maxHeight,
      minHeight,
      value: defaultHeight,
    })
  );
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;

      if (Predicate.isFunction(ref)) {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );
  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!resizable || event.button !== 0) {
        return;
      }

      event.preventDefault();
      const currentHeight = rootRef.current?.getBoundingClientRect().height;
      resizeStateRef.current = {
        pointerId: event.pointerId,
        startHeight: currentHeight ?? height,
        startY: event.clientY,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [height, resizable]
  );
  const handleResizePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const resizeState = resizeStateRef.current;

      if (!resizeState || resizeState.pointerId !== event.pointerId) {
        return;
      }

      setHeight(
        clampChatThreadComposerHeight({
          maxHeight,
          minHeight,
          value: resizeState.startHeight + resizeState.startY - event.clientY,
        })
      );
    },
    [maxHeight, minHeight]
  );
  const handleResizePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const resizeState = resizeStateRef.current;

      if (!resizeState || resizeState.pointerId !== event.pointerId) {
        return;
      }

      resizeStateRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    []
  );
  const resolvedStyle = resizable
    ? {
        ...style,
        height: `${height}px`,
        maxHeight: `${maxHeight}px`,
        minHeight: `${minHeight}px`,
      }
    : style;

  return (
    <div
      className={cn(
        chatThreadComposerSlotVariants({ variant }),
        resizable && "relative shrink-0",
        className
      )}
      data-hyper-elid="chat-ui-composer"
      data-slot="chat-thread-composer-slot"
      ref={setRootRef}
      style={resolvedStyle}
      {...props}
    >
      {resizable ? (
        <button
          aria-label="Resize composer"
          className="absolute inset-x-0 -top-2 z-10 flex h-4 cursor-row-resize touch-none select-none items-center justify-center outline-none"
          data-slot="chat-thread-composer-resize-handle"
          onPointerCancel={handleResizePointerEnd}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerEnd}
          title="Drag to resize composer"
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-1 w-12 rounded-full bg-border/80 opacity-70 transition-opacity hover:opacity-100"
          />
        </button>
      ) : null}
      {children}
    </div>
  );
}

export type ChatThreadComposerInputProps = Omit<ChatComposerInputProps, "ref"> &
  VariantProps<typeof chatThreadComposerInputVariants> & {
    readonly ref?: React.Ref<ChatComposerInputHandle>;
  };

export function ChatThreadComposerInput({
  className,
  ref,
  variant,
  ...props
}: ChatThreadComposerInputProps) {
  return (
    <div className="h-full" data-slot="chat-thread-composer-input">
      <ChatComposerInput
        className={cn(chatThreadComposerInputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    </div>
  );
}

export type ChatThreadMessageBodyProps = RichChatMessageContentProps &
  VariantProps<typeof chatThreadMessageBodyVariants>;

export function ChatThreadMessageBody({
  className,
  variant,
  ...props
}: ChatThreadMessageBodyProps) {
  return (
    <RichChatMessageContent
      className={cn(chatThreadMessageBodyVariants({ variant }), className)}
      {...props}
    />
  );
}

export type ChatThreadComposerInputSlotProps =
  React.ComponentPropsWithoutRef<"div"> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatThreadComposerInputSlot({
  className,
  ref,
  ...props
}: ChatThreadComposerInputSlotProps) {
  return (
    <div
      className={cn("h-full", className)}
      data-hyper-elid="chat-ui-editor"
      data-slot="chat-thread-composer-input-slot"
      ref={ref}
      {...props}
    />
  );
}
