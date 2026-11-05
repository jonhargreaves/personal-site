import { useState } from "react";
import type { DeviceOption } from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/call-controls/index";

// Sample devices, following Hyper's call-control fixtures. No hardware is accessed.
const microphones = [
  { deviceId: "airpods", label: "Jon's AirPods Pro 2", description: "System default" },
  { deviceId: "macbook", label: "MacBook Pro Microphone (Built-in)" },
] as const satisfies readonly DeviceOption[];

const cameras = [
  { deviceId: "facetime", label: "FaceTime HD Camera" },
  { deviceId: "logitech", label: "Logitech C920" },
  { deviceId: "obs", label: "OBS Virtual Camera" },
] as const satisfies readonly DeviceOption[];

const speakers = [
  { deviceId: "default-speaker", label: "Jon's AirPods Pro 2", description: "System default" },
  { deviceId: "macbook-speaker", label: "MacBook Pro Speakers" },
  { deviceId: "external", label: "External Monitor Speakers" },
] as const satisfies readonly DeviceOption[];

export function useMeetingDevices() {
  const [microphone, setMicrophone] = useState<string>(microphones[0].deviceId);
  const [camera, setCamera] = useState<string>(cameras[0].deviceId);
  const [speaker, setSpeaker] = useState<string>(speakers[0].deviceId);
  return {
    microphones,
    microphone,
    setMicrophone,
    cameras,
    camera,
    setCamera,
    speakers,
    speaker,
    setSpeaker,
  };
}
