import { useState } from "react";
import {
  HugeUserAdd01Stroke,
  LucideChevronDown,
  LucideLayoutPanelLeft,
} from "@/vendor/hyper-ui/icons";
import { LogoFull } from "@/vendor/hyper-ui/ui/components/brand/logo-full";
import { Logo } from "@/vendor/hyper-ui/ui/components/brand/logo";
import { Button } from "@/vendor/hyper-ui/ui/components/button";
import { useIsMobile } from "@/vendor/hyper-ui/ui/hooks/use-mobile";
import {
  MeetingTopBarPrimitive,
  MeetingTopBarSlot,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/primitives/top-bar";
import MeetingSearch from "./meeting-search";
import MeetingRecordingIsland, { useMeetingRecording } from "./meeting-recording-island";
import MeetingParticipantStack from "./meeting-participant-stack";

export default function MeetingTopBar({
  onLayoutChange,
  onMoreOpen,
  onParticipantsOpen,
  onLeave,
}: {
  onLayoutChange: (focused: boolean) => void;
  onMoreOpen: () => void;
  onParticipantsOpen: () => void;
  onLeave: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const compact = useIsMobile(767);
  const recording = useMeetingRecording();
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        new URL("/work/hyper-meeting-ui", window.location.origin).href,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <MeetingTopBarPrimitive
      className={
        compact
          ? "grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] gap-2 px-4 sm:gap-2 sm:px-4"
          : "px-4 sm:px-4"
      }
    >
      <MeetingTopBarSlot className={compact ? "gap-2" : undefined}>
        {compact ? (
          <span className="shrink-0" role="img" aria-label="Hyper">
            <Logo className="size-6" />
          </span>
        ) : (
          <LogoFull className="h-6 w-auto shrink-0" />
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
            <MeetingParticipantStack />
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
            {compact ? <HugeUserAdd01Stroke /> : copied ? "Copied" : "Invite"}
          </Button>
          <MeetingSearch onLayoutChange={onLayoutChange} onMoreOpen={onMoreOpen} />
        </div>
      </MeetingTopBarSlot>
    </MeetingTopBarPrimitive>
  );
}
