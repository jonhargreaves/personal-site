import type { ComponentProps } from "react";

import { cn } from "../../../../lib/utils";

const rotatingTileClassName =
  "[transform-box:view-box] motion-safe:rotate-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[ease]";
const clockwiseRotationClassName =
  "motion-safe:pointer-fine:group-hover/control-button:rotate-45";
const counterclockwiseRotationClassName =
  "motion-safe:pointer-fine:group-hover/control-button:-rotate-45";

const tileSize = 6.6667;
const tileRadius = 2.0833;

function MoreIconTile({
  className,
  rotationClassName,
  x,
  y,
}: {
  className?: string;
  rotationClassName: string;
  x: number;
  y: number;
}) {
  return (
    <g
      className={cn(rotatingTileClassName, rotationClassName, className)}
      data-slot="meeting-more-icon-rotating-tile"
    >
      <rect
        className="opacity-[0.08] group-data-[tone=default]/control:pointer-fine:group-hover/control-button:opacity-20"
        fill="currentColor"
        height={tileSize}
        rx={tileRadius}
        width={tileSize}
        x={x}
        y={y}
      />
      <rect
        height={tileSize}
        rx={tileRadius}
        stroke="currentColor"
        strokeWidth="1.5"
        width={tileSize}
        x={x}
        y={y}
      />
    </g>
  );
}

export function MeetingMoreIcon({
  className,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-4.5", className)}
      data-slot="meeting-more-icon"
      fill="none"
      height="20"
      viewBox="0 0 19.4281 19.4281"
      width="20"
      {...props}
    >
      <path
        d="M14.71 1.38V8.05M18.05 4.71L11.38 4.71"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <MoreIconTile
        className="[transform-origin:4.71415px_4.71415px] transition-colors duration-150 ease-[ease] group-data-[tone=default]/control:pointer-fine:group-hover/control-button:text-emerald-500"
        rotationClassName={clockwiseRotationClassName}
        x={1.3808}
        y={1.3808}
      />
      <rect
        className="transition-colors duration-150 ease-[ease] group-data-[tone=default]/control:pointer-fine:group-hover/control-button:stroke-indigo-500"
        height={tileSize}
        rx={tileRadius}
        stroke="currentColor"
        strokeWidth="1.5"
        width={tileSize}
        x={1.3808}
        y={11.3808}
      />
      <MoreIconTile
        className="[transform-origin:14.71415px_14.71415px] transition-colors duration-150 ease-[ease] group-data-[tone=default]/control:pointer-fine:group-hover/control-button:text-fuchsia-500"
        rotationClassName={counterclockwiseRotationClassName}
        x={11.3808}
        y={11.3808}
      />
    </svg>
  );
}
