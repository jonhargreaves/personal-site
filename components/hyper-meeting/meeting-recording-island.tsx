import { useEffect, useState } from "react";
import {
  MeetingIslandDesktop,
  MeetingIslandMobile,
  type MeetingIslandStatus,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/meeting-island";

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
  if (compact) {
    return (
      <MeetingIslandMobile
        className="min-w-0 max-w-full"
        statuses={recordingStatuses}
        title={title}
      />
    );
  }

  return (
    <MeetingIslandDesktop
      elapsedMs={elapsedMs}
      onCopyLink={onCopyLink}
      onEndMeeting={onLeave}
      onTitleChange={onTitleChange}
      statuses={recordingStatuses}
      title={title}
    />
  );
}
