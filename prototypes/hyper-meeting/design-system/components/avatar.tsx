"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { GradientAvatar } from "@outpacelabs/avatars";
import type * as React from "react";

import { cn } from "../lib/utils";

export type AvatarStatus = "online" | "offline" | "busy" | "away";

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  /** Optional status indicator */
  status?: AvatarStatus;
  /** Size of the status indicator. Defaults to "sm" */
  statusSize?: "xs" | "sm" | "md";
  /** Position of the status indicator. Defaults to "bottom-right" */
  statusPosition?: "bottom-right" | "top-right";
};

function Avatar({
  className,
  status,
  statusSize = "sm",
  statusPosition = "bottom-right",
  children,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-visible rounded-full",
        className
      )}
      data-slot="avatar"
      {...props}
    >
      <div className="size-full overflow-hidden rounded-[inherit]">
        {children}
      </div>
      {status && (
        <AvatarStatusIndicator
          position={statusPosition}
          size={statusSize}
          status={status}
        />
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square size-full rounded-[inherit] outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10",
        className
      )}
      data-slot="avatar-image"
      {...props}
    />
  );
}

export type AvatarFallbackProps = React.ComponentProps<
  typeof AvatarPrimitive.Fallback
> & {
  /**
   * Stable user identifier used to render a deterministic gradient when the
   * avatar image is unavailable.
   */
  gradientSeed?: number | string;
  /** Render size used to tune the gradient blur. Defaults to 32px. */
  gradientSize?: number;
};

function AvatarFallback({
  children,
  className,
  gradientSeed,
  gradientSize = 32,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "relative flex size-full items-center justify-center overflow-hidden rounded-full bg-muted",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    >
      {gradientSeed === undefined ? (
        children
      ) : (
        <>
          <GradientAvatar
            className="absolute inset-0 !block !size-full"
            radius="inherit"
            seed={gradientSeed}
            size={gradientSize}
          />
          {children ? <span className="sr-only">{children}</span> : null}
        </>
      )}
    </AvatarPrimitive.Fallback>
  );
}

type AvatarStatusIndicatorProps = {
  status: AvatarStatus;
  size?: "xs" | "sm" | "md";
  position?: "bottom-right" | "top-right";
  className?: string;
};

function AvatarStatusIndicator({
  status,
  size = "sm",
  position = "bottom-right",
  className,
}: AvatarStatusIndicatorProps) {
  return (
    <span
      className={cn(
        "absolute rounded-full border-2 border-background",
        // Size variants
        size === "xs" && "size-2.5",
        size === "sm" && "size-3",
        size === "md" && "size-3.5",
        // Position variants
        position === "bottom-right" && "right-0 bottom-0",
        position === "top-right" && "-top-0.5 right-0",
        // Status colors
        status === "online" && "bg-success",
        status === "offline" && "bg-neutral-400",
        status === "busy" && "bg-destructive",
        status === "away" && "bg-warning",
        className
      )}
      data-slot="avatar-status"
    >
      <span className="sr-only">
        {status === "online" && "Online"}
        {status === "offline" && "Offline"}
        {status === "busy" && "Busy"}
        {status === "away" && "Away"}
      </span>
    </span>
  );
}

export { Avatar, AvatarFallback, AvatarImage, AvatarStatusIndicator };
