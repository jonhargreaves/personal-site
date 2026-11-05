import type { ReactNode } from "react";

import { HugeSettings02Stroke } from "../../../../icons/index";

import { MicToggleIcon, VideoToggleIcon } from "./controls";
import { MediaTogglePendingIcon } from "./media-toggle-pending-icon";
import type {
  CallControlsPickerProps,
  CallControlsPickerRootProps,
  DevicePickerActionModel,
  DevicePickerMenuAvailability,
  DevicePickerSectionModel,
  DevicePickerStatus,
} from "./types";

type DesktopCallControlsPickerModel = {
  readonly action?: DevicePickerActionModel;
  readonly className?: string;
  readonly hyperElId: "audio-toggle" | "video-toggle";
  readonly icon: ReactNode;
  readonly isPressed: boolean;
  readonly label: string;
  readonly menuAvailability: DevicePickerMenuAvailability;
  readonly menuLabel: string;
  readonly onToggle: () => void;
  readonly pending: boolean;
  readonly ref?: CallControlsPickerRootProps["ref"];
  readonly rootProps: Omit<CallControlsPickerRootProps, "className" | "ref">;
  readonly sections: readonly DevicePickerSectionModel[];
  readonly status: DevicePickerStatus;
  readonly toggleDisabled?: boolean;
  readonly toggleLabel: string;
  readonly tooltipText: string;
};

function createSettingsAction(
  id: string,
  label: string,
  onClick: (() => void) | undefined
): DevicePickerActionModel | undefined {
  if (!onClick) {
    return undefined;
  }

  return {
    id,
    icon: <HugeSettings02Stroke className="h-4 w-4" />,
    label,
    onSelect: onClick,
  };
}

function getDevicePickerStatus({
  disabled,
  message,
  permissionRequired,
}: {
  readonly disabled?: boolean;
  readonly message: string;
  readonly permissionRequired?: boolean;
}): DevicePickerStatus {
  if (permissionRequired) {
    return { kind: "needs-permission", message };
  }

  if (!disabled) {
    return { kind: "available" };
  }

  return { kind: "unavailable", message };
}

function getDevicePickerMenuAvailability({
  explicitDisabled,
  hasExtraContent,
  status,
}: {
  readonly explicitDisabled?: boolean;
  readonly hasExtraContent: boolean;
  readonly status: DevicePickerStatus;
}): DevicePickerMenuAvailability {
  if (explicitDisabled ?? (status.kind !== "available" && !hasExtraContent)) {
    return { kind: "disabled" };
  }

  return { kind: "enabled" };
}

