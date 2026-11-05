export const prototypeDevices = [
  // Logical viewport pixels: iPhone 16, 11-inch iPad Air (landscape), and a desktop browser.
  { id: "mobile", label: "Mobile", width: 393, height: 852 },
  { id: "tablet", label: "Tablet", width: 1180, height: 820 },
  { id: "desktop", label: "Desktop", width: 1440, height: 800 },
] as const;

export type PrototypeDevice = (typeof prototypeDevices)[number];
export type PrototypeDeviceId = PrototypeDevice["id"];
export const prototypeGutter = 64;

export function availablePrototypeDevices(viewportWidth: number) {
  return prototypeDevices.filter(
    (device) => device.id === "mobile" || device.width + prototypeGutter <= viewportWidth,
  );
}

export function resolvePrototypeDevice(requested: PrototypeDeviceId, viewportWidth: number) {
  const available = availablePrototypeDevices(viewportWidth);
  return available.find((device) => device.id === requested) ?? available[available.length - 1];
}

export function prototypeViewport(device: PrototypeDevice, viewportWidth: number) {
  const width =
    viewportWidth > 0
      ? Math.min(device.width, Math.max(0, viewportWidth - prototypeGutter))
      : device.width;

  return {
    width,
    height: Math.round((width * device.height) / device.width),
  };
}
