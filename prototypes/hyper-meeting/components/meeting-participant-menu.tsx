import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/prototypes/hyper-meeting/design-system/components/dropdown-menu";
import {
  MeetingParticipantMenuContent,
  MeetingParticipantMenuItem,
  MeetingParticipantMenuTrigger,
} from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/participants/index";
import type { MeetingParticipant } from "../data/participants";
import styles from "./meeting-participant-menu.module.css";

type MenuIconName = "pin" | "full-screen" | "mic-off-02" | "video-off" | "door-01";

function MenuIcon({ name }: { name: MenuIconName }) {
  return <span aria-hidden="true" className={styles.icon} style={{ maskImage: `url(/prototypes/hyper-meeting/icons/participant-menu/${name}.svg)` }} />;
}

export default function MeetingParticipantMenu({ person, focused, pinned, onFocus, onPin, onAudioToggle, onVideoToggle, onRemove }: {
  person: MeetingParticipant;
  focused: boolean;
  pinned: boolean;
  onFocus: () => void;
  onPin: () => void;
  onAudioToggle: () => void;
  onVideoToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <DropdownMenu>
      <MeetingParticipantMenuTrigger aria-label={`Options for ${person.displayName}`} />
      <MeetingParticipantMenuContent align="end" collisionPadding={8} className={styles.menu} aria-label={`${person.displayName} actions`}>
        <DropdownMenuGroup>
          <div className={styles.header}>
            <DropdownMenuLabel className={styles.title}>{person.displayName}</DropdownMenuLabel>
          </div>
          <div className={styles.section}>
            <MeetingParticipantMenuItem className={styles.item} onSelect={onPin}>
              <MenuIcon name="pin" /><span>{pinned ? "Unpin speaker" : "Pin speaker"}</span>
            </MeetingParticipantMenuItem>
            <MeetingParticipantMenuItem className={styles.item} onSelect={onFocus}>
              <MenuIcon name="full-screen" /><span>{focused ? "Restore video tile" : "Maximize video tile"}</span>
            </MeetingParticipantMenuItem>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuGroup className={`${styles.section} ${styles.divided}`}>
          <MeetingParticipantMenuItem className={styles.item} onSelect={onAudioToggle}>
            <MenuIcon name="mic-off-02" /><span>{person.hasAudio ? "Mute microphone" : "Unmute microphone"}</span>
          </MeetingParticipantMenuItem>
          <MeetingParticipantMenuItem className={styles.item} onSelect={onVideoToggle}>
            <MenuIcon name="video-off" /><span>{person.hasVideo ? "Turn off camera" : "Turn on camera"}</span>
          </MeetingParticipantMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className={`${styles.section} ${styles.divided}`}>
          <MeetingParticipantMenuItem className={styles.item} variant="destructive" onSelect={onRemove}>
            <span className={styles.removeIcon}><MenuIcon name="door-01" /></span>
            <span>{person.isSelf ? "Leave meeting" : "Remove participant"}</span>
          </MeetingParticipantMenuItem>
        </DropdownMenuGroup>
      </MeetingParticipantMenuContent>
    </DropdownMenu>
  );
}
