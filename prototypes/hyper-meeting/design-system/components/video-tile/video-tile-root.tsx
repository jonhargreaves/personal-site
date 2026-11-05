import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/utils";

interface VideoTileRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isSpeaking?: boolean;
}

export function VideoTileRoot({
  children,
  isSpeaking = false,
  className,
  ...props
}: VideoTileRootProps) {
  return (
    <div
      className={cn(
        "@container/video-tile group relative h-full w-full overflow-hidden rounded-lg",
        "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-lg before:transition-opacity before:duration-300",
        "before:ring-3 before:ring-primary before:ring-inset",
        isSpeaking ? "before:opacity-100" : "before:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
