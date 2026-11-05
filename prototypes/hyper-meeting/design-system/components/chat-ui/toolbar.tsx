"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import {
  LucideBold,
  LucideItalic,
  LucideStrikethrough,
  LucideUnderline,
} from "../../icons/index";

import { cn } from "../../lib/utils";
import { useOptionalChatComposer } from "./composer-context";
import {
  ChatToolbarCodeBlockButton,
  ChatToolbarCodeLanguageDropdown,
  ChatToolbarAttachmentButton,
  ChatToolbarEmojiButton,
  ChatToolbarGifButton,
  ChatToolbarInsertLinkButton,
  ChatToolbarListButton,
  ChatToolbarMarkButton,
  ChatToolbarSendButton,
} from "./toolbar-actions";
import {
  chatToolbarGroupVariants,
  chatToolbarRootVariants,
} from "./toolbar-variants";

export type ChatToolbarRootProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatToolbarRootVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatToolbarRoot({
  className,
  ref,
  variant,
  ...props
}: ChatToolbarRootProps) {
  return (
    <div
      className={cn(chatToolbarRootVariants({ variant }), className)}
      data-slot="chat-toolbar"
      ref={ref}
      {...props}
    />
  );
}

export type ChatToolbarGroupProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatToolbarGroupVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function ChatToolbarGroup({
  className,
  ref,
  variant,
  ...props
}: ChatToolbarGroupProps) {
  return (
    <div
      className={cn(chatToolbarGroupVariants({ variant }), className)}
      data-slot="chat-toolbar-group"
      ref={ref}
      {...props}
    />
  );
}

export type ChatToolbarProps = ChatToolbarRootProps & {
  readonly attachmentAccept?: string;
  readonly attachmentMultiple?: boolean;
  readonly disabled?: boolean;
  readonly onInsertLink?: () => void;
  readonly onOpenGif?: () => void;
  readonly onSelectAttachments?: (files: readonly File[]) => void;
  readonly onSend?: () => void;
};

export function ChatToolbar({
  attachmentAccept,
  attachmentMultiple,
  className,
  disabled,
  onInsertLink,
  onOpenGif,
  onSelectAttachments,
  onSend,
  variant,
  ...props
}: ChatToolbarProps) {
  const composer = useOptionalChatComposer();
  const resolvedDisabled = disabled ?? composer?.disabled ?? false;

  return (
    <ChatToolbarRoot className={className} variant={variant} {...props}>
      <ChatToolbarGroup variant={variant}>
        {onSelectAttachments ? (
          <ChatToolbarAttachmentButton
            accept={attachmentAccept}
            disabled={resolvedDisabled}
            multiple={attachmentMultiple}
            onSelectFiles={onSelectAttachments}
          />
        ) : null}
        <ChatToolbarMarkButton
          disabled={resolvedDisabled}
          format="bold"
          tooltip="Bold"
        >
          <LucideBold strokeWidth={2.5} />
        </ChatToolbarMarkButton>
        <ChatToolbarMarkButton
          disabled={resolvedDisabled}
          format="italic"
          tooltip="Italic"
        >
          <LucideItalic strokeWidth={2.5} />
        </ChatToolbarMarkButton>
        <ChatToolbarMarkButton
          disabled={resolvedDisabled}
          format="underline"
          tooltip="Underline"
        >
          <LucideUnderline strokeWidth={2.5} />
        </ChatToolbarMarkButton>
        <ChatToolbarMarkButton
          disabled={resolvedDisabled}
          format="strikethrough"
          tooltip="Strikethrough"
        >
          <LucideStrikethrough strokeWidth={3} />
        </ChatToolbarMarkButton>
        <ChatToolbarCodeBlockButton disabled={resolvedDisabled} />
        <ChatToolbarCodeLanguageDropdown disabled={resolvedDisabled} />
        <ChatToolbarInsertLinkButton
          disabled={resolvedDisabled}
          onInsertLink={onInsertLink}
        />
        <ChatToolbarListButton disabled={resolvedDisabled} />
        <ChatToolbarEmojiButton disabled={resolvedDisabled} />
        <ChatToolbarGifButton
          disabled={resolvedDisabled}
          onOpenGif={onOpenGif}
        />
      </ChatToolbarGroup>

      <ChatToolbarSendButton disabled={resolvedDisabled} onSend={onSend} />
    </ChatToolbarRoot>
  );
}
