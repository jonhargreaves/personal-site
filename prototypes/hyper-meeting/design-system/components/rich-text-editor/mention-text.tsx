import type { ComponentProps } from "react";

import { cn } from "../../lib/utils";

export function MentionText({
  children,
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-block rounded bg-indigo-100 px-1 py-0.25 align-baseline font-medium text-indigo-600 text-sm",
        "dark:bg-indigo-800 dark:text-indigo-100",
        className
      )}
      data-slot="mention-text"
      {...props}
    >
      {children}
    </span>
  );
}
