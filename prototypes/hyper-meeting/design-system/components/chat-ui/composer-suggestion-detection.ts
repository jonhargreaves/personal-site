"use client";

import { getLeafBlockAt, getNodeOffset, getNodeSize, sliceText } from "editate";

import type { ChatComposerEditor } from "./composer-editor";

export type ChatComposerSuggestionRange = readonly [number, number];

export type ChatComposerSuggestionDetection =
  | {
      readonly kind: "mention";
      readonly search: string;
      readonly target: ChatComposerSuggestionRange;
    }
  | {
      readonly kind: "slash";
      readonly query: string;
      readonly target: ChatComposerSuggestionRange;
    };

const SLASH_COMMAND_PATTERN = /(?:^|\s)\/([a-z]*)$/i;

export function detectChatComposerSuggestion(
  editor: ChatComposerEditor
): ChatComposerSuggestionDetection | null {
  const [anchor, focus] = editor.selection;
  if (anchor !== focus) return null;

  const [block] = getLeafBlockAt(editor.doc, anchor);
  const blockStart = getNodeOffset(editor.doc, block);
  if (blockStart === null) return null;
  const before = sliceText(editor.doc, blockStart, anchor);
  if (block.type === "code_line") return null;
  const mentionMatch = before.match(/@([\p{L}\p{N}_-]*)$/u);

  if (mentionMatch) {
    return {
      kind: "mention",
      search: mentionMatch[1] ?? "",
      target: [anchor - mentionMatch[0].length, anchor],
    };
  }

  const slashMatch = before.match(SLASH_COMMAND_PATTERN);
  if (!slashMatch) return null;

  const after = sliceText(editor.doc, anchor, blockStart + getNodeSize(block));
  if (/^[a-z]/i.test(after)) return null;

  const query = (slashMatch[1] ?? "").toLowerCase();
  return {
    kind: "slash",
    query,
    target: [anchor - query.length - 1, anchor],
  };
}
