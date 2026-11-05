import { getDesktopCallControlsPickerModel } from "./desktop-call-controls-picker-model";
import { DesktopMediaDeviceControl } from "./desktop-media-device-control";
import { getControlSizeClasses } from "./shared";
import type {
  ButtonVariant,
  CallControlsPickerProps,
  ControlSize,
} from "./types";

function DesktopCallControlsPicker({
  prefersReducedMotion,
  props,
  showLabels,
  showTooltips,
  size,
  variant,
}: {
  prefersReducedMotion: boolean;
  props: CallControlsPickerProps;
  showLabels: boolean;
  showTooltips: boolean;
  size: ControlSize;
  variant: ButtonVariant;
}) {
  const { iconSize } = getControlSizeClasses(size);
  const { className, ref, rootProps, ...model } =
    getDesktopCallControlsPickerModel({
      iconSize,
      prefersReducedMotion,
      props,
    });

  return (
    <DesktopMediaDeviceControl
      {...rootProps}
      {...model}
      className={className}
      ref={ref}
      showLabel={showLabels}
      showTooltip={showTooltips}
      size={size}
      variant={variant}
    />
  );
}

export { DesktopCallControlsPicker };
