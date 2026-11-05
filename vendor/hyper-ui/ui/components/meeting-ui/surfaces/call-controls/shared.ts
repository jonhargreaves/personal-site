import { cva, type VariantProps } from "class-variance-authority";
import { useCallback, useEffect, useRef } from "react";

import type { AnimatedIconHandle } from "./icons";
import type { ButtonVariant, ControlSize, DeviceOption } from "./types";

export function getControlSizeClasses(size: ControlSize) {
  const sizeClassMap = {
    sm: {
      badgeIconSize: "h-2.5 w-2.5",
      badgeSize: "h-5 w-5",
      buttonSize: "h-10 w-10",
      caretSize: "h-3 w-3",
      circularButtonSize: "h-10 w-10",
      controlGap: "gap-2",
      gap: "gap-1",
      iconSize: "size-5",
      labelSize: "text-xs leading-none",
    },
    md: {
      badgeIconSize: "h-[11px] w-[11px]",
      badgeSize: "h-[22px] w-[22px]",
      buttonSize: "h-11 w-11",
      caretSize: "h-3.5 w-3.5",
      circularButtonSize: "h-12 w-12",
      controlGap: "gap-2",
      gap: "gap-1",
      iconSize: "size-5",
      labelSize: "text-sm",
    },
    lg: {
      badgeIconSize: "h-3 w-3",
      badgeSize: "h-6 w-6",
      buttonSize: "h-12 w-12",
      caretSize: "h-4 w-4",
      circularButtonSize: "h-14 w-14",
      controlGap: "gap-2",
      gap: "gap-1",
      iconSize: "size-5.5",
      labelSize: "text-base",
    },
  } as const;

  return sizeClassMap[size];
}

export function getButtonSizeClass(size: ControlSize, variant: ButtonVariant) {
  const { buttonSize, circularButtonSize } = getControlSizeClasses(size);
  return variant === "circular" ? circularButtonSize : buttonSize;
}

/**
 * Shared CVA for control-button chrome used by `ControlButton`,
 * `MobilePreviewButton`, and media toggle surfaces.
 *
 * Size classes (`h-10 w-10`, etc.) are intentionally excluded — callers merge
 * them via `cn()` so the multi-slot size tokens in `getControlSizeClasses`
 * keep working as-is.
 */
