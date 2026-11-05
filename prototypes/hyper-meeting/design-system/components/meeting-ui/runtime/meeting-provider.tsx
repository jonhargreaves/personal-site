"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
  type SetStateAction,
} from "react";

import * as Predicate from "../../../lib/predicate";

import type { MeetingRuntime, MeetingUiActions } from "./meeting-runtime";
import {
  defaultMeetingUiState,
  type MeetingMainView,
  type MeetingUiState,
} from "./meeting-state";

const MeetingActionsContext = createContext<MeetingUiActions | null>(null);
const MeetingStateStoreContext =
  createContext<MeetingUiStateContextValue | null>(null);

type MeetingUiStateStore = {
  readonly emitChange: () => void;
  readonly getSnapshot: () => MeetingUiState;
  readonly replaceState: (nextState: MeetingUiState) => boolean;
  readonly setState: (update: SetStateAction<MeetingUiState>) => void;
  readonly subscribe: (listener: () => void) => () => void;
};

type MeetingUiStateContextValue = {
  readonly controlledState: MeetingUiState | null;
  readonly stateStore: MeetingUiStateStore;
};

export type MeetingProviderProps = {
  readonly children: ReactNode;
  readonly defaultState?: Partial<MeetingUiState>;
  readonly runtime?: MeetingRuntime;
};

export function MeetingProvider({
  children,
  defaultState,
  runtime,
}: MeetingProviderProps) {
  const [initialUncontrolledState] = useState(() => ({
    ...defaultMeetingUiState,
    ...defaultState,
  }));
  const [stateStore] = useState(() =>
    createMeetingUiStateStore(initialUncontrolledState)
  );

  const setUncontrolledState = useCallback(
    (update: SetStateAction<MeetingUiState>) => {
      const nextState = Predicate.isFunction(update)
        ? update(stateStore.getSnapshot())
        : update;

      stateStore.setState(nextState);
    },
    [stateStore]
  );
  const uncontrolledActions = useMemo(
    () => createUncontrolledMeetingUiActions(setUncontrolledState),
    [setUncontrolledState]
  );
  const actions = runtime?.actions ?? uncontrolledActions;
  const controlledState = runtime?.state ?? null;
  const stateContextValue = useMemo(
    () => ({ controlledState, stateStore }),
    [controlledState, stateStore]
  );

  return (
    <MeetingActionsContext.Provider value={actions}>
      <MeetingStateStoreContext.Provider value={stateContextValue}>
        {children}
      </MeetingStateStoreContext.Provider>
    </MeetingActionsContext.Provider>
  );
}

function createMeetingUiStateStore(
  initialState: MeetingUiState
): MeetingUiStateStore {
  let state = initialState;
  const listeners = new Set<() => void>();

  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };
  const getSnapshot = () => state;
  const replaceState = (nextState: MeetingUiState) => {
    if (Object.is(nextState, state)) {
      return false;
    }

    state = nextState;
    return true;
  };
  const setState = (update: SetStateAction<MeetingUiState>) => {
    const nextState = Predicate.isFunction(update) ? update(state) : update;

    if (!replaceState(nextState)) {
      return;
    }

    emitChange();
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    emitChange,
    getSnapshot,
    replaceState,
    setState,
    subscribe,
  };
}

const optionalMeetingStateFallbackStore = createMeetingUiStateStore(
  defaultMeetingUiState
);
const optionalMeetingStateFallbackContext = {
  controlledState: null,
  stateStore: optionalMeetingStateFallbackStore,
} satisfies MeetingUiStateContextValue;
const selectMeetingState = (state: MeetingUiState): MeetingUiState => state;

/**
 * The shared note must have exactly one mounted editor: the "notes" side
 * panel and the "notes" main view each host a live OT client, so mounting
 * both would register the same participant twice (doubled carets and
 * subscriptions). Selecting either surface therefore releases the other.
 */
