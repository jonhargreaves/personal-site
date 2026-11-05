"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { LucideSmile } from "../../icons/index";

import { ActivityBarsIcon } from "../activity-bars-icon";
import { Button, type ButtonProps } from "../button";

import { getInitials } from "../../lib/initials";
import { cn } from "../../lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarStatus,
} from "../avatar";
import { Bubble, BubbleContent, type BubbleProps } from "../bubble";
import {
  Message as BaseMessage,
  MessageAvatar as BaseMessageAvatar,
  MessageContent as BaseMessageContent,
  MessageFooter as BaseMessageFooter,
  MessageHeader as BaseMessageHeader,
  type MessageProps as BaseMessageProps,
} from "../message";
import {
  chatMessageActionsVariants,
  chatMessageAuthorVariants,
  chatMessageAvatarFallbackVariants,
  chatMessageAvatarVariants,
  chatMessageBubbleVariants,
  chatMessageContainerVariants,
  chatMessageContentVariants,
  chatMessageHeaderVariants,
  chatMessageReactionAddButtonVariants,
  chatMessageReactionsVariants,
  chatMessageReactionVariants,
  chatMessageTimestampVariants,
} from "./message-variants";

const avatarStatusSizeBySize = {
  lg: "md",
  md: "sm",
  sm: "sm",
} as const;

const avatarGradientSizeBySize = {
  lg: 40,
  md: 32,
  sm: 28,
} as const;

export type ChatMessageContainerProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "align"
> &
  VariantProps<typeof chatMessageContainerVariants> & {
    readonly align?: BaseMessageProps["align"];
    readonly isPending?: boolean;
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatMessageContainer({
  align,
  children,
  className,
  isPending,
  ref,
  state,
  ...props
}: ChatMessageContainerProps) {
  return (
    <BaseMessage
      align={align}
      className={cn(
        chatMessageContainerVariants({
          state: state ?? (isPending ? "pending" : "default"),
        }),
        className
      )}
      data-slot="chat-message-container"
      ref={ref}
      {...props}
    >
      {children}
    </BaseMessage>
  );
}

export type ChatMessageAvatarProps = Omit<
  React.ComponentPropsWithoutRef<typeof Avatar>,
  "children"
> &
  VariantProps<typeof chatMessageAvatarVariants> & {
    readonly avatarUrl?: string | null;
    readonly name: string;
    readonly ref?: React.Ref<HTMLSpanElement>;
    readonly status?: AvatarStatus;
  };

export function ChatMessageAvatar({
  avatarUrl,
  className,
  name,
  ref,
  size = "md",
  status,
  ...props
}: ChatMessageAvatarProps) {
  return (
    <BaseMessageAvatar className="self-start overflow-visible rounded-none bg-transparent">
      <Avatar
        className={cn(chatMessageAvatarVariants({ size }), className)}
        data-slot="chat-message-avatar"
        ref={ref}
        status={status}
        statusPosition="bottom-right"
        statusSize={avatarStatusSizeBySize[size ?? "md"]}
        {...props}
      >
        {avatarUrl ? <AvatarImage alt={name} src={avatarUrl} /> : null}
        <AvatarFallback
          className={chatMessageAvatarFallbackVariants({ size })}
          data-slot="chat-message-avatar-fallback"
          gradientSeed={name}
          gradientSize={avatarGradientSizeBySize[size ?? "md"]}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    </BaseMessageAvatar>
  );
}

export type ChatMessageHeaderProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatMessageHeaderVariants> & {
    readonly name: string;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly timestamp: string;
  };

export function ChatMessageHeader({
  className,
  name,
  ref,
  timestamp,
  variant,
  ...props
}: ChatMessageHeaderProps) {
  return (
    <BaseMessageHeader
      className={cn(chatMessageHeaderVariants({ variant }), className)}
      data-slot="chat-message-header"
      ref={ref}
      {...props}
    >
      <span
        className={chatMessageAuthorVariants({ variant })}
        data-slot="chat-message-author"
      >
        {name}
      </span>
      <span
        className={chatMessageTimestampVariants({ variant })}
        data-slot="chat-message-timestamp"
      >
        {timestamp}
      </span>
    </BaseMessageHeader>
  );
}

export type ChatMessageBubbleProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "align"
> &
  VariantProps<typeof chatMessageBubbleVariants> & {
    readonly align?: BubbleProps["align"];
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly rootClassName?: string;
  };

export function ChatMessageBubble({
  align = "start",
  className,
  children,
  ref,
  rootClassName,
  variant,
  ...props
}: ChatMessageBubbleProps) {
  const bubbleVariant = variant ?? undefined;

  return (
    <Bubble
      align={align}
      className={rootClassName}
      data-base-slot="bubble"
      data-slot="chat-message-bubble-root"
      variant={bubbleVariant}
    >
      <BubbleContent
        className={cn(chatMessageBubbleVariants({ variant }), className)}
        data-base-slot="bubble-content"
        data-slot="chat-message-bubble"
        ref={ref}
        variant={bubbleVariant}
        {...props}
      >
        {children}
      </BubbleContent>
    </Bubble>
  );
}

export type ChatMessageActionProps = ButtonProps & {
  readonly ref?: React.Ref<HTMLButtonElement>;
};

export function ChatMessageAction({
  asChild,
  className,
  ref,
  size = "icon",
  type,
  variant = "ghost",
  ...props
}: ChatMessageActionProps) {
  return (
    <Button
      asChild={asChild}
      className={cn("size-7 text-muted-foreground", className)}
      data-slot="chat-message-action"
      ref={ref}
      size={size}
      type={asChild ? type : (type ?? "button")}
      variant={variant}
      {...props}
    />
  );
}

export type ChatMessageActionsProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatMessageActionsVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatMessageActions({
  className,
  ref,
  variant,
  ...props
}: ChatMessageActionsProps) {
  return (
    <BaseMessageFooter
      className={cn(chatMessageActionsVariants({ variant }), className)}
      data-slot="chat-message-actions"
      ref={ref}
      {...props}
    />
  );
}

export type ChatMessageReactionProps =
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof chatMessageReactionVariants> & {
      readonly count: number;
      readonly emoji: string;
      readonly isActive?: boolean;
      readonly ref?: React.Ref<HTMLButtonElement>;
    };

export function ChatMessageReaction({
  className,
  count,
  emoji,
  isActive,
  ref,
  state,
  ...props
}: ChatMessageReactionProps) {
  const resolvedState = state ?? (isActive ? "active" : "default");

  return (
    <button
      aria-pressed={resolvedState === "active"}
      className={cn(
        chatMessageReactionVariants({
          state: resolvedState,
        }),
        className
      )}
      data-state={resolvedState}
      data-slot="chat-message-reaction"
      ref={ref}
      type="button"
      {...props}
    >
      <span
        className="text-sm leading-none"
        data-slot="chat-message-reaction-emoji"
      >
        {emoji}
      </span>
      <span
        className="text-sm tabular-nums"
        data-slot="chat-message-reaction-count"
      >
        {count}
      </span>
    </button>
  );
}

export type ChatMessageReactionAddButtonProps =
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof chatMessageReactionAddButtonVariants> & {
      readonly ref?: React.Ref<HTMLButtonElement>;
    };

export function ChatMessageReactionAddButton({
  "aria-label": ariaLabel = "Add reaction",
  children,
  className,
  ref,
  variant,
  ...props
}: ChatMessageReactionAddButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        chatMessageReactionAddButtonVariants({ variant }),
        className
      )}
      data-slot="chat-message-reaction-add-button"
      ref={ref}
      type="button"
      {...props}
    >
      {children ?? <LucideSmile aria-hidden="true" className="size-3.5" />}
    </button>
  );
}

