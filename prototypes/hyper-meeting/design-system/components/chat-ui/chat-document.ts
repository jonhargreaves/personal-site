import type { StandardSchemaV1 } from "@standard-schema/spec";
import { pipe, transform } from "zod/mini";

import * as Predicate from "../../lib/predicate";

import {
  createEmptyValue as createEmptyRichTextValue,
  type BlockquoteElement,
  type ChatParticipant as RichTextParticipant,
  type CodeBlockElement,
  type CodeLineElement,
  type CustomElement,
  type CustomText,
  type DateElement,
  type HeadingElement,
  type ImageElement,
  type LinkElement,
  type MentionElement,
  type ParagraphElement,
  type RichTextInline,
  type RichTextNode,
  type Value as RichTextValue,
} from "../rich-text-editor/types";

export type ChatText = CustomText;
export type ChatParagraphElement = ParagraphElement;
export type ChatMentionElement = MentionElement;
export type ChatCodeLineElement = CodeLineElement;
export type ChatCodeBlockElement = CodeBlockElement;
export type ChatImageElement = ImageElement;
export type ChatLinkElement = LinkElement;
export type ChatBlockquoteElement = BlockquoteElement;
export type ChatHeadingElement = HeadingElement;
export type ChatDateElement = DateElement;
export type ChatInline = RichTextInline;
export type ChatElement = CustomElement;
export type ChatNode = RichTextNode;
export type ChatParticipant = RichTextParticipant;
export type Value = RichTextValue;

export type ChatComposerText = Omit<ChatText, "className"> & {
  readonly link?: string;
};
type MutableChatText = {
  -readonly [Key in keyof ChatText]: ChatText[Key];
};
type MutableChatComposerText = {
  -readonly [Key in keyof ChatComposerText]: ChatComposerText[Key];
};

export interface ChatComposerMention {
  readonly participantId?: string;
  readonly type: "mention";
  readonly value: string;
}

export interface ChatComposerImage {
  readonly type: "img";
  readonly url: string;
}

export interface ChatComposerDate {
  readonly date?: string;
  readonly type: "date";
}

export type ChatComposerInline =
  | ChatComposerDate
  | ChatComposerImage
  | ChatComposerMention
  | ChatComposerText;

export interface ChatComposerBlock {
  readonly checked?: boolean;
  readonly children: ChatComposerInline[];
  readonly className?: string;
  readonly codeBlockId?: string;
  readonly indent?: number;
  readonly lang?: string;
  readonly listRestartPolite?: number;
  readonly listStart?: number;
  readonly listStyleType?: string;
  readonly placeholder?: string;
  readonly type: "blockquote" | "code_line" | "h1" | "h2" | "h3" | "p";
}

export interface ChatComposerDocument {
  readonly children: ChatComposerBlock[];
}

const LIST_STYLE_TYPES = new Set(["decimal", "disc", "todo"]);
type MarkKey = "bold" | "code" | "italic" | "strikethrough" | "underline";

type ChatDocumentInput =
  | ChatDocumentInputNode
  | ReadonlyArray<ChatDocumentInput>
  | null;

type ChatDocumentInputNode = {
  readonly bold?: boolean;
  readonly checked?: boolean;
  readonly children?: ReadonlyArray<ChatDocumentInput>;
  readonly className?: string;
  readonly code?: boolean;
  readonly codeBlockId?: string;
  readonly date?: string;
  readonly indent?: number;
  readonly italic?: boolean;
  readonly lang?: string;
  readonly link?: string;
  readonly listRestartPolite?: number;
  readonly listStart?: number;
  readonly listStyleType?: string;
  readonly participantId?: string;
  readonly placeholder?: string;
  readonly strikethrough?: boolean;
  readonly text?: string;
  readonly type?: string;
  readonly underline?: boolean;
  readonly url?: string;
  readonly value?: string;
};
type MutableChatDocumentInputNode = {
  -readonly [Key in keyof ChatDocumentInputNode]: ChatDocumentInputNode[Key];
};

/**
 * Lenient normaliser: any input becomes a `ChatDocumentInput`. Unknown keys are
 * dropped and mistyped fields are ignored, so it never throws.
 */
