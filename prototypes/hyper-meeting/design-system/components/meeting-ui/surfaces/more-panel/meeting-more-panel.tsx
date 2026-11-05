"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  HugeCalendar03Solid,
  HugeCalendarAdd02Solid,
  HugeChartBarLineSolid,
  HugeChatting01Solid,
  HugeCheckListSolid,
  HugeHierarchySolid,
  HugeInternetAntenna02Solid,
  HugeNoteEditSolid,
  HugePenTool01Solid,
  HugeSearch01Solid,
  HugeSecuritySolid,
  HugeSettings02Solid,
  HugeStickyNote01Solid,
  HugeTimer01Solid,
  HugeUserMultiple02Solid,
} from "../../../../icons/index";

import { MeetingRecordingIcon } from "../../primitives/recording-icon";
import {
  MeetingMorePanelClose,
  type MeetingMorePanelCloseProps,
  MeetingMorePanelContent,
  MeetingMorePanelHeader,
  MeetingMorePanelItem,
  MeetingMorePanelItemChevron,
  MeetingMorePanelItemContent,
  MeetingMorePanelItemDescription,
  MeetingMorePanelItemIcon,
  type MeetingMorePanelItemProps,
  MeetingMorePanelItems,
  MeetingMorePanelItemTitle,
  MeetingMorePanelItemTrailing,
  MeetingMorePanelRoot,
  MeetingMorePanelSection,
  MeetingMorePanelSectionTitle,
  MeetingMorePanelTitle,
} from "./more-panel";

export type MeetingMorePanelAction = Pick<
  MeetingMorePanelItemProps,
  "disabled" | "onClick"
>;

export type MeetingMorePanelActions = {
  readonly access?: MeetingMorePanelAction | undefined;
  readonly agenda: MeetingMorePanelAction;
  readonly allCommands: MeetingMorePanelAction;
  readonly calendar?: MeetingMorePanelAction | undefined;
  readonly chat: MeetingMorePanelAction;
  readonly network: MeetingMorePanelAction;
  readonly notes?: MeetingMorePanelAction | undefined;
  readonly participants: MeetingMorePanelAction;
  readonly performance?: MeetingMorePanelAction | undefined;
  readonly settings: MeetingMorePanelAction;
  readonly transcript: MeetingMorePanelAction;
};

export type MeetingMorePanelProps = Omit<
  ComponentPropsWithoutRef<typeof MeetingMorePanelRoot>,
  "children"
> & {
  readonly actions: MeetingMorePanelActions;
  readonly onClose: NonNullable<MeetingMorePanelCloseProps["onClick"]>;
};

type MorePanelActionItemProps = MeetingMorePanelAction & {
  readonly dataHyperElid?: string;
  readonly description: string;
  readonly descriptionClassName?: string;
  readonly icon: ReactNode;
  readonly showChevron?: boolean;
  readonly title: string;
};

function MorePanelActionItem({
  dataHyperElid,
  description,
  descriptionClassName,
  disabled,
  icon,
  onClick,
  showChevron = true,
  title,
}: MorePanelActionItemProps) {
  const resolvedDescriptionClassName =
    disabled && showChevron ? "text-muted-foreground/60" : descriptionClassName;

  return (
    <MeetingMorePanelItem
      data-hyper-elid={dataHyperElid}
      disabled={disabled}
      onClick={onClick}
    >
      <MeetingMorePanelItemIcon>{icon}</MeetingMorePanelItemIcon>
      <MeetingMorePanelItemContent>
        <MeetingMorePanelItemTitle>{title}</MeetingMorePanelItemTitle>
        <MeetingMorePanelItemDescription
          className={resolvedDescriptionClassName}
        >
          {description}
        </MeetingMorePanelItemDescription>
      </MeetingMorePanelItemContent>
      {showChevron ? (
        <MeetingMorePanelItemTrailing>
          <MeetingMorePanelItemChevron />
        </MeetingMorePanelItemTrailing>
      ) : null}
    </MeetingMorePanelItem>
  );
}

function MorePanelComingSoonItem({
  description,
  icon,
  title,
}: {
  readonly description: string;
  readonly icon: ReactNode;
  readonly title: string;
}) {
  return (
    <MorePanelActionItem
      description={description}
      descriptionClassName="text-muted-foreground/70"
      disabled
      icon={icon}
      showChevron={false}
      title={title}
    />
  );
}

