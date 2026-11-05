"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { CallControlsContextValue } from "./types";

const CallControlsContext = createContext<CallControlsContextValue | null>(
  null
);

function CallControlsProvider({
  children,
  value,
}: {
  readonly children: ReactNode;
  readonly value: CallControlsContextValue;
}) {
  return (
    <CallControlsContext.Provider value={value}>
      {children}
    </CallControlsContext.Provider>
  );
}

function useOptionalCallControls() {
  return useContext(CallControlsContext);
}

function useCallControls(componentName = "useCallControls") {
  const context = useContext(CallControlsContext);

  if (!context) {
    throw new Error(`${componentName} must be rendered inside CallControls.`);
  }

  return context;
}

export { CallControlsProvider, useCallControls, useOptionalCallControls };
