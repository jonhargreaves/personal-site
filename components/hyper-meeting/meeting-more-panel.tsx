import { useEffect, useRef } from "react";
import { MeetingMorePanel } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/more-panel/meeting-more-panel";
import {
  MeetingSidePanelRoot,
  MeetingSidePanelShell,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/side-panel/side-panel";

const actions = {
  agenda: {},
  chat: {},
  notes: {},
  participants: {},
  transcript: {},
  calendar: {},
  settings: {},
  network: {},
  allCommands: {},
};

export default function MeetingMoreOptions({
  open,
  overlay,
  onClose,
}: {
  open: boolean;
  overlay: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open)
      panelRef.current
        ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus({ preventScroll: true });
  }, [open]);
  return (
    <MeetingSidePanelRoot
      activePanel={open ? "more" : null}
      isMobile={overlay}
      sidebarWidth={400}
      ref={panelRef}
      aria-label="More meeting options"
      id="hyper-more-panel"
    >
      {open ? (
        <MeetingSidePanelShell>
          <MeetingMorePanel actions={actions} onClose={onClose} />
        </MeetingSidePanelShell>
      ) : null}
    </MeetingSidePanelRoot>
  );
}
