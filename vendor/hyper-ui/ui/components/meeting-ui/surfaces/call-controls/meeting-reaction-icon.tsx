import type { ComponentProps } from "react";

/**
 * Grinning face used for the reactions control. Inlined so the library ships
 * no asset modules; paths come from the original face-grin.svg (17.44 unit
 * viewBox) translated into the 20x20 frame.
 */
export function MeetingReactionIcon({
  className,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="20"
      {...props}
      viewBox="0 0 20 20"
      width="20"
    >
      <g fill="#FAFAFA" transform="translate(1.28 1.28)">
        <path
          d="M8.72 16.78C13.17 16.78 16.78 13.17 16.78 8.72C16.78 4.27 13.17 0.67 8.72 0.67C4.27 0.67 0.67 4.27 0.67 8.72C0.67 13.17 4.27 16.78 8.72 16.78Z"
          fillOpacity="0.1"
          stroke="#FAFAFA"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path d="M5.39 8.72C6 8.72 6.5 8.22 6.5 7.61C6.5 7 6 6.5 5.39 6.5C4.77 6.5 4.28 7 4.28 7.61C4.28 8.22 4.77 8.72 5.39 8.72Z" />
        <path d="M12.05 8.72C12.67 8.72 13.16 8.22 13.16 7.61C13.16 7 12.67 6.5 12.05 6.5C11.44 6.5 10.94 7 10.94 7.61C10.94 8.22 11.44 8.72 12.05 8.72Z" />
        <path d="M11.94 10.67C11.77 10.5 11.53 10.43 11.29 10.46C9.59 10.73 7.83 10.73 6.14 10.46C5.9 10.43 5.67 10.5 5.5 10.67C5.33 10.84 5.25 11.09 5.29 11.33C5.54 13.01 7.02 14.28 8.72 14.28C10.42 14.28 11.9 13.01 12.15 11.33C12.19 11.09 12.11 10.84 11.94 10.67V10.67Z" />
      </g>
    </svg>
  );
}
