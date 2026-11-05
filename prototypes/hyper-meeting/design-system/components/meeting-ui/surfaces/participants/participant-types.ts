import type * as React from "react";

export type MeetingParticipantControlVariant = "active" | "default" | "warning";

export type MeetingParticipantActionTone = "default" | "destructive";

export type MeetingParticipantActionModel = {
  readonly disabled?: boolean;
  readonly group: string;
  readonly icon: React.ReactNode;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly tone?: MeetingParticipantActionTone;
};

export type MeetingParticipantPanelMedia = {
  readonly hasAudio: boolean;
  readonly hasScreenShare: boolean;
  readonly hasVideo: boolean;
};

export type MeetingParticipantPanelStatus = {
  readonly icon: React.ReactNode;
  readonly id: string;
  readonly label: string;
  readonly variant?: MeetingParticipantControlVariant;
};

export type MeetingParticipantPanelItem = {
  readonly avatarColor?: string;
  readonly avatarFallback: string;
  readonly avatarUrl?: string | null;
  readonly id: string;
  readonly media?: MeetingParticipantPanelMedia;
  readonly name: string;
  readonly statusIcons?: readonly MeetingParticipantPanelStatus[];
  readonly subtitle?: string;
};

export type MeetingParticipantsPanelSectionModel = {
  readonly actionLabel?: string;
  readonly defaultOpen?: boolean;
  readonly emptyContent?: React.ReactNode;
  readonly hideWhenEmpty?: boolean;
  readonly id: string;
  readonly label: string;
  readonly onAction?: () => void;
  readonly participants: readonly MeetingParticipantPanelItem[];
};

export type MeetingParticipantsPanelProps = {
  readonly children?: React.ReactNode;
  readonly defaultSearchQuery?: string;
  readonly onSearchQueryChange?: (value: string) => void;
  readonly searchPlaceholder?: string;
  readonly searchQuery?: string;
  readonly sections: readonly MeetingParticipantsPanelSectionModel[];
};
