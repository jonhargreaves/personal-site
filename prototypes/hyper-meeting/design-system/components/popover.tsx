"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type * as React from "react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as Predicate from "../lib/predicate";
import { cn } from "../lib/utils";

import {
  anchoredPopupMotionClassName,
  popupMotionClassName,
} from "./primitive/popup-motion";
import { Slot } from "./primitive/slot";

type SlottableProps<T> = T & {
  asChild?: boolean;
};

type PopoverOpenChangeHandler = NonNullable<
  React.ComponentProps<typeof PopoverPrimitive.Root>["onOpenChange"]
>;

type PopoverInteractOutsideEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
  target: EventTarget | null;
};

type PopoverCompatContextValue = {
  anchor: Element | null;
  onInteractOutsideRef: React.MutableRefObject<
    ((event: PopoverInteractOutsideEvent) => void) | undefined
  >;
  setAnchor: (value: Element | null) => void;
};

type RadixPopoverCompatStyle = React.CSSProperties &
  Record<
    | "--radix-popover-content-available-height"
    | "--radix-popover-content-available-width"
    | "--radix-popover-content-transform-origin"
    | "--radix-popover-trigger-width",
    string
  >;

const RADIX_POPOVER_COMPAT_CSS_VARS: RadixPopoverCompatStyle = {
  "--radix-popover-content-available-height": "var(--available-height)",
  "--radix-popover-content-available-width": "var(--available-width)",
  "--radix-popover-content-transform-origin": "var(--transform-origin)",
  "--radix-popover-trigger-width": "var(--anchor-width)",
  zIndex: 60,
};

const PopoverCompatContext = createContext<PopoverCompatContextValue | null>(
  null
);

function createPreventableEvent(
  target: EventTarget | null
): PopoverInteractOutsideEvent {
  const event = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true;
    },
    target,
  };

  return event;
}

function Popover({
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [anchor, setAnchor] = useState<Element | null>(null);
  const onInteractOutsideRef = useRef<
    ((event: PopoverInteractOutsideEvent) => void) | undefined
  >(undefined);
  const contextValue = useMemo(
    () => ({
      anchor,
      onInteractOutsideRef,
      setAnchor,
    }),
    [anchor]
  );

  const handleOpenChange: PopoverOpenChangeHandler = (open, eventDetails) => {
    const eventTarget = eventDetails.event?.target ?? null;
    const isAnchorPress =
      !open &&
      eventDetails.reason === "outside-press" &&
      eventTarget instanceof Node &&
      anchor?.contains(eventTarget);

    if (isAnchorPress) {
      eventDetails.cancel();
      return;
    }

    if (
      !open &&
      eventDetails.reason === "outside-press" &&
      onInteractOutsideRef.current
    ) {
      const event = createPreventableEvent(eventTarget);
      onInteractOutsideRef.current(event);

      if (event.defaultPrevented) {
        eventDetails.cancel();
        return;
      }
    }

    onOpenChange?.(open, eventDetails);
  };

  return (
    <PopoverCompatContext.Provider value={contextValue}>
      <PopoverPrimitive.Root
        data-slot="popover"
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopoverCompatContext.Provider>
  );
}

function PopoverTrigger({
  asChild = false,
  render,
  ...props
}: SlottableProps<React.ComponentProps<typeof PopoverPrimitive.Trigger>>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      render={asChild ? <Slot /> : render}
      {...props}
    />
  );
}

type PopoverContentProps = Omit<
  React.ComponentProps<typeof PopoverPrimitive.Popup>,
  "children"
> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    | "align"
    | "alignOffset"
    | "anchor"
    | "arrowPadding"
    | "collisionAvoidance"
    | "collisionBoundary"
    | "collisionPadding"
    | "disableAnchorTracking"
    | "positionMethod"
    | "side"
    | "sideOffset"
    | "sticky"
  > & {
    children?: React.ReactNode;
    onInteractOutside?: (event: PopoverInteractOutsideEvent) => void;
    unmountOnHide?: boolean;
  };

function PopoverContent({
  align,
  alignOffset,
  anchor,
  arrowPadding,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  className,
  disableAnchorTracking,
  onInteractOutside,
  positionMethod,
  side = "bottom",
  sideOffset = 4,
  sticky,
  unmountOnHide,
  ...props
}: PopoverContentProps) {
  const context = useContext(PopoverCompatContext);

  useEffect(() => {
    if (!context) return undefined;
    // Update the shared imperative event bridge, not a React context value.
    // eslint-disable-next-line react-hooks/immutability
    context.onInteractOutsideRef.current = onInteractOutside;

    return () => {
      if (context.onInteractOutsideRef.current === onInteractOutside) {
        context.onInteractOutsideRef.current = undefined;
      }
    };
  }, [context, onInteractOutside]);

  const resolvedAnchor = anchor ?? context?.anchor ?? undefined;

  return (
    <PopoverPrimitive.Portal keepMounted={unmountOnHide === false}>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={resolvedAnchor}
        arrowPadding={arrowPadding}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        disableAnchorTracking={disableAnchorTracking}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
        style={RADIX_POPOVER_COMPAT_CSS_VARS}
      >
        <PopoverPrimitive.Popup
          className={cn(
            popupMotionClassName,
            anchoredPopupMotionClassName,
            "z-50 max-h-(--radix-popover-content-available-height) w-72 origin-(--radix-popover-content-transform-origin) rounded-xl border border-border bg-popover p-4 text-foreground shadow-lg outline-hidden backdrop-blur-md",
            className
          )}
          data-slot="popover-content"
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

const PopoverAnchor = forwardRef<
  HTMLElement,
  SlottableProps<React.HTMLAttributes<HTMLElement>>
>(function PopoverAnchor(
  {
    asChild = false,
    onFocus,
    onMouseEnter,
    onPointerDown,
    onPointerEnter,
    ...props
  },
  forwardedRef
) {
  const context = useContext(PopoverCompatContext);
  const Comp = asChild ? Slot : "div";

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      // Ignore null ref-cleanup calls to avoid anchor churn when callback refs
      // are re-created during context updates.
      if (node && context && context.anchor !== node) {
        context.setAnchor(node);
      }

      if (Predicate.isFunction(forwardedRef)) {
        forwardedRef(node);
        return;
      }

      if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [context, forwardedRef]
  );

  return (
    <Comp
      data-slot="popover-anchor"
      onFocus={(event: React.FocusEvent<HTMLElement>) => {
        if (context?.anchor !== event.currentTarget) {
          context?.setAnchor(event.currentTarget);
        }
        onFocus?.(event);
      }}
      onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
        if (context?.anchor !== event.currentTarget) {
          context?.setAnchor(event.currentTarget);
        }
        onMouseEnter?.(event);
      }}
      onPointerDown={(event: React.PointerEvent<HTMLElement>) => {
        if (context?.anchor !== event.currentTarget) {
          context?.setAnchor(event.currentTarget);
        }
        onPointerDown?.(event);
      }}
      onPointerEnter={(event: React.PointerEvent<HTMLElement>) => {
        if (context?.anchor !== event.currentTarget) {
          context?.setAnchor(event.currentTarget);
        }
        onPointerEnter?.(event);
      }}
      ref={setRef}
      {...props}
    />
  );
});

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
