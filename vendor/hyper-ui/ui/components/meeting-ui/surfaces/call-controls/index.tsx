"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "../../../../hooks/use-mobile";
import { cn } from "../../../../lib/utils";

import {
  CallControlsProvider,
  useCallControls,
  useOptionalCallControls,
} from "./call-controls-context";
import { CallControlsMediaToggle } from "./call-controls-media-toggle";
import {
  ControlButton,
  ControlTooltip,
  MediaToggleButton,
  MobilePreviewButton,
  SheetMenuRow,
} from "./controls";
import { DesktopCallControlsPicker } from "./desktop-call-controls";
import {
  DesktopMediaDeviceControl,
  desktopDevicePickerTriggerVariants,
  desktopMediaDeviceSplitPillVariants,
} from "./desktop-media-device-control";
import { MobileCallControls } from "./mobile-call-controls";
import { MobileCallControlsMediaProvider } from "./mobile-call-controls-media-context";
import {
  MobileCallControlsMoreTrigger,
  MobileCallControlsPreview,
  MobileCallControlsPreviewAction,
  MobileCallControlsPreviewToggle,
} from "./mobile-call-controls-preview";
import {
  MobileCallControlsCameraSheet,
  MobileCallControlsDeviceSheetItem,
  MobileCallControlsMicrophoneSheet,
  MobileCallControlsNestedSheetItem,
  MobileCallControlsSelectedItemSheet,
  MobileCallControlsSheet,
  MobileCallControlsSheetItem,
  MobileCallControlsSheetView,
} from "./mobile-call-controls-sheet";
import {
  MobileCallControlsWarningChip,
  mobileCallControlsWarningChipVariants,
} from "./mobile-call-controls-views";
import {
  CallControlsReactionPicker,
  type CallControlsReactionPickerProps,
} from "./reaction-picker";
import {
  floatingCallControlButtonVariants,
  getControlSizeClasses,
} from "./shared";
import type {
  ButtonVariant,
  CallControlsAudioPickerProps,
  CallControlsButtonProps,
  CallControlsContextValue,
  CallControlsDesktopProps,
  CallControlsGroupProps,
  CallControlsMobileControlsProps,
  CallControlsMobileDeviceSheetItemProps,
  CallControlsMobileMediaProviderProps,
  CallControlsMediaToggleProps,
  CallControlsMobileNestedSheetItemProps,
  CallControlsMobilePreviewActionProps,
  CallControlsMobilePreviewProps,
  CallControlsMobilePreviewToggleProps,
  CallControlsMobileSheetItemProps,
  CallControlsMobileSheetProps,
  CallControlsNestedSheetItem,
  CallControlsPickerProps,
  CallControlsPreviewAction,
  CallControlsResponsiveMode,
  CallControlsRootProps,
  CallControlsSheetItem,
  CallControlsVideoPickerProps,
  ControlSize,
  DeviceOption,
  DevicePickerActionModel,
  DevicePickerMenuAvailability,
  DevicePickerSectionModel,
  DevicePickerStatus,
} from "./types";

export type { MobileCallControlsSheetViewProps } from "./mobile-call-controls-sheet";
export type { MobileCallControlsWarningChipProps } from "./mobile-call-controls-views";

function useCallControlsContext(componentName: string) {
  return useCallControls(componentName);
}

