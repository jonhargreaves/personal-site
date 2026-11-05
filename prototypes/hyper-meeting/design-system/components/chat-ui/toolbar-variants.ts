import { cva } from "class-variance-authority";

export const chatToolbarRootVariants = cva(
  "flex w-full items-center justify-between rounded-b-lg border-t border-border/70 bg-inherit px-2 py-1.5",
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

export const chatToolbarGroupVariants = cva(
  "flex items-center gap-0.5 overflow-x-auto",
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

export const chatToolbarIconButtonVariants = cva(
  "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md font-medium text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      pressed: {
        false: "",
        true: "bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      pressed: false,
    },
  }
);

export const chatToolbarSendButtonVariants = cva(
  "size-8 cursor-pointer rounded-full text-muted-foreground hover:bg-muted hover:text-primary",
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