function getAudioDesktopCallControlsPickerModel({
  iconSize,
  prefersReducedMotion,
  props,
}: {
  readonly iconSize: string;
  readonly prefersReducedMotion: boolean;
  readonly props: Extract<CallControlsPickerProps, { kind: "audio" }>;
}): DesktopCallControlsPickerModel {
  const {
    className,
    devices,
    enableSorting,
    icon,
    isMuted,
    kind: _kind,
    label,
    menuDisabled,
    menuLabel,
    onDeviceChange,
    onDevicesSort,
    onMutedChange,
    onSettings,
    onSpeakerChange,
    onSpeakerOptionsSort,
    pickerDisabled,
    permissionRequired,
    ref,
    renderDeviceTrailing,
    selectedDevice,
    selectedSpeaker,
    speakerOptions,
    toggleDisabled,
    toggleLabel,
    toggleLoading,
    tooltipText,
    ...rootProps
  } = props;
  const audioSpeakerOptions = speakerOptions ?? [];
  const sections: DevicePickerSectionModel[] = [
    {
      devices,
      enableSorting,
      id: "microphone",
      label: menuLabel ?? "Microphone devices",
      onDeviceChange,
      onDevicesSort,
      renderTrailing: renderDeviceTrailing,
      selectedDevice,
    },
  ];

  if (audioSpeakerOptions.length > 0 && onSpeakerChange) {
    sections.push({
      devices: audioSpeakerOptions,
      enableSorting,
      id: "speaker",
      label: "Speaker devices",
      onDeviceChange: onSpeakerChange,
      onDevicesSort: onSpeakerOptionsSort,
      selectedDevice: selectedSpeaker ?? "",
    });
  }

  const action = createSettingsAction(
    "audio-settings",
    "Audio settings",
    onSettings
  );
  const resolvedTooltipText =
    tooltipText ?? (isMuted ? "Unmute microphone" : "Mute microphone");
  const status = getDevicePickerStatus({
    disabled: pickerDisabled,
    message: resolvedTooltipText,
    permissionRequired,
  });

  return {
    action,
    className,
    hyperElId: "audio-toggle",
    icon:
      icon ??
      (toggleLoading ? (
        <MediaTogglePendingIcon
          className={iconSize}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : (
        <MicToggleIcon className={iconSize} muted={isMuted} />
      )),
    isPressed: isMuted,
    label: label ?? "Audio",
    menuAvailability: getDevicePickerMenuAvailability({
      explicitDisabled: menuDisabled,
      hasExtraContent: sections.length > 1 || Boolean(action),
      status,
    }),
    menuLabel: menuLabel ?? "Audio devices",
    onToggle: () => onMutedChange(!isMuted),
    pending: toggleLoading ?? false,
    ref,
    rootProps,
    sections,
    status,
    toggleDisabled,
    toggleLabel:
      toggleLabel ?? (isMuted ? "Unmute microphone" : "Mute microphone"),
    tooltipText: resolvedTooltipText,
  };
}

function getVideoDesktopCallControlsPickerModel({
  iconSize,
  prefersReducedMotion,
  props,
}: {
  readonly iconSize: string;
  readonly prefersReducedMotion: boolean;
  readonly props: Extract<CallControlsPickerProps, { kind: "video" }>;
}): DesktopCallControlsPickerModel {
  const {
    className,
    devices,
    enableSorting,
    icon,
    isVideoOn,
    kind: _kind,
    label,
    menuDisabled,
    menuLabel,
    onDeviceChange,
    onDevicesSort,
    onSettings,
    onVideoChange,
    pickerDisabled,
    permissionRequired,
    ref,
    selectedDevice,
    toggleDisabled,
    toggleLabel,
    toggleLoading,
    tooltipText,
    ...rootProps
  } = props;
  const action = createSettingsAction(
    "video-settings",
    "Video settings",
    onSettings
  );
  const resolvedTooltipText =
    tooltipText ?? (isVideoOn ? "Turn off camera" : "Turn on camera");
  const status = getDevicePickerStatus({
    disabled: pickerDisabled,
    message: resolvedTooltipText,
    permissionRequired,
  });

  return {
    action,
    className,
    hyperElId: "video-toggle",
    icon:
      icon ??
      (toggleLoading ? (
        <MediaTogglePendingIcon
          className={iconSize}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : (
        <VideoToggleIcon className={iconSize} videoOn={isVideoOn} />
      )),
    isPressed: !isVideoOn,
    label: label ?? "Video",
    menuAvailability: getDevicePickerMenuAvailability({
      explicitDisabled: menuDisabled,
      hasExtraContent: Boolean(action),
      status,
    }),
    menuLabel: menuLabel ?? "Camera devices",
    onToggle: () => onVideoChange(!isVideoOn),
    pending: toggleLoading ?? false,
    ref,
    rootProps,
    sections: [
      {
        devices,
        enableSorting,
        id: "camera",
        label: menuLabel ?? "Camera devices",
        onDeviceChange,
        onDevicesSort,
        selectedDevice,
      },
    ],
    status,
    toggleDisabled,
    toggleLabel:
      toggleLabel ?? (isVideoOn ? "Turn off camera" : "Turn on camera"),
    tooltipText: resolvedTooltipText,
  };
}

function getDesktopCallControlsPickerModel({
  iconSize,
  prefersReducedMotion,
  props,
}: {
  readonly iconSize: string;
  readonly prefersReducedMotion: boolean;
  readonly props: CallControlsPickerProps;
}) {
  return props.kind === "audio"
    ? getAudioDesktopCallControlsPickerModel({
        iconSize,
        prefersReducedMotion,
        props,
      })
    : getVideoDesktopCallControlsPickerModel({
        iconSize,
        prefersReducedMotion,
        props,
      });
}

export {
  getDesktopCallControlsPickerModel,
  getDevicePickerMenuAvailability,
  getDevicePickerStatus,
};
export type { DesktopCallControlsPickerModel };
