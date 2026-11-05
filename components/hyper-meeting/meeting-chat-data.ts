import { parseChatContent } from "@/vendor/hyper-ui/ui/components/chat-ui/rich-message-content";
import type { Value } from "@/vendor/hyper-ui/ui/components/chat-ui/chat-document";

export type MeetingChatMessage = {
  id: string;
  authorId: string;
  time: string;
  value: Value;
  reaction?: { emoji: string; label: string; count: number };
  attachments?: readonly File[];
};

export const initialChatMessages: MeetingChatMessage[] = [
  { id: "review-1", authorId: "jon", time: "10:00 AM", text: "Let’s start with the mobile call controls. Can everyone try switching microphones?" },
  { id: "review-2", authorId: "mina", time: "10:01 AM", text: "Took me a second to find it. I was looking for an arrow next to the mic." },
  { id: "review-3", authorId: "avery", time: "10:01 AM", text: "I was looking there too. Could we keep the device picker next to the mic and camera instead of in More?" },
  { id: "review-4", authorId: "jon", time: "10:02 AM", text: "I’ll try that. How does the spacing feel on a phone?" },
  { id: "review-5", authorId: "sam", time: "10:03 AM", text: "Just checked on mine. I can reach the mic and camera with one hand 🙌", reaction: { emoji: "🙌", label: "Raised hands", count: 2 } },
  { id: "review-6", authorId: "mina", time: "10:03 AM", text: "The spacing feels good. I’d move Leave a little farther from the camera, though. I nearly pressed it." },
  { id: "review-7", authorId: "avery", time: "10:05 AM", text: "For the next version:\n- Keep device switching next to the mic and camera\n- Give Leave more space" },
  { id: "review-8", authorId: "jon", time: "10:05 AM", text: "I’ll make those changes and send an updated version after the call.", reaction: { emoji: "👍", label: "Thumbs up", count: 3 } },
].map(({ text, ...message }) => ({ ...message, value: parseChatContent(text) }));
