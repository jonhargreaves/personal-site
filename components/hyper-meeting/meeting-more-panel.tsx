import { useEffect, useRef } from "react";
import { MeetingMorePanel } from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/more-panel/meeting-more-panel";
import {
  MeetingSidePanelRoot,
  MeetingSidePanelShell,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/side-panel/side-panel";
import MeetingPeoplePanel from "./meeting-people-panel";
import MeetingChatPanel from "./meeting-chat-panel";
import type { MeetingParticipant } from "./participants";

export type MeetingMoreView = "more" | "chat" | "people";

export default function MeetingMoreOptions({
  open,
  overlay,
  onClose,
  view,
  onViewChange,
  participants,
  onAudioToggle,
  onVideoToggle,
  onRemove,
  focused,
  pinned,
  onFocus,
  onPin,
}: {
  open: boolean;
  overlay: boolean;
  onClose: () => void;
  view: MeetingMoreView;
  onViewChange: (view: MeetingMoreView) => void;
  participants: readonly MeetingParticipant[];
  onAudioToggle: (person: MeetingParticipant) => void;
  onVideoToggle: (person: MeetingParticipant) => void;
  onRemove: (person: MeetingParticipant) => void;
  focused: string | null;
  pinned: string | null;
  onFocus: (id: string) => void;
  onPin: (id: string) => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const previousView = useRef(view);
  useEffect(() => {
    if (open) {
      const destination = view === "more" && previousView.current !== "more"
        ? `[data-hyper-elid="${previousView.current === "people" ? "participants" : "chat"}-panel"]`
        : `[data-panel-view="${view}"] button:not(:disabled)`;
      panelRef.current?.querySelector<HTMLButtonElement>(destination)?.focus({ preventScroll: true });
    }
    previousView.current = view;
  }, [open, view]);
  const actions = {
    agenda: {}, chat: { onClick: () => onViewChange("chat") }, notes: {},
    participants: { onClick: () => onViewChange("people") },
    transcript: {}, calendar: {}, settings: {}, network: {}, allCommands: {},
  };
  // The meeting column is inert; keep portaled formatting/emoji controls accessible.
  return (
    <MeetingSidePanelRoot
      activePanel={open ? "more" : null}
      isMobile={overlay}
      sidebarWidth={400}
      ref={panelRef}
      aria-label="More meeting options"
      id="hyper-more-panel"
      inert={!open}
      role={overlay ? "dialog" : undefined}
      onKeyDown={(event) => {
        if (!overlay || !open || event.key !== "Tab" || event.defaultPrevented) return;
        const panel = panelRef.current;
        if (!panel?.contains(event.target as Node)) return;
        const targets = Array.from(panel.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [contenteditable="true"], [tabindex="0"]',
        )).filter((target) => target.getClientRects().length > 0);
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && event.target === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && event.target === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <MeetingSidePanelShell className="rounded-[16px]">
        <div data-panel-view="more" className={view === "more" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          <MeetingMorePanel actions={actions} onClose={onClose} />
        </div>
        <div data-panel-view="people" className={view === "people" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          <MeetingPeoplePanel participants={participants} onAudioToggle={onAudioToggle} onVideoToggle={onVideoToggle} onRemove={onRemove} focused={focused} pinned={pinned} onFocus={onFocus} onPin={onPin} onBack={() => onViewChange("more")} onClose={onClose} />
        </div>
        <div data-panel-view="chat" className={view === "chat" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          <MeetingChatPanel onBack={() => onViewChange("more")} onClose={onClose} />
        </div>
      </MeetingSidePanelShell>
    </MeetingSidePanelRoot>
  );
}
