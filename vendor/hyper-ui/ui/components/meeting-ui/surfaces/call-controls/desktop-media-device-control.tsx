import { cva } from "class-variance-authority";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useRef,
  useState,
} from "react";

import { LucideChevronsUpDown } from "../../../../../icons/index";

import { Button } from "../../../button";
import { DevicePickerMenuContent } from "../../../device-picker-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../../../dropdown-menu-primitives";
import { cn } from "../../../../lib/utils";

import { ControlTooltip, MediaToggleButton } from "./controls";
import { getControlSizeClasses } from "./shared";
import type {
  ButtonVariant,
  ControlSize,
  DevicePickerActionModel,
  DevicePickerMenuAvailability,
  DevicePickerSectionModel,
  DevicePickerStatus,
} from "./types";

type DesktopMediaDeviceControlRootProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  ref?: Ref<HTMLDivElement>;
};

interface DesktopMediaDeviceControlProps extends DesktopMediaDeviceControlRootProps {
  action?: DevicePickerActionModel;
  hyperElId?: string;
  icon: ReactNode;
  isPressed: boolean;
  label: string;
  menuAvailability: DevicePickerMenuAvailability;
  menuLabel: string;
  onToggle: () => void;
  pending?: boolean;
  sections: readonly DevicePickerSectionModel[];
  showLabel: boolean;
  showTooltip: boolean;
  size: ControlSize;
  status: DevicePickerStatus;
  toggleDisabled?: boolean;
  toggleLabel: string;
  tooltipText: string;
  variant: ButtonVariant;
}

