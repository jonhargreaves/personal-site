import { MeetingParticipantTile } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/tiles/tiles";
import { useMeetingTileLayout } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/stage/meeting-tile-layout";
import {
  MeetingReactionStream,
  type MeetingReactionEvent,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/reactions/reaction-stream";
import {
  MeetingCallContentFrame,
  MeetingTileGridPagination,
  MeetingTileGridViewport,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/stage/stage";
import { participants } from "./participants";
import { useSimulatedConversation } from "./use-simulated-conversation";

export default function MeetingStage({
  muted,
  videoOn,
  focused,
  pinned,
  onFocus,
  onPin,
  transitionKey,
  reactions,
  onReactionComplete,
}: {
  muted: boolean;
  videoOn: boolean;
  focused: string | null;
  pinned: string | null;
  onFocus: (id: string) => void;
  onPin: (id: string) => void;
  transitionKey: string;
  reactions: readonly MeetingReactionEvent[];
  onReactionComplete: (id: string) => void;
}) {
  const speakers = useSimulatedConversation();
  const { containerRef, tileById, tileLayout } = useMeetingTileLayout({
    tiles: participants,
    focusedTileId: focused,
    pinnedTileId: pinned,
    transitionKey,
  });
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
                    className="min-h-0"
                    displayName={participant.displayName}
                    fallbackInitials={participant.initials}
                    avatarColor={participant.avatarColor}
                    hasAudio={participant.isSelf ? !muted : true}
                    hasVideo={participant.isSelf && videoOn}
                    isSelf={participant.isSelf}
                    isSpeaking={
                      speakers.includes(participant.layoutId) && (!participant.isSelf || !muted)
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
                          <MeetingReactionStream
                            aria-label="Reactions from Jon (you)"
                            className="w-full sm:w-full"
                            placement="center"
                            reactions={reactions}
                            onReactionComplete={onReactionComplete}
                          />
                        </div>
                      ) : undefined
                    }
                  />
                </div>
              );
            })
          : null}
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
