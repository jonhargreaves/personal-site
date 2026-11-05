import { useEffect, useState } from "react";
import { participants } from "../data/participants";

type ParticipantId = (typeof participants)[number]["layoutId"];

// Varied turns, short acknowledgements, and pauses keep the demo conversational.
const conversation: readonly {
  duration: number;
  speakers: readonly ParticipantId[];
}[] = [
  { duration: 4400, speakers: ["mina"] },
  { duration: 600, speakers: ["mina", "avery"] },
  { duration: 3400, speakers: ["avery"] },
  { duration: 400, speakers: [] },
  { duration: 2200, speakers: ["mina"] },
  { duration: 500, speakers: [] },
  { duration: 4200, speakers: ["jon"] },
  { duration: 500, speakers: ["jon", "sam"] },
  { duration: 4600, speakers: ["sam"] },
  { duration: 600, speakers: [] },
  { duration: 3800, speakers: ["avery"] },
  { duration: 600, speakers: ["avery", "sam"] },
  { duration: 1600, speakers: ["sam"] },
  { duration: 500, speakers: [] },
  { duration: 3200, speakers: ["mina"] },
  { duration: 700, speakers: ["mina", "jon"] },
  { duration: 2600, speakers: ["jon"] },
  { duration: 1000, speakers: [] },
];

export function useSimulatedConversation(enabled = true) {
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function scheduleTurn() {
      clearTimeout(timer);
      // Pause the demo in background tabs instead of running an unseen loop.
      if (!document.hidden) {
        timer = setTimeout(
          () => setTurn((current) => (current + 1) % conversation.length),
          conversation[turn].duration,
        );
      }
    }
    scheduleTurn();
    document.addEventListener("visibilitychange", scheduleTurn);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", scheduleTurn);
    };
  }, [enabled, turn]);

  return conversation[turn].speakers;
}
