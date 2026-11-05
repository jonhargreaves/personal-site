"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Notify uncontrolled changes after commit; controlled values stay caller-owned. */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
}): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultProp);
  const previousValue = useRef(internalValue);
  const controlled = prop !== undefined;

  useEffect(() => {
    if (!Object.is(previousValue.current, internalValue)) {
      previousValue.current = internalValue;
      onChange?.(internalValue);
    }
  }, [internalValue, onChange]);

  const setValue = useCallback(
    (nextValue: T) => {
      if (controlled) {
        if (!Object.is(prop, nextValue)) onChange?.(nextValue);
      } else {
        setInternalValue(nextValue);
      }
    },
    [controlled, onChange, prop]
  );

  return [controlled ? prop : internalValue, setValue];
}
