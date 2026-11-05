import {
  type MutableRefObject,
  memo,
  type Ref,
  useCallback,
  useMemo,
  useState,
} from "react";

import * as Predicate from "../../lib/predicate";

import {
  type RecoveryReason,
  useVideoPlaybackRecovery,
} from "../../hooks/use-video-playback-recovery";
import { cn } from "../../lib/utils";
import { useStreamBinding } from "./use-stream-binding";

export type VideoTileFaceZoomStyles = {
  containerStyle: React.CSSProperties;
  transformStyle: React.CSSProperties;
  wrapperStyle: React.CSSProperties;
  videoStyle: React.CSSProperties;
};

export interface VideoTileVideoProps {
  ariaLabel?: string;
  className?: string;
  faceZoomStyles?: VideoTileFaceZoomStyles;
  hideUntilReady?: boolean;
  mirrored?: boolean;
  objectFit?: "cover" | "contain";
  onDimensionsChange?: (aspectRatio: number) => void;
  onEscalate?: (reason: RecoveryReason) => void;
  onPlayingChange?: (playing: boolean) => void;
  onReadyChange?: (ready: boolean) => void;
  recoveryEnabled?: boolean;
  ref?: Ref<HTMLVideoElement>;
  stream: MediaStream | null;
}

function mergeTransform(
  transform: React.CSSProperties["transform"],
  extraTransform: string
) {
  if (!transform) return extraTransform;
  return `${transform} ${extraTransform}`;
}

export const VideoTileVideo = memo(
  function VideoTileVideo({
    stream,
    objectFit = "cover",
    mirrored = false,
    className,
    faceZoomStyles,
    hideUntilReady = false,
    onReadyChange,
    onPlayingChange,
    onDimensionsChange,
    onEscalate,
    recoveryEnabled = true,
    ref,
    ariaLabel,
  }: VideoTileVideoProps) {
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
      null
    );

    const setRefs = useCallback(
      (node: HTMLVideoElement | null) => {
        setVideoElement(node);

        if (!ref) return;
        if (Predicate.isFunction(ref)) {
          ref(node);
          return;
        }
        // SAFETY: React's Ref union contains only callback refs and ref objects;
        // after the callback branch, this object ref owns the writable current
        // slot for the same HTMLVideoElement node.
        (ref as MutableRefObject<HTMLVideoElement | null>).current = node;
      },
      [ref]
    );

    const recoveryRef = useMemo(
      () => ({
        current: videoElement,
      }),
      [videoElement]
    );

    useVideoPlaybackRecovery(recoveryRef, stream, {
      enabled: recoveryEnabled,
      onEscalate,
    });

    const { isReady } = useStreamBinding(videoElement, stream, {
      onDimensionsChange,
      onPlayingChange,
      onReadyChange,
    });

    const visibilityStyle = hideUntilReady && !isReady ? "hidden" : "visible";

    if (faceZoomStyles) {
      const mergedContainerStyle: React.CSSProperties = {
        ...faceZoomStyles.containerStyle,
        visibility: visibilityStyle,
      };

      if (mirrored) {
        mergedContainerStyle.transform = mergeTransform(
          mergedContainerStyle.transform,
          "scaleX(-1)"
        );
      }

      return (
        <div className={className} style={mergedContainerStyle}>
          <div style={faceZoomStyles.transformStyle}>
            <div style={faceZoomStyles.wrapperStyle}>
              <video
                aria-label={ariaLabel}
                autoPlay
                draggable={false}
                muted
                playsInline
                ref={setRefs}
                style={faceZoomStyles.videoStyle}
              />
            </div>
          </div>
        </div>
      );
    }

    const fitClass =
      objectFit === "contain" ? "object-contain" : "object-cover";

    return (
      <video
        aria-label={ariaLabel}
        autoPlay
        className={cn("h-full w-full", fitClass, className)}
        draggable={false}
        muted
        playsInline
        ref={setRefs}
        style={{
          maxWidth: "unset",
          maxHeight: "unset",
          minWidth: "100%",
          minHeight: "100%",
          transform: `translate(-50%, -50%)${mirrored ? " scaleX(-1)" : ""}`,
          transformOrigin: "center center",
          position: "absolute",
          top: "50%",
          left: "50%",
          visibility: visibilityStyle,
        }}
      />
    );
  }
);
