"use client";

import { useState, useSyncExternalStore } from "react";
import DeviceSelector from "./device-selector";
import {
  availablePrototypeDevices,
  resolvePrototypeDevice,
  prototypeViewport,
  type PrototypeDeviceId,
} from "./devices";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
const getWidth = () => window.innerWidth;
const getServerWidth = () => 0;

export default function PrototypeViewer({ src, title }: { src: string; title: string }) {
  const viewportWidth = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const [requestedDevice, setRequestedDevice] = useState<PrototypeDeviceId>("desktop");
  const device = resolvePrototypeDevice(requestedDevice, viewportWidth);
  const available = availablePrototypeDevices(viewportWidth);
  const preview = prototypeViewport(device, viewportWidth);

  return (
    <figure
      className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-4"
      aria-label={title}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 px-8">
        <p className="text-xs uppercase tracking-[1px] text-white/50">Interactive prototype</p>
        <DeviceSelector
          available={available.map((item) => item.id)}
          selected={device.id}
          onSelect={setRequestedDevice}
        />
      </div>
      <div className="flex w-full min-w-0 justify-center bg-white/[0.025] p-8">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          // The development React Grab script annotates same-origin iframes before hydration.
          suppressHydrationWarning
          style={{ width: preview.width, height: preview.height }}
          className="block max-w-full rounded-lg bg-neutral-950 outline outline-white/10 -outline-offset-1"
          allow="clipboard-write"
        />
      </div>
      <figcaption className="flex flex-wrap justify-between gap-x-6 gap-y-2 px-8 text-xs text-white/50">
        <span>Explore the controls, participant tiles, and More panel.</span>
        <span aria-live="polite" className="tabular-nums">
          {device.label}
          {viewportWidth > 0 ? ` · ${preview.width} × ${preview.height}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}
