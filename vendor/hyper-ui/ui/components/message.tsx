"use client";

import type * as React from "react";

import { cn } from "../lib/utils";

export type MessageGroupProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function MessageGroup({ className, ref, ...props }: MessageGroupProps) {
  return (
    <div
      className={cn("cn-message-group flex min-w-0 flex-col", className)}
      data-base-slot="message-group"
      data-slot="message-group"
      ref={ref}
      {...props}
    />
  );
}

export type MessageProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly align?: "end" | "start";
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function Message({
  align = "start",
  className,
  ref,
  ...props
}: MessageProps) {
  return (
    <div
      className={cn(
        "cn-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse",
        className
      )}
      data-align={align}
      data-base-slot="message"
      data-slot="message"
      ref={ref}
      {...props}
    />
  );
}

export type MessageAvatarProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function MessageAvatar({
  className,
  ref,
  ...props
}: MessageAvatarProps) {
  return (
    <div
      className={cn(
        "cn-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted",
        className
      )}
      data-base-slot="message-avatar"
      data-slot="message-avatar"
      ref={ref}
      {...props}
    />
  );
}

export type MessageContentProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function MessageContent({
  className,
  ref,
  ...props
}: MessageContentProps) {
  return (
    <div
      className={cn(
        "cn-message-content flex w-full min-w-0 flex-col wrap-break-word",
        className
      )}
      data-base-slot="message-content"
      data-slot="message-content"
      ref={ref}
      {...props}
    />
  );
}

export type MessageHeaderProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function MessageHeader({
  className,
  ref,
  ...props
}: MessageHeaderProps) {
  return (
    <div
      className={cn(
        "cn-message-header flex max-w-full min-w-0 items-center",
        className
      )}
      data-base-slot="message-header"
      data-slot="message-header"
      ref={ref}
      {...props}
    />
  );
}

export type MessageFooterProps = React.ComponentPropsWithoutRef<"div"> & {
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function MessageFooter({
  className,
  ref,
  ...props
}: MessageFooterProps) {
  return (
    <div
      className={cn(
        "cn-message-footer flex max-w-full min-w-0 items-center group-data-[align=end]/message:justify-end",
        className
      )}
      data-base-slot="message-footer"
      data-slot="message-footer"
      ref={ref}
      {...props}
    />
  );
}
