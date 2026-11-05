import { Avatar, AvatarFallback } from "@/vendor/hyper-ui/ui/components/avatar";
import { AvatarStack, AvatarStackItem } from "@/vendor/hyper-ui/ui/components/avatar-stack";
import { participants } from "./participants";
import styles from "./meeting-participant-stack.module.css";

export default function MeetingParticipantStack() {
  return (
    <AvatarStack
      className={styles.stack}
      size={24}
      overlap={6}
      aria-label="4 meeting participants"
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
