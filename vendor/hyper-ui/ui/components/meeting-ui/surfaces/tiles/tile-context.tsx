"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { MeetingTileSource } from "./tile-types";

export type MeetingTileContextValue = {
  readonly avatarColor: string | undefined;
  readonly avatarImage: string | null | undefined;
  readonly displayName: string;
  readonly fallbackInitials: string;
  readonly hasAudio: boolean;
  readonly hasFloatingBorder: boolean | undefined;
  readonly hasVideo: boolean;
  readonly isFloatingLayoutTile: boolean;
  readonly isFocused: boolean;
  readonly isHost: boolean;
  readonly isPinned: boolean;
  readonly isScreenSharing: boolean;
  readonly isSelf: boolean;
  readonly isSpeaking: boolean;
  readonly media: ReactNode | undefined;
  readonly onToggleFocus: () => void;
  readonly onTogglePin: () => void;
  readonly signalStrength: number | undefined;
  readonly source: MeetingTileSource;
};

export type MeetingTileProviderProps = {
  readonly children: ReactNode;
  readonly value: MeetingTileContextValue;
};

const MeetingTileContext = createContext<MeetingTileContextValue | null>(null);

export function MeetingTileProvider({
  children,
  value,
}: MeetingTileProviderProps) {
  return (
    <MeetingTileContext.Provider value={value}>
      {children}
    </MeetingTileContext.Provider>
  );
}

export function useMeetingTile(componentName = "MeetingTile component") {
  const context = useContext(MeetingTileContext);

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside MeetingTileProvider.`
    );
  }

  return context;
}

export function useOptionalMeetingTile() {
  return useContext(MeetingTileContext);
}