export function MeetingMorePanel({
  actions,
  onClose,
  ...props
}: MeetingMorePanelProps) {
  return (
    <MeetingMorePanelRoot {...props}>
      <MeetingMorePanelHeader>
        <MeetingMorePanelTitle>More</MeetingMorePanelTitle>
        <MeetingMorePanelClose onClick={onClose} />
      </MeetingMorePanelHeader>

      <MeetingMorePanelContent>
        <MeetingMorePanelSection group="most-used">
          <MeetingMorePanelSectionTitle>Most used</MeetingMorePanelSectionTitle>
          <MeetingMorePanelItems>
            <MorePanelActionItem
              dataHyperElid="chat-panel"
              description="Message everyone in the meeting"
              icon={<HugeChatting01Solid />}
              title="Chat"
              {...actions.chat}
            />
            <MorePanelActionItem
              dataHyperElid="participants-panel"
              description="See everyone in the meeting"
              icon={<HugeUserMultiple02Solid />}
              title="Participants"
              {...actions.participants}
            />
            <MorePanelActionItem
              dataHyperElid="agenda-panel"
              description="Plan topics for this meeting"
              icon={<HugeCheckListSolid />}
              title="Agenda"
              {...actions.agenda}
            />
            {actions.notes ? (
              <MorePanelActionItem
                dataHyperElid="notes-panel"
                description="Shared notes for everyone"
                icon={<HugeStickyNote01Solid />}
                title="Notes"
                {...actions.notes}
              />
            ) : null}
            <MorePanelActionItem
              dataHyperElid="transcript"
              description="Recording of the meeting conversation"
              icon={<HugeNoteEditSolid />}
              title="Transcript"
              {...actions.transcript}
            />
          </MeetingMorePanelItems>
        </MeetingMorePanelSection>

        {actions.calendar ? (
          <MeetingMorePanelSection group="plan">
            <MeetingMorePanelSectionTitle>Plan</MeetingMorePanelSectionTitle>
            <MeetingMorePanelItems>
              <MorePanelActionItem
                dataHyperElid="calendar-panel"
                description="View your workspace calendar"
                icon={<HugeCalendar03Solid />}
                title="Calendar"
                {...actions.calendar}
              />
            </MeetingMorePanelItems>
          </MeetingMorePanelSection>
        ) : null}

        <MeetingMorePanelSection group="meeting">
          <MeetingMorePanelSectionTitle>
            Meeting &amp; tools
          </MeetingMorePanelSectionTitle>
          <MeetingMorePanelItems>
            {actions.access ? (
              <MorePanelActionItem
                description="Control who can join and share"
                icon={<HugeSecuritySolid />}
                title="Meeting access"
                {...actions.access}
              />
            ) : null}
            <MorePanelActionItem
              description="Audio, video, and meeting preferences"
              icon={<HugeSettings02Solid />}
              title="Settings"
              {...actions.settings}
            />
            <MorePanelActionItem
              dataHyperElid="network-panel"
              description="View live connection quality"
              icon={<HugeInternetAntenna02Solid />}
              title="Network"
              {...actions.network}
            />
            {actions.performance ? (
              <MorePanelActionItem
                dataHyperElid="performance"
                description="Inspect browser responsiveness"
                icon={<HugeChartBarLineSolid />}
                title="Performance"
                {...actions.performance}
              />
            ) : null}
            <MorePanelActionItem
              description="Search every available action"
              icon={<HugeSearch01Solid />}
              title="All commands"
              {...actions.allCommands}
            />
          </MeetingMorePanelItems>
        </MeetingMorePanelSection>

        <MeetingMorePanelSection group="coming-soon">
          <MeetingMorePanelSectionTitle>
            Coming soon
          </MeetingMorePanelSectionTitle>
          <MeetingMorePanelItems>
            <MorePanelComingSoonItem
              description="Ask a question, collect votes"
              icon={<HugeCheckListSolid />}
              title="Polls"
            />
            <MorePanelComingSoonItem
              description="Split attendees into groups"
              icon={<HugeHierarchySolid />}
              title="Breakout groups"
            />
            {actions.notes ? null : (
              <MorePanelComingSoonItem
                description="Shared notes for everyone"
                icon={<HugeStickyNote01Solid />}
                title="Notes"
              />
            )}
            <MorePanelComingSoonItem
              description="Sketch and collaborate live"
              icon={<HugePenTool01Solid />}
              title="Whiteboard"
            />
            <MorePanelComingSoonItem
              description="Capture the meeting's video and audio"
              icon={<MeetingRecordingIcon />}
              title="Record"
            />
            <MorePanelComingSoonItem
              description="Keep the meeting on track"
              icon={<HugeTimer01Solid />}
              title="Timer"
            />
            <MorePanelComingSoonItem
              description="Create a new meeting invite"
              icon={<HugeCalendarAdd02Solid />}
              title="Schedule"
            />
          </MeetingMorePanelItems>
        </MeetingMorePanelSection>
      </MeetingMorePanelContent>
    </MeetingMorePanelRoot>
  );
}
