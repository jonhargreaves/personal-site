"use client";

import { useMemo } from "react";

import * as Predicate from "../../lib/predicate";

import type { ChatComposerSuggestionRange } from "./composer-suggestion-detection";

export type ChatSuggestionAnchor = {
  readonly getBoundingClientRect: () => DOMRect;
};

function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return new DOMRect();
  const range = selection.getRangeAt(0);
  return Predicate.isFunction(range.getBoundingClientRect)
    ? range.getBoundingClientRect()
    : new DOMRect();
}

export function useChatSuggestionAnchor(
  target: ChatComposerSuggestionRange | null
) {
  return useMemo<ChatSuggestionAnchor | null>(
    () => (target ? { getBoundingClientRect: getSelectionRect } : null),
    [target]
  );
}

export function useChatMentionAnchor({
  target,
}: {
  readonly target: ChatComposerSuggestionRange | null;
}) {
  return useChatSuggestionAnchor(target);
}

export function useChatSlashAnchor({
  target,
}: {
  readonly target: ChatComposerSuggestionRange | null;
}) {
  return useChatSuggestionAnchor(target);
}
