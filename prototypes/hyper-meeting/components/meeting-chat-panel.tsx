import { useState } from "react";
import { Avatar, AvatarFallback } from "@/prototypes/hyper-meeting/design-system/components/avatar";
import {
  ChatMessageBubble,
  ChatMessageContainer,
  ChatMessageContent,
  ChatMessageHeader,
} from "@/prototypes/hyper-meeting/design-system/components/chat-ui/message";
import {
  ChatThreadComposerSlot,
  ChatThreadDivider,
  ChatThreadMessageBody,
  ChatThreadMessages,
  ChatThreadPanel,
  ChatThreadScrollArea,
  ChatViewport,
} from "@/prototypes/hyper-meeting/design-system/components/chat-ui/thread";
import type { Value } from "@/prototypes/hyper-meeting/design-system/components/chat-ui/chat-document";
import { participants } from "../data/participants";
import { initialChatMessages } from "../data/meeting-chat-data";
import MeetingChatComposer from "./meeting-chat-composer";
import MeetingPanelHeader from "./meeting-panel-header";
import MeetingChatAttachments from "./meeting-chat-attachments";
import MeetingChatReactions from "./meeting-chat-reactions";
import reactionStyles from "./meeting-chat-reactions.module.css";

const mentionLabels = new Map(participants.map((person) => [person.layoutId, person.displayName]));

export default function MeetingChatPanel({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const [messages, setMessages] = useState(initialChatMessages);
  function send(value: Value, files: readonly File[] = []) {
    setMessages((current) => [...current, {
      id: crypto.randomUUID(),
      authorId: "jon",
      time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      value,
      attachments: files,
    }]);
  }
  return (
    <ChatThreadPanel variant="meeting" className="min-h-0">
      <MeetingPanelHeader title="Chat" onBack={onBack} onClose={onClose} />
      <ChatViewport variant="meeting">
        <ChatThreadScrollArea variant="meeting" aria-label="Meeting chat messages" className="[&_[data-slot=message-scroller-button]]:border [&_[data-slot=message-scroller-button]]:border-border">
          <ChatThreadMessages variant="meeting" className="space-y-0 px-0 pb-4">
            <ChatThreadDivider className="mx-4 mb-5" label={`Today · ${messages[0].time}`} />
            {messages.map((message) => {
              const author = participants.find((person) => person.layoutId === message.authorId)!;
              return (
                <ChatMessageContainer key={message.id} className={reactionStyles.message} data-message-id={message.id}>
                  <Avatar className="mt-0.5 size-9 shrink-0">
                    <AvatarFallback className="text-xs text-white" style={{ backgroundColor: author.avatarColor }}>{author.initials}</AvatarFallback>
                  </Avatar>
                  <ChatMessageContent className="min-w-0 flex-1">
                    <ChatMessageHeader name={`${author.displayName}${author.isSelf ? " (You)" : ""}`} timestamp={message.time} className="mb-1.5 flex-wrap gap-x-1 gap-y-0" />
                    <ChatMessageBubble variant="minimal">
                      <ChatThreadMessageBody value={message.value} mentionLabelsByParticipantId={mentionLabels} />
                    </ChatMessageBubble>
                    {message.attachments?.length ? <MeetingChatAttachments files={message.attachments} /> : null}
                    <MeetingChatReactions initialReaction={message.reaction} author={author.displayName} />
                  </ChatMessageContent>
                </ChatMessageContainer>
              );
            })}
          </ChatThreadMessages>
        </ChatThreadScrollArea>
        <ChatThreadComposerSlot variant="meeting" className="shrink-0 border-0 p-2">
          <MeetingChatComposer onSend={send} />
        </ChatThreadComposerSlot>
      </ChatViewport>
      <p className="sr-only" role="status">{messages.length - initialChatMessages.length > 0 ? "Message sent" : ""}</p>
    </ChatThreadPanel>
  );
}
