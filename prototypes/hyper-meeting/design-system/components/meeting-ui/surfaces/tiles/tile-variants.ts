import { cva } from "class-variance-authority";

export const meetingParticipantTileRootVariants = cva("group", {
  variants: {
    floating: {
      false: "",
      true: "border border-neutral-700",
    },
    variant: {
      default: "",
      fullBleed: "rounded-none before:rounded-none",
    },
  },
  compoundVariants: [
    {
      floating: true,
      variant: "fullBleed",
      className: "rounded-2xl before:rounded-2xl",
    },
  ],
  defaultVariants: {
    floating: false,
    variant: "default",
  },
});

export const meetingParticipantTileContentVariants = cva(
  "relative h-full w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800",
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

export const meetingTileFallbackVariants = cva(
  "bg-neutral-200 dark:bg-neutral-800",
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

export const meetingTileMenuTriggerVariants = cva(
  "absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-md bg-white/60 text-foreground opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 dark:bg-black/40",
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

export const meetingTileNameOverlayVariants = cva(
  "absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-white/60 px-2 py-1 backdrop-blur-md transition-opacity duration-150 @sm/video-tile:bottom-3 @sm/video-tile:left-3 @sm/video-tile:gap-2 @sm/video-tile:rounded-sm @sm/video-tile:bg-background/80 @sm/video-tile:px-3 @sm/video-tile:py-2 dark:bg-black/40 @sm/video-tile:dark:bg-background/80",
  {
    variants: {
      floating: {
        false: "",
        true: "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
      },
    },
    defaultVariants: {
      floating: false,
    },
  }
);

export const meetingTileScreenShareBadgeVariants = cva(
  "absolute top-3 left-3 flex items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-foreground text-xs backdrop-blur-md dark:bg-black/40",
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

export const meetingTileVideoLoadingOverlayVariants = cva(
  "absolute inset-0 flex items-center justify-center",
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

export const meetingTileVideoVariants = cva("absolute inset-0 h-full w-full", {
  variants: {
    mirrored: {
      false: "",
      true: "-scale-x-100",
    },
    objectFit: {
      contain: "object-contain",
      cover: "object-cover",
    },
  },
  defaultVariants: {
    mirrored: false,
    objectFit: "cover",
  },
});
