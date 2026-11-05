import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
import {
  HugeUserAdd01Stroke,
  LucideChevronDown,
  LucideLayoutPanelLeft,
} from "@/prototypes/hyper-meeting/design-system/icons/index";
import { LogoFull } from "@/prototypes/hyper-meeting/design-system/components/brand/logo-full";
import { Logo } from "@/prototypes/hyper-meeting/design-system/components/brand/logo";
import { Button } from "@/prototypes/hyper-meeting/design-system/components/button";
import { useIsMobile } from "@/prototypes/hyper-meeting/design-system/hooks/use-mobile";
import {
  MeetingTopBarPrimitive,
  MeetingTopBarSlot,
} from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/primitives/top-bar";
import MeetingSearch from "./meeting-search";
import MeetingRecordingIsland, { useMeetingRecording } from "./meeting-recording-island";
import MeetingParticipantStack from "./meeting-participant-stack";
import type { MeetingParticipant } from "../data/participants";
import loadingStyles from "../preview/meeting-loading.module.css";

export default function MeetingTopBar({
  onReady,
  participants,
  onParticipantsOpen,
  onLeave,
}: {
  onReady: () => void;
  participants: readonly MeetingParticipant[];
  onParticipantsOpen: () => void;
  onLeave: () => void;
}) {
  const compact = useIsMobile(767);
  const recording = useMeetingRecording();
  useEffect(onReady, [onReady]);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        new URL("/work/hyper-meeting-ui", window.location.origin).href,
      );
      toast.add({ id: "meeting-invite-copy", title: "Meeting invite link copied", type: "success" });
    } catch {
      toast.add({
        id: "meeting-invite-copy",
        title: "Unable to copy invite link",
        description: "Copy the link from your browser’s address bar.",
        type: "error",
        timeout: 6000,
      });
    }
  }
  return (
    <MeetingTopBarPrimitive
      className={`${loadingStyles.reveal} ${
        compact
          ? "grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] gap-2 px-4 sm:gap-2 sm:px-4"
          : "px-4 sm:px-4"
      }`}
    >
      <MeetingTopBarSlot className={compact ? "gap-2" : undefined}>
        {compact ? (
          <span className="shrink-0" role="img" aria-label="Hyper">
            <Logo className="size-6" />
          </span>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="shrink-0 rounded-lg px-1.5"
            aria-label="Hyper"
          >
            <LogoFull className="size-auto h-6 shrink-0" />
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className={compact ? "shrink-0 gap-2 px-2" : "shrink-0"}
          aria-label="Meeting layout"
        >
          <LucideLayoutPanelLeft />
          <span className="hidden md:inline">Dynamic</span>
          <LucideChevronDown />
        </Button>
      </MeetingTopBarSlot>
      <MeetingTopBarSlot placement="center" className={compact ? "not-sr-only flex" : undefined}>
        <MeetingRecordingIsland
          {...recording}
          compact={compact}
          onCopyLink={copyLink}
          onLeave={onLeave}
        />
      </MeetingTopBarSlot>
      <MeetingTopBarSlot placement="right" className={compact ? "shrink-0 gap-2" : undefined}>
        {!compact ? (
          <button
            type="button"
            aria-label="View participants"
            onClick={onParticipantsOpen}
            className="shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MeetingParticipantStack participants={participants} />
          </button>
        ) : null}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size={compact ? "icon-sm" : "sm"}
            variant="outline"
            onClick={copyLink}
            aria-label="Copy prototype link"
          >
            {compact ? <HugeUserAdd01Stroke /> : "Invite"}
          </Button>
          <MeetingSearch />
        </div>
      </MeetingTopBarSlot>
    </MeetingTopBarPrimitive>
  );
}
