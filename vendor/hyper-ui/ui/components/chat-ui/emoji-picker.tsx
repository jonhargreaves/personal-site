"use client";

import { type ComponentProps, useEffect, useState } from "react";

import type { EmojiPickerCompact } from "../emoji-picker";

let loadedPicker: typeof EmojiPickerCompact | null = null;

function loadChatEmojiPicker() {
  return import("../emoji-picker").then((module) => {
    loadedPicker = module.EmojiPickerCompact;
    return loadedPicker;
  });
}

/** Start on pointer/focus intent; a failed preload can be retried on open. */
export function preloadChatEmojiPicker() {
  void loadChatEmojiPicker().catch(() => {});
}

/** Only mounted inside the open popover, so loading cannot delay the editor. */
export function ChatEmojiPicker(
  props: ComponentProps<typeof EmojiPickerCompact>
) {
  const [picker, setPicker] = useState(() => loadedPicker);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (picker) return;
    let active = true;
    void loadChatEmojiPicker().then(
      (component) => {
        if (active) setPicker(() => component);
      },
      () => {
        if (active) setFailed(true);
      }
    );
    return () => {
      active = false;
    };
  }, [attempt, picker]);

  if (picker) {
    const Picker = picker;
    return <Picker {...props} />;
  }

  return (
    <div className="flex h-[320px] w-[320px] flex-col items-center justify-center gap-3 rounded-lg border bg-popover text-muted-foreground text-sm shadow-md">
      <span role="status">
        {failed ? "Could not load emojis." : "Loading emojis…"}
      </span>
      {failed ? (
        <button
          autoFocus
          className="rounded-md px-3 py-2 text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
          type="button"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
