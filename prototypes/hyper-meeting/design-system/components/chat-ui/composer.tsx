"use client";

import * as React from "react";

import * as Predicate from "../../lib/predicate";

import { cn } from "../../lib/utils";
import { GifBrowser } from "../gif-browser";
import type { ChatParticipant, Value } from "./chat-document";
import {
  ChatComposerEditorContextProvider,
  ChatComposerProvider,
  type ChatComposerContextValue,
  type ChatComposerEditorContextValue,
  useChatComposerEditor,
  useOptionalChatComposerEditor,
} from "./composer-context";
import {
  type ChatComposerControllerHandle,
  useChatComposerController,
} from "./composer-controller";
import { shouldFocusChatComposerInputFromPointerTarget } from "./composer-focus";
import {
  ChatComposerInputFrame,
  chatComposerInputEditableVariants,
  ChatComposerInputPlaceholder as ChatComposerInputPlaceholderPrimitive,
  ChatComposerInputRoot,
  ChatComposerInputScrollArea,
  ChatComposerInputToolbarSlot,
} from "./composer-primitives";
import { ChatComposerDocumentView } from "./composer-renderer";
import { ChatMentionList, ChatSlashCommandList } from "./suggestions";
import { ChatToolbar } from "./toolbar";

export type { ChatParticipant } from "./chat-document";
export type ChatComposerInputHandle = ChatComposerControllerHandle;

/**
 * The editor renders a <br/> inside empty blocks for copy-paste compatibility, which
 * pushes the cursor to line 2 while the placeholder sits on line 1.
 * Hide it only when the editor is empty (data-editor-empty) so that
 * Shift+Enter blank lines still work when there's real content.
 */
const EMPTY_BLOCK_BR_FIX = `[data-editor-empty] [data-editate-block] br { display: none; }`;

export interface ChatComposerInputProps {
  allowEmptySend?: boolean;
  autoFocus?: boolean;
  attachmentAccept?: string;
  attachmentMultiple?: boolean;
  attachments?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  gifApiKey?: string;
  onSend: (value: Value, options?: { readonly isEmpty: boolean }) => void;
  onSelectAttachments?: (files: readonly File[]) => void;
  participants?: ChatParticipant[];
  placeholder?: string;
  ref?: React.Ref<ChatComposerInputHandle>;
  toolbar?: React.ReactNode;
}

export type ChatComposerEditorProviderProps = Omit<
  ChatComposerInputProps,
  | "autoFocus"
  | "attachmentAccept"
  | "attachmentMultiple"
  | "attachments"
  | "className"
  | "onSelectAttachments"
> & {
  readonly children: React.ReactNode;
};

export type ChatComposerEditableProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "className" | "contentEditable" | "suppressContentEditableWarning"
> & {
  readonly className?: string;
  readonly ref?: React.Ref<HTMLDivElement>;
};

export type ChatComposerInputLayoutProps = Pick<
  ChatComposerInputProps,
  | "autoFocus"
  | "attachmentAccept"
  | "attachmentMultiple"
  | "attachments"
  | "className"
  | "onSelectAttachments"
  | "toolbar"
>;

export type ChatComposerPlaceholderProps = React.ComponentPropsWithoutRef<
  typeof ChatComposerInputPlaceholderPrimitive
>;

