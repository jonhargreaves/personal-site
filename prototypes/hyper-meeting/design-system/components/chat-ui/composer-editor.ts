"use client";

import {
  ClearHistory,
  createEditor,
  Delete,
  Format,
  getLeafAt,
  getLeafBlockAt,
  getNodeOffset,
  getNodeSize,
  InsertNode,
  InsertText,
  LeavesInRange,
  plainTransferPlugin,
  ReplaceDoc,
  ReplaceText,
  sliceText,
  type Editor,
} from "editate";

import { isValidGifUrl } from "../../lib/gif-url";
import { normalizeCodeLanguage } from "../rich-text-editor/code-languages";
import {
  chatComposerDocumentSchema,
  type ChatComposerBlock,
  type ChatComposerDocument,
  type ChatComposerImage,
  type ChatComposerInline,
  type ChatComposerMention,
  type ChatComposerText,
  type ChatParticipant,
  createEmptyChatComposerDocument,
} from "./chat-document";

export type ChatComposerEditor = Editor<ChatComposerDocument>;
export type ChatComposerFormat =
  | "bold"
  | "code"
  | "italic"
  | "strikethrough"
  | "underline";

const FORMAT_KEYS = [
  "bold",
  "code",
  "italic",
  "strikethrough",
  "underline",
] as const satisfies readonly ChatComposerFormat[];
const CODE_FENCE_RE = /^```([a-zA-Z0-9_+-]+)?$/;
const HTTP_URL_RE = /^https?:\/\/[^\s<>[\]{}|\\^`"]+$/i;
const URL_PROTOCOL_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const formatContext = {};
let nextCodeBlockId = 0;

type FormatState = Record<ChatComposerFormat, boolean>;

function emptyFormatState() {
  return {
    bold: false,
    code: false,
    italic: false,
    strikethrough: false,
    underline: false,
  };
}

function isComposerText(
  inline: ChatComposerInline | undefined
): inline is ChatComposerText {
  return Boolean(inline && "text" in inline);
}

function nextCodeId() {
  nextCodeBlockId += 1;
  return `composer-code-${nextCodeBlockId}`;
}

export function sanitizeChatComposerHttpUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const candidate = URL_PROTOCOL_RE.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  if (!HTTP_URL_RE.test(candidate)) return null;

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function composerVoidToString(
  inline: Exclude<ChatComposerInline, ChatComposerText>
) {
  if (inline.type === "mention") return `@${inline.value}`;
  if (inline.type === "date") return inline.date ?? "";
  return "";
}

function linkPastePlugin(editor: ChatComposerEditor) {
  editor.hook("paste", (dataTransfer) => {
    const text = dataTransfer.getData("text/plain");
    const url = sanitizeChatComposerHttpUrl(text);
    return url ? [{ children: [{ link: url, text: url }], type: "p" }] : null;
  });
}

function activeFormatPlugin(editor: ChatComposerEditor) {
  editor.set(formatContext, emptyFormatState());
  editor.hook("apply", (operation, next) => {
    if (operation.type !== "insert_text") return;

    const state = editor.get<FormatState>(formatContext);
    const text = {
      ...Object.fromEntries(
        FORMAT_KEYS.flatMap((key) => (state[key] ? [[key, true]] : []))
      ),
      text: operation.text,
    } satisfies ChatComposerText;

    if (!operation.text.includes("\n")) {
      next({
        at: operation.at,
        fragment: [text],
        type: "insert_node",
      });
      return;
    }

    const block = getLeafBlockAt(editor.doc, operation.at)[0];
    next({
      at: operation.at,
      fragment: operation.text.split("\n").map((line) => ({
        ...block,
        children: [{ ...text, text: line }],
      })),
      type: "insert_node",
    });
  });
}

export function createChatComposerEditor(
  document: ChatComposerDocument = createEmptyChatComposerDocument()
): ChatComposerEditor {
  return createEditor({
    doc: document,
    schema: chatComposerDocumentSchema,
  })
    .exec(activeFormatPlugin)
    .exec(linkPastePlugin)
    .exec(plainTransferPlugin, { voidToString: composerVoidToString });
}

export function resetChatComposerEditor(editor: ChatComposerEditor) {
  editor.exec(ReplaceDoc, createEmptyChatComposerDocument().children);
  editor.selection = [0, 0];
  editor.set(formatContext, emptyFormatState());
  editor.exec(ClearHistory);
}

