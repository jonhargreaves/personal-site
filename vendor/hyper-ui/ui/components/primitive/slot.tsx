"use client";

import { useRender } from "@base-ui/react/use-render";
import { Children, isValidElement, type HTMLAttributes, type Ref } from "react";

type SlotProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

/** Keeps the existing asChild API while Base UI composes props and refs. */
export function Slot({ children, ref, ...props }: SlotProps) {
  const child = isValidElement(children) ? children : undefined;
  if (Children.count(children) > 1) {
    Children.only(children);
  }

  return useRender({
    render: child,
    enabled: child !== undefined,
    ref,
    props,
  });
}
