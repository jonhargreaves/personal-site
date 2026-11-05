"use client";

import type { ComponentProps, ReactNode, RefObject } from "react";

import { LucideCheck } from "../icons/index";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "./dropdown-menu-primitives";
import { cn } from "../lib/utils";

import { useSurfaceTheme } from "./layouts/surface-theme";

export interface DeviceOption {
  description?: string;
  deviceId: string;
  label: string;
  disabled?: boolean;
}

export type DevicePickerStatus =
  | { kind: "available" }
  | { kind: "needs-permission"; message: string }
  | { kind: "unavailable"; message: string };

export type DevicePickerMenuAvailability =
  | { kind: "enabled" }
  | { kind: "disabled" };

export interface DevicePickerSectionModel {
  devices: readonly DeviceOption[];
  enableSorting?: boolean;
  id: string;
  label: string;
  onDeviceChange: (id: string) => void;
  onDevicesSort?: (devices: DeviceOption[]) => void;
  renderTrailing?: (deviceId: string) => ReactNode;
  selectedDevice: string;
  status?: DevicePickerStatus;
}

export interface DevicePickerActionModel {
  icon?: ReactNode;
  id: string;
  label: string;
  onSelect: () => void;
}

function getSelectedDeviceId(
  devices: readonly DeviceOption[],
  selectedDevice: string
) {
  return devices.some((device) => device.deviceId === selectedDevice)
    ? selectedDevice
    : "";
}

function DevicePickerItemLabel({ device }: { device: DeviceOption }) {
  const description =
    device.description && device.description !== device.label
      ? device.description
      : undefined;

  if (!description) {
    return <span className="flex-1 truncate">{device.label}</span>;
  }

  return (
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-current">{device.label}</span>
      <span className="truncate text-muted-foreground text-xs leading-4 tracking-[0.01em]">
        {description}
      </span>
    </span>
  );
}

function DevicePickerTrailingSlot({
  deviceId,
  renderTrailing,
}: {
  deviceId: string;
  renderTrailing?: (deviceId: string) => ReactNode;
}) {
  const trailing = renderTrailing?.(deviceId);

  if (!trailing) {
    return null;
  }

  return (
    <span className="ml-1 flex shrink-0 items-center py-1">{trailing}</span>
  );
}

function DevicePickerNotice({ status }: { status: DevicePickerStatus }) {
  if (status.kind === "available") {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-2 mb-1 rounded-md px-3 py-2 text-sm",
        status.kind === "needs-permission"
          ? "bg-warning/12 text-warning"
          : "bg-muted/50 text-muted-foreground"
      )}
    >
      {status.message}
    </div>
  );
}

function DevicePickerSection({
  onSelect,
  section,
}: {
  onSelect: (section: DevicePickerSectionModel, deviceId: string) => void;
  section: DevicePickerSectionModel;
}) {
  const selectedDevice = getSelectedDeviceId(
    section.devices,
    section.selectedDevice
  );

  if (section.enableSorting && section.onDevicesSort) {
    return (
      <DropdownMenuGroup>
        {section.devices.map((device) => (
          <DropdownMenuItem
            className="cursor-pointer items-start rounded-[8px] px-2 py-1.5 text-sm"
            disabled={device.disabled}
            key={device.deviceId}
            onClick={() => onSelect(section, device.deviceId)}
            selected={selectedDevice === device.deviceId}
          >
            {selectedDevice === device.deviceId ? (
              <LucideCheck className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <span aria-hidden="true" className="size-4 shrink-0" />
            )}
            <DevicePickerItemLabel device={device} />
            <DevicePickerTrailingSlot
              deviceId={device.deviceId}
              renderTrailing={section.renderTrailing}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    );
  }

  return (
    <DropdownMenuRadioGroup
      className="p-1"
      onValueChange={(deviceId) => onSelect(section, deviceId)}
      value={selectedDevice}
    >
      {section.devices.map((device) => (
        <DropdownMenuRadioItem
          className="items-start rounded-[8px] py-1.5 pr-2 [&>span:first-child]:top-2 [&>span:first-child_svg]:text-success"
          disabled={device.disabled}
          indicator="check"
          key={device.deviceId}
          value={device.deviceId}
        >
          <DevicePickerItemLabel device={device} />
          <DevicePickerTrailingSlot
            deviceId={device.deviceId}
            renderTrailing={section.renderTrailing}
          />
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}

function DevicePickerMenuContent({
  action,
  align = "center",
  side = "top",
  anchor,
  menuLabel,
  onActionSelect,
  onClose,
  onSelect,
  sections,
  status,
}: {
  action?: DevicePickerActionModel;
  align?: ComponentProps<typeof DropdownMenuContent>["align"];
  side?: ComponentProps<typeof DropdownMenuContent>["side"];
  anchor?: RefObject<HTMLElement | null>;
  menuLabel: string;
  onActionSelect: (action: DevicePickerActionModel) => void;
  onClose?: () => void;
  onSelect: (section: DevicePickerSectionModel, deviceId: string) => void;
  sections: readonly DevicePickerSectionModel[];
  status: DevicePickerStatus;
}) {
  const theme = useSurfaceTheme();
  return (
    <DropdownMenuContent
      align={align}
      data-slot="device-picker-menu"
      anchor={anchor}
      className={cn(
        "w-[min(20rem,calc(100vw-2rem))] rounded-[12px] p-0 shadow-lg",
        theme
      )}
      onCloseAutoFocus={(event) => {
        if (onClose) {
          event.preventDefault();
          onClose();
        }
      }}
      side={side}
      sideOffset={12}
    >
      <DropdownMenuLabel className="px-3 py-2 font-normal text-muted-foreground text-xs tracking-[0.01em]">
        {menuLabel}
      </DropdownMenuLabel>

      {sections.map((section, index) => (
        <div key={section.id}>
          {index > 0 ? <DropdownMenuSeparator className="my-0" /> : null}
          {index > 0 ? (
            <DropdownMenuLabel className="px-3 py-2 font-normal text-muted-foreground text-xs tracking-[0.01em]">
              {section.label}
            </DropdownMenuLabel>
          ) : null}
          {(
            section.status ??
            (index === 0 ? status : { kind: "available" as const })
          ).kind !== "available" ? (
            <DevicePickerNotice status={section.status ?? status} />
          ) : (
            <DevicePickerSection onSelect={onSelect} section={section} />
          )}
        </div>
      ))}

      {action ? (
        <>
          <DropdownMenuSeparator className="my-0" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="m-1 rounded-[8px] py-1.5 pr-2"
              onClick={() => onActionSelect(action)}
            >
              {action.icon ? (
                <span className="mr-2 inline-flex w-4 justify-center">
                  {action.icon}
                </span>
              ) : null}
              <span className="flex-1">{action.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      ) : null}
    </DropdownMenuContent>
  );
}

export { DevicePickerMenuContent };
