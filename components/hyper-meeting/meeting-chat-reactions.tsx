import { useRef, useState } from "react";
import {
  ChatMessageAction,
  ChatMessageActions,
  ChatMessageReaction,
  ChatMessageReactionAddButton,
  ChatMessageReactions,
} from "@/vendor/hyper-ui/ui/components/chat-ui/message";
import { ChatEmojiPicker, preloadChatEmojiPicker } from "@/vendor/hyper-ui/ui/components/chat-ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/vendor/hyper-ui/ui/components/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/vendor/hyper-ui/ui/components/tooltip";
import type { MeetingChatMessage } from "./meeting-chat-data";
import styles from "./meeting-chat-reactions.module.css";

type Reaction = { emoji: string; label: string; count: number; active: boolean };
const quickReactions = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "💯", label: "Hundred points" },
  { emoji: "🔥", label: "Fire" },
] as const;

function AddReactionIcon({ size }: { size: 16 | 20 }) {
  return <span aria-hidden="true" className={styles.addIcon} style={{ width: size, height: size, maskImage: `url(/prototypes/hyper-meeting/icons/chat-reactions/face-plus-${size}.svg)` }} />;
}

function ReactionPicker({ location, author, onSelect }: {
  location: "toolbar" | "footer";
  author: string;
  onSelect: (emoji: string, label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const label = `Add a reaction to ${author}’s message`;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip disabled={open}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {location === "toolbar" ? (
              <ChatMessageAction ref={triggerRef} className={styles.quickAction} aria-label={label} onPointerEnter={preloadChatEmojiPicker} onFocus={preloadChatEmojiPicker}>
                <AddReactionIcon size={20} />
              </ChatMessageAction>
            ) : (
              <ChatMessageReactionAddButton ref={triggerRef} className={styles.addReaction} aria-label={label} onPointerEnter={preloadChatEmojiPicker} onFocus={preloadChatEmojiPicker}>
                <AddReactionIcon size={16} />
              </ChatMessageReactionAddButton>
            )}
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>Add a reaction</TooltipContent>
      </Tooltip>
      <PopoverContent
        aria-label={`Choose a reaction for ${author}’s message`}
        className={styles.picker}
        side="top"
        align="end"
        sideOffset={8}
        collisionPadding={8}
        onKeyDown={(event) => { if (event.key === "Escape") event.stopPropagation(); }}
      >
        <ChatEmojiPicker onEmojiSelect={({ emoji }) => {
          onSelect(emoji, quickReactions.find((item) => item.emoji === emoji)?.label ?? emoji);
          setOpen(false);
          requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
        }} />
      </PopoverContent>
    </Popover>
  );
}

export default function MeetingChatReactions({ initialReaction, author }: {
  initialReaction: MeetingChatMessage["reaction"];
  author: string;
}) {
  const [reactions, setReactions] = useState<Reaction[]>(() => initialReaction ? [{ ...initialReaction, active: false }] : []);
  const actionsRef = useRef<HTMLDivElement>(null);
  function toggleReaction(emoji: string, label: string, addOnly = false) {
    setReactions((current) => {
      const existing = current.find((reaction) => reaction.emoji === emoji);
      if (!existing) return [...current, { emoji, label, count: 1, active: true }];
      if (addOnly && existing.active) return current;
      return current.map((reaction) => reaction.emoji === emoji
        ? { ...reaction, count: reaction.count + (reaction.active ? -1 : 1), active: !reaction.active }
        : reaction).filter((reaction) => reaction.count > 0);
    });
  }
  return (
    <>
      <ChatMessageActions ref={actionsRef} className={styles.actions} role="group" aria-label={`React to ${author}’s message`}>
        {quickReactions.map(({ emoji, label }) => (
          <Tooltip key={emoji}>
            <TooltipTrigger asChild>
              <ChatMessageAction className={styles.quickAction} aria-label={`${label} reaction to ${author}’s message`} aria-pressed={reactions.some((reaction) => reaction.emoji === emoji && reaction.active)} onClick={() => toggleReaction(emoji, label)}>
                <span aria-hidden="true" className={styles.quickEmoji}>{emoji}</span>
              </ChatMessageAction>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>{label}</TooltipContent>
          </Tooltip>
        ))}
        <span aria-hidden="true" className={styles.divider} />
        <ReactionPicker location="toolbar" author={author} onSelect={(emoji, label) => toggleReaction(emoji, label, true)} />
      </ChatMessageActions>
      <ChatMessageReactions className={`${styles.reactions}${reactions.length ? "" : ` ${styles.emptyReactions}`}`}>
        {reactions.map((reaction) => (
          <ChatMessageReaction
            key={reaction.emoji}
            className={styles.reaction}
            emoji={reaction.emoji}
            count={reaction.count}
            isActive={reaction.active}
            aria-label={`${reaction.label} reaction to ${author}’s message`}
            onClick={() => {
              toggleReaction(reaction.emoji, reaction.label);
              if (reaction.active && reaction.count === 1) requestAnimationFrame(() => {
                actionsRef.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')?.focus({ preventScroll: true });
              });
            }}
          />
        ))}
        <ReactionPicker location="footer" author={author} onSelect={(emoji, label) => toggleReaction(emoji, label, true)} />
      </ChatMessageReactions>
    </>
  );
}
