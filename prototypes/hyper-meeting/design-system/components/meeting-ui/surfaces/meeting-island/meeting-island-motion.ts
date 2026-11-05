const SPRING = { damping: 30, stiffness: 400, type: "spring" as const };

export function getMeetingIslandMotionProps(
  shouldReduceMotion: boolean | null
) {
  if (shouldReduceMotion) {
    return {
      layout: false,
      transition: { duration: 0 },
    } as const;
  }

  return {
    layout: true,
    transition: SPRING,
  } as const;
}
