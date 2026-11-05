import { createContext, type ReactNode, useContext } from "react";

import type {
  MobileCallControlsController,
  MobileCallControlsProps,
} from "./mobile-call-controls-controller";

export type MobileCallControlsContextValue = Omit<
  MobileCallControlsProps,
  "children"
> & {
  controller: MobileCallControlsController;
};

const MobileCallControlsContext =
  createContext<MobileCallControlsContextValue | null>(null);

export function MobileCallControlsProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MobileCallControlsContextValue;
}) {
  return (
    <MobileCallControlsContext.Provider value={value}>
      {children}
    </MobileCallControlsContext.Provider>
  );
}

export function useMobileCallControlsContext(componentName: string) {
  return useMobileCallControls(componentName);
}

export function useOptionalMobileCallControls() {
  return useContext(MobileCallControlsContext);
}

export function useMobileCallControls(componentName = "useMobileCallControls") {
  const context = useContext(MobileCallControlsContext);

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside CallControls.MobileControls.`
    );
  }

  return context;
}