export function ChatComposerEditorProvider({
  allowEmptySend = false,
  children,
  disabled = false,
  disabledPlaceholder = "Chat is unavailable",
  gifApiKey,
  onSend,
  participants = [],
  placeholder = "Message everyone (@ to mention...)",
  ref,
}: ChatComposerEditorProviderProps) {
  const controller = useChatComposerController({
    allowEmptySend,
    disabled,
    gifApiKey,
    onSend,
    participants,
    ref,
  });

  const placeholderText = disabled ? disabledPlaceholder : placeholder;
  const conditionalValue1_0 = {
    disabled,
    onInsertLink: controller.handleInsertLink,
    onSend: controller.handleSubmit,
  };
  const conditionalValue1_1 = gifApiKey
    ? {
        ...conditionalValue1_0,
        onOpenGif: () => {
          controller.setGifBrowserOpen(true);
        },
      }
    : conditionalValue1_0;
  const composerActions =
    conditionalValue1_1 satisfies ChatComposerContextValue;
  const conditionalValue2_0 = {
    ...controller,
    disabled,
    disabledPlaceholder,
    placeholder,
    placeholderText,
  };
  const conditionalValue2_1 = gifApiKey
    ? {
        ...conditionalValue2_0,
        gifApiKey,
      }
    : conditionalValue2_0;
  const composerEditor =
    conditionalValue2_1 satisfies ChatComposerEditorContextValue;

  return (
    <ChatComposerEditorContextProvider value={composerEditor}>
      <ChatComposerProvider value={composerActions}>
        {children}
      </ChatComposerProvider>
    </ChatComposerEditorContextProvider>
  );
}

export { useChatComposerEditor, useOptionalChatComposerEditor };

export function ChatComposerGifBrowser() {
  const composerEditor = useChatComposerEditor("ChatComposerGifBrowser");

  if (!composerEditor.gifApiKey) {
    return null;
  }

  return (
    <GifBrowser
      apiKey={composerEditor.gifApiKey}
      onOpenChange={composerEditor.setGifBrowserOpen}
      onSelectGif={composerEditor.handleSelectGif}
      open={composerEditor.gifBrowserOpen}
    />
  );
}

export function ChatComposerPlaceholder({
  children,
  ...props
}: ChatComposerPlaceholderProps) {
  const composerEditor = useChatComposerEditor("ChatComposerPlaceholder");

  if (!composerEditor.showPlaceholder || !composerEditor.placeholderText) {
    return null;
  }

  return (
    <ChatComposerInputPlaceholderPrimitive {...props}>
      {children ?? composerEditor.placeholderText}
    </ChatComposerInputPlaceholderPrimitive>
  );
}

export function ChatComposerEmptyBlockFix() {
  return <style>{EMPTY_BLOCK_BR_FIX}</style>;
}

export function ChatComposerEditable({
  autoFocus,
  className,
  ref,
  spellCheck = true,
  ...props
}: ChatComposerEditableProps) {
  const composerEditor = useChatComposerEditor("ChatComposerEditable");
  const shouldAutoFocus = !composerEditor.disabled && (autoFocus ?? true);
  const elementRef = React.useRef<HTMLDivElement | null>(null);

  const assignRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      elementRef.current = element;
      if (Predicate.isFunction(ref)) {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [ref]
  );

  const { editor, setEditableElement, focusEditor } = composerEditor;
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    setEditableElement(element);
    const stopInput = editor.input(element);
    return () => {
      stopInput();
      setEditableElement(null);
    };
  }, [editor, setEditableElement]);

  React.useEffect(() => {
    if (shouldAutoFocus) {
      focusEditor();
    }
  }, [focusEditor, shouldAutoFocus]);

  return (
    <div
      aria-label={composerEditor.placeholderText || "Chat message"}
      className={cn(chatComposerInputEditableVariants(), className)}
      contentEditable={!composerEditor.disabled}
      data-slot="chat-composer-editable"
      ref={assignRef}
      spellCheck={spellCheck}
      suppressContentEditableWarning
      {...props}
    >
      <ChatComposerDocumentView
        document={composerEditor.document}
        onRemoveImage={composerEditor.handleRemoveImage}
      />
    </div>
  );
}

export function ChatComposerSlashSuggestions() {
  const composerEditor = useChatComposerEditor("ChatComposerSlashSuggestions");

  if (!composerEditor.showSlash) {
    return null;
  }

  return (
    <ChatSlashCommandList
      anchor={composerEditor.slashAnchor}
      commands={composerEditor.filteredSlashCommands}
      onDismiss={composerEditor.dismissSlash}
      onSelect={composerEditor.executeSlashCommand}
      selectedIndex={composerEditor.slashIndex}
    />
  );
}

