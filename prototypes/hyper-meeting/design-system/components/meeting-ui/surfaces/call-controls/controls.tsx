import type { ReactElement, ReactNode, Ref } from "react";

import { HugeCallEnd04Duotone } from "../../../../icons/index";

import { Button, type ButtonProps } from "../../../button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../tooltip";
import * as Predicate from "../../../../lib/predicate";
import { cn } from "../../../../lib/utils";

import { menuItemPointerClassName } from "../../../menu/styles";
import { MicToggleIcon, VideoToggleIcon } from "./icons";
import {
  controlButtonVariants,
  getButtonSizeClass,
  getControlSizeClasses,
} from "./shared";
import type {
  ButtonVariant,
  CallControlsButtonBaseProps,
  ControlSize,
} from "./types";

type PreviewButtonTone =
  | "active"
  | "accent"
  | "danger"
  | "default"
  | "mediaOff"
  | "panelActive"
  | "primary"
  | "warning";

type ControlButtonIconMotion = "crossfade" | "rotate";

export type ControlButtonProps = CallControlsButtonBaseProps & {
  hyperElId?: string;
  hoverIconMotion?: ControlButtonIconMotion;
  showLabel: boolean;
  showTooltip: boolean;
  size: ControlSize;
  variant: ButtonVariant;
};

export type MediaToggleButtonProps = Omit<
  ButtonProps,
  "children" | "className" | "size" | "variant"
> & {
  className?: string;
  hyperElId?: string;
  icon: ReactNode;
  label: string;
  pressed?: boolean;
  size: ControlSize;
  tone?: PreviewButtonTone;
  variant?: ButtonVariant;
};

export type SheetMenuRowProps = Omit<
  ButtonProps,
  "children" | "disabled" | "variant"
> & {
  active?: boolean;
  description?: string;
  disabled?: boolean;
  label: string;
  ref?: Ref<HTMLButtonElement>;
  tone?: "default" | "primary" | "warning";
  trailing: ReactNode;
};

function wrapDisabledTooltipTrigger(
  trigger: ReactElement,
  disabled: boolean,
  className = "inline-flex pointer-events-auto",
  label?: string
): ReactElement {
  if (!disabled) {
    return trigger;
  }

  return (
    <span
      aria-disabled="true"
      aria-label={label}
      className={className}
      data-slot="disabled-tooltip-trigger"
      tabIndex={0}
    >
      {trigger}
    </span>
  );
}

function ControlTooltip({
  children,
  content,
  disabled = false,
  disabledWrapperClassName,
  sideOffset = 8,
}: {
  children: ReactElement;
  content: ReactNode;
  disabled?: boolean;
  disabledWrapperClassName?: string;
  sideOffset?: number;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {wrapDisabledTooltipTrigger(
          children,
          disabled,
          disabledWrapperClassName,
          Predicate.isString(content) ? content : undefined
        )}
      </TooltipTrigger>
      <TooltipContent
        className="rounded-xs border-white/[0.09] px-2 py-1.5 text-xs leading-4 tracking-[0.01em] shadow-md backdrop-blur-none motion-reduce:animate-none"
        sideOffset={sideOffset}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

function getSheetMenuRowClassName({
  warning,
  primary,
  active,
  disabled,
  className,
}: {
  warning: boolean;
  primary: boolean;
  active: boolean | undefined;
  disabled: boolean | undefined;
  className: string | undefined;
}) {
  return cn(
    "flex h-auto min-h-14 w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-left whitespace-normal transition-colors",
    warning
      ? "bg-warning/12 ring-1 ring-warning/25"
      : primary
        ? "bg-primary/15 ring-1 ring-primary/30"
        : active
          ? "bg-foreground/10 ring-1 ring-foreground/10"
          : "bg-muted/45",
    disabled
      ? warning
        ? "cursor-default"
        : "pointer-events-none opacity-50"
      : warning
        ? "cursor-default"
        : primary
          ? menuItemPointerClassName
          : menuItemPointerClassName,
    className
  );
}

function SheetMenuRow({
  active,
  className,
  description,
  disabled,
  label,
  ref,
  tone = "default",
  trailing,
  ...props
}: SheetMenuRowProps) {
  const primary = tone === "primary";
  const warning = tone === "warning";

  return (
    <Button
      aria-disabled={disabled}
      className={getSheetMenuRowClassName({
        warning: warning,
        primary: primary,
        active: active,
        disabled: disabled,
        className: className,
      })}
      data-slot="call-controls-mobile-sheet-row"
      data-tone={tone}
      disabled={disabled}
      ref={ref}
      type="button"
      variant="ghost"
      {...props}
    >
      <div className="min-w-0 flex-1 break-words">
        <p
          className={cn(
            "text-base font-medium",
            warning
              ? "text-warning"
              : primary
                ? "text-primary"
                : "text-foreground"
          )}
        >
          {label}
        </p>
        {description ? (
          <p
            className={cn(
              "mt-1 text-sm",
              warning
                ? "text-warning/80"
                : primary
                  ? "text-primary/80"
                  : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div
        className={cn(
          "ml-auto flex shrink-0 items-center gap-3",
          warning
            ? "text-warning"
            : primary
              ? "text-primary"
              : "text-muted-foreground"
        )}
      >
        {trailing}
      </div>
    </Button>
  );
}

function MediaToggleButton({
  className,
  disabled = false,
  hyperElId,
  icon,
  label,
  onClick,
  pressed,
  size,
  tone = "default",
  type,
  variant = "default",
  ...props
}: MediaToggleButtonProps) {
  return (
    <Button
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        controlButtonVariants({ variant, tone, disabled, size }),
        className
      )}
      data-hyper-elid={hyperElId}
      data-state={pressed === undefined ? undefined : pressed ? "on" : "off"}
      disabled={disabled}
      onClick={onClick}
      type={type ?? "button"}
      variant={null}
      {...props}
    >
      {icon}
    </Button>
  );
}

function MobilePreviewButton({
  className,
  icon,
  label,
  size,
  variant = "default",
  tone = "default",
  ...props
}: Omit<MediaToggleButtonProps, "className" | "size" | "variant"> & {
  className?: string;
  size: ControlSize;
  variant?: ButtonVariant;
}) {
  return (
    <MediaToggleButton
      {...props}
      className={cn(getButtonSizeClass(size, variant), className)}
      icon={icon}
      label={label}
      size={size}
      tone={tone}
      variant={variant}
    />
  );
}

function ControlButtonIcon({
  hoverIcon,
  icon,
  motion = "crossfade",
  size,
}: {
  hoverIcon?: ReactNode;
  icon: ReactNode;
  motion?: ControlButtonIconMotion;
  size: ControlSize;
}) {
  const { iconSize } = getControlSizeClasses(size);

  if (!hoverIcon) {
    return icon;
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex items-center justify-center [&_path]:[vector-effect:non-scaling-stroke]",
        iconSize,
        motion === "rotate" &&
          "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[ease] motion-safe:pointer-fine:group-hover/control-button:rotate-15"
      )}
      data-slot="call-controls-button-icon"
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center opacity-100 pointer-fine:group-hover/control-button:opacity-0",
          motion === "crossfade" &&
            "transition-opacity duration-150 ease-[ease]"
        )}
        data-slot="call-controls-button-icon-default"
      >
        {icon}
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center opacity-0 pointer-fine:group-hover/control-button:opacity-100",
          motion === "crossfade" &&
            "transition-opacity duration-150 ease-[ease]"
        )}
        data-slot="call-controls-button-icon-hover"
      >
        {hoverIcon}
      </span>
    </span>
  );
}

