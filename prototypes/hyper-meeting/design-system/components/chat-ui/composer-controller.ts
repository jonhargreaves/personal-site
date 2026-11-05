"use client";

import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  chatComposerDocumentToValue,
  type ChatParticipant,
  isChatComposerDocumentEmpty,
  shouldShowChatComposerPlaceholder,
  type Value,
} from "./chat-document";
import {
  createChatComposerEditor,
  getChatComposerBlock,
  getChatComposerCodeLanguage,
  getChatComposerFormatState,
  insertChatComposerImage,
  insertChatComposerLink,
  insertChatComposerText,
  isChatComposerInsideCodeBlock,
  resetChatComposerEditor,
  removeChatComposerImage,
  setChatComposerCodeLanguage,
  syncChatComposerFormatsFromSelection,
  type ChatComposerEditor,
  type ChatComposerFormat,
  toggleChatComposerCodeBlock,
  toggleChatComposerFormat,
  toggleChatComposerList,
} from "./composer-editor";
import { handleChatComposerKeyDown } from "./composer-keydown";
import { useChatComposerSuggestionController } from "./composer-suggestion-controller";

export type ChatComposerControllerHandle = {
  focus: () => void;
  reset: () => void;
};

export type ChatComposerControllerOptions = {
  readonly allowEmptySend: boolean;
  readonly disabled: boolean;
  readonly gifApiKey?: string;
  readonly onSend: (
    value: Value,
    options?: { readonly isEmpty: boolean }
  ) => void;
  readonly participants: readonly ChatParticipant[];
  readonly ref?: Ref<ChatComposerControllerHandle>;
};

