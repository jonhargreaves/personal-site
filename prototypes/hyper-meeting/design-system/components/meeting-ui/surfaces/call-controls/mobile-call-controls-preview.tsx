import type * as React from "react";

import { Button, type ButtonProps } from "../../../button";
import { DrawerTrigger } from "../../../drawer";
import { cn } from "../../../../lib/utils";

import {
  MicToggleIcon,
  MobilePreviewButton,
  VideoToggleIcon,
} from "./controls";
import { AnimatedSlidersHorizontalIcon } from "./icons";
import { MediaTogglePendingIcon } from "./media-toggle-pending-icon";
import { useMobileCallControlsContext } from "./mobile-call-controls-context";
import { useMobileCallControlsMediaContext } from "./mobile-call-controls-media-context";
import {
  controlButtonVariants,
  getButtonSizeClass,
  getControlSizeClasses,
} from "./shared";
import type {
  CallControlsMobilePreviewActionProps,
  CallControlsMobilePreviewProps,
  CallControlsMobilePreviewToggleProps,
} from "./types";

export function MobileCallControlsPreview({
  children,
  className,
  ref,
  ...props
}: CallControlsMobilePreviewProps) {
  const { size } = useMobileCallControlsContext("CallControls.MobilePreview");
  const { gap } = getControlSizeClasses(size);

  return (
    <div
      className={cn(
        "flex max-w-full flex-wrap items-center justify-center",
        gap,
        "gap-2",
        className
      )}
      data-slot="call-controls-mobile-preview"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
}

function MobileVideoPreview({
  props,
  videoPicker,
  className,
  disabled,
  iconSize,
  prefersReducedMotion,
  videoOn,
  ariaLabel,
  handleClick,
  ref,
  size,
  videoPermissionRequired,
  variant,
}: {
  props: Omit<CallControlsMobilePreviewToggleProps, "kind">;
  videoPicker: NonNullable<
    ReturnType<typeof useMobileCallControlsMediaContext>["videoPicker"]
  >;
  className: string | undefined;
  disabled: boolean | undefined;
  iconSize: string;
  prefersReducedMotion: boolean;
  videoOn: boolean;
  ariaLabel: string | undefined;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  ref: React.Ref<HTMLButtonElement> | undefined;
  size: ReturnType<typeof useMobileCallControlsContext>["size"];
  videoPermissionRequired: boolean;
  variant: ReturnType<typeof useMobileCallControlsContext>["variant"];
}) {
  return (
    <MobilePreviewButton
      {...props}
      aria-busy={videoPicker.toggleLoading || undefined}
      className={cn(
        className,
        videoPicker.toggleLoading && "animate-field-highlight-pending"
      )}
      data-kind="video"
      data-pending={videoPicker.toggleLoading || undefined}
      data-slot="call-controls-mobile-preview-toggle"
      disabled={disabled || videoPicker.toggleDisabled}
      icon={
        videoPicker.icon ??
        (videoPicker.toggleLoading ? (
          <MediaTogglePendingIcon
            className={iconSize}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : (
          <VideoToggleIcon className={iconSize} videoOn={videoOn} />
        ))
      }
      hyperElId="video-toggle"
      label={
        ariaLabel ??
        videoPicker.tooltipText ??
        (videoOn ? "Turn video off" : "Turn video on")
      }
      onClick={handleClick}
      pressed={!videoOn}
      ref={ref}
      size={size}
      tone={
        videoPermissionRequired ? "warning" : videoOn ? "default" : "mediaOff"
      }
      variant={variant}
    />
  );
}

function MobileAudioPreview({
  props,
  audioPicker,
  className,
  disabled,
  iconSize,
  prefersReducedMotion,
  muted,
  ariaLabel,
  handleClick,
  ref,
  size,
  audioPermissionRequired,
  variant,
}: {
  props: Omit<CallControlsMobilePreviewToggleProps, "kind">;
  audioPicker: NonNullable<
    ReturnType<typeof useMobileCallControlsMediaContext>["audioPicker"]
  >;
  className: string | undefined;
  disabled: boolean | undefined;
  iconSize: string;
  prefersReducedMotion: boolean;
  muted: boolean;
  ariaLabel: string | undefined;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  ref: React.Ref<HTMLButtonElement> | undefined;
  size: ReturnType<typeof useMobileCallControlsContext>["size"];
  audioPermissionRequired: boolean;
  variant: ReturnType<typeof useMobileCallControlsContext>["variant"];
}) {
  return (
    <MobilePreviewButton
      {...props}
      aria-busy={audioPicker.toggleLoading || undefined}
      className={cn(
        className,
        audioPicker.toggleLoading && "animate-field-highlight-pending"
      )}
      data-kind="audio"
      data-pending={audioPicker.toggleLoading || undefined}
      data-slot="call-controls-mobile-preview-toggle"
      disabled={disabled || audioPicker.toggleDisabled}
      icon={
        audioPicker.icon ??
        (audioPicker.toggleLoading ? (
          <MediaTogglePendingIcon
            className={iconSize}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : (
          <MicToggleIcon className={iconSize} muted={muted} />
        ))
      }
      hyperElId="audio-toggle"
      label={
        ariaLabel ??
        audioPicker.tooltipText ??
        (muted ? "Unmute microphone" : "Mute microphone")
      }
      onClick={handleClick}
      pressed={muted}
      ref={ref}
      size={size}
      tone={
        audioPermissionRequired ? "warning" : muted ? "mediaOff" : "default"
      }
      variant={variant}
    />
  );
}

export function MobileCallControlsPreviewToggle({
  "aria-label": ariaLabel,
  className,
  disabled,
  kind,
  onClick,
  ref,
  ...props
}: CallControlsMobilePreviewToggleProps) {
  const { prefersReducedMotion, size, variant } = useMobileCallControlsContext(
    "CallControls.MobilePreviewToggle"
  );
  const {
    audioPicker,
    audioPermissionRequired,
    videoPermissionRequired,
    videoPicker,
  } = useMobileCallControlsMediaContext("CallControls.MobilePreviewToggle");
  const { iconSize } = getControlSizeClasses(size);

  if (kind === "video") {
    if (!videoPicker) {
      return null;
    }

    const videoOn = videoPicker.isVideoOn;
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        videoPicker.onVideoChange(!videoOn);
      }
    };

    return (
      <MobileVideoPreview
        props={props}
        videoPicker={videoPicker}
        className={className}
        disabled={disabled}
        iconSize={iconSize}
        prefersReducedMotion={prefersReducedMotion}
        videoOn={videoOn}
        ariaLabel={ariaLabel}
        handleClick={handleClick}
        ref={ref}
        size={size}
        videoPermissionRequired={videoPermissionRequired}
        variant={variant}
      />
    );
  }

  if (!audioPicker) {
    return null;
  }

  const muted = audioPicker.isMuted;
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      audioPicker.onMutedChange(!muted);
    }
  };

  return (
    <MobileAudioPreview
      props={props}
      audioPicker={audioPicker}
      className={className}
      disabled={disabled}
      iconSize={iconSize}
      prefersReducedMotion={prefersReducedMotion}
      muted={muted}
      ariaLabel={ariaLabel}
      handleClick={handleClick}
      ref={ref}
      size={size}
      audioPermissionRequired={audioPermissionRequired}
      variant={variant}
    />
  );
}

