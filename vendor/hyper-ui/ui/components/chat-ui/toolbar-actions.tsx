"use client";

import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import {
  LucideChevronDown,
  LucideCode2,
  LucideImage,
  LucideLink,
  LucideList,
  LucideListOrdered,
  LucideListTodo,
  LucideSend,
  LucideSmile,
  LucideSquare,
  LucideUpload,
} from "../../../icons/index";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu-primitives";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  CODE_LANGUAGE_OPTIONS,
  getCodeLanguageLabel,
} from "../rich-text-editor/code-languages";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import {
  useChatComposerEditor,
  useOptionalChatComposer,
} from "./composer-context";
import type { ChatComposerFormat } from "./composer-editor";
import { ChatEmojiPicker, preloadChatEmojiPicker } from "./emoji-picker";
import {
  chatToolbarIconButtonVariants,
  chatToolbarSendButtonVariants,
} from "./toolbar-variants";

function useChatToolbarEditor(componentName: string) {
  return useChatComposerEditor(componentName);
}

export type ChatToolbarIconButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    readonly pressed?: boolean;
    readonly tooltip?: string;
  };

export function ChatToolbarIconButton({
  children,
  className,
  disabled,
  pressed,
  tooltip,
  ...props
}: ChatToolbarIconButtonProps) {
  const button = (
    <button
      aria-label={tooltip}
      aria-pressed={pressed}
      className={cn(chatToolbarIconButtonVariants({ pressed }), className)}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export type ChatToolbarInsertLinkButtonProps = ChatToolbarIconButtonProps & {
  readonly onInsertLink?: () => void;
};

export function ChatToolbarInsertLinkButton({
  children,
  disabled,
  onClick,
  onInsertLink,
  onMouseDown,
  tooltip = "Link",
  ...props
}: ChatToolbarInsertLinkButtonProps) {
  const composer = useOptionalChatComposer();
  const resolvedDisabled = disabled ?? composer?.disabled ?? false;
  const resolvedOnInsertLink = onInsertLink ?? composer?.onInsertLink;

  return (
    <ChatToolbarIconButton
      disabled={resolvedDisabled}
      onClick={(event) => {
        onClick?.(event);
        // Pointer activation happens on mousedown to retain editor selection.
        // Keyboard and assistive-technology clicks do not emit that event.
        if (!event.defaultPrevented && event.detail === 0) {
          resolvedOnInsertLink?.();
        }
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        if (event.defaultPrevented || event.button !== 0) {
          return;
        }
        event.preventDefault();
        resolvedOnInsertLink?.();
      }}
      tooltip={tooltip}
      {...props}
    >
      {children ?? <LucideLink />}
    </ChatToolbarIconButton>
  );
}

export type ChatToolbarAttachmentButtonProps = ChatToolbarIconButtonProps & {
  readonly accept?: string;
  readonly multiple?: boolean;
  readonly onSelectFiles: (files: readonly File[]) => void;
};

export function ChatToolbarAttachmentButton({
  accept,
  children,
  disabled,
  multiple = true,
  onSelectFiles,
  tooltip = "Add files",
  ...props
}: ChatToolbarAttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        accept={accept}
        aria-label="Attach files"
        className="sr-only"
        data-hyper-elid="chat-file-input"
        disabled={disabled}
        multiple={multiple}
        onChange={(event) => {
          const files = [...(event.currentTarget.files ?? [])];
          event.currentTarget.value = "";
          if (files.length > 0) {
            onSelectFiles(files);
          }
        }}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
      <ChatToolbarIconButton
        aria-label="Add files"
        data-hyper-elid="chat-add-files"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        tooltip={tooltip}
        {...props}
      >
        {children ?? <LucideUpload />}
      </ChatToolbarIconButton>
    </>
  );
}

export type ChatToolbarGifButtonProps = ChatToolbarIconButtonProps & {
  readonly onOpenGif?: () => void;
};

export function ChatToolbarGifButton({
  children,
  disabled,
  onClick,
  onMouseDown,
  onOpenGif,
  tooltip = "Insert GIF",
  ...props
}: ChatToolbarGifButtonProps) {
  const composer = useOptionalChatComposer();
  const resolvedDisabled = disabled ?? composer?.disabled ?? false;
  const resolvedOnOpenGif = onOpenGif ?? composer?.onOpenGif;

  if (!resolvedOnOpenGif) {
    return null;
  }

  return (
    <ChatToolbarIconButton
      disabled={resolvedDisabled}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        resolvedOnOpenGif();
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        if (event.defaultPrevented) {
          return;
        }
        event.preventDefault();
      }}
      tooltip={tooltip}
      {...props}
    >
      {children ?? <LucideImage className="h-4 w-4" />}
    </ChatToolbarIconButton>
  );
}

export type ChatToolbarSendButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "onClick" | "size" | "variant"
> & {
  readonly onSend?: () => void;
};

