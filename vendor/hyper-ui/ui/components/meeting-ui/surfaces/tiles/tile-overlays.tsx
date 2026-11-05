"use client";

import {
  HugeCircleStarSolid,
  HugeMicOff02Duotone as LucideMicOff,
  LucideMonitor,
  LucideVideoOff,
} from "../../../../../icons/index";

import { cn } from "../../../../lib/utils";

import { MeetingTileSignalIndicator } from "./tile-badges";
import { useOptionalMeetingTile } from "./tile-context";
import type { MeetingTileSource } from "./tile-types";
import { meetingTileNameOverlayVariants } from "./tile-variants";

export interface MeetingTileNameOverlayProps {
  readonly className?: string;
  readonly displayName?: string;
  readonly hasAudio?: boolean;
  readonly hasVideo?: boolean;
  readonly isFloatingLayoutTile?: boolean;
  readonly isHost?: boolean;
  readonly isSelf?: boolean;
  readonly signalStrength?: number;
  readonly source?: MeetingTileSource;
}

/* eslint-disable react-doctor/no-many-boolean-props -- Audio/video availability, layout and presentation options vary independently; preserve the public tile composition contract. */
function resolveTileNameOverlay(
  {
    className,
    displayName: displayNameProp,
    hasAudio: hasAudioProp,
    hasVideo: hasVideoProp,
    isFloatingLayoutTile: isFloatingLayoutTileProp,
    isHost: isHostProp,
    isSelf: isSelfProp,
    signalStrength: signalStrengthProp,
    source: sourceProp,
  }: MeetingTileNameOverlayProps,
  context: ReturnType<typeof useOptionalMeetingTile>
) {
  const displayName = displayNameProp ?? context?.displayName;
  const hasAudio = hasAudioProp ?? context?.hasAudio;
  const hasVideo = hasVideoProp ?? context?.hasVideo;
  const isFloatingLayoutTile =
    isFloatingLayoutTileProp ?? context?.isFloatingLayoutTile ?? false;
  const isHost = isHostProp ?? context?.isHost ?? false;
  const isSelf = isSelfProp ?? context?.isSelf;
  const signalStrength = signalStrengthProp ?? context?.signalStrength ?? 3;
  const source = sourceProp ?? context?.source;

  if (
    displayName === undefined ||
    hasAudio === undefined ||
    hasVideo === undefined ||
    isSelf === undefined ||
    source === undefined
  ) {
    throw new Error(
      "MeetingTileNameOverlay requires tile props or MeetingTileProvider."
    );
  }

  return {
    className,
    displayName,
    hasAudio,
    hasVideo,
    isFloatingLayoutTile,
    isHost,
    isSelf,
    signalStrength,
    source,
  };
}

export function MeetingTileNameOverlay(props: MeetingTileNameOverlayProps) {
  const {
    className,
    displayName,
    hasAudio,
    hasVideo,
    isFloatingLayoutTile,
    isHost,
    isSelf,
    signalStrength,
    source,
  } = resolveTileNameOverlay(props, useOptionalMeetingTile());
  const name = displayName.split(" ")[0] ?? "Guest";
  const tileName =
    source === "screen"
      ? `${name}${isSelf ? " (you)" : ""}'s Screen`
      : `${name}${isSelf ? " (you)" : ""}`;

  return (
    <div
      className={cn(
        meetingTileNameOverlayVariants({
          floating: isFloatingLayoutTile,
        }),
        className
      )}
      data-slot="meeting-tile-name-overlay"
    >
      {source === "screen" ? (
        <LucideMonitor className="size-3 text-foreground" />
      ) : null}
      {source === "camera" && isHost ? (
        <HugeCircleStarSolid
          aria-label="Host"
          className="size-3.5 shrink-0 text-primary"
          data-slot="meeting-tile-host-indicator"
          role="img"
        />
      ) : null}
      <MeetingTileSignalIndicator
        className="hidden text-foreground @sm/video-tile:flex"
        strength={signalStrength}
      />
      {hasAudio ? null : <LucideMicOff className="size-4 text-destructive" />}
      {source === "screen" || hasVideo ? null : (
        <LucideVideoOff
          className="hidden size-4 text-destructive @sm/video-tile:block"
          data-slot="meeting-tile-video-off-indicator"
        />
      )}
      <span className="truncate font-medium text-foreground text-xs @sm/video-tile:text-sm">
        {tileName}
      </span>
    </div>
  );
}
/* eslint-enable react-doctor/no-many-boolean-props */
