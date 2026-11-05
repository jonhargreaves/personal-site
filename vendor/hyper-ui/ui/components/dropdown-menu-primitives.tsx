"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import React from "react";

import {
  LucideCheck,
  LucideChevronRight,
  LucideCircle,
} from "../../icons/index";

import { cn } from "../lib/utils";

import {
  menuItemClassName,
  menuItemHighlightClassName,
  menuItemSubmenuClassName,
} from "./menu/styles";
import {
  anchoredPopupMotionClassName,
  popupMotionClassName,
} from "./primitive/popup-motion";
import { Slot } from "./primitive/slot";
import { Spinner } from "./spinner";

type SlottableProps<T> = T & {
  asChild?: boolean;
};

type DropdownMenuAutoFocusEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

type DropdownMenuSelectEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

function createPreventableEvent() {
  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
  };

  return event;
}

const DropdownMenuOwnerContext = React.createContext<string | null>(null);
const menuItemInteractionClassName = `${menuItemHighlightClassName} ${menuItemSubmenuClassName}`;

function DropdownMenu({
  onOpenChange,
  ...props
}: Omit<React.ComponentProps<typeof MenuPrimitive.Root>, "children"> & {
  children?: React.ReactNode;
}) {
  const ownerId = React.useId();
  const handleOpenChange: NonNullable<
    React.ComponentProps<typeof MenuPrimitive.Root>["onOpenChange"]
  > = (open, eventDetails) => {
    const eventTarget = eventDetails.event?.target;
    const isPortaledSubmenuPress =
      !open &&
      eventDetails.reason === "outside-press" &&
      eventTarget instanceof Element &&
      eventTarget
        .closest('[data-slot="dropdown-menu-sub-content"]')
        ?.getAttribute("data-dropdown-menu-owner") === ownerId;

    if (isPortaledSubmenuPress) {
      eventDetails.cancel();
      return;
    }

    onOpenChange?.(open, eventDetails);
  };

  return (
    <DropdownMenuOwnerContext.Provider value={ownerId}>
      <MenuPrimitive.Root
        data-slot="dropdown-menu"
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DropdownMenuOwnerContext.Provider>
  );
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Portal>) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof MenuPrimitive.Trigger>>) {
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

type DropdownMenuContentProps = Omit<
  React.ComponentProps<typeof MenuPrimitive.Popup>,
  "children"
> &
  Pick<
    React.ComponentProps<typeof MenuPrimitive.Positioner>,
    | "align"
    | "alignOffset"
    | "anchor"
    | "arrowPadding"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "collisionPadding"
    | "disableAnchorTracking"
    | "positionMethod"
    | "side"
    | "sideOffset"
    | "sticky"
  > & {
    children?: React.ReactNode;
    onCloseAutoFocus?: (event: DropdownMenuAutoFocusEvent) => void;
    sameWidth?: boolean;
    unmountOnHide?: boolean;
  };

function DropdownMenuContent({
  align = "center",
  alignOffset = 0,
  anchor,
  arrowPadding,
  children,
  className,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  disableAnchorTracking,
  finalFocus,
  onCloseAutoFocus,
  positionMethod,
  sameWidth,
  side = "bottom",
  sideOffset = 4,
  sticky,
  unmountOnHide,
  ...props
}: DropdownMenuContentProps) {
  const resolvedFinalFocus = onCloseAutoFocus
    ? () => {
        const event = createPreventableEvent();
        onCloseAutoFocus(event);
        return !event.defaultPrevented;
      }
    : finalFocus;

  return (
    <MenuPrimitive.Portal
      data-slot="dropdown-menu-portal"
      keepMounted={unmountOnHide === false}
    >
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        arrowPadding={arrowPadding}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        disableAnchorTracking={disableAnchorTracking}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
        style={{ zIndex: 60 }}
      >
        <MenuPrimitive.Popup
          className={cn(
            popupMotionClassName,
            anchoredPopupMotionClassName,
            "z-50 max-h-(--available-height) w-max max-w-(--available-width) min-w-[8rem] origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-[12px] border bg-popover p-1 text-popover-foreground shadow-md",
            sameWidth && "w-(--anchor-width)",
            className
          )}
          data-slot="dropdown-menu-content"
          finalFocus={resolvedFinalFocus}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return (
    <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props}>
      {children}
    </MenuPrimitive.Group>
  );
}

function DropdownMenuItem({
  asChild = false,
  className,
  inset,
  onClick,
  onSelect,
  render,
  selected,
  variant = "default",
  ...props
}: SlottableProps<React.ComponentProps<typeof MenuPrimitive.Item>> & {
  inset?: boolean;
  onSelect?: (event: DropdownMenuSelectEvent) => void;
  selected?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      className={cn(
        menuItemClassName,
        "data-[variant=destructive]:*:[svg]:!text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:text-destructive data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 dark:data-[variant=destructive]:data-[highlighted]:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        menuItemInteractionClassName,
        selected && "text-foreground",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      onClick={(event) => {
        const selectEvent = createPreventableEvent();
        onSelect?.(selectEvent);

        if (selectEvent.defaultPrevented) {
          // SAFETY: Base UI augments the click event delivered to its item
          // handler with preventBaseUIHandler; the method is optional because
          // this compatibility path also accepts ordinary React click events.
          (
            event as { preventBaseUIHandler?: () => void }
          ).preventBaseUIHandler?.();
        }

        onClick?.(event);
      }}
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        menuItemClassName,
        "group pr-2 pl-8 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        menuItemInteractionClassName,
        className
      )}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center rounded-[4px] border border-input shadow-xs group-data-[checked]:border-primary group-data-[checked]:bg-primary group-data-[checked]:text-primary-foreground">
        <MenuPrimitive.CheckboxItemIndicator>
          <LucideCheck className="size-3" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  indicator = "circle",
  indicatorPosition = "left",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & {
  indicator?: "check" | "circle" | "spinner";
  indicatorPosition?: "left" | "right";
}) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(
        menuItemClassName,
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        indicatorPosition === "left" ? "pr-2 pl-8" : "pr-8 pl-2",
        menuItemInteractionClassName,
        className
      )}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute flex size-4 items-center justify-center",
          indicatorPosition === "left" ? "left-2" : "right-2"
        )}
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          {indicator === "spinner" ? (
            <Spinner
              aria-hidden
              className="size-4"
              data-slot="dropdown-menu-radio-item-spinner"
            />
          ) : indicator === "check" ? (
            <LucideCheck className="size-4" />
          ) : (
            <LucideCircle className="size-2 fill-current" />
          )}
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-sm data-inset:pl-8",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest",
        className
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubmenuRoot>) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  asChild = false,
  className,
  children,
  inset,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger>> & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={cn(
        menuItemClassName,
        "data-[inset]:pl-8 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        menuItemInteractionClassName,
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      render={asChild ? <Slot /> : render}
      {...props}
    >
      {children}
      <LucideChevronRight className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

type DropdownMenuSubContentProps = Omit<
  React.ComponentProps<typeof MenuPrimitive.Popup>,
  "children"
> &
  Pick<
    React.ComponentProps<typeof MenuPrimitive.Positioner>,
    | "align"
    | "alignOffset"
    | "anchor"
    | "arrowPadding"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "collisionPadding"
    | "disableAnchorTracking"
    | "positionMethod"
    | "side"
    | "sideOffset"
    | "sticky"
  > & {
    children?: React.ReactNode;
    onCloseAutoFocus?: (event: DropdownMenuAutoFocusEvent) => void;
  };

function DropdownMenuSubContent({
  align = "center",
  alignOffset = 0,
  anchor,
  arrowPadding,
  children,
  className,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  disableAnchorTracking,
  finalFocus,
  onCloseAutoFocus,
  positionMethod,
  side = "right",
  sideOffset = 4,
  sticky,
  ...props
}: DropdownMenuSubContentProps) {
  const ownerId = React.useContext(DropdownMenuOwnerContext);
  const resolvedFinalFocus = onCloseAutoFocus
    ? () => {
        const event = createPreventableEvent();
        onCloseAutoFocus(event);
        return !event.defaultPrevented;
      }
    : finalFocus;

  return (
    <MenuPrimitive.Portal data-slot="dropdown-menu-sub-portal">
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        arrowPadding={arrowPadding}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        disableAnchorTracking={disableAnchorTracking}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
        style={{ zIndex: 60 }}
      >
        <MenuPrimitive.Popup
          className={cn(
            popupMotionClassName,
            anchoredPopupMotionClassName,
            "z-50 w-max max-w-(--available-width) min-w-[8rem] origin-(--transform-origin) overflow-hidden rounded-[12px] border bg-popover p-1 text-popover-foreground shadow-lg",
            className
          )}
          data-slot="dropdown-menu-sub-content"
          finalFocus={resolvedFinalFocus}
          {...props}
          data-dropdown-menu-owner={ownerId ?? undefined}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
