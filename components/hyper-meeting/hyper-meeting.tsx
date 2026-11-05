"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
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
import { MeetingTopBarLoading, MeetingStageLoading, MeetingControlsLoading } from "./meeting-loading";
import MeetingMoreOptions from "./meeting-more-panel";
import type { MeetingControlPanel } from "./use-meeting-control-actions";
import { useMeetingParticipants } from "./use-meeting-participants";
import { MeetingConversation } from "./meeting-conversation";

const MeetingTopBar = dynamic(() => import("./meeting-top-bar"), { ssr: false, loading: MeetingTopBarLoading });
const MeetingStage = dynamic(() => import("./meeting-stage"), { ssr: false, loading: MeetingStageLoading });
const MeetingControls = dynamic(() => import("./meeting-controls"), { ssr: false, loading: MeetingControlsLoading });
const subscribeStandalone = () => () => {};
const getStandalone = () => window.parent === window;
const getServerStandalone = () => false;

export default function HyperMeeting() {
  const standalone = useSyncExternalStore(subscribeStandalone, getStandalone, getServerStandalone);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<MeetingControlPanel | null>(null);
  const [visitedPanels, setVisitedPanels] = useState<readonly MeetingControlPanel[]>([]);
  function changePanel(panel: MeetingControlPanel | null) {
    if (panel !== null) setVisitedPanels((current) => current.includes(panel) ? current : [...current, panel]);
    setActivePanel(panel);
  }
  const moreOpen = activePanel === "more" || activePanel === "chat" || activePanel === "people";
  const [left, setLeft] = useState(false);
  const meetingParticipants = useMeetingParticipants({ muted, videoOn, onMutedChange: setMuted, onVideoChange: setVideoOn, onLeave: () => setLeft(true) });
  const [reactions, setReactions] = useState<MeetingReactionEvent[]>([]);
  const overlay = useIsMobile(MEETING_SIDE_PANEL_INLINE_MIN_CONTAINER_WIDTH);
  const [readySections, setReadySections] = useState(0);
  const topBarReady = useCallback(() => setReadySections((current) => current | 1), []);
  const stageReady = useCallback(() => setReadySections((current) => current | 2), []);
  const controlsReady = useCallback(() => setReadySections((current) => current | 4), []);
  const completedSections = [1, 2, 4].filter((section) => readySections & section).length;
  useEffect(() => {
    window.parent.postMessage({ type: "hyper-meeting-progress", completed: completedSections }, window.location.origin);
    if (readySections === 7) window.parent.postMessage({ type: "hyper-meeting-ready" }, window.location.origin);
  }, [readySections, completedSections]);
  function closeMore() {
    setActivePanel(null);
    // Wait until the mobile meeting column is no longer inert.
    requestAnimationFrame(() => {
      document.getElementById("hyper-more-trigger")?.focus({ preventScroll: true });
    });
  }
  function onKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
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
    setVisitedPanels([]);
    meetingParticipants.reset();
  }
  return (
    <MeetingConversation enabled={!left}>
    <MeetingShell
      height="fill"
      className="flex-row font-sans"
      onKeyDown={onKeyDown}
      aria-label="Hyper meeting prototype"
      data-ready={readySections === 7}
    >
      <p role={standalone ? "status" : undefined} aria-hidden={!standalone} className="sr-only">{readySections === 7 ? "" : `Loading meeting. ${completedSections} of 3 sections ready.`}</p>
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
              onReady={topBarReady}
              participants={meetingParticipants.roster}
              onParticipantsOpen={() => changePanel("people")}
              onLeave={() => setLeft(true)}
            />
            <MeetingShellStage>
              <MeetingCallStageRoot>
                <MeetingCallStageMain variant="fullBleed" className="relative min-h-0">
                  <MeetingStage
                    onReady={stageReady}
                    participants={meetingParticipants.roster}
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
              onReady={controlsReady}
              muted={muted}
              videoOn={videoOn}
              onMutedChange={setMuted}
              onVideoChange={setVideoOn}
              activePanel={activePanel}
              onPanelChange={changePanel}
              onLeave={() => setLeft(true)}
              onReaction={react}
            />
          </div>
          <MeetingMoreOptions
            open={moreOpen}
            overlay={overlay}
            view={activePanel === "chat" || activePanel === "people" ? activePanel : "more"}
            onViewChange={changePanel}
            visitedPanels={visitedPanels}
            onClose={closeMore}
            participants={meetingParticipants.roster}
            onAudioToggle={meetingParticipants.toggleAudio}
            onVideoToggle={meetingParticipants.toggleVideo}
            onRemove={(person) => {
              meetingParticipants.remove(person);
              if (focused === person.layoutId) setFocused(null);
              if (pinned === person.layoutId) setPinned(null);
            }}
            focused={focused}
            pinned={pinned}
            onFocus={(id) => setFocused((current) => current === id ? null : id)}
            onPin={(id) => setPinned((current) => current === id ? null : id)}
          />
        </>
      )}
    </MeetingShell>
    </MeetingConversation>
  );
}
