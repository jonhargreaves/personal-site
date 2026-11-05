/** Base UI retains the element while these starting/ending styles transition. */
export const popupMotionClassName =
  "transition-[opacity,scale,translate] duration-200 ease-out data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:duration-150 motion-reduce:transition-none motion-reduce:scale-100!";

/** Enter from the anchor; exits stay nearby and yield attention to the next task. */
export const anchoredPopupMotionClassName =
  "data-starting-style:data-[side=bottom]:-translate-y-2 data-starting-style:data-[side=top]:translate-y-2 data-starting-style:data-[side=left]:translate-x-2 data-starting-style:data-[side=inline-start]:translate-x-2 data-starting-style:data-[side=right]:-translate-x-2 data-starting-style:data-[side=inline-end]:-translate-x-2 motion-reduce:translate-none!";

export const backdropMotionClassName =
  "transition-opacity duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 motion-reduce:transition-none";
