"use client";

import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
  type MessageScrollerDefaultScrollPosition,
  type MessageScrollerScrollAlign,
  type MessageScrollerScrollable,
  type MessageScrollerScrollOptions,
  type MessageScrollerVisibilityState,
} from "@shadcn/react/message-scroller";
import type * as React from "react";

import { LucideArrowDown } from "../icons/index";

import { Button, type ButtonProps } from "./button";
import { cn } from "../lib/utils";

export type MessageScrollerProviderProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Provider
>;

export function MessageScrollerProvider(props: MessageScrollerProviderProps) {
  return <MessageScrollerPrimitive.Provider {...props} />;
}

export type MessageScrollerProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Root
>;

export function MessageScroller({ className, ...props }: MessageScrollerProps) {
  return (
    <MessageScrollerPrimitive.Root
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      data-slot="message-scroller"
      {...props}
    />
  );
}

export type MessageScrollerViewportProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Viewport
>;

export function MessageScrollerViewport({
  className,
  ...props
}: MessageScrollerViewportProps) {
  return (
    <MessageScrollerPrimitive.Viewport
      className={cn(
        "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] contain-content data-autoscrolling:[scrollbar-width:none] data-autoscrolling:[&::-webkit-scrollbar]:hidden",
        className
      )}
      data-slot="message-scroller-viewport"
      {...props}
    />
  );
}

export type MessageScrollerContentProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Content
>;

export function MessageScrollerContent({
  className,
  ...props
}: MessageScrollerContentProps) {
  return (
    <MessageScrollerPrimitive.Content
      className={cn("flex h-max min-h-full flex-col", className)}
      data-slot="message-scroller-content"
      {...props}
    />
  );
}

export type MessageScrollerItemProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Item
>;

export function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: MessageScrollerItemProps) {
  return (
    <MessageScrollerPrimitive.Item
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      {...props}
    />
  );
}

export type MessageScrollerButtonProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Button
> &
  Pick<ButtonProps, "size" | "variant">;

export function MessageScrollerButton({
  children,
  className,
  direction = "end",
  render,
  size = "icon",
  variant = "secondary",
  ...props
}: MessageScrollerButtonProps) {
  return (
    <MessageScrollerPrimitive.Button
      className={cn(
        "absolute end-4 z-10 border-border bg-background text-foreground shadow-sm transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-300 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full data-[direction=start]:[&_svg]:rotate-180",
        className
      )}
      data-direction={direction}
      data-size={size}
      data-slot="message-scroller-button"
      data-variant={variant}
      direction={direction}
      render={render ?? <Button size={size} type="button" variant={variant} />}
      {...props}
    >
      {children ?? (
        <span className="contents" key="scroll-button-content">
          <LucideArrowDown className="size-4" />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </span>
      )}
    </MessageScrollerPrimitive.Button>
  );
}

export {
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};

export type {
  MessageScrollerDefaultScrollPosition,
  MessageScrollerScrollAlign,
  MessageScrollerScrollable,
  MessageScrollerScrollOptions,
  MessageScrollerVisibilityState,
};
