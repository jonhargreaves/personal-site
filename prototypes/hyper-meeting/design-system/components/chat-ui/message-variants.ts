import { cva } from "class-variance-authority";

export const chatMessageContainerVariants = cva("relative flex gap-3", {
  variants: {
    state: {
      default: "",
      pending: "opacity-60",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const chatMessageAvatarVariants = cva("mt-0.5 flex-shrink-0", {
  variants: {
    size: {
      lg: "size-10",
      md: "size-8",
      sm: "size-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const chatMessageAvatarFallbackVariants = cva("font-medium text-white", {
  variants: {
    size: {
      lg: "text-sm",
      md: "text-xs",
      sm: "text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const chatMessageHeaderVariants = cva(
  "mb-1 flex items-baseline gap-1.5",
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

export const chatMessageAuthorVariants = cva(
  "font-medium text-muted-foreground text-sm leading-none",
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

export const chatMessageTimestampVariants = cva(
  "text-muted-foreground/80 text-sm leading-none",
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

export const chatMessageBubbleVariants = cva(
  "overflow-wrap-anywhere w-fit max-w-full min-w-0 whitespace-pre-wrap break-words text-foreground text-sm leading-5",
  {
    variants: {
      variant: {
        default: "rounded-lg border border-border bg-card px-3 py-2",
        minimal: "px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const chatMessageActionsVariants = cva(
  "mt-1 w-fit gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within/message:opacity-100 sm:group-hover/message:opacity-100",
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

export const chatMessageReactionVariants = cva(
  "inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border px-2 font-medium text-sm leading-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/35",
  {
    variants: {
      state: {
        active:
          "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15",
        default:
          "border-border/70 bg-background/70 text-foreground hover:bg-muted",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export const chatMessageReactionAddButtonVariants = cva(
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/70 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 aria-expanded:bg-muted aria-expanded:text-foreground",
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

export const chatMessageReactionsVariants = cva(
  "mt-2 w-fit flex-wrap gap-1 rounded-full bg-transparent p-0",
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

export const chatMessageContentVariants = cva("min-w-0 flex-1", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