function withPanelSelection(
  current: MeetingUiState,
  panel: MeetingUiState["panel"],
  panelReturnTarget: MeetingUiState["panelReturnTarget"]
): MeetingUiState {
  return {
    ...current,
    mainView:
      panel === "notes" && current.mainView === "notes"
        ? defaultMeetingUiState.mainView
        : current.mainView,
    panel,
    panelReturnTarget,
  };
}

function createUncontrolledMeetingUiActions(
  setState: MeetingUiStateStore["setState"]
): MeetingUiActions {
  const setCaptionsOpen = (captionsOpen: boolean) => {
    setState((current) => ({ ...current, captionsOpen }));
  };
  const setCommandMenuOpen = (commandMenuOpen: boolean) => {
    setState((current) => ({ ...current, commandMenuOpen }));
  };

  return {
    closeCaptions: () => setCaptionsOpen(false),
    closeCommandMenu: () => setCommandMenuOpen(false),
    closeDevicePanel: () => {
      setState((current) => ({ ...current, activeDevicePanel: null }));
    },
    closeLeaveDialog: () => {
      setState((current) => ({ ...current, leaveDialogOpen: false }));
    },
    closePanel: () => {
      setState((current) => ({
        ...current,
        panel: null,
        panelReturnTarget: null,
      }));
    },
    closeSettings: () => {
      setState((current) => ({ ...current, settingsOpen: false }));
    },
    focusTile: (focusedTileId) => {
      setState((current) => ({ ...current, focusedTileId }));
    },
    openCaptions: () => setCaptionsOpen(true),
    openCommandMenu: () => setCommandMenuOpen(true),
    openDevicePanel: (activeDevicePanel) => {
      setState((current) => ({ ...current, activeDevicePanel }));
    },
    openLeaveDialog: () => {
      setState((current) => ({ ...current, leaveDialogOpen: true }));
    },
    openPanel: (panel) => {
      setState((current) => withPanelSelection(current, panel, null));
    },
    openPanelFrom: (panel, returnTarget) => {
      setState((current) =>
        withPanelSelection(
          current,
          panel,
          current.panel === returnTarget ? returnTarget : null
        )
      );
    },
    openSettings: (settingsSection = "general") => {
      setState((current) => ({
        ...current,
        settingsOpen: true,
        settingsSection,
      }));
    },
    pinTile: (pinnedTileId) => {
      setState((current) => ({ ...current, pinnedTileId }));
    },
    setCaptionsOpen,
    setCommandMenuOpen,
    setLeaveDialogOpen: (leaveDialogOpen) => {
      setState((current) => ({ ...current, leaveDialogOpen }));
    },
    setMainView: (mainView) => {
      setState((current) => {
        const closesNotesPanel =
          mainView === "notes" && current.panel === "notes";

        return {
          ...current,
          mainView,
          panel: closesNotesPanel ? null : current.panel,
          panelReturnTarget: closesNotesPanel
            ? null
            : current.panelReturnTarget,
        };
      });
    },
    setPanel: (panel) => {
      setState((current) => withPanelSelection(current, panel, null));
    },
    setPresentationMode: (presentationMode) => {
      setState((current) => ({ ...current, presentationMode }));
    },
    setSettingsOpen: (settingsOpen) => {
      setState((current) => ({ ...current, settingsOpen }));
    },
    setSettingsSection: (settingsSection) => {
      setState((current) => ({ ...current, settingsSection }));
    },
    setSidebarWidth: (sidebarWidth) => {
      setState((current) => ({ ...current, sidebarWidth }));
    },
    setStage: (stage) => {
      setState((current) => ({ ...current, stage }));
    },
    toggleCaptions: () => {
      setState((current) => ({
        ...current,
        captionsOpen: !current.captionsOpen,
      }));
    },
    toggleCommandMenu: () => {
      setState((current) => ({
        ...current,
        commandMenuOpen: !current.commandMenuOpen,
      }));
    },
    toggleDevicePanel: (activeDevicePanel) => {
      setState((current) => ({
        ...current,
        activeDevicePanel:
          current.activeDevicePanel === activeDevicePanel
            ? null
            : activeDevicePanel,
      }));
    },
    togglePanel: (panel) => {
      setState((current) =>
        withPanelSelection(
          current,
          current.panel === panel ? null : panel,
          null
        )
      );
    },
  };
}