export function getChatComposerBlock(editor: ChatComposerEditor) {
  return getLeafBlockAt(editor.doc, editor.selection[0])[0];
}

export function isChatComposerInsideCodeBlock(editor: ChatComposerEditor) {
  return getChatComposerBlock(editor).type === "code_line";
}

export function isChatComposerInsideList(editor: ChatComposerEditor) {
  return Boolean(getChatComposerBlock(editor).listStyleType);
}

function formatStateFromSelection(editor: ChatComposerEditor): FormatState {
  const state = emptyFormatState();
  const leaves = editor.selection[0] === editor.selection[1]
    ? [getLeafAt(editor.doc, editor.selection[0], true)?.[0]].filter((leaf) => leaf !== undefined)
    : [...editor.exec(LeavesInRange)];
  const textLeaves = leaves.filter(
    (leaf): leaf is ChatComposerText => "text" in leaf
  );

  for (const key of FORMAT_KEYS) {
    state[key] =
      textLeaves.length > 0 && textLeaves.every((leaf) => leaf[key] === true);
  }
  return state;
}

export function syncChatComposerFormatsFromSelection(
  editor: ChatComposerEditor
) {
  const state = formatStateFromSelection(editor);
  editor.set(formatContext, state);
  return state;
}

export function getChatComposerFormatState(editor: ChatComposerEditor) {
  return editor.get<FormatState>(formatContext);
}

export function toggleChatComposerFormat(
  editor: ChatComposerEditor,
  format: ChatComposerFormat
) {
  const state = editor.get<FormatState>(formatContext);
  const nextState = { ...state, [format]: !state[format] };
  editor.set(formatContext, nextState);

  const [anchor, focus] = editor.selection;
  if (anchor !== focus) {
    editor.exec(Format, format, nextState[format], [
      Math.min(anchor, focus),
      Math.max(anchor, focus),
    ]);
  } else {
    editor.exec(Format, format, nextState[format], [anchor, focus]);
  }
  return nextState;
}

function patchBlock(
  editor: ChatComposerEditor,
  index: number,
  values: Partial<ChatComposerBlock>
) {
  for (const [key, value] of Object.entries(values)) {
    editor.apply({ key, path: [index], type: "patch_node", value });
  }
}

function currentBlockIndex(editor: ChatComposerEditor) {
  return editor.doc.children.indexOf(getChatComposerBlock(editor));
}

function patchCurrentBlock(
  editor: ChatComposerEditor,
  values: Partial<ChatComposerBlock>
) {
  patchBlock(editor, currentBlockIndex(editor), values);
}

function selectedBlockIndexes(editor: ChatComposerEditor) {
  const start = Math.min(...editor.selection);
  const end = Math.max(...editor.selection);
  if (start === end) return [currentBlockIndex(editor)];

  const indexes: number[] = [];
  editor.doc.children.forEach((block, index) => {
    const blockStart = getNodeOffset(editor.doc, block);
    if (blockStart === null) return;
    const blockEnd = blockStart + getNodeSize(block);
    if (blockStart < end && blockEnd >= start) indexes.push(index);
  });
  return indexes.length > 0 ? indexes : [currentBlockIndex(editor)];
}

export type ChatComposerBlockType =
  | "blockquote"
  | "code_block"
  | "decimal"
  | "disc"
  | "h1"
  | "h2"
  | "h3"
  | "p";

export function setChatComposerBlockType(
  editor: ChatComposerEditor,
  blockType: ChatComposerBlockType
) {
  const indexes = selectedBlockIndexes(editor);

  if (blockType === "code_block") {
    const isCode = indexes.every(
      (index) => editor.doc.children[index]?.type === "code_line"
    );
    if (!isCode) toggleChatComposerCodeBlock(editor);
    return;
  }

  for (const index of indexes) {
    const listStyleType =
      blockType === "decimal" || blockType === "disc" ? blockType : undefined;
    const type =
      blockType === "decimal" || blockType === "disc" ? "p" : blockType;

    patchBlock(editor, index, {
      checked: undefined,
      codeBlockId: undefined,
      indent: listStyleType ? 1 : undefined,
      lang: undefined,
      listRestartPolite: undefined,
      listStart: undefined,
      listStyleType,
      type,
    });
  }
}

