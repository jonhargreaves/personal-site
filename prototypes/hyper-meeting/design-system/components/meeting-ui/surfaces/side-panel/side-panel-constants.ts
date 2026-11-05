export const MEETING_CALENDAR_SIDE_PANEL_MAX_WIDTH = 960;
export const MEETING_MAIN_MIN_WIDTH = 420;
export const MEETING_SIDE_PANEL_DESKTOP_EDGE_INSET = 16;
export const MEETING_SIDE_PANEL_INLINE_GAP = 16;
export const MEETING_SIDE_PANEL_MAX_WIDTH = 520;
export const MEETING_SIDE_PANEL_MIN_WIDTH = 320;
export const MEETING_SIDE_PANEL_INLINE_MIN_CONTAINER_WIDTH =
  MEETING_MAIN_MIN_WIDTH +
  MEETING_SIDE_PANEL_MIN_WIDTH +
  MEETING_SIDE_PANEL_DESKTOP_EDGE_INSET * 2;
export const MEETING_SIDE_PANEL_TRANSITION_EASING =
  "cubic-bezier(0.16, 1, 0.3, 1)";
export const MEETING_SIDE_PANEL_TRANSITION_MS = 260;

export type MeetingSidePanelLayoutMode = "inline" | "overlay";
export type MeetingSidePanelTabId = "chat" | "participants";

export function getMeetingSidePanelLayoutMode(
  containerWidth: number
): MeetingSidePanelLayoutMode {
  return containerWidth >= MEETING_SIDE_PANEL_INLINE_MIN_CONTAINER_WIDTH
    ? "inline"
    : "overlay";
}
