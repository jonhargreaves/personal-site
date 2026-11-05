"use client";

import { type RefObject, useEffect, useLayoutEffect, useState } from "react";

import {
  MEETING_SIDE_PANEL_TRANSITION_MS,
  MEETING_SIDE_PANEL_TRANSITION_EASING,
} from "../side-panel/side-panel-constants";

export const MEETING_TILE_GRID_GAP = 8;
export const MEETING_TILE_GRID_PADDING = 0;
export const MEETING_TILE_GRID_TRANSITION_EASING =
  MEETING_SIDE_PANEL_TRANSITION_EASING;
export const MEETING_TILE_GRID_TRANSITION_MS = MEETING_SIDE_PANEL_TRANSITION_MS;
export const MEETING_TILE_GRID_TRANSITION_SAMPLE_BUFFER_MS = 80;

export type MeetingTileGridLayoutDimensions = {
  readonly containerHeight: number;
  readonly containerWidth: number;
  readonly gap: number;
  readonly padding: number;
};

export type MeetingTileGridDimensionsOptions = {
  readonly gap?: number;
  readonly padding?: number;
  readonly transitionKey?: string | number;
  readonly transitionMs?: number;
  readonly transitionSampleBufferMs?: number;
};

export function getMeetingTileGridLayoutDimensions(
  element: HTMLElement | null,
  options: {
    readonly gap?: number;
    readonly padding?: number;
  } = {}
): MeetingTileGridLayoutDimensions | null {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const containerHeight = Math.round(rect.height);
  const containerWidth = Math.round(rect.width);

  if (containerHeight <= 0 || containerWidth <= 0) {
    return null;
  }

  return {
    containerHeight,
    containerWidth,
    gap: options.gap ?? MEETING_TILE_GRID_GAP,
    padding: options.padding ?? MEETING_TILE_GRID_PADDING,
  };
}

export function hasSameMeetingTileGridLayoutDimensions(
  current: MeetingTileGridLayoutDimensions | null,
  next: MeetingTileGridLayoutDimensions
) {
  return (
    current?.containerHeight === next.containerHeight &&
    current.containerWidth === next.containerWidth &&
    current.gap === next.gap &&
    current.padding === next.padding
  );
}

export function useMeetingTileGridDimensions(
  containerRef: RefObject<HTMLElement | null>,
  {
    gap = MEETING_TILE_GRID_GAP,
    padding = MEETING_TILE_GRID_PADDING,
    transitionKey,
    transitionMs = MEETING_TILE_GRID_TRANSITION_MS,
    transitionSampleBufferMs = MEETING_TILE_GRID_TRANSITION_SAMPLE_BUFFER_MS,
  }: MeetingTileGridDimensionsOptions = {}
) {
  const [containerDimensions, setContainerDimensions] =
    useState<MeetingTileGridLayoutDimensions | null>(null);
  const [isSamplingTransition, setIsSamplingTransition] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateDimensions = () => {
      const nextDimensions = getMeetingTileGridLayoutDimensions(element, {
        gap,
        padding,
      });

      if (!nextDimensions) {
        return;
      }

      setContainerDimensions((current) =>
        hasSameMeetingTileGridLayoutDimensions(current, nextDimensions)
          ? current
          : nextDimensions
      );
    };

    updateDimensions();

    if (globalThis.ResizeObserver === undefined) {
      return;
    }

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, gap, padding]);

  useLayoutEffect(() => {
    if (transitionKey === undefined || globalThis.window === undefined) {
      return;
    }

    let frameId: number | null = null;
    let timeoutId: number | null = null;
    // Sampling must start before paint to track the sidebar layout transition.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSamplingTransition(true);

    const sampleTransitionFrame = () => {
      const nextDimensions = getMeetingTileGridLayoutDimensions(
        containerRef.current,
        { gap, padding }
      );

      if (nextDimensions) {
        setContainerDimensions((current) =>
          hasSameMeetingTileGridLayoutDimensions(current, nextDimensions)
            ? current
            : nextDimensions
        );
      }

      frameId = window.requestAnimationFrame(sampleTransitionFrame);
    };

    frameId = window.requestAnimationFrame(sampleTransitionFrame);

    timeoutId = window.setTimeout(() => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      setIsSamplingTransition(false);
    }, transitionMs + transitionSampleBufferMs);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    containerRef,
    gap,
    padding,
    transitionKey,
    transitionMs,
    transitionSampleBufferMs,
  ]);

  return {
    containerDimensions,
    isSamplingTransition,
  };
}
