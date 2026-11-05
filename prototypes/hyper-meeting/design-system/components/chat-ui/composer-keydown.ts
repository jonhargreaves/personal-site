"use client";

import { isHotkey } from "../rich-text-editor/hotkeys";
import {
  convertChatComposerBacktick,
  convertChatComposerCodeFence,
  exitChatComposerCodeBlock,
  exitChatComposerCodeBlockOnArrowDown,
  exitChatComposerCodeBlockOnArrowUp,
  type ChatComposerEditor,
  type ChatComposerFormat,
  insertChatComposerText,
  isChatComposerInsideCodeBlock,
  isChatComposerInsideList,
  toggleChatComposerFormat,
  unwrapChatComposerEmptyCodeBlock,
  unwrapChatComposerStructuredBlock,
} from "./composer-editor";

export type ChatComposerKeyDownOptions = {
  readonly disabled: boolean;
  readonly editor: ChatComposerEditor;
  readonly focusEditor: () => void;
  readonly handleSubmit: () => void;
  readonly handleSuggestionKeyDown: (event: KeyboardEvent) => boolean;
  readonly onFormatChange: () => void;
};

const HOTKEY_MAP = [
  ["mod+b", "bold"],
  ["mod+i", "italic"],
  ["mod+shift+s", "strikethrough"],
  ["mod+u", "underline"],
] as const satisfies readonly (readonly [string, ChatComposerFormat])[];

export function handleChatComposerKeyDown(
  event: KeyboardEvent,
  {
    disabled,
    editor,
    focusEditor,
    handleSubmit,
    handleSuggestionKeyDown,
    onFormatChange,
  }: ChatComposerKeyDownOptions
) {
  if (disabled) return false;
  if (handleSuggestionKeyDown(event)) return true;

  if (
    event.key === "ArrowDown" &&
    exitChatComposerCodeBlockOnArrowDown(editor)
  ) {
    setTimeout(focusEditor, 0);
    return true;
  }
  if (event.key === "ArrowUp" && exitChatComposerCodeBlockOnArrowUp(editor)) {
    setTimeout(focusEditor, 0);
    return true;
  }
  if (event.key === "Tab" && isChatComposerInsideCodeBlock(editor)) {
    insertChatComposerText(editor, "  ");
    return true;
  }
  if (event.key === "Backspace" && unwrapChatComposerEmptyCodeBlock(editor)) {
    return true;
  }
  if (event.key === "Backspace" && unwrapChatComposerStructuredBlock(editor)) {
    return true;
  }
  if (event.key === "`" && convertChatComposerBacktick(editor)) {
    return true;
  }
  if (event.key === " " && convertChatComposerCodeFence(editor)) {
    return true;
  }

  if (event.key === "Enter" && !event.shiftKey) {
    if (
      isChatComposerInsideCodeBlock(editor) ||
      isChatComposerInsideList(editor)
    ) {
      return false;
    }
    if (convertChatComposerCodeFence(editor)) return true;
    handleSubmit();
    return true;
  }

  if (event.key === "Escape" && isChatComposerInsideCodeBlock(editor)) {
    if (editor.selection[0] !== editor.selection[1]) {
      const end = Math.max(editor.selection[0], editor.selection[1]);
      editor.selection = [end, end];
    }
    exitChatComposerCodeBlock(editor);
    setTimeout(focusEditor, 0);
    return true;
  }

  for (const [hotkey, format] of HOTKEY_MAP) {
    if (isHotkey(hotkey, event)) {
      toggleChatComposerFormat(editor, format);
      onFormatChange();
      return true;
    }
  }
  return false;
}
