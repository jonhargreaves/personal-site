import type { SVGProps } from "react";

import { cn } from "../../lib/utils";

export function EmptyChatIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-auto", className)}
      fill="none"
      viewBox="28 14 196 182"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        stroke="var(--color-empty-illustration-brand-highlight)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path
          d="M127.39 38 L203.6 82 Q213.99 88 203.6 94 L163.77 117 Q153.37 123 142.98 117 L108.34 97 L71.97 96 L89.29 86 L66.77 73 Q56.38 67 66.77 61 L106.61 38 Q117 32 127.39 38 Z"
          fill="var(--color-empty-illustration-neutral-surface)"
        />
        <path
          d="M127.39 30 L203.6 74 Q213.99 80 203.6 86 L163.77 109 Q153.37 115 142.98 109 L108.34 89 L71.97 88 L89.29 78 L66.77 65 Q56.38 59 66.77 53 L106.61 30 Q117 24 127.39 30 Z"
          fill="var(--color-empty-illustration-neutral-surface)"
        />
        <path
          d="M118.73 47 L172.43 78"
          stroke="var(--color-empty-illustration-brand-accent)"
          strokeWidth={3}
        />
        <path
          d="M104.88 55 L144.71 78"
          stroke="var(--color-empty-illustration-brand-accent)"
          strokeWidth={3}
        />
        <path
          d="M109.39 101 L185.6 145 Q195.99 151 185.6 157 L145.77 180 Q135.37 186 124.98 180 L90.34 160 L53.97 159 L71.29 149 L48.77 136 Q38.38 130 48.77 124 L88.61 101 Q99 95 109.39 101 Z"
          fill="var(--color-empty-illustration-brand-surface)"
        />
        <path
          d="M109.39 93 L185.6 137 Q195.99 143 185.6 149 L145.77 172 Q135.37 178 124.98 172 L90.34 152 L53.97 151 L71.29 141 L48.77 128 Q38.38 122 48.77 116 L88.61 93 Q99 87 109.39 93 Z"
          fill="var(--color-empty-illustration-neutral-surface)"
        />
        <path
          d="M93.8 119 C99.87 115.5 108.53 120.5 102.46 124 C96.4 127.5 87.74 122.5 93.8 119 Z"
          fill="var(--color-empty-illustration-brand-surface)"
          stroke="var(--color-empty-illustration-brand-accent)"
        />
        <path
          d="M112.86 130 C118.92 126.5 127.58 131.5 121.52 135 C115.45 138.5 106.79 133.5 112.86 130 Z"
          fill="var(--color-empty-illustration-brand-surface)"
          stroke="var(--color-empty-illustration-brand-accent)"
        />
        <path
          d="M131.91 141 C137.97 137.5 146.63 142.5 140.57 146 C134.51 149.5 125.85 144.5 131.91 141 Z"
          fill="var(--color-empty-illustration-brand-surface)"
          stroke="var(--color-empty-illustration-brand-accent)"
        />
      </g>
    </svg>
  );
}
