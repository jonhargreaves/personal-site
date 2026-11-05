"use client";

import { useMemo, useRef } from "react";

import {
  type LayoutConfig,
  type Participant as TileLayoutParticipant,
  useTileLayout,
} from "../../../../../layout-engine/dist/index";

import {
  MEETING_TILE_GRID_GAP,
  MEETING_TILE_GRID_PADDING,
  MEETING_TILE_GRID_TRANSITION_EASING,
  MEETING_TILE_GRID_TRANSITION_MS,
  useMeetingTileGridDimensions,
} from "./tile-grid-layout";

export type MeetingTileLayoutItem = {
  readonly aspectRatio: number;
  readonly isSelf: boolean;
  readonly layoutId: string;
  readonly source: "camera" | "screen";
};

export type MeetingTileLayoutHorizontalAlignment = NonNullable<
  LayoutConfig["align"]
>;

export const MEETING_TILE_GRID_DENSE_MIN_ASPECT_RATIO = 0.5;

export type MeetingTileLayoutConfigOptions = {
  readonly align?: LayoutConfig["align"];
  readonly gap?: LayoutConfig["gap"];
  readonly lastRowPolicy?: LayoutConfig["lastRowPolicy"];
  readonly minTileAspectRatio?: LayoutConfig["minTileAspectRatio"];
  readonly padding?: LayoutConfig["padding"];
};

export type MeetingTileLayoutInput<
  TTile extends MeetingTileLayoutItem = MeetingTileLayoutItem,
> = {
  readonly focusedTileId: string | null;
  readonly gap?: LayoutConfig["gap"];
  readonly horizontalAlignment?: MeetingTileLayoutHorizontalAlignment;
  readonly lastRowPolicy?: LayoutConfig["lastRowPolicy"];
  readonly minTileAspectRatio?: LayoutConfig["minTileAspectRatio"];
  readonly padding?: LayoutConfig["padding"];
  readonly pinnedTileId: string | null;
  readonly tiles: readonly TTile[];
  readonly transitionKey?: string | number;
};

export const meetingTileLayoutConfig = {
  animationConfig: {
    duration: MEETING_TILE_GRID_TRANSITION_MS,
    easing: MEETING_TILE_GRID_TRANSITION_EASING,
    properties: ["transform", "width", "height"],
    triggers: {
      resize: {
        duration: MEETING_TILE_GRID_TRANSITION_MS,
        easing: MEETING_TILE_GRID_TRANSITION_EASING,
        enabled: true,
      },
    },
  },
  aspectRatioTracking: {
    debounceMs: 0,
    enabled: true,
  },
  debounceMs: 0,
  enableAnimations: true,
  gap: MEETING_TILE_GRID_GAP,
  maxTilesPerPage: 25,
  padding: MEETING_TILE_GRID_PADDING,
  prioritizeScreenShare: true,
  prioritizeSpeaker: true,
  stageAudienceConfig: {
    allowResize: true,
    maxStagePercent: 85,
    minStagePercent: 20,
    stageSize: 75,
  },
  // Hyper's Motion presence layer retains the complete tile model (including
  // its live media demand) through exit. Library retention here would retain
  // and animate the same departure a second time.
  tileTransitions: {
    exitRetention: false,
  },
} satisfies LayoutConfig;

export const meetingTileLayoutPanelTransitionConfig = {
  ...meetingTileLayoutConfig,
  animationConfig: {
    ...meetingTileLayoutConfig.animationConfig,
    triggers: {
      ...meetingTileLayoutConfig.animationConfig.triggers,
      resize: {
        ...meetingTileLayoutConfig.animationConfig.triggers.resize,
        enabled: false,
      },
    },
  },
} satisfies LayoutConfig;

export function getMeetingTileLayoutConfig({
  align,
  gap,
  lastRowPolicy,
  minTileAspectRatio,
  padding,
}: MeetingTileLayoutConfigOptions = {}) {
  if (
    align === undefined &&
    gap === undefined &&
    lastRowPolicy === undefined &&
    minTileAspectRatio === undefined &&
    padding === undefined
  ) {
    return meetingTileLayoutConfig;
  }

  const conditionalValue1_0 = {
    ...meetingTileLayoutConfig,
  };
  const conditionalValue1_1 =
    align === undefined
      ? conditionalValue1_0
      : {
          ...conditionalValue1_0,
          align,
        };
  const conditionalValue1_2 =
    gap === undefined
      ? conditionalValue1_1
      : {
          ...conditionalValue1_1,
          gap,
        };
  const conditionalValue1_3 =
    lastRowPolicy === undefined
      ? conditionalValue1_2
      : {
          ...conditionalValue1_2,
          lastRowPolicy,
        };
  const conditionalValue1_4 =
    padding === undefined
      ? conditionalValue1_3
      : {
          ...conditionalValue1_3,
          padding,
        };
  const conditionalValue1_5 = {
    ...conditionalValue1_4,
    minTileAspectRatio,
  };
  return conditionalValue1_5 satisfies LayoutConfig;
}

