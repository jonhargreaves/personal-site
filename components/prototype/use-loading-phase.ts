import { useEffect, useState } from "react";

/** Announce sustained waits without flashing feedback for cached requests. */
export function useLoadingPhase(active: boolean) {
  const [phase, setPhase] = useState<"initial" | "waiting" | "slow">("initial");
  useEffect(() => {
    if (!active) return;
    const waiting = setTimeout(() => setPhase("waiting"), 1000);
    const slow = setTimeout(() => setPhase("slow"), 10000);
    return () => { clearTimeout(waiting); clearTimeout(slow); };
  }, [active]);
  return active ? phase : "ready";
}
