import { useEffect } from "react";
import dynamic from "next/dynamic";
import { MeetingStageLoading } from "../preview/meeting-loading";
import { MeetingParticipantTile } from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/tiles/tiles";
import { useMeetingTileLayout } from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/stage/meeting-tile-layout";
import type { MeetingReactionEvent } from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/reactions/reaction-stream";
import {
  MeetingCallContentFrame,
  MeetingTileGridPagination,
  MeetingTileGridViewport,
} from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/stage/stage";
import type { MeetingParticipant } from "../data/participants";
import { useMeetingSpeakers } from "../state/meeting-conversation";
import loadingStyles from "../preview/meeting-loading.module.css";

const MeetingReactionStream = dynamic(() => import("@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/reactions/reaction-stream").then((module) => module.MeetingReactionStream), { ssr: false });

export default function MeetingStage({
  onReady,
  participants,
  focused,
  pinned,
  onFocus,
  onPin,
  transitionKey,
  reactions,
  onReactionComplete,
}: {
  onReady: () => void;
  participants: readonly MeetingParticipant[];
  focused: string | null;
  pinned: string | null;
  onFocus: (id: string) => void;
  onPin: (id: string) => void;
  transitionKey: string;
  reactions: readonly MeetingReactionEvent[];
  onReactionComplete: (id: string) => void;
}) {
  const speakers = useMeetingSpeakers();
  const { containerRef, tileById, tileLayout } = useMeetingTileLayout({
    tiles: participants,
    focusedTileId: focused,
    pinnedTileId: pinned,
    transitionKey,
  });
  useEffect(() => {
    if (tileLayout.isMeasured) onReady();
  }, [tileLayout.isMeasured, onReady]);
  return (
    <MeetingCallContentFrame>
      <MeetingTileGridViewport ref={containerRef} {...tileLayout.containerProps}>
        {tileLayout.isMeasured
          ? tileLayout.renderTiles((layoutTile) => {
              const participant = tileById.get(layoutTile.participantId);
              if (!participant) return null;
              return (
                <div
                  key={participant.layoutId}
                  className={layoutTile.className}
                  style={layoutTile.style}
                  {...layoutTile.dragHandlers}
                >
                  <MeetingParticipantTile
                    className={`${loadingStyles.reveal} min-h-0`}
                    displayName={participant.displayName}
                    fallbackInitials={participant.initials}
                    avatarColor={participant.avatarColor}
                    hasAudio={participant.hasAudio}
                    hasVideo={participant.hasVideo}
                    isSelf={participant.isSelf}
                    isSpeaking={
                      speakers.includes(participant.layoutId) && participant.hasAudio
                    }
                    isFocused={focused === participant.layoutId}
                    isPinned={pinned === participant.layoutId}
                    source="camera"
                    onToggleFocus={() => onFocus(participant.layoutId)}
                    onTogglePin={() => onPin(participant.layoutId)}
                    media={
                      participant.isSelf ? (
                        <div
                          className="pointer-events-none absolute inset-0 overflow-hidden"
                          data-slot="meeting-tile-reactions"
                        >
                          {reactions.length > 0 && <MeetingReactionStream
                            aria-label="Reactions from Jon (you)"
                            className="w-full sm:w-full"
                            placement="center"
                            reactions={reactions}
                            onReactionComplete={onReactionComplete}
                          />}
                        </div>
                      ) : undefined
                    }
                  />
                </div>
              );
            })
          : <MeetingStageLoading />}
        {tileLayout.renderDraggableDivider({ onPositionChange: tileLayout.setStageSize })}
        <MeetingTileGridPagination
          currentPage={tileLayout.currentPage}
          totalPages={tileLayout.totalPages}
          canGoNext={tileLayout.canGoNext}
          canGoPrevious={tileLayout.canGoPrevious}
          onNext={tileLayout.nextPage}
          onPrevious={tileLayout.previousPage}
        />
      </MeetingTileGridViewport>
    </MeetingCallContentFrame>
  );
}