export function toggleChatComposerList(
  editor: ChatComposerEditor,
  listStyleType: "decimal" | "disc" | "todo"
) {
  const indexes = selectedBlockIndexes(editor);
  const isActive = indexes.every((index) => {
    const block = editor.doc.children[index];
    return block?.type === "p" && block.listStyleType === listStyleType;
  });
  for (const index of indexes) {
    patchBlock(editor, index, {
      checked: isActive
        ? undefined
        : listStyleType === "todo"
          ? false
          : undefined,
      indent: isActive ? undefined : 1,
      listRestartPolite: undefined,
      listStart: undefined,
      listStyleType: isActive ? undefined : listStyleType,
      type: "p",
    });
  }
}

export function toggleChatComposerBlockquote(editor: ChatComposerEditor) {
  const indexes = selectedBlockIndexes(editor);
  const isActive = indexes.every(
    (index) => editor.doc.children[index]?.type === "blockquote"
  );
  for (const index of indexes) {
    patchBlock(editor, index, {
      checked: undefined,
      indent: undefined,
      listRestartPolite: undefined,
      listStart: undefined,
      listStyleType: undefined,
      type: isActive ? "p" : "blockquote",
    });
  }
}

type MutableChatComposerText = {
  -readonly [Key in keyof ChatComposerText]: ChatComposerText[Key];
};

function codeTextChildrenFromBlock(block: ChatComposerBlock) {
  const children: ChatComposerText[] = [];
  for (const inline of block.children) {
    if ("text" in inline) {
      type LeadingCodeTextMarks = Pick<
        MutableChatComposerText,
        "bold" | "code" | "italic" | "strikethrough"
      >;
      const leadingMarks: LeadingCodeTextMarks = {};
      if (inline.bold) {
        leadingMarks.bold = true;
      }
      if (inline.code) {
        leadingMarks.code = true;
      }
      if (inline.italic) {
        leadingMarks.italic = true;
      }
      if (inline.strikethrough) {
        leadingMarks.strikethrough = true;
      }
      const codeText: MutableChatComposerText = {
        ...leadingMarks,
        text: inline.text,
      };
      if (inline.underline) {
        codeText.underline = true;
      }
      children.push(codeText);
      continue;
    }
    const text = composerVoidToString(inline);
    if (text) children.push({ text });
  }
  return children.length > 0 ? children : [{ text: "" }];
}

export function toggleChatComposerCodeBlock(editor: ChatComposerEditor) {
  const block = getChatComposerBlock(editor);
  if (block.type === "code_line") {
    const bounds = findCodeGroupBounds(editor);
    if (!bounds) return;
    for (let index = bounds.first; index <= bounds.last; index += 1) {
      patchBlock(editor, index, {
        codeBlockId: undefined,
        lang: undefined,
        type: "p",
      });
    }
    return;
  }

  const codeBlockId = nextCodeId();
  for (const index of selectedBlockIndexes(editor)) {
    const selectedBlock = editor.doc.children[index];
    if (!selectedBlock) continue;
    patchBlock(editor, index, {
      checked: undefined,
      children: codeTextChildrenFromBlock(selectedBlock),
      codeBlockId,
      indent: undefined,
      lang: "plaintext",
      listRestartPolite: undefined,
      listStart: undefined,
      listStyleType: undefined,
      type: "code_line",
    });
  }
}

export function getChatComposerCodeLanguage(editor: ChatComposerEditor) {
  const block = getChatComposerBlock(editor);
  return block.type === "code_line" ? (block.lang ?? "plaintext") : null;
}

export function setChatComposerCodeLanguage(
  editor: ChatComposerEditor,
  language: string
) {
  const block = getChatComposerBlock(editor);
  if (block.type !== "code_line") return false;

  const normalized = normalizeCodeLanguage(language);
  editor.doc.children.forEach((candidate, index) => {
    if (
      candidate.type === "code_line" &&
      candidate.codeBlockId === block.codeBlockId
    ) {
      editor.apply({
        key: "lang",
        path: [index],
        type: "patch_node",
        value: normalized,
      });
    }
  });
  return true;
}

function currentBlockRange(editor: ChatComposerEditor) {
  const block = getChatComposerBlock(editor);
  const start = getNodeOffset(editor.doc, block) ?? 0;
  return [block, start, start + getNodeSize(block)] as const;
}

