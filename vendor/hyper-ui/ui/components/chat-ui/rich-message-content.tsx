"use client";

import { Fragment, type ReactNode, useMemo } from "react";

import { cn } from "../../lib/utils";
import { getSugarHighTokens } from "../rich-text-editor/code-languages";
import { MentionText } from "../rich-text-editor/mention-text";
import {
  type ChatBlockquoteElement,
  type ChatCodeBlockElement,
  type ChatDateElement,
  type ChatElement,
  type ChatHeadingElement,
  type ChatInline,
  type ChatLinkElement,
  type ChatMentionElement,
  type ChatNode,
  type ChatParagraphElement,
  type ChatText,
  createEmptyValue,
  decodeChatValue,
  decodeChatValueFromJson,
  type Value,
} from "./chat-document";

export type { Value } from "./chat-document";

export interface ChatMessageContentProps {
  readonly className?: string;
  readonly mentionLabelsByParticipantId?: ReadonlyMap<string, string>;
  readonly value: Value;
}

function getSafeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function renderTextLeaf(node: ChatText, key: string) {
  let content: ReactNode = node.text.length > 0 ? node.text : <br />;

  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  if (node.code) {
    content = (
      <code className="rounded bg-muted px-[0.3em] py-[0.2em] font-mono text-[85%]">
        {content}
      </code>
    );
  }

  return <span key={key}>{content}</span>;
}

function renderInlineChildren(
  children: readonly ChatInline[],
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
) {
  return children.map((child, index) =>
    renderNode(child, `${key}-${index}`, resolveMentionLabel)
  );
}

function renderParagraph(
  element: ChatParagraphElement,
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
) {
  const children = renderInlineChildren(
    element.children,
    key,
    resolveMentionLabel
  );

  if (element.listStyleType) {
    const isOrdered = element.listStyleType === "decimal";
    const isTodo = element.listStyleType === "todo";
    const listItem = isTodo ? (
      <li className="flex items-start gap-2">
        <span className="mt-0.5 select-none">
          <input
            aria-label="Task complete"
            checked={element.checked ?? false}
            className="size-4"
            readOnly
            type="checkbox"
          />
        </span>
        <span className={element.checked ? "line-through opacity-60" : ""}>
          {children}
        </span>
      </li>
    ) : (
      <li>{children}</li>
    );

    if (isOrdered) {
      return (
        <ol
          className="relative m-0 list-decimal pl-6"
          key={key}
          start={element.listStart}
        >
          {listItem}
        </ol>
      );
    }

    return (
      <ul
        className={cn(
          "relative m-0",
          isTodo ? "list-none pl-0" : "list-disc pl-6"
        )}
        key={key}
      >
        {listItem}
      </ul>
    );
  }

  return (
    <p className="m-0" key={key}>
      {children}
    </p>
  );
}

function renderMention(
  element: ChatMentionElement,
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
) {
  return <MentionText key={key}>@{resolveMentionLabel(element)}</MentionText>;
}

function renderLink(
  element: ChatLinkElement,
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
) {
  const children = renderInlineChildren(
    element.children,
    key,
    resolveMentionLabel
  );
  const safeHref = getSafeHttpUrl(element.url);
  const className =
    "font-medium text-primary underline decoration-primary underline-offset-4";

  return safeHref ? (
    <a
      className={className}
      href={safeHref}
      key={key}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ) : (
    <span className={className} key={key}>
      {children}
    </span>
  );
}

function renderImage(
  element: Extract<ChatElement, { type: "img" }>,
  key: string
) {
  const safeUrl = getSafeHttpUrl(element.url);
  if (!safeUrl) return null;

  return (
    <div className="my-1" key={key}>
      <div className="inline-block">
        <img
          alt=""
          className="max-h-[200px] max-w-full rounded-md object-contain"
          draggable={false}
          src={safeUrl}
        />
      </div>
    </div>
  );
}

function renderBlockquote(
  element: ChatBlockquoteElement,
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
) {
  return (
    <blockquote
      className="my-2 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic"
      key={key}
    >
      {element.children.map((child, index) =>
        renderNode(child, `${key}-${index}`, resolveMentionLabel)
      )}
    </blockquote>
  );
}

