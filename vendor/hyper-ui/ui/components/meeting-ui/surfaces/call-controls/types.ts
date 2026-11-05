import type * as React from "react";
import type { ReactNode } from "react";

import type { ButtonProps } from "../../../button";

export type ControlSize = "sm" | "md" | "lg";
export type ButtonVariant = "default" | "circular";
export type CallControlsPickerKind = "audio" | "video";
export type CallControlsResponsiveMode = "auto" | "desktop" | "mobile";

import type { DeviceOption } from "../../../device-picker-menu";
export type {
  DeviceOption,
  DevicePickerActionModel,
  DevicePickerMenuAvailability,
  DevicePickerSectionModel,
  DevicePickerStatus,
} from "../../../device-picker-menu";

export interface CallControlsNestedSheetItem {
  id: string;
  icon: ReactNode;
  label: string;
  description?: string;
  onSelect?: () => void;
}

export interface CallControlsRootProps extends React.ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  responsiveMode?: CallControlsResponsiveMode;
  /** Available width below which auto mode uses the mobile controls. */
  mobileBreakpoint?: number;
  showLabels?: boolean;
  showTooltips?: boolean;
  size?: ControlSize;
  variant?: ButtonVariant;
}

export type CallControlsContextValue = Required<
  Pick<
    CallControlsRootProps,
    "showLabels" | "showTooltips" | "size" | "variant"
  >
> & {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  responsiveMode: CallControlsResponsiveMode;
};

export type CallControlsDesktopProps = React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
};

export type CallControlsGroupProps = React.ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export type CallControlsButtonButtonProps = Omit<
  ButtonProps,
  "children" | "className" | "disabled" | "onClick" | "ref" | "size" | "variant"
>;

export type CallControlsMobileActionButtonProps = Omit<
  ButtonProps,
  "children" | "disabled" | "size" | "variant"
> & {
  ref?: React.Ref<HTMLButtonElement>;
};

export type CallControlsButtonBaseProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "onClick"
> & {
  buttonClassName?: string;
  buttonProps?: CallControlsButtonButtonProps;
  disabled?: boolean;
  hoverIcon?: ReactNode;
  icon: ReactNode;
  isActive?: boolean;
  isDanger?: boolean;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  panelActiveHoverIcon?: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  tone?: "accent" | "panelActive" | "primary";
  tooltipText?: string;
};

export type CallControlsButtonProps = CallControlsButtonBaseProps & {
  id: string;
};

export type CallControlsPickerRootProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  ref?: React.Ref<HTMLDivElement>;
};

interface CallControlsPickerBaseProps extends CallControlsPickerRootProps {
  devices: readonly DeviceOption[];
  enableSorting?: boolean;
  icon?: ReactNode;
  label?: string;
  menuDisabled?: boolean;
  menuLabel?: string;
  onDeviceChange: (id: string) => void;
  onDevicesSort?: (devices: DeviceOption[]) => void;
  pickerDisabled?: boolean;
  permissionRequired?: boolean;
  selectedDevice: string;
  toggleDisabled?: boolean;
  toggleLabel?: string;
  toggleLoading?: boolean;
  tooltipText?: string;
}

export interface CallControlsAudioPickerProps extends CallControlsPickerBaseProps {
  kind: "audio";
  isMuted: boolean;
  onMutedChange: (isMuted: boolean) => void;
  onSettings?: () => void;
  onSpeakerChange?: (speakerId: string) => void;
  onSpeakerOptionsSort?: (speakerOptions: DeviceOption[]) => void;
  renderDeviceTrailing?: (deviceId: string) => ReactNode;
  selectedSpeaker?: string;
  speakerOptions?: readonly DeviceOption[];
}

export interface CallControlsVideoPickerProps extends CallControlsPickerBaseProps {
  kind: "video";
  isVideoOn: boolean;
  onSettings?: () => void;
  onVideoChange: (isVideoOn: boolean) => void;
}

export type CallControlsPickerProps =
  | CallControlsAudioPickerProps
  | CallControlsVideoPickerProps;

export type CallControlsMediaToggleProps = CallControlsPickerProps & {
  buttonClassName?: string;
};

export interface CallControlsSheetItem {
  active?: boolean;
  description?: string;
  disabled?: boolean;
  icon: ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
  tone?: "primary";
}

export interface CallControlsPreviewAction {
  disabled?: boolean;
  icon: ReactNode;
  id: string;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  pressed?: boolean;
  tone?: "active" | "danger" | "default" | "mediaOff" | "warning";
}

export interface CallControlsMobileControlsProps {
  children: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export interface CallControlsMobileMediaProviderProps {
  audioPicker?: CallControlsAudioPickerProps;
  children: ReactNode;
  videoPicker?: CallControlsVideoPickerProps;
}

export type CallControlsMobileDeviceSheetItemProps =
  CallControlsMobileActionButtonProps & {
    kind: CallControlsPickerKind;
  };

export type CallControlsMobilePreviewProps =
  React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
  };

export type CallControlsMobilePreviewToggleProps =
  CallControlsMobileActionButtonProps & {
    disabled?: boolean;
    kind: CallControlsPickerKind;
  };

export type CallControlsMobileSheetProps = {
  children?: ReactNode;
};

export type CallControlsMobilePreviewActionProps =
  CallControlsMobileActionButtonProps & CallControlsPreviewAction;

export type CallControlsMobileSheetItemProps =
  CallControlsMobileActionButtonProps &
    CallControlsSheetItem & {
      children?: ReactNode;
    };

export type CallControlsMobileNestedSheetItemProps =
  CallControlsMobileActionButtonProps & CallControlsNestedSheetItem;
