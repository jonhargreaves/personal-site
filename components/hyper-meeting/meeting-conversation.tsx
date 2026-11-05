import { createContext, useContext, type ReactNode } from "react";
import type { MeetingParticipant } from "./participants";
import { useSimulatedConversation } from "./use-simulated-conversation";

const SpeakersContext = createContext<readonly MeetingParticipant["layoutId"][]>([]);

export function MeetingConversation({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const speakers = useSimulatedConversation(enabled);
  // Only the tiles and microphone controls subscribe; chat/editor and top bar
  // no longer re-render on every simulated speaking turn.
  return <SpeakersContext value={speakers}>{children}</SpeakersContext>;
}

export function useMeetingSpeakers() {
  return useContext(SpeakersContext);
}
