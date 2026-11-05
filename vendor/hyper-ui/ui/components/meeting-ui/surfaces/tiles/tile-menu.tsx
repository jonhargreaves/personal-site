"use client";

import {
  createContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useContext,
  useMemo,
} from "react";

import {
  LucideMaximize2,
  LucideMinimize2,
  LucideMoreHorizontal,
  LucidePin,
} from "../../../../../icons/index";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../dropdown-menu";
import { cn } from "../../../../lib/utils";

import { useOptionalMeetingTile } from "./tile-context";
import type { MeetingTileMenuActionModel } from "./tile-types";
import { meetingTileMenuTriggerVariants } from "./tile-variants";

export type MeetingTileMenuActionContextValue = {
  readonly action: MeetingTileMenuActionModel;
};

const MeetingTileMenuActionContext =
  createContext<MeetingTileMenuActionContextValue | null>(null);

export type MeetingTileMenuActionProviderProps = {
  readonly action: MeetingTileMenuActionModel;
  readonly children: ReactNode;
};

export function MeetingTileMenuActionProvider({
  action,
  children,
}: MeetingTileMenuActionProviderProps) {
  const value = useMemo(() => ({ action }), [action]);

  return (
    <MeetingTileMenuActionContext.Provider value={value}>
      {children}
    </MeetingTileMenuActionContext.Provider>
  );
}

export function useOptionalMeetingTileMenuAction() {
  return useContext(MeetingTileMenuActionContext);
}