const chatDocumentInputSchema = transform((value): ChatDocumentInput => {
  if (Array.isArray(value)) {
    return value.map((item) => chatDocumentInputSchema.parse(item));
  }
  if (!Predicate.isObjectOrArray(value)) {
    return null;
  }

  const bold = "bold" in value ? value.bold : undefined;
  const checked = "checked" in value ? value.checked : undefined;
  const children = "children" in value ? value.children : undefined;
  const className = "className" in value ? value.className : undefined;
  const code = "code" in value ? value.code : undefined;
  const codeBlockId = "codeBlockId" in value ? value.codeBlockId : undefined;
  const date = "date" in value ? value.date : undefined;
  const indent = "indent" in value ? value.indent : undefined;
  const italic = "italic" in value ? value.italic : undefined;
  const lang = "lang" in value ? value.lang : undefined;
  const link = "link" in value ? value.link : undefined;
  const listRestartPolite =
    "listRestartPolite" in value ? value.listRestartPolite : undefined;
  const listStart = "listStart" in value ? value.listStart : undefined;
  const listStyleType =
    "listStyleType" in value ? value.listStyleType : undefined;
  const participantId =
    "participantId" in value ? value.participantId : undefined;
  const placeholder = "placeholder" in value ? value.placeholder : undefined;
  const strikethrough =
    "strikethrough" in value ? value.strikethrough : undefined;
  const text = "text" in value ? value.text : undefined;
  const type = "type" in value ? value.type : undefined;
  const underline = "underline" in value ? value.underline : undefined;
  const url = "url" in value ? value.url : undefined;
  const inputValue = "value" in value ? value.value : undefined;

  const normalized: MutableChatDocumentInputNode = {};
  if (Predicate.isBoolean(bold)) normalized.bold = bold;
  if (Predicate.isBoolean(checked)) normalized.checked = checked;
  if (Array.isArray(children)) {
    normalized.children = children.map((item) =>
      chatDocumentInputSchema.parse(item)
    );
  }
  if (Predicate.isString(className)) normalized.className = className;
  if (Predicate.isBoolean(code)) normalized.code = code;
  if (Predicate.isString(codeBlockId)) {
    normalized.codeBlockId = codeBlockId;
  }
  if (Predicate.isString(date)) normalized.date = date;
  if (Predicate.isNumber(indent)) normalized.indent = indent;
  if (Predicate.isBoolean(italic)) normalized.italic = italic;
  if (Predicate.isString(lang)) normalized.lang = lang;
  if (Predicate.isString(link)) normalized.link = link;
  if (Predicate.isNumber(listRestartPolite)) {
    normalized.listRestartPolite = listRestartPolite;
  }
  if (Predicate.isNumber(listStart)) normalized.listStart = listStart;
  if (Predicate.isString(listStyleType)) {
    normalized.listStyleType = listStyleType;
  }
  if (Predicate.isString(participantId)) {
    normalized.participantId = participantId;
  }
  if (Predicate.isString(placeholder)) {
    normalized.placeholder = placeholder;
  }
  if (Predicate.isBoolean(strikethrough)) {
    normalized.strikethrough = strikethrough;
  }
  if (Predicate.isString(text)) normalized.text = text;
  if (Predicate.isString(type)) normalized.type = type;
  if (Predicate.isBoolean(underline)) {
    normalized.underline = underline;
  }
  if (Predicate.isString(url)) normalized.url = url;
  if (Predicate.isString(inputValue)) normalized.value = inputValue;
  return normalized;
});