export const controlButtonVariants = cva(
  // non-scaling-stroke makes stroke-width mean CSS pixels after the
  // viewBox transform, so every icon draws a true 1.5px stroke at any
  // rendered size instead of inheriting its viewBox scale.
  "flex items-center justify-center transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [&_[stroke]]:[stroke-width:1.5] [&_[stroke]]:[vector-effect:non-scaling-stroke]",
  {
    variants: {
      size: {
        sm: "[&_svg]:size-5",
        md: "[&_svg]:size-5",
        lg: "[&_svg]:size-5.5",
      },
      variant: {
        circular: "rounded-full border border-border/50 backdrop-blur-sm",
        default: "rounded-lg",
      },
      tone: {
        default: "",
        active: "",
        accent: "",
        danger: "",
        mediaOff: "",
        panelActive: "",
        primary: "",
        warning: "",
      },
      disabled: {
        true: "pointer-events-none",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      // — disabled overrides (tone is irrelevant) —
      {
        variant: "circular",
        disabled: true,
        className: "border-white/10 bg-neutral-900/55 text-neutral-500",
      },
      {
        variant: "default",
        disabled: true,
        className: "bg-muted/35 text-muted-foreground/60",
      },
      // — circular tones (enabled) —
      {
        variant: "circular",
        tone: "default",
        disabled: false,
        className:
          "border-border bg-background text-neutral-100 shadow-xs pointer-fine:hover:border-input pointer-fine:hover:bg-[#212121] pointer-fine:hover:text-white pointer-fine:hover:shadow-md active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "circular",
        tone: "active",
        disabled: false,
        className:
          "border-border bg-background text-neutral-100 shadow-xs pointer-fine:hover:border-input pointer-fine:hover:bg-[#212121] pointer-fine:hover:text-white pointer-fine:hover:shadow-md active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "circular",
        tone: "panelActive",
        disabled: false,
        className:
          "border-accent-foreground/20 bg-[linear-gradient(color-mix(in_oklab,var(--accent-foreground)_10%,transparent),color-mix(in_oklab,var(--accent-foreground)_10%,transparent)),linear-gradient(var(--background),var(--background))] text-accent-foreground shadow-xs pointer-fine:hover:border-accent-foreground/20 pointer-fine:hover:bg-[linear-gradient(color-mix(in_oklab,var(--accent-foreground)_20%,transparent),color-mix(in_oklab,var(--accent-foreground)_20%,transparent)),linear-gradient(var(--background),var(--background))] pointer-fine:hover:text-accent-foreground pointer-fine:hover:shadow-md active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "circular",
        tone: "accent",
        disabled: false,
        className:
          "border-primary bg-primary text-primary-foreground shadow-xs transition-[color,background-color,border-color,box-shadow] pointer-fine:hover:border-primary pointer-fine:hover:bg-indigo-600 pointer-fine:hover:text-primary-foreground pointer-fine:hover:shadow-md active:scale-[0.96] motion-reduce:active:scale-100 [&_path[fill]:not([stroke])]:opacity-20",
      },
      {
        variant: "circular",
        tone: "danger",
        disabled: false,
        className:
          "border-destructive/20 bg-destructive/10 text-destructive pointer-fine:hover:border-destructive/20 pointer-fine:hover:bg-destructive/20 pointer-fine:hover:text-destructive active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "circular",
        tone: "mediaOff",
        disabled: false,
        className:
          "border-destructive/20 bg-destructive/10 text-destructive pointer-fine:hover:border-destructive/20 pointer-fine:hover:bg-destructive/20 pointer-fine:hover:text-destructive active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "circular",
        tone: "primary",
        disabled: false,
        className:
          "border-primary/30 bg-primary/20 text-primary pointer-fine:hover:border-primary/40 pointer-fine:hover:bg-primary/25 pointer-fine:hover:text-primary active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "circular",
        tone: "warning",
        disabled: false,
        className:
          "border-warning/25 bg-warning text-warning-foreground pointer-fine:hover:border-warning/40 pointer-fine:hover:bg-warning/90 pointer-fine:hover:text-warning-foreground active:scale-[0.96] motion-reduce:active:scale-100",
      },
      // — default tones (enabled) —
      {
        variant: "default",
        tone: "default",
        disabled: false,
        className:
          "text-muted-foreground pointer-fine:hover:bg-foreground/10 pointer-fine:hover:text-foreground active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "active",
        disabled: false,
        className:
          "bg-foreground/75 text-background pointer-fine:hover:bg-foreground/85 active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "panelActive",
        disabled: false,
        className:
          "border border-accent-foreground/20 bg-accent-foreground/10 text-accent-foreground shadow-xs pointer-fine:hover:border-accent-foreground/20 pointer-fine:hover:bg-accent-foreground/20 pointer-fine:hover:text-accent-foreground pointer-fine:hover:shadow-md active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "accent",
        disabled: false,
        className:
          "bg-success/10 text-success pointer-fine:hover:bg-success/20 pointer-fine:hover:text-success active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "danger",
        disabled: false,
        className:
          "text-destructive pointer-fine:hover:bg-destructive/15 pointer-fine:hover:text-destructive active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "mediaOff",
        disabled: false,
        className:
          "bg-destructive/10 text-destructive pointer-fine:hover:bg-destructive/15 pointer-fine:hover:text-destructive active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "primary",
        disabled: false,
        className:
          "bg-primary/15 text-primary pointer-fine:hover:bg-primary/20 pointer-fine:hover:text-primary active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        variant: "default",
        tone: "warning",
        disabled: false,
        className:
          "bg-warning text-warning-foreground ring-1 ring-warning/30 pointer-fine:hover:bg-warning/90 pointer-fine:hover:text-warning-foreground active:scale-[0.96] motion-reduce:active:scale-100",
      },
    ],
    defaultVariants: {
      size: "sm",
      variant: "default",
      tone: "default",
      disabled: false,
    },
  }
);

export type ControlButtonVariants = VariantProps<typeof controlButtonVariants>;

export const floatingCallControlButtonVariants = cva(
  "size-11 rounded-full border shadow-lg backdrop-blur-xl [&_[stroke]]:[stroke-width:1.5] [&_[stroke]]:[vector-effect:non-scaling-stroke]",
  {
    variants: {
      disabled: {
        false: "",
        true: "border-white/10 bg-black/35 text-white/40",
      },
      tone: {
        accent: "",
        active: "",
        danger: "",
        default: "",
        panelActive: "",
        primary: "",
      },
    },
    compoundVariants: [
      {
        disabled: false,
        tone: "default",
        className:
          "border-white/10 bg-black/45 text-white pointer-fine:hover:bg-black/65 pointer-fine:hover:text-white",
      },
      {
        disabled: false,
        tone: "active",
        className:
          "border-white/80 bg-white text-neutral-950 pointer-fine:hover:bg-white/90 pointer-fine:hover:text-black",
      },
      {
        disabled: false,
        tone: "panelActive",
        className:
          "border-accent-foreground/20 bg-accent-foreground/10 text-accent-foreground pointer-fine:hover:bg-accent-foreground/20 pointer-fine:hover:text-accent-foreground",
      },
      {
        disabled: false,
        tone: "accent",
        className:
          "border-success/40 bg-success text-success-foreground pointer-fine:hover:bg-success/90 pointer-fine:hover:text-success-foreground",
      },
      {
        disabled: false,
        tone: "danger",
        className:
          "border-destructive/40 bg-destructive text-destructive-foreground pointer-fine:hover:bg-destructive/90 pointer-fine:hover:text-destructive-foreground",
      },
      {
        disabled: false,
        tone: "primary",
        className:
          "border-primary/40 bg-primary text-primary-foreground pointer-fine:hover:bg-primary/90 pointer-fine:hover:text-primary-foreground",
      },
    ],
    defaultVariants: {
      disabled: false,
      tone: "default",
    },
  }
);

export type FloatingCallControlButtonVariants = VariantProps<
  typeof floatingCallControlButtonVariants
>;

export function getSelectedDeviceName(
  devices: readonly DeviceOption[],
  selectedId: string,
  emptyLabel: string
) {
  return (
    devices.find((device) => device.deviceId === selectedId)?.label ??
    emptyLabel
  );
}

export function useTimedIconAnimation(
  iconRef: React.RefObject<AnimatedIconHandle | null>,
  prefersReducedMotion: boolean,
  duration = 700
) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(() => {
    if (prefersReducedMotion) {
      return;
    }

    iconRef.current?.startAnimation();

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      iconRef.current?.stopAnimation();
      timeoutRef.current = null;
    }, duration);
  }, [duration, iconRef, prefersReducedMotion]);
}
