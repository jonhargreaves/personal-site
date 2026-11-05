import type {
  MeetingDevicePanelId,
  MeetingMainView,
  MeetingPanelId,
  MeetingPresentationMode,
  MeetingSettingsSectionId,
  MeetingStage,
  MeetingUiState,
} from "./meeting-state";

export type MeetingUiActions = {
  readonly closeCaptions: () => void;
  readonly closeDevicePanel: () => void;
  readonly closeCommandMenu: () => void;
  readonly closeLeaveDialog: () => void;
  readonly closePanel: () => void;
  readonly closeSettings: () => void;
  readonly focusTile: (tileId: string | null) => void;
  readonly openDevicePanel: (
    panelId: Exclude<MeetingDevicePanelId, null>
  ) => void;
  readonly openCaptions: () => void;
  readonly openCommandMenu: () => void;
  readonly openLeaveDialog: () => void;
  readonly openPanel: (panelId: MeetingPanelId) => void;
  readonly openPanelFrom: (
    panelId: MeetingPanelId,
    returnTarget: MeetingPanelId
  ) => void;
  readonly openSettings: (section?: MeetingSettingsSectionId) => void;
  readonly pinTile: (tileId: string | null) => void;
  readonly setCaptionsOpen: (open: boolean) => void;
  readonly setCommandMenuOpen: (open: boolean) => void;
  readonly setLeaveDialogOpen: (open: boolean) => void;
  readonly setMainView: (view: MeetingMainView) => void;
  readonly setPanel: (panelId: MeetingPanelId | null) => void;
  readonly setPresentationMode: (mode: MeetingPresentationMode) => void;
  readonly setSettingsOpen: (open: boolean) => void;
  readonly setSettingsSection: (section: MeetingSettingsSectionId) => void;
  readonly setSidebarWidth: (width: number) => void;
  readonly setStage: (stage: MeetingStage) => void;
  readonly toggleCaptions: () => void;
  readonly toggleCommandMenu: () => void;
  readonly toggleDevicePanel: (
    panelId: Exclude<MeetingDevicePanelId, null>
  ) => void;
  readonly togglePanel: (panelId: MeetingPanelId) => void;
};

export type MeetingRuntime = {
  readonly actions: MeetingUiActions;
  readonly state: MeetingUiState;
};