export function MobileCallControlsPreviewAction({
  className,
  disabled,
  icon,
  id,
  label,
  onClick,
  pressed,
  ref,
  tone,
  ...props
}: CallControlsMobilePreviewActionProps) {
  const { size, variant } = useMobileCallControlsContext(
    "CallControls.MobilePreviewAction"
  );

  return (
    <MobilePreviewButton
      {...props}
      className={className}
      data-slot="call-controls-mobile-preview-action"
      disabled={disabled}
      hyperElId={id}
      icon={icon}
      label={label}
      onClick={onClick}
      pressed={pressed}
      ref={ref}
      size={size}
      tone={tone}
      variant={variant}
    />
  );
}

export type MobileCallControlsMoreTriggerProps = Omit<
  ButtonProps,
  "children" | "size" | "variant"
> & {
  iconSize?: number;
};

export function MobileCallControlsMoreTrigger({
  "aria-label": ariaLabel = "More call controls",
  className,
  iconSize,
  onClick,
  ...props
}: MobileCallControlsMoreTriggerProps) {
  const { controller, size, variant } = useMobileCallControlsContext(
    "CallControls.MobileMoreTrigger"
  );
  const iconPixelSize = iconSize ?? (size === "lg" ? 22 : 20);
  const moreButtonSize = getButtonSizeClass(size, variant);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      controller.playMoreAnimation();
    }
  };

  return (
    <DrawerTrigger asChild>
      <Button
        aria-label={ariaLabel}
        className={cn(
          controlButtonVariants({ size, variant, tone: "default" }),
          moreButtonSize,
          className
        )}
        onClick={handleClick}
        type="button"
        variant="ghost"
        {...props}
      >
        <AnimatedSlidersHorizontalIcon
          // The animation ref is forwarded; its current value is not read here.
          // eslint-disable-next-line react-hooks/refs
          ref={controller.moreIconRef}
          size={iconPixelSize}
        />
      </Button>
    </DrawerTrigger>
  );
}
