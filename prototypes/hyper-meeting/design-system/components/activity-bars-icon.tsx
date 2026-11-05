"use client";

import type * as React from "react";

export type ActivityBarsIconProps = React.SVGProps<SVGSVGElement> & {
  readonly animated?: boolean;
  readonly ref?: React.Ref<SVGSVGElement>;
};

export function ActivityBarsIcon({
  animated = true,
  className,
  ref,
  ...props
}: ActivityBarsIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      data-animated={animated}
      fill="none"
      height="20"
      ref={ref}
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>{`
        .activity-bars-icon-bar {
          fill: currentColor;
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform;
        }
        .activity-bars-icon-bar-1 {
          animation: activity-bars-icon-bar-1 0.8s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
          transform: scaleY(0.667);
        }
        .activity-bars-icon-bar-2 {
          animation: activity-bars-icon-bar-2 0.8s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
          transform: scaleY(0.5);
        }
        .activity-bars-icon-bar-3 {
          animation: activity-bars-icon-bar-3 0.8s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
          transform: scaleY(1);
        }
        .activity-bars-icon-bar-4 {
          animation: activity-bars-icon-bar-4 0.8s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
          transform: scaleY(0.5);
        }
        [data-animated="false"] .activity-bars-icon-bar {
          animation: none;
        }
        [data-animated="false"] .activity-bars-icon-bar-1 {
          transform: scaleY(0.25);
        }
        [data-animated="false"] .activity-bars-icon-bar-2 {
          transform: scaleY(0.333);
        }
        [data-animated="false"] .activity-bars-icon-bar-3 {
          transform: scaleY(0.417);
        }
        [data-animated="false"] .activity-bars-icon-bar-4 {
          transform: scaleY(0.25);
        }
        @keyframes activity-bars-icon-bar-1 { from { transform: scaleY(0.667); } to { transform: scaleY(0.333); } }
        @keyframes activity-bars-icon-bar-2 { from { transform: scaleY(0.5); } to { transform: scaleY(1); } }
        @keyframes activity-bars-icon-bar-3 { from { transform: scaleY(1); } to { transform: scaleY(0.5); } }
        @keyframes activity-bars-icon-bar-4 { from { transform: scaleY(0.5); } to { transform: scaleY(0.833); } }

        @media (prefers-reduced-motion: reduce) {
          .activity-bars-icon-bar-1, .activity-bars-icon-bar-2, .activity-bars-icon-bar-3, .activity-bars-icon-bar-4 { animation: none; }
          .activity-bars-icon-bar-1 { transform: scaleY(0.667); }
          .activity-bars-icon-bar-2 { transform: scaleY(0.5); }
          .activity-bars-icon-bar-3 { transform: scaleY(1); }
          .activity-bars-icon-bar-4 { transform: scaleY(0.5); }
        }
      `}</style>
      <rect
        className="activity-bars-icon-bar activity-bars-icon-bar-1"
        height="12"
        rx="0.75"
        width="1.5"
        x="4"
        y="4"
      />
      <rect
        className="activity-bars-icon-bar activity-bars-icon-bar-2"
        height="12"
        rx="0.75"
        width="1.5"
        x="7.5"
        y="4"
      />
      <rect
        className="activity-bars-icon-bar activity-bars-icon-bar-3"
        height="12"
        rx="0.75"
        width="1.5"
        x="11"
        y="4"
      />
      <rect
        className="activity-bars-icon-bar activity-bars-icon-bar-4"
        height="12"
        rx="0.75"
        width="1.5"
        x="14.5"
        y="4"
      />
    </svg>
  );
}