export function ChatComposerMentionSuggestions() {
  const composerEditor = useChatComposerEditor(
    "ChatComposerMentionSuggestions"
  );

  if (!composerEditor.showMention) {
    return null;
  }

  return (
    <ChatMentionList
      anchor={composerEditor.mentionAnchor}
      onDismiss={composerEditor.dismissMention}
      onSelect={composerEditor.selectMention}
      participants={composerEditor.filteredParticipants}
      selectedIndex={composerEditor.mentionIndex}
    />
  );
}

export function ChatComposerSuggestions() {
  return (
    <>
      <ChatComposerSlashSuggestions />
      <ChatComposerMentionSuggestions />
    </>
  );
}

export function ChatComposerInputLayout({
  autoFocus,
  attachmentAccept,
  attachmentMultiple,
  attachments,
  className,
  onSelectAttachments,
  toolbar,
}: ChatComposerInputLayoutProps) {
  const composerEditor = useChatComposerEditor("ChatComposerInputLayout");
  const handleFiles = (files: FileList) => {
    if (!onSelectAttachments || files.length === 0) {
      return false;
    }

    onSelectAttachments([...files]);
    return true;
  };
  const resolvedToolbar = toolbar ?? (
    <ChatToolbar
      attachmentAccept={attachmentAccept}
      attachmentMultiple={attachmentMultiple}
      onSelectAttachments={onSelectAttachments}
    />
  );

  return (
    <ChatComposerInputRoot
      className={className}
      onDragOverCapture={(event) => {
        if (
          !composerEditor.disabled &&
          onSelectAttachments &&
          event.dataTransfer.types.includes("Files")
        ) {
          event.preventDefault();
        }
      }}
      onDropCapture={(event) => {
        if (
          !composerEditor.disabled &&
          event.dataTransfer.types.includes("Files") &&
          handleFiles(event.dataTransfer.files)
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onPasteCapture={(event) => {
        if (
          !composerEditor.disabled &&
          handleFiles(event.clipboardData.files)
        ) {
          event.preventDefault();
        }
      }}
    >
      {attachments}
      <ChatComposerInputScrollArea
        disabled={composerEditor.disabled}
        onPointerDown={(event) => {
          if (composerEditor.disabled) {
            return;
          }

          if (shouldFocusChatComposerInputFromPointerTarget(event.target)) {
            event.preventDefault();
          }

          composerEditor.focusEditor();
        }}
      >
        <ChatComposerInputFrame
          showPlaceholder={composerEditor.showPlaceholder}
        >
          <ChatComposerEmptyBlockFix />
          <ChatComposerPlaceholder />
          <ChatComposerEditable autoFocus={autoFocus} />
        </ChatComposerInputFrame>
      </ChatComposerInputScrollArea>

      <ChatComposerInputToolbarSlot>
        {resolvedToolbar}
      </ChatComposerInputToolbarSlot>
    </ChatComposerInputRoot>
  );
}

export function ChatComposerInput({
  autoFocus,
  attachmentAccept,
  attachmentMultiple,
  attachments,
  className,
  onSelectAttachments,
  toolbar,
  ...props
}: ChatComposerInputProps) {
  return (
    <ChatComposerEditorProvider {...props}>
      <ChatComposerGifBrowser />
      <ChatComposerInputLayout
        autoFocus={autoFocus}
        attachmentAccept={attachmentAccept}
        attachmentMultiple={attachmentMultiple}
        attachments={attachments}
        className={className}
        onSelectAttachments={onSelectAttachments}
        toolbar={toolbar}
      />
      <ChatComposerSuggestions />
    </ChatComposerEditorProvider>
  );
}
