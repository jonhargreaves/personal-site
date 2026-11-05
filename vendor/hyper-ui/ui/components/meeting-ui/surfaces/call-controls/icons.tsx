import { LazyMotion, m, type Transition, useAnimation } from "motion/react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type HTMLAttributes,
  type MouseEvent,
} from "react";

import {
  HyperAudioOnDuotone,
  HugeMicOff02Duotone,
  HyperVideoOnDuotone,
} from "../../../../../icons/index";

import { loadDomAnimation } from "../../../../internal/load-dom-animation";
import { cn } from "../../../../lib/utils";

import { MeetingVideoOffIcon } from "./meeting-video-off-icon";

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AnimatedIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

function useAnimatedIconLifecycle(
  ref: ForwardedRef<AnimatedIconHandle>,
  onMouseEnter: HTMLAttributes<HTMLDivElement>["onMouseEnter"],
  onMouseLeave: HTMLAttributes<HTMLDivElement>["onMouseLeave"]
) {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => {
        void controls.start("animate");
      },
      stopAnimation: () => {
        void controls.start("normal");
      },
    };
  }, [controls]);

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(event);
      if (isControlledRef.current) return;
      void controls.start("animate");
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(event);
      if (isControlledRef.current) return;
      void controls.start("normal");
    },
    [controls, onMouseLeave]
  );

  return { controls, handleMouseEnter, handleMouseLeave };
}

interface MicToggleIconProps {
  className?: string;
  muted: boolean;
}

function MicToggleIcon({ className, muted }: MicToggleIconProps) {
  if (muted) {
    return <HugeMicOff02Duotone aria-hidden="true" className={className} />;
  }

  return (
    <HyperAudioOnDuotone
      aria-hidden="true"
      className={className}
      data-icon="audio-on"
      secondaryOpacity={0.1}
    />
  );
}

interface VideoToggleIconProps {
  className?: string;
  videoOn: boolean;
}

function VideoToggleIcon({ className, videoOn }: VideoToggleIconProps) {
  if (videoOn) {
    return (
      <HyperVideoOnDuotone
        aria-hidden="true"
        className={className}
        data-icon="video-on"
        secondaryOpacity={0.1}
      />
    );
  }

  return (
    <MeetingVideoOffIcon
      aria-hidden="true"
      className={className}
      data-icon="video-off"
    />
  );
}

const sliderTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 12,
  mass: 0.4,
};

const AnimatedSlidersHorizontalIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconProps
>(function AnimatedSlidersHorizontalIcon(
  { className, onMouseEnter, onMouseLeave, size = 28, ...props },
  ref
) {
  const { controls, handleMouseEnter, handleMouseLeave } =
    useAnimatedIconLifecycle(ref, onMouseEnter, onMouseLeave);

  return (
    <div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <LazyMotion features={loadDomAnimation}>
        <svg
          fill="none"
          height={size}
          style={{ height: size, width: size }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <m.line
            animate={controls}
            initial={false}
            transition={sliderTransition}
            variants={{
              normal: { x2: 14 },
              animate: { x2: 10 },
            }}
            x1="21"
            x2="14"
            y1="4"
            y2="4"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x1: 10 },
              animate: { x1: 5 },
            }}
            x1="10"
            x2="3"
            y1="4"
            y2="4"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x2: 12 },
              animate: { x2: 18 },
            }}
            x1="21"
            x2="12"
            y1="12"
            y2="12"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x1: 8 },
              animate: { x1: 13 },
            }}
            x1="8"
            x2="3"
            y1="12"
            y2="12"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x2: 12 },
              animate: { x2: 4 },
            }}
            x1="3"
            x2="12"
            y1="20"
            y2="20"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x1: 16 },
              animate: { x1: 8 },
            }}
            x1="16"
            x2="21"
            y1="20"
            y2="20"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x1: 14, x2: 14 },
              animate: { x1: 9, x2: 9 },
            }}
            x1="14"
            x2="14"
            y1="2"
            y2="6"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x1: 8, x2: 8 },
              animate: { x1: 14, x2: 14 },
            }}
            x1="8"
            x2="8"
            y1="10"
            y2="14"
          />
          <m.line
            animate={controls}
            transition={sliderTransition}
            variants={{
              normal: { x1: 16, x2: 16 },
              animate: { x1: 8, x2: 8 },
            }}
            x1="16"
            x2="16"
            y1="18"
            y2="22"
          />
        </svg>
      </LazyMotion>
    </div>
  );
});

export { AnimatedSlidersHorizontalIcon, MicToggleIcon, VideoToggleIcon };
