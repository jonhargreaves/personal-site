/* eslint-disable @next/next/no-img-element -- Editor and GIF images use user-supplied/blob URLs with intrinsic dimensions. */
"use client";

import { Fragment, type MouseEvent, type ReactNode } from "react";

import { HugeDelete02Stroke } from "../../icons/index";

import { cn } from "../../lib/utils";
import { getSugarHighTokens } from "../rich-text-editor/code-languages";
import { MentionText } from "../rich-text-editor/mention-text";
import type {
  ChatComposerBlock,
  ChatComposerDocument,
  ChatComposerImage,
  ChatComposerInline,
  ChatComposerText,
} from "./chat-document";

function renderCodeText(text: string, language: string) {
  if (!text) return <br />;

  const tokens = getSugarHighTokens(text, language);
  if (!tokens) return text;

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

function renderText(node: ChatComposerText, key: string, language?: string) {
  let content: ReactNode = language
    ? renderCodeText(node.text, language)
    : node.text || <br />;

  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  if (node.code && !language) {
    content = (
      <code className="rounded bg-muted px-[0.3em] py-[0.2em] font-mono text-[85%]">
        {content}
      </code>
    );
  }
  if (node.link) {
    content = (
      <a
        className="font-medium text-primary underline decoration-primary underline-offset-4"
        href={node.link}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
        }}
        rel="noopener noreferrer"
        tabIndex={-1}
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return <span key={key}>{content}</span>;
}

function renderInline(
  inline: ChatComposerInline,
  key: string,
  language?: string,
  onRemoveImage?: (image: ChatComposerImage) => void
) {
  if ("text" in inline) return renderText(inline, key, language);

  switch (inline.type) {
    case "mention":
      return (
        <MentionText contentEditable={false} key={key}>
          @{inline.value}
        </MentionText>
      );
    case "date":
      return (
        <span
          className="inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm"
          contentEditable={false}
          key={key}
        >
          {inline.date || "Pick a date"}
        </span>
      );
    case "img":
      return (
        <span
          className="group relative my-1 inline-block"
          contentEditable={false}
          key={key}
        >
          <img
            alt=""
            className="max-h-[200px] max-w-full rounded-md object-contain"
            draggable={false}
            src={inline.url}
          />
          {onRemoveImage ? (
            <button
              aria-label="Remove image"
              className="pointer-events-none absolute -right-2 -top-2 z-10 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity hover:bg-destructive/90 focus:pointer-events-auto focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 group-hover:pointer-events-auto group-hover:opacity-100"
              contentEditable={false}
              onClick={() => onRemoveImage(inline)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              <HugeDelete02Stroke className="size-3" />
            </button>
          ) : null}
        </span>
      );
  }
}

function blockClassName({
  block,
  isFirstCodeLine,
  isLastCodeLine,
}: {
  readonly block: ChatComposerBlock;
  readonly isFirstCodeLine: boolean;
  readonly isLastCodeLine: boolean;
}) {
  if (block.type === "code_line") {
    const hasLanguage =
      isFirstCodeLine && block.lang && block.lang !== "plaintext";
    return cn(
      "min-h-5 bg-neutral-100 px-3 font-mono text-[13px] leading-relaxed [tab-size:2] dark:bg-neutral-900/60",
      isFirstCodeLine && "mt-1 rounded-t-lg",
      isLastCodeLine && "mb-1 rounded-b-lg pb-2.5",
      isFirstCodeLine && (hasLanguage ? "pt-6" : "pt-2.5"),
      hasLanguage &&
        "relative before:pointer-events-none before:absolute before:right-3 before:top-2 before:select-none before:text-neutral-400 before:text-xs before:leading-none before:content-[attr(data-language)] dark:before:text-neutral-500"
    );
  }
  if (block.type === "blockquote") {
    return "my-2 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic";
  }
  if (block.type === "h1") return "mb-1 mt-4 font-bold text-2xl";
  if (block.type === "h2") return "mb-1 mt-3 font-bold text-xl";
  if (block.type === "h3") return "mb-1 mt-2 font-semibold text-lg";
  if (block.listStyleType === "todo") {
    return cn(
      "relative m-0 pl-6 before:absolute before:left-0 before:select-none",
      block.checked
        ? "line-through opacity-60 before:content-['☑']"
        : "before:content-['☐']",
      block.className
    );
  }
  if (block.listStyleType === "decimal") {
    return cn(
      "relative m-0 pl-6 before:absolute before:left-1 before:content-['1.']",
      block.className
    );
  }
  if (block.listStyleType === "disc") {
    return cn(
      "relative m-0 pl-6 before:absolute before:left-1 before:content-['•']",
      block.className
    );
  }
  return cn("relative m-0", block.className);
}

function shouldShowBlockPlaceholder(block: ChatComposerBlock) {
  return Boolean(
    block.placeholder &&
    block.type === "p" &&
    block.children.every(
      (inline) => "text" in inline && inline.text.length === 0
    )
  );
}

export function ChatComposerDocumentView({
  document,
  onRemoveImage,
}: {
  readonly document: ChatComposerDocument;
  readonly onRemoveImage?: (image: ChatComposerImage) => void;
}) {
  return document.children.map((block, blockIndex) => {
    const previous = document.children[blockIndex - 1];
    const next = document.children[blockIndex + 1];
    const isFirstCodeLine =
      block.type === "code_line" &&
      (previous?.type !== "code_line" ||
        previous.codeBlockId !== block.codeBlockId);
    const isLastCodeLine =
      block.type === "code_line" &&
      (next?.type !== "code_line" || next.codeBlockId !== block.codeBlockId);
    const language =
      block.type === "code_line" ? (block.lang ?? "plaintext") : undefined;

    return (
      <div
        className={blockClassName({
          block,
          isFirstCodeLine,
          isLastCodeLine,
        })}
        data-editate-block=""
        data-language={isFirstCodeLine ? language : undefined}
        data-type={block.type}
        key={`block-${blockIndex}`}
      >
        {shouldShowBlockPlaceholder(block) ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none text-muted-foreground/70"
            contentEditable={false}
            data-slot="notes-editor-block-placeholder"
          >
            {block.placeholder}
          </span>
        ) : null}
        {block.children.map((inline, inlineIndex) =>
          renderInline(inline, `inline-${inlineIndex}`, language, onRemoveImage)
        )}
      </div>
    );
  });
}