export function getMeetingTileLayoutConfigDuringTransition({
  align,
  gap,
  lastRowPolicy,
  minTileAspectRatio,
  padding,
}: MeetingTileLayoutConfigOptions = {}) {
  if (
    align === undefined &&
    gap === undefined &&
    lastRowPolicy === undefined &&
    minTileAspectRatio === undefined &&
    padding === undefined
  ) {
    return meetingTileLayoutPanelTransitionConfig;
  }

  const conditionalValue2_0 = {
    ...meetingTileLayoutPanelTransitionConfig,
  };
  const conditionalValue2_1 =
    align === undefined
      ? conditionalValue2_0
      : {
          ...conditionalValue2_0,
          align,
        };
  const conditionalValue2_2 =
    gap === undefined
      ? conditionalValue2_1
      : {
          ...conditionalValue2_1,
          gap,
        };
  const conditionalValue2_3 =
    lastRowPolicy === undefined
      ? conditionalValue2_2
      : {
          ...conditionalValue2_2,
          lastRowPolicy,
        };
  const conditionalValue2_4 =
    padding === undefined
      ? conditionalValue2_3
      : {
          ...conditionalValue2_3,
          padding,
        };
  const conditionalValue2_5 = {
    ...conditionalValue2_4,
    minTileAspectRatio,
  };
  return conditionalValue2_5 satisfies LayoutConfig;
}

export function getMeetingTileLayoutParticipants({
  focusedTileId,
  pinnedTileId,
  tiles,
}: Pick<
  MeetingTileLayoutInput,
  "focusedTileId" | "pinnedTileId" | "tiles"
>): TileLayoutParticipant[] {
  const activeTileIds = new Set(tiles.map((tile) => tile.layoutId));
  const activeFocusedTileId =
    focusedTileId !== null && activeTileIds.has(focusedTileId)
      ? focusedTileId
      : null;
  const activePinnedTileId =
    pinnedTileId !== null && activeTileIds.has(pinnedTileId)
      ? pinnedTileId
      : null;

  return tiles.map((tile) => ({
    aspectRatio: tile.aspectRatio,
    id: tile.layoutId,
    isOnStage: tile.layoutId === activeFocusedTileId,
    isPinned: tile.layoutId === activePinnedTileId,
    isScreenShare: tile.source === "screen",
    isSelf: tile.isSelf,
  }));
}

export function useMeetingTileLayout<
  TTile extends MeetingTileLayoutItem = MeetingTileLayoutItem,
>({
  focusedTileId,
  gap = MEETING_TILE_GRID_GAP,
  horizontalAlignment = "center",
  lastRowPolicy = "center",
  minTileAspectRatio,
  padding = MEETING_TILE_GRID_PADDING,
  pinnedTileId,
  tiles,
  transitionKey,
}: MeetingTileLayoutInput<TTile>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { containerDimensions, isSamplingTransition } =
    useMeetingTileGridDimensions(containerRef, {
      gap,
      padding,
      transitionKey,
    });

  const tileById = useMemo(
    () =>
      new Map(
        tiles.map((tile) => {
          return [tile.layoutId, tile] as const;
        })
      ),
    [tiles]
  );
  const layoutParticipants = useMemo(
    () =>
      getMeetingTileLayoutParticipants({
        focusedTileId,
        pinnedTileId,
        tiles,
      }),
    [focusedTileId, pinnedTileId, tiles]
  );
  const layoutConfig = useMemo(
    () =>
      isSamplingTransition
        ? getMeetingTileLayoutConfigDuringTransition({
            align: horizontalAlignment,
            gap,
            lastRowPolicy,
            minTileAspectRatio,
            padding,
          })
        : getMeetingTileLayoutConfig({
            align: horizontalAlignment,
            gap,
            lastRowPolicy,
            minTileAspectRatio,
            padding,
          }),
    [
      gap,
      horizontalAlignment,
      isSamplingTransition,
      lastRowPolicy,
      minTileAspectRatio,
      padding,
    ]
  );
  const tileLayout = useTileLayout(
    layoutParticipants,
    containerDimensions ?? containerRef,
    layoutConfig
  );

  return {
    containerRef,
    isSamplingPanelTransition: isSamplingTransition,
    tileById,
    tileLayout,
    tiles,
  };
}
