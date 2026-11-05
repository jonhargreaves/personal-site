"use client";

import { useEffect, useState } from "react";

import type { MeetingPanelId } from "../../runtime/index";
import {
  MEETING_SIDE_PANEL_TRANSITION_MS,
  type MeetingSidePanelTabId,
} from "./side-panel-constants";

export function isMeetingSidePanelTab(
  panel: MeetingPanelId | null
): panel is MeetingSidePanelTabId {
  return panel === "chat" || panel === "participants";
}

export function getMeetingSidePanelTitle(panel: MeetingPanelId | null) {
  switch (panel) {
    case "agenda":
      return "Agenda";
    case "assistant":
      return "AI Assistant";
    case "calendar":
      return "Calendar";
    case "chat":
      return "Chat";
    case "more":
      return "More";
    case "network":
      return "Network";
    case "notes":
      return "Notes";
    case "participants":
      return "Participants";
    case "performance":
      return "Performance";
    case "transcript":
      return "Transcript";
    default:
      return "";
  }
}

export function useMeetingSidePanelPresence(
  activePanel: MeetingPanelId | null,
  exitDurationMs = MEETING_SIDE_PANEL_TRANSITION_MS
) {
  const [renderedPanel, setRenderedPanel] = useState<MeetingPanelId | null>(
    activePanel
  );

  useEffect(() => {
    if (activePanel !== null) {
      // Retain the departing panel during its exit animation after close.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderedPanel(activePanel);
      return;
    }

    const timeout = window.setTimeout(() => {
      setRenderedPanel(null);
    }, exitDurationMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activePanel, exitDurationMs]);

  return activePanel ?? renderedPanel;
}
