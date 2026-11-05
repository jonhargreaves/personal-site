import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

type OverlayPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

interface VideoTileOverlayProps {
  /** Content to display in the overlay */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Position of the overlay within the tile */
  position?: OverlayPosition;
}

const positionClasses = {
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
} satisfies Record<OverlayPosition, string>;

/**
 * VideoTileOverlay provides a positioned overlay container for name badges,
 * status indicators, or action buttons within a composed video tile.
 *
 * @example
 * ```tsx
 * <VideoTileRoot>
 *   <VideoTileVideo stream={stream} />
 *   <VideoTileOverlay position="bottom-left">
 *     <span className="text-sm">John Doe</span>
 *   </VideoTileOverlay>
 *   <VideoTileOverlay position="top-right">
 *     <button>Fullscreen</button>
 *   </VideoTileOverlay>
 * </VideoTileRoot>
 * ```
 */
export function VideoTileOverlay({
  position = "bottom-left",
  children,
  className,
}: VideoTileOverlayProps) {
  return (
    <div
      className={cn(
        "absolute z-20 rounded-sm bg-background/80 px-3 py-2 backdrop-blur-md",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  );
}