export function ChatToolbarSendButton({
  children,
  className,
  disabled,
  onSend,
  type,
  ...props
}: ChatToolbarSendButtonProps) {
  const composer = useOptionalChatComposer();
  const resolvedDisabled = disabled ?? composer?.disabled ?? false;
  const resolvedOnSend = onSend ?? composer?.onSend;
  const buttonType = type ?? "submit";

  if (!resolvedOnSend) {
    throw new Error(
      "ChatToolbarSendButton requires onSend or must be rendered inside ChatComposerProvider."
    );
  }

  return (
    <Button
      className={cn(chatToolbarSendButtonVariants(), className)}
      disabled={resolvedDisabled}
      onClick={(event) => {
        const submitsChatComposerForm =
          buttonType === "submit" &&
          event.currentTarget.form?.getAttribute("data-slot") ===
            "chat-composer-input-root";

        if (submitsChatComposerForm) {
          return;
        }

        event.preventDefault();
        resolvedOnSend();
      }}
      size="sm"
      type={buttonType}
      variant="ghost"
      {...props}
    >
      {children ?? (
        <>
          <LucideSend className="size-4" />
          <span className="sr-only">Send</span>
        </>
      )}
    </Button>
  );
}

export type ChatToolbarStopButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "size" | "variant"
>;

/**
 * Streaming counterpart to ChatToolbarSendButton: same footprint, stop
 * square. Swap it in while a response is generating.
 */
export function ChatToolbarStopButton({
  children,
  className,
  type = "button",
  ...props
}: ChatToolbarStopButtonProps) {
  return (
    <Button
      className={cn(chatToolbarSendButtonVariants(), className)}
      data-slot="chat-toolbar-stop-button"
      size="sm"
      type={type}
      variant="ghost"
      {...props}
    >
      {children ?? (
        <>
          <LucideSquare className="size-3.5" />
          <span className="sr-only">Stop generating</span>
        </>
      )}
    </Button>
  );
}

export function ChatToolbarMarkButton({
  children,
  disabled,
  format,
  tooltip,
}: {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly format: ChatComposerFormat;
  readonly tooltip: string;
}) {
  const composerEditor = useChatToolbarEditor("ChatToolbarMarkButton");
  const active = composerEditor.activeFormats[format];

  return (
    <ChatToolbarIconButton
      disabled={disabled}
      onClick={(event) => {
        if (event.detail === 0) composerEditor.toggleFormat(format);
      }}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        composerEditor.toggleFormat(format);
      }}
      pressed={active}
      tooltip={tooltip}
    >
      {children}
    </ChatToolbarIconButton>
  );
}

export function ChatToolbarCodeBlockButton({
  disabled,
}: {
  readonly disabled?: boolean;
}) {
  const composerEditor = useChatToolbarEditor("ChatToolbarCodeBlockButton");
  const active = composerEditor.isInsideCodeBlock;

  return (
    <ChatToolbarIconButton
      disabled={disabled}
      onClick={(event) => {
        if (event.detail === 0) composerEditor.toggleCodeBlock();
      }}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        composerEditor.toggleCodeBlock();
      }}
      pressed={active}
      tooltip={active ? "Remove Code Block" : "Code Block"}
    >
      <LucideCode2 />
    </ChatToolbarIconButton>
  );
}

export function ChatToolbarListButton({
  disabled,
}: {
  readonly disabled?: boolean;
}) {
  const composerEditor = useChatToolbarEditor("ChatToolbarListButton");
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <ChatToolbarIconButton
          disabled={disabled}
          pressed={open}
          tooltip="List"
        >
          <LucideList className="size-4" />
        </ChatToolbarIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => {
              composerEditor.toggleList("disc");
            }}
          >
            <div className="flex items-center gap-2">
              <LucideList className="size-4" /> Bulleted list
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              composerEditor.toggleList("decimal");
            }}
          >
            <div className="flex items-center gap-2">
              <LucideListOrdered className="size-4" /> Numbered list
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              composerEditor.toggleList("todo");
            }}
          >
            <div className="flex items-center gap-2">
              <LucideListTodo className="size-4" /> Todo list
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChatToolbarEmojiButton({
  disabled,
}: {
  readonly disabled?: boolean;
}) {
  const composerEditor = useChatToolbarEditor("ChatToolbarEmojiButton");
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = useCallback(
    ({ emoji }: { readonly emoji: string }) => {
      composerEditor.insertText(emoji);
      setIsOpen(false);
    },
    [composerEditor]
  );

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <ChatToolbarIconButton
          disabled={disabled}
          pressed={isOpen}
          onPointerEnter={preloadChatEmojiPicker}
          onFocus={preloadChatEmojiPicker}
          tooltip="Emoji"
        >
          <LucideSmile />
        </ChatToolbarIconButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <ChatEmojiPicker onEmojiSelect={handleEmojiSelect} />
      </PopoverContent>
    </Popover>
  );
}

export function ChatToolbarCodeLanguageDropdown({
  disabled,
}: {
  readonly disabled?: boolean;
}) {
  const composerEditor = useChatToolbarEditor(
    "ChatToolbarCodeLanguageDropdown"
  );
  const [open, setOpen] = useState(false);
  const currentLanguage = composerEditor.currentCodeLanguage;

  if (!currentLanguage) return null;

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex h-7 items-center gap-1 rounded-xs px-2 font-medium text-muted-foreground text-xs outline-none transition-[color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            open && "bg-accent text-accent-foreground"
          )}
          disabled={disabled}
          type="button"
        >
          <span className="max-w-24 truncate">
            {getCodeLanguageLabel(currentLanguage)}
          </span>
          <LucideChevronDown className="size-3 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 min-w-[180px] overflow-y-auto"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          composerEditor.focusEditor();
        }}
      >
        {CODE_LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => composerEditor.setCodeLanguage(option.value)}
            selected={option.value === currentLanguage}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
