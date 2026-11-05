import { Avatar, AvatarFallback } from "@/prototypes/hyper-meeting/design-system/components/avatar";
import { AvatarStack, AvatarStackItem } from "@/prototypes/hyper-meeting/design-system/components/avatar-stack/index";
import type { MeetingParticipant } from "../data/participants";
import styles from "./meeting-participant-stack.module.css";

export default function MeetingParticipantStack({ participants }: { participants: readonly MeetingParticipant[] }) {
  return (
    <AvatarStack
      className={styles.stack}
      size={24}
      overlap={6}
      aria-label={`${participants.length} meeting participants`}
    >
      {participants.map((participant) => (
        <AvatarStackItem key={participant.layoutId}>
          <Avatar
            role="img"
            aria-label={`${participant.displayName}${participant.isSelf ? " (you)" : ""}`}
          >
            <AvatarFallback
              className="text-[10px] font-medium text-white"
              style={{ backgroundColor: participant.avatarColor }}
            >
              {participant.initials}
            </AvatarFallback>
          </Avatar>
        </AvatarStackItem>
      ))}
    </AvatarStack>
  );
}
