import type { ComponentProps } from "react";
import { cn } from "@/vendor/hyper-ui/ui/lib/utils";

// Figma: 7p0SO1BOGmnOaB0CiQZhKk / 588:3679; palette adapted to prototype red.
export function MeetingVideoOffIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      className={cn("size-5", className)}
      data-figma-node-id="588:3679"
      data-slot="meeting-video-off-icon-glyph"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <image
        href="/prototypes/hyper-meeting/icons/video-off.svg"
        x="1.2518"
        y="1.25"
        width="21.4982"
        height="21.5"
      />
    </svg>
  );
}
