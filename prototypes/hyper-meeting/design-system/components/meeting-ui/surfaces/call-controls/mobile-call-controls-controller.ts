import { type ReactNode, useCallback, useRef, useState } from "react";

import type { AnimatedIconHandle } from "./icons";
import type {
  MobileSheetDirection,
  MobileSheetView,
} from "./mobile-call-controls-sheet";
import { getControlSizeClasses, useTimedIconAnimation } from "./shared";
import type { ButtonVariant, ControlSize } from "./types";

export interface MobileCallControlsProps {
  children: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  prefersReducedMotion: boolean;
  size: ControlSize;
  variant: ButtonVariant;
}

export interface MobileCallControlsSelectedSheetItem {
  content: ReactNode;
  id: string;
  label: string;
}

function getMobileCallControlsIconSize(size: ControlSize) {
  return size === "lg" ? "size-5.5" : "size-5";
}

export function useMobileCallControlsController({
  defaultOpen = false,
  onOpenChange,
  open,
  prefersReducedMotion,
  size,
}: Pick<
  MobileCallControlsProps,
  "defaultOpen" | "onOpenChange" | "open" | "prefersReducedMotion" | "size"
>) {
  const { buttonSize } = getControlSizeClasses(size);
  const sheetIconSize = getMobileCallControlsIconSize(size);
  const moreIconRef = useRef<AnimatedIconHandle | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [selectedItem, setSelectedItem] =
    useState<MobileCallControlsSelectedSheetItem | null>(null);
  const [sheetDirection, setSheetDirection] = useState<MobileSheetDirection>(1);
  const [sheetHeight, setSheetHeight] = useState<number | "auto">("auto");
  const [sheetView, setSheetView] = useState<MobileSheetView>("root");
  const drawerOpen = open ?? uncontrolledOpen;

  const resetSheetState = useCallback(() => {
    setSelectedItem(null);
    setSheetDirection(-1);
    setSheetHeight("auto");
    setSheetView("root");
  }, []);

  const [previousDrawerOpen, setPreviousDrawerOpen] = useState(drawerOpen);
  if (drawerOpen !== previousDrawerOpen) {
    setPreviousDrawerOpen(drawerOpen);
    if (!drawerOpen) resetSheetState();
  }

  const setNextSheetView = useCallback(
    (nextView: MobileSheetView, direction: MobileSheetDirection) => {
      if (nextView === "root") {
        setSelectedItem(null);
      }

      setSheetDirection(direction);
      setSheetView(nextView);
    },
    []
  );

  const handleDrawerChange = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open]
  );

  return {
    buttonSize,
    closeDrawer: () => handleDrawerChange(false),
    drawerOpen,
    handleDrawerChange,
    moreIconRef,
    openItemSheet: (item: MobileCallControlsSelectedSheetItem) => {
      setSelectedItem(item);
      setNextSheetView("item", 1);
    },
    openCameraSheet: () => setNextSheetView("camera", 1),
    openMicrophoneSheet: () => setNextSheetView("microphone", 1),
    playMoreAnimation: useTimedIconAnimation(moreIconRef, prefersReducedMotion),
    selectedItem,
    setSheetHeight,
    sheetDirection,
    sheetHeight,
    sheetIconSize,
    sheetView,
    showRootSheet: () => setNextSheetView("root", -1),
  };
}

export type MobileCallControlsController = ReturnType<
  typeof useMobileCallControlsController
>;