function decodeChatDocumentInputFromJson(content: string): ChatDocumentInput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new TypeError(
      `Chat document is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }
  return chatDocumentInputSchema.parse(parsed);
}

function isChatDocumentNodeInput(
  value: ChatDocumentInput
): value is ChatDocumentInputNode {
  return (
    Predicate.or(Predicate.isNull, Predicate.isObjectOrArray)(value) &&
    value !== null &&
    !Array.isArray(value)
  );
}

function optionalBoolean(
  record: ChatDocumentInputNode,
  key: MarkKey
) {
  return record[key] === true ? true : undefined;
}

function decodeText(value: ChatDocumentInput): ChatText | null {
  if (!isChatDocumentNodeInput(value) || !Predicate.isString(value.text)) {
    return null;
  }

  type LeadingChatTextMarks = Pick<
    MutableChatText,
    "bold" | "code" | "italic" | "strikethrough"
  >;
  const leadingMarks: LeadingChatTextMarks = {};
  if (optionalBoolean(value, "bold")) {
    leadingMarks.bold = true;
  }
  if (optionalBoolean(value, "code")) {
    leadingMarks.code = true;
  }
  if (optionalBoolean(value, "italic")) {
    leadingMarks.italic = true;
  }
  if (optionalBoolean(value, "strikethrough")) {
    leadingMarks.strikethrough = true;
  }
  const text: MutableChatText = { ...leadingMarks, text: value.text };
  if (optionalBoolean(value, "underline")) {
    text.underline = true;
  }
  return text;
}

function decodeTextChildren(
  value: ChatDocumentInput | undefined
): ChatText[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const children: ChatText[] = [];
  for (const child of value) {
    const decoded = decodeText(child);
    if (!decoded) {
      return null;
    }
    children.push(decoded);
  }
  return children;
}

function decodeInline(value: ChatDocumentInput): ChatInline | null {
  const text = decodeText(value);
  if (text) {
    return text;
  }
  if (!isChatDocumentNodeInput(value) || !Predicate.isString(value.type)) {
    return null;
  }

  switch (value.type) {
    case "mention":
      if (!Predicate.isString(value.value)) return null;
      {
        const conditionalValue1_0: Pick<MentionElement, "children"> = {
          children: [{ text: "" }],
        };
        const conditionalValue1_1 = Predicate.isString(value.participantId)
          ? {
              ...conditionalValue1_0,
              participantId: value.participantId,
            }
          : conditionalValue1_0;
        const conditionalValue1_2: MentionElement = {
          ...conditionalValue1_1,
          type: "mention",
          value: value.value,
        };
        return conditionalValue1_2;
      }
    case "a": {
      if (!Predicate.isString(value.url)) return null;
      const children = decodeTextChildren(value.children);
      return children ? { children, type: "a", url: value.url } : null;
    }
    case "date": {
      const conditionalValue2_0: Pick<DateElement, "children"> = {
        children: [{ text: "" }],
      };
      const conditionalValue2_1 = Predicate.isString(value.date)
        ? {
            ...conditionalValue2_0,
            date: value.date,
          }
        : conditionalValue2_0;
      const conditionalValue2_2: DateElement = {
        ...conditionalValue2_1,
        type: "date",
      };
      return conditionalValue2_2;
    }
    default:
      return null;
  }
}

function decodeInlineChildren(
  value: ChatDocumentInput | undefined
): ChatInline[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const children: ChatInline[] = [];
  for (const child of value) {
    const decoded = decodeInline(child);
    if (!decoded) {
      return null;
    }
    children.push(decoded);
  }
  return children;
}

function decodeNode(value: ChatDocumentInput): ChatNode | null {
  const text = decodeText(value);
  if (text) {
    return text;
  }
  if (!isChatDocumentNodeInput(value) || !Predicate.isString(value.type)) {
    return null;
  }

  switch (value.type) {
    case "p": {
      const children = decodeInlineChildren(value.children);
      if (!children) return null;
      const listStyleType =
        Predicate.isString(value.listStyleType) &&
        LIST_STYLE_TYPES.has(value.listStyleType)
          ? value.listStyleType
          : undefined;
      const conditionalValue4_2 = Predicate.isBoolean(value.checked)
        ? {
            checked: value.checked,
            children,
          }
        : {
            children,
          };
      const conditionalValue4_3 = Predicate.isString(value.className)
        ? {
            ...conditionalValue4_2,
            className: value.className,
          }
        : conditionalValue4_2;
      const conditionalValue4_4 = Predicate.isNumber(value.indent)
        ? {
            ...conditionalValue4_3,
            indent: value.indent,
          }
        : conditionalValue4_3;
      const conditionalValue4_5 = Predicate.isNumber(value.listRestartPolite)
        ? {
            ...conditionalValue4_4,
            listRestartPolite: value.listRestartPolite,
          }
        : conditionalValue4_4;
      const conditionalValue4_6 = Predicate.isNumber(value.listStart)
        ? {
            ...conditionalValue4_5,
            listStart: value.listStart,
          }
        : conditionalValue4_5;
      const conditionalValue4_7 = listStyleType
        ? {
            ...conditionalValue4_6,
            listStyleType,
          }
        : conditionalValue4_6;
      const conditionalValue4_8 = Predicate.isString(value.placeholder)
        ? {
            ...conditionalValue4_7,
            placeholder: value.placeholder,
          }
        : conditionalValue4_7;
      const conditionalValue4_9: ParagraphElement = {
        ...conditionalValue4_8,
        type: "p",
      };
      return conditionalValue4_9;
    }
    case "mention":
    case "a":
    case "date":
      return decodeInline(value);
    case "code_line": {
      const children = decodeTextChildren(value.children);
      return children ? { children, type: "code_line" } : null;
    }
    case "code_block": {
      if (!Array.isArray(value.children)) return null;
      const children: ChatCodeLineElement[] = [];
      for (const child of value.children) {
        const decoded = decodeNode(child);
        if (!decoded || !("type" in decoded) || decoded.type !== "code_line") {
          return null;
        }
        children.push(decoded);
      }
      const conditionalValue5_0 = {
        children,
      };
      const conditionalValue5_1 = Predicate.isString(value.lang)
        ? {
            ...conditionalValue5_0,
            lang: value.lang,
          }
        : conditionalValue5_0;
      const conditionalValue5_2: CodeBlockElement = {
        ...conditionalValue5_1,
        type: "code_block",
      };
      return conditionalValue5_2;
    }
    case "img":
      return Predicate.isString(value.url)
        ? { children: [{ text: "" }], type: "img", url: value.url }
        : null;
    case "blockquote": {
      if (!Array.isArray(value.children)) return null;
      const children: ChatNode[] = [];
      for (const child of value.children) {
        const decoded = decodeNode(child);
        if (!decoded) return null;
        children.push(decoded);
      }
      return { children, type: "blockquote" };
    }
    case "h1":
    case "h2":
    case "h3": {
      const children = decodeInlineChildren(value.children);
      return children ? { children, type: value.type } : null;
    }
    default:
      return null;
  }
}

function decodeChatDocumentInput(value: ChatDocumentInput): Value | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const decoded: Value = [];
  for (const node of value) {
    const next = decodeNode(node);
    if (!next || !("type" in next)) {
      return null;
    }
    decoded.push(next);
  }
  return decoded;
}

export function decodeChatValueFromJson(content: string): Value | null {
  return decodeChatDocumentInput(decodeChatDocumentInputFromJson(content));
}

export const decodeChatValue = pipe(
  chatDocumentInputSchema,
  transform(decodeChatDocumentInput)
).parse;

export function createEmptyValue(): Value {
  return createEmptyRichTextValue();
}

export function createEmptyChatComposerDocument(): ChatComposerDocument {
  return { children: [{ children: [{ text: "" }], type: "p" }] };
}

function composerTextFromChatText(
  text: ChatText,
  link?: string
): ChatComposerText {
  type LeadingComposerTextDetails = Pick<
    MutableChatComposerText,
    "bold" | "code" | "italic" | "link" | "strikethrough"
  >;
  const leadingDetails: LeadingComposerTextDetails = {};
  if (text.bold) {
    leadingDetails.bold = true;
  }
  if (text.code) {
    leadingDetails.code = true;
  }
  if (text.italic) {
    leadingDetails.italic = true;
  }
  if (link) {
    leadingDetails.link = link;
  }
  if (text.strikethrough) {
    leadingDetails.strikethrough = true;
  }
  const composerText: MutableChatComposerText = {
    ...leadingDetails,
    text: text.text,
  };
  if (text.underline) {
    composerText.underline = true;
  }
  return composerText;
}

function composerInlinesFromNodes(nodes: readonly ChatNode[]) {
  const inlines: ChatComposerInline[] = [];

  for (const node of nodes) {
    if (!("type" in node)) {
      inlines.push(composerTextFromChatText(node));
      continue;
    }

    switch (node.type) {
      case "mention":
        type MentionDetails = Pick<ChatComposerMention, "participantId">;
        const mentionDetails: {
          -readonly [Key in keyof MentionDetails]: MentionDetails[Key];
        } = {};
        if (node.participantId) {
          mentionDetails.participantId = node.participantId;
        }
        const conditionalValue3_2: ChatComposerMention = {
          ...mentionDetails,
          type: "mention",
          value: node.value,
        };
        inlines.push(conditionalValue3_2);
        break;
      case "a":
        inlines.push(
          ...node.children.map((child) =>
            composerTextFromChatText(child, node.url)
          )
        );
        break;
      case "date":
        type DateDetails = Pick<ChatComposerDate, "date">;
        const dateDetails: {
          -readonly [Key in keyof DateDetails]: DateDetails[Key];
        } = {};
        if (node.date) {
          dateDetails.date = node.date;
        }
        const conditionalValue4_2: ChatComposerDate = {
          ...dateDetails,
          type: "date",
        };
        inlines.push(conditionalValue4_2);
        break;
      case "img":
        inlines.push({ type: "img", url: node.url });
        break;
      default:
        inlines.push(...composerInlinesFromNodes(node.children));
        break;
    }
  }

  return inlines.length > 0 ? inlines : [{ text: "" }];
}

function blockFromElement(
  element: ChatElement,
  codeBlockId: string
): ChatComposerBlock[] {
  switch (element.type) {
    case "p": {
      const conditionalValue3_2 = Predicate.isBoolean(element.checked)
        ? {
            checked: element.checked,
            children: composerInlinesFromNodes(element.children),
          }
        : {
            children: composerInlinesFromNodes(element.children),
          };
      const conditionalValue3_3 = element.className
        ? {
            ...conditionalValue3_2,
            className: element.className,
          }
        : conditionalValue3_2;
      const conditionalValue3_4 = Predicate.isNumber(element.indent)
        ? {
            ...conditionalValue3_3,
            indent: element.indent,
          }
        : conditionalValue3_3;
      const conditionalValue3_5 = Predicate.isNumber(element.listRestartPolite)
        ? {
            ...conditionalValue3_4,
            listRestartPolite: element.listRestartPolite,
          }
        : conditionalValue3_4;
      const conditionalValue3_6 = Predicate.isNumber(element.listStart)
        ? {
            ...conditionalValue3_5,
            listStart: element.listStart,
          }
        : conditionalValue3_5;
      const conditionalValue3_7 = element.listStyleType
        ? {
            ...conditionalValue3_6,
            listStyleType: element.listStyleType,
          }
        : conditionalValue3_6;
      const conditionalValue3_8 = element.placeholder
        ? {
            ...conditionalValue3_7,
            placeholder: element.placeholder,
          }
        : conditionalValue3_7;
      const conditionalValue3_9: ChatComposerBlock = {
        ...conditionalValue3_8,
        type: "p",
      };
      return [conditionalValue3_9];
    }
    case "code_block":
      return (
        element.children.length > 0
          ? element.children
          : [{ children: [{ text: "" }], type: "code_line" as const }]
      ).map((line) => ({
        children: line.children.map((child) => composerTextFromChatText(child)),
        codeBlockId,
        lang: element.lang ?? "plaintext",
        type: "code_line",
      }));
    case "code_line":
      return [
        {
          children: element.children.map((child) =>
            composerTextFromChatText(child)
          ),
          codeBlockId,
          lang: "plaintext",
          type: "code_line",
        },
      ];
    case "blockquote":
      return [
        {
          children: composerInlinesFromNodes(element.children),
          type: "blockquote",
        },
      ];
    case "h1":
    case "h2":
    case "h3":
      return [
        {
          children: composerInlinesFromNodes(element.children),
          type: element.type,
        },
      ];
    case "img":
    case "mention":
    case "a":
    case "date":
      return [
        {
          children: composerInlinesFromNodes([element]),
          type: "p",
        },
      ];
  }
}

export function chatValueToComposerDocument(
  value: Value
): ChatComposerDocument {
  const children = value.flatMap((element, index) =>
    blockFromElement(element, `persisted-code-${index}`)
  );
  return children.length > 0 ? { children } : createEmptyChatComposerDocument();
}

function chatTextFromComposerText(text: ChatComposerText): ChatText {
  type LeadingChatTextMarks = Pick<
    MutableChatText,
    "bold" | "code" | "italic" | "strikethrough"
  >;
  const leadingMarks: LeadingChatTextMarks = {};
  if (text.bold) {
    leadingMarks.bold = true;
  }
  if (text.code) {
    leadingMarks.code = true;
  }
  if (text.italic) {
    leadingMarks.italic = true;
  }
  if (text.strikethrough) {
    leadingMarks.strikethrough = true;
  }
  const chatText: MutableChatText = { ...leadingMarks, text: text.text };
  if (text.underline) {
    chatText.underline = true;
  }
  return chatText;
}

function wireInlinesFromComposer(inlines: readonly ChatComposerInline[]) {
  const children: ChatInline[] = [];
  let linkedText: ChatText[] = [];
  let linkUrl: string | undefined;

  const flushLink = () => {
    if (linkUrl && linkedText.length > 0) {
      children.push({ children: linkedText, type: "a", url: linkUrl });
    }
    linkedText = [];
    linkUrl = undefined;
  };

  for (const inline of inlines) {
    if ("text" in inline) {
      const text = chatTextFromComposerText(inline);
      if (inline.link) {
        if (linkUrl && linkUrl !== inline.link) {
          flushLink();
        }
        linkUrl = inline.link;
        linkedText.push(text);
      } else {
        flushLink();
        children.push(text);
      }
      continue;
    }

    flushLink();
    if (inline.type === "mention") {
      const conditionalValue6_0: Pick<MentionElement, "children"> = {
        children: [{ text: "" }],
      };
      const conditionalValue6_1 = inline.participantId
        ? {
            ...conditionalValue6_0,
            participantId: inline.participantId,
          }
        : conditionalValue6_0;
      const conditionalValue6_2: MentionElement = {
        ...conditionalValue6_1,
        type: "mention",
        value: inline.value,
      };
      children.push(conditionalValue6_2);
    } else if (inline.type === "date") {
      const conditionalValue7_0: Pick<DateElement, "children"> = {
        children: [{ text: "" }],
      };
      const conditionalValue7_1 = inline.date
        ? {
            ...conditionalValue7_0,
            date: inline.date,
          }
        : conditionalValue7_0;
      const conditionalValue7_2: DateElement = {
        ...conditionalValue7_1,
        type: "date",
      };
      children.push(conditionalValue7_2);
    }
  }

  flushLink();
  return children.length > 0 ? children : [{ text: "" }];
}

function paragraphElementsFromComposerBlock(
  block: ChatComposerBlock
): ChatElement[] {
  const elements: ChatElement[] = [];
  let segment: ChatComposerInline[] = [];

  const flushSegment = (force = false) => {
    if (!force && segment.length === 0) return;
    const children = wireInlinesFromComposer(segment);

    if (block.type === "blockquote") {
      elements.push({
        children: [{ children, type: "p" }],
        type: "blockquote",
      });
    } else if (
      block.type === "h1" ||
      block.type === "h2" ||
      block.type === "h3"
    ) {
      elements.push({ children, type: block.type });
    } else {
      const conditionalValue8_2 = Predicate.isBoolean(block.checked)
        ? {
            checked: block.checked,
            children,
          }
        : {
            children,
          };
      const conditionalValue8_3 = block.className
        ? {
            ...conditionalValue8_2,
            className: block.className,
          }
        : conditionalValue8_2;
      const conditionalValue8_4 = Predicate.isNumber(block.indent)
        ? {
            ...conditionalValue8_3,
            indent: block.indent,
          }
        : conditionalValue8_3;
      const conditionalValue8_5 = Predicate.isNumber(block.listRestartPolite)
        ? {
            ...conditionalValue8_4,
            listRestartPolite: block.listRestartPolite,
          }
        : conditionalValue8_4;
      const conditionalValue8_6 = Predicate.isNumber(block.listStart)
        ? {
            ...conditionalValue8_5,
            listStart: block.listStart,
          }
        : conditionalValue8_5;
      const conditionalValue8_7 = block.listStyleType
        ? {
            ...conditionalValue8_6,
            listStyleType: block.listStyleType,
          }
        : conditionalValue8_6;
      const conditionalValue8_8 = block.placeholder
        ? {
            ...conditionalValue8_7,
            placeholder: block.placeholder,
          }
        : conditionalValue8_7;
      const conditionalValue8_9: ParagraphElement = {
        ...conditionalValue8_8,
        type: "p",
      };
      elements.push(conditionalValue8_9);
    }
    segment = [];
  };

  for (const inline of block.children) {
    if (!("text" in inline) && inline.type === "img") {
      flushSegment();
      elements.push({ children: [{ text: "" }], type: "img", url: inline.url });
    } else {
      segment.push(inline);
    }
  }
  flushSegment(elements.length === 0);
  return elements;
}

function isMeaningfulComposerInline(inline: ChatComposerInline) {
  if ("text" in inline) return inline.text.trim().length > 0;
  if (inline.type === "mention") {
    return (
      inline.value.trim().length > 0 || Boolean(inline.participantId?.trim())
    );
  }
  if (inline.type === "date") return Boolean(inline.date?.trim());
  return inline.url.trim().length > 0;
}

function isPlainEmptyComposerParagraph(block: ChatComposerBlock) {
  return (
    block.type === "p" &&
    block.children.every((inline) => !isMeaningfulComposerInline(inline))
  );
}

export function chatComposerDocumentToValue(
  document: ChatComposerDocument,
  options: { readonly preserveEmptyParagraphs?: boolean } = {}
): Value {
  const value: Value = [];

  for (let index = 0; index < document.children.length; index += 1) {
    const block = document.children[index];
    if (!block) continue;

    if (block.type === "code_line") {
      const codeBlockId = block.codeBlockId;
      const lang = block.lang ?? "plaintext";
      const lines: ChatCodeLineElement[] = [];
      let lineIndex = index;

      while (lineIndex < document.children.length) {
        const line = document.children[lineIndex];
        if (
          !line ||
          line.type !== "code_line" ||
          line.codeBlockId !== codeBlockId
        ) {
          break;
        }
        lines.push({
          children: line.children
            .filter((inline): inline is ChatComposerText => "text" in inline)
            .map(chatTextFromComposerText),
          type: "code_line",
        });
        lineIndex += 1;
      }

      value.push({ children: lines, lang, type: "code_block" });
      index = lineIndex - 1;
      continue;
    }

    if (
      isPlainEmptyComposerParagraph(block) &&
      !options.preserveEmptyParagraphs
    ) {
      continue;
    }
    value.push(...paragraphElementsFromComposerBlock(block));
  }

  return value;
}

export function isChatComposerDocumentEmpty(document: ChatComposerDocument) {
  if (document.children.length === 0) return true;
  if (document.children.length > 1) return false;
  const first = document.children[0];
  return first ? isPlainEmptyComposerParagraph(first) : true;
}

export function shouldShowChatComposerPlaceholder(
  document: ChatComposerDocument
) {
  if (document.children.length !== 1) return false;
  const first = document.children[0];
  return Boolean(
    first &&
    isPlainEmptyComposerParagraph(first) &&
    first.checked === undefined &&
    first.indent === undefined &&
    first.listRestartPolite === undefined &&
    first.listStart === undefined &&
    first.listStyleType === undefined
  );
}

/** Unvalidated composer fields, narrowed by the predicates below. */
interface ComposerFields {
  readonly bold?: unknown;
  readonly checked?: unknown;
  readonly children?: unknown;
  readonly className?: unknown;
  readonly code?: unknown;
  readonly codeBlockId?: unknown;
  readonly date?: unknown;
  readonly indent?: unknown;
  readonly italic?: unknown;
  readonly lang?: unknown;
  readonly link?: unknown;
  readonly listRestartPolite?: unknown;
  readonly listStart?: unknown;
  readonly listStyleType?: unknown;
  readonly participantId?: unknown;
  readonly placeholder?: unknown;
  readonly strikethrough?: unknown;
  readonly text?: unknown;
  readonly type?: unknown;
  readonly underline?: unknown;
  readonly url?: unknown;
  readonly value?: unknown;
}

function isRecord(value: unknown): value is ComposerFields {
  return Predicate.isObjectOrArray(value) && !Array.isArray(value);
}

function isOptionalBoolean(value: unknown): value is boolean | undefined {
  return value === undefined || Predicate.isBoolean(value);
}

function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || Predicate.isNumber(value);
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || Predicate.isString(value);
}

function isNonEmptyArrayOf<T>(
  value: unknown,
  isItem: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.length > 0 && value.every(isItem);
}

function isChatComposerText(value: unknown): value is ChatComposerText {
  return (
    isRecord(value) &&
    Predicate.isString(value.text) &&
    isOptionalBoolean(value.bold) &&
    isOptionalBoolean(value.code) &&
    isOptionalBoolean(value.italic) &&
    isOptionalString(value.link) &&
    isOptionalBoolean(value.strikethrough) &&
    isOptionalBoolean(value.underline)
  );
}

function isChatComposerInline(value: unknown): value is ChatComposerInline {
  if (isChatComposerText(value)) return true;
  if (!isRecord(value)) return false;
  switch (value.type) {
    case "mention":
      return (
        Predicate.isString(value.value) && isOptionalString(value.participantId)
      );
    case "img":
      return Predicate.isString(value.url);
    case "date":
      return isOptionalString(value.date);
    default:
      return false;
  }
}

function hasChatComposerBlockFields(value: ComposerFields): boolean {
  return (
    isOptionalBoolean(value.checked) &&
    isOptionalString(value.className) &&
    isOptionalString(value.codeBlockId) &&
    isOptionalNumber(value.indent) &&
    isOptionalString(value.lang) &&
    isOptionalNumber(value.listRestartPolite) &&
    isOptionalNumber(value.listStart) &&
    (value.listStyleType === undefined ||
      (Predicate.isString(value.listStyleType) &&
        LIST_STYLE_TYPES.has(value.listStyleType))) &&
    isOptionalString(value.placeholder)
  );
}

function isChatComposerBlock(value: unknown): value is ChatComposerBlock {
  if (!isRecord(value) || !hasChatComposerBlockFields(value)) return false;
  switch (value.type) {
    case "code_line":
      return isNonEmptyArrayOf(value.children, isChatComposerText);
    case "blockquote":
    case "h1":
    case "h2":
    case "h3":
    case "p":
      return isNonEmptyArrayOf(value.children, isChatComposerInline);
    default:
      return false;
  }
}

export function isChatComposerDocument(
  value: unknown
): value is ChatComposerDocument {
  return (
    isRecord(value) && isNonEmptyArrayOf(value.children, isChatComposerBlock)
  );
}

/** Standard Schema v1 contract consumed by Editate. */
export type ChatComposerDocumentStandardSchema =
  StandardSchemaV1<ChatComposerDocument>;

export const chatComposerDocumentSchema: ChatComposerDocumentStandardSchema = {
  "~standard": {
    validate: (value) =>
      isChatComposerDocument(value)
        ? { value }
        : { issues: [{ message: "Expected a chat composer document" }] },
    vendor: "hyper-meeting-prototype",
    version: 1,
  },
};

function chatNodeText(node: ChatNode): string {
  if (!("type" in node)) return node.text;
  if (node.type === "mention") return `@${node.value}`;
  if (node.type === "img") return "";
  if (node.type === "date") return node.date ?? "";
  return node.children.map(chatNodeText).join("");
}

export function chatValueToText(value: Value): string {
  return value.map(chatNodeText).join("\n").trim();
}

export function getChatValueMentions(value: Value) {
  const mentions: ChatMentionElement[] = [];
  const visit = (node: ChatNode) => {
    if (!("type" in node)) return;
    if (node.type === "mention") {
      mentions.push(node);
      return;
    }
    for (const child of node.children) visit(child);
  };
  for (const node of value) visit(node);
  return mentions;
}