export function useChatComposerController({
  allowEmptySend,
  disabled,
  gifApiKey,
  onSend,
  participants,
  ref,
}: ChatComposerControllerOptions) {
  const [editor] = useState<ChatComposerEditor>(createChatComposerEditor);
  const [document, setDocument] = useState(editor.doc);
  const [formatState, setFormatState] = useState(() =>
    getChatComposerFormatState(editor)
  );
  const [gifBrowserOpen, setGifBrowserOpen] = useState(false);
  const editableElementRef = useRef<HTMLDivElement | null>(null);

  const focusEditor = useCallback(() => {
    editableElementRef.current?.focus({ preventScroll: true });
  }, []);
  const setEditableElement = useCallback((element: HTMLDivElement | null) => {
    editableElementRef.current = element;
  }, []);
  const openGifBrowser = useCallback(() => setGifBrowserOpen(true), []);

  const suggestions = useChatComposerSuggestionController({
    editor,
    focusEditor,
    gifApiKey,
    onOpenGifBrowser: openGifBrowser,
    participants,
  });
  const {
    dismissMention,
    dismissSlash,
    executeSlashCommand,
    filteredParticipants,
    filteredSlashCommands,
    handleSuggestionKeyDown,
    mentionAnchor,
    mentionIndex,
    selectMention,
    showMention,
    showSlash,
    slashAnchor,
    slashIndex,
    updateSuggestionsFromSelection,
  } = suggestions;

  const syncFormatState = useCallback(() => {
    setFormatState({ ...syncChatComposerFormatsFromSelection(editor) });
  }, [editor]);

  useEffect(() => {
    // Editate is an imperative external editor, not React state data.
    // eslint-disable-next-line react-hooks/immutability
    editor.readonly = disabled;
  }, [disabled, editor]);

  useEffect(() => {
    const onChange = () => {
      setDocument(editor.doc);
      updateSuggestionsFromSelection();
    };
    const onSelectionChange = () => {
      syncFormatState();
      updateSuggestionsFromSelection();
    };
    const stopChange = editor.on("change", onChange);
    const stopSelectionChange = editor.on("selectionchange", onSelectionChange);
    return () => {
      stopChange();
      stopSelectionChange();
    };
  }, [editor, syncFormatState, updateSuggestionsFromSelection]);

  const resetEditor = useCallback(() => {
    resetChatComposerEditor(editor);
    setDocument(editor.doc);
    setFormatState({ ...getChatComposerFormatState(editor) });
  }, [editor]);

  useImperativeHandle(ref, () => ({ focus: focusEditor, reset: resetEditor }), [
    focusEditor,
    resetEditor,
  ]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    const isEmpty = isChatComposerDocumentEmpty(editor.doc);
    if (!isEmpty || allowEmptySend) {
      onSend(chatComposerDocumentToValue(editor.doc), { isEmpty });
      resetEditor();
    }
  }, [allowEmptySend, disabled, editor, onSend, resetEditor]);

  const notifyFormatChange = useCallback(() => {
    setFormatState({ ...getChatComposerFormatState(editor) });
  }, [editor]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) =>
      handleChatComposerKeyDown(event, {
        disabled,
        editor,
        focusEditor,
        handleSubmit,
        handleSuggestionKeyDown,
        onFormatChange: notifyFormatChange,
      }),
    [
      disabled,
      editor,
      focusEditor,
      handleSubmit,
      handleSuggestionKeyDown,
      notifyFormatChange,
    ]
  );

  useEffect(
    () => editor.hook("keyboard", handleKeyDown),
    [editor, handleKeyDown]
  );

  const handleSelectGif = useCallback(
    (gifUrl: string) => {
      setGifBrowserOpen(false);
      setTimeout(() => {
        focusEditor();
        if (!insertChatComposerImage(editor, gifUrl)) {
          console.warn(
            "GIF URL rejected: must be http(s)",
            gifUrl.slice(0, 50)
          );
        }
      }, 100);
    },
    [editor, focusEditor]
  );

  const handleInsertLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    if (!insertChatComposerLink(editor, url)) {
      window.alert("Please enter a valid http(s) URL.");
      return;
    }
    focusEditor();
  }, [editor, focusEditor]);

  const handleRemoveImage = useCallback(
    (image: Parameters<typeof removeChatComposerImage>[1]) => {
      removeChatComposerImage(editor, image);
      focusEditor();
    },
    [editor, focusEditor]
  );

  const toggleFormat = useCallback(
    (format: ChatComposerFormat) => {
      setFormatState({ ...toggleChatComposerFormat(editor, format) });
      focusEditor();
    },
    [editor, focusEditor]
  );
  const toggleCodeBlock = useCallback(() => {
    toggleChatComposerCodeBlock(editor);
    focusEditor();
  }, [editor, focusEditor]);
  const toggleList = useCallback(
    (listStyleType: "decimal" | "disc" | "todo") => {
      toggleChatComposerList(editor, listStyleType);
      focusEditor();
    },
    [editor, focusEditor]
  );
  const insertText = useCallback(
    (text: string) => {
      insertChatComposerText(editor, text);
      focusEditor();
    },
    [editor, focusEditor]
  );
  const setCodeLanguage = useCallback(
    (language: string) => {
      setChatComposerCodeLanguage(editor, language);
      focusEditor();
    },
    [editor, focusEditor]
  );

  const value = useMemo(
    () => chatComposerDocumentToValue(document),
    [document]
  );
  const currentBlock = getChatComposerBlock(editor);

  return {
    activeFormats: formatState,
    currentCodeLanguage: getChatComposerCodeLanguage(editor),
    dismissMention,
    dismissSlash,
    document,
    editor,
    executeSlashCommand,
    filteredParticipants,
    filteredSlashCommands,
    focusEditor,
    gifBrowserOpen,
    handleInsertLink,
    handleRemoveImage,
    handleSelectGif,
    handleSubmit,
    insertText,
    isInsideCodeBlock: isChatComposerInsideCodeBlock(editor),
    listStyleType: currentBlock.listStyleType,
    mentionAnchor,
    mentionIndex,
    selectMention,
    setCodeLanguage,
    setEditableElement,
    setGifBrowserOpen,
    showMention,
    showPlaceholder: shouldShowChatComposerPlaceholder(document),
    showSlash,
    slashAnchor,
    slashIndex,
    toggleCodeBlock,
    toggleFormat,
    toggleList,
    value,
  };
}