export function useMeetingTileMenuAction(
  componentName = "MeetingTileMenuAction component"
) {
  const context = useOptionalMeetingTileMenuAction();

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside MeetingTileMenuActionProvider.`
    );
  }

  return context;
}

function getMeetingTileMenuActionVariant(action: MeetingTileMenuActionModel) {
  return action.tone === "destructive" ? "destructive" : "default";
}

export function shouldRenderMeetingTileMenuActionSeparator(
  actions: readonly MeetingTileMenuActionModel[],
  index: number
) {
  return index > 0 && actions[index - 1]?.group !== actions[index]?.group;
}

export interface MeetingParticipantTileMenuProps extends ComponentPropsWithoutRef<
  typeof DropdownMenu
> {
  readonly children?: ReactNode;
  readonly isFocused?: boolean;
  readonly isPinned?: boolean;
  readonly onToggleFocus?: () => void;
  readonly onTogglePin?: () => void;
}

export function MeetingParticipantTileMenu({
  children,
  isFocused: isFocusedProp,
  isPinned: isPinnedProp,
  onToggleFocus: onToggleFocusProp,
  onTogglePin: onTogglePinProp,
  ...props
}: MeetingParticipantTileMenuProps) {
  const context = useOptionalMeetingTile();
  const isFocused = isFocusedProp ?? context?.isFocused;
  const isPinned = isPinnedProp ?? context?.isPinned;
  const onToggleFocus = onToggleFocusProp ?? context?.onToggleFocus;
  const onTogglePin = onTogglePinProp ?? context?.onTogglePin;

  if (
    isFocused === undefined ||
    isPinned === undefined ||
    !onToggleFocus ||
    !onTogglePin
  ) {
    throw new Error(
      "MeetingParticipantTileMenu requires focus and pin props or MeetingTileProvider."
    );
  }

  return (
    <DropdownMenu {...props}>
      <MeetingTileMenuTrigger />
      <MeetingTileMenuContent>
        <MeetingTileMenuPinItem isPinned={isPinned} onSelect={onTogglePin} />
        <MeetingTileMenuFocusItem
          isFocused={isFocused}
          onSelect={onToggleFocus}
        />
        {children}
      </MeetingTileMenuContent>
    </DropdownMenu>
  );
}

export type MeetingTileMenuTriggerProps = ComponentPropsWithoutRef<"button"> & {
  readonly ref?: Ref<HTMLButtonElement>;
};

export function MeetingTileMenuTrigger({
  className,
  ref,
  title = "More options",
  ...props
}: MeetingTileMenuTriggerProps) {
  return (
    <DropdownMenuTrigger asChild>
      <button
        className={meetingTileMenuTriggerVariants({ className })}
        ref={ref}
        title={title}
        type="button"
        {...props}
      >
        <LucideMoreHorizontal className="size-4" />
      </button>
    </DropdownMenuTrigger>
  );
}

export type MeetingTileMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuContent
> & {
  readonly ref?: Ref<HTMLDivElement>;
};

export function MeetingTileMenuContent({
  align = "end",
  children,
  className,
  ref,
  ...props
}: MeetingTileMenuContentProps) {
  return (
    <DropdownMenuContent
      align={align}
      className={cn("w-52", className)}
      data-slot="meeting-tile-menu-content"
      ref={ref}
      {...props}
    >
      {children}
    </DropdownMenuContent>
  );
}

export type MeetingTileMenuFocusItemProps = Omit<
  ComponentPropsWithoutRef<typeof DropdownMenuItem>,
  "children" | "onSelect"
> & {
  readonly isFocused: boolean;
  readonly onSelect: () => void;
};

export function MeetingTileMenuFocusItem({
  isFocused,
  onSelect,
  ...props
}: MeetingTileMenuFocusItemProps) {
  return (
    <DropdownMenuItem onSelect={onSelect} {...props}>
      {isFocused ? (
        <LucideMinimize2 className="size-4" />
      ) : (
        <LucideMaximize2 className="size-4" />
      )}
      {isFocused ? "Minimize" : "Maximize"}
    </DropdownMenuItem>
  );
}

export type MeetingTileMenuPinItemProps = Omit<
  ComponentPropsWithoutRef<typeof DropdownMenuItem>,
  "children" | "onSelect"
> & {
  readonly isPinned: boolean;
  readonly onSelect: () => void;
};

export function MeetingTileMenuPinItem({
  isPinned,
  onSelect,
  ...props
}: MeetingTileMenuPinItemProps) {
  return (
    <DropdownMenuItem onSelect={onSelect} {...props}>
      <LucidePin className="size-4" />
      {isPinned ? "Unpin" : "Pin"}
    </DropdownMenuItem>
  );
}

export type MeetingTileMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuItem
> & {
  readonly ref?: Ref<HTMLDivElement>;
};

export function MeetingTileMenuItem({
  ref,
  ...props
}: MeetingTileMenuItemProps) {
  return <DropdownMenuItem ref={ref} {...props} />;
}

export type MeetingTileMenuActionItemProps = Omit<
  MeetingTileMenuItemProps,
  "children" | "disabled" | "onSelect" | "variant"
> & {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly onSelect?: MeetingTileMenuItemProps["onSelect"];
  readonly variant?: MeetingTileMenuItemProps["variant"];
};

export function MeetingTileMenuActionItem({
  children,
  disabled,
  onSelect,
  variant,
  ...props
}: MeetingTileMenuActionItemProps) {
  const { action } = useMeetingTileMenuAction("MeetingTileMenuActionItem");

  return (
    <MeetingTileMenuItem
      {...props}
      data-hyper-elid={action.id}
      disabled={disabled || action.disabled || !action.onSelect}
      onSelect={(event) => {
        onSelect?.(event);

        if (!event.defaultPrevented) {
          action.onSelect?.();
        }
      }}
      variant={variant ?? getMeetingTileMenuActionVariant(action)}
    >
      {children ?? (
        <>
          {action.icon}
          {action.label}
        </>
      )}
    </MeetingTileMenuItem>
  );
}

export type MeetingTileMenuActionsProps = {
  readonly actions: readonly MeetingTileMenuActionModel[];
  readonly children?: ReactNode;
  readonly leadingSeparator?: boolean;
};

export function MeetingTileMenuActions({
  actions,
  children,
  leadingSeparator = true,
}: MeetingTileMenuActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      {leadingSeparator ? <MeetingTileMenuSeparator /> : null}
      {actions.map((action, index) => (
        <MeetingTileMenuActionProvider action={action} key={action.id}>
          {shouldRenderMeetingTileMenuActionSeparator(actions, index) ? (
            <MeetingTileMenuSeparator />
          ) : null}
          {children ?? <MeetingTileMenuActionItem />}
        </MeetingTileMenuActionProvider>
      ))}
    </>
  );
}

export type MeetingTileMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuSeparator
> & {
  readonly ref?: Ref<HTMLDivElement>;
};

export function MeetingTileMenuSeparator({
  className,
  ref,
  ...props
}: MeetingTileMenuSeparatorProps) {
  return (
    <DropdownMenuSeparator
      className={cn("bg-border", className)}
      ref={ref}
      {...props}
    />
  );
}
