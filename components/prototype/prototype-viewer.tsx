"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
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

export default function PrototypeViewer({
  src,
  title,
  label = "Interactive prototype",
  logo,
}: {
  src: string;
  title: string;
  label?: string;
  logo?: ReactNode;
}) {
  const viewportWidth = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const [requestedDevice, setRequestedDevice] = useState<PrototypeDeviceId>("desktop");
  const device = resolvePrototypeDevice(requestedDevice, viewportWidth);
  const available = availablePrototypeDevices(viewportWidth);
  const preview = prototypeViewport(device, viewportWidth);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => {
      setFrameWidth(entry.contentRect.width);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      className="relative flex w-full min-w-0 flex-col gap-4 lg:left-1/2 lg:w-screen lg:-translate-x-1/2 lg:px-8"
      aria-label={title}
    >
      <div className="@container/prototype-viewer flex w-full min-w-0 flex-col items-center rounded-2xl border border-[hsl(0_0%_100%/0.15)]">
        <div className="grid w-full grid-cols-1 items-center gap-x-4 gap-y-3 border-b border-inherit p-4 md:grid-cols-[2rem_minmax(0,1fr)] @[640px]/prototype-viewer:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="col-start-1 row-start-1 hidden justify-self-start md:block">{logo}</div>
          <p className="col-start-1 row-start-1 text-center text-xs uppercase tracking-[1px] text-white/50 md:col-span-2 md:row-start-2 @[640px]/prototype-viewer:col-span-1 @[640px]/prototype-viewer:col-start-2 @[640px]/prototype-viewer:row-start-1">
            {label}
          </p>
          <div className="col-start-2 row-start-1 hidden min-w-0 max-w-full justify-self-end md:block [&_[role=combobox]]:max-w-full @[640px]/prototype-viewer:col-start-3">
            <DeviceSelector
              available={available.map((item) => item.id)}
              selected={device.id}
              onSelect={setRequestedDevice}
            />
          </div>
        </div>
        <div className="flex w-full min-w-0 justify-center p-8">
          <div
            ref={frameRef}
            className="relative w-full overflow-hidden rounded-lg"
            style={{ maxWidth: preview.width, aspectRatio: preview.width / preview.height }}
          >
            <iframe
              src={src}
              title={title}
              loading="lazy"
              // The development React Grab script annotates same-origin iframes before hydration.
              suppressHydrationWarning
              style={{
                width: preview.width,
                height: preview.height,
                // Preserve the selected device's viewport while fitting the available space.
                transform: `scale(${Math.min(1, frameWidth / preview.width)})`,
              }}
              className="absolute inset-0 block max-w-none origin-top-left rounded-lg bg-neutral-950 outline outline-white/10 -outline-offset-1"
              allow="clipboard-write"
            />
          </div>
        </div>
      </div>
    </figure>
  );
}
