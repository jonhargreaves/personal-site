"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";
import { useOptionalChatComposer } from "./composer-context";

export const chatComposerInputRootVariants = cva(
  "flex h-full w-full flex-col overflow-hidden rounded-lg bg-neutral-4 outline-none transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const chatComposerInputScrollAreaVariants = cva(
  "relative min-h-12 flex-1 cursor-text overflow-y-auto flex flex-col border-0 bg-inherit px-1 py-0.5",
  {
    variants: {
      disabled: {
        false: "",
        true: "cursor-not-allowed opacity-50",
      },
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      disabled: false,
      variant: "default",
    },
  }
);

export const chatComposerInputFrameVariants = cva("relative h-full", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatComposerInputPlaceholderVariants = cva(
  "pointer-events-none absolute inset-0 px-3 py-3 text-muted-foreground text-sm leading-5",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const chatComposerInputEditableVariants = cva(
  "h-full rounded-none border-none px-3 py-3 text-neutral-alpha-1-12 text-sm leading-5 outline-none focus:outline-none",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const chatComposerInputToolbarSlotVariants = cva("flex-shrink-0", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ChatComposerInputRootProps =
  React.ComponentPropsWithoutRef<"form"> &
    VariantProps<typeof chatComposerInputRootVariants> & {
      readonly ref?: React.Ref<HTMLFormElement>;
    };

export function ChatComposerInputRoot({
  className,
  onSubmit,
  ref,
  variant,
  ...props
}: ChatComposerInputRootProps) {
  const composer = useOptionalChatComposer();

  return (
    <form
      className={cn(chatComposerInputRootVariants({ variant }), className)}
      data-slot="chat-composer-input-root"
      onSubmit={(event) => {
        onSubmit?.(event);

        if (event.defaultPrevented || !composer?.onSend) {
          return;
        }

        event.preventDefault();
        if (composer.disabled) {
          return;
        }

        composer.onSend();
      }}
      ref={ref}
      {...props}
    />
  );
}

export type ChatComposerInputScrollAreaProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof chatComposerInputScrollAreaVariants> & {
      readonly ref?: React.Ref<HTMLDivElement>;
    };

export function ChatComposerInputScrollArea({
  className,
  disabled,
  ref,
  variant,
  ...props
}: ChatComposerInputScrollAreaProps) {
  return (
    <div
      className={cn(
        chatComposerInputScrollAreaVariants({ disabled, variant }),
        className
      )}
      data-slot="chat-composer-input-scroll-area"
      ref={ref}
      {...props}
    />
  );
}

export type ChatComposerInputFrameProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof chatComposerInputFrameVariants> & {
      readonly ref?: React.Ref<HTMLDivElement>;
      readonly showPlaceholder?: boolean;
    };

export function ChatComposerInputFrame({
  className,
  ref,
  showPlaceholder,
  variant,
  ...props
}: ChatComposerInputFrameProps) {
  return (
    <div
      className={cn(chatComposerInputFrameVariants({ variant }), className)}
      data-editor-empty={showPlaceholder || undefined}
      data-slot="chat-composer-input-frame"
      ref={ref}
      {...props}
    />
  );
}

export type ChatComposerInputPlaceholderProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof chatComposerInputPlaceholderVariants> & {
      readonly ref?: React.Ref<HTMLDivElement>;
    };

export function ChatComposerInputPlaceholder({
  className,
  ref,
  variant,
  ...props
}: ChatComposerInputPlaceholderProps) {
  return (
    <div
      className={cn(
        chatComposerInputPlaceholderVariants({ variant }),
        className
      )}
      data-slot="chat-composer-input-placeholder"
      ref={ref}
      {...props}
    />
  );
}

export type ChatComposerInputToolbarSlotProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof chatComposerInputToolbarSlotVariants> & {
      readonly ref?: React.Ref<HTMLDivElement>;
    };

export function ChatComposerInputToolbarSlot({
  className,
  ref,
  variant,
  ...props
}: ChatComposerInputToolbarSlotProps) {
  return (
    <div
      className={cn(
        chatComposerInputToolbarSlotVariants({ variant }),
        className
      )}
      data-slot="chat-composer-input-toolbar-slot"
      ref={ref}
      {...props}
    />
  );
}
