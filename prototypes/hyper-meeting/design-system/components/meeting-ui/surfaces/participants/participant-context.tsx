"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type * as React from "react";

import type {
  MeetingParticipantPanelItem,
  MeetingParticipantsPanelProps,
  MeetingParticipantsPanelSectionModel,
} from "./participant-types";

type MeetingParticipantsPanelContextValue = {
  readonly onSearchQueryChange: (value: string) => void;
  readonly searchPlaceholder: string;
  readonly searchQuery: string;
  readonly sections: readonly MeetingParticipantsPanelSectionModel[];
};

type MeetingParticipantItemContextValue = {
  readonly item: MeetingParticipantPanelItem;
  readonly section: MeetingParticipantsPanelSectionModel;
};

const MeetingParticipantsPanelContext =
  createContext<MeetingParticipantsPanelContextValue | null>(null);
const MeetingParticipantItemContext =
  createContext<MeetingParticipantItemContextValue | null>(null);

export function useMeetingParticipantsPanel(
  componentName = "MeetingParticipantsPanel component"
) {
  const context = useContext(MeetingParticipantsPanelContext);

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside MeetingParticipantsProvider.`
    );
  }

  return context;
}

export function useMeetingParticipantItem(
  componentName = "MeetingParticipant item component"
) {
  const context = useContext(MeetingParticipantItemContext);

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside MeetingParticipantItemProvider.`
    );
  }

  return context;
}

export function useOptionalMeetingParticipantItem() {
  return useContext(MeetingParticipantItemContext);
}

export type MeetingParticipantsProviderProps = MeetingParticipantsPanelProps & {
  readonly children: React.ReactNode;
};

export function MeetingParticipantsProvider({
  children,
  defaultSearchQuery = "",
  onSearchQueryChange,
  searchPlaceholder = "Search for participants",
  searchQuery,
  sections,
}: MeetingParticipantsProviderProps) {
  const [uncontrolledSearchQuery, setUncontrolledSearchQuery] =
    useState(defaultSearchQuery);
  const currentSearchQuery = searchQuery ?? uncontrolledSearchQuery;
  const handleSearchQueryChange = useCallback(
    (value: string) => {
      if (searchQuery === undefined) {
        setUncontrolledSearchQuery(value);
      }
      onSearchQueryChange?.(value);
    },
    [onSearchQueryChange, searchQuery]
  );
  const value = useMemo(
    () => ({
      onSearchQueryChange: handleSearchQueryChange,
      searchPlaceholder,
      searchQuery: currentSearchQuery,
      sections,
    }),
    [currentSearchQuery, handleSearchQueryChange, searchPlaceholder, sections]
  );

  return (
    <MeetingParticipantsPanelContext.Provider value={value}>
      {children}
    </MeetingParticipantsPanelContext.Provider>
  );
}

export type MeetingParticipantItemProviderProps = {
  readonly children: React.ReactNode;
  readonly item: MeetingParticipantPanelItem;
  readonly section: MeetingParticipantsPanelSectionModel;
};

export function MeetingParticipantItemProvider({
  children,
  item,
  section,
}: MeetingParticipantItemProviderProps) {
  const value = useMemo(() => ({ item, section }), [item, section]);

  return (
    <MeetingParticipantItemContext.Provider value={value}>
      {children}
    </MeetingParticipantItemContext.Provider>
  );
}
