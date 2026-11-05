import type { Metadata } from "next";
import HyperMeeting from "@/components/hyper-meeting/hyper-meeting";
import { Toaster } from "@/components/ui/toast";
import "./hyper.css";

export const metadata: Metadata = {
  title: "Hyper meeting prototype",
  robots: { index: false, follow: false },
};

export default function HyperMeetingPrototypePage() {
  return <Toaster timeout={4000}><HyperMeeting /></Toaster>;
}
