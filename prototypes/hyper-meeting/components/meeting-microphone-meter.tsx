import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AudioLevelMeter } from "@/prototypes/hyper-meeting/design-system/components/audio-level-meter";

// A speech-like envelope: syllable peaks, softer tails, and brief pauses.
const speechLevels = [0.33, 0.56, 0.78, 0.44, 0.22, 0.56, 0.89, 0.67, 0.33, 0.11, 0.44, 0.67];

function SpeakingMicrophoneMeter() {
  const [sample, setSample] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    function syncVisibility() {
      clearInterval(timer);
      if (!document.hidden) {
        timer = setInterval(() => setSample((current) => (current + 1) % speechLevels.length), 120);
      }
    }
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [reducedMotion]);

  return (
    <AudioLevelMeter
      level={reducedMotion ? 0.56 : speechLevels[sample]}
      variant="gradient"
      className="motion-reduce:[&>span]:transition-none"
    />
  );
}

export default function MeetingMicrophoneMeter({ speaking }: { speaking: boolean }) {
  // Mount the envelope only during a speaking turn, so silence clears immediately
  // and no metering timer runs while the picker is closed or Jon is muted.
  return speaking ? <SpeakingMicrophoneMeter /> : <AudioLevelMeter level={0} variant="gradient" />;
}
