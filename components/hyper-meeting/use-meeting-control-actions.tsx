import { useState } from "react";
import {
  HugeAirplayLineDuotone,
  HugeChatting01Duotone,
  HugeClosedCaptionDuotone,
  HugeSecurityDuotone,
  HugeSettings02Duotone,
  HugeUserMultiple02Duotone,
} from "@/vendor/hyper-ui/icons";
import {
  MeetingMoreIcon,
  type CallControlsButtonProps,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/call-controls";

export type MeetingControlPanel = "settings" | "access" | "chat" | "people" | "more";
type ControlActionId = MeetingControlPanel | "share" | "captions";
type ControlAction = Omit<CallControlsButtonProps, "onClick"> & { onClick: () => void };

export function useMeetingControlActions({
  activePanel,
  onPanelChange,
}: {
  activePanel: MeetingControlPanel | null;
  onPanelChange: (panel: MeetingControlPanel | null) => void;
}) {
  const [captionsOn, setCaptionsOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const moreOpen = activePanel === "more";
  function togglePanel(panel: MeetingControlPanel) {
    onPanelChange(activePanel === panel ? null : panel);
  }

  // Follow Hyper's call-controls interactive example. Unbuilt panel destinations
  // expose pressed state rather than claiming to expand a missing surface.
  const actions: Record<ControlActionId, ControlAction> = {
    settings: {
      id: "settings",
      label: "Settings",
      icon: <HugeSettings02Duotone className="size-5" />,
      isActive: activePanel === "settings",
      buttonProps: { "aria-pressed": activePanel === "settings" },
      onClick: () => togglePanel("settings"),
      tooltipText: "Meeting settings",
    },
    access: {
      id: "access",
      label: "Access",
      icon: <HugeSecurityDuotone className="size-5" secondaryOpacity={0.1} />,
      isActive: activePanel === "access",
      buttonProps: { "aria-pressed": activePanel === "access" },
      onClick: () => togglePanel("access"),
      tooltipText: "Participant access",
    },
    captions: {
      id: "captions",
      label: "Captions",
      icon: <HugeClosedCaptionDuotone className="size-5" secondaryOpacity={0.1} />,
      isActive: captionsOn,
      tone: captionsOn ? "accent" : undefined,
      buttonProps: { "aria-pressed": captionsOn },
      onClick: () => setCaptionsOn((current) => !current),
      tooltipText: captionsOn ? "Turn off closed captions" : "Turn on closed captions",
    },
    share: {
      id: "share",
      label: "Share",
      icon: <HugeAirplayLineDuotone className="size-5" />,
      isActive: sharing,
      tone: sharing ? "accent" : undefined,
      buttonProps: { "aria-pressed": sharing },
      onClick: () => setSharing((current) => !current),
      tooltipText: sharing ? "Stop sharing your screen" : "Share your screen",
    },
    chat: {
      id: "chat",
      label: "Chat",
      icon: <HugeChatting01Duotone className="size-5" />,
      isActive: activePanel === "chat",
      tone: activePanel === "chat" ? "panelActive" : undefined,
      buttonProps: { "aria-expanded": activePanel === "chat", "aria-controls": "hyper-more-panel" },
      onClick: () => togglePanel("chat"),
      tooltipText: activePanel === "chat" ? "Close chat" : "Open chat",
    },
    people: {
      id: "people",
      label: "People",
      icon: <HugeUserMultiple02Duotone className="size-5" />,
      isActive: activePanel === "people",
      tone: activePanel === "people" ? "panelActive" : undefined,
      buttonProps: { "aria-expanded": activePanel === "people", "aria-controls": "hyper-more-panel" },
      onClick: () => togglePanel("people"),
      tooltipText: activePanel === "people" ? "Close participants" : "View participants",
    },
    more: {
      id: "more",
      label: "More",
      icon: <MeetingMoreIcon />,
      buttonClassName: "group/control-button",
      isActive: moreOpen,
      tone: moreOpen ? "panelActive" : undefined,
      onClick: () => onPanelChange(moreOpen ? null : "more"),
      tooltipText: moreOpen ? "Close more options" : "More options",
      buttonProps: {
        id: "hyper-more-trigger",
        "aria-expanded": moreOpen,
        "aria-controls": "hyper-more-panel",
      },
    },
  };
  return { actions, openSettings: () => onPanelChange("settings") };
}
