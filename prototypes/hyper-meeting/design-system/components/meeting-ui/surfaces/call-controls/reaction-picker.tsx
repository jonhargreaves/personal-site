"use client";

import { type ReactNode, useId } from "react";

import { HyperReactHoverDuotone } from "../../../../icons/index";

import { Button } from "../../../button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "../../../popover";
import { cn } from "../../../../lib/utils";

import { useControllableState } from "../../../primitive/use-controllable-state";
import { ControlButton } from "./controls";
import { MeetingReactionIcon } from "./meeting-reaction-icon";
import type {
  ButtonVariant,
  CallControlsButtonButtonProps,
  ControlSize,
} from "./types";

export type MeetingReactionOption = {
  readonly emoji: string;
  readonly id: string;
  readonly label: string;
};

export const meetingReactionOptions = [
  { emoji: "👍", id: "plus-one", label: "Thumbs up" },
  { emoji: "❤️", id: "heart", label: "Love" },
  { emoji: "👏", id: "clap", label: "Applause" },
  { emoji: "🎉", id: "celebrate", label: "Celebrate" },
  { emoji: "😂", id: "laugh", label: "Laugh" },
  { emoji: "😮", id: "wow", label: "Wow" },
  { emoji: "🤔", id: "thinking", label: "Thinking" },
  { emoji: "😢", id: "sad", label: "Sad" },
  { emoji: "👎", id: "minus-one", label: "Thumbs down" },
] as const satisfies readonly MeetingReactionOption[];

export type CallControlsReactionPickerProps = {
  readonly buttonClassName?: string;
  readonly buttonProps?: CallControlsButtonButtonProps;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly defaultOpen?: boolean;
  readonly disabled?: boolean;
  readonly hoverIcon?: ReactNode;
  readonly icon?: ReactNode;
  readonly id?: string;
  readonly label?: string;
  readonly onOpenChange?: (open: boolean) => void;
  readonly onReactionSelect: (reaction: MeetingReactionOption) => void;
  readonly open?: boolean;
  readonly options?: readonly MeetingReactionOption[];
  readonly tooltipText?: string;
};

type CallControlsReactionPickerInternalProps =
  CallControlsReactionPickerProps & {
    readonly showLabels: boolean;
    readonly showTooltips: boolean;
    readonly size: ControlSize;
    readonly variant: ButtonVariant;
  };

export function CallControlsReactionPicker({
  buttonClassName,
  buttonProps,
  className,
  contentClassName,
  defaultOpen = false,
  disabled = false,
  hoverIcon = <HyperReactHoverDuotone className="size-5" />,
  icon = <MeetingReactionIcon className="size-5" />,
  id = "reactions",
  label = "React",
  onOpenChange,
  onReactionSelect,
  open: openProp,
  options = meetingReactionOptions,
  showLabels,
  showTooltips,
  size,
  tooltipText = "Send a reaction",
  variant,
}: CallControlsReactionPickerInternalProps) {
  const contentId = useId();
  const [open = false, setOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  });

  return (
    <Popover
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
      }}
      open={open}
    >
      <PopoverAnchor asChild>
        <ControlButton
          buttonClassName={buttonClassName}
          buttonProps={{
            ...buttonProps,
            "aria-controls": contentId,
            "aria-expanded": open,
            "aria-haspopup": "dialog",
          }}
          className={className}
          disabled={disabled}
          hyperElId={id}
          hoverIcon={hoverIcon}
          hoverIconMotion="rotate"
          icon={icon}
          isActive={open}
          label={label}
          onClick={() => {
            setOpen(!open);
          }}
          showLabel={showLabels}
          showTooltip={showTooltips}
          size={size}
          tooltipText={tooltipText}
          variant={variant}
        />
      </PopoverAnchor>
      <PopoverContent
        align="center"
        aria-label="Reactions"
        className={cn(
          "w-[min(22rem,calc(100vw-1rem))] rounded-xl border-white/10 bg-neutral-950/95 p-1.5 text-neutral-50 shadow-2xl backdrop-blur-xl motion-reduce:animate-none",
          contentClassName
        )}
        id={contentId}
        side="top"
        sideOffset={12}
      >
        <div
          aria-label="Reactions"
          className="grid grid-flow-col auto-cols-fr gap-0.5"
          role="group"
        >
          {options.map((reaction) => (
            <Button
              aria-label={reaction.label}
              className="group/reaction aspect-square h-auto w-full rounded-lg border border-transparent bg-transparent p-0 text-neutral-300 transition-[transform,background-color,border-color,color] duration-150 ease-out hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.09] hover:text-white active:translate-y-0 active:scale-[0.96] motion-reduce:transform-none motion-reduce:transition-none"
              data-reaction-id={reaction.id}
              data-slot="call-controls-reaction-option"
              disabled={disabled}
              key={reaction.id}
              onClick={() => {
                onReactionSelect(reaction);
              }}
              type="button"
              variant="ghost"
            >
              <span
                aria-hidden
                className="text-lg leading-none transition-transform duration-150 ease-out group-hover/reaction:scale-110 motion-reduce:transform-none motion-reduce:transition-none sm:text-xl"
              >
                {reaction.emoji}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
