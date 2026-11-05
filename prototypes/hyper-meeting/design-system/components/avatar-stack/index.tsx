import type * as React from "react";

import { cn } from "../../lib/utils";

type AvatarStackStyle = React.CSSProperties & {
  "--avatar-stack-overlap": string;
  "--avatar-stack-size": string;
};

export type AvatarStackProps = React.ComponentProps<"div"> & {
  animate?: boolean;
  overlap?: number;
  size?: number;
};

export function AvatarStack({
  animate = false,
  className,
  overlap = 6,
  size = 40,
  style,
  ...props
}: AvatarStackProps) {
  const stackStyle: AvatarStackStyle = {
    "--avatar-stack-overlap": `${overlap}px`,
    "--avatar-stack-size": `${size}px`,
    ...style,
  };

  return (
    <div
      className={cn(
        "flex items-center [&>[data-slot=avatar-stack-item]+[data-slot=avatar-stack-item]]:ml-[calc(var(--avatar-stack-overlap)*-1)] [&>[data-slot=avatar-stack-overflow]]:ml-[calc(var(--avatar-stack-overlap)*-1)]",
        animate &&
          "pointer-fine:hover:[&>[data-slot=avatar-stack-item]]:ml-0 pointer-fine:hover:[&>[data-slot=avatar-stack-overflow]]:ml-0 [&>[data-slot=avatar-stack-item]]:transition-[margin] [&>[data-slot=avatar-stack-overflow]]:transition-[margin] motion-reduce:[&>[data-slot=avatar-stack-item]]:transition-none motion-reduce:[&>[data-slot=avatar-stack-overflow]]:transition-none",
        className
      )}
      data-animate={animate ? "true" : undefined}
      data-slot="avatar-stack"
      style={stackStyle}
      {...props}
    />
  );
}

export type AvatarStackItemProps = React.ComponentProps<"div">;

export function AvatarStackItem({
  className,
  style,
  ...props
}: AvatarStackItemProps) {
  const itemStyle: React.CSSProperties = {
    height: "var(--avatar-stack-size)",
    width: "var(--avatar-stack-size)",
    ...style,
  };

  return (
    <div
      className={cn(
        "relative shrink-0 [mask-image:radial-gradient(circle_calc(var(--avatar-stack-size)*0.575)_at_calc(var(--avatar-stack-size)+var(--avatar-stack-overlap)/2)_50%,transparent_99%,black_100%)] [-webkit-mask-image:radial-gradient(circle_calc(var(--avatar-stack-size)*0.575)_at_calc(var(--avatar-stack-size)+var(--avatar-stack-overlap)/2)_50%,transparent_99%,black_100%)] last:[mask-image:none] last:[-webkit-mask-image:none] [&_[data-slot=avatar]]:size-full",
        className
      )}
      data-slot="avatar-stack-item"
      style={itemStyle}
      {...props}
    />
  );
}

export type AvatarStackOverflowProps = React.ComponentProps<"span">;

export function AvatarStackOverflow({
  className,
  ...props
}: AvatarStackOverflowProps) {
  return (
    <span
      className={cn(
        "relative z-10 inline-flex h-[var(--avatar-stack-size)] min-w-[var(--avatar-stack-size)] shrink-0 items-center justify-center rounded-full bg-border px-1 font-medium text-muted-foreground text-xs dark:bg-[color-mix(in_oklab,var(--border)_95%,white_5%)]",
        className
      )}
      data-slot="avatar-stack-overflow"
      {...props}
    />
  );
}
