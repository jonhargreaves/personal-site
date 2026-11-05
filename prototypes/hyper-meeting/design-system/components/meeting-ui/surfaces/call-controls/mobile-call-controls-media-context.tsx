import { createContext, type ReactNode, useContext, useMemo } from "react";

import { useMobileCallControlsContext } from "./mobile-call-controls-context";
import { getSelectedDeviceName } from "./shared";
import type {
  CallControlsAudioPickerProps,
  CallControlsVideoPickerProps,
  DeviceOption,
} from "./types";

export interface MobileCallControlsMediaProviderProps {
  audioPicker?: CallControlsAudioPickerProps;
  children: ReactNode;
  videoPicker?: CallControlsVideoPickerProps;
}

export type MobileCallControlsMediaContextValue = {
  audioMenuDisabled?: boolean;
  audioPermissionRequired: boolean;
  audioPicker?: CallControlsAudioPickerProps;
  audioPickerDisabled?: boolean;
  audioTooltipText?: string;
  cameraOptions: readonly DeviceOption[];
  microphoneOptions: readonly DeviceOption[];
  muted: boolean;
  selectedCamera: string;
  selectedCameraName: string;
  selectedMicrophone: string;
  selectedMicrophoneName: string;
  selectedSpeaker: string;
  selectedSpeakerName: string;
  speakerOptions: readonly DeviceOption[];
  videoOn: boolean;
  videoPermissionRequired: boolean;
  videoPicker?: CallControlsVideoPickerProps;
  videoPickerDisabled?: boolean;
  videoTooltipText?: string;
};

const MobileCallControlsMediaContext =
  createContext<MobileCallControlsMediaContextValue | null>(null);
const EMPTY_DEVICE_OPTIONS: readonly DeviceOption[] = [];

function getPermissionRequired({
  permissionRequired,
}: {
  permissionRequired?: boolean;
}) {
  return permissionRequired ?? false;
}

export function MobileCallControlsMediaProvider({
  audioPicker,
  children,
  videoPicker,
}: MobileCallControlsMediaProviderProps) {
  useMobileCallControlsContext("CallControls.MobileMediaProvider");

  const cameraOptions = videoPicker?.devices ?? EMPTY_DEVICE_OPTIONS;
  const microphoneOptions = audioPicker?.devices ?? EMPTY_DEVICE_OPTIONS;
  const speakerOptions = audioPicker?.speakerOptions ?? EMPTY_DEVICE_OPTIONS;
  const selectedCamera = videoPicker?.selectedDevice ?? "";
  const selectedMicrophone = audioPicker?.selectedDevice ?? "";
  const selectedSpeaker = audioPicker?.selectedSpeaker ?? "";
  const videoOn = videoPicker?.isVideoOn ?? false;
  const muted = audioPicker?.isMuted ?? false;
  const contextValue = useMemo(
    () => ({
      audioMenuDisabled: audioPicker?.menuDisabled,
      audioPermissionRequired: getPermissionRequired({
        permissionRequired: audioPicker?.permissionRequired,
      }),
      audioPicker,
      audioPickerDisabled: audioPicker?.pickerDisabled,
      audioTooltipText: audioPicker?.tooltipText,
      cameraOptions,
      microphoneOptions,
      muted,
      selectedCamera,
      selectedCameraName: getSelectedDeviceName(
        cameraOptions,
        selectedCamera,
        "No camera selected"
      ),
      selectedMicrophone,
      selectedMicrophoneName: getSelectedDeviceName(
        microphoneOptions,
        selectedMicrophone,
        "No microphone selected"
      ),
      selectedSpeaker,
      selectedSpeakerName: getSelectedDeviceName(
        speakerOptions,
        selectedSpeaker,
        "No speaker selected"
      ),
      speakerOptions,
      videoOn,
      videoPermissionRequired: getPermissionRequired({
        permissionRequired: videoPicker?.permissionRequired,
      }),
      videoPicker,
      videoPickerDisabled: videoPicker?.pickerDisabled,
      videoTooltipText: videoPicker?.tooltipText,
    }),
    [
      audioPicker,
      cameraOptions,
      microphoneOptions,
      muted,
      selectedCamera,
      selectedMicrophone,
      selectedSpeaker,
      speakerOptions,
      videoOn,
      videoPicker,
    ]
  );

  return (
    <MobileCallControlsMediaContext.Provider value={contextValue}>
      {children}
    </MobileCallControlsMediaContext.Provider>
  );
}

export function useOptionalMobileCallControlsMediaContext() {
  return useOptionalMobileCallControlsMedia();
}

export function useOptionalMobileCallControlsMedia() {
  return useContext(MobileCallControlsMediaContext);
}

export function useMobileCallControlsMediaContext(componentName: string) {
  return useMobileCallControlsMedia(componentName);
}

export function useMobileCallControlsMedia(
  componentName = "useMobileCallControlsMedia"
) {
  const context = useContext(MobileCallControlsMediaContext);

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside CallControls.MobileMediaProvider.`
    );
  }

  return context;
}
