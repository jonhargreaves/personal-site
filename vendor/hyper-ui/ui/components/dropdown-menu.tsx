"use client";

import type { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import React, { isValidElement, useState } from "react";

import { LucideCheck, LucideGripVertical } from "../../icons/index";

import * as Predicate from "../lib/predicate";
import { retainKnownValues } from "../lib/retain-known-values";
import { cn } from "../lib/utils";

import {
  DropdownMenu as Menu,
  DropdownMenuGroup as Group,
  DropdownMenuItem as Item,
} from "./dropdown-menu-primitives";
import { menuItemClassName, menuItemPointerClassName } from "./menu/styles";

export {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
} from "./dropdown-menu-primitives";

type SlottableProps<T> = T & { asChild?: boolean };

type DropdownMenuSelectEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

const SortableContext = React.createContext(false);

function DropdownMenu({
  sortable = false,
  ...props
}: Omit<React.ComponentProps<typeof MenuPrimitive.Root>, "children"> & {
  children?: React.ReactNode;
  sortable?: boolean;
}) {
  if (sortable)
    return (
      <SortableContext.Provider value={true}>
        <Menu {...props} />
      </SortableContext.Provider>
    );
  return <Menu {...props} />;
}

export type SortableDropdownMenuGroupProps<T> = {
  onSort: (items: T[]) => void;
  children: React.ReactNode;
};

const SortableDropdownMenuGroup = <T,>({
  onSort,
  children,
}: SortableDropdownMenuGroupProps<T>) => {
  const childrenArray = React.Children.toArray(children);
  const items = childrenArray
    .filter((child): child is React.ReactElement<{ value?: T }> =>
      isValidElement<{ value?: T }>(child)
    )
    .map((child) => child.props.value)
    .filter((value): value is T => value !== undefined);

  const [parentRef] = useDragAndDrop<HTMLDivElement, T>(items, {
    onSort: (ev) => {
      const values = retainKnownValues(items, ev.values);
      onSort(values);
    },
  });

  return (
    <div className="p-1" ref={parentRef}>
      {children}
    </div>
  );
};

function DropdownMenuGroup<T = unknown>({
  onSort,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Group> & {
  onSort?: (items: T[]) => void;
}) {
  const isSortable = React.useContext(SortableContext);
  if (isSortable && onSort) {
    return (
      <SortableDropdownMenuGroup onSort={onSort}>
        {children}
      </SortableDropdownMenuGroup>
    );
  }
  return <Group {...props}>{children}</Group>;
}

function DropdownMenuItem<T = unknown>({
  asChild = false,
  className,
  inset,
  onClick,
  onSelect,
  render,
  selected,
  variant = "default",
  value,
  ...props
}: SlottableProps<React.ComponentProps<typeof MenuPrimitive.Item>> & {
  inset?: boolean;
  onSelect?: (event: DropdownMenuSelectEvent) => void;
  selected?: boolean;
  value?: T;
  variant?: "default" | "destructive";
}) {
  const isSortable = React.useContext(SortableContext);

  if (isSortable) {
    const stringValue = Predicate.isString(value)
      ? value
      : JSON.stringify(value);
    // SAFETY: this branch renders the sortable div adapter; onClick and the
    // remaining props originated from this Menu item and are forwarded without
    // changing their event or DOM value semantics.
    return (
      <SortableDropdownMenuItem
        className={Predicate.isString(className) ? className : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLDivElement> | undefined}
        selected={selected}
        value={stringValue}
        {...(props as SortableDropdownMenuItemProps)}
      />
    );
  }

  return (
    <Item
      asChild={asChild}
      className={className}
      inset={inset}
      onClick={onClick}
      onSelect={onSelect}
      render={render}
      selected={selected}
      variant={variant}
      {...props}
    />
  );
}
export type SortableDropdownMenuItemProps = {
  disabled?: boolean;
  className?: string;
  size?: number;
  label?: string;
  selected?: boolean;
  sortable?: boolean;
  value?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const SortableDropdownMenuItem = ({
  disabled = false,
  children,
  className,
  selected,
  label,
  size = 16,
  onClick,
  ...props
}: SortableDropdownMenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      role="option"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled ? "" : undefined}
      aria-selected={selected}
      aria-label={props["aria-label"] ?? label}
      data-label={props.value}
      className={cn(
        menuItemClassName,
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selected && "text-foreground",
        menuItemPointerClassName,
        className
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      onMouseDown={() => setIsHovered(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseUp={() => setIsHovered(false)}
    >
      {isHovered ? (
        <LucideGripVertical
          className="h-4 w-4 cursor-grab text-current"
          size={size}
        />
      ) : selected ? (
        <LucideCheck className="h-4 w-4 text-current" size={size} />
      ) : (
        <div className="h-4 w-4" style={{ width: size }} />
      )}
      {children}
    </div>
  );
};

export {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  SortableDropdownMenuGroup,
  SortableDropdownMenuItem,
};