function renderHeading(
  element: ChatHeadingElement,
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
) {
  const children = renderInlineChildren(
    element.children,
    key,
    resolveMentionLabel
  );

  if (element.type === "h1") {
    return (
      <h1 className="mb-1 mt-4 font-bold text-2xl" key={key}>
        {children}
      </h1>
    );
  }
  if (element.type === "h2") {
    return (
      <h2 className="mb-1 mt-3 font-bold text-xl" key={key}>
        {children}
      </h2>
    );
  }
  return (
    <h3 className="mb-1 mt-2 font-semibold text-lg" key={key}>
      {children}
    </h3>
  );
}

function renderDate(element: ChatDateElement, key: string) {
  return (
    <span
      className="inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm"
      key={key}
    >
      {element.date || "Pick a date"}
    </span>
  );
}

/* eslint-disable react-doctor/no-array-index-as-key -- Highlight tokens are stateless source-order spans. Position keys preserve text nodes and editor selection as their text changes. */
function renderHighlightedCode(code: string, language: string) {
  if (!code) return code;

  const tokens = getSugarHighTokens(code, language);
  if (!tokens) return code;

  return tokens.map(({ type, value }, index) => {
    return type !== "space" && type !== "break" ? (
      <span className={`sh-${type}`} key={`token-${index}`}>
        {value}
      </span>
    ) : (
      <Fragment key={`token-${index}`}>{value}</Fragment>
    );
  });
}
/* eslint-enable react-doctor/no-array-index-as-key */

function renderCodeBlock(element: ChatCodeBlockElement, key: string) {
  const language = element.lang || "plaintext";
  const code = element.children
    .map((line) => line.children.map((child) => child.text).join(""))
    .join("\n");

  return (
    <div className="my-1" key={key}>
      <div className="overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900/60">
        {language !== "plaintext" ? (
          <div className="flex select-none justify-end px-3 pt-2 text-neutral-400 text-xs leading-none dark:text-neutral-500">
            {language}
          </div>
        ) : null}
        <pre
          className={cn(
            "overflow-x-auto px-3 pb-2.5 font-mono text-[13px] leading-relaxed [tab-size:2] print:break-inside-avoid",
            language !== "plaintext" ? "pt-1.5" : "pt-2.5"
          )}
        >
          <code>{renderHighlightedCode(code, language)}</code>
        </pre>
      </div>
    </div>
  );
}

function renderNode(
  node: ChatNode,
  key: string,
  resolveMentionLabel: (mention: ChatMentionElement) => string
): ReactNode {
  if (!("type" in node)) return renderTextLeaf(node, key);

  switch (node.type) {
    case "p":
      return renderParagraph(node, key, resolveMentionLabel);
    case "mention":
      return renderMention(node, key, resolveMentionLabel);
    case "a":
      return renderLink(node, key, resolveMentionLabel);
    case "img":
      return renderImage(node, key);
    case "blockquote":
      return renderBlockquote(node, key, resolveMentionLabel);
    case "h1":
    case "h2":
    case "h3":
      return renderHeading(node, key, resolveMentionLabel);
    case "date":
      return renderDate(node, key);
    case "code_block":
      return renderCodeBlock(node, key);
    case "code_line":
      return (
        <Fragment key={key}>
          {node.children.map((child, index) =>
            renderTextLeaf(child, `${key}-${index}`)
          )}
        </Fragment>
      );
  }
}

export function parseChatContent(content: string): Value {
  if (!content) return createEmptyValue();

  try {
    const decoded = decodeChatValueFromJson(content);
    if (decoded) return decoded.length > 0 ? decoded : createEmptyValue();
  } catch {
    // Legacy chat bodies may be plain text.
  }

  return content.split("\n").map((line) => ({
    children: [{ text: line }],
    type: "p",
  }));
}

export function ChatMessageContent({
  className,
  mentionLabelsByParticipantId,
  value,
}: ChatMessageContentProps) {
  const decodedValue = useMemo(
    () => decodeChatValue(value) ?? createEmptyValue(),
    [value]
  );
  const resolveMentionLabel = (mention: ChatMentionElement) =>
    (mention.participantId
      ? mentionLabelsByParticipantId?.get(mention.participantId)
      : undefined
    )?.trim() || mention.value;

  return (
    <div className={className} data-slot="chat-message-rich-content">
      <div
        className={cn(
          "text-sm leading-relaxed",
          "[&_strong]:font-bold",
          "[&_em]:italic",
          "[&_u]:underline",
          "[&_s]:line-through"
        )}
      >
        {decodedValue.map((node, index) =>
          renderNode(node, `node-${index}`, resolveMentionLabel)
        )}
      </div>
    </div>
  );
}
