"use client";

import type * as React from "react";

import {
  LucideCode2,
  LucideImage,
  LucideList,
  LucideListOrdered,
  LucideListTodo,
  LucideQuote,
} from "../../icons/index";

import { cn } from "../../lib/utils";
import {
  menuItemClassName,
  menuItemPointerClassName,
  menuItemSelectedClassName,
} from "../menu/styles";
import { Popover, PopoverContent } from "../popover";
import type { ChatParticipant } from "./chat-document";
import type { ChatSuggestionAnchor } from "./suggestion-anchor";

export type ChatSlashCommandId =
  | "gif"
  | "disc"
  | "decimal"
  | "todo"
  | "code_block"
  | "blockquote";

export type ChatSlashCommand = {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly id: ChatSlashCommandId;
  readonly keywords: readonly string[];
  readonly label: string;
};

export const chatSlashCommands = [
  {
    icon: LucideImage,
    id: "gif",
    keywords: ["animated", "giphy", "image", "klipy", "media"],
    label: "GIF",
  },
  {
    icon: LucideList,
    id: "disc",
    keywords: ["list", "unordered", "ul"],
    label: "Bulleted list",
  },
  {
    icon: LucideListOrdered,
    id: "decimal",
    keywords: ["list", "numbered", "ol", "ordered"],
    label: "Numbered list",
  },
  {
    icon: LucideListTodo,
    id: "todo",
    keywords: ["checklist", "list", "task", "todo"],
    label: "To-do list",
  },
  {
    icon: LucideCode2,
    id: "code_block",
    keywords: ["code", "fence", "snippet"],
    label: "Code block",
  },
  {
    icon: LucideQuote,
    id: "blockquote",
    keywords: ["blockquote", "quote"],
    label: "Quote",
  },
] satisfies readonly ChatSlashCommand[];

export function getAvailableChatSlashCommands({
  gifEnabled,
}: {
  readonly gifEnabled: boolean;
}) {
  return gifEnabled
    ? chatSlashCommands
    : chatSlashCommands.filter((command) => command.id !== "gif");
}

export function filterChatSlashCommands(
  commands: readonly ChatSlashCommand[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return commands;
  }

  return commands.filter((command) => {
    if (command.id.includes(normalizedQuery)) {
      return true;
    }

    if (command.label.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return command.keywords.some((keyword) =>
      keyword.includes(normalizedQuery)
    );
  });
}

type ChatSuggestionPopoverProps = {
  readonly anchor: ChatSuggestionAnchor;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly onDismiss?: () => void;
};

function ChatSuggestionPopover({
  anchor,
  children,
  className,
  onDismiss,
}: ChatSuggestionPopoverProps) {
  return (
    <Popover
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onDismiss?.();
        }
      }}
      open
    >
      <PopoverContent
        align="start"
        anchor={anchor}
        className={cn(
          "w-auto overflow-y-auto rounded-lg p-1 shadow-md",
          className
        )}
        collisionPadding={8}
        finalFocus={false}
        initialFocus={false}
        role="listbox"
        side="bottom"
        sideOffset={4}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

export type ChatSlashCommandListProps = {
  readonly anchor: ChatSuggestionAnchor | null;
  readonly commands: readonly ChatSlashCommand[];
  readonly onDismiss?: () => void;
  readonly onSelect: (commandId: ChatSlashCommandId) => void;
  readonly selectedIndex: number;
};

export function ChatSlashCommandList({
  anchor,
  commands,
  onDismiss,
  onSelect,
  selectedIndex,
}: ChatSlashCommandListProps) {
  if (!anchor || commands.length === 0) {
    return null;
  }

  return (
    <ChatSuggestionPopover
      anchor={anchor}
      className="min-w-[220px]"
      onDismiss={onDismiss}
    >
      {commands.map((command, index) => {
        const Icon = command.icon;

        return (
          <div
            aria-selected={index === selectedIndex}
            data-selected={index === selectedIndex}
            className={cn(
              menuItemClassName,
              menuItemPointerClassName,
              menuItemSelectedClassName
            )}
            key={command.id}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(command.id);
            }}
            role="option"
            tabIndex={-1}
          >
            <Icon className="size-4 text-muted-foreground" />
            <span>{command.label}</span>
          </div>
        );
      })}
    </ChatSuggestionPopover>
  );
}

export type ChatMentionListProps = {
  readonly anchor: ChatSuggestionAnchor | null;
  readonly onDismiss?: () => void;
  readonly onSelect: (participant: ChatParticipant) => void;
  readonly participants: readonly ChatParticipant[];
  readonly selectedIndex: number;
};

export function ChatMentionList({
  anchor,
  onDismiss,
  onSelect,
  participants,
  selectedIndex,
}: ChatMentionListProps) {
  if (!anchor || participants.length === 0) {
    return null;
  }

  return (
    <ChatSuggestionPopover
      anchor={anchor}
      className="min-w-[180px]"
      onDismiss={onDismiss}
    >
      {participants.map((participant, index) => (
        <div
          aria-selected={index === selectedIndex}
          data-selected={index === selectedIndex}
          className={cn(
            menuItemClassName,
            menuItemPointerClassName,
            "flex-col items-start gap-0.5",
            menuItemSelectedClassName
          )}
          key={participant.id}
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(participant);
          }}
          role="option"
          tabIndex={-1}
        >
          <div className="font-medium">{participant.name}</div>
          {participant.detail ? (
            <div className="text-muted-foreground text-xs">
              {participant.detail}
            </div>
          ) : null}
        </div>
      ))}
    </ChatSuggestionPopover>
  );
}
