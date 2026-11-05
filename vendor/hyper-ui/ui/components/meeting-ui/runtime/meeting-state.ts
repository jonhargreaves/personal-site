export type MeetingPanelId =
  | "agenda"
  | "assistant"
  | "calendar"
  | "chat"
  | "more"
  | "network"
  | "notes"
  | "participants"
  | "performance"
  | "transcript";

export type MeetingDevicePanelId = "audio" | "video" | null;

export type MeetingMainView =
  | "everyone"
  | "notes"
  | "participants"
  | "screenshare";

export function getMeetingMainViewTiles<
  Tile extends { readonly source: "camera" | "screen" },
>(tiles: readonly Tile[], mainView: MeetingMainView): readonly Tile[] {
  if (mainView === "everyone") {
    return tiles;
  }

  // The shared-note view keeps camera tiles: they feed the floating mini
  // cluster rendered beside the note.
  const source = mainView === "screenshare" ? "screen" : "camera";

  return tiles.filter((tile) => tile.source === source);
}

export type MeetingPresentationMode = "default" | "full-bleed";

export type MeetingSettingsSectionId =
  | "audio"
  | "video"
  | "effects"
  | "general"
  | "appearance"
  | "notifications"
  | "captions"
  | "transcription"
  | "access"
  | "advanced"
  | "developer";

export type MeetingStage =
  | "blocked"
  | "denied"
  | "failed"
  | "in-call"
  | "joining"
  | "lobby"
  | "loading"
  | "reconnecting"
  | "waiting-room";

export type MeetingUiState = {
  readonly activeDevicePanel: MeetingDevicePanelId;
  readonly captionsOpen: boolean;
  readonly commandMenuOpen: boolean;
  readonly focusedTileId: string | null;
  readonly leaveDialogOpen: boolean;
  readonly mainView: MeetingMainView;
  readonly panel: MeetingPanelId | null;
  readonly panelReturnTarget: MeetingPanelId | null;
  readonly pinnedTileId: string | null;
  readonly presentationMode: MeetingPresentationMode;
  readonly settingsOpen: boolean;
  readonly settingsSection: MeetingSettingsSectionId;
  readonly sidebarWidth: number;
  readonly stage: MeetingStage;
};

export const defaultMeetingUiState = {
  activeDevicePanel: null,
  captionsOpen: false,
  commandMenuOpen: false,
  focusedTileId: null,
  leaveDialogOpen: false,
  mainView: "everyone",
  panel: null,
  panelReturnTarget: null,
  pinnedTileId: null,
  presentationMode: "default",
  settingsOpen: false,
  settingsSection: "audio",
  sidebarWidth: 360,
  stage: "loading",
} as const satisfies MeetingUiState;
