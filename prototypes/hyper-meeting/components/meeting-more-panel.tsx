import { lazy, Suspense, useEffect, useRef, type ReactNode } from "react";
import {
  MeetingSidePanelRoot,
  MeetingSidePanelShell,
} from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/side-panel/side-panel";
import MeetingPanelLoading from "./meeting-panel-loading";
import type { MeetingControlPanel } from "../state/use-meeting-control-actions";
import type { MeetingParticipant } from "../data/participants";
import loadingStyles from "../preview/meeting-loading.module.css";

export type MeetingMoreView = "more" | "chat" | "people";

const MeetingMorePanel = lazy(() => import("@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/more-panel/meeting-more-panel").then((module) => ({ default: module.MeetingMorePanel })));
const MeetingPeoplePanel = lazy(() => import("./meeting-people-panel"));
const MeetingChatPanel = lazy(() => import("./meeting-chat-panel"));

// Restore focus when a pending panel replaces its loading header.
function PanelFocus({ active, children }: { active: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active) ref.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
  }, [active]);
  return <div ref={ref} className={`${loadingStyles.reveal} flex min-h-0 flex-1 flex-col`}>{children}</div>;
}

export default function MeetingMoreOptions({
  open,
  overlay,
  onClose,
  view,
  onViewChange,
  visitedPanels,
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
  visitedPanels: readonly MeetingControlPanel[];
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
          {visitedPanels.includes("more") && (
            <Suspense fallback={<MeetingPanelLoading title="More" onClose={onClose} />}>
              <PanelFocus active={open && view === "more"}><MeetingMorePanel actions={actions} onClose={onClose} /></PanelFocus>
            </Suspense>
          )}
        </div>
        <div data-panel-view="people" className={view === "people" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          {visitedPanels.includes("people") && (
            <Suspense fallback={<MeetingPanelLoading title="People" onBack={() => onViewChange("more")} onClose={onClose} />}>
              <PanelFocus active={open && view === "people"}><MeetingPeoplePanel participants={participants} onAudioToggle={onAudioToggle} onVideoToggle={onVideoToggle} onRemove={onRemove} focused={focused} pinned={pinned} onFocus={onFocus} onPin={onPin} onBack={() => onViewChange("more")} onClose={onClose} /></PanelFocus>
            </Suspense>
          )}
        </div>
        <div data-panel-view="chat" className={view === "chat" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          {visitedPanels.includes("chat") && (
            <Suspense fallback={<MeetingPanelLoading title="Chat" onBack={() => onViewChange("more")} onClose={onClose} />}>
              <PanelFocus active={open && view === "chat"}><MeetingChatPanel onBack={() => onViewChange("more")} onClose={onClose} /></PanelFocus>
            </Suspense>
          )}
        </div>
      </MeetingSidePanelShell>
    </MeetingSidePanelRoot>
  );
}
