import type { ComponentProps } from "react";
import { cn } from "@/vendor/hyper-ui/ui/lib/utils";

// Figma: 7p0SO1BOGmnOaB0CiQZhKk / 459:3265. Keep the exported SVG unchanged.
export function MeetingVideoOffIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      className={cn("size-4.5", className)}
      data-figma-node-id="459:3265"
      data-slot="meeting-video-off-icon-glyph"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <image
        href="/prototypes/hyper-meeting/icons/video-off.svg"
        x="0.9167"
        y="0.9167"
        width="18.1667"
        height="18.1667"
      />
    </svg>
  );
}