export type ChatMessageReactionsProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatMessageReactionsVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatMessageReactions({
  className,
  children,
  ref,
  variant,
  ...props
}: ChatMessageReactionsProps) {
  return (
    <BaseMessageFooter
      className={cn(chatMessageReactionsVariants({ variant }), className)}
      data-slot="chat-message-reactions"
      ref={ref}
      {...props}
    >
      {children}
    </BaseMessageFooter>
  );
}

export type ChatMessageContentProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatMessageContentVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatMessageContent({
  className,
  children,
  ref,
  variant,
  ...props
}: ChatMessageContentProps) {
  return (
    <BaseMessageContent
      className={cn(chatMessageContentVariants({ variant }), className)}
      data-slot="chat-message-content"
      ref={ref}
      {...props}
    >
      {children}
    </BaseMessageContent>
  );
}

export type ChatTypingIndicatorParticipant = {
  readonly avatarUrl?: string | null;
  readonly id: string;
  readonly name: string;
  readonly status?: AvatarStatus;
};

export type ChatTypingIndicatorProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  readonly align?: BaseMessageProps["align"];
  readonly participants: readonly ChatTypingIndicatorParticipant[];
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function ChatTypingIndicator({
  align = "start",
  className,
  participants,
  ref,
  ...props
}: ChatTypingIndicatorProps) {
  if (participants.length === 0) {
    return null;
  }

  const [first] = participants;
  const label =
    participants.length === 1 && first !== undefined
      ? `${first.name} is typing...`
      : "Multiple people are typing...";

  return (
    <ChatMessageContainer
      align={align}
      className={className}
      ref={ref}
      {...props}
    >
      {first ? (
        <ChatMessageAvatar
          avatarUrl={first.avatarUrl}
          name={first.name}
          size="sm"
          status={first.status}
        />
      ) : null}
      <ChatMessageContent className="gap-1">
        <div
          className={cn(
            "flex w-fit max-w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2",
            "text-muted-foreground text-xs leading-4",
            "group-data-[align=end]/message:self-end"
          )}
          data-slot="chat-typing-indicator"
        >
          <ActivityBarsIcon
            className="size-5 shrink-0 text-primary"
            data-slot="chat-typing-icon"
          />
          <span className="min-w-0 truncate">{label}</span>
        </div>
      </ChatMessageContent>
    </ChatMessageContainer>
  );
}