function CallControlsRoot({
  children,
  className,
  responsiveMode = "auto",
  mobileBreakpoint = 1024,
  showLabels = true,
  showTooltips = true,
  size = "md",
  variant = "circular",
  ...props
}: CallControlsRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const viewportMobile = useIsMobile(mobileBreakpoint);
  useEffect(() => {
    const element = rootRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0)
        setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const detectedMobile =
    containerWidth === null
      ? viewportMobile
      : containerWidth < mobileBreakpoint;
  const isMobile =
    responsiveMode === "mobile"
      ? true
      : responsiveMode === "desktop"
        ? false
        : detectedMobile;
  const prefersReducedMotion = useReducedMotion() ?? false;
  const contextValue = useMemo(
    () => ({
      isMobile,
      prefersReducedMotion,
      responsiveMode,
      showLabels,
      showTooltips,
      size,
      variant,
    }),
    [
      isMobile,
      prefersReducedMotion,
      responsiveMode,
      showLabels,
      showTooltips,
      size,
      variant,
    ]
  );

  return (
    <CallControlsProvider value={contextValue}>
      <div
        className={cn(
          "flex w-full min-w-0 items-center justify-center",
          className
        )}
        data-slot="call-controls"
        ref={rootRef}
        {...props}
      >
        {children}
      </div>
    </CallControlsProvider>
  );
}

function CallControlsDesktop({
  children,
  className,
  ref,
  ...props
}: CallControlsDesktopProps) {
  const { isMobile, size } = useCallControlsContext("CallControls.Desktop");

  if (isMobile) {
    return null;
  }

  const { gap } = getControlSizeClasses(size);

  return (
    <div
      className={cn(
        "flex min-w-0 flex-nowrap items-center justify-center",
        gap,
        className
      )}
      data-slot="call-controls-desktop"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
}

function CallControlsMobileControls({
  children,
  defaultOpen,
  onOpenChange,
  open,
}: CallControlsMobileControlsProps) {
  const { isMobile, prefersReducedMotion, size, variant } =
    useCallControlsContext("CallControls.MobileControls");

  if (!isMobile) {
    return null;
  }

  return (
    <MobileCallControls
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
      prefersReducedMotion={prefersReducedMotion}
      size={size}
      variant={variant}
    >
      {children}
    </MobileCallControls>
  );
}

function CallControlsMobileMediaProvider({
  children,
  ...props
}: CallControlsMobileMediaProviderProps) {
  return (
    <MobileCallControlsMediaProvider {...props}>
      {children}
    </MobileCallControlsMediaProvider>
  );
}

function CallControlsGroup({
  children,
  className,
  ref,
  ...props
}: CallControlsGroupProps) {
  const { isMobile, size } = useCallControlsContext("CallControls.Group");
  const { gap } = getControlSizeClasses(size);

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-nowrap items-center justify-center",
        gap,
        className
      )}
      data-slot="call-controls-group"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
}

function CallControlsButton({ id, ...props }: CallControlsButtonProps) {
  const { isMobile, showLabels, showTooltips, size, variant } =
    useCallControlsContext("CallControls.Button");

  if (isMobile) {
    return null;
  }

  return (
    <ControlButton
      {...props}
      hyperElId={id}
      showLabel={showLabels}
      showTooltip={showTooltips}
      size={size}
      variant={variant}
    />
  );
}

function CallControlsPicker(props: CallControlsPickerProps) {
  const {
    isMobile,
    prefersReducedMotion,
    showLabels,
    showTooltips,
    size,
    variant,
  } = useCallControlsContext("CallControls.Picker");

  if (isMobile) {
    return null;
  }

  return (
    <DesktopCallControlsPicker
      prefersReducedMotion={prefersReducedMotion}
      props={props}
      showLabels={showLabels}
      showTooltips={showTooltips}
      size={size}
      variant={variant}
    />
  );
}

function CallControlsReactions({
  className,
  ...props
}: CallControlsReactionPickerProps) {
  const { isMobile, showLabels, showTooltips, size, variant } =
    useCallControlsContext("CallControls.Reactions");

  return (
    <CallControlsReactionPicker
      {...props}
      className={cn(isMobile && "w-fit", className)}
      showLabels={isMobile ? false : showLabels}
      showTooltips={isMobile ? false : showTooltips}
      size={size}
      variant={variant}
    />
  );
}

