"use client";

import { cn } from "../../../../lib/utils";

import { useCallControls } from "./call-controls-context";
import { ControlButton } from "./controls";
import { getDesktopCallControlsPickerModel } from "./desktop-call-controls-picker-model";
import { getControlSizeClasses } from "./shared";
import type { CallControlsMediaToggleProps } from "./types";

function CallControlsMediaToggle({
  buttonClassName,
  ...props
}: CallControlsMediaToggleProps) {
  const {
    isMobile,
    prefersReducedMotion,
    showLabels,
    showTooltips,
    size,
    variant,
  } = useCallControls("CallControls.MediaToggle");

  if (isMobile) {
    return null;
  }

  const { iconSize } = getControlSizeClasses(size);
  const {
    className,
    hyperElId,
    icon,
    isPressed,
    onToggle,
    pending,
    ref,
    rootProps,
    toggleDisabled,
    toggleLabel,
    tooltipText,
  } = getDesktopCallControlsPickerModel({
    iconSize,
    prefersReducedMotion,
    props,
  });

  return (
    <ControlButton
      {...rootProps}
      buttonClassName={cn(
        buttonClassName,
        pending && "animate-field-highlight-pending"
      )}
      buttonProps={{
        "aria-busy": pending || undefined,
        "aria-pressed": isPressed,
      }}
      className={className}
      disabled={toggleDisabled}
      hyperElId={hyperElId}
      icon={icon}
      isActive={isPressed}
      label={toggleLabel}
      onClick={onToggle}
      ref={ref}
      showLabel={showLabels}
      showTooltip={showTooltips}
      size={size}
      tooltipText={tooltipText}
      variant={variant}
    />
  );
}

export { CallControlsMediaToggle };