const desktopDevicePickerTriggerVariants = cva(
  "flex items-center justify-center [&_[stroke]]:[stroke-width:1.5] [&_[stroke]]:[vector-effect:non-scaling-stroke]",
  {
    variants: {
      segmented: {
        false: "",
        true: "rounded-l-none rounded-r-full p-0 transition-colors has-[>svg]:px-0",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      state: {
        available: "",
        disabled: "",
        permission: "",
      },
      variant: {
        circular: "shrink-0 transition-colors",
        default:
          "rounded-lg transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
      },
    },
    compoundVariants: [
      {
        segmented: false,
        variant: "circular",
        className: "rounded-full",
      },
      {
        size: "sm",
        variant: "circular",
        className: "h-6 w-6",
      },
      {
        size: "md",
        variant: "circular",
        className: "h-7 w-7",
      },
      {
        size: "lg",
        variant: "circular",
        className: "h-8 w-8",
      },
      {
        segmented: true,
        size: "sm",
        variant: "circular",
        className: "h-10 w-8",
      },
      {
        segmented: true,
        size: "md",
        variant: "circular",
        className: "h-11 w-9",
      },
      {
        segmented: true,
        size: "lg",
        variant: "circular",
        className: "h-12 w-10",
      },
      {
        size: "sm",
        variant: "default",
        className: "h-10 px-1",
      },
      {
        size: "md",
        variant: "default",
        className: "h-11 px-1.5",
      },
      {
        size: "lg",
        variant: "default",
        className: "h-12 px-1.5",
      },
      {
        state: "permission",
        variant: "circular",
        className: "bg-white/10 text-current",
      },
      {
        state: "disabled",
        variant: "circular",
        className: "bg-white/[0.03] text-neutral-500",
      },
      {
        state: "available",
        variant: "circular",
        className:
          "cursor-pointer bg-white/[0.03] text-neutral-300 pointer-fine:hover:bg-white/[0.13] pointer-fine:hover:text-white active:scale-[0.96] motion-reduce:active:scale-100",
      },
      {
        segmented: true,
        state: "available",
        variant: "circular",
        className:
          "bg-transparent text-neutral-400 data-[popup-open]:bg-white/[0.045] data-[popup-open]:text-neutral-50 pointer-fine:hover:bg-white/[0.045] pointer-fine:hover:text-neutral-50 active:scale-100 [&_svg]:-translate-x-px [&_svg]:size-4",
      },
      {
        segmented: true,
        state: "disabled",
        variant: "circular",
        className: "bg-transparent pointer-fine:hover:bg-transparent!",
      },
      {
        state: "permission",
        variant: "default",
        className: "bg-warning text-warning-foreground ring-1 ring-warning/35",
      },
      {
        state: "disabled",
        variant: "default",
        className: "bg-muted/40 text-muted-foreground/70",
      },
      {
        state: "available",
        variant: "default",
        className:
          "cursor-pointer text-muted-foreground pointer-fine:hover:bg-foreground/5 pointer-fine:hover:text-foreground active:scale-[0.96] motion-reduce:active:scale-100",
      },
    ],
    defaultVariants: {
      segmented: false,
    },
  }
);

const desktopMediaDeviceSplitPillVariants = cva(
  "flex items-center justify-center rounded-full border transition-[border-color,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
  {
    variants: {
      design: {
        segmented: "relative gap-0 overflow-hidden p-0",
        standard: "gap-2 px-2",
      },
      size: {
        sm: "h-10 w-18",
        md: "h-11 w-20",
        lg: "h-12 w-[5.5rem]",
      },
      state: {
        available: "",
        disabled: "border-white/10 bg-neutral-900/55 text-neutral-500",
        permission: "border-warning/25 bg-warning text-warning-foreground",
      },
    },
    compoundVariants: [
      {
        design: "standard",
        state: "available",
        className:
          "border-white/[0.14] bg-white/[0.03] text-neutral-100 shadow-xs has-[button:focus-visible]:border-white/[0.18] has-[button:focus-visible]:bg-white/[0.1] pointer-fine:has-[button:hover]:border-white/[0.18] pointer-fine:has-[button:hover]:bg-white/[0.1]",
      },
      {
        design: "segmented",
        state: "available",
        className:
          "border-border bg-background text-neutral-100 shadow-xs has-[button:focus-visible]:border-input has-[button:focus-visible]:shadow-md pointer-fine:has-[button:hover]:border-input pointer-fine:has-[button:hover]:shadow-md",
      },
    ],
    defaultVariants: {
      design: "standard",
    },
  }
);

function renderDevicePickerTrigger({
  disabled,
  label,
  size,
  status,
  triggerRef,
  variant,
  segmented = false,
}: {
  disabled: boolean;
  label: string;
  segmented?: boolean;
  size: ControlSize;
  status: DevicePickerStatus;
  triggerRef: React.Ref<HTMLButtonElement>;
  variant: ButtonVariant;
}) {
  const { caretSize } = getControlSizeClasses(size);
  const pickerIndicatorSize =
    size === "sm" ? "text-[10px]" : size === "md" ? "text-[11px]" : "text-xs";
  const permissionRequired = status.kind === "needs-permission";
  const triggerState = permissionRequired
    ? "permission"
    : disabled
      ? "disabled"
      : "available";

  return (
    <Button
      aria-label={`Select ${label.toLowerCase()}`}
      className={desktopDevicePickerTriggerVariants({
        segmented,
        size,
        state: triggerState,
        variant,
      })}
      disabled={disabled}
      ref={triggerRef}
      type="button"
      variant="ghost"
    >
      {permissionRequired ? (
        <span
          aria-hidden="true"
          className={cn("font-black leading-none", pickerIndicatorSize)}
        >
          !
        </span>
      ) : (
        <LucideChevronsUpDown className={caretSize} />
      )}
    </Button>
  );
}

function getCircularToggleClassName({
  buttonHeight,
  size,
  toggleDisabled,
  status,
  isPressed,
}: {
  buttonHeight: string;
  size: ControlSize;
  toggleDisabled: boolean;
  status: DevicePickerStatus;
  isPressed: boolean;
}) {
  return cn(
    "flex shrink-0 items-center justify-center rounded-l-full rounded-r-none bg-transparent p-0 has-[>svg]:px-0 pointer-fine:hover:bg-white/[0.045] active:scale-100 [&_svg]:translate-x-px",
    buttonHeight,
    size === "sm" && "w-10",
    size === "md" && "w-11",
    size === "lg" && "w-12",
    false,
    false,
    toggleDisabled
      ? "text-neutral-500 pointer-fine:hover:bg-transparent!"
      : status.kind === "needs-permission"
        ? "cursor-pointer text-inherit"
        : "cursor-pointer text-neutral-100 pointer-fine:hover:text-white",
    isPressed &&
      !toggleDisabled &&
      status.kind !== "needs-permission" &&
      "text-destructive"
  );
}

function CircularDesktopMediaControl({
  toggleDisabled,
  pickerDisabled,
  status,
  size,
  pending,
  buttonHeight,
  isPressed,
  hyperElId,
  icon,
  toggleLabel,
  onToggle,
  showTooltip,
  tooltipText,
  toggleTooltipSideOffset,
  anchorRef,
  pickerControl,
  controlGap,
  className,
  ref,
  props,
  menuOpen,
  showLabel,
  labelSize,
  label,
}: {
  toggleDisabled: boolean;
  pickerDisabled: boolean;
  status: DevicePickerStatus;
  size: ControlSize;
  pending: boolean;
  buttonHeight: string;
  isPressed: boolean;
  hyperElId: string | undefined;
  icon: ReactNode;
  toggleLabel: string;
  onToggle: () => void;
  showTooltip: boolean;
  tooltipText: string;
  toggleTooltipSideOffset: number;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  pickerControl: React.JSX.Element;
  controlGap: "gap-2";
  className: string | undefined;
  ref: Ref<HTMLDivElement> | undefined;
  props: React.ComponentProps<"div">;
  menuOpen: boolean;
  showLabel: boolean;
  labelSize: "text-xs leading-none" | "text-sm" | "text-base";
  label: string;
}) {
  const circularPillState =
    toggleDisabled && pickerDisabled
      ? "disabled"
      : status.kind === "needs-permission"
        ? "permission"
        : "available";
  const circularPillClassName = desktopMediaDeviceSplitPillVariants({
    design: "segmented",
    size,
    state: circularPillState,
  });
  const circularToggleButton = (
    <MediaToggleButton
      aria-busy={pending || undefined}
      className={getCircularToggleClassName({
        buttonHeight: buttonHeight,
        size: size,
        toggleDisabled: toggleDisabled,
        status: status,
        isPressed: isPressed,
      })}
      disabled={toggleDisabled}
      hyperElId={hyperElId}
      icon={icon}
      label={toggleLabel}
      onClick={onToggle}
      pressed={isPressed}
      size={size}
      variant="default"
    />
  );
  const circularToggle = showTooltip ? (
    <ControlTooltip
      content={tooltipText}
      disabled={toggleDisabled}
      disabledWrapperClassName={cn(
        "inline-flex pointer-events-auto",
        buttonHeight
      )}
      sideOffset={toggleTooltipSideOffset}
    >
      {circularToggleButton}
    </ControlTooltip>
  ) : (
    circularToggleButton
  );
  const content = (
    <div
      className={cn(
        circularPillClassName,
        pending && "animate-field-highlight-pending"
      )}
      data-pending={pending || undefined}
      ref={anchorRef}
    >
      {circularToggle}
      {
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 z-10 h-6 w-px -translate-y-1/2 bg-border",
            size === "sm" && "left-[38.5px]",
            size === "md" && "left-[42.5px]",
            size === "lg" && "left-[46.5px]"
          )}
          data-slot="call-controls-picker-separator"
        />
      }
      {pickerControl}
    </div>
  );
  return (
    <div
      className={cn(
        "group/picker flex flex-col items-center px-2",
        controlGap,
        className
      )}
      ref={ref}
      {...props}
      data-active={menuOpen || undefined}
      data-pending={pending || undefined}
      data-slot="call-controls-picker"
    >
      {content}
      {showLabel ? (
        <span
          className={cn(
            "text-neutral-400 transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-active/picker:text-neutral-50 group-data-[active=true]/picker:text-neutral-50 pointer-fine:group-hover/picker:text-neutral-50 motion-reduce:transition-none",
            labelSize
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

function DesktopMediaPickerMenu({
  setMenuOpen,
  menuOpen,
  showTooltip,
  pickerTooltipText,
  pickerTooltipSideOffset,
  pickerTrigger,
  action,
  variant,
  anchorRef,
  menuLabel,
  handleActionSelect,
  closeMenu,
  handleSelect,
  sections,
  status,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  showTooltip: boolean;
  pickerTooltipText: string;
  pickerTooltipSideOffset: number;
  pickerTrigger: React.JSX.Element;
  action: DevicePickerActionModel | undefined;
  variant: ButtonVariant;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  menuLabel: string;
  handleActionSelect: (selectedAction: DevicePickerActionModel) => void;
  closeMenu: () => void;
  handleSelect: (section: DevicePickerSectionModel, deviceId: string) => void;
  sections: readonly DevicePickerSectionModel[];
  status: DevicePickerStatus;
}) {
  return (
    <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
      {showTooltip ? (
        <ControlTooltip
          content={pickerTooltipText}
          sideOffset={pickerTooltipSideOffset}
        >
          <DropdownMenuTrigger asChild>{pickerTrigger}</DropdownMenuTrigger>
        </ControlTooltip>
      ) : (
        <DropdownMenuTrigger asChild>{pickerTrigger}</DropdownMenuTrigger>
      )}
      <DevicePickerMenuContent
        action={action}
        anchor={variant === "circular" ? anchorRef : undefined}
        menuLabel={menuLabel}
        onActionSelect={handleActionSelect}
        onClose={closeMenu}
        onSelect={handleSelect}
        sections={sections}
        status={status}
      />
    </DropdownMenu>
  );
}

function getDesktopMediaPresentation({
  size,
  menuAvailability,
  variant,
  status,
  isPressed,
  menuLabel,
}: {
  size: ControlSize;
  menuAvailability: DevicePickerMenuAvailability;
  variant: ButtonVariant;
  status: DevicePickerStatus;
  isPressed: boolean;
  menuLabel: string;
}) {
  const buttonHeight = size === "sm" ? "h-10" : size === "md" ? "h-11" : "h-12";
  const iconPadding = size === "sm" ? "px-2" : "px-2.5";
  const pickerDisabled = menuAvailability.kind === "disabled";
  const segmented = variant === "circular";
  const toggleTone: NonNullable<
    React.ComponentProps<typeof MediaToggleButton>["tone"]
  > =
    status.kind === "needs-permission"
      ? "warning"
      : isPressed
        ? "mediaOff"
        : "default";
  const separatorClassName = "bg-border/50";
  const pickerTooltipText =
    pickerDisabled && status.kind !== "available" ? status.message : menuLabel;
  const pickerTooltipSideOffset = 8;
  const toggleTooltipSideOffset = variant === "circular" ? 9 : 8;

  return {
    pickerDisabled,
    segmented,
    pickerTooltipText,
    pickerTooltipSideOffset,
    buttonHeight,
    toggleTooltipSideOffset,
    iconPadding,
    toggleTone,
    separatorClassName,
  };
}

function DesktopMediaDeviceControl({
  action,
  className,
  hyperElId,
  icon,
  isPressed,
  label,
  menuAvailability,
  menuLabel,
  onToggle,
  pending = false,
  sections,
  showLabel,
  showTooltip,
  size,
  status,
  toggleDisabled = false,
  toggleLabel,
  tooltipText,
  variant,
  ref,
  ...props
}: DesktopMediaDeviceControlProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { controlGap, labelSize } = getControlSizeClasses(size);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const {
    pickerDisabled,
    segmented,
    pickerTooltipText,
    pickerTooltipSideOffset,
    buttonHeight,
    toggleTooltipSideOffset,
    iconPadding,
    toggleTone,
    separatorClassName,
  } = getDesktopMediaPresentation({
    size,
    menuAvailability,
    variant,
    status,
    isPressed,
    menuLabel,
  });

  const closeMenu = () => {
    setMenuOpen(false);
    queueMicrotask(() => {
      triggerRef.current?.focus();
    });
  };
  const handleSelect = (
    section: DevicePickerSectionModel,
    deviceId: string
  ) => {
    section.onDeviceChange(deviceId);
    closeMenu();
  };
  const handleActionSelect = (selectedAction: DevicePickerActionModel) => {
    selectedAction.onSelect();
    closeMenu();
  };
  const pickerTrigger = renderDevicePickerTrigger({
    disabled: pickerDisabled,
    label,
    size,
    status,
    triggerRef,
    variant,
    segmented,
  });
  const pickerControl = pickerDisabled ? (
    showTooltip ? (
      <ControlTooltip
        content={pickerTooltipText}
        disabled
        sideOffset={pickerTooltipSideOffset}
      >
        {pickerTrigger}
      </ControlTooltip>
    ) : (
      pickerTrigger
    )
  ) : (
    <DesktopMediaPickerMenu
      setMenuOpen={setMenuOpen}
      menuOpen={menuOpen}
      showTooltip={showTooltip}
      pickerTooltipText={pickerTooltipText}
      pickerTooltipSideOffset={pickerTooltipSideOffset}
      pickerTrigger={pickerTrigger}
      action={action}
      variant={variant}
      anchorRef={anchorRef}
      menuLabel={menuLabel}
      handleActionSelect={handleActionSelect}
      closeMenu={closeMenu}
      handleSelect={handleSelect}
      sections={sections}
      status={status}
    />
  );

  if (variant === "circular") {
    return (
      <CircularDesktopMediaControl
        toggleDisabled={toggleDisabled}
        pickerDisabled={pickerDisabled}
        status={status}
        size={size}
        pending={pending}
        buttonHeight={buttonHeight}
        isPressed={isPressed}
        hyperElId={hyperElId}
        icon={icon}
        toggleLabel={toggleLabel}
        onToggle={onToggle}
        showTooltip={showTooltip}
        tooltipText={tooltipText}
        toggleTooltipSideOffset={toggleTooltipSideOffset}
        anchorRef={anchorRef}
        pickerControl={pickerControl}
        controlGap={controlGap}
        className={className}
        ref={ref}
        props={props}
        menuOpen={menuOpen}
        showLabel={showLabel}
        labelSize={labelSize}
        label={label}
      />
    );
  }

  const toggleButton = (
    <MediaToggleButton
      aria-busy={pending || undefined}
      className={cn(buttonHeight, iconPadding)}
      disabled={toggleDisabled}
      hyperElId={hyperElId}
      icon={icon}
      label={toggleLabel}
      onClick={onToggle}
      pressed={isPressed}
      size={size}
      tone={toggleTone}
      variant="default"
    />
  );
  const toggleControl = showTooltip ? (
    <ControlTooltip
      content={tooltipText}
      disabled={toggleDisabled}
      sideOffset={toggleTooltipSideOffset}
    >
      {toggleButton}
    </ControlTooltip>
  ) : (
    toggleButton
  );
  const controlGroup = (
    <div
      className={cn(
        "flex items-center rounded-lg bg-white/[0.03]",
        buttonHeight,
        pending && "animate-field-highlight-pending"
      )}
      data-pending={pending || undefined}
    >
      {toggleControl}
      <div className={`${buttonHeight} flex items-center px-0.5`}>
        <div className={`h-5 w-px ${separatorClassName}`} />
      </div>
      {pickerControl}
    </div>
  );

  return (
    <div
      className={cn("flex flex-col items-center", controlGap, className)}
      ref={ref}
      {...props}
      data-pending={pending || undefined}
      data-slot="call-controls-picker"
    >
      {controlGroup}
      {showLabel ? (
        <span className={`text-neutral-400 ${labelSize}`}>{label}</span>
      ) : null}
    </div>
  );
}

export {
  DesktopMediaDeviceControl,
  desktopDevicePickerTriggerVariants,
  desktopMediaDeviceSplitPillVariants,
};
export type { DesktopMediaDeviceControlProps };