function useMeetingActionsContext(componentName: string) {
  const actions = useContext(MeetingActionsContext);

  if (!actions) {
    throw new Error(`${componentName} must be used within MeetingProvider.`);
  }

  return actions;
}

function useMeetingStateContext(componentName: string) {
  const stateContext = useContext(MeetingStateStoreContext);

  if (!stateContext) {
    throw new Error(`${componentName} must be used within MeetingProvider.`);
  }

  return stateContext;
}

// Cache external-store selections outside React render logic. React requires
// getSnapshot to return the same value until the store's state changes.
function createSelectedSnapshot<T>(
  stateContext: MeetingUiStateContextValue,
  selector: (state: MeetingUiState) => T
) {
  let snapshot: { readonly state: MeetingUiState; readonly value: T } | null = null;
  return () => {
    const state = stateContext.controlledState ?? stateContext.stateStore.getSnapshot();
    if (snapshot?.state === state) return snapshot.value;
    const value = selector(state);
    snapshot = { state, value };
    return value;
  };
}

function useMeetingStoreValue<T>(
  stateContext: MeetingUiStateContextValue,
  selector: (state: MeetingUiState) => T
): T {
  const getSelectedSnapshot = useMemo(
    () => createSelectedSnapshot(stateContext, selector),
    [selector, stateContext]
  );

  return useSyncExternalStore(
    stateContext.stateStore.subscribe,
    getSelectedSnapshot,
    getSelectedSnapshot
  );
}

export function useMeetingRuntime(): MeetingRuntime {
  const actions = useMeetingActionsContext("useMeetingRuntime");
  const state = useMeetingState();

  return useMemo(() => ({ actions, state }), [actions, state]);
}

export function useOptionalMeetingRuntime(): MeetingRuntime | null {
  const actions = useContext(MeetingActionsContext);
  const state = useOptionalMeetingState();

  return useMemo(
    () => (actions && state ? { actions, state } : null),
    [actions, state]
  );
}

export function useMeetingActions() {
  return useMeetingActionsContext("useMeetingActions");
}

export function useMeetingMainView({
  screenShareAvailable,
  sharedNotesAvailable = true,
}: {
  readonly screenShareAvailable: boolean;
  readonly sharedNotesAvailable?: boolean;
}): MeetingMainView {
  const actions = useMeetingActions();
  const selectedView = useMeetingState((state) => state.mainView);
  const mainView =
    (selectedView === "screenshare" && !screenShareAvailable) ||
    (selectedView === "notes" && !sharedNotesAvailable)
      ? defaultMeetingUiState.mainView
      : selectedView;

  useEffect(() => {
    if (mainView !== selectedView) {
      actions.setMainView(mainView);
    }
  }, [actions, mainView, selectedView]);

  return mainView;
}

export function useOptionalMeetingActions() {
  return useContext(MeetingActionsContext);
}

export function useMeetingState(): MeetingUiState;
export function useMeetingState<T>(selector: (state: MeetingUiState) => T): T;
export function useMeetingState<T>(
  selector?: (state: MeetingUiState) => T
): MeetingUiState | T {
  const stateContext = useMeetingStateContext("useMeetingState");
  return useMeetingStoreValue<MeetingUiState | T>(
    stateContext,
    selector ?? selectMeetingState
  );
}

export function useOptionalMeetingState(): MeetingUiState | null;
export function useOptionalMeetingState<T>(
  selector: (state: MeetingUiState) => T
): T | null;
export function useOptionalMeetingState<T>(
  selector?: (state: MeetingUiState) => T
): MeetingUiState | T | null {
  const stateContext =
    useContext(MeetingStateStoreContext) ?? optionalMeetingStateFallbackContext;
  const selectedState = useMeetingStoreValue<MeetingUiState | T>(
    stateContext,
    selector ?? selectMeetingState
  );

  return stateContext === optionalMeetingStateFallbackContext
    ? null
    : selectedState;
}
