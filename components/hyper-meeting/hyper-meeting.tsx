"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/vendor/hyper-ui/ui/components/button";
import {
  MeetingShell,
  MeetingShellStage,
} from "@/vendor/hyper-ui/ui/components/layouts/meeting-shell";
import {
  MeetingCallStageMain,
  MeetingCallStageRoot,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/stage/stage";
import { MEETING_SIDE_PANEL_INLINE_MIN_CONTAINER_WIDTH } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/side-panel/side-panel-constants";
import type { MeetingReactionEvent } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/reactions/reaction-stream";
import { MeetingStateCard } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/status/status";
import type { MeetingReactionOption } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/call-controls";
import { useIsMobile } from "@/vendor/hyper-ui/ui/hooks/use-mobile";
import MeetingTopBar from "./meeting-top-bar";
import MeetingStage from "./meeting-stage";
import MeetingControls from "./meeting-controls";
import MeetingMoreOptions from "./meeting-more-panel";
import type { MeetingControlPanel } from "./use-meeting-control-actions";

export default function HyperMeeting() {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<MeetingControlPanel | null>(null);
  const moreOpen = activePanel === "more";
  const [left, setLeft] = useState(false);
  const [reactions, setReactions] = useState<MeetingReactionEvent[]>([]);
  const overlay = useIsMobile(MEETING_SIDE_PANEL_INLINE_MIN_CONTAINER_WIDTH);
  function closeMore() {
    setActivePanel(null);
    // Wait until the mobile meeting column is no longer inert.
    requestAnimationFrame(() => {
      document.getElementById("hyper-more-trigger")?.focus({ preventScroll: true });
    });
  }
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && moreOpen) {
      event.preventDefault();
      closeMore();
    }
  }
  function react(reaction: MeetingReactionOption) {
    setReactions((current) => [
      ...current.slice(-9),
      { id: crypto.randomUUID(), emoji: reaction.emoji, label: reaction.label, senderName: "You" },
    ]);
  }
  function rejoin() {
    setLeft(false);
    setActivePanel(null);
    setMuted(false);
    setVideoOn(false);
    setFocused(null);
    setPinned(null);
    setReactions([]);
  }
  return (
    <MeetingShell
      height="fill"
      className="flex-row font-sans"
      onKeyDown={onKeyDown}
      aria-label="Hyper meeting prototype"
    >
      {left ? (
        <MeetingStateCard title="You left the meeting">
          <p className="mb-6 text-sm">Thanks for trying the Hyper meeting prototype.</p>
          <Button type="button" onClick={rejoin}>
            Rejoin meeting
          </Button>
        </MeetingStateCard>
      ) : (
        <>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col" inert={overlay && moreOpen}>
            <MeetingTopBar
              onLayoutChange={(focus) => setFocused(focus ? "jon" : null)}
              onMoreOpen={() => setActivePanel("more")}
              onParticipantsOpen={() => setActivePanel("people")}
              onLeave={() => setLeft(true)}
            />
            <MeetingShellStage>
              <MeetingCallStageRoot>
                <MeetingCallStageMain variant="fullBleed" className="relative min-h-0">
                  <MeetingStage
                    muted={muted}
                    videoOn={videoOn}
                    focused={focused}
                    pinned={pinned}
                    onFocus={(id) => setFocused((current) => (current === id ? null : id))}
                    onPin={(id) => setPinned((current) => (current === id ? null : id))}
                    transitionKey={String(moreOpen)}
                    reactions={reactions}
                    onReactionComplete={(id) =>
                      setReactions((current) => current.filter((item) => item.id !== id))
                    }
                  />
                </MeetingCallStageMain>
              </MeetingCallStageRoot>
            </MeetingShellStage>
            <MeetingControls
              muted={muted}
              videoOn={videoOn}
              onMutedChange={setMuted}
              onVideoChange={setVideoOn}
              activePanel={activePanel}
              onPanelChange={setActivePanel}
              onLeave={() => setLeft(true)}
              onReaction={react}
            />
          </div>
          <MeetingMoreOptions open={moreOpen} overlay={overlay} onClose={closeMore} />
        </>
      )}
    </MeetingShell>
  );
}
