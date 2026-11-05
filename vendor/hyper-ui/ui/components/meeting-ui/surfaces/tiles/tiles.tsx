"use client";

import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import {
  VideoTileFallback,
  VideoTileRoot,
} from "../../../video-tile/index";
import { cn } from "../../../../lib/utils";

import { MeetingTileScreenShareBadge } from "./tile-badges";
import {
  type MeetingTileContextValue,
  MeetingTileProvider,
} from "./tile-context";
import { MeetingParticipantTileMenu } from "./tile-menu";
import { MeetingTileNameOverlay } from "./tile-overlays";
import type { MeetingTileSource } from "./tile-types";
import {
  meetingParticipantTileContentVariants,
  meetingParticipantTileRootVariants,
  meetingTileFallbackVariants,
} from "./tile-variants";

export interface MeetingParticipantTileProps
  extends
    Omit<ComponentPropsWithoutRef<typeof VideoTileRoot>, "children">,
    VariantProps<typeof meetingParticipantTileRootVariants> {
  readonly avatarColor?: string;
  readonly avatarImage?: string | null;
  readonly children?: ReactNode;
  readonly displayName: string;
  readonly fallbackInitials: string;
  readonly hasAudio: boolean;
  readonly hasVideo: boolean;
  readonly hasFloatingBorder?: boolean;
  readonly isFloatingLayoutTile?: boolean;
  readonly isFocused: boolean;
  readonly isHost?: boolean;
  readonly isPinned: boolean;
  readonly isScreenSharing?: boolean;
  readonly isSelf: boolean;
  readonly media?: ReactNode;
  readonly menu?: ReactNode;
  readonly onToggleFocus: () => void;
  readonly onTogglePin: () => void;
  readonly signalStrength?: number;
  readonly source: MeetingTileSource;
}

export interface MeetingTileContentProps extends ComponentPropsWithoutRef<"div"> {
  readonly ref?: Ref<HTMLDivElement>;
}

export function MeetingTileContent({
  className,
  ref,
  ...props
}: MeetingTileContentProps) {
  return (
    <div
      className={cn(meetingParticipantTileContentVariants(), className)}
      data-slot="meeting-participant-tile-content"
      ref={ref}
      {...props}
    />
  );
}

/* eslint-disable react-doctor/no-many-boolean-props -- Media availability, border, mirroring and display options are independent runtime facts, not mutually exclusive variants. */
export function MeetingParticipantTile({
  avatarColor,
  avatarImage,
  children,
  className,
  displayName,
  fallbackInitials,
  hasAudio,
  hasFloatingBorder,
  hasVideo,
  isFloatingLayoutTile = false,
  isFocused,
  isHost = false,
  isPinned,
  isScreenSharing = false,
  isSelf,
  isSpeaking = false,
  media,
  menu,
  onToggleFocus,
  onTogglePin,
  signalStrength,
  source,
  variant,
  ...rootProps
}: MeetingParticipantTileProps) {
  const tile = {
    avatarColor,
    avatarImage,
    displayName,
    fallbackInitials,
    hasAudio,
    hasFloatingBorder,
    hasVideo,
    isFloatingLayoutTile,
    isFocused,
    isHost,
    isPinned,
    isScreenSharing,
    isSelf,
    isSpeaking,
    media,
    onToggleFocus,
    onTogglePin,
    signalStrength,
    source,
  } satisfies MeetingTileContextValue;

  return (
    <MeetingTileProvider value={tile}>
      <VideoTileRoot
        className={cn(
          meetingParticipantTileRootVariants({
            floating: hasFloatingBorder ?? isFloatingLayoutTile,
            variant,
          }),
          className
        )}
        data-floating={isFloatingLayoutTile ? "true" : "false"}
        data-screen-sharing={isScreenSharing ? "true" : "false"}
        data-slot="meeting-participant-tile"
        data-source={source}
        data-variant={variant ?? "default"}
        isSpeaking={isSpeaking}
        {...rootProps}
      >
        <MeetingTileContent>
          {children ?? (
            <>
              <VideoTileFallback
                avatarColor={avatarColor}
                avatarImage={avatarImage}
                className={meetingTileFallbackVariants()}
                initials={fallbackInitials}
                isSpeaking={isSpeaking}
              />

              {media}

              {source === "camera" && isScreenSharing ? (
                <MeetingTileScreenShareBadge />
              ) : null}

              {menu ?? <MeetingParticipantTileMenu />}

              <MeetingTileNameOverlay />
            </>
          )}
        </MeetingTileContent>
      </VideoTileRoot>
    </MeetingTileProvider>
  );
}
/* eslint-enable react-doctor/no-many-boolean-props */
