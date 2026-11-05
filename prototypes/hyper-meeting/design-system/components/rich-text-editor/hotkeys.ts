import isHotkeyImport from "is-hotkey";

import * as Predicate from "../../lib/predicate";

type HotkeyMatcher = (
  hotkey: string | string[],
  event: KeyboardEvent
) => boolean;

function resolveHotkeyMatcher(): HotkeyMatcher {
  if (Predicate.isFunction(isHotkeyImport)) {
    // SAFETY: is-hotkey's CommonJS entry exports this documented two-argument
    // matcher directly; the runtime function check selects that export shape.
    return isHotkeyImport as HotkeyMatcher;
  }

  // SAFETY: supported bundlers may wrap the same is-hotkey CommonJS entry as a
  // module object exposing either default or isHotkey; both are checked below.
  const moduleLike = isHotkeyImport as {
    default?: unknown;
    isHotkey?: unknown;
  };

  if (Predicate.isFunction(moduleLike.default)) {
    // SAFETY: the function check establishes that the documented default export
    // is callable; is-hotkey defines its parameters as hotkey and KeyboardEvent.
    return moduleLike.default as HotkeyMatcher;
  }

  if (Predicate.isFunction(moduleLike.isHotkey)) {
    // SAFETY: the function check establishes that the documented named export
    // is callable; is-hotkey defines its parameters as hotkey and KeyboardEvent.
    return moduleLike.isHotkey as HotkeyMatcher;
  }

  return () => false;
}

export const isHotkey = resolveHotkeyMatcher();
