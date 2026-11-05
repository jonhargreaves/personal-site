import type { ReactNode } from "react";

export type MeetingTileSource = "camera" | "screen";

export type MeetingTileMenuActionTone = "default" | "destructive";

export type MeetingTileMenuActionModel = {
  readonly disabled?: boolean;
  readonly group: string;
  readonly icon: ReactNode;
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
  readonly tone?: MeetingTileMenuActionTone;
};
