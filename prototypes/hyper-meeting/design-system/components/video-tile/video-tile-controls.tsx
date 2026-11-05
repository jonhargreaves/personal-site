import type { ReactNode } from "react";

import {
  LucideMic,
  LucideMicOff,
  LucideVideo,
  LucideVideoOff,
} from "../../icons/index";

import { cn } from "../../lib/utils";

interface VideoTileControlsProps {
  /** Additional controls to render (e.g., face zoom toggle) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether audio is currently enabled */
  isAudioEnabled?: boolean;
  /** Whether video is currently enabled */
  isVideoEnabled?: boolean;
  /** Callback when audio toggle is clicked */
  onToggleAudio?: () => void;
  /** Callback when video toggle is clicked */
  onToggleVideo?: () => void;
}

/**
 * VideoTileControls provides overlay media controls for a composed video tile,
 * including mic and camera toggles.
 *
 * @example
 * ```tsx
 * <VideoTileRoot>
 *   <VideoTileVideo stream={stream} />
 *   <VideoTileControls
 *     isAudioEnabled={audioEnabled}
 *     isVideoEnabled={videoEnabled}
 *     onToggleAudio={toggleAudio}
 *     onToggleVideo={toggleVideo}
 *   >
 *     <FaceZoomToggle />
 *   </VideoTileControls>
 * </VideoTileRoot>
 * ```
 */
export function VideoTileControls({
  isAudioEnabled = true,
  isVideoEnabled = true,
  onToggleAudio,
  onToggleVideo,
  children,
  className,
}: VideoTileControlsProps) {
  return (
    <div className={cn("absolute inset-x-0 bottom-0 z-20 p-3", className)}>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          {/* Microphone Toggle */}
          {onToggleAudio && (
            <button
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg transition-colors sm:h-9 sm:w-9",
                isAudioEnabled
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
              onClick={onToggleAudio}
              type="button"
            >
              {isAudioEnabled ? (
                <LucideMic className="h-4 w-4" />
              ) : (
                <LucideMicOff className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Camera Toggle */}
          {onToggleVideo && (
            <button
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg transition-colors sm:h-9 sm:w-9",
                isVideoEnabled
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
              onClick={onToggleVideo}
              type="button"
            >
              {isVideoEnabled ? (
                <LucideVideo className="h-4 w-4" />
              ) : (
                <LucideVideoOff className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Additional controls (e.g., face zoom toggle) */}
          {children}
        </div>
      </div>
    </div>
  );
}
