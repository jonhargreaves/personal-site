"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import PrototypeFrame from "./prototype-frame";
import MeetingSkeleton from "@/components/hyper-meeting/meeting-skeleton";
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
const DeviceSelector = dynamic(() => import("./device-selector"), {
  ssr: false,
  loading: () => <MeetingSkeleton className="h-9 w-[180px] rounded-lg" />,
});

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
            {viewportWidth >= 768 && <DeviceSelector
              available={available.map((item) => item.id)}
              selected={device.id}
              onSelect={setRequestedDevice}
            />}
          </div>
        </div>
        <div className="flex w-full min-w-0 justify-center p-8">
          <PrototypeFrame key={src} src={src} title={title} width={preview.width} height={preview.height} viewportReady={viewportWidth > 0} />
        </div>
      </div>
    </figure>
  );
}
