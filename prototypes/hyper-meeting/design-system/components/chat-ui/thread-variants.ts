import { cva } from "class-variance-authority";

export const chatViewportVariants = cva("flex min-h-0 flex-1 flex-col", {
  variants: {
    variant: {
      default: "",
      meeting: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatThreadComposerSlotVariants = cva("border-t p-3", {
  variants: {
    variant: {
      default: "bg-popover",
      meeting: "border-border bg-popover dark:bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatThreadComposerInputVariants = cva(
  "border transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
  {
    variants: {
      variant: {
        default: "border-border bg-neutral-4",
        meeting:
          "rounded-[18px] border-border bg-secondary focus-within:ring-ring/45 dark:bg-input/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const chatThreadEmptyRegionVariants = cva("min-h-0 flex-1", {
  variants: {
    variant: {
      default: "",
      meeting: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatThreadEmptyStateVariants = cva("h-full gap-4 px-6 py-10", {
  variants: {
    variant: {
      default: "",
      meeting: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatThreadMessageBodyVariants = cva(
  "text-popover-foreground text-sm leading-5 [&_ol]:space-y-1 [&_ul]:space-y-1",
  {
    variants: {
      variant: {
        default: "",
        meeting: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const chatThreadMessagesVariants = cva("space-y-5 px-4 pt-3 pb-16", {
  variants: {
    variant: {
      default: "",
      meeting: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatThreadPanelVariants = cva("relative flex h-full flex-col", {
  variants: {
    variant: {
      default: "",
      meeting: "bg-popover text-popover-foreground dark:bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const chatThreadScrollAreaVariants = cva("min-h-0 flex-1", {
  variants: {
    variant: {
      default: "",
      meeting: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
