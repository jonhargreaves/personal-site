import { useState } from "react";
import { HugeCallEnd04Duotone } from "@/vendor/hyper-ui/icons";
import MeetingMicrophoneMeter from "./meeting-microphone-meter";
import { DrawerTrigger } from "@/vendor/hyper-ui/ui/components/drawer";
import { useMeetingDevices } from "./meeting-devices";
import { useMeetingControlActions, type MeetingControlPanel } from "./use-meeting-control-actions";
import {
  MeetingShellBottomBar,
  MeetingShellBottomBarContent,
  MeetingShellBottomBarSlot,
} from "@/vendor/hyper-ui/ui/components/layouts/meeting-shell";
import {
  CallControls,
  MeetingMoreIcon,
  MobilePreviewButton,
  type CallControlsAudioPickerProps,
  type CallControlsVideoPickerProps,
  type MeetingReactionOption,
} from "@/vendor/hyper-ui/ui/components/meeting-ui/surfaces/call-controls";

// Two 148px side groups + 408px media group + two 32px group gaps.
const desktopControlsMinWidth = 768;

export default function MeetingControls({
  muted,
  speaking,
  videoOn,
  onMutedChange,
  onVideoChange,
  activePanel,
  onPanelChange,
  onLeave,
  onReaction,
}: {
  muted: boolean;
  speaking: boolean;
  videoOn: boolean;
  onMutedChange: (muted: boolean) => void;
  onVideoChange: (videoOn: boolean) => void;
  activePanel: MeetingControlPanel | null;
  onPanelChange: (panel: MeetingControlPanel | null) => void;
  onLeave: () => void;
  onReaction: (reaction: MeetingReactionOption) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const devices = useMeetingDevices();
  const { actions, openSettings } = useMeetingControlActions({ activePanel, onPanelChange });
  const audioPicker: CallControlsAudioPickerProps = {
    kind: "audio",
    devices: devices.microphones,
    selectedDevice: devices.microphone,
    isMuted: muted,
    onMutedChange,
    onDeviceChange: devices.setMicrophone,
    speakerOptions: devices.speakers,
    selectedSpeaker: devices.speaker,
    onSpeakerChange: devices.setSpeaker,
    onSettings: openSettings,
    renderDeviceTrailing: (id) =>
      id === devices.microphone ? (
        <MeetingMicrophoneMeter speaking={speaking} />
      ) : null,
  };
  const videoPicker: CallControlsVideoPickerProps = {
    kind: "video",
    devices: devices.cameras,
    selectedDevice: devices.camera,
    isVideoOn: videoOn,
    onVideoChange,
    onDeviceChange: devices.setCamera,
    onSettings: openSettings,
  };
  const mobileActions = [
    actions.share,
    actions.captions,
    actions.chat,
    actions.people,
    actions.settings,
    actions.access,
    actions.more,
  ];
  return (
    <MeetingShellBottomBar>
      <CallControls
        size="sm"
        showLabels
        variant="circular"
        className="@container/meeting-controls"
        mobileBreakpoint={desktopControlsMinWidth}
      >
        <CallControls.Desktop className="contents">
          <MeetingShellBottomBarContent>
            <MeetingShellBottomBarSlot placement="left">
              <CallControls.Button {...actions.settings} />
              <CallControls.Button {...actions.access} />
              <CallControls.Button
                {...actions.captions}
                className="@max-[1100px]/meeting-controls:hidden"
              />
            </MeetingShellBottomBarSlot>
            <MeetingShellBottomBarSlot placement="center">
              <CallControls.Picker {...audioPicker} />
              <CallControls.Picker {...videoPicker} />
              <CallControls.Button {...actions.share} />
              <CallControls.Reactions
                contentClassName="rounded-[16px]"
                tooltipText="Add a reaction"
                onReactionSelect={onReaction}
              />
              <CallControls.Button
                id="leave"
                label="Leave"
                tooltipText="Leave the call"
                icon={<HugeCallEnd04Duotone className="size-5" />}
                isDanger
                onClick={onLeave}
              />
            </MeetingShellBottomBarSlot>
            <MeetingShellBottomBarSlot placement="right">
              <CallControls.Button {...actions.chat} />
              <CallControls.Button
                {...actions.people}
                className="@max-[1100px]/meeting-controls:hidden"
              />
              <CallControls.Button {...actions.more} />
            </MeetingShellBottomBarSlot>
          </MeetingShellBottomBarContent>
        </CallControls.Desktop>
        <CallControls.MobileControls open={sheetOpen} onOpenChange={setSheetOpen}>
          <MeetingShellBottomBarContent layout="mobile">
            <CallControls.MobileMediaProvider audioPicker={audioPicker} videoPicker={videoPicker}>
              <CallControls.MobilePreview className="w-full flex-nowrap justify-between gap-0">
                <CallControls.Reactions
                  className="w-auto shrink-0"
                  contentClassName="rounded-[16px]"
                  tooltipText="Add a reaction"
                  onReactionSelect={onReaction}
                />
                <div
                  className="flex shrink-0 items-center gap-3"
                  role="group"
                  aria-label="Primary call controls"
                >
                  <CallControls.MobilePreviewToggle kind="audio" />
                  <CallControls.MobilePreviewToggle kind="video" />
                  <CallControls.MobilePreviewAction
                    id="leave"
                    label="Leave"
                    icon={<HugeCallEnd04Duotone className="size-5" />}
                    tone="danger"
                    onClick={onLeave}
                  />
                </div>
                <DrawerTrigger asChild>
                  <MobilePreviewButton
                    id="hyper-more-trigger"
                    hyperElId="more"
                    label="More"
                    icon={<MeetingMoreIcon />}
                    size="sm"
                    variant="circular"
                    className="group/control group/control-button"
                    data-tone="default"
                  />
                </DrawerTrigger>
              </CallControls.MobilePreview>
              <CallControls.MobileSheet>
                <CallControls.MobileDeviceSheetItem kind="video" />
                <CallControls.MobileDeviceSheetItem kind="audio" />
                {mobileActions.map((action) => (
                  <CallControls.MobileSheetItem
                    key={action.id}
                    id={action.id}
                    label={action.label}
                    icon={action.icon}
                    active={action.isActive}
                    aria-pressed={action.id === "more" ? undefined : action.isActive}
                    aria-label={action.tooltipText}
                    onSelect={() => {
                      action.onClick();
                      setSheetOpen(false);
                    }}
                  />
                ))}
              </CallControls.MobileSheet>
            </CallControls.MobileMediaProvider>
          </MeetingShellBottomBarContent>
        </CallControls.MobileControls>
      </CallControls>
    </MeetingShellBottomBar>
  );
}
