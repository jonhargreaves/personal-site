export interface CustomText {
  bold?: boolean;
  className?: string;
  code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  text: string;
  underline?: boolean;
}

export interface ParagraphElement {
  checked?: boolean;
  children: RichTextInline[];
  className?: string;
  indent?: number;
  listRestartPolite?: number;
  listStart?: number;
  listStyleType?: string;
  placeholder?: string;
  type: "p";
}

export interface MentionElement {
  children: [CustomText];
  participantId?: string;
  type: "mention";
  value: string;
}

export interface CodeBlockElement {
  children: CodeLineElement[];
  lang?: string;
  type: "code_block";
}

export interface CodeLineElement {
  children: CustomText[];
  type: "code_line";
}

export interface ImageElement {
  align?: string;
  children: [CustomText];
  type: "img";
  url: string;
}

export interface LinkElement {
  children: CustomText[];
  type: "a";
  url: string;
}

export interface BlockquoteElement {
  children: RichTextNode[];
  type: "blockquote";
}

export interface HeadingElement {
  children: RichTextInline[];
  type: "h1" | "h2" | "h3";
}

export interface DateElement {
  children: [CustomText];
  date?: string;
  type: "date";
}

export type RichTextInline =
  | CustomText
  | DateElement
  | LinkElement
  | MentionElement;

export type CustomElement =
  | BlockquoteElement
  | CodeBlockElement
  | CodeLineElement
  | DateElement
  | HeadingElement
  | ImageElement
  | LinkElement
  | MentionElement
  | ParagraphElement;

export type RichTextNode = CustomElement | CustomText;
export type Value = CustomElement[];

export function createEmptyValue(): Value {
  return [{ children: [{ text: "" }], type: "p" }];
}

export function isEffectivelyEmpty(value: Value): boolean {
  if (value.length === 0) return true;
  if (value.length > 1) return false;
  const first = value[0];
  if (!first || first.type !== "p" || first.children.length !== 1) return false;
  const child = first.children[0];
  return Boolean(child && "text" in child && child.text.trim() === "");
}

export interface ChatParticipant {
  detail?: string;
  id: string;
  name: string;
}
