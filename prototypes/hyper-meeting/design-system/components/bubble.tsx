"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext } from "react";
import type * as React from "react";

import { cn } from "../lib/utils";

export type BubbleAlign = "end" | "start";

export const bubbleGroupVariants = cva("flex min-w-0 flex-col", {
  variants: {
    variant: {
      default: "gap-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const bubbleVariants = cva(
  "group/bubble relative flex max-w-full min-w-0 flex-col",
  {
    variants: {
      align: {
        end: "items-end",
        start: "items-start",
      },
      variant: {
        default: "",
        minimal: "",
        muted: "",
      },
    },
    defaultVariants: {
      align: "start",
      variant: "default",
    },
  }
);

export const bubbleContentVariants = cva(
  "overflow-wrap-anywhere w-fit max-w-full min-w-0 break-words text-sm leading-normal wrap-break-word",
  {
    variants: {
      variant: {
        default:
          "rounded-lg border border-border bg-card px-3 py-2 text-foreground",
        muted:
          "rounded-3xl border border-transparent bg-muted px-3.5 py-2.5 text-foreground",
        minimal: "px-0 py-0 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const bubbleReactionsVariants = cva(
  "z-10 flex w-fit shrink-0 items-center justify-center gap-0.5 text-sm leading-none",
  {
    variants: {
      align: {
        end: "",
        start: "",
      },
      placement: {
        flow: "mt-1 flex-wrap rounded-full bg-background px-2 py-1 shadow-xs ring-[3px] ring-background",
        overlay:
          "absolute rounded-full bg-background px-2 py-1 shadow-xs ring-[5px] ring-background",
      },
      side: {
        bottom: "",
        top: "",
      },
    },
    compoundVariants: [
      {
        align: "end",
        className: "self-end",
        placement: "flow",
      },
      {
        align: "start",
        className: "self-start",
        placement: "flow",
      },
      {
        align: "end",
        className: "right-3",
        placement: "overlay",
      },
      {
        align: "start",
        className: "left-3",
        placement: "overlay",
      },
      {
        className: "bottom-0 translate-y-1/2",
        placement: "overlay",
        side: "bottom",
      },
      {
        className: "top-0 -translate-y-1/2",
        placement: "overlay",
        side: "top",
      },
    ],
    defaultVariants: {
      align: "end",
      placement: "overlay",
      side: "bottom",
    },
  }
);

type BubbleVariant = NonNullable<
  VariantProps<typeof bubbleContentVariants>["variant"]
>;

const BubbleVariantContext = createContext<BubbleVariant>("default");

export type BubbleGroupProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof bubbleGroupVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function BubbleGroup({
  className,
  ref,
  variant,
  ...props
}: BubbleGroupProps) {
  return (
    <div
      className={cn(bubbleGroupVariants({ variant }), className)}
      data-slot="bubble-group"
      data-variant={variant}
      ref={ref}
      {...props}
    />
  );
}

export type BubbleProps = Omit<React.ComponentPropsWithoutRef<"div">, "align"> &
  Omit<VariantProps<typeof bubbleVariants>, "variant"> & {
    readonly align?: BubbleAlign;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly variant?: BubbleVariant;
  };

export function Bubble({
  align = "start",
  className,
  ref,
  variant,
  ...props
}: BubbleProps) {
  return (
    <BubbleVariantContext.Provider value={variant ?? "default"}>
      <div
        className={cn(bubbleVariants({ align, variant }), className)}
        data-align={align}
        data-slot="bubble"
        data-variant={variant}
        ref={ref}
        {...props}
      />
    </BubbleVariantContext.Provider>
  );
}

export type BubbleContentProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof bubbleContentVariants> & {
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function BubbleContent({
  className,
  ref,
  variant,
  ...props
}: BubbleContentProps) {
  const contextVariant = useContext(BubbleVariantContext);
  const resolvedVariant = variant ?? contextVariant;

  return (
    <div
      className={cn(
        bubbleContentVariants({ variant: resolvedVariant }),
        className
      )}
      data-slot="bubble-content"
      data-variant={resolvedVariant}
      ref={ref}
      {...props}
    />
  );
}

export type BubbleReactionsProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "align"
> &
  VariantProps<typeof bubbleReactionsVariants> & {
    readonly align?: BubbleAlign;
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function BubbleReactions({
  align = "end",
  className,
  placement = "overlay",
  ref,
  side = "bottom",
  ...props
}: BubbleReactionsProps) {
  return (
    <div
      className={cn(
        bubbleReactionsVariants({ align, placement, side }),
        className
      )}
      data-align={align}
      data-placement={placement}
      data-side={side}
      data-slot="bubble-reactions"
      ref={ref}
      {...props}
    />
  );
}
