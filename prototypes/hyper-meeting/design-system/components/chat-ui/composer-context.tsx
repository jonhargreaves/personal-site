"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { useChatComposerController } from "./composer-controller";

export type ChatComposerContextValue = {
  readonly disabled: boolean;
  readonly onInsertLink?: () => void;
  readonly onOpenGif?: () => void;
  readonly onSend: () => void;
};

export type ChatComposerProviderProps = {
  readonly children: ReactNode;
  readonly value: ChatComposerContextValue;
};

const ChatComposerContext = createContext<ChatComposerContextValue | null>(
  null
);

export type ChatComposerEditorContextValue = ReturnType<
  typeof useChatComposerController
> & {
  readonly disabled: boolean;
  readonly disabledPlaceholder: string;
  readonly gifApiKey?: string;
  readonly placeholder: string;
  readonly placeholderText: string;
};

const ChatComposerEditorContext =
  createContext<ChatComposerEditorContextValue | null>(null);

export function ChatComposerEditorContextProvider({
  children,
  value,
}: {
  readonly children: ReactNode;
  readonly value: ChatComposerEditorContextValue;
}) {
  return (
    <ChatComposerEditorContext.Provider value={value}>
      {children}
    </ChatComposerEditorContext.Provider>
  );
}

export function ChatComposerProvider({
  children,
  value,
}: ChatComposerProviderProps) {
  return (
    <ChatComposerContext.Provider value={value}>
      {children}
    </ChatComposerContext.Provider>
  );
}

export function useOptionalChatComposer() {
  return useContext(ChatComposerContext);
}

export function useChatComposer(componentName = "chat composer component") {
  const composer = useOptionalChatComposer();

  if (!composer) {
    throw new Error(
      `${componentName} must be rendered inside ChatComposerProvider.`
    );
  }

  return composer;
}

export function useOptionalChatComposerEditor() {
  return useContext(ChatComposerEditorContext);
}

export function useChatComposerEditor(
  componentName = "chat composer editor component"
) {
  const composerEditor = useOptionalChatComposerEditor();
  if (!composerEditor) {
    throw new Error(
      `${componentName} must be rendered inside ChatComposerEditorProvider.`
    );
  }
  return composerEditor;
}
