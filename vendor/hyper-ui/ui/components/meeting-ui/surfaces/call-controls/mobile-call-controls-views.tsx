import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import { LucideChevronLeft, LucideSettings } from "../../../../../icons/index";

import { Button } from "../../../button";
import { DrawerTitle } from "../../../drawer";
import { cn } from "../../../../lib/utils";

import { SheetMenuRow } from "./controls";
import type { MobileCallControlsSelectedSheetItem } from "./mobile-call-controls-controller";
import type { DeviceOption } from "./types";

export const mobileCallControlsWarningChipVariants = cva(
  "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-warning px-2 font-black text-sm leading-none text-warning-foreground",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type MobileCallControlsWarningChipProps =
  ComponentPropsWithoutRef<"span"> &
    VariantProps<typeof mobileCallControlsWarningChipVariants> & {
      ref?: Ref<HTMLSpanElement>;
    };

export function MobileCallControlsWarningChip({
  children = "!",
  className,
  ref,
  variant,
  ...props
}: MobileCallControlsWarningChipProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        mobileCallControlsWarningChipVariants({ variant }),
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
}

function AnimatedCheckmark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MobileCallControlsBackHeader({
  buttonSize,
  onBack,
  sheetIconSize,
  title,
}: {
  buttonSize: string;
  onBack: () => void;
  sheetIconSize: string;
  title: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-1 pt-2 pb-4">
      <Button
        aria-label="Back to call controls"
        className={`${buttonSize} flex cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted`}
        onClick={onBack}
        type="button"
        variant="ghost"
      >
        <LucideChevronLeft className={sheetIconSize} />
      </Button>
      <DrawerTitle className="text-foreground text-lg font-medium tracking-tight">
        {title}
      </DrawerTitle>
    </div>
  );
}

export function MobileCallControlsItemSheet({
  item,
  buttonSize,
  onBack,
  sheetIconSize,
}: {
  item: MobileCallControlsSelectedSheetItem;
  buttonSize: string;
  onBack: () => void;
  sheetIconSize: string;
}) {
  return (
    <>
      <MobileCallControlsBackHeader
        buttonSize={buttonSize}
        onBack={onBack}
        sheetIconSize={sheetIconSize}
        title={item.label}
      />

      <div className="space-y-3" data-base-ui-swipe-ignore>
        {item.content}
      </div>
    </>
  );
}

export function MobileCallControlsDeviceSheet({
  buttonSize,
  devices,
  onBack,
  onSelect,
  onToggle,
  selectedDevice,
  renderDeviceTrailing,
  sheetIconSize,
  title,
  toggleIcon,
  toggleLabel,
  unavailableMessage,
}: {
  buttonSize: string;
  devices: readonly DeviceOption[];
  onBack: () => void;
  onSelect: (deviceId: string) => void;
  onToggle: () => void;
  selectedDevice: string;
  renderDeviceTrailing?: (deviceId: string) => ReactNode;
  sheetIconSize: string;
  title: string;
  toggleIcon: ReactNode;
  toggleLabel: string;
  unavailableMessage?: string;
}) {
  return (
    <>
      <MobileCallControlsBackHeader
        buttonSize={buttonSize}
        onBack={onBack}
        sheetIconSize={sheetIconSize}
        title={title}
      />

      <div className="space-y-3" data-base-ui-swipe-ignore>
        <SheetMenuRow
          label={toggleLabel}
          onClick={onToggle}
          trailing={toggleIcon}
        />
        {unavailableMessage ? (
          <div className="rounded-[1.6rem] bg-warning/12 px-5 py-4 text-warning ring-1 ring-warning/25">
            <p className="text-base font-medium">Microphone unavailable</p>
            <p className="mt-1 text-sm text-warning/80">{unavailableMessage}</p>
          </div>
        ) : (
          <>
            {/* Reordering is temporarily deferred until we ship an accessible desktop/mobile UX. */}
            {devices.map((device) => (
              <SheetMenuRow
                key={device.deviceId}
                label={device.label}
                description={device.description}
                disabled={device.disabled}
                onClick={() => onSelect(device.deviceId)}
                trailing={
                  selectedDevice === device.deviceId ? (
                    <div className="flex items-center gap-3 text-success">
                      {renderDeviceTrailing?.(device.deviceId)}
                      <AnimatedCheckmark className={sheetIconSize} />
                    </div>
                  ) : (
                    <div className={sheetIconSize} />
                  )
                }
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export function MobileCallControlsRootSheet({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <>
      <DrawerTitle className="px-1 pt-2 pb-4 text-foreground text-lg font-medium tracking-tight">
        Call controls
      </DrawerTitle>

      <div className="space-y-3" data-base-ui-swipe-ignore>
        {children}
      </div>
    </>
  );
}

export function MobileCallControlsSettingsRow({
  label,
  onSettings,
  onClose,
  sheetIconSize,
}: {
  label: string;
  onClose: () => void;
  onSettings: () => void;
  sheetIconSize: string;
}) {
  return (
    <div data-base-ui-swipe-ignore>
      <div className="my-3 h-px bg-border/50" />
      <div className="space-y-3">
        <SheetMenuRow
          label={label}
          onClick={() => {
            onSettings();
            onClose();
          }}
          trailing={<LucideSettings className={sheetIconSize} />}
        />
      </div>
    </div>
  );
}

export function MobileCallControlsSpeakerSection({
  onSpeakerChange,
  selectedSpeaker,
  sheetIconSize,
  speakerOptions,
}: {
  onSpeakerChange: (speakerId: string) => void;
  selectedSpeaker: string;
  sheetIconSize: string;
  speakerOptions: readonly DeviceOption[];
}) {
  if (speakerOptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6" data-base-ui-swipe-ignore>
      <div className="my-3 h-px bg-border/50" />
      <div className="px-1 pb-3 text-muted-foreground text-xs font-medium uppercase tracking-wider">
        Speakers
      </div>
      <div className="space-y-3">
        {speakerOptions.map((device) => (
          <SheetMenuRow
            key={device.deviceId}
            label={device.label}
            description={device.description}
            disabled={device.disabled}
            onClick={() => onSpeakerChange(device.deviceId)}
            trailing={
              selectedSpeaker === device.deviceId ? (
                <div className="text-primary">
                  <AnimatedCheckmark className={sheetIconSize} />
                </div>
              ) : (
                <div className={sheetIconSize} />
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
