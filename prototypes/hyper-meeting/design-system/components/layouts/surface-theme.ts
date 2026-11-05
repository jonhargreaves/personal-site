"use client";

import { createContext, useContext } from "react";

/** Carries a local surface theme across portaled controls. */
export const SurfaceThemeContext = createContext<"dark" | "light" | undefined>(
  undefined
);
export function useSurfaceTheme() {
  return useContext(SurfaceThemeContext);
}
