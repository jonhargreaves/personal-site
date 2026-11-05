import { useEffect, useRef, useState } from "react";
import {
  MeetingIslandDesktop,
  MeetingIslandMobile,
  type MeetingIslandStatus,
} from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/meeting-island/index";
import MeetingRenameDialog from "./meeting-rename-dialog";

const recordingStatuses: readonly MeetingIslandStatus[] = [{ type: "recording" }];
const initialElapsedMs = (5 * 60 + 23) * 1000;

export function useMeetingRecording() {
  const [title, setTitle] = useState("Design review");
  const [elapsedMs, setElapsedMs] = useState(initialElapsedMs);

  useEffect(() => {
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setElapsedMs(initialElapsedMs + performance.now() - startedAt);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return { title, onTitleChange: setTitle, elapsedMs };
}

export default function MeetingRecordingIsland({
  compact,
  title,
  elapsedMs,
  onTitleChange,
  onCopyLink,
  onLeave,
}: {
  compact: boolean;
  title: string;
  elapsedMs: number;
  onTitleChange: (title: string) => void;
  onCopyLink: () => void;
  onLeave: () => void;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const islandRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={islandRef} className="contents">
        {compact ? (
          <MeetingIslandMobile
            className="min-w-0 max-w-full"
            statuses={recordingStatuses}
            title={title}
          />
        ) : (
          <MeetingIslandDesktop
            elapsedMs={elapsedMs}
            onCopyLink={onCopyLink}
            onEndMeeting={onLeave}
            onRename={() => {
              setDraftTitle(title);
              setRenameOpen(true);
            }}
            statuses={recordingStatuses}
            title={title}
          />
        )}
      </div>
      <MeetingRenameDialog
        open={renameOpen}
        draft={draftTitle}
        onDraftChange={setDraftTitle}
        onOpenChange={setRenameOpen}
        onTitleChange={onTitleChange}
        returnFocus={() =>
          islandRef.current?.querySelector<HTMLElement>("[data-slot=meeting-island-menu-trigger]") ??
          document.querySelector<HTMLElement>("button[aria-label='Search meeting']")
        }
      />
    </>
  );
}
