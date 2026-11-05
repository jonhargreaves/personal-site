import { AnimatePresence, LazyMotion, m, type Variants } from "motion/react";
import {
  type MouseEventHandler,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";

import { LucideChevronRight } from "../../../../../icons/index";

import { DrawerContent, DrawerHandle } from "../../../drawer";
import { loadDomAnimation } from "../../../../internal/load-dom-animation";
import { cn } from "../../../../lib/utils";

import { useSurfaceTheme } from "../../../layouts/surface-theme";
import { MicToggleIcon, SheetMenuRow, VideoToggleIcon } from "./controls";
import { useMobileCallControlsContext } from "./mobile-call-controls-context";
import {
  useMobileCallControlsMediaContext,
  useOptionalMobileCallControlsMediaContext,
} from "./mobile-call-controls-media-context";
import {
  MobileCallControlsItemSheet,
  MobileCallControlsDeviceSheet,
  MobileCallControlsRootSheet,
  MobileCallControlsSettingsRow,
  MobileCallControlsSpeakerSection,
  MobileCallControlsWarningChip,
} from "./mobile-call-controls-views";
import type {
  CallControlsMobileDeviceSheetItemProps,
  CallControlsMobileNestedSheetItemProps,
  CallControlsMobileSheetItemProps,
  CallControlsMobileSheetProps,
} from "./types";

export type MobileSheetDirection = -1 | 1;
export type MobileSheetView = "root" | "camera" | "microphone" | "item";
export type MobileCallControlsSheetViewProps = {
  children?: ReactNode;
};

type MobileSheetAnimationConfig = {
  direction: MobileSheetDirection;
  reduceMotion: boolean;
};

const mobileSheetTransition: Variants = {
  center: {
    opacity: 1,
    x: 0,
  },
  enter: ({ direction, reduceMotion }: MobileSheetAnimationConfig) => ({
    opacity: 0,
    x: reduceMotion ? 0 : direction > 0 ? 28 : -28,
  }),
  exit: ({ direction, reduceMotion }: MobileSheetAnimationConfig) => ({
    opacity: 0,
    x: reduceMotion ? 0 : direction > 0 ? -22 : 22,
  }),
};

function MeasuredSheetView({
  children,
  onHeightChange,
}: {
  children: ReactNode;
  onHeightChange: (height: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const updateHeight = () => {
      onHeightChange(node.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onHeightChange]);

  return <div ref={ref}>{children}</div>;
}

export function MobileCallControlsSheetContent({
  children,
  onHeightChange,
  prefersReducedMotion,
  sheetDirection,
  sheetHeight,
  sheetView,
}: {
  children: ReactNode;
  onHeightChange: (height: number) => void;
  prefersReducedMotion: boolean;
  sheetDirection: MobileSheetDirection;
  sheetHeight: number | "auto";
  sheetView: MobileSheetView;
}) {
  const theme = useSurfaceTheme();
  return (
    <DrawerContent className={cn("mx-auto w-full max-w-lg", theme)}>
      <DrawerHandle />
      <div className="mx-auto w-full shrink-0 overflow-x-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <LazyMotion features={loadDomAnimation}>
          <m.div
            // eslint-disable-next-line react-doctor/no-layout-property-animation -- This measured drawer must resize surrounding flow without scaling its text; the bounded 240ms transition is disabled for reduced motion.
            animate={{ height: sheetHeight }}
            className="overflow-hidden"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AnimatePresence
              custom={{
                direction: sheetDirection,
                reduceMotion: prefersReducedMotion,
              }}
              initial={false}
              mode="wait"
            >
              <m.div
                animate="center"
                className="w-full"
                custom={{
                  direction: sheetDirection,
                  reduceMotion: prefersReducedMotion,
                }}
                exit="exit"
                initial="enter"
                key={sheetView}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                variants={mobileSheetTransition}
              >
                <MeasuredSheetView onHeightChange={onHeightChange}>
                  {children}
                </MeasuredSheetView>
              </m.div>
            </AnimatePresence>
          </m.div>
        </LazyMotion>
      </div>
    </DrawerContent>
  );
}

export function MobileCallControlsSheet({
  children,
}: CallControlsMobileSheetProps) {
  const { controller, prefersReducedMotion } = useMobileCallControlsContext(
    "CallControls.MobileSheet"
  );

  return (
    <MobileCallControlsSheetContent
      onHeightChange={controller.setSheetHeight}
      prefersReducedMotion={prefersReducedMotion}
      sheetDirection={controller.sheetDirection}
      sheetHeight={controller.sheetHeight}
      sheetView={controller.sheetView}
    >
      <MobileCallControlsSheetView>{children}</MobileCallControlsSheetView>
    </MobileCallControlsSheetContent>
  );
}

export function MobileCallControlsSheetView({
  children,
}: MobileCallControlsSheetViewProps) {
  const { controller } = useMobileCallControlsContext(
    "CallControls.MobileSheetView"
  );

  if (controller.sheetView === "root") {
    return (
      <MobileCallControlsRootSheet>{children}</MobileCallControlsRootSheet>
    );
  }

  if (controller.sheetView === "camera") {
    return <MobileCallControlsCameraSheet />;
  }

  if (controller.sheetView === "microphone") {
    return <MobileCallControlsMicrophoneSheet />;
  }

  return <MobileCallControlsSelectedItemSheet />;
}

export function MobileCallControlsCameraSheet() {
  const { controller } = useMobileCallControlsContext(
    "CallControls.MobileCameraSheet"
  );
  const media = useOptionalMobileCallControlsMediaContext();
  const videoPicker = media?.videoPicker;

  if (!media || !videoPicker) {
    return null;
  }

  return (
    <>
      <MobileCallControlsDeviceSheet
        buttonSize={controller.buttonSize}
        devices={media.cameraOptions}
        onBack={controller.showRootSheet}
        onSelect={videoPicker.onDeviceChange}
        onToggle={() => videoPicker.onVideoChange(!media.videoOn)}
        selectedDevice={media.selectedCamera}
        sheetIconSize={controller.sheetIconSize}
        title={videoPicker.label ?? "Video"}
        toggleIcon={
          <VideoToggleIcon
            className={controller.sheetIconSize}
            videoOn={media.videoOn}
          />
        }
        toggleLabel={
          media.videoTooltipText ??
          (media.videoOn ? "Turn video off" : "Turn video on")
        }
      />

      {videoPicker.onSettings ? (
        <MobileCallControlsSettingsRow
          label="Video settings"
          onClose={controller.closeDrawer}
          onSettings={videoPicker.onSettings}
          sheetIconSize={controller.sheetIconSize}
        />
      ) : null}
    </>
  );
}

export function MobileCallControlsMicrophoneSheet() {
  const { controller } = useMobileCallControlsContext(
    "CallControls.MobileMicrophoneSheet"
  );
  const media = useOptionalMobileCallControlsMediaContext();
  const audioPicker = media?.audioPicker;

  if (!media || !audioPicker) {
    return null;
  }

  return (
    <>
      <MobileCallControlsDeviceSheet
        buttonSize={controller.buttonSize}
        devices={media.microphoneOptions}
        renderDeviceTrailing={audioPicker.renderDeviceTrailing}
        onBack={controller.showRootSheet}
        onSelect={audioPicker.onDeviceChange}
        onToggle={() => audioPicker.onMutedChange(!media.muted)}
        selectedDevice={media.selectedMicrophone}
        sheetIconSize={controller.sheetIconSize}
        title={audioPicker.label ?? "Audio"}
        toggleIcon={
          <MicToggleIcon
            className={controller.sheetIconSize}
            muted={media.muted}
          />
        }
        toggleLabel={
          media.audioTooltipText ??
          (media.muted ? "Unmute microphone" : "Mute microphone")
        }
        unavailableMessage={
          media.audioPickerDisabled
            ? (media.audioTooltipText ?? "Allow microphone access")
            : undefined
        }
      />

      {audioPicker.onSpeakerChange ? (
        <MobileCallControlsSpeakerSection
          onSpeakerChange={audioPicker.onSpeakerChange}
          selectedSpeaker={media.selectedSpeaker}
          sheetIconSize={controller.sheetIconSize}
          speakerOptions={media.speakerOptions}
        />
      ) : null}

      {audioPicker.onSettings ? (
        <MobileCallControlsSettingsRow
          label="Audio settings"
          onClose={controller.closeDrawer}
          onSettings={audioPicker.onSettings}
          sheetIconSize={controller.sheetIconSize}
        />
      ) : null}
    </>
  );
}

export function MobileCallControlsSelectedItemSheet() {
  const { controller } = useMobileCallControlsContext(
    "CallControls.MobileSelectedItemSheet"
  );

  if (!controller.selectedItem) {
    return null;
  }

  return (
    <MobileCallControlsItemSheet
      item={controller.selectedItem}
      buttonSize={controller.buttonSize}
      onBack={controller.showRootSheet}
      sheetIconSize={controller.sheetIconSize}
    />
  );
}

function MobileVideoDeviceSheetRow({
  props,
  media,
  handleClick,
  controller,
}: {
  props: Omit<CallControlsMobileDeviceSheetItemProps, "kind">;
  media: ReturnType<typeof useMobileCallControlsMediaContext>;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  controller: ReturnType<typeof useMobileCallControlsContext>["controller"];
}) {
  if (!media.videoPicker) return null;

  return (
    <SheetMenuRow
      {...props}
      data-slot="call-controls-mobile-device-sheet-item"
      description={
        media.videoPermissionRequired
          ? (media.videoTooltipText ?? "Allow camera access")
          : `${media.videoOn ? "On" : "Off"} · ${media.selectedCameraName}`
      }
      disabled={media.videoPickerDisabled}
      label={media.videoPicker.label ?? "Video"}
      onClick={handleClick}
      tone={media.videoPermissionRequired ? "warning" : "default"}
      trailing={
        media.videoPermissionRequired ? (
          <>
            <VideoToggleIcon
              className={controller.sheetIconSize}
              videoOn={media.videoOn}
            />
            <MobileCallControlsWarningChip />
          </>
        ) : (
          <>
            <VideoToggleIcon
              className={controller.sheetIconSize}
              videoOn={media.videoOn}
            />
            <LucideChevronRight className={controller.sheetIconSize} />
          </>
        )
      }
    />
  );
}

function MobileAudioDeviceSheetRow({
  props,
  media,
  handleClick,
  controller,
}: {
  props: Omit<CallControlsMobileDeviceSheetItemProps, "kind">;
  media: ReturnType<typeof useMobileCallControlsMediaContext>;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  controller: ReturnType<typeof useMobileCallControlsContext>["controller"];
}) {
  if (!media.audioPicker) return null;

  return (
    <SheetMenuRow
      {...props}
      data-slot="call-controls-mobile-device-sheet-item"
      description={
        media.audioPickerDisabled
          ? `${media.audioTooltipText ?? "Allow microphone access"}${media.speakerOptions.length > 0 ? ` · ${media.selectedSpeakerName}` : ""}`
          : `${media.muted ? "Muted" : "Live"} · ${media.selectedMicrophoneName}${media.speakerOptions.length > 0 ? ` · ${media.selectedSpeakerName}` : ""}`
      }
      disabled={media.audioMenuDisabled}
      label={media.audioPicker.label ?? "Audio"}
      onClick={handleClick}
      tone={media.audioPermissionRequired ? "warning" : "default"}
      trailing={
        media.audioPermissionRequired ? (
          <>
            <MicToggleIcon
              className={controller.sheetIconSize}
              muted={media.muted}
            />
            <MobileCallControlsWarningChip />
          </>
        ) : (
          <>
            <MicToggleIcon
              className={controller.sheetIconSize}
              muted={media.muted}
            />
            <LucideChevronRight className={controller.sheetIconSize} />
          </>
        )
      }
    />
  );
}

export function MobileCallControlsDeviceSheetItem({
  kind,
  onClick,
  ...props
}: CallControlsMobileDeviceSheetItemProps) {
  const { controller } = useMobileCallControlsContext(
    "CallControls.MobileDeviceSheetItem"
  );
  const media = useMobileCallControlsMediaContext(
    "CallControls.MobileDeviceSheetItem"
  );

  if (kind === "video") {
    if (!media.videoPicker) {
      return null;
    }

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        controller.openCameraSheet();
      }
    };

    return (
      <MobileVideoDeviceSheetRow
        props={props}
        media={media}
        handleClick={handleClick}
        controller={controller}
      />
    );
  }

  if (!media.audioPicker) {
    return null;
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      controller.openMicrophoneSheet();
    }
  };

  return (
    <MobileAudioDeviceSheetRow
      props={props}
      media={media}
      handleClick={handleClick}
      controller={controller}
    />
  );
}

export function MobileCallControlsSheetItem({
  active,
  children,
  description,
  disabled,
  icon,
  id,
  label,
  onClick,
  onSelect,
  ...props
}: CallControlsMobileSheetItemProps) {
  const { controller } = useMobileCallControlsContext(
    "CallControls.MobileSheetItem"
  );
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (children) {
      controller.openItemSheet({ content: children, id, label });
      return;
    }

    onSelect?.();
  };

  return (
    <SheetMenuRow
      {...props}
      active={active}
      data-slot="call-controls-mobile-sheet-item"
      disabled={disabled}
      label={label}
      description={description}
      onClick={handleClick}
      trailing={
        children ? (
          <>
            {icon}
            <LucideChevronRight className={controller.sheetIconSize} />
          </>
        ) : (
          icon
        )
      }
    />
  );
}

export function MobileCallControlsNestedSheetItem({
  description,
  icon,
  label,
  onClick,
  onSelect,
  ...props
}: CallControlsMobileNestedSheetItemProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      onSelect?.();
    }
  };

  return (
    <SheetMenuRow
      {...props}
      data-slot="call-controls-mobile-nested-sheet-item"
      label={label}
      description={description}
      onClick={handleClick}
      trailing={icon}
    />
  );
}
