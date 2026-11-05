import { useEffect, useState, type RefObject } from "react";
import { Popover, PopoverContent } from "@/vendor/hyper-ui/ui/components/popover";
import { useChatComposerEditor } from "@/vendor/hyper-ui/ui/components/chat-ui/composer";
import { ChatToolbarGroup } from "@/vendor/hyper-ui/ui/components/chat-ui/toolbar";
import { ChatToolbarIconButton, ChatToolbarInsertLinkButton, ChatToolbarMarkButton } from "@/vendor/hyper-ui/ui/components/chat-ui/toolbar-actions";
import ComposerIcon from "./meeting-chat-composer-icon";
import styles from "./meeting-chat-composer.module.css";

export function MeetingChatFormatting() {
  const editor = useChatComposerEditor();
  return (
    <ChatToolbarGroup className={styles.controls} aria-label="Message formatting" onKeyDown={(event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
      const index = buttons.indexOf(event.target as HTMLButtonElement);
      if (index < 0) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }}>
      <ChatToolbarMarkButton format="bold" tooltip="Bold"><ComposerIcon name="bold" /></ChatToolbarMarkButton>
      <ChatToolbarMarkButton format="italic" tooltip="Italic"><ComposerIcon name="italic" /></ChatToolbarMarkButton>
      <ChatToolbarMarkButton format="underline" tooltip="Underline"><ComposerIcon name="underline" /></ChatToolbarMarkButton>
      <ChatToolbarMarkButton format="strikethrough" tooltip="Strikethrough"><ComposerIcon name="strikethrough" /></ChatToolbarMarkButton>
      <span aria-hidden="true" className={styles.divider} />
      <ChatToolbarInsertLinkButton><ComposerIcon name="link" /></ChatToolbarInsertLinkButton>
      {(["decimal", "disc"] as const).map((type) => (
        <ChatToolbarIconButton
          key={type}
          tooltip={type === "decimal" ? "Numbered list" : "Bulleted list"}
          pressed={editor.listStyleType === type}
          onMouseDown={(event) => { if (event.button === 0) { event.preventDefault(); editor.toggleList(type); } }}
          onClick={(event) => { if (event.detail === 0) editor.toggleList(type); }}
        ><ComposerIcon name={type === "decimal" ? "numbered-list" : "bulleted-list"} /></ChatToolbarIconButton>
      ))}
      <ChatToolbarIconButton
        tooltip="Code block"
        pressed={editor.isInsideCodeBlock}
        onMouseDown={(event) => { if (event.button === 0) { event.preventDefault(); editor.toggleCodeBlock(); } }}
        onClick={(event) => { if (event.detail === 0) editor.toggleCodeBlock(); }}
      ><ComposerIcon name="code" /></ChatToolbarIconButton>
    </ChatToolbarGroup>
  );
}

export function MeetingChatSelectionToolbar({ enabled, editableRef }: {
  enabled: boolean;
  editableRef: RefObject<HTMLDivElement | null>;
}) {
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const selection = window.getSelection();
      const editable = editableRef.current;
      if (!selection || !editable || selection.isCollapsed || selection.rangeCount === 0 || !editable.contains(selection.anchorNode) || !editable.contains(selection.focusNode)) {
        setSelectionRect(null);
        return;
      }
      setSelectionRect(selection.getRangeAt(0).getBoundingClientRect());
    };
    document.addEventListener("selectionchange", update);
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", update);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [enabled, editableRef]);
  if (!enabled || !selectionRect) return null;
  const dismiss = () => {
    window.getSelection()?.collapseToEnd();
    setSelectionRect(null);
  };
  return (
    <Popover open onOpenChange={(open) => { if (!open) dismiss(); }}>
      <PopoverContent
        anchor={{ getBoundingClientRect: () => selectionRect }}
        role="toolbar"
        aria-label="Selected text formatting"
        data-slot="chat-composer-selection-toolbar"
        className={styles.floatingToolbar}
        side="top"
        align="center"
        sideOffset={8}
        collisionPadding={8}
        initialFocus={false}
        finalFocus={false}
        onMouseDown={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            dismiss();
            editableRef.current?.focus({ preventScroll: true });
          }
        }}
      ><MeetingChatFormatting /></PopoverContent>
    </Popover>
  );
}
