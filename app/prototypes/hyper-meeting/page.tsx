import type { Metadata } from "next";
import HyperMeeting from "@/prototypes/hyper-meeting/hyper-meeting";
import { Toaster } from "@/components/ui/toast";
import "../../../prototypes/hyper-meeting/styles/prototype.css";

export const metadata: Metadata = {
  title: "Hyper meeting prototype",
  robots: { index: false, follow: false },
};

export default function HyperMeetingPrototypePage() {
  return <Toaster timeout={4000}><HyperMeeting /></Toaster>;
}