const CallControls = Object.assign(CallControlsRoot, {
  Button: CallControlsButton,
  Desktop: CallControlsDesktop,
  Group: CallControlsGroup,
  MobileControls: CallControlsMobileControls,
  MobileCameraSheet: MobileCallControlsCameraSheet,
  MobileDeviceSheetItem: MobileCallControlsDeviceSheetItem,
  MobileMediaProvider: CallControlsMobileMediaProvider,
  MobileMoreTrigger: MobileCallControlsMoreTrigger,
  MobileMicrophoneSheet: MobileCallControlsMicrophoneSheet,
  MobileNestedSheetItem: MobileCallControlsNestedSheetItem,
  MobilePreview: MobileCallControlsPreview,
  MobilePreviewAction: MobileCallControlsPreviewAction,
  MobilePreviewToggle: MobileCallControlsPreviewToggle,
  MobileSelectedItemSheet: MobileCallControlsSelectedItemSheet,
  MobileSheet: MobileCallControlsSheet,
  MobileSheetItem: MobileCallControlsSheetItem,
  MobileSheetView: MobileCallControlsSheetView,
  MediaToggle: CallControlsMediaToggle,
  Picker: CallControlsPicker,
  Reactions: CallControlsReactions,
  Root: CallControlsRoot,
});

export {
  CallControls,
  ControlButton,
  ControlTooltip,
  DesktopMediaDeviceControl,
  MediaToggleButton,
  MobileCallControlsCameraSheet,
  MobileCallControlsMicrophoneSheet,
  MobileCallControlsSelectedItemSheet,
  MobileCallControlsSheetView,
  MobileCallControlsWarningChip,
  MobilePreviewButton,
  SheetMenuRow,
  desktopDevicePickerTriggerVariants,
  desktopMediaDeviceSplitPillVariants,
  floatingCallControlButtonVariants,
  mobileCallControlsWarningChipVariants,
  useCallControls,
  useOptionalCallControls,
};
export { MeetingMoreIcon } from "./meeting-more-icon";
export { MicToggleIcon, VideoToggleIcon } from "./icons";
export {
  useMobileCallControls,
  useOptionalMobileCallControls,
} from "./mobile-call-controls-context";
export {
  useMobileCallControlsMedia,
  useOptionalMobileCallControlsMedia,
} from "./mobile-call-controls-media-context";
export type {
  ControlButtonProps,
  MediaToggleButtonProps,
  SheetMenuRowProps,
} from "./controls";
export {
  meetingReactionOptions,
  type CallControlsReactionPickerProps,
  type MeetingReactionOption,
} from "./reaction-picker";
export type { MobileCallControlsContextValue } from "./mobile-call-controls-context";
export type {
  MobileCallControlsMediaContextValue,
  MobileCallControlsMediaProviderProps,
} from "./mobile-call-controls-media-context";
export type { MobileCallControlsMoreTriggerProps } from "./mobile-call-controls-preview";
export type {
  ButtonVariant,
  CallControlsAudioPickerProps,
  CallControlsButtonProps,
  CallControlsContextValue,
  CallControlsDesktopProps,
  CallControlsGroupProps,
  CallControlsMobileControlsProps,
  CallControlsMobileDeviceSheetItemProps,
  CallControlsMobileMediaProviderProps,
  CallControlsMediaToggleProps,
  CallControlsMobileNestedSheetItemProps,
  CallControlsMobilePreviewActionProps,
  CallControlsMobilePreviewProps,
  CallControlsMobilePreviewToggleProps,
  CallControlsMobileSheetItemProps,
  CallControlsMobileSheetProps,
  CallControlsNestedSheetItem,
  CallControlsPickerProps,
  CallControlsPreviewAction,
  CallControlsResponsiveMode,
  CallControlsRootProps,
  CallControlsSheetItem,
  CallControlsVideoPickerProps,
  ControlSize,
  DevicePickerActionModel,
  DevicePickerMenuAvailability,
  DevicePickerSectionModel,
  DevicePickerStatus,
  DeviceOption,
};
