"use client";

import { useCallback, useMemo, useState } from "react";

import type { ChatParticipant } from "./chat-document";
import {
  type ChatComposerEditor,
  insertChatComposerMention,
  replaceChatComposerRange,
  toggleChatComposerBlockquote,
  toggleChatComposerCodeBlock,
  toggleChatComposerList,
} from "./composer-editor";
import {
  detectChatComposerSuggestion,
  type ChatComposerSuggestionRange,
} from "./composer-suggestion-detection";
import { useChatSuggestionAnchor } from "./suggestion-anchor";
import {
  filterChatSlashCommands,
  getAvailableChatSlashCommands,
  type ChatSlashCommandId,
} from "./suggestions";

/**
 * The active suggestion is the detector's union plus a selection index, held
 * in one cell: the mention and slash popovers are mutually exclusive by
 * construction instead of by convention across parallel state triples.
 */
export type ChatComposerSuggestionState =
  | {
      readonly kind: "mention";
      readonly index: number;
      readonly search: string;
      readonly target: ChatComposerSuggestionRange;
    }
  | {
      readonly kind: "slash";
      readonly index: number;
      readonly query: string;
      readonly target: ChatComposerSuggestionRange;
    }
  | null;

export type ChatComposerSuggestionControllerOptions = {
  readonly editor: ChatComposerEditor;
  readonly focusEditor: () => void;
  readonly gifApiKey?: string;
  readonly onOpenGifBrowser?: () => void;
  readonly participants: readonly ChatParticipant[];
  /**
   * Hosts without slash commands (the notes editor) keep typing "/" inert
   * instead of gaining a command menu.
   */
  readonly slashEnabled?: boolean;
};

export function useChatComposerSuggestionController({
  editor,
  focusEditor,
  gifApiKey,
  onOpenGifBrowser,
  participants,
  slashEnabled = true,
}: ChatComposerSuggestionControllerOptions) {
  const [suggestion, setSuggestion] =
    useState<ChatComposerSuggestionState>(null);

  const filteredParticipants = useMemo(() => {
    if (suggestion?.kind !== "mention") return [];
    const query = suggestion.search.toLowerCase();
    return participants.filter((participant) =>
      participant.name.toLowerCase().includes(query)
    );
  }, [participants, suggestion]);

  const availableSlashCommands = useMemo(
    () => getAvailableChatSlashCommands({ gifEnabled: Boolean(gifApiKey) }),
    [gifApiKey]
  );
  const filteredSlashCommands = useMemo(
    () =>
      suggestion?.kind === "slash"
        ? filterChatSlashCommands(availableSlashCommands, suggestion.query)
        : [],
    [availableSlashCommands, suggestion]
  );

  const showMention =
    suggestion?.kind === "mention" && filteredParticipants.length > 0;
  const showSlash =
    suggestion?.kind === "slash" && filteredSlashCommands.length > 0;
  const anchor = useChatSuggestionAnchor(suggestion?.target ?? null);
  const mentionAnchor = suggestion?.kind === "mention" ? anchor : null;
  const slashAnchor = suggestion?.kind === "slash" ? anchor : null;

  const dismissSuggestion = useCallback(() => setSuggestion(null), []);

  const updateSuggestionsFromSelection = useCallback(() => {
    const detection = detectChatComposerSuggestion(editor);
    if (detection?.kind === "mention") {
      setSuggestion({
        index: 0,
        kind: "mention",
        search: detection.search,
        target: detection.target,
      });
      return;
    }
    if (detection?.kind === "slash" && slashEnabled) {
      setSuggestion({
        index: 0,
        kind: "slash",
        query: detection.query,
        target: detection.target,
      });
      return;
    }
    setSuggestion(null);
  }, [editor, slashEnabled]);

  const selectMention = useCallback(
    (participant: ChatParticipant) => {
      if (suggestion?.kind !== "mention") return;
      insertChatComposerMention(editor, participant, suggestion.target);
      setSuggestion(null);
      focusEditor();
    },
    [editor, focusEditor, suggestion]
  );

  const executeSlashCommand = useCallback(
    (commandId: ChatSlashCommandId) => {
      if (suggestion?.kind !== "slash") return;
      if (commandId === "gif" && !gifApiKey) {
        window.alert("GIF API key not configured.");
        return;
      }

      replaceChatComposerRange(editor, suggestion.target, "");
      setSuggestion(null);

      switch (commandId) {
        case "gif":
          onOpenGifBrowser?.();
          break;
        case "disc":
        case "decimal":
        case "todo":
          toggleChatComposerList(editor, commandId);
          break;
        case "code_block":
          toggleChatComposerCodeBlock(editor);
          break;
        case "blockquote":
          toggleChatComposerBlockquote(editor);
          break;
      }
      setTimeout(focusEditor, 0);
    },
    [editor, focusEditor, gifApiKey, onOpenGifBrowser, suggestion]
  );

  const handleSuggestionKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (suggestion === null) return false;
      const items =
        suggestion.kind === "mention"
          ? filteredParticipants
          : filteredSlashCommands;
      if (items.length === 0) return false;

      switch (event.key) {
        case "ArrowDown":
          setSuggestion({
            ...suggestion,
            index:
              suggestion.index >= items.length - 1 ? 0 : suggestion.index + 1,
          });
          return true;
        case "ArrowUp":
          setSuggestion({
            ...suggestion,
            index:
              suggestion.index <= 0 ? items.length - 1 : suggestion.index - 1,
          });
          return true;
        case "Tab":
        case "Enter":
          if (suggestion.kind === "mention") {
            const participant = filteredParticipants[suggestion.index];
            if (participant) selectMention(participant);
          } else {
            const command = filteredSlashCommands[suggestion.index];
            if (command) executeSlashCommand(command.id);
          }
          return true;
        case " ":
          if (
            suggestion.kind === "slash" &&
            suggestion.query === "gif" &&
            gifApiKey
          ) {
            executeSlashCommand("gif");
            return true;
          }
          return false;
        case "Escape":
          setSuggestion(null);
          return true;
        default:
          return false;
      }
    },
    [
      executeSlashCommand,
      filteredParticipants,
      filteredSlashCommands,
      gifApiKey,
      selectMention,
      suggestion,
    ]
  );

  const mentionIndex = suggestion?.kind === "mention" ? suggestion.index : 0;
  const slashIndex = suggestion?.kind === "slash" ? suggestion.index : 0;

  return {
    dismissMention: dismissSuggestion,
    dismissSlash: dismissSuggestion,
    executeSlashCommand,
    filteredParticipants,
    filteredSlashCommands,
    handleSuggestionKeyDown,
    mentionAnchor,
    mentionIndex,
    selectMention,
    showMention,
    showSlash,
    slashAnchor,
    slashIndex,
    suggestion,
    updateSuggestionsFromSelection,
  };
}
