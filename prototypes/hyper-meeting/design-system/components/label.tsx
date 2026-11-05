"use client";

import * as React from "react";

import { HugeHelpCircleStroke } from "../icons/icons/HugeHelpCircleStroke";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "../lib/utils";

type LabelProps = React.ComponentProps<"label"> & {
  /** Supplementary, non-interactive help shown beside the label. */
  tooltip?: React.ReactNode;
  /** Accessible help-button text, announced after the field label. */
  tooltipLabel?: string;
};

function Label({
  className,
  id,
  tooltip,
  tooltipLabel = "More information",
  ...props
}: LabelProps) {
  const generatedId = React.useId();
  const hasTooltip =
    tooltip !== undefined &&
    tooltip !== null &&
    tooltip !== false &&
    tooltip !== "";
  const labelId = id ?? (hasTooltip ? `${generatedId}-label` : undefined);
  const helpId = `${generatedId}-help`;
  const tooltipId = `${generatedId}-tooltip`;
  const label = (
    <label
      id={labelId}
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      data-slot="label"
      {...props}
    />
  );

  if (!hasTooltip) return label;

  return (
    <span
      data-slot="label-with-tooltip"
      className="flex min-w-0 items-center gap-1 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
    >
      {label}
      <Tooltip>
        <TooltipTrigger
          type="button"
          data-slot="label-tooltip-trigger"
          aria-labelledby={`${labelId} ${helpId}`}
          aria-describedby={tooltipId}
          className="inline-flex size-6 shrink-0 cursor-help items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-data-[disabled=true]:opacity-50 disabled:pointer-events-none disabled:opacity-50"
        >
          <HugeHelpCircleStroke className="size-3.5" aria-hidden="true" />
          <span id={helpId} className="sr-only">
            {tooltipLabel}
          </span>
        </TooltipTrigger>
        <TooltipContent id={tooltipId} role="tooltip">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

export type { LabelProps };
export { Label };