function ControlButtonLabel({
  labelClassName,
  labelSize,
  tone,
  isDanger,
  label,
}: {
  labelClassName: "text-neutral-400";
  labelSize: "text-xs leading-none" | "text-sm" | "text-base";
  tone: "danger" | "accent" | "panelActive" | "primary" | "active" | "default";
  isDanger: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        labelClassName,
        labelSize,
        "transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-active/control:text-neutral-50 motion-reduce:transition-none",
        tone === "panelActive" && "text-neutral-50",
        isDanger
          ? "pointer-fine:group-hover/control:text-destructive"
          : "pointer-fine:group-hover/control:text-neutral-50"
      )}
    >
      {label}
    </span>
  );
}

function ControlButton({
  buttonClassName,
  buttonProps,
  className,
  disabled = false,
  hyperElId,
  hoverIcon,
  hoverIconMotion,
  icon,
  isActive = false,
  isDanger = false,
  label,
  onClick,
  panelActiveHoverIcon,
  ref,
  showLabel,
  showTooltip,
  size,
  tone: explicitTone,
  tooltipText,
  variant,
  ...props
}: ControlButtonProps) {
  const { controlGap, labelSize } = getControlSizeClasses(size);
  const tone = isDanger
    ? "danger"
    : (explicitTone ?? (isActive ? "active" : "default"));
  const labelClassName = "text-neutral-400";
  const resolvedHoverIcon = disabled
    ? undefined
    : tone === "panelActive"
      ? panelActiveHoverIcon
      : hoverIcon;
  const buttonElement = (
    <MediaToggleButton
      {...buttonProps}
      className={cn(
        getButtonSizeClass(size, variant),
        resolvedHoverIcon && "group/control-button",
        buttonClassName
      )}
      disabled={disabled}
      hyperElId={hyperElId}
      icon={
        <ControlButtonIcon
          hoverIcon={resolvedHoverIcon}
          icon={icon}
          motion={hoverIconMotion}
          size={size}
        />
      }
      label={label}
      onClick={onClick}
      size={size}
      tone={tone}
      variant={variant}
    />
  );
  const resolvedTooltip = tooltipText ?? label;

  return (
    <div
      className={cn(
        "group/control flex flex-col items-center",
        controlGap,
        variant === "circular" && "w-18",
        className
      )}
      data-active={isActive || undefined}
      data-tone={tone}
      ref={ref}
      {...props}
      data-slot="call-controls-button"
    >
      {showTooltip ? (
        <ControlTooltip content={resolvedTooltip} disabled={disabled}>
          {buttonElement}
        </ControlTooltip>
      ) : (
        buttonElement
      )}
      {showLabel ? (
        <ControlButtonLabel
          labelClassName={labelClassName}
          labelSize={labelSize}
          tone={tone}
          isDanger={isDanger}
          label={label}
        />
      ) : null}
    </div>
  );
}

export {
  ControlButton,
  ControlTooltip,
  HugeCallEnd04Duotone as LeaveIcon,
  MediaToggleButton,
  MicToggleIcon,
  MobilePreviewButton,
  SheetMenuRow,
  VideoToggleIcon,
  wrapDisabledTooltipTrigger,
};
