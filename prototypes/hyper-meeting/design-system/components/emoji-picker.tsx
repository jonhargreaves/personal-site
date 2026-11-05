"use client";
import {
  EmojiPicker as FrimoussePicker,
  type EmojiPickerListCategoryHeaderProps,
  type EmojiPickerListEmojiProps,
  type EmojiPickerListRowProps,
} from "frimousse";

import { cn } from "../lib/utils";

interface EmojiPickerProps {
  className?: string;
  onEmojiSelect: (data: { emoji: string }) => void;
}

// Extracted list components to avoid "components defined inside components" lint errors
function CategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      className="bg-popover px-3 pt-3 pb-1.5 font-medium text-muted-foreground text-xs"
      {...props}
    >
      {category.label}
    </div>
  );
}

function Row({ children, ...props }: EmojiPickerListRowProps) {
  return (
    <div className="scroll-my-1.5 px-1.5" {...props}>
      {children}
    </div>
  );
}

function Emoji({ emoji, ...props }: EmojiPickerListEmojiProps) {
  return (
    <button
      className="flex size-9 items-center justify-center rounded-md text-2xl transition-colors data-[active]:bg-accent"
      type="button"
      {...props}
    >
      {emoji.emoji}
    </button>
  );
}

function EmojiCompact({ emoji, ...props }: EmojiPickerListEmojiProps) {
  return (
    <button
      className="flex size-8 items-center justify-center rounded-md text-xl transition-colors data-[active]:bg-accent"
      type="button"
      {...props}
    >
      {emoji.emoji}
    </button>
  );
}

const listComponents = {
  CategoryHeader,
  Row,
  Emoji,
};

const listComponentsCompact = {
  CategoryHeader,
  Row,
  Emoji: EmojiCompact,
};

function EmojiPickerFooter() {
  return (
    <div className="flex items-center justify-between border-t px-3 py-2">
      <FrimoussePicker.ActiveEmoji>
        {({ emoji }) =>
          emoji ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{emoji.emoji}</span>
              <span className="max-w-[180px] truncate text-muted-foreground text-xs">
                {emoji.label}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">
              Select an emoji
            </span>
          )
        }
      </FrimoussePicker.ActiveEmoji>
      <FrimoussePicker.SkinToneSelector className="flex size-7 items-center justify-center rounded-md text-lg transition-colors hover:bg-accent" />
    </div>
  );
}

/**
 * Emoji picker using frimousse - a lightweight (~3KB), unstyled, composable picker.
 * Uses Emojibase for emoji data which is loaded on-demand.
 *
 * @see https://frimousse.liveblocks.io/
 */
export function EmojiPickerFrimousse({
  className,
  onEmojiSelect,
}: EmojiPickerProps) {
  return (
    <FrimoussePicker.Root
      className={cn(
        "isolate flex h-[368px] w-[352px] flex-col rounded-lg border bg-popover text-popover-foreground shadow-md",
        className
      )}
      onEmojiSelect={({ emoji }) => onEmojiSelect({ emoji })}
    >
      <div className="relative z-10 mx-2 mt-2 mb-1">
        <FrimoussePicker.Search
          aria-label="Search emojis"
          autoFocus
          className="block w-full appearance-none rounded-md bg-muted px-3 py-2 text-sm outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2"
          placeholder="Search emoji..."
        />
      </div>
      <FrimoussePicker.Viewport className="flex-1 overflow-hidden outline-hidden">
        <FrimoussePicker.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          Loading…
        </FrimoussePicker.Loading>
        <FrimoussePicker.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          No emoji found.
        </FrimoussePicker.Empty>
        <FrimoussePicker.List
          className="select-none pb-1.5"
          components={listComponents}
        />
      </FrimoussePicker.Viewport>
      <EmojiPickerFooter />
    </FrimoussePicker.Root>
  );
}

/** Compact emoji picker without footer, smaller dimensions */
export function EmojiPickerCompact({
  className,
  onEmojiSelect,
}: EmojiPickerProps) {
  return (
    <FrimoussePicker.Root
      className={cn(
        "isolate flex h-[320px] w-[320px] flex-col rounded-lg border bg-popover text-popover-foreground shadow-md",
        className
      )}
      onEmojiSelect={({ emoji }) => onEmojiSelect({ emoji })}
    >
      <div className="relative z-10 mx-2 mt-2 mb-1">
        <FrimoussePicker.Search
          aria-label="Search emojis"
          autoFocus
          className="block w-full appearance-none rounded-md bg-muted px-3 py-2 text-sm outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2"
          placeholder="Search emoji..."
        />
      </div>
      <FrimoussePicker.Viewport className="flex-1 overflow-hidden outline-hidden">
        <FrimoussePicker.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          Loading…
        </FrimoussePicker.Loading>
        <FrimoussePicker.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          No emoji found.
        </FrimoussePicker.Empty>
        <FrimoussePicker.List
          className="select-none pb-1.5"
          components={listComponentsCompact}
        />
      </FrimoussePicker.Viewport>
    </FrimoussePicker.Root>
  );
}
