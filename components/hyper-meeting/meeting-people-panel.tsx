import { useRef, useState } from "react";
import {
  MeetingParticipantMediaStatus,
  MeetingParticipantRow,
  MeetingParticipantsPanelRoot,
  MeetingParticipantsPanelScrollArea,
  MeetingParticipantsPanelSearch,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/participants";
import type { MeetingParticipant } from "./participants";
import MeetingPanelHeader from "./meeting-panel-header";
import MeetingPeopleSection from "./meeting-people-section";
import styles from "./meeting-people-panel.module.css";
import MeetingParticipantMenu from "./meeting-participant-menu";

export default function MeetingPeoplePanel({ participants, onAudioToggle, onVideoToggle, onRemove, focused, pinned, onFocus, onPin, onBack, onClose }: {
  participants: readonly MeetingParticipant[];
  onAudioToggle: (person: MeetingParticipant) => void;
  onVideoToggle: (person: MeetingParticipant) => void;
  onRemove: (person: MeetingParticipant) => void;
  focused: string | null;
  pinned: string | null;
  onFocus: (id: string) => void;
  onPin: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const visible = participants.filter((person) => person.displayName.toLowerCase().includes(query.trim().toLowerCase()));
  function removeParticipant(person: MeetingParticipant) {
    const index = visible.findIndex((item) => item.layoutId === person.layoutId);
    const next = visible[index + 1] ?? visible[index - 1];
    onRemove(person);
    if (!person.isSelf) requestAnimationFrame(() => {
      const selector = next
        ? `[data-participant-id="${next.layoutId}"] [data-hyper-elid="participant-menu"]`
        : '[data-slot="collapsible-trigger"][aria-expanded="true"]';
      panelRef.current?.querySelector<HTMLButtonElement>(selector)?.focus({ preventScroll: true });
    });
  }
  return (
    <MeetingParticipantsPanelRoot ref={panelRef} className="min-h-0">
      <MeetingPanelHeader title="People" onBack={onBack} onClose={onClose} />
      <div className="flex items-center gap-2 border-b border-border p-2">
        <MeetingParticipantsPanelSearch
          className="min-w-0 flex-1 p-0 [&_input]:h-8 [&_input]:rounded-[8px]"
          placeholder="Search participants"
          value={query}
          onChange={setQuery}
        />
      </div>
      <MeetingParticipantsPanelScrollArea className="min-h-0 [&_[data-slot=scroll-area-viewport]>div>div]:gap-0">
        {!query.trim() ? (
          <MeetingPeopleSection label="Waiting" count={0} defaultOpen={false}>
            <p className="px-4 pb-4 text-sm text-muted-foreground">No one is waiting to join.</p>
          </MeetingPeopleSection>
        ) : null}
        <MeetingPeopleSection label="In the call" count={visible.length}>
          {visible.length === 0 ? <p className="px-4 pb-4 text-sm text-muted-foreground">No participants found.</p> : null}
          {([true, false] as const).map((isHost) => {
            const group = visible.filter((person) => person.isSelf === isHost);
            return group.length ? (
              <div key={String(isHost)} className="pb-2">
                <p className="px-4 py-2 text-xs text-muted-foreground">{isHost ? "Host" : "Members"}</p>
                {group.map((person) => (
                  <MeetingParticipantRow
                    key={person.layoutId}
                    data-participant-id={person.layoutId}
                    name={`${person.displayName}${person.isSelf ? " (You)" : ""}`}
                    avatarFallback={person.initials}
                    avatarColor={person.avatarColor}
                    className={styles.participantRow}
                  >
                    <MeetingParticipantMediaStatus media={{ hasAudio: person.hasAudio, hasVideo: person.hasVideo, hasScreenShare: false }} />
                    <MeetingParticipantMenu
                      person={person}
                      focused={focused === person.layoutId}
                      pinned={pinned === person.layoutId}
                      onFocus={() => onFocus(person.layoutId)}
                      onPin={() => onPin(person.layoutId)}
                      onAudioToggle={() => onAudioToggle(person)}
                      onVideoToggle={() => onVideoToggle(person)}
                      onRemove={() => removeParticipant(person)}
                    />
                  </MeetingParticipantRow>
                ))}
              </div>
            ) : null;
          })}
        </MeetingPeopleSection>
        {!query.trim() ? (
          <MeetingPeopleSection label="Invited" count={0} defaultOpen={false}>
            <p className="px-4 pb-4 text-sm text-muted-foreground">Everyone is in the call</p>
          </MeetingPeopleSection>
        ) : null}
      </MeetingParticipantsPanelScrollArea>
    </MeetingParticipantsPanelRoot>
  );
}
