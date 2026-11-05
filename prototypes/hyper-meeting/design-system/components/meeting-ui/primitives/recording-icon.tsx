import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../../lib/utils";

export type MeetingRecordingIconProps = ComponentPropsWithoutRef<"span"> & {
  readonly animated?: boolean;
  readonly "data-slot"?: string;
};

export function MeetingRecordingIcon({
  animated = false,
  className,
  "data-slot": dataSlot = "meeting-recording-icon",
  ...props
}: MeetingRecordingIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-4 items-center justify-center",
        animated && "animate-recording-glyph-pulse",
        className
      )}
      data-slot={dataSlot}
      {...props}
    >
      <span className="inline-flex size-3.5 items-center justify-center rounded-full border border-current">
        <span className="size-2 rounded-full bg-current" />
      </span>
    </span>
  );
}