export function convertChatComposerCodeFence(editor: ChatComposerEditor) {
  if (isChatComposerInsideCodeBlock(editor)) return false;
  const [anchor, focus] = editor.selection;
  if (anchor !== focus) return false;

  const [, blockStart] = currentBlockRange(editor);
  const before = sliceText(
    editor.doc,
    blockStart,
    anchor,
    composerVoidToString
  );
  const match = before.match(CODE_FENCE_RE);
  if (!match) return false;

  editor.exec(ReplaceText, "", [blockStart, anchor]);
  patchCurrentBlock(editor, {
    checked: undefined,
    codeBlockId: nextCodeId(),
    indent: undefined,
    lang: normalizeCodeLanguage(match[1]),
    listRestartPolite: undefined,
    listStart: undefined,
    listStyleType: undefined,
    type: "code_line",
  });
  return true;
}

export function convertChatComposerBacktick(editor: ChatComposerEditor) {
  if (isChatComposerInsideCodeBlock(editor)) return false;
  const [anchor, focus] = editor.selection;
  if (anchor !== focus) return false;

  const [, blockStart] = currentBlockRange(editor);
  const before = sliceText(
    editor.doc,
    blockStart,
    anchor,
    composerVoidToString
  );
  if (`${before}\`` === "```") {
    editor.exec(ReplaceText, "", [blockStart, anchor]);
    patchCurrentBlock(editor, {
      codeBlockId: nextCodeId(),
      lang: "plaintext",
      type: "code_line",
    });
    return true;
  }

  const match = `${before}\``.match(/`([^`\n]+)`$/);
  const codeText = match?.[1];
  if (!codeText) return false;

  const start = anchor - codeText.length - 1;
  editor.exec(ReplaceText, codeText, [start, anchor]);
  editor.exec(Format, "code", true, [start, start + codeText.length]);
  return true;
}

function findCodeGroupBounds(editor: ChatComposerEditor) {
  const block = getChatComposerBlock(editor);
  if (block.type !== "code_line") return null;

  const index = editor.doc.children.indexOf(block);
  let first = index;
  let last = index;
  while (
    first > 0 &&
    editor.doc.children[first - 1]?.type === "code_line" &&
    editor.doc.children[first - 1]?.codeBlockId === block.codeBlockId
  ) {
    first -= 1;
  }
  while (
    last < editor.doc.children.length - 1 &&
    editor.doc.children[last + 1]?.type === "code_line" &&
    editor.doc.children[last + 1]?.codeBlockId === block.codeBlockId
  ) {
    last += 1;
  }
  return { block, first, last };
}

function blockOffset(editor: ChatComposerEditor, index: number) {
  const block = editor.doc.children[index];
  return block ? getNodeOffset(editor.doc, block) : null;
}

export function exitChatComposerCodeBlock(editor: ChatComposerEditor) {
  const bounds = findCodeGroupBounds(editor);
  if (!bounds) return false;
  const lastOffset = blockOffset(editor, bounds.last);
  const lastBlock = editor.doc.children[bounds.last];
  if (lastOffset === null || !lastBlock) return false;

  const end = lastOffset + getNodeSize(lastBlock);
  editor.selection = [end, end];
  editor.exec(InsertText, "\n");
  patchCurrentBlock(editor, {
    codeBlockId: undefined,
    lang: undefined,
    type: "p",
  });
  return true;
}

export function exitChatComposerCodeBlockOnArrowDown(
  editor: ChatComposerEditor
) {
  const bounds = findCodeGroupBounds(editor);
  if (!bounds) return false;
  const currentIndex = editor.doc.children.indexOf(bounds.block);
  if (currentIndex !== bounds.last) return false;
  const [, , blockEnd] = currentBlockRange(editor);
  if (editor.selection[0] !== blockEnd || editor.selection[1] !== blockEnd) {
    return false;
  }

  const nextOffset = blockOffset(editor, bounds.last + 1);
  if (nextOffset !== null) {
    editor.selection = [nextOffset, nextOffset];
    return true;
  }
  return exitChatComposerCodeBlock(editor);
}

export function exitChatComposerCodeBlockOnArrowUp(editor: ChatComposerEditor) {
  const bounds = findCodeGroupBounds(editor);
  if (!bounds) return false;
  const currentIndex = editor.doc.children.indexOf(bounds.block);
  if (currentIndex !== bounds.first) return false;
  const [, blockStart] = currentBlockRange(editor);
  if (
    editor.selection[0] !== blockStart ||
    editor.selection[1] !== blockStart
  ) {
    return false;
  }

  if (bounds.first > 0) {
    const previous = editor.doc.children[bounds.first - 1];
    const previousOffset = previous
      ? getNodeOffset(editor.doc, previous)
      : null;
    if (previous && previousOffset !== null) {
      const end = previousOffset + getNodeSize(previous);
      editor.selection = [end, end];
      return true;
    }
  }

  editor.selection = [blockStart, blockStart];
  editor.exec(InsertText, "\n");
  editor.selection = [blockStart, blockStart];
  patchCurrentBlock(editor, {
    codeBlockId: undefined,
    lang: undefined,
    type: "p",
  });
  editor.selection = [blockStart, blockStart];
  return true;
}

export function unwrapChatComposerEmptyCodeBlock(editor: ChatComposerEditor) {
  const [block, start, end] = currentBlockRange(editor);
  if (
    block.type !== "code_line" ||
    editor.selection[0] !== start ||
    editor.selection[1] !== start ||
    sliceText(editor.doc, start, end).length > 0
  ) {
    return false;
  }
  patchCurrentBlock(editor, {
    codeBlockId: undefined,
    lang: undefined,
    type: "p",
  });
  return true;
}

export function unwrapChatComposerStructuredBlock(editor: ChatComposerEditor) {
  const [block, start] = currentBlockRange(editor);
  if (
    editor.selection[0] !== start ||
    editor.selection[1] !== start ||
    block.type === "code_line" ||
    (block.type === "p" && !block.listStyleType)
  ) {
    return false;
  }

  patchCurrentBlock(editor, {
    checked: undefined,
    indent: undefined,
    listRestartPolite: undefined,
    listStart: undefined,
    listStyleType: undefined,
    type: "p",
  });
  return true;
}

export function insertChatComposerMention(
  editor: ChatComposerEditor,
  participant: ChatParticipant,
  range: readonly [number, number]
) {
  const mention: ChatComposerMention = {
    participantId: participant.id,
    type: "mention",
    value: participant.name,
  };
  editor.exec(Delete, range);
  editor.exec(InsertNode, mention, range[0]);
  editor.exec(InsertText, " ", range[0] + 1);
}

export function insertChatComposerImage(
  editor: ChatComposerEditor,
  imageUrl: string
) {
  if (!isValidGifUrl(imageUrl)) return false;
  if (isChatComposerInsideCodeBlock(editor)) {
    exitChatComposerCodeBlock(editor);
  }
  const at = editor.selection[0];
  editor.exec(InsertNode, { type: "img", url: imageUrl }, at);
  editor.exec(InsertText, "\n", at + 1);
  return true;
}

export function removeChatComposerImage(
  editor: ChatComposerEditor,
  image: ChatComposerImage
) {
  const offset = getNodeOffset(editor.doc, image);
  if (offset === null) return false;
  editor.exec(Delete, [offset, offset + 1]);
  return true;
}

export function insertChatComposerLink(
  editor: ChatComposerEditor,
  rawUrl: string
) {
  const url = sanitizeChatComposerHttpUrl(rawUrl);
  if (!url) return false;
  const [anchor, focus] = editor.selection;
  const start = Math.min(anchor, focus);
  const end = Math.max(anchor, focus);

  if (start === end) {
    editor.exec(InsertText, url, start);
    editor.exec(Format, "link", url, [start, start + url.length]);
  } else {
    editor.exec(Format, "link", url, [start, end]);
    editor.selection = [end, end];
  }
  return true;
}

export function insertChatComposerText(
  editor: ChatComposerEditor,
  text: string
) {
  const [anchor, focus] = editor.selection;
  if (anchor !== focus) {
    editor.exec(Delete, [Math.min(anchor, focus), Math.max(anchor, focus)]);
  }
  editor.exec(InsertText, text);
}

export function replaceChatComposerRange(
  editor: ChatComposerEditor,
  range: readonly [number, number],
  text: string
) {
  editor.exec(ReplaceText, text, range);
}

export function getChatComposerCurrentText(editor: ChatComposerEditor) {
  const leaf = getLeafAt(editor.doc, editor.selection[0], true)?.[0];
  return isComposerText(leaf) ? leaf : null;
}
