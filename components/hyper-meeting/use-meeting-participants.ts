import { useMemo, useState } from "react";
import { participants, type MeetingParticipant } from "./participants";

/** Local meeting state shared by the stage, People panel, and avatar stack. */
export function useMeetingParticipants({ muted, videoOn, onMutedChange, onVideoChange, onLeave }: {
  muted: boolean;
  videoOn: boolean;
  onMutedChange: (muted: boolean) => void;
  onVideoChange: (videoOn: boolean) => void;
  onLeave: () => void;
}) {
  const [media, setMedia] = useState<Record<string, { hasAudio?: boolean; hasVideo?: boolean }>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  const roster: MeetingParticipant[] = useMemo(() => participants
    .filter((person) => !removed.includes(person.layoutId))
    .map((person) => ({
      ...person,
      hasAudio: person.isSelf ? !muted : media[person.layoutId]?.hasAudio ?? true,
      hasVideo: person.isSelf ? videoOn : media[person.layoutId]?.hasVideo ?? false,
    })), [media, muted, removed, videoOn]);

  function toggleAudio(person: MeetingParticipant) {
    if (person.isSelf) onMutedChange(person.hasAudio);
    else setMedia((current) => ({ ...current, [person.layoutId]: { ...current[person.layoutId], hasAudio: !person.hasAudio } }));
  }
  function toggleVideo(person: MeetingParticipant) {
    if (person.isSelf) onVideoChange(!person.hasVideo);
    else setMedia((current) => ({ ...current, [person.layoutId]: { ...current[person.layoutId], hasVideo: !person.hasVideo } }));
  }
  function remove(person: MeetingParticipant) {
    if (person.isSelf) onLeave();
    else setRemoved((current) => [...current, person.layoutId]);
  }
  function reset() {
    setMedia({});
    setRemoved([]);
  }
  return { roster, toggleAudio, toggleVideo, remove, reset };
}
