"use client";

function getPointerTargetElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) {
    return target;
  }

  if (globalThis.Node !== undefined && target instanceof globalThis.Node) {
    return target.parentElement;
  }

  return null;
}

export function shouldFocusChatComposerInputFromPointerTarget(
  target: EventTarget | null
) {
  const targetElement = getPointerTargetElement(target);

  return !targetElement?.closest("[data-editate-block]");
}
