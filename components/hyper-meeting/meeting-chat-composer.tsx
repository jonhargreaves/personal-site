import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/vendor/hyper-ui/ui/components/popover";
import {
  ChatComposerEditable,
  ChatComposerEditorProvider,
  ChatComposerEmptyBlockFix,
  ChatComposerPlaceholder,
  ChatComposerSuggestions,
  useChatComposerEditor,
} from "@/vendor/hyper-ui/ui/components/chat-ui/composer";
import { ChatComposerInputFrame, ChatComposerInputRoot, ChatComposerInputScrollArea, ChatComposerInputToolbarSlot } from "@/vendor/hyper-ui/ui/components/chat-ui/composer-primitives";
import { ChatEmojiPicker, preloadChatEmojiPicker } from "@/vendor/hyper-ui/ui/components/chat-ui/emoji-picker";
import { ChatToolbarGroup, ChatToolbarRoot } from "@/vendor/hyper-ui/ui/components/chat-ui/toolbar";
import { ChatToolbarAttachmentButton, ChatToolbarIconButton, ChatToolbarSendButton } from "@/vendor/hyper-ui/ui/components/chat-ui/toolbar-actions";
import type { Value } from "@/vendor/hyper-ui/ui/components/chat-ui/chat-document";
import { isEffectivelyEmpty } from "@/vendor/hyper-ui/ui/components/rich-text-editor/types";
import { participants } from "./participants";
import MeetingChatAttachments from "./meeting-chat-attachments";
import ComposerIcon from "./meeting-chat-composer-icon";
import { MeetingChatFormatting, MeetingChatSelectionToolbar } from "./meeting-chat-formatting";
import styles from "./meeting-chat-composer.module.css";

const chatParticipants = participants.map((person) => ({ id: person.layoutId, name: person.displayName }));

function ComposerLayout({ files, onFiles, onRemove }: { files: readonly File[]; onFiles: (files: readonly File[]) => void; onRemove: (index: number) => void }) {
  const editor = useChatComposerEditor();
  const editableRef = useRef<HTMLDivElement>(null);
  const [formattingOpen, setFormattingOpen] = useState(true);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const canSend = files.length > 0 || !isEffectivelyEmpty(editor.value);
  return (
    <>
      <ChatComposerInputRoot className={styles.root}>
        {files.length ? <MeetingChatAttachments files={files} onRemove={onRemove} /> : null}
        {formattingOpen ? (
          <ChatComposerInputToolbarSlot id="hyper-chat-formatting">
            <ChatToolbarRoot role="toolbar" aria-label="Message formatting" className={styles.toolbar}><MeetingChatFormatting /></ChatToolbarRoot>
          </ChatComposerInputToolbarSlot>
        ) : null}
        <ChatComposerInputScrollArea className={styles.scrollArea} onPointerDown={(event) => {
          // Preserve the caret on padding clicks; native selection handles text itself.
          if (event.target === event.currentTarget) { event.preventDefault(); editor.focusEditor(); }
        }}>
          <ChatComposerInputFrame className={styles.frame} showPlaceholder={editor.showPlaceholder}>
            <ChatComposerEmptyBlockFix />
            <ChatComposerPlaceholder className={styles.placeholder} />
            <ChatComposerEditable ref={editableRef} role="textbox" aria-multiline="true" aria-keyshortcuts="Alt+F10" autoFocus={false} className={styles.editable} onKeyDown={(event) => {
              if (!formattingOpen && !event.defaultPrevented && event.key === "Escape" && !window.getSelection()?.isCollapsed) {
                event.preventDefault();
                event.stopPropagation();
                window.getSelection()?.collapseToEnd();
              }
              if (event.altKey && event.key === "F10") {
                const toolbar = document.querySelector<HTMLElement>('[data-slot="chat-composer-selection-toolbar"]') ?? document.getElementById("hyper-chat-formatting");
                const button = toolbar?.querySelector<HTMLButtonElement>("button");
                if (button) { event.preventDefault(); button.focus(); }
              }
            }} />
          </ChatComposerInputFrame>
        </ChatComposerInputScrollArea>
        <ChatComposerInputToolbarSlot>
          <ChatToolbarRoot className={styles.toolbar}>
            <ChatToolbarGroup className={styles.controls}>
              <ChatToolbarAttachmentButton onSelectFiles={onFiles}><ComposerIcon name="add" /></ChatToolbarAttachmentButton>
              <ChatToolbarIconButton tooltip="Text formatting" pressed={formattingOpen} aria-controls={formattingOpen ? "hyper-chat-formatting" : undefined} onMouseDown={(event) => event.preventDefault()} onClick={() => setFormattingOpen((open) => !open)}>
                <ComposerIcon name="formatting" />
              </ChatToolbarIconButton>
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <ChatToolbarIconButton tooltip="Emoji" pressed={emojiOpen} onPointerEnter={preloadChatEmojiPicker} onFocus={preloadChatEmojiPicker}><ComposerIcon name="emoji" /></ChatToolbarIconButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" side="top" sideOffset={8}>
                  <ChatEmojiPicker onEmojiSelect={({ emoji }) => { editor.insertText(emoji); setEmojiOpen(false); }} />
                </PopoverContent>
              </Popover>
              <ChatToolbarIconButton tooltip="Mention someone" onMouseDown={(event) => event.preventDefault()} onClick={() => editor.insertText("@")}><ComposerIcon name="mention" /></ChatToolbarIconButton>
            </ChatToolbarGroup>
            <ChatToolbarSendButton aria-label="Send message" disabled={!canSend} className={styles.send}><ComposerIcon key="send" name="send" /></ChatToolbarSendButton>
          </ChatToolbarRoot>
        </ChatComposerInputToolbarSlot>
      </ChatComposerInputRoot>
      <MeetingChatSelectionToolbar enabled={!formattingOpen} editableRef={editableRef} />
      <ChatComposerSuggestions />
    </>
  );
}

export default function MeetingChatComposer({ onSend }: { onSend: (value: Value, files?: readonly File[]) => void }) {
  const [files, setFiles] = useState<readonly File[]>([]);
  return (
    <ChatComposerEditorProvider
      onSend={(value) => { onSend(value, files); setFiles([]); }}
      allowEmptySend={files.length > 0}
      participants={chatParticipants}
      placeholder="Message everyone…"
    >
      <ComposerLayout files={files} onFiles={(added) => setFiles((current) => [...current, ...added])} onRemove={(index) => setFiles((current) => current.filter((_, i) => i !== index))} />
    </ChatComposerEditorProvider>
  );
}
